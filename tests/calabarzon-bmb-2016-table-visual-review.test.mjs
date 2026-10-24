import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [visual, screen, scope, registry, report, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-bmb-2016-table-visual-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-bmb-2016-visual-followup-river-gbif-screen-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8"),
]);
const leads = new Map(scope.waterbodies.map((row) => [row.id, row]));
const atlas = registry.sources.find((source) => source.id === visual.sourceId);
const gbif = registry.sources.find((source) => source.id === screen.sourceId);

test("visual review resolves selected Atlas table columns and keeps unresolved feature identities held", () => {
  assert.deepEqual(visual.method.pages, [
    { pdfPage: 127, printedPage: 115 },
    { pdfPage: 128, printedPage: 116 },
    { pdfPage: 129, printedPage: 117 },
  ]);
  assert.equal(visual.newRows.length, 3);
  assert.equal(visual.decision.speciesAssertionsAdded, 0);
  assert.equal(visual.decision.geometryAdded, false);
  assert.equal(visual.decision.publicAdmission, false);
  assert.ok(visual.heldRows.some((row) => row.sourceNames.includes("Lian River")));
  assert.ok(visual.heldRows.some((row) => row.sourceNames.includes("Dumacaa-Tayabas River")));

  for (const id of ["ph-wb-binan-calabarzon-river", "ph-wb-san-juan-calabarzon-river", "ph-wb-binan-laguna-creek"]) {
    const lead = leads.get(id);
    assert.ok(lead, `missing lead ${id}`);
    assert.ok(lead.sourceRefs.includes(visual.sourceId));
    assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
    assert.equal(lead.boundaryStatus, "not-delineated");
    assert.equal(lead.salinity.classification, "unknown");
    assert.equal(lead.publicAdmission, false);
  }

  assert.equal(leads.get("ph-wb-binan-calabarzon-river").administrativeAssociations.length, 2);
  assert.equal(leads.get("ph-wb-san-juan-calabarzon-river").administrativeAssociations.length, 2);
  assert.equal(leads.get("ph-wb-binan-calabarzon-river").name, "Biñan River");
  assert.equal(leads.get("ph-wb-binan-laguna-creek").name, "Biñan Creek");
  assert.equal(screen.searchTerms.find((term) => term.scopeLeadId === "ph-wb-binan-calabarzon-river").value, "Biñan River");
  assert.match(leads.get("ph-wb-binan-calabarzon-river").scopeNote, /Carmonan/);
  assert.ok(leads.get("ph-wb-santa-rosa-laguna-river").administrativeAssociations.some((row) => row.provinceId === "0402100000"));
  assert.ok(leads.get("ph-wb-san-cristobal-river").administrativeAssociations.some((row) => row.provinceId === "0402100000"));
  assert.match(leads.get("ph-wb-pansol-laguna-river").scopeNote, /Los Baños/);
  assert.equal(atlas.access.visualReview, true);
  assert.deepEqual(atlas.access.visualReviewedPdfPages, [127, 128, 129]);
  assert.ok(atlas.access.reviewFiles.includes("calabarzon-bmb-2016-table-visual-review-20261024.json"));
});

test("new river and creek leads carry bounded zero searches, not fish-absence claims", () => {
  assert.equal(screen.queryCount, 6);
  assert.equal(screen.successfulQueryCount, 6);
  assert.equal(screen.zeroResultQueryCount, 6);
  assert.equal(screen.nonzeroResultQueryCount, 0);
  assert.equal(screen.resultCountTotal, 0);
  assert.equal(screen.searchTerms.length, 3);
  assert.equal(screen.decision.speciesAssertionsAdded, 0);
  assert.equal(screen.decision.absenceClaimAdded, false);
  assert.equal(screen.decision.publicAdmission, false);

  for (const query of screen.queries) {
    assert.equal(query.httpStatus, 200);
    assert.equal(query.resultCount, 0);
    assert.equal(query.returnedCount, 0);
    assert.equal(query.truncated, false);
    assert.equal(query.parameters.country, "PH");
    assert.equal(query.parameters.checklistKey, screen.taxonomy.checklistKey);
    assert.match(query.rawResponse.sha256, /^[a-f0-9]{64}$/);
  }

  for (const id of screen.decision.boundedZeroLeadIds) {
    assert.equal(leads.get(id).reviewStatus, "bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero-no-absence-inferred");
  }
  assert.ok(gbif.access.reviewFiles.includes("calabarzon-bmb-2016-visual-followup-river-gbif-screen-20261024.json"));
  assert.ok(gbif.access.additionalRawPaths.includes("raw/calabarzon-bmb-2016-visual-followup-gbif-20261024/"));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 83);
assert.equal(report.coverageSummary.sourceAssignments, 194);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 20);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 78);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.inputHashes.scopeSha256, createHash("sha256").update(scopeBytes).digest("hex"));
});
