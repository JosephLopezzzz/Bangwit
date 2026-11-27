import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const runDate = "2026-11-27";
const runDateCompact = runDate.replaceAll("-", "");
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const taxonFile = "data/research/philippines/raw/national/camiling-river-colxr-occurrence-screen-20261127/taxon-match-actinopterygii.json";
const expectedTaxonSha256 = "01e8f9b1849920667c67c91d22f0d6129c2b89c5368239d3aa6775e8bdc33c29";
const rawDirectory = `data/research/philippines/raw/national/bazal-river-colxr-screen-${runDateCompact}`;
const reportPath = `data/research/philippines/national/reviews/central-luzon-bazal-river-colxr-occurrence-screen-${runDateCompact}.json`;

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function writeImmutable(relativePath, bytes) {
  const absolutePath = resolve(root, relativePath);
  try {
    const existing = await readFile(absolutePath);
    if (existing.equals(bytes)) return;
    throw new Error(`Refusing to overwrite changed research snapshot: ${relativePath}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, bytes, { flag: "wx" });
}

async function requestJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "Bangwit research-only GBIF Bazal River screen/1.0",
        },
        signal: AbortSignal.timeout(45000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok) throw new Error(`GBIF returned HTTP ${response.status} for ${url}`);
      return { value: JSON.parse(bytes.toString("utf8")), bytes };
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolvePromise) => setTimeout(resolvePromise, 1500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const taxonBytes = await readFile(resolve(root, taxonFile));
assert.equal(sha256(taxonBytes), expectedTaxonSha256, "Pinned CoL XR Actinopterygii match changed; review before rerunning.");
const taxonMatch = JSON.parse(taxonBytes.toString("utf8"));
assert.equal(String(taxonMatch.usage?.key), taxonKey);
assert.equal(taxonMatch.usage?.name, "Actinopterygii");
assert.equal(taxonMatch.usage?.status, "ACCEPTED");
assert.equal(taxonMatch.diagnostics?.matchType, "EXACT");

const queryPlan = [
  {
    id: "waterbody-exact",
    field: "waterBody",
    term: "Bazal River",
    taxonFiltered: true,
    purpose: "Exact GBIF waterBody field query for the source-reported river name.",
  },
  {
    id: "locality-river-exact",
    field: "locality",
    term: "Bazal River",
    stateProvince: "Aurora",
    taxonFiltered: true,
    purpose: "Exact locality field query for Bazal River within the Aurora province text.",
  },
  {
    id: "locality-bazal-fish",
    field: "locality",
    term: "Bazal",
    stateProvince: "Aurora",
    taxonFiltered: true,
    purpose: "Fish-filtered Bazal locality query; locality text alone does not identify a river site.",
  },
  {
    id: "locality-bazal-control",
    field: "locality",
    term: "Bazal",
    stateProvince: "Aurora",
    taxonFiltered: false,
    purpose: "All-taxa locality control; not a fish count or a river checklist.",
  },
];

await mkdir(resolve(root, rawDirectory), { recursive: true });
const queryResults = [];
for (const query of queryPlan) {
  const url = new URL("https://api.gbif.org/v1/occurrence/search");
  url.searchParams.set("country", "PH");
  url.searchParams.set("occurrenceStatus", "PRESENT");
  url.searchParams.set("limit", "0");
  url.searchParams.set("offset", "0");
  if (query.stateProvince) url.searchParams.set("stateProvince", query.stateProvince);
  url.searchParams.set(query.field, query.term);
  if (query.taxonFiltered) {
    url.searchParams.set("checklistKey", checklistKey);
    url.searchParams.set("taxonKey", taxonKey);
  }

  const { value, bytes } = await requestJson(url);
  const rawPath = `${rawDirectory}/${query.id}.json`;
  await writeImmutable(rawPath, bytes);
  queryResults.push({
    ...query,
    requestUrl: url.toString(),
    count: Number(value.count ?? 0),
    resultRowsReturned: Array.isArray(value.results) ? value.results.length : 0,
    rawResponse: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) },
  });
  console.log(`${query.id}: ${queryResults.at(-1).count}`);
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
}

const localityControl = queryResults.find(({ id }) => id === "locality-bazal-control");
const fishQueries = queryResults.filter(({ taxonFiltered }) => taxonFiltered);
const summary = {
  broadAllTaxaAuroraBazalLocalityCount: localityControl.count,
  fishFilteredExactFieldQueries: fishQueries.length,
  fishFilteredExactFieldPositiveQueries: fishQueries.filter(({ count }) => count > 0).length,
  fishFilteredExactFieldZeroQueries: fishQueries.filter(({ count }) => count === 0).length,
  occurrenceRowsFetched: queryResults.reduce((sum, query) => sum + query.resultRowsReturned, 0),
  occurrenceAssertionsAdded: 0,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-bazal-river-colxr-occurrence-screen-20261127",
  reviewedOn: runDate,
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNameAsReported: "Bazal River",
  provinceAsReported: "Aurora",
  municipalityAsReported: "Maria Aurora",
  relatedReviewFiles: [
    "data/research/philippines/national-luzon-north-luzon-teleost-dna-barcode-dataset-source-review-20261106.json",
  ],
  sourceIds: [
    "gbif-bazal-river-colxr-screen-20261127",
    "gbif-col-xr-taxonomy-matching",
    "ascot-clsu-aurora-river-baseline-lead-2025",
    "jica-bazal-bridge-basic-design-study-2008",
    "dimaquibo-2025-north-luzon-teleost-dna-barcode-dataset",
  ],
  status: "three-bounded-colxr-fish-text-queries-zero;all-taxa-locality-control-zero;no-direct-bazal-fish-inventory-found-in-bounded-search;not-absence-evidence;research-only",
  question: "Do GBIF indexed fields or the reviewed Aurora source leads provide directly attributable fish-species evidence for Bazal River?",
  input: {
    taxonSnapshot: {
      path: taxonFile,
      sha256: expectedTaxonSha256,
      checklistKey,
      taxonKey,
      taxonName: "Actinopterygii",
    },
  },
  method: {
    endpoint: "https://api.gbif.org/v1/occurrence/search",
    procedure: "Ran three count-only CoL XR Actinopterygii text queries for waterBody=Bazal River, locality=Bazal River plus stateProvince=Aurora, and locality=Bazal plus stateProvince=Aurora. Ran one all-taxa locality=Bazal/Aurora control. Requests used country=PH, occurrenceStatus=PRESENT, limit=0, offset=0. Raw count responses and SHA-256 receipts are retained in the Git-ignored research directory.",
    taxonomicScope: "Catalogue of Life Extended Release Actinopterygii only; this excludes fish outside that checklist concept, including sharks and rays.",
    queryResults,
    limits: "Zero counts are bounded text-index results, not evidence of absence. Exact strings can miss aliases, spelling variants, records without standard waterBody/locality values, unindexed datasets, and records absent from GBIF. The all-taxa control is not a fish count. No occurrence rows or record-level licenses were reviewed because all filtered queries returned zero.",
  },
  sourceReview: {
    ascotClsuLead: "ASCOT's 22 January 2025 announcement describes potential marine-science collaboration and calls for baseline research in Bazal and Ditumabo rivers. It is a research-priority announcement, not a study result. Bounded searches for a subsequent Bazal fish survey did not locate a site-resolved species list; this is not proof that no such work exists.",
    jica2008: "The JICA bridge-design report describes only a proposed Bazal Bridge site and qualitatively notes small fishes; it names no taxa and reports no fish sampling, vouchers, or identification method. The same hydrology paragraph calls Bazal a tributary of the Agusan River and gives both 545 km2 and 34 km2 catchment figures, an internal geographic/area conflict. Do not use those hydrology statements to define the Bazal basin or geometry, and do not treat 'small fishes' as a species assertion.",
    northLuzonBarcode: "The reviewed 2025 North Luzon barcode study lists named Aurora river sites but no site named Bazal River. The generic Maria Aurora site labels have not been crosswalked to Bazal. Its article/supplement rights review also keeps site-by-taxon reuse on hold; no species-by-site row is derived here.",
  },
  summary,
  decision: {
    fishOccurrencesAdmitted: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    publicAppRowsAdded: 0,
    geometryAdded: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
    explanation: "Keep Bazal River as an Aurora freshwater discovery lead only. The sources provide a planned-research notice and an old qualitative bridge-site observation, not an identified species list. The 2025 barcode dataset is not site-resolved to Bazal, and the JICA hydrology paragraph contains a material internal conflict.",
  },
  nextAction: "Search for a published ASCOT/CLSU Bazal baseline with station-level names, specimen or sequence IDs, and reuse terms. If no site-resolved report is found, keep the source gap open and proceed to the next Aurora river lead without assigning the generic Maria Aurora barcode sites to Bazal.",
  sources: [
    {
      sourceId: "gbif-bazal-river-colxr-screen-20261127",
      url: "https://api.gbif.org/v1/occurrence/search",
      supports: "The exact count-query parameters and results in queryResults; zero text counts are not absence evidence.",
    },
    {
      sourceId: "gbif-col-xr-taxonomy-matching",
      url: "https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation",
      supports: "The pinned CoL XR Actinopterygii concept used for count-only filters.",
    },
    {
      sourceId: "ascot-clsu-aurora-river-baseline-lead-2025",
      url: "https://www.ascot.edu.ph/ascot-hosts-clsu-faculty-scientists-for-marine-science-talks/",
      supports: "2025 announcement of planned baseline research priorities for Bazal and Ditumabo; not a fish survey result.",
    },
    {
      sourceId: "jica-bazal-bridge-basic-design-study-2008",
      url: "https://openjicareport.jica.go.jp/pdf/11919313_01.pdf",
      supports: "2008 bridge-site context and its unverified qualitative small-fish observation; internally inconsistent hydrology wording is excluded from geometry or basin assignments.",
    },
    {
      sourceId: "dimaquibo-2025-north-luzon-teleost-dna-barcode-dataset",
      url: "https://www.nature.com/articles/s41597-025-05758-3",
      supports: "Aurora sampling-site name list; it contains no site explicitly named Bazal River, and the related rights/locality review does not admit site-level species rows.",
    },
  ],
};

assert.equal(queryResults.length, 4);
assert.equal(summary.fishFilteredExactFieldQueries, 3);
assert.equal(summary.occurrenceRowsFetched, 0);
assert.equal(summary.occurrenceAssertionsAdded, 0);
assert.equal(summary.publicAppRowsAdded, 0);
await writeFile(resolve(root, reportPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${reportPath}: ${summary.fishFilteredExactFieldZeroQueries}/3 fish-filtered queries returned zero; no occurrence rows admitted.`);
