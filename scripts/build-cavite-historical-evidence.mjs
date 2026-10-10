import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./lib/csv.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const shortlistFile = "data/research/obis/cavite/cavite-obis-cc0-fish-shortlist.csv";
const dataDir = "data/research/obis/cavite";
const cc0 = "https://creativecommons.org/publicdomain/zero/1.0/";
const datasetId = "d6af0fac-8a21-4d77-8872-f10d471fc0cf";
const rejectedId = "urn:catalog:CAS:SU(ICH):51590";
const localityGroups = new Map([
  ["Limbones Cove historical lead; approximate area only", "limbones-cove"],
  ["Cavite/Manila Bay historical lead; approximate area only", "cavite-manila-bay"],
  ["Exclude from Cavite-specific evidence", null],
]);
function required(value, label) {
  if (typeof value !== "string" || !value.trim() || value !== value.trim())
    throw new Error(`Missing or invalid ${label}.`);
  return value;
}
function uniqueRows(rows, key, label) {
  const result = new Map();
  for (const row of rows) {
    const id = required(row[key], label);
    if (result.has(id)) throw new Error(`Duplicate ${label}: ${id}.`);
    result.set(id, row);
  }
  return result;
}
function sourceUrl(value, host, pathname, label) {
  let url;
  try {
    url = new URL(required(value, label));
  } catch {
    throw new Error(`Missing or invalid ${label}.`);
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== host ||
    url.port ||
    url.username ||
    url.password ||
    url.pathname !== pathname ||
    url.hash
  ) {
    throw new Error(`Invalid ${label}: expected the primary source URL.`);
  }
  return url;
}
function collectedOn(row) {
  const value = row.event_date;
  const year = row.year;
  if (typeof value !== "string" || typeof year !== "string") throw new Error("Collection date columns are missing.");
  if (year && !/^[1-9]\d{3}$/.test(year)) throw new Error(`Invalid collection year: ${row.occurrence_id}.`);
  if (!value) return null;
  const match = /^([1-9]\d{3})-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/.exec(value);
  if (!match || (year && year !== match[1]))
    throw new Error(`Invalid collection date or year agreement: ${row.occurrence_id}.`);
  if (match[3]) {
    const date = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value)
      throw new Error(`Invalid collection date: ${row.occurrence_id}.`);
  }
  return value;
}
export function buildHistoricalEvidence({ shortlistCsv, crosswalkCsv, licenseReviewCsv, licenseReviewNotes }) {
  const shortlist = parseCsv(shortlistCsv.toString("utf8"));
  if (!shortlist.length) throw new Error("The historical shortlist is empty.");
  uniqueRows(shortlist, "occurrence_id", "occurrence ID");
  const crosswalk = uniqueRows(parseCsv(crosswalkCsv.toString("utf8")), "obis_species_name", "taxonomy name");
  const licenses = uniqueRows(parseCsv(licenseReviewCsv.toString("utf8")), "dataset_id", "dataset ID");
  const dataset = licenses.get(datasetId);
  if (dataset?.dataset_metadata_license !== "CC0 1.0" || dataset.citation_status !== "available")
    throw new Error("The reviewed CAS dataset license or citation gate failed.");
  required(dataset.dataset_title, "dataset title");
  required(dataset.dataset_citation, "dataset citation");
  if (!/https?:\/\/\S+/.test(dataset.dataset_citation)) throw new Error("Dataset citation URL is missing.");
  const metadataUrl = sourceUrl(
    dataset.source_api_url,
    "api.obis.org",
    `/v3/dataset/${datasetId}`,
    "dataset metadata URL",
  );
  if (metadataUrl.search) throw new Error("Invalid dataset metadata URL.");
  const reviewDate = /metadata and per-record license fields were checked on (\d{4}-\d{2}-\d{2})/.exec(
    licenseReviewNotes.toString("utf8"),
  )?.[1];
  if (!reviewDate || new Date(`${reviewDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== reviewDate)
    throw new Error("The documented license review date is missing or invalid.");
  let excludedCount = 0;
  const taxonomyReviewDates = new Set();
  const records = shortlist.flatMap((row) => {
    const id = row.occurrence_id;
    if (
      row.dataset_id !== datasetId ||
      row.record_license !== cc0 ||
      row.dataset_metadata_license !== "CC0 1.0" ||
      row.dataset_title !== dataset.dataset_title ||
      row.dataset_citation !== dataset.dataset_citation
    )
      throw new Error(`License or dataset provenance gate failed: ${id}.`);
    if (row.basis_of_record !== "PreservedSpecimen") throw new Error(`Museum specimen gate failed: ${id}.`);
    const datasetUrl = sourceUrl(row.obis_dataset_url, "obis.org", `/dataset/${datasetId}`, "OBIS dataset URL");
    if (datasetUrl.search) throw new Error(`Invalid OBIS dataset URL: ${id}.`);
    const occurrencePath =
      /^https:\/\/obis\.org(\/occurrence\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/.exec(
        required(row.obis_record_url, "OBIS record URL"),
      )?.[1];
    if (!occurrencePath) throw new Error(`Invalid OBIS record URL: ${id}.`);
    sourceUrl(row.obis_record_url, "obis.org", occurrencePath, "OBIS record URL");
    const taxon = crosswalk.get(required(row.recorded_name, "recorded name"));
    if (
      !taxon ||
      !["accepted", "superseded combination"].includes(taxon.worms_status) ||
      row.accepted_name !== required(taxon.worms_accepted_name, "reviewed accepted name") ||
      row.aphia_id !== taxon.worms_accepted_aphia_id ||
      !/^[1-9]\d*$/.test(row.aphia_id) ||
      !/^[1-9]\d*$/.test(taxon.obis_aphia_id) ||
      row.taxon_status !== taxon.worms_status ||
      taxon.worms_scientific_name !== row.recorded_name ||
      taxon.worms_rank !== "Species" ||
      !["Teleostei", "Elasmobranchii"].includes(row.class) ||
      row.class !== taxon.obis_class ||
      row.class !== taxon.worms_class ||
      row.worms_record_url !== taxon.worms_record_url ||
      (taxon.worms_status === "accepted" && taxon.obis_aphia_id !== row.aphia_id) ||
      (taxon.worms_status === "superseded combination" && taxon.obis_aphia_id === row.aphia_id)
    )
      throw new Error(`Reviewed taxonomy gate failed: ${id}.`);
    const taxonomyUrl = sourceUrl(row.worms_record_url, "www.marinespecies.org", "/aphia.php", "WoRMS name-review URL");
    if (
      taxonomyUrl.searchParams.size !== 2 ||
      taxonomyUrl.searchParams.get("p") !== "taxdetails" ||
      taxonomyUrl.searchParams.get("id") !== taxon.obis_aphia_id
    )
      throw new Error(`WoRMS name-review URL has the wrong original Aphia ID: ${id}.`);
    const reviewedAt = required(taxon.queried_at_utc, "taxonomy review timestamp");
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(reviewedAt) ||
      !Number.isFinite(Date.parse(reviewedAt)) ||
      new Date(reviewedAt).toISOString() !== reviewedAt
    )
      throw new Error(`Invalid taxonomy review timestamp: ${id}.`);
    taxonomyReviewDates.add(reviewedAt);
    const date = collectedOn(row);
    required(row.reported_locality, "reported locality");
    required(row.source_georeference_remarks, "georeference remarks");
    required(row.coordinate_uncertainty_m, "coordinate uncertainty");
    const uncertainty = Number(row.coordinate_uncertainty_m);
    if (!Number.isFinite(uncertainty) || uncertainty < 0) throw new Error(`Invalid coordinate uncertainty: ${id}.`);
    if (!localityGroups.has(row.locality_screen_status)) throw new Error(`Unreviewed locality status: ${id}.`);
    const localityGroup = localityGroups.get(row.locality_screen_status);
    if (localityGroup === null) {
      if (id !== rejectedId || row.recorded_name !== "Bovichtus variegatus")
        throw new Error(`Unexpected rejected locality record: ${id}.`);
      excludedCount += 1;
      return [];
    }
    if (id === rejectedId) throw new Error("The rejected Bovichtus locality must remain excluded.");
    return [
      {
        id,
        recordedName: row.recorded_name,
        acceptedName: row.accepted_name,
        collectedOn: date,
        localityGroup,
        reportedLocality: row.reported_locality,
        georeferenceRemarks: row.source_georeference_remarks,
        coordinateUncertaintyM: uncertainty,
        sourceUrl: row.obis_record_url,
        taxonomyUrl: row.worms_record_url,
        taxonStatus: row.taxon_status,
        acceptedTaxonId: row.aphia_id,
      },
    ];
  });
  if (!records.length || taxonomyReviewDates.size !== 1)
    throw new Error("No publishable records or inconsistent taxonomy review timestamps.");
  return {
    schemaVersion: 1,
    snapshot: {
      shortlistFile,
      sha256: createHash("sha256").update(shortlistCsv).digest("hex"),
      taxonomyReviewedAt: [...taxonomyReviewDates][0],
      licenseReviewedAt: reviewDate,
    },
    dataset: {
      title: dataset.dataset_title,
      url: `https://obis.org/dataset/${datasetId}`,
      citation: dataset.dataset_citation,
      license: "CC0 1.0",
      licenseUrl: cc0,
    },
    excludedCount,
    records,
  };
}
export async function readHistoricalEvidenceInputs(root = projectRoot) {
  const [shortlistCsv, crosswalkCsv, licenseReviewCsv, licenseReviewNotes] = await Promise.all([
    readFile(path.join(root, shortlistFile)),
    readFile(path.join(root, dataDir, "cavite-obis-worms-crosswalk.csv")),
    readFile(path.join(root, dataDir, "cavite-obis-dataset-license-review.csv")),
    readFile(path.join(root, dataDir, "cavite-obis-validation-notes.md")),
  ]);
  return { shortlistCsv, crosswalkCsv, licenseReviewCsv, licenseReviewNotes };
}
export function historicalEvidenceJson(evidence) {
  return `${JSON.stringify(evidence, null, 2)}\n`;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const evidence = buildHistoricalEvidence(await readHistoricalEvidenceInputs());
  await writeFile(path.join(projectRoot, "src/data/cavite-historical-evidence.json"), historicalEvidenceJson(evidence));
  console.log(
    `Saved ${evidence.records.length} historical museum records; excluded ${evidence.excludedCount} locality record.`,
  );
}
