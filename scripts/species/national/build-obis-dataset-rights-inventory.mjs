import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const jobPath = path.join(root, "data/research/philippines/national/jobs/obis-ph-actinopterygii-area-191-v1.json");
const inventoryPath = path.join(root, "data/research/philippines/national/reviews/obis-ph-actinopterygii-dataset-rights-20261107.json");
const rawMetadataDirectory = path.join(root, "data/research/philippines/raw/national/obis-ph-actinopterygii-area-191-v1/datasets");
const apiBase = "https://api.obis.org/v3/dataset";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function saveJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

function licenseClass(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return "missing";
  if (/cc.?by.?nc|by-nc|non.?commercial/.test(text)) return "CC-BY-NC-or-noncommercial";
  if (/publicdomain\/zero|\bcc0\b|public domain/.test(text)) return "CC0-or-public-domain";
  if (/creativecommons.org\/(licenses\/)?by\/4\.0|\bcc.?by\b/.test(text)) return "CC-BY-or-CC-BY-4.0";
  if (/cc.?by.?sa/.test(text)) return "CC-BY-SA-or-sharealike";
  return "unresolved-license-text";
}

function licenseReviewFlags(datasetClass, recordClasses) {
  const resolvedClasses = new Set(["CC-BY-NC-or-noncommercial", "CC0-or-public-domain", "CC-BY-or-CC-BY-4.0"]);
  const resolvedRecordClasses = [...new Set(recordClasses.filter((value) => resolvedClasses.has(value)))];
  const flags = [];
  if (resolvedRecordClasses.length > 1) flags.push("multiple-record-license-classes-in-one-dataset");
  if (resolvedRecordClasses.length === 1 && resolvedClasses.has(datasetClass) && resolvedRecordClasses[0] !== datasetClass) {
    flags.push("dataset-and-record-license-classes-differ");
  }
  if (!resolvedClasses.has(datasetClass)) flags.push("dataset-rights-text-needs-manual-interpretation");
  if (recordClasses.some((value) => value === "missing" || value === "unresolved-license-text")) {
    flags.push("record-license-missing-or-unresolved");
  }
  if (datasetClass === "CC-BY-NC-or-noncommercial") flags.push("noncommercial-reuse-terms-require-use-specific-review");
  return flags;
}

function increment(map, key) {
  const value = String(key ?? "MISSING").trim() || "MISSING";
  map[value] = (map[value] ?? 0) + 1;
}

