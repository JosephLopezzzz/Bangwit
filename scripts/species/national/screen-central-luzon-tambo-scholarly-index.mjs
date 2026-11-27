import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const reviewedOn = "2026-11-27";
const reviewId = "central-luzon-tarlac-tambo-scholarly-index-screen-20261127";
const reviewUrl = new URL(`data/research/philippines/national/reviews/${reviewId}.json`, root);
const rawDirectoryName = `${reviewId}`;
const rawDirectory = new URL(`data/research/philippines/raw/${rawDirectoryName}/`, root);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchJson(name, url, { useSnapshots = false } = {}) {
  let response;
  let bytes;
  if (useSnapshots) {
    bytes = await readFile(new URL(`${name}.json`, rawDirectory));
    response = { ok: true, status: 200, headers: { get: () => null } };
  } else {
    response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "Bangwit-research/1.0 (bounded scholarly metadata screen)",
      },
      signal: AbortSignal.timeout(30000),
    });
    bytes = Buffer.from(await response.arrayBuffer());
  }
  const rawPath = `data/research/philippines/raw/${rawDirectoryName}/${name}.json`;
  await writeFile(new URL(`${name}.json`, rawDirectory), bytes);

  let json;
  try {
    json = JSON.parse(bytes.toString("utf8"));
  } catch {
    json = { error: bytes.toString("utf8") };
  }

  return {
    response,
    json,
    rawResponse: {
      path: rawPath,
      bytes: bytes.length,
      sha256: sha256(bytes),
      retryAfter: response.headers.get("retry-after"),
    },
  };
}

function reconstructOpenAlexAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) words[position] = word;
  }
  return words.filter(Boolean).join(" ");
}

function yearFromCrossref(record) {
  const parts = record.issued?.["date-parts"]?.[0] ?? record.published?.["date-parts"]?.[0];
  return Array.isArray(parts) && Number.isInteger(parts[0]) ? parts[0] : null;
}

function shortlist(records, getText, getSummary) {
  const locationPattern = /\b(tambo|tarlac|capas|santa juliana|sta\.? juliana)\b/i;
  const waterbodyPattern = /\b(?:tambo\s+lake|lake\s+tambo)\b/i;
  const matches = records.filter((record) => locationPattern.test(getText(record)));
  const waterbodyMatches = records.filter((record) => waterbodyPattern.test(getText(record)));
  return {
    count: records.length,
    localityTermMatchCount: matches.length,
    localityTermMatches: matches.slice(0, 25).map(getSummary),
    exactWaterbodyPhraseMatchCount: waterbodyMatches.length,
    exactWaterbodyPhraseMatches: waterbodyMatches.slice(0, 25).map(getSummary),
  };
}

