import assert from "node:assert/strict";
import test from "node:test";
import evidence from "../src/data/taal-cas-gbif-evidence.json" with { type: "json" };
import review from "../data/research/philippines/calabarzon-taal-cas-gbif-source-review-20261024.json" with { type: "json" };
import {
  buildTaalCasGbifEvidence,
  readTaalCasGbifReview,
} from "../scripts/species/build-taal-cas-gbif-evidence.mjs";

test("builds three historical Taal species assertions from the reviewed CC0 CAS records", async () => {
  const inputs = await readTaalCasGbifReview();
  const generated = buildTaalCasGbifEvidence(inputs.review, inputs.sha256);

  assert.deepEqual(generated, evidence);
  assert.deepEqual(evidence.counts, {
    speciesAssertions: 3,
    sourceOccurrenceRecords: 3,
    sourceDatasets: 1,
  });
  assert.deepEqual(
    evidence.assertions.map((row) => row.scientificName),
    [
      "Oostethus jagorii (Peters, 1868)",
      "Hippichthys heptagonus Bleeker, 1849",
      "Scatophagus argus (Linnaeus, 1766)",
    ],
  );
  assert.equal(evidence.assertions[0].records[0].scientificName, "Microphis jagorii Peters, 1868");
  assert.equal(evidence.assertions[0].records[0].taxonomicStatus, "SYNONYM");
  assert.equal(evidence.assertions[2].records[0].coordinateUncertaintyInMeters, 12567);
  assert.deepEqual(evidence.querySummary, {
    exactWaterBody: "Lake Taal",
    resultCount: 14,
    reviewedCount: 14,
    speciesRankRecords: 3,
    lowerRankRowsExcluded: 11,
  });
  assert.equal(evidence.source.license, "CC0-1.0");
  for (const assertion of evidence.assertions) {
    assert.equal(assertion.reportedWaterbody, "Taal Lake");
    assert.equal(assertion.evidenceKind, "preserved-specimen-text-locality");
    assert.ok(assertion.reportedLocalities[0]);
    assert.equal(assertion.records[0].license, "CC0-1.0");
    assert.ok(assertion.records[0].issues.includes("CONTINENT_INVALID"));
    assert.equal("decimalLongitude" in assertion.records[0], false);
    assert.equal("decimalLatitude" in assertion.records[0], false);
  }
  assert.equal(evidence.assertions[2].taxonomy.independentReference.supports, "Scatophagus argus is a valid species name. This nomenclatural check does not re-identify the preserved specimen.");
  assert.equal(review.records.every((record) => record.coordinatesProjected === false), true);
  assert.ok(evidence.nonClaims.some((claim) => /not three fish/i.test(claim)));
});

test("rejects changes to the query boundary, taxonomic rank, locality, rights, dates or quality handling", () => {
  const mutations = [
    (changed) => (changed.queryReview.resultCount = 15),
    (changed) => (changed.queryReview.enumeratedCount = 13),
    (changed) => (changed.queryReview.taxonRankCounts.GENUS = 7),
    (changed) => (changed.records[0].waterBody = "Laguna de Bay"),
    (changed) => (changed.records[0].rank = "GENUS"),
    (changed) => (changed.records[0].license = "CC-BY-4.0"),
    (changed) => (changed.dataset.license = "CC-BY-4.0"),
    (changed) => (changed.records[0].eventDate = "2011"),
    (changed) => (changed.records[0].occurrenceId = ""),
    (changed) => (changed.records[0].issues = []),
    (changed) => (changed.records[0].coordinatesProjected = true),
    (changed) => (changed.records[0].decimalLongitude = 120.9),
    (changed) => (changed.decision.publicAdmission = true),
  ];

  for (const mutate of mutations) {
    const changed = structuredClone(review);
    mutate(changed);
    assert.throws(() => buildTaalCasGbifEvidence(changed, "0".repeat(64)));
  }
});

test("never projects the Taal records as map points or current-presence claims", () => {
  const projection = buildTaalCasGbifEvidence(review, "0".repeat(64));
  assert.doesNotMatch(JSON.stringify(projection), /decimalLatitude|decimalLongitude/);
  assert.ok(projection.caveats.some((caveat) => /CONTINENT_INVALID/.test(caveat)));
  assert.ok(projection.nonClaims.some((claim) => /current presence/i.test(claim)));
  assert.equal(projection.waterbody.kind, "lake");
});
