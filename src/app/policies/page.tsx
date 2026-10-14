"use client";

import { TriangleAlert } from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import { PolicyDocument } from "@/components/policy-document";

export default function PoliciesPage() {
  const { dict, lang } = useBangwit();
  const reviewNotice = dict.privacyPage.reviewNotice;

  return (
    <main className="ui-page ui-page--wide">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">{dict.settings.policiesTag}</p>
        {lang === "en" && reviewNotice && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {reviewNotice}
          </span>
        )}
      </div>

      <h1 className="ui-page-title mt-2">{dict.policy.title}</h1>
      <p className="mt-1 text-sm text-muted">{dict.policy.desc}</p>

      {lang === "en" && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
          <strong>Notice:</strong> This English translation is provided as a working convenience for prototype testing.
          Formal legal review is required before public launch.
        </div>
      )}

      <PolicyDocument privacy={dict.privacyPage} terms={dict.termsPage} className="ui-card mt-5" />
    </main>
  );
}
