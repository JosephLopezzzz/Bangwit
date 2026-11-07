import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const configPath = path.join(root, "data/research/philippines/national/acquisition-config.json");
const triagePath = path.join(root, "data/research/philippines/national/reviews/obis-ph-actinopterygii-calabarzon-triage-20261107.json");
const rightsPath = path.join(root, "data/research/philippines/national/reviews/obis-cas-ich-cc0-rights-review-20261107.json");
const inputPath = path.join(root, "data/research/philippines/raw/national/obis-ph-actinopterygii-calabarzon-rights-shortlist-v1.jsonl");
const outputPath = path.join(root, "data/research/philippines/national/reviews/obis-cas-ich-calabarzon-row-context-review-20261107.json");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const normalize = (value) => String(value ?? "").trim().normalize("NFKC").toLocaleLowerCase("en");
const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";
const isNumeric = (value) => hasValue(value) && Number.isFinite(Number(value));
const hasCoordinates = (record) => isNumeric(record.decimalLatitude) && isNumeric(record.decimalLongitude);

function countBy(rows, selector) {
  const counts = {};
  for (const row of rows) {
    const selected = selector(row);
    const key = hasValue(selected) ? String(selected).trim() : "MISSING";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function uniqueCount(rows, selector) {
  return new Set(rows.map(selector).filter(hasValue).map((value) => String(value).trim())).size;
}

function hasRestrictedOutputKey(value) {
  const restrictedKeys = new Set([
    "decimalLatitude", "decimalLongitude", "locality", "verbatimLocality", "occurrenceID",
    "catalogNumber", "recordedBy", "identifiedBy", "datasetContact",
  ]);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, nested]) => restrictedKeys.has(key)
    || hasRestrictedOutputKey(nested));
}

function relationshipConflicts(rows, leftKey, rightKey) {
  const rightValuesByLeft = new Map();
  for (const row of rows) {
    const left = normalize(row[leftKey]);
    const right = normalize(row[rightKey]);
    if (!left || !right) continue;
    const values = rightValuesByLeft.get(left) ?? new Set();
    values.add(right);
    rightValuesByLeft.set(left, values);
  }
  return [...rightValuesByLeft.values()].filter((values) => values.size > 1).length;
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);
}

