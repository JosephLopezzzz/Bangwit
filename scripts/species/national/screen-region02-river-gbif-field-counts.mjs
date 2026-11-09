import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const inventoryPath = new URL("data/research/philippines/national-freshwater-region02-inland-water-source-inventory-20261106.json", root);
const dostReviewPath = new URL("data/research/philippines/national-freshwater-region02-dost-isabela-ludong-river-site-leads-20261109.json", root);
const rawDirectory = new URL("data/research/philippines/raw/national/gbif-region02-river-field-counts-col-filtered-20261109/", root);
const reportPath = new URL("data/research/philippines/national/reviews/gbif-region02-river-field-counts-col-filtered-20261109.json", root);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const taxonomyFilter = { taxonKey: "8VR36", checklistKey: "7ddf754f-d193-4cc9-b351-99906754a03b" };
const fields = ["waterBody", "locality"];
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) => value.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

async function get(url) {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public GBIF API field-count screen)" },
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

function addTerm(map, value, source) {
  const key = value.trim().toLocaleLowerCase("en-US");
  const current = map.get(key) ?? { value: value.trim(), sources: [] };
  if (!current.sources.includes(source)) current.sources.push(source);
  map.set(key, current);
}

async function main() {
  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  const dost = JSON.parse(await readFile(dostReviewPath, "utf8"));
  const terms = new Map();
  const planNames = [
    "Cagayan River", "Addalam River", "Magat River", "Ilagan", "Siffu-Mallig", "Dummun River",
    "Pared River", "Pinacanauan River", "Chico River", "Siffu River", "Mallig River",
  ];
  const planFinding = inventory.regionalSourceSummary.cagayanRiverinePlan.finding.toLocaleLowerCase("en-US");
  for (const name of ["Cagayan River", "Addalam", "Magat", "Ilagan", "Siffu-Mallig", "Dummun", "Pared", "Pinacanauan", "Chico"]) {
    if (!planFinding.includes(name.toLocaleLowerCase("en-US"))) throw new Error(`Expected river lead missing from local source inventory: ${name}`);
  }
  for (const value of planNames) addTerm(terms, value, "Cagayan Riverine Zone plan / Region II inventory");
  addTerm(terms, "Ibulao River", "Tauli et al. 2022 adjacent Ibulao-Magat research review");
  for (const municipality of dost.verbatimMunicipalityLeads) {
    for (const value of municipality.sourcePlaceLabelsForDiscovery) {
      addTerm(terms, value, `DOST site string / ${municipality.sourceMunicipalityLabel}`);
    }
  }

  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const queryResults = [];
  const termResults = new Map([...terms.keys()].map((key) => [key, { term: terms.get(key), waterBody: null, locality: null }]));
  let queryIndex = 0;
  for (const [termKey, term] of terms) {
    for (const field of fields) {
      queryIndex += 1;
      const url = new URL(endpoint);
      const parameters = { country: "PH", ...taxonomyFilter, [field]: term.value, limit: 0 };
      for (const [key, value] of Object.entries(parameters)) {
        url.searchParams.set(key, String(value));
      }
      const { response, bytes, json } = await get(url);
      if (!response.ok || !Number.isInteger(json.count) || !Array.isArray(json.results)) {
        throw new Error(`GBIF ${response.status} for ${field}=${term.value}: ${json.error ?? response.statusText}`);
      }
      const fileName = `${String(queryIndex).padStart(2, "0")}-${slug(term.value)}-${field}-count.json`;
      const rawPath = `raw/national/gbif-region02-river-field-counts-col-filtered-20261109/${fileName}`;
      await writeFile(new URL(fileName, rawDirectory), bytes);
      const result = {
        field,
        searchValue: term.value,
        querySources: term.sources,
        parameters,
        url: url.toString(),
        httpStatus: response.status,
        resultCount: json.count,
        enumeratedCount: json.results.length,
        rawResponse: { path: rawPath, bytes: bytes.length, sha256: sha256(bytes) },
      };
      queryResults.push(result);
      termResults.get(termKey)[field] = { resultCount: json.count, httpStatus: response.status };
      if (queryIndex < terms.size * fields.length) await wait(350);
    }
  }

  const inventoryBytes = await readFile(inventoryPath);
  const dostBytes = await readFile(dostReviewPath);
  const nonzeroQueries = queryResults.filter((query) => query.resultCount > 0);
  const report = {
    schemaVersion: 1,
    reviewId: "gbif-region02-river-field-counts-col-filtered-20261109",
    generatedOn: new Date().toISOString().slice(0, 10),
    status: "public-gbif-col-xr-actinopterygii-field-count-screen;query-counts-only;no-records-or-species-reviewed;supersedes-unsupported-class-parameter-attempt",
    purpose: "Prioritize Region II river and site-name records for later provider/source/identification review using GBIF's exact waterBody and locality fields.",
    sourceSnapshots: {
      regionalInventory: { path: "data/research/philippines/national-freshwater-region02-inland-water-source-inventory-20261106.json", sha256: sha256(inventoryBytes) },
      dostSiteLeadReview: { path: "data/research/philippines/national-freshwater-region02-dost-isabela-ludong-river-site-leads-20261109.json", sha256: sha256(dostBytes) },
    },
    queryMethod: {
      endpoint,
      queryCount: queryResults.length,
      uniqueSearchTerms: terms.size,
      fields,
      filters: { country: "PH", ...taxonomyFilter },
      taxonomyScope: "Catalogue of Life Extended Release Actinopterygii; occurrence API taxonKey plus checklistKey",
      pageSize: 0,
      rawResponsesContainOccurrenceRows: false,
      termSummary: [...termResults.values()],
    },
    summary: {
      successfulQueries: queryResults.filter((query) => query.httpStatus === 200).length,
      nonzeroQueries: nonzeroQueries.length,
      zeroCountQueries: queryResults.filter((query) => query.resultCount === 0).length,
      occurrenceRowsDownloaded: 0,
      fishSpeciesAssertions: 0,
      waterbodyIdentitiesValidated: 0,
      publicGeometryAdded: false,
      publicationApproval: false,
    },
    queries: queryResults,
    nextAction: "Fetch bounded rows for nonzero waterBody/locality queries; inspect original DwC values, provider, basis of record, date, identification, coordinate uncertainty, source citation, and license before assigning any result to a site.",
    limitations: [
      "GBIF indexed-field counts are query-screen results, not evidence that a waterbody or species is present or absent.",
      "The supported taxonKey/checklistKey filter scopes this pass to Catalogue of Life XR Actinopterygii; this is not a complete all-fish taxonomy and may omit fish outside this taxon concept or records that do not match the selected checklist.",
      "An earlier exploratory request used an unsupported free-text class=Actinopterygii parameter. GBIF ignored it; those mixed-taxon counts and fetched rows were discarded and are not evidence for this report.",
      "Counts from overlapping waterBody and locality queries can refer to the same records and must not be summed as unique occurrences.",
      "No occurrence rows were downloaded or reviewed in this count-only pass; there is no taxonomic, locality, coordinate, source-rights, or publication decision yet.",
      "The exact DOST place strings include locality qualifiers and may not be waterbody names; the screen does not resolve the source's municipality/site conflicts.",
      "A zero result is not evidence of absence. No species, habitat, geometry, diet, safety, access, or legal claim is made.",
    ],
  };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Queried ${queryResults.length} GBIF name/field pairs for ${terms.size} terms`);
  console.log(`${nonzeroQueries.length} query pairs returned nonzero Actinopterygii counts`);
  console.log(`Wrote data/research/philippines/national/reviews/gbif-region02-river-field-counts-col-filtered-20261109.json`);
  console.log(`Count-only API responses remain in ignored data/research/philippines/raw/national/gbif-region02-river-field-counts-col-filtered-20261109/`);
}

await main();
