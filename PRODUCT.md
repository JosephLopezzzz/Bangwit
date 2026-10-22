# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Recreational anglers and local livelihood fishers are the intended audiences. The owner selected a mix of beginner and experienced fishers for the first Cavite usability round. This experience mix does not establish that occupational groups have been recruited or studied.
- The prototype offers an optional fisher profile (`exploring`, `angler`, `livelihood`, or `both`) and preferred-water setting. These preferences are stored locally.

## Product Purpose

Bangwit is a Philippine waterbody discovery and personal catch-journaling product. Its intended primary flow is to select a region or waterbody, explore species records with supporting evidence, and separately record one's own catches. Identified species in a person's catch log can form a private `My Species` collection.

The current prototype is scoped to a Cavite pilot. Explore includes dated province-wide fisheries information from the Cavite Ecological Profile 2024. Verified scientific species records for individual waters are not yet loaded. The implementation plan proposes task-completion and interpretation targets for a mixed beginner/experienced audience; no participant results or final approved pilot build are recorded. See the pilot plan and runbook before claiming readiness or validation.

## Positioning

The working product direction is region-first Philippine species discovery grounded in traceable records, paired with a private personal catch collection. This is a product direction, not a validated market or competitor claim. Regional coverage and comparative differentiation remain unvalidated.

Species occurrence, legal catchability, community catch reports, live safety advisories, and a fisher's own catch are separate kinds of information and must not be presented as interchangeable evidence.

## Operating Context

- This is a browser-based Next.js app with a web manifest and service-worker code. Isolated desktop offline reload and catch/photo persistence were verified to the recorded scope in `OFFLINE_ACCEPTANCE.md`. The user reported online/offline and photo-draft reconnect passes on October 15 using a personal Tecno phone in a browser tab at `https://bangwit.vercel.app/`. Exact model, OS, browser/version, tested commit and full checklist coverage remain unrecorded; installed-app testing has no recorded result.
- Explore renders 81 province-level outline features from a pinned geoBoundaries Philippines ADM2 layer representing 2020 geography. The map excludes four NCR district features and the independent-city features for Isabela and Cotabato City. Davao de Oro uses the source feature's former name, Compostela Valley; the source represents Maguindanao as one combined outline. The PSA PSGC summary as of 30 September 2026 lists 82 provinces. Keep the map's 2020 source year visible; this visual selector is not a current cadastral, navigation, legal-access, or municipal-water boundary layer. The only supported pilot remains Cavite, with Manila Bay, Bacoor Bay, and Cañacao Bay as water-area choices.
- The UI currently mixes Filipino and English. Users manually enter an optional spot label; the prototype does not collect GPS coordinates.
- The prior prototype at `../bangwit` uses a different browser origin and separate local storage. Catch migration is a manual backup-and-restore flow, and restore requires an empty journal.

## Capabilities and Constraints

### Current prototype

- Explore includes an opt-in, bilingual warning-layer demonstration using a fixed fictional 1 January 2026 timeline. Cavite, Batangas and Laguna demonstrate rainfall/flood, marine and thunderstorm alerts, with severity fills, a persistent callout, partial-area labels, filters, issue/expiry times and stale-data hatching. The default view reports live coverage unavailable. A server endpoint accepts only reviewed normalized live snapshots, currently restricted to Cavite; no live publisher or raw PAGASA adapter has been validated or enabled. The separately cached public advisory snapshot preserves last-known warnings through outages and is excluded from catch backups.

