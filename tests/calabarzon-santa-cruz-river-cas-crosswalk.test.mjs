import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, sources, report, previousArchiveReview, reviewBytes, scopeBytes, sourceBytes] = await Promise.all([
  readFile(new URL("calabarzon-santa-cruz-river-cas-crosswalk-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-laguna-cas-archive-crosswalk-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-santa-cruz-river-cas-crosswalk-20261025.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
]);

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const containsCoordinates = (value) => {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "coordinateUncertaintyInMeters", "coordinates", "geometry"].includes(key) ||
      containsCoordinates(nested),
  );
};

test("Santa Cruz River CAS review admits only supported historical locality assertions", () => {
  assert.equal(review.status.startsWith("three-historical-text-locality-species-assertions-admitted"), true);
  assert.equal(review.waterbody.id, "ph-wb-santa-cruz-laguna-river");
  assert.equal(review.waterbody.matchedAlias, "Santa Cruz River");
  assert.equal(review.dataset.license, "CC0-1.0");
  assert.equal(review.dataset.datasetVersion, previousArchiveReview.archive.datasetVersion);
  assert.equal(review.sourceArchiveReview.archiveSha256, previousArchiveReview.archive.sha256);
  assert.equal(review.sourceArchiveReview.matchedOccurrenceRows, 3);
  assert.equal(review.queryReview.resultCount, 3);
  assert.equal(review.queryReview.enumeratedCount, 3);
  assert.equal(review.queryReview.endOfRecords, true);
  assert.deepEqual(review.queryReview.candidateGbifIds, review.records.map((record) => record.gbifId));
  assert.equal(review.decision.historicalSpeciesAssertionsAdmittedToResearchLedger, 3);
  assert.equal(review.decision.publicAppAdmission, false);
  assert.equal(review.decision.mapPointAdmission, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.abundanceInferred, false);
  assert.equal(review.decision.completeChecklistClaimed, false);
  assert.equal(containsCoordinates(review), false);

  const identities = new Set();
  for (const record of review.records) {
    const source = record.sourceRecord;
    identities.add([source.institutionCode, source.collectionCode, source.catalogNumber, source.occurrenceID].join("|"));
    assert.equal(source.institutionCode, "CAS");
    assert.equal(source.collectionCode, "SU(ICH)");
    assert.equal(source.basisOfRecord, "PreservedSpecimen");
    assert.equal(source.taxonRank, "species");
    assert.equal(source.country, "Philippines");
    assert.equal(source.stateProvince, "Laguna");
    assert.equal(source.eventDate, "1941-10-18");
    assert.equal(source.waterBody, "Santa Cruz River");
    assert.equal(source.locality, "Santa Cruz River");
    assert.equal(source.license, "https://creativecommons.org/publicdomain/zero/1.0/");
    assert.equal(record.gbifCrosswalk.license, "http://creativecommons.org/publicdomain/zero/1.0/legalcode");
    assert.ok(record.gbifCrosswalk.issues.includes("CONTINENT_INVALID"));
    assert.ok(record.gbifCrosswalk.issues.includes("OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"));
    assert.match(record.gbifCrosswalk.rawResponse.sha256, /^[0-9a-f]{64}$/);
  }
  assert.equal(identities.size, 3);
  assert.deepEqual(
    review.records.map((record) => record.acceptedName),
    [
      "Giuris margaritaceus (Valenciennes, 1837)",
      "Glossogobius giuris (Hamilton, 1822)",
      "Microphis jagorii Peters, 1868",
    ],
  );
  assert.equal(review.records[2].gbifCrosswalk.acceptedScientificName, "Oostethus jagorii (Peters, 1868)");
  assert.equal(review.records[2].gbifCrosswalk.colXrAcceptedName, "Microphis jagorii Peters, 1868");
});

test("registry and CALABARZON checkpoint reflect the Santa Cruz spelling crosswalk", () => {
  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbody.id);
  assert.ok(waterbody);
  assert.ok(waterbody.aliases.includes("Santa Cruz River"));
  assert.ok(waterbody.sourceRefs.includes("gbif-cas-ichthyology"));
  assert.match(waterbody.fishEvidenceStatus, /three historical.*species/i);
  assert.match(waterbody.reviewStatus, /historical.*incomplete/i);
  assert.equal(waterbody.publicAdmission, false);

  const source = sources.sources.find((row) => row.id === "gbif-cas-ichthyology");
  assert.ok(source);
  assert.equal(source.url, review.dataset.url);
  assert.equal(source.license, "CC0-1.0");
  assert.equal(source.publicationApproval, false);
  assert.equal(sources.sourceCount, sources.sources.length);

  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.santaCruzCasCrosswalkSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, sources.sourceCount);
  assert.equal(report.coverageSummary.sourceAssignments, scope.waterbodies.reduce((count, item) => count + item.sourceRefs.length, 0));
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.deepEqual(
    report.waterbodySnapshot.find((row) => row.id === review.waterbody.id),
    {
      id: waterbody.id,
      name: waterbody.name,
      kind: waterbody.kind,
      salinity: waterbody.salinity.classification,
      fishEvidenceStatus: waterbody.fishEvidenceStatus,
      reviewStatus: waterbody.reviewStatus,
      boundaryStatus: waterbody.boundaryStatus,
      publicAdmission: waterbody.publicAdmission,
      sourceRefs: waterbody.sourceRefs,
    },
  );
});
