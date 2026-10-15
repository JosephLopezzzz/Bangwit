import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./lib/csv.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(projectRoot, "data/research/obis/cavite");
const outputPath = path.join(dataDir, "cavite-obis-fish-candidate-review.csv");
const columns = [
  "candidate_species_name",
  "source_or_shortlist_name",
  "occurrence_id",
  "dataset_id",
  "dataset_title",
  "record_license",
  "dataset_license",
  "locality_review_status",
  "locality_review_reason",
  "curator_review_status",
  "curator_reviewed_on",
  "curator_review_reason",
  "curator_review_source_url",
  "decision",
  "decision_reason",
];
const curatorReviewStatuses = new Set(["hold", "exclude-record"]);

function csvValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function csvDocument(rows) {
  return `${[columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((row) => row.map(csvValue).join(","))
    .join("\n")}\n`;
}

function uniqueBy(rows, key, label) {
  const result = new Map();
  for (const row of rows) {
    const value = row[key];
    if (!value || result.has(value)) throw new Error(`Missing or duplicate ${label}: ${value ?? ""}`);
    result.set(value, row);
  }
  return result;
}

function splitList(value) {
  return value.split(/\s*\|\s*/).filter(Boolean);
}

export function buildCandidateReview({
  candidateCsv,
  occurrenceCsv,
  localityCsv,
  shortlistCsv,
  licenseCsv,
  curatorReviewCsv,
  evidenceJson,
}) {
  const candidates = parseCsv(candidateCsv.toString("utf8"));
  const occurrences = parseCsv(occurrenceCsv.toString("utf8"));
  const localities = parseCsv(localityCsv.toString("utf8"));
  const shortlist = parseCsv(shortlistCsv.toString("utf8"));
  const licenses = parseCsv(licenseCsv.toString("utf8"));
  const curatorReviews = parseCsv(curatorReviewCsv.toString("utf8"));
  const evidence = JSON.parse(evidenceJson.toString("utf8"));
  const occurrenceById = uniqueBy(occurrences, "id", "source occurrence ID");
  const localityById = uniqueBy(localities, "id", "locality review occurrence ID");
  const shortlistById = uniqueBy(
    shortlist.map((row) => ({ ...row, obis_id: row.obis_record_url.split("/").at(-1) })),
    "obis_id",
    "shortlist OBIS occurrence ID",
  );
  const licenseById = uniqueBy(licenses, "dataset_id", "dataset ID");
  const curatorReviewById = uniqueBy(curatorReviews, "occurrence_id", "curator review occurrence ID");
  const publishedIds = new Set(evidence.records.map((record) => record.sourceUrl.split("/").at(-1)));
  const candidateNames = new Set();
  const candidateOccurrenceIds = new Set();
  const matchedCuratorReviewIds = new Set();
  const rows = [];

  for (const candidate of candidates) {
    const name = candidate.species_name?.trim();
    if (!name || candidateNames.has(name)) throw new Error(`Missing or duplicate candidate species: ${name ?? ""}`);
    candidateNames.add(name);
    const ids = splitList(candidate.occurrence_ids);
    if (!ids.length) throw new Error(`Candidate has no linked occurrence IDs: ${name}`);

    for (const id of ids) {
      if (candidateOccurrenceIds.has(id)) throw new Error(`Candidate occurrence linked more than once: ${id}`);
      candidateOccurrenceIds.add(id);
      const occurrence = occurrenceById.get(id);
      if (!occurrence) throw new Error(`Linked occurrence is missing from the source export: ${id}`);
      const locality = localityById.get(id);
      const shortlistRecord = shortlistById.get(id);
      const license = licenseById.get(occurrence.dataset_id);
      const curatorReview = curatorReviewById.get(id);
      if (!license) throw new Error(`Dataset license review is missing: ${occurrence.dataset_id}`);

      if (curatorReview) {
        const reviewedOn = curatorReview.reviewed_on;
        const reviewedDate = new Date(`${reviewedOn}T00:00:00Z`);
        if (curatorReview.candidate_species_name !== name || curatorReview.dataset_id !== occurrence.dataset_id) {
          throw new Error(`Curator review does not match its linked candidate occurrence: ${id}`);
        }
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(reviewedOn) ||
          Number.isNaN(reviewedDate.getTime()) ||
          reviewedDate.toISOString().slice(0, 10) !== reviewedOn
        ) {
          throw new Error(`Invalid curator review date for occurrence: ${id}`);
        }
        if (!curatorReviewStatuses.has(curatorReview.review_status)) {
          throw new Error(`Invalid curator review status for occurrence: ${id}`);
        }
        if (!curatorReview.review_reason?.trim()) throw new Error(`Curator review reason is missing: ${id}`);
        try {
          if (new URL(curatorReview.source_metadata_url).protocol !== "https:") throw new Error("Not HTTPS");
        } catch {
          throw new Error(`Curator review source URL is invalid: ${id}`);
        }
        if (publishedIds.has(id)) throw new Error(`Published occurrence cannot have a pending curator review: ${id}`);
        matchedCuratorReviewIds.add(id);
      }

      let decision;
      let decisionReason;
      if (publishedIds.has(id)) {
        decision = "published";
        decisionReason =
          "Included in the current reviewed CAS Ichthyology CC0 projection. This remains broad historical locality evidence, not proof of current presence, catchability, permission or a fishing spot.";
      } else if (shortlistRecord?.locality_screen_status === "Exclude from Cavite-specific evidence") {
        decision = "excluded-record";
        decisionReason =
          "This occurrence remains explicitly excluded because its source locality is generic and the reported coordinate uncertainty covers a very broad area. This decision does not exclude the taxon from all locations.";
      } else if (curatorReview?.review_status === "exclude-record") {
        decision = "excluded-record";
        decisionReason = `Curator review on ${curatorReview.reviewed_on}: ${curatorReview.review_reason} This excludes this occurrence only, not the taxon from all locations.`;
      } else {
        decision = "pending-review";
        const localityReason = locality
          ? `${locality.triage_status}: ${locality.triage_reason}`
          : "No individual locality review is recorded for this occurrence.";
        const rightsReason = license.review_action || "Record-level reuse terms still require review.";
        const curatorReason =
          curatorReview?.review_status === "hold"
            ? `Curator review on ${curatorReview.reviewed_on}: hold. ${curatorReview.review_reason} `
            : "";
        decisionReason = `${curatorReason}${localityReason} ${rightsReason} This row is not in the reviewed publication shortlist; taxonomy and record-level locality must also be checked before publication.`;
      }

      rows.push({
        candidate_species_name: name,
        source_or_shortlist_name: shortlistRecord?.accepted_name || occurrence.scientificName || name,
        occurrence_id: id,
        dataset_id: occurrence.dataset_id,
        dataset_title: license.dataset_title,
        record_license: occurrence.license,
        dataset_license: license.dataset_metadata_license,
        locality_review_status:
          locality?.triage_status || shortlistRecord?.locality_screen_status || "Not individually reviewed",
        locality_review_reason:
          locality?.triage_reason ||
          shortlistRecord?.locality_screen_reason ||
          "No record-level locality decision is present in the review files.",
        curator_review_status: curatorReview?.review_status || "not-reviewed",
        curator_reviewed_on: curatorReview?.reviewed_on || "",
        curator_review_reason: curatorReview?.review_reason || "",
        curator_review_source_url: curatorReview?.source_metadata_url || "",
        decision,
        decision_reason: decisionReason,
      });
    }
  }

  if (candidates.length !== 27)
    throw new Error(`Expected the reviewed finite queue of 27 candidates; found ${candidates.length}.`);
  if (candidateOccurrenceIds.size !== 52)
    throw new Error(`Expected 52 linked occurrence records; found ${candidateOccurrenceIds.size}.`);
  if (matchedCuratorReviewIds.size !== curatorReviewById.size) {
    const unmatchedId = [...curatorReviewById.keys()].find((id) => !matchedCuratorReviewIds.has(id));
    throw new Error(`Curator review references an occurrence outside the fish candidate queue: ${unmatchedId}`);
  }
  return { rows, csv: csvDocument(rows) };
}

