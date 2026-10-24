import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import evidence from "../src/data/angat-gbif-species-evidence.json" with { type: "json" };
import review from "../data/research/philippines/central-luzon-bulacan-angat-gbif-source-review-20261024.json" with {
  type: "json",
};
import screen from "../data/research/philippines/central-luzon-bulacan-gbif-waterbody-screen-20261024.json" with {
  type: "json",
};
import {
  buildAngatGbifEvidence,
  readAngatGbifReview,
} from "../scripts/species/build-angat-gbif-evidence.mjs";

test("projects one historical Angat text-locality record without a coordinate", async () => {
  const input = await readAngatGbifReview();
  const generated = buildAngatGbifEvidence(input.review, input.sha256);
  const checkedIn = JSON.parse(
    await readFile(new URL("../src/data/angat-gbif-species-evidence.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(generated, checkedIn);
  assert.deepEqual(evidence.counts, {
    speciesAssertions: 1,
    sourceOccurrenceRecords: 1,
    sourceDatasets: 1,
  });
  assert.equal(evidence.assertions[0].scientificName, "Arius dispar Herre, 1926");
  assert.equal(evidence.assertions[0].reportedLocality, "Angat Dam, Angat River, Luzon");
  assert.equal(evidence.assertions[0].records[0].individualCount, 2);
  assert.equal(evidence.assertions[0].records[0].eventDate, "1929-05-18");
  assert.equal(evidence.assertions[0].records[0].license, "CC0-1.0");
  assert.equal("decimalLatitude" in evidence.assertions[0].records[0], false);
  assert.equal("decimalLongitude" in evidence.assertions[0].records[0], false);
  assert.ok(evidence.assertions[0].records[0].issues.includes("GEODETIC_DATUM_ASSUMED_WGS84"));
  assert.equal(evidence.querySummary.resultCount, 31);
  assert.equal(review.decision.currentPresenceAssertionCount, 0);
  assert.equal(review.decision.mapGeometryAdded, false);
  assert.equal(screen.angatHistoricalCandidate.gbifOccurrenceKey, 3426466682);
});

test("keeps the projection closed when source locality, license, or taxonomy changes", () => {
  const mutations = [
    (changed) => (changed.record.locality = "Angat River"),
    (changed) => (changed.record.license = "CC-BY-4.0"),
    (changed) => (changed.source.license = "CC-BY-4.0"),
    (changed) => (changed.taxonomyReview.currentStanding = "unresolved"),
    (changed) => (changed.coordinateReview.projected = true),
  ];

  for (const mutate of mutations) {
    const changed = structuredClone(review);
    mutate(changed);
    assert.throws(() => buildAngatGbifEvidence(changed, "0".repeat(64)));
  }
});
