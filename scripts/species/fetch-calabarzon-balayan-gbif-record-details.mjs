import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const rawSearchUrl = new URL(
  "data/research/philippines/raw/gbif-calabarzon-colxr-actinopterygii-rerun-20261024/balayan-bay.json",
  root,
);
const reviewUrl = new URL("data/research/philippines/calabarzon-balayan-gbif-record-details-20261025.json", root);
const rawDirectory = new URL("data/research/philippines/raw/calabarzon-balayan-gbif-record-details-20261025/", root);
const apiDocsUrl = "https://techdocs.gbif.org/en/openapi/v1/occurrence";
const issueDocsUrl = "https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags";
const wait = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function getJson(url, label) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (GBIF record review)" },
        signal: AbortSignal.timeout(30000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      const body = JSON.parse(bytes.toString("utf8"));
      if (!response.ok) throw new Error(`${label}: HTTP ${response.status}: ${body.message ?? response.statusText}`);
      return { body, bytes };
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await wait(1000 * (attempt + 1));
    }
  }
  throw lastError;
}

function selectedFields(record) {
  return {
    gbifId: String(record.key),
    datasetKey: record.datasetKey,
    rank: record.taxonRank,
    basisOfRecord: record.basisOfRecord,
    scientificName: record.scientificName,
    acceptedScientificName: record.acceptedScientificName ?? null,
    taxonKey: record.taxonKey ?? null,
    acceptedTaxonKey: record.acceptedTaxonKey ?? null,
    eventDate: record.eventDate ?? null,
    country: record.country ?? null,
    stateProvince: record.stateProvince ?? null,
    county: record.county ?? null,
    waterBody: record.waterBody ?? null,
    locality: record.locality ?? null,
    license: record.license ?? null,
    occurrenceId: record.occurrenceID ?? null,
    institutionCode: record.institutionCode ?? null,
    collectionCode: record.collectionCode ?? null,
    catalogNumber: record.catalogNumber ?? null,
    issues: [...(record.issues ?? [])].sort(),
  };
}

