import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCatalogResults, selectCatalogResult } from "./catalog-of-fishes-parser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../");
const inputPath = "data/research/philippines/national/reviews/central-luzon-bulacan-snmc-2018-eprmp-indexed-table-followup-20261124.json";
const outputPath = "data/research/philippines/national/reviews/central-luzon-bulacan-snmc-2018-fish-catalog-taxonomy-crosscheck-20261126.json";
const rawDirectory = "data/research/philippines/raw/national/snmc-2018-fish-catalog-taxonomy-20261126";
const catalogBaseUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalizeName = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

function textFromHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&bull;/gi, "•")
    .replace(/&rsquo;|&#8217;/gi, "’")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&#[0-9]+;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function saveRaw(fileName, bytes) {
  const target = path.join(root, rawDirectory, fileName);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return {
    path: path.relative(root, target).replaceAll("\\", "/"),
    bytes: bytes.length,
    sha256: sha256(bytes),
  };
}

async function fetchCatalogPage(url) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html",
      "user-agent": "Bangwit research-only fish taxonomy cross-check/1.0",
    },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`Catalog of Fishes returned HTTP ${response.status} for ${url}`);
  const html = bytes.toString("utf8");
  return { html, bytes, text: textFromHtml(html) };
}

function speciesUrl(name) {
  const [genus, species, ...extra] = name.trim().split(/\s+/);
  assert.equal(extra.length, 0, `Expected a binomial query: ${name}`);
  const url = new URL(catalogBaseUrl);
  url.searchParams.set("genus", genus);
  url.searchParams.set("species", species);
  url.searchParams.set("tbl", "species");
  return url;
}

const inputBytes = await readFile(path.join(root, inputPath));
const input = JSON.parse(inputBytes.toString("utf8"));
const sourceRows = input.fishRowsAsPrinted;
assert.equal(sourceRows.length, 10);

const exactQueries = sourceRows.map((row) => ({
  name: row.taxonAsPrinted,
  queryRole: "source-table-exact-label",
  sourceLabel: row.taxonAsPrinted,
}));
const comparisonQueries = [
  { name: "Channa striata", sourceLabel: "Ophicephalus striatus", queryRole: "current-combination-candidate" },
  { name: "Anguilla australis", sourceLabel: "Anguila australlis", queryRole: "spelling-candidate" },
  { name: "Anguilla bicolor", sourceLabel: "Anguila bicolor", queryRole: "spelling-candidate" },
  { name: "Oreochromis niloticus", sourceLabel: "Tilapia nilotica", queryRole: "current-combination-candidate" },
  { name: "Trichogaster pectoralis", sourceLabel: "Trichogater pectoralis", queryRole: "spelling-candidate" },
  { name: "Trichopodus pectoralis", sourceLabel: "Trichogater pectoralis", queryRole: "current-combination-candidate" },
  { name: "Oreochromis mossambicus", sourceLabel: "Tilapia mozambica", queryRole: "current-combination-candidate" },
  { name: "Ambassis nalua", sourceLabel: "Ambasis nalua", queryRole: "spelling-candidate" },
];

