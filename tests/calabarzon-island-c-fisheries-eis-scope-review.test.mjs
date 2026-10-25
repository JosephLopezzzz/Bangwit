import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import review from "../data/research/philippines/calabarzon-island-c-fisheries-eis-scope-review-20261026.json" with { type: "json" };
import report from "../data/research/philippines/calabarzon-coverage-gap-report-20261025.json" with { type: "json" };
import scope from "../data/research/philippines/calabarzon-scope.json" with { type: "json" };
import registry from "../data/research/philippines/sources.json" with { type: "json" };
import palico from "../data/research/philippines/palico-river-decisions.json" with { type: "json" };

const base = new URL("../data/research/philippines/", import.meta.url);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Island C EIS remains broad Manila Bay context with no species assertions", async () => {
  const [sourceBytes, scopeBytes, reviewBytes] = await Promise.all([
    readFile(new URL("sources.json", base)),
    readFile(new URL("calabarzon-scope.json", base)),
    readFile(new URL("calabarzon-island-c-fisheries-eis-scope-review-20261026.json", base)),
  ]);
  const source = registry.sources.find((row) => row.id === review.sourceId);
  const assignedWaterbodies = scope.waterbodies.filter((waterbody) => waterbody.sourceRefs.includes(review.sourceId));

  assert.ok(source);
  assert.equal(review.sourceReview.url, source.url);
  assert.match(review.fisheriesLead.table, /Rosario, Noveleta, and Cavite City/);
  assert.equal(review.fisheriesLead.tableBodyRetrieved, true);
  assert.equal(review.fisheriesLead.directEisRetrieved, true);
  assert.equal(review.fisheriesLead.sourceReportedFishRowCount, 15);
  assert.equal(review.fisheriesLead.sourceReportedNonFishRowCount, 2);
  assert.deepEqual(review.sourceReview.retrievalReceipt.reviewedPdfPages, [344, 345]);
  assert.match(review.sourceReview.retrievalReceipt.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.fisheriesLead.speciesRowsTranscribed, 0);
  assert.equal(review.fisheriesLead.candidateTaxaAdded, 0);
  assert.equal(review.decision.sourceAssignmentsAdded, 1);
  assert.equal(review.decision.assignedWaterbodyId, "ph-wb-manila-bay");
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.decision.publicationApproval, false);
  assert.deepEqual(assignedWaterbodies.map((waterbody) => waterbody.id), ["ph-wb-manila-bay"]);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, null);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sourceCount, 161);
  assert.ok(source.access.reviewFiles.includes("calabarzon-island-c-fisheries-eis-scope-review-20261026.json"));

  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.islandCFisheriesReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
  assert.equal(report.coverageSummary.sourceAssignments, 214);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 58);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(palico.snapshotHashes.registry, sha256(sourceBytes));
  assert.equal(palico.snapshotHashes.scope, sha256(scopeBytes));
  assert.equal(palico.counts.admittedRows, 12);
  assert.equal(palico.counts.heldRows, 3);
});