async function main() {
  const [config, triage, rightsReview, inputBytes] = await Promise.all([
    readFile(configPath, "utf8").then(JSON.parse),
    readFile(triagePath, "utf8").then(JSON.parse),
    readFile(rightsPath, "utf8").then(JSON.parse),
    readFile(inputPath),
  ]);
  const expectedPartition = triage.privateCandidatePartition;
  const inputHash = sha256(inputBytes);
  if (inputHash !== expectedPartition.sha256 || inputBytes.byteLength !== expectedPartition.bytes) {
    throw new Error("Local candidate partition hash or size does not match the reviewed triage receipt");
  }
  if (rightsReview.dataset.datasetId !== "d6af0fac-8a21-4d77-8872-f10d471fc0cf"
    || rightsReview.publicationDecision.eligible !== false) {
    throw new Error("The CAS rights review is missing or no longer holds publication");
  }

  const lines = inputBytes.toString("utf8").trimEnd().split(/\r?\n/).filter(Boolean);
  const wrappedRows = lines.map((line) => JSON.parse(line));
  const rows = wrappedRows.map((wrapper) => wrapper.sourceRecord);
  if (rows.some((row) => !row || typeof row !== "object")) {
    throw new Error("Candidate partition contains a row without a sourceRecord object");
  }
  if (rows.length !== expectedPartition.rows) {
    throw new Error(`Candidate row count does not reconcile: ${rows.length}/${expectedPartition.rows}`);
  }

  const region = config.regionalTriage;
  const provinceLabels = new Set(region.provinceTextLabels.map(normalize));
  const provinceTextRows = rows.filter((row) => provinceLabels.has(normalize(row[region.administrativeField])));
  const uniqueOccurrenceIds = uniqueCount(rows, (row) => row.occurrenceID);
  const namedRows = rows.filter((row) => hasValue(row.scientificName));
  const namesByAphia = relationshipConflicts(rows, "scientificName", "aphiaID");
  const aphiaByName = relationshipConflicts(rows, "aphiaID", "scientificName");
  const nameSpeciesMismatchRows = rows.filter((row) => hasValue(row.scientificName)
    && hasValue(row.species) && normalize(row.scientificName) !== normalize(row.species)).length;
  const originalNameMismatchRows = rows.filter((row) => hasValue(row.scientificName)
    && hasValue(row.originalScientificName)
    && normalize(row.scientificName) !== normalize(row.originalScientificName)).length;
  const aphiaSpeciesIdMismatchRows = rows.filter((row) => hasValue(row.aphiaID)
    && hasValue(row.speciesid) && String(row.aphiaID).trim() !== String(row.speciesid).trim()).length;
  const marineRows = rows.filter((row) => row.marine === true).length;
  const brackishRows = rows.filter((row) => row.brackish === true).length;
  const uncertaintyRows = rows.filter((row) => isNumeric(row.coordinateUncertaintyInMeters)).length;
  const review = {
    schemaVersion: 1,
    reviewId: "obis-cas-ich-calabarzon-row-context-review-20261107",
    generatedOn: "2026-11-07",
    status: "row-context-profiled; taxonomic-and-geographic-validation-pending",
    source: {
      provider: "OBIS",
      datasetId: rightsReview.dataset.datasetId,
      datasetVersion: rightsReview.versionReconciliation.publisherRecordVersion,
      datasetCitation: rightsReview.evidence.find((item) => item.source.includes("publisher record"))?.citation,
      acquisitionTriage: "data/research/philippines/national/reviews/obis-ph-actinopterygii-calabarzon-triage-20261107.json",
      rightsReview: "data/research/philippines/national/reviews/obis-cas-ich-cc0-rights-review-20261107.json",
      localInput: expectedPartition.path,
      localInputRows: rows.length,
      localInputBytes: inputBytes.byteLength,
      localInputSha256: inputHash,
      inputGitIgnored: true,
      inputIncludedInAppBundle: false,
    },
    scope: {
      regionId: region.regionId,
      regionMethod: "exact province-text labels only; this profile performs no point-in-polygon assignment",
      provinceTextLabels: region.provinceTextLabels,
      assignedToRegionByThisReview: false,
      publicationEligible: false,
    },
    rowProfile: {
      rows: rows.length,
      uniqueOccurrenceIds,
      duplicateOccurrenceIdRows: rows.length - uniqueOccurrenceIds,
      countryCounts: countBy(rows, (row) => row.country),
      provinceTextCounts: countBy(rows, (row) => row.stateProvince),
      localityTextPresentRows: rows.filter((row) => hasValue(row.locality)).length,
      higherGeographyTextPresentRows: rows.filter((row) => hasValue(row.higherGeography)).length,
      waterBodyTextPresentRows: rows.filter((row) => hasValue(row.waterBody)).length,
      waterBodyDistinctValueCount: uniqueCount(rows, (row) => row.waterBody),
      coordinatesPresentRows: rows.filter(hasCoordinates).length,
      coordinateUncertaintyPresentRows: uncertaintyRows,
      coordinateUncertaintyMissingRows: rows.length - uncertaintyRows,
      eventDatePresentRows: rows.filter((row) => hasValue(row.eventDate)).length,
      taxonRankCounts: countBy(rows, (row) => row.taxonRank),
      basisOfRecordCounts: countBy(rows, (row) => row.basisOfRecord),
      occurrenceStatusCounts: countBy(rows, (row) => row.occurrenceStatus),
      recordLicenseCounts: countBy(rows, (row) => row.license),
      providerMarineFlagRows: marineRows,
      providerBrackishFlagRows: brackishRows,
      providerFlagOverlapRows: rows.filter((row) => row.marine === true && row.brackish === true).length,
      providerAbsenceFlagRows: rows.filter((row) => row.absence === true).length,
      providerDroppedFlagRows: rows.filter((row) => row.dropped === true).length,
    },
    taxonFieldProfile: {
      namedRows: namedRows.length,
      distinctScientificNameStrings: uniqueCount(rows, (row) => row.scientificName),
      rowsWithAphiaId: rows.filter((row) => hasValue(row.aphiaID)).length,
      distinctAphiaIdCount: uniqueCount(rows, (row) => row.aphiaID),
      rowsWithSpeciesId: rows.filter((row) => hasValue(row.speciesid)).length,
      distinctSpeciesIdCount: uniqueCount(rows, (row) => row.speciesid),
      rowsWithTaxonId: rows.filter((row) => hasValue(row.taxonID)).length,
      distinctTaxonIdCount: uniqueCount(rows, (row) => row.taxonID),
      scientificNameToMultipleAphiaIdGroups: namesByAphia,
      aphiaIdToMultipleScientificNameGroups: aphiaByName,
      scientificNameSpeciesFieldMismatchRows: nameSpeciesMismatchRows,
      scientificNameOriginalNameMismatchRows: originalNameMismatchRows,
      aphiaIdSpeciesIdMismatchRows: aphiaSpeciesIdMismatchRows,
      disposition: "provider identity fields are profiled separately; no accepted name or taxonomy is asserted",
    },
    privacy: {
      exactCoordinatesIncluded: false,
      localityStringsIncluded: false,
      recordIdentifiersIncluded: false,
      personalObserverOrDeterminerFieldsIncluded: false,
      rawCandidateInputRemainsLocalOnly: true,
    },
    reviewQueues: {
      provinceTextRowsAwaitingBoundaryCheck: provinceTextRows.length,
      taxonomicIdentity: "needs crosswalk to a pinned fish checklist; candidate name counts are not accepted taxa",
      localityAndWaterbody: "review original source locality locally and compare against a versioned boundary/waterbody source",
      coordinateSafety: "review precision and sensitive-taxon risk locally before any public mapping",
      currentPresence: "not asserted; collection event is historical evidence, not a current-presence determination",
      freshwaterCoverage: "not established by this OBIS marine/estuarine discovery source",
      admittedRows: 0,
      heldRows: rows.length,
    },
  };
  if (hasRestrictedOutputKey(review)) {
    throw new Error("Tracked review output contains a restricted record-level field");
  }
  await writeJson(outputPath, review);
  console.log(`Wrote ${path.relative(root, outputPath).replaceAll("\\", "/")}`);
  console.log(`Rows profiled: ${rows.length}; unique occurrence IDs: ${uniqueOccurrenceIds}; admitted: 0`);
  console.log("Exact coordinates and locality strings were excluded from the tracked report.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
