import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateAdministrativeRegistry } from "./build-administrative-registry.mjs";
import { CHECKLIST_KEY, queryFor } from "./match-freshwater-taxonomy.mjs";
import { buildTaalChecklistEvidence } from "./build-taal-checklist-evidence.mjs";
import { buildPalicoRiverEvidence, readPalicoRiverInputs } from "./build-palico-river-evidence.mjs";
import { buildMakilingGbifEvidence } from "./build-makiling-gbif-evidence.mjs";
import { buildLagunaDeBaySpecimenEvidence } from "./build-laguna-de-bay-specimen-evidence.mjs";
import { buildPansipitRiverGbifEvidence } from "./build-pansipit-river-gbif-evidence.mjs";
import { buildTaalCasGbifEvidence } from "./build-taal-cas-gbif-evidence.mjs";
import { buildAngatGbifEvidence } from "./build-angat-gbif-evidence.mjs";
import { buildBulacanManilaBayEvidence } from "./build-bulacan-manila-bay-gbif-evidence.mjs";
import { readFieldSourceReviews, validateFieldSourceReviews } from "./check-field-source-reviews.mjs";

const root = new URL("../../", import.meta.url);
const research = new URL("data/research/philippines/", root);

const unique = (rows, key, label) => {
  const keys = rows.map((row) => row[key]);
  assert.ok(
    keys.every((value) => typeof value === "string" && value.trim()),
    `Missing ${label}`,
  );
  assert.equal(new Set(keys).size, keys.length, `Duplicate ${label}`);
  return new Set(keys);
};

