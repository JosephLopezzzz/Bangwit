# Bangwit privacy and Cavite pilot review packet

Prepared: 17 October 2026. Status: factual review packet and draft updates; no legal approval or participant sessions.

Source at the start of the 17 October review: `cadbca7f96f359322a8bbf46f02d6bf2c5b960a8` on `main`. The resulting `prototype-5` change set was committed as `d167145`, pushed, and briefly deployed as Production before the owner authorized restoration of `cadbca7` through Vercel Promote. The earlier statement that it had not been pushed or deployed was superseded by those events. See the [release recovery record](releases/cavite-production-recovery.md).

19 October follow-up: the local draft is now `prototype-6` to disclose the owner's support-email retention decision. The owner confirmed there is no qualified reviewer yet; final policy/participant-notice approval remains pending. The [decisions and reviewer handoff](CAVITE_PRIVACY_REVIEW_DECISIONS.md) records refreshed provider documentation, unresolved hosting questions and the distinction between operator deletion and provider processing. These local changes are not a new hosted release.

For review without reading TypeScript, the [complete bilingual policy snapshot](review/CAVITE_POLICY_DRAFT_SNAPSHOT.md) reproduces the exact English/Filipino Privacy Notice, Terms, acknowledgment labels/statuses, checkbox/button and related provider-defined text from source commit `2f08dc7fe01d8b27613613df8e1cc50ff04afe7d`, acknowledgment `prototype-6`. Its source fingerprints and 110/110 exact-text comparison identify the copied draft; they do not approve it, select a pilot release or establish deployed wording. Privacy/Terms retain their respective 19/17 October app dates.

## Confirmed owner decisions

The project owner confirmed in the conversation on 17 October 2026 that Joseph Lopez monitors `tepezzzz070@gmail.com` as the public privacy/support inbox. The personal email used for the NAMRIA inquiry stays private.

For pilot feedback, the owner selected a private local folder, access by Joseph only, deletion 30 days after each session, and no audio/video recording. The empty working directory has been prepared at `%LOCALAPPDATA%\Bangwit\pilot-feedback`, outside the repository. No participant notes were created. These are project operating decisions, not an audit of device access controls or encryption.

The owner also confirmed on 17 October 2026 that Bangwit is currently an independent personal project and there will be no participant compensation. No school affiliation or institutional approval is claimed. The tested pilot build/URL and reviewer sign-off remain pending.

## Data and processing inventory

| Data | Purpose and location | Access and lifecycle | Evidence / limit |
| --- | --- | --- | --- |
| Catch entries, optional manually entered place labels and photos | Personal journal, My Species, export/restore; IndexedDB `bangwit-local`, store `catches` | People with access to the same browser profile/device; retained until user deletion, browser clearing or eviction | `src/lib/storage/catches.ts`; no network code in that module and no catch-upload route found in this source check. Source review is not a current production traffic capture. |
| Profile choices, interface preferences and acknowledgment version/time | Optional setup, interface settings and prototype acknowledgment; localStorage | Same browser/device access; controlled through existing UI | `src/components/bangwit-provider.tsx`; acknowledgment records version/time, not proof of legal adequacy or consent for future processing. |
| Public advisory snapshot | Display public coverage, retain a dated copy locally | localStorage `bangwit.public-advisories.v1`; excluded from catch backups and removed by Settings erasure | `src/components/use-map-advisories.ts`, `src/app/settings/page.tsx`; the cache does not establish current conditions. |
| Browser requests for documents/assets and `/api/advisories` | Serve the website, public advisory retrieval and hosting operation | Vercel receives request metadata; see the hosting facts below | Browser advisory GET omits credentials and sends no catch/profile/spot/GPS fields. Ordinary transport metadata is still visible to the host. |
| Exported backup | User-controlled recovery file containing catch details and photo bytes | User chooses file destination and deletion; app erasure cannot delete copies outside browser storage | Existing Settings and backup implementation; backup files are private and are not feedback artifacts. |
| Proposed pilot task notes and session receipts | Understand interface problems and document setup, task outcomes, participation choice and deletion; fields are itemized below | Joseph only; private local folder; session-level notes and working/receipt copies deleted within 30 calendar days of the respective session | Proposed/uncollected; code-based records are not assumed anonymous. Optional experience/choice fields and final collection procedure require notice review. The 30-day rule does not define journal, hosting or email retention. |
| Voluntary support email | Respond to a question sent to the monitored public inbox | Owner confirmed on 19 October: retain correspondence for 90 days after resolution, then delete working copies and empty Trash; Google/provider processing is separate | Detailed exceptions/rights procedures need reviewer approval. No mailbox settings or contents were inspected. Do not ask for catch backups, private photographs, passwords or precise spots. |

