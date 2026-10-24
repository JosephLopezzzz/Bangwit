import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry] = await Promise.all([
  readFile(new URL("calabarzon-dagatan-pagatan-identity-crosscheck-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("official locality evidence strengthens San Antonio Dagatan without resolving Pagatan identity", () => {
  assert.equal(review.status, "san-antonio-dagatan-locality-independently-confirmed;dagatan-pagatan-physical-crosswalk-unresolved");
  assert.deepEqual(review.sourceClaims[0].sourceLocality, "San Antonio, Quezon Province");
  assert.deepEqual(review.sourceClaims[1].sourceNames, ["Dagatan Lake", "Pagatan Lake"]);
  assert.equal(review.sourceClaims[2].reportedAreaHa, 3.22);
  assert.equal(review.sourceClaims[3].reportedAreaHa, 7);
  assert.match(review.comparison.sanAntonioDagatanAndPagatan, /physical identity remains unresolved/i);
  assert.equal(review.decision.sourceRefsAdded.length, 0);
  assert.equal(review.decision.scopeLeadsAdded, 0);
  assert.equal(review.decision.aliasesAdded, 0);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.ok(scope.waterbodies.some((row) => row.id === "ph-wb-dagatan-quezon-lake"));
  assert.ok(scope.waterbodies.some((row) => row.id === "ph-wb-pagatan-quezon-lake"));
});

test("source claims remain citation-only and registered with publication approval off", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  for (const sourceId of review.sourceIds) {
    const source = registry.sources.find((row) => row.id === sourceId);
    assert.ok(source, `Missing source registry entry: ${sourceId}`);
    assert.equal(source.publicationApproval, false);
  }
  assert.equal(review.decision.publicationApproval, false);
});
