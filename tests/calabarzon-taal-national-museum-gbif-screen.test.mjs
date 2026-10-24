import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [screen, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-taal-national-museum-gbif-screen-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);

test("National Museum GBIF source is reusable but the bounded Taal search does not assert presence or absence", () => {
  assert.equal(screen.batchId, "calabarzon-taal-national-museum-gbif-screen-20261024");
  assert.equal(screen.sourceId, "asean-cb-national-museum-fish-collection-gbif");
  assert.equal(screen.dataset.gbifDatasetKey, "18896efa-22df-4fbd-9782-42f47257e753");
  assert.equal(screen.dataset.latestReviewedVersion, "1.38");
  assert.equal(screen.dataset.recordCount, 8225);
  assert.equal(screen.dataset.license, "CC-BY-4.0");
  assert.equal(screen.queryCount, 4);
  assert.equal(screen.successfulQueryCount, 4);
  assert.equal(screen.zeroResultQueryCount, 4);
  assert.equal(screen.nonzeroResultQueryCount, 0);
  assert.equal(screen.taxonomy.name, "Amphilophus citrinellus");
  assert.equal(screen.queries.map((query) => `${query.field}:${query.value}`).join("|"),
    "waterBody:Taal Lake|locality:Taal Lake|locality:Taal|scientificName:Amphilophus citrinellus");
  for (const query of screen.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.resultCount, 0);
    assert.equal(query.returnedCount, 0);
    assert.equal(query.truncated, false);
    assert.match(query.url, /^https:\/\/api\.gbif\.org\/v1\/occurrence\/search\?/);
    assert.equal(query.rawResponse.bytes, 79);
    assert.equal(query.rawResponse.sha256, "16004ddeb6b1eb033e3665fa6082d9cdd36533ce1f36272a2a95f5664f1b9dcd");
  }

  assert.equal(screen.decision.candidateOccurrenceRecords, 0);
  assert.equal(screen.decision.speciesAssertionsAdded, 0);
  assert.equal(screen.decision.absenceClaimAdded, false);
  assert.equal(screen.decision.geometryAdded, false);
  assert.equal(screen.decision.publicAppProjectionAdded, false);
  assert.equal(screen.decision.publicationApproval, false);
  assert.equal(screen.decision.regionalBaselineComplete, false);
  assert.match(screen.limitations[0], /do not demonstrate species absence/i);

  const source = registry.sources.find((row) => row.id === screen.sourceId);
  assert.ok(source);
  assert.equal(source.license, "CC-BY-4.0");
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes("calabarzon-taal-national-museum-gbif-screen-20261024.json"));
  const taal = scope.waterbodies.find((row) => row.id === "ph-wb-taal-lake");
  assert.ok(taal.sourceRefs.includes(screen.sourceId));
  assert.equal(taal.fishEvidenceStatus, "not-reviewed");
  assert.equal(taal.reviewStatus, "research-queued");
  assert.equal(taal.publicAdmission, false);

  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
  assert.equal(report.coverageSummary.registeredSources, 134);
  assert.equal(report.coverageSummary.sourceAssignments, 195);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 48);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
