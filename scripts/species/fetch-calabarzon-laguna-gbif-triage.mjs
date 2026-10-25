import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  CHECKLIST_KEY,
  classifyResponse,
  queryFor,
  ENDPOINT as TAXONOMY_ENDPOINT,
  validateServiceMetadata,
} from "./match-freshwater-taxonomy.mjs";

const root = new URL("../../", import.meta.url);
const screenUrl = new URL("data/research/philippines/calabarzon-inland-gbif-screen-20261025.json", root);
const reviewUrl = new URL("data/research/philippines/calabarzon-laguna-gbif-triage-20261025.json", root);
const rawDirectory = new URL("data/research/philippines/raw/calabarzon-laguna-gbif-triage-20261025/", root);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const canonicalSpeciesName = (value) => value.split(/\s+/).slice(0, 2).join(" ");
const normalizeLicense = (value) => {
  if (value?.includes("publicdomain/zero/1.0")) return "CC0-1.0";
  if (value?.includes("by-nc/4.0")) return "CC-BY-NC-4.0";
  if (value?.includes("by/4.0")) return "CC-BY-4.0";
  return value ?? "unknown";
};

async function fetchJSON(url) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public source triage)" },
        signal: AbortSignal.timeout(30000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      const body = JSON.parse(bytes.toString("utf8"));
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${body.message ?? response.statusText}`);
      return { body, bytes };
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await wait(1000 * (attempt + 1));
    }
  }
  throw lastError;
}

async function saveRaw(fileName, bytes) {
  await writeFile(new URL(fileName, rawDirectory), bytes);
  return {
    path: `raw/calabarzon-laguna-gbif-triage-20261025/${fileName}`,
    bytes: bytes.length,
    sha256: hash(bytes),
  };
}

function dispositionFor(record, taxonomyMatch, dataset) {
  const holds = [];
  if (record.waterBody && !/laguna\s+de\s+bay/i.test(record.waterBody)) holds.push("waterBody-field-conflict");
  if (!record.locality || !/laguna\s+de\s+bay/i.test(record.locality))
    holds.push("locality-does-not-name-laguna-de-bay");
  if (!record.eventDate) holds.push("event-date-missing");
  if (normalizeLicense(record.license) === "CC-BY-NC-4.0") holds.push("noncommercial-license-fit-unresolved");
  if (record.license !== dataset.license) holds.push("record-and-dataset-license-differ");
  if (taxonomyMatch.classification !== "exact-species" && taxonomyMatch.classification !== "synonym")
    holds.push("catalogue-taxonomy-match-needs-review");
  if (record.issues.some((issue) => /INSTITUTION|TAXON_MATCH_HIGHERRANK|TAXON_MATCH_FUZZY/.test(issue)))
    holds.push("source-or-taxonomy-quality-flag");
  return {
    status: holds.length === 0 ? "candidate-for-independent-locality-review" : "held-for-review",
    holds,
    interpretation:
      "Triage flags prioritize manual review; they do not decide presence, identity, or reuse permission.",
  };
}

async function main() {
  const screenBytes = await readFile(screenUrl);
  const screen = JSON.parse(screenBytes.toString("utf8"));
  assert.equal(screen.status, "exact-name-text-screen-complete;returned-records-unreviewed");
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const lagunaRecords = screen.records.filter((record) =>
    record.queryMatches.some((match) => match.scopeLeadId === "ph-wb-laguna-de-bay"),
  );
  const speciesRecords = lagunaRecords.filter((record) => record.rank === "SPECIES");
  const taxonomyCandidates = [
    ...new Map(
      speciesRecords.map((record) => {
        const id = `${record.scientificName}|${record.family}`;
        return [
          id,
          {
            id: `laguna-gbif:${hash(id).slice(0, 20)}`,
            recordedName: record.scientificName,
            recordedFamily: record.family,
            candidateName: canonicalSpeciesName(record.acceptedScientificName),
            gbifAcceptedName: record.acceptedScientificName,
            gbifAcceptedTaxonKey: record.acceptedTaxonKey,
            gbifRecordedTaxonKey: record.taxonKey,
            gbifRecordIds: speciesRecords
              .filter(
                (candidate) => candidate.scientificName === record.scientificName && candidate.family === record.family,
              )
              .map((candidate) => candidate.gbifId)
              .sort((left, right) => left - right),
          },
        ];
      }),
    ).values(),
  ].sort((left, right) => left.recordedName.localeCompare(right.recordedName));

  const datasetKeys = [...new Set(lagunaRecords.map((record) => record.datasetKey))].sort();
  const datasets = [];
  for (const key of datasetKeys) {
    const url = `https://api.gbif.org/v1/dataset/${key}`;
    const { body, bytes } = await fetchJSON(url);
    assert.equal(body.key, key);
    const rawResponse = await saveRaw(`dataset-${key}.json`, bytes);
    datasets.push({
      key,
      title: body.title,
      doi: body.doi ?? null,
      license: body.license ?? null,
      publisherKey: body.publishingOrganizationKey ?? null,
      homepage: body.homepage ?? body.url ?? null,
      datasetUrl: `https://www.gbif.org/dataset/${key}`,
      apiUrl: url,
      rawResponse,
      candidateRecordCount: lagunaRecords.filter((record) => record.datasetKey === key).length,
      speciesRankRecordCount: speciesRecords.filter((record) => record.datasetKey === key).length,
    });
    await wait(250);
  }
  const datasetsByKey = new Map(datasets.map((dataset) => [dataset.key, dataset]));

  const metadataUrl = `${TAXONOMY_ENDPOINT}/metadata?checklistKey=${CHECKLIST_KEY}`;
  const metadata = await fetchJSON(metadataUrl);
  validateServiceMetadata(metadata.body);
  const metadataReceipt = await saveRaw("col-xr-service-metadata.json", metadata.bytes);
  const metadataSha256 = hash(metadata.bytes);

  const taxonomyMatches = [];
  for (const candidate of taxonomyCandidates) {
    const query = queryFor(candidate);
    const url = `${TAXONOMY_ENDPOINT}?${new URLSearchParams(query)}`;
    const { body, bytes } = await fetchJSON(url);
    const classification = classifyResponse(candidate, body);
    const rawResponse = await saveRaw(`taxonomy-${candidate.id.replaceAll(":", "-")}.json`, bytes);
    taxonomyMatches.push({
      ...candidate,
      query,
      url,
      response: classification,
      rawResponse,
    });
    await wait(600);
  }
  const endMetadata = await fetchJSON(metadataUrl);
  validateServiceMetadata(endMetadata.body);
  const endMetadataSha256 = hash(endMetadata.bytes);
  const taxonomyIndexStable = metadataSha256 === endMetadataSha256;
  const taxonomyByRecordName = new Map(
    taxonomyMatches.map((match) => [`${match.recordedName}|${match.recordedFamily}`, match.response]),
  );
  const datasetSummary = datasets.map((dataset) => ({
    key: dataset.key,
    title: dataset.title,
    doi: dataset.doi,
    apiLicense: dataset.license,
    recordLicenseCounts: [
      ...new Set(lagunaRecords.filter((record) => record.datasetKey === dataset.key).map((record) => record.license)),
    ]
      .sort()
      .map((license) => ({
        license,
        count: lagunaRecords.filter((record) => record.datasetKey === dataset.key && record.license === license).length,
      })),
    recordCount: dataset.candidateRecordCount,
    speciesRankRecordCount: dataset.speciesRankRecordCount,
    licenseReconcilesAllRows: lagunaRecords
      .filter((record) => record.datasetKey === dataset.key)
      .every((record) => record.license === dataset.license),
  }));
  const recordReviews = lagunaRecords.map((record) => {
    const dataset = datasetsByKey.get(record.datasetKey);
    const taxonomyMatch = taxonomyByRecordName.get(`${record.scientificName}|${record.family}`);
    const disposition =
      record.rank === "SPECIES" && taxonomyMatch
        ? dispositionFor(record, taxonomyMatch, dataset)
        : {
            status: "excluded-from-species-candidate-queue",
            holds: [record.rank === "SPECIES" ? "taxonomy-response-missing" : "below-species-rank"],
            interpretation: "Does not constitute a species assertion.",
          };
    return {
      gbifId: record.gbifId,
      occurrenceUrl: `https://www.gbif.org/occurrence/${record.gbifId}`,
      rank: record.rank,
      scientificName: record.scientificName,
      acceptedScientificName: record.acceptedScientificName,
      family: record.family,
      acceptedTaxonKey: record.acceptedTaxonKey,
      datasetKey: record.datasetKey,
      basisOfRecord: record.basisOfRecord,
      eventDate: record.eventDate,
      waterBody: record.waterBody,
      locality: record.locality,
      license: record.license,
      issues: record.issues,
      taxonomyClassification: taxonomyMatch?.classification ?? null,
      disposition,
    };
  });

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-laguna-gbif-triage-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: { id: "ph-wb-laguna-de-bay", name: "Laguna de Bay", kind: "lake" },
    status: "dataset-rights-and-COL-XR-crosswalk-reviewed;record-admission-pending",
    screenInput: {
      file: "calabarzon-inland-gbif-screen-20261025.json",
      sha256: hash(screenBytes),
      uniqueRecordCount: lagunaRecords.length,
      speciesRankRecordCount: speciesRecords.length,
      acceptedGbifTaxonKeys: new Set(speciesRecords.map((record) => record.acceptedTaxonKey)).size,
    },
    taxonomyAuthority: {
      id: "gbif-col-xr-taxonomy-matching",
      checklistKey: CHECKLIST_KEY,
      endpoint: TAXONOMY_ENDPOINT,
      metadataUrl,
      metadataSha256,
      metadataRawResponse: metadataReceipt,
      indexStableDuringRun: taxonomyIndexStable,
      endMetadataSha256,
      matchingIndex: {
        datasetTitle: metadata.body.mainIndex.datasetTitle,
        datasetAlias: metadata.body.mainIndex.datasetAlias,
        buildCreated: metadata.body.created,
        buildSha: metadata.body.buildInfo.sha,
      },
      queryCount: taxonomyMatches.length,
      matches: taxonomyMatches,
      note: "COL XR matching is an automated name proposal, not expert certification or independent source-locality evidence.",
    },
    datasets,
    datasetSummary,
    recordReviews,
    summary: {
      datasetCount: datasets.length,
      datasetLicenses: [...new Set(datasets.map((dataset) => dataset.license))].sort(),
      datasetLicenseMismatches: datasetSummary.filter((dataset) => !dataset.licenseReconcilesAllRows).length,
      speciesCandidateRecords: speciesRecords.length,
      distinctRecordedNameFamilyPairs: taxonomyMatches.length,
      acceptedColTaxa: new Set(
        taxonomyMatches
          .map((match) => match.response.proposedAcceptedUsage?.usageKey ?? match.response.proposedUsage?.usageKey)
          .filter(Boolean),
      ).size,
      colIndexStableDuringRun: taxonomyIndexStable,
      taxonomyClassifications: Object.entries(
        taxonomyMatches.reduce((counts, match) => {
          const type = match.response.classification;
          counts[type] = (counts[type] ?? 0) + 1;
          return counts;
        }, {}),
      )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([classification, count]) => ({ classification, count })),
      recordDispositionCounts: Object.entries(
        recordReviews.reduce((counts, record) => {
          counts[record.disposition.status] = (counts[record.disposition.status] ?? 0) + 1;
          return counts;
        }, {}),
      )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([status, count]) => ({ status, count })),
    },
    decision: {
      admittedSpeciesAssertions: 0,
      publicRecordsAdded: 0,
      coordinatesIncluded: false,
      publicAdmission: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "Dataset-level rights and COL XR name comparisons help prioritize the Laguna de Bay specimens, but they do not replace record-by-record locality review, a separate taxonomic authority check, or a decision about product use. All 51 species-rank rows remain research candidates; no zero, flag or missing field is treated as absence.",
    },
  };

  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Saved dataset and taxonomy triage for ${recordReviews.length} records across ${datasets.length} datasets; ${speciesRecords.length} species-rank records remain research-only.`,
  );
}

main().catch((error) => {
  console.error(`CALABARZON Laguna de Bay GBIF triage failed: ${error.message}`);
  process.exitCode = 1;
});
