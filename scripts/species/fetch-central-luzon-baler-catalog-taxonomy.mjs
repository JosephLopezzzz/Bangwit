import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCatalogResults, selectCatalogResult } from "./catalog-of-fishes-parser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../");
const outputPath = "data/research/philippines/national/reviews/central-luzon-aurora-baler-river-abstract-taxonomy-review-20261127.json";
const rawDirectory = "data/research/philippines/raw/national/baler-river-catalog-taxonomy-20261127";
const catalogBaseUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp";
const catalogMainUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatmain.asp";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalizeName = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

const sourceLabels = [
  { name: "Awaous melanocephalus", familyAsPrinted: "Gobiidae", orderAsPrinted: "Perciformes", role: "exact-abstract-binomial" },
  { name: "Glossogobius giuris", familyAsPrinted: "Gobiidae", orderAsPrinted: "Perciformes", role: "exact-abstract-binomial" },
  { name: "Mugil sp.", familyAsPrinted: "Mugillidae", orderAsPrinted: "Mugilliformes", role: "genus-level-abstract-label" },
  { name: "Sillagino macrolepsis", familyAsPrinted: "Sillaginidae", orderAsPrinted: "Perciformes", role: "exact-abstract-binomial-spelling" },
];

const queryPlan = [
  { name: "Awaous melanocephalus", role: "exact-abstract-binomial" },
  { name: "Glossogobius giuris", role: "exact-abstract-binomial" },
  { name: "Sillagino macrolepsis", role: "exact-abstract-binomial-spelling" },
  { name: "Sillago macrolepis", role: "possible-spelling-candidate-only" },
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

assert.equal(sourceLabels.length, 4);
assert.equal(sourceLabels.filter(({ role }) => role === "exact-abstract-binomial").length, 2);
assert.equal(sourceLabels.filter(({ role }) => role === "genus-level-abstract-label").length, 1);

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

const queryByKey = new Map(queryResults.map((query) => [
  `${query.queryRole}:${normalizeName(query.queriedName)}`,
  query,
]));
const familyFromStatus = (status) => status?.match(/\)\.\s*([A-Z][A-Za-z-]+)/)?.[1] ?? null;
const catalogCrosswalk = sourceLabels.map((label) => {
  if (label.role === "genus-level-abstract-label") {
    return {
      ...label,
      exactCatalogQuery: null,
      catalogFamily: null,
      familyAgrees: null,
      disposition: "genus-level-only; no species identity can be inferred; preserve source family spelling and do not expand to a species",
    };
  }
  const query = queryByKey.get(`${label.role}:${normalizeName(label.name)}`);
  const exactCurrentName = query?.resultClass === "valid-name"
    && normalizeName(query.acceptedNameCandidate ?? "") === normalizeName(label.name);
  const catalogFamily = familyFromStatus(query?.currentStatus);
  const possibleCandidate = label.name === "Sillagino macrolepsis"
    ? queryByKey.get(`possible-spelling-candidate-only:${normalizeName("Sillago macrolepis")}`)
    : null;
  return {
    ...label,
    exactCatalogQuery: query,
    catalogFamily,
    familyAgrees: catalogFamily ? normalizeName(catalogFamily) === normalizeName(label.familyAsPrinted) : null,
    possibleSpellingCandidateQuery: possibleCandidate,
    possibleCandidateCatalogFamily: familyFromStatus(possibleCandidate?.currentStatus),
    disposition: exactCurrentName
      ? "catalog-current-name-match; name status only and no study specimen identity verified"
      : possibleCandidate?.resultClass === "valid-name"
        ? "source-label-unresolved; similar catalog candidate is recorded separately and is not a correction or specimen re-identification"
        : query?.resultClass === "synonym"
          ? "catalog-synonym; preserve source label and do not treat accepted-name candidate as a specimen re-identification"
          : "exact source string unresolved in catalog; preserve verbatim and hold taxonomic interpretation",
  };
});

