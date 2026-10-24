import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-north-luzon-dna-barcoding-source-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("North Luzon barcode source retains its reported cross-region and freshwater/coastal scope", () => {
  assert.deepEqual(review.source.reportedScope, ["Aurora", "Cagayan", "Zambales"]);
  assert.equal(review.source.reportedSampling.sites, 27);
  assert.equal(review.source.reportedSampling.freshwaterRivers, 15);
  assert.equal(review.source.reportedSampling.marineMarketsAndLandingSites, 12);
  assert.equal(review.source.reportedSampling.specimens, 1513);
  assert.match(review.source.sourceCoverageNote, /Cagayan belongs to a different rollout phase/);
  assert.match(review.evidenceLimits[1], /capture locality/);
});

test("CC BY-NC-ND article tables remain untranscribed and outside app admission", () => {
  assert.equal(review.source.license, "CC BY-NC-ND 4.0");
  assert.equal(review.coverageAndAdmission.tableRowsReviewed, 0);
  assert.equal(review.coverageAndAdmission.genbankRecordsReviewed, 4);
  assert.equal(review.genbankRecordSpotCheck.records.length, 4);
  assert.ok(review.genbankRecordSpotCheck.records.every(({ reportedLocation, latitudeLongitude }) => reportedLocation === "Philippines" && latitudeLongitude === null));
  assert.match(review.genbankRecordSpotCheck.interpretation, /not enough to assign an occurrence/);
  assert.equal(review.coverageAndAdmission.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(review.coverageAndAdmission.regionalReleaseApproved, false);
  const source = registry.sources.find(({ id }) => id === review.source.id);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, "CC-BY-NC-ND-4.0");
  assert.ok(source.access.reviewFiles.includes("central-luzon-north-luzon-dna-barcoding-source-review-20261024.json"));
  assert.equal(checkpoint.northLuzonBarcodeSourceReviewFile, "central-luzon-north-luzon-dna-barcoding-source-review-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.match(checkpoint.nextStep.action, /four GenBank spot checks/i);
});
