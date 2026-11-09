import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../../../", import.meta.url);
const inputUrl = new URL("data/research/philippines/national/reviews/gbif-region02-river-candidate-source-review-20261109.json", root);
const rawDirectory = new URL("data/research/philippines/raw/national/region02-cagayan-magat-catalog-taxonomy-20261110/", root);
const outputUrl = new URL("data/research/philippines/national/reviews/region02-cagayan-magat-fish-taxonomy-crosswalk-20261110.json", root);
const catalogBase = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=";
const catalogVersionDate = "2026-10-20";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

const taxa = [
  {
    name: "Clarias macrocephalus",
    catalogSpeciesId: "4662",
    catalogCurrentStatus: "Current status: Valid as Clarias macrocephalus Günther 1864. Clariidae.",
    gbifAcceptedName: "Clarias macrocephalus",
    gbifFamily: "Clariidae",
    sourceGroup: "cagayanRiverBOLD",
    sourceRecordName: "Clarias macrocephalus",
    expectedRecords: 5,
    disposition: "name-family-crosschecked;source-identification-not-reverified;historical-records-only",
    caveat: "The Catalog distribution wording says 'possibly Philippines'; that range note does not disprove the BOLD locality, but the taxon and site remain research candidates pending specimen-level verification.",
  },
  {
    name: "Plicofollis magatensis",
    catalogSpeciesId: "53678",
    catalogCurrentStatus: "Current status: Valid as Plicofollis magatensis (Herre 1926). Ariidae: Ariinae.",
    gbifAcceptedName: "Plicofollis magatensis",
    gbifFamily: "Ariidae",
    sourceGroup: "cagayanRiverBOLD",
    sourceRecordName: "Plicofollis magatensis",
    expectedRecords: 7,
    disposition: "name-family-crosschecked;source-identification-not-reverified;historical-records-only",
    caveat: "The source locality is a historical Cagayan River text label without coordinate accuracy; it does not identify a specific reach or establish current presence.",
  },
  {
    name: "Glossogobius celebius",
    catalogSpeciesId: "18734",
    catalogCurrentStatus: "Current status: Valid as Glossogobius celebius (Valenciennes 1837). Gobiidae: Gobiinae.",
    gbifAcceptedName: "Glossogobius celebius",
    gbifFamily: "Gobiidae",
    sourceGroup: "magatRiverCAS",
    sourceRecordName: "Glossogobius celebius",
    expectedRecords: 1,
    disposition: "name-family-crosschecked;source-identification-not-reverified;historical-voucher-candidate",
    caveat: "The 1940 CAS catalogue row has the broad text locality Magat River, Bayombong and 3,257 m coordinate uncertainty; no point is suitable for reach placement.",
  },
  {
    name: "Liza melinopterus",
    catalogSpeciesId: "33583",
    catalogCurrentStatus: "Current status: Valid as Chelon melinopterus (Valenciennes 1836). Mugilidae.",
    gbifAcceptedName: "Planiliza melinopterus",
    gbifFamily: "Mugilidae",
    independentRegister: {
      provider: "World Register of Marine Species (WoRMS)",
      url: "https://www.marinespecies.org/aphia.php?p=taxlist&tName=Liza",
      statement: "The WoRMS taxon list reports Liza melinopterus (Valenciennes, 1836) accepted as Planiliza melinoptera (Valenciennes, 1836).",
      pageGeneratedOn: "2026-10-05",
      reuse: "No reuse license was assessed for display; this is a research-only nomenclature conflict record.",
    },
    sourceGroup: "magatRiverCAS",
    sourceRecordName: "Liza melinopterus",
    expectedRecords: 1,
    disposition: "accepted-combination-and-spelling-conflict;hold-name-selection;family-agrees-as-Mugilidae",
    caveat: "GBIF gives Planiliza melinopterus, WoRMS gives Planiliza melinoptera, and the current Catalog page gives Chelon melinopterus. Preserve the verbatim source name; do not choose an app display name until this conflict is resolved.",
  },
  {
    name: "Rhinogobius bucculentus",
    catalogSpeciesId: "43687",
    catalogCurrentStatus: "Current status: Valid as Rhinogobius bucculentus (Herre 1927). Oxudercidae: Gobionellinae.",
    gbifAcceptedName: "Rhinogobius bucculentus",
    gbifFamily: "Gobiidae",
    sourceGroup: "magatRiverCAS",
    sourceRecordName: "Rhinogobius bucculentus",
    expectedRecords: 2,
    disposition: "name-crosschecked;family-conflict;source-identification-not-reverified;historical-voucher-candidates",
    caveat: "GBIF's occurrence rows use Gobiidae, while the Catalog uses Oxudercidae: Gobionellinae. Keep both classifications in provenance and hold the app family selection for review.",
  },
  {
    name: "Zenarchopterus philippinus",
    catalogSpeciesId: "31803",
    catalogCurrentStatus: "Current status: Valid as Zenarchopterus philippinus (Peters 1868). Zenarchopteridae.",
    gbifAcceptedName: "Zenarchopterus philippinus",
    gbifFamily: "Zenarchopteridae",
    sourceGroup: "magatRiverCAS",
    sourceRecordName: "Zenarchopterus philippinus",
    expectedRecords: 1,
    disposition: "name-family-crosschecked;source-identification-not-reverified;historical-voucher-candidate",
    caveat: "The Catalog treats Zenarchopterus magatensis as a synonym of Z. philippinus and gives its type series locality as branches of the Magat River and tributary creeks at Bagabag. This historical type locality is not a current occurrence or a placement of the 1940 voucher.",
  },
  {
    name: "Zenarchopterus magatensis",
    catalogSpeciesId: "45369",
    catalogCurrentStatus: "Current status: Synonym of Zenarchopterus philippinus (Peters 1868). Zenarchopteridae.",
    gbifAcceptedName: null,
    gbifFamily: null,
    sourceGroup: null,
    sourceRecordName: null,
    expectedRecords: 0,
    disposition: "historical-type-locality-synonym-context-only;not-an-additional-occurrence-row",
    caveat: "The Catalog reports a type series from branches of Magat River and tributary creeks at Bagabag, Nueva Vizcaya. This nomenclatural/type-locality context is not an independent current occurrence.",
  },
];

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&bull;/gi, "•")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function currentStatusLine(text) {
  const start = text.indexOf("Current status:");
  if (start < 0) return null;
  const end = text.indexOf("Distribution:", start);
  return text.slice(start, end < 0 ? Math.min(start + 220, text.length) : end).trim();
}

