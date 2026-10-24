import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("central-luzon-sasmuan-wetlands-source-review-20261024.json", base), "utf8"));
const checkpoint = JSON.parse(await readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8"));

test("Sasmuan sources keep the Ramsar complex separate from the Batang Dos study reach", () => {
  assert.equal(review.siteScope.name, "Sasmuan Pampanga Coastal Wetlands (Ramsar Site 2445)");
  assert.equal(review.siteScope.ramsarReportedAreaHa, 3667.313);
  assert.equal(review.siteScope.gisCalculatedAreaHaInRamsarRecord, 3664.169);
  assert.deepEqual(review.siteScope.sourceReportedCoastalBarangays, ["Malusac", "Sebitanan", "Mabuanbuan", "Batang 1st", "Batang 2nd"]);
  assert.equal(review.siteScope.geometryValidated, false);
  assert.match(review.siteScope.geometryDecision, /not a municipal-water boundary/);

  const pcra = review.sources.find(({ id }) => id === "denr-penro-pampanga-sasmuan-pcra-batang-dos-2017");
  assert.match(pcra.sourceReportedAssessmentStatement, /Fish as 'to be determined'/);
  assert.equal(review.communityReportedResourceLabels.presentLabelsVerbatim.length, 26);
  assert.equal(review.communityReportedResourceLabels.pastOrRarelyCaughtLabelsVerbatim.length, 2);
  assert.match(review.communityReportedResourceLabels.interpretationLimits.join(" "), /combines fishes, crustaceans and mollusks/);
  assert.match(review.communityReportedResourceLabels.interpretationLimits.join(" "), /26 present labels despite saying 'Top ten'/);

  const waterbirdList = review.sources.find(({ id }) => id === "denr-penro-sasmuan-waterbird-census-attachment-2010-2020");
  assert.match(waterbirdList.access, /waterbirds, not a fish taxonomic checklist/);
});

test("Sasmuan local labels remain unresolved research context with no app or geometry projection", () => {
  assert.equal(review.coverageAndAdmission.scientificFishTaxaIndependentlyVerified, 0);
  assert.equal(review.coverageAndAdmission.communityLabelsTaxonomicallyResolved, 0);
  assert.equal(review.coverageAndAdmission.currentPresenceTodayEstablished, false);
  assert.equal(review.coverageAndAdmission.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.coverageAndAdmission.dietClaimsAdded, 0);
  assert.equal(review.coverageAndAdmission.foodSafetyClaimsAdded, 0);
  assert.equal(review.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(review.coverageAndAdmission.geometryAdded, false);
  assert.equal(review.coverageAndAdmission.coordinatesProjected, false);
  assert.equal(review.coverageAndAdmission.regionalReleaseApproved, false);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.sasmuanWetlandsSourceReviewFile, "central-luzon-sasmuan-wetlands-source-review-20261024.json");
  assert.match(checkpoint.nextStep.action, /Central Luzon source discovery/);
});
