import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const backboneDatasetKey = "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c";
const colChecklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const outputPath = path.join(root, "data/research/philippines/national/reviews/gbif-ph-fish-taxon-selection-20261107.json");
const rawDirectory = path.join(root, "data/research/philippines/raw/national/gbif-taxonomy-20261107");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const candidateGroups = [
  { key: 204, expectedName: "Actinopterygii", commonScope: "ray-finned fishes" },
  { key: 119, expectedName: "Myxini", commonScope: "hagfishes" },
  { key: 11881065, expectedName: "Petromyzonti", commonScope: "lampreys" },
  { key: 120, expectedName: "Holocephali", commonScope: "chimaeras and ratfishes" },
  { key: 121, expectedName: "Elasmobranchii", commonScope: "sharks, skates, and rays" },
  { key: 11500725, expectedName: "Dipneusti", commonScope: "lungfishes" },
  { key: 11733052, expectedName: "Coelacanthi", commonScope: "coelacanths" },
];

async function requestJson(url) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "Bangwit-research/1.0 (taxonomic scope review)",
      },
      signal: AbortSignal.timeout(30_000),
    });
    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer());
      return { body: JSON.parse(bytes.toString("utf8")), bytes };
    }
    const responseBody = await response.text();
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`GBIF taxonomy API returned HTTP ${response.status} for ${new URL(url).pathname}`);
    }
    if (attempt === 4) {
      throw new Error(`GBIF taxonomy API remained unavailable after retries (HTTP ${response.status})`);
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(30_000, retryAfter * 1000)
      : (attempt + 1) * 2_000;
    if (responseBody.length > 0) await wait(Math.min(delay, 30_000));
    else await wait(delay);
  }
  throw new Error("GBIF taxonomy request exhausted retries");
}

async function saveJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

function matchesExpectedBackboneUsage(usage, candidate) {
  return usage.key === candidate.key
    && usage.datasetKey === backboneDatasetKey
    && usage.scientificName === candidate.expectedName
    && usage.rank === "CLASS"
    && usage.taxonomicStatus === "ACCEPTED"
    && usage.parentKey === 44
    && usage.kingdom === "Animalia"
    && usage.phylum === "Chordata"
    && usage.class === candidate.expectedName;
}

