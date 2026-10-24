import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [screen, thesis, checkpoint, registry] = await Promise.all(
  [
    "central-luzon-jica-gbif-proximity-screen-20261024.json",
    "central-luzon-pampanga-apalit-2005-ibi-thesis-access-review-20261024.json",
    "central-luzon-discovery-checkpoint-20261024.json",
    "sources.json",
  ].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)),
);

test("GBIF station proximity zeroes and broad rectangle remain research-only", () => {
  assert.equal(screen.status, "bounded-coordinate-screen-reviewed;research-only;all-candidates-held");
  assert.equal(screen.queryDefinition.stationWindows.length, 5);
  assert.ok(screen.queryDefinition.stationWindows.every((window) => window.resultCount === 0));
  assert.equal(screen.queryDefinition.widerDiscoveryRectangle.resultCount, 9);
  assert.equal(screen.candidateDispositions.length, 9);
  assert.equal(screen.disposition.candidateRowsAdmitted, 0);
  assert.equal(screen.disposition.currentPresenceAssertionsAdded, 0);
  assert.equal(screen.disposition.appProjectionRowsAdded, 0);
  assert.equal(screen.disposition.captureCoordinatesAdded, 0);
  assert.equal(screen.disposition.waterbodyGeometryAdded, false);
  assert.equal(screen.disposition.regionalCompletionApproved, false);
  assert.match(screen.interpretation[0], /not evidence that fish are absent/i);
  assert.doesNotMatch(JSON.stringify(screen.candidateDispositions), /decimalLatitude|decimalLongitude/);

  const mcz = screen.candidateDispositions.find((row) => row.gbifKey === 863131305);
  assert.equal(mcz.reportedCatalogNumber, "MCZ:Ich:26349");
  assert.equal(mcz.reportedWaterBody, "Pacific, Western Central");
  assert.equal(mcz.uncertaintyMeters, 12326);
  assert.match(mcz.museumCatalogFollowup.recordAccess, /HTTP 403/);
  assert.match(mcz.museumCatalogFollowup.decision, /Do not normalize Colompit to Calumpit/);
  assert.equal(mcz.license, "CC-BY-NC-4.0");

  const gbifSource = registry.sources.find((source) => source.id === screen.sourceIds[0]);
  assert.ok(gbifSource);
  assert.equal(gbifSource.publicationApproval, false);
  assert.equal(gbifSource.access.rawSha256Recorded, true);
  assert.equal(checkpoint.centralLuzonJicaGbifProximityScreenReviewFile,
    "central-luzon-jica-gbif-proximity-screen-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
});

test("the Apalit thesis is retained as inaccessible aggregate historical context", () => {
  assert.equal(thesis.primarySource.nationalLibraryControlNumber, "nlp00316842");
  assert.match(thesis.primarySource.nationalLibraryAccessStatement, /Digital Copy: Not Available/);
  assert.match(thesis.primarySource.attemptedFullTextAccess, /HTTP 404/);
  assert.equal(thesis.primarySource.institutionalSecondarySummary.sourceReportedDetails.siteCount, 4);
  assert.equal(thesis.primarySource.institutionalSecondarySummary.sourceReportedDetails.taxa, 25);
  assert.equal(thesis.waterbodyAssociation.speciesAssignedToApalitSite, false);
  assert.equal(thesis.disposition.primaryThesisTablesReviewed, false);
  assert.equal(thesis.disposition.siteAssignedTaxa, 0);
  assert.equal(thesis.disposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(thesis.disposition.appProjectionRowsAdded, 0);
  assert.equal(thesis.reuse.publicationApproval, false);
  assert.equal(registry.sources.some((source) => source.id === thesis.sourceId), true);

  const apalit = checkpoint.waterbodyLeads.inlandAndBrackish.find((row) => row.name === "Pampanga River, Apalit study reach");
  assert.ok(apalit.sourceIds.includes(thesis.sourceId));
  assert.ok(apalit.reviewFiles.includes("central-luzon-pampanga-apalit-2005-ibi-thesis-access-review-20261024.json"));
  assert.equal(checkpoint.centralLuzonPampangaApalit2005IbiThesisAccessReviewFile,
    "central-luzon-pampanga-apalit-2005-ibi-thesis-access-review-20261024.json");
});
