import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry] = await Promise.all([
  readFile(new URL("national-philippines-river-catchment-geodata-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);
const draft = await readFile(new URL(review.dataRequestDraft, base), "utf8");

test("national catchment source receipts and scoped hydrology evidence stay traceable", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(review.dataset.structuralChecks.polygonRecords, 128);
  assert.equal(review.dataset.structuralChecks.uniqueCatchmentNames, 128);
  assert.equal(review.dataset.structuralChecks.catchmentAreaThresholdKm2, 250);
  assert.equal(review.dataset.license, "CC BY 4.0");
  assert.equal(review.dataset.productsDownloaded.length, 2);
  for (const item of review.dataset.productsDownloaded) {
    assert.match(item.sha256, /^[a-f0-9]{64}$/);
    assert.ok(item.bytes > 0);
  }
  assert.equal(review.decision.speciesOccurrenceRows, 0);
  assert.equal(review.decision.regionalFishBaselineContribution, 0);
  assert.equal(review.decision.regionOverlayCompleted, false);
  assert.equal(review.relatedNationalHydrologyLead.reportedPrincipalBasins, 770);
  assert.equal(review.relatedNationalHydrologyLead.dataAcquired, false);
  assert.equal(review.relatedNationalHydrologyLead.accessAndDataLicense, "not verified");
  assert.equal(review.decision.publicationApproval, false);
  assert.equal(review.accessReview.requestSubmitted, false);
  assert.equal(review.accessReview.personalDataSubmitted, false);
  assert.equal(review.accessReview.wholeCountryHandling.includes("Business Development Officer"), true);
  assert.equal(draft.includes("prepared for Joseph to review; not sent"), true);
  assert.equal(draft.includes("whole Philippines"), true);
  assert.equal(draft.includes("do not begin a paid request"), true);
  for (const id of review.sourceIds) {
    const source = registry.sources.find((item) => item.id === id);
    assert.ok(source, "Missing source registry entry: " + id);
    assert.ok(source.access.reviewFiles.includes("national-philippines-river-catchment-geodata-review-20261024.json"));
    assert.equal(source.publicationApproval, false);
  }
});
