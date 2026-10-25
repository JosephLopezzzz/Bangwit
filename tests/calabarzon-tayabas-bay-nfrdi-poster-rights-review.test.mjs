import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, scope] = await Promise.all([
  readFile(new URL("calabarzon-tayabas-bay-nfrdi-poster-rights-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
]);

test("NFRDI metadata adds two Tayabas Bay fishery leads without copying poster content", () => {
  assert.equal(review.items.length, 2);
  assert.deepEqual(review.items.map((item) => item.underlyingCoveragePeriod), ["2015-2022", "2018-2022"]);
  assert.ok(review.items.every((item) => item.issued === 2025));
  assert.ok(review.items.every((item) => item.authors.includes("Bureau of Fisheries and Aquatic Resources")));
  assert.ok(review.items.every((item) => item.authors.includes("National Fisheries Research and Development Institute")));
  assert.ok(review.items.every((item) => item.abstractDescribesSpeciesSummary));
  const source = registry.sources.find((entry) => entry.id === review.sourceRegistryId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-tayabas-bay-nfrdi-poster-rights-review-20261026.json"));
  assert.ok(review.items.every((item) => !item.abstractSpeciesNamesCopied));
  assert.equal(review.rightsReview.explicitItemLicenseFound, false);
  assert.equal(review.rightsReview.explicitRedistributionPermissionFound, false);
  assert.equal(review.rightsReview.posterFilesDownloaded, false);
  assert.equal(review.decision.speciesAssertionsAdmitted, 0);
  assert.equal(review.decision.publicProjection, false);
  assert.equal(review.decision.coordinatesPublished, false);
  assert.equal(review.decision.waterbodyScopeChanged, false);
});

test("rights-pending metadata does not alter Tayabas Bay scope admission", () => {
  const bay = scope.waterbodies.find((waterbody) => waterbody.id === review.waterbodyId);
  assert.ok(bay);
  assert.equal(bay.fishEvidenceStatus, "not-reviewed");
  assert.equal(bay.publicAdmission, false);
});
