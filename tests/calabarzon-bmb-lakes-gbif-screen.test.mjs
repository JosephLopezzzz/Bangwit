import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [screen, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-bmb-lakes-gbif-screen-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);
const byId = new Map(scope.waterbodies.map((row) => [row.id, row]));

test("new CALABARZON water and habitat leads have bounded, versioned zero-result fish screens", () => {
  assert.equal(screen.status, "32-bounded-name-field-screens-returned-zero;no-presence-or-absence-claim");
  assert.equal(screen.sourceId, "gbif-occurrence-downloads");
  assert.equal(screen.queryCount, 32);
  assert.equal(screen.successfulQueryCount, 32);
  assert.equal(screen.zeroResultQueryCount, 32);
  assert.equal(screen.resultCountTotal, 0);
  assert.equal(screen.initialRateLimitedQueryCount, 3);
  assert.equal(screen.searchTerms.length, 16);
  assert.equal(new Set(screen.searchTerms.flatMap((term) => term.scopeLeadIds)).size, 11);
  assert.equal(screen.taxonomy.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(screen.taxonomy.taxonKey, "8VR36");
  assert.equal(screen.decision.exactTextZeroesUsedAsAbsence, false);
  assert.equal(screen.decision.admittedSpeciesAssertions, 0);
  assert.equal(screen.decision.dietClaimsAdded, 0);
  assert.equal(screen.decision.geometryAdded, false);
  assert.equal(screen.decision.publicAppProjectionAdded, false);
  assert.equal(screen.decision.publicationApproval, false);

  assert.equal(screen.queries.filter((query) => query.field === "waterBody").length, 16);
  assert.equal(screen.queries.filter((query) => query.field === "locality").length, 16);
  for (const query of screen.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.parameters.country, "PH");
    assert.equal(query.parameters.taxonKey, screen.taxonomy.taxonKey);
    assert.equal(query.parameters.checklistKey, screen.taxonomy.checklistKey);
    assert.equal(query.parameters.limit, 100);
    assert.equal(query.resultCount, 0);
    assert.equal(query.returnedCount, 0);
    assert.equal(query.truncated, false);
    assert.ok(query.url.includes(`&${query.field}=`));
    assert.equal(query.scopeLeadIds.length, 1);
    assert.match(query.rawResponse.sha256, /^[a-f0-9]{64}$/);
    assert.ok(query.rawResponse.bytes > 0);
    assert.match(query.rawResponse.path, /^raw\/calabarzon-bmb-gbif-screen-20261024\//);
    const lead = byId.get(query.scopeLeadIds[0]);
    assert.ok(lead, `Missing scoped lead ${query.scopeLeadIds[0]}`);
    assert.ok(lead.sourceRefs.includes(screen.sourceId));
    assert.equal(lead.publicAdmission, false);
    assert.equal(lead.salinity.classification, "unknown");
    assert.match(lead.fishEvidenceStatus, /no-fish-absence-inferred/);
  }

  const candidateAliases = screen.searchTerms.filter((term) => term.crosswalkNote !== null);
  assert.deepEqual(
    candidateAliases.map((term) => term.value).sort(),
    ["Alligator Lake", "Alligator/Tadlac Lake", "Gunao Lake", "Pagatan Lake", "Podon Lake"].sort(),
  );
  assert.ok(candidateAliases.every((term) => /not adopted as a confirmed alias/i.test(term.crosswalkNote)));
  assert.match(screen.decision.interpretation, /do not establish fish absence/i);
  assert.match(screen.limitations[0], /Actinopterygii only/);
  assert.doesNotMatch(JSON.stringify(screen), /decimalLatitude|decimalLongitude|occurrenceID|catalogNumber/);

  const source = registry.sources.find((row) => row.id === screen.sourceId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-bmb-lakes-gbif-screen-20261024.json"));
  assert.ok(source.access.additionalRawPaths.includes("raw/calabarzon-bmb-gbif-screen-20261024/"));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 20);
  assert.equal(report.coverageSummary.sourceAssignments, 191);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
