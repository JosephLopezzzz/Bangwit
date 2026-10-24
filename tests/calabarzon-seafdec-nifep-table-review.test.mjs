import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-seafdec-nifep-table-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);
const waterbodiesById = new Map(scope.waterbodies.map((row) => [row.id, row]));
const sourcesById = new Map(registry.sources.map((row) => [row.id, row]));
const sourceId = "seafdec-palmaa-bartolome-2016-fish-for-the-people";

test("SEAFDEC Table 2 adds only a named Bal-on lead and retains grouped-site limits", () => {
  assert.equal(review.status, "NIFEP-management-site-table-reviewed;Bal-on-reservoir-added;group-crosswalk-and-fish-claims-held");
  assert.equal(review.programContext.reportedCALABARZONWaterSites, 11);
  assert.equal(review.programContext.reportedRizalRiverSanctuaries, 6);
  assert.equal(review.programContext.tableRows.length, 5);

  const balOn = waterbodiesById.get("ph-wb-bal-on-reservoir-quezon");
  assert.ok(balOn);
  assert.equal(balOn.kind, "reservoir");
  assert.equal(balOn.salinity.classification, "unknown");
  assert.equal(balOn.fishEvidenceStatus, "not-reviewed");
  assert.equal(balOn.boundaryStatus, "not-delineated");
  assert.equal(balOn.publicAdmission, false);
  assert.ok(balOn.sourceRefs.includes(sourceId));

  const riverSanctuaries = review.programContext.tableRows.find((row) => row.siteLabel.startsWith("Six river sanctuaries"));
  assert.deepEqual(riverSanctuaries.scopeLeadIds, []);
  assert.match(riverSanctuaries.crosswalk, /does not name the rivers or sanctuaries/i);

  const groupedLakes = review.programContext.tableRows.find((row) => row.siteLabel.startsWith("Seven lakes"));
  assert.equal(groupedLakes.candidateScopeLeadIds.length, 8);
  assert.ok(groupedLakes.candidateScopeLeadIds.every((id) => !waterbodiesById.get(id).sourceRefs.includes(sourceId)));
  assert.match(groupedLakes.crosswalk, /not assigned per-lake NIFEP status/i);
  assert.match(groupedLakes.crosswalk, /spelling variant only/i);

  const lagunaDeBay = waterbodiesById.get("ph-wb-laguna-de-bay");
  assert.ok(lagunaDeBay.sourceRefs.includes(sourceId));
  assert.match(lagunaDeBay.scopeNote, /historical management context/i);
});

test("SEAFDEC stocking and restoration table remains distinct from fish occurrence data", () => {
  const source = sourcesById.get(sourceId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-seafdec-nifep-table-review-20261024.json"));
  assert.equal(source.publicationApproval, false);
  assert.match(source.reuse.metadata, /no item-specific open reuse license was identified/i);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.dietClaimsAdded, 0);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.fishAbsenceClaimAdded, false);

  const tayabasDagatan = waterbodiesById.get("ph-wb-dagatan-quezon-lake");
  const sanAntonioPagatan = waterbodiesById.get("ph-wb-pagatan-quezon-lake");
  assert.ok(!tayabasDagatan.sourceRefs.includes(sourceId));
  assert.ok(!sanAntonioPagatan.sourceRefs.includes(sourceId));
  assert.deepEqual(review.programContext.tableRows.at(-1).scopeLeadIds, []);
  assert.match(review.programContext.tableRows.at(-1).crosswalk, /identity remains unresolved/i);

  assert.equal(scope.counts.waterbodyResearchLeads, 83);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 20);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 78);
assert.equal(report.coverageSummary.sourceAssignments, 195);
assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 48);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
});
