import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, sweep, draft, audit] = await Promise.all([
  readFile(new URL("calabarzon-vipcorals-verde-island-source-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-vipcorals-data-access-inquiry-draft-20261024.md", base), "utf8"),
  readFile(new URL("gbif-actinopterygii-retired-key-correction-20261024.json", base), "utf8").then(JSON.parse),
]);

test("VIP CORALS Verde Island remains a metadata/access lead, not a species inventory", () => {
  assert.equal(review.status, "official-collection-metadata-lead-only-public-catalog-in-progress");
  assert.equal(review.hub.fishImageTilesVisible, 5);
  assert.equal(review.hub.scientificNamesVisible, false);
  assert.equal(review.surveyProject.fieldworksReported, 2);
  assert.equal(review.publication.fishSpecimensReported, 44);
  assert.equal(review.publication.fishSpeciesReported, null);
  assert.equal(review.contactRoute.primaryOfficialEmail, "vipcorals@g.batstate-u.edu.ph");
  assert.equal(review.contactRoute.secondaryEmailListedOnHub, "vipcorals.batstateu@gmail.com");
  assert.equal(review.contactRoute.messageSent, false);
  assert.equal(review.gbifCheck.queries.length, 4);
  assert.equal(review.gbifCheck.totalReturnedRecords, 0);
  assert.equal(audit.correctedCalabarzonSearch.queryCounts["Verde Island"], 2);
  assert.ok(audit.invalidatedReviews.includes("calabarzon-vipcorals-verde-island-source-review-20261024.json"));
  assert.ok(review.gbifCheck.queries.every((query) => query.responseCount === 0 && /^[a-f0-9]{64}$/.test(query.responseSha256)));
  assert.match(draft, /Draft only/i);
  assert.match(draft, /Philippines in stages/);
  assert.match(draft, /public web app/);
  assert.match(draft, /will not reuse the hub's images unless separately authorized/);
  assert.equal(review.rightsAndScope.catalogueDataLicenseDisplayed, false);
  assert.equal(review.rightsAndScope.dataRequestSent, false);
  assert.deepEqual(review.counts, {
    speciesRowsAcquired: 0,
    gbifFishRecordsReturned: 0,
    speciesAssertionsAdmitted: 0,
    publicProjection: false,
  });

  assert.equal(registry.sourceCount, registry.sources.length);
  for (const id of [
    "batstateu-vipcorals-marine-repository-hub",
    "batstateu-verde-island-vulnerable-threatened-marine-organism-survey",
    "rula-2020-vipcorals-marine-repository-hub-paper",
  ]) {
    assert.ok(registry.sources.some((source) => source.id === id && source.publicationApproval === false));
  }
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 61);
  const followUp = sweep.additionalPrimarySourceFollowUps.find(
    (item) => item.sourceId === "batstateu-vipcorals-marine-repository-hub",
  );
  assert.ok(followUp);
  assert.equal(followUp.sourceFactsHeld.fishSpecimensReported, 44);
  assert.equal(followUp.sourceFactsHeld.fishSpeciesReported, null);
  assert.equal(followUp.inquiryPrepared, true);
  assert.equal(followUp.inquirySent, false);
  assert.equal(followUp.admittedSpeciesAssertions, 0);

  const gbifFollowUp = sweep.additionalOpenDataFollowUps.find(
    (item) => item.reviewFile === "calabarzon-vipcorals-verde-island-source-review-20261024.json",
  );
  assert.ok(gbifFollowUp);
  assert.equal(gbifFollowUp.searches.length, 4);
  assert.equal(gbifFollowUp.totalReturnedRecords, 0);
  assert.match(gbifFollowUp.decision, /not-an-absence-claim/);

  const obisFollowUp = sweep.additionalOpenDataFollowUps.find(
    (item) => item.reviewFile === "calabarzon-obis-philippines-area-review-20261024.json",
  );
  assert.ok(obisFollowUp);
  assert.equal(obisFollowUp.areaId, "191");
  assert.equal(obisFollowUp.actinopterygiiOccurrenceRecords, 128352);
  assert.match(obisFollowUp.decision, /checklist-count-unreconciled/);
});
