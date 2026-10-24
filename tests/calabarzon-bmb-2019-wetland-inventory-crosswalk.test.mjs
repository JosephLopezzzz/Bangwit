import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-bmb-2019-wetland-inventory-crosswalk-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);
const byId = new Map(scope.waterbodies.map((row) => [row.id, row]));
const sourcesById = new Map(registry.sources.map((row) => [row.id, row]));

test("BMB 2019 rows add historical waterbody leads without implying complete coverage", () => {
  assert.equal(review.status, "historical-bmb-inventory-crosswalked;new-waterbody-leads-added;dagatan-identity-conflict-held");
  assert.equal(review.bmbRows.length, 24);
  assert.equal(scope.counts.waterbodyResearchLeads, 60);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 60);
  assert.equal(report.coverageSummary.waterbodyDenominatorEstablished, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.boundaryGeometryValidated, 0);

  const bmb = sourcesById.get("denr-bmb-philchm-inland-wetlands-2019");
  const seafdec = sourcesById.get("seafdec-palmaa-bartolome-2016-fish-for-the-people");
  assert.ok(bmb && seafdec);
  assert.equal(bmb.publicationApproval, false);
  assert.equal(seafdec.publicationApproval, false);
  assert.equal(bmb.access.downloadedFile.bytes, 497255);
  assert.equal(bmb.access.downloadedFile.sha256, review.receipts[0].sha256);
  assert.equal(seafdec.access.downloadedFile.bytes, 909703);
  assert.equal(seafdec.access.downloadedFile.sha256, review.receipts[1].sha256);
  assert.match(bmb.reuse.metadata, /commercial use is strongly discouraged/i);
  assert.match(seafdec.reuse.metadata, /no item-specific open reuse license/i);

  for (const id of review.scopeChange.newLeadIds) {
    const row = byId.get(id);
    assert.ok(row, `Missing added lead ${id}`);
    assert.equal(row.publicAdmission, false);
    assert.equal(row.boundaryStatus, "not-delineated");
    assert.equal(row.salinity.classification, "unknown");
    assert.match(row.fishEvidenceStatus, /bounded-COLXR-Actinopterygii-waterBody-and-locality-text-screen-zero/);
    assert.ok(row.sourceRefs.includes("gbif-occurrence-downloads"));
  }

  const tayabasDagatan = byId.get("ph-wb-dagatan-quezon-lake");
  const sanAntonioPagatan = byId.get("ph-wb-pagatan-quezon-lake");
  assert.ok(tayabasDagatan.aliases.includes("Dagat Dagatan Lake"));
  assert.ok(tayabasDagatan.sourceRefs.includes(bmb.id));
  assert.ok(sanAntonioPagatan.sourceRefs.includes(bmb.id));
  assert.ok(!sanAntonioPagatan.sourceRefs.includes(seafdec.id));
  assert.deepEqual(review.dagatanPagatanIdentityConflict.cases.map((row) => row.reportedAreaHa), [24.38, 2, 7, 3.22]);
  assert.equal(review.heldFigureTaxa.length, 6);
  assert.ok(review.heldFigureTaxa.every((row) => /no local presence assertion/.test(row.status)));
  assert.equal(review.scopeChange.speciesAssertionsAdded, 0);
  assert.equal(review.scopeChange.dietClaimsAdded, 0);
  assert.equal(review.scopeChange.boundaryGeometryAdded, false);
  assert.equal(review.scopeChange.publicAppProjectionAdded, false);
  assert.equal(review.scopeChange.publicationApproval, false);
  assert.equal(report.nextStep.phaseId, "L1");
});

test("BMB and DENR waterbody rows preserve source classification and unresolved variants", () => {
  const tresCruzes = review.bmbRows.find((row) => row.sourceName === "Lawa ng Tres Cruses");
  assert.equal(tresCruzes.sourceClass, "Water Storage");
  assert.equal(tresCruzes.scopeLeadId, "ph-wb-tres-cruzes-cavite-lake");
  assert.match(tresCruzes.crosswalkNote, /classification conflict is held/i);

  const gunaw = review.bmbRows.find((row) => row.sourceName === "Gunaw Lake");
  assert.equal(gunaw.locality, "Dolores");
  assert.equal(gunaw.reportedAreaHa, 1.32);
  assert.equal(byId.get(gunaw.scopeLeadId).aliases.includes("Gunao Lake"), false);
  assert.equal(byId.get("ph-wb-gunaw-quezon-lake").sourceRefs.includes("denr-calabarzon-wetlands-2024"), true);

  const peatland = review.bmbRows.find((row) => row.sourceName === "Tan-ag Ilaya Peatland");
  assert.equal(peatland.sourceClass, "Peatland");
  assert.equal(peatland.reportedAreaHa, 99.18);
  assert.equal(byId.get(peatland.scopeLeadId).publicAdmission, false);
});
