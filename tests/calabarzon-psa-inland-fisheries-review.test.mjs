import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, registryBytes, report] = await Promise.all([
  readFile(new URL("calabarzon-psa-inland-fisheries-review-20261026.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
]);
const review = JSON.parse(reviewBytes.toString("utf8"));
const registry = JSON.parse(registryBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("PSA Cavite inland fisheries figures remain province-level statistical context", () => {
  assert.equal(review.sourceId, "psa-cavite-q3-2025-inland-fisheries");
  assert.equal(review.source.referenceNumber, "2026-SR-006");
  assert.equal(review.source.referencePeriod, "2025-07-01/2025-09-30");
  assert.equal(review.reportedProduction.totalInlandMunicipalQ3_2025Preliminary, 9.08);
  assert.deepEqual(review.reportedProduction.topCategories.map((row) => row.quantity), [4.83, 2.12, 2.12]);
  assert.match(review.reportedProduction.topCategories[0].category, /taxon unresolved/);
  assert.match(review.reportedProduction.topCategories[1].category, /aggregate category/);
  assert.match(review.reportedProduction.topCategories[2].category, /not a fish/);
  assert.match(review.scope.waterbodyResolution, /No river, lake, dam, marsh/);
  assert.equal(review.decision.waterbodyAssignmentsAdded, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.scientificNamesAssigned, 0);
  assert.equal(review.decision.wildOccurrenceInferred, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.catchabilityInferred, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
  assert.equal(review.decision.regionalBaselineComplete, false);
  assert.match(review.source.reuseStatus, /attachment-specific reuse terms were not independently confirmed/);
});

test("PSA statistical context is registered without adding waterbody assignments", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, null);
  assert.match(source.researchStatus, /not-waterbody-resolved/);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.sourceAssignments, 244);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 69);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.psaCaviteInlandFisheriesReviewSha256, sha256(reviewBytes));
});
