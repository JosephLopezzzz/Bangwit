import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-balayan-gbif-fish-locality-review-20261024.json", import.meta.url);
const sourceRegistryUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const scopeUrl = new URL("../data/research/philippines/calabarzon-scope.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);
const auditUrl = new URL("../data/research/philippines/gbif-actinopterygii-retired-key-correction-20261024.json", import.meta.url);

const [review, sourceRegistry, scope, sweep, audit] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(sourceRegistryUrl, "utf8").then(JSON.parse),
  readFile(scopeUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
  readFile(auditUrl, "utf8").then(JSON.parse),
]);

test("Balayan GBIF zeroes are retained as invalid historical queries and superseded by corrected searches", () => {
  assert.equal(review.waterbodyId, "ph-wb-balayan-bay");
  assert.equal(review.source.taxonClass.key, 204);
  assert.equal(review.source.taxonClass.scientificName, "Actinopterygii");
  assert.deepEqual(review.counts, {
    exactLocalityQueries: 4,
    returnedActinopterygiiRecords: 0,
    fishAssertionsAdmitted: 0,
    publicProjection: false,
  });
  assert.deepEqual(review.source.querySnapshots.map((query) => query.locality), [
    "Balayan Bay",
    "Calatagan Bay",
    "Balayan",
    "Calatagan",
  ]);
  assert.ok(review.source.querySnapshots.every((query) => query.count === 0 && query.resultsReturned === 0));
  assert.ok(review.source.querySnapshots.every((query) => /^[a-f0-9]{64}$/.test(query.rawSha256)));
  assert.ok(review.nonClaims.some((claim) => claim.includes("do not establish species absence") || claim.includes("do not infer fish absence")));
  assert.equal(audit.taxonomy.invalidLegacyQuery.deletedOn, "2022-11-23T06:43:29.920+00:00");
  assert.ok(audit.invalidatedReviews.includes("calabarzon-balayan-gbif-fish-locality-review-20261024.json"));
  assert.equal(audit.correctedCalabarzonSearch.queryCounts["Balayan Bay"], 14);
  assert.equal(audit.correctedCalabarzonSearch.queryCounts.Calatagan, 2);
  assert.equal(audit.correctedCalabarzonSearch.uniqueOccurrenceRecords, 21);
  assert.equal(audit.correctedCalabarzonSearch.distinctAcceptedScientificNames, 16);

  const registeredSource = sourceRegistry.sources.find((source) => source.id === review.source.id);
  assert.ok(registeredSource);
  assert.equal(registeredSource.publicationApproval, false);
  assert.match(registeredSource.researchStatus, /historical-zero-invalidated-retired-taxon-key/);
  assert.equal(registeredSource.access.filterCorrectionFile, "gbif-actinopterygii-retired-key-correction-20261024.json");

  const waterbody = scope.waterbodies.find((item) => item.id === review.waterbodyId);
  assert.ok(waterbody);
  assert.ok(waterbody.sourceRefs.includes(review.source.id));
  const followUp = sweep.additionalPrimarySourceFollowUps.find((item) => item.sourceId === review.source.id);
  assert.ok(followUp);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 61);
});
