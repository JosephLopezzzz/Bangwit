# Bangwit

Next.js, TypeScript, and Tailwind CSS remake for the Cavite pilot. The UI, local catch journal, collection, onboarding, first-use guide, draft policy gate, and local backup/restore flow are in place. Verified species coverage, legal guidance, live alerts, and fully tested offline reload behavior are not available yet.

## Local development

Use Node.js 22.6 or newer to run the storage test script.

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

`test:offline` checks the actual Serwist manifest configuration, including document updates between releases and exclusion of source/private files. These checks do not prove browser offline behavior. The production build, whole-app lint and focused policy-dialog checks pass. Follow [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md) for the recorded evidence and the remaining reload, reconnect, device and upgrade checks.

## Historical research records

The Species page has a separate bilingual historical-record section with 12 reviewed CC0 museum specimens. The research adapter excludes the rejected locality, preserves unknown and month-only collection dates, and cross-checks taxonomy, provenance, licenses and locality-review states before writing the browser-facing snapshot. These records are not a current species list or fishing advice. No API key or live provider request is needed to read the snapshot.

The historical-record section has working name, source-locality, and dated/undated filters, with combined filtering, reset, separate record/species counts, and an explicit no-match state. Water-type and conservation-status filters remain disabled until reviewed values are available. The page also includes two bilingual, source-linked study examples for fish diet; neither is a Cavite diet survey or evidence of local presence, and bait/catching advice remains unverified. The research-only ledger at `data/research/obis/cavite/cavite-obis-fish-candidate-review.csv` records 27 candidate names / 52 linked occurrences: 12 currently published records, 1 excluded occurrence, and 39 pending review. Pending rows are not added to the public evidence snapshot.

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