await mkdir(path.join(root, rawDirectory), { recursive: true });
const queryResults = [];
const allQueries = [...exactQueries, ...comparisonQueries];
for (const [index, query] of allQueries.entries()) {
  const url = speciesUrl(query.name);
  const response = await fetchCatalogPage(url);
  const result = selectCatalogResult(query.name, parseCatalogResults(response.html));
  const rawName = query.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const raw = await saveRaw(`${String(index + 1).padStart(2, "0")}-${rawName}.html`, response.bytes);
  const version = response.text.match(/Online Version, Updated\s+(.+?)\s+Search Eschmeyer's Catalog/i)?.[1] ?? null;
  queryResults.push({
    queriedName: query.name,
    queryRole: query.queryRole,
    sourceLabel: query.sourceLabel,
    url: url.toString(),
    resultClass: result.classification,
    selectedCatalogRowName: result.selected?.rowName ?? null,
    currentStatus: result.selected?.currentStatus ?? null,
    statusName: result.selected?.statusName ?? null,
    responseVersion: version,
    matchingRows: result.matchingRows,
    rawResponse: raw,
  });
  if (index < allQueries.length - 1) await wait(250);
}

const queryByKey = new Map(queryResults.map((result) => [`${result.queryRole}:${normalizeName(result.sourceLabel)}`, result]));
const taxonCrosswalk = sourceRows.map((row, index) => {
  const sourceName = row.taxonAsPrinted;
  const exact = queryByKey.get(`source-table-exact-label:${normalizeName(sourceName)}`);
  const classification = exact?.currentStatus?.replace(/^.*?\.\s*/, "") ?? null;
  const currentFamily = classification?.split(":")[0]?.replace(/\.$/, "").trim() ?? null;
  const exactNameMatch = exact?.resultClass === "valid-name" && normalizeName(exact.statusName ?? "") === normalizeName(sourceName);
  const candidateResults = queryResults.filter(
    (result) => normalizeName(result.sourceLabel) === normalizeName(sourceName) && result.queryRole !== "source-table-exact-label",
  );

  return {
    sourceRow: index + 1,
    sourceNameVerbatim: sourceName,
    identificationRank: "binomial-as-printed",
    provisionalMarkedStationsFromIndexedText: row.markedStations,
    stationMarksVisuallyVerified: false,
    exactCatalogQuery: exact,
    currentCatalogNameCandidate: exact?.statusName ?? null,
    currentCatalogFamily: currentFamily,
    comparisonCandidates: candidateResults.map((result) => ({
      name: result.queriedName,
      role: result.queryRole,
      currentStatus: result.currentStatus,
      url: result.url,
      matchingRows: result.matchingRows,
    })),
    disposition: exactNameMatch
      ? "catalog-current-name-match; report label, specimens, and station marks remain unverified"
      : exact?.resultClass === "valid-name" && exact.statusName
        ? "Catalog returns a different valid name candidate; preserve the report label and do not redetermine the specimen"
        : exact?.resultClass === "synonym"
          ? "Catalog returns a synonym record; inspect relation without using it to confirm the report specimen"
          : exact?.resultClass === "status-unresolved" && candidateResults.length > 0
            ? "exact report label unresolved; comparison candidates are separate nomenclatural leads only"
            : exact?.resultClass === "status-unresolved"
              ? "exact report label unresolved; no accepted-name correction inferred"
              : "Catalog result needs manual review; do not reinterpret the report row",
  };
});

const familyCandidates = [...new Set(taxonCrosswalk.map((row) => row.currentCatalogFamily).filter(Boolean))];
const versionSet = [...new Set(queryResults.map((result) => result.responseVersion).filter(Boolean))];
const summary = {
  sourceLabelsReviewed: taxonCrosswalk.length,
  exactCurrentNameMatches: taxonCrosswalk.filter((row) => row.disposition.startsWith("catalog-current-name-match")).length,
  sourceLabelsWithoutSelectedCatalogStatus: taxonCrosswalk.filter((row) => !row.exactCatalogQuery?.currentStatus).length,
  comparisonCandidatesQueried: comparisonQueries.length,
  catalogFamiliesReturned: familyCandidates,
  speciesIdentitiesVerified: 0,
  stationMarksVisuallyVerified: 0,
  specimenVouchersVerified: 0,
  occurrenceAssertionsAdmitted: 0,
  currentPresenceInferred: false,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-bulacan-snmc-2018-fish-catalog-taxonomy-crosscheck-20261126",
  reviewedOn: "2026-11-26",
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNamesAsPrinted: input.waterbodyNames,
  sourceIds: ["emb-snmc-2018-eprmp-aquatic-fauna"],
  inputs: [inputPath],
  inputSha256: sha256(inputBytes),
  status: "catalog-name-crosscheck-complete;source-specimens-and-station-marks-unverified;research-only",
  question: "How do the ten 2006 SNMC EPRMP fish-table labels compare with the current Catalog of Fishes without correcting the source table or treating provisional station marks as occurrences?",
  method: {
    nameAuthority: "California Academy of Sciences, Eschmeyer's Catalog of Fishes; exact report-label queries and separately labeled candidate queries accessed 2026-11-26.",
    catalogVersion: versionSet.join("; ") || null,
    procedure: "Queried each of the ten report table strings exactly, preserving spelling; queried eight nomenclatural or spelling candidates separately. Response HTML and SHA-256 hashes are retained in ignored local research storage.",
    limits: "The Catalog checks names and classification, not the 2006 fish specimens, vouchers, source-identification method, station mapping, the rendered table's X marks, current presence, fishery availability, catchability, safety, or reuse rights. The study says fish identification used both actual identification and interviews without stating the evidence mode for each row. A Catalog candidate is not a source correction or specimen redetermination.",
  },
  sourceContext: {
    surveyYearAsReported: input.sourceDocument.underlyingSurveyYearAsReported,
    printedStationCount: input.sourceDocument.previouslyReviewedSurveyStationCount,
    proseFishNameCount: input.internalCountCrosscheck.fishNamesInSurroundingProse,
    indexedTableFishRowCount: input.internalCountCrosscheck.fishRowsInTable,
    stationMatrixStatus: "Provisional indexed-text transcription; rendered table returned HTTP 403 and was not visually verified.",
    reuseStatus: "No item-specific redistribution permission verified.",
  },
  taxonCrosswalk,
  comparisonQueries: queryResults.filter((row) => row.queryRole !== "source-table-exact-label"),
  summary,
  decision: {
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    appProjectionsAdded: 0,
    geometryAdded: false,
    currentPresenceClaimed: false,
    regionalReleaseApproved: false,
    explanation: "Keep the ten exact report strings as research-only nomenclature notes. Do not assign species to stations, convert X marks into occurrences, infer absence from blank cells, or combine this 2006 survey with the separate May 2022 Conlong/Salapangan assessment.",
  },
};

assert.equal(queryResults.length, exactQueries.length + comparisonQueries.length);
assert.equal(summary.sourceLabelsReviewed, 10);
assert.equal(summary.stationMarksVisuallyVerified, 0);
await writeFile(path.join(root, outputPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${outputPath}: ${summary.exactCurrentNameMatches}/10 exact current-name matches; no specimen identities, station marks, or app rows admitted.`);
