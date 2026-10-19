# Local policy upgrade acceptance — prototype-4 to prototype-6

Observed: 19 October 2026, Asia/Manila. **PASS for the scoped synthetic journal upgrade below.** This is a local desktop browser check, not legal approval, participant research or Production acceptance.

## Fixed source and setup

| Item | Recorded evidence |
| --- | --- |
| Browser and origin | Codex in-app browser; the same `http://127.0.0.1:4194` origin before and after. Exact browser-engine/OS version was not captured. |
| Old source/build | `27b3b1b94810ff7155c203caf85ad0fe8001a280`, clean recovery tree identical to `cadbca7`; built with the locked dependencies, notice `prototype-4`. |
| Revised source/build | `d6c6d2ecfb2dea626148ca88b8a7391d6a6ffa46`; existing successful local production build, notice `prototype-6`. No code was changed for this test. |
| Authorization | Joseph explicitly authorized both local draft-notice acceptances and one synthetic catch/photo restore. No real journal or participant data was used. |
| Fixture | One `SYNTHETIC policy upgrade` entry, a fake manual label, `7 in`, `2 lbs`, released status, test notes and an 80 × 80 SVG containing TEST. Original timestamp and ID were supplied by the fixture. |
| Data isolation | The journal visibly contained zero records before restore. Browser storage, IndexedDB, site data and worker caches were not cleared during the upgrade. No second restore, save or record deletion was performed. |

## Observed sequence and results

1. Read the old combined notice to its end, checked its agreement and selected Agree and continue. Skipped the optional profile and guide; the journal showed zero catches.
2. Restored the synthetic JSON through Settings' file chooser and confirmation. The journal showed one catch. Details showed the fake label, released status, notes, `7 in` and `2 lbs`. Both gallery/detail image elements decoded at 80 × 80.
3. Downloaded and inspected the baseline backup. Its format/version were `bangwit-catches` / `1`; its entire `catches` array, including photo bytes and metadata, exactly matched the input fixture.
4. Stopped the old local server and started the revised build on the same address/port. Reloaded `/catches`. After hydration, the revised notice appeared with the 19 October date and new 90-day email paragraph; its agreement checkbox and continue button began disabled. The previous acceptance did not bypass the revised gate.
5. Scrolling to the end enabled the unchecked checkbox. Under Joseph's explicit test approval, checked it and accepted the revised notice. Optional setup reopened; Skip left the profile unset. English remained selected. The journal showed exactly one catch and its details/photo/units still matched.
6. Downloaded a second backup and compared both parsed exports. Every field except top-level `exportedAt` was identical, including record ID, date, fake label, units, notes, disposition, `savedAt`, `syncStatus`, photo type/name/lastModified and base64 data. Record count remained one.
7. Verified the `/catches` route, then reloaded it again. After hydration, the synthetic catch was visible and the agreement did not recur. There was one matching catch heading and zero Agree and continue buttons. No browser error logs were returned.

The export buttons first open confirmation dialogs. An initial download-event wait was started before that dialog was confirmed and timed out; no download occurred at that step. The subsequent confirmed downloads succeeded and their actual files were inspected. An early reload check ran before the link navigation settled and remained on Settings; after confirming the `/catches` route, the journal reload check passed. Neither harness sequencing issue is recorded as an application failure or substituted for the final proof.

## Local evidence receipts

Synthetic artifacts remain outside Git in the session workspace's `outputs/qa-policy-upgrade/` folder: `synthetic-upgrade.json`, `before-upgrade.json`, `after-upgrade.json`, `export-comparison.json`, `after-upgrade.jpg` and the updated handoff note. The screenshot shows the preserved catch details, decoded TEST image and both units. No private journal, participant record or real photo is part of these artifacts.

| Receipt | Value |
| --- | --- |
| Baseline export time (UTC, from file) | `2026-10-19T15:15:22.711Z` |
| Revised export time (UTC, from file) | `2026-10-19T15:20:02.281Z` |
| Synthetic photo SHA-256, both exports | `12d4066701d354cdcff382caae9884c344b3521715a2e5fa2d6be01c6e643775` |
| Identical export payload SHA-256 | `152f6d21855be50d3412f90569355a4f22c38350996080bf5ca4dd0225302220` |

The payload receipt hashes `JSON.stringify` of the parsed export with only top-level `exportedAt` omitted. Deep equality was also checked; the hash is not the sole comparison.

## Limits and remaining work

- The old/revised version identities are tied to the built source and observed notice content. Raw acknowledgment values/timestamps were not directly read: the CDP DOMStorage method is unsupported here. Persistence of acknowledgment is supported by the revised gate and successful later reload, rather than a fabricated localStorage receipt.
- No worker-control/cache/activation instrumentation, offline transition, installed-app or physical-phone check was performed. Source changes to storage, types, worker and layout are absent between these two trees; the test does not prove every service-worker upgrade scenario.
- These exports contain a single synthetic entry. The test does not establish production traffic privacy, arbitrary real-journal compatibility, source/legal correctness, final notice adequacy or participant-pilot results.
- Public Production assets checked at `2026-10-19T15:23:27.854Z` returned `prototype-4`. Remote `main` was `d167145`; the remote review branch was already `d6c6d2e`. This verification performed no push or deployment and did not freshly inspect the signed-in Vercel dashboard. The [recovery proposal](releases/cavite-production-recovery.md) remains separate.

This closes the specifically pending local populated-journal reacknowledgment check in the [implementation plan](CAVITE_PILOT_IMPLEMENTATION_PLAN.md) and [privacy packet](CAVITE_PRIVACY_REVIEW_PACKET.md). M4 qualified review, outstanding rule-source questions, fixed approved pilot release and M5 participant sessions remain pending under the [pilot runbook](CAVITE_PILOT_RUNBOOK.md).
