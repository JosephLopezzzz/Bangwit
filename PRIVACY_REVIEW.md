# Source-level privacy review

Reviewed 15 October 2026. This is a source review of the current local-first catch flow, not a production network-capture audit or legal approval of the draft policies.

The map-warning extension adds a same-origin GET to /api/advisories with credentials omitted. Only a public warning snapshot is cached under bangwit.public-advisories.v1; catch/profile/spot/GPS data is not included in that request or the configured server-side publisher fetch. The new cache is excluded from catch backups and removed by Settings erasure. Live ingestion remains disabled pending source review. These additions were not part of the earlier browser/production traffic captures below; see [MAP_ADVISORIES.md](docs/MAP_ADVISORIES.md) for their contract and remaining acceptance.

## October 15 map-release follow-up (partial)

The verified application source is `43718d6`; documentation-only checkpoint `6143041` was observed Ready as Production deployment `7wYKjmJ6D19SVS9oBjGUps95npgo` and protected Preview deployment `3RGietzLktomWKEyhfccXdAseuMv`. The public Production hosting checker passed. Direct HTTP GETs to the Production alias returned `/api/advisories` as 503 `unavailable` / `not_configured` with `Cache-Control: no-store, max-age=0`, and `/serwist/sw.js` as 200 JavaScript with root scope and the expected no-cache update headers. These are HTTP endpoint results, not a browser traffic capture.

The existing Brave profile loaded the Preview branch alias with zero catches, then exercised the hosted map's fictional warning demonstration, panel/zoom controls, light/dark rendering and desktop/mobile viewport layouts. The demo was exited afterward. The supported CDP observer again refused `Network.enable` while a document response was paused; no Preview request methods/bodies, current worker control, or offline/reconnect behavior were established. Unauthenticated Preview API/worker GETs returned 302 to Vercel protection. Access protection remained enabled. The current map/advisory requests therefore remain outside the earlier Production catch/backup traffic evidence. Host/CDN logs, physical-device advisory behavior and installed-app acceptance also remain open. See [STAGING_ACCEPTANCE.md](STAGING_ACCEPTANCE.md) for exact release identities and the remaining browser workflow.

## Findings

- `src/lib/storage/catches.ts` stores catch entries in the browser's IndexedDB database `bangwit-local`, object store `catches`. The storage module contains no network request code.
- The settings flow calls the storage module only after the user chooses backup or restore. Backup serializes catch details and photos into a JSON file for download; restore reads a user-selected file and writes it to local IndexedDB.
- `src/components/bangwit-provider.tsx` stores the profile and policy acknowledgment in browser `localStorage`.
- The Species page reads the checked-in historical evidence snapshot. No live species-data request is made by that page.
- `src/app/sw.ts` precaches app assets and uses Serwist's general runtime cache. It does not define a catch-sync endpoint or a catch-data upload route.
- A source search for `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `axios`, and common analytics markers found three request sites, all in scripts: the staging checker and two research-data fetch scripts. The scan found no browser-runtime analytics integration or catch-data request in the searched `src` and `scripts` trees.

The observed implementation supports the current local-storage and no-cloud-sync wording for catch records. A user-created backup is a separate file containing private catch details and photos; users should protect it and choose where it is stored.

## Limits and follow-up

## Isolated browser traffic check

Run on 15 October 2026 against the current local production build, served at `http://127.0.0.1:4184`. Playwright used a fresh, disposable Microsoft Edge 155.0.4283.45 browser context. The app's service worker controlled both isolated origins before any catch action: `127.0.0.1:4184` and `localhost:4184`.

On the first origin, the test accepted the prototype notice, skipped optional profile setup and the tour, saved one synthetic catch with an SVG test image, opened its details, and downloaded a backup. On the second empty origin, it accepted the notice, restored that backup, and confirmed the catch appeared with one IndexedDB record. It then erased the synthetic journal from both origins and verified each IndexedDB store contained zero records. No real profile or catch data was used.

The browser context emitted 654 request events while visiting routes, loading the service worker, and exercising the flow. After excluding the two local test origins, local `blob:` image URLs, and Edge's own `edge://downloads-hub` download UI, **zero external HTTP(S) requests were observed**. The run recorded zero browser console errors and zero page errors. The download UI and blob URLs are browser-local activity, not requests to a third-party host.

