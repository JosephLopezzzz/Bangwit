# Bangwit: self-service data acquisition implementation plan

Prepared: **7 November 2026**. Status: **implementation started**. The M0 manifests, resumable OBIS acquisition and first dataset-rights inventory are in the repository. The occurrence snapshot is local research data only; it is not a published species catalog.

## 1. Decision and intended result

Build Bangwit's next data releases from sources we can download and review ourselves. Philippine government replies, letters, restricted portals and approvals are removed from the critical path for the species catalog. Existing correspondence becomes optional follow-up work.

This updates the acquisition and scheduling direction in the [Philippines species expansion plan](PHILIPPINES_SPECIES_EXPANSION_PLAN.md). Keep its fish scope, evidence rules and delivery order: **Luzon, then Visayas, then Mindanao**, covering freshwater, brackish and marine environments. GBIF and OBIS are international services, so the strategy is **self-service open data**, rather than a claim that every source is nongovernmental. Public government datasets may still be used when already accessible with suitable terms; requesting access is unnecessary for this implementation path.

The first useful outcome is a searchable, attributed fish catalog with supported geographic associations, dated evidence, optional diet and photos, and visible coverage gaps. A species can ship with sound identity and location evidence while diet, images or a difficult source remain pending. No plan can guarantee a scientifically exhaustive, current list of every fish in every Philippine waterbody.

The product remains an in-progress Cavite prototype until new packages are implemented, reviewed and released. This plan does not add verified fishing rules, municipal-water boundaries or live safety information; those capabilities require their own authoritative evidence.

## 2. What changes in how we work

The existing plan already proposes bulk collection, but implementation still has many scripts, review files and UI panels tied to one waterbody. The next priority is the shared acquisition-to-publication pipeline.

- Download a nationwide source snapshot once and derive regional queues locally. Use supplemental queries for missing marine geography or named-locality records.
- Reuse existing downloads and reviews before querying again. Preserve original receipts, source versions and admission decisions.
- Implement one configurable importer and regional package builder, with provider adapters. Do not create a new fetch script and UI component for each river or lake.
- Review records in batches under documented rules. Route taxonomy, locality, rights and duplicate conflicts to a focused queue.
- Count usable taxa, geographic associations and processed coverage units. A larger bibliography alone is not catalog progress.
- After two reasonable public retrieval routes or a 60-minute discovery budget per source, record the gap and move on. Reopen it when a new version, accessible route or clarification appears. This timebox limits searching, not the rigor of admission.
- Publish supported increments. An unanswered message or one held species does not block unrelated, eligible records.

## 3. Sources we can obtain without agency correspondence

The core path uses public data and ordinary self-service accounts. Paid APIs, institutional credentials and new cloud infrastructure are not prerequisites. Automated bulk jobs can still queue; their status is polled through the provider rather than waiting for a staff reply. Limits and terms must be rechecked when each adapter is implemented.

