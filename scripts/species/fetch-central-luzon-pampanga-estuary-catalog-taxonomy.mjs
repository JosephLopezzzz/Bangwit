import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCatalogResults, selectCatalogResult } from "./catalog-of-fishes-parser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../");
const inputPath = "data/research/philippines/central-luzon-pampanga-estuary-fish-study-review-20261024.json";
const outputPath = "data/research/philippines/national/reviews/central-luzon-pampanga-estuary-catalog-taxonomy-crosscheck-20261126.json";
const rawDirectory = "data/research/philippines/raw/national/pampanga-estuary-catalog-taxonomy-20261126";
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

function genusUrl(name) {
  const url = new URL(catalogBaseUrl);
  url.searchParams.set("genus", name);
  url.searchParams.set("tbl", "species");
  return url;
}

function familyFromSpeciesListing(html) {
  const rows = parseCatalogResults(html);
  const validRows = rows.filter((row) => row.classification === "valid-name");
  const families = [...new Set(validRows.map((row) => {
    const classification = row.currentStatus.replace(/^.*?\.\s*/, "");
    return classification.split(":")[0].replace(/\.$/, "").trim();
  }).filter(Boolean))];
  return {
    family: families.length === 1 ? families[0] : null,
    distinctFamilies: families,
    catalogSpeciesRows: validRows.length,
    allCatalogRows: rows.length,
  };
}

const inputBytes = await readFile(path.join(root, inputPath));
const input = JSON.parse(inputBytes.toString("utf8"));
const sourceRows = input.table1AuthorReportedTaxonLabels;
assert.equal(sourceRows.length, 27);

const binomialRows = sourceRows.filter((row) => row.identificationRank === "binomial");
const trinomialRows = sourceRows.filter((row) => row.identificationRank === "trinomial");
const genusOnlyRows = sourceRows.filter((row) => row.identificationRank === "genus-only");
const familyOnlyRows = sourceRows.filter((row) => row.identificationRank === "family-only");
assert.equal(binomialRows.length, 23);
assert.equal(trinomialRows.length, 1);
assert.equal(genusOnlyRows.length, 2);
assert.equal(familyOnlyRows.length, 1);

const queryPlan = [];
for (const row of [...binomialRows, ...trinomialRows]) {
  const words = row.label.trim().split(/\s+/);
  queryPlan.push({
    name: words.slice(0, 2).join(" "),
    queryRole: words.length === 3 ? "trinomial-base-species-query" : "source-table-exact-binomial",
    sourceLabel: row.label,
    sourceRank: row.identificationRank,
  });
}

const comparisonPlan = [
  {
    name: "Oxyurichthys ophthalmonema",
    queryRole: "spelling-candidate",
    sourceLabel: "Oxyurichthys opthalmonema",
  },
];

