import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-mmors-aquaculture-food-system-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json", "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));
test("MMORS household study keeps cultured fish and market supply separate from wild river occurrence", () => {
  const [consumption, thesis] = review.sources;
  assert.equal(consumption.methodsAndScope.studyType, "Household food-consumption assessment and fishery/aquaculture context, not a taxonomic fish survey.");
  assert.equal(consumption.methodsAndScope.householdRespondents, 110);
  assert.equal(consumption.methodsAndScope.fishpondOperatorKeyInformants, 9);
  assert.equal(consumption.methodsAndScope.fishVendorKeyInformants, 7);
  assert.equal(consumption.methodsAndScope.speciesSamplingProtocol, null);
  assert.deepEqual(consumption.reportedProductionAndSupply.map(({ nameAsPrinted }) => nameAsPrinted), ["Chanos chanos", "Oreochromis niloticus", "Penaeus monodon"]);
  assert.match(consumption.sourceSeparation.join(" "), /outside Bulacan/);
  assert.equal(thesis.scopeAndMethods.wildOccurrenceEvidence, false);
  assert.deepEqual(thesis.reportedCulturedFish.map(({ nameAsPrinted }) => nameAsPrinted), ["Chanos chanos", "Sarotherodon melanotheron"]);
  assert.match(thesis.reportedCulturedFish[1].context, /does not establish a wild/);
});
test("Aquaculture and food-system mentions add no public MMORS occurrence or safety claims", () => {
  assert.equal(review.evidenceDisposition.wildOccurrenceCandidates, 0);
  assert.equal(review.evidenceDisposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(review.evidenceDisposition.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.evidenceDisposition.publicProjectionRowsAdded, 0);
  assert.equal(review.evidenceDisposition.safetyOrLegalClaimsAdded, 0);
  assert.equal(review.evidenceDisposition.publicationApproval, false);
  assert.ok(review.limitations.some((item) => item.includes("Fishpond or market production")));
  for (const sourceId of review.sources.map(({ sourceId }) => sourceId)) {
    const source = registry.sources.find((row) => row.id === sourceId);
    assert.ok(source, `missing registry source ${sourceId}`);
    assert.equal(source.publicationApproval, false);
  }
  const lead = checkpoint.waterbodyLeads.inlandAndBrackish.find(({ name }) => name === "Meycauayan-Obando river-fed aquaculture and household food-system context");
  assert.ok(lead);
  assert.equal(lead.geometryAdded, false);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.bulacanMeycauayanFoodSystemReviewFile, "central-luzon-bulacan-mmors-aquaculture-food-system-review-20261024.json");
});
