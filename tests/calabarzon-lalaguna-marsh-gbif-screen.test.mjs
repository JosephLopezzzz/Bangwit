import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, scopeBytes, sourceBytes, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-lalaguna-marsh-gbif-screen-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
  readFile(new URL("sources.json", base), "utf8"),
  readFile(new URL("calabarzon-lalaguna-marsh-gbif-screen-20261026.json", base), "utf8"),
]);
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

test("Lalaguna Marsh GBIF screen is bounded and does not infer fish absence", () => {
  assert.equal(review.waterbodyId, "ph-wb-lalaguna-quezon-marsh");
  assert.equal(review.sourceId, "gbif-occurrence-downloads");
  assert.equal(review.queryBasis.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(review.queryBasis.taxonKey, "8VR36");
  assert.deepEqual(review.queryBasis.searchTerms, [
    "Lalaguna Marsh",
    "Lalaguna Marshland",
    "Lalaguna",
    "Lalaguna, Quezon",
  ]);
  assert.equal(review.queries.length, 8);
  assert.deepEqual(new Set(review.queries.map((row) => row.field)), new Set(["waterBody", "locality"]));
  assert.ok(review.queries.every((row) => row.httpStatus === 200 && row.totalRecords === 0 && row.returnedRecords === 0));
  assert.ok(review.queries.every((row) => row.rawResponse.bytes === 105 && /^[a-f0-9]{64}$/.test(row.rawResponse.sha256)));
  assert.ok(review.queries.every((row) => row.rawResponse.path.startsWith("raw/calabarzon-lalaguna-marsh-gbif-screen-20261026/")));
  assert.equal(review.summary.uniqueRecordCount, 0);
  assert.equal(review.summary.fishAssertionsAdded, 0);
  assert.equal(review.summary.publicProjectionAdded, false);
  assert.equal(review.decision.fishAbsenceInferred, false);

  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.equal(waterbody.reviewStatus, "research-queued");
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.match(waterbody.fishEvidenceStatus, /screen-zero;no-absence-inferred/);
  assert.ok(waterbody.administrativeAssociations.every((row) => !row.sourceRefs.includes("ajob-2014-tikub-freshwater-fish")));

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source.access.reviewFiles.includes("calabarzon-lalaguna-marsh-gbif-screen-20261026.json"));
  assert.ok(source.access.additionalRawPaths.includes("raw/calabarzon-lalaguna-marsh-gbif-screen-20261026/"));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.lalagunaMarshGbifScreenSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.sourceAssignments, 232);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 64);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 12);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 84);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
