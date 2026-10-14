"use client";

import { useBangwit } from "@/components/bangwit-provider";

export default function OfflinePage() {
  const { dict } = useBangwit();

  return (
    <main className="ui-page ui-page--narrow text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{dict.offline.tag}</p>
      <h1 className="ui-page-title mt-2">{dict.offline.title}</h1>
      <p className="mx-auto mt-3 max-w-prose text-sm leading-6 text-muted">{dict.offline.desc}</p>
      {/* Request the precached document even when no router payload was warmed online. */}
      <a href="/catches" className="ui-button mt-5">
        {dict.offline.catchesBtn}
      </a>
    </main>
  );
}