This evidence applies to this local build and these test origins only. It does not inspect the deployed site's traffic, hosting/CDN logs, browser extensions, browser-level telemetry, other Edge profiles, or a physical phone. It also does not establish that the draft policies are legally approved. A partial Preview UI round-trip is recorded below; a Preview request capture remains necessary before making a deployed traffic claim.

## Production-origin HTTPS synthetic traffic check

Run on October 15, 2026 against `https://bangwit.vercel.app/`, the Vercel Production alias for deployment `A74x3ZMLJMAjQ8ZhxiMcFeEWELYK` and commit `8dd97f3c425cabc4f4b71a96259fda83325bb427` (Ready). The supplied hostname was Production, not Preview.

Microsoft Edge 155.0.4283.45 used two fresh isolated browser contexts. The first began with an empty journal, saved one synthetic catch with a 68-byte PNG, and downloaded a version 1 JSON backup with one record and the same photo bytes. The second began empty, restored that backup, and showed one record with the 68-byte photo in IndexedDB and one catch in the journal UI. No real catch data was used. The service worker at `/serwist/sw.js` activated and controlled the page after an online reload.

The DevTools capture recorded 160 browser-visible HTTP(S) request events across page and service-worker sessions. All requests targeted the supplied origin and used GET; none had request bodies, none used a write method, and no external HTTP(S) origin appeared. The response statuses observed were 200. The capture does not include Vercel server/CDN logs or browser-level telemetry.

The October 15, 2026 read-only hosting checker also passed against this Production alias. It verified the journal and fallback documents, service-worker scope/update headers and references, manifest, and icon dimensions; it did not inspect browser traffic or storage.

This confirms the tested Production-origin flow only. It does not establish Preview request methods/bodies, physical-phone/installed-app acceptance, or legal review of the prototype policies.

## Protected Preview UI round-trips (partial)

Run on October 15, 2026 against Vercel Preview deployment `8xbXUrGUrW7fwSMH1StvRUdzmtJL`, Ready for commit `6a8814950884b1c55fbd35c6f5ec049af298f2df` on `codex/https-preview-20261015`: `https://bangwit-38a0tqos7-josephlopezzzzs-projects.vercel.app/`. The app source is unchanged from the Production-tested commit `8dd97f3`; the intervening commit contains only documentation changes.

In a fresh Preview origin in the user's Brave browser session, the test accepted the prototype notice, skipped optional setup and the tour, and saved one synthetic catch with a 69-byte PNG, `50 cm`, `1000 g`, and clearly synthetic location/note values. The journal showed one catch with an image entry. Settings created `bangwit-catches-2026-10-15.json` (876 bytes), which parsed as `format: bangwit-catches`, version 1, with exactly one record. The embedded photo decoded to 69 bytes and its SHA-256 matched the synthetic PNG selected in the form. The file was located by its expected app filename and matching timestamp in the local Downloads folder after the browser download event did not expose a path. The source catch was deleted afterward and the Preview journal returned to zero.

A second empty origin, the Vercel branch alias `https://bangwit-git-codex-https-preview-bc9472-josephlopezzzzs-projects.vercel.app/`, was tested in the same Brave profile. The earlier Production-generated synthetic backup restored one catch there; Settings reported one record, and the journal showed the synthetic catch and image entry. In a later run, the Preview-generated file described above also restored one catch on the branch alias. In both runs, the row was deleted and the journal returned to zero. This verifies restore across distinct origins in the same browser profile, not across browser contexts. No real catch data was used.

The read-only staging checker received `302` for `/catches`. Separate unauthenticated GETs to `/`, `/~offline`, `/manifest.webmanifest`, and `/serwist/sw.js` also returned `302` redirects to Vercel SSO; the interactive Brave session could load both Preview app origins. No access protection was bypassed. The isolated Edge launch was blocked by policy. A supported Brave CDP capability later refused instrumentation while the document response was paused, so Preview HTTP(S) methods and bodies still were not captured. The service worker was not registered after an online reload, and direct browser navigation to `/serwist/sw.js` was blocked as `ERR_BLOCKED_BY_CLIENT`; service-worker control and external-origin traffic remain unverified.

These are Preview UI results only. Keep the Production traffic result bounded to Production, and do not claim the Preview's network behavior from these partial runs.

## Draft policy review (15 October 2026)

