import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, registryBytes, crosswalkBytes, report] = await Promise.all([
  readFile(new URL("national-psa-qifs-source-access-review-20261026.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("national-psa-qifs-geolocation-crosswalk-20261026.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
]);
const review = JSON.parse(reviewBytes.toString("utf8"));
const registry = JSON.parse(registryBytes.toString("utf8"));
const crosswalk = JSON.parse(crosswalkBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("PSA QIFS is a reproducible national discovery source with bounded status meanings", () => {
  assert.equal(review.sourceId, "psa-openstat-qifs-inland-production-national");
  assert.equal(review.source.matrixId, "2E4GVIP0");
  assert.equal(review.source.pxwebTableCode, "0052E4GVIP0");
  assert.equal(review.source.publishedResolution, "National, regional, and provincial");
  assert.equal(review.accessReview.metadataPageFindings.totalGeolocationValues, 107);
  assert.equal(review.accessReview.metadataPageFindings.totalSpeciesValues, 38);
  assert.equal(review.accessReview.metadataPageFindings.maximumCellsPerRequest, 100000);
  assert.equal(review.source.metadataLatestAvailableYear, 2025);
  assert.ok(review.accessReview.liveTableFindings.visibleYears.includes(2026));
  assert.match(review.accessReview.liveTableFindings.conflict, /Metadata still says latest available year 2025/);
  assert.match(review.accessReview.liveTableFindings.preliminaryNote, /Q2 2026 values are preliminary/);
  assert.match(review.accessReview.directApiAttempt.result, /incorrect endpoint path/);
  assert.equal(review.accessReview.successfulApiExport.endpoint, "https://openstat.psa.gov.ph/PXWeb/api/v1/en/DB/2E/FS/0052E4GVIP0.px");
  assert.equal(review.accessReview.successfulApiExport.selectedCells, 32528);
  assert.equal(review.accessReview.successfulApiExport.maximumCellsPerRequest, 100000);
  assert.equal(review.accessReview.successfulApiExport.responseRows, 4066);
  assert.equal(review.accessReview.successfulApiExport.responseBytes, 301585);
  assert.equal(review.accessReview.successfulApiExport.querySha256, "4458d23649f9cfaf0e4ef701b555cce0a9383406b2a2255d6b68f64f271148c6");
  assert.equal(review.accessReview.successfulApiExport.responseSha256, "6e9797a160c786110b2efc4546592f6ff3950d8be366db924e354848a5c2eae1");
  assert.equal(review.accessReview.successfulApiExport.localRawSnapshotIgnoredByGit, true);
  assert.match(review.accessReview.successfulApiExport.geographyScopeNote, /one unresolved legacy Sulu code/);
  assert.deepEqual(review.accessReview.successfulApiExport.periods.map((period) => period.numericTotalRows), [79, 79, 79, 79, 78, 81, 0, 0]);
  assert.deepEqual(review.accessReview.successfulApiExport.periods.slice(-2).map((period) => period.unavailableCells), [3344, 3344]);
  assert.deepEqual(review.accessReview.successfulApiExport.periods.map((period) => period.categoryNotApplicableCells), [342, 342, 342, 342, 342, 266, 0, 0]);
  assert.deepEqual(review.accessReview.successfulApiExport.statusSymbols, {
    ".": "Category not applicable",
    "..": "Data not available",
  });
  assert.equal(review.accessReview.successfulApiExport.crosswalk.sha256, sha256(crosswalkBytes));
});

test("national QIFS geography crosswalk preserves current units and legacy Sulu separately", () => {
  assert.deepEqual(crosswalk.mappingCounts, {
    nationalRollups: 1,
    regionsMatched: 18,
    provincesMatched: 82,
    citiesMatched: 5,
    unresolved: 1,
  });
  const legacySulu = crosswalk.entries.find((entry) => entry.sourceCode === "1906600000");
  assert.equal(legacySulu.matchStatus, "unresolved-duplicate-legacy-region-code");
  assert.equal(legacySulu.candidateSameNameRegistryCode, "0906600000");
  assert.equal(crosswalk.periodSummary.length, 8);

  const [q2025, q2026Q1, q2026Q2, q2026Q3] = [0, 4, 5, 6].map((index) => crosswalk.periodSummary[index]);
  assert.deepEqual(
    [q2025.currentProvinceTotals.numericTotalRows, q2025.currentProvinceTotals.categoryNotApplicableTotalRows, q2025.currentProvinceTotals.dataNotAvailableTotalRows],
    [78, 4, 0],
  );
  assert.deepEqual(
    [q2026Q1.currentProvinceTotals.numericTotalRows, q2026Q1.currentProvinceTotals.categoryNotApplicableTotalRows, q2026Q1.currentProvinceTotals.dataNotAvailableTotalRows],
    [77, 4, 1],
  );
  assert.deepEqual(
    [q2026Q2.currentProvinceTotals.numericTotalRows, q2026Q2.currentProvinceTotals.categoryNotApplicableTotalRows, q2026Q2.currentProvinceTotals.dataNotAvailableTotalRows],
    [78, 4, 0],
  );
  assert.deepEqual(
    [q2026Q2.currentCityTotals.numericTotalRows, q2026Q2.currentCityTotals.categoryNotApplicableTotalRows],
    [3, 2],
  );
  assert.deepEqual(
    [q2026Q3.currentProvinceTotals.dataNotAvailableTotalRows, q2026Q3.currentCityTotals.dataNotAvailableTotalRows, q2026Q3.unresolvedLegacyGeographyTotals.dataNotAvailableTotalRows],
    [82, 5, 1],
  );
  assert.match(crosswalk.coverageComparison.interpretation, /exact 80-code survey roster/);
});

test("no province statistic is promoted to a waterbody or public species assertion", () => {
  assert.equal(review.decision.statisticalValuesAddedToSpeciesClaims, 0);
  assert.equal(review.decision.statisticalValuesProjectedToApp, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.waterbodyAssignmentsAdded, 0);
  assert.equal(review.decision.scientificNamesAssigned, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
  assert.equal(review.decision.regionalBaselineComplete, false);

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.access.localRawSnapshot, "raw/national-qifs-2025-2026-quarterly-openstat.csv");
  assert.ok(source.access.reviewFiles.includes("national-psa-qifs-geolocation-crosswalk-20261026.json"));
  assert.match(source.researchStatus, /zero-species-claims/);
  assert.match(source.reuse.content, /Do not treat province-level statistics as waterbody occurrences/);
});

test("QIFS access review is hash-pinned without changing CALABARZON waterbody totals", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sources.filter((row) => row.id === review.sourceId).length, 1);
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.nationalPsaQifsAccessReviewSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.nationalPsaQifsGeolocationCrosswalkSha256, sha256(crosswalkBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.sourceAssignments, 253);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 76);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