async function fetchDataset(datasetId) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(`${apiBase}/${encodeURIComponent(datasetId)}`, {
        headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (OBIS dataset rights inventory)" },
        signal: AbortSignal.timeout(45_000),
      });
      if (response.status === 429 || response.status >= 500) {
        if (attempt === 4) throw new Error(`OBIS metadata HTTP ${response.status}`);
        const retryAfter = Number(response.headers.get("retry-after"));
        await response.body?.cancel();
        await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(30_000, retryAfter * 1000) : (attempt + 1) * 1000);
        continue;
      }
      if (!response.ok) throw new Error(`OBIS metadata HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const body = JSON.parse(bytes.toString("utf8"));
      const results = Array.isArray(body.results) ? body.results : [];
      if (Number(body.total) !== 1 || results.length !== 1 || results[0].id !== datasetId) {
        throw new Error("OBIS dataset endpoint returned an unexpected dataset identity");
      }
      const data = results[0];
      const selected = {
        id: data.id,
        title: data.title ?? null,
        citation: data.citation ?? null,
        citationId: data.citation_id ?? null,
        url: data.url ?? null,
        archive: data.archive ?? null,
        published: data.published ?? null,
        created: data.created ?? null,
        updated: data.updated ?? null,
        intellectualRights: typeof data.intellectualrights === "string" ? data.intellectualrights.slice(0, 500) : null,
        statistics: data.statistics ?? null,
      };
      return { selected, responseBytes: bytes.length, responseSha256: hash(bytes) };
    } catch (error) {
      lastError = error;
      if (attempt === 4 || !/fetch failed|timed out|metadata HTTP 5/i.test(String(error))) break;
      await delay((attempt + 1) * 1000);
    }
  }
  return { error: String(lastError?.message ?? "metadata fetch failed").slice(0, 160) };
}

async function main() {
  const receipt = JSON.parse(await readFile(jobPath, "utf8"));
  if (!new Set(["downloaded-review-pending", "downloaded-dataset-rights-review-pending", "research-candidates-indexed-review-pending"]).has(receipt.status)
      || !Array.isArray(receipt.pages) || !receipt.expectedTotal) {
    throw new Error("A complete OBIS occurrence snapshot is required before rights inventory");
  }

  const datasets = new Map();
  let rowCount = 0;
  let missingDatasetIdRows = 0;
  for (const page of receipt.pages) {
    const compressed = await readFile(path.join(root, page.rawPath));
    if (hash(compressed) !== page.compressedSha256) throw new Error(`Raw page checksum mismatch: ${page.pageNumber}`);
    const response = gunzipSync(compressed);
    if (hash(response) !== page.responseSha256) throw new Error(`Response checksum mismatch: ${page.pageNumber}`);
    const rows = JSON.parse(response.toString("utf8")).results;
    if (!Array.isArray(rows) || rows.length !== page.returnedRows) throw new Error(`Page row count mismatch: ${page.pageNumber}`);
    for (const row of rows) {
      rowCount += 1;
      const datasetId = String(row.dataset_id ?? "").trim();
      if (!datasetId) {
        missingDatasetIdRows += 1;
        continue;
      }
      const summary = datasets.get(datasetId) ?? {
        datasetId,
        records: 0,
        scientificNames: new Set(),
        recordLicenseCounts: {},
        basisOfRecordCounts: {},
        occurrenceStatusCounts: {},
        recordLicenseClasses: new Set(),
      };
      summary.records += 1;
      if (row.species) summary.scientificNames.add(String(row.species));
      increment(summary.recordLicenseCounts, row.license);
      increment(summary.basisOfRecordCounts, row.basisOfRecord);
      increment(summary.occurrenceStatusCounts, row.occurrenceStatus);
      summary.recordLicenseClasses.add(licenseClass(row.license));
      datasets.set(datasetId, summary);
    }
  }
  if (rowCount !== receipt.expectedTotal) throw new Error(`Occurrence count mismatch: ${rowCount}/${receipt.expectedTotal}`);

  const datasetEntries = [...datasets.values()].sort((left, right) => left.datasetId.localeCompare(right.datasetId));
  const rows = [];
  for (const [index, summary] of datasetEntries.entries()) {
    const fetched = await fetchDataset(summary.datasetId);
    if (fetched.error) {
      rows.push({
        datasetId: summary.datasetId,
        occurrenceRows: summary.records,
        distinctSpeciesNames: summary.scientificNames.size,
        recordLicenseCounts: summary.recordLicenseCounts,
        recordLicenseClasses: [...summary.recordLicenseClasses].sort(),
        datasetMetadataStatus: "not-retrieved",
        metadataError: fetched.error,
        disposition: "hold-for-manual-rights-review",
        publicationEligible: false,
      });
    } else {
      const metadataFile = path.join(rawMetadataDirectory, `${summary.datasetId}.json`);
      const sanitizedBytes = Buffer.from(`${JSON.stringify(fetched.selected, null, 2)}\n`, "utf8");
      await saveJson(metadataFile, fetched.selected);
      const metadataLicenseClass = licenseClass(fetched.selected.intellectualRights);
      const rowClasses = [...summary.recordLicenseClasses].sort();
      const reviewFlags = licenseReviewFlags(metadataLicenseClass, rowClasses);
      rows.push({
        datasetId: summary.datasetId,
        occurrenceRows: summary.records,
        distinctSpeciesNames: summary.scientificNames.size,
        recordLicenseCounts: summary.recordLicenseCounts,
        recordLicenseClasses: rowClasses,
        datasetMetadataStatus: "retrieved-sanitized",
        datasetTitle: fetched.selected.title,
        datasetUrl: fetched.selected.url,
        datasetArchiveUrl: fetched.selected.archive,
        datasetUpdated: fetched.selected.updated,
        datasetCitation: fetched.selected.citation,
        datasetRightsText: fetched.selected.intellectualRights,
        datasetLicenseClass: metadataLicenseClass,
        licenseReviewFlags: reviewFlags,
        recordDatasetRightsConflict: reviewFlags.includes("dataset-and-record-license-classes-differ"),
        rightsReviewRequired: true,
        datasetStatistics: fetched.selected.statistics,
        metadataResponseBytes: fetched.responseBytes,
        metadataResponseSha256: fetched.responseSha256,
        sanitizedMetadataPath: path.relative(root, metadataFile).replaceAll("\\", "/"),
        sanitizedMetadataBytes: sanitizedBytes.length,
        sanitizedMetadataSha256: hash(sanitizedBytes),
        basisOfRecordCounts: summary.basisOfRecordCounts,
        occurrenceStatusCounts: summary.occurrenceStatusCounts,
        disposition: "hold-for-manual-rights-and-record-context-review",
        publicationEligible: false,
      });
    }
    if ((index + 1) % 10 === 0 || index === datasetEntries.length - 1) {
      console.log(JSON.stringify({ datasetsReviewed: index + 1, datasetTotal: datasetEntries.length }));
    }
    await delay(250);
  }

  const inventory = {
    schemaVersion: 1,
    status: "dataset-metadata-inventoried; manual-rights-review-required",
    generatedAtUtc: new Date().toISOString(),
    acquisitionJobId: receipt.jobId,
    acquisitionReceipt: "data/research/philippines/national/jobs/obis-ph-actinopterygii-area-191-v1.json",
    queryHash: receipt.queryHash,
    scopeLimit: "OBIS Philippines area and Actinopterygii only; discovery scope, not local waterbody evidence or a complete fish taxonomy",
    occurrenceCounts: {
      expectedProviderRows: receipt.expectedTotal,
      rowsScanned: rowCount,
      uniqueDatasetIds: datasets.size,
      rowsMissingDatasetId: missingDatasetIdRows,
      datasetMetadataRetrieved: rows.filter((row) => row.datasetMetadataStatus === "retrieved-sanitized").length,
      datasetMetadataFailed: rows.filter((row) => row.datasetMetadataStatus === "not-retrieved").length,
      rowsInMixedRecordLicenseDatasets: rows.filter((row) => row.licenseReviewFlags?.includes("multiple-record-license-classes-in-one-dataset")).reduce((sum, row) => sum + row.occurrenceRows, 0),
      rowsWithResolvedDatasetRecordLicenseMismatch: rows.filter((row) => row.recordDatasetRightsConflict).reduce((sum, row) => sum + row.occurrenceRows, 0),
      rowsWithUnresolvedDatasetRights: rows.filter((row) => row.licenseReviewFlags?.includes("dataset-rights-text-needs-manual-interpretation")).reduce((sum, row) => sum + row.occurrenceRows, 0),
      rowsWithMissingOrUnresolvedRecordLicense: rows.filter((row) => row.licenseReviewFlags?.includes("record-license-missing-or-unresolved")).reduce((sum, row) => sum + row.occurrenceRows, 0),
      publicationEligibleRows: 0,
    },
    licenseReviewPolicy: "Record license fields and dataset intellectual-rights metadata are distinct evidence. Mixed values, mismatches, missing or unresolved values remain held; lexical classes are screening hints, not legal conclusions or automated reuse approval.",
    personalDataPolicy: "Contributor contact fields returned by the provider API are excluded from sanitized local metadata snapshots and this inventory.",
    datasets: rows,
  };
  await saveJson(inventoryPath, inventory);

  receipt.datasetRightsInventory = {
    path: path.relative(root, inventoryPath).replaceAll("\\", "/"),
    generatedAtUtc: inventory.generatedAtUtc,
    uniqueDatasetIds: datasets.size,
    metadataRetrieved: inventory.occurrenceCounts.datasetMetadataRetrieved,
    metadataFailed: inventory.occurrenceCounts.datasetMetadataFailed,
    publicationEligibleRows: 0,
  };
  receipt.status = receipt.taxonCandidateIndex
    ? "research-candidates-indexed-review-pending"
    : "downloaded-dataset-rights-review-pending";
  receipt.updatedAtUtc = new Date().toISOString();
  await saveJson(jobPath, receipt);
  console.log(JSON.stringify({ result: "rights-inventory-built", ...inventory.occurrenceCounts, inventory: path.relative(root, inventoryPath).replaceAll("\\", "/") }));
}

main().catch((error) => {
  console.error(`OBIS rights inventory stopped: ${error.message}`);
  process.exitCode = 1;
});
