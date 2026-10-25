import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const apiUrl = "https://openstat.psa.gov.ph/PXWeb/api/v1/en/DB/2E/FS/0052E4GVIP0.px";
const maxCells = 100_000;
const requestedYears = process.argv.slice(2).length ? process.argv.slice(2) : ["2025", "2026"];
if (requestedYears.some((year) => !/^\d{4}$/.test(year)) || new Set(requestedYears).size !== requestedYears.length) {
  throw new Error("Pass each requested year once, for example: 2025 2026.");
}

const schemaResponse = await fetch(apiUrl, { headers: { Accept: "application/json" } });
if (!schemaResponse.ok) throw new Error(`OpenSTAT schema request failed: HTTP ${schemaResponse.status}`);
const schema = await schemaResponse.json();
const dimensions = Object.fromEntries(schema.variables.map((variable) => [variable.code, variable]));
for (const name of ["Geolocation", "Species", "Year", "Quarter"]) {
  if (!dimensions[name]?.values?.length || dimensions[name].values.length !== dimensions[name].valueTexts.length) {
    throw new Error(`OpenSTAT ${name} dimension changed; review the query before saving a snapshot.`);
  }
}

const yearCodes = requestedYears.map((year) => {
  const index = dimensions.Year.valueTexts.indexOf(year);
  if (index < 0) throw new Error(`OpenSTAT does not currently publish the requested year ${year}.`);
  return dimensions.Year.values[index];
});
const quarterCodes = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"].map((quarter) => {
  const index = dimensions.Quarter.valueTexts.indexOf(quarter);
  if (index < 0) throw new Error(`OpenSTAT ${quarter} dimension changed; review the query.`);
  return dimensions.Quarter.values[index];
});
const selectedCells =
  dimensions.Geolocation.values.length * dimensions.Species.values.length * yearCodes.length * quarterCodes.length;
if (selectedCells > maxCells) {
  throw new Error(`Query selects ${selectedCells} cells, over the ${maxCells}-cell limit; split the year list.`);
}

const query = {
  query: [
    { code: "Geolocation", selection: { filter: "item", values: dimensions.Geolocation.values } },
    { code: "Species", selection: { filter: "item", values: dimensions.Species.values } },
    { code: "Year", selection: { filter: "item", values: yearCodes } },
    { code: "Quarter", selection: { filter: "item", values: quarterCodes } },
  ],
  response: { format: "csv" },
};
const queryText = JSON.stringify(query);
const dataResponse = await fetch(apiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "text/csv" },
  body: queryText,
});
if (!dataResponse.ok) {
  const message = (await dataResponse.text()).slice(0, 500);
  throw new Error(`OpenSTAT data request failed: HTTP ${dataResponse.status}: ${message}`);
}
const csv = await dataResponse.text();

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

const table = csv.trim().split(/\r?\n/).map(parseCsvLine);
const headers = table[0];
const expectedHeaders = ["Geolocation", "Species", ...requestedYears.flatMap((year) => quarterCodes.map((_, index) => `${year} Quarter ${index + 1}`))];
if (headers.join("|") !== expectedHeaders.join("|")) {
  throw new Error(`OpenSTAT returned unexpected columns: ${headers.join(" | ")}`);
}
const rows = table.slice(1);
const expectedRows = dimensions.Geolocation.values.length * dimensions.Species.values.length;
if (rows.length !== expectedRows || rows.some((row) => row.length !== headers.length)) {
  throw new Error(`Expected ${expectedRows} rows of ${headers.length} columns; received ${rows.length} rows.`);
}

const isNumber = (value) => value !== "" && value !== ".." && Number.isFinite(Number(value));
const leafGeographies = new Set(dimensions.Geolocation.valueTexts.filter((label) => label.startsWith("....")));
const periods = headers.slice(2).map((period, index) => {
  const column = index + 2;
  const leafRows = rows.filter((row) => leafGeographies.has(row[0]));
  const totalRows = leafRows.filter((row) => row[1] === "TOTAL");
  const nonNumericStatusCounts = leafRows.reduce((counts, row) => {
    const value = row[column];
    if (value !== "" && !isNumber(value)) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
  return {
    period,
    leafGeographicRows: leafGeographies.size,
    availableCells: leafRows.filter((row) => isNumber(row[column])).length,
    unavailableCells: leafRows.filter((row) => row[column] === "..").length,
    blankCells: leafRows.filter((row) => row[column] === "").length,
    nonNumericStatusCounts,
    numericTotalRows: totalRows.filter((row) => isNumber(row[column])).length,
    numericLeafCategoryCells: leafRows.filter((row) => row[1].startsWith("....") && isNumber(row[column])).length,
    literalZeroDotZeroCells: leafRows.filter((row) => row[column] === "0.00").length,
  };
});

const yearLabel = requestedYears.join("-");
const rawPath = resolve(`data/research/philippines/raw/national-qifs-${yearLabel}-quarterly-openstat.csv`);
const queryPath = rawPath.replace(/\.csv$/, ".query.json");
const querySha256 = createHash("sha256").update(queryText, "utf8").digest("hex");
const responseSha256 = createHash("sha256").update(csv, "utf8").digest("hex");
const queryRecord = {
  endpoint: apiUrl,
  requestedYears,
  geolocationDimensionCount: dimensions.Geolocation.values.length,
  speciesDimensionCount: dimensions.Species.values.length,
  quarterDimensionCount: quarterCodes.length,
  selectedCells,
  maxCells,
  query,
  querySha256,
  responseSha256,
};
await mkdir(dirname(rawPath), { recursive: true });
await writeFile(rawPath, csv, "utf8");
await writeFile(queryPath, `${JSON.stringify(queryRecord, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  status: "saved-official-openstat-export",
  rawPath,
  queryPath,
  requestedYears,
  selectedCells,
  responseRows: rows.length,
  responseBytes: Buffer.byteLength(csv),
  querySha256,
  responseSha256,
  periods,
}, null, 2));
