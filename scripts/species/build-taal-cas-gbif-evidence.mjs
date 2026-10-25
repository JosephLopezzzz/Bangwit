import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL("data/research/philippines/calabarzon-taal-cas-gbif-source-review-20261024.json", root);
const outputUrl = new URL("src/data/taal-cas-gbif-evidence.json", root);
const expectedIds = [4071332302, 4071334301, 3426408976];

export function buildTaalCasGbifEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.batchId, "taal-cas-gbif-20261024");
  assert.equal(review.decision.status, "admit-three-historical-species-locality-assertions");
  assert.equal(review.decision.speciesAssertions, 3);
  assert.equal(review.decision.sourceOccurrenceRecords, 3);
  assert.equal(review.decision.coordinatesIncludedInProjection, false);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.decision.regionalBaselineComplete, false);
  assert.deepEqual(review.waterbody, {
    id: "ph-wb-taal-lake",
    name: "Taal Lake",
    province: "Batangas",
    region: "CALABARZON",
    kind: "lake",
  });
  assert.deepEqual(review.queryReview.parameters, {
    datasetKey: "5d6c10bd-ea31-4363-8b79-58c96d859f5b",
    country: "PH",
    basisOfRecord: "PRESERVED_SPECIMEN",
    waterBody: "Lake Taal",
    limit: 100,
  });
  assert.equal(review.queryReview.httpStatus, 200);
  assert.equal(review.queryReview.endOfRecords, true);
  assert.equal(review.queryReview.resultCount, 14);
  assert.equal(review.queryReview.enumeratedCount, 14);
  assert.deepEqual(review.queryReview.taxonRankCounts, { SPECIES: 3, GENUS: 6, FAMILY: 5 });
  assert.deepEqual(review.queryReview.selectedSpeciesRecordIds, expectedIds);
  assert.equal(review.queryReview.candidateRecordIds.length, 14);
  assert.equal(new Set(review.queryReview.candidateRecordIds).size, 14);
  assert.equal(review.queryReview.rawResponse.sha256, review.provenance.querySha256);
  assert.match(review.provenance.rawReceiptSha256, /^[0-9a-f]{64}$/);

  const source = review.dataset;
  assert.equal(source.id, "gbif-cas-ichthyology");
  assert.equal(source.gbifDatasetKey, "5d6c10bd-ea31-4363-8b79-58c96d859f5b");
  assert.equal(source.doi, "10.15468/efh2ib");
  assert.equal(source.license, "CC0-1.0");
  assert.equal(review.records.length, 3);
  assert.deepEqual(review.records.map((record) => record.gbifId), expectedIds);
  assert.equal(new Set(review.records.map((record) => record.acceptedTaxonKey)).size, 3);

  for (const record of review.records) {
    assert.equal(record.rank, "SPECIES");
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.equal(record.waterBody, "Lake Taal");
    assert.ok(record.locality);
    assert.match(record.eventDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(record.license, "CC0-1.0");
    assert.ok(record.occurrenceId);
    assert.ok(record.issues.includes("CONTINENT_INVALID"));
    assert.equal(record.coordinatesProjected, false);
    assert.equal(Object.hasOwn(record, "decimalLatitude"), false);
    assert.equal(Object.hasOwn(record, "decimalLongitude"), false);
    assert.match(record.rawResponse.sha256, /^[0-9a-f]{64}$/);
  }

  const taxonomyByKey = new Map(
    review.taxonomyReview.rawResponses.map((row) => [row.acceptedTaxonKey, row]),
  );
  assert.equal(review.taxonomyReview.rawResponses.length, 4);
  assert.equal(taxonomyByKey.size, 3);
  const assertions = review.records.map((record) => {
    const taxonomy = taxonomyByKey.get(record.acceptedTaxonKey);
    assert.ok(taxonomy, `Missing pinned GBIF taxon ${record.acceptedTaxonKey}`);
    return {
      id: `gbif:${record.acceptedTaxonKey}@${review.waterbody.id}`,
      scientificName: record.acceptedName,
      family: record.family,
      reportedWaterbody: review.waterbody.name,
      reportedLocalities: [record.locality],
      evidenceKind: "preserved-specimen-text-locality",
      records: [
        {
          gbifId: record.gbifId,
          occurrenceId: record.occurrenceId,
          scientificName: record.scientificName,
          acceptedName: record.acceptedName,
          taxonomicStatus: record.taxonomicStatus,
          eventDate: record.eventDate,
          institutionCode: record.institutionCode,
          collectionCode: record.collectionCode,
          catalogNumber: record.catalogNumber,
          recordedBy: record.recordedBy,
          occurrenceRemarks: record.occurrenceRemarks ?? null,
          coordinateUncertaintyInMeters: record.coordinateUncertaintyInMeters,
          license: record.license,
          issues: [...record.issues],
          url: record.url,
        },
      ],
      taxonomy: {
        gbifUsageKey: record.acceptedTaxonKey,
        gbifTaxonUrl: `https://www.gbif.org/species/${record.acceptedTaxonKey}`,
        recordedTaxonKey: record.taxonKey,
        recordedTaxonomicStatus: record.taxonomicStatus,
        independentReference:
          record.acceptedName === "Scatophagus argus (Linnaeus, 1766)"
            ? review.taxonomyReview.independentReference
            : null,
        responseSha256: taxonomy.sha256,
      },
    };
  });

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "reviewed-historical-lake-text-locality-evidence",
    waterbody: { ...review.waterbody },
    querySummary: {
      exactWaterBody: review.queryReview.parameters.waterBody,
      resultCount: review.queryReview.resultCount,
      reviewedCount: review.queryReview.enumeratedCount,
      speciesRankRecords: review.queryReview.taxonRankCounts.SPECIES,
      lowerRankRowsExcluded: review.queryReview.taxonRankCounts.GENUS + review.queryReview.taxonRankCounts.FAMILY,
    },
    counts: { speciesAssertions: assertions.length, sourceOccurrenceRecords: review.records.length, sourceDatasets: 1 },
    source: {
      id: source.id,
      title: source.title,
      doi: source.doi,
      citation: source.citation,
      license: source.license,
      licenseUrl: source.licenseUrl,
      metadataUrl: source.metadataUrl,
      url: `https://doi.org/${source.doi}`,
    },
    assertions,
    caveats: [...review.caveats],
    nonClaims: [...review.nonClaims],
    provenance: {
      reviewFile: "data/research/philippines/calabarzon-taal-cas-gbif-source-review-20261024.json",
      reviewSha256,
    },
  };
}

export async function readTaalCasGbifReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readTaalCasGbifReview();
  const evidence = buildTaalCasGbifEvidence(review, sha256);
  const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    assert.equal(
      await readFile(outputUrl, "utf8"),
      serialized,
      "Taal CAS projection differs from its reviewed GBIF source ledger",
    );
    console.log("Taal CAS projection matches: 3 historical species-locality assertions from CC0 specimens; coordinates withheld.");
    return;
  }
  await writeFile(outputUrl, serialized);
  console.log("Taal CAS projection written: 3 historical species-locality assertions; coordinates withheld.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Taal CAS evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
