# Bangwit: Cavite data and pilot implementation plan

Prepared: 17 October 2026. Updated: 19 October 2026. Status: preparation implemented; M4 final review and M5 participant work remain pending. Dated outcomes are recorded in sections 12 and 13.

## 1. Outcome and starting point

Deliver a more useful, source-backed Cavite library, a validated first live-advisory integration if a suitable source qualifies, aligned policies, and a small Cavite usability pilot. Use the existing Next.js App Router, TypeScript, Tailwind CSS, Serwist, bilingual UI and device-local catch journal.

The user reports that the planned functional tests passed, including mobile, dropdown and installed-app checks. Treat that as the completed functional checkpoint, with the evidence limits already recorded in [OFFLINE_ACCEPTANCE.md](../OFFLINE_ACCEPTANCE.md) and [STAGING_ACCEPTANCE.md](../STAGING_ACCEPTANCE.md). Do not restart the full acceptance suite for this plan; test relevant behavior when subsequent changes justify it.

Repository observations for planning, rather than newly performed functional tests:

| Area | Starting point | Next deliverable |
| --- | --- | --- |
| Release | Local HEAD `2d8fbcf` records the reported full test pass. Hosted identities have separate historical records. | Reconciled release record tying a reviewed source state to its actual deployed build. |
| Species evidence | 12 published historical CAS CC0 records. The finite ledger contains 52 occurrences under 27 candidate names: 12 published, 2 excluded, 38 pending. Four pending occurrences have curator holds. | Five documented candidate-review decisions; publication only for independently eligible records. |
| Publication pipeline | One reviewed CAS dataset and CC0-only admission, with shared dataset attribution. No pending row meets that existing gate. | Preserve the current gate; adapt it for one additional reviewed source only if a qualifying batch exists. |
| Guides | Two attributed diet examples; water/status facets and contextual catching advice remain unavailable. | Up to three additional qualified diet examples, plus independently reviewed rule/method references. |
| Advisories | Existing normalized API, validation, fictional preview, public cache and warning UI. No validated raw official-source adapter or operational publisher. | One reviewed Cavite product, with scheduled ingestion, durable state and conditional activation. |
| Policies and pilot | Draft bilingual policies; operator/hosting facts and pilot success measures need completion. First-round audience selected: mixed beginner and experienced fishers. | Reviewed notices, a minimal feedback procedure and a measured pilot. |

Source leads and reuse terms in existing research notes must be checked again during implementation. This planning pass does not establish current official-feed availability, current law or new publication rights.

## 2. Product rules that continue through every milestone

- Keep personal catches/photos in the current browser profile. This work does not require accounts, GPS, cloud catch sync, public catch sharing or a catch-storage migration.
- Separate historical occurrence, biological facts, personal catches, legal applicability and safety advisories. Historical records do not establish current presence or permission to fish; missing records do not establish absence.
- Preserve the four existing curator holds and two exclusions. Keep original identifiers, date precision, uncertainty, citations and licenses. A review can legitimately produce zero newly publishable records.
- Keep the existing map's source year and geography limits visible. Province outlines cannot supply municipal-water, sanctuary, access or legal fishing boundaries.
- Reuse `.ui-card`, `.ui-button`, `.ui-input`, `DropdownSelect` and `CatchDatePicker` under [AGENTS.md](../AGENTS.md) and [DESIGN.md](../DESIGN.md). Maintain compact layout, Filipino/English copy, keyboard/touch access, light/dark themes and reduced motion.
- Retain all planned features on the roadmap. BFAR red tide/shellfish advisories and national coverage need their own source, geography and semantic review; they are later integrations, not rainfall categories.

## 3. Work breakdown and dependencies

| ID | Work package | Main responsibility | Depends on | Done when |
| --- | --- | --- | --- | --- |
| M1 | Record the tested checkpoint | Developer + repository owner | Existing acceptance report | Source, deployment, evidence and rollback references agree. |
| M2 | Review and expand Cavite evidence | Data reviewer + developer | M1 baseline | First five decisions are durable; any publication is reproducible and properly attributed. |
| M3 | Build one real advisory integration | Developer + source/domain reviewer | Source feasibility; M1 baseline | A reviewed Cavite product passes operational and deployment gates, or a documented no-go leaves coverage unavailable. |
| M4 | Complete fishing references and policies | Content reviewer + operator + qualified policy reviewer | Source research; actual hosting/publisher facts | Claims and bilingual notices match evidence and actual processing. |
| M5 | Run the Cavite usability pilot | Project owner + facilitator + participants | M1, reviewed starter content, M4 policy/pilot-notice gate | Findings, priority fixes and a release/next-batch decision are recorded. |

```mermaid
flowchart TD
    A[M1: Record tested checkpoint] --> B[M2: Review five evidence candidates]
    A --> C[M3A: Validate one official advisory product]
    A --> D[M4A: Rules and guide research]
    A --> P[M4B: Policy and pilot-notice review]
    B --> E{Any candidates eligible?}
    E -->|Yes| F[Scoped source admission and attributed snapshot]
    E -->|No| G[Keep current snapshot and record holds or exclusions]
    C --> H{Dependable source and operating setup?}
    H -->|Yes| I[M3B: Publisher, replay and conditional activation]
    H -->|No| J[Keep live coverage unavailable and document source gap]
    F --> K[M5: Cavite usability pilot]
    G --> K
    P --> K
    D -. Add qualified content when ready .-> K
    I -. Live-alert tasks require activation .-> K
    J -. Keep live coverage unavailable .-> K
    K --> L[Fix observed issues and choose next Cavite batch]
```

