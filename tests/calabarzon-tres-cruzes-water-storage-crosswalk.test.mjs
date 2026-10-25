import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewPath = "calabarzon-tres-cruzes-water-storage-crosswalk-20261026.json";
const [reviewBytes, scopeBytes, sourceBytes, reportBytes] = await Promise.all([
  readFile(new URL(reviewPath, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const review = JSON.parse(reviewBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(sourceBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyId);

test("Tres Cruzes is normalized as a reservoir lead without asserting a boundary or fish list", () => {
  assert.ok(waterbody);
  assert.equal(waterbody.kind, "reservoir");
  assert.ok(waterbody.aliases.includes("Lawa ng Tres Cruses"));
  assert.ok(waterbody.sourceRefs.includes("nia-calabarzon-tres-cruzes-dam-repair"));
  assert.ok(waterbody.sourceRefs.includes("cavite-ecological-profile-2024-fisheries"));
  assert.ok(waterbody.sourceRefs.includes("gbif-occurrence-downloads"));
  assert.equal(waterbody.identityStatus, "source-named-research-lead");
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.equal(waterbody.fishEvidenceStatus, review.decisionEffects.fishEvidenceStatus);
  assert.equal(waterbody.reviewStatus, "water-storage-classification-crosswalk-reviewed;identity-extent-and-fish-evidence-incomplete");
  assert.equal(waterbody.publicAdmission, false);
  assert.ok(!waterbody.sourceRefs.includes("jesam-2024-lagadlarin-mangrove-flora"));
  assert.ok(!waterbody.administrativeAssociations[0].sourceRefs.includes("jesam-2024-lagadlarin-mangrove-flora"));
  assert.deepEqual(scope.counts.byKind, {
    bay: 7,
    river: 40,
    estuary: 2,
    wetland: 8,
    lake: 18,
    reservoir: 5,
    stream: 3,
  });
  assert.equal(review.decisionEffects.speciesAssertionsAdded, 0);
  assert.equal(review.decisionEffects.geometryAdded, false);
  assert.equal(review.decisionEffects.reportedAreaAdopted, false);
  assert.equal(review.decisionEffects.publicAdmission, false);
});

test("official dam and water-storage figures remain infrastructure context, not reservoir geometry", () => {
  const bmb = review.sourceFindings.find((row) => row.sourceId === "denr-bmb-philchm-inland-wetlands-2019");
  const profile = review.sourceFindings.find((row) => row.sourceId === "cavite-ecological-profile-2024-fisheries");
  const nia = review.sourceFindings.find((row) => row.sourceId === "nia-calabarzon-tres-cruzes-dam-repair");
  assert.equal(bmb.sourceClass, "Water Storage");
  assert.equal(bmb.sourceReportedAreaHa, 15.65);
  assert.equal(profile.sourceAreaLabel, "Area Covered (In Has.)");
  assert.equal(profile.sourceReportedAreaHa, 911.1);
  assert.match(profile.interpretation, /not treated as reservoir surface area/i);
  assert.match(nia.project, /Tres Cruzes Dam/);
  assert.equal(nia.reportedStatus, "Completed");
  assert.match(review.nameAndKindCrosswalk.identityStatus, /unverified/);
  assert.equal(review.publicationApproval, false);
  assert.ok(review.sourceIds.every((sourceId) => registry.sources.some((source) => source.id === sourceId)));
  assert.equal(registry.sourceCount, 161);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sources.find((source) => source.id === "nia-calabarzon-tres-cruzes-dam-repair").publicationApproval, false);
});

test("exact GBIF source-name searches remain bounded zero-result screens, not absence claims", () => {
  const gbif = review.gbifScreen;
  assert.equal(gbif.country, "PH");
  assert.equal(gbif.taxonomy, "Catalogue of Life Extended Release Actinopterygii");
  assert.deepEqual(gbif.existingCanonicalNameQueries.fields, { waterBody: 0, locality: 0 });
  assert.equal(gbif.sourceSpellingFollowUp.queryCount, 2);
  assert.deepEqual(
    gbif.sourceSpellingFollowUp.queries.map((query) => [query.field, query.resultCount, query.enumeratedCount]),
    [["waterBody", 0, 0], ["locality", 0, 0]],
  );
  assert.ok(gbif.sourceSpellingFollowUp.queries.every((query) => query.httpStatus === 200 && query.endOfRecords));
  assert.ok(gbif.sourceSpellingFollowUp.queries.every((query) => /^[a-f0-9]{64}$/.test(query.rawResponse.sha256)));
  assert.match(gbif.interpretation, /not establish fish absence/i);
});

test("regional checkpoint hashes the reviewed source crosswalk and preserves the incomplete baseline", () => {
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.tresCruzesCrosswalkSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.waterbodyDenominatorEstablished, false);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
});
