import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const checkedOn = "2026-11-25";
const reviewId = "central-luzon-candaba-inaturalist-fish-observation-screen-20261125";
const outputUrl = new URL(`data/research/philippines/national/reviews/${reviewId}.json`, root);
const rawDirectoryName = "central-luzon-candaba-inaturalist-screen-20261125";
const rawDirectory = new URL(`data/research/philippines/raw/${rawDirectoryName}/`, root);
const base = "https://api.inaturalist.org/v1";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function getJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (public iNaturalist API review)" },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  let json;
  try {
    json = JSON.parse(bytes.toString("utf8"));
  } catch {
    json = { error: bytes.toString("utf8") };
  }
  if (!response.ok) throw new Error(`iNaturalist ${response.status} at ${url}: ${json.error ?? response.statusText}`);
  return { response, bytes, json };
}

async function save(name, url) {
  const { response, bytes, json } = await getJson(url);
  const rawFile = `raw/${rawDirectoryName}/${name}.json`;
  await writeFile(new URL(`${name}.json`, rawDirectory), bytes);
  return {
    response,
    json,
    receipt: { requestUrl: url.toString(), httpStatus: response.status, responseBytes: bytes.length, responseSha256: sha256(bytes), rawFile },
  };
}

async function main() {
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const placeSearchUrl = new URL(`${base}/places/autocomplete`);
  placeSearchUrl.searchParams.set("q", "Candaba");
  placeSearchUrl.searchParams.set("per_page", "30");
  const placeSearch = await save("01-place-autocomplete", placeSearchUrl);
  const candidates = placeSearch.json.results?.filter((place) => place.name === "Candaba" && place.display_name?.includes(", PH")) ?? [];
  if (candidates.length !== 1) throw new Error(`Expected one exact Candaba place candidate in PH; found ${candidates.length}`);
  const place = candidates[0];
  await wait(250);

  const placeUrl = new URL(`${base}/places/${place.id}`);
  const placeDetail = await save("02-place-detail", placeUrl);
  const detailedPlace = placeDetail.json.results?.[0];
  if (!detailedPlace || detailedPlace.id !== place.id || detailedPlace.name !== "Candaba") {
    throw new Error("iNaturalist place detail did not match the exact Candaba place candidate");
  }
  await wait(250);

  const taxonUrl = new URL(`${base}/taxa/47178`);
  const taxonResponse = await save("03-actinopterygii-taxon", taxonUrl);
  const taxon = taxonResponse.json.results?.[0];
  if (!taxon || taxon.id !== 47178 || taxon.name !== "Actinopterygii") {
    throw new Error("iNaturalist taxon 47178 did not resolve to Actinopterygii");
  }
  await wait(250);

  const observationUrl = new URL(`${base}/observations`);
  observationUrl.searchParams.set("place_id", String(place.id));
  observationUrl.searchParams.set("taxon_id", String(taxon.id));
  observationUrl.searchParams.set("captive", "false");
  observationUrl.searchParams.set("per_page", "200");
  const observations = await save("04-wild-actinopterygii-observations", observationUrl);
  if (!Number.isInteger(observations.json.total_results) || !Array.isArray(observations.json.results)) {
    throw new Error("iNaturalist observations response did not include total_results and results");
  }

  const artifact = {
    schemaVersion: 1,
    reviewId,
    checkedOn,
    phaseId: "L3",
    regionId: "0300000000",
    regionName: "Region III (Central Luzon)",
    status: "bounded-inaturalist-public-place-and-fish-observation-screen-complete;not-absence-evidence",
    question: "Does iNaturalist currently index wild Actinopterygii observations in its Candaba place scope?",
    source: {
      provider: "iNaturalist",
      endpoint: `${base}/observations`,
      documentation: `${base}/docs/`,
      licensingGuidance: "https://help.inaturalist.org/en/support/solutions/articles/151000175695",
      note: "Observation data and each media item have separate licenses. No observation rows or photos were returned in this screen, so no row-level reuse decision applies.",
    },
    placeLookup: {
      query: "Candaba",
      exactNameMatchesInPhilippines: candidates.length,
      placeId: place.id,
      name: place.name,
      displayName: place.display_name,
      placeType: detailedPlace.place_type,
      adminLevel: detailedPlace.admin_level,
      ancestorPlaceIds: detailedPlace.ancestor_place_ids,
      geometryReturnedByProvider: Boolean(detailedPlace.geometry_geojson),
      geometryDisposition: "The provider returned a place polygon, but it is not independently validated as an official administrative boundary. The geometry was retained only in the ignored local response and was not copied to any public data or map.",
    },
    query: {
      requestUrl: observations.receipt.requestUrl,
      filters: { placeId: place.id, taxonId: taxon.id, taxonName: taxon.name, captive: false, perPage: 200 },
      taxonLabel: taxon.preferred_common_name ?? "Ray-finned Fishes",
      resultCount: observations.json.total_results,
      resultsReturned: observations.json.results.length,
      interpretation: "The place ID scopes the iNaturalist search only; it does not establish an official municipal extent or a species survey denominator. Research-grade status, if any future row is found, is platform metadata and not independent specimen verification.",
    },
    rawResponses: [placeSearch.receipt, placeDetail.receipt, taxonResponse.receipt, observations.receipt],
    interpretation: {
      observationRowsAdmitted: 0,
      speciesAssertionsAdded: 0,
      coordinatesPublished: 0,
      geometryAdded: false,
      publicProjection: false,
      zeroResultsAreAbsenceEvidence: false,
      disposition: "This single-platform place-and-taxon screen returned no wild ray-finned-fish observations. It does not establish species absence, survey absence, or the completeness of iNaturalist for Candaba. Continue using source-resolved historical survey, museum, and field records; do not treat the returned provider geometry as authoritative.",
    },
  };
  await writeFile(outputUrl, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`Candaba place: ${place.display_name} (iNaturalist place ${place.id})`);
  console.log(`Wild Actinopterygii observations: ${observations.json.total_results}; returned ${observations.json.results.length}.`);
  console.log(`Review: ${fileURLToPath(outputUrl)}`);
}

main().catch((error) => {
  console.error(`iNaturalist screen failed: ${error.message}`);
  process.exitCode = 1;
});
