import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const research = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, sweep, scope, projection] = await Promise.all([
  readFile(new URL("calabarzon-cas-manila-bay-record-screen-20261024.json", research), "utf8"),
  readFile(new URL("sources.json", research), "utf8"),
  readFile(new URL("calabarzon-coverage-source-sweep.json", research), "utf8"),
  readFile(new URL("calabarzon-scope.json", research), "utf8"),
  readFile(new URL("../src/data/cavite-historical-evidence.json", import.meta.url), "utf8"),
].map((value) => value.then(JSON.parse)));

test("CAS Manila Bay record screen excludes ambiguous/outside localities and admits no new species", () => {
  assert.equal(
    review.status,
    "record-level-screen-complete-no-new-assertions-source-record-check-pending",
  );
  assert.equal(review.recordScreen.casRowsInsideNamedBayGeometry, 610);
  assert.equal(review.recordScreen.rowsWhoseLocalityTextContainsManilaBay, 149);
  assert.equal(review.recordScreen.screenedRecords, 11);
  assert.equal(review.recordScreen.newNamedBayCandidates, 7);
  const source = registry.sources.find(
    (item) => item.id === "obis-manila-bay-actinopterygii-geometry-discovery",
  );
  assert.ok(
    source.access.reviewFiles.includes("calabarzon-cas-manila-bay-record-screen-20261024.json"),
  );
  assert.equal(source.publicationApproval, false);
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 61);
  assert.equal(
    sweep.additionalOpenDataFollowUps.find((item) => item.sourceId === source.id)
      .recordLevelReviewFile,
    "calabarzon-cas-manila-bay-record-screen-20261024.json",
  );
});

test("all screened CAS records retain their source identity, locality, date, uncertainty, and decision", () => {
  assert.equal(review.candidateRecords.length, 11);
  assert.equal(new Set(review.candidateRecords.map((record) => record.occurrenceId)).size, 11);
  assert.ok(review.candidateRecords.every((record) => record.aphiaId && record.coordinateUncertaintyMeters));
  assert.ok(review.candidateRecords.every((record) => record.locality && record.disposition.startsWith("hold-") || record.alreadyInAppProjection));
  assert.equal(
    review.candidateRecords.filter((record) => record.alreadyInAppProjection).length,
    2,
  );
  assert.equal(review.sourceChecks.sourceRecordIndependentlyOpened, false);
  assert.equal(review.sourceChecks.taxonomy.acceptedNameChecksCompleted, 6);
  assert.equal(review.sourceChecks.taxonomy.acceptedNameChecksPending, 1);
});

test("research-only CAS screening cannot change the Cavite evidence projection or Manila Bay boundary", () => {
  assert.equal(review.decision.newHistoricalAssertionsAdmitted, 0);
  assert.equal(review.decision.publicProjection, false);
  assert.equal(projection.records.length, 12);
  assert.equal(scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-manila-bay").boundaryStatus, "not-delineated");
  assert.equal(scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-manila-bay").publicAdmission, false);
});
