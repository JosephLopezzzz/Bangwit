import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewName = "calabarzon-tagbac-creek-source-review-20261026.json";
const [review, scope, sources, report, scopeBytes, sourceBytes, reviewBytes] = await Promise.all([
  readFile(new URL(reviewName, base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL(reviewName, base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Tagbac program-segment names are crosswalked without merging the full watercourse", () => {
  assert.equal(review.waterbodyId, "ph-wb-tagbac-rizal-creek");
  assert.equal(review.officialProgramSegmentEvidence[0].monitoringStations, 3);
  assert.equal(review.officialProgramSegmentEvidence[0].reportedWholeProgramStretchKm, 1);
  assert.equal(review.officialProgramSegmentEvidence[1].reportedName, "Tagbac River");
  assert.match(review.officialProgramSegmentEvidence[1].interpretation, /program segment only/);
  assert.match(review.officialProgramSegmentEvidence[2].interpretation, /Do not merge/);
  assert.equal(review.decisions.globalTagbacRiverAliasAdded, false);
  assert.equal(review.decisions.fullChannelGeometryAdded, false);
  assert.equal(review.decisions.stationCoordinatesCopied, false);
  assert.equal(review.decisions.publicProjectionAdded, false);

  const lead = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(lead);
  assert.equal(lead.kind, "stream");
  assert.equal(lead.salinity.classification, "unknown");
  assert.equal(lead.boundaryStatus, "not-delineated");
  assert.equal(lead.publicAdmission, false);
  assert.ok(lead.sourceRefs.includes("emb-calabarzon-waterbodies"));
  assert.ok(lead.sourceRefs.includes("emb-calabarzon-annual-report-2024"));
  assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
  assert.match(lead.fishEvidenceStatus, /no-fish-absence-inferred/);

  assert.ok(review.gbifTextScreen.queries.every((q) => q.httpStatus === 200 && q.occurrenceCount === 0));
  assert.ok(review.gbifTextScreen.comparisonQueries.every((q) => q.occurrenceCount === 0));
  assert.match(review.gbifTextScreen.interpretation, /not evidence of fish absence/);
  assert.equal(review.boundedFishSourceSearch.datedWaterbodySpecificFishSurveyLocated, false);
});

test("Tagbac sources and current coverage hashes are registered", () => {
  for (const id of review.sourceIds) assert.ok(sources.sources.some((source) => source.id === id));
  assert.ok(sources.sources.find((source) => source.id === "emb-calabarzon-waterbodies").access.reviewFiles.includes(reviewName));
  assert.ok(sources.sources.find((source) => source.id === "emb-calabarzon-annual-report-2024").access.reviewFiles.includes(reviewName));
  assert.ok(sources.sources.find((source) => source.id === "gbif-occurrence-downloads").access.additionalRawPaths.includes("raw/calabarzon-tagbac-creek-gbif-20261026/"));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.tagbacCreekReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.reduce((n, row) => n + row.sourceRefs.length, 0));
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
