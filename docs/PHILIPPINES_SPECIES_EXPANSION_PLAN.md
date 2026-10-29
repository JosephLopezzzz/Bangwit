# Bangwit: Philippines species expansion plan

Prepared: 22 October 2026; status updated 29 October 2026. Research foundation, local Taal checklist, Palico-Lian river evidence, a narrowly scoped Molawin Creek historical freshwater assertion, a corrected Laguna de Bay specimen assertion, four flagged Pansipit River specimen assertions, a corrected GBIF taxon-key audit, an NCR discovery checkpoint, one attributed Pasig River historical collection-event projection, and an L3 Central Luzon discovery checkpoint with a reviewed Bataan river source table, cross-study conflict review, and three historical Bulacan Manila Bay specimen assertions are in the repository. Follow-up L3 reviews include a GBIF station-proximity screen, a catalog-only review of the 2005 Pampanga River/Apalit thesis, and a held 2019 Cabiao river fish-and-diet study with a six-name nomenclature crosswalk; none added new species assertions. CALABARZON, NCR, Central Luzon and all other regional baselines remain incomplete. A national CC BY 4.0 hydrology source now supplies a 128-catchment spatial planning frame; the broader 770-basin PHD data and regional geometry overlay remain pending. These research updates do not constitute complete regional baselines or a production release.

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

