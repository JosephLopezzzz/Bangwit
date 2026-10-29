import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [screenBytes, crosswalkBytes, scopeBytes, sourcesBytes, reportBytes] = await Promise.all([
  readFile(new URL("calabarzon-wawa-gbif-screen-20261026.json", base)),
  readFile(new URL("calabarzon-wawa-canas-site-crosswalk-20261026.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
]);
const screen = JSON.parse(screenBytes);
const crosswalk = JSON.parse(crosswalkBytes);
const scope = JSON.parse(scopeBytes);
const sources = JSON.parse(sourcesBytes);
const report = JSON.parse(reportBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Rosario Wawa GBIF text screen is reproducible and does not infer absence", () => {
  assert.equal(screen.waterbodyId, "ph-wb-wawa-river-estuary-rosario-cavite");
  assert.equal(screen.queries.length, 5);
  assert.ok(screen.queries.every((query) => query.httpStatus === 200 && query.resultCount === 0));
  assert.equal(screen.summary.fishAbsenceInferred, false);
  assert.equal(screen.decisions.publicProjectionAdded, false);
  assert.equal(screen.decisions.waterbodyAssignmentsAdded, 0);
  assert.ok(screen.queries.every((query) => query.pages.every((page) => /^[a-f0-9]{64}$/.test(page.rawResponse.sha256))));
});

test("Cañas Wawa site remains distinct from the Rosario estuary and Rizal namesake", () => {
  assert.equal(crosswalk.identityAssessment.samePhysicalWatercourseConfirmed, false);
  assert.equal(crosswalk.identityAssessment.sameEstuaryConfirmed, false);
  assert.equal(crosswalk.decisions.shrimpCountsTransferredToEstuary, false);
  assert.equal(crosswalk.decisions.fishAssertionsAdded, 0);
  assert.equal(crosswalk.decisions.geometryAdded, false);
  assert.equal(crosswalk.decisions.publicAdmission, false);

  const lead = scope.waterbodies.find((row) => row.id === screen.waterbodyId);
  assert.ok(lead);
  assert.equal(lead.publicAdmission, false);
  assert.equal(lead.boundaryStatus, "not-delineated");
  assert.match(lead.reviewStatus, /identity-geometry-and-reuse-pending/);
  assert.ok(lead.sourceRefs.includes("gbif-occurrence-downloads"));
  assert.equal(screen.scopeSnapshot.sha256, sha256(scopeBytes));
});

test("Wawa source, review, and gap-checkpoint hashes agree", () => {
  const source = sources.sources.find((row) => row.id === "gbif-occurrence-downloads");
  assert.ok(source);
  assert.equal(sources.sourceCount, sources.sources.length);
  assert.ok(source.access.reviewFiles.includes("calabarzon-wawa-gbif-screen-20261026.json"));
  assert.ok(source.access.reviewFiles.includes("calabarzon-wawa-canas-site-crosswalk-20261026.json"));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourcesBytes));
  assert.equal(report.inputHashes.wawaGbifScreenSha256, sha256(screenBytes));
  assert.equal(report.inputHashes.wawaCanasSiteCrosswalkSha256, sha256(crosswalkBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, scope.waterbodies.length);
  assert.equal(report.coverageSummary.registeredSources, sources.sourceCount);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
});
