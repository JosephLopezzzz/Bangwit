# Bangwit: implementation plan for completing the Luzon phase

Prepared: 16 November 2026. Status: S1 reconciliation complete for the 17 November snapshot; L1 administrative-scope preflight underway. No regional scope or baseline is frozen.

This plan turns the assessment's recommended order into five executable stages: reconcile existing work, freeze regional scope, complete evidence decisions and coverage, integrate eligible packages, then verify and release. It refines the [species expansion plan](PHILIPPINES_SPECIES_EXPANSION_PLAN.md) and reuses the [self-service acquisition backlog](SELF_SERVICE_DATA_ACQUISITION_PLAN.md). It does not mark any implementation stage or region complete.

The target is eight dated, reviewed regional fish baselines with visible gaps and supported content that works in Bangwit. This is a finite review of a declared snapshot, not a promise to document every living species or survey every small waterbody. Inaccessible sources can receive completed gap decisions; an unreconciled scope cannot be marked complete simply by holding its candidates.

## 1. Verified starting point

| Area | Repository state checked for this plan | Consequence |
| --- | --- | --- |
| Luzon tracker | Eight regions; zero baseline-reviewed; zero frozen scopes; all seven phase completion gates open | Start with reconciliation and scope, not a completion claim. |
| Source registry | 905 unique records across the project | Source count is not a Luzon species count or evidence-coverage measure. |
| Regional references | 47 direct evidence references and 34 broad open-work items | These are indexes and task groups, not a complete source/search denominator. |
| Region II index | At plan creation, 28 `region02-` review JSONs existed and 27 lacked direct L5 links | S1 has now audited and linked those 27 by their reviewed source locality/scope; see the current evidence index. |
| Acquisition | OBIS snapshot/rights/triage tools, GBIF bulk adapter, taxonomy helpers, and hydrography candidate tools exist | Reuse verified inputs and tools; extend only missing capabilities. |
| Fish selection | Current OBIS bootstrap covers Actinopterygii; the fish-wide GBIF selection remains unpinned | Resolve all intended fish groups, including sharks and rays, before claiming fish-wide acquisition. |
| Regional packaging | `scripts/species/build-regional-packages.mjs`, `data/research/philippines/regions/`, and `src/data/species/` do not yet exist | The shared package path is proposed engineering work. |
| App and media | Separate historical-evidence components exist; six canonical species-photo files and their standard/registry were included in the initial implementation batch | The S1 index inventories all 13 current `src/data/*.json` projections and records three CAS rights exceptions for future package decisions. Six photos do not complete media coverage. |
| Delivery | The initial research, UI, and image changes were pushed as `68f1f98`; S1 audit edits are now local | Current S1 work still needs attributable review and a separate commit/push. A local file, commit, successful build, and deployed release remain separate outcomes. |

Use [the existing Luzon manifest](../data/research/philippines/luzon-completion-manifest.json) as the top-level progress index. Do not duplicate its region status into another manually maintained scoreboard.

## 2. Implementation stages and dependencies

| Stage | Deliverable | Depends on | Milestone reached |
| --- | --- | --- | --- |
| S1: Reconcile existing work | Complete evidence index, gap report, current admission inventory, corrected progress summary | Existing files | Snapshot reconciled; known rights and metadata gaps explicitly carried forward |
| S2: Freeze scope | Versioned administrative, waterbody, habitat, search, and candidate scope for each region | S1 for that region | Review denominator fixed |
| S3: Decide evidence and coverage | Reproducible regional decisions, coverage outcomes, and reconciled counts | S2; existing acquisition tools | Regional baseline reviewed |
| S4: Integrate eligible packages | Shared package builder and usable region/waterbody/species navigation | Admitted S3 content; complete S3 for regional integration status | Regional package integrated |
| S5: Verify and release | Validation receipt, deployment acceptance, rollback package, refresh backlog | S3 and S4 | Regional release accepted |

Prove S1-S5 on CALABARZON first, then reuse the same contracts in L2-L8 order. Preparation and cached acquisition for later regions can continue while the current region is being reviewed. Discovery for Visayas and Mindanao can remain stored; it does not change the Luzon completion gate.

All new paths and command names below are proposals until implemented. No new runtime dependency, cloud database, account flow, or provider key is needed merely to track regional evidence.

