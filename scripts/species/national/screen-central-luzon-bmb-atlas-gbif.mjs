import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const inputUrl = new URL(
  "data/research/philippines/national/reviews/central-luzon-bmb-2014-wetland-atlas-count-crosswalk-20261119.json",
  root,
);
const outputUrl = new URL(
  "data/research/philippines/national/reviews/central-luzon-bmb-atlas-gbif-count-screen-20261119.json",
  root,
);
const rawDirectory = new URL("data/research/philippines/raw/central-luzon-bmb-atlas-gbif-screen-20261119/", root);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) => value.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

async function getJson(url) {
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
  const scope = JSON.parse(await readFile(inputUrl, "utf8"));
  const names = [...new Set(scope.waterbodyNames)];
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const queries = [];
  for (const name of names) {
    for (const field of ["waterBody", "locality"]) {
      const parameters = {
        country: "PH",
        checklistKey,
        taxonKey,
        [field]: name,
        limit: 0,
      };
      const url = new URL(endpoint);
      for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, String(value));

      const { response, bytes, json } = await getJson(url);
      if (!response.ok || !Number.isInteger(json.count) || !Array.isArray(json.results)) {
        throw new Error(`GBIF ${response.status} for ${field}=${name}: ${json.error ?? response.statusText}`);
      }

      const fileName = `${slug(name)}-${field}.json`;
      await writeFile(new URL(fileName, rawDirectory), bytes);
      queries.push({
        nameAsReported: name,
        field,
        searchValue: name,
        requestUrl: url.toString(),
        httpStatus: response.status,
        count: json.count,
        resultsReturned: json.results.length,
        responseBytes: bytes.length,
        responseSha256: sha256(bytes),
        rawFile: `raw/central-luzon-bmb-atlas-gbif-screen-20261119/${fileName}`,
      });
      await wait(250);
    }
  }

  const artifact = {
    schemaVersion: 1,
    reviewId: "central-luzon-bmb-atlas-gbif-count-screen-20261119",
    checkedOn: "2026-11-19",
    phaseId: "L3",
    regionId: "0300000000",
    regionName: "Region III (Central Luzon)",
    status: "count-only-exact-waterbody-locality-screen-complete;nonzero-record-review-required",
    sourceId: "gbif-central-luzon-bmb-atlas-colxr-actinopterygii-screen-20261119",
    question: "Do GBIF's indexed waterBody or locality fields return count-only candidate matches for the 15 BMB Atlas Region III Table 1 names and 20 selected Table 2 watercourse leads?",
    query: {
      provider: "Global Biodiversity Information Facility",
      endpoint,
      documentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      filters: { country: "PH", checklistKey, taxonKey, limit: 0 },
      taxonLabel: "Catalogue of Life Extended Release Actinopterygii",
      taxonomicLimit: "Ray-finned fishes only. This does not cover sharks and rays or every taxonomic group commonly called fish.",
      fieldSemantics: "The supplied waterbody names were searched in the indexed waterBody and locality text fields. A positive count is only a record-retrieval lead; a string match does not validate the waterbody identity or occurrence row.",
      rawStorage: "Only count responses (limit=0) are retained in the ignored local raw directory with byte lengths and SHA-256 values. No occurrence records are downloaded by this screen.",
    },
    scope: {
      reviewFile: "data/research/philippines/national/reviews/central-luzon-bmb-2014-wetland-atlas-count-crosswalk-20261119.json",
      sourceNameCount: names.length,
      fields: ["waterBody", "locality"],
      queryCount: queries.length,
      selectionNote: "The screen includes all 15 Atlas Table 1 Region III names and the 20 selected Table 2 watercourse leads in the linked crosswalk; it is not a complete search of all Atlas river-system rows.",
    },
    names,
    queries,
    summary: {
      totalQueries: queries.length,
      successfulQueries: queries.filter((query) => query.httpStatus === 200).length,
      nonzeroNameFieldMatches: queries.filter((query) => query.count > 0).length,
      zeroNameFieldMatches: queries.filter((query) => query.count === 0).length,
      totalCountOnlyMatches: queries.reduce((total, query) => total + query.count, 0),
      occurrenceRowsDownloaded: 0,
      occurrenceRowsReviewed: 0,
      speciesAssertionsAdded: 0,
    },
    interpretation: {
      zeroesAreAbsenceEvidence: false,
      positiveCountsAreWaterbodyConfirmed: false,
      coordinatesPublished: 0,
      geometryAdded: false,
      publicProjection: false,
      disposition: "For every positive count, retrieve and review occurrence rows for verbatim locality/waterBody, event date, basis of record, dataset, record-level license, coordinate uncertainty, taxonomic issues and source evidence before assigning any record to a waterbody. Zeroes only mark bounded text-index gaps; they do not establish fish absence.",
    },
  };

  await writeFile(outputUrl, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`Tapos: ${queries.length} count-only queries for ${names.length} names.`);
  console.log(`Positive text-field matches: ${artifact.summary.nonzeroNameFieldMatches}.`);
  console.log(`Review: ${fileURLToPath(outputUrl)}`);
}

main().catch((error) => {
  console.error(`GBIF atlas screen failed: ${error.message}`);
  process.exitCode = 1;
});
