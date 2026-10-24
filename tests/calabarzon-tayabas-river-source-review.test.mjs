import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, sweep, scope] = await Promise.all([
  readFile(new URL("calabarzon-tayabas-river-source-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
]);
const audit = JSON.parse(await readFile(new URL("gbif-actinopterygii-retired-key-correction-20261024.json", base), "utf8"));

test("Tayabas River remains an aggregate lead and its invalid GBIF zeroes are superseded", () => {
  assert.equal(review.waterbodyId, "ph-wb-tayabas-river");
  assert.deepEqual(review.primarySource.metadataFacts, {
    fieldPeriod: "wet and dry seasons of 2010",
    streamSections: ["upstream", "midstream", "downstream"],
    individuals: 1070,
    reportedSpecies: 15,
    reportedFamilies: 8,
  });
  assert.equal(review.primarySource.accessReview.tableAcquired, false);
  assert.equal(review.rightsReview.itemSpecificLicenseFound, false);
  assert.equal(review.rightsReview.itemSpecificAgreementReviewed, false);
  assert.equal(review.openDataAlternative.queries.length, 3);
  assert.ok(review.openDataAlternative.queries.every((query) => query.returnedRecords === 0 && /^[a-f0-9]{64}$/.test(query.responseSha256)));
  assert.equal(review.openDataAlternative.totalReturnedRecords, 0);
  assert.equal(audit.correctedCalabarzonSearch.queryCounts["Tayabas"], 1);
  assert.ok(audit.invalidatedReviews.includes("calabarzon-tayabas-river-source-review-20261024.json"));
  assert.equal(review.counts.speciesAssertionsAdmitted, 0);
  assert.equal(review.counts.publicProjection, false);
  assert.ok(review.limits.some((limit) => /do not establish fish absence/i.test(limit)));

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.match(source.researchStatus, /legacy-gbif-query-invalidated-retired-taxon-key/);
  assert.ok(source.access.reviewFiles.includes("calabarzon-tayabas-river-source-review-20261024.json"));

  const sourceFollowup = sweep.sources.find((row) => row.sourceId === review.sourceId);
  assert.ok(sourceFollowup);
  assert.equal(sourceFollowup.reviewFile, "calabarzon-tayabas-river-source-review-20261024.json");
  assert.equal(sourceFollowup.admittedAssertions, 0);
  assert.equal(sourceFollowup.openDataAlternative.returnedFishRecords, 0);

  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(waterbody);
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "unknown");
});
