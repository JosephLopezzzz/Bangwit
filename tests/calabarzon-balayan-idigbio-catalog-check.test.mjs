import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [
  review,
  gbif,
  registry,
  gapReport,
  reviewBytes,
  gbifBytes,
  sourceBytes,
  fieldMuseumReview,
  fieldMuseumBytes,
  nmnhReview,
  nmnhDecision,
  stationCrosswalk,
  nmnhReviewBytes,
  nmnhDecisionBytes,
  stationCrosswalkBytes,
] = await Promise.all([
  readFile(new URL("calabarzon-balayan-idigbio-catalog-check-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-idigbio-catalog-check-20261025.json", base)),
  readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-balayan-fieldmuseum-source-records-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-fieldmuseum-source-records-20261025.json", base)),
  readFile(new URL("calabarzon-balayan-nmnh-source-records-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-nmnh-row-decisions-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-usnm-station-crosswalk-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-nmnh-source-records-20261025.json", base)),
  readFile(new URL("calabarzon-balayan-nmnh-row-decisions-20261025.json", base)),
  readFile(new URL("calabarzon-balayan-usnm-station-crosswalk-20261025.json", base)),
]);

function hasCoordinateKey(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "geopoint", "coordinates", "geometry"].includes(key) ||
      hasCoordinateKey(nested),
  );
}

test("Balayan GBIF direct details stay linked to the corrected search receipt", () => {
  assert.equal(gbif.summary.searchCandidates, 14);
  assert.equal(gbif.summary.directDetailResponses, 14);
  assert.equal(gbif.summary.mismatchedRecords, 0);
  assert.equal(gbif.summary.sourceCatalogIdentityGroups, 10);
  assert.equal(gbif.decision.historicalAssertionsAdmitted, 0);
  assert.equal(gbif.decision.publicAdmission, false);
});

test("iDigBio cross-check resolves catalog identities while retaining source and locality limits", () => {
  assert.equal(review.reviewedOn, "2026-10-25");
  assert.equal(review.input.sha256, createHash("sha256").update(gbifBytes).digest("hex"));
  assert.equal(review.summary.uniqueGbifCatalogIdentities, 10);
  assert.equal(review.summary.iDigBioCatalogRecords, 9);
  assert.equal(review.summary.exactSourceIdentityMatches, 9);
  assert.equal(review.summary.recordsWithBalayanBayLocalityText, 9);
  assert.equal(review.summary.unresolvedGbifCatalogIdentities, 1);
  assert.equal(review.summary.usnmMaterialCitationRows, 5);
  assert.equal(review.summary.usnmCatalogIdentityCount, 1);
  assert.equal(review.summary.usnmLocalityScopeAmbiguous, true);
  assert.deepEqual(review.summary.recordsetRights, ["CC0"]);
  assert.deepEqual(review.summary.recordRights, ["https://creativecommons.org/publicdomain/zero/1.0/"]);
  assert.equal(review.summary.recordsWithYearOnlySourceDate, 2);
  assert.equal(review.summary.recordsWithIndexedDateMorePreciseThanSourceFields, 5);
  assert.equal(review.decision.historicalAssertionsAdmitted, 0);
  assert.equal(review.decision.publicRecordsAdded, 0);
  assert.equal(review.decision.coordinatesIncluded, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.completeSpeciesInventoryClaimed, false);

  const liza = review.records.find((record) => record.institutionCode === "CAS" && record.catalogNumber === "28340");
  assert.equal(liza.scientificName, "Liza troscheli");
  assert.equal(liza.taxonRank.toLowerCase(), "species");
  assert.equal(liza.binomialMatchesGbifName, false);
  assert.equal(liza.eventDate, "1931-04");
  assert.match(liza.indexedDateCollected, /^1931-04-27/);

  const usnm = review.records.find((record) => record.institutionCode === "USNM");
  assert.equal(usnm.matchedGbifCatalogIdentity.gbifIds.length, 5);
  assert.match(usnm.locality, /Sombrero Island.*Verde Island Passage/);
  assert.match(review.decision.interpretation, /do not count them as five independent occurrences/i);
  assert.deepEqual(
    review.unresolvedIdentities.map((record) => record.institutionCode),
    ["UMMZ"],
  );
  assert.ok(review.records.every((record) => record.localityMentionsBalayanBay));
  assert.ok(review.records.every((record) => record.matchedGbifCatalogIdentity));
  assert.ok(review.records.every((record) => record.license || record.recordset));
  assert.equal(hasCoordinateKey(review), false);
});

