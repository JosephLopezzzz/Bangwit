"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listCatches } from "@/lib/storage/catches";
import type { CatchEntry } from "@/types/catch";

function Photo({ photo }: { photo: Blob | File | null }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!photo) return;
    const objectUrl = URL.createObjectURL(photo);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);
  return url ? (
    <Image
      src={url}
      alt="Larawan ng nahuling species"
      width={560}
      height={320}
      unoptimized
      className="aspect-[16/9] w-full object-cover"
    />
  ) : (
    <div className="grid aspect-[16/9] place-items-center bg-teal-soft text-4xl text-teal" aria-hidden="true">
      ≈
    </div>
  );
}

export default function MySpeciesPage() {
  const [entries, setEntries] = useState<CatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listCatches()
      .then(setEntries)
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : "Hindi mabasa ang local catch journal."),
      )
      .finally(() => setLoading(false));
  }, []);

  const species = useMemo(() => {
    const known = new Map<string, { name: string; catches: CatchEntry[] }>();
    for (const entry of entries) {
      const name = entry.species.trim();
      if (!name || name.toLocaleLowerCase() === "hindi pa natukoy") continue;
      const key = name.toLocaleLowerCase();
      const current = known.get(key) ?? { name, catches: [] };
      current.catches.push(entry);
      known.set(key, current);
    }
    return [...known.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [entries]);

  const unknownCount = entries.filter(
    (entry) => !entry.species.trim() || entry.species.trim().toLocaleLowerCase() === "hindi pa natukoy",
  ).length;

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Personal collection · device only</p>
        <span className="rounded-full bg-teal-soft px-4 py-2 text-sm font-bold text-teal-dark">
          {species.length} species discovered
        </span>
      </div>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">My Species</h1>
      <p className="mt-2 max-w-2xl text-lg leading-7 text-muted">
        Bawat identified species sa personal catch log mo ay may card rito. Hindi ito public sighting o verified
        regional record.
      </p>
      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </p>
      )}
      <div id="collectionNotice" className="mt-6">
        {loading ? (
          <p className="text-sm text-muted">Binubuksan ang collection…</p>
        ) : species.length === 0 ? (
          <section className="rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-sm sm:px-10">
            <div
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-soft text-3xl text-teal"
              aria-hidden="true"
            >
              ✦
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-teal">Your collection</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ink">Simulan ang species collection mo</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              {unknownCount
                ? `May ${unknownCount} catch ${unknownCount === 1 ? "tala" : "tala"} na hindi pa natutukoy. `
                : ""}
              Kapag nag-log ka ng identified species, mabubuksan dito ang collection card nito. Ang hindi pa natukoy ay
              mananatili sa My Catches.
            </p>
            <Link
              href="/catches"
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-teal px-5 font-bold text-white hover:bg-teal-dark"
            >
              Mag-log ng catch
            </Link>
          </section>
        ) : (
          <>
            {unknownCount > 0 && (
              <p className="mb-5 rounded-xl bg-paper px-4 py-3 text-sm text-muted">
                {unknownCount} hindi pa natukoy na {unknownCount === 1 ? "catch" : "catches"} ang nasa journal at hindi
                pa idinadagdag sa collection.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {species.map(({ name, catches }) => {
                const latest = [...catches].sort((a, b) => b.date.localeCompare(a.date))[0];
                return (
                  <article
                    key={name.toLocaleLowerCase()}
                    className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm"
                  >
                    <Photo photo={latest.photo} />
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal">Personal collection</p>
                      <h2 className="mt-2 text-xl font-extrabold text-ink">{name}</h2>
                      <p className="mt-1 text-sm text-muted">
                        {catches.length} {catches.length === 1 ? "personal catch" : "personal catches"} · latest{" "}
                        {latest.date || "date not recorded"}
                      </p>
                      <p className="mt-3 text-xs leading-5 text-muted">
                        Batay sa pribado mong catch log. Hindi ito patunay ng species status o dami sa lugar.
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
