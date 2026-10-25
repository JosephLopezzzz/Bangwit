import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewName = "calabarzon-tagbac-creek-hydrography-crosscheck-20261026.json";
const [review, registry, report, scopeBytes, sourceBytes, reviewBytes] = await Promise.all([
  readFile(new URL(reviewName, base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL(reviewName, base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Tagbac station clusters approach adjacent, connected modelled stream-network segments", () => {
  assert.equal(review.status, "modelled-network-connectivity-candidate;official-channel-identity-and-geometry-pending");
  assert.equal(review.dataset.license, "CC BY 4.0");
  assert.equal(review.dataset.streamFeatureCount, 107613);
  assert.equal(review.dataset.crs, "WGS 84 / Pseudo-Mercator (EPSG:3857)");
  assert.deepEqual(review.stationCrosscheck.tagbacCreekStations.map((row) => row.distanceMeters), [302.8, 152.1, 16.8]);
  assert.deepEqual(review.stationCrosscheck.separatelyListedTagbacRiverStations.map((row) => row.distanceMeters), [74.3, 20.6]);
  assert.equal(review.stationCrosscheck.networkTopology.featuresShareExactEndpoint, true);
  assert.equal(review.stationCrosscheck.networkTopology.endpointGapMeters, 0);
  assert.equal(review.decisions.officialChannelIdentityConfirmed, false);
  assert.equal(review.decisions.fullChannelGeometryAdded, false);
  assert.equal(review.decisions.globalTagbacRiverAliasAdded, false);
  assert.equal(review.decisions.fishAssertionsAdded, 0);
  assert.equal(review.decisions.fishAbsenceInferred, false);
  assert.equal(review.decisions.publicProjectionAdded, false);
});

test("the archive receipt and crosscheck remain pinned without advancing the regional baseline", () => {
  const dataset = registry.sources.find((row) => row.id === "boothroyd-2023-philippines-river-catchment-geodata");
  const emb = registry.sources.find((row) => row.id === "emb-calabarzon-waterbodies");
  assert.ok(dataset);
  assert.ok(emb);
  assert.ok(dataset.access.reviewFiles.includes(reviewName));
  assert.ok(emb.access.reviewFiles.includes(reviewName));
  assert.ok(dataset.access.downloadedFiles.some((file) => file.path === review.dataset.rawPath && file.bytes === review.dataset.bytes && file.sha256 === review.dataset.sha256));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.tagbacHydrographyCrosscheckSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  const gap = report.openGaps.find((row) => row.id === "tagbac-creek-channel-and-name-crosswalk");
  assert.match(gap.reason, /modelled continuity does not confirm a single named watercourse/i);
  assert.ok(gap.sourceRefs.includes("boothroyd-2023-philippines-river-catchment-geodata"));
});
