import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-agno-paniqui-station-fish-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("Agno review is limited to the Paniqui ARB7 station and its source coordinate", () => {
  assert.equal(review.site.station, "ARB7");
  assert.equal(review.site.localityAsPrinted, "Paniqui, Tarlac");
  assert.deepEqual([review.site.latitude, review.site.longitude], [15.6974, 120.4977]);
  assert.match(review.site.coordinateMeaning, /not individual capture coordinates/);
  assert.match(review.site.siteScopeLimit, /Other Agno stations belong to Benguet or Pangasinan/);
  assert.equal(review.disposition.geometryAdded, false);
});

test("Article richness and abundance reconcile with the CC BY dataset without assigning dates to seasons", () => {
  const { siteEvidence, methods } = review;
  assert.equal(siteEvidence.table4ReportedRichness, 10);
  assert.equal(siteEvidence.datasetPositiveTaxonRows, 10);
  assert.equal(siteEvidence.table5ReportedAbundance, 137);
  assert.equal(siteEvidence.datasetCountTotal, 137);
  assert.deepEqual(siteEvidence.totals, { wetLabel: 51, dryLabel: 86, all: 137, positiveTaxonRows: 10 });
  assert.equal(siteEvidence.datasetRows.length, 10);
  assert.match(methods.temporalResolution, /without mapping either label to a date/);
  assert.equal(siteEvidence.datasetRows.filter(({ taxonomicRank }) => taxonomicRank === "genus-level").length, 1);
  assert.ok(siteEvidence.datasetRows.some(({ sourceName }) => sourceName === "Barbodes sp."));
});

test("Name crosswalk keeps publication spellings and prevents false specimen-level certainty", () => {
  assert.equal(review.taxonomyReview.records.length, 9);
  assert.ok(review.taxonomyReview.records.every(({ gbif, catalogOfFishes }) => gbif.matchType === "EXACT" && gbif.status === "ACCEPTED" && catalogOfFishes.recordPageRetrieved));
  const tilapia = review.siteEvidence.datasetRows.find(({ datasetSpelling }) => datasetSpelling);
  assert.equal(tilapia.datasetSpelling, "Oreochromis mozambicus");
  assert.equal(tilapia.articleTableSpelling, "Oreochromis mossambicus");
  assert.match(tilapia.spellingNote, /not as independently verified specimen identity/);
  assert.equal(review.disposition.speciesLevelNameCandidates, 9);
  assert.equal(review.disposition.genusLevelRowsHeld, 1);
  assert.match(review.taxonomyReview.identityDecision, /No source specimen identity is independently certified/);
});

test("Research-only disposition and source registry preserve rights and regional incompleteness", () => {
  assert.equal(review.disposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(review.disposition.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
  assert.equal(review.disposition.regionalCompletionApproved, false);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.agnoPaniquiStationReviewFile, "central-luzon-agno-paniqui-station-fish-review-20261024.json");
  const lead = checkpoint.waterbodyLeads.inlandAndBrackish.find(({ name }) => name === "Agno River, ARB7 Paniqui study station");
  assert.ok(lead);
  assert.deepEqual(lead.administrativeUnits, ["Tarlac"]);
  for (const sourceId of ["agno-river-basin-fish-assemblage-2026", "agno-river-basin-fish-dataset-2026"]) {
    const source = registry.sources.find(({ id }) => id === sourceId);
    assert.ok(source);
    assert.equal(source.license, "CC-BY-4.0");
    assert.equal(source.publicationApproval, false);
    assert.ok(source.access.reviewFiles.includes("central-luzon-agno-paniqui-station-fish-review-20261024.json"));
  }
  assert.equal(registry.sourceCount, registry.sources.length);
});
