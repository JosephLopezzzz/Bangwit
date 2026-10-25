import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const files = [
  "calabarzon-balayan-cas-source-records-20261025.json",
  "calabarzon-balayan-cas-row-decisions-20261025.json",
  "calabarzon-balayan-gbif-record-details-20261025.json",
  "sources.json",
  "calabarzon-coverage-gap-report-20261025.json",
];
const bytes = await Promise.all(files.map((file) => readFile(new URL(file, base))));
const [institution, review, gbif, registry, gap] = bytes.map((value) => JSON.parse(value.toString("utf8")));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const containsCoordinateField = (value) => {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "geopoint", "coordinates", "geometry"].includes(key) ||
      containsCoordinateField(nested),
  );
};

test("CAS archive selection is collection-qualified, license-backed and date-precision preserving", () => {
  assert.equal(institution.archive.occurrenceRows, 220916);
  assert.equal(institution.archive.publishedDate, "2026-10-19");
  assert.equal(institution.archive.archiveVersion, null);
  assert.match(institution.archive.sha256, /^[a-f0-9]{64}$/);
  assert.equal(institution.archive.numericCatalogMatchesAcrossCollections, 12);
  assert.equal(institution.archive.exactSuIchBalayanMatches, 6);
  assert.equal(institution.archive.otherCollectionNumericCollisions, 6);
  assert.equal(institution.rights.licenseIdentifier, "CC0-1.0");
  assert.equal(institution.summary.allRowsDirectlyNameBalayanBayWaterBodyAndLocality, true);
  assert.equal(institution.summary.allRowsCarryCc0LicenseUrl, true);
  assert.equal(institution.summary.coordinatesIncluded, false);
  assert.equal(containsCoordinateField(institution), false);
  assert.deepEqual(
    institution.records.map(({ catalogNumber, scientificName, eventDate }) => [
      catalogNumber,
      scientificName,
      eventDate,
    ]),
    [
      ["14524", "Auxis thazard", "1940-06-07"],
      ["27694", "Hippocampus kuda", "1931-04"],
      ["28340", "Liza troscheli", "1931-04"],
      ["29728", "Lutjanus boutton", "1933-12"],
      ["39197", "Nemipterus hexodon", "1940-06-06"],
      ["39590", "Ophichthus grandoculis", "1940-06-06"],
    ],
  );
  for (const row of institution.records) {
    assert.equal(row.institutionCode, "CAS");
    assert.equal(row.collectionCode, "SU(ICH)");
    assert.equal(row.country, "Philippines");
    assert.equal(row.stateProvince, "Batangas");
    assert.equal(row.waterBody, "Balayan Bay");
    assert.equal(row.locality, "Balayan Bay");
    assert.equal(row.license, "https://creativecommons.org/publicdomain/zero/1.0/");
  }
});

test("CAS row decisions preserve GBIF quality flags and admit historical research evidence only", () => {
  assert.deepEqual(review.inputHashes, {
    institutionReview: digest(bytes[0]),
    gbif: digest(bytes[2]),
  });
  assert.equal(review.records.length, 6);
  assert.equal(review.summary.historicalEvidenceAdmittedToResearchLedger, 6);
  assert.equal(review.summary.publicAppRowsAdded, 0);
  assert.equal(review.summary.coordinateRowsAdded, 0);
  assert.equal(review.decision.publicAppAdmission, false);
  assert.equal(review.decision.coordinatesIncluded, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.completeSpeciesInventoryClaimed, false);
  assert.equal(containsCoordinateField(review), false);
  const expectedTaxa = new Map([
    ["14524", ["Auxis thazard", 127016, "day"]],
    ["27694", ["Hippocampus kuda", 212237, "month"]],
    ["28340", ["Planiliza macrolepis", 1043424, "month"]],
    ["29728", ["Lutjanus boutton", 276527, "month"]],
    ["39197", ["Nemipterus hexodon", 278124, "day"]],
    ["39590", ["Ophichthus grandoculis", 271956, "day"]],
  ]);
  for (const row of review.records) {
    const [acceptedName, aphiaId, precision] = expectedTaxa.get(row.catalogNumber) ?? [];
    assert.ok(acceptedName, `Unexpected CAS catalog number ${row.catalogNumber}`);
    const source = institution.records.find((item) => item.catalogNumber === row.catalogNumber);
    const gbifRow = gbif.records.find((item) => item.catalogNumber === row.catalogNumber);
    assert.ok(source && gbifRow);
    assert.equal(row.occurrenceId, source.occurrenceID);
    assert.equal(row.occurrenceId, gbifRow.occurrenceId);
    assert.equal(row.acceptedTaxonomy.scientificName, acceptedName);
    assert.equal(row.acceptedTaxonomy.aphiaId, aphiaId);
    assert.equal(row.historicalLocalityEvidence.datePrecision, precision);
    assert.deepEqual(row.gbifQualityFlags, gbifRow.issues);
    assert.equal(row.decision.researchLedger, "admit-historical-source-locality-evidence");
    assert.equal(row.decision.historicalOnly, true);
    assert.equal(row.decision.publicAppAdmission, false);
    assert.equal(row.decision.mapPointAdmission, false);
    assert.equal(row.decision.currentPresenceInferred, false);
    assert.equal(row.decision.completeChecklistClaimed, false);
  }
  const synonym = review.records.find((row) => row.catalogNumber === "28340");
  assert.equal(synonym.acceptedTaxonomy.gbifNameCrosscheck.scientificName, "Liza troschelli");
  assert.equal(synonym.acceptedTaxonomy.gbifNameCrosscheck.validAphiaId, 1043424);
  assert.equal(synonym.acceptedTaxonomy.gbifNameCrosscheck.sameAcceptedTaxon, true);
});

test("registry and gap report pin CAS evidence without implying public coverage", () => {
  assert.equal(registry.sourceCount, 169);
  assert.equal(registry.sources.length, 169);
  const casSource = registry.sources.find((source) => source.id === "cas-balayan-primary-archive-check");
  const taxonomySource = registry.sources.find((source) => source.id === "worms-balayan-cas-taxonomy-crosscheck");
  assert.ok(casSource && taxonomySource);
  assert.equal(casSource.publicationApproval, false);
  assert.equal(casSource.license, "CC0 1.0");
  assert.equal(taxonomySource.publicationApproval, false);
  assert.equal(taxonomySource.license, null);
  assert.equal(gap.coverageSummary.registeredSources, 169);
  assert.equal(gap.inputHashes.sourcesSha256, digest(bytes[3]));
  assert.equal(gap.inputHashes.balayanCasSourceSha256, digest(bytes[0]));
  assert.equal(gap.inputHashes.balayanCasRowDecisionsSha256, digest(bytes[1]));
  const balayan = gap.openGaps.find((item) => item.id === "balayan-bay-museum-catalog-review");
  assert.equal(balayan.count, 14);
  assert.ok(balayan.sourceRefs.includes(casSource.id));
  assert.ok(balayan.sourceRefs.includes(taxonomySource.id));
  assert.match(balayan.reason, /six CAS SU\(ICH\) records.*eight.*historical research-ledger evidence/i);
  assert.match(balayan.nextAction, /rights are no longer the blocker/i);
  assert.equal(gap.coverageSummary.admittedPublicRecords, 0);
  assert.equal(gap.coverageSummary.regionalBaselineComplete, false);
});
