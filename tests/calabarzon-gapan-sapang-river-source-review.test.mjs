import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, scopeBytes, sourceBytes, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-gapan-sapang-river-source-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-gapan-sapang-river-source-review-20261026.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("official sources create a bounded Gapan/Sapang river lead without inventing fish or boundaries", () => {
  assert.equal(review.phaseId, "L1");
  assert.equal(review.scopeLeadId, "ph-wb-gapan-sapang-river-ternate");
  assert.equal(review.officialSourceFindings[0].reportedSystemContext, "within Maragondon River System");
  assert.equal(review.officialSourceFindings[0].reportedProgramSegmentLengthKm, 1);
  assert.deepEqual(review.officialSourceFindings[0].barangaySignatories, ["Bucana", "Sapang I"]);
  assert.equal(review.officialSourceFindings[1].reportedNameVariant, "Gapan (Sapang) River");
  assert.ok(review.officialSourceFindings.every((row) => row.directAccess.startsWith("HTTP 403")));
  assert.equal(review.hydrographyAccessReview.publicSelfServiceAccess, false);
  assert.equal(review.hydrographyAccessReview.gapanLayerPresence, "unknown; the restricted system was not accessed");
  assert.equal(review.hydrographyAccessReview.loginOrAccessBypassAttempted, false);
  assert.equal(review.hydrographyAccessReview.geometryAdded, false);
  assert.match(review.hydrographyAccessReview.decision, /authorized public-products inquiry/i);
  assert.equal(review.boundedFishSourceSearch.officialDatedFishSurveyLocated, false);
  assert.equal(review.gbifTextScreen.queries.length, 6);
  assert.ok(review.gbifTextScreen.queries.every((row) => row.httpStatus === 200 && row.occurrenceCount === 0));
  assert.ok(review.gbifTextScreen.queries.every((row) => /^[a-f0-9]{64}$/.test(row.responseSha256)));
  assert.match(review.gbifTextScreen.interpretation, /not fish-absence evidence/i);

  const lead = scope.waterbodies.find((row) => row.id === review.scopeLeadId);
  assert.ok(lead);
  assert.equal(lead.name, "Gapan River");
  assert.deepEqual(lead.aliases, ["Gapan (Sapang) River"]);
  assert.equal(lead.kind, "river");
  assert.equal(lead.salinity.classification, "unknown");
  assert.equal(lead.boundaryStatus, "not-delineated");
  assert.equal(lead.publicAdmission, false);
  assert.match(lead.fishEvidenceStatus, /no-fish-absence-inferred/);
  assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
  assert.equal(review.decisions.speciesAssertionsAdded, 0);
  assert.equal(review.decisions.dietClaimsAdded, 0);
  assert.equal(review.decisions.publicationApproval, false);
  assert.equal(review.decisions.regionalBaselineComplete, false);
});

test("CALABARZON checkpoint and source hashes match the reviewed scope", () => {
  for (const id of review.sourceIds) {
    const source = registry.sources.find((row) => row.id === id);
    assert.ok(source);
    assert.equal(source.publicationApproval, false);
    assert.ok(source.access.reviewFiles.includes("calabarzon-gapan-sapang-river-source-review-20261026.json"));
    assert.match(source.access.status, /direct-request-returned-403/);
  }
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.gapanSapangRiverReviewSha256, sha256(reviewBytes));
  assert.ok(report.waterbodySnapshot.some((row) => row.id === review.scopeLeadId));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 95);
  assert.equal(report.coverageSummary.byWaterbodyKind.river, 50);
  assert.equal(report.coverageSummary.sourceAssignments, 244);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 69);
  assert.equal(report.coverageSummary.registeredSources, 174);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 12);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 90);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.ok(report.openGaps.some((gap) => gap.id === "gapan-sapang-river-evidence-and-extent"));
});
