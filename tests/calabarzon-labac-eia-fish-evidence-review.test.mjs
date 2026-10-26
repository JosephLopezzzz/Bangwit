import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, gbifBytes, scopeBytes, sourceBytes, reportBytes] = await Promise.all([
  readFile(new URL("calabarzon-labac-eia-fish-evidence-review-20261026.json", base)),
  readFile(new URL("calabarzon-labac-gbif-screen-20261026.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes);
const gbif = JSON.parse(gbifBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(sourceBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("official EIA fishery lead is recorded without promoting it to a dated occurrence", () => {
  assert.equal(review.phaseId, "L1");
  assert.equal(review.waterbodyId, "ph-wb-labac-river-cavite");
  assert.equal(review.eia.documentDate, "2023-11-16");
  assert.deepEqual(review.eia.fishNamesReported, ["Oreochromis niloticus", "Mugil cephalus"]);
  assert.equal(review.eia.collectionOrCatchDate, null);
  assert.equal(review.eia.stationOrReach, null);
  assert.equal(review.eia.methodForFishNames, null);
  assert.equal(review.eia.access.directPdfStatus, 403);
  assert.equal(review.eia.access.officialIndexedExcerptReviewed, true);
  assert.equal(review.eia.rights.itemSpecificReuseTermsVerified, false);
  assert.equal(review.decisions.speciesAssertionsAdded, 0);
  assert.equal(review.decisions.currentPresenceInferred, false);
  assert.equal(review.decisions.geometryAdded, false);
  assert.equal(review.decisions.publicProjectionAdded, false);
  assert.equal(review.decisions.publicationApproval, false);
});

test("bounded GBIF text searches and scope keep identity and absence unresolved", () => {
  assert.equal(gbif.waterbodyId, review.waterbodyId);
  assert.equal(gbif.queries.length, 18);
  assert.ok(gbif.queries.every((query) => query.httpStatus === 200 && query.resultCount === 0));
  assert.ok(gbif.queries.every((query) => query.pages.every((page) => page.rawResponse.bytes > 0)));
  assert.ok(gbif.queries.every((query) => query.pages.every((page) => /^[a-f0-9]{64}$/.test(page.rawResponse.sha256))));
  assert.equal(gbif.summary.uniqueCandidateRecordCount, 0);
  assert.equal(gbif.decisions.fishAbsenceInferred, false);

  const lead = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(lead);
  assert.equal(lead.salinity.classification, "unknown");
  assert.equal(lead.boundaryStatus, "not-delineated");
  assert.equal(lead.publicAdmission, false);
  assert.match(lead.fishEvidenceStatus, /EIA-reported-subsistence-fishery/);
  assert.match(lead.fishEvidenceStatus, /no-absence-inferred/);
  assert.ok(lead.sourceRefs.includes("aiib-2023-bcib-final-eia"));
  assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
  assert.equal(review.scopeSnapshot.sha256, sha256(scopeBytes));
});

test("registry, gap checkpoint, and provenance hashes agree", () => {
  const source = registry.sources.find((row) => row.id === "aiib-2023-bcib-final-eia");
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes("calabarzon-labac-eia-fish-evidence-review-20261026.json"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.labacEiaFishReviewSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.labacGbifScreenSha256, sha256(gbifBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 95);
  assert.equal(report.coverageSummary.sourceAssignments, 245);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 70);
  assert.equal(report.coverageSummary.registeredSources, 175);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  const gap = report.openGaps.find((row) => row.id === "cavite-river-fish-geometry-and-locality");
  assert.ok(gap);
  assert.match(gap.reason, /Oreochromis niloticus/);
  assert.match(gap.nextAction, /dated/i);
});
