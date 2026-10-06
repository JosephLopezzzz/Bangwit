"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBangwit } from "@/components/bangwit-provider";

export function AppHeader() {
  const pathname = usePathname();
  const { startTour, theme, toggleTheme, lang, setLang, dict } = useBangwit();
  const isDark = theme === "dark";

  const links = [
    { href: "/", label: dict.nav.explore },
    { href: "/species", label: dict.nav.species },
    { href: "/catches", label: dict.nav.myCatches },
    { href: "/my-species", label: dict.nav.mySpecies },
    { href: "/settings", label: dict.nav.settings },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-2 px-3 py-2 sm:gap-x-5 sm:px-8 lg:min-h-[76px] lg:flex-nowrap lg:px-12 lg:py-0">
        <Link
          href="/"
          aria-label={`Bangwit — ${dict.nav.explore}`}
          className="flex shrink-0 items-center gap-3 rounded-xl"
        >
          <Image src="/assets/bilog.png" alt="" width={48} height={48} priority className="h-12 w-12 object-contain" />
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              {dict.common.appName}
            </span>
            <span className="hidden text-xs text-muted sm:block">{dict.common.tagline}</span>
          </span>
        </Link>

        <nav
          aria-label={dict.nav.mainMenu}
          className="order-3 flex w-full max-w-full items-center gap-1 overflow-x-auto py-2 sm:gap-2 lg:order-2 lg:w-auto lg:flex-1 lg:justify-end"
        >
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                  active ? "bg-teal-soft text-teal-dark" : "text-muted hover:bg-paper hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-2 lg:order-3">
          {/* Language selector segmented control */}
          <fieldset
            className="flex items-center rounded-xl border border-line bg-white p-1 text-xs font-bold m-0"
            aria-label={dict.common.language}
          >
            <button
              type="button"
              aria-pressed={lang === "fil"}
              onClick={() => setLang("fil")}
              className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                lang === "fil" ? "bg-teal-soft text-teal-dark font-extrabold shadow-xs" : "text-muted hover:text-ink"
              }`}
              title="Filipino"
            >
              FIL
            </button>
            <button
              type="button"
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
              className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                lang === "en" ? "bg-teal-soft text-teal-dark font-extrabold shadow-xs" : "text-muted hover:text-ink"
              }`}
              title="English"
            >
              EN
            </button>
          </fieldset>

          {/* Theme switcher */}
          <button
            type="button"
            role="switch"
            aria-label={dict.common.theme}
            aria-checked={isDark}
            onClick={toggleTheme}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink transition-colors hover:bg-paper"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              {isDark ? (
                <path
                  d="M20.1 15.1A8.5 8.5 0 0 1 8.9 3.9 8.6 8.6 0 1 0 20.1 15.1Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path
                    d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
            <span>{isDark ? dict.common.dark : dict.common.light}</span>
          </button>

          {/* Guide button */}
          <button
            type="button"
            onClick={startTour}
            aria-label={dict.nav.openGuide}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-lg font-bold text-teal hover:bg-teal-soft lg:order-3"
            title={dict.nav.openGuide}
          >
            ?
          </button>
        </div>
      </div>
    </header>
  );
}
