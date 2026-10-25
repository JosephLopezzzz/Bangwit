import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, scope] = await Promise.all([
  readFile(new URL("calabarzon-tayabas-bay-cas-rights-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
]);

test("Tayabas Bay waterBody search identifies six CAS candidates but not publishable rights", () => {
  assert.equal(review.waterbodyId, "ph-wb-tayabas-bay");
  assert.equal(review.search.localityQuery.returnedRecords, 0);
  assert.equal(review.search.waterBodyQuery.returnedRecords, 6);
  assert.equal(review.search.selectedRecordReceiptSet.recordCount, 6);
  assert.equal(review.search.waterBodyQuery.datasetKey, "5d6c10bd-ea31-4363-8b79-58c96d859f5b");
  assert.match(review.search.waterBodyQuery.rawSha256, /^[a-f0-9]{64}$/);
  assert.match(review.search.selectedRecordReceiptSet.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.dataset.doi, "10.15468/efh2ib");
  assert.equal(review.dataset.gbifLicense, "CC0 1.0");
  assert.equal(review.publisherTerms.conflictsWithOpenDatasetLicense, true);
  assert.match(review.publisherTerms.shortQuote, /not be repackaged, resold, or redistributed/);
  assert.equal(review.qualityReview.allHaveExplicitWaterBodyField, true);
  assert.equal(review.qualityReview.allHaveHistoricalEventDates, true);
  assert.equal(review.qualityReview.allCarryContinentInvalidFlag, true);
  assert.equal(review.qualityReview.allCarryOccurrenceStatusInferredFromIndividualCountFlag, true);
  assert.equal(review.qualityReview.coordinateUncertaintyMeters.usedForMapDisplay, false);
  assert.equal(review.qualityReview.recordNamesAndCoordinatesStoredInTrackedReview, false);
  assert.equal(review.decision.historicalSpeciesAssertionsAdmitted, 0);
  assert.equal(review.decision.publicProjection, false);
  assert.equal(review.decision.coordinatesPublished, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.absenceInferredFromLocalityQueryZero, false);
  assert.equal("records" in review, false);
  assert.equal("scientificNames" in review, false);
  assert.equal("catalogNumbers" in review, false);
  assert.equal("coordinates" in review, false);
});

test("Tayabas Bay source lead stays research-only and does not change the scope assignment", () => {
  assert.ok(registry.sources.some((source) => source.id === review.sourceRegistryId));
  const bay = scope.waterbodies.find((waterbody) => waterbody.id === review.waterbodyId);
  assert.ok(bay);
  assert.ok(!bay.sourceRefs.includes(review.sourceRegistryId));
  assert.equal(bay.publicAdmission, false);
});