test("source registry and CALABARZON gap snapshot record the iDigBio follow-up", () => {
  const source = registry.sources.find((entry) => entry.id === "idigbio-balayan-catalog-crosscheck");
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-balayan-idigbio-catalog-check-20261025.json"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(gapReport.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(gapReport.inputHashes.sourcesSha256, createHash("sha256").update(sourceBytes).digest("hex"));
  assert.equal(
    gapReport.inputHashes.balayanIdigbioCrosscheckSha256,
    createHash("sha256").update(reviewBytes).digest("hex"),
  );
  const gap = gapReport.openGaps.find((item) => item.id === "balayan-bay-museum-catalog-review");
  assert.ok(gap);
  assert.equal(gap.count, 14);
  assert.match(gap.nextAction, /rights are no longer the blocker/i);
  assert.equal(
    gapReport.inputHashes.balayanFieldMuseumSourceSha256,
    createHash("sha256").update(fieldMuseumBytes).digest("hex"),
  );
  assert.equal(gapReport.coverageSummary.registeredSources, 151);
  assert.match(gap.reason, /two FMNH and six CAS SU\(ICH\) records.*historical research-ledger evidence/i);
  assert.match(gap.nextAction, /five citations grouped as one item/i);
  assert.match(gap.nextAction, /D 5115 versus D 5116/i);
});

test("NMNH crosswalk verifies reuse but holds the grouped USNM item from a bay-specific claim", () => {
  assert.equal(nmnhReview.record.institutionCode, "USNM");
  assert.equal(nmnhReview.record.catalogNumber, "122919");
  assert.equal(nmnhReview.record.scientificName, "Ventrifossa divergens");
  assert.equal(nmnhReview.record.eventDate, "1908-01-20");
  assert.equal(nmnhReview.record.verbatimEventDate, "20 Jan 1908");
  assert.equal(nmnhReview.record.locality, "Sombrero Island; Balayan Bay and Verde Island Passage");
  assert.equal(nmnhReview.record.itemLevelLicense, null);
  assert.equal(nmnhReview.summary.sourceDatasetLicenseVerified, true);
  assert.equal(nmnhReview.summary.gbifCitationRowsCC0Verified, true);
  assert.equal(nmnhReview.summary.sourceItemLicenseVerified, false);
  assert.equal(nmnhReview.sourceDatasetLicense.license, "CC0 1.0");
  assert.equal(nmnhReview.comparison.stationCrosswalkReview, "calabarzon-balayan-usnm-station-crosswalk-20261025.json");
  assert.equal(nmnhReview.comparison.localityScopeIsSingleSite, false);
  assert.equal(nmnhReview.summary.exactInstitutionCatalogRecordMatched, true);
  assert.equal(nmnhReview.summary.gbifCitationRowsCollapsedToOneCatalogIdentity, true);
  assert.equal(nmnhReview.decision.historicalOccurrenceAdmitted, false);
  assert.equal(nmnhReview.decision.publicAppAdmission, false);
  assert.equal(nmnhReview.decision.mapPointAdmission, false);
  assert.equal(nmnhReview.taxonomyCrosscheck.aphiaId, 217789);
  assert.equal(nmnhReview.taxonomyCrosscheck.status, "accepted");
  assert.equal(nmnhReview.taxonomyCrosscheck.rank, "Species");

  assert.equal(nmnhDecision.inputHashes.institutionReview, createHash("sha256").update(nmnhReviewBytes).digest("hex"));
  assert.equal(nmnhDecision.summary.gbifCitationRows, 5);
  assert.equal(nmnhDecision.summary.uniqueInstitutionCatalogIdentities, 1);
  assert.equal(nmnhDecision.summary.historicalOccurrencesAdmitted, 0);
  assert.equal(nmnhDecision.summary.publicAppRowsAdded, 0);
  assert.equal(nmnhDecision.summary.datasetReuseVerified, true);
  assert.equal(nmnhDecision.decision.researchLedger, "hold-single-catalog-record-exact-waterbody-scope-review");
  assert.deepEqual(
    nmnhDecision.gbifCitationRows.map(({ gbifId }) => gbifId),
    ["4904905416", "4904905469", "4904905541", "4904905801", "4904905907"],
  );
  assert.ok(nmnhDecision.gbifCitationRows.every((row) => row.catalogNumber === "USNM 122919"));
  assert.ok(nmnhDecision.gbifCitationRows.every((row) => row.basisOfRecord === "MATERIAL_CITATION"));
  assert.ok(
    nmnhDecision.gbifCitationRows.every((row) =>
      row.qualityFlags.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"),
    ),
  );
  assert.equal(hasCoordinateKey(nmnhReview), false);
  assert.equal(hasCoordinateKey(nmnhDecision), false);
  assert.equal(stationCrosswalk.catalogIdentity.catalogNumber, "122919");
  assert.deepEqual(stationCrosswalk.stationTable.stations.map(({ station, depthMeters }) => [station, depthMeters]), [
    ["D 5115", 622],
    ["D 5116", 366],
  ]);
  assert.equal(stationCrosswalk.laterTaxonomicPublication.reportedSpecimen, "USNM 122919");
  assert.equal(stationCrosswalk.laterTaxonomicPublication.reportedDepthMeters, 623);
  assert.equal(stationCrosswalk.laterTaxonomicPublication.stationNumberExplicitlyGiven, false);
  assert.match(stationCrosswalk.comparison.stationAssignment, /strong inference, not an explicit crosswalk/i);
  assert.match(stationCrosswalk.comparison.exactWaterbodyAssignment, /Unresolved/i);
  assert.equal(stationCrosswalk.summary.historicalOccurrenceAdmitted, false);
  assert.equal(stationCrosswalk.summary.trackedCoordinates, false);
  assert.equal(hasCoordinateKey(stationCrosswalk), false);

  const nmnhSource = registry.sources.find((source) => source.id === "nmnh-balayan-usnm-122919-primary-record-check");
  const wormsSource = registry.sources.find(
    (source) => source.id === "worms-balayan-ventrifossa-divergens-taxonomy-crosscheck",
  );
  assert.ok(nmnhSource);
  assert.ok(wormsSource);
  assert.ok(registry.sources.find((source) => source.id === "albatross-philippine-station-table-1910"));
  assert.ok(registry.sources.find((source) => source.id === "iwamoto-etal-2015-usnm-122919-depth-crosscheck"));
  assert.equal(nmnhSource.publicationApproval, false);
  assert.equal(wormsSource.publicationApproval, false);
  assert.equal(registry.sourceCount, 151);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(gapReport.coverageSummary.registeredSources, 151);
  assert.equal(gapReport.inputHashes.sourcesSha256, createHash("sha256").update(sourceBytes).digest("hex"));
  assert.equal(
    gapReport.inputHashes.balayanNmnhSourceSha256,
    createHash("sha256").update(nmnhReviewBytes).digest("hex"),
  );
  assert.equal(
    gapReport.inputHashes.balayanNmnhRowDecisionsSha256,
    createHash("sha256").update(nmnhDecisionBytes).digest("hex"),
  );
  assert.equal(
    gapReport.inputHashes.balayanNmnhStationCrosswalkSha256,
    createHash("sha256").update(stationCrosswalkBytes).digest("hex"),
  );
  const gap = gapReport.openGaps.find((item) => item.id === "balayan-bay-museum-catalog-review");
  assert.match(gap.reason, /direct NMNH record gives D 5115 OR D 5116/i);
  assert.match(gap.reason, /CC0.*D 5115 OR D 5116/is);
  assert.match(gap.nextAction, /rights are no longer the blocker/i);
  assert.match(gap.nextAction, /station.*broad locality wording/i);
});