The historical generator has one CAS dataset, CC0 admission and shared attribution. The candidate-review generator has a finite Cavite queue. The current map uses 2020 administrative geometry. National coverage needs a sibling normalized pipeline and a current administrative crosswalk; removing the Cavite gates or copying its fetch script for every province would not supply those capabilities. Use the acquired 128-catchment layer only to organize river-source discovery; its 250 km2 threshold excludes smaller systems, and it does not supply species evidence or lake coverage. Keep a distinct, verified lake/reservoir inventory and resolve catchment-to-region links with licensed geometry before regional completion.

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
- **Other official leads at the initial sweep:** [Balayan/Calatagan Bay poster metadata](https://repository.nfrdi.da.gov.ph/items/43c33cc3-7826-4068-8e12-ede31d616d37) showed a title/abstract count mismatch; the full poster was reviewed in a later follow-up below, while its reuse terms remain unverified. An [NFRDI FY2023 report summary](https://repository.nfrdi.da.gov.ph/server/api/core/bitstreams/3f88f5b7-4c87-47bb-999e-6564bbb1b255/content) reports Pansipit landing-center catches, not a full river survey, and its bitstream requested login. [NFRDI and LLDA announced a Laguna de Bay assessment](https://nfrdi.da.gov.ph/2025/06/18/nfrdi-llda-partner-to-assess-laguna-de-bay-fisheries/); the announcement contains no assessment results.
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

## 26. Five additional CALABARZON GBIF locality checks -- 23 October 2026

- **Bounded searches:** public GBIF occurrence searches with `country=PH`, each named `locality` string and `limit=100` returned zero for Maragondon River, Tanay River, Dumacaa River, Lagadlarin Mangrove Forest and Ticub Lake. The request URLs and timestamps are retained in `calabarzon-gbif-locality-sweep-20261023.json`.
- **Scope update:** the five waterbody leads now record these bounded source checks. The exact-string zeroes do not establish fish absence; aliases, coordinates/polygons and alternate providers remain unchecked. No species assertions, geometries, salinity or fishing claims were added.
- **Next:** check documented aliases and accessible local survey alternatives, then include these unresolved leads in the CALABARZON coverage-and-gap report.

## 27. CALABARZON alias and source follow-up -- 23 October 2026

- **Source-backed locality variants:** six GBIF searches for `Tikub Lake`, `Tanay River System`, `Mouth of Tanay River`, `Iyam-Dumacaa River System`, `Iyam and Dumacaa Rivers`, and a body-text spelling variant `Lagardlarin Mangrove Forest` returned zero rows. The formal Iyam-Dumacaa system and Tanay sampling-station labels are not aliases for whole rivers. The likely Lagadlarin/Lagardlarin typo is not adopted. The fish-study-supported `Tikub Lake` name is added as an alias to the existing `Ticub Lake` scope lead. URLs and per-query outcomes are in `calabarzon-alias-source-followup-20261023.json`.
- **Maragondon fish lead:** the complete 2014 [goby barcoding paper](https://rjpn.org/IJCSPUB/papers/IJCSP10A1190.pdf) and its [publisher landing page](https://rjpn.org/ijcspub/viewpaperforall.php?paper=IJCSP10A1190) were reviewed. The landing page states CC BY 4.0. The paper describes three old, pre-collected goby phenotypes and conflicting putative species identifications across morphology, BLAST and phylogenetic discussion. It says voucher specimens were sent to the National Museum, but does not give a verification result. All three species-level claims remain held for independent review; no river reach or coordinates are adopted.
- **Tikub/Ticub fish lead:** the [2014 Asian Journal of Biodiversity article](https://www.ejournals.ph/article.php?id=1509) reports a historical survey of nine species in Tikub Lake, Tiaong, Quezon. The publisher landing page gates the full text; [ResearchGate lists an author-uploaded full text](https://www.researchgate.net/publication/267335974_Freshwater_Fishes_of_Tikub_Lake_Tiaong_Quezon_Philippines) and warns it may be subject to copyright. No item-specific license was verified, so the table and all study-derived species claims remain held. The `Tikub Lake` GBIF alias query returned zero, which does not establish absence.
- **Other alternatives:** the official [LLDA Tanay River report](https://llda.gov.ph/wp-content/uploads/dox/waterqualityrpt/rivers/tanay.pdf) supplies water-quality station context, not fish data. The 2024 [UPLB Lagadlarin study](https://ovcre.uplb.edu.ph/journals-uplb/index.php/JESAM/article/download/1185/949) assesses mangrove plants, not fish. A third-party Dumacaa user-catch page was excluded from the species catalog because it is not a source-reviewed inventory. An alternate [AABE journal-volume PDF](https://www.aabe.sakura.ne.jp/Journal/Papers/Asian%20J%20%20Biol%201%20September%202022.pdf) contains the same Caliraya/Lumot conference abstract and no complete species table or exact sampling dates.
- **Implementation and limits:** the source registry now has 44 references and the CALABARZON scope records the source-supported Tikub alias plus held/limited source leads. There are zero new species assertions and no public projection, UI change, geospatial geometry or fish-absence claim. No email, login, payment or access-control bypass was used.
- **Next:** seek independent taxonomic or National Museum voucher verification for the Maragondon gobies, and find an item-specific reuse basis or eligible alternative dataset for Tikub Lake. Continue the broader L1 freshwater and coastal sweep; publish the CALABARZON coverage/gap report before advancing to NCR.

## 28. SEAFDEC Taal assessment metadata follow-up -- 24 October 2026

- **Source found:** the official SEAFDEC/AQD repository record for Mutia et al.'s 2013 *Fishery resource assessment of Taal Lake, Batangas, Philippines* describes a 2010 landing-catch survey at major sites in 11 coastal towns around Taal Lake. Its abstract reports 47 organism species in total, including 38 finfish species.
- **Access and rights:** the repository item has no associated chapter or data file, no per-town species allocation is visible, and no item-specific reuse license was verified. The metadata is retained as a historical source lead only; the species list remains held and no app projection changed.
- **Limits:** this aggregate survey summary is not current presence and does not identify species by individual town, station, or waterbody boundary. The 47 total includes crustaceans, mollusks, and reptiles; it must not be described as 47 fish species.
- **Implementation:** `calabarzon-seafdec-taal-followup-20261024.json` records the source and review; `sources.json` registers its access/rights status; the source-sweep ledger and regression test enforce zero species admission until source access and reuse are resolved.
- **Next:** retain the item as held if no full chapter is available through authorized access, and continue the CALABARZON source sweep across other freshwater and coastal leads.

## 29. NFRDI Taal field-guide source review -- 24 October 2026

- **Source found and acquired:** the official NFRDI Knowledge Products Repository provides the 2023 *Fishes of Lake Taal: A Field Identification Guide*. The guide says its 45 fish species are actual records from landed-catch surveys conducted from 2014 to 2018. The per-species pages identify their landing-site scope; 16 records name municipalities/cities and 29 use the guide's broader “Lake wide” label.
- **Rights:** printed page 2 states CC BY-NC 4.0. The evidence can only be redistributed noncommercially with attribution. No photos, page images, layout or prose are copied. Public publication is held pending a clear noncommercial scope for Bangwit.
- **Review:** all 45 source-reported names and landing-site labels were extracted with printed/PDF page locators. A local crosswalk to the frozen 2026 COL XR proposals found 40 exact-name proposals, one family-conflict proposal, and four names not represented in that freshwater checklist proposal set. All 41 proposals remain pending; the crosswalk is not a fresh taxonomy lookup or approval. The study period is not an exact date per species. Source-native/introduced labels, diet, common names and other FishBase-derived fields are not adopted.
- **Implementation:** `calabarzon-nfrdi-taal-guide-review-20261024.json` is the bounded review ledger. The original PDF is stored in ignored raw research storage with its SHA-256 recorded. A regression test keeps the 45 rows out of the public app projection until review is complete.
- **Next:** independently resolve the 40 exact proposals, the family conflict, and four names outside the frozen candidate set; confirm whether the product's public use remains noncommercial; then consider a separate attributed historical-catch evidence section for Taal.

## 30. Catalog of Fishes name follow-up for the NFRDI Taal guide -- 24 October 2026

- **Independent name check:** all 45 California Academy of Sciences Catalog of Fishes pages were fetched over ordinary HTTPS for the NFRDI guide's source-reported names. Each queried record contains a current `Valid as` statement for the same binomial. The pages, retrieval paths, and SHA-256 values are recorded in `calabarzon-nfrdi-taal-taxonomy-followup-20261024.json`.
- **Family discrepancies:** the catalog disagrees with the frozen COL XR matching family for `Hypophthalmichthys nobilis` (Cyprinidae versus Xenocyprididae) and `Oligolepis acutipennis` (Gobiidae versus Oxudercidae). Preserve both source-specific classifications and choose the taxonomy backbone before using families in product content; do not rewrite the frozen matching results.
- **Boundary:** a catalog name check does not verify the guide's specimen identifications or establish species occurrence by itself. All 45 NFRDI records stay out of the app while the source-level identification review and the guide's CC BY-NC 4.0 publication-scope decision remain pending. No application data or UI changed.
- **Next:** review those two family disagreements against the selected product taxonomy backbone, independently assess source-level species identifications, and confirm the guide's noncommercial scope and attribution treatment. Only then prepare any historical Taal projection separately. Continue the CALABARZON coverage-and-gap review before opening NCR.

## 31. Sampaloc Lake GBIF locality check -- 24 October 2026

- **Queries:** exact `country=PH`, `basisOfRecord=PRESERVED_SPECIMEN` searches for `Sampaloc Lake` and `Lake Sampaloc` returned two and four rows respectively. The exact request URLs, response snapshots, and hashes are retained in `calabarzon-sampaloc-lake-gbif-locality-review-20261024.json`.
- **Results:** the six returned rows are two cyanobacteria from the Smithsonian NMNH Extant Biology dataset (CC0) and four preserved records of the copepod `Arctodiaptomus dorsalis` from a dataset reporting CC BY 4.0. No fish record was returned. The copepod records share coordinates and carry continent-derived-from-coordinates and institution-match-none flags; no coordinate is projected.
- **Decision and limit:** this is a bounded exact-text preserved-specimen check, not a fish-filtered or exhaustive lake search. It provides no fish assertion and does not show that fish are absent. The waterbody still has no validated boundary or complete species baseline.
- **Next:** continue the L1 freshwater/coastal source sweep, including independent locality coverage and the held regional survey tables. Keep broader province/region completion claims pending until coverage status, data rights, taxonomy, and source-quality review are resolved.
## 32. San Pablo Seven Lakes GBIF name-variant check -- 24 October 2026

- **Queries:** six public GBIF requests checked `Lake Bunot`, `Buot Lake`, `Lake Mohicap`, `Lake Yambo`, `Lake Calibato`, and `Lake Palakpakin` with `country=PH` and `limit=100`. URLs, result counts, ignored raw snapshots, and SHA-256 values are in `data/research/philippines/calabarzon-san-pablo-lake-name-variant-review-20261024.json`.
- **Results:** 66 returned rows comprise 12 preserved copepod records, 51 eBird bird-observation rows, and three fern herbarium records. There were no fish records. The copepod rows are CC BY 4.0, bird rows CC BY 4.0, and herbarium rows CC BY-NC 4.0; their distinct dataset metadata is recorded individually.
- **Decision:** no fish assertions, coordinates, geometry, or public projection were added. No fish in these bounded locality results is not evidence of fish absence; names omitted from records, additional variants, coordinate-only records, and other sources were not searched.
- **Next:** continue CALABARZON coverage with source-reviewed fish data and independently validate locality, taxonomy, rights, and waterbody scope. Keep the five lake baselines and regional completion status open.

Verification for this research-only batch: `npm run test:species:pipeline`, `npm run species:status`, and `git diff --check`.

## 33. Pansipit River alternative-source review -- 24 October 2026

- **Accessible official alternative:** the 52-page [DA-NFRDI FY2019 Annual Report](https://nfrdi.da.gov.ph/wp-content/uploads/2025/11/FY-2019-NFRDI-Annual-Report.pdf) was retrieved over ordinary HTTPS and reviewed at printed page 16. It reports a January–September 2019 Pansipit River landed-catch assessment with 51 fisherfolk respondents, 140 gears and 17 gear types, 6,886.98 kg total landed production, and 42 organism species caught: 36 finfishes, two molluscs and four crustaceans. It does not supply a complete species list or per-species table in the reviewed section.
- **Rights and boundary:** the report's printed page 2 states both “Copyright 2022. All rights reserved” and “This is an open access article distributed under the CC BY-NC license.” The license version and applicable scope are not specified, so species-derived rows remain held. This historical landed-catch summary is not a river-wide census or a current-presence claim.
- **Other Pansipit leads:** the official NFRDI FY2023 repository download resolves to a login page; only its search-indexed summary is available. The official UPLB record for Corpuz et al. (2016) reports historical richness facts for three Lake Taal rivers, including Pansipit, but direct official JESAM article/PDF requests returned HTTP 403 and item-specific reuse terms remain unverified. These 2016, 2019 and 2023 totals use different designs and cannot be read as a trend.
- **Implementation:** `calabarzon-pansipit-alternative-source-review-20261024.json` records the review, and the NFRDI PDF remains in ignored raw storage with a SHA-256 digest. A regression test enforces the organism/finfish distinction, rights hold and zero app admissions. No species projection or UI changed.
- **Next:** continue with the next CALABARZON lead whose original species table and reuse terms can be checked through ordinary public access; preserve explicit access and rights gaps and finish the regional coverage-and-gap report before moving to NCR.

## 34. Manila Bay trawl station and rights review -- 24 October 2026

- **Access and station scope:** the official [NFRDI repository item](https://repository.nfrdi.da.gov.ph/items/5845cc49-44c8-4c18-8d4d-d458ceaa0aad) lists one 16-page PDF for the March 2014–October 2015 trawl survey. The paper reports 16 pre-established dragging stations and Figure 3.1 maps their visual layout. It provides no individual station-coordinate table or supplementary station dataset. No exact station geometry can be established from the map alone.
- **Table semantics:** Table 3.2 is a province-grouped top-50 fish-and-invertebrate summary; its symbols describe the percentage of hauls in which a taxon was common, not individual catch counts. The Cavite summary distinguishes 24 fish taxa from 100 total mixed taxa. Neither is a complete/current Cavite species checklist or municipal-water result.
- **Rights:** the 2017 item and PDF do not show an item-specific license. The current [TPJF policy](https://www.nfrdi.da.gov.ph/tpjf/Policy.php) says new submissions use CC BY-NC 4.0, authors retain copyright, and previously published tables/figures require permission. Its current submission terms do not prove the 2017 article's license; table extraction stays held pending item-specific confirmation.
- **Handoff:** `calabarzon-manila-bay-station-data-review-20261024.json` contains a draft request to NFRDI asking for reuse terms and any station-coordinate/trawl-track dataset. The draft has not been sent. No species, station coordinate, geometry or UI change was admitted.
- **Next:** send the prepared rights/data inquiry only when Joseph chooses to do so; meanwhile, continue with independently reusable species sources and include Manila Bay's unresolved table and station-data gaps in the CALABARZON coverage report.

## 35. Balayan/Calatagan poster access follow-up -- 24 October 2026

- **Access and mismatch:** the official [NFRDI repository record](https://repository.nfrdi.da.gov.ph/items/43c33cc3-7826-4068-8e12-ede31d616d37) exposes a 51.49-MB PNG poster. It was retrieved by an ordinary unauthenticated HTTPS download and visually reviewed. The item title claims ten taxa while its abstract lists nine; the poster has ten labels, including *Sardinella lemuru*, which the abstract omits.
- **Interpretation:** the poster footer explicitly says the arrangement is not based on ranking. The title therefore does not establish abundance order. Maximum-length illustrations are not counts or abundance measures. The 2018-2022 study period is historical and does not establish current presence.
- **Rights and scope:** no item-specific reuse terms were found. Keep the image and poster-derived species rows out of the public app pending rights, independent identity and locality-scope review. No common/local names or length values were transcribed, and no bay geometry or species assertion was admitted.
- **Implementation:** `data/research/philippines/calabarzon-balayan-calatagan-poster-review-20261024.json` records the comparison and hash; the original image remains in ignored local storage. The registry status and regression test now reflect the completed review without changing the app projection.
- **Next:** identify open or explicitly reusable fish records for Batangas coastal and inland waters, while seeking item-specific permission for any later use of this poster's derived data. Complete CALABARZON's coverage-and-gap review before moving on to NCR.
## 36. Balayan/Calatagan GBIF exact-locality fish check -- 24 October 2026

- **Queries:** the public GBIF Occurrence API was queried with `country=PH`, `classKey=204` (GBIF class *Actinopterygii*), and exact locality text for `Balayan Bay`, `Calatagan Bay`, `Balayan`, and `Calatagan`. All four returned zero occurrence records. URLs and SHA-256-pinned ignored JSON responses are recorded in `data/research/philippines/calabarzon-balayan-gbif-fish-locality-review-20261024.json`.
- **Decision:** retain the zeroes as a bounded coverage gap only. Exact text misses spelling variants and records lacking locality text; Actinopterygii does not cover every fish class. A zero query is not evidence that fish are absent.
- **Reuse and admission:** no occurrence rows or dataset licenses were returned to review. No fish assertion, coordinate, geometry or public projection was added. Future returned rows need record-level taxonomy, quality, date, dataset-license and site-scope review.
- **Next:** look for open and source-localized fish records or surveys for Batangas's remaining marine, estuarine and inland waters. Continue CALABARZON coverage and gap accounting before advancing to NCR.

## 37. Anilao Fish Port bycatch study source review -- 24 October 2026

- **Study lead:** the official [Ateneo institutional record](https://archium.ateneo.edu/biology-faculty-pubs/57/) describes Banzon et al.'s 2019 Marine Policy study at Anilao Fish Port. It reports 35 fish species from 15 families, including seven bycatch species, after field visits from July 2016 through February 2017.
- **Access and rights:** the institutional record links to the publisher full text, but the link returned HTTP 403. The record identifies Elsevier copyright and no item-specific open license was found. No species table was acquired or transcribed.
- **Scope:** this is historical landing-site evidence at a port serving municipal fisheries in Balayan Bay. It does not identify exact capture locations for each landed fish, establish whole-bay presence, or describe current abundance. Keep species rows, coordinates and public admission at zero.
- **Implementation:** `data/research/philippines/calabarzon-anilao-fish-port-source-review-20261024.json` records the bibliographic lead and access, rights and locality limits. No app-facing species data or UI changed.
- **Next:** seek authorized full-text/reuse terms or find independently reusable, location-matched fish data. Continue CALABARZON's coverage/gap review before advancing to NCR.

## 38. GBIF taxonomy-key correction and NCR discovery checkpoint -- 24 October 2026

- **Correction:** the GBIF taxon key `204` used by several earlier exact-locality checks for *Actinopterygii* was deleted in 2022. Their zero results are invalid for coverage conclusions. The replacement uses the CoL XR checklist and its current *Actinopterygii* key `8VR36`; this is ray-finned fishes only and excludes sharks and rays.
- **CALABARZON effect:** twelve corrected exact-text searches returned 21 occurrence rows under 16 accepted names. Every row remains held for record-level locality, taxonomy, date, quality and license review. No zero result is treated as absence and no assertion was admitted from this sweep.
- **NCR discovery:** 17 administrative units are listed, but the waterbody denominator is incomplete and geometry is unverified. Exact-text searches found 282 Manila Bay and 42 Laguna de Bay records, which remain shared-waterbody candidates. The broad Metro Manila query returned 569 records from four datasets; 456 market-context and seven waterbody-text hits are string heuristics only. The entire batch remains held pending row-level review.
- **Artifacts:** the deleted-key invalidation and corrected query evidence are in `gbif-actinopterygii-retired-key-correction-20261024.json`; source and locality notes are in `ncr-species-coverage-review-20261024.json`. The corrupted legacy review files remain preserved and explicitly superseded.

## 39. Pasig River *Arius manillensis* historical event -- 24 October 2026

- **Source review:** Lirio et al. report three *Arius manillensis* individuals collected from Pasig River on 29 October 2025. The article is open access under CC BY 4.0 and acknowledges taxonomic-identification assistance from the UPLB Museum of Natural History. GBIF CoL XR returns an exact scientific-name match; that nomenclatural match does not independently verify the sampled fish.
- **Projection:** `data/research/philippines/pasig-river-arius-manillensis-source-review.json` records one dated collection event; `src/data/pasig-river-species-evidence.json` is generated by `npm run species:build:pasig` and checked by `npm run species:check:pasig`. The bilingual Species section links the article, name record and license.
- **Location and claims:** the paper publishes a collection coordinate, but Bangwit deliberately withholds it from the app and map. The entry says this is one historical event and not a current population estimate, full NCR inventory, catchability result, food-safety advice or permission to fish. NCR remains incomplete and release approval remains separate.
- **Next:** first-pass accession-aware triage of all 569 Metro Manila records is complete. Continue NCR's official habitat/source denominator, waterbody identities and administrative crosswalk; keep the 567 held records out of projections and Manila Bay shared. Prepare L3 Central Luzon discovery inputs only as parallel discovery work, without implying that NCR is baseline-reviewed.

## 40. NCR accession-aware triage and shared Manila Bay specimens -- 24 October 2026

- **Batch review:** the 569 filtered GBIF rows were re-fetched as two pages and grouped across four dataset keys. The 456 market-text and seven waterbody-text hits were treated as screening signals and examined against the occurrence fields, catalog context, dataset metadata, date, basis of record, taxonomy and rights.
- **Prepared shared-bay evidence:** two preserved USNM records explicitly report Manila Bay, have dated catalog records, and are CC0 1.0: *Rastrelliger kanagurta* (USNM 199725, 24 September 1963) and *Encrasicholina heteroloba* (USNM 445709, 12 May 1966). Both have independent current-name checks in Eschmeyer's Catalog of Fishes. The projection shows original locality text and dates, no coordinates; Manila Bay remains shared across NCR, Central Luzon and CALABARZON.
- **Held records:** of the other five waterbody-text rows, two have explicit market context, one is a machine observation with unresolved specimen relation, and two are not identified to species rank. The remaining 562 broad administrative rows have no named target waterbody in their source locality/context. All 567 stay out of species assertions.
- **Data and UI:** the review ledger is `ncr-manila-bay-gbif-record-triage-20261024.json`; the bilingual Species section is generated by `npm run species:build:manila-bay` and checked by `npm run species:check:manila-bay`. This prepares shared-water historical evidence only; it does not complete or release NCR.
- **Next:** continue the official NCR waterbody denominator and river/estero/wetland/lake coverage, and verify the administrative crosswalk when authoritative geometry and source files are accessible. Keep the baseline incomplete. L3 Central Luzon can proceed as a separate discovery manifest, not as a reason to mark NCR complete.

## 41. L3 Central Luzon discovery and Bataan river survey table -- 24 October 2026

- **Administrative and habitat scope:** the pinned PSA registry lists the seven Region III provinces. The official Regional Development Plan is indexed as reporting 168 wetland-class waterbodies (153 major/minor rivers, 11 lakes, three reservoirs and one swamp), but its PDF returned HTTP 403. These are source-reported counts only, not a reconciled named denominator. EMB Region III separately reports 27 routinely monitored waterbodies in its Manila Bay Area; that monitoring subset is not a fish inventory or regional total.
- **Cross-boundary and inland leads:** official discovery sources identify the Pampanga River Basin as crossing administrative boundaries, reservoirs at Angat and Pantabangan, Candaba and Sasmuan wetlands, and watershed-monitoring leads at Carranglan, Baler, Dibut and Abucay/Samal. Initial coastal leads are Manila Bay (shared with NCR and CALABARZON), Subic Bay, Dingalan Bay, Palauig Bay and the Bataan/Zambales/Aurora coasts. No geometry, complete waterbody list or coastal boundary is validated.
- **Primary fish source:** the CC BY 4.0 AACL Bioflux 2025 article reports 2021-12 through 2022-11 sampling across upstream, midstream and downstream sections of Almacen, Bagac and Talisay rivers. Table 2 was transcribed from the retrieved publisher PDF, including its shaded presence/absence matrix. The 52 rows reconcile to the paper's reported river counts of 42, 29 and 28. They are source taxon entries, not 52 independently approved species.
- **Disposition:** source spellings, genus-only entries, the reported hybrid, and source-derived FishBase fields remain separately labeled. Taxonomy is pending; no species assertion, coordinate, geometry or salinity class was added to the app. The raw publisher PDF is in ignored research storage with its SHA-256 recorded in `central-luzon-bataan-river-table-review-20261024.json`.
- **Artifacts:** `central-luzon-discovery-checkpoint-20261024.json` accounts for the seven provinces, the reported-but-unreconciled regional counts, freshwater/brackish/coastal leads and open gaps. `central-luzon-bataan-river-table-review-20261024.json` retains all 52 table rows and river presence counts. The checkpoint is discovery-only; Central Luzon remains incomplete.
- **Next:** run a complete nomenclature/family pass for the 42 source-printed binomials, explicitly preserve any unresolved cases, and retain the ten genus-only/hybrid rows. Then prepare a source-scoped historical evidence ledger without equating taxonomic authority with specimen identification. Continue to reconcile the reported 168 waterbody-class units and add coastal, estuarine, lake and other inland source leads.

## 42. Bataan table taxonomy match proposals -- 24 October 2026

- **Batch:** the 52 source rows were passed through GBIF's species-match service with the explicit Catalogue of Life eXtended Release checklist. Forty-two source-printed binomials returned responses from one captured, stable matching-index build. The ten genus-only or hybrid rows were not sent as ordinary species names.
- **Result:** the service classified 32 as exact species-name matches, five with source-family conflicts, four as synonym matches and one as a name/status review. These categories describe match-service output, not independent taxon decisions.
- **Exceptions:** the conflicts include the printed `Anguilidae` family spelling, a `Platycephalus indicus` family mismatch, and the source's `Hypopthalmichthys nobilis` spelling. Synonym proposals include `Apogon hyalosoma`, `Carangoides hedlandensis`, `Leiognathus equulus` and `Therapon jarbua`. Preserve each printed form pending source-by-source fish-catalog review.
- **Disposition and artifacts:** `central-luzon-bataan-taxonomy-proposals-20261024.json` records the raw-query checksums, response checksums, matching-index build and pending outcomes; raw service responses remain local and ignored. No taxon is accepted, no regional assertion is prepared, and none of the source's origin, habitat, position or reproduction fields are admitted.
- **Next:** perform the independent Catalog of Fishes pass recorded in Step 43-44. Preserve misspellings and family conflicts in the source table; keep rank-only and hybrid rows held. Central Luzon remains incomplete.

## 43. Bataan selected fish-catalog discrepancy review -- 24 October 2026

- **Review method:** 12 high-risk rows were first checked against Eschmeyer's Catalog of Fishes records: spelling/synonym candidates, family disagreements, a possible identification-range caveat, and an ambiguous flatfish binomial. Public catalog record pages were accessed through indexed results; no catalog database or raw pages were downloaded.
- **Resolved nomenclature proposals:** the catalog supports *Anguilla marmorata* in Anguillidae (the source prints `Anguilidae`), *Platycephalus indicus* in Platycephalidae (the source prints Gobiidae), Poeciliidae for three fish whose source family is `Poecilidae`, and current combinations/spellings *Atropus hedlandensis*, *Leiognathus equula*, *Terapon jarbua*, and *Hypophthalmichthys nobilis*. Source spellings remain untouched and proposals are not specimen re-identifications.
- **Unresolved cautions:** for *Clarias batrachus*, the catalog notes definite native records only from Java river drainages, with records elsewhere introduced; that does not invalidate the paper's Bataan report, but requires identity/provenance review. `Cynoglossus bilineatus` remains ambiguous without authorship or voucher information. The catalog links *Apogon tickelli* to *Yarica hyalosoma*, supporting a current-combination proposal for the paper's *Apogon hyalosoma*; the direct accepted-species record was not captured. *Gazza minuta* is supported here by catalog synonym records, not a retained direct accepted-species page. These remain explicit nomenclatural follow-ups.
- **Completed pass and disposition:** the remaining 30 binomial rows were checked against public current-name/family records, bringing the nomenclature/family pass to all 42 source-printed binomials. *Glossogobius aureus* retains a qualified senior-synonym note; *Monopterus albus* carries the Catalog's ICZN current-usage caveat. The review is nomenclatural only. All 52 source rows remain pending overall specimen identity; the ten genus-only/hybrid rows remain held; zero taxa are accepted, and zero app assertions are admitted.
- **Artifacts:** `central-luzon-bataan-cof-name-review-20261024.json` records the 42 reviewed binomials, source-verbatim names/families, record links, caveats and held decisions. The source table's review pointer and regression tests now reflect the completed nomenclature pass without changing the transcribed table.

## 44. Bataan source-scoped river evidence handoff -- 24 October 2026

- **Input:** the CC BY 4.0 paper's Table 2 reports presence/absence for 52 taxon rows across upstream, midstream and downstream sampling sections of Almacen, Bagac and Talisay rivers in 2021-12 through 2022-11. Its matrix reconciles to the authors' counts of 42, 29 and 28 rows per river.
- **Evidence boundary:** the table is a historical, author-reported survey source. The Catalog of Fishes pass confirms nomenclature candidates only; it does not identify the collected specimens. The table has no per-row vouchers or collection coordinates in the reviewed transcription. Do not map table rows to river mouths, infer reach-level geometry, abundance, catchability, salinity, or current presence. The source's origin, habitat-position and reproduction codes were attributed to FishBase and remain excluded from app-facing claims pending field-specific review.
- **Next action:** build a research-only ledger that links each source row to its three-river presence cells and survey scope, while separating named-current-taxonomy proposal, identity confidence, locality precision, environmental class and rights. Keep all entries out of public app assertions until identity/locality evidence meets the projection contract. Continue Central Luzon denominator and habitat discovery for coast, estuary, rivers, lakes, wetlands and reservoirs; Central Luzon remains incomplete.

## 45. Bataan independent-study and consistency review -- 24 October 2026

- **Second study:** the 2024 Biodiversity Journal survey sampled Talisay and Bagac from December 2020 through November 2021 using nine longitudinal stations per river, 70 m sections, backpack electrofishing and seine/cast nets. The paper says captured fish were identified to the lowest possible taxon and some were retained or preserved for more documentation. It gives river-mouth coordinates, not row-level capture coordinates or a station-to-reach crosswalk.
- **Internal conflicts:** the article abstract reports 28 Talisay and 37 Bagac species; the results text reports 30 and 38. The results say 13 shared species, followed by 15 taxon mentions including an abbreviated name. Its Table 1 presents 52 source rows while the narrative reports 50 species. No total or shared count is adopted.
- **Cross-study comparison:** after two name-string normalizations only, 26 named-binomial rows overlap the 2025 three-river table; 23 have the same Talisay/Bagac presence cells and three disagree: *Butis butis*, *Mayaheros urophthalmus* and *Scatophagus argus*. This is a table comparison, not evidence that one study is correct. The 2024 author team includes six of the 2025 paper's six authors, so it is not independent taxonomic corroboration.
- **Rights and disposition:** no item-specific reuse license or permission was verified in the retrieved 2024 PDF. The table is not copied into a new dataset. All Bataan rows remain held; zero public assertions and zero app projections. Details are in `central-luzon-bataan-cross-study-conflict-review-20261024.json`.
- **Next:** continue the Central Luzon waterbody denominator and source-era river geography review across all seven provinces, including freshwater, brackish, wetland and coastal strata. Do not infer reach geometry from river-mouth coordinates or mark the region complete.

## 46. Central Luzon national catchment geodata review -- 24 October 2026

- **Source and license:** the University of Glasgow's 2023 national geodatabase provides catchment polygons, stream-network files and attributes for 128 Philippine catchments under CC BY 4.0. The catchment polygons and attribute table were acquired, hashed and inspected; the separate 149 MB stream-network archive was not acquired. The retrieved polygon projection is WGS 84 / Pseudo-Mercator (EPSG:3857); do not assume every archive component shares it.
- **Central Luzon match:** the reviewed roster names Pampanga (7,842.332 km2) and Angat (910.21973 km2). It has no separately named Bataan river catchment, Pantabangan, or Candaba entry. This dataset coverage gap is not evidence those waters are absent.
- **Extent conflict:** PAGASA describes about 10,540 km2 for the Pampanga River Basin including allied Guagua, while the Glasgow Pampanga polygon attribute is 7,842.332 km2. Definitions and extents were not reconciled, so these figures are not interchangeable.
- **Use decision:** catchment shapes can support attributed exploratory watershed context only. They do not show fish collection sites, individual river reaches, every waterbody, salinity classes, municipal-water boundaries or legal limits. No geometry was added to the app; no fish assertion or projection was created. Full evidence and input hashes are in `central-luzon-national-catchment-geodata-review-20261024.json`.
- **Next:** review Pantabangan's 2026 COI-barcode article beyond its abstract and compare with older independent reservoir records. Continue the named Central Luzon inventory across rivers, lakes, wetlands, reservoirs, estuaries and coasts; Region III remains incomplete.

## 47. Pantabangan freshwater source reconciliation -- 24 October 2026

- **2026 DNA-barcode article:** the accessible abstract reports 40 COI sequences and nine species, but exposes only five names. The full table, all nine identities, accessions, voucher mapping, sampling date/site details and reuse terms remain unverified. Keep all abstract names held.
- **Historical surveys:** the official NAST 2006 abstract covers five Nueva Ecija waters (Talavera, Pampanga at Palayan, Tabuating, Paitan and Pantabangan) and reports richness totals without a species-by-waterbody table. The 2009 Silliman paper covers those same five sites plus Pampanga river areas and Candaba Swamp. Its authors overlap substantially with the NAST study and the Nueva Ecija richness figures differ; treat them as related historical sources, not independent estimates. Silliman's policy confirms permission requirements for reuse of multiple tables.
- **Largemouth-bass sources:** a 2024 community/catch study reports *Micropterus salmoides* in Pantabangan Lake, but its blackchin-tilapia boat count conflicts between prose and table. Its publisher page lists CC BY-NC 4.0 in article details and CC BY 4.0 in copyright text. A separate 2024 stomach-content abstract reports grouped fish prey and minimal plant material but no prey species. Neither source supports a validated local diet list or app assertion.
- **Clarias note:** a 2015 barcode review mentions five Pantabangan *Clarias batrachus* sequences as unpublished Yambot samples; no Pantabangan sequence accession/voucher crosswalk was found, so these are not five separately verified records.
- **Disposition:** no species assertion, diet field, geometry or public checklist change. Evidence and limitations are in `central-luzon-pantabangan-source-reconciliation-20261024.json`.
- **Next:** review Paitan Lake and Vaca Dam as separate waterbodies, then continue Central Luzon freshwater, wetland, brackish and coastal source discovery. Keep the region incomplete.

## 48. Paitan Lake and Vaca Dam source reconciliation -- 24 October 2026

- **Joint stocking event:** the official CLSU report documents an August 2021 stock-enhancement activity covering Paitan Lake in Cuyapo and Vaca Dam Reservoir in Llanera. It lists 40,000 Nile tilapia, 12,000 mudfish and 42,000 carp for the joint event but does not allocate those totals by waterbody or provide scientific names for the groups. These counts are not wild-occurrence, survival, present-day catch or abundance evidence.
- **Historical Paitan survey:** the official NAST abstract includes Paitan among five Nueva Ecija waters and describes three stations with ten quadrats each. Its aggregate totals combine sites and organism groups; there is no species-by-waterbody table in the accessible abstract, no verified field year and no item-specific reuse grant. The related 2009 Silliman study overlaps in authors and scope; its official PDF endpoint returned 404 and its multiple-table reuse terms require written permission.
- **Conflicting janitor-fish reports:** a 2009 local news article first quotes the Cuyapo mayor saying a DENR team found none, then attributes to DENR a statement that *Pterygoplichthys pardalis* was found in Paitan. It gives no survey method, voucher or date. The internal conflict remains unresolved and the report is not used as species evidence.
- **GBIF correction:** six locally saved exact-locality zero responses used retired GBIF fish key `204`. The GBIF taxon record marks it deleted in 2022; those zeroes are invalid for coverage or absence conclusions. This batch did not run a corrected Paitan/Vaca query under CoL XR key `8VR36`.
- **Disposition and artifacts:** `central-luzon-paitan-vaca-source-review-20261024.json` records source scope, rights, the joint event's allocation limits, historical leads and the invalidated GBIF query. No species or diet assertion, geometry, public checklist or app projection was added. `central-luzon-discovery-checkpoint-20261024.json` now lists Paitan and Vaca separately. Central Luzon remains incomplete.
- **Next:** continue named freshwater and wetland review beyond Paitan/Vaca, prioritize Candaba, the Pampanga basin and Angat alongside unreviewed provincial leads, and use corrected CoL XR filters after the API window is stable. Keep the coastal and brackish provinces in the same coverage pass.

## 49. Candaba wetland historical inventory reconciliation -- 24 October 2026

- **Sources compared:** Mallari, Bagunu and Salas (2020) report 14 fish taxon strings from two Candaba barangays; Garcia (2010) reports 21 fish species caught in 2007-2008, with length-weight relationships for 18; Habito's UPLB thesis abstract reports eight freshwater fish species from a 1987 survey. A related 2009 Silliman study has mixed Candaba, river and Nueva Ecija scope and no accessible Candaba table in this review.
- **Quality and rights:** the 2020 source has an internal 14-versus-15 arithmetic conflict, malformed or concatenated name strings, and an unverified `Hito` mapping. The thesis full text is not available in its repository record; the 2010 publisher abstract does not expose species identities. No item-specific reuse grant for the 2010 or thesis text was verified; the 2020 publisher license needs direct confirmation before reuse.
- **Disposition:** source counts are not comparable and are not summed. Preserve the 14 2020 strings verbatim as held candidates; zero independently verified fish rows, zero species assertions, zero diet claims and zero app projections. No waterbody geometry or full wetland extent was validated.
- **Artifacts:** `central-luzon-candaba-inventory-review-20261024.json` and its regression test record access, source scope, identity and reuse limits. The Central Luzon discovery checkpoint remains incomplete.
- **Next:** review Angat reservoir/river and Pampanga River reaches including the Minalin Channel fish-diversity study; then continue Sasmuan wetlands and freshwater/brackish/coastal leads across the remaining provinces.

## 50. Minalin Channel seasonal catch table -- 24 October 2026

- **Source and reuse:** Baysa et al. (2019) publish a Table 1 fish catch-composition matrix under CC BY 4.0. The study uses three Minalin Channel stations, byakus/hoop nets from a motorized banca, and sampling every 15 days during February-April and July-September 2018.
- **Transcription:** the 24 source rows reconcile to 16 rows labeled freshwater and eight labeled marine; the table gives 17 dry-season and 19 wet-season presences. The source reports salinity of 11.57 ppt in the dry season and 0 ppt in the wet season. These results describe the study gear and its catches, not the whole fish community.
- **Quality and use:** source name spellings include `Ctenophangyrodon idella`, `Cyprinos carpio` and a table/abstract spelling difference for `Elops`. Five rows are genus-only. The article notes that its gear-based diversity indices cannot represent the entire waterbody community. No voucher crosswalk, site geometry or current occurrence was verified.
- **Disposition:** retain the attributed source-table transcription as historical, channel-specific research evidence. Zero accepted taxa, public assertions, diet claims, app projections or coordinates. Do not merge this evidence with Candaba wetland or basin-wide records.
- **Artifacts:** `central-luzon-minalin-channel-fish-table-review-20261024.json` and the regression test preserve rows and seasonal counts. Central Luzon remains incomplete.
- **Next:** review Angat reservoir and river evidence; continue beyond the single Minalin channel to other Pampanga Basin reaches, Sasmuan wetlands and coastal/brackish Central Luzon waters.

## 51. Angat reservoir and river-source triage -- 24 October 2026

- **Reservoir:** Guerrero's 2022 CC BY 4.0 review summarizes historical Angat Reservoir Nile tilapia stocking/catch figures from Balite (1993), including a reported catch of 781,783 kg and total fisherfolk catch change from 57,363 kg in 1983 to 81,172 kg in 1987. These are historical fishery statistics, not a full reservoir fish roster or present-day data. The catalog lists Conlu's 1981, 147-page `Fish production studies of Angat reservoir`, but the report itself was not accessed.
- **Norzagaray River:** Portillo et al. (2017) report a five-station *Glossogobius giuris* morphometrics collection in Barangay Matictic, using backpack electrofishing and nets and BFAR Region III identification/authentication. The accessible source does not provide collection dates or station coordinates; this is one historical study taxon, not a river-wide inventory or reservoir record.
- **Bustos reach:** De Regla et al. (2015) describe an approximately 8 km Angat River Network reach across seven Bustos barangays and give seven author-reported aquatic taxon strings. The paper's abstract/table lists conflict over *Trichogaster lalius* and *Misgurnus* spelling. Its metal tables contain 28 negative lead readings and 32 negative cadmium readings, making its food-safety conclusion unsuitable for use. No item-level reuse permission or voucher-based identities were verified.
- **Disposition:** reservoir, Norzagaray River and Bustos evidence remain separate. Zero taxa accepted, zero public assertions/diet/safety claims/app projections, and no geometry or coordinates added. See `central-luzon-angat-fish-source-triage-20261024.json` and the checkpoint. Continue with Sasmuan coastal wetlands and additional Pampanga River Basin sources; Central Luzon remains incomplete.

## 52. Sasmuan Ramsar and Batang Dos community-resource review -- 24 October 2026

- **Site scope:** the Ramsar Information Sheet reports 3,667.313 ha official area and 3,664.169 ha GIS-calculated area and names five coastal barangays. It identifies mudflats, mangroves, Pasac River estuary/river, Pampanga River inland delta and aquaculture ponds. These connected habitat components are not one fish-study polygon. No GIS boundary was downloaded or added, and a Ramsar site boundary is not a municipal-water boundary.
- **Fishery evidence:** the Ramsar-attached 2017 Batang Dos PCRA records 26 local-resource labels in its “present” column and two in its “past” column, but combines fishes, crustaceans and molluscs, despite the prompt saying “top ten.” Its summary says “Fish: to be determined.” Retain the labels only as historical community-reported terms for Batang Dos; do not resolve them to fish taxa or extend them over the Ramsar site.
- **Other attachments:** the Ramsar “taxonomic list” attachment reviewed here is a waterbird census for 2010-2020, not a fish list. The 2015 Sasmuan community resource assessment discusses fisheries and recommends aquatic-fauna inventory/profiling, but does not supply a validated fish checklist. No item-specific open reuse license for those attached assessment tables was found.
- **Disposition:** zero scientific fish taxa verified, zero current-presence claims, zero app assertions/diet/safety claims/projections and no geometry. Next review the separate 2020 Pampanga estuary dry-season fish-community study and verify station-to-site relationship, access and reuse before comparing it with Batang Dos local terms. See `central-luzon-sasmuan-wetlands-source-review-20261024.json`.

## 53. Pampanga estuary historical fish-community study review -- 24 October 2026

- **Study scope:** Abrogueña et al. report nine stations split into lower, middle and upper estuary zones, sampled in April 2010 with otter trawls during four neap/spring tide conditions. Thirty-two of 36 planned trawls were completed. The paper reports 330 fish, 20 families and 27 taxa. The study-area anchor is 14°45′55″N 120°39′17″E; this is not a station coordinate or boundary.
- **Table and identity limits:** Table 1 has 27 rows, including one family-only Ophichthyidae identification and two genus-only entries. Source spellings are preserved; there has been no independent nomenclatural, voucher or image review. The study is historical, dry-season, gear-specific evidence, not a current or complete estuary checklist.
- **Site relationship and rights:** the article does not give station coordinates or demonstrate an overlap with the Sasmuan Pampanga Coastal Wetlands Ramsar polygon or the Batang Dos assessment reach. University of Algarve repository metadata claims CC BY 4.0, but the article text says all rights reserved and the repository PDF requires authentication; public reuse rights remain unresolved. No paper text, figure, species assertion, geometry or app projection was added.
- **Artifacts and next step:** `central-luzon-pampanga-estuary-fish-study-review-20261024.json` records the review and its limitations. The 2009 Nueva Ecija/Pampanga freshwater source has since received a limited GBIF and Catalog of Fishes name review; continue independent name/family checks, obtain site-specific evidence, and discover further Central Luzon waters. Central Luzon and the Philippines-wide expansion remain incomplete.

## 54. Silliman 2009 source-name crosswalk -- 24 October 2026

- **Method:** queried the GBIF Species API for the 17 unique binomials exposed in selected indexed excerpts, using Animalia and species rank, and pinned the GBIF matching-index metadata/build. The API returned 15 accepted usages and two synonym usages; the source spellings and source-reported groups remain intact.
- **Synonym proposals:** `Trichogaster pectoralis` maps to `Trichopodus pectoralis`; the source's `Hypopthalmichthys molitrix` maps to an accepted `Hypophthalmichthys molitrix` usage. An independent Catalog of Fishes check supports the first nomenclatural change, but the second has a family conflict (GBIF says Cyprinidae; Catalog says Xenocyprididae). Preserve the original spelling and hold family pending review.
- **Limits:** match confidence and taxonomic acceptance do not verify the collected specimen, the paper's introduced/native category, current presence or any particular waterbody. The two lists aggregate across study areas. Fifteen names still need independent fish-catalog review; no site-level rows, app assertions or projections were added. See `central-luzon-silliman-2009-gbif-taxonomy-proposals-20261024.json` and `central-luzon-silliman-2009-catalog-of-fishes-followup-20261024.json`.
- **Next:** independently reviewed all 17 names, with one family conflict held; proceed to site-specific sources and locality/rights review across Central Luzon provinces and freshwater, wetland, brackish and coastal habitats. Do not mark Central Luzon complete.

## 55. Silliman 2009 independent fish-taxonomy review -- 24 October 2026

- **Pass completed:** all 17 source-era name strings were cross-checked against the GBIF Backbone and the California Academy of Sciences' Eschmeyer's Catalog of Fishes. The Catalog supports the `Trichogaster pectoralis` → `Trichopodus pectoralis` name proposal. The printed `Hypopthalmichthys molitrix` remains verbatim; the accepted-name candidate is *Hypophthalmichthys molitrix*.
- **Conflict held:** GBIF places that candidate in Cyprinidae, while the Catalog places it in Xenocyprididae. No family is selected for app use pending resolution. The Catalog's broad Philippine introduction note for *Trichopodus pectoralis* does not assign it to a Silliman study waterbody.
- **Evidence boundary:** taxonomy review confirms nomenclature candidates, not the specimens in this historical paper. All Silliman name groups remain aggregate, no site-specific presence is inferred, and no public checklist or app projection was added. No full tables, raw API response or article text were redistributed. See `central-luzon-silliman-2009-catalog-of-fishes-followup-20261024.json`.
- **Next:** continue source discovery for Aurora, Bulacan, Tarlac and Zambales, plus additional site-specific evidence in Nueva Ecija and Pampanga. Keep inland, wetland, brackish and coastal sources distinct. Central Luzon remains incomplete.

## 56. North Luzon DNA barcode source and rights triage -- 24 October 2026

- **Publisher-reported scope:** Dimaquibo et al. report 1,513 specimens from 27 sites in Aurora, Cagayan and Zambales, sampled in 2023. The study reports 15 freshwater river sites and 12 marine market/landing sites, with COI and 12S sequence subsets and 323 author-reported taxa. These are study-level counts, not Region III totals or current occurrences.
- **Geographic boundary:** Aurora and Zambales are within Central Luzon; Cagayan belongs to another rollout phase. Do not assign sites using the paper's broad North Luzon label. A market/landing point is not presumed to be the capture location.
- **Reuse decision:** the article states CC BY-NC-ND 4.0. The supplementary Tables S1a-S1c were not acquired or transcribed; adapted table-derived locality/species data is held pending rights-holder clarification. GenBank accession records were not reviewed and require their own record-level locality/terms checks.
- **Disposition:** no specimen rows, coordinates, geometry, species assertions, diet/catch advice or app projection added. See `central-luzon-north-luzon-dna-barcoding-source-review-20261024.json`. Central Luzon remains incomplete.

## 57. North Luzon GenBank locality spot check -- 24 October 2026

- **Method:** retrieved four accession/version records by NCBI EFetch from the article's reported COI and 12S accession intervals. Raw sequence strings were discarded; only record labels, voucher identifiers, collection dates, location qualifiers and citation differences were reviewed.
- **Finding:** PP355131.1, PP461061.1, PP456720.1 and PP697971.1 each expose a specimen voucher and collection date but only `Philippines` as location and no latitude/longitude qualifier. PP355131.1 also lists a different author group and an unpublished citation title, so its relationship to the 2025 paper is held pending crosswalk.
- **Rights and boundary:** NCBI says it places no restrictions on GenBank data use but warns that submitters may claim rights; this is not record-specific permission. Country-level records do not support Aurora, Cagayan, Zambales, river, or coastal-site assignments. The CC BY-NC-ND supplementary tables remain untranscribed pending rights-holder clarification.
- **Next:** continue site-specific primary-source discovery for Central Luzon, prioritizing Bulacan and Tarlac and locality-resolved evidence for Aurora and Zambales. Keep Cagayan in its own rollout phase and keep the national plan incomplete.

## 58. Agno River ARB7 Paniqui station review -- 24 October 2026

- **Sources and rights:** Tenio et al. (2026) report a freshwater fish survey across eight Agno Basin stations. The University of Glasgow article and dataset records identify CC BY 4.0. The article PDF and dataset ZIP were reviewed locally and SHA-256 pinned in central-luzon-agno-paniqui-station-fish-review-20261024.json; no source archive is committed.
- **Geographic scope:** ARB7 is Paniqui, Tarlac (15.6974 N, 120.4977 E). The coordinate is a study-station reference, not an exact capture point or boundary. This record covers only ARB7; other stations belong to Benguet and Pangasinan.
- **Fish evidence:** Article Table 4 marks 10 taxa at ARB7; Table 5 reports abundance 137. The dataset Fish_count.csv independently sums to 10 positive rows and 137 individuals (Wet label 51; Dry label 86). Nine rows have binomial names and one remains genus-only as Barbodes sp.
- **Limits:** The dataset spells Oreochromis mozambicus while the article prints O. mossambicus; Cyprinus carpio carries an apparent author/year typo. Catalog checks are nomenclature-only, not voucher identity verification. The article, repository metadata and file names conflict on which date corresponds to wet/dry, so only dataset season labels are retained. An abstract/Table 5 Shannon range conflict is excluded from use.
- **Disposition:** Preserve this as historical, site-specific, gear-limited evidence. Add zero current-presence claims, public species assertions, app projections, diet advice, legal advice, or safety claims. See central-luzon-agno-paniqui-station-fish-review-20261024.json; Central Luzon and national coverage remain incomplete.
- **Next:** continue locality-resolved Bulacan freshwater records and Aurora/Zambales river evidence, then continue the other province and waterbody gaps without assigning whole-basin scope to one station.

## 59. Aurora Dibut River 2025 source and rights review -- 24 October 2026

- **Study scope:** Mercader et al. report monthly gill-net sampling at three Dibut River stations in Baler from October 2023 through March 2024. Station 1 is the lower freshwater/saltwater meeting reach; Station 2 is mid-river; Station 3 is upstream. The article prints coordinates for all three stations.
- **Source conflicts:** The abstract reports 22 species; results and conclusion report 23; Table 1 lists 22 taxa. The authors used internet/local guides and FishBase/IUCN for names and recommend DNA barcoding. No independent identities are accepted.
- **Reuse and disposition:** DOAJ lists CC BY-NC-SA at journal level, while the publisher says copyright transfers and no article-specific reuse grant was identified. Keep the table held pending clarification. Zero app projections or public species assertions.
- **Artifact:** central-luzon-aurora-dibut-river-source-review-20261024.json records station scope, coordinate source, count conflict, name issues and access/rights limits. Do not call it a complete or current Dibut checklist.

## 60. Zambales Masinloc-Oyon Bay reef-report access review -- 24 October 2026

- **Official lead:** the DENR FASPS record for the 2021 habitat assessment reports 254 fish species in 35 families, with 102 at Taklobo MPA and 63 at Panglit MPA, across the Masinloc-Oyon Bay Protected Landscapes and Seascapes area.
- **Access gate:** preview/download requires login or registration. No login was attempted; the report, taxon tables, methods, coordinates, geometry and reuse terms were not reviewed.
- **Disposition:** keep the counts as landing-page metadata only. No species rows, boundaries or app projections are added. See central-luzon-zambales-masinloc-oyon-bay-report-source-review-20261024.json.

## 61. Bulacan provincial waterbody sources and Angat monitoring lead -- 24 October 2026

- **BFAR profile reviewed:** downloaded the official two-page Bulacan fisheries profile and pinned its SHA-256. It lists 22 communal/inland features, but separates Manila Bay catch groups and province-wide aquaculture from those place names; it does not supply a fish checklist by river or dam. Its production/FishR figures are historical aggregates.
- **EMB monitoring lead:** the indexed Table 17 excerpt in the Region III 2022 environment report identifies three Angat River water-quality stations at Baliwag-Bustos, Pulilan-Plaridel, and the Expressway bridge. The direct PDF returned HTTP 403; full methods and sample dates remain unchecked. Station coordinates are not fish captures, boundaries, or current safe-fishing evidence.
- **Reuse and product limits:** no item-level reuse license was verified for either profile/report. Add zero species rows, current occurrence, food-safety messaging, or app projections. See `central-luzon-bulacan-waterbody-source-review-20261024.json`; retain the existing Angat fish study hold unchanged.
- **Next:** use the BFAR place names to find locality-resolved, independently reviewable fish surveys and rights-cleared datasets for Bulacan rivers, lakes, reservoirs and estuaries. Central Luzon and the national rollout remain incomplete.

## 62. Angat River historical invasive-fish locality source chain -- 24 October 2026

- **Initial source chain:** the official DLSU repository confirms a 2014 eight-site Luzon `Pterygoplichthys` conference proceeding, but its upload is unavailable. The 2025 Lake Naujan article's secondary table labels the Angat River year as 2005 introduction, but it contains no Angat field survey.
- **Evidence limits:** keep that secondary label distinct from the source wording. A separate author-uploaded 2017 preprint reports a visit to Barangay Marungko, author-identifies net-caught samples as `Pterygoplichthys disjunctivus`, and attributes “caught since 2005” to fisher interviews. The visit date and specimen voucher are absent. The preprint is explicitly not necessarily peer reviewed, and public access does not establish reuse rights. Its identity with the 2014 proceeding is unproven.
- **Disposition:** retain one research-only historical locality lead; add zero accepted taxa, current-presence claims, geometry, safety advice, or app projections. Keep Angat municipality separate from the Bustos study reach. See `central-luzon-bulacan-angat-janitor-fish-history-review-20261024.json`.
- **Next:** seek an independently reviewable, rights-cleared Angat specimen record or voucher-verifiable taxonomic evidence; continue the other Bulacan freshwater and Central Luzon habitat gaps.

## 63. Angat-Marungko author-preprint locality review -- 24 October 2026

- **Source:** the full-text ResearchGate record identifies the manuscript as a July 2017 preprint and says Joel Chavez uploaded the author content on 20 March 2019. The hosting page warns that preprints may not have been peer reviewed. The manuscript is distinct in title from the unavailable 2014 DLSU proceeding; identity between the works is not established.
- **Locality evidence:** section 3.4 reports a site visit in Barangay Marungko, Angat River and prints `N14° 57′ 3.7″ E121° 01′ 01.1″` as the study-site coordinate. The authors say specimens at a fisher's hut were net-caught about a month before their visit and identify them as `Pterygoplichthys disjunctivus`. The survey date and specimen voucher/catalog number are not provided.
- **Interview and conflict:** fishers reportedly said catches had occurred there since 2005. The 2025 Lake Naujan article table labels 2005 “year of introduction”; do not silently convert an interview-reported catch start into a verified introduction date, a precise observation date, or current presence.
- **Disposition:** use the manuscript for bounded research review only. It is author-uploaded and publicly readable, but no reuse license is stated; do not reproduce its figures, tables, or text. Keep species admission and public occurrence projection at zero.
- **Next:** seek voucher-backed/current, independently reviewable records and continue locality-specific Bulacan river, lake, reservoir and estuary work. This does not complete Central Luzon.

## 64. Bulacan GBIF janitor-fish locality false-positive screen -- 24 October 2026

- **Bounded API results:** GBIF exact species-key search returned 28 Philippines-wide records, none for the exact `stateProvince=Bulacan` or `locality=Angat` filters. The Bulacan genus query returned one record, GBIF occurrence `6413607957`.
- **Locality conflict:** the hit is a 2019, genus-level iNaturalist observation whose verbatim locality is “Coloong, Potrero, Valenzuela, Metro Manila.” GBIF's GADM fields instead assign Bulacan / Meycauayan City / Longos. The PSA PSGC directory (listing as of 31 July 2025) lists Coloong under Valenzuela City, NCR. Retain both source values and exclude the record from Bulacan attribution unless the coordinate/place conflict is independently resolved.
- **Taxonomy and rights:** community ID remains `Pterygoplichthys` at genus rank; no species is accepted. The record and image are marked CC BY-NC 4.0; no image was copied and no app reuse is approved.
- **Disposition:** this small exact-query screen is not an absence assessment, current-presence claim, full regional inventory, or species checklist. See `central-luzon-bulacan-gbif-pterygoplichthys-locality-screen-20261024.json`.
- **Next:** continue locality-specific Bulacan freshwater source discovery and require independently resolvable locality and taxon-level evidence before considering any checklist row. Central Luzon remains incomplete.

## 65. Bulacan Manila Bay north-shore museum specimens -- 24 October 2026

- **Screen:** the GBIF no-coordinate preserved-specimen query for Bulacan returned 12 records. Three CC0 Smithsonian records share the February 1982 source locality “Taken from a fish trap, Malolos, Bulacan, Philippines (northern shore of Manila Bay).”
- **Taxonomy:** ITIS lists *Oxyurichthys microlepis*, *Drombus ocyurus*, and *Butis koilomatodon* as valid species names. GBIF reports *Prionobutis koilomatodon* as the verbatim/source name for the specimen it accepts under *Butis koilomatodon*. ITIS confirms nomenclature only; it does not re-identify the specimens.
- **Disposition:** prepare three historical text-locality assertions for the Species page. Preserve source locality, record links, museum catalog numbers, individual-count values and GBIF quality flags. Do not project coordinates or the generic GBIF `waterBody=Pacific` value. Exclude one genus-only *Apocryptodon* record and eight records with missing/insufficient locality or other limitations. No current-presence, abundance, legal, safety, diet or bait claims.
- **Verification:** `npm run species:build:bulacan-manila-bay`, `npm run species:check:bulacan-manila-bay`, and the regional research pipeline verify the generated projection and registry references. The tests and production build remain separate from browser/device acceptance.
- **Next:** seek site-resolved Bulacan freshwater surveys or museum records for Angat, Meycauayan and Bocaue. Keep Central Luzon and the national rollout incomplete.

## 66. Direct PSA OpenSTAT verification of Bulacan QIFS categories -- 24 October 2026

- **API path correction:** the prior attempt used an obsolete PXWeb route. The current PSA API guide documents the canonical `PXWeb/api/v1/en/DB/...` pattern; the corrected `DB/2E/FS/0052E4GVIP0.px` endpoint returned HTTP 200 and its live schema.
- **Query and result:** selected PSGC `0301400000` (Bulacan), 2025, all 38 Species dimension codes and Quarters 1–4. The official CSV returned 38 dimension rows, including 34 leaf catch categories. Of those, 23 have values and 11 report `..` (data unavailable), not zero.
- **Cross-check:** the 23 available PSA quarter values, summed at their published two-decimal precision, match the pinned mirror annual values within 0.015 metric ton; the largest difference is 0.0145 metric ton. This is rounding-level agreement, not independent taxonomic or site validation.
- **Reproducibility:** `npm run species:fetch:bulacan-qifs-openstat` fetches and checks the two-request official API query, then saves the CSV to ignored local research storage. SHA-256 is recorded in the QIFS profile. The local raw snapshot is not committed.
- **Disposition:** retain provincial catch-production categories as statistical research context only. They are not named-waterbody occurrences, a taxonomic checklist, current-presence evidence, or catch/legal/safety/diet advice. No app projection is added. Central Luzon and national coverage remain incomplete.
- **Next:** return to site-resolved freshwater evidence discovery for Angat, Meycauayan and Bocaue, prioritizing primary surveys or voucher-backed records; retain the PSA series only as a lead-prioritization context.

## 67. Angat River Network study-name cross-check -- 24 October 2026

- **Names reviewed:** compared six fish-name strings from Table 3 of De Regla et al. (2015) against Eschmeyer's Catalog of Fishes, ITIS and strict GBIF Backbone matches. Four names have a matching accepted-name crosswalk; that confirms nomenclature, not the specimens identified by the paper.
- **Conflict held:** the authorities disagree on `Trichogaster lalius`: GBIF matches it as accepted, ITIS gives `Colisa lalia` as valid, and the current Catalog of Fishes lists it as a synonym of `Trichogaster fasciata`. Keep the printed name unresolved.
- **Identification hold:** the paper's abstract prints `Misgurnus fossils`, while Table 3 prints `Misgurnus fossilis`; no voucher or diagnostic description was found. Do not resolve the sample as a Philippine occurrence from name matching alone. `Macrobrachium rosenbergii` remains excluded from the fish crosswalk as a prawn.
- **Disposition:** the paper has no verified sample date or voucher; the metal-value audit and item-level reuse questions also remain open. No species assertions, safety advice or map geometry are added. See `central-luzon-angat-bustos-2015-taxonomy-followup-20261024.json`.
- **Next:** seek voucher-backed identity material or an independently checkable survey from the Angat River Network reach, while continuing distinct locality-resolved work for Meycauayan and Bocaue. Central Luzon and national coverage remain incomplete.

## 68. DOTr/JICA railway EIS freshwater interview-catch source review -- 24 October 2026

- **Source:** the July 2018 draft-final Environmental Impact Statement for PNR Clark Phase 2 contains a freshwater ecology survey across 15 stations. Field stations were surveyed on 6-7 February 2018; for fish and other aquatic animals, the report says it interviewed local residents about catches and identifies five stations with minor local fishing activity.
- **Waterbody scope:** Table 3.2.12 reports categories for Labangan River at Calumpit (SW-2), Pampanga River at Apalit (SW-4), Malalam River and Masaluso at Minalin (SW-5/6), and Calutcut Creek at San Fernando (SW-8). The station coordinates are environmental-survey points and are not projected as fish capture points or boundaries.
- **Taxonomic limits:** the source's 12 reported categories mix binomials, a family, genera, broad animal groups and local-only labels; no fish voucher, catch date, count or independent identification is supplied. The field date is not treated as the capture date. The report's domestic-consumption note is not food-safety evidence.
- **Rights and disposition:** an official JICA-hosted copy was downloaded and reviewed; its SHA-256 is `b9a9157fcc69cedd2404507c2106f0f565c93f130e8ed23332e7a8e9df8db41c`. Item-specific reuse terms remain unassessed. Preserve this as internal historical interview context: zero public/app assertions, map points, safety claims or table-reuse approval. See `central-luzon-jica-mcrp-freshwater-interview-catches-review-20261024.json`.
- **Next:** seek recent, voucher-backed or independently checkable fish surveys for the same freshwater reaches and the other Central Luzon rivers, reservoirs and lakes; keep the region incomplete.

## 69. JICA station-centered GBIF proximity screen -- 24 October 2026

- **Search:** corrected COL XR Actinopterygii queries around five JICA freshwater environmental stations returned zero rows in each local query window; a broader Pampanga-Bulacan rectangle returned nine rows.
- **Disposition:** none of the nine can be assigned to a named JICA station reach. The local zeroes are not absence evidence, and the rectangle is not a waterbody boundary. No assertion or map point was added. See `central-luzon-jica-gbif-proximity-screen-20261024.json`.

## 70. Pampanga River Apalit 2005 IBI thesis access review -- 24 October 2026

- **Catalog:** the National Library of the Philippines catalogs Sheryll P. Angeles' 2005 UP Diliman thesis (control no. `nlp00316842`, 56 leaves) and says a digital copy is not available. The old IESM PDF URL returned HTTP 404.
- **Secondary summary:** an attributed 2008 UP-study summary reports quarterly sampling at four sites, including Apalit, but supplies no species-by-site table or exact reach coordinates. Aggregate counts are not assigned to Apalit.
- **Disposition:** no species or app rows were added. Seek legitimate library access; keep the thesis and regional baseline incomplete. See `central-luzon-pampanga-apalit-2005-ibi-thesis-access-review-20261024.json`.

## 71. Cabiao Pampanga River fish and diet source review -- 24 October 2026

- **Survey:** Reyes et al. report six author-identified taxa from 55 fish collected at three unnamed Pampanga River sites in Cabiao in May 2019. The article describes stomach-content analysis, but gives no site names, coordinates or specimen vouchers.
- **Diet and limits:** the qualitative gut observations are one local sampling event, not fixed species diets. The snakehead passage reports whole prey but does not identify the prey species, so it does not establish cannibalism.
- **Rights and disposition:** the paper has an article copyright notice; no article-level reuse license was verified. No species/diet claim or app projection was added. See `central-luzon-cabiao-pampanga-river-fish-diet-review-20261024.json`.

## 72. Cabiao Pampanga River fish-name taxonomy cross-check -- 24 October 2026

- **Authority check:** all six names were checked against Eschmeyer's Catalog of Fishes. Its accepted-name entries support the reported fish-name candidates, including the source-internal spellings *Channa striata* and *Hypophthalmichthys molitrix*.
- **Boundary:** name cross-checking is not specimen identification. The two source spelling conflicts remain visible; zero vouchers or specimen identities were independently verified; no site assignment, current-presence claim or public projection changed.
- **Next:** continue site-resolved Central Luzon discovery across freshwater, wetland, brackish and coastal areas. Seek follow-up surveys and reuse terms; keep the regional baseline incomplete. See `central-luzon-cabiao-fish-taxonomy-followup-20261024.json`.

## 73. CALABARZON wetland-roadmap count and waterbody-scope reconciliation -- 24 October 2026

- **DENR 2024 roadmap:** its headline says 30 wetlands. Counting its province-grouped prose yields 31 named phrases: 8 Quezon, 5 Batangas, 11 Laguna, 1 Rizal, 5 Cavite and 1 shared Laguna/Rizal entry. Sixteen phrases match an existing scope display name, one `Laguna Lake` phrase is a possible alias of the `Laguna de Bay` lead, and 14 phrases remain unmatched. `Alligator/Tadlac Lake` is retained as one printed phrase, and the Maragondon River Sanctuary is not merged with Maragondon River.
- **Identity and habitat limits:** name phrases include inland and coastal feature cues, protected-area/habitat designations, a river and shared Laguna Lake. The source does not explain whether a phrase is a unique wetland, alias, nested site or typographical error. Keep 31 as a phrase count, not a count of independent waterbodies.
- **Historical cross-check:** the CALABARZON Regional Development Plan attributes to DENR Region IV-A 2021 statistics 19 inland wetlands (16 lakes and three water-storage areas) and 354 river systems. These are dated aggregate categories with no named feature inventory in the reviewed text; they are not directly comparable to the 2024 roadmap. DENR's 2025 report outline lists a Table 8 titled “Inland Wetland in the Region,” but its values were not retrievable.
- **Access and disposition:** official search-index text was available, but direct requests for the DENR pages and RDP PDF returned 403; no underlying table, geometry, fish data or reuse permission was reviewed. No new scope lead, species assertion, diet claim, geometry or app record was added. See `calabarzon-wetland-roadmap-count-review-20261024.json`.
- **Next:** obtain the named DENR wetland and river inventories through permitted official access and ask how the roadmap's 30 headline items map to its 31 phrases. Keep CALABARZON incomplete until the feature identities and waterbody denominator have an auditable source basis.

## 74. Quezon wetland locality crosswalk and Dagatan Lake source review -- 24 October 2026

- **Locality crosswalk:** the DENR/CENRO Calauag 2026 waterbird census names Kalantasan Marsh in Barangay Rizal Rural, Lalaguna Marshland in Barangay Lalaguna, and Lutang Marsh in Barangay Pamampangin, all in Lopez, Quezon. The names crosswalk to the 2024 roadmap's `Kalantasan`, existing `Lalaguna Marsh`, and `Lutang Marsh` leads. The article is available as indexed official text, while direct retrieval returned HTTP 403; waterbird monitoring is not fish evidence.
- **Dagatan Lake:** visually reviewed Annex 17 (printed pages 1-15; PDF pages 145-159) of the official FASPS-hosted 214-page report. It locates a source-described 2 ha lake at Sitio Busal, Barangay Ibabang Palale, Tayabas City, and lists five local fish names without scientific IDs, vouchers, counts, or a fish-sampling date. A separate mention of a 1995 study does not attribute these names to it. The older plan's future-tense protected-area statement does not establish current designation.
- **Source receipt:** the official PDF SHA-256 is `c0d166388d95fb15b3c62ad7e56265d18b60502e244ea5084e11adc80bf8fbbd`. It remains only in ignored local research storage; no item-specific redistribution license was located. No PDF prose, table, image, coordinate, species identity, present-day status, or geometry is projected.
- **Disposition:** three source-named leads were added (Dagatan Lake, Kalantasan Marsh, Lutang Marsh), with `Lalaguna Marshland` as a name variant. CALABARZON now has 39 selected leads, 80 source assignments, 41 distinct assigned source references, 19 research-queued leads, and 34 unknown-salinity leads. The three additions have no validated geometry; no species, diet claim, or public app record was added. The region remains incomplete.
- **Next:** continue resolving the unmatched CALABARZON wetland names and the named river/wetland denominator, then proceed to the next Luzon region in the regional sequence without treating these starter leads as complete coverage. See `calabarzon-quezon-wetland-and-dagatan-review-20261024.json`.

## 75. CALABARZON BMB inland-wetland crosswalk and Dagatan/Pagatan identity hold -- 24 October 2026

- **BMB inventory:** visually reviewed the official 2019 inventory rows on PDF pages 3-4 and crosswalked 24 source rows. Eleven additional CALABARZON water/habitat leads were added. Existing rows retain source-era classes, localities, reported areas and inventory years in `calabarzon-bmb-2019-wetland-inventory-crosswalk-20261024.json`; these are historical leads, not current boundaries or a complete denominator.
- **Name and feature conflicts:** BMB lists Dagat Dagatan Lake in Tayabas (24.38 ha), the FASPS annex describes a 2 ha Dagatan Lake in Tayabas, and SEAFDEC's 2016 article describes a 7 ha Dagatan Lake in San Antonio; BMB separately lists a 3.22 ha Lake Pagatan in San Antonio. Keep the Tayabas and San Antonio scope leads separate. Do not assign the SEAFDEC figure labels to either lead without resolving identity and evidence. The BMB labels Lawa ng Tres Cruses as Water Storage while the scope lead is currently a lake; it also labels Lalaguna Marsh as a lake, so both classifications remain in conflict. Gunaw/Gunao and Mojicap/Mohicap remain candidate spelling crosswalks, not confirmed aliases.
- **Rights:** the PhilCHM terms require attribution for BMB/partner information, strongly discourage commercial reuse and do not provide blanket public database permission. The SEAFDEC article shows copyright and no item-specific open reuse license was found. Both PDFs are retained only in ignored local raw storage with byte counts and SHA-256 receipts; neither source is redistributed from this repository.
- **Disposition:** CALABARZON now has 50 selected water/habitat leads, 111 source assignments and 42 distinct assigned references. The computed kind counts are 7 bays, 2 estuaries, 19 lakes, 3 reservoirs, 9 rivers, 2 streams and 8 wetland/habitat leads. Thirty leads remain queued and 45 have unknown salinity. No geometry, fish/diet assertion, public app row or publication approval was added; the regional denominator and baseline remain incomplete. Regression pipeline and river projection checks must pass before publishing this checkpoint.
- **Next:** continue L1 CALABARZON with locality-resolved fish surveys and bounded occurrence checks for the newly named inland waters, while resolving source rights and the Dagatan/Pagatan identity conflict. Do not advance to NCR until CALABARZON's evidence and inventory gaps have been addressed or explicitly bounded.

## 76. Bounded GBIF Actinopterygii screens for new CALABARZON waters -- 24 October 2026

- **Search:** queried 16 source-name strings against both GBIF `waterBody` and `locality` fields, country `PH`, and the explicit Catalogue of Life XR Actinopterygii taxonomy. All 32 successful responses returned zero records. Three initial HTTP 429 responses were retried serially and returned HTTP 200 with zero records. URLs, result counts, response sizes and SHA-256 hashes are retained in `calabarzon-bmb-lakes-gbif-screen-20261024.json`; full response bodies remain ignored local research files.
- **Crosswalk:** the 16 terms cover 11 newly added BMB/DENR water or habitat leads. `Gunao`, `Pagatan`, `Podon` and `Alligator/Tadlac` name forms are search candidates only; they remain unconfirmed aliases. The filter covers ray-finned fish, not all fish classes.
- **Disposition:** the empty results are bounded data-discovery gaps, not fish-absence evidence. No occurrence, species/diet claim, geometry, public record or app projection was added. CALABARZON still has 50 selected leads, 122 source assignments, 42 distinct references, 19 still queued leads and 45 unknown-salinity leads; its denominator and baseline remain incomplete.
- **Next:** prioritize independent primary fish surveys or rights-cleared taxon tables for the added inland lakes, especially resolving the Dagatan/Pagatan locality conflict. Use broader occurrence work only with documented locality or waterbody crosswalks; do not repeat these exact-name zero screens as if they were coverage.

## 77. SEAFDEC NIFEP CALABARZON site-table review -- 24 October 2026

- **Source:** visually reviewed Table 2 (printed pp. 48-49; PDF p. 3) in Palma and Bartolome (2016), which summarizes NIFEP activities as of 2015. It reports 11 CALABARZON lake/reservoir sites and six Rizal river sanctuaries.
- **Crosswalk:** added Bal-on Reservoir, Quezon, as a named research lead; linked the Laguna de Bay row as historical fishery-management context. The seven San Pablo lakes plus Tadlak are grouped and are not assigned individually. The six Rizal sanctuaries are unnamed. Preserve the possible Tadlak spelling variant.
- **Identity hold:** the article's 7 ha Dagatan Lake is described in San Antonio. Keep it separate from Tayabas Dagatan/Dagat Dagatan and San Antonio Pagatan until identity can be resolved; do not transfer figure labels or stocked fish as wild-presence claims.
- **Disposition:** this is historical program/stocking context, not a current fish survey. No species, diet, geometry, safety statement or public app row was added. No item-specific open license was identified; the PDF remains ignored local research material. CALABARZON now has 51 selected leads and remains incomplete. See `calabarzon-seafdec-nifep-table-review-20261024.json`.
- **Next:** seek the referenced BFAR lake-management/NIFEP materials and independently reusable, locality-resolved surveys, starting with Bal-on Reservoir and Dagatan/Pagatan identity. Keep management or stocking activity distinct from occurrence evidence.

## 78. SEAFDEC proceedings follow-up for Dagatan/Pagatan identity -- 24 October 2026

- **Source:** reviewed Palma's 2016 SEAFDEC proceedings record and text-extracted printed pages 110-112. The case study describes a 7 ha freshwater Dagatan Lake in San Antonio, Quezon, and prints coordinates rounded to 13°44'N, 121°18'E.
- **Evidence boundary:** the proceedings mention *Clarias macrocephalus* in undated biodiversity context and describe managed open-water stocking. It provides no dated fish survey, specimen, count or diagnostic details. Do not project this as a dated wild occurrence.
- **Identity:** the San Antonio locality is distinct from the BMB/FASPS Tayabas Dagatan locality, but does not establish whether SEAFDEC's Dagatan is the BMB-listed San Antonio Lake Pagatan. The rounded coordinate is kept as source text, not a map point or geometry; no source is assigned to either scope lead.
- **Rights and disposition:** the PDF displays SEAFDEC copyright and no item-specific open license was found. Its raw copy is ignored local research material. One source-registry entry was added; no waterbody scope, taxa, diet, geometry or app record changed. See `calabarzon-seafdec-dagatan-case-review-20261024.json`.
- **Next:** seek site-validation/locality documentation and a dated, specimen- or diagnostic-backed fish survey for the San Antonio feature; keep CALABARZON incomplete until the site and regional inventory evidence are independently resolved.

## 79. Official Dagatan/Pagatan locality cross-check -- 24 October 2026

- **Locality evidence:** the Quezon Provincial Government directory independently names Dagatan Lake in San Antonio and describes it as man-made. It supplies no boundary, coordinate, area, fish record, or link to Pagatan.
- **Cross-check:** DENR's 2024 Quezon list contains both Dagatan Lake and Pagatan Lake as entries; BMB's 2019 inventory lists Lake Pagatan in San Antonio at 3.22 ha; SEAFDEC's 2016 case gives 7 ha for its San Antonio Dagatan. The area difference and two roadmap names keep identity unresolved; neither proves one lake or two.
- **Disposition:** preserve the existing Tayabas Dagatan and San Antonio Pagatan leads separately. The San Antonio Dagatan remains an unregistered identity candidate. No source was assigned to either lead; no alias, scope change, geometry, species record, or app row was added. See `calabarzon-dagatan-pagatan-identity-crosscheck-20261024.json`.
- **Next:** seek an official San Antonio LGU/CENRO crosswalk or detailed map, and continue with independently reusable locality-resolved fish evidence.

## 80. Laguna freshwater survey access and rights triage -- 24 October 2026

- **Paller et al. (2011):** the official PJS indexed article identifies the Molawin Creek, Dampalit Falls, and Cambantoc River survey and reports richness of 12, 12, and 9 species. The indexed table is visible in search text, but the official article/PDF direct fetch returned 403; no local copy or visually checked table was retained. The article's collection date was not established.
- **Cui et al. (2022):** official UPLB JESAM indexed article text reports 1,474 specimens and 15 species from three quarters of sampling across the Santa Cruz River System in 2016-2017. The PDF could not be opened directly; exact visit dates and correspondence between the system and the single `Sta Cruz River` scope lead remain unresolved.
- **Reuse and disposition:** PJS describes itself as open access, while its author guide requires copyright transfer; no item-level reuse license was located. JESAM/UKDR policy says copyright is assigned to UKDR subject to author personal-use exceptions. No species table was transcribed, no taxa were added, and neither study is projected in the app. The leads are retained for permission, date, taxonomy, and locality review in `calabarzon-freshwater-survey-source-triage-20261024.json`.
- **Next:** prefer independently reusable GBIF/OBIS records and rights-cleared government/author data. If these papers' tables are needed for a public species list, obtain reuse clearance, visually review the primary tables, reconcile names against current taxonomic authorities, and preserve the historical survey date/context. CALABARZON remains incomplete.

## 81. San Antonio Pagatan/Dagatan literature crosswalk -- 24 October 2026

- **New evidence:** Brillo's 2015 review of Philippine lake studies lists one `Pagatan/Dagatan` lake in Quezon at 3.22 ha. The DLSU repository confirms the article and DOI; its APSSR policy states the article content is CC BY-NC 4.0. The review's table row does not name a municipality or provide coordinates.
- **Cross-check:** the combined name and area match BMB's 2019 San Antonio Lake Pagatan row, while the Quezon provincial directory separately names Dagatan Lake in San Antonio. This makes a San Antonio name crosswalk plausible. The 2024 DENR roadmap still prints Dagatan Lake and Pagatan Lake as separate entries, so an official map or local confirmation is needed before adopting an alias or reducing the phrase count.
- **Disposition:** added one attributed, minimal research source; kept the possible match out of the scope aliases and app. The roadmap review now tracks two candidate alias crosswalks, 13 unmatched phrases, and the same unresolved 31-phrase/30-wetland discrepancy. No fish data, geometry, or unique waterbody denominator was added.
- **Next:** continue L1 CALABARZON with the official locality crosswalk request and independent locality-resolved fish evidence for inland waters; do not advance to NCR while the selected regional baseline and denominator remain incomplete. See `calabarzon-dagatan-pagatan-literature-crosswalk-20261024.json`.

## 82. Pansipit River historical diet-study rights triage -- 24 October 2026

- **Source:** Mendoza et al. (2015) report gut-content analysis of juvenile fish from the upstream Pansipit River-Lake Taal connection, using 2012 samples. The article reports 12 fish species and includes a diet-frequency table; this is a localized historical source for the app's natural-diet feature.
- **Reuse:** JESAM/UKDR policy describes copyright assignment to UKDR with limited author personal-use exceptions, while Ateneo's article metadata says © 2015 UPLB, all rights reserved. No item-level reuse license or written permission was verified.
- **Disposition:** registered and attached the study to the Pansipit research lead, but did not copy species/prey rows, add diet/species assertions, infer current diets, or project it to the app. Its findings apply only to the sampled juvenile fish and reach/period; they are not bait advice or a fixed whole-species diet.
- **Next:** clarify rights with the current holder or seek a separately licensed diet table, then verify exact taxa, prey entries, sampling dates and geographic scope before publishing any species-specific diet details. See `calabarzon-pansipit-diet-study-rights-triage-20261024.json`.


## 83. CC BY Taal tawilis diet guide -- 24 October 2026

- **Source and rights:** To et al. (2025) report *Sardinella tawilis* feeding ecology in Lake Taal. The article's final page states CC BY 4.0. The official journal PDF and indexed text were checked, with findings cross-checked against the author-shared full text and UST research summary; no local article copy or figure was retained.
- **Study scope:** gut-content fish samples were collected from October 2021 to December 2022, with closed-season and other sampling gaps. The paper compares its post-eruption findings with 2003-2004 observations. It describes size-selective zooplanktivory and temporal shifts among copepods and cladocerans, including higher post-eruption selection for cyclopoid copepods and named cladocerans.
- **Disposition:** one credited, paraphrased entry was added to the natural-diet guide for the already-reviewed taxon *Sardinella tawilis*. It is explicitly scoped to Lake Taal and the study periods. No Taal or other-region occurrence, full species inventory, bait suggestion, or fishing advice is inferred; no diet or occurrence row was added to the regional species projection.
- **Reconciliation:** the Taal source is linked to the lake research lead; CALABARZON has 83 named waterbody leads, 132 registered references, 193 source assignments and 46 distinct assigned references. The coverage denominator, species inventory and regional baseline remain incomplete.
- **Next:** continue L1 inland-water review with rights-cleared, locality-resolved fish evidence, and keep diet findings linked to species, waterbody, sampling period and life stage. Do not advance to NCR until the CALABARZON inventory and its remaining evidence gaps are reviewed or explicitly bounded. See `calabarzon-taal-tawilis-diet-review-20261024.json`.

## 84. Taal Midas cichlid landed-catch source and rights review -- 24 October 2026

- **Source:** reviewed Mutia et al. (2025), which analyzes NFRDI Taal Lake landed-catch records from 2011-2022 and reports the spread of *Amphilophus citrinellus*. The paper states morphological and DNA identification for collected specimens; this review did not independently re-identify them.
- **Source conflict:** the abstract says nine municipalities, while Table 1 names eight. Landed-catch data are not a standardized lake-wide abundance estimate; no missing municipality was inferred and no unlisted row was treated as absence.
- **Reuse and disposition:** the official Philippine Journal of Fisheries policy specifies CC BY-NC 4.0. The source is registered and attached as a Taal research reference, but no catch values, municipal-presence claims, species assertions, abundance forecasts or app projection were added. Commercial-use fit remains unapproved.
- **Reconciliation:** CALABARZON remains at 83 named waterbody leads, 133 registered sources, 194 source assignments and 47 distinct assigned references. The fish inventory, waterbody denominator and regional baseline remain incomplete.
- **Next:** continue L1 inland-water discovery with rights-cleared locality evidence; seek permission or underlying NFRDI records to resolve the article's municipality count and table scope. Do not advance to NCR until CALABARZON's remaining gaps are reviewed or bounded. See `calabarzon-taal-midas-cichlid-catch-study-rights-review-20261024.json`.

## 85. National Museum fish collection Taal locality screen -- 24 October 2026

- **Reusable source:** the ASEAN Centre for Biodiversity IPT lists the National Museum of the Philippines fish collection as version 1.38 (published 2026-09-11), with 8,225 occurrence records and a CC BY 4.0 license. Its description says samples are from commercial-port landing sites, markets and nearby seas; that description alone does not establish a Taal specimen locality.
- **Bounded search:** four GBIF queries for exact `waterBody=Taal Lake`, `locality=Taal Lake`, `locality=Taal`, and `scientificName=Amphilophus citrinellus` returned HTTP 200 with zero results and were not truncated.
- **Disposition:** registered the nationally reusable dataset and attached it to the Taal research lead. The zeroes are a discovery gap for this dataset version and fields only. No absence claim, occurrence assertion, species checklist item, geometry, or app projection was added.
- **Reconciliation:** CALABARZON remains at 83 named waterbody leads, 134 registered sources, 195 source assignments and 48 distinct assigned references. The fish inventory, waterbody denominator and regional baseline remain incomplete.
- **Next:** continue locality- and coordinate-aware searches across independent CC0/CC BY sources for Taal and other inland waters; review any individual record's event, locality, taxonomy, license and quality flags before asserting presence. Do not advance to NCR until CALABARZON's remaining gaps are reviewed or explicitly bounded. See `calabarzon-taal-national-museum-gbif-screen-20261024.json`.

## 86. Taal coordinate-envelope specimen crosswalk -- 24 October 2026

- **Candidate discovery:** a broad GBIF coordinate envelope (used only to find records, not as a Taal boundary) returned 242 records from the National Museum collection. The selected specimen pages identify `Harengula tawilis` / accepted GBIF name *Sardinella tawilis* (catalog `FW O2341-T`, 1996) and *Glossogobius celebius* (catalog `NMI 11069`, 1981). Neither GBIF record supplies `locality` or `waterBody`; both lack coordinate uncertainty, and the tawilis record is flagged `COORDINATE_ROUNDED`.
- **Secondary crosswalk:** FishBase pages match the exact catalog number, taxon and year, and list `Taal Lake, Batangas` for the tawilis and `Lake Taal, Balete` for the goby. Their Main References cite the SEAFDEC AQD FishWorld collection and the Philippine National Museum fish collection, respectively. The FishBase `FW` museum code for the tawilis differs from the GBIF `SEAOBIS` institution/collection codes, and neither cited institutional catalog record has yet been retrieved directly.
- **Rights and disposition:** FishBase's current site states CC BY-NC 4.0. Both crosswalks are research-only, pending direct primary-catalog verification and a reuse review; coordinates, locality strings and species assertions were not added to the public projection.
- **Reconciliation:** CALABARZON remains at 83 named waterbody leads, 135 registered sources, 196 source assignments and 49 distinct assigned references. The fish inventory, waterbody denominator and regional baseline remain incomplete.
- **Next:** verify catalog `FW O2341-T` with SEAFDEC/AQD and `NMI 11069` with the National Museum using openly available institutional material; otherwise retain both as unresolved research candidates and proceed with independently licensed, locality-resolved inland evidence. Do not advance to NCR until CALABARZON's remaining gaps are reviewed or explicitly bounded. See `calabarzon-taal-gbif-coordinate-candidate-crosswalk-20261024.json`.

## 87. Taal Lake CAS exact-waterBody specimen evidence -- 24 October 2026

- **Institutional follow-up:** reviewed the public National Museum library/services pages and SEAFDEC FishWorld collection material. These describe collections and research access but expose no public item-level record for `FW O2341-T` or `NMI 11069`; those FishBase-crosswalk candidates stay held. No institution was contacted.
- **Independent source batch:** queried the California Academy of Sciences Ichthyology dataset through GBIF using country `PH`, `PRESERVED_SPECIMEN`, exact `waterBody=Lake Taal`, and a 100-row limit. The complete 14-row response contained three species-rank, six genus-rank and five family-rank rows. Three selected rows have source waterBody and locality text, collection dates, specimen catalog numbers, and CC0 1.0 rights. One recorded *Microphis jagorii* name resolves to accepted *Oostethus jagorii*; all original names and status are retained.
- **Quality and disposition:** all three selected rows retain `CONTINENT_INVALID` and other GBIF issue codes. Coordinates are excluded; two 2011 rows lack coordinate uncertainty and the 1931 row reports 12,567 m uncertainty. Three historical locality assertions are shown in a new bilingual Species-page card. The 11 lower-rank rows and two FishBase crosswalk candidates remain excluded. No current-presence, abundance, diet, catchability, access, legal, safety, geometry or complete-inventory claim is made.
- **Reconciliation:** CALABARZON remains at 83 selected leads, 135 registered sources, 197 source assignments and 49 distinct assigned references; 19 leads remain queued, 78 have unknown salinity and no geometry is validated. The denominator and regional baseline remain incomplete. The existing Palico-Lian projection was regenerated only to refresh its pinned registry/scope hashes after confirming its own waterbody and source evidence did not change.
- **Next:** batch exact `waterBody` discovery across CALABARZON's named inland lakes and reservoirs against reusable occurrence datasets, deduplicate by occurrence/specimen identity, and inspect only species-rank rows with explicit source locality. Keep source licensing and coordinates checked per row; do not treat query zeroes as absence or advance to NCR. See `calabarzon-taal-cas-gbif-source-review-20261024.json`.

## 88. CALABARZON inland waters: GBIF text-field screen -- 25 October 2026

- **Coverage and method:** screened all 23 scope-listed lake/reservoir leads using their 34 current name/alias strings in GBIF `waterBody` and `locality` fields, with the Philippines filter and COL XR Actinopterygii taxon. The 68 successful requests returned complete result pages; no specimen-only filter was needed, and every returned row was a preserved specimen.
- **Candidates:** five query combinations returned rows, all for Taal Lake or Laguna de Bay. After de-duplicating GBIF occurrence IDs, 77 records remained: 16 Taal and 61 Laguna de Bay. Fifty-six rows are species-rank records representing 29 distinct GBIF accepted taxon keys, all still candidates pending independent review. The candidate set carries mixed CC0, CC BY 4.0 and CC BY-NC 4.0 licenses, with historical dates and quality/institution-match flags that need individual review.
- **Disposition:** saved query URLs, page hashes, rank/license summaries, locality, taxonomy and record-level issue fields in `calabarzon-inland-gbif-screen-20261025.json`; full API responses stay in the ignored raw folder. The two matching waterbodies are not reclassified, and none of the 77 records is admitted to the app yet. No coordinates, current-presence, abundance, diet, geometry or absence claims were added.
- **Reconciliation:** the source registry now links the batch. CALABARZON remains at 83 selected leads, 135 registered sources, 197 source assignments and 49 distinct assigned references, with 19 leads queued, 78 unknown salinity classifications, zero validated geometries and an incomplete regional baseline. The screen does not set a complete denominator.
- **Next:** deduplicate the 56 species-rank records to candidate taxa, group by source dataset, then review event date, exact collection locality, accepted taxonomy, license and quality flags. Start with the 51 Laguna de Bay species-rank records, keeping uncertain or mixed-license items held; only create a separate assertion batch after independent taxonomy and use checks. Do not advance beyond CALABARZON or interpret zeroes as absence.

## 89. Laguna de Bay specimen dataset and COL XR triage -- 25 October 2026

- **Dataset rights:** resolved the 61 Laguna records to seven GBIF dataset pages and retained each DOI and dataset license. Dataset and record licenses reconcile for all seven datasets; the set includes CC0 1.0, CC BY 4.0, and CC BY-NC 4.0. This is dataset-level screening, not blanket permission to redistribute records.
- **Taxonomy:** compared 35 recorded-name/family pairs with the explicit COL XR service. The matching index metadata hash was stable during the run; 18 pairings classified exact and 17 as synonyms, producing 27 accepted COL XR taxon keys. These automated matches remain proposals, not expert identification.
- **Record triage:** of 51 species-rank specimens, 18 meet preliminary explicit-locality, date, name-match and dataset-license checks for independent locality review; 33 stay held for missing/conflicting locality or dates, mixed commercial terms, or source/taxonomy quality flags. Ten lower-rank records are excluded from the species-candidate queue. Coordinates are omitted from the review artifact.
- **Disposition:** all 61 remain research-only. No species assertions, public app records, present-day claims or completeness claims were added. The artifact records individual GBIF IDs, event dates, locality text, dataset/record license, taxonomy classification and hold reasons; raw API bodies remain ignored local files. See `calabarzon-laguna-gbif-triage-20261025.json`.
- **Next:** directly re-check the 18 preliminary records against their occurrence-detail responses, examine the source catalog identifiers and quality flags, and write explicit row-level historical-only decisions. Keep any row with identity, locality, or rights conflict held. Do not treat the screen as an inventory or as current presence.

## 90. Laguna de Bay candidate direct-record verification -- 25 October 2026

- **Direct check:** retrieved the GBIF occurrence-detail response for each of the 18 preliminary candidates. All 18 matched the screening snapshot on GBIF ID, dataset, rank, basis, names, event date, waterBody/locality, license and issue codes; no indexed-field drift was found. Every row includes a source catalog number or occurrence ID.
- **Quality context:** the 17 CAS rows carry GBIF's continent/coordinate-derived or continent-invalid interpretation flags; 16 also have an inferred-occurrence-status flag and one has status inferred from basis of record. The single MZUSP row has no issue flags. Official GBIF documentation explains these flags as interpretation status; no coordinates are retained or used to relocate the specimens. Raw direct responses stay in the ignored local research directory.
- **Disposition:** the source API and the screen agree, but this is not a direct inspection of the museum catalog or a specimen re-identification. All 18 remain research-only; no historical assertion, current presence, map point or complete Laguna species inventory was added.
- **Next:** independently verify the two source collections' catalog records and review the 18 accepted names against record-era and current taxonomic references. Then decide per row whether it can support a historical-only lake assertion under the relevant license. Continue holding records with contradictory source locality/waterBody or unresolved use terms. Do not proceed to NCR until CALABARZON's baseline and gaps are reviewed or explicitly bounded.

## 91. Laguna de Bay independent Catalog of Fishes name cross-check -- 25 October 2026

- **Method correction:** parsed Catalog of Fishes result blocks individually and selected the exact queried name or unique valid-name crosswalk. This prevents unrelated synonym rows from being mistaken for the queried taxon's status.
- **Result:** checked 21 recorded/accepted binomials from 18 GBIF candidates. Thirteen of the 18 record-to-accepted-name links agree with the catalog; five records remain held for missing or conflicting crosswalks.
- **Scope and disposition:** the California Academy of Sciences catalog was used for nomenclature only. It did not verify specimen identity, collection locality, present-day occurrence or reuse rights. All 18 stay research-only; zero occurrence assertions or app records are admitted. Raw catalog pages remain in ignored local storage with response hashes.
- **Verification:** `npm run species:fetch:calabarzon-laguna-cof` refreshes this name-only review; the regression test verifies row-specific extraction and hold behavior. The research pipeline includes the new test.
- **Next:** inspect the CAS and MZUSP primary catalog records using the 18 source catalog numbers/occurrence IDs, then assess record-era taxonomy, locality and item-specific rights row by row. Keep unresolved records held and do not claim a complete Laguna checklist.

## 92. Laguna de Bay institution-linked catalog verification -- 25 October 2026

- **MZUSP direct catalog:** the official MZUSP ichthyology page links to its online collection catalog hosted by SiBBr. Searching collection `co119` and catalog number `118522` returned two portal rows sharing one occurrence ID. The item-level response preserves *Arius dispar*, 14 May 1931 and locality `Laguna de Bay`, matching the GBIF source name/date/locality text. No `waterBody` field is supplied.
- **Conflicts held:** the portal's interpreted record is classified at family rank (*Ariidae*) and flags a missing taxon rank / higher-rank match. Its detail contains the text locality `Laguna de Bay` but also raises `LOCATION_NOT_SUPPLIED`; it has no `waterBody` field, so locality precision remains unresolved. The item response labels the record CC BY-NC 4.0 (Int), while the GBIF occurrence detail reports a different license; the linked SpeciesLink collection profile says use conditions are unspecified and was last updated in 2006. Keep this candidate research-only until rank, locality interpretation and rights are resolved. Only allowlisted fields and response hashes are retained; coordinates are discarded.
- **CAS access:** on 25 October, the public CAS Monarch portal displayed an offline notice saying it was taken offline on 21 October while being rebuilt. One legacy query returned a generic shell without item-level data. The 17 CAS catalog items remain unverified; the outage is not evidence that those specimens are absent.
- **Disposition:** all 18 GBIF candidates remain held, with zero historical assertions or public records admitted. The new `npm run species:fetch:calabarzon-laguna-museum-records` command refreshes the MZUSP linked-catalog fields; tests protect duplicate-row handling, rank/license conflicts, the CAS access limitation, and coordinate exclusion. See `calabarzon-laguna-museum-catalog-verification-20261025.json`.
- **Next:** continue the CALABARZON coverage-and-gap review using independently reusable, locality-resolved evidence while keeping these museum items out of public projections. Re-check the 17 CAS rows when the public catalog returns, and resolve the MZUSP interpretation/license conflict through an authorized source route before considering either record for historical display. Do not advance to NCR until CALABARZON's baseline and remaining gaps are reviewed or explicitly bounded.

## 93. CALABARZON scope and gap snapshot refresh -- 25 October 2026

- **Traceability:** the new Laguna de Bay gap entry links the MZUSP-linked SiBBr catalog check and the CAS Monarch access check. They are collection-review sources, not admitted occurrence evidence or scope-level source assignments.
- **Updated snapshot:** preserved the 83 selected leads and the prior scope totals of 197 source assignments and 49 distinct assigned references; refreshed the registered-source count to 138. The report records its scope, registry and museum-verification input hashes.
- **Open museum gap:** all 18 historical specimen candidates remain held. One unique MZUSP source item appears as two portal rows and has family-rank, locality-interpretation and license conflicts; 17 CAS rows remain unverified while the public catalog is offline. No public record, current-presence claim, or complete checklist was added.
- **Regional status:** no validated waterbody geometry, complete waterbody denominator, or public admission was added; CALABARZON remains incomplete and the rollout does not advance to NCR.
- **Next:** continue CALABARZON's source-derived waterbody inventory and independently reusable, locality-resolved fish evidence. Recheck CAS when the public catalog returns and resolve MZUSP conflicts through an authorized route. Keep uncertain museum items out of public projections.

## 94. Balayan Bay museum catalog cross-check through iDigBio -- 25 October 2026

- **Crosswalk:** compared the 14 corrected GBIF candidates with iDigBio's public record search and direct record/recordset endpoints. The candidates collapse into ten source catalog identities; nine returned source-attributed records across CAS Ichthyology, Field Museum Fishes and USNM. iDigBio aggregates provider records, so these matches help resolve catalog references but are not independent specimen confirmations.
- **Conflicts preserved:** the UMMZ catalog query did not return an exact source identity. The CAS record for catalog 28340 is recorded as *Liza troscheli*, while GBIF spells the name differently and maps it to another accepted name. The two Field Museum source records give only the year, although iDigBio's normalized `dateCollected` index adds a day and month; only the provider's year-level date is retained as source precision. Five GBIF USNM material-citation rows resolve to a single catalog number, whose source locality includes Balayan Bay and other places; they do not represent five independent occurrences.
- **Rights and disposition:** iDigBio recordset metadata reports CC0 for the three matched collections, while the USNM record itself has no item-level license field. GBIF quality flags and these source-level limitations remain attached. All 14 GBIF candidates remain research-only; no historical assertion, public row, coordinate, current-presence statement, or complete checklist was added. The allowlisted review excludes coordinate fields; full response bodies remain ignored in local research storage.
- **Reproducibility:** `npm run species:fetch:calabarzon-balayan-details` refreshes the 14 direct GBIF responses; `npm run species:fetch:calabarzon-balayan-idigbio` refreshes the catalog crosswalk. The research pipeline tests source-identity grouping, the five-to-one USNM duplication, the UMMZ gap, date precision and coordinate exclusion. The CALABARZON gap report now references the crosswalk and records 139 registered sources while retaining 83 selected waterbody leads, 197 scope source assignments and 49 distinct scope references.
- **Next:** retrieve originating CAS and Field Museum records when accessible; resolve the UMMZ identifier and CAS name conflict, then make row-level historical-only decisions under source-supported locality, date, taxonomy, quality and reuse terms. Continue the CALABARZON inventory and do not advance to NCR or mark the region complete.


## 95. Balayan Bay Field Museum institutional archive check -- 25 October 2026

- **Direct source check:** downloaded Field Museum IPT Darwin Core Archive version 13.13 and matched the FMNH Fishes catalog rows 47041 (*Caracanthus unipinna*, 1929) and 90961 (*Lagocephalus lunaris*, 1926). Both rows carry the locality text `Balayan Bay` and a CC0 1.0 public-domain dedication.
- **Date and privacy controls:** each institutional row reports only a year. iDigBio’s indexed day/month values remain excluded. The full archive includes coordinates and remains in ignored local storage; the committed allowlisted review excludes coordinate fields and records the archive SHA-256.
- **Disposition:** the institutional archive corroborates provider/catalog identity and the listed fields, but is not independent specimen re-identification or a field survey. GBIF quality flags remain attached; no historical assertion, app row, current-presence statement, or completeness claim is admitted.
- **Reconciliation:** the source registry and CALABARZON gap snapshot now record 140 sources while retaining 83 selected waterbody leads, 197 scope source assignments and 49 distinct scope references. Palico-Lian’s source, scope and decisions were verified unchanged; its pinned registry hash was refreshed.
- **Next:** resolve UMMZ and CAS catalog 28340 identity/name conflicts, reconcile the single USNM catalog identity represented by five material-citation rows, and review each candidate’s taxonomy and GBIF quality flags before making explicit historical-only decisions. Keep CALABARZON incomplete and do not advance to NCR.


## 96. Balayan Bay Field Museum row-level taxonomy and quality decisions -- 25 October 2026

- **Taxonomy:** exact WoRMS API lookups returned accepted species-rank records for *Caracanthus unipinna* (AphiaID 220365) and *Lagocephalus lunaris* (AphiaID 219957). WoRMS cites FishBase for these taxon rows, so the check is recorded as nomenclatural cross-reference, not independent specimen identification.
- **Disposition:** both records are admitted only as historical source-locality evidence in the research ledger. Their dates remain year-only (1929 and 1926), the original Balayan Bay text is retained, and every GBIF issue is preserved with its interpretation. No coordinate, current-presence assertion, public app row, or complete checklist claim is added; the records are from Batangas, outside the current Cavite pilot.
- **Remaining Balayan work:** 12 other GBIF candidate rows across eight non-Field-Museum catalog identities remain open. Obtain CAS and USNM institution records where possible, resolve the UMMZ identity and CAS 28340 name conflict, and reconcile the USNM five-to-one citation group and multi-locality scope.
- **Verification:** `npm run species:review:calabarzon-balayan-fieldmuseum` refreshes the two WoRMS cross-checks and row decisions; the pipeline test pins the accepted IDs, source identity, date precision, GBIF flags and zero public/map admissions. CALABARZON remains incomplete.

## 97. Cavite pilot bay GBIF text-field screen -- 25 October 2026

- **Scope and method:** queried GBIF's public Occurrence API for Bacoor Bay, Cañacao Bay, and the existing spelling alias Canacao Bay, using country `PH` and both indexed text fields (`waterBody` and `locality`). All six searches completed with HTTP 200 and enumerated their result pages. The five returned rows resolve to five unique GBIF records from one Bailey-Matthews National Shell Museum dataset; direct occurrence and dataset metadata were checked and hashed.
- **Record review:** four rows have species-rank Mollusca names (two Bivalvia, two Gastropoda); the fifth has no indexed scientific name or class and a `TAXON_MATCH_NONE` flag. The dataset and occurrence rows report CC0, but that metadata does not by itself approve a Bangwit publication. The rows retain GBIF quality flags.
- **Geography limits:** the locality strings match the bay search terms, but the interpreted `waterBody` values include Manila Bay, Philippine Sea, or no value. These records do not establish occurrence inside either named bay; no coordinate, bay geometry, salinity, or fish candidate was admitted.
- **Disposition:** the two leads now have a bounded all-taxon text-screen status, with four non-fish records and one unmatched taxon explicitly separated from fish evidence. No fish absence, species assertion, diet claim, public app row, or complete checklist is inferred. CALABARZON remains incomplete; the gap report now counts 199 source assignments and 17 research-queued leads while retaining unknown salinity and zero validated geometry.
- **Reproducibility:** `npm run species:fetch:calabarzon-cavite-bays` refreshes the six searches, direct record checks and dataset metadata. The regression test protects query scope, source hashes, taxonomy/quality handling, and the no-absence/no-public-admission limits.
- **Next:** continue L1 CALABARZON with independently supported fish sources and precise waterbody crosswalks for Cavite's coastal and inland leads. Do not treat GBIF text labels as bay geometry, and do not advance to NCR until the regional baseline and remaining gaps are reviewed or explicitly bounded.


## 98. Maragondon River genus-level tilapia evidence -- 25 October 2026

- **Primary source:** the 2024 *Aquatic Research* article by Limbago et al. reports 48 juvenile `Tilapia sp.` collected with seine nets at upstream, midstream and downstream Maragondon River stations during April 2023. The authors intentionally retain genus-level identification because of possible interspecific hybridization and uncertainty in the feral fish gene pool.
- **Reuse:** the journal's official open-access policy states that its open-access articles are under CC BY 4.0. Bibliographic details and the short research finding are attributed; no article table or figure is reproduced.
- **Disposition:** added one source reference to the Maragondon River lead and one genus-level historical research summary. No species assertion, taxonomic match, current-presence/catchability/diet/safety/legal claim, salinity classification, validated geometry, or public app row was added. CALABARZON remains incomplete.
- **Updated checkpoint:** 83 selected waterbody/habitat leads, 200 source assignments, 50 distinct source references, and 151 registered sources. The Maragondon River remains without validated geometry and with unknown salinity; the waterbody denominator is unresolved.
- **Verification:** `tests/calabarzon-maragondon-tilapia-study-review.test.mjs` protects source attribution, genus-rank scope, precise sample period and counts, coordinate exclusion, input hashes, and non-public disposition.
- **Next:** continue L1 CALABARZON inland and coastal coverage by seeking independently supported species-rank observations with item-level reuse terms. Review primary records rather than resolving `Tilapia sp.` to a species from a common name or a separate source. Do not advance to NCR or claim a complete CALABARZON baseline.

## 99. Lopez marshes: bounded GBIF fish-index screen -- 26 October 2026

- **Scope and method:** queried GBIF's public occurrence search for Kalantasan Marsh, its source-listed shorter name Kalantasan, and Lutang Marsh. Each term was checked in both `waterBody` and `locality`, limited to the Philippines and Catalogue of Life XR Actinopterygii.
- **Result and disposition:** all six requests returned HTTP 200 with zero records. The raw response hashes and query URLs are recorded in `calabarzon-lopez-marsh-gbif-screen-20261026.json`; raw responses stay in ignored local research storage. No fish absence, wetland boundary, species, or public record is inferred.
- **Reconciliation:** the two existing Lopez leads now cite the bounded screen while staying research-queued. CALABARZON remains at 83 named leads, 217 source assignments and 59 distinct references, with 11 leads queued, 78 unknown salinity classifications, zero validated geometries and an incomplete baseline.
- **Next:** seek a dated, locality-resolved fish inventory or rights-cleared specimen evidence for the Lopez marshes. Do not repeat zero-result text queries as evidence of absence.

## 100. Lalaguna Marshland: municipal habitat-context cross-check -- 26 October 2026

- **Source:** reviewed the Municipality of Lopez's 3 March 2026 official wildlife-day page. It names Lalaguna Marshland and gives a general statement about aquatic life in local wetlands, but no fish names, survey details, sampling date, stations, boundary or item-specific reuse terms.
- **Disposition:** added the municipal page as a source-linked habitat-context reference for the existing Lalaguna lead. It confirms no species identification or fish occurrence; the fish evidence status, unknown salinity, unresolved marsh-versus-lake identity, undelineated boundary, research-only status and zero public admissions remain unchanged.
- **Updated checkpoint:** CALABARZON has 83 named leads, 217 source assignments, 59 distinct source references and 163 registered sources. Its denominator and fish baseline remain incomplete.
- **Next:** request any dated fish survey, scientific identifications, locality/station details, item-level reuse terms and authorized extent data for the Lopez marshes from the municipal environment/fisheries offices and BFAR/DENR. Keep this request unsent until the project owner chooses to send it; meanwhile continue L1 with other independent sources.

## 101. Cavite inland municipal fisheries statistical-source review -- 26 October 2026

- **Source:** reviewed the PSA Cavite Provincial Statistical Office's *Cavite Fisheries Preliminary Situation Report: 3rd Quarter 2025*, released 3 February 2026 (2026-SR-006). It distinguishes inland municipal fisheries from marine municipal, commercial and aquaculture production and reports the inland category total as a preliminary 9.08 metric tonnes.
- **Reported categories:** the report displays Tilapia (4.83 tonnes), Other fishes (2.12 tonnes) and Blue crab (2.12 tonnes). These are production categories, not a locality-resolved species list; “Other fishes” is aggregate and blue crab is a crustacean. The displayed categories total 9.07 tonnes, while the report explains detail totals may differ due to rounding or statistical disclosure control.
- **Disposition:** registered the official statistical release as province-level inland-fisheries context. No named river/lake/dam/marsh, sample locality, scientific name, occurrence, waterbody assignment, public app row or completeness claim was added. The website footer states a general CC BY 4.0 default, but the PDF attachment's specific reuse status remains unconfirmed; no chart or full table is reproduced.
- **Access and verification:** the official page and linked PDF text were reviewed online. Direct local download met the publisher's anti-bot challenge, so no local source copy is claimed. `tests/calabarzon-psa-inland-fisheries-review.test.mjs` protects the category distinctions, source registration, coverage totals and zero-admission disposition.
- **Next:** continue the CALABARZON inland-water inventory with primary, site-resolved survey or specimen evidence; treat province-level fisheries statistics as leads for finding records or requesting an authorized, non-identifying QIFS breakdown. Keep any request unsent until the project owner chooses to send it.

## 102. Bacoor-Zapote source follow-up -- 26 October 2026

- **Historical EIS review:** the 2014 South Septage Treatment Plant EIS describes Zapote-Bacoor connectivity and estuarial context. Its fish wording comes from undated observations and interviews, without taxa, reproducible fish methods, station coordinates or vouchers. Its water-quality readings are from 2013. These remain historical context and do not establish fish presence/absence or current safety.
- **Bounded occurrence screen:** the new GBIF script queried six Bacoor inland river/creek leads, their canonical/short names and the Bacoor River alias over indexed `waterBody` and `locality` fields. All 26 requests succeeded and returned no matches. This is not absence evidence; no species row or geometry was added. Responses and query hashes are recorded in `calabarzon-bacoor-rivers-gbif-screen-20261026.json`.
- **Primary retrieval lead:** the DLSU Animo Repository catalogs a 1984 print thesis that includes fish at the Zapote river mouth, but the full text is unavailable online. The record gives no species or sampling details. The access review is recorded in `calabarzon-zapote-1984-thesis-access-review-20261026.json`; no library request was sent.
- **Disposition and release:** the CALABARZON gap report, source registry and README now preserve the historical source/access states. No species assertion, public app row, current water-quality alert, or complete inventory claim was added. Research commits `61d97c7`, `b4c586d` and `7cca7de` were pushed to `main`.
- **Verification:** JSON parsing, registry/review hash consistency checks and `git diff --check` passed. No test suite was run for these research-only records.
- **Next:** ask DLSU Libraries about authorized consultation or scanning of accession TU03120 and the item-specific reuse terms, then inspect its methods/results pages if access is granted. Meanwhile continue independent, station-resolved fish evidence and permitted geometry searches for the other Bacoor watercourses; keep CALABARZON incomplete and do not advance to NCR.

## 103. DLSU thesis access route and unsent inquiry -- 26 October 2026

- **Access lead:** the official DLSU Animo Repository Guide confirms that DLSU Libraries administers the repository. An indexed excerpt of the DLSU Ask LORA FAQ lists `library@dlsu.edu.ph` for inquiries. The FAQ page itself returned HTTP 429 on direct access; the excerpt does not confirm that an external researcher can consult accession TU03120.
- **Prepared action:** added an unsent draft asking about external access, authorized scanning of the fish methods/results pages, station/date/specimen details and item-specific reuse terms. No email, login, appointment or scan request was submitted.
- **Disposition:** the Zapote thesis remains a bibliographic lead, with no taxa or survey details extracted and no publication admission. The access route and draft are recorded in `calabarzon-zapote-1984-thesis-access-review-20261026.json` and the source registry.
- **Next:** the project owner may send the inquiry. Continue independent waterbody-level fish evidence and permitted geometry research for Bacoor while the print thesis access remains unresolved.

## 104. Ylang-Yang River historical survey and taxonomy review -- 26 October 2026

- **Source:** reviewed Martinez's 2018 Ylang-Yang River study, its three named fish-sampling stations, collection methods and source-reported taxon labels; fetched and hashed the publisher PDF. The paper states a Creative Commons Attribution License, with the version not specified in the reviewed text.
- **Taxonomy:** pinned the GBIF Catalogue of Life XR index for seven automated name matches. Three labels match accepted species names exactly; one exact match resolves to a synonym proposal, two source spellings resolve as variants, and one label remains genus-only. These outputs are nomenclatural proposals, not specimen re-identifications.
- **Disposition:** added a distinct Ylang-Yang River source lead and a research-only crosswalk. The survey does not give a fish collection date, per-taxon counts, vouchers or station coordinates. No species assertion was imported into the current projection; the unresolved `Ylang ylang/Rio Grande River` record remains separate. No app row, boundary, geometry or salinity claim was added.
- **Updated checkpoint:** CALABARZON has 96 selected waterbody leads, including 51 river leads; 255 reported source assignments, 74 distinct source references and 186 registered sources. The waterbody denominator and species baseline remain incomplete, and public admissions remain zero.
- **Next:** continue independent, rights-clear evidence review for the remaining CALABARZON inland and coastal waterbodies. For Ylang-Yang, seek collection dates, station coordinates, voucher references and independent confirmation for synonym/variant matches before creating site-specific historical assertions or mapping the river.

## 105. Labac EIA fish-name crosswalk -- 26 October 2026

- **Source:** reviewed the official AIIB EIA's Labac River fish-and-fishing summary, which names *Oreochromis niloticus* and *Mugil cephalus* as subsistence-caught fish. It does not give the observation date, exact station/reach, fish-identification method or vouchers.
- **Taxonomy:** both names receive exact accepted-species matches from the explicit CoL XR checklist key in GBIF's API. The matching-service metadata endpoint currently identifies the default GBIF backbone; the request key selects CoL XR per the official GBIF documentation. Record the exact request and response hashes; do not treat the nomenclatural result as field identification.
- **Disposition:** added the crosswalk to the existing Labac research review and source references. No historical occurrence assertion, current-presence claim, species projection, salinity label or public app row was added. The 2014 CvSU fish study remains only a bibliographic lead, and the unrelated Scribd text stays excluded.
- **Updated checkpoint:** CALABARZON still has 96 selected waterbody leads, 51 river leads, 186 registered sources, zero public admissions and an incomplete baseline. The crosswalk adds one source assignment.
- **Next:** continue with source-backed station/date evidence for CALABARZON rivers that can be reviewed from public primary sources; keep Labac EIA claims research-only until the underlying survey details and item-specific reuse conditions are resolved.

## 106. Bacoor Bay Island A EIS access review -- 26 October 2026

- **Lead:** the official EMB index exposes Table 2.2-49, "List of Fish species caught in inner Bacoor bay within Island A," printed page 2.2-157. The public-hearing index places the proposed Island A project along Bacoor Bay and coastal waters of Cavite City and Kawit.
- **Access and evidence:** direct PDF access returned HTTP 403. The table body, collection dates, station details, methods, vouchers and item-specific reuse terms remain unverified. The reclamation footprint is not treated as fish-survey or bay geometry.
- **Disposition:** registered as a retrieval lead for Bacoor Bay only. No taxon, historical occurrence assertion, public app row or geometry was added; no absence inference is made.
- **Next:** obtain authorized full-EIS access, verify table context and rights, then crosswalk only the names and locality details the source supports. Continue the open CALABARZON waterbody, inland-water, station-date and geometry reviews; do not mark the region complete or advance to NCR.

## 107. Rosario Wawa River estuary identity lead -- 26 October 2026

- **Official-source lead:** EMB search-index excerpts from the Island C and Island D EIS reports and the Island D public-hearing report name a Wawa River estuary near proposed Island E in the Rosario coastal project context and expose an actual-fishing table lead. Direct PDF requests returned HTTP 403. No table rows, catch values, species names, survey-station coordinates or item-specific reuse terms were transcribed or verified.
- **Identity check:** EMB CALABARZON's water-quality page uses the name Wawa River for a feature at Barangay San Rafael, Rodriguez, Rizal. Keep that namesake separate from the Rosario estuary lead. The nearby survey station is not treated as channel geometry or a catch point.
- **Disposition:** added one source-named estuary lead and kept its identity, salinity, extent, geometry, fish evidence and rights unresolved. No species assertion, absence inference, public app row or geometry was added.
- **Updated checkpoint:** CALABARZON now has 97 selected waterbody leads, including 3 estuary leads; 189 registered sources; zero public admissions; and an incomplete waterbody denominator and fish baseline.
- **Next:** obtain authorized direct EIS/hearing-report access, inspect the full actual-fishing and station tables, resolve the Rosario estuary against permitted hydrography, then review taxonomy and item-specific reuse. Continue the other CALABARZON inland and coastal gaps; do not mark the region complete or advance to NCR.

## 108. Rosario Wawa bounded GBIF fish search -- 26 October 2026

- **Search:** five CoL XR Actinopterygii searches checked GBIF `waterBody` and `locality` strings for Wawa River, Wawa estuary, Wawa, and Rosario Cavite. All returned HTTP 200 with zero candidates.
- **Interpretation:** this only means the current GBIF index returned no fish records for these bounded indexed-text searches. It does not establish absence, and it cannot resolve the Rosario estuary against the separately named Wawa River at Rodriguez, Rizal.
- **Disposition:** recorded raw response files, query parameters and hashes. Added the GBIF source reference to the Wawa research lead, while keeping public admission false and adding no fish assertion, geometry, or absence claim.
- **Next:** obtain authorized EIS access and visually review the CvSU Cañas-watershed figure that includes coordinates for the Wawa (Rosario) shrimp-sampling site. Crosswalk that site only if the map supports it; do not assume it is the same estuary or channel. Keep CALABARZON incomplete and do not advance to NCR.

## 109. Rosario Wawa and Cañas-study site identity crosswalk -- 26 October 2026

- **CvSU site evidence:** the 2022 article names Wawa (Rosario) as one of four selected Cañas River study sites. The separate research review records 16 shrimp individuals across six source-named taxa at its Wawa site aggregate. The article says selected-site coordinates are included with Figure 1, but no visual figure review or coordinate transcription was completed.
- **EMB evidence:** official indexed Island E project material names a Wawa River estuary in the Rosario coastal project context and exposes a project-area fishing-table lead; direct EIS retrieval remains blocked with HTTP 403.
- **Disposition:** the matching name and municipality do not confirm the same physical watercourse or estuary. Keep the CvSU site and EMB estuary as unresolved identity candidates; do not merge with Wawa River in Rodriguez, Rizal. Do not transfer the shrimp count or taxa to the estuary. No fish assertion, geometry, public row, or absence claim was added.
- **Next:** inspect the CvSU Figure 1 and compare the printed coordinate precision/context with permitted hydrography and authorized EIS station information before making a physical crosswalk. Keep CALABARZON incomplete.

## 110. CvSU Labac thesis-access route audit -- 29 October 2026

- **Official route:** the CvSU thesis explorer redirected to authentication before search. Its official thesis-abstract form requests identity and institutional details, a thesis barcode, and privacy consent. No login, form submission, email, or personal-data transmission occurred.
- **Applicability:** the 2014 “Identification and Characterization of Fish Species in Labac River” remains a secondary bibliographic lead with uncertain document type. Do not assume a thesis-abstract form can retrieve a conference presentation or full text. The official CvSU 2022 journal bibliography also cites a 2017 Cañas fish-and-crustacean bachelor's thesis, but no catalog match or thesis content was found.
- **Disposition:** this records a retrieval constraint only. No biological evidence, species assertion, waterbody geometry, public row, absence claim, or publication permission was added. External-request eligibility and item-specific reuse remain unverified.
- **Next:** continue independently accessible station-resolved fish sources. If the thesis leads are needed, first confirm eligibility and exact catalog identity with the library, then request an authorized copy and separately review reuse terms. Keep CALABARZON incomplete and do not advance to NCR.

## 111. Batangas Bay poster taxonomy crosswalk and source-name conflict -- 29 October 2026

- **Source:** the official NFRDI item page lists the 2020-2022 Batangas Bay poster and its abstract names ten fish taxa. Visual review of the poster confirms the footer says its layout is not ranked and that illustrated sizes represent maximum length.
- **Taxonomy:** GBIF v2 name matching with the explicit CoL XR checklist key returned exact accepted species-rank matches for the ten spellings on the poster image. This only normalizes names; it does not validate source field identifications, catch origin, distribution or present-day presence.
- **Conflict:** the poster image appears to say *Decapterus tabl*, but the official item abstract says *Decapterus tabi*. CoL XR matches `Decapterus tabl` to species rank and `Decapterus tabi` only to genus. Hold this row without silently selecting a correction.
- **Disposition:** nine unconflicted rows remain research-only; item-specific reuse terms and independent field identification remain unresolved. No waterbody assertion, public species row, geometry, ranking or abundance inference was added. Keep the Batangas Bay fish evidence partial and queued; CALABARZON remains incomplete. See `calabarzon-batangas-bay-poster-taxonomy-crosswalk-20261029.json`.

## 112. Makiling alternate-access and structured-reuse review -- 29 October 2026

- **Access route:** checked the official PJS article page and the NUS Digital Gems alternate item. NUS labels the item Open Access/Open, but the current terms distinguish public reading access from permission to extract or redistribute structured data. The direct PJS PDF had previously returned HTTP 403 and was not downloaded or visually reviewed in this step.
- **Rights decision:** PJS calls the journal open access, while its Authors' Guide says accepted authors sign a copyright-transfer form. No item-level reuse license was found. NUS terms prohibit creating derivative structured datasets or conducting text/data mining absent an explicit item-level license or written permission. Keep the 2011 survey table held; the review records an unsent permission inquiry.
- **Independent freshwater fallback:** existing CC0 GBIF evidence supports one historical text-locality assertion for *Gulaphallus mirabilis* at Molawin Creek from three preserved-specimen records in two datasets; records lack dates and coordinates. Bounded searches for Dampalit Falls and Cambantoc River returned zero and do not establish absence. No new taxa, assertions, scope assignment, geometry, or public app row were added.
- **Updated checkpoint:** CALABARZON coverage counts and source assignments are unchanged; the region remains incomplete, and Makiling's multi-site survey table remains unavailable for structured reuse.
- **Next:** continue independently licensed, locality-resolved freshwater discovery across CALABARZON. Do not treat the Molawin assertion as a complete Makiling checklist or infer absence at the other watersheds.

## 113. Santa Cruz River System station-name GBIF alternative screen -- 29 October 2026

- **Search:** queried exact `locality` and `waterBody` strings for Nagcarlan, Liliw, Calumpang, and Sta Cruz using country Philippines, stateProvince Laguna, and preserved specimens. The eight GBIF result pages were complete and their raw JSON responses are hashed in `calabarzon-santa-cruz-station-gbif-screen-20261029.json`.
- **Filter correction:** did not retain a class filter because a direct GBIF detail response for known CAS fish `3426421232` has null `class` and `classKey`; using `classKey=204` suppressed this known record. The corrected broad-preserved-specimen results were classified after retrieval.
- **Result and limits:** four exact-text records were returned: two plant specimens at Nagcarlan and two insect specimens at Liliw. Calumpang and Sta Cruz exact strings returned zero. This does not establish fish absence, resolve the study's station identities, or link any record to the 2016-2017 survey. The existing three 1941 CC0 CAS specimens labelled Santa Cruz River remain a separate historical source line.
- **Disposition:** no taxon assertion, station mapping, scope assignment, geometry or public app row was added. The 2022 UKDR survey table remains held pending reuse permission and exact station/date review.
- **Next:** continue independent, openly reusable evidence searches for CALABARZON inland waters; seek written table-reuse permission only if the 2022 survey's detailed station rows are needed. Keep CALABARZON incomplete and do not infer absence from bounded zero results.

## 114. DENR Calauag waterbird monitoring-site crosswalk -- 30 October 2026

- **Source and access:** reviewed the official DENR CALABARZON/CENRO Calauag 2026 Asian Waterbird Census index text. It reports a January 2026 monitoring round across Tagkawayan, Calauag, Guinayangan, Lopez, and Perez, Quezon. Direct page retrieval returned HTTP 403; no article images were copied and item-specific reuse terms were not reviewed.
- **Crosswalk:** the source names Ragay Gulf and De Guzman Fishpond in the Hinabaan, Guinayangan monitoring context. Added them as separate research-only scope leads (kinds gulf and fishpond). The source also supports barangay context for the three existing Lopez marsh leads; these were not duplicated. Barangay-only names, Forbes Farm, Baliscar Island, and the ambiguous Bukal-Maligaya (fishpond) wording were not promoted into feature records.
- **Evidence boundary:** this was a waterbird census, not a fish survey. No fish or diet claims, fish absence, salinity, geometry, fishpond ownership, access, safety, or fishing permissions were inferred. Ragay Gulf’s mention at one monitoring locality does not assign the gulf-wide area to Quezon or CALABARZON.
- **Updated checkpoint:** 99 source-named CALABARZON research leads; one gulf and one fishpond lead added. The updated denominator snapshot reports 99 leads, 94 unknown salinity classifications, zero validated geometries, 9 research-only species assertions, zero public records, 16 fish-evidence-not-reviewed leads, and 10 research-queued leads. The regional denominator and fish baseline remain incomplete. See calabarzon-cenro-calauag-2026-awc-site-crosswalk-20261030.json and calabarzon-coverage-denominator-profile-20261030.json.
- **Next:** seek independently reviewable fish evidence and verify physical identity/extent for the gulf monitoring context and fishpond; do not treat bird observations as fish evidence. Continue CALABARZON’s freshwater and coastal inventory before advancing to NCR.

## 115. Ragay Gulf BFAR/NFRDI poster and taxonomy review -- 30 October 2026

- **Source:** visually reviewed the official 2025 DA-BFAR IV-A/NFRDI/NSAP IV-A poster titled Top 10 dominant species Ragay Gulf, Quezon (2018-2022), plus its repository record and abstract. The item has no visible item-specific reuse license; its 2.22-MB image and 11 raw CoL XR match responses remain in ignored local research storage. No permission request was sent.
- **Evidence:** the poster labels nine finfish and one blue swimming crab. Its footer explicitly says the arrangement is not a ranking and the fish illustrations use maximum length. It does not display exact dates, survey stations, capture coordinates, methods, or effort. It is gulf-level context only, not evidence tied to Hinabaan or De Guzman Fishpond.
- **Taxonomy:** all ten poster spellings match as accepted species-rank names in the explicit CoL XR checklist. However, poster image Eubleekeria splendens conflicts with repository abstract Equulites splendens; the latter resolves only to genus in that checklist. Keep the conflict held; a name match is not field-identification verification.
- **Disposition:** added the official poster citation to the source registry and attached the research review to Ragay Gulf. No species occurrence assertion, waterbody subsite assignment, geometry, fishpond attribution, or public row was added. Item-specific reuse, station scope, and field identifications remain unresolved. CALABARZON stays at 99 research leads, 94 unknown salinity classifications, zero geometries, 9 previously imported research assertions, and zero public records.
- **Next:** seek publisher clarification on the name discrepancy and item-specific reuse, plus locality-resolved sampling information or an independent reusable source. Do not infer current presence, fishing access, legality, catchability, diet, or bait advice from this poster. See calabarzon-ragay-gulf-dominant-species-poster-review-20261030.json.

## 116. Ragay Gulf BFAR/FishCORAL Bicol-side report screen -- 30 October 2026

- **Source/access:** directly retrieved and reviewed the 167-page BFAR-hosted *Participatory Resource and Socioeconomic Assessment of Ragay Gulf (Bicol Side), Philippines*, credited to Bicol University Center for Policy Studies and Development. Its cover is dated 30 October 2019; the report records a May-July 2019 household survey. The PDF is ignored local research storage only.
- **Scope:** the household sample table lists ten Bicol-side municipalities. A separate 20-row finfish production table is aggregate, with no species-specific station, exact catch date, or coordinates; its production scope includes 11 municipalities including San Pascual, Masbate. No Quezon-side municipality or Guinayangan/Hinabaan sample was identified.
- **Rights/disposition:** no item-specific reuse license was found in the official FishCORAL listing checked or extracted PDF text. Keep the detailed table held. No taxon names, occurrence assertions, geometry, CALABARZON waterbody assignment, or public app row were added. This source does not resolve the Ragay Gulf poster species-name conflict.
- **Next:** continue with independently reusable evidence specific to Quezon-side Ragay Gulf and the DENR-named Hinabaan context; otherwise prepare a rights/access inquiry but do not send it without explicit authorization. Continue separate fishpond identity/evidence work. See calabarzon-ragay-gulf-bicol-prsa-source-review-20261030.json.

## 117. Ragay Gulf GBIF/CAS historical specimen and terms screen -- 30 October 2026

- **Source screen:** Queried the GBIF occurrence API for the Ragay Gulf waterBody text and reviewed the current CAS dataset metadata, selected occurrence/verbatim responses, and the existing CAS archive snapshot. Name-only CoL XR checks produced species-rank matches; those row-level names and identifiers stay in ignored local research files and were not copied into the tracked review.
- **Independent cross-check:** The 2025 open-access ZooKeys checklist corroborates one CAS catalog locality/date and conflicts with another. The conflicting candidate remains unresolved; do not silently repair or relabel it.
- **Rights:** The current CAS Ichthyology terms permit data use for basic research, education, and conservation but prohibit repackaging and redistribution. This conflicts with the GBIF CC0 metadata for the dataset. Because a public app or repository may redistribute selected rows, keep the whole candidate set held until CAS provides written clarification. No email was sent.
- **Disposition:** Added a metadata/rights-only review and linked the existing CAS source to the Ragay Gulf research lead. Zero species assertions were admitted, zero coordinates or row-level taxon data were added to tracked files, and no public app rows were added. The 99-lead, 9-assertion CALABARZON counters remain unchanged; the source reference was already present elsewhere in the regional scope.
- **Next:** Continue with separately reusable, locality-resolved evidence for Ragay Gulf and De Guzman Fishpond while rights clarification remains pending. Do not infer current presence, catchability, legality, safety, diet, bait advice, or gulf geometry. See calabarzon-ragay-gulf-gbif-rights-review-20261030.json.

## 118. Ragay Gulf CC BY literature locality crosswalk -- 30 October 2026

- **Source/license:** retrieved the full 2025 ZooKeys article XML and matched its prior receipt hash. The article body is CC BY 4.0. The distinct ODbL supplementary species list was not used.
- **Evidence:** crosswalked one type-material entry for *Callionymus octostigmatus* at Rogo Point, Ragay Gulf, with its printed 1966 date and depth. An explicit CoL XR query resolves the name as an accepted species. The entry is sourced to the CC BY article itself, not copied from the conflicting GBIF/CAS record.
- **Scope/disposition:** documented one literature-based historical locality record. The source does not locate Rogo Point to a province/region side; therefore it remains unassigned to Quezon/CALABARZON, is not added to the CALABARZON assertion counter, and is not a public app row or map point. The CAS/GBIF record stays held.
- **Next:** resolve Rogo Point identity and continue extracting only explicit article-body type localities with attribution; preserve the article and supplement license distinction. Do not infer current presence, fishery catchability, legal access, safety, diet, or bait advice. See ragay-gulf-zookeys-2025-type-locality-review-20261030.json.

## 119. Canmahala Bay Smithsonian Open Access locality context -- 30 October 2026

- **Source/access:** used the Smithsonian Open Access API after direct object-page access timed out. The exact query returned 27 records; two selected records are NMNH invertebrate specimens whose CC0 metadata reports “Luzon Island, Canmahala Bay, Camarines Sur” and the date 11 March 1909. The selected response is retained as an ignored local receipt and its API/documentation source is registered.
- **Crosswalk:** added a historical named-feature context anchor for the exact Canmahala Bay phrase in four ZooKeys fish treatments (entries 306, 353, 575 and 954). This does not transfer the non-fish specimens’ identity, taxonomy or coordinates, and it does not assign the fish lots to a province or region, establish a full bay footprint, identify the stream in entry 306, or define any legal boundary. “Canmahana” remains a separate unresolved spelling.
- **Disposition:** no species assertions, geometry, public rows, CALABARZON denominator or salinity values changed. Rogo Point and the remaining Ragay Gulf localities stay open; no absence or current-presence claim follows from this locality work. See calabarzon-ragay-canmahala-locality-access-review-20261030.json and ragay-gulf-locality-administrative-crosswalk-20261030.json.
- **Next:** seek a primary geographic source for Rogo Point and other unresolved point names while continuing the CALABARZON freshwater and marine queue. Keep the whole Ragay Gulf unassigned as a single-region waterbody until an appropriate authoritative source supports its extent.

## 120. Rogo Point NGA Geographic Names Server name screen -- 30 October 2026

- **Source:** queried the official NGA Geographic Names Server ArcGIS REST layer for the exact Philippines name `Rogo Point`, the `Rogo` substring in standard full names, and the `ROGO` substring in all names. All three requests returned HTTP 200. The exact-name query returned zero; the standard-name substring returned five unrelated rows, and the broad all-name substring returned 33 unrelated/variant-name rows. The Philippines country-file page listed its update date as 24 September 2026.
- **Interpretation:** this is a bounded gazetteer search, not proof that Rogo Point is absent or mislocated. GNS is a supplementary geographic-name reference and does not supply a Philippine legal or maritime boundary. No coordinates or geometry were added to the tracked review.
- **Disposition:** Rogo Point remains unresolved and the ZooKeys type-locality lot remains unassigned to a province/region. No species assertion, public row, geometry, denominator, current-presence claim, or absence inference was added. See `calabarzon-ragay-rogo-point-geonames-review-20261030.json`.
- **Next:** seek the historical 1966 cruise station log or a suitable NAMRIA hydrographic source that explicitly names the point; in parallel, continue with the next independently reviewable CALABARZON inland-water lead. Keep the full Ragay Gulf unassigned across regions until its extent is authoritative.


## 121. Guinayangan Maulawin tributary waterbody-name crosswalk -- 30 October 2026

- **Source:** IIRR watershed-management brief, pages 4–5 of the 16-page PDF; no publication date or item-specific reuse license was located.
- **Scope update:** Added Hiwasayan River, Maulawin River, Prensa Creek, and Sisi Creek as four source-named research leads. The CALABARZON denominator is now 111 selected leads (54 rivers, seven streams); the source registry has 215 entries.
- **Evidence boundary:** The brief estimates a 12 km Hiwasayan route and groups the other three watercourses across Guinayangan barangays. These descriptions are not surveyed channel geometry or proof of current hydrology. The PDF did not yield fish survey evidence. No fish assertion, species, salinity classification, boundary, access claim, or public app row was added.
- **Next:** Find primary DENR/PAMO or LGU records for watercourse identity and route, then independent station-resolved fish surveys with reviewable reuse terms. Keep the four leads out of public species rows until those gates are met.
- **Artifacts:** `calabarzon-guinayangan-mspl-tributaries-crosswalk-20261030.json`; updated `calabarzon-scope.json`, `sources.json`, fish-survey search review, and coverage denominator profile.
- **Source:** [IIRR watershed brief](https://iirr.org/wp-content/uploads/2021/10/Small-Watersheds-and-Landscapes-Engaging-Local-Stakeholders-in-Conservation.pdf).


## 122. Guinayangan tributary GBIF indexed-field screen -- 30 October 2026

- **Queries:** Eight GBIF occurrence-search requests across `waterBody` and `locality` for Hiwasayan River, Maulawin River, Prensa Creek, and Sisi Creek; country `PH`; the selected Catalogue of Life Extended Release Actinopterygii checklist and taxon key. All eight returned HTTP 200 and zero indexed records.
- **Disposition:** Bounded name-field screen only. Zero results do not establish fish absence and do not replace spelling-variant, all-taxon, survey, or station-resolved review. No fish assertion, species, geometry, salinity, access statement, or public row changed.
- **Artifacts:** `calabarzon-guinayangan-tributary-gbif-screen-20261030.json`; raw API responses are in ignored local storage and represented by tracked hashes/byte receipts.
- **Next:** Review alternate transliterations and municipality-level discovery separately, and seek a primary, reusable station-resolved fish survey. Do not broaden an unmatched lead into a claim of no fish.
- **Source:** [GBIF occurrence API](https://techdocs.gbif.org/en/openapi/v1/occurrence).


## 123. Kabibihan River System cross-municipality freshwater and tidal-habitat lead -- 30 October 2026

- **Scope:** Added one named river-system research lead for Quezon with study-area associations to Guinayangan and Tagkawayan. The CALABARZON denominator is 112 selected leads (55 rivers); 31 leads remain queued. This is not a complete waterbody inventory.
- **Evidence:** The 2021 ICFAS/AFSSRN abstract describes 102 gleaners across 11 barangays (six in Guinayangan, five in Tagkawayan) and 15 Mollusca macro-invertebrate species, but supplies no scientific-name list or finfish taxa. EO 78 (1947, effective 1948) names the river as the historical line between the two municipalities. A JICA 1999 report describes 19 historical salinity sampling points along an approximately 15 km route; a 2003 article identifies Kabibihan as a tidal river in a mangrove/salinity study.
- **Disposition:** The historic route and salinity studies do not establish current reach-wide salinity or river geometry. Two GBIF Actinopterygii indexed-field queries returned zero; this is not absence evidence. No fish/mollusc species assertion, geometry, salinity classification, access claim, or public row was added. No item-specific reuse license was found for the conference abstract or JICA report; no tables, figures or coordinates were republished.
- **Next:** Seek the underlying SLSU project report and review its station/taxon data and reuse terms; locate current authoritative hydrography before any geometry work.
- **Artifacts:** `calabarzon-kabibihan-river-system-review-20261030.json`, updated `calabarzon-scope.json`, `sources.json`, and coverage-denominator profile.
- **Sources:** [ICFAS/AFSSRN Book of Abstracts](https://tbtiphpssfns.upv.edu.ph/wp-content/uploads/2022/11/ICFAS-6-and-AFSSRN-F1-Book-of-Abstract.pdf), [EO 78 text](https://ldr.senate.gov.ph/executive-issuance/executive-order-no-78-s-1947), [JICA 1999 final report](https://openjicareport.jica.go.jp/pdf/11519246_01.pdf), [Toyoda et al. 2003](https://www.jstage.jst.go.jp/article/jjfe/45/2/45_KJ00005291885/_article).


### National rollout step 163: Kabibihan SLSU project provenance and report search -- 30 October 2026

- **Sources:** The official SLSU 2019 research-program PDF lists project 49 as completed in 2018–2019 and presented at the 3rd International Academic Summit in November 2019. The official 2021 program lists the same title and authors Jofren R. Moreno, Reynalyn C. Bacay, and Edmar A. Driz. The separate ICFAS/AFSSRN abstract provides the aggregate mollusc-gleaning results.
- **Search outcome:** Exact-title and author searches surfaced the conference abstract and official institutional program listings, but no publicly accessible full report or species-by-species appendix. Do not treat the institutional listings as the underlying study or as evidence of finfish records.
- **Disposition:** Added the two SLSU program records as bibliographic provenance. The abstract's 15 Mollusca species remain unnamed at species level in the available source. No taxon assertion, sampling station, geometry, salinity class, reuse permission, or public app row was added.
- **Next:** Use the university's public research contact route to ask whether the 2018–2019 report and any species appendix are available for review, with reuse terms; continue independent source discovery while awaiting an answer. No request was sent.
- **Artifacts:** `calabarzon-kabibihan-river-system-review-20261030.json`; updated `sources.json`, coverage denominator profile, and research README.
- **Sources:** [SLSU Research Program 2019](https://www.slsu.edu.ph/wp-content/uploads/2023/05/Transparency%20Seal2/IV/Research/2019/Research_2019.pdf), [SLSU Research Program 2021](https://www.slsu.edu.ph/wp-content/uploads/2023/05/Transparency%20Seal2/IV/Research/2021/Research_2021.pdf), [ICFAS/AFSSRN Book of Abstracts](https://tbtiphpssfns.upv.edu.ph/wp-content/uploads/2022/11/ICFAS-6-and-AFSSRN-F1-Book-of-Abstract.pdf).

### National rollout step 164: Viñas River name lead and bounded fish-field screen — 30 October 2026

- **Source:** The DENR-EMB CALABARZON Monitor for April–June 2005 indexed result names Viñas River with the parenthetical locality Guinayangan–Tagkawayan, Quezon, and notes fishing as its most beneficial use. Direct PDF retrieval returned HTTP 403; only the indexed excerpt was reviewed.
- **Screen:** Four GBIF queries for accented and unaccented name spellings in `waterBody` and `locality`, with country `PH` and the selected CoL XR Actinopterygii filters, returned HTTP 200 and zero indexed records. This is a bounded search gap, not fish-absence evidence.
- **Disposition:** Added Viñas River as a source-named research lead; did not merge it with Hinabaan River because no authoritative alias/feature crosswalk was found. The bulletin phrase is not treated as current fishing access, a legal water classification, fish evidence, or route geometry. No fish assertion, salinity class, geometry, access statement, or public row was added.
- **Next:** Retrieve authoritative DENR-EMB or LGU name/route records to clarify possible overlap with Hinabaan River and locate station-resolved fish surveys with reviewable terms.
- **Artifacts:** `calabarzon-vinas-river-name-gbif-review-20261030.json`; updated `calabarzon-scope.json`, `sources.json`, and coverage-denominator profile. Raw GBIF responses are ignored locally and represented by byte/hash receipts.
- **Sources:** [DENR-EMB CALABARZON Monitor, April–June 2005](https://calabarzon.emb.gov.ph/wp-content/uploads/2024/07/CALABARZON-MONITOR-April-June-2005-for-656.pdf), [GBIF occurrence API](https://techdocs.gbif.org/en/openapi/v1/occurrence).

### National rollout step 165: Viñas River official nautical cross-reference — 30 October 2026

- **Source:** NGA Pub. 162, *Sailing Directions (Enroute) Philippine Islands*, 14th edition (2025), independently names Vinas River. Its official indexed entry gives an approximate mouth position and a reach extending roughly four miles northwest from the outer bar. The title page and corrected-to date were verified through official NGA indexed results; the web reader refused the 11 MB PDF as too large, and no page image or local copy was reviewed.
- **Interpretation:** This is navigation context, not a surveyed centerline, channel boundary, freshwater extent, or current hydrographic survey. The route was not digitized. It does not resolve whether Viñas River and the separate Hinabaan River source lead describe one feature.
- **Disposition:** Added the NGA reference to the source registry and Viñas crosswalk; retained both leads separately. No coordinates, geometry, species, salinity classification, access claim, or public row was added.
- **Next:** Seek a local authoritative alias/reach crosswalk and station-resolved fish evidence with reviewable reuse terms before any geometry or species admission.
- **Artifacts:** `calabarzon-vinas-river-name-gbif-review-20261030.json`; updated `calabarzon-scope.json`, `sources.json`, and coverage-denominator profile.
- **Sources:** [NGA Pub. 162, Philippine Islands, 14th edition (2025)](https://msi.nga.mil/api/publications/download?key=16694491%2FSFH00000%2FPub162bk.pdf), [NGA Maritime Safety Information](https://msi.nga.mil/Publications).

### National rollout step 166: San Pablo Seven Lakes source conflict recheck — 30 October 2026

- **Access:** The official publisher page and complete 22-page PDF for Paller et al. (2017) were readable through web extraction. No local copy was retained; the earlier interactive challenge note is superseded for access status. The PDF's appendix identifies a per-lake distribution table, but its cells were not transcribed in this review.
- **Conflict:** The primary article's narrative and plate label the Bunot carp *Carassius gibelio*. The 2021 review attributes the same survey to Paller et al. (2017a) but calls it *Carassius carassius*. The Catalog of Fishes recognizes both as distinct valid species names, so the specimen identity remains unresolved.
- **Reuse and disposition:** No item-specific reuse grant was found for either article. The 2017 table remains held; the 2021 review is contextual secondary literature, not an independent occurrence source. No fish assertion, lake checklist, geometry, or app projection was added.
- **Next:** Seek an author correction, voucher/specimen record, or independent eligible survey plus item-specific reuse permission before revisiting lake-level rows. Continue with independently reusable sources for other CALABARZON waterbodies.
- **Artifacts:** `calabarzon-san-pablo-lakes-source-recheck-20261030.json`; updated `sources.json` and research index.
- **Sources:** [Paller et al. 2017](https://asianscientificjournal.com/new/publication/index.php/ajob/article/view/995), [Paller et al. 2021 review](https://www.scienggj.org/2021-158/), [Catalog of Fishes: *C. gibelio*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=2013), [Catalog of Fishes: *C. carassius*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=3101).

### National rollout step 167: NRCP project metadata cross-check — 30 October 2026

- **Source:** The NRCP/DOST Basic Research Information System records project E-224, led by Vachel Gay Velasco Paller at UPLB, as completed and cleared. It states an administrative period of 1 February 2013–31 January 2015 and describes wild-fish collection from February 2013 through March 2015 across the Seven Lakes. Its summary uses *Carassius carassius*.
- **Interpretation:** The project and fish-assemblage paper share a lead author and overlapping collection windows, but the page does not establish whether the fish samples or carp identifications are the same. The public record links no final report, voucher detail, or fish-data file. Its copyright footer is not a data reuse license.
- **Disposition:** This is official project provenance, not independent occurrence evidence and not a resolution of the 2017 *C. gibelio* versus 2021 *C. carassius* conflict. No table, fish list, assertion, geometry, or app projection was added.
- **Next:** Only reopen the identity question if a voucher/specimen record, author correction, or eligible independent survey is located. Continue the broader CALABARZON queue with independently reusable sources.
- **Artifacts:** `calabarzon-san-pablo-lakes-source-recheck-20261030.json`; updated `sources.json` and denominator-profile hashes.
- **Sources:** [NRCP/DOST BRIS project E-224](https://basicresearch.nrcp.dost.gov.ph/supported_programs_and_projects/details/65), [NRCP 2014 programs and projects](https://nrcp.dost.gov.ph/wp-content/uploads/2026/04/TranSeal2014_Programs-and-Projects-2014.pdf).

### National rollout step 168: Independent Lake Sampaloc fish and trophic study — 30 October 2026

- **Source:** Briones et al. (2016), *Tropical Ecology* 57(3), 567-581, is a separate field study limited to Lake Sampaloc. The public author-uploaded article describes rapid gill-net surveys in 2012-2014 and stable-isotope sampling in October 2013; UST's official author profile confirms the citation.
- **Diet relevance:** The authors infer that tilapine cichlids in Lake Sampaloc primarily graze or exploit littoral periphyton. This is historical, site-specific trophic-production evidence, not an exhaustive diet, a national profile, or bait advice.
- **Rights and disposition:** The article bears a 2016 copyright notice for the International Society for Tropical Ecology; no open license or item-specific data reuse grant was verified. The species table was not transcribed. No species assertion, diet claim, geometry, or app projection was added. This independent Sampaloc survey does not resolve the Bunot carp identity conflict.
- **Next:** Seek an eligible reuse grant or independently reusable data before creating Sampaloc species/diet rows; keep location, survey dates, method, and trophic-versus-bait distinctions attached to any future claim.
- **Artifacts:** `calabarzon-sampaloc-briones-2016-source-review-20261030.json`; updated `sources.json` and coverage-denominator profile hash.
- **Sources:** [Briones et al. author-uploaded full text](https://www.researchgate.net/publication/295507790_Fish_diversity_and_trophic_interactions_in_LAKE_SAmpaloc_Luzon_Is_Philippines), [UST author bibliography](https://www.ust.edu.ph/profile/papa-rey-donne-s/), [RIHN 2016 annual report](https://www.chikyu.ac.jp/publicity/publications/annual_report/img/2016_eng.pdf).

### National rollout step 169: Lake Sampaloc approximate-box GBIF screen — 30 October 2026

- **Query:** The GBIF Occurrence API search used `country=PH`, `taxonKey=204` (the GBIF species endpoint resolves this key to class Actinopterygii), `hasCoordinate=true`, and a 0.01° latitude by 0.01° longitude box centered on an approximate query point near Lake Sampaloc. It returned `count: 0`.
- **Interpretation and limits:** The point and box are discovery filters only; they are not sourced coordinates, a verified lake polygon, or proof that the query covers the whole lake. This zero result does not establish fish absence or a complete occurrence search.
- **Disposition:** No species, diet, geometry, current-presence claim, or public app row was added. The raw response is retained locally in ignored research storage with its SHA-256 receipt.
- **Next:** Obtain an authoritative or reusable lake geometry before a geometry-based search; continue to treat any returned occurrence as a candidate requiring record-level geography, identification, date, and reuse review.
- **Artifacts:** `calabarzon-sampaloc-spatial-gbif-screen-20261030.json`; updated GBIF source registry, research index, and CALABARZON profile hashes.
- **Sources:** [GBIF Occurrence API reference](https://techdocs.gbif.org/en/openapi/v1/occurrence), [recorded query](https://api.gbif.org/v1/occurrence/search?country=PH&taxonKey=204&hasCoordinate=true&decimalLatitude=14.074,14.084&decimalLongitude=121.325,121.335&limit=100).

### National rollout step 170: HydroLAKES Asia subset and Sampaloc candidate screen — 30 October 2026

- **Source acquisition:** Downloaded the HydroLAKES Asia subset from Zenodo record [10.5281/zenodo.17503891](https://zenodo.org/records/17503891), declared CC BY 4.0, and verified the published MD5 plus a local SHA-256. The official HydroSHEDS page documents the underlying HydroLAKES v1 product and its stated 10-hectare lake threshold; the official global archive was not downloaded.
- **National screen:** The subset has 250,196 polygons; 1,298 carry `Country=Philippines`. No Philippines feature has a `Lake_name` containing “Sampaloc.” This is a field screen, not a complete national inland-water inventory.
- **Local candidate:** A point-in-polygon screen places the approximate Sampaloc query center within unnamed Hylak_id 1397813. It is a spatial candidate only; name, identity, positional quality, and boundary were not independently validated. A second nearby unnamed feature, Hylak_id 1397812, is not assigned to the lake.
- **GBIF screen:** A country-filtered Actinopterygii geometry search against candidate 1397813 returned zero rows. The result is not evidence of fish absence or a lake-wide survey.
- **Disposition:** Recorded the archive/source hashes and bounded findings in the research artifact and registry. No fish occurrence, species, diet, geometry, access claim, or app record was added. The archive and extracted screening data remain in ignored local research storage; attribution is retained in the source record.
- **Next:** Seek an independent, authoritative or reusable San Pablo waterbody crosswalk before assigning the unnamed polygon. Continue treating HydroLAKES as a discovery layer, including its threshold and omission limits.
- **Artifacts:** `national-philippines-hydrolakes-asia-subset-screen-20261030.json`; updated `sources.json`, research index and CALABARZON coverage-denominator profile.
- **Sources:** [HydroLAKES product page](https://www.hydrosheds.org/products/hydrolakes), [Zenodo Asia subset and license](https://zenodo.org/records/17503891), [GBIF Occurrence API reference](https://techdocs.gbif.org/en/openapi/v1/occurrence).

### National rollout step 171: Lake Sampaloc named-geometry crosswalk — 30 October 2026

- **Independent name lead:** OpenStreetMap relation 1557746 is tagged `Sampaloc Lake`, `natural=water`, and `water=lake`; its API snapshot is relation version 15 dated 6 April 2026. The relation has six outer ways that form one polygon.
- **Spatial comparison:** In EPSG:32651, the OSM polygon overlaps 99.4% of HydroLAKES Hylak_id 1397813; the intersection-over-union is 0.869. The OSM polygon extends beyond the HydroLAKES feature, so their outlines are not identical.
- **Interpretation and rights:** This is a strong community-map crosswalk for the unnamed HydroLAKES feature, not an official or field-validated boundary. OSM data is ODbL 1.0 and requires attribution, with share-alike obligations for adapted databases. No app geometry was added.
- **GBIF result:** A country-filtered Actinopterygii search using the named OSM lake polygon returned zero coordinate-bearing occurrences. This bounded result is not evidence of fish absence, a census, or current ecological status.
- **Disposition:** Added the OSM source and review artifact; retained relation, WKT and raw GBIF response only in ignored research storage. No fish species, diet, legal access, or application record was added.
- **Next:** If public-app lake geometry is needed, request a local authoritative map/survey crosswalk and assess ODbL compatibility with Bangwit's data distribution. Otherwise continue the CALABARZON freshwater source queue.
- **Artifacts:** `calabarzon-sampaloc-osm-hydrolakes-crosswalk-20261030.json`; updated `sources.json`, research index and coverage-denominator profile.
- **Sources:** [OpenStreetMap relation 1557746](https://www.openstreetmap.org/relation/1557746), [OSM copyright/license](https://www.openstreetmap.org/copyright), [HydroLAKES](https://www.hydrosheds.org/products/hydrolakes), [GBIF Occurrence API](https://techdocs.gbif.org/en/openapi/v1/occurrence).

### National rollout step 172: San Pablo Seven Lakes spatial crosswalk — 30 October 2026

- **Screen:** A bounded OpenStreetMap water-feature query found named polygons for Bunot, Calibato, Mohicap, Palakpakin, Pandin, Yambo and Sampaloc Lakes. This is not an exhaustive waterbody inventory.
- **HydroLAKES matches:** Five of the six non-Sampaloc lakes have strong spatial candidates: Bunot (Hylak_id 1397812), Calibato (1397790), Palakpakin (1397776), Pandin (1397769), and Yambo (1397762). Each candidate polygon covers over 99% of its corresponding HydroLAKES feature, while OSM/HydroLAKES polygon IoU ranges from 0.705 to 0.779. Sampaloc was crosswalked separately in step 171.
- **Coverage gap:** Mohicap's OSM feature has no intersection with a Philippines-filtered HydroLAKES polygon in the screened subset. This may reflect product coverage or geometry differences; it does not imply the lake is absent.
- **Rights and disposition:** OSM is community-mapped ODbL 1.0 data; attribution and share-alike duties apply. HydroLAKES is CC BY 4.0. No geometry was admitted to the app, and no fish, diet, access, or legal claims were added.
- **Next:** Seek an authoritative or independently reusable shoreline crosswalk for the seven lakes and continue the CALABARZON river, reservoir, stream and wetland queues. Keep inland-water inventories distinct from species evidence.
- **Artifacts:** `calabarzon-seven-lakes-osm-hydrolakes-crosswalk-20261030.json`; updated `sources.json`, research index and CALABARZON coverage-denominator profile.
- **Sources:** [OpenStreetMap Overpass API](https://overpass-api.de/api/interpreter), [OSM copyright/license](https://www.openstreetmap.org/copyright), [HydroLAKES](https://www.hydrosheds.org/products/hydrolakes), [Zenodo HydroLAKES Asia subset](https://zenodo.org/records/17503891).

### National rollout step 173: San Pablo Seven Lakes GBIF geometry screen — 30 October 2026

- **Queries:** GBIF `country=PH`, `taxonKey=204` (class Actinopterygii), and `hasCoordinate=true` returned zero for a multipolygon of six HydroLAKES candidates (Bunot, Calibato, Palakpakin, Pandin, Yambo and Sampaloc) and zero for a separate OSM polygon query for Mohicap.
- **Request correction:** GBIF rejected the exact seven-lake OSM multipolygon request with HTTP 400 because the request was oversized. This is recorded as a failed request, not as a zero-result screen.
- **Interpretation:** The two successful zero-result searches are bounded index screens, not lake checklists, fish surveys, or evidence of fish absence. Records without coordinates or outside the selected source polygons are outside these searches.
- **Disposition:** Added query/raw receipts to the research log and GBIF source registry. No fish record, species, diet, current-presence claim, or app geometry was added.
- **Next:** Prioritize independently reusable or rights-cleared Seven Lakes fish survey/checklist sources, then review each candidate's lake locality, sampling date, taxonomy, and item-level reuse terms.
- **Artifacts:** `calabarzon-seven-lakes-gbif-geometry-screen-20261030.json`; updated GBIF source review references and CALABARZON coverage-denominator profile hashes.
- **Sources:** [GBIF Occurrence API reference](https://techdocs.gbif.org/en/openapi/v1/occurrence), [HydroLAKES](https://www.hydrosheds.org/products/hydrolakes), [Zenodo HydroLAKES Asia subset](https://zenodo.org/records/17503891), [OSM Mohicap feature](https://www.openstreetmap.org/way/25032575).

### National rollout step 174: UPLB Seven Lakes common-name source and data-access review — 30 October 2026

- **Source:** The UPLB College of Public Affairs and Development's Small Lake Governance platform has a profile for each of the seven San Pablo crater lakes. It attributes its lake-profile information to the City Planning and Development Office's 2015-2025 San Pablo Comprehensive Land Use Plan. The separate aquaculture page presents fish-cage and carrying-capacity context attributed to San Pablo City LGU and LLDA.
- **Data value and limits:** The profile's fish labels are vernacular common-name summaries without species-rank scientific names, record dates, sampling methods, stations, effort or vouchers. Its wording also groups fish with other aquatic species on several lake profiles. The companion aquaculture material is not a wild-fish occurrence dataset. DHSUD's indexed eFOI page reports that a copy of the 2015-2025 CLUP was released in response to a thesis request, but the referenced file and terms for Bangwit reuse were not obtained.
- **Disposition:** Recorded the platform as an attributed research lead. No CLUP file was downloaded, no source data was transcribed, and no species, current-presence, diet, geometry or public-app claim was added. No email or form was sent; no item-specific reuse license was identified.
- **Next:** Seek the original CLUP and ask the UPLB project team or San Pablo CPDO for the fish-list provenance, observation period, scientific identifications, field methods and item-specific reuse terms. Continue with independently reusable, dated fish surveys for other CALABARZON freshwater habitats while this lead remains unresolved.
- **Artifacts:** `calabarzon-uplb-small-lake-governance-profile-source-review-20261030.json`; updated `sources.json`, research index and CALABARZON coverage-denominator profile.
- **Sources:** [UPLB Small Lake Governance home](https://sites.google.com/up.edu.ph/smalllakegovernance/home), [UPLB lake profile](https://sites.google.com/up.edu.ph/smalllakegovernance/home/lake-profile), [UPLB aquaculture data page](https://sites.google.com/up.edu.ph/smalllakegovernance/lake-resource-utilization/historical-lake-use-lgu-data/aquaculture-data), [DHSUD eFOI CLUP release page](https://www.foi.gov.ph/agencies/dhsud/laguna-clup-dhsud-796465598728/).

### National rollout step 175: Agno River Basin cross-regional freshwater dataset review — 30 October 2026

- **Sources and reuse:** Reviewed the University of Glasgow Enlighten Research Data collection (DOI `10.5525/gla.researchdata.2287`) and Tenio et al. (2026), *Watershed Ecology and the Environment* 8:248–260 (DOI `10.1016/j.wsee.2026.05.001`). The repository marks both data files CC BY 4.0; the article repository copy also states CC BY 4.0. Archive, README and extracted CSV bytes are locally hash-receipted under ignored research storage. Attribution and modification marking remain required.
- **Regional reach and scope:** The eight sample-station descriptions cover Benguet/CAR, Pangasinan/Region I and Tarlac/Region III, so this shared watershed source can seed later Luzon regional work without being counted as any region’s complete inventory. The study reports one fish sampling visit per site per season in 2021–2022; it is historical station-level survey evidence, not current or complete basin coverage.
- **Data screen:** Fish_count.csv contains 23 taxon labels (20 binomial labels and three genus-only labels), 14 station-season columns for ARB1, ARB2, ARB4–ARB8, 65 nonzero taxon-by-station-by-season cells, and 2,599 individuals. Computed station richness and abundance for ARB1, ARB2 and ARB4–ARB8 match article Table 5. The matrix omits ARB3; the paper reports no specimens there during the study. That bounded sampling result is not a basin-wide absence claim.
- **Taxonomy and quality:** Twenty binomial strings were queried against the explicit CoL XR checklist through GBIF v2: 16 exact accepted-name matches, one exact synonym, two variant accepted-name matches, and one variant synonym proposal. The three genus-only rows were not queried. All remain automated name proposals. The source has spelling/authority issues including `Oreochromis mozambicus` versus the paper’s `O. mossambicus`, `Poecilla` labels, and a `Pseudogobius javanicus` synonym proposal. No name was silently normalized.
- **Date conflict:** The repository metadata/README map January 2022 to wet season and July 2021 to dry season; the article methods map July to wet and January to dry. The Fish_count.csv only says Wet/Dry and has no observation dates. Keep the date mapping unresolved and do not assign dates to season-specific values until the source conflict is clarified.
- **Disposition:** Added a source review and registry entries only. No app species rows, diet claims, validated reach or boundary geometry, current-presence claims, or public projection were added. CC BY permission enables attributed research extraction; it does not verify station identity, taxonomy, or app readiness.
- **Next:** Resolve season/date mapping with the authors or a primary source; review source-era names against an independent fish-taxonomy authority; verify ARB station points and the Dalapurip/Dalupirip and San Roque locality crosswalks. Then prepare a separately reviewed historical station-level batch while keeping CALABARZON work active and expanding freshwater/lake/stream/wetland coverage in parallel.
- **Artifacts:** `national-agno-river-basin-fish-survey-review-20261030.json`; updated `sources.json` and research README. Taxonomy API response snapshots and the source archive remain ignored locally.
- **Sources:** [University of Glasgow dataset record](https://researchdata.gla.ac.uk/2287/), [Tenio et al. 2026 article and repository full text](https://eprints.gla.ac.uk/386293/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), [GBIF taxonomy interpretation](https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation).

### National rollout step 176: Agno River Basin sampling-point locality crosswalk — 30 October 2026

- **Method:** Interpreted the eight repository coordinates as WGS84 latitude/longitude as specified by the dataset README. Screened each point against a DPWH ArcGIS city/municipal boundary layer whose metadata credits a NAMRIA source digitally rectified by DPWH as of February 2022, then compared with one-off Nominatim reverse-geocoder results. Requested no boundary geometries; point queries are internal research checks only.
- **Crosswalk:** Seven point-level municipality/province associations broadly match the source labels. ARB3 and ARB4 fall in Itogon; ARB3's reverse geocoder returns Baloy/Tinongdan, while ARB4's returns Casban/Itogon. The dataset says Dalapurip and the paper says Dalupirip, still without an exact named-feature confirmation. ARB1, ARB2, ARB6, ARB7 and ARB8 agree at municipality/province level, though some reverse-geocoder results name smaller localities.
- **Conflict:** Both the DPWH-derived boundary screen and Nominatim place ARB5 (16.1056, 120.7019) in San Nicolas, Pangasinan; the dataset and article state “San Roque, San Manuel, Pangasinan.” The source's “San Roque Dam outflow” note does not resolve the point/locality conflict. Hold exact municipality and reach assignment for author or stronger map clarification.
- **Source limits and rights:** The DPWH service describes derived municipal extents and its reviewed metadata states no reusable license; it is not treated as a legal/cadastral authority and its geometries were not retained. Nominatim returns the closest suitable indexed OSM object, not necessarily an exact address; OSM attribution/ODbL terms and the public endpoint's strict rate policy apply. Responses are hashed under ignored local research storage.
- **Disposition:** No station coordinate was moved, no reach or boundary geometry was added, and no species, current-presence, catchability, diet, access, legal, safety or public-app record was created. This check only prioritizes locality review.
- **Next:** Cross-check the held Agno taxon spellings and name statuses with an independent fish-taxonomy authority. Keep the ARB5 locality and wet/dry date mapping unresolved unless a primary source or author clarification settles them. Continue CALABARZON freshwater acquisition in parallel; no regional baseline is complete.
- **Artifacts:** `national-agno-station-locality-crosswalk-20261030.json`; updated `sources.json` and research README. Raw coordinate response bodies remain ignored locally.
- **Sources:** [Tenio et al. 2026 article/Table 1](https://researchonline.ljmu.ac.uk/id/eprint/28808/1/Diversity%20and%20distribution%20of%20freshwater%20fish%20in%20the%20Agno%20River%20Basin%2C%20northern%20Philippines.pdf), [DPWH City-Municipal Boundaries metadata](https://services1.arcgis.com/IwZZTMxZCmAmFYvF/ArcGIS/rest/services/City_Municipal_Boundaries/FeatureServer), [Nominatim reverse API](https://nominatim.openstreetmap.org/reverse), [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/), [OSM copyright and license](https://www.openstreetmap.org/copyright).

### National rollout step 177: Agno River Basin independent fish-name cross-check — 30 October 2026

- **Authority:** Reviewed five disputed labels against the California Academy of Sciences' Eschmeyer's Catalog of Fishes (online version updated 13 August 2026), then compared the authority with the article and released CSV. The catalog is a nomenclatural authority, not evidence that any study specimen was correctly identified.
- **Results:** Catalog current status supports *Pseudogobius javanicus* as a synonym of *Pseudogobius poicilosoma*, agreeing with the earlier CoL XR proposal; it validates *Oreochromis mossambicus* (Peters, 1852), *Poecilia reticulata* (Peters, 1859), *Poecilia sphenops* Valenciennes, 1846, and *Cyprinus carpio* Linnaeus, 1758. For the four source spelling/authorship discrepancies, the article and authority together support a linked normalization proposal while preserving every original source string and count.
- **Remaining holds:** The *Pseudogobius* specimen identification still needs voucher/author review. The *Poecilia sphenops* paper authority/year conflicts between Table 3 and Figure 2. Awaous sp., Barbodes sp. and Rhinogobius sp. remain genus-only. Other taxon names were not re-reviewed in this step.
- **Disposition:** Five current-name proposals recorded; zero source rows altered and zero species, diet, current-presence or public-app assertions added. ARB5's municipality/reach mismatch and the article-versus-repository wet/dry date conflict remain independent blockers.
- **Next:** Keep nomenclatural proposals linked to the verbatim source labels. Prepare a transparent, unsent clarification request for the study authors/repository covering season-date mapping and ARB5 station locality; do not assign dates or relocate the station absent primary-source clarification. Continue acquiring separate, reusable freshwater and coastal evidence for the wider Luzon rollout.
- **Artifacts:** `national-agno-taxonomic-authority-crosscheck-20261030.json`; updated `sources.json`, research README and Agno dataset follow-up links.
- **Sources:** [Eschmeyer's Catalog: *Pseudogobius javanicus*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=22454), [*Oreochromis mossambicus*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Oreochromis&species=mossambicus&tbl=species), [*Poecilia reticulata*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Poecilia&species=reticulata&tbl=species), [*Poecilia sphenops*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Poecilia&species=sphenops&tbl=species), [*Cyprinus carpio*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Cyprinus&species=carpio&tbl=species), [Tenio et al. article](https://researchonline.ljmu.ac.uk/id/eprint/28808/1/Diversity%20and%20distribution%20of%20freshwater%20fish%20in%20the%20Agno%20River%20Basin%2C%20northern%20Philippines.pdf), [University of Glasgow data record](https://researchdata.gla.ac.uk/2287/).

### National rollout step 178: Agno River Basin correction search and author inquiry draft — 30 October 2026

- **Primary-record check:** Re-read the University of Glasgow data record, article repository record and complete article PDF. The data record and README still map wet season to January 2022 and dry season to July 2021; article section 2.2 maps July to wet and January to dry; the fish-count matrix contains only Wet/Dry labels. No formal correction or supplementary-information reference was found in the reviewed article/repository materials. Exact-DOI/title web searches found no correction notice, but direct publisher-page access was unavailable, so this is not proof that none exists.
- **Other unresolved source labels:** The ARB5 coordinate/locality disagreement documented in step 176 and ARB4 “Dalapurip”/“Dalupirip” difference remain unresolved. This step preserves both and asks the corresponding author to confirm, rather than choosing a map-geocoder result.
- **Inquiry preparation:** Article page identifies K. F. C. Tenio as corresponding author. Created a transparent, concise draft asking about season-to-month mapping, the ARB5 WGS84 coordinate/site municipality, and the ARB4 spelling. The Glasgow record offers a “Request a correction” link, but it was not opened or submitted.
- **Disposition:** Draft only. No email, form or other message was sent; no season labels or station coordinates were changed; no species or app records were added.
- **Next:** Joseph may review and send the draft through his chosen channel. Continue other independently reusable freshwater sources while waiting; keep dates and station reach held unless clarified by a primary source.
- **Artifacts:** `national-agno-date-locality-clarification-search-20261030.json`; unsent `national-agno-clarification-request-draft-20261030.md`; updated `sources.json` and research README.
- **Sources:** [University of Glasgow data record](https://researchdata.gla.ac.uk/2287/), [University of Glasgow article record](https://eprints.gla.ac.uk/386293/), [article full text](https://researchonline.ljmu.ac.uk/id/eprint/28808/1/Diversity%20and%20distribution%20of%20freshwater%20fish%20in%20the%20Agno%20River%20Basin%2C%20northern%20Philippines.pdf), [article DOI](https://doi.org/10.1016/j.wsee.2026.05.001).

### National rollout step 179: Agno River Pangasinan macrofauna source review — 30 October 2026

- **Source and reuse:** Reviewed the Southeast Asian Journal of Science and Technology publisher page and article full text, with a Pangasinan State University mirror cross-check. The publisher record expressly states CC BY 4.0; attribution and modification notes are retained. No separate station dataset was found.
- **Scope and method:** Dantis and Lacap report sampling five Agno River stations, with three subsites per station, in June, August–September and November 2018. The article describes GPS mapping, but the reviewed full text does not expose coordinate values. Its species table is pooled across five stations, not a station-by-species matrix.
- **Freshwater boundary:** The article says high tides brought marine taxa into station 5 at Lingayen. Therefore the pooled list is mixed riverine/estuarine evidence and must not be treated as a freshwater-only list or assigned to an exact reach.
- **Source conflicts:** The publisher abstract allocates the 32 macrofauna as 23 fish, five crustaceans and four mollusks; article body/Table 1 says 23 fish, four crustaceans and five mollusks. Narrative prose also includes `Trichogaster sp.` absent from Table 1's 23 fish labels. Table names/authority years contain discrepancies requiring independent review.
- **Disposition:** Recorded the 23 verbatim Table 1 fish labels, kept the extra prose-only genus label separate, and recorded the source conflict. No normalized taxon, station-level presence, current-presence, diet, habitat, water geometry, legality, safety or app assertion was added. This is a historical lead only.
- **Next:** The independent name cross-check is recorded in Step 180. Seek original station coordinates or an author/institution clarification before making station-level claims; evaluate freshwater versus estuarine species separately.
- **Artifacts:** `national-agno-pangasinan-macrofauna-review-20261030.json`; updated `sources.json` and research README.
- **Sources:** [Dantis and Lacap article record and CC BY 4.0 statement](https://sajst.pti.edu.ph/online/index.php/sajst/article/view/254), [article full text](https://sajst.pti.edu.ph/online/index.php/sajst/article/download/254/219), [PSU institutional PDF mirror](https://main.psu.edu.ph/wp-content/uploads/2023/11/Aquatic-Macrofauna-Assessment-Along-Agno-River-in-the-Province-of-Pangasinan-Philippines.pdf), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### National rollout step 180: Agno/Pangasinan Table 1 fish-name taxonomy cross-check — 30 October 2026

- **Method:** Queried the GBIF v2 species matching service against the explicit Catalogue of Life Extended Release checklist (`7ddf754f-d193-4cc9-b351-99906754a03b`), recording each response and SHA-256. The pinned matching metadata identifies COL26.6 XR and build `84c77c88ffb12cad1691fc477f1b8856101ce1c4`. GBIF documents that `checklistKey` selects the taxonomy and otherwise defaults to the GBIF Backbone.
- **Results:** Of the 23 verbatim Table 1 labels, 21 produced exact species-level accepted usages, one spelling produced a variant match, and one exact name matched a synonym with an accepted usage. These matcher outcomes do not validate the fish identifications.
- **Name issues:** The table's `Sarotherodon melatheron` differs from the article narrative and matched as a variant of `Sarotherodon melanotheron`; `Cyprinus carpio` is printed with 1858 instead of the Catalog of Fishes authority year 1758; `Moolgarda pedaraki` remains unresolved because CoL XR and WoRMS use `Crenimugil pedaraki`, while the Catalog of Fishes' 13 August 2026 entry gives current status as synonym of `Moolgarda tade`. The separate prose spelling `Moolgarda pedaraka` was not treated as another taxon.
- **Disposition:** Preserved all 23 source labels and made zero automatic replacements. No specimen identity, station presence, current occurrence, diet, habitat, legal/safety statement, waterbody geometry, or public app row was added. The original pooled-survey, estuarine-influence and station-locality limitations remain.
- **Artifacts:** `national-agno-pangasinan-taxonomy-crosscheck-20261030.json`; updated `sources.json` and research README. Raw CoL XR responses remain in ignored local research storage with per-response hashes.
- **Next:** Seek the missing Agno station-locality evidence or author clarification, then evaluate candidates individually against station, salinity and source-reuse limits. Do not project the pooled species list to all of Pangasinan or the full river basin.
- **Sources:** [GBIF taxonomy interpretation and checklist selection](https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation), [CoL XR matching API](https://api.gbif.org/v2/species/match), [Catalog of Fishes: *Cyprinus carpio*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Cyprinus&species=carpio&tbl=species), [Catalog of Fishes: current *Moolgarda tade* status and *M. pedaraki* synonymy](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Moolgarda&species=tade&tbl=species), [WoRMS: *Moolgarda pedaraki* accepted as *Crenimugil pedaraki*](https://www.marinespecies.org/aphia.php?id=218891&p=taxdetails).

### National rollout step 181: Amburayan River, Kapangan macrofauna source review — 30 October 2026

- **Source and reuse:** Reviewed Garcia et al. (2018), *Open Journal of Marine Science* 8:323–354, DOI `10.4236/ojms.2018.83018`. The publisher page states CC BY 4.0; retain author, title, journal, pages, DOI, license attribution and mark any corrections. This license does not confer rights over the article's separately cited sources.
- **Freshwater scope:** The study concerns Amburayan River in Kapangan, Benguet/CAR and says its data gathering was concentrated in Barangay Cuba. It describes five stations, three sampling replications and a December 2014–February 2015 study period. The 2018 paper reports 14 macrofauna taxon entries (nine finfish, four crustacean and one gastropod), 5,216 individuals and 32.031 kg. These are historical source-reported totals, not a current or complete watershed inventory.
- **Spatial and identification limits:** The summary prints only a head endpoint for Station 1 and tail endpoint for Station 5, not individual station coordinates or a machine-readable site file. The article contains joined/variant spellings and genus-only labels. It says some samples were to undergo NFRDI DNA barcoding but later says the institute could not conduct that analysis due to unavailable reagents. Preserve the source text; no name is normalized or treated as voucher-verified.
- **Diet review:** The article gives ten qualitative food-web/diet statements, but they are not based on a described local gut-content study. Several are uncited, refer to Wikipedia without a corresponding reference, or contain bracketed-reference mismatches (including the eel, prawn and mosquito-fish claims). Crab diet references are broad or geographically/specifically mismatched. Keep every statement held for independent source review and separate natural-food evidence from bait recommendations.
- **Disposition:** Added an attributed source review and one registry reference only. No station-specific/current presence, species-level public assertion, diet, geometry, catchability, regulation, safety, or app row was added. The study cannot stand in for all of Amburayan River, Benguet or CAR.
- **Next:** Cross-check the nine finfish source labels against a current fish taxonomy authority without replacing source spellings; then investigate whether the authors, BFAR-CAR or NFRDI can provide voucher/identification certificates and individual station positions. Keep diet entries unapproved until their underlying sources and evidence methods are checked.
- **Artifacts:** `national-amburayan-kapangan-macrofauna-review-20261030.json`; updated `sources.json` and research README.
- **Sources:** [Publisher article and license notice](https://file.scirp.org/Html/1-1470421_84549.htm), [article DOI](https://doi.org/10.4236/ojms.2018.83018), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### National rollout step 182: Amburayan River finfish name-authority cross-check — 30 October 2026

- **Authority:** Reviewed the California Academy of Sciences' Eschmeyer's Catalog of Fishes, online version updated 13 August 2026, for the eight binomial candidates in Garcia et al. (2018); retained the source article's nine fish-group entries including the genus-only `Rhinogobius sp.`
- **Results:** Catalog current status supports eight species-level candidate names as valid. The article spells *Gambusia affinis* as `Gambussia` in the detail and *Oreochromis niloticus* as `nilotocus` in one numbered heading, while using corrected/abbreviated forms elsewhere. Preserved source forms and proposed no automatic replacement. `Rhinogobius sp.` remains unresolved above genus rank.
- **Locality anomaly:** The Catalog's brief *Lentipes armatus* range summary names the Ryukyu Islands, Taiwan and probably Cebu, not Benguet. This is a prompt to review source vouchers/diagnostics, not proof of absence; do not use the name crosswalk to assert the Amburayan fish identity.
- **Disposition:** Name-status check only. Zero specimen IDs, station occurrences, current presence, diet, geometry, or public app rows were verified or added. The prior source's location, survey-date, DNA-reagent and diet-reference limitations remain.
- **Next:** Seek voucher/specimen numbers, diagnostic photos, identification certificates, or author/BFAR-CAR/NFRDI clarification, prioritizing the *Lentipes armatus* locality and source spelling issues. Keep the local occurrence held; in parallel continue independently reusable river/lake evidence across northern Luzon.
- **Artifacts:** `national-amburayan-kapangan-taxonomy-crosscheck-20261030.json`; updated `sources.json` and research README.
- **Sources:** [Eschmeyer's Catalog: *Gambusia affinis*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Gambusia&tbl=species), [*Oreochromis niloticus*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Oreochromis&species=niloticus&tbl=species), [*Anguilla bicolor*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Anguilla&species=bicolor&tbl=species), [*Anguilla marmorata*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Anguilla&species=marmorata&tbl=species), [*Lentipes armatus*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Lentipes&tbl=species), [*Rhyacichthys aspro*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=45500), [*Glossogobius giuris*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=18735), [*Sicyopterus lagocephalus*](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=48470), [Amburayan article](https://file.scirp.org/Html/1-1470421_84549.htm).
