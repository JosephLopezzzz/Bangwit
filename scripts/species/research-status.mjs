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
  luzonCompletionManifest,
  luzonEvidenceIndex,
  sourceIdentityCrosswalk,
  calabarzonAdministrativeDenominator,
  calabarzonLocalityLinkageAudit,
  calabarzonLocalityLinkageAuditHistorical,
  calabarzonLocalitySourceBackedBatch,
  calabarzonLocalitySourceBackedBatch02,
  calabarzonLocalitySourceBackedBatch03,
  calabarzonLocalitySourceBackedBatch04,
  calabarzonLocalitySourceBackedBatch05,
  calabarzonLocalitySourceBackedBatch06,
  calabarzonLocalitySourceBackedBatch07,
  calabarzonLocalitySourceBackedBatch08,
  calabarzonLocalitySourceBackedBatch09,
  calabarzonLocalitySourceBackedBatch10,
  calabarzonTagbacSourceReview,
  calabarzonBcibWatercoursesReview,
  calabarzonBmbAtlasReview,
  calabarzonBmbBatangasLagunaReview,
  calabarzonBmbTableVisualReview,
  calabarzonBacoorInlandReview,
  calabarzonProtectedLandscapeReview,
  calabarzonBucalVariantReview,
  calabarzonLabayatVariantReview,
  calabarzonGapanReview,
  calabarzonGapanGeoNamesCrosscheck,
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
  assert.equal(
    calabarzonAdministrativeDenominator.reviewId,
    "calabarzon-administrative-denominator-reconciliation-20261117",
  );
  assert.equal(calabarzonLocalityLinkageAudit.reviewId, "calabarzon-locality-linkage-gap-audit-20261118");
  assert.equal(
    calabarzonLocalityLinkageAuditHistorical.reviewId,
    "calabarzon-locality-linkage-gap-audit-20261117",
  );
  const calabarzonDenominator = calabarzonAdministrativeDenominator.findings;
  assert.equal(calabarzonDenominator.localityRecordCount, 142);
  assert.equal(calabarzonDenominator.municipalityCount, 120);
  assert.equal(calabarzonDenominator.cityCount, 22);
  const calabarzonMunicipalityCodes = unique(
    calabarzonDenominator.provinces.flatMap((province) => province.municipalities),
    "psgcCode",
    "CALABARZON municipality PSGC code",
  );
  const calabarzonCityCodes = unique(
    [
      ...calabarzonDenominator.provinces.flatMap((province) => province.componentCities),
      ...calabarzonDenominator.separatelyAssignedStatisticalCities,
    ],
    "psgcCode",
    "CALABARZON city PSGC code",
  );
  assert.equal(calabarzonMunicipalityCodes.size, 120);
  assert.equal(calabarzonCityCodes.size, 22);
  assert.equal(calabarzonDenominator.provinces.length, 5);
  for (const id of calabarzonLocalityLinkageAudit.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON locality audit source: ${id}`);
  }
  const calabarzonManifestRegion = luzonCompletionManifest.regions.find((region) => region.rolloutKey === "L1");
  assert.ok(calabarzonManifestRegion, "Luzon manifest is missing CALABARZON L1");
  assert.ok(
    calabarzonManifestRegion.evidenceRefs.includes(
      "data/research/philippines/national/reviews/calabarzon-locality-linkage-gap-audit-20261118.json",
    ),
    "CALABARZON manifest must link its locality-linkage audit",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.calabarzonScope,
    inputHashes.scope,
    "CALABARZON locality audit scope hash is stale",
  );
  const currentCalabarzonAssociations = scope.waterbodies.flatMap((waterbody) =>
    (waterbody.administrativeAssociations ?? []).map((association) => ({ waterbodyId: waterbody.id, ...association })),
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.findings.scopeSnapshot.waterbodyResearchLeads,
    scope.waterbodies.length,
    "CALABARZON locality audit lead count is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.findings.administrativeAssociationRows,
    currentCalabarzonAssociations.length,
    "CALABARZON locality audit association count is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.findings.localityLinkage.municipalityCodesPresent,
    new Set(currentCalabarzonAssociations.map((association) => association.municipalityId).filter(Boolean)).size,
    "CALABARZON locality audit municipality-code count is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.findings.localityLinkage.cityCodesPresent,
    new Set(currentCalabarzonAssociations.map((association) => association.cityId).filter(Boolean)).size,
    "CALABARZON locality audit city-code count is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.administrativeDenominatorCrosswalk,
    inputHashes.calabarzonAdministrativeDenominator,
    "CALABARZON locality audit denominator hash is stale",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch.reviewId,
    "calabarzon-locality-source-backed-batch-20261117",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch02.snapshotHashes.scopeBeforeSecondBatch,
    "CALABARZON locality batch chain does not begin at the first batch output",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
    "CALABARZON locality batch denominator hash is stale",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch02.reviewId,
    "calabarzon-locality-source-backed-batch-20261117-02",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch02.snapshotHashes.calabarzonScope,
    calabarzonLocalityLinkageAuditHistorical.snapshotHashes.calabarzonScope,
    "CALABARZON second locality batch output does not match its historical audit snapshot",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch02.snapshotHashes.scopeBeforeSecondBatch,
    calabarzonLocalitySourceBackedBatch.snapshotHashes.calabarzonScope,
    "CALABARZON locality batch chain has an unexpected base scope hash",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch02.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
    "CALABARZON second locality batch denominator hash is stale",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch02.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch,
    "CALABARZON second locality batch does not pin the first batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch03.reviewId,
    "calabarzon-locality-source-backed-batch-20261118",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch03.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch04.snapshotHashes.scopeBeforeBatch,
    "CALABARZON third locality batch output does not match the fourth batch input",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch03.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch03.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch03.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch03.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch02,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch03.snapshotHashes.cenroSiteCrosswalk,
    inputHashes.calabarzonCenroSiteCrosswalk,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch03.counts.leadsUpdated, 3);
  assert.equal(calabarzonLocalitySourceBackedBatch03.counts.municipalityCodeAssignments, 3);

  assert.equal(
    calabarzonLocalitySourceBackedBatch04.reviewId,
    "calabarzon-locality-source-backed-batch-20261118-02",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch05.snapshotHashes.scopeBeforeBatch,
    "CALABARZON fourth locality batch output must feed the fifth locality batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch04.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch03,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.snapshotHashes.bmb2019WetlandCrosswalk,
    inputHashes.calabarzonBmb2019WetlandCrosswalk,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch04.counts.leadsUpdated, 6);
  assert.equal(calabarzonLocalitySourceBackedBatch04.counts.cityCodeAssignments, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch04.counts.municipalityCodeAssignments, 5);
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.counts.leadsWithCityOrMunicipalityCodeAfter,
    64,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.counts.leadsWithProvinceCodeButNoCityOrMunicipalityCodeAfter,
    96,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch04.counts.municipalityCodesPresentAfter,
    29,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.reviewId,
    "calabarzon-locality-source-backed-batch-20261118-03",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch06.snapshotHashes.scopeBeforeBatch,
    "CALABARZON fifth locality batch output must feed the sixth locality batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch05.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch04,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.snapshotHashes.yabahanCrosswalkReview,
    inputHashes.calabarzonYabahanCrosswalkReview,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch05.counts.leadsUpdated, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch05.counts.localityAssignments, 2);
  assert.equal(calabarzonLocalitySourceBackedBatch05.counts.municipalityCodeAssignments, 2);
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.counts.leadsWithCityOrMunicipalityCodeAfter,
    65,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch05.counts.municipalityCodesPresentAfter,
    30,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.reviewId,
    "calabarzon-locality-source-backed-batch-20261119",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.scopeBeforeBatch,
    "CALABARZON sixth locality batch output must feed the seventh locality batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch06.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch05,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.snapshotHashes.bmb2019WetlandCrosswalk,
    inputHashes.calabarzonBmb2019WetlandCrosswalk,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch06.counts.leadsUpdated, 6);
  assert.equal(calabarzonLocalitySourceBackedBatch06.counts.cityCodeAssignments, 6);
  assert.equal(calabarzonLocalitySourceBackedBatch06.counts.additionalAssociationRows, 0);
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.counts.leadsWithCityOrMunicipalityCodeAfter,
    71,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.counts.leadsWithProvinceCodeButNoCityOrMunicipalityCodeAfter,
    89,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch06.counts.cityCodesPresentAfter,
    14,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch06.counts.municipalityCodesPresentAfter, 30);
  assert.equal(calabarzonLocalitySourceBackedBatch06.counts.administrativeAssociationRowsAfter, 202);
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.reviewId,
    "calabarzon-locality-source-backed-batch-20261119-02",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.scopeBeforeBatch,
    "CALABARZON seventh locality batch output must feed the eighth locality batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch07.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch06,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.bmb2019WetlandCrosswalk,
    inputHashes.calabarzonBmb2019WetlandCrosswalk,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.administrativeRegistry,
    inputHashes.registry,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch07.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.leadsUpdated, 3);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.municipalityCodeAssignments, 5);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.additionalAssociationRows, 5);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.waterbodyResearchLeadsAfter, 164);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.administrativeAssociationRowsAfter, 207);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.leadsWithCityOrMunicipalityCodeAfter, 74);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.leadsWithProvinceCodeButNoCityOrMunicipalityCodeAfter, 86);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.cityCodesPresentAfter, 14);
  assert.equal(calabarzonLocalitySourceBackedBatch07.counts.municipalityCodesPresentAfter, 34);
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.reviewId,
    "calabarzon-locality-source-backed-batch-20261119-03",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.scopeBeforeBatch,
    "CALABARZON eighth locality batch output must feed the ninth locality batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch08.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch07,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.bmb2019WetlandCrosswalk,
    inputHashes.calabarzonBmb2019WetlandCrosswalk,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.administrativeRegistry,
    inputHashes.registry,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch08.counts.leadsUpdated, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch08.counts.cityCodeAssignments, 3);
  assert.equal(calabarzonLocalitySourceBackedBatch08.counts.municipalityCodeAssignments, 3);
  assert.equal(calabarzonLocalitySourceBackedBatch08.counts.additionalAssociationRows, 6);
  assert.equal(calabarzonLocalitySourceBackedBatch08.counts.waterbodyResearchLeadsAfter, 164);
  assert.equal(calabarzonLocalitySourceBackedBatch08.counts.administrativeAssociationRowsAfter, 213);
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.counts.leadsWithCityOrMunicipalityCodeAfter,
    75,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.counts.leadsWithProvinceCodeButNoCityOrMunicipalityCodeAfter,
    85,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.counts.cityCodesPresentAfter,
    15,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch08.counts.municipalityCodesPresentAfter,
    37,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.reviewId,
    "calabarzon-locality-source-backed-batch-20261119-04",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.calabarzonScope,
    calabarzonLocalitySourceBackedBatch10.snapshotHashes.scopeBeforeBatch,
    "CALABARZON ninth locality batch output must feed the tenth locality batch",
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch09.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch08,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.bmb2019WetlandCrosswalk,
    inputHashes.calabarzonBmb2019WetlandCrosswalk,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.administrativeRegistry,
    inputHashes.registry,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch09.counts.leadsUpdated, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch09.counts.municipalityCodeAssignments, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch09.counts.additionalAssociationRows, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch09.counts.waterbodyResearchLeadsAfter, 164);
  assert.equal(calabarzonLocalitySourceBackedBatch09.counts.administrativeAssociationRowsAfter, 214);
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.counts.leadsWithCityOrMunicipalityCodeAfter,
    76,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.counts.leadsWithProvinceCodeButNoCityOrMunicipalityCodeAfter,
    84,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.counts.cityCodesPresentAfter,
    15,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch09.counts.municipalityCodesPresentAfter,
    38,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.reviewId,
    "calabarzon-locality-source-backed-batch-20261119-05",
  );
  assert.equal(calabarzonLocalitySourceBackedBatch10.snapshotHashes.calabarzonScope, inputHashes.scope);
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.snapshotHashes.scopeBeforeBatch,
    calabarzonLocalityLinkageAudit.findings.sourceBackedLocalityBatch10.scopeBeforeBatchSha256,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.snapshotHashes.previousLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch09,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.snapshotHashes.bmb2019WetlandCrosswalk,
    inputHashes.calabarzonBmb2019WetlandCrosswalk,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.snapshotHashes.administrativeRegistry,
    inputHashes.registry,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.snapshotHashes.administrativeDenominator,
    inputHashes.calabarzonAdministrativeDenominator,
  );
  assert.equal(calabarzonLocalitySourceBackedBatch10.counts.leadsUpdated, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch10.counts.municipalityCodeAssignments, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch10.counts.additionalAssociationRows, 1);
  assert.equal(calabarzonLocalitySourceBackedBatch10.counts.waterbodyResearchLeadsAfter, 164);
  assert.equal(calabarzonLocalitySourceBackedBatch10.counts.administrativeAssociationRowsAfter, 215);
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.counts.leadsWithCityOrMunicipalityCodeAfter,
    calabarzonLocalityLinkageAudit.findings.localityLinkage.leadsWithCityOrMunicipalityCode,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.counts.leadsWithProvinceCodeButNoCityOrMunicipalityCodeAfter,
    calabarzonLocalityLinkageAudit.findings.localityLinkage.leadsWithProvinceCodeButNoCityOrMunicipalityCode,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.counts.cityCodesPresentAfter,
    calabarzonLocalityLinkageAudit.findings.localityLinkage.cityCodesPresent,
  );
  assert.equal(
    calabarzonLocalitySourceBackedBatch10.counts.municipalityCodesPresentAfter,
    calabarzonLocalityLinkageAudit.findings.localityLinkage.municipalityCodesPresent,
  );
  for (const [snapshotKey, hashKey] of [
    ["tagbacReview", "calabarzonTagbacSourceReview"],
    ["bcibWatercoursesReview", "calabarzonBcibWatercoursesReview"],
    ["bmbAtlasReview", "calabarzonBmbAtlasReview"],
    ["bmbBatangasLagunaReview", "calabarzonBmbBatangasLagunaReview"],
    ["bmbTableVisualReview", "calabarzonBmbTableVisualReview"],
    ["bacoorInlandReview", "calabarzonBacoorInlandReview"],
    ["mambaPalicpicanReview", "calabarzonProtectedLandscapeReview"],
    ["bucalVariantReview", "calabarzonBucalVariantReview"],
    ["labayatVariantReview", "calabarzonLabayatVariantReview"],
    ["gapanSourceReview", "calabarzonGapanReview"],
    ["gapanGeoNamesCrosscheck", "calabarzonGapanGeoNamesCrosscheck"],
  ]) {
    assert.equal(
      calabarzonLocalitySourceBackedBatch.snapshotHashes[snapshotKey],
      inputHashes[hashKey],
      `CALABARZON locality batch source-review hash is stale: ${snapshotKey}`,
    );
  }
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch,
    inputHashes.calabarzonLocalitySourceBackedBatch,
    "CALABARZON locality audit batch-review hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch02,
    inputHashes.calabarzonLocalitySourceBackedBatch02,
    "CALABARZON locality audit second-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch03,
    inputHashes.calabarzonLocalitySourceBackedBatch03,
    "CALABARZON locality audit third-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch04,
    inputHashes.calabarzonLocalitySourceBackedBatch04,
    "CALABARZON locality audit fourth-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch05,
    inputHashes.calabarzonLocalitySourceBackedBatch05,
    "CALABARZON locality audit fifth-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch06,
    inputHashes.calabarzonLocalitySourceBackedBatch06,
    "CALABARZON locality audit sixth-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch07,
    inputHashes.calabarzonLocalitySourceBackedBatch07,
    "CALABARZON locality audit seventh-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch08,
    inputHashes.calabarzonLocalitySourceBackedBatch08,
    "CALABARZON locality audit eighth-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch09,
    inputHashes.calabarzonLocalitySourceBackedBatch09,
    "CALABARZON locality audit ninth-batch hash is stale",
  );
  assert.equal(
    calabarzonLocalityLinkageAudit.snapshotHashes.sourceBackedLocalityBatch10,
    inputHashes.calabarzonLocalitySourceBackedBatch10,
    "CALABARZON locality audit tenth-batch hash is stale",
  );
  for (const id of calabarzonLocalitySourceBackedBatch.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch02.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON second locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch03.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON third locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch04.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON fourth locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch05.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON fifth locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch06.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON sixth locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch07.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON seventh locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch08.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON eighth locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch09.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON ninth locality batch source: ${id}`);
  }
  for (const id of calabarzonLocalitySourceBackedBatch10.sourceIds) {
    assert.ok(sourceIds.has(id), `Unknown CALABARZON tenth locality batch source: ${id}`);
  }
  for (const [key, hashKey] of [
    ["mambaPalicpicanSourceReview", "mambaPalicpicanSourceReview"],
    ["bucalNameVariantReview", "bucalNameVariantReview"],
    ["labayatNameVariantReview", "labayatNameVariantReview"],
  ]) {
    assert.equal(
      calabarzonLocalityLinkageAudit.snapshotHashes[key],
      inputHashes[hashKey],
      `CALABARZON locality audit review hash is stale: ${key}`,
    );
  }
  const linkedAuditDate = luzonCompletionManifest.evidenceAuditIndex?.match(/luzon-evidence-index-(\d{8})\.json$/)?.[1];
  assert.ok(linkedAuditDate, "Luzon completion manifest must link a dated evidence audit index");
  assert.ok(luzonEvidenceIndex.snapshotId.endsWith(linkedAuditDate), "Luzon evidence audit snapshot does not match the manifest link");
  assert.equal(luzonEvidenceIndex.summary.regionCount, luzonCompletionManifest.regions.length);
  assert.equal(luzonEvidenceIndex.summary.sourceRegistryUniqueIds, sourceIds.size);
  assert.equal(luzonEvidenceIndex.summary.brokenOrUnresolvedJsonReferences, 0);
  assert.equal(luzonEvidenceIndex.summary.missingSourceIdLinks, 0);
  assert.ok(luzonEvidenceIndex.reviews.some((review) => review.reviewId === sourceIdentityCrosswalk.reviewId));
  for (const group of sourceIdentityCrosswalk.groups) {
    for (const sourceId of group.sourceIds) assert.ok(sourceIds.has(sourceId), `Unknown identity-crosswalk source: ${sourceId}`);
  }
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
  assert.equal(calabarzonLocalitySourceBackedBatch.counts.leadsUpdated, 7);
  assert.equal(calabarzonLocalitySourceBackedBatch02.counts.leadsUpdatedThisBatch, 38);
  for (const assignment of [
    ...calabarzonLocalitySourceBackedBatch.assignments,
    ...calabarzonLocalitySourceBackedBatch02.assignments,
    ...calabarzonLocalitySourceBackedBatch03.assignments,
    ...calabarzonLocalitySourceBackedBatch04.assignments,
    ...calabarzonLocalitySourceBackedBatch05.assignments,
    ...calabarzonLocalitySourceBackedBatch06.assignments,
    ...calabarzonLocalitySourceBackedBatch07.assignments,
    ...calabarzonLocalitySourceBackedBatch08.assignments,
    ...calabarzonLocalitySourceBackedBatch09.assignments,
    ...calabarzonLocalitySourceBackedBatch10.assignments,
  ]) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(waterbody, `Unknown waterbody in CALABARZON locality batch: ${assignment.waterbodyId}`);
    for (const code of assignment.codes) {
      const key = code.level === "city" ? "cityId" : code.level === "municipality" ? "municipalityId" : null;
      assert.ok(key, `Unsupported locality code level in CALABARZON batch: ${code.level}`);
      assert.ok(
        waterbody.administrativeAssociations.some((association) => association[key] === code.psgcCode),
        `CALABARZON locality batch code is missing from scope: ${assignment.waterbodyId}/${code.psgcCode}`,
      );
    }
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch03.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association.municipalityId === assignment.codes[0].psgcCode &&
        association.locality === assignment.codes[0].locality,
      ),
      `CALABARZON third-batch locality text is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch04.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        (association.cityId === assignment.codes[0].psgcCode || association.municipalityId === assignment.codes[0].psgcCode) &&
        association.locality === assignment.codes[0].locality,
      ),
      `CALABARZON fourth-batch locality text is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch05.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association.municipalityId === assignment.codes[0].psgcCode &&
        association.sourceRefs.includes(assignment.sourceId) &&
        association.locality.includes(assignment.codes[0].name),
      ),
      `CALABARZON fifth-batch source locality is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch06.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association.cityId === assignment.codes[0].psgcCode &&
        association.locality === assignment.codes[0].locality &&
        association.sourceRefs.includes(assignment.sourceId),
      ),
      `CALABARZON sixth-batch source locality is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch07.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association.municipalityId === assignment.codes[0].psgcCode &&
        association.locality === assignment.codes[0].locality &&
        association.sourceRefs.includes(assignment.sourceId),
      ),
      `CALABARZON seventh-batch source locality is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch08.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    const code = assignment.codes[0];
    const key = code.level === "city" ? "cityId" : "municipalityId";
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association[key] === code.psgcCode &&
        association.locality === code.locality &&
        association.sourceRefs.includes(assignment.sourceId),
      ),
      `CALABARZON eighth-batch source locality is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch09.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association.municipalityId === assignment.codes[0].psgcCode &&
        association.locality === assignment.codes[0].locality &&
        association.sourceRefs.includes(assignment.sourceId),
      ),
      `CALABARZON ninth-batch source locality is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  for (const assignment of calabarzonLocalitySourceBackedBatch10.assignments) {
    const waterbody = waterbodiesById.get(assignment.waterbodyId);
    assert.ok(
      waterbody.administrativeAssociations.some((association) =>
        association.municipalityId === assignment.codes[0].psgcCode &&
        association.locality === assignment.codes[0].locality &&
        association.sourceRefs.includes(assignment.sourceId),
      ),
      `CALABARZON tenth-batch source locality is missing from scope: ${assignment.waterbodyId}`,
    );
  }
  const localityAssociations = scope.waterbodies.flatMap((waterbody) => waterbody.administrativeAssociations);
  const leadsWithProvinceCode = scope.waterbodies.filter((waterbody) =>
    waterbody.administrativeAssociations.some((association) => association.provinceId),
  ).length;
  const leadsWithCityCode = scope.waterbodies.filter((waterbody) =>
    waterbody.administrativeAssociations.some((association) => association.cityId),
  ).length;
  const leadsWithMunicipalityCode = scope.waterbodies.filter((waterbody) =>
    waterbody.administrativeAssociations.some((association) => association.municipalityId),
  ).length;
  const leadsWithoutLocalityCode = scope.waterbodies.filter((waterbody) =>
    !waterbody.administrativeAssociations.some((association) =>
      association.provinceId || association.cityId || association.municipalityId,
    ),
  ).length;
  const localityLinkageStatus = {
    waterbodyLeads: scope.waterbodies.length,
    administrativeAssociationRows: localityAssociations.length,
    leadsWithProvinceCode,
    leadsWithProvinceCodeButNoCityOrMunicipalityCode: scope.waterbodies.filter((waterbody) =>
      waterbody.administrativeAssociations.some((association) => association.provinceId) &&
      !waterbody.administrativeAssociations.some((association) => association.cityId || association.municipalityId),
    ).length,
    leadsWithCityOrMunicipalityCode: scope.waterbodies.filter((waterbody) =>
      waterbody.administrativeAssociations.some((association) => association.cityId || association.municipalityId),
    ).length,
    leadsWithCityCode,
    leadsWithMunicipalityCode,
    leadsWithoutProvinceCityOrMunicipalityCode: leadsWithoutLocalityCode,
    cityCodesPresent: new Set(
      localityAssociations.flatMap((association) => association.cityId ? [association.cityId] : []),
    ).size,
    cityCodesExpected: calabarzonCityCodes.size,
    municipalityCodesPresent: new Set(
      localityAssociations.flatMap((association) => association.municipalityId ? [association.municipalityId] : []),
    ).size,
    municipalityCodesExpected: calabarzonMunicipalityCodes.size,
    geometryValidated: calabarzonLocalityLinkageAudit.findings.scopeSnapshot.geometryValidated,
    publicRecordsAdmitted: calabarzonLocalityLinkageAudit.findings.scopeSnapshot.publicRecordsAdmitted,
    scopeFrozen: calabarzonManifestRegion.scopeFrozen,
  };
  assert.equal(
    localityLinkageStatus.waterbodyLeads,
    calabarzonLocalityLinkageAudit.findings.scopeSnapshot.waterbodyResearchLeads,
  );
  assert.equal(
    localityLinkageStatus.administrativeAssociationRows,
    calabarzonLocalityLinkageAudit.findings.administrativeAssociationRows,
  );
  for (const key of [
    "leadsWithProvinceCode",
    "leadsWithProvinceCodeButNoCityOrMunicipalityCode",
    "leadsWithCityOrMunicipalityCode",
    "leadsWithCityCode",
    "leadsWithMunicipalityCode",
    "leadsWithoutProvinceCityOrMunicipalityCode",
  ]) {
    assert.equal(
      localityLinkageStatus[key],
      calabarzonLocalityLinkageAudit.findings.localityLinkage[key],
      `CALABARZON locality audit drift: ${key}`,
    );
  }
  assert.equal(
    localityLinkageStatus.municipalityCodesExpected,
    calabarzonLocalityLinkageAudit.findings.workingPsgcDenominator.municipalityCount,
  );
  assert.equal(localityLinkageStatus.cityCodesPresent, calabarzonLocalityLinkageAudit.findings.localityLinkage.cityCodesPresent);
  assert.equal(localityLinkageStatus.cityCodesExpected, calabarzonLocalityLinkageAudit.findings.workingPsgcDenominator.cityCount);
  const historicalLocalityLinkage = calabarzonLocalityLinkageAuditHistorical.findings.localityLinkage;
  assert.equal(
    calabarzonLocalityLinkageAuditHistorical.findings.administrativeAssociationRows,
    calabarzonLocalitySourceBackedBatch02.counts.associationRowsAfterUpdate,
  );
  assert.equal(historicalLocalityLinkage.leadsWithCityCode, calabarzonLocalitySourceBackedBatch02.counts.cityCodedLeadsAfterUpdate);
  assert.equal(historicalLocalityLinkage.cityCodesPresent, calabarzonLocalitySourceBackedBatch02.counts.uniqueCityCodesPresentAfterUpdate);
  assert.equal(
    historicalLocalityLinkage.leadsWithMunicipalityCode,
    calabarzonLocalitySourceBackedBatch02.counts.municipalityCodedLeadsAfterUpdate,
  );
  assert.equal(
    historicalLocalityLinkage.municipalityCodesPresent,
    calabarzonLocalitySourceBackedBatch02.counts.uniqueMunicipalityCodesPresentAfterUpdate,
  );
  assert.equal(
    historicalLocalityLinkage.leadsWithProvinceCodeButNoCityOrMunicipalityCode,
    calabarzonLocalitySourceBackedBatch02.counts.leadsStillProvinceOnly,
  );
  assert.equal(
    historicalLocalityLinkage.leadsWithoutProvinceCityOrMunicipalityCode,
    calabarzonLocalitySourceBackedBatch02.counts.leadsStillWithoutAnyLocalityCode,
  );
  assert.equal(localityLinkageStatus.geometryValidated, 0);
  assert.equal(localityLinkageStatus.publicRecordsAdmitted, 0);
  for (const waterbody of scope.waterbodies) {
    assert.equal(waterbody.publicAdmission, false, "Research waterbody cannot imply public admission");
    assert.ok(waterbody.sourceRefs.length, `Missing waterbody identity sources: ${waterbody.id}`);
    for (const id of waterbody.sourceRefs) assert.ok(sourceIds.has(id), `Unknown waterbody source: ${id}`);
    for (const association of waterbody.administrativeAssociations) {
      assert.ok(regionIds.has(association.regionId), `Unknown associated region: ${association.regionId}`);
      if (association.provinceId)
        assert.ok(unitIds.has(association.provinceId), `Unknown associated province: ${association.provinceId}`);
      if (association.cityId)
        assert.ok(
          unitIds.has(association.cityId) ||
            (association.regionId === scope.regionId && calabarzonCityCodes.has(association.cityId)),
          `Unknown associated city: ${association.cityId}`,
        );
      if (association.regionId === scope.regionId) {
        if (association.provinceId) {
          assert.ok(
            calabarzonDenominator.provinces.some((province) => province.psgcCode === association.provinceId),
            `Unknown CALABARZON denominator province: ${association.provinceId}`,
          );
        }
        if (association.cityId) {
          assert.ok(calabarzonCityCodes.has(association.cityId), `Unknown CALABARZON denominator city: ${association.cityId}`);
        }
        if (association.municipalityId) {
          assert.ok(
            calabarzonMunicipalityCodes.has(association.municipalityId),
            `Unknown CALABARZON municipality: ${association.municipalityId}`,
          );
        }
      }
      for (const [key, level] of [
        ["provinceId", "province"],
        ["cityId", "city"],
      ]) {
        if (association[key]) {
          const unit = units.get(association[key]);
          if (!unit && key === "cityId" && association.regionId === scope.regionId) continue;
          assert.equal(
            unit?.level,
            level,
            `Wrong administrative association level: ${association[key]}`,
          );
          assert.equal(
            unit?.regionId,
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
  const luzonRegionCount = luzonEvidenceIndex.regions.length;
  const luzonEvidenceReconciliation = {
    snapshotId: luzonEvidenceIndex.snapshotId,
    reviewArtifactsScanned: luzonEvidenceIndex.summary.reviewArtifactsScanned,
    reviewClassifications: luzonEvidenceIndex.summary.reviewClassifications,
    sourceRegistryIds: luzonEvidenceIndex.summary.sourceRegistryUniqueIds,
    exactSourceIdentityGroups: sourceIdentityCrosswalk.groups.length,
    unresolvedTrackedJsonReferences: luzonEvidenceIndex.summary.brokenOrUnresolvedJsonReferences,
    missingSourceIdLinks: luzonEvidenceIndex.summary.missingSourceIdLinks,
    localRawJsonReferences: {
      total: luzonEvidenceIndex.summary.localRawReferenceCount,
      matched: luzonEvidenceIndex.summary.localRawReferencesAvailable,
      unresolved: luzonEvidenceIndex.summary.localRawReferencesUnresolved,
      uniqueLocalFiles: luzonEvidenceIndex.summary.uniqueLocalRawInputsMatched,
    },
    phaseIdInterpretation: luzonEvidenceIndex.findings.phaseIdInterpretation,
    publicProjections: {
      inventoried: luzonEvidenceIndex.summary.publicProjectionFiles,
      rightsExceptions: luzonEvidenceIndex.publicProjections
        .filter((projection) => projection.laterPublicationException)
        .map(({ path, laterPublicationException }) => ({
          path,
          status: laterPublicationException.status,
          reviewPath: laterPublicationException.reviewPath,
        })),
    },
    scopeFrozenRegions: luzonEvidenceIndex.regions.filter((region) => region.scopeFrozen).length,
    baselineReviewedRegions: luzonEvidenceIndex.regions.filter((region) => region.baselineReviewed).length,
    regionCount: luzonRegionCount,
    status: "evidence-indexed;regional-baselines-incomplete",
  };
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
    calabarzonLocalityLinkage: localityLinkageStatus,
    luzonEvidenceReconciliation,
    interpretation:
      "Raw candidates/proposals remain immutable research inputs. Four Taal checklist assertions, three historical Taal CAS specimen-locality assertions, twelve Palico-Lian river-survey table assertions, one undated text-locality assertion for Molawin Creek, one dated specimen assertion for Laguna de Bay, four historical Pansipit River text-locality assertions, one 1929 Bulacan CAS specimen-locality assertion, and three historical 1982 Bulacan Manila Bay USNM specimen assertions are prepared for the app; these do not establish current presence or completed regional coverage. Null reviewed regional counts are unknown, not absence. This status does not verify deployment.",
    regions,
  };
}

export async function readResearchInputs() {
  const completionManifestFile = new URL("luzon-completion-manifest.json", research);
  const completionManifest = JSON.parse(await readFile(completionManifestFile, "utf8"));
  const evidenceIndexFile = resolve(fileURLToPath(root), completionManifest.evidenceAuditIndex);
  const evidenceIndex = JSON.parse(await readFile(evidenceIndexFile, "utf8"));
  const identityCrosswalkReview = evidenceIndex.reviews
    .filter((review) => /^source-identity-crosswalk-\d{8}$/.test(review.reviewId ?? ""))
    .sort((a, b) => a.reviewId.localeCompare(b.reviewId))
    .at(-1);
  assert.ok(identityCrosswalkReview, "Luzon audit index must include the source identity crosswalk");
  const files = {
    luzonCompletionManifest: completionManifestFile,
    luzonEvidenceIndex: evidenceIndexFile,
    sourceIdentityCrosswalk: resolve(fileURLToPath(root), identityCrosswalkReview.path),
    calabarzonAdministrativeDenominator: new URL(
      "national/reviews/calabarzon-administrative-denominator-reconciliation-20261117.json",
      research,
    ),
    calabarzonLocalityLinkageAudit: new URL(
      "national/reviews/calabarzon-locality-linkage-gap-audit-20261118.json",
      research,
    ),
    calabarzonLocalityLinkageAuditHistorical: new URL(
      "national/reviews/calabarzon-locality-linkage-gap-audit-20261117.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261117.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch02: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261117-02.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch03: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261118.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch04: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261118-02.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch05: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261118-03.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch06: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261119.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch07: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261119-02.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch08: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261119-03.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch09: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261119-04.json",
      research,
    ),
    calabarzonLocalitySourceBackedBatch10: new URL(
      "national/reviews/calabarzon-locality-source-backed-batch-20261119-05.json",
      research,
    ),
    calabarzonYabahanCrosswalkReview: new URL(
      "calabarzon-quezon-yabahaan-yabahan-river-crosswalk-20261101.json",
      research,
    ),
    calabarzonBmb2019WetlandCrosswalk: new URL(
      "calabarzon-bmb-2019-wetland-inventory-crosswalk-20261024.json",
      research,
    ),
    calabarzonCenroSiteCrosswalk: new URL(
      "calabarzon-cenro-calauag-2026-awc-site-crosswalk-20261030.json",
      research,
    ),
    calabarzonTagbacSourceReview: new URL("calabarzon-tagbac-creek-source-review-20261026.json", research),
    calabarzonBcibWatercoursesReview: new URL("calabarzon-bcib-cavite-watercourses-fish-review-20261031.json", research),
    calabarzonBmbAtlasReview: new URL("calabarzon-bmb-2016-atlas-river-crosswalk-20261024.json", research),
    calabarzonBmbBatangasLagunaReview: new URL("calabarzon-bmb-2016-batangas-laguna-river-crosswalk-20261024.json", research),
    calabarzonBmbTableVisualReview: new URL("calabarzon-bmb-2016-table-visual-review-20261024.json", research),
    calabarzonBacoorInlandReview: new URL("calabarzon-bacoor-inland-waterbody-crosswalk-20261026.json", research),
    calabarzonProtectedLandscapeReview: new URL("calabarzon-ternate-protected-landscape-rivers-review-20261026.json", research),
    calabarzonBucalVariantReview: new URL("calabarzon-quezon-bucal-lalangan-advisory-variant-review-20261101.json", research),
    calabarzonLabayatVariantReview: new URL("calabarzon-quezon-lakayat-labayat-variant-review-20261101.json", research),
    calabarzonGapanReview: new URL("calabarzon-gapan-sapang-river-source-review-20261026.json", research),
    calabarzonGapanGeoNamesCrosscheck: new URL("calabarzon-gapan-sapang-geonames-crosscheck-20261026.json", research),
    mambaPalicpicanSourceReview: new URL(
      "calabarzon-ternate-protected-landscape-rivers-review-20261026.json",
      research,
    ),
    bucalNameVariantReview: new URL(
      "calabarzon-quezon-bucal-lalangan-advisory-variant-review-20261101.json",
      research,
    ),
    labayatNameVariantReview: new URL(
      "calabarzon-quezon-lakayat-labayat-variant-review-20261101.json",
      research,
    ),
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
        `Luzon audit: ${status.luzonEvidenceReconciliation.reviewArtifactsScanned} review artifacts; ${status.luzonEvidenceReconciliation.exactSourceIdentityGroups} source identity groups; ${status.luzonEvidenceReconciliation.localRawJsonReferences.matched}/${status.luzonEvidenceReconciliation.localRawJsonReferences.total} local raw JSON references matched; ${status.luzonEvidenceReconciliation.scopeFrozenRegions}/${status.luzonEvidenceReconciliation.regionCount} scopes frozen and ${status.luzonEvidenceReconciliation.baselineReviewedRegions}/${status.luzonEvidenceReconciliation.regionCount} baselines reviewed.`,
      );
      console.log(
        `CALABARZON locality links: ${status.calabarzonLocalityLinkage.leadsWithCityOrMunicipalityCode} leads with a city/municipality code; ${status.calabarzonLocalityLinkage.leadsWithProvinceCodeButNoCityOrMunicipalityCode} province-only; ${status.calabarzonLocalityLinkage.leadsWithCityCode} city-coded across ${status.calabarzonLocalityLinkage.cityCodesPresent}/${status.calabarzonLocalityLinkage.cityCodesExpected} city codes; ${status.calabarzonLocalityLinkage.leadsWithMunicipalityCode} municipality-coded across ${status.calabarzonLocalityLinkage.municipalityCodesPresent}/${status.calabarzonLocalityLinkage.municipalityCodesExpected} municipality codes; ${status.calabarzonLocalityLinkage.leadsWithoutProvinceCityOrMunicipalityCode} unresolved; geometry validated: ${status.calabarzonLocalityLinkage.geometryValidated}; scope frozen: ${status.calabarzonLocalityLinkage.scopeFrozen}.`,
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
