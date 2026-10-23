import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const review = JSON.parse(
  await readFile(
    new URL("../data/research/philippines/caliraya-lumot-gbif-source-review.json", import.meta.url),
    "utf8",
  ),
);
const aabeReview = JSON.parse(
  await readFile(
    new URL("../data/research/philippines/caliraya-lumot-aabe-source-review.json", import.meta.url),
    "utf8",
  ),
);
const registry = JSON.parse(
  await readFile(new URL("../data/research/philippines/sources.json", import.meta.url), "utf8"),
);
const scope = JSON.parse(
  await readFile(new URL("../data/research/philippines/calabarzon-scope.json", import.meta.url), "utf8"),
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

test("Caliraya and Lumot conference abstract is a held source lead, not a species admission", () => {
  assert.equal(aabeReview.batchId, "caliraya-lumot-aabe-abstract-rights-review-20261023");
  assert.equal(aabeReview.admittedSpeciesAssertions, 0);
  assert.equal(aabeReview.waterbodies.length, 2);
  assert.deepEqual(aabeReview.abstractReportedFactsHeld.reportedSpeciesRichness, {
    Caliraya: 8,
    Lumot: 9,
  });
  assert.equal(aabeReview.abstractReportedFactsHeld.completeSpeciesList, "Not present in the abstract.");
  assert.equal(aabeReview.reuseReview.status, "item-specific-reuse-rights-unverified");
  assert.match(aabeReview.source.copyrightEvidence, /All rights reserved/);
  assert.match(aabeReview.decision, /hold-all-study-derived-species-claims/);
  assert.ok(aabeReview.nonClaims.some((claim) => claim.includes("not admitted")));

  const registeredSource = registry.sources.find((source) => source.id === "aabe-2022-caliraya-lumot-fish-study");
  assert.ok(registeredSource);
  assert.equal(registeredSource.publicationApproval, false);
  assert.equal(registry.sourceCount, registry.sources.length);
  for (const { waterbodyId } of aabeReview.waterbodies) {
    const waterbody = scope.waterbodies.find((item) => item.id === waterbodyId);
    assert.ok(waterbody);
    assert.ok(waterbody.sourceRefs.includes(registeredSource.id));
    assert.equal(waterbody.publicAdmission, false);
    assert.match(waterbody.reviewStatus, /reuse-rights-pending/);
  }
});