Solid arrows show required gates; dotted arrows show optional content or advisory-scope inputs. M2, source feasibility and policy fact-gathering can proceed in parallel. An education/journaling pilot can proceed with explicitly unavailable live coverage while M3 remains in progress. A pilot that claims working live alerts additionally requires M3's activation gate. Agency replies and national municipal-water GIS do not block every work package.

## 4. M1: Record the tested checkpoint

1. Reconcile README, PRODUCT and the older implementation checklist with the latest acceptance report. Correct stale `39 pending / 1 excluded` wording to the generated ledger's `38 / 2`; preserve older dated test results as history.
2. Record the reviewed commit, deployed commit/build, exact URL, acceptance-report date and available device/browser context. Leave unavailable details explicitly unrecorded rather than inferring them from HEAD.
3. Inspect generated workspace changes, including `next-env.d.ts`, without folding unrelated changes into the checkpoint. Review an explicit file list for secrets, raw research rights, private backups and photos before any repository publication.
4. Prepare a concise release note and rollback reference. Restore code/public data through Git and the previous deployment; do not clear browser journals as a rollback method.
5. When a checkpoint is actually committed or deployed, record the resulting identifiers. Tagging, pushing and deploying must follow the repository owner's existing instructions, rather than being implied by writing this plan.

Deliverable: [release baseline record](releases/cavite-pilot-baseline.md), plus reconciled status documents. The record distinguishes the last previously verified deployment from the present checkout and the user's reported tests.

Acceptance: the recorded source/deployment relationship is verifiable, reported and independently observed checks remain distinguished, and the rollback instructions preserve personal journals.

## 5. M2: Review and expand Cavite species evidence

### M2.1: Review the first five records

Review these five currently untouched candidates as a finite research batch:

| Recorded candidate name | Provider | OBIS occurrence ID |
| --- | --- | --- |
| *Nuchequula blochii* | Smithsonian | `9f16eeaa-9c50-4cad-97f9-5a728254ea1f` |
| *Ostorhinchus fasciatus* | Smithsonian | `0283ab44-b1e8-4ed4-9e11-2cff048300aa` |
| *Ostorhinchus pleuron* | Smithsonian | `dd7c909e-e8e5-4fae-b768-eea845e2de83` |
| *Ostracion rhinorhynchos* | National Museum Philippines | `de331418-cfe9-4e0a-9797-8f2512729ad5` |
| *Stolephorus indicus* | National Museum Philippines | `6ad5b3c0-daee-4db4-b1fb-1ea45f32e912` |

Their occurrence-license fields are blank in the current export; the dataset review lists CC-BY 4.0, and individual locality decisions are absent. These are review candidates, not approved taxa or approved publication inputs. Remaining pending records also include NC-licensed sources; do not admit those under the existing CC0 gate.

For each record:

1. Match the original catalog record and provider identity; retain cross-portal identifiers so GBIF/OBIS copies do not become duplicate evidence.
2. Verify the actual reuse basis, dataset/record relationship, attribution and any image rights. A dataset label alone must not silently fill a missing record-level review.
3. Check accepted authority ID, recorded name/synonyms, collection date and precision, locality text, uncertainty and any conflicting coordinates.
4. Record the evidence URLs/locators, retrieval/review dates, reviewer, decision and reason. Keep unresolved records on hold; exclude only the affected occurrence with an explicit rationale.
5. Regenerate the research ledger and reconcile counts. An eligible-for-admission proposal belongs in review evidence until a supported publication representation exists; do not invent an approval value that current scripts cannot process.

### M2.2: Conditional publication, not automatic gate relaxation

If no candidate qualifies, retain the 12-record public snapshot and deliver the five review decisions. A later bounded CC0 source query is an independent research option, with recorded query/coverage/rights and no promised result count.

If a non-CC0 candidate qualifies, first implement admission for one actual reviewed source batch:

- Add explicit reviewed source/license configuration and a durable approval representation, while preserving holds and exclusions.
- Replace the assumption of one shared dataset citation with per-record source/dataset references and required attribution. Keep existing CAS records and their source context readable.
- Update the deterministic generator, validation and historical-evidence renderer together. Do not append foreign rows to the current CC0 shortlist to bypass validation.
- Retain unknown/month-only dates, namespaced authority IDs, source locality and deduplication by original provenance. Publish no precise bay/map assignment from broad or uncertain locality.
- Enable water-type or conservation attributes only when those specific values have independent reviewed sources; retain an unknown category. Taxonomic acceptance alone does not supply these attributes.

Primary existing files: `data/research/obis/cavite/cavite-obis-curator-review.csv`, `cavite-obis-location-review.csv`, `cavite-obis-dataset-license-review.csv`, `cavite-obis-worms-crosswalk.csv`, `scripts/build-cavite-fish-candidate-review.mjs`, `scripts/build-cavite-historical-evidence.mjs`, `src/data/cavite-historical-evidence.json`, `src/components/historical-species-evidence.tsx` and `src/lib/species-research.ts`.

Deliverables: review evidence for five occurrence IDs, regenerated ledger, and either an unchanged public snapshot with reasons or an eligible attributed projection plus scoped generator/UI changes.

Acceptance: every published record has traceable identity, rights and locality review; holds/exclusions cannot bypass admission; regeneration matches the committed snapshot; record/taxon counts and filters remain truthful. There is no minimum number of new published species.

