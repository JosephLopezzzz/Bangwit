import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const gbifSnapshot = new URL(
  "data/research/philippines/raw/central-luzon-bataan-georeferenced-fish-screen-20261127/occurrence-search.json",
  root,
);
const reviewId = "central-luzon-bataan-inaturalist-metadata-followup-20261128";
const reviewFile = new URL(`data/research/philippines/national/reviews/${reviewId}.json`, root);
const apiBase = "https://api.inaturalist.org/v1";
const datasetKey = "50c9509d-22c7-4a22-a47d-8c48425ef4a7";
const waterbodyTerms = /\b(river|creek|stream|lake|reservoir|dam|bay|estuary|wetland|marsh|canal)\b/i;
const recognizedNames = /\b(angat|marilao|meycauayan|obando|pampanga|salapangan|conlong|angabang|pulo|taliptip)\b/i;
const hash = (value) => createHash("sha256").update(value).digest("hex");

function countBy(values) {
  return Object.fromEntries(
    [...values.reduce((counts, value) => counts.set(value, (counts.get(value) ?? 0) + 1), new Map())]
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

function classifyPlaceGuess(value) {
  if (typeof value !== "string" || !value.trim()) return "missing";
  if (waterbodyTerms.test(value)) return "contains-waterbody-type-word";
  if (recognizedNames.test(value)) return "contains-known-central-luzon-hydronym-token";
  if (/\b(bataan|balanga|abucay|bagac|dinalupihan|hermosa|limay|mariveles|morong|orani|samal)\b/i.test(value)) {
    return "administrative-locality-text-only";
  }
  return "other-or-country-level-text";
}

async function main() {
  const gbif = JSON.parse(await readFile(gbifSnapshot, "utf8"));
  const gbifRows = gbif.results.filter((row) => row.datasetKey === datasetKey);
  const ids = gbifRows
    .map((row) => row.occurrenceID?.match(/inaturalist\.org\/observations\/(\d+)/)?.[1])
    .filter(Boolean);
  const uniqueIds = [...new Set(ids)].sort((a, b) => Number(a) - Number(b));
  if (gbifRows.length !== 54 || uniqueIds.length !== 54 || ids.length !== gbifRows.length) {
    throw new Error("The retained GBIF snapshot no longer contains the expected 54 unique iNaturalist links.");
  }

  const url = new URL(`${apiBase}/observations`);
  url.searchParams.set("id", uniqueIds.join(","));
  url.searchParams.set("per_page", "200");
  url.searchParams.set("locale", "en");
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public iNaturalist metadata review)" },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`iNaturalist API returned HTTP ${response.status}.`);

  // The v1 observations endpoint returns broad records that include location fields.
  // Parse only the needed metadata in memory and deliberately do not persist the response.
  const responseBytes = Buffer.from(await response.arrayBuffer());
  const data = JSON.parse(responseBytes.toString("utf8"));
  const results = Array.isArray(data.results) ? data.results : [];
  const resultIds = new Set(results.map((row) => String(row.id)));
  const missingIds = uniqueIds.filter((id) => !resultIds.has(id));
  const unexpectedIds = results.filter((row) => !new Set(uniqueIds).has(String(row.id))).length;
  const placeClasses = results.map((row) => {
    if ([row.geoprivacy, row.taxon_geoprivacy].some((value) => value === "obscured" || value === "private")) {
      return "withheld-by-geoprivacy";
    }
    return classifyPlaceGuess(row.place_guess);
  });
  const observationLicenses = results.map((row) => row.license_code ?? "unspecified");
  const photoLicenses = results.flatMap((row) => (row.photos ?? []).map((photo) => photo.license_code ?? "unspecified"));
  const output = {
    schemaVersion: 1,
    reviewId,
    reviewedOn: "2026-11-28",
    phaseId: "L3",
    regionId: "0300000000",
    regionName: "Region III (Central Luzon)",
    provinceTextScope: "Bataan; record IDs discovered through a GBIF stateProvince text filter",
    status: "inaturalist-public-metadata-followup;location-payload-not-retained;research-only",
    question: "Does direct public iNaturalist metadata for the 54 GBIF-linked Bataan candidates add a trustworthy named-waterbody fish record or clear photo-reuse candidate?",
    sourceIds: [
      "gbif-occurrence-downloads",
      "inaturalist-bataan-observation-metadata-followup-20261128",
    ],
    source: {
      endpoint: `${apiBase}/observations`,
      query: {
        gbifDatasetKey: datasetKey,
        linkedCandidateCount: uniqueIds.length,
        linkedCandidateSetSha256: hash(uniqueIds.join("\n")),
        filters: { idSet: "54 GBIF occurrenceID links from the ignored snapshot", perPage: 200, locale: "en" },
        queryUrlPersisted: false,
      },
      response: {
        httpStatus: response.status,
        authenticated: false,
        bytes: responseBytes.length,
        sha256: hash(responseBytes),
        rows: results.length,
        matchedCandidateIds: uniqueIds.length - missingIds.length,
        missingCandidateIds: missingIds.length,
        unexpectedRows: unexpectedIds,
        rawResponseSaved: false,
        reason: "The public v1 API response includes location fields. The script reads only metadata fields needed for aggregate counts, never accesses coordinate properties, and processes the response in memory; no response body, observation IDs, coordinates, localities, usernames, photo URLs, or media files were persisted.",
      },
      privacyReferences: [
        "https://help.inaturalist.org/en/support/solutions/articles/151000169938-what-is-geoprivacy-what-does-it-mean-for-an-observation-to-be-obscured-",
        "https://help.inaturalist.org/en/support/solutions/articles/151000175695",
      ],
    },
    result: {
      qualityGrade: countBy(results.map((row) => row.quality_grade ?? "unspecified")),
      captiveFlag: countBy(results.map((row) => row.captive === true ? "true" : row.captive === false ? "false" : "unspecified")),
      observationGeoprivacy: countBy(results.map((row) => row.geoprivacy ?? "open-or-unspecified")),
      taxonGeoprivacy: countBy(results.map((row) => row.taxon_geoprivacy ?? "open-or-unspecified")),
      placeGuessOrPrivacyDisposition: countBy(placeClasses),
      placeGuessFieldsNotReviewedDueToGeoprivacy: placeClasses.filter((value) => value === "withheld-by-geoprivacy").length,
      placeGuessWithWaterbodyTypeWord: placeClasses.filter((value) => value === "contains-waterbody-type-word").length,
      placeGuessWithRecognizedHydronymToken: placeClasses.filter((value) => value === "contains-known-central-luzon-hydronym-token").length,
      observationLicenseCodes: countBy(observationLicenses),
      recordsWithPhotos: results.filter((row) => (row.photos ?? []).length > 0).length,
      photoCount: photoLicenses.length,
      photoLicenseCodes: countBy(photoLicenses),
      photoFilesDownloadedOrViewed: 0,
    },
    interpretation: {
      namedWaterbodyAssignmentsValidated: 0,
      taxonIdentitiesIndependentlyValidated: 0,
      speciesAssertionsAdded: 0,
      occurrenceRowsAdded: 0,
      geometryAdded: false,
      publicAppRowsAdded: 0,
      decision: "This item-level metadata follow-up is a bounded candidate screen only. Public place guesses and platform Research Grade labels do not verify a named capture waterbody, taxonomic identification, or wild occurrence. Do not infer hidden locations from public coordinates, photos, dates, usernames, or neighboring observations. Observation-data and photo licenses are separate; any later reuse needs per-record and per-photo review. No image or coordinate was admitted.",
    },
    limitations: [
      "The 54 candidate IDs were linked from a GBIF stateProvince text-filter result; that filter is not a verified provincial polygon.",
      "The public API response was not retained because it includes location fields; aggregate results cannot support later item-by-item reproduction without the ignored GBIF snapshot and a fresh API request.",
      "Place guesses were reduced to broad text categories and are not proof of a collection station or fish habitat.",
      "Obscured or private locations were not inferred or reconstructed; public map points may be generalized.",
      "Research Grade and captive=false are platform metadata, not independent taxonomic or wild-capture verification.",
      "Observation-data licenses do not automatically license every associated photo; photo rights were counted by license code but no photo was inspected or reused.",
    ],
    nextStep: "Continue Bataan waterbody source discovery with dated, locality-resolved surveys or vouchers. This metadata-only screen does not assign any observation to a named waterbody or independently verify its taxon. If an individual iNaturalist record is later considered, review only public evidence, respect geoprivacy, and assess the observation and each media license separately; do not infer obscured locations or treat this screen as a fish checklist.",
  };

  if (missingIds.length || unexpectedIds) {
    output.status = "inaturalist-public-metadata-followup-partial-response;location-payload-not-retained;research-only";
  }
  await writeFile(reviewFile, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({
    reviewFile: fileURLToPath(reviewFile),
    candidates: uniqueIds.length,
    matched: results.length - unexpectedIds,
    missing: missingIds.length,
    unexpected: unexpectedIds,
    placeGuessOrPrivacyDisposition: output.result.placeGuessOrPrivacyDisposition,
    geoprivacy: output.result.observationGeoprivacy,
    observationLicenses: output.result.observationLicenseCodes,
    photoLicenseCodes: output.result.photoLicenseCodes,
    photosDownloaded: 0,
    coordinatesOrRawResponseWritten: false,
  }, null, 2));
}

main().catch((error) => {
  console.error(`Bataan iNaturalist metadata follow-up failed: ${error.message}`);
  process.exitCode = 1;
});
