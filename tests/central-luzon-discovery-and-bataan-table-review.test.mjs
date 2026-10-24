import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const dataDir = new URL("../data/research/philippines/", import.meta.url);
const [scope, tableReview, taxonomyProposals, independentCatalogReview, administrative, sourceRegistry] = await Promise.all([
  "central-luzon-discovery-checkpoint-20261024.json",
  "central-luzon-bataan-river-table-review-20261024.json",
  "central-luzon-bataan-taxonomy-proposals-20261024.json",
  "central-luzon-bataan-cof-name-review-20261024.json",
  "administrative-registry.json",
  "sources.json",
].map((name) => readFile(new URL(name, dataDir), "utf8").then(JSON.parse)));

test("Central Luzon discovery covers all seven registry provinces and remains incomplete", () => {
  const registryProvinces = administrative.administrativeUnits
    .filter((unit) => unit.regionId === "0300000000" && unit.level === "province")
    .map((unit) => ({ name: unit.name, psgcCode: unit.code }))
    .sort((a, b) => a.psgcCode.localeCompare(b.psgcCode));
  const scopedProvinces = scope.administrativeCoverage.provinces
    .map(({ name, psgcCode }) => ({ name, psgcCode }))
    .sort((a, b) => a.psgcCode.localeCompare(b.psgcCode));

  assert.equal(scope.status, "discovery-checkpoint-incomplete");
  assert.equal(scope.regionId, "0300000000");
  assert.equal(scope.administrativeCoverage.expectedProvinceCount, 7);
  assert.deepEqual(scopedProvinces, registryProvinces);
  assert.equal(scope.administrativeCoverage.geometryVerified, false);
  assert.equal(scope.reportedWaterbodyScope.sourceReportedTotal, 168);
  assert.equal(Object.values(scope.reportedWaterbodyScope.sourceReportedBreakdown).reduce((sum, count) => sum + count, 0), 168);
  assert.match(scope.reportedWaterbodyScope.decision, /not a verified denominator/i);
  assert.equal(scope.monitoringLead.sourceReportedMonitoredWaterbodies, 27);
  assert.match(scope.monitoringLead.decision, /not a fish inventory/i);
  assert.equal(scope.candidateFishEvidence.publicAssertionsPrepared, 0);
  assert.equal(scope.candidateFishEvidence.regionalReleaseApproved, false);

  const sourceIds = new Set(sourceRegistry.sources.map((source) => source.id));
  const leadIds = [
    ...scope.waterbodyLeads.inlandAndBrackish,
    ...scope.waterbodyLeads.coastalAndMarine,
  ].flatMap((lead) => lead.sourceIds);
  assert.ok(leadIds.every((sourceId) => sourceIds.has(sourceId)));
  assert.deepEqual(
    scope.waterbodyLeads.coastalAndMarine.find((lead) => lead.name === "Manila Bay").sharedPhaseIds,
    ["L2", "L3", "L1"],
  );
  for (const habitat of ["river-basin", "reservoir", "wetland", "shared-bay", "bay", "coastal-marine-area"]) {
    assert.ok(leadIds.length > 0);
    const leads = [...scope.waterbodyLeads.inlandAndBrackish, ...scope.waterbodyLeads.coastalAndMarine];
    assert.ok(leads.some((lead) => lead.kind.includes(habitat) || habitat.includes(lead.kind)), `missing ${habitat} lead`);
  }
});

test("Bataan source-table transcription reconciles the article's three river richness counts but admits no species", () => {
  const review = tableReview.sourceTableReview;
  assert.equal(tableReview.status, "research-only-source-table-transcribed-taxonomy-pending");
  assert.equal(tableReview.source.license, "CC-BY-4.0");
  assert.match(tableReview.source.acquisition.sha256, /^[0-9a-f]{64}$/);
  assert.equal(review.rowCount, 52);
  assert.equal(review.records.length, 52);
  assert.deepEqual(review.perRiverRows, { Almacen: 42, Bagac: 29, Talisay: 28 });
  for (const river of Object.keys(review.perRiverRows)) {
    assert.equal(review.records.filter((record) => record.presence[river]).length, review.perRiverRows[river]);
  }
  assert.equal(review.records.filter((record) => /\bsp\./i.test(record.sourceName)).length, 9);
  assert.ok(review.records.some((record) => /\bx\b/.test(record.sourceName)));
  assert.ok(review.records.some((record) => record.familyAsPrinted === "Anguilidae"));
  assert.ok(review.records.every((record) => !record.acceptedTaxonId && !record.decimalLatitude && !record.decimalLongitude));
  assert.equal(tableReview.fieldDisposition.publicAdmission, false);
  assert.equal(tableReview.fieldDisposition.appProjection, false);
  assert.equal(tableReview.fieldDisposition.regionalReleaseApproved, false);
  assert.equal(tableReview.taxonomyReview.status, "pending-current-authoritative-review");
  assert.equal(tableReview.taxonomyProposalLedger.path, "central-luzon-bataan-taxonomy-proposals-20261024.json");
  assert.equal(taxonomyProposals.status, "proposal-batch-complete-review-pending");
  assert.equal(taxonomyProposals.counts.totalSourceRows, 52);
  assert.equal(taxonomyProposals.counts.speciesBinomialQueries, 42);
  assert.equal(taxonomyProposals.counts.successfulResponses, 42);
  assert.equal(taxonomyProposals.counts.heldNonBinomialRows, 10);
  assert.equal(taxonomyProposals.counts.acceptedTaxa, 0);
  assert.equal(taxonomyProposals.counts.publicationEligible, 0);
  assert.equal(tableReview.independentCatalogReview.path, "central-luzon-bataan-cof-name-review-20261024.json");
  assert.equal(independentCatalogReview.coverage.selectedRowsReviewed, 12);
  assert.equal(independentCatalogReview.coverage.sourceBinomialsRemainingForCatalogReview, 30);
  assert.equal(independentCatalogReview.coverage.acceptedTaxa, 0);
  assert.equal(independentCatalogReview.coverage.publicationEligible, 0);
  assert.ok(independentCatalogReview.records.some((record) => record.sourceNameVerbatim === "Cynoglossus bilineatus" && record.catalogStatus === "ambiguous-homonym-and-combination-review"));
  assert.ok(independentCatalogReview.records.some((record) => record.sourceNameVerbatim === "Clarias batrachus" && /identity review/.test(record.disposition)));
  assert.equal(scope.candidateFishEvidence.bataanStudyTaxonRows, review.rowCount);
});
