import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const review = JSON.parse(await readFile(
  new URL("../data/research/philippines/central-luzon-pantabangan-source-reconciliation-20261024.json", import.meta.url),
  "utf8",
));

test("Pantabangan source conflicts and rights limits remain research-only", () => {
  assert.equal(review.status, "source-reconciliation-research-only-not-app-ready");
  assert.equal(review.sources.length, 6);

  const barcode = review.sources.find((source) => source.id === "pantabangan-dam-dna-fish-inventory-2026");
  assert.equal(barcode.abstractClaims.coiSequences, 40);
  assert.equal(barcode.abstractClaims.species, 9);
  assert.equal(barcode.abstractClaims.namesVisibleInAbstract.length, 5);
  assert.ok(barcode.unverified.some((item) => /Sequence accessions/.test(item)));

  const olderSurvey = review.sources.find((source) => source.id === "nast-nueva-ecija-freshwater-survey-2006");
  assert.equal(olderSurvey.sourceReportedScope.length, 5);
  assert.equal(olderSurvey.sourceReportedRichness.endemicAndIndigenousAllGroups, 12);
  assert.equal(olderSurvey.localAcquisition.sha256, "575bcd5102c9b7c4070dbbf2ae94098ce37474a1bd3621663c5bb62dfe994288");

  const communityStudy = review.sources.find((source) => source.id === "pantabangan-largemouth-bass-community-study-2024");
  assert.equal(communityStudy.internalCountConflict.blackchinBoatsWithNonzeroTableCounts, 4);
  assert.equal(communityStudy.internalCountConflict.resultsTextBoatsClaimed, 3);
  assert.match(communityStudy.licenseConflict, /CC BY-NC 4.0.*CC BY 4.0/);

  const diet = review.sources.find((source) => source.id === "pantabangan-largemouth-bass-diet-study-2024");
  assert.match(diet.dietLimit, /does not name prey species/);
  assert.equal(review.appUse.speciesAssertionsAdded, 0);
  assert.equal(review.appUse.dietClaimsAdded, 0);
  assert.equal(review.appUse.geometryAdded, false);
  assert.equal(review.appUse.publicChecklistChanged, false);
  assert.equal(review.appUse.regionalReleaseApproved, false);
});
