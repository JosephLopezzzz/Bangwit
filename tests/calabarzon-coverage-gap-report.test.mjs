import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [report, scope, sweep, sourceRegistry, scopeBytes, sourceBytes, museumBytes, taxonomyFollowupBytes, caviteBayScreenBytes, midasFollowupBytes, dagatdagatanFollowupBytes, balOnSearchBytes, gapanSapangReviewBytes, gapanGeoNamesCrosscheckBytes, ternateRiversReviewBytes, denominatorProfile] = await Promise.all([
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
  readFile(new URL("sources.json", base), "utf8"),
  readFile(new URL("calabarzon-laguna-museum-catalog-verification-20261025.json", base), "utf8"),
  readFile(new URL("calabarzon-laguna-cas-taxonomy-followup-20261025.json", base), "utf8"),
  readFile(new URL("calabarzon-cavite-bay-gbif-screen-20261025.json", base), "utf8"),
  readFile(new URL("calabarzon-taal-midas-municipality-discrepancy-followup-20261026.json", base), "utf8"),
  readFile(new URL("calabarzon-dagatdagatan-lopez-catalog-followup-20261026.json", base), "utf8"),
  readFile(new URL("calabarzon-bal-on-reservoir-retrieval-search-20261026.json", base), "utf8"),
  readFile(new URL("calabarzon-gapan-sapang-river-source-review-20261026.json", base), "utf8"),
  readFile(new URL("calabarzon-gapan-sapang-geonames-crosscheck-20261026.json", base)),
  readFile(new URL("calabarzon-ternate-protected-landscape-rivers-review-20261026.json", base)),
  readFile(new URL("calabarzon-coverage-denominator-profile-20261031.json", base), "utf8").then(JSON.parse),
]);

test("CALABARZON checkpoint reports its gaps without claiming a complete region", () => {
  assert.equal(report.status, "checkpoint-published-incomplete-baseline");
  assert.equal(report.regionId, "0400000000");
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 97);
  assert.equal(report.reviewedOn, "2026-10-29");
  assert.equal(report.coverageSummary.registeredSources, 193);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, report.waterbodySnapshot.length);
  assert.equal(report.coverageSummary.waterbodyDenominatorEstablished, false);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.deepEqual(report.coverageSummary.byWaterbodyKind, {
    bay: 7,
    river: 51,
    estuary: 3,
    wetland: 8,
    reservoir: 5,
    lake: 18,
    stream: 5,
  });
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 10);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 92);
  assert.equal(report.coverageSummary.researchProjectionAssertionsImported, 9);
  assert.equal(report.coverageSummary.sourceAssignments, report.waterbodySnapshot.reduce((count, item) => count + item.sourceRefs.length, 0));
  assert.equal(
    report.coverageSummary.distinctSourceReferencesAssigned,
    new Set(report.waterbodySnapshot.flatMap((item) => item.sourceRefs)).size,
  );
  for (const inputHash of Object.values(report.inputHashes)) assert.match(inputHash, /^[a-f0-9]{64}$/);
  assert.equal(report.nextStep.phaseId, "L1");
  assert.equal(report.nextStep.regionName, "CALABARZON (Region IV-A)");
  assert.match(report.nextStep.action, /source-backed channel trace and station records for Gapan\/Sapang/i);
  assert.match(report.nextStep.action, /For Tagbac creek, verify whether the adjacent modelled segments/i);
  assert.match(report.nextStep.action, /do not mark CALABARZON complete/i);
  assert.ok(report.openGaps.some((gap) => gap.id === "gapan-sapang-river-evidence-and-extent"));
  assert.ok(report.openGaps.some((gap) => gap.id === "ternate-protected-landscape-river-location-and-evidence"));
  assert.ok(report.openGaps.some((gap) => gap.id === "tagbac-creek-channel-and-name-crosswalk"));
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

test("latest CALABARZON denominator profile stays pinned to the incomplete scope", () => {
  const sourceRefs = [...new Set(scope.waterbodies.flatMap((waterbody) => waterbody.sourceRefs))];
  const unresolvedSourceRefs = sourceRefs.filter((sourceRef) => !sourceRegistry.sources.some((source) => source.id === sourceRef));
  const byWaterbodyKind = Object.fromEntries(Object.entries(Object.groupBy(scope.waterbodies, (waterbody) => waterbody.kind))
    .map(([kind, items]) => [kind, items.length]));
  const boundaryCounts = Object.fromEntries(Object.entries(Object.groupBy(scope.waterbodies, (waterbody) => waterbody.boundaryStatus))
    .map(([status, items]) => [status, items.length]));
  const unknownSalinityCount = scope.waterbodies.filter((waterbody) => waterbody.salinity.classification === "unknown").length;
  const fishEvidenceNotReviewed = scope.waterbodies
    .filter((waterbody) => waterbody.fishEvidenceStatus === "not-reviewed")
    .map((waterbody) => waterbody.id);

  assert.equal(denominatorProfile.status, "research-only-coverage-audit");
  assert.equal(denominatorProfile.provenance.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
  assert.equal(denominatorProfile.provenance.sourceRegistrySha256, createHash("sha256").update(sourceBytes).digest("hex"));
  assert.equal(denominatorProfile.denominator.waterbodyResearchLeads, scope.waterbodies.length);
  assert.deepEqual(denominatorProfile.denominator.byKind, byWaterbodyKind);
  assert.equal(denominatorProfile.denominator.uniqueSourceReferences, sourceRefs.length);
  assert.deepEqual(denominatorProfile.denominator.unresolvedSourceReferences, unresolvedSourceRefs);
  assert.deepEqual(denominatorProfile.reviewGaps.boundary, boundaryCounts);
  assert.equal(denominatorProfile.reviewGaps.salinity.unknown, unknownSalinityCount);
  assert.deepEqual(denominatorProfile.reviewGaps.fishEvidenceNotReviewed, fishEvidenceNotReviewed);
  assert.equal(denominatorProfile.reviewGaps.researchQueued.length, 32);
  assert.equal(denominatorProfile.existingScopeCounters.geometryValidated, 0);
  assert.equal(denominatorProfile.existingScopeCounters.speciesAssertionsImported, 9);
  assert.equal(denominatorProfile.existingScopeCounters.publicRecordsAdmitted, 0);
  assert.match(denominatorProfile.interpretation[0], /not proof that every CALABARZON/i);
  assert.match(denominatorProfile.interpretation[3], /No new occurrence assertion/i);
});
