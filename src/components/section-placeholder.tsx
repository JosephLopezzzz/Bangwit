import Link from "next/link";

export function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <main className="ui-page">
      <header className="ui-page-header">
        <h1 className="ui-page-title">{title}</h1>
        <p className="max-w-[75ch] leading-relaxed text-muted">{description}</p>
      </header>
      <div className="ui-card">
        <p className="font-semibold text-ink">Inihahanda ang bahaging ito</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Dito itutuloy ang napagkasunduang features. Wala pang verified na species, legal na payo, o live na datos sa
          prototype.
        </p>
        <Link href="/" className="ui-button mt-4">
          Bumalik sa Explore
        </Link>
      </div>
    </main>
  );
}
