"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import report from "../../data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json";

export function CaviteFisheriesEvidence() {
  const { dict, lang } = useBangwit();
  const copy = dict.fisheriesEvidence;
  const reviewedDate = new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${report.reviewedOn}T00:00:00Z`));

  return (
    <section
      aria-labelledby="cavite-evidence-heading"
      aria-describedby="cavite-evidence-scope cavite-evidence-limits"
      className="mt-5 min-w-0 rounded-2xl border border-line bg-white px-5 py-5 sm:px-6"
    >
      <h2 id="cavite-evidence-heading" className="text-xl font-bold leading-snug text-ink">
        {copy.title} · {report.reportYear}
      </h2>
      <p className="mt-2 max-w-[75ch] text-sm leading-6 text-muted">
        {copy.description.replace("{count}", String(report.records.length))}
      </p>
      <p id="cavite-evidence-scope" className="mt-3 max-w-[75ch] text-sm font-semibold leading-6 text-ink">
        {copy.scope}
      </p>
      <p id="cavite-evidence-limits" className="mt-1 max-w-[75ch] text-sm leading-6 text-muted">
        {copy.limits}
      </p>

      <details className="group mt-4 border-t border-line">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-teal hover:text-teal-dark focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden">
          {copy.groupsSummary.replace("{count}", String(report.records.length))}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <ul aria-label={copy.groupsLabel} className="grid gap-x-8 pb-4 sm:grid-cols-2">
          {report.records.map((record) => {
            const localNames = record.localNames.join(" / ");
            return (
              <li key={record.group} className="min-w-0 border-t border-line py-3">
                <p className="text-sm font-semibold leading-6 text-ink">{lang === "fil" ? localNames : record.group}</p>
                <p className="text-sm leading-6 text-muted">{lang === "fil" ? record.group : localNames}</p>
              </li>
            );
          })}
        </ul>
      </details>

      <details className="group border-t border-line">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-teal hover:text-teal-dark focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal [&::-webkit-details-marker]:hidden">
          {copy.sourceSummary}
          <ChevronDown aria-hidden="true" size={18} className="shrink-0 group-open:rotate-180" />
        </summary>
        <dl className="grid gap-y-4 pb-2 text-sm leading-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-5">
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.sourceLabel}</dt>
            <dd className="min-w-0 text-muted">
              <a
                href={`${report.sourceUrl}#page=${report.pdfPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-start gap-1.5 font-semibold text-teal underline decoration-line underline-offset-4 hover:decoration-teal"
              >
                <span>Cavite Ecological Profile {report.reportYear}</span>
                <ArrowUpRight aria-hidden="true" size={16} className="mt-1 shrink-0" />
                <span className="sr-only">{copy.opensPdf}</span>
              </a>
              <p>
                {copy.tableLabel} {report.sourceTable} · {copy.printedPageLabel} {report.printedPage} (
                {copy.pdfPageLabel} {report.pdfPage})
              </p>
            </dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.sourceOwnerLabel}</dt>
            <dd className="min-w-0 text-muted">{report.sourceOwner}</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-ink">{copy.reviewLabel}</dt>
            <dd className="min-w-0 text-muted">
              <time dateTime={report.reviewedOn}>{reviewedDate}</time>
              <p>{copy.reviewNote}</p>
            </dd>
          </div>
        </dl>
      </details>
    </section>
  );
}
