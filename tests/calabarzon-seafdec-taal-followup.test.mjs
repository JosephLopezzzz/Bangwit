import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-seafdec-taal-followup-20261024.json", import.meta.url);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, coverageSweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("SEAFDEC Taal assessment stays a metadata-only historical lead until access and reuse are resolved", () => {
  assert.equal(review.source.id, "seafdec-2013-taal-fishery-resource-assessment");
  assert.equal(review.source.waterbodyIds.length, 1);
  assert.equal(review.source.waterbodyIds[0], "ph-wb-taal-lake");
  assert.equal(review.source.metadataFactsHeld.totalOrganismSpeciesReported, 47);
  assert.equal(review.source.metadataFactsHeld.finfishSpeciesReported, 38);
  assert.equal(review.source.metadataFactsHeld.siteSpecificSpeciesTableAvailableInRepository, false);
  assert.equal(review.reuseReview.status, "item-specific-license-unverified");
  assert.equal(review.admittedSpeciesAssertions, 0);
  assert.equal(review.publicProjection, false);

  const source = sourceRegistry.sources.find((row) => row.id === review.source.id);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.researchStatus, "historical-fishery-metadata-lead-only-no-assertions-admitted");

  const followUp = coverageSweep.additionalPrimarySourceFollowUps.find((row) => row.sourceId === review.source.id);
  assert.ok(followUp);
  assert.equal(followUp.reviewFile, "calabarzon-seafdec-taal-followup-20261024.json");
  assert.equal(followUp.admittedSpeciesAssertions, 0);
});
