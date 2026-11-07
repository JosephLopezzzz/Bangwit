import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, mkdir, open, readFile, rename, stat, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const jobsDirectory = path.join(root, "data/research/philippines/national/jobs");
const rawDirectory = path.join(root, "data/research/philippines/raw/national/gbif");
const rawRelativeDirectory = "data/research/philippines/raw/national/gbif";
const apiBase = "https://api.gbif.org/v1/occurrence";
const maxArchiveBytes = 25 * 1024 ** 3;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function serialize(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function saveReceipt(file, receipt) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  await writeFile(temporary, serialize(receipt));
  await rename(temporary, file);
}

function receiptPath(jobId) {
  if (!/^gbif-ph-fishes-[a-f0-9]{12}$/.test(jobId)) throw new Error("Invalid GBIF job ID");
  return path.join(jobsDirectory, `${jobId}.json`);
}

async function loadEnv() {
  const envFile = path.join(root, ".env.local");
  try {
    await access(envFile);
    process.loadEnvFile(envFile);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function readManifest(file) {
  const absolute = path.resolve(root, file);
  if (!absolute.startsWith(`${root}${path.sep}`)) throw new Error("Query file must stay inside the project");
  const manifest = JSON.parse(await readFile(absolute, "utf8"));
  if (manifest.schemaVersion !== 1 || manifest.provider !== "GBIF" || typeof manifest.sourceId !== "string") {
    throw new Error("Query manifest must declare schemaVersion 1, provider GBIF and sourceId");
  }
  if (manifest.status !== "ready-to-submit") throw new Error("This query is not marked ready-to-submit");
  if (!manifest.request || manifest.request.format !== "DWCA" || !manifest.request.predicate) {
    throw new Error("A reviewed GBIF DWCA request and predicate are required");
  }
  if (Object.keys(manifest).some((key) => /password|email|username|notification/i.test(key))) {
    throw new Error("Contact information and credentials must come from local environment variables, not the query file");
  }
  const request = manifest.request;
  if (Object.keys(request).some((key) => /password|email|username|notification/i.test(key))) {
    throw new Error("Contact information and credentials are not allowed in the request manifest");
  }
  return { absolute, manifest, request };
}

async function submit(queryFile) {
  await loadEnv();
  const { manifest, request } = await readManifest(queryFile);
  const username = process.env.GBIF_USERNAME;
  const password = process.env.GBIF_PASSWORD;
  const email = process.env.GBIF_NOTIFICATION_EMAIL;
  if (!username || !password || !email) {
    throw new Error("Set GBIF_USERNAME, GBIF_PASSWORD and GBIF_NOTIFICATION_EMAIL in local environment configuration before submitting");
  }

  const queryBytes = Buffer.from(JSON.stringify(request));
  const queryHash = sha256(queryBytes);
  const jobId = `gbif-ph-fishes-${queryHash.slice(0, 12)}`;
  const file = receiptPath(jobId);
  try {
    await access(file);
    throw new Error("A receipt already exists for this query; refusing to submit a duplicate download. Use status/resume with its job ID.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const receipt = {
    schemaVersion: 1,
    jobId,
    provider: "GBIF",
    sourceId: manifest.sourceId,
    query: request,
    queryHash,
    requestUrl: `${apiBase}/download/request`,
    createdAtUtc: new Date().toISOString(),
    status: "submission-started",
    providerDownloadKey: null,
    publicReleaseEligible: false,
    rightsReview: "required-per-record-and-dataset",
    queryLabel: manifest.label ?? null,
  };
  await saveReceipt(file, receipt);

  let response;
  try {
    response = await fetch(`${apiBase}/download/request`, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        "content-type": "application/json",
        accept: "text/plain",
        "user-agent": "Bangwit-research/1.0 (GBIF public-data download)",
      },
      body: JSON.stringify({
        ...request,
        sendNotification: true,
        notificationAddresses: [email],
      }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch {
    receipt.status = "submission-outcome-unknown";
    receipt.updatedAtUtc = new Date().toISOString();
    await saveReceipt(file, receipt);
    throw new Error("GBIF submission connection ended without a response. Check your GBIF downloads before retrying to avoid a duplicate request.");
  }

  const body = (await response.text()).trim();
  if (!response.ok || !/^[0-9]{4,}-[0-9]{10,}$/.test(body)) {
    receipt.status = response.status >= 500 ? "submission-outcome-unknown" : "submission-rejected";
    receipt.providerHttpStatus = response.status;
    receipt.updatedAtUtc = new Date().toISOString();
    await saveReceipt(file, receipt);
    throw new Error(`GBIF submission did not return a download key (HTTP ${response.status}); response text was not retained`);
  }

  receipt.providerDownloadKey = body;
  receipt.status = "submitted";
  receipt.submittedAtUtc = new Date().toISOString();
  await saveReceipt(file, receipt);
  console.log(JSON.stringify({ jobId, status: receipt.status, downloadKey: body, queryHash }));
}

async function getStatus(downloadKey) {
  let response;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    response = await fetch(`${apiBase}/download/${encodeURIComponent(downloadKey)}`, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (GBIF download status)" },
      signal: AbortSignal.timeout(45_000),
    });
    if (response.status !== 429 && response.status < 500) break;
    if (attempt === 4) break;
    const retryAfter = Number(response.headers.get("retry-after"));
    await response.body?.cancel();
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(30_000, retryAfter * 1000) : (attempt + 1) * 1000);
  }
  if (!response.ok) throw new Error(`GBIF status request failed with HTTP ${response.status}`);
  return response.json();
}

async function loadJob(jobId) {
  const file = receiptPath(jobId);
  const receipt = JSON.parse(await readFile(file, "utf8"));
  if (receipt.schemaVersion !== 1 || receipt.provider !== "GBIF" || !receipt.providerDownloadKey) {
    throw new Error("GBIF job receipt has no usable provider download key");
  }
  return { file, receipt };
}

async function updateStatus(jobId) {
  const { file, receipt } = await loadJob(jobId);
  const remote = await getStatus(receipt.providerDownloadKey);
  receipt.providerStatus = remote.status ?? "UNKNOWN";
  receipt.providerCreatedAtUtc = remote.created ?? null;
  receipt.providerModifiedAtUtc = remote.modified ?? null;
  receipt.counts = {
    ...(receipt.counts ?? {}),
    providerTotalRecords: Number.isSafeInteger(Number(remote.totalRecords)) ? Number(remote.totalRecords) : null,
  };
  receipt.doi = remote.doi ?? null;
  receipt.citation = remote.citation ?? null;
  receipt.updatedAtUtc = new Date().toISOString();
  if (remote.status !== "SUCCEEDED") receipt.status = `provider-${String(remote.status ?? "unknown").toLowerCase()}`;
  else receipt.status = "provider-succeeded-download-pending";
  await saveReceipt(file, receipt);
  console.log(JSON.stringify({ jobId, status: receipt.status, providerStatus: receipt.providerStatus, totalRecords: receipt.counts.providerTotalRecords, doi: receipt.doi }));
  return { file, receipt, remote };
}

async function fileHash(file) {
  const digest = createHash("sha256");
  for await (const chunk of createReadStream(file)) digest.update(chunk);
  return digest.digest("hex");
}

async function finishDownload(file, receipt, partFile, targetFile, expectedBytes) {
  const { size } = await stat(partFile);
  if (size > maxArchiveBytes) throw new Error("GBIF archive exceeded the configured 25 GiB safety limit");
  if (expectedBytes !== null && size !== expectedBytes) {
    receipt.status = "download-interrupted-resumable";
    receipt.download = { ...receipt.download, partialBytes: size, expectedBytes };
    receipt.updatedAtUtc = new Date().toISOString();
    await saveReceipt(file, receipt);
    console.log(JSON.stringify({ jobId: receipt.jobId, status: receipt.status, downloadedBytes: size, expectedBytes }));
    return;
  }

  const handle = await open(partFile, "r");
  const signature = Buffer.alloc(4);
  const { bytesRead } = await handle.read(signature, 0, signature.length, 0);
  await handle.close();
  if (bytesRead < 2 || signature[0] !== 0x50 || signature[1] !== 0x4b) {
    receipt.status = "download-invalid-signature-review-required";
    receipt.updatedAtUtc = new Date().toISOString();
    await saveReceipt(file, receipt);
    throw new Error("Downloaded bytes do not begin with a ZIP signature; raw part was preserved for inspection");
  }

  const archiveSha256 = await fileHash(partFile);
  await rename(partFile, targetFile);
  receipt.status = "downloaded-awaiting-archive-validation-and-import";
  receipt.download = {
    ...receipt.download,
    path: path.relative(root, targetFile).replaceAll("\\", "/"),
    bytes: size,
    sha256: archiveSha256,
    completedAtUtc: new Date().toISOString(),
    structuralZipValidation: "not-run",
  };
  receipt.updatedAtUtc = new Date().toISOString();
  await saveReceipt(file, receipt);
  console.log(JSON.stringify({ jobId: receipt.jobId, status: receipt.status, downloadedBytes: size, sha256: archiveSha256, doi: receipt.doi }));
}

async function downloadArchive(file, receipt, remote) {
  const downloadKey = receipt.providerDownloadKey;
  const archiveFile = path.join(rawDirectory, `${downloadKey}.zip`);
  const partFile = `${archiveFile}.part`;
  await mkdir(rawDirectory, { recursive: true });
  try {
    await access(archiveFile);
    throw new Error("A completed archive already exists; verify its recorded hash instead of downloading it again");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  let partialBytes = 0;
  try {
    partialBytes = (await stat(partFile)).size;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (partialBytes > maxArchiveBytes) throw new Error("Partial GBIF archive exceeded the configured 25 GiB safety limit");

  const downloadUrl = remote.downloadLink ?? `https://api.gbif.org/occurrence/download/request/${encodeURIComponent(downloadKey)}.zip`;
  const url = new URL(downloadUrl);
  if (url.protocol !== "https:" || url.hostname !== "api.gbif.org") throw new Error("GBIF status returned an unexpected download host");
  const headers = { accept: "application/zip", "accept-encoding": "identity", "user-agent": "Bangwit-research/1.0 (GBIF archive download)" };
  const resumable = partialBytes > 0 && Boolean(receipt.download?.etag && !receipt.download.etag.startsWith("W/"));
  if (resumable) {
    headers.range = `bytes=${partialBytes}-`;
    headers["if-range"] = receipt.download.etag;
  }

  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15 * 60_000) });
  if (response.status === 416) {
    const range = response.headers.get("content-range") ?? "";
    const match = range.match(/^bytes \*\/(\d+)$/);
    if (match && Number(match[1]) === partialBytes) {
      return finishDownload(file, receipt, partFile, archiveFile, partialBytes);
    }
    throw new Error("GBIF rejected the saved range; partial archive was preserved");
  }
  if (!response.ok || !response.body) throw new Error(`GBIF archive download failed with HTTP ${response.status}`);

  let append = false;
  let expectedBytes = null;
  if (response.status === 206) {
    const contentRange = response.headers.get("content-range") ?? "";
    const match = contentRange.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
    if (!match || Number(match[1]) !== partialBytes) {
      await response.body.cancel();
      throw new Error("GBIF returned an invalid range response; partial archive was preserved");
    }
    append = true;
    expectedBytes = Number(match[3]);
  } else if (response.status === 200) {
    expectedBytes = Number(response.headers.get("content-length"));
    if (!Number.isSafeInteger(expectedBytes) || expectedBytes < 1) expectedBytes = null;
  } else {
    await response.body.cancel();
    throw new Error(`Unexpected GBIF archive response status ${response.status}`);
  }
  if (expectedBytes !== null && expectedBytes > maxArchiveBytes) {
    await response.body.cancel();
    throw new Error("GBIF archive exceeds the configured 25 GiB safety limit");
  }

  receipt.download = {
    ...(receipt.download ?? {}),
    state: "in-progress",
    etag: response.headers.get("etag") ?? receipt.download?.etag ?? null,
    expectedBytes,
    resumedFromByte: append ? partialBytes : 0,
    url: downloadUrl,
  };
  receipt.status = "downloading-resumable";
  receipt.updatedAtUtc = new Date().toISOString();
  await saveReceipt(file, receipt);

  try {
    await pipeline(Readable.fromWeb(response.body), createWriteStream(partFile, { flags: append ? "a" : "w" }));
  } catch {
    const size = await stat(partFile).then((item) => item.size).catch(() => 0);
    receipt.status = "download-interrupted-resumable";
    receipt.download = { ...receipt.download, partialBytes: size };
    receipt.updatedAtUtc = new Date().toISOString();
    await saveReceipt(file, receipt);
    throw new Error("GBIF archive stream stopped; saved bytes and checkpoint are ready for resume");
  }
  return finishDownload(file, receipt, partFile, archiveFile, expectedBytes);
}

async function main() {
  const [command, value, ...rest] = process.argv.slice(2);
  if (command === "submit" && value === "--query-file" && rest[0]) return submit(rest[0]);
  if ((command === "status" || command === "resume") && value === "--job" && rest[0]) {
    const result = await updateStatus(rest[0]);
    if (command === "resume" && result.remote.status === "SUCCEEDED") {
      return downloadArchive(result.file, result.receipt, result.remote);
    }
    return;
  }
  console.log("Usage: node scripts/species/national/gbif-download.mjs submit --query-file <repo-relative-json> | status --job <job-id> | resume --job <job-id>");
  process.exitCode = command === "--help" || command === undefined ? 0 : 2;
}

main().catch((error) => {
  console.error(`GBIF acquisition stopped: ${error.message}`);
  process.exitCode = 1;
});
