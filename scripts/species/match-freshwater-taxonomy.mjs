import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

export const CHECKLIST_KEY = "7ddf754f-d193-4cc9-b351-99906754a03b";
export const SOURCE_ID = "gbif-col-xr-taxonomy-matching";
export const ENDPOINT = "https://api.gbif.org/v2/species/match";
const METADATA_URL = `${ENDPOINT}/metadata?checklistKey=${CHECKLIST_KEY}`;
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DATA = resolve(ROOT, "data/research/philippines");
const CACHE = resolve(DATA, "raw/gbif-col-xr-taxonomy");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function save(path, value) {
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(`${path}.tmp`, json(value));
  await rename(`${path}.tmp`, path);
}

export function queryFor(candidate) {
  assert.ok(
    [candidate.id, candidate.recordedName, candidate.recordedFamily].every(
      (value) => typeof value === "string" && value.trim(),
    ),
  );
  return {
    checklistKey: CHECKLIST_KEY,
    scientificName: candidate.recordedName,
    family: candidate.recordedFamily,
    kingdom: "Animalia",
  };
}

export function validateServiceMetadata(body) {
  assert.equal(body?.mainIndex?.datasetKey, CHECKLIST_KEY, "Matching service returned a different taxonomy");
  assert.ok(typeof body.mainIndex.clbDatasetKey === "string" && body.mainIndex.clbDatasetKey);
  assert.ok(typeof body.mainIndex.datasetAlias === "string" && body.mainIndex.datasetAlias);
  assert.ok(body.created && body.buildInfo?.sha, "Missing matching-index build/version metadata");
}

export function cacheKey(query, metadataSha256) {
  assert.equal(query.checklistKey, CHECKLIST_KEY, "An explicit COL XR checklistKey is required");
  return hash(JSON.stringify({ endpoint: ENDPOINT, query, metadataSha256 }));
}

export function verifyCache(entry, query, metadataSha256) {
  assert.equal(entry.schemaVersion, 1);
  assert.equal(entry.endpoint, ENDPOINT);
  assert.deepEqual(entry.query, query, "Cached query differs");
  assert.equal(entry.metadataSha256, metadataSha256, "Cached response is from another matching index");
  assert.equal(entry.querySha256, cacheKey(query, metadataSha256));
  assert.ok(["success", "failed"].includes(entry.status));
  if (entry.status === "success") {
    assert.equal(entry.httpStatus, 200);
    assert.equal(hash(entry.responseText), entry.responseSha256, "Cached response hash mismatch");
    return JSON.parse(entry.responseText);
  }
  assert.ok(typeof entry.error === "string" && entry.error);
  return null;
}

function usageProjection(usage) {
  if (!usage) return null;
  assert.ok(typeof usage.key === "string" && usage.key, "Taxon identifiers must remain opaque strings");
  return {
    authority: "Catalogue of Life eXtended Release",
    checklistKey: CHECKLIST_KEY,
    usageKey: usage.key,
    scientificName: usage.name ?? null,
    canonicalName: usage.canonicalName ?? null,
    authorship: usage.authorship ?? null,
    rank: usage.rank ?? null,
    status: usage.status ?? null,
  };
}

