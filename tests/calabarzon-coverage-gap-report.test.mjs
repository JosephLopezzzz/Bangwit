import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [report, scope, sweep, sourceRegistry, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
]);

test("CALABARZON checkpoint reports its gaps without claiming a complete region", () => {
  assert.equal(report.status, "checkpoint-published-incomplete-baseline");
  assert.equal(report.regionId, scope.regionId);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 80);
  assert.equal(report.coverageSummary.registeredSources, 127);
  assert.equal(sourceRegistry.sourceCount, sourceRegistry.sources.length);
  assert.ok(sourceRegistry.sourceCount >= report.coverageSummary.registeredSources);
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
    river: 38,
    stream: 2,
    wetland: 8,
  });
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 20);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 75);
  assert.equal(report.coverageSummary.sourceAssignments, 185);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 44);
  assert.equal(report.inputHashes.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
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
  assert.equal(sweep.regionalGapSummary.regionalBaselineComplete, false);
});
