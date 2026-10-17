"use client";

import {
  ArrowUpRight,
  ChevronDown,
  LocateFixed,
  MapPin,
  Minus,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { type DropdownOption, DropdownSelect } from "@/components/dropdown-select";
import { WarningCallout, WarningDetails, WarningLegend, WarningToolbar } from "@/components/map-warning-ui";
import { useMapAdvisories } from "@/components/use-map-advisories";
import { CAVITE_AREAS } from "@/data/cavite-areas";
import { type AdvisoryDemoScenario, createAdvisoryDemo, DEMO_ADVISORY_NOW } from "@/data/map-advisory-demo";
import { PHILIPPINE_PROVINCE_PATHS } from "@/data/phl-province-paths";
import { CAVITE_PROVINCE_ID, PHILIPPINE_PROVINCES, type ProvinceId } from "@/data/phl-provinces";
import { getProvinceWarning, type HazardType, WARNING_RANK } from "@/lib/map-advisories";
import "./area-explorer.css";
import "./map-warnings.css";

const MAX_ZOOM = 5;
const provinceOptions: DropdownOption[] = PHILIPPINE_PROVINCES.map(({ id, name }) => ({
  value: id,
  label: name,
  icon: MapPin,
}));
const mapBounds = PHILIPPINE_PROVINCES.reduce(
  (bounds, province) => ({
    left: Math.min(bounds.left, province.bounds.x),
    top: Math.min(bounds.top, province.bounds.y),
    right: Math.max(bounds.right, province.bounds.x + province.bounds.width),
    bottom: Math.max(bounds.bottom, province.bounds.y + province.bounds.height),
  }),
  {
    left: Number.POSITIVE_INFINITY,
    top: Number.POSITIVE_INFINITY,
    right: Number.NEGATIVE_INFINITY,
    bottom: Number.NEGATIVE_INFINITY,
  },
);
const mapCenter = { x: (mapBounds.left + mapBounds.right) / 2, y: (mapBounds.top + mapBounds.bottom) / 2 };

type MapCamera = {
  centerX: number;
  centerY: number;
  zoom: number;
  targetProvinceId: ProvinceId | null;
};

function provinceBoundsCenter(province: (typeof PHILIPPINE_PROVINCES)[number]) {
  return {
    x: province.bounds.x + province.bounds.width / 2,
    y: province.bounds.y + province.bounds.height / 2,
  };
}

function clampCameraCenter(centerX: number, centerY: number, viewWidth: number, viewHeight: number) {
  const horizontalMargin = viewWidth * 0.4;
  const verticalMargin = viewHeight * 0.4;
  return {
    centerX: Math.max(mapBounds.left - horizontalMargin, Math.min(mapBounds.right + horizontalMargin, centerX)),
    centerY: Math.max(mapBounds.top - verticalMargin, Math.min(mapBounds.bottom + verticalMargin, centerY)),
  };
}

function directionalProvince(currentId: ProvinceId, direction: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") {
  const current = PHILIPPINE_PROVINCES.find(({ id }) => id === currentId) ?? PHILIPPINE_PROVINCES[0];
  const origin = current.center;
  const vector = {
    x: direction === "ArrowRight" ? 1 : direction === "ArrowLeft" ? -1 : 0,
    y: direction === "ArrowDown" ? 1 : direction === "ArrowUp" ? -1 : 0,
  };
  const candidates = PHILIPPINE_PROVINCES.filter(({ id }) => id !== currentId)
    .map((province) => {
      const dx = province.center.x - origin.x;
      const dy = province.center.y - origin.y;
      const forward = dx * vector.x + dy * vector.y;
      const lateral = Math.abs(dx * vector.y - dy * vector.x);
      return { province, score: forward + lateral * 1.8 };
    })
    .filter(({ province }) => {
      const dx = province.center.x - origin.x;
      const dy = province.center.y - origin.y;
      return dx * vector.x + dy * vector.y > 0;
    })
    .sort((a, b) => a.score - b.score);

  return candidates[0]?.province.id ?? currentId;
}

function LocationOptions({ group }: { group: string }) {
  const { selectedArea, setSelectedArea, dict } = useBangwit();

  return (
    <fieldset className="location-options">
      <legend className="sr-only">{dict.areaExplorer.selectAreaLabel}</legend>
      {CAVITE_AREAS.map((name, index) => (
        <label key={name} className="location-row" data-selected={selectedArea === name}>
          <span className="location-number" aria-hidden="true">
            {index + 1}
          </span>
          <span className="location-copy">
            <span className="location-name">{name}</span>
            <span className="location-subtitle">{dict.areaExplorer.areas[name]?.subtitle}</span>
          </span>
          <input
            type="radio"
            name={group}
            value={name}
            checked={selectedArea === name}
            onChange={() => setSelectedArea(name)}
          />
        </label>
      ))}
    </fieldset>
  );
}

export function AreaExplorer() {
  const { selectedArea, selectedProvince, setSelectedProvince, dict, lang } = useBangwit();
  const liveAdvisories = useMapAdvisories();
  const [demoScenario, setDemoScenario] = useState<AdvisoryDemoScenario | null>(null);
  const [hazardFilter, setHazardFilter] = useState<HazardType | "all">("all");
  const [regionDetailsOpen, setRegionDetailsOpen] = useState(true);
  const [dismissedCalloutKey, setDismissedCalloutKey] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const detailsToggleRef = useRef<HTMLButtonElement>(null);
  const warningSnapshot = demoScenario ? createAdvisoryDemo(demoScenario) : liveAdvisories.snapshot;
  const warningNow = demoScenario
    ? DEMO_ADVISORY_NOW + (demoScenario === "stale" ? 4 * 60 * 60 * 1000 : 0)
    : liveAdvisories.now;
  const warningConnectionUnavailable =
    demoScenario === "stale" || (!demoScenario && liveAdvisories.connection !== "ready");
  const warningsByProvince = new Map(
    PHILIPPINE_PROVINCES.map((province) => [
      province.id,
      getProvinceWarning(warningSnapshot, province.id, warningNow, warningConnectionUnavailable),
    ]),
  );
  const filteredWarnings = new Map(
    PHILIPPINE_PROVINCES.map((province) => [
      province.id,
      getProvinceWarning(warningSnapshot, province.id, warningNow, warningConnectionUnavailable, hazardFilter),
    ]),
  );
  const affectedProvinces = PHILIPPINE_PROVINCES.flatMap((province) => {
    const warning = filteredWarnings.get(province.id);
    return warning && warning.alerts.length > 0 ? [{ province, warning }] : [];
  }).sort((a, b) => WARNING_RANK[b.warning.alerts[0].level] - WARNING_RANK[a.warning.alerts[0].level]);
  const urgentProvince = affectedProvinces[0];
  const urgentAlert = urgentProvince?.warning.alerts[0];
  const warningCalloutKey = urgentAlert
    ? [
        demoScenario ?? "live",
        urgentAlert.id,
        urgentAlert.issuedAt,
        urgentAlert.expiresAt,
        urgentAlert.level,
        urgentProvince.warning.stale,
      ].join("|")
    : null;
  const visibleCalloutKey = warningCalloutKey !== dismissedCalloutKey ? warningCalloutKey : null;
  const affectedCount = [...warningsByProvince.values()].filter((warning) => warning.alerts.length > 0).length;
  const stageRef = useRef<HTMLDivElement>(null);
  const mapSvgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
    viewWidth: number;
    viewHeight: number;
  } | null>(null);
  const didPanRef = useRef(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceId | null>(null);
  const [keyboardProvinceId, setKeyboardProvinceId] = useState<ProvinceId>(selectedProvince);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [camera, setCamera] = useState<MapCamera>({
    centerX: mapCenter.x,
    centerY: mapCenter.y,
    zoom: 1,
    targetProvinceId: null,
  });
  const selectedProvinceData =
    PHILIPPINE_PROVINCES.find(({ id }) => id === selectedProvince) ?? PHILIPPINE_PROVINCES[0];
  const hoveredProvinceData = PHILIPPINE_PROVINCES.find(({ id }) => id === hoveredProvince);
  const targetProvinceData = PHILIPPINE_PROVINCES.find(({ id }) => id === camera.targetProvinceId);
  const labelProvince = hoveredProvinceData ?? selectedProvinceData;
  const aspect = stageSize.width > 0 && stageSize.height > 0 ? stageSize.width / stageSize.height : 1.2;
  const fitBounds = targetProvinceData
    ? targetProvinceData.bounds
    : {
        x: mapBounds.left,
        y: mapBounds.top,
        width: mapBounds.right - mapBounds.left,
        height: mapBounds.bottom - mapBounds.top,
      };
  const fitPadding = targetProvinceData ? 1.45 : 1.08;
  const baseViewWidth = Math.max(fitBounds.width * fitPadding, fitBounds.height * aspect * fitPadding);
  const baseViewHeight = baseViewWidth / aspect;
  const viewWidth = baseViewWidth / camera.zoom;
  const viewHeight = baseViewHeight / camera.zoom;
  const viewX = camera.centerX - viewWidth / 2;
  const viewY = camera.centerY - viewHeight / 2;
  const isCavite = selectedProvince === CAVITE_PROVINCE_ID;
  const isHistoricalMaguindanao = selectedProvinceData.sourceName === "Maguindanao";
  const labelMaxWidth = Math.min(stageSize.width * 0.4, 180);
  const labelAnchorX =
    ((labelProvince.bounds.x + labelProvince.bounds.width * 0.85 - viewX) / viewWidth) * stageSize.width;
  const labelAnchorY = ((labelProvince.center.y - viewY) / viewHeight) * stageSize.height;
  const mapLabelLeft = stageSize.width
    ? Math.max(8, Math.min(stageSize.width - labelMaxWidth - 16, labelAnchorX))
    : undefined;
  const mapLabelTop = stageSize.height ? Math.max(16, Math.min(stageSize.height - 16, labelAnchorY)) : undefined;
  const labelInView =
    labelProvince.bounds.x < viewX + viewWidth &&
    labelProvince.bounds.x + labelProvince.bounds.width > viewX &&
    labelProvince.bounds.y < viewY + viewHeight &&
    labelProvince.bounds.y + labelProvince.bounds.height > viewY;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setStageSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        !(event.target instanceof Node) ||
        !workspaceRef.current?.contains(event.target) ||
        (!regionDetailsOpen && !visibleCalloutKey)
      )
        return;
      event.preventDefault();
      setRegionDetailsOpen(false);
      if (visibleCalloutKey) setDismissedCalloutKey(visibleCalloutKey);
      setHoveredProvince(null);
      detailsToggleRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [regionDetailsOpen, visibleCalloutKey]);

  useEffect(() => {
    const mapSvg = mapSvgRef.current;
    if (!mapSvg) return;

    const handleMapWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();

      const rect = mapSvg.getBoundingClientRect();
      if (!rect.width || !rect.height || event.deltaY === 0) return;

      const deltaMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? rect.height
            : 1;
      const deltaPixels = event.deltaY * deltaMultiplier;
      const zoomFactor = Math.exp(-Math.max(-400, Math.min(400, deltaPixels)) * 0.0015);
      const anchorX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) - 0.5;
      const anchorY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) - 0.5;

      setCamera((current) => {
        const zoom = Math.max(1, Math.min(MAX_ZOOM, current.zoom * zoomFactor));
        if (zoom === current.zoom) return current;

        const currentViewWidth = baseViewWidth / current.zoom;
        const currentViewHeight = baseViewHeight / current.zoom;
        const nextViewWidth = baseViewWidth / zoom;
        const nextViewHeight = baseViewHeight / zoom;
        const mapX = current.centerX + anchorX * currentViewWidth;
        const mapY = current.centerY + anchorY * currentViewHeight;
        const clampedCenter = clampCameraCenter(
          mapX - anchorX * nextViewWidth,
          mapY - anchorY * nextViewHeight,
          nextViewWidth,
          nextViewHeight,
        );

        return { ...current, ...clampedCenter, zoom };
      });
    };

    mapSvg.addEventListener("wheel", handleMapWheel, { passive: false });
    return () => mapSvg.removeEventListener("wheel", handleMapWheel);
  }, [baseViewHeight, baseViewWidth]);

  function selectProvince(provinceId: ProvinceId) {
    setSelectedProvince(provinceId);
    setKeyboardProvinceId(provinceId);
    setHoveredProvince(null);
    setRegionDetailsOpen(true);
  }

  function dismissRegionDetails() {
    setRegionDetailsOpen(false);
    if (warningCalloutKey) setDismissedCalloutKey(warningCalloutKey);
    setHoveredProvince(null);
    detailsToggleRef.current?.focus({ preventScroll: true });
  }

  function focusProvince(provinceId: ProvinceId) {
    const province = PHILIPPINE_PROVINCES.find(({ id }) => id === provinceId);
    if (!province) return;
    const center = provinceBoundsCenter(province);
    setCamera({ centerX: center.x, centerY: center.y, zoom: 1, targetProvinceId: provinceId });
  }

  function fitPhilippines() {
    setCamera({ centerX: mapCenter.x, centerY: mapCenter.y, zoom: 1, targetProvinceId: null });
  }

  function changeZoom(direction: 1 | -1) {
    setCamera((current) => {
      const zoom = Math.max(1, Math.min(MAX_ZOOM, current.zoom + direction));
      const width = baseViewWidth / zoom;
      const height = baseViewHeight / zoom;
      const clampedCenter = clampCameraCenter(current.centerX, current.centerY, width, height);
      return { ...current, ...clampedCenter, zoom };
    });
  }

  function handleMapPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    didPanRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerX: camera.centerX,
      centerY: camera.centerY,
      viewWidth,
      viewHeight,
    };
  }

  function handleMapPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
      didPanRef.current = true;
      setIsPanning(true);
      setHoveredProvince(null);
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (!rect.width || !rect.height || !didPanRef.current) return;
    const centerX = drag.centerX - (deltaX / rect.width) * drag.viewWidth;
    const centerY = drag.centerY - (deltaY / rect.height) * drag.viewHeight;
    setCamera((current) => ({
      ...current,
      ...clampCameraCenter(centerX, centerY, drag.viewWidth, drag.viewHeight),
    }));
  }

  function handleMapPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsPanning(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleProvinceKeyDown(event: ReactKeyboardEvent<SVGPathElement>, provinceId: ProvinceId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectProvince(provinceId);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const province = event.key === "Home" ? PHILIPPINE_PROVINCES[0] : PHILIPPINE_PROVINCES.at(-1);
      if (!province) return;
      setKeyboardProvinceId(province.id);
      document.getElementById(`province-region-${province.id}`)?.focus({ preventScroll: true });
      focusProvince(province.id);
      return;
    }

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      event.preventDefault();
      const nextId = directionalProvince(provinceId, event.key);
      setKeyboardProvinceId(nextId);
      document.getElementById(`province-region-${nextId}`)?.focus({ preventScroll: true });
      focusProvince(nextId);
    }
  }

  return (
    <div ref={workspaceRef} className="explore-workspace" data-details-open={regionDetailsOpen}>
      <section aria-labelledby="area-heading" className="explore-map-panel ui-card">
        <div className="explore-map-heading">
          <h2 id="area-heading">{dict.areaExplorer.heading}</h2>
          <div className="explore-map-heading-actions">
            <DropdownSelect
              id="province-select"
              label={dict.areaExplorer.provinceSelectLabel}
              value={selectedProvince}
              onValueChange={(province) => {
                const provinceId = province as ProvinceId;
                selectProvince(provinceId);
                focusProvince(provinceId);
              }}
              options={provinceOptions}
              searchable={{
                placeholder: dict.areaExplorer.provinceSearchLabel,
                noResults: dict.areaExplorer.provinceNoResults,
                resultCountLabel: dict.areaExplorer.provinceResultsCount,
              }}
              className="dropdown-select--compact explore-province-select"
            />
            <button
              ref={detailsToggleRef}
              type="button"
              className="ui-button ui-button--secondary ui-button--icon"
              aria-expanded={regionDetailsOpen}
              aria-controls="areaPicker"
              aria-label={
                regionDetailsOpen ? dict.areaExplorer.hideProvinceDetails : dict.areaExplorer.showProvinceDetails
              }
              title={regionDetailsOpen ? dict.areaExplorer.hideProvinceDetails : dict.areaExplorer.showProvinceDetails}
              onClick={() => (regionDetailsOpen ? dismissRegionDetails() : setRegionDetailsOpen(true))}
            >
              {regionDetailsOpen ? (
                <PanelRightClose aria-hidden="true" size={17} />
              ) : (
                <PanelRightOpen aria-hidden="true" size={17} />
              )}
            </button>
          </div>
        </div>

        <WarningToolbar
          demo={demoScenario}
          onDemoChange={(scenario) => {
            setDemoScenario(scenario);
            setHazardFilter("all");
            setDismissedCalloutKey(null);
          }}
          connection={liveAdvisories.connection}
          refreshing={liveAdvisories.refreshing}
          onRefresh={() => void liveAdvisories.refresh()}
          snapshot={liveAdvisories.snapshot}
        />
        <fieldset
          className="explore-map"
          aria-labelledby="area-heading"
          aria-describedby="province-map-description map-warning-description"
        >
          <p id="province-map-description" className="sr-only">
            {dict.areaExplorer.mapDescription}
          </p>
          <p id="map-warning-description" className="sr-only">
            {demoScenario ? dict.mapWarnings.demoDescription : dict.mapWarnings.connectedDescription}{" "}
            {dict.mapWarnings.filterNotice}
          </p>
          <div ref={stageRef} className="explore-map-stage">
            {/* biome-ignore lint/a11y/useSemanticElements: SVG groups aggregate province controls under one accessible map label. */}
            <svg
              ref={mapSvgRef}
              className="province-map-svg"
              viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
              preserveAspectRatio="xMidYMid meet"
              role="group"
              aria-labelledby="area-heading"
              data-panning={isPanning}
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={handleMapPointerUp}
              onPointerCancel={handleMapPointerUp}
              onClickCapture={(event) => {
                if (didPanRef.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  didPanRef.current = false;
                }
              }}
            >
              <title>{dict.areaExplorer.heading}</title>
              <defs>
                <pattern id="map-warning-stale-pattern" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M-1 1 1-1M0 5 5 0M4 6 6 4" className="map-warning-pattern-line" />
                </pattern>
              </defs>
              {PHILIPPINE_PROVINCES.map((province) => (
                // biome-ignore lint/a11y/useSemanticElements: SVG paths provide province-shaped controls that HTML buttons cannot match.
                <path
                  id={`province-region-${province.id}`}
                  key={province.id}
                  className="province-map-region"
                  d={PHILIPPINE_PROVINCE_PATHS[province.id]}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  role="button"
                  tabIndex={keyboardProvinceId === province.id ? 0 : -1}
                  focusable="true"
                  aria-label={
                    dict.areaExplorer.provinceSelectLabel +
                    ": " +
                    province.name +
                    ". " +
                    (demoScenario ? `${dict.mapWarnings.demoBadge}. ` : "") +
                    (filteredWarnings.get(province.id)?.alerts[0]?.title[lang] ??
                      dict.mapWarnings.levels[filteredWarnings.get(province.id)?.level ?? "unknown"]) +
                    (filteredWarnings.get(province.id)?.stale ? `. ${dict.mapWarnings.stale}` : "")
                  }
                  aria-pressed={selectedProvince === province.id}
                  data-selected={selectedProvince === province.id}
                  data-hovered={hoveredProvince === province.id}
                  data-warning-level={filteredWarnings.get(province.id)?.level ?? "unknown"}
                  data-warning-stale={filteredWarnings.get(province.id)?.stale ?? false}
                  onPointerEnter={() => setHoveredProvince(province.id)}
                  onPointerLeave={() => setHoveredProvince(null)}
                  onFocus={() => {
                    setKeyboardProvinceId(province.id);
                    setHoveredProvince(province.id);
                  }}
                  onBlur={() => setHoveredProvince(null)}
                  onClick={() => selectProvince(province.id)}
                  onKeyDown={(event) => handleProvinceKeyDown(event, province.id)}
                />
              ))}
              {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: Decorative SVG hatching is explicitly non-focusable and has no interaction handlers. */}
              <g aria-hidden="true" pointerEvents="none" focusable="false">
                {PHILIPPINE_PROVINCES.filter((province) => {
                  const warning = filteredWarnings.get(province.id);
                  return warning?.stale && warning.alerts.length > 0;
                }).map((province) => (
                  <path
                    key={`stale-${province.id}`}
                    d={PHILIPPINE_PROVINCE_PATHS[province.id]}
                    className="map-warning-hatch"
                    fillRule="evenodd"
                    focusable="false"
                  />
                ))}
              </g>
            </svg>
            {labelInView && (regionDetailsOpen || hoveredProvince !== null) && (
              <span
                className="province-map-label"
                aria-hidden="true"
                style={{
                  left: mapLabelLeft === undefined ? "50%" : `${mapLabelLeft}px`,
                  top: mapLabelTop === undefined ? "50%" : `${mapLabelTop}px`,
                }}
              >
                <strong>{labelProvince.name}</strong>
              </span>
            )}
          </div>

          {visibleCalloutKey && urgentProvince?.warning?.alerts[0] && (
            <WarningCallout
              provinceId={urgentProvince.province.id}
              provinceName={urgentProvince.province.name}
              alert={urgentProvince.warning.alerts[0]}
              stale={urgentProvince.warning.stale}
              demo={Boolean(demoScenario)}
              onDismiss={() => {
                setDismissedCalloutKey(warningCalloutKey);
                detailsToggleRef.current?.focus({ preventScroll: true });
              }}
              onSelect={() => {
                selectProvince(urgentProvince.province.id);
                focusProvince(urgentProvince.province.id);
              }}
            />
          )}
          {demoScenario && <span className="map-warning-demo-watermark">{dict.mapWarnings.demoBadge}</span>}
          <div className="explore-map-controls">
            <div className="explore-map-view-controls">
              <button
                type="button"
                onClick={() => focusProvince(selectedProvince)}
                aria-label={dict.areaExplorer.focusSelectedProvince}
                title={dict.areaExplorer.focusSelectedProvince}
              >
                <LocateFixed aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={fitPhilippines}
                aria-label={dict.areaExplorer.fitPhilippines}
                title={dict.areaExplorer.fitPhilippines}
              >
                <RotateCcw aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
            </div>
            <div className="explore-zoom-controls">
              <button
                type="button"
                disabled={camera.zoom >= MAX_ZOOM}
                onClick={() => changeZoom(1)}
                aria-label={dict.areaExplorer.zoomIn}
                title={dict.areaExplorer.zoomIn}
              >
                <Plus aria-hidden="true" size={20} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                disabled={camera.zoom <= 1}
                onClick={() => changeZoom(-1)}
                aria-label={dict.areaExplorer.zoomOut}
                title={dict.areaExplorer.zoomOut}
              >
                <Minus aria-hidden="true" size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </fieldset>

        <WarningLegend
          filter={hazardFilter}
          onFilterChange={setHazardFilter}
          count={affectedCount}
          available={Boolean(warningSnapshot)}
          filteredCount={affectedProvinces.length}
          calloutHidden={Boolean(warningCalloutKey && !visibleCalloutKey)}
          onRestoreCallout={() => setDismissedCalloutKey(null)}
          stale={[...warningsByProvince.values()].some((warning) => warning.stale && warning.alerts.length > 0)}
        />
        <p className="explore-map-note">
          <span className="explore-map-zoom-hint">{dict.areaExplorer.mapZoomHint}</span>
          <span>{dict.areaExplorer.mapSourceNote}</span>
          <a
            href="https://github.com/wmgeolab/geoBoundaries/raw/41af8f1/releaseData/gbOpen/PHL/ADM2/geoBoundaries-PHL-ADM2_simplified.geojson"
            target="_blank"
            rel="noreferrer"
          >
            {dict.areaExplorer.mapSourceLinkLabel}
            <ArrowUpRight aria-hidden="true" size={13} />
          </a>
        </p>
      </section>

      <div id="areaPicker" className="explore-location-picker" hidden={!regionDetailsOpen}>
        <aside className="explore-location-panel ui-card" aria-labelledby="location-heading">
          <div className="explore-location-heading">
            <div>
              <p className="explore-section-tag">{isCavite ? dict.areaExplorer.pilotTag : dict.areaExplorer.sideTag}</p>
              <h2 id="location-heading">{selectedProvinceData.name}</h2>
              <p className="explore-location-summary-status">
                {isCavite ? dict.areaExplorer.pendingReviewTitle : dict.areaExplorer.unsupportedTitle}
              </p>
            </div>
            <div className="explore-location-actions">
              <button
                type="button"
                className="ui-button ui-button--secondary explore-details-toggle"
                aria-expanded={detailsExpanded}
                aria-controls="explore-location-details"
                aria-label={
                  detailsExpanded ? dict.areaExplorer.hideProvinceDetails : dict.areaExplorer.showProvinceDetails
                }
                onClick={() => setDetailsExpanded((expanded) => !expanded)}
              >
                <ChevronDown aria-hidden="true" size={18} />
              </button>
              <button
                type="button"
                className="ui-button ui-button--quiet ui-button--icon"
                aria-label={dict.areaExplorer.hideProvinceDetails}
                title={dict.areaExplorer.hideProvinceDetails}
                onClick={dismissRegionDetails}
              >
                <X aria-hidden="true" size={17} />
              </button>
            </div>
          </div>

          <WarningDetails
            warning={warningsByProvince.get(selectedProvince) ?? getProvinceWarning(null, selectedProvince, warningNow)}
            provinceId={selectedProvince}
            snapshot={warningSnapshot}
            demo={Boolean(demoScenario)}
          />
          <div id="explore-location-details" className="explore-location-content" data-expanded={detailsExpanded}>
            <p className="explore-location-description">{dict.areaExplorer.sideDesc}</p>

            {isHistoricalMaguindanao && (
              <p className="explore-historical-note">{dict.areaExplorer.historicalBoundaryNote}</p>
            )}

            {isCavite && (
              <>
                <p className="explore-location-description explore-pilot-description">
                  {dict.areaExplorer.pilotDescription}
                </p>
                <LocationOptions group="explore-location" />
              </>
            )}

            <section className="explore-coverage" aria-live="polite">
              <h3>
                {isCavite
                  ? `${selectedArea} · ${dict.areaExplorer.pendingReviewTitle}`
                  : `${selectedProvinceData.name} · ${dict.areaExplorer.unsupportedTitle}`}
              </h3>
              <p>{isCavite ? dict.areaExplorer.pendingReviewDesc : dict.areaExplorer.unsupportedDesc}</p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
