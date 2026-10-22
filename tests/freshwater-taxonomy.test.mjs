import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  buildArtifact,
  CHECKLIST_KEY,
  cacheKey,
  classifyResponse,
  ENDPOINT,
  queryFor,
  run,
  validateServiceMetadata,
  verifyCache,
} from "../scripts/species/match-freshwater-taxonomy.mjs";

const hash = (text) => createHash("sha256").update(text).digest("hex");
const candidate = {
  id: "synthetic-a",
  recordedName: "Channa striata (Bloch, 1793)",
  candidateName: "Channa striata",
  recordedFamily: "Channidae",
};
const metadata = {
  created: "2026-01-01T00:00:00Z",
  buildInfo: { sha: "synthetic-service-build" },
  mainIndex: {
    datasetKey: CHECKLIST_KEY,
    clbDatasetKey: "synthetic-index",
    datasetAlias: "Synthetic COL fixture",
    datasetTitle: "Synthetic taxonomy fixture",
  },
};
const body = () => ({
  usage: {
    key: "SYNTH1",
    name: "Channa striata (Bloch, 1793)",
    canonicalName: "Channa striata",
    rank: "SPECIES",
    status: "ACCEPTED",
  },
  classification: [
    { rank: "KINGDOM", name: "Animalia" },
    { rank: "FAMILY", name: "Channidae" },
  ],
  diagnostics: { matchType: "EXACT", confidence: 100 },
  synonym: false,
  additionalStatus: [{ statusCode: "LC", datasetAlias: "IUCN" }],
});
const metadataReceipt = () => ({
  body: metadata,
  responseText: JSON.stringify(metadata),
  responseSha256: hash(JSON.stringify(metadata)),
  retrievedAtUtc: "2026-01-02T00:00:00Z",
  indexStability: "verified",
  endMetadataSha256: hash(JSON.stringify(metadata)),
});
const cacheEntry = (item = candidate, response = body()) => {
  const query = queryFor(item);
  const metadataSha256 = metadataReceipt().responseSha256;
  const responseText = JSON.stringify(response);
  return {
    schemaVersion: 1,
    endpoint: ENDPOINT,
    query,
    querySha256: cacheKey(query, metadataSha256),
    metadataSha256,
    retrievedAtUtc: "2026-01-02T01:00:00Z",
    status: "success",
    httpStatus: 200,
    responseText,
    responseSha256: hash(responseText),
  };
};

test("explicitly selects COL XR and preserves full recorded-name/family hints", () => {
  const query = queryFor(candidate);
  assert.equal(query.checklistKey, CHECKLIST_KEY);
  assert.equal(query.scientificName, candidate.recordedName);
  assert.equal(query.family, "Channidae");
  assert.throws(() => cacheKey({ scientificName: "Channa striata" }, "hash"));
  assert.throws(() =>
    validateServiceMetadata({
      ...metadata,
      mainIndex: { ...metadata.mainIndex, datasetKey: "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c" },
    }),
  );
  const response = body();
  response.usage.key = 12345;
  assert.throws(() => classifyResponse(candidate, response), /opaque strings/);
});

test("separates exact species, synonym, fuzzy, higher-rank, no-match and family conflict proposals", () => {
  assert.equal(classifyResponse(candidate, body()).classification, "exact-species");
  const synonym = body();
  synonym.synonym = true;
  synonym.usage.status = "SYNONYM";
  synonym.acceptedUsage = { ...synonym.usage, key: "SYNTH2", canonicalName: "Othergenus striata" };
  assert.equal(classifyResponse(candidate, synonym).classification, "synonym");
  const fuzzy = body();
  fuzzy.diagnostics.matchType = "FUZZY";
  assert.equal(classifyResponse(candidate, fuzzy).classification, "fuzzy");
  const higher = body();
  higher.usage.rank = "GENUS";
  higher.diagnostics.matchType = "HIGHERRANK";
  assert.equal(classifyResponse(candidate, higher).classification, "higher-rank");
  assert.equal(classifyResponse(candidate, { diagnostics: { matchType: "NONE" } }).classification, "no-match");
  const conflict = body();
  conflict.classification[1].name = "Cyprinidae";
  assert.equal(classifyResponse(candidate, conflict).classification, "family-conflict");
  const noFamily = body();
  noFamily.classification.pop();
  assert.equal(classifyResponse(candidate, noFamily).classification, "lineage-unconfirmed");
});

test("rejects cache tampering, mismatched queries and mixed matching-index snapshots", () => {
  const entry = cacheEntry();
  assert.deepEqual(verifyCache(entry, queryFor(candidate), metadataReceipt().responseSha256), body());
  assert.throws(
    () => verifyCache({ ...entry, responseText: "{}" }, queryFor(candidate), metadataReceipt().responseSha256),
    /hash mismatch/,
  );
  assert.throws(
    () => verifyCache(entry, { ...queryFor(candidate), family: "Different" }, metadataReceipt().responseSha256),
    /query differs/,
  );
  assert.throws(() => verifyCache(entry, queryFor(candidate), "another-index"), /another matching index/);
});

