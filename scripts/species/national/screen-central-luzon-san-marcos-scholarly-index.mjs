import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const reviewedOn = "2026-11-27";
const reviewId = "central-luzon-tarlac-san-marcos-scholarly-index-screen-20261127";
const reviewUrl = new URL(`data/research/philippines/national/reviews/${reviewId}.json`, root);
const rawDirectory = new URL(`data/research/philippines/raw/${reviewId}/`, root);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchJson(name, url, useSnapshots) {
  let response;
  let bytes;
  let status;
  let retryAfter;
  if (useSnapshots) {
    bytes = await readFile(new URL(`${name}.json`, rawDirectory));
    const metadata = JSON.parse(await readFile(new URL(`${name}.meta.json`, rawDirectory), "utf8"));
    status = metadata.status;
    retryAfter = metadata.retryAfter ?? null;
    response = { ok: status >= 200 && status < 300, status, statusText: metadata.statusText ?? "" };
  } else {
    response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "Bangwit-research/1.0 (bounded scholarly metadata screen)",
      },
      signal: AbortSignal.timeout(30000),
    });
    bytes = Buffer.from(await response.arrayBuffer());
    status = response.status;
    retryAfter = response.headers.get("retry-after");
  }
  await writeFile(new URL(`${name}.json`, rawDirectory), bytes);
  if (!useSnapshots) {
    await writeFile(new URL(`${name}.meta.json`, rawDirectory), `${JSON.stringify({ status, statusText: response.statusText, retryAfter, requestUrl: url.toString() }, null, 2)}\n`, "utf8");
  }
  let json;
  try {
    json = JSON.parse(bytes.toString("utf8"));
  } catch {
    json = { error: bytes.toString("utf8") };
  }
  return {
    response: useSnapshots ? response : { ok: response.ok, status, statusText: response.statusText },
    json,
    rawResponse: {
      path: `data/research/philippines/raw/${reviewId}/${name}.json`,
      bytes: bytes.length,
      sha256: sha256(bytes),
      retryAfter,
    },
  };
}

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) words[position] = word;
  }
  return words.filter(Boolean).join(" ");
}

function screen(records, getText, getSummary) {
  const text = (record) => getText(record).replace(/&amp;/g, "&");
  const localPattern = /\b(san\s+marcos|capas|tarlac|pinatubo|sta\.?\s+juliana|santa\s+juliana)\b/i;
  const exactNamePattern = /\b(?:san\s+marcos\s+lake|lake\s+san\s+marcos)\b/i;
  const fishPattern = /\b(fish|ichthy|actinopteryg|teleost|tilapia|carp)\b/i;
  const localMatches = records.filter((record) => localPattern.test(text(record)));
  const exactNameMatches = records.filter((record) => exactNamePattern.test(text(record)));
  const fishMatches = records.filter((record) => fishPattern.test(text(record)));
  return {
    count: records.length,
    localityTermMatchCount: localMatches.length,
    localityTermMatches: localMatches.slice(0, 25).map(getSummary),
    exactWaterbodyPhraseMatchCount: exactNameMatches.length,
    exactWaterbodyPhraseMatches: exactNameMatches.slice(0, 25).map(getSummary),
    fishTermMatchCount: fishMatches.length,
    fishTermMatches: fishMatches.slice(0, 25).map(getSummary),
  };
}

