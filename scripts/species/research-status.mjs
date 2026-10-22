import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateAdministrativeRegistry } from "./build-administrative-registry.mjs";
import { CHECKLIST_KEY, queryFor } from "./match-freshwater-taxonomy.mjs";
import { buildTaalChecklistEvidence } from "./build-taal-checklist-evidence.mjs";
import { buildPalicoRiverEvidence, readPalicoRiverInputs } from "./build-palico-river-evidence.mjs";
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
  const regionIds = new Set(registry.regions.map((region) => region.id));
  const unitIds = new Set(registry.administrativeUnits.map((unit) => unit.code));
  const units = new Map(registry.administrativeUnits.map((unit) => [unit.code, unit]));
  const sourceIds = unique(sources.sources, "id", "source ID");
  assert.ok(regionIds.has(scope.regionId), "Unknown scope region");
  assert.ok(sourceIds.has(freshwater.source.id), "Checklist source is absent from the source registry");
  assert.equal(scope.publicAdmission, false, "This scope has no public admission approval");
  assert.equal(scope.counts.publicRecordsAdmitted, 0, "This scope has no admitted public records");
  assert.equal(scope.counts.speciesAssertionsImported, 0, "This scope contains identity leads, not species assertions");
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
      workStatus: region.id === scope.regionId ? "scoped-checklist-and-river-assertions-prepared" : "queued",
      baselineReviewed: false,
      reviewedRegionalSpeciesCount: null,
      coverageStatus:
        region.id === scope.regionId ? "partial-cavite-history-taal-and-palico-river" : "regional-review-pending",
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
    palicoRiverIdentityChecks:
      fieldSources.independent.taxonomyChecks.length + palicoRiverInputs.identityAddendum.checks.length,
    palicoRiverFamilyConflicts:
      fieldSummary.independentRiverFamilyConflicts + palicoRiverInputs.identityAddendum.counts.holds,
    ...fieldSummary,
    reviewedRegionalBaselines: 0,
    interpretation:
      "Raw candidates/proposals remain immutable research inputs. Four Taal checklist assertions and twelve Palico-Lian river-survey table assertions are prepared for the app; these are not current observations or completed regional coverage. Null reviewed regional counts are unknown, not absence. This status does not verify deployment.",
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
        `Palico review: ${status.palicoRiverIdentityChecks} WoRMS identity checks plus ten COL cross-checks; ${status.palicoRiverFamilyConflicts} source-family conflicts held. Brackish: ${status.brackishSourceLeadsReviewed} reviewed leads; ${status.preparedBrackishAssertions} admitted assertions.`,
      );
      console.log(
        `PSGC workbook verification: ${status.administrativeWorkbookVerification}; regional baselines reviewed: ${status.reviewedRegionalBaselines}.`,
      );
      console.table(
        status.regions.map(({ rolloutKey, name, workStatus, scopedWaterbodyResearchLeads }) => ({
          phase: rolloutKey,
          region: name,
          status: workStatus,
          waterbodyLeads: scopedWaterbodyResearchLeads,
        })),
      );
    }
  } catch (error) {
    console.error(`Species research inventory failed: ${error.message}`);
    process.exitCode = 1;
  }
}
