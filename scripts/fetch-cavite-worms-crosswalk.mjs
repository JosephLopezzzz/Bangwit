import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(projectRoot, "data", "research", "obis", "cavite");
const inputPath = path.join(dataDir, "cavite-obis-fish-candidates.csv");
const outputPath = path.join(dataDir, "cavite-obis-worms-crosswalk.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records
    .filter((record) => record.length === headers.length)
    .map((record) => Object.fromEntries(headers.map((header, i) => [header, record[i]])));
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const sourceRows = parseCsv(await readFile(inputPath, "utf8"));
const candidates = sourceRows
  .map((row) => ({ ...row, aphiaId: row.aphia_ids?.trim() }))
  .filter((row) => /^\d+$/.test(row.aphiaId));
const ids = [...new Set(candidates.map((row) => row.aphiaId))];

if (!ids.length) throw new Error("No Aphia IDs found in the fish-candidate CSV.");
if (ids.length > 50) throw new Error(`WoRMS batch endpoint limit exceeded: ${ids.length} IDs.`);

const endpoint = new URL("https://www.marinespecies.org/rest/AphiaRecordsByAphiaIDs");
for (const id of ids) endpoint.searchParams.append("aphiaids[]", id);

const response = await fetch(endpoint, {
  headers: { accept: "application/json", "user-agent": "Bangwit research crosswalk" },
});
if (!response.ok) throw new Error(`WoRMS returned HTTP ${response.status}.`);

const records = await response.json();
if (!Array.isArray(records)) throw new Error("WoRMS response was not a list of records.");
const byId = new Map(records.filter(Boolean).map((record) => [String(record.AphiaID), record]));
const queriedAt = new Date().toISOString();
const headers = [
  "obis_species_name",
  "obis_aphia_id",
  "obis_class",
  "worms_scientific_name",
  "worms_authority",
  "worms_status",
  "worms_accepted_aphia_id",
  "worms_accepted_name",
  "worms_accepted_authority",
  "worms_rank",
  "worms_class",
  "worms_family",
  "worms_record_url",
  "worms_modified",
  "queried_at_utc",
  "interpretation",
];

const outputRows = candidates.map((candidate) => {
  const record = byId.get(candidate.aphiaId);
  return [
    candidate.species_name,
    candidate.aphiaId,
    candidate.class,
    record?.scientificname,
    record?.authority,
    record?.status,
    record?.valid_AphiaID,
    record?.valid_name,
    record?.valid_authority,
    record?.rank,
    record?.class,
    record?.family,
    record?.url,
    record?.modified,
    queriedAt,
    record
      ? "Taxonomic name cross-check only; does not verify Cavite presence, legality, or catchability."
      : "Aphia ID did not resolve in this WoRMS response; requires manual review.",
  ];
});

const csv = [headers, ...outputRows].map((row) => row.map(csvCell).join(",")).join("\n");
await writeFile(outputPath, `${csv}\n`, "utf8");

const resolved = outputRows.filter((row) => row[3]).length;
const accepted = outputRows.filter((row) => row[5] === "accepted").length;
const unaccepted = outputRows.filter((row) => row[5] && row[5] !== "accepted").length;
console.log(`WoRMS rows: ${outputRows.length}; resolved: ${resolved}; accepted: ${accepted}; unaccepted: ${unaccepted}.`);
console.log(`Saved ${path.relative(projectRoot, outputPath)}.`);
