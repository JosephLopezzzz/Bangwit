import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const outputDirectory = resolve(
  root,
  "data/research/philippines/raw/national/pampanga-estuary-gbif-backbone-crosscheck-20261127",
);
const sourceNames = [
  "Valamugil perussi",
  "Leiognathus blochii",
  "Leiognathus fasciatus",
  "Pelates quadrilineatus",
  "Acentrogobius nebulosus",
  "Glossogobius biocellatus",
  "Oxyurichthys opthalmonema",
  "Pseudorhombus cinnamomeus",
];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return { value: JSON.parse(bytes.toString("utf8")), bytes };
}

await mkdir(outputDirectory, { recursive: true });

for (const [index, sourceName] of sourceNames.entries()) {
  const url = new URL("https://api.gbif.org/v1/species/match");
  url.searchParams.set("name", sourceName);
  url.searchParams.set("strict", "true");
  const match = await fetchJson(url);
  const matchFile = `${String(index + 1).padStart(2, "0")}-${slug(sourceName)}.json`;
  await writeFile(resolve(outputDirectory, matchFile), match.bytes);

  let acceptedUsage = null;
  if (Number.isInteger(match.value.acceptedUsageKey)) {
    const usageUrl = `https://api.gbif.org/v1/species/${match.value.acceptedUsageKey}`;
    const usage = await fetchJson(usageUrl);
    const usageFile = `usage-${match.value.acceptedUsageKey}.json`;
    await writeFile(resolve(outputDirectory, usageFile), usage.bytes);
    acceptedUsage = {
      url: usageUrl,
      file: usageFile,
      sha256: sha256(usage.bytes),
      status: usage.value.taxonomicStatus,
      scientificName: usage.value.scientificName,
      canonicalName: usage.value.canonicalName,
      family: usage.value.family,
    };
  }

  console.log(
    JSON.stringify({
      sourceName,
      queryUrl: url.toString(),
      matchFile,
      matchSha256: sha256(match.bytes),
      match: {
        matchType: match.value.matchType,
        confidence: match.value.confidence,
        status: match.value.status,
        usageKey: match.value.usageKey,
        acceptedUsageKey: match.value.acceptedUsageKey,
        scientificName: match.value.scientificName,
        canonicalName: match.value.canonicalName,
        family: match.value.family,
      },
      acceptedUsage,
    }),
  );
}
