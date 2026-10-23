import assert from "node:assert/strict";
import { test } from "node:test";
import { buildResearchStatus, readResearchInputs } from "../scripts/species/research-status.mjs";

const inputs = await readResearchInputs();

test("cross-file research inventory preserves rollout order, unknown regional counts and the Cavite public baseline", () => {
  const status = buildResearchStatus(inputs);
  assert.equal(status.regionsRegistered, 18);
  assert.equal(status.administrativeCoverageUnits, 130);
  assert.equal(status.nationalFreshwaterNameCandidates, 374);
  assert.equal(status.unassignedNationalCandidates, 374);
  assert.equal(status.checklistLocalityProposals, 6);
  assert.equal(status.broadBasinLocalityHolds, 1);
  assert.equal(status.taxonomyResponses, 374);
  assert.equal(status.taxonomyExactSpeciesProposals, 329);
  assert.equal(status.taxonomyExceptionProposals, 45);
  assert.equal(status.existingCaviteHistoricalRecords, 12);
  assert.equal(status.scopedChecklistLeadsReviewed, 7);
  assert.equal(status.preparedChecklistAssertions, 4);
  assert.equal(status.scopedChecklistHolds, 3);
  assert.equal(status.sourcesRegistered, 54);
  assert.equal(status.makilingGbifAssertionsPrepared, 1);
  assert.equal(status.makilingGbifOccurrenceRecords, 3);
  assert.equal(status.lagunaDeBaySpecimenAssertionsPrepared, 1);
  assert.equal(status.lagunaDeBaySpecimenRecords, 1);
  assert.equal(status.pansipitGbifAssertionsPrepared, 4);
  assert.equal(status.pansipitGbifOccurrenceRecords, 4);
  assert.equal(status.pendingRiverCandidates, 15);
  assert.equal(status.independentRiverIdentityChecks, 5);
  assert.equal(status.brackishSourceLeadsReviewed, 5);
  assert.equal(status.newFieldSurveyPublicAdmissions, 0);
  assert.equal(status.reviewedRegionalBaselines, 0);
  assert.equal(status.administrativeWorkbookVerification, "pending");
  assert.deepEqual(
    status.regions.map((region) => region.rolloutKey),
    ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "V1", "V2", "V3", "V4", "M1", "M2", "M3", "M4", "M5", "M6"],
  );
  assert.ok(status.regions.every((region) => !region.baselineReviewed && region.reviewedRegionalSpeciesCount === null));
  assert.equal(status.regions[0].scopedWaterbodyResearchLeads, inputs.scope.waterbodies.length);
  assert.ok(status.regions[0].scopedWaterbodyResearchLeads > 0);
  assert.ok(status.regions.slice(1).every((region) => region.workStatus === "queued"));
});

test("research status rejects a stale or expanded public checklist projection", () => {
  for (const mutate of [
    (data) => {
      data.taalProjection.records.pop();
    },
    (data) => {
      data.taalProjection.records[0].observationDate = "2023-06-09";
    },
    (data) => {
      data.decisions.counts.admittedAssertions = 5;
    },
  ]) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => buildResearchStatus(changed));
  }
});

test("national checklist cannot silently become reviewed taxonomy, regional evidence or a dated observation", () => {
  for (const mutation of [
    (row) => {
      row.publicationEligible = true;
    },
    (row) => {
      row.reviewStatus = "approved";
    },
    (row) => {
      row.regionIds = ["0400000000"];
    },
    (row) => {
      row.waterbodyIds = [inputs.scope.waterbodies[0].id];
    },
    (row) => {
      row.acceptedTaxonId = "unreviewed-authority-id";
    },
    (row) => {
      row.observationDate = "2023-06-09";
    },
  ]) {
    const changed = structuredClone(inputs);
    mutation(changed.freshwater.candidates[0]);
    assert.throws(() => buildResearchStatus(changed));
  }
});

test("scope references must resolve to the pinned administrative and source registries", () => {
  const cases = [
    (input) => {
      input.scope.regionId = "unknown-region";
    },
    (input) => {
      input.scope.waterbodies[0].sourceRefs.push("unknown-source");
    },
    (input) => {
      input.scope.waterbodies[0].administrativeAssociations[0].regionId = "unknown-region";
    },
    (input) => {
      input.scope.waterbodies[0].salinity.sourceRefs.push("unknown-source");
    },
    (input) => {
      input.scope.publicAdmission = true;
    },
    (input) => {
      input.scope.waterbodies[0].publicAdmission = true;
    },
    (input) => {
      input.scope.counts.publicRecordsAdmitted = 1;
    },
    (input) => {
      input.scope.counts.speciesAssertionsImported = 5;
    },
    (input) => {
      input.makilingGbifProjection.counts.speciesAssertions = 0;
    },
    (input) => {
      input.scope.administrativeScope.provinces.pop();
    },
    (input) => {
      input.scope.administrativeScope.independentCities = [];
    },
    (input) => {
      input.scope.initialReviewQueue[0].waterbodyIds.push("unknown-waterbody");
    },
    (input) => {
      input.freshwater.source.id = "unknown-source";
    },
  ];
  for (const mutate of cases) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => buildResearchStatus(changed));
  }
});

test("lost or duplicated research entries fail count and identity reconciliation", () => {
  const missing = structuredClone(inputs);
  missing.freshwater.candidates.pop();
  assert.throws(() => buildResearchStatus(missing), /count mismatch/);
  const duplicate = structuredClone(inputs);
  duplicate.freshwater.candidates[0] = structuredClone(duplicate.freshwater.candidates[1]);
  assert.throws(() => buildResearchStatus(duplicate), /Duplicate checklist candidate/);
});

test("source-scoped locality proposals cannot silently become dated observations or exact lake presence", () => {
  const cases = [
    (input) => {
      input.locality.proposals[0].proposedWaterbodyId = "ph-wb-manila-bay";
    },
    (input) => {
      input.locality.proposals[0].proposedWaterbodyId = "ph-wb-pandin-laguna-lake";
    },
    (input) => {
      input.locality.candidateArtifactSha256 = "wrong-snapshot";
    },
    (input) => {
      input.locality.proposals[0].reportedLocality = "Invented sampling station";
    },
    (input) => {
      input.locality.proposals[0].publicationEligible = true;
    },
    (input) => {
      input.locality.proposals[0].observationDate = "2023-06-09";
    },
    (input) => {
      input.locality.counts.publicRecordsAdmitted = 1;
    },
    (input) => {
      input.locality.proposals.find(
        (proposal) => proposal.localityReview === "hold-broad-basin-only",
      ).proposedWaterbodyId = "ph-wb-laguna-de-bay";
    },
  ];
  for (const mutate of cases) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => buildResearchStatus(changed));
  }
});

test("taxonomy summaries reject stale inputs, mixed namespaces, altered queries and silent adoption", () => {
  const cases = [
    (input) => {
      input.taxonomy.source.candidateArtifactSha256 = "old-snapshot";
    },
    (input) => {
      input.taxonomy.source.checklistKey = "legacy-GBIF";
    },
    (input) => {
      input.taxonomy.proposals[0].queryParameters.scientificName = "Another name";
    },
    (input) => {
      input.taxonomy.proposals[0].publicationEligible = true;
    },
    (input) => {
      input.taxonomy.proposals[0].acceptedTaxonId = "adopted-without-review";
    },
    (input) => {
      input.taxonomy.counts.adoptedTaxa = 1;
    },
    (input) => {
      input.taxonomy.counts.byClassification["exact-species"] += 1;
    },
  ];
  for (const mutate of cases) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => buildResearchStatus(changed));
  }
});