### Proposed pilot fields

This is a factual inventory of the blank [results template](CAVITE_PILOT_RESULTS_TEMPLATE.md), [session guide](CAVITE_PILOT_SESSION_GUIDE.md) and [runbook](CAVITE_PILOT_RUNBOOK.md), not authorization to collect their fields. No participant records or results have been created. The reviewer must decide which proposed details are necessary and how the notice/choice process covers them. A participant code combined with dates, device details or distinctive observations may remain linkable; do not describe the working notes as anonymous.

| Proposed record | Fields currently requested by the materials | Access, retention and review boundary |
| --- | --- | --- |
| Round and build preparation | Round ID/scope; readiness owner/date/evidence; reviewed notice/version and owner/reviewer references; choice-procedure reference; source commit and clean/dirty change-set reference; actual served build/source evidence and origin; relevant acceptance date/observer/device context; task version/language/timing rule; synthetic species/photo fixture reference; facilitator/custodian | Project preparation can exist without participant data. A later round record adds actual started-session/group counts and deviations. Keep source/build facts distinct from participant-level observations; no new retention period for general project records is selected here. |
| Session context and notice-choice receipt | P-code; session date/time in Asia/Manila; optional self-described beginner/experienced/not-stated category; device/model, OS and browser version, viewport, installed/browser context and language; notice version, whether provided before start and participation choice under the future approved process | Proposed session-level records in the private folder, Joseph-only project access; delete with that session's notes/working copies within 30 calendar days. No signature, name/contact mapping, inferred experience or livelihood details. Optional category and receipt fields remain subject to review; the app acknowledgment is separate. |
| Task observations and stops | Task T1–T6; start/end times; U/A/F/S; help or skipped reason; first interpretation and brief paraphrased observation; issue ID/priority; early stop/withdrawal and handling reference | Same session-level 30-day boundary. Minimize free text; no personal stories, distinctive quotations, exact fishing locations, real catches/photos, credentials, identifiable screenshots, audio/video/screen recording or automatic transcription. Accidental personal data requires the reviewed handling procedure before collection resumes. |
| Synthetic setup and task evidence | Initial journal count; cache/worker readiness and fixture reference; T4 A/B counts, photo/units readability and draft state after reconnect; T6 export/download success, private-destination understanding and restore implications | When attached to a P-code or observation, these fields share that session's 30-day boundary. Use fictional fixtures only; omit identifying download paths. Synthetic fixtures/software-only QA artifacts are separate from participant notes; this does not assign them a new retention period. Never collect or ask to email a personal backup. |
| Issue register and round tally | Issue ID/priority, task/affected build, non-identifying problem and raw frequency, fix/decision, owner, verification/retest and status; U/A/F/S, assigned/attempted denominators, skipped reasons, optional broad-group counts and interpretation checks | Any session-linked or identifying detail remains in private working notes and is deleted by its session deadline. Only reviewed aggregate counts and non-identifying interface issues may form a retained report; its necessity, disclosure and retention wording remain for review. Do not retain code traces or per-person rows as an aggregate report. |
| Deletion/reminder receipt | P-code/session date; due date; reminder reference; working/exported copy checks; actual deletion date/custodian; exceptions or unresolved copy locations | Same private access and session deadline. Remove session-level receipts with the notes, including recoverable copies under the reviewed procedure. A retained report may record only an aggregate deletion check date/count without recreating individual sessions. No reminder or purge is created by this inventory. |
| Future round decision/report | Raw task-target outcome, open blockers/paused tasks, fixes/verification, common barriers/refinements, deferrals/reasons/owners, cohort/device/language/assistance limitations, next content proposal/dependencies, decision/owner/date/build reference | No results or decision are prefilled. Review the report for identifying details before retention or any disclosure; general report retention is not supplied by the 30-day note rule or 90-day support-email rule. |
| Recruitment logistics, if later authorized | No channel, contact roster, scheduling record or associated fields have been selected or collected in these materials | The runbook treats logistics separately. Define its minimum data, access, notice and retention before invitations; do not infer them from the pilot-note or support-email decisions. No outreach is authorized by this inventory. |

