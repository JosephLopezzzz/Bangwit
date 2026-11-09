import cavite from "../../data/cavite-historical-evidence.json" with { type: "json" };
import palico from "../../data/palico-river-survey-evidence.json" with { type: "json" };
import releaseRegistry from "../../data/species-explorer-release-registry.json" with { type: "json" };
import taal from "../../data/taal-checklist-evidence.json" with { type: "json" };
import type { ExplorerAssertion, ExplorerScope, ExplorerSource, ExplorerText } from "../../types/species-explorer";

const country: ExplorerScope = { kind: "country", id: "philippines" };
const region: ExplorerScope = { kind: "region", id: "map-region:iv-a" };
const caviteProvince: ExplorerScope = { kind: "province", id: "2640588B43067672764099" };
const batangasProvince: ExplorerScope = { kind: "province", id: "2640588B63294043497895" };

/** Names are already public name metadata in feeding-guides.json, not occurrence or bait evidence. */
const reviewedNames: Record<string, { scientificName: string; commonName: ExplorerText }> = {
  "280130": { scientificName: "Channa striata", commonName: { en: "Snakehead · dalag", fil: "Dalag · snakehead" } },
  "293639": { scientificName: "Oreochromis niloticus", commonName: { en: "Nile tilapia", fil: "Nile tilapia" } },
  "1016224": { scientificName: "Sardinella tawilis", commonName: { en: "Tawilis", fil: "Tawilis" } },
};

function approvedRecord(batchId: string, id: string, authorityId: string, scientificName: string) {
  const batch = releaseRegistry.batches.find((item) => item.batchId === batchId);
  return (
    batch?.records.some(
      (item) => item.id === id && item.acceptedId === authorityId && item.scientificName === scientificName,
    ) ?? false
  );
}

function authorityIdFromUrl(url: string) {
  if (!url.startsWith("https://www.marinespecies.org/aphia.php?")) return null;
  const id = new URL(url).searchParams.get("id");
  return id && /^\d+$/.test(id) ? id : null;
}

