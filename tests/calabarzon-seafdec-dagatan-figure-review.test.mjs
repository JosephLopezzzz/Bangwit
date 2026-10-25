import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-seafdec-dagatan-figure-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-seafdec-dagatan-figure-review-20261026.json", base)),
]);
const waterbodiesById = new Map(scope.waterbodies.map((row) => [row.id, row]));
const sourcesById = new Map(registry.sources.map((row) => [row.id, row]));
const expectedLabels = [
  "Monopterus albus",
  "Trichogaster pectoralis",
  "Cyprinus carpio",
  "Oreochromis sp.",
  "Channa striata",
  "Clarias macrocephalus",
];

test("SEAFDEC Dagatan figure labels retain the unresolved source locality", () => {
  assert.equal(review.status, "figure-labels-transcribed;five-binomial-colxr-proposals-recorded;site-identity-occurrence-and-reuse-held");
  assert.deepEqual(review.figure.labelsAsPrinted, expectedLabels);
  assert.equal(review.sourceReceipt.sha256, "7c6b6e45d24de3fc2a053759d457a8584aeeeb07a5910c3b7051290e6408bd26");
  assert.equal(review.sourceReceipt.visuallyReviewedPdfPage, 3);
  assert.match(review.figure.waterbodyAssignment, /Unassigned/);
  for (const id of review.identityReview.candidateScopeLeadIds) {
    const row = waterbodiesById.get(id);
    assert.ok(row);
    assert.ok(!row.sourceRefs.includes(review.sourceId));
  }
  assert.equal(review.decision.waterbodyLeadAssignments, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.fishAbsenceClaimAdded, false);
});

test("COL XR proposals preserve the source synonym and genus-only label", () => {
  const proposals = review.taxonomyProposals;
  assert.deepEqual(proposals.map((row) => row.sourceNameAsPrinted), expectedLabels);
  assert.equal(proposals.filter((row) => row.matchType === "EXACT").length, 5);
  assert.equal(proposals.filter((row) => row.usageStatus === "SYNONYM").length, 1);
  const synonym = proposals.find((row) => row.sourceNameAsPrinted === "Trichogaster pectoralis");
  assert.equal(synonym.acceptedName, "Trichopodus pectoralis");
  assert.equal(synonym.reviewStatus, "pending-independent-taxonomic-review");
  const genus = proposals.find((row) => row.sourceNameAsPrinted === "Oreochromis sp.");
  assert.equal(genus.queryStatus, "not-queried-genus-level-only");
  assert.equal(genus.acceptedTaxon, null);
  assert.ok(proposals.filter((row) => row.queryUrl).every((row) => /^[a-f0-9]{64}$/.test(row.responseSha256)));

  const service = review.matchingService;
  assert.equal(service.indexAlias, "COL26.6 XR");
  assert.equal(service.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(service.indexStableDuringBatch, true);
  assert.equal(service.metadataResponseSha256, service.endOfBatchMetadataSha256);
});

test("source registry and CALABARZON checkpoint pin the figure review without approving reuse", () => {
  const source = sourcesById.get(review.sourceId);
  assert.ok(source.access.reviewFiles.includes("calabarzon-seafdec-dagatan-figure-review-20261026.json"));
  assert.equal(source.access.downloadedFile.sha256, review.sourceReceipt.sha256);
  assert.equal(source.publicationApproval, false);
  assert.match(source.reuse.content, /no figure.*is reproduced/i);
  assert.equal(review.reuse.sourceRights.includes("no item-specific open license"), true);
  assert.equal(
    report.inputHashes.seafdecDagatanFigureReviewSha256,
    createHash("sha256").update(reviewBytes).digest("hex"),
  );
  assert.match(report.nextStep.action, /Bal-on Reservoir/);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
