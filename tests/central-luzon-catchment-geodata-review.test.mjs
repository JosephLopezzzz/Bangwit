import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const review = JSON.parse(await readFile(
  new URL("../data/research/philippines/central-luzon-national-catchment-geodata-review-20261024.json", import.meta.url),
  "utf8",
));

test("Central Luzon catchment geometry stays a limited planning source and adds no app data", () => {
  assert.equal(review.status, "planning-geometry-candidate-limited-not-app-ready");
  assert.equal(review.source.license, "CC-BY-4.0");
  assert.equal(review.acquiredInputs[0].observedRecords, 128);
  assert.equal(review.acquiredInputs[1].observedPolygonFeatures, 128);
  assert.ok(review.acquiredInputs.every((file) => /^[0-9a-f]{64}$/.test(file.sha256)));
  assert.deepEqual(review.centralLuzonNamedCatchments.map((catchment) => catchment.name), ["Pampanga", "Angat"]);
  assert.equal(review.centralLuzonNamedCatchments.find((catchment) => catchment.name === "Pampanga").catchmentAreaKm2, 7842.332);
  assert.ok(review.scopeAndAccuracyLimits.some((limit) => /not evidence that those waterbodies are absent/i.test(limit)));
  assert.ok(review.scopeAndAccuracyLimits.some((limit) => /10,540 km2.*7,842.332 km2/i.test(limit)));
  assert.equal(review.appUse.publicGeometryAdded, false);
  assert.equal(review.appUse.fishAssertionsAdded, 0);
  assert.equal(review.appUse.appProjections, 0);
  assert.equal(review.appUse.regionalReleaseApproved, false);
});
