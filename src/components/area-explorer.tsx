"use client";

import { useBangwit } from "@/components/bangwit-provider";

const areas = ["Manila Bay", "Bacoor Bay", "Cañacao Bay"] as const;

export function AreaExplorer() {
  const { selectedArea: selected, setSelectedArea: setSelected, dict } = useBangwit();

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
      <section
        aria-labelledby="area-heading"
        className="overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="area-heading" className="text-xl font-bold tracking-tight text-ink">
            {dict.areaExplorer.heading}
          </h2>
          <label className="sr-only" htmlFor="waterbody">
            {dict.areaExplorer.selectAreaLabel}
          </label>
          <select
            id="waterbody"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="app-select app-select--compact"
          >
            {areas.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="map-illustration relative mt-4 min-h-[320px] overflow-hidden rounded-2xl border sm:min-h-[435px]">
          <div className="map-water absolute inset-0" />
          <div
            aria-hidden="true"
            className="map-landform map-landform-main absolute -bottom-20 -left-12 h-[72%] w-[76%] rounded-[42%_58%_12%_8%] border-t-[3px] border-white/90 sm:-bottom-28 sm:-left-16"
          />
          <div
            aria-hidden="true"
            className="map-landform map-landform-inset absolute bottom-10 left-[13%] h-[44%] w-[47%] rotate-[-11deg] rounded-[50%_50%_4%_45%] border-t-2 border-white/80 sm:bottom-14"
          />
          <span className="map-area-label absolute left-[46%] top-[20%] text-sm italic">Manila Bay</span>
          <span className="map-area-label absolute left-[56%] top-[53%] text-sm italic">Bacoor Bay</span>
          <span className="map-area-label absolute right-[9%] top-[42%] text-sm italic">Cañacao Bay</span>
          <span className="map-region-label absolute bottom-[23%] left-[26%] text-sm font-bold tracking-[0.15em]">
            CAVITE
          </span>
          {areas.map((name, index) => (
            <button
              key={name}
              type="button"
              aria-label={`${name} marker`}
              aria-pressed={selected === name}
              onClick={() => setSelected(name)}
              className={`map-marker absolute grid h-11 w-11 place-items-center rounded-full border-[3px] border-white text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-110 ${
                index === 0 ? "left-[25%] top-[31%]" : index === 1 ? "left-[58%] top-[57%]" : "right-[14%] top-[49%]"
              } ${selected === name ? "z-10 scale-110 bg-teal ring-4 ring-teal/20" : "bg-slate-600/90"}`}
            >
              {index + 1}
            </button>
          ))}
          <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
            {dict.areaExplorer.mapIllustrationNote}
          </span>
        </div>
      </section>

      <aside className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.areaExplorer.sideTag}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">{dict.areaExplorer.sideHeading}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{dict.areaExplorer.sideDesc}</p>

        <div className="mt-5 space-y-2">
          {areas.map((name, index) => {
            const subtitle = dict.areaExplorer.areas[name]?.subtitle ?? "";
            return (
              <button
                key={name}
                type="button"
                aria-pressed={selected === name}
                onClick={() => setSelected(name)}
                className={`flex min-h-[68px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  selected === name
                    ? "border-teal bg-teal-soft/60"
                    : "border-line hover:border-teal/50 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${
                    selected === name ? "bg-teal" : "bg-slate-600"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ink">{name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{subtitle}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`h-5 w-5 rounded-full border-2 ${
                    selected === name ? "border-teal bg-teal shadow-[inset_0_0_0_4px_white]" : "border-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/80 p-4" aria-live="polite">
          <p className="text-sm font-bold text-amber-950">
            {selected} · {dict.areaExplorer.pendingReviewTitle}
          </p>
          <p className="mt-1 text-sm leading-5 text-amber-900/80">{dict.areaExplorer.pendingReviewDesc}</p>
        </div>
      </aside>
    </div>
  );
}