const summary = {
  reportedTaxonLabels: sourceLabels.length,
  sourceBinomialLabels: sourceLabels.filter(({ name }) => name.split(/\s+/).length === 2 && !/\ssp\.$/i.test(name)).length,
  genusLevelLabels: sourceLabels.filter(({ role }) => role === "genus-level-abstract-label").length,
  exactCatalogCurrentNameMatches: catalogCrosswalk.filter(({ disposition }) => disposition.startsWith("catalog-current-name-match")).length,
  exactNameFamilyDisagreements: catalogCrosswalk
    .filter(({ exactCatalogQuery, familyAgrees }) => exactCatalogQuery && familyAgrees === false)
    .map(({ name, familyAsPrinted, catalogFamily }) => ({ name, familyAsPrinted, catalogFamily })),
  sourceLabelsUnresolved: catalogCrosswalk.filter(({ disposition }) => disposition.includes("unresolved")).length,
  possibleSpellingCandidatesNotAdmitted: catalogCrosswalk.filter(({ possibleSpellingCandidateQuery }) => possibleSpellingCandidateQuery).length,
  specimenIdentitiesVerified: 0,
  occurrenceAssertionsAdded: 0,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-aurora-baler-river-abstract-taxonomy-review-20261127",
  reviewedOn: "2026-11-27",
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNameAsReported: "Baler River",
  municipalityAsReported: "Baler",
  provinceAsReported: "Aurora",
  sourceIds: ["ijat-aatsea-2017-baler-river-fish-abstract", "calacademy-catalog-baler-river-name-crosscheck-20261127"],
  status: "conference-abstract-only;four-source-labels;catalog-crosscheck-complete;method-vouchers-dates-rights-unresolved;research-only",
  question: "What does the 2017 Baler River conference abstract report, and do its fish-name strings have current Catalog of Fishes matches, without admitting study specimens or correcting the source?",
  source: {
    title: "Taxonomic Classification and Identification of Class Actinopterygii found in Baler River, Baler, Aurora, Philippines",
    proceedings: "The 6th International Conference on Integrated Science and Technology (The 6th ICIST), Scientific Program and Book of Abstracts",
    eventDates: "2017-11-24/2017-11-26",
    printedPage: 121,
    authorLineAsPrinted: "Santiago, Jaec C., Cruz, Antoinette S., Esteban and Noriel B.",
    affiliationAsPrinted: "Central Luzon State University, Science City of Muñoz, Nueva Ecija, Philippines",
    reportedMethod: "The abstract says fish were collected and classified using morphological characters and taxonomic keys, naming a Field Guide to the Freshwater Fishes of New Guinea.",
    reportedTaxa: sourceLabels,
  },
  method: {
    nameAuthority: "California Academy of Sciences, Eschmeyer's Catalog of Fishes; exact binomial queries accessed 2026-11-27.",
    catalogVersion: [...new Set(queryResults.map((query) => query.responseVersion).filter(Boolean))].join("; ") || null,
    procedure: "Reviewed the publisher-hosted proceedings PDF's Baler River abstract on printed p.121. Queried two exact binomial strings, the exact Sillagino macrolepsis source spelling, and a separately labeled Sillago macrolepis spelling candidate. Direct Catalog HTML and SHA-256 receipts are retained in the ignored raw research directory.",
    limits: "The Catalog establishes nomenclatural status only. The abstract provides no survey dates, station list, coordinates, sample counts, diagnostic character matrix, vouchers, or article-specific reuse grant. It does not verify specimen identifications, present-day presence, habitat distribution, completeness, fishery or catchability, diet, legal status, or user-safety information. The Sillago spelling candidate is not a correction of the abstract label.",
  },
  catalogCrosswalk,
  summary,
  decision: {
    sourceLabelsCorrected: 0,
    specimenIdentitiesVerified: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    publicAppRowsAdded: 0,
    speciesImagesAdded: 0,
    dietClaimsAdded: 0,
    geometryAdded: false,
    reusePermissionEstablished: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
    explanation: "Keep the conference abstract as historical, research-only evidence. Preserve its source spellings and genus-level label. Catalog matches and spelling candidates do not verify Baler River specimens or grant permission to reproduce the abstract's records in Bangwit.",
  },
  nextAction: "Seek a full report, thesis, diagnostic record, or voucher trail for the Baler River study; if none is available, keep the four abstract labels held and continue independent Aurora river inventories.",
  sources: [
    {
      sourceId: "ijat-aatsea-2017-baler-river-fish-abstract",
      url: "https://www.ijat-aatsea.com/aatsea/icist2017/CIENTFIC%20PROGRAM%20and%20BOOK%20OF%20ABSTRACTS.pdf",
      supports: "Conference abstract wording, reported four fish labels, title, event dates, and printed page; not detailed sampling or independently validated identifications.",
    },
    {
      sourceId: "calacademy-catalog-baler-river-name-crosscheck-20261127",
      url: catalogMainUrl,
      supports: "Nomenclatural status queries linked per label above; the Catalog does not validate Baler River specimens.",
    },
  ],
};

assert.equal(queryResults.length, 4);
assert.equal(summary.reportedTaxonLabels, 4);
assert.equal(summary.sourceBinomialLabels, 3);
assert.equal(summary.genusLevelLabels, 1);
assert.equal(summary.specimenIdentitiesVerified, 0);
assert.equal(summary.occurrenceAssertionsAdded, 0);
assert.equal(summary.publicAppRowsAdded, 0);
await writeFile(path.join(root, outputPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${outputPath}: ${summary.exactCatalogCurrentNameMatches}/3 exact source-binomial names matched; ${summary.genusLevelLabels} genus-level label and all specimens remain unresolved.`);
