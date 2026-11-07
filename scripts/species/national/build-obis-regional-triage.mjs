import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const configPath = path.join(root, "data/research/philippines/national/acquisition-config.json");
const jobPath = path.join(root, "data/research/philippines/national/jobs/obis-ph-actinopterygii-area-191-v1.json");
const rightsPath = path.join(root, "data/research/philippines/national/reviews/obis-ph-actinopterygii-dataset-rights-20261107.json");
const outputPath = path.join(root, "data/research/philippines/national/reviews/obis-ph-actinopterygii-calabarzon-triage-20261107.json");
const privatePartitionPath = path.join(root, "data/research/philippines/raw/national/obis-ph-actinopterygii-calabarzon-rights-shortlist-v1.jsonl");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalized = (value) => String(value ?? "").trim().toLocaleLowerCase("en");

function increment(map, value) {
  const key = String(value ?? "MISSING").trim() || "MISSING";
  map[key] = (map[key] ?? 0) + 1;
}

function createStats(datasetId) {
  return {
    datasetId,
    occurrenceRows: 0,
    uniqueOccurrenceIds: new Set(),
    uniqueRecordedNames: new Set(),
    rowsWithCoordinates: 0,
    rowsWithCountry: 0,
    countryValueCounts: {},
    rowsWithLocality: 0,
    rowsWithHigherGeography: 0,
    rowsWithWaterBody: 0,
    rowsWithEventDate: 0,
    rowsWithCoordinateUncertainty: 0,
    taxonRankCounts: {},
    basisOfRecordCounts: {},
    occurrenceStatusCounts: {},
    recordLicenseCounts: {},
    marineFlagRows: 0,
    brackishFlagRows: 0,
    absenceRows: 0,
    droppedRows: 0,
    yearValues: new Set(),
    matchedProvinceTextCounts: {},
  };
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumeric(value) {
  return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
}

function sortCounts(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

async function saveJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

function rightsShortlistPass(dataset) {
  const allowedClasses = new Set(["CC0-or-public-domain", "CC-BY-or-CC-BY-4.0"]);
  const recordClasses = dataset.recordLicenseClasses ?? [];
  return allowedClasses.has(dataset.datasetLicenseClass)
    && recordClasses.length > 0
    && recordClasses.every((value) => allowedClasses.has(value))
    && dataset.licenseReviewFlags?.length === 0
    && dataset.recordDatasetRightsConflict === false;
}

function projectReviewFields(row) {
  const allowedFields = [
    "id", "occurrenceID", "dataset_id", "scientificName", "originalScientificName",
    "scientificNameAuthorship", "taxonRank", "taxonID", "aphiaID", "speciesid",
    "class", "order", "family", "genus", "species", "date_year", "eventDate",
    "basisOfRecord", "occurrenceStatus", "country", "stateProvince", "locality",
    "higherGeography", "waterBody", "island", "decimalLatitude", "decimalLongitude",
    "coordinateUncertaintyInMeters", "geodeticDatum", "license", "references",
    "institutionCode", "collectionCode", "catalogNumber", "flags", "marine", "brackish",
    "absence", "dropped",
  ];
  return Object.fromEntries(allowedFields
    .filter((field) => Object.hasOwn(row, field))
    .map((field) => [field, row[field]]));
}

async function main() {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const receipt = JSON.parse(await readFile(jobPath, "utf8"));
  const rightsInventory = JSON.parse(await readFile(rightsPath, "utf8"));
  const triage = config.regionalTriage;
  if (!triage || triage.regionId !== "CALABARZON" || !Array.isArray(triage.provinceTextLabels)) {
    throw new Error("The acquisition config must define the CALABARZON text-match triage labels");
  }
  if (!Array.isArray(receipt.pages) || receipt.pages.length === 0 || receipt.expectedTotal !== rightsInventory.occurrenceCounts?.rowsScanned) {
    throw new Error("A complete, reconciled OBIS snapshot and rights inventory are required");
  }

  const labels = new Map(triage.provinceTextLabels.map((label) => [normalized(label), label]));
  const datasetRights = new Map(rightsInventory.datasets.map((dataset) => [dataset.datasetId, dataset]));
  const statsByDataset = new Map();
  const privateCandidateRows = [];
  const rowsByProvinceText = Object.fromEntries(triage.provinceTextLabels.map((label) => [label, 0]));
  const recordLicenseValueCountsInShortlistRows = {};
  let scannedRows = 0;
  let matchedRows = 0;
  let matchedRowsWithPhilippinesCountry = 0;
  let matchedRowsMissingCountry = 0;
  let matchedRowsWithCoordinates = 0;
  let matchedRowsWithLocality = 0;
  let matchedRowsWithHigherGeography = 0;
  let matchedRowsWithoutCoordinateUncertainty = 0;

  for (const page of receipt.pages) {
    const compressed = await readFile(path.join(root, page.rawPath));
    if (hash(compressed) !== page.compressedSha256) throw new Error(`Raw page checksum mismatch: ${page.pageNumber}`);
    const bytes = gunzipSync(compressed);
    if (hash(bytes) !== page.responseSha256) throw new Error(`Response checksum mismatch: ${page.pageNumber}`);
    const body = JSON.parse(bytes.toString("utf8"));
    if (!Array.isArray(body.results) || body.results.length !== page.returnedRows) throw new Error(`Page row count mismatch: ${page.pageNumber}`);

    for (const row of body.results) {
      scannedRows += 1;
      const datasetId = String(row.dataset_id ?? "").trim();
      const provinceLabel = labels.get(normalized(row.stateProvince));
      if (!provinceLabel) continue;

      const rights = datasetRights.get(datasetId);
      if (rights && rightsShortlistPass(rights)) {
        privateCandidateRows.push({
          sourceRecord: projectReviewFields(row),
          reviewState: {
            regionScope: "CALABARZON province text match only",
            recordRights: "shortlist candidate; human review pending",
            taxonomy: "unreviewed provider match",
            geographicAssociation: "province/locality/waterbody not yet validated against an administrative source",
            currentPresence: "not asserted; source occurrenceStatus is not used as a presence decision",
            publicationEligible: false,
          },
        });
      }

      matchedRows += 1;
      rowsByProvinceText[provinceLabel] += 1;
      if (normalized(row.country) === "philippines") matchedRowsWithPhilippinesCountry += 1;
      else if (!hasText(row.country)) matchedRowsMissingCountry += 1;
      if (isNumeric(row.decimalLatitude) && isNumeric(row.decimalLongitude)) matchedRowsWithCoordinates += 1;
      if (hasText(row.locality)) matchedRowsWithLocality += 1;
      if (hasText(row.higherGeography)) matchedRowsWithHigherGeography += 1;
      if (!isNumeric(row.coordinateUncertaintyInMeters)) matchedRowsWithoutCoordinateUncertainty += 1;

      const stats = statsByDataset.get(datasetId) ?? createStats(datasetId);
      stats.occurrenceRows += 1;
      if (hasText(row.occurrenceID)) stats.uniqueOccurrenceIds.add(row.occurrenceID.trim());
      if (hasText(row.species)) stats.uniqueRecordedNames.add(row.species.trim());
      else if (hasText(row.scientificName)) stats.uniqueRecordedNames.add(row.scientificName.trim());
      if (isNumeric(row.decimalLatitude) && isNumeric(row.decimalLongitude)) stats.rowsWithCoordinates += 1;
      if (hasText(row.country)) stats.rowsWithCountry += 1;
      increment(stats.countryValueCounts, row.country);
      if (hasText(row.locality)) stats.rowsWithLocality += 1;
      if (hasText(row.higherGeography)) stats.rowsWithHigherGeography += 1;
      if (hasText(row.waterBody)) stats.rowsWithWaterBody += 1;
      if (hasText(row.eventDate)) stats.rowsWithEventDate += 1;
      if (isNumeric(row.coordinateUncertaintyInMeters)) stats.rowsWithCoordinateUncertainty += 1;
      increment(stats.taxonRankCounts, row.taxonRank);
      increment(stats.basisOfRecordCounts, row.basisOfRecord);
      increment(stats.occurrenceStatusCounts, row.occurrenceStatus);
      increment(stats.recordLicenseCounts, row.license);
      if (row.marine === true) stats.marineFlagRows += 1;
      if (row.brackish === true) stats.brackishFlagRows += 1;
      if (row.absence === true) stats.absenceRows += 1;
      if (row.dropped === true) stats.droppedRows += 1;
      if (isNumeric(row.date_year)) {
        const year = Number(row.date_year);
        if (Number.isInteger(year)) stats.yearValues.add(year);
      }
      stats.matchedProvinceTextCounts[provinceLabel] = (stats.matchedProvinceTextCounts[provinceLabel] ?? 0) + 1;
      statsByDataset.set(datasetId, stats);
    }
  }

  if (scannedRows !== receipt.expectedTotal) throw new Error(`Scanned rows do not reconcile: ${scannedRows}/${receipt.expectedTotal}`);
  const datasetSummaries = [...statsByDataset.values()].map((stats) => {
    const rights = datasetRights.get(stats.datasetId);
    if (!rights) throw new Error(`No rights inventory entry for dataset ${stats.datasetId}`);
    const years = [...stats.yearValues].sort((left, right) => left - right);
    const rightsShortlistCandidate = rightsShortlistPass(rights);
    if (rightsShortlistCandidate) {
      for (const [licenseValue, count] of Object.entries(stats.recordLicenseCounts)) {
        recordLicenseValueCountsInShortlistRows[licenseValue] = (recordLicenseValueCountsInShortlistRows[licenseValue] ?? 0) + count;
      }
    }
    return {
      datasetId: stats.datasetId,
      datasetTitle: rights.datasetTitle,
      datasetUrl: rights.datasetUrl,
      datasetCitation: rights.datasetCitation,
      candidateOccurrenceRows: stats.occurrenceRows,
      uniqueOccurrenceIds: stats.uniqueOccurrenceIds.size,
      distinctRecordedSpeciesNameStrings: stats.uniqueRecordedNames.size,
      matchedProvinceTextCounts: sortCounts(stats.matchedProvinceTextCounts),
      rowContext: {
        rowsWithCoordinates: stats.rowsWithCoordinates,
        rowsWithCountry: stats.rowsWithCountry,
        countryValueCounts: sortCounts(stats.countryValueCounts),
        rowsWithLocality: stats.rowsWithLocality,
        rowsWithHigherGeography: stats.rowsWithHigherGeography,
        rowsWithWaterBody: stats.rowsWithWaterBody,
        rowsWithEventDate: stats.rowsWithEventDate,
        rowsWithCoordinateUncertainty: stats.rowsWithCoordinateUncertainty,
        yearRange: years.length > 0 ? [years[0], years.at(-1)] : null,
        taxonRankCounts: sortCounts(stats.taxonRankCounts),
        basisOfRecordCounts: sortCounts(stats.basisOfRecordCounts),
        occurrenceStatusCounts: sortCounts(stats.occurrenceStatusCounts),
        recordLicenseCounts: sortCounts(stats.recordLicenseCounts),
        marineFlagRows: stats.marineFlagRows,
        brackishFlagRows: stats.brackishFlagRows,
        absenceRows: stats.absenceRows,
        droppedRows: stats.droppedRows,
      },
      rightsScreen: {
        datasetLicenseClass: rights.datasetLicenseClass,
        recordLicenseClasses: rights.recordLicenseClasses,
        recordDatasetRightsConflict: rights.recordDatasetRightsConflict,
        licenseReviewFlags: rights.licenseReviewFlags,
        priority: rightsShortlistCandidate ? "shortlist-for-human-rights-and-row-context-review" : "hold-for-license-resolution",
        rightsShortlistCandidate,
        publicationEligible: false,
      },
      disposition: "research-triage-only; province text is not a verified region, waterbody, or current-presence assertion",
    };
  }).sort((left, right) => {
    if (left.rightsScreen.rightsShortlistCandidate !== right.rightsScreen.rightsShortlistCandidate) {
      return left.rightsScreen.rightsShortlistCandidate ? -1 : 1;
    }
    return right.candidateOccurrenceRows - left.candidateOccurrenceRows || left.datasetId.localeCompare(right.datasetId);
  });

  const rightsShortlist = datasetSummaries.filter((dataset) => dataset.rightsScreen.rightsShortlistCandidate);
  const partitionText = privateCandidateRows.map((row) => JSON.stringify(row)).join("\n");
  const partitionBytes = Buffer.from(partitionText.length > 0 ? `${partitionText}\n` : "", "utf8");
  await mkdir(path.dirname(privatePartitionPath), { recursive: true });
  const temporaryPartitionPath = `${privatePartitionPath}.tmp`;
  await writeFile(temporaryPartitionPath, partitionBytes);
  await rename(temporaryPartitionPath, privatePartitionPath);
  const privateCandidatePartition = {
    path: path.relative(root, privatePartitionPath).replaceAll("\\", "/"),
    rows: privateCandidateRows.length,
    bytes: partitionBytes.byteLength,
    sha256: hash(partitionBytes),
    gitIgnored: true,
    appBundleIncluded: false,
    omittedPersonalFields: ["recordedBy", "identifiedBy", "dataset contact fields"],
    disposition: "local-only source review input; not a species catalog or publication approval",
  };
  const artifact = {
    schemaVersion: 1,
    status: "calabarzon-text-triage-review-pending",
    generatedOn: "2026-11-07",
    source: {
      provider: "OBIS",
      acquisitionJobId: receipt.jobId,
      acquisitionReceipt: "data/research/philippines/national/jobs/obis-ph-actinopterygii-area-191-v1.json",
      datasetRightsInventory: "data/research/philippines/national/reviews/obis-ph-actinopterygii-dataset-rights-20261107.json",
      queryHash: receipt.queryHash,
      providerArea: "Philippines area 191",
      providerTaxon: "Actinopterygii (ray-finned fishes)",
      receiptTotalRows: receipt.expectedTotal,
    },
    scope: {
      regionId: triage.regionId,
      selectionMethod: `case-insensitive exact text comparison against ${triage.administrativeField}; no point-in-polygon or source locality interpretation`,
      provinceTextLabels: triage.provinceTextLabels,
      sourceStatus: "coarse regional candidate queue only; review source-locality text and a versioned administrative boundary before assignment",
      coverageLimit: "This national OBIS slice covers one fish class only and is a marine/estuarine discovery feed. It is not a CALABARZON freshwater checklist or complete regional inventory.",
      safetyLimit: "No coordinates or individual locality strings are emitted in this report. Point precision and sensitive-species review remain required before any public map use.",
      occurrenceStatusLimit: "OBIS occurrenceStatus values are summarized as received and are not interpreted as presence; this slice contains missing and taxon-identifier-like values.",
      habitatLimit: "Provider marine/brackish flags may overlap and do not establish waterbody type or local salinity.",
    },
    summary: {
      scannedRows,
      matchedProvinceTextRows: matchedRows,
      matchedRowsWithPhilippinesCountry,
      matchedRowsMissingCountry,
      matchedRowsWithCoordinates,
      matchedRowsWithLocality,
      matchedRowsWithHigherGeography,
      matchedRowsWithoutCoordinateUncertainty,
      rowsByProvinceText,
      rightsShortlistDatasetCount: rightsShortlist.length,
      rightsShortlistRows: rightsShortlist.reduce((sum, dataset) => sum + dataset.candidateOccurrenceRows, 0),
      recordLicenseValueCountsInShortlistRows: sortCounts(recordLicenseValueCountsInShortlistRows),
      publicationEligibleRows: 0,
    },
    privateCandidatePartition,
    rightsShortlist,
    datasets: datasetSummaries,
  };

  await saveJson(outputPath, artifact);
  console.log(JSON.stringify({
    result: artifact.status,
    scannedRows,
    matchedProvinceTextRows: matchedRows,
    rowsByProvinceText,
    rightsShortlistDatasetCount: rightsShortlist.length,
    rightsShortlistRows: artifact.summary.rightsShortlistRows,
    privateCandidateRows: privateCandidatePartition.rows,
    privateCandidatePartitionSha256: privateCandidatePartition.sha256,
    publicationEligibleRows: 0,
    output: path.relative(root, outputPath).replaceAll("\\", "/"),
  }));
}

main().catch((error) => {
  console.error(`OBIS regional triage stopped: ${error.message}`);
  process.exitCode = 1;
});
