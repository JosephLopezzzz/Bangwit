import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("central-luzon-pampanga-estuary-fish-study-review-20261024.json", base), "utf8"));
const checkpoint = JSON.parse(await readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8"));

test("Pampanga estuary study evidence remains bounded to its 2010 stations and gear", () => {
  assert.equal(review.waterbody.name, "Pampanga estuary");
  assert.equal(review.waterbody.geometryValidated, false);
  assert.deepEqual(review.studyDesign.zoneStationGroups, {
    lower: [1, 2, 3],
    middle: [4, 5, 6],
    upper: [7, 8, 9],
  });
  assert.equal(review.studyDesign.expectedTrawlSamples, 36);
  assert.equal(review.studyDesign.completedTrawlSamples, 32);
  assert.equal(review.sourceReportedResults.fishCaptured, 330);
  assert.equal(review.sourceReportedResults.families, 20);
  assert.equal(review.table1AuthorReportedTaxonLabels.length, 27);
  assert.equal(review.taxonomyAndLocalityReview.unidentifiedFamilyLevelRows, 1);
  assert.equal(review.taxonomyAndLocalityReview.genusOnlyRows, 2);
  assert.equal(review.taxonomyAndLocalityReview.stationCoordinatesVerified, false);
});

test("Pampanga estuary names are not assigned to Sasmuan or projected publicly", () => {
  assert.equal(review.taxonomyAndLocalityReview.stationToSasmuanRamsarOverlapVerified, false);
  assert.match(review.waterbody.administrativeCrosswalk, /does not provide station coordinates/);
  assert.equal(review.coverageAndAdmission.currentPresenceClaims, 0);
  assert.equal(review.coverageAndAdmission.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.coverageAndAdmission.dietClaims, 0);
  assert.equal(review.coverageAndAdmission.foodSafetyClaims, 0);
  assert.equal(review.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(review.coverageAndAdmission.geometryAdded, false);
});

test("Pampanga estuary source reuse remains held while repository and article rights conflict", () => {
  const article = review.sources.find(({ id }) => id === "abroguena-et-al-pampanga-estuary-2020");
  assert.match(article.accessReview.rightsConflict, /conflicts/);
  assert.match(article.accessReview.reuseDisposition, /unresolved/);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.pampangaEstuaryFishStudyReviewFile, "central-luzon-pampanga-estuary-fish-study-review-20261024.json");
  assert.match(checkpoint.nextStep.action, /Central Luzon source discovery/);
});
