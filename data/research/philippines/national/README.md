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

## Existing inputs reused by M0

- `data/research/philippines/raw/freshwater-download-receipt.json` and `freshwater-checklist-candidates.json`: the existing pinned Plazi/GBIF freshwater checklist snapshot; 374 extracted names remain research candidates.
- `data/research/obis/cavite/cavite-obis-occurrences.csv`: the prior 160-row Cavite export; it remains subject to row/dataset rights and locality review.
- `data/research/philippines/calabarzon-obis-philippines-area-review-20261024.json`: previous count-only discovery (128,352 ray-finned-fish occurrences). The new acquisition refreshes this count before retrieval.

The next stage is to manually review the 72 local cross-province flags alongside source locality, waterbody, date, taxon and coordinate uncertainty; then resolve the WoRMS higher-rank and non-accepted queues against an explicitly pinned fish checklist. Crosswalk HydroLAKES candidates against independent regional lake names and keep the 1,292 blank-name rows unresolved. Continue acquiring separate river, stream, wetland, brackish and marine sources; the existing boundary and lake layers do not identify all those waters. Resolve the GBIF/Catalogue of Life mismatch in parallel; no GBIF request should be submitted until its predicate, taxonomy, and expected archive size are reviewed. Keep optional account credentials local. No Philippine government request is a prerequisite to this batch.
