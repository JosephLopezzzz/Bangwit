import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const checkedOn = "2026-11-25";
const reviewId = "central-luzon-candaba-gbif-exact-text-screen-20261125";
const outputUrl = new URL(`data/research/philippines/national/reviews/${reviewId}.json`, root);
const rawDirectoryName = "central-luzon-candaba-gbif-screen-20261125";
const rawDirectory = new URL(`data/research/philippines/raw/${rawDirectoryName}/`, root);
const endpoint = "https://api.gbif.org/v1/occurrence/search";
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const taxonKey = "8VR36";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) => value.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

const queries = [
  { field: "waterBody", value: "Candaba Swamp", rationale: "Named wetland lead from the Candaba inventory research." },
  { field: "waterBody", value: "Candaba Wetlands", rationale: "Common plural name variant for the same wetland lead." },
  { field: "waterBody", value: "Candaba", rationale: "Short waterBody text variant." },
  { field: "waterBody", value: "Maasin River", rationale: "Historical tributary lead described in Candaba research; text match alone cannot establish Candaba locality." },
  { field: "locality", value: "Candaba", rationale: "Exact locality text for the municipality name." },
  { field: "locality", value: "Candaba, Pampanga", rationale: "Municipality and province locality variant." },
  { field: "locality", value: "Candaba Swamp", rationale: "Wetland-name locality variant." },
  { field: "locality", value: "Candaba Wetlands", rationale: "Wetland-name locality variant." },
  { field: "locality", value: "San Agustin, Candaba", rationale: "Locality string from a historical Maasin River lead." },
  { field: "locality", value: "Maasin River, Candaba", rationale: "River-plus-municipality locality variant." },
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

  for (let index = 0; index < queries.length; index += 1) {
    const query = queries[index];
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

    const fileName = `${String(index + 1).padStart(2, "0")}-${query.field}-${slug(query.value)}.json`;
    const rawFile = `raw/${rawDirectoryName}/${fileName}`;
    await writeFile(new URL(fileName, rawDirectory), bytes);
    results.push({
      field: query.field,
      searchValue: query.value,
      rationale: query.rationale,
      requestUrl: url.toString(),
      httpStatus: response.status,
      count: json.count,
      resultsReturned: json.results.length,
      responseBytes: bytes.length,
      responseSha256: sha256(bytes),
      rawFile,
    });
    if (index < queries.length - 1) await wait(250);
  }

  const artifact = {
    schemaVersion: 1,
    reviewId,
    checkedOn,
    phaseId: "L3",
    regionId: "0300000000",
    regionName: "Region III (Central Luzon)",
    status: "bounded-colxr-actinopterygii-exact-field-screen-complete;not-absence-evidence",
    sourceId: "gbif-central-luzon-candaba-colxr-actinopterygii-screen-20261125",
    question: "Do corrected GBIF CoL XR Actinopterygii exact-field searches expose indexed occurrence candidates for Candaba wetland and its named historical locality leads?",
    query: {
      provider: "GBIF Occurrence Search API v1",
      endpoint,
      documentation: "https://techdocs.gbif.org/en/openapi/v1/occurrence",
      filters: { country: "PH", checklistKey, taxonKey, limit: 0 },
      taxonLabel: "Catalogue of Life Extended Release Actinopterygii",
      taxonomicLimit: "Ray-finned fishes only; this filter does not cover sharks and rays or every taxonomic group commonly called fish.",
      fieldSemantics: "Queries use supported GBIF occurrence-search waterBody or locality text fields. A text match is a discovery lead, not confirmation of the named waterbody or locality. The endpoint has no municipality or county filter; unsupported fields are not used.",
      rawStorage: "Count-only response JSON files are local-only under the ignored research raw directory; each query records its SHA-256 and byte length.",
    },
    leads: [
      { id: "candaba-wetland", name: "Candaba Swamp / Candaba Wetlands", basis: "Name variants used as text-search leads only; no geometry or official waterbody identity is asserted." },
      { id: "maasin-river-candaba-context", name: "Maasin River, Candaba context", basis: "Historical research lead identifies Maasin River near Barangay San Agustin, Candaba; GBIF string matches would need locality, event, dataset, and record triage." },
    ],
    results,
    interpretation: {
      nonzeroQueries: results.filter((result) => result.count > 0).length,
      occurrenceRowsReturned: results.reduce((sum, result) => sum + result.resultsReturned, 0),
      zeroQueriesAreAbsenceEvidence: false,
      occurrenceRowsAdmitted: 0,
      speciesAssertionsAdded: 0,
      coordinatesPublished: 0,
      geometryAdded: false,
      publicProjection: false,
      disposition: "This is a bounded text-index screen. Zeroes do not establish species absence and may miss spelling variants, missing locality/waterBody metadata, unindexed records, and records outside the selected ray-finned-fish checklist. Triage every nonzero result against the verbatim locality/waterBody, event date, basis of record, dataset and record-level license, coordinate uncertainty, taxonomic issues, and source dataset before assigning any record to Candaba or a named waterbody.",
    },
  };

  await writeFile(outputUrl, `${JSON.stringify(artifact, null, 2)}\n`);
  const nonzero = results.filter((result) => result.count > 0);
  console.log(`Tapos: ${results.length} bounded GBIF field queries; ${nonzero.length} have nonzero counts.`);
  for (const result of nonzero) console.log(`${result.field}=${result.searchValue}: ${result.count}`);
  console.log(`Review: ${fileURLToPath(outputUrl)}`);
}

main().catch((error) => {
  console.error(`GBIF screen failed: ${error.message}`);
  process.exitCode = 1;
});
