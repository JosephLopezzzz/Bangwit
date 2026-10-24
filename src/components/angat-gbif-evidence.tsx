"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/angat-gbif-species-evidence.json";

export function AngatGbifEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.angatGbifEvidence;
  const locale = lang === "fil" ? "fil-PH" : "en-PH";
  const assertion = evidence.assertions[0];
  const record = assertion.records[0];
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${record.eventDate}T00:00:00Z`));
  const linkClass =
    "inline-flex min-h-9 items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";

  return (
    <section className="ui-card mt-5 min-w-0" aria-labelledby="angat-gbif-heading">
      <h2 id="angat-gbif-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>
      <p className="mt-3 max-w-[75ch] text-sm font-semibold leading-relaxed text-ink">{copy.scope}</p>

      <article className="mt-4 rounded-xl border border-line bg-canvas/50 p-4">
        <h3 className="font-semibold text-ink">
          <i lang="en">{assertion.scientificName}</i>
        </h3>
        <dl className="mt-3 grid gap-y-2 text-sm leading-relaxed sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-4">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.localityLabel}</dt>
            <dd lang="en" className="min-w-0 text-muted">
              {assertion.reportedLocality}
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.collectionDateLabel}</dt>
            <dd className="text-muted">
              <time dateTime={record.eventDate}>{date}</time>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.recordCountLabel}</dt>
            <dd className="text-muted">{assertion.records.length}</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.individualCountLabel}</dt>
            <dd className="text-muted">{record.individualCount}</dd>
          </div>
        </dl>
      </article>

      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.limits}</p>
      <p className="mt-2 max-w-[75ch] text-xs leading-relaxed text-muted">
        {copy.qualityFlags} {record.issues.join(", ")}
      </p>

      <details className="group mt-3">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <ul className="divide-y divide-line border-y border-line">
          <li className="py-2">
            <a href={record.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {copy.recordLink} {record.gbifId}
              <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">{copy.opensTab}</span>
            </a>
          </li>
          <li className="py-2">
            <a href={evidence.source.metadataUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {copy.datasetLink}
              <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">{copy.opensTab}</span>
            </a>
            <p className="mt-1 break-words text-xs leading-relaxed text-muted">{evidence.source.citation}</p>
          </li>
          <li className="py-2">
            <a href={assertion.taxonomy.independentTaxonUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {copy.taxonomyLink}
              <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">{copy.opensTab}</span>
            </a>
            <p className="mt-1 text-xs leading-relaxed text-muted">{copy.taxonomyNote}</p>
          </li>
          <li className="py-2">
            <a href={evidence.source.licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {copy.licenseLink}
              <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">{copy.opensTab}</span>
            </a>
            <p className="mt-1 text-xs leading-relaxed text-muted">{copy.licenseNote}</p>
          </li>
        </ul>
      </details>
    </section>
  );
}