This is a technical content review of the English and Filipino prototype drafts in `src/i18n/dictionaries/en.ts` and `src/i18n/dictionaries/fil.ts`. It is not a legal opinion or a determination that the Data Privacy Act applies to a particular operator. The drafts correctly describe device-local catch records, manual optional location text, no GPS, no account or catch sync, shared-browser-profile access, and the private JSON/photo backup. These statements match the reviewed client storage and backup code. The app is hosted on Vercel, however, and the notice does not describe ordinary hosting request metadata or identify the hosting provider as a potential recipient/processor. Vercel documents request/runtime logging and plan-dependent retention; the project's actual plan, log settings, retention, and any log drains were not verified. Confirm those operational facts before revising the notice, and state clearly that catch records/photos stay local while explaining any separate hosting metadata processing.

The National Privacy Commission's right-to-be-informed guidance lists the information a notice should cover, including the data, purposes, processing basis where consent is not used, scope/method, recipients, controller identity/contact, retention period, and data-subject rights. The current notice covers categories, local storage, sharing, backups, and future changes, but does not name the operator/controller or provide a privacy contact, describe purposes and applicable processing basis, give a defined retention rule for hosting metadata, or explain how a user can exercise rights or complain. The operator and counsel/DPO should decide what applies and complete those sections before public launch. See the [NPC right-to-be-informed guidance](https://privacy.gov.ph/the-right-to-be-informed/), [Data Privacy Act](https://privacy.gov.ph/data-privacy-act-/), and [Vercel runtime-log documentation](https://vercel.com/docs/logs/runtime).

The English and Filipino drafts also need a translation consistency pass. The English Terms omit the flood-alert and protected-area-authority references present in Filipino; the Filipino Terms include diet recommendations while English mentions bait recommendations; and the English backup paragraph does not explicitly name the optional location text that the Filipino notice says is included. The Filipino pages identify the documents as drafts, but the more prominent English-only legal-review banner has no Filipino counterpart. Align the statements and review banner in both languages. Keep the Terms review with counsel for operator identity, effective date/version, support/contact route, permitted use, and appropriate warranty/liability and dispute wording; these are open drafting decisions rather than findings of legal noncompliance.

This initial review did not change the user-facing policy text. The prototype label and requirement for formal legal review remain in place.

## Draft parity update (17 October 2026)

Updated the user-facing English and Filipino drafts to align their scope for flood/protected-area warnings, diet and method information, local catch/photo storage, backup contents, and future services. Added an explicit bilingual warning that operator/contact details and hosting-provider request-metadata/log handling are incomplete and need confirmation. The policy page now shows its draft/legal-review notice in both languages. `POLICY_VERSION` is now `prototype-4`, so a prior acceptance of the old draft does not silently count as review of these revised draft notices. This version change only gates app access; it does not clear or migrate catch records, photos, preferences, or backups.

This is a technical wording/parity update, not formal legal review. The public operator/contact, processing purposes and basis, hosting plan/settings, log retention/recipients, data-subject request process, effective policy date, and final liability/dispute terms remain unresolved. The drafts must not be presented as legally approved or used as final public notices until the responsible operator and a qualified reviewer confirm those facts and wording.

## Pilot contact decision (17 October 2026)

The project owner chose to keep the personal email address used for the NAMRIA data inquiry private. It is not approved as the app's or pilot notice's public privacy/support contact and must not be copied into project materials. A project-specific public contact remains unassigned. This decision does not change the app's policy text or authorize recruitment; the pilot notice remains unapproved pending operator, contact, storage, retention, hosting and reviewer decisions.

## Runtime request-source update (17 October 2026)

A follow-up source inspection found two runtime `fetch` call sites in the application: the map client requests the same-origin `/api/advisories` route on page entry, while visible, and after reconnect; the server route fetches a configured HTTPS advisory publisher only when both server-side feed settings enable reviewed live mode. The browser request omits credentials and contains no catch, profile, spot-label or GPS fields. Its accepted public snapshot is cached in localStorage under the public-advisory key. The service worker uses `NetworkOnly` for this route, so advisory responses are not placed in its general runtime cache. Catch entries and photos continue to use local IndexedDB and the backup flow; no catch-upload route was found in this source inspection.

This corrects the earlier source-search wording above: the app does have an advisory runtime request; the earlier statement that request sites were only in scripts described the pre-advisory request inventory and should not be read as current. User-clicked source links can still navigate to third-party sites. These source facts do not verify current Production environment settings, deployed behavior for the latest commit, browser/network-provider telemetry, or Vercel/CDN request logs and retention. The local Vercel CLI is not installed and this checkout has no linked Vercel project, so account-level hosting and log settings could not be inspected here. Keep hosting recipients and retention unresolved in the notice until the project owner verifies them in the hosting account.