- Interactive province selection for the 81 source-era outline features, with Cavite selected by default and the three Cavite water areas shown only for the supported pilot. Other provinces display coverage unavailable. The map-level species explorer has name, water-type, and status filters, but no current, fishing-ground-specific species list is admitted to those filters. The separate historical, Taal and Palico-Lian evidence sections have independent scope and search controls; they do not populate map points or current-presence results.
- A separate Explore panel presents 11 reported catch groups and local names from the Cavite Ecological Profile 2024, Table 4.25, printed page 209 / PDF page 239. It includes expandable group/source details, the report year, provincial scope and review limits in Filipino and English. It does not assign these groups to a selected bay, resolve exact scientific species, show seasonal recommendations, or populate verified species filters.
- The Species section filters 12 historical CAS museum specimen records from the reviewed CC0 OBIS shortlist by source/accepted name, broad source-reported locality, and whether a collection date is present. Search and filters update record and accepted-taxon counts, can be combined/reset, and show an explicit no-match state. Nine collection dates are supplied (1947–1964, including one month-only date); three are unknown. Expandable entries retain scientific/recorded names, provider locality text and coordinate uncertainty, OBIS/WoRMS links, citation, license and the October 6, 2026 review dates. The rejected locality record is excluded. These old records do not confirm current presence, the selected bay, map points, catchability, legal status, or personal catches. Water type and conservation-status filters remain visibly unavailable until reviewed attributes exist.
- A separate local Species section presents four literature-checklist assertions for Taal Lake: *Caranx ignobilis*, *Caranx papuensis*, *Caranx sexfasciatus* and *Sardinella tawilis*. It has its own name search and source/identity details, independent of the Cavite historical filters and selected bay. The reviewed CC0 Jamandre/Plazi source was published on 9 June 2023 and reports “Lake Taal, Luzon Island”; observation dates remain unknown. These assertions do not establish current presence, freshwater-only ecology, abundance, fishing permission or safety, and supply no map points.
- A separate bilingual Species section presents 12 scoped Palico-Lian River survey-table assertions, with name search, marked-site details, source citation and taxonomy links. The 2025-11-14 publication date is known; the field-sampling date is not reported. The 15-row source table retains three family conflicts outside the projection. Site marks are not counts, and these assertions do not establish current presence, river-wide coverage, water chemistry, legal access, catchability or safety. The publisher's custom permission is batch-scoped and is not represented as a Creative Commons license. This package is local implementation work, not a deployed or complete regional baseline.
- A separate bilingual feeding-guide section shows five attributed, study-specific diet examples, including *Channa striata* and *Oreochromis niloticus* and three marine examples scoped to a San Miguel Bay study. It filters guide entries by name/food group and states the study location and scope. These examples are not Cavite diet surveys or proof of local presence. Effective bait, gear and location-specific catching advice remain unavailable because independent method evidence and current applicable rule review are not complete.
- The research-only candidate-review ledger classifies 52 linked OBIS occurrences under 27 candidate names: 12 already published, two excluded occurrences, and 38 pending review. Pending names/records are not treated as accepted taxa or added to the public snapshot.
- A device-local catch journal using browser storage. Entries can include species or an unknown identification, date, water type, optional spot label, length, weight, bait, notes, released/kept status, and a photo. GPS is not collected, and there is no cloud sync.
- The service-worker configuration precaches the journal and offline fallback with revisions tied to source and asset changes. Reconnecting does not deliberately reload the page, and the fallback links directly to the journal document. Isolated desktop tests cover offline catch/photo save/reload, navigation/fallback, backup/restore, fresh-origin controlled reload and rebuild upgrade; historical desktop O3 reconnect coverage remains partial. The user reported that an unsaved synthetic photo catch with `7 in`, `2 lbs` and test notes survived reconnect without a reload in a Tecno browser tab at `https://bangwit.vercel.app/`: the photo and all fields remained, and one Save added exactly one entry. This scoped Production phone pass does not establish instrumented Preview worker-control, traffic or offline/reconnect acceptance. Exact device/browser/build details and full phone checklist coverage remain unrecorded. Installed-app, new-profile and exhaustive outbound-traffic acceptance remain pending. See `OFFLINE_ACCEPTANCE.md` and `STAGING_ACCEPTANCE.md`.
- `My Species` is derived only from identified entries in the person's own catch log. It is not a public sighting or a verified regional record.
- First-use policy acknowledgment, optional fisher preferences, an in-app guide, local backup and restore, and local-data deletion controls.

### Boundaries to preserve

- Do not imply that a missing record means a species is absent, or infer abundance from the number of catch reports.
- The prototype has no verified regional species coverage, fishing rules, protected-area boundaries, food-safety advice, weather or flood feed, or BFAR shellfish/red-tide feed. It must not be used as legal, navigation, emergency, or safety guidance.
- There is no account system, cloud upload or sync, community feed, or public catch sharing in this build. Personal entries remain in the current browser profile and may be lost if that storage is cleared or evicted.
- Privacy and Terms pages are prototype drafts and require appropriate review before a public launch or new data practices.
- The limited reviewed historical OBIS/CAS projection described above is integrated as attributed historical evidence. Other GBIF, OBIS, FishBase/rfishbase and GRIIS Philippines leads remain research inputs and are not verified regional coverage. Validate identity, rights and regional scope before adding records or claims.

- A separate national research workspace registers 18 rollout regions, 82 provinces and 130 administrative coverage units, 28 source references, and 30 CALABARZON waterbody/habitat leads. Its directory-derived geography retains pending quarterly-workbook verification. The inspected CC0 Plazi/Jamandre 2023 checklist yields 374 frozen pending name candidates and cached COL XR proposals (329 exact-species and 45 exceptions). Separate hash-pinned ledgers admit four Taal checklist assertions and 12 Palico-Lian survey-table assertions while holding three Taal leads and three Palico source-family conflicts. These batch decisions do not approve the full source or other national names. CALABARZON and all regional baselines remain incomplete. See `data/research/philippines/README.md` and `npm run species:status`.

