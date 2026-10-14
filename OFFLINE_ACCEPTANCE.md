# Offline acceptance

Status checked: October 13, 2026. The production build, focused policy-dialog checks, and isolated desktop offline cases including fresh-origin controlled reload and rebuild-upgrade **pass to the scope recorded below**. A brand-new browser profile and physical-device acceptance are **pending**. Outbound-traffic review is partial.

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
| Production Species page smoke check | Pass at `http://localhost:4178/species`: page content, evidence filters/counts, and source-linked diet cards rendered with no console errors. This did not test species interactions or offline behavior. |
| Manifest inspection | Completed production worker contains `/catches` and `/~offline` with matching revisions; the build reports 36 precache entries. |
| Production build | Pass: normal Turbopack builds generated all 16 static outputs. Build A: `kZKsVb1SuPcEfzhf5ejPQ`; rebuild B: `c02r_OIfSgsx1WSmxTF9-`. |
| Policy-dialog browser check | Pass within the scope recorded below, using the production server. |
| Desktop offline and reconnect | See the recorded runs below. Offline save/reload with a synthetic photo, cached routes/fallback, reconnect draft recovery, offline backup export, empty-journal restore, non-empty restore rejection, fresh-origin controlled reload, and rebuild-upgrade passed on isolated desktop browser origins; a brand-new browser profile and real-phone cases remain open. |

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

## Isolated desktop offline run

Run date: October 13, 2026. Test origin: `http://127.0.0.1:4178`. Build: `kZKsVb1SuPcEfzhf5ejPQ`. Environment: Windows 11 Home Single Language, build 26200; Codex In-app Browser (Chrome engine 155), 920 × 668 viewport at DPR 1.25. The test origin displayed the prototype Terms and Privacy text. After the user explicitly agreed, the prototype notice was accepted on this isolated test origin only. This is not legal approval of production policies.

For actual no-server checks, the local production server on port 4178 was stopped and verified absent; the tab's network was also set offline through browser developer controls. `navigator.onLine` was false and the page was service-worker controlled. The server was restarted and online state restored after testing. An earlier attempt that only set the tab offline while the server still ran was not treated as offline evidence, because the service worker could still fetch from localhost.

| Case | Result |
| --- | --- |
| O1 — first visit and controlled reload | **Pass after install on a fresh origin; first offline visit remains unsupported.** On new origin `http://127.0.0.1:4180/catches`, the initial online page was uncontrolled; after an online reload it became service-worker controlled. With the server stopped and the tab offline, reloading `/catches` rendered and hydrated the empty journal. The prototype notice stayed unaccepted. This was a new origin in the same browser profile, not a brand-new browser profile. |
| O2 — offline save and reload | **Pass for this desktop test case.** With the server stopped and the tab offline, a clearly labeled synthetic entry and SVG test image were saved, then verified after reload. The gallery thumbnail, full photo viewer, 19.5 in, 2.3 lbs, location label and notes were present. The five unidentified test entries remained outside My Species. This does not test a physical camera photo or fresh-profile first visit. |
| O3 — unsaved draft on reconnect | **Partial.** A draft filled while the server was stopped survived reconnection. It was saved once; journal count increased from 2 to 3, and its 7 in / 2 lbs, test-only location and note were verified after reload. No photo was included. |
| O4 — navigation and fallback | **Pass for the tested desktop origin.** With the server stopped, `/`, `/species`, `/my-species`, `/settings` and `/catches` loaded from cache. An unvisited path showed the cached offline fallback, and its journal link opened the cached journal. The Explore map imagery was unavailable offline while its text remained readable. |
| O5 — private backup | **Pass for backup/restore behavior; privacy traffic review partial.** A backup of all five synthetic entries was exported while the server was stopped and the tab offline. It was restored into an empty journal on the separate `127.0.0.1:4179` origin after the user reviewed and authorized the prototype notice there. All five entries appeared; the photo viewer, 19.5 in / 2.3 lbs units, test-only location label and notes were preserved. The unidentified entries stayed out of My Species. A second restore attempt against the non-empty journal was rejected with “May laman na ang catch journal na ito”; the count remained five. Cache inspection found no catch-note text in cached request URLs, but outbound traffic was not exhaustively monitored. |
| O6 — release upgrade | **Pass for the desktop rebuild-upgrade path; no source feature change was included.** On the same `4179` origin, build A (`kZKsVb1SuPcEfzhf5ejPQ`) had five synthetic catches and the SVG photo. Rebuild B (`c02r_OIfSgsx1WSmxTF9-`; 36 precache entries, 5221.16 KiB) was installed while the A-controlled tab remained open. The new worker was observed in `waiting: installed` while the old page was still controlled, and an unsaved synthetic species/location/note draft remained visible. The old tab was then closed normally. A new page loaded with all five records; after stopping the server, an offline reload still showed the five-entry journal and opened the full synthetic photo viewer. Build A's catch/photo data survived. The B build was a rebuild of the same source tree, so this verifies worker/cache replacement across builds, not a user-visible feature-code release. The post-close active state was not directly inspected. |
| O7 — mobile device | **Not run.** No physical phone or installed home-screen session was tested. |

Five synthetic, unidentified test records remain in the IndexedDB journals for `127.0.0.1:4178` and `127.0.0.1:4179`; `127.0.0.1:4180` remains an empty-origin test. The five records contain only explicit `TEST`/`SYNTHETIC` labels and no real catch or location; one includes a synthetic SVG, not a user photo. A local JSON backup of all five records, including that SVG, remains in Downloads and should be treated as private test data. The prototype notice was accepted on 4179 only after the user authorized that action. No user catch data was entered, no external uploads occurred, and no test records were deleted. The production test server is running again on port 4178; the temporary 4179 and 4180 servers are stopped.

## HTTPS staging preparation — October 14, 2026

Added a minimal Vercel Preview configuration, Node.js 24.x deployment engine, CLI upload allowlist and worker HTTP update-cache header. The upload rules retain the provincial JSON imported by the app while excluding local secrets, downloaded research originals, backups and QA screenshots. No hosted URL or phone result has been produced; Vercel account connection is not yet confirmed.

After the shared UI edits appeared, `npm run build` passed with all 16 outputs and 37 Serwist precache entries (5,238.64 KiB). The source fingerprint differed across that build, so rerun the build after edits settle before deploying. The prior `test:offline` run passed 5/5. `check:staging` passed against the temporary local production server at `http://127.0.0.1:4181`, including root worker scope, the actual no-cache response header and icon dimensions; that server is now stopped. The checker rejected an insecure LAN HTTP origin before networking. These HTTP/source checks do not replace browser offline or phone acceptance. Follow [STAGING_ACCEPTANCE.md](STAGING_ACCEPTANCE.md) for the deployment and device workflow.

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
