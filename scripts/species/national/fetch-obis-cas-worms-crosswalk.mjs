import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const inputPath = path.join(root, "data/research/philippines/raw/national/obis-ph-actinopterygii-calabarzon-rights-shortlist-v1.jsonl");
const rowReviewPath = path.join(root, "data/research/philippines/national/reviews/obis-cas-ich-calabarzon-row-context-review-20261107.json");
const runDate = new Date().toISOString().slice(0, 10);
const runDateCompact = runDate.replaceAll("-", "");
const outputPath = path.join(root, `data/research/philippines/national/reviews/obis-cas-ich-calabarzon-worms-crosswalk-${runDateCompact}.json`);
const cacheRoot = path.join(root, "data/research/philippines/raw/national");
const batchSize = 50;
const refresh = process.argv.includes("--refresh");
const endpoint = "https://www.marinespecies.org/rest/AphiaRecordsByAphiaIDs";
const hash = (data) => createHash("sha256").update(data).digest("hex");
const normalize = (value) => String(value ?? "").trim().normalize("NFKC").toLocaleLowerCase("en");
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";

function sortedCounts(counts) {
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function increment(counts, value) {
  const key = hasValue(value) ? String(value).trim() : "MISSING";
  counts[key] = (counts[key] ?? 0) + 1;
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);
}

async function requestBatch(ids) {
  const url = new URL(endpoint);
  for (const id of ids) url.searchParams.append("aphiaids[]", String(id));
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research-source-review/0.1" },
      signal: AbortSignal.timeout(30000),
    });
    if (response.ok) {
      const body = await response.json();
      if (!Array.isArray(body)) throw new Error(`WoRMS returned a non-list payload for ${ids.length} AphiaIDs`);
      return { status: response.status, body };
    }
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === 4) {
      const body = (await response.text()).slice(0, 500);
      throw new Error(`WoRMS HTTP ${response.status}: ${body}`);
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1));
  }
  throw new Error("WoRMS request retries exhausted");
}

async function loadCachedBatch(filePath, requestHash, ids) {
  if (refresh) return null;
  try {
    const cached = JSON.parse(await readFile(filePath, "utf8"));
    if (cached.requestHash !== requestHash
      || JSON.stringify(cached.requestedAphiaIds) !== JSON.stringify(ids)
      || !Array.isArray(cached.responses)) return null;
    return cached;
  } catch {
    return null;
  }
}

