import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-taal-gbif-coordinate-candidate-crosswalk-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);

test("Taal coordinate hits remain catalog-crosswalk candidates rather than public occurrence assertions", () => {
  assert.equal(review.query.httpStatus, 200);
  assert.equal(review.query.resultCount, 242);
  assert.equal(review.query.returnedCount, 242);
  assert.equal(review.query.endOfRecords, true);
  assert.match(review.spatialMethod.purpose, /not a Taal Lake polygon/i);
  assert.equal(review.candidates.length, 2);
  assert.deepEqual(review.candidates.map((candidate) => candidate.gbif.catalogNumber), ["FW O2341-T", "NMI 11069"]);
  assert.deepEqual(review.candidates.map((candidate) => candidate.fishBaseCrosswalk.locality), ["Taal Lake, Batangas", "Lake Taal, Balete"]);
  assert.equal(review.candidates[0].gbif.institutionCode, "SEAOBIS");
  assert.equal(review.candidates[0].fishBaseCrosswalk.museumCode, "FW");
  assert.match(review.candidates[0].crosswalkStrength, /institution\/collection codes.*needs institutional provenance verification/i);
  for (const candidate of review.candidates) {
    assert.equal(candidate.gbif.locality, null);
    assert.equal(candidate.gbif.waterBody, null);
    assert.equal(candidate.gbif.coordinateUncertaintyInMeters, null);
    assert.equal(candidate.gbif.license, "CC-BY-4.0");
    assert.match(candidate.crosswalkStrength, /locality.*appear[s]?.*only in FishBase/i);
    assert.match(candidate.decision, /^held-pending-direct-/);
    assert.match(candidate.gbif.url, /^https:\/\/www\.gbif\.org\/occurrence\//);
    assert.match(candidate.fishBaseCrosswalk.url, /^https:\/\/fishbase\.net\.br\/museum\/SpecOccurrences\.php/);
  }
  assert.ok(review.candidates[0].gbif.issues.includes("COORDINATE_ROUNDED"));
  assert.equal(review.rightsReview.fishBase.includes("CC BY-NC 4.0"), true);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.observationDatesAdded, 0);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);

  const source = registry.sources.find((row) => row.id === "fishbase-taal-specimen-crosswalk");
  assert.ok(source);
  assert.equal(source.license, "CC-BY-NC-4.0");
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes("calabarzon-taal-gbif-coordinate-candidate-crosswalk-20261024.json"));
  const taal = scope.waterbodies.find((row) => row.id === "ph-wb-taal-lake");
  assert.ok(taal.sourceRefs.includes(source.id));
  assert.equal(taal.publicAdmission, false);
  assert.equal(taal.reviewStatus, "historical-evidence-reviewed-incomplete");
  assert.equal(
    taal.fishEvidenceStatus,
    "historical-checklist-and-three-CC0-specimen-locality-assertions-reviewed; no-current-presence-inferred",
  );
  assert.equal(report.coverageSummary.registeredSources, 135);
  assert.equal(report.coverageSummary.sourceAssignments, 197);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 49);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
