# HTTPS staging and phone acceptance

Prepared October 15, 2026. The hosted origin `https://bangwit.vercel.app/` was checked against Vercel Production deployment `A74x3ZMLJMAjQ8ZhxiMcFeEWELYK`, Ready for commit `8dd97f3c425cabc4f4b71a96259fda83325bb427`. This hostname is the Production alias, not a Preview deployment. The production-origin synthetic traffic run is recorded below. A separate Preview UI round-trip on commit `6a8814950884b1c55fbd35c6f5ec049af298f2df` is also recorded; full Preview HTTP traffic capture remains pending. The local Turbopack build, hosting checker, and prior desktop checks in the historical release section were recorded against earlier source and do not verify the build or phone behavior of this commit. The user reported a phone pass in online and offline modes; device/browser details and browser-tab versus installed-app context were not recorded. Prior desktop results are in [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md).

## Deployment setup

Use a controlled Vercel **Preview** deployment for synthetic testing. The project contains `vercel.json`, a CLI upload allowlist in `.vercelignore`, and a Node.js `24.x` engine declaration. Vercel supports that engine; see [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

| Setting | Value |
| --- | --- |
| Project directory | `work/bangwit-next` in the local workspace; this is the Git repository root |
| Framework | Next.js |
| Node.js | 24.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Next.js default; leave the override empty |
| Environment variables | None required for this build |
| Deployment target | Preview; do not use `--prod` for this test |

The current code does not read `NEXT_PUBLIC_TOMTOM_API_KEY` or call a live species/weather service. The journal and reviewed research snapshot work without API credentials. Leave local `.env.local` out of the deployment.

The upload allowlist retains source, artwork/icons, build configuration and `data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json`, which the app imports. It excludes local secrets, research downloads, journal backups and QA screenshots. This is a [Vercel CLI upload rule](https://vercel.com/docs/deployments/vercel-ignore), not a restriction on the files already accessible to a Git integration.

Complete Vercel account connection and select the intended account/project before publishing the preview. If using the official CLI instead of a connected deployment tool, run from this project:

```powershell
npx vercel login
npx vercel deploy
```

Review the selected account, project and Preview target before confirming the deployment. A Git integration is optional for this one-off test. Importing a repository through the dashboard can create a production deployment, so do not treat that workflow as equivalent to a CLI Preview. See [Vercel deploy](https://vercel.com/docs/cli/deploy).

Keep [Deployment Protection](https://vercel.com/docs/deployment-protection) enabled for the controlled test where available. Sign in normally on the testing device. If protection redirects the service-worker, manifest or icon requests to an access screen, record the block and resolve access in the intended account; a login page is not a working cached app.

Choose one HTTPS hostname and retain it throughout each persistence/upgrade run. Each new hostname has a separate browser journal. Local catches at `127.0.0.1:4178` are not automatically transferred to the hosted preview. A later build-upgrade test requires a stable staging hostname rather than switching to each deployment's unique URL.

## Hosting verification

Run the checker against the current hosted origin or a later HTTPS deployment:

```powershell
npm run check:staging -- https://bangwit.vercel.app/
```

This read-only checker verifies the journal/fallback documents, `/serwist/sw.js` type and root scope, update-cache header, worker references to the document URLs, manifest and icon dimensions. Document references alone do not prove worker installation, successful precaching or offline hydration; those need the offline tests and browser/device runs. It sends no catch data and does not inspect browser storage. A protected preview can reject the automated checker; verify these endpoints in the signed-in browser instead, keeping protection enabled.

## Historical release verification before commit 8dd97f3

- At the time of the earlier release check, Vercel Production deployment `Gb1SKrj6GC3xkf7npFqHe9yFYgUw` was Ready for `d957c1379f7f7c6deafdb670553199e5dca4654c`; later branch and deployment checks are recorded separately below.
- `npm run build` passed on the earlier `d957c13` source: 16 static routes and 37 precache entries. `npm run test:offline` passed 5/5; `npm run test:storage` passed 2/2; `npm run check:staging -- https://bangwit.vercel.app/` passed at that recorded check.
- In a desktop Brave browser, `https://bangwit.vercel.app/catches` rendered the journal with zero catches, then rendered the same zero-catch journal after an online reload. No catch was saved or changed. Service-worker control was not independently observed.
- These checks do not complete the offline reload, unsaved photo-draft reconnect, fresh-profile, phone, or installed-app cases below.

## October 15 production-origin synthetic traffic run

- Origin and deployment: `https://bangwit.vercel.app/`, Vercel Production deployment `A74x3ZMLJMAjQ8ZhxiMcFeEWELYK`, commit `8dd97f3c425cabc4f4b71a96259fda83325bb427` (Ready). This was not a Preview deployment.
- Browser and data: Microsoft Edge 155.0.4283.45 in two fresh, isolated contexts. The first empty journal saved one synthetic catch with a 68-byte PNG and downloaded a version 1 JSON backup containing that record and photo. The second empty journal restored the backup; IndexedDB then contained one record with the same 68-byte photo. The journal UI showed one catch. No real catch data was used.
- Service worker: `https://bangwit.vercel.app/serwist/sw.js` activated and controlled the page after an online reload.
- Hosting check: on October 15, 2026, `npm run check:staging -- https://bangwit.vercel.app/` passed for the journal and fallback documents, service-worker scope/update headers and references, manifest, and icon dimensions.
- Traffic: 160 DevTools HTTP(S) request events were observed across page and service-worker sessions. All targeted `https://bangwit.vercel.app`, used GET, and had no request bodies; no external origin or write method was observed. The response statuses observed were 200.
- Scope: this is browser-visible traffic for the synthetic flow. It does not inspect Vercel server/CDN logs, browser-level telemetry, other browser profiles, physical-phone behavior, or Preview request methods/bodies. The separate Preview UI round-trip below exercised save, export feedback, and restore but did not provide a Preview network capture.

## October 15 protected Preview UI round-trips (partial)

- Deployment: Vercel Preview `8xbXUrGUrW7fwSMH1StvRUdzmtJL`, Ready for commit `6a8814950884b1c55fbd35c6f5ec049af298f2df` on branch `codex/https-preview-20261015`. The app source is unchanged from `8dd97f3`; the intervening commit changes only these acceptance/privacy documents. Preview URL: `https://bangwit-38a0tqos7-josephlopezzzzs-projects.vercel.app/`.
- In a fresh origin in Brave, the test accepted the prototype notice, skipped optional setup and the tour, saved a synthetic catch with the synthetic PNG, and confirmed the journal showed one catch with an image entry. Settings displayed its backup success message after export was confirmed.
- The browser automation did not expose the Preview-created Blob as a file for inspection. To test restore, the synthetic row was deleted until that Preview journal showed zero, then the previously verified version 1 synthetic backup from the Production-origin run was selected. Settings reported one record restored and the journal showed the synthetic catch and image entry. The row was deleted afterward and the journal returned to zero.
- A second empty origin was tested at the Vercel branch alias `https://bangwit-git-codex-https-preview-bc9472-josephlopezzzzs-projects.vercel.app/` in the same Brave profile. After accepting the prototype notice, the same previously verified synthetic backup restored one catch; Settings reported one record, and the journal showed the synthetic catch and image entry. The row was deleted and the journal returned to zero. This was a second origin, not a second browser context. No real catch data was used.
- The read-only hosting checker returned `302` for `/catches`. Separate unauthenticated GETs to `/`, `/~offline`, `/manifest.webmanifest`, and `/serwist/sw.js` also returned `302` redirects to Vercel SSO. The interactive Brave session could load the app routes. No access protection was bypassed.
- Scope: this verifies Preview UI save/export feedback/import flows and restore into two distinct origins in one browser profile; both restores used a backup produced by the earlier Production-origin run, not the Preview download. Preview backup bytes, a fresh second browser context, service-worker control, and Preview HTTP request methods/bodies were not verified. The isolated Edge launch was blocked by policy and raw CDP capture was unavailable in the browser session. Do not claim Preview traffic acceptance from these runs.

In that browser, confirm the app loads, the service worker finishes installing, and an online reload is controlled before testing offline. A first visit without internet cannot install the worker. The worker response must retain `Service-Worker-Allowed: /` and revalidate through `Cache-Control: no-cache, no-store, must-revalidate`. HTTPS and a valid manifest are part of [Next.js PWA installation](https://nextjs.org/docs/app/guides/progressive-web-apps).

## Phone test

Run separately on each supported physical phone/browser and in the installed home-screen app. Viewport emulation is not a phone pass. Read the prototype notice on that device before accepting it. Use a fresh synthetic journal; do not restore over or clear a real journal. The Production-origin traffic run and partial Preview UI round-trips are documented in [PRIVACY_REVIEW.md](PRIVACY_REVIEW.md); full Preview request capture remains pending.

1. Open the chosen HTTPS origin online in Android Chrome or iPhone Safari. Visit `/catches`, wait for installation and reload online. Record the initial journal count.
2. Turn off both Wi-Fi and cellular data. Reload `/catches` and verify the form and existing journal open. If the offline page appears, use its journal link and record whether recovery worked.
3. Save a catch with species left unidentified, a synthetic picture, 19.5 inches, 2.3 lbs, location `TEST PHONE — no real location`, and note `SYNTHETIC PHONE QA — not a real catch`. Record the resulting count.
4. Reload while offline. Verify the count, thumbnail, expanded picture, date, water type, units, location label and note. The unidentified record must stay outside My Species.
5. Still offline, fill a second **unsaved** draft with a synthetic picture, nondefault units and a labeled note. Restore Wi-Fi/cellular access while leaving the form open. Verify the page does not reload and every draft value remains. Save once; the count must increase by exactly one. Manual reload/tab closure does not preserve an unsaved draft.
6. Use the browser's Install/Add to Home Screen action. Open Bangwit from its new icon online and establish its own test journal. Test the browser and installed app separately rather than assuming they share storage.
7. In the installed app, repeat the offline save/reload and photo-draft reconnect cases. While offline, close the installed app fully and relaunch from its icon; saved entries and the photo must remain readable. Record cold-launch behavior separately from an already-open app.
8. Export a private backup in Settings and check that it downloads on this device. Keep it local. Empty-journal restore is a separate test on another explicitly chosen test origin/profile; do not clear this journal to manufacture an empty restore target.

## Record each run

| Detail | Recorded value |
| --- | --- |
| Date and tester | October 15, 2026; local release checks, user-reported phone pass, Production-origin traffic run, and partial Preview UI round-trip |
| Overall online/offline phone result | Pass, user-reported; individual results and device details not recorded |
| Phone model / OS version | Not provided |
| Browser / version | Not provided |
| Browser tab or installed app | Desktop hosted journal and online reload checked; phone context not specified |
| Exact HTTPS origins | Production: `https://bangwit.vercel.app/`; Preview: `https://bangwit-38a0tqos7-josephlopezzzzs-projects.vercel.app/` |
| Last recorded deployed commit / build ID | Production traffic run: `8dd97f3c425cabc4f4b71a96259fda83325bb427`, Vercel deployment `A74x3ZMLJMAjQ8ZhxiMcFeEWELYK`; Preview UI run: `6a8814950884b1c55fbd35c6f5ec049af298f2df`, Vercel deployment `8xbXUrGUrW7fwSMH1StvRUdzmtJL`, branch `codex/https-preview-20261015` (Ready) |
| Starting / ending journal counts | Desktop hosted journal showed 0 before and after online reload; phone counts not recorded |
| First-visit installation / controlled reload | Pending |
| Offline saved catch + full photo + units | Pending |
| Reconnect draft + single save | Pending |
| Installed app cold launch offline | Pending |
| Backup download | Preview success message shown; downloaded Preview file not captured for inspection |
| Preview save / restore | UI round-trip passed with synthetic data; restore used previously verified backup; test row removed afterward |
| Preview traffic / hosting check | HTTP traffic capture pending; unauthenticated staging checker received `302` for `/catches` |
| Failures, screenshots and limitations | Preview service-worker control and request methods/bodies not observed; phone/device details not provided |

Mark each result pass, fail, not run or not supported. Add a separate table for each phone/browser context. Record new failures before changing the app. A phone pass or local traffic check does not complete deployed-origin/CDN traffic review, production policy review, or current fishing/legal/safety data review.
