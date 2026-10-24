import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const review = JSON.parse(await readFile(
  new URL("../data/research/philippines/central-luzon-cabiao-pampanga-river-fish-diet-review-20261024.json", import.meta.url),
  "utf8",
));
const registry = JSON.parse(await readFile(
  new URL("../data/research/philippines/sources.json", import.meta.url),
  "utf8",
));
const checkpoint = JSON.parse(await readFile(
  new URL("../data/research/philippines/central-luzon-discovery-checkpoint-20261024.json", import.meta.url),
  "utf8",
));
const taxonomy = JSON.parse(await readFile(
  new URL("../data/research/philippines/central-luzon-cabiao-fish-taxonomy-followup-20261024.json", import.meta.url),
  "utf8",
));

test("Cabiao fish and diet findings remain a held, historical source review", () => {
  assert.equal(review.phaseId, "L3");
  assert.equal(review.sourceId, "reyes-et-al-cabiao-pampanga-river-fish-diet-2019");
  assert.equal(review.studyDesign.siteCount, 3);
  assert.equal(review.studyDesign.siteNames, null);
  assert.equal(review.studyDesign.siteCoordinates, null);
  assert.equal(review.studyDesign.sampleTotal, 55);
  assert.equal(review.candidateFishEvidence.length, 6);
  assert.ok(review.candidateFishEvidence.every((row) => row.disposition === "held"));
  assert.ok(review.candidateFishEvidence.some((row) => row.verbatimName === "Hypoththalmichthys molitrix" && row.nameIssue.includes("Hypophthalmichthys")));
  assert.ok(review.candidateFishEvidence.some((row) => row.verbatimName === "Channa strita" && row.nameIssue.includes("Channa striata")));
  assert.ok(review.candidateFishEvidence.find((row) => row.verbatimName === "Channa strita").observedStomachContentSummary.includes("prey identity is not specified"));
  assert.equal(review.rightsAndAdmission.articleLevelReuseLicenseVerified, false);
  assert.equal(review.rightsAndAdmission.currentPresenceAssertionsAdded, 0);
  assert.equal(review.rightsAndAdmission.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.rightsAndAdmission.dietClaimsAdded, 0);
  assert.equal(review.rightsAndAdmission.appProjectionRowsAdded, 0);
  assert.equal(review.taxonomyFollowupFile, "central-luzon-cabiao-fish-taxonomy-followup-20261024.json");
  assert.equal(taxonomy.nameReviews.length, 6);
  assert.equal(taxonomy.counts.catalogNameCandidatesSupported, 6);
  assert.equal(taxonomy.counts.specimenIdentitiesIndependentlyVerified, 0);
  assert.equal(taxonomy.counts.currentPresenceAssertionsAdded, 0);
});

test("Cabiao study is traceable in the source registry and named reach inventory", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes("central-luzon-cabiao-pampanga-river-fish-diet-review-20261024.json"));

  const taxonomySource = registry.sources.find((row) => row.id === taxonomy.taxonomyAuthority.sourceId);
  assert.ok(taxonomySource);
  assert.equal(taxonomySource.publicationApproval, false);
  assert.ok(taxonomySource.access.reviewFiles.includes("central-luzon-cabiao-fish-taxonomy-followup-20261024.json"));

  const reach = checkpoint.waterbodyLeads.inlandAndBrackish.find((row) => row.name === "Pampanga River, Cabiao study reach");
  assert.ok(reach);
  assert.ok(reach.sourceIds.includes(review.sourceId));
  assert.ok(reach.reviewFiles.includes("central-luzon-cabiao-pampanga-river-fish-diet-review-20261024.json"));
  assert.equal(checkpoint.centralLuzonCabiaoPampangaRiverFishDietReviewFile,
    "central-luzon-cabiao-pampanga-river-fish-diet-review-20261024.json");
  assert.equal(checkpoint.centralLuzonCabiaoFishTaxonomyFollowupFile,
    "central-luzon-cabiao-fish-taxonomy-followup-20261024.json");
  assert.equal(checkpoint.nextStep.phaseId, "L3");
});