function taxon(id: string, scientificName: string) {
  return {
    id: `worms:${id}`,
    authority: "worms" as const,
    authorityId: id,
    scientificName,
    rank: "species" as const,
    taxonomyUrl: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${id}`,
    reviewStatus: "reviewed" as const,
  };
}

function commonName(id: string, scientificName: string) {
  const entry = reviewedNames[id];
  return entry?.scientificName === scientificName ? entry.commonName : null;
}

const historicalLimits: readonly ExplorerText[] = [
  {
    en: "Historical museum records; not confirmation of current presence, abundance or a complete local inventory.",
    fil: "Makasaysayang rekord sa museo; hindi patunay ng kasalukuyang presensya, dami, o kumpletong lokal na imbentaryo.",
  },
  {
    en: "Provider locality text is retained. No coordinates, fishing access, permission, safety or bait effectiveness are inferred.",
    fil: "Pinananatili ang lokalidad na isinulat ng pinagmulan. Walang hinuhulaang coordinate, access, pahintulot, kaligtasan o bisa ng pain.",
  },
];

function adaptCavite(): ExplorerAssertion[] {
  const batchId = "cavite-cas-historical-20261006";
  if (cavite.schemaVersion !== 1 || cavite.dataset.licenseUrl !== "https://creativecommons.org/publicdomain/zero/1.0/")
    return [];
  const source: ExplorerSource = {
    id: "cavite-cas-obis-historical",
    title: cavite.dataset.title,
    citation: cavite.dataset.citation,
    url: cavite.dataset.url,
    license: cavite.dataset.license,
    licenseUrl: cavite.dataset.licenseUrl,
    permissionType: null,
    publicationDate: null,
  };
  return cavite.records.flatMap((row) => {
    // The recorded combination may be superseded: the reviewed accepted concept is the explicit allowlisted identity.
    if (!approvedRecord(batchId, row.id, row.acceptedTaxonId, row.acceptedName)) return [];
    const eligibleScopes: ExplorerScope[] = [country, region, caviteProvince];
    if (row.localityGroup === "limbones-cove") eligibleScopes.push({ kind: "waterbody", id: "ph-wb-limbones-cove" });
    // Broad Cavite-coast grouping does not establish every bay. Only literal Manila Bay localities get this named-waterbody context.
    if (row.localityGroup === "cavite-manila-bay" && /manila bay/i.test(row.reportedLocality)) {
      eligibleScopes.push({ kind: "waterbody", id: "ph-wb-manila-bay" });
    }
    return [
      {
        id: `${batchId}:${row.id}`,
        batchId,
        releaseStatus: "eligible" as const,
        rightsStatus: "eligible" as const,
        taxon: taxon(row.acceptedTaxonId, row.acceptedName),
        recordedName: row.recordedName,
        group: "fish" as const,
        waterTypes: [],
        commonName: commonName(row.acceptedTaxonId, row.acceptedName),
        evidenceKind: "historical-specimen" as const,
        source,
        observedOn: row.collectedOn,
        reviewedOn: cavite.snapshot.taxonomyReviewedAt.slice(0, 10),
        reportedLocality: row.reportedLocality,
        localityPrecision: "broad-locality" as const,
        siteLabels: [],
        eligibleScopes,
        limitations: historicalLimits,
        currentPresence: false as const,
        coordinates: null,
      },
    ];
  });
}

function adaptTaal(): ExplorerAssertion[] {
  if (taal.schemaVersion !== 1 || taal.source.license !== "CC0-1.0") return [];
  const source: ExplorerSource = {
    id: taal.source.id,
    title: taal.source.title,
    citation: taal.source.citation,
    url: taal.source.articleUrl,
    license: taal.source.license,
    licenseUrl: taal.source.licenseUrl,
    permissionType: null,
    publicationDate: taal.source.publicationDate,
  };
  return taal.records.flatMap((row) => {
    const id = authorityIdFromUrl(row.independentTaxonomyUrl);
    if (!id || !approvedRecord(taal.batchId, row.id, id, row.scientificName)) return [];
    return [
      {
        id: row.id,
        batchId: taal.batchId,
        releaseStatus: "eligible" as const,
        rightsStatus: "eligible" as const,
        taxon: taxon(id, row.scientificName),
        recordedName: row.recordedName,
        group: "fish" as const,
        waterTypes: [],
        commonName: commonName(id, row.scientificName),
        evidenceKind: "literature-checklist" as const,
        source,
        observedOn: row.observationDate,
        reviewedOn: taal.reviewedOn,
        reportedLocality: row.reportedLocality,
        localityPrecision: "named-waterbody" as const,
        siteLabels: [],
        eligibleScopes: [country, region, batangasProvince, { kind: "waterbody" as const, id: taal.waterbody.id }],
        limitations: [
          {
            en: "A checklist published in 2023; observation dates are unknown. This is not confirmation of current presence or a complete lake inventory.",
            fil: "Checklist na inilathala noong 2023; hindi alam ang mga petsa ng obserbasyon. Hindi ito patunay ng kasalukuyang presensya o kumpletong imbentaryo ng lawa.",
          },
          {
            en: "The source title and lake name do not establish freshwater-only ecology, abundance, bait effectiveness or fishing permission.",
            fil: "Hindi nagpapatunay ang pamagat at pangalan ng lawa ng freshwater-only na ekolohiya, dami, bisa ng pain o pahintulot sa pangingisda.",
          },
        ],
        currentPresence: false as const,
        coordinates: null,
      },
    ];
  });
}

function adaptPalico(): ExplorerAssertion[] {
  if (
    palico.schemaVersion !== 1 ||
    palico.source.permissionType !== "custom-publisher-copy-distribution-grant" ||
    palico.limits.currentPresence !== false
  )
    return [];
  const source: ExplorerSource = {
    id: palico.source.id,
    title: palico.source.title,
    citation: palico.source.citation,
    url: palico.source.articleUrl,
    license: null,
    licenseUrl: palico.source.policyUrl,
    permissionType: palico.source.permissionType,
    publicationDate: palico.source.publicationDate,
  };
  return palico.records.flatMap((row) => {
    const id = authorityIdFromUrl(row.taxonomyUrl);
    if (!id || !approvedRecord(palico.batchId, row.id, id, row.scientificName)) return [];
    const siteLabels = Object.entries(row.sitePresence)
      .filter(([, marked]) => marked)
      .map(([site]) => site.replace("site", "Site "));
    return [
      {
        id: row.id,
        batchId: palico.batchId,
        releaseStatus: "eligible" as const,
        rightsStatus: "eligible" as const,
        taxon: taxon(id, row.scientificName),
        recordedName: row.recordedName,
        group: "fish" as const,
        waterTypes: [],
        commonName: commonName(id, row.scientificName),
        evidenceKind: "survey-table" as const,
        source,
        observedOn: row.observationDate,
        reviewedOn: palico.reviewedOn,
        reportedLocality: palico.waterbody.name,
        localityPrecision: "marked-survey-sites" as const,
        siteLabels,
        eligibleScopes: [country, region, batangasProvince, { kind: "waterbody" as const, id: palico.waterbody.id }],
        limitations: [
          {
            en: "Source Table 1, printed page 584: marked sites indicate reported presence, not specimen counts. Sampling dates are not reported.",
            fil: "Talahanayan 1, nakalimbag na pahina 584: nagpapahiwatig ng iniulat na presensya ang mga markang site, hindi bilang ng specimen. Hindi iniulat ang petsa ng sampling.",
          },
          {
            en: "This is a limited survey-table projection, not current presence or a whole-river inventory. Salinity, precise geometry, catchability and fishing permission remain unassessed.",
            fil: "Limitadong projection ito ng talahanayan ng survey, hindi kasalukuyang presensya o buong imbentaryo ng ilog. Hindi pa nasuri ang alat, eksaktong geometry, pagkakahuli at pahintulot sa pangingisda.",
          },
          {
            en: "Custom publisher permission applies to this attributed factual projection only; it is not a Creative Commons license or blanket source reuse approval.",
            fil: "Para lamang sa may-atribusyong factual projection na ito ang espesyal na pahintulot ng publisher; hindi ito lisensyang Creative Commons o pangkalahatang pahintulot sa muling paggamit.",
          },
        ],
        currentPresence: false as const,
        coordinates: null,
      },
    ];
  });
}

export const EXPLORER_ASSERTIONS: readonly ExplorerAssertion[] = Object.freeze([
  ...adaptCavite(),
  ...adaptTaal(),
  ...adaptPalico(),
]);
export const EXPLORER_ENABLED_BATCH_IDS = Object.freeze(releaseRegistry.batches.map((batch) => batch.batchId));
export function getExplorerAssertions(): readonly ExplorerAssertion[] {
  return EXPLORER_ASSERTIONS;
}
