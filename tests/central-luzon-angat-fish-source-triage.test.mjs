import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("central-luzon-angat-fish-source-triage-20261024.json", base), "utf8"));
const checkpoint = JSON.parse(await readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8"));

test("Angat-area source scopes and reported evidence remain distinct", () => {
  assert.equal(review.status, "historical-source-triage-research-only-not-app-ready");
  const sourceIds = new Set(review.sources.map(({ id }) => id));
  assert.equal(sourceIds.size, review.sources.length);
  assert.ok(review.waterbodyScopes.every(({ sourceIds: scopeSources }) => scopeSources.every((id) => sourceIds.has(id))));
  assert.equal(review.waterbodyScopes.length, 3);
  assert.deepEqual(review.waterbodyScopes.map(({ name }) => name), [
    "Angat Reservoir",
    "Norzagaray River, Matictic study reach",
    "Angat River Network, Bustos study reach",
  ]);

  const norzagaray = review.waterbodyScopes[1];
  assert.match(norzagaray.sourceReportedEvidence, /five stations/);
  assert.match(norzagaray.sourceReportedEvidence, /Glossogobius giuris/);
  assert.match(norzagaray.sourceReportedEvidence, /no sampling date or station coordinates/);

  const bustos = review.waterbodyScopes[2];
  assert.equal(bustos.sourceReportedTaxonStrings.length, 7);
  assert.match(bustos.qualityIssues.join(" "), /negative lead readings/);
  assert.match(bustos.qualityIssues.join(" "), /negative cadmium readings/);
  assert.deepEqual(bustos.negativeMeasurementAudit, {
    lead: { numericEntries: 32, negativeEntries: 28 },
    cadmium: { numericEntries: 32, negativeEntries: 32 },
  });
  assert.match(bustos.disposition, /Do not reproduce the table wholesale/);
  assert.equal(review.crossScopeReconciliation.scopesAreInterchangeable, false);
});

test("Angat source triage does not create current, safety, or app claims", () => {
  assert.equal(review.crossScopeReconciliation.currentOccurrenceEstablished, false);
  assert.equal(review.crossScopeReconciliation.completeAngatCatchmentChecklist, false);
  assert.equal(review.coverageAndAdmission.speciesRowsIndependentlyVerified, 0);
  assert.equal(review.coverageAndAdmission.acceptedTaxa, 0);
  assert.equal(review.coverageAndAdmission.speciesAssertionsAdded, 0);
  assert.equal(review.coverageAndAdmission.dietClaimsAdded, 0);
  assert.equal(review.coverageAndAdmission.foodSafetyClaimsAdded, 0);
  assert.equal(review.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(review.coverageAndAdmission.geometryAdded, false);
  assert.equal(review.coverageAndAdmission.coordinatesProjected, false);
  assert.equal(review.coverageAndAdmission.regionalReleaseApproved, false);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(checkpoint.angatFishSourceTriageFile, "central-luzon-angat-fish-source-triage-20261024.json");
  assert.match(checkpoint.nextStep.action, /Central Luzon source discovery/);
});
