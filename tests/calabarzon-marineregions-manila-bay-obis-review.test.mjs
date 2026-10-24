import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const research = new URL("../data/research/philippines/", import.meta.url);
const paths = {
  review: new URL("calabarzon-marineregions-manila-bay-obis-review-20261024.json", research),
  registry: new URL("sources.json", research),
  scope: new URL("calabarzon-scope.json", research),
  sweep: new URL("calabarzon-coverage-source-sweep.json", research),
  decisions: new URL("palico-river-decisions.json", research),
};
const [reviewText, registryText, scopeText, sweepText, decisionsText] = await Promise.all(
  Object.values(paths).map((path) => readFile(path, "utf8")),
);
const [review, registry, scope, sweep, decisions] = [
  reviewText,
  registryText,
  scopeText,
  sweepText,
  decisionsText,
].map(JSON.parse);
const hash = (text) => createHash("sha256").update(text).digest("hex");

test("Manila Bay geometry query remains research-only and separate from legal boundaries", () => {
  assert.equal(review.status, "bounded-manila-bay-obis-discovery-only-no-new-species-assertions");
  assert.equal(review.geometry.mrgid, 31579);
  assert.equal(review.geometry.placeNameSource, "GeoNames");
  assert.equal(review.geometry.geometryProvenance, "Marine Regions");
  assert.equal(review.geometry.crs, "OGC:CRS84");
  assert.equal(review.geometry.coordinatePairs, 6159);
  assert.match(review.geometry.useDecision, /not a NAMRIA\/LGU boundary/);
  assert.equal(review.geometry.terms.publicAppReuseApproved, false);

  assert.equal(review.query.boundingBoxRecordCount, 2654);
  assert.equal(review.query.boundingBoxRowsDownloaded, 2654);
  assert.equal(review.query.exactGeometryFilter.recordsInside, 1874);
  assert.equal(review.query.exactGeometryFilter.distinctDatasets, 10);
  assert.equal(review.query.exactGeometryFilter.recordsWithAnyObisQualityFlag, 1795);
  assert.equal(review.query.exactGeometryFilter.flagCountsMayOverlap, true);
  assert.equal(review.highPriorityDatasetReview.recordsInsideGeometry, 610);
  assert.equal(review.highPriorityDatasetReview.caviteLocalityText.records, 160);
  assert.equal(
    review.highPriorityDatasetReview.caviteLocalityText.medianCoordinateUncertaintyMeters,
    45341,
  );

  assert.equal(review.rightsAndScope.newSpeciesAssertionsAdmitted, 0);
  assert.equal(review.rightsAndScope.publicProjection, false);
  assert.equal(review.rightsAndScope.officialMunicipalWaterGeometryFound, false);
  assert.equal(review.datasetTriage.datasets.length, 10);
  assert.equal(
    review.datasetTriage.datasets.reduce((total, row) => total + row.recordsInGeometry, 0),
    review.query.exactGeometryFilter.recordsInside,
  );

  assert.equal(registry.sourceCount, registry.sources.length);
  assert.ok(registry.sources.some((source) => source.id === "marine-regions-manila-bay-bay-geometry"));
  assert.ok(registry.sources.some((source) => source.id === "obis-manila-bay-actinopterygii-geometry-discovery"));
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 61);
  assert.ok(
    sweep.additionalOpenDataFollowUps.some(
      (item) => item.reviewFile === "calabarzon-marineregions-manila-bay-obis-review-20261024.json",
    ),
  );

  const manilaBay = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-manila-bay");
  assert.equal(manilaBay.boundaryStatus, "not-delineated");
  assert.equal(manilaBay.publicAdmission, false);
  assert.ok(manilaBay.sourceRefs.includes("marine-regions-manila-bay-bay-geometry"));
  assert.ok(manilaBay.sourceRefs.includes("obis-manila-bay-actinopterygii-geometry-discovery"));
  assert.equal(decisions.snapshotHashes.registry, hash(registryText));
  assert.equal(decisions.snapshotHashes.scope, hash(scopeText));
});
