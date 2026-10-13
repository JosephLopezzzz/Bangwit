"use client";

import { ArrowUpRight, ChevronDown, Info, Layers, Search } from "lucide-react";
import { useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import guides from "@/data/feeding-guides.json";
import { filterFeedingGuides } from "@/lib/species-research";

const foodCategories = ["fish", "crustaceans", "insects", "mollusks", "algae", "plant-material", "detritus"] as const;

export function FeedingGuides() {
  const { dict, lang } = useBangwit();
  const copy = dict.feedingGuides;
  const [query, setQuery] = useState("");
  const [foodCategory, setFoodCategory] = useState("all");
  const filtered = filterFeedingGuides(guides.taxa, { query, foodCategory });
  const summary = copy.resultsSummary.replace("{count}", String(filtered.length));
  const reviewedAt = new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(guides.reviewedAt));

  return (
    <section
      className="mt-5 rounded-2xl border border-line bg-white px-5 py-5 sm:px-6"
      aria-labelledby="feeding-guides-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="feeding-guides-title" className="text-xl font-bold leading-snug text-ink">
            {copy.title}
          </h2>
          <p className="mt-2 max-w-[75ch] text-sm leading-6 text-muted">{copy.description}</p>
        </div>
        <span className="rounded-full bg-teal-soft px-3 py-2 text-xs font-semibold text-teal">
          {copy.reviewDateLabel}: <time dateTime={guides.reviewedAt}>{reviewedAt}</time>
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(220px,1fr)_minmax(220px,0.8fr)]">
        <label className="relative block min-w-0">
          <span className="sr-only">{copy.searchLabel}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="min-h-12 w-full rounded-xl border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-slate-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal"
          />
        </label>
        <div className="min-w-0 text-xs font-semibold text-muted">
          <span className="block">{copy.foodFilterLabel}</span>
          <DropdownSelect
            id="feeding-food-category"
            label={copy.foodFilterLabel}
            value={foodCategory}
            onValueChange={setFoodCategory}
            className="mt-1"
            options={[
              { value: "all", label: copy.allFoods, icon: Layers },
              ...foodCategories.map((category) => ({
                value: category,
                label: copy.foodGroups[category],
                icon: Layers,
              })),
            ]}
          />
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold text-ink" aria-live="polite">
        {summary}
      </p>

      {filtered.length ? (
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {filtered.map((guide) => (
            <li key={guide.aphiaId} className="py-5">
              <article aria-labelledby={`feeding-guide-${guide.aphiaId}`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 id={`feeding-guide-${guide.aphiaId}`} className="text-lg font-bold text-ink">
                    {guide.commonName[lang]}
                  </h3>
                  <span className="text-sm text-muted">
                    <i>{guide.scientificName}</i>
                  </span>
                  <a
                    href={guide.taxonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-teal underline underline-offset-4 hover:text-teal-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal"
                  >
                    WoRMS {guide.aphiaId}
                    <ArrowUpRight aria-hidden="true" size={13} />
                    <span className="sr-only">{dict.historicalEvidence.opensTab}</span>
                  </a>
                </div>
                <p className="mt-3 max-w-[85ch] text-sm leading-6 text-ink">{guide.summary[lang]}</p>
                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">{copy.studyContextLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{guide.studyContext[lang]}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">{copy.foodsLabel}</p>
                  <ul className="mt-2 flex flex-wrap gap-2" aria-label={copy.foodsLabel}>
                    {guide.foods.map((food) => (
                      <li
                        key={`${food.category}-${food.en}`}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink"
                      >
                        {food[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
                <details className="group mt-3 border-t border-line">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal [&::-webkit-details-marker]:hidden">
                    {copy.sourcesLabel}
                    <ChevronDown aria-hidden="true" size={17} className="shrink-0 group-open:rotate-180" />
                  </summary>
                  <ul className="grid gap-3 pb-1">
                    {guide.sources.map((source) => (
                      <li key={source.url} className="text-sm leading-6 text-muted">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-teal underline underline-offset-4 hover:text-teal-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal"
                        >
                          {source.title}
                          <ArrowUpRight aria-hidden="true" size={14} className="ml-1 inline" />
                          <span className="sr-only">{dict.historicalEvidence.opensTab}</span>
                        </a>
                        <p className="mt-1">{source.citation}</p>
                        <p className="text-xs">{source.locator}</p>
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl bg-teal-soft px-4 py-4 text-sm text-muted" role="status">
          {copy.noMatches}
        </p>
      )}

      <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">
        <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong>{copy.baitPendingTitle}.</strong> {copy.baitPendingDesc}
        </p>
      </div>
    </section>
  );
}
