"use client";

import Link from "next/link";
import { useBangwit } from "@/components/bangwit-provider";

export default function OfflinePage() {
  const { dict } = useBangwit();

  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{dict.offline.tag}</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">{dict.offline.title}</h1>
      <p className="mt-4 text-base leading-7 text-muted">{dict.offline.desc}</p>
      <Link
        href="/catches"
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal px-5 font-bold text-white hover:bg-teal-dark"
      >
        {dict.offline.catchesBtn}
      </Link>
    </main>
  );
}
