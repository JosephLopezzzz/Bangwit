import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const parentPath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-taxonomy-crosswalk-20261120.json";
const priorityPath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-catalog-of-fishes-issues-20261120.json";
const reviewId = "ncr-scssap-lppwp-tmtp-remaining-col-fish-names-20261120";
const outputPath = path.join(root, "data/research/philippines/national/reviews", `${reviewId}.json`);
const rawDir = path.join(root, "data/research/philippines/raw/national/scssap-fish-catalog-remaining-20261120");
const endpoint = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatmain.asp";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const independentlyChecked = new Set([
  "Carangoides armatus",
  "Gerres filamentosus",
  "Saurida tumbil",
  "Tor tambroides",
  "Elops saurus",
]);

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)))
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&bull;", "•")
    .replaceAll("&quot;", '"')
    .replaceAll("&rsquo;", "’")
    .replaceAll("&lsquo;", "‘");
}

function plainText(html) {
  return decodeEntities(html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function parseResultBlocks(html, queriedName) {
  const blocks = [...html.matchAll(/<p class="result" spid="(\d+)">([\s\S]*?)(?=<p class="result" spid="|CalAcademy Footer|$)/gi)];
  const escapedQuery = queriedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const historicalValidName = new RegExp(`Valid as\\s+${escapedQuery}(?=\\s|\\(|$)`, "i");
  return blocks.map(([, spid, htmlBlock]) => {
    const text = plainText(htmlBlock);
    const binomial = htmlBlock.match(/<b>\s*<i>([^<]+)<\/i>\s*,\s*<i>([^<]+)<\/i>\s*<\/b>/i);
    const originalCombination = binomial ? `${decodeEntities(binomial[2].trim())} ${decodeEntities(binomial[1].trim())}` : null;
    const currentStatus = text.match(/Current status:\s*(.*?)(?=\s*Distribution:|\s*Habitat:|$)/i)?.[1]?.trim() ?? null;
    const familyAndSubfamily = text.match(/Current status:[\s\S]*?\.(.*?)(?=\s*Distribution:|\s*Habitat:|$)/i)?.[1]?.trim() ?? null;
    const isExactHeading = originalCombination?.toLowerCase() === queriedName.toLowerCase();
    const supportsExactValidName = currentStatus?.toLowerCase().startsWith(`valid as ${queriedName.toLowerCase()}`) ?? false;
    const supportsExactSynonymTarget = currentStatus?.toLowerCase().startsWith(`synonym of ${queriedName.toLowerCase()}`) ?? false;
    const historicalNameUse = historicalValidName.test(text);
    return { spid, originalCombination, isExactHeading, currentStatus, familyAndSubfamily, supportsExactValidName, supportsExactSynonymTarget, historicalNameUse };
  });
}

function extractResults(html, queriedName) {
  const blocks = parseResultBlocks(html, queriedName);
  const exactOrAcceptedMatches = blocks
    .filter((record) => record.isExactHeading || record.supportsExactValidName || record.supportsExactSynonymTarget)
    .map(({ historicalNameUse, ...record }) => record);
  const currentStatusAlternatives = blocks
    .filter((record) => record.historicalNameUse
      && !record.supportsExactValidName
      && !record.supportsExactSynonymTarget)
    .map(({ historicalNameUse, ...record }) => record);
  return { exactOrAcceptedMatches, currentStatusAlternatives };
}

async function fetchOne(name) {
  const form = new URLSearchParams({ tbl: "Species", contains: name, Submit: "Search" });
  let response;
  let bytes;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "text/html", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Bangwit research taxonomy review/1.0" },
      body: form,
      signal: AbortSignal.timeout(30000),
    });
    bytes = Buffer.from(await response.arrayBuffer());
    if (response.status === 200) break;
    if (![429, 502, 503, 504].includes(response.status) || attempt === 3) break;
    const retryAfter = Number(response.headers.get("retry-after"));
    await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1));
  }
  assert.equal(response.status, 200, `Catalog returned HTTP ${response.status} for ${name}`);
  const html = bytes.toString("utf8");
  const safe = sha256(name).slice(0, 16);
  const rawPath = path.join(rawDir, `${safe}.html`);
  await writeFile(rawPath, bytes);
  return {
    queriedName: name,
    query: { endpoint, method: "POST", parameters: { tbl: "Species", contains: name, Submit: "Search" } },
    ...extractResults(html, name),
    httpStatus: response.status,
    responseBytes: bytes.length,
    rawResponse: { path: path.relative(root, rawPath).replaceAll("\\", "/"), sha256: sha256(bytes) },
  };
}

