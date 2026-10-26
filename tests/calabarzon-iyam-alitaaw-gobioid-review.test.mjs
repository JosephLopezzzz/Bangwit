import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, scope, report, scopeBytes, sourceBytes] = await Promise.all([
  readFile(new URL("calabarzon-iyam-alitaaw-gobioid-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
  readFile(new URL("sources.json", base), "utf8"),
]);
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

test("the Iyam-Alitaaw primary survey records only source-level historical taxa", () => {
  assert.equal(review.waterbodyId, "ph-wb-iyam-lucena-river");
  assert.deepEqual(review.primarySource.studySite.samplingPeriod, ["August 2010", "July 2011"]);
  assert.equal(review.primarySource.studySite.individualsReported, 211);
  assert.equal(review.primarySource.reportedTaxa.length, 8);
  assert.equal(review.primarySource.reportedTaxa.filter((row) => row.rank === "species").length, 6);
  assert.equal(review.primarySource.reportedTaxa.filter((row) => row.rank === "genus-only").length, 2);
  assert.ok(review.primarySource.reportedTaxa.every((row) => row.sourceSiteMark === "present"));
  assert.equal(review.primarySource.accessReview.sourceProseFiguresAndTableLayoutCopied, false);
});

test("all six species-rank names match the pinned taxonomy index without changing source rank", () => {
  assert.equal(review.taxonomyReview.matches.length, 6);
  assert.equal(review.taxonomyReview.matchingIndex.alias, "COL26.6 XR");
  assert.equal(review.taxonomyReview.matchingIndex.stableDuringRun, true);
  assert.ok(review.taxonomyReview.matches.every((row) => row.matchType === "EXACT" && row.confidence === 100));
  assert.deepEqual(
    review.taxonomyReview.matches.map((row) => row.sourceName).sort(),
    review.primarySource.reportedTaxa.filter((row) => row.rank === "species").map((row) => row.scientificName).sort(),
  );
  assert.equal(review.decision.historicalResearchAssertionsPrepared, 0);
  assert.equal(review.decision.publicAppAssertions, 0);
  assert.equal(review.decision.publicProjection, false);
});

test("the corrected GBIF discovery screen is complete for its eight strings and bounded to ray-finned fish", () => {
  assert.equal(review.openDataAlternative.queries.length, 8);
  assert.equal(review.openDataAlternative.totalReturnedRecords, 0);
  assert.deepEqual(new Set(review.openDataAlternative.queries.map((row) => row.field)), new Set(["waterBody", "locality"]));
  assert.deepEqual(
    new Set(review.openDataAlternative.queries.map((row) => row.value)),
    new Set(review.openDataAlternative.searchStrings),
  );
  for (const query of review.openDataAlternative.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.returnedRecords, 0);
    assert.equal(query.rawResponse.bytes, 79);
    assert.match(query.rawResponse.sha256, /^[a-f0-9]{64}$/);
    assert.match(query.rawResponse.path, /^raw\/calabarzon-iyam-gbif-screen-20261026\//);
  }
  assert.match(review.openDataAlternative.interpretation, /do not establish fish absence/i);
});

test("reuse conflict, waterbody scope, and the CALABARZON checkpoint stay explicit", () => {
  assert.equal(review.rightsReview.zenodoItemSpecificLicenseVisible, true);
  assert.equal(review.rightsReview.zenodoRecordLicense, "CC-BY-4.0");
  assert.equal(review.rightsReview.rightsHolderOrDepositorAuthorityConfirmed, false);
  assert.match(review.rightsReview.decision, /keep the species table out of Bangwit/i);

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.match(source.researchStatus, /publisher-license-conflict-pending/);
  assert.ok(source.access.reviewFiles.includes("calabarzon-iyam-alitaaw-gobioid-review-20261026.json"));

  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(waterbody);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.equal(waterbody.fishEvidenceStatus, "historical-2010-2011-gobioid-survey-reviewed;6-exact-species-matches;2-genus-only;license-conflict;no-public-assertions");

  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.flatMap((row) => row.sourceRefs).length);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, new Set(scope.waterbodies.flatMap((row) => row.sourceRefs)).size);
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 95);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
});
