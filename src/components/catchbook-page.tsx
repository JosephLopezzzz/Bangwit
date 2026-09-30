"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { listCatches, removeCatch, saveCatch } from "@/lib/storage/catches";
import type { CatchEntry } from "@/types/catch";

const WATER_TYPES = [
  { value: "Saltwater", label: "Saltwater", detail: "Dagat" },
  { value: "Freshwater", label: "Freshwater", detail: "Ilog o lawa" },
  { value: "Brackish", label: "Brackish", detail: "Halo ng alat at tabang" },
  { value: "Hindi alam", label: "Hindi alam", detail: "Idagdag mamaya" },
];

const controlClass =
  "mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15";
const labelClass = "block text-sm font-semibold text-ink";

function localDateValue() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function formatDate(value: string) {
  if (!value) return "Petsa hindi naitala";
  return new Intl.DateTimeFormat("fil-PH", { year: "numeric", month: "short", day: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function CatchPhoto({ photo }: { photo: Blob | File | null }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!photo) return;
    const objectUrl = URL.createObjectURL(photo);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);
  if (!url)
    return (
      <div aria-hidden="true" className="grid aspect-[4/3] place-items-center bg-teal-soft text-4xl text-teal">
        ≈
      </div>
    );
  return (
    <Image
      src={url}
      alt="Larawan ng nahuling yamang-tubig"
      width={720}
      height={540}
      unoptimized
      className="aspect-[4/3] w-full bg-paper object-cover"
    />
  );
}

export function CatchbookPage() {
  const { showMessage } = useBangwit();
  const [entries, setEntries] = useState<CatchEntry[]>([]);
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setEntries(await listCatches());
      setStorageError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hindi mabuksan ang catch journal.";
      setStorageError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setDate(localDateValue());
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!photo) {
      setPhotoUrl("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.id ?? 0) - (a.id ?? 0)),
    [entries],
  );

  async function submitCatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const entry: CatchEntry = {
      species: String(data.get("species") || "").trim() || "Hindi pa natukoy",
      date: String(data.get("date") || ""),
      habitat: String(data.get("habitat") || ""),
      location: String(data.get("location") || "").trim(),
      length: String(data.get("length") || ""),
      weight: String(data.get("weight") || ""),
      bait: String(data.get("bait") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      disposition: String(data.get("disposition") || "Not recorded"),
      photo,
      savedAt: new Date().toISOString(),
      syncStatus: "device-only",
    };
    setSaving(true);
    try {
      await saveCatch(entry);
      form.reset();
      setPhoto(null);
      setDate(localDateValue());
      setEntries(await listCatches());
      setStorageError("");
      showMessage("Naka-save ang huli sa device mo. Wala pang cloud sync.");
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Hindi na-save ang huli. Subukang muli.");
      showMessage("Hindi na-save ang huli. Nasa form pa rin ang mga detalye para masubukan ulit.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(entry: CatchEntry) {
    if (!entry.id) return;
    try {
      await removeCatch(entry.id);
      setEntries(await listCatches());
      showMessage("Nabura ang tala sa device na ito.");
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Hindi nabura ang tala.");
    }
  }

  function acceptPhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStorageError("Pumili ng image file para sa larawan ng huli.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStorageError("Hanggang 10 MB muna ang larawan para hindi mapuno agad ang device storage.");
      return;
    }
    setStorageError("");
    setPhoto(file);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-full bg-teal-soft px-4 py-2 text-xs font-bold text-teal-dark">
          🔒 Pribado · sa device lang
        </p>
        <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-muted">Device-only storage</span>
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">My Catches</h1>
      <p className="mt-2 text-lg text-muted sm:text-xl">Bawat huli, may kuwento. I-save ang sa iyo.</p>

      {storageError && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {storageError}
        </p>
      )}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,.95fr)]">
        <form
          id="catchForm"
          onSubmit={submitCatch}
          className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-7"
        >
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Bagong entry</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">May huli ako!</h2>
          <p className="mt-1 text-sm text-muted">Kapag bukas na ang journal, local ang save kahit walang signal.</p>

          <fieldset
            aria-label="Pumili o mag-drag ng larawan ng huli"
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              acceptPhoto(event.dataTransfer.files[0]);
            }}
            className={`mt-5 flex min-h-24 flex-wrap items-center gap-3 rounded-2xl border border-dashed px-4 py-3 transition-colors ${dragging ? "border-teal bg-teal-soft" : "border-slate-300 bg-white hover:border-teal"}`}
          >
            <label
              htmlFor="catchPhoto"
              className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full bg-teal-soft text-xl text-teal"
              aria-label="Pumili ng larawan"
            >
              ▣
            </label>
            <div className="min-w-0 flex-1">
              <label htmlFor="catchPhoto" className="cursor-pointer text-sm font-bold text-ink">
                Magdagdag ng larawan
              </label>
              <p className="mt-1 break-all text-xs text-muted">
                {photo?.name ?? "Opsyonal · hanggang 10 MB · sa device mo lang"}
              </p>
            </div>
            {photoUrl && (
              <div className="flex items-center gap-2">
                <Image
                  src={photoUrl}
                  alt="Preview ng larawan ng huli"
                  width={64}
                  height={64}
                  unoptimized
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-muted hover:bg-paper"
                  aria-label="Alisin ang larawan"
                >
                  Alisin
                </button>
              </div>
            )}
            <input
              id="catchPhoto"
              name="photo"
              type="file"
              accept="image/*"
              onChange={(event) => acceptPhoto(event.target.files?.[0])}
              className="sr-only"
            />
          </fieldset>

          <div className="mt-5">
            <label htmlFor="catchSpecies" className={labelClass}>
              Species <span className="ml-1 font-normal text-muted">opsyonal</span>
            </label>
            <input
              id="catchSpecies"
              name="species"
              maxLength={80}
              placeholder="Anong nahuli mo?"
              className={controlClass}
            />
            <p className="mt-1.5 text-xs text-muted">Puwede itong iwanang blangko kung hindi pa matukoy.</p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(180px,.75fr)_minmax(0,1.5fr)]">
            <div>
              <label htmlFor="catchDate" className={labelClass}>
                Petsa
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="catchDate"
                  name="date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-sm text-ink"
                />
                <button
                  type="button"
                  onClick={() => setDate(localDateValue())}
                  className="min-h-12 rounded-xl bg-teal-soft px-3 text-sm font-bold text-teal-dark hover:bg-[#cdebe6]"
                >
                  Ngayon
                </button>
              </div>
            </div>
            <fieldset>
              <legend className={labelClass}>Uri ng tubig</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {WATER_TYPES.map((water, index) => (
                  <label
                    key={water.value}
                    className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 has-[:checked]:border-teal has-[:checked]:bg-teal-soft/70"
                  >
                    <input
                      type="radio"
                      name="habitat"
                      value={water.value}
                      defaultChecked={index === 0}
                      className="accent-teal"
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-ink">{water.label}</span>
                      <span className="block text-[11px] text-muted">{water.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <details className="mt-5 border-t border-line pt-4">
            <summary className="cursor-pointer list-none font-bold text-ink marker:content-none">
              Dagdag na detalye <span className="ml-1 text-sm font-normal text-muted">Lugar, sukat, pain at tala</span>
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="catchLocation" className={labelClass}>
                  Lugar <span className="ml-1 font-normal text-muted">optional · private</span>
                </label>
                <input
                  id="catchLocation"
                  name="location"
                  maxLength={100}
                  placeholder="Bay, barangay, o private spot label"
                  className={controlClass}
                />
                <p className="mt-1 text-xs leading-5 text-muted">
                  Sa device lang ito naka-save. Huwag ilagay ang eksaktong spot kung ayaw mong itala.
                </p>
              </div>
              <div>
                <label htmlFor="catchLength" className={labelClass}>
                  Haba (cm) <span className="font-normal text-muted">· optional</span>
                </label>
                <input
                  id="catchLength"
                  name="length"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="—"
                  className={controlClass}
                />
              </div>
              <div>
                <label htmlFor="catchWeight" className={labelClass}>
                  Timbang (g) <span className="font-normal text-muted">· optional</span>
                </label>
                <input
                  id="catchWeight"
                  name="weight"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  inputMode="decimal"
                  placeholder="—"
                  className={controlClass}
                />
              </div>
              <div>
                <label htmlFor="catchBait" className={labelClass}>
                  Pain o pang-akit <span className="font-normal text-muted">· optional</span>
                </label>
                <input
                  id="catchBait"
                  name="bait"
                  maxLength={100}
                  placeholder="Hal. bulate o lure"
                  className={controlClass}
                />
              </div>
              <div>
                <label htmlFor="catchDisposition" className={labelClass}>
                  Catch status
                </label>
                <select id="catchDisposition" name="disposition" defaultValue="Released" className={controlClass}>
                  <option value="Released">Released</option>
                  <option value="Kept">Kept</option>
                  <option value="Not recorded">Not recorded</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="catchNotes" className={labelClass}>
                  Notes <span className="font-normal text-muted">· optional</span>
                </label>
                <textarea
                  id="catchNotes"
                  name="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Kondisyon, gear, o iba pang detalye"
                  className={`${controlClass} py-3`}
                />
              </div>
            </div>
          </details>

          <button
            type="submit"
            disabled={saving || !date}
            className="mt-5 min-h-12 w-full rounded-xl bg-teal px-5 font-bold text-white shadow-sm hover:bg-teal-dark disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? "Sine-save…" : "▣  I-save ang huli"}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Naka-save sa browser ng device mo. Wala pang cloud sync o GPS.
          </p>
        </form>

        <section
          className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="journalHeading"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="journalHeading" className="text-xl font-extrabold text-ink">
              Ang iyong journal
            </h2>
            <span className="rounded-full bg-teal-soft px-4 py-2 text-sm font-bold text-teal-dark">
              {entries.length} huli
            </span>
          </div>
          {loading ? (
            <p className="py-10 text-center text-sm text-muted">Binubuksan ang journal…</p>
          ) : sortedEntries.length === 0 ? (
            <div className="py-5 text-center">
              <div className="mx-auto grid h-52 w-full max-w-xs place-items-center rounded-3xl bg-gradient-to-b from-[#eaf7f5] to-white">
                <Image
                  src="/assets/bilog-idle-blink-slow-right.gif"
                  alt="Si Bangwit, ang mascot mo"
                  width={170}
                  height={170}
                  unoptimized
                  className="h-40 w-40 object-contain"
                />
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-ink">Dito magsisimula ang kuwento mo</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Wala ka pang naitatala.
                <br />
                I-log ang unang huli mo sa form.
              </p>
              <p className="mt-7 rounded-xl bg-teal-soft/70 px-4 py-3 text-xs font-semibold text-teal-dark">
                🔒 Ikaw lang ang may access sa mga tala sa browser na ito.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {sortedEntries.map((entry, index) => (
                <li
                  key={entry.id ?? `${entry.date}-${index}`}
                  className="overflow-hidden rounded-2xl border border-line bg-white"
                >
                  <CatchPhoto photo={entry.photo} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-ink">{entry.species || "Hindi pa natukoy"}</h3>
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(entry.date)} · {entry.habitat || "Uri ng tubig hindi naitala"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteEntry(entry)}
                        className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                        aria-label={`Burahin ang catch na ${entry.species || "hindi pa natukoy"}`}
                      >
                        Burahin
                      </button>
                    </div>
                    {(entry.location || entry.length || entry.weight || entry.bait || entry.disposition) && (
                      <p className="mt-2 text-xs leading-5 text-muted">
                        {[
                          entry.location,
                          entry.length && `${entry.length} cm`,
                          entry.weight && `${entry.weight} g`,
                          entry.bait,
                          entry.disposition,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-slate-700">{entry.notes}</p>
                    )}
                    <p className="mt-3 text-[11px] font-medium text-muted">Naka-save lang sa device mo</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 border-t border-line pt-4">
            <Link href="/my-species" className="font-bold text-teal hover:text-teal-dark">
              Tingnan ang My Species →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
