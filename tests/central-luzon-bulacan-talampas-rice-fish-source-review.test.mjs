import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-talampas-rice-fish-source-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("Talampas rice-field fish observations remain historical, site-scoped evidence", () => {
  assert.equal(review.site.name, "Talampas village, Bustos, Bulacan");
  assert.deepEqual(review.fishEntries.map(({ sourceOrdinal }) => sourceOrdinal), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(review.disposition.speciesLevelHistoricalCandidates, 2);
  assert.equal(review.disposition.genusOrUnresolvedEntriesHeld, 6);
  assert.match(review.methods.selectionRule, /intentional sampling was avoided/);
  assert.match(review.methods.limitations.join(" "), /present-day occurrence/);
  assert.equal(review.site.geometryAdded, false);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
});

test("Current-name crosswalk preserves source names and does not treat the count as eight resolved species", () => {
  const tilapia = review.fishEntries.find(({ sourceOrdinal }) => sourceOrdinal === 2);
  const goby = review.fishEntries.find(({ sourceOrdinal }) => sourceOrdinal === 7);
  assert.equal(tilapia.nameAsPublished, "Tilapia nilotica");
  assert.equal(tilapia.matchedName, "Oreochromis niloticus (Linnaeus, 1758)");
  assert.equal(goby.nameAsPublished, "Glossogobius giuris");
  assert.match(review.sourceConflicts.join(" "), /eight rows as eight resolved species/);
  assert.match(review.sourceConflicts.join(" "), /Bustos Dam.*Angat Dam/);
  assert.equal(review.source.rights.appPublicationApproval, false);
});

test("FAO and taxonomic authority sources stay registered while Central Luzon remains incomplete", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  for (const id of [review.sourceId, "calacademy-catalog-talampas-taxa-crosscheck"]) {
    const source = registry.sources.find((row) => row.id === id);
    assert.ok(source, `missing source registry entry ${id}`);
    assert.equal(source.publicationApproval, false);
  }
  assert.equal(checkpoint.bulacanTalampasRiceFishSourceReviewFile, "central-luzon-bulacan-talampas-rice-fish-source-review-20261024.json");
  const siteLead = checkpoint.waterbodyLeads.inlandAndBrackish.find(({ name }) => name === "Talampas rice fields and irrigation canals");
  assert.ok(siteLead);
  assert.deepEqual(siteLead.administrativeUnits, ["Bulacan"]);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
});
