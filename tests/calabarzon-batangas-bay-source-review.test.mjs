import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, scope, sweep] = await Promise.all([
  readFile(new URL("calabarzon-batangas-bay-source-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
]);

test("Batangas Bay poster and GBIF checks remain bounded research leads, not app assertions", () => {
  assert.equal(review.regionId, "0400000000");
  assert.equal(review.waterbodyId, "ph-wb-batangas-bay");
  assert.equal(review.poster.sourceStudyWindow, "2020-2022");
  assert.equal(review.poster.repositoryMetadataFacts.listedTaxa, 10);
  assert.equal(review.poster.visualReview.labelsVisible, 10);
  assert.equal(review.poster.visualReview.footerExplicitlySaysLayoutIsNotRanked, true);
  assert.equal(review.poster.visualReview.speciesNamesTranscribed, false);
  assert.match(review.poster.posterFile.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.rightsAndScope.itemSpecificReuseLicenseDisplayed, false);
  assert.equal(review.rightsAndScope.permissionRequested, false);
  assert.equal(review.gbifCheck.responseCount, 0);
  assert.equal(review.gbifCheck.parameters.classKey, 204);
  assert.match(review.gbifCheck.responseSha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(review.counts, {
    publicSpeciesAssertions: 0,
    admittedGBIFRecords: 0,
    publicProjection: false,
  });

  assert.equal(registry.sourceCount, 58);
  assert.equal(registry.sources.length, 58);
  for (const id of ["nfrdi-2025-batangas-bay-dominant-fish-poster", "gbif-batangas-bay-exact-fish-locality-check"]) {
    assert.ok(registry.sources.some((source) => source.id === id && source.publicationApproval === false));
    assert.ok(scope.waterbodies.find((waterbody) => waterbody.id === review.waterbodyId)?.sourceRefs.includes(id));
  }

  const posterFollowUp = sweep.additionalPrimarySourceFollowUps.find((item) => item.sourceId === "nfrdi-2025-batangas-bay-dominant-fish-poster");
  assert.ok(posterFollowUp);
  assert.equal(posterFollowUp.admittedSpeciesAssertions, 0);
  const gbifFollowUp = sweep.additionalOpenDataFollowUps.find((item) => item.reviewFile === "calabarzon-batangas-bay-source-review-20261024.json");
  assert.ok(gbifFollowUp);
  assert.equal(gbifFollowUp.localityResults[0].records, 0);
  assert.match(gbifFollowUp.decision, /not-an-absence-claim/);
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 58);
});
