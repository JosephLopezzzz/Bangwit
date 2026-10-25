import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewName = "calabarzon-maragondon-emb-monitoring-review-20261026.json";
const [review, scope, registry, gap, gapanReview, scopeBytes, registryBytes, reviewBytes, gapanBytes] = await Promise.all([
  readFile(new URL(reviewName, base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-gapan-sapang-river-source-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL(reviewName, base)),
  readFile(new URL("calabarzon-gapan-sapang-river-source-review-20261026.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("EMB water-quality context stays historical and station-bounded", () => {
  assert.equal(review.phaseId, "L1");
  assert.equal(review.waterbodyId, "ph-wb-maragondon-river");
  assert.equal(review.sourceId, "emb-calabarzon-waterbodies");
  assert.match(review.status, /station-locations-and-measured-results-pending/);
  assert.match(review.method, /HTTP 403/);
  assert.equal(review.findings.length, 3);
  assert.match(review.findings[1].claim, /January and February 2020/);
  assert.match(review.findings[2].claim, /Class C/);
  assert.match(review.interpretation, /does not establish current water safety/);
  assert.equal(review.decisions.fishAssertionsAdded, 0);
  assert.equal(review.decisions.currentSafetyClaimsAdded, 0);
  assert.equal(review.decisions.stationToGapanCrosswalkAdded, false);
  assert.equal(review.decisions.geometryAdded, false);
  assert.equal(review.decisions.publicProjectionAdded, false);

  const maragondon = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(maragondon.sourceRefs.includes(review.sourceId));
  assert.match(maragondon.scopeNote, /historical water-quality context only, not current safety, fish evidence, or channel geometry/i);
  assert.equal(maragondon.publicAdmission, false);

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source.additionalUrls.includes(review.findings[1].sourceUrl));
  assert.ok(source.access.reviewFiles.includes(reviewName));
  assert.equal(source.publicationApproval, false);
});

test("Maragondon monitoring is not assigned to the Gapan/Sapang segment", () => {
  assert.equal(gapanReview.relatedSystemMonitoringContext.sourceId, "emb-calabarzon-waterbodies");
  assert.match(gapanReview.relatedSystemMonitoringContext.applicability, /No station coordinates or crosswalk/);
  assert.equal(gapanReview.decisions.speciesAssertionsAdded, 0);
  assert.equal(gapanReview.decisions.publicationApproval, false);
  assert.equal(gap.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(gap.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(gap.inputHashes.gapanSapangRiverReviewSha256, sha256(gapanBytes));
  assert.equal(gap.inputHashes.maragondonEmbMonitoringReviewSha256, sha256(reviewBytes));
});