## 6. M3: Connect one real Cavite advisory product

### M3.1: Source feasibility and selection

Evaluate one Cavite rainfall-warning product first, using the official PAGASA publishing lead already recorded in [MAP_ADVISORIES.md](MAP_ADVISORIES.md). Confirm current endpoint/access stability, reuse conditions, update cadence, locality coverage, native categories, issuance/expiry and cancellation/update semantics. This is a candidate product, not a verified available API.

Write a short go/no-go source assessment and field mapping. Reject guesses from screenshots, map colors or unofficial mirrors. If reliable access cannot be validated within the initial research timebox, retain official links and unavailable coverage, record the blocker, and continue M2/M4/M5's education scope.

### M3.2: Small publisher architecture

Use the existing version-1 normalized contract and API instead of replacing the warning UI:

```mermaid
flowchart LR
    A[One reviewed official product] --> B[Scheduled server-side retrieval]
    B --> C[Product adapter and validation]
    C --> D[Atomic durable snapshot and last-good state]
    D --> E[Existing /api/advisories]
    E --> F[Existing warning UI and public cache]
```

1. Choose one scheduler and durable snapshot store after checking current platform support, cost and permissions. The job must run independently of visitors. Use a small single-product module; do not provision a general ingestion platform.
2. Map official categories, forecast/observed wording and named Cavite municipalities explicitly. Retain stable alert identity, official source link, original issue/effective/expiry times and reviewed bilingual summaries.
3. Validate before atomic publication. Prevent overlapping or older runs from overwriting newer accepted state; preserve cancellation/superseding references and source coverage.
4. Keep durable last-good records across job restarts. Fetch/parse failure means unavailable/stale coverage, not a healthy empty publication. Do not change old bulletin issue dates to make them look current.
5. Define polling cadence, timeout/retry, maximum staleness and publication-to-display expectations against the actual product. Review the existing 10-minute freshness rule and server cache rather than assuming they suit every feed.
6. Assign an operating owner and document last-success monitoring, missed-run/failure notification, source rollback and disable-live procedures. Browser localStorage is not the publisher's durable store.

### M3.3: Activation gate

- Replay real, attributable source examples for partial locality, severity changes, explicit cancellation, unchanged old bulletins, missing feeds, parse errors, future/regressed times and overlapping updates. Publish only permitted fixture material.
- Verify scheduler restart/failure recovery, durable last-good behavior, atomic replacement, measured source latency and deployed HTTPS/offline/reconnect behavior for this new integration.
- Enable only the reviewed product and Cavite coverage. The overall map must not imply all five hazards were checked from a single rainfall source. Preserve unavailable states for every unchecked hazard.
- Keep fictional preview data separate from live snapshots and backups. BFAR red tide requires later source and schema/meaning work; current PAGASA-only validation cannot enable it through environment settings alone.
- After source/contract review, configure `BANGWIT_ADVISORY_FEED_URL` and `BANGWIT_ADVISORY_FEED_REVIEWED` server-side in the controlled test deployment to perform integration acceptance. Production stays unavailable until the activation gate passes; then configure its reviewed feed and update actual coverage/privacy copy.

Existing integration paths: `src/app/api/advisories/route.ts`, `src/lib/map-advisories.ts`, `src/components/use-map-advisories.ts`, `src/components/area-explorer.tsx`, `src/app/sw.ts` and `tests/map-advisories.test.mjs`. Proposed new artifacts: a source assessment/field mapping, one adapter/job module, permitted replay fixtures and an operations runbook. Choose exact paths after inspecting the selected source.

Acceptance: an active product is traceable, correctly scoped and timely to its reviewed operating policy; outage/unknown coverage cannot become an all-clear; an owner can disable or recover ingestion. A documented no-go completes feasibility only, not live integration.

## 7. M4: Fishing references, guides and policies

### M4.1: Qualified fishing information

1. Start with the existing [Cavite rule-source inventory](../data/research/obis/cavite/cavite-fisheries-rule-source-inventory.md). Recheck official full texts, later amendments, effective dates and the relevant activity/gear/area scope before summarizing them.
2. Build concise source-reference cards with jurisdiction, issuer, instrument/section, dates, source locator, review date and unresolved applicability. An incomplete reference may say what still needs checking; it cannot answer that fishing is permitted.
3. Review up to three additional diet taxa, for a maximum starter set of five including the existing two. Record claim-level source, study location, life stage/context, food group, locator and reuse notes. Keep non-Cavite studies labeled accordingly.
4. Research bait/gear/method claims independently. Natural prey is not proof of effective bait. Keep `catchingAdviceStatus` unreviewed/unavailable unless method evidence and current contextual rule review both qualify.
5. Show contextual recommendations only when place, date, activity/fisher category, gear and target identity can be evaluated. Missing boundary or applicability facts stay `not_verified`; do not infer legality from an administrative polygon or a source record.

Reuse `src/data/feeding-guides.json`, `data/research/feeding-guides-review.md`, `src/components/feeding-guides.tsx` and existing Species components. Add a small reference-card content shape only when reviewed material needs it. New food-safety/edibility advice is not supplied by this diet work.

### M4.2: Policies that match actual operation

