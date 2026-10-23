import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-sampaloc-lake-gbif-locality-review-20261024.json", import.meta.url);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, coverageSweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("Sampaloc exact-locality GBIF rows stay a non-fish coverage check, not an absence claim", () => {
  assert.equal(review.waterbodyId, "ph-wb-sampaloc-san-pablo-lake");
  assert.deepEqual(review.counts, {
    preservedSpecimenRecordsReviewed: 6,
    bacteriaRecords: 2,
    copepodRecords: 4,
    fishRecords: 0,
    fishAssertionsAdmitted: 0,
    publicProjection: false,
  });
  assert.equal(review.records.length, 6);
  assert.ok(review.records.every((row) => row.basisOfRecord === "PRESERVED_SPECIMEN"));
  assert.ok(review.records.every((row) => row.class === "Cyanobacteriia" || row.class === "Copepoda"));
  assert.equal(review.records.filter((row) => row.class === "Cyanobacteriia").length, 2);
  assert.equal(review.records.filter((row) => row.class === "Copepoda").length, 4);
  assert.ok(review.records.filter((row) => row.class === "Copepoda").every((row) => row.issues.includes("CONTINENT_DERIVED_FROM_COORDINATES")));
  assert.ok(review.source.querySnapshots.every((query) => /^[a-f0-9]{64}$/.test(query.rawSha256)));
  assert.ok(review.nonClaims.some((claim) => claim.includes("not evidence that Sampaloc Lake has no fish")));

  const source = sourceRegistry.sources.find((row) => row.id === review.source.id);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  const followUp = coverageSweep.additionalPrimarySourceFollowUps.find((row) => row.sourceId === review.source.id);
  assert.ok(followUp);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
});
