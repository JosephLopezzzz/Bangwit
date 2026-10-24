import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-gbif-pterygoplichthys-locality-screen-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("GBIF genus-level Bulacan candidate stays excluded when source locality and administrative lookup conflict", () => {
  const candidate = review.screenedRecord;
  assert.equal(candidate.taxonRank, "GENUS");
  assert.match(candidate.verbatimLocality, /Valenzuela, Metro Manila/);
  assert.equal(candidate.gbifAdministrativeAssignment.stateProvince, "Bulacan");
  assert.equal(candidate.geographicCrossCheck.psgcCity, "City of Valenzuela");
  assert.equal(candidate.geographicCrossCheck.psgcDirectoryAsOf, "2025-07-31");
  assert.equal(candidate.disposition, "exclude-from-bulacan-species-evidence;genus-only;administrative-locality-conflict;noncommercial-media-license");
});

test("Zero-result GBIF text filters remain bounded and never become absence or current-presence claims", () => {
  assert.equal(review.queries.find((query) => query.label.includes("locality text Angat")).resultCount, 0);
  assert.equal(review.queries.find((query) => query.label.includes("stateProvince Bulacan")).resultCount, 0);
  assert.equal(review.disposition.absenceClaimsAdded, 0);
  assert.equal(review.disposition.speciesLevelBulacanRecordsAccepted, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
  assert.equal(review.disposition.regionalCompletionApproved, false);
});

test("PSGC cross-check and linked record licenses remain explicit, with no image reuse approval", () => {
  assert.equal(candidatePsgcSource().license, "CC-BY-4.0");
  assert.equal(review.screenedRecord.sourcePlatform.recordLicense, "CC-BY-NC-4.0");
  assert.equal(review.screenedRecord.sourcePlatform.photoLicense, "CC-BY-NC-4.0");
  assert.equal(review.screenedRecord.sourcePlatform.qualityGrade, "research");
  assert.ok(registry.sourceCount === registry.sources.length);
  assert.equal(checkpoint.bulacanPterygoplichthysGbifLocalityScreenReviewFile, "central-luzon-bulacan-gbif-pterygoplichthys-locality-screen-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
});

function candidatePsgcSource() {
  const source = registry.sources.find((row) => row.id === "psa-psgc-valenzuela-coloong-2026");
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  return source;
}
