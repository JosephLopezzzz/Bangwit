"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/pansipit-river-gbif-evidence.json";

function formatPartialDate(value: string, locale: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const date = new Date(`${value}-01T00:00:00Z`);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function PansipitRiverGbifEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.pansipitRiverGbifEvidence;
  const locale = lang === "fil" ? "fil-PH" : "en-PH";
  const linkClass =
    "inline-flex min-h-9 items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";

  return (
    <section className="ui-card mt-5 min-w-0" aria-labelledby="pansipit-gbif-heading">
      <h2 id="pansipit-gbif-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>
      <p className="mt-3 max-w-[75ch] text-sm font-semibold leading-relaxed text-ink">{copy.scope}</p>

      <ul className="mt-4 grid gap-3">
        {evidence.assertions.map((assertion) => (
          <li key={assertion.id} className="rounded-xl border border-line bg-canvas/50 p-4">
            <article>
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
                  <dt className="font-semibold text-ink">{copy.collectionDatesLabel}</dt>
                  <dd className="text-muted">
                    {[...new Set(assertion.records.map((record) => record.eventDate))]
                      .map((date) => formatPartialDate(date, locale))
                      .join(", ")}
                  </dd>
                </div>
                <div className="contents">
                  <dt className="font-semibold text-ink">{copy.specimenRecordsLabel}</dt>
                  <dd className="text-muted">{assertion.records.length}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.limits}</p>
      <p className="mt-2 max-w-[75ch] text-xs leading-relaxed text-muted">{copy.qualityFlags}</p>

      <details className="group mt-3">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <p className="mt-1 max-w-[75ch] text-sm leading-relaxed text-muted">
          {copy.reviewedOnLabel} {evidence.reviewedOn}. {copy.queryMethodNote} {evidence.querySummary.resultCount}{" "}
          {copy.queryResultSuffix}
        </p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {evidence.assertions.flatMap((assertion) =>
            assertion.records.map((record) => (
              <li key={record.gbifId} className="py-3">
                <a href={record.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {copy.gbifRecordLabel} {record.gbifId}
                  <ArrowUpRight aria-hidden="true" size={15} />
                  <span className="sr-only">{copy.opensTab}</span>
                </a>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  <span lang="en">
                    <i>{record.scientificName}</i>
                  </span>
                  {record.acceptedName !== record.scientificName && (
                    <>
                      {" "}
                      {copy.acceptedAsLabel}{" "}
                      <span lang="en">
                        <i>{record.acceptedName}</i>
                      </span>
                    </>
                  )}
                  {" · "}
                  {copy.collectionDateShortLabel}: {formatPartialDate(record.eventDate, locale)}
                  {" · "}
                  {copy.catalogNumberLabel}: {record.catalogNumber}
                </p>
                <p className="mt-1 break-words text-xs leading-relaxed text-muted">
                  {copy.qualityCodeLabel}: {record.issues.join(", ")}
                </p>
              </li>
            )),
          )}
        </ul>
        <p className="mt-3 max-w-[75ch] text-xs leading-relaxed text-muted">
          {copy.datasetCitationLabel} {evidence.source.citation}
        </p>
        <dl className="mt-3 grid gap-y-2 text-sm leading-relaxed sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-x-4">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.taxonomyLabel}</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1">
              {evidence.assertions.map((assertion) => (
                <span key={assertion.id} className="flex flex-wrap items-center gap-x-2">
                  <i lang="en">{assertion.scientificName}</i>
                  <a
                    href={assertion.taxonomy.gbifTaxonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {copy.gbifTaxonLink}
                    <ArrowUpRight aria-hidden="true" size={15} />
                    <span className="sr-only">{copy.opensTab}</span>
                  </a>
                  <a
                    href={assertion.taxonomy.independentTaxonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {copy.independentTaxonomyLink}
                    <ArrowUpRight aria-hidden="true" size={15} />
                    <span className="sr-only">{copy.opensTab}</span>
                  </a>
                </span>
              ))}
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.rightsLabel}</dt>
            <dd className="min-w-0 text-muted">
              <a href={evidence.source.licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {copy.licenseLabel}
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
