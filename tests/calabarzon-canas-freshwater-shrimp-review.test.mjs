import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewFile = "calabarzon-canas-freshwater-shrimp-review-20261026.json";
const fishLeadFile = "calabarzon-canas-2017-2019-fish-study-access-review-20261026.json";
const [reviewBytes, fishLeadBytes, scopeBytes, registryBytes, reportBytes] = await Promise.all([
  readFile(new URL(reviewFile, base)),
  readFile(new URL(fishLeadFile, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes);
const fishLead = JSON.parse(fishLeadBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(registryBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("the official Cañas study is recorded as selected-site crustacean evidence, not fish or a complete river list", () => {
  assert.equal(review.status, "official-CvSU-2022-article-reviewed;6-source-named-crustacean-taxa;Tejero-and-Wawa-site-records;fish-thesis-cited-not-retrieved;reuse-pending;research-only");
  assert.equal(review.source.issue.startsWith("July"), true);
  assert.equal(review.source.access.pdfVisualReview, false);
  assert.equal(review.source.access.pdfBytesAndSha256, null);
  assert.equal(review.studyDesign.samplingSites.length, 4);
  assert.deepEqual(review.studyDesign.samplingSites.map((site) => site.reportedSpecimenCount), [0, 0, 8, 16]);
  assert.equal(review.studyDesign.calendarSamplingDates, null);
  assert.equal(review.studyDesign.sourceSiteCoordinateValuesTranscribed, false);
  assert.equal(review.taxa.length, 6);
  assert.equal(review.qualityReview.totalSourceReportedIndividuals, 24);
  assert.equal(review.qualityReview.sourceInternalCountConflict.includes("one introductory sentence says seven"), true);
  assert.equal(review.decisions.fishTaxaAdded, 0);
  assert.equal(review.decisions.speciesAssertionsAddedToPublicApp, 0);
  assert.equal(review.decisions.currentPresenceInferred, false);
  assert.equal(review.decisions.absenceInferredFromZeroCounts, false);
  assert.equal(review.decisions.wholeRiverInventoryInferred, false);
  assert.equal(review.decisions.publicProjectionAdded, false);
  assert.equal(review.decisions.regionalBaselineComplete, false);
  assert.equal(review.rights.itemSpecificReuseTermsVerified, false);
  assert.equal(review.rights.publicationApproval, false);
});

test("source spellings and site counts stay separate from the GBIF synonym crosswalk", () => {
  const vannamei = review.taxa.find((taxon) => taxon.sourceScientificName === "Litopenaeus vannamei");
  assert.ok(vannamei);
  assert.equal(vannamei.gbifBackbone.status, "SYNONYM");
  assert.equal(vannamei.gbifBackbone.acceptedScientificName, "Penaeus vannamei Boone, 1931");
  assert.equal(vannamei.sourceReportedCounts.W, 4);
  assert.equal(review.taxa.reduce((sum, taxon) => sum + taxon.sourceReportedCounts.total, 0), 24);
  assert.equal(review.studyDesign.samplingSites.find((site) => site.sourceCode === "T").sourceMunicipality, "General Trias City");
  assert.equal(review.studyDesign.samplingSites.find((site) => site.sourceCode === "W").sourceMunicipality, "Rosario");
  assert.equal(review.studyDesign.waterbodyCrosswalk.includes("No main-channel/tributary geometry"), true);
  assert.equal(review.qualityReview.taxonomyCrosscheck.scope.includes("do not independently verify"), true);
});

test("the shrimp paper strengthens the fish-thesis retrieval lead without claiming the thesis data", () => {
  assert.equal(review.source.bibliographicFishStudyLead.thesisOrFishTableRetrieved, false);
  assert.equal(review.source.bibliographicFishStudyLead.decision.includes("contains no fish names"), true);
  assert.equal(fishLead.reportedStudyLead.fullStudyLocated, false);
  assert.equal(fishLead.followupSourceDiscovery.sourceId, review.sourceId);
  assert.equal(fishLead.followupSourceDiscovery.fishNamesExtracted.length, 0);
});

test("the regional snapshot pins the review while preserving the open Cañas fish and geometry gap", () => {
  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyLeadId);
  const source = registry.sources.find((row) => row.id === review.sourceId);
  const gap = report.openGaps.find((row) => row.id === "canas-river-fish-evidence-and-geometry");
  assert.ok(waterbody);
  assert.ok(source);
  assert.ok(gap);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.ok(gap.sourceRefs.includes(review.sourceId));
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes(reviewFile));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sourceCount, 175);
  assert.equal(review.scopeSnapshot.sha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.canasFreshwaterShrimpReviewSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.canasFishStudyAccessReviewSha256, sha256(fishLeadBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 95);
  assert.equal(report.coverageSummary.sourceAssignments, 245);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 70);
  assert.equal(report.coverageSummary.registeredSources, 175);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(gap.status, "open");
  assert.match(gap.nextAction, /2017 CvSU thesis/i);
});
