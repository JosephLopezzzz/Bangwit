import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, speciesClaimReview, registry, scope, report, reviewBytes, speciesClaimBytes, registryBytes, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-maragondon-tilapia-study-review-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-maragondon-oreochromis-claim-review-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-maragondon-tilapia-study-review-20261025.json", base)),
  readFile(new URL("calabarzon-maragondon-oreochromis-claim-review-20261025.json", base)),
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

test("Maragondon Nile tilapia claim stays held pending specimen identification and reuse review", () => {
  const source = registry.sources.find((row) => row.id === speciesClaimReview.sourceId);
  const waterbody = scope.waterbodies.find((row) => row.id === speciesClaimReview.waterbodyId);
  assert.ok(source);
  assert.ok(waterbody);
  assert.equal(speciesClaimReview.status, "historical-species-level-source-claim-found;identification-and-reuse-unverified;not-admitted");
  assert.equal(speciesClaimReview.sourceClaim.sourceTaxonLabel, "Oreochromis niloticus (Tilapia)");
  assert.match(speciesClaimReview.comparison.finding, /Tilapia sp\./);
  assert.match(speciesClaimReview.comparison.interpretation, /do not resolve.*Oreochromis niloticus/i);
  assert.equal(speciesClaimReview.reuse.license, null);
  assert.equal(speciesClaimReview.decision.speciesAssertionsAdded, 0);
  assert.equal(speciesClaimReview.decision.publicAppProjectionAdded, false);
  assert.equal(source.license, null);
  assert.equal(source.publicationApproval, false);
  assert.ok(waterbody.sourceRefs.includes(speciesClaimReview.sourceId));
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(/14°|120°|decimalLatitude|decimalLongitude/i.test(speciesClaimBytes.toString("utf8")), false);
  assert.ok(report.evidenceReadout.historicalSpeciesLevelClaimsHeld.some((row) => row.waterbodyId === speciesClaimReview.waterbodyId));
  assert.ok(report.openGaps.some((row) => row.id === "maragondon-species-identification-and-reuse"));
});

test("CALABARZON checkpoint hashes and source counts include the Maragondon review", () => {
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.maragondonTilapiaStudySha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.maragondonOreochromisClaimReviewSha256, sha256(speciesClaimBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sources.length);
  const sourceRefs = scope.waterbodies.flatMap((waterbody) => waterbody.sourceRefs);
  assert.equal(report.coverageSummary.sourceAssignments, sourceRefs.length);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, new Set(sourceRefs).size);
  assert.equal(report.coverageSummary.waterbodyDenominatorEstablished, false);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.ok(report.evidenceReadout.historicalGenusLevelResearchEvidence.some((row) => row.waterbodyId === review.waterbodyId));
});