const parentBytes = await readFile(path.join(root, parentPath));
const priorityBytes = await readFile(path.join(root, priorityPath));
const parent = JSON.parse(parentBytes.toString("utf8"));
const priority = JSON.parse(priorityBytes.toString("utf8"));
const remaining = parent.uniqueNameMatches.map((x) => x.queriedName).filter((name) => !independentlyChecked.has(name)).sort();
assert.equal(remaining.length, 30);
await mkdir(rawDir, { recursive: true });

const results = new Array(remaining.length);
for (const [index, name] of remaining.entries()) {
  results[index] = await fetchOne(name);
  if (index < remaining.length - 1) await delay(500);
}

const counts = {
  queried: results.length,
  exactCatalogRecords: results.filter((r) => r.exactOrAcceptedMatches.some((x) => x.isExactHeading)).length,
  exactValidNameStatus: results.filter((r) => r.exactOrAcceptedMatches.some((x) => x.supportsExactValidName)).length,
  currentStatusAlternativeQueries: results.filter((r) => r.currentStatusAlternatives.length > 0).length,
  noExactValidNameStatus: results.filter((r) => !r.exactOrAcceptedMatches.some((x) => x.supportsExactValidName)).length,
  queriesWithoutCapturedStatusEvidence: results.filter((r) => r.exactOrAcceptedMatches.length === 0 && r.currentStatusAlternatives.length === 0).length,
};
const artifact = {
  schemaVersion: 1,
  reviewId,
  reviewedOn: "2026-11-20",
  phaseId: "L2",
  regionId: "1300000000",
  regionName: "National Capital Region (NCR)",
  status: "catalog-search-screen-complete;manual-taxonomic-review-pending;specimen-identity-unverified;research-only",
  question: "How do the remaining 30 CoL XR accepted-name candidates in the SCSSAP LPPWP/TMTP binomial labels appear in direct Eschmeyer's Catalog of Fishes search results?",
  sourceIds: ["scssap-ph-ecosystems-ch4-lppwp-tmtp-2026", "calacademy-catalog-scssap-wetland-taxa-20261120"],
  inputs: [parentPath, priorityPath],
  snapshotHashes: { parentColXrCrosswalk: sha256(parentBytes), targetedCatalogIssueReview: sha256(priorityBytes) },
  method: {
    summary: "Submitted each remaining source-printed binomial separately through the Catalog of Fishes Species search form and preserved the raw HTML response locally. The parser records exact headings, exact current-status matches, and historical valid-name mentions whose record now has a different current status.",
    limitations: [
      "A web-catalog search block is a name-status lead, not independent specimen identification or evidence that the species was present in either park.",
      "This screen does not resolve the source's non-binomial, misspelled, higher-rank, or numbered sp. strings.",
      "Multiple historical synonym records in a broad search do not imply multiple study specimens. Two source names have a Catalog status discrepancy and remain unresolved against the source’s organism identity.",
      "The 2020 Ancog et al. source, vouchers, field methods, sampling dates, site assignment, and item-specific reuse terms remain unresolved.",
    ],
  },
  matchCounts: counts,
  results,
  decision: {
    sourceRowsCorrected: 0,
    acceptedNamesApplied: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    waterbodyAssignmentsAdded: 0,
    geometryAdded: false,
    publicAppProjection: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
  },
  nextActions: [
    "Resolve the Ambassis gymnocephalus and Crenimugil seheli current-name discrepancies against direct taxon records, the chosen checklist, and the underlying study material before changing any source label.",
    "Seek the underlying Ancog et al. report, voucher or photo index, dates, methods, site mapping, and reuse terms; no taxonomic catalog can supply that missing study context.",
    "Keep all source names and densities research-only until specimen identity, precise site evidence, and rights are resolved.",
  ],
};

await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ review: path.relative(root, outputPath).replaceAll("\\", "/"), ...counts }, null, 2));
