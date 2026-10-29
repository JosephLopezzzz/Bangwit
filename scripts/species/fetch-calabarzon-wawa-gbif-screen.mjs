import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const base = new URL("data/research/philippines/", root);
const scopeUrl = new URL("calabarzon-scope.json", base);
const reviewUrl = new URL("calabarzon-wawa-gbif-screen-20261026.json", base);
const rawDirectory = new URL("raw/calabarzon-wawa-gbif-screen-20261026/", base);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const detailEndpoint = "https://api.gbif.org/v1/occurrence";
const datasetEndpoint = "https://api.gbif.org/v1/dataset";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const taxonLabel = "Catalogue of Life Extended Release Actinopterygii";
const terms = [
  { field: "waterBody", value: "Wawa River", role: "official-name-lead" },
  { field: "waterBody", value: "Wawa estuary", role: "official-name-lead" },
  { field: "locality", value: "Wawa River", role: "official-name-lead" },
  { field: "locality", value: "Wawa", role: "official-name-token" },
  { field: "locality", value: "Rosario Cavite", role: "reported-project-context" },
];
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function request(url) {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public GBIF API review)" },
      signal: AbortSignal.timeout(30000),
    });
    if (response.status !== 429 && response.status < 500) break;
    if (attempt === 3) break;
    await sleep(1000 * (attempt + 1));
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

function projectRecord(row) {
  return {
    gbifId: row.gbifID ?? null,
    occurrenceId: row.occurrenceID ?? null,
    scientificName: row.scientificName ?? null,
    acceptedScientificName: row.acceptedScientificName ?? null,
    rank: row.taxonRank ?? null,
    taxonKey: row.taxonKey ?? null,
    acceptedTaxonKey: row.acceptedTaxonKey ?? null,
    family: row.family ?? null,
    basisOfRecord: row.basisOfRecord ?? null,
    datasetKey: row.datasetKey ?? null,
    datasetTitle: row.datasetTitle ?? null,
    license: row.license ?? null,
    rightsHolder: row.rightsHolder ?? null,
    eventDate: row.eventDate ?? null,
    year: row.year ?? null,
    waterBody: row.waterBody ?? null,
    locality: row.locality ?? null,
    stateProvince: row.stateProvince ?? null,
    county: row.county ?? null,
    municipality: row.municipality ?? null,
    decimalLatitude: row.decimalLatitude ?? null,
    decimalLongitude: row.decimalLongitude ?? null,
    coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters ?? null,
    institutionCode: row.institutionCode ?? null,
    collectionCode: row.collectionCode ?? null,
    catalogNumber: row.catalogNumber ?? null,
    recordedBy: row.recordedBy ?? null,
    issues: [...(row.issues ?? [])].sort(),
  };
}

