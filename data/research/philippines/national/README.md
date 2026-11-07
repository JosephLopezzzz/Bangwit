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

## Existing inputs reused by M0

- `data/research/philippines/raw/freshwater-download-receipt.json` and `freshwater-checklist-candidates.json`: the existing pinned Plazi/GBIF freshwater checklist snapshot; 374 extracted names remain research candidates.
- `data/research/obis/cavite/cavite-obis-occurrences.csv`: the prior 160-row Cavite export; it remains subject to row/dataset rights and locality review.
- `data/research/philippines/calabarzon-obis-philippines-area-review-20261024.json`: previous count-only discovery (128,352 ray-finned-fish occurrences). The new acquisition refreshes this count before retrieval.

The next acquisition stage is to pin and review a fish-wide GBIF taxonomy selection, then submit a GBIF bulk request using the adapter above. Keep optional account credentials local. No Philippine government request is a prerequisite to this batch.
