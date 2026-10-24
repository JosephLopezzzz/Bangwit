import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-bmb-2016-atlas-river-crosswalk-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);
const leadsById = new Map(scope.waterbodies.map((row) => [row.id, row]));
const source = registry.sources.find((row) => row.id === review.sourceId);

test("BMB Atlas adds selected CALABARZON river leads without implying a complete inventory", () => {
  assert.equal(review.status, "selected-historical-river-leads-crosswalked;regional-inventory-incomplete;rights-limited");
  assert.equal(review.receipt.bytes, 61473809);
  assert.match(review.receipt.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.receipt.visualReview, false);
  assert.deepEqual(review.receipt.textReviewedPdfPages, [2, 127, 128, 129]);
  assert.equal(review.selectedRows.length, 10);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.match(source.reuse.metadata, /educational or non-profit purposes/i);
  assert.match(source.reuse.metadata, /public app and derived-database reuse remain unreviewed/i);
  assert.ok(source.access.reviewFiles.includes("calabarzon-bmb-2016-atlas-river-crosswalk-20261024.json"));

  for (const id of review.decision.newLeadIds) {
    const row = leadsById.get(id);
    assert.ok(row, `missing scope lead ${id}`);
    assert.equal(row.kind, "river");
    assert.equal(row.salinity.classification, "unknown");
    assert.equal(row.boundaryStatus, "not-delineated");
    assert.equal(row.fishEvidenceStatus, "bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero; no-fish-absence-inferred");
    assert.equal(row.reviewStatus, "bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero-no-absence-inferred");
    assert.equal(row.publicAdmission, false);
    assert.deepEqual(row.sourceRefs, [review.sourceId, "gbif-occurrence-downloads"]);
  }

  for (const id of review.decision.existingLeadIdsUpdated) {
    const row = leadsById.get(id);
    assert.ok(row?.sourceRefs.includes(review.sourceId), `missing Atlas citation on ${id}`);
  }

  const slashName = leadsById.get("ph-wb-ylang-ylang-rio-grande-river");
  assert.equal(slashName.name, "Ylang ylang/Rio Grande River");
  assert.deepEqual(slashName.aliases, []);
  assert.equal(leadsById.has("ph-wb-dumacaa-tayabas-river"), false);
  assert.match(review.heldCrosswalks.find((row) => row.sourceName === "Dumacaa-Tayabas River").disposition, /not split or merged/i);
  assert.match(review.method.asterisk, /without interpretation/i);

  assert.equal(scope.counts.waterbodyResearchLeads, 80);
  assert.equal(scope.counts.byKind.river, 38);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 80);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.dietClaimsAdded, 0);
  assert.equal(review.decision.geometryAdded, false);
});
