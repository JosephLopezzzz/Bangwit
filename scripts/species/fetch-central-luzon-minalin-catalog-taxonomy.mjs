import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCatalogResults, selectCatalogResult } from "./catalog-of-fishes-parser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../");
const inputPath = "data/research/philippines/central-luzon-minalin-channel-fish-table-review-20261024.json";
const outputPath = "data/research/philippines/national/reviews/central-luzon-minalin-channel-catalog-taxonomy-crosscheck-20261126.json";
const rawDirectory = "data/research/philippines/raw/national/minalin-catalog-taxonomy-20261126";
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
assert.equal(input.sourceTableReview.records.length, 24);
assert.equal(input.sourceTableReview.sourceSpellingAndIdentityIssues.length >= 5, true);

const sourceRows = input.sourceTableReview.records;
const genusOnlyRows = sourceRows.filter((row) => /\s+sp\.$/i.test(row.sourceNameVerbatim.trim()));
const binomialRows = sourceRows.filter((row) => !genusOnlyRows.includes(row));
assert.equal(binomialRows.length, 19);
assert.equal(genusOnlyRows.length, 5);

const queryPlan = [];
const exactNames = new Set();
for (const row of binomialRows) {
  const key = normalizeName(row.sourceNameVerbatim);
  if (!exactNames.has(key)) {
    exactNames.add(key);
    queryPlan.push({
      name: row.sourceNameVerbatim,
      role: "source-table-exact-binomial",
      sourceLabel: row.sourceNameVerbatim,
    });
  }
}

for (const candidate of [
  { name: "Ctenopharyngodon idella", sourceLabel: "Ctenophangyrodon idella", role: "spelling-candidate" },
  { name: "Cyprinus carpio", sourceLabel: "Cyprinos carpio", role: "spelling-candidate" },
  { name: "Trichopodus pectoralis", sourceLabel: "Trichogaster pectoralis", role: "current-combination-candidate" },
  { name: "Arius manillensis", sourceLabel: "Arius manilensis", role: "spelling-candidate" },
  { name: "Elops hawaiiensis", sourceLabel: "Elops hawaiensis (alternate spelling in article keyword)", role: "article-keyword-variant" },
]) {
  queryPlan.push(candidate);
}

