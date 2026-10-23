# Bangwit: Philippines species expansion plan

Prepared: 22 October 2026; status updated 23 October 2026. Research foundation, local Taal checklist, Palico-Lian river evidence, a narrowly scoped Molawin Creek historical freshwater assertion, a corrected Laguna de Bay specimen assertion, and four flagged Pansipit River specimen assertions are implemented. Broader source review and regional expansion remain in progress. CALABARZON and all regional baselines are incomplete. These research updates do not constitute a complete regional baseline or a production release.

Delivery order: **Luzon -> Visayas -> Mindanao**. Build one reusable national catalog and evidence pipeline, then finish dated regional baselines in that order. Marine and inland research run together within each region.

## 1. Outcome and scope

Help someone choose a region and waterbody, explore fish documented there, understand the evidence and its limitations, and keep their own catches privately. The next substantial work is data coverage and the product integration needed to make it useful.

The proposed first national scope is **fishes**, including freshwater, brackish, marine, migratory, native, introduced and non-angling species when supported by sources. It includes bony fishes, sharks and rays; it is not limited to commercially caught fish. Crustaceans, molluscs and other aquatic groups require a subsequent, explicitly scoped catalog; this fish plan does not claim to inventory all aquatic biodiversity.

Coverage includes:

| Waterbody kind | Included scope | Important distinction |
| --- | --- | --- |
| Sea, coast, bay, gulf and strait | Named coastal/offshore study areas, reefs and associated habitats where documented | A regional coastal association is not a municipal-water boundary or permission to fish. |
| Estuary, lagoon and tidal river | Freshwater-marine transition areas and mangrove-associated waters | Salinity can vary by place, season and life stage. |
| River and stream | Main channels, tributaries, headwaters and source-described reaches | Evidence from one reach is not presence throughout the river or watershed. |
| Lake | Natural lakes, including small crater and upland lakes | Use a stable identity; names such as Lake Danao are not unique nationally. |
| Reservoir and impoundment | Dams, artificial lakes and documented connected waters | Distinguish wild/capture observations from stocking and aquaculture. |
| Wetland, marsh, floodplain and pond | Source-described inland habitats and connected seasonal waters | Captive ponds and culture facilities are separate evidence contexts. |

Waterbody kind and salinity are separate fields. A river may have freshwater and tidal/brackish reaches; a species may use multiple environments. Unknown attributes remain unknown.

## 2. Starting point and what changes next

The repository retains 12 reviewed historical CAS specimens/taxa for Cavite, maintains a research ledger of 52 occurrences under 27 candidate names, and supports three Cavite water-area choices. The first local expansion adds four separately scoped Taal Lake literature-checklist assertions from a 2023 source. This is a useful regression and integration baseline, not a complete regional or national checklist. See [PRODUCT.md](../PRODUCT.md).

The historical generator has one CAS dataset, CC0 admission and shared attribution. The candidate-review generator has a finite Cavite queue. The current map uses 2020 administrative geometry. National coverage needs a sibling normalized pipeline and a current administrative crosswalk; removing the Cavite gates or copying its fetch script for every province would not supply those capabilities.

Keep the existing Next.js App Router, TypeScript, Tailwind CSS and Serwist stack. Start with build-time public data packages and the existing local journal. A new cloud database, accounts or catch uploads are not prerequisites.

Outstanding NAMRIA correspondence, draft-policy review and pilot-release checks remain separate workstreams. They need not block internal species acquisition, taxonomy work or source review. No uncertain boundary, rule or warning becomes verified through this expansion.

## 3. What counts as completion

The deliverable is a **reviewed regional fish baseline as of a stated date**, not a claim that every living fish has been discovered or that every waterbody has been surveyed recently.

Freeze a regional scope manifest before each review cycle. It lists administrative units, waterbodies, applicable habitat classes, source searches and source versions. New discoveries enter the next version; they do not silently change the denominator of the current review.

Use two independent statuses:

- **Work status:** queued, acquiring, reviewing, baseline-reviewed, integrated, released.
- **Evidence coverage:** supported, partial, no usable evidence, or not applicable. Record this per waterbody/habitat, not just per region.

A region reaches **baseline-reviewed** only when:

1. All current provinces, NCR units and independent cities in its pinned administrative inventory are accounted for; no area disappears because it is absent from the old map.
2. Its source-derived waterbody inventory is reconciled, including applicable marine, brackish and inland classes. The starter examples below are expanded; reviewing only those examples is insufficient.
3. Every source/search in the agreed sweep is processed, or an access/rights gap is explicitly recorded with its attempted alternatives and follow-up owner.
4. Every candidate in the snapshot has a durable decision: admitted, excluded or held, with reason and evidence. A hold is a completed triage decision, not verified coverage.
5. Published taxonomic identities, geographic assertions, dates, licenses and citations pass validation. Unresolved claims remain outside the published projection.
6. Every waterbody has a visible coverage result. A lack of usable records is shown as a gap, never an empty-water or species-absence claim.
7. The regional manifest reconciles raw, normalized, mirrored, admitted, excluded and held counts, and states the remaining research gaps.

**Integrated** additionally requires usable region/waterbody navigation and correct rendering; **released** additionally requires the selected deployment checks and release decision. Finishing source triage does not imply that a region has adequate biological coverage or is live.

For each region, maintain both a first useful baseline and a longer-term gap backlog. Before advancing the delivery phase, review and record every region's baseline result; do not relabel unresolved biological gaps as complete. New-region research preparation can proceed while a difficult source remains held.

## 4. Administrative baseline and full regional order

