import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, scopeBytes, sourceBytes, reportBytes] = await Promise.all([
  readFile(new URL("calabarzon-morong-river-gbif-candidate-review-20261026.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(sourceBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Morong River GBIF candidate remains held when geography, identity, and rights conflict", () => {
  assert.equal(review.waterbodyId, "ph-wb-morong-rizal-river");
  assert.equal(review.discoveryQuery.queries.length, 4);
  assert.deepEqual(
    review.discoveryQuery.queries.map(({ field, value, totalRecords }) => [field, value, totalRecords]),
    [
      ["waterBody", "Morong River", 1],
      ["locality", "Morong River", 1],
      ["waterBody", "Morong River, Rizal", 0],
      ["locality", "Morong River, Rizal", 0],
    ],
  );
  assert.equal(review.discoveryQuery.uniqueOccurrenceCount, 1);
  assert.ok(review.discoveryQuery.queries.every((query) => query.httpStatus === 200));
  assert.ok(review.discoveryQuery.queries.every((query) => query.rawResponse.bytes > 0));
  assert.ok(review.discoveryQuery.queries.every((query) => /^[a-f0-9]{64}$/.test(query.rawResponse.sha256)));
  assert.equal(review.candidateReview.trackedRecordFieldsRetained, false);
  assert.equal(review.candidateReview.coordinateAndGeoreferenceConflict, true);
  assert.equal(review.candidateReview.specimenIdentificationIndependentlyVerified, false);
  assert.equal(review.rightsReview.termsConflict, true);
  assert.equal(review.rightsReview.publicRedistributionApproved, false);
  assert.equal(review.taxonomyReview.sourceNameCrosswalkSettled, false);
  assert.equal(review.collectionCatalogReview.recordSpecificCatalogEntryRetrieved, false);
  assert.equal(review.decision.waterbodyAssignment, false);
  assert.equal(review.decision.speciesAssertionsAdmitted, 0);
  assert.equal(review.decision.publicProjection, false);
  assert.equal(review.decision.coordinatesPublished, false);
  assert.equal(review.decision.currentPresenceInferred, false);

  const waterbody = scope.waterbodies.find((item) => item.id === review.waterbodyId);
  assert.ok(waterbody);
  assert.ok(review.sourceIds.every((sourceId) => waterbody.sourceRefs.includes(sourceId)));
  assert.equal(waterbody.fishEvidenceStatus, "GBIF-text-hit-geography-conflict-held; no assertion");
  assert.equal(waterbody.reviewStatus, "geography-conflict-held");
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.match(waterbody.scopeNote, /identity, taxonomy, and redistribution terms remain unresolved/i);

  for (const sourceId of review.sourceIds) {
    assert.ok(registry.sources.some((source) => source.id === sourceId));
  }
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.morongGbifCandidateReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.sourceAssignments, 245);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 70);
  assert.equal(report.coverageSummary.registeredSources, 175);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 12);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
