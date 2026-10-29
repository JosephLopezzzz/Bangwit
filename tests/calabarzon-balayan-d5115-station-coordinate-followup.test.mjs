import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewName = "calabarzon-balayan-d5115-station-coordinate-followup-20261029.json";
const [review, registry, gap, reviewBytes, registryBytes] = await Promise.all([
  readFile(new URL(reviewName, base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL(reviewName, base)),
  readFile(new URL("sources.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("D.5115 coordinate is linked only to its distinct published USNM 182931 comparator", () => {
  assert.equal(review.reviewedOn, "2026-10-29");
  assert.equal(review.citation.doi, "10.3390/jmse10010034");
  assert.equal(review.citation.license, "CC-BY-4.0");
  assert.match(review.citation.attribution, /Ho, H\.-C\..*2022.*10\(1\), 34/);
  assert.equal(review.independentStationComparator.specimenCatalogNumber, "USNM 182931");
  assert.equal(review.independentStationComparator.specimenIdentityIsUsnm122919, false);
  assert.equal(review.independentStationComparator.station, "D.5115");
  assert.equal(review.independentStationComparator.reportedCoordinate, "13°37′10.9″ N, 120°43′40.8″ E");
  assert.equal(review.independentStationComparator.eventDate, "1908-01-20");
  assert.equal(review.independentStationComparator.depthMeters, 622);
  assert.match(review.independentStationComparator.coordinateScope, /USNM 182931 catalog lot only.*Do not transfer/i);
  assert.equal(review.crossChecks[0].catalogNumber, "USNM 122919");
  assert.equal(review.crossChecks[0].sourceStationText, "D 5115 OR D 5116");
  assert.equal(review.crossChecks[2].catalogNumber, "USNM 122919");
  assert.equal(review.crossChecks[2].stationNumberExplicitlyGiven, false);
  assert.match(review.interpretation.usnm122919Crosswalk, /strong.*inference.*not explicit/i);
  assert.match(review.interpretation.waterbodyScope, /combined Balayan Bay \/ Verde Island Passage/i);
  assert.equal(review.decision.historicalOccurrenceAdmittedForUsnm122919, false);
  assert.equal(review.decision.publicAppAdmission, false);
  assert.equal(review.decision.mapPointAdmission, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.completeChecklistClaimed, false);
  assert.equal(review.decision.coordinateAssignedToUsnm122919, false);
});

test("registry and CALABARZON snapshot pin the supplemental evidence without public admission", () => {
  const source = registry.sources.find((item) => item.id === "ho-2022-halieutopsis-d5115-coordinate-comparator");
  assert.ok(source);
  assert.equal(source.license, "CC-BY-4.0");
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes(reviewName));
  for (const id of [
    "nmnh-balayan-usnm-122919-primary-record-check",
    "albatross-philippine-station-table-1910",
    "iwamoto-etal-2015-usnm-122919-depth-crosscheck",
  ]) {
    const existing = registry.sources.find((item) => item.id === id);
    assert.ok(existing?.access.reviewFiles.includes(reviewName));
  }
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(gap.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(gap.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(gap.inputHashes.balayanD5115StationCoordinateFollowupSha256, sha256(reviewBytes));
  const balayan = gap.openGaps.find((item) => item.id === "balayan-bay-museum-catalog-review");
  assert.match(balayan.reason, /distinct USNM 182931 lot.*does not crosswalk USNM 122919/i);
  assert.match(balayan.nextAction, /coordinate to USNM 122919/i);
  assert.equal(gap.coverageSummary.admittedPublicRecords, 0);
  assert.equal(gap.coverageSummary.regionalBaselineComplete, false);
});
