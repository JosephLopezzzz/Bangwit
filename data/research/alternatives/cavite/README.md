# Cavite direct-access source bundle

Reviewed on **10 October 2026**. This folder removes email replies as a prerequisite for source collection and most app development. It contains research inputs, not a production legal/safety dataset.

## What has been acquired

The collection acquired **13 source files**; two reference downloads remain blocked and are recorded as failures below. Live public requests to GBIF (name matching), WoRMS (accepted taxon) and OBIS (dataset metadata) all returned usable JSON without API keys. These were acquisition checks, not production integrations or proof of current Cavite occurrence.

- `sources.json`: reviewed direct URLs, source roles and rights notes.
- `download-manifest.json`: per-file retrieval status, time, size and SHA-256. A successful download means file retrieval succeeded; it does not establish that an advisory is current or a legal rule is applicable.
- `raw/`: downloaded originals, ignored by Git. These include public ordinances, two NARO amendment copies, the provincial ecological profile and PAGASA page snapshots. A clone does not contain these raw files; rerun the collector to acquire them locally.
- `cavite-discovery-admin-outline.geojson`: Cavite extracted from geoBoundaries' simplified Philippine provincial layer, with source, year and rights metadata. The retrieved layer represents **2020**, not 2026. Its original sources are NAMRIA, PSA and OCHA Philippines, and its original license is CC BY 3.0 IGO. Preserve this original license plus geoBoundaries attribution. This is a dated administrative discovery outline, not a municipal-water, sanctuary or navigation boundary.
- `geometry-validation.json`: independent topology check of that derived outline, linked to its file hash. A valid polygon is not proof of positional accuracy, current borders or legal fishing access.
- `cavite-reported-catch-groups-2024.json`: **11 reported catch groups**, including squid and crustaceans, from Table 4.25 of the provincial profile, printed page 209 / PDF page 239. These are common groups/local names, not 11 verified scientific species. The complete source page was rendered and visually checked. Missing or ambiguous values remain unresolved. This is province-level 2024 context, not current spot-level availability, a breeding calendar or a legal closure calendar.

