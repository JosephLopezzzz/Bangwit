import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const triageUrl = new URL("data/research/philippines/calabarzon-laguna-gbif-triage-20261025.json", root);
const reviewUrl = new URL("data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json", root);
const rawDirectory = new URL("data/research/philippines/raw/calabarzon-laguna-gbif-record-details-20261025/", root);
const issueDocsUrl = "https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags";
const apiDocsUrl = "https://techdocs.gbif.org/en/openapi/v1/occurrence";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function fetchRecord(id) {
  const url = `https://api.gbif.org/v1/occurrence/${id}`;
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (GBIF specimen detail review)" },
        signal: AbortSignal.timeout(30000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      const body = JSON.parse(bytes.toString("utf8"));
      if (!response.ok)
        throw new Error(`GBIF occurrence ${id}: HTTP ${response.status}: ${body.message ?? response.statusText}`);
      return { url, body, bytes };
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
    eventDate: record.eventDate ?? null,
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
  const triageBytes = await readFile(triageUrl);
  const triage = JSON.parse(triageBytes.toString("utf8"));
  assert.equal(triage.status, "dataset-rights-and-COL-XR-crosswalk-reviewed;record-admission-pending");
  const candidates = triage.recordReviews.filter(
    (record) => record.disposition.status === "candidate-for-independent-locality-review",
  );
  assert.equal(candidates.length, 18);
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const records = [];
  for (const candidate of candidates) {
    const { url, body, bytes } = await fetchRecord(candidate.gbifId);
    assert.equal(String(body.key), candidate.gbifId);
    const rawName = `occurrence-${candidate.gbifId}.json`;
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
      "issues",
    ];
    const mismatchedFields = comparedFields.filter(
      (field) => JSON.stringify(detail[field]) !== JSON.stringify(candidate[field]),
    );
    records.push({
      ...detail,
      occurrenceUrl: url.replace("api.gbif.org/v1/occurrence/", "www.gbif.org/occurrence/"),
      directApiUrl: url,
      triageStatus: candidate.disposition.status,
      taxonomyClassification: candidate.taxonomyClassification,
      matchingTriageFields: mismatchedFields.length === 0,
      mismatchedFields,
      qualityFlags: detail.issues,
      rawResponse: {
        path: `raw/calabarzon-laguna-gbif-record-details-20261025/${rawName}`,
        bytes: bytes.length,
        sha256: sha256(bytes),
      },
    });
    await wait(200);
  }

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-laguna-gbif-record-details-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: { id: "ph-wb-laguna-de-bay", name: "Laguna de Bay", kind: "lake" },
    status: "direct-occurrence-details-cross-checked;historical-assertion-decision-pending",
    input: {
      file: "calabarzon-laguna-gbif-triage-20261025.json",
      sha256: sha256(triageBytes),
      candidateRecordCount: candidates.length,
    },
    method: {
      apiDocsUrl,
      issueDocsUrl,
      comparedFields: [
        "GBIF ID",
        "dataset key",
        "taxon rank",
        "basis of record",
        "recorded and accepted names",
        "event date",
        "waterBody and locality",
        "license",
        "quality flags",
      ],
      excludedFields: ["decimalLatitude", "decimalLongitude", "coordinateUncertaintyInMeters", "all map geometry"],
      flagInterpretation:
        "GBIF documents continent flags as interpreted from invalid/missing continent or coordinates, and inferred occurrence status as derived rather than supplied. Flags remain visible; coordinates and current-presence claims are excluded.",
      note: "A direct-detail match confirms consistency with GBIF's current indexed record, not the institution's source catalog, specimen re-identification, current presence, or publication permission.",
    },
    records,
    summary: {
      candidateRecordCount: candidates.length,
      detailResponses: records.length,
      matchingTriageRecords: records.filter((record) => record.matchingTriageFields).length,
      recordsWithMismatches: records.filter((record) => !record.matchingTriageFields).length,
      datasetKeys: [...new Set(records.map((record) => record.datasetKey))].sort(),
      recordsWithSourceCatalogIdentifiers: records.filter((record) => record.catalogNumber || record.occurrenceId)
        .length,
      issueCodeCounts: Object.entries(
        records
          .flatMap((record) => record.qualityFlags)
          .reduce((counts, issue) => {
            counts[issue] = (counts[issue] ?? 0) + 1;
            return counts;
          }, {}),
      )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([issue, count]) => ({ issue, count })),
    },
    decision: {
      historicalAssertionsAdmitted: 0,
      publicRecordsAdded: 0,
      publicAdmission: false,
      coordinatesIncluded: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "This direct-detail pass verifies GBIF's indexed fields and preserves catalog identifiers and flags for each candidate. It does not independently inspect the institution's catalog; all rows remain research-only pending source-level identity and explicit product-use review.",
    },
  };

  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Checked ${records.length} GBIF occurrence details: ${review.summary.matchingTriageRecords} match the triage snapshot, ${review.summary.recordsWithMismatches} have field changes. No records admitted.`,
  );
}

await main();
