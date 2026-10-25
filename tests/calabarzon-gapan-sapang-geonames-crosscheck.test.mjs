import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const file = "calabarzon-gapan-sapang-geonames-crosscheck-20261026.json";
const [review, scope, registry, report, reviewBytes, scopeBytes, sourceBytes] = await Promise.all([
  readFile(new URL(file, base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL(file, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("GeoNames point and modelled network remain an inconclusive Gapan/Sapang crosscheck", () => {
  assert.equal(review.status, "gazetteer-point-not-close-enough-to-verify-modelled-channel;official-crosswalk-pending");
  assert.equal(review.gazetteerRecord.geonameId, 1679414);
  assert.deepEqual(review.gazetteerRecord.coordinates, { latitude: 14.2886, longitude: 120.7115, crs: "WGS 84" });
  assert.match(review.gazetteerRecord.termsCaveat, /without a warranty of accuracy/i);
  assert.equal(review.modelledNetworkCrosscheck.nearestFeature.record, 59365);
  assert.equal(review.modelledNetworkCrosscheck.nearestFeature.projectedDistanceMeters, 1617.52);
  assert.equal(review.modelledNetworkCrosscheck.nearestFeature.approximateGroundDistanceMeters, 1567.49);
  assert.equal(review.sourceNameContext.relationshipToGazetteerFeature, "not-confirmed");
  assert.equal(review.decisions.gazetteerNameAddedAsAlias, false);
  assert.equal(review.decisions.modelledGeometryAdded, false);
  assert.equal(review.decisions.officialChannelIdentityConfirmed, false);
  assert.equal(review.decisions.speciesAssertionsAdded, 0);
  assert.equal(review.decisions.publicProjectionAdded, false);

  const lead = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(lead);
  assert.ok(lead.sourceRefs.includes("geonames-sapang-river-ternate"));
  assert.ok(lead.sourceRefs.includes("boothroyd-2023-philippines-river-catchment-geodata"));
  assert.equal(lead.boundaryStatus, "not-delineated");
  assert.equal(lead.publicAdmission, false);
});

test("source records and coverage checkpoint include the crosscheck without admitting public geometry", () => {
  for (const id of ["geonames-sapang-river-ternate", "boothroyd-2023-philippines-river-catchment-geodata"]) {
    const source = registry.sources.find((row) => row.id === id);
    assert.ok(source, `missing source ${id}`);
    assert.equal(source.publicationApproval, false);
    assert.ok(source.access.reviewFiles.includes(file));
  }
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.gapanSapangGeoNamesCrosscheckSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
