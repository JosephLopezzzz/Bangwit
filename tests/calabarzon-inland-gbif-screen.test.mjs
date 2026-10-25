import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-inland-gbif-screen-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
]);

test("the exact-text screen covers every scoped CALABARZON lake and reservoir name string", () => {
  const inlandWaterbodies = scope.waterbodies.filter((row) => ["lake", "reservoir"].includes(row.kind));
  const expectedStrings = inlandWaterbodies.flatMap((row) => [row.name, ...(row.aliases ?? [])]);
  assert.equal(review.status, "exact-name-text-screen-complete;returned-records-unreviewed");
  assert.equal(review.regionId, scope.regionId);
  assert.equal(review.scopeSnapshot.waterbodyLeadCount, inlandWaterbodies.length);
  assert.equal(review.scopeSnapshot.searchStringCount, expectedStrings.length);
  // The byte hash pins the reviewed lead kinds and source-derived name spellings.
  assert.equal(review.scopeSnapshot.sha256, "50201270aa0c23cc3769423d0f7993faeac425a47be5be31358c295db2e29d0c");
  assert.deepEqual(
    new Set(review.searchTerms.map((row) => row.value)),
    new Set(expectedStrings),
    "Every current name and listed alias is screened, but a search string does not confirm an alias.",
  );
  const tresCruses = review.searchTerms.find((row) => row.value === "Lawa ng Tres Cruses");
  assert.equal(tresCruses.scopeLeadId, "ph-wb-tres-cruzes-cavite-lake");
  assert.equal(tresCruses.kind, "reservoir");
  assert.equal(tresCruses.queryLabel, "scope-alias-string");
  assert.equal(review.queries.length, expectedStrings.length * 2);
  assert.deepEqual(new Set(review.queries.map((row) => row.field)), new Set(["waterBody", "locality"]));
  for (const query of review.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.parameters.country, "PH");
    assert.equal(query.parameters.taxonKey, review.taxonomy.taxonKey);
    assert.equal(query.parameters.checklistKey, review.taxonomy.checklistKey);
    assert.equal(query.resultCount, query.enumeratedCount);
    assert.equal(query.endOfRecords, true);
    assert.ok(query.pages.length > 0);
    for (const page of query.pages) {
      assert.ok(page.rawResponse.bytes > 0);
      assert.match(page.rawResponse.sha256, /^[a-f0-9]{64}$/);
      assert.match(page.rawResponse.path, /^raw\/calabarzon-inland-gbif-screen-20261025\//);
    }
  }
});

test("GBIF candidates retain record-level source and quality fields without coordinate or presence claims", () => {
  assert.equal(review.summary.queryCount, 70);
  assert.equal(review.summary.successfulQueries, 70);
  assert.equal(review.summary.zeroResultQueries, 65);
  assert.equal(review.summary.positiveQueries, 5);
  assert.equal(review.summary.uniqueCandidateRecordCount, 77);
  assert.equal(review.summary.speciesRankRecordCount, 56);
  assert.deepEqual(
    review.queries
      .filter((row) => row.resultCount > 0)
      .map((row) => [row.scopeLeadId, row.searchValue, row.field, row.resultCount]),
    [
      ["ph-wb-taal-lake", "Taal Lake", "waterBody", 2],
      ["ph-wb-taal-lake", "Taal Lake", "locality", 2],
      ["ph-wb-taal-lake", "Lake Taal", "waterBody", 14],
      ["ph-wb-laguna-de-bay", "Laguna de Bay", "waterBody", 22],
      ["ph-wb-laguna-de-bay", "Laguna de Bay", "locality", 42],
    ],
  );
  assert.ok(review.records.every((row) => row.basisOfRecord === "PRESERVED_SPECIMEN"));
  assert.ok(review.records.some((row) => row.license?.includes("by-nc/4.0")));
  assert.ok(review.records.some((row) => row.license?.includes("by/4.0")));
  assert.ok(review.records.some((row) => row.license?.includes("publicdomain/zero/1.0")));
  for (const row of review.records) {
    assert.ok(row.queryMatches.length > 0);
    assert.ok(row.datasetKey);
    assert.ok(row.license);
    assert.ok(Array.isArray(row.issues));
    assert.equal(Object.hasOwn(row, "decimalLatitude"), false);
    assert.equal(Object.hasOwn(row, "decimalLongitude"), false);
  }
  assert.equal(review.decision.admittedSpeciesAssertions, 0);
  assert.equal(review.decision.publicRecordsAdded, 0);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.decision.zeroesUsedAsAbsence, false);
  assert.equal(review.decision.coordinatesIncludedInResearchRows, false);
});

test("the GBIF source registry records the screen and its local raw-response directory", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-inland-gbif-screen-20261025.json"));
  assert.ok(source.access.additionalRawPaths.includes("raw/calabarzon-inland-gbif-screen-20261025/"));
  assert.equal(registry.sourceCount, registry.sources.length);
});
