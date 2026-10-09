"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AreaExplorer } from "@/components/area-explorer";
import { CaviteFisheriesEvidence } from "@/components/cavite-fisheries-evidence";
import { useBangwit } from "@/components/bangwit-provider";

export default function ExplorePage() {
  const { dict } = useBangwit();

  return (
    <main className="explore-page">
      <header className="explore-hero">
        <p className="explore-section-tag">{dict.home.tag}</p>
        <span className="explore-status">
          <span aria-hidden="true" />
          {dict.home.pilotBadge}
        </span>
        <h1>{dict.home.title}</h1>
        <p className="explore-subtitle">{dict.home.subtitle}</p>
      </header>

      <AreaExplorer />

      <CaviteFisheriesEvidence />

      <section
        className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="safetyHeading"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.home.safetyTag}</p>
            <h2 id="safetyHeading" className="mt-1 text-xl font-extrabold text-ink">
              {dict.home.safetyTitle}
            </h2>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">
            {dict.home.safetyStatus}
          </span>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">{dict.home.safetyDesc}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-teal">
          <a
            href="https://bagong.pagasa.dost.gov.ph/products-and-services"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1"
          >
            {dict.home.pagasaLink}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href="https://www.bfar.da.gov.ph/red-tide-archives/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1"
          >
            {dict.home.bfarLink}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-4 rounded-3xl border border-line bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:px-6">
        <picture className="h-20 w-20 shrink-0">
          <source srcSet="/assets/bilog.png" media="(prefers-reduced-motion: reduce)" />
          <Image
            src="/assets/bilog-idle-blink-slow-right.gif"
            alt={dict.home.mascotAlt}
            width={96}
            height={96}
            unoptimized
            className="h-20 w-20 object-contain"
          />
        </picture>
        <div className="flex-1">
          <h2 className="font-bold text-ink">{dict.home.ctaTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{dict.home.ctaDesc}</p>
        </div>
        <Link
          href="/catches"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-teal px-5 font-bold text-teal hover:bg-teal-soft"
        >
          {dict.home.ctaBtn}
        </Link>
      </section>
      <footer className="mt-5 flex flex-col gap-1 border-t border-line pt-4 text-xs leading-5 text-muted sm:flex-row sm:justify-between">
        <span>{dict.home.footerLeft}</span>
        <span>{dict.home.footerRight}</span>
      </footer>
    </main>
  );
}
