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
