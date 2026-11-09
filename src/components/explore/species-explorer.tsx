"use client";

import { ChevronRight, Compass, Droplets, Fish, MapPin, Search, Waves } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AreaExplorer, type SpeciesMapOptions } from "@/components/area-explorer";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import { SpeciesCard } from "@/components/explore/species-card";
import { SpeciesDetailDialog } from "@/components/explore/species-detail-dialog";
import {
  EXPLORER_COUNTRY_ID,
  EXPLORER_GEOGRAPHY_SOURCE,
  EXPLORER_PROVINCES,
  EXPLORER_REGIONS,
  EXPLORER_WATERBODIES,
  type ExplorerMapBounds,
  getExplorerRegionForProvince,
} from "@/data/explorer-geography";
import type { ProvinceId } from "@/data/phl-provinces";
import { getSpeciesArtwork } from "@/data/species-artwork";
import { formatExplorerText, getSpeciesExplorerCopy } from "@/i18n/species-explorer";
import { EXPLORER_ASSERTIONS } from "@/lib/species-explorer/adapters";
import { selectExplorerResults } from "@/lib/species-explorer/selectors";
import { getExplorerSelectedScope } from "@/lib/species-explorer/state";
import type { ExplorerFilters, ExplorerSelection, ExplorerSpecies } from "@/types/species-explorer";
import "./species-explorer.css";

const emptySelection: ExplorerSelection = { regionId: null, provinceId: null, waterbodyId: null };
const emptyFilters: ExplorerFilters = { query: "", waterType: "all", group: "all" };

function combinedBounds(provinceIds: readonly string[]): ExplorerMapBounds | undefined {
  const provinces = EXPLORER_PROVINCES.filter(({ id }) => provinceIds.includes(id));
  if (!provinces.length) return undefined;
  const x = Math.min(...provinces.map(({ bounds }) => bounds.x));
  const y = Math.min(...provinces.map(({ bounds }) => bounds.y));
  return {
    x,
    y,
    width: Math.max(...provinces.map(({ bounds }) => bounds.x + bounds.width)) - x,
    height: Math.max(...provinces.map(({ bounds }) => bounds.y + bounds.height)) - y,
  };
}

