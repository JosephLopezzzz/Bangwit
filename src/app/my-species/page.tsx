"use client";

import { Fish } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { type PhotoItem, PhotoThumbnail, PhotoViewer } from "@/components/photo-viewer";
import { listCatches } from "@/lib/storage/catches";
import type { CatchEntry } from "@/types/catch";

export default function MySpeciesPage() {
  const { lang, dict } = useBangwit();
  const [entries, setEntries] = useState<CatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewerPhotos, setViewerPhotos] = useState<PhotoItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    listCatches()
      .then(setEntries)
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error
            ? reason.message
            : lang === "fil"
              ? "Hindi mabasa ang local catch journal."
              : "Could not read local catch journal.",
        ),
      )
      .finally(() => setLoading(false));
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
    return [...known.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [entries]);

  const unknownCount = entries.filter((entry) => {
    const s = entry.species.trim().toLowerCase();
    return !s || s === "hindi pa natukoy" || s === "unidentified";
  }).length;

  return (
    <main className="ui-page">
      <header className="ui-page-header">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="ui-page-title">{dict.mySpecies.title}</h1>
          <span className="ui-caption rounded-full bg-teal-soft px-3 py-1 font-semibold text-teal-dark">
            {species.length} {dict.mySpecies.badge}
          </span>
        </div>
        <p className="max-w-[75ch] leading-relaxed text-muted">{dict.mySpecies.subtitle}</p>
      </header>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </p>
      )}

      <div id="collectionNotice">
        {loading ? (
          <p className="text-sm text-muted">{dict.mySpecies.loading}</p>
        ) : species.length === 0 ? (
          <section className="ui-card text-center">
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
            {unknownCount > 0 && (
              <p className="mb-5 rounded-xl bg-paper px-4 py-3 text-sm text-muted">
                {unknownCount} {dict.mySpecies.unidentifiedBanner}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {species.map(({ name, catches }) => {
                const sorted = [...catches].sort(
                  (a, b) => b.date.localeCompare(a.date) || b.savedAt.localeCompare(a.savedAt),
                );
                const latest = sorted[0];
                const photos = sorted.flatMap<PhotoItem>((entry, index) =>
                  entry.photo
                    ? [{ id: entry.id ?? `${name}-${index}`, photo: entry.photo, title: name, date: entry.date }]
                    : [],
                );
                return (
                  <article key={name.toLowerCase()} className="overflow-hidden rounded-xl border border-line bg-white">
                    <PhotoThumbnail
                      photo={photos[0]?.photo ?? null}
                      altText={name}
                      photoCount={photos.length}
                      onView={() => {
                        setViewerPhotos(photos);
                        setViewerOpen(true);
                      }}
                    />
                    <div className="p-4">
                      <h2 className="text-base font-bold text-ink">{name}</h2>
                      <p className="mt-1 text-sm text-muted">
                        {catches.length} {dict.mySpecies.personalCatchesLabel} · latest{" "}
                        {latest.date || (lang === "fil" ? "petsa hindi naitala" : "date not recorded")}
                      </p>
                      <p className="mt-3 text-xs leading-5 text-muted">{dict.mySpecies.disclaimer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
      <PhotoViewer photos={viewerPhotos} open={viewerOpen} onClose={() => setViewerOpen(false)} />
    </main>
  );
}
