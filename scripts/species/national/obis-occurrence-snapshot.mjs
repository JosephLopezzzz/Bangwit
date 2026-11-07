import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { gzipSync, gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const api = "https://api.obis.org/v3/occurrence";
const jobId = "obis-ph-actinopterygii-area-191-v1";
const areaId = "191";
const taxonId = "10194";
const pageSize = 1000;
const jobPath = path.join(root, "data/research/philippines/national/jobs", `${jobId}.json`);
const rawRelativePath = `data/research/philippines/raw/national/${jobId}`;
const rawDirectory = path.join(root, rawRelativePath);
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const query = {
  endpoint: api,
  areaId,
  areaMeaning: "OBIS Philippines area used only for national-scale discovery; not a local or legal boundary",
  taxonId,
  taxonName: "Actinopterygii",
  taxonMeaning: "ray-finned fishes only; not all fish groups",
  size: pageSize,
};
const queryHash = hash(Buffer.from(JSON.stringify(query)));

function jsonBytes(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function saveJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, jsonBytes(value));
  await rename(temporary, target);
}

async function getJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "Bangwit-research/1.0 (OBIS public-data acquisition)",
        },
        signal: AbortSignal.timeout(45_000),
      });
      if (response.status === 429 || response.status >= 500) {
        if (attempt === 4) throw new Error(`OBIS transient HTTP ${response.status}`);
        const retryAfter = Number(response.headers.get("retry-after"));
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, 30_000)
          : 1000 * (attempt + 1);
        await response.body?.cancel();
        await sleep(waitMs);
        continue;
      }
      if (!response.ok) throw new Error(`OBIS HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      let data;
      try {
        data = JSON.parse(bytes.toString("utf8"));
      } catch {
        throw new Error("OBIS returned invalid JSON");
      }
      return { bytes, data };
    } catch (error) {
      lastError = error;
      if (attempt === 4 || !/fetch failed|timed out|transient HTTP/i.test(String(error))) break;
      await sleep(1000 * (attempt + 1));
    }
  }
  throw lastError ?? new Error("OBIS request failed");
}

function urlFor({ size, after }) {
  const url = new URL(api);
  url.searchParams.set("areaid", areaId);
  url.searchParams.set("taxonid", taxonId);
  url.searchParams.set("size", String(size));
  if (after !== null && after !== undefined) url.searchParams.set("after", String(after));
  return url;
}

async function loadReceipt() {
  try {
    const receipt = JSON.parse(await readFile(jobPath, "utf8"));
    if (receipt.jobId !== jobId || receipt.queryHash !== queryHash || !Array.isArray(receipt.pages)) {
      throw new Error("Existing acquisition receipt does not match the pinned query");
    }
    return receipt;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function verifyPageFiles(receipt) {
  for (const page of receipt.pages) {
    const file = path.join(root, page.rawPath);
    const compressed = await readFile(file);
    if (compressed.length !== page.compressedBytes || hash(compressed) !== page.compressedSha256) {
      throw new Error(`Raw page checksum mismatch: ${page.pageNumber}`);
    }
    const bytes = gunzipSync(compressed);
    if (bytes.length !== page.responseBytes || hash(bytes) !== page.responseSha256) {
      throw new Error(`Decompressed page checksum mismatch: ${page.pageNumber}`);
    }
    const body = JSON.parse(bytes.toString("utf8"));
    if (!Array.isArray(body.results) || body.results.length !== page.returnedRows) {
      throw new Error(`Raw page row count mismatch: ${page.pageNumber}`);
    }
  }
}

async function readEstimate() {
  const { data } = await getJson(urlFor({ size: 0, after: null }));
  const total = Number(data.total);
  if (!Number.isSafeInteger(total) || total < 0) throw new Error("OBIS count response has no valid total");
  return total;
}

async function estimate() {
  const previous = await loadReceipt();
  const total = await readEstimate();
  const receipt = previous ?? {
    schemaVersion: 1,
    jobId,
    provider: "OBIS",
    providerDownloadKey: null,
    query,
    queryHash,
    queryUrl: urlFor({ size: 0, after: null }).toString(),
    createdAtUtc: new Date().toISOString(),
    checkpoint: { after: null, pageCount: 0, rowCount: 0 },
    pages: [],
    rightsReview: "required-per-contributing-dataset",
    publicationEligible: false,
    rawDirectory: rawRelativePath,
  };

  if (receipt.pages.length > 0 && receipt.expectedTotal !== total) {
    receipt.status = "source-count-changed-review-required";
    receipt.lastObservedTotal = total;
  } else {
    receipt.status = receipt.pages.length > 0 ? receipt.status : "estimated";
    receipt.expectedTotal = total;
    receipt.estimatedAtUtc = new Date().toISOString();
  }
  await saveJson(jobPath, receipt);
  console.log(JSON.stringify({ jobId, status: receipt.status, expectedTotal: total, pageSize, queryHash }));
}

async function fetchSnapshot() {
  let receipt = await loadReceipt();
  if (receipt?.status === "source-count-changed-review-required") {
    throw new Error("Provider count changed since this job started; review the new snapshot before resuming");
  }
  if (receipt?.checkpoint?.rowCount === receipt.expectedTotal && receipt.pages.length > 0
      && new Set(["downloaded-review-pending", "downloaded-dataset-rights-review-pending", "research-candidates-indexed-review-pending"]).has(receipt.status)) {
    await verifyPageFiles(receipt);
    console.log(JSON.stringify({ jobId, status: receipt.status, pages: receipt.pages.length, retrieved: receipt.checkpoint.rowCount, alreadyComplete: true }));
    return;
  }
  if (!receipt) {
    const total = await readEstimate();
    receipt = {
      schemaVersion: 1,
      jobId,
      provider: "OBIS",
      providerDownloadKey: null,
      query,
      queryHash,
      queryUrl: urlFor({ size: 0, after: null }).toString(),
      createdAtUtc: new Date().toISOString(),
      estimatedAtUtc: new Date().toISOString(),
      expectedTotal: total,
      lastObservedTotal: total,
      checkpoint: { after: null, pageCount: 0, rowCount: 0 },
      pages: [],
      rightsReview: "required-per-contributing-dataset",
      publicationEligible: false,
      rawDirectory: rawRelativePath,
      status: "downloading",
    };
  } else {
    await verifyPageFiles(receipt);
    const latestTotal = await readEstimate();
    if (latestTotal !== receipt.expectedTotal) {
      receipt.status = "source-count-changed-review-required";
      receipt.lastObservedTotal = latestTotal;
      await saveJson(jobPath, receipt);
      throw new Error("Provider count changed during the acquisition; prior pages are preserved for review");
    }
    receipt.lastObservedTotal = latestTotal;
    receipt.status = "downloading";
  }
  await mkdir(rawDirectory, { recursive: true });
  await saveJson(jobPath, receipt);

  const seenIds = new Set();
  for (const page of receipt.pages) {
    const bytes = gunzipSync(await readFile(path.join(root, page.rawPath)));
    for (const row of JSON.parse(bytes.toString("utf8")).results) {
      if (row.id !== null && row.id !== undefined) seenIds.add(String(row.id));
    }
  }

  let after = receipt.checkpoint.after;
  let pageNumber = receipt.pages.length;
  let rowCount = receipt.checkpoint.rowCount;
  try {
    while (rowCount < receipt.expectedTotal) {
      const { bytes, data } = await getJson(urlFor({ size: pageSize, after }));
      if (!Array.isArray(data.results) || Number(data.total) !== receipt.expectedTotal) {
        receipt.status = "source-count-changed-review-required";
        receipt.lastObservedTotal = Number(data.total);
        await saveJson(jobPath, receipt);
        throw new Error("OBIS page total or result shape changed; resume is paused");
      }
      if (data.results.length === 0) break;

      const lastId = data.results.at(-1)?.id;
      if (lastId === null || lastId === undefined || String(lastId) === String(after)) {
        throw new Error("OBIS cursor did not advance; acquisition is paused");
      }
      for (const row of data.results) {
        if (row.id !== null && row.id !== undefined) seenIds.add(String(row.id));
      }

      pageNumber += 1;
      const compressed = gzipSync(bytes, { level: 6, mtime: 0 });
      const fileName = `page-${String(pageNumber).padStart(5, "0")}.json.gz`;
      const rawPath = `${rawRelativePath}/${fileName}`;
      const target = path.join(root, rawPath);
      const temporary = `${target}.tmp`;
      await writeFile(temporary, compressed);
      await rename(temporary, target);

      const page = {
        pageNumber,
        cursorBefore: after,
        cursorAfter: String(lastId),
        returnedRows: data.results.length,
        responseBytes: bytes.length,
        responseSha256: hash(bytes),
        compressedBytes: compressed.length,
        compressedSha256: hash(compressed),
        rawPath,
      };
      receipt.pages.push(page);
      rowCount += data.results.length;
      after = String(lastId);
      receipt.checkpoint = { after, pageCount: pageNumber, rowCount };
      receipt.updatedAtUtc = new Date().toISOString();
      await saveJson(jobPath, receipt);
      console.log(JSON.stringify({ jobId, status: "downloading", pages: pageNumber, retrieved: rowCount, expected: receipt.expectedTotal }));

      if (rowCount > receipt.expectedTotal) throw new Error("Retrieved rows exceed the provider total");
      if (data.results.length < pageSize && rowCount < receipt.expectedTotal) break;
      await sleep(250);
    }
  } catch (error) {
    if (receipt.status !== "source-count-changed-review-required") receipt.status = "interrupted-resumable";
    receipt.updatedAtUtc = new Date().toISOString();
    receipt.lastFailure = String(error.message ?? "acquisition error").slice(0, 160);
    await saveJson(jobPath, receipt);
    throw error;
  }

  if (rowCount !== receipt.expectedTotal) {
    receipt.status = "incomplete-resumable";
    receipt.updatedAtUtc = new Date().toISOString();
    await saveJson(jobPath, receipt);
    throw new Error(`Partial acquisition preserved (${rowCount}/${receipt.expectedTotal} rows)`);
  }

  receipt.status = "downloaded-review-pending";
  receipt.completedAtUtc = new Date().toISOString();
  receipt.counts = {
    expectedProviderRows: receipt.expectedTotal,
    retrievedRows: rowCount,
    uniqueOccurrenceIds: seenIds.size,
    pages: pageNumber,
    datasetRightsReviewed: false,
    admittedRows: 0,
    publicAssertions: 0,
  };
  delete receipt.lastFailure;
  await saveJson(jobPath, receipt);
  console.log(JSON.stringify({ jobId, status: receipt.status, pages: pageNumber, retrieved: rowCount, uniqueIds: seenIds.size, rightsReview: receipt.rightsReview }));
}

async function verifySnapshot() {
  const receipt = await loadReceipt();
  if (!receipt) throw new Error("No acquisition receipt exists yet");
  await verifyPageFiles(receipt);
  const bytes = await Promise.all(receipt.pages.map((page) => stat(path.join(root, page.rawPath))));
  const rawCompressedBytes = bytes.reduce((total, item) => total + item.size, 0);
  console.log(JSON.stringify({ jobId, status: receipt.status, pagesVerified: receipt.pages.length, rows: receipt.checkpoint.rowCount, rawCompressedBytes, queryHash: receipt.queryHash }));
}

async function main() {
  const mode = process.argv[2];
  if (mode === "--estimate") return estimate();
  if (mode === "--fetch" || mode === "--resume") return fetchSnapshot();
  if (mode === "--verify") return verifySnapshot();
  console.log("Usage: node scripts/species/national/obis-occurrence-snapshot.mjs --estimate|--fetch|--resume|--verify");
  process.exitCode = mode === "--help" || mode === undefined ? 0 : 2;
}

main().catch((error) => {
  console.error(`OBIS national acquisition stopped: ${error.message}`);
  process.exitCode = 1;
});
