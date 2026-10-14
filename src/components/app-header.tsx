"use client";

import {
  BookOpen,
  ChevronsLeft,
  CircleHelp,
  Fish,
  Globe2,
  MapPin,
  Menu,
  NotebookPen,
  Settings2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBangwit } from "@/components/bangwit-provider";
import { type DropdownOption, DropdownSelect } from "@/components/dropdown-select";
import { Expand } from "@/components/ui/expand";
import "./app-shell.css";

const languageOptions: DropdownOption[] = [
  { value: "fil", label: "FIL", icon: Globe2 },
  { value: "en", label: "EN", icon: Globe2 },
];

export function AppHeader() {
  const pathname = usePathname();
  const { startTour, theme, toggleTheme, lang, setLang, dict } = useBangwit();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState<{ href: string; label: string; left: number; top: number } | null>(null);
  const tooltipId = useId();

  // CSS and the head bootstrap own first-paint geometry. React only synchronizes
  // control semantics after hydration, so server markup never guesses a viewport.
  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const syncPreference = () => {
      const preference = document.documentElement.dataset.sidebar;
      setCollapsed(preference === "collapsed" || (preference !== "expanded" && !desktop.matches));
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== "bangwit.sidebar" && event.key !== null) return;
      if (event.newValue === "expanded" || event.newValue === "collapsed") {
        document.documentElement.dataset.sidebar = event.newValue;
      } else {
        delete document.documentElement.dataset.sidebar;
      }
      syncPreference();
    };
    syncPreference();
    desktop.addEventListener("change", syncPreference);
    window.addEventListener("storage", syncStorage);
    return () => {
      desktop.removeEventListener("change", syncPreference);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: A route change closes the navigation drawer.
  useEffect(() => {
    drawerRef.current?.close();
    setTooltip(null);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
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

  useEffect(() => {
    if (!tooltip) return;
    const hideTooltip = () => setTooltip(null);
    const dismissTooltip = (event: KeyboardEvent) => {
      if (event.key === "Escape") hideTooltip();
    };
    window.addEventListener("resize", hideTooltip);
    window.addEventListener("scroll", hideTooltip, true);
    document.addEventListener("keydown", dismissTooltip);
    return () => {
      window.removeEventListener("resize", hideTooltip);
      window.removeEventListener("scroll", hideTooltip, true);
      document.removeEventListener("keydown", dismissTooltip);
    };
  }, [tooltip]);

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

  function toggleSidebar() {
    const nextCollapsed = !collapsed;
    const preference = nextCollapsed ? "collapsed" : "expanded";
    document.documentElement.dataset.sidebar = preference;
    setCollapsed(nextCollapsed);
    setTooltip(null);
    try {
      localStorage.setItem("bangwit.sidebar", preference);
    } catch {
      // The current session remains usable when browser storage is blocked.
    }
  }

  function showTooltip(target: HTMLElement, href: string, label: string) {
    if (!collapsed) return;
    const rect = target.getBoundingClientRect();
    setTooltip({ href, label, left: rect.right + 12, top: rect.top + rect.height / 2 });
  }

  function openGuide() {
    closeDrawer();
    startTour();
  }

  function brand() {
    return (
      <Link href="/" aria-label={`Bangwit — ${dict.nav.explore}`} className="app-brand" onClick={closeDrawer}>
        <Image src="/assets/bilog.png" alt="" width={80} height={80} priority className="app-brand-image" />
        <span className="app-brand-copy">
          <span className="app-brand-name">{dict.common.appName}</span>
          <span className="app-brand-tagline">{dict.common.tagline}</span>
        </span>
      </Link>
    );
  }

  function navigationPanel(variant: "sidebar" | "drawer") {
    return (
      <div className="app-nav-panel">
        <div className="app-sidebar-heading">
          {brand()}
          {variant === "sidebar" && (
            <button
              type="button"
              className="app-sidebar-toggle"
              onClick={toggleSidebar}
              aria-expanded={!collapsed}
              aria-controls="app-sidebar-navigation"
              aria-label={collapsed ? dict.nav.expandSidebar : dict.nav.collapseSidebar}
              title={collapsed ? dict.nav.expandSidebar : dict.nav.collapseSidebar}
            >
              <ChevronsLeft aria-hidden="true" size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>
        <nav
          id={variant === "sidebar" ? "app-sidebar-navigation" : undefined}
          aria-label={dict.nav.mainMenu}
          className="app-primary-nav"
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                aria-describedby={variant === "sidebar" && tooltip?.href === href ? tooltipId : undefined}
                data-active={active}
                className="app-nav-link"
                onClick={closeDrawer}
                onMouseEnter={(event) => {
                  if (variant === "sidebar") showTooltip(event.currentTarget, href, label);
                }}
                onMouseLeave={(event) => {
                  if (document.activeElement !== event.currentTarget) setTooltip(null);
                }}
                onFocus={(event) => {
                  if (variant === "sidebar") showTooltip(event.currentTarget, href, label);
                }}
                onBlur={() => setTooltip(null)}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
                <span className="app-nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="app-sidebar-footer">
          <div className="app-language-picker">
            <DropdownSelect
              id={`app-language-${variant}`}
              label={dict.common.language}
              value={lang}
              options={languageOptions}
              onValueChange={(value) => setLang(value === "en" ? "en" : "fil")}
              className="app-language-dropdown"
            />
          </div>
          <div className="app-footer-actions">
            <Expand
              toggled={theme === "dark"}
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === "dark"}
              aria-label={dict.common.theme}
              title={dict.common.theme}
              className="app-theme-switch"
              duration={180}
            />
            <button
              type="button"
              onClick={openGuide}
              aria-label={dict.nav.openGuide}
              title={dict.nav.openGuide}
              className="app-guide-button"
            >
              <CircleHelp aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside className="app-sidebar">{navigationPanel("sidebar")}</aside>
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
          <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
          <span>{dict.nav.menuButton}</span>
        </button>
      </header>
      <dialog
        ref={drawerRef}
        id="app-navigation-drawer"
        aria-label={dict.nav.mainMenu}
        className="app-navigation-drawer"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            closeDrawer();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeDrawer();
        }}
        onClose={() => {
          setDrawerOpen(false);
          if (window.matchMedia("(max-width: 767px)").matches) menuButtonRef.current?.focus({ preventScroll: true });
        }}
      >
        <button type="button" onClick={closeDrawer} aria-label={dict.common.close} className="app-drawer-close">
          <X aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
        {navigationPanel("drawer")}
      </dialog>
      {tooltip &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className="app-sidebar-tooltip"
            style={{ left: tooltip.left, top: tooltip.top }}
          >
            {tooltip.label}
          </div>,
          document.body,
        )}
    </>
  );
}