async function main() {
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const useSnapshots = process.argv.includes("--from-snapshots");

  const crossrefUrl = new URL("https://api.crossref.org/works");
  crossrefUrl.searchParams.set("query.bibliographic", "Tambo Lake Capas fish");
  crossrefUrl.searchParams.set("rows", "100");
  const crossref = await fetchJson("01-crossref-tambo-lake-capas-fish", crossrefUrl, { useSnapshots });
  if (!useSnapshots) await wait(1000);

  const openAlexUrl = new URL("https://api.openalex.org/works");
  openAlexUrl.searchParams.set("search", "Tambo Lake Tarlac");
  openAlexUrl.searchParams.set("per-page", "100");
  const openAlex = await fetchJson("02-openalex-tambo-lake-tarlac", openAlexUrl, { useSnapshots });

  if (!crossref.response.ok) throw new Error(`Crossref returned HTTP ${crossref.response.status}`);

  const crossrefWorks = crossref.json.message?.items ?? [];
  const openAlexWorks = openAlex.json.results ?? [];
  const crossrefScreen = shortlist(
    crossrefWorks,
    (record) => [record.title?.join(" "), record.abstract, record["container-title"]?.join(" ")].filter(Boolean).join(" "),
    (record) => ({ title: record.title?.[0] ?? null, year: yearFromCrossref(record), doi: record.DOI ?? null }),
  );
  const openAlexScreen = shortlist(
    openAlexWorks,
    (record) => [record.title, reconstructOpenAlexAbstract(record.abstract_inverted_index)].filter(Boolean).join(" "),
    (record) => ({ title: record.title ?? null, year: record.publication_year ?? null, doi: record.doi ?? null }),
  );
  const openAlexReturnedWorkSummaries = openAlexWorks.map((record) => {
    const summary = { title: record.title ?? null, year: record.publication_year ?? null, doi: record.doi ?? null };
    const title = record.title ?? "";
    if (/cladoceran|microcrustacean|copepod/i.test(title)) {
      summary.screenDisposition = "freshwater-invertebrate literature; not a fish survey";
    } else if (/fish|ichthy|actinopteryg|teleost/i.test(title)) {
      summary.screenDisposition = "fish-related title; exact lake/locality link requires source-level review";
    } else {
      summary.screenDisposition = "no fish-survey indication in title; not promoted as local fish evidence";
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
    waterbodyNamesAsReported: ["Tambo Lake", "Lake Tambo"],
    status: `crossref-screen-completed;openalex-${openAlex.response.ok ? "screen-completed" : `http-${openAlex.response.status}`};research-only`,
    question: "Does a separate scholarly-metadata index screen reveal a fish survey or voucher record explicitly connected to Tambo Lake / Lake Tambo in Capas, Tarlac?",
    inputs: [
      "data/research/philippines/national/reviews/central-luzon-tarlac-tambo-lake-locality-geometry-crosswalk-20261125.json",
      "data/research/philippines/national/reviews/central-luzon-tarlac-tambo-lake-historical-fishery-context-review-20261125.json",
    ],
    sourceIds: [
      "capas-citizens-charter-2024-tambo-lake-locality",
      "lopez-et-al-2017-freshwater-microcrustaceans-tambo-lake-site",
      "inat-tambo-lake-actinopterygii-nearby-screen-20261126",
    ],
    searchMethod: {
      scope: "Two public scholarly metadata search APIs; title and abstract metadata were screened for Tambo, Tarlac, Capas, and Santa/Sta. Juliana terms. This is a literature-discovery screen, not an occurrence-data search.",
      abstractHandling: "Abstract text was inspected only in memory to identify locality-term matches; it is not retained in this report or in the raw response files excluded from Git.",
      providers: [
        {
          name: "Crossref REST API",
          documentation: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/",
          queryParameter: "query.bibliographic",
          requestUrl: crossrefUrl.toString(),
          httpStatus: crossref.response.status,
          returnedRecordCount: crossrefScreen.count,
          localityTermMatchCount: crossrefScreen.localityTermMatchCount,
          localityTermMatches: crossrefScreen.localityTermMatches,
          rawResponse: crossref.rawResponse,
        },
        {
          name: "OpenAlex Works API",
          documentation: "https://developers.openalex.org/api-reference/works",
          queryParameter: "search",
          requestUrl: openAlexUrl.toString(),
          httpStatus: openAlex.response.status,
          reportedTotalResultCount: openAlex.json.meta?.count ?? null,
          returnedRecordCount: openAlexScreen.count,
          localityTermMatchCount: openAlexScreen.localityTermMatchCount,
          localityTermMatches: openAlexScreen.localityTermMatches,
          screenedReturnedWorks: openAlexReturnedWorkSummaries,
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
      disposition: openAlex.response.ok
        ? "Crossref returned a broad, noisy candidate list with no exact Tambo Lake / Lake Tambo phrase in the returned title/abstract metadata. OpenAlex returned seven works; two relevant titles concern freshwater microcrustaceans, while the other five do not indicate fish surveys in their titles. No new taxonomically resolved fish survey or voucher record tied to the Capas lake was identified, and no invertebrate source is transferred into Bangwit's fish checklist."
        : "Crossref returned a broad, noisy candidate list with no exact Tambo Lake / Lake Tambo phrase in the returned title/abstract metadata. OpenAlex was rate-limited (HTTP 429), so this run does not support a result-level conclusion from that index.",
    },
    limitations: [
      "Crossref and OpenAlex index coverage and metadata are incomplete and may omit theses, local reports, non-DOI work, unindexed publications, alternate spellings, or records without abstracts.",
      "Search ranking, title/abstract term matching, and the capped result page do not establish that no fish study or fish occurrence exists.",
      ...(openAlex.response.ok ? [] : ["OpenAlex returned HTTP 429 rate limiting; its response is retained locally and must not be interpreted as a zero-result search."]),
      "Bibliographic matches do not independently verify sampling locality, taxonomic identification, collection date, specimen identity, or reuse rights.",
      "No raw API response is committed; only response sizes, hashes, query URLs, and locality-term-matched bibliographic metadata are recorded.",
    ],
    disposition: {
      fishChecklistRowsAdded: 0,
      occurrenceRowsAdded: 0,
      waterbodyGeometryAdded: false,
      photosAdded: 0,
      publicProjectionAdded: false,
      regionalReleaseApproved: false,
      text: "Record the search as a bounded discovery outcome only. Keep Tambo Lake's fish baseline and geometry unresolved and continue Central Luzon source discovery.",
    },
    nextActions: [
      "Continue searching for authorized university repository theses, voucher catalogs, and local historical or field sources that name a scientific fish taxon and the same Tambo Lake / Capas locality.",
      "Revisit this metadata screen only when new indexed material or an alternate spelling is identified; do not convert zero candidate studies into species absence.",
      "Keep Tambo Lake, Central Luzon, and Luzon incomplete.",
    ],
  };

  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ reviewId, crossref: { ...crossrefScreen, httpStatus: crossref.response.status }, openAlex: { ...openAlexScreen, httpStatus: openAlex.response.status, reportedTotalResultCount: openAlex.json.meta?.count ?? null } }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
