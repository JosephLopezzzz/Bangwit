"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Database,
  FileText,
  Languages,
  LoaderCircle,
  LockKeyhole,
  Trash2,
  UserRound,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { getFisherTypeLabel, getPreferredWaterLabel } from "@/i18n/labels";
import { PUBLIC_ADVISORY_CACHE_KEY } from "@/lib/map-advisories";
import { clearCatches, exportCatchBackup, restoreCatchBackup } from "@/lib/storage/catches";
import "./settings.css";

export default function SettingsPage() {
  const { profile, openProfile, startTour, showMessage, lang, setLang, dict } = useBangwit();
  const [busy, setBusy] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [eraseOpen, setEraseOpen] = useState(false);
  const [eraseComplete, setEraseComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [importKey, setImportKey] = useState(0);
  const backupDialogRef = useRef<HTMLDialogElement>(null);
  const restoreDialogRef = useRef<HTMLDialogElement>(null);
  const eraseDialogRef = useRef<HTMLDialogElement>(null);
  const copy =
    lang === "fil"
      ? {
          privacyMore: "Tungkol sa privacy at local storage",
          privacyLink: "Basahin ang privacy notice",
          backupTitle: "Gumawa ng backup?",
          backupText: "Magda-download ng file na may catch details, optional na spot label, at photos. Ingatan ito dahil pribado ang laman.",
          backupCancel: "Huwag muna",
          backupConfirm: "I-download ang backup",
          restoreTitle: "I-restore ang backup?",
          restoreText:
            "Kasama sa file ang pribadong records, photos, at optional na spot label. Sa empty journal lang puwedeng mag-restore; hindi nito ihahalo o papalitan ang laman.",
          restoreCancel: "Huwag muna",
          restoreConfirm: "I-restore ang file",
          backupSuccess: "Nagawa ang backup file sa device mo. Ingatan ito dahil may pribadong catch details at photos.",
          restoreSuccess: (count: number) => `${count} ${count === 1 ? "catch record" : "catch records"} ang na-restore sa device na ito.`,
          dangerHeading: "Danger zone",
          eraseTitle: "Burahin ang lahat ng Bangwit data?",
          eraseText:
            "Permanenteng mabubura ang catch logs, photos, preferences, at policy acknowledgment na naka-save ng Bangwit sa browser na ito. Hindi na ito maibabalik.",
          eraseCancel: "Panatilihin ang data",
          eraseConfirm: "Burahin ang data",
          eraseSuccess: "Nabura ang local Bangwit data. Babalik sa simula…",
          close: "Isara",
          saving: "Sandali…",
        }
      : {
          privacyMore: "About privacy and local storage",
          privacyLink: "Read the Privacy Notice",
          backupTitle: "Create a backup?",
          backupText: "This downloads a file with catch details, optional spot labels, and photos. Keep it safe because it contains private information.",
          backupCancel: "Cancel",
          backupConfirm: "Download backup",
          restoreTitle: "Restore this backup?",
          restoreText:
            "The file includes private records, photos, and optional spot labels. Restore works only when this journal is empty; it will not merge with or replace existing records.",
          restoreCancel: "Cancel",
          restoreConfirm: "Restore backup",
          backupSuccess: "Backup file downloaded to this device. Keep it safe; it contains private catch details and photos.",
          restoreSuccess: (count: number) => `${count} ${count === 1 ? "catch record" : "catch records"} restored on this device.`,
          dangerHeading: "Danger zone",
          eraseTitle: "Erase all Bangwit data?",
          eraseText:
            "This permanently removes catch logs, photos, preferences, and policy acknowledgments stored by Bangwit in this browser. It cannot be undone.",
          eraseCancel: "Keep my data",
          eraseConfirm: "Erase data",
          eraseSuccess: "Local Bangwit data erased. Returning to the start…",
          close: "Close",
          saving: "Working…",
        };

  useEffect(() => {
    const dialog = backupDialogRef.current;
    if (!dialog) return;
    if (backupOpen && !dialog.open) dialog.showModal();
    else if (!backupOpen && dialog.open) dialog.close();
  }, [backupOpen]);

  useEffect(() => {
    const dialog = restoreDialogRef.current;
    if (!dialog) return;
    if (restoreFile && !dialog.open) dialog.showModal();
    else if (!restoreFile && dialog.open) dialog.close();
  }, [restoreFile]);

  useEffect(() => {
    const dialog = eraseDialogRef.current;
    if (!dialog) return;
    if (eraseOpen && !dialog.open) dialog.showModal();
    else if (!eraseOpen && dialog.open) dialog.close();
  }, [eraseOpen]);

  async function downloadBackup() {
    setBusy(true);
    setFeedback("");
    try {
      const content = await exportCatchBackup();
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `bangwit-catches-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setFeedback(copy.backupSuccess);
      showMessage(copy.backupSuccess);
      setBackupOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi nagawa ang backup."
            : "Failed to create backup.";
      setFeedback(message);
      showMessage(message);
    } finally {
      setBusy(false);
    }
  }

  async function importBackup() {
    if (!restoreFile || busy) return;
    setBusy(true);
    setFeedback("");
    try {
      const restored = await restoreCatchBackup(restoreFile);
      const message = copy.restoreSuccess(restored);
      setFeedback(message);
      showMessage(message);
      setRestoreFile(null);
      setImportKey((value) => value + 1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi na-restore ang backup."
            : "Failed to restore backup.";
      setFeedback(message);
      showMessage(message);
      setRestoreFile(null);
      setImportKey((value) => value + 1);
    } finally {
      setBusy(false);
    }
  }

  async function eraseLocalData() {
    if (busy) return;
    setBusy(true);
    setFeedback("");
    try {
      await clearCatches();
      for (const key of [
        "bangwit.policy.2026-09-prototype",
        "bangwit.profile",
        "bangwit.onboarding.seen",
        "bangwit.tour.done",
        "bangwit.theme",
        "bangwit.lang",
        PUBLIC_ADVISORY_CACHE_KEY,
      ]) {
        localStorage.removeItem(key);
      }
      setEraseComplete(true);
      setFeedback(copy.eraseSuccess);
      showMessage(copy.eraseSuccess);
      window.setTimeout(() => window.location.assign("/"), 1400);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi nabura ang local data."
            : "Failed to erase local data.";
      setFeedback(message);
      showMessage(message);
      setBusy(false);
    }
  }

  return (
    <main className="ui-page settings-page">
      <header className="ui-page-header">
        <h1 className="ui-page-title">{dict.settings.title}</h1>
        <p>{dict.settings.subtitle}</p>
      </header>

      {feedback && <p className="settings-feedback" role="status">{feedback}</p>}

      <div className="settings-grid">
        <section className="settings-card settings-card--language">
          <div className="settings-card-heading">
            <span className="settings-card-icon"><Languages aria-hidden="true" size={18} /></span>
            <div>
              <h2>{dict.settings.languageTitle}</h2>
              <p>{lang === "fil" ? "Palitan ang wika anumang oras." : "Change the app language anytime."}</p>
            </div>
          </div>
          <div className="settings-language-options">
            {(["fil", "en"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                aria-pressed={lang === value}
                disabled={busy || eraseComplete}
                className={`settings-language-button ${lang === value ? "is-selected" : ""}`}
              >
                <span>{value === "fil" ? "Filipino (Taglish)" : "English"}</span>
                {lang === value && <Check aria-hidden="true" size={15} />}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-card-icon"><UserRound aria-hidden="true" size={18} /></span>
            <div>
              <h2>{dict.settings.profileTag}</h2>
              <p>{profile ? getFisherTypeLabel(profile.type, lang) : dict.settings.profileUnset}</p>
            </div>
          </div>
          <div className="settings-card-row">
            <span>{profile ? getPreferredWaterLabel(profile.water, lang) : getPreferredWaterLabel(undefined, lang)}</span>
            <button type="button" className="ui-button ui-button--secondary" onClick={() => openProfile("edit")} disabled={busy || eraseComplete}>
              {dict.settings.editProfileBtn}
            </button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-card-icon"><BookOpen aria-hidden="true" size={18} /></span>
            <div>
              <h2>{dict.settings.helpTitle}</h2>
              <p>{lang === "fil" ? "Ulitin ang gabay sa paggamit ng app." : "Replay the short in-app guide."}</p>
            </div>
          </div>
          <button type="button" className="ui-button ui-button--secondary" onClick={startTour} disabled={busy || eraseComplete}>
            {dict.settings.restartTourBtn}
          </button>
        </section>

        <section className="settings-card settings-card--backup" aria-busy={busy}>
          <div className="settings-card-heading">
            <span className="settings-card-icon"><Database aria-hidden="true" size={18} /></span>
            <div>
              <h2>{dict.settings.backupTitle}</h2>
              <p>{lang === "fil" ? "Gumawa ng kopya o magbalik ng local catch log." : "Save a copy or restore your local catch log."}</p>
            </div>
          </div>
          <div className="settings-card-actions">
          <button
            type="button"
            disabled={busy || eraseComplete}
            onClick={() => {
              setFeedback("");
              setBackupOpen(true);
            }}
            className="ui-button"
          >
              {busy ? <LoaderCircle className="settings-spinner" aria-hidden="true" size={15} /> : <Database aria-hidden="true" size={15} />}
              {dict.settings.downloadBackupBtn}
            </button>
            <label className={`ui-button ui-button--secondary settings-file-button ${busy || eraseComplete ? "is-disabled" : ""}`}>
              {busy ? <LoaderCircle className="settings-spinner" aria-hidden="true" size={15} /> : <Upload aria-hidden="true" size={15} />}
              {dict.settings.restoreBackupBtn}
              <input
                key={importKey}
                type="file"
                accept="application/json,.json"
                disabled={busy || eraseComplete}
                onChange={(event) => {
                  setFeedback("");
                  setRestoreFile(event.currentTarget.files?.[0] ?? null);
                  event.currentTarget.value = "";
                }}
                className="sr-only"
              />
            </label>
            <a
              href="http://127.0.0.1:4173/migration.html"
              target="_blank"
              rel="noreferrer"
              className="settings-prototype-link"
            >
              {dict.settings.prototypeBackupLink}
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
          <details className="settings-privacy-details">
            <summary>{copy.privacyMore}</summary>
            <p>{dict.settings.backupDesc} {dict.settings.backupNote}</p>
          </details>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-card-icon"><LockKeyhole aria-hidden="true" size={18} /></span>
            <div>
              <h2>{dict.settings.privacyTitle}</h2>
              <p>{dict.settings.privacyDesc}</p>
            </div>
          </div>
          <Link className="settings-inline-link" href="/privacy">
            {copy.privacyLink}
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </section>

        <section className="settings-card settings-card--policies">
          <div className="settings-card-heading">
            <span className="settings-card-icon"><FileText aria-hidden="true" size={18} /></span>
            <div>
              <h2>{dict.settings.policiesTitle}</h2>
              <p>{dict.settings.policiesDesc}</p>
            </div>
          </div>
          <Link className="settings-inline-link" href="/policies">
            {dict.settings.policiesLink}
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </section>
      </div>

      <section className="settings-danger-zone" aria-labelledby="settings-danger-heading">
        <header>
          <Trash2 aria-hidden="true" size={17} />
          <h2 id="settings-danger-heading">{copy.dangerHeading}</h2>
        </header>
        <div className="settings-danger-card">
          <div>
            <h3>{lang === "fil" ? "Burahin ang local data" : "Erase local data"}</h3>
            <p>{lang === "fil" ? "Permanenteng alisin ang Bangwit data na naka-save sa browser na ito." : "Permanently remove Bangwit data saved in this browser."}</p>
          </div>
          <button
            type="button"
            className="settings-danger-button"
            onClick={() => {
              setFeedback("");
              setEraseOpen(true);
            }}
            disabled={busy || eraseComplete}
          >
            <Trash2 aria-hidden="true" size={15} />
            {dict.settings.eraseBtn}
          </button>
        </div>
      </section>

      <dialog
        ref={backupDialogRef}
        className="settings-confirm-dialog"
        aria-labelledby="settings-backup-title"
        aria-describedby="settings-backup-description"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        onClose={() => setBackupOpen(false)}
      >
        <div className="settings-dialog-content">
          <header>
            <span className="settings-dialog-icon"><Database aria-hidden="true" size={19} /></span>
            <button type="button" aria-label={copy.close} onClick={() => setBackupOpen(false)} disabled={busy}>
              <X aria-hidden="true" size={18} />
            </button>
          </header>
          <h2 id="settings-backup-title">{copy.backupTitle}</h2>
          <p id="settings-backup-description">{copy.backupText}</p>
          {feedback && <p className="settings-dialog-feedback" role="alert">{feedback}</p>}
          <div className="settings-dialog-actions">
            <button type="button" className="ui-button ui-button--secondary" onClick={() => setBackupOpen(false)} disabled={busy}>
              {copy.backupCancel}
            </button>
            <button type="button" className="ui-button" onClick={() => void downloadBackup()} disabled={busy}>
              {busy && <LoaderCircle className="settings-spinner" aria-hidden="true" size={15} />}
              {busy ? copy.saving : copy.backupConfirm}
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={restoreDialogRef}
        className="settings-confirm-dialog"
        aria-labelledby="settings-restore-title"
        aria-describedby="settings-restore-description"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        onClose={() => setRestoreFile(null)}
      >
        <div className="settings-dialog-content">
          <header>
            <span className="settings-dialog-icon"><Database aria-hidden="true" size={19} /></span>
            <button type="button" aria-label={copy.close} onClick={() => setRestoreFile(null)} disabled={busy}>
              <X aria-hidden="true" size={18} />
            </button>
          </header>
          <h2 id="settings-restore-title">{copy.restoreTitle}</h2>
          <p id="settings-restore-description">{copy.restoreText}</p>
          {restoreFile && <p className="settings-dialog-filename">{restoreFile.name}</p>}
          {feedback && <p className="settings-dialog-feedback" role="alert">{feedback}</p>}
          <div className="settings-dialog-actions">
            <button type="button" className="ui-button ui-button--secondary" onClick={() => setRestoreFile(null)} disabled={busy}>
              {copy.restoreCancel}
            </button>
            <button type="button" className="ui-button" onClick={() => void importBackup()} disabled={busy || !restoreFile}>
              {busy && <LoaderCircle className="settings-spinner" aria-hidden="true" size={15} />}
              {busy ? copy.saving : copy.restoreConfirm}
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={eraseDialogRef}
        className="settings-confirm-dialog settings-confirm-dialog--danger"
        aria-labelledby="settings-erase-title"
        aria-describedby="settings-erase-description"
        onCancel={(event) => {
          if (busy || eraseComplete) event.preventDefault();
        }}
        onClose={() => {
          if (!eraseComplete) setEraseOpen(false);
        }}
      >
        <div className="settings-dialog-content">
          <header>
            <span className="settings-dialog-icon"><Trash2 aria-hidden="true" size={19} /></span>
            {!eraseComplete && (
              <button type="button" aria-label={copy.close} onClick={() => setEraseOpen(false)} disabled={busy}>
                <X aria-hidden="true" size={18} />
              </button>
            )}
          </header>
          <h2 id="settings-erase-title">{eraseComplete ? dict.settings.eraseDone : copy.eraseTitle}</h2>
          <p id="settings-erase-description">{eraseComplete ? copy.eraseSuccess : copy.eraseText}</p>
          {feedback && !eraseComplete && <p className="settings-dialog-feedback" role="alert">{feedback}</p>}
          {!eraseComplete && (
            <div className="settings-dialog-actions">
              <button type="button" className="ui-button ui-button--secondary" onClick={() => setEraseOpen(false)} disabled={busy}>
                {copy.eraseCancel}
              </button>
              <button type="button" className="settings-danger-button" onClick={() => void eraseLocalData()} disabled={busy}>
                {busy ? <LoaderCircle className="settings-spinner" aria-hidden="true" size={15} /> : <Trash2 aria-hidden="true" size={15} />}
                {busy ? copy.saving : copy.eraseConfirm}
              </button>
            </div>
          )}
        </div>
      </dialog>
    </main>
  );
}
