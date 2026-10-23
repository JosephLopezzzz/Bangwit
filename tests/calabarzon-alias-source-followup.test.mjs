import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const research = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry] = await Promise.all([
  readFile(new URL("calabarzon-alias-source-followup-20261023.json", research), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", research), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", research), "utf8").then(JSON.parse),
]);

test("source-backed CALABARZON alias queries remain bounded and do not admit species", () => {
  assert.equal(review.batchId, "calabarzon-alias-source-followup-20261023");
  assert.equal(review.gbifFollowUp.queries.length, 6);
  assert.equal(review.summary.usableSpeciesAssertionsAdmitted, 0);
  assert.ok(
    review.gbifFollowUp.queries.every((query) => query.recordCount === 0 && query.enumeratedCount === 0),
  );
  assert.ok(
    review.gbifFollowUp.queries.every(
      (query) => query.apiUrl.includes("country=PH") && query.apiUrl.includes("limit=100"),
    ),
  );
  assert.ok(review.nonClaims.some((claim) => claim.includes("establishes fish absence")));

  for (const query of review.gbifFollowUp.queries) {
    assert.ok(scope.waterbodies.some((waterbody) => waterbody.id === query.waterbodyId));
    assert.ok(registry.sources.some((source) => source.id === query.supportingSourceId));
  }

  const ticub = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-ticub-quezon-lake");
  assert.ok(ticub.aliases.includes("Tikub Lake"));
  assert.ok(ticub.sourceRefs.includes("ajob-2014-tikub-freshwater-fish"));
  assert.equal(ticub.publicAdmission, false);

  const maragondon = review.alternativeSourceReviews.find(
    (source) => source.sourceId === "ijcs-2014-maragondon-goby-barcoding",
  );
  assert.equal(maragondon.admittedSpeciesAssertions, 0);
  assert.match(maragondon.decision, /hold/);
  assert.ok(maragondon.sourceFactsHeld.identityConflicts.length > 0);

  const tikubSource = registry.sources.find((source) => source.id === "ajob-2014-tikub-freshwater-fish");
  assert.equal(tikubSource.publicationApproval, false);
  assert.match(tikubSource.researchStatus, /rights-review-pending/);
});
