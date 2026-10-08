"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CircleCheck,
  CircleQuestionMark,
  Fish,
  ImagePlus,
  LockKeyhole,
  Save,
  Upload,
  Waves,
} from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import { CatchDatePicker } from "@/components/catch-date-picker";
import { DropdownSelect } from "@/components/dropdown-select";
import { getDispositionLabel, getHabitatLabel, getSpeciesDisplay } from "@/i18n/labels";
import { listCatches, removeCatch, saveCatch } from "@/lib/storage/catches";
import type { CatchEntry } from "@/types/catch";

const controlClass =
  "mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15";
const labelClass = "block text-sm font-semibold text-ink";
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

function localDateValue() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function formatDate(value: string, lang: "fil" | "en") {
  if (!value) return lang === "fil" ? "Petsa hindi naitala" : "Date not recorded";
  return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatFileSize(bytes: number, lang: "fil" | "en") {
  const unit = bytes < 1024 * 1024 ? "KB" : "MB";
  const size = unit === "KB" ? bytes / 1024 : bytes / (1024 * 1024);
  const formatted = new Intl.NumberFormat(lang === "fil" ? "fil-PH" : "en-US", {
    maximumFractionDigits: 1,
  }).format(size);
  return `${formatted} ${unit}`;
}

function CatchPhoto({ photo, altText }: { photo: Blob | File | null; altText: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!photo) return;
    const objectUrl = URL.createObjectURL(photo);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  if (!url)
    return (
      <div aria-hidden="true" className="grid aspect-[4/3] place-items-center bg-teal-soft">
        <Waves className="h-8 w-8 text-teal" strokeWidth={1.75} />
      </div>
    );

  return (
    <Image
      src={url}
      alt={altText}
      width={720}
      height={540}
      unoptimized
      className="aspect-[4/3] w-full bg-paper object-cover"
    />
  );
}

export function CatchbookPage() {
  const { showMessage, lang, dict } = useBangwit();
  const [entries, setEntries] = useState<CatchEntry[]>([]);
  const [date, setDate] = useState("");
  const [disposition, setDisposition] = useState("Released");
  const [photo, setPhoto] = useState<File | null>(null);
  const [savedPhoto, setSavedPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [savedPhotoUrl, setSavedPhotoUrl] = useState("");
  const [photoSaved, setPhotoSaved] = useState(false);
  const [photoSaveError, setPhotoSaveError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState("");

  const waterTypes = useMemo(
    () => [
      {
        value: "Saltwater",
        label: dict.catches.habitats.saltwater.label,
        detail: dict.catches.habitats.saltwater.detail,
      },
      {
        value: "Freshwater",
        label: dict.catches.habitats.freshwater.label,
        detail: dict.catches.habitats.freshwater.detail,
      },
      { value: "Brackish", label: dict.catches.habitats.brackish.label, detail: dict.catches.habitats.brackish.detail },
      { value: "Hindi alam", label: dict.catches.habitats.unknown.label, detail: dict.catches.habitats.unknown.detail },
    ],
    [dict],
  );
  const dispositionOptions = useMemo(
    () => [
      { value: "Released", label: dict.catches.dispositionReleased, icon: Fish },
      { value: "Kept", label: dict.catches.dispositionKept, icon: CircleCheck },
      { value: "Not recorded", label: dict.catches.dispositionNotRecorded, icon: CircleQuestionMark },
    ],
    [dict],
  );

  const refresh = useCallback(async () => {
    try {
      setEntries(await listCatches());
      setStorageError("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi mabuksan ang catch journal."
            : "Could not open catch journal.";
      setStorageError(message);
    } finally {
      setLoading(false);
    }
  }, [lang]);

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

  useEffect(() => {
    if (!savedPhoto) {
      setSavedPhotoUrl("");
      return;
    }
    const url = URL.createObjectURL(savedPhoto);
    setSavedPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [savedPhoto]);

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
    const hasPhoto = Boolean(photo);
    let photoStored = false;
    setSaving(true);
    setPhotoSaveError("");
    setPhotoSaved(false);
    setSavedPhoto(null);
    try {
      await saveCatch(entry);
      photoStored = hasPhoto;
      form.reset();
      setDisposition("Released");
      if (photo) setSavedPhoto(photo);
      setPhoto(null);
      setPhotoSaved(photoStored);
      setDate(localDateValue());
      setEntries(await listCatches());
      setStorageError("");
      showMessage(
        lang === "fil"
          ? "Naka-save ang huli sa device mo. Wala pang cloud sync."
          : "Catch saved to this device. No cloud sync.",
      );
    } catch (error) {
      if (hasPhoto && !photoStored) setPhotoSaveError(dict.catches.photoSaveFailed);
      setStorageError(
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi na-save ang huli. Subukang muli."
            : "Failed to save catch. Please try again.",
      );
      showMessage(
        lang === "fil"
          ? "Hindi na-save ang huli. Nasa form pa rin ang mga detalye para masubukan ulit."
          : "Catch could not be saved. Form details were kept so you can retry.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(entry: CatchEntry) {
    if (!entry.id) return;
    try {
      await removeCatch(entry.id);
      setEntries(await listCatches());
      showMessage(lang === "fil" ? "Nabura ang tala sa device na ito." : "Record deleted from this device.");
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : lang === "fil" ? "Hindi nabura ang tala." : "Failed to delete record.",
      );
    }
  }

  function acceptPhoto(file: File | undefined) {
    if (!file || saving) return;
    if (!file.type.startsWith("image/")) {
      setStorageError(
        lang === "fil"
          ? "Pumili ng image file para sa larawan ng huli."
          : "Please choose an image file for the catch photo.",
      );
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setStorageError(
        lang === "fil"
          ? "Hanggang 10 MB muna ang larawan para hindi mapuno agad ang device storage."
          : "Photo size limited to 10 MB to prevent filling device storage.",
      );
      return;
    }
    setStorageError("");
    setPhotoSaved(false);
    setPhotoSaveError("");
    setSavedPhoto(null);
    setPhoto(file);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-4 py-2 text-xs font-bold text-teal-dark">
          <LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0" />
          {dict.common.privateDeviceOnly}
        </p>
        <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-muted">
          {dict.common.deviceOnlyStorage}
        </span>
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{dict.catches.title}</h1>
      <p className="mt-2 text-lg text-muted sm:text-xl">{dict.catches.subtitle}</p>

      {storageError && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {storageError}
        </p>
      )}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,.95fr)]">
        <form
          id="catchForm"
          onSubmit={submitCatch}
          onInput={() => {
            if (photoSaved) {
              setPhotoSaved(false);
              setSavedPhoto(null);
            }
          }}
          onChange={() => {
            if (photoSaved) {
              setPhotoSaved(false);
              setSavedPhoto(null);
            }
          }}
          className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-7"
        >
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.catches.formTag}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{dict.catches.formTitle}</h2>
          <p className="mt-1 text-sm text-muted">{dict.catches.formDesc}</p>

          <div className="mt-5">
            <p id="catchPhotoLabel" className={labelClass}>
              {dict.catches.photoLabel} <span className="ml-1 font-normal text-muted">{dict.common.optional}</span>
            </p>
            <div
              role="group"
              aria-labelledby="catchPhotoLabel"
              aria-busy={saving && Boolean(photo)}
              onClick={(event) => {
                if (event.target instanceof Element && event.target.closest("label, button, input")) return;
                if (!saving) photoInputRef.current?.click();
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                if (!saving) setDragging(true);
              }}
              onDragLeave={(event) => {
                const target = event.relatedTarget;
                if (!(target instanceof Node) || !event.currentTarget.contains(target)) setDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                acceptPhoto(event.dataTransfer.files[0]);
              }}
              className={`flex min-h-36 flex-wrap items-center gap-4 rounded-2xl border border-dashed p-4 transition-colors duration-150 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15 ${saving ? "cursor-wait" : "cursor-pointer"} ${
                dragging
                  ? "border-teal bg-teal-soft ring-2 ring-teal/15"
                  : "border-slate-300 bg-white hover:border-teal"
              }`}
            >
              <div
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-soft text-teal"
              >
                <ImagePlus className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <label
                    htmlFor="catchPhoto"
                    className={`text-sm font-bold text-teal underline-offset-4 hover:underline ${saving ? "cursor-wait" : "cursor-pointer"}`}
                  >
                    {photo ? dict.catches.photoChooseAnother : dict.catches.photoChoose}
                  </label>
                  <span className="text-sm text-muted">{dict.catches.photoDropHint}</span>
                </div>
                <p className="mt-1 break-all text-xs text-muted">
                  {photo ? `${photo.name} · ${formatFileSize(photo.size, lang)}` : dict.catches.photoHelp}
                </p>
                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  <span>{dict.catches.photoStorageDestination}</span>
                </p>
              </div>
              {photoUrl && (
                <div className="flex items-center gap-2">
                  <Image
                    src={photoUrl}
                    alt={dict.catches.photoPreviewAlt}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setPhoto(null);
                      setPhotoSaveError("");
                      setPhotoSaved(false);
                    }}
                    className="rounded-lg px-2 py-1 text-sm font-semibold text-muted hover:bg-paper"
                    aria-label={dict.catches.photoRemove}
                  >
                    {dict.catches.photoRemove}
                  </button>
                </div>
              )}
              <input
                ref={photoInputRef}
                id="catchPhoto"
                name="photo"
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={(event) => acceptPhoto(event.target.files?.[0])}
                className="sr-only"
              />
            </div>
            {photo && saving && (
              <div role="status" aria-live="polite" className="mt-3 rounded-xl border border-line bg-white px-3 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Upload aria-hidden="true" className="h-4 w-4 shrink-0 text-teal" />
                  <span>{dict.catches.photoSavingStatus}</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={dict.catches.photoSavingStatus}
                  aria-valuetext={dict.catches.photoSavingStatus}
                  className="catch-photo-progress mt-2.5"
                />
              </div>
            )}
            {photo && !saving && (
              <p
                role={photoSaveError ? "alert" : "status"}
                className={`mt-3 text-sm ${photoSaveError ? "text-rose-700" : "text-muted"}`}
              >
                {photoSaveError || dict.catches.photoReadyStatus}
              </p>
            )}
            {photoSaved && !photo && (
              <div role="status" className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                {savedPhotoUrl && (
                  <a
                    href={savedPhotoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={dict.catches.photoOpenFull}
                    className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                  >
                    <Image
                      src={savedPhotoUrl}
                      alt={dict.catches.photoPreviewAlt}
                      width={88}
                      height={72}
                      unoptimized
                      className="h-[72px] w-[88px] rounded-lg bg-paper object-cover"
                    />
                  </a>
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-teal-dark">
                    <CircleCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{dict.catches.photoSaveSuccess}</span>
                  </p>
                  {savedPhotoUrl && (
                    <a
                      href={savedPhotoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm font-semibold text-teal underline-offset-4 hover:underline"
                    >
                      {dict.catches.photoOpenFull}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <label htmlFor="catchSpecies" className={labelClass}>
              {dict.catches.speciesLabel} <span className="ml-1 font-normal text-muted">{dict.common.optional}</span>
            </label>
            <input
              id="catchSpecies"
              name="species"
              maxLength={80}
              placeholder={dict.catches.speciesPlaceholder}
              className={controlClass}
            />
            <p className="mt-1.5 text-xs text-muted">{dict.catches.speciesHelp}</p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(180px,.75fr)_minmax(0,1.5fr)]">
            <div>
              <label htmlFor="catchDateTrigger" className={labelClass}>
                {dict.catches.dateLabel}
              </label>
              {/* Lightswind Calendar integration via CatchDatePicker */}
              <CatchDatePicker value={date} onChange={setDate} lang={lang} />
            </div>

            <fieldset>
              <legend className={labelClass}>{dict.catches.habitatLegend}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {waterTypes.map((water, index) => (
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
              {dict.catches.moreDetailsSummary}{" "}
              <span className="ml-1 text-sm font-normal text-muted">{dict.catches.moreDetailsSummarySub}</span>
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="catchLocation" className={labelClass}>
                  {dict.catches.locationLabel}{" "}
                  <span className="ml-1 font-normal text-muted">· {dict.common.optional}</span>
                </label>
                <input
                  id="catchLocation"
                  name="location"
                  maxLength={100}
                  placeholder={dict.catches.locationPlaceholder}
                  className={controlClass}
                />
                <p className="mt-1 text-xs leading-5 text-muted">{dict.catches.locationHelp}</p>
              </div>
              <div>
                <label htmlFor="catchLength" className={labelClass}>
                  {dict.catches.lengthLabel} <span className="font-normal text-muted">· {dict.common.optional}</span>
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
                  {dict.catches.weightLabel} <span className="font-normal text-muted">· {dict.common.optional}</span>
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
                  {dict.catches.baitLabel} <span className="font-normal text-muted">· {dict.common.optional}</span>
                </label>
                <input
                  id="catchBait"
                  name="bait"
                  maxLength={100}
                  placeholder={dict.catches.baitPlaceholder}
                  className={controlClass}
                />
              </div>
              <div>
                <label htmlFor="catchDisposition" className={labelClass}>
                  {dict.catches.dispositionLabel}
                </label>
                <DropdownSelect
                  id="catchDisposition"
                  label={dict.catches.dispositionLabel}
                  name="disposition"
                  value={disposition}
                  onValueChange={setDisposition}
                  options={dispositionOptions}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="catchNotes" className={labelClass}>
                  {dict.catches.notesLabel} <span className="font-normal text-muted">· {dict.common.optional}</span>
                </label>
                <textarea
                  id="catchNotes"
                  name="notes"
                  rows={3}
                  maxLength={500}
                  placeholder={dict.catches.notesPlaceholder}
                  className={`${controlClass} py-3`}
                />
              </div>
            </div>
          </details>

          <button
            type="submit"
            disabled={saving || !date}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal px-5 font-bold text-white shadow-sm hover:bg-teal-dark disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? (
              dict.catches.submittingBtn
            ) : (
              <>
                <Save aria-hidden="true" className="h-4 w-4" />
                {dict.catches.submitBtn}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted">{dict.catches.storageNote}</p>
        </form>

        <section
          className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="journalHeading"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="journalHeading" className="text-xl font-extrabold text-ink">
              {dict.catches.journalHeading}
            </h2>
            <span className="rounded-full bg-teal-soft px-4 py-2 text-sm font-bold text-teal-dark">
              {entries.length} {dict.catches.catchesCount}
            </span>
          </div>
          {loading ? (
            <p className="py-10 text-center text-sm text-muted">{dict.catches.loadingJournal}</p>
          ) : sortedEntries.length === 0 ? (
            <div className="py-5 text-center">
              <div className="catch-empty-art mx-auto grid h-52 w-full max-w-xs place-items-center rounded-3xl">
                <Image
                  src="/assets/bilog-idle-blink-slow-right.gif"
                  alt="Si Bangwit, ang mascot mo"
                  width={170}
                  height={170}
                  unoptimized
                  className="h-40 w-40 object-contain"
                />
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-ink">{dict.catches.emptyTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{dict.catches.emptyDesc}</p>
              <p className="mt-7 flex items-center gap-2 rounded-xl bg-teal-soft/70 px-4 py-3 text-left text-xs font-semibold text-teal-dark">
                <LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0" />
                {dict.catches.emptyPrivacyNote}
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {sortedEntries.map((entry, index) => {
                const displayName = getSpeciesDisplay(entry.species, lang);
                const displayHabitat = getHabitatLabel(entry.habitat, lang);
                const displayDisposition = getDispositionLabel(entry.disposition, lang);

                return (
                  <li
                    key={entry.id ?? `${entry.date}-${index}`}
                    className="overflow-hidden rounded-2xl border border-line bg-white"
                  >
                    <CatchPhoto photo={entry.photo} altText={`${displayName} photo`} />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-ink">{displayName}</h3>
                          <p className="mt-1 text-xs text-muted">
                            {formatDate(entry.date, lang)} · {displayHabitat}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void deleteEntry(entry)}
                          className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                          aria-label={`${dict.catches.deleteCatchAria} ${displayName}`}
                        >
                          {dict.common.delete}
                        </button>
                      </div>
                      {(entry.location || entry.length || entry.weight || entry.bait || entry.disposition) && (
                        <p className="mt-2 text-xs leading-5 text-muted">
                          {[
                            entry.location,
                            entry.length && `${entry.length} cm`,
                            entry.weight && `${entry.weight} g`,
                            entry.bait,
                            displayDisposition,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {entry.notes && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-slate-700">{entry.notes}</p>
                      )}
                      <p className="mt-3 text-[11px] font-medium text-muted">{dict.common.offlineSaved}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-5 border-t border-line pt-4">
            <Link
              href="/my-species"
              className="inline-flex items-center gap-1 font-bold text-teal hover:text-teal-dark"
            >
              {dict.catches.viewMySpecies}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
