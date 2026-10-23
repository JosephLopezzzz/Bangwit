import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-san-pablo-lake-name-variant-review-20261024.json", import.meta.url);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, coverageSweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("San Pablo lake name-variant search retains the bounded non-fish results and makes no absence claim", () => {
  assert.deepEqual(review.counts, {
    localityQueries: 6,
    occurrenceRowsReviewed: 66,
    fishRecordsInReturnedRows: 0,
    copepodRecords: 12,
    birdObservationRecords: 51,
    plantSpecimenRecords: 3,
    zeroResultQueries: 2,
    fishAssertionsAdmitted: 0,
    publicProjection: false,
  });
  assert.deepEqual(
    review.source.querySnapshots.map(({ locality, count }) => [locality, count]),
    [
      ["Lake Bunot", 4],
      ["Buot Lake", 0],
      ["Lake Mohicap", 0],
      ["Lake Yambo", 4],
      ["Lake Calibato", 3],
      ["Lake Palakpakin", 55],
    ],
  );
  assert.ok(review.source.querySnapshots.every((query) => /^[a-f0-9]{64}$/.test(query.rawSha256)));
  assert.deepEqual(
    [...new Set(review.resultGroups.map((group) => group.class))].sort(),
    ["Aves", "Copepoda", "Polypodiopsida"],
  );
  assert.equal(review.resultGroups.reduce((total, group) => total + group.recordCount, 0), 66);
  assert.equal(review.resultGroups.find((group) => group.class === "Aves").reportedTaxonLabelCount, 17);
  assert.ok(review.nonClaims.some((claim) => claim.includes("not evidence that fish are absent")));

  const source = sourceRegistry.sources.find((row) => row.id === review.source.id);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  const followUp = coverageSweep.additionalOpenDataFollowUps.find(
    (row) => row.reviewFile === "calabarzon-san-pablo-lake-name-variant-review-20261024.json",
  );
  assert.ok(followUp);
  assert.equal(followUp.fishAssertionsAdmitted, 0);
});
