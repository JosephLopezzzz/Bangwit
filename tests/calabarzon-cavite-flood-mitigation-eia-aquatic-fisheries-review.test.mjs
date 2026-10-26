import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const reviewFile = "calabarzon-cavite-flood-mitigation-eia-aquatic-fisheries-review-20261026.json";
const [reviewBytes, scopeBytes, sourceBytes, reportBytes, jicaReviewBytes] = await Promise.all([
  readFile(new URL(reviewFile, base)),
  readFile(new URL("calabarzon-scope.json", base)),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base)),
  readFile(new URL("calabarzon-san-juan-jica-fish-evidence-review-20261026.json", base)),
]);
const review = JSON.parse(reviewBytes);
const scope = JSON.parse(scopeBytes);
const registry = JSON.parse(sourceBytes);
const report = JSON.parse(reportBytes);
const jicaReview = JSON.parse(jicaReviewBytes);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("JICA-hosted EIA records the dated four-station fishery matrix without asserting current presence", () => {
  assert.equal(review.status, "official-JICA-hosted-EIA-reviewed;2016-four-station-estuarine-fishery-matrix;Maalimango-mouth-locality-supported;taxonomy-partial;reuse-pending;research-only");
  assert.equal(review.source.documentDate, "2017-06-19");
  assert.equal(review.source.retrievalReceipt.httpStatus, 200);
  assert.equal(review.source.retrievalReceipt.bytes, 12_579_799);
  assert.equal(review.source.retrievalReceipt.pdfPageCount, 375);
  assert.match(review.source.retrievalReceipt.sha256, /^[a-f0-9]{64}$/);
  assert.equal(review.source.retrievalReceipt.temporaryCopyRetained, true);
  assert.equal(review.source.retrievalReceipt.temporaryCopyLocation, "local temporary storage outside repository");
  assert.deepEqual(review.aquaticEcologySurvey.assessmentDates, ["2016-03-02", "2016-04-07"]);
  assert.equal(review.aquaticEcologySurvey.fishDataBasis.includes("Direct observations and interviews"), true);
  assert.equal(review.stations.length, 4);
  assert.equal(review.fishMatrix.fishRowCount, 8);
  assert.equal(review.fishMatrix.taxa.length, 8);
  assert.equal(review.fishMatrix.taxa.filter((taxon) => taxon.sourceRank === "species").length, 5);
  assert.equal(review.fishMatrix.taxa.filter((taxon) => taxon.sourceRank === "genus").length, 3);
  assert.deepEqual(review.stations.map((station) => station.samplingDate), [
    "2016-03-02",
    "2016-03-02",
    "2016-04-07",
    "2016-03-02",
  ]);
  assert.deepEqual(review.stations.slice(0, 3).map((station) => station.waterbodyAssignment), [null, null, null]);
  assert.equal(review.stations[3].waterbodyAssignment, "ph-wb-maalimango-river-cavite");
  assert.equal(review.stations[3].sourceLocality, "Mouth of Maalimango River, Barangay Ligtong I, Rosario, Cavite");
  assert.deepEqual(review.stations[3].coordinateDecimalDegreesDerived, [120.87075, 14.431416666666667]);
  assert.equal(review.decisions.speciesAssertionsAddedToPublicApp, 0);
  assert.equal(review.decisions.currentPresenceInferred, false);
  assert.equal(review.decisions.wholeRiverSalinityClassified, false);
  assert.equal(review.decisions.channelGeometryAdded, false);
  assert.equal(review.rights.itemSpecificReuseTermsVerified, false);
  assert.equal(review.rights.publicationApproval, false);
});

test("source labels retain their rank and exact-name taxonomy matches do not validate field identifications", () => {
  const taxa = review.fishMatrix.taxa;
  assert.equal(taxa.find((taxon) => taxon.localName === "Tilapia").sourceScientificName, "Tilapia spp.");
  assert.equal(taxa.find((taxon) => taxon.localName === "Biya").sourceScientificName, "Ctenogobius sp.");
  assert.equal(taxa.find((taxon) => taxon.localName === "Banak").sourceScientificName, "Liza spp. or Mugil spp.");
  assert.equal(taxa.find((taxon) => taxon.localName === "Bagaong").gbifBackbone.acceptedScientificName, "Terapon jarbua (Forsskål, 1775)");
  assert.equal(taxa.find((taxon) => taxon.localName === "Bagaong").gbifBackbone.sourceStatus, "SYNONYM");
  assert.equal(review.taxonomyCrosscheck.fieldIdentificationIndependentlyVerified, false);

  const maalimango = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-maalimango-river-cavite");
  assert.ok(maalimango);
  assert.equal(maalimango.kind, "river");
  assert.equal(maalimango.salinity.classification, "unknown");
  assert.match(maalimango.salinity.reviewStatus, /mouth-station-only/);
  assert.equal(maalimango.boundaryStatus, "not-delineated");
  assert.equal(maalimango.publicAdmission, false);
  assert.deepEqual(maalimango.sourceRefs, [review.sourceId]);
});

test("the registry and regional snapshot pin the EIA review while keeping the JICA summary unassigned", () => {
  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes(reviewFile));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sourceCount, 173);
  assert.equal(review.scopeSnapshot.sha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.scopeSha256, sha256(scopeBytes));
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.caviteFloodMitigationEiaFishReviewSha256, sha256(reviewBytes));
  assert.equal(report.inputHashes.sanJuanJicaFishReviewSha256, sha256(jicaReviewBytes));
  assert.equal(report.coverageSummary.namedWaterbodyLeads, 95);
  assert.equal(report.coverageSummary.byWaterbodyKind.river, 50);
  assert.equal(report.coverageSummary.sourceAssignments, 243);
  assert.equal(report.coverageSummary.distinctSourceReferencesAssigned, 68);
  assert.equal(report.coverageSummary.registeredSources, 173);
  assert.equal(report.coverageSummary.unknownSalinityLeads, 90);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(jicaReview.geographicScope.sanJuanAttributionEstablished, false);
  assert.match(jicaReview.nextAction, /Maalimango River mouth/);
  const gap = report.openGaps.find((row) => row.id === "cavite-river-fish-geometry-and-locality");
  assert.ok(gap);
  assert.ok(gap.sourceRefs.includes(review.sourceId));
  assert.match(gap.nextAction, /Volume 3/i);
});
