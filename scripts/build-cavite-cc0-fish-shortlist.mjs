import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./lib/csv.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(projectRoot, "data", "research", "obis", "cavite");
const cc0 = "https://creativecommons.org/publicdomain/zero/1.0/";

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function localityReview(record) {
  if (!record.coordinateUncertaintyInMeters?.trim()) {
    return "Coordinate uncertainty is missing; locality needs manual review.";
  }
  const uncertainty = Number(record.coordinateUncertaintyInMeters);
  if (!Number.isFinite(uncertainty)) return "Coordinate uncertainty is missing; locality needs manual review.";
  if (uncertainty >= 100_000) {
    return "Do not use as localized Cavite evidence until the original locality/georeference is resolved; uncertainty exceeds 100 km.";
  }
  if (uncertainty > 10_000) {
    return "Broad-area lead only; source locality/province and the Cavite water boundary still need verification.";
  }
  return "Coordinate uncertainty is at most 10 km; verify the source locality and municipal-water boundary before local display.";
}

function localityScreen(record) {
  const uncertainty = Number(record.coordinateUncertaintyInMeters);
  const sourceText = `${record.stateProvince} ${record.locality} ${record.georeferenceRemarks}`;

  if (/error expanded to covers the rest of philippines/i.test(record.georeferenceRemarks || "")) {
    return {
      status: "Exclude from Cavite-specific evidence",
      reason: "The source locality is generic and the georeference remarks say the error was expanded to cover the rest of the Philippines.",
      mapRecommendation: "Do not map or count as Cavite-specific evidence unless the source locality is corrected.",
    };
  }

  if (/limbones cove/i.test(sourceText) && /center of polygon/i.test(record.georeferenceRemarks || "")) {
    return {
      status: "Limbones Cove historical lead; approximate area only",
      reason: "The locality names Limbones Cove, but OBIS says the coordinates were placed at the center of a polygon; the point is not an exact collection spot.",
      mapRecommendation: "Keep only as a broad historical cove-area lead; do not display as a fishing spot or precise point.",
    };
  }

  if (/cavite|manila bay/i.test(sourceText) && uncertainty > 10_000) {
    return {
      status: "Cavite/Manila Bay historical lead; approximate area only",
      reason: "The source locality or georeference remarks name Cavite/Manila Bay, but the reported coordinate uncertainty exceeds 10 km.",
      mapRecommendation: "Keep only at broad coastal-area scale; do not display as a fishing spot or precise point.",
    };
  }

  return {
    status: "Manual locality review required",
    reason: "The source locality and georeference remarks do not establish a reliable Cavite-specific location.",
    mapRecommendation: "Do not display as a Cavite-specific point until the locality is reviewed.",
  };
}

const [occurrenceText, crosswalkText, licenseReviewText] = await Promise.all([
  readFile(path.join(dataDir, "cavite-obis-occurrences.csv"), "utf8"),
  readFile(path.join(dataDir, "cavite-obis-worms-crosswalk.csv"), "utf8"),
  readFile(path.join(dataDir, "cavite-obis-dataset-license-review.csv"), "utf8"),
]);

const occurrences = parseCsv(occurrenceText);
const crosswalk = new Map(parseCsv(crosswalkText).map((row) => [row.obis_species_name, row]));
const licenseReview = new Map(parseCsv(licenseReviewText).map((row) => [row.dataset_id, row]));

const shortlist = occurrences
  .filter((record) => {
    const dataset = licenseReview.get(record.dataset_id);
    return (
      ["Teleostei", "Elasmobranchii"].includes(record.class) &&
      record.taxonRank === "species" &&
      record.license === cc0 &&
      dataset?.dataset_metadata_license === "CC0 1.0"
    );
  })
  .map((record) => {
    const taxon = crosswalk.get(record.species);
    const dataset = licenseReview.get(record.dataset_id);
    const locality = localityScreen(record);
    return {
      recorded_name: record.scientificName,
      accepted_name: taxon?.worms_accepted_name || record.scientificName,
      aphia_id: taxon?.worms_accepted_aphia_id || record.aphiaID,
      taxon_status: taxon?.worms_status || "Needs taxonomic review",
      class: record.class,
      event_date: record.eventDate,
      year: record.year,
      reported_province: record.stateProvince,
      reported_locality: record.locality,
      latitude: record.decimalLatitude,
      longitude: record.decimalLongitude,
      coordinate_uncertainty_m: record.coordinateUncertaintyInMeters,
      locality_review: localityReview(record),
      source_georeference_remarks: record.georeferenceRemarks,
      obis_shoredistance_m: record.shoredistance,
      obis_quality_flags: record.flags,
      locality_screen_status: locality.status,
      locality_screen_reason: locality.reason,
      map_use_recommendation: locality.mapRecommendation,
      boundary_verification_status: "Not completed: a suitable authoritative Cavite fishing-water boundary geometry is not included in this project.",
      basis_of_record: record.basisOfRecord,
      occurrence_id: record.occurrenceID,
      obis_record_url: `https://obis.org/occurrence/${record.id}`,
      dataset_title: dataset.dataset_title,
      dataset_id: record.dataset_id,
      obis_dataset_url: `https://obis.org/dataset/${record.dataset_id}`,
      dataset_citation: dataset.dataset_citation,
      record_license: record.license,
      dataset_metadata_license: dataset.dataset_metadata_license,
      worms_record_url: taxon?.worms_record_url || "",
      evidence_status: "Historical museum specimen record; current local presence is not established.",
      catchability_status: "Not assessed; do not present as catch advice.",
      app_use_status: "Research only; locality and applicable rules remain unverified.",
    };
  })
  .sort((a, b) => a.accepted_name.localeCompare(b.accepted_name));

if (!shortlist.length) throw new Error("No records passed the CC0 fish/species-level filter.");
for (const record of shortlist) {
  if (record.record_license !== cc0 || record.dataset_metadata_license !== "CC0 1.0") {
    throw new Error(`License gate failed for ${record.occurrence_id}.`);
  }
  if (!record.occurrence_id || !record.obis_record_url || !record.dataset_citation) {
    throw new Error(`Required provenance is missing for ${record.occurrence_id || record.recorded_name}.`);
  }
}

const headers = Object.keys(shortlist[0]);
const outputPath = path.join(dataDir, "cavite-obis-cc0-fish-shortlist.csv");
const csv = [headers, ...shortlist.map((record) => headers.map((header) => record[header]))]
  .map((row) => row.map(csvCell).join(","))
  .join("\n");

await writeFile(outputPath, `${csv}\n`, "utf8");
const species = new Set(shortlist.map((record) => record.accepted_name));
const uncertaintyOver10km = shortlist.filter((record) => Number(record.coordinate_uncertainty_m) > 10_000).length;
const uncertaintyOver100km = shortlist.filter((record) => Number(record.coordinate_uncertainty_m) >= 100_000).length;
console.log(
  `CC0 fish specimen rows: ${shortlist.length}; accepted names: ${species.size}; over 10 km uncertainty: ${uncertaintyOver10km}; over 100 km: ${uncertaintyOver100km}.`,
);
console.log(`Saved ${path.relative(projectRoot, outputPath)}.`);
