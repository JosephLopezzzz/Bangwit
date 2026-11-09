import releaseRegistry from "../../data/species-explorer-release-registry.json" with { type: "json" };
import type {
  ExplorerAssertion,
  ExplorerFilters,
  ExplorerFishingGuide,
  ExplorerGuideField,
  ExplorerResult,
  ExplorerScope,
  ExplorerSpecies,
  ExplorerText,
} from "../../types/species-explorer";

export const DEFAULT_EXPLORER_FILTERS: ExplorerFilters = { query: "", waterType: "all", group: "all" };
const coverageLimits: readonly ExplorerText[] = [
  {
    en: "Counts are distinct species documented in the enabled reviewed records, not current presence, abundance or a complete inventory.",
    fil: "Mga natatanging species na dokumentado sa pinaganang sinuring rekord ang bilang, hindi kasalukuyang presensya, dami o kumpletong imbentaryo.",
  },
  {
    en: "Missing coverage is unknown. A filter with no matches does not mean that fish are absent.",
    fil: "Hindi alam ang nawawalang coverage. Hindi ibig sabihin ng walang tugma sa filter na walang isda.",
  },
];

export const UNAVAILABLE_FISHING_GUIDE: ExplorerFishingGuide = {
  status: "unreviewed",
  method: null,
  bait: null,
  steps: [],
  gear: null,
  conditions: null,
  handling: null,
  restriction: null,
  notice: {
    en: "No reviewed method or bait guide is available for this species and location. Diet evidence is not proof of effective bait.",
    fil: "Wala pang sinuring gabay sa paraan o pain para sa species at lugar na ito. Hindi patunay ng mabisang pain ang ebidensya ng pagkain.",
  },
  reviewedFields: [],
  applicableScopes: [],
  reviewedOn: null,
  rulesReview: { status: "unreviewed", jurisdiction: null, validFrom: null, validUntil: null },
  sources: [],
};

export function normalizeExplorerSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();
}
function sameScope(a: ExplorerScope, b: ExplorerScope) {
  return a.kind === b.kind && a.id === b.id;
}

export function isExplorerAssertionEligible(assertion: ExplorerAssertion, scope: ExplorerScope) {
  const batch = releaseRegistry.batches.find(
    (item) => item.batchId === assertion.batchId && item.decision === "eligible-existing-public-scope",
  );
  const record = batch?.records.find(
    (item) =>
      item.assertionId === assertion.id &&
      item.authority === assertion.taxon.authority &&
      item.acceptedId === assertion.taxon.authorityId &&
      item.scientificName === assertion.taxon.scientificName,
  );
  return (
    Boolean(
      record &&
        batch?.sourceId === assertion.source.id &&
        record.eligibleScopes.some((candidate) => candidate.kind === scope.kind && candidate.id === scope.id),
    ) &&
    assertion.releaseStatus === "eligible" &&
    assertion.rightsStatus === "eligible" &&
    assertion.currentPresence === false &&
    assertion.coordinates === null &&
    assertion.taxon.reviewStatus === "reviewed" &&
    assertion.taxon.rank === "species" &&
    assertion.taxon.id === `${assertion.taxon.authority}:${assertion.taxon.authorityId}` &&
    assertion.eligibleScopes.some((candidate) => sameScope(candidate, scope))
  );
}

function matchesFilters(assertion: ExplorerAssertion, filters: ExplorerFilters) {
  const query = normalizeExplorerSearch(filters.query);
  const names = [
    assertion.taxon.scientificName,
    assertion.recordedName,
    assertion.commonName?.en ?? "",
    assertion.commonName?.fil ?? "",
  ].map(normalizeExplorerSearch);
  const waterMatch =
    filters.waterType === "all" ||
    (filters.waterType === "unknown"
      ? assertion.waterTypes.length === 0
      : assertion.waterTypes.includes(filters.waterType));
  return (
    (!query || names.some((name) => name.includes(query))) &&
    waterMatch &&
    (filters.group === "all" || assertion.group === filters.group)
  );
}

