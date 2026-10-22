"use client";

import { ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import evidence from "@/data/taal-checklist-evidence.json";
import { filterSpeciesNameAssertions } from "@/lib/species-research";

export function TaalChecklistEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.taalChecklist;
  const [query, setQuery] = useState("");
  const records = filterSpeciesNameAssertions(evidence.records, query);
  const dateFormat = new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
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
    <section className="ui-card mt-5 min-w-0" aria-labelledby="taal-checklist-heading">
      <h2 id="taal-checklist-heading" className="ui-section-title">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-relaxed text-muted">{copy.description}</p>
      <p className="mt-3 max-w-[75ch] text-sm font-semibold leading-relaxed text-ink">{copy.scope}</p>
      <p id="taal-checklist-limits" className="mt-1 max-w-[75ch] text-sm leading-relaxed text-muted">
        {copy.limits}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1 basis-56">
          <label htmlFor="taal-checklist-search" className="text-xs font-semibold text-muted">
            {copy.searchLabel}
          </label>
          <div className="relative mt-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              id="taal-checklist-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="ui-input ui-input--search w-full"
              aria-describedby="taal-checklist-limits"
            />
          </div>
        </div>
        {query.length > 0 && (
          <button type="button" onClick={() => setQuery("")} className="ui-button ui-button--secondary">
            {copy.clearSearch}
          </button>
        )}
      </div>

      <p className="mt-3 text-sm font-semibold text-ink" aria-live="polite">
        {copy.resultsSummary
          .replace("{count}", String(records.length))
          .replace("{total}", String(evidence.records.length))}
      </p>
      {records.length ? (
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {records.map((record) => (
            <li key={record.id}>
              <details className="group">
                <summary className={summaryClass}>
                  <i lang="en" className="min-w-0 break-words text-ink">
                    {record.scientificName}
                  </i>
                  <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
                </summary>
                <dl className="grid gap-y-3 py-2 text-sm leading-relaxed sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-5">
                  <div className="contents">
                    <dt className="font-semibold text-ink">{copy.recordedAs}</dt>
                    <dd lang="en" className="min-w-0 break-words text-muted">
                      {record.recordedName}
                    </dd>
                  </div>
                  <div className="contents">
                    <dt className="font-semibold text-ink">{copy.sourceLocality}</dt>
                    <dd lang="en" className="min-w-0 text-muted">
                      {record.reportedLocality}
                    </dd>
                  </div>
                  <div className="contents">
                    <dt className="font-semibold text-ink">{copy.observationDateLabel}</dt>
                    <dd className="min-w-0 text-muted">{copy.observationDateUnknown}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-x-5 gap-y-1 pb-3 text-sm">
                  {[
                    [record.sourceUrl, copy.sourceLink],
                    [record.taxonomyUrl, copy.taxonomyLink],
                    [record.independentTaxonomyUrl, copy.independentTaxonomyLink],
                  ].map(([url, label]) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {label}
                      <ArrowUpRight aria-hidden="true" size={15} />
                      <span className="sr-only">{copy.opensTab}</span>
                    </a>
                  ))}
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-4 text-sm leading-relaxed" role="status">
          <p className="font-semibold text-ink">{copy.noMatches}</p>
          <p className="mt-1 max-w-[75ch] text-muted">{copy.noMatchesDesc}</p>
        </div>
      )}

      <details className="group mt-3">
        <summary className={summaryClass}>
          {copy.sourceDetails}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <p lang="en" className="mt-1 max-w-[75ch] break-words text-sm leading-relaxed text-muted">
          {evidence.source.citation}
        </p>
        <dl className="mt-3 grid gap-y-3 text-sm leading-relaxed sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-5">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.publicationDateLabel}</dt>
            <dd className="text-muted">
              <time dateTime={evidence.source.publicationDate}>
                {dateFormat.format(new Date(evidence.source.publicationDate))}
              </time>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.reviewedOnLabel}</dt>
            <dd className="text-muted">
              <time dateTime={evidence.reviewedOn}>{dateFormat.format(new Date(evidence.reviewedOn))}</time>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.taxonomyIndexLabel}</dt>
            <dd lang="en" className="text-muted">
              {evidence.taxonomy.authority} · {evidence.taxonomy.indexAlias}
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.licenseLabel}</dt>
            <dd className="min-w-0 text-muted">
              <a href={evidence.source.licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {evidence.source.license}
                <ArrowUpRight aria-hidden="true" size={15} />
                <span className="sr-only">{copy.opensTab}</span>
              </a>
              <p className="max-w-[75ch]">{copy.licenseNote}</p>
            </dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {[
            [evidence.source.datasetUrl, copy.datasetLink],
            [evidence.source.articleUrl, copy.articleLink],
          ].map(([url, label]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {label}
              <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">{copy.opensTab}</span>
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}
