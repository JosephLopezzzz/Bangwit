"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/manila-bay-shared-gbif-evidence.json";

export function ManilaBaySharedGbifEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.manilaBaySharedGbifEvidence;
  const locale = lang === "fil" ? "fil-PH" : "en-PH";
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const linkClass =
    "inline-flex min-h-9 items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";

  return (
    <section className="ui-card mt-5 min-w-0" aria-labelledby="manila-bay-shared-evidence-heading">
      <h2 id="manila-bay-shared-evidence-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>
      <p className="mt-3 max-w-[75ch] text-sm font-semibold leading-relaxed text-ink">{copy.sharedScope}</p>

      <ul className="mt-4 grid gap-3">
        {evidence.records.map((record) => (
          <li key={record.gbifId} className="rounded-xl border border-line bg-canvas/50 p-4">
            <article>
              <h3 className="font-semibold text-ink">
                <i lang="en">{record.acceptedScientificName}</i>
              </h3>
              <dl className="mt-3 grid gap-y-2 text-sm leading-relaxed sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-x-4">
                <div className="contents">
                  <dt className="font-semibold text-ink">{copy.localityLabel}</dt>
                  <dd lang="en" className="min-w-0 text-muted">{record.reportedLocality}</dd>
                </div>
                <div className="contents">
                  <dt className="font-semibold text-ink">{copy.dateLabel}</dt>
                  <dd className="text-muted">
                    <time dateTime={record.eventDate}>{dateFormat.format(new Date(`${record.eventDate}T00:00:00Z`))}</time>
                  </dd>
                </div>
                <div className="contents">
                  <dt className="font-semibold text-ink">{copy.catalogLabel}</dt>
                  <dd className="text-muted">{record.catalogNumber}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                <a href={`https://www.gbif.org/occurrence/${record.gbifId}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {copy.recordLink}<ArrowUpRight aria-hidden="true" size={15} /><span className="sr-only">{copy.opensTab}</span>
                </a>
                <a href={record.independentTaxonomyUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {copy.taxonomyLink}<ArrowUpRight aria-hidden="true" size={15} /><span className="sr-only">{copy.opensTab}</span>
                </a>
              </div>
              <details className="group mt-2 border-t border-line">
                <summary className={summaryClass}>
                  {copy.qualityFlagsLabel}
                  <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
                </summary>
                <p className="break-words pb-2 text-xs leading-relaxed text-muted">{record.issues.join(", ")}</p>
              </details>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.limits}</p>
      <details className="group mt-3 border-t border-line">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <p className="mt-1 max-w-[75ch] text-sm leading-relaxed text-muted">{evidence.dataset.citation}</p>
        <p className="mt-2 max-w-[75ch] text-xs leading-relaxed text-muted">
          {copy.datasetLinkLabel} {evidence.dataset.doi} · {copy.licenseLabel} {evidence.dataset.license}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 pb-3">
          <a href={evidence.dataset.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {copy.datasetLink}<ArrowUpRight aria-hidden="true" size={15} /><span className="sr-only">{copy.opensTab}</span>
          </a>
          <a href={evidence.dataset.licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {copy.licenseLink}<ArrowUpRight aria-hidden="true" size={15} /><span className="sr-only">{copy.opensTab}</span>
          </a>
        </div>
      </details>
    </section>
  );
}
