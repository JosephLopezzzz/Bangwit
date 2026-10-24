import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [crosswalk, review, scope, registry, report, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-bmb-2016-batangas-laguna-river-crosswalk-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-bmb-2016-batangas-laguna-river-gbif-screen-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
]);
const leadsById = new Map(scope.waterbodies.map((row) => [row.id, row]));
const gbif = registry.sources.find((source) => source.id === "gbif-occurrence-downloads");

test("selected Batangas and Laguna Atlas rows remain research leads, not fish assertions", () => {
  assert.equal(crosswalk.selectedRows.length, 20);
  assert.equal(crosswalk.selectedRows.filter((row) => row.province === "Batangas").length, 10);
  assert.equal(crosswalk.selectedRows.filter((row) => row.province === "Laguna").length, 10);
  assert.equal(crosswalk.decision.speciesAssertionsAdded, 0);
  assert.equal(crosswalk.decision.publicAdmission, false);
  assert.equal(crosswalk.decision.regionalBaselineComplete, false);
  assert.match(crosswalk.terms, /public-app and derived-database intended-use fit remains unreviewed/);
  assert.ok(crosswalk.selectedRows.some((row) => row.sourceName === "Lipa River*"));
  assert.ok(crosswalk.selectedRows.some((row) => row.sourceName === "San Cristobal River*"));
  assert.ok(crosswalk.heldCrosswalks.some((row) => row.sourceName === "San Juan River*"));

  for (const row of crosswalk.selectedRows) {
    const lead = leadsById.get(row.scopeLeadId);
    assert.ok(lead, `missing scope lead ${row.scopeLeadId}`);
    assert.equal(lead.name, row.scopeName);
    assert.ok(lead.sourceRefs.includes(crosswalk.sourceId));
    assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
    assert.equal(lead.boundaryStatus, "not-delineated");
    assert.equal(lead.salinity.classification, "unknown");
    assert.equal(lead.publicAdmission, false);
  }
});

test("GBIF screen retains the two candidates and geography conflict without admitting species", () => {
  assert.equal(review.queryCount, 40);
  assert.equal(review.successfulQueryCount, 40);
  assert.equal(review.zeroResultQueryCount, 37);
  assert.equal(review.nonzeroResultQueryCount, 3);
  assert.equal(review.resultCountTotal, 4);
  assert.equal(review.queries.length, 40);
  assert.equal(review.boundedZeroLeadIds.length, 18);
  assert.deepEqual(review.heldCandidateLeadIds, ["ph-wb-bay-laguna-river"]);
  assert.deepEqual(review.geographyConflictLeadIds, ["ph-wb-san-cristobal-river"]);
  assert.equal(review.candidateRecordReview.records.length, 3);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.absenceClaimAdded, false);
  assert.equal(review.decision.publicAdmission, false);

  for (const query of review.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.parameters.country, "PH");
    assert.equal(query.parameters.checklistKey, review.taxonomy.checklistKey);
    assert.equal(query.parameters.taxonKey, review.taxonomy.taxonKey);
    assert.ok(["waterBody", "locality"].includes(query.field));
    assert.match(query.rawResponse.sha256, /^[a-f0-9]{64}$/);
    assert.equal(query.truncated, false);
  }

  for (const id of review.boundedZeroLeadIds) {
    const lead = leadsById.get(id);
    assert.equal(lead.fishEvidenceStatus, "bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero; no-fish-absence-inferred");
    assert.equal(lead.reviewStatus, "bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero-no-absence-inferred");
  }

  const bay = leadsById.get("ph-wb-bay-laguna-river");
  assert.equal(bay.reviewStatus, "candidate-match-held-for-waterbody-identity");
  assert.match(bay.scopeNote, /3 km from Laguna de Bay/);
  const sanCristobal = leadsById.get("ph-wb-san-cristobal-river");
  assert.equal(sanCristobal.reviewStatus, "geography-conflict-held");
  assert.match(sanCristobal.scopeNote, /13,748 m uncertainty/);
  assert.equal(review.candidateRecordReview.dataset.doi, "10.15468/efh2ib");
  assert.equal(review.candidateRecordReview.dataset.license, "http://creativecommons.org/publicdomain/zero/1.0/legalcode");
  assert.match(review.candidateRecordReview.dataset.rawSnapshot.sha256, /^[a-f0-9]{64}$/);

  assert.ok(gbif.access.reviewFiles.includes("calabarzon-bmb-2016-batangas-laguna-river-gbif-screen-20261024.json"));
  assert.ok(gbif.access.additionalRawPaths.includes("raw/calabarzon-bmb-2016-batangas-laguna-gbif-screen-20261024/"));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
assert.equal(report.coverageSummary.sourceAssignments, 196);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 20);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 78);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.inputHashes.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
});