1. Joseph Lopez is the individual project operator for planning and has confirmed that he monitors `tepezzzz070@gmail.com` as the dedicated public privacy/support route. Keep the private NAMRIA-inquiry email out of app copy and participant materials. Have a qualified reviewer confirm the responsible operator/controller wording before approving the notice.
2. Inspect actual hosting/publisher logging, recipients, retention settings and any log drains. Document public request/advisory metadata separately from local catch/photo contents; include future publisher infrastructure only when selected.
3. Resolve purposes, applicable processing basis, retention and rights/contact procedures with the responsible operator and qualified reviewer. Treat these as review tasks, not legal conclusions supplied by this plan.
4. Align Filipino and English Terms/Privacy, including known flood/protected-area, bait/diet and backup-location wording differences and the review banner. Add reviewed document version/effective date and accurate advisory-cache behavior.
5. If material changes need a new acknowledgment, update the existing policy-version handling in `src/components/bangwit-provider.tsx` without deleting catches, photos, preferences or backups. Decide reacknowledgment behavior with the reviewer; a page visit is not fabricated consent.
6. Prepare a separate optional pilot-feedback/recording explanation. Start with minimal deidentified notes outside the app; analytics or new user-data services require their own scope and privacy review.

Primary files: [PRIVACY_REVIEW.md](../PRIVACY_REVIEW.md), `src/i18n/dictionaries/en.ts`, `src/i18n/dictionaries/fil.ts`, `src/components/policy-document.tsx`, and the existing Terms/Privacy routes.

Current factual packet: [privacy and pilot review packet](CAVITE_PRIVACY_REVIEW_PACKET.md). The owner selected private local notes, Joseph-only access, a 30-day limit after each session and no audio/video, and confirmed an independent personal project with no participant compensation. The signed-in Vercel review established the Hobby plan, one team Owner and no configured drains. The remaining provider-retention and review decisions are listed in that packet.

Acceptance: reference claims retain scope and unknowns; guides have independent support; bilingual notices match verified processing facts and have responsible review before broader pilot promotion. Source counts or passing software tests do not substitute for content/policy review.

## 8. M5: Small Cavite usability pilot

### Preparation

Working facilitator and synthetic-data materials: [Cavite pilot session guide](CAVITE_PILOT_SESSION_GUIDE.md). This is not recruitment authorization or a substitute for the pending reviewed pilot notice.

- Recruit a proposed 5–8 Cavite participants across the selected mixed beginner and experienced-fisher audience. Use only a broad self-described experience category to interpret feedback; do not collect livelihood details unless separately justified and approved; this small sample is usability discovery, not representative market validation. No participants have been recruited.
- Keep both beginner and experienced fishers represented in this first round and retain both audiences in the product roadmap. The audience choice does not authorize recruitment or replace the reviewed-notice and privacy/contact gates.
- Include a first-visit guide task: follow the spotlight steps, use Back/Next, skip or finish, then reopen the guide from Help. Record whether users can resume/replay it and whether it helps without interrupting; compare only broad beginner/experienced categories and report raw counts.
- Use one fixed tested release/URL per round, reviewed pilot notices and a short facilitator script. Use synthetic catch/photo values for observed tasks; keep any voluntary real catches or precise locations private.
- For an education/journaling round, keep unavailable alerts and historical-record limits explicit. Live-alert task claims require M3 activation; simulated scenarios remain clearly labeled.

### Session tasks and proposed exit targets

| Task or outcome | Record | Proposed pilot target |
| --- | --- | --- |
| Use and revisit the first-time guide | Unassisted tour discovery, Back/Next/Skip/Finish, Help replay, interruption or confusion | At least 80% complete and reopen unassisted; report raw counts by broad experience group. |
| Choose Cavite and find a species/source | Completion without facilitator help; confusion points | At least 80% complete each critical discovery task; report raw counts too. |
| Interpret old evidence and warning coverage | Answers about historical/current, partial/stale/unavailable states | No unresolved interpretation that turns a data gap into permission or safety clearance. |
| Save a catch/photo offline and reopen it | Successful save/reload, units/photo readability, time to first save | At least 80% complete unassisted; zero unresolved saved-data loss. |
| Understand My Species | Identified versus unknown catch behavior | Collection meaning is understood without implying verified regional presence. |
| Back up a journal | Download success and understanding that it is private | At least 80% complete unassisted; no participant data published. |

These are proposed usability exit targets, not already measured results or statistical claims. Agree the task wording before the first session; record failures and assisted completions separately. Restore testing uses a separate authorized empty synthetic journal, never a participant's populated journal.

Deliverables: deidentified session notes, device/browser/build context, task counts, prioritized issue list and a short pilot report. A prototype UI can be tested; a live-safety claim needs its own data gate.

Decision after the round: fix journal loss and dangerous interpretation issues first, then common task blockers, then visual/copy refinements. Choose the next Cavite content batch from observed needs. National expansion follows province-specific source/geography review rather than copying Cavite assumptions across the current 2020 outline map.

## 9. Validation matched to actual changes

| Change | Focused proof during implementation |
| --- | --- |
| Status/release documents only | Check references, counts, identifiers and `git diff --check`; no application test rerun solely for prose. |
| Evidence reviews, generator or Species filtering | Regenerate the ledger/snapshot and run `npm run test:research`. Cover license/admission bypass, held/excluded records, duplicate provenance, per-source attribution, date precision, deterministic output and accepted-taxon counts. |
| Diet/rule content | Verify each claim against its source and reviewed scope; exercise affected selectors/rendering. Run the relevant research checks for changed data behavior. |
| Advisory adapter/publisher | Extend adapter fixture/operational checks, run `npm run test:advisories`, exercise restart/outage/cancellation/unknown coverage, then verify the changed deployed phone/offline scenario. Existing state tests alone do not validate source truth. |
| Policy gate/version | Check bilingual content, keyboard/mobile scroll/focus and acknowledgment; prove existing synthetic catches/photos/backups remain readable if gate behavior changes. Run storage/offline checks when their behavior is affected. |
| Application/UI changes | Typecheck, lint, focused formatting and production build on the final source. Check changed flows in the browser using shared controls; repeat only relevant phone/offline cases after code/worker changes. |
| Deployment | Verify the actual commit/build/URL, run `npm run check:staging -- <origin>` with authorized access, and verify new behavior at that origin. Retain access protection; any temporary exception needs explicit authorization and verified restoration. |

