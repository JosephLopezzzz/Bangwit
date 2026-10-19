# Bangwit Cavite pilot session guide

Prepared: 19 October 2026. **Preparation only — recruitment and sessions remain closed.** The [participant notice](CAVITE_PILOT_PARTICIPANT_NOTICE.md) is not approved and no fixed tested pilot build has been recorded. No participants or results are recorded in this guide.

Use the [runbook](CAVITE_PILOT_RUNBOOK.md) for readiness gates, the build receipt, recruitment preparation and deletion procedure. Use a private copy of the [results template](CAVITE_PILOT_RESULTS_TEMPLATE.md) for observations; never complete it with participant notes in Git.

## Session setup

- Proposed audience: 5–8 Cavite fishers, with beginner and experienced fishers both represented; aim for at least two of each where recruitment allows. Broad self-description is optional and subject to notice review. Do not collect addresses, exact fishing locations, livelihood details or proof of experience.
- Project context: Joseph Lopez's independent personal project. Participation is voluntary, any task may be skipped, and compensation is none. No institutional approval is claimed.
- Confirm the reviewed notice/version and choice process before notes or tasks. The app acknowledgment is not pilot participation consent. Do not obtain agreement through this draft guide.
- Confirm the round's fixed-build receipt and exact HTTPS origin. Do not change the build, origin or task wording within the round. An unplanned update pauses the round for relevant checks and a new receipt.
- Use an isolated test browser profile with an empty journal. Do not inspect a participant's personal browser profile. No accounts, real catches, private photos, exact spots, GPS or personal contacts are needed.
- Prepare the reviewed synthetic photo fixture and these values: `50 cm`, `1000 g`, place `Demo Cove — synthetic`, notes `Pilot example A — fictional` and `Pilot example B — fictional`. They are examples, not Cavite occurrence evidence. Use a supported identified species for A and the app's unidentified option for B; record the chosen species in the round fixture receipt.
- Cache/load the build online in the test profile and confirm worker control before an offline task. Start tasks from the pre-agreed state; facilitator setup is not participant task completion.
- Record date, participant code, language, device model, OS/browser version, viewport and installed/browser context. Keep only the information needed to reproduce an interface problem.
- Keep deidentified notes on Joseph's device in `%LOCALAPPDATA%\Bangwit\pilot-feedback`, with Joseph-only project access and deletion due 30 calendar days after each session. No audio, video, screen recording, identifiable screenshot or automatic transcription is part of this pilot.

## Opening script — proposed wording for notice review

“Thanks for trying Bangwit, Joseph Lopez's independent personal project. We are testing the design, not you. Participation is voluntary, there is no compensation, and you may skip a task or stop without giving a reason. Please use only our fictional example values. Do not enter a real catch, private photo, fishing spot, account or contact detail.

“The prototype's species records are limited and historical. Live warnings are unavailable. Its map does not confirm legal access, fishing permission, safe conditions or navigation routes. Under the reviewed notice, Joseph would keep brief task notes privately, using your participant code, and delete the session notes within 30 calendar days. There is no audio or video recording. The notice explains your choice and how to contact Joseph at tepezzzz070@gmail.com.”

After the reviewed notice and choice procedure, ask the participant to explain in their own words that they can stop and must use fictional data. Clarify neutrally before starting. If they do not choose to take part or cannot understand the reviewed notice, do not start or record task observations.

## Facilitation and scoring

Read each prompt verbatim in the chosen, reviewed language. Allow exploration and neutral think-aloud prompts such as “What are you looking for?” Do not point to a control or name a route before scoring the initial attempt. No time limit is adopted by this draft; agree and record any consistent limit before the round begins.

| Score | Meaning |
| --- | --- |
| U — unassisted | All stated success criteria are met without a navigation hint, demonstration or corrective explanation. Reading the standard prompt and operating the agreed network switch do not count as help. |
| A — assisted | All criteria are eventually met, after a hint, demonstration or correction. Record the help and the participant's first interpretation; correction must not turn a dangerous first interpretation into a U. |
| F — failed | A task was attempted but its criteria were not met, including after help, or the app prevented completion. Record whether the cause appeared to be the interface, test setup or unknown. |
| S — skipped | The task was not attempted, including a voluntary skip or a stop before that task. Record a short non-identifying reason. A task attempted before withdrawal is not relabeled S to hide a failure. |

Tasks not yet offered stay blank while a session is in progress. At closeout, mark every remaining assigned task S, with “session stopped” if applicable. A person who never begins a session is not a completed session or a task result. A U can still have a separate serious issue flag. Preserve the initial outcome even if a later explanation resolves confusion.

## Tasks and completion criteria

### T1 — First-time guide and Help replay

Prompt: “Imagine this is your first visit. Show me how you would learn where to explore and save a catch. Try moving forward and back in the guide, leave it when you are ready, and then show me how to open it again.”

