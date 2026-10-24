import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all(
  [
    "central-luzon-jica-mcrp-freshwater-interview-catches-review-20261024.json",
    "central-luzon-discovery-checkpoint-20261024.json",
    "sources.json",
  ].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)),
);

test("JICA freshwater catch categories remain bounded historical interview reports", () => {
  assert.equal(review.stationReports.length, 5);
  assert.deepEqual(review.surveyContext.fieldSurveyDates, ["2018-02-06", "2018-02-07"]);
  assert.equal(review.surveyContext.catchDates, null);
  assert.equal(review.disposition.reportedStationCategoryMentions, 20);
  assert.equal(review.disposition.sourceReportedUniqueCategories, 12);
  assert.equal(review.disposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
  assert.equal(review.disposition.fishCaptureCoordinatesAdded, 0);
  assert.equal(review.disposition.safetyOrFoodClaimsAdded, 0);
  assert.equal(review.disposition.waterbodyGeometryAdded, false);
  assert.equal(review.source.reuse.publicationApproval, false);

  const labangan = review.stationReports.find((row) => row.station === "SW-2");
  assert.equal(labangan.reportedCatchCategories.length, 8);
  assert.match(labangan.coordinateMeaning, /not a fish capture coordinate/);
  assert.ok(labangan.reportedCatchCategories.some((row) => row.sourceRank === "family"));
  assert.ok(labangan.reportedCatchCategories.some((row) => row.sourceRank === "local-name-only"));

  const calutcut = review.stationReports.find((row) => row.station === "SW-8");
  assert.ok(calutcut.reportedCatchCategories.some((row) => row.sourceString.includes('"bulig"; dalag')));

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.access.rawSha256, review.source.access.pdfSha256);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(checkpoint.centralLuzonJicaMcrpFreshwaterInterviewCatchReviewFile,
    "central-luzon-jica-mcrp-freshwater-interview-catches-review-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
});
