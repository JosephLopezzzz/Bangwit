import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, registry, roadmap] = await Promise.all([
  readFile(new URL("calabarzon-dagatan-pagatan-literature-crosswalk-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-wetland-roadmap-count-review-20261024.json", base), "utf8").then(JSON.parse),
]);

test("records the Pagatan/Dagatan name as a candidate crosswalk without adopting an alias or boundary", () => {
  assert.equal(review.candidateWaterbodyId, "ph-wb-pagatan-quezon-lake");
  assert.equal(review.candidateNameVariant, "Dagatan Lake");
  assert.equal(review.sources[0].reportedRow.lakeNameText, "Pagatan/Dagatan");
  assert.equal(review.sources[0].reportedRow.areaHa, 3.22);
  assert.match(review.assessment.candidateCrosswalk, /San Antonio alias plausible/i);
  assert.match(review.assessment.stillUnresolved, /separately prints Dagatan Lake and Pagatan Lake/i);
  assert.equal(review.decision.confirmedAliasesAdded, 0);
  assert.equal(review.decision.scopeLeadsChanged, false);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.fishAssertionsAdded, 0);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.regionalDenominatorResolved, false);
});

test("keeps the candidate in the DENR phrase crosswalk and records its non-commercial license", () => {
  const entry = roadmap.roadmapList.groups
    .flatMap((group) => group.entries)
    .find((row) => row.name === "Dagatan Lake");
  assert.equal(entry.existingScopeLeadId, "ph-wb-pagatan-quezon-lake");
  assert.match(entry.crosswalkStatus, /not adopted in the scope registry/i);
  assert.equal(roadmap.roadmapList.publishedNameEntryCount, 31);
  assert.equal(roadmap.roadmapList.distinctPhysicalWetlandCount, null);

  const source = registry.sources.find((row) => row.id === "brillo-2015-philippine-lake-studies");
  assert.ok(source);
  assert.match(source.reuse.metadata, /CC BY-NC 4\.0/i);
  assert.equal(source.publicationApproval, false);
});
