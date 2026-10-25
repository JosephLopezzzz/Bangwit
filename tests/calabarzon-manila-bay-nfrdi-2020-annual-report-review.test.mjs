import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, registryBytes, scopeBytes, reportBytes] = await Promise.all([
  readFile(new URL("calabarzon-manila-bay-nfrdi-2020-annual-report-review-20261025.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes.toString("utf8"));
const registry = JSON.parse(registryBytes.toString("utf8"));
const scope = JSON.parse(scopeBytes.toString("utf8"));
const report = JSON.parse(reportBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("NFRDI 2020 report preserves Manila Bay aggregate landed-catch context only", () => {
  assert.equal(review.waterbodyId, "ph-wb-manila-bay");
  assert.equal(review.reportedEvidence.landingSiteCount, 8);
  assert.equal(review.reportedEvidence.landedCatchTotalMetricTons, 1197);
  assert.equal(review.reportedEvidence.aggregateSpeciesTypes, 225);
  assert.equal(review.reportedEvidence.leadingReportedTaxon.verbatimScientificName, "Sardinella fimbriata");
  assert.equal(review.reportedEvidence.leadingReportedTaxon.reportedSharePercent, 19);
  assert.match(review.reportedEvidence.siteNamedInReport, /does not allocate.*to Rosario/i);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.waterbodyOccurrenceInferred, false);
  assert.equal(review.decision.captureSiteAssignmentsAdded, 0);
  assert.equal(review.decision.rosarioCatchAssignmentAdded, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
});

test("Manila Bay scope and checkpoint pin the report without promoting landing data to an occurrence", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  const bay = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(source);
  assert.ok(bay);
  assert.ok(bay.sourceRefs.includes(review.sourceId));
  assert.equal(bay.publicAdmission, false);
  assert.equal(bay.boundaryStatus, "not-delineated");
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, null);
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.manilaBayNfrdi2020AnnualReportSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