The read-only audit and index now exist at `scripts/species/national/audit-regional-evidence.mjs` and `data/research/philippines/national/reviews/luzon-evidence-index-20261117.json`. The index inventories 79 review JSON files and 13 current app data projections, pins hashes for its tracked JSON inputs, records 32 source-scope regional decisions, checks local raw JSON availability without copying content, and captures the remaining gaps without changing species admission. The [source identity crosswalk](../data/research/philippines/national/reviews/source-identity-crosswalk-20261117.json) records ten exact DOI/title-and-URL identity groups while retaining their registry IDs, access histories, and distinct research findings. `npm run species:status` now summarizes this audit alongside the existing research inventory.

## 3. S1: Reconcile existing work

Work items:

1. Inventory tracked, modified, and untracked research files, generators, sanitized receipts, ignored raw-input receipts, public projections, and media records. Record hashes/version identifiers and whether raw inputs are locally available; do not copy private/raw files into tracked reports.
2. Add a read-only evidence audit under proposed `scripts/species/national/audit-regional-evidence.mjs`. Follow source IDs, review paths, and references transitively from each regional manifest. Support explicit root-relative and research-relative paths. Unrecognized reference fields become audit findings rather than guessed joins.
3. Classify every relevant review as directly linked, indirectly linked, shared across regions, superseded with a successor, or unaccounted for. Classify contextual and out-of-scope records explicitly. Do not infer region membership only from a filename. For Region II, audit the 27 files missing direct L5 links before adding links or changing status.
4. Reconcile source IDs, duplicate/mirrored studies, source versions, source access outcomes, and latest decisions. Multiple portals for one study are one underlying evidence source; historical versions remain traceable.
5. Inventory existing public projections separately from research holds. Record each projection's source, admitted fields, date precision, rights basis, and any later restriction. Treat later rights conflicts, including CAS holds, as explicit publication exceptions requiring resolution before the new package includes those fields.
6. Update the top-level manifest with the authoritative review/index references. Correct stale current summaries and link later validation receipts without rewriting historical work logs as if a later result existed earlier.

Proposed output: `data/research/philippines/national/reviews/luzon-evidence-index-<snapshotId>.json`, with regional membership, reference findings, projection exceptions, and input hashes. Extend `scripts/species/research-status.mjs` to summarize this index; reuse its current validations where possible.

Acceptance:

- Every relevant review in the audited snapshot has a documented disposition and regional/context relationship, including indirect references.
- Every required reference resolves or has a named unresolved finding. Shared sources remain shared; duplicate source-record aliases are crosswalked, broken source IDs are corrected, and distinct version/access histories stay separate.
- Existing public outputs and research-only material are separately accounted for. No held research row gains publication approval through indexing.
- The report distinguishes missing local raw inputs from missing source evidence. Its generated timestamp is outside content hashes so identical inputs produce identical indexed content.

**S1 checkpoint, complete for the 17 November 2026 snapshot:** The audit directly links all 28 `region02-` review files to L5 after reviewing their stated source geography; it also links four Region II hydrography crosswalks, seven explicit CALABARZON follow-ups, the shared Magat review to CAR, and the CALABARZON administrative-scope preflight to L1. At the S1 checkpoint, the index reported 79 reviews and 905 source IDs, no unresolved JSON paths or missing source IDs, and three CAS-derived public projections requiring rights reconciliation before any new package includes those rows. A local-only availability pass matched all 255 referenced raw JSON paths to 255 unique ignored local files; every receipt-pinned raw reference had a candidate matching its expected hash. Three other same-basename candidates were rejected by hash, while the correct files matched. No raw file content is copied into the tracked index. The source identity crosswalk groups ten exact DOI/title-and-URL matches while preserving registry IDs, access histories, and distinct research findings; it does not assert that version histories are equivalent. Two legacy Region II `phaseId: L1` versus `regionId: 0200000000` key mismatches remain recorded as metadata gaps; their explicit region IDs, direct links, and reviewed geography support Region II, so historical labels remain unchanged. The three CAS publication exceptions remain blocked from new package redistribution. The stale Palico-Lian source/scope fingerprints were refreshed only after confirming its exact source record and waterbody entry were unchanged; the projection was regenerated with the same 12 admitted and 3 held rows. `species:status` reported the audit successfully. S1's reconciliation and inventory acceptance criteria are met; all rights, version, and phase-key caveats remain visible for later regional decisions.

