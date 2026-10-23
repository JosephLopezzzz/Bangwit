import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-balayan-calatagan-poster-review-20261024.json", import.meta.url);
const sourceRegistryUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, sweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourceRegistryUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("Balayan/Calatagan poster count mismatch is resolved without app admission or rank claims", () => {
  assert.equal(review.source.sourceId, "bfar-nfrdi-2025-balayan-calatagan-poster");
  assert.equal(review.source.studyPeriod, "2018-2022");
  assert.equal(review.source.posterFile.bytes, 53991132);
  assert.equal(review.source.posterFile.width, 7205);
  assert.equal(review.source.posterFile.height, 10748);
  assert.match(review.source.posterFile.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.abstractPosterComparison.repositoryAbstractTaxaListed, 9);
  assert.equal(review.abstractPosterComparison.posterTaxaVisuallyLabeled, 10);
  assert.equal(review.abstractPosterComparison.posterReportedTaxonAbsentFromAbstract, "Sardinella lemuru");
  assert.equal(review.abstractPosterComparison.posterFooterSaysArrangementIsNotRanked, true);
  assert.equal(review.reviewLimits.taxonomyIndependentlyValidated, false);
  assert.equal(review.reviewLimits.wholeBayGeometryValidated, false);
  assert.equal(review.rightsReview.itemSpecificLicenseFound, false);
  assert.equal(review.rightsReview.permissionRequested, false);
  assert.deepEqual(review.counts, {
    posterReportedNamesRecordedAsAppAssertions: 0,
    speciesAssertionsAdmitted: 0,
    publicProjection: false,
  });

  const registeredSource = sourceRegistry.sources.find((source) => source.id === review.source.sourceId);
  assert.ok(registeredSource);
  assert.equal(registeredSource.publicationApproval, false);
  assert.equal(registeredSource.researchStatus, "poster-visually-reviewed; item-specific-reuse-rights-pending; no-species-assertions-admitted");

  const followUp = sweep.additionalPrimarySourceFollowUps.find((item) => item.sourceId === review.source.sourceId);
  assert.ok(followUp);
  assert.equal(followUp.reviewFile, "calabarzon-balayan-calatagan-poster-review-20261024.json");
  assert.equal(followUp.sourceFactsHeld.posterTaxaLabeled, 10);
  assert.equal(followUp.sourceFactsHeld.taxonomyIndependentlyValidated, false);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
});
