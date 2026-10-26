import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const file = "calabarzon-cavite-2024-major-rivers-crosswalk-20261026.json";
const [review, scope, registry, report, reviewBytes, scopeBytes, sourceBytes] = await Promise.all([
  readFile(new URL(file, base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL(file, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("the official Cavite profile adds source-bounded river leads without inventing fish evidence or geometry", () => {
  assert.equal(review.status, "official-river-names-and-course-context-reviewed;fish-geometry-salinity-pending");
  assert.deepEqual(review.sourceFindings.majorRiversNamed, [
    "Bacoor River", "Imus River", "San Juan River", "Cañas River", "Labac River", "Maragondon River",
  ]);
  assert.deepEqual(review.scopeDecisions.newResearchLeads, [
    "ph-wb-bacoor-river-cavite", "ph-wb-san-juan-river-cavite", "ph-wb-labac-river-cavite",
  ]);
  assert.equal(review.scopeDecisions.fishAssertionsAdded, 0);
  assert.equal(review.scopeDecisions.channelGeometryAdded, false);
  assert.equal(review.scopeDecisions.salinityClassificationsAdded, 0);
  assert.equal(review.scopeDecisions.sanJuanCrossedWithLagunaOrBatangasLead, false);
  assert.match(review.sourceFindings.classificationCaveat, /not interpreted as a current water-quality or safety assessment/i);
  assert.equal(review.sourceAccess.fullPdfDownloaded, false);
  assert.equal(review.sourceAccess.reuseTermsVerified, false);

  for (const id of review.scopeDecisions.newResearchLeads) {
    const lead = scope.waterbodies.find((row) => row.id === id);
    assert.ok(lead, `missing research lead ${id}`);
    assert.equal(lead.kind, "river");
    assert.equal(lead.salinity.classification, "unknown");
    assert.equal(lead.boundaryStatus, "not-delineated");
    assert.equal(lead.publicAdmission, false);
  }
  const bacoor = scope.waterbodies.find((row) => row.id === "ph-wb-bacoor-river-cavite");
  assert.equal(bacoor.fishEvidenceStatus, "not-reviewed");
  assert.deepEqual(bacoor.sourceRefs, [review.sourceId, "bacoor-city-clup-ecological-profile-inland-waters"]);
  const caviteSanJuan = scope.waterbodies.find((row) => row.id === "ph-wb-san-juan-river-cavite");
  assert.equal(caviteSanJuan.fishEvidenceStatus, "not-reviewed");
  assert.deepEqual(caviteSanJuan.sourceRefs, [review.sourceId]);
  assert.match(caviteSanJuan.scopeNote, /keep this Cavite course separate from the existing Laguna\/Batangas/i);
  assert.ok(scope.waterbodies.find((row) => row.id === "ph-wb-canas-river").aliases.includes("Cañas River"));
  const labac = scope.waterbodies.find((row) => row.id === "ph-wb-labac-river-cavite");
  assert.match(labac.scopeNote, /not adopted as an alias/i);
  assert.match(labac.fishEvidenceStatus, /EIA-reported-subsistence-fishery/);
  assert.deepEqual(labac.sourceRefs, ["aiib-2023-bcib-final-eia", review.sourceId, "gbif-occurrence-downloads"]);
});

test("the source and checkpoint pin the reviewed profile and preserve incomplete regional status", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes(file));
  assert.equal(source.publicationApproval, false);
  assert.equal(report.inputHashes.cavite2024MajorRiversReviewSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 94);
  assert.equal(report.coverageSummary.byWaterbodyKind.river, 49);
  assert.equal(report.coverageSummary.sourceAssignments, 241);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 89);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.ok(report.openGaps.some((gap) => gap.id === "cavite-river-fish-geometry-and-locality"));
});
