import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const outputDirectory = resolve(
  root,
  "data/research/philippines/raw/national/camiling-river-colxr-occurrence-screen-20261127",
);
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const queries = [
  {
    label: "waterbody-camiling-river",
    filePrefix: "waterbody-camiling-river",
    params: { waterBody: "Camiling River", hasCoordinate: "true" },
  },
  {
    label: "locality-camiling-river",
    filePrefix: "locality-camiling-river",
    params: { locality: "Camiling River", hasCoordinate: "true" },
  },
  {
    label: "locality-camiling-tarlac",
    filePrefix: "locality-camiling-tarlac",
    params: { locality: "Camiling", stateProvince: "Tarlac", hasCoordinate: "true" },
  },
  {
    label: "waterbody-camiling-river-no-coordinate-filter",
    filePrefix: "waterbody-camiling-river-no-coordinate-filter",
    params: { waterBody: "Camiling River" },
  },
  {
    label: "locality-camiling-river-no-coordinate-filter",
    filePrefix: "locality-camiling-river-no-coordinate-filter",
    params: { locality: "Camiling River" },
  },
  {
    label: "locality-camiling-tarlac-no-coordinate-filter",
    filePrefix: "locality-camiling-tarlac-no-coordinate-filter",
    params: { locality: "Camiling", stateProvince: "Tarlac" },
  },
];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function fetchPage(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return { value: JSON.parse(bytes.toString("utf8")), bytes };
}

await mkdir(outputDirectory, { recursive: true });

const taxonUrl = new URL("https://api.gbif.org/v2/species/match");
taxonUrl.searchParams.set("scientificName", "Actinopterygii");
taxonUrl.searchParams.set("taxonRank", "class");
taxonUrl.searchParams.set("checklistKey", checklistKey);
const taxonResponse = await fetchPage(taxonUrl);
const taxonUsage = taxonResponse.value.usage;
if (
  taxonResponse.value.diagnostics?.matchType !== "EXACT" ||
  taxonUsage?.name !== "Actinopterygii" ||
  taxonUsage?.status !== "ACCEPTED" ||
  taxonResponse.value.synonym !== false
) {
  throw new Error(`Unexpected GBIF CoL XR match: ${JSON.stringify(taxonResponse.value)}`);
}
const taxonKey = taxonUsage.key;
await writeFile(resolve(outputDirectory, "taxon-match-actinopterygii.json"), taxonResponse.bytes);
console.log(
  JSON.stringify({
    taxonUrl: taxonUrl.toString(),
    taxonName: taxonUsage.name,
    rank: taxonUsage.rank,
    taxonKey,
    sha256: sha256(taxonResponse.bytes),
  }),
);

for (const query of queries) {
  let offset = 0;
  let total = 0;
  let resultCount = 0;
  do {
    const url = new URL("https://api.gbif.org/v1/occurrence/search");
    url.searchParams.set("country", "PH");
    url.searchParams.set("checklistKey", checklistKey);
    url.searchParams.set("taxonKey", String(taxonKey));
    url.searchParams.set("limit", "300");
    url.searchParams.set("offset", String(offset));
    for (const [key, value] of Object.entries(query.params)) url.searchParams.set(key, value);

    const page = await fetchPage(url);
    total = page.value.count;
    resultCount += page.value.results.length;
    const filename = `${query.filePrefix}-offset-${offset}.json`;
    await writeFile(resolve(outputDirectory, filename), page.bytes);
    console.log(
      JSON.stringify({
        label: query.label,
        queryUrl: url.toString(),
        resultCount: page.value.count,
        pageRows: page.value.results.length,
        file: filename,
        sha256: sha256(page.bytes),
      }),
    );
    offset += page.value.results.length;
    if (page.value.results.length === 0 || offset >= total) break;
  } while (true);
  if (resultCount !== total) throw new Error(`${query.label}: fetched ${resultCount} of ${total} results`);
}
