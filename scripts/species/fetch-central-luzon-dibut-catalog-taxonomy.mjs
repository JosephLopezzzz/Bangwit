import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCatalogResults, selectCatalogResult } from "./catalog-of-fishes-parser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../");
const inputPath = "data/research/philippines/central-luzon-aurora-dibut-river-source-review-20261024.json";
const outputPath = "data/research/philippines/national/reviews/central-luzon-aurora-dibut-catalog-taxonomy-crosscheck-20261127.json";
const rawDirectory = "data/research/philippines/raw/national/dibut-catalog-taxonomy-20261127";
const catalogBaseUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp";
const catalogMainUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatmain.asp";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalizeName = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

const tableRows = [
  ["Hypoatherina temminckii", "Atherinidae"],
  ["Ambassis vachellii", "Ambassidae"],
  ["Anguilla marmorata", "Anguillidae"],
  ["Anguilla bicolor", "Anguillidae"],
  ["Yarica hyalosoma", "Apogonidae"],
  ["Oxyeleotris marmorata", "Butidae"],
  ["Butis butis", "Butidae"],
  ["Oreochromis niloticus", "Cichlidae"],
  ["Gerres macracanthus", "Gerreidae"],
  ["Gerres erythrourus", "Gerreidae"],
  ["Kuhlia marginata", "Kuhliidae"],
  ["Eubleekeria splendens", "Leiognatidae"],
  ["Lutjanus argentimaculatus", "Lutjanidae"],
  ["Lutjanus russellii", "Lutjanidae"],
  ["Planiliza macrolepis", "Mugilidae"],
  ["Trichopodus trichopterus", "Osphronemidae"],
  ["Neovespicula depressifrons", "Scorpaenidae"],
  ["Epinephelus fuscoguttatus", "Serranidae"],
  ["Cephalopholis argus", "Serranidae"],
  ["Siganus guttatus", "Siganidae"],
  ["Sillago sihama", "Sillaginidae"],
  ["Mesopristes cancellatus", "Terapontidae"],
];

const abstractVariants = [
  { sourceNameVerbatim: "Planiliza macrolepsis", tableName: "Planiliza macrolepis", issue: "Abstract spelling differs from Table 1." },
  { sourceNameVerbatim: "Mesoprites cancellatus", tableName: "Mesopristes cancellatus", issue: "Abstract genus spelling differs from Table 1." },
  { sourceNameVerbatim: "Hypoatherina temmincki", tableName: "Hypoatherina temminckii", issue: "Abstract spelling differs from Table 1." },
];

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
  return { html: bytes.toString("utf8"), bytes, text: textFromHtml(bytes.toString("utf8")) };
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
assert.equal(input.site.waterbody, "Dibut River");
assert.equal(tableRows.length, 22);

await mkdir(path.join(root, rawDirectory), { recursive: true });
const queryPlan = [
  ...tableRows.map(([name]) => ({ name, role: "table-1-exact-label", tableName: name })),
  ...abstractVariants.map((variant) => ({
    name: variant.sourceNameVerbatim,
    role: "abstract-spelling-variant",
    tableName: variant.tableName,
  })),
];
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
    correspondingTableName: query.tableName,
    url: url.toString(),
    resultClass: result.classification,
    selectedCatalogRowName: result.selected?.rowName ?? null,
    currentStatus: result.selected?.currentStatus ?? null,
    acceptedNameCandidate: result.selected?.statusName ?? null,
    responseVersion: version,
    matchingRows: result.matchingRows,
    rawResponse: raw,
  });
  if (index < queryPlan.length - 1) await wait(300);
}

const queryByKey = new Map(queryResults.map((result) => [
  `${result.queryRole}:${normalizeName(result.queriedName)}`,
  result,
]));
const taxonCrosswalk = tableRows.map(([name, familyAsPrinted], index) => {
  const query = queryByKey.get(`table-1-exact-label:${normalizeName(name)}`);
  const exactCurrentName = query.resultClass === "valid-name" && normalizeName(query.acceptedNameCandidate ?? "") === normalizeName(name);
  return {
    tableRow: index + 1,
    sourceNameVerbatim: name,
    familyAsPrinted,
    exactCatalogQuery: query,
    disposition: exactCurrentName
      ? "catalog-current-name-match; source identification and sampled individual remain unverified"
      : query.resultClass === "synonym"
        ? "catalog-synonym; retain article label; do not treat accepted-name candidate as specimen re-identification"
        : "catalog-status-unresolved-or-different; preserve article label and hold taxonomic interpretation",
  };
});

const familyComparison = taxonCrosswalk.map((row) => {
  const status = row.exactCatalogQuery.currentStatus ?? "";
  const catalogFamily = status.match(/^[^.]*\.\s*([A-Z][A-Za-z-]+)(?::[^.]*)?\./i)?.[1] ?? null;
  return {
    tableRow: row.tableRow,
    sourceNameVerbatim: row.sourceNameVerbatim,
    familyAsPrinted: row.familyAsPrinted,
    catalogFamily,
    agrees: catalogFamily ? normalizeName(catalogFamily) === normalizeName(row.familyAsPrinted) : null,
  };
});

