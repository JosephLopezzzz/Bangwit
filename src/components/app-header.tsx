"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CircleHelp, Fish, Globe2, MapPin, Menu, NotebookPen, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { Expand } from "@/components/ui/expand";

export function AppHeader() {
  const pathname = usePathname();
  const { startTour, theme, toggleTheme, lang, setLang, dict } = useBangwit();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: A route change closes the navigation drawer.
  useEffect(() => {
    drawerRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    const closeOnDesktop = () => {
      if (desktop.matches) drawerRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const links = [
    { href: "/", label: dict.nav.explore, icon: MapPin },
    { href: "/species", label: dict.nav.species, icon: Fish },
    { href: "/catches", label: dict.nav.myCatches, icon: NotebookPen },
    { href: "/my-species", label: dict.nav.mySpecies, icon: BookOpen },
    { href: "/settings", label: dict.nav.settings, icon: Settings2 },
  ];

  function closeDrawer() {
    drawerRef.current?.close();
  }

  function openDrawer() {
    menuButtonRef.current?.focus();
    drawerRef.current?.showModal();
    setDrawerOpen(true);
  }

  function openGuide() {
    closeDrawer();
    startTour();
  }

  function brand() {
    return (
      <Link href="/" aria-label={`Bangwit — ${dict.nav.explore}`} className="app-brand" onClick={closeDrawer}>
        <Image src="/assets/bilog.png" alt="" width={80} height={80} priority className="app-brand-image" />
        <span>
          <span className="app-brand-name">{dict.common.appName}</span>
          <span className="app-brand-tagline">{dict.common.tagline}</span>
        </span>
      </Link>
    );
  }

  function navigationPanel() {
    return (
      <div className="app-nav-panel">
        {brand()}
        <nav aria-label={dict.nav.mainMenu} className="app-primary-nav">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                data-active={active}
                className="app-nav-link"
                onClick={closeDrawer}
              >
                <Icon aria-hidden="true" size={24} strokeWidth={1.75} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="app-sidebar-footer">
          <label className="app-language-picker">
            <Globe2 aria-hidden="true" size={21} strokeWidth={1.75} />
            <select
              aria-label={dict.common.language}
              value={lang}
              onChange={(event) => setLang(event.target.value === "en" ? "en" : "fil")}
            >
              <option value="fil">FIL</option>
              <option value="en">EN</option>
            </select>
          </label>
          <div className="app-footer-actions">
            <Expand
              toggled={theme === "dark"}
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === "dark"}
              aria-label={dict.common.theme}
              title={dict.common.theme}
              className="app-theme-switch"
            />
            <button
              type="button"
              onClick={openGuide}
              aria-label={dict.nav.openGuide}
              title={dict.nav.openGuide}
              className="app-guide-button"
            >
              <CircleHelp aria-hidden="true" size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside className="app-sidebar">{navigationPanel()}</aside>
      <header className="app-mobile-header">
        {brand()}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={openDrawer}
          aria-expanded={drawerOpen}
          aria-controls="app-navigation-drawer"
          aria-haspopup="dialog"
          className="app-menu-button"
        >
          <Menu aria-hidden="true" size={22} strokeWidth={1.75} />
          <span>{dict.nav.menuButton}</span>
        </button>
      </header>
      <dialog
        ref={drawerRef}
        id="app-navigation-drawer"
        aria-label={dict.nav.mainMenu}
        className="app-navigation-drawer"
        onClose={() => setDrawerOpen(false)}
      >
        <button type="button" onClick={closeDrawer} aria-label={dict.common.close} className="app-drawer-close">
          <X aria-hidden="true" size={22} strokeWidth={1.75} />
        </button>
        {navigationPanel()}
      </dialog>
    </>
  );
}