No new tests, deployments, source downloads or contacts are executed by preparing this document. New review artifacts and fixtures must omit private journals, credentials and material lacking redistribution rights.

## 10. Suggested sequencing and effort

Assumption: one developer also performs initial data research, with a separate source/policy reviewer where needed. These are planning ranges in focused working days, not promised calendar dates.

| Increment | Work | Estimated effort |
| --- | --- | --- |
| A | M1 checkpoint/status reconciliation | 0.5–1 day |
| A | M2 five-record research batch and decisions | 2–4 days |
| A, parallel | M3 source feasibility and M4 hosting/policy fact inventory | 1–2 days each |
| B, conditional | M2 additional-source admission/generator/UI if records qualify | 2–4 days |
| B, conditional | M3 one-product adapter, scheduler/store, replay and operations | 4–7 days after source approval |
| B/C | M4 guide/rule content and bilingual policy draft revisions | 3–5 days, plus external review time |
| C | M5 participant preparation and release verification | 1–2 days |
| C | Pilot sessions, findings and first fixes | 5–7 elapsed days; fix effort depends on findings |

Planning horizon: roughly 3–6 focused working weeks for the full implementation path, followed by the 5–7 elapsed pilot days, plus source-access and qualified-review waiting time. A limited education/journaling pilot can start earlier once its own gates pass. Research may produce no-go decisions. Timebox uncertain source work and continue independent deliverables instead of assigning false completion dates.

## 11. Completion checklist and first implementation slice

- [x] M1: Current status/counts, tested source checkpoint (`bb02c50`) and dated publication/restoration receipts reconciled. The latest independently observed deployment identity remains the 17 October dashboard check; the 19 October public asset check has its narrower scope recorded.
- [ ] Release follow-up: publish/review the prepared source recovery only after the owner selects that release action, then verify the resulting deployment. The [recovery record](releases/cavite-production-recovery.md) supersedes stale no-publication wording in the older notes below.
- [x] M2: Five candidate decisions and evidence stored; holds/exclusions preserved; a supplementary FishBase lead is recorded as secondary evidence only. No public additions were made.
- [x] M3A: PAGASA manual-source feasibility and field-mapping decision documented; no automated feed is authorized or enabled.
- [x] M3B: Not applicable after the M3A no-go; no operational publisher or activation was attempted, and live coverage remains unavailable with the blocker documented.
- [ ] M4: Qualified rule/diet content and bilingual policies reviewed; public operator/contact and hosting facts confirmed.
- [ ] M5: Pilot tasks/targets agreed, sessions recorded, priority issues resolved or explicitly deferred, and next Cavite batch chosen.

Begin with M1, then the five-record M2.1 review. In parallel, perform only M3.1 source feasibility and M4.2 fact-gathering. Do not build multi-source publication support, purchase infrastructure or enable a live feed before the concrete source/batch justifies it.

For the current next action, use section 13 rather than repeating the completed first slice above.

## 12. Execution notes — 17 October 2026

