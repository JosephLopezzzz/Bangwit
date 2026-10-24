import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import guides from "../src/data/feeding-guides.json" with { type: "json" };

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, sourceRegistry] = await Promise.all([
  readFile(new URL("calabarzon-taal-tawilis-diet-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("publishes one attributed Taal tawilis natural-diet guide without adding an occurrence claim", () => {
  const guide = guides.taxa.find((item) => item.scientificName === "Sardinella tawilis");
  assert.ok(guide);
  assert.equal(guide.aphiaId, String(review.taxon.aphiaId));
  assert.match(guide.summary.en, /zooplankton/i);
  assert.match(guide.summary.en, /2021-2022/);
  assert.ok(guide.foods.some((food) => food.en.includes("Moina micrura")));
  assert.match(guide.studyContext.en, /not a Cavite diet survey/i);
  assert.match(guide.studyContext.en, /not.*bait advice/i);
  assert.equal(review.decision.dietGuideRowsAdded, 1);
  assert.equal(review.decision.speciesOccurrenceAssertionsAdded, 0);
  assert.equal(review.decision.otherWaterbodyDietClaimsAdded, 0);
  assert.equal(review.decision.publicDietGuideApproval, true);
});

test("pins the CC BY source to Taal Lake while keeping the regional species inventory incomplete", () => {
  const source = sourceRegistry.sources.find((item) => item.id === review.sourceId);
  const taal = scope.waterbodies.find((item) => item.id === review.waterbodyId);
  assert.ok(source);
  assert.ok(taal);
  assert.match(source.reuse.metadata, /CC BY 4\.0/);
  assert.ok(source.access.reviewFiles.includes("calabarzon-taal-tawilis-diet-review-20261024.json"));
  assert.ok(taal.sourceRefs.includes(review.sourceId));
  assert.equal(taal.publicAdmission, false);
  assert.equal(taal.fishEvidenceStatus, "not-reviewed");
  assert.equal(review.decision.regionalBaselineComplete, false);
  assert.equal(review.accessAndRights.excludedMaterial.includes("No table or figure image"), true);
});
