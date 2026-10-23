import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import evidence from "../src/data/laguna-de-bay-specimen-evidence.json" with { type: "json" };
import review from "../data/research/philippines/laguna-de-bay-specimen-source-review.json" with { type: "json" };
import {
  buildLagunaDeBaySpecimenEvidence,
  readLagunaDeBayReview,
} from "../scripts/species/build-laguna-de-bay-specimen-evidence.mjs";

test("builds one corrected historical Laguna de Bay specimen assertion from the reviewed source", async () => {
  const inputs = await readLagunaDeBayReview();
  const generated = buildLagunaDeBaySpecimenEvidence(inputs.review, inputs.sha256);
  const checkedIn = JSON.parse(
    await readFile(new URL("../src/data/laguna-de-bay-specimen-evidence.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(generated, checkedIn);
  assert.equal(evidence.counts.speciesAssertions, 1);
  assert.equal(evidence.counts.specimenRecords, 1);
  assert.equal(evidence.assertion.scientificName, "Barbonymus schwanefeldii (Bleeker, 1854)");
  assert.equal(evidence.assertion.collectionDate, "2024-09-28");
  assert.match(evidence.assertion.reportedLocality, /Brgy\. Calahan, Cardona, Rizal/);
  assert.equal(evidence.assertion.decimalLongitude, null);
  assert.equal(evidence.assertion.decimalLatitude, null);
  assert.equal(evidence.source.license, "CC-BY-NC-3.0");
  assert.equal(evidence.heldLead.specimenRetained, false);
  assert.ok(evidence.nonClaims.some((claim) => /not counted as a second specimen/.test(claim)));
});

test("holds projection if the corrigendum, voucher, specimen locality, date, or noncommercial license changes", () => {
  const cases = [
    (changed) => (changed.source.corrigendum.correctedLocality = "Brgy. Patunhay, Cardona, Rizal"),
    (changed) => (changed.specimen.catalogNumber = "ADMU 000000"),
    (changed) => (changed.specimen.reportedLocality = "Brgy. Patunhay, Cardona, Rizal"),
    (changed) => (changed.specimen.collectionDate = "2024-07"),
    (changed) => (changed.source.license = "CC0-1.0"),
    (changed) => (changed.heldLead.specimenRetained = true),
  ];

  for (const change of cases) {
    const changed = structuredClone(review);
    change(changed);
    assert.throws(() => buildLagunaDeBaySpecimenEvidence(changed, "0".repeat(64)));
  }
});
