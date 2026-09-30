import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Bangwit prototype · draft</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted">Huling inayos: Setyembre 30, 2026 · para sa local prototype</p>
      <div className="mt-7 space-y-6 rounded-3xl border border-line bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm sm:p-8">
        <section>
          <h2 className="font-extrabold text-ink">1. Prototype lamang</h2>
          <p className="mt-2">
            Ang Bangwit build na ito ay pang-testing ng interface at local catch journal. Hindi pa verified ang species
            records, fishery boundaries, access points, fishing rules, closed seasons, protected-species guidance, diet
            o bait recommendations, weather, flood, at red-tide alerts.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">2. Huwag gawing batayan ng kaligtasan o legal na desisyon</h2>
          <p className="mt-2">
            Walang impormasyon sa prototype na garantiya na legal o ligtas mangisda, na puwedeng hulihin ang isang
            species, o na ligtas kainin ang isang catch. Tingnan ang kasalukuyang abiso ng BFAR, PAGASA, LGU,
            protected-area authorities, at iba pang kaukulang ahensiya. Sa panganib o aksidente, makipag-ugnayan agad sa
            lokal na emergency services.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">3. Personal na tala</h2>
          <p className="mt-2">
            Ikaw ang responsable sa katumpakan ng mga impormasyong inilagay mo sa personal na catch log. Mananatili ang
            log sa browser storage ng device na ito at hindi awtomatikong ia-upload o isi-sync sa Bangwit server. Maaari
            itong mawala kapag binura o na-evict ang browser data.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">4. Walang garantiya ng serbisyo</h2>
          <p className="mt-2">
            Maaaring magbago o hindi gumana ang prototype at maaaring wala itong internet o offline access sa ilang
            oras. Huwag umasa rito bilang navigation, emergency communications, o real-time advisory service.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">5. Mga pagbabago at susunod na serbisyo</h2>
          <p className="mt-2">
            Maaaring magbago ang mga tuntunin kapag nagdagdag ng verified data, accounts, sharing, o cloud sync. Hihingi
            ng hiwalay at malinaw na impormasyon at consent bago magproseso ng datos sa bagong paraan. Ang draft na ito
            ay hindi kapalit ng legal review bago public launch.
          </p>
        </section>
      </div>
      <Link href="/privacy" className="mt-5 inline-flex min-h-11 items-center font-bold text-teal hover:text-teal-dark">
        Basahin ang Privacy Notice →
      </Link>
    </main>
  );
}