const variantCrosswalk = abstractVariants.map((variant) => {
  const exactVariant = queryByKey.get(`abstract-spelling-variant:${normalizeName(variant.sourceNameVerbatim)}`);
  const tableResult = queryByKey.get(`table-1-exact-label:${normalizeName(variant.tableName)}`);
  return {
    ...variant,
    exactCatalogQuery: exactVariant,
    tableNameCatalogQuery: tableResult,
    disposition: "source variants remain distinct; table spelling is only an internal cross-reference, not a specimen correction",
  };
});

const summary = {
  tableLabelsReviewed: taxonCrosswalk.length,
  tableLabelsWithExactCurrentCatalogName: taxonCrosswalk.filter((row) => row.disposition.startsWith("catalog-current-name-match")).length,
  tableLabelsReturnedAsSynonyms: taxonCrosswalk.filter((row) => row.exactCatalogQuery.resultClass === "synonym").length,
  tableLabelsNeedingManualStatusReview: taxonCrosswalk.filter((row) => !["valid-name", "synonym"].includes(row.exactCatalogQuery.resultClass)).length,
  sourceFamilyVsCatalogDisagreements: familyComparison.filter((row) => row.agrees === false),
  abstractVariantsReviewed: variantCrosswalk.length,
  specimenIdentitiesVerified: 0,
  sourceCountConflictResolved: false,
  occurrenceAssertionsAdded: 0,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-aurora-dibut-catalog-taxonomy-crosscheck-20261127",
  reviewedOn: "2026-11-27",
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNameAsReported: "Dibut River",
  relatedReviewFiles: [inputPath],
  sourceIds: ["aurora-dibut-river-ichthyofauna-2025", "calacademy-catalog-dibut-taxonomy-crosscheck-20261127"],
  status: "catalog-name-crosscheck-complete;article-count-and-rights-held;source-identities-unverified;research-only",
  question: "How do the 22 Dibut River Table 1 fish labels compare with Eschmeyer's current names, without correcting the article or re-identifying sampled fish?",
  input: { path: inputPath, sha256: sha256(inputBytes) },
  method: {
    nameAuthority: "California Academy of Sciences, Eschmeyer's Catalog of Fishes; exact table-label and abstract-variant queries accessed 2026-11-27.",
    catalogVersion: [...new Set(queryResults.map((result) => result.responseVersion).filter(Boolean))].join("; ") || null,
    procedure: "Queried all 22 two-word scientific labels visibly listed in the publisher-hosted Table 1 and three distinct spellings from the abstract. The source strings and abstract variants are preserved. Direct Catalog HTML and SHA-256 receipts are retained under the ignored raw research directory.",
    tableBasis: "Table 1 printed on p. 176 in Mercader et al. (2025), as accessible in the publisher-hosted PDF. The 22 rows are the table's label count, not a resolution of the abstract/results/conclusion 22-versus-23 conflict.",
    limits: "The Catalog establishes nomenclatural status only. It does not verify Dibut specimens, voucher identities, station assignments, counts, habitat boundaries, current presence, completeness of the river inventory, or permission to reuse the article's data or images.",
  },
  taxonCrosswalk,
  familyComparison,
  abstractVariantCrosswalk: variantCrosswalk,
  summary,
  decision: {
    sourceStringsCorrected: 0,
    specimenIdentitiesVerified: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    publicAppRowsAdded: 0,
    speciesImagesAdded: 0,
    dietClaimsAdded: 0,
    geometryAdded: false,
    sourceCountConflictResolved: false,
    articleReusePermissionEstablished: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
    explanation: "Keep the historical three-station study and its unresolved 22/23 count and article-reuse questions as held evidence. Catalog candidates remain a separate name crosswalk and do not verify sampled fish or authorize a public checklist, image, or data projection.",
  },
  nextAction: "Keep the article's row and count conflicts unresolved pending author/source clarification or vouchers; continue independent Central Luzon waterbody and freshwater source coverage.",
  sources: [
    {
      sourceId: "aurora-dibut-river-ichthyofauna-2025",
      url: "https://ejabf.journals.ekb.eg/article_426195_dd6e1cec9caaf922fbfa04ef1e86bc58.pdf",
      supports: "Publisher-hosted Dibut River article and Table 1 source labels; article-level reuse terms were not established.",
    },
    {
      sourceId: "calacademy-catalog-dibut-taxonomy-crosscheck-20261127",
      url: catalogMainUrl,
      supports: "Catalog version and the exact status-query records linked per row above; nomenclature only.",
    },
  ],
};

assert.equal(queryResults.length, 25);
assert.equal(summary.tableLabelsReviewed, 22);
assert.equal(summary.abstractVariantsReviewed, 3);
await writeFile(path.join(root, outputPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${outputPath}: ${summary.tableLabelsWithExactCurrentCatalogName}/22 exact current-name matches; ${summary.sourceFamilyVsCatalogDisagreements.length} family disagreements; no specimen or app rows admitted.`);
