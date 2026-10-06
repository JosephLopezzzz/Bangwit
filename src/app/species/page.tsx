"use client";

import { useState } from "react";
import { Waves } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";

export default function SpeciesPage() {
  const { selectedArea, dict } = useBangwit();
  const [query, setQuery] = useState("");
  const [water, setWater] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.species.tag}</p>
        <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">
          {dict.species.badge}
        </span>
      </div>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{dict.species.title}</h1>
      <p className="mt-2 text-lg text-muted">
        {dict.species.subtitle} {selectedArea}.
      </p>

      <section
        className="mt-6 grid gap-3 rounded-3xl border border-line bg-white p-4 shadow-sm md:grid-cols-[minmax(230px,1fr)_180px_180px] md:p-5"
        aria-label="Species filters"
      >
        <label>
          <span className="sr-only">{dict.species.searchPlaceholder}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder={dict.species.searchPlaceholder}
            className="min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-slate-400"
          />
        </label>
        <label className="text-xs font-semibold text-muted">
          {dict.species.waterFilterLabel}
          <select
            value={water}
            onChange={(event) => setWater(event.target.value)}
            className="app-select mt-1"
          >
            <option value="all">{dict.species.allWaters}</option>
            <option value="Saltwater">Saltwater</option>
            <option value="Freshwater">Freshwater</option>
            <option value="Brackish">Brackish</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-muted">
          {dict.species.statusFilterLabel}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="app-select mt-1"
          >
            <option value="all">{dict.species.allStatuses}</option>
            <option>Native</option>
            <option>Introduced</option>
            <option>Invasive</option>
            <option>Protected</option>
          </select>
        </label>
      </section>

      <section
        id="speciesNotice"
        className="mt-5 rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-sm sm:px-10"
        aria-live="polite"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-soft" aria-hidden="true">
          <Waves className="h-8 w-8 text-teal" strokeWidth={1.75} />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.species.noRecordsTag}</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
          {query.trim()
            ? `${dict.species.noMatchTitle} “${query.trim()}”`
            : `${dict.species.incompleteTitle} ${selectedArea}`}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">{dict.species.gapDesc}</p>
        <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-amber-50 px-4 py-4 text-left text-sm leading-6 text-amber-950">
          <strong>{dict.species.warningBoxTitle}</strong> {dict.species.warningBoxDesc}
        </div>
        <p className="mt-4 text-xs text-muted">
          {dict.species.selectedGroundLabel} <strong className="text-ink">{selectedArea}</strong>
        </p>
      </section>
    </main>
  );
}
