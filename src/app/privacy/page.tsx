"use client";

import Link from "next/link";
import { useBangwit } from "@/components/bangwit-provider";

export default function PrivacyPage() {
  const { dict, lang } = useBangwit();
  const page = dict.privacyPage;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{page.tag}</p>
        {lang === "en" && page.reviewNotice && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            ⚠️ {page.reviewNotice}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">{page.title}</h1>
      <p className="mt-2 text-sm text-muted">{page.lastUpdated}</p>

      {lang === "en" && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950">
          <strong>Notice:</strong> This English translation is provided as a working convenience for prototype testing.
          Formal legal review is required before public launch.
        </div>
      )}

      <div className="mt-7 space-y-6 rounded-3xl border border-line bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm sm:p-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-extrabold text-ink">{section.heading}</h2>
            <p className="mt-2">{section.content}</p>
          </section>
        ))}
      </div>

      <Link href="/terms" className="mt-5 inline-flex min-h-11 items-center font-bold text-teal hover:text-teal-dark">
        {page.termsLink}
      </Link>
    </main>
  );
}