- M1: corrected the product ledger from 39 pending / 1 excluded to the generated ledger's 38 pending / 2 excluded. The release record identifies the last previously verified production source and the newer application-code commits in the current branch; the reported full acceptance run has no tested commit/device checklist attached, so it is not treated as independent release verification.
- M2: completed an initial desk review of the first five candidates. All five remain out of the public snapshot. Three Smithsonian rows remain locality holds because the 1909 Corregidor/Manila Bay locality is broad, coordinate uncertainty is absent, and the provider warns its geographic retrieval fields may be inaccurate. Two National Museum records are CC-BY 4.0 in current GBIF records, but exact wild-capture locality and coordinate uncertainty are absent; the dataset also describes collection from landing sites and markets. These cannot safely establish a wild Cavite-water occurrence yet. Evidence and next checks are in `data/research/obis/cavite/cavite-pilot-five-record-review.md` and the location-review ledger.
- M3A: source feasibility found the official TenDay API requires an approved token and serves forecasts, while the public Southern Luzon page is a regional publishing page rather than a reviewed warning API. No warning adapter or live coverage was enabled. Live status remains unavailable; the evidence and a next path are in `docs/research/CAVITE_PAGASA_SOURCE_ASSESSMENT.md`.
- M4.1: expanded the source-backed feeding guide from two to five taxa. Three added marine examples are scoped to a 1993 San Miguel Bay study and its CC BY 4.0 repository record; no local-presence or bait claim was added. Existing independent rules and method research remains pending.
- M4.2: aligned the English and Filipino prototype drafts, disclosed unresolved operator/hosting-log facts, and incremented the acceptance version to `prototype-4` so users must review the revised drafts. Existing browser-local journals, photos, preferences and backups are not migrated or cleared. Qualified legal review, operator/contact details, and actual hosting settings/retention/recipients remain open. The personal contact supplied for the NAMRIA inquiry has not been made an app contact.
- M5: prepared the facilitator guide, a participant-notice draft and an empty results template, all using synthetic data and deidentified observations. The notice still needs responsible-operator, contact, retention and review decisions. No participant was recruited or tested, and the pilot cannot be described as run.
- M5 planning decision (17 October 2026): the project owner selected a mixed beginner and experienced-fisher audience for the first usability round. The project owner also chose to keep the email used for the NAMRIA inquiry private. Do not publish it, add it to app/participant copy, or use it as a public privacy contact. Recruitment remains closed until the participant notice, responsible operator, privacy contact, storage/retention, hosting facts, and any required review are completed.
- Follow-up after commit `bb02c5075941bfd4ea81c196488f638b9965c98a`: `test:research` 18/18, `test:i18n` 4/4, `test:storage` 2/2, `test:offline` 5/5, `test:advisories` 20/20, typecheck and production build passed. This verifies the pushed source only; no deployment or browser/device acceptance was performed. Evidence is in `docs/releases/cavite-pilot-baseline.md`.
- M2 supplementary research: FishBase lists Naic as the gazetteer locality for NMI 1657 and NMI 859, with dates and collectors. It cites a 2003 National Museum collection reference but does not expose the primary catalog page or resolve capture versus landing/market context. Both records remain pending and unplotted; evidence and limits are in `data/research/obis/cavite/cavite-pilot-five-record-review.md`.
- M3A field mapping: the PAGASA public regional page remains a manual link only. A human-verified publisher, regional coverage, source issue time and checked-at time are the only safe fields for now. Warning text, inferred Cavite impact, and “safe” status stay unavailable pending a stable authorized product and semantics review. Historical BFAR bulletin text is not current status.
- M3: completed via the documented no-go path. M3B is not an outstanding implementation task unless an authorized, stable source and operational owner become available.
- M4.1 legal-source follow-up: read the official Bacoor Ordinances 278-2023 and 292-2023 and cross-checked 292-2023 against the UP Law Center NARO listing. The texts provide different posting/publication conditions for effectivity, but no proof of those steps or a current certified copy was established. The coordinates in 292-2023 are zonation/use areas, not a complete municipal-water boundary; datum, current applicability, later amendments and reuse remain open. Cavite City Ordinance 2023-3388 is still verified only by its official archive listing. No legal recommendation or geometry was published.
- M4.1 national-order refresh: reviewed the official BFAR listing and source-indexed text for FAO 201-1, plus the DA's public FAO 277 update and January 2025 Mercidar case update. FAO 201-1's effectivity conditions were not verified, FAO 277 and FAO 244-1 final texts were not reviewed, and the current court docket disposition remains unverified. These are references only; no rule recommendation was enabled. The official 201-1 PDF could not be archived because TLS certificate validation failed; TLS verification was not bypassed.
- M5 usability preparation update: added an explicit first-time guide and Help replay task so the pilot covers the previously agreed interactive spotlight guide as well as discovery and offline journaling. Include both beginner and experienced fishers, report the small cohort's raw counts, and keep recruitment closed until the participant notice and privacy/review gates pass.
- M4.2 technical privacy fact follow-up: source inspection documented the same-origin advisory request and separately gated server-side feed fetch, while reaffirming that catch/photo records stay in IndexedDB and no catch-upload route was found. Current Production settings and host/CDN log retention remain unverified: this checkout has no linked Vercel project or installed Vercel CLI. The wording update is in `PRIVACY_REVIEW.md`; do not fill the hosting-notice placeholders by assumption.
- M4.2 contact decision (17 October 2026): Joseph Lopez is selected as the individual project operator for planning, and `tepezzzz070@gmail.com` was provided as the dedicated Bangwit public privacy/support route. Mailbox activity/monitoring and the operator wording still need confirmation; the private NAMRIA-inquiry email remains excluded. The participant notice records these decisions as provisional and keeps approval/recruitment on hold pending remaining policy facts and review.
- M5 internal UX check (17 October 2026): manually walked the first-use guide in English and Filipino on the local desktop app and at a simulated 390×844 browser viewport. Next/Back/Skip/Help replay worked and the first two guide steps fit the viewport. Updated the first step so browse areas are not presented as verified fishing grounds or legal boundaries. This is an internal single-browser/viewport check, not physical-device testing, participant testing, or production acceptance; offline journal writes and screen-reader behavior were not exercised. See `docs/CAVITE_PILOT_INTERNAL_UX_CHECK.md`.
- M4.1 Cavite City source follow-up (17 October 2026): the official 2023 archive listing advertises a PDF attachment for Ordinance 2023-3388, but the page returned 502 and direct retrieval failed TLS certificate validation. The legal text and effectivity remain unverified; no rule was encoded. See the source inventory.
- M4.1 reference-card follow-up (17 October 2026): added an internal register for national framework/order sources and Bacoor/Cavite City instruments, with source-text summaries separated from effectivity, current-status, map/CRS and reuse questions. The Bacoor 292-2023 source review found its publication/posting clause and two differently registered NARO records; neither proves the required publication/posting occurred or resolves the duplicate registration. No legal result, mapped zone or fishing recommendation was enabled. See `data/research/obis/cavite/cavite-rule-reference-cards.md`.
- M5 dashboard check (17 October 2026): expanded catch-group and source details, confirmed the source citation/review limitations and unavailable-warning labels, and fixed the mojibake “CaÃ±acao Bay” label by sharing one Cavite-area list across display and selection. Verified the area radio selection locally; no catch was saved. The internal UX note records scope and limitations.
- M4.1 later-code follow-up (17 October 2026): acquired the final 95-page Bacoor Ordinance 438-2025 PDF and reviewed its relevant fisheries/coastal and final provisions, with visual checks of the scope, effectivity and mayoral approval pages. Added a source card with section/page locators and a SHA-256 receipt, replaced the stale unreviewed-source note, and refined the unsent Bacoor inquiry. The ordinance's current interaction with 278/292-2023, effectivity evidence and implementing maps/guidelines/quotas remain open; no legal result was enabled. M4 remains incomplete.
- M4.2 hosting/owner follow-up (17 October 2026): confirmed the monitored public inbox and private pilot-note plan with the owner, prepared the empty local folder outside Git, and inspected the signed-in Vercel account read-only. Recorded Hobby, one Owner, no project/team drains, the bounded runtime-log window and the currently unconfigured public advisory endpoint. Updated bilingual privacy drafts to `prototype-5` and assembled `docs/CAVITE_PRIVACY_REVIEW_PACKET.md`; participant materials now contain the selected notes/access/retention/no-recording details. Provider metadata beyond the runtime-log window, support-email retention, final review, remaining owner questions and a fixed pilot build remain open. No external settings, deployment or participant session was changed/run.
- M4.2 verification: i18n 6/6, storage 2/2, offline precache 5/5, typecheck, scoped lint/format and production build passed. A separate local production-origin browser check verified English/Filipino draft rendering and the first-use scroll/language-reset gate without accepting the notice or writing a catch. Detailed scope and remaining review decisions are in the privacy packet; M4/M5 are not marked complete.
- M4.2/M5 owner-context follow-up (17 October 2026): the owner confirmed that Bangwit is currently an independent personal project and pilot participants will receive no compensation. Resolved these placeholders in the participant notice, privacy packet and facilitator/results materials. This does not imply institutional approval, final policy review or that any participant session has occurred; provider/email retention wording, final review and a fixed tested pilot build remain open.

