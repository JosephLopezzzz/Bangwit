# Map advisories

Release stage: opt-in warning demonstration and gated normalized ingestion. Live warnings are not enabled. No current flood, severe storm, navigation or fishing-safety claim is made.

## Shipped behavior

- Default map: unknown/unavailable coverage, with links to official bulletins.
- Explicit preview: fictional Cavite rainfall/flood warnings, Batangas marine warning and Laguna thunderstorm advisory. The timeline is fixed at 1 January 2026, 14:03 PHT. The outage scenario advances to 18:03 PHT to demonstrate expired last-known warnings. Preview data is never a live fallback, cached as live, or sent by the API.
- The map fill shows the highest matching display level; the original category and all hazards remain in province details. Active warning colors survive hover, selection and keyboard focus. Unknown or clear regions use a soft sage interaction highlight with a thin polygon outline; sage does not indicate verified coverage or safety. The province name is unboxed text anchored beside its shape.
- A static, dismissible callout keeps the urgent province visible at national zoom. Its select button opens that province's details and its separate X dismisses only the callout. The warning count, legend, map fills and a restore action remain visible. A new alert or changed issue/expiry time, severity, demo scenario or stale state resurfaces the callout.
- The region panel X, map heading toolbar toggle, or Escape within the map workspace dismisses the entire region sidebar and urgent callout. The map expands to the available width and focus returns to the toolbar toggle. Dismissal preserves the selected province and camera. The toolbar reopens details; selecting a province by map, searchable dropdown or warning callout also reopens them. On mobile, this dismissal is separate from the existing detail-content disclosure.
- Partial-province and coastal alerts retain their locality lists. Province shading only indicates that listed areas are covered.
- Incomplete, offline, malformed, future-dated or stale data cannot produce an all-clear. Complete fresh coverage permits the narrower phrase “No active warnings in checked feeds”.
- Failed, omitted, regressed or reduced-coverage source publications retain the last accepted source/records with a stale label and hatch; incoming records from that source are discarded. Effective cancellations/superseding updates from healthy publications are honored; older envelopes and cyclic update references are rejected.

## Source review — 15 October 2026

| Product | Official reference | Integration status |
| --- | --- | --- |
| Rainfall/thunderstorm | https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd | Publishing page reviewed; stable structured access, cadence and reuse terms pending |
| Cavite regional weather and warnings | https://pagasa.dost.gov.ph/regional-forecast/slprsd | Southern Luzon publishing page reviewed 17 October 2026; regional, not a Cavite-only feed. See [source assessment](research/CAVITE_PAGASA_SOURCE_ASSESSMENT.md). |
| TenDay forecast API | https://tenday.pagasa.dost.gov.ph/static/media/api-doc.c9cf6abbaa781437ed96.pdf | Official forecast API documented; requires an approved token. Forecasts are not active warnings. No token or warning adapter is configured. |
| Rainfall meaning | https://www.pagasa.dost.gov.ph/information/rainfall-and-thunderstorm-warning-system | Interpretation reference; not a live feed |
| Tropical cyclone wind | https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin | Raw bulletin adapter and category mapping pending |
| Flood | https://floodcaster.pagasa.dost.gov.ph/ | Direct retrieval timed out during this check; integration pending |
| Marine | https://www.pagasa.dost.gov.ph/marine/gale-warning | Publishing page reviewed; seaboard matching pending |
| Older CAP feed | https://publicalert.pagasa.dost.gov.ph/feeds/ | Historical WMO listing found; direct retrieval timed out and web retrieval failed. Not configured |

Do not infer observed flooding from rainfall, or treat cyclone wind signals as rainfall/flood levels. An adapter must retain forecast/observed language and native categories. Review the hazard-specific mapping to the three overview levels against official meanings.

The TenDay API is not the warning source. Its documented approval/token gate is unresolved, and Bangwit has no government partner or approved token. The public Southern Luzon page is the current manual fallback link only; it does not establish automated warning access or complete Cavite hazard coverage. Keep the live API unavailable. See the dated [Cavite PAGASA assessment](research/CAVITE_PAGASA_SOURCE_ASSESSMENT.md).

## Live publisher contract

The route is GET /api/advisories. Without both server-only settings below, it returns HTTP 503 with an unavailable status:

~~~text
BANGWIT_ADVISORY_FEED_URL=https://<reviewed-normalized-publisher>/<snapshot.json>
BANGWIT_ADVISORY_FEED_REVIEWED=true
~~~

These are deployment settings, not a user UI switch. Do not enable them merely to populate the map. The publisher must normalize a reviewed official source into this versioned JSON contract:

- Snapshot: version = 1, mode = live, generatedAt (the actual publisher check time), sources, alerts.
- Source: id, name, official HTTPS PAGASA url, provinceIds, hazards, checkedAt, status (ok or unavailable).
- Alert: id, sourceId, hazard (rainfall, thunderstorm, wind, flood or marine), level (advisory, warning or emergency), officialLevel, bilingual title/description/instruction, areas, issuedAt, effectiveAt, expiresAt, official sourceUrl, status (active or cancelled), supersedes.
- Area: provinceId, scope (province, partial or coastal), localities. Partial/coastal scope requires named locations.
- Times: explicit ISO timestamps with timezone. Validity must come from the bulletin or a reviewed product-specific rule. Never refresh an old bulletin's publication time to the current time.

Each healthy source entry is a complete publication for its listed geography and hazards. Failed retrieval must keep status unavailable rather than publish a healthy empty array. The publisher must retain cancellation/update references and a durable last-good snapshot; this repository does not provision a scheduler or durable server store.

