import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const countReportPath = new URL("data/research/philippines/national/reviews/gbif-region02-river-field-counts-col-filtered-20261109.json", root);
const rawDirectory = new URL("data/research/philippines/raw/national/gbif-region02-river-records-col-filtered-20261109/", root);
const outputPath = new URL("data/research/philippines/raw/national/gbif-region02-river-record-candidate-review-col-filtered-20261109.jsonl", root);
const reportPath = new URL("data/research/philippines/national/reviews/gbif-region02-river-record-candidate-review-col-filtered-20261109.json", root);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const pageSize = 100;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) => value.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

async function get(url) {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public GBIF record triage)" },
      signal: AbortSignal.timeout(30000),
    });
    if (response.status !== 429 && response.status < 500) break;
    if (attempt === 3) break;
    await wait(1000 * (attempt + 1));
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  let json;
  try {
    json = JSON.parse(bytes.toString("utf8"));
  } catch {
    json = { error: bytes.toString("utf8") };
  }
  return { response, bytes, json };
}

function recordView(row) {
  return {
    gbifId: row.gbifID ?? null,
    occurrenceId: row.occurrenceID ?? null,
    scientificName: row.scientificName ?? null,
    acceptedScientificName: row.acceptedScientificName ?? null,
    taxonRank: row.taxonRank ?? null,
    taxonomicStatus: row.taxonomicStatus ?? null,
    class: row.class ?? null,
    family: row.family ?? null,
    basisOfRecord: row.basisOfRecord ?? null,
    occurrenceStatus: row.occurrenceStatus ?? null,
    datasetKey: row.datasetKey ?? null,
    datasetTitle: row.datasetTitle ?? null,
    license: row.license ?? null,
    rightsHolder: row.rightsHolder ?? null,
    eventDate: row.eventDate ?? null,
    year: row.year ?? null,
    waterBody: row.waterBody ?? null,
    locality: row.locality ?? null,
    verbatimLocality: row.verbatimLocality ?? null,
    stateProvince: row.stateProvince ?? null,
    county: row.county ?? null,
    municipality: row.municipality ?? null,
    institutionCode: row.institutionCode ?? null,
    collectionCode: row.collectionCode ?? null,
    catalogNumber: row.catalogNumber ?? null,
    recordedBy: row.recordedBy ?? null,
    identifiedBy: row.identifiedBy ?? null,
    identificationRemarks: row.identificationRemarks ?? null,
    coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters ?? null,
    hasCoordinate: Number.isFinite(row.decimalLatitude) && Number.isFinite(row.decimalLongitude),
    issues: [...(row.issues ?? [])].sort(),
    queryMatches: [],
  };
}

