import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("central-luzon-candaba-inventory-review-20261024.json", base), "utf8"));
const checkpoint = JSON.parse(await readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8"));

test("Candaba keeps historical source scopes and counts separate", () => {
  assert.equal(review.status, "historical-source-review-research-only-not-app-ready");
  assert.equal(review.waterbody.geometryValidated, false);
  assert.equal(review.crossSourceReconciliation.countsAreComparable, false);
  assert.equal(review.crossSourceReconciliation["2020SourceReportedTaxonStringCount"], 14);
  assert.match(review.crossSourceReconciliation["2020CountConflict"], /five plus ten implies 15/);

  const paper2020 = review.sources.find(({ id }) => id === "mallari-bagunu-salas-candaba-fish-inventory-2020");
  assert.equal(paper2020.sourceReportedCount, 14);
  assert.equal(paper2020.sourceReportedTaxonStrings.length, 14);
  assert.ok(paper2020.sourceReportedTaxonStrings.includes("Hypostomus plecostomus"));
  assert.match(paper2020.qualityIssues.join(" "), /Hito/);
  assert.match(paper2020.reuse, /not independently verified/);
  assert.equal(paper2020.disposition.includes("No accepted taxonomy"), true);

  const garcia2010 = review.sources.find(({ id }) => id === "garcia-candaba-wetland-fish-composition-2010");
  assert.equal(garcia2010.sourceReportedAggregate.fishSpeciesCaught, 21);
  assert.equal(garcia2010.sourceReportedAggregate.speciesWithLengthWeightRelationshipsReported, 18);
  assert.match(garcia2010.disposition, /do not infer or copy species identities/);

  const thesis1988 = review.sources.find(({ id }) => id === "habito-candaba-aquatic-fauna-thesis-1988");
  assert.equal(thesis1988.sourceReportedAggregate.freshwaterFishSpecies, 8);
  assert.match(thesis1988.access, /not available in the repository/);
});

test("Candaba review creates no app-ready claims and remains an incomplete regional lead", () => {
  assert.equal(review.coverageAndAdmission.speciesRowsIndependentlyVerified, 0);
  assert.equal(review.coverageAndAdmission.speciesAssertionsAdded, 0);
  assert.equal(review.coverageAndAdmission.dietClaimsAdded, 0);
  assert.equal(review.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(review.coverageAndAdmission.publicChecklistChanged, false);
  assert.equal(review.coverageAndAdmission.regionalReleaseApproved, false);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.candabaSourceReviewFile, "central-luzon-candaba-inventory-review-20261024.json");
  assert.match(checkpoint.nextStep.action, /Angat reservoir and river/);
});
