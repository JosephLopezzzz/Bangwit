"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/makiling-gbif-evidence.json";

export function MakilingGbifEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.makilingGbifEvidence;
  const formatDate = new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const linkClass =
    "inline-flex min-h-9 items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";
  const assertion = evidence.assertions[0];

  return (
    <section className="ui-card mt-5 min-w-0" aria-labelledby="makiling-gbif-heading">
      <h2 id="makiling-gbif-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>
      <p className="mt-3 max-w-[75ch] text-sm font-semibold leading-relaxed text-ink">{copy.scope}</p>

      <article className="mt-4 rounded-xl border border-line bg-canvas/50 p-4">
        <h3 className="font-semibold text-ink">
          <i lang="en">{assertion.scientificName}</i>
        </h3>
        <dl className="mt-3 grid gap-y-2 text-sm leading-relaxed sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-x-4">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.localityLabel}</dt>
            <dd lang="en" className="min-w-0 text-muted">
              {assertion.reportedLocality}
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.collectionDateLabel}</dt>
            <dd className="text-muted">{copy.collectionDateUnknown}</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.recordCountLabel}</dt>
            <dd className="text-muted">{copy.recordCountValue}</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.recordLicenseLabel}</dt>
            <dd className="text-muted">CC0 1.0</dd>
          </div>
        </dl>
      </article>

      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.limits}</p>
      <p className="mt-2 max-w-[75ch] text-xs leading-relaxed text-muted">{copy.qualityFlags}</p>

      <details className="group mt-3">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <p className="mt-1 max-w-[75ch] text-sm leading-relaxed text-muted">
          {copy.reviewedOnLabel} {formatDate.format(new Date(evidence.reviewedOn))}. {copy.scopeMethodNote}
        </p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {assertion.records.map((record) => {
            const dataset = evidence.sources.find((source) => source.id === record.datasetId);
            return (
              <li key={record.gbifId} className="py-3">
                <a href={record.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {copy.gbifRecordLabel} {record.gbifId}
                  <ArrowUpRight aria-hidden="true" size={15} />
                  <span className="sr-only">{copy.opensTab}</span>
                </a>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  <span lang="en">{dataset?.title}</span> · {copy.catalogNumberLabel}: {record.catalogNumber}
                </p>
                <p className="mt-1 break-words text-xs leading-relaxed text-muted">
                  {copy.qualityCodeLabel}: {record.issues.join(", ")}
                </p>
                {dataset && (
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {copy.datasetCitationLabel} {dataset.citation}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <dl className="mt-3 grid gap-y-2 text-sm leading-relaxed sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-x-4">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.taxonomyLabel}</dt>
            <dd className="flex flex-wrap gap-x-4">
              {[
                [evidence.taxonomy.gbifTaxonUrl, copy.gbifTaxonLink],
                [evidence.taxonomy.independentTaxonUrl, copy.independentTaxonomyLink],
              ].map(([url, label]) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {label}
                  <ArrowUpRight aria-hidden="true" size={15} />
                  <span className="sr-only">{copy.opensTab}</span>
                </a>
              ))}
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.rightsLabel}</dt>
            <dd className="min-w-0 text-muted">
              <a href={evidence.sources[0].licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                CC0 1.0
                <ArrowUpRight aria-hidden="true" size={15} />
                <span className="sr-only">{copy.opensTab}</span>
              </a>
              <p className="mt-1">{copy.rightsNote}</p>
            </dd>
          </div>
        </dl>
      </details>
    </section>
  );
}
