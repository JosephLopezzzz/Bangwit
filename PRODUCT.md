# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Recreational anglers and local livelihood fishers are the intended audiences. The product concept includes both; which audience the initial Cavite pilot should prioritize remains undecided.
- The prototype offers an optional fisher profile (`exploring`, `angler`, `livelihood`, or `both`) and preferred-water setting. These preferences are stored locally.

## Product Purpose

Bangwit is a Philippine waterbody discovery and personal catch-journaling product. Its intended primary flow is to select a region or waterbody, explore species records with supporting evidence, and separately record one's own catches. Identified species in a person's catch log can form a private `My Species` collection.

The current prototype is scoped to a Cavite pilot. Explore includes dated province-wide fisheries information from the Cavite Ecological Profile 2024. Verified scientific species records for individual waters are not yet loaded. Success measures and the priority audience for the pilot have not been established.

## Positioning

The working product direction is region-first Philippine species discovery grounded in traceable records, paired with a private personal catch collection. This is a product direction, not a validated market or competitor claim. Regional coverage and comparative differentiation remain unvalidated.

Species occurrence, legal catchability, community catch reports, live safety advisories, and a fisher's own catch are separate kinds of information and must not be presented as interchangeable evidence.

## Operating Context

- This is a browser-based Next.js app with a web manifest and service-worker code. Isolated desktop offline reload and catch/photo persistence were verified to the recorded scope in `OFFLINE_ACCEPTANCE.md`. The user reported a phone pass in online and offline modes on October 15 using a personal Tecno phone in a browser tab. Exact model, OS, browser/version, tested commit and individual scenarios remain unrecorded; installed-app testing has no recorded result.
- Explore renders 81 province-level outline features from a pinned geoBoundaries Philippines ADM2 layer representing 2020 geography. The map excludes four NCR district features and the independent-city features for Isabela and Cotabato City. Davao de Oro uses the source feature's former name, Compostela Valley; the source represents Maguindanao as one combined outline. The PSA PSGC summary as of 30 September 2026 lists 82 provinces. Keep the map's 2020 source year visible; this visual selector is not a current cadastral, navigation, legal-access, or municipal-water boundary layer. The only supported pilot remains Cavite, with Manila Bay, Bacoor Bay, and Cañacao Bay as water-area choices.
- The UI currently mixes Filipino and English. Users manually enter an optional spot label; the prototype does not collect GPS coordinates.
- The prior prototype at `../bangwit` uses a different browser origin and separate local storage. Catch migration is a manual backup-and-restore flow, and restore requires an empty journal.

## Capabilities and Constraints

### Current prototype

- Explore includes an opt-in, bilingual warning-layer demonstration using a fixed fictional 1 January 2026 timeline. Cavite, Batangas and Laguna demonstrate rainfall/flood, marine and thunderstorm alerts, with severity fills, a persistent callout, partial-area labels, filters, issue/expiry times and stale-data hatching. The default view reports live coverage unavailable. A server endpoint accepts only reviewed normalized live snapshots, currently restricted to Cavite; no live publisher or raw PAGASA adapter has been validated or enabled. The separately cached public advisory snapshot preserves last-known warnings through outages and is excluded from catch backups.

