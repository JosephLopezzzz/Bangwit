import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const base = new URL("data/research/philippines/", root);
const scopeUrl = new URL("calabarzon-scope.json", base);
const reviewUrl = new URL("calabarzon-bacoor-rivers-gbif-screen-20261026.json", base);
const rawDirectory = new URL("raw/calabarzon-bacoor-rivers-gbif-screen-20261026/", base);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const taxonLabel = "Catalogue of Life Extended Release Actinopterygii";
const waterbodyIds = [
  "ph-wb-bacoor-river-cavite",
  "ph-wb-don-cella-river",
  "ph-wb-molino-river",
  "ph-wb-zapote-river",
  "ph-wb-ilat-creek",
  "ph-wb-daang-bukid-creek",
];
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
  const scopeBytes = await readFile(scopeUrl);
  const scope = JSON.parse(scopeBytes.toString("utf8"));
  const leads = scope.waterbodies.filter((waterbody) => waterbodyIds.includes(waterbody.id));
  if (leads.length !== waterbodyIds.length) throw new Error("One or more Bacoor inland waterbody leads are missing.");

  const searchTerms = leads.flatMap((lead) => {
    const namedTerms = [
      { value: lead.name, role: "scope-canonical-name" },
      ...(lead.aliases ?? []).map((value) => ({ value, role: "scope-alias" })),
      { value: lead.name.replace(/\s+(?:River|Creek)$/i, ""), role: "scope-name-without-watercourse-type" },
    ];
    const seen = new Set();
    return namedTerms
      .filter((term) => {
        if (seen.has(term.value.toLowerCase())) return false;
        seen.add(term.value.toLowerCase());
        return true;
      })
      .map((term) => ({ ...term, waterbodyId: lead.id, canonicalName: lead.name, kind: lead.kind }));
  });

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
          rawResponse: {
            path: `raw/calabarzon-bacoor-rivers-gbif-screen-20261026/${fileName}`,
            bytes: bytes.length,
            sha256: sha256(bytes),
          },
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
        record.queryMatches.push({ field, searchValue: term.value, waterbodyId: term.waterbodyId, termRole: term.role });
        recordsById.set(id, record);
      }
      queries.push({
        field,
        searchValue: term.value,
        waterbodyId: term.waterbodyId,
        termRole: term.role,
        url: `${endpoint}?${new URLSearchParams({ ...parameters, limit: 0 })}`,
        parameters,
        httpStatus,
        resultCount: count,
        enumeratedCount: queryRecords.length,
        endOfRecords,
        pages,
      });
      await wait(200);
    }
  }

  const records = [...recordsById.values()].sort((left, right) => left.gbifId - right.gbifId);
  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-bacoor-rivers-gbif-screen-20261026",
    reviewedOn: "2026-10-26",
    phaseId: "L1",
    regionId: scope.regionId,
    regionName: scope.regionName,
    status: "bounded-fish-name-screen-complete;no-candidates-returned;no-absence-inferred",
    purpose:
      "Bounded GBIF Actinopterygii discovery for Bacoor River and five additional Bacoor inland river/creek leads. GBIF waterBody/locality fields are indexed text; candidate hits would require independent locality, occurrence, taxonomy and rights review. Zero results are not fish-absence evidence.",
    sourceId: "gbif-occurrence-downloads",
    endpoint,
    taxonomy: { checklistKey, taxonKey, label: taxonLabel },
    scopeSnapshot: {
      path: "data/research/philippines/calabarzon-scope.json",
      sha256: sha256(scopeBytes),
      waterbodyLeadCount: leads.length,
      searchStringCount: searchTerms.length,
      fields: ["waterBody", "locality"],
    },
    searchTerms,
    queryParameters: { country: "PH", checklistKey, taxonKey, limit: 100, pagination: "through endOfRecords" },
    queries,
    records,
    summary: {
      queryCount: queries.length,
      successfulQueries: queries.filter((row) => row.httpStatus === 200).length,
      zeroResultQueries: queries.filter((row) => row.resultCount === 0).length,
      positiveQueries: queries.filter((row) => row.resultCount > 0).length,
      uniqueCandidateRecordCount: records.length,
      fishSpeciesAssertionsAdded: 0,
      absenceInferred: false,
      publicAdmission: false,
    },
    decisions: {
      candidateRecordsRequireDirectOccurrenceAndDatasetReview: true,
      zeroResultsMeanNoIndexedTextMatchesOnly: true,
      waterbodyAssignmentsAdded: 0,
      speciesRowsAdded: 0,
      channelGeometryAdded: false,
      publicationApproval: false,
    },
  };

  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`, "utf8");
  console.log(
    `Finished: ${queries.length} queries; ${review.summary.zeroResultQueries} zero-result queries; ${records.length} unique candidate records. Saved ${fileURLToPath(reviewUrl)}.`,
  );
}

await main();