The full current [HDX Philippines administrative dataset](https://data.humdata.org/dataset/cod-ab-phl) also has direct download links. Its metadata credits NAMRIA/PSA and CC BY-IGO. The metadata says the boundaries were created/edited in 2018 and reviewed in April 2024; files uploaded in May 2026 do not prove a new boundary survey. The full GeoJSON archive is about 1 GB, so the collector stores its metadata and uses the smaller pinned geoBoundaries derivative for exploratory development. Both layers concern administrative geography.

## Refresh

From the project root, run:

```powershell
node scripts/fetch-cavite-alternative-sources.mjs
```

Retry or replace a particular source without downloading everything again:

```powershell
node scripts/fetch-cavite-alternative-sources.mjs ra10654-official-text
```

The collector uses public endpoints and needs no API key. It validates file type, records hashes, preserves previous snapshots on failure, and reports a nonzero exit status if any manifest source remains failed. Successful prior sources retain their original retrieval times during a targeted retry. Raw PDFs and HTML are local research copies; they are not automatically redistributed as app assets. If a host changes its URL, update the catalog only after observing the replacement on an official source.

The independent geometry review and structured catch-group review are tied to exact file hashes. If a refreshed file's hash changes, repeat the relevant review before carrying its validation forward; downloading new bytes does not automatically revalidate the derived facts or topology.

Two sources could not be archived during this review: BFAR's central bulletin page had a certificate-chain verification error; the Senate's historical RA10654 PDF returned HTTP 403 to the downloader. Keep their official links visible as reference routes. Do not disable TLS verification or describe the failed/stale bulletin as a current Cavite safety status. The [SC E-library statute](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/61041) remains a readable official legal-text reference through browsing. BFAR regional archives did not yield a verified current full bulletin download in this pass.

## Alternatives that can support development now

| Product need | Direct source | Supported role now | Accuracy boundary |
| --- | --- | --- | --- |
| Cavite/Philippines location choices | [PSA PSGC](https://psa.gov.ph/classification/psgc/citimuni/0402100000) and [geoBoundaries API](https://www.geoboundaries.org/api.html) / HDX | Official place identifiers and a dated administrative discovery outline | PSGC names do not define marine polygons; simplified geometry does not verify precise collection sites or legal fishing areas. |
| Regional catch context | Provincial profile Table 4.25 | Province-level reported catch groups and dated catch patterns | Keep generic names unresolved; no bay assignment, diet/bait inference or present-day catch guarantee. |
| Species identity and recorded presence | [WoRMS REST](https://www.marinespecies.org/rest/), [GBIF API](https://techdocs.gbif.org/en/openapi/), [OBIS API](https://portal.obis.org/data/access/) | Public taxonomic lookups and smaller occurrence queries; existing reviewed OBIS material remains available | Retain dates, uncertainty, dataset/record licenses and citations; deduplicate GBIF/OBIS by original occurrence identifier. The current CC0 shortlist is historical research evidence. A marine municipal-water polygon is not a prerequisite for showing that an explicitly dated source reported a group at province scale. |
| Fisheries law references | Archived Bacoor 278/292, NARO FAO208-1/264-1, [BFAR order index](https://www.bfar.da.gov.ph/laws-regulations-issuances/administrative-orders/) and SC/Senate text | Jurisdiction-specific source cards with exact legal-text citations and amendment relationships | Resolve publication/effectivity, later changes and activity-specific conditions before showing current applicability. Do not infer permission from an absent restriction. |
| Weather and hazards | [PAGASA weather](https://www.pagasa.dost.gov.ph/weather), [gale](https://www.pagasa.dost.gov.ph/marine/gale-warning), [cyclone](https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin), [Southern Luzon](https://www.pagasa.dost.gov.ph/regional-forecast/slprsd) | Official source links and carefully sourced advisory summaries, with issue/validity and affected areas | A retrieval timestamp is not the advisory issue time. Regional coverage does not establish conditions at every fishing spot. No guaranteed public machine-readable feed was verified. |
| Red tide / shellfish | [BFAR bulletin page](https://www.bfar.da.gov.ph/shellfish-bulletin-no-02-2022/) | Link-first official bulletin access until retrieval and scope parsing are reliable | Current contents were not archived. Notices concern specified tested waters and shellfish/Acetes consumption; they are not automatically an all-species fishing ban. |
| Optional forecast model | [Open-Meteo weather](https://open-meteo.com/en/docs), [marine](https://open-meteo.com/en/docs/marine-weather-api) and [terms](https://open-meteo.com/en/terms) | A no-key forecast adapter for a noncommercial prototype, clearly labeled model estimates | Free-service limits and commercial-use terms apply. Model forecasts do not replace PAGASA alerts; coarse coastal tides/currents are unsuitable for navigation. Not integrated or live-tested here. |

Public access and reuse are distinct. GBIF/OBIS content has per-dataset/per-record licenses; WoRMS taxonomic text and photographs have different terms. Official legal text can be referenced without waiting for a blanket quoting permission (see [RA8293 section 175](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/4371)); this does not settle GIS/map/image rights. For PAGASA/BFAR, a public advisory page is different from requested restricted station data.

## Development sequence that can proceed without agency replies

1. Use the discovery outline and PSGC place catalog to build province/LGU selection. Label administrative geography and source year clearly.
2. Build a dated regional evidence view using the reported catch-group file and reviewed occurrence sources. Keep personal catch records separate.
3. Build legal-reference cards with `source available` and `current applicability not confirmed` states. These can cite the acquired documents without pretending to provide a complete legal result.
4. Build the advisory presentation and adapters around `issuedAt`, `validUntil`, `affectedAreas`, `sourceUrl`, `fetchedAt`, and `available/stale/unavailable` states. Cached/offline advisories retain their original validity times.
5. Continue the private catchbook/offline checks, onboarding and policy flows against the existing product contract.
6. Integrate exact legal polygons only when their datum, mapped extent, effectivity/amendments and reuse are settled. NAMRIA/LGU replies enhance that component; the other tasks continue independently.

No runtime app behavior or product claims were changed by this research bundle. Newer BFAR index entries (201-1, 277, 244-1) and the municipal-water litigation status remain follow-up items; no October 2026 final judicial status was established in this pass. All existing product features stay on the roadmap.
