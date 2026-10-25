import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const files = [
  "calabarzon-balayan-ummz-source-records-20261025.json",
  "calabarzon-balayan-ummz-row-decisions-20261025.json",
  "calabarzon-balayan-gbif-record-details-20261025.json",
  "sources.json",
  "calabarzon-coverage-gap-report-20261025.json",
];
const bytes = await Promise.all(files.map((file) => readFile(new URL(file, base))));
const [sourceReview, decisions, gbif, registry, gap] = bytes.map((value) => JSON.parse(value.toString("utf8")));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const containsCoordinateField = (value) => {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "geopoint", "coordinates", "geometry"].includes(key) ||
      containsCoordinateField(nested),
  );
};

test("UMMZ archive and iDigBio crosswalk resolve catalog identity without inventing a date", () => {
  assert.equal(sourceReview.archive.archiveVersion, "1.115");
  assert.equal(sourceReview.archive.packageId, "59825263-9f89-43a9-8f22-dceb6657bea0/v1.115");
  assert.equal(sourceReview.archive.publishedDate, "2026-10-19");
  assert.equal(sourceReview.archive.occurrenceRows, 208519);
  assert.match(sourceReview.archive.sha256, /^[a-f0-9]{64}$/);
  assert.equal(sourceReview.sourceSearch.itemCount, 1);
  assert.equal(sourceReview.sourceSearch.exactCollectionMatches, 1);
  assert.equal(sourceReview.sourceSearch.broaderInstitutionCatalogMatches, 5);
  assert.equal(sourceReview.sourceSearch.otherCollectionNumericCollisions, 4);
  assert.equal(sourceReview.selection.requiredCollectionCode, "UMMZ-Fish");
  assert.equal(sourceReview.record.idigBioIndexedCollectionCode, "ummz_fish");
  assert.equal(sourceReview.record.catalogNumber, "100346");
  assert.equal(sourceReview.record.scientificName, "Sillago sihama");
  assert.equal(sourceReview.record.occurrenceID, "e7584183-b8f5-4940-91e1-7fd97941eb48");
  assert.equal(sourceReview.record.locality, "Balayan Bay");
  assert.equal(sourceReview.record.eventDate, null);
  assert.deepEqual(sourceReview.record.sourceDateComponents, {
    year: null,
    month: null,
    day: null,
    verbatimEventDate: null,
  });
  assert.equal(sourceReview.record.datePrecision, "unknown");
  assert.equal(sourceReview.rights.licenseIdentifier, "CC-BY-4.0");
  assert.equal(sourceReview.rights.publicationApproval, false);
  assert.equal(containsCoordinateField(sourceReview), false);
});

test("UMMZ taxonomy and GBIF quality flags stay attached to an undated research candidate", () => {
  assert.deepEqual(decisions.inputHashes, {
    institutionReview: digest(bytes[0]),
    gbif: digest(bytes[2]),
    taxonomy: sourceReview.taxonomy.response.sha256,
    idigbioSearch: sourceReview.sourceSearch.searchResponse.sha256,
  });
  assert.equal(sourceReview.taxonomy.acceptedName, "Sillago sihama");
  assert.equal(sourceReview.taxonomy.rank, "Species");
  assert.equal(sourceReview.taxonomy.status, "accepted");
  assert.equal(sourceReview.taxonomy.aphiaId, 127046);
  assert.deepEqual(decisions.record.gbifQualityFlags, [
    "CONTINENT_COORDINATE_MISMATCH",
    "GEODETIC_DATUM_ASSUMED_WGS84",
  ]);
  const gbifRow = gbif.records.find((row) => row.gbifId === "1889004827");
  assert.ok(gbifRow);
  assert.deepEqual(decisions.record.gbifQualityFlags, gbifRow.issues);
  assert.equal(decisions.summary.undatedCandidatesAddedToResearchLedger, 1);
  assert.equal(decisions.summary.datedHistoricalAssertionsAdmitted, 0);
  assert.equal(decisions.summary.publicAppRowsAdded, 0);
  assert.equal(decisions.summary.coordinateRowsAdded, 0);
  assert.equal(decisions.record.sourceLocalityEvidence.datePrecision, "unknown");
  assert.equal(decisions.record.decision.researchLedger, "admit-undated-source-locality-candidate");
  assert.equal(decisions.record.decision.publicAppAdmission, false);
  assert.equal(decisions.record.decision.mapPointAdmission, false);
  assert.equal(decisions.record.decision.currentPresenceInferred, false);
  assert.equal(decisions.record.decision.dateInferred, false);
  assert.equal(containsCoordinateField(decisions), false);
});

test("UMMZ source and regional gap hashes are current while the five USNM rows stay held", () => {
  assert.equal(registry.sourceCount, 157);
  assert.equal(registry.sources.length, 157);
  const institution = registry.sources.find((source) => source.id === "ummz-balayan-primary-archive-check");
  const taxonomy = registry.sources.find((source) => source.id === "worms-balayan-sillago-sihama-taxonomy-crosscheck");
  assert.ok(institution && taxonomy);
  assert.equal(institution.publicationApproval, false);
  assert.equal(institution.license, "CC BY 4.0");
  assert.equal(taxonomy.publicationApproval, false);
  assert.equal(taxonomy.license, null);
  assert.equal(gap.coverageSummary.registeredSources, 157);
  assert.equal(gap.inputHashes.sourcesSha256, digest(bytes[3]));
  assert.equal(gap.inputHashes.balayanUmmzSourceSha256, digest(bytes[0]));
  assert.equal(gap.inputHashes.balayanUmmzRowDecisionsSha256, digest(bytes[1]));
  const balayan = gap.openGaps.find((item) => item.id === "balayan-bay-museum-catalog-review");
  assert.equal(balayan.count, 14);
  assert.ok(balayan.sourceRefs.includes(institution.id));
  assert.ok(balayan.sourceRefs.includes(taxonomy.id));
  assert.match(balayan.reason, /eight candidates have dated historical locality evidence.*one undated locality candidate/i);
  assert.match(balayan.nextAction, /rights are no longer the blocker/i);
  assert.equal(gap.coverageSummary.admittedPublicRecords, 0);
  assert.equal(gap.coverageSummary.regionalBaselineComplete, false);
});
