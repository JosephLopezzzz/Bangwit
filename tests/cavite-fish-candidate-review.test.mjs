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
  assert.equal(result.rows.filter((row) => row.decision === "excluded-record").length, 1);
  assert.equal(result.rows.filter((row) => row.decision === "pending-review").length, 39);
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
});
