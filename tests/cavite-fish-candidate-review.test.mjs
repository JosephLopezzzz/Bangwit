import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { buildCandidateReview, readCandidateReviewInputs } from "../scripts/build-cavite-fish-candidate-review.mjs";

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