function counts(rows, key) {
  const result = {};
  for (const row of rows) {
    const value = row[key] || "(not supplied)";
    result[value] = (result[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

async function main() {
  const countReport = JSON.parse(await readFile(countReportPath, "utf8"));
  if (countReport.reviewId !== "gbif-region02-river-field-counts-col-filtered-20261109"
    || countReport.queryMethod?.filters?.taxonKey !== "8VR36"
    || countReport.queryMethod?.filters?.checklistKey !== "7ddf754f-d193-4cc9-b351-99906754a03b") {
    throw new Error("Expected the corrected Catalogue of Life XR Actinopterygii count report; refusing stale or unsupported class-only input.");
  }
  const positiveQueries = countReport.queries.filter((query) => query.resultCount > 0);
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const queryPages = [];
  const records = new Map();
  let queryIndex = 0;

  for (const query of positiveQueries) {
    queryIndex += 1;
    let offset = 0;
    let endOfRecords = false;
    let count = 0;
    const enumeratedRows = [];
    const pages = [];
    do {
      const url = new URL(endpoint);
      for (const [key, value] of Object.entries({ ...query.parameters, limit: pageSize, offset })) {
        url.searchParams.set(key, String(value));
      }
      const { response, bytes, json } = await get(url);
      if (!response.ok || !Array.isArray(json.results) || !Number.isInteger(json.count)) {
        throw new Error(`GBIF ${response.status} for ${query.field}=${query.searchValue}: ${json.error ?? response.statusText}`);
      }
      count = json.count;
      enumeratedRows.push(...json.results);
      const fileName = `${String(queryIndex).padStart(2, "0")}-${slug(query.searchValue)}-${query.field}-offset-${offset}.json`;
      const rawPath = `raw/national/gbif-region02-river-records-col-filtered-20261109/${fileName}`;
      await writeFile(new URL(fileName, rawDirectory), bytes);
      pages.push({
        offset,
        returnedCount: json.results.length,
        endOfRecords: Boolean(json.endOfRecords),
        rawResponse: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) },
      });
      endOfRecords = Boolean(json.endOfRecords) || json.results.length === 0;
      offset += json.results.length;
      if (!endOfRecords) await wait(350);
    } while (!endOfRecords);

    for (const row of enumeratedRows) {
      const id = String(row.gbifID ?? `${query.field}:${query.searchValue}:${enumeratedRows.indexOf(row)}`);
      const existing = records.get(id) ?? recordView(row);
      existing.queryMatches.push({
        field: query.field,
        searchValue: query.searchValue,
        querySources: query.querySources,
      });
      records.set(id, existing);
    }
    queryPages.push({
      field: query.field,
      searchValue: query.searchValue,
      querySources: query.querySources,
      queryUrl: query.url,
      httpStatus: 200,
      resultCount: count,
      enumeratedCount: enumeratedRows.length,
      complete: endOfRecords && enumeratedRows.length === count,
      pages,
    });
    await wait(350);
  }

  const recordRows = [...records.values()].sort((a, b) => Number(a.gbifId) - Number(b.gbifId));
  await writeFile(outputPath, `${recordRows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  const allQueriesComplete = queryPages.every((query) => query.complete);
  const report = {
    schemaVersion: 1,
    reviewId: "gbif-region02-river-record-candidate-review-col-filtered-20261109",
    generatedOn: new Date().toISOString().slice(0, 10),
    status: "gbif-col-xr-actinopterygii-nonzero-field-results-fetched;record-row-review-pending;no-occurrence-projection;supersedes-discarded-unsupported-class-results",
    purpose: "Fetch bounded records from nonzero Region II waterBody/locality queries filtered by Catalogue of Life XR Actinopterygii and checklistKey so original DwC fields and provider/source metadata can be reviewed locally.",
    sourceCountReport: {
      path: "data/research/philippines/national/reviews/gbif-region02-river-field-counts-col-filtered-20261109.json",
      sha256: sha256(await readFile(countReportPath)),
    },
    queryResults: {
      nonzeroQueries: positiveQueries.length,
      queryCount: queryPages.length,
      enumeratedQueryRows: queryPages.reduce((total, query) => total + query.enumeratedCount, 0),
      uniqueGBIFRecords: recordRows.length,
      allQueryPagesComplete: allQueriesComplete,
      pages: queryPages,
    },
    recordSummary: {
      basisOfRecordCounts: counts(recordRows, "basisOfRecord"),
      licenseCounts: counts(recordRows, "license"),
      datasetTitleCounts: counts(recordRows, "datasetTitle"),
      yearCounts: counts(recordRows.map((row) => ({yearLabel: row.year ? String(row.year) : "(not supplied)"})), "yearLabel"),
      recordsWithCoordinate: recordRows.filter((row) => row.hasCoordinate).length,
      recordsWithoutCoordinate: recordRows.filter((row) => !row.hasCoordinate).length,
      recordsWithCoordinateUncertainty: recordRows.filter((row) => row.coordinateUncertaintyInMeters !== null).length,
      recordsWithIssues: recordRows.filter((row) => row.issues.length > 0).length,
      distinctTaxonNameLabels: new Set(recordRows.map((row) => row.scientificName).filter(Boolean)).size,
    },
    localOutput: {
      path: "data/research/philippines/raw/national/gbif-region02-river-record-candidate-review-col-filtered-20261109.jsonl",
      rows: recordRows.length,
      sha256: sha256(await readFile(outputPath)),
      gitIgnored: true,
      containsCoordinates: false,
      appBundleIncluded: false,
    },
    limitations: [
      "Exact text-field queries can include records whose locality wording does not identify the intended river; every verbatim source/provider field needs row-level review.",
      "Overlapping query results are deduplicated by gbifID; counts across queries are not additive and are not a unique occurrence total.",
      "The taxonomic filter is limited to the selected Catalogue of Life XR Actinopterygii concept; GBIF taxonomy, locality, provider identification, dates, coordinates, uncertainty, and data licenses are not yet validated against original source records.",
      "Rows from the earlier unsupported class=Actinopterygii query were discarded and are not included in this candidate review.",
      "The local JSONL excludes coordinates; original responses with coordinates remain only in Git-ignored raw storage for cautious quality review.",
      "No species presence, waterbody identity, geometry, habitat, access, diet, legal, safety, or public app claim is made.",
    ],
    nextAction: "Inspect each unique row's dataset, source record, scientific-name crosswalk, original locality, and license; retain only voucher- or publication-traceable records with locality confidence and compatible reuse terms.",
  };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Fetched ${queryPages.length} nonzero queries: ${report.queryResults.enumeratedQueryRows} query rows / ${recordRows.length} unique GBIF IDs`);
  console.log(`Complete pages: ${allQueriesComplete}; source licenses: ${JSON.stringify(report.recordSummary.licenseCounts)}`);
  console.log(`Wrote data/research/philippines/national/reviews/gbif-region02-river-record-candidate-review-col-filtered-20261109.json`);
  console.log(`Coordinate-free row review and raw responses remain in ignored research storage.`);
}

await main();
