import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, scopeBytes, sourceBytes, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-lalaguna-municipal-habitat-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-lalaguna-municipal-habitat-review-20261026.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("official Lopez habitat context does not become a fish assertion or boundary", () => {
  assert.equal(review.observation.waterbodyId, "ph-wb-lalaguna-quezon-marsh");
  assert.equal(review.observation.sourceName, "Lalaguna Marshland");
  assert.deepEqual(review.observation.fishNames, []);
  assert.deepEqual(review.observation.scientificNames, []);
  assert.equal(review.observation.sampleDate, null);
  assert.equal(review.observation.boundaryOrGeometry, null);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.fishPresenceInferred, false);
  assert.equal(review.decision.fishAbsenceInferred, false);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.publicProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);

  const waterbody = scope.waterbodies.find((row) => row.id === review.observation.waterbodyId);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.equal(waterbody.reviewStatus, "research-queued");
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.match(waterbody.fishEvidenceStatus, /no-absence-inferred/);
});

test("municipal citation, scope totals and CALABARZON source hashes are pinned", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.access.reviewFiles.includes("calabarzon-lalaguna-municipal-habitat-review-20261026.json"), true);
  assert.match(source.reuse.content, /names no fish/);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.lalagunaMunicipalHabitatReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.sourceAssignments, 232);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 64);
  assert.equal(report.coverageSummary.registeredSources, 169);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
