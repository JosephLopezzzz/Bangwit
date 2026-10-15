# Source-level privacy review

Reviewed 15 October 2026. This is a source review of the current local-first catch flow, not a production network-capture audit or legal approval of the draft policies.

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

This evidence applies to this local build and these test origins only. It does not inspect the deployed site's traffic, hosting/CDN logs, browser extensions, browser-level telemetry, other Edge profiles, or a physical phone. It also does not establish that the draft policies are legally approved. Repeat the same synthetic flow against the controlled HTTPS Preview before making a release claim.
