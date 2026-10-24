import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import {
  cacheKey,
  CHECKLIST_KEY,
  classifyResponse,
  ENDPOINT,
  validateServiceMetadata,
  verifyCache,
} from "./match-freshwater-taxonomy.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DATA = resolve(ROOT, "data/research/philippines");
const SOURCE = resolve(DATA, "central-luzon-bataan-river-table-review-20261024.json");
const TARGET = resolve(DATA, "central-luzon-bataan-taxonomy-proposals-20261024.json");
const CACHE = resolve(DATA, "raw/gbif-col-xr-bataan-table-taxonomy");
const METADATA_URL = `${ENDPOINT}/metadata?checklistKey=${CHECKLIST_KEY}`;
const hash = (value) => createHash("sha256").update(value).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const isBinomial = (name) => /^[A-Z][a-z]+ [a-z]+$/.test(name);

async function save(path, value) {
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(`${path}.tmp`, json(value));
  await rename(`${path}.tmp`, path);
}

async function fetchJsonText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Bangwit species research/0.1", Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GBIF matching API returned HTTP ${response.status}`);
  const text = await response.text();
  JSON.parse(text);
  return text;
}

async function readOptional(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function makeQuery(row) {
  assert.ok(isBinomial(row.sourceName), "Only source-printed binomials can be queried as species");
  return {
    checklistKey: CHECKLIST_KEY,
    scientificName: row.sourceName,
    kingdom: "Animalia",
  };
}

export function buildProposalArtifact(source, sourceText, metadataReceipt, entries) {
  validateServiceMetadata(metadataReceipt.body);
  assert.equal(hash(metadataReceipt.responseText), metadataReceipt.responseSha256);
  assert.deepEqual(JSON.parse(metadataReceipt.responseText), metadataReceipt.body);
  const proposals = source.sourceTableReview.records.map((row, index) => {
    const candidateId = `bataan-table-row-${String(index + 1).padStart(3, "0")}`;
    if (!isBinomial(row.sourceName)) {
      return {
        candidateId,
        sourceNameVerbatim: row.sourceName,
        sourceFamilyVerbatim: row.familyAsPrinted,
        presenceByRiver: row.presence,
        queryStatus: "not-queried-source-name-is-not-binomial",
        classification: "held-rank-or-hybrid-review",
        reviewStatus: "pending",
        acceptedTaxonId: null,
        publicationEligible: false,
      };
    }
    const query = makeQuery(row);
    const querySha256 = cacheKey(query, metadataReceipt.responseSha256);
    const entry = entries.get(querySha256);
    const body = entry ? verifyCache(entry, query, metadataReceipt.responseSha256) : null;
    const candidate = {
      id: candidateId,
      recordedName: row.sourceName,
      candidateName: row.sourceName,
      recordedFamily: row.familyAsPrinted,
    };
    return {
      candidateId,
      sourceNameVerbatim: row.sourceName,
      sourceFamilyVerbatim: row.familyAsPrinted,
      presenceByRiver: row.presence,
      queryParameters: query,
      querySha256,
      queryStatus: entry?.status ?? "unqueried",
      responseSha256: entry?.responseSha256 ?? null,
      retrievedAtUtc: entry?.retrievedAtUtc ?? null,
      ...(body ? classifyResponse(candidate, body) : {
        classification: entry ? "query-failed" : "unqueried",
        error: entry?.error ?? null,
      }),
      reviewStatus: "pending",
      acceptedTaxonId: null,
      publicationEligible: false,
    };
  });
  const queried = proposals.filter((proposal) => proposal.queryParameters);
  const successful = queried.filter((proposal) => proposal.queryStatus === "success").length;
  const failed = queried.filter((proposal) => proposal.queryStatus === "failed").length;
  const stable = metadataReceipt.indexStability === "verified" &&
    metadataReceipt.endMetadataSha256 === metadataReceipt.responseSha256;
  const byClassification = {};
  for (const proposal of proposals) {
    byClassification[proposal.classification] = (byClassification[proposal.classification] ?? 0) + 1;
  }
  return {
    schemaVersion: 1,
    reviewedOn: "2026-10-24",
    status: successful === queried.length && stable ? "proposal-batch-complete-review-pending" : "proposal-batch-incomplete",
    sourceTable: {
      path: "central-luzon-bataan-river-table-review-20261024.json",
      sha256: hash(sourceText),
      sourceId: source.source.id,
      sourcePdfSha256: source.source.acquisition.sha256,
      rowCount: source.sourceTableReview.rowCount,
    },
    matchingService: {
      authority: "Catalogue of Life eXtended Release via GBIF Checklist Bank species match service",
      checklistKey: CHECKLIST_KEY,
      endpoint: ENDPOINT,
      metadataUrl: METADATA_URL,
      metadataSha256: metadataReceipt.responseSha256,
      metadataRetrievedAtUtc: metadataReceipt.retrievedAtUtc,
      indexStableDuringBatch: stable,
      indexStabilityCheckedAtUtc: metadataReceipt.indexStabilityCheckedAtUtc ?? null,
      matchingIndex: {
        datasetKey: metadataReceipt.body.mainIndex.datasetKey,
        checklistBankDatasetKey: metadataReceipt.body.mainIndex.clbDatasetKey,
        datasetAlias: metadataReceipt.body.mainIndex.datasetAlias,
        datasetTitle: metadataReceipt.body.mainIndex.datasetTitle,
        created: metadataReceipt.body.created,
        buildSha: metadataReceipt.body.buildInfo.sha,
      },
    },
    interpretation: "Automated name-match proposals only. Source names and families remain verbatim; genus-only and hybrid rows are held, all outcomes require independent authority review, and no taxon is adopted or published.",
    counts: {
      totalSourceRows: proposals.length,
      speciesBinomialQueries: queried.length,
      successfulResponses: successful,
      failedQueries: failed,
      unqueriedBinomials: queried.length - successful - failed,
      heldNonBinomialRows: proposals.length - queried.length,
      acceptedTaxa: 0,
      publicationEligible: 0,
      byClassification,
    },
    proposals,
  };
}

export async function run({ fetchSources = false, check = false, fetcher = fetchJsonText } = {}) {
  const sourceText = await readFile(SOURCE, "utf8");
  const source = JSON.parse(sourceText);
  assert.equal(source.sourceTableReview.records.length, source.sourceTableReview.rowCount);
  const metadataPath = resolve(CACHE, "service-metadata.json");
  let metadataReceipt = await readOptional(metadataPath);
  if (fetchSources) {
    const responseText = await fetcher(METADATA_URL);
    const body = JSON.parse(responseText);
    validateServiceMetadata(body);
    const responseSha256 = hash(responseText);
    metadataReceipt = {
      url: METADATA_URL,
      retrievedAtUtc: new Date().toISOString(),
      responseText,
      responseSha256,
      body,
      indexStability: "unverified",
      endMetadataSha256: null,
    };
    await save(metadataPath, metadataReceipt);
  }
  assert.ok(metadataReceipt, "No cached matching-service metadata; run with --fetch first");
  assert.equal(metadataReceipt.url, METADATA_URL);
  assert.deepEqual(JSON.parse(metadataReceipt.responseText), metadataReceipt.body);
  validateServiceMetadata(metadataReceipt.body);
  assert.equal(hash(metadataReceipt.responseText), metadataReceipt.responseSha256);

  const rows = source.sourceTableReview.records.filter((row) => isBinomial(row.sourceName));
  const entries = new Map();
  let cursor = 0;
  const worker = async () => {
    while (cursor < rows.length) {
      const row = rows[cursor++];
      const query = makeQuery(row);
      const key = cacheKey(query, metadataReceipt.responseSha256);
      const path = resolve(CACHE, metadataReceipt.responseSha256, `${key}.json`);
      let entry = await readOptional(path);
      if (entry) verifyCache(entry, query, metadataReceipt.responseSha256);
      if (entry?.status !== "success" && fetchSources) {
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
          const body = JSON.parse(responseText);
          const candidate = { id: "bataan-candidate", recordedName: row.sourceName, candidateName: row.sourceName, recordedFamily: row.familyAsPrinted };
          classifyResponse(candidate, body);
          entry = { ...common, status: "success", httpStatus: 200, responseText, responseSha256: hash(responseText) };
        } catch (error) {
          entry = { ...common, status: "failed", error: error.message };
        }
        await save(path, entry);
      }
      if (entry) entries.set(key, entry);
    }
  };
  await Promise.all(Array.from({ length: fetchSources ? 2 : 1 }, worker));

  if (fetchSources) {
    try {
      const responseText = await fetcher(METADATA_URL);
      validateServiceMetadata(JSON.parse(responseText));
      metadataReceipt.endMetadataSha256 = hash(responseText);
      metadataReceipt.indexStability = metadataReceipt.endMetadataSha256 === metadataReceipt.responseSha256 ? "verified" : "changed";
    } catch (error) {
      metadataReceipt.indexStability = "verification-failed";
      metadataReceipt.indexStabilityError = error.message;
    }
    metadataReceipt.indexStabilityCheckedAtUtc = new Date().toISOString();
    await save(metadataPath, metadataReceipt);
  }
  const artifact = buildProposalArtifact(source, sourceText, metadataReceipt, entries);
  if (check) assert.equal(await readFile(TARGET, "utf8"), json(artifact), "Bataan taxonomy proposal artifact differs from cached source bytes");
  else await save(TARGET, artifact);
  return artifact;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert.ok(process.argv.slice(2).every((arg) => ["--fetch", "--check"].includes(arg)), "Usage: node scripts/species/match-bataan-taxonomy-proposals.mjs [--fetch | --check]");
    assert.ok(!(process.argv.includes("--fetch") && process.argv.includes("--check")), "--check must use the existing raw cache without network access");
    const result = await run({ fetchSources: process.argv.includes("--fetch"), check: process.argv.includes("--check") });
    console.log(JSON.stringify({ status: result.status, ...result.counts }));
    if (result.status !== "proposal-batch-complete-review-pending") process.exitCode = 1;
  } catch (error) {
    console.error(`Bataan taxonomy proposal build failed: ${error.message}`);
    process.exitCode = 1;
  }
}
