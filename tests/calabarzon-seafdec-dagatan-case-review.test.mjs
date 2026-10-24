import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, registry, report] = await Promise.all([
  readFile(new URL("calabarzon-seafdec-dagatan-case-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261024.json", base), "utf8").then(JSON.parse),
]);
const waterbodiesById = new Map(scope.waterbodies.map((row) => [row.id, row]));
const sourcesById = new Map(registry.sources.map((row) => [row.id, row]));

test("SEAFDEC case-study locality and coordinates remain source-reported, not mapped", () => {
  assert.equal(review.status, "official-seafdec-case-study-reviewed;source-coordinate-held-at-minute-precision;dagatan-pagatan-identity-unresolved");
  assert.equal(review.siteClaim.sourceReportedAreaHa, 7);
  assert.equal(review.siteClaim.sourceDescribedLocality, "San Antonio, Quezon Province");
  assert.equal(review.siteClaim.sourcePrintedCoordinates, "13 degrees 44 minutes N, 121 degrees 18 minutes E");
  assert.equal(review.siteClaim.coordinatePrecision, "rounded to whole minutes in the source");
  assert.match(review.siteClaim.coordinateDisposition, /not converted to a point/i);

  const tayabasDagatan = waterbodiesById.get("ph-wb-dagatan-quezon-lake");
  const sanAntonioPagatan = waterbodiesById.get("ph-wb-pagatan-quezon-lake");
  assert.ok(tayabasDagatan && sanAntonioPagatan);
  assert.ok(!tayabasDagatan.sourceRefs.includes(review.sourceId));
  assert.ok(!sanAntonioPagatan.sourceRefs.includes(review.sourceId));
  assert.equal(review.identityReview.candidateScopeLeadIds.length, 2);
  assert.match(review.identityReview.sanAntonioPagatanDisposition, /No crosswalk or source assignment is made/);
  assert.equal(review.decision.scopeLeadsAdded, 0);
  assert.deepEqual(review.decision.sourceRefsAdded, []);
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 80);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});

test("undated fish context and SEAFDEC rights do not become public occurrence evidence", () => {
  const source = sourcesById.get(review.sourceId);
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("calabarzon-seafdec-dagatan-case-review-20261024.json"));
  assert.equal(source.access.downloadedFile.bytes, review.sourceReceipt.bytes);
  assert.equal(source.access.downloadedFile.sha256, review.sourceReceipt.sha256);
  assert.match(source.reuse.metadata, /no item-specific open reuse license/i);
  assert.equal(source.publicationApproval, false);

  assert.equal(review.siteClaim.taxonMention.scientificNameAsPrinted, "Clarias macrocephalus");
  assert.equal(review.siteClaim.taxonMention.status, "held-undated-contextual-mention-not-an-admitted-occurrence");
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.dietClaimsAdded, 0);
  assert.equal(review.decision.geometryAdded, false);
  assert.equal(review.decision.publicAppProjectionAdded, false);
  assert.equal(review.decision.fishAbsenceClaimAdded, false);
});
