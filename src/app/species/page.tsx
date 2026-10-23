"use client";

import { ChevronDown, Layers, Search } from "lucide-react";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import { FeedingGuides } from "@/components/feeding-guides";
import { HistoricalSpeciesEvidence } from "@/components/historical-species-evidence";
import { LagunaDeBaySpecimenEvidence } from "@/components/laguna-de-bay-specimen-evidence";
import { MakilingGbifEvidence } from "@/components/makiling-gbif-evidence";
import { PalicoRiverSurveyEvidence } from "@/components/palico-river-survey-evidence";
import { PansipitRiverGbifEvidence } from "@/components/pansipit-river-gbif-evidence";
import { TaalChecklistEvidence } from "@/components/taal-checklist-evidence";
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
    <main className="ui-page">
      <header className="ui-page-header">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="ui-page-title">{copy.title}</h1>
          <span className="ui-caption rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900">
            {copy.badge}
          </span>
        </div>
        <p className="max-w-[75ch] text-muted">{copy.subtitle}</p>
      </header>

      <section className="ui-card" aria-label={copy.title}>
        <div className="grid items-end gap-3 lg:grid-cols-[minmax(200px,1fr)_minmax(160px,0.72fr)_minmax(160px,0.72fr)]">
          <label className="relative block min-w-0">
            <span className="sr-only">{copy.searchPlaceholder}</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder={copy.searchPlaceholder}
              className="ui-input ui-input--search w-full"
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
                  disabled
                  className="mt-1"
                  options={[{ value: "all", label: copy.allStatuses, icon: Layers }]}
                />
              </div>
              <p className="text-xs leading-5 text-muted sm:col-span-2">{copy.unavailableFilterNote}</p>
            </div>
          </details>
          {activeFilters && (
            <button type="button" onClick={clearEvidenceFilters} className="ui-button ui-button--secondary">
              {copy.clearAllFilters}
            </button>
          )}
        </div>
      </section>

      <HistoricalSpeciesEvidence records={filteredRecords} />
      <TaalChecklistEvidence />
      <PalicoRiverSurveyEvidence />
      <MakilingGbifEvidence />
      <LagunaDeBaySpecimenEvidence />
      <PansipitRiverGbifEvidence />
      <FeedingGuides />

      <section id="speciesNotice" className="ui-card mt-5" aria-labelledby="species-status-heading">
        <h2 id="species-status-heading" className="ui-section-title">
          {copy.localStatusTitle}
        </h2>
        <p className="mt-2 max-w-[75ch] leading-relaxed text-muted">{copy.localStatusDesc}</p>
        <p className="mt-4 text-xs text-muted">
          {copy.selectedGroundLabel} <strong className="text-ink">{selectedArea}</strong>
        </p>
      </section>
    </main>
  );
}
