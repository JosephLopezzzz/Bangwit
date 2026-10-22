import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const research = new URL("data/research/philippines/", root);
const output = new URL("src/data/palico-river-survey-evidence.json", root);
const batchId = "palico-lian-survey-20261023";
const sourceId = "corpuz-2025-palico-lian";
const waterbodyId = "ph-wb-palico-lian-river";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const pretty = (value) => `${JSON.stringify(value, null, 2)}\n`;

const readJson = async (file) => {
  const bytes = await readFile(new URL(file, research));
  return { value: JSON.parse(bytes.toString("utf8")), sha256: hash(bytes) };
};

export async function readPalicoRiverInputs() {
  const [river, independent, identityAddendum, decisions, registry, scope] = await Promise.all([
    readJson("calabarzon-river-source-review.json"),
    readJson("palico-independent-review.json"),
    readJson("palico-identity-addendum.json"),
    readJson("palico-river-decisions.json"),
    readJson("sources.json"),
    readJson("calabarzon-scope.json"),
  ]);
  return {
    river: river.value,
    independent: independent.value,
    identityAddendum: identityAddendum.value,
    decisions: decisions.value,
    registry: registry.value,
    scope: scope.value,
    hashes: {
      river: river.sha256,
      independent: independent.sha256,
      identityAddendum: identityAddendum.sha256,
      decisions: decisions.sha256,
      registry: registry.sha256,
      scope: scope.sha256,
    },
  };
}

const keyBy = (rows, key, label) => {
  assert.ok(
    rows.every((row) => typeof row[key] === "string" && row[key].trim()),
    `Missing ${label}`,
  );
  const map = new Map(rows.map((row) => [row[key], row]));
  assert.equal(map.size, rows.length, `Duplicate ${label}`);
  return map;
};