async function main() {
  const scopeBytes = await readFile(scopeUrl);
  const scope = JSON.parse(scopeBytes.toString("utf8"));
  const lead = scope.waterbodies.find((row) => row.id === "ph-wb-wawa-river-estuary-rosario-cavite");
  if (!lead) throw new Error("Rosario Wawa River estuary scope lead is missing.");
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const queries = [];
  const recordsById = new Map();
  for (const [termIndex, term] of terms.entries()) {
    const parameters = {
      country: "PH",
      checklistKey,
      taxonKey,
      [term.field]: term.value,
      limit: 100,
    };
    const pages = [];
    const matches = [];
    let offset = 0;
    let count = 0;
    let endOfRecords = false;
    let httpStatus = 0;
    do {
      const url = new URL(endpoint);
      for (const [key, value] of Object.entries({ ...parameters, offset })) url.searchParams.set(key, String(value));
      const { response, bytes, json } = await request(url);
      httpStatus = response.status;
      if (!response.ok || !Array.isArray(json.results)) {
        throw new Error(`GBIF ${response.status} for ${term.field}=${term.value}: ${json.error ?? response.statusText}`);
      }
      const fileName = `term-${termIndex + 1}-${term.field}-offset-${offset}.json`;
      await writeFile(new URL(fileName, rawDirectory), bytes);
      pages.push({
        offset,
        returnedCount: json.results.length,
        endOfRecords: Boolean(json.endOfRecords),
        rawResponse: {
          path: `raw/calabarzon-wawa-gbif-screen-20261026/${fileName}`,
          bytes: bytes.length,
          sha256: sha256(bytes),
        },
      });
      count = json.count;
      endOfRecords = Boolean(json.endOfRecords) || json.results.length === 0;
      matches.push(...json.results);
      offset += json.results.length;
      if (!endOfRecords) await sleep(250);
    } while (!endOfRecords);

    for (const row of matches) {
      const id = String(row.gbifID);
      const record = recordsById.get(id) ?? { ...projectRecord(row), queryMatches: [] };
      record.queryMatches.push({ field: term.field, searchValue: term.value, termRole: term.role });
      recordsById.set(id, record);
    }
    queries.push({
      ...term,
      url: `${endpoint}?${new URLSearchParams({ ...parameters, limit: 0 })}`,
      parameters,
      httpStatus,
      resultCount: count,
      enumeratedCount: matches.length,
      endOfRecords,
      pages,
    });
    await sleep(200);
  }

  const records = [...recordsById.values()].sort((left, right) => left.gbifId - right.gbifId);
  const datasets = [];
  for (const record of records) {
    const detail = await request(`${detailEndpoint}/${record.gbifId}`);
    if (!detail.response.ok || detail.json.key !== record.gbifId) {
      throw new Error(`GBIF occurrence detail failed for ${record.gbifId}.`);
    }
    const detailFile = `occurrence-${record.gbifId}.json`;
    await writeFile(new URL(detailFile, rawDirectory), detail.bytes);
    record.directDetail = {
      httpStatus: detail.response.status,
      rawResponse: {
        path: `raw/calabarzon-wawa-gbif-screen-20261026/${detailFile}`,
        bytes: detail.bytes.length,
        sha256: sha256(detail.bytes),
      },
      matchingOccurrenceKey: true,
    };
    Object.assign(record, Object.fromEntries(Object.entries(projectRecord(detail.json)).filter(([key, value]) => record[key] == null && value != null)));
    await sleep(200);
  }

  for (const key of [...new Set(records.map((row) => row.datasetKey).filter(Boolean))]) {
    const result = await request(`${datasetEndpoint}/${key}`);
    if (!result.response.ok || result.json.key !== key) throw new Error(`GBIF dataset detail failed for ${key}.`);
    const name = `dataset-${key}.json`;
    await writeFile(new URL(name, rawDirectory), result.bytes);
    const dataset = {
      key,
      title: result.json.title ?? null,
      doi: result.json.doi ?? null,
      license: result.json.license ?? null,
      citation: result.json.citation ?? null,
      publisher: result.json.publishingOrganizationTitle ?? null,
      rawResponse: {
        path: `raw/calabarzon-wawa-gbif-screen-20261026/${name}`,
        bytes: result.bytes.length,
        sha256: sha256(result.bytes),
      },
    };
    datasets.push(dataset);
    for (const record of records.filter((row) => row.datasetKey === key)) {
      record.datasetTitle = dataset.title ?? record.datasetTitle;
      record.datasetLicense = dataset.license;
    }
    await sleep(200);
  }

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-wawa-gbif-screen-20261026",
    reviewedOn: "2026-10-26",
    phaseId: "L1",
    regionId: scope.regionId,
    regionName: scope.regionName,
    status: "bounded-fish-text-screen-complete;candidate-rows-require-identity-review",
    waterbodyId: lead.id,
    purpose:
      "Screen GBIF fish occurrence text fields for the officially indexed Rosario Wawa River estuary name and its place context. Text hits are candidates only; they do not establish estuary identity, channel geometry, catch locality or publication permission. Zero results are not absence evidence.",
    sourceId: "gbif-occurrence-downloads",
    endpoints: { search: endpoint, occurrence: detailEndpoint, dataset: datasetEndpoint },
    taxonomy: { checklistKey, taxonKey, label: taxonLabel },
    scopeSnapshot: {
      path: "data/research/philippines/calabarzon-scope.json",
      sha256: sha256(scopeBytes),
    },
    queries,
    queryParameters: { country: "PH", checklistKey, taxonKey, limit: 100, pagination: "through endOfRecords" },
    records,
    datasets,
    summary: {
      queryCount: queries.length,
      successfulQueries: queries.filter((row) => row.httpStatus === 200).length,
      zeroResultQueries: queries.filter((row) => row.resultCount === 0).length,
      positiveQueries: queries.filter((row) => row.resultCount > 0).length,
      uniqueCandidateRecordCount: records.length,
      speciesRankRecordCount: records.filter((row) => row.rank === "SPECIES").length,
      fishSpeciesAssertionsAdded: 0,
      fishAbsenceInferred: false,
      publicAdmission: false,
    },
    decisions: {
      recordsRequireDirectLocalityAndDatasetReview: true,
      waterbodyAssignmentsAdded: 0,
      speciesRowsAdded: 0,
      geometryAdded: false,
      publicProjectionAdded: false,
      publicationApproval: false,
    },
    limitations: [
      "GBIF waterBody and locality are indexed text, not a validated estuary geometry or point-in-estuary test.",
      "The official EMB name lead remains based on search-index excerpts; it does not establish that a Wawa River name in GBIF refers to the Rosario feature.",
      "Search results are bounded to five strings and the current GBIF index state; zero matches do not establish absence or a complete inventory.",
      "Occurrence and dataset license metadata are retained for review but are not treated as publication authorization.",
    ],
    provenance: {
      retrievedAt: new Date().toISOString(),
      documentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      rawPath: "raw/calabarzon-wawa-gbif-screen-20261026/",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`, "utf8");
  console.log(
    `Finished: ${review.summary.successfulQueries}/${queries.length} successful searches; ${records.length} unique candidates (${review.summary.speciesRankRecordCount} species-rank). Saved ${fileURLToPath(reviewUrl)}.`,
  );
}

main().catch((error) => {
  console.error(`Wawa GBIF screen failed: ${error.message}`);
  process.exitCode = 1;
});
