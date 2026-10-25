import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [screen, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-cavite-bay-gbif-screen-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
]);
const leadIds = ["ph-wb-bacoor-bay", "ph-wb-canacao-bay"];
const leads = new Map(scope.waterbodies.map((row) => [row.id, row]));
const coordinateFields = /decimalLatitude|decimalLongitude|coordinateUncertaintyInMeters|verbatimCoordinates/i;

test("Cavite bay GBIF text-screen keeps non-fish and unresolved hits out of fish assertions", () => {
  assert.equal(screen.sourceId, "gbif-occurrence-downloads");
  assert.equal(screen.phaseId, "L1");
  assert.deepEqual(screen.scopeSnapshot.scopeLeadIds.sort(), [...leadIds].sort());
  assert.equal(screen.scopeSnapshot.sha256, createHash("sha256").update(JSON.stringify(scope, null, 2) + "\n").digest("hex"));
  assert.equal(screen.queryParameters.country, "PH");
  assert.equal(screen.summary.queryCount, 6);
  assert.equal(screen.summary.successfulQueryCount, 6);
  assert.equal(screen.summary.returnedOccurrencesBySearch, 5);
  assert.equal(screen.summary.uniqueRecordCount, 5);
  assert.equal(screen.summary.candidateFishRecordCount, 0);
  assert.equal(screen.summary.taxonUnmatchedCount, 1);
  assert.equal(screen.summary.directDetailChecks, 5);
  assert.deepEqual(screen.summary.recordsByPhylum, [
    { value: "Mollusca", count: 4 },
    { value: "unknown", count: 1 },
  ]);
  assert.equal(screen.records.length, 5);
  assert.equal(new Set(screen.records.map((row) => row.datasetKey)).size, 1);
  assert.equal(screen.datasets.length, 1);
  assert.equal(screen.datasets[0].key, screen.records[0].datasetKey);
  assert.equal(screen.datasets[0].title, "BMSM Bailey-Matthews National Shell Museum");
  assert.equal(screen.datasets[0].license, "http://creativecommons.org/publicdomain/zero/1.0/legalcode");

  assert.deepEqual(
    screen.queries.map((query) => [query.scopeLeadId, query.field, query.searchValue]),
    [
      ["ph-wb-bacoor-bay", "waterBody", "Bacoor Bay"],
      ["ph-wb-bacoor-bay", "locality", "Bacoor Bay"],
      ["ph-wb-canacao-bay", "waterBody", "Cañacao Bay"],
      ["ph-wb-canacao-bay", "locality", "Cañacao Bay"],
      ["ph-wb-canacao-bay", "waterBody", "Canacao Bay"],
      ["ph-wb-canacao-bay", "locality", "Canacao Bay"],
    ],
  );
  for (const query of screen.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.parameters.country, "PH");
    assert.equal(query.parameters.limit, 100);
    assert.equal(query.resultCount, query.enumeratedCount);
    assert.equal(query.endOfRecords, true);
    assert.ok(query.url.startsWith("https://api.gbif.org/v1/occurrence/search?"));
    assert.doesNotMatch(query.url, /taxonKey|geometry/i);
    assert.ok(query.pages.length > 0);
    for (const page of query.pages) {
      assert.match(page.rawResponse.sha256, /^[a-f0-9]{64}$/);
      assert.ok(page.rawResponse.bytes > 0);
      assert.ok(page.rawResponse.path.startsWith("raw/calabarzon-cavite-bay-gbif-screen-20261025/"));
    }
  }

  const nonFish = screen.records.filter((row) => row.phylum === "Mollusca");
  assert.equal(nonFish.length, 4);
  assert.ok(nonFish.every((row) => row.taxonRank === "SPECIES" && row.datasetLicense === row.license));
  assert.ok(nonFish.every((row) => row.directDetail.httpStatus === 200 && row.directDetail.matchedSearchIdentity));
  const unmatched = screen.records.find((row) => row.gbifId === "3341061042");
  assert.equal(unmatched.scientificName, null);
  assert.equal(unmatched.class, null);
  assert.ok(unmatched.issues.includes("TAXON_MATCH_NONE"));
  assert.ok(screen.records.every((row) => row.issues.length > 0));
  assert.doesNotMatch(JSON.stringify(screen), coordinateFields);
  assert.equal(screen.decision.nonFishRecordsAdmittedAsFish, false);
  assert.equal(screen.decision.unresolvedTaxonTreatedAsFish, false);
  assert.equal(screen.decision.zeroResultsUsedAsAbsence, false);
  assert.equal(screen.decision.speciesAssertionsAdded, 0);
  assert.equal(screen.decision.dietClaimsAdded, 0);
  assert.equal(screen.decision.geometryOrCoordinatesAdded, false);
  assert.equal(screen.decision.publicAppProjectionAdded, false);
  assert.match(screen.decision.interpretation, /does not establish that fish are absent/i);

  for (const id of leadIds) {
    const lead = leads.get(id);
    assert.ok(lead.sourceRefs.includes(screen.sourceId));
    assert.equal(lead.salinity.classification, "unknown");
    assert.equal(lead.boundaryStatus, "not-delineated");
    assert.equal(lead.publicAdmission, false);
    assert.equal(lead.reviewStatus, "bounded-GBIF-text-screen-reviewed;fish-evidence-incomplete");
    assert.equal(
      lead.fishEvidenceStatus,
      "bounded-GBIF-all-taxon-text-screen;four-Mollusca-records-one-taxon-unmatched;no-fish-evidence-or-absence-inferred",
    );
  }
  const source = registry.sources.find((row) => row.id === screen.sourceId);
  assert.ok(source.access.reviewFiles.includes("calabarzon-cavite-bay-gbif-screen-20261025.json"));
  assert.ok(source.access.additionalRawPaths.includes("raw/calabarzon-cavite-bay-gbif-screen-20261025/"));
  const assignments = scope.waterbodies.flatMap((row) => row.sourceRefs);
  assert.equal(report.coverageSummary.sourceAssignments, assignments.length);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, new Set(assignments).size);
  assert.equal(report.coverageSummary.sourceAssignments, 203);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 16);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.nextStep.phaseId, "L1");
  assert.match(report.nextStep.action, /do not advance to NCR/i);
  assert.deepEqual(
    report.waterbodySnapshot.filter((row) => leadIds.includes(row.id)),
    leadIds.map((id) => ({
      id,
      name: leads.get(id).name,
      kind: leads.get(id).kind,
      salinity: leads.get(id).salinity.classification,
      fishEvidenceStatus: leads.get(id).fishEvidenceStatus,
      reviewStatus: leads.get(id).reviewStatus,
      boundaryStatus: leads.get(id).boundaryStatus,
      publicAdmission: leads.get(id).publicAdmission,
      sourceRefs: leads.get(id).sourceRefs,
    })),
  );
});
