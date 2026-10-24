import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import evidence from "../src/data/bulacan-manila-bay-gbif-evidence.json" with { type: "json" };
import review from "../data/research/philippines/central-luzon-bulacan-manila-bay-usnm-source-review-20261024.json" with {
  type: "json",
};
import {
  buildBulacanManilaBayEvidence,
  readBulacanManilaBayReview,
} from "../scripts/species/build-bulacan-manila-bay-gbif-evidence.mjs";

test("projects three historical Bulacan Manila Bay fish-trap records with names and coordinates bounded", async () => {
  const input = await readBulacanManilaBayReview();
  const generated = buildBulacanManilaBayEvidence(input.review, input.sha256);
  const checkedIn = JSON.parse(
    await readFile(new URL("../src/data/bulacan-manila-bay-gbif-evidence.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(generated, checkedIn);
  assert.deepEqual(evidence.counts, {
    speciesAssertions: 3,
    sourceOccurrenceRecords: 3,
    sourceDatasets: 1,
  });
  assert.deepEqual(
    evidence.assertions.map((assertion) => assertion.scientificName),
    [
      "Oxyurichthys microlepis (Bleeker, 1849)",
      "Drombus ocyurus (Jordan & Seale, 1907)",
      "Butis koilomatodon (Bleeker, 1849)",
    ],
  );
  assert.equal(evidence.reportedLocality, review.sharedLocality.verbatim);
  assert.equal(evidence.collectionDate, "1982-02");
  assert.equal(review.decision.currentPresenceAssertionCount, 0);
  assert.equal(review.decision.mapGeometryAdded, false);
  assert.ok(evidence.assertions.every((assertion) => assertion.records[0].license === "CC0-1.0"));
  assert.ok(evidence.assertions.every((assertion) => !("decimalLatitude" in assertion.records[0])));
  assert.ok(evidence.assertions.every((assertion) => !("decimalLongitude" in assertion.records[0])));
  assert.ok(evidence.assertions.every((assertion) => assertion.records[0].issues.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT")));
  assert.equal(evidence.assertions[2].recordedName, "Prionobutis koilomatodon (Bleeker, 1849)");
  assert.equal(evidence.assertions[2].scientificName, "Butis koilomatodon (Bleeker, 1849)");
  assert.equal(review.occurrenceQuery.resultCount, 12);
  assert.deepEqual(
    evidence.assertions.map(({ records }) => [records[0].catalogNumber, records[0].individualCount]),
    [["USNM 265078", 7], ["USNM 349186", 3], ["USNM 341214", 1]],
  );
});

test("rejects a changed locality, dataset right, taxon rank, taxonomy status, or coordinate inclusion", () => {
  const mutations = [
    (changed) => (changed.sharedLocality.verbatim = "Malolos, Bulacan"),
    (changed) => (changed.source.license = "CC-BY-4.0"),
    (changed) => (changed.records[0].license = "CC-BY-NC-4.0"),
    (changed) => (changed.records[0].taxonRank = "GENUS"),
    (changed) => (changed.records[0].taxonomyReview.currentStanding = "unresolved"),
    (changed) => (changed.decision.coordinateProjected = true),
    (changed) => (changed.sharedLocality.gbifWaterBody = "Manila Bay"),
  ];

  for (const mutate of mutations) {
    const changed = structuredClone(review);
    mutate(changed);
    assert.throws(() => buildBulacanManilaBayEvidence(changed, "0".repeat(64)));
  }
});
