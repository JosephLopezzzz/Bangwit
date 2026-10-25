import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const dataUrl = (name) => new URL(`data/research/philippines/${name}`, root);
const scopeUrl = dataUrl("calabarzon-scope.json");
const reviewUrl = dataUrl("calabarzon-cavite-bay-gbif-screen-20261025.json");
const rawDirectory = dataUrl("raw/calabarzon-cavite-bay-gbif-screen-20261025/");
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const detailEndpoint = "https://api.gbif.org/v1/occurrence";
const datasetEndpoint = "https://api.gbif.org/v1/dataset";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) =>
  value
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

async function request(url) {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public GBIF API review)" },
      signal: AbortSignal.timeout(30000),
    });
    if (response.status !== 429 && response.status < 500) break;
    if (attempt === 3) break;
    await wait(1200 * (attempt + 1));
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

function allowlistedRecord(row) {
  return {
    gbifId: row.gbifID ?? null,
    occurrenceId: row.occurrenceID ?? null,
    scientificName: row.scientificName ?? null,
    acceptedScientificName: row.acceptedScientificName ?? null,
    taxonRank: row.taxonRank ?? null,
    taxonomicStatus: row.taxonomicStatus ?? null,
    kingdom: row.kingdom ?? null,
    phylum: row.phylum ?? null,
    class: row.class ?? null,
    order: row.order ?? null,
    family: row.family ?? null,
    genus: row.genus ?? null,
    datasetKey: row.datasetKey ?? null,
    datasetTitle: row.datasetTitle ?? null,
    license: row.license ?? null,
    rightsHolder: row.rightsHolder ?? null,
    basisOfRecord: row.basisOfRecord ?? null,
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
    issues: [...(row.issues ?? [])].sort(),
  };
}

