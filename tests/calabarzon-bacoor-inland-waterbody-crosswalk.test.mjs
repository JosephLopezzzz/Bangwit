import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const file = "calabarzon-bacoor-inland-waterbody-crosswalk-20261026.json";
const [reviewBytes, scopeBytes, sourceBytes, reportBytes] = await Promise.all([
  readFile(new URL(file, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(sourceBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Bacoor City's inland-water profile adds named river and creek leads without adding fish claims", () => {
  assert.equal(review.status, "official-city-profile-names-inland-watercourse-leads;fish-taxonomy-and-geometry-unresolved");
  assert.deepEqual(review.scopeDecisions.newWaterbodyLeads, [
    "ph-wb-don-cella-river",
    "ph-wb-molino-river",
    "ph-wb-zapote-river",
    "ph-wb-ilat-creek",
    "ph-wb-daang-bukid-creek",
  ]);
  assert.equal(review.watercourseFindings.length, 7);
  assert.equal(review.fisheryContext.sourceNamesFishTaxa, false);
  assert.equal(review.fisheryContext.taxaAssignedToIndividualWatercourses, false);
  assert.equal(review.scopeDecisions.fishAssertionsAdded, 0);
  assert.equal(review.scopeDecisions.sourceAssignmentsAdded, 7);
  assert.equal(review.scopeDecisions.channelGeometryAdded, false);
  assert.equal(review.scopeDecisions.salinityClassificationsAdded, 0);
  assert.equal(review.damContext.adoptedAsWaterSurfaceArea, false);
  assert.equal(review.sourceAccess.reuseTermsVerified, false);

  for (const finding of review.watercourseFindings) {
    const row = scope.waterbodies.find((waterbody) => waterbody.id === finding.id);
    assert.ok(row, `missing waterbody lead ${finding.id}`);
    assert.equal(row.name, finding.name);
    assert.equal(row.kind, finding.kind);
    assert.equal(row.salinity.classification, "unknown");
    assert.equal(row.boundaryStatus, "not-delineated");
    assert.equal(row.publicAdmission, false);
    assert.ok(row.sourceRefs.includes(review.sourceId));
  }
  const bacoor = scope.waterbodies.find((row) => row.id === "ph-wb-bacoor-river-cavite");
  assert.ok(bacoor.aliases.includes("Mestizo River"));
  assert.equal(bacoor.fishEvidenceStatus, "not-reviewed");
  for (const id of review.scopeDecisions.newWaterbodyLeads) {
    assert.equal(scope.waterbodies.find((row) => row.id === id).fishEvidenceStatus, "not-reviewed");
  }
});

test("the source registry and CALABARZON checkpoint pin the new lead while staying incomplete", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes(file));
  assert.equal(source.publicationApproval, false);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 94);
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.sourceAssignments, 242);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 67);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 89);
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(registry.sourceCount, 172);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.bacoorInlandWaterbodyCrosswalkSha256, sha256(reviewBytes));
  assert.ok(report.openGaps.some((gap) => gap.id === "bacoor-inland-watercourse-fish-and-geometry"));
});
