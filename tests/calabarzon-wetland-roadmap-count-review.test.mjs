import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewFile = "calabarzon-wetland-roadmap-count-review-20261024.json";
const [review, scope, registry] = await Promise.all([
  readFile(new URL(reviewFile, base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("CALABARZON wetland phrases remain separate from unresolved physical inventory", () => {
  const entries = review.roadmapList.groups.flatMap((group) => group.entries);
  assert.equal(review.status, "confirmed-name-list-count-discrepancy;physical-inventory-unresolved");
  assert.equal(review.roadmapList.headlineWetlandCount, 30);
  assert.equal(review.roadmapList.publishedNameEntryCount, 31);
  assert.equal(entries.length, 31);
  assert.equal(new Set(entries.map((entry) => entry.name)).size, 31);
  assert.deepEqual(
    review.roadmapList.groups.map((group) => group.count),
    [8, 5, 11, 1, 5, 1],
  );
  assert.equal(review.roadmapList.groups.reduce((sum, group) => sum + group.entries.length, 0), 31);

  const scopeIds = new Set(scope.waterbodies.map((waterbody) => waterbody.id));
  const matched = entries.filter((entry) => entry.existingScopeLeadId !== null);
  assert.equal(matched.length, 18);
  assert.ok(matched.every((entry) => scopeIds.has(entry.existingScopeLeadId)));
  const exactTextMatches = matched.filter((entry) =>
    scope.waterbodies.some(
      (waterbody) => waterbody.id === entry.existingScopeLeadId && waterbody.name === entry.name,
    ),
  );
  assert.equal(exactTextMatches.length, 16);
  const possibleAlias = entries.find((entry) => entry.name === "Laguna Lake");
  assert.equal(possibleAlias.existingScopeLeadId, "ph-wb-laguna-de-bay");
  assert.match(possibleAlias.crosswalkStatus, /Candidate alias/);
  const dagatanCandidate = entries.find((entry) => entry.name === "Dagatan Lake");
  assert.equal(dagatanCandidate.existingScopeLeadId, "ph-wb-pagatan-quezon-lake");
  assert.match(dagatanCandidate.crosswalkStatus, /Candidate alias/);
  assert.equal(entries.filter((entry) => entry.existingScopeLeadId === null).length, 13);
  assert.equal(review.roadmapList.scopeLeadsAdded, 0);
  assert.equal(review.roadmapList.distinctPhysicalWetlandCount, null);
  assert.equal(review.roadmapList.exactTextScopeLeadMatches, 16);
  assert.equal(review.roadmapList.candidateAliasCrosswalks, 2);
  assert.equal(review.roadmapList.unmatchedNameEntries, 13);
  assert.equal(
    entries.find((entry) => entry.name === "Maragondon River Sanctuary").existingScopeLeadId,
    null,
  );
  assert.equal(
    entries.find((entry) => entry.name === "Maragondon River Sanctuary").possibleRelatedScopeLeadId,
    "ph-wb-maragondon-river",
  );
});

test("historical aggregates and inaccessible report tables do not create app assertions", () => {
  const counters = review.historicalRegionalCounters;
  assert.equal(counters.inlandWetlands, 19);
  assert.equal(counters.lakes, 16);
  assert.equal(counters.waterStorageAreas, 3);
  assert.equal(counters.riverSystems, 354);
  assert.equal(counters.riverSystemsByProvince.reduce((sum, row) => sum + row.count, 0), 354);
  assert.equal(counters.namedWaterbodyInventoryRead, false);
  assert.equal(review["2025ReportCrossCheck"].tableRowsAvailableInIndexedText, false);
  assert.equal(review["2025ReportCrossCheck"].namedInventoryOrCountVerified, false);
  assert.equal(review.decision.denominatorEstablished, false);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.dietClaimsAdded, 0);
  assert.equal(review.decision.publicAppProjectionsAdded, 0);
  assert.equal(review.decision.publicationApproval, false);

  assert.equal(registry.sourceCount, registry.sources.length);
  for (const sourceId of review.sourceIds) {
    const source = registry.sources.find((candidate) => candidate.id === sourceId);
    assert.ok(source, `Missing source registry entry: ${sourceId}`);
    assert.ok(source.access.reviewFiles.includes(reviewFile));
    assert.equal(source.publicationApproval, false);
  }
});