async function main() {
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const useSnapshots = process.argv.includes("--from-snapshots");

  const crossrefUrl = new URL("https://api.crossref.org/works");
  crossrefUrl.searchParams.set("query.bibliographic", '"San Marcos Lake" Capas Tarlac fish');
  crossrefUrl.searchParams.set("rows", "100");
  const crossref = await fetchJson("01-crossref-san-marcos-lake-capas-fish", crossrefUrl, useSnapshots);
  if (!useSnapshots) await wait(1000);

  const openAlexUrl = new URL("https://api.openalex.org/works");
  openAlexUrl.searchParams.set("search", "San Marcos Lake Tarlac");
  openAlexUrl.searchParams.set("per-page", "100");
  const openAlex = await fetchJson("02-openalex-san-marcos-lake-capas-fish", openAlexUrl, useSnapshots);

  const crossrefWorks = crossref.json.message?.items ?? [];
  const openAlexWorks = openAlex.json.results ?? [];
  const getCrossrefText = (record) => [record.title?.join(" "), record.abstract, record["container-title"]?.join(" ")].filter(Boolean).join(" ");
  const getOpenAlexText = (record) => [record.title, reconstructAbstract(record.abstract_inverted_index)].filter(Boolean).join(" ");
  const crossrefScreen = screen(
    crossrefWorks,
    getCrossrefText,
    (record) => ({ title: record.title?.[0] ?? null, year: record.issued?.["date-parts"]?.[0]?.[0] ?? null, doi: record.DOI ?? null }),
  );
  const openAlexScreen = screen(
    openAlexWorks,
    getOpenAlexText,
    (record) => ({ title: record.title ?? null, year: record.publication_year ?? null, doi: record.doi ?? null }),
  );
  const openAlexWorksSummary = openAlexWorks.map((record) => {
    const title = record.title ?? "";
    const summary = { title: title || null, year: record.publication_year ?? null, doi: record.doi ?? null };
    if (/fish|ichthy|actinopteryg|teleost/i.test(title)) {
      summary.screenDisposition = "fish-related title; exact waterbody and locality require full-source review";
    } else if (/aquatic|freshwater|lake|river|wetland|limnolog/i.test(title)) {
      summary.screenDisposition = "aquatic title; not a fish survey unless the source confirms taxa and site";
    } else {
      summary.screenDisposition = "title does not indicate a fish survey; not promoted as local fish evidence";
    }
    return summary;
  });

  const review = {
    schemaVersion: 1,
    reviewId,
    reviewedOn,
    phaseId: "L3",
    regionId: "0300000000",
    regionName: "Region III (Central Luzon)",
    provinceId: "0305700000",
    provinceName: "Tarlac",
    waterbodyNamesAsReported: ["San Marcos Lake", "Lake San Marcos"],
    status: `crossref-${crossref.response.ok ? "screen-completed" : `http-${crossref.response.status}`};openalex-${openAlex.response.ok ? "screen-completed" : `http-${openAlex.response.status}`};research-only`,
    question: "Does scholarly metadata or the reviewed local-government context add a site-resolved fish study, voucher, or independent name-to-outline link for San Marcos Lake in Capas, Tarlac?",
    inputs: [
      "data/research/philippines/national/reviews/central-luzon-tarlac-san-marcos-lake-occurrence-geometry-screen-20261126.json",
      "data/research/philippines/national/reviews/central-luzon-tarlac-san-marcos-lake-agusan-mihaba-name-collision-review-20261125.json",
    ],
    sourceIds: [
      "pna-bfar-capas-tarlac-lakes-fingerling-release-2020",
      "capas-citizens-charter-2024-tambo-lake-locality",
    ],
    officialLocalityCheck: {
      pnaReport: {
        sourceId: "pna-bfar-capas-tarlac-lakes-fingerling-release-2020",
        result: "Names San Marcos Lake and Tambo Lake as lakes in Capas, Tarlac and describes the 2020 BASIL stocking event; it supplies no coordinates, shoreline, fish survey, or scientific names.",
      },
      capasCitizensCharter: {
        sourceId: "capas-citizens-charter-2024-tambo-lake-locality",
        result: "Its tourist-destination list names Tambo Lake in Barangay Sta. Juliana. The reviewed list does not name San Marcos Lake; that omission does not show that the lake does not exist.",
      },
      localityCrosswalk: "No reviewed independent official source provides coordinates or links the Capas San Marcos Lake name to OSM way 272180970. The PNA administrative association remains the only direct official locality context found in this bounded check.",
    },
    searchMethod: {
      scope: "Two public scholarly metadata APIs queried for San Marcos Lake, Capas, Tarlac, and fish. Returned title and abstract metadata were screened for locality, exact waterbody phrase, and fish-related terms. This is literature discovery, not an occurrence-data or systematic-review search.",
      abstractHandling: "Abstract text was inspected in memory only for matching and is not retained in this report or the ignored raw response files.",
      providers: [
        {
          name: "Crossref REST API",
          documentation: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/",
          requestUrl: crossrefUrl.toString(),
          httpStatus: crossref.response.status,
          ...crossrefScreen,
          rawResponse: crossref.rawResponse,
        },
        {
          name: "OpenAlex Works API",
          documentation: "https://developers.openalex.org/api-reference/works",
          requestUrl: openAlexUrl.toString(),
          httpStatus: openAlex.response.status,
          reportedTotalResultCount: openAlex.json.meta?.count ?? null,
          ...openAlexScreen,
          screenedReturnedWorks: openAlexWorksSummary,
          error: openAlex.response.ok ? null : (openAlex.json.message ?? openAlex.json.error ?? openAlex.response.statusText),
          rawResponse: openAlex.rawResponse,
        },
      ],
    },
    findings: {
      newTaxonomicallyResolvedFishStudies: 0,
      newFishSpeciesAssertions: 0,
      newOccurrenceRows: 0,
      waterbodyGeometryAdded: false,
      appProjectionAdded: false,
      disposition: openAlex.response.ok && crossref.response.ok
        ? "This bounded metadata screen did not identify a taxon-resolved fish survey, voucher record, or independent lake geometry tied to San Marcos Lake, Capas. This is not evidence of fish absence or proof that no study exists. Keep the PNA stocking event as management context only; do not transfer fish species from the separate Agusan Lake Mihaba locality."
        : "At least one scholarly index request did not complete successfully; the incomplete index must not be treated as a zero-result search. Existing locality and geometry conclusions remain unchanged.",
    },
    limitations: [
      "Crossref and OpenAlex coverage, search ranking, and metadata are incomplete; local theses, government reports, non-DOI work, alternate spellings, and unindexed publications may be omitted.",
      "Returned title/abstract terms do not establish sampling locality, specimen identity, current presence, coordinates, boundary, or reuse rights.",
      "The PNA stocking account is an introduced-fingerling management event, not a wild fish inventory or a present-day occurrence record.",
      "The OSM candidate lake is unnamed and not independently linked to the PNA lake name; no OSM area or geometry is admitted as San Marcos Lake.",
      "No raw API response is committed; raw snapshots are Git-ignored, and the report records only query URLs, selected bibliographic metadata, sizes, and hashes.",
    ],
    disposition: {
      fishChecklistRowsAdded: 0,
      occurrenceRowsAdded: 0,
      waterbodyGeometryAdded: false,
      photosAdded: 0,
      publicProjectionAdded: false,
      regionalReleaseApproved: false,
      text: "Retain San Marcos Lake as a source-backed locality/stocking lead only. Keep the fish baseline, present-day occurrences, and mapped outline unresolved; Central Luzon and Luzon remain incomplete.",
    },
    nextActions: [
      "Seek a site-specific Capas/Tarlac fish survey, voucher catalogue, or field-monitoring source with scientific names and collection locality.",
      "Seek an independent official map, locality coordinate, or field-verified source before crosswalking any candidate lake polygon.",
      "Keep Agusan Marsh's Lake Mihaba records separate and do not interpret bounded metadata zeroes as absence.",
    ],
    sources: [
      { sourceId: "pna-bfar-capas-tarlac-lakes-fingerling-release-2020", url: "https://www.pna.gov.ph/articles/1110424", supports: "BFAR-3 stocking event and lake names in Capas; no fish inventory or coordinates." },
      { sourceId: "capas-citizens-charter-2024-tambo-lake-locality", url: "https://www.capastarlac.gov.ph/wp-content/uploads/Capas_CC_20240326-Citizens-Charter.pdf", supports: "Official tourism list names Tambo Lake / Sta. Juliana; does not independently locate San Marcos Lake." },
      { url: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/", supports: "Crossref API query method." },
      { url: "https://developers.openalex.org/api-reference/works", supports: "OpenAlex Works API query method." },
    ],
  };

  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ reviewId, crossref: { ...crossrefScreen, httpStatus: crossref.response.status }, openAlex: { ...openAlexScreen, httpStatus: openAlex.response.status, reportedTotalResultCount: openAlex.json.meta?.count ?? null } }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