async function main() {
  await mkdir(rawDirectory, { recursive: true });
  const resolved = [];
  for (const [index, candidate] of candidateGroups.entries()) {
    if (index > 0) await wait(1_000);
    const url = `https://api.gbif.org/v1/species/${candidate.key}`;
    const { body, bytes } = await requestJson(url);
    const rawPath = path.join(rawDirectory, `taxon-${candidate.key}.json`);
    await writeFile(rawPath, bytes);
    const passedExpectedLineageCheck = matchesExpectedBackboneUsage(body, candidate);
    resolved.push({
      key: body.key,
      scientificName: body.scientificName,
      rank: body.rank,
      taxonomicStatus: body.taxonomicStatus,
      datasetKey: body.datasetKey,
      parentKey: body.parentKey,
      kingdom: body.kingdom,
      phylum: body.phylum,
      class: body.class,
      commonScopeCandidate: candidate.commonScope,
      lookupUrl: url,
      rawResponsePath: path.relative(root, rawPath).replaceAll("\\", "/"),
      rawResponseSha256: sha256(bytes),
      expectedBackboneLineageCheck: passedExpectedLineageCheck ? "passed" : "failed",
    });
  }

  const checklistComparisons = [];
  for (const [index, candidate] of candidateGroups.entries()) {
    if (index > 0) await wait(1_000);
    const url = new URL("https://api.gbif.org/v1/species/match");
    url.searchParams.set("name", candidate.expectedName);
    url.searchParams.set("checklistKey", colChecklistKey);
    const { body, bytes } = await requestJson(url.toString());
    const rawPath = path.join(rawDirectory, `col-match-${candidate.key}.json`);
    await writeFile(rawPath, bytes);
    checklistComparisons.push({
      queriedName: candidate.expectedName,
      matchType: body.matchType ?? null,
      usageKey: body.usageKey ?? null,
      rank: body.rank ?? null,
      status: body.status ?? null,
      scientificName: body.scientificName ?? null,
      kingdom: body.kingdom ?? null,
      phylum: body.phylum ?? null,
      class: body.class ?? null,
      order: body.order ?? null,
      lookupUrl: url.toString(),
      rawResponsePath: path.relative(root, rawPath).replaceAll("\\", "/"),
      rawResponseSha256: sha256(bytes),
    });
  }

  const allBackboneChecksPassed = resolved.every((taxon) => taxon.expectedBackboneLineageCheck === "passed");
  const taxonKeys = candidateGroups.map((candidate) => String(candidate.key));
  const artifact = {
    schemaVersion: 1,
    status: allBackboneChecksPassed ? "candidate-scope-review-pending" : "candidate-resolution-mismatch-review-required",
    provider: "GBIF",
    generatedOn: "2026-11-07",
    retrieval: {
      apiBase: "https://api.gbif.org/v1/species/",
      retrievalDate: "2026-11-07",
      taxonomicSourceName: "GBIF Backbone Taxonomy",
      taxonomicSourceDatasetKey: backboneDatasetKey,
      sourceVersionNote: "GBIF rebuilds its backbone during the year; this date and the raw response hashes pin the inspected key-to-name mappings, not an immutable checklist release.",
    },
    scope: {
      interpretation: "Candidate class roots intended to cover informally defined extant fishes across freshwater, brackish, and marine settings. This is a retrieval scope proposal, not a reviewed checklist of all fish or a species catalog.",
      countryFilter: "PH",
      geographicLimit: "Country-coded occurrence records only; offshore and unlocated records without country coding require a separate discovery query.",
      habitatLimit: "The query does not classify occurrence sites as freshwater, brackish, or marine; that is a separate evidence review.",
      fossilLimit: "The query retains source context. Fossil and other historical records must be excluded from contemporary-presence assertions during normalization.",
      completenessReview: "Confirm that the seven class roots cover the intended fish scope and inspect GBIF taxonomic matches, unresolved higher-rank records, synonyms, and fossil records before using them for a public catalog.",
    },
    checklistComparison: {
      checklistKey: colChecklistKey,
      checklistName: "Catalogue of Life",
      result: "incomplete-root-match; not suitable for this candidate query without additional taxonomic mapping",
      matches: checklistComparisons,
      note: "The GBIF API documentation says an explicit checklistKey selects the checklist taxonomy for a download. These root-name matches did not all resolve in the Catalogue of Life, so do not silently combine its keys with GBIF Backbone keys.",
    },
    candidateTaxa: resolved,
    request: {
      format: "DWCA",
      predicate: {
        type: "and",
        predicates: [
          { type: "equals", key: "COUNTRY", value: "PH" },
          { type: "in", key: "TAXON_KEY", values: taxonKeys },
        ],
      },
    },
    predicateValidation: {
      endpoint: "https://api.gbif.org/v1/occurrence/download/request/validate",
      result: "Validation of predicate downloads not implemented.",
      interpretation: "GBIF did not validate the candidate predicate; this does not indicate that the request is valid or invalid.",
      downloadSubmitted: false,
    },
    downloadReadiness: {
      readyToSubmit: false,
      blockers: [
        "Confirm the current checklist choice; GBIF documents that omitting checklistKey uses its older Backbone taxonomy for downloads.",
        "Review the seven-root fish scope and the class-key predicate against the selected checklist.",
        "Review account notification behavior and expected archive size before any authenticated submission.",
      ],
      externalDownloadSubmitted: false,
      personalContactDataIncluded: false,
    },
    sources: [
      "https://techdocs.gbif.org/en/data-use/api-downloads",
      "https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation",
    ],
  };

  await saveJson(outputPath, artifact);
  console.log(JSON.stringify({
    result: artifact.status,
    candidateTaxonRoots: resolved.length,
    backboneLineageChecksPassed: resolved.filter((taxon) => taxon.expectedBackboneLineageCheck === "passed").length,
    catalogueOfLifeExactRootMatches: checklistComparisons.filter((taxon) => taxon.matchType === "EXACT" && taxon.rank === "CLASS").length,
    readyToSubmit: artifact.downloadReadiness.readyToSubmit,
    externalDownloadSubmitted: artifact.downloadReadiness.externalDownloadSubmitted,
    output: path.relative(root, outputPath).replaceAll("\\", "/"),
  }));
}

main().catch((error) => {
  console.error(`GBIF fish taxon candidate resolution stopped: ${error.message}`);
  process.exitCode = 1;
});
