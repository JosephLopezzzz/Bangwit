import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const outputUrl = new URL(
  "data/research/philippines/national/reviews/central-luzon-paitan-vaca-gbif-exact-text-screen-20261119.json",
  root,
);
const rawDirectory = new URL("data/research/philippines/raw/central-luzon-paitan-vaca-gbif-screen-20261119/", root);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) => value.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

const leads = [
  { id: "paitan-lake", name: "Paitan Lake", alias: "Libsong Lake", municipality: "Cuyapo" },
  { id: "vaca-dam-reservoir", name: "Vaca Dam Reservoir", municipality: "Llanera" },
];

const queries = [
  ...leads.flatMap((lead) => [lead.name, lead.alias].filter(Boolean).map((value) => ({ lead, field: "waterBody", value }))),
  ...leads.flatMap((lead) => [lead.name, lead.alias, lead.name.split(" ")[0], lead.municipality].filter(Boolean).map((value) => ({
    lead,
    field: "locality",
    value,
  }))),
  { lead: leads[1], field: "waterBody", value: "Vaca Dam" },
  { lead: leads[1], field: "locality", value: "Vaca Dam" },
];

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
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const results = [];

  for (const query of queries) {
    const parameters = {
      country: "PH",
      checklistKey,
      taxonKey,
      [query.field]: query.value,
      limit: 0,
    };
    const url = new URL(endpoint);
    for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, String(value));

    const { response, bytes, json } = await getJson(url);
    if (!response.ok || !Number.isInteger(json.count) || !Array.isArray(json.results)) {
      throw new Error(`GBIF ${response.status} for ${query.field}=${query.value}: ${json.error ?? response.statusText}`);
    }

    const fileName = `${query.lead.id}-${query.field}-${slug(query.value)}.json`;
    const rawFile = `raw/central-luzon-paitan-vaca-gbif-screen-20261119/${fileName}`;
    await writeFile(new URL(fileName, rawDirectory), bytes);
    results.push({
      leadId: query.lead.id,
      waterbodyAsReported: query.lead.name,
      field: query.field,
      searchValue: query.value,
      requestUrl: url.toString(),
      httpStatus: response.status,
      count: json.count,
      resultsReturned: json.results.length,
      responseBytes: bytes.length,
      responseSha256: sha256(bytes),
      rawFile,
    });
    await wait(250);
  }

  const artifact = {
    schemaVersion: 1,
    reviewId: "central-luzon-paitan-vaca-gbif-exact-text-screen-20261119",
    checkedOn: "2026-11-19",
    phaseId: "L3",
    regionId: "0300000000",
    regionName: "Region III (Central Luzon)",
    status: "corrected-colxr-exact-field-screen-complete;record-triage-required-for-nonzero-results",
    sourceId: "gbif-central-luzon-paitan-vaca-colxr-actinopterygii-screen-20261119",
    question: "Do corrected GBIF CoL XR Actinopterygii exact-field searches expose indexed fish occurrence candidates for the separate Paitan Lake and Vaca Dam Reservoir leads?",
    query: {
      provider: "GBIF Occurrence Search API v1",
      endpoint,
      documentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      filters: { country: "PH", checklistKey, taxonKey, limit: 0 },
      taxonLabel: "Catalogue of Life Extended Release Actinopterygii",
      taxonomicLimit: "Ray-finned fishes only; this filter does not cover sharks and rays or every taxonomic group commonly called fish.",
      fieldSemantics: "Queries use the GBIF occurrence-search waterBody or locality field with the listed text. Matching a text label is only a discovery lead; it does not validate the occurrence's waterbody identity.",
      legacyKey: "The prior key 204 is deleted and its saved zeroes remain invalidated; this screen uses the corrected CoL XR key 8VR36 and checklist 7ddf754f-d193-4cc9-b351-99906754a03b.",
      rawStorage: "Response JSON files are local-only under the ignored research raw directory; each query records its SHA-256 and byte length.",
    },
    leads,
    results,
    interpretation: {
      nonzeroQueries: results.filter((result) => result.count > 0).length,
      zeroQueriesAreAbsenceEvidence: false,
      occurrenceRowsAdmitted: 0,
      speciesAssertionsAdded: 0,
      coordinatesPublished: 0,
      geometryAdded: false,
      publicProjection: false,
      disposition: "Triage every nonzero result against the verbatim locality/waterBody, event date, basis of record, dataset and record-level license, coordinate uncertainty, taxonomic issues, and source dataset before admitting even historical waterbody-specific evidence. Do not treat zeroes as absence.",
    },
  };

  await writeFile(outputUrl, `${JSON.stringify(artifact, null, 2)}\n`);
  const nonzero = results.filter((result) => result.count > 0);
  console.log(`Tapos: ${results.length} corrected field queries; ${nonzero.length} nonzero query results.`);
  for (const result of nonzero) console.log(`${result.waterbodyAsReported} | ${result.field}=${result.searchValue}: ${result.count}`);
  console.log(`Review: ${fileURLToPath(outputUrl)}`);
}

main().catch((error) => {
  console.error(`GBIF screen failed: ${error.message}`);
  process.exitCode = 1;
});
