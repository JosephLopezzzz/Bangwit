import { PHILIPPINE_PROVINCES, type ProvinceId } from "./phl-provinces.ts";

/** Navigation metadata only. Membership never grants an evidence rollup. */
export const EXPLORER_COUNTRY_ID = "philippines";

export const EXPLORER_GEOGRAPHY_SOURCE = {
  outlineYear: 2020,
  outlineCount: 81,
  regionalGroupingYear: 2020,
  boundarySource: "geoBoundaries Philippines ADM2",
  boundarySourceUrl: "https://www.geoboundaries.org/",
  boundarySha256: "fa77b9f17db2e419acaae714a935f7812be4409e2983675d34020e8426a3e189",
  groupingBasis: "Source-era navigation groups; internal map IDs are not PSGC codes.",
  limitations: {
    en: "2020 province outlines and region groups. NCR has no province outline; Maguindanao is combined. Negros uses its 2020 groups. These are discovery outlines, not current administrative, navigation or fishing-access boundaries.",
    fil: "Mga balangkas ng lalawigan at pangkat ng rehiyon noong 2020. Walang balangkas ng lalawigan ang NCR; pinagsama ang Maguindanao. Nasa mga pangkat noong 2020 ang Negros. Para sa pagtuklas ang mapa, hindi para sa kasalukuyang hangganan, nabigasyon o pahintulot sa pangingisda.",
  },
} as const;

