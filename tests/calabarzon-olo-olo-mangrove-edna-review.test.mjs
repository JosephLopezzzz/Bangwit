import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, profile, scopeBytes, registryBytes] = await Promise.all([
  readFile(new URL("calabarzon-olo-olo-mangrove-edna-review-20261031.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-denominator-profile-20261031.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
  readFile(new URL("sources.json", base), "utf8"),
]);

test("Olo-Olo eDNA findings stay site-scoped and research-only", () => {
  const waterbody = scope.waterbodies.find((item) => item.id === review.waterbodyId);
  const primarySource = registry.sources.find((source) => source.id === "nob-et-al-2026-mangrove-edna");
  const taxonomySource = registry.sources.find((source) => source.id === "calacademy-catalog-olo-olo-edna-taxonomy");

  assert.ok(waterbody);
  assert.equal(review.phaseId, "L1");
  assert.equal(review.site.administrativeLocalityAsReported, "Lobo, Batangas");
  assert.equal(review.reportedEvidence.speciesNamedInMainText.length, 2);
  assert.deepEqual(
    review.reportedEvidence.speciesNamedInMainText.map((item) => item.scientificNameAsReported),
    ["Epinephelus fuscoguttatus", "Hippocampus kuda"],
  );
  assert.match(review.reportedEvidence.siteMetric, /OTUs are not a species count/i);
  assert.match(review.supplementaryData.retrievalResult, /HTTP 403/i);
  assert.equal(review.supplementaryData.speciesTableDisposition.includes("transcribed"), true);
  assert.equal(review.decisions.normalizedSpeciesAssertionsAdded, 0);
  assert.equal(review.decisions.publicAppRowsAdded, 0);
  assert.equal(review.decisions.catchRecordsAdded, 0);
  assert.equal(review.decisions.salinityChanged, false);
  assert.equal(review.decisions.geometryAdded, false);
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.ok(waterbody.sourceRefs.includes("nob-et-al-2026-mangrove-edna"));
  assert.ok(primarySource.access.reviewFiles.includes("calabarzon-olo-olo-mangrove-edna-review-20261031.json"));
  assert.ok(taxonomySource);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(scope.counts.waterbodyResearchLeads, scope.waterbodies.length);
  assert.deepEqual(scope.counts.byKind, profile.denominator.byKind);
  assert.equal(profile.status, "research-only-coverage-audit");
  assert.equal(profile.provenance.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
  assert.equal(profile.provenance.sourceRegistrySha256, createHash("sha256").update(registryBytes).digest("hex"));
  assert.equal(profile.denominator.waterbodyResearchLeads, scope.waterbodies.length);
  assert.equal(profile.denominator.uniqueSourceReferences, new Set(scope.waterbodies.flatMap((item) => item.sourceRefs)).size);
  assert.equal(profile.existingScopeCounters.publicRecordsAdmitted, 0);
});
