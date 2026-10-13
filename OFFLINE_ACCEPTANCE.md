# Offline acceptance

Status checked: October 13, 2026. The production build and focused policy-dialog checks **pass**. Full offline browser/device acceptance is **pending**.

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
| TypeScript | Pass with incremental output disabled and in the production build. |
| Focused format | Pass for `bangwit-provider.tsx`. |
| Whole-app lint | Pass: 49 files, zero errors or warnings. |
| `npm run test:research` | Pass: 15/15 covering the historical snapshot, finite candidate ledger, search selectors, and study-based guide boundaries. |
| Production Species page smoke check | Pass at `http://localhost:4178/species`: page content, evidence filters/counts, and source-linked diet cards rendered with no console errors. The isolated origin's policy dialog remained unaccepted, and no catch data was changed. This is not interaction, consent, or offline acceptance. |
| Manifest inspection | Completed production worker contains `/catches` and `/~offline` with matching revisions; the build reports 36 precache entries. |
| Production build | Pass: normal Turbopack build, all 16 static outputs generated. Current build ID: `kZKsVb1SuPcEfzhf5ejPQ`. |
| Policy-dialog browser check | Pass within the scope recorded below, using the production server. |
| Browser/device offline, reconnect and upgrade | User reported that it appears to work, without individual case/device results. Detailed acceptance remains pending; this report is not a full pass. |

An independent source review found no actionable issue in the offline-cache slice. It does not replace browser acceptance.

## Policy-dialog verification

The lint cleanup removes unused imports and uses a named native `section` for the scrollable policy reader. Its `tabIndex={0}` and language-change effect dependency are deliberately retained with narrowly scoped lint explanations: keyboard users must be able to focus/scroll the reader, and translated policy text requires a fresh reading/checkbox state. No policy wording, acceptance version, storage keys or acceptance guard changed.

Checked in Brave on Windows at the fresh test origin `http://127.0.0.1:4176/catches`, with a 1536 × 702 desktop viewport and a 390 × 844 mobile viewport:

- The reader receives initial focus, exposes section/region semantics and retains a keyboard tab stop. Privacy appears before Terms.
- The checkbox is disabled before reaching the end. `Ctrl+End` scrolls the reader and enables the checkbox. The agreement button remains disabled while the checkbox is unchecked.
- Desktop forward/reverse Tab navigation wraps inside the dialog.
- Switching Filipino to English resets scroll to the top and disables the checkbox again; the unchecked state and disabled agreement button remain. The checkbox was never checked during this run, so clearing a previously checked box was confirmed from the unchanged source operation, not replayed in the browser.
- Both viewport layouts fit the viewport width without horizontal document overflow. No browser console errors were captured during the run.
- Screenshots: [desktop English](.impeccable/review/policy-lint-20261013/desktop-en.png) and [mobile Filipino](.impeccable/review/policy-lint-20261013/mobile-fil.png).

No agreement was submitted, catch saved/deleted, or real journal cleared. Mobile viewport emulation is not a real-phone or screen-reader test. This check does not establish offline catch persistence, reconnect recovery or release upgrades.

## Previous environment limitation

Earlier restricted-session attempts failed in Windows native path resolution and, in a one-off Webpack diagnostic, prerender directory creation. Those historical failures are no longer the current build status. The user's normal-terminal Turbopack build passed on October 11, and the agent's fresh Turbopack build passed on October 13. No bundler, worker, ACL, security or Git configuration workaround was needed.

## Run production acceptance

From a terminal in this project:

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