export function classifyResponse(candidate, body) {
  assert.ok(body && typeof body === "object" && !Array.isArray(body));
  assert.ok(body.diagnostics && typeof body.diagnostics.matchType === "string", "Unexpected API v2 response schema");
  if (body.checklistKey !== undefined) assert.equal(body.checklistKey, CHECKLIST_KEY);
  const matchType = body.diagnostics.matchType;
  const usage = usageProjection(body.usage);
  const acceptedUsage = usageProjection(body.acceptedUsage);
  const family = body.classification?.find((taxon) => taxon.rank === "FAMILY")?.name ?? null;
  const kingdom = body.classification?.find((taxon) => taxon.rank === "KINGDOM")?.name ?? null;
  const flags = [];
  let classification;
  if (!usage || matchType === "NONE") classification = "no-match";
  else if (family && family.toLowerCase() !== candidate.recordedFamily.toLowerCase())
    classification = "family-conflict";
  else if (kingdom && kingdom !== "Animalia") classification = "lineage-conflict";
  else if (usage.rank !== "SPECIES" || matchType === "HIGHERRANK") classification = "higher-rank";
  else if (matchType === "FUZZY") classification = "fuzzy";
  else if (body.synonym === true || usage.status === "SYNONYM") classification = "synonym";
  else if (!family || !kingdom) classification = "lineage-unconfirmed";
  else if (matchType === "EXACT" && usage.status === "ACCEPTED" && usage.canonicalName === candidate.candidateName)
    classification = "exact-species";
  else classification = "name-or-status-review";
  if (family && family.toLowerCase() !== candidate.recordedFamily.toLowerCase())
    flags.push("source-family-conflicts-with-service");
  if (!family) flags.push("family-unconfirmed");
  if (!kingdom) flags.push("kingdom-unconfirmed");
  if (body.synonym === true && !acceptedUsage) flags.push("synonym-without-accepted-usage");
  if (usage?.canonicalName && usage.canonicalName !== candidate.candidateName)
    flags.push("candidate-and-service-canonical-name-differ");
  if (body.diagnostics.issues?.length) flags.push("service-diagnostics-issues");
  return {
    classification,
    matchType,
    confidence: body.diagnostics.confidence ?? null,
    serviceFamily: family,
    serviceKingdom: kingdom,
    serviceSynonym: body.synonym ?? null,
    proposedUsage: usage,
    proposedAcceptedUsage: acceptedUsage,
    reviewFlags: flags,
    diagnosticsIssues: body.diagnostics.issues ?? [],
  };
}

export function buildArtifact(candidates, candidateArtifactSha256, metadataReceipt, entries) {
  validateServiceMetadata(metadataReceipt.body);
  assert.equal(hash(metadataReceipt.responseText), metadataReceipt.responseSha256);
  assert.deepEqual(JSON.parse(metadataReceipt.responseText), metadataReceipt.body);
  const byClassification = {};
  const proposals = candidates.map((candidate) => {
    const query = queryFor(candidate);
    const key = cacheKey(query, metadataReceipt.responseSha256);
    const entry = entries.get(key);
    const body = entry ? verifyCache(entry, query, metadataReceipt.responseSha256) : null;
    const proposal = {
      candidateId: candidate.id,
      sourceId: SOURCE_ID,
      recordedName: candidate.recordedName,
      candidateName: candidate.candidateName,
      recordedFamily: candidate.recordedFamily,
      queryParameters: query,
      querySha256: key,
      queryStatus: entry?.status ?? "unqueried",
      responseSha256: entry?.responseSha256 ?? null,
      retrievedAtUtc: entry?.retrievedAtUtc ?? null,
      ...(body
        ? classifyResponse(candidate, body)
        : { classification: entry ? "query-failed" : "unqueried", error: entry?.error ?? null }),
      reviewStatus: "pending",
      acceptedTaxonId: null,
      publicationEligible: false,
      regionIds: [],
      waterbodyIds: [],
    };
    byClassification[proposal.classification] = (byClassification[proposal.classification] ?? 0) + 1;
    return proposal;
  });
  const successfulResponses = proposals.filter(({ queryStatus }) => queryStatus === "success").length;
  const failedQueries = proposals.filter(({ queryStatus }) => queryStatus === "failed").length;
  const mainIndex = metadataReceipt.body.mainIndex;
  const indexStable =
    metadataReceipt.indexStability === "verified" &&
    metadataReceipt.endMetadataSha256 === metadataReceipt.responseSha256;
  return {
    schemaVersion: 1,
    status:
      successfulResponses === candidates.length && indexStable
        ? "proposals-complete-review-pending"
        : "proposals-incomplete",
    source: {
      id: SOURCE_ID,
      authority: "Catalogue of Life eXtended Release",
      checklistKey: CHECKLIST_KEY,
      endpoint: ENDPOINT,
      candidateArtifactSha256,
      metadataUrl: METADATA_URL,
      metadataSha256: metadataReceipt.responseSha256,
      metadataRetrievedAtUtc: metadataReceipt.retrievedAtUtc,
      indexStableDuringRun: indexStable,
      indexStabilityCheckedAtUtc: metadataReceipt.indexStabilityCheckedAtUtc ?? null,
      matchingIndex: {
        checklistBankDatasetKey: mainIndex.clbDatasetKey,
        datasetAlias: mainIndex.datasetAlias,
        datasetTitle: mainIndex.datasetTitle,
        created: metadataReceipt.body.created,
        buildSha: metadataReceipt.body.buildInfo.sha,
      },
      versionNote:
        "This records the actual matching-service index metadata, not a presumed current COL registry release. Opaque usage keys are scoped to checklistKey plus this captured index; no legacy GBIF integer conversion was used.",
      documentation: [
        "https://data-blog.gbif.org/post/catalogue-of-life-taxonomic-backbone/",
        "https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation",
      ],
    },
    interpretation:
      "Automatic taxonomy proposals only. Exact means the service response and source candidate agree under this classifier; all proposals remain pending review. No regional presence, habitat, IUCN, catchability or public admission is inferred.",
    counts: {
      totalCandidates: candidates.length,
      queriedCandidates: successfulResponses + failedQueries,
      successfulResponses,
      failedQueries,
      unqueriedCandidates: candidates.length - successfulResponses - failedQueries,
      pendingReview: candidates.length,
      adoptedTaxa: 0,
      publishedRecords: 0,
      byClassification,
    },
    proposals,
  };
}