/** Validates cross-file references and reports research progress without creating public claims. */
export function buildResearchStatus({
  registry,
  sources,
  scope,
  freshwater,
  historical,
  locality,
  taxonomy,
  independent,
  decisions,
  taalProjection,
  fieldSources,
  palicoRiverInputs,
  palicoRiverProjection,
  makilingGbifReview,
  makilingGbifProjection,
  lagunaDeBayReview,
  lagunaDeBayProjection,
  pansipitRiverGbifReview,
  pansipitRiverGbifProjection,
  taalCasGbifReview,
  taalCasGbifProjection,
  bulacanAngatGbifReview,
  bulacanAngatGbifProjection,
  bulacanManilaBayGbifReview,
  bulacanManilaBayGbifProjection,
  bulacanQifsProfile,
  centralLuzonCheckpoint,
  inputHashes,
}) {
  validateAdministrativeRegistry(registry);
  assert.equal(sources.sourceCount, sources.sources.length, "Source registry count mismatch");
  const fieldSummary = validateFieldSourceReviews({ ...fieldSources, sourceRegistry: sources, scope });
  const expectedPalicoProjection = buildPalicoRiverEvidence(palicoRiverInputs);
  assert.deepEqual(
    palicoRiverProjection,
    expectedPalicoProjection,
    "Palico public assertion projection differs from its scoped review ledger",
  );
  const expectedMakilingProjection = buildMakilingGbifEvidence(makilingGbifReview, inputHashes.makilingGbifReview);
  assert.deepEqual(
    makilingGbifProjection,
    expectedMakilingProjection,
    "Makiling GBIF projection differs from its scoped source review",
  );
  const expectedLagunaDeBayProjection = buildLagunaDeBaySpecimenEvidence(
    lagunaDeBayReview,
    inputHashes.lagunaDeBayReview,
  );
  assert.deepEqual(
    lagunaDeBayProjection,
    expectedLagunaDeBayProjection,
    "Laguna de Bay projection differs from its scoped specimen review",
  );
  const expectedPansipitProjection = buildPansipitRiverGbifEvidence(
    pansipitRiverGbifReview,
    inputHashes.pansipitRiverGbifReview,
  );
  assert.deepEqual(
    pansipitRiverGbifProjection,
    expectedPansipitProjection,
    "Pansipit River projection differs from its reviewed GBIF source ledger",
  );
  const expectedTaalCasProjection = buildTaalCasGbifEvidence(taalCasGbifReview, inputHashes.taalCasGbifReview);
  assert.deepEqual(
    taalCasGbifProjection,
    expectedTaalCasProjection,
    "Taal CAS projection differs from its reviewed GBIF source ledger",
  );
  const expectedAngatProjection = buildAngatGbifEvidence(
    bulacanAngatGbifReview,
    inputHashes.bulacanAngatGbifReview,
  );
  assert.deepEqual(
    bulacanAngatGbifProjection,
    expectedAngatProjection,
    "Angat historical projection differs from its reviewed GBIF source ledger",
  );
  const expectedBulacanManilaBayProjection = buildBulacanManilaBayEvidence(
    bulacanManilaBayGbifReview,
    inputHashes.bulacanManilaBayGbifReview,
  );
  assert.deepEqual(
    bulacanManilaBayGbifProjection,
    expectedBulacanManilaBayProjection,
    "Bulacan Manila Bay projection differs from its reviewed GBIF source ledger",
  );
  assert.equal(centralLuzonCheckpoint.phaseId, "L3", "Central Luzon checkpoint must remain in its rollout phase");
  assert.equal(centralLuzonCheckpoint.regionId, "0300000000", "Central Luzon checkpoint region mismatch");
  assert.equal(centralLuzonCheckpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(centralLuzonCheckpoint.administrativeCoverage.geometryVerified, false);
  assert.ok(Array.isArray(centralLuzonCheckpoint.waterbodyLeads.inlandAndBrackish));
  assert.ok(Array.isArray(centralLuzonCheckpoint.waterbodyLeads.coastalAndMarine));
  const centralLuzonDiscoveryLeads =
    centralLuzonCheckpoint.waterbodyLeads.inlandAndBrackish.length +
    centralLuzonCheckpoint.waterbodyLeads.coastalAndMarine.length;
  const regionIds = new Set(registry.regions.map((region) => region.id));
  const unitIds = new Set(registry.administrativeUnits.map((unit) => unit.code));
  const units = new Map(registry.administrativeUnits.map((unit) => [unit.code, unit]));
  const sourceIds = unique(sources.sources, "id", "source ID");
  assert.ok(sourceIds.has(bulacanAngatGbifReview.source.id), "Angat specimen source is absent from the source registry");
  assert.ok(
    sourceIds.has(bulacanAngatGbifReview.taxonomyReview.sourceId),
    "Angat taxonomy source is absent from the source registry",
  );
  assert.ok(sourceIds.has(bulacanManilaBayGbifReview.source.id), "Bulacan Manila Bay specimen source is absent");
  for (const record of bulacanManilaBayGbifReview.records) {
    assert.ok(sourceIds.has(record.taxonomyReview.sourceId), `Missing taxonomy source ${record.taxonomyReview.sourceId}`);
  }
  assert.equal(expectedBulacanManilaBayProjection.counts.speciesAssertions, 3);
  assert.equal(expectedBulacanManilaBayProjection.counts.sourceOccurrenceRecords, 3);
  assert.equal(bulacanQifsProfile.phaseId, "L3", "Bulacan QIFS profile must remain in Central Luzon");
  assert.equal(bulacanQifsProfile.provincePsgc, "0301400000");
  assert.equal(bulacanQifsProfile.status, "provincial-inland-catch-production-statistics;not-waterbody-species-inventory");
  assert.equal(bulacanQifsProfile.annualProductionRows.length, 38);
  assert.equal(bulacanQifsProfile.coverageAndAdmission.reportedCatchCategories, 34);
  assert.equal(bulacanQifsProfile.coverageAndAdmission.availableCatchCategoryValues, 23);
  assert.equal(bulacanQifsProfile.coverageAndAdmission.unavailableCatchCategoryValues, 11);
  assert.equal(bulacanQifsProfile.coverageAndAdmission.scientificTaxaCrosswalked, 0);
  assert.equal(bulacanQifsProfile.coverageAndAdmission.siteResolvedFishAssertionsAdded, 0);
  assert.equal(bulacanQifsProfile.coverageAndAdmission.appProjectionRowsAdded, 0);
  assert.equal(bulacanQifsProfile.annualProductionRows.find((row) => row.code === "000")?.metricTons, 2598.821);
  assert.ok(bulacanQifsProfile.annualProductionRows
    .filter((row) => row.type === "reported-catch-category")
    .every((row) => !Object.hasOwn(row, "scientificName")));
  for (const id of [
    bulacanQifsProfile.sources.officialOpenstat.sourceId,
    bulacanQifsProfile.sources.retrievalMirror.sourceId,
    bulacanQifsProfile.sources.officialAggregateCrosscheck.sourceId,
  ]) assert.ok(sourceIds.has(id), `Bulacan QIFS source is absent from the source registry: ${id}`);
  assert.ok(regionIds.has(scope.regionId), "Unknown scope region");
  assert.ok(sourceIds.has(freshwater.source.id), "Checklist source is absent from the source registry");
  assert.equal(scope.publicAdmission, false, "This scope has no public admission approval");
  assert.equal(scope.counts.publicRecordsAdmitted, 0, "This scope has no admitted public records");
  assert.equal(
    scope.counts.speciesAssertionsImported,
    expectedMakilingProjection.counts.speciesAssertions +
      expectedLagunaDeBayProjection.counts.speciesAssertions +
      expectedPansipitProjection.counts.speciesAssertions +
      expectedTaalCasProjection.counts.speciesAssertions,
    "Scoped species assertion count must match reviewed CALABARZON specimen projections",
  );
  assert.equal(scope.counts.waterbodyResearchLeads, scope.waterbodies.length, "Waterbody lead count mismatch");
  const waterbodyIds = unique(scope.waterbodies, "id", "waterbody ID");
  for (const [key, level] of [
    ["provinces", "province"],
    ["independentCities", "city"],
  ]) {
    const scopedUnits = scope.administrativeScope[key];
    unique(scopedUnits, "id", `scoped ${level} ID`);
    for (const unit of scopedUnits) {
      assert.equal(units.get(unit.id)?.level, level, `Unknown scoped ${level}: ${unit.id}`);
      assert.equal(units.get(unit.id).regionId, scope.regionId, `Scoped ${level} is in another region`);
      for (const id of unit.sourceRefs) assert.ok(sourceIds.has(id), `Unknown administrative source: ${id}`);
    }
  }
  const makilingWaterbody = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-molawin-makiling-creek");
  assert.ok(makilingWaterbody, "Makiling assertion waterbody is absent from the CALABARZON scope");
  assert.equal(makilingWaterbody.publicAdmission, false, "A text-locality assertion cannot admit a mapped waterbody");
  assert.ok(makilingWaterbody.evidenceBatchRefs.includes(expectedMakilingProjection.batchId));
  for (const source of expectedMakilingProjection.sources) {
    assert.ok(sourceIds.has(source.id), `Makiling dataset source is absent from the source registry: ${source.id}`);
  }
  for (const record of expectedMakilingProjection.assertions.flatMap((assertion) => assertion.records)) {
    assert.ok(sourceIds.has(record.datasetId), `Makiling occurrence dataset is not registered: ${record.datasetId}`);
  }
  const lagunaDeBayWaterbody = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-laguna-de-bay");
  assert.ok(lagunaDeBayWaterbody, "Laguna de Bay specimen assertion waterbody is absent from the CALABARZON scope");
  assert.equal(lagunaDeBayWaterbody.publicAdmission, false);
  assert.ok(lagunaDeBayWaterbody.evidenceBatchRefs.includes(expectedLagunaDeBayProjection.batchId));
  assert.ok(sourceIds.has(expectedLagunaDeBayProjection.source.id));
  const pansipitWaterbody = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-pansipit-river");
  assert.ok(pansipitWaterbody, "Pansipit River specimen assertions are absent from the CALABARZON scope");
  assert.equal(pansipitWaterbody.publicAdmission, false);
  assert.equal(pansipitWaterbody.salinity.classification, "unknown");
  assert.ok(pansipitWaterbody.evidenceBatchRefs.includes(expectedPansipitProjection.batchId));
  assert.ok(sourceIds.has(expectedPansipitProjection.source.id));
  const taalLake = scope.waterbodies.find((waterbody) => waterbody.id === "ph-wb-taal-lake");
  assert.ok(taalLake, "Taal Lake specimen assertions are absent from the CALABARZON scope");
  assert.equal(taalLake.publicAdmission, false);
  assert.ok(taalLake.sourceRefs.includes(expectedTaalCasProjection.source.id));
  assert.ok(taalLake.evidenceBatchRefs.includes(expectedTaalCasProjection.batchId));
  assert.ok(sourceIds.has(expectedTaalCasProjection.source.id));
  assert.deepEqual(
    scope.administrativeScope.provinces.map((unit) => unit.id).sort(),
    registry.administrativeUnits
      .filter((unit) => unit.level === "province" && unit.regionId === scope.regionId)
      .map((unit) => unit.code)
      .sort(),
    "Scope must account for every province in its region",
  );
  assert.deepEqual(
    scope.administrativeScope.independentCities.map((unit) => unit.id).sort(),
    registry.administrativeUnits
      .filter((unit) => unit.level === "city" && unit.coverageParentCode === scope.regionId)
      .map((unit) => unit.code)
      .sort(),
    "Scope must account for separately tracked city coverage units",
  );
  const waterbodiesById = new Map(scope.waterbodies.map((waterbody) => [waterbody.id, waterbody]));
  for (const waterbody of scope.waterbodies) {
    assert.equal(waterbody.publicAdmission, false, "Research waterbody cannot imply public admission");
    assert.ok(waterbody.sourceRefs.length, `Missing waterbody identity sources: ${waterbody.id}`);
    for (const id of waterbody.sourceRefs) assert.ok(sourceIds.has(id), `Unknown waterbody source: ${id}`);
    for (const association of waterbody.administrativeAssociations) {
      assert.ok(regionIds.has(association.regionId), `Unknown associated region: ${association.regionId}`);
      if (association.provinceId)
        assert.ok(unitIds.has(association.provinceId), `Unknown associated province: ${association.provinceId}`);
      if (association.cityId)
        assert.ok(unitIds.has(association.cityId), `Unknown associated city: ${association.cityId}`);
      for (const [key, level] of [
        ["provinceId", "province"],
        ["cityId", "city"],
      ]) {
        if (association[key]) {
          assert.equal(
            units.get(association[key]).level,
            level,
            `Wrong administrative association level: ${association[key]}`,
          );
          assert.equal(
            units.get(association[key]).regionId,
            association.regionId,
            `Conflicting administrative association: ${association[key]}`,
          );
        }
      }
      for (const id of association.sourceRefs) assert.ok(sourceIds.has(id), `Unknown association source: ${id}`);
    }
    for (const id of waterbody.salinity.sourceRefs) assert.ok(sourceIds.has(id), `Unknown salinity source: ${id}`);
  }
  for (const task of scope.initialReviewQueue) {
    for (const id of task.sourceIds) assert.ok(sourceIds.has(id), `Unknown queued source: ${id}`);
    for (const id of task.waterbodyIds) assert.ok(waterbodyIds.has(id), `Unknown queued waterbody: ${id}`);
  }
  assert.equal(freshwater.status, "research-candidates-only");
  assert.equal(freshwater.counts.candidateEntries, freshwater.candidates.length, "Candidate count mismatch");
  unique(freshwater.candidates, "id", "checklist candidate ID");
  unique(freshwater.candidates, "candidateName", "checklist candidate name");
  for (const candidate of freshwater.candidates) {
    assert.equal(candidate.sourceId, freshwater.source.id, "Candidate source mismatch");
    assert.equal(candidate.reviewStatus, "pending", "This initial extraction must remain pending");
    assert.equal(candidate.publicationEligible, false, "Unreviewed checklist candidate cannot be published");
    assert.equal(candidate.acceptedTaxonId, null, "Text extraction cannot establish accepted taxonomy");
    assert.deepEqual(candidate.regionIds, [], "National checklist cannot auto-populate regions");
    assert.deepEqual(candidate.waterbodyIds, [], "National checklist cannot auto-populate waterbodies");
    assert.equal(candidate.observationDate, null, "Publication date is not an observation date");
  }
  assert.equal(freshwater.counts.publishedRecords, 0);
  assert.equal(locality.status, "research-locality-proposals-only");
  assert.equal(locality.sourceId, freshwater.source.id);
  assert.equal(
    locality.candidateArtifactSha256,
    inputHashes.freshwater,
    "Locality proposals refer to a different candidate snapshot",
  );
  assert.equal(locality.sourceArchiveSha256, freshwater.source.archiveSha256);
  assert.equal(locality.counts.publicRecordsAdmitted, 0);
  assert.equal(locality.counts.acceptedTaxonomicDecisions, 0);
  assert.equal(locality.counts.reviewedNamedLocalityLeads, locality.proposals.length);
  unique(locality.proposals, "candidateId", "locality candidate ID");
  const candidatesById = new Map(freshwater.candidates.map((candidate) => [candidate.id, candidate]));
  for (const proposal of locality.proposals) {
    const candidate = candidatesById.get(proposal.candidateId);
    assert.ok(candidate, "Unknown locality candidate");
    assert.equal(proposal.sourceId, candidate.sourceId);
    assert.equal(proposal.sourceUrl, candidate.sourceUrl);
    assert.equal(proposal.sourceParagraph, candidate.sourceParagraph);
    assert.ok(
      candidate.verbatimEntry.includes(proposal.reportedLocality),
      "Locality wording is not present in the source entry",
    );
    assert.equal(proposal.publicationEligible, false);
    assert.equal(proposal.observationDate, null);
    if (proposal.proposedWaterbodyId) {
      assert.ok(waterbodyIds.has(proposal.proposedWaterbodyId), "Unknown proposed waterbody");
      assert.equal(proposal.localityReview, "explicit-named-lake-wording");
      const waterbody = waterbodiesById.get(proposal.proposedWaterbodyId);
      assert.equal(waterbody.kind, "lake", "A named-lake proposal cannot target a different habitat kind");
      const reportedName = proposal.reportedLocality.split(",")[0].trim().normalize("NFC").toLowerCase();
      assert.ok(
        [waterbody.name, ...waterbody.aliases].some((name) => name.normalize("NFC").toLowerCase() === reportedName),
        "Proposed lake identity does not match the reviewed locality wording",
      );
    } else assert.equal(proposal.localityReview, "hold-broad-basin-only");
  }
  assert.equal(
    locality.counts.namedLakeProposals,
    locality.proposals.filter((proposal) => proposal.proposedWaterbodyId !== null).length,
  );
  assert.equal(
    locality.counts.broadBasinHolds,
    locality.proposals.filter((proposal) => proposal.proposedWaterbodyId === null).length,
  );
  assert.ok(sourceIds.has(taxonomy.source.id), "Taxonomy source is absent from the source registry");
  assert.equal(taxonomy.source.checklistKey, CHECKLIST_KEY, "Taxonomy namespace mismatch");
  assert.equal(
    taxonomy.source.candidateArtifactSha256,
    inputHashes.freshwater,
    "Taxonomy proposals refer to another candidate snapshot",
  );
  assert.equal(taxonomy.counts.totalCandidates, freshwater.candidates.length);
  assert.equal(taxonomy.proposals.length, freshwater.candidates.length);
  unique(taxonomy.proposals, "candidateId", "taxonomy candidate ID");
  const classifications = {};
  for (const proposal of taxonomy.proposals) {
    const candidate = candidatesById.get(proposal.candidateId);
    assert.ok(candidate, "Unknown taxonomy candidate");
    assert.equal(proposal.sourceId, taxonomy.source.id);
    assert.deepEqual(
      proposal.queryParameters,
      queryFor(candidate),
      "Taxonomy query does not match the recorded name/family",
    );
    assert.equal(proposal.reviewStatus, "pending");
    assert.equal(proposal.publicationEligible, false);
    assert.equal(proposal.acceptedTaxonId, null);
    assert.deepEqual(proposal.regionIds, []);
    assert.deepEqual(proposal.waterbodyIds, []);
    assert.ok(["success", "failed", "unqueried"].includes(proposal.queryStatus));
    if (proposal.queryStatus === "success") assert.match(proposal.responseSha256, /^[0-9a-f]{64}$/);
    classifications[proposal.classification] = (classifications[proposal.classification] ?? 0) + 1;
  }
  assert.deepEqual(taxonomy.counts.byClassification, classifications, "Taxonomy classification count mismatch");
  for (const [count, state] of [
    ["successfulResponses", "success"],
    ["failedQueries", "failed"],
    ["unqueriedCandidates", "unqueried"],
  ]) {
    assert.equal(
      taxonomy.counts[count],
      taxonomy.proposals.filter((proposal) => proposal.queryStatus === state).length,
    );
  }
  assert.equal(taxonomy.counts.queriedCandidates, taxonomy.counts.successfulResponses + taxonomy.counts.failedQueries);
  assert.equal(taxonomy.counts.pendingReview, freshwater.candidates.length);
  assert.equal(taxonomy.counts.adoptedTaxa, 0);
  assert.equal(taxonomy.counts.publishedRecords, 0);
  assert.equal(
    taxonomy.status,
    taxonomy.counts.successfulResponses === freshwater.candidates.length && taxonomy.source.indexStableDuringRun
      ? "proposals-complete-review-pending"
      : "proposals-incomplete",
  );
  const reviewedProjection = buildTaalChecklistEvidence({
    candidates: freshwater,
    locality,
    taxonomy,
    independent,
    scope,
    sources,
    decisions,
    hashes: {
      candidates: inputHashes.freshwater,
      locality: inputHashes.locality,
      taxonomy: inputHashes.taxonomy,
      independent: inputHashes.independent,
    },
  });
  assert.deepEqual(taalProjection, reviewedProjection, "Taal public projection must match its scoped review");
  const regions = [...registry.regions]
    .sort((a, b) => a.rolloutOrder - b.rolloutOrder)
    .map((region) => ({
      id: region.id,
      name: region.name,
      rolloutGroup: region.rolloutGroup,
      rolloutKey: region.rolloutKey,
      administrativeCoverageUnits: registry.administrativeUnits.filter((unit) => unit.regionId === region.id).length,
      scopedWaterbodyResearchLeads: region.id === scope.regionId ? scope.waterbodies.length : 0,
      discoveryCheckpointLeads: region.id === centralLuzonCheckpoint.regionId ? centralLuzonDiscoveryLeads : 0,
      workStatus: region.id === centralLuzonCheckpoint.regionId
        ? "discovery-checkpoint-published-incomplete"
        : region.id === scope.regionId
        ? scope.status === "in-progress-incomplete-baseline"
          ? "coverage-gap-checkpoint-published-incomplete"
          : "scoped-checklist-and-multi-habitat-historical-evidence-prepared"
        : "queued",
      baselineReviewed: false,
      reviewedRegionalSpeciesCount: null,
      coverageStatus:
        region.id === centralLuzonCheckpoint.regionId
          ? "central-luzon-discovery-only-incomplete"
          : region.id === scope.regionId
          ? "partial-cavite-history-taal-palico-laguna-pansipit-and-makiling"
          : "regional-review-pending",
    }));
  return {
    schemaVersion: 1,
    status: "research-with-scoped-checklist-projection",
    administrativeSnapshot: registry.snapshotDate,
    administrativeWorkbookVerification: registry.source.workbookVerification,
    regionsRegistered: regions.length,
    administrativeCoverageUnits: registry.administrativeUnits.length,
    sourcesRegistered: sourceIds.size,
    nationalFreshwaterNameCandidates: freshwater.candidates.length,
    unassignedNationalCandidates: freshwater.candidates.length,
    checklistLocalityProposals: locality.counts.namedLakeProposals,
    broadBasinLocalityHolds: locality.counts.broadBasinHolds,
    taxonomyResponses: taxonomy.counts.successfulResponses,
    taxonomyExactSpeciesProposals: taxonomy.counts.byClassification["exact-species"] ?? 0,
    taxonomyExceptionProposals:
      taxonomy.counts.successfulResponses - (taxonomy.counts.byClassification["exact-species"] ?? 0),
    taxonomyMatchingIndex: taxonomy.source.matchingIndex.datasetAlias,
    existingCaviteHistoricalRecords: historical.records.length,
    scopedChecklistLeadsReviewed: decisions.records.length,
    preparedChecklistAssertions: reviewedProjection.records.length,
    scopedChecklistHolds: decisions.counts.heldLeads,
    palicoRiverSourceRowsReviewed: expectedPalicoProjection.counts.sourceRows,
    palicoRiverAssertionsPrepared: expectedPalicoProjection.counts.admittedAssertions,
    palicoRiverRowsHeld: expectedPalicoProjection.counts.heldRows,
    makilingGbifAssertionsPrepared: expectedMakilingProjection.counts.speciesAssertions,
    makilingGbifOccurrenceRecords: expectedMakilingProjection.counts.sourceOccurrenceRecords,
    lagunaDeBaySpecimenAssertionsPrepared: expectedLagunaDeBayProjection.counts.speciesAssertions,
    lagunaDeBaySpecimenRecords: expectedLagunaDeBayProjection.counts.specimenRecords,
    pansipitGbifAssertionsPrepared: expectedPansipitProjection.counts.speciesAssertions,
    pansipitGbifOccurrenceRecords: expectedPansipitProjection.counts.sourceOccurrenceRecords,
    taalCasGbifAssertionsPrepared: expectedTaalCasProjection.counts.speciesAssertions,
    taalCasGbifOccurrenceRecords: expectedTaalCasProjection.counts.sourceOccurrenceRecords,
    bulacanAngatGbifAssertionsPrepared: expectedAngatProjection.counts.speciesAssertions,
    bulacanAngatGbifOccurrenceRecords: expectedAngatProjection.counts.sourceOccurrenceRecords,
    bulacanManilaBayGbifAssertionsPrepared: expectedBulacanManilaBayProjection.counts.speciesAssertions,
    bulacanManilaBayGbifOccurrenceRecords: expectedBulacanManilaBayProjection.counts.sourceOccurrenceRecords,
    bulacanQifsReportedProductionCategories: bulacanQifsProfile.coverageAndAdmission.reportedCatchCategories,
    bulacanQifsAppProjectionRows: bulacanQifsProfile.coverageAndAdmission.appProjectionRowsAdded,
    palicoRiverIdentityChecks:
      fieldSources.independent.taxonomyChecks.length + palicoRiverInputs.identityAddendum.checks.length,
    palicoRiverFamilyConflicts:
      fieldSummary.independentRiverFamilyConflicts + palicoRiverInputs.identityAddendum.counts.holds,
    ...fieldSummary,
    reviewedRegionalBaselines: 0,
    interpretation:
      "Raw candidates/proposals remain immutable research inputs. Four Taal checklist assertions, three historical Taal CAS specimen-locality assertions, twelve Palico-Lian river-survey table assertions, one undated text-locality assertion for Molawin Creek, one dated specimen assertion for Laguna de Bay, four historical Pansipit River text-locality assertions, one 1929 Bulacan CAS specimen-locality assertion, and three historical 1982 Bulacan Manila Bay USNM specimen assertions are prepared for the app; these do not establish current presence or completed regional coverage. Null reviewed regional counts are unknown, not absence. This status does not verify deployment.",
    regions,
  };
}

export async function readResearchInputs() {
  const files = {
    registry: new URL("administrative-registry.json", research),
    sources: new URL("sources.json", research),
    scope: new URL("calabarzon-scope.json", research),
    freshwater: new URL("freshwater-checklist-candidates.json", research),
    locality: new URL("calabarzon-checklist-locality-review.json", research),
    taxonomy: new URL("freshwater-taxonomy-matches.json", research),
    independent: new URL("taal-taxonomy-review.json", research),
    decisions: new URL("taal-checklist-decisions.json", research),
    taalProjection: new URL("src/data/taal-checklist-evidence.json", root),
    historical: new URL("src/data/cavite-historical-evidence.json", root),
    makilingGbifReview: new URL("data/research/philippines/makiling-gbif-source-review.json", root),
    makilingGbifProjection: new URL("src/data/makiling-gbif-evidence.json", root),
    lagunaDeBayReview: new URL("data/research/philippines/laguna-de-bay-specimen-source-review.json", root),
    lagunaDeBayProjection: new URL("src/data/laguna-de-bay-specimen-evidence.json", root),
    pansipitRiverGbifReview: new URL("data/research/philippines/pansipit-river-gbif-source-review.json", root),
    pansipitRiverGbifProjection: new URL("src/data/pansipit-river-gbif-evidence.json", root),
    taalCasGbifReview: new URL(
      "data/research/philippines/calabarzon-taal-cas-gbif-source-review-20261024.json",
      root,
    ),
    taalCasGbifProjection: new URL("src/data/taal-cas-gbif-evidence.json", root),
    bulacanAngatGbifReview: new URL(
      "data/research/philippines/central-luzon-bulacan-angat-gbif-source-review-20261024.json",
      root,
    ),
    bulacanAngatGbifProjection: new URL("src/data/angat-gbif-species-evidence.json", root),
    bulacanManilaBayGbifReview: new URL(
      "data/research/philippines/central-luzon-bulacan-manila-bay-usnm-source-review-20261024.json",
      root,
    ),
    bulacanManilaBayGbifProjection: new URL("src/data/bulacan-manila-bay-gbif-evidence.json", root),
    bulacanQifsProfile: new URL(
      "data/research/philippines/central-luzon-bulacan-qifs-statistical-profile-20261024.json",
      root,
    ),
    centralLuzonCheckpoint: new URL("data/research/philippines/central-luzon-discovery-checkpoint-20261024.json", root),
  };
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, file]) => {
      const bytes = await readFile(file);
      return [
        key,
        { value: JSON.parse(bytes.toString("utf8")), sha256: createHash("sha256").update(bytes).digest("hex") },
      ];
    }),
  );
  return {
    ...Object.fromEntries(entries.map(([key, snapshot]) => [key, snapshot.value])),
    inputHashes: Object.fromEntries(entries.map(([key, snapshot]) => [key, snapshot.sha256])),
    fieldSources: await readFieldSourceReviews(),
    palicoRiverInputs: await readPalicoRiverInputs(),
    palicoRiverProjection: JSON.parse(
      await readFile(new URL("src/data/palico-river-survey-evidence.json", root), "utf8"),
    ),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const status = buildResearchStatus(await readResearchInputs());
    if (process.argv.includes("--json")) console.log(JSON.stringify(status, null, 2));
    else {
      console.log(
        `Research inventory: ${status.regionsRegistered} regions; ${status.administrativeCoverageUnits} administrative coverage units; ${status.sourcesRegistered} source references.`,
      );
      console.log(
        `Freshwater: ${status.nationalFreshwaterNameCandidates} frozen national name candidates; raw inputs retain no adopted regional/waterbody assignments.`,
      );
      console.log(
        `Scoped checklist review: ${status.scopedChecklistLeadsReviewed} leads; ${status.preparedChecklistAssertions} Taal assertions prepared; ${status.scopedChecklistHolds} holds excluded.`,
      );
      console.log(
        `Taxonomy: ${status.taxonomyResponses} responses (${status.taxonomyMatchingIndex}); ${status.taxonomyExactSpeciesProposals} exact and ${status.taxonomyExceptionProposals} exception proposals retained unchanged; batch decisions recorded separately.`,
      );
      console.log(
        `App evidence: existing Cavite historical records ${status.existingCaviteHistoricalRecords}; Taal checklist assertions ${status.preparedChecklistAssertions}; Palico-Lian river assertions ${status.palicoRiverAssertionsPrepared} (${status.palicoRiverRowsHeld} held). Deployment not verified.`,
      );
      console.log(
        `Makiling freshwater evidence: ${status.makilingGbifAssertionsPrepared} historical text-locality assertion from ${status.makilingGbifOccurrenceRecords} CC0 museum records; date/coordinates unknown.`,
      );
      console.log(
        `Laguna de Bay freshwater evidence: ${status.lagunaDeBaySpecimenAssertionsPrepared} dated specimen assertion(s) from ${status.lagunaDeBaySpecimenRecords} ADMU voucher record(s); corrected locality, no map point; noncommercial CC BY-NC 3.0 attribution.`,
      );
      console.log(
        `Pansipit River evidence: ${status.pansipitGbifAssertionsPrepared} historical locality assertions from ${status.pansipitGbifOccurrenceRecords} CC0 museum records; quality flags retained and shared coordinates withheld.`,
      );
      console.log(
        `Bulacan Angat evidence: ${status.bulacanAngatGbifAssertionsPrepared} historical text-locality assertion from ${status.bulacanAngatGbifOccurrenceRecords} CC0 CAS specimen record; no map point or current-presence claim.`,
      );
      console.log(
        `Bulacan Manila Bay evidence: ${status.bulacanManilaBayGbifAssertionsPrepared} historical 1982 text-locality assertions from ${status.bulacanManilaBayGbifOccurrenceRecords} CC0 Smithsonian records; no map point or current-presence claim.`,
      );
      console.log(
        `Bulacan PSA QIFS: ${status.bulacanQifsReportedProductionCategories} province-level catch categories; ${status.bulacanQifsAppProjectionRows} app rows; individual mirror values remain provisional.`,
      );
      console.log(
        `Palico review: ${status.palicoRiverIdentityChecks} WoRMS identity checks plus ten COL cross-checks; ${status.palicoRiverFamilyConflicts} source-family conflicts held. Brackish: ${status.brackishSourceLeadsReviewed} reviewed leads; ${status.preparedBrackishAssertions} admitted assertions.`,
      );
      console.log(
        `PSGC workbook verification: ${status.administrativeWorkbookVerification}; regional baselines reviewed: ${status.reviewedRegionalBaselines}.`,
      );
      console.table(
        status.regions.map(({ rolloutKey, name, workStatus, scopedWaterbodyResearchLeads, discoveryCheckpointLeads }) => ({
          phase: rolloutKey,
          region: name,
          status: workStatus,
          waterbodyLeads: scopedWaterbodyResearchLeads,
          discoveryLeads: discoveryCheckpointLeads,
        })),
      );
    }
  } catch (error) {
    console.error(`Species research inventory failed: ${error.message}`);
    process.exitCode = 1;
  }
}
