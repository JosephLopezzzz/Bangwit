import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const endpoint = "https://api.gbif.org/v2/species/match";
const metadataUrl = `${endpoint}/metadata?checklistKey=${checklistKey}`;
const inputPath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-taxonomy-crosswalk-20261120.json";
const reviewId = "ncr-scssap-lppwp-tmtp-unresolved-fish-genera-20261120";
const outputPath = path.join(root, "data/research/philippines/national/reviews", `${reviewId}.json`);
const rawDir = path.join(root, "data/research/philippines/raw/national/scssap-unresolved-fish-genera-colxr-20261120");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function validateMetadata(body) {
  assert.equal(body?.mainIndex?.datasetKey, checklistKey);
  assert.ok(body.mainIndex?.datasetAlias);
  assert.ok(body.created && body.buildInfo?.sha);
}

async function fetchJson(url, label) {
  let response;
  let bytes;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Bangwit research genus-label screen/1.0" },
      signal: AbortSignal.timeout(30000),
    });
    bytes = Buffer.from(await response.arrayBuffer());
    if (response.ok) break;
    if (![429, 502, 503, 504].includes(response.status) || attempt === 3)
      throw new Error(`GBIF taxonomy service returned HTTP ${response.status} for ${label}`);
    const retryAfter = Number(response.headers.get("retry-after"));
    await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1));
  }
  return { body: JSON.parse(bytes.toString("utf8")), bytes };
}

