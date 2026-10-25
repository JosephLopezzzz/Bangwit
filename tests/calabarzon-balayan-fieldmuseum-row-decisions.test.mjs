import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, institution, gbif, registry, gap, reviewBytes, institutionBytes, gbifBytes, sourceBytes] =
  await Promise.all([
    readFile(new URL("calabarzon-balayan-fieldmuseum-row-decisions-20261025.json", base), "utf8").then(JSON.parse),
    readFile(new URL("calabarzon-balayan-fieldmuseum-source-records-20261025.json", base), "utf8").then(JSON.parse),
    readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base), "utf8").then(JSON.parse),
    readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
    readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
    readFile(new URL("calabarzon-balayan-fieldmuseum-row-decisions-20261025.json", base)),
    readFile(new URL("calabarzon-balayan-fieldmuseum-source-records-20261025.json", base)),
    readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base)),
    readFile(new URL("sources.json", base)),
  ]);

function containsCoordinateField(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "geopoint", "coordinates", "geometry"].includes(key) ||
      containsCoordinateField(nested),
  );
}

test("Field Museum row decisions admit only source-backed historical locality evidence", () => {
  assert.deepEqual(review.inputHashes, {
    institution: createHash("sha256").update(institutionBytes).digest("hex"),
    gbif: createHash("sha256").update(gbifBytes).digest("hex"),
  });
  assert.equal(review.records.length, 2);
  assert.equal(review.summary.acceptedTaxa, 2);
  assert.equal(review.summary.historicalEvidenceAdmittedToResearchLedger, 2);
  assert.equal(review.summary.publicAppRowsAdded, 0);
  assert.equal(review.summary.coordinateRowsAdded, 0);
  assert.equal(review.decision.coordinatesIncluded, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.publicAppAdmission, false);
  assert.equal(review.decision.completeSpeciesInventoryClaimed, false);
  assert.equal(containsCoordinateField(review), false);

  assert.deepEqual(
    review.records.map((record) => ({
      catalogNumber: record.catalogNumber,
      gbifId: record.gbifId,
      name: record.acceptedTaxonomy.scientificName,
      aphiaId: record.acceptedTaxonomy.aphiaId,
      year: record.historicalLocalityEvidence.year,
      precision: record.historicalLocalityEvidence.datePrecision,
      locality: record.historicalLocalityEvidence.sourceLocality,
      license: record.historicalLocalityEvidence.sourceLicense,
      issues: record.gbifQualityFlags,
      researchLedger: record.decision.researchLedger,
      historicalOnly: record.decision.historicalOnly,
      publicAppAdmission: record.decision.publicAppAdmission,
      mapPointAdmission: record.decision.mapPointAdmission,
      currentPresenceInferred: record.decision.currentPresenceInferred,
    })),
    [
      {
        catalogNumber: "47041",
        gbifId: "666650137",
        name: "Caracanthus unipinna",
        aphiaId: 220365,
        year: "1929",
        precision: "year",
        locality: "Balayan Bay",
        license: "https://creativecommons.org/publicdomain/zero/1.0/",
        issues: [
          "CONTINENT_COORDINATE_MISMATCH",
          "GEODETIC_DATUM_ASSUMED_WGS84",
          "INSTITUTION_COLLECTION_MISMATCH",
          "INSTITUTION_MATCH_FUZZY",
          "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT",
        ],
        researchLedger: "admit-historical-source-locality-evidence",
        historicalOnly: true,
        publicAppAdmission: false,
        mapPointAdmission: false,
        currentPresenceInferred: false,
      },
      {
        catalogNumber: "90961",
        gbifId: "666731940",
        name: "Lagocephalus lunaris",
        aphiaId: 219957,
        year: "1926",
        precision: "year",
        locality: "Balayan Bay",
        license: "https://creativecommons.org/publicdomain/zero/1.0/",
        issues: [
          "INSTITUTION_COLLECTION_MISMATCH",
          "INSTITUTION_MATCH_FUZZY",
          "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT",
        ],
        researchLedger: "admit-historical-source-locality-evidence",
        historicalOnly: true,
        publicAppAdmission: false,
        mapPointAdmission: false,
        currentPresenceInferred: false,
      },
    ],
  );

  for (const row of review.records) {
    const sourceRow = institution.records.find((item) => item.catalogNumber === row.catalogNumber);
    const gbifRow = gbif.records.find((item) => item.catalogNumber === row.catalogNumber);
    assert.equal(row.occurrenceId, sourceRow.occurrenceId);
    assert.equal(row.occurrenceId, gbifRow.occurrenceId);
    assert.equal(row.institutionCode, "FMNH");
    assert.equal(row.collectionCode, "Fishes");
    assert.equal(row.acceptedTaxonomy.status, "accepted");
    assert.equal(row.acceptedTaxonomy.rank, "Species");
    assert.equal(row.acceptedTaxonomy.validAphiaId, row.acceptedTaxonomy.aphiaId);
    assert.equal(row.acceptedTaxonomy.exactAcceptedNameMatch, true);
    assert.ok(row.decision.reason.includes("Balayan Bay is outside the current Cavite app pilot"));
  }
});

test("taxonomy source and gap snapshot pin the row-level review without claiming completion", () => {
  const source = registry.sources.find((entry) => entry.id === "worms-balayan-taxonomy-crosscheck");
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-balayan-fieldmuseum-row-decisions-20261025.json"));
  assert.equal(source.publicationApproval, false);
  assert.equal(registry.sourceCount, 147);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(gap.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(gap.inputHashes.sourcesSha256, createHash("sha256").update(sourceBytes).digest("hex"));
  assert.equal(
    gap.inputHashes.balayanFieldMuseumRowDecisionsSha256,
    createHash("sha256").update(reviewBytes).digest("hex"),
  );
  const balayanGap = gap.openGaps.find((item) => item.id === "balayan-bay-museum-catalog-review");
  assert.ok(balayanGap);
  assert.equal(balayanGap.count, 14);
  assert.match(balayanGap.reason, /two FMNH and six CAS SU\(ICH\) records.*historical research-ledger evidence/i);
  assert.match(balayanGap.nextAction, /five remaining/i);
  assert.equal(gap.coverageSummary.admittedPublicRecords, 0);
  assert.equal(gap.coverageSummary.regionalBaselineComplete, false);
});