**S2 administrative-denominator and source-backed locality checkpoint, 17 November 2026:** The [initial preflight](../data/research/philippines/national/reviews/calabarzon-administrative-scope-preflight-20261117.json) found no lower-level locality rows in the pinned national registry. The [follow-up crosswalk](../data/research/philippines/national/reviews/calabarzon-administrative-denominator-reconciliation-20261117.json) enumerates 120 municipalities and 22 cities across five CALABARZON provinces (21 component cities plus separately represented Lucena). The detailed PSA directory tables state 31 July 2025; the current region page reports matching 2026 counts, and Q4 2025 through Q3 2026 releases were reviewed for changes. The official 3Q workbook remains blocked by a Cloudflare 403 challenge, so no workbook row-level import is claimed. The [first locality batch](../data/research/philippines/national/reviews/calabarzon-locality-source-backed-batch-20261117.json) recorded 13 assignments across seven leads. The [second batch](../data/research/philippines/national/reviews/calabarzon-locality-source-backed-batch-20261117-02.json) adds 55 assignments across 38 more leads and 14 association rows. The updated [locality-linkage audit](../data/research/philippines/national/reviews/calabarzon-locality-linkage-gap-audit-20261117.json) finds 106 of 158 leads still province-only, 15 leads with city codes spanning 12 of 22 city codes, 38 leads with municipality codes spanning 23 of 120 municipality codes, and four with no locality code. There are now 195 association rows. Manila Bay, Laguna de Bay, and Tayabas Bay remain shared identities. Codes describe source-named localities or explicitly labeled assessment/boundary contexts; they are not geometry. Zero leads have validated geometry or public admission. The 158 waterbody leads remain incomplete and `scopeFrozen` stays false. City and municipality counts may overlap for multi-locality waters.

## 4. S2: Freeze each regional scope

Work items:

1. Use the pinned administrative registry as the starting version and retain its verification limitations. Account for each province, independent city, and NCR unit; add needed municipality/city crosswalks using available reusable sources. Preserve source-era administrative names. Any unresolved administrative change is an explicit gap, not an automatic reassignment.
2. Reconcile existing named-water leads with source inventories, GeoNames, HydroLAKES, and reviewed catchment/network candidates. Check aliases, homonyms, duplicate sites, islands, and shared waters. Name equality and point proximity create proposals, not confirmed identities.
3. Give every included waterbody a stable ID, kind, source references, region/reach relationships, identity status, and applicable habitat lanes. Keep waterbody kind separate from observed salinity. Geometry is optional; unresolved legal municipal-water boundaries do not block text-based evidence.
4. Include rivers, tributaries, streams, lakes, reservoirs, wetlands, marshes, floodplains, ponds, estuaries, lagoons, coasts, bays, and island waters where documented. Keep aquaculture, stocking, markets, and landing sites as distinct evidence contexts. Account for unnamed and small-water gaps without inventing site identities or treating starter examples as the full inventory.
5. Freeze the search matrix: administrative/waterbody/habitat units, provider or archive, query terms and aliases, snapshot/version, retrieval cutoff, and expected decision output. Include both inland and coastal lanes; CAR's marine lane is not applicable.
6. Freeze candidate membership from existing reviewed inputs and new eligible acquisitions. Store the ID list and hash, not just a changing provider total. Later discoveries enter the next snapshot unless a documented amendment reopens the current one.

Proposed regional snapshot layout, aligned with the self-service plan:

```text
data/research/philippines/regions/<regionId>/<snapshotId>/
  scope.json       # administrative units, waterbody IDs, lanes, limits, source pins
  searches.json    # frozen searches, outcomes, attempted alternatives, follow-up owner
  decisions.json  # evidence membership, duplicate groups, admit/hold/exclude decisions
  coverage.json   # every scoped waterbody/lane and its evidence coverage
  manifest.json   # dependencies, hashes, counts, gate status, approval/validation refs
```

Large candidate memberships and exact localities remain in ignored research partitions with sanitized tracked receipts. Preserve earlier snapshots; update the top-level tracker to the active regional manifest.

Acceptance:

- All administrative units have coverage or an explicit unresolved scope entry, and all applicable habitat lanes appear in the search matrix.
- Known regional inventories and omitted/unnamed-water limits are reconciled rather than silently discarded. Blocking identity/scope gaps remain open.
- Search and candidate denominators are pinned and reproducible. `scopeFrozen` changes only after these checks; freezing does not change `baselineReviewed`.

## 5. S3: Complete source decisions and coverage

Work items:

