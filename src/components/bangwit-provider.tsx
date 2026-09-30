"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FisherProfile } from "@/types/catch";

const POLICY_KEY = "bangwit.policy.2026-09-prototype";
const POLICY_VERSION = "prototype-2";
const PROFILE_KEY = "bangwit.profile";
const ONBOARDING_KEY = "bangwit.onboarding.seen";
const TOUR_KEY = "bangwit.tour.done";
const AREAS = ["Manila Bay", "Bacoor Bay", "Cañacao Bay"];
const TOUR_STEPS = [
  {
    path: "/",
    target: "#areaPicker",
    title: "Pumili muna ng lugar",
    text: "Pumili ng Cavite fishing ground. Ipapakita ng Bangwit ang verified na records kapag handa na ang lokal na data.",
  },
  {
    path: "/species",
    target: "#speciesNotice",
    title: "Basahin ang status at coverage",
    text: "Paghiwalayin ang naitalang species, legal na rules, at personal mong huli. Kapag kulang ang datos, malinaw itong sasabihin.",
  },
  {
    path: "/catches",
    target: "#catchForm",
    title: "I-log ang huli mo",
    text: "Kapag bukas na ang journal, mase-save ang tala sa device kahit offline. Wala pang cloud sync at hindi kinukuha ang GPS.",
  },
  {
    path: "/my-species",
    target: "#collectionNotice",
    title: "Buuin ang My Species",
    text: "Ang identified species sa personal mong catch log ang magbubukas ng collection card.",
  },
];

type ProfileMode = "first" | "edit";
type BangwitContextValue = {
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  profile: FisherProfile | null;
  openProfile: (mode: ProfileMode) => void;
  showMessage: (message: string) => void;
  startTour: () => void;
};

const BangwitContext = createContext<BangwitContextValue | null>(null);

export function useBangwit() {
  const context = useContext(BangwitContext);
  if (!context) throw new Error("useBangwit must be used inside BangwitProvider.");
  return context;
}

function readProfile(): FisherProfile | null {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") as Partial<FisherProfile> | null;
    if (
      value &&
      ["exploring", "angler", "livelihood", "both"].includes(value.type ?? "") &&
      ["any", "saltwater", "freshwater", "brackish"].includes(value.water ?? "")
    ) {
      return value as FisherProfile;
    }
  } catch {
    /* Keep first use available when preferences are missing or unreadable. */
  }
  return null;
}

function hasCurrentPolicyAcceptance(): boolean {
  try {
    const acknowledgment = JSON.parse(localStorage.getItem(POLICY_KEY) || "null") as { version?: string } | null;
    return acknowledgment?.version === POLICY_VERSION;
  } catch {
    return false;
  }
}

