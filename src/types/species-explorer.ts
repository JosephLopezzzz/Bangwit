/** Public explorer DTOs. Historical assertions are never current-presence or catchability claims. */
export type ExplorerText = { en: string; fil: string };
export type ExplorerScopeKind = "country" | "region" | "province" | "waterbody";
export type ExplorerScope = { kind: ExplorerScopeKind; id: string };
export type ExplorerWaterType = "freshwater" | "saltwater" | "mixed";
export type ExplorerSpeciesGroup = "fish" | "crustacean" | "mollusk" | "unknown";
export type ExplorerFilters = {
  query: string;
  waterType: "all" | "unknown" | ExplorerWaterType;
  group: "all" | ExplorerSpeciesGroup;
};
export type ExplorerTaxon = {
  id: string;
  authority: "worms" | "gbif" | "col-xr" | "catalog-of-fishes";
  authorityId: string;
  scientificName: string;
  rank: "species" | "genus" | "family" | "unknown";
  taxonomyUrl: string;
  reviewStatus: "reviewed" | "unreviewed";
};
export type ExplorerSource = {
  id: string;
  title: string;
  citation: string;
  url: string;
  license: string | null;
  licenseUrl: string | null;
  permissionType: string | null;
  publicationDate: string | null;
};
export type ExplorerAssertion = {
  id: string;
  batchId: string;
  releaseStatus: "eligible" | "held";
  rightsStatus: "eligible" | "held";
  taxon: ExplorerTaxon;
  recordedName: string;
  group: ExplorerSpeciesGroup;
  waterTypes: readonly ExplorerWaterType[];
  commonName: ExplorerText | null;
  evidenceKind: "historical-specimen" | "literature-checklist" | "survey-table";
  source: ExplorerSource;
  observedOn: string | null;
  reviewedOn: string;
  reportedLocality: string;
  localityPrecision: "broad-locality" | "named-waterbody" | "marked-survey-sites";
  siteLabels: readonly string[];
  eligibleScopes: readonly ExplorerScope[];
  limitations: readonly ExplorerText[];
  currentPresence: false;
  coordinates: null;
};
export type ExplorerGuideStatus = "unreviewed" | "partial" | "reviewed" | "restricted" | "not-applicable";
export type ExplorerGuideField = "method" | "bait" | "steps" | "gear" | "conditions" | "handling";
export type ExplorerFishingGuide = {
  status: ExplorerGuideStatus;
  method: ExplorerText | null;
  bait: ExplorerText | null;
  steps: readonly ExplorerText[];
  gear: ExplorerText | null;
  conditions: ExplorerText | null;
  handling: ExplorerText | null;
  restriction: ExplorerText | null;
  notice: ExplorerText;
  reviewedFields: readonly ExplorerGuideField[];
  applicableScopes: readonly ExplorerScope[];
  reviewedOn: string | null;
  rulesReview: {
    status: "unreviewed" | "reviewed";
    jurisdiction: string | null;
    validFrom: string | null;
    validUntil: string | null;
  };
  sources: readonly ExplorerSource[];
};
export type ExplorerSpecies = {
  id: string;
  scientificName: string;
  commonName: ExplorerText | null;
  taxon: ExplorerTaxon;
  group: ExplorerSpeciesGroup;
  waterTypes: readonly ExplorerWaterType[];
  assertions: readonly ExplorerAssertion[];
  sourceCount: number;
  fishingGuide: ExplorerFishingGuide;
};
export type ExplorerCoverage = "unavailable" | "partial" | "reviewed";
export type ExplorerResult = {
  scope: ExplorerScope;
  coverage: ExplorerCoverage;
  state: "results" | "filtered-empty" | "unavailable";
  count: number | null;
  unfilteredCount: number | null;
  assertionCount: number;
  sourceCount: number;
  unknownWaterTypeCount: number;
  hasActiveFilters: boolean;
  species: readonly ExplorerSpecies[];
  limitations: readonly ExplorerText[];
};
export type ExplorerSelection = { regionId: string | null; provinceId: string | null; waterbodyId: string | null };
export type ExplorerNavigationState = {
  selection: ExplorerSelection;
  filters: ExplorerFilters;
  selectedSpeciesId: string | null;
  showMap: boolean;
  expanded: boolean;
};
/** An explicitly supplied relationship graph; never inferred from evidence or geometry intersection. */
export type ExplorerGeographyLinks = {
  regions: readonly { id: string; provinceIds: readonly string[] }[];
  waterbodies: readonly { id: string; provinceIds: readonly string[] }[];
};
