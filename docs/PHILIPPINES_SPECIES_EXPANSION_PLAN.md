# Bangwit: Philippines species expansion plan

Prepared: 22 October 2026; status updated 31 October 2026. Research foundation, local Taal checklist, Palico-Lian river evidence, a narrowly scoped Molawin Creek historical freshwater assertion, a corrected Laguna de Bay specimen assertion, four flagged Pansipit River specimen assertions, a corrected GBIF taxon-key audit, an NCR discovery checkpoint, one attributed Pasig River historical collection-event projection, and an L3 Central Luzon discovery checkpoint with a reviewed Bataan river source table, cross-study conflict review, and three historical Bulacan Manila Bay specimen assertions are in the repository. Follow-up L3 reviews include a GBIF station-proximity screen, a catalog-only review of the 2005 Pampanga River/Apalit thesis, and a held 2019 Cabiao river fish-and-diet study with a six-name nomenclature crosswalk; none added new species assertions. CALABARZON, NCR, Central Luzon and all other regional baselines remain incomplete. A national CC BY 4.0 hydrology source now supplies a 128-catchment spatial planning frame; the broader 770-basin PHD data and regional geometry overlay remain pending. These research updates do not constitute complete regional baselines or a production release.

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

### National rollout step 183: NFRDI *Lentipes armatus* Amburayan identification follow-up — 30 October 2026

