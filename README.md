# Bangwit

Next.js, TypeScript, and Tailwind CSS remake for the Cavite pilot. The UI, local catch journal, collection, onboarding, first-use guide, draft policy gate, and local backup/restore flow are in place. Offline behavior has scoped desktop evidence, and the user reported a phone pass in online and offline modes on October 15; device, browser, and installed-app details were not recorded. Current species coverage, legal guidance and live alerts remain unverified.

## Local development

Use Node.js 24.x, matching the deployment engine.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. The older prototype remains at `../bangwit` and uses separate browser storage because its origin and port differ.

## Checks

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run test:storage
npm run test:evidence
npm run test:offline
npm run build
npm run start
```

The old prototype at `http://127.0.0.1:4173` and this remake at `http://localhost:4174` have separate browser storage. To migrate existing catches, open `http://127.0.0.1:4173/migration.html` on the old origin, download its private JSON backup, then restore it from Settings in the remake while the remake's journal is empty. The backup contains photos and optional spot labels; keep it private. Do not clear the old browser data until the restored entries and images have been checked.

The policy pages are drafts for the prototype, not final legal advice. The app does not need API credentials for these local features. Never put private keys in a `NEXT_PUBLIC_` variable.

## Offline readiness

The service worker is configured to precache the catch journal and offline fallback, with document revisions derived from source and asset changes. Reconnecting no longer triggers an automatic page reload, so the open form is not deliberately discarded. The fallback's journal button requests the cached HTML directly.

`test:offline` checks the actual Serwist manifest configuration, including document updates between releases and exclusion of source/private files. Recorded desktop testing covers offline save/reload with a synthetic photo, cached navigation/fallback, backup/restore, fresh-origin controlled reload and a rebuild upgrade. Reconnect coverage is partial; a new browser profile and exhaustive outbound-traffic review remain pending. The October 15 phone pass was user-reported, but its device, browser, and installed-app details were not recorded. See [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md) for the scope of each result.

The source-level privacy review and isolated local browser traffic check for catch and backup flows are documented in [PRIVACY_REVIEW.md](PRIVACY_REVIEW.md). A deployed-origin/CDN traffic check remains open.

For HTTPS Preview deployment settings and the hosting checker, follow [STAGING_ACCEPTANCE.md](STAGING_ACCEPTANCE.md). The hosted-origin check passed at `https://bangwit.vercel.app/`; its deployed commit ID and a fully detailed phone record remain unverified.

## Historical research records

The Species page has a separate bilingual historical-record section with 12 reviewed CC0 museum specimens. The research adapter excludes the rejected locality, preserves unknown and month-only collection dates, and cross-checks taxonomy, provenance, licenses and locality-review states before writing the browser-facing snapshot. These records are not a current species list or fishing advice. No API key or live provider request is needed to read the snapshot.

The historical-record section has working name, source-locality, and dated/undated filters, with combined filtering, reset, separate record/species counts, and an explicit no-match state. Water-type and conservation-status filters remain disabled until reviewed values are available. The page also includes two bilingual, source-linked study examples for fish diet; neither is a Cavite diet survey or evidence of local presence, and bait/catching advice remains unverified. The research-only ledger at `data/research/obis/cavite/cavite-obis-fish-candidate-review.csv` records 27 candidate names / 52 linked occurrences: 12 currently published records, 2 excluded occurrences, and 38 pending review. Four pending rows carry durable Smithsonian curator holds; one National Museum occurrence has been excluded for missing locality. Pending rows are not added to the public evidence snapshot.

To rebuild the candidate-review ledger after updating its inputs:

```powershell
node scripts/build-cavite-fish-candidate-review.mjs
```

After reviewing changes to the existing OBIS research inputs, regenerate and verify with:

```powershell
node scripts/build-cavite-historical-evidence.mjs
npm run test:evidence
```

Tests compare the checked-in JSON with the reviewed inputs, so stale output fails the check. Repeat the source and locality review when refreshing data; passing the adapter does not establish present-day presence or fishing permission.
