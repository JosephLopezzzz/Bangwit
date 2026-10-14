# HTTPS staging and phone acceptance

Prepared October 14, 2026. The current hosted origin is `https://bangwit.vercel.app/`. The read-only hosting checker passed there on October 15, confirming the journal and fallback documents, worker scope/update headers and document references, manifest, and icon dimensions. The checker does not identify the deployed commit or prove worker installation, successful precaching, offline hydration, or phone behavior. The previously recorded local production build overlapped the final UI edits, so verify the live deployment's commit before treating its build as final. On October 15, the user reported a phone pass in online and offline modes; device/browser details and browser-tab versus installed-app context were not recorded. Prior desktop results are in [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md).

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

In that browser, confirm the app loads, the service worker finishes installing, and an online reload is controlled before testing offline. A first visit without internet cannot install the worker. The worker response must retain `Service-Worker-Allowed: /` and revalidate through `Cache-Control: no-cache, no-store, must-revalidate`. HTTPS and a valid manifest are part of [Next.js PWA installation](https://nextjs.org/docs/app/guides/progressive-web-apps).

## Phone test

Run separately on each supported physical phone/browser and in the installed home-screen app. Viewport emulation is not a phone pass. Read the prototype notice on that device before accepting it. Use a fresh synthetic journal; do not restore over or clear a real journal.

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
| Date and tester | October 15, 2026; user-reported result |
| Overall online/offline phone result | Pass, user-reported; individual results and device details not recorded |
| Phone model / OS version | Not provided |
| Browser / version | Not provided |
| Browser tab or installed app | Phone test reported; exact context not specified |
| Exact HTTPS origin | `https://bangwit.vercel.app/` (read-only hosting checks passed October 15, 2026) |
| Deployed commit / build ID | Pending verification |
| Starting / ending journal counts | Not recorded |
| First-visit installation / controlled reload | Pending |
| Offline saved catch + full photo + units | Pending |
| Reconnect draft + single save | Pending |
| Installed app cold launch offline | Pending |
| Backup download | Pending |
| Failures, screenshots and limitations | Pending |

Mark each result pass, fail, not run or not supported. Add a separate table for each phone/browser context. Record new failures before changing the app. A phone pass does not complete the outstanding outbound-traffic audit, production policy review, or current fishing/legal/safety data review.
