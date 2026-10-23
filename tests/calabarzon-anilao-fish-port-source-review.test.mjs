import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-anilao-fish-port-source-review-20261024.json", import.meta.url);
const sourceRegistryUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const scopeUrl = new URL("../data/research/philippines/calabarzon-scope.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, scope, sweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourceRegistryUrl, "utf8").then(JSON.parse),
  readFile(scopeUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("Anilao landing-site fish survey remains a historical rights-held lead", () => {
  assert.equal(review.waterbodyId, "ph-wb-balayan-bay");
  assert.equal(review.source.doi, "10.1016/j.marpol.2018.10.045");
  assert.equal(review.source.reportedFishSpecies, 35);
  assert.equal(review.source.reportedFamilies, 15);
  assert.equal(review.source.reportedBycatchSpecies, 7);
  assert.equal(review.accessReview.publisherFullTextResult, "HTTP 403 Forbidden");
  assert.equal(review.scopeReview.captureLocationsBySpeciesReported, false);
  assert.equal(review.scopeReview.landingSitePointIsCapturePoint, false);
  assert.equal(review.rightsReview.itemSpecificOpenLicenseFound, false);
  assert.equal(review.rightsReview.permissionRequested, false);
  assert.deepEqual(review.counts, {
    completeSpeciesListAcquired: false,
    speciesRowsExtracted: 0,
    speciesAssertionsAdmitted: 0,
    publicProjection: false,
  });

  const registeredSource = sourceRegistry.sources.find((source) => source.id === review.source.id);
  assert.ok(registeredSource);
  assert.equal(registeredSource.publicationApproval, false);
  assert.equal(registeredSource.researchStatus, "historical-landing-site-aggregate;full-text-and-reuse-rights-pending;zero-app-admissions");

  const waterbody = scope.waterbodies.find((item) => item.id === review.waterbodyId);
  assert.ok(waterbody);
  assert.ok(waterbody.sourceRefs.includes(review.source.id));
  const followUp = sweep.additionalPrimarySourceFollowUps.find((item) => item.sourceId === review.source.id);
  assert.ok(followUp);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, sourceRegistry.sources.length);
});