// Explicit crosswalk to the existing source-era polygon IDs. Newer research
// directory assignments are not silently substituted for this map's geography.
const assignments = [
  {
    id: "map-region:i",
    name: "Ilocos Region",
    provinceNames: ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
  },
  {
    id: "map-region:ii",
    name: "Cagayan Valley",
    provinceNames: ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino"],
  },
  {
    id: "map-region:car",
    name: "Cordillera Administrative Region",
    provinceNames: ["Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"],
  },
  {
    id: "map-region:iii",
    name: "Central Luzon",
    provinceNames: ["Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales"],
  },
  { id: "map-region:ncr", name: "National Capital Region", provinceNames: [] },
  { id: "map-region:iv-a", name: "CALABARZON", provinceNames: ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"] },
  {
    id: "map-region:iv-b",
    name: "MIMAROPA",
    provinceNames: ["Marinduque", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Romblon"],
  },
  {
    id: "map-region:v",
    name: "Bicol Region",
    provinceNames: ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon"],
  },
  {
    id: "map-region:vi",
    name: "Western Visayas",
    provinceNames: ["Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental"],
  },
  { id: "map-region:vii", name: "Central Visayas", provinceNames: ["Bohol", "Cebu", "Negros Oriental", "Siquijor"] },
  {
    id: "map-region:viii",
    name: "Eastern Visayas",
    provinceNames: ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte"],
  },
  {
    id: "map-region:ix",
    name: "Zamboanga Peninsula",
    provinceNames: ["Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
  },
  {
    id: "map-region:x",
    name: "Northern Mindanao",
    provinceNames: ["Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
  },
  {
    id: "map-region:xi",
    name: "Davao Region",
    provinceNames: ["Compostela Valley", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental"],
  },
  {
    id: "map-region:xii",
    name: "SOCCSKSARGEN",
    provinceNames: ["Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat"],
  },
  {
    id: "map-region:xiii",
    name: "Caraga",
    provinceNames: ["Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
  },
  {
    id: "map-region:barmm",
    name: "Bangsamoro Autonomous Region",
    provinceNames: ["Basilan", "Lanao del Sur", "Maguindanao", "Sulu", "Tawi-Tawi"],
  },
] as const;

export type ExplorerRegionId = (typeof assignments)[number]["id"];
export type ExplorerMapBounds = { x: number; y: number; width: number; height: number };

export type ExplorerRegion = {
  id: ExplorerRegionId;
  name: string;
  provinceIds: ProvinceId[];
  bounds: ExplorerMapBounds | null;
  center: { x: number; y: number } | null;
};

export type ExplorerProvince = {
  id: ProvinceId;
  name: string;
  sourceName: string;
  regionId: ExplorerRegionId;
  aliases: string[];
  bounds: ExplorerMapBounds;
  center: { x: number; y: number };
};

export const EXPLORER_PROVINCES: readonly ExplorerProvince[] = PHILIPPINE_PROVINCES.map((province) => {
  const assignment = assignments.find(({ provinceNames }) =>
    provinceNames.some((name) => name === province.sourceName),
  );
  if (!assignment) throw new Error(`Missing source-era region mapping: ${province.sourceName}`);
  const aliases = province.sourceName === "Compostela Valley" ? ["Davao de Oro", "Compostela Valley"] : [];
  return { ...province, regionId: assignment.id, aliases };
});

export const EXPLORER_REGIONS: readonly ExplorerRegion[] = assignments.map(({ id, name }) => {
  const provinces = EXPLORER_PROVINCES.filter((province) => province.regionId === id);
  const left = Math.min(...provinces.map(({ bounds }) => bounds.x));
  const top = Math.min(...provinces.map(({ bounds }) => bounds.y));
  const right = Math.max(...provinces.map(({ bounds }) => bounds.x + bounds.width));
  const bottom = Math.max(...provinces.map(({ bounds }) => bounds.y + bounds.height));
  const bounds = provinces.length ? { x: left, y: top, width: right - left, height: bottom - top } : null;
  return {
    id,
    name,
    provinceIds: provinces.map(({ id: provinceId }) => provinceId),
    bounds,
    center: bounds ? { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 } : null,
  };
});

export type ExplorerWaterbody = {
  id: string;
  name: string;
  kind: "bay" | "cove" | "lake" | "river" | "stream" | "coastal-locality";
  provinceIds: ProvinceId[];
  regionIds: ExplorerRegionId[];
  aliases: string[];
};

function provinceIds(names: string[]): ProvinceId[] {
  return EXPLORER_PROVINCES.filter(({ name, sourceName }) => names.includes(name) || names.includes(sourceName)).map(
    ({ id }) => id,
  );
}

// Many-to-many navigation links, not points, legal boundaries or evidence scope.
// Shared-waterbody records cannot inherit these province/region associations.
export const EXPLORER_WATERBODIES: readonly ExplorerWaterbody[] = [
  {
    id: "ph-wb-taal-lake",
    name: "Taal Lake",
    kind: "lake",
    provinceIds: provinceIds(["Batangas"]),
    regionIds: ["map-region:iv-a"],
    aliases: ["Lake Taal", "Lawa ng Taal"],
  },
  {
    id: "ph-wb-palico-lian-river",
    name: "Palico-Lian River",
    kind: "river",
    provinceIds: provinceIds(["Batangas"]),
    regionIds: ["map-region:iv-a"],
    aliases: ["Palico River", "Lian River"],
  },
  {
    id: "ph-wb-limbones-cove",
    name: "Limbones Cove",
    kind: "cove",
    provinceIds: provinceIds(["Cavite"]),
    regionIds: ["map-region:iv-a"],
    aliases: [],
  },
  {
    id: "ph-locality-cavite-manila-bay-coast",
    name: "Cavite coast / Manila Bay entrance",
    kind: "coastal-locality",
    provinceIds: provinceIds(["Cavite"]),
    regionIds: ["map-region:iv-a"],
    aliases: ["Cavite coast"],
  },
  {
    id: "ph-wb-manila-bay",
    name: "Manila Bay",
    kind: "bay",
    provinceIds: provinceIds(["Bataan", "Bulacan", "Pampanga", "Cavite"]),
    regionIds: ["map-region:iii", "map-region:ncr", "map-region:iv-a"],
    aliases: ["Look ng Maynila"],
  },
  {
    id: "ph-wb-bacoor-bay",
    name: "Bacoor Bay",
    kind: "bay",
    provinceIds: provinceIds(["Cavite"]),
    regionIds: ["map-region:iv-a"],
    aliases: ["Look ng Bacoor"],
  },
  {
    id: "ph-wb-canacao-bay",
    name: "Cañacao Bay",
    kind: "bay",
    provinceIds: provinceIds(["Cavite"]),
    regionIds: ["map-region:iv-a"],
    aliases: ["Canacao Bay"],
  },
  {
    id: "ph-wb-laguna-de-bay",
    name: "Laguna de Bay",
    kind: "lake",
    provinceIds: provinceIds(["Laguna", "Rizal"]),
    regionIds: ["map-region:iv-a", "map-region:ncr"],
    aliases: ["Laguna Lake"],
  },
  {
    id: "ph-wb-molawin-makiling-creek",
    name: "Molawin Creek",
    kind: "stream",
    provinceIds: provinceIds(["Laguna"]),
    regionIds: ["map-region:iv-a"],
    aliases: ["Molawin", "Makiling"],
  },
  {
    id: "ph-wb-pansipit-river",
    name: "Pansipit River",
    kind: "river",
    provinceIds: provinceIds(["Batangas"]),
    regionIds: ["map-region:iv-a"],
    aliases: [],
  },
  {
    id: "ph-wb-pasig-river",
    name: "Pasig River",
    kind: "river",
    provinceIds: [],
    regionIds: ["map-region:ncr"],
    aliases: ["Ilog Pasig"],
  },
];

export function getExplorerRegionForProvince(provinceId: string): ExplorerRegion | null {
  const province = EXPLORER_PROVINCES.find(({ id }) => id === provinceId);
  return EXPLORER_REGIONS.find(({ id }) => id === province?.regionId) ?? null;
}

export function getExplorerProvinces(regionId: string): readonly ExplorerProvince[] {
  return EXPLORER_PROVINCES.filter((province) => province.regionId === regionId);
}

export function getExplorerWaterbodies(provinceId: string): readonly ExplorerWaterbody[] {
  return EXPLORER_WATERBODIES.filter((waterbody) => waterbody.provinceIds.some((id) => id === provinceId));
}
