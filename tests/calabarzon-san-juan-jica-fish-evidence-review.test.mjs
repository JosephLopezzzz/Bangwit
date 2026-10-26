import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewFile = "calabarzon-san-juan-jica-fish-evidence-review-20261026.json";
const [reviewBytes, scopeBytes, sourceBytes, reportBytes] = await Promise.all([
  readFile(new URL(reviewFile, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(sourceBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("JICA's downstream fish summary stays unassigned until a station crosswalk is available", () => {
  assert.equal(review.status, "official-project-summary-reviewed;downstream-fish-waterbody-crosswalk-unresolved");
  assert.equal(review.source.issueDate, "2017-07");
  assert.equal(review.geographicScope.studyAreaIncludesSanJuanBasin, true);
  assert.equal(review.geographicScope.studyAreaAlsoIncludesImusAndCanasBasins, true);
  assert.equal(review.geographicScope.fishStationOrWatercourseNamed, false);
  assert.equal(review.geographicScope.sanJuanAttributionEstablished, false);
  assert.equal(review.findings.reportedFishSpeciesCount, 8);
  assert.equal(review.findings.reportedCrustaceanSpeciesCount, 3);
  assert.deepEqual(review.findings.reportedCommonNameLabels, ["tilapia", "goby", "tarpon", "ten-pound"]);
  assert.equal(review.findings.fishSamplingDate, null);
  assert.equal(review.findings.fishSamplingStations, null);
  assert.equal(review.decisions.waterbodyAssignmentAdded, false);
  assert.equal(review.decisions.speciesAssertionsAdded, 0);
  assert.equal(review.decisions.publicProjectionAdded, false);
  assert.deepEqual(review.environmentalContext.waterQualitySurveyDates, ["2016-02-17", "2016-02-18"]);
  assert.equal(review.environmentalContext.sanJuanMouthSample.siteId, "S1");
  assert.equal(review.environmentalContext.sanJuanMouthSample.sourceLocality, "Mouth of San Juan River");
  assert.equal(review.environmentalContext.sanJuanMouthSample.salinity.value, 31800);
  assert.equal(review.environmentalContext.sanJuanMouthSample.salinity.unit, "mg/L");
  assert.equal(review.environmentalContext.sanJuanMouthSample.sampleDateWithinSurveyWindow, null);
  assert.equal(review.environmentalContext.sanJuanMouthSample.coordinates, null);
  assert.equal(review.environmentalContext.fishSurveyCrosswalkEstablished, false);
  assert.equal(review.environmentalContext.currentWaterbodySalinityClassEstablished, false);

  const sanJuan = scope.waterbodies.find((row) => row.id === review.candidateWaterbodyId);
  assert.ok(sanJuan);
  assert.equal(sanJuan.fishEvidenceStatus, "not-reviewed");
  assert.equal(sanJuan.salinity.classification, "unknown");
  assert.equal(sanJuan.salinity.reviewStatus, "historical-point-sample-2016;current-waterbody-class-unresolved");
  assert.deepEqual(sanJuan.salinity.sourceRefs, [review.sourceId]);
  assert.deepEqual(sanJuan.sourceRefs, ["cavite-ecological-profile-2024-fisheries", review.sourceId]);
  assert.equal(sanJuan.publicAdmission, false);
});

test("the source and regional checkpoint preserve the unresolved crosswalk", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes(reviewFile));
  assert.equal(registry.sourceCount, 172);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.sanJuanJicaFishReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 94);
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.sourceAssignments, 242);
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  const gap = report.openGaps.find((row) => row.id === "cavite-river-fish-geometry-and-locality");
  assert.ok(gap);
  assert.ok(gap.sourceRefs.includes(review.sourceId));
  assert.match(gap.reason, /does not tie those taxa to San Juan River/i);
  assert.match(gap.nextAction, /Volume 3/i);
});
