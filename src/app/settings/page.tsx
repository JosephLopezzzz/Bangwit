"use client";

import { ArrowRight, ArrowUpRight, Check, Languages } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { getFisherTypeLabel, getPreferredWaterLabel } from "@/i18n/labels";
import { clearCatches, exportCatchBackup, restoreCatchBackup } from "@/lib/storage/catches";

export default function SettingsPage() {
  const { profile, openProfile, startTour, showMessage, lang, setLang, dict } = useBangwit();
  const [busy, setBusy] = useState(false);
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
    if (!window.confirm(dict.settings.eraseConfirm)) return;
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
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : lang === "fil"
            ? "Hindi nabura ang local data."
            : "Failed to erase local data.",
      );
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.settings.tag}</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{dict.settings.title}</h1>
      <p className="mt-2 text-lg text-muted">{dict.settings.subtitle}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Language Selection Card */}
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{dict.settings.languageTag}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">{dict.settings.languageTitle}</h2>
          <p className="mt-1 text-sm text-muted">{dict.settings.languageDesc}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setLang("fil")}
              className={`flex min-h-12 items-center gap-2 rounded-2xl border px-5 text-sm font-bold transition-all ${
                lang === "fil"
                  ? "border-teal bg-teal-soft text-teal-dark ring-2 ring-teal/20"
                  : "border-line bg-white text-ink hover:bg-paper"
              }`}
            >
              <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>Filipino (Taglish)</span>
              {lang === "fil" && <Check aria-hidden="true" className="ml-1 h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex min-h-12 items-center gap-2 rounded-2xl border px-5 text-sm font-bold transition-all ${
                lang === "en"
                  ? "border-teal bg-teal-soft text-teal-dark ring-2 ring-teal/20"
                  : "border-line bg-white text-ink hover:bg-paper"
              }`}
            >
              <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>English</span>
              {lang === "en" && <Check aria-hidden="true" className="ml-1 h-4 w-4" />}
            </button>
          </div>
        </section>

        {/* Profile Preferences */}
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{dict.settings.profileTag}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">
            {profile ? getFisherTypeLabel(profile.type, lang) : dict.settings.profileUnset}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {profile ? getPreferredWaterLabel(profile.water, lang) : getPreferredWaterLabel(undefined, lang)}
          </p>
          <button
            type="button"
            onClick={() => openProfile("edit")}
            className="mt-5 min-h-11 rounded-xl border border-teal px-4 font-bold text-teal hover:bg-teal-soft"
          >
            {dict.settings.editProfileBtn}
          </button>
        </section>

        {/* In-app guide */}
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{dict.settings.helpTag}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">{dict.settings.helpTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{dict.settings.helpDesc}</p>
          <button
            type="button"
            onClick={startTour}
            className="mt-5 min-h-11 rounded-xl border border-teal px-4 font-bold text-teal hover:bg-teal-soft"
          >
            {dict.settings.restartTourBtn}
          </button>
        </section>

        {/* Local backup */}
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{dict.settings.backupTag}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">{dict.settings.backupTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{dict.settings.backupDesc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void downloadBackup()}
              className="min-h-11 rounded-xl bg-teal px-4 font-bold text-white hover:bg-teal-dark disabled:opacity-50"
            >
              {dict.settings.downloadBackupBtn}
            </button>
            <label
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-line px-4 font-bold text-ink hover:bg-paper ${
                busy ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {dict.settings.restoreBackupBtn}
              <input
                key={importKey}
                type="file"
                accept="application/json,.json"
                disabled={busy}
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
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{dict.settings.privacyTag}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">{dict.settings.privacyTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{dict.settings.privacyDesc}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void eraseLocalData()}
            className="mt-4 min-h-11 rounded-xl border border-rose-200 px-4 font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-50"
          >
            {dict.settings.eraseBtn}
          </button>
        </section>

        {/* Policies */}
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:col-span-2 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{dict.settings.policiesTag}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">{dict.settings.policiesTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{dict.settings.policiesDesc}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link className="inline-flex items-center gap-1 font-bold text-teal hover:text-teal-dark" href="/terms">
              {dict.settings.termsLink}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link className="inline-flex items-center gap-1 font-bold text-teal hover:text-teal-dark" href="/privacy">
              {dict.settings.privacyLink}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
