import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL("data/research/philippines/pansipit-river-gbif-source-review.json", root);
const outputUrl = new URL("src/data/pansipit-river-gbif-evidence.json", root);
const serializeEvidence = (evidence) =>
  `${JSON.stringify(evidence, null, 2)}\n`.replace(
    /(\"collectionDates\": )\[\n\s+(\"[^\"]+\")\n\s+\]/g,
    "$1[$2]",
  );

export function buildPansipitRiverGbifEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.decision.status, "admit-four-historical-species-locality-assertions");
  assert.equal(review.decision.speciesAssertionCount, 4);
  assert.equal(review.decision.sourceOccurrenceRecordCount, 4);
  assert.equal(review.waterbody.id, "ph-wb-pansipit-river");
  assert.equal(review.waterbody.province, "Batangas");
  assert.equal(review.waterbody.region, "CALABARZON");
  assert.equal(review.waterbody.kind, "river");
  assert.equal(review.queryReview.parameters.locality, review.waterbody.name);
  assert.deepEqual(review.queryReview.parameters, {
    country: "PH",
    locality: "Pansipit River",
    basisOfRecord: "PRESERVED_SPECIMEN",
    limit: 100,
  });
  assert.equal(review.queryReview.resultCount, review.queryReview.enumeratedCount);
  assert.equal(review.queryReview.resultCount, 19);
  assert.equal(
    review.queryReview.classCounts.reduce((total, row) => total + row.count, 0),
    review.queryReview.resultCount,
    "Exact-locality query class groups must reconcile",
  );
  assert.deepEqual(review.queryReview.classCounts, [
    { class: "Aves", count: 15 },
    { class: null, count: 4 },
  ]);
  assert.equal(review.queryReview.classCounts.find((row) => row.class === null)?.count, 4);
  assert.equal(review.records.length, 4, "Expected four frozen museum specimen rows");
  assert.deepEqual(
    review.records.map((row) => row.gbifId),
    review.queryReview.candidateRecordIds,
    "Candidate ID list must match the frozen reviewed rows",
  );
  assert.equal(new Set(review.records.map((row) => row.gbifId)).size, review.records.length);
  assert.deepEqual(
    review.records.map((row) => row.gbifId),
    [666702436, 666647455, 666647458, 666647460],
    "The reviewed record batch must remain pinned to the source receipt",
  );
  assert.equal(new Set(review.taxonomyReviews.map((taxon) => taxon.gbifUsageKey)).size, 4);
  assert.equal(new Set(review.records.map((row) => row.taxonKey)).size, 4);
  assert.equal(review.dataset.id, "gbif-field-museum-fish-collection");
  assert.equal(review.dataset.gbifDatasetKey, "afc30a94-6107-488a-b9c0-ba9c4fa68b7c");
  assert.equal(review.dataset.doi, "10.15468/alz7wu");
  assert.equal(review.dataset.license, "CC0-1.0");
  assert.ok(review.dataset.doi);

  const taxonomyByKey = new Map(review.taxonomyReviews.map((taxon) => [taxon.gbifUsageKey, taxon]));
  assert.equal(taxonomyByKey.size, 4);
  for (const taxon of review.taxonomyReviews) {
    assert.ok(taxon.acceptedName);
    assert.ok(taxon.independentStatus);
    assert.match(taxon.independentTaxonUrl, /^https:\/\//);
  }

  const sharedCoordinates = new Set();
  for (const record of review.records) {
    const taxon = taxonomyByKey.get(record.taxonKey);
    assert.ok(taxon, `Unknown taxon key: ${record.taxonKey}`);
    assert.equal(record.scientificName, taxon.recordedName);
    assert.equal(record.acceptedName, taxon.acceptedName);
    assert.equal(record.taxonomicStatus, taxon.gbifMatchStatus);
    assert.equal(record.family, taxon.family);
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.equal(record.locality, review.waterbody.name);
    assert.match(record.eventDate, /^1933(?:-12)?$/);
    assert.equal(review.dataset.license, "CC0-1.0");
    assert.equal(record.license, "CC0-1.0");
    assert.equal(record.datasetId, review.dataset.id);
    assert.equal(record.coordinateUncertaintyInMeters, null);
    assert.equal(record.geodeticDatum, "WGS84");
    assert.ok(record.issues.includes("GEODETIC_DATUM_ASSUMED_WGS84"));
    assert.ok(record.issues.includes("INSTITUTION_MATCH_FUZZY"));
    assert.ok(record.issues.includes("INSTITUTION_COLLECTION_MISMATCH"));
    assert.ok(record.issues.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"));
    assert.ok(record.issues.length);
    sharedCoordinates.add(`${record.decimalLatitude},${record.decimalLongitude}`);
  }
  assert.equal(sharedCoordinates.size, 1, "All coordinates must remain explicitly treated as one unvalidated shared point");
  assert.equal(
    review.records.filter((record) => record.issues.includes("RECORDED_DATE_MISMATCH")).length,
    3,
  );

  const assertions = review.taxonomyReviews.map((taxon) => {
    const records = review.records.filter((record) => record.taxonKey === taxon.gbifUsageKey);
    assert.ok(records.length > 0, `No source records found for ${taxon.acceptedName}`);
    return {
      id: `gbif:${taxon.gbifUsageKey}@${review.waterbody.id}`,
      scientificName: taxon.acceptedName,
      family: taxon.family,
      reportedLocality: review.waterbody.name,
      evidenceKind: "preserved-specimen-text-locality",
      collectionDates: [...new Set(records.map((record) => record.eventDate))].sort(),
      records: records.map((record) => ({
        gbifId: record.gbifId,
        occurrenceId: record.occurrenceId,
        scientificName: record.scientificName,
        acceptedName: record.acceptedName,
        eventDate: record.eventDate,
        institutionCode: record.institutionCode,
        collectionCode: record.collectionCode,
        catalogNumber: record.catalogNumber,
        recordedBy: record.recordedBy,
        license: record.license,
        issues: [...record.issues],
        url: record.url,
      })),
      taxonomy: {
        gbifUsageKey: taxon.gbifUsageKey,
        gbifMatchStatus: taxon.gbifMatchStatus,
        gbifTaxonUrl: `https://www.gbif.org/species/${taxon.gbifUsageKey}`,
        independentAuthority: taxon.independentAuthority,
        independentStatus: taxon.independentStatus,
        independentTaxonUrl: taxon.independentTaxonUrl,
      },
    };
  });

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "reviewed-historical-river-text-locality-evidence",
    waterbody: { ...review.waterbody },
    querySummary: {
      exactLocality: review.queryReview.parameters.locality,
      resultCount: review.queryReview.resultCount,
      reviewedCount: review.queryReview.enumeratedCount,
      nonFishCount: 15,
      selectedFishSpecimenRecordCount: review.records.length,
    },
    counts: {
      speciesAssertions: assertions.length,
      sourceOccurrenceRecords: review.records.length,
      sourceDatasets: 1,
    },
    source: {
      id: review.dataset.id,
      title: review.dataset.title,
      doi: review.dataset.doi,
      citation: review.dataset.citation,
      license: review.dataset.license,
      licenseUrl: review.dataset.licenseUrl,
      metadataUrl: review.dataset.metadataUrl,
      url: `https://doi.org/${review.dataset.doi}`,
    },
    assertions,
    caveats: [...review.decision.caveats],
    nonClaims: [...review.nonClaims],
    provenance: {
      reviewFile: "data/research/philippines/pansipit-river-gbif-source-review.json",
      reviewSha256,
    },
  };
}

export async function readPansipitRiverGbifReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readPansipitRiverGbifReview();
  const evidence = buildPansipitRiverGbifEvidence(review, sha256);
  const serialized = serializeEvidence(evidence);
  if (process.argv.includes("--check")) {
    const current = await readFile(outputUrl, "utf8");
    assert.equal(current, serialized, "Pansipit River projection differs from its reviewed GBIF source ledger");
    console.log("Pansipit projection matches: 4 historical species-locality assertions from 4 CC0 specimen records; coordinates withheld.");
    return;
  }
  await writeFile(outputUrl, serialized);
  console.log("Pansipit projection written: 4 historical species-locality assertions from 4 CC0 specimen records; coordinates withheld.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Pansipit evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
