# Cavite Preview candidate: scoped QA receipt

Recorded: **21 October 2026**. **Internal preparation only; recruitment and participant sessions remain CLOSED.** This records the earlier protected Preview walkthrough, today's read-only backup verification, and a separate local calendar fix. It does not approve policies, freeze a pilot release, or report Production acceptance.

Later same-day evidence for the calendar correction on the exact hosted source `2ba1693` is recorded in the [protected Preview follow-up](cavite-preview-2ba1693-20261021.md). The earlier scopes and limits below remain historical; the follow-up does not close the offline-startup or traffic gates.

## Two source scopes

| Scope | Exact identity and evidence | Limit |
| --- | --- | --- |
| Protected Preview walkthrough, 20 October Manila time | Source `15a1cf9b63c14388f66bc595e9ca4f401870d87e`; [deployment-specific origin](https://bangwit-nxd5mxf7z-josephlopezzzzs-projects.vercel.app); GitHub deployment `7178511028`, successful status `20037138334`, environment `Preview`; Vercel deployment `E8BQfVBpFgGokK144yPNr97GPWGD`. | The deployment API tied this origin to that source. A branch alias or local HEAD alone was not used as source proof. Access protection stayed enabled; Joseph signed in. These are the previous walkthrough's observations, not a fresh hosted retest on 21 October. |
| Calendar correction, 21 October | Local production build at `http://127.0.0.1:4194`, based on `15a1cf9`, with the reviewed, then-uncommitted changes in `src/components/catch-date-picker.tsx` and `src/components/catchbook-page.css`. | Brave desktop UI and responsive emulation only. The old pinned Preview does not contain this correction. Committing or deploying it later requires its own source/deployment association; earlier hosted results cannot prove that new bundle. |

The first scope used the `prototype-6` draft acknowledgment. Joseph explicitly authorized the isolated notice acceptance, optional-setup skip, synthetic A/B work and backup download. This test acceptance is not qualified legal review or participant consent. No Production deployment or main-branch change forms part of this receipt.

## Protected Preview observations

The hydrated journal first showed **zero catches**. The original [A/B fixture specification and SVG](../fixtures/cavite-pilot/README.md) supplied all inputs; no personal journal or real fishing location was used.

| Check | Observed result |
| --- | --- |
| Notice and setup | Both languages rendered the support-email retention paragraph and provider caveat. The checkbox started disabled; reaching the notice end enabled it while unchecked, and changing language reset it. After explicit authorization, the English draft was accepted and optional setup skipped. |
| A: save and reopen while offline | `SYNTHETIC pilot A` saved while the target's supported offline override was enabled. The journal showed one catch. Reopening it offline retained its displayed fields and decoded 320 x 200 SVG. |
| Offline full reload | **Did not pass.** The in-app browser entered `ERR_INTERNET_DISCONNECTED`. Its internal error URL then blocked further target actions, including the attempted offline reset and final event drain. No successful reset acknowledgment was obtained on that target. Joseph closed the old error tab; browser inventory confirmed it was gone. |
| Recovery after that failure | A newly opened online tab at the same protected origin displayed A. No site data was cleared. This proves that A survived this recovery; it does not prove an offline cold start or a correctly controlled service worker. |
| B: offline preparation, reconnect, save | Species stayed empty while the fictional fields and SVG were prepared offline. After a successful online-reset response, visible fields, date and decoded photo remained intact. B was saved **once, online**. The journal showed exactly two catches: A and `Unidentified` B. |
| My Species | A appeared as one personal catch. A separate one-unidentified-catch notice accounted for B; B was not fabricated into an identified species group. |
| Backup export | The actual confirmation/download completed. The resulting file contains exactly A and B; the read-only verification below confirms their fields and photo bytes. |

Both records used date `2026-10-20`, Saltwater, `Demo Cove - synthetic`, length `50 cm`, weight `1000 g`, blank bait and Released. Their notes were `Pilot example A - fictional` and `Pilot example B - fictional`. Empty Species for B is stored as `Hindi pa natukoy` and displayed in English as `Unidentified`.

The in-app browser was unavailable for continuation on 21 October. The final two-entry online reload and remaining network-event drain were **not performed**. Do not infer those results from the exported file or A's earlier recovery.

## Actual backup verified on 21 October

The downloaded `bangwit-catches-2026-10-19 (2).json` was inspected read-only and copied byte-for-byte to the QA outputs. Its UTC-based filename/export timestamp and the records' Manila-local catch date differ as recorded; no timestamp was rewritten.

- Format `bangwit-catches`, version `1`, **2 records**, **3,519 bytes**.
- Original and copied file SHA-256: `e6c11a7dafa52e130fc8f578a6723472f99a6fb9ae133312a9a83724a0a79cd2`.
- Every expected field matched, including units, blank bait, Released and `device-only`. The actual schema stores `length` and `weight` as strings; `lengthCm` and `weightG` are not schema fields. An initial inspection assertion used the wrong field name and was corrected against the schema; it was not evidence of lost measurements.
- Each decoded photo is the original 829-byte SVG, SHA-256 `dbd8305915d9884a372c8ab48f0267c6b5a003fdbd72646badc5edc03abb239e`, with a byte-for-byte fixture match.

This is export integrity evidence. **No backup restore or deletion was performed.** It does not prove restored-browser behavior, offline cold start, device acceptance or absence of network disclosure.

## Local calendar correction and verification

The old Preview's date trigger expanded without exposing a visible/accessible popup inside the native modal. The popup was portaled to `document.body`, outside the modal's top layer. The correction follows the shared dropdown pattern: portal into the nearest open dialog, account for its transformed coordinate space, and retain the body portal outside dialogs. A persistent identity transform on the catch dialog keeps that coordinate space consistent when reduced motion disables its animation.

The local production build and focused Biome check passed, along with **5/5 offline-precache tests** and **7/7 focused species/candidate-research tests**. These are scoped checks, not a rerun of every release gate.

Observed in Brave through the supported computer-use interface:

- The modal calendar appeared in the accessibility tree and screenshot, with the open dialog as its portal parent and its popup inside the viewport.
- Choosing October 20 updated the unsaved form's date. Escape closed the calendar, retained the form and restored focus to its date trigger; outside click also closed the calendar.
- Normal motion, reduced motion and a **390 x 844** responsive viewport kept the popup visible. Reduced motion had animation `none` and an identity transform.
- The journal date filter outside the modal still used `BODY` and stayed within the viewport.
- Motion/viewport overrides were reset. **Zero catches were saved** during these local UI checks.

Responsive emulation is not physical-phone or installed-PWA acceptance. This local correction was not tested on a new hosted deployment and does not close the hosted offline-reload or traffic gaps.

## Artifacts and remaining gates

QA artifacts remain outside Git under the workspace's `outputs/` directory; synthetic backups are not participant records:

| Directory | Evidence |
| --- | --- |
| `outputs/qa-preview-20261020/` | `notice-before-acceptance.jpg`, `preview-partial-traffic.json`, `preview-backup.json`, `backup-verification.json` |
| `outputs/qa-calendar-20261021/` | `calendar-verification.json`, `calendar-fixed.jpg`, `reduced-motion-calendar.jpg`, `mobile-calendar.jpg` |

The hosted traffic artifact explicitly has `completeCapture: false`. Retained events include Preview requests, a Vercel `/sso-api` request, local blob activity and error-page activity. Reload instrumentation was truncated and the old target's final drain was blocked. This is not a complete page/worker capture, a no-external-request finding, or proof that no data was transmitted. No real catch, photo or GPS input was used in the authorized test.

The [starter-content candidate](../review/CAVITE_STARTER_CONTENT_CANDIDATE.md) separately inventories **12 historical specimens / 12 accepted taxa**, **5 study-specific feeding examples** and **11 provincial catch groups**. Its technical checks do not combine these into 28 verified species, admit held records, authorize new publication, or supply owner/editorial/qualified review.

The [pilot runbook](../CAVITE_PILOT_RUNBOOK.md) and [implementation plan](../CAVITE_PILOT_IMPLEMENTATION_PLAN.md) still govern readiness:

- **G1/G6:** select and freeze the exact pilot source/build/origin, verify the corrected hosted bundle, complete relevant current-release traffic, worker/cache, offline cold-start, backup-restore and device checks. The scoped passes above supply evidence only for their named builds and actions.
- **G2:** obtain the dated owner/editorial content decisions and applicable qualified rights/legal review; preserve candidate holds and historical/context limits.
- **G3:** qualified privacy/legal review and approved bilingual policies/participant notice remain pending. Internal prototype acceptance supplies none of these decisions.
- **G4/G5:** record task/cohort agreement and verify the actual private-note, backup/sync, reminder and deletion workflow. Earlier empty-folder ACL preparation is not the whole operating check.
- **G7:** owner readiness decision remains pending. No invitations, participant sessions or results have been created by this work.

Live advisories remain unavailable, authoritative fishing-rule gaps remain unresolved, and occurrence/diet/administrative geometry cannot establish fishing permission or safety. This receipt closes no broader launch gate.