await mkdir(path.join(root, rawDirectory), { recursive: true });
const queryResults = [];
const allQueries = [...queryPlan, ...comparisonPlan];
for (const [index, query] of allQueries.entries()) {
  const url = speciesUrl(query.name);
  const response = await fetchCatalogPage(url);
  const result = selectCatalogResult(query.name, parseCatalogResults(response.html));
  const raw = await saveRaw(`${String(index + 1).padStart(2, "0")}-${query.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`, response.bytes);
  const version = response.text.match(/Online Version, Updated\s+(.+?)\s+Search Eschmeyer's Catalog/i)?.[1] ?? null;

  queryResults.push({
    queriedName: query.name,
    queryRole: query.queryRole,
    sourceLabel: query.sourceLabel,
    sourceRank: query.sourceRank ?? null,
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

const genusFamilyChecks = [];
for (const [index, row] of genusOnlyRows.entries()) {
  const genus = row.label.trim().split(/\s+/)[0];
  const url = genusUrl(genus);
  const response = await fetchCatalogPage(url);
  const catalogListing = familyFromSpeciesListing(response.html);
  const family = catalogListing.family;
  const raw = await saveRaw(`${String(allQueries.length + index + 1).padStart(2, "0")}-${genus.toLowerCase()}-genus-list.html`, response.bytes);
  const version = response.text.match(/Online Version, Updated\s+(.+?)\s+Search Eschmeyer's Catalog/i)?.[1] ?? null;
  genusFamilyChecks.push({
    genus,
    sourceLabel: row.label,
    sourceFamily: row.family,
    catalogFamily: family,
    distinctFamilies: catalogListing.distinctFamilies,
    catalogSpeciesRows: catalogListing.catalogSpeciesRows,
    allCatalogRows: catalogListing.allCatalogRows,
    url: url.toString(),
    responseVersion: version,
    rawResponse: raw,
    disposition: family
      ? "genus species-list family crosswalk only; no species identity inferred"
      : "genus species listing did not yield one unambiguous family; manual review required",
  });
  if (index < genusOnlyRows.length - 1) await wait(250);
}

const versionSet = [...new Set([...queryResults, ...genusFamilyChecks].map((row) => row.responseVersion).filter(Boolean))];
const queryByKey = new Map(queryResults.map((result) => [`${result.queryRole}:${normalizeName(result.sourceLabel)}`, result]));
const genusByLabel = new Map(genusFamilyChecks.map((check) => [normalizeName(check.sourceLabel), check]));
const taxonCrosswalk = sourceRows.map((row, index) => {
  if (row.identificationRank === "family-only") {
    return {
      sourceRow: index + 1,
      sourceNameVerbatim: null,
      familyAsPrinted: row.family,
      sourceRank: "family-only",
      currentCatalogFamily: null,
      familyComparison: null,
      disposition: "family-only source identification; no genus or species identity can be checked",
    };
  }

  if (row.identificationRank === "genus-only") {
    const check = genusByLabel.get(normalizeName(row.label));
    return {
      sourceRow: index + 1,
      sourceNameVerbatim: row.label,
      familyAsPrinted: row.family,
      sourceRank: "genus-only",
      genusFamilyCheck: check,
      currentCatalogFamily: check?.catalogFamily ?? null,
      familyComparison: check?.catalogFamily
        ? { sourceFamily: row.family, catalogFamily: check.catalogFamily, agrees: normalizeName(row.family) === normalizeName(check.catalogFamily) }
        : null,
      disposition: check?.catalogFamily
        ? "genus-only; family comparison available; species identity remains unresolved"
        : "genus-only; current family unresolved; species identity remains unresolved",
    };
  }

  const keyRole = row.identificationRank === "trinomial" ? "trinomial-base-species-query" : "source-table-exact-binomial";
  const exact = queryByKey.get(`${keyRole}:${normalizeName(row.label)}`);
  const classification = exact?.currentStatus?.replace(/^.*?\.\s*/, "") ?? null;
  const currentFamily = classification?.split(":")[0]?.replace(/\.$/, "").trim() ?? null;
  const acceptedBaseSpeciesMatches = exact?.resultClass === "valid-name" &&
    normalizeName(exact.statusName ?? "") === normalizeName(row.label.split(/\s+/).slice(0, 2).join(" "));
  const candidates = queryResults.filter(
    (result) => normalizeName(result.sourceLabel) === normalizeName(row.label) && result.queryRole === "spelling-candidate",
  );

  return {
    sourceRow: index + 1,
    sourceNameVerbatim: row.label,
    familyAsPrinted: row.family,
    sourceRank: row.identificationRank,
    exactCatalogQuery: exact,
    currentCatalogNameCandidate: exact?.statusName ?? null,
    currentCatalogFamily: currentFamily,
    currentCatalogClassification: classification,
    familyComparison: currentFamily
      ? { sourceFamily: row.family, catalogFamily: currentFamily, agrees: normalizeName(row.family) === normalizeName(currentFamily) }
      : null,
    comparisonCandidates: candidates.map((candidate) => ({
      name: candidate.queriedName,
      role: candidate.queryRole,
      currentStatus: candidate.currentStatus,
      url: candidate.url,
      matchingRows: candidate.matchingRows,
    })),
    disposition: row.identificationRank === "trinomial"
      ? acceptedBaseSpeciesMatches
        ? "base species name matches Catalog; trinomial/subspecies status and source specimen remain unverified"
        : "trinomial not resolved at base species level; do not reinterpret source row"
      : acceptedBaseSpeciesMatches
        ? "catalog-current-name-match; source specimen and locality remain unverified"
        : exact?.resultClass === "valid-name" && exact.statusName
          ? "Catalog returns a different valid current-name candidate; preserve source spelling and do not redetermine the specimen"
          : exact?.resultClass === "synonym"
            ? "Catalog returns a synonym record; review the nomenclatural relation without treating it as independent identity confirmation"
            : exact?.resultClass === "status-unresolved" && candidates.length > 0
              ? "exact source spelling unresolved; separate current-name candidate found, but no source-name correction or specimen identification is made"
              : exact?.resultClass === "status-unresolved"
                ? "exact source binomial unresolved; no accepted-name candidate inferred"
                : "catalog result needs manual review; do not reinterpret the source row",
  };
});

const familyDisagreements = taxonCrosswalk
  .filter((row) => row.familyComparison?.agrees === false)
  .map((row) => ({ sourceName: row.sourceNameVerbatim, sourceFamily: row.familyAsPrinted, catalogFamily: row.currentCatalogFamily }));
const summary = {
  sourceTableRows: taxonCrosswalk.length,
  sourceBinomialRows: binomialRows.length,
  sourceTrinomialRows: trinomialRows.length,
  sourceGenusOnlyRows: genusOnlyRows.length,
  familyOnlyRows: familyOnlyRows.length,
  exactBinomialCurrentNameMatches: taxonCrosswalk.filter((row) => row.sourceRank === "binomial" && row.disposition.startsWith("catalog-current-name-match")).length,
  binomialQueriesWithoutSelectedStatus: taxonCrosswalk.filter((row) => row.sourceRank === "binomial" && !row.exactCatalogQuery?.currentStatus).length,
  genusOnlyRowsWithFamilyChecks: taxonCrosswalk.filter((row) => row.sourceRank === "genus-only" && row.currentCatalogFamily).length,
  familyDisagreements,
  comparisonCandidateCount: comparisonPlan.length,
  specimenIdentitiesVerified: 0,
  stationAssignmentsVerified: 0,
  occurrenceAssertionsAdmitted: 0,
  currentPresenceInferred: false,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-pampanga-estuary-catalog-taxonomy-crosscheck-20261126",
  reviewedOn: "2026-11-26",
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNameAsReported: input.waterbody.name,
  status: "catalog-name-crosscheck-complete;source-identities-and-stations-unverified;research-only",
  question: "How do the 27 author-reported Pampanga estuary Table 1 labels compare with the current Catalog of Fishes while preserving source ranks, spelling, and unresolved sampling-site identities?",
  sourceIds: ["abroguena-et-al-pampanga-estuary-2020"],
  inputs: [inputPath],
  inputSha256: sha256(inputBytes),
  method: {
    nameAuthority: "California Academy of Sciences, Eschmeyer's Catalog of Fishes; exact source-name queries, a species-level base-name query for the trinomial, spelling candidate, and genus-filtered species listings accessed 2026-11-26.",
    catalogVersion: versionSet.join("; ") || null,
    procedure: "Preserved the source's 27 printed rows and identification ranks. Queried binomials as printed; queried only the binomial base for the single trinomial and did not infer subspecies validity. Queried the Oxyurichthys spelling candidate separately. Used genus-filtered species listings only to compare the two genus-only rows' families; no species from those listings is assigned to the source row. Raw HTML responses and SHA-256 hashes are retained in ignored local research storage.",
    limits: "The Catalog checks nomenclature and classification, not specimen identity, voucher evidence, the study's sampled station or reach assignment, current presence, fishery availability, food safety, completeness of an estuary checklist, or permission to reuse the source table. A valid-name match is not a redetermination of study specimens. The trinomial query covers only the base binomial.",
  },
  taxonCrosswalk,
  comparisonQueries: queryResults.filter((row) => row.queryRole === "spelling-candidate"),
  genusFamilyChecks,
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
    explanation: "Keep all source rows in the historical, one-dry-season, otter-trawl estuary review. Catalog results support nomenclatural comparison only; they do not resolve the conflicting article reuse signals, sampled station coordinates, or the estuary/Ramsar-site crosswalk. Do not assign the rows to a particular station or other Pampanga waterbody.",
  },
};

assert.equal(queryResults.length, binomialRows.length + trinomialRows.length + comparisonPlan.length);
assert.equal(summary.sourceTableRows, 27);
assert.equal(summary.familyOnlyRows, 1);
assert.equal(summary.genusOnlyRowsWithFamilyChecks, genusOnlyRows.length);
await writeFile(path.join(root, outputPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${outputPath}: ${summary.exactBinomialCurrentNameMatches}/${binomialRows.length} exact binomials match current Catalog names; ${summary.familyDisagreements.length} family conflicts; no specimen identities or app rows admitted.`);
