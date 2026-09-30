import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Bangwit · Offline</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">Mahina o walang signal</h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Hindi ma-load ang pahinang ito ngayon. Ang mga tala ng huli mo ay nasa device mo.
      </p>
      <Link
        href="/catches"
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal px-5 font-bold text-white hover:bg-teal-dark"
      >
        Puntahan ang My Catches
      </Link>
    </main>
  );
}
