import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const runDate = "2026-11-27";
const runDateCompact = runDate.replaceAll("-", "");
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const inputQueue = "data/research/philippines/raw/national/fao-hydrorivers-region03-wfs-20261127/emb-roster-nearest-reach-priority-review.jsonl";
const taxonFile = "data/research/philippines/raw/national/camiling-river-colxr-occurrence-screen-20261127/taxon-match-actinopterygii.json";
const rawDirectory = `data/research/philippines/raw/national/region03-emb-river-colxr-screen-${runDateCompact}`;
const reportPath = `data/research/philippines/national/reviews/central-luzon-emb-river-colxr-occurrence-screen-${runDateCompact}.json`;
const expectedInputQueueSha256 = "f13573e4d6692c42ae7c3ab9a550dc11e5e709e7b000525bfef06cbc561ccc52";
const expectedTaxonSha256 = "01e8f9b1849920667c67c91d22f0d6129c2b89c5368239d3aa6775e8bdc33c29";
const expectedTaxonKey = "8VR36";
const pageLimit = 1;

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function writeImmutable(path, bytes) {
  const absolute = resolve(root, path);
  try {
    const existing = await readFile(absolute);
    if (existing.equals(bytes)) return;
    throw new Error(`Refusing to overwrite changed research snapshot: ${path}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, bytes, { flag: "wx" });
}

async function requestJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "Bangwit research source verification/1.0",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      return { value: JSON.parse(bytes.toString("utf8")), bytes };
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolvePromise) => setTimeout(resolvePromise, 1500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const queueBytes = await readFile(resolve(root, inputQueue));
if (sha256(queueBytes) !== expectedInputQueueSha256) throw new Error("Pinned EMB/HydroRIVERS review queue changed; review before rerunning.");
const queueRows = queueBytes.toString("utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
if (queueRows.length !== 14) throw new Error(`Expected 14 EMB labels, received ${queueRows.length}.`);

const taxonBytes = await readFile(resolve(root, taxonFile));
if (sha256(taxonBytes) !== expectedTaxonSha256) throw new Error("Pinned CoL XR Actinopterygii match changed.");
const taxonMatch = JSON.parse(taxonBytes.toString("utf8"));
if (
  String(taxonMatch.usage?.key) !== expectedTaxonKey ||
  taxonMatch.usage?.name !== "Actinopterygii" ||
  taxonMatch.usage?.status !== "ACCEPTED" ||
  taxonMatch.diagnostics?.matchType !== "EXACT"
) throw new Error("Pinned higher-taxon match did not pass expected CoL XR checks.");

const terms = new Map();
for (const row of queueRows) {
  const label = String(row.embReportedRiverLabel);
  const sourceTerms = [{ term: label, relationship: "printed-label" }];
  const base = label.replace(/\s*\([^)]*\)/g, "").trim();
  if (base !== label) sourceTerms.push({ term: base, relationship: "qualifier-stripped-search-only" });
  for (const candidate of sourceTerms) {
    const key = candidate.term.toLocaleLowerCase("en-US");
    if (!terms.has(key)) terms.set(key, { term: candidate.term, labels: [] });
    const entry = terms.get(key);
    if (!entry.labels.some((item) => item.label === label)) entry.labels.push({ label, relationship: candidate.relationship });
  }
}

const rawDirAbsolute = resolve(root, rawDirectory);
await mkdir(rawDirAbsolute, { recursive: true });
const querySummaries = [];
let queryNumber = 0;

for (const { term, labels } of terms.values()) {
  for (const field of ["waterBody", "locality"]) {
    for (const coordinateRequired of [false, true]) {
      if (coordinateRequired && !querySummaries.some((summary) => summary.term === term && summary.field === field && summary.count > 0)) continue;
      const url = new URL("https://api.gbif.org/v1/occurrence/search");
      url.searchParams.set("country", "PH");
      url.searchParams.set("checklistKey", checklistKey);
      url.searchParams.set("taxonKey", taxonKey);
      url.searchParams.set("occurrenceStatus", "PRESENT");
      url.searchParams.set("limit", String(pageLimit));
      url.searchParams.set("offset", "0");
      url.searchParams.set(field, term);
      if (coordinateRequired) url.searchParams.set("hasCoordinate", "true");

      const { value, bytes } = await requestJson(url);
      const slug = term.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const filename = `${String(queryNumber).padStart(2, "0")}-${field.toLowerCase()}-${slug}-${coordinateRequired ? "coordinates" : "all"}.json`;
      await writeImmutable(resolve(rawDirectory, filename), bytes);
      const summary = {
        term,
        termLabels: labels,
        field,
        coordinatesRequired: coordinateRequired,
        requestUrl: url.toString(),
        count: Number(value.count ?? 0),
        firstPageRowsReturned: Array.isArray(value.results) ? value.results.length : 0,
        pageLimit,
        pageOffset: 0,
        rawFile: filename,
        responseSha256: sha256(bytes),
      };
      querySummaries.push(summary);
      console.log(`Query ${queryNumber + 1}: ${field}=${term} coordinates=${coordinateRequired ? "yes" : "any"}: ${summary.count}`);
      queryNumber += 1;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 120));
    }
  }
}

const allTextQueries = querySummaries.filter((summary) => !summary.coordinatesRequired);
const positiveQueries = allTextQueries.filter((summary) => summary.count > 0);
const positiveLabels = new Set(positiveQueries.flatMap((summary) => summary.termLabels.map((item) => item.label)));
const coordinateQueries = querySummaries.filter((summary) => summary.coordinatesRequired);
const report = {
  schemaVersion: 1,
  reviewId: `central-luzon-emb-river-colxr-occurrence-screen-${runDateCompact}`,
  checkedOn: runDate,
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  status: "bounded-gbif-col-xr-actinopterygii-index-screen;record-review-pending;research-only",
  question: "Do the 14 EMB Region III river labels expose GBIF indexed Actinopterygii occurrence leads through the waterBody or locality fields?",
  sourceIds: ["emb-r3-state-environment-2024", "gbif-occurrence-downloads"],
  inputs: {
    [inputQueue]: { sha256: sha256(queueBytes), rows: queueRows.length },
    [taxonFile]: { sha256: sha256(taxonBytes), taxonKey },
  },
  taxonomy: {
    provider: "Global Biodiversity Information Facility",
    checklistName: "Catalogue of Life eXtended Release",
    checklistKey,
    higherTaxonName: "Actinopterygii",
    taxonKey,
    matchType: "EXACT",
    taxonomicStatus: "ACCEPTED",
    scope: "Ray-finned fishes only; this screen excludes sharks, rays and other non-Actinopterygii fish groups.",
  },
  querySemantics: {
    endpoint: "https://api.gbif.org/v1/occurrence/search",
    country: "PH",
    occurrenceStatus: "PRESENT",
    matchedFields: ["waterBody", "locality"],
    nameForms: "Original EMB label and, where parenthetical qualifiers occur, a separate qualifier-stripped search term; this does not merge labels or reach identities.",
    coordinateVariant: "For each positive no-coordinate text search, ran a second query requiring hasCoordinate=true.",
    pageLimit,
    resultRowsRetainedPerQuery: "At most one first-page record; complete indexed count is recorded separately.",
    timeScope: "Current GBIF index snapshot; no date range and no download request.",
  },
  results: {
    embLabelsScreened: queueRows.length,
    distinctSearchTerms: terms.size,
    noCoordinateTextQueries: allTextQueries.length,
    textQueriesWithIndexedHits: positiveQueries.length,
    textQueriesWithZeroHits: allTextQueries.length - positiveQueries.length,
    distinctEmbLabelsWithAtLeastOneTextQueryHit: positiveLabels.size,
    coordinateRequiredFollowupQueries: coordinateQueries.length,
    coordinateRequiredFollowupsWithHits: coordinateQueries.filter((summary) => summary.count > 0).length,
    indexedOccurrenceCountIsNotUniqueAcrossFieldsOrNameVariants: true,
    occurrenceRowsReviewedAgainstOriginalSource: 0,
    waterbodyOrReachAssignmentsValidated: 0,
    speciesAssertionsAdded: 0,
    publicOccurrencesAdded: 0,
    publicGeometryAdded: false,
    publicationApproval: false,
  },
  queries: querySummaries,
  localResearchStorage: {
    directory: rawDirectory,
    gitIgnored: true,
    responseFiles: querySummaries.length,
    containsOccurrenceSampleRowsWhenAvailable: true,
    publicAppIncluded: false,
  },
  limitations: [
    "GBIF is a searchable index, not a complete fish survey or a census of Central Luzon rivers; zero results do not establish absence.",
    "WaterBody/locality text matching is a lead only. Records may be broad, duplicated, misgeoreferenced, taxonomically unresolved, or refer to another site with a similar name.",
    "The query uses CoL XR Actinopterygii only and can miss other fishes, synonyms not indexed under these text fields, and records absent from GBIF.",
    "Only one sample row per query is retained; any positive count requires source dataset, taxon, dates, locality, coordinates, occurrence issues, and item-specific reuse review before a river link is accepted.",
    "No occurrence, coordinates, species claim, waterbody geometry, access rule, or safety recommendation is promoted to the app.",
  ],
  nextAction: positiveQueries.length
    ? "Review each positive query's retained sample and dataset metadata, then page through only those specific searches if the sample has a credible source-level locality link."
    : "Search accessible, dated regional fish surveys and museum datasets with alternate locality spellings; do not infer fish absence from these zero-result searches.",
};

const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeImmutable(reportPath, reportBytes);
console.log(`Finished ${querySummaries.length} GBIF queries: ${positiveQueries.length} positive text query results across ${positiveLabels.size} EMB labels.`);
console.log(`No occurrence rows reviewed or added; report: ${reportPath}`);