test("Field Museum archive confirms its two Balayan catalog rows without promoting indexed dates", () => {
  assert.equal(fieldMuseumReview.archiveVersion, "13.13");
  assert.match(fieldMuseumReview.archive.sha256, /^[a-f0-9]{64}$/);
  assert.equal(fieldMuseumReview.summary.matchedFieldMuseumRecords, 2);
  assert.equal(fieldMuseumReview.summary.sourceLocalityMentionsBalayanBay, 2);
  assert.equal(fieldMuseumReview.summary.allSourceRecordLicensesCc0, true);
  assert.equal(fieldMuseumReview.summary.exactFieldComparisonsWithIDigBio, 2);
  assert.equal(fieldMuseumReview.decision.historicalAssertionsAdmitted, 0);
  assert.equal(fieldMuseumReview.decision.publicAdmission, false);
  assert.equal(fieldMuseumReview.decision.coordinatesIncluded, false);
  assert.equal(fieldMuseumReview.decision.currentPresenceInferred, false);
  assert.equal(fieldMuseumReview.decision.completeSpeciesInventoryClaimed, false);
  assert.equal(hasCoordinateKey(fieldMuseumReview), false);
  assert.deepEqual(
    fieldMuseumReview.records.map(
      ({ catalogNumber, scientificName, year, sourceDatePrecision, locality, license, idigbioCrosscheck }) => ({
        catalogNumber,
        scientificName,
        year,
        sourceDatePrecision,
        locality,
        license,
        indexedDateUsedAsSourceDate: idigbioCrosscheck.indexDateUsedAsSourceDate,
      }),
    ),
    [
      {
        catalogNumber: "47041",
        scientificName: "Caracanthus unipinna",
        year: "1929",
        sourceDatePrecision: "year",
        locality: "Balayan Bay",
        license: "https://creativecommons.org/publicdomain/zero/1.0/",
        indexedDateUsedAsSourceDate: false,
      },
      {
        catalogNumber: "90961",
        scientificName: "Lagocephalus lunaris",
        year: "1926",
        sourceDatePrecision: "year",
        locality: "Balayan Bay",
        license: "https://creativecommons.org/publicdomain/zero/1.0/",
        indexedDateUsedAsSourceDate: false,
      },
    ],
  );
  const source = registry.sources.find((entry) => entry.id === "fieldmuseum-balayan-primary-archive-check");
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-balayan-fieldmuseum-source-records-20261025.json"));
  assert.equal(source.publicationApproval, false);
  assert.equal(gapReport.inputHashes.sourcesSha256, createHash("sha256").update(sourceBytes).digest("hex"));
});
