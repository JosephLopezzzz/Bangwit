import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import evidence from "../src/data/makiling-gbif-evidence.json" with { type: "json" };
import review from "../data/research/philippines/makiling-gbif-source-review.json" with { type: "json" };
import {
  buildMakilingGbifEvidence,
  readMakilingGbifReview,
} from "../scripts/species/build-makiling-gbif-evidence.mjs";

test("builds one reviewed historical Molawin assertion from three preserved-specimen records", async () => {
  const inputs = await readMakilingGbifReview();
  const generated = buildMakilingGbifEvidence(inputs.review, inputs.sha256);
  const checkedIn = JSON.parse(
    await readFile(new URL("../src/data/makiling-gbif-evidence.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(generated, checkedIn);
  assert.deepEqual(evidence.counts, {
    speciesAssertions: 1,
    sourceOccurrenceRecords: 3,
    sourceDatasets: 2,
  });
  assert.equal(evidence.assertions[0].scientificName, "Gulaphallus mirabilis Herre, 1925");
  assert.equal(evidence.assertions[0].reportedLocality, "Molawin Creek");
  assert.equal(evidence.assertions[0].collectionDate, null);
  for (const record of evidence.assertions[0].records) {
    assert.equal(record.eventDate, null);
    assert.equal(record.decimalLongitude, null);
    assert.equal(record.decimalLatitude, null);
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.ok(record.issues.length);
  }
  assert.match(evidence.nonClaims.join(" "), /not counted as three .* individual fish/i);
});

test("holds the batch if its CC0 rights, exact locality, taxonomy, date, coordinate, or flags change", () => {
  const cases = [
    (changed) => (changed.records[0].license = "CC-BY-4.0"),
    (changed) => (changed.records[0].locality = "Laguna de Bay"),
    (changed) => (changed.records[0].taxonKey = 123),
    (changed) => (changed.records[0].eventDate = "1933"),
    (changed) => (changed.records[0].decimalLongitude = 121.24),
    (changed) => (changed.records[0].issues = []),
    (changed) => (changed.datasets[0].license = "CC-BY-4.0"),
  ];

  for (const change of cases) {
    const changed = structuredClone(review);
    change(changed);
    assert.throws(() => buildMakilingGbifEvidence(changed, "0".repeat(64)));
  }
});

test("records empty neighboring string queries as bounded searches rather than absence claims", () => {
  assert.deepEqual(review.queryReview.otherLocalityQueries, [
    { locality: "Dampalit Falls", resultCount: 0 },
    { locality: "Cambantoc River", resultCount: 0 },
  ]);
  assert.ok(review.nonClaims.some((claim) => /No species absence is inferred/.test(claim)));
});
