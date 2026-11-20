import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const catalogSearchUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatmain.asp";
const reviewId = "ncr-scssap-lppwp-tmtp-fish-catalog-genera-crosscheck-20261120";
const inputPath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-unresolved-fish-genera-20261120.json";
const outputPath = path.join(root, "data/research/philippines/national/reviews", `${reviewId}.json`);
const rawDir = path.join(root, "data/research/philippines/raw/national/scssap-fish-catalog-genera-20261120");
const hashes = (bytes) => createHash("sha256").update(bytes).digest("hex");
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const queryPlan = [
  { name: "Sardinela", role: "source-printed-form" },
  { name: "Sardinella", role: "comparison-name-candidate" },
  { name: "Leignathus", role: "source-printed-form" },
  { name: "Leiognathus", role: "comparison-name-candidate" },
  { name: "Ambyglobius", role: "source-printed-form" },
  { name: "Amblygobius", role: "comparison-name-candidate" },
  { name: "Hyporhampus", role: "source-printed-form" },
  { name: "Hyporhamphus", role: "comparison-name-candidate" },
  { name: "Platycephalus", role: "source-printed-form" },
];

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&bull;/gi, "•")
    .replace(/&#232;/gi, "è")
    .replace(/&#233;/gi, "é")
    .replace(/&#248;/gi, "ø")
    .replace(/&#269;/gi, "č")
    .replace(/&#333;/gi, "ō")
    .replace(/&#353;/gi, "š")
    .replace(/&#382;/gi, "ž")
    .replace(/&#[0-9]+;/g, " ")
    .replace(/&[a-z]+;/gi, " ");
}

function textFromHtml(value) {
  return decodeHtml(value.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

async function saveRaw(fileName, body) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body, "utf8");
  const target = path.join(rawDir, fileName);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return { path: path.relative(root, target).replaceAll("\\", "/"), sha256: hashes(bytes) };
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "text/html",
      "User-Agent": "Bangwit research-only fish genus cross-check/1.0",
      ...options.headers,
    },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status} for ${url}`);
  return { text: bytes.toString("utf8"), bytes };
}

const sourceBytes = await readFile(path.join(root, inputPath));
const parent = JSON.parse(sourceBytes.toString("utf8"));
const sourceRows = parent.sourceRows;
assert.equal(sourceRows.length, 29);
await mkdir(rawDir, { recursive: true });

const queries = [];
for (const [index, item] of queryPlan.entries()) {
  const response = await fetchText(catalogSearchUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ tbl: "Genus", contains: item.name, Submit: "Search" }),
  });
  assert.match(response.text, /<title>CAS - Eschmeyer's Catalog of Fishes: Genera<\/title>/i);
  const rawSearch = await saveRaw(`search/${item.name.toLowerCase()}.html`, response.bytes);
  const matches = [...response.text.matchAll(/<p class="result" genid="(\d+)">([\s\S]*?)<\/p>/gi)]
    .map((match) => ({
      catalogGenusId: match[1],
      text: textFromHtml(match[2]),
    }))
    .filter((match) => new RegExp(`^${item.name}\\b`, "i").test(match.text));

  const confirmedRecords = [];
  for (const match of matches) {
    const recordUrl = `https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genid=${match.catalogGenusId}`;
    const recordResponse = await fetchText(recordUrl);
    const recordText = textFromHtml(recordResponse.text);
    assert.match(recordText, new RegExp(`\\b${item.name}\\s`, "i"), `Genus result ${match.catalogGenusId} did not validate against its direct Catalog record`);
    const currentStatus = recordText.match(/Current status:\s*([^.]*(?:\.)?)/i)?.[1]?.trim() ?? null;
    const version = recordText.match(/Online Version, Updated\s+([^|]+?)\s+Search Eschmeyer's Catalog/i)?.[1]?.trim() ?? null;
    confirmedRecords.push({
      catalogGenusId: match.catalogGenusId,
      directRecordUrl: recordUrl,
      recordHead: recordText.slice(recordText.search(new RegExp(`\\b${item.name}\\s`, "i")), recordText.search(new RegExp(`\\b${item.name}\\s`, "i")) + 180),
      currentStatus,
      directRecordVersion: version,
      rawResponse: await saveRaw(`records/${item.name.toLowerCase()}-${match.catalogGenusId}.html`, recordResponse.bytes),
    });
    await wait(150);
  }

  queries.push({
    queriedName: item.name,
    queryRole: item.role,
    queryUrl: catalogSearchUrl,
    queryParameters: { database: "Genus", contains: item.name },
    exactGenusRecordCount: confirmedRecords.length,
    exactGenusRecords: confirmedRecords,
    correspondingSourceRows: sourceRows
      .filter((row) => row.genusOrHigherNameAsPrinted.toLowerCase() === item.name.toLowerCase())
      .map((row) => ({ sourceRow: row.sourceRow, site: row.site, sourceLabel: row.nameAsPrinted, familyAsPrinted: row.familyAsPrinted })),
    rawResponse: rawSearch,
  });
  if (index < queryPlan.length - 1) await wait(200);
}

const queriesByName = new Map(queries.map((query) => [query.queriedName.toLowerCase(), query]));
const pairwiseComparisons = [
  ["Sardinela", "Sardinella"],
  ["Leignathus", "Leiognathus"],
  ["Ambyglobius", "Amblygobius"],
  ["Hyporhampus", "Hyporhamphus"],
].map(([sourceForm, comparisonForm]) => ({
  sourceForm,
  sourceFormHasExactCatalogGenusRecord: queriesByName.get(sourceForm.toLowerCase()).exactGenusRecordCount > 0,
  comparisonForm,
  comparisonFormHasExactCatalogGenusRecord: queriesByName.get(comparisonForm.toLowerCase()).exactGenusRecordCount > 0,
  interpretation: "A difference in Catalog search results is a nomenclatural lead only; it does not authorize correction of the source table or identification of any study organism.",
}));

const artifact = {
  schemaVersion: 1,
  reviewId,
  reviewedOn: "2026-11-20",
  phaseId: "L2",
  regionId: "1300000000",
  regionName: "National Capital Region (NCR)",
  status: "specialist-genus-name-crosscheck-complete;source-spellings-retained;species-identity-unresolved;research-only",
  question: "Do the specialist fish catalog records provide name-level context for five genus strings highlighted by the CoL XR rank screen, without correcting the source text or inferring study-specimen identities?",
  sourceIds: ["calacademy-catalog-scssap-wetland-taxa-20261120", "scssap-ph-ecosystems-ch4-lppwp-tmtp-2026"],
  inputs: [inputPath],
  snapshotHashes: { parentRankScreen: hashes(sourceBytes) },
  sourceAccess: {
    catalogSearchUrl,
    databaseSearched: "Genus",
    queryCount: queries.length,
    exactCandidateGenusRecords: queries.reduce((sum, query) => sum + query.exactGenusRecordCount, 0),
    rawCapture: "Each query submitted to the Catalog's official Genus search. Exact name results were checked against their direct genus record pages. Raw HTML is retained in local-only ignored storage, with SHA-256 hashes recorded here.",
  },
  method: {
    summary: "Queried the four printed spelling forms, their four comparison forms, and Platycephalus against the Catalog of Fishes Genus database. A result counted only when the returned genus-record heading exactly matched the query and a direct record page confirmed it.",
    limitations: [
      "A Catalog genus record confirms only a nomenclatural name entry; it does not identify a fish sampled by SCSSAP or confirm any species at LPPWP or TMTP.",
      "No-exact-result outcomes describe this bounded Catalog Genus search only and do not establish that a name is unavailable or invalid in every source.",
      "The four source strings remain verbatim. Comparison-name records do not prove the table contains typographic errors or authorize normalization.",
      "Platycephalus is confirmed at genus rank only; its source row remains genus-level and unresolved below that rank.",
      "The cited underlying Ancog et al. report, vouchers, sampling dates, exact stations, and item-specific reuse terms remain unresolved.",
    ],
  },
  pairwiseComparisons,
  queries,
  decision: {
    sourceLabelsCorrected: 0,
    sourceRowsMerged: 0,
    speciesIdentitiesVerified: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    waterbodyAssignmentsAdded: 0,
    geometryAdded: false,
    publicAppProjection: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
  },
  nextActions: [
    "Keep the SCSSAP spellings and numbered genus placeholders unchanged until the original table or underlying report can be checked directly.",
    "Continue seeking the cited Ancog et al. report, its methods and dated station roster, and any voucher or specimen-photo index.",
    "Retain this Catalog comparison as research-only nomenclatural context; do not create species or park-occurrence rows from it.",
  ],
  sources: [
    { url: catalogSearchUrl, supports: "Official Eschmeyer Catalog Genus search for exact source and comparison strings." },
    ...queries.flatMap((query) => query.exactGenusRecords.map((record) => ({ url: record.directRecordUrl, supports: `Direct Catalog genus record ${record.catalogGenusId} and its current nomenclatural status for ${query.queriedName}.` }))),
    { url: "https://scssap.org/library/publications/871-ch4-ecosystems-v20260103-1/file", supports: "SCSSAP Chapter 4 table context and source spellings; not study specimen verification." },
  ],
};

await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ review: path.relative(root, outputPath).replaceAll("\\", "/"), queries: queries.length, exactGenusRecords: artifact.sourceAccess.exactCandidateGenusRecords, sourceFormsWithExactRecords: queries.filter((query) => query.queryRole === "source-printed-form" && query.exactGenusRecordCount > 0).map((query) => query.queriedName), sourceFormsWithoutExactRecords: queries.filter((query) => query.queryRole === "source-printed-form" && query.exactGenusRecordCount === 0).map((query) => query.queriedName), comparisonFormsWithExactRecords: queries.filter((query) => query.queryRole === "comparison-name-candidate" && query.exactGenusRecordCount > 0).map((query) => query.queriedName) }, null, 2));
