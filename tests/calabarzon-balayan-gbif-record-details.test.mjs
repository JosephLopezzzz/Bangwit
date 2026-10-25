import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, searchBytes, registry, report, reviewBytes] = await Promise.all([
  readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("raw/gbif-calabarzon-colxr-actinopterygii-rerun-20261024/balayan-bay.json", base)),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-balayan-gbif-record-details-20261025.json", base)),
]);

function hasCoordinateKey(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "geopoint", "coordinates", "geometry"].includes(key) ||
      hasCoordinateKey(nested),
  );
}

test("corrected Balayan GBIF candidates match direct details and retain source quality flags", () => {
  assert.equal(review.input.queryCount, 14);
  assert.equal(review.input.directRecordCount, 14);
  assert.equal(review.input.sha256, createHash("sha256").update(searchBytes).digest("hex"));
  assert.equal(review.summary.searchCandidates, 14);
  assert.equal(review.summary.directDetailResponses, 14);
  assert.equal(review.summary.matchingSearchSnapshots, 14);
  assert.equal(review.summary.mismatchedRecords, 0);
  assert.equal(review.summary.datasetCount, 4);
  assert.equal(review.summary.sourceCatalogIdentityGroups, 10);
  assert.equal(review.summary.repeatedOccurrenceIds, 0);
  assert.equal(review.decision.historicalAssertionsAdmitted, 0);
  assert.equal(review.decision.publicRecordsAdded, 0);
  assert.equal(review.decision.coordinatesIncluded, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.completeSpeciesInventoryClaimed, false);
  assert.ok(review.records.every((record) => record.matchesSearchSnapshot));
  assert.ok(review.records.every((record) => record.rawResponse.sha256.length === 64));
  assert.equal(hasCoordinateKey(review), false);
});

test("GBIF registry points to Balayan direct-record responses", () => {
  const source = registry.sources.find((entry) => entry.id === "gbif-occurrence-downloads");
  assert.ok(source.access.reviewFiles.includes("calabarzon-balayan-gbif-record-details-20261025.json"));
  assert.ok(source.access.additionalRawPaths.includes("raw/calabarzon-balayan-gbif-record-details-20261025/"));
  assert.equal(report.inputHashes.balayanGbifDetailsSha256, createHash("sha256").update(reviewBytes).digest("hex"));
});
