import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const researchDir = new URL("../data/research/philippines/", import.meta.url);
const [review, laterStudy] = await Promise.all([
  "central-luzon-bataan-cross-study-conflict-review-20261024.json",
  "central-luzon-bataan-river-table-review-20261024.json",
].map((name) => readFile(new URL(name, researchDir), "utf8").then(JSON.parse)));

test("Bataan cross-study review records conflicts and keeps every assertion out of the app", () => {
  assert.equal(review.status, "cross-study-conflicts-found-all-rows-held");
  assert.equal(review.source.studyPeriod, "2020-12 through 2021-11");
  assert.equal(review.source.authorOverlapWith2025.sharedAuthorCount, 6);
  assert.equal(review.source.reuseReview.status, "item-specific-license-or-permission-unverified");
  assert.equal(review.source.reuseReview.licenseFoundInRetrievedPdf, false);

  const [richnessCounts, sharedCount, tableCount] = review.withinSourceConflicts;
  assert.deepEqual(richnessCounts.abstract, { totalSpecies: 50, talisaySpecies: 28, bagacSpecies: 37 });
  assert.deepEqual(richnessCounts.resultsText, { totalSpecies: 50, talisaySpecies: 30, bagacSpecies: 38 });
  assert.equal(sharedCount.resultsTextReportedCount, 13);
  assert.equal(sharedCount.numberOfTaxonMentionsInFollowingList, 15);
  assert.equal(tableCount.transcribedTableEntryLines, 52);
  assert.equal(tableCount.genusOnlyEntries, 8);

  const laterRows = new Map(laterStudy.sourceTableReview.records.map((row) => [row.sourceName, row]));
  const conflicts = review.comparisonWith2025Survey.presenceConflicts;
  assert.equal(review.comparisonWith2025Survey.sharedNameRowsAfterTwoSourceSpellingNormalizations, 26);
  assert.equal(review.comparisonWith2025Survey.sameReportedTalisayAndBagacPresence, 23);
  assert.equal(conflicts.length, 3);
  for (const conflict of conflicts) {
    assert.deepEqual(conflict["2025"], {
      Talisay: laterRows.get(conflict.name).presence.Talisay,
      Bagac: laterRows.get(conflict.name).presence.Bagac,
    });
  }

  assert.equal(review.admission.speciesAssertions, 0);
  assert.equal(review.admission.appProjections, 0);
  assert.equal(review.admission.regionalReleaseApproved, false);
  assert.match(review.decision, /Do not use either table to independently validate identities or publish species claims/);
});