export function BangwitProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPolicyPage = pathname === "/terms" || pathname === "/privacy";
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [profile, setProfile] = useState<FisherProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<ProfileMode>("first");
  const [fisherType, setFisherType] = useState<FisherProfile["type"]>("exploring");
  const [preferredWater, setPreferredWater] = useState<FisherProfile["water"]>("any");
  const [selectedArea, setSelectedAreaState] = useState(AREAS[0]);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let didAccept = false;
    try {
      didAccept = hasCurrentPolicyAcceptance();
      setProfile(readProfile());
    } catch {
      setMessage("Hindi mabasa ang browser preferences. Local storage may be unavailable.");
    }
    setAccepted(didAccept);
    setReady(true);
    if (didAccept) {
      try {
        if (!localStorage.getItem(ONBOARDING_KEY)) setProfileOpen(true);
        else if (!localStorage.getItem(TOUR_KEY)) setTourStep(0);
      } catch {
        /* The user can still open the guide manually. */
      }
    }
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3800);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!ready || (accepted ? !profileOpen : isPolicyPage)) return;
    const dialog = document.querySelector<HTMLElement>("[data-bangwit-dialog]");
    if (!dialog) return;
    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
    dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    function keepFocusInside(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!dialog?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", keepFocusInside);
    return () => document.removeEventListener("keydown", keepFocusInside);
  }, [accepted, isPolicyPage, profileOpen, ready]);

  useEffect(() => {
    if (tourStep === null) return;
    const step = TOUR_STEPS[tourStep];
    if (pathname !== step.path) {
      router.push(step.path);
      return;
    }
    const target = document.querySelector<HTMLElement>(step.target);
    if (!target) return;
    target.classList.add("tour-spotlight");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    return () => target.classList.remove("tour-spotlight");
  }, [pathname, router, tourStep]);

  const setSelectedArea = useCallback((area: string) => {
    if (AREAS.includes(area)) setSelectedAreaState(area);
  }, []);

  const openProfile = useCallback(
    (mode: ProfileMode) => {
      setProfileMode(mode);
      setFisherType(profile?.type ?? "exploring");
      setPreferredWater(profile?.water ?? "any");
      setProfileOpen(true);
    },
    [profile],
  );

  const startTour = useCallback(() => setTourStep(0), []);

  const contextValue = useMemo(
    () => ({ selectedArea, setSelectedArea, profile, openProfile, showMessage: setMessage, startTour }),
    [selectedArea, setSelectedArea, profile, openProfile, startTour],
  );

  function acceptPolicies() {
    if (!policyChecked) return;
    try {
      localStorage.setItem(
        POLICY_KEY,
        JSON.stringify({ acceptedAt: new Date().toISOString(), version: POLICY_VERSION }),
      );
      setAccepted(true);
      setProfileOpen(true);
    } catch {
      setMessage("Hindi ma-save ang pag-acknowledge. Tingnan ang browser storage settings at subukan ulit.");
    }
  }

  function finishProfile(save: boolean) {
    if (save) {
      const next = { type: fisherType, water: preferredWater } satisfies FisherProfile;
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
        setProfile(next);
      } catch {
        setMessage("Hindi na-save ang preferences; maaari mo pa ring gamitin ang app.");
      }
    }
    try {
      if (profileMode === "first") localStorage.setItem(ONBOARDING_KEY, "yes");
      setProfileOpen(false);
      if (profileMode === "first" && !localStorage.getItem(TOUR_KEY)) setTourStep(0);
    } catch {
      setProfileOpen(false);
    }
  }

  function closeTour(markDone: boolean) {
    setTourStep(null);
    if (markDone) {
      try {
        localStorage.setItem(TOUR_KEY, "yes");
      } catch {
        /* The tour remains available from Help. */
      }
    }
  }

  function advanceTour(direction: -1 | 1) {
    if (tourStep === null) return;
    const next = tourStep + direction;
    if (next < 0) return;
    if (next >= TOUR_STEPS.length) closeTour(true);
    else setTourStep(next);
  }

  return (
    <BangwitContext.Provider value={contextValue}>
      {children}
      {ready && !accepted && !isPolicyPage && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm">
          <section
            data-bangwit-dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="policyTitle"
            className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Prototype access</p>
            <h1 id="policyTitle" className="mt-2 text-3xl font-extrabold text-ink">
              Bago ka magpatuloy
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Basahin ang Terms at Privacy Notice bago gamitin ang mga feature na nagse-save ng impormasyon.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                className="rounded-xl border border-line p-4 text-sm font-bold text-teal hover:bg-teal-soft"
                href="/terms"
              >
                Basahin ang Terms of Use ↗
              </Link>
              <Link
                className="rounded-xl border border-line p-4 text-sm font-bold text-teal hover:bg-teal-soft"
                href="/privacy"
              >
                Basahin ang Privacy Notice ↗
              </Link>
            </div>
            <details className="mt-4 rounded-xl border border-line px-4 py-3 text-sm text-muted">
              <summary className="cursor-pointer font-semibold text-ink">Mahahalagang limitasyon ng prototype</summary>
              <p className="mt-3 leading-6">
                Hindi pa verified ang species coverage, fishing rules, boundaries, weather alerts, o food-safety
                guidance. Huwag gamitin ito para magpasya kung legal o ligtas mangisda o kung ligtas kainin ang huli.
              </p>
            </details>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink">
              <input
                data-initial-focus
                type="checkbox"
                checked={policyChecked}
                onChange={(event) => setPolicyChecked(event.target.checked)}
                className="mt-1 h-4 w-4 accent-teal"
              />
              Sumasang-ayon ako sa prototype Terms at Privacy Notice, at naiintindihan kong sa device lang nase-save ang
              impormasyon.
            </label>
            <button
              type="button"
              disabled={!policyChecked}
              onClick={acceptPolicies}
              className="mt-5 min-h-12 w-full rounded-xl bg-teal px-5 font-bold text-white enabled:hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sumang-ayon at magpatuloy
            </button>
            <p className="mt-3 text-xs leading-5 text-muted">
              Draft ito para sa prototype. Kailangan ng policy review bago public launch. Hindi ito pahintulot para
              mag-upload ng data sa cloud.
            </p>
          </section>
        </div>
      )}

      {ready && accepted && profileOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm">
          <section
            data-bangwit-dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcomeTitle"
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">
              {profileMode === "first" ? "Mabilis na setup · puwedeng i-skip" : "Preferences"}
            </p>
            <h2 id="welcomeTitle" className="mt-2 text-3xl font-extrabold text-ink">
              Kumusta, mangingisda!
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Iangkop ang Bangwit sa paraan mo ng pangingisda. Mananatili sa device ang preferences sa prototype.
            </p>
            <label className="mt-5 block text-sm font-semibold text-ink" htmlFor="fisherType">
              Ano ang pinakamalapit sa iyo?
            </label>
            <select
              data-initial-focus
              id="fisherType"
              value={fisherType}
              onChange={(event) => setFisherType(event.target.value as FisherProfile["type"])}
              className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink"
            >
              <option value="exploring">Nag-e-explore pa lang</option>
              <option value="angler">Recreational angler</option>
              <option value="livelihood">Mangingisdang pangkabuhayan</option>
              <option value="both">Pareho</option>
            </select>
            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="preferredWater">
              Saan ka madalas mangisda?
            </label>
            <select
              id="preferredWater"
              value={preferredWater}
              onChange={(event) => setPreferredWater(event.target.value as FisherProfile["water"])}
              className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink"
            >
              <option value="any">Wala pang preference</option>
              <option value="saltwater">Dagat o baybayin</option>
              <option value="freshwater">Ilog o lawa</option>
              <option value="brackish">Brackish o estuary</option>
            </select>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => finishProfile(false)}
                className="min-h-12 flex-1 rounded-xl border border-line px-4 font-bold text-ink hover:bg-paper"
              >
                {profileMode === "first" ? "Skip muna" : "Isara"}
              </button>
              <button
                type="button"
                onClick={() => finishProfile(true)}
                className="min-h-12 flex-1 rounded-xl bg-teal px-4 font-bold text-white hover:bg-teal-dark"
              >
                {profileMode === "first" ? "Ituloy" : "I-save"}
              </button>
            </div>
          </section>
        </div>
      )}

      {tourStep !== null && accepted && !profileOpen && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="tourTitle"
          aria-describedby="tourText"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-2xl sm:bottom-6 sm:p-6"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-teal">
            <span>Gabay sa Bangwit</span>
            <span>
              {tourStep + 1} / {TOUR_STEPS.length}
            </span>
          </div>
          <h2 id="tourTitle" className="mt-3 text-xl font-extrabold text-ink">
            {TOUR_STEPS[tourStep].title}
          </h2>
          <p id="tourText" className="mt-2 text-sm leading-6 text-muted">
            {TOUR_STEPS[tourStep].text}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={tourStep === 0}
              onClick={() => advanceTour(-1)}
              className="min-h-10 rounded-lg border border-line px-3 text-sm font-semibold text-ink disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => closeTour(true)}
              className="min-h-10 px-3 text-sm font-semibold text-muted hover:text-ink"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => advanceTour(1)}
              className="min-h-10 rounded-lg bg-teal px-4 text-sm font-bold text-white hover:bg-teal-dark"
            >
              {tourStep === TOUR_STEPS.length - 1 ? "Tapos na" : "Next"}
            </button>
          </div>
        </section>
      )}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white shadow-xl"
        >
          {message}
        </div>
      )}
    </BangwitContext.Provider>
  );
}
