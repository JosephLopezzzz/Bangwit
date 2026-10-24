import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("central-luzon-minalin-channel-fish-table-review-20261024.json", base), "utf8"));
const checkpoint = JSON.parse(await readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8"));

test("Minalin table preserves source rows, seasonality, and attribution", () => {
  assert.equal(review.status, "research-only-source-table-transcribed-taxonomy-pending");
  assert.equal(review.source.license, "CC-BY-4.0");
  assert.equal(review.source.sourceReportedSampling.stations, 3);
  assert.equal(review.source.sourceReportedSummary.unionTaxonRows, 24);
  assert.equal(review.sourceTableReview.rowCount, 24);
  assert.equal(review.sourceTableReview.records.length, 24);
  assert.deepEqual(review.sourceTableReview.reconciledPresenceCounts, { drySeason: 17, wetSeason: 19, union: 24 });
  assert.equal(review.sourceTableReview.records.filter(({ drySeason }) => drySeason).length, 17);
  assert.equal(review.sourceTableReview.records.filter(({ wetSeason }) => wetSeason).length, 19);
  assert.equal(review.sourceTableReview.records.filter(({ sourceGroup }) => sourceGroup === "freshwater fishes").length, 16);
  assert.equal(review.sourceTableReview.records.filter(({ sourceGroup }) => sourceGroup === "marine fishes").length, 8);
  assert.ok(review.sourceTableReview.records.some(({ sourceNameVerbatim }) => sourceNameVerbatim === "Ctenophangyrodon idella"));
  assert.ok(review.sourceTableReview.records.some(({ sourceNameVerbatim }) => sourceNameVerbatim === "Neogobius sp."));
});

test("Minalin remains historical, gear-specific evidence with no app projection", () => {
  assert.equal(review.scopeAndUse.sourceRowsIndependentlyVerified, 0);
  assert.equal(review.scopeAndUse.acceptedTaxa, 0);
  assert.equal(review.scopeAndUse.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.scopeAndUse.dietClaimsAdded, 0);
  assert.equal(review.scopeAndUse.appProjectionsAdded, 0);
  assert.equal(review.scopeAndUse.geometryAdded, false);
  assert.equal(review.scopeAndUse.coordinatesProjected, false);
  assert.equal(review.scopeAndUse.currentPresenceClaimed, false);
  assert.equal(review.scopeAndUse.completePampangaBasinChecklist, false);
  assert.equal(review.scopeAndUse.regionalReleaseApproved, false);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  const lead = checkpoint.waterbodyLeads.inlandAndBrackish.find(({ name }) => name === "Minalin Channel");
  assert.ok(lead);
  assert.ok(lead.reviewFiles.includes("central-luzon-minalin-channel-fish-table-review-20261024.json"));
});
