"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/bulacan-manila-bay-gbif-evidence.json";

export function BulacanManilaBayGbifEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.bulacanManilaBayGbifEvidence;
  const date = new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${evidence.collectionDate}-01T00:00:00Z`));
  const linkClass =
    "inline-flex min-h-9 items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";

  return (
    <section className="ui-card mt-5 min-w-0" aria-labelledby="bulacan-manila-bay-gbif-heading">
      <h2 id="bulacan-manila-bay-gbif-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>
      <p className="mt-3 max-w-[75ch] text-sm font-semibold leading-relaxed text-ink">{copy.scope}</p>
      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">
        {copy.localityLabel}: <span lang="en">{evidence.reportedLocality}</span>
      </p>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {evidence.assertions.map((assertion) => {
          const record = assertion.records[0];
          return (
            <li key={assertion.id} className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <h3 className="font-semibold text-ink">
                  <i lang="en">{assertion.scientificName}</i>
                </h3>
                {assertion.recordedName !== assertion.scientificName && (
                  <p className="mt-1 text-xs text-muted">
                    {copy.recordedAs}: <i lang="en">{assertion.recordedName}</i>
                  </p>
                )}
                <p className="mt-1 text-sm text-muted">
                  {copy.catalogLabel}: {record.catalogNumber} · {copy.individualsLabel}: {record.individualCount}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <time className="text-muted" dateTime={evidence.collectionDate}>
                  {date}
                </time>
                <a href={record.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {copy.recordLink}
                  <ArrowUpRight aria-hidden="true" size={15} />
                  <span className="sr-only">{copy.opensTab}</span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.limits}</p>

      <details className="group mt-3">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <ul className="divide-y divide-line border-y border-line">
          <li className="py-2">
            <a href={evidence.source.metadataUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {copy.datasetLink}
              <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">{copy.opensTab}</span>
            </a>
            <p className="mt-1 break-words text-xs leading-relaxed text-muted">{evidence.source.citation}</p>
          </li>
          {evidence.assertions.map((assertion) => {
            const record = assertion.records[0];
            return (
              <li key={`${assertion.id}-details`} className="py-2">
                <p className="text-sm font-semibold text-ink">
                  <i lang="en">{assertion.scientificName}</i> · {record.catalogNumber}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <a href={record.museumRecordUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {copy.museumRecordLink}
                    <ArrowUpRight aria-hidden="true" size={15} />
                    <span className="sr-only">{copy.opensTab}</span>
                  </a>
                  <a
                    href={assertion.taxonomy.independentTaxonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {copy.taxonomyLink}
                    <ArrowUpRight aria-hidden="true" size={15} />
                    <span className="sr-only">{copy.opensTab}</span>
                  </a>
                </div>
                <p className="mt-1 break-words text-xs leading-relaxed text-muted">
                  {copy.qualityFlags} {record.issues.join(", ")}
                </p>
              </li>
            );
          })}
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
