"use client";

import { TriangleAlert } from "lucide-react";
import { PolicyDocument } from "@/components/policy-document";
import { useBangwit } from "@/components/bangwit-provider";

export default function PoliciesPage() {
  const { dict, lang } = useBangwit();
  const reviewNotice = dict.privacyPage.reviewNotice;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.settings.policiesTag}</p>
        {lang === "en" && reviewNotice && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {reviewNotice}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">{dict.policy.title}</h1>
      <p className="mt-2 text-sm text-muted">{dict.policy.desc}</p>

      {lang === "en" && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950">
          <strong>Notice:</strong> This English translation is provided as a working convenience for prototype testing.
          Formal legal review is required before public launch.
        </div>
      )}

      <PolicyDocument
        privacy={dict.privacyPage}
        terms={dict.termsPage}
        className="mt-7 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8"
      />
    </main>
  );
}
