import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { buildCandidateReview, readCandidateReviewInputs } from "../scripts/build-cavite-fish-candidate-review.mjs";
import { parseCsv } from "../scripts/lib/csv.mjs";

test("all fish-candidate occurrences have a reproducible publication, exclusion or pending decision", async () => {
  const inputs = await readCandidateReviewInputs();
  const result = buildCandidateReview(inputs);
  const stored = await readFile(
    new URL("../data/research/obis/cavite/cavite-obis-fish-candidate-review.csv", import.meta.url),
    "utf8",
  );
  assert.equal(result.csv, stored);
  assert.equal(new Set(result.rows.map((row) => row.candidate_species_name)).size, 27);
  assert.equal(result.rows.length, 52);
  assert.equal(result.rows.filter((row) => row.decision === "published").length, 12);
  assert.equal(result.rows.filter((row) => row.decision === "excluded-record").length, 2);
  assert.equal(result.rows.filter((row) => row.decision === "pending-review").length, 38);
  const heldReviews = result.rows.filter((row) => row.curator_review_status === "hold");
  assert.equal(heldReviews.length, 4);
  assert.ok(heldReviews.every((row) => row.decision === "pending-review"));
  assert.ok(heldReviews.every((row) => row.decision_reason.includes("Curator review on 2026-10-15: hold.")));
  assert.ok(heldReviews.every((row) => row.curator_review_source_url.startsWith("https://")));
  assert.ok(result.rows.every((row) => "source_or_shortlist_name" in row));
  assert.ok(result.rows.every((row) => !("reviewed_accepted_name" in row)));
  assert.ok(
    result.rows
      .filter((row) => row.decision === "published")
      .every((row) => row.dataset_id === "d6af0fac-8a21-4d77-8872-f10d471fc0cf"),
  );
  assert.ok(
    result.rows
      .filter((row) => row.decision === "pending-review")
      .every((row) => /not in the reviewed publication shortlist/i.test(row.decision_reason)),
  );
  assert.ok(
    result.rows
      .find((row) => row.decision === "excluded-record")
      .decision_reason.includes("does not exclude the taxon from all locations"),
  );
  const excludedMuseumRecord = result.rows.find((row) => row.occurrence_id === "dab99770-b55c-44bc-9aeb-f7d4a9c2b233");
  assert.equal(excludedMuseumRecord.decision, "excluded-record");
  assert.ok(excludedMuseumRecord.decision_reason.includes("GBIF occurrence 795932"));
});

test("the five October 17 desk-reviewed candidates remain pending and unplotted", async () => {
  const result = buildCandidateReview(await readCandidateReviewInputs());
  const reviewedIds = new Set([
    "9f16eeaa-9c50-4cad-97f9-5a728254ea1f",
    "0283ab44-b1e8-4ed4-9e11-2cff048300aa",
    "dd7c909e-e8e5-4fae-b768-eea845e2de83",
    "de331418-cfe9-4e0a-9797-8f2512729ad5",
    "6ad5b3c0-daee-4db4-b1fb-1ea45f32e912",
  ]);
  const reviews = result.rows.filter((row) => reviewedIds.has(row.occurrence_id));

  assert.equal(reviews.length, 5);
  assert.ok(reviews.every((row) => row.decision === "pending-review"));
  assert.ok(reviews.every((row) => row.locality_review_status === "Locality unconfirmed — needs source review"));
  assert.ok(reviews.every((row) => row.locality_review_reason.startsWith("Desk review 2026-10-17:")));
  const localityReviews = parseCsv((await readCandidateReviewInputs()).localityCsv.toString("utf8")).filter((row) =>
    reviewedIds.has(row.id),
  );
  assert.equal(localityReviews.length, 5);
  assert.ok(localityReviews.every((row) => row.map_recommendation.startsWith("Do not plot or assign to a Cavite bay")));
});

test("curator reviews must match the linked occurrence and candidate", async () => {
  const inputs = await readCandidateReviewInputs();
  const mismatchedReview = inputs.curatorReviewCsv
    .toString("utf8")
    .replace("Carcharhinus sorrah", "Wrong candidate");
  assert.throws(
    () => buildCandidateReview({ ...inputs, curatorReviewCsv: Buffer.from(mismatchedReview) }),
    /Curator review does not match its linked candidate occurrence/,
  );
});