export function SpeciesExplorer() {
  const { lang, setSelectedProvince, setSelectedArea } = useBangwit();
  const copy = getSpeciesExplorerCopy(lang);
  const [enabled, setEnabled] = useState(true);
  const [selection, setSelection] = useState<ExplorerSelection>(emptySelection);
  const [filters, setFilters] = useState<ExplorerFilters>(emptyFilters);
  const [selectedSpecies, setSelectedSpecies] = useState<ExplorerSpecies | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [mapOpen, setMapOpen] = useState(true);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const scope = useMemo(() => getExplorerSelectedScope(selection), [selection]);
  const region = EXPLORER_REGIONS.find(({ id }) => id === selection.regionId);
  const province = EXPLORER_PROVINCES.find(({ id }) => id === selection.provinceId);
  const waterbody = EXPLORER_WATERBODIES.find(({ id }) => id === selection.waterbodyId);
  const placeLabel = waterbody?.name ?? province?.name ?? region?.name ?? copy.Philippines;
  const result = useMemo(() => selectExplorerResults(EXPLORER_ASSERTIONS, scope, filters), [scope, filters]);
  const gallerySpecies = [...result.species].sort(
    (a, b) =>
      Number(Boolean(getSpeciesArtwork(b.id))) - Number(Boolean(getSpeciesArtwork(a.id))) ||
      a.scientificName.localeCompare(b.scientificName, "en"),
  );

  function navigate(next: ExplorerSelection) {
    setSelection(next);
    setSelectedSpecies(null);
    setExpanded(false);
    setMapOpen(!next.provinceId && !next.waterbodyId);
    if (next.provinceId) setSelectedProvince(next.provinceId);
    const pilotAreas: Record<string, string> = {
      "ph-wb-manila-bay": "Manila Bay",
      "ph-wb-bacoor-bay": "Bacoor Bay",
      "ph-wb-canacao-bay": "Cañacao Bay",
    };
    if (next.waterbodyId && pilotAreas[next.waterbodyId]) setSelectedArea(pilotAreas[next.waterbodyId]);
    if ((next.provinceId || next.waterbodyId) && window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() => {
        const heading = document.getElementById("explorer-results-heading");
        heading?.focus({ preventScroll: true });
        heading?.scrollIntoView({ block: "start" });
      });
    }
  }

  function chooseProvince(provinceId: ProvinceId) {
    navigate({ regionId: getExplorerRegionForProvince(provinceId)?.id ?? null, provinceId, waterbodyId: null });
  }

  function choosePlace(id: string) {
    if (id === EXPLORER_COUNTRY_ID) return navigate(emptySelection);
    const nextRegion = EXPLORER_REGIONS.find((item) => item.id === id);
    if (nextRegion) return navigate({ regionId: id, provinceId: null, waterbodyId: null });
    const nextProvince = EXPLORER_PROVINCES.find((item) => item.id === id);
    if (nextProvince) return chooseProvince(nextProvince.id);
    const nextWaterbody = EXPLORER_WATERBODIES.find((item) => item.id === id);
    if (!nextWaterbody) return;
    const parentProvince =
      nextWaterbody.provinceIds.find((item) => item === selection.provinceId) ??
      (nextWaterbody.provinceIds.length === 1 ? nextWaterbody.provinceIds[0] : null);
    navigate({
      regionId: parentProvince
        ? (getExplorerRegionForProvince(parentProvince)?.id ?? null)
        : nextWaterbody.regionIds.length === 1
          ? nextWaterbody.regionIds[0]
          : null,
      provinceId: parentProvince,
      waterbodyId: id,
    });
  }

  function changeFilters(next: ExplorerFilters) {
    setFilters(next);
    setExpanded(false);
    setSelectedSpecies(null);
  }

  const scopeProvinces = province
    ? [province.id]
    : waterbody
      ? waterbody.provinceIds
      : region
        ? region.provinceIds
        : EXPLORER_PROVINCES.map(({ id }) => id);
  const bounds =
    province?.bounds ?? (waterbody ? combinedBounds(waterbody.provinceIds) : (region?.bounds ?? undefined));
  const markerLocations =
    scope.kind === "country"
      ? EXPLORER_REGIONS.filter((item) => item.center).map((item) => ({
          id: item.id,
          name: item.name,
          center: item.center as { x: number; y: number },
          kind: "region" as const,
        }))
      : EXPLORER_PROVINCES.filter(({ id }) => scopeProvinces.includes(id)).map((item) => ({
          id: item.id,
          name: item.name,
          center: item.center,
          kind: "province" as const,
        }));
  const markers: SpeciesMapOptions["markers"] = (scope.kind === "waterbody" ? [] : markerLocations).flatMap((item) => {
    const count = selectExplorerResults(EXPLORER_ASSERTIONS, { kind: item.kind, id: item.id }, filters).count;
    return count === null
      ? []
      : [
          {
            id: item.id,
            x: item.center.x,
            y: item.center.y,
            count,
            label: `${item.name}: ${copy.countResults(count)}`,
            onSelect: () => choosePlace(item.id),
          },
        ];
  });

  const placeOptions = [
    { value: EXPLORER_COUNTRY_ID, label: copy.Philippines, icon: Compass },
    ...EXPLORER_REGIONS.map(({ id, name }) => ({ value: id, label: `${name} · ${copy.region}`, icon: Compass })),
    ...EXPLORER_PROVINCES.map(({ id, name, aliases }) => ({
      value: id,
      label: `${name}${aliases.length ? ` (${aliases.filter((alias) => alias !== name).join(" / ")})` : ""} · ${copy.province}`,
      icon: MapPin,
    })),
    ...EXPLORER_WATERBODIES.map(({ id, name }) => ({ value: id, label: `${name} · ${copy.waterbody}`, icon: Waves })),
  ];
  const children =
    scope.kind === "country"
      ? EXPLORER_REGIONS.map((item) => ({ ...item, kind: "region" as const }))
      : scope.kind === "region"
        ? EXPLORER_PROVINCES.filter(({ id }) => scopeProvinces.includes(id)).map((item) => ({
            ...item,
            kind: "province" as const,
          }))
        : scope.kind === "province"
          ? EXPLORER_WATERBODIES.filter((item) => item.provinceIds.some((id) => id === province?.id)).map((item) => ({
              ...item,
              kind: "waterbody" as const,
            }))
          : [];

  return (
    <section className="species-explorer" aria-labelledby="species-explorer-heading">
      <div className="species-explorer-title">
        <div>
          <h2 id="species-explorer-heading">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <button
          type="button"
          className="ui-button ui-button--quiet species-explorer-switch"
          onClick={() => {
            setEnabled(!enabled);
            setSelectedSpecies(null);
          }}
        >
          {enabled ? copy.previousMap : copy.newExplorer}
        </button>
      </div>
      {!enabled ? (
        <AreaExplorer />
      ) : (
        <div id="areaPicker">
          <div className="ui-card species-explorer-controls">
            <nav aria-label={copy.breadcrumbLabel} className="species-explorer-breadcrumbs">
              <button
                type="button"
                aria-current={scope.kind === "country" ? "location" : undefined}
                onClick={() => navigate(emptySelection)}
              >
                {copy.Philippines}
              </button>
              {region && (
                <>
                  <ChevronRight aria-hidden="true" size={14} />
                  <button
                    type="button"
                    aria-current={scope.kind === "region" ? "location" : undefined}
                    onClick={() => navigate({ regionId: region.id, provinceId: null, waterbodyId: null })}
                  >
                    {region.name}
                  </button>
                </>
              )}
              {province && (
                <>
                  <ChevronRight aria-hidden="true" size={14} />
                  <button
                    type="button"
                    aria-current={scope.kind === "province" ? "location" : undefined}
                    onClick={() => chooseProvince(province.id)}
                  >
                    {province.name}
                  </button>
                </>
              )}
              {waterbody && (
                <>
                  <ChevronRight aria-hidden="true" size={14} />
                  <span aria-current="location">{waterbody.name}</span>
                </>
              )}
            </nav>
            <div className="species-explorer-filter-row">
              <div className="species-explorer-place-control">
                <DropdownSelect
                  id="explorer-location"
                  label={copy.location}
                  value={scope.id}
                  options={placeOptions}
                  onValueChange={choosePlace}
                  searchable={{ placeholder: copy.searchPlaceholder, noResults: copy.searchNoResults }}
                />
              </div>
              <DropdownSelect
                id="explorer-water-type"
                label={copy.waterType}
                value={filters.waterType}
                onValueChange={(value) =>
                  changeFilters({ ...filters, waterType: value as ExplorerFilters["waterType"] })
                }
                options={[
                  { value: "all", label: copy.allWaterTypes, icon: Droplets },
                  ...(["freshwater", "saltwater", "mixed", "unknown"] as const).map((value) => ({
                    value,
                    label: copy.waterTypes[value],
                    icon: Waves,
                  })),
                ]}
              />
              <DropdownSelect
                id="explorer-species-group"
                label={copy.group}
                value={filters.group}
                onValueChange={(value) => changeFilters({ ...filters, group: value as ExplorerFilters["group"] })}
                options={[
                  { value: "all", label: copy.allGroups, icon: Fish },
                  ...(["fish", "crustacean", "mollusk", "unknown"] as const).map((value) => ({
                    value,
                    label: copy.groups[value],
                    icon: Fish,
                  })),
                ]}
              />
            </div>
            {children.length > 0 && (
              <details className="species-explorer-places" key={`${scope.kind}:${scope.id}`}>
                <summary>
                  {copy.places}
                  <span>{children.length}</span>
                </summary>
                <div>
                  {children.map((item) => {
                    const count = selectExplorerResults(
                      EXPLORER_ASSERTIONS,
                      { kind: item.kind, id: item.id },
                      filters,
                    ).count;
                    return (
                      <button type="button" key={item.id} onClick={() => choosePlace(item.id)}>
                        <span>{item.name}</span>
                        <small>{count === null ? copy.noCoverage : copy.countResults(count)}</small>
                        <ChevronRight size={14} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </details>
            )}
          </div>
          <div className="species-explorer-layout">
            <AreaExplorer
              explorer={{
                activeProvinceId: province?.id ?? null,
                bounds,
                provinceIds: scopeProvinces,
                onProvinceSelect: chooseProvince,
                markers,
                mapOpen,
                onMapOpenChange: setMapOpen,
                mapLabel: copy.mapLabel,
                focusLocationLabel: copy.focusLocation,
                showMapLabel: copy.showMap,
                hideMapLabel: copy.hideMap,
              }}
            />
            <section className="species-explorer-results" aria-labelledby="explorer-results-heading">
              <div className="species-explorer-result-heading">
                <div>
                  <h3 id="explorer-results-heading" tabIndex={-1}>
                    {placeLabel}
                  </h3>
                  <p aria-live="polite">{result.count === null ? copy.noCoverage : copy.countResults(result.count)}</p>
                </div>
                {result.coverage !== "unavailable" && (
                  <span className="species-explorer-coverage-label">{copy.partialCoverage}</span>
                )}
              </div>
              <label className="species-explorer-species-search">
                <span>{copy.searchSpecies}</span>
                <span>
                  <Search size={17} aria-hidden="true" />
                  <input
                    className="ui-input"
                    type="search"
                    value={filters.query}
                    onChange={(event) => changeFilters({ ...filters, query: event.target.value })}
                    placeholder={copy.searchSpecies}
                  />
                </span>
              </label>
              {result.state === "results" ? (
                <>
                  <p className="species-explorer-scope-note">{copy.coverageNote}</p>
                  <div className="species-explorer-gallery">
                    {(expanded ? gallerySpecies : gallerySpecies.slice(0, 4)).map((species) => (
                      <SpeciesCard
                        key={species.id}
                        species={species}
                        artwork={getSpeciesArtwork(species.id)}
                        lang={lang}
                        onSelect={(item, trigger) => {
                          returnFocusRef.current = trigger;
                          setSelectedSpecies(item);
                        }}
                      />
                    ))}
                  </div>
                  {result.species.length > 4 && (
                    <button
                      type="button"
                      className="ui-button ui-button--secondary species-explorer-show-all"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? copy.showLess : `${copy.showAll} (${result.species.length})`}
                    </button>
                  )}
                  {result.unknownWaterTypeCount > 0 && (
                    <p className="species-explorer-scope-note">{copy.habitatUnknown}</p>
                  )}
                </>
              ) : (
                <div className="ui-card species-explorer-empty">
                  <Waves aria-hidden="true" size={30} />
                  <h4>{result.state === "unavailable" ? copy.noCoverage : copy.noMatches}</h4>
                  <p>{result.state === "unavailable" ? copy.coverageUnavailableDescription : copy.habitatUnknown}</p>
                  {result.hasActiveFilters && (
                    <button
                      type="button"
                      className="ui-button ui-button--secondary"
                      onClick={() => changeFilters(emptyFilters)}
                    >
                      {copy.resetFilters}
                    </button>
                  )}
                </div>
              )}
              <details className="species-explorer-source-note">
                <summary>{copy.evidenceScope}</summary>
                <p>{EXPLORER_GEOGRAPHY_SOURCE.limitations[lang]}</p>
                {scope.kind === "waterbody" && <p>{copy.waterbodyMapNote}</p>}
                {result.limitations.map((limit) => (
                  <p key={limit.en}>{limit[lang]}</p>
                ))}
                <p>
                  {formatExplorerText(copy.showingCount, {
                    shown: expanded ? result.species.length : Math.min(4, result.species.length),
                    total: result.species.length,
                  })}
                </p>
              </details>
            </section>
          </div>
          <SpeciesDetailDialog
            species={selectedSpecies}
            scope={result.scope}
            artwork={selectedSpecies ? getSpeciesArtwork(selectedSpecies.id) : null}
            lang={lang}
            placeLabel={placeLabel}
            onClose={() => setSelectedSpecies(null)}
            returnFocusRef={returnFocusRef}
          />
        </div>
      )}
    </section>
  );
}