- The Palico-Lian River source has a 15-row research ledger and a separate versioned, hash-pinned decision file: 12 attributed factual assertions are admitted to a local projection, and three family conflicts are held. The original source's conflicting family/origin summaries are not adopted. The scoped projection is implemented in `src/data/palico-river-survey-evidence.json`; it has no sampling dates, specimen counts, coordinates, salinity values, current-presence claim, whole-river list, legal/access claim, safety advice or map pins. Five parallel brackish source leads remain held, without an absence finding. This local app slice does not complete L1. Verification on 23 October 2026 (Asia/Manila): the ten-name identity addendum contains eight name/family agreements and two family holds; together with five earlier checks, three source-family conflicts remain held. The permitted PDF/policy re-fetch and field-source validation succeeded; `npm run species:check:river` confirmed the pinned 12-assertion projection, and `npm run species:status` reported the expected regional and batch counts. No test suite, typecheck, production build, browser/device QA or deployment was run for this UI integration. The source PDF SHA-256 remains `8f730d1d573d892d953464804a91970a2495e1851a9d46d5d9163715a21a509e`; the current normalized policy text is pinned separately. Raw originals/renders remain Git-ignored.

## Brand Commitments

The current implementation uses the name `Bangwit`, the tagline “Bawat huli, may kuwento.”, Filipino and English copy, and the Bilog mascot assets at `public/assets/bilog.png` and `public/assets/bilog-idle-blink-slow-right.gif`. These are confirmed as current prototype cues; whether they are binding beyond the prototype remains open.

## Evidence on Hand

- Current evidence includes the prototype code, local catch-journal behavior, Bilog artwork in `public/assets/`, and the reviewed provincial catch-group table in `data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json`. The reviewed historical projection is in `src/data/cavite-historical-evidence.json` and is reproducibly generated from the OBIS shortlist, taxonomy crosswalk, license review and documented review date. A direct-access source catalog and retrieval manifest accompany the provincial research file; downloaded originals remain local and are ignored by Git.
- The local Taal checklist projection is in `src/data/taal-checklist-evidence.json`, generated from frozen national research inputs plus separate identity and batch-decision ledgers. Its four admitted checklist assertions retain the 2023 publication date and unknown observation dates; the three held leads are excluded. This adds a bounded lake evidence context without altering the Cavite historical projection or claiming regional completion.
- `calabarzon-river-source-review.json`, `palico-independent-review.json`, `palico-identity-addendum.json` and `palico-river-decisions.json` retain the source table, identity checks and scoped admission decisions; `src/data/palico-river-survey-evidence.json` is their deterministic, limited app projection. `calabarzon-brackish-source-review.json` retains brackish source gaps. Original PDFs, publisher terms and authority responses remain ignored local research caches with hashes; the identity review is desk research, not qualified-expert certification.
- No verified Cavite species dataset, regional legal guidance, access-point data, live advisories, user research, or validated market comparison is present in this project.
- `MIGRATION_BASELINE.md` records the prior prototype as a reference and rollback copy and documents the manual migration context.

## Product Principles

1. Start discovery from the selected Philippine region or waterbody; the personal catch journal is a separate flow.
2. Show source, status, and coverage limits when species evidence becomes available; present data gaps instead of guessing.
3. Keep documented presence, catch reports, legal rules, safety advisories, and personal catches distinct.
4. Keep personal catch locations private by default; do not collect GPS or publish catches without an explicit future decision.
5. Include both recreational and livelihood fishers in the product roadmap; the first proposed usability round includes beginner and experienced fishers and still awaits notice review and actual sessions.

## Current preparation and release scope — 19 October 2026

The local `prototype-6` privacy draft includes Joseph's confirmed public support inbox and planned 90-day retention after resolution, separate from Google's processing and the 30-day pilot-note rule. No qualified reviewer is assigned. Pilot materials are prepared, but recruitment and participant sessions remain closed pending the reviewed notice, a fixed tested build and setup receipts in `docs/CAVITE_PILOT_RUNBOOK.md`.

The later full functional/mobile/installed-app acceptance report is recorded as user-reported in the acceptance documents; older narrower checks above keep their original scope. It does not establish current-release traffic privacy or a deployed `prototype-6` build. The Production restoration/source mismatch and prepared local recovery are recorded in `docs/releases/cavite-production-recovery.md`; reviewed source in this checkout must not be described as the currently serving release.