async function saveRaw(name, bytes) {
  const target = path.join(rawDir, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return { path: path.relative(root, target).replaceAll("\\", "/"), sha256: sha256(bytes) };
}

function parseSourceLabel(label) {
  const match = label.match(/^([A-Z][A-Za-z-]*)(?:\s+(sp\.(?:\s+\d+)?|spp\.))?$/);
  assert.ok(match, `Unexpected unqueried source label: ${label}`);
  const genusOrHigherName = match[1];
  const suffix = match[2] ?? null;
  const sourceRank = genusOrHigherName === "Pleuronectiformes" ? "ORDER" : "GENUS";
  let labelForm = "genus-only-name";
  if (sourceRank === "ORDER") labelForm = "order-level-placeholder";
  else if (suffix === "spp.") labelForm = "plural-genus-label-unspecified-count";
  else if (/^sp\.\s+\d+$/.test(suffix ?? "")) labelForm = "numbered-genus-placeholder";
  else if (suffix === "sp.") labelForm = "genus-level-placeholder";
  return { genusOrHigherName, sourceRank, labelForm };
}

function familyFor(body) {
  return body.classification?.find((taxon) => taxon.rank === "FAMILY")?.name ?? null;
}

function differsFromSourceName(query, usage) {
  const candidateGenus = usage?.name?.trim().split(/\s+/)[0]?.toLowerCase();
  return candidateGenus ? candidateGenus !== query.toLowerCase() : false;
}

function classify(name, body) {
  const usage = body.usage ?? null;
  const matchType = body.diagnostics?.matchType ?? "NONE";
  if (!usage || matchType === "NONE") return "no-match";
  if (matchType === "EXACT" && usage.rank === "GENUS") return "exact-genus-name";
  if (matchType === "EXACT" && usage.rank === "ORDER") return "exact-order-name";
  if (matchType !== "EXACT") return `candidate-${matchType.toLowerCase()}`;
  return `exact-other-rank-${String(usage.rank ?? "unknown").toLowerCase()}`;
}

const parentBytes = await readFile(path.join(root, inputPath));
const parent = JSON.parse(parentBytes.toString("utf8"));
const pendingRows = parent.sourceRows.filter((row) => row.lookupStatus === "not-queried-non-binomial-source-label");
assert.equal(pendingRows.length, 29);
const parsedRows = pendingRows.map((row) => ({ ...row, ...parseSourceLabel(row.nameAsPrinted) }));
const queryNames = [...new Set(parsedRows.map((row) => row.genusOrHigherName))].sort();
assert.equal(queryNames.length, 20);

await mkdir(rawDir, { recursive: true });
const startResult = await fetchJson(metadataUrl, "start metadata");
validateMetadata(startResult.body);
const metadataStart = await saveRaw("checklist-metadata-start.json", startResult.bytes);

const matches = [];
for (const [index, name] of queryNames.entries()) {
  const url = new URL(endpoint);
  url.searchParams.set("scientificName", name);
  url.searchParams.set("checklistKey", checklistKey);
  url.searchParams.set("kingdom", "Animalia");
  const result = await fetchJson(url.toString(), name);
  const rawResponse = await saveRaw(`matches/${sha256(name).slice(0, 16)}.json`, result.bytes);
  const body = result.body;
  const usage = body.usage ?? null;
  matches.push({
    queriedName: name,
    queryUrl: url.toString(),
    queryParameters: { scientificName: name, checklistKey, kingdom: "Animalia" },
    matchType: body.diagnostics?.matchType ?? null,
    confidence: body.diagnostics?.confidence ?? null,
    classification: classify(name, body),
    usage: usage ? {
      key: usage.key,
      scientificName: usage.name ?? null,
      canonicalName: usage.canonicalName ?? null,
      rank: usage.rank ?? null,
      status: usage.status ?? null,
      authorship: usage.authorship ?? null,
    } : null,
    acceptedUsage: body.acceptedUsage ? {
      key: body.acceptedUsage.key,
      scientificName: body.acceptedUsage.name ?? null,
      canonicalName: body.acceptedUsage.canonicalName ?? null,
      rank: body.acceptedUsage.rank ?? null,
      status: body.acceptedUsage.status ?? null,
    } : null,
    matchedFamily: familyFor(body),
    sourceLabels: parsedRows.filter((row) => row.genusOrHigherName === name).map((row) => ({ sourceRow: row.sourceRow, site: row.site, nameAsPrinted: row.nameAsPrinted, familyAsPrinted: row.familyAsPrinted, labelForm: row.labelForm })),
    rawResponse,
  });
  if (index < queryNames.length - 1) await delay(200);
}

const endResult = await fetchJson(metadataUrl, "end metadata");
validateMetadata(endResult.body);
const metadataEnd = await saveRaw("checklist-metadata-end.json", endResult.bytes);
const indexStable = metadataStart.sha256 === metadataEnd.sha256;
const matchByName = new Map(matches.map((match) => [match.queriedName, match]));
const sourceRows = parsedRows.map((row) => {
  const match = matchByName.get(row.genusOrHigherName);
  return {
    sourceRow: row.sourceRow,
    site: row.site,
    table: row.table,
    familyAsPrinted: row.familyAsPrinted,
    nameAsPrinted: row.nameAsPrinted,
    labelForm: row.labelForm,
    sourceRank: row.sourceRank,
    genusOrHigherNameAsPrinted: row.genusOrHigherName,
    matchClassification: match.classification,
    matchType: match.matchType,
    confidence: match.confidence,
    candidateName: match.usage?.scientificName ?? null,
    candidateRank: match.usage?.rank ?? null,
    candidateFamily: match.matchedFamily,
    candidateDiffersFromSourceString: differsFromSourceName(row.genusOrHigherName, match.usage),
  };
});

const artifact = {
  schemaVersion: 1,
  reviewId,
  reviewedOn: "2026-11-20",
  phaseId: "L2",
  regionId: "1300000000",
  regionName: "National Capital Region (NCR)",
  status: indexStable ? "unresolved-label-rank-screen-complete;candidate-spellings-held;species-identity-unresolved;research-only" : "col-xr-index-changed-during-screen;review-required;research-only",
  question: "What rank and label forms remain in the 29 SCSSAP LPPWP/TMTP rows excluded from the binomial species-name screen, and what genus/order name candidates does the pinned CoL XR matcher return?",
  sourceIds: ["scssap-ph-ecosystems-ch4-lppwp-tmtp-2026", "gbif-col-xr-taxonomy-matching"],
  inputs: [inputPath],
  snapshotHashes: { parentColXrCrosswalk: sha256(parentBytes) },
  sourceAccess: {
    endpoint,
    metadataUrl,
    checklistKey,
    checklistAlias: startResult.body.mainIndex.datasetAlias,
    buildSha: startResult.body.buildInfo.sha,
    indexCreated: startResult.body.created,
    indexStableDuringQueries: indexStable,
    metadataStart,
    metadataEnd,
    queryCount: queryNames.length,
    rawCapture: "One exact source-genus or source-order string per distinct query. Query results are rank/name candidates only; response JSON files are local-only snapshots.",
  },
  method: {
    summary: "Classified the 29 source strings excluded from the earlier binomial screen, then queried the exact genus or order token against the same pinned CoL XR index. Retained every site row, printed family, spelling, and numbered/plural placeholder as written.",
    labelForms: {
      "genus-level-placeholder": "A genus label followed by sp.; species remains unspecified.",
      "numbered-genus-placeholder": "A source-numbered sp. label; numbering is source context and is not a species identifier.",
      "plural-genus-label-unspecified-count": "A genus followed by spp.; the source states plural species but does not provide identities or count.",
      "order-level-placeholder": "An order-level label with sp.; the genus and species are unspecified.",
      "genus-only-name": "A genus name without a species epithet; no species identity is inferred.",
    },
    limitations: [
      "A genus or order match cannot identify any individual species or any fish sampled at either park.",
      "Fuzzy candidates, spelling variants, and family differences remain unresolved; no source spelling is corrected.",
      "Repeated or numbered placeholders are not merged across rows or sites, even where the printed genus is the same.",
      "The underlying Ancog et al. report, voucher basis, methods, dates, exact sampling sites, and item-specific reuse terms remain unavailable in this review.",
    ],
  },
  sourceRowCounts: { LPPWP: 8, TMTP: 21, total: sourceRows.length },
  matchCounts: {
    unresolvedSourceRows: sourceRows.length,
    distinctGenusOrOrderQueries: queryNames.length,
    exactGenusNameMatches: matches.filter((match) => match.classification === "exact-genus-name").length,
    exactOrderNameMatches: matches.filter((match) => match.classification === "exact-order-name").length,
    fuzzyOrOtherCandidates: matches.filter((match) => match.classification.startsWith("candidate-")).length,
    noMatch: matches.filter((match) => match.classification === "no-match").length,
    numberedPlaceholderRows: sourceRows.filter((row) => row.labelForm === "numbered-genus-placeholder").length,
    pluralPlaceholderRows: sourceRows.filter((row) => row.labelForm === "plural-genus-label-unspecified-count").length,
    orderLevelRows: sourceRows.filter((row) => row.labelForm === "order-level-placeholder").length,
    speciesNamesAdded: 0,
    identitiesVerified: 0,
  },
  matches,
  sourceRows,
  decision: {
    sourceRowsCorrected: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    waterbodyAssignmentsAdded: 0,
    geometryAdded: false,
    publicAppProjection: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
  },
  nextActions: [
    "Review the four likely genus spelling variants against an independent specialist authority and the underlying source table image; retain all printed forms until resolved.",
    "Seek the cited Ancog et al. report, voucher/photo index, survey methods, dates, and site-specific roster to resolve the genus and numbered-placeholder rows.",
    "Keep all genus/order matches as research-only nomenclature context; do not convert a genus match into a species entry or combine numbered rows.",
  ],
  sources: [
    { url: endpoint, supports: "Automated taxonomic name matching against the explicit Catalogue of Life XR checklist; this review queries genus/order strings only." },
    { url: "https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation", supports: "GBIF documentation for interpreting name matching; automated matches require review and do not establish species occurrence." },
    { url: "https://scssap.org/library/publications/871-ch4-ecosystems-v20260103-1/file", supports: "Source labels and their table/site context, retained verbatim from Chapter 4." },
  ],
};

await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ review: path.relative(root, outputPath).replaceAll("\\", "/"), indexStable, sourceRows: sourceRows.length, queries: queryNames.length, ...artifact.matchCounts }, null, 2));
