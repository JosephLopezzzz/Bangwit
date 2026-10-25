import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-dagatdagatan-lopez-identity-screen-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-dagatdagatan-lopez-identity-screen-20261026.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("the 2007 Lopez fish-composition citation remains a retrieval and identity lead", () => {
  assert.equal(review.status, "secondary-fish-study-bibliography-found;candidate-lalaguna-name-crosswalk-unresolved;bounded-gbif-screen-zero");
  assert.equal(review.bibliographicLead.referenceId, 81470);
  assert.equal(review.bibliographicLead.year, 2007);
  assert.equal(review.bibliographicLead.originalStudyRetrieved, false);
  assert.equal(review.bibliographicLead.reuseLicenseVerified, false);
  assert.equal(review.candidate.possibleScopeLeadId, "ph-wb-lalaguna-quezon-marsh");
  assert.equal(review.candidate.identityDecision, "candidate-only-not-adopted");

  const lalaguna = scope.waterbodies.find((row) => row.id === "ph-wb-lalaguna-quezon-marsh");
  assert.ok(lalaguna);
  assert.ok(!lalaguna.aliases.includes("Dagat-dagatan Lake"));
  assert.ok(!lalaguna.sourceRefs.includes("fishbase-reference-81470-dagatdagatan-lopez"));
});

test("zero GBIF text queries do not become absence or public species claims", () => {
  assert.deepEqual(review.gbifScreen.queries.map((row) => [row.field, row.httpStatus, row.resultCount, row.enumeratedCount]), [
    ["waterBody", 200, 0, 0],
    ["locality", 200, 0, 0],
  ]);
  assert.ok(review.gbifScreen.queries.every((row) => row.endOfRecords));
  assert.equal(review.decision.speciesNamesTranscribed, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.fishAbsenceInferred, false);
  assert.equal(review.decision.publicProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
});

test("bibliography and raw-query provenance are registered", () => {
  const fishBase = registry.sources.find((row) => row.id === review.bibliographicLead.sourceId);
  const gbif = registry.sources.find((row) => row.id === "gbif-occurrence-downloads");
  assert.ok(fishBase);
  assert.equal(fishBase.publicationApproval, false);
  assert.ok(fishBase.access.reviewFiles.includes("calabarzon-dagatdagatan-lopez-identity-screen-20261026.json"));
  assert.ok(gbif.access.reviewFiles.includes("calabarzon-dagatdagatan-lopez-identity-screen-20261026.json"));
  assert.ok(gbif.access.additionalRawPaths.includes("raw/calabarzon-dagatdagatan-lopez-screen-20261026/"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.dagatdagatanLopezIdentityScreenSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
});
