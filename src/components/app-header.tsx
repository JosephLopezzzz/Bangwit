"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBangwit } from "@/components/bangwit-provider";

const links = [
  { href: "/", label: "Explore" },
  { href: "/species", label: "Species" },
  { href: "/catches", label: "My Catches" },
  { href: "/my-species", label: "My Species" },
  { href: "/settings", label: "Settings" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { startTour } = useBangwit();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-5 px-4 py-2 sm:px-8 lg:min-h-[76px] lg:flex-nowrap lg:px-12 lg:py-0">
        <Link href="/" aria-label="Bangwit — Explore" className="flex shrink-0 items-center gap-3 rounded-xl">
          <Image src="/assets/bilog.png" alt="" width={48} height={48} priority className="h-12 w-12 object-contain" />
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Bangwit</span>
            <span className="hidden text-xs text-muted sm:block">Bawat huli, may kuwento.</span>
          </span>
        </Link>

        <nav
          aria-label="Pangunahing menu"
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
                  active ? "bg-teal-soft text-teal-dark" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={startTour}
          aria-label="Buksan ang Bangwit guide"
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-lg font-bold text-teal hover:bg-teal-soft lg:order-3"
          title="Bangwit guide"
        >
          ?
        </button>
      </div>
    </header>
  );
}
