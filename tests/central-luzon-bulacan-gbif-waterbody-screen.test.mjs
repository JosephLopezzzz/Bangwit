import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry, waterbodySource] = await Promise.all([
  "central-luzon-bulacan-gbif-waterbody-screen-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
  "central-luzon-bulacan-waterbody-source-review-20261024.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("22 exact GBIF waterBody searches remain bounded zero-result screens", () => {
  const screen = review.queries.bfarWaterbodyNameScreen;
  assert.equal(screen.searchedNameCount, 22);
  assert.equal(screen.names.length, 22);
  assert.deepEqual(screen.names, waterbodySource.bfarProfile.namedCommunalInlandFeatures);
  assert.equal(screen.eachQueryResultCount, 0);
  assert.equal(screen.nonzeroQueryCount, 0);
  assert.match(screen.interpretation, /do not establish absence/);
  assert.equal(review.decision.exactNameZeroesUsedAsAbsence, false);
});

test("one Quingoa River row is held as a historical candidate, never current or public presence", () => {
  const candidate = review.historicalCandidate;
  assert.equal(candidate.gbifOccurrenceKey, 3426466781);
  assert.equal(candidate.catalogNumber, "CAS:SU(ICH):29647");
  assert.equal(candidate.basisOfRecord, "PRESERVED_SPECIMEN");
  assert.equal(candidate.individualCount, 3);
  assert.equal(candidate.eventDate, "1925-09-19");
  assert.equal(candidate.waterBody, "Quingoa River");
  assert.equal(candidate.license, "CC0-1.0");
  assert.equal(candidate.coordinate.uncertaintyMeters, 9235);
  assert.match(candidate.coordinate.decision, /Do not project or map/);
  assert.ok(candidate.gbifIssues.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"));
  assert.equal(candidate.independentTaxonomyCrosscheck.sourceId, "calacademy-catalog-stenogobius-ophthalmoporus-20261024");
  assert.match(candidate.independentTaxonomyCrosscheck.limits, /does not independently verify/);
  assert.equal(review.decision.currentPresenceAssertions, 0);
  assert.equal(candidate.disposition.includes("not-public-app-assertion"), true);
  assert.equal(review.screenDisposition.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.screenDisposition.appProjectionRowsAdded, 0);
});

test("corrected COL XR fish-class screen and observation metadata retain locality and privacy limits", () => {
  const legacy = review.queries.bulacanPerciformesAdministrativeScreen;
  assert.equal(legacy.resultCount, 19);
  assert.equal(legacy.parameters.orderKey, 587);
  assert.match(legacy.interpretation, /superseded/);

  const classScreen = review.queries.bulacanActinopterygiiAdministrativeScreen;
  assert.equal(classScreen.parameters.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(classScreen.parameters.taxonKey, "8VR36");
  assert.equal(classScreen.resultCount, 31);
  assert.equal(classScreen.returnedRows, 31);
  assert.equal(classScreen.endOfRecords, true);
  assert.deepEqual(classScreen.basisOfRecordCounts, [
    { basisOfRecord: "HUMAN_OBSERVATION", count: 14 },
    { basisOfRecord: "PRESERVED_SPECIMEN", count: 17 },
  ]);
  assert.match(classScreen.interpretation, /not.*complete/i);
  assert.match(classScreen.privacyNote, /No row-level observation IDs or coordinates/);

  const observationFollowup = review.queries.iNaturalistDirectMetadataFollowup;
  assert.equal(observationFollowup.resultCount, 14);
  assert.equal(observationFollowup.waterBodyFieldCount, 0);
  assert.equal(observationFollowup.qualityGradeCounts[0].count, 14);
  assert.match(observationFollowup.limits, /proof of wild capture/);
  assert.doesNotMatch(JSON.stringify(observationFollowup), /decimalLatitude|decimalLongitude|inaturalist\.org\/observations\//);
  assert.match(review.otherAdministrativeQueryRows.disposition, /Namibia coordinate mismatch/);
  assert.match(review.otherAdministrativeQueryRows.disposition, /bought at Manila Market/);

  const angat = review.angatHistoricalCandidate;
  assert.equal(angat.recordedName, "Arius dispar Herre, 1926");
  assert.equal(angat.locality, "Angat Dam, Angat River, Luzon");
  assert.equal(angat.eventDate, "1929-05-18");
  assert.equal(angat.individualCount, 2);
  assert.equal(angat.independentTaxonomyCrosscheck.result.includes("valid species"), true);
  assert.match(angat.coordinate.decision, /excluded from the app projection and map/);
  assert.equal(review.decision.historicalWaterbodyCandidates, 1);
  assert.equal(review.decision.historicalNamedAquaticLocalityCandidates, 2);
  assert.equal(review.decision.publicSpeciesAssertionsAdded, 1);
  assert.equal(review.decision.appProjectionRowsAdded, 1);
  assert.ok(review.rawSnapshots.every((snapshot) => /^[a-f0-9]{64}$/.test(snapshot.sha256)));
  assert.ok(review.rawSnapshots.every((snapshot) => snapshot.gitIgnored === true));
  assert.equal(checkpoint.bulacanGbifWaterbodyScreenReviewFile, "central-luzon-bulacan-gbif-waterbody-screen-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.ok(registry.sources.some((source) => source.id === "gbif-bulacan-perciformes-screen-20261024"));
  assert.ok(registry.sources.some((source) => source.id === classScreen.sourceId));
  assert.ok(registry.sources.some((source) => source.id === observationFollowup.sourceId));
  assert.ok(registry.sources.some((source) => source.id === angat.independentTaxonomyCrosscheck.sourceId));
  assert.ok(registry.sources.some((source) => source.id === "calacademy-catalog-stenogobius-ophthalmoporus-20261024"));
});
