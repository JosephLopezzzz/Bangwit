import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, registryBytes, scopeBytes, reportBytes] = await Promise.all([
  readFile(new URL("calabarzon-manila-bay-national-museum-gbif-screen-20261025.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes.toString("utf8"));
const registry = JSON.parse(registryBytes.toString("utf8"));
const scope = JSON.parse(scopeBytes.toString("utf8"));
const report = JSON.parse(reportBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("National Museum Manila Bay screen preserves source matches without inventing capture origins", () => {
  assert.equal(review.waterbodyId, "ph-wb-manila-bay");
  assert.equal(review.dataset.version, "1.38");
  assert.equal(review.dataset.occurrenceRows, 8225);
  assert.equal(review.dataset.license, "CC-BY-4.0");
  assert.equal(review.queries[0].resultCount, 7);
  assert.equal(review.queries[1].resultCount, 0);
  assert.equal(review.queries[2].resultCount, 0);
  assert.equal(review.queries[3].resultCount, 704);
  assert.equal(review.archiveCrosscheck.matchedRecords, 7);
  assert.equal(review.archiveCrosscheck.selectedVerbatimLocalityValuesPopulated, 0);
  assert.equal(review.archiveCrosscheck.selectedLocationRemarksValuesPopulated, 0);
  assert.equal(review.archiveCrosscheck.waterBodyColumnPresent, false);
  assert.equal(review.archiveCrosscheck.coordinateUncertaintyFieldInArchiveSchema, false);
  assert.equal(review.archiveCrosscheck.coordinatesIncludedInTrackedReview, false);
  assert.equal(review.candidateRecords.length, 7);
  assert.ok(review.candidateRecords.every((record) =>
    record.sourceStateProvince === "Cavite" &&
    record.locality === null &&
    record.waterBody === null &&
    record.coordinateFieldsWithheld &&
    record.recordLicense === "CC-BY-4.0"
  ));
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.manilaBayAssignmentsAdded, 0);
  assert.equal(review.decision.caviteWaterbodyAssignmentsAdded, 0);
  assert.equal(review.decision.captureOriginResolved, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
  for (const query of review.queries) assert.match(query.responseSha256, /^[a-f0-9]{64}$/);
});

test("Manila Bay scope and checkpoint track the screened source without claiming occurrence", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  const bay = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(source);
  assert.ok(bay);
  assert.equal(source.license, "CC-BY-4.0");
  assert.ok(source.access.reviewFiles.includes("calabarzon-manila-bay-national-museum-gbif-screen-20261025.json"));
  assert.ok(bay.sourceRefs.includes(review.sourceId));
  assert.equal(bay.publicAdmission, false);
  assert.equal(bay.boundaryStatus, "not-delineated");
  assert.equal(scope.counts.speciesAssertionsImported, 9);
  assert.equal(scope.counts.publicRecordsAdmitted, 0);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.manilaBayNationalMuseumGbifSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.reduce((total, waterbody) => total + waterbody.sourceRefs.length, 0));
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
