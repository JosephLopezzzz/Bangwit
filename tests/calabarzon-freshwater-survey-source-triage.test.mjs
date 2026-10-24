import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry] = await Promise.all([
  readFile(new URL("calabarzon-freshwater-survey-source-triage-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("primary survey leads are catalogued without copying species tables or claiming current presence", () => {
  assert.equal(review.status, "two-primary-laguna-survey-leads-confirmed;field-level-species-data-held-pending-rights-date-and-taxonomy-review");
  assert.deepEqual(review.surveys.map((row) => row.sourceId), review.sourceIds);
  assert.equal(review.surveys[0].collectionDate, null);
  assert.equal(review.surveys[0].sourceReports.includes("16 taxa"), true);
  assert.match(review.surveys[1].surveyPeriod, /2016-2017/);
  assert.match(review.surveys[1].sourceReports, /1,474 specimens, 15 species/);
  assert.equal(review.decision.speciesRowsTranscribed, 0);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.publicationApproval, false);
});

test("PJS and UKDR rights limitations remain attached to the source records", () => {
  assert.equal(registry.sourceCount, registry.sources.length);
  for (const sourceId of review.sourceIds) {
    const source = registry.sources.find((row) => row.id === sourceId);
    assert.ok(source, `Missing source registry entry: ${sourceId}`);
    assert.equal(source.publicationApproval, false);
    assert.ok(source.access.reviewFiles.includes("calabarzon-freshwater-survey-source-triage-20261024.json"));
  }
  const paller = registry.sources.find((row) => row.id === "paller-2011-makiling-fishes");
  const cui = registry.sources.find((row) => row.id === "cui-2022-santa-cruz-river-fish");
  assert.match(paller.reuse.metadata, /no item-level open reuse license/i);
  assert.match(cui.reuse.content, /assign article copyright to UKDR/i);
});