The owner-confirmed 30-day deletion rule covers session notes and their working/session-level receipt copies. It does not establish when Vercel/Google erase their records, delete a participant's own journal/backups, approve a participation-choice process, or decide the lifetime of a later aggregate project report.

The [19 October folder setup receipt](CAVITE_PILOT_RUNBOOK.md#empty-folder-setup-receipt--19-october-2026) records zero entries and a Windows DACL restricted to the current owner/user, SYSTEM and local Administrators after removal of an inherited automation-group read grant. Original permissions were saved outside Git. This is not an exclusive-access, encryption, backup/sync or retention audit: owner processes and privileged principals retain access, and reminder/deletion operation remains unverified. No notes were collected and G5 remains pending.

## Hosting facts observed read-only

The existing signed-in Vercel browser session was used on 17 October 2026. No settings, memberships, access protections or services were changed; no credentials or individual visitor-log records were copied.

| Surface | Observed fact | Interpretation limit |
| --- | --- | --- |
| Vercel team/project header | Bangwit is in the Hobby team `josephlopezzzzs-projects` | A dated account observation, not an assumption from the local `vercel.json`. |
| Production deployment overview | `https://bangwit.vercel.app/` is Ready at deployment `4MytvJzrn7UseSmUM19eubP5MT7p`, branch `main`, commit `cadbca7f96f359322a8bbf46f02d6bf2c5b960a8` | Read-only dashboard check on 17 October 2026. This matches the checkout HEAD at the start of this review; it does not include the reviewed policy or research updates below. |
| Existing preview deployment | The Ready preview branch `codex/https-preview-20261015` points to commit `6143041ddfe8d5695aa401141478ccf629fa8769` | This is an older preview, so it cannot verify the current working copy. No new preview or production deployment was created. |
| [Project Drains](https://vercel.com/josephlopezzzzs-projects/bangwit/settings/drains) | Empty first-drain/upgrade state | No configured project drain was shown. |
| [Team Drains](https://vercel.com/josephlopezzzzs-projects/~/settings/drains) | Explicitly no drains associated with the team | Does not rule out Vercel's own operational processing or subprocessors. |
| [Team Members](https://vercel.com/josephlopezzzzs-projects/~/settings/members) | One listed member, role Owner | Current dashboard account access; not a claim that provider staff never access operational data. |
| [Bangwit Logs](https://vercel.com/josephlopezzzzs-projects/bangwit/logs) | Last hour is available; longer ranges require plan upgrades | A dashboard history limit is not a universal deletion guarantee. No individual log detail was opened. |
| Existing Bangwit deployment overview | Web Analytics and Speed Insights labeled Not Enabled | No feature was enabled. Source inspection also found no corresponding client integration. |
| Public Production API GET, `2026-10-17T09:09:43.220Z` | `/api/advisories` returned HTTP 503, `{status: unavailable, reason: not_configured}`, `Cache-Control: no-store, max-age=0` | Confirms only that endpoint response at that time; not a deployed-SHA, network-capture or offline acceptance claim. |

### Provider documentation checked

- [Runtime logs](https://vercel.com/docs/logs/runtime): the documented Hobby runtime-log retention window is one hour. Request metadata may include route/path, method, timestamp, status, host and browser user-agent information. This supports a bounded runtime-log disclosure.
- [Platform limits](https://vercel.com/docs/limits): build logs are retained with deployments rather than sharing the runtime-log window. Do not describe all Vercel data as deleted after an hour.
- [Vercel Privacy Notice](https://vercel.com/legal/privacy-notice): describes end-user traffic metadata, provider purposes, recipients and retention. It distinguishes provider-controller processing from customer-directed processing under a separate agreement. This review does not classify every Bangwit data flow legally or establish one retention period for CDN/security/system data.

`vercel.json` specifies framework/install/build commands only. It cannot prove account logging settings. The source route requires both reviewed-feed settings before fetching a publisher; no future publisher, scheduler or data store has been provisioned.

## Pilot notes operating procedure

1. Use a participant code such as `P01`; keep names, private contacts, exact spots, real catches and personal photos out of task notes. Use the existing synthetic-data session guide and results template.
2. Save completed session notes only in the private local folder. Do not commit them, send them by email, add them to a cloud share, or paste them into public issues. Record the session date and a deletion date 30 calendar days later.
3. Joseph is responsible for the deadline and any earlier withdrawal/deletion request that can be located by participant code. Before the first session, establish the reminder in a system Joseph uses; no automated purge or calendar event was created by this task.
4. Remove the session note and any working/exported copies by the recorded deadline. Keep the public report to aggregate task counts and non-identifying issue summaries; review any quotations or distinctive details before reuse.
5. No audio/video recording is part of this setup. Any later proposal changes the operating plan and notice before that collection starts.

## Remaining review decisions

The [NPC right-to-be-informed guidance](https://privacy.gov.ph/the-right-to-be-informed/) is the review checklist for data, purposes, scope, recipients, responsible identity/contact, retention and rights. This packet supplies facts and open questions; it does not decide the applicable legal basis or controller/processor roles.

- Confirm the final operator/controller wording, purposes/processing basis, rights/request process and any applicable complaint route with the qualified reviewer.
- Resolve retention and recipient wording for hosting metadata beyond the runtime-log window. Review the confirmed 90-day support-email procedure, including exceptions, copies, resolution/reopening and request handling. The 30-day pilot-note rule is a separate lifecycle.
- Select the fixed pilot build/URL and complete/review the participant notice before inviting participants under the existing project plan. The owner decisions on compensation and current project context are resolved; reassess the notice and any applicable review process if an institution later becomes involved.
- Recheck these account facts if the plan, memberships, analytics, drains, publisher or hosting provider changes.

Related artifacts: [technical review](../PRIVACY_REVIEW.md), [participant notice draft](CAVITE_PILOT_PARTICIPANT_NOTICE.md), [session guide](CAVITE_PILOT_SESSION_GUIDE.md), [results template](CAVITE_PILOT_RESULTS_TEMPLATE.md), and [implementation plan](CAVITE_PILOT_IMPLEMENTATION_PLAN.md).

## Verification for this change set

- `test:i18n` 6/6, `test:storage` 2/2 and `test:offline` 5/5 passed; typecheck, scoped Biome lint/format and production build passed. The build generated 38 precache entries.
- Browser check used Brave on the local production build at `http://127.0.0.1:4189/policies`, a separate test origin. The English and Filipino contact/hosting/cache text rendered; the language control worked. The English setting was restored afterward.
- On the fresh-origin first-use gate, the acknowledgment started disabled, scrolling the policy reader to the end enabled the unchecked checkbox, and switching language reset scroll progress and disabled acknowledgment again. No agreement was submitted. No catch, backup or participant record was created or restored during this browser check, and no browser console errors were recorded.
- The private pilot directory was checked to have zero entries. Markdown link/reference checks and `git diff --check` cover the documentation changes.

This was a scoped local `prototype-5` copy/gate check and existing storage/precache regression proof. It did not test reacknowledgment over an existing populated journal, current production traffic, physical-phone or installed-app behavior, legal approval, or a participant pilot. The later publication/restoration events are recorded above; this historical browser check itself performed no deployment. Verification for the 19 October `prototype-6` follow-up is recorded in the implementation plan.

The 19 October `prototype-6` build and scoped bilingual first-use check passed without accepting an agreement. A later, separately authorized [populated-journal upgrade check](CAVITE_POLICY_UPGRADE_ACCEPTANCE.md) passed at `http://127.0.0.1:4194`: one synthetic restore under `prototype-4`, revised notice review/acceptance under `prototype-6`, preserved catch/photo/units after reload, and actual exports identical except `exportedAt`. Both test acceptances were explicitly approved by Joseph; no real journal or participant data was used. This local result does not complete legal review, current Production traffic, worker/offline, phone or participant acceptance. The earlier private-folder check found zero entries; no participant data or mailbox content was accessed.
