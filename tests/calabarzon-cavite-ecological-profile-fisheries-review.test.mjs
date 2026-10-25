import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [reviewBytes, registryBytes, report] = await Promise.all([
  readFile(new URL("calabarzon-cavite-ecological-profile-fisheries-review-20261025.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
]);
const review = JSON.parse(reviewBytes.toString("utf8"));
const registry = JSON.parse(registryBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Cavite ecological profile catch labels remain common-name research leads", () => {
  assert.equal(review.sourceId, "cavite-ecological-profile-2024-fisheries");
  assert.equal(review.source.dataYear, 2024);
  assert.equal(review.reportedCatchLabels.length, 11);
  assert.ok(review.reportedCatchLabels.some((row) => row.sourceLabel === "Slipmouth (Sapsap)" && row.season === null));
  assert.ok(review.reportedCatchLabels.every((row) => !Object.hasOwn(row, "scientificName")));
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.scientificNamesAssigned, 0);
  assert.equal(review.decision.waterbodyAssignmentsAdded, 0);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.wildOccurrenceInferred, false);
  assert.equal(review.decision.catchabilityInferred, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.regionalBaselineComplete, false);
  assert.match(review.source.reuseStatus, /No item-specific reuse license was verified/);
  assert.match(review.scope.siteAttribution, /does not assign individual catch labels/);
});

test("Cavite profile is registered without inventing waterbody assignments", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, null);
  assert.match(source.researchStatus, /common-names-only/);
  assert.match(source.reuse.content, /common-name and season labels/);
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.sourcesSha256, sha256(registryBytes));
  assert.equal(report.inputHashes.caviteEcologicalProfileFisheriesSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
