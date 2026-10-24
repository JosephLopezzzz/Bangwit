import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-bmb-2016-river-gbif-screen-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
]);
const leadsById = new Map(scope.waterbodies.map((row) => [row.id, row]));
const gbif = registry.sources.find((source) => source.id === review.sourceId);

test("exact GBIF text searches record bounded zeroes without claiming fish absence", () => {
  assert.equal(review.status, "18-bounded-COLXR-exact-name-screens-returned-zero;no-presence-or-absence-claim");
  assert.equal(review.queryCount, 18);
  assert.equal(review.successfulQueryCount, 18);
  assert.equal(review.zeroResultQueryCount, 18);
  assert.equal(review.nonzeroResultQueryCount, 0);
  assert.equal(review.queries.length, 18);
  assert.equal(review.searchTerms.length, 9);
  assert.equal(review.taxonomy.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(review.taxonomy.taxonKey, "8VR36");
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.absenceClaimAdded, false);
  assert.equal(review.decision.publicAdmission, false);
  assert.match(review.interpretation, /does not show that fish are absent/i);

  for (const query of review.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.resultCount, 0);
    assert.equal(query.returnedCount, 0);
    assert.equal(query.truncated, false);
    assert.ok(["waterBody", "locality"].includes(query.field));
    assert.equal(query.parameters.country, "PH");
    assert.equal(query.parameters.checklistKey, review.taxonomy.checklistKey);
    assert.equal(query.parameters.taxonKey, review.taxonomy.taxonKey);
    assert.match(query.rawResponse.sha256, /^[a-f0-9]{64}$/);
  }

  for (const id of review.decision.scopeLeadIds) {
    const lead = leadsById.get(id);
    assert.ok(lead, `missing lead ${id}`);
    assert.equal(lead.fishEvidenceStatus, "bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero; no-fish-absence-inferred");
    assert.equal(lead.reviewStatus, review.decision.scopeReviewStatus);
    assert.equal(lead.salinity.classification, "unknown");
    assert.equal(lead.boundaryStatus, "not-delineated");
    assert.equal(lead.publicAdmission, false);
    assert.ok(lead.sourceRefs.includes("denr-bmb-inland-wetlands-atlas-2016"));
    assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
  }

  assert.ok(gbif.access.reviewFiles.includes("calabarzon-bmb-2016-river-gbif-screen-20261024.json"));
  assert.ok(gbif.access.additionalRawPaths.includes("raw/calabarzon-bmb-2016-river-gbif-screen-20261024/"));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 80);
  assert.equal(report.coverageSummary.sourceAssignments, 185);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 20);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 75);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.inputHashes.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
});