| Source and priority | What we gather | Access and implementation choice | Publication and accuracy check |
| --- | --- | --- | --- |
| **1. GBIF** | Museum specimens, observations, original locality/date fields, dataset citations and quality flags | Use the official asynchronous occurrence download service and a free registered account. Most read APIs are anonymous. Prefer a Darwin Core Archive when its original/extended fields are needed; accept existing compatible downloads as inputs. Pin the selected taxonomic checklist and fish selection. | Retain dataset and record terms: CC0, CC BY and CC BY-NC occur. Start new default publication batches with eligible CC0/CC BY records. Country-coded records alone miss some offshore or unlocated evidence. [Downloads](https://techdocs.gbif.org/en/data-use/api-downloads), [formats](https://techdocs.gbif.org/en/data-use/download-formats), [API guidance](https://techdocs.gbif.org/en/openapi/). |
| **2. OBIS** | Complementary marine/estuarine occurrences, provider identifiers, event/method fields and QC flags | Use filtered API/Mapper exports or selected provider Darwin Core Archives. Retrieve the original archive when flattened exports lose event relationships. Avoid a whole-world download. | Resolve duplicates with GBIF first. OBIS excludes/drops some nonmarine or invalid-coordinate records, so it cannot supply the inland master list. Underlying dataset terms still apply. [Access](https://manual.obis.org/access), [policy](https://manual.obis.org/policy), [QC](https://manual.obis.org/data_qc.html). |
| **3. Direct museums and open data repositories** | Provider catalog records, specimen lots, specimen-linked locality text, licensed survey tables | Follow original provider links from GBIF/OBIS; use documented IPT archives or public catalogs from museums/universities, and item downloads from repositories such as Zenodo. Reuse already reviewed CAS and other provider records. | A mirrored record is one underlying item. A repository's metadata license does not automatically cover its deposited files. Preserve the item license and catalog identity. [Zenodo policies](https://about.zenodo.org/policies/). |
| **4. Plazi/TreatmentBank and open studies** | Fish-name candidates, taxonomic treatments, explicit distribution text and survey findings | Reuse the existing freshwater checklist import; acquire relevant structured treatments and openly licensed original study/supplement files. Use DOI metadata to find article versions and corrections. | National or basin inclusion supports that scope only. Review the treatment, parent article, supplement and images under their own terms. A CC0 extraction does not license the parent PDF. [Treatment access](https://plazi.org/treatmentbank/treatment-data-access/). |
| **5. iNaturalist, targeted gaps** | Recent photo-backed wild observations and identification discussions | Use GBIF's existing iNaturalist feed for the broad baseline; query iNaturalist directly for selected recent or missing candidates. Public reads are available; use its documented export route for large jobs. | Observation and photo licenses are separate. Research Grade is a review input, not guaranteed identity. Obscured locations cannot support exact lake/reach assignments; captive/market records require separate contexts. [API practices](https://www.inaturalist.org/pages/api+recommended+practices), [GBIF export](https://help.inaturalist.org/en/support/solutions/articles/151000170346-which-inaturalist-observations-are-exported-for-gbif-and-how-often-does-this-export-happen-). |
| **6. WoRMS and fish-name authorities** | Accepted-name proposals, synonyms, authority, source identifiers and conflicts | Generalize the existing COL matching cache; use WoRMS for relevant candidate names and targeted Catalog of Fishes checks when accessible. Cache and version responses. | No AphiaID requirement for all freshwater fishes. WoRMS forbids harvesting the whole service; match our candidate list. Taxonomy does not establish occurrence or diet. [WoRMS service](https://www.marinespecies.org/aphia.php?p=webservice), [terms](https://www.marinespecies.org/about.php#terms). |
| **7. Crossref and open publishers/repositories** | Bibliography, corrections, license/version links and natural-diet studies | Crossref public reads require no account. Follow links to an accessible, appropriately licensed version; prefer original studies and their supplements. OpenAlex is an optional discovery aid, subject to its current account/quota rules. | Metadata/full-text links are discovery leads, not automatic access or reuse approval. Do not copy abstracts or paper prose into descriptions by default. [Crossref REST](https://www.crossref.org/documentation/retrieve-metadata/rest-api), [full-text access](https://www.crossref.org/documentation/retrieve-metadata/rest-api/text-and-data-mining-for-researchers/), [OpenAlex access](https://help.openalex.org/api/authentication/). |
| **8. HydroLAKES, HydroRIVERS and OSM** | Physical waterbody candidates, names/aliases, lake outlines and river networks | Reuse the downloaded HydroLAKES subset and catchment review. Add selected river/network and OSM features where needed; crosswalk each feature to source-described waterbody identities. | HydroLAKES is CC BY 4.0 and targets lakes/reservoirs at least 10 ha; small waters need other sources. HydroRIVERS uses HydroSHEDS terms, not a blanket CC BY license. OSM is ODbL; store it separately and review derived database/map obligations before distribution. None supplies legal municipal-water limits. [HydroLAKES](https://www.hydrosheds.org/products/hydrolakes), [HydroRIVERS](https://www.hydrosheds.org/products/hydrorivers), [OSM copyright](https://www.openstreetmap.org/copyright). |
| **9. Wikimedia Commons** | Optional representative species photos | Use file-page metadata and the documented MediaWiki API for a small selected set. Cache only eligible assets with creator, file revision and license. | Verify each file's license and identity. An illustrative photo is not a Philippine occurrence record. Keep attribution and modification/crop notes. [Reuse guide](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), [image metadata](https://www.mediawiki.org/wiki/API:Imageinfo/en). |

Operational rules: honor provider limits and `Retry-After`, use a descriptive client identifier, cache responses, and retry with bounded backoff. GBIF search has pagination limits and recommends bulk downloads for large work. iNaturalist recommends roughly one request/second and at most 10,000 requests/day; use exports rather than treating that allowance as a collection target. Exact adapter limits are configuration, not scattered constants.

Account setup is small: reuse Joseph's GBIF account if a fresh bulk export is needed; accept a local export or known download key as an alternative. OBIS public access and Crossref public reads do not need a Philippine agency account. Any required credentials stay in local environment configuration and never enter generated app files or Git. There is no need to paste keys into the chat.

## 4. Collection and data contracts

Use the current Node/Python tooling and build-time public snapshots. Keep manifests and decisions as JSON, larger normalized inputs as streamed JSONL partitions, and raw archives outside the public app and Git. Avoid adding a cloud database or user accounts for acquisition. If measured volume requires an on-disk research index, choose it after the first snapshot rather than adding infrastructure before measuring.

### Acquisition scope

1. Import existing archives and receipts; do not redownload reviewed data merely to move it into the new layout.
2. Create a Philippines country-coded GBIF fish baseline. Resolve a versioned fish-taxon selection covering the intended bony and cartilaginous fishes, with tests against nonfish inclusions; do not assume a single class or the word `fish` covers the scope.
3. Retain records without coordinates when original locality/checklist text may support an association. Preserve all provider flags and source names.
4. Add reviewed marine study-area/envelope queries through GBIF/OBIS for offshore records missing country assignment. These envelopes are discovery filters; neighboring-country or ambiguous records remain for geographic review.
5. Add provider archives, structured treatments and eligible study tables for gaps. Link corrections/errata before extraction.
6. Save query, checklist/version, download key/DOI when available, dataset versions, retrieval time, file hashes, expected/retrieved counts, failed pages and resume state. A partial download must visibly remain incomplete.

Check `basisOfRecord` and `occurrenceStatus` explicitly: fossil records do not enter the living-fish catalog baseline, reported absences never become presence assertions, and unknown status remains reviewable rather than silently converted. Keep source-specific capture/observation context even when the provider supplies a broad occurrence category.

### Shared entities

| Entity | Minimum information |
| --- | --- |
| Acquisition job | Provider, query and fish-selection version, checkpoint, status, counts, hashes, citations, credential-free receipt |
| Dataset | Original provider/dataset identifier, version, source URL, citation, license evidence and allowed public fields |
| Taxon | Internal stable ID, recorded name, accepted-name proposal, authority IDs/version, match method, unresolved conflicts; `aphiaId` optional |
| Evidence | Source record/catalog/occurrence IDs, evidence kind, original name/locality/date, date precision, original coordinates/uncertainty where permitted, wild/captive/landing/market context, QC flags and duplicate group |
| Waterbody | Stable ID, source names/aliases, kind, explicit salinity evidence, basin links, region relationships, geometry source/version/terms and public precision |
| Geographic assertion | Taxon plus supported country/region/waterbody/reach association, evidence links, stated precision and review decision |
| Diet claim | Taxon, foods/categories, method, life stage/size, study location/period, number examined when reported, evidence locator, source/rights and review state |
| Media | Taxon, creator, original file page, revision/hash, license, credit text, modifications, identity review and illustrative/local-observation role |
| Decision and coverage | Candidate ID or batch/rule version, admitted/held/excluded reason, review time, source dependencies; per-unit supported/partial/gap/not-applicable result |

Store collection date, publication date and retrieval date separately. Missing data stays missing. Every generated claim traces back to an evidence row and source locator; automated/AI extraction creates proposals for review and never invents missing information.

### Deduplication and geography

- Match exact persistent occurrence URLs/IDs and institution + collection + catalog identifiers before fuzzy grouping. Treat conflicting identifiers as conflicts rather than forcing a merge.
- Link GBIF, OBIS, iNaturalist and provider mirrors under one underlying evidence group. Multiple portals do not count as independent confirmation. Keep useful complementary fields and original provenance.
- Make possible duplicates review groups; do not merge separate specimens because species, date and coordinates happen to agree. GBIF's [clustering guidance](https://techdocs.gbif.org/en/data-processing/clustering-occurrences) provides useful cases.
- Assign the narrowest geography supported by the source and uncertainty. Country-only records can support a reviewed country catalog entry but cannot appear as records for a selected lake or region.
- Named-locality records can support text associations without map pins. A basin association never implies presence in every river, tributary or lake in that basin.
- Keep waterbody kind separate from salinity. Use explicit study/site evidence for freshwater/brackish/marine labels; a species' general habitat is not a salinity measurement for its observation.
- Reuse the pinned administrative registry with its existing workbook-verification caveat. Preserve original source-era geography and ambiguous assignments. An inaccessible workbook does not erase a valid named-waterbody record, but an unresolved region relationship must remain unresolved.

## 5. Review and publication without repeated access requests

Use admission rules instead of a fixed number of independent sources. One properly documented specimen or observation can support a precisely worded, dated evidence entry. Extra corroboration is useful for conflicts; a mirror of the same item adds no independence.

**Default new publication lane:** eligible CC0/CC BY data with consistent source identity, acceptable taxon resolution, supported geographic scope, retained date precision and complete attribution. Audit each dataset/adapter before applying approved batch rules. Record which rules admitted each row and inspect every flagged exception. For straightforward rows, audit at least 10% rounded up, with a minimum of ten rows or the whole batch if smaller; spread the sample across providers and geographic/date groups present in that batch. Freeze the candidate membership, sample IDs, rule version and source hashes in the decision receipt. A failed audit pauses approval of the affected batch and expands review to all rows affected by that failure mode; fix the rule/source issue and repeat the audit before publication. Existing approved outputs keep their recorded terms and decisions.

**Focused review lane:** fuzzy names, disputed identities, uncertain geography, record/dataset rights conflicts, protected/obscured locations, and captive/market/landing context. Retain candidates at the supported rank and scope; species identity cannot be filled in from a genus label. No numeric confidence score silently overrides these gates.

**Restricted or unavailable lane:** NC/ND or unclear reuse, missing original tables, denied files and inaccessible catalogs. Retain bibliographic metadata and the issue, select another eligible source, and continue the batch. Do not use a mirror to bypass access controls or treat a source that is free to read as permission to redistribute its text or figures. Revisit rights for the intended use when new information arrives.

Diet is reviewed independently from occurrence. Prefer gut-content or directly documented feeding studies, with life stage, place, period and method. Stable-isotope work supports appropriately qualified food-web inference. An overseas study may appear as clearly labeled general study context; it does not become a Philippine diet measurement. Natural feeding, aquarium feed and angling bait are distinct. Unknown diet should display “No reviewed diet source yet” rather than a generated food list.

Literature extraction order: accessible original study and supplement -> independently licensed repository version -> structured treatment/data record -> metadata-only gap. Prioritize diet for species already supported in the first regional packages. Reuse the existing Taal and Palawan guides where their current approvals fit; do not re-review them just to increase source counts.

## 6. Concrete implementation backlog

All new paths and commands in this section are **proposed**. Existing files are identified explicitly. Implement the smallest complete vertical slice first; do not refactor every historical generator before proving it.

| Milestone | Work and concrete deliverable | Completion gate | Planning estimate |
| --- | --- | --- | --- |
| **M0: Reuse and freeze** | Inventory existing archives, hashes and decisions. Mark old requests as optional. Create a versioned national acquisition config and batch manifest. Reuse the existing source/admin registries and freshwater candidates. | Existing approved evidence is accounted for; query scope, rights policy, directories and first region are explicit. | 0.5 day |
| **M1: Shared acquisition** | Add provider adapters under proposed `scripts/species/national/`; accept local files or download keys, add GBIF bulk status/resume and filtered OBIS acquisition. Write receipts to proposed `data/research/philippines/national/jobs/`. | Existing archives import; an interrupted job resumes; expected/retrieved totals and failures reconcile. No credential or raw archive enters public output. | 1–2 days, excluding provider queue time |
| **M2: Normalize and crosswalk** | Produce shared datasets/taxa/evidence records; generalize `match-freshwater-taxonomy.mjs` caching/metadata pins. Deliver the first-region waterbody registry with stable IDs, aliases and region/basin relationships. Add mirror grouping, scope-aware geographic assertions and a prioritized exception queue. | Cross-provider duplicate examples reconcile; valid freshwater IDs work without WoRMS; broad/uncertain locality stays broad. Ambiguous waterbody/region joins remain held; complete national geometry is not a dependency. | 2–3 days |
| **M3: Regional package builder** | Proposed `scripts/species/build-regional-packages.mjs`; regional `scope.json`, `decisions.json` and `coverage.json` under proposed `data/research/philippines/regions/<id>/`. Generate one small catalog index and region packages from admitted assertions. | Same inputs generate identical public files; each claim carries citation/date/license/scope; held rows cannot leak. CALABARZON fixture proves the path. | 1–2 days |
| **M4: Diet and optional media — parallel enrichment** | After M2 defines shared IDs, adapt existing feeding-guide data to independently approved study/media records. Add targeted Crossref/publisher discovery and selected Commons enrichment alongside M3/M5. | Verify attribution and study context for enrichment actually included. An occurrence package can release with no new diet/photo; M4 does not block M5. | 1–2 days when included |
| **M5: Product integration and acceptance** | After M3, deliver shared region/waterbody/species navigation, evidence list and source display. Use existing controls and bilingual text. Load selected regional data rather than importing every named-waterbody panel into one page. | Filters, keyboard/mobile behavior, source links, loading/error/gap states and payload checks pass, including an occurrence-only package with unknown diet/no image; existing journal and evidence fixtures remain compatible. | 2–3 days |

Allow roughly **10–15 focused working days for the shared pipeline and first integrated regional slice**, including fixes. This is an engineering estimate, not a nationwide coverage deadline. Measure actual downloaded volume, exception rate and review time in M1–M3 before estimating the rest.

Reuse these existing foundations:

- `scripts/species/import-freshwater-checklist.py` and `data/research/philippines/freshwater-checklist-candidates.json`: the existing extracted national freshwater candidates and source hashes.
- `scripts/species/match-freshwater-taxonomy.mjs`: pinned taxonomy metadata, cached responses, retry and conflict handling.
- Existing `build-*-evidence.mjs` outputs: fixtures for provenance, admission and deterministic generation; avoid copying their hardcoded counts into the generic builder.
- `data/research/philippines/sources.json` and `administrative-registry.json`: existing references, decisions and administrative identifiers, with their documented limitations.
- `src/lib/species-research.ts`, `src/components/feeding-guides.tsx` and the evidence components in `src/app/species/page.tsx`: working filters/content semantics to adapt to a shared contract.

Keep raw acquisition outside `src/`, `public/`, the browser bundle and the service-worker precache. Generated regional packages must contain only approved public fields. Package loading must follow the existing offline design; do not precache all national raw data or silently expand the offline footprint. No live provider request is required every time a species card opens.

## 7. Regional delivery and completion

National acquisition can feed later regions immediately. Review and publish in the existing order below. These are work queues and initial anchors, not claims that the named waters have adequate records or that the anchors comprise every waterbody.

| Order | Region | First inland focus | Coastal/transition focus |
| --- | --- | --- | --- |
| L1 | CALABARZON | Existing Taal, Palico-Lian, Laguna de Bay and reviewed Cavite/Quezon waters | Manila Bay, Batangas and Quezon sources |
| L2 | NCR | Pasig-Marikina and documented lake connections | Manila Bay and tidal reaches |
| L3 | Central Luzon | Pampanga, Angat, Pantabangan, Candaba and verified tributaries | Bataan, Zambales, Aurora and shared Manila Bay |
| L4 | Ilocos | Lower Agno, Abra and Amburayan locality evidence | Lingayen Gulf and Ilocos coast/estuaries |
| L5 | Cagayan Valley | Cagayan, Magat and separately identified lakes/tributaries | Cagayan/Isabela coast and Batanes |
| L6 | CAR | Chico, upper Agno, Abra, Ibulao and named small inland waters | Marine not applicable; verify any proposed salinity claim |
| L7 | Bicol | Bicol River, Buhi, Bato, Baao and identified tributaries | San Miguel Bay and mainland/island coasts |
| L8 | MIMAROPA | Naujan and distinct island/Palawan river, lake and stream records | Mindoro, Marinduque, Romblon and Palawan coastal/estuarine sources |
| V1 | Western Visayas | Panay/Jalaur and documented inland waters | Panay/Guimaras coast and estuaries |
| V2 | Negros Island Region | Ilog-Hilabangan, Siaton, Balanan/Balinsasayao and distinct Siquijor waters | Negros and Siquijor coasts |
| V3 | Central Visayas | Loboc and independently named Cebu/Bohol waters | Cebu/Bohol coastal/tidal sources |
| V4 | Eastern Visayas | Leyte lakes Danao/Bito and documented Samar/Leyte rivers | Leyte Gulf and other island coasts |
| M1 | Northern Mindanao | Cagayan de Oro, Tagoloan, Pulangi and named Bukidnon inland waters | Northern coastal/island waters |
| M2 | Davao | Davao, Tagum-Libuganon, Lake Leonard and identified tributaries | Davao Gulf and eastern coasts |
| M3 | Caraga | Agusan River/marsh and Lake Mainit with locality-specific evidence | Butuan Bay and Surigao/Dinagat sources |
| M4 | SOCCSKSARGEN | Sebu/Seloton and reviewed basin tributaries | Sarangani Bay and documented coast/estuaries |
| M5 | Zamboanga Peninsula | Verified peninsula rivers, wetlands and impoundments | Peninsula/Sulu study areas under the pinned administrative crosswalk |
| M6 | BARMM | Lanao, Agus/Mindanao systems and identified wetlands/tributaries | Basilan/Tawi-Tawi and mainland coastal sources |

Use these repeatable steps for every region:

1. Freeze the administrative/waterbody/habitat scope and source-search list for the batch, including known small-water gaps.
2. Derive its candidates from the shared snapshot; process freshwater, brackish and marine queues where applicable. A marine-rich dataset cannot satisfy the inland queue.
3. Apply reviewed batch rules; resolve the highest-impact exceptions and retain explicit holds for the rest.
4. Generate supported records, diet links and optional media; show a coverage outcome for each scoped unit even when no usable evidence was found.
5. Reconcile input, normalized, mirror, unique, admitted, held and excluded counts. Record taxon and waterbody-association totals separately.
6. Integrate the region, verify the selected release, then advance to the next region. Add unresolved gaps to its next-version backlog.

A **regional review batch is complete** when its frozen search/candidate scope has decisions and coverage outcomes. A **regional package is integrated** when its supported content works in the app. A **release is complete** only after its deployment acceptance. These statuses do not mean every species or every local waterbody is documented. Gaps remain visible after moving to the next region; unresolved gaps must not prevent the entire Luzon-to-Visayas-to-Mindanao sequence indefinitely.

Use one release receipt per batch, listing snapshot date, scope, evidence period, unique taxa, supported geographic associations, habitat coverage, exception reasons and verification. Avoid adding a separate progress milestone for every paper visited.

## 8. Gathering genuinely new observations ourselves

Open archives may still leave recent freshwater and small-waterbody gaps. After the importer and first catalog release, Joseph can run an optional Cavite observation pilot to create original evidence, then extend through volunteers or university/naturalist groups. This is an additional workstream and is not needed to start the pipeline.

- Start with a repeatable observation form: date/time, observer identifier, named waterbody/site, public location precision, habitat notes, diagnostic photos, wild/captive context and identification history. Preserve unknown values.
- Use lawful, noninvasive observation/photo opportunities at accessible sites. Sampling, collection or restricted-site activities require separate planning; this plan does not authorize them.
- Ask contributors explicitly what can be published and under which data/photo license. Private Bangwit catch logs are never imported or uploaded automatically; any public contribution is a separate opt-in action.
- Propose identification at the level supported by the photos. Ambiguous gobies, juveniles and look-alikes remain at genus/family or held until qualified review; model guesses do not become verified records.
- Publish confirmed material as dated observations with reviewer/provenance information. Repeated observations improve recent evidence; an unobserved species is not absent and photos alone do not establish population trends.
- Gather diet from reviewed feeding studies or carefully documented observed feeding behavior labeled as such. Do not infer diet from a caught fish, chosen bait or a photograph of the fish alone.

## 9. Verification and maintenance for implementation

The plan itself is documentation. During implementation, add meaningful pipeline fixtures rather than a test for each research note. Required cases are interrupted/resumed acquisition, truncated pagination, missing/conflicting licenses, cross-provider mirrors, taxonomy conflicts, freshwater taxa without AphiaIDs, unlocated/obscured records, partial dates, market/captive context, shared coastal/basin geography, and a failed batch audit that prevents publication until the affected rows are reviewed.

Validate that source counts and foreign keys reconcile, admitted claims retain locators/attribution, exclusions/holds stay outside public outputs, and identical pinned inputs reproduce the same packages. Typecheck/build and focused UI checks follow actual app changes; verify keyboard and mobile filters, correct empty/gap states and regional loading. Run storage/offline regressions when integration touches their contracts or caching. Existing approved fixtures must retain their evidence meaning.

After release, refresh on a deliberate schedule: compare provider versions/modified timestamps and hashes, acquire changed inputs, rerun affected decisions and show removals/corrections before publication. Never silently overwrite old evidence with a different taxon or location. Keep a small changelog and rollback to the preceding generated package if a source correction invalidates a release. Cadence is configurable; no scheduled job or reminder is created by this plan.

Measure throughput after the first batch: rows processed per run, unique records after mirrors, percentage needing review, review minutes per exception, newly supported taxa and waterbody associations, inland/coastal gaps, package bytes and external failure rates. Use these measurements to estimate subsequent regional batches and prioritize gaps users can actually explore.

## 10. First action when implementation is authorized

The initial **M0/M1 slice is underway**: existing provider snapshots are inventoried; the national acquisition config and CALABARZON-first batch manifest are pinned; a cursor-resumable OBIS Philippines-area snapshot and credential-free receipt are implemented; and metadata for all contributing datasets is inventoried with contact fields omitted. An initial 2,746-group Actinopterygii candidate index is built from 66,283 species-rank rows, with provider identifiers and name variants kept for crosswalk review. An M2 triage now scans that snapshot against CALABARZON province-name labels, prioritizes a CAS CC0 specimen subset, and emits its 3,268-row review partition only to ignored local research storage. The CAS dataset and record metadata passed a source-license screen for continued research-candidate review. The acquired snapshot and live CAS publisher record both cite version 150.547; the OBIS descriptive page still shows the older version 150.540 and is recorded as stale mirror metadata. These are research candidates, not admitted species assertions. The GBIF bulk adapter is implemented but has not submitted a request because the fish-wide taxonomy selection is not pinned.

Next, review the CAS local candidate rows for taxon identity, source locality, waterbody association and coordinate sensitivity. The first CALABARZON text triage found 3,268 CAS specimen rows under province-name labels, but those are not verified regional or waterbody associations and none is publication eligible. Resolve the GBIF/Catalogue of Life mismatch in parallel; only after its taxonomy and request predicate are pinned should a GBIF bulk request be submitted. Carry admitted records through the CALABARZON package builder and app, then scale the same workflow in the listed Luzon, Visayas and Mindanao order.

This document authorizes no external messages, account changes, paid services or public release. Those actions remain subject to Joseph's instructions; ordinary implementation work can proceed when requested.
