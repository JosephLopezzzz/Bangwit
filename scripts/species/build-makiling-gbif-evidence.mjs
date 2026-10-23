import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL("data/research/philippines/makiling-gbif-source-review.json", root);
const outputUrl = new URL("src/data/makiling-gbif-evidence.json", root);

export function buildMakilingGbifEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.decision.status, "admit-one-historical-site-level-assertion");
  assert.equal(review.decision.assertionCount, 1);
  assert.equal(review.waterbody.id, "ph-wb-molawin-makiling-creek");
  assert.equal(review.queryReview.parameters.locality, review.waterbody.name);
  assert.equal(review.queryReview.resultCount, review.queryReview.enumeratedCount);
  assert.equal(
    review.queryReview.classCounts.reduce((total, row) => total + row.count, 0),
    review.queryReview.resultCount,
    "GBIF locality result classes must reconcile",
  );
  assert.equal(review.records.length, 3, "Expected exactly three frozen museum occurrence rows");
  assert.deepEqual(
    review.records.map((row) => row.gbifId),
    review.queryReview.candidateRecordIds,
    "Candidate ID list must match the frozen reviewed rows",
  );
  assert.equal(new Set(review.records.map((row) => row.gbifId)).size, review.records.length);
  assert.equal(new Set(review.datasets.map((dataset) => dataset.id)).size, 2);
  assert.equal(new Set(review.records.map((row) => row.scientificName)).size, 1);
  assert.equal(new Set(review.records.map((row) => row.taxonKey)).size, 1);
  assert.equal(review.taxonomyReview.gbifMatchStatus, "ACCEPTED");
  assert.equal(review.taxonomyReview.gbifUsageKey, 2412092);
  assert.match(review.taxonomyReview.independentStatus, /^Valid as /);

  const datasetIds = new Set(review.datasets.map((dataset) => dataset.id));
  for (const dataset of review.datasets) {
    assert.equal(dataset.license, "CC0-1.0", `Dataset is not CC0: ${dataset.id}`);
    assert.ok(dataset.doi, `Dataset DOI is required: ${dataset.id}`);
  }
  for (const record of review.records) {
    assert.equal(record.scientificName, review.taxonomyReview.acceptedName);
    assert.equal(record.taxonKey, review.taxonomyReview.gbifUsageKey);
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.equal(record.locality, review.waterbody.name);
    assert.equal(record.eventDate, null, "No collection date may be inferred");
    assert.equal(record.decimalLongitude, null, "No coordinate may be invented");
    assert.equal(record.decimalLatitude, null, "No coordinate may be invented");
    assert.equal(record.license, "CC0-1.0");
    assert.ok(datasetIds.has(record.datasetId), `Unknown dataset: ${record.datasetId}`);
    assert.ok(record.issues.length, `Quality flags must remain visible: ${record.gbifId}`);
  }

  const sourceDatasets = review.datasets.map((dataset) => ({
    id: dataset.id,
    title: dataset.title,
    doi: dataset.doi,
    citation: dataset.citation,
    license: dataset.license,
    licenseUrl: dataset.licenseUrl,
  }));
  const records = review.records.map((record) => ({
    gbifId: record.gbifId,
    occurrenceId: record.occurrenceId,
    datasetId: record.datasetId,
    basisOfRecord: record.basisOfRecord,
    locality: record.locality,
    eventDate: null,
    decimalLongitude: null,
    decimalLatitude: null,
    institutionCode: record.institutionCode,
    collectionCode: record.collectionCode,
    catalogNumber: record.catalogNumber,
    license: record.license,
    issues: [...record.issues],
    url: record.url,
  }));

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "reviewed-historical-site-level-evidence",
    waterbody: { ...review.waterbody },
    counts: {
      speciesAssertions: 1,
      sourceOccurrenceRecords: records.length,
      sourceDatasets: sourceDatasets.length,
    },
    taxonomy: {
      scientificName: review.taxonomyReview.acceptedName,
      family: review.taxonomyReview.gbifFamily,
      gbifUsageKey: review.taxonomyReview.gbifUsageKey,
      gbifTaxonUrl: review.taxonomyReview.gbifTaxonUrl,
      independentAuthority: review.taxonomyReview.independentAuthority,
      independentStatus: review.taxonomyReview.independentStatus,
      independentTaxonUrl: review.taxonomyReview.independentTaxonUrl,
    },
    sources: sourceDatasets,
    assertions: [
      {
        id: `gbif:${review.taxonomyReview.gbifUsageKey}@${review.waterbody.id}`,
        scientificName: review.taxonomyReview.acceptedName,
        reportedLocality: review.waterbody.name,
        evidenceKind: "preserved-specimen-locality",
        collectionDate: null,
        sourceRecordIds: records.map((record) => record.gbifId),
        records,
      },
    ],
    caveats: [...review.decision.caveats],
    nonClaims: [...review.nonClaims],
    provenance: {
      reviewFile: "data/research/philippines/makiling-gbif-source-review.json",
      reviewSha256,
    },
  };
}

export async function readMakilingGbifReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readMakilingGbifReview();
  const evidence = buildMakilingGbifEvidence(review, sha256);
  const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    const current = await readFile(outputUrl, "utf8");
    assert.equal(current, serialized, "Makiling GBIF evidence projection differs from its review ledger");
    console.log("Makiling projection matches: 1 historical species-locality assertion; 3 museum occurrence records.");
    return;
  }
  await writeFile(outputUrl, serialized);
  console.log("Makiling projection written: 1 historical species-locality assertion; 3 museum occurrence records.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Makiling evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