- Interactive province selection for the 81 source-era outline features, with Cavite selected by default and the three Cavite water areas shown only for the supported pilot. Other provinces display coverage unavailable. The species-explorer interface has name, water-type, and status filters; no verified species records are loaded, so the filters do not yet return validated results.
- A separate Explore panel presents 11 reported catch groups and local names from the Cavite Ecological Profile 2024, Table 4.25, printed page 209 / PDF page 239. It includes expandable group/source details, the report year, provincial scope and review limits in Filipino and English. It does not assign these groups to a selected bay, resolve exact scientific species, show seasonal recommendations, or populate verified species filters.
- The Species section filters 12 historical CAS museum specimen records from the reviewed CC0 OBIS shortlist by source/accepted name, broad source-reported locality, and whether a collection date is present. Search and filters update record and accepted-taxon counts, can be combined/reset, and show an explicit no-match state. Nine collection dates are supplied (1947–1964, including one month-only date); three are unknown. Expandable entries retain scientific/recorded names, provider locality text and coordinate uncertainty, OBIS/WoRMS links, citation, license and the October 6, 2026 review dates. The rejected locality record is excluded. These old records do not confirm current presence, the selected bay, map points, catchability, legal status, or personal catches. Water type and conservation-status filters remain visibly unavailable until reviewed attributes exist.
- A separate bilingual feeding-guide section shows two attributed, study-specific diet examples for *Channa striata* and *Oreochromis niloticus*. It filters guide entries by name/food group and states the study location and scope. These examples are not Cavite diet surveys or proof of local presence. Effective bait, gear and location-specific catching advice remain unavailable because independent method evidence and current applicable rule review are not complete.
- The research-only candidate-review ledger classifies 52 linked OBIS occurrences under 27 candidate names: 12 already published, one excluded occurrence, and 39 pending review. Pending names/records are not treated as accepted taxa or added to the public snapshot.
- A device-local catch journal using browser storage. Entries can include species or an unknown identification, date, water type, optional spot label, length, weight, bait, notes, released/kept status, and a photo. GPS is not collected, and there is no cloud sync.
- The service-worker configuration precaches the journal and offline fallback with revisions tied to source and asset changes. Reconnecting does not deliberately reload the page, and the fallback links directly to the journal document. Isolated desktop tests cover offline catch/photo save/reload, navigation/fallback, backup/restore, fresh-origin controlled reload and rebuild upgrade. Reconnect testing is partial; the personal Tecno browser-tab pass is user-reported with exact device/browser/build details and individual scenarios unrecorded. Installed-app, new-profile and exhaustive outbound-traffic acceptance remain pending. See `OFFLINE_ACCEPTANCE.md` and `STAGING_ACCEPTANCE.md`.
- `My Species` is derived only from identified entries in the person's own catch log. It is not a public sighting or a verified regional record.
- First-use policy acknowledgment, optional fisher preferences, an in-app guide, local backup and restore, and local-data deletion controls.

### Boundaries to preserve

- Do not imply that a missing record means a species is absent, or infer abundance from the number of catch reports.
- The prototype has no verified regional species coverage, fishing rules, protected-area boundaries, food-safety advice, weather or flood feed, or BFAR shellfish/red-tide feed. It must not be used as legal, navigation, emergency, or safety guidance.
- There is no account system, cloud upload or sync, community feed, or public catch sharing in this build. Personal entries remain in the current browser profile and may be lost if that storage is cleared or evicted.
- Privacy and Terms pages are prototype drafts and require appropriate review before a public launch or new data practices.
- GBIF, OBIS, FishBase/rfishbase, and GRIIS Philippines were discussed as possible research sources; none is integrated as verified app data. Validate any source and its regional coverage before making claims.

## Brand Commitments

The current implementation uses the name `Bangwit`, the tagline “Bawat huli, may kuwento.”, Filipino and English copy, and the Bilog mascot assets at `public/assets/bilog.png` and `public/assets/bilog-idle-blink-slow-right.gif`. These are confirmed as current prototype cues; whether they are binding beyond the prototype remains open.

## Evidence on Hand

- Current evidence includes the prototype code, local catch-journal behavior, Bilog artwork in `public/assets/`, and the reviewed provincial catch-group table in `data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json`. The reviewed historical projection is in `src/data/cavite-historical-evidence.json` and is reproducibly generated from the OBIS shortlist, taxonomy crosswalk, license review and documented review date. A direct-access source catalog and retrieval manifest accompany the provincial research file; downloaded originals remain local and are ignored by Git.
- No verified Cavite species dataset, regional legal guidance, access-point data, live advisories, user research, or validated market comparison is present in this project.
- `MIGRATION_BASELINE.md` records the prior prototype as a reference and rollback copy and documents the manual migration context.

## Product Principles

1. Start discovery from the selected Philippine region or waterbody; the personal catch journal is a separate flow.
2. Show source, status, and coverage limits when species evidence becomes available; present data gaps instead of guessing.
3. Keep documented presence, catch reports, legal rules, safety advisories, and personal catches distinct.
4. Keep personal catch locations private by default; do not collect GPS or publish catches without an explicit future decision.
5. Include both recreational and livelihood fishers while the initial pilot's priority audience remains undecided.
