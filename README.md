# Bangwit

**Status: In progress.** The current expansion roadmap is the [Philippines species expansion plan](docs/PHILIPPINES_SPECIES_EXPANSION_PLAN.md). The [Cavite data and pilot implementation plan](docs/CAVITE_PILOT_IMPLEMENTATION_PLAN.md) documents the existing first pilot.

Bangwit is an in-progress, Philippines-wide waterbody discovery and personal catch-journaling project. Its intended fish coverage spans regions across Luzon, Visayas, and Mindanao, and freshwater, brackish, and marine waters. National research and regional coverage are being expanded in phases.

The current Next.js, TypeScript, and Tailwind CSS prototype remains a Cavite pilot. Its UI, local catch journal, collection, onboarding, first-use guide, draft policy gate, and local backup/restore flow are in place. Nationwide species coverage is not complete, and the app does not yet provide verified nationwide fishing rules or live safety alerts. The user reports that all planned acceptance tests passed, including the dropdown retest and mobile checks. Earlier, they reported online/offline and photo-draft reconnect passes on a personal Tecno phone in a browser tab at `https://bangwit.vercel.app/`. Exact phone model, OS, browser/version, tested commit and case-by-case results remain unrecorded.

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

`test:offline` checks the actual Serwist manifest configuration, including document updates between releases and exclusion of source/private files. Recorded desktop testing covers offline save/reload with a synthetic photo, cached navigation/fallback, backup/restore, fresh-origin controlled reload and a rebuild upgrade; desktop O3 reconnect coverage remains partial. The user reports that all planned acceptance tests passed, including mobile, dropdown and installed home-screen checks. Their earlier Tecno browser-tab report said an unsaved synthetic photo catch with `7 in`, `2 lbs` and test notes survived reconnect without a reload, and one Save added exactly one entry. Exact device, browser/version, tested commit and case-by-case results were not provided. A current-release Preview traffic capture is not in the recorded evidence; see [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md) for the scope and limits of each result.

The source-level privacy review, isolated local browser traffic check and earlier Production-origin synthetic catch/backup traffic run are documented in [PRIVACY_REVIEW.md](PRIVACY_REVIEW.md). A current-release Preview request capture and host/CDN review are not recorded; this is an evidence gap, separate from the user's report that all planned functional acceptance tests passed. The earlier Production traffic result does not verify the latest worker's offline or reconnect behavior.

For HTTPS Preview deployment settings and the hosting checker, follow [STAGING_ACCEPTANCE.md](STAGING_ACCEPTANCE.md). On October 15, the public hosting check passed at `https://bangwit.vercel.app/`, observed on Ready Production application commit `43718d65e2c4e1a75346529457365e7288749480`. Local production build, TypeScript, storage (2/2), offline (5/5) and advisory (20/20) checks passed for that application source; commit `6143041` changes documentation only. The deployed advisory API correctly returned HTTP 503 `unavailable` / `not_configured`. The user reports that all planned acceptance tests passed, including mobile. A current-release Preview request capture is absent from the recorded evidence. See [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md) for the build and scope.

## Map warning preview

Explore includes an opt-in **Preview warning layer** with fictional Cavite, Batangas and Laguna examples. The scenario menu previews overlapping warnings, stale/expired last-known alerts and a checked empty state on a fixed 1 January 2026 timeline. Exit preview returns to actual feed availability.

Live warnings are **not enabled**. The normalized server ingestion endpoint, strict geography/source validation, freshness handling and public snapshot cache are in place. A reviewed publisher/adapter, its update schedule and production acceptance remain required. See [MAP_ADVISORIES.md](docs/MAP_ADVISORIES.md) for the source review, contract and rollout gates.

Run the focused safety-state checks with:

~~~powershell
npm run test:advisories
~~~

## Historical research records

The Species page has a separate bilingual historical-record section with 12 reviewed CC0 museum specimens. The research adapter excludes the rejected locality, preserves unknown and month-only collection dates, and cross-checks taxonomy, provenance, licenses and locality-review states before writing the browser-facing snapshot. These records are not a current species list or fishing advice. No API key or live provider request is needed to read the snapshot.

The historical-record section has working name, source-locality, and dated/undated filters, with combined filtering, reset, separate record/species counts, and an explicit no-match state. Water-type and conservation-status filters remain disabled until reviewed values are available. The page also includes two bilingual, source-linked study examples for fish diet; neither is a Cavite diet survey or evidence of local presence, and bait/catching advice remains unverified. The research-only ledger at `data/research/obis/cavite/cavite-obis-fish-candidate-review.csv` records 27 candidate names / 52 linked occurrences: 12 currently published records, 2 excluded occurrences, and 38 pending review. Four pending rows carry durable Smithsonian curator holds; one National Museum occurrence has been excluded for missing locality. Pending rows are not added to the public evidence snapshot.

The broader CALABARZON research batch includes 18 historical Laguna de Bay specimen candidates checked against direct GBIF occurrence details and an independent fish-name catalog. Thirteen name crosswalks agree; five remain held. The MZUSP-linked online catalog resolves one unique source item through two duplicate index rows, but its interpreted record is only family-rank, flags `LOCATION_NOT_SUPPLIED` despite retaining locality text, and has a CC BY-NC license that conflicts with GBIF's record license. The 17 CAS items remain unverified while the public collection portal is offline. All 18 stay held and no public occurrence rows were added.

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
