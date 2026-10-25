import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import crosswalk from "../data/research/philippines/calabarzon-laguna-cas-archive-crosswalk-20261025.json" with { type: "json" };
import details from "../data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json" with { type: "json" };
import taxonomy from "../data/research/philippines/calabarzon-laguna-cof-taxonomy-20261025.json" with { type: "json" };
import museum from "../data/research/philippines/calabarzon-laguna-museum-catalog-verification-20261025.json" with { type: "json" };
import registry from "../data/research/philippines/sources.json" with { type: "json" };
import gapReport from "../data/research/philippines/calabarzon-coverage-gap-report-20261025.json" with { type: "json" };

const base = new URL("../data/research/philippines/", import.meta.url);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const containsCoordinateField = (value) => {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "coordinateUncertaintyInMeters", "coordinates", "geometry"].includes(key) ||
      containsCoordinateField(nested),
  );
};

test("CAS archive crosswalk uses exact collection-qualified identities and source fields only", async () => {
  const [triageBytes, detailsBytes, taxonomyBytes] = await Promise.all(
    [
      "calabarzon-laguna-gbif-triage-20261025.json",
      "calabarzon-laguna-gbif-record-details-20261025.json",
      "calabarzon-laguna-cof-taxonomy-20261025.json",
    ].map((file) => readFile(new URL(file, base))),
  );
  assert.deepEqual(crosswalk.inputs, [
    { file: "calabarzon-laguna-gbif-triage-20261025.json", sha256: digest(triageBytes) },
    { file: "calabarzon-laguna-gbif-record-details-20261025.json", sha256: digest(detailsBytes) },
    { file: "calabarzon-laguna-cof-taxonomy-20261025.json", sha256: digest(taxonomyBytes) },
  ]);
  assert.equal(crosswalk.archive.occurrenceRows, 220916);
  assert.equal(crosswalk.archive.exactCandidateIdentityMatches, 17);
  assert.equal(crosswalk.archive.otherCollectionNumericCollisions, 17);
  assert.equal(crosswalk.archive.coordinateBearingRawArchive, true);
  assert.equal(crosswalk.archive.trackedReviewCoordinates, false);
  assert.equal(crosswalk.records.length, 17);
  assert.equal(containsCoordinateField(crosswalk), false);

  const detailsById = new Map(details.records.map((record) => [record.gbifId, record]));
  const taxonomyById = new Map(taxonomy.recordCrosswalk.map((record) => [record.gbifId, record]));
  const sourceKeys = new Set();
  for (const record of crosswalk.records) {
    const source = record.sourceRecord;
    const gbif = detailsById.get(record.gbifId);
    const taxon = taxonomyById.get(record.gbifId);
    assert.ok(gbif, `Missing GBIF detail row ${record.gbifId}`);
    assert.ok(taxon, `Missing fish-name review ${record.gbifId}`);
    const key = [source.institutionCode, source.collectionCode, source.catalogNumber, source.occurrenceID].join("|");
    assert.equal(sourceKeys.has(key), false, `Duplicate source identity ${key}`);
    sourceKeys.add(key);
    assert.equal(source.institutionCode, "CAS");
    assert.ok(["ICH", "SU(ICH)"].includes(source.collectionCode));
    assert.equal(source.occurrenceID, gbif.occurrenceId);
    assert.equal(source.eventDate, gbif.eventDate);
    assert.equal(source.scientificName, gbif.scientificName.split(" ").slice(0, 2).join(" "));
    assert.equal(source.country, "Philippines");
    assert.match(`${source.waterBody ?? ""} ${source.locality ?? ""}`, /Laguna de Bay/i);
    assert.equal(source.license, "https://creativecommons.org/publicdomain/zero/1.0/");
    assert.deepEqual(record.gbifCrosswalk.qualityFlags, gbif.issues);
    assert.equal(record.taxonomicCrosscheck.taxonomyDisposition, taxon.taxonomyDisposition);
    assert.equal(
      record.researchLedgerDecision.status === "admit-historical-source-locality-evidence",
      taxon.taxonomyDisposition === "independent-name-crosscheck-agrees",
    );
  }

  assert.equal(crosswalk.summary.exactSourceIdentityMatches, 17);
  assert.equal(crosswalk.summary.eventDatesMatchGbif, 17);
  assert.equal(crosswalk.summary.sourceLocalityOrWaterBodyMentionsLagunaDeBay, 17);
  assert.equal(crosswalk.summary.cc0SourceRows, 17);
  assert.equal(crosswalk.summary.taxonomySupportedHistoricalAssertions, 12);
  assert.equal(crosswalk.summary.taxonomyHeldSourceRecords, 5);
  assert.equal(crosswalk.summary.uniqueAcceptedTaxaInAdmittedRows, 11);
  assert.equal(crosswalk.decision.historicalAssertionsAdmittedToResearchLedger, 12);
  assert.equal(crosswalk.decision.recordsHeldForTaxonomicReview, 5);
  assert.equal(crosswalk.decision.publicAppAdmission, false);
  assert.equal(crosswalk.decision.mapPointAdmission, false);
  assert.equal(crosswalk.decision.currentPresenceInferred, false);
  assert.equal(crosswalk.decision.completeSpeciesInventoryClaimed, false);
});

test("registry and CALABARZON checkpoint pin the Laguna CAS review without public release", async () => {
  const reviewBytes = await readFile(new URL("calabarzon-laguna-cas-archive-crosswalk-20261025.json", base));
  const museumBytes = await readFile(new URL("calabarzon-laguna-museum-catalog-verification-20261025.json", base));
  const sourceBytes = await readFile(new URL("sources.json", base));
  const scopeBytes = await readFile(new URL("calabarzon-scope.json", base));
  const source = registry.sources.find((row) => row.id === "calabarzon-laguna-cas-primary-archive-check");
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, "CC0 1.0");
  assert.equal(source.access.archiveSha256, crosswalk.archive.sha256);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(gapReport.inputHashes.lagunaCasArchiveCrosswalkSha256, digest(reviewBytes));
  assert.equal(gapReport.inputHashes.lagunaMuseumVerificationSha256, digest(museumBytes));
  assert.equal(gapReport.inputHashes.sourcesSha256, digest(sourceBytes));
  assert.equal(gapReport.inputHashes.scopeSha256, digest(scopeBytes));
  assert.equal(gapReport.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(gapReport.coverageSummary.admittedPublicRecords, 0);
  assert.equal(gapReport.coverageSummary.regionalBaselineComplete, false);
  const openGap = gapReport.openGaps.find((item) => item.id === "laguna-museum-catalog-conflicts");
  assert.equal(openGap.candidateRecords, 18);
  assert.equal(openGap.count, 1);
  assert.equal(openGap.historicalAssertionsAdmittedToResearchLedger, 17);
  assert.match(openGap.reason, /17 exact collection-qualified.*all 17.*One unique MZUSP/i);
  const lagoon = gapReport.waterbodySnapshot.find((item) => item.id === "ph-wb-laguna-de-bay");
  assert.equal(lagoon.publicAdmission, false);
  assert.ok(openGap.sourceRefs.includes(source.id));
  assert.ok(openGap.sourceRefs.includes("calabarzon-laguna-mzusp-sibbr-catalog"));
  assert.equal(museum.summary.casSourceItemsDirectlyVerified, 17);
  assert.equal(museum.summary.historicalAssertionsAdmitted, 17);
  assert.equal(museum.summary.publicRecordsAdded, 0);
});
