import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, sweep, draft] = await Promise.all([
  readFile(new URL("calabarzon-vipcorals-verde-island-source-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-vipcorals-data-access-inquiry-draft-20261024.md", base), "utf8"),
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
  assert.match(draft, /Draft only/i);
  assert.match(draft, /Philippines in stages/);
  assert.match(draft, /public web app/);
  assert.match(draft, /will not reuse the hub's images unless separately authorized/);
  assert.equal(review.rightsAndScope.catalogueDataLicenseDisplayed, false);
  assert.equal(review.rightsAndScope.dataRequestSent, false);
  assert.deepEqual(review.counts, {
    speciesRowsAcquired: 0,
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
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, registry.sources.length);
  const followUp = sweep.additionalPrimarySourceFollowUps.find(
    (item) => item.sourceId === "batstateu-vipcorals-marine-repository-hub",
  );
  assert.ok(followUp);
  assert.equal(followUp.sourceFactsHeld.fishSpecimensReported, 44);
  assert.equal(followUp.sourceFactsHeld.fishSpeciesReported, null);
  assert.equal(followUp.inquiryPrepared, true);
  assert.equal(followUp.inquirySent, false);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
});