/** Pure canonical grouping. Call only after admission and geographic precision gates. */
export function groupExplorerSpecies(assertions: readonly ExplorerAssertion[]): ExplorerSpecies[] {
  const groups = new Map<string, ExplorerAssertion[]>();
  for (const assertion of assertions)
    groups.set(assertion.taxon.id, [...(groups.get(assertion.taxon.id) ?? []), assertion]);
  return [...groups]
    .map(([id, rows]) => {
      const first = rows[0];
      return {
        id,
        scientificName: first.taxon.scientificName,
        commonName: rows.find((row) => row.commonName)?.commonName ?? null,
        taxon: first.taxon,
        group: first.group,
        waterTypes: [...new Set(rows.flatMap((row) => [...row.waterTypes]))],
        assertions: rows,
        sourceCount: new Set(rows.map((row) => row.source.id)).size,
        fishingGuide: UNAVAILABLE_FISHING_GUIDE,
      };
    })
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName, "en"));
}

export function selectExplorerResults(
  assertions: readonly ExplorerAssertion[],
  scope: ExplorerScope,
  filters: ExplorerFilters = DEFAULT_EXPLORER_FILTERS,
): ExplorerResult {
  const eligible = assertions.filter((assertion) => isExplorerAssertionEligible(assertion, scope));
  const uniqueEligible = [...new Map(eligible.map((assertion) => [assertion.id, assertion])).values()];
  const matching = uniqueEligible.filter((assertion) => matchesFilters(assertion, filters));
  const species = groupExplorerSpecies(matching);
  const unfiltered = groupExplorerSpecies(uniqueEligible);
  const available = uniqueEligible.length > 0;
  return {
    scope,
    coverage: available ? "partial" : "unavailable",
    state: !available ? "unavailable" : species.length ? "results" : "filtered-empty",
    count: available ? species.length : null,
    unfilteredCount: available ? unfiltered.length : null,
    assertionCount: matching.length,
    sourceCount: new Set(matching.map((assertion) => assertion.source.id)).size,
    unknownWaterTypeCount: unfiltered.filter((item) => item.waterTypes.length === 0).length,
    hasActiveFilters: Boolean(filters.query.trim() || filters.waterType !== "all" || filters.group !== "all"),
    species,
    limitations: coverageLimits,
  };
}

export const selectExplorerSpecies = selectExplorerResults;
export function getExplorerScopeCounts(
  assertions: readonly ExplorerAssertion[],
  scopes: readonly ExplorerScope[],
  filters: ExplorerFilters = DEFAULT_EXPLORER_FILTERS,
) {
  return scopes.map((scope) => selectExplorerResults(assertions, scope, filters));
}

/** Publication gate for future independently reviewed guides; no current guide is promoted by this helper. */
export function selectReviewedFishingGuide(
  guide: ExplorerFishingGuide | null | undefined,
  scope: ExplorerScope,
  asOf: string,
): ExplorerFishingGuide {
  const validDate = (value: string | null): value is string =>
    Boolean(
      value &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        Number.isFinite(Date.parse(value)) &&
        new Date(value).toISOString().slice(0, 10) === value,
    );
  if (
    !guide ||
    guide.status === "unreviewed" ||
    !validDate(guide.reviewedOn) ||
    !validDate(asOf) ||
    guide.reviewedOn > asOf ||
    !guide.applicableScopes.some((item) => sameScope(item, scope))
  )
    return UNAVAILABLE_FISHING_GUIDE;
  if (guide.status === "restricted")
    return {
      ...UNAVAILABLE_FISHING_GUIDE,
      status: "restricted",
      restriction: guide.restriction,
      notice: guide.notice,
      sources: guide.sources,
    };
  const rules = guide.rulesReview;
  if (
    rules.status !== "reviewed" ||
    !rules.jurisdiction ||
    !validDate(rules.validFrom) ||
    !validDate(rules.validUntil) ||
    rules.validFrom > rules.validUntil ||
    asOf < rules.validFrom ||
    asOf > rules.validUntil ||
    guide.sources.length === 0
  )
    return UNAVAILABLE_FISHING_GUIDE;
  const reviewed = (field: ExplorerGuideField) => guide.reviewedFields.includes(field);
  return {
    ...guide,
    method: reviewed("method") ? guide.method : null,
    bait: reviewed("bait") ? guide.bait : null,
    steps: reviewed("steps") && reviewed("method") ? guide.steps : [],
    gear: reviewed("gear") ? guide.gear : null,
    conditions: reviewed("conditions") ? guide.conditions : null,
    handling: reviewed("handling") ? guide.handling : null,
  };
}
