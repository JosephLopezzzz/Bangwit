import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, gbif, registry, gapReport, reviewBytes, gbifBytes, sourceBytes] = await Promise.all([
  readFile(new URL("calabarzon-balayan-idigbio-catalog-check-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-idigbio-catalog-check-20261025.json", base)),
  readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base)),
  readFile(new URL("sources.json", base)),
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
  assert.match(gap.nextAction, /UMMZ.*CAS catalog 28340 name conflict.*USNM/i);
});
