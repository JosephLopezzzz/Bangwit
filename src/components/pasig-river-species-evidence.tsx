"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/pasig-river-species-evidence.json";

export function PasigRiverSpeciesEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.pasigRiverSpeciesEvidence;
  const locale = lang === "fil" ? "fil-PH" : "en-PH";
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${evidence.assertion.collectionDate}T00:00:00Z`));
  const linkClass =
    "inline-flex min-h-9 items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";

  return (
    <section className="ui-card mt-5 min-w-0" aria-labelledby="pasig-river-evidence-heading">
      <h2 id="pasig-river-evidence-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>

      <article className="mt-4 rounded-xl border border-line bg-canvas/50 p-4">
        <h3 className="font-semibold text-ink">
          <i lang="en">{evidence.assertion.acceptedScientificName}</i>
        </h3>
        <dl className="mt-3 grid gap-y-2 text-sm leading-relaxed sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-x-4">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.localityLabel}</dt>
            <dd lang="en" className="min-w-0 text-muted">
              {evidence.assertion.reportedLocality}
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.collectionDateLabel}</dt>
            <dd className="text-muted">{date}</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.individualsLabel}</dt>
            <dd className="text-muted">{evidence.assertion.individualsReported}</dd>
          </div>
        </dl>
      </article>

      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.limits}</p>
      <p className="mt-2 max-w-[75ch] text-xs leading-relaxed text-muted">{copy.coordinateNote}</p>

      <details className="group mt-3">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <p className="mt-1 max-w-[75ch] text-sm leading-relaxed text-muted">{evidence.source.citation}</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {[
            [evidence.source.articleUrl, copy.articleLink],
            [evidence.source.licenseUrl, copy.licenseLink],
          ].map(([url, label]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {label}
                <ArrowUpRight aria-hidden="true" size={15} />
                <span className="sr-only">{copy.opensTab}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-[75ch] text-xs leading-relaxed text-muted">{copy.taxonomyNote}</p>
        <p className="mt-2 max-w-[75ch] text-xs leading-relaxed text-muted">{copy.licenseNote}</p>
      </details>
    </section>
  );
}
