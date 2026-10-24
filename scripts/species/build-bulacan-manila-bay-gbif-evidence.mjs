import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL(
  "data/research/philippines/central-luzon-bulacan-manila-bay-usnm-source-review-20261024.json",
  root,
);
const outputUrl = new URL("src/data/bulacan-manila-bay-gbif-evidence.json", root);
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

export function buildBulacanManilaBayEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.status, "admit-three-historical-text-locality-assertions");
  assert.equal(review.decision.status, review.status);
  assert.equal(review.decision.speciesAssertionCount, 3);
  assert.equal(review.decision.sourceOccurrenceRecordCount, 3);
  assert.equal(review.decision.currentPresenceAssertionCount, 0);
  assert.equal(review.decision.coordinateProjected, false);
  assert.equal(review.decision.mapGeometryAdded, false);
  assert.equal(review.decision.publicationApproval, false);
  assert.equal(review.region.id, "0300000000");
  assert.equal(review.source.license, "CC0-1.0");
  assert.equal(review.source.datasetKey, "821cc27a-e3bb-4bc5-ac34-89ada245069d");
  assert.equal(
    review.sharedLocality.verbatim,
    "Taken from a fish trap, Malolos, Bulacan, Philippines (northern shore of Manila Bay).",
  );
  assert.equal(review.sharedLocality.collectionDate, "1982-02");
  assert.equal(review.sharedLocality.gbifWaterBody, "Pacific");
  assert.match(review.sharedLocality.waterBodyDecision, /Do not project/);
  assert.equal(review.records.length, 3);
  assert.equal(review.occurrenceQuery.resultCount, 12);
  assert.equal(review.occurrenceQuery.endOfRecords, true);
  assert.deepEqual(review.occurrenceQuery.selectedOccurrenceKeys, [1317449658, 1319522719, 1321058846]);
  assert.match(review.rawSnapshot.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.rawSnapshot.gitIgnored, true);

  const acceptedNames = new Set([
    "Oxyurichthys microlepis (Bleeker, 1849)",
    "Drombus ocyurus (Jordan & Seale, 1907)",
    "Butis koilomatodon (Bleeker, 1849)",
  ]);
  const expectedRecords = [
    [1317449658, "USNM 265078", 7],
    [1319522719, "USNM 349186", 3],
    [1321058846, "USNM 341214", 1],
  ];
  assert.deepEqual(
    review.records.map(({ gbifId, catalogNumber, individualCount }) => [gbifId, catalogNumber, individualCount]),
    expectedRecords,
  );
  for (const record of review.records) {
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.equal(record.taxonRank, "SPECIES");
    assert.ok(acceptedNames.has(record.acceptedName));
    assert.equal(record.license, "CC0-1.0");
    assert.deepEqual(record.issues, [
      "CONTINENT_INVALID",
      "CONTINENT_DERIVED_FROM_COUNTRY",
      "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT",
    ]);
    assert.equal(record.taxonomyReview.currentStanding, "valid");
    assert.equal(record.taxonomyReview.name, record.acceptedName.replace(/ \([^)]*\)$/, ""));
    assert.equal(record.taxonomyReview.rank, "SPECIES");
    assert.equal("decimalLatitude" in record, false);
    assert.equal("decimalLongitude" in record, false);
  }

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "historical-text-locality-evidence",
    region: { ...review.region },
    querySummary: {
      method: "pinned-col-xr-actinopterygii-bulacan-preserved-specimen-screen",
      resultCount: review.occurrenceQuery.resultCount,
      selectedOccurrenceCount: review.records.length,
    },
    counts: {
      speciesAssertions: review.records.length,
      sourceOccurrenceRecords: review.records.length,
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
    reportedLocality: review.sharedLocality.verbatim,
    collectionDate: review.sharedLocality.collectionDate,
    assertions: review.records.map((record) => ({
      id: `gbif:${record.taxonKey}@bulacan-manila-bay-text-locality-1982`,
      scientificName: record.acceptedName,
      recordedName: record.recordedName,
      reportedLocality: review.sharedLocality.verbatim,
      evidenceKind: "preserved-specimen-text-locality",
      collectionDate: review.sharedLocality.collectionDate,
      sourceRecordCount: 1,
      coordinateInclusion: false,
      taxonomy: {
        gbifTaxonKey: record.taxonKey,
        gbifTaxonUrl: `https://www.gbif.org/species/${record.taxonKey}`,
        independentAuthority: record.taxonomyReview.authority,
        independentStatus: record.taxonomyReview.currentStanding,
        independentTaxonUrl: record.taxonomyReview.url,
      },
      records: [
        {
          gbifId: record.gbifId,
          occurrenceId: record.occurrenceId,
          museumRecordUrl: record.museumRecordUrl,
          catalogNumber: record.catalogNumber,
          institutionCode: record.institutionCode,
          collectionCode: record.collectionCode,
          basisOfRecord: record.basisOfRecord,
          individualCount: record.individualCount,
          occurrenceStatus: record.occurrenceStatus,
          eventDate: review.sharedLocality.collectionDate,
          recordedName: record.recordedName,
          recordedBy: review.sharedLocality.recordedBy,
          license: record.license,
          issues: [...record.issues],
          url: record.url,
        },
      ],
    })),
    caveats: [...review.decision.caveats],
    provenance: {
      reviewFile: "data/research/philippines/central-luzon-bulacan-manila-bay-usnm-source-review-20261024.json",
      reviewSha256,
    },
  };
}

export async function readBulacanManilaBayReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readBulacanManilaBayReview();
  const projection = serialize(buildBulacanManilaBayEvidence(review, sha256));
  if (process.argv.includes("--check")) {
    const current = await readFile(outputUrl, "utf8");
    assert.equal(current, projection, "Bulacan Manila Bay historical projection differs from its source review");
    console.log("Bulacan Manila Bay projection matches: three 1982 CC0 museum assertions; no coordinates.");
    return;
  }
  await writeFile(outputUrl, projection);
  console.log("Bulacan Manila Bay projection written: three 1982 CC0 museum assertions; no coordinates.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Bulacan Manila Bay evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
