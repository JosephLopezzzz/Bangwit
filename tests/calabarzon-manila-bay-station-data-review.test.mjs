import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-manila-bay-station-data-review-20261024.json", import.meta.url);
const sourceRegistryUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, sweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourceRegistryUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("Manila Bay trawl table and station map remain held without item-specific permission or coordinates", () => {
  assert.equal(review.source.sourceId, "nfrdi-2017-manila-bay-trawl");
  assert.equal(review.source.surveyPeriod, "2014-03/2015-10");
  assert.equal(review.source.pdfPageCount, 16);
  assert.match(review.source.rawPdfSha256, /^[a-f0-9]{64}$/);
  assert.equal(review.stationDataReview.preEstablishedDraggingStations, 16);
  assert.equal(review.stationDataReview.supplementaryStationDatasetListed, false);
  assert.equal(review.stationDataReview.studyAreaMap.individualStationCoordinatesInText, false);
  assert.equal(review.stationDataReview.studyAreaMap.stationCoordinateTableFound, false);
  assert.equal(review.tableReview.commonnessMarks.includes("not individual fish counts"), true);
  assert.equal(review.tableReview.caviteSummaryFishTaxa, 24);
  assert.equal(review.tableReview.caviteSummaryAllTaxa, 100);
  assert.equal(review.rightsReview.itemSpecificLicenseIn2017PdfOrMetadata, false);
  assert.equal(review.rightsReview.retroactiveApplicationVerified, false);
  assert.equal(review.permissionAndDataRequestDraft.sent, false);
  assert.deepEqual(review.counts, {
    speciesAssertionsAdmitted: 0,
    stationCoordinatesAdmitted: 0,
    waterbodyGeometryValidated: 0,
    publicProjection: false,
  });

  const registeredSource = sourceRegistry.sources.find((source) => source.id === review.source.sourceId);
  assert.ok(registeredSource);
  assert.equal(registeredSource.publicationApproval, false);
  assert.equal(registeredSource.researchStatus, "full-text-reviewed; item-specific-reuse-rights-pending; no-species-assertions-admitted");

  const followUp = sweep.additionalPrimarySourceFollowUps.find((item) => item.sourceId === review.source.sourceId);
  assert.ok(followUp);
  assert.equal(followUp.permissionRequestSent, false);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
  assert.equal(sweep.sources.find((item) => item.sourceId === review.source.sourceId).sourceTableFacts.caviteFishSpeciesCountInTableSummary, 24);
});
