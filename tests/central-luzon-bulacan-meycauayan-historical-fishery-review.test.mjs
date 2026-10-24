import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-meycauayan-historical-fishery-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json", "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));
test("Meycauayan fish names stay historical reports rather than current survey observations", () => {
  assert.equal(review.source.methodsAndReuse.waterQualityMonitoringPeriod, "1983-1988");
  assert.match(review.source.methodsAndReuse.fishEvidenceMethod, /not supplied/);
  assert.deepEqual(review.waterbodyScope.tributariesNamedBySource, ["Balagtas River", "Bocaue River", "Bulacan River", "Guiguinto River", "Marilao River", "Polo River", "Obando River"]);
  assert.equal(review.fisheryHistory.speciesObservationPeriod, null);
  assert.equal(review.waterbodyScope.exactSpeciesLocalityCrosswalk, null);
  assert.deepEqual(review.fisheryHistory.reportedFishEntries.map(({ sourceOrdinal }) => sourceOrdinal), [1, 2, 3, 4]);
  assert.equal(review.disposition.independentlyVerifiedTaxa, 0);
  assert.equal(review.disposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(review.disposition.absenceClaimsAdded, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
});
test("Historical spellings, common names, genus-level records, and current-name proposals remain distinct", () => {
  const [kitang, apahap, samaral, talimusak] = review.fisheryHistory.reportedFishEntries;
  assert.equal(kitang.nameAsPrinted, "Scatophacus argus");
  assert.equal(kitang.possibleCurrentNameCrosswalk, "Scatophagus argus (Linnaeus, 1766)");
  assert.match(kitang.decision, /no-voucher/);
  assert.equal(apahap.nameAsPrinted, "Lates calcarifer");
  assert.equal(samaral.reportedRank, "GENUS");
  assert.equal(talimusak.nameAsPrinted, "Glossogobius sp.");
  assert.match(review.limitations.join(" "), /cannot establish present-day absence/);
  assert.equal(review.source.methodsAndReuse.appPublicationApproval, false);
});
test("Meycauayan source and review remain linked without changing public species data", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  for (const id of [review.sourceId, "calacademy-catalog-meycauayan-name-crosscheck"]) {
    const source = registry.sources.find((row) => row.id === id);
    assert.ok(source, `missing registry source ${id}`);
    assert.equal(source.publicationApproval, false);
  }
  const lead = checkpoint.waterbodyLeads.inlandAndBrackish.find(({ name }) => name === "Meycauayan River System, historical fisheries report");
  assert.ok(lead);
  assert.deepEqual(lead.administrativeUnits, ["Bulacan"]);
  assert.equal(lead.geometryAdded, false);
  assert.equal(checkpoint.bulacanMeycauayanHistoricalFisheryReviewFile, "central-luzon-bulacan-meycauayan-historical-fishery-review-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
});