1. Reuse existing archives and hashes before requesting more data. Pin the complete fish selection and taxonomy versions; keep an Actinopterygii-only batch labeled as such. Verify adapter capabilities before extending the existing OBIS/GBIF tools.
2. Process frozen searches through reusable occurrence datasets, original studies and supplements, institution-hosted data, and independently licensed archives. Government correspondence remains an optional follow-up. Respect provider limits, record failed pages, and verify expected/retrieved counts before treating an acquisition as complete.
3. Normalize evidence into the existing shared concepts: source/dataset, taxon, evidence item, waterbody association, and decision. Preserve original names, dates and their precision, identifiers, quality flags, context, and source locators. Country-level evidence cannot become a local river record.
4. Group provider mirrors and possible duplicates using persistent occurrence/catalog identifiers. Keep uncertain groups unresolved. A source name match checks nomenclature; it does not independently identify the sampled specimen.
5. Apply field-level publication rules to identity, locality, date precision, provenance, and reuse. Independently review conflicts, market/captive contexts, obscured locations, and disputed licenses. Keep unknown values explicit; do not infer coordinates, current presence, diet, or species absence.
6. Give every frozen candidate an `admit`, `hold`, or `exclude` decision with evidence, reason, rule version, decision author, and date. A decision row references the evidence unit and any supported geographic assertion so a study table is not counted as individual specimens.
7. For inaccessible or restricted sources, record the attempted normal access route, a bounded search for an eligible alternative, outcome, and follow-up owner. Use `no-usable-evidence` coverage when the agreed sweep is exhausted; unresolved sources cannot silently count as support.
8. Generate per-waterbody/per-lane coverage and a reconciled regional receipt. Review the largest uncovered geographic/habitat groups before spending more time on already well-represented sources.

Counts must use declared units. For each acquisition, expected source rows reconcile to received rows plus documented missing rows. For normalization, parsed plus rejected rows equals received rows. For a frozen candidate set, admitted plus held plus excluded equals unique candidates. Source-record/mirror membership, unique taxa, study-table assertions, specimen lots, and taxon-waterbody associations are separate totals; one cannot be substituted for another.

Use the self-service plan's batch-audit rule for straightforward admissions: at least 10% rounded up, minimum ten rows or the full batch if smaller, spread across represented providers/geographies/dates. Record the sample membership and rule version. A failed sample expands review to the affected rows and blocks that batch's publication until the problem is resolved and rechecked.

Acceptance:

- Every frozen search has a completed outcome or explicit access/rights gap with attempted alternatives; every candidate has a durable decision.
- All admitted fields trace to evidence and permitted reuse. All scoped waterbody/lane combinations show `supported`, `partial`, `no-usable-evidence`, or `not-applicable` with reasons.
- Required scope and count checks pass; source, taxon, and waterbody references resolve. Held/excluded rows remain outside public packages.
- Set `baselineReviewed` only when all seven regional gates pass. Coverage can remain partial or a documented gap after a complete review; report that limitation alongside the baseline date.

## 6. S4: Integrate eligible regional packages

Work items:

1. Implement proposed `scripts/species/build-regional-packages.mjs` using the frozen manifests and admitted assertions. Reuse existing evidence builders as compatibility fixtures; do not copy their hardcoded record counts into a generic generator.
2. Generate a small shared catalog index and separate region packages under proposed `src/data/species/`. Include public scientific names, supported waterbody/reach associations, dates/precision, citations, allowed quality notes, and coverage gaps. Include only reviewed public fields; strip raw source/private contact data and withheld coordinates.
3. Derive shared-water identity once and preserve source-specific reach/locality support in each package. A Manila Bay record is not automatically an NCR, Cavite, or Central Luzon occurrence. Avoid duplicated evidence counts when changing filters.
4. Adapt the Species page to shared region -> waterbody -> species navigation, using existing cards, `DropdownSelect`, bilingual dictionaries, evidence details, and source links. Load the selected region's package rather than every historical panel at once. Add clear loading, error, gap, and unavailable-data states; do not show fictional records to fill gaps.
5. Migrate a complete CALABARZON slice first. Compare old and new approved fields, citations, dates and evidence counts. Resolve deprecated or restricted outputs explicitly before removing or replacing an old component.
6. Add photos only through `src/lib/species-images.ts` and `SpeciesImage`, following `docs/SPECIES_IMAGE_STANDARD.md`. Check image-to-taxon links, item rights, local-file hashes, credits, uncropped whole-fish framing, and fallback behavior. Six currently documented photos are the audit starting set, not an instruction to reuse them for other species.
7. Link separately reviewed diet studies for species already supported in the package. Preserve method, life stage, study location/period, and limits. Keep natural diet, aquarium feed, and angling bait distinct. Unknown diet and missing photos keep their explicit fallbacks; neither blocks a valid occurrence package.
8. Keep region data compatible with Serwist's current offline behavior. Bound optional package/image caches and measure package bytes; leave raw data outside the app and install precache. Define an offline-not-downloaded state rather than promising all Luzon data offline.