/** Build only a scoped, source-attributed table assertion list; this is not current-presence data. */
export function buildPalicoRiverEvidence({ river, independent, identityAddendum, decisions, registry, scope, hashes }) {
  assert.equal(river.regionId, "0400000000");
  assert.equal(river.candidates.length, 15);
  assert.equal(
    river.publicAdmission,
    false,
    "A regional or waterbody admission is not granted by a survey-table batch",
  );
  assert.equal(identityAddendum.sourceId, sourceId);
  assert.equal(identityAddendum.counts.checks, 10);
  assert.equal(identityAddendum.counts.identityAndFamilyAgreements, 8);
  assert.equal(identityAddendum.counts.holds, 2);
  assert.equal(identityAddendum.counts.publicAdmissions, 0);
  assert.equal(identityAddendum.checklist.stableDuringRun, true);
  assert.equal(identityAddendum.checklist.metadataSha256, identityAddendum.checklist.endMetadataSha256);
  assert.equal(independent.taxonomyChecks.length, 5);
  assert.equal(independent.tableRows.length, 15);
  assert.equal(decisions.schemaVersion, 1);
  assert.equal(decisions.batchId, batchId);
  assert.equal(decisions.reviewedOn, "2026-10-23");
  assert.equal(decisions.status, "reviewed-scoped-survey-table-assertions");
  for (const key of ["river", "independent", "identityAddendum", "registry", "scope"]) {
    assert.equal(decisions.snapshotHashes[key], hashes[key], `Changed ${key} input requires a new review`);
  }

  const source = river.sources.find((item) => item.id === sourceId);
  const registeredSource = registry.sources.find((item) => item.id === sourceId);
  const waterbody = scope.waterbodies.find((item) => item.id === waterbodyId);
  assert.ok(source && registeredSource && waterbody);
  assert.equal(source.access.rawPdfSha256, decisions.sourceApproval.pdfSha256);
  assert.equal(source.doi, decisions.sourceApproval.doi);
  assert.equal(source.rights.license, null, "Custom publisher permission must not be mislabeled as a license");
  assert.equal(source.rights.publicationApproval, false, "No blanket source approval is recorded");
  assert.equal(source.rights.termsUrl, decisions.sourceApproval.policyUrl);
  assert.equal(source.rights.termsTextSha256, decisions.sourceApproval.policyTextSha256);
  assert.equal(source.rights.approvedProjectionBatch, batchId);
  assert.equal(decisions.sourceApproval.license, null);
  assert.equal(decisions.sourceApproval.scope, "this-batch-only");
  assert.deepEqual(
    registeredSource.approvedProjectionBatches,
    [batchId],
    "Only this exact batch may use the scoped source grant",
  );
  assert.equal(registeredSource.publicationApproval, false);
  assert.equal(waterbody.kind, "river");
  assert.equal(waterbody.publicAdmission, false, "A table projection does not admit the whole river to the map");
  assert.ok(waterbody.evidenceBatchRefs.includes(batchId));
  assert.equal(waterbody.salinity.classification, "unknown");

  const candidateById = keyBy(river.candidates, "id", "candidate ID");
  const decisionById = keyBy(decisions.records, "candidateId", "decision candidate ID");
  const sourceTableByName = keyBy(independent.tableRows, "recordedName", "reviewed table name");
  const priorTaxonomyByName = keyBy(independent.taxonomyChecks, "scientificName", "prior taxonomy check");
  const addendumByName = keyBy(identityAddendum.checks, "recordedName", "new taxonomy check");
  assert.equal(decisionById.size, river.candidates.length, "Every source row requires a decision");
  assert.deepEqual(
    [...addendumByName.keys()].sort(),
    river.candidates
      .map((row) => row.recordedName)
      .filter((name) => !priorTaxonomyByName.has(name))
      .sort(),
    "The identity addendum must cover exactly the ten unreviewed source names",
  );

  const reviewedRows = river.candidates.map((candidate) => {
    const decision = decisionById.get(candidate.id);
    const tableCheck = sourceTableByName.get(candidate.recordedName);
    const taxonomy = priorTaxonomyByName.get(candidate.recordedName) ?? addendumByName.get(candidate.recordedName);
    assert.ok(decision && tableCheck && taxonomy, "Incomplete source, table or taxonomy join");
    assert.equal(tableCheck.recordedFamily, candidate.recordedFamily, "Source family was changed during review");
    assert.deepEqual(tableCheck.stationPresence, candidate.stationPresence, "Site marks changed during review");
    assert.equal(decision.recordedName, candidate.recordedName);
    assert.equal(decision.recordedFamily, candidate.recordedFamily);
    assert.ok(decision.reason?.trim(), "Every admission/hold needs a reason");
    assert.ok(["admit-survey-table-assertion", "hold"].includes(decision.decision));
    assert.equal(candidate.observationDate, null);
    assert.equal(candidate.samplingPeriod.value, null);
    assert.equal(candidate.stationCounts, null, "Table plus signs are site marks, not specimen counts");

    const worms = taxonomy.worms;
    assert.equal(worms.scientificName, candidate.recordedName);
    assert.equal(worms.validScientificName, candidate.recordedName);
    assert.equal(worms.status, "accepted");
    assert.ok(Number.isInteger(worms.aphiaId) && worms.aphiaId > 0);
    assert.match(worms.responseSha256, /^[a-f0-9]{64}$/);
    const familyAgrees = worms.family.toLowerCase() === candidate.recordedFamily.toLowerCase();
    assert.equal(
      decision.decision === "admit-survey-table-assertion",
      familyAgrees,
      "An unresolved source-family conflict cannot be admitted or silently corrected",
    );

    if (taxonomy.col) {
      assert.equal(taxonomy.col.matchType, "EXACT");
      assert.equal(taxonomy.col.canonicalName, candidate.recordedName);
      assert.equal(taxonomy.col.rank, "SPECIES");
      assert.equal(taxonomy.col.status, "ACCEPTED");
      assert.equal(
        taxonomy.col.family.toLowerCase() === candidate.recordedFamily.toLowerCase(),
        familyAgrees,
        "COL family evidence must retain the two held source-family conflicts",
      );
      assert.equal(
        taxonomy.recommendedDecision === "identity-agreement-only",
        familyAgrees,
        "Identity recommendation must agree with source-family comparison",
      );
      assert.match(taxonomy.col.responseSha256, /^[a-f0-9]{64}$/);
    }

    return { candidate, decision, taxonomy };
  });

  const admitted = reviewedRows.filter(({ decision }) => decision.decision === "admit-survey-table-assertion");
  const held = reviewedRows.filter(({ decision }) => decision.decision === "hold");
  assert.equal(admitted.length, decisions.counts.admittedRows);
  assert.equal(held.length, decisions.counts.heldRows);
  assert.equal(admitted.length, 12);
  assert.equal(held.length, 3);
  assert.deepEqual(
    held.map(({ candidate }) => candidate.recordedName).sort(),
    ["Megalops cyprinoides", "Poecilia sphenops", "Trichopodus trichopterus"].sort(),
    "Only the three recorded-family conflicts remain held in this batch",
  );

  const records = admitted.map(({ candidate, taxonomy }) => ({
    id: candidate.id,
    scientificName: candidate.recordedName,
    recordedName: candidate.recordedName,
    acceptedFamily: taxonomy.worms.family,
    sitePresence: {
      site1: candidate.stationPresence.site1,
      site2: candidate.stationPresence.site2,
      site3: candidate.stationPresence.site3,
    },
    observationDate: null,
    sourcePrintedPage: candidate.sourcePage,
    sourceTable: candidate.sourceTable,
    taxonomyUrl: taxonomy.worms.taxonUrl,
  }));
  records.sort((a, b) => a.scientificName.localeCompare(b.scientificName, "en"));

  return {
    schemaVersion: 1,
    batchId,
    reviewedOn: decisions.reviewedOn,
    waterbody: {
      id: waterbodyId,
      name: "Palico-Lian River",
      kind: "river",
      province: "Batangas",
      region: "CALABARZON",
      siteGeometry: null,
      salinity: "unknown",
    },
    evidenceKind: "published-survey-table-presence-assertion",
    source: {
      id: sourceId,
      title: source.title,
      citation:
        "Corpuz, M. N. C. (2025). Freshwater Fish Assemblages in Palico-Lian River, Batangas, Southern Luzon, Philippines. Biodiversity Journal, 16(4), 579–588.",
      doi: source.doi,
      articleUrl: `https://doi.org/${source.doi}`,
      publicationDate: source.reportedPublicationDate,
      sourceTable: 1,
      sourcePrintedPage: 584,
      policyUrl: source.rights.termsUrl,
      policyTextSha256: source.rights.termsTextSha256,
      permissionType: "custom-publisher-copy-distribution-grant",
      license: null,
    },
    limits: {
      observationDate: "not-reported",
      sampleCounts: "not-derived-from-plus-marks",
      completeRiverInventory: false,
      currentPresence: false,
      waterSalinity: "unknown",
      fishingPermission: "not-assessed",
      sourceOriginLabels: "excluded-due-to-table-prose-disagreement",
    },
    provenance: {
      decisionsFile: "data/research/philippines/palico-river-decisions.json",
      snapshotHashes: decisions.snapshotHashes,
      sourcePdfSha256: source.access.rawPdfSha256,
      independentWoRMSChecks: independent.taxonomyChecks.length,
      additionalColAndWoRMSChecks: identityAddendum.checks.length,
      colIndex: identityAddendum.checklist.matchingIndex.alias,
      colIndexSha256: identityAddendum.checklist.metadataSha256,
    },
    counts: {
      sourceRows: decisions.counts.reviewedRows,
      admittedAssertions: records.length,
      heldRows: held.length,
    },
    records,
  };
}

export async function buildFromFiles() {
  const inputs = await readPalicoRiverInputs();
  return buildPalicoRiverEvidence(inputs);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const artifact = await buildFromFiles();
    const encoded = pretty(artifact);
    if (process.argv.includes("--check")) {
      assert.equal(await readFile(output, "utf8"), encoded, "Public river projection differs from the reviewed ledger");
      console.log(
        `Palico river projection matches: ${artifact.counts.admittedAssertions} assertions; ${artifact.counts.heldRows} held.`,
      );
    } else {
      await writeFile(output, encoded);
      console.log(
        `Palico river projection written: ${artifact.counts.admittedAssertions} assertions; ${artifact.counts.heldRows} held.`,
      );
    }
  } catch (error) {
    console.error(`Palico river projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
