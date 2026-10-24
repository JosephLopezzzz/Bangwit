import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, sweep] = await Promise.all([
  readFile(new URL("calabarzon-obis-philippines-area-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-source-sweep.json", base), "utf8").then(JSON.parse),
]);

test("OBIS national area remains a discovery lead with count and scope limits", () => {
  assert.equal(review.status, "national-area-open-data-discovery-only-no-local-verde-area");
  assert.equal(review.areaLookup.totalAreasReturned, 799);
  assert.deepEqual(review.areaLookup.targetNameMatches, []);
  assert.deepEqual(review.areaLookup.nearbyNationalArea, {
    id: "191",
    name: "Philippines",
    type: "obis",
    detailEndpoint: "https://api.obis.org/v3/area/191",
    detailSha256: "2ece2cd832206937f1abae8cfabbaec455bd0ae516740f63f46d27cc0282b622",
    detailResponseFields: ["id", "name", "type"],
  });
  assert.equal(review.nationalAreaCounts.allOccurrenceRecords.count, 380993);
  assert.equal(review.nationalAreaCounts.rayFinnedFishOccurrenceRecords.count, 128352);
  assert.equal(review.checklistDiagnostic.reportedTotal, 4502);
  assert.equal(review.checklistDiagnostic.rowsReturned, 4786);
  assert.equal(review.rightsAndScope.datasetLevelLicensesReviewed, false);
  assert.equal(review.rightsAndScope.speciesAssertionsAdmitted, 0);
  assert.equal(review.rightsAndScope.publicProjection, false);

  const registrySource = registry.sources.find((source) => source.id === "obis-philippines-area-actinopterygii-discovery");
  assert.ok(registrySource);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registrySource.publicationApproval, false);
  assert.equal(sweep.sourceRegistryCountAfterFollowUp, 61);
  assert.ok(sweep.additionalOpenDataFollowUps.some((item) => item.reviewFile === "calabarzon-obis-philippines-area-review-20261024.json"));
});
