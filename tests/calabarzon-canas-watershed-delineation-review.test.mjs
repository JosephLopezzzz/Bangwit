import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, scope, report, registry] = await Promise.all([
  readFile(new URL("calabarzon-canas-watershed-delineation-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
]);

test("CvSU Cañas watershed thesis is a research-only GIS retrieval lead", () => {
  assert.equal(review.status, "official-CvSU-library-thesis-abstract-excerpt-reviewed;watershed-and-river-network-delineation-lead;no-GIS-layer-or-coordinates-retrieved;reuse-pending;research-only");
  assert.equal(review.source.access.fullThesisRetrieved, false);
  assert.equal(review.source.access.GISDeliverableRetrieved, false);
  assert.equal(review.sourceReportedScope.studyPeriod, "2015-07 to 2016-02");
  assert.ok(review.sourceReportedScope.reportedInputsAndMethods.some((x) => x.includes("Shuttle Radar")));
  assert.ok(review.sourceReportedScope.reportedInputsAndMethods.some((x) => x.includes("GPS")));
  assert.equal(review.decisions.GISGeometryAdded, false);
  assert.equal(review.decisions.fishOrOtherSpeciesAssertionsAdded, 0);
  assert.equal(review.reuse.publicationApproval, false);
  assert.equal(review.officialLibraryAccessPath.contactOrFormSubmitted, false);
});

test("Cañas scope cites the thesis without pretending geometry or regional coverage is complete", () => {
  const waterbody = scope.waterbodies.find((x) => x.id === review.waterbodyLeadId);
  const snapshot = report.waterbodySnapshot.find((x) => x.id === review.waterbodyLeadId);
  assert.ok(waterbody.sourceRefs.includes(review.sourceId));
  assert.ok(snapshot.sourceRefs.includes(review.sourceId));
  assert.equal(waterbody.boundaryStatus, "not-delineated");
  assert.equal(waterbody.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(registry.sources.find((x) => x.id === review.sourceId)?.publicationApproval, false);
});
