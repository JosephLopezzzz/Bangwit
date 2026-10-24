import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL(
  "data/research/philippines/central-luzon-bulacan-angat-gbif-source-review-20261024.json",
  root,
);
const outputUrl = new URL("src/data/angat-gbif-species-evidence.json", root);
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

export function buildAngatGbifEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.status, "admit-one-historical-text-locality-assertion");
  assert.equal(review.decision.status, "admit-one-historical-text-locality-assertion");
  assert.equal(review.decision.speciesAssertionCount, 1);
  assert.equal(review.decision.sourceOccurrenceRecordCount, 1);
  assert.equal(review.decision.currentPresenceAssertionCount, 0);
  assert.equal(review.decision.coordinateProjected, false);
  assert.equal(review.decision.mapGeometryAdded, false);
  assert.equal(review.coordinateReview.projected, false);

  const record = review.record;
  assert.equal(record.gbifId, 3426466682);
  assert.equal(record.occurrenceId, "urn:catalog:CAS:SU(ICH):27667");
  assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
  assert.equal(record.recordedName, "Arius dispar Herre, 1926");
  assert.equal(record.acceptedName, record.recordedName);
  assert.equal(record.taxonRank, "SPECIES");
  assert.equal(record.eventDate, "1929-05-18");
  assert.equal(record.locality, "Angat Dam, Angat River, Luzon");
  assert.equal(record.waterBody, null);
  assert.equal(record.license, "CC0-1.0");
  assert.equal(review.source.license, "CC0-1.0");
  assert.equal(review.taxonomyReview.currentStanding, "valid");
  assert.equal(review.taxonomyReview.name, record.acceptedName);
  assert.equal(review.coordinateReview.uncertaintyMeters, 301);
  assert.ok(record.issues.includes("GEODETIC_DATUM_ASSUMED_WGS84"));
  assert.ok(record.issues.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"));

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "historical-text-locality-evidence",
    region: { ...review.region },
    querySummary: {
      method: "pinned-col-xr-actinopterygii-administrative-screen",
      resultCount: review.occurrenceQuery.resultCount,
      selectedOccurrenceCount: 1,
    },
    counts: {
      speciesAssertions: 1,
      sourceOccurrenceRecords: 1,
      sourceDatasets: 1,
    },
    source: {
      id: review.source.id,
      title: review.source.datasetTitle,
      doi: review.source.doi,
      citation: review.source.citation,
      license: review.source.license,
      licenseUrl: review.source.licenseUrl,
      metadataUrl: review.source.datasetUrl,
    },
    assertions: [
      {
        ...review.publicAssertion,
        records: [
          {
            gbifId: record.gbifId,
            occurrenceId: record.occurrenceId,
            catalogNumber: record.catalogNumber,
            fieldNumber: record.fieldNumber,
            institutionCode: record.institutionCode,
            collectionCode: record.collectionCode,
            basisOfRecord: record.basisOfRecord,
            individualCount: record.individualCount,
            eventDate: record.eventDate,
            recordedName: record.recordedName,
            recordedBy: record.recordedBy,
            identifiedBy: record.identifiedBy,
            license: record.license,
            issues: [...record.issues],
            url: record.url,
          },
        ],
        taxonomy: {
          gbifTaxonKey: record.taxonKey,
          gbifTaxonUrl: `https://www.gbif.org/species/${record.taxonKey}`,
          independentAuthority: review.taxonomyReview.authority,
          independentStatus: review.taxonomyReview.currentStanding,
          independentTaxonUrl: review.taxonomyReview.url,
        },
      },
    ],
    caveats: [...review.decision.caveats],
    nonClaims: [...review.nonClaims],
    provenance: {
      reviewFile: "data/research/philippines/central-luzon-bulacan-angat-gbif-source-review-20261024.json",
      reviewSha256,
    },
  };
}

export async function readAngatGbifReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readAngatGbifReview();
  const projection = serialize(buildAngatGbifEvidence(review, sha256));
  if (process.argv.includes("--check")) {
    const current = await readFile(outputUrl, "utf8");
    assert.equal(current, projection, "Angat historical evidence projection differs from its source review");
    console.log("Angat projection matches: one 1929 CC0 CAS text-locality record; coordinates withheld.");
    return;
  }
  await writeFile(outputUrl, projection);
  console.log("Angat projection written: one 1929 CC0 CAS text-locality record; coordinates withheld.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Angat evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
