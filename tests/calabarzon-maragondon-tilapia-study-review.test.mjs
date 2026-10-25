import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, scope, report, reviewBytes, registryBytes, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-maragondon-tilapia-study-review-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-maragondon-tilapia-study-review-20261025.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Maragondon tilapia article is retained as dated genus-level freshwater research only", () => {
  assert.equal(review.status, "historical-genus-level-fish-sampling-confirmed; species-identity-unresolved");
  assert.equal(review.sampling.sourceTaxonLabel, "Tilapia sp.");
  assert.equal(review.sampling.sampleCount, 48);
  assert.equal(review.sampling.collectionPeriod, "April 2023");
  assert.deepEqual(review.sampling.stations, ["upstream", "midstream", "downstream"]);
  assert.match(review.sampling.taxonomyLimit, /possible interspecific hybridization/i);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.taxonomicMatchesAdded, 0);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.catchabilityInferred, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
  assert.equal(/14°|120°|decimalLatitude|decimalLongitude/i.test(reviewBytes.toString("utf8")), false);
});

test("CC BY source and waterbody scope preserve attribution and research-only limits", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  const waterbody = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(source);
  assert.ok(waterbody);
  assert.equal(source.publicationApproval, false);
  assert.match(source.reuse.metadata, /CC BY 4\.0/i);
  assert.match(source.reuse.content, /genus-rank Tilapia sp\. sampling only/i);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.publicAdmission, false);
  assert.match(waterbody.fishEvidenceStatus, /genus-level-Tilapia-sampling-confirmed/);
});

test("CALABARZON checkpoint hashes and source counts include the Maragondon review", () => {
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.maragondonTilapiaStudySha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sources.length);
  const sourceRefs = scope.waterbodies.flatMap((waterbody) => waterbody.sourceRefs);
  assert.equal(report.coverageSummary.sourceAssignments, sourceRefs.length);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, new Set(sourceRefs).size);
  assert.equal(report.coverageSummary.waterbodyDenominatorEstablished, false);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.ok(report.evidenceReadout.historicalGenusLevelResearchEvidence.some((row) => row.waterbodyId === review.waterbodyId));
});
