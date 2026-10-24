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
  assert.equal(review.decision.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.decision.appProjectionRowsAdded, 0);
});

test("administrative Perciformes results and raw hashes retain their quality limitations", () => {
  const screen = review.queries.bulacanPerciformesAdministrativeScreen;
  assert.equal(screen.resultCount, 19);
  assert.equal(screen.parameters.orderKey, 587);
  assert.match(screen.interpretation, /not a complete fish-class query/);
  assert.match(review.otherAdministrativeQueryRows.disposition, /Namibia/);
  assert.match(review.otherAdministrativeQueryRows.disposition, /Metro Manila/);
  assert.ok(review.rawSnapshots.every((snapshot) => /^[a-f0-9]{64}$/.test(snapshot.sha256)));
  assert.ok(review.rawSnapshots.every((snapshot) => snapshot.gitIgnored === true));
  assert.equal(checkpoint.bulacanGbifWaterbodyScreenReviewFile, "central-luzon-bulacan-gbif-waterbody-screen-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.ok(registry.sources.some((source) => source.id === "gbif-bulacan-perciformes-screen-20261024"));
  assert.ok(registry.sources.some((source) => source.id === "calacademy-catalog-stenogobius-ophthalmoporus-20261024"));
});
