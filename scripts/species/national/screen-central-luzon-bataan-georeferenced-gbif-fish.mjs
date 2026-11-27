import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const reviewedOn = "2026-11-27";
const runDate = reviewedOn.replaceAll("-", "");
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const priorPreservedSearchPath = "data/research/philippines/raw/central-luzon-bataan-occurrence-screen-20261126/gbif-bataan-actinopterygii-preserved-search.json";
const rawDirectory = `data/research/philippines/raw/central-luzon-bataan-georeferenced-fish-screen-${runDate}`;
const reportPath = `data/research/philippines/national/reviews/central-luzon-bataan-georeferenced-gbif-fish-screen-${runDate}.json`;
const datasetKeys = [
  "50c9509d-22c7-4a22-a47d-8c48425ef4a7",
  "26098c25-8f7f-4c71-97ac-1d3db181c65e",
  "040c5662-da76-4782-a48e-cdea1892d14c",
];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function requestJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "Bangwit research-only Bataan GBIF screen/1.0",
        },
        signal: AbortSignal.timeout(90000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      return { value: JSON.parse(bytes.toString("utf8")), bytes };
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolvePromise) => setTimeout(resolvePromise, 1500 * (attempt + 1)));
    }
  }
  throw lastError;
}

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

const priorBytes = await readFile(resolve(root, priorPreservedSearchPath));
const priorPayload = JSON.parse(priorBytes.toString("utf8"));
assert.equal(priorPayload.results.length, 319, "Pinned Bataan preserved-specimen search row count changed; review before continuing.");
const priorKeys = new Set(priorPayload.results.map((row) => String(row.key)));

const queryUrl = new URL("https://api.gbif.org/v1/occurrence/search");
queryUrl.searchParams.set("country", "PH");
queryUrl.searchParams.set("stateProvince", "Bataan");
queryUrl.searchParams.set("checklistKey", checklistKey);
queryUrl.searchParams.set("taxonKey", taxonKey);
queryUrl.searchParams.set("occurrenceStatus", "PRESENT");
queryUrl.searchParams.set("hasCoordinate", "true");
queryUrl.searchParams.set("hasGeospatialIssue", "false");
queryUrl.searchParams.set("limit", "300");
queryUrl.searchParams.set("offset", "0");

await mkdir(resolve(root, rawDirectory), { recursive: true });
const { value: occurrencePayload, bytes: occurrenceBytes } = await requestJson(queryUrl);
assert.equal(Number(occurrencePayload.count), occurrencePayload.results.length, "GBIF result page is incomplete; do not treat the page as the full search result.");
const occurrencePath = `${rawDirectory}/occurrence-search.json`;
await writeImmutable(occurrencePath, occurrenceBytes);

const datasetMetadata = [];
for (const datasetKey of datasetKeys) {
  const url = `https://api.gbif.org/v1/dataset/${datasetKey}`;
  const { value, bytes } = await requestJson(url);
  const rawPath = `${rawDirectory}/dataset-${datasetKey}.json`;
  await writeImmutable(rawPath, bytes);
  datasetMetadata.push({
    key: value.key,
    title: value.title,
    license: value.license ?? null,
    publisher: value.publishingOrganization?.title ?? null,
    raw: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) },
  });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
}