## 13. Execution and remaining gates — 19 October 2026

| Work | Completed in this follow-up | Still required |
| --- | --- | --- |
| Release reconciliation | Corrected the record of `d167145` publication and the owner-authorized restoration to `cadbca7`. Remote `main`/review branch remain `d167145`; public assets expose `prototype-4`. Prepared clean local recovery commit `27b3b1b` whose tree equals `cadbca7`. | Owner selection of the concrete recovery publication; fresh dashboard/deployed-SHA and hosted acceptance after any authorized deployment. No push/deploy in this follow-up. |
| M4 fishing references | Refreshed the Cavite City retrieval attempt; identified the mismatched indexed attachment link and preserved the unavailable full text/effectivity status. Prepared [rule reviewer handoff](research/CAVITE_RULE_REVIEW_HANDOFF.md). Five scoped diet examples remain available. | Primary Cavite City text/effectivity, Bacoor ordinance interactions/maps/current applicability, national-order status and independent bait/gear/method evidence. No permission/safety result can be enabled from unresolved references. |
| M4 privacy | Owner selected support-email retention of 90 days after resolution, then deletion of working copies and emptying Trash. Refreshed provider documentation and prepared [review decisions](CAVITE_PRIVACY_REVIEW_DECISIONS.md). Added aligned English/Filipino email disclosure and local acknowledgment `prototype-6`. | No qualified reviewer is assigned. Applicable controller/basis/rights/complaint wording, Hobby hosting agreement/recipient/retention questions, detailed deletion exceptions and final bilingual notice approval remain pending. `prototype-6` is a review draft, not a Production release. |
| M5 preparation | [Runbook](CAVITE_PILOT_RUNBOOK.md), session guide and blank P01–P08 results template now contain review/build/setup receipts, six tasks, U/A/F/S scoring, raw denominators, stop/fix priorities and a 30-calendar-day note-deletion procedure. Recruitment script is unsent. | Approved notice, fixed tested build/URL, task/target agreement and verified private-note/reminder/test setup, followed by real voluntary sessions, findings/fixes and next-batch decision. No participants or results have been created. |

The 90-day support-email decision does not apply to pilot notes (30 days), local journals/backups, or Vercel/Google provider processing. The owner explicitly selected preparation of the handoff while qualified review is pending. The absence of a reviewer does not complete M4 or authorize participant sessions.

Verification so far: bilingual regression checks 6/6, storage 2/2, offline precache 5/5, typecheck, scoped Biome check and production build passed. The build generated 38 precache entries. These checks do not prove an existing populated browser journal survives policy reacknowledgment, a deployed `prototype-6` build, current-release traffic privacy, phone/installed-app behavior or participant acceptance. Final scoped browser/review outcomes are appended below when actually performed; the previous full acceptance report is not replaced by a new blanket pass.