Acceptance:

- Each displayed assertion has a decision, source and geographic scope; each filter shows the correct package and gap states. Rebuilding pinned inputs produces identical package content.
- Old approved evidence retains its meaning, and any change caused by a later correction is documented. Research-only rows and withheld coordinates do not leak.
- Region/waterbody filters work with keyboard, narrow screens, English and Filipino, missing photos, and unknown diets. User catch photos remain private journal content.
- A region becomes `integrated` only after its reviewed snapshot works through the shared navigation. A development fixture can prove the builder earlier without completing that region.

## 7. S5: Verify, release, and maintain

During implementation, validate changed contracts at the stage where they are introduced. Use meaningful fixtures for reference traversal, candidate decisions, mirror grouping, shared waters, missing/conflicting rights, partial dates, and invalid publication. Avoid a separate test for every paper note.

| Change | Required evidence |
| --- | --- |
| Evidence index and scope | JSON/schema and reference checks; direct/indirect linkage cases; unresolved scope remains open; source-ID/count reconciliation; `git diff --check` |
| Acquisition changes | Truncated-page detection, interrupted/resumed transfer, pinned totals/hash checks, and credential-free receipt checks |
| Decision/package builder | Hold/exclude leakage checks; duplicate/mirror examples; taxonomy and rights conflicts; shared-water precision; deterministic regeneration and permitted-field audit |
| Species UI integration | `npm run typecheck`, `npm run build`, applicable existing evidence/i18n checks, and focused keyboard/mobile browser QA in both languages |
| Offline/storage changes | `npm run test:offline` when package/cache behavior changes; `npm run test:storage` when journal/backup contracts change; focused offline/reconnect browser checks |
| Media changes | Registry/asset/hash/reference checks, source/license credits, fallback/whole-animal display, and bounded offline-cache behavior |
| Selected deployment | Verify the exact commit and intended Preview/Production target, source links and package loading, gap copy, relevant network traffic, and acceptance result |

Use existing `species:check:administration`, `species:check:taxonomy`, `species:check:field`, and applicable fixture checks where their inputs are part of the change. Report what actually ran; a plan, source audit, automated test, browser check, user report, and cloud deployment are different evidence.

Store a proposed `release-receipt.json` beside each regional snapshot with commit/package hashes, evidence period, gate results, admitted taxa and associations, habitat coverage, remaining gaps, validation commands/results, selected URL, release decision, and previous accepted package. Review/stage only attributable files from the current mixed working tree. Commit, push, and deployment are distinct steps to execute under the user's release instructions.

Acceptance:

- Applicable checks pass and failures are resolved or explicitly block the affected release; the exact deployed artifact is identified.
- The previous accepted package is available for rollback. A correction/rights withdrawal can remove affected public fields and regenerate dependent packages without deleting research history or private catch logs.
- Mark `released` only after acceptance of the selected deployment. Build success alone does not satisfy it.
- Record later source changes/removals, taxonomy updates and new-water discoveries in the next-snapshot backlog. Set a refresh cadence after the first accepted batch; this planning document creates no background job.

## 8. Regional execution queue

These are starting review priorities, not complete waterbody inventories. S2 must reconcile the full source-derived scope for each region before it freezes.

