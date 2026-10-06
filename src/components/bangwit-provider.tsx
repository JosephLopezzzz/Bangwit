"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { enDictionary } from "@/i18n/dictionaries/en";
import { filDictionary } from "@/i18n/dictionaries/fil";
import type { Dictionary, Language } from "@/i18n/types";
import type { FisherProfile } from "@/types/catch";

const POLICY_KEY = "bangwit.policy.2026-09-prototype";
const POLICY_VERSION = "prototype-2";
const PROFILE_KEY = "bangwit.profile";
const ONBOARDING_KEY = "bangwit.onboarding.seen";
const TOUR_KEY = "bangwit.tour.done";
const THEME_KEY = "bangwit.theme";
const LANG_KEY = "bangwit.lang";
const AREAS = ["Manila Bay", "Bacoor Bay", "Cañacao Bay"];

const TOUR_PATH_TARGETS = [
  { path: "/", target: "#areaPicker" },
  { path: "/species", target: "#speciesNotice" },
  { path: "/catches", target: "#catchForm" },
  { path: "/my-species", target: "#collectionNotice" },
];

type ProfileMode = "first" | "edit";
type ColorTheme = "light" | "dark";
type NativeViewTransition = { finished: Promise<void> };

type BangwitContextValue = {
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  theme: ColorTheme;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  dict: Dictionary;
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
  const [theme, setTheme] = useState<ColorTheme>("light");
  const [lang, setLangState] = useState<Language>("fil");
  const themeRef = useRef<ColorTheme>("light");
  const themeTransitionRef = useRef(0);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const dict = useMemo(() => (lang === "en" ? enDictionary : filDictionary), [lang]);

  useEffect(() => {
    const initialTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    themeRef.current = initialTheme;
    setTheme(initialTheme);

    let savedLang: Language = "fil";
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === "en" || stored === "fil") savedLang = stored;
    } catch {
      /* fallback to default */
    }
    setLangState(savedLang);
    document.documentElement.lang = savedLang;
    document.documentElement.dataset.lang = savedLang;

    let didAccept = false;
    try {
      didAccept = hasCurrentPolicyAcceptance();
      setProfile(readProfile());
    } catch {
      setMessage(
        savedLang === "fil"
          ? "Hindi mabasa ang browser preferences. Local storage may be unavailable."
          : "Could not read browser preferences. Local storage may be unavailable.",
      );
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

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dataset.lang = nextLang;
    try {
      localStorage.setItem(LANG_KEY, nextLang);
    } catch {
      /* ignore */
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
    const stepTarget = TOUR_PATH_TARGETS[tourStep];
    if (pathname !== stepTarget.path) {
      router.push(stepTarget.path);
      return;
    }
    const target = document.querySelector<HTMLElement>(stepTarget.target);
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

  const toggleTheme = useCallback(() => {
    const nextTheme = themeRef.current === "dark" ? "light" : "dark";
    const root = document.documentElement;
    themeRef.current = nextTheme;

    const commitTheme = () => {
      root.dataset.theme = nextTheme;
      let storageError = false;
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch {
        storageError = true;
      }
      flushSync(() => {
        setTheme(nextTheme);
        if (storageError) {
          setMessage(
            lang === "fil"
              ? "Hindi na-save ang theme preference. Maaaring bumalik ito sa light sa susunod na bukas."
              : "Could not save theme preference.",
          );
        }
      });
    };

    const startViewTransition = (
      document as Document & {
        startViewTransition?: (updateCallback: () => void) => NativeViewTransition;
      }
    ).startViewTransition;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const supportsWave = typeof CSS !== "undefined" && CSS.supports("clip-path", "polygon(0 100%, 100% 100%, 100% 0%)");

    if (!startViewTransition || reduceMotion || !supportsWave) {
      root.removeAttribute("data-theme-transition");
      commitTheme();
      return;
    }

    root.dataset.themeTransition = nextTheme === "dark" ? "rise" : "recede";
    const transitionId = ++themeTransitionRef.current;
    const clearTransitionDirection = () => {
      if (transitionId === themeTransitionRef.current) root.removeAttribute("data-theme-transition");
    };

    try {
      const transition = startViewTransition.call(document, commitTheme);
      void transition.finished.then(clearTransitionDirection, clearTransitionDirection);
    } catch {
      clearTransitionDirection();
      commitTheme();
    }
  }, [lang]);
  const contextValue = useMemo(
    () => ({
      selectedArea,
      setSelectedArea,
      theme,
      toggleTheme,
      lang,
      setLang,
      dict,
      profile,
      openProfile,
      showMessage: setMessage,
      startTour,
    }),
    [selectedArea, setSelectedArea, theme, toggleTheme, lang, setLang, dict, profile, openProfile, startTour],
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
      setMessage(
        lang === "fil"
          ? "Hindi ma-save ang pag-acknowledge. Tingnan ang browser storage settings at subukan ulit."
          : "Could not save policy agreement.",
      );
    }
  }

  function finishProfile(save: boolean) {
    if (save) {
      const next = { type: fisherType, water: preferredWater } satisfies FisherProfile;
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
        setProfile(next);
      } catch {
        setMessage(
          lang === "fil"
            ? "Hindi na-save ang preferences; maaari mo pa ring gamitin ang app."
            : "Could not save preferences.",
        );
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
    if (next >= TOUR_PATH_TARGETS.length) closeTour(true);
    else setTourStep(next);
  }

  return (
    <BangwitContext.Provider value={contextValue}>
      {children}
      {ready && !accepted && !isPolicyPage && (
        <div className="app-dialog-scrim fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 backdrop-blur-sm">
          <section
            data-bangwit-dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="policyTitle"
            className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.policy.tag}</p>
              {/* Language switcher inside the policy dialog */}
              <fieldset
                className="flex rounded-lg border border-line bg-paper p-0.5 text-xs font-bold m-0"
                aria-label={dict.policy.selectLanguage}
              >
                <button
                  type="button"
                  onClick={() => setLang("fil")}
                  aria-pressed={lang === "fil"}
                  className={`rounded-md px-2.5 py-1 transition-colors ${lang === "fil" ? "bg-teal-soft text-teal-dark font-extrabold" : "text-muted hover:text-ink"}`}
                >
                  Filipino
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={`rounded-md px-2.5 py-1 transition-colors ${lang === "en" ? "bg-teal-soft text-teal-dark font-extrabold" : "text-muted hover:text-ink"}`}
                >
                  English
                </button>
              </fieldset>
            </div>
            <h1 id="policyTitle" className="mt-2 text-3xl font-extrabold text-ink">
              {dict.policy.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">{dict.policy.desc}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                className="flex items-center justify-between gap-3 rounded-xl border border-line p-4 text-sm font-bold text-teal hover:bg-teal-soft"
                href="/terms"
              >
                {dict.policy.readTerms}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                className="flex items-center justify-between gap-3 rounded-xl border border-line p-4 text-sm font-bold text-teal hover:bg-teal-soft"
                href="/privacy"
              >
                {dict.policy.readPrivacy}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </div>
            <details className="mt-4 rounded-xl border border-line px-4 py-3 text-sm text-muted">
              <summary className="cursor-pointer font-semibold text-ink">{dict.policy.summaryTitle}</summary>
              <p className="mt-3 leading-6">{dict.policy.summaryText}</p>
            </details>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink">
              <input
                data-initial-focus
                type="checkbox"
                checked={policyChecked}
                onChange={(event) => setPolicyChecked(event.target.checked)}
                className="mt-1 h-4 w-4 accent-teal"
              />
              {dict.policy.agreeCheckbox}
            </label>
            <button
              type="button"
              disabled={!policyChecked}
              onClick={acceptPolicies}
              className="mt-5 min-h-12 w-full rounded-xl bg-teal px-5 font-bold text-white enabled:hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {dict.policy.agreeBtn}
            </button>
            <p className="mt-3 text-xs leading-5 text-muted">{dict.policy.disclaimer}</p>
          </section>
        </div>
      )}

      {ready && accepted && profileOpen && (
        <div className="app-dialog-scrim fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 backdrop-blur-sm">
          <section
            data-bangwit-dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcomeTitle"
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">
              {profileMode === "first" ? dict.onboarding.tagFirst : dict.onboarding.tagEdit}
            </p>
            <h2 id="welcomeTitle" className="mt-2 text-3xl font-extrabold text-ink">
              {dict.onboarding.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{dict.onboarding.desc}</p>
            <label className="mt-5 block text-sm font-semibold text-ink" htmlFor="fisherType">
              {dict.onboarding.fisherTypeLabel}
            </label>
            <select
              data-initial-focus
              id="fisherType"
              value={fisherType}
              onChange={(event) => setFisherType(event.target.value as FisherProfile["type"])}
              className="app-select mt-2"
            >
              <option value="exploring">{dict.onboarding.types.exploring}</option>
              <option value="angler">{dict.onboarding.types.angler}</option>
              <option value="livelihood">{dict.onboarding.types.livelihood}</option>
              <option value="both">{dict.onboarding.types.both}</option>
            </select>
            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="preferredWater">
              {dict.onboarding.preferredWaterLabel}
            </label>
            <select
              id="preferredWater"
              value={preferredWater}
              onChange={(event) => setPreferredWater(event.target.value as FisherProfile["water"])}
              className="app-select mt-2"
            >
              <option value="any">{dict.onboarding.waters.any}</option>
              <option value="saltwater">{dict.onboarding.waters.saltwater}</option>
              <option value="freshwater">{dict.onboarding.waters.freshwater}</option>
              <option value="brackish">{dict.onboarding.waters.brackish}</option>
            </select>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => finishProfile(false)}
                className="min-h-12 flex-1 rounded-xl border border-line px-4 font-bold text-ink hover:bg-paper"
              >
                {profileMode === "first" ? dict.onboarding.skipBtn : dict.onboarding.closeBtn}
              </button>
              <button
                type="button"
                onClick={() => finishProfile(true)}
                className="min-h-12 flex-1 rounded-xl bg-teal px-4 font-bold text-white hover:bg-teal-dark"
              >
                {profileMode === "first" ? dict.onboarding.continueBtn : dict.onboarding.saveBtn}
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
            <span>{dict.tour.header}</span>
            <span>
              {tourStep + 1} / {TOUR_PATH_TARGETS.length}
            </span>
          </div>
          <h2 id="tourTitle" className="mt-3 text-xl font-extrabold text-ink">
            {dict.tour.steps[tourStep]?.title}
          </h2>
          <p id="tourText" className="mt-2 text-sm leading-6 text-muted">
            {dict.tour.steps[tourStep]?.text}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={tourStep === 0}
              onClick={() => advanceTour(-1)}
              className="min-h-10 rounded-lg border border-line px-3 text-sm font-semibold text-ink disabled:opacity-40"
            >
              {dict.common.back}
            </button>
            <button
              type="button"
              onClick={() => closeTour(true)}
              className="min-h-10 px-3 text-sm font-semibold text-muted hover:text-ink"
            >
              {dict.common.skip}
            </button>
            <button
              type="button"
              onClick={() => advanceTour(1)}
              className="min-h-10 rounded-lg bg-teal px-4 text-sm font-bold text-white hover:bg-teal-dark"
            >
              {tourStep === TOUR_PATH_TARGETS.length - 1 ? dict.common.done : dict.common.next}
            </button>
          </div>
        </section>
      )}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="app-status-message fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-xl"
        >
          {message}
        </div>
      )}
    </BangwitContext.Provider>
  );
}