- Scoped browser result: in the in-app browser at `http://127.0.0.1:4193`, both languages rendered the 90-day support-email paragraph with the provider-processing caveat. On `/catches`, the checkbox began disabled, scrolling to the end enabled it while it stayed unchecked, and changing language reset it to disabled. English was restored; no agreement, catch or backup action was submitted. No browser error logs were returned. This is a local first-use/copy check, not populated-journal or device acceptance.
- Recovery/test setup: the clean `27b3b1b` recovery tree also built successfully (38 precache entries) after installing the locked dependencies in that worktree. An initial shared-dependency junction failed Turbopack's filesystem-root check; only that verified QA link was removed, its shared target was preserved, and the successful build used an ordinary independent install. The recovery worktree remained clean and tree-identical to `cadbca7`.
- Populated-journal upgrade check completed after Joseph explicitly approved both local test acceptances and the synthetic restore. The same `http://127.0.0.1:4194` origin moved from the clean `prototype-4` recovery build to the `prototype-6` review build. The revised gate appeared; after reacknowledgment and another reload, exactly one catch with its decoded SVG, `7 in` and `2 lbs` remained. Both actual downloaded backups matched in every field except `exportedAt`. See [local upgrade acceptance](CAVITE_POLICY_UPGRADE_ACCEPTANCE.md) for source identities, artifact hashes, harness sequencing and limits. No Production, offline/device, legal or participant acceptance is implied.
- Read-only setup check found the private pilot folder present with zero entries. This is not an ACL/encryption/sync audit, a reminder receipt, or evidence of any participant session. An independent diff review found no actionable issues in policy/release wording and pilot scoring; it is not qualified legal review. Changed-document local-reference checks and `git diff --check` passed.

## 14. Additional preparation — 19 October 2026

- M4 review handoff now includes the [complete English/Filipino policy and acknowledgment copy](review/CAVITE_POLICY_DRAFT_SNAPSHOT.md), pinned to source `2f08dc7` / `prototype-6`, with 110 exact source-text matches and source fingerprints. The [privacy packet](CAVITE_PRIVACY_REVIEW_PACKET.md) itemizes the proposed, uncollected session/device/choice/task/deletion fields and distinguishes working notes from a future aggregate report and recruitment logistics. No final review or new retention decision is implied.
- M5 preparation now includes [exact A/B synthetic inputs and an original SVG](fixtures/cavite-pilot/README.md). The session guide follows the actual optional free-text Species input: A uses `SYNTHETIC pilot A`, while B leaves it empty. Source-based My Species expectations are explicit; fixture selection/offline/reconnect behavior on the selected build/device remains untested by this preparation. Recruitment and sessions stay closed.
- M4 national-source research added a bounded FAO 244-1 alternate official-source follow-up. The public NARO bulletin page inspected showed coverage only through May 2025, and an alternate BFAR regional index returned 502. No final order or effectivity/publication/registration proof was obtained; a coverage/access gap is not evidence of non-registration. The [rule handoff](research/CAVITE_RULE_REVIEW_HANDOFF.md) retains precise questions and unverified status.
- A [partial local request observation](CAVITE_LOCAL_TRAFFIC_FOLLOWUP.md) retained 39 HTTP(S) GETs to the test origin and no body data/external origins among those retained requests. The full reload lost earlier events, worker-target instrumentation was unavailable, and no hosted capture was performed. This narrows the technical evidence gap without closing it. The existing single synthetic catch/photo remained visible; no record write, restore, deletion, new notice acceptance, push or deployment occurred in this follow-up.
- M5 private-folder preparation: found an inherited automation-group read grant on the empty local notes folder, saved its original ACL outside Git and restricted that folder to the current owner/user, SYSTEM and local Administrators. Read-back confirmed the protected three-rule ACL, no automation-group grant and zero entries. The [runbook setup receipt](CAVITE_PILOT_RUNBOOK.md#empty-folder-setup-receipt--19-october-2026) records the exact scope/rollback reference; backup/sync, effective access and actual reminder/deletion operation remain unverified, so G5 is not complete.

Remaining gates are a qualified privacy/legal reviewer and approved notices/handling, outstanding authoritative rule facts before contextual advice, a selected fixed tested HTTPS release with complete relevant evidence, verified private-note/reminder setup and actual voluntary participant sessions. Prepared documents/fixtures and internal browser checks cannot supply these external decisions or participant results.

### Progress receipt — 21 October 2026

- Recorded the source-pinned protected Preview `15a1cf9` and its authorized synthetic A/B checks in the [candidate QA receipt](releases/cavite-preview-candidate-20261021.md). A saved and reopened while offline; B's offline-prepared draft survived reconnect and was saved once online. The downloaded backup contains exactly two expected entries, and both 829-byte photos match the original SVG byte for byte. These are internal checks, not participant results.
- The Preview's offline cold reload did not pass in the in-app browser. The old error tab was closed by the owner and the earlier synthetic A remained visible in a new online tab. The request capture is incomplete; full offline/startup and current-release traffic acceptance remain open. No protection was disabled and no Production change was made.
- Fixed the calendar discovered behind the native catch dialog. It now portals inside the dialog, with a stable containing block when reduced motion disables the drawer animation. Local production-build browser checks covered date selection, Escape/focus return, outside dismissal, normal/reduced motion, a 390×844 viewport and the outside-dialog journal date filter. No catch was saved during this calendar check. Offline precache tests (5), focused research tests (7), focused Biome, production build and loopback hosting checks passed.
- Prepared the [exact starter-content candidate inventory](review/CAVITE_STARTER_CONTENT_CANDIDATE.md): 12 historical specimens/taxa, 5 study-specific feeding examples and 11 provincial catch groups. No new content was admitted; owner/editorial and qualified review remain pending.

Next: validate the calendar change on its new protected Preview before selecting a fixed pilot release; complete the remaining startup/traffic evidence on that release; obtain the outstanding content/notice decisions and verify the note/reminder procedure before recruitment. G1–G7 remain unapproved where their required evidence or decisions are missing.
