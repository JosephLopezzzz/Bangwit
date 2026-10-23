import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-nfrdi-taal-guide-review-20261024.json", import.meta.url);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, coverageSweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("NFRDI Taal guide rows preserve the source's noncommercial terms and stay out of the app pending review", () => {
  assert.equal(review.source.id, "nfrdi-2023-taal-field-identification-guide");
  assert.equal(review.source.dataCollectionWindow, "2014-2018");
  assert.equal(review.rightsReview.license, "CC-BY-NC-4.0");
  assert.equal(review.counts.speciesPagesReviewed, 45);
  assert.equal(review.counts.uniqueSourceReportedNames, 45);
  assert.equal(review.counts.recordsWithVerifiedLandingSiteLabels, 45);
  assert.equal(review.counts.recordsWithNamedMunicipalLandingSites, 16);
  assert.equal(review.counts.recordsWithLakeWideLabel, 29);
  assert.equal(review.counts.speciesAssertionsAdmitted, 0);
  assert.equal(review.counts.publicProjection, false);
  assert.match(review.provenance.rawPdfSha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(review.taxonomyCrosscheck.counts, {
    guideNames: 45,
    "exact-species": 40,
    "family-conflict": 1,
    "not-represented-in-frozen-checklist": 4,
    proposalsStillPending: 41,
  });
  assert.ok(review.taxonomyCrosscheck.records.every((row) =>
    row.taxonomyReviewStatus === "proposal-only-not-adopted" ||
    row.taxonomyReviewStatus === "not-searched-in-this-crosswalk",
  ));
  assert.match(review.taxonomyCrosscheck.method, /search aid, not a fresh lookup or taxonomic approval/);

  const allowedSites = new Set([
    "Agoncillo", "Laurel", "Talisay", "Tanauan", "Balete", "Mataasnakahoy", "Cuenca",
    "Santa Teresita", "San Nicolas", "Lake wide",
  ]);
  const names = new Set();
  const pageLocators = new Set();
  for (const [index, row] of review.records.entries()) {
    assert.ok(row.sourceReportedName);
    assert.ok(!names.has(row.sourceReportedName), `Duplicate source name: ${row.sourceReportedName}`);
    names.add(row.sourceReportedName);
    assert.equal(row.evidenceKind, "historical-landed-catch-survey");
    assert.deepEqual(row.surveyWindow, { startYear: 2014, endYear: 2018, precision: "study-period-only" });
    assert.ok(row.landingSitesAsReported.length > 0);
    assert.ok(row.landingSitesAsReported.every((site) => allowedSites.has(site)));
    assert.ok(!pageLocators.has(row.sourceLocator.pdfPage));
    pageLocators.add(row.sourceLocator.pdfPage);
    assert.equal(row.sourceLocator.pdfPage, 24 + index * 2);
    assert.equal(row.sourceLocator.printedPage, 15 + index * 2);
    assert.equal(row.admittedToApp, false);
  }

  const source = sourceRegistry.sources.find((row) => row.id === review.source.id);
  assert.ok(source);
  assert.equal(source.license, "CC-BY-NC-4.0");
  assert.equal(source.publicationApproval, false);
  assert.equal(source.access.rawPdfSha256, review.provenance.rawPdfSha256);

  const followUp = coverageSweep.additionalPrimarySourceFollowUps.find((row) => row.sourceId === review.source.id);
  assert.ok(followUp);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
  assert.match(followUp.reuseReview, /CC BY-NC 4\.0/);
});
