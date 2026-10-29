import assert from "node:assert/strict";
import { test } from "node:test";
import review from "../data/research/philippines/calabarzon-laguna-gbif-triage-20261025.json" with { type: "json" };
import sources from "../data/research/philippines/sources.json" with { type: "json" };

test("triages Laguna de Bay GBIF records without admitting public occurrences", async () => {
  assert.equal(review.status, "dataset-rights-and-COL-XR-crosswalk-reviewed;record-admission-pending");
  assert.equal(review.screenInput.sha256, "cd969bdbd33ab570f510578100f030076acfef661239567bb59f6b53bfbb6dfc");
  assert.equal(review.screenInput.uniqueRecordCount, 61);
  assert.equal(review.screenInput.speciesRankRecordCount, 51);
  assert.equal(review.summary.datasetCount, 7);
  assert.equal(review.summary.distinctRecordedNameFamilyPairs, 35);
  assert.equal(review.summary.acceptedColTaxa, 27);
  assert.equal(review.summary.colIndexStableDuringRun, true);
  assert.equal(review.summary.datasetLicenseMismatches, 0);
  assert.deepEqual(review.summary.taxonomyClassifications, [
    { classification: "exact-species", count: 18 },
    { classification: "synonym", count: 17 },
  ]);
  assert.deepEqual(review.summary.recordDispositionCounts, [
    { status: "candidate-for-independent-locality-review", count: 18 },
    { status: "excluded-from-species-candidate-queue", count: 10 },
    { status: "held-for-review", count: 33 },
  ]);

  assert.equal(
    review.datasetSummary.every((dataset) => dataset.licenseReconcilesAllRows),
    true,
  );
  assert.equal(review.recordReviews.length, 61);
  assert.equal(
    review.recordReviews.every((record) => record.basisOfRecord === "PRESERVED_SPECIMEN"),
    true,
  );
  assert.equal(
    review.recordReviews.every((record) => !("decimalLatitude" in record) && !("decimalLongitude" in record)),
    true,
  );
  assert.equal(review.decision.admittedSpeciesAssertions, 0);
  assert.equal(review.decision.publicRecordsAdded, 0);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.completeSpeciesInventoryClaimed, false);

  const occurrenceSource = sources.sources.find((source) => source.id === "gbif-occurrence-downloads");
  const taxonomySource = sources.sources.find((source) => source.id === "gbif-col-xr-taxonomy-matching");
  const reviewFile = "calabarzon-laguna-gbif-triage-20261025.json";
  const rawPath = "raw/calabarzon-laguna-gbif-triage-20261025/";
  assert.ok(occurrenceSource.access.reviewFiles.includes(reviewFile));
  assert.ok(occurrenceSource.access.additionalRawPaths.includes(rawPath));
  assert.ok(taxonomySource.access.reviewFiles.includes(reviewFile));
  assert.ok(taxonomySource.access.additionalRawPaths.includes(rawPath));
});

test("keeps conflicting localities and below-species records out of the candidate set", () => {
  for (const gbifId of ["863129048", "1320681168"]) {
    const record = review.recordReviews.find((candidate) => candidate.gbifId === gbifId);
    assert.equal(record.disposition.status, "held-for-review");
    assert.ok(record.disposition.holds.includes("waterBody-field-conflict"));
  }

  for (const record of review.recordReviews.filter((candidate) => candidate.rank !== "SPECIES")) {
    assert.equal(record.disposition.status, "excluded-from-species-candidate-queue");
    assert.ok(record.disposition.holds.includes("below-species-rank"));
  }

  for (const record of review.recordReviews.filter(
    (candidate) => candidate.disposition.status === "candidate-for-independent-locality-review",
  )) {
    assert.match(record.locality, /laguna\s+de\s+bay/i);
    assert.ok(record.eventDate);
    assert.ok(
      [
        "http://creativecommons.org/publicdomain/zero/1.0/legalcode",
        "http://creativecommons.org/licenses/by/4.0/legalcode",
      ].includes(record.license),
    );
    assert.ok(["exact-species", "synonym"].includes(record.taxonomyClassification));
  }
});
