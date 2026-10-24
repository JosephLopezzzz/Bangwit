import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, sources, report, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-quezon-wetland-and-dagatan-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
]);
const byId = new Map(scope.waterbodies.map((row) => [row.id, row]));
const sourcesById = new Map(sources.sources.map((row) => [row.id, row]));

test("Quezon wetland and Dagatan review preserves the evidence limits", () => {
  assert.equal(review.status, "three-source-backed-quezon-waterbody-leads-added;fish-names-held");
  assert.deepEqual(review.scopeChange.newLeadIds, [
    "ph-wb-dagatan-quezon-lake",
    "ph-wb-kalantasan-lopez-marsh",
    "ph-wb-lutang-lopez-marsh",
  ]);
  assert.equal(review.scopeChange.existingLeadAliasUpdated, "ph-wb-lalaguna-quezon-marsh");
  assert.equal(review.scopeChange.speciesAssertionsAdded, 0);
  assert.equal(review.scopeChange.dietClaimsAdded, 0);
  assert.equal(review.scopeChange.geometryAdded, false);
  assert.equal(review.scopeChange.publicAppProjectionAdded, false);
  assert.equal(review.scopeChange.publicationApproval, false);

  const cenro = sourcesById.get("denr-cenro-calauag-2026-asian-waterbird-census");
  const plan = sourcesById.get("denr-fasps-gefs-sgp5-terminal-evaluation-dagatan-annex");
  const roadmap = sourcesById.get("denr-calabarzon-wetlands-2024");
  assert.ok(cenro && plan && roadmap);
  assert.equal(cenro.access.status, "official-indexed-content-read-direct-fetch-403");
  assert.equal(cenro.publicationApproval, false);
  assert.equal(plan.access.pageCount, 214);
  assert.equal(plan.access.annexPageRange, "145-159");
  assert.equal(plan.access.downloadedFile.bytes, 14_606_348);
  assert.match(plan.access.downloadedFile.sha256, /^[a-f0-9]{64}$/);
  assert.equal(plan.publicationApproval, false);

  const lalaguna = byId.get("ph-wb-lalaguna-quezon-marsh");
  assert.ok(lalaguna.aliases.includes("Lalaguna Marshland"));
  assert.ok(lalaguna.sourceRefs.includes(cenro.id));
  for (const id of review.scopeChange.newLeadIds) {
    const waterbody = byId.get(id);
    assert.ok(waterbody, `Missing scoped lead ${id}`);
    assert.equal(waterbody.publicAdmission, false);
    assert.equal(waterbody.boundaryStatus, "not-delineated");
    assert.equal(waterbody.salinity.classification, "unknown");
  }

  const dagatan = byId.get("ph-wb-dagatan-quezon-lake");
  assert.equal(dagatan.kind, "lake");
  assert.deepEqual(review.dagatanLake.fishCommonNameCandidates, ["palos", "tilapia", "dalag", "hito", "baculi"]);
  assert.equal(review.dagatanLake.taxonomyResolution, "none; common names are ambiguous and no species-level crosswalk is adopted");
  assert.match(dagatan.fishEvidenceStatus, /no assertion/);
  assert.match(dagatan.reviewStatus, /item-rights-pending/);
  assert.equal(review.dagatanLake.geometry, "not delineated");
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 60);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.inputHashes.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
});
