"use client";

import { ChevronDown, Layers, Search } from "lucide-react";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import { FeedingGuides } from "@/components/feeding-guides";
import { HistoricalSpeciesEvidence } from "@/components/historical-species-evidence";
import evidence from "@/data/cavite-historical-evidence.json";
import { filterHistoricalEvidence } from "@/lib/species-research";

export default function SpeciesPage() {
  const { selectedArea, dict } = useBangwit();
  const [query, setQuery] = useState("");
  const [locality, setLocality] = useState<"all" | "limbones-cove" | "cavite-manila-bay">("all");
  const [date, setDate] = useState<"all" | "dated" | "undated">("all");
  const copy = dict.species;
  const historyCopy = dict.historicalEvidence;
  const historyFilters = { query, locality, date };
  const filteredRecords = filterHistoricalEvidence(evidence.records, historyFilters);
  const activeFilters = Boolean(query.trim() || locality !== "all" || date !== "all");

  function clearEvidenceFilters() {
    setQuery("");
    setLocality("all");
    setDate("all");
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{copy.tag}</p>
        <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">{copy.badge}</span>
      </div>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{copy.title}</h1>
      <p className="mt-2 text-lg text-muted">{copy.subtitle}</p>

      <section className="mt-6 rounded-3xl border border-line bg-white p-4 shadow-sm md:p-5" aria-label={copy.title}>
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_minmax(185px,0.72fr)_minmax(185px,0.72fr)]">
          <label className="relative block min-w-0">
            <span className="sr-only">{copy.searchPlaceholder}</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder={copy.searchPlaceholder}
              className="min-h-12 w-full rounded-xl border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-slate-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal"
            />
          </label>
          <div className="min-w-0 text-xs font-semibold text-muted">
            <span className="block">{historyCopy.localityFilterLabel}</span>
            <DropdownSelect
              id="species-locality-filter"
              label={historyCopy.localityFilterLabel}
              value={locality}
              onValueChange={(value) => setLocality(value as typeof locality)}
              className="mt-1"
              options={[
                { value: "all", label: historyCopy.allLocalities, icon: Layers },
                { value: "limbones-cove", label: historyCopy.coveLocality, icon: Layers },
                { value: "cavite-manila-bay", label: historyCopy.coastLocality, icon: Layers },
              ]}
            />
          </div>
          <div className="min-w-0 text-xs font-semibold text-muted">
            <span className="block">{historyCopy.dateFilterLabel}</span>
            <DropdownSelect
              id="species-date-filter"
              label={historyCopy.dateFilterLabel}
              value={date}
              onValueChange={(value) => setDate(value as typeof date)}
              className="mt-1"
              options={[
                { value: "all", label: historyCopy.allDates, icon: Layers },
                { value: "dated", label: historyCopy.datedOnly, icon: Layers },
                { value: "undated", label: historyCopy.undatedOnly, icon: Layers },
              ]}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <details className="group min-w-0">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal [&::-webkit-details-marker]:hidden">
              {copy.moreFilters}
              <ChevronDown aria-hidden="true" size={16} className="group-open:rotate-180" />
            </summary>
            <div className="grid gap-3 py-3 sm:grid-cols-2">
              <div className="min-w-0 text-xs font-semibold text-muted">
                <span className="block">{copy.waterFilterLabel}</span>
                <DropdownSelect
                  id="species-water-filter"
                  label={copy.waterFilterLabel}
                  value="all"
                  onValueChange={() => {}}
                  disabled
                  className="mt-1"
                  options={[{ value: "all", label: copy.allWaters, icon: Layers }]}
                />
              </div>
              <div className="min-w-0 text-xs font-semibold text-muted">
                <span className="block">{copy.statusFilterLabel}</span>
                <DropdownSelect
                  id="species-status-filter"
                  label={copy.statusFilterLabel}
                  value="all"
                  onValueChange={() => {}}
                  disabled
                  className="mt-1"
                  options={[{ value: "all", label: copy.allStatuses, icon: Layers }]}
                />
              </div>
              <p className="text-xs leading-5 text-muted sm:col-span-2">{copy.unavailableFilterNote}</p>
            </div>
          </details>
          {activeFilters && (
            <button
              type="button"
              onClick={clearEvidenceFilters}
              className="min-h-10 rounded-lg px-3 text-sm font-semibold text-teal hover:bg-teal-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              {copy.clearAllFilters}
            </button>
          )}
        </div>
      </section>

      <HistoricalSpeciesEvidence records={filteredRecords} />
      <FeedingGuides />

      <section
        className="mt-5 rounded-3xl border border-line bg-white px-6 py-8 shadow-sm sm:px-8"
        aria-labelledby="species-status-heading"
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{copy.noRecordsTag}</p>
        <h2 id="species-status-heading" className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
          {copy.localStatusTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{copy.localStatusDesc}</p>
        <p className="mt-4 text-xs text-muted">
          {copy.selectedGroundLabel} <strong className="text-ink">{selectedArea}</strong>
        </p>
      </section>
    </main>
  );
}