Pin the PSA PSGC third-quarter 2026 release: **18 regions, 82 provinces, as of 30 September 2026**, published 12 October 2026. The tables are the proposed delivery sequence, not a ranking of biodiversity. [PSA release](https://psa.gov.ph/classification/psgc/node/1684084314), [region directory](https://psa.gov.ph/classification/psgc/regions).

Include MIMAROPA/Palawan in the Luzon delivery phase as a project convention. Administrative membership, island group, river basin and marine study area remain separate relationships.

The waterbodies below are **initial research anchors**, not verified species occurrences, fishing destinations or a complete waterbody inventory. Their identity, aliases, extent and source evidence must be checked during registry work.

### Phase L: Luzon -- eight regions

| Order | Region | Provinces | Initial inland work | Initial coastal/brackish work | Regional completion emphasis |
| --- | --- | ---: | --- | --- | --- |
| L1 | IV-A: CALABARZON | 5 | Laguna de Bay, Taal Lake, Pansipit and documented Cavite/Batangas/Quezon river systems | Manila Bay/Cavite, Batangas and Quezon coasts; documented estuaries | Prove the shared pipeline on historical, checklist and inland-survey evidence; expand beyond Cavite without assigning old records to a selected bay. |
| L2 | NCR | 0 | Pasig-Marikina reaches and Laguna de Bay connections | Manila Bay and tidal reaches | Account for cities/municipality directly; urban-water observations and pollution measurements do not establish safety or catchability. |
| L3 | III: Central Luzon | 7 | Pampanga basin, Angat/Pantabangan reservoirs, Candaba wetland; verified tributaries | Manila Bay, Bataan/Zambales and Aurora coasts | Separate wetland, reservoir, river and coastal evidence; share Manila Bay identity with NCR/IV-A. |
| L4 | I: Ilocos | 4 | Lower Agno, Abra and source-described tributaries | Lingayen Gulf and Ilocos coast/estuaries | Link shared river systems to CAR without spreading reach-specific records throughout the basin. |
| L5 | II: Cagayan Valley | 5 | Cagayan River, Magat system and documented tributaries | Cagayan/Isabela coastal waters and Batanes | Include island coverage and separate headwater, river, reservoir and estuarine records. |
| L6 | CAR | 6 | Chico, Abra and upper Agno systems; documented lakes/reservoirs/streams | Marine: not applicable | Make a fully usable landlocked-region experience; no invented coastal requirement or forced marine taxonomy identifiers. |
| L7 | V: Bicol | 6 | Bicol River system, lakes Buhi/Bato/Baao and documented tributaries | San Miguel Bay and other mainland/island coasts | Prioritize locality precision and sensitive/endemic-fish information; keep study-specific diet evidence scoped. |
| L8 | MIMAROPA | 5 | Naujan Lake and reviewed rivers/streams/lakes across its islands | Mindoro, Marinduque, Romblon and Palawan coastal/island waters | Audit each province/island; a mainland or Palawan-only source does not cover the entire region. |

Luzon exit: all eight regional manifests reviewed, shared waters reconciled, supported evidence integrated and the remaining coverage gaps explicitly listed. No nationwide-complete label.

### Phase V: Visayas -- four regions

| Order | Region | Provinces | Initial inland work | Initial coastal/brackish work | Regional completion emphasis |
| --- | --- | ---: | --- | --- | --- |
| V1 | VI: Western Visayas | 5 | Panay/Jalaur systems and source-described lakes, wetlands and reservoirs | Panay and Guimaras coastal waters/estuaries | Crosswalk historical Region VI sources; do not retain Negros Occidental in the current regional package. |
| V2 | NIR: Negros Island Region | 3 | Ilog-Hilabangan/Siaton systems; Balanan/Balinsasayao and documented smaller waters | Negros and Siquijor coasts | Include Negros Occidental, Negros Oriental and Siquijor; split old VI/VII labels using locality evidence. |
| V3 | VII: Central Visayas | 2 | Loboc and reviewed Cebu/Bohol rivers, reservoirs and small inland habitats | Cebu/Bohol coastal waters and tidal habitats | Include freshwater/stream evidence even where marine records dominate; avoid duplicate NIR allocation. |
| V4 | VIII: Eastern Visayas | 6 | Lake Danao in Leyte, Lake Bito and documented Samar/Leyte rivers | Leyte Gulf and the region's other island/coastal waters | Resolve repeated lake names and island-locality ambiguity; audit all six provinces. |

Visayas exit: all four manifests reviewed with current NIR geography and the same evidence/coverage rules used for Luzon. Retain historical source labels in provenance. [PSA NIR update](https://psa.gov.ph/content/second-quarter-2024-psgc-updates-creation-negros-island-region-and-correction-names-two).

### Phase M: Mindanao -- six regions

| Order | Region | Provinces | Initial inland work | Initial coastal/brackish work | Regional completion emphasis |
| --- | --- | ---: | --- | --- | --- |
| M1 | X: Northern Mindanao | 5 | Cagayan de Oro/Tagoloan/Pulangi systems, Lake Apo in Bukidnon and documented tributaries | Northern coastal/island waters and estuaries | Do not misassign Lake Lanao or Lake Mainit to Region X; separate upstream and downstream assertions. |
| M2 | XI: Davao | 5 | Davao/Tagum-Libuganon systems, Lake Leonard and documented smaller waters | Davao Gulf and eastern coastal waters | Crosswalk Compostela Valley to Davao de Oro while preserving the original name/date. |
| M3 | XIII: Caraga | 5 | Agusan River/marsh, Lake Mainit and documented tributaries | Butuan Bay and Surigao/Dinagat coasts | Represent marsh and lake evidence independently from coastal catches; reconcile shared basin records. |
| M4 | XII: SOCCSKSARGEN | 4 | Lake Sebu/Seloton and reviewed Mindanao-basin tributaries | Sarangani Bay and other documented coastal/estuarine areas | Separate stocking/culture, landing-site and wild-waterbody records. |
| M5 | IX: Zamboanga Peninsula | 4 | Reviewed peninsula rivers, streams, wetlands and impoundments | Peninsula and Sulu coastal/island waters | Include Sulu under current Region IX and handle Isabela City separately from Basilan province. |
| M6 | BARMM | 5 | Lake Lanao, Agus/Mindanao systems and documented wetlands/tributaries | Basilan/Tawi-Tawi and mainland coastal waters | Resolve historical ARMM, combined Maguindanao and Sulu labels; prioritize sensitive endemic records and uncertainty. |

Mindanao exit: all six manifests reviewed, island/mainland gaps visible, and current administrative crosswalk verified. Sulu is in current Region IX; BARMM has five provinces. [PSA Region IX](https://psa.gov.ph/classification/psgc/provinces/0900000000), [PSA BARMM](https://psa.gov.ph/classification/psgc/provinces/1900000000).

The totals reconcile to 38 Luzon-phase provinces + 16 Visayas provinces + 28 Mindanao-phase provinces = 82. NCR and independent/highly urbanized cities need additional inventory coverage; province counts alone are insufficient.

## 5. Faster source strategy

Use broad, reproducible source snapshots once, then derive regional review queues locally. Do not manually draw and download the same species separately for every province. Do not download the entire global OBIS database merely to obtain Philippine records.

| Source | Proposed use | Access/verification work before admission |
| --- | --- | --- |
| GBIF occurrence downloads | Nationwide candidate occurrences, museum/observation metadata and dataset citations; freshwater and marine inputs | Use official bulk download services for large jobs, retain query/download key, DOI, source identifiers and dataset/record rights. A GBIF hit is a candidate, not automatic approval. |
| OBIS | Complementary marine/brackish evidence and source datasets | Use filtered access or suitable exports, preserve QC and licenses, deduplicate mirrors of GBIF/provider records. OBIS alone is not a freshwater inventory. |
| Jamandre 2023 freshwater checklist / Plazi dataset | Seed the national freshwater candidate list and its literature bibliography | GBIF metadata advertises a CC0 checklist and archive. Inspect the actual fields, geographic resolution, extraction fidelity and cited treatments before admission. National inclusion is not river/lake presence. |
| WoRMS and Eschmeyer's Catalog of Fishes | Resolve fish names, synonyms, authority and taxonomic disagreements | Cache/version identifier matches; use an appropriate authority for freshwater taxa. A missing AphiaID must not exclude a valid freshwater fish. Check reuse terms for copied fields. |
| BFAR/NFRDI, SEAFDEC and university primary studies | Fill basin/lake/region gaps with surveys and original fishery research | Record study dates, exact scope, pages/tables and reuse terms. Landing/market monitoring requires catch-origin evidence before a wild-waterbody assertion. |
| DENR/BMB/EMB, LLDA, LGUs and protected-area publications | Source-described habitat/waterbody inventories, local studies and dated management context | Confirm names, scope and terms; water-quality or protected-area status does not itself supply a fish checklist or fishing permission. |
| FishBase and other biological references | Later enrichment of habitat, diet, common names and biological context | Verify access, provenance and redistribution conditions; no dependency on an unverified API or wholesale scraping. Use referenced primary studies where appropriate. |

GBIF documents asynchronous bulk downloads and account authentication; OBIS documents filtered API/mapper access and exports. These acquisition jobs can run while taxonomy/registry work proceeds. Account credentials stay in local environment configuration, never the browser bundle or Git. Do not add consumer API calls on every species-card visit. [GBIF download guide](https://techdocs.gbif.org/en/data-use/api-downloads), [GBIF access guidance](https://www.gbif.org/restricted), [OBIS access manual](https://manual.obis.org/access.html).

The freshwater starting point is a real, published research lead, not a verified imported dataset: [original checklist](https://www.biotaxa.org/Zootaxa/article/view/zootaxa.5301.2.1), [GBIF/Plazi CC0 metadata and archive links](https://www.gbif.org/dataset/f33f36f9-829f-4206-9dca-358ce455b037). No archive contents were audited in preparing this plan.

### Acquisition coverage rules

- Build a versioned fish-taxon selection covering the intended fish groups, rather than filtering one marine class or the informal word "fish."
- Combine Philippine country-coded records, reviewed geographic queries for relevant water areas, and locality-bearing/checklist sources. Country-only filtering can omit offshore/miscoded records; a rectangular extent alone can include neighboring-country records.
- Keep records without coordinates in a review queue when locality text/checklists could support a broad association. Do not discard all unlocated freshwater evidence or invent a point for it.
- Keep historical evidence with its dates. Store source observation/publication date separately from retrieval date; new retrieval does not make an old specimen recent.
- Save checkpoints, hashes, query parameters, result totals and retry/backoff state. Bound concurrency and follow provider limits. Failed pages and truncated queries must be visible in the manifest.
- Review missing/conflicting licenses; prefer clear reusable sources. A dataset license, record license, image license and paper copyright are different fields. Do not copy article text/figures because an extracted checklist is CC0.
- Use available eligible alternatives while a provider reply is pending. Never make an entire region depend on a single unanswered email.

## 6. Waterbody registry and geographic accuracy

Maintain stable IDs for region, province/city, waterbody and basin, with aliases and many-to-many relationships. A shared waterbody is stored once and linked to multiple administrative areas. Preserve source-era geography plus its current crosswalk.

Seed named basins from [PAGASA's basin inventory](https://pagasa.dost.gov.ph/flood), then reconcile with source studies and official waterbody references. PAGASA's basin names are geographic leads here, not species or safe-weather evidence.

Evaluate HydroRIVERS/HydroLAKES as physical-hydrography candidates where useful; inspect their product-specific licenses and resolution before integration. HydroLAKES covers lakes of at least 10 hectares, so it cannot be the complete inventory of small lakes/ponds. Hydrography does not establish legal boundaries, access rights or local names. [HydroRIVERS](https://www.hydrosheds.org/products/hydrorivers), [HydroLAKES](https://www.hydrosheds.org/products/hydrolakes).

Geographic assignment rules:

1. Retain original coordinates, datum, coordinate uncertainty and locality text in research storage where permitted.
2. Match records to the supported evidence scope: precise site/reach, named waterbody, province/region or country. Broad evidence stays broad.
3. Coordinates with uncertainty crossing a coast, boundary or multiple waterbodies cannot automatically establish an exact waterbody. Conflicting location fields go to review.
4. A basin polygon is not the wetted river, and a province's land polygon excludes most marine waters. Do not classify marine records as absent because they fall offshore of a land boundary.
5. Do not generate a 15-km coastal buffer and label it an official municipal-water boundary. Existing NAMRIA inquiries remain useful for that distinct future capability.
6. Generalize/withhold sensitive localities when justified; keep a separate public precision decision and its reason. An open license does not mandate a precise public pin.
7. Keep the old map's source year visible until replacement geometry is validated. New region selection can use an accurate registry even before the map outlines are upgraded.

## 7. Technical work breakdown

Proposed files below are implementation targets, not files already created. Reuse existing utilities and introduce dependencies only when a measured requirement warrants them.

| Work package | Deliverable | Completion evidence | Depends on |
| --- | --- | --- | --- |
| W0: Scope and inventories | National source registry; 18-region administrative inventory; L1 scoped manifest first, then remaining regional waterbody/source manifests | Stable IDs, date/version, explicit habitat applicability and all administrative units accounted for; each regional scope completed before its baseline review | This plan |
| W1: Acquisition | Checkpointed GBIF/OBIS/checklist adapters; local raw snapshots and receipt manifests | Repeatable queries, hashes, pagination/count reconciliation and restart after interruption | Minimum W0 gate below |
| W2: Normalization | Shared taxa, datasets, evidence, waterbody assertions and review ledgers | Original IDs/names retained; per-record citation/rights; precise evidence kinds; no mandatory marine identifier | W0, first W1 sample |
| W3: Taxonomy/dedup/geography | Cached taxonomy crosswalk; specimen/observation mirror links; scoped geographic matches | Ambiguous cases held; original records preserved; shared-waterbody associations tested | W2 |
| W4: Review and public generator | Approved source/batch policies plus exceptions; deterministic regional public packages and coverage report | Held/unlicensed rows excluded; all public assertions traceable; repeat builds identical | W3 |
| W5: Product integration | Region -> waterbody -> species navigation, habitat/source/date filters, evidence detail, coverage states | Supported freshwater/brackish/marine examples work; broad evidence remains broad; existing journal unaffected | First reviewed W4 package |
| W6: Luzon batches | L1-L8 inventories, decisions, regional packages and gap reports | Eight baseline results reviewed; integration checks for supported packages | W0-W5; repeat per region |
| W7: Visayas batches | V1-V4 using the same pipeline | Four baseline results reviewed; NIR/legacy-region crosswalk correct | Luzon phase review |
| W8: Mindanao batches | M1-M6 using the same pipeline | Six baseline results reviewed; Sulu/Maguindanao/independent-city handling correct | Visayas phase review |
| W9: Ongoing enrichment | Prioritized gaps, diet/local names/licensed images, periodic refresh and corrections | Dated field-level citations and revision/change reports | Start alongside admitted profiles; continue after each phase |

The **minimum W0 gate** for broad acquisition is the pinned 18-region administrative baseline, shared source registry and L1's scoped manifest. Do not wait for a complete national waterbody inventory. Finish other regional waterbody/source manifests alongside acquisition and before reviewing their respective baselines.

Suggested organization:

```text
data/research/philippines/       source manifests, taxonomy matches, decisions, coverage
data/research/philippines/raw/   ignored local source snapshots; never a public folder
src/data/geography/              reviewed administrative/waterbody registries
src/data/species/                generated reviewed index and regional packages
scripts/species/                 fetch, normalize, match, review-report and build tasks
tests/                          focused pipeline, geography and integration fixtures
docs/research/                   per-region scope, source and completion receipts
```

Start with JSON/CSV and streaming/local processing. If measured input size makes it necessary, add a local indexed processing database; it need not become an application backend. Keep raw snapshots and credentials out of the public directory, service-worker precache and catch backups.

### Minimum shared data contract

- **Taxon:** stable internal ID; accepted and recorded names; synonyms; family/classification; external authority IDs; authority/version; review state. Local-name aliases include language, location and source, and can map to multiple taxa.
- **Dataset/source:** provider, source ID/URL, version/hash, retrieval date, citation, license evidence, approved fields/uses and review decision.
- **Evidence:** provider IDs, evidence kind, recorded taxon, date and precision, locality/uncertainty, source/page/table, wild/captive/market/landing/unknown context and original provenance.
- **Geographic assertion:** evidence ID, supported region/waterbody/reach, precision, assignment basis, current/source-era administrative references and decision.
- **Review:** subject IDs or immutable batch membership, admit/hold/exclude outcome, rule version, reasons, evidence links and reviewer/date. Source changes invalidate affected approvals for re-review.
- **Coverage:** frozen scope version, queries attempted, inputs/duplicates/admitted/held/excluded counts, supported waterbodies/habitats, gaps and next action.

A national taxon can have many evidence records and many regional/waterbody assertions. A GBIF and OBIS mirror of one specimen is one linked evidence event with multiple provenance paths; two observations of the same species are not automatically duplicates. Common-name equality is not a taxonomic match.

## 8. Review efficiently without losing traceability

Automate format checks, exact approved taxonomy matches, rights checks, mirror detection and candidate geographic intersections. Human/agent source review then concentrates on exceptions and validates coherent batches instead of retyping records.

For an initial batch policy, propose full review of conflicting taxonomy/rights, market or culture context, source-location disagreements, uncertain borders and sensitive-locality decisions. For otherwise low-risk rows from a reviewed source, a documented batch rule may approve immutable membership after an audit sample (proposed: 10%, at least 10 rows or the whole smaller batch). A failed sample pauses the batch for expanded review. These are proposed operating checks, not statistical proof of biological completeness.

Routine source-backed decisions do not need an agency email. Unresolved scientific claims remain held for an appropriate expert; other eligible records continue. AI may help extract and organize facts but cannot manufacture distribution, diet, conservation status, images or citations.

Publish minimal useful profiles first: accepted identity, recorded aliases where sourced, supported locality/scope, dates, evidence type and attribution. Add diet, images and other enrichment as independently reviewed fields; missing enrichment need not block a sound occurrence record. A national diet study must not appear as a local feeding survey or bait-effectiveness promise.

## 9. Product behavior and performance

- Preserve the existing routes and local catch journal. Reuse shared controls, bilingual messages and search normalization rather than redesigning the whole site.
- Add Region, Waterbody kind, Waterbody and documented salinity filters. Only offer facets supported by reviewed fields; show unknown distinctly.
- Show one species profile with linked regional evidence, source dates and scope. Keep documented occurrences, provincial catch groups, legal/rule facts, safety advisories and private catches distinct.
- Display a useful region/waterbody page even when evidence is pending: inventory/coverage status and sources being reviewed, with no invented species list.
- Keep provinces and independent cities searchable; landlocked CAR works without coastal UI requirements.
- Load the selected region's public package on demand. Do not ship every raw occurrence or precache the whole Philippines by default.
- Measure compressed bytes, load time and phone memory on the first three-habitat slice; use those results to set package budgets before scaling. Optional regional offline packs are a later scoped enhancement if needed.
- Keep catch species free text compatible. Do not silently rewrite old personal catches, require a taxon selection or include public datasets in personal backups.

## 10. Verification tied to actual changes

Data/pipeline checks:

1. Existing 12-record Cavite snapshot and finite review fixture remain intact.
2. Approved CC0/CC BY records retain required per-record attribution; missing/unapproved/conflicting rights and held/excluded records never publish.
3. Mirrored specimens retain multiple source links without double-counting; ambiguous duplicate matches are held.
4. Freshwater taxa without AphiaIDs work; synonyms, homonyms and later taxonomy changes preserve source identity.
5. Cross-region waters, source-era geography, landlocked regions, uncertain coast/border points and unknown salinity retain correct scopes.
6. Month-only, year-only, missing and historical dates keep their precision; retrieval time is not observation time.
7. Interrupted acquisition resumes; truncated/failed queries cannot produce a falsely complete manifest.
8. Review manifests reconcile counts and deterministic rebuilds reproduce the same public output.

After product integration, check combined/reset filters, empty/partial coverage states, accessible keyboard controls, bilingual labels, package-loading behavior and the chosen regional offline behavior. Run the relevant research tests and typecheck/build for the change. Re-run storage/offline tests when integration touches those boundaries; do not repeat unrelated full browser QA for each documentation or source-only batch.

Each regional receipt records source versions, decisions/counts, public package hash, relevant test results, observed browser behavior and remaining gaps. Automated tests are not field surveys, legal approval or device acceptance.

## 11. First implementation cycle: ten working-day planning budget

This is an initial timebox to establish throughput, not a promise of complete CALABARZON or Luzon biological coverage. Some tasks run in parallel.

| Timebox | Concrete work | Reviewable result |
| --- | --- | --- |
| Days 1-2 | Pin PSGC units/crosswalk; create source/coverage manifests; inspect the freshwater checklist archive and current reusable sources | All 18 regions registered; CALABARZON waterbody/source scope; documented checklist fields/rights and first source receipts |
| Days 3-5 | Acquire broad eligible fish snapshots; normalize a bounded source sample; cache taxonomy and link source mirrors | Restartable ingestion, shared schema, counts and exception queues; no automatic publication |
| Days 6-8 | Review three source-supported contexts: marine, estuarine/brackish and inland lake/river; add a small inland/river example separately if the chosen inland batch is lake-only | Reproducible public candidate packages with genuine evidence for the claimed habitat, or an explicit source gap; mixed-source attribution verified |
| Days 9-10 | Integrate the first supported CALABARZON package and coverage views; run focused checks; measure acquisition/review/payload cost | Internal regional candidate, test receipt, gaps and measured estimate for the remaining Luzon batches |

If a qualifying brackish or inland source is not available in that window, hold that claim and work on another eligible source; do not infer habitat from a nearby coastline. The first slice must exercise all three environments before claiming the pipeline is ready for each of them.

Then complete L1's source sweep and proceed L2-L8. At most two regional review batches should be active together: one in review/integration and one being acquired. National acquisition and reusable taxonomy can already benefit later phases; regional delivery still follows Luzon, Visayas, Mindanao.

### Capacity model, not a nationwide deadline

After the first cycle, measure unique candidates processed, exception rate, reviewer time per batch and source access delays. Estimate remaining work from those observations.

- At one regional baseline per working week, the 18-region sequence needs about 18 regional-processing weeks after foundation.
- At two per working week, it needs about nine regional-processing weeks after foundation.
- These are arithmetic planning scenarios, not measured velocity or promises. Full waterbody gap closure, new surveys, enrichment and public-launch approvals can take longer and are reported separately.

Use more parallel work for source acquisition, taxonomy and bounded review tasks; do not open 18 unreviewed publication branches or wait on an arbitrary species-count quota. A sparse region is not made complete by adding unsourced names.

## 12. Priorities, owners and recurring completion receipt

Immediate order:

1. W0: register current geography and all 18 regional coverage statuses; complete L1's waterbody/source scope first and prepare the remaining inventories alongside acquisition.
2. W1-W4: the reusable acquisition and evidence pipeline, anchored by the freshwater checklist and eligible GBIF/OBIS/provider inputs.
3. W5: first CALABARZON marine/brackish/inland experience.
4. W6: the remaining Luzon regions in the table order, with parallel preparation and explicit gap reports.
5. W7-W8: Visayas, then Mindanao, reusing the proven pipeline.
6. W9: deepen smaller-waterbody coverage, diet/local-name/media enrichment and scheduled source refresh.

Joseph owns scope priorities and release decisions. Implementation agents handle acquisition, deterministic normalization, evidence-backed research, code and receipts. Routine clear cases use the documented batch policy; disputed taxonomy/locality or specialist content stays held for appropriate review. This plan does not assume an expert, dataset permission or agency response has already been obtained.

Each regional completion receipt should contain:

```text
Region / PSGC snapshot / review cutoff / package version:
Administrative units accounted for / total:
Waterbodies inventoried / source-sweep reviewed / evidence supported:
Marine, brackish and inland coverage, including N/A and explicit gaps:
Sources processed / attempted / unavailable, with alternatives:
Raw rows / normalized evidence / linked mirrors / admitted / held / excluded:
Accepted taxa with regional evidence (not an abundance measure):
Source, taxonomy, geographic and rights decisions:
Tests and actual product checks:
Remaining gaps, follow-up owner and next review date:
Work status / coverage status / release status:
```

Refresh according to source change frequency and available capacity: initially schedule a quarterly source/coverage review, plus corrections when a material issue is found. Do not label static species evidence as live data. Keep public package versions and a previous known-good snapshot for rollback.

## 13. Planning verification and boundaries

This document was checked against the current repository's product description, Cavite generators and Species/storage boundaries, and official source documentation linked above. Regional waterbody examples are starting leads; not every example received an individual geometry or fish-data audit. Source metadata/access documentation was researched, but national records were not acquired or admitted, and no app runtime was changed by preparing this plan.

The [Cavite plan](CAVITE_PILOT_IMPLEMENTATION_PLAN.md) retains its historical release, notice and participant gates. This roadmap changes the priority of development/data work; it does not mark those gates passed or authorize public release of unreviewed content.

## 14. First implementation receipt -- 22 October 2026

This foundation receipt records the state before the scoped review and app package in section 15; its test results and pending-state descriptions retain that original scope.

Implemented the [national research workspace](../data/research/philippines/README.md), with runnable status, import and validation commands:

- **W0 started:** 18 region identities and 82 provinces, plus independent/NCR and separately assigned coverage units (130 total). The official directories were captured and hashed; exact 3Q 2026 workbook verification remains pending after HTTP 403. Historical/current administrative semantics stay distinct from map geometry.
- **W0 regional starter:** 23 source/access references and 29 CALABARZON named waterbody/habitat leads: seven bays, two estuaries, six lakes, two reservoirs, seven rivers, two streams and three wetlands. All five provinces plus separate Lucena coverage are represented; this is not an exhaustive inventory or species coverage claim.
- **W1 first real import:** downloaded/verified the GBIF metadata and Plazi freshwater archive, then reproducibly extracted 374 unique name candidates from 78 family treatments. The archive's structured taxon table contains families, not the species list; the extraction preserves this distinction and source provenance. Four material citations were not imported as species occurrences.
- **Research safeguards:** every freshwater candidate remains pending, with no accepted taxon ID, regional/waterbody assignment or public admission. Snapshot hashes, cached rebuild checks, rights/identity validation, parsing failure checks and failed-refresh retention are implemented. Raw sources remain ignored and outside the app/public bundle.
- **W2 started:** completed 374 COL XR name queries with captured service-index metadata and checkpointed query/response hashes. Results are 329 exact-species, 16 synonym, 27 family-conflict and two status-review proposals; no taxonomic decision was adopted. The actual matching index is recorded independently of dataset-registry release dates.
- **W3 bounded locality review started:** six source-worded Taal Lake proposals and one broad-basin hold were separated from the national list. All remain outside the public projection; no dated observation or precise point was created. Direct original-survey retrieval attempts remain documented access gaps, not substitute table evidence.
- **W2-W4 still pending:** adoption of eligible taxonomic/locality decisions, broader local source acquisition, cross-provider occurrence matching and a reviewed mixed-source public generator. The present importer is a bounded checklist adapter, not a completed GBIF/OBIS national bulk-download system.
- **W5-W8 still pending:** regional product integration and completion of the Luzon, Visayas and Mindanao baselines. The existing 12-record public Cavite historical snapshot and private catch journal remain unchanged.

Verification: 19 Node pipeline/administration/taxonomy checks, seven Python importer checks and the existing 18 research regression tests passed. Cached freshwater and taxonomy rebuilds matched their generated artifacts; administrative validation, typecheck and focused Biome checks passed. No app runtime changed; no production build or browser/device acceptance was performed for these local research tools.

Next executable work is taxonomy review and acquisition of the original inland survey sources in the CALABARZON queue, followed by reviewed waterbody evidence. The 374 national names must not be copied into every region.

## 15. First scoped Taal checklist app receipt -- 22 October 2026

- **W2-W4 first bounded admission:** `taal-taxonomy-review.json` records independent identity checks; `taal-checklist-decisions.json` pins the reviewed inputs and admits four assertions: *Caranx ignobilis*, *Caranx papuensis*, *Caranx sexfasciatus* and *Sardinella tawilis*. The deterministic `src/data/taal-checklist-evidence.json` projection includes only approved fields from this batch. This is not wholesale source/provider approval.
- **Evidence scope:** the source reports “Lake Taal, Luzon Island” in a checklist published `2023-06-09`. Each record is a literature-checklist assertion with an unknown observation date. It does not prove current presence, freshwater-only ecology, abundance, conservation status, fishing permission, safety or bait effectiveness. No new coordinates, boundaries or map assignments are supplied.
- **Three holds:** *Exyrias volcanus* has conflicting/uncertain taxonomic status despite an exact COL proposal; *Silhouettea flavoventris* has a conflicting synonym proposal; *Cephalocassis manillensis* has broad Pasig-Laguna basin wording without a supported Taal/Laguna Lake assignment. They remain outside the projection with durable reasons and source evidence.
- **Frozen research inputs:** the original 374 candidate/proposal rows and seven locality proposals retain their pending metadata. The separate scoped ledger records seven decisions, four admissions and three holds; it does not silently relabel the national input as reviewed.
- **W5 first lake section:** the local Species implementation adds a separate Taal section with its own name search and source/identity details. Cavite bay filters remain scoped to the existing historical section. The 12 Cavite historical records, map behavior and private catch journal remain unchanged.
- **Reproduction:** `npm run species:build:taal` generates the batch; `npm run species:check:taal` requires byte-identical output from the pinned checked-in inputs. Raw source caches remain ignored and outside the public package.
- **Completion boundary:** this is a first lake checklist slice, not a completed marine/brackish/inland pipeline or regional baseline. CALABARZON remains partial; L1-L8, V1-V4 and M1-M6 remain incomplete. No push, deployment or release approval is included.

Next executable work is an eligible original inland river/reach survey and a brackish/estuarine source batch, using documented alternatives for inaccessible original studies. Then finish L1's broader source/waterbody sweep and gap report before regional delivery advances to L2 NCR. Taxonomy work for later Luzon, Visayas and Mindanao batches can reuse the cached national proposals without spreading broad checklist claims into unsupported waters.

Verification on 22 October 2026: 62 automated tests passed (25 Node research-pipeline, seven Python importer, 19 existing/new research regressions, six language and five offline-precache checks). Typecheck, focused Biome lint, production build, deterministic Taal/freshwater/taxonomy rebuild checks and administrative validation passed. Impeccable detection returned no findings on the changed UI files. The local production server returned HTTP 200 for `/species`, included all four admitted names and the independent controls, excluded all three held names, and returned 404 for the two probed research/raw paths. This checks rendered HTTP markup, not hydration or visual/browser behavior. Browser verification could not run because the browser-control provider reported `Browser is not available: iab`; desktop/mobile layout, interactive search/reset and keyboard checks remain pending. No deployment, participant session or current-release acceptance is claimed.

Public package: 4,140 bytes; SHA-256 `d984aaded5454f0b520dde5effc99f4cbb2c7c839c46f75b9dbb0b73e02b4f60`. The local production preview was started at `http://localhost:4202/species`.

## 16. First original river survey and brackish source review receipt -- 22 October 2026

- **W1 source and scope expansion:** the research registry now contains 28 source/access references and 30 CALABARZON named waterbody/habitat leads, including Palico-Lian River. These remain research leads, not an exhaustive inventory, exact geometry or verified regional distribution.
- **Original survey acquired:** the ten-page [Palico-Lian River paper](https://doi.org/10.31396/Biodiv.Jour.2025.16.4.579.588) was acquired using verified TLS and visually inspected. Its PDF and publisher terms have pinned hashes. `calabarzon-river-source-review.json` retains 15 candidates from Table 1, printed page 584 / PDF page 6; all remain quarantined with no public admission.
- **Keep counts and dates precise:** Table 1 plus marks give site richness of 9 / 7 / 13, matching Table 2. They are not specimen counts, abundance or a complete river census. Publication is `2025-11-14`; no field-sampling calendar date or year is reported in the complete article. Observation dates remain unknown.
- **Rights decision remains scoped:** the publisher permits copying, download, printing and distribution under custom wording. No CC0/Creative Commons license or blanket app-data approval is inferred. Proposed factual fields and their attribution still require an explicit batch admission decision; article prose, photographs, figure/table images and personal contacts are excluded.
- **Source inconsistencies retained:** Table 1 has 13 family labels while the prose reports 12; its origin labels total seven native/eight introduced while prose reports nine introduced. No origin or family-summary claim is adopted. *Megalops cyprinoides* is recorded in MUGILIDAE but independently matched to Megalopidae, so that family adoption remains held rather than silently corrected.
- **Independent first pass:** `palico-independent-review.json` records five WoRMS identity checks, four identity/family agreements and one source-family conflict. It is agent-assisted desk review, not qualified-expert certification, and grants no public admissions. Ten identities remain to be checked.
- **Parallel brackish path:** `calabarzon-brackish-source-review.json` records five primary leads and zero brackish admissions, with explicit station-context, rights and access gaps. Palico Table 3 chloride values and the authors' saline-intrusion discussion are retained as source context; no PSU conversion, species-wide brackish classification, current water-quality warning or estuary boundary is generated. Holds do not imply species absence.
- **Reproducible checks:** `npm run species:check:field` validates versioned reviews; `npm run species:check:field:raw` verifies the ignored source cache; `npm run species:fetch:field` reacquires the exact pinned PDF and checks the full normalized policy text; changed PDF content or policy text fails review. A failed/changed download never becomes an empty dataset or silently renewed approval.
- **Completion boundary:** no app or UI changes were made for this slice. The existing four Taal checklist assertions, 12 Cavite historical records and private journal are unaffected. The new river/brackish research is not live; no push or deployment is included. L1 CALABARZON and all later regional baselines remain incomplete.

Next executable work is to finish the ten remaining Palico-Lian identity checks, resolve the held family and permission decisions, then create a scoped immutable admission ledger before generating or integrating a public river package. Brackish source acquisition continues in parallel using eligible alternatives; no email response is a dependency. Complete L1's broader sweep and gap report before advancing regional delivery through Luzon, Visayas and Mindanao.

Verification completed on 23 October 2026 (Asia/Manila): 30 Node pipeline tests and seven Python importer tests passed. Focused Biome lint, field-cache verification, the real permitted PDF/policy re-fetch, research-status reconciliation and byte-identical Taal projection check passed. The source PDF SHA-256 remains `8f730d1d573d892d953464804a91970a2495e1851a9d46d5d9163715a21a509e`. The original policy snapshot remains separately retained; fresh policy downloads pin the complete normalized page text after removing markup/script/style content, so per-request Joomla tokens do not masquerade as changed permission. Tests reject a changed policy clause, source-ID substitution, altered accepted names/status, invented sampling dates and table/count drift. Raw originals/renders remain Git-ignored. No application runtime changed in this slice, so production build, browser/device tests and deployment were not repeated; the prior Taal acceptance limits remain in force.

The next step recorded above has since been completed in the 23 October receipt below.

## 17. Palico-Lian river evidence integration -- 23 October 2026

- **Identity closure for this source table:** the five earlier WoRMS checks plus ten exact-name WoRMS/COL cross-checks cover all 15 Table 1 names. The addendum has eight additional name/family agreements and two family conflicts. Across the full source table, three source family labels are held: *Megalops cyprinoides*, *Trichopodus trichopterus* and *Poecilia sphenops*. Source spellings remain intact in research records; no disputed family is silently corrected into the projection.
- **Scoped decisions:** `palico-river-decisions.json` pins the source review, independent review, identity addendum, registry and CALABARZON scope. It admits 12 table assertions and holds the three source-family conflicts. The approval is limited to attributed factual names, accepted families where source and authority agree, plus-marked site IDs and the citation/publication date. It is not blanket source approval. The publisher's custom permission is recorded as custom terms, not a CC license.
- **App projection:** `src/data/palico-river-survey-evidence.json` is built from the decision ledger by `npm run species:build:river`; `npm run species:check:river` checks it against pinned inputs. The bilingual Species page has a separate searchable river evidence panel with source, taxonomy and site-mark details. It remains separate from the Taal and historical Cavite filters and creates no map points.
- **Evidence limits:** the paper is published `2025-11-14`; field-sampling dates are unreported. Table plus marks indicate site richness, not abundance or individual catch counts. Assertions are not current-presence confirmation or a complete river checklist. No sampling coordinates, salinity, present-day water quality, waterbody-wide distribution, legal access, catchability, safety advice, diet or bait recommendations are inferred. Three family conflicts are excluded. Five brackish leads still produce zero admissions; this is not evidence of species absence.
- **Regional status at this receipt, before the later sweep in section 18:** `species:status` reports 18 rollout regions, 28 source references, 30 CALABARZON waterbody/habitat leads, four Taal assertions, 12 Palico-Lian assertions and three river holds. PSGC workbook verification remains pending; reviewed regional baselines remain zero. CALABARZON is partial, and later Luzon, Visayas and Mindanao batches remain queued. This is a useful inland-water slice, not a national species inventory or completion of L1.
- **Verification in this continuation:** `npm run species:check:river` passed with 12 assertions and three held; `npm run species:status` reconciled the expected counts and incomplete regional states. No test suite, typecheck, app build, browser/device QA or deployment was performed for this UI integration. Local source files and planning/product documentation changed; no push or release is included.

Next executable work is to continue L1 CALABARZON source coverage: resolve or explicitly retain the brackish-source gaps, review the remaining named lake/river/estuary leads against eligible source material, and publish a transparent gap report before advancing to NCR. Do not scale the 12 assertions to other reaches or copy the 374 national candidate names into local waters without independent scope and rights decisions.

## 18. CALABARZON source coverage sweep -- 23 October 2026

- **Source inventory:** `sources.json` now has 33 references, up from 28. Five new official/journal leads cover Tayabas River, Manila Bay, Balayan/Calatagan Bay, the NFRDI FY2023 Taal/Pansipit assessment summary, and the NFRDI-LLDA Laguna de Bay assessment announcement. The machine-readable decisions and access notes are in `calabarzon-coverage-source-sweep.json`.
- **Inland reach lead:** the [2013 Tayabas River paper](https://philjournalsci.dost.gov.ph/diversity-and-distribution-of-freshwater-fish-assemblages-in-tayabas-river-quezon-philippines/) is additionally described in [SEAFDEC repository metadata](https://repository.seafdec.org.ph/handle/10862/2236?show=full). The metadata reports three sampled stream sections and wet/dry seasons in 2010. The exact article table and item-level reuse terms were not verified; no table rows, exact municipality or reach geometry were added. Tayabas River is a Quezon research lead only.
- **Shared marine lead:** [NFRDI's Manila Bay trawl item](https://repository.nfrdi.da.gov.ph/items/5845cc49-44c8-4c18-8d4d-d458ceaa0aad) describes 16 stations in a 2014-2015 survey and an abstract total mixing fish and invertebrates. Station maps/tables were not inspected, so the study is not assigned wholesale to Cavite.
- **Other official leads:** [Balayan/Calatagan Bay poster metadata](https://repository.nfrdi.da.gov.ph/items/43c33cc3-7826-4068-8e12-ede31d616d37) has a title/abstract count mismatch and unreviewed image rights; the 51.49-MB poster was not downloaded. An [NFRDI FY2023 report summary](https://repository.nfrdi.da.gov.ph/server/api/core/bitstreams/3f88f5b7-4c87-47bb-999e-6564bbb1b255/content) reports Pansipit landing-center catches, not a full river survey, and its bitstream requested login. [NFRDI and LLDA announced a Laguna de Bay assessment](https://nfrdi.da.gov.ph/2025/06/18/nfrdi-llda-partner-to-assess-laguna-de-bay-fisheries/); the announcement contains no assessment results.
- **Scope:** `calabarzon-scope.json` now has 31 named waterbody/habitat leads across five provinces and separate Lucena coverage, including nine rivers. It remains a starter inventory: no geometry was validated, and Tayabas River reaches and local crosswalk remain open. The source update does not assert completeness.
- **Admission and brackish status:** zero species assertions were added from the five leads. No new brackish evidence met the station-context and rights checks; the existing five brackish source leads remain held. The four Taal checklist and 12 Palico-Lian survey-table assertions are unchanged. No species-absence, current-presence, abundance, catchability, legality, boundary, safety or diet claim follows from these sources.
- **Verification:** `npm run species:check:river` and `npm run species:status` passed after updating the hash-pinned source registry/scope references. No test suite, typecheck, build, browser/device QA, push or deployment was performed for this research-only update.

Next executable work is to acquire and rights-review the original Tayabas article/table and NFRDI Pansipit source, inspect Manila Bay station data without defaulting to Cavite, and resolve the Balayan poster's missing taxon only if the original is accessible under usable terms. Continue the smaller lakes, wetlands and reservoir sweep and retain explicit gaps before advancing from L1 CALABARZON to NCR. Do not copy national candidates or shared-water totals into unsupported reaches.

## 19. Manila Bay primary-source follow-up -- 23 October 2026

- **Source acquired:** downloaded the official 16-page NFRDI/Philippine Journal of Fisheries PDF for the 2014-2015 experimental trawl survey. The ignored local copy is `data/research/philippines/raw/calabarzon-source-retrieval-20261023/nfrdi-2017-manila-bay-trawl.pdf`, 1,368,815 bytes, SHA-256 `dc5733fbc9040efbc37a3ed80cba5cb923e67beb4b42870f34692d657aa2ad08`. See the [NFRDI repository record](https://repository.nfrdi.da.gov.ph/items/5845cc49-44c8-4c18-8d4d-d458ceaa0aad) and [primary PDF](https://repository.nfrdi.da.gov.ph/bitstreams/a2965005-8feb-46dc-90c6-840fe0189f93/download).
- **Cavite scope found:** the abstract describes 16 pre-established stations and 146 fish-plus-invertebrate species bay-wide. Table 3.2 groups trawl results by province and reports 24 fish species and 100 total mixed species for its Cavite grouping, against 118 total in the table summary. The 100 is not a fish-only count. Haul-frequency marks in the species rows describe survey frequency bands, not fish counts.
- **Rights and geography remain held:** no item-specific reuse license was found on the 2017 item/PDF. The [journal's current policy](https://www.nfrdi.da.gov.ph/tpjf/policy) states CC BY-NC 4.0 for manuscripts submitted under that policy; it is not assumed to apply retroactively. No table rows were transcribed into the app or admitted. The historic Cavite group supports a source-described locality association only; the station map has not been georeferenced and supplies no municipal-water boundary, current presence, catchability or safety claim.
- **Data artifacts:** the source registry now links the DOI, PDF and review status; the CALABARZON scope links the NFRDI source to its Cavite association with an explicit historical-scope note. The machine-readable decision is recorded in `calabarzon-coverage-source-sweep.json`. The 2017 source adds zero app assertions; prior Taal and Palico-Lian records are unchanged.
- **Tayabas remains unresolved:** the original 2013 article PDF fetch returned HTTP 403; no bypass or alternate restricted access was attempted. SEAFDEC/PJS metadata and indexed primary-article text support the historical study description, but item-specific reuse review and table admission remain pending.
- **Next:** seek rights clarification for the 2017 table, find an openly licensed or explicitly permitted source for smaller CALABARZON lakes/wetlands/reservoirs, then complete the L1 coverage-and-gap report before NCR. Keep survey history and source-described sector facts separate from current presence and legal/safety status.

Verification for this follow-up: raw PDF byte count and SHA-256 were checked locally; research JSON parsed successfully. `npm run species:check:river`, `npm run species:status`, and `git diff --check` are run for the updated hash-pinned registry/scope. No test suite, typecheck, build, UI, browser/device QA, commit, push or deployment is part of this source-review step.

## 20. San Pablo Seven Lakes source lead -- 23 October 2026

- **Source reviewed:** the official [Asian Journal of Biodiversity article page](https://asianscientificjournal.com/new/publication/index.php/ajob/article/view/995) and indexed primary text for Paller, Corpuz and Bandal (2017), DOI [10.7828/ajob.v8i1.995](https://doi.org/10.7828/ajob.v8i1.995). The abstract reports an aggregate two-year study of 5,166 fish individuals, ten species and six families across the Seven Lakes of San Pablo. The article index identifies the seven lakes as Sampaloc, Buot (normalized display alias Bunot), Mohicap, Yambo, Pandin, Calibato and Palakpakin.
- **Access limit:** the official publisher PDF request returned an interactive JavaScript/cookie challenge. No local PDF was saved and no challenge bypass was attempted. The article page and publisher-indexed primary article text remain the source for this research lead; the exact sampling calendar was not verified from the official page.
- **Open-data fallback screened:** exact-locality searches in the [GBIF public occurrence API](https://api.gbif.org/v1/occurrence/search?country=PH&locality=Sampaloc%20Lake&limit=50) returned five records for Sampaloc Lake (bird observations and algal specimens) and six bird observations for Pandin Lake; the other five exact-name queries returned zero. All 11 returned records were inspected and none was a fish. This narrow string search does not test spelling variants or coordinate-only records and is not evidence of fish absence; it supplies no fish evidence for this batch.
- **Rights hold:** no item-specific reuse license or signed 2017 agreement was available. The publisher's current [submission guidance](https://asianscientificjournal.com/manuscript-submission/) requires a signed Mandatory Copyright Transfer, but that current instruction is not treated as proof of the terms signed for this article. No species-table rows were transcribed or admitted.
- **Scope update:** `sources.json` now has 34 references and `calabarzon-scope.json` has 36 leads, including 11 lakes. The seven named lake leads are linked to the source; all keep unknown boundaries/salinity and no admitted species assertions. No coordinates, geometry or present-day fish claims were added.
- **Next:** resolve reuse rights or find an eligible alternative for per-lake evidence. Continue other CALABARZON lakes, wetlands and reservoirs, then publish the L1 coverage/gap report before advancing to NCR. The historical 2017 aggregate is not a current census or a per-lake species list.

Verification for the source-led scope update: JSON parsing and waterbody/source-reference reconciliation passed; the PDF challenge outcome is retained as an access limitation, not a successful download. The hash-pinned river projection is rebuilt and checked because its source registry/scope inputs changed. No app UI, new species assertion, typecheck, build, browser/device QA, commit, push or deployment is part of this step.

## 21. Makiling freshwater GBIF evidence -- 23 October 2026

- **Bounded open-data search:** the [GBIF occurrence API](https://api.gbif.org/v1/occurrence/search?country=PH&locality=Molawin%20Creek&limit=100) returned 47 records for the exact indexed locality string. This review grouped 34 as Aves, 10 as Insecta and three without a class field; all three no-class rows were the preserved-specimen fish *Gulaphallus mirabilis*. Searches for the exact strings Dampalit Falls and Cambantoc River returned zero. GBIF locality text is not a waterbody geometry; spelling variants and coordinate-only records were not searched, and zero-result strings do not imply absence.
- **Taxon and rights:** GBIF's accepted taxon record is cross-checked against the [Catalog of Fishes](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=32688). The [NHM collection dataset](https://doi.org/10.5519/qd.dyj48ok9) contributes two CC0 preserved-specimen rows and [CAS Ichthyology](https://doi.org/10.15468/efh2ib) contributes one CC0 row. Their three records share the taxon and locality string, so the app retains one assertion and preserves dataset citations and record-level quality flags. Record duplication is not interpreted as three fish, three independent events or abundance.
- **Precision limits:** all selected records lack event dates and coordinates. The 1933 substring in two catalog numbers is not used as a collection date. Two NHM rows retain institution/collection matching flags; the CAS row retains its continent-field and inferred-status flags. The only regional statement is a historical species/locality association with Molawin Creek text. No exact site, present-day occurrence, abundance, native status, catchability, legality, safety, diet or bait claim is made.
- **Article rights hold:** the 2011 Makiling article's species table remains unextracted. The NUS copy's Open Access label is not a reuse license: [NUS Digital Gems terms](https://digitalgems.nus.edu.sg/Terms_of_Use) state that access level alone does not permit reuse and prohibit creating structured datasets from its content without an explicit item-level license or written permission. No challenge or access control was bypassed.
- **Implementation and verification:** `makiling-gbif-source-review.json` is the immutable local review input; `src/data/makiling-gbif-evidence.json` is a deterministic projection displayed in its own bilingual Species section. `npm run species:check:makiling` and its focused three-test suite passed. `species:status` now reconciles its one assertion with two dataset sources, the Molawin waterbody lead and CALABARZON imported-assertion count. The unrelated Palico-Lian projection was rebuilt after refreshing its full-registry/scope hashes; the recorded diff confirmed its source and waterbody entries were unchanged. No complete regional inventory, mapped waterbody admission, deployment or expert certification is implied.

Next L1 work is a wider, bounded freshwater and coastal search across the remaining CALABARZON lake, river, reservoir, wetland and estuary leads using eligible GBIF/OBIS data and accessible source alternatives. For each source, reconcile taxon identity, rights, locality precision, date, coordinates, quality flags and mirrored records before deciding whether to admit a site-level assertion. Keep the Seven Lakes table, 2011 Makiling table, five brackish-source leads and inaccessible primary reports held until item-specific rights or eligible alternate data are available. Publish the CALABARZON coverage-and-gap report only after that pass; then advance to NCR and the remaining regions in the existing Luzon, Visayas, Mindanao order.

## 22. Laguna de Bay corrected specimen assertion -- 23 October 2026

- **Source reviewed:** the full peer-reviewed [Sorgon et al. (2025) article](https://doi.org/10.26757/pjsb202418006) reports one preserved *Barbonymus schwanefeldii* specimen from a fisherfolk catch, collected on 28 September 2024 and deposited in the ADMU Biodiversity Research Laboratory as ADMU 300008. The source associates it with Laguna de Bay; the accepted name is cross-checked against [Eschmeyer's Catalog of Fishes](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Barbonymus&species=schwanefeldii&tbl=species).
- **Locality correction:** the official [2026 corrigendum](https://asbp.org.ph/2025/12/16/volume-19/) changes the locality from Brgy. Patunhay to **Brgy. Calahan, Cardona, Rizal**. Only the corrected locality appears in the scope and app. The article text gives no capture coordinates; Figure 1 is not transcribed or georeferenced in this implementation. Its separate Talim Island report was not retained as a specimen and remains excluded.
- **Reuse boundary:** the journal's [official policy](https://asbp.org.ph/journals/) specifies CC BY-NC 3.0 for its articles. The displayed factual projection includes attribution and is limited to noncommercial use. Commercial reuse requires separate permission. No photos, figures or prose are copied.
- **Scope and caveats:** one historical specimen assertion is not a current-presence estimate, full lake inventory, abundance measure or neighboring-river record. No point, lake boundary, fishing permission, safety, diet or bait claim is inferred. The waterbody remains `publicAdmission: false`; CALABARZON remains partial.
- **Implementation:** `laguna-de-bay-specimen-source-review.json` is the scoped review; a deterministic builder creates `src/data/laguna-de-bay-specimen-evidence.json`. A bilingual Species section displays the accepted name, corrected locality, collection date, voucher, source citation, correction and rights. The batch is checked through `npm run species:check:laguna`; regional status validation reconciles it with the source registry and scope.
- **Next:** continue the L1 locality/source sweep across remaining lakes, rivers, reservoirs, wetlands and estuaries. Keep all broader regional and product completeness claims pending until each waterbody has a reviewed coverage status and source trail.

## 23. Pansipit River GBIF specimen batch -- 23 October 2026

- **Search and source:** an exact `country=PH`, `locality=Pansipit River`, `basisOfRecord=PRESERVED_SPECIMEN` search of the [GBIF occurrence API](https://api.gbif.org/v1/occurrence/search?country=PH&locality=Pansipit%20River&basisOfRecord=PRESERVED_SPECIMEN&limit=100) returned 19 rows. All were enumerated: 15 are bird records and four have a null class field. The four null-class rows are Field Museum fish-collection specimens and were checked individually by the recorded name, order/family, catalog number and collection dataset. The [Field Museum dataset](https://www.gbif.org/dataset/afc30a94-6107-488a-b9c0-ba9c4fa68b7c) marks the selected records CC0 1.0.
- **Taxonomy correction:** the four records resolve to four accepted taxa: *Zenarchopterus gilli*, *Ambassis nalua*, *Ambassis ambassis* and *Bathygobius cyclopterus*. Two records use synonym names: GBIF maps *Ambassis commersoni* to *A. ambassis*, and *Bathygobius mearnsi* to *B. cyclopterus*. The [Catalog of Fishes confirms](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=34346) the *Ambassis commersonii* spelling/recorded name as a synonym of *A. ambassis*; its [*A. nalua* entry](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=19760) is a separate valid species. This is why the count is four accepted taxa rather than three.
- **Precision and quality:** the source dates are preserved as one `1933-12` and three `1933` values. All four share a coordinate with no uncertainty value and carry assumed-datum plus institution/collection flags; three also carry recorded-date-mismatch flags. Coordinates are excluded from the app projection. The text locality supports historical locality assertions only; no exact reach, estuary, salinity, current presence, abundance, fishing permission, safety or completeness is inferred. The separate 2023 NFRDI landing-center summary is not merged into this batch.
- **Implementation:** the JSON review ledger freezes the query and exact four rows; the deterministic builder projects four historical species-locality assertions and preserves the original and accepted taxon names. A bilingual Species section links each occurrence, taxonomy authorities, the dataset citation and CC0 terms. `npm run species:check:pansipit` and `npm run species:check:laguna` verify the generated projections; `species:status` reconciles six CALABARZON historical source assertions across Molawin, Laguna de Bay and Pansipit. All remain outside map admission, and CALABARZON is incomplete.
- **Next:** continue the bounded search across remaining named rivers, reservoirs, lakes, wetlands and coastal systems. Review coverage gaps after the sweep; do not interpret exact-locality zero results as absence and do not promote specimen records to current presence.

## 24. Caliraya and Lumot reservoir source check -- 23 October 2026

- **Bounded open-data query:** GBIF's exact `Lake Caliraya` locality search returned four occurrence records. The alternate `Caliraya Lake` query returned zero. `Lake Lumot` and `Lumot Lake` each returned zero. The [GBIF Occurrence API](https://techdocs.gbif.org/en/openapi/v1/occurrence) documents the occurrence search endpoint; exact request URLs and response counts are frozen in `caliraya-lumot-gbif-source-review.json`.
- **Result review:** all four Caliraya rows are preserved specimens of the copepod *Arctodiaptomus dorsalis*, class Copepoda, from a dataset whose selected occurrence records declare CC BY 4.0. They are not fish and are excluded from the fish list and any diet/bait claim. The rows share an unvalidated coordinate with no uncertainty value; the review withholds that coordinate and makes no map point.
- **Decision and limits:** no fish assertion was admitted. Exact-text zeroes do not show fish absence; coordinate-only records, spelling variants and alternate names were not searched. These checks do not complete the reservoir review, establish current occurrence or validate geometry.
- **Implementation and verification:** the bounded review is registered under source ID `gbif-caliraya-copepod-occurrences`, linked to the two reservoir scope leads and recorded in the CALABARZON sweep. A focused test ensures non-fish records and empty locality results cannot be promoted into fish assertions or absence claims. Continue the L1 open-data sweep across the remaining inland and coastal leads.

## 25. Caliraya and Lumot conference abstract lead -- 23 October 2026

- **Primary source checked:** the publisher-hosted [Asian Journal of Biology Education Volume 14](https://aabe-asia.org/wp-content/uploads/2022/11/Asian-J-Biol-1-September-2022.pdf) contains a conference abstract on a fish survey of Lakes Caliraya and Lumot, printed page 40. It reports four sites per lake, 172 Caliraya and 105 Lumot fish individuals, and richness values of eight and nine respectively. The abstract names the most abundant taxa, but gives neither the complete species table nor exact sampling dates.
- **Rights and admission:** the issue front matter says “All rights reserved.” No item-specific reuse permission was verified. `caliraya-lumot-aabe-source-review.json` records the abstract facts as held research notes; no species assertion or aggregate abundance claim is admitted to the app, and no prose/table/image is reproduced.
- **Scope:** the source is linked to both reservoir leads in `calabarzon-scope.json`. Its reported richness is not a complete or current inventory. It does not change the separate bounded GBIF result or establish fish absence, exact geometry, current abundance, catchability, legality or safety.
- **Next:** obtain the complete species table and exact field-period details, then verify item-specific reuse terms. If either remains unavailable, keep the claims held and continue with eligible sources.
