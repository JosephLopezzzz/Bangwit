import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry] = await Promise.all([
  readFile(new URL("calabarzon-san-pablo-lakes-rights-alternative-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("San Pablo seven-lake source rights remain held and cultured tilapia evidence is not treated as wild assemblage data", () => {
  assert.equal(review.status, "rights-unresolved-alternative-not-equivalent");
  assert.equal(review.waterbodyIds.length, 7);
  assert.equal(review.primarySource.sourceId, "paller-2017-seven-lakes-fish");
  assert.equal(review.alternativeSource.sourceCandidateId, "pjs-2020-seven-lakes-cultured-tilapia-health");
  assert.ok(review.primarySource.sourceFactsReviewed.some((fact) => /2013/.test(fact)));
  assert.ok(review.primarySource.rightsDecision.includes("Do not copy or publish"));
  assert.ok(review.alternativeSource.sourceFactsReviewed.some((fact) => /84 cultured adult Nile tilapia/.test(fact)));
  assert.ok(review.alternativeSource.sourceFactsReviewed.some((fact) => /not a wild-fish assemblage inventory/.test(fact)));
  assert.equal(review.admission.speciesAssertions, 0);
  assert.equal(review.admission.publicAdmission, false);
  assert.equal(review.admission.appProjection, false);
  assert.equal(review.admission.wildOccurrenceInferredFromCulturedFish, false);
  assert.equal(registry.sourceCount, registry.sources.length);
  const primary = registry.sources.find((source) => source.id === review.primarySource.sourceId);
  assert.ok(primary);
  assert.equal(primary.publicationApproval, false);
});
