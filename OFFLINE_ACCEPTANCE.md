# Offline acceptance

Status checked: October 11, 2026. Offline browser acceptance is **pending**.

## Changes in this slice

- Disable Serwist's automatic reload when the browser comes online. An open, unsaved catch form should remain on screen; it is still not a persisted draft and can be lost on a manual reload or closed tab.
- Precache `/catches` and `/~offline` HTML alongside static/public assets. Their deterministic revisions change when source content or cached asset identities change, avoiding reuse of a permanently fixed fallback revision.
- Use document navigation from the offline fallback to `/catches`, so recovery does not require previously cached Next.js router data.
- Keep personal catches and photo files in IndexedDB. Source files are used only to fingerprint documents; source, environment and private data files are not included in the precache.

## Evidence so far

| Check | Result |
| --- | --- |
| `npm run test:offline` | 5/5 pass: both HTML documents, deterministic revisions, source changes, replaced chunks and private-file exclusion. |
| `npm run test:storage` | 2/2 pass using an isolated IndexedDB implementation: photo/legacy-record backup and restore, measurement units and invalid-unit rejection. This is not a browser reload test. |
| TypeScript | Pass with incremental output disabled. |
| Focused lint and format | Pass for the changed application/configuration files and offline tests. |
| Whole-app lint | Fails in the existing `bangwit-provider.tsx`: policy-reader semantics/tab index and effect dependency; unused imports also warn. That component is unchanged in this slice. |
| Manifest inspection | Both document entries present, no warnings, against the available compiled assets. This does not establish that a complete production build exists. |
| Production build | Blocked in this environment; details below. |
| Browser/device offline, reconnect and upgrade | Not run; no acceptance claim. |

An independent source review found no actionable issue in this slice. It does not replace browser acceptance.

## Build limitation

The normal Turbopack build encounters Windows native path-resolution access errors. A narrowly scoped repository read/write grant did not resolve native `realpath` failures; ordinary JavaScript path resolution and basic file writes succeeded. The configured Turbopack root already points to the repository.

A one-off `next build --webpack` diagnostic compiled and passed its TypeScript phase, then failed while prerendering `/catches` with `EPERM: operation not permitted, mkdir` at `.next/server/app/catches.segments/catches`. An isolated test of Next's directory writer passed three concurrent cases and a sequential control, so a concurrency explanation is unproven. The exact prerender access cause remains unresolved.

No bundler, worker, ACL, security or Git configuration was changed to work around these errors. A successful production build is required before offline acceptance; development mode disables Serwist precaching and is not an equivalent test.

## Run outside the restricted session

From a normal VS Code terminal in this project:

```powershell
npm run test:offline
npm run test:storage
npm run typecheck
npm run build
npm run start -- --port 4175
```

Start only after the build succeeds. Use `http://127.0.0.1:4175` in a disposable test profile or a fresh test origin. Keep the same origin throughout upgrade tests. Do not clear or restore over a real journal. Review the prototype policy yourself before using the test journal.

## Browser acceptance cases

Record browser/version, operating system, origin and build identifier for each run. For service-worker tests, wait for installation to finish and confirm `/serwist/sw.js` is active; reload online if needed to obtain a controlled page. Test first-visit behavior separately rather than assuming immediate offline readiness.

1. **First visit and controlled reload.** Open `/catches` directly online. Record when installation finishes and whether the page is controlled. Disconnect and reload: the actual form must load and hydrate. Repeat after an online controlled reload. A failed first visit must not be hidden by the warmed case.
2. **Offline save and reload.** Save a test catch offline with a photo, notes, spot label, length in inches and weight in kg or lbs. Reload offline and verify every value, gallery thumbnail, expanded photo and derived `My Species` entry. An unidentified catch must remain outside the identified collection.
3. **Unsaved draft on reconnect.** Fill an offline draft with a photo and nondefault units, then restore connectivity. The page must not automatically reload. Verify the draft remains, save it once and confirm exactly one new entry.
4. **Navigation and fallback.** Visit `/`, `/species`, `/my-species` and `/settings` online, then exercise them offline. Separately request an unvisited document URL offline: the fallback must render, and its journal button must open a working `/catches` form. Record any client-navigation failures independently of full reloads.
5. **Private backup.** Export a backup offline. Inspect it locally for the expected photo/units, then restore only into a separate empty test journal. Verify the original test journal remains intact. Catch content must not appear in outbound requests or service-worker caches; keep test backups private.
6. **Release upgrade.** Use build A, save a test catch and cache the fallback. Install build B with changed application assets without clearing site data. Let existing tabs close normally so the waiting worker can activate; do not force replacement while a draft is open. Offline fallback and journal must hydrate with B's assets, and A's catch/photo must survive. Record both build identifiers and activation state.
7. **Mobile device.** Repeat the core offline save/reload and reconnect cases on a real phone, including installed home-screen use where supported. Responsive desktop screenshots do not count as device acceptance.

Only mark a case passed when its actual production-browser result has been recorded. Do not infer current fishing legality, safety or species presence from any offline copy.
