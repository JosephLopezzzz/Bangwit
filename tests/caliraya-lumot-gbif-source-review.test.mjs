import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const review = JSON.parse(
  await readFile(
    new URL("../data/research/philippines/caliraya-lumot-gbif-source-review.json", import.meta.url),
    "utf8",
  ),
);

test("Caliraya and Lumot GBIF locality checks do not become fish absence or fish assertions", () => {
  assert.equal(review.batchId, "caliraya-lumot-gbif-bounded-search-20261023");
  assert.equal(review.source.recordLicense, "CC-BY-4.0");
  assert.equal(review.searches.length, 2);

  const [caliraya, lumot] = review.searches;
  assert.equal(caliraya.waterbodyId, "ph-wb-caliraya-reservoir");
  assert.deepEqual(
    caliraya.queryLocalities.map((query) => query.recordCount),
    [4, 0],
  );
  assert.equal(caliraya.records.length, 4);
  assert.ok(caliraya.records.every((record) => record.class === "Copepoda"));
  assert.ok(caliraya.records.every((record) => record.scientificName === "Arctodiaptomus dorsalis (Marsh, 1907)"));
  assert.ok(caliraya.records.every((record) => record.license === "CC-BY-4.0"));
  assert.equal(new Set(caliraya.records.map((record) => record.gbifId)).size, 4);
  assert.equal(lumot.waterbodyId, "ph-wb-lumot-reservoir");
  assert.deepEqual(
    lumot.queryLocalities.map((query) => query.recordCount),
    [0, 0],
  );
  assert.equal(lumot.records.length, 0);
  assert.match(review.overallDecision, /No fish species assertions admitted/);
  assert.ok(review.nonClaims.some((claim) => claim.includes("fish absence")));
});