async function main() {
  const searchBytes = await readFile(rawSearchUrl);
  const search = JSON.parse(searchBytes.toString("utf8"));
  assert.equal(search.count, 14, "Refresh the bounded Balayan Bay search before changing this reviewed batch.");
  assert.equal(search.results.length, search.count);
  assert.ok(search.results.every((record) => record.locality === "Balayan Bay"));
  const candidates = [...new Map(search.results.map((record) => [String(record.gbifID), record])).values()];
  assert.equal(candidates.length, 14);
  const datasetKeys = [...new Set(candidates.map((record) => record.datasetKey))].sort();
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const datasets = [];
  for (const key of datasetKeys) {
    const url = `https://api.gbif.org/v1/dataset/${key}`;
    const { body, bytes } = await getJson(url, `GBIF dataset ${key}`);
    const rawName = `dataset-${key}.json`;
    await writeFile(new URL(rawName, rawDirectory), bytes);
    datasets.push({
      datasetKey: key,
      title: body.title ?? null,
      type: body.type ?? null,
      license: body.license ?? null,
      rights: body.rights ?? null,
      doi: body.doi ?? null,
      citation: body.citation ?? null,
      rawResponse: {
        path: `raw/calabarzon-balayan-gbif-record-details-20261025/${rawName}`,
        bytes: bytes.length,
        sha256: sha256(bytes),
      },
    });
    await wait(150);
  }
  const datasetByKey = new Map(datasets.map((dataset) => [dataset.datasetKey, dataset]));

  const records = [];
  for (const candidate of candidates) {
    const id = String(candidate.gbifID);
    const url = `https://api.gbif.org/v1/occurrence/${id}`;
    const { body, bytes } = await getJson(url, `GBIF occurrence ${id}`);
    assert.equal(String(body.key), id);
    const rawName = `occurrence-${id}.json`;
    await writeFile(new URL(rawName, rawDirectory), bytes);
    const detail = selectedFields(body);
    const comparedFields = [
      "gbifId",
      "datasetKey",
      "rank",
      "basisOfRecord",
      "scientificName",
      "acceptedScientificName",
      "eventDate",
      "waterBody",
      "locality",
      "license",
      "occurrenceId",
      "institutionCode",
      "collectionCode",
      "catalogNumber",
      "issues",
    ];
    const candidateFields = {
      gbifId: id,
      datasetKey: candidate.datasetKey,
      rank: candidate.taxonRank,
      basisOfRecord: candidate.basisOfRecord,
      scientificName: candidate.scientificName,
      acceptedScientificName: candidate.acceptedScientificName ?? null,
      eventDate: candidate.eventDate ?? null,
      waterBody: candidate.waterBody ?? null,
      locality: candidate.locality ?? null,
      license: candidate.license ?? null,
      occurrenceId: candidate.occurrenceID ?? null,
      institutionCode: candidate.institutionCode ?? null,
      collectionCode: candidate.collectionCode ?? null,
      catalogNumber: candidate.catalogNumber ?? null,
      issues: [...(candidate.issues ?? [])].sort(),
    };
    const mismatchedFields = comparedFields.filter(
      (field) => JSON.stringify(detail[field]) !== JSON.stringify(candidateFields[field]),
    );
    records.push({
      ...detail,
      datasetTitle: datasetByKey.get(detail.datasetKey)?.title ?? null,
      datasetLicense: datasetByKey.get(detail.datasetKey)?.license ?? null,
      datasetRights: datasetByKey.get(detail.datasetKey)?.rights ?? null,
      occurrenceUrl: url.replace("api.gbif.org/v1/occurrence/", "www.gbif.org/occurrence/"),
      directApiUrl: url,
      matchesSearchSnapshot: mismatchedFields.length === 0,
      mismatchedFields,
      rawResponse: {
        path: `raw/calabarzon-balayan-gbif-record-details-20261025/${rawName}`,
        bytes: bytes.length,
        sha256: sha256(bytes),
      },
    });
    await wait(200);
  }

  const issueCodeCounts = Object.entries(
    records
      .flatMap((record) => record.issues)
      .reduce((counts, issue) => {
        counts[issue] = (counts[issue] ?? 0) + 1;
        return counts;
      }, {}),
  )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([issue, count]) => ({ issue, count }));
  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-balayan-gbif-record-details-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: { id: "ph-wb-balayan-bay", name: "Balayan Bay", kind: "bay" },
    status: "direct-occurrence-details-and-dataset-metadata-checked;source-catalog-review-pending",
    input: {
      path: "raw/gbif-calabarzon-colxr-actinopterygii-rerun-20261024/balayan-bay.json",
      sha256: sha256(searchBytes),
      queryCount: search.count,
      directRecordCount: records.length,
    },
    method: {
      apiDocsUrl,
      issueDocsUrl,
      queryTaxonomy: "Catalogue of Life eXtended Release Actinopterygii; bounded exact locality text Balayan Bay",
      comparedFields: [
        "GBIF ID",
        "dataset",
        "basis",
        "name and rank",
        "event date",
        "locality/waterBody",
        "license",
        "catalog identity",
        "quality flags",
      ],
      excludedFields: ["decimalLatitude", "decimalLongitude", "coordinateUncertaintyInMeters", "all geometry"],
      note: "Direct GBIF detail confirms its current indexed fields, not source-catalog identity, taxonomic re-identification, capture locality precision, current presence, or complete bay coverage. Dataset-level licenses are recorded separately from occurrence licenses.",
    },
    datasets,
    records,
    summary: {
      searchCandidates: candidates.length,
      directDetailResponses: records.length,
      matchingSearchSnapshots: records.filter((record) => record.matchesSearchSnapshot).length,
      mismatchedRecords: records.filter((record) => !record.matchesSearchSnapshot).length,
      datasetCount: datasets.length,
      occurrenceLicenses: [...new Set(records.map((record) => record.license))].sort(),
      datasetLicenses: [...new Set(datasets.map((dataset) => dataset.license))].sort(),
      sourceCatalogIdentityGroups: [
        ...new Set(
          records.map(
            (record) => `${record.institutionCode ?? ""}|${record.collectionCode ?? ""}|${record.catalogNumber ?? ""}`,
          ),
        ),
      ].length,
      repeatedOccurrenceIds: Object.values(
        records.reduce((counts, record) => {
          const key = record.occurrenceId ?? `missing:${record.gbifId}`;
          counts[key] = (counts[key] ?? 0) + 1;
          return counts;
        }, {}),
      ).filter((count) => count > 1).length,
      issueCodeCounts,
    },
    decision: {
      historicalAssertionsAdmitted: 0,
      publicRecordsAdded: 0,
      publicAdmission: false,
      coordinatesIncluded: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "All candidates remain research-only until their source catalog identity, locality context, taxonomy and use rights are independently reviewed. Duplicate catalog identities and GBIF quality flags remain visible; no abundance ranking or current-presence claim is inferred.",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Checked ${records.length} Balayan Bay GBIF records across ${datasets.length} datasets; ${review.summary.matchingSearchSnapshots} match the search snapshot. No records admitted.`,
  );
}

await main();
