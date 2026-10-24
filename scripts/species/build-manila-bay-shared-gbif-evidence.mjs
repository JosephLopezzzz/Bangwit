import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL("data/research/philippines/ncr-manila-bay-gbif-record-triage-20261024.json", root);
const outputUrl = new URL("src/data/manila-bay-shared-gbif-evidence.json", root);

export function buildManilaBaySharedGbifEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.status, "record-level-first-pass-complete-ncr-remains-incomplete");
  assert.equal(review.query.resultCount, 569);
  assert.equal(review.decision.rowsReconciled, 569);
  assert.equal(
    review.decision.historicalManilaBayAssertionsPrepared +
      review.decision.otherNamedWaterbodyRowsHeld +
      review.decision.remainingBroadAdministrativeRowsHeld,
    569,
  );
  assert.equal(review.decision.historicalManilaBayAssertionsPrepared, 2);
  assert.equal(review.decision.otherNamedWaterbodyRowsHeld, 5);
  assert.equal(review.decision.remainingBroadAdministrativeRowsHeld, 562);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.records.length, 2);
  assert.deepEqual(review.records.map((record) => record.gbifId), [1319034597, 2284279207]);
  for (const record of review.records) {
    assert.equal(record.reportedWaterBody, "North Pacific Ocean, Manila Bay");
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.equal(record.license, "CC0-1.0");
    assert.equal(record.decimalLatitude, null);
    assert.equal(record.decimalLongitude, null);
    assert.equal(record.taxonomyStatus, "ACCEPTED");
    assert.match(record.independentTaxonomyUrl, /^https:\/\//);
    assert.ok(record.issues.includes("CONTINENT_INVALID"));
    assert.ok(record.issues.includes("CONTINENT_DERIVED_FROM_COUNTRY"));
    assert.ok(record.issues.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"));
  }

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "historical-shared-waterbody-evidence-projection-not-release-approval",
    waterbody: {
      id: "ph-wb-manila-bay",
      name: "Manila Bay",
      scope: "Shared waterbody across NCR, Central Luzon and CALABARZON",
    },
    counts: {
      historicalSpeciesAssertions: 2,
      preservedSpecimenRecords: 2,
      otherNamedWaterbodyRowsHeld: 5,
      remainingBroadAdministrativeRowsHeld: 562,
    },
    dataset: {
      title: "NMNH Extant Specimen Records (USNM, US)",
      doi: "10.15468/hnhrg3",
      url: "https://www.gbif.org/dataset/821cc27a-e3bb-4bc5-ac34-89ada245069d",
      citation: "National Museum of Natural History, Smithsonian Institution. NMNH Extant Specimen Records (USNM, US). GBIF dataset https://doi.org/10.15468/hnhrg3.",
      license: "CC0-1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
    records: review.records.map((record) => ({ ...record })),
    caveats: [...review.caveats],
    provenance: {
      reviewFile: "data/research/philippines/ncr-manila-bay-gbif-record-triage-20261024.json",
      reviewSha256,
      queryPages: review.query.pageReceipts.map((page) => ({ ...page })),
    },
  };
}

export async function readManilaBayGbifReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readManilaBayGbifReview();
  const projection = `${JSON.stringify(buildManilaBaySharedGbifEvidence(review, sha256), null, 2)}\n`;
  if (process.argv.includes("--check")) {
    assert.equal(await readFile(outputUrl, "utf8"), projection, "Manila Bay evidence differs from its reviewed source ledger");
    console.log("Manila Bay projection matches two historical museum records; all 567 other rows remain held.");
    return;
  }
  await writeFile(outputUrl, projection);
  console.log("Manila Bay projection written with two historical museum records; no NCR assignment or coordinates added.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Manila Bay evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