Success: discovers/uses the first-time guide, moves Next and Back, exits by Skip or Finish, and reopens it with Help. Record exit choice, replay discovery and whether it interrupts the task. Do not require both Skip and Finish for one success.

### T2 — Species and source

Prompt: “Choose Cavite and find one species record and its source. Tell me what the record does and does not prove.”

Success: reaches a record and its citation/source, and recognizes historical evidence does not prove current presence, a particular bay, legal permission or safety. Record the initial explanation before offering any clarification. A displayed source link can be identified without requiring a third-party page to load offline.

### T3 — Unavailable or stale coverage

Prompt: “The advisory says unavailable. What does that tell you, and what would you do next? Imagine it instead showed an old update: would that change your answer?”

Success: recognizes that unavailable/stale information is not an all-clear, and would check the official source independently before relying on it. The old-update part is a labeled verbal scenario; it is not a claim that live alerts work. Do not alter the feed or present fictional alerts as real. Record any dangerous first interpretation even if corrected.

### T4 — Offline save, reopen and reconnect

Prompt: “Use example A to save a fictional catch and photo while offline, then reopen it. Start example B as a new draft. When the connection comes back, check the draft and save it once.”

Before the task, the facilitator confirms the recorded online cache/worker setup and zero saved entries; switching the test device/profile offline and online on cue is standard setup. Do not disconnect someone else's connection or clear storage. Use only the prepared photo fixture and fictional values.

Success checks, all required for U/A:

1. Offline save A; after reopen/reload it has readable photo and correct values/units, and the journal count is exactly one.
2. Start B with the unidentified choice and fictional note/photo; reconnect before saving. The draft and photo stay intact.
3. Save B once; reopen the journal and confirm exactly two entries, one of each example, with readable photos and values.

Record observed counts and any reload/network problem. If a prerequisite prevents a real attempt, use S with the setup reason; if an attempted save fails, use F. Saved-data/photo loss, corrupted backup or accidental duplication is a blocker. Preserve a short deidentified description and stop affected tasks; do not retry until the failure disappears and report it as an initial pass.

### T5 — My Species meaning

Prompt: “Open My Species. How are the identified example and the unidentified example treated? Does this collection establish what fish are present in Cavite?”

Success: explains the build's identified/unknown behavior and recognizes that a personal collection is not verified regional occurrence evidence. Record actual UI behavior. If T4 failed, a prepared separate synthetic profile may be used only as a recorded setup assistance; never invent a T4 completion. Mark T5 S if the necessary test state is unavailable.

### T6 — Private journal backup

Prompt: “Make a backup of this fictional journal. Where would you keep it privately, and what would you check before restoring a backup?”

Success: exports the synthetic journal, identifies the download, explains that it contains private journal/photo information, and knows to check the destination and restore behavior before using a populated journal. Record export success and explanation separately. If T4 failed, use a recorded prepared synthetic profile or mark S; do not improve the T4 score.

Observed participant tasks do not restore over any populated journal. If a restore is needed to investigate an issue, stop and use a separately authorized empty synthetic profile under the runbook. Never ask the participant to email or upload the backup.

## Observation and proposed thresholds

Record start/end, U/A/F/S, exact help, brief confusion/interpretation, issue ID and severity for each task. Use paraphrases without distinctive personal details. Do not capture participant photos, voice, screen recordings or verbatim personal stories.

T1, T2, T4 and T6 each have a proposed target of at least 80% U. Report `U / all assigned participants` alongside U/A/F/S counts and skipped reasons; optionally show `U / attempted` as a separately labeled figure. Never quietly remove skipped tasks or assisted completions from the primary denominator. See the results template for arithmetic and raw-count reporting.

No unresolved interpretation may turn historical evidence, missing warnings or an outline into current presence, permission or safety clearance. No saved-data loss or duplication may remain unresolved. After a blocker, pause affected sessions, fix the cause and run relevant synthetic checks before another participant is exposed to it. Report the first result and any later retest separately.

## Closeout

Ask: “What was hardest to understand?” and “What one change would help you most?” Do not ask for real fishing spots or catches. Thank the participant and remind them of their code, voluntary choice and the monitored contact route in the reviewed notice.

Save minimal notes privately, enter the session date and 30-calendar-day deletion deadline, and establish the reminder required by the runbook. Check all downloads/working copies, then remove the temporary synthetic journal/profile and backup once required checks are complete. Confirm the profile has no participant-owned data before deleting it. Do not inspect a personal profile to make this determination. If personal data was entered accidentally, stop ordinary collection and follow the reviewed privacy handling process.

No completed session, notice approval, reviewer sign-off, recruitment, device acceptance or live-feed activation is implied by preparing this guide.