test("partial caches stay incomplete and none of the automatic results adopts taxonomy or locality", () => {
  const other = {
    ...candidate,
    id: "synthetic-b",
    recordedName: "Channa syntheticus",
    candidateName: "Channa syntheticus",
  };
  const entry = cacheEntry();
  const artifact = buildArtifact(
    [candidate, other],
    "source-file-hash",
    metadataReceipt(),
    new Map([[entry.querySha256, entry]]),
  );
  assert.equal(artifact.status, "proposals-incomplete");
  assert.equal(artifact.counts.successfulResponses, 1);
  assert.equal(artifact.counts.unqueriedCandidates, 1);
  assert.equal(artifact.source.candidateArtifactSha256, "source-file-hash");
  assert.equal(artifact.counts.adoptedTaxa, 0);
  assert.equal(artifact.counts.publishedRecords, 0);
  for (const row of artifact.proposals) {
    assert.equal(row.reviewStatus, "pending");
    assert.equal(row.acceptedTaxonId, null);
    assert.equal(row.publicationEligible, false);
    assert.deepEqual(row.regionIds, []);
    assert.deepEqual(row.waterbodyIds, []);
    assert.equal("additionalStatus" in row, false);
    assert.equal("iucnRedListCategoryCode" in row, false);
  }
});

test("checkpoints a failed query, resumes it without refetching successes, then rebuilds offline", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bangwit-taxonomy-"));
  try {
    const items = [
      candidate,
      { ...candidate, id: "synthetic-b", recordedName: "Channa syntheticus", candidateName: "Channa syntheticus" },
    ];
    await writeFile(
      join(directory, "freshwater-checklist-candidates.json"),
      JSON.stringify({ status: "research-candidates-only", counts: { candidateEntries: 2 }, candidates: items }),
    );
    const requests = [];
    let failSecond = true;
    const fetcher = async (url) => {
      requests.push(url);
      if (url.includes("/metadata?")) return JSON.stringify(metadata);
      if (new URL(url).searchParams.get("scientificName") === "Channa syntheticus" && failSecond)
        throw new Error("Synthetic network outage");
      return JSON.stringify(body());
    };
    const options = { dataDir: directory, cacheDir: join(directory, "raw"), fetcher, onProgress: () => {} };
    const first = await run({ ...options, fetchSources: true });
    assert.equal(first.counts.failedQueries, 1);
    assert.equal(first.status, "proposals-incomplete");
    failSecond = false;
    requests.length = 0;
    const resumed = await run({ ...options, fetchSources: true });
    assert.equal(resumed.status, "proposals-complete-review-pending");
    assert.equal(resumed.counts.successfulResponses, 2);
    assert.equal(requests.filter((url) => !url.includes("/metadata?")).length, 1);
    const before = await readFile(join(directory, "freshwater-taxonomy-matches.json"), "utf8");
    await run({
      ...options,
      check: true,
      fetcher: () => {
        throw new Error("Offline check made a network request");
      },
    });
    assert.equal(await readFile(join(directory, "freshwater-taxonomy-matches.json"), "utf8"), before);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("an index change during acquisition remains incomplete in subsequent offline rebuilds", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bangwit-taxonomy-index-"));
  try {
    await writeFile(
      join(directory, "freshwater-checklist-candidates.json"),
      JSON.stringify({ status: "research-candidates-only", counts: { candidateEntries: 1 }, candidates: [candidate] }),
    );
    let metadataRequests = 0;
    const options = {
      dataDir: directory,
      cacheDir: join(directory, "raw"),
      onProgress: () => {},
      fetcher: async (url) => {
        if (!url.includes("/metadata?")) return JSON.stringify(body());
        return JSON.stringify(++metadataRequests === 1 ? metadata : { ...metadata, created: "2026-02-01T00:00:00Z" });
      },
    };
    const result = await run({ ...options, fetchSources: true });
    assert.equal(result.source.indexStableDuringRun, false);
    assert.equal(result.status, "proposals-incomplete");
    assert.equal((await run(options)).status, "proposals-incomplete");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("the committed proposal artifact matches its candidate input and keeps every real result pending", async () => {
  const inputBytes = await readFile(
    new URL("../data/research/philippines/freshwater-checklist-candidates.json", import.meta.url),
  );
  const input = JSON.parse(inputBytes);
  const artifact = JSON.parse(
    await readFile(new URL("../data/research/philippines/freshwater-taxonomy-matches.json", import.meta.url), "utf8"),
  );
  assert.equal(artifact.source.checklistKey, CHECKLIST_KEY);
  assert.equal(artifact.source.candidateArtifactSha256, hash(inputBytes));
  assert.equal(artifact.source.indexStableDuringRun, true);
  assert.equal(artifact.counts.totalCandidates, input.candidates.length);
  assert.equal(artifact.counts.successfulResponses, input.candidates.length);
  assert.equal(artifact.counts.failedQueries, 0);
  assert.equal(artifact.counts.unqueriedCandidates, 0);
  assert.equal(artifact.counts.pendingReview, input.candidates.length);
  assert.equal(artifact.counts.adoptedTaxa, 0);
  assert.equal(artifact.counts.publishedRecords, 0);
  assert.equal(new Set(artifact.proposals.map(({ candidateId }) => candidateId)).size, input.candidates.length);
  const inputIds = new Set(input.candidates.map(({ id }) => id));
  for (const row of artifact.proposals) {
    assert.ok(inputIds.has(row.candidateId));
    assert.equal(row.queryParameters.checklistKey, CHECKLIST_KEY);
    assert.match(row.responseSha256, /^[a-f0-9]{64}$/);
    assert.equal(row.queryStatus, "success");
    assert.equal(row.reviewStatus, "pending");
    assert.equal(row.acceptedTaxonId, null);
    assert.equal(row.publicationEligible, false);
    assert.deepEqual(row.regionIds, []);
    assert.deepEqual(row.waterbodyIds, []);
    if (row.proposedUsage) {
      assert.equal(row.proposedUsage.checklistKey, CHECKLIST_KEY);
      assert.equal(typeof row.proposedUsage.usageKey, "string");
    }
    assert.equal("additionalStatus" in row, false);
    assert.equal("iucnRedListCategoryCode" in row, false);
  }
});
