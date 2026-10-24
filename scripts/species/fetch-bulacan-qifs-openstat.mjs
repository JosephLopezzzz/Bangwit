import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const apiUrl = "https://openstat.psa.gov.ph/PXWeb/api/v1/en/DB/2E/FS/0052E4GVIP0.px";
const rawPath = resolve("data/research/philippines/raw/bulacan-qifs-2025-quarterly-categories-openstat.csv");
const profilePath = resolve("data/research/philippines/central-luzon-bulacan-qifs-statistical-profile-20261024.json");

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += character;
    }
  }

  cells.push(cell);
  return cells;
}

const schemaResponse = await fetch(apiUrl, { headers: { Accept: "application/json" } });
if (!schemaResponse.ok) throw new Error(`OpenSTAT schema request failed: HTTP ${schemaResponse.status}`);
const schema = await schemaResponse.json();
const species = schema.variables.find((variable) => variable.code === "Species");
if (species?.values.length !== 38)
  throw new Error("OpenSTAT Species dimension changed; review the query before saving a snapshot.");

const request = {
  query: [
    { code: "Geolocation", selection: { filter: "item", values: ["0301400000"] } },
    { code: "Species", selection: { filter: "item", values: species.values } },
    { code: "Year", selection: { filter: "item", values: ["23"] } },
    { code: "Quarter", selection: { filter: "item", values: ["0", "1", "2", "3"] } },
  ],
  response: { format: "csv" },
};

const dataResponse = await fetch(apiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "text/csv" },
  body: JSON.stringify(request),
});
if (!dataResponse.ok) throw new Error(`OpenSTAT data request failed: HTTP ${dataResponse.status}`);
const csv = await dataResponse.text();
const lines = csv.trim().split(/\r?\n/);
const table = lines.map(parseCsvLine);
if (table.length !== 39) throw new Error(`Expected 38 QIFS dimension rows, received ${table.length - 1}.`);

const headers = table[0];
if (
  headers[0] !== "Geolocation" ||
  headers[1] !== "Species" ||
  headers.slice(2).join("|") !== "2025 Quarter 1|2025 Quarter 2|2025 Quarter 3|2025 Quarter 4"
) {
  throw new Error("OpenSTAT returned an unexpected Bulacan QIFS table shape.");
}

const profile = JSON.parse(await readFile(profilePath, "utf8"));
const expectedRows = new Map(
  profile.annualProductionRows
    .filter((row) => row.type === "reported-catch-category")
    .map((row) => [row.reportedName, row]),
);
const categoryRows = table.slice(1).filter((row) => row[1].startsWith("...."));
if (categoryRows.length !== 34) throw new Error(`Expected 34 leaf catch categories, received ${categoryRows.length}.`);

let available = 0;
let unavailable = 0;
let maxDifference = 0;
for (const row of categoryRows) {
  const name = row[1].replace(/^\.+/, "");
  const expected = expectedRows.get(name);
  if (!expected) throw new Error(`Unrecognized PSA catch category: ${name}`);
  const quarterValues = row.slice(2);
  const numericValues = quarterValues.filter((value) => value !== "..").map(Number);

  if (numericValues.length === 0) {
    unavailable += 1;
    if (expected.metricTons !== null || expected.sourceStatus !== "..")
      throw new Error(`Unavailable category disagrees with the pinned profile: ${name}`);
    continue;
  }

  available += 1;
  if (expected.metricTons === null)
    throw new Error(`PSA now reports a value for previously unavailable category: ${name}`);
  const roundedQuarterSum = numericValues.reduce((sum, value) => sum + value, 0);
  const difference = Math.abs(roundedQuarterSum - expected.metricTons);
  maxDifference = Math.max(maxDifference, difference);
  if (difference > 0.015)
    throw new Error(`Official quarter values exceed rounding tolerance for ${name}: ${difference}`);
}

await mkdir(dirname(rawPath), { recursive: true });
await writeFile(rawPath, csv, "utf8");
const sha256 = createHash("sha256").update(csv, "utf8").digest("hex");
console.log(`Saved official PSA OpenSTAT CSV: ${rawPath}`);
console.log(
  `2025 Bulacan QIFS: ${categoryRows.length} categories; ${available} with values; ${unavailable} unavailable.`,
);
console.log(
  `Maximum difference from pinned mirror annual values after quarter rounding: ${maxDifference.toFixed(4)} metric tons.`,
);
console.log(`SHA-256: ${sha256}`);
