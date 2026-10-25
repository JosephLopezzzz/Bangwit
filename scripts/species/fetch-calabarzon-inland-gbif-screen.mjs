import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const scopeUrl = new URL("data/research/philippines/calabarzon-scope.json", root);
const reviewUrl = new URL("data/research/philippines/calabarzon-inland-gbif-screen-20261025.json", root);
const rawDirectory = new URL("data/research/philippines/raw/calabarzon-inland-gbif-screen-20261025/", root);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const taxonLabel = "Catalogue of Life Extended Release Actinopterygii";
const wait = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) =>
  value
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

async function getPage(url) {
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

async function main() {
  const scope = JSON.parse(await readFile(scopeUrl, "utf8"));
  const waterbodies = scope.waterbodies.filter((waterbody) => ["lake", "reservoir"].includes(waterbody.kind));
  const searchTerms = waterbodies.flatMap((waterbody) =>
    [waterbody.name, ...(waterbody.aliases ?? [])].map((value, index) => ({
      value,
      scopeLeadId: waterbody.id,
      canonicalName: waterbody.name,
      kind: waterbody.kind,
      queryLabel: index === 0 ? "scope-name" : "scope-alias-string",
    })),
  );

  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const queries = [];
  const recordsById = new Map();

  for (const term of searchTerms) {
    for (const field of ["waterBody", "locality"]) {
      const parameters = {
        country: "PH",
        taxonKey,
        checklistKey,
        [field]: term.value,
        limit: 100,
      };
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
        const { response, bytes, json } = await getPage(url);
        httpStatus = response.status;
        if (!response.ok || !Array.isArray(json.results)) {
          throw new Error(`GBIF ${response.status} for ${field}=${term.value}: ${json.error ?? response.statusText}`);
        }

        const fileName = `${term.scopeLeadId}-${slug(term.value)}-${field}-offset-${offset}.json`;
        const rawPath = `raw/calabarzon-inland-gbif-screen-20261025/${fileName}`;
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
        const existing = recordsById.get(id) ?? {
          gbifId: row.gbifID,
          occurrenceId: row.occurrenceID ?? null,
          scientificName: row.scientificName ?? null,
          acceptedScientificName: row.acceptedScientificName ?? null,
          rank: row.taxonRank ?? null,
          taxonKey: row.taxonKey ?? null,
          acceptedTaxonKey: row.acceptedTaxonKey ?? null,
          taxonomicStatus: row.taxonomicStatus ?? null,
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
          stateProvince: row.stateProvince ?? null,
          county: row.county ?? null,
          municipality: row.municipality ?? null,
          institutionCode: row.institutionCode ?? null,
          collectionCode: row.collectionCode ?? null,
          catalogNumber: row.catalogNumber ?? null,
          recordedBy: row.recordedBy ?? null,
          occurrenceRemarks: row.occurrenceRemarks ?? null,
          identificationRemarks: row.identificationRemarks ?? null,
          coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters ?? null,
          issues: [...(row.issues ?? [])].sort(),
          queryMatches: [],
        };
        existing.queryMatches.push({
          field,
          searchValue: term.value,
          scopeLeadId: term.scopeLeadId,
          queryLabel: term.queryLabel,
        });
        recordsById.set(id, existing);
      }

      queries.push({
        field,
        searchValue: term.value,
        scopeLeadId: term.scopeLeadId,
        queryLabel: term.queryLabel,
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
  for (const record of records) {
    record.queryMatches.sort(
      (left, right) =>
        left.scopeLeadId.localeCompare(right.scopeLeadId) ||
        left.field.localeCompare(right.field) ||
        left.searchValue.localeCompare(right.searchValue),
    );
  }
  const countBy = (key) =>
    Object.entries(
      records.reduce((counts, record) => {
        const value = record[key] ?? "unknown";
        counts[value] = (counts[value] ?? 0) + 1;
        return counts;
      }, {}),
    )
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([value, count]) => ({ value, count }));

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-inland-gbif-screen-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: scope.regionId,
    regionName: "Region IV-A (CALABARZON)",
    status: "exact-name-text-screen-complete;returned-records-unreviewed",
    purpose:
      "Bounded GBIF discovery screen for all scope-listed CALABARZON lakes and reservoirs. Query fields are searched as GBIF indexed text; a hit is a candidate only and a zero is not evidence of absence.",
    sourceId: "gbif-occurrence-downloads",
    endpoint,
    taxonomy: { checklistKey, taxonKey, label: taxonLabel },
    scopeSnapshot: {
      path: "data/research/philippines/calabarzon-scope.json",
      sha256: sha256(await readFile(scopeUrl)),
      waterbodyLeadCount: waterbodies.length,
      searchStringCount: searchTerms.length,
      fields: ["waterBody", "locality"],
    },
    searchTerms,
    queryParameters: { country: "PH", checklistKey, taxonKey, limit: 100 },
    queries,
    records,
    summary: {
      queryCount: queries.length,
      successfulQueries: queries.filter((query) => query.httpStatus === 200).length,
      zeroResultQueries: queries.filter((query) => query.resultCount === 0).length,
      positiveQueries: queries.filter((query) => query.resultCount > 0).length,
      uniqueCandidateRecordCount: records.length,
      recordRanks: countBy("rank"),
      basisOfRecord: countBy("basisOfRecord"),
      licenses: countBy("license"),
      datasets: countBy("datasetKey"),
      speciesRankRecordCount: records.filter((record) => record.rank === "SPECIES").length,
    },
    decision: {
      returnedRowsRequireRecordAndLocalityReview: true,
      admittedSpeciesAssertions: 0,
      publicRecordsAdded: 0,
      dietClaimsAdded: 0,
      geometryAdded: false,
      publicAdmission: false,
      zeroesUsedAsAbsence: false,
      coordinatesIncludedInResearchRows: false,
      interpretation:
        "This is a text-field discovery screen, not a verified checklist. Review candidate records individually for actual waterbody identity, source dataset, rights, taxonomy, dates, locality, and quality before preparing any assertion. Unreturned records, zeroes, candidate name variants, and missing salinity do not establish absence or complete coverage.",
    },
    provenance: {
      retrievedAt: new Date().toISOString(),
      queryFields: "GBIF occurrence/search waterBody and locality indexed-text fields",
      queryEncoding: "URLSearchParams UTF-8 encoding",
      apiDocumentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      dataUseDocumentation: "https://techdocs.gbif.org/en/data-use/api-downloads",
      rawPath: "raw/calabarzon-inland-gbif-screen-20261025/",
    },
  };

  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Saved ${queries.length} GBIF queries; ${records.length} unique candidate records (${review.summary.speciesRankRecordCount} species-rank), with no public assertions.`,
  );
}

main().catch((error) => {
  console.error(`CALABARZON inland GBIF screen failed: ${error.message}`);
  process.exitCode = 1;
});
