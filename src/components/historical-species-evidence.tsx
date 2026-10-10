"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/cavite-historical-evidence.json";

export function HistoricalSpeciesEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.historicalEvidence;
  const dateFormat = new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const reviewDate = (value: string) => dateFormat.format(new Date(value));
  const numberFormat = new Intl.NumberFormat(lang === "fil" ? "fil-PH" : "en-PH");
  const groups = [
    { id: "limbones-cove", title: copy.coveTitle, note: copy.coveNote },
    { id: "cavite-manila-bay", title: copy.coastTitle, note: copy.coastNote },
  ];
  const linkClass =
    "inline-flex items-center gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal";
  const summaryClass =
    "flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-teal hover:text-teal-dark focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden";

  return (
    <section
      aria-labelledby="historical-evidence-heading"
      aria-describedby="historical-evidence-scope historical-evidence-limits"
      className="mt-5 min-w-0 rounded-2xl border border-line bg-white px-5 py-5 sm:px-6"
    >
      <h2 id="historical-evidence-heading" className="text-xl font-bold leading-snug text-ink">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-6 text-muted">
        {copy.description.replace("{count}", String(evidence.records.length))}
      </p>
      <p id="historical-evidence-scope" className="mt-3 max-w-[75ch] text-sm font-semibold leading-6 text-ink">
        {copy.scope}
      </p>
      <p id="historical-evidence-limits" className="mt-1 max-w-[75ch] text-sm leading-6 text-muted">
        {copy.limits}
      </p>
      <details className="group mt-4 border-t border-line">
        <summary className={summaryClass}>
          {copy.recordsSummary.replace("{count}", String(evidence.records.length))}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        {groups.map((group) => (
          <div key={group.id} className="pb-4">
            <h3 className="mt-4 text-base font-semibold text-ink">{group.title}</h3>
            <p className="mb-3 mt-1 max-w-[75ch] text-sm leading-6 text-muted">{group.note}</p>
            <ul aria-label={group.title}>
              {evidence.records
                .filter((record) => record.localityGroup === group.id)
                .map((record) => (
                  <li key={record.id} className="border-t border-line">
                    <details className="group/record">
                      <summary className={summaryClass}>
                        <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                          <i className="break-words text-ink">{record.acceptedName}</i>
                          <span className="font-normal text-muted">
                            {record.collectedOn ? (
                              <time dateTime={record.collectedOn}>{record.collectedOn}</time>
                            ) : (
                              copy.dateMissing
                            )}
                          </span>
                        </span>
                        <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open/record:rotate-180" />
                      </summary>
                      <dl className="grid gap-y-3 pb-4 text-sm leading-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-5">
                        {record.recordedName !== record.acceptedName && (
                          <div className="contents">
                            <dt className="font-semibold text-ink">{copy.recordedAs}</dt>
                            <dd className="min-w-0 text-muted">
                              <i>{record.recordedName}</i>
                            </dd>
                          </div>
                        )}
                        <div className="contents">
                          <dt className="font-semibold text-ink">{copy.sourceLocality}</dt>
                          <dd lang="en" className="min-w-0 text-muted">
                            {record.reportedLocality}
                          </dd>
                        </div>
                        <div className="contents">
                          <dt className="font-semibold text-ink">{copy.uncertainty}</dt>
                          <dd className="min-w-0 text-muted">{numberFormat.format(record.coordinateUncertaintyM)} m</dd>
                        </div>
                        <div className="contents">
                          <dt className="font-semibold text-ink">{copy.providerNote}</dt>
                          <dd lang="en" className="min-w-0 text-muted">
                            {record.georeferenceRemarks}
                          </dd>
                        </div>
                        <div className="contents">
                          <dt className="font-semibold text-ink">{copy.recordId}</dt>
                          <dd className="min-w-0 break-words text-muted">{record.id}</dd>
                        </div>
                      </dl>
                      <div className="flex flex-wrap gap-x-5 gap-y-3 pb-5 text-sm">
                        <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {copy.recordLink}
                          <ArrowUpRight aria-hidden="true" size={16} />
                          <span className="sr-only">{copy.opensTab}</span>
                        </a>
                        <a href={record.taxonomyUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {copy.taxonomyLink}
                          <ArrowUpRight aria-hidden="true" size={16} />
                          <span className="sr-only">{copy.opensTab}</span>
                        </a>
                      </div>
                    </details>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </details>
      <details className="group border-t border-line">
        <summary className={summaryClass}>
          {copy.sourceSummary}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <dl className="grid gap-y-4 pb-2 text-sm leading-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-5">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.datasetLabel}</dt>
            <dd className="min-w-0 text-muted">
              <a href={evidence.dataset.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {evidence.dataset.title}
                <ArrowUpRight aria-hidden="true" size={16} />
                <span className="sr-only">{copy.opensTab}</span>
              </a>
              <p className="mt-2 max-w-[75ch] break-words" lang="en">
                {evidence.dataset.citation}
              </p>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.licenseLabel}</dt>
            <dd className="min-w-0 text-muted">
              <a href={evidence.dataset.licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {evidence.dataset.license}
                <ArrowUpRight aria-hidden="true" size={16} />
                <span className="sr-only">{copy.opensTab}</span>
              </a>
              <p className="mt-1 max-w-[75ch]">{copy.licenseNote}</p>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.taxonomyChecked}</dt>
            <dd className="min-w-0 text-muted">
              <time dateTime={evidence.snapshot.taxonomyReviewedAt}>
                {reviewDate(evidence.snapshot.taxonomyReviewedAt)}
              </time>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.licenseChecked}</dt>
            <dd className="min-w-0 text-muted">
              <time dateTime={evidence.snapshot.licenseReviewedAt}>
                {reviewDate(evidence.snapshot.licenseReviewedAt)}
              </time>
            </dd>
          </div>
        </dl>
        <p className="mt-3 max-w-[75ch] pb-3 text-sm leading-6 text-muted">{copy.reviewNote}</p>
      </details>
    </section>
  );
}
