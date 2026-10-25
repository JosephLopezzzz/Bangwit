import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [report, scope, sweep, sourceRegistry, scopeBytes, sourceBytes, museumBytes, taxonomyFollowupBytes, caviteBayScreenBytes] = await Promise.all([
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
  readFile(new URL("sources.json", base), "utf8"),
  readFile(new URL("calabarzon-laguna-museum-catalog-verification-20261025.json", base), "utf8"),
  readFile(new URL("calabarzon-laguna-cas-taxonomy-followup-20261025.json", base), "utf8"),
  readFile(new URL("calabarzon-cavite-bay-gbif-screen-20261025.json", base), "utf8"),
]);

test("CALABARZON checkpoint reports its gaps without claiming a complete region", () => {
  assert.equal(report.status, "checkpoint-published-incomplete-baseline");
  assert.equal(report.regionId, scope.regionId);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
  assert.equal(report.reviewedOn, "2026-10-26");
  assert.equal(report.coverageSummary.registeredSources, sourceRegistry.sourceCount);
  assert.equal(sourceRegistry.sourceCount, sourceRegistry.sources.length);
  assert.equal(report.coverageSummary.waterbodyDenominatorEstablished, false);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.deepEqual(report.coverageSummary.byWaterbodyKind, {
    bay: 7,
    estuary: 2,
    lake: 19,
    reservoir: 4,
    river: 40,
    stream: 3,
    wetland: 8,
  });
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 15);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 78);
  assert.equal(report.coverageSummary.researchProjectionAssertionsImported, 9);
  const sourceRefs = scope.waterbodies.flatMap((waterbody) => waterbody.sourceRefs);
  assert.equal(report.coverageSummary.sourceAssignments, sourceRefs.length);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, new Set(sourceRefs).size);
  assert.equal(report.inputHashes.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
  assert.equal(report.inputHashes.sourcesSha256, createHash("sha256").update(sourceBytes).digest("hex"));
  assert.equal(report.inputHashes.caviteBayGbifScreenSha256, createHash("sha256").update(caviteBayScreenBytes).digest("hex"));
  assert.equal(
    report.inputHashes.lagunaMuseumVerificationSha256,
    createHash("sha256").update(museumBytes).digest("hex"),
  );
  assert.equal(
    report.inputHashes.lagunaTaxonomyFollowupSha256,
    createHash("sha256").update(taxonomyFollowupBytes).digest("hex"),
  );
  assert.deepEqual(
    report.waterbodySnapshot,
    scope.waterbodies.map((waterbody) => ({
      id: waterbody.id,
      name: waterbody.name,
      kind: waterbody.kind,
      salinity: waterbody.salinity.classification,
      fishEvidenceStatus: waterbody.fishEvidenceStatus,
      reviewStatus: waterbody.reviewStatus,
      boundaryStatus: waterbody.boundaryStatus,
      publicAdmission: waterbody.publicAdmission,
      sourceRefs: waterbody.sourceRefs,
    })),
  );
  assert.equal(report.nextStep.phaseId, "L1");
  assert.equal(report.nextStep.regionName, "CALABARZON (Region IV-A)");
  assert.match(report.nextStep.action, /do not advance to NCR or mark CALABARZON complete/i);
  assert.ok(report.openGaps.some((gap) => gap.id === "scope-not-exhaustive"));
  const museumGap = report.openGaps.find((gap) => gap.id === "laguna-museum-catalog-conflicts");
  assert.equal(museumGap.count, 1);
  assert.equal(museumGap.candidateRecords, 18);
  assert.equal(museumGap.historicalAssertionsAdmittedToResearchLedger, 17);
  assert.deepEqual(museumGap.sourceRefs, [
    "calabarzon-laguna-cas-primary-archive-check",
    "calabarzon-laguna-mzusp-sibbr-catalog",
  ]);
  assert.match(museumGap.reason, /17 exact collection-qualified.*all 17.*One unique MZUSP/i);
  assert.match(museumGap.nextAction, /authoritative source-level clarification.*MZUSP/i);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(sweep.regionalGapSummary.regionalBaselineComplete, false);
});
