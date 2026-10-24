import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-waterbody-source-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("BFAR Bulacan profile contributes discovery names, not a fish checklist", () => {
  assert.equal(review.bfarProfile.namedCommunalInlandFeatures.length, 22);
  assert.ok(review.bfarProfile.namedCommunalInlandFeatures.includes("Angat Dam Watershed"));
  assert.ok(review.bfarProfile.namedCommunalInlandFeatures.includes("Meycauayan River"));
  assert.match(review.bfarProfile.limits.join(" "), /species-by-river/);
  assert.equal(review.disposition.speciesRowsTranscribed, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
  const source = registry.sources.find((row) => row.id === review.sources.bfarProfile.id);
  assert.ok(source); assert.equal(source.license, null); assert.equal(source.publicationApproval, false);
});

test("Angat EMB monitoring stations stay separate from fish evidence and safety claims", () => {
  const stations = review.embMonitoringLead.stations;
  assert.equal(stations.length, 3);
  assert.deepEqual([stations[0].latitude, stations[0].longitude], [14.957, 120.907]);
  assert.match(review.embMonitoringLead.coordinateMeaning, /not fish capture coordinates/);
  assert.match(review.embMonitoringLead.reportedWaterQualityContext, /sample dates.*not verified/);
  const source = registry.sources.find((row) => row.id === review.sources.embReport.id);
  assert.ok(source); assert.equal(source.license, null); assert.equal(source.publicationApproval, false);
  assert.match(source.access.status, /403/);
});

test("Bulacan waterbody-source lead is research-only and Central Luzon remains incomplete", () => {
  const inventory = checkpoint.waterbodyInventorySourceLeads.find((row) => row.id === "bfar-bulacan-communal-inland-list");
  assert.ok(inventory); assert.equal(inventory.namedFeatureCount, 22);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.bulacanWaterbodySourceReviewFile, "central-luzon-bulacan-waterbody-source-review-20261024.json");
  assert.match(checkpoint.nextStep.action, /do not infer current safety or fish presence/);
  assert.equal(registry.sourceCount, registry.sources.length);
});