async function main() {
  const [wrappedText, rowReview] = await Promise.all([
    readFile(inputPath, "utf8"),
    readFile(rowReviewPath, "utf8").then(JSON.parse),
  ]);
  const rawRows = wrappedText.trimEnd().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const rows = rawRows.map((item) => item.sourceRecord);
  if (rows.length !== rowReview.rowProfile.rows || rowReview.source.localInputSha256 !== hash(wrappedText)) {
    throw new Error("The local CAS partition no longer matches its reviewed row-context profile");
  }
  const aphiaIds = [...new Set(rows.map((row) => Number(row.aphiaID))
    .filter((value) => Number.isSafeInteger(value) && value > 0))].sort((left, right) => left - right);
  const queryHash = hash(JSON.stringify(aphiaIds));
  const refreshSuffix = refresh ? `-${new Date().toISOString().replaceAll(/[:.]/g, "")}` : "";
  const cacheDirectory = path.join(cacheRoot, `obis-cas-worms-crosswalk-${queryHash.slice(0, 12)}${refreshSuffix}`);
  await mkdir(cacheDirectory, { recursive: true });
  const recordsById = new Map();
  const batchReceipts = [];

  for (let offset = 0; offset < aphiaIds.length; offset += batchSize) {
    const ids = aphiaIds.slice(offset, offset + batchSize);
    const batchNumber = Math.floor(offset / batchSize) + 1;
    const requestHash = hash(JSON.stringify(ids));
    const filePath = path.join(cacheDirectory, `batch-${String(batchNumber).padStart(3, "0")}.json`);
    let cached = await loadCachedBatch(filePath, requestHash, ids);
    const cacheHit = Boolean(cached);
    if (!cached) {
      const result = await requestBatch(ids);
      cached = {
        schemaVersion: 1,
        requestHash,
        requestedAphiaIds: ids,
        retrievedAtUtc: new Date().toISOString(),
        httpStatus: result.status,
        responses: result.body,
      };
      await writeJson(filePath, cached);
      await delay(250);
    }
    for (const record of cached.responses) {
      if (record && Number.isSafeInteger(Number(record.AphiaID))) {
        const id = Number(record.AphiaID);
        if (recordsById.has(id)) throw new Error(`WoRMS returned duplicate AphiaID ${id}`);
        recordsById.set(id, record);
      }
    }
    batchReceipts.push({
      batch: batchNumber,
      requestedIds: ids.length,
      responses: cached.responses.length,
      responseRetrievedAtUtc: cached.retrievedAtUtc,
      cacheHit,
      sha256: hash(await readFile(filePath)),
    });
    console.log(`WoRMS batch ${batchNumber}: ${ids.length} requested, ${cached.responses.length} returned (${cacheHit ? "cache" : "live"})`);
  }

  const acceptedTargetIds = [...new Set([...recordsById.values()]
    .map((record) => Number(record.valid_AphiaID))
    .filter((id) => Number.isSafeInteger(id) && id > 0 && !recordsById.has(id)))].sort((left, right) => left - right);
  const acceptedTargetReceipts = [];
  const acceptedTargetsById = new Map();
  for (let offset = 0; offset < acceptedTargetIds.length; offset += batchSize) {
    const ids = acceptedTargetIds.slice(offset, offset + batchSize);
    const batchNumber = Math.floor(offset / batchSize) + 1;
    const requestHash = hash(JSON.stringify(ids));
    const filePath = path.join(cacheDirectory, `accepted-targets-${String(batchNumber).padStart(3, "0")}.json`);
    let cached = await loadCachedBatch(filePath, requestHash, ids);
    const cacheHit = Boolean(cached);
    if (!cached) {
      const result = await requestBatch(ids);
      cached = {
        schemaVersion: 1,
        requestHash,
        requestedAphiaIds: ids,
        retrievedAtUtc: new Date().toISOString(),
        httpStatus: result.status,
        responses: result.body,
      };
      await writeJson(filePath, cached);
      await delay(250);
    }
    for (const record of cached.responses) {
      if (record && Number.isSafeInteger(Number(record.AphiaID))) {
        acceptedTargetsById.set(Number(record.AphiaID), record);
      }
    }
    acceptedTargetReceipts.push({
      batch: batchNumber,
      requestedIds: ids.length,
      responses: cached.responses.length,
      responseRetrievedAtUtc: cached.retrievedAtUtc,
      cacheHit,
      sha256: hash(await readFile(filePath)),
    });
    console.log(`WoRMS accepted-name targets ${batchNumber}: ${ids.length} requested, ${cached.responses.length} returned (${cacheHit ? "cache" : "live"})`);
  }

  const missingIds = aphiaIds.filter((id) => !recordsById.has(id));
  const responseStatuses = {};
  const responseRanks = {};
  let returnedValidIdMatches = 0;
  let recordsMissingValidAphiaId = 0;
  let recordsRedirectingToAnotherValidAphiaId = 0;
  let returnedAcceptedNameDiffers = 0;
  let acceptedTargetNameMatches = 0;
  let acceptedTargetNameDiffers = 0;
  let acceptedTargetRecordsMissing = 0;
  const acceptedTargetStatuses = {};
  for (const [id, record] of recordsById) {
    increment(responseStatuses, record.status);
    increment(responseRanks, record.rank);
    if (!hasValue(record.valid_AphiaID)) recordsMissingValidAphiaId += 1;
    else if (Number(record.valid_AphiaID) === id) returnedValidIdMatches += 1;
    else recordsRedirectingToAnotherValidAphiaId += 1;
    if (hasValue(record.valid_name) && normalize(record.valid_name) !== normalize(record.scientificname)) {
      returnedAcceptedNameDiffers += 1;
    }
    if (hasValue(record.valid_AphiaID) && Number(record.valid_AphiaID) !== id) {
      const targetRecord = acceptedTargetsById.get(Number(record.valid_AphiaID)) ?? recordsById.get(Number(record.valid_AphiaID));
      if (!targetRecord) {
        acceptedTargetRecordsMissing += 1;
      } else {
        increment(acceptedTargetStatuses, targetRecord.status);
        if (hasValue(record.valid_name) && normalize(record.valid_name) === normalize(targetRecord.scientificname)) {
          acceptedTargetNameMatches += 1;
        } else if (hasValue(record.valid_name)) {
          acceptedTargetNameDiffers += 1;
        }
      }
    }
  }

  const recordById = new Map(rows.map((row) => [Number(row.aphiaID), row]));
  let sourceNameMatches = 0;
  let sourceNameDiffers = 0;
  for (const [id, record] of recordsById) {
    const source = recordById.get(id);
    if (!source || !hasValue(source.scientificName) || !hasValue(record.scientificname)) continue;
    if (normalize(source.scientificName) === normalize(record.scientificname)) sourceNameMatches += 1;
    else sourceNameDiffers += 1;
  }

  const responseTimes = [...batchReceipts, ...acceptedTargetReceipts]
    .map((receipt) => receipt.responseRetrievedAtUtc)
    .filter(Boolean)
    .sort();
  const artifact = {
    schemaVersion: 1,
    reviewId: `obis-cas-ich-calabarzon-worms-crosswalk-${runDateCompact}`,
    generatedOn: runDate,
    status: missingIds.length === 0 ? "worms-crosswalk-acquired; expert-and-checklist-review-pending" : "worms-crosswalk-partial; unresolved-aphiaids-held",
    source: {
      provider: "WoRMS / Aphia",
      endpoint,
      method: "AphiaRecordsByAphiaIDs with repeated aphiaids[] query parameters; maximum 50 IDs per request",
      apiDocumentation: "https://www.marinespecies.org/rest/",
      termsOfUse: "https://www.marinespecies.org/usersrequest.php",
      accessedCitation: `WoRMS Editorial Board (2026). World Register of Marine Species. Available from https://www.marinespecies.org at VLIZ. Accessed ${runDate}. doi:10.14284/170`,
      sourceOccurrenceRows: rows.length,
      uniqueInputAphiaIds: aphiaIds.length,
      queryAphiaIdsSha256: queryHash,
      responseCache: path.relative(root, cacheDirectory).replaceAll("\\", "/"),
      responseCacheGitIgnored: true,
      responseSnapshotRetrievedAtUtcRange: responseTimes.length > 0
        ? [responseTimes[0], responseTimes.at(-1)]
        : null,
      batchReceipts,
      acceptedNameTargetReceipts: acceptedTargetReceipts,
    },
    crosswalk: {
      requestedAphiaIds: aphiaIds.length,
      returnedRecords: recordsById.size,
      missingAphiaIds: missingIds.length,
      recordsWithValidAphiaIdEqualToInput: returnedValidIdMatches,
      recordsMissingValidAphiaId,
      recordsRedirectingToAnotherValidAphiaId,
      recordsWithDifferentAcceptedNameField: returnedAcceptedNameDiffers,
      distinctAcceptedTargetIdsOutsideRequestedSet: acceptedTargetIds.length,
      acceptedTargetRecordsReturned: acceptedTargetsById.size,
      acceptedTargetRecordsMissing,
      acceptedTargetNameFieldMatchesTargetRecord: acceptedTargetNameMatches,
      acceptedTargetNameFieldDiffersFromTargetRecord: acceptedTargetNameDiffers,
      acceptedTargetStatusCounts: sortedCounts(acceptedTargetStatuses),
      statusCounts: sortedCounts(responseStatuses),
      rankCounts: sortedCounts(responseRanks),
      sourceScientificNameExactMatchCount: sourceNameMatches,
      sourceScientificNameDifferentFromWoRMSCount: sourceNameDiffers,
      interpretation: "WoRMS provides a marine-taxonomy crosswalk. Differences and accepted-name pointers need review against a pinned fish checklist; this response does not validate local occurrence, habitat, or Philippine presence.",
    },
    reuseConditions: {
      disposition: "internal research crosswalk only; returned taxon names and classifications are not copied into this tracked artifact or the app",
      citationAndLinkRequiredForDistribution: true,
      refreshAtLeastFourTimesPerYearIfDistributingWoRMSContent: true,
      doNotRedistributeEntireDatabase: true,
      reviewTermsAgainBeforeAppIntegration: true,
    },
    publication: {
      eligibleSpecies: 0,
      reason: "A provider identifier match alone does not establish accepted Bangwit taxonomy, locality, waterbody association, coordinate safety, or current presence.",
    },
    privacy: {
      exactCoordinatesIncluded: false,
      localityStringsIncluded: false,
      occurrenceIdentifiersIncluded: false,
      taxonNamesReturnedByWoRMSIncluded: false,
    },
  };
  await writeJson(outputPath, artifact);
  console.log(`Wrote ${path.relative(root, outputPath).replaceAll("\\", "/")}`);
  console.log(`Crosswalk: ${recordsById.size}/${aphiaIds.length}; input name matches ${sourceNameMatches}, differences ${sourceNameDiffers}; publication eligible 0.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
