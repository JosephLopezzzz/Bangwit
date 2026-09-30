"use client";

import Link from "next/link";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { clearCatches, exportCatchBackup, restoreCatchBackup } from "@/lib/storage/catches";

const profileLabels: Record<string, string> = {
  exploring: "Nag-e-explore pa lang",
  angler: "Recreational angler",
  livelihood: "Mangingisdang pangkabuhayan",
  both: "Angler at livelihood fisher",
};
const waterLabels: Record<string, string> = {
  any: "Wala pang preference",
  saltwater: "Dagat o baybayin",
  freshwater: "Ilog o lawa",
  brackish: "Brackish o estuary",
};

export default function SettingsPage() {
  const { profile, openProfile, startTour, showMessage } = useBangwit();
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
      showMessage("Nagawa ang backup file sa device mo. Ingatan ito dahil kasama ang photos at optional na lugar.");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Hindi nagawa ang backup.");
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
        `${restored} catch ${restored === 1 ? "tala" : "tala"} ang na-restore. Nasa device lang ang mga ito.`,
      );
      setImportKey((value) => value + 1);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Hindi na-restore ang backup.");
      setImportKey((value) => value + 1);
    } finally {
      setBusy(false);
    }
  }

  async function eraseLocalData() {
    if (
      !window.confirm(
        "Burahin ang lahat ng Bangwit catch logs, preferences, at policy acknowledgment sa browser na ito? Hindi ito maibabalik maliban kung may backup ka.",
      )
    )
      return;
    setBusy(true);
    try {
      await clearCatches();
      for (const key of [
        "bangwit.policy.2026-09-prototype",
        "bangwit.profile",
        "bangwit.onboarding.seen",
        "bangwit.tour.done",
      ]) {
        localStorage.removeItem(key);
      }
      window.location.assign("/");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Hindi nabura ang local data.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Account & privacy</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Settings</h1>
      <p className="mt-2 text-lg text-muted">Pamahalaan ang preferences, gabay, at data sa device mo.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Profile preferences</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">
            {profile ? profileLabels[profile.type] : "Preferences not set"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {profile ? waterLabels[profile.water] : "Puwede mong itakda ang uri ng pangingisda at tubig na gusto mo."}
          </p>
          <button
            type="button"
            onClick={() => openProfile("edit")}
            className="mt-5 min-h-11 rounded-xl border border-teal px-4 font-bold text-teal hover:bg-teal-soft"
          >
            I-edit preferences
          </button>
        </section>

        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Help</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">Balikan ang in-app guide</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Iha-highlight ng guide ang pagpili ng lugar, species status, offline catch log, at collection.
          </p>
          <button
            type="button"
            onClick={startTour}
            className="mt-5 min-h-11 rounded-xl border border-teal px-4 font-bold text-teal hover:bg-teal-soft"
          >
            Ulitin ang guide
          </button>
        </section>

        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Local backup</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">I-save o ibalik ang catch log</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Nasa browser address lang nakakabit ang local data. Gumawa ng backup bago lumipat ng address o browser.
            Kasama sa file ang photos at lahat ng fields.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void downloadBackup()}
              className="min-h-11 rounded-xl bg-teal px-4 font-bold text-white hover:bg-teal-dark disabled:opacity-50"
            >
              I-download ang backup
            </button>
            <label
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-line px-4 font-bold text-ink hover:bg-paper ${busy ? "pointer-events-none opacity-50" : ""}`}
            >
              I-restore ang backup
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
          <p className="mt-3 text-xs leading-5 text-muted">
            Ang restore ay papayag lang sa empty journal. Hindi nito papalitan o paghahaluin ang kasalukuyang records.
            Ingatan ang backup file dahil may pribadong impormasyon ito.
          </p>
          <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
            Galing ba sa lumang Bangwit prototype ang entries mo? I-export muna sa old address na may local records:{" "}
            <a
              href="http://127.0.0.1:4173/migration.html"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-teal hover:text-teal-dark"
            >
              Buksan ang prototype backup page →
            </a>
          </p>
        </section>

        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Privacy controls</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">Local prototype data</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Catch logs at optional na larawan ay naka-save sa browser storage ng device na ito. Walang account o cloud
            sync. Walang kinukuhang GPS.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void eraseLocalData()}
            className="mt-4 min-h-11 rounded-xl border border-rose-200 px-4 font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-50"
          >
            Burahin ang Bangwit data sa device
          </button>
        </section>

        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:col-span-2 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Terms & privacy</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">Basahin ang mga policy</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Prototype draft ang mga notice na ito. Ipa-review muna ang final text bago ilunsad sa publiko o magdagdag ng
            account, analytics, at cloud sync.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link className="font-bold text-teal hover:text-teal-dark" href="/terms">
              Terms of Use →
            </Link>
            <Link className="font-bold text-teal hover:text-teal-dark" href="/privacy">
              Privacy Notice →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