const records = occurrencePayload.results;
const additionalRecords = records.filter((record) => !priorKeys.has(String(record.key)));
const countBy = (items, getKey) => Object.fromEntries(
  [...items.reduce((counts, item) => {
    const key = String(getKey(item) ?? "not-recorded");
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map()).entries()].sort(([left], [right]) => left.localeCompare(right)),
);
const datasetByKey = new Map(datasetMetadata.map((item) => [item.key, item]));
const additionalByDataset = Object.entries(countBy(additionalRecords, (record) => record.datasetKey)).map(([key, count]) => ({
  datasetKey: key,
  title: datasetByKey.get(key)?.title ?? "Dataset metadata not fetched",
  count,
}));
const uncertaintyBuckets = {
  missing: 0,
  "0-100m": 0,
  "101-1000m": 0,
  "over-1000m": 0,
};
for (const record of records) {
  const uncertainty = Number(record.coordinateUncertaintyInMeters);
  if (!Number.isFinite(uncertainty)) uncertaintyBuckets.missing += 1;
  else if (uncertainty <= 100) uncertaintyBuckets["0-100m"] += 1;
  else if (uncertainty <= 1000) uncertaintyBuckets["101-1000m"] += 1;
  else uncertaintyBuckets["over-1000m"] += 1;
}

const basisOfRecord = countBy(records, (record) => record.basisOfRecord);
const missingLocalityFields = {
  waterBody: records.filter((record) => !String(record.waterBody ?? "").trim()).length,
  locality: records.filter((record) => !String(record.locality ?? "").trim()).length,
};
const additionalRowsWithSourceLocality = additionalRecords.filter((record) => String(record.locality ?? "").trim()).length;
const localityProvenanceCategories = {
  "Orani-market-vendor-Manila-Bay-claim": 0,
  "Olongapo-market-vendor-claims-Orani-catch": 0,
  "Orani-market-Navotas-landing-Bicol-origin-uncertain": 0,
  "Orani-public-market-other": 0,
  "no-locality-text": 0,
  "other-locality-text": 0,
};
for (const record of additionalRecords) {
  const locality = String(record.locality ?? "").toLocaleLowerCase("en-US");
  if (!locality) localityProvenanceCategories["no-locality-text"] += 1;
  else if (locality.includes("provincial market of orani") && locality.includes("vendors claim catch originated around manila bay")) localityProvenanceCategories["Orani-market-vendor-Manila-Bay-claim"] += 1;
  else if (locality.includes("olangapo fish market") && locality.includes("vendor claim fish are caught in orani")) localityProvenanceCategories["Olongapo-market-vendor-claims-Orani-catch"] += 1;
  else if (locality.includes("orani, public market") && locality.includes("navotas fish landing") && locality.includes("bicol")) localityProvenanceCategories["Orani-market-Navotas-landing-Bicol-origin-uncertain"] += 1;
  else if (locality.includes("orani, public market")) localityProvenanceCategories["Orani-public-market-other"] += 1;
  else localityProvenanceCategories["other-locality-text"] += 1;
}

const report = {
  schemaVersion: 1,
  reviewId: `central-luzon-bataan-georeferenced-gbif-fish-screen-${runDate}`,
  reviewedOn,
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  provinceTextScope: "Bataan",
  status: "gbif-coordinate-screen;site-locality-unresolved;research-only",
  question: "Does a broad CoL XR Actinopterygii search for georeferenced Bataan GBIF records add locality-resolved fish evidence beyond the prior preserved-specimen screen?",
  sourceIds: ["gbif-occurrence-downloads", "gbif-nmnh-usnm-extant-specimens", "gbif-ibol-lake-danao-barcode-records", "inaturalist-bulacan-observation-metadata-followup-20261024"],
  input: {
    priorPreservedSearch: {
      path: priorPreservedSearchPath,
      sha256: sha256(priorBytes),
      rows: priorPayload.results.length,
      scope: "GBIF country=PH, stateProvince=Bataan, CoL XR Actinopterygii, PRESERVED_SPECIMEN; previously retained screen.",
    },
  },
  method: {
    endpoint: "https://api.gbif.org/v1/occurrence/search",
    requestUrl: queryUrl.toString(),
    query: {
      country: "PH",
      stateProvince: "Bataan",
      checklistKey,
      checklist: "Catalogue of Life eXtended Release",
      taxonKey,
      higherTaxon: "Actinopterygii",
      occurrenceStatus: "PRESENT",
      hasCoordinate: true,
      hasGeospatialIssue: false,
      limit: 300,
      offset: 0,
    },
    snapshot: { path: occurrencePath, bytes: occurrenceBytes.length, sha256: sha256(occurrenceBytes), count: Number(occurrencePayload.count), returned: records.length },
    datasetMetadata,
    deduplication: "Matched GBIF occurrence keys against the prior 319-row preserved-specimen screen. Non-matching keys are additional index records, not necessarily independent biological observations or specimens.",
    rawStorage: { directory: rawDirectory, gitIgnored: true, coordinatesRetainedOnlyInIgnoredSnapshot: true },
  },
  result: {
    coordinateScreenRows: records.length,
    distinctOccurrenceKeys: new Set(records.map((record) => String(record.key))).size,
    basisOfRecord,
    overlapWithPriorPreservedSearch: records.length - additionalRecords.length,
    occurrenceKeysNotInPriorPreservedSearch: additionalRecords.length,
    additionalRowsByDataset: additionalByDataset,
    coordinateUncertaintyBucketsMeters: uncertaintyBuckets,
    localityFieldMissingCountsAcrossScreen: missingLocalityFields,
    additionalRowsWithAnyLocalityText: additionalRowsWithSourceLocality,
    additionalRowsByDatasetAndLocalityCategory: Object.entries(countBy(additionalRecords, (record) => record.datasetKey)).map(([datasetKey, count]) => ({
      datasetKey,
      title: datasetByKey.get(datasetKey)?.title ?? "Dataset metadata not fetched",
      count,
      recordLicenseCounts: countBy(additionalRecords.filter((record) => record.datasetKey === datasetKey), (record) => record.license),
    })),
    additionalLocalityProvenanceCategories: localityProvenanceCategories,
    specimenOrObservationIdentityValidated: 0,
    namedWaterbodyAssignmentsValidated: 0,
    photoAssetsDownloadedOrVisuallyReviewed: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    geometryAdded: false,
    publicAppRowsAdded: 0,
  },
  interpretation: {
    decision: "The query broadens the Bataan discovery set but does not provide an independently validated fish record for a named river, lake, reservoir, wetland or coastal reach. The 54 additional iNaturalist observations have no waterBody/locality field in GBIF. The 66 additional NMNH/iBOL material-sample rows have market or vendor-origin statements rather than verified capture stations; some NMNH records carry broad Manila Bay or Philippine Sea waterBody labels, which do not resolve the market samples to a collection site. Keep all candidates research-only.",
    administrativeScope: "stateProvince=Bataan is an indexed-text filter, not a polygon intersection or proof that every coordinate falls within the official provincial boundary.",
    coordinates: "hasCoordinate and hasGeospatialIssue=false do not guarantee fine-scale accuracy. Keep point coordinates and record IDs in ignored research storage; uncertainty is summarized in broad bins only.",
    sourceType: "HUMAN_OBSERVATION, MATERIAL_SAMPLE and PRESERVED_SPECIMEN are not interchangeable. An observation is not automatically a wild capture; material/barcode samples can originate from a market; historical specimens do not establish current presence.",
    imageRights: "No image was downloaded, inspected or admitted. iNaturalist record/photo licenses and specimen-media rights require individual review; dataset-level terms do not transfer to each photo by assumption.",
    absence: "This bounded GBIF filter is not a complete inventory; unreturned rows do not establish biological absence.",
  },
  limitations: [
    "The administrative filter is GBIF stateProvince text rather than a validated provincial polygon.",
    "This search covers CoL XR Actinopterygii only; it excludes sharks, rays and other fish groups outside that taxonomic concept.",
    "Coordinates and coordinate uncertainty can be generalized, coarse or otherwise unsuitable for assigning a named waterbody.",
    "The 120 keys outside the prior preserved-specimen screen include 54 iNaturalist observations and 66 material samples. Counts are not counts of independent animals or species.",
    "No item-level source identity, capture status, exact waterbody, taxonomic diagnosis or image reuse rights were verified.",
  ],
  nextStep: "Prioritize separate source-backed Bataan waterbodies and review any candidate row individually for original collection/observation context, taxon evidence, geoprivacy, coordinate uncertainty and record-level license before promoting a historical research assertion or image.",
  sources: [
    { sourceId: "gbif-occurrence-downloads", url: "https://api.gbif.org/v1/occurrence/search", supports: "The exact bounded search request and results recorded in the report; occurrence fields remain candidate evidence." },
    { sourceId: "gbif-nmnh-usnm-extant-specimens", url: "https://api.gbif.org/v1/dataset/26098c25-8f7f-4c71-97ac-1d3db181c65e", supports: "NMNH Material Samples dataset metadata, including its dataset-level license statement; this does not assign field-level rights or capture provenance to each sample." },
    { sourceId: "gbif-ibol-lake-danao-barcode-records", url: "https://api.gbif.org/v1/dataset/040c5662-da76-4782-a48e-cdea1892d14c", supports: "iBOL occurrence-dataset metadata and its dataset-level license statement; barcode identifiers are not species determinations." },
    { sourceId: "inaturalist-bulacan-observation-metadata-followup-20261024", url: "https://api.gbif.org/v1/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7", supports: "The iNaturalist Research-grade Observations dataset metadata and its dataset-level CC BY-NC license statement; item/photo rights and locality remain record-specific." },
  ],
};

assert.equal(report.result.coordinateScreenRows, report.result.distinctOccurrenceKeys);
assert.equal(report.result.coordinateScreenRows, Number(occurrencePayload.count));
assert.equal(report.result.speciesAssertionsAdded, 0);
assert.equal(report.result.occurrenceRowsAdded, 0);
assert.equal(report.result.publicAppRowsAdded, 0);
await writeFile(resolve(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  reportPath,
  count: report.result.coordinateScreenRows,
  basisOfRecord,
  overlapWithPriorPreservedSearch: report.result.overlapWithPriorPreservedSearch,
  additionalRowsByDataset: additionalByDataset,
  coordinateUncertaintyBucketsMeters: uncertaintyBuckets,
  localityFieldMissingCounts: missingLocalityFields,
  additionalRowsWithAnyLocalityText: additionalRowsWithSourceLocality,
  noOccurrenceOrAppRowsAdmitted: true,
}, null, 2));
