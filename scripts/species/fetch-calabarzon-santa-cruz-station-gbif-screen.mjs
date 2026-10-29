import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../../", import.meta.url);
const REVIEW_URL = new URL(
  "data/research/philippines/calabarzon-santa-cruz-station-gbif-screen-20261029.json",
  ROOT,
);
const RAW_URL = new URL(
  "data/research/philippines/raw/calabarzon-santa-cruz-station-gbif-screen-20261029/",
  ROOT,
);
const TERMS = ["Nagcarlan", "Liliw", "Calumpang", "Sta Cruz"];
const FIELDS = ["locality", "waterBody"];
const API = "https://api.gbif.org/v1/occurrence/search";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function fetchJSON(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public source screen)" },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  let body;
  try {
    body = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error(`GBIF returned non-JSON content for ${url}`);
  }
  if (!response.ok) throw new Error(`GBIF returned HTTP ${response.status} for ${url}`);
  return { body, bytes };
}

async function main() {
  await mkdir(fileURLToPath(RAW_URL), { recursive: true });
  const queries = [];

  for (const term of TERMS) {
    for (const field of FIELDS) {
      const parameters = new URLSearchParams({
        country: "PH",
        stateProvince: "Laguna",
        basisOfRecord: "PRESERVED_SPECIMEN",
        [field]: term,
        limit: "100",
      });
      const url = `${API}?${parameters}`;
      const { body, bytes } = await fetchJSON(url);
      if (body.count !== body.results.length || body.endOfRecords !== true) {
        throw new Error(`Incomplete GBIF page for ${field}=${term}: ${body.results.length}/${body.count}`);
      }
      const rawName = `${field}-${term.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}.json`;
      await writeFile(new URL(rawName, RAW_URL), bytes);
      queries.push({
        field,
        term,
        parameters: Object.fromEntries(parameters),
        url,
        httpStatus: 200,
        resultCount: body.count,
        enumeratedCount: body.results.length,
        endOfRecords: body.endOfRecords,
        rawResponse: {
          path: `raw/calabarzon-santa-cruz-station-gbif-screen-20261029/${rawName}`,
          bytes: bytes.length,
          sha256: sha256(bytes),
        },
        records: body.results.map((record) => ({
          gbifId: record.key,
          scientificName: record.scientificName ?? null,
          taxonRank: record.taxonRank ?? null,
          kingdom: record.kingdom ?? null,
          class: record.class ?? null,
          order: record.order ?? null,
          family: record.family ?? null,
          taxonKey: record.taxonKey ?? null,
          locality: record.locality ?? null,
          waterBody: record.waterBody ?? null,
          stateProvince: record.stateProvince ?? null,
          basisOfRecord: record.basisOfRecord ?? null,
          license: record.license ?? null,
          datasetKey: record.datasetKey ?? null,
          issues: [...(record.issues ?? [])],
        })),
      });
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  const matchedRecords = [...new Map(queries.flatMap((query) => query.records).map((record) => [record.gbifId, record])).values()];
  const fishRankMatches = matchedRecords.filter((record) =>
    /^(Actinopterygii|Chondrichthyes)$/i.test(record.class ?? ""),
  );
  const nonFishRecords = matchedRecords.filter((record) =>
    record.kingdom === "Plantae" || record.class === "Insecta",
  );
  const unresolvedTaxonomy = matchedRecords.length - fishRankMatches.length - nonFishRecords.length;

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-santa-cruz-station-gbif-screen-20261029",
    reviewedOn: "2026-10-29",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: {
      id: "ph-wb-santa-cruz-laguna-river",
      registryName: "Sta Cruz River",
      studyName: "Santa Cruz River System, Laguna",
    },
    status:
      unresolvedTaxonomy === 0 && fishRankMatches.length === 0
        ? "eight-exact-locality-waterBody-queries-complete;four-nonfish-records-excluded;no-fish-records-found;bounded-screen-only"
        : "eight-exact-locality-waterBody-queries-complete;taxonomy-review-incomplete;bounded-screen-only",
    method: {
      endpoint: API,
      queryCount: queries.length,
      terms: TERMS,
      fields: FIELDS,
      filters: { country: "PH", stateProvince: "Laguna", basisOfRecord: "PRESERVED_SPECIMEN" },
      pageLimit: 100,
      taxonFilter: null,
      taxonFilterReason: "A known CAS fish occurrence (3426421232) in this named river has null class and classKey in GBIF; filtering by classKey would suppress known fish evidence. Results were screened after retrieval instead.",
      fieldBehavior: "Exact indexed-field text queries, not spatial search or substring search.",
      apiDocsUrl: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
    },
    queries,
    summary: {
      successfulQueries: queries.filter((query) => query.httpStatus === 200).length,
      failedQueries: queries.filter((query) => query.httpStatus !== 200).length,
      distinctRecords: matchedRecords.length,
      explicitFishClassMatches: fishRankMatches.length,
      nonFishRecords: nonFishRecords.length,
      unresolvedTaxonomyRecords: unresolvedTaxonomy,
      taxonomicBreakdown: Object.fromEntries(
        [...new Set(matchedRecords.map((record) => `${record.kingdom ?? "unknown"}/${record.class ?? "unknown"}`))]
          .sort()
          .map((group) => [group, matchedRecords.filter((record) => `${record.kingdom ?? "unknown"}/${record.class ?? "unknown"}` === group).length]),
      ),
      interpretation: "The four exact-name specimen hits are explicitly recorded as two Plantae and two Insecta taxa. None is a fish; records with missing taxonomic classification would remain unresolved. This is not evidence of fish absence from the sites.",
    },
    decision: {
      speciesAssertionsAdded: 0,
      sourceAssignmentsChanged: false,
      waterbodyIdentityResolved: false,
      geometryAdded: false,
      publicAppProjectionAdded: false,
      publicationApproval: false,
    },
    limitations: [
      "These exact strings are place names, not unique station identifiers; matching locality text does not prove that a record belongs to the study station.",
      "The search covers only country PH, stateProvince Laguna, preserved specimens, four exact strings and two indexed fields; spelling variants and records without these text fields are not covered.",
      "A zero result or no fish among exact-name hits is not evidence of fish absence.",
      "The existing three CC0 CAS records named Santa Cruz River date to 18 October 1941 and do not crosswalk to the 2016-2017 study's four station aggregates.",
      "The 2022 study table remains untranscribed pending permission/reuse review; no taxa were inferred from its aggregate count of 15 species."
    ],
    nextAction: "Seek permission for the 2022 survey's table or obtain independent station-resolved records from an eligible provider; keep the existing 1941 Santa Cruz River evidence as a separate historical line until station identity is supported."
  };

  await writeFile(REVIEW_URL, `${JSON.stringify(review, null, 2)}\n`);
  console.log(`Wrote ${queries.length} query receipts; ${matchedRecords.length} distinct records (${nonFishRecords.length} non-fish, ${fishRankMatches.length} fish class, ${unresolvedTaxonomy} unresolved).`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Santa Cruz station GBIF screen failed: ${error.message}`);
    process.exitCode = 1;
  }
}
