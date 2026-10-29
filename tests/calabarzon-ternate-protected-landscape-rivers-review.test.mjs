import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const file = "calabarzon-ternate-protected-landscape-rivers-review-20261026.json";
const [review, scope, registry, report, reviewBytes, scopeBytes, sourceBytes] = await Promise.all([
  readFile(new URL(file, base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL(file, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("the Cavite profile contributes two named river leads without inventing locations or fish evidence", () => {
  assert.equal(review.status, "official-profile-names-confirmed;channel-location-geometry-fish-evidence-pending");
  assert.deepEqual(review.primarySourceFindings.riverNames.map((row) => row.name), ["Mamba/Cacabay River", "Palicpican River"]);
  assert.match(review.primarySourceFindings.riverNames[0].nameIdentity, /do not split/i);
  assert.match(review.primarySourceFindings.spatialPrecision, /no river coordinates/i);
  assert.equal(review.decisions.provinceOrMunicipalityAssigned, false);
  assert.equal(review.decisions.channelGeometryAdded, false);
  assert.equal(review.decisions.fishAssertionsAdded, 0);
  assert.equal(review.decisions.publicProjectionAdded, false);

  for (const id of review.decisions.researchLeadsAdded) {
    const lead = scope.waterbodies.find((row) => row.id === id);
    assert.ok(lead, `missing scoped waterbody ${id}`);
    assert.equal(lead.kind, "river");
    assert.equal(lead.salinity.classification, "unknown");
    assert.equal(lead.fishEvidenceStatus, "not-reviewed");
    assert.equal(lead.reviewStatus, "research-queued");
    assert.equal(lead.boundaryStatus, "not-delineated");
    assert.equal(lead.publicAdmission, false);
    assert.deepEqual(lead.sourceRefs, ["cavite-sepp-2014-protected-landscape-rivers"]);
    assert.equal(lead.administrativeAssociations[0].provinceId, undefined);
  }
});

test("the official-source review is registered and reflected in the incomplete coverage checkpoint", () => {
  const source = registry.sources.find((row) => row.id === "cavite-sepp-2014-protected-landscape-rivers");
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes(file));
  assert.equal(report.inputHashes.ternateProtectedLandscapeRiversSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 97);
  assert.equal(report.coverageSummary.byWaterbodyKind.river, 51);
  assert.equal(report.coverageSummary.leadsStillResearchQueued, 12);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 92);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.ok(report.openGaps.some((gap) => gap.id === "ternate-protected-landscape-river-location-and-evidence"));
});
