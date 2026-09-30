import Link from "next/link";

export function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Bangwit · Cavite pilot</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{description}</p>
      <div className="mt-10 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-ink">Inihahanda ang bahaging ito</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Dito itutuloy ang napagkasunduang features. Wala pang verified na species, legal na payo, o live na datos sa
          prototype.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-teal px-5 font-bold text-white hover:bg-teal-dark"
        >
          Bumalik sa Explore
        </Link>
      </div>
    </main>
  );
}
