import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const research = new URL("data/research/philippines/", root);
const cache = new URL("raw/palico-identity-review/", research);
const candidatesFile = new URL("calabarzon-river-source-review.json", research);
const earlierReviewFile = new URL("palico-independent-review.json", research);
const taxonomyFile = new URL("freshwater-taxonomy-matches.json", research);
const outputFile = new URL("palico-identity-addendum.json", research);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const slug = (name) => name.toLowerCase().replaceAll(" ", "-");
const todayInManila = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());

async function get(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "Bangwit field-research/1.0" },
    signal: AbortSignal.timeout(60_000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(response.status, 200, `${response.status} from ${url}`);
  assert.ok(bytes.length > 0, `Empty response from ${url}`);
  return { bytes, body: JSON.parse(bytes.toString("utf8")) };
}

const river = JSON.parse(await readFile(candidatesFile, "utf8"));
const previous = JSON.parse(await readFile(earlierReviewFile, "utf8"));
const taxonomy = JSON.parse(await readFile(taxonomyFile, "utf8"));
const checkedNames = new Set(previous.taxonomyChecks.map((check) => check.scientificName));
const candidates = river.candidates.filter((candidate) => !checkedNames.has(candidate.recordedName));
assert.equal(candidates.length, 10, "Expected exactly ten previously unchecked Palico table names");
await mkdir(cache, { recursive: true });

const metadataUrl = taxonomy.source.metadataUrl;
const metadataRetrievedAtUtc = new Date().toISOString();
const startMetadata = await get(metadataUrl);
const startMetadataHash = hash(startMetadata.bytes);
const metadataPath = "raw/palico-identity-review/col-index-metadata.json";
await writeFile(new URL(metadataPath, research), startMetadata.bytes);
const checks = [];

for (const candidate of candidates) {
  const query = new URL("https://api.gbif.org/v2/species/match");
  query.searchParams.set("scientificName", candidate.recordedName);
  query.searchParams.set("checklistKey", taxonomy.source.checklistKey);
  query.searchParams.set("family", candidate.recordedFamily);
  query.searchParams.set("kingdom", "Animalia");
  const col = await get(query);
  const wormsUrl = `https://www.marinespecies.org/rest/AphiaRecordsByName/${encodeURIComponent(candidate.recordedName)}?like=false&marine_only=false`;
  const worms = await get(wormsUrl);
  const colPath = `raw/palico-identity-review/col-${slug(candidate.recordedName)}.json`;
  const wormsPath = `raw/palico-identity-review/worms-${slug(candidate.recordedName)}.json`;
  await writeFile(new URL(colPath, research), col.bytes);
  await writeFile(new URL(wormsPath, research), worms.bytes);

  const colFamily = col.body.classification?.find((entry) => entry.rank === "FAMILY")?.name ?? null;
  const exactWorms = Array.isArray(worms.body)
    ? worms.body.filter((record) => record.scientificname === candidate.recordedName)
    : [];
  const acceptedWorms = exactWorms.filter(
    (record) => record.status === "accepted" && record.valid_name === candidate.recordedName,
  );
  const familyAgrees =
    colFamily?.toLowerCase() === candidate.recordedFamily.toLowerCase() &&
    acceptedWorms.length === 1 &&
    acceptedWorms[0].family?.toLowerCase() === candidate.recordedFamily.toLowerCase();
  const exactCol =
    col.body.diagnostics?.matchType === "EXACT" &&
    col.body.usage?.rank === "SPECIES" &&
    col.body.usage?.status === "ACCEPTED" &&
    col.body.usage?.canonicalName === candidate.recordedName;

  checks.push({
    recordedName: candidate.recordedName,
    recordedFamily: candidate.recordedFamily,
    recommendedDecision: exactCol && familyAgrees ? "identity-agreement-only" : "hold-name-or-family-conflict",
    publicEligibility: false,
    reason:
      exactCol && familyAgrees
        ? "Exact accepted species and source family agree in the pinned COL XR match and the exact accepted WoRMS record; this establishes taxonomy identity only."
        : "The exact-name accepted taxon and recorded family did not all agree across both independent registries; keep the source assertion on hold.",
    col: {
      responseUrl: query.href,
      responsePath: colPath,
      responseSha256: hash(col.bytes),
      retrievedAtUtc: new Date().toISOString(),
      matchType: col.body.diagnostics?.matchType ?? null,
      confidence: col.body.diagnostics?.confidence ?? null,
      canonicalName: col.body.usage?.canonicalName ?? null,
      authorship: col.body.usage?.authorship ?? null,
      rank: col.body.usage?.rank ?? null,
      status: col.body.usage?.status ?? null,
      family: colFamily,
      usageKey: col.body.usage?.key ?? null,
      acceptedUsageKey: col.body.acceptedUsage?.key ?? null,
    },
    worms: {
      responseUrl: wormsUrl,
      responsePath: wormsPath,
      responseSha256: hash(worms.bytes),
      retrievedAtUtc: new Date().toISOString(),
      exactNameMatches: exactWorms.length,
      acceptedNameMatches: acceptedWorms.length,
      ...(acceptedWorms.length === 1
        ? {
            aphiaId: acceptedWorms[0].AphiaID,
            scientificName: acceptedWorms[0].scientificname,
            validScientificName: acceptedWorms[0].valid_name,
            authority: acceptedWorms[0].authority,
            status: acceptedWorms[0].status,
            family: acceptedWorms[0].family,
            taxonUrl: acceptedWorms[0].url,
          }
        : {}),
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 350));
}

const endMetadata = await get(metadataUrl);
const endMetadataHash = hash(endMetadata.bytes);
assert.equal(
  endMetadataHash,
  startMetadataHash,
  "COL taxonomy index metadata changed during the ten-name review; reacquire and review as a new batch",
);
const artifact = {
  schemaVersion: 1,
  sourceId: "corpuz-2025-palico-lian",
  reviewedOn: todayInManila(),
  status: "identity-review-complete-admission-decisions-pending",
  method:
    "exact-name matching against explicit COL XR checklist plus exact accepted WoRMS record; not expert certification",
  checklist: {
    key: taxonomy.source.checklistKey,
    nameMatchEndpoint: "https://api.gbif.org/v2/species/match",
    metadataUrl,
    metadataSha256: startMetadataHash,
    metadataPath,
    metadataRetrievedAtUtc,
    matchingIndex: {
      datasetKey: startMetadata.body.mainIndex.clbDatasetKey,
      alias: startMetadata.body.mainIndex.datasetAlias,
      created: startMetadata.body.mainIndex.created,
      buildSha: startMetadata.body.mainIndex.buildInfo?.sha,
      metadata: startMetadata.body.mainIndex,
    },
    stableDuringRun: true,
    endMetadataSha256: endMetadataHash,
  },
  counts: {
    checks: checks.length,
    identityAndFamilyAgreements: checks.filter((check) => check.recommendedDecision === "identity-agreement-only")
      .length,
    holds: checks.filter((check) => check.recommendedDecision !== "identity-agreement-only").length,
    publicAdmissions: 0,
  },
  checks,
};
await writeFile(outputFile, json(artifact));
console.log(
  `Palico identity checks: ${artifact.counts.checks}; agreements ${artifact.counts.identityAndFamilyAgreements}; holds ${artifact.counts.holds}; public admissions 0. COL metadata ${startMetadataHash}.`,
);