The first live adapter is restricted to the existing Cavite feature ID (2640588B43067672764099). It must match named municipalities explicitly. Current PSGC/NCR/independent-city mappings and the 2020 Maguindanao outline need review before national live coverage. Unmatched areas invalidate a snapshot rather than being guessed into a province.

The server checks HTTPS, redirects, JSON content type, a 1 MB limit, known geography, duplicate IDs, source associations, official links, translations and validity. It caches upstream responses for up to 120 seconds; the browser polls the same-origin API every 60 seconds while visible, and on reconnect. Freshness uses publisher/source times with a conservative 10-minute limit. That limit is a prototype policy, not a guarantee of source timeliness, and must be reviewed per product before live activation.

## Cache and privacy

Only sanitized public advisory fields are stored under localStorage key bangwit.public-advisories.v1. Demo data is excluded. Catches, spot labels, profile data and GPS are never included in the advisory request. The same-origin request omits credentials and the configured feed URL stays server-side. Normal HTTP request metadata still reaches the host/source. Settings data erasure removes this public cache; catch backup/restore continues to contain catches only.

The advisory API sends Cache-Control: no-store. The service worker explicitly uses NetworkOnly for this endpoint before its normal runtime cache rules. A controlled last-known snapshot is rendered with visible stale status instead of presenting a cached API response as newly checked.

## Acceptance before enabling live

1. Confirm provider access/reuse terms, publication cadence, stable endpoint, Cavite coverage and cancellation semantics.
2. Implement and validate the raw official-product adapter and source-specific overview-level mapping. Establish durable scheduled ingestion, monitoring and failure reporting outside browser sessions.
3. Replay real historical bulletins against affected municipality lists, changed levels, cancellations, missing/partial feeds and overlapping hazards. Keep raw evidence for review.
4. Check actual publication-to-display latency and outage behavior on HTTPS with the installed service worker and an offline/reconnect cycle.
5. Confirm desktop, phone, keyboard, dark theme, label readability and the demo/live separation. Update Product and home safety copy to the accepted coverage before live activation. Complete the current administrative geography work before national expansion.

Automated state tests establish rendering rules and validation, not the truth or timeliness of an official feed. Live source, deployed-origin and physical-device acceptance remain pending.

## Implementation verification — 15 October 2026

- Passed: 20 focused advisory-state/validation tests, the five existing offline-precache tests, TypeScript without emitting files, focused Biome checks on the 13 changed application modules/styles, and Git whitespace checks.
- Local unconfigured API: HTTP 503 with status unavailable and Cache-Control: no-store, max-age=0.
- The read-only safety review identified the per-source timestamp regression; the fix and empty/downgrade/cancellation regression tests passed.
- The design detector completed. Its new compact-annotation radius findings are documented in DESIGN.md; incumbent Arial/global styling findings were kept outside this change.
- Follow-up browser checks passed locally: desktop and 390px mobile layouts without horizontal overflow; light/dark sage highlighting and unboxed province labels; selected warning colors; panel X, toolbar toggle and scoped Escape dismissal; map expansion, focus return and selection-based reopening; and independent warning-card dismissal/restoration. Escape closes the province dropdown before dismissing the map overlays. Preview was exited after the checks.
- The implementation and UI runs above did not include production build, deployment, physical-device or real-time feed acceptance. The advisory-state and offline tests above were run for the warning implementation; the follow-up highlight/dismissal work was checked with TypeScript, focused Biome, browser interactions and Git whitespace checks. Later release checks are recorded below.

## Application release verification — 15 October 2026

- Verified application source: `43718d65e2c4e1a75346529457365e7288749480`; commit `6143041` changes documentation only. Vercel Production deployment `4zT6gvbqj12BVJDNwziTxKXNLK7S` was observed Ready for the application commit at `https://bangwit.vercel.app/`.
- Local `npm run build` passed on Next.js 16.3.7: build ID `L0PLkFnIojTIuMu1Z6ArC`, 17 route outputs including the dynamic advisory route, and 38 Serwist precache entries (6,053.92 KiB). Standalone TypeScript, 20/20 advisory tests, 5/5 offline tests and 2/2 storage tests passed.
- The public hosting checker passed. Deployed `GET /api/advisories` returned HTTP 503 JSON with `unavailable` / `not_configured` and `Cache-Control: no-store, max-age=0`. The worker returned HTTP 200 JavaScript with root scope and `Cache-Control: no-cache, no-store, must-revalidate`; its source contains the advisory route. Live warnings remain disabled.
- The documentation checkpoint `6143041` was confirmed Ready in Production deployment `7wYKjmJ6D19SVS9oBjGUps95npgo` and protected Preview deployment `3RGietzLktomWKEyhfccXdAseuMv`. Hosted Preview checks passed for panel X/toolbar/Escape dismissal, focus return, map expansion, zoom, province-selection reopening, independent warning-card dismissal/restoration, retained warning details in the outage demo, dark-theme rendering, and no horizontal overflow at desktop and 390px mobile viewport sizes. The fictional demo was exited afterward and the original light theme, full-map view and viewport restored. This is browser layout/interaction evidence, not physical-device or worker-control acceptance.
- Current installed-worker, offline/reconnect and physical-device advisory acceptance remain incomplete. The user-reported Tecno browser-tab pass has no recorded tested commit or advisory scenario coverage. Protected Preview API/worker requests returned HTTP 302 without authentication; Preview CDP `Network.enable` was refused while the document response was paused, so no Preview request methods/bodies were captured. These HTTP/source checks and the earlier Production catch/backup traffic run do not complete those browser checks or host/CDN traffic review. See [STAGING_ACCEPTANCE.md](../STAGING_ACCEPTANCE.md) for the release evidence and remaining cases.
