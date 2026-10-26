import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import review from "../data/research/philippines/calabarzon-noveleta-mangrove-crosswalk-20261026.json" with { type: "json" };
import scope from "../data/research/philippines/calabarzon-scope.json" with { type: "json" };
import registry from "../data/research/philippines/sources.json" with { type: "json" };

test("Noveleta mangrove lead uses its DENR source and does not inherit Caliraya fish-screen results", async () => {
  const lead = scope.waterbodies.find((row) => row.id === review.scopeLeadId);
  const source = registry.sources.find((row) => row.id === review.sourceId);

  assert.ok(lead);
  assert.ok(source);
  assert.equal(review.source.publisher, "DENR CALABARZON");
  assert.equal(review.source.publishedOn, "2020-10-19");
  assert.equal(review.findings.assessmentStartDate, "2020-10-12");
  assert.equal(review.findings.reportedAreaStatements.length, 3);
  assert.ok(review.findings.reportedAreaStatements.every((entry) => entry.adoptedAsBoundary === false));
  assert.match(review.findings.biodiversityContext, /does not provide a fish list/i);
  assert.equal(review.scopeDecision.removedSourceReason.includes("Caliraya/Lumot"), true);
  assert.equal(review.scopeDecision.fishAssertionsAdded, 0);
  assert.equal(review.scopeDecision.publicAdmission, false);

  assert.deepEqual(lead.sourceRefs, ["denr-calabarzon-wetlands-2024", review.sourceId]);
  assert.deepEqual(lead.administrativeAssociations[0].sourceRefs, lead.sourceRefs);
  assert.equal(lead.fishEvidenceStatus, "not-reviewed");
  assert.equal(lead.boundaryStatus, "not-delineated");
  assert.equal(lead.publicAdmission, false);
  assert.match(lead.scopeNote, /no fish evidence/i);
  assert.equal(lead.sourceRefs.includes("gbif-caliraya-copepod-occurrences"), false);

  assert.equal(source.url, review.source.url);
  assert.equal(source.license, null);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.researchStatus, "site-and-area-claims-reviewed;waterbody-extent-and-fish-evidence-pending");
  assert.ok(source.access.reviewFiles.includes("calabarzon-noveleta-mangrove-crosswalk-20261026.json"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.ok(!("coordinates" in review));

  const reviewBytes = await readFile(
    new URL("../data/research/philippines/calabarzon-noveleta-mangrove-crosswalk-20261026.json", import.meta.url),
  );
  const report = JSON.parse(await readFile(new URL("../data/research/philippines/calabarzon-coverage-gap-report-20261025.json", import.meta.url), "utf8"));
  assert.equal(
    report.inputHashes.noveletaMangroveCrosswalkSha256,
    createHash("sha256").update(reviewBytes).digest("hex"),
  );
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 66);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 12);
});
