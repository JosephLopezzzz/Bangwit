import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-pansipit-alternative-source-review-20261024.json", import.meta.url);
const sourceRegistryUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, sourceRegistry, sweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourceRegistryUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("Pansipit source alternatives retain historical scope and rights limits without app admission", () => {
  const primary = review.primaryAlternative;
  assert.equal(review.status, "official-historical-aggregate-reviewed-species-list-held");
  assert.equal(review.waterbodyId, "ph-wb-pansipit-river");
  assert.equal(primary.sourceId, "nfrdi-fy2019-pansipit-stock-assessment");
  assert.equal(primary.sourceLocator.printedPage, 16);
  assert.match(primary.rawPdfSha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(primary.reportedFacts, {
    surveyPeriod: "2019-01/2019-09",
    fisherfolkRespondents: 51,
    fishingGearsAccounted: 140,
    gearTypes: 17,
    totalLandedProductionKg: 6886.98,
    reportedOrganismSpeciesCaught: 42,
    reportedFinfishSpecies: 36,
    reportedMolluscSpecies: 2,
    reportedCrustaceanSpecies: 4,
    sourceNamesDominantCatch: ["Sarotherodon melanotheron"],
  });
  assert.equal(primary.rightsReview.licenseVersionSpecified, false);
  assert.equal(primary.rightsReview.scopeAndTermsResolved, false);
  assert.equal(primary.admittedSpeciesAssertions, 0);
  assert.equal(primary.publicProjection, false);
  assert.deepEqual(review.counts, {
    completeSpeciesListsAcquired: 0,
    sourceReportedSpeciesRowsExtracted: 0,
    speciesAssertionsAdmitted: 0,
    publicProjection: false,
  });

  const [nfrdi2023, corpuz2016] = review.relatedSourceChecks;
  assert.equal(nfrdi2023.observedAccessResult.includes("login page"), true);
  assert.equal(nfrdi2023.reuseTermsVerified, false);
  assert.equal(nfrdi2023.indexedSummaryFacts.reportedFinfishSpecies, 32);
  assert.equal(corpuz2016.reuseTermsVerified, false);
  assert.equal(corpuz2016.repositoryMetadataFacts.pansipitSpeciesRichnessInAbstract, 36);
  assert.match(corpuz2016.observedAccessResult, /HTTP 403/);

  assert.equal(sourceRegistry.sourceCount, 59);
  const source = sourceRegistry.sources.find((row) => row.id === primary.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.access.rawPdfSha256, primary.rawPdfSha256);
  assert.equal(source.researchStatus, "historical-aggregate-only-no-list;rights-scope-unresolved");

  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 59);
  const followUp = sweep.additionalPrimarySourceFollowUps.find((row) => row.sourceId === primary.sourceId);
  assert.ok(followUp);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
  assert.equal(followUp.sourceFactsHeld.reportedOrganismSpeciesCaught, 42);
});
