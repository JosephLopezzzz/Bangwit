import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal">Bangwit prototype · draft</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">Privacy Notice</h1>
      <p className="mt-2 text-sm text-muted">Huling inayos: Setyembre 30, 2026 · para sa local prototype</p>
      <div className="mt-7 space-y-6 rounded-3xl border border-line bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm sm:p-8">
        <section>
          <h2 className="font-extrabold text-ink">Anong impormasyon ang mase-save</h2>
          <p className="mt-2">
            Kapag nag-log ka ng huli, maaaring itago ng browser ang pangalan ng species, petsa, uri ng tubig, opsyonal
            na spot label, haba, timbang, pain, notes, catch status, at larawan. Opsyonal ang location field at ikaw ang
            naglalagay nito. Hindi kinukuha ng prototype ang GPS.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">Saan ito naka-save</h2>
          <p className="mt-2">
            Nasa lokal na storage ng browser ang catch log at photos ng device na ginagamit mo. Walang Bangwit account,
            cloud upload, o sync sa prototype. Ang Terms acknowledgment at optional preferences ay naka-save rin
            locally.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">Pagbabahagi at access</h2>
          <p className="mt-2">
            Walang community feed o public sharing sa build na ito. Ang sinumang may access sa browser profile at device
            na iyon ay maaaring makakita ng local data. Hindi awtomatikong nagbibigay ang browser storage ng encryption
            o hiwalay na account protection. Gumamit ng screen lock at huwag mag-log ng sensitibong lokasyon kung ayaw
            mong naroon ito.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">Pag-backup, pag-export, at pagbura</h2>
          <p className="mt-2">
            Maaari kang gumawa ng backup sa Settings. Kasama rito ang catch details, photo bytes, at optional na
            location text. Ingatan ang na-download na file. Maaari mo ring i-restore ito sa empty Bangwit journal o
            burahin ang local Bangwit data sa Settings. Ang browser data clearing o storage eviction ay maaari ring
            magtanggal ng records.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">Pagbabago sa data handling</h2>
          <p className="mt-2">
            Kung magdagdag sa hinaharap ng accounts, analytics, sharing, cloud sync, o external service, kailangang
            baguhin at ipaliwanag muna ang notice at kumuha ng angkop na consent. Ang pagtanggap sa prototype notice na
            ito ay hindi pahintulot para sa future cloud uploads.
          </p>
        </section>
        <section>
          <h2 className="font-extrabold text-ink">Limitasyon</h2>
          <p className="mt-2">
            Draft lang ang notice na ito para sa prototype. Kailangan itong ipa-review at palitan ng final notice na
            tumutugma sa aktuwal na data practices bago ilunsad sa publiko.
          </p>
        </section>
      </div>
      <Link href="/terms" className="mt-5 inline-flex min-h-11 items-center font-bold text-teal hover:text-teal-dark">
        Basahin ang Terms of Use →
      </Link>
    </main>
  );
}
