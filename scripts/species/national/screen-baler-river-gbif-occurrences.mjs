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
const rawDirectory = `data/research/philippines/raw/national/baler-river-colxr-screen-${runDateCompact}`;
const reportPath = `data/research/philippines/national/reviews/central-luzon-baler-river-colxr-occurrence-screen-${runDateCompact}.json`;
const pageLimit = 0;

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
          "user-agent": "Bangwit research-only GBIF Baler River screen/1.0",
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
    id: "broad-locality-control",
    field: "locality",
    term: "Baler",
    stateProvince: "Aurora",
    taxonFiltered: false,
    purpose: "All-taxa control for the municipality/locality text; not a fish checklist.",
  },
  {
    id: "waterbody-exact",
    field: "waterBody",
    term: "Baler River",
    taxonFiltered: true,
    purpose: "Exact GBIF waterBody field query for the study waterbody.",
  },
  {
    id: "locality-river-exact",
    field: "locality",
    term: "Baler River",
    stateProvince: "Aurora",
    taxonFiltered: true,
    purpose: "Exact locality field query for the river name within Aurora.",
  },
  {
    id: "locality-municipality-fish",
    field: "locality",
    term: "Baler",
    stateProvince: "Aurora",
    taxonFiltered: true,
    purpose: "Fish-filtered locality query for Baler, Aurora; locality text alone does not identify a river site.",
  },
];

await mkdir(resolve(root, rawDirectory), { recursive: true });
const queryResults = [];
for (const query of queryPlan) {
  const url = new URL("https://api.gbif.org/v1/occurrence/search");
  url.searchParams.set("country", "PH");
  url.searchParams.set("occurrenceStatus", "PRESENT");
  url.searchParams.set("limit", String(pageLimit));
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

const broadControl = queryResults.find(({ id }) => id === "broad-locality-control");
const fishQueries = queryResults.filter(({ taxonFiltered }) => taxonFiltered);
const fishPositiveQueries = fishQueries.filter(({ count }) => count > 0);
const summary = {
  broadAllTaxaBalerAuroraLocalityCount: broadControl.count,
  fishFilteredExactFieldQueries: fishQueries.length,
  fishFilteredExactFieldPositiveQueries: fishPositiveQueries.length,
  fishFilteredExactFieldZeroQueries: fishQueries.filter(({ count }) => count === 0).length,
  occurrenceRowsFetched: queryResults.reduce((sum, query) => sum + query.resultRowsReturned, 0),
  coordinateRequiredFollowups: 0,
  occurrenceAssertionsAdded: 0,
  publicAppRowsAdded: 0,
};

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-baler-river-colxr-occurrence-screen-20261127",
  reviewedOn: runDate,
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNameAsReported: "Baler River",
  relatedReviewFiles: [
    "data/research/philippines/national/reviews/central-luzon-aurora-baler-river-abstract-taxonomy-review-20261127.json",
  ],
  sourceIds: [
    "ijat-aatsea-2017-baler-river-fish-abstract",
    "gbif-baler-river-colxr-screen-20261127",
    "gbif-col-xr-taxonomy-matching",
  ],
  status: "three-bounded-colxr-fish-text-queries-zero;one-all-taxa-locality-control-74;not-absence-evidence;research-only",
  question: "Do the GBIF indexed waterBody/locality fields contain CoL XR Actinopterygii records for the Baler River study name or Baler, Aurora locality?",
  input: {
    taxonSnapshot: { path: taxonFile, sha256: expectedTaxonSha256, checklistKey, taxonKey, taxonName: "Actinopterygii" },
    relatedAbstractReview: "data/research/philippines/national/reviews/central-luzon-aurora-baler-river-abstract-taxonomy-review-20261127.json",
  },
  method: {
    endpoint: "https://api.gbif.org/v1/occurrence/search",
    procedure: "Ran one all-taxa PH/Aurora/locality=Baler count control and three exact-field CoL XR Actinopterygii count queries: waterBody=Baler River, locality=Baler River plus stateProvince=Aurora, and locality=Baler plus stateProvince=Aurora. All requests used occurrenceStatus=PRESENT, limit=0 and offset=0. Raw count responses and SHA-256 receipts are kept in the Git-ignored raw research directory.",
    taxonomicScope: "Catalogue of Life Extended Release Actinopterygii only; this is a filter boundary and excludes fish outside that concept, including sharks and rays.",
    queryResults,
    limits: "Zero counts are bounded text-index results, not evidence of absence. Exact strings can miss aliases, spelling variants, records without standard waterBody/locality values, unindexed datasets, and records absent from GBIF. The broad control counts all taxa and cannot be used as a fish count. No records or record-level licenses were reviewed because the filtered searches returned zero.",
  },
  summary,
  decision: {
    fishOccurrencesAdmitted: 0,
    occurrenceRowsAdded: 0,
    speciesAssertionsAdded: 0,
    publicAppRowsAdded: 0,
    geometryAdded: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
    explanation: "Keep this as a bounded source-discovery result only. It neither confirms nor rules out Baler River fish; the 2017 abstract remains historical research-only evidence with no specimen-level or rights resolution.",
  },
  nextAction: "Continue searching independent, site-resolved Aurora freshwater studies and voucher records; keep the Baler River abstract labels held unless a fuller method, diagnostic, voucher, and reuse trail is found.",
  sources: [
    {
      sourceId: "ijat-aatsea-2017-baler-river-fish-abstract",
      url: "https://www.ijat-aatsea.com/aatsea/icist2017/CIENTFIC%20PROGRAM%20and%20BOOK%20OF%20ABSTRACTS.pdf",
      supports: "Names the Baler River study target; it does not establish a GBIF occurrence or complete locality inventory.",
    },
    {
      sourceId: "gbif-baler-river-colxr-screen-20261127",
      url: "https://api.gbif.org/v1/occurrence/search",
      supports: "Exact count-query parameters and results recorded in queryResults; the filtered zeroes are not absence evidence.",
    },
    {
      sourceId: "gbif-col-xr-taxonomy-matching",
      url: "https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation",
      supports: "Explains explicit GBIF taxonomy/checklist matching; the pinned CoL XR Actinopterygii snapshot supplies the query taxon identifier.",
    },
  ],
};

assert.equal(queryResults.length, 4);
assert.equal(summary.fishFilteredExactFieldQueries, 3);
assert.equal(summary.coordinateRequiredFollowups, 0);
assert.equal(summary.occurrenceRowsFetched, 0);
assert.equal(summary.occurrenceAssertionsAdded, 0);
assert.equal(summary.publicAppRowsAdded, 0);
await writeFile(resolve(root, reportPath), `${JSON.stringify(review, null, 2)}\n`);
console.log(`Saved ${reportPath}: ${summary.fishFilteredExactFieldZeroQueries}/3 fish-filtered queries returned zero; no occurrence rows admitted.`);
