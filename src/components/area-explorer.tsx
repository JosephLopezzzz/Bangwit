"use client";

import { ArrowUpRight, ChevronDown, LocateFixed, MapPin, Minus, Plus, RotateCcw } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { type DropdownOption, DropdownSelect } from "@/components/dropdown-select";
import { PHILIPPINE_PROVINCE_PATHS } from "@/data/phl-province-paths";
import { CAVITE_PROVINCE_ID, PHILIPPINE_PROVINCES, type ProvinceId } from "@/data/phl-provinces";
import "./area-explorer.css";

const areas = ["Manila Bay", "Bacoor Bay", "CaÃ±acao Bay"] as const;
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
      {areas.map((name, index) => (
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
  const { selectedArea, selectedProvince, setSelectedProvince, dict } = useBangwit();
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
  const labelMaxWidth = Math.min(stageSize.width * 0.6, 240);
  const labelAnchorX = ((labelProvince.center.x - viewX) / viewWidth) * stageSize.width;
  const labelAnchorY = ((labelProvince.center.y - viewY) / viewHeight) * stageSize.height;
  const mapLabelLeft = stageSize.width
    ? Math.max(labelMaxWidth / 2 + 8, Math.min(stageSize.width - labelMaxWidth / 2 - 8, labelAnchorX))
    : undefined;
  const mapLabelTop = stageSize.height ? Math.max(40, Math.min(stageSize.height - 8, labelAnchorY)) : undefined;

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
    const mapSvg = mapSvgRef.current;
    if (!mapSvg) return;

    function handleMapWheel(event: WheelEvent) {
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
    }

    mapSvg.addEventListener("wheel", handleMapWheel, { passive: false });
    return () => mapSvg.removeEventListener("wheel", handleMapWheel);
  }, [baseViewHeight, baseViewWidth]);

  function selectProvince(provinceId: ProvinceId) {
    setSelectedProvince(provinceId);
    setKeyboardProvinceId(provinceId);
    setHoveredProvince(null);
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
    <div className="explore-workspace">
      <section aria-labelledby="area-heading" className="explore-map-panel ui-card">
        <div className="explore-map-heading">
          <h2 id="area-heading">{dict.areaExplorer.heading}</h2>
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
        </div>

        <fieldset className="explore-map" aria-labelledby="area-heading" aria-describedby="province-map-description">
          <p id="province-map-description" className="sr-only">
            {dict.areaExplorer.mapDescription}
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
                  aria-label={`${dict.areaExplorer.provinceSelectLabel}: ${province.name}`}
                  aria-pressed={selectedProvince === province.id}
                  data-selected={selectedProvince === province.id}
                  data-hovered={hoveredProvince === province.id}
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
            </svg>
            <span
              className="province-map-label"
              aria-hidden="true"
              style={{
                left: mapLabelLeft === undefined ? "50%" : `${mapLabelLeft}px`,
                top: mapLabelTop === undefined ? "50%" : `${mapLabelTop}px`,
              }}
            >
              {labelProvince.name}
            </span>
          </div>

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

      <div id="areaPicker" className="explore-location-picker">
        <aside className="explore-location-panel ui-card" aria-labelledby="location-heading">
          <div className="explore-location-heading">
            <div>
              <p className="explore-section-tag">{isCavite ? dict.areaExplorer.pilotTag : dict.areaExplorer.sideTag}</p>
              <h2 id="location-heading">{selectedProvinceData.name}</h2>
              <p className="explore-location-summary-status">
                {isCavite ? dict.areaExplorer.pendingReviewTitle : dict.areaExplorer.unsupportedTitle}
              </p>
            </div>
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
          </div>

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
