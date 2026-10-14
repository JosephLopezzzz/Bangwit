"use client";

import { ArrowRight, ArrowUpRight, Check, Languages } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { FuseButton } from "@/components/fuse-button";
import { getFisherTypeLabel, getPreferredWaterLabel } from "@/i18n/labels";
import { clearCatches, exportCatchBackup, restoreCatchBackup } from "@/lib/storage/catches";

export default function SettingsPage() {
  const { profile, openProfile, startTour, showMessage, lang, setLang, dict } = useBangwit();
  const [busy, setBusy] = useState(false);
  const [erasePending, setErasePending] = useState(false);
  const [importKey, setImportKey] = useState(0);

  async function downloadBackup() {
    setBusy(true);
    try {
      const content = await exportCatchBackup();
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `bangwit-catches-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showMessage(
        lang === "fil"
          ? "Nagawa ang backup file sa device mo. Ingatan ito dahil kasama ang photos at optional na lugar."
          : "Backup file created on your device. Keep it safe as it includes photos and optional spot labels.",
      );
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi nagawa ang backup."
            : "Failed to create backup.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function importBackup(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const restored = await restoreCatchBackup(file);
      showMessage(
        lang === "fil"
          ? `${restored} catch tala ang na-restore. Nasa device lang ang mga ito.`
          : `${restored} catch ${restored === 1 ? "record" : "records"} restored on this device.`,
      );
      setImportKey((value) => value + 1);
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi na-restore ang backup."
            : "Failed to restore backup.",
      );
      setImportKey((value) => value + 1);
    } finally {
      setBusy(false);
    }
  }

  async function eraseLocalData() {
    if (busy) return false;
    setBusy(true);
    try {
      await clearCatches();
      for (const key of [
        "bangwit.policy.2026-09-prototype",
        "bangwit.profile",
        "bangwit.onboarding.seen",
        "bangwit.tour.done",
        "bangwit.theme",
        "bangwit.lang",
      ]) {
        localStorage.removeItem(key);
      }
      window.location.assign("/");
      return true;
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi nabura ang local data."
            : "Failed to erase local data.",
      );
      setBusy(false);
      return false;
    }
  }

  return (
    <main className="ui-page">
      <header className="ui-page-header">
        <h1 className="ui-page-title">{dict.settings.title}</h1>
        <p className="text-muted">{dict.settings.subtitle}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Language Selection Card */}
        <section className="ui-card lg:col-span-2">
          <h2 className="ui-section-title">{dict.settings.languageTitle}</h2>
          <p className="mt-1 text-sm text-muted">{dict.settings.languageDesc}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setLang("fil")}
              aria-pressed={lang === "fil"}
              disabled={busy || erasePending}
              className={`ui-button ui-button--secondary ${lang === "fil" ? "is-selected" : ""}`}
            >
              <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>Filipino (Taglish)</span>
              {lang === "fil" && <Check aria-hidden="true" className="ml-1 h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              disabled={busy || erasePending}
              className={`ui-button ui-button--secondary ${lang === "en" ? "is-selected" : ""}`}
            >
              <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>English</span>
              {lang === "en" && <Check aria-hidden="true" className="ml-1 h-4 w-4" />}
            </button>
          </div>
        </section>

        {/* Profile Preferences */}
        <section className="ui-card">
          <h2 className="ui-section-title">{dict.settings.profileTag}</h2>
          <p className="mt-2 font-semibold text-ink">
            {profile ? getFisherTypeLabel(profile.type, lang) : dict.settings.profileUnset}
          </p>
          <p className="mt-1 text-sm text-muted">
            {profile ? getPreferredWaterLabel(profile.water, lang) : getPreferredWaterLabel(undefined, lang)}
          </p>
          <button
            type="button"
            onClick={() => openProfile("edit")}
            disabled={busy || erasePending}
            className="ui-button ui-button--secondary mt-4"
          >
            {dict.settings.editProfileBtn}
          </button>
        </section>

        {/* In-app guide */}
        <section className="ui-card">
          <h2 className="ui-section-title">{dict.settings.helpTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{dict.settings.helpDesc}</p>
          <button
            type="button"
            onClick={startTour}
            disabled={busy || erasePending}
            className="ui-button ui-button--secondary mt-4"
          >
            {dict.settings.restartTourBtn}
          </button>
        </section>

        {/* Local backup */}
        <section className="ui-card" aria-busy={busy}>
          <h2 className="ui-section-title">{dict.settings.backupTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{dict.settings.backupDesc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || erasePending}
              onClick={() => void downloadBackup()}
              className="ui-button"
            >
              {dict.settings.downloadBackupBtn}
            </button>
            <label
              className={`ui-button ui-button--secondary focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-teal ${
                busy || erasePending ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {dict.settings.restoreBackupBtn}
              <input
                key={importKey}
                type="file"
                accept="application/json,.json"
                disabled={busy || erasePending}
                onChange={(event) => void importBackup(event.target.files?.[0])}
                className="sr-only"
              />
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">{dict.settings.backupNote}</p>
          <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
            {dict.settings.prototypeBackupNote}{" "}
            <a
              href="http://127.0.0.1:4173/migration.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-teal hover:text-teal-dark"
            >
              {dict.settings.prototypeBackupLink}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </p>
        </section>

        {/* Privacy controls */}
        <section className="ui-card">
          <h2 className="ui-section-title">{dict.settings.privacyTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{dict.settings.privacyDesc}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{dict.settings.eraseConfirm}</p>
          <div className="mt-4">
            <FuseButton
              className="fuse-button-settings"
              disabled={busy}
              label={dict.settings.eraseBtn}
              undoLabel={dict.catches.deleteUndo}
              doneLabel={dict.settings.eraseDone}
              committingLabel={dict.settings.erasingLabel}
              pendingLabel={dict.settings.erasePending}
              canceledLabel={dict.settings.eraseCanceled}
              failedLabel={dict.settings.eraseFailed}
              ariaLabel={dict.settings.eraseBtn}
              hint={dict.settings.eraseHint}
              onPendingChange={setErasePending}
              onCommit={eraseLocalData}
            />
          </div>
        </section>

        {/* Policies */}
        <section className="ui-card lg:col-span-2">
          <h2 className="ui-section-title">{dict.settings.policiesTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{dict.settings.policiesDesc}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link className="inline-flex items-center gap-1 font-bold text-teal hover:text-teal-dark" href="/policies">
              {dict.settings.policiesLink}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
