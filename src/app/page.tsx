import Image from "next/image";
import Link from "next/link";
import { AreaExplorer } from "@/components/area-explorer";

export default function ExplorePage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-9 sm:px-8 sm:pt-12 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Cavite · CALABARZON</p>
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">
          <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
          Pilot data under review
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
        Saan tayo mangingisda?
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-7 text-muted sm:text-xl">
        Pumili ng lugar at alamin ang katubigan ng Cavite.
      </p>

      <AreaExplorer />

      <section
        className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="safetyHeading"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Bago bumiyahe</p>
            <h2 id="safetyHeading" className="mt-1 text-xl font-extrabold text-ink">
              Safety at advisories
            </h2>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">Hindi live</span>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">
          Wala pang live na PAGASA weather/flood feed o BFAR shellfish bulletin. Hindi ito nangangahulugang walang
          babala o ligtas bumiyahe; tingnan muna ang opisyal na abiso para sa napiling lugar.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-teal">
          <a href="https://bagong.pagasa.dost.gov.ph/products-and-services" target="_blank" rel="noreferrer">
            PAGASA advisories ↗
          </a>
          <a href="https://www.bfar.da.gov.ph/red-tide-archives/" target="_blank" rel="noreferrer">
            BFAR red tide ↗
          </a>
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-4 rounded-3xl border border-line bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:px-6">
        <picture className="h-20 w-20 shrink-0">
          <source srcSet="/assets/bilog.png" media="(prefers-reduced-motion: reduce)" />
          <Image
            src="/assets/bilog-idle-blink-slow-right.gif"
            alt="Si Bangwit, mabagal na lumalangoy pakanan."
            width={96}
            height={96}
            unoptimized
            className="h-20 w-20 object-contain"
          />
        </picture>
        <div className="flex-1">
          <h2 className="font-bold text-ink">Simulan ang kuwento ng mga huli mo</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Kapag bukas na ang journal, mase-save ang catch sa device kahit walang signal.
          </p>
        </div>
        <Link
          href="/catches"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-teal px-5 font-bold text-teal hover:bg-teal-soft"
        >
          Buksan ang My Catches
        </Link>
      </section>
      <footer className="mt-5 flex flex-col gap-1 border-t border-line pt-4 text-xs leading-5 text-muted sm:flex-row sm:justify-between">
        <span>Bangwit prototype · Cavite pilot</span>
        <span>Hindi pa verified ang map boundaries, species, rules, at live alerts.</span>
      </footer>
    </main>
  );
}
