import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, registryBytes, report] = await Promise.all([
  readFile(new URL("national-psa-qifs-source-access-review-20261026.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
]);
const review = JSON.parse(reviewBytes.toString("utf8"));
const registry = JSON.parse(registryBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("PSA QIFS is a national province/region discovery source with a release-date mismatch", () => {
  assert.equal(review.sourceId, "psa-openstat-qifs-inland-production-national");
  assert.equal(review.source.matrixId, "2E4GVIP0");
  assert.equal(review.source.pxwebTableCode, "0052E4GVIP0");
  assert.equal(review.source.publishedResolution, "National, regional, and provincial");
  assert.equal(review.accessReview.metadataPageFindings.totalGeolocationValues, 107);
  assert.equal(review.accessReview.metadataPageFindings.totalSpeciesValues, 38);
  assert.equal(review.accessReview.metadataPageFindings.maximumCellsPerRequest, 100000);
  assert.equal(review.source.metadataLatestAvailableYear, 2025);
  assert.ok(review.accessReview.liveTableFindings.visibleYears.includes(2026));
  assert.match(review.accessReview.liveTableFindings.conflict, /metadata record says latest available year 2025/);
  assert.match(review.accessReview.liveTableFindings.preliminaryNote, /Q2 2026 values are preliminary/);
  assert.match(review.accessReview.directApiAttempt.result, /HTTP 403/);
  assert.equal(review.accessReview.directApiAttempt.rawSnapshot, null);
});

test("no province statistic is promoted to a waterbody or public species assertion", () => {
  assert.equal(review.decision.valuesExtracted, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.waterbodyAssignmentsAdded, 0);
  assert.equal(review.decision.scientificNamesAssigned, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
  assert.equal(review.decision.regionalBaselineComplete, false);

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.access.localRawSnapshot, null);
  assert.match(source.researchStatus, /live-extraction-pending/);
  assert.match(source.reuse.content, /Do not treat province-level statistics as waterbody occurrences/);
});

test("QIFS access review is hash-pinned without changing CALABARZON waterbody totals", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sourceCount, 165);
  assert.equal(registry.sources.filter((row) => row.id === review.sourceId).length, 1);
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.nationalPsaQifsAccessReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.sourceAssignments, 217);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 59);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