- **Source:** Reviewed the official NFRDI landing-page metadata and indexed text from Tauli et al. (2022), *The Philippine Journal of Fisheries* 29(1):78–81, DOI `10.31398/tpjf/29.1.2020C0015`. Direct landing-page and PDF retrieval timed out in the web reader; the tracked review records this access limitation and retains no local copy.
- **Identification and site scope:** The paper reports 38 specimens (20 female, 18 male) examined morphometrically/meristically and two preserved tissue samples sent to the NFRDI Genetic Fingerprinting Laboratory. It reports a 100%-bootstrap Neighbor-Joining cluster and 0.5%/0.7% distances to reference *Lentipes armatus* sequences. Detailed methods say landed specimens were collected September 1–10, 2015 from Naguey, Atok and Cuba, Kapangan. Badeo, Kibungan was an enumerator observation, but the paper explicitly says there was no landed catch there; do not assign a sampled specimen to Kibungan.
- **Unresolved conflicts:** Methods state 2015 sampling, while Figure 2's caption says the photographed male and female were caught in Amburayan River in 2018. The 2018 Garcia et al. paper already lists *L. armatus* and 18 individuals, but the 2022 paper calls its material the first Amburayan/Cordillera record and does not reconcile that earlier source. It shares Garcia as coauthor and an NSAP/Amburayan context, so this is a stronger later identification report, not independent corroboration; do not assume same specimens or a correction to the 2018 ID.
- **Range interpretation:** The later local report addresses the Catalog of Fishes' short range summary that omitted Benguet. The Catalog summary is not a complete range polygon; the local paper is historical literature evidence with locality names, not coordinates, current presence, or a complete river distribution.
- **Rights and disposition:** The journal-wide policy states CC BY-NC 4.0; an item-specific license label was not visually verified because direct PDF retrieval failed. Keep source-derived content research-only until Bangwit's noncommercial/commercial use is reviewed. Do not reproduce figures or tables. No diet claim, geometry, current occurrence, or public app row was added.
- **Next:** Preserve Naguey/Atok and Cuba/Kapangan as historical source-reported sample sites with the date and prior-source conflicts attached. Keep Badeo/Kibungan as a reported observation with no landed catch. Continue with other northern Luzon freshwater sources; seek clarification on the conflicting dates and “first record” wording only if it becomes necessary for publication admission.
- **Artifacts:** `national-amburayan-lentipes-nfrdi-record-followup-20261030.json`; updated `sources.json` and research README.
- **Sources:** [Official NFRDI article record](https://nfrdi.da.gov.ph/tpjf/vol29/pp78-81), [official article PDF](https://www.nfrdi.da.gov.ph/tpjf/vol29/First%20Record%20of%20the%20Goby%20Lentipes%20armatus%20Sakai%20and%20Nakamura%201979%20Teleostei%20Gobiidae%20in%20the%20Amburayan%20River%20in%20Benguet%20Luzon%20Island%20Philippines.pdf), [journal-wide rights policy](https://www.nfrdi.da.gov.ph/tpjf/Policy.php), [Garcia et al. (2018)](https://file.scirp.org/Html/1-1470421_84549.htm), [Catalog of Fishes](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Lentipes&tbl=species).

### National rollout step 184: Ibulao River, Ifugao survey and erratum source review — 30 October 2026

- **Sources and access:** Directly downloaded and text-extracted the original Tauli et al. (2022) article and official Tauli et al. (2023) erratum PDFs from NFRDI; SHA-256 values are in the review artifact. The NFRDI repository record corroborates citation and abstract metadata. No raw PDFs or source tables were retained.
- **Study scope:** The source reports landed-catch monitoring from 2015–2019 at Lamut, Kiangan and Lagawe using NSAP methods. This is historical center-based evidence, not a whole-river, tributary or current checklist. The paper gives no center coordinates or reusable geometry.
- **Erratum effect:** The original yearly richness table labels its third center “Ifugao,” although the study names Lamut; the erratum table uses Lamut. The erratum adds molecular methods/results and a year-by-center species matrix. Its notice says it corrects an error but does not state exactly which text/table error is corrected. The original abstract says 11 families while the body and erratum say 12; leave the family count unresolved. The article states no Kiangan monitoring occurred in 2019 due to reduced NSAP enumerator funding; the missing value is not a zero-catch or absence record.
- **Taxon and molecular limits:** The original fish table has 18 rows, including four BFARCAR sample-code labels and genus-only `Nomorhamphus sp.`; do not report these as 18 independently verified species-level taxa. The carp label appears as `Carracius carracius` in original Table 1 and `Carrasius carrasius` in the erratum matrix. The erratum reports six barcode sample identities, but three `Zenarchopterus philippinus` percent-identity values range from 92.11% to 94.14%, and the table supplies no linked study accessions or enough alignment detail for independent interpretation. Do not merge the `Ibulao 08/13` goby results into `BFARCAR_Bunog02_154` without an explicit mapping.
- **Rights and disposition:** Both PDF footers state CC BY-NC 4.0. The erratum landing HTML has a general CC BY 4.0 footer, but the specific PDF and journal policy say noncommercial; treat CC BY-NC 4.0 as controlling pending clarification. No text/table/matrix is reproduced in the research record. No taxonomic normalization, diet claim, current-presence claim, geometry or public app row was added.
- **Next:** Cross-check the source labels with current fish name authorities, preserving variants and sample-code distinctions. Keep the lower barcode identities and unclear sample crosswalk held; continue the national freshwater inventory using independently reusable sources while public-app use remains unapproved.
- **Artifacts:** `national-ibulao-ifugao-fish-survey-erratum-review-20261030.json`; updated `sources.json` and research README.
- **Sources:** [Official NFRDI article page](https://nfrdi.da.gov.ph/tpjf/vol29/pp90-95), [NFRDI repository record](https://repository.nfrdi.da.gov.ph/items/039a31e0-3fe3-43b4-a20c-898472ac74cb), [original article PDF](https://www.nfrdi.da.gov.ph/tpjf/vol29/Fish%20Species%20Composition%20and%20Distribution%20from%202015%20to%202019%20in%20the%20Ibulao%20River%20Ifugao%20Cordillera%20Philippines.pdf), [official erratum page](https://nfrdi.da.gov.ph/tpjf/erratum-TPJF_2912020C0016.php), [erratum PDF](https://nfrdi.da.gov.ph/tpjf/Fish%20Species%20Composition%20and%20Distribution%20from%202015%20to%202019%20in%20the%20Ibulao%20River%20Ifugao%20Cordillera%20Philippines.pdf), [journal policy](https://www.nfrdi.da.gov.ph/tpjf/Policy.php).


### National rollout step 185: Ibulao River source-name taxonomy cross-check — 30 October 2026

- **Method:** Queried the 14 source binomial strings (13 Table 1 binomials plus the erratum matrix carp variant) against GBIF v2 species matching with explicit Catalogue of Life Extended Release checklist key `7ddf754f-d193-4cc9-b351-99906754a03b`. The metadata response records the COL26.6 XR build and matcher build; per-query raw responses and SHA-256 hashes are in ignored research storage. Compared selected names to current Eschmeyer's Catalog of Fishes pages.
- **Matcher outcome:** Twelve non-carp binomial strings produced exact species-rank accepted COL XR usages. Both `Carracius carracius` and `Carrasius carrasius` returned no match. A separate `Carassius carassius` comparator is accepted in COL XR and the Catalog, but this is a spelling candidate only. `Nomorhamphus sp.` matched at genus rank only. The four BFARCAR codes were not sent to the matcher. These are taxonomy-service results, not specimen identification.
- **Authority conflict:** COL XR returns `Rhinogobius giurinus` as accepted. The Catalog of Fishes lists it as a synonym of `Rhinogobius similis`; it recognizes `R. similis` as valid. Preserve the source label and keep the local name crosswalk and two barcode identities unresolved. The source's 98.00–99.47% DNA identity values do not settle a taxonomic-authority difference.
- **Other held issues:** The Catalog currently recognizes `Plicofollis magatensis`, while recording earlier treatment as species inquirenda; this is nomenclatural context, not evidence that the Ibulao specimen is correctly named. The Catalog recognizes `Zenarchopterus philippinus`, but this does not explain the source's 92.11–94.14% barcode matches. No sequence accession or sample-to-table mapping was identified in the reviewed erratum.
- **Disposition:** Preserved every source label. Zero automatic name changes, specimen re-identifications, barcode validations, diet/current-presence claims, or app rows. Corrected the source registry's declared count from 240 to 243, matching its 243 actual entries after adding this authority reference.
- **Next:** Search for a linked GenBank/BOLD sequence accession or explicit author/NFRDI mapping for the six barcode rows. If unavailable, keep molecular labels held and continue with independently reusable CAR freshwater evidence.
- **Artifacts:** `national-ibulao-taxonomy-crosscheck-20261030.json`; updated `sources.json` (243 actual entries), research README and this plan.
- **Sources:** [GBIF taxonomy interpretation and checklist selection](https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation), [GBIF COL XR matching API](https://api.gbif.org/v2/species/match), [Catalog of Fishes: `Rhinogobius giurinus`](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=18989), [`Carassius carassius`](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=3101), [`Plicofollis magatensis`](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=53678), [`Zenarchopterus philippinus`](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=31803).


### National rollout step 186: Ibulao barcode accession and public-index link search — 30 October 2026

- **Source check:** Re-downloaded the official NFRDI erratum PDF to temporary storage and confirmed its SHA-256 matches the exact version reviewed in step 184. The extracted Table 2 has a `GENBANK` column header; its six sample rows expose sample code, percent identity and name text, but no accession strings. The extraction cannot rule out a PDF link annotation or a value that is not represented in text, so this is an author/publisher clarification target. The temporary PDF was not retained.
- **NCBI checks:** Queried Nucleotide for free-text `Ibulao` and the article DOI; both returned zero records. Free-text `Ibulao` in SRA and BioProject also returned zero. A Nucleotide positive-control query for `Anguilla marmorata[Organism]` returned 2,331 taxon-level records, showing the endpoint was responding; these do not identify the study samples. Exact response snapshots and SHA-256 values are in ignored raw research storage.
- **Interpretation:** No public sequence accession, linked project, or sequence-to-sample crosswalk was located in this bounded NCBI search. This does not prove that the sequences were never deposited: they may be unindexed by Ibulao/title, associated with other metadata, private, or deposited in another archive. BOLD was not queried.
- **Disposition:** Zero DNA records downloaded, zero barcode identities validated or changed, and zero app rows added. Preserve the six erratum assignments as source-reported and unresolved; in particular the Catalog of Fishes versus COL XR status conflict for the two `Rhinogobius giurinus` labels remains open.
- **Next:** Prepare an unsent author/NFRDI clarification asking for accession IDs or confirmation that none were deposited, per-sample sequence identifiers and alignments, and the crosswalk between Ibulao 08/13 and `BFARCAR_Bunog02_154`. Continue independent freshwater acquisition in parallel.
- **Artifacts:** `national-ibulao-sequence-accession-search-20261030.json`; updated the Ibulao source registry entry, NCBI source reference, sources README and expansion plan. Registry now has 244 entries.
- **Sources:** [Official NFRDI erratum](https://nfrdi.da.gov.ph/tpjf/erratum-TPJF_2912020C0016.php), [official erratum PDF](https://nfrdi.da.gov.ph/tpjf/Fish%20Species%20Composition%20and%20Distribution%20from%202015%20to%202019%20in%20the%20Ibulao%20River%20Ifugao%20Cordillera%20Philippines.pdf), [NCBI E-utilities documentation](https://www.ncbi.nlm.nih.gov/books/NBK25501/), [NCBI APIs](https://www.ncbi.nlm.nih.gov/home/develop/api/).

### National rollout step 187: Ibulao barcode and reuse clarification draft — 30 October 2026

- **Preparation:** Created a transparent, unsent message to the journal office asking whether the six reported DNA-barcode samples have GenBank accessions, whether sample codes map to sequence/tissue/voucher records, and whether Ibulao 08/13 map to `BFARCAR_Bunog02_154`.
- **Project transparency:** The draft identifies Bangwit as an independent early-stage project with a Philippines-wide phased goal, states that no Ibulao species or DNA rows are published in the app, and discloses that the app may eventually have a revenue-generating model. It asks the journal to clarify the article/erratum and separate sequence-data reuse terms before any use.
- **Disposition:** Draft only. No message, email, request form or permission inquiry was sent. The saved draft includes the user's selected project contact and remains for Joseph to review before sending. No species identification, current presence, diet or app row was changed.
- **Artifact:** `national-ibulao-author-clarification-draft-20261030.md`; linked from the research README. No additional source was added to `sources.json`.
- **Sources:** [Official NFRDI article record](https://nfrdi.da.gov.ph/tpjf/vol29/pp90-95), [official erratum record](https://nfrdi.da.gov.ph/tpjf/erratum-TPJF_2912020C0016.php), [NFRDI journal rights policy](https://www.nfrdi.da.gov.ph/tpjf/Policy.php).

### National rollout step 188: NFRDI NSAP Interactive Atlas freshwater coverage and access review — 30 October 2026

- **Atlas scope:** Official NFRDI search-indexed descriptions say the public Interactive Atlas provides the latest available monitored landed-catch information and standardized regional catch data. Its program overview describes collection at landing sites and stock time-series by fishing ground. These are fishery-monitoring products, not a complete species-distribution checklist or catchment inventory.
- **Freshwater evidence:** Official NFRDI search-indexed text for a separate inland-fisheries feature reports NSAP monitoring expansion to rivers in CAR and Lake Mainit, and names Lake Naujan and Lake Bato for focused inland monitoring in 2025–2026. It does not identify Ibulao stations or taxa, link these inland data to the public atlas, or expose a record-level dataset.
- **Access and reuse:** The Interactive Atlas root timed out both the web page reader and a direct 20-second HTTP request on 30 October 2026. This does not prove the app is unavailable to ordinary users; it prevented review of its filters, exports, current data dates and terms in this pass. No export or dataset was acquired. The reviewed descriptions provide no item-specific redistribution license.
- **Disposition:** Added three official references and a bounded access/scope review. No species, occurrence, catch, abundance, diet, geometry or public app row was added; no data were scraped or redistributed.
- **Next:** Continue with independently accessible inland studies and data products, while retaining the atlas as a potential discovery/contact route. If it becomes accessible, inspect its public filters and documented exports, then ask NFRDI about CAR river records and their reuse terms before relying on them.
- **Artifacts:** `national-nfrdi-nsap-atlas-freshwater-coverage-review-20261030.json`; updated `sources.json` (247 references), the research README, and this plan.
- **Sources:** [NFRDI NSAP Atlas launch description](https://nfrdi.da.gov.ph/2022/02/14/nsap-interactive-atlas-launched/), [NFRDI NSAP program overview](https://nfrdi.da.gov.ph/national-stock-assessment-program-nsap/), [NFRDI inland fisheries and NSAP expansion feature](https://nfrdi.da.gov.ph/2025/08/28/feature-sustaining-inland-fisheries-da-nfrdis-science-driven-solutions/).

### National rollout step 189: Benguet multi-river fish survey source review — 30 October 2026

- **Source and scope:** Reviewed Bestre, Lumiquio and Napaldet (2018), *Journal of Wetlands Biodiversity* 8:59–85, through the official Museum of Brăila archive link and full article. It reports a June 2008–December 2009 freshwater survey, 13 fish taxa, and associated shells and macrofauna across Benguet rivers and Ambuklao Dam. It is a historical regional survey, not current or exhaustive provincial coverage.
- **Sampling limits:** Methods describe 11 sampling sites, selected to avoid rivers considered heavily affected by pollution, but the analysis lists 12 units (11 river labels plus Ambuklao Dam). The relationship between those units and sites is unresolved. Captured specimens were supplemented by fisher interviews for validation and species not caught, with no per-taxon/per-site method crosswalk. The paper says specimens were deposited at Benguet State University but gives no catalogue numbers; its map does not provide machine-readable station coordinates.
- **Reuse and disposition:** No article-specific open license or reproduction permission was identified in the inspected PDF, official archive, or author instructions. Species tables and images were not transcribed or copied. Added a source-scope review only: no normalized species, occurrence, present-day status, diet, geometry, or public app row was added; publication approval remains false.
- **Next:** Prepare an unsent inquiry to the authors/BSU for the site-to-waterbody crosswalk, capture-versus-interview provenance, voucher/catalogue references, and table/data reuse terms. In parallel, continue reviewing regional freshwater sources with clear, item-level permissions.
- **Artifacts:** `national-benguet-rivers-bestre-2018-source-review-20261030.json`; updated `sources.json` (248 references), the research README, and this plan.
- **Sources:** [Full article PDF linked by the official archive](https://www.muzeulbrailei.ro/uploads/img/stiintele-naturii/Volume%208/04JWB2018085985WEB.pdf), [official Journal of Wetlands Biodiversity archive](https://www.muzeulbrailei.ro/stiintele-naturii/publicatii-stiintifice-4/), [journal author instructions](https://www.muzeulbrailei.ro/images/naturale/11InstructiuniEN.pdf).

### National rollout step 190: Benguet river survey author clarification draft — 30 October 2026

- **Preparation:** Drafted a transparent inquiry to the corresponding-author address printed in the article. It asks for the 11-site-to-12-unit crosswalk, captured-specimen versus interview provenance, site/date-resolved evidence, Benguet State University voucher accessions, and the applicable public-app/table/image reuse terms.
- **Project transparency:** The message says Bangwit is an independent early-stage project with a phased Philippines-wide goal, that no Benguet article-derived rows are published in the app, and that the app may eventually have a revenue-generating model.
- **Disposition:** Draft only. No email, request form or permission inquiry was sent. No table or image was copied and no app data changed.
- **Artifact:** `national-benguet-rivers-author-clarification-draft-20261030.md`; linked from the research README. No new source registry entry was needed.
- **Source:** [Article PDF and corresponding-author email](https://www.muzeulbrailei.ro/uploads/img/stiintele-naturii/Volume%208/04JWB2018085985WEB.pdf).

### National rollout step 191: Cordillera asar/NSAP catch article review — 30 October 2026

- **Source and reuse:** Reviewed Tauli et al. (2018), *Journal of Marine Science Research and Oceanography* 1(1), DOI `10.33140/JMSRO.01.01.2`. The publisher page states CC BY 4.0 for the article. This does not independently establish rights to the underlying NSAP database or catch exports.
- **Coverage and method:** The study reports 2015 gear-specific catch/effort from six municipal landing centers and says the data came from NSAP-CAR enumerators/database. The abstract places the centers along Amburayan, Abra and Apayao-Abulug; methods discuss Amburayan, Abra, Apayao and Chico fishing grounds, without a complete center-to-river table. It is not a whole-river checklist or all-gear catch record.
- **Material conflicts:** Abstract says 26 aquatic-animal species; results say 27 fish plus five freshwater prawns; Table 1 totals 25 genera and 26 species while including crustacean families. The abstract reports 5.5% share while results give 5.56%. The inclusion of Chico in the 2015 composition analysis is unclear. No complete scientific-name list, center-by-species table, station coordinates, or reusable geometry is supplied in the reviewed four-page PDF.
- **Disposition:** Registered the article as a historical discovery/source lead. No species, occurrence, catch total, diet, spatial assignment or public app row was admitted because the contradictions and underlying-data provenance need reconciliation. No raw NSAP extract was downloaded.
- **Next:** Prepare an unsent author/NFRDI inquiry requesting corrected counts, the six-center table and site mapping, and the license for the underlying dataset separately from the CC BY article. Continue other freshwater sources in parallel.
- **Artifacts:** `national-car-asar-nsap-catch-review-20261030.json`; updated `sources.json` (249 references), the research README, and this plan.
- **Sources:** [Publisher article page and CC BY 4.0 notice](https://www.opastpublishers.com/peer-review/asar-a-distinct-fishing-gear-used-in-the-cordillera-rivers-1887.html), [full article PDF](https://www.opastpublishers.com/open-access-articles/asar-a-distinct-fishing-gear-used-in-the-cordillera-rivers.pdf), [2018 issue listing and DOI](https://www.opastpublishers.com/table-contents/jmsro-volume-1-issue-1-year-2018).

### National rollout step 192: Cordillera asar/NSAP data and count clarification draft — 30 October 2026

- **Preparation:** Drafted a transparent inquiry to the corresponding author email printed in the article. It asks for reconciled fish/prawn counts, the Chico-versus-three-river coverage, the six-center river crosswalk, an available catch table/export with dates and units, taxonomic support, and the underlying NSAP data license.
- **Project transparency:** The draft identifies Bangwit as an independent early-stage project with a phased Philippines-wide goal, says no asar article-derived rows are live, and discloses possible future revenue generation so that any reuse terms can be assessed against the intended use.
- **Disposition:** Draft only. No email, form, NSAP data request, or permission inquiry was sent. No app species or catch row was added.
- **Artifact:** `national-car-asar-author-clarification-draft-20261030.md`; linked from the research README. No new source registry entry was needed.
- **Source:** [Article PDF and corresponding-author email](https://www.opastpublishers.com/open-access-articles/asar-a-distinct-fishing-gear-used-in-the-cordillera-rivers.pdf).

### National rollout step 193: Abra and Ilocos Sur four-river edible-fauna source review — 30 October 2026

- **Source and historical scope:** Reviewed Segismundo and Felicitas (2009), *UNP Research Journal* XVIII:15–26, from the publisher-hosted full PDF and Philippine EJournals record. The article reports a descriptive inventory conducted April–November 2001 in Baay, Malanas and Tineg Rivers (Abra) and Burgos River (Ilocos Sur). It states one collector per river, five days a week for eight months, and that samples were sent to the National Museum Zoological Laboratory for identification.
- **Reported evidence:** The paper reports 21, 14, 13 and 19 fish, respectively, for Baay, Malanas, Tineg and Burgos, alongside separate edible-invertebrate totals. Those combined edible-fauna richness totals are not fish-only. Some fish were unidentified, and no specimen accession crosswalk was found.
- **Resolution and rights:** The review found no item-specific open license. The current journal copyright page is not assumed to establish retroactive terms for this 2009 article. The paper supplies no coordinates or site geometry; “Burgos River” is not independently resolved to a unique hydrographic feature. Text-extracted table names need page-image and current-authority verification before any taxon use.
- **Disposition:** Registered as a historical research lead only. No table or figure was copied; no fish assertion, diet claim, geometry or public app row was added. The study does not establish current presence or full river/catchment coverage.
- **Next:** Continue the northern-Luzon freshwater evidence sweep with the historical Apayao watershed-mapping and Abra taxonomy abstracts, while seeking contemporary, reusable site-level data in parallel.
- **Artifacts:** `national-abra-ilocos-2001-river-edible-fauna-review-20261030.json`; updated `sources.json` (250 references), the research README and this plan.
- **Sources:** [Full article PDF](https://vector.unp.edu.ph/index.php/1/article/download/223/209/1036), [Philippine EJournals record](https://ejournals.ph/article.php?id=6864), [journal submissions and copyright notice](https://vector.unp.edu.ph/index.php/1/about/submissions).

### National rollout step 194: Apayao watershed-mapping and Abra freshwater-abstract review — 30 October 2026

- **Source:** Reviewed three freshwater abstracts in the official ISSAAS Volume 16, Number 2 full issue: an Apayao fish/shell habitat-mapping project, an Abra fish/mollusk taxonomy project and an Abra river macroflora/macrofauna diversity study. The volume reports a 2010 congress; these are not established fieldwork dates.
- **Apayao lead:** The mapping abstract reports four named watersheds, 18 upstream/midstream/downstream stations and ten AutoCAD maps, but the issue exposes no station coordinates, map files, field dates, taxon-by-station list or vouchers. Its “endemic” and water-quality statements lack enough details here for app claims.
- **Abra leads:** The taxonomy abstract claims 16 fish taxa from Abra-system tributaries but repeats `Anguillidae sp.` in its list; it also duplicates `Melanoides sp.` among the shell taxa. The second abstract describes macroflora/macrofauna collection along Lagayan and Lagangilang River banks, not a fish-specific checklist.
- **Rights and disposition:** ISSAAS offers free access to the issue, but no item-specific data/map reuse license was found. The standalone abstract URL linked by the archive returned Page Not Found; the official-domain full-issue PDF was accessible. No abstract list or map was copied into the app; no species, safety/water-quality, geometry or public row was added.
- **Next:** Locate underlying reports or author-held materials through Apayao State College and Abra State Institute of Sciences and Technology; request station/map files, field dates, full taxa/voucher crosswalks and distinct reuse terms for data, maps and articles. Keep the current results as discovery leads only.
- **Artifacts:** `national-car-apayao-abra-2010-freshwater-abstracts-review-20261030.json`; updated `sources.json` (251 references), the research README and this plan.
- **Sources:** [ISSAAS full issue PDF](https://issaasphil.org/wp-content/uploads/2020/02/J-Issaas-v16n2-Dcember-2010-Full-Journal.pdf), [Volume 16, Number 2 archive page](https://issaas.org/journal/v16/02/), [journal archive listing](https://issaas.org/journal/issues.html), [About the Journal](https://issaasphil.org/about-the-journal/).

### National rollout step 195: Apayao and Abra institutional archive screen and request drafts — 30 October 2026

- **Apayao archive screen:** The current ASC site exposes completed-research lists for 2022–2025 and local journal issues for 2019–2021; the exact 2010 fish-and-shell mapping project, its 18-station table and AutoCAD maps did not surface in a bounded official-domain search. ASC's RDE office identifies a current Research & Special Projects director but publishes no project-specific contact email on that page.
- **Abra archive screen:** The official University of Abra menu links to a Research Hub that requires login. Its linked SSARJ host returned a gateway error in this review. The current official directory lists the Research, Development and Planning director and the 2010 abstract author, but the underlying reports did not surface in the bounded official-domain search. These access/search limits do not establish that the institutions lack the materials.
- **Follow-up prepared:** Added two transparent institution-specific inquiry drafts requesting complete reports, station and river crosswalks, field dates, corrected taxa, vouchers, map source files and separate reuse terms for report text, maps, data and images. The drafts identify Bangwit as an independent early-stage project with a phased Philippines-wide freshwater/marine scope and disclose possible future revenue. Signature addresses remain placeholders.
- **Disposition:** Drafts only; no email, form or contact was sent. No raw institutional file was downloaded, no taxa or map copied, and no app species, occurrence, geometry, water-quality or safety row was added. Publication approval remains false.
- **Artifacts:** `national-car-apayao-abra-institutional-archive-screen-20261030.json`; `national-car-apayao-abra-research-materials-request-draft-20261030.md`; updated `sources.json` (252 references) and research README.
- **Sources:** [ASC RDE office](https://asc.edu.ph/office-of-the-vice-president-for-academics-research-development-and-extension-services/), [ASC completed researches](https://asc.edu.ph/2025-completed-researches/), [ASC local research journal](https://asc.edu.ph/apayao-state-college-local-research-journal/), [University of Abra Research page](https://asist.edu.ph/research/), [University of Abra officials](https://asist.edu.ph/list-of-officials/), [ISSAAS abstracts in the full issue](https://issaasphil.org/wp-content/uploads/2020/02/J-Issaas-v16n2-Dcember-2010-Full-Journal.pdf).

### National rollout step 196: Apayao 2025 agri-fishery database project lead — 30 October 2026

- **Discovery:** ASC's 2025 completed-research list names “Development of Database Covering Agri – Fishery in the Province of Apayao” at positions 14 and 64. It supplies no authors, abstract, schema or dataset link. The duplicate title is one lead unless ASC confirms distinct projects.
- **Access and scope:** The linked official Research Abstracts page timed out in the web reader and returned HTTP 403 to a direct request from this review environment. No abstract or database export was accessed. The title could refer to administrative, production or aquaculture records rather than wild fish observations; fish-species content is unverified.
- **Follow-up:** Expanded the unsent ASC inquiry to ask for authors, project scope, data dictionary, wild-versus-cultured distinction, record provenance, taxonomic authority, dates/locality precision and separate reuse terms. The lead is not treated as occurrence evidence.
- **Disposition:** No dataset downloaded; no taxon, species, occurrence or geometry rows added; publication approval remains false. No email or form was sent.
- **Artifact:** `national-apayao-agri-fishery-database-lead-review-20261030.json`; updated the source's review-file list, institutional request draft, source README and this plan. The source count remains 252 because this is an additional finding from the already registered ASC pages.
- **Source:** [ASC 2025 completed-researches page](https://asc.edu.ph/2025-completed-researches/); linked but unavailable [2025 Research Abstracts page](https://asc.edu.ph/research-abstracts/); [ASC RDE office](https://asc.edu.ph/office-of-the-vice-president-for-academics-research-development-and-extension-services/).

### National rollout step 197: Apayao 2009 ISSAAS freshwater abstracts — 30 October 2026

- **Source type:** Reviewed two abstracts in the convention-summary section of the official *Journal of ISSAAS* Volume 15, Number 2 (December 2009). FAO AGRIS classifies the fish-and-shell item as a conference summary. The archive offers the issue for free download; no item-specific license for either abstract or underlying records was found. Free access is not treated as reuse permission.
- **Fish/shell lead:** Manicad and Gutierrez describe field survey, interviews and photo documentation, and print 16 vernacular labels under a combined native fish-and-shell statement for provincial freshwater habitats. The list cannot be divided into fish vs. shell organisms, is not a count of verified fish species, and has no scientific-name authority, field dates, named localities, voucher numbers or photo-to-label crosswalk.
- **River lead:** A separate Gutierrez and Manicad abstract names Acutan, Nabuangan, Barren, Cabicungan, Laco, Karagawan, Nagan, Binuan, Zumigue and Ziwanan rivers. It gives a generic statement that fish and shell inhabit the rivers but names no taxa, stations, dates or coordinates. These names are research leads, not verified hydrographic identities or river-wide ranges.
- **Independence and safety:** The abstracts share authors, institution and issue; their fieldwork relationship is unknown, so do not count them as independent surveys. The historical summary of water-analysis results is not a current safety or pollution assessment. No taxa, occurrence, diet, geometry, rules, safety advisory or app row was added.
- **Follow-up:** Ask ASC for the underlying report, dates, stations, local-name language/community context, fish/shell category, taxonomic determinations, vouchers and image links; clarify whether both abstracts share fieldwork, and request separate reuse terms for text, photographs, data and maps. The existing inquiry remains an unsent draft.
- **Artifacts:** `national-apayao-2009-fish-shell-river-abstracts-review-20261030.json`; two ISSAAS source entries; updated sources registry (254 references), research README, and unsent Apayao inquiry draft.
- **Sources:** [Official full issue PDF, pp. 163 and 166](https://issaasphil.org/wp-content/uploads/2020/02/J-Issaas-v15n2-December-2009-Full-Journal.pdf), [ISSAAS issue listing](https://issaas.org/journal/issues.html), [FAO AGRIS summary](https://agris.fao.org/search/ru/records/647369b42c1d629bc980a7c6), [About the Journal](https://issaasphil.org/about-the-journal/).

### National rollout step 198: GBIF text-field screen for Apayao river-name leads — 30 October 2026

- **Query scope:** Queried all ten river names printed in the 2009 Apayao abstract. Each exact label was searched in both GBIF indexed occurrence fields `waterBody` and `locality`: 20 queries total, with `country=PH`, CoL XR Actinopterygii `taxonKey=8VR36`, checklist `7ddf754f-d193-4cc9-b351-99906754a03b`, and `limit=0` (count only; no record payloads requested).
- **Result:** All 20 requests returned HTTP 200 and count zero. A Laguna de Bay `waterBody` query under the same filters returned count 22 as a positive query-path control. The control is not an Apayao record and was not enumerated or reviewed.
- **Limitations:** This is an exact indexed-text screen, not an ecological survey or evidence of absence. The source names have unresolved spellings, aliases and river identities; coordinates, geometry, alternate terms, unlinked/locality variants and shell/non-fish groups were not covered. No underlying dataset license was evaluated because no records were retrieved.
- **Disposition:** No record was downloaded, and no fish/species, occurrence, waterbody geometry, safety, diet, catchability or public app row was added.
- **Artifacts:** `national-apayao-river-name-gbif-field-screen-20261030.json`; updated `sources.json` (255 references), research README and this plan.
- **Sources:** [GBIF Occurrence API documentation](https://techdocs.gbif.org/en/openapi/v1/occurrence), [recorded Laguna de Bay query control](https://api.gbif.org/v1/occurrence/search?country=PH&checklistKey=7ddf754f-d193-4cc9-b351-99906754a03b&taxonKey=8VR36&limit=0&waterBody=Laguna+de+Bay), [2009 ISSAAS Apayao abstract issue](https://issaasphil.org/wp-content/uploads/2020/02/J-Issaas-v15n2-December-2009-Full-Journal.pdf).

### National rollout step 199: Apayao official fisheries statistics and vernacular-name crosscheck — 30 October 2026

- **Sources reviewed:** PSA Cordillera's Apayao fisheries situation release (Q3 2019–2021, released 2022-01-28); the DA-SAAD Apayao profile attributing fisheries context to PSA; and the Apayao Provincial Government tourism/cuisine page. No item-specific reuse grant was verified; full tables, prose and imagery were not copied.
- **Production context:** PSA reports 58.13 MT total Apayao fisheries production in 2021 Q3, comprising 18.10 MT inland municipal and 40.03 MT aquaculture. Tilapia production was 39.95 MT, or 99.8% of aquaculture output. This is aquaculture production, not evidence that tilapia dominates wild river assemblages. Inland categories include carp, Hito, Kanduli, Igat, Biya, Dalag and other fishes, but no scientific identities, stations, vouchers or waterbody links.
- **Local-name screen:** The provincial cuisine page links `kiwat` with eel in a sinursur context and `Palilang` with a local goby in a sagket context. It does not establish equivalence with the distinct 2009 ISSAAS string `palileng` or PSA statistical group `Biya`. All remain unlinked pending community/language and taxonomic or voucher-backed review.
- **Disposition:** Production statistics are not occurrence records; no fish taxa, occurrence, diet, geometry, safety, catchability or public-app rows were added. `national-apayao-fisheries-statistics-local-name-screen-20261030.json` records source-specific interpretation and reuse limits. The three references were added to `sources.json` (258 references), and the current ASC inquiry draft notes the unresolved name crosswalk. No inquiry was sent.
- **Sources:** [PSA Apayao fisheries situation report](https://rssocar.psa.gov.ph/system/files/attachment-dir/Special%2520Release%2520on%2520Fisheries%252C%2520Apayao%2520Province%252C%2520Jul-Sep%25202019-2021%2520%252828Jan2022%2529.pdf), [DA-SAAD Apayao profile](https://saad.da.gov.ph/covered-areas/phase-1/apayao/), [Apayao Provincial Government tourism cuisine](https://apayao.gov.ph/tourism/cuisine), [2009 ISSAAS issue](https://issaasphil.org/wp-content/uploads/2020/02/J-Issaas-v15n2-December-2009-Full-Journal.pdf).

### National rollout step 200: Apayao annual production trend through 2022 — 30 October 2026

- **Source:** PSA Apayao Provincial Statistical Office, *Fisheries Situation Report, January to December: 2020-2022*, Special Release dated 20 June 2023, Reference 2023-CARAP-SR010. No item-specific reuse license was verified; full tables and figures are not republished.
- **Production context (metric tonnes):** All-sector totals were 241.05 (2020), 99.86 (2021), and 121.01 (2022). Inland municipal production was 130.95, 34.62, and 9.11; aquaculture was 110.10, 65.24, and 111.90. In 2022, aquaculture supplied 92.5% of production; the report attributes 111.31 MT to freshwater fishponds, 0.59 MT to fishcages, and 100.67 MT of tilapia to fishponds.
- **Interpretation:** This is production by subsector and broad category, not a fish-population census or site-level occurrence. Inland municipal production's 2021–2022 decline cannot be read as a wild population decline. Tilapia farm production is not evidence of river dominance. The report provides no scientific identity, station, voucher, or named-waterbody crosswalk.
- **Disposition:** Added the report to the registry (259 references) and documented the figures/limits in `national-apayao-annual-fisheries-production-review-20261030.json`. No taxonomy, occurrence, geometry, diet, catchability, safety, or public app row was added.
- **Source:** [Official PSA Apayao annual report](https://rssocar.psa.gov.ph/system/files/attachment-dir/Special%2520Release%2520%2520Fisheries%252C%2520Apayao%2520%252C%2520Annual%25202021-2022%2520_20Jun2023.pdf).


### National rollout step 201: EMB-CAR Apayao river monitoring leads and data request — 30 October 2026

- **Discovery:** Official EMB-CAR indexed notices describe 2026 Q3 water-quality monitoring in Cabicungan, Zumigue, Ziwanan, Tumog, Nagan, Malunog and Apayao-Abulog rivers and a December 2024 Lower Apayao campaign listing Apayao-Abulug, Cabicungan, Malunog, Zumigue, Ziwanan, and Lower/Upper Nagan. Four 2026 labels overlap the ten-river 2009 ISSAAS abstract (`Cabicungan`, `Nagan`, `Zumigue`, `Ziwanan`); this does not prove that reaches or study stations are identical.
- **Retrieval boundary:** Direct fetch of the official 2026 and 2024 articles, and the 2019 Cordillera environment-report PDF, returned HTTP 403. Indexed text indicated named river lists and a historical Apayao-Abulog station table, but no station coordinates/results were admitted or copied. Confirm every detail against an accessible source before operational use.
- **Evidence meaning:** The notices concern water-quality monitoring, not fish sampling. No scientific names, specimen records, fish occurrences, habitat suitability, safety determination, legal boundaries or current water-quality values were inferred. Preserve source spellings `Apayao-Abulog` and `Apayao-Abulug` until an authoritative crosswalk is obtained.
- **Disposition:** Added `national-apayao-emb-river-monitoring-leads-20261030.json`, three EMB-CAR source references in `sources.json` (262 references), and the unsent `national-emb-car-apayao-river-data-request-draft-20261030.md`. No app, species, occurrence or geometry rows were added; no request was sent.
- **Sources:** [EMB-CAR 2026 Q3 Apayao rivers notice](https://car.emb.gov.ph/emb-car-conducts-3rd-quarter-water-quality-monitoring-and-sampling-of-apayao-rivers/), [EMB-CAR December 2024 Lower Apayao monitoring](https://car.emb.gov.ph/ams-conducts-water-quality-monitoring-and-sampling-of-lower-apayao-river/), [EMB-CAR 2019 State of Brown Environment report](https://car.emb.gov.ph/wp-content/uploads/2020/08/THE-FINAL-BROWN-ENVIRONMENT-REPRT-2019.pdf).


### National rollout step 202: GENED 2 Apayao freshwater EIS access review — 30 October 2026

- **Official project lead:** EMB's public-hearing listing links the Environmental Impact Statement and English summary for the proposed 250 MW GENED 2 Hydropower Project by Pan Pacific Renewable Power Phils. Corp. in Barangay Madatag, Kabugao, Apayao; the listed hearing date is 19 October 2023.
- **Indexed baseline excerpt:** Search-indexed EIS text describes an aquatic baseline at seven Apayao River stations (upstream, midstream and downstream), with field dates 10–13 January 2020. Full site design, fish methods, station identities, results and annexes remain unreviewed.
- **Interview-reported catch leads:** Nearby residents were reported to commonly catch pasayan (Macrobrachium sp.), eel (Anguilla sp.), tilapia (Oreochromis niloticus), hito/pantat (Clarias batrachus) and unspecified freshwater gobies. These are interview context, not a site-specific capture table; the scientific strings have not been independently validated against vouchers.
- **Access and disposition:** The official EIS PDF returned HTTP 403 through the web retrieval tool and a workspace HEAD request timed out. Search excerpts are discovery leads only. Added the EIS, English summary and official notice as registry references (265 total), a review artifact, and an unsent data-access draft. No taxa-by-station occurrence, geometry, diet, safety or public-app row was admitted; no reuse license was assumed.
- **Next:** Retrieve the full EIS and annexes; verify the actual fish-sampling method, station crosswalk and collected taxa separately from the interview list. Ask for attribution/reuse terms and any voucher or diagnostic documentation before admission.
- **Sources:** [EMB GENED 2 EIS](https://eia.emb.gov.ph/wp-content/uploads/2023/09/EIS-for-Public-Hearing_pan-pacific_gened-2-1.pdf), [English summary](https://eia.emb.gov.ph/wp-content/uploads/2023/09/ESP-English_Pan-pacific_gened-2-1.pdf), [EMB EIA public-hearing listing](https://eia.emb.gov.ph/?page_id=72).


### National rollout step 203: GBIF indexed-field screen of GENED 2 Apayao fish-name leads — 30 October 2026

- **Source strings screened:** Oreochromis niloticus and Clarias batrachus, the two exact scientific-name strings visible in the EIS interview-reported catch list. GBIF Species Match returned exact accepted matches with usage keys 4285694 and 5202683, respectively. This confirms a name match in GBIF's backbone, not the identity of an Apayao animal.
- **Query scope:** For each taxon, queried stateProvince=Apayao and locality values Apayao, Calanasan, Conner, Flora, Kabugao, Luna, Pudtol, Santa Marcela and Sta. Marcela; country was PH and limit=0. Repeated the 20 field-text queries with hasCoordinate=true and without that filter (40 field queries total). All returned HTTP 200/count zero. Philippines-wide controls were positive: 217/96 coordinate-bearing and 251/126 all records for the two respective taxa.
- **Interpretation:** These indexed-text zeros do not prove fish absence. GBIF records may omit or differently spell locality fields; synonym searches, coordinate-based searches using verified station/province polygons, other datasets and offline museum records were not covered. The names remain interview evidence, not station-specific collected specimens.
- **Disposition:** One API screen reference was registered (266 sources); the artifact records all query URLs and positive-control counts. No occurrence payload was requested or reviewed, and no species, occurrence, geometry, diet, safety, catchability or public-app row was added.
- **Next:** Get the full GENED 2 EIS fish tables and station coordinates, then run an evidence-bounded crosswalk and occurrence search using verified station localities/coordinates. Keep GBIF zeros separate from absence claims.
- **Sources:** [GBIF Occurrence API documentation](https://techdocs.gbif.org/en/openapi/v1/occurrence), [recorded Oreochromis query](https://api.gbif.org/v1/occurrence/search?country=PH&stateProvince=Apayao&hasCoordinate=true&limit=0&taxonKey=4285694), [recorded Clarias query](https://api.gbif.org/v1/occurrence/search?country=PH&stateProvince=Apayao&hasCoordinate=true&limit=0&taxonKey=5202683).


### National rollout step 204: Apayao-Abulug basin master-plan and river-lead screen — 30 October 2026

- **Access:** The DENR FASPS E-Library catalog identifies the July 2014 Volume 2 Main Report. Its page says preview/download requires login or registration and a required visitor survey. No account was created and no survey was submitted. Direct PDF retrieval exceeded the web reader's 19,371,633-byte limit. Only a publicly search-indexed excerpt of Chapter 4, Table 4.1-1 was reviewed; this is not a complete report review.
- **Freshwater leads:** The indexed excerpt lists 18 Apayao waterbody names with “Perennial Secondary” classification and planning-function text: Awan, Ayayao, Baliwanan, Binuan, Dumayong, Dagara, Karagawan, Laco, Langnao, Malabanig, Maton, Nagan, Naguillan, Sicapo, Tawit, Tagbayan, Tumog and Malunog Rivers. Several are described as fish habitat. Names, municipal/headwater text and functions are preserved as source leads in `national-apayao-abulug-basin-master-plan-access-review-20261030.json`; they still need authoritative name, reach, catchment and locality crosswalks.
- **Evidence boundary:** “Fish Habitat” is a historical planning-document function, not a species observation, current habitat survey, abundance, safety result, fishery rule or proof of presence. No scientific taxa, occurrences, geometry, diet or public-app rows were added. The basin crosses CAR and Region II; evidence from Apayao does not automatically cover its lower reaches or mouth in Cagayan.
- **Unresolved spatial conflict:** The FASPS catalog summary reports 5,042 km² and sixth-largest, while DEPDev Cordillera's 2018 announcement reports 3,372 km², 175 km and ninth-largest. Neither summary supplies a reviewed technical delineation here. Do not choose a boundary or area until the controlling map/report, scale, CRS/datum, delineation method and revision are confirmed.
- **Disposition:** Added the FASPS catalog and DEPDev announcement as two registry references (268 total). The registry records access and reuse limits separately. An unsent inquiry requests an accessible report/map, technical boundary and crosswalk, aquatic survey appendices, and item-specific reuse terms. No request was sent and no publication permission was inferred.
- **Sources:** [DENR FASPS catalog](https://faspselib.denr.gov.ph/Materials/Detail/2c10c3f6-08d7-4d4f-a5ee-60e70a94bb37), [DEPDev Cordillera basin-plan announcement](https://car.depdev.gov.ph/apayao-abulug-river-basin-master-plan-endorsed-to-denr-for-adoption-implementation/).


### National rollout step 205: Tanglagan rice-terrace freshwater fish evidence review — 30 October 2026

- **Study:** Reviewed the full seven-page 2014 article, *Aquatic Biodiversity Analysis of Four Rice Terraces Clusters in the Cordillera Region, Northern Philippines*. Its abstract and methods describe four provincial clusters, each with rice-paddy and irrigation-canal/creek blocks, and ten randomly placed 1 m × 1 m quadrats per block (80 total). Tanglagan, Apayao is one cluster. Field sampling dates are not stated.
- **Apayao fish lead:** Tables 2 and 4 report “Million fish” in the Apayao paddy and canal/creek block columns. The methods print “Poecilla reticulata”; the current Catalogue of Life Extended Release entry supports *Poecilia reticulata* Peters, 1859 as the accepted spelling, but this spelling crosswalk does not verify the source specimens. The paper classifies its row as exotic; preserve that as the authors’ label only.
- **Precision limits:** Results are aggregated by site and block. No named creek/river, coordinates, field date, voucher, photo-to-taxon crosswalk, or per-quadrat records are supplied. The authors caution that random quadrats may miss mobile fish; a zero cell is not proof of absence. Treat this as a historical Tanglagan cluster-level research candidate, not as a dated river occurrence or current distribution claim.
- **Reuse:** The OJS record displays CC BY 4.0, the PDF front matter says CC BY-NC 3.0 Unported, and the publisher scholarly page says CC BY-ND-NC 4.0. These conflict. The registry records the discrepancy; no table values, maps, or full-text passages were reproduced, and no app use is approved pending clarification.
- **Disposition:** Added one registry reference (269 total) and `national-apayao-tanglagan-rice-terrace-aquatic-study-review-20261030.json`. No public species, occurrence, diet, geometry, safety, or catchability row was added. Continue seeking field dates, named-waterbody crosswalk, vouchers/photo records and controlling reuse terms; keep Apayao/CAR coverage incomplete.
- **Sources:** [Full article PDF](https://globaljournals.org/GJSFR_Volume14/3-Aquatic-Biodiversity-Analysis.pdf), [OJS article record](https://journalofscience.org/index.php/GJSFR/article/view/1408), [publisher scholarly page](https://globaljournals.org/scholarly-articles/aquatic-biodiversity-analysis-of-four-rice-terraces-clusters-in-the-cordillera-region-northern-philippines/), [GBIF accepted name](https://www.gbif.org/taxon/4KSF6).


### National rollout step 206: Four-cluster Cordillera freshwater fish screen — 30 October 2026

- **Coverage:** Screened the 2014 quadrat study's species rows across all four reported clusters in CAR: Asipulo, Ifugao; Natonin, Mountain Province; Bagumbayan, Kalinga; and Tanglagan, Apayao. Each site has rice-paddy and irrigation-canal/creek blocks. This is a single cluster per province, not province-wide coverage.
- **Positive block-level candidates:** The paper links the common label “Jojo fish” to printed “Anquilla japonica”; its row has positive blocks in Asipulo rice paddy and Bagumbayan rice paddy plus canal/creek. It reports *Gambusia affinis* (“Mosquito carp”) in Natonin rice paddy. It links “Million fish” to printed “Poecilla reticulata,” with positive blocks in both Asipulo blocks, Bagumbayan canal/creek, and both Tanglagan blocks. Accepted-spelling candidates already exist in the retained CoL XR match inventory for *Anguilla japonica*, *Gambusia affinis*, and *Poecilia reticulata*; this is nomenclatural support only, not specimen re-identification.
- **Limits:** No field dates, exact waterbody names, coordinates, vouchers, photos, or plot-level records. The authors warn that mobile fish may be under-sampled by quadrats; a zero cell is not absence. The Tanglagan discussion mentions an Indigenous lapat practice but provides no validated boundaries; do not map or expose a conservation area without community and agency validation.
- **Rights and disposition:** The same article's journal record, PDF front matter and publisher summary display different Creative Commons terms. No exact values, maps or numeric table content were copied. Added a follow-up research artifact and unsent author clarification draft; no new source reference, species assertion, occurrence, geometry or app row was added. CAR remains incomplete.
- **Artifacts:** `national-cordillera-rice-terrace-fish-cluster-screen-20261030.json`; `national-cordillera-rice-terrace-author-clarification-draft-20261030.md`.
- **Sources:** [Publisher-hosted article PDF](https://globaljournals.org/GJSFR_Volume14/3-Aquatic-Biodiversity-Analysis.pdf), [OJS article page](https://journalofscience.org/index.php/GJSFR/article/view/1408), [GBIF CoL XR accepted name for *Anguilla japonica*](https://www.gbif.org/taxon/66R7C), [*Gambusia affinis*](https://www.gbif.org/taxon/6K97T), [*Poecilia reticulata*](https://www.gbif.org/taxon/4KSF6).

### National rollout step 207: Cagayan–Chico freshwater eel cross-source screen — 30 October 2026

- **Sources and regional reach:** Reviewed the full 2007 Jamandre et al. molecular-phylogeny article and the official abstract for Hilario et al. (2022). The 2007 paper associates *Anguilla marmorata* with Chico River, Kalinga (CAR), and source-labelled *A. bicolor pacifica* / *A. bicolor bicolor* groups with Buguey River, Casili Creek and Abulug River in Cagayan (Region II). The 2022 official abstract reports a broad Cagayan River eel study with *A. marmorata*, *A. bicolor pacifica* and *A. luzonensis*; it does not provide station or reach detail.
- **Quality and rights limits:** The 2007 abstract says nine eels were DNA-sampled, but the methods say 24 were collected; the molecular subset is not reconciled. Its PDF contains no collection dates, coordinates, voucher accessions or specimen-to-sequence crosswalk. The 2022 full paper and field dates were not reviewed. The 2007 PDF states copyright by NUS and Academia Sinica without a specific reuse grant; the 2022 landing page did not establish item-specific reuse terms. No tables, maps or sequences were copied.
- **Disposition:** Added two registry references (271 total) and `national-cagayan-chico-anguilid-river-study-crosscheck-20261030.json`. No scientific-name crosswalk, occurrence assertion, geometry, diet/safety/catchability claim, or public-app row was admitted. These historical leads do not complete CAR or Cagayan Valley, and the Cagayan River's cross-region reach must be reconciled separately from administrative scope.
- **Sources:** [NUS-hosted 2007 article](https://lkcnhm.nus.edu.sg/app/uploads/2017/06/s14rbz07_Jamandre-pp51-59.pdf), [official UPLB/PAS 2022 article record](https://doi.org/10.62550/abc001021).

### National rollout step 208: Baggao freshwater sanctuary catch and boundary screen — 30 October 2026

- **Study and sites:** Reviewed Gibe et al. (2023), a full NFRDI repository article on three Baggao freshwater sanctuary sites: Hot Spring (Asinga-Via), Blue Water Falls (J. Pallagao), and Duba Cave (San Miguel). Interviews and key-informant interviews ran February–March 2022; Table 3 reports barangay fish production for 2020/2021, while Table 4 reports sanctuary-level composition for January–December 2021. BFAR Region 2's 2025 notice broadly confirms the named protected-area initiatives and describes a planned Pared River Catchment network.
- **Evidence limits:** Fish names are primarily genus-level labels, with photographs used as identification aids; the article supplies no specimen/voucher or individual capture-event crosswalk. Several source spellings conflict internally. The study distinguishes buffer-zone fishing from protected/no-take zones but provides no authoritative boundary geometry or complete ordinance. The BFAR notice is a management lead, not geometry, a rule determination, or a species record.
- **Rights and disposition:** The article states CC BY-NC 4.0; this review does not approve Bangwit reuse. Added two registry references (273 total) and `national-cagayan-baggao-freshwater-sanctuary-catch-review-20261030.json`. No numeric table values, map, species assertion, occurrence, geometry, diet, safety, fishing-permission, or public-app row was added. Cagayan Valley remains incomplete.
- **Next:** Seek official ordinances and technical sanctuary/buffer boundaries through accessible official sources, and keep the broader Region II inland-water sweep moving in parallel. Do not display fishing permissions or mapped no-take extents before authoritative boundary and rule review.
- **Sources:** [Official NFRDI article record](https://repository.nfrdi.da.gov.ph/items/4897f5c1-7cf4-4909-b8a3-e3cb132f5263), [full NFRDI article PDF](https://repository.nfrdi.da.gov.ph/bitstreams/b92bd873-10da-41db-add1-0afffb5a5cc5/download), [BFAR Region 2 notice](https://region2.bfar.da.gov.ph/2025/02/19/uk-ambassador-zsl-and-bfar-visit-conservation-site-in-baggao-cagayan/).

### National rollout step 209: NFRDI ludong COI sample and GenBank cross-check — 30 October 2026

- **Molecular result:** Reviewed Escaño et al.'s full 2022 NFRDI article. It reports COI analysis identifying all 25 retained sequences as *Cestraeus goldiei*. The analysis includes 20 newly sequenced fish plus seven NFRDI archive sequences (27 initial, 25 retained); only 18 new sample-code/accession rows appear in the final table, leaving two study samples unexplained.
- **Accession check:** Retrieved metadata for the 18 table-linked GenBank accessions. Organism, sample-code voucher qualifier, and collection date match the article rows. These are the same study's sequence submissions, not independent replication. The seven older archive accessions are excluded from the check because the printed strings are incomplete/ambiguous.
- **Locality conflict:** Four article rows identify samples LUD4, LUD5, LUD10, and LUD11 as Isabela Province; their GenBank `geo_loc_name` values say `Philippines: Cagayan`. The remaining Region II rows say `Philippines: Cagayan`; the Abra sample has only a CAR-level GenBank qualifier. Keep both values and do not place map points. Neither source provides coordinates or a named capture reach for every sample.
- **Rights and disposition:** The article states CC BY-NC 4.0. Added one registry reference (274 total) and `national-ludong-2022-nfrdi-genbank-crosscheck-20261030.json`. No table, sequence, map, species assertion, occurrence, geometry, legal rule, diet, safety, or public-app row was added; no app reuse is approved. Treat *C. goldiei* as a strong historical research candidate, not a basin-wide presence/absence conclusion.
- **Next:** Seek an author/agency sample-location crosswalk for the four Isabela conflicts and two omitted samples; continue Region II lake, river, estuary and headwater source screening in parallel.
- **Sources:** [Official NFRDI item](https://repository.nfrdi.da.gov.ph/items/405e7034-8af9-4801-b8c1-42dff5c103c9), [full NFRDI article PDF](https://repository.nfrdi.da.gov.ph/bitstreams/9dcc4a58-f0f4-4b61-b14b-ce2ed35640bf/download), [NCBI GenBank API metadata query](https://api.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=ON406954,ON406955,ON406953,ON406951,ON406950,ON406949,ON406948,ON406947,ON406946,ON406945,ON406944,ON406943,ON406942,ON406940,ON406939,ON406938,ON406937,ON406936&rettype=gb&retmode=text).

### National rollout step 210 — Nagao Foundation freshwater and estuarine project reports

Reviewed the official 2024 preliminary Luzon/Palawan report and the 2026 Luzon field-survey report. Together they document exploratory and follow-up work spanning rivers, tributaries, streams, estuaries, brackish lagoons, fishpond-associated channels, local markets and institutional collections. The 2026 report states that specimens were collected in Cagayan and Ilocos Norte, but does not publish a complete station-by-taxon/voucher crosswalk. Selected names and captions (*Pandaka pygmaea*, *Stigmatogobius elegans*, *Acentrogobius* sp., *Rhinogobius* larvae and *Awaous* larvae) remain research leads only. The 2024 page/report trip dates differ; field sighting, catch, market and collected-specimen evidence stay distinct. The reports call Ludong *Cestraeus plicatilis*, while the 2022 NFRDI study reports *C. goldiei*; no merge is made. No app rows are approved because exact stations, vouchers and item-specific reuse terms remain unavailable. See `national-luzon-nagao-freshwater-estuarine-survey-review-20261030.json`.

**Next implementation batch:** review the official April 2026 Palawan report, then continue the national sequence with multi-waterbody source screens (rivers, lakes, reservoirs, headwaters and estuaries) and prioritize source collections that expose reusable/checkable station and voucher metadata. Preserve evidence tiers and keep every regional completion claim pending systematic coverage and rights review.

### National rollout step 211 — Northern Palawan lakes, streams and estuaries

Reviewed the complete Nagao Foundation report for northern Palawan field work in April 2026. It is explicitly non-comprehensive but adds Lake Manguao, a waterfall stream and an unnamed mangrove estuary to the freshwater/estuary evidence sweep. The report has useful taxon leads—at least two provisional *Boroda* species in lake/stream material, unnamed Lake Manguao *Barbodes* species, and *Pterocryptis taytayensis*—but lacks the station-by-taxon/voucher table needed for stable occurrence assertions. Its one-stream non-detection is not regional absence evidence. No public row was added because site/sample crosswalk and reuse terms are incomplete. The SEAFDEC/AQD record confirms that a 2005 Lake Manguao conference paper's PDF is not available while the print publication is for sale; no access request or purchase was made. See `national-palawan-nagao-northern-fish-survey-review-20261030.json`.

### National rollout step 212 — Lake Manguao historical survey-version and taxonomy cross-check

Compared Matillano's 2002 Annals abstract with the official SEAFDEC/AQD record for the 2005 proceedings paper. Both describe the Lake Manguao 2002 campaign at eight stations, but the 2002 abstract reports 11 species, two sample events and six gear types, while the 2005 abstract reports 12 species, three events and seven gears. The conference paper PDF remains unavailable while for sale; the differing totals are unresolved and cannot be counted as independent surveys. The SUNY ESF portal labels Matillano's 2011 Puntius thesis open access, but its indexed signed PDF URL was expired and returned 403. The repository abstract and indexed excerpts report two historical Puntius names and two additional unresolved morphotypes in the lake basin; the thesis says © 2011, all rights reserved. The current Catalog of Fishes and previously reviewed 2025 Philippine type checklist treat the historical bantolanensis name as a synonym of *Barbodes manguaoensis*. That checklist also maps historical *Penesilurus palavanensis* material to *Pterocryptis taytayensis*. These are name-history crosswalks only, not re-identifications of the thesis or survey specimens, present-day lake records, or a match to the 2026 Nagao report's unsited *Pterocryptis*. Added four source references (281 total) and `national-lake-manguao-historical-fish-source-crosscheck-20261030.json`. No public rows were added; Palawan/MIMAROPA remains incomplete.

**Next implementation batch:** check public Western Philippines University and museum/collection catalogs for Lake Manguao vouchers, station tables or specimen-accession links that might resolve the historical survey and thesis taxon leads without a paid request. Keep market, catch, voucher, and historical literature evidence distinct; proceed to other Luzon lakes and rivers in parallel.

### National rollout step 213 — Lake Manguao SPCP voucher-portal and WPU survey cross-check

FishBase exposes six 2002 Lake Manguao specimen records under SPCP catalog numbers 0737, 0738, 0742, 0743, 0756 and 0757. The record pages cite Anonymous (2004), *Fish Collection of the Ichthyology Laboratory, State Polytechnic College of Palawan*, but the catalog itself has no linked file, DOI or URL. The legacy FishBase SPCP summary and record pages are dated; current custody and original determinations were not independently confirmed. Treat the six rows as secondary-portal accession leads.

The complete Matillano and Atrero 2013 CLP report documents a separate WPU-linked Lake Manguao survey and reports 12 taxa with station-class marks. Methods state sampling in October/December 2011, but Table 3 says October/December 2013, outside the stated September 2011–August 2012 project dates. Methods prose says two stream sites, while figure/table labels show only S1. These date and station-count conflicts are unresolved. The report provides no SPCP accession numbers or coordinates and therefore cannot validate or be merged with the 2002 collection records. The FishBase portal currently carries a CC BY-NC 4.0 site license, but reuse rights in the underlying 2004 catalog and CLP report remain unverified. Current taxonomy crosswalks preserve source names and do not re-identify specimens. Added three source references (284 total) and `national-lake-manguao-spcp-voucher-portal-crosscheck-20261030.json`. No species or occurrence assertion, geometry, diet claim, public-app row or publication approval was added. Palawan/MIMAROPA remains incomplete.

**Next implementation batch:** extract the 2013 report's Nile tilapia gut-content evidence with its season, size and waterbody context. Keep the report's field-date/site-count conflicts visible, separate natural diet observations from bait recommendations, and defer user-facing reuse until rights review; then continue the Luzon multi-waterbody source sequence.

### National rollout step 214 — Lake Manguao Nile tilapia gut-content evidence

The WPU-linked Lake Manguao report's stomach-content analysis ranks cyanobacteria highest overall (55% volumetric share; 58% importance index) and reports leaf particles, wood particles and sand. Sand is stomach content, not prey or nutrition. The report compares low/high water and three fish-size classes (5.5–10, 10.5–15 and 15.5–20 cm), and says cyanobacteria's importance increases with fish size. Its seasonal figures use different metrics; retain each metric and low/high-water label separately.

The report does not give the gut-sample count or exact dates for that sample subset in the reviewed text. Its wider field-date reporting conflicts (methods: October/December 2011; fish Table 3: October/December 2013), so the diet is not pinned to an exact collection date. No calendar-season conversion, other-species diet, no-predation generalization, bait recommendation or catchability claim is supported. No item-specific reuse license was verified. Added `national-lake-manguao-tilapia-diet-evidence-review-20261030.json`; no source reference, species assertion, diet assertion or public-app row was added. Palawan/MIMAROPA remains incomplete.

**Next implementation batch:** find the next dated, source-described Luzon river/lake/reservoir diet study or freshwater checklist and continue multi-waterbody source screening. Preserve site and evidence scope; a gap is not proof of absence or regional completion.

### National rollout step 215 — Lake Manapao sinarapan diet provenance

Reviewed Soliman and Sergio's 2001 SEAFDEC/AQD-hosted proceedings paper. Although its title names Lake Buhi, the authors say much of the biology data came from Lake Manapao and specifically attribute the diet summary to Sergio's 1995 unpublished B.S. thesis on Lake Manapao. The secondary paper reports 92% zooplankton and describes the remaining material as 8% phytoplankton and undetermined digested items; the wording does not resolve whether that 8% applies to phytoplankton alone or a combined remainder. It supplies no original diet method, sample count, denominator or diet-specific dates. Do not transfer the nearby eight-month fecundity interval to diet sampling or label the result as Lake Buhi data.

The same paper says Nile tilapia prey on sinarapan, citing Aypa et al. (1995) and Gindelberger (1981); neither cited work was independently retrieved for this review. Keep the predator-prey statement as an unverified historical citation lead. The repository marks the PDF Open Access but also says the item remains for sale and that its library cannot send copies; no item-specific reuse license was identified. Added one source reference (285 total) and national-bicol-sinarapan-manapao-diet-provenance-review-20261030.json. No species, diet, predation, legal, safety, or public-app row was added; no publication approval was granted.

**Next implementation batch:** continue Bicol inland-water source screening across Lake Buhi, Bato, Baao, Danao and the Bicol River; seek the cited Sergio 1995 thesis in parallel without blocking other source review. Keep freshwater and brackish/estuarine evidence separate, and retain regional completion as pending systematic coverage and rights review.


### National rollout step 216 — Camarines Sur multi-habitat survey and sinarapan identity cross-check

Reviewed the 2015 Corpuz, Paller and Ocampo paper on its 2010 survey of Lake Bato, Agos River, Bagacay Falls, Lake Baao-Bula and Pawili River. The paper reports three-day sampling in February-March and July 2010, with 8,184 fish, 29 species, 22 genera and 14 families across the five habitats. Its site table marks *Mistichthys luzonensis* at Lake Bato. These remain dated source-level survey claims, not current occurrences or a complete Bicol inventory.

Compared that historical table with a separate 2015 DNA-barcoding paper. Its authors report collecting three presumed-sinarapan fish tissue samples in each of Lakes Buhi, Danao, Manapao and Bato, but only two sequences succeeded: Buhi sample L1S1, reported as *Leiopotherapon plumbeus*, and Bato sample L4S1, reported as *Rhinogobius giurinus*. The article says no *M. luzonensis* reference sequence was available in its analysis context. The papers provide no shared specimen, tissue or voucher/accession crosswalk, so this is not a re-identification of the 2010 Bato survey record and does not establish waterbody-wide absence.

DA-NFRDI's public summary of its 2023-2024 assessment reports verified sinarapan in Lake Manapao and no true sinarapan among analyzed suspected samples from Lakes Buhi, Bato, Danao, Katugday and Makuao. The feature does not give per-waterbody sampling effort, dates, sample counts, vouchers or detection sensitivity. Separate 2025/2026 NFRDI features describe Lake Bato tabyos as a possible *Gobiopterus* candidate and report 31 fish species, 19 introduced in a two-year assessment; the public summary supplies no full species list or voucher audit. Keep that identity provisional.

No item-specific reuse permission was verified for the journal articles or agency features. Added five source references (290 total) and national-bicol-camsur-five-inland-habitats-identity-crosscheck-20261030.json. No occurrence/absence record, taxonomic correction, diet/predation assertion, geometry, legal or safety claim, or public-app row was added; no publication approval was granted. Bicol remains incomplete.

**Next:** locate NFRDI's primary Lake Buhi and Lake Bato technical assessments, complete checklists, collection dates, sample counts, voucher/accession identifiers and taxonomic determinations. Continue other Bicol inland-water and coastal source screening in parallel; the primary reports do not block other waterbody work.


### National rollout step 217 — NFRDI Lake Buhi risk-assessment and project-status screen

Reviewed the official NFRDI repository metadata for Magistrado et al.'s 2026 Philippine Journal of Fisheries paper on an AS-ISK risk assessment covering Laguna de Bay, Lake Mainit, Lake Naujan, Lake Buhi and Lake Paoay. The paper distinguishes extant and horizon categories; it defines horizon species as not recorded in the assessment during its study period but considered likely to enter or establish later. Therefore a horizon listing or invasive-risk score is not a Lake Buhi occurrence, native-species checklist, or current fishery-availability record. The NFRDI repository abstract and indexed article text were reviewed, but the full article PDF timed out in this research pass; its table and scores were not copied.

The official NFRDI FY 2024 Annual Report lists a broader inland-lakes stock-assessment project naming Lake Buhi, Lake Bato and Naujan Lake, with a planned January 2023–December 2028 duration. This establishes program context only: it does not show that all lakes have completed public species datasets or promise a release date. Added two source references (292 total) and national-bicol-inland-risk-assessment-source-review-20261030.json. No species occurrence, abundance, risk score, legal/safety, diet, or public-app row was added; no publication approval was granted. Bicol remains incomplete.

**Next:** continue the Bicol regional source inventory across river, lake, reservoir, wetland, estuarine and coastal habitats. In parallel, look for public primary checklists or technical reports from the continuing NFRDI assessments; no pending report should block other source work.


### National rollout step 218 — Bicol River and Calabanga three-river bioassessment screen

Reviewed two full 2022 river studies covering Camarines Sur. Bigueja et al.'s Bicol River paper reports survey/test-fishing across upstream, midstream and downstream sections and lists municipalities by reach, but gives no field dates, coordinates, vouchers or taxon-by-station crosswalk. It mixes freshwater, marine/brackish-affinity fish and macroinvertebrates; its 22-fish versus 27-total-species/1,155-specimen statements are unreconciled, and its locality/method descriptions and relative-abundance denominator conflict. The paper and journal label it Open Access, but no item-specific reuse license was located.

Siares and Bradecina's CBSUA paper describes wet/dry-season assessment of Tigman, Hinagyanan and Inarihan rivers, with forested, agricultural and estuarine reaches. Exact field dates are absent; the broad three-river scope is not fully crosswalked to its Inarihan-focused methods, named barangays and fish tables. Fish totals, table rows and spellings show internal inconsistencies, and the abundance denominator is unclear. The CBSUA journal copyright policy states CC BY 4.0. No table, figure or full text was copied; the policy does not itself grant Bangwit app-publication approval.

Added two source references (294 total) and `national-bicol-rivers-survey-evidence-review-20261030.json`. No scientific species assertion, occurrence, geometry, diet, legal/safety claim or public-app row was added. Treat both as dated literature leads, not current records or complete Bicol coverage; keep freshwater and downstream estuary evidence separate. Bicol remains incomplete.

**Next:** screen the 2021 Bicol River target/non-target catch-shift study for exact dates and locations, and determine whether its evidence represents fisher landings rather than direct river occurrences. Continue separate lake and tributary research across Lake Bato, Lake Baao-Bula, Pawili/Agos and other Bicol inland waters.


### National rollout step 219 — Bicol River historical catch-monitoring evidence

Reviewed Biag and Alberto's 2021 AACL Bioflux study, which covers September 2019–August 2020 catch monitoring and fisher/resident interviews along upstream, midstream and downstream Bicol River stations and landing sites in Camarines Norte and Camarines Sur. The authors report six municipalities, 27 fishing barangays and 350 purposively sampled respondents. They say sampling sites were geotagged, but do not publish a taxon-by-site, month-by-taxon, voucher or machine-readable coordinate crosswalk. The reported catch categories are vernacular and combine fish with mollusks/crustaceans; they cannot be mapped directly to scientific species records.

The article says it uses a Creative Commons Attribution License; the journal describes CC-BY, without a version specified in the reviewed article. The paper's COVID/ECQ narrative contains date conflicts, so detailed month-to-policy comparisons are not suitable for reuse without clarification. The paper acknowledges the BFAR Region 5 BASIL Bicol River project also associated with the 2022 Bigueja et al. paper; no survey-event crosswalk shows that these are independent datasets. No article table or figure was copied.

Added one source reference (295 total) and `national-bicol-river-pandemic-catch-survey-review-20261030.json`. No taxonomic species, occurrence, catch, geometry, diet, legal/safety or public-app row was added. Keep fisher-reported catches separate from biological occurrence and do not present historical preferences as current fishing advice. Bicol remains incomplete.

**Next:** continue the Bicol inland-water sweep with Lake Bato and Baao-Bula fish studies. Prioritize dated sampling methods, exact site/taxon crosswalks, vouchers and explicit reuse terms; preserve catch reports as a separate evidence class.


### National rollout step 220 — Lake Bato inventory and Baao Lake removal-evidence screen

Reviewed Mendoza et al.'s 2025 Lake Bato paper, its publisher issue page and copyright policy. It reports fish/macroinvertebrate sampling from landings and test fishing on the Libon and Bato sides, along with interviews of 50 purposively selected fishers. Exact specimen dates, station coordinates, vouchers and catch-event links are absent. The paper's stated 21 aquatic taxa conflict with its 8 introduced/3 native abstract split and its 10 native/14 introduced results split. Its abundance table identifies only a partial subset plus an unidentified goby. Its source-level *Mistichthys luzonensis*/tabios assertion does not resolve NFRDI's separate preliminary tabyos identity question. The PDF says © 2020 while the volume 11 issue page is dated April 30, 2025. The journal's copyright statement allows citation and printing/photocopying subject to Fair Use; no item-specific data or app republication license was found.

Reviewed BFAR Region V's June 8, 2024 report that three fisherfolk collectively removed 85 kg of “janitor fish” from Baao Lake and received BASIL incentives released June 5. The article supplies no scientific name, removal date, precise catch station, coordinates, specimen IDs or individual count. Treat this as an agency-reported removal action, not a scientific occurrence, taxonomic identification, abundance estimate or invasive-status record. Lake Baao-Bula's 2010 five-habitat survey remains a separate dated literature lead; its historical table is not a current checklist.

The official NFRDI repository confirms the already-registered “Reassessing the catch” item is a 2025 Fisearch newsletter article, pages 24–25. Its two-page summary reports 2025–2026 monitoring by four enumerators at eight landing sites and a preliminary tabyos morphology/genetics lead. It contains no complete taxon table, voucher list or station-linked dataset. It is the same communication as the existing NFRDI feature, not an independent replicate; the agency's later 31-species/19-introduced summary is likewise not merged with the 2025 journal paper's incompatible totals.

Added two source references and `national-bicol-bato-baao-lakes-source-screen-20261030.json` (297 registry references). Enriched the existing NFRDI source reference with its official repository metadata and full newsletter PDF links. No species assertion, occurrence, origin/invasive label, geometry, diet claim or public-app row was added; no publication approval was granted. Bicol and its inland-water coverage remain incomplete.

**Next:** continue the Camarines Sur inland-water sweep across Lake Buhi and smaller crater lakes Danao, Manapao, Katugday and Makuao. Seek primary dated checklists, voucher/accession links and station-level data for Bato and Baao-Bula, while continuing other Bicol habitat coverage in parallel.


### National rollout step 221 — Lake Buhi and adjacent sinarapan evidence review

Reviewed DA-NFRDI's official one-page Fisearch summary for its 2023-2024 Lake Buhi assessment and cross-checked it against the already registered September 2025 NFRDI feature. The newsletter says assessment findings were presented on March 11, 2025 and names work on sinarapan morphology/genetics and reproductive biology, cage aquaculture and ichthyoplankton. Neither public summary supplies a complete fish checklist, taxon-by-station table, sampling effort, specimen count or voucher crosswalk. Treat the two communications as summaries of one assessment program, not independent surveys.

Reviewed the 2021 IUCN assessment of *Mistichthys luzonensis* (assessment date September 7, 2020). Its Bicol range narrative names Lake Buhi, Bato, Danao in Polangui, Albay, and lakelets Manapao, Katugday, Paguiriron and Makuao; it distinguishes historic natural populations from fish-transfer populations and discusses February 2020 aging-study specimens and look-alike misidentification. The 2023-2024 NFRDI summary later reports verified sinarapan only among analyzed Lake Manapao samples and no true sinarapan in analyzed samples from Buhi, Bato, Danao, Katugday and Makuao. The NFRDI summary omits waterbody-level effort and detection sensitivity, so preserve both statements with dates and sample scope; do not label any lake permanently present or absent. The Red List assessment's reuse notice permits educational/non-commercial reproduction with attribution and requires prior permission for commercial reproduction; no Bangwit publication approval is granted.

HERDIN's abstract for Baquiran's 2011 Lake Buhi thesis reports October and December collection using hands, sakag push-net and diving, followed by identification at the National Museum. The full thesis is listed at MCU-LRC and was not retrieved. Its abstract says 23 fauna species, then gives eight fishes, four crustaceans and “eleven (12)” mollusks; it provides no species names. Do not turn its aggregate counts into a checklist. A July 2023 JICA water-plan excerpt repeats a DENR 2015 claim of seven native fish besides sinarapan, names only four examples and cites the unretrieved DENR master plan; this is a retrieval lead rather than a site/event dataset. Keep Lake Danao, Polangui, Albay distinct from Lake Danao, Ormoc City, Leyte.

Added four source references (301 registry references) and `national-bicol-lake-buhi-assessment-evidence-review-20261030.json`. No species, occurrence, absence, native-status, geometry, diet, legal or safety assertion and no public-app row was added. The primary NFRDI assessment tables, full Baquiran thesis and cited DENR 2015 material remain unavailable; Bicol remains incomplete.

**Next:** screen Lake Danao (Polangui, Albay) and the Buhi lakelets as separate freshwater units; continue other Bicol inland/coastal coverage in parallel while seeking the primary assessment and thesis records.


### National rollout step 222 - Lake Danao sequence crosswalk and Buhi lakelet leads

Queried GBIF's occurrence API in a small rectangular window around Lake Danao, Polangui, Albay. The window returned 44 rows across three datasets: 21 INSDC sequence records, 21 iBOL/BOLD rows, and two Southern Luzon copepod specimens. Matched the 21 fish sample codes one-to-one between INSDC and iBOL; treat them as 21 sample labels, not 42 independent specimens. Three accepted fish names are sequence-linked research candidates: Anguilla marmorata (2 samples), Oreochromis niloticus (5), and Rhinogobius similis (14). The BOLD identifiers are BINs, not separate species identifications. The copepod records remain outside the fish list.

The search window is approximate and is not an official waterbody boundary or exhaustive locality search. All fish rows share a single coordinate, have no coordinate uncertainty or verbatim locality, and lack a verified physical voucher repository and identification-method crosswalk. Bicol University's 2023 SIBA-LADA procurement entries establish planned or commissioned fish-inventory/genetic work but not results or a link to these accessions. A 2024 Lake Danao abstract reports local fish names and knowledge, not a taxonomic checklist. HERDIN's 2011 Manapao/Katugday abstract describes plankton and water-quality sampling with unnamed taxa, not fish species. Historical IUCN range, NFRDI sample-level non-detection, and the 2015 unidentified Danao tissue samples are kept as distinct evidence with their separate scope and dates.

Added six source references (307 total) and `national-bicol-danao-lakelets-sequence-source-review-20261030.json`; cross-checked three registered sources. No species, occurrence, absence, geometry, diet/predation, legal or safety assertion or public-app row was added. No publication approval was granted. Bicol remains incomplete.

**Next:** continue screening Bicol inland waterbodies as separate units, starting with lakelets and named rivers not yet covered by primary evidence. Seek completed SIBA-LADA fish/genetic tables and full lakelet theses without blocking other source work; keep estuary/coastal evidence distinct.


### National rollout step 223 - Catanduanes Pajo-Sto. Domingo river fish evidence

Reviewed the full 2022 Masagca, Latorre and Trinidad field paper for the Pajo-Sto. Domingo river system in Virac, Catanduanes. It describes four reaches (headstream, upper midstream, lower midstream and downstream), four fishing gears, and weekly fish sampling described in the methods as November 2017-February 2018. The abstract gives October 2017-February 2018. The authors report 106 fish and 20 taxa, but give no station/date-by-taxon matrix or specimen accession list; representative specimens are said to be stored in the CHED-NAFES SURMABIOCON reference collection.

The reported set includes 18 binomial names and two genus-only identifications; do not treat the paper's 20-species phrase as 20 confirmed species. The tables conflict on Awaous melanocephalus versus A. monocephalus and Osphronemus goramy versus O. gorami. The reported Gobius paganellus has a catalog distribution in the eastern Atlantic and European/adjacent seas; because no Catanduanes voucher accession is supplied, flag it for high-priority identification confirmation, not as a confirmed occurrence. Crenimugil seheli also needs a dated backbone decision before name normalization. The river is described as estuarine-linked, so do not treat every reach or taxon as strictly freshwater.

Added one source reference (308 total) and `national-bicol-catanduanes-pajo-river-review-20261030.json`. No occurrence/species assertion, geometry, diet, legal/safety claim or public-app row was added. The article's Creative Commons Attribution notice does not state a license version in the reviewed text; no separate Bangwit publication approval was granted. Bicol remains incomplete.

**Next:** continue inland-water research across Bicol provinces with a primary-source-first search; prioritize areas that have no dated, station-linked evidence, while keeping river, estuarine, lake and reservoir records separate. Seek vouchers or author clarification for this paper's inconsistent taxa in parallel.


### National rollout step 224 - Bulusan River gobioid crosswalk

Extended the existing 2015 southern Luzon gobioid source review to its Bulusan River, Sorsogon site instead of registering a duplicate source. The paper's site table reports 10 Bulusan rows and its results report 422 specimens from the river. Nine table rows are binomial names and one is genus-only (Eleotris sp.); the authors call all ten species. The study is limited to gobioids, so it is not a complete fish inventory. It sampled twelve longitudinal stations during wet-season campaigns in August 2010 and July 2011, with a downstream connection to estuarine waters. Although station GPS positions were recorded in the study, no per-taxon station coordinates or reusable geometry were recovered.

Preserved the source's verbatim taxa and flagged its Bostrychus sinesis table spelling versus B. sinensis in prose, plus the unresolved Oxyeleotris lineonata spelling. No silent taxonomic correction was made. The existing source record also has an unresolved rights conflict: Zenodo declares CC BY 4.0 while the journal's current terms describe non-commercial downloading and retained publisher copyright. Keep the rows out of the public app until that conflict is clarified.

Added `national-bicol-bulusan-river-gobioid-review-20261030.json` and linked it to the existing source reference; registry count remains 308. No historical occurrence assertion, current occurrence, geometry, diet, safety, legal or public-app row was added. Bicol remains incomplete.

**Next:** continue the Bicol waterbody sweep across lake, river, reservoir, wetland, estuary and coastal units; prioritize primary evidence that adds new locality coverage and keep the habitat and evidence classes separate.


### National rollout step 225 - Camarines Norte Labo-Bosigon EIS evidence audit

Reviewed indexed extracts from EMB Region V's official Social Environmental Impact Assessment Report for the Bosigon Irrigation Project in Labo, Paracale and Vinzons, Camarines Norte. Direct PDF fetch was blocked, so the full report, methods and bibliography were not independently inspected. The extracted fisheries narrative says no fish were captured during the field sampling because of inclement weather; nearby residents reported common names including Banak, Palos, Tilapia, Dalag and Hipon. The report also mentions an unspecified prior River halfbeak sighting and online articles, without a citation-to-specimen crosswalk.

Table 2-10 lists scientific fish names and invertebrates under freshwater biota but supplies no per-row dates, stations, gear, vouchers, coordinates or underlying source. It is not a field-capture checklist. Its Crenimugil seheli row is labeled Endemic without stating the geographic scale, despite the fish catalog's broad Indo-West Pacific range; Hemigrapsus sanguineus is a marine shore crab, not a freshwater fish; and Ophiocephalus striatus is a historical name in the Channa striata group while the table's Introduced label remains unverified for these rivers. Kept the table as verbatim research leads only.

Added one official-source reference (309 total) and `national-bicol-camnorte-bosigon-labo-eis-fish-review-20261030.json`. No species/occurrence/absence assertion, geometry, diet, status, or public-app row was added. No item-specific reuse terms were verified. Camarines Norte freshwater coverage remains incomplete.

**Next:** continue screening other Bicol inland and estuarine waters with primary field evidence; seek a specimen-backed survey for Labo and Bosigon rivers from public datasets or published sources while keeping interviews, EIS compilations and field surveys separate.


### National rollout step 226 - Incarizan River, Magallanes, Sorsogon source and classification audit

Reviewed the available text of a 62-page thesis copy titled *Diversity and Abundance of Fish in Incarizan River*, attributed to Melvin L. Cal and Daryll Bañares and labeled AY 2019-2020. The only located copy is a third-party Scribd upload marked All Rights Reserved; no SorSU repository accession, original file, author copy or institutional confirmation was located. The title page uses the Sorsogon State University name, while the university's official history dates its declaration ceremony to 2021. That metadata needs SorSU confirmation; it does not by itself establish authenticity or inauthenticity.

The thesis says 715 fish were surveyed and claims 26 genera in 21 families. Its abstract says six sampling sites, while methods/results describe seven; the extracted table has 26 row-like entries, including three genus-only/incomplete rows, and several suspect or inconsistent spellings. It combines direct gear catches and fisher-provided fish without a taxon-by-method crosswalk. Exact collection dates, event coordinates, vouchers and a per-taxon station matrix were not recovered. Its downstream discussion includes estuarine/marine-connected taxa, so do not label the inventory wholly freshwater. The 26 source-transcribed names are retained only as restricted research leads in `national-bicol-sorsogon-incarizan-river-thesis-review-20261030.json`; none was normalized or promoted to a species/occurrence assertion.

The Magallanes LGU profile independently names Incarizan among tributaries draining toward Sorsogon Bay and Ticao Pass, but supplies no river geometry or fish records. EMB Region V annual-report entries conflict: the 2019 report says Class C, the 2022 report table says Class C in 2022, while the 2024 report lists Class B, year 2019, under DMC No. 2022-15. The controlling circular was not retrieved. Do not publish a current class, safety or legal-use statement from these conflicting summaries.

Added six source references (315 total) and the Incarizan source review. No verified species, occurrence, absence, geometry, diet, native-status, legal/safety claim or public-app row was added. The thesis remains unauthenticated and its content rights unresolved; Bicol coverage remains incomplete.

**Next:** request the original thesis/catalog record and author or SorSU clarification through the Magallanes Campus Library; separately review Sorsogon marine-market evidence as market data, never as river occurrence. Seek the controlling DMC No. 2022-15 before displaying a water classification.


### National rollout step 227 - Magallanes market fish list, Sorsogon Bay and Ticao-Burias Pass

Reviewed Malto and Dumilag's peer-reviewed 2023 Philippine Journal of Science research note using its DOST-indexed abstract and a full-text copy uploaded by an author to ResearchGate. The authors report a twice-monthly Magallanes market survey from October 2021 to September 2022, using vendor/peddler interviews and records from LGU/BFAR offices; fish names were identified with gross morphology, regional atlases and FishBase 2022. The table lists 77 taxa and assigns broad source codes to Sorsogon Bay, Ticao-Burias Pass or both. This is market-resource evidence, not an event-level fish occurrence dataset and not evidence for Incarizan River.

The paper contains count conflicts: prose says 11 taxa were exclusive to Ticao-Burias Pass, 4 to Sorsogon Bay and 61 shared (76 total), while manual counting of the 77 table origin codes gives 10, 4 and 63 (77 total). It also says seven common names represent multiple species but lists twelve names. Preserve those discrepancies and do not create local-name species mappings or use the disputed origin subsets until checked against the table image or clarified by the authors. No exact capture coordinates, landing-event/specimen crosswalk or vouchers were located. Market seasonality is explicitly incomplete.

Added one source reference (316 total) and `national-bicol-sorsogon-market-fish-resources-review-20261030.json`, retaining 77 names as source transcriptions only. Direct publisher retrieval returned 403; no item-specific reuse license was verified. No normalized taxa, occurrences, river/freshwater records, diet/bait claims or public-app rows were added. Bicol coverage remains incomplete.

**Next:** continue the region-and-habitat sweep with separate Sorsogon inland river/lake evidence and coastal surveys; seek a visually verified publisher table or author clarification for the market article's counts before any use of derived subsets.


### National rollout step 228 - Prieto Diaz coastal eDNA paper and corrigendum hold

Reviewed publisher-indexed text for Naputo et al.'s 2024 peer-reviewed 12S eDNA study, plus Crossref metadata and the UP Diliman Institute of Biology publication listing. The study reports a July-August 2022 high-tide water campaign across 19 sites: ten PDS-coded sites in Prieto Diaz, Sorsogon, and nine sites in Oriental Mindoro. Habitats include mangrove-recolonized fishponds, natural mangroves, plantations, seagrass, coral reef and open sea. It reports 168 fish MOTUs and 89 species across both regions, not as a Sorsogon-only checklist. The ten Prieto Diaz table rows report salinity from 14.76 to 44.80 ppt for that campaign; these readings do not define a permanent salinity class or substitute for sample coordinates.

The source states its underlying data are available on request. No public sample-to-species crosswalk, site coordinates, sequence/read table or dataset was obtained. eDNA detections are not physical capture/voucher events. Crossref records the version-of-record license as CC BY-NC-ND 4.0. A publisher corrigendum was issued in December 2025 (DOI 10.1016/j.rsma.2025.104565), but its text was not retrieved. Therefore the correction's scope is unknown, and the paper's species totals and taxon-level claims remain unverified for Bangwit use until the corrigendum and any corrected tables are inspected. This is a separate dataset from the already registered 2026 Amihan-monsoon study; no detections were merged.

Added two source references (318 total) and `national-bicol-prieto-diaz-edna-corrigendum-review-20261030.json`. No taxon, occurrence, diet/predation, geometry or public-app row was admitted, and no publication approval was granted. Sorsogon and Bicol regional coverage remain incomplete.

**Next:** obtain the corrigendum/corrected article and a sample-level data crosswalk with rights terms if publicly available; in parallel, continue the Sorsogon inland river/lake and coastal source sweep without treating the eDNA report as freshwater occurrence evidence.


### National rollout step 229 - Bulusan Lake *Redigobius dispar* sample-site evidence

Reviewed the official journal landing page and full 2017 Alcabedos et al. paper on five Southern Luzon freshwater gobies. The methods describe 434 fish collected at two to four locations in coordination with the Fish Ark Philippines project; UPLB Limnological Station personnel documented samples and made initial identifications. Table 1 assigns 20 *Redigobius dispar* samples to Bulusan Lake, Sorsogon, and 36 to Manapao Lake, Camarines Sur. These are research sample counts, not individual occurrence events or population estimates.

The reviewed paper provides no exact collection dates, station coordinates, sample-level identifier or specimen accession. It mentions live and frozen sample sets but does not expose a voucher-custody crosswalk. Treat the named lake association as historical research evidence only; do not infer current presence, abundance, movement between lakes, lake geometry, catchability, diet, legality or safety. Keep this lake evidence distinct from the separate Bulusan River gobioid survey and do not merge Manapao records into Bulusan.

Added one source reference (319 total) and `national-bicol-bulusan-lake-redigobius-dispar-source-review-20261030.json`. No species/occurrence assertion, geometry, diet, safety/legal claim or public-app row was added. No item-specific reuse license or publication approval was verified. Sorsogon and Bicol coverage remain incomplete.

**Next:** seek the Fish Ark Philippines or UPLB Limnological Research Station sample register, dates and voucher/accession crosswalk for this study; continue independent Sorsogon inland-water screening in parallel, keeping lakes, rivers, estuaries and coastal waters as separate coverage units.


### National rollout step 230 - Bulusan Lake secondary checklist and endemicity claim audit

Audited a 2019 Maritime Review profile that states Bulusan Lake has 21 freshwater fish species, 15 endemic to the lake and six introduced. It names three examples but supplies no fish checklist, collection dates, methods, taxon references or source for the totals. Its reference list cites a 2017 amphibian/reptile inventory, which does not support a fish checklist. The phrase “endemic to Bulusan Lake” also cannot be silently recast as Philippine-endemic or native status.

Cross-checked the separate primary 2017 goby genetics study: its 20 *Redigobius dispar* samples assigned to Bulusan Lake provide a single-species historical sample-site association, not a complete checklist and neither validation nor contradiction of the 21/15/6 numbers. A protected-area site profile confirms lake/park context but contains no fish inventory. The 2019 counts and all taxa supported only by that paragraph remain held; no occurrence, endemic/introduced status, abundance or public-app row was created.

Added one source reference (320 total) and `national-bicol-bulusan-lake-fish-checklist-claim-audit-20261030.json`. No species assertion, occurrence, geometry, diet, legal/safety statement or public-app row was added. No publication approval was granted. Sorsogon/Bicol coverage remains incomplete.

**Next:** continue the Sorsogon inland-water sweep for primary fish data in other lakes, streams and reservoirs; seek the original Bulusan checklist and definitions in parallel, without allowing the unresolved secondary claim to block other regions.


### National rollout step 231 - 2026 freshwater biogeography matrix acquisition audit

Reviewed the official publisher page for Jamandre et al.'s August 2026 *Journal of Biogeography* article. It reports five ecological freshwater-fish provinces and describes supplementary files containing a taxon-by-catchment presence matrix with a change log, 32 catchment site names/IDs, centroids and environmental variables, and per-province inventory-completeness estimates. The official DMMMSU LAKAS repository search index also lists a 1.28 MB article PDF; its item page timed out when fetched, so this remains an alternate acquisition lead rather than a retrieved article copy. The study can speed national freshwater candidate triage across the ordered regional batches once its article version and supplements are examined.

The publisher's Table S1 and S2-S4 download endpoints returned HTTP 403; direct retrieval of the repository-listed article copy timed out. No workbook cell, taxon, catchment mapping, change-log correction, repository PDF version or file-specific reuse term was inspected. Added NIR's current PSA region identifier to the national research scope so all 18 regions in the plan are represented. Treat the five study provinces as ecological groupings, not current PSA regions. Treat catchment presence as catchment-scale synthesized evidence, not a dated species occurrence, lake/river-reach record, full national waterbody inventory or current resident population. Its scope is native freshwater fish and cannot replace marine/coastal, estuarine or introduced-fish work.

Added one national source reference (321 total) and `national-freshwater-fish-biogeography-catchment-matrix-review-20261030.json`. No species/occurrence assertion, geometry or public-app row was added; no publication approval was granted. The supplement remains a high-priority acquisition lead, not an imported dataset.

**Next:** try the institution-listed article PDF or an author/institution-provided copy, verify its manuscript version against the final article, and obtain the final supplementary files by an accessible official route. Log file hashes and rights, inspect taxon categories and catchment assignments/change history, then crosswalk sites to current PSGC regions and separately named waterbodies. Continue accessible regional source review in parallel if publisher access remains blocked.


### National rollout step 232 - Catanduanes Agojo mangrove eDNA evidence boundary

Reopened the already registered 2026 Nob et al. article as a national cross-region source and reviewed its full publisher-hosted text. The Catanduanes sampling site is Agojo Point Fish Sanctuary and Marine Reserve in San Andres, a fringe-mangrove site facing the North Philippine Sea. Sampling occurred during the Amihan window from December 2023 to January 2024, with three landward/middleward/seaward stations about 500 m apart and sample groups reported for flood (n=3) and ebb (n=3) tides. The exact station/sample crosswalk remains in inaccessible Table S1. The paper reports 11-44 OTUs for Catanduanes in its site-richness summary; these are OTUs, not a species count.

The article-wide 276 OTUs and 159 species-level annotations combine four sites (Batangas, Catanduanes, Aklan and Palawan). Table S1 describes sample collection/environment records and Table S2 gives taxonomic OTUs, sequence variants and read counts by site, but the publisher download returned HTTP 403. No Catanduanes taxon rows, sample coordinates or read crosswalk could be inspected. Preserve eDNA detections as method-specific, dated evidence; do not treat them as capture/voucher events, abundance, resident-population proof, catchability, diet or fishing permission. The article version of record is marked CC BY-NC-ND 4.0 in Crossref, and no separate supporting-workbook license was verified.

Reused the existing source reference (registry remains 321) and added `national-bicol-catanduanes-agojo-mangrove-edna-review-20261030.json`. No species/occurrence assertion, geometry or public-app row was added; publication approval remains false. This expands Bicol coastal source coverage but does not complete Catanduanes or Region V.

**Next:** obtain Tables S1-S2 through an accessible author/publisher route, inspect the sample-to-OTU/site crosswalk and file rights, and continue independent Catanduanes reef, river/estuary, lake and inland-water source screening in parallel.


### National rollout step 233 - DENR Catanduanes coastal assessment data lead

Reviewed DENR Bicol's official notice, indexed in its archive as published May 5, 2021. DENR Region V and PENRO Catanduanes report that they assessed coral reefs and associated reef fish, seagrass beds, and mangroves in Viga and Bato using DENR BAMS coastal/marine protocols, recording composition, richness, abundance and habitat condition as part of CMEMP technical assistance.

The direct notice page returned HTTP 403, and the accessible notice does not provide named fish, dates, station coordinates, counts, vouchers, maps, a report download or data-reuse terms. Added one official source lead (322 total) and `national-bicol-catanduanes-denr-coastal-habitat-assessment-lead-20261030.json`. No species/occurrence assertion, geometry or public-app row was added; publication approval remains false. Viga and Bato reef, seagrass and mangrove coverage remain unverified individually.

**Next:** locate or request the final BAMS report, fish/habitat tables, station map, identification/voucher details and reuse terms through DENR Region V CRFMS or PENRO Catanduanes. Continue other Catanduanes waterbody and habitat source reviews in parallel.


### National rollout step 234 - Sorsogon Bay historical fisheries assessment

Downloaded the official NFRDI *Assessment of the Fisheries of Sorsogon Bay (Region 5)*, Technical Paper Series Vol. 12, No. 4 (December 2009), and reviewed its abstract, study scope, methods, selected results and conclusions. It analyzes four years of catch, effort and length-frequency data from April 1999 to March 2003. Landing monitoring is reported at Cambulaga (Sorsogon), Cawit (Casiguran) and Poblacion (Castilla); a separate boat/gear inventory covers the municipalities around the bay. The assessment describes 25 dominant fish and 10 dominant invertebrate species selected by consistency and catch volume, not a complete regional species checklist.

This source is useful historical aggregate fishery evidence, but a landing site is not necessarily the capture site of each fish. The report's methods refer to 67 bordering barangays while its results say 64; the discrepancy remains unresolved. No event-level landing dataset, fish-to-capture-location crosswalk, voucher accession, or item-specific reuse permission was established. The survey period ended in 2003, so it does not support current presence, present-day abundance, diet, catchability, rules or safety.

Added one source reference (323 total) and `national-bicol-sorsogon-bay-assessment-2009-review-20261030.json`. No taxa were transcribed and no species assertion, occurrence, catch record, geometry, diet claim or public-app row was added; publication approval remains false. Bicol and Sorsogon coverage remain incomplete.

**Next:** locate the 1995 Sorsogon Bay fish checklist cited in the paper or the underlying NSAP landing records, then continue the separate inland-water and coastal-habitat sweep for Bicol. Keep rivers, lakes, reservoirs, estuaries, mangroves, seagrass and reef units distinct.


### National rollout step 235 - 1995 Sorsogon Bay assessment access lead

Checked the official FOI Philippines record for an earlier request for the 1995 *Resource and Ecological Assessment of Sorsogon Bay*, Volumes I-III. The requester sought the volumes for research on July 31, 2022. BFAR's August 1, 2022 response reported that it had a physical copy, was still digitizing books and IEC materials, and did not have a softcopy available at that time; it suggested contacting DA-BFAR Regional Fisheries Office. The 2009 NFRDI paper cites the fish checklist in Volume II, pages 79-97.

This archived response is an acquisition lead only, not confirmation of present-day availability. It supplies no 1995 taxa or tables and grants no reuse permission. No new request or message was sent.

Added one access-lead source reference (324 total) and `national-bicol-sorsogon-1995-bfar-foi-access-lead-review-20261030.json`. No taxa, occurrence or geometry assertion, or public-app row was added. The checklist remains unavailable for review and Bicol coverage remains incomplete.

**Next:** if pursuing the old checklist, ask BFAR whether Volume II pages 79-97 can now be inspected or shared and request current access and reuse terms. Continue the Bicol-wide inland and coastal evidence sweep independently; the 2022 response does not need to block work elsewhere.


### National rollout step 236 - Masbate Aroroy River rapid-assessment evidence screen

Reviewed the publisher-hosted 2025 rapid assessment for a 150-m Aroroy River segment in Barangay Matalang-Talang, Aroroy, Masbate. It reports three stations about 50 m apart and a field period of April-June 2025. Its fish table lists two upstream labels: *Sillago* sp. and *Mugil cephalus*. The reported method is direct observation with limited hand-netting; no fish counts, diagnostic key, specimen accession, voucher or fish-image crosswalk was found in the article.

The station coordinate statements are not internally consistent: the PDF provides a central Masbate coordinate and upstream/downstream UTM values, but prints the midstream point as 51°36′23.2″N, 138°40′26.0″E. This conflicts with the stated study locality, so no station geometry was created. The genus-only label and source-only observations remain held for review, not current or verified presence. The paper's CC BY-NC-ND notice has no version stated in the PDF; no separate raw-data rights or publication approval was verified. Water-quality comparison against Class C criteria does not prove official classification or safety.

Added one source reference (325 total) and `national-bicol-masbate-aroroy-river-rapid-assessment-review-20261030.json`. No occurrence, geometry, abundance, diet, safety/legal claim or public-app row was added. This adds one Masbate river source lead; Bicol and Masbate species coverage remain incomplete.

**Next:** seek correction of the midstream coordinate, taxonomic identification details and voucher/count crosswalk from the authors, while screening separate Masbate rivers, lakes, estuaries and coastal sites. Do not let this source's station-coordinate issue block independent Bicol waterbody research.


### National rollout step 237 - Masbate Ticao reef fish survey and baseline access audit

Reviewed the official Silliman Journal issue containing a 2013 fish visual census at two Ticao Island reefs: Baladingan (V-1), Barangay Famosa, Monreal; and Tacdugan (V-2), Barangay Tacdugan, San Jacinto. The paper reports 52 fish species at V-1 and 47 at V-2, using three 50-m transects per site and a fish visual census. Its taxonomic guide references are described, but no species-by-site list was found in the reviewed results. The coordinate ranges identify survey-site/transect localities, not reef polygons.

The article separately reports Famosa landing monitoring for 46 days across June-December 2013. Most catches came from coastal waters around Famosa and Tacdugan; they cannot be assigned to the Baladingan transect as exact occurrence events. The article's OJS page gives a 2022 online publication date while its bound issue identifies April-June 2016; the 2016 issue date is retained with the discrepancy noted. The PDF says all rights reserved and requires written permission for reproduction.

The 2016 paper cites a 2014 Ticao reef baseline. Its publisher abstract reports a 100-ha patchy reef and 69 fish species, but the full paper is advertised for USD 20 and its taxa list was not available here. These are different studies and counts; they were not merged or treated as a complete Ticao checklist.

Added two source references (327 total) and `national-bicol-masbate-ticao-reef-fish-stock-catch-review-20261030.json`. No taxa were transcribed; no species assertion, occurrence, catch record, geometry or public-app row was added. Ticao and Masbate coverage remain incomplete.

**Next:** seek a permission-cleared species-by-site list or author-held field table for the 2013 census and continue the distinct Masbate mangrove, estuary and inland-water review. Keep any landing-site catch data separate from reef survey observations.


### National rollout step 238 - Asid Gulf fish-guide profile inventory

Reviewed the official NFRDI listing and its linked 2019 *Fish Guide: Common Fishes in Asid Gulf*, a BFAR Region V/NFRDI NSAP output. The guide's profile pages (PDF pages 19-81; printed pages 5-67) contain 86 distinct fish profiles with source scientific, English and local names. Its introduction describes the guide's Asid Gulf fishery context, NSAP work beginning in 2007, and landing centers at Milagros, Balud and Placer. The guide situates Asid Gulf in the Visayan Sea across Regions V, VI and VII; that does not make its profiles a complete checklist for any of those regions.

Added `national-visayas-asid-gulf-fish-guide-profile-review-20261030.json` with the 86 names only and PDF/printed page references. No descriptions or photographs were copied. The guide's stated terms permit educational or other non-commercial reproduction with full acknowledgment, while prohibiting resale/commercial reproduction; public-app publication remains unapproved. No per-profile field dates, capture stations, coordinates, event records or vouchers were established. Names remain source strings pending a current taxonomic crosswalk.

Added one official source reference (328 total). No species/occurrence, diet, abundance or geometry assertions and no public-app rows were added. This is a regional marine-fishery source, not freshwater coverage; Asid Gulf and Regions V, VI and VII remain incomplete.

**Next:** crosswalk the source names against current taxonomic authorities while retaining the printed strings, and continue independent freshwater, brackish and coastal evidence sweeps by named waterbody. Keep fish-guide profiles separate from occurrence events and catch records.


### National rollout step 239 - Asid Gulf guide name crosswalk against GBIF Backbone

Matched the 86 source scientific-name strings in one documented GBIF ChecklistBank Species API v2 batch request (`kingdom=Animalia`, `strict=true`, `verbose=true`). The API returned all 86 results in input order. The returned match types were 85 `EXACT` and one `VARIANT`; 84 matched usages were marked accepted and two were marked synonyms. Six results included alternative candidates. The query, selected response fields, classifications and page-linked source strings are recorded in `national-visayas-asid-gulf-fish-guide-profile-review-20261030.json`; the source names were not overwritten.

Nine rows require manual taxonomic review: `Alectis indica`, `Leiognathus equula`, `Mene maculata`, `Moolgarda seheli`, `Mugil cephalus`, `Valamugil buchanani`, `Plotosus lineatus`, `Scomberomorus commerson` and `Sphyraena barracuda`. GBIF marks `Moolgarda seheli` and `Valamugil buchanani` as synonym usages with accepted-name candidates `Crenimugil seheli` and `Crenimugil buchanani`; `Leiognathus equula` returns a variant candidate `Leiognathus equulus`. These remain provisional and need comparison against a second authoritative fish-taxonomy source and the guide's cited authorities.

Added one API source reference (329 total). This is a name crosswalk only; it establishes no Asid Gulf occurrence, local abundance, diet, catchability, legal access or safety. No species/occurrence assertion or public-app row was added, and publication approval remains false.

**Next:** review the nine flagged names against current authoritative fish taxonomies while preserving source strings, then resume the distinct Visayas freshwater, brackish and coastal source sweep by named waterbody.


### National rollout step 240 - Western Visayas Panay freshwater acquisition leads

Reviewed two strong inland-water leads for V1 (Western Visayas). The CPU repository and Silliman Journal abstracts for the Jalaur River system report July-November 2009 sampling across upper, middle and lower areas, with 51 fish overall: 14 freshwater-affinity, 36 marine/brackish-affinity and one catadromous fish (*Anguilla marmorata*); the abstract reports nine exotic fish. These are aggregate abstract claims, not a species-by-reach checklist. The repository page timed out and the Silliman PDF endpoint returned HTTP 502, so tables, station coordinates, species identities beyond the abstract example and rights were not reviewed.

Also identified a high-value UP Visayas/DOST-PCAARRD project targeting freshwater fish and invertebrate diversity on Panay, with planned DNA and biodiversity reference libraries, vouchers, protocols, manuscripts and LGU outputs. Two official PCAARRD 2025 records agree on a project window of 2024-05-01 through 2026-04-30 and ONGOING status as of 2025-12-31. The planned end date has passed, but no final report or dataset was found in the records reviewed; actual completion and public availability remain unverified. Added `national-visayas-panay-freshwater-project-jalaur-access-review-20261030.json` and two source references (331 total).

No site-level taxa, taxonomic crosswalk, occurrence, geometry or public-app rows were added; publication approval remains false. This advances the Panay freshwater evidence queue but does not complete Jalaur River, Panay, Guimaras or Western Visayas coverage.

**Next:** retrieve the Panay reference libraries and final report from UP Visayas/PCAARRD with their site-date, taxon/barcode and voucher crosswalks, marker limitations and reuse terms; separately obtain the full Jalaur article. No inquiry was sent. Continue screening other Panay rivers/lakes and Guimaras inland waters while these access leads are pending.


### National rollout step 241 - Tigum River freshwater fish baseline

Added the West Visayas State University repository and Philippine Journal of Science study of fishes in Tigum River, Iloilo. Its abstract reports 10 fish species across eight families sampled from April 2015 to March 2016; WVSU repository metadata indexes eight taxonomic terms. The article PDF was not obtained: the WVSU copy workflow requires login/request, while the public DOST journal PDF endpoint returned HTTP 403. No copy request was sent. Added one source reference (332 total) and `national-visayas-panay-tigum-fish-study-access-review-20261030.json`.

This is a historical research lead, not a current distribution checklist. The complete ten-name list and site-by-taxon crosswalk remain unverified; the repository's indexed `Platycephalus` is genus-level only. No app species/occurrence rows, reach geometry, current-presence claim or publication approval were added.

**Next:** retrieve the article from an authorized open copy and transcribe its ten taxa, methods, sampling reaches/dates, voucher or specimen references, and reuse terms. Keep any observed taxa tied only to the study's 2015-2016 evidence until independently refreshed; continue the Panay/Guimaras freshwater source sweep in parallel.


### National rollout step 242 - Bugang River historical reach checklist

Reviewed the full 2014 open-access Bugang River article and transcribed its table of 38 source taxa, 30 genera and 20 families with its four source reach codes, reported local/common names and station coordinates into `national-visayas-panay-bugang-river-fish-checklist-review-20261030.json`. Three entries are genus-only (`Eleotris`, `Glossogobius`, `Awaous`); they remain unresolved and are not species names. The survey ran November 2013-March 2014 in Pandan, Antique, where the river meets Pandan Bay. Added one source reference (333 total).

This is a historical river-estuary checklist. The authors classify five taxa as migratory and 33 as sporadic visitors and report no primary or secondary freshwater fish in the four sampled sites. Preserve that as the source's 2013-2014 result, not a present-day absence claim or a general property of Panay rivers. The article states a Creative Commons Attribution license (version unstated); credit the authors and source. No current-presence assertion, geometry feature, fishing-rule, safety, diet, public-app row or app publication approval was added. Western Visayas remains incomplete.

**Next:** run a current authoritative taxonomic crosswalk over the 35 binomial source labels while preserving the 38 verbatim rows and genus-only entries; independently validate the reported reach matrix and coordinates before preparing any historical occurrence projection. Continue the distinct inland-freshwater sweep for Panay and Guimaras.


### National rollout step 243 - Bugang River CoL XR name proposals

Matched the 35 binomial table labels in one GBIF Species API v2 batch against the explicit Catalogue of Life eXtended Release checklist. All 35 responses were exact and returned in input order; the selected matching-index metadata was stable before and after the request. Twenty-seven source usages are accepted and eight are synonyms with accepted-name proposals; one source family differs from the index (`Zenarchopterus dispar`, source Hemiramphidae vs. CoL XR Zenarchopteridae). Three genus-only source labels were left unqueried. Added `national-visayas-panay-bugang-river-taxonomy-crosswalk-20261030.json`; the source registry remains 333.

These are automated nomenclature proposals only. Every decision remains pending; no source name was overwritten, taxon adopted, occurrence asserted, geometry added or public-app row admitted. The family conflict needs an independent fish-taxonomy review; exact name matching does not re-identify field specimens. The eight synonym proposals likewise require human confirmation before any accepted name is presented as the current taxon.

**Next:** compare the family/name conflict and synonym usages against current authoritative fish taxonomies, then decide whether a dated, reach-scoped historical evidence projection is eligible. Preserve original names, source reach codes, dates and attribution.


### National rollout step 244 - Bugang River independent fish-taxonomy cross-check

Checked the eight COL XR synonym proposals and the `Zenarchopterus dispar` family discrepancy against current fish-taxonomy records. The Catalog of Fishes supports six proposed accepted names: `Planiliza subviridis`, `Planiliza macrolepis`, `Ellochelon vaigiensis`, `Giuris margaritaceus`, `Eubleekeria splendens` and `Ostorhinchus semilineatus`. WoRMS lists `Tetraroge niger` as unaccepted with `Tetraroge nigra` accepted, corroborating the seventh proposal. The Catalog of Fishes places `Zenarchopterus dispar` in Zenarchopteridae, agreeing with COL XR, while the 2014 article's Hemiramphidae label remains preserved verbatim. The genus placement proposed for `Apogon hyalosoma` remains held: the Catalog of Fishes synonym chain supports `Yarica hyalosoma`, while the inspected NCBI Taxonomy record presents `Apogon hyalosoma` as the current name and `Yarica hyalosoma` as a homotypic synonym.

Added `national-visayas-panay-bugang-independent-taxonomy-check-20261030.json` and three authority references (336 total). No source name was overwritten, and no taxa, occurrence, geometry or public-app rows were adopted. These references address nomenclature only; they do not re-identify the 2013-2014 study specimens or establish present-day Bugang occurrence. The remaining 27 accepted COL XR name matches are still pending human disposition; the eight synonym proposals are not all publishable because the Apogon classification conflict remains unresolved.

**Next:** validate the article's four reach locations and coordinate statements against the source text and licensed basemaps, then decide separately whether any dated, reach-scoped historical evidence projection is supportable. Continue the other Panay and Guimaras inland-water sweep in parallel. Keep the original source strings, historical reach codes and attribution.


### National rollout step 245 - Bugang River source-coordinate consistency review

Re-read the publisher article's four GPS site coordinates and converted its degrees-plus-decimal-minutes values to decimal degrees without changing the verbatim strings. Compared them with official DENR EMB Region VI Malumpati-Bugang River water-quality monitoring stations. The EMB table identifies grid zone `51 P` but the reviewed material does not identify the horizontal datum, so an illustrative UTM zone 51 north/WGS84 transform was used only for a rough distance check. The article's upper-midstream point is within about 6 m of EMB's “Downstream of Malumpati Cold Spring” station under that assumption. The headstream point is about 545 m from the nearest EMB station; the lower-midstream and downstream points are about 941 m and 453 m from their nearest official stations. These separate campaigns and station labels do not establish that their points are identical; the distances only support broad spatial plausibility. The article itself reports four study sites and a site-by-taxon matrix; the EMB material has monitoring stations and a map description, not a downloadable river centerline or boundary.

Added `national-visayas-panay-bugang-coordinate-crosscheck-20261030.json` and one official EMB reference (337 total). The record retains all original coordinate strings and marks converted EMB positions as datum-uncertain. No river line, reach polygon, occurrence, or public-app feature was added. This verifies coordinate parsing and supplies a useful independent place check, but not survey-grade validation, a complete river geometry, current species presence, or fishing suitability.

**Next:** build a non-public, source-faithful reach-by-taxon ledger for the four Bugang article sites, preserving original names, dates, taxon rank, site flags and pending classification fields. Do not infer a species occurrence outside those sampled reaches or current presence. Continue the separate Panay and Guimaras river, lake, estuary and wetland source sweep.


### National rollout step 246 - Bugang River historical reach-by-taxon ledger

Built `national-visayas-panay-bugang-historical-reach-taxon-ledger-20261030.json` from the reviewed article table, its CoL XR crosswalk, the independent taxonomy check and the station-coordinate check. The ledger keeps all 38 source names, the three genus-only entries and all 67 taxon/reach links. Its per-site counts reconcile to the article's HS 13, UM 8, LM 16 and DS 30. Each taxonomy proposal is explicitly separate from the source identification; the Apogon hyalosoma genus conflict remains held, and the family wording printed for Zenarchopterus dispar remains unchanged.

The ledger is non-public research provenance, not an app projection. It adds no current-presence or whole-river claim, no species or occurrence assertion, no geometry, and no public-app row. Attribution is preserved; the article's Creative Commons Attribution license version is still unspecified, and publication approval remains false. The ledger is listed in the existing Bugang article's source review files; no source reference was added (337 total).

**Next:** prepare a separate historical-display eligibility decision for this ledger, including taxonomy holds, specimen-identification limits, attribution/version status, date wording and whether four study-site points can be displayed without suggesting a whole-river range. Keep all entries non-public until that decision is complete. Continue Panay/Guimaras inland-water research in parallel so this single study does not become a regional-coverage proxy.


### National rollout step 247 - Bugang River historical display eligibility

Recorded an internal display decision for the 2013–2014 Bugang River study. The reach ledger may remain in internal research, but admission to the public app is held. A future limited historical display is conditionally reviewable only after the license/version and attribution are confirmed, a qualified reviewer checks the proposed wording, coordinate/map use is independently reviewed, and taxonomy holds remain visible. Any eventual display must be labeled “Historical study record (2013–2014),” preserve source names and reach flags, and avoid claims about current presence, abundance, diet, bait, catchability, safety, rules or permission. The genus-only rows are not species, `Apogon hyalosoma` remains unresolved, and the source's historical `Hemiramphidae` assignment for `Zenarchopterus dispar` remains verbatim.

Added `national-visayas-panay-bugang-historical-display-eligibility-20261030.json` to the source review files. This does not authorize publication, add app rows or geometry, or resolve specimen identity. No code or legal text changed.

**Next:** resume the independent Panay/Guimaras freshwater-source sweep and identify the next open, primary study with retrievable species-by-waterbody evidence; do not treat Bugang as a regional baseline.


### National rollout step 248 - PanayCon freshwater survey acquisition lead

Reviewed Maren Gaulke's “Freshwater fauna of Panay: preliminary survey on fish and shrimps” in the PanayCon Seventeenth Report (report covers 2014; front matter dated January 2015). It describes roughly 40 fish species across 15 families from short-term surveys in north and northwest Panay, but some taxa were unidentified and the reviewed section does not map taxa to individual rivers. It names 11 river/stream survey areas that can guide source discovery; those are not species occurrences. The report explicitly requires written permission from PanayCon Management or the PhilinCon Board for any part to be used.

Added `national-visayas-panay-panaycon-freshwater-fauna-discovery-review-20261030.json` and registered the source (338 references). No list of taxa, prose, figures or images was copied; no assertion, geometry or app row was created. Treat this as an internal discovery lead only until permission and a specimen/site crosswalk are available.

**Next:** continue locating independently published, rights-clear, species-by-waterbody sources for Panay and Guimaras; prioritize fully accessible primary studies with dated site/taxon tables or open occurrence data. Keep waterbody and date scope explicit, and do not use the report's aggregate count as a checklist.


### National rollout step 249 - Guimaras Sibunag mangrove fish-study access review

Reviewed SEAFDEC/AQD's repository record for a 2012 study of fish habitats in Sibunag mangrove creek, Guimaras. Its abstract reports 475 fish, 3,875 g total weight, and 50 species in 32 families, with community changes from outside to inner creek. The official repository has no full-text file attached. A university-hosted PDF mirror is indexed, but direct retrieval failed, so the taxon table, field methods, sampling date, exact site, and reuse terms remain unverified.

Added `national-visayas-guimaras-sibunag-mangrove-fish-source-access-review-20261030.json` and registered the source (339 references). This is an acquisition lead only. The abstract's “open access” wording describes the creek and is not an article license. No taxa, geometry, occurrence assertion, or app row was created.

**Next:** obtain a legitimate full-text copy and verify the species-by-habitat table, collection dates, creek/site identity, and copyright/reuse terms. Meanwhile, continue the Visayas sweep for accessible, rights-clear sources with site-level fish records; include freshwater lakes and rivers alongside estuaries and coastal waters.


### National rollout step 250 - Bago and Jalaur introduced-fauna checklist lead

Reviewed the Silliman Journal and PIDS SERP-P records for a 2010 checklist of introduced aquatic fauna in Bago River (Negros Occidental) and Jalaur River (Iloilo, Panay). The abstract reports 16 mixed aquatic taxa, including 11 fish, and names three candidate fish records without assigning them to each river. Search-indexed excerpts from the publisher PDF show four Bago and three Jalaur stations, but the full methods, taxon table and station figure were not retrievable. The publisher page's 2022 date conflicts with the 2010 journal issue and PIDS record; use 2010 as the bibliographic year and note the platform date as metadata only.

The journal's copyright policy identifies the journal and authors as copyright holders and requires permission for specified reproductions; no open data license is established. PIDS download is behind a security verification and was not completed. Added `national-visayas-bago-jalaur-introduced-fauna-access-review-20261030.json` and registered the source (340 references). No taxa or app rows were created.

**Next:** continue to an accessible source with full dated fish/site records; prioritize exact localities, methods, taxon rank and usable rights. Do not treat a historical introduced-fauna abstract as current invasive status.


### National rollout step 251 - Negros and Siquijor checklist scope review

Reviewed the 2010 Bucol and Carumbana checklist through its author-uploaded ResearchGate full text. It reports 89 species in 45 families across fresh and brackish waters of Negros and Siquijor, but explicitly calls the compiled list tentative. It combines published literature and collections from different years and localities, including Siaton River collections from May 2004–October 2005 and references to Bago River, Siquijor and an ongoing Pagatban survey. The author-upload record warns that content may be subject to copyright; no item-specific reuse license was verified.

Added `national-visayas-negros-siquijor-2010-checklist-scope-review-20261030.json` and one source reference (341 total). No taxa were transcribed. The aggregate 89 is not a site-by-taxon matrix, current distribution or region-completion count; no species assertion, geometry or public-app row was added.

**Next:** prefer an accessible, dated primary study with station-level evidence for a named Visayas waterbody; preserve broader checklists only as discovery leads until their source records and rights are resolved.


### National rollout step 252 - Bayawan River dated fish baseline review

Reviewed the publisher-hosted 2019 Bayawan River fish study and its official PDF. The paper reports 670 fish specimens and 28 fish labels across Suba (downstream), Villareal (midstream) and Nangka (upstream), sampled December 2018–February 2019. It describes short gill-net sampling, says most recorded fish are marine-associated visitors to freshwater, and identifies CC BY-NC 4.0 on the journal record. Table 3 labels are transcribed verbatim for internal taxonomy review; `Butis sp.` remains genus-level and apparent source spellings remain unresolved.

The paper prints invalid DMS minute values for the Villareal and Nangka coordinates. Those points are not corrected or mapped. The study is a dated preliminary river-estuary baseline, not current presence, population abundance, catchability, legal fishing advice or safety guidance. Added `national-visayas-negros-bayawan-river-2019-fish-checklist-review-20261030.json` and one source reference (342 total). Public app admission remains on hold; no app species, occurrence or geometry rows were added.

**Next:** build an attributed taxonomy crosswalk over the 28 source labels while retaining each verbatim string, keep the genus-only record unresolved, and separately inspect the full station-by-month abundance table before deriving counts. Resolve the two invalid coordinates from an authoritative correction before mapping; meanwhile continue the inland-lake and other river source sweep for Negros and Siquijor.


### National rollout step 253 - Bayawan River CoL XR taxonomy proposals

Queried the 27 binomial labels in Quindo et al. (2019) Table 3 against the explicit Catalogue of Life eXtended Release matching index. Metadata hashes matched before and after capture. Results were 18 exact accepted-usage matches, five exact synonym usages with accepted-usage proposals, three variant matches and one higher-rank result. The single genus-only source row, Butis sp., was not queried.

Added national-visayas-negros-bayawan-colxr-taxonomy-crosswalk-20261030.json. The ignored raw API snapshot remains untracked. Article strings are preserved; each decision is pending, and no name, specimen, occurrence, geometry or public-app row was adopted.

**Next:** compare synonym, variant and higher-rank results against specialist fish-taxonomy records; do not treat automated nomenclature matching as specimen re-identification.


### National rollout step 254 - Bayawan River independent taxonomy check

Compared the five synonym proposals, three variant matches and one higher-rank result against Eschmeyer's Catalog of Fishes, WoRMS, CSIRO CAAB and the existing NCBI Taxonomy comparator. Four synonym proposals are corroborated as name proposals; Chelon melinopterus remains disputed between WoRMS (Planiliza melinoptera) and NCBI Taxonomy (current name Chelon melinopterus). The three spelling candidates Caranx sexfasciatus, Toxotes jaculatrix and Upeneus moluccensis are supported by the Catalog. Yarica halasoma remains a source-spelling hypothesis: GBIF returned the genus at higher rank, while catalogs support Yarica hyalosoma.

Added national-visayas-negros-bayawan-independent-taxonomy-check-20261030.json and three authority references (345 total, reusing one existing NCBI comparator). The 18 exact accepted-name matches were not independently checked in this focused pass. No field specimen was reidentified, source name overwritten, taxon adopted or app row approved.

**Next:** inspect Table 3 visually and reconcile all 28 rows and nine station-month cells against the paper's reported total before creating an internal ledger.


### National rollout step 255 - Bayawan River Table 3 abundance ledger

Visually inspected Table 3 on the publisher PDF page printed 127 (PDF page 10), transcribed all 252 station-month cells for 28 source labels and built national-visayas-negros-bayawan-abundance-ledger-20261030.json. Numeric cells sum to the reported 670 specimens; December sums to 303 and Suba/S1 to 572. Derived station totals are S1/Suba 572, S2/Villareal 28 and S3/Nangka 70. The 28 labels include genus-level Butis sp.

One source inconsistency remains: the prose says January had 24 species, but the visually transcribed Table 3 shows numeric counts for 23 labels. December's 27 and February's 15 table labels agree with the prose. Dashes and blank cells are preserved separately; neither is generalized into ecological absence. No counts were published as population estimates, no current occurrence asserted, and no app row or geometry added.

**Next:** record a separate historical-display eligibility decision. Keep Bayawan out of the public app until the January count discrepancy, invalid Villareal/Nangka coordinates, taxonomy holds, rights conditions and qualified review are resolved.


### National rollout step 256 - Bayawan historical display hold

Recorded national-visayas-negros-bayawan-historical-display-eligibility-20261030.json. The ledger remains internal research. Public display, a map projection and app-row admission are held because two printed coordinates have invalid DMS minutes, the January richness statement disagrees with Table 3, Butis sp. is genus-only, two name treatments are held, and no qualified review or publication approval exists.

This decision preserves the study as dated 2018-2019 historical evidence only. It does not claim present-day occupancy, whole-river range, fishability, diet, safety or legal permission. No app species, occurrence, geometry or public row was added.

**Next:** continue the independent freshwater source sweep for Negros and Siquijor in parallel. Revisit Bayawan only if an authoritative coordinate/table correction or qualified taxonomic review becomes available; do not map the invalid coordinates.

### National rollout step 257 - Señora River historical fish-study source review

Reviewed the publisher record and complete 14-page Silliman Journal PDF for Bucol and Catid’s Señora River study. The issue is Volume 52(2), July–December 2011 and the fieldwork ran February–May 2011; the article page also shows a later 2022 platform date. Three named stations span a headwater tributary at Capalasanan, the middle reach near Canclaran, and the estuarine reach at Simacolong. Coordinates are retained only as verbatim source metadata because no datum is stated.

The abstract and Table 1 footer report 33 fish species, but the Results paragraph reports 34. The river and estuary stations also must not be blended into one freshwater occurrence layer. Silliman Journal’s policy identifies the journal and authors as copyright holders; no open structured-data reuse license was found. Added national-visayas-siquijor-senora-river-fish-study-access-review-20261030.json and one source record (346 total). No fish names were transcribed, no geometry or app rows were added, and publication approval remains false.

**Next:** seek permission or written guidance before transcribing Table 1. Meanwhile review the publisher-hosted Bago River study and Pagatban River source separately, keeping their sites, dates, rights and evidence scope distinct.

### National rollout step 258 - Bago River historical fish study access review

Retrieved the complete 25-page 2010 Silliman Journal issue PDF from its alternate official host after the article-page download URL returned 404. The paper describes wet-season sampling in July–September 2009 and dry-season sampling in February–April 2010 at four selected Bago River stations. Table 1 links historical source-name labels to source-era ecological categories and station-by-season marks. The primary abstract text says 55 fishes; a 2014 Bugang River paper independently cites Bago as 55 species in 33 families, while the 2011 Señora River paper cites 56. The 55 figure is corroborated but the discrepancy remains unresolved.

Added national-visayas-negros-bago-river-2010-fish-study-access-review-20261030.json and one source record (347 total). The landing page platform date (2022) is distinguished from the issue date (2010). No species table or station matrix was transcribed; no occurrence, geometry or public app row was added. Silliman Journal copyright terms do not establish open reuse rights for a structured dataset.

**Next:** request guidance/permission before transcribing Table 1. Continue discovery for Pagatban, Ilog-Hilabangan and Siaton sources, and keep river-specific timeframes separate from regional completion counts.

### National rollout step 259 - Ilog-Hilabangan JICA fauna source access review

Reviewed the JICA report catalog, complete January 2010 Part II-B feasibility report, and its official Annex PIIB 9-1 biological survey. The annex describes visual checks of habitats/signs and interviews with residents, then presents five fish entries in a wider fauna table. It does not specify the fish survey date, taxon-specific evidence method, reach/station per label, coordinates, effort, counts or voucher specimens; several entries are genus-level. The main report's statement that there are no fisheries in the river is fisheries/use context and does not establish fish absence.

Added `national-visayas-negros-ilog-hilabangan-jica-fauna-access-review-20261030.json` and one source reference (348 total). No fish names were transcribed, no taxonomy or occurrence assertions were made, no geometry was created, and no app rows were added. The report is a project-site historical lead, not a river-basin inventory or current species baseline. Its public download is not treated as permission to redistribute structured fish data.

**Next:** continue source discovery for the Ilog estuary/diverted channel and Pagatban/Siaton systems. Keep estuary, fishery, aquaculture and upstream freshwater evidence distinct; retain the source-date and reuse holds.

### National rollout step 260 - Pagatban River mullet study and unpublished checklist lead

Reviewed the complete publisher-hosted 2012 Silliman Journal mullet study and the official university news item describing Bucol and Carumbana's unpublished 2010 Pagatban survey. The 2012 paper reports monthly Pagatban sampling in 2011 as part of a ten-taxon, fourteen-locality mullet study; its discussion distinguishes upper-midstream river evidence from taxa observed only in the downstream estuary. It is not a whole-river species inventory and contains no diet evidence. A Silliman University news item reports 61 species from the 2010 survey, but the primary report and species-by-site data were not found, so that number remains a discovery lead rather than a verified checklist or coverage count.

Added `national-visayas-negros-pagatban-mullet-source-access-review-20261030.json` and two source references (350 total). The Silliman Journal copyright policy is not an open reuse license; structured public reuse remains unapproved. No species table, map geometry, diet claim, occurrence assertion or app row was added.

**Next:** seek the original 2010 Pagatban report from the authors/NORSU or Silliman, then review Ilog estuary/diverted-channel and Siaton freshwater sources independently. Keep mullet morphometrics, whole-river richness, estuarine evidence and diet claims in separate evidence lanes.

### National rollout step 261 - Ilog estuary fishery, fish-kill, and checklist-source review

Reviewed the author-shared full text of Bucol, Dangan-Galon and Alcala's 2017 PeerJ Preprints version 1 and the later University of San Carlos Press fish-kill article. The preprint identifies CC BY 4.0, reports CPUE work in the Malabong outlet/main Ilog River Estuary over selected months from April 2013 to January 2014, and states that 85 fish species were known there. It explicitly defers fish diversity and taxonomic details to a separate paper in preparation, so the 85 count is not a checklist or regional completion denominator. The 2018 paper is a dated environmental-event study, not current water-safety information; its reported event range (22–26 April 2013) differs from the preprint's reference to 19 April 2013.

The 2018 article cites Oñate-Pacalioga and Peralta's 2016 diverted-channel study (Manila Journal of Science 9:91–104), but its article-specific primary record/full text was not retrieved. Added `national-visayas-negros-ilog-estuary-source-access-review-20261030.json` and three source records (353 total). No species list, occurrence, geometry, diet, current safety alert or app row was added. The 2017 preprint's CC BY license applies to that identified version only; the USC article's copyright notice and transfer policy do not provide permission for a structured derivative.

**Next:** seek the separate Ilog ichthyofauna/taxonomy checklist and primary 2016 diverted-channel text from their authors/institutions, then continue to Siaton and other Negros freshwater sources. Keep estuary, freshwater reach, historical fishery and safety-event claims separate.

### National rollout step 262 - Balinsasayao Twin Lakes fish-source status and project lead

Reviewed the official SUAKCREM June–September 2024 monthly report, a secondary 2012 report of a DENR-7 invasive-species inventory, and the abstract of a 2017 NAST biodiversity assessment. SUAKCREM recorded a 30 September 2024 planning meeting with Central Mindanao University for 2025 work and says PAMB had approved a proposal to assess water profile, plankton, macroinvertebrates and fish assemblage at Balinsasayao Twin Lakes. This is an approved proposal, not evidence of completed field sampling or released fish results. The NAST abstract's permanent-plot vertebrate inventory lists birds, mammals, reptiles and amphibians, not fish.

The 2012 Philstar report says a three-day DENR-7 inventory took place on 13–15 June and names *Tilapia mossambica*, *Gambusia affinis*, and *Cyprinus carpio* as fish found in the lakes. These are names as printed in secondary news, not independently taxonomically validated; the underlying inventory, lake-specific stations, methods and vouchers were not located. The broad 2010 Negros–Siquijor checklist separately mentions an introduced carp in the twin lakes; that tentative, island-wide compilation is not a current lake checklist. Also reviewed the 2023 Silliman University annual report, which says fieldwork for a separate two-hectare permanent-plot monitoring project awaited permit renewal, and the indexed abstract of Amoroso et al.'s 2017 NAST assessment, which lists birds, mammals, reptiles and amphibians but no fish group. Added `national-visayas-negros-balinsasayao-fish-inventory-source-status-review-20261030.json` and four source references (357 total). No current occurrence, geometry, diet, safety alert or app row was added.

**Next:** ask the SUAKCREM/CMU team and DENR Region VII for their primary 2025 study and June 2012 inventory, then review Siaton River's cited 2006 unpublished list and Lake Balanan independently. Keep each lake separate and treat approvals, planned surveys and secondary reports as leads rather than completed species evidence.

### National rollout step 263 - Siaton unpublished-report lead and Lake Balanan fish-source boundary

Reviewed the cited 2006 Carumbana Siaton River report through later publications and searched for the underlying report. A 2011 Silliman Journal paper cites it as reporting 33 fish species in 28 families, but provides no Siaton species list; the 2006 primary report and direct NORSU catalog/download record were not located. The official publisher-hosted 2010 Negros–Siquijor checklist PDF is now verified (correcting step 251's earlier ResearchGate-only access note). It documents a tentative broad compilation and May 2004–October 2005 Siaton collections at four stations, with samples donated to USNM; public access does not grant reuse permission.

For Lake Balanan, reviewed Oracion and Hiponia's 2009 community/ecotourism paper. Its nonprobability household interviews report local fishing and common catch categories, but do not provide taxonomic identifications, sampling stations, effort, dates by taxon or vouchers. This is livelihood context, not a fish inventory. Added `national-visayas-negros-siaton-balanan-fish-source-status-review-20261030.json` and two source records (359 total); corrected one source record and the earlier checklist access note. No species names, occurrence, geometry, diet, safety alert or app row was added.

**Next:** obtain the Carumbana 2006 report if available; otherwise reconcile named Siaton USNM lots in the 2010 checklist against museum/GBIF records. Seek a separate primary fish survey for Lake Balanan and keep household catch labels out of the species inventory.

### National rollout step 264 - Siaton USNM catalogue-number cross-check

Screened 15 numeric USNM lot identifiers cited in the Siaton section of the publisher-hosted 2010 Negros–Siquijor checklist against GBIF and the official Smithsonian NMNH Division of Fishes catalog. Fifteen GBIF queries using the exact pair `institutionCode=USNM` plus one `catalogNumber` each returned zero records. An unfiltered number-only check returned unrelated non-fish occurrences for the same numeric values, confirming that a numeric catalog number cannot be used alone as a match. The official NMNH Fishes query returned zero online records for the 15-number batch and for a single-number control.

This is a bounded negative online-index result, not specimen or biological absence: NMNH warns that its online catalog covers only part of its collection. Added `national-visayas-negros-siaton-usnm-catalog-crosscheck-20261030.json` and two source references (361 total). No fish list, occurrence, coordinates, geometry, diet, safety alert, public app row, or regional completion count was added. No checklist reuse right was established.

**Next:** request a direct NMNH lot confirmation and the original Carumbana 2006 Siaton report/crosswalk from NORSU or the author. In parallel, locate a primary Lake Balanan fish survey or BFAR/DENR fisheries source; continue keeping household catch labels separate from scientific species evidence.

### National rollout step 265 - Lake Balanan fish-source gap and environmental-data lead

Ran a bounded GBIF occurrence search for the exact locality phrase `Lake Balanan` in the Philippines. The 27 indexed records were all non-fish (6 Amphibia, 19 Squamata, 1 Aves and 1 Gastropoda). The alternate locality phrase `Balanan` returned three non-fish records, while the exact `waterBody=Lake Balanan` query returned zero. These are indexed-string checks, not an inventory or evidence that fish are absent. Targeted searches of NFRDI, Negros Oriental research pages and fish-inventory terms did not locate an accessible primary Balanan fish survey. The 2009 household study remains historical community context only.

Found an official BFAR Region VII eFOI lead titled for 2019–2021 Lake Balanan/Balinsasayao water-quality results, but its linked signed attachment had expired and direct retrieval returned HTTP 403. The public thread's reply also contains an apparent unrelated request description. Since the PDF itself could not be inspected, its data fields, completeness and terms remain unverified; it is not fish evidence or current safety information. A 2025 DOST-NRCP lake forum mentions Balanan stakeholder management discussions but supplies no fish survey results. Added `national-visayas-negros-balanan-fish-source-status-review-20261030.json` and three source references (364 total). No species, occurrence, coordinate, geometry, diet, safety alert, public app row, or completion count was added.

**Next:** obtain an inspectable copy of the BFAR attachment and ask NORSU, BFAR Region VII or Lake Balanan/PAMB managers whether a fish assemblage survey, station list or voucher record exists. Keep water-quality, fish-presence and current-safety evidence separate.

### National rollout step 266 - Lake Balanan iDigBio cross-provider screen

Queried iDigBio's record API using its documented full-text field syntax. The `locality` search for “balanan” returned 159 rows (30 amphibians, 85 birds, 7 gastropods, 7 mammals and 30 reptiles). The all-fields search for “Lake Balanan” returned 67 rows (30 amphibians, 6 birds, 1 gastropod and 30 reptiles). No returned row was a fish. This provides no fish occurrence evidence and does not establish fish absence. iDigBio states its records stopped updating on 8 May 2026, so the index is also time-bounded.

Added `national-visayas-negros-balanan-idigbio-locality-screen-20261030.json` and one source reference (365 total). No specimen row, species, occurrence, coordinate, geometry, diet, safety alert, public app row or completion count was added.

**Next:** keep seeking a primary Balanan lake fish survey through public university, BFAR and protected-area sources; prioritize reports with dates, stations, methods, taxon identifications and voucher links. Continue the Negros/Siquijor freshwater source sweep without turning text-search zeros into biological absence claims.

### National rollout step 267 - Bayawan City Nature Reserve undergraduate thesis access review

Reviewed the Foundation University Library catalog record for Ted Hubert Kent C. Gomez's 2024, 53-page Biology undergraduate thesis on freshwater fish occurrence and physicochemical parameters at Bayawan City Nature Reserve. Catalog metadata describes July-August 2024 sampling at three sites (61, 113 and 180 m elevation) and names `Barbodes sp.` and `Sicyopus zosterophorus`. The first remains genus-level; the second is currently valid according to Eschmeyer's Catalog of Fishes, but that name status does not verify the thesis specimen identification or local occurrence. The catalog says fish occurred at Sites 2 and 3 and none at Site 1 but does not map taxa to sites. Its summary gives conflicting p-value statements. The full thesis, station coordinates, methods/effort, vouchers and item-specific reuse terms were not retrieved. Foundation University's public archive description concerns theses/dissertations and does not confirm access terms for this particular undergraduate item.

Added `national-visayas-negros-bayawan-nature-reserve-2024-thesis-access-review-20261030.json` and two source records (367 total). No species assertion, occurrence, geometry, diet, safety claim, or app row was added; the thesis remains a research lead pending full-text and rights review.

**Next:** continue to an accessible, source-described inland-water fish study in Negros/Siquijor. If an institutional inquiry is later authorized, request methods, taxon-by-site evidence, voucher references and reuse terms for the Bayawan Nature Reserve thesis; do not send an inquiry without explicit authorization.

### National rollout step 268 - Negros Malaunay/Valencia molecular-record cross-check

Reviewed the SACNAS 2022 abstract describing molecular work on 40 freshwater gobies from Malaunay River; it does not expose species results and is separate from the *Barbodes tumba* conference title in Christopher E. Bird's CV. The Silliman University 2023 Annual Report's indexed text describes a *B. tumba* DNA-barcoding student project in Valencia during June-August 2022. The official 2023 report PDF was too large for direct retrieval, and its indexed passage spells one student's surname differently from the CV; no full project report or presentation was found.

The NCBI Nucleotide search for *B. tumba* plus “Negros Oriental” returned four exact records, MT646827.1–MT646830.1. Their GenBank flat files identify 655 bp partial mitochondrial COX1 isolates B_tum_VAL_02 through _05, submitted 21 June 2020, with `geo_loc_name=Philippines: Valencia, Negros Oriental`. They provide no collection date, named waterbody, coordinates, specimen voucher, or project/accession crosswalk. Because these records predate the 2022 project metadata and do not identify Malaunay River, they remain a separate municipality-level molecular lead.

The current Catalog of Fishes lists *B. tumba* as valid and Mindanao-endemic; a peer-reviewed 2019 population study reports Lake Lanao and three other Mindanao sampling sites. This makes the Valencia/Malaunay title a potentially important range-extension claim, not an impossible occurrence. EMB Region VII's indexed waterbody table places the Malaunay Spillway at a class boundary for Ocoy River, Sibulan, but does not establish that the conference's “Malaunay River” is the same feature. Added `national-visayas-negros-malaunay-valencia-molecular-record-crosscheck-20261030.json` and nine source references (376 total), and expanded the existing Silliman Annual Report record to cover the newly reviewed indexed passage.

No specimen or sequence was independently reidentified, no waterbody-level species or occurrence assertion was added, and no geometry, diet, safety/legal/catchability claim or app row was created. Public-app admission remains on hold pending primary poster/report access, voucher and accession crosswalk, collection provenance and river-name resolution.

**Next:** continue the Negros/Siquijor inland-water source search in parallel with the Balanan primary-survey gap. Retain the Valencia result as a priority evidence-retrieval lead and revisit only after a primary record links vouchers/accessions, date and site to the named river.

### National rollout step 269 - Banica and Ocoy River freshwater-eel CO1 evidence

Reviewed the complete peer-reviewed 2021 Melgar et al. CO1 study and the 11 NCBI accession records for its Negros Oriental specimens. The study and matching GenBank locality fields support historical *Anguilla celebesensis* evidence at Banica River (six BAN accessions) and Ocoy River (three Ocoy accessions), plus *A. interioris* (one accession) and *A. marmorata* (one accession) at Ocoy. The paper's study-wide sampling window is October 2018-January 2020, but it does not give collection dates per eel. It says voucher specimens were deposited at Silliman University's RB Gonzales Museum without reporting catalogue numbers. Sampling could involve either fish purchased from local fishers at a site or fish caught in the wild; the acquisition method is not assigned per accession.

Preserved the *A. celebesensis* record discrepancy: the paper says nine specimens overall and allocates six to Banica plus two to Ocoy (eight total), while Table 1 and matching GenBank records identify six BAN plus three Ocoy accessions. The paper's accession-list sentence omits MT647237 even though its Table 1 and GenBank identify it as *A. celebesensis* from Ocoy. The article gives source coordinates but no datum, and the Ocoy latitude differs slightly between sections. All coordinates remain verbatim; no point or geometry was generated.

Added `national-visayas-negros-banica-ocoy-eel-molecular-source-review-20261030.json` and two source records (378 total). The journal policy specifies CC BY-NC 3.0, so attribution and noncommercial terms apply; no public app reuse is approved. This is targeted historical eel evidence, not a full river checklist or a claim of current presence, abundance, safety, diet or catchability. No app species row or map point was added.

**Next:** continue the Visayas freshwater inventory separately from this eel-focused study, including independent Banica/Ocoy community surveys and river reaches; keep the historical molecular records and the unreviewed whole-river inventory gap distinct.

### National rollout step 270 - Eastern Visayas Lake Danao freshwater fish study

Reviewed Romero et al.'s 2023 peer-reviewed study and the official NFRDI repository record for Lake Danao Natural Park in Ormoc City, Leyte. The study combines 14 months of fisher-catch observations (March-September 2021 and December 2021-June 2022) with a separate July 2022 interview survey of 21 subsistence fishers. Its combined inventory reports eight fish taxa, while the catch table lists five and totals 1,462 caught individuals. The article says vouchers were photographed for validation by UP Visayas CFOS and donated to the UPTC Natural History Museum and Herbarium, but specimen catalogue numbers were not found in the reviewed text.

Cross-checked the 2021 ICFAS 6/AFSSRN F1 abstract, which reports an earlier March-August 2021 phase with 475 fish and four species. Its sampling interval is nested within the later article and author groups overlap, so the abstract may describe preliminary work from the same project. Exact sample overlap is unproven; do not add the counts or treat the reports as independent surveys. The article's source names and native/introduced classifications remain unverified, including an unclear *Oreochromis niloticus* introduction-year discrepancy between its table and discussion. The article PDF states CC BY-NC 4.0; publication into Bangwit is not approved. The discussion contains *Glossogobius giuris* and *Cyprinus carpio* diet leads, but no local diet analysis or bait recommendation is created.

Added `national-visayas-eastern-visayas-ormoc-lake-danao-fish-assemblage-review-20261030.json` and two source records (380 total). No species assertion, occurrence row, current-presence claim, lake geometry, diet card, legal/safety guidance or public-app row was added. Ormoc's Lake Danao remains separate from Lake Danao in Polangui, Albay and Lake Danao on Pacijan Island, Cebu.

**Next:** continue the freshwater sweep across the remaining Eastern Visayas lakes, rivers and streams, then reconcile sources by the region manifests. Crosswalk this study's eight names and search for newer fish sampling and voucher records; keep the 2021 conference abstract linked as a possible preliminary version, not an independent sample set.

### National rollout step 271 - Lake Danao eight-name nomenclatural cross-check

Cross-checked the article's eight printed scientific names against the current Eschmeyer's Catalog of Fishes. All eight names have valid current usages in the Catalog, so no source spelling or accepted-name string was changed. This only checks nomenclature; no specimen or Lake Danao occurrence was re-identified.

Two source claims remain specifically held. The article calls *Clarias batrachus* native, while the Catalog says its known native range is Java and notes it is introduced elsewhere; this is a material locality/origin conflict that needs its voucher and expert review. The article calls *Cyprinus rubrofuscus* “koi”; CAS and WoRMS list *C. rubrofuscus* as valid, but USGS documents the complex, changing taxonomy of domesticated koi, so the article's common name cannot identify the voucher by itself. The paper's *Oreochromis niloticus* introduction-year discrepancy remains a separate historical-source issue.

Added `national-visayas-eastern-visayas-lake-danao-eight-name-taxonomy-crosscheck-20261030.json` and three authority references (383 total). No article name was overwritten, no origin claim or specimen identity was approved, and no species, occurrence, diet or public-app row was added.

**Next:** pursue the higher-risk voucher and origin questions for the Lake Danao *Clarias* and koi records, then resume the Eastern Visayas freshwater discovery sweep. Keep taxa with accepted names in the source ledger but out of the public projection until evidence and reuse review are complete.

### National rollout step 272 - Ormoc Lake Danao catchment and overlapping-study audit

Reviewed the official VSU landing page for the 2007 freshwater guide titled for Tubod River, Lake Danao and the Inawasan River outlet. Its abstract reports 21 fish species, including 18 in Tubod River and one in Inawasan River, but does not expose the full list or allocate the other species by waterbody. The 2023 Lake Danao paper cites that guide for historical *Cyprinus carpio* and *Clarias batrachus* presence; because the primary guide PDF and its species-by-site details were not retrievable in this pass, those remain secondary cross-citations rather than independently checked occurrence rows. The guide's VSU record displays CC BY-NC-SA 4.0; no article content was copied.

Reviewed the full 2025 *Glossogobius giuris* population study. It reports 867 fish from landed catches sampled in March 2021-February 2022, a period overlapping the 2023 Lake Danao study, and shares three authors with that article. The publications are distinct, but no specimen crosswalk proves independent samples; do not combine 867 with the 1,462 catch total or count it as a second independent locality survey. The paper's locator coordinate is not a station-level species location, and its diet statements are sourced discussion rather than a new Lake Danao gut-content analysis.

Also found a completed FiBRe project listing at UP Tacloban and a DOST-NRCP page that still says “Ongoing” despite listing a 2020-2022 project period. Neither reviewed page exposed the final fish dataset or voucher catalog. Added `national-visayas-eastern-visayas-ormoc-lake-danao-catchment-and-overlap-review-20261030.json` and four source records (387 total). No current presence, new species row, combined catch count, diet, geometry, or public-app record was added.

**Next:** search official institutional repositories and public collection catalogs for the full 2007 guide, the completed FiBRe report, and voucher accessions. Keep the Ormoc Lake Danao cluster distinct from same-named lakes elsewhere, then continue to the next Eastern Visayas freshwater waterbody with inspectable source data.

### National rollout step 273 - MacArthur Lake Bito thesis and conference-version crosswalk

Reviewed the UPLB SESAM index entry for Kit Felian C. Tenio's 2023 Lake Bito thesis and the 2025 16th ICERD conference abstract by Tenio et al. Both report 354 freshwater fish, eight families, nine species, and a diversity index of 0.37. The shared lead author, core topic, and identical detailed aggregates make it likely that the conference abstract re-presents the thesis study, but neither record explicitly says so and no sample-level crosswalk was found. Keep two publication records but do not count them as independent surveys or add their totals together unless primary records resolve the relationship.

The accessible thesis-index entry and conference abstract give aggregate results but no taxon names, field methods/effort, station-level locations, voucher identifiers or named species list. The conference abstract calls the community's forage predominantly omnivorous; this is not species-specific diet evidence. A separate 2013 SEAFDEC repository record places Lake Bito in MacArthur and describes Nile tilapia aquaculture and open-water fishery, but exposes no fish checklist. This context cannot identify any of the later study taxa or establish current presence, lake geometry, current water quality, safety or legal catchability.

Added `national-visayas-eastern-visayas-leyte-macarthur-lake-bito-study-crosswalk-20261030.json` and three source records (390 total). No species names, occurrence rows, current-presence claims, diet cards, geometry or public-app records were added. Item-specific reuse terms for the thesis and conference abstract were not established; publication remains unapproved.

**Next:** search official VSU and UPLB repositories and public specimen catalogs for the full Lake Bito thesis, taxon list, methods and voucher accessions. Keep the nine-species aggregate as an unresolved study lead; continue other Leyte/Samar freshwater screening without converting the abstract into a checklist.

### National rollout step 274 - Lake Bito public occurrence and photo-lead screen

Ran a bounded GBIF occurrence API query for a rectangular discovery envelope around Lake Bito (68 records, limited to the returned page). The results were 59 birds, four insects, two flowering plants, one gastropod, one fern and one arachnid; none was classified in the fish groups screened. This is a narrow database/query result, not evidence that Lake Bito has no fish. The rectangle is not an official lake polygon or a survey boundary.

Found one additional taxon-level lead in a FishBase user-contributed photo: *Glossogobius giuris*, locality listed as Lake Bito, Macarthur, Leyte, uploaded by the 2023 thesis author. The FishBase page says identification is supplied by the uploader. It gives no collection date, length, specimen accession or crosswalk to the thesis study; the contributor match makes it a useful retrieval clue, not independent identification or a confirmed species row. No image was copied, and individual image terms were not cleared.

Added `national-visayas-eastern-visayas-leyte-macarthur-lake-bito-occurrence-leads-20261030.json` and two source records (392 total). No confirmed occurrence, species row, geometry, diet card or public-app content was added.

**Next:** continue the public institutional search for the full Lake Bito thesis and its vouchers. If the species table remains inaccessible, move to other independently documented Leyte/Samar freshwater sites while preserving the *G. giuris* image only as an unresolved lead; do not infer the missing species from an aggregate count or stocked-aquaculture context.

### National rollout step 275 - Burauen Lake Mahagnao historical fish-evidence review

Reviewed the full 2001 SEAFDEC proceedings paper *Bathymetry and hydrobiology of Lake Mahagnao, Leyte*. It describes 122 GPS stations for bathymetry and plankton sampling at nine stations, not fish sampling. Its fish note is explicitly based on resident interviews and names broad catch groups—tilapia, freshwater eel, carp and mudfish—along with snails and freshwater shrimp. These are not scientific taxon names, counts, dated captures or vouchers. The paper calls for future fish-stock and fishing-effort research; its statement about annual fish kills and its tilapia-stocking discussion are historical source claims, not current safety or stocking advice.

Screened every result in a GBIF occurrence query around the paper's Lake Mahagnao locator (1,331 records across five pages). The returned records covered birds, reptiles, insects, plants, invertebrates, mammals, amphibians, fungi and other non-fish groups; no record was classified as a fish. The search rectangle is not a lake/park boundary, and this limited database result is not evidence of fish absence. The 2013 SEAFDEC three-lake abstract also provides only historical monthly hydrology context, with no fish checklist.

Added `national-visayas-eastern-visayas-leyte-burauen-lake-mahagnao-fish-evidence-review-20261030.json` and two new source records (394 total), and linked the 2013 three-lake record to this review. No scientific fish name, occurrence, geometry, diet card, current safety/legal claim or public-app row was added.

**Next:** continue the Eastern Visayas freshwater sweep at distinct Leyte and Samar rivers/lakes. Revisit Lake Mahagnao only if an inspectable fish survey, scientific species list, or voucher crosswalk is found; do not turn its historical interview terms into taxonomic identifications.

### National rollout step 276 - Samar SINP nine-river stock-assessment abstract crosswalk

Reviewed the official NRCP metadata for two distinct Samar Island Natural Park freshwater projects and the full MSDI 2023 abstract proceedings. SSU's E-241 project description names a planned nine-river scope across Western, Eastern and Northern Samar; the University of Eastern Philippines' E-240 is a separate eDNA metabarcoding project. Both portal records list a 2020–2022 period but still say “Ongoing,” and neither page links a final fish dataset. An SSU news item confirms Prof. Diocton's stock-assessment research was featured at a December 2022 caravan, but publishes no checklist.

The proceedings contain two PID entries with the exact same stock-assessment title and authors. PID 2812 says three major rivers were each divided into three stations and reports six dominant indigenous fish species plus *Cestraeus* sp., without naming those rivers or fish. PID 5194 describes a different scope summary, names downstream *Macrobrachium* sp., and calls Ludong *Cestraeus plicatilis* “from the ‘deni point’ of the Ulot rapids to Basey, Samar.” The two abstracts may be alternate versions or related outputs; they are not counted as independent surveys. The species-level *Cestraeus* identification and the ambiguous “deni point” wording remain unresolved. The conference's “endangered” label also conflicts with the indexed IUCN 2020 assessment, which lists *C. plicatilis* as Data Deficient. A separate NFRDI source in this repository reports *C. goldiei* for analyzed Northern Philippines Ludong COI sequences, reinforcing the need for voucher-linked determination rather than merging vernacular labels.

Added `national-visayas-samar-sinp-nine-river-fish-study-abstract-crosswalk-20261030.json` and five source records (399 total). No species checklist row, occurrence, geometry, diet, safety/legal/catchability claim or public-app content was added. No source materials beyond bibliographic metadata and short research summaries were copied; publication remains unapproved.

**Next:** seek the final E-241 and E-240 reports, taxon-by-river/station tables, dates, effort, vouchers/sequence accessions and reuse terms through SSU/CFARRD and UEP/NRCP. Do not send inquiries without explicit authorization. Continue the Eastern Visayas freshwater sweep; the Samar-wide project plan and these abstracts do not complete the region.

### National rollout step 277 - Isabel Dupon River reconnaissance abstract review

Reviewed the 2019 DLSAU-hosted congress abstract book and its Dupon River entry for Isabel, Leyte. The abstract reports 13 fish species across 11 families and four reaches—estuary, downstream, midstream and upstream—but gives no field dates, gear/effort, named stations, species list, reach-by-taxon counts or voucher identifiers. It prints “Eliotridae” as one of the most represented families; preserve that source spelling rather than silently normalizing it. Because the survey includes an estuary, its aggregate is not a freshwater-only checklist.

The only reported species-level string in the abstract is “Ambacis miops,” assigned to “Centropomidae,” and reported as 53.65% of total catch. Eschmeyer's Catalog lists *Ambassis miops* as valid in Ambassidae and includes the Philippines in its broad Indo-West Pacific range; the catalog also lists *Ambassis* in Ambassidae and treats *Ambasis* as an unjustified emendation. This makes *Ambassis miops* a plausible intended spelling, but does not authenticate the survey specimen or its local identification. Preserve the abstract's string and family verbatim; do not add a corrected taxon or occurrence row. No item-specific structured-data reuse permission was found.

Added `national-visayas-eastern-visayas-leyte-dupon-river-fish-abstract-review-20261030.json` and three source references (402 total). No species assertion, occurrence, geometry, diet, safety/legal/catchability claim or public-app row was added.

**Next:** seek the full Dupon paper and ask its author to confirm the printed taxon string against diagnostics or vouchers, with dates, effort, reach-by-taxon results and reuse terms. Keep estuary and upstream freshwater evidence separate; continue the Eastern Visayas freshwater sweep.

### National rollout step 278 - Lawaan Poblacion and Bolusao Rivers poster review

Reviewed Jonh Rey L. Gacura's author-uploaded poster record for the 5th Undergraduate Research Symposium (May 2018). It describes sampling in Poblacion and Bolusao Rivers, Lawaan, Eastern Samar, during October-November 2017 and January-February 2018, using double gill nets, spears, and hooks-and-lines. The poster reports 205 individuals and 41 species for Poblacion, and 54 individuals and 15 species for Bolusao, with a between-river similarity index of 0.39. Do not add those separate richness values into a unique combined species count.

The source highlights selected names and migration/distribution claims, including *Eubleekeria jonesi* and *Ambassis interrupta*, but this pass did not validate a complete species-by-river list, reach crosswalk, field effort, or vouchers. The poster says Lawaan has seven river systems but reports only these two. Although the poster frames its work as freshwater research, it gives no station coordinates or salinity/tidal context and discusses migratory categories including oceanodromous; therefore do not treat every reported fish as confirmed freshwater-only. This is a separate Lawaan study, not part of the Samar Island Natural Park nine-river project.

ResearchGate flags that poster content may be subject to copyright; no item-specific reuse permission was found. Added `national-visayas-eastern-visayas-eastern-samar-lawaan-river-fish-poster-review-20261030.json` and one source reference (403 total). No species assertion, occurrence, geometry, diet, safety/legal/catchability claim, or public-app row was added.

**Next:** seek the full author-approved species list, exact station/reach and salinity context, field effort, voucher identifiers, and reuse terms; keep Poblacion and Bolusao separate. Continue the Eastern Visayas sweep across Leyte, Samar, and Biliran waters; this two-river poster does not complete Samar or Eastern Visayas coverage.

### National rollout step 279 - Leyte Gulf 2020 demersal trawl assessment

Reviewed the 2024 BFAR-authored journal article and full PDF. Its survey sampled 19 marine trawl stations in Leyte Gulf from 24 April to 8 May 2020, across waters by Leyte and Eastern Samar. The paper reports 4.22 tonnes and about 33,839 individuals; its 230 identified species include 202 fishes plus cephalopods, crustaceans, echinoderms, and molluscs. Fourteen samples (5.74%) remained unidentified. Selected leading fish names include *Photopectoralis bindus* (25.49%), *Gazza minuta* (7.42%), and *Pentaprion longimanus* (5.80%).

The paper provides 19 tow start/end coordinates and station-level depth, speed, and drag duration, but these are research tow tracks—not municipal-water limits or suggested fishing spots. The survey is short, historical, marine, demersal, and gear-specific. The article page says downloadable data are not yet available; a full fish species-by-station machine-readable table was not located. The article carries a CC BY-NC 4.0 license; no raw dataset terms were available. Its discussion of older trawl rules is not used as a current legal statement.

Added `national-visayas-leyte-gulf-2020-demersal-trawl-stock-assessment-review-20261030.json` and one source reference (404 total). No species assertion, occurrence, geometry, diet, safety/legal/catchability claim, or public-app row was added. This marine assessment remains separate from Leyte/Samar inland-water studies.

**Next:** seek the official BFAR survey dataset or full species-by-station table, identification/voucher details, and data reuse terms; do not send an inquiry without explicit authorization. Continue the Eastern Visayas sweep across freshwater, brackish, estuary, reef, and open-marine sources; the Leyte Gulf trawl does not complete coverage.

### National rollout step 280 - Silago coastal fishery profile evidence review

Reviewed the official Southern Leyte State University journal record and the full 2014 article text. The study reports 71 purposively selected artisanal/municipal fisherfolk respondents across four selected Silago barangays and describes interviews, focus-group discussion, and observation in December 2013. It is a short historical coastal fishery profile, not a standardized station-based species survey. The abstract reports 31 target-fish species, while the Results says 29 commercially important species including finfish and squid; the Conclusion again gives 31 fish and invertebrate species. The article does not resolve that discrepancy in the accessible text.

The named catch groups visible in the abstract are common names only (threespot angelfish, rabbit fish, emperor, grouper, and parrot fish). No scientific-name crosswalk or point-level fishing coordinates were established, so no taxon or occurrence row was normalized. Historical respondent CPUE and views about declining catch are not current catchability, stock-status, safety or legal guidance. The journal record states CC BY 4.0; the full text was inspected via a third-party PDF mirror, and no paper table or article content was copied into app data.

Added `national-visayas-eastern-visayas-southern-leyte-silago-coastal-fish-profile-review-20261030.json` and one registry record with two source URL references (405 total). No species assertion, occurrence, geometry, diet, safety/legal/catchability claim, or public-app row was added.

**Next:** continue separate Eastern Visayas freshwater, brackish, estuary and marine-source reviews; prioritize inspectable taxon lists and station-level evidence for Leyte, Samar and Biliran. Keep this Silago source as historical fishery context until the table, scientific names, per-barangay allocation and 29/31 discrepancy are independently resolved.

### National rollout step 281 - Leyte Gulf BFAR 2001-2011 landing-assessment review

Reviewed the full BFAR-authored article in the official DA-NFRDI repository. It summarizes NSAP monitored-landing data for 2001-2011 across centers in Leyte and Eastern Samar, with boat landings sampled about every two days (10-11 sampling days per month per area). Its catch tables describe historical gear and catch composition; they are landing/ground fishery data, not exact species coordinates or a complete present-day occurrence inventory.

Table 3 lists selected top-ten source names for 2001, 2006 and 2011. This review retained 17 distinct strings as research leads only, preserving source spellings. It does not promote them to accepted taxa or records: the table includes *Portunus pelagicus* (a crab), prints “Ratsrelliger kanagurta,” and has a family-label typo for *Gazza minuta*. The paper's wording that 142 “families” comprise animal-group counts summing to 125, plus its unclear 809/293 “species caught” numbers, is unresolved. No tables were copied; the article's reuse terms were not established.

Added `national-visayas-eastern-visayas-leyte-gulf-2001-2011-bfar-fishery-review-20261030.json` and one official-source registry record with two URL references (406 total). No species assertion, occurrence, geometry, diet, safety/legal/catchability claim or public-app row was added.

**Next:** keep these historical marine landing data separate from the 2020 trawl assessment and the freshwater records. Continue Eastern Visayas inland-water and brackish/estuary source discovery; independently validate any retained source-name leads before considering an app projection.

### National rollout step 282 - Ormoc Lake Danao and Tubod River 2007 guide full-text review

Retrieved and visually reviewed all 27 pages of the official VSU guide. The source prints 21 freshwater-fish names. Sixteen profiles explicitly give one or more localities; five do not. The printed abstract assigns 18 species to Tubod River, four to Lake Danao and one to Inawasan River, which totals 23 site incidences. The species profiles explicitly mention Lake Danao for five names, so the article does not reconcile its own site counts. Preserve those statements separately; do not infer disjoint inventories or select one count as corrected.

The guide's full name list does not include *Cyprinus carpio*, despite the 2023 Lake Danao study citing it as a 2007 source for carp context. The guide's *Clarias batrachus* profile names Tubod River, not Lake Danao. This remains a source-citation mismatch, not a confirmed carp record or Lake Danao catfish locality. Printed coordinates are malformed in places, and the guide has no specimen-voucher crosswalk or individual capture dates, so no geometry or occurrence row was added.

The introduction says food habits were investigated, while several profiles explicitly cite FishBase for diet notes. Provenance is mixed or unclear; the notes remain historical diet leads and are not local bait recommendations. The item record displays CC BY-NC-SA 4.0, while the journal footer displays CC BY-NC-ND. No prose, figures, or PDF pages were copied, and publication remains on hold pending rights clarification.

Added `national-visayas-eastern-visayas-ormoc-lake-danao-2007-guide-fulltext-review-20261030.json` and updated the existing source/catchment records; source count remains 406. No species row, diet card, occurrence, geometry, current-presence, safety/legal/catchability claim, or public-app content was added.

The guide cites three potentially valuable proceedings papers: a 2002 Tubod River feeding-ecology paper and two 2005 Lake Danao/Inawasan freshwater papers. A bounded public search found citation records but no standalone copy of those papers. **Next:** search institutional/library catalogs for those proceedings and inspect the papers if publicly available; keep all citation-only leads out of app data until their text, methods, site attribution, and rights can be checked.

### National rollout step 283 - Lake Danao/Tubod proceedings retrieval check

Ran targeted searches of VSU, Annals of Tropical Research and repository domains using the proceedings titles, author, river and year. The public Weliange CV and the 2007 guide's indexed reference list repeat the 2002/2005 bibliography, but neither exposes the papers themselves or a direct catalog/download item. This improves bibliographic confidence but adds no new fish, diet or site evidence. Search-engine non-discovery does not prove the proceedings are absent from an unindexed archive.

Updated the proceedings retrieval record within `national-visayas-eastern-visayas-ormoc-lake-danao-2007-guide-fulltext-review-20261030.json`. No new source row or species/diet claim was added. **Next:** leave the papers as citation-only leads unless a public copy surfaces, and continue Eastern Visayas freshwater work from independently inspectable records; no access inquiry was sent.

### National rollout step 284 - Lawaan poster partial species-table recheck

Rechecked the author-uploaded Lawaan poster's public ResearchGate text extraction. It exposes at least 32 distinct taxon strings in a partial migration/residency table, but the poster abstract reports 41 species for Poblacion River and 15 for Bolusao River. The table appears incomplete or has a different scope; the poster does not reconcile it. Several extracted cells are malformed, so no counts or additional names were copied into the source registry or app data.

Tried to retrieve the poster PDF and preview image for visual verification; ResearchGate returned an access restriction/cache miss. The linked UP Libraries TUKLAS catalog item also could not be independently opened. Updated the existing poster review and source record with this retrieval outcome. No new source record, occurrence, species assertion, geometry, diet, safety/legal/catchability claim, or public-app row was added.

**Next:** continue Eastern Visayas coverage from inspectable sources. Revisit the Lawaan table only if a publicly accessible and rights-cleared high-resolution poster or underlying report provides a complete species-by-river/reach crosswalk, station context, effort, and voucher identifiers; do not send an inquiry without explicit authorization.

### National rollout step 285 - Taft River fish-health abstract and basin-context review

Reviewed the EM-16-07 abstract in the publisher-hosted 2025 ICERD Book of Abstracts. It lists nine fish names—*Planiliza macrolepis*, *Siganus vermiculatus*, *Lutjanus fulviflamma*, *Megalops cyprinoides*, *Clarias batrachus*, *Channa striata*, *Anguilla japonica*, *Giuris margaritacea*, and *Scatophagus argus*—sampled from three Taft River sections. It gives no field dates, named reaches, sampling gear/effort, fish-by-section allocation, coordinates, salinity context, diagnostic details, or voucher IDs. Preserve the names as abstract-level leads only; do not assume every reach is freshwater or assign any fish to a particular reach.

The abstract presents fish-tissue heavy-metal and consumption-risk calculations, but the underlying methods and fish-by-site values were not located. A separate 2025 peer-reviewed study on Taft River Basin sediments reports sediment contamination and recommends additional biotic monitoring; it is not fish-tissue evidence and does not establish a present-day consumption advisory. A 2021 Science Council of Asia program lists a poster with the same title and presenter as the 2025 abstract, so the two communications may be versions of one project, not independent surveys; specimen identity between them is unverified.

Added `national-visayas-eastern-samar-taft-river-fish-abstract-review-20261030.json` and three source references (409 total). No normalized taxon, occurrence, geometry, diet, current safety/legal/catchability claim, or public-app row was added. No item-specific reuse permission was found for the abstract book; the sediment paper's CC BY-NC 4.0 license does not extend to the fish abstract.

**Next:** seek an openly accessible full fish report or author-approved dataset with collection dates, reach coordinates/names, salinity/tidal classification, gear/effort, voucher-linked IDs, fish-by-site contaminant results, full analytical methods, and reuse terms. Continue the Samar Island Natural Park river sweep and the rest of Eastern Visayas; Taft River Basin coverage remains partial.

### National rollout step 286 - Lawaan freshwater fish-count cross-source reconciliation

Cross-checked the Lawaan river-fish poster against public project summaries and the official Region 8 CBD workshop documentation report. A FASPS summary of a November 2017 presentation reports 23 fish in Lawaan freshwater systems; a June 2018 workshop report attributes 45 fish in Lawaan freshwater systems to a GDFI presentation; the separate Poblacion/Bolusao poster reports 41 and 15 species respectively. The separate river values are not a unique combined count, and none of the sources provides a complete scope/date/site/taxon crosswalk that reconciles the figures. The March 2017 accomplishment-report metadata says freshwater technical-report preparation was 15% complete at that date; this is only a dated project-status note.

FASPS exposes the metadata summaries but gates the underlying reports behind login/register and survey completion. The documents were not accessed. The official 2018 workshop report is publicly readable but gives no fish names, methods, dates, station allocation, or vouchers in the relevant passage. Kept all figures as source-bounded historical aggregates; no source names were normalized into species, no occurrence/geometry/diet/safety/legal/catchability claims or public-app rows were added, and no reuse permission was established.

Added `national-visayas-eastern-samar-lawaan-fish-count-crosswalk-20261030.json` and three source records (412 total); linked the cross-source discrepancy in the existing poster review. No FASPS account, survey, or access request was submitted.

**Next:** continue the Eastern Visayas waterbody sweep with one openly inspectable study per waterbody, keeping freshwater, brackish/estuarine, and marine evidence separate. Return to Lawaan only if a public, rights-cleared final freshwater report or complete site-by-taxon dataset becomes available.

### National rollout step 287 - BFAR Region 8 2025 BASIL inland-water discovery queue

Reviewed BFAR Region 8's inland-fisheries campaign article. It names six 2025 BASIL program-target waters: Loog Dam and Bugasan Dam (Basey, Samar), Haropohop Swamp (Biliran), Amantacop River (Borongan, Eastern Samar), Libertad Dam (Lavezares, Northern Samar), and Hubas Dam (Pastrana, Leyte). The article describes resource profiling, capacity-building, restoration, management, and monitoring as program components, but does not report biological survey completion, fish names, methods, or site-level results.

Added the six names as source-bounded discovery leads only in `national-visayas-eastern-visayas-bfar8-basil-inland-waters-2025-discovery-20261030.json` and registered one official source (413 total). No fish presence, species, geometry, stocking, safety/legal status, or public-app row was inferred. The absence of a named Southern Leyte target in this specific list does not indicate absence of inland waters or fish evidence there.

**Next:** seek inspectable BFAR resource profiles or final monitoring outputs for the six sites, then review species and freshwater/brackish reach context separately. Keep the full six-province regional waterbody inventory open; these 2025 program targets are not a complete inventory.

### National rollout step 288 - Ulot River Ludong repository-record crosswalk

Found a Samar State University research-repository record for a 2025 study titled *Population Parameters of River Mullet “Ludong” (Cestraeus sp.) in Ulot River, Paranas, Samar, Philippines*. The searchable Gov-AIdeaS mirror exposes metadata and a truncated abstract that mentions FiSAT length-frequency analysis, but its canonical SSU-hosted URL could not be retrieved in this review and the complete details/file require registration according to the mirror. No account was created and no gated file was requested or downloaded.

The record reports *Cestraeus* only to genus, so it does not resolve the 2023 Samar abstract conflict between *Cestraeus* sp. and *C. plicatilis*. Sampling dates/reaches, salinity context, effort, vouchers, uncertainty, the full analysis and reuse terms remain unknown. Logged it as a low-confidence bibliographic lead in `national-visayas-eastern-samar-ulot-cestraeus-population-research-lead-20261030.json` and the Samar crosswalk; registered one source reference (414 total). No species, occurrence, population-status, harvest, legal/safety, geometry or public-app claim was added.

**Next:** verify the record through an independently confirmed SSU route and determine whether it is E-241's final report or a separate output. Continue the Eastern Visayas waterbody sweep while leaving the metadata and FiSAT claims research-only; do not register for gated details without explicit authorization.

### National rollout step 289 - Olo-Olo Batangas mangrove eDNA site review

Rechecked the 2026 primary mangrove eDNA paper for its Batangas site. The methods identify Olo-Olo Mangrove Forest and Ecopark in Lobo as the sole Batangas site, sampled during the December 2023-January 2024 Amihan period at three fringe-mangrove stations. The results narrative names two Batangas eDNA detections, *Epinephelus fuscoguttatus* and *Hippocampus kuda*; the Catalog of Fishes name checks support accepted names, not local detections. The reported Batangas range of 45-71 OTUs is not a species count.

The publisher says Tables S1-S2 hold station/environment rows and annotated OTUs. Its official workbook link returned HTTP 403, so station-level names, dates, read counts, coordinates and salinity values remain uninspected. The paper's version-of-record license is recorded as CC BY-NC-ND 4.0; no separate reuse license for the workbook was verified. eDNA is retained as a dated site-level research lead, not a catch, abundance, resident population, diet, catchability or current-presence claim.

Added `calabarzon-olo-olo-mangrove-edna-review-20261031.json`, linked the source to the Olo-Olo scope entry, corrected the live CALABARZON count to 113 waterbody leads, and created `calabarzon-coverage-denominator-profile-20261031.json` (113 leads, 94 distinct assigned source references; geometry remains undelineated and public admission remains zero). Registered one taxonomy cross-check source (415 source records total). No normalized species assertion or public-app row was added.

**Next:** continue L1 CALABARZON with independently reviewable inland and coastal sources. Revisit the blocked workbook only if it becomes accessible through an authorized route or a reusable alternative appears; do not advance to NCR until CALABARZON's region-exit criteria and residual gaps are reviewed.

### National rollout step 290 - Lake Sampaloc flowerhorn source review

Reviewed the official World Aquaculture Society pages for a March 2026 magazine article, its matching 2025 meeting abstract, and the Ateneo Archium record. The title and author team match, so the abstract and article are treated as versions of one research lineage, not independent surveys. The article provides qualitative field/local-report labels for Flowerhorn or Midas cichlids (*Amphilophus* spp., also described as hybrids) and Jaguar cichlids (*Parachromis managuensis*). It describes *Oreochromis niloticus* and *O. aureus* as fish-pen stock; that does not establish wild-lake occurrence. The hybrid/genus label does not resolve a binomial, and the source does not supply a complete species checklist, standardized effort, dates for its main field observations, vouchers, or a station-level table.

The article summarizes Flowerhorn diet as omnivorous from Yamamoto and Tagawa (2000), and describes Jaguar cichlids as piscivorous from Dadiono and Murti (2023); neither cited work was independently reviewed here. These are secondary-literature leads, not local gut-content findings or bait advice. The article's approximately 20 interviews and 10 shoreline transects are proposed future work, not completed study effort. Its consumption precaution is not a current official health advisory, and its BFAR/LLDA permitting suggestions are not adopted as legal rules. The WAS issue footer states All Rights Reserved; no open article license or item-specific Bangwit reuse grant was found.

Added `calabarzon-sampaloc-flowerhorn-source-review-20261031.json`, linked two source references to the existing Lake Sampaloc lead, and updated the 113-lead denominator profile to 96 unique source references (417 registry sources total). No normalized species, diet, occurrence, safety/legal claim, geometry, or public-app row was added; the 2017 seven-lake species rows remain held pending item-specific rights review.

**Next:** independently review Yamamoto and Tagawa (2000) and Dadiono and Murti (2023) before any diet or predator-prey profile; seek voucher/method detail and reuse terms for the Sampaloc field observations; continue the remaining CALABARZON freshwater, brackish, and coastal source review before considering region exit.

### National rollout step 291 - Taal Lake Jaguar Guapote diet and Sampaloc citation cross-check

The Sampaloc article's Jaguar-cichlid diet citation was checked against the official Clarias journal page. Dadiono and Murti (2023) is about Flowerhorn fish in Sempor Reservoir, Indonesia; its abstract describes desk study and informant field observations and reports no Jaguar cichlid or gut-content result. It does not support the Sampaloc article's *Parachromis managuensis* diet statement.

An independent Taal Lake lead was found in the UPLB repository record for Agasen et al. (2006). Its abstract describes Jaguar Guapote as piscivorous and reports fish at 56.40% among major gut items. A third-party whole-volume text mirror, not an official or authenticated article file, reports 50% fish, 40% crustaceans (including small shrimps), 7% gastropods (small snails), and 3% insects (dragonfly nymphs) in the body text. The conflict is unresolved; neither percentage is selected as correct. The mirror's article text states the broader study ran March 2005-February 2006 and mentions 16 ecological stations, but does not establish the diet-specific sample count, dates or station allocation. UPLB marks the full item unavailable in its record, and no item-specific reuse terms were found. Keep this as a historical Taal research lead; do not transfer it to Sampaloc or present it as a current or fixed species-wide diet.

The USFWS Midas-cichlid risk summary provides a secondary diet synthesis specifically for *Amphilophus citrinellus*, while its Jaguar summary gives general secondary context and lists the Agasen paper among references quoted but not accessed. FishBase reference metadata verifies the bibliographic identity of Yamamoto and Tagawa (2000), but the book itself was not reviewed. These sources do not resolve the Sampaloc genus/hybrid identity or establish a local gut-content profile.

Added `calabarzon-sampaloc-diet-citation-crosscheck-20261031.json` and four source records (421 registry records total); linked the Agasen abstract to the existing Taal Lake research lead. The CALABARZON denominator remains 113 waterbody leads with 97 distinct assigned source references. No species occurrence, diet assertion, bait recommendation, safety/legal statement, or public-app row was added; no publication approval was granted. Palico-Lian's 12 admitted and 3 held assertions remain unchanged.

**Next:** continue the L1 freshwater, brackish, estuary, and coastal review with the next site-specific, inspectable source. Keep Taal's Jaguar diet as an abstract-only research lead unless full methods and reuse terms are verified; do not transfer it to Lake Sampaloc.

### National rollout step 292 - Bacoor City profile Manila Bay fish-list attribution check

Reviewed section 2.11.12 of the official Bacoor City Ecological Profile. It attributes a displayed fish list to Biodiversity Management Bureau records for important biodiversity areas in Manila Bay, but gives no underlying dataset identifier, collection dates, methods, stations, vouchers, or assignment to Bacoor Bay or the named Bacoor rivers and creeks. The adjacent Bacoor MPA/aquaculture context does not supply that missing waterbody-level link. Several displayed scientific-name strings also have spacing or spelling irregularities; without the cited source records, they were not normalized into candidate occurrences.

Recorded the result in `calabarzon-bacoor-clup-manila-bay-fish-list-context-review-20261031.json` and linked it to the existing city-profile source record. No species, waterbody-specific occurrence, taxonomy, safety, or public-app assertion was added. No region coverage count changed; CALABARZON remains incomplete.

**Next:** continue L1 with the next inspectable primary source that can be tied to a specific inland or coastal waterbody. Keep the profile's Manila Bay list unassigned unless the underlying BMB records and locality basis are recovered.

### National rollout step 293 - Caliraya largemouth-bass historical-source cross-check

Reviewed four linked sources for the Caliraya largemouth/black bass lead. A 1987 SEAFDEC/AQD article describes an introduction and makes a strong claim about native-fish decline, but the reviewed passage gives no sampling design, dates, catch series, or fish-by-species data. The article says it is based on a 1986 Haribon Foundation study. A 1990 Philippine Institute for Development Studies literature survey reproduces an abstract-only citation for Guerrero III and Manalili's reservoir-management chapter; that abstract reports a historical Caliraya catch summary and bass stocking for sport, but the original 1988 proceedings chapter was not retrieved and the abstract has no survey methods or effort. A 2014 Philippine Journal of Science review says *Micropterus salmoides floridanus* was recorded as introduced in 1985 and believed established in Lake Caliraya, while also stating that there was no report on the species' invasiveness; it cites Juliano et al. (1989), whose chapter was not located.

This is a historical literature lead, not a current occurrence record or a measured impact study. The tension between the 1987 impact narrative and the 2014 review remains unresolved. The broad carnivore wording does not supply local prey or gut-content evidence, so no diet card or bait suggestion follows. Added four research-only source records and `calabarzon-caliraya-largemouth-bass-history-review-20261031.json`; linked them to the Caliraya reservoir scope and refreshed the denominator profile. No new species assertion, diet assertion, geometry, public row, or publication approval was added; regional coverage remains incomplete.

**Next:** continue the L1 CALABARZON freshwater, brackish, and coastal source sweep with a primary, inspectable, site-specific fish source. Revisit the cited Juliano et al. chapter only if an inspectable legitimate copy surfaces.

### National rollout step 294 - BCIB Cavite freshwater and estuarine fish-evidence crosswalk

Reviewed the relevant stream-ecology sections of the official [AIIB-hosted Bataan-Cavite Interlink Bridge final EIA](https://www.aiib.org/en/projects/details/2023/_download/Philippines/2023-November-final-EIA-report.pdf). The report describes surveys in 2021 and 2022 at one Labac River ecology station, one Timbugan Creek station, six Timalan River main-stem stations and one unnamed Timalan west-branch station. The fish-summary method is observation of local fishing and discussions with local residents about fish, abundance and catch effort; the reviewed sections do not provide a standardized fish-capture protocol, vouchers, fish-specific dates or taxon-by-station allocation.

The Labac summary names *Oreochromis niloticus* and *Mugil cephalus* in a subsistence-fishing context, without tying either label to its one ecology station or a specific catch date. Timalan main stem lists *O. niloticus*, *Sarotherodon melanotheron*, *Glossogobius giuris*, Hemiramphidae spp. and Tetraodontidae spp.; the last two are family-level labels, so only three entries are binomial species names, and none is assigned to individual stations. The EIA describes a source-era upstream-freshwater/downstream-estuarine gradient, not a current whole-river salinity classification. Timbugan's one lower-segment station had no fish or fishing observed/reported and upstream segments were not surveyed. The unnamed west branch's one selected location likewise had a bounded non-observation. Neither result establishes watercourse-wide fish absence.

Added `calabarzon-bcib-cavite-watercourses-fish-review-20261031.json`, registered the Timbugan Creek research lead and linked the source review to Labac/Timalan. CALABARZON now has 114 named waterbody/habitat leads, including eight streams; 34 remain queued, 109 have unknown salinity, all 114 lack validated geometry, and the profile has 101 assigned source references. Updated the existing EIA source row and denominator profile. No normalized occurrence, current-presence, complete-inventory, diet, safety/legal claim, geometry or public-app row was added; reuse permission remains unverified.

**Next:** continue the L1 CALABARZON inland/coastal source sweep with an independently inspectable survey that resolves site, station, sampling method and taxa. Prioritize a freshwater or brackish site that is not already covered by an EIA context note; keep the four BCIB watercourse findings research-only until identity, station assignment and reuse gaps are resolved.

### National rollout step 295 - San Pablo Seven Lakes secondary fish-context review

Reviewed the 2021 Elsevier chapter [“Socio-economic and environmental impacts of COVID-19 pandemic: Building resilience of the seven lakes of San Pablo city, Philippines”](https://doi.org/10.1016/B978-0-323-85512-9.00012-7) through its article-specific PMC OAI-PMH record. The chapter summarizes a historical 1940-1960 fish-diversity list and a figure caption describing fish labels for the seven-lake cluster during 2001-2020. It does not give fish-by-lake assignments, survey stations, vouchers, or a standardized sampling method. Its prose says two native taxa remained present from 2001 onward while also mentioning additional native taxa; the figure caption uses a 2001-2020 period. Those statements are unclear and are not a current checklist.

The chapter attributes pandemic-era reports of red-devil and jaguar-guapote increases and predation on juvenile cultured fish to a FARMC personal communication. It contains no gut-content sampling or measured prey data, so this remains a historical predation lead rather than a species diet profile. Its tilapia cage-culture history likewise does not prove wild occurrence in each lake. PMC metadata states Elsevier copyright and a conditional COVID-19 resource-center research-reuse permission; no figure, table, image, or public-app reuse was approved.

Added `calabarzon-seven-lakes-secondary-fish-context-review-20261031.json` and one research-only source record. CALABARZON remains at 114 research leads; no waterbody assignment, species assertion, taxonomy crosswalk, diet row, geometry, safety/legal claim, or app projection changed. Refreshed shared registry provenance; Palico-Lian remains unchanged at 12 admitted and 3 held assertions.

**Next:** seek the chapter’s underlying lake-specific sources and a rights-cleared survey with explicit lake, station, date, method, and taxon records. Keep collective Seven Lakes statements out of individual lake checklists.

### National rollout step 296 - San Pablo Seven Lakes 2019 gill-net survey review

Reviewed the 2023 Springer chapter [“Ecological Carrying Capacity Modeling and Sustainability Assessment of the Seven Lakes of San Pablo City, Laguna, Philippines”](https://doi.org/10.1007/978-981-99-0131-9_25). It describes overnight gill-net sampling of wild fish with local fisherfolk in each lake, using different mesh sizes, from 5:00 PM to 7:00 AM. The results say 620 fish were collected during July-August 2019 at the onset of the wet season: Bunot 379, Sampaloc 68, Mohicap 62, Pandin 42, Palakpakin 30, Yambo 24, and Calibato 15. These are historical study sample totals, not present abundance or completeness estimates.

The narrative names *Amphilophus* sp. (red devil) in Bunot and Sampaloc and *Oreochromis niloticus* in Sampaloc, Bunot, Yambo, Calibato, and Palakpakin, without giving per-lake counts. These are partial, source-reported associations; the two unmentioned lakes are not treated as absences. Figure 25.29 captions 15 cluster-level specimen labels, but does not assign each label to a lake. It calls red-devil forms *Vieja* sp. while the narrative uses *Amphilophus* sp.; this taxonomy conflict remains unresolved. The separate PRA/community-perception table was not merged with the gill-net results. No diet evidence was found.

Springer labels the chapter subscription content, and its front matter states that the work is under exclusive license to Springer Nature Singapore. The public ResearchGate full-text upload is labeled author content and may be subject to copyright; no local copy, image, table, or figure was retained. No item-specific Bangwit reuse permission was verified. Added `calabarzon-seven-lakes-2019-gillnet-survey-review-20261031.json` and one source record (427 total); linked the survey scope to the seven existing lake leads and refreshed CALABARZON/Palico provenance. The denominator remains 114 waterbody leads, now with 102 distinct assigned source references. No normalized species assertion, diet, current presence/absence, geometry, safety/legal statement, or public-app row was added; publication approval remains false.

**Next:** obtain the underlying fish-by-lake/specimen matrix, voucher or identification crosswalk, and item-specific reuse permission. Resolve the red-devil source-label conflict before considering species rows; keep 2017/2019 study observations historical and do not infer current presence or absences. Then continue the remaining CALABARZON inland, brackish, and coastal evidence sweep.


### National rollout step 297 - Avalar Manila Bay EISR fishery-context review -- 31 October 2026

Reviewed the official EMB search-index excerpts for the 2021 Avalar seabed-dredging EISR. The report describes marine-ecology work during 20-27 May 2021 and actual fishing documentation on 20 and 22 May. Its mixed evidence table includes documented swimming-crab catches and separately reported key-informant fishery observations; a broader fish list groups fishing grounds across Rosario, Noveleta, Cavite City, Kawit and San Nicolas Shoal. The indexed material does not assign each fish label to a specific station, municipality, capture date or voucher. Direct PDF opening returned HTTP 403, so the complete report and page layout were not independently reviewed.

This is a distinct EIS from the previously reviewed Island C report, but the source data and survey independence have not been compared. It is linked only as historical shared Manila Bay context. No fish taxon names, species assertions, diet, geometry, safety/legal statement or public app row were added. No item-specific reuse terms were verified; publication approval remains false. CALABARZON remains at 114 waterbody/habitat leads with 103 distinct assigned source references; the fish baseline is incomplete. See calabarzon-avalar-manila-bay-eis-fisheries-review-20261031.json.

**Next:** seek authorized access to the full Avalar EIS and compare its station-to-catch materials with the Island C and NFRDI Manila Bay sources; only then assess species identity, site attribution and reuse. Continue the inland-water source sweep in parallel; do not infer current presence or absences from these historical project documents.


### National rollout step 298 - Tayabas River 2013 full-text and methods follow-up — 31 October 2026

The official PJS PDF for Paller et al. (2013) is now readable in the journal's web text viewer. Its methods describe a 2010 survey with three reaches, three stations per reach, three runs per station, and 18 samples. The paper reports 1,070 collected individuals and 15 species in aggregate. It describes the river as approximately 8.5–9 km through Tayabas and Lucena to Tayabas Bay; no station coordinate list or verified channel geometry was added.

The methods assign February 2010 to wet season and September to dry season, but the study-site section says the site is dry from November through April and wet in the remaining months. Retain the source conflict and do not map season-specific results to those months. PJS describes itself as open access, and its current author guide describes a copyright-transfer form for accepted manuscripts; neither establishes the article-specific reuse rights for this 2013 item. No species table entries were transcribed, no taxonomy crosswalk or species assertion was added, and no public app row was approved. The historical 15-species aggregate is not a current inventory. See `calabarzon-tayabas-river-fulltext-review-20261031.json`.

Updated the existing source record, Tayabas scope status and denominator provenance. CALABARZON remains at 114 named waterbody/habitat leads and 103 distinct source references; fish evidence remains incomplete. Palico-Lian assertions were not changed.

**Next:** seek item-specific permission or independently reusable Quezon freshwater evidence; continue the CALABARZON inland, brackish and coastal sweep in parallel. Keep Tayabas study taxa, station placement, month-season association, and geometry unresolved pending rights and source-level crosswalks.


### National rollout step 299 - Tikub/Ticub Lake name-variant crosswalk — 31 October 2026

Reviewed the publisher page for Anastacio and Brillo (2020), “Potentials for Ecotourism Development at the Tikub Lake.” The page supplies the exact keyword wording “Tikub Lake (or Tikob, Ticob, Ticub Lake),” locates the lake in Tiaong, Quezon, cites the separate 2014 fish survey, and states CC BY 4.0. The article page, abstract, keywords, references and license were reviewed; its PDF and XML export were not retrieved.

Added `Tikob` and `Ticob` as source-spelled aliases to the existing `Ticub Lake` research lead, registered the 2020 source and `calabarzon-tikub-lake-identity-review-20261031.json`, and refreshed denominator and Palico provenance. CALABARZON remains at 114 named waterbody/habitat leads; distinct linked source references increased from 103 to 104. This article adds identity context only. The separate 2014 fish survey remains a historical lead with nine species reported in its abstract; its full text is login/registration-gated and item-specific reuse terms remain unresolved. No species table data, taxonomy, current presence, water-quality/access assertion, geometry, public app row or publication approval was added.

**Next:** continue source screening for the remaining CALABARZON freshwater, brackish and marine leads. Prioritize rights-cleared fish evidence and resolve the 2014 Tikub fish survey's access and reuse basis without treating its abstract as a complete or current checklist.


### National rollout step 300 - San Juan River CALAX multi-river fish-context review — 31 October 2026

Reviewed the official [EMB-hosted CALAX Cavite-section EIS](https://eia.emb.gov.ph/wp-content/uploads/2018/03/EIS-CALAX-final.pdf) and its [official listing](https://eia.emb.gov.ph/?page_id=1806). The EIS describes its project corridor as within the San Juan River watershed and lists four named rivers for water-quality sampling. Separately, it gives a broad common-fish context for rivers in the study area, using genus-level or broader labels. The report's general fauna method combines field techniques with informal interviews, but supplies no fish-specific method, date, station, voucher, or per-river taxon assignment. Its 2012-2015 project survey window is not a fish collection date.

Added `calabarzon-san-juan-calax-multiriver-context-review-20261031.json` and one official EIS source record (430 total). Linked the source to San Juan River only as watershed/study-area context and changed the lead from `not-reviewed` to an explicitly unassigned, historical multi-river fish-context status. CALABARZON remains at 114 named leads and 105 distinct linked source references; 25 leads remain in the fish-evidence-not-reviewed list. No species assertion, current presence, water-quality/safety conclusion, geometry, diet, or public-app row was added; item-specific reuse terms remain unverified.

**Next:** keep seeking an inspectable, fish-focused and station-resolved source for San Juan River, including the detailed survey cited by the JICA summary. Continue regional source screening in parallel; do not turn broad EIS wording into waterbody-level species records.


### National rollout step 301 - Maragondon River Estuary BMS/BAMS results search — 31 October 2026

Followed up the official 2022 SCS SAP evaluation, which says biodiversity monitoring at Ternate Marine Park was planned for four BMS stations twice yearly and BAMS every three years. It does not document that those visits occurred or provide dates, station coordinates, fish taxa, or results. A bounded public web-index search of DENR, CALABARZON, Cavite, and Ternate terms surfaced the same plan and broader coastal-habitat material, but no completed fish-results report attributable to Maragondon River Estuary. The official Cavite Ecological Profile 2024 provides provincial fisheries and coastal-habitat context, not a fish station-to-estuary crosswalk.

Added `calabarzon-maragondon-estuary-fish-results-search-review-20261031.json` and linked it to the existing SCS SAP source record. This is a retrieval gap only, not evidence that monitoring did not occur or that fish are absent. CALABARZON remains at 114 named leads, 105 distinct source references, and zero validated geometry; 24 leads remain in the fish-evidence-not-reviewed list. No fish assertion, river-to-estuary transfer, geometry, salinity update, or public-app row was added.

**Next:** seek completed BMS/BAMS reports through an official Ternate Marine Park/PAMO or Cavite PENRO channel. Request station-to-habitat linkage, survey dates, methods, taxon rank and identification support, and reuse terms. This remains an unsent research inquiry; no contact was made.


### National rollout step 302 - Naic-Rosario (Wawa) River historical catch review — 31 October 2026

Re-reviewed the official EMB Island C EIS through its actual-fishing table and figure. AFE4 is described near proposed Island E at Wawa River, with an approximately 5 kg “Tilapia” catch inside Wawa River over four hours (reported CPUE 1.25 kg/hour). The report also names a Naic-Rosario (Wawa) River in its project-area plankton context. This supports a source-named river research lead distinct from the nearby Wawa River estuary, but does not delineate the reach or establish that AFE4 lies inside the estuary feature.

The EIS table heading says November 2018, while the figure caption spans November 2018 and February 2019; its narrative, table and figure also differ in encounter count/labels. No exact AFE4 date is inferred. The catch row identifies only “Tilapia”; a separate broad fish list is not crosswalked to AFE4, so no scientific species or species assertion is assigned. Exact encounter coordinates were withheld. Item-specific reuse terms remain unresolved, and the catch is not a current-presence claim, standardized inventory, or public app record.

Added `ph-wb-naic-rosario-wawa-river` as a separate source-named research lead and `calabarzon-naic-rosario-wawa-river-island-c-catch-review-20261031.json`; linked the reviewed source and refreshed the denominator profile and hashes. CALABARZON now has 115 named waterbody/habitat leads, 57 river leads, 105 unique source references, 24 fish-evidence-not-reviewed leads, zero validated geometries, 9 imported species assertions and zero public records. The regional baseline remains incomplete.

**Next:** resolve the AFE4 reach/date, “Tilapia” identification and source reuse terms; do not merge this river with the Wawa estuary or Cañas watershed Wawa sampling site by name alone. Continue independent freshwater and coastal source review while those identity and rights questions remain open.


### National rollout step 303 - Imus River watershed and historical fish-gap review - 31 October 2026

Reviewed PEMSEA's official 2020 Imus River pollution baseline and the 2022 ASEANO watershed-mapping report. The 2020 baseline says a detailed Imus River study had not yet been conducted at publication. Its fewer-than-20 fish summary concerns nearby Cañas, Pasong Camachile and Timalan watershed studies, without a species list or assignment to Imus River or any one neighboring river. A separate 148-metric-ton fish-and-prawn figure covers aquaculture across the combined Imus-Ylang-Ylang-Rio Grande water-quality-management area, so it is not wild-fish evidence for a named river.

The 2022 report describes a 5-meter-DEM-derived watershed map, 11,259.80 hectares of drainage area, 56 perennial streams, 186.15 km of total stream length and 36 river segments. It supplies no fish inventory or reusable vector geometry in the reviewed materials. The reports' watershed areas (168.1 km2 versus 11,259.80 ha) and channel lengths (36.7 km versus a cited 38.4 km) remain unreconciled; no measurement or map was adopted as a boundary.

A bounded follow-up search found an official CvSU Research Center listing for a “Bio-physical Characterization, Vulnerability and Pollution Assessment in Imus River Watershed” project scheduled for November 2020 to April 2021. The project page does not expose its report or fish-specific results. A wider search surfaced water-quality and pollution studies, but no later Imus fish checklist; this is a search limitation, not evidence that no such study exists.

Added `calabarzon-imus-river-watershed-baseline-review-20261031.json` and three official PEMSEA/CvSU source records. Linked the watershed reports and CvSU project lead to the Imus River research record and refreshed the denominator profile and raw-byte hashes. CALABARZON remains at 115 named waterbody/habitat leads, 57 river leads, 108 unique source references, 24 fish-evidence-not-reviewed leads, zero validated geometries, 9 imported species assertions and zero public records. No species assertion, current presence, salinity, safety or legal-rule claim was added; item-specific reuse remains unverified.

**Next:** locate the full CvSU 2020-2021 Imus biophysical-characterization report and check for fish sampling, locations, methods, taxa and reuse terms. Inspect Cañas, Pasong Camachile and Timalan sources separately. Seek a reusable official vector dataset before adding any watershed or channel geometry; keep adjacent-waterbody fish, aquaculture totals, river-channel geometry and watershed boundaries separate.


### National rollout step 304 - Timalan and Pasong Camachile watershed-study discovery - 31 October 2026

Reviewed CvSU's official February 2017 newsletter, the official EMB-hosted CALAX Cavite-section EIS, and the Cavite Ecological Profile 2024. CvSU announced a DENR-PENRO/CvSU watershed profiling and management-planning project for Timalan and Pasong Camachile, with the newsletter stating February to July 2017. It does not link a completed plan or report fish methods, sites, taxa, or geometry. The EIS explicitly names Pasong Camachile River, gives a source-era 10.22 km² catchment figure, and places it within the wider San Juan River Basin. The 2024 profile describes a route narrative from Santiago through San Gabriel to San Juan River. These are identity and watershed-context sources, not an adoptable channel trace.

Added `ph-wb-pasong-camachile-river` as a distinct river research lead, linked the 2017 project notice to it and Timalan, and recorded `calabarzon-timalan-pasong-camachile-watershed-study-discovery-20261031.json`. Kept salinity unknown, the river/watershed boundary undelineated, the EIS multi-river fish context unassigned, and reuse/publication approval pending. No fish assertion or public-app row was added. The similarly named Camachile-Ylang-Ylang watershed remains a separate identity until an authoritative crosswalk supports merging.

The bounded search did not locate the completed watershed plan or a fish-specific dataset; this is a retrieval gap, not evidence of fish absence or project non-completion. CALABARZON now has 116 selected waterbody research leads (58 rivers) and 109 distinct linked source references; the regional denominator remains incomplete.

**Next:** seek the completed 2017 CvSU/DENR-PENRO watershed plans or fish-survey deliverables through public repositories; inspect dates, methods, species identification, station-to-river attribution, and reuse rights before considering any fish rows. Keep watershed polygons separate from river channels and continue the freshwater/marine source queue.


### National rollout step 305 - Pasong Camachile bounded GBIF screen - 31 October 2026

Queried the public GBIF Occurrence API using the current Catalogue of Life Extended Release Actinopterygii checklist selection (key `8VR36`, checklist `7ddf754f-d193-4cc9-b351-99906754a03b`). Three indexed-field queries—`waterBody=Pasong Camachile River`, `waterBody=Pasong Camachile`, and `locality=Pasong Camachile`—each returned HTTP 200 with zero matching records. The retired GBIF key 204 was not used.

Recorded the bounded screen in `calabarzon-pasong-camachile-gbif-screen-20261031.json` and linked it to the Pasong Camachile research lead. It adds no species assertions, geometry, or public-app rows. The zero results do not establish fish absence and do not cover aliases, nearby coordinate records, or non-ray-finned fishes. No spatial-box query was attempted because there is no verified channel or sampling-station geometry.

**Next:** continue looking for the completed CvSU/DENR-PENRO watershed outputs or a separate reusable, station-resolved fish survey. Keep the source's planned project period separate from actual completion and fish results.


### National rollout step 306 - Cañas River fish-thesis abstract access review - 31 October 2026

Located the exact 2017 Erce and Quiñones thesis record in the official CvSU Integrated Library System (record 11186) and retrieved its linked 16-page scan, labeled thesis abstract and table of contents. The abstract reports a May 2016-February 2017 watershed study with 11 sampling stations and an aggregate of 23 fish taxa (13 classified as indigenous and 10 as introduced by the thesis authors); it also reports seven crustacean taxa. The PDF does not include the fish-species table, station-to-taxon assignments, or station coordinates. Its contents list the fish and station tables on thesis pages 35 and 26, respectively, and station figures on pages 80-85.

Added `cvsu-2017-canas-fish-crustacean-thesis-abstract` to the source registry and recorded `calabarzon-canas-2017-fish-thesis-abstract-review-20261031.json`. Linked it to the existing Cañas River watershed research lead and refreshed the source registry/scope hashes and denominator profile: 116 waterbody leads, 58 rivers, and 110 unique assigned source references. The historical aggregate is research-only; no species names, species assertions, current-presence claims, site-level assignments, geometry, public rows, or reuse approval were added. The thesis authors' indigenous/introduced classifications remain unverified. The catalog attachment is not the full thesis, and no request was submitted.

**Next:** seek authorized access to the full thesis or the specific methods/station/species-table pages, confirm station-to-waterbody assignments and identification support, and resolve item-specific reuse rights. Do not convert the watershed-level total to 23 species rows or attribute all watershed taxa to an individual Cañas River reach.


### National rollout step 307 - Timalan River Watershed fish-thesis abstract review - 31 October 2026

Reviewed the official CvSU ILS catalog record and its linked 15-page abstract/contents scan for Arviola and Dauba's 2018 Timalan River Watershed thesis. The catalog abstract reports an August 2017-May 2018 study, 26 fish species and 4 crustacean species across wet and dry seasons, and identification using local fishermen, FishBase.org, and online literature. The title-page date says June 2018 while catalog abstract metadata says May 2018; both are preserved. The contents list nine multi-river sampling sites and the missing full-thesis sampling-site, fish and crustacean tables (thesis pages 38, 43 and 58), but the accessible scan contains no taxon names or site/season crosswalk.

Added `cvsu-2018-timalan-fish-crustacean-thesis-abstract` to the source registry, recorded `calabarzon-timalan-2018-fish-thesis-abstract-review-20261031.json`, linked the source to the Timalan River watershed research lead, and refreshed the denominator profile and hashes. CALABARZON remains at 116 selected waterbody leads (58 rivers) and 111 distinct linked source references. The 26-fish/4-crustacean result is historical watershed-level context only; it is not assigned to the Timalan main stem or any individual river. No species names/assertions, current-presence or absence claim, water-quality/safety conclusion, geometry, public row, or reuse approval was added.

**Next:** seek authorized access to thesis Tables 2-4, Figure 13, and relevant appendix pages; verify species identifications and site/season attribution, then review reuse rights. Keep the thesis aggregate separate from the EIA's main-stem taxa and west-branch non-observation, and do not infer current conditions from the historical water-quality study.


### National rollout step 308 - Timalan full-thesis public-access follow-up - 31 October 2026

Followed up the CvSU catalog record through the official Theses Xplorer service route and bounded exact-title/author web searches. The catalog lists the 151-page physical thesis as room-use only and exposes the 15-page abstract/contents attachment. The unauthenticated Xplorer URL returned the general CvSU ILS service page, with Google sign-in offered and guest sign-in disabled; it did not expose a Timalan full-text result. Exact-title and author searches did not locate a public mirror. This is a bounded retrieval gap, not proof that the university has no authorized access path.

Added the query scope and access outcome to `calabarzon-timalan-2018-fish-thesis-abstract-review-20261031.json` and refreshed its denominator-profile hash. No sign-in, thesis request, species assertion, or publication decision was made. The abstract remains historical multi-river aggregate evidence only.

**Next:** continue with the next independently reviewable CALABARZON fish source; retain the CvSU results tables and station crosswalk as an unresolved retrieval task rather than repeating the same public search route.

### National rollout step 309 - Pansipit River historical assemblage source review - 31 October 2026

Reviewed the official UKDR metadata page, official UPLB JESAM article text, and the UKDR/JESAM rights policy for Corpuz, Paller and Ocampo (2016). The paper describes a 2011 fish-assemblage survey of the Lake Taal inlet rivers (Looc and Magapi) and outlet (Pansipit); the abstract reports 37 species pooled across the three rivers, including richness of 36 in Pansipit and 21 in each inlet. This is a historical study result, not current presence or a present-day complete checklist.

The methods describe 12 stations across three rivers, three runs per station and 48 samples described as 24 sampling sites across two seasons. The methods sentence reverses the abstract's January/dry and July/wet labels, and the stated station/run/sample denominator is unclear. The abstract and results text also differ on total individuals (3,342 versus 3,346). These conflicts are retained; no seasonal or individual-total result is adopted. The paper says some vouchers were deposited at UPLB Museum of Natural History but the reviewed passage provides no catalog identifiers.

UKDR/JESAM policy states that article copyright is assigned to UKDR and use beyond the listed personal-use exceptions requires a written agreement and attribution. No item-specific open license or Bangwit permission was verified. The species-by-site and feeding-habit table remains untranscribed pending rights review.

Added `corpuz-2016-taal-river-fish-assemblage` and `calabarzon-pansipit-2011-fish-assemblage-review-20261031.json`; linked the source only to `ph-wb-pansipit-river`, refreshed the denominator profile and hashes. The separate Pansipit River Estuary record remains unchanged because no station-to-estuary crosswalk was found. CALABARZON remains at 116 named waterbody/habitat leads, 58 rivers, and 112 unique linked source references. No species or diet assertion, current-presence or absence claim, geometry, salinity, or public-app row was added.

**Next:** seek written reuse permission or an independently licensed, station-resolved source before transcribing species-by-site or feeding-habit results. Resolve the paper's season/sample wording and verify taxon identifications and any voucher catalog numbers; keep river observations separate from the estuary and do not infer current conditions.

### National rollout step 310 - Pansipit and Palanas 1998 fish-composition source review - 31 October 2026

Reviewed page 344 of the official NAST Transactions volume 21. This is a one-page 1999 proceedings paper/abstract by Pagulayan and Magbanua, not the full underlying survey report. It reports monthly beach-seine sampling from February through December 1998 at five sites: four named Pansipit River reaches and one Palanas River site. The abstract reports 59 species across both rivers (37 families), including 33 for Pansipit and 38 for Palanas; 12 taxa were shared. These are historical source-reported richness aggregates only.

The NAST volume front matter says authors retain copyright to their papers and prior permission is required for reproduction. No item-specific open license or permission was verified. The species-name table was not transcribed. The abstract describes Palanas as a diverging Pansipit branch with a separate Balayan Bay outlet about 3 km from the Pansipit mouth; this does not validate its channel, exact municipal association, or relationship to the Barangay Palanas namesake.

Added `pagulayan-1999-pansipit-palanas-fish-composition` and `calabarzon-pansipit-palanas-1998-fish-composition-review-20261031.json`. Updated the Pansipit River record and added `ph-wb-palanas-river` as a source-named research lead; the separately modeled Pansipit River Estuary remains unchanged. Refreshed the scope and denominator hashes. CALABARZON now has 117 named waterbody/habitat leads (59 rivers) and 113 unique linked source references. No species assertion, public-app row, current-presence/absence claim, diet/catchability advice, geometry or salinity assignment was added.

**Next:** verify Palanas River identity and route with official hydrography/LGU records, and seek a rights-cleared species list or permission before any table-level use. Do not merge the river with a Palanas-named barangay or assign any of these historical river results to the estuary.

### National rollout step 311 - Palanas name and drainage crosswalk - 31 October 2026

Reviewed the official indexed text of the DENR-EMB CALABARZON [fourth-quarter 2006 bulletin](https://calabarzon.emb.gov.ph/wp-content/uploads/2024/07/CALABARZON-MONITOR-4th-Quarter-1.pdf). It names “Palanas River (Naic)” among the tributaries of Timalan River and places Timalan in Naic and Tanza, Cavite. Direct PDF retrieval returned HTTP 403, so this is a bounded name/drainage-context review only. The official [BFAR-hosted 1947 Fisheries Administrative Order](https://www.bfar.da.gov.ph/wp-content/uploads/2021/03/FAO-No.-12-1-s.-1947.pdf) separately names Palanas Creek in Lemery and describes tributaries reaching Pansipit River. Whether that historical creek is the same feature as the Palanas site in the 1998 NAST abstract remains unresolved. The old order is not treated as current fishing law.

Added `ph-wb-palanas-river-naic-cavite` as a separate Cavite research lead and registered the 2006 EMB bulletin and 1947 BFAR order as name-context sources. CALABARZON now has 118 selected leads (60 rivers) and 115 distinct linked source references. Neither route is delineated; fish evidence for the Naic lead remains unreviewed. No feature was merged, and no species assertion, current-presence/absence claim, legal/safety conclusion, geometry, salinity, or public-app row was added. See `calabarzon-palanas-name-crosswalk-review-20261031.json`.

**Next:** obtain a modern official Cavite/LGU hydrography crosswalk for Palanas River (Naic), and a modern Lemery/Batangas crosswalk for the historical Palanas Creek versus the 1998 study feature. Keep those identity tasks separate from the rights-cleared species-list search.


### National rollout step 312 - Palanas water-body layer availability and feature-probe review - 31 October 2026

Reviewed the official [Geoportal Data Inventory](https://geoportal.gov.ph/gpresources/GP_DataInventory.pdf), which lists the Water Body 1:10,000 and 1:50,000 layers as uploaded, metadata available and Open under Memorandum Order No. 008, series of 2022, while marking downloads temporarily disabled for updating. The public GeoServer WMS GetCapabilities endpoint returned HTTP 200 and advertised both layers as queryable in EPSG:4683 and CRS:84. This confirms a catalog/service lead, not a local river trace.

Bounded WMS GetFeatureInfo probes returned HTTP 200 but empty FeatureCollections for the secondary Tatlong Balon/Palanas point and a Taal control point. Since the control also returned no feature, this is an indeterminate identify result, not evidence that a waterbody is absent. The unauthenticated WFS capabilities endpoint returned HTTP 401; no sign-in or access bypass was attempted. A secondary map page calls Tatlong Balon River “Palanas River,” but it does not establish that this is the official 2006 EMB Palanas River (Naic) or the separate Pansipit/Balayan Bay study feature.

Registered the Geoportal catalog/WMS and the secondary locator, updated the Palanas crosswalk and denominator hashes, and retained the Naic, Lemery, and 1998 study leads as separate. CALABARZON remains at 118 named waterbody research leads (60 rivers), 115 unique source references assigned to those leads, and 442 source-registry entries. No channel geometry, fish evidence, species assertion, presence/absence conclusion, current safety/legal claim, or public-app row was added.

**Next:** seek authorized current feature-level Geoportal/NAMRIA or LGU hydrography metadata/data that identifies the Naic Palanas channel and Timalan connection; separately find a modern Lemery crosswalk for the historical Palanas Creek. Continue with fish-specific sources only when identity, station linkage and reuse are supportable.

### National rollout step 313 - Palanas GBIF screen and shared Manila Bay specimen triage - 31 October 2026

Ran seven bounded GBIF occurrence searches for the Catalogue of Life XR Actinopterygii taxon (`checklistKey` `7ddf754f-d193-4cc9-b351-99906754a03b`; `taxonKey` `8VR36`) across the indexed waterBody/locality strings “Palanas River,” “Palanas River (Naic),” “Tatlong Balon,” “Tatlong Balon River,” and “Palanas.” All seven returned zero matching rows. The broader Philippines + Cavite + same checklist/taxon control returned 582 records. These exact text searches do not establish fish absence, do not search a validated Palanas channel polygon, and do not cover other fish groups or unindexed spellings.

Separately reviewed GBIF occurrence 1318874346: a CC0-indexed USNM preserved specimen identified as *Stolephorus celsior* by Harutaka Hata, dated 16 November 1965, with source-reported locality “Manila Bay, Naic, Cavite.” and waterBody “North Pacific Ocean, Manila Bay.” It has no coordinates. The primary 2021 description establishes *S. celsior* as a Manila Bay taxon and names Rosario type material, but does not mention this USNM catalog number or Naic. The public NMNH page resolved to its JavaScript shell, so the original catalog label is not independently confirmed. The occurrence is retained as one historical, research-only association with shared Manila Bay. It is not assigned to Palanas River, is not a current-presence claim, and is not admitted to the public app.

Added `calabarzon-palanas-gbif-screen-20261031.json` and `calabarzon-manila-bay-stolephorus-celsior-gbif-review-20261031.json`; registered the primary taxonomy source and linked the reviews to the relevant GBIF, NMNH, Manila Bay and Palanas records. Refreshed the CALABARZON scope and denominator hashes. The region remains at 118 named waterbody research leads (60 rivers), 117 unique source references, and 443 source-registry entries. No Palanas fish assertion, coordinates, geometry, salinity, current safety/legal claim, or public-app row was added.

**Next:** seek official feature-level Naic/Timalan route data and fish-specific river evidence. If the NMNH collection interface becomes readable, compare the USNM 204231 catalog label to the GBIF record; retain the species only in historical shared-Manila-Bay research unless a primary source supports a narrower site.

### National rollout step 314 - Historical OBIS/NMNH archive check for USNM 204231 - 31 October 2026

Followed the OBIS IPT link to its separately published NMNH Vertebrate Zoology Fishes resource, version 1.0 (published 10 October 2018). Its page reports 114,408 occurrence rows and a CC BY 4.0 license; its description warns that the online listing was partial at the time. Downloaded the 11,214,609-byte archive to ignored local research storage and recorded its SHA-256.

Streamed `occurrence.txt` and checked the exact `catalogNumber` field plus the bounded `otherCatalogNumbers` field for `204231`; no row matched. This is a result about that partial 2018 OBIS snapshot only. It is not evidence that the USNM specimen is absent from the current NMNH collection and does not override or independently verify the distinct 2026 GBIF-indexed `USNM 204231` record.

Added `obis-nmnh-vzfishes-dwc-2018` to the source registry and recorded the archive check in `calabarzon-manila-bay-stolephorus-celsior-gbif-review-20261031.json`. Manila Bay remains a historical, research-only association with no coordinates, no current-presence inference, and no public-app row. CALABARZON remains at 118 named waterbody research leads (60 rivers), 118 unique linked source references, and 444 source-registry entries.

**Next:** seek direct NMNH record-label confirmation if the collection interface becomes readable. In parallel, continue the Naic/Timalan route and fish-survey search; the older OBIS archive cannot resolve either question.

### National rollout step 315 - Separate Naic offshore catch from Timalan River records - 31 October 2026

Reviewed Section 8.1.2.2 of the official AIIB-hosted Bataan-Cavite Interlink Bridge EIA. It reports February 2020 interviews with fisherfolk in Timalan Balsahan and Timalan Concepcion, who used fishing grounds around Corregidor and Caballo Islands. The report lists five fish and two crab catch labels in that separate livelihood context. It also separately summarizes five fish labels reported or observed in the Timalan River main stem during its 2021-2022 stream-ecology work; the two contexts are not interchangeable.

Updated the existing AIIB EIA source review, Timalan scope note, source registry and CALABARZON denominator provenance. The EIA does not provide species-specific capture coordinates, vouchers, a marine-waterbody crosswalk, or independent name validation for the offshore interview list; its printed spelling `Ratrilliger brachysoma` is preserved. No catch label was transferred to Timalan River or its estuary, no waterbody species assertion or public row was added, and reuse approval remains pending. Regional counters are unchanged at 118 named waterbody leads (60 rivers), 118 assigned source references, 9 imported species assertions and zero public records.

**Next:** resolve the Corregidor/Caballo fishing-ground and taxonomic attribution before associating the interview catch with a marine research lead; continue seeking reusable, station-resolved freshwater evidence for Timalan and other Naic waters. Keep fishery interviews, river ecology, current presence, diet and safety as separate evidence lanes.

### National rollout step 316 - Naic offshore interview fish-name crosswalk - 31 October 2026

Cross-checked the five fish names printed in the separate AIIB EIA February 2020 Naic fisher-interview catch context against Eschmeyer's Catalog of Fishes. The Catalog supports `Rastrelliger brachysoma` as the likely correction for the EIA's printed `Ratrilliger brachysoma`; it lists `Trichiurus lepturus`, `Terapon jarbua` and `Pomadasys maculatus` as valid names, and its current status for the source label `Valamugil seheli` is `Moolgarda seheli`. Three species pages were directly readable; exact-name status text for two pages was available only from Catalog-indexed excerpts, and those pages returned HTTP 403.

Added `catalog-of-fishes-naic-offshore-catch-taxonomy-20261031` to the source registry and `calabarzon-naic-offshore-catch-taxonomy-crosswalk-20261031.json`; updated the AIIB review and denominator provenance. This is nomenclature-only. It does not verify the fishers' identifications, species-specific capture grounds, or a marine-waterbody attribution. No species assertion, occurrence record, public row, or diet/catchability advice was added. CALABARZON remains at 118 named waterbody leads (60 rivers), 118 assigned source references, 9 imported species assertions, and zero public records; the source registry now has 445 entries.

**Next:** resolve the interview catch's species-specific fishing grounds, identification support and item-specific EIA reuse before any marine-waterbody association. Continue the freshwater source queue for Timalan/Naic and keep all offshore catch labels separate from the river main-stem list.

### National rollout step 317 - Manila Bay trawl southern-sector follow-up - 31 October 2026

Rechecked the official 2017 NFRDI paper and its 2014-2015 survey methods: 16 predetermined stations, 156 daytime commercial-otter-trawl tows, 3-46 m depth and 30-60 minute tows. The results discussion names hairtail, black pomfret and common ponyfish as more abundant in the southern sector near Corregidor. The paper also reports 42 species near Corregidor within the survey's 146 fish-and-invertebrate taxa; 42 is not a fish-only count. Its statement has no species-to-tow, exact date or coordinate crosswalk. The paper body misspells hairtail as Trichuirus while its top-20 table uses Trichiurus.

Cross-checked the three paper labels against the Catalog of Fishes: Trichiurus lepturus and Parastromateus niger are listed as valid; the source spelling Leiognathus equulus is recorded historically while the Catalog gives current status Leiognathus equula. This is nomenclature only and does not verify field identification. Item-specific rights for reusing the 2017 table remain pending; no table data were copied, no species assertion or public row was added, and no current presence, catchability, safety or legal claim follows.

Added calabarzon-manila-bay-nfrdi-trawl-south-sector-review-20261031.json, a dedicated Catalog source entry, and linked the review to the Manila Bay research lead and denominator provenance. CALABARZON remains at 118 waterbody leads, 60 river leads, 118 unique assigned source references, 9 imported assertions and zero public rows; the registry count is now reconciled at 446 entries. Geometry remains unvalidated.

**Next:** ask NFRDI about item-specific permission and whether station-level tow IDs, dates, coordinates and taxon assignments can be shared. Until then, retain only this attributed historical regional context in research notes. Continue the remaining CALABARZON freshwater/coastal evidence queue.

### National rollout step 318 - Manila Bay pooled 2014 ring-net fishery review - 31 October 2026

Reviewed the full 2017 NFRDI article and its site map, methods and results. It analyzes 2014 monthly ring-net catches pooled from nine fish landing sites, names *Sardinella gibbosa*, *Sardinella fimbriata* and *Rastrelliger brachysoma*, and reports 17,991 measured fish. The map names four Cavite landing places (Rosario Fish Port, Julugan Market in Tanza, and Munting Mapino and Labac in Naic), but the analysis does not assign taxa to individual landing sites or give capture coordinates. Landing places are not capture origins. The methods paragraph contains the apparent typo “*Sardinella brachysoma*”; the abstract, introduction and results name *Rastrelliger brachysoma*. Preserve the 2014 *Sardinella fimbriata* source label pending separate taxonomic review.

Added `nfrdi-2017-manila-bay-small-pelagic-ringnet` and `calabarzon-manila-bay-nfrdi-2014-ringnet-review-20261031.json`; linked only to shared Manila Bay research context and the four source-described Cavite landing localities. The PDF is hash-pinned in ignored local research storage. No species table or figure was copied, item-specific reuse remains unresolved, and no species assertion, capture-site assignment, geometry, current-presence claim, or public-app row was added. The denominator now has 119 unique assigned source references; CALABARZON remains at 118 selected waterbody leads, 60 river leads, 9 imported assertions and zero public rows. The source registry has 447 entries.

**Next:** continue the independent coastal/freshwater source queue. If NFRDI responds, request taxon-by-site or capture-area linkage and item-specific reuse terms; do not infer capture origin from landing locations.

### National rollout step 319 - Tikub Lake 2014 fish-survey full-text access review - 31 October 2026

The publisher page for Labatos and Briones (2014) exposes its abstract but gates the full article behind login/registration. A public ResearchGate author-upload page identifies author Bonifacio V. Labatos Jr. and exposes the article text; the platform warns that content may be subject to copyright. The article reports 221 fish and nine collected taxa, while a separate section/table lists four additional reported-only taxa. Its methods describe ten lake sampling points and several gears. Do not merge reported-only mentions with captures or treat this 2014 survey as current presence.

Added `calabarzon-tikub-2014-fish-fulltext-review-20261031.json`, refreshed the existing source record and CALABARZON denominator pins, and linked the review to the Ticub Lake research lead. No item-specific reuse license was found; neither checklist table was copied, no taxon assertion or public row was added, and no sampling coordinates or geometry were adopted. The Ticub lead remains research-only.

**Next:** seek item-specific reuse clarification and independently verify the historical source taxonomy before considering the nine collected names. Continue the wider freshwater/coastal source queue in parallel; an author upload is access for review, not a reuse license.

### National rollout step 320 - Tayabas River near-mouth museum specimen cross-check - 31 October 2026

Queried the public iDigBio API for the exact scientific-name/locality pair `Epinephelus polystigma` and `Tayabas`; one NMNH preserved specimen record matched: USNM 184603, dated 25 February 1909. The contributed record reports the locality as “Near mouth of Tayabas River, Luzon” but lists `North Pacific Ocean` as `waterBody`, contains no coordinates, and does not identify a sampled river reach or estuary. The source recordset attribution reports CC0, while the selected record has no item-level rights field. iDigBio's portal also notes that its data stopped updating after 8 May 2026.

Added `calabarzon-tayabas-river-idigbio-specimen-review-20261031.json` and a dedicated source-registry entry. Retained the record only as historical near-mouth context; it is not assigned to the freshwater river, not included in the river's species evidence, and not evidence of current presence. CALABARZON remains at 118 named waterbody leads (60 rivers), 119 unique linked source references, 9 imported species assertions and zero public rows; the source registry now has 448 entries. The PJS 2010 table, February season conflict, station-to-reach crosswalk and channel geometry remain unresolved.

**Next:** seek item-specific PJS table permission or an independently licensed source explicitly tied to a Tayabas freshwater station or reach. Keep USNM 184603 unassigned, preserve the February wet/dry wording conflict, and continue the CALABARZON source queue without inferring current presence or a complete checklist.

### National rollout step 321 - Tikub Lake 2014 fish-survey taxonomy crosswalk - 31 October 2026

Compared 15 source-name and hybrid-parent labels from the 2014 Tikub Lake survey with Catalogue of Life Extended Release (CoL XR) through the ChecklistBank API, pinned to dataset `316691` (2026-10-16 XR). Three source labels return synonym usages: *Giuris margaritacea* maps to candidate *Giuris margaritaceus*, *Cyprinus carpio carpio* to *Cyprinus carpio*, and *Oreochromis niloticus niloticus* to *Oreochromis niloticus*. These are nomenclatural crosswalks, not specimen re-identifications. The source's red-tilapia hybrid remains unresolved: its abstract names *O. niloticus × O. hornorum* while its table names *O. mossambicus × O. hornorum*. CoL's synonym mapping for *O. hornorum* does not resolve the hybrid. Keep the nine source-reported collected taxa distinct from the four reported-only mentions.

Added `calabarzon-tikub-taxonomy-crosswalk-20261031.json`, linked its pinned receipt to the source registry, Ticub Lake research lead and CALABARZON denominator profile. The minimal crosswalk does not reproduce the survey tables. Item-specific reuse remains unresolved; no occurrence assertions, diet assertions, current-presence inference, geometry, or public rows were added. CALABARZON remains at 118 selected waterbody leads (60 rivers), 119 unique linked source references, 9 imported species assertions and zero public rows; the source registry remains at 448 entries.

**Next:** seek item-specific reuse clarification before any source-derived checklist rows are considered. Preserve the source spelling, collected-versus-reported distinction, and unresolved hybrid conflict. In parallel, continue the CALABARZON freshwater/coastal queue using independently reusable, station-resolved sources; do not wait for a rights response or infer absence from bounded database searches.

### National rollout step 322 - Lake Wood freshwater fish diet evidence - 31 October 2026

Reviewed the official 2025 Philippine Journal of Fisheries gut-content study for Lake Wood, Lakewood, Zamboanga del Sur (Mindanao). It sampled nine source-named taxa from local fishers' catches and examined stomach contents microscopically. For example, the paper reports algae in all sampled *Oreochromis niloticus* stomachs and fish remains in 42.9%; its *Channa striata* summary reports algae and insects, with insects in 30%. The Lake Wood sample therefore records opportunistic fish-eating in tilapia and does not support a universal fixed diet rule: the *Channa* table's lack of a fish-prey entry does not establish that dalag never eats fish. The article itself cautions that several food remains were too digested for fine taxonomic identification.

Logged an unresolved denominator discrepancy: the abstract says 144 stomach samples, while the nine per-taxon Table 1 counts sum to 87. Exact fish-catch dates, station-level capture locations and voucher accessions are not reported. Three taxa have just one Table 1 stomach each; *Oreochromis* sp. is taxonomically unresolved and *Rasbora* remains genus-level. The article PDF explicitly states CC BY-NC 4.0. The repository's attached `license.txt` is only a generic sample placeholder, so the license determination is based on the article footer and current journal policy. Added `national-mindanao-lake-wood-diet-evidence-review-20261031.json` and the source-registry entry; source registry count reconciled to 449 entries. No article table or figure was copied, and no diet assertion, species occurrence, geometry, bait recommendation, current-presence claim or public-app row was added.

**Next:** continue the Mindanao inland/coastal evidence sweep with other waterbody-specific sources and retain the CC BY-NC constraint for any future public reuse. Keep study-site diet observations separate from species-wide behavior and bait advice; carry the sample-count conflict forward until a verifiable correction or author response is available.

### National rollout step 323 - Maduao River freshwater-fish survey review - 31 October 2026

Reviewed the full 2024 NFRDI-hosted paper on the August 2022 rapid survey of a 2.16-km segment of Maduao River, Maco, Davao de Oro (Region XI). It reports 429 collected individuals in 12 Table 1 taxon rows from three stations; nine labels are at species rank and three remain provisional (*Eleotris* sp. and two *Sicyopterus* forms). The table's individual counts reconcile to the abstract's 429. The study describes three upstream/midstream/downstream stations and multiple collection methods, but it is a short historical survey, not a complete river or estuary inventory and not evidence of current presence. The source itself recommends broader sampling downstream and near the estuary.

The paper's native/introduced and identification categories are recorded as source-attributed classifications only; one named taxon has no status data. Exact station coordinates are present in the paper but were not copied to the research file, app data, or map geometry. The PDF states CC BY-NC 4.0; no public-app reuse is approved pending Bangwit's project-use review. Added `national-mindanao-maduao-river-fish-assessment-review-20261031.json` and the NFRDI source registry entry; reconciled the registry count to 450. No source table, figure, specimen image, species assertion, diet assertion, geometry, current-presence claim, or public-app row was added.

**Next:** continue the Region XI freshwater evidence queue with another bounded river, stream, lake or marsh source. Keep study-derived fish records separate from diet, current availability, safety, and legal guidance; do not infer Davao Gulf or estuary presence from this upstream river survey.

### National rollout step 324 - Mt. Hamiguitan three-river fish-study consistency audit - 31 October 2026

Reviewed the publisher metadata and the full publisher-hosted 2021 paper on Dumagooc, Maug and Banahaw rivers in Mt. Hamiguitan Range Wildlife Sanctuary, Davao Oriental. It describes dry-season sampling between August 2019 and January 2021 at upstream, midstream and downstream stations, and says vouchers were deposited in the Central Mindanao University museum without accession numbers.

The evidence is internally inconsistent: the abstract claims 31 taxa and 121 individuals, the detailed results and Table 2 report 25 taxon rows and 122 individuals, and the table's station totals sum to 122. The abstract's endemic/native/introduced counts sum to 32, while the discussion/conclusion give a different introduced count. The barb is called *Barbodes bantolanensis* in the results/table and *Puntius bantolanensis* in discussion text. Four table entries are genus-level. These discrepancies are left unresolved; no source rows, status assertions, table content, station coordinates, water-quality or safety statements, current-presence claim, or public-app row were added.

The publisher page states CC BY-NC-SA 4.0. Added `national-mindanao-hamiguitan-three-river-fish-audit-20261031.json` and the source-registry entry; reconciled the registry count to 451. Public-app reuse remains unapproved pending noncommercial/share-alike and project-use review.

**Next:** try the cited 2016 two-river Hamiguitan study through its normal publisher or repository routes, then keep the Mindanao inland-water source queue moving with independently accessible primary sources. Do not treat a previous inventory as a correction of the 2021 paper unless the authors' source evidence supports that reconciliation.

### National rollout step 325 - Hamiguitan 2016 two-river source access audit - 31 October 2026

Attempted a normal read of the 2016 Quimpang et al. publisher article page for the Dumagooc and Maug rivers. The journal endpoint returned HTTP 403 with a Cloudflare challenge; no challenge, login, or access control was bypassed. Later papers cite the study, but those citations are not substitutes for its original methods, taxon table, vouchers, or reuse terms. Citation page spans also conflict: the 2021 publisher paper gives 96-111, while a 2024 NFRDI bibliography gives 95-111.

Added `national-mindanao-hamiguitan-2016-study-access-review-20261031.json` and a metadata-only source record. No full text, taxon, count, geometry, occurrence, current-presence claim, or app row was extracted; item-specific rights remain unknown. The source registry now contains 452 entries.

**Next:** use another normally accessible primary Mindanao source while leaving this access challenge unresolved. Do not substitute the 2021 comparison for a review of the 2016 original.

### National rollout step 326 - Liguasan Marsh historical fishery assessment - 31 October 2026

Reviewed the full NFRDI paper on BFAR-12/NSAP fishery data from January 2015 through December 2017 at six North Cotabato landing centers. Its composition table has 13 rows, including *Macrobrachium rosenbergii*, a freshwater prawn rather than a fish. Status counts do not reconcile: the abstract says 10 introduced and 3 native; counting Table 3 labels gives 8 introduced and 5 native; the table footer says 9 introduced and 5 native. The paper also varies between *Puntius sirang* and *Barbodes sirang*, and between *Trichogaster pectoralis* and *Trichopodus pectoralis* across table and figure labels.

The data are historical landing records, not species-specific capture coordinates or evidence of current occupancy. The article reports fishing-ground data were gathered, but its pooled species table does not crosswalk taxa to particular origins. The PDF states CC BY-NC 4.0; project-use and publication approval remain unresolved. Added `national-mindanao-ligawasan-marsh-landing-fishery-review-20261031.json` and the NFRDI source record. No species assertion, diet note, capture geometry, or public-app row was added. Source registry: 453 entries.

**Next:** review the separate Liguasan gut-content study only from normally accessible primary text, and keep any diet observation separate from bait suggestions and broader species behavior.

### National rollout step 327 - Liguasan Marsh gut-content paper access audit - 31 October 2026

Reviewed the 2021 publisher metadata and abstract for Fabay et al. The abstract says the study examined eight freshwater fishes and classified diets into algae, fish, crustaceans, detritus, and mollusks, but it does not map named taxa to those food categories or give sample-level context. A normal request to the publisher-linked PDF returned HTTP 403. No gate, challenge, or login was bypassed; the full paper and any taxon-specific table were not reviewed. The publisher landing-page footer says the site is all rights reserved, and no article-specific reuse license was verified.

Added `national-mindanao-ligawasan-diet-paper-access-review-20261031.json` and the publisher metadata/access record. No diet assertion, bait advice, occurrence, geometry, or public-app row was added. The registry now contains 454 entries. The paper remains a lead for a later ordinary-access retry, not a source for species-specific diet cards from its abstract.

**Next:** continue Mindanao freshwater coverage with an accessible primary source. Retry the Fabay paper only if its full text and item-specific reuse terms become normally available; do not bypass publisher access controls.

### National rollout step 328 - Six Mindanao small-lake fish survey review - 31 October 2026

Reviewed the full 2022 AACL Bioflux paper on Lakewood, Apo, Napalit, Holon/Maughan, Tiktikan, and Kanlunes lakes using the publisher PDF. It describes four-day collection periods per lake between January and May 2017, but Table 4 defines a presence mark as “collected and as reported by the locals,” so it does not distinguish specimen-backed collection from local report for each taxon/lake cell. The abstract says 59 species while results text says 60, and the table includes an “Unknown” row. The abstract calls the lakes isolated even though it also says five are open/connected; Tiktikan is described as lagoon-connected with seawater entry and includes marine/brackish habitat labels. The lake-level water-quality table does not include Tiktikan, and 2017 measurements are not current safety data.

The article states a Creative Commons Attribution License, but does not name a version. Added `national-mindanao-six-small-lakes-fish-survey-review-20261031.json` and a source-registry entry; source count is now 455. No species/presence rows, water-quality claims, diet notes, lake coordinates, geometry, table content, or public-app entries were added. The author’s middle initial also differs between the first-page author line and the final-page citation and is preserved as a bibliographic uncertainty.

**Next:** continue the Mindanao freshwater queue with a primary source that separates specimens from community reports at the taxon-site level. Keep this paper as an openly licensed, historical research lead; do not import its mixed presence matrix as a verified checklist.

### National rollout step 329 - Lake Mainit and Kalinawan River historical inventory audit - 31 October 2026

Reviewed the official 2015 JEAR publisher record and a public author-uploaded copy of the paper by Uy et al. The methods say the fish inventory was conducted in August-November 2007, while Table 1 captions the finfish catches as August-November 2008. Methods describe field collection, fisher interviews and local-market surveys, including voucher collection and separately listed reports without vouchers; however, the pooled 41-entry finfish table has no per-row evidence-type flag or voucher accession numbers. It covers Lake Mainit and Kalinawan River together and does not consistently assign each taxon to a lake or outlet reach. The source also says four additional finfish types were unidentified and describes many listed fish as migratory or marine-influenced.

The publisher page says all rights reserved and no item-specific reuse grant was found. Added `national-caraga-lake-mainit-aquatic-biodiversity-review-20261031.json` and the source record. The registry now has 456 entries. No table rows, current-presence claims, lake/river-specific assertions, geometry, diet or public-app data were added.

**Next:** continue Caraga freshwater screening with a later primary study that supplies taxon-by-site specimen evidence or accessible voucher/photo documentation. Keep the pooled historical inventory research-only and do not treat it as current lake or river coverage.

### National rollout step 330 - Agusan Marsh historical fishery assessment audit - 31 October 2026

Reviewed the official NFRDI full paper on fishery monitoring from May 2014 through December 2016 at four landing centers in Lapaz and Talacogon. Its catch-composition results are aggregated by municipality, without a taxon-to-capture-waterbody or taxon-to-landing-center crosswalk. The source's claimed 18 fish species are not independently reconciled: the 18-row table includes genus-level *Macrobrachium* (a freshwater prawn), and it prints unresolved *Trichopodus/Trichogaster pectoralis* and *Osphronemus laticlavius/lacticlavius* variants. The municipal richness figures (12 and 17) are not additive.

The current Philippine Journal of Fisheries policy states that submitted articles are licensed CC BY-NC 4.0, but the reviewed 2020 article PDF and repository metadata do not display an item-specific license statement; applicability to this item remains unverified. Added `national-caraga-agusan-marsh-2014-2016-fishery-review-20261031.json` and one NFRDI source record. Registry count is now 457. No taxon rows, capture geometry, current-presence claim, diet advice, safety/legal guidance, or public-app row was added.

**Next:** continue Caraga inland coverage with station- or voucher-resolved primary evidence that separates marsh, lake, and river locations. Keep historical landing data out of capture-origin maps and current species presence.

### National rollout step 331 - Agusan Marsh eight-lake fish survey provenance review - 31 October 2026

Reviewed the 2017 Philippine Journal of Science record and abstract for Jumawan and Seronay. Normal direct requests to the publisher and Paperzz pages returned HTTP 403, so detailed methods and table structure were read from the search-indexed Paperzz text result; no access challenge was bypassed. The paper describes fish sampling from January 2014 through January 2015 in eight named Agusan Marsh floodplain lakes. Samples were either bought from local fish buyers or caught by resident fisher partners. The published table pools taxa across all eight lakes and does not distinguish, per taxon, which lake supplied a sample or whether it was purchased versus directly caught; its numeric table markers refer to fishing gears rather than lakes.

A 2017 NAST Transactions abstract with the same title and authors also reports 16 species and the same field period, but its length-weight range and mean differ from the PJS article's abstract. No correction or version relationship was located. The article's wording that some fish contribute to residents' diet describes human food use, not fish prey or natural diet. The PJS Author's Guide describes a copyright-transfer form; item-specific reuse terms were not verified. Added `national-caraga-agusan-eight-floodplain-lakes-fish-survey-review-20261031.json` and one source-registry entry. Registry count is now 458. No taxon rows, lake-specific presence, geometry, diet claim, or public-app row was added.

**Next:** seek a Caraga study with species-to-lake provenance and identifiable direct-capture or voucher support. Do not turn this eight-lake pooled fishery list into eight separate lake checklists or natural-diet cards.


### National rollout step 332 - Lake Oro and Lake Dakong Napo historical fish survey review - 31 October 2026

Reviewed the accessible publisher-hosted FishTaxa paper by Cuadrado et al. The study sampled or purchased fish from local fishermen operating in Lake Oro and Lake Dakong Napo during September-October 2017, using hook-and-line, lift-net and cast-net methods. Table 2 footnotes assign source taxa to the individual lakes; the paper reports 10 taxa for Lake Oro, 7 for Lake Dakong Napo and 12 overall. This is stronger historical lake-level attribution than the preceding pooled Agusan Marsh survey, but the sample mode is not resolved per taxon, there are no voucher accession numbers, and the table does not provide taxon-specific sampling stations. Results prose and a figure use *Trichogaster trichopterus* while Table 2 uses *Trichopodus trichopterus*. The source reports human consumption and broad invasive-species context, not a taxon-specific gut-content diet dataset. The first page states all rights reserved; no item-specific reuse grant was verified. Added `national-caraga-lake-oro-dakong-napo-fish-survey-review-20261031.json` and one source-registry entry; the registry now has 459 entries. No taxon table, coordinates, geometry, diet assertion, current-presence claim or public-app row was added.

**Next:** cross-check this lake study’s source-name labels against a current fish taxonomic authority and search for independently reusable specimen/occurrence records for Lake Oro and Lake Dakong Napo. Keep the 2017 lake-coded sample claims historical and separate from current presence.


### National rollout step 333 - Lake Oro and Lake Dakong Napo taxonomy cross-check - 31 October 2026

Compared the 12 binomial labels in the 2019 FishTaxa table against California Academy of Sciences Eschmeyer’s Catalog of Fishes. Its indexed records list all 12 table combinations as valid as printed. The article’s prose label *Trichogaster trichopterus* is a synonym of the Table 2 combination *Trichopodus trichopterus*. The Catalog lists *Clarias batrachus* as valid as printed; a range note that it is known definitely from Java and introduced elsewhere is not treated as a specimen ID, Philippine locality confirmation, or absence claim. Overall catalog overview reports a 20 October 2026 version, but selected exact-name pages display older entry headers and per-entry currency was not confirmed. Normal page opens returned 403/502; indexed official excerpts were used without bypassing access controls. Added `national-caraga-lake-oro-dakong-napo-taxonomy-crosscheck-20261031.json` and one source-registry reference; the registry now has 460 entries. No source rows were altered, no specimen was reidentified, and no lake occurrence, diet, geometry, or public-app row was added.

**Next:** run a bounded search for independently reusable specimen or occurrence records under the Lake Oro and Lake Dakong Napo names. Treat search results as corroboration candidates only; no result or zero-result query substitutes for voucher-level identification or a complete lake checklist.
