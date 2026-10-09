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

- This is a browser-based Next.js app with a web manifest and service-worker code. Reliable offline app reload behavior has not been verified.
- The current Cavite prototype offers Manila Bay, Bacoor Bay, and Cañacao Bay as area choices. Its map is an illustration, not a navigation map; boundaries and access information are not verified.
- The UI currently mixes Filipino and English. Users manually enter an optional spot label; the prototype does not collect GPS coordinates.
- The prior prototype at `../bangwit` uses a different browser origin and separate local storage. Catch migration is a manual backup-and-restore flow, and restore requires an empty journal.

## Capabilities and Constraints

### Current prototype

- Area selection for the three listed Cavite waters and a species-explorer interface with name, water-type, and status filters. No verified species records are loaded, so the filters do not yet return validated results.
- A separate Explore panel presents 11 reported catch groups and local names from the Cavite Ecological Profile 2024, Table 4.25, printed page 209 / PDF page 239. It includes expandable group/source details, the report year, provincial scope and review limits in Filipino and English. It does not assign these groups to a selected bay, resolve exact scientific species, show seasonal recommendations, or populate verified species filters.
- A device-local catch journal using browser storage. Entries can include species or an unknown identification, date, water type, optional spot label, length, weight, bait, notes, released/kept status, and a photo. GPS is not collected, and there is no cloud sync.
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

- Current evidence includes the prototype code, local catch-journal behavior, Bilog artwork in `public/assets/`, and the reviewed provincial catch-group table in `data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json`. A direct-access source catalog and retrieval manifest accompany this research file; downloaded originals remain local and are ignored by Git.
- No verified Cavite species dataset, regional legal guidance, access-point data, live advisories, user research, or validated market comparison is present in this project.
- `MIGRATION_BASELINE.md` records the prior prototype as a reference and rollback copy and documents the manual migration context.

## Product Principles

1. Start discovery from the selected Philippine region or waterbody; the personal catch journal is a separate flow.
2. Show source, status, and coverage limits when species evidence becomes available; present data gaps instead of guessing.
3. Keep documented presence, catch reports, legal rules, safety advisories, and personal catches distinct.
4. Keep personal catch locations private by default; do not collect GPS or publish catches without an explicit future decision.
5. Include both recreational and livelihood fishers while the initial pilot's priority audience remains undecided.
