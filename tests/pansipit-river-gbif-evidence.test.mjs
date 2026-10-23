import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import evidence from "../src/data/pansipit-river-gbif-evidence.json" with { type: "json" };
import review from "../data/research/philippines/pansipit-river-gbif-source-review.json" with { type: "json" };
import {
  buildPansipitRiverGbifEvidence,
  readPansipitRiverGbifReview,
} from "../scripts/species/build-pansipit-river-gbif-evidence.mjs";

test("builds four Pansipit historical species assertions from four reviewed CC0 specimens", async () => {
  const inputs = await readPansipitRiverGbifReview();
  const generated = buildPansipitRiverGbifEvidence(inputs.review, inputs.sha256);
  const checkedIn = JSON.parse(
    await readFile(new URL("../src/data/pansipit-river-gbif-evidence.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(generated, checkedIn);
  assert.deepEqual(evidence.counts, {
    speciesAssertions: 4,
    sourceOccurrenceRecords: 4,
    sourceDatasets: 1,
  });
  assert.deepEqual(
    evidence.assertions.map(({ scientificName }) => scientificName).sort(),
    [
      "Ambassis ambassis (Lacepède, 1802)",
      "Ambassis nalua (Hamilton, 1822)",
      "Bathygobius cyclopterus (Valenciennes, 1837)",
      "Zenarchopterus gilli Smith, 1945",
    ].sort(),
  );
  assert.equal(evidence.assertions.find((row) => row.scientificName.startsWith("Ambassis ambassis")).records[0].scientificName,
    "Ambassis commersoni Cuvier, 1828");
  assert.equal(evidence.assertions.find((row) => row.scientificName.startsWith("Bathygobius cyclopterus")).records[0].scientificName,
    "Bathygobius mearnsi (Evermann & Seale, 1906)");
  assert.equal(evidence.assertions.find((row) => row.scientificName.startsWith("Ambassis nalua")).records[0].eventDate, "1933");
  assert.deepEqual(evidence.querySummary, {
    exactLocality: "Pansipit River",
    resultCount: 19,
    reviewedCount: 19,
    nonFishCount: 15,
    selectedFishSpecimenRecordCount: 4,
  });
  for (const assertion of evidence.assertions) {
    assert.equal(assertion.reportedLocality, "Pansipit River");
    assert.equal(assertion.evidenceKind, "preserved-specimen-text-locality");
    for (const record of assertion.records) {
      assert.ok(record.issues.length);
      assert.equal("decimalLongitude" in record, false);
      assert.equal("decimalLatitude" in record, false);
      assert.equal(record.license, "CC0-1.0");
    }
  }
  assert.ok(evidence.nonClaims.some((claim) => /not four individual fish/.test(claim)));
  assert.ok(review.records.every((record) => record.coordinateUncertaintyInMeters === null));
});

test("holds the projection when its dataset rights, locality, taxonomy, dates, coordinates or quality flags drift", () => {
  const changes = [
    (changed) => (changed.dataset.license = "CC-BY-4.0"),
    (changed) => (changed.records[0].license = "CC-BY-4.0"),
    (changed) => (changed.records[0].locality = "Laguna de Bay"),
    (changed) => (changed.records[0].acceptedName = "Unknown fish"),
    (changed) => (changed.records[0].eventDate = "1934"),
    (changed) => (changed.records[0].decimalLongitude = 121.2),
    (changed) => (changed.records[0].coordinateUncertaintyInMeters = 10),
    (changed) => (changed.records[0].issues = []),
    (changed) => (changed.queryReview.enumeratedCount = 18),
    (changed) => (changed.dataset.gbifDatasetKey = "unknown-dataset"),
    (changed) => (changed.queryReview.classCounts[0].count = 14),
  ];

  for (const change of changes) {
    const changed = structuredClone(review);
    change(changed);
    assert.throws(() => buildPansipitRiverGbifEvidence(changed, "0".repeat(64)));
  }
});

test("keeps the shared unvalidated coordinate out of every public assertion", () => {
  const projection = buildPansipitRiverGbifEvidence(review, "0".repeat(64));
  assert.doesNotMatch(JSON.stringify(projection), /decimalLatitude|decimalLongitude|13\.909679|120\.916335/);
});