async function fetchText(url, limit = 256 * 1024) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Bangwit species research/0.1", Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.retryAfter = Math.min(60000, Math.max(0, Number(response.headers.get("retry-after")) * 1000 || 0));
        error.retryable = response.status === 429 || response.status >= 500;
        throw error;
      }
      if (Number(response.headers.get("content-length")) > limit) throw new Error("Response exceeds size limit");
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.byteLength;
        if (size > limit) throw new Error("Response exceeds size limit");
        chunks.push(chunk);
      }
      const bytes = Buffer.concat(chunks);
      const text = bytes.toString("utf8");
      JSON.parse(text);
      return text;
    } catch (error) {
      last = error;
      if (attempt === 2 || error.retryable === false) break;
      await delay(error.retryAfter || 1000 * 2 ** attempt);
    }
  }
  throw last;
}

async function readOptional(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function run({
  fetchSources = false,
  check = false,
  dataDir = DATA,
  cacheDir = CACHE,
  fetcher = fetchText,
  onProgress = console.log,
} = {}) {
  const candidateBytes = await readFile(resolve(dataDir, "freshwater-checklist-candidates.json"));
  const input = JSON.parse(candidateBytes);
  assert.equal(input.status, "research-candidates-only");
  assert.equal(input.candidates.length, input.counts.candidateEntries);
  assert.equal(new Set(input.candidates.map(({ id }) => id)).size, input.candidates.length);
  const metadataPath = resolve(cacheDir, "service-metadata.json");
  let metadataReceipt = await readOptional(metadataPath);
  if (fetchSources) {
    const responseText = await fetcher(METADATA_URL);
    const body = JSON.parse(responseText);
    validateServiceMetadata(body);
    const responseSha256 = hash(responseText);
    if (!metadataReceipt || metadataReceipt.responseSha256 !== responseSha256) {
      metadataReceipt = {
        url: METADATA_URL,
        retrievedAtUtc: new Date().toISOString(),
        responseText,
        responseSha256,
        body,
      };
      await save(metadataPath, metadataReceipt);
    }
  }
  assert.ok(metadataReceipt, "No cached service metadata; run with --fetch first");
  assert.equal(metadataReceipt.url, METADATA_URL);
  assert.deepEqual(JSON.parse(metadataReceipt.responseText), metadataReceipt.body);
  validateServiceMetadata(metadataReceipt.body);
  assert.equal(hash(metadataReceipt.responseText), metadataReceipt.responseSha256);
  if (fetchSources) {
    metadataReceipt.indexStability = "unverified";
    metadataReceipt.endMetadataSha256 = null;
    await save(metadataPath, metadataReceipt);
  }
  const entries = new Map();
  let cursor = 0;
  const deadline = Date.now() + 8 * 60 * 1000;
  const worker = async () => {
    while (cursor < input.candidates.length) {
      const candidate = input.candidates[cursor++];
      const query = queryFor(candidate);
      const key = cacheKey(query, metadataReceipt.responseSha256);
      const path = resolve(cacheDir, metadataReceipt.responseSha256, `${key}.json`);
      let entry = await readOptional(path);
      if (entry) verifyCache(entry, query, metadataReceipt.responseSha256);
      if (entry?.status !== "success" && fetchSources && Date.now() < deadline) {
        await delay(750);
        const common = {
          schemaVersion: 1,
          endpoint: ENDPOINT,
          query,
          querySha256: key,
          metadataSha256: metadataReceipt.responseSha256,
          retrievedAtUtc: new Date().toISOString(),
        };
        try {
          const responseText = await fetcher(`${ENDPOINT}?${new URLSearchParams(query)}`);
          classifyResponse(candidate, JSON.parse(responseText));
          entry = { ...common, status: "success", httpStatus: 200, responseText, responseSha256: hash(responseText) };
        } catch (error) {
          entry = { ...common, status: "failed", error: error.message };
        }
        await save(path, entry);
      }
      if (entry) entries.set(key, entry);
      if (fetchSources && entries.size && entries.size % 25 === 0)
        onProgress(`Taxonomy checkpoints: ${entries.size}/${input.candidates.length}`);
    }
  };
  await Promise.all(Array.from({ length: fetchSources ? 3 : 1 }, worker));
  if (fetchSources) {
    try {
      const finalMetadata = await fetcher(METADATA_URL);
      validateServiceMetadata(JSON.parse(finalMetadata));
      metadataReceipt.endMetadataSha256 = hash(finalMetadata);
      metadataReceipt.indexStability =
        metadataReceipt.endMetadataSha256 === metadataReceipt.responseSha256 ? "verified" : "changed";
      if (metadataReceipt.indexStability === "changed")
        await save(resolve(cacheDir, "changed-service-metadata.json"), {
          retrievedAtUtc: new Date().toISOString(),
          responseText: finalMetadata,
          responseSha256: hash(finalMetadata),
        });
    } catch (error) {
      metadataReceipt.indexStability = "verification-failed";
      metadataReceipt.indexStabilityError = error.message;
    }
    metadataReceipt.indexStabilityCheckedAtUtc = new Date().toISOString();
    await save(metadataPath, metadataReceipt);
  }
  const result = buildArtifact(input.candidates, hash(candidateBytes), metadataReceipt, entries);
  const target = resolve(dataDir, "freshwater-taxonomy-matches.json");
  if (check)
    assert.equal(await readFile(target, "utf8"), json(result), "Taxonomy artifact differs from verified cache");
  else await save(target, result);
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert.ok(
      process.argv.slice(2).every((arg) => ["--fetch", "--check"].includes(arg)),
      "Usage: node scripts/species/match-freshwater-taxonomy.mjs [--fetch | --check]",
    );
    assert.ok(
      !(process.argv.includes("--fetch") && process.argv.includes("--check")),
      "--check must use existing cached bytes without network",
    );
    const result = await run({
      fetchSources: process.argv.includes("--fetch"),
      check: process.argv.includes("--check"),
    });
    console.log(JSON.stringify({ status: result.status, ...result.counts }));
    if (result.status !== "proposals-complete-review-pending") process.exitCode = 1;
  } catch (error) {
    console.error(`Freshwater taxonomy proposals failed: ${error.message}`);
    process.exitCode = 1;
  }
}