async function fetchCatalogRecord(taxon) {
  const url = `${catalogBase}${taxon.catalogSpeciesId}`;
  const response = await fetch(url, {
    headers: { accept: "text/html", "user-agent": "Bangwit-research/1.0 (read-only taxonomy crosswalk)" },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`Catalog ${taxon.name} returned HTTP ${response.status}.`);
  const text = htmlToText(bytes.toString("utf8"));
  const statusLine = currentStatusLine(text);
  if (!statusLine || !statusLine.startsWith(taxon.catalogCurrentStatus)) {
    throw new Error(`Catalog status mismatch for ${taxon.name}: ${statusLine ?? "missing Current status"}`);
  }
  const pageVersion = text.match(/Online Version, Updated ([^ ]+ [^ ]+ [^ ]+)/)?.[1] ?? null;
  if (pageVersion !== "20 Oct. 2026") throw new Error(`Unexpected Catalog page version for ${taxon.name}: ${pageVersion}`);

  const slug = taxon.name.toLowerCase().replaceAll(" ", "-");
  const rawBytes = Buffer.from(bytes);
  await writeFile(new URL(`${slug}.html`, rawDirectory), rawBytes);
  return {
    url,
    httpStatus: response.status,
    pageVersion,
    statusLine,
    response: {
      path: `raw/national/region02-cagayan-magat-catalog-taxonomy-20261110/${slug}.html`,
      bytes: rawBytes.length,
      sha256: sha256(rawBytes),
    },
  };
}

async function main() {
  await mkdir(rawDirectory, { recursive: true });
  const inputBytes = await readFile(inputUrl);
  const input = JSON.parse(inputBytes.toString("utf8"));
  const boldGroup = input.candidateGroups?.cagayanRiverBOLD;
  const magatGroup = input.candidateGroups?.magatRiverCAS;
  if (!boldGroup || !magatGroup || boldGroup.recordCount !== 12 || magatGroup.recordCount !== 5) {
    throw new Error("The expected corrected BOLD/CAS candidate groups were not found.");
  }

  const boldCounts = new Map();
  for (const record of boldGroup.records) {
    boldCounts.set(record.scientificName, (boldCounts.get(record.scientificName) ?? 0) + 1);
  }
  const magatCounts = new Map();
  for (const record of magatGroup.records) {
    const name = record.recordedName.replace(/\s*\([^)]*\)\s*$/, "");
    magatCounts.set(name, (magatCounts.get(name) ?? 0) + 1);
  }

  const crosswalk = [];
  for (const taxon of taxa) {
    const sourceRows = taxon.sourceGroup === "cagayanRiverBOLD"
      ? boldGroup.records.filter((row) => row.scientificName === taxon.sourceRecordName)
      : taxon.sourceGroup === "magatRiverCAS"
        ? magatGroup.records.filter((row) => row.recordedName.replace(/\s*\([^)]*\)\s*$/, "") === taxon.sourceRecordName)
        : [];
    if (sourceRows.length !== taxon.expectedRecords) {
      throw new Error(`${taxon.name} expected ${taxon.expectedRecords} source rows; found ${sourceRows.length}.`);
    }
    const catalog = await fetchCatalogRecord(taxon);
    crosswalk.push({
      recordedName: taxon.name,
      sourceRows: sourceRows.map((row) => taxon.sourceGroup === "cagayanRiverBOLD"
        ? {
            source: "BOLD/iBOL",
            gbifRecordId: row.gbifRecordId,
            processId: row.processId,
            collectionDate: row.collectionDateStart,
            sourceLocality: row.site,
            sourceProvince: row.province,
            coordinateAccuracy: row.coordinateAccuracy,
          }
        : {
            source: "CAS Ichthyology via GBIF",
            gbifRecordId: row.gbifId,
            catalogNumber: row.catalogNumber,
            eventDate: row.eventDate,
            sourceWaterBody: row.waterBody,
            sourceLocality: row.locality,
            sourceProvince: row.stateProvince,
            coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters,
          }),
      gbifAcceptedName: taxon.gbifAcceptedName,
      gbifFamily: taxon.gbifFamily,
      catalogOfFishes: catalog,
      independentRegister: taxon.independentRegister ?? null,
      disposition: taxon.disposition,
      caveat: taxon.caveat,
    });
  }

  const report = {
    schemaVersion: 1,
    reviewId: "region02-cagayan-magat-fish-taxonomy-crosswalk-20261110",
    generatedOn: "2026-11-10",
    status: "catalog-direct-records-reviewed;two-name-family-conflicts-held;research-only",
    purpose: "Independent fish-taxonomy cross-check for the two Cagayan River BOLD/iBOL candidate taxa and four recorded CAS Magat River voucher taxa, including a Catalog type-locality synonym follow-up. This does not re-identify specimens or approve app content.",
    input: {
      path: "data/research/philippines/national/reviews/gbif-region02-river-candidate-source-review-20261109.json",
      sha256: sha256(inputBytes),
      cagayanRiverBOLDRecords: boldGroup.recordCount,
      magatRiverCASRecords: magatGroup.recordCount,
      sourceCountsByName: {
        ...Object.fromEntries(boldCounts),
        ...Object.fromEntries(magatCounts),
      },
      coordinatesIncluded: false,
    },
    authority: {
      provider: "California Academy of Sciences, Eschmeyer's Catalog of Fishes",
      version: "Online version updated 20 Oct. 2026",
      retrievedOn: "2026-11-10",
      reuse: "No item-specific reuse terms were established. The report retains short nomenclatural status statements and source identifiers for research; no article, image, or bulk Catalog content is copied into the app.",
    },
    crosswalk,
    taxonomicDisagreements: [
      {
        names: ["Liza melinopterus", "Planiliza melinopterus", "Planiliza melinoptera", "Chelon melinopterus"],
        sourceRecord: "CAS 38916; GBIF occurrence 3426459240; Magat River, Bayombong, Nueva Vizcaya, 1940-05-31; 3,257 m coordinate uncertainty.",
        authorities: {
          GBIF: "Planiliza melinopterus",
          WoRMS: "Planiliza melinoptera",
          CatalogOfFishes: "Chelon melinopterus",
        },
        disposition: "hold-accepted-combination-and-spelling-conflict;retain-recorded-name;no-specimen-reidentification",
        sourceUrl: "https://www.marinespecies.org/aphia.php?p=taxlist&tName=Liza",
      },
      {
        names: ["Rhinogobius bucculentus"],
        sourceRecord: "CAS 38600 (1940-05-31) and CAS 26366 (1931-05-27); both have Magat River/Bayombong text and 3,257 m coordinate uncertainty.",
        authorities: {
          GBIF: "Gobiidae",
          CatalogOfFishes: "Oxudercidae: Gobionellinae",
        },
        disposition: "hold-family-conflict;preserve-both-source-classifications",
      },
    ],
    dispositionSummary: {
      taxonLabelsReviewed: 6,
      additionalSynonymTypeLocalityPagesReviewed: 1,
      nameFamilyCrosschecksWithoutRecordedConflict: 4,
      acceptedCombinationOrSpellingConflict: 1,
      familyConflict: 1,
      specimensReidentified: false,
      publicSpeciesOrOccurrenceRowsAdded: 0,
      publicGeometryAdded: false,
      coordinateBearingDataIncluded: false,
      publicationApproval: false,
    },
    limitations: [
      "Catalog name status and family do not independently verify the BOLD or museum specimen identification.",
      "The BOLD place is a historical text label without coordinate accuracy; the five CAS Magat records have 3,257 m coordinate uncertainty and coarse locality text.",
      "The Liza/Planiliza/Chelon accepted-name conflict and Rhinogobius family conflict remain unresolved. Do not silently normalize or publish a preferred app name/family.",
      "The Zenarchopterus magatensis type locality and synonymy are historical taxonomic context, not an additional current occurrence or point geometry.",
      "Nothing here establishes current presence, abundance, diet, catchability, access, legal status, waterbody geometry, or safety.",
    ],
    nextAction: "Use the taxonomically cross-checked Cagayan/Magat records only as research evidence; continue searching independently available, dated, site-specific Region II river, lake, reservoir, wetland, estuary, and brackish fish surveys with vouchers or accessions, preserving item-level reuse review.",
  };

  await writeFile(outputUrl, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Catalog pages verified: ${crosswalk.length}`);
  console.log(`Saved: ${outputUrl.pathname}`);
  console.log(`Name/family disagreements held: ${report.taxonomicDisagreements.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
