import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL(
  "../data/research/philippines/calabarzon-laguna-museum-catalog-verification-20261025.json",
  import.meta.url,
);
const detailsUrl = new URL(
  "../data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json",
  import.meta.url,
);
const taxonomyUrl = new URL(
  "../data/research/philippines/calabarzon-laguna-cof-taxonomy-20261025.json",
  import.meta.url,
);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);

const [review, detailsBytes, taxonomyBytes, sourceRegistry] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(detailsUrl),
  readFile(taxonomyUrl),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
]);

test("MZUSP catalog record is matched while duplicate index rows and field conflicts stay visible", () => {
  assert.equal(review.inputs[0].sha256, createHash("sha256").update(detailsBytes).digest("hex"));
  assert.equal(review.inputs[1].sha256, createHash("sha256").update(taxonomyBytes).digest("hex"));
  assert.equal(review.records.length, 18);
  assert.equal(review.summary.mzuspPortalRows, 2);
  assert.equal(review.summary.mzuspUniqueSourceOccurrences, 1);
  assert.equal(review.summary.mzuspSourceIdentityMatches, 1);
  assert.equal(review.summary.mzuspRankConflicts, 1);
  assert.equal(review.summary.mzuspLicenseConflicts, 1);
  assert.equal(review.summary.mzuspLocalityAssertionConflicts, 1);

  const record = review.records.find((row) => row.sourceInstitutionCode === "MZUSP");
  assert.equal(record.catalogNumber, "118522");
  assert.equal(record.occurrenceId, "9d743c1c-b99b-4d99-bde2-8d65a9370534");
  assert.equal(record.sourceRecordTaxon, "Arius dispar");
  assert.equal(record.sourceLocality, "Laguna de Bay");
  assert.equal(record.sourceWaterBodyField, null);
  assert.equal(record.portalInterpretedRank, "family");
  assert.equal(record.portalLocalityAssertionConflict, true);
  assert.equal(record.sourceRecordHasSpeciesRank, false);
  assert.match(record.sourcePortalLicense, /BY-NC/i);
  assert.equal(record.useRightsDisposition.startsWith("hold-conflicting"), true);
  assert.equal(new Set(record.sourcePortalRecordIds).size, 2);
  assert.equal(new Set(record.sourceRecords.map((row) => row.sourceIdentity.occurrenceId)).size, 1);
  assert.ok(record.sourceRecords.every((row) => row.identityMatchesGbif && row.eventDateMatchesGbif));
  assert.equal(record.decision, "hold-no-historical-assertion");
});

test("CAS portal outage is recorded as an access gap, not as specimen absence", () => {
  const casRecords = review.records.filter((row) => row.institutionCode === "CAS");
  assert.equal(casRecords.length, 17);
  assert.ok(
    casRecords.every((row) => row.sourceCatalogStatus === "not-independently-verified-cas-collection-search-offline"),
  );
  assert.ok(casRecords.every((row) => row.decision === "hold-no-historical-assertion"));
  assert.match(review.method.casPortal.result, /not evidence that those items do not exist/i);
});

test("museum record verification retains no coordinates and admits no public occurrence rows", () => {
  assert.equal(review.summary.historicalAssertionsAdmitted, 0);
  assert.equal(review.summary.publicRecordsAdded, 0);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.decision.coordinatesIncluded, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.completeSpeciesInventoryClaimed, false);
  assert.equal(/decimalLatitude|decimalLongitude|coordinateUncertaintyInMeters/i.test(JSON.stringify(review)), false);
  assert.ok(review.records.every((row) => row.decision === "hold-no-historical-assertion"));

  const sourceIds = sourceRegistry.sources.map((source) => source.id);
  assert.ok(sourceIds.includes("calabarzon-laguna-mzusp-sibbr-catalog"));
  assert.ok(sourceIds.includes("calabarzon-laguna-cas-monarch-access-check"));
  assert.equal(sourceRegistry.sourceCount, sourceRegistry.sources.length);
});
