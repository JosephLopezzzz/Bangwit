import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, scope] = await Promise.all([
  readFile(new URL("calabarzon-pansipit-diet-study-rights-triage-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
]);

test("records a historical Pansipit gut-content source without copying diet rows into the app", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  const pansipit = scope.waterbodies.find((row) => row.id === review.waterbodyId);
  assert.ok(source);
  assert.ok(pansipit.sourceRefs.includes(source.id));
  assert.match(review.sourceFacts.surveyPeriod, /2012/);
  assert.match(review.sourceFacts.sampleScope, /juvenile fish.*12 species/i);
  assert.match(review.sourceFacts.dietMethod, /gut-content analysis/i);
  assert.match(review.rightsReview.decision, /unextracted and unpublished/i);
  assert.equal(review.decision.dietRowsTranscribed, 0);
  assert.equal(review.decision.dietAssertionsAdded, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(source.publicationApproval, false);
});

test("keeps diet evidence age-, location-, and life-stage-specific", () => {
  assert.match(review.sourceFacts.temporalLimit, /2012/);
  assert.match(review.nonClaims.join(" "), /not bait recommendations/i);
  assert.match(review.nonClaims.join(" "), /other inland, brackish, or marine waters/i);
});
