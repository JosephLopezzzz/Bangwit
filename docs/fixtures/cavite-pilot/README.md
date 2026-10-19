# Cavite pilot synthetic catch fixtures

Prepared 19 October 2026 for the [session guide](../../CAVITE_PILOT_SESSION_GUIDE.md), tasks T4-T6. These are shareable fictional inputs, not catch records, regional evidence, participant data or a backup to import. Preparation does not approve a notice, accept an app policy or authorize sessions.

## Original photo fixture

Use [synthetic-catch.svg](synthetic-catch.svg) for both A and B. This ASCII-only, 320 by 200 SVG was created for this project during this preparation from simple shapes and text. It contains no personal photo, real fish identification, third-party artwork, external resource, script or embedded image. No third-party provenance or license is claimed. Share this original file with the specification; do not replace it with a participant photo or screenshot.

The source accepts an `image/` file up to 10 MiB; this fixture uses MIME type `image/svg+xml` and is far below that limit. Verify file selection, preview and reopening on the fixed test build/device before sessions. XML/source checks are not device acceptance. If the device cannot select or render the SVG, record a setup issue and resolve it before a participant task; do not silently substitute another asset.

## Exact A/B inputs

Before each session, record `SESSION_DATE` as the test device's local date in `YYYY-MM-DD` form, together with its time zone. Both examples use that same date. The app initializes and resets the form date to device-local today; verify it for each example. Use the calendar/Today control as needed. If local midnight passes, retain the recorded session date by selecting it explicitly for B. No future date is required.

Keep the literal strings below unchanged in either language. `Leave empty` means enter no characters, not the words "Leave empty".

| Form field | Example A: save offline | Example B: draft offline, save once after reconnect |
| --- | --- | --- |
| Species | `SYNTHETIC pilot A` | Leave empty |
| Date | Recorded `SESSION_DATE` | Same recorded `SESSION_DATE` |
| Water type | Saltwater; stored value `Saltwater` | Saltwater; stored value `Saltwater` |
| Location / Lugar | `Demo Cove - synthetic` | `Demo Cove - synthetic` |
| Length / Haba | `50` with unit `cm` | `50` with unit `cm` |
| Weight / Timbang | `1000` with unit `g` | `1000` with unit `g` |
| Bait or lure / Pain | Leave empty | Leave empty |
| Catch status | `Released` | `Released` |
| Notes | `Pilot example A - fictional` | `Pilot example B - fictional` |
| Photo | Original `synthetic-catch.svg` | Same original `synthetic-catch.svg` |

Location is a manually typed fictional label, not a coordinate, detected position or claim about a real cove. No GPS is involved. The measurements and Released status describe fictional examples only. Saltwater, Released, `cm` and `g` are the current form defaults; verify them rather than relying on a previous draft. Saving A resets the form and removes its selected photo, so select the original SVG again for B.

Use the Catch and Details form tabs for these values. Open A after its offline save/reload; there should be exactly one saved entry. Prepare every B field/photo while offline, reconnect without reloading or leaving the draft, verify its values/photo, and save once. Reopen the journal: there should be exactly two entries, distinguishable by species/notes. Do not prefill either record by importing a backup for the scored T4 save task. App-generated IDs and `savedAt` timestamps are not fixed fixture values.

## Expected collection behavior: source review only

The Species input is optional free text, not a species picker. A deliberately uses an obviously synthetic name. The form saves B's empty species as `Hindi pa natukoy` in either UI language. Journal display resolves that value to `Unidentified` in English or `Hindi pa natukoy` in Filipino.

My Species excludes empty names and names equal to `Hindi pa natukoy` or `Unidentified` after trimming and case normalization. Other names are grouped without regard to case; there is no biological validation here. Expected state after A/B: one group named `SYNTHETIC pilot A` containing A, one unknown-catch notice for B, and both records in My Catches. A's collection card is not evidence that a real fish was identified or is present in Cavite.

These expectations were traced in [catchbook-page.tsx](../../../src/components/catchbook-page.tsx), [labels.ts](../../../src/i18n/labels.ts) and [My Species](../../../src/app/my-species/page.tsx). They have not been browser-verified by preparing these fixtures. Record actual fixed-build behavior before sessions and keep any mismatch separate from the expected result.

## Fixture receipt

Prepared SVG receipt: 829 bytes, 320 by 200, SHA-256 `dbd8305915d9884a372c8ab48f0267c6b5a003fdbd72646badc5edc03abb239e`. This hashes the prepared file's exact bytes; recheck after any byte or line-ending change. XML/ASCII checks found no external resources, scripts or embedded images; this is source validation, not a rendered-device pass.

Record the fixed build/HTTPS origin from the runbook, this specification/photo paths and revision, the original SVG's SHA-256, resolved `SESSION_DATE` and time zone, interface language and test device/browser. Record actual preview/save/reopen results separately; a prepared receipt is not a pass. Any synthetic journal exports created later stay outside Git and retain the runbook's private working-copy handling.
