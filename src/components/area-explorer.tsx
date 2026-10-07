"use client";

import Image from "next/image";
import { ChevronRight, LocateFixed, MapPin, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect, type DropdownOption } from "@/components/dropdown-select";

const areas = ["Manila Bay", "Bacoor Bay", "Cañacao Bay"] as const;
const areaOptions: DropdownOption[] = areas.map((name) => ({ value: name, label: name, icon: MapPin }));
const markerPositions = [
  { left: "27.2%", top: "27.6%" },
  { left: "61.2%", top: "63.8%" },
  { left: "85.8%", top: "54.2%" },
];

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
  const { selectedArea: selected, setSelectedArea: setSelected, dict } = useBangwit();
  const [zoomStep, setZoomStep] = useState(0);
  const zoom = 1 + zoomStep / 5;
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wideScreen = window.matchMedia("(min-width: 768px)");
    const closeOnWideScreen = () => {
      if (wideScreen.matches) sheetRef.current?.close();
    };
    wideScreen.addEventListener("change", closeOnWideScreen);
    return () => wideScreen.removeEventListener("change", closeOnWideScreen);
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sheetOpen]);

  function openSheet() {
    sheetTriggerRef.current?.focus();
    sheetRef.current?.showModal();
    setSheetOpen(true);
    sheetRef.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
  }

  return (
    <>
      <div className="explore-workspace">
        <section aria-labelledby="area-heading" className="explore-map-panel">
          <div className="explore-map-heading">
            <h2 id="area-heading">{dict.areaExplorer.heading}</h2>
            <DropdownSelect
              id="waterbody"
              label={dict.areaExplorer.selectAreaLabel}
              value={selected}
              onValueChange={setSelected}
              options={areaOptions}
              className="dropdown-select--compact"
            />
          </div>

          <fieldset className="explore-map" aria-labelledby="area-heading" aria-describedby="map-description">
            <p id="map-description" className="sr-only">
              {dict.areaExplorer.mapDescription}
            </p>
            <div className="explore-map-stage" style={{ transform: `scale(${zoom})` }}>
              {!mapUnavailable && (
                <Image
                  src="/assets/cavite-waters-map.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1200px) 65vw, 100vw"
                  className="explore-map-art"
                  onError={() => setMapUnavailable(true)}
                />
              )}
              <span className="explore-water-label explore-label-manila">Manila Bay</span>
              <span className="explore-water-label explore-label-bacoor-bay">Bacoor Bay</span>
              <span className="explore-water-label explore-label-canacao">Cañacao Bay</span>
              <span className="explore-land-label explore-label-cavite-city">Cavite City</span>
              <span className="explore-land-label explore-label-bacoor">Bacoor</span>
              <span className="explore-region-label">Cavite</span>
              {areas.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  aria-label={`${dict.areaExplorer.selectAreaLabel}: ${name}`}
                  aria-pressed={selected === name}
                  onClick={() => setSelected(name)}
                  onFocus={() => setZoomStep(0)}
                  className="explore-map-marker"
                  data-selected={selected === name}
                  style={markerPositions[index]}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            {mapUnavailable && (
              <p className="explore-map-error" role="status">
                {dict.areaExplorer.mapUnavailable}
              </p>
            )}
            <div className="explore-map-controls">
              <button
                type="button"
                onClick={() => setZoomStep(0)}
                aria-label={dict.areaExplorer.resetMap}
                title={dict.areaExplorer.resetMap}
              >
                <LocateFixed aria-hidden="true" size={23} strokeWidth={1.75} />
              </button>
              <div className="explore-zoom-controls">
                <button
                  type="button"
                  disabled={zoomStep >= 3}
                  onClick={() => setZoomStep((value) => Math.min(3, value + 1))}
                  aria-label={dict.areaExplorer.zoomIn}
                  title={dict.areaExplorer.zoomIn}
                >
                  <Plus aria-hidden="true" size={23} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  disabled={zoomStep <= 0}
                  onClick={() => setZoomStep((value) => Math.max(0, value - 1))}
                  aria-label={dict.areaExplorer.zoomOut}
                  title={dict.areaExplorer.zoomOut}
                >
                  <Minus aria-hidden="true" size={23} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </fieldset>
          <p className="explore-map-note">{dict.areaExplorer.mapIllustrationNote}</p>
        </section>

        <div id="areaPicker" className="explore-location-picker">
          <aside className="explore-location-panel" aria-labelledby="location-heading">
            <p className="explore-section-tag">{dict.areaExplorer.sideTag}</p>
            <h2 id="location-heading">{dict.areaExplorer.sideHeading}</h2>
            <p className="explore-location-description">{dict.areaExplorer.sideDesc}</p>
            <LocationOptions group="explore-location" />
          </aside>
          <button
            ref={sheetTriggerRef}
            type="button"
            className="explore-location-trigger"
            onClick={openSheet}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-controls="location-sheet"
          >
            <MapPin aria-hidden="true" size={24} />
            <span>
              <span className="location-trigger-label">{dict.areaExplorer.selectAreaLabel}</span>
              <strong>{selected}</strong>
            </span>
            <ChevronRight aria-hidden="true" size={22} />
          </button>
        </div>
      </div>

      <div className="explore-coverage" aria-live="polite">
        <h2>
          {selected} · {dict.areaExplorer.pendingReviewTitle}
        </h2>
        <p>{dict.areaExplorer.pendingReviewDesc}</p>
      </div>

      <dialog
        ref={sheetRef}
        id="location-sheet"
        aria-labelledby="location-sheet-heading"
        className="location-sheet"
        onClose={() => setSheetOpen(false)}
      >
        <div className="location-sheet-heading">
          <h2 id="location-sheet-heading">{dict.areaExplorer.sideHeading}</h2>
          <button
            type="button"
            className="location-sheet-close"
            aria-label={dict.common.close}
            onClick={() => sheetRef.current?.close()}
          >
            <X aria-hidden="true" size={22} />
          </button>
        </div>
        <p className="explore-location-description">{dict.areaExplorer.sideDesc}</p>
        <LocationOptions group="explore-location-sheet" />
        <button type="button" className="location-sheet-done" onClick={() => sheetRef.current?.close()}>
          {dict.common.done}
        </button>
      </dialog>
    </>
  );
}
