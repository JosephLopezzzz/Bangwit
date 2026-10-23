import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const research = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("calabarzon-gbif-locality-sweep-20261023.json", research), "utf8"));
const scope = JSON.parse(await readFile(new URL("calabarzon-scope.json", research), "utf8"));
const registry = JSON.parse(await readFile(new URL("sources.json", research), "utf8"));

test("additional CALABARZON GBIF zero-result locality checks remain bounded gaps", () => {
  assert.equal(review.batchId, "calabarzon-gbif-locality-sweep-20261023");
  assert.equal(review.sourceId, "gbif-occurrence-downloads");
  assert.equal(review.admittedSpeciesAssertions, 0);
  assert.equal(review.searches.length, 5);
  assert.ok(review.searches.every((search) => search.recordCount === 0 && search.enumeratedCount === 0));
  assert.ok(
    review.searches.every((search) => search.apiUrl.includes("country=PH") && search.apiUrl.includes("limit=100")),
  );
  assert.ok(review.nonClaims.some((claim) => claim.includes("do not establish fish absence")));

  const source = registry.sources.find((item) => item.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.apiBaseUrl, "https://api.gbif.org/v1");

  for (const search of review.searches) {
    const waterbody = scope.waterbodies.find((item) => item.id === search.waterbodyId);
    assert.ok(waterbody);
    assert.ok(waterbody.sourceRefs.includes(review.sourceId));
    assert.match(waterbody.fishEvidenceStatus, /zero-no-absence-inferred/);
    assert.equal(waterbody.publicAdmission, false);
  }
});