async function main() {
  const scope = JSON.parse(await readFile(scopeUrl, "utf8"));
  const leads = new Map(
    scope.waterbodies
      .filter((row) => ["ph-wb-bacoor-bay", "ph-wb-canacao-bay"].includes(row.id))
      .map((row) => [row.id, row]),
  );
  if (leads.size !== 2) throw new Error("Expected both Bacoor Bay and Cañacao Bay scope leads.");

  const terms = [
    { scopeLeadId: "ph-wb-bacoor-bay", canonicalName: "Bacoor Bay", value: "Bacoor Bay", nameRole: "canonical" },
    { scopeLeadId: "ph-wb-canacao-bay", canonicalName: "Cañacao Bay", value: "Cañacao Bay", nameRole: "canonical" },
    { scopeLeadId: "ph-wb-canacao-bay", canonicalName: "Cañacao Bay", value: "Canacao Bay", nameRole: "existing-alias" },
  ];

  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const queries = [];
  const recordsById = new Map();

  for (const [termIndex, term] of terms.entries()) {
    for (const field of ["waterBody", "locality"]) {
      const parameters = { country: "PH", [field]: term.value, limit: 100 };
      const queryRecords = [];
      const pages = [];
      let offset = 0;
      let count = 0;
      let endOfRecords = false;
      let httpStatus = 0;

      do {
        const url = new URL(endpoint);
        for (const [key, value] of Object.entries({ ...parameters, offset })) {
          url.searchParams.set(key, String(value));
        }
        const { response, bytes, json } = await request(url);
        httpStatus = response.status;
        if (!response.ok || !Array.isArray(json.results)) {
          throw new Error(`GBIF ${response.status} for ${field}=${term.value}: ${json.error ?? response.statusText}`);
        }

        const fileName = `${term.scopeLeadId}-term-${termIndex + 1}-${slug(term.value)}-${field}-offset-${offset}.json`;
        const rawPath = `raw/calabarzon-cavite-bay-gbif-screen-20261025/${fileName}`;
        await writeFile(new URL(fileName, rawDirectory), bytes);
        pages.push({
          offset,
          returnedCount: json.results.length,
          endOfRecords: Boolean(json.endOfRecords),
          rawResponse: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) },
        });
        count = json.count;
        endOfRecords = Boolean(json.endOfRecords);
        queryRecords.push(...json.results);
        offset += json.results.length;
        if (json.results.length === 0) endOfRecords = true;
        if (!endOfRecords) await wait(300);
      } while (!endOfRecords);

      for (const row of queryRecords) {
        const id = String(row.gbifID);
        const record = recordsById.get(id) ?? {
          ...allowlistedRecord(row),
          queryMatches: [],
        };
        record.queryMatches.push({
          field,
          searchValue: term.value,
          scopeLeadId: term.scopeLeadId,
          nameRole: term.nameRole,
        });
        recordsById.set(id, record);
      }

      queries.push({
        field,
        searchValue: term.value,
        scopeLeadId: term.scopeLeadId,
        nameRole: term.nameRole,
        httpStatus,
        url: `${endpoint}?${new URLSearchParams({ ...parameters, limit: 0 })}`,
        parameters,
        resultCount: count,
        enumeratedCount: queryRecords.length,
        endOfRecords,
        pages,
      });
      await wait(350);
    }
  }

  const records = [...recordsById.values()].sort((left, right) => left.gbifId - right.gbifId);
  for (const record of records) {
    const { response, bytes, json } = await request(`${detailEndpoint}/${record.gbifId}`);
    if (!response.ok || !json.key) {
      throw new Error(`GBIF detail ${record.gbifId} failed: ${json.error ?? response.statusText}`);
    }
    const fileName = `occurrence-${record.gbifId}.json`;
    const rawPath = `raw/calabarzon-cavite-bay-gbif-screen-20261025/${fileName}`;
    await writeFile(new URL(fileName, rawDirectory), bytes);
    const detail = allowlistedRecord(json);
    for (const key of Object.keys(detail)) {
      if (record[key] == null && detail[key] != null) record[key] = detail[key];
    }
    record.directDetail = {
      httpStatus: response.status,
      rawResponse: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) },
      matchedSearchIdentity: detail.gbifId === record.gbifId && detail.occurrenceId === record.occurrenceId,
    };
    await wait(350);
  }

  const datasets = [];
  for (const datasetKey of [...new Set(records.map((record) => record.datasetKey).filter(Boolean))]) {
    const { response, bytes, json } = await request(`${datasetEndpoint}/${datasetKey}`);
    if (!response.ok || json.key !== datasetKey) {
      throw new Error(`GBIF dataset ${datasetKey} failed: ${json.error ?? response.statusText}`);
    }
    const fileName = `dataset-${datasetKey}.json`;
    const rawPath = `raw/calabarzon-cavite-bay-gbif-screen-20261025/${fileName}`;
    await writeFile(new URL(fileName, rawDirectory), bytes);
    datasets.push({
      key: json.key,
      title: json.title ?? null,
      type: json.type ?? null,
      doi: json.doi ?? null,
      license: json.license ?? null,
      citation: json.citation ?? null,
      publishingOrganizationKey: json.publishingOrganizationKey ?? null,
      publishingOrganizationTitle: json.publishingOrganizationTitle ?? null,
      directDetail: { httpStatus: response.status, rawResponse: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) } },
    });
    for (const record of records.filter((candidate) => candidate.datasetKey === datasetKey)) {
      record.datasetTitle = json.title ?? record.datasetTitle;
      record.datasetLicense = json.license ?? null;
    }
    await wait(350);
  }

  for (const record of records) {
    record.queryMatches.sort(
      (left, right) =>
        left.scopeLeadId.localeCompare(right.scopeLeadId) ||
        left.field.localeCompare(right.field) ||
        left.searchValue.localeCompare(right.searchValue),
    );
  }

  const countBy = (selector) => {
    const counts = new Map();
    for (const row of records) {
      const value = selector(row) ?? "unknown";
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([value, count]) => ({ value, count }));
  };
  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-cavite-bay-gbif-screen-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: scope.regionId,
    regionName: "Region IV-A (CALABARZON)",
    sourceId: "gbif-occurrence-downloads",
    endpoint,
    detailEndpoint,
    datasetEndpoint,
    purpose:
      "Bounded all-taxon GBIF text-field discovery for Bacoor Bay and Cañacao Bay using country PH plus waterBody/locality terms. Returned records are candidates only; an empty result is not evidence of fish absence or waterbody completeness.",
    scopeSnapshot: {
      path: "data/research/philippines/calabarzon-scope.json",
      sha256: sha256(await readFile(scopeUrl)),
      scopeLeadIds: [...leads.keys()],
      terms: terms.length,
      queryFields: ["waterBody", "locality"],
    },
    searchTerms: terms,
    queryParameters: { country: "PH", limit: 100, pagination: "enumerate through endOfRecords" },
    queries,
    datasets,
    records,
    summary: {
      queryCount: queries.length,
      successfulQueryCount: queries.filter((query) => query.httpStatus === 200).length,
      returnedOccurrencesBySearch: queries.reduce((sum, query) => sum + query.enumeratedCount, 0),
      uniqueRecordCount: records.length,
      recordsByClass: countBy((record) => record.class),
      recordsByPhylum: countBy((record) => record.phylum),
      candidateFishRecordCount: records.filter((record) => record.class && /^(Actinopterygii|Chondrichthyes|Myxini|Petromyzonti)$/i.test(record.class)).length,
      taxonUnmatchedCount: records.filter((record) => !record.class && !record.scientificName).length,
      directDetailChecks: records.filter((record) => record.directDetail?.matchedSearchIdentity).length,
    },
    decision: {
      nonFishRecordsAdmittedAsFish: false,
      unresolvedTaxonTreatedAsFish: false,
      zeroResultsUsedAsAbsence: false,
      speciesAssertionsAdded: 0,
      dietClaimsAdded: 0,
      geometryOrCoordinatesAdded: false,
      publicAppProjectionAdded: false,
      publicationApproval: false,
      interpretation:
        "This bounded all-taxon text search surfaced non-fish records and an unresolved taxon row, but no fish-identified candidate. It does not establish that fish are absent, define either bay's boundary, or provide a complete species list. Candidate records retain their source flags and require item/dataset and locality review before any possible use.",
    },
    limitations: [
      "The GBIF waterBody and locality fields are searchable text, not a validated bay polygon or spatial containment test.",
      "The query covers only the submitted name strings, country PH, and records indexed by GBIF at retrieval time.",
      "One returned row has no indexed scientific name or class and remains taxonomically unresolved.",
      "Occurrence and dataset license fields are preserved as source metadata; this review grants no redistribution permission.",
      "No coordinates are included in this review artifact.",
    ],
    provenance: {
      retrievedAt: new Date().toISOString(),
      searchDocumentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      apiDocumentation: "https://techdocs.gbif.org/en/openapi/",
      rawPath: "raw/calabarzon-cavite-bay-gbif-screen-20261025/",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Saved ${queries.length} queries and ${records.length} unique records; ${review.summary.candidateFishRecordCount} fish-identified, ${review.summary.taxonUnmatchedCount} taxonomically unresolved.`,
  );
}

main().catch((error) => {
  console.error(`Cavite bay GBIF screen failed: ${error.message}`);
  process.exitCode = 1;
});
