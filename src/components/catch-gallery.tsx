"use client";

import { ArrowRight, Filter, Fish, LockKeyhole, Plus, Search, Waves } from "lucide-react";
import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { CatchDetails } from "@/components/catch-details";
import { CatchDatePicker } from "@/components/catch-date-picker";
import { DropdownSelect } from "@/components/dropdown-select";
import { FuseButton } from "@/components/fuse-button";
import { PhotoThumbnail, PhotoViewer, type PhotoItem } from "@/components/photo-viewer";
import { getDispositionLabel, getHabitatLabel, getSpeciesDisplay } from "@/i18n/labels";
import type { CatchEntry } from "@/types/catch";
import "./catch-gallery.css";

type CatchGalleryProps = {
  entries: CatchEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (entry: CatchEntry) => Promise<boolean>;
  onAdd: () => void;
  loading: boolean;
};

export function CatchGallery({ entries, selectedId, onSelect, onDelete, onAdd, loading }: CatchGalleryProps) {
  const { dict, lang } = useBangwit();
  const searchId = useId();
  const speciesId = useId();
  const waterId = useId();
  const fromId = useId();
  const toId = useId();
  const [query, setQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [waterFilter, setWaterFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewedId, setViewedId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const copy =
    lang === "fil"
      ? {
          search: "Maghanap sa catches…",
          searchLabel: "Maghanap sa catch log",
          filters: "Filters",
          species: "Species",
          allSpecies: "Lahat ng species",
          water: "Uri ng tubig",
          allWater: "Lahat ng uri ng tubig",
          from: "Mula sa petsa",
          to: "Hanggang petsa",
          clear: "I-clear ang filters",
          noMatches: "Walang tugmang huli",
          noMatchesHint: "Palitan o i-clear ang search at filters para makita ang ibang records.",
          resultCount: "na huli",
          details: "Tingnan ang detalye",
          guide: "Dito naka-save sa device mo ang bawat personal na huli.",
        }
      : {
          search: "Search catches…",
          searchLabel: "Search catch log",
          filters: "Filters",
          species: "Species",
          allSpecies: "All species",
          water: "Water type",
          allWater: "All water types",
          from: "From date",
          to: "To date",
          clear: "Clear filters",
          noMatches: "No catches match",
          noMatchesHint: "Change or clear your search and filters to see other records.",
          resultCount: "catches",
          details: "View details",
          guide: "Each personal catch stays saved on this device.",
        };

  const speciesOptions = useMemo(
    () => [...new Set(entries.map((entry) => entry.species.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [entries],
  );
  const waterOptions = useMemo(
    () => [...new Set(entries.map((entry) => entry.habitat.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [entries],
  );
  const filteredEntries = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(lang === "fil" ? "fil-PH" : "en-US");
    return entries.filter((entry) => {
      const title = getSpeciesDisplay(entry.species, lang);
      const searchable = [title, entry.location, entry.bait, entry.notes]
        .join(" ")
        .toLocaleLowerCase(lang === "fil" ? "fil-PH" : "en-US");
      return (
        (!needle || searchable.includes(needle)) &&
        (!speciesFilter || entry.species.trim() === speciesFilter) &&
        (!waterFilter || entry.habitat.trim() === waterFilter) &&
        (!fromDate || entry.date >= fromDate) &&
        (!toDate || entry.date <= toDate)
      );
    });
  }, [entries, fromDate, lang, query, speciesFilter, toDate, waterFilter]);
  const hasFilters = Boolean(query || speciesFilter || waterFilter || fromDate || toDate);
  const photos = useMemo<PhotoItem[]>(
    () =>
      entries.flatMap((entry) =>
        entry.photo && entry.id != null
          ? [
              {
                id: entry.id,
                photo: entry.photo,
                title: getSpeciesDisplay(entry.species, lang),
                date: entry.date,
              },
            ]
          : [],
      ),
    [entries, lang],
  );
  const viewedIndex = photos.findIndex((photo) => photo.id === viewedId);

  function formatDate(date: string) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!date || Number.isNaN(parsed.getTime())) return dict.catches.dateNotRecorded;
    return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }

  function clearFilters() {
    setQuery("");
    setSpeciesFilter("");
    setWaterFilter("");
    setFromDate("");
    setToDate("");
  }

  return (
    <section className="catch-gallery" aria-labelledby="catch-gallery-heading">
      <header className="catch-gallery-header">
        <div>
          <h2 id="catch-gallery-heading">{dict.catches.journalHeading}</h2>
          <p className="catch-gallery-subtitle" aria-live="polite" aria-atomic="true">
            {filteredEntries.length} {copy.resultCount}
          </p>
        </div>
        <button type="button" onClick={onAdd} className="catch-gallery-add">
          <Plus size={16} aria-hidden="true" />
          {dict.catches.logCatchTab}
        </button>
      </header>

      <div className="catch-gallery-toolbar">
        <label className="catch-gallery-search" htmlFor={searchId}>
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">{copy.searchLabel}</span>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={copy.search}
          />
        </label>
        <div className="catch-gallery-filter-heading">
          <Filter aria-hidden="true" size={15} />
          <span>{copy.filters}</span>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="catch-gallery-clear">
              {copy.clear}
            </button>
          )}
        </div>
        <div className="catch-gallery-filters">
          <label className="catch-filter-field" htmlFor={speciesId}>
            <span>{copy.species}</span>
            <DropdownSelect
              id={speciesId}
              label={copy.species}
              value={speciesFilter}
              options={[
                { value: "", label: copy.allSpecies, icon: Fish },
                ...speciesOptions.map((species) => ({ value: species, label: getSpeciesDisplay(species, lang), icon: Fish })),
              ]}
              onValueChange={setSpeciesFilter}
              portal
            />
          </label>
          <label className="catch-filter-field" htmlFor={waterId}>
            <span>{copy.water}</span>
            <DropdownSelect
              id={waterId}
              label={copy.water}
              value={waterFilter}
              options={[
                { value: "", label: copy.allWater, icon: Waves },
                ...waterOptions.map((water) => ({ value: water, label: getHabitatLabel(water, lang), icon: Waves })),
              ]}
              onValueChange={setWaterFilter}
              portal
            />
          </label>
          <label className="catch-filter-field catch-filter-date" htmlFor={fromId}>
            <span>{copy.from}</span>
            <CatchDatePicker
              id={fromId}
              value={fromDate}
              onChange={(next) => {
                setFromDate(next);
                if (toDate && next > toDate) setToDate(next);
              }}
              lang={lang}
              maxDate={toDate || undefined}
              name={null}
              required={false}
              showToday={false}
              className="catch-gallery-date-picker"
              portal
            />
          </label>
          <label className="catch-filter-field catch-filter-date" htmlFor={toId}>
            <span>{copy.to}</span>
            <CatchDatePicker
              id={toId}
              value={toDate}
              onChange={setToDate}
              lang={lang}
              minDate={fromDate || undefined}
              name={null}
              required={false}
              showToday={false}
              className="catch-gallery-date-picker"
              portal
            />
          </label>
        </div>
      </div>

      <div className="catch-gallery-list" aria-busy={loading}>
        {loading ? (
          <div className="catch-gallery-loading" role="status">
            <span className="catch-gallery-skeleton" />
            <span className="catch-gallery-skeleton" />
            <span className="catch-gallery-skeleton" />
          </div>
        ) : entries.length === 0 ? (
          <div className="catch-gallery-empty">
            <Image src="/assets/bilog-idle-blink-slow-right.gif" alt="" width={92} height={92} unoptimized />
            <h3>{dict.catches.emptyTitle}</h3>
            <p>{dict.catches.emptyDesc}</p>
            <button type="button" onClick={onAdd} className="catch-gallery-add">
              <Plus size={16} aria-hidden="true" />
              {dict.catches.logCatchTab}
            </button>
            <p className="catch-gallery-private">
              <LockKeyhole size={14} aria-hidden="true" />
              {dict.catches.emptyPrivacyNote}
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="catch-gallery-no-results">
            <Fish aria-hidden="true" size={24} />
            <h3>{copy.noMatches}</h3>
            <p>{copy.noMatchesHint}</p>
            <button type="button" onClick={clearFilters} className="ui-button ui-button--secondary">
              {copy.clear}
            </button>
          </div>
        ) : (
          <div className="catch-card-grid">
            {filteredEntries.map((entry, index) => {
              const title = getSpeciesDisplay(entry.species, lang);
              return (
                <article
                  key={entry.id ?? `${entry.date}-${entry.species}-${index}`}
                  className="catch-card"
                  data-selected={entry.id != null && selectedId === entry.id ? "true" : undefined}
                >
                  <PhotoThumbnail
                    photo={entry.photo}
                    altText={title}
                    onView={() => {
                      if (entry.id != null) {
                        onSelect(entry.id);
                        setViewedId(entry.id);
                      }
                    }}
                    className="catch-card-photo"
                  />
                  <div className="catch-card-body">
                    <div className="catch-card-title-row">
                      <h3 title={title}>{title}</h3>
                      {entry.id != null && (
                        <FuseButton
                          className="catch-card-delete"
                          label={dict.catches.deleteLog}
                          undoLabel={dict.catches.deleteUndo}
                          doneLabel={dict.catches.logDeleted}
                          committingLabel={dict.catches.deletingLog}
                          pendingLabel={dict.catches.deletePending}
                          canceledLabel={dict.catches.deleteCanceled}
                          failedLabel={dict.catches.deleteFailed}
                          ariaLabel={`${dict.catches.deleteCatchAria} ${title}`}
                          hint={dict.catches.deleteFuseHint}
                          onCommit={() => onDelete(entry)}
                        />
                      )}
                    </div>
                    <p className="catch-card-date">{formatDate(entry.date)}</p>
                    <div className="catch-card-tags">
                      <span className="catch-card-water">{getHabitatLabel(entry.habitat, lang)}</span>
                      {entry.location && <span className="catch-card-location" title={entry.location}>{entry.location}</span>}
                      <span className="catch-card-disposition">{getDispositionLabel(entry.disposition, lang)}</span>
                    </div>
                    <button
                      type="button"
                      className="catch-card-details"
                      aria-haspopup="dialog"
                      onClick={() => {
                        if (entry.id != null) {
                          onSelect(entry.id);
                          setDetailsId(entry.id);
                        }
                      }}
                    >
                      {copy.details}
                      <ArrowRight aria-hidden="true" size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <p className="catch-gallery-private catch-gallery-device-note">
        <LockKeyhole size={13} aria-hidden="true" />
        {copy.guide}
      </p>

      <PhotoViewer
        photos={photos}
        initialIndex={Math.max(0, viewedIndex)}
        open={viewedId != null && viewedIndex !== -1}
        onClose={() => setViewedId(null)}
      />
      <CatchDetails
        entries={entries}
        entryId={detailsId}
        onSelect={(id) => {
          setDetailsId(id);
          onSelect(id);
        }}
        onClose={() => setDetailsId(null)}
        formatDate={formatDate}
      />
    </section>
  );
}
