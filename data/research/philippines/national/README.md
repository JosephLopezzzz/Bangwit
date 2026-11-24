# National self-service acquisition

This directory holds versioned query policy, batch manifests and credential-free acquisition receipts. Raw API pages and source archives stay under `data/research/philippines/raw/`, which is ignored by Git.

## First national discovery slice

The first executable slice is an OBIS query for area `191` (OBIS's Philippines area) and taxon `10194` (`Actinopterygii`). This is a marine/estuarine discovery feed of ray-finned-fish occurrences. It is **not** every fish group, a legal boundary, a freshwater inventory, a local presence checklist, or publication approval. Contributing dataset and record licenses still need review before any row can be reused.

The query and job ID are pinned in `batch-manifest.json` and `acquisition-config.json`. The adapter stores each response page as a compressed raw response, hashes both its original and compressed bytes, and atomically advances a cursor checkpoint. If a run stops, use `--resume`; it verifies previous page hashes and continues from the saved OBIS `after` cursor. If the provider's total changes, the job pauses so a new snapshot can be reviewed instead of silently mixing versions.

```powershell
npm run species:national:obis:estimate
npm run species:national:obis:fetch
npm run species:national:obis:verify
```

`fetch` downloads public OBIS occurrence records to local research storage only. It does not normalize taxonomic identities, resolve duplicate GBIF/OBIS mirrors, check every dataset license, create species assertions, or modify the app. No credentials or personal contact information are used or recorded.

After the snapshot completes, `npm run species:national:obis:rights-inventory` groups occurrence rows by the 46 contributing dataset IDs, summarizes record-level license values and occurrence fields, and retrieves each dataset's citation/rights metadata. It intentionally omits dataset contact fields from sanitized metadata snapshots. All 46 metadata records were retrieved; 45,133 rows have missing or unresolved record-level license values, while 43,190 rows belong to one mixed-license dataset. Every dataset remains held for human review; this report does not turn a machine-read license string into reuse approval.

`npm run species:national:obis:taxon-candidates` builds a separate candidate index from the verified raw pages. The current snapshot has 66,283 species-rank rows grouped into 2,746 provisional identity groups. The index retains OBIS `taxonID`, `speciesid` and `aphiaID` as separate identifiers and keeps name variants. It adds no accepted-name, local-waterbody or public-presence assertions.

## GBIF bulk downloads

The GBIF adapter supports account-authenticated request submission from a reviewed local query manifest, anonymous polling by GBIF download key, and resumable ZIP transfer. Account settings are read only from local environment variables (`GBIF_USERNAME`, `GBIF_PASSWORD`, `GBIF_NOTIFICATION_EMAIL`) or the ignored `.env.local`; they are never copied into a query manifest or receipt. Submitting a request is a separate action from the OBIS import and requires an approved, versioned fish selection. That selection is not pinned yet, so no GBIF bulk request has been submitted.

```powershell
npm run species:national:gbif -- status --job <receipt-id>
npm run species:national:gbif -- resume --job <receipt-id>
```

The receipt ID comes from a prior GBIF request. The adapter records the download DOI/citation, counts, query hash, archive size and hash, and transfer checkpoint. A downloaded ZIP remains pending structural validation and rights/taxonomy review.

## Candidate fish-wide taxonomy selection

`npm run species:national:gbif:taxon-candidates` resolves seven GBIF Backbone class roots and compares those names against the Catalogue of Life checklist. The generated artifact is `reviews/gbif-ph-fish-taxon-selection-20261107.json`; raw API responses and hashes are kept in the ignored national research directory.

This is only a query-scope candidate. The Backbone candidate roots are Actinopterygii, Myxini, Petromyzonti, Holocephali, Elasmobranchii, Dipneusti, and Coelacanthi. The same root names did not all resolve as class-level exact matches in the Catalogue of Life comparison. GBIF documents that omitting `checklistKey` uses its older Backbone taxonomy for downloads, while an explicit checklist controls both filtering and output taxonomy. Therefore the draft request remains `readyToSubmit: false` until taxonomy and predicate behavior are reviewed. No GBIF download is submitted by this command.

The proposed request is Philippines country-coded records only. It does not cover unlocated/offshore records, establish freshwater/brackish/marine site context, resolve species names, exclude every fossil record, or approve reuse. Keep those as separate review stages.

## CALABARZON triage from the national snapshot

`npm run species:national:obis:calabarzon-triage` scans the verified OBIS pages and creates `reviews/obis-ph-actinopterygii-calabarzon-triage-20261107.json`. It cross-checks the five CALABARZON province-name labels in `stateProvince` and ranks datasets whose record and dataset licenses appear compatible with the project's initial CC0/CC BY review lane. This is a queue for source/locality/taxonomy review; it does not assign rows to a region or waterbody and does not approve publication.

The first high-yield rights candidate is CAS Ichthyology (ICH): the acquired OBIS slice has 13,261 rows, all with explicit CC0 record license and `PreservedSpecimen` basis of record. It has coordinates and locality strings on all rows; 7,675 rows have a coordinate-uncertainty value, 13,197 rows have `country=Philippines`, and 64 lack the country field. All rows have missing `occurrenceStatus`. Across the full Actinopterygii snapshot, 12,966 rows match the five province-name labels; within the CAS subset, 3,268 match and all have `country=Philippines` (Batangas 2,938; Cavite 157; Quezon 101; Rizal 70; Laguna 2). Of those CAS regional text matches, 1,235 have coordinate-uncertainty values and 978 have a `waterBody` value. CAS is the only dataset in that coarse CALABARZON queue that passes the initial CC0/CC BY metadata screen. These counts are not species totals or verified waterbody associations. The tracked summary contains no coordinates or locality strings. A 3,268-row field projection is written only to the Git-ignored `data/research/philippines/raw/` directory for local review; it omits `recordedBy`, `identifiedBy`, and dataset contact fields and is excluded from the app bundle. Review original locality/context and coordinate precision before any public use.

### CAS rights review

The manual source-license screen is recorded in `reviews/obis-cas-ich-cc0-rights-review-20261107.json`. All 13,261 acquired rows have explicit CC0 record-license URLs, the captured dataset metadata also states CC0, and the rights inventory found no license conflict or unresolved license flags. This clears the dataset for continued research-candidate review only; it does not make any row or species publishable.

The version difference is reconciled: the live California Academy publisher IPT record and acquired-snapshot metadata both show version 150.547 (updated 2026-11-03); the OBIS descriptive page still shows 150.540 (published 2026-09-14), so that index page is stale for this snapshot. Use the publisher's exact 150.547 citation and retain the mirror-page discrepancy in provenance. The 3,268 CALABARZON records still need taxon, locality/waterbody, and coordinate-precision review; every record has missing `occurrenceStatus`, so none establishes current presence. The source also does not fill the inland freshwater lane.

`npm run species:national:obis:calabarzon-row-review` profiles the hash-checked 3,268-row local partition and writes `reviews/obis-cas-ich-calabarzon-row-context-review-20261107.json`. The rows contain 3,268 unique occurrence IDs, 1,146 distinct provider scientific-name strings and 1,146 AphiaIDs; there are no name-to-multiple-AphiaID groups in this snapshot. There are 2,774 species-rank rows and 494 with missing rank. The `scientificName` and `originalScientificName` fields differ on 361 rows, which are name-crosswalk candidates rather than automatically rejected or accepted names. The report also records that all rows have locality text and coordinates, only 978 have `waterBody`, and 2,033 lack coordinate-uncertainty values. The provider marine/brackish flags overlap and are not used to infer water type. No points are assigned to a province polygon; the tracked report contains no exact coordinates, locality strings, or record IDs, and all 3,268 rows remain held.

### WoRMS Aphia identifier crosswalk

`npm run species:national:obis:calabarzon-worms` queries the public WoRMS REST API in batches of no more than 50 AphiaIDs. The 1,146 unique IDs all returned records. Among these, 1,120 have `valid_AphiaID` equal to the source ID, 24 redirect to another accepted AphiaID (all 24 target names matched the queried record's accepted-name field), and two records have no valid-ID pointer. The status counts include 26 records not marked `accepted`; 158 returned IDs are higher than species rank (59 Family, 96 Genus, 3 Subfamily), while 988 are Species rank. The OBIS `scientificName` matches the WoRMS name for all 1,146 queried IDs, but the original source name differs on 361 occurrence rows. These are crosswalk and review signals; they do not make a taxon accepted for Bangwit or validate locality, habitat, presence, or identification.

The full WoRMS responses are cached only under the Git-ignored research raw directory. The tracked aggregate is `reviews/obis-cas-ich-calabarzon-worms-crosswalk-20261107.json` and contains no WoRMS scientific names, occurrence IDs, coordinates, or locality strings. WoRMS requires citation and a link when its content is distributed; its terms also require at least four updates per year when distributing WoRMS content and prohibit redistribution of the full database. Recheck the current terms before any app integration. The 26 non-accepted statuses, two missing valid-ID pointers, 158 higher-rank IDs, and 361 original-name differences remain manual review queues.

The adapter needs no API key, reuses cached batches by default, and supports `npm run species:national:obis:calabarzon-worms -- --refresh` to fetch a new dated snapshot without replacing the previous local cache.

### Pinned provincial boundary cross-check

`npm run species:national:obis:calabarzon-geometry` checks the local CAS partition against the geoBoundaries gbOpen Philippines ADM2 province polygons. The API metadata identifies a 2020-representative layer with 87 province features, sourced from NAMRIA, the Philippines Statistics Authority and OCHA Philippines; its source-data integration date is 19 January 2023 and the geoBoundaries build date is 5 July 2023. The downloaded simplified GeoJSON is pinned to geoBoundaries commit `41af8f1`, SHA-256 checked, and licensed CC BY 3.0 IGO. Any future distribution of derived boundary content must retain the required attribution and recheck the exact source license/version.

In this 3,268-row consistency screen, 320 points fell inside the province named by their source text, 72 fell inside a different province polygon, and 2,876 fell outside all land polygons. All 72 cross-province points had coordinate-uncertainty values; an approximate distance hint suggests 2 uncertainty radii can reach the reported province boundary and 70 cannot. These are manual review priorities only: coastal and offshore occurrences can correctly fall outside land polygons, and this simplified administrative layer cannot validate a municipality, waterbody, marine jurisdiction or present-day legal boundary. No row or species was admitted. Exact row details are written only to the Git-ignored local queue `data/research/philippines/raw/national/obis-cas-calabarzon-boundary-review-queue-v1.jsonl`; the tracked report `reviews/obis-cas-ich-calabarzon-geoboundaries-20261107.json` contains aggregate counts without occurrence IDs, coordinates, locality strings or per-record assignments. The geometry itself is also kept in ignored local research storage and is excluded from the app bundle.

### HydroLAKES Philippines waterbody candidates

`npm run species:national:hydrolakes-philippines` reads the existing Asia subset archive and checks both its published Zenodo MD5 and the previously recorded SHA-256 before extracting Philippine attribute rows. The source archive contains 250,196 Asia rows; 1,298 are marked `Country=Philippines`. Only 6 rows have a non-empty `Lake_name` field and 1,292 do not. This is expected to be a weak naming layer: HydroLAKES documentation says the name field is populated selectively for very large lakes, named reservoirs and some smaller source-database lakes. A blank name does not mean the lake lacks a local name.

The 1,298-row attribute and pour-point queue is Git-ignored at `data/research/philippines/raw/national/hydrolakes-philippines-v1-waterbody-candidates.jsonl`; its tracked receipt is `reviews/hydrolakes-philippines-candidate-extract-20261107.json`. No lake polygons are copied into the app, and no region, waterbody identity or fish assertion is assigned. HydroLAKES v1 aims at lakes of at least 10 ha and explicitly omits river and wetland polygons, so separate source work remains necessary for small lakes, ponds, rivers, streams and wetlands. The original product and the Zenodo Asia subset are CC BY 4.0; preserve attribution and re-review the actual source version before any redistribution.

## Central Luzon source leads

### Guiguinto and Meycauyan river nekton lead

The March 2015 draft North South Commuter Rail EPRMP's Table 2.15 lists giant mottled eel, catfish, tilapia, and mudfish/striped snakehead as nekton for the Guiguinto and Meycauyan rivers. These are common-name labels only; the report gives no fish-specific collection date, method, counts, vouchers, or separate river/station attribution. Browser text extraction renders the nekton cell as shared across both river rows, but the PDF screenshot request timed out, so the table layout is not visually verified. No scientific-name, occurrence, or app rows were added. Keep this as a historical research lead and do not equate the March 2015 report date with a fish sampling date. See `reviews/region03-guiguinto-meycauyan-2015-nscr-eprmp-fish-context-review-20261120.json` and the source entry in `data/research/philippines/sources.json`.

### Northern Zambales historical marine landings

The official BFAR/NFRDI 2009 stock assessment summarizes NSAP landing data from 1998-2002 and says 121 species were identified. Its reviewed figure and selected tables expose 19 scientific-name labels, including ten dominant raised-catch entries, but not the complete species-by-site matrix. The abstract and methods differ in how they describe the named study/landing areas; species and catches remain aggregated to Northern Zambales. Preserve the historical period and raised-catch metric, do not assign names to individual municipalities or current waters, and do not treat the list as a full checklist or abundance estimate. The PDF provides no item-specific reuse license. No occurrence, waterbody, geometry, or app data were added. See `reviews/central-luzon-northern-zambales-nfrdi-2009-fish-stock-assessment-review-20261124.json` and the source entry in `data/research/philippines/sources.json`.

The 2018 NFRDI-hosted Yutuc et al. tuna assessment covers six NSAP landing stations in Subic, Masinloc and Sta. Cruz for 2003-2012 and names eight tuna species in its appendix. It is a later period than the 1998-2002 report, but shares the NSAP program and some named stations; catches are raised and may include vessels from nearby provinces. Keep the periods and metrics separate, and do not map port landings to capture waters or call the appendix a current distribution list. No item-specific reuse terms were found, and no app or occurrence rows were added. See `reviews/central-luzon-zambales-yutuc-2018-tuna-resource-review-20261124.json` and the source entry in `data/research/philippines/sources.json`.

## NCR waterbody source leads

### NCR incomplete-discovery checkpoint

The 24 November checkpoint records 17 administrative units, 107 NCR evidence references and 74 open research items. It preserves NCR as partial and leaves its source-derived waterbody denominator and scope freeze unresolved. The generated Luzon evidence audit has no broken JSON references or missing source links, but that integrity check is not a regional coverage result. One attributed historical Pasig River collection-event card is present in the source tree for *Arius manillensis* (three individuals, 29 October 2025); its coordinates are withheld and it is not a complete NCR baseline or release approval. The checkpoint permits Region III discovery to begin while NCR remains open. See `reviews/ncr-incomplete-coverage-checkpoint-20261124.json`.

### NCR NAPWC Lagoon geometry lead

The historical BMB inland-wetlands rows label a Quezon City pond as “Ninoy Aquino Parks and Wildlife Center Lagoon” in the 2016 atlas and “Ninoy Aquino Parks and Wildlife Center” in the 2019 inventory; both show 3.39 ha and likely share inventory lineage. Quezon City's 2018 ecological profile independently describes a man-made lagoon at NAPWC. BMB PAIS's indexed profile describes an approximate 4.0 ha man-made lagoon in the park's northwest, with an islet; the direct PAIS page request timed out, so this is recorded as an indexed source finding. The two reported areas conflict and their dates and measurement methods are not reconciled.

OpenStreetMap contributors have a closed `natural=water` polygon named “Parks and Wildlife Lagoon” ([way 37400786](https://www.openstreetmap.org/way/37400786)). It is a community geometry lead, not an official outline or independent survey. The API snapshot remains in ignored local research storage; no geometry is committed or used by the app. OSM data is under ODbL 1.0, with attribution and share-alike terms for adapted database distribution ([OpenStreetMap copyright and license](https://www.openstreetmap.org/copyright)). The BMB-to-OSM match, official shoreline, current area, fishing permission, and fish presence remain unverified. See `reviews/ncr-napwc-lagoon-alias-review-20261119.json` and the source entries in `data/research/philippines/sources.json`.

## Existing inputs reused by M0

- `data/research/philippines/raw/freshwater-download-receipt.json` and `freshwater-checklist-candidates.json`: the existing pinned Plazi/GBIF freshwater checklist snapshot; 374 extracted names remain research candidates.
- `data/research/obis/cavite/cavite-obis-occurrences.csv`: the prior 160-row Cavite export; it remains subject to row/dataset rights and locality review.
- `data/research/philippines/calabarzon-obis-philippines-area-review-20261024.json`: previous count-only discovery (128,352 ray-finned-fish occurrences). The new acquisition refreshes this count before retrieval.

The next stage is to manually review the 72 local cross-province flags alongside source locality, waterbody, date, taxon and coordinate uncertainty; then resolve the WoRMS higher-rank and non-accepted queues against an explicitly pinned fish checklist. Crosswalk HydroLAKES candidates against independent regional lake names and keep the 1,292 blank-name rows unresolved. Continue acquiring separate river, stream, wetland, brackish and marine sources; the existing boundary and lake layers do not identify all those waters. Resolve the GBIF/Catalogue of Life mismatch in parallel; no GBIF request should be submitted until its predicate, taxonomy, and expected archive size are reviewed. Keep optional account credentials local. No Philippine government request is a prerequisite to this batch.

### Marikina GenBank and BOLD metadata crosswalk

The 19 November 2026 NCBI E-utilities fetch returned all 36 GenBank accessions JF498719.1-JF498754.1. Their source features provide 36 unique specimen-voucher strings and BOLD process IDs, with five coordinate clusters and three collection dates; the metadata copy omits nucleotide strings and stays in Git-ignored research storage. GenBank’s process-ID prefix is **BPMP**, while the article review transcribed **BMP**. The BOLD Portal API accepted all 36 IDs in six batches but returned empty metadata summaries; the legacy v3 endpoint returned HTML rather than TSV. This is a bounded failed cross-check, not proof that the specimens are absent from all BOLD services. No accession is assigned to one of the article’s five stations, and no species rows or coordinates are projected. See `reviews/ncr-marikina-2011-genbank-bold-metadata-crosswalk-20261119.json`. The remaining work is a museum-catalog/voucher crosswalk and independent resolution of the BMP/BPMP and station mapping.

### Marikina primary-paper identifier and catalog search

The primary PDF confirms that the paper itself prints **BMP001-11 through BMP036-11**, while the GenBank db_xref values use **BPMP001-11 through BPMP036-11**. The paper names five stations and includes a station map, but does not link each voucher/accession to a station. Bounded exact-label and UP-domain web searches found no separate public museum catalog or supplement to reconcile the conflict; this is not an exhaustive catalog search. Keep the spelling and locality crosswalk unresolved. See `reviews/ncr-marikina-2011-source-prefix-and-public-catalog-search-20261119.json`.

### Marikina coarse municipal-boundary screen

A local point-in-polygon screen compared the five rounded GenBank coordinate clusters with geoBoundaries 2020 ADM3 polygons (metadata source organizations include NAMRIA, PSA, and OCHA Philippines). Four clusters fall inside Marikina and one inside Rodriguez; one Marikina-classified point is close to the San Mateo boundary, where rounded coordinates and simplified geometry prevent a definitive side assignment. These polygons are administrative context, not river geometry or survey-grade boundaries, and the paper does not join individual accessions to its five named stations. No coordinates, geometry, station links, species rows, or public projections were added. See `reviews/ncr-marikina-2011-coarse-municipal-boundary-crosscheck-20261119.json` and the geoBoundaries entry in `data/research/philippines/sources.json`.

### Marikina Figure 1 station-sequence cross-check

Figure 1 numbers five named Marikina River-system stations from north to south. The five rounded GenBank coordinate clusters have a broadly matching spatial order: Rodriguez, a cluster near the Marikina-San Mateo boundary, then three Marikina clusters. This makes a one-cluster-per-station interpretation plausible, but it is an inference: the paper provides no accession/voucher-to-station table, station-specific specimen counts, or georeferenced cluster list. Keep all station assignments research-only and unverified. No exact coordinates, species rows, geometry, or public projection were added. See `reviews/ncr-marikina-2011-figure1-coordinate-cluster-sequence-review-20261119.json`.

### BFAR public eFOI attachment lead

The public eFOI search index shows a 22 May 2023 BFAR response to a Marikina River fish-information request and names an attached letter from DA-BFAR Regional Fisheries Office-NCR. The response text does not expose the letter or any biological data. Direct retrieval returned a service error and Cloudflare challenge; neither was bypassed, and no attachment was downloaded. The requester-entered 2000–2023 coverage range is not verified data coverage. Treat this as a retrieval lead only; it adds no species, occurrence, sighting, gear, or fisher records. See `reviews/ncr-bfar-marikina-public-foi-attachment-access-review-20261124.json`.

### PSA Marikina request and general statistics referrals

A separate public PSA response dated 2 June 2023 says PSA did not have specific data for a request about Marikina River fish species, sighting locations, fishing gears, and fisher counts. It points to four general statistics products, but no table-level Marikina waterbody or taxonomic resolution has been established. Treat those links as discovery routes only; they are not fish-occurrence evidence or substitutes for a site-resolved survey. No species, catch, gear, or fisher records were added. See `reviews/ncr-psa-2023-marikina-fish-species-foi-response-review-20261124.json`.

The same May 2023 request appears in an official eFOI search-listing excerpt as **DENIED** at NFRDI and **CLOSED** at PCAARRD. Their response text and any attachments were not retrieved, so the listing gives no reason and no biological data. Treat the two labels as access metadata only; they do not establish that either agency lacks relevant records. See `reviews/ncr-marikina-foi-multiagency-status-screen-20261124.json`.

### Valenzuela river-system context

Maynilad's 2014 Environmental Assessment Report for the Valenzuela Sewerage System names the Tullahan, Polo, and Meycauayan river systems and describes project-era catchment and tidal context. Its Tullahan “no fish” statement is explicitly based on observations and interviews; the report gives no fish-survey method or repeatable non-detection protocol. Keep it as historical waterbody-discovery context, never as proof of fish absence, current condition, or fishing access. The separate 2024 Navotas-Malabon-Tullahan survey has a malformed Site 3 coordinate and does not establish an exact Tullahan-reach crosswalk. See `reviews/ncr-worldbank-valenzuela-sewerage-ea-tullahan-no-fish-claim-review-20261124.json`.

### Tullahan reach-level litter study

Talavera et al. (2024) report a 2023 macroplastic study across an approximately 5.17 km Tullahan segment, with five numbered sampling points at four named bridges in Quezon City and Valenzuela. The article's table provides dates and barangay/bridge names but no station coordinates; one bridge has distinct floating-litter and riverbank-litter points. This is open-access freshwater reach context under CC BY 4.0, not fish evidence or an official channel boundary. See `reviews/ncr-frontiers-2024-tullahan-macroplastic-study-waterbody-context-review-20261124.json`.

### Parañaque estuary and nearshore fisheries context

The official 2021 Parañaque reclamation EIS and its 2020 draft predecessor describe boat-based pelagic-fish observations and catch-composition notes from fishers encountered during survey activities, supplemented by key-informant interviews. They are one EIS lineage, not independent survey confirmations. Table 2.2-19 contains nine fish-name rows plus one crab, with unresolved printed scientific names and no taxon-to-event/date/station crosswalk, capture coordinates, or vouchers. Survey-component dates vary by section; do not assign them to individual taxa. A selected Catalog of Fishes cross-check records three matching current binomials, three spelling/current-name candidates, and three labels held at genus or family rank; it confirms no EIS organism or local occurrence. Keep this as historical research context only, not a current checklist, occurrence table, safety advisory, or proof of fishing access. See `reviews/ncr-emb-paranaque-reclamation-eis-nearshore-fisheries-context-review-20261124.json` and `reviews/ncr-emb-paranaque-reclamation-eis-fish-name-catalog-crosscheck-20261124.json`.

### Orozco estero thesis catalog access check

The official UPLB repository catalogs Glorina D. Perez-Orozco's 2008 thesis, `Biophysico-chemical and socioeconomic study of two major Manila esteros`, as an MS in Environmental Science thesis, but states that the document is currently unavailable. The DLSU article abstract calls the study part of a PhD dissertation, so the degree metadata conflict remains unresolved. The 2012 Springer chapter repeats the same two esteros and four fish taxa in its abstract; available records do not show whether it reused or added samples. No station-level fish data, vouchers, or coordinates were obtained. Keep the taxa as a historical two-estero research lead only. See `reviews/ncr-orozco-2008-thesis-catalog-access-review-20261119.json`.

### Pasig River Phase One slide summary

A GWP-hosted PRRC presentation contains a slide attributing the `Biodiversity Assessment of Pasig River and Its Tributaries: Ecosystems Approach (Phase One)` to Carmelita Villamor et al. and DENR-ERDB, with a September 2008–February 2009 study period. The slide lists eight fish with local/common-name labels and English glosses, but has no scientific names, methods, vouchers, fish-to-site assignments, or station-level table. Bounded exact-title and ERDB searches found citations to the 2009 terminal report in later EIS material but did not locate the report itself. Keep the eight labels verbatim as historical retrieval leads; add no species or occurrence rows and do not distribute slide content without item-specific reuse terms. The presentation summarizes the earlier assessment and is not an independent survey. See `reviews/ncr-pasig-2008-phase-one-slide-summary-review-20261120.json` and the source entry in `data/research/philippines/sources.json`.

## Navotas NMT introductory name crosswalk

See reviews/ncr-navotas-nmt-intro-name-crosswalk-review-20261120.json for the bounded source and taxonomy review of the six introductory local-name/scientific-name pairs in the 2024 Navotas-Malabon-Tullahan article. The named CLUP cross-reference mismatch and local-name ambiguity remain unresolved. This file is research-only; it admits no local species assertions or occurrence rows.

## BFAR NCR retail market-name screen

The 10–14 July 2023 BFAR NCR retail report is summarized in reviews/ncr-navotas-bfar-2023-market-name-crosswalk-review-20261120.json. It contributes aggregated market-label candidates only. The report's summary source areas are not fish-capture locations, and none of its rows are promoted to a species assertion, occurrence or app record.

## Navotas Fish Port thesis access screen

The DLSU thesis catalog metadata and abstract are recorded in reviews/ncr-navotas-dlsu-fishport-thesis-access-review-20261120.json. The direct full-text link returned HTTP 403; the abstract does not provide species evidence. No access restriction was bypassed and no data was added.

## Cavite FishNet2/KAUM cardinalfish name cross-check

The 14 catalog-number candidate pairs and their source/GBIF name relations are recorded in `reviews/calabarzon-canas-fishnet2-kaum-gbif-catalog-crosswalk-20261121.json`; the current WoRMS and Eschmeyer name reconciliation is in `reviews/calabarzon-canas-kaum-catalog-taxonomy-crosscheck-20261121.json`. The accepted-name crosswalk is research-only. It does not confirm museum record identity, a Cañas River locality, or FishNet2 redistribution rights, and it creates no public species assertion.
