"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AreaExplorer } from "@/components/area-explorer";
import { useBangwit } from "@/components/bangwit-provider";
import { CaviteFisheriesEvidence } from "@/components/cavite-fisheries-evidence";
import { CAVITE_PROVINCE_ID } from "@/data/phl-provinces";

export default function ExplorePage() {
  const { dict, selectedProvince } = useBangwit();

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

      {selectedProvince === CAVITE_PROVINCE_ID && <CaviteFisheriesEvidence />}

      <section className="ui-card mt-5" aria-labelledby="safetyHeading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.home.safetyTag}</p>
            <h2 id="safetyHeading" className="ui-section-title mt-1">
              {dict.home.safetyTitle}
            </h2>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
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

      <section className="ui-card mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <picture className="h-14 w-14 shrink-0">
          <source srcSet="/assets/bilog.png" media="(prefers-reduced-motion: reduce)" />
          <Image
            src="/assets/bilog-idle-blink-slow-right.gif"
            alt={dict.home.mascotAlt}
            width={96}
            height={96}
            unoptimized
            className="h-14 w-14 object-contain"
          />
        </picture>
        <div className="flex-1">
          <h2 className="font-bold text-ink">{dict.home.ctaTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{dict.home.ctaDesc}</p>
        </div>
        <Link href="/catches" className="ui-button ui-button--secondary">
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
