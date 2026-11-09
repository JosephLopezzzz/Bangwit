import type {
  ExplorerFilters,
  ExplorerGeographyLinks,
  ExplorerNavigationState,
  ExplorerScope,
  ExplorerSelection,
} from "../../types/species-explorer";

export function getExplorerSelectedScope(selection: ExplorerSelection): ExplorerScope {
  if (selection.waterbodyId) return { kind: "waterbody", id: selection.waterbodyId };
  if (selection.provinceId) return { kind: "province", id: selection.provinceId };
  if (selection.regionId) return { kind: "region", id: selection.regionId };
  return { kind: "country", id: "philippines" };
}

export function createExplorerState(selection: Partial<ExplorerSelection> = {}): ExplorerNavigationState {
  return {
    selection: {
      regionId: selection.regionId ?? null,
      provinceId: selection.provinceId ?? null,
      waterbodyId: selection.waterbodyId ?? null,
    },
    filters: { query: "", waterType: "all", group: "all" },
    selectedSpeciesId: null,
    showMap: true,
    expanded: false,
  };
}

/** Reconcile supplied relationships; never choose an arbitrary parent for a shared waterbody. */
export function reconcileExplorerSelection(
  selection: ExplorerSelection,
  geography: ExplorerGeographyLinks,
): ExplorerSelection {
  const region = geography.regions.find((item) => item.id === selection.regionId);
  const provinceId =
    selection.provinceId && region?.provinceIds.includes(selection.provinceId) ? selection.provinceId : null;
  const waterbody = geography.waterbodies.find((item) => item.id === selection.waterbodyId);
  const independentWaterbody = !selection.regionId && !selection.provinceId;
  const waterbodyId =
    waterbody && ((provinceId && waterbody.provinceIds.includes(provinceId)) || independentWaterbody)
      ? waterbody.id
      : null;
  return { regionId: region?.id ?? null, provinceId, waterbodyId };
}

export function selectExplorerLocation(
  state: ExplorerNavigationState,
  scope: ExplorerScope,
  geography: ExplorerGeographyLinks,
): ExplorerNavigationState {
  let selection: ExplorerSelection = { regionId: null, provinceId: null, waterbodyId: null };
  if (scope.kind === "region")
    selection.regionId = geography.regions.some((item) => item.id === scope.id) ? scope.id : null;
  if (scope.kind === "province") {
    const parent = geography.regions.find((item) => item.provinceIds.includes(scope.id));
    if (parent) selection = { regionId: parent.id, provinceId: scope.id, waterbodyId: null };
  }
  if (scope.kind === "waterbody") {
    const waterbody = geography.waterbodies.find((item) => item.id === scope.id);
    const currentProvince = state.selection.provinceId;
    const provinceId =
      waterbody && currentProvince && waterbody.provinceIds.includes(currentProvince)
        ? currentProvince
        : waterbody?.provinceIds.length === 1
          ? waterbody.provinceIds[0]
          : null;
    const parent = geography.regions.find((item) => provinceId && item.provinceIds.includes(provinceId));
    // A shared waterbody can be selected directly without assigning it to an arbitrary adjoining province.
    selection = { regionId: parent?.id ?? null, provinceId, waterbodyId: waterbody?.id ?? null };
  }
  return {
    ...state,
    selection,
    selectedSpeciesId: null,
    expanded: false,
    showMap: scope.kind === "country" || scope.kind === "region" ? true : state.showMap,
  };
}

export function setExplorerFilters(
  state: ExplorerNavigationState,
  filters: Partial<ExplorerFilters>,
): ExplorerNavigationState {
  return { ...state, filters: { ...state.filters, ...filters }, selectedSpeciesId: null, expanded: false };
}
