import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [audit, ncr, admin, sources] = await Promise.all([
  readFile(new URL("gbif-actinopterygii-retired-key-correction-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("ncr-species-coverage-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("administrative-registry.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("retired GBIF taxon key zeroes are invalidated and replaced with CoL XR searches", () => {
  assert.equal(audit.taxonomy.invalidLegacyQuery.taxonKey, 204);
  assert.equal(audit.taxonomy.invalidLegacyQuery.deletedOn, "2022-11-23T06:43:29.920+00:00");
  assert.equal(audit.taxonomy.currentSelection.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(audit.taxonomy.currentSelection.taxonKey, "8VR36");
  assert.equal(audit.taxonomy.currentSelection.rank, "GIGACLASS");
  assert.match(audit.taxonomy.currentSelection.scope, /does not cover sharks and rays/);
  assert.equal(audit.taxonomy.currentValidation.count, 204252);
  assert.equal(audit.taxonomy.deletedKeyControl.count, 0);
  assert.equal(audit.invalidatedReviews.length, 4);
  assert.equal(audit.correctedCalabarzonSearch.queryCount, 12);
  assert.equal(audit.correctedCalabarzonSearch.uniqueOccurrenceRecords, 21);
  assert.equal(audit.correctedCalabarzonSearch.distinctAcceptedScientificNames, 16);
  assert.equal(audit.correctedCalabarzonSearch.queryEvidence.length, 12);
  assert.ok(audit.correctedCalabarzonSearch.queryEvidence.every((query) => /^[a-f0-9]{64}$/.test(query.rawSha256)));
});

test("NCR checkpoint covers its administrative units and records a bounded, incomplete fish review", () => {
  const currentNcrUnits = admin.administrativeUnits.filter((unit) => unit.regionId === "1300000000");
  assert.equal(ncr.regionId, "1300000000");
  assert.equal(ncr.status, "discovery-checkpoint-incomplete");
  assert.deepEqual(ncr.administrativeCoverage.coverageUnits.map((unit) => unit.psgcCode).sort(), currentNcrUnits.map((unit) => unit.code).sort());
  assert.equal(ncr.administrativeCoverage.unitCount, 17);
  assert.equal(ncr.administrativeCoverage.cityCount, 16);
  assert.equal(ncr.administrativeCoverage.municipalityCount, 1);
  assert.equal(ncr.coverage.completeWaterbodyDenominator, false);
  assert.equal(ncr.coverage.baselineReviewed, false);
  assert.equal(ncr.coverage.fishRecordsPubliclyAdmitted, 0);

  assert.equal(ncr.gbif.taxonomy.taxonKey, "8VR36");
  assert.equal(ncr.gbif.localitySweep.exactTextQueries, 30);
  assert.equal(ncr.gbif.localitySweep.zeroCountQueries, 28);
  assert.deepEqual(ncr.gbif.localitySweep.nonzeroQueries.map((query) => [query.locality, query.count]), [
    ["Manila Bay", 282],
    ["Laguna de Bay", 42],
  ]);
  assert.equal(ncr.gbif.administrativeSearch.totalCount, 569);
  assert.equal(ncr.gbif.administrativeSearch.returnedRecords, 569);
  assert.equal(ncr.gbif.administrativeSearch.distinctAcceptedTaxonKeys, 226);
  assert.equal(ncr.gbif.administrativeSearch.distinctSpeciesRankAcceptedNames, 210);
  assert.equal(ncr.gbif.administrativeSearch.heuristicMarketContextRows, 456);
  assert.equal(ncr.gbif.administrativeSearch.heuristicWaterbodyTextRows, 7);
  assert.equal(ncr.gbif.administrativeSearch.pageResponses.length, 2);
  assert.ok(ncr.gbif.administrativeSearch.pageResponses.every((page) => /^[a-f0-9]{64}$/.test(page.sha256)));

  assert.equal(ncr.speciesEvidenceCandidate.sourceFacts.reportedCollectionDate, "2025-10-29");
  assert.equal(ncr.speciesEvidenceCandidate.taxonomyMatch.taxonKey, "GQWT");
  assert.match(ncr.speciesEvidenceCandidate.disposition, /prepared as a deterministic evidence projection/i);
  assert.match(ncr.speciesEvidenceCandidate.disposition, /not imply current population/);
  for (const id of [
    "denr-ncr-pasig-river-biodiversity-2024",
    "denr-ncr-manila-bay-regional-scope",
    "denr-ncr-soe-2025",
    "lirio-2026-arius-manillensis-pasig-river",
  ]) assert.ok(sources.sources.some((source) => source.id === id));
  assert.equal(sources.sourceCount, sources.sources.length);
  assert.equal(ncr.nextStep.phaseId, "L2");
});
