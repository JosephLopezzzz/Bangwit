import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, scopeBytes, sourceBytes, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-lopez-marsh-gbif-screen-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-lopez-marsh-gbif-screen-20261026.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Kalantasan and Lutang GBIF screens are bounded text searches, not absence evidence", () => {
  assert.equal(review.batchId, "calabarzon-lopez-marsh-gbif-screen-20261026");
  assert.equal(review.queryBasis.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(review.queryBasis.taxonKey, "8VR36");
  assert.deepEqual(review.searchTerms, ["Kalantasan Marsh", "Kalantasan", "Lutang Marsh"]);
  assert.equal(review.queries.length, 6);
  assert.ok(review.queries.every((row) => row.httpStatus === 200 && row.resultCount === 0 && row.enumeratedCount === 0 && row.endOfRecords));
  assert.ok(review.queries.every((row) => row.rawResponse.bytes === 79 && /^[a-f0-9]{64}$/.test(row.rawResponse.sha256)));
  assert.ok(review.queries.every((row) => row.rawResponse.path.startsWith("raw/calabarzon-lopez-wetland-gbif-screen-20261026/")));
  assert.equal(review.summary.uniqueRecordCount, 0);
  assert.equal(review.summary.speciesAssertionsAdded, 0);
  assert.equal(review.summary.geometryAdded, false);
  assert.equal(review.summary.publicProjectionAdded, false);
  assert.equal(review.summary.fishAbsenceInferred, false);

  for (const id of ["ph-wb-kalantasan-lopez-marsh", "ph-wb-lutang-lopez-marsh"]) {
    const waterbody = scope.waterbodies.find((row) => row.id === id);
    assert.ok(waterbody);
    assert.ok(waterbody.sourceRefs.includes("gbif-occurrence-downloads"));
    assert.equal(waterbody.reviewStatus, "research-queued");
    assert.equal(waterbody.publicAdmission, false);
    assert.equal(waterbody.boundaryStatus, "not-delineated");
    assert.match(waterbody.fishEvidenceStatus, /no-fish-absence-inferred/);
  }
});

test("GBIF query provenance and CALABARZON checkpoint hashes are pinned", () => {
  const gbif = registry.sources.find((row) => row.id === "gbif-occurrence-downloads");
  assert.ok(gbif.access.reviewFiles.includes("calabarzon-lopez-marsh-gbif-screen-20261026.json"));
  assert.ok(gbif.access.additionalRawPaths.includes("raw/calabarzon-lopez-wetland-gbif-screen-20261026/"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.lopezMarshGbifScreenSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.sourceAssignments, 217);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 59);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 11);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