| Order | Region | Work to close before baseline review |
| --- | --- | --- |
| L1 | CALABARZON | Current scope: 164 research leads. Seek route-scale evidence for the four leads without a province/city/municipality code; the existing source reviews do not provide a per-feature municipality allocation. Then source-review the 105 province-only leads and add lower-level codes only where cited sources identify them. Reconcile missing islands, wetlands/unnamed waters and shared Manila Bay/Laguna de Bay/Tayabas Bay identities. Resolve or hold CAS rights, Dryad access, and West Bay EIS locality exceptions. No geometry is validated yet. |
| L2 | NCR | Account for all 17 units and named waters; distinguish Pasig/Marikina reaches, La Mesa, Laguna de Bay connections and shared Manila Bay. Reconcile parasite-host studies and incomplete station/source matrices without widening historical claims. |
| L3 | Central Luzon | Replace the unreconciled 168 mixed-waterbody total with a named/source-linked scope. Cover seven provinces, Pampanga reaches, Angat, Pantabangan, Candaba, wetlands, estuaries and Bataan/Zambales/Aurora coasts. Keep Bagac studies and sample-overlap questions distinct. |
| L4 | Ilocos | Reconcile four provinces, Lower Agno/Abra/tributaries, Lingayen Gulf and the coast/estuaries. Resolve held historical taxonomy/site tables or use eligible alternatives; reconcile upstream relationships with CAR. |
| L5 | Cagayan Valley | Account for Region II's existing reviews; cover five provinces, Pacific-draining waters, Batanes, Magat, separate Quirino/Nueva Vizcaya waters and estuaries/coasts. Keep barcode, purchase/landing, and field-location claims distinct. |
| L6 | CAR | Reconcile all six provinces and shared Abra/upper Agno/Chico/Magat connections, rivers/streams, lakes/reservoirs, wetlands and rice-terrace contexts. Keep Ibulao in Ifugao/CAR. Record marine coverage as not applicable. |
| L7 | Bicol | Resolve the Bicol River scope/count conflicts; include Buhi/Bato/Baao, tributaries, San Miguel Bay and the six mainland/island provinces. Apply source-specific sensitivity and endemic-fish review. |
| L8 | MIMAROPA | Cover five provinces and island-specific inland/coastal/estuarine lanes beyond Naujan and Palawan. Address Marinduque, Occidental Mindoro and Romblon gaps; record inaccessible sources and alternatives. |

## 9. Completion reporting and effort

Generate progress from the active snapshots. Show regions with frozen scopes, baselines reviewed, packages integrated and releases accepted as separate counts out of eight. Within each region, report administrative coverage, waterbody/habitat coverage, searches completed/planned, candidates decided/frozen, admissions/holds/exclusions, and named unresolved gaps. Keep photo and diet enrichment counts separate. Do not calculate a single completion percentage while the scope denominator is changing, and do not use papers visited or registry growth as completion metrics.

Planning timeboxes for the first reusable slice:

| Work | Initial engineering/review allocation | Re-estimation point |
| --- | --- | --- |
| S1 all-region reconciliation | 1-2 focused days | Evidence graph and current publication exceptions accounted for |
| S2 CALABARZON scope | 2-3 focused days | Source inventories and small/unnamed-water gaps reconciled |
| S3 first frozen evidence batch | 2-4 focused days | Measure rows reviewed, exception rates and decisions per hour |
| S4 shared builder/UI slice | 2-3 focused days | One reviewed package integrated and payload measured |
| S5 acceptance/fixes | 1-2 focused days | Exact release verified and receipt complete |

These are timeboxes for shared tooling and a bounded first batch, not a promise to finish the whole first region or Luzon in 8-14 days. Re-estimate remaining regional review from the frozen candidate/search totals and measured throughput. Batch size can shrink to make a package reviewable; all agreed regional scope must still be accounted for before marking the regional baseline complete.

Luzon phase completion requires all eight reconciled regional baselines, shared-water deduplication, integrated eligible content and visible gap coverage, plus acceptance for the releases selected in this plan. Claims of exhaustive biological knowledge remain outside that definition. Continue the same proven contracts into Visayas and then Mindanao.

## 10. First implementation checkpoint

S1 reconciliation and the CALABARZON locality denominator are current through the 18 November snapshot: 164 waterbody leads and 201 administrative associations. The two source-backed batches covered an earlier 158-lead snapshot; later LLDA and Bay/Makiling crosswalks added six net leads. The current snapshot has 55 leads with city or municipality codes, 105 province-only leads, and four leads without province, city, or municipality codes; 12 of 22 city codes and 25 of 120 municipality codes appear. A bounded OSM search found three Palicpican River ways labeled in Ternate; two share a node and one is disconnected. The name and geocoder labels do not confirm identity with the official protected-landscape mention, so no locality or geometry was admitted. Exact searches for Mamba/Cacabay, Bucal (Lalangnan), and Labayat returned no candidates, which does not establish absence. Continue S2 with independent crosswalks for the four unresolved leads and locality review for the 105 province-only leads, while inventorying omitted islands and shared marine, brackish, and inland waters. Keep source-specific locality separate from routes and geometry. Do not freeze the waterbody scope until its denominator and unresolved gaps are reproducible; do not promote research-only candidates into the app without passing the evidence and rights gates.

Planning validation: check Markdown links, proposed-versus-existing path labels, stage dependencies and consistency with the current manifests; run `git diff --check`. This document alone requires no project test, build, provider download, source admission, commit, or deployment.
