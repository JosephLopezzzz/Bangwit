"use client";

import { ArrowDownAZ, ArrowDownWideNarrow, ArrowRight, CalendarDays, Fish, Hash, LayoutGrid, List, LockKeyhole, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import { type PhotoItem, PhotoThumbnail, PhotoViewer } from "@/components/photo-viewer";
import { getHabitatLabel } from "@/i18n/labels";
import { listCatches } from "@/lib/storage/catches";
import type { CatchEntry } from "@/types/catch";
import "./my-species.css";

type SpeciesRecord = {
  name: string;
  catches: CatchEntry[];
  latest: CatchEntry;
  photos: PhotoItem[];
};

type SortMode = "latest" | "name" | "count";
type ViewMode = "grid" | "list";

export default function MySpeciesPage() {
  const { lang, dict } = useBangwit();
  const [entries, setEntries] = useState<CatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("latest");
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [viewerPhotos, setViewerPhotos] = useState<PhotoItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const detailDialogRef = useRef<HTMLDialogElement>(null);
  const searchId = "my-species-search";
  const sortId = "my-species-sort";
  const copy =
    lang === "fil"
      ? {
          search: "Maghanap ng species…",
          searchLabel: "Maghanap sa My Species",
          sort: "Ayusin ayon sa",
          latest: "Pinakabagong huli",
          name: "Pangalan ng species",
          count: "Dami ng huli",
          grid: "Grid view",
          list: "List view",
          latestCatch: "Pinakabagong huli",
          catches: "personal na huli",
          catchSingular: "personal na huli",
          yourCatches: "Mga huli mo",
          photos: "Mga larawan",
          details: "Detalye ng species",
          openDetails: "Buksan ang detalye",
          noDate: "Walang petsang naitala",
          noResults: "Walang tugmang species",
          clear: "I-clear ang search",
          unidentified: "hindi pa natukoy na catch ang nasa journal at hindi pa kasama sa collection.",
          personalOnly: "Personal catch log lang",
        }
      : {
          search: "Search species…",
          searchLabel: "Search My Species",
          sort: "Sort by",
          latest: "Latest catch",
          name: "Species name",
          count: "Catch count",
          grid: "Grid view",
          list: "List view",
          latestCatch: "Latest catch",
          catches: "personal catches",
          catchSingular: "personal catch",
          yourCatches: "Your catches",
          photos: "Photos",
          details: "Species details",
          openDetails: "Open details",
          noDate: "No date recorded",
          noResults: "No species match your search",
          clear: "Clear search",
          unidentified: (count: number) =>
            count === 1
              ? "unidentified catch record in your journal is not yet added to your collection."
              : "unidentified catch records in your journal are not yet added to your collection.",
          personalOnly: "Personal catch log only",
        };

  useEffect(() => {
    let active = true;
    listCatches()
      .then((records) => {
        if (active) setEntries(records);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof Error
            ? reason.message
            : lang === "fil"
              ? "Hindi mabasa ang local catch journal."
              : "Could not read local catch journal.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lang]);

  const species = useMemo(() => {
    const known = new Map<string, { name: string; catches: CatchEntry[] }>();
    for (const entry of entries) {
      const name = entry.species.trim();
      if (!name || name.toLowerCase() === "hindi pa natukoy" || name.toLowerCase() === "unidentified") continue;
      const key = name.toLowerCase();
      const current = known.get(key) ?? { name, catches: [] };
      current.catches.push(entry);
      known.set(key, current);
    }
    return [...known.values()].map(({ name, catches }): SpeciesRecord => {
      const sorted = [...catches].sort(
        (a, b) => b.date.localeCompare(a.date) || b.savedAt.localeCompare(a.savedAt),
      );
      return {
        name,
        catches: sorted,
        latest: sorted[0],
        photos: sorted.flatMap<PhotoItem>((entry, index) =>
          entry.photo
            ? [{ id: entry.id ?? `${name}-${index}`, photo: entry.photo, title: name, date: entry.date }]
            : [],
        ),
      };
    });
  }, [entries]);

  const unknownCount = entries.filter((entry) => {
    const name = entry.species.trim().toLowerCase();
    return !name || name === "hindi pa natukoy" || name === "unidentified";
  }).length;
  const filteredSpecies = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(lang === "fil" ? "fil-PH" : "en-US");
    const matches = species.filter((record) => record.name.toLocaleLowerCase(lang === "fil" ? "fil-PH" : "en-US").includes(needle));
    return matches.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, lang === "fil" ? "fil-PH" : "en-US");
      if (sort === "count") return b.catches.length - a.catches.length || a.name.localeCompare(b.name);
      return (
        b.latest.date.localeCompare(a.latest.date) ||
        b.latest.savedAt.localeCompare(a.latest.savedAt) ||
        a.name.localeCompare(b.name)
      );
    });
  }, [lang, query, sort, species]);
  const selectedSpecies = species.find((record) => record.name === selectedName) ?? null;
  useEffect(() => {
    const dialog = detailDialogRef.current;
    if (!dialog) return;
    if (selectedSpecies && !dialog.open) {
      dialog.showModal();
    } else if (!selectedSpecies && dialog.open) {
      dialog.close();
    }
  }, [selectedSpecies]);

  function formatDate(date: string) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!date || Number.isNaN(parsed.getTime())) return copy.noDate;
    return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }

  function openPhoto(photos: PhotoItem[], index: number) {
    setViewerPhotos(photos);
    setViewerIndex(index);
    setViewerOpen(true);
  }

  return (
    <main className="ui-page my-species-page">
      <header className="ui-page-header">
        <div className="my-species-heading-row">
          <div>
            <h1 className="ui-page-title">{dict.mySpecies.title}</h1>
            <p>{dict.mySpecies.subtitle}</p>
          </div>
          <Link href="/catches" className="ui-button my-species-log-button">
            {dict.mySpecies.logCatchBtn}
          </Link>
        </div>
      </header>

      <p className="my-species-personal-note">
        <LockKeyhole aria-hidden="true" size={15} />
        <strong>{copy.personalOnly}</strong>
        <span>{dict.mySpecies.disclaimer}</span>
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </p>
      )}

      {unknownCount > 0 && !loading && (
        <p className="my-species-unknown-banner">
          <Fish aria-hidden="true" size={15} />
          <span>
            {unknownCount} {typeof copy.unidentified === "function" ? copy.unidentified(unknownCount) : copy.unidentified}
          </span>
        </p>
      )}

      {loading ? (
        <div className="my-species-loading" role="status" aria-label={dict.mySpecies.loading}>
          <span />
          <span />
          <span />
        </div>
      ) : species.length === 0 ? (
        <section className="ui-card my-species-empty text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-teal-soft" aria-hidden="true">
            <Fish className="h-6 w-6 text-teal" strokeWidth={1.75} />
          </div>
          <h2 className="ui-section-title mt-3">{dict.mySpecies.emptyTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            {unknownCount ? `${unknownCount} ` : ""}
            {dict.mySpecies.emptyDesc}
          </p>
          <Link href="/catches" className="ui-button mt-4">
            {dict.mySpecies.logCatchBtn}
          </Link>
        </section>
      ) : (
        <>
          <section className="my-species-toolbar" aria-label={dict.mySpecies.title}>
            <label className="my-species-search" htmlFor={searchId}>
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
            <div className="my-species-sort">
              <ArrowDownWideNarrow aria-hidden="true" size={15} />
              <span>{copy.sort}</span>
              <DropdownSelect
                id={sortId}
                label={copy.sort}
                value={sort}
                options={[
                  { value: "latest", label: copy.latest, icon: CalendarDays },
                  { value: "name", label: copy.name, icon: ArrowDownAZ },
                  { value: "count", label: copy.count, icon: Hash },
                ]}
                onValueChange={(value) => setSort(value as SortMode)}
                portal
              />
            </div>
            <div className="my-species-view-toggle" role="group" aria-label={lang === "fil" ? "Ayos ng collection" : "Collection view"}>
              <button
                type="button"
                aria-label={copy.grid}
                title={copy.grid}
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <LayoutGrid aria-hidden="true" size={17} />
              </button>
              <button
                type="button"
                aria-label={copy.list}
                title={copy.list}
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List aria-hidden="true" size={17} />
              </button>
            </div>
          </section>

          {filteredSpecies.length === 0 ? (
            <section className="my-species-no-results">
              <Search aria-hidden="true" size={22} />
              <h2>{copy.noResults}</h2>
              <button type="button" className="ui-button ui-button--secondary" onClick={() => setQuery("")}>
                {copy.clear}
              </button>
            </section>
          ) : (
            <div className={`my-species-collection my-species-collection--${view}`}>
              {filteredSpecies.map((record) => {
                const latestDate = record.latest.date ? formatDate(record.latest.date) : copy.noDate;
                const habitats = [...new Set(record.catches.map((entry) => entry.habitat))];
                return (
                  <article className="my-species-card" key={record.name.toLowerCase()}>
                    <PhotoThumbnail
                      photo={record.photos[0]?.photo ?? null}
                      altText={record.name}
                      photoCount={record.photos.length}
                      onView={() => openPhoto(record.photos, 0)}
                      className="my-species-card-photo"
                    />
                    <div className="my-species-card-content">
                      <div className="my-species-card-heading">
                        <h2>{record.name}</h2>
                        <span className="my-species-count">
                          {record.catches.length} {record.catches.length === 1 ? copy.catchSingular : copy.catches}
                        </span>
                      </div>
                      <p className="my-species-latest">{copy.latestCatch}: {latestDate}</p>
                      <div className="my-species-tags">
                        {habitats.slice(0, 2).map((habitat) => (
                          <span key={habitat}>{getHabitatLabel(habitat, lang)}</span>
                        ))}
                      </div>
                      <button type="button" className="my-species-details-button" onClick={() => setSelectedName(record.name)}>
                        {copy.openDetails}
                        <ArrowRight aria-hidden="true" size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      <dialog
        ref={detailDialogRef}
        className="my-species-detail-dialog"
        aria-labelledby="my-species-detail-title"
        onClose={() => setSelectedName(null)}
      >
        {selectedSpecies && (
          <div className="my-species-detail-panel">
            <header className="my-species-detail-header">
              <div>
                <p className="my-species-detail-kicker">{dict.mySpecies.cardTag}</p>
                <h2 id="my-species-detail-title">{selectedSpecies.name}</h2>
              </div>
              <button type="button" aria-label={lang === "fil" ? "Isara ang detalye" : "Close details"} onClick={() => setSelectedName(null)}>
                <X aria-hidden="true" size={18} />
              </button>
            </header>
            {selectedSpecies.photos[0] && (
              <PhotoThumbnail
                photo={selectedSpecies.photos[0].photo}
                altText={selectedSpecies.name}
                photoCount={selectedSpecies.photos.length}
                onView={() => openPhoto(selectedSpecies.photos, 0)}
                className="my-species-detail-photo"
              />
            )}
            <div className="my-species-detail-summary">
              <strong>
                {selectedSpecies.catches.length} {selectedSpecies.catches.length === 1 ? copy.catchSingular : copy.catches}
              </strong>
              <span>{copy.latestCatch}: {formatDate(selectedSpecies.latest.date)}</span>
            </div>
            <p className="my-species-detail-disclaimer">
              <LockKeyhole aria-hidden="true" size={15} />
              {dict.mySpecies.disclaimer}
            </p>
            <section className="my-species-catch-list" aria-labelledby="my-species-catches-heading">
              <h3 id="my-species-catches-heading">{copy.yourCatches}</h3>
              {selectedSpecies.catches.map((entry, index) => (
                <article key={entry.id ?? `${entry.date}-${index}`} className="my-species-catch-item">
                  {entry.photo && (
                    <PhotoThumbnail
                      photo={entry.photo}
                      altText={selectedSpecies.name}
                      onView={() =>
                        openPhoto(
                          selectedSpecies.photos,
                          selectedSpecies.photos.findIndex((photo) => photo.id === (entry.id ?? `${selectedSpecies.name}-${index}`)),
                        )
                      }
                      className="my-species-catch-photo"
                    />
                  )}
                  <div className="my-species-catch-copy">
                    <strong>{formatDate(entry.date)}</strong>
                    <span>{getHabitatLabel(entry.habitat, lang)}{entry.location ? ` · ${entry.location}` : ""}</span>
                    {entry.notes && <p>{entry.notes}</p>}
                  </div>
                </article>
              ))}
              {selectedSpecies.photos.length > 0 && <p className="sr-only">{copy.photos}: {selectedSpecies.photos.length}</p>}
            </section>
            <footer className="my-species-detail-footer">
              <Link href="/catches" className="ui-button ui-button--secondary">
                {dict.mySpecies.logCatchBtn}
              </Link>
            </footer>
          </div>
        )}
      </dialog>
      <PhotoViewer
        photos={viewerPhotos}
        initialIndex={viewerIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </main>
  );
}
