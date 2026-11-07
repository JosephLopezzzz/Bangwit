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

## Existing inputs reused by M0

- `data/research/philippines/raw/freshwater-download-receipt.json` and `freshwater-checklist-candidates.json`: the existing pinned Plazi/GBIF freshwater checklist snapshot; 374 extracted names remain research candidates.
- `data/research/obis/cavite/cavite-obis-occurrences.csv`: the prior 160-row Cavite export; it remains subject to row/dataset rights and locality review.
- `data/research/philippines/calabarzon-obis-philippines-area-review-20261024.json`: previous count-only discovery (128,352 ray-finned-fish occurrences). The new acquisition refreshes this count before retrieval.

The next stage is to review the CAS local research partition for taxonomy, source locality, waterbody association, and coordinate sensitivity. In parallel, resolve the GBIF/Catalogue of Life taxonomy mismatch so a bulk request can be prepared with an explicit checklist. No GBIF request should be submitted until its predicate, taxonomy, and expected archive size are reviewed. Keep optional account credentials local. No Philippine government request is a prerequisite to this batch.
