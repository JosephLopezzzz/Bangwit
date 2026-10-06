import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(projectRoot, "data", "research", "obis", "cavite");

const geometry =
  "POLYGON ((120.9114 14.5018, 120.6093 14.2755, 120.5825 14.2389, 120.5653 14.1357, 120.6093 14.1157, 120.6237 14.0984, 120.9114 14.5018))";

const pageSize = 100;
let after = "-1";
let expectedTotal;
const records = [];

while (true) {
  const params = new URLSearchParams({
    geometry,
    size: String(pageSize),
    after,
  });

  const response = await fetch(
    `https://api.obis.org/v3/occurrence?${params}`
  );

  if (!response.ok) {
    throw new Error(`OBIS API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  expectedTotal ??= Number(data.total);

  const page = data.results ?? [];
  if (page.length === 0) break;

  records.push(...page);
  console.log(`Nakuha na: ${records.length}${Number.isFinite(expectedTotal) ? ` / ${expectedTotal}` : ""}`);

  const lastId = page.at(-1)?.id;
  if (!lastId || lastId === after) break;
  after = lastId;

  if (Number.isFinite(expectedTotal) && records.length >= expectedTotal) break;
}

if (records.length === 0) {
  throw new Error("Walang records na ibinalik ng OBIS API.");
}

const columns = [...new Set(records.flatMap(Object.keys))];

const csvCell = (value) => {
  const text =
    value == null
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replaceAll('"', '""')}"`;
};

const csv = [
  columns.map(csvCell).join(","),
  ...records.map((record) =>
    columns.map((column) => csvCell(record[column])).join(",")
  ),
].join("\r\n");

await mkdir(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "cavite-obis-occurrences.csv");
await writeFile(outputPath, `\uFEFF${csv}`, "utf8");

const species = new Set(
  records.map((record) => record.species).filter(Boolean)
);

console.log(`Tapos: ${records.length} occurrence records`);
console.log(`Unique species names: ${species.size}`);
console.log(`Nai-save ang file sa ${path.relative(projectRoot, outputPath)}.`);