export async function readCandidateReviewInputs(root = projectRoot) {
  const paths = {
    candidateCsv: path.join(dataDir, "cavite-obis-fish-candidates.csv"),
    occurrenceCsv: path.join(dataDir, "cavite-obis-occurrences.csv"),
    localityCsv: path.join(dataDir, "cavite-obis-location-review.csv"),
    shortlistCsv: path.join(dataDir, "cavite-obis-cc0-fish-shortlist.csv"),
    licenseCsv: path.join(dataDir, "cavite-obis-dataset-license-review.csv"),
    curatorReviewCsv: path.join(dataDir, "cavite-obis-curator-review.csv"),
    evidenceJson: path.join(root, "src/data/cavite-historical-evidence.json"),
  };
  const entries = await Promise.all(
    Object.entries(paths).map(async ([key, filePath]) => [key, await readFile(filePath)]),
  );
  return Object.fromEntries(entries);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildCandidateReview(await readCandidateReviewInputs());
  await writeFile(outputPath, result.csv);
  const counts = Object.groupBy(result.rows, (row) => row.decision);
  console.log(
    `Reviewed ${new Set(result.rows.map((row) => row.candidate_species_name)).size} candidate names / ${result.rows.length} linked records: ${counts.published?.length ?? 0} published, ${counts["excluded-record"]?.length ?? 0} excluded record, ${counts["pending-review"]?.length ?? 0} pending.`,
  );
}
