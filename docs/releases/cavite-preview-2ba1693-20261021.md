# Protected Preview follow-up — 2ba1693

Recorded **21 October 2026**. Internal synthetic QA only; no participant sessions, legal approval or Production publication.

## Exact deployment

- Source: `2ba1693df76176a2feecebd9cee65caeb894b27e`, review branch `codex/pilot-policy-review-20261017`.
- [Pinned Preview](https://bangwit-9lo15bu73-josephlopezzzzs-projects.vercel.app/catches); Vercel deployment `2MFhDHySvh1qpkQBSK6zDwNxkqYx`, **Ready / Preview** in the signed-in dashboard.
- GitHub deployment `7230388166`, success status `20192733127`, created `2026-10-21T15:47:00Z`, associates that exact source and origin.
- No automatic build/check existed initially. Vercel displayed “Automatic deployments from GitHub may be delayed.” The existing project's **Create Preview Deployment** workflow resolved the full commit to the review branch and Preview before submission. No new project, Production promotion, access exception or protection change was used.
- After QA, the Production overview still showed Ready deployment `4MytvJzrn7UseSmUM19eubP5MT7p`, source `cadbca7f96f359322a8bbf46f02d6bf2c5b960a8`, serving `bangwit.vercel.app`. Git `main` and the serving Production source remain separate facts.

## Authorized browser checks

Joseph explicitly approved this origin's `prototype-6` draft acknowledgment, optional-setup skip, empty-journal-only synthetic restore and scoped QA. The hydrated journal showed **0 catches** before restore. The input was the previously verified two-record [A/B fixture backup](cavite-preview-candidate-20261021.md#actual-backup-verified-on-21-october), SHA-256 `e6c11a7dafa52e130fc8f578a6723472f99a6fb9ae133312a9a83724a0a79cd2`.

| Check | Result and scope |
| --- | --- |
| Empty-journal restore | **Pass:** Settings reported two restored records; the journal showed exactly A and Unidentified B. No merge, replacement or erasure was performed. |
| Reopen each restored record | **Pass:** date October 20, Saltwater, fictional location, 50 cm, 1000 g, Released and each A/B note were displayed. Both SVG photos decoded at 320 × 200. Byte integrity of the input photos was verified separately in the earlier backup receipt. |
| Online full reload | **Pass:** the same origin reloaded into the journal with both restored records and no repeat notice gate. This is online persistence, not an offline cold-start pass. |
| Personal collection | **Pass:** A had one personal catch, with a separate notice for one unidentified catch. The screen retained its personal-log/non-regional caveat. |
| Hosted calendar fix | **Pass:** the calendar was visible and exposed in the accessibility tree, parent `DIALOG`, within the viewport. Escape closed it, kept the native form open and returned focus to Date. Choosing October 20 updated the unsaved form. Closing the form left exactly two records; **no new catch was saved**. |
| Re-export after restore | **Unconfirmed file:** the app reported a downloaded backup, but the supported download observer timed out and no matching new file was found in Downloads. Do not claim a downloaded-file or byte-for-byte round-trip pass. No duplicate export attempt was made. |
| Anonymous hosting checker | **Blocked by access protection:** `/catches` returned HTTP 302 instead of 200. The signed-in UI remained usable. Protection was not disabled; this is not a passing hosted checker or an application failure. |
| Request/worker observation and offline simulation | **Not run:** supported `Network.enable` repeatedly returned “Raw CDP is unavailable while Browser Use is resolving a paused document response,” including after navigation settled and after an online reload. No observer, offline override or worker-control inspection was established. No current-origin offline cold reload or full traffic capture was performed. |

The earlier local normal/reduced-motion and 390 × 844 layout checks remain in the [calendar receipt](cavite-preview-candidate-20261021.md#local-calendar-correction-and-verification). No new hosted reduced-motion, physical-phone or installed-PWA acceptance is inferred here. No real catch/photo, GPS, new profile data, participant note, outreach or legal approval was introduced. The approved synthetic journal was left intact.

## Evidence and next verification

Workspace-only artifacts: `outputs/qa-preview-2ba1693-20261021/` contains the deployment association, `browser-verification.json`, notice/empty-journal screenshots, two restored catches after reload, the hosted calendar, final journal and Production-source screenshot. No cookies, credentials, raw request headers or HAR were copied into the repository.

The hosted calendar and restore/online-persistence portions now have exact-source evidence. **G1/G6 remain partial**: worker control, offline cold startup, current-release traffic and actual re-export-file verification are unresolved. The legal/content, task/cohort, operating-procedure and owner-readiness gates in the [runbook](../CAVITE_PILOT_RUNBOOK.md) remain separate and unapproved.

For a manual browser check when developer controls are available:

1. Use the pinned Preview above while signed in; confirm its two fictional records. Keep access protection enabled and do not clear site data.
2. In DevTools → Application → Service Workers, record the worker URL, scope, activation and whether this Preview page is controlled. Reload online first. If registration/control is blocked, record that result before attempting an offline startup; do not bypass browser warnings.
3. For cold reload only, switch **this tab** to Offline in DevTools Network, reload `/catches`, and check both records/photos. Restore Online immediately afterward, including after a failed reload. Record pass/fail and the journal count; do not add or erase records for this check.
4. For traffic review, observe both page and worker requests on this exact source/origin. Keep raw captures local. Record only necessary sanitized origins/paths without query values, methods, body-presence flags, resource types and statuses; exclude cookies, authorization headers and private data. An incomplete capture must remain labeled incomplete.
5. Verify any exported file actually exists before claiming export integrity. Compare only this synthetic backup with the approved fixture; do not inspect or send a personal backup.

These instructions prepare the remaining checks; they are not recorded results. The old `15a1cf9` in-app-browser offline-reload failure remains a historical result for that source/context, not a new `2ba1693` failure or pass.

## 22 October retry — offline and export

Retested the same pinned Preview in a fresh Brave tab. Its two approved synthetic records were present. Raw `Network.enable` now succeeded; this supersedes the earlier tooling limitation for **page-target** observation only. No app code, pinned test deployment, protection setting or Production source was changed.

| Check | New observed result |
| --- | --- |
| Already-open Preview while offline | **Pass:** with the tab's offline override acknowledged, both restored catches reopened with their details and complete 320 × 200 photos. The override was returned to Online in `finally`. This is not an offline navigation/startup result. |
| Unsaved Preview draft across reconnect | **Pass to the entered scope:** a fictional species and original SVG were selected while offline. After reconnect, the species, October 22 date, Saltwater choice and complete photo remained. The draft was closed without saving; the journal stayed at two records. |
| Preview worker/startup prerequisite | **Blocked:** the browser logged a `SecurityError` because `/serwist/sw.js` was behind a redirect. The online `/catches` document returned 200 with `fromServiceWorker: false`. Anonymous GETs to the worker, journal and fallback returned 302 to Vercel `/sso-api`; a separate normal browser navigation to the worker was blocked with `net::ERR_BLOCKED_BY_CLIENT`. No hosted offline reload was attempted without a working worker. |
| Local production comparison | **Pass:** `http://127.0.0.1:4194`, existing build ID `dXrpmCZIRJXd8eXGkYX9w`, started with zero catches and restored the same two-record fixture. An online reload and then an acknowledged-offline full reload of `/catches` both returned 200 **from the service worker**. Both records and both complete 320 × 200 photos remained usable. The tab was returned to Online. This existing local calendar build and unchanged runtime source are separate from hosted/physical-device acceptance. |
| Current backup-file delivery | **Pass with user-assisted Save As:** automated download observers timed out in Preview and local comparisons. Joseph then confirmed a native Save As prompt and completed saving. Four newly saved default-name JSON files were independently inspected; every record field, unit, ID, timestamp, photo metadata and photo byte matched the approved input. Only the top-level export timestamp changed. The native save is user-performed; automated download-event observation did not pass. |

The redirect observations identify an access/environment boundary, rather than a demonstrated catch-storage defect. Vercel documents that [Deployment Protection requires authentication for all requests](https://vercel.com/docs/deployment-protection). The anonymous SSO response corroborates that boundary, but the worker's own authenticated request/redirect chain was not captured. Protection was kept enabled and no bypass token or access exception was created.

### Scoped traffic evidence

Saved **67 page-target requests**, with methods **GET, OPTIONS and HEAD**, and HTTP(S) origins limited to the pinned Preview and **`https://vercel.live`**. None of these retained requests had a body or a synthetic marker in a body. Each recorded event drain was untruncated. These are facts about the retained events, not a finding of no external traffic or no data disclosure.

The capture starts before the controlled online reload and covers the subsequent offline reopens, photo-draft reconnect and export attempt. `ServiceWorker.enable` is unsupported through this raw-CDP interface, so worker-target/request coverage and initial-first-visit coverage remain missing. Headers and URL query values were not saved. Body-marker checks do not establish that no private information could appear elsewhere. Full current-release traffic/privacy acceptance remains open.

### Actual export files after native Save As

The requested custom filename was not present; the scoped Downloads check instead found `bangwit-catches-2026-10-21.json` and copies `(1)`, `(2)`, `(3)`, saved after Joseph completed the queued native prompts. The date in these filenames is UTC, while this verification occurred on October 22 in Manila.

All four files are **3,519 bytes**, format `bangwit-catches`, version 1, and contain exactly the two expected synthetic records. Deep comparison of the complete parsed backup, substituting only the original top-level `exportedAt`, matched the original backup. Each of the eight decoded photos is exactly **829 bytes**, SHA-256 `dbd8305915d9884a372c8ab48f0267c6b5a003fdbd72646badc5edc03abb239e`.

| Saved filename suffix | Exported at UTC | File SHA-256 |
| --- | --- | --- |
| no suffix | `2026-10-21T15:54:09.971Z` | `749cfd36fad5ca7f3a785c986ff744fba276de7d939671d081847de5c60844ba` |
| `(1)` | `2026-10-21T16:11:02.777Z` | `c107704f37a00904f35471032ccc708adfe471791f3cd7c52850191476ab3b8e` |
| `(2)` | `2026-10-21T16:16:07.896Z` | `7fd6a54a8ce68e74feb24a71925406d0c78caed639f1f3acad2fe6648f7eb541` |
| `(3)` | `2026-10-21T16:17:32.543Z` | `965e04824c806d9384c5f7e25ebc25b89a0345138000becaca6079b042a94828` |

These are the saved files from the QA export sequence across Preview and local comparison; a download event did not independently identify each file's browser origin. Do not infer four different environments or a fully automated download pass. No application download bug was established from the earlier observer timeouts, and no product patch was made for them.

Artifacts are outside Git at `outputs/qa-preview-2ba1693-20261022/`: `sanitized-page-traffic.json`, `test-results.json`, `roundtrip-file-verification.json`, copies of the four verified exports, `already-open-offline-photo.jpg`, `draft-after-reconnect.jpg`, `local-offline-reload-photo.jpg`, and the final hosted-journal screenshot. Network observers were disabled and all applied offline overrides were restored to Online. Both test journals were left at two synthetic records; no third catch was saved and no record was erased.

**Result:** local offline reload, hosted already-open offline reads, hosted draft reconnect and user-assisted export-file integrity now have bounded evidence. Hosted worker/cold-start, full traffic review and physical-device/installed-PWA checks remain unresolved. This does not approve a pilot launch or the policies.
