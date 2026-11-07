import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const jobPath = path.join(root, "data/research/philippines/national/jobs/obis-ph-actinopterygii-area-191-v1.json");
const outputPath = path.join(root, "data/research/philippines/national/reviews/obis-ph-actinopterygii-taxon-candidates-20261107.json");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

function increment(map, value) {
  const key = String(value ?? "MISSING").trim() || "MISSING";
  map[key] = (map[key] ?? 0) + 1;
}

function setValue(set, value) {
  if (value !== null && value !== undefined && String(value).trim()) set.add(String(value).trim());
}

async function saveJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

async function main() {
  const receipt = JSON.parse(await readFile(jobPath, "utf8"));
  if (!new Set(["downloaded-review-pending", "downloaded-dataset-rights-review-pending", "research-candidates-indexed-review-pending"]).has(receipt.status)
      || !Array.isArray(receipt.pages) || !receipt.expectedTotal) {
    throw new Error("A complete OBIS occurrence snapshot is required before candidate indexing");
  }

  const candidates = new Map();
  const rankCounts = {};
  const basisOfRecordCounts = {};
  let scannedRows = 0;
  let speciesRankRows = 0;
  let speciesRankRowsMissingName = 0;
  let speciesRankRowsMissingAnyTaxonId = 0;
  let rowsWithCoordinates = 0;
  let absenceRows = 0;
  let droppedRows = 0;

  for (const page of receipt.pages) {
    const compressed = await readFile(path.join(root, page.rawPath));
    if (hash(compressed) !== page.compressedSha256) throw new Error(`Raw page checksum mismatch: ${page.pageNumber}`);
    const bytes = gunzipSync(compressed);
    if (hash(bytes) !== page.responseSha256) throw new Error(`Response checksum mismatch: ${page.pageNumber}`);
    const body = JSON.parse(bytes.toString("utf8"));
    if (!Array.isArray(body.results) || body.results.length !== page.returnedRows) throw new Error(`Page row count mismatch: ${page.pageNumber}`);

    for (const row of body.results) {
      scannedRows += 1;
      const rank = String(row.taxonRank ?? "MISSING").trim() || "MISSING";
      increment(rankCounts, rank);
      increment(basisOfRecordCounts, row.basisOfRecord);
      if (row.decimalLatitude !== null && row.decimalLatitude !== undefined
          && row.decimalLongitude !== null && row.decimalLongitude !== undefined) rowsWithCoordinates += 1;
      if (row.absence === true) absenceRows += 1;
      if (row.dropped === true) droppedRows += 1;
      if (rank.toLowerCase() !== "species") continue;

      speciesRankRows += 1;
      const names = [row.species, row.scientificName].filter((value) => typeof value === "string" && value.trim());
      if (names.length === 0) speciesRankRowsMissingName += 1;
      const aphiaId = row.aphiaID ?? null;
      const speciesId = row.speciesid ?? null;
      const providerTaxonId = row.taxonID ?? null;
      if (aphiaId === null && speciesId === null && providerTaxonId === null) speciesRankRowsMissingAnyTaxonId += 1;

      const identityKey = aphiaId !== null
        ? `aphia:${aphiaId}`
        : speciesId !== null
          ? `obis-species:${speciesId}`
          : providerTaxonId !== null
            ? `provider-taxon:${providerTaxonId}`
            : `recorded-name:${(names[0] ?? `unnamed-row-${scannedRows}`).toLowerCase()}`;
      const candidate = candidates.get(identityKey) ?? {
        candidateId: `obis-ph-actinopterygii:${hash(Buffer.from(identityKey)).slice(0, 20)}`,
        identityKey,
        provider: "OBIS",
        providerTaxonIds: new Set(),
        speciesIds: new Set(),
        aphiaIds: new Set(),
        scientificNameIds: new Set(),
        recordedNames: new Set(),
        rank: "species",
        occurrenceCount: 0,
        datasetIds: new Set(),
        years: new Set(),
        basisOfRecordCounts: {},
        licenseValues: {},
        marineFlagRows: 0,
        brackishFlagRows: 0,
        rowsWithCoordinates: 0,
        rowsNotMarkedAbsenceOrDropped: 0,
      };

      candidate.occurrenceCount += 1;
      setValue(candidate.providerTaxonIds, providerTaxonId);
      setValue(candidate.speciesIds, speciesId);
      setValue(candidate.aphiaIds, aphiaId);
      setValue(candidate.scientificNameIds, row.scientificNameID);
      for (const name of names) setValue(candidate.recordedNames, name);
      setValue(candidate.datasetIds, row.dataset_id);
      if (row.date_year !== null && row.date_year !== undefined && Number.isInteger(Number(row.date_year))) {
        candidate.years.add(Number(row.date_year));
      }
      increment(candidate.basisOfRecordCounts, row.basisOfRecord);
      increment(candidate.licenseValues, row.license);
      if (row.marine === true) candidate.marineFlagRows += 1;
      if (row.brackish === true) candidate.brackishFlagRows += 1;
      if (row.decimalLatitude !== null && row.decimalLatitude !== undefined
          && row.decimalLongitude !== null && row.decimalLongitude !== undefined) candidate.rowsWithCoordinates += 1;
      if (row.absence !== true && row.dropped !== true) candidate.rowsNotMarkedAbsenceOrDropped += 1;
      candidates.set(identityKey, candidate);
    }
  }

  if (scannedRows !== receipt.expectedTotal) throw new Error(`Scanned rows do not reconcile with the provider total: ${scannedRows}/${receipt.expectedTotal}`);
  const candidateRows = [...candidates.values()].map((candidate) => ({
    ...candidate,
    providerTaxonIds: [...candidate.providerTaxonIds].sort(),
    speciesIds: [...candidate.speciesIds].sort(),
    aphiaIds: [...candidate.aphiaIds].sort(),
    scientificNameIds: [...candidate.scientificNameIds].sort(),
    recordedNames: [...candidate.recordedNames].sort((a, b) => a.localeCompare(b)),
    datasetIds: [...candidate.datasetIds].sort(),
    years: [...candidate.years].sort((a, b) => a - b),
    recordRightsReview: "pending; see dataset-level inventory",
    identityReview: "candidate only; provider names and identifiers are not accepted-name approval",
    geographicReview: "country area only; no local waterbody assertion",
    publicationEligible: false,
  })).sort((a, b) => {
    const left = a.recordedNames[0] ?? a.identityKey;
    const right = b.recordedNames[0] ?? b.identityKey;
    return left.localeCompare(right) || a.candidateId.localeCompare(b.candidateId);
  });

  const artifact = {
    schemaVersion: 1,
    status: "research-candidates-only",
    generatedOn: "2026-11-07",
    acquisitionJobId: receipt.jobId,
    acquisitionReceipt: "data/research/philippines/national/jobs/obis-ph-actinopterygii-area-191-v1.json",
    datasetRightsInventory: "data/research/philippines/national/reviews/obis-ph-actinopterygii-dataset-rights-20261107.json",
    queryHash: receipt.queryHash,
    scope: {
      providerArea: "OBIS Philippines area 191",
      providerTaxonId: 10194,
      providerTaxonName: "Actinopterygii",
      interpretation: "Ray-finned fish occurrence candidates only. This is not a complete fish taxonomy, accepted checklist, local waterbody distribution, current presence list or catchability recommendation.",
      occurrenceStatusFieldCaveat: "The source field returned mixed values, including missing values, 'present' and Aphia-style LSIDs. It is not used here to assert presence; inspect source-specific mappings before interpreting it.",
    },
    summary: {
      providerRows: scannedRows,
      speciesRankRows,
      speciesRankCandidateGroups: candidateRows.length,
      speciesRankRowsMissingName,
      speciesRankRowsMissingAnyTaxonId,
      rowsWithCoordinates,
      absenceRows,
      droppedRows,
      rankCounts,
      basisOfRecordCounts,
      distinctProviderDatasetCount: new Set(candidateRows.flatMap((row) => row.datasetIds)).size,
      publicationEligibleCandidates: 0,
    },
    groupingPolicy: "Group species-rank occurrence rows by AphiaID when available, otherwise preserve provider taxonID, then recorded name only as a last resort. Keep all three identifier fields distinct and retain name variants for conflict review.",
    candidates: candidateRows,
  };

  await saveJson(outputPath, artifact);
  receipt.taxonCandidateIndex = {
    path: path.relative(root, outputPath).replaceAll("\\", "/"),
    generatedOn: artifact.generatedOn,
    providerRows: scannedRows,
    speciesRankRows,
    candidateGroups: candidateRows.length,
    publicationEligibleCandidates: 0,
  };
  receipt.status = "research-candidates-indexed-review-pending";
  receipt.updatedAtUtc = new Date().toISOString();
  await saveJson(jobPath, receipt);
  console.log(JSON.stringify({
    result: "taxon-candidates-built",
    providerRows: scannedRows,
    speciesRankRows,
    speciesRankCandidateGroups: candidateRows.length,
    speciesRankRowsMissingName,
    speciesRankRowsMissingAnyTaxonId,
    rowsWithCoordinates,
    absenceRows,
    droppedRows,
    distinctProviderDatasetCount: artifact.summary.distinctProviderDatasetCount,
    publicationEligibleCandidates: 0,
    output: path.relative(root, outputPath).replaceAll("\\", "/"),
  }));
}

main().catch((error) => {
  console.error(`OBIS taxon candidate index stopped: ${error.message}`);
  process.exitCode = 1;
});
