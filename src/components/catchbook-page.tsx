"use client";

import { CircleCheck, CircleQuestionMark, Fish, ImagePlus, LockKeyhole, Save, Trash2 } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { CatchDatePicker } from "@/components/catch-date-picker";
import { CatchGallery } from "@/components/catch-gallery";
import { DropdownSelect } from "@/components/dropdown-select";
import { type PhotoItem, PhotoThumbnail, PhotoViewer } from "@/components/photo-viewer";
import { listCatches, removeCatch, saveCatch } from "@/lib/storage/catches";
import type { CatchEntry } from "@/types/catch";
import "./catchbook-page.css";

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

function localDateValue() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function formatFileSize(bytes: number, lang: "fil" | "en") {
  const unit = bytes < 1024 * 1024 ? "KB" : "MB";
  return `${new Intl.NumberFormat(lang === "fil" ? "fil-PH" : "en-US", { maximumFractionDigits: 1 }).format(bytes / (unit === "KB" ? 1024 : 1024 * 1024))} ${unit}`;
}

function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
  const current = tabs.indexOf(event.target as HTMLButtonElement);
  if (current < 0 || !tabs.length) return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].click();
  tabs[next].focus();
}

export function CatchbookPage() {
  const { dict, lang, showMessage } = useBangwit();
  const [entries, setEntries] = useState<CatchEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [disposition, setDisposition] = useState("Released");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [photoSaveError, setPhotoSaveError] = useState("");
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [formTab, setFormTab] = useState<"catch" | "details">("catch");
  const [mobileView, setMobileView] = useState<"journal" | "form">("journal");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const speciesRef = useRef<HTMLInputElement>(null);

  const waterTypes = [
    { value: "Saltwater", ...dict.catches.habitats.saltwater },
    { value: "Freshwater", ...dict.catches.habitats.freshwater },
    { value: "Brackish", ...dict.catches.habitats.brackish },
    { value: "Hindi alam", ...dict.catches.habitats.unknown },
  ];
  const dispositionOptions = [
    { value: "Released", label: dict.catches.dispositionReleased, icon: Fish },
    { value: "Kept", label: dict.catches.dispositionKept, icon: CircleCheck },
    { value: "Not recorded", label: dict.catches.dispositionNotRecorded, icon: CircleQuestionMark },
  ];
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.id ?? 0) - (a.id ?? 0)),
    [entries],
  );
  const pendingPhotos = useMemo<PhotoItem[]>(
    () => (photo ? [{ id: "pending", photo, title: dict.catches.photoPreviewAlt }] : []),
    [photo, dict.catches.photoPreviewAlt],
  );

  const refresh = useCallback(async () => {
    try {
      setEntries(await listCatches());
      setStorageError("");
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi mabuksan ang catch journal."
            : "Could not open catch journal.",
      );
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    setDate(localDateValue());
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  function openForm() {
    setMobileView("form");
    setFormTab("catch");
    requestAnimationFrame(() => speciesRef.current?.focus());
  }

  async function submitCatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    if (!date) {
      setFormTab("catch");
      requestAnimationFrame(() => document.getElementById("catchDateTrigger")?.focus());
      return;
    }
    if (!form.checkValidity()) {
      const invalid = form.querySelector<HTMLInputElement>("input:invalid, textarea:invalid, select:invalid");
      setFormTab(
        invalid?.closest("[data-form-panel]")?.getAttribute("data-form-panel") === "details" ? "details" : "catch",
      );
      requestAnimationFrame(() => invalid?.reportValidity());
      return;
    }
    const data = new FormData(form);
    const entry: CatchEntry = {
      species: String(data.get("species") || "").trim() || "Hindi pa natukoy",
      date,
      habitat: String(data.get("habitat") || "Saltwater"),
      location: String(data.get("location") || "").trim(),
      length: String(data.get("length") || ""),
      weight: String(data.get("weight") || ""),
      bait: String(data.get("bait") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      disposition,
      photo,
      savedAt: new Date().toISOString(),
      syncStatus: "device-only",
    };
    setFormTab("catch");
    setSaving(true);
    setStorageError("");
    setPhotoSaveError("");
    setPhotoSaved(false);
    try {
      const id = Number(await saveCatch(entry));
      setEntries((current) => [...current, { ...entry, id }]);
      setSelectedId(id);
      form.reset();
      setDisposition("Released");
      setPhotoSaved(Boolean(photo));
      setPhoto(null);
      setPhotoViewerOpen(false);
      setDate(localDateValue());
      setFormTab("catch");
      setMobileView("journal");
      showMessage(
        lang === "fil"
          ? "Naka-save ang huli sa device mo. Wala pang cloud sync."
          : "Catch saved to this device. No cloud sync.",
      );
    } catch (error) {
      if (photo) setPhotoSaveError(dict.catches.photoSaveFailed);
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
    if (entry.id == null) return;
    try {
      await removeCatch(entry.id);
      const index = sortedEntries.findIndex((item) => item.id === entry.id);
      const remaining = sortedEntries.filter((item) => item.id !== entry.id);
      setEntries(remaining);
      if (selectedId === entry.id || selectedId === null) {
        setSelectedId(remaining[Math.min(index, remaining.length - 1)]?.id ?? null);
      }
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
      setPhotoSaveError(
        lang === "fil"
          ? "Pumili ng image file para sa larawan ng huli."
          : "Please choose an image file for the catch photo.",
      );
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoSaveError(lang === "fil" ? "Hanggang 10 MB ang larawan." : "Photo size is limited to 10 MB.");
      return;
    }
    setStorageError("");
    setPhotoSaved(false);
    setPhotoSaveError("");
    setPhoto(file);
  }

  return (
    <main className="catches-page" data-mobile-view={mobileView}>
      <header className="catches-page-heading">
        <div>
          <h1>{dict.catches.title}</h1>
          <p>{dict.catches.subtitle}</p>
        </div>
        <span className="catches-privacy">
          <LockKeyhole aria-hidden="true" size={14} />
          {dict.common.privateDeviceOnly}
        </span>
      </header>
      {storageError && (
        <p role="alert" className="catches-storage-error">
          {storageError}
        </p>
      )}
      <div className="catches-mobile-tabs" role="tablist" aria-label={dict.catches.title} onKeyDown={navigateTabs}>
        <button
          type="button"
          id="catches-journal-tab"
          role="tab"
          aria-selected={mobileView === "journal"}
          aria-controls="catches-journal-panel"
          tabIndex={mobileView === "journal" ? 0 : -1}
          onClick={() => setMobileView("journal")}
        >
          {dict.catches.journalTab}
          <span>{entries.length}</span>
        </button>
        <button
          type="button"
          id="catches-form-tab"
          role="tab"
          aria-selected={mobileView === "form"}
          aria-controls="catches-form-panel"
          tabIndex={mobileView === "form" ? 0 : -1}
          onClick={() => setMobileView("form")}
        >
          {dict.catches.logCatchTab}
        </button>
      </div>
      <div id="catchForm" className="catches-workspace">
        <div id="catches-journal-panel" className="catches-journal-panel">
          <CatchGallery
            entries={sortedEntries}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={deleteEntry}
            onAdd={openForm}
            loading={loading}
          />
        </div>
        <form
          id="catches-form-panel"
          className="catch-form"
          noValidate
          onSubmit={submitCatch}
          onInput={() => setPhotoSaved(false)}
        >
          <h2>{dict.catches.logCatchTab}</h2>
          <div className="catch-form-tabs" role="tablist" aria-label={dict.catches.formTitle} onKeyDown={navigateTabs}>
            <button
              type="button"
              id="catch-core-tab"
              role="tab"
              aria-selected={formTab === "catch"}
              aria-controls="catch-core-panel"
              tabIndex={formTab === "catch" ? 0 : -1}
              disabled={saving}
              onClick={() => setFormTab("catch")}
            >
              {dict.catches.catchTab}
            </button>
            <button
              type="button"
              id="catch-details-tab"
              role="tab"
              aria-selected={formTab === "details"}
              aria-controls="catch-details-panel"
              tabIndex={formTab === "details" ? 0 : -1}
              disabled={saving}
              onClick={() => setFormTab("details")}
            >
              {dict.catches.detailsTab}
              <span>6</span>
            </button>
          </div>
          <fieldset className="catch-form-body" disabled={saving}>
            <legend className="sr-only">{dict.catches.formTitle}</legend>
            <div
              id="catch-core-panel"
              role="tabpanel"
              aria-labelledby="catch-core-tab"
              hidden={formTab !== "catch"}
              data-form-panel="catch"
              className="catch-fields"
            >
              <div>
                <p className="catch-field-label">
                  {dict.catches.photoLabel} <span>{dict.common.optional}</span>
                </p>
                <fieldset
                  className="catch-photo-dropzone"
                  aria-label={dict.catches.photoLabel}
                  data-dragging={dragging}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    if (!saving) setDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = saving ? "none" : "copy";
                  }}
                  onDragLeave={(event) => {
                    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget))
                      setDragging(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    acceptPhoto(event.dataTransfer.files[0]);
                  }}
                >
                  <button
                    type="button"
                    className="catch-photo-choose"
                    disabled={saving}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <ImagePlus aria-hidden="true" size={24} />
                    <span>
                      <strong>{photo ? dict.catches.photoChooseAnother : dict.catches.photoChoose}</strong>
                      <small>
                        {photo ? `${photo.name} · ${formatFileSize(photo.size, lang)}` : dict.catches.photoDropHint}
                      </small>
                    </span>
                  </button>
                  {photo && (
                    <div className="catch-photo-attached">
                      <PhotoThumbnail
                        photo={photo}
                        altText={dict.catches.photoPreviewAlt}
                        onView={() => setPhotoViewerOpen(true)}
                        className="catch-photo-miniature"
                      />
                      <button
                        type="button"
                        className="catch-photo-remove"
                        aria-label={dict.catches.photoRemove}
                        disabled={saving}
                        onClick={() => {
                          setPhoto(null);
                          setPhotoSaveError("");
                          setPhotoViewerOpen(false);
                        }}
                      >
                        <Trash2 aria-hidden="true" size={18} />
                      </button>
                    </div>
                  )}
                  <input
                    ref={photoInputRef}
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    disabled={saving}
                    tabIndex={-1}
                    aria-label={dict.catches.photoLabel}
                    onChange={(event) => {
                      acceptPhoto(event.currentTarget.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </fieldset>
                <p className="catch-photo-destination" title={dict.catches.photoStorageDestination}>
                  <LockKeyhole aria-hidden="true" size={12} />
                  {dict.catches.photoDestinationCompact}
                </p>
                <div
                  className="catch-photo-feedback"
                  role={photoSaveError ? "alert" : "status"}
                  data-error={Boolean(photoSaveError)}
                >
                  <span>
                    {photoSaveError ||
                      (saving && photo
                        ? dict.catches.photoSavingStatus
                        : photoSaved
                          ? dict.catches.photoSaveSuccess
                          : photo
                            ? dict.catches.photoReadyStatus
                            : dict.catches.photoHelp)}
                  </span>
                  {saving && photo && (
                    <div
                      className="catch-photo-progress"
                      role="progressbar"
                      aria-label={dict.catches.photoSavingStatus}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="catch-field-label" htmlFor="catchSpecies">
                  {dict.catches.speciesLabel} <span>{dict.common.optional}</span>
                </label>
                <input
                  ref={speciesRef}
                  id="catchSpecies"
                  name="species"
                  className="catch-control"
                  maxLength={80}
                  aria-describedby="catchSpeciesHelp"
                  placeholder={dict.catches.speciesPlaceholder}
                />
                <p id="catchSpeciesHelp" className="sr-only">
                  {dict.catches.speciesHelp}
                </p>
              </div>
              <div>
                <label className="catch-field-label" htmlFor="catchDateTrigger">
                  {dict.catches.dateLabel}
                </label>
                <CatchDatePicker value={date} onChange={setDate} lang={lang} disabled={saving} portal />
              </div>
              <fieldset className="catch-habitat">
                <legend className="catch-field-label">{dict.catches.habitatLegend}</legend>
                <div className="catch-habitat-grid">
                  {waterTypes.map((water, index) => (
                    <label key={water.value} className="catch-habitat-option">
                      <input type="radio" name="habitat" value={water.value} defaultChecked={index === 0} />
                      <span>
                        <strong>{water.label}</strong>
                        <small>{water.detail}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <div
              id="catch-details-panel"
              role="tabpanel"
              aria-labelledby="catch-details-tab"
              hidden={formTab !== "details"}
              data-form-panel="details"
              className="catch-fields"
            >
              <div>
                <label className="catch-field-label" htmlFor="catchLocation">
                  {dict.catches.locationLabel}
                </label>
                <input
                  id="catchLocation"
                  name="location"
                  className="catch-control"
                  maxLength={100}
                  placeholder={dict.catches.locationPlaceholder}
                />
                <p className="catch-field-help">{dict.catches.locationHelp}</p>
              </div>
              <div className="catch-field-row">
                <div>
                  <label className="catch-field-label" htmlFor="catchLength">
                    {dict.catches.lengthLabel}
                  </label>
                  <input
                    id="catchLength"
                    name="length"
                    className="catch-control"
                    type="number"
                    min={0}
                    max={1000}
                    step={0.1}
                  />
                </div>
                <div>
                  <label className="catch-field-label" htmlFor="catchWeight">
                    {dict.catches.weightLabel}
                  </label>
                  <input
                    id="catchWeight"
                    name="weight"
                    className="catch-control"
                    type="number"
                    min={0}
                    max={1000000}
                    step={1}
                  />
                </div>
              </div>
              <div className="catch-field-row">
                <div>
                  <label className="catch-field-label" htmlFor="catchBait">
                    {dict.catches.baitLabel}
                  </label>
                  <input
                    id="catchBait"
                    name="bait"
                    className="catch-control"
                    maxLength={100}
                    placeholder={dict.catches.baitPlaceholder}
                  />
                </div>
                <div>
                  <label className="catch-field-label" htmlFor="catchDisposition">
                    {dict.catches.dispositionLabel}
                  </label>
                  <DropdownSelect
                    id="catchDisposition"
                    name="disposition"
                    label={dict.catches.dispositionLabel}
                    value={disposition}
                    options={dispositionOptions}
                    onValueChange={setDisposition}
                    portal
                    disabled={saving}
                  />
                </div>
              </div>
              <div>
                <label className="catch-field-label" htmlFor="catchNotes">
                  {dict.catches.notesLabel}
                </label>
                <textarea
                  id="catchNotes"
                  name="notes"
                  className="catch-control"
                  rows={3}
                  maxLength={500}
                  placeholder={dict.catches.notesPlaceholder}
                />
              </div>
            </div>
          </fieldset>
          <footer className="catch-form-footer">
            <button type="submit" disabled={saving || !date}>
              <Save aria-hidden="true" size={18} />
              {saving ? dict.catches.submittingBtn : dict.catches.submitBtn}
            </button>
            <p>{dict.catches.storageNote}</p>
          </footer>
        </form>
      </div>
      <PhotoViewer photos={pendingPhotos} open={photoViewerOpen} onClose={() => setPhotoViewerOpen(false)} />
    </main>
  );
}
