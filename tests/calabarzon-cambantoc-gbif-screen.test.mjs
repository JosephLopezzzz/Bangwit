import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, scopeBytes, sourceBytes] = await Promise.all([
  readFile(new URL("calabarzon-cambantoc-gbif-screen-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
  readFile(new URL("sources.json", base), "utf8"),
]);
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

test("Cambantoc GBIF screen is complete, bounded, and does not infer fish absence", () => {
  assert.equal(review.waterbodyId, "ph-wb-cambantoc-makiling-river");
  assert.equal(review.queryBasis.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(review.queryBasis.taxonKey, "8VR36");
  assert.equal(review.queries.length, 4);
  assert.deepEqual(new Set(review.queries.map((row) => row.field)), new Set(["waterBody", "locality"]));
  assert.deepEqual(new Set(review.queries.map((row) => row.value)), new Set(["Cambantoc", "Cambantoc River"]));
  assert.ok(review.queries.every((row) => row.httpStatus === 200 && row.totalRecords === 0 && row.returnedRecords === 0));
  assert.ok(review.queries.every((row) => row.rawResponse.bytes === 79 && /^[a-f0-9]{64}$/.test(row.rawResponse.sha256)));
  assert.ok(review.queries.every((row) => row.rawResponse.path.startsWith("raw/calabarzon-cambantoc-gbif-screen-20261026/")));
  assert.match(review.decision.interpretation, /do not establish fish absence/i);
  assert.equal(review.summary.fishAssertionsAdded, 0);
  assert.equal(review.summary.publicProjectionAdded, false);

  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "freshwater");
  assert.match(waterbody.fishEvidenceStatus, /no-fish-absence-inferred/);
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source.access.reviewFiles.includes("calabarzon-cambantoc-gbif-screen-20261026.json"));
  assert.ok(source.access.additionalRawPaths.includes("raw/calabarzon-cambantoc-gbif-screen-20261026/"));

  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.sourceAssignments, 245);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 12);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