await mkdir(path.join(root, rawDirectory), { recursive: true });
const queryResults = [];
for (const [index, query] of queryPlan.entries()) {
  const url = speciesUrl(query.name);
  const response = await fetchCatalogPage(url);
  const result = selectCatalogResult(query.name, parseCatalogResults(response.html));
  const raw = await saveRaw(`${String(index + 1).padStart(2, "0")}-${query.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`, response.bytes);
  const version = response.text.match(/Online Version, Updated\s+(.+?)\s+Search Eschmeyer's Catalog/i)?.[1] ?? null;

  queryResults.push({
    queriedName: query.name,
    queryRole: query.role,
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
  if (index < queryPlan.length - 1) await wait(250);
}

const ambassidaeUrl = new URL(catalogBaseUrl);
ambassidaeUrl.searchParams.set("family", "Ambassidae");
ambassidaeUrl.searchParams.set("tbl", "genus");
const ambassidaeResponse = await fetchCatalogPage(ambassidaeUrl);
const ambassisStart = ambassidaeResponse.text.indexOf("Ambassis Cuvier");
const ambassisContext = ambassisStart < 0 ? null : ambassidaeResponse.text.slice(ambassisStart, ambassisStart + 5000);
assert.ok(ambassisContext, "Ambassis genus was not found in the Catalog's Ambassidae family listing");
assert.match(ambassisContext, /Current status:\s*Valid as Ambassis Cuvier 1828\. Ambassidae\./);
const ambassidaeRaw = await saveRaw("25-ambassidae-genera.html", ambassidaeResponse.bytes);

const queryByKey = new Map(queryResults.map((result) => [`${result.queryRole}:${normalizeName(result.queriedName)}`, result]));
const taxonCrosswalk = sourceRows.map((row, index) => {
  if (/\s+sp\.$/i.test(row.sourceNameVerbatim.trim())) {
    return {
      sourceRow: index + 1,
      sourceNameVerbatim: row.sourceNameVerbatim,
      familyAsPrinted: row.familyAsPrinted,
      sourceRank: "genus-only",
      drySeason: row.drySeason,
      wetSeason: row.wetSeason,
      catalogSpeciesStatus: null,
      familyCrosswalk: row.sourceNameVerbatim.toLowerCase() === "ambassis sp."
        ? {
            catalogFamily: "Ambassidae",
            catalogGenusStatus: "Valid as Ambassis Cuvier 1828. Ambassidae.",
            queryUrl: ambassidaeUrl.toString(),
            sourceFamilyConflict: true,
          }
        : null,
      disposition: row.sourceNameVerbatim.toLowerCase() === "ambassis sp."
        ? "genus-only; family conflict flagged; species identity unresolved"
        : "genus-only; no species-level identity can be checked",
    };
  }

  const exact = queryByKey.get(`source-table-exact-binomial:${normalizeName(row.sourceNameVerbatim)}`);
  const relatedCandidates = queryResults.filter(
    (result) => result.sourceLabel === row.sourceNameVerbatim && result.queryRole !== "source-table-exact-binomial",
  );
  const classification = exact?.currentStatus?.replace(/^.*?\.\s*/, "") ?? null;
  const currentFamily = classification?.split(":")[0]?.replace(/\.$/, "").trim() ?? null;
  const printedFamily = row.familyAsPrinted;
  const acceptedFormMatches = exact?.resultClass === "valid-name" &&
    normalizeName(exact.statusName ?? "") === normalizeName(row.sourceNameVerbatim);

  return {
    sourceRow: index + 1,
    sourceNameVerbatim: row.sourceNameVerbatim,
    familyAsPrinted: printedFamily,
    sourceRank: "binomial-as-printed",
    drySeason: row.drySeason,
    wetSeason: row.wetSeason,
    exactCatalogQuery: exact,
    currentCatalogFamily: currentFamily,
    currentCatalogClassification: classification,
    familyComparison: currentFamily
      ? {
          sourceFamily: printedFamily,
          catalogFamily: currentFamily,
          agrees: normalizeName(printedFamily) === normalizeName(currentFamily),
        }
      : null,
    comparisonCandidates: relatedCandidates.map((candidate) => ({
      name: candidate.queriedName,
      role: candidate.queryRole,
      currentStatus: candidate.currentStatus,
      url: candidate.url,
      matchingRows: candidate.matchingRows,
    })),
    disposition: acceptedFormMatches
      ? "catalog-current-name-match; source specimen and locality remain unverified"
      : exact?.resultClass === "status-unresolved"
        ? "exact source binomial unresolved; comparison candidates are not accepted as source corrections"
        : "catalog result needs manual review; do not reinterpret the source row",
  };
});

const summary = {
  sourceRowsReviewed: taxonCrosswalk.length,
  sourceBinomialRows: binomialRows.length,
  sourceGenusOnlyRows: genusOnlyRows.length,
  exactBinomialCurrentNameMatches: taxonCrosswalk.filter((row) => row.disposition.startsWith("catalog-current-name-match")).length,
  exactBinomialQueriesWithoutSelectedStatus: taxonCrosswalk.filter((row) => row.sourceRank === "binomial-as-printed" && !row.exactCatalogQuery?.currentStatus).length,
  genusOnlyRowsHeld: taxonCrosswalk.filter((row) => row.sourceRank === "genus-only").length,
  familyDisagreements: taxonCrosswalk.filter((row) => row.familyComparison?.agrees === false || row.familyCrosswalk?.sourceFamilyConflict).map((row) => ({
    sourceName: row.sourceNameVerbatim,
    sourceFamily: row.familyAsPrinted,
    catalogFamily: row.currentCatalogFamily ?? row.familyCrosswalk?.catalogFamily,
  })),
  comparisonCandidateCount: queryResults.filter((row) => row.queryRole !== "source-table-exact-binomial").length,
  specimenIdentitiesVerified: 0,
  occurrenceAssertionsAdmitted: 0,
  currentPresenceInferred: false,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-minalin-channel-catalog-taxonomy-crosscheck-20261126",
  reviewedOn: "2026-11-26",
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNameAsReported: input.source.sourceReportedSite,
  status: "catalog-name-crosscheck-complete;source-identities-unverified;research-only",
  question: "How do the 24 Minalin Channel table labels compare with the current Catalog of Fishes without silently correcting labels or re-identifying the study's specimens?",
  sourceIds: ["baysa-et-al-2019-minalin-channel-fish-survey"],
  inputs: [inputPath],
  inputSha256: sha256(inputBytes),
  method: {
    nameAuthority: "California Academy of Sciences, Eschmeyer's Catalog of Fishes; exact species queries and a bounded Ambassidae genus screen accessed 2026-11-26.",
    catalogVersion: [...new Set(queryResults.map((result) => result.responseVersion).filter(Boolean))].join("; ") || null,
    procedure: "Queried each two-word source-table label exactly, preserved source strings, and separately queried five comparison forms noted by the article or apparent spelling/combination differences. Genus-only labels were not sent through species-level matching. Response text and SHA-256 hashes are retained in local ignored research storage.",
    limits: "The Catalog checks nomenclature and higher classification, not the Minalin study specimens, voucher identities, station assignments, source-table correctness, current presence, completeness of the waterbody inventory, or permission to reuse the study data. A candidate accepted name is not a correction or specimen identification.",
  },
  taxonCrosswalk,
  comparisonQueries: queryResults.filter((result) => result.queryRole !== "source-table-exact-binomial"),
  genusFamilyCheck: {
    sourceLabel: "Ambassis sp.",
    familyAsPrinted: "Apogonidae",
    catalogFamily: "Ambassidae",
    catalogGenusStatus: "Valid as Ambassis Cuvier 1828. Ambassidae.",
    url: ambassidaeUrl.toString(),
    rawResponse: ambassidaeRaw,
    disposition: "The printed family conflicts with the Catalog's genus placement; this does not resolve the source genus-only identification.",
  },
  summary,
  decision: {
    speciesRowsAdded: 0,
    occurrenceRowsAdded: 0,
    appProjectionsAdded: 0,
    speciesImagesAdded: 0,
    dietClaimsAdded: 0,
    geometryAdded: false,
    currentPresenceClaimed: false,
    regionalReleaseApproved: false,
    explanation: "Keep all 24 source rows in the historical, gear-specific Minalin evidence review. Do not replace source labels with Catalog candidates or transfer the rows to the whole Pampanga basin. Seek voucher/specimen verification and resolve the family and spelling conflicts before any taxon-level app admission.",
  },
};

assert.equal(queryResults.length, 24);
assert.equal(summary.sourceRowsReviewed, 24);
assert.equal(summary.familyDisagreements.length, 4);
await writeFile(path.join(root, outputPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${outputPath}: ${summary.exactBinomialCurrentNameMatches}/${binomialRows.length} exact binomials match current Catalog names; ${summary.familyDisagreements.length} family conflicts; no specimen identities or app rows admitted.`);
