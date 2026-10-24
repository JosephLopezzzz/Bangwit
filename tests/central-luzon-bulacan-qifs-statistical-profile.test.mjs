import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const profile = JSON.parse(await readFile(new URL(
  "../data/research/philippines/central-luzon-bulacan-qifs-statistical-profile-20261024.json",
  import.meta.url,
), "utf8"));

test("Bulacan QIFS profile preserves statistical categories without promoting them to site occurrences", () => {
  assert.equal(profile.provincePsgc, "0301400000");
  assert.equal(profile.sources.officialQuarterlyQuery.responseRows, 38);
  assert.equal(profile.sources.officialQuarterlyQuery.leafCatchCategories, 34);
  assert.equal(profile.sources.officialQuarterlyQuery.availableLeafCategories, 23);
  assert.equal(profile.sources.officialQuarterlyQuery.unavailableLeafCategories, 11);
  assert.equal(profile.sources.officialQuarterlyQuery.maximumDifferenceMetricTons, 0.0145);
  assert.match(profile.sources.officialQuarterlyQuery.rawSha256, /^[a-f0-9]{64}$/);
  assert.equal(profile.sources.officialOpenstat.url, "https://openstat.psa.gov.ph/PXWeb/api/v1/en/DB/2E/FS/0052E4GVIP0.px");
  assert.equal(profile.sources.officialOpenstat.metadataUrl, "https://openstat.psa.gov.ph/Metadata/2E4GVIP0");
  assert.equal(profile.sources.retrievalMirror.organizationType, "independent-community-mirror;not-official-PSA");
  assert.equal(profile.annualProductionRows.length, 38);
  const catchCategories = profile.annualProductionRows.filter((row) => row.type === "reported-catch-category");
  assert.equal(catchCategories.length, 34);
  assert.equal(catchCategories.filter((row) => row.metricTons === null && row.sourceStatus === "..").length, 11);
  assert.ok(catchCategories.every((row) => !Object.hasOwn(row, "scientificName")));
  assert.ok(catchCategories.filter((row) => row.metricTons !== null).every((row) => Number.isFinite(row.metricTons)));

  const sumRows = (type) => profile.annualProductionRows
    .filter((row) => row.type === type)
    .reduce((sum, row) => sum + (row.metricTons ?? 0), 0);
  assert.ok(Math.abs(sumRows("reported-catch-category") - 2598.821) < 0.0001);
  assert.ok(Math.abs(sumRows("group-total") - 2598.821) < 0.0001);
  assert.equal(profile.sources.officialAggregateCrosscheck.mirrorAnnualTotalMetricTons, 2598.821);
  assert.equal(profile.sources.officialAggregateCrosscheck.reportedAnnualTotalMetricTons, 2598.82);
  assert.equal(profile.coverageAndAdmission.siteResolvedFishAssertionsAdded, 0);
  assert.equal(profile.coverageAndAdmission.currentPresenceAssertionsAdded, 0);
  assert.equal(profile.coverageAndAdmission.appProjectionRowsAdded, 0);
  assert.equal(profile.coverageAndAdmission.geometryAdded, false);
});
