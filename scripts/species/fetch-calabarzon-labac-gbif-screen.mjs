import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const base = new URL("data/research/philippines/", root);
const scopeUrl = new URL("calabarzon-scope.json", base);
const reviewUrl = new URL("calabarzon-labac-gbif-screen-20261026.json", base);
const rawDirectory = new URL("raw/calabarzon-labac-gbif-screen-20261026/", base);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const detailEndpoint = "https://api.gbif.org/v1/occurrence";
const datasetEndpoint = "https://api.gbif.org/v1/dataset";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const taxonLabel = "Catalogue of Life Extended Release Actinopterygii";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) =>
  value.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

async function request(url) {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public GBIF API review)" },
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
    institutionCode: row.institutionCode ?? null,
    collectionCode: row.collectionCode ?? null,
    catalogNumber: row.catalogNumber ?? null,
    recordedBy: row.recordedBy ?? null,
    coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters ?? null,
    issues: [...(row.issues ?? [])].sort(),
  };
}

async function main() {
  const scope = JSON.parse(await readFile(scopeUrl, "utf8"));
  const lead = scope.waterbodies.find((row) => row.id === "ph-wb-labac-river-cavite");
  if (!lead) throw new Error("Labac River scope lead is missing.");

  const searchTerms = [
    { value: lead.name, role: "scope-canonical-name" },
    { value: "Labac-Balsahan River", role: "official-profile-variant" },
    { value: "Labac/Labac-Balsahan River", role: "official-profile-combined-variant" },
    { value: "Labac-Alemang River", role: "watershed-system-name" },
    { value: "Labac-Alemang-Caisobo River Watershed", role: "watershed-system-name" },
    { value: "Bucalan River", role: "EIA-reported-alias-candidate" },
    { value: "Allemang River", role: "EIA-reported-alias-candidate" },
    { value: "Balsahan River", role: "tributary-name-candidate" },
    { value: "Kay-Alamang River", role: "tributary-name-candidate" },
  ];
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const queries = [];
  const recordsById = new Map();
  for (const [termIndex, term] of searchTerms.entries()) {
    for (const field of ["waterBody", "locality"]) {
      const parameters = { country: "PH", checklistKey, taxonKey, [field]: term.value, limit: 100 };
      const pages = [];
      const queryRecords = [];
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
          throw new Error(`GBIF ${response.status} for ${field}=${term.value}: ${json.error ?? response.statusText}`);
        }
        const fileName = `term-${termIndex + 1}-${slug(term.value)}-${field}-offset-${offset}.json`;
        await writeFile(new URL(fileName, rawDirectory), bytes);
        pages.push({
          offset,
          returnedCount: json.results.length,
          endOfRecords: Boolean(json.endOfRecords),
          rawResponse: { path: `raw/calabarzon-labac-gbif-screen-20261026/${fileName}`, bytes: bytes.length, sha256: sha256(bytes) },
        });
        count = json.count;
        endOfRecords = Boolean(json.endOfRecords) || json.results.length === 0;
        queryRecords.push(...json.results);
        offset += json.results.length;
        if (!endOfRecords) await wait(250);
      } while (!endOfRecords);

      for (const row of queryRecords) {
        const id = String(row.gbifID);
        const record = recordsById.get(id) ?? { ...projectRecord(row), queryMatches: [] };
        record.queryMatches.push({ field, searchValue: term.value, termRole: term.role });
        recordsById.set(id, record);
      }
      queries.push({
        field,
        searchValue: term.value,
        termRole: term.role,
        url: `${endpoint}?${new URLSearchParams({ ...parameters, limit: 0 })}`,
        parameters,
        httpStatus,
        resultCount: count,
        enumeratedCount: queryRecords.length,
        endOfRecords,
        pages,
      });
      await wait(250);
    }
  }

  const records = [...recordsById.values()].sort((left, right) => left.gbifId - right.gbifId);
  const datasets = [];
  for (const record of records) {
    const detailResponse = await request(`${detailEndpoint}/${record.gbifId}`);
    if (!detailResponse.response.ok || detailResponse.json.key !== record.gbifId) {
      throw new Error(`GBIF occurrence detail failed for ${record.gbifId}.`);
    }
    const detailName = `occurrence-${record.gbifId}.json`;
    await writeFile(new URL(detailName, rawDirectory), detailResponse.bytes);
    record.directDetail = {
      httpStatus: detailResponse.response.status,
      rawResponse: {
        path: `raw/calabarzon-labac-gbif-screen-20261026/${detailName}`,
        bytes: detailResponse.bytes.length,
        sha256: sha256(detailResponse.bytes),
      },
      matchingOccurrenceKey: detailResponse.json.key === record.gbifId,
    };
    const detail = projectRecord(detailResponse.json);
    for (const key of Object.keys(detail)) if (record[key] == null && detail[key] != null) record[key] = detail[key];
    await wait(250);
  }

  for (const datasetKey of [...new Set(records.map((row) => row.datasetKey).filter(Boolean))]) {
    const result = await request(`${datasetEndpoint}/${datasetKey}`);
    if (!result.response.ok || result.json.key !== datasetKey) throw new Error(`GBIF dataset detail failed for ${datasetKey}.`);
    const fileName = `dataset-${datasetKey}.json`;
    await writeFile(new URL(fileName, rawDirectory), result.bytes);
    datasets.push({
      key: datasetKey,
      title: result.json.title ?? null,
      doi: result.json.doi ?? null,
      license: result.json.license ?? null,
      citation: result.json.citation ?? null,
      publisher: result.json.publishingOrganizationTitle ?? null,
      rawResponse: { path: `raw/calabarzon-labac-gbif-screen-20261026/${fileName}`, bytes: result.bytes.length, sha256: sha256(result.bytes) },
    });
    for (const record of records.filter((row) => row.datasetKey === datasetKey)) {
      record.datasetTitle = result.json.title ?? record.datasetTitle;
      record.datasetLicense = result.json.license ?? null;
    }
  }

  for (const record of records) {
    record.queryMatches.sort((left, right) => left.field.localeCompare(right.field) || left.searchValue.localeCompare(right.searchValue));
  }
  const summaryBy = (key) => Object.entries(records.reduce((counts, row) => {
    const value = row[key] ?? "unknown";
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {})).sort(([left], [right]) => left.localeCompare(right)).map(([value, count]) => ({ value, count }));

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-labac-gbif-screen-20261026",
    reviewedOn: "2026-10-26",
    phaseId: "L1",
    regionId: scope.regionId,
    regionName: scope.regionName,
    status: "bounded-fish-name-screen-complete;candidate-records-require-waterbody-and-rights-review",
    waterbodyId: lead.id,
    purpose: "Bounded GBIF Actinopterygii discovery across the Labac river name, source variants, watershed/system names and EIA alias candidates. Hits require locality and source review; zeroes are not fish absence.",
    sourceId: "gbif-occurrence-downloads",
    endpoints: { search: endpoint, occurrence: detailEndpoint, dataset: datasetEndpoint },
    taxonomy: { checklistKey, taxonKey, label: taxonLabel },
    scopeSnapshot: { path: "data/research/philippines/calabarzon-scope.json", sha256: sha256(await readFile(scopeUrl)) },
    searchTerms,
    queryFields: ["waterBody", "locality"],
    queryParameters: { country: "PH", checklistKey, taxonKey, limit: 100, pagination: "through endOfRecords" },
    queries,
    records,
    datasets,
    summary: {
      queryCount: queries.length,
      successfulQueries: queries.filter((row) => row.httpStatus === 200).length,
      totalReturnedPerQuery: queries.reduce((sum, row) => sum + row.enumeratedCount, 0),
      uniqueCandidateRecordCount: records.length,
      speciesRankRecordCount: records.filter((row) => row.rank === "SPECIES").length,
      recordRanks: summaryBy("rank"),
      basisOfRecord: summaryBy("basisOfRecord"),
      datasetLicenses: summaryBy("datasetLicense"),
    },
    decisions: {
      candidatesRequireItemLevelReview: true,
      speciesAssertionsAdded: 0,
      fishAbsenceInferred: false,
      coordinatesProjected: false,
      geometryAdded: false,
      publicProjectionAdded: false,
      publicationApproval: false,
    },
    limitations: [
      "GBIF waterBody and locality are indexed text fields, not a validated channel geometry or point-in-river test.",
      "Source variant names include system and tributary candidates; query hits do not resolve aliases or prove a catch location.",
      "Searches are limited to the specified strings, country PH, the selected GBIF COL XR Actinopterygii key and the index state at retrieval time.",
      "Record and dataset license fields are metadata for separate review; listing them does not grant publication permission.",
      "A zero result is a bounded search outcome, not evidence of absence or a complete inventory.",
    ],
    provenance: {
      retrievedAt: new Date().toISOString(),
      documentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      rawPath: "raw/calabarzon-labac-gbif-screen-20261026/",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(`Saved ${queries.length} queries; ${records.length} unique fish candidates (${review.summary.speciesRankRecordCount} species-rank).`);
}

main().catch((error) => {
  console.error(`Labac GBIF screen failed: ${error.message}`);
  process.exitCode = 1;
});
