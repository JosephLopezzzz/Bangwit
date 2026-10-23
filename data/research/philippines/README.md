# Philippines fish research workspace

Research and local app slices implemented 22-23 October 2026. This directory contains **research inventories, frozen candidates and scoped review decisions**. The Species page now has four Taal Lake checklist assertions, 12 Palico-Lian River survey-table assertions, one historical text-locality assertion for Molawin Creek, one dated Laguna de Bay specimen assertion, and four historical Pansipit River specimen-locality assertions. The Laguna record is restricted to noncommercial CC BY-NC 3.0 use and uses the corrected Calahan locality. The five article/report leads in the earlier coverage-sweep follow-up yielded zero new assertions; the Pansipit and Caliraya/Lumot GBIF checks were reviewed separately. No regional baseline is complete or released. Follow the [expansion plan](../../../docs/PHILIPPINES_SPECIES_EXPANSION_PLAN.md).

## Current results

| Artifact | Contents | Remaining limitation |
| --- | --- | --- |
| `administrative-registry.json` | 18 rollout regions, 82 provinces, 130 coverage units including NCR, HUC/ICC cities, Isabela City and BARMM special-area municipalities | Official directory-derived research baseline. The intended control is PSA 3Q 2026, but its workbook returned 403; several directory headings are older. Workbook verification remains pending. |
| `sources.json` | 58 source/access references, with distinct metadata/raw/content rights and access notes | Source inclusion is not blanket permission or public admission. Jamandre, Palico-Lian, Molawin, Laguna de Bay and Pansipit projection use is scoped to specific fields/batches; the Laguna and NFRDI Taal guide sources are noncommercial-only. Caliraya/Lumot, Sampaloc GBIF, Batangas coastal and VIP CORALS leads remain held source checks. |
| `calabarzon-scope.json` | 36 named waterbody/habitat research leads across five provinces and separate Lucena coverage, including 11 lakes | Starter inventory, not an exhaustive waterbody census or fish distribution dataset. Geometry and most salinity classifications are unreviewed. |
| `freshwater-checklist-candidates.json` | 374 unique name candidates extracted from 78 family treatments in the Plazi/Jamandre 2023 archive | The frozen inputs retain their pending metadata. Separate decisions govern admission; names are not automatically assigned to regions or waterbodies. |
| `freshwater-taxonomy-matches.json` | 374 successful COL XR name queries: 329 exact-species, 16 synonym, 27 family-conflict and two status-review proposals | Frozen automated proposals retain their pending metadata. The matching index and checklist namespace are pinned; scoped decisions do not rewrite these inputs. |
| `calabarzon-checklist-locality-review.json` | Six explicit Taal Lake wording proposals and one broad Pasig-Laguna basin lead from the inspected checklist | The frozen proposals do not establish observation dates. Broad basin wording is not converted to a lake/river point. |
| `taal-taxonomy-review.json` | Independent identity checks for the seven locality leads, including primary authority evidence | Review recommendations alone admit no public records; conflicts remain held. |
| `taal-checklist-decisions.json` | Four scoped checklist admissions and three holds, tied to exact input hashes | Applies only to this batch and its approved fields, not to the entire provider or national checklist. |
| `../../../src/data/taal-checklist-evidence.json` | Four generated Taal Lake literature-checklist assertions for the local Species implementation | A checklist published on 9 June 2023 is not a dated field observation or confirmation of current presence. |
| `calabarzon-river-source-review.json` | Three primary survey leads reviewed; one original Palico-Lian River PDF acquired and visually checked; 15 Table 1 candidates retained | Table counts, field date, family summary and origin summary are not promoted into unsupported claims. |
| `palico-independent-review.json` and `palico-identity-addendum.json` | All 15 candidates identity-checked; the addendum cross-checks ten additional names; three source-family conflicts are retained | Desk research, not qualified-expert certification. Eight of the ten addendum names match; two family conflicts remain held. |
| `palico-river-decisions.json` | Versioned, hash-pinned batch ledger with 12 admissions and three holds, limited to factual names/families/site marks and attribution | Scoped approval for this batch only; custom publisher permission is not a Creative Commons license. |
| `../../../src/data/palico-river-survey-evidence.json` | Twelve generated Palico-Lian River survey-table assertions in the local Species implementation | Article publication date is known; field date is not reported. Assertions do not establish current or river-wide presence, abundance, water chemistry, access, catchability, legality, safety or map locations. |
| `makiling-gbif-source-review.json` and `../../../src/data/makiling-gbif-evidence.json` | One generated *Gulaphallus mirabilis* historical text-locality assertion for Molawin Creek, backed by three preserved-specimen rows in two GBIF CC0 datasets | All rows lack dates and coordinates; source quality flags remain visible. This is not current presence, abundance, an exact stream station or a complete Makiling/Laguna inventory. The 2011 paper's species table remains unextracted pending reuse permission. |
| `laguna-de-bay-specimen-source-review.json` and `../../../src/data/laguna-de-bay-specimen-evidence.json` | One generated *Barbonymus schwanefeldii* specimen assertion with collection date 28 September 2024, ADMU voucher `300008`, and the corrected Brgy. Calahan locality | One historical specimen is not a current lake census. The article's sampling-location map is not georeferenced in Bangwit. The journal's CC BY-NC 3.0 terms restrict this projection to attributed noncommercial use; no article image or prose is reproduced. |
| `pansipit-river-gbif-source-review.json` and `../../../src/data/pansipit-river-gbif-evidence.json` | Four historical species-locality assertions from four CC0 Field Museum preserved specimens (1933), retaining occurrence quality flags and synonym names | All four records share one coordinate without an uncertainty value; coordinates are withheld. The four exact-locality records do not establish current presence, an exact reach, salinity or a complete river checklist. |
| `caliraya-lumot-gbif-source-review.json` | Bounded GBIF checks for two Laguna reservoirs | Lake Caliraya returned four preserved copepod specimens and no fish record; the two Lumot name variants returned zero. This is not a fish absence finding and no non-fish rows were added to the Species list. |
| `calabarzon-brackish-source-review.json` | Five primary estuarine/mangrove/corral source leads with access, station-context and reuse decisions | No brackish admissions. Held leads and a bounded search do not establish absence or complete regional coverage. |
| `calabarzon-coverage-source-sweep.json` | Five original leads, Manila Bay/Seven Lakes source follow-ups, and separate Pansipit and Caliraya/Lumot GBIF searches | The Pansipit batch prepares four historical text-locality assertions with no map admission. The Caliraya/Lumot check returned four non-fish copepod records and zero records for the two Lumot name variants; it adds no fish assertions and does not establish absence. Manila Bay table rights/station georeferencing and Seven Lakes article-specific rights remain open; this is not a complete regional sweep. |
| `calabarzon-alias-source-followup-20261023.json` | Six source-backed GBIF locality-string checks and source reviews for Maragondon, Tikub/Ticub, Tanay and Lagadlarin | All six additional GBIF queries returned zero. A 2014 Maragondon goby paper has materially conflicting IDs and remains held; a 2014 Tikub fish survey is a strong historical lead, but its species table remains held pending item-specific reuse review. No species assertions were admitted. |
| `calabarzon-seafdec-taal-followup-20261024.json` | Review of a 2013 SEAFDEC/PCAARRD-DOST repository lead for a 2010 Taal Lake landing-catch assessment | The official repository exposes abstract metadata but no associated chapter/data file or item-specific reuse license. Its aggregate 47-organism total (38 finfish) has no per-town allocation; no species claims were admitted. |
| `calabarzon-nfrdi-taal-guide-review-20261024.json` | 45 NFRDI Taal Lake field-guide fish records, 2014-2018 survey window, source-reported landing sites, page locators, and a crosswalk to existing frozen taxonomy proposals | The official PDF states CC BY-NC 4.0. The crosswalk found 40 exact-name proposals, one family conflict, and four names absent from the frozen checklist set; none of the 41 proposals is approved or admitted to the app. |
| `calabarzon-nfrdi-taal-taxonomy-followup-20261024.json` | Catalog of Fishes current-name checks for all 45 guide names, including four outside the frozen candidate set | The Catalog supports the current name-status of all 45. Two family differences with the frozen matcher (`Hypophthalmichthys nobilis`, `Oligolepis acutipennis`) remain unresolved. This does not independently identify the guide's specimens or admit any guide rows; all remain held on reuse scope and source identity. |
| `calabarzon-sampaloc-lake-gbif-locality-review-20261024.json` | Two GBIF exact-locality preserved-specimen queries for `Sampaloc Lake` and `Lake Sampaloc` | The six returned rows are two cyanobacteria and four copepods; no fish assertions were found or admitted. This bounded search does not establish that fish are absent from the lake. The copepod coordinates carry GBIF quality issues and are not mapped. |
| `calabarzon-vipcorals-verde-island-source-review-20261024.json` | Review of the official BatStateU VIP CORALS hub, Verde Island survey project page and 2020 repository paper | The public catalogue is still in progress and the five public fish tiles have no scientific names. The paper reports 44 fish specimens, not 44 species. No specimen-level table or item-specific data reuse terms were found; no species assertions were admitted. |
| `calabarzon-vipcorals-data-access-inquiry-draft-20261024.md` | Transparent, unsent request draft for the catalogue access process, specimen fields and reuse conditions | Draft only. No email or form was sent; wait for Joseph to review and send it. |
| `calabarzon-vipcorals-verde-island-source-review-20261024.json` | Four exact-locality GBIF fish-class checks for Verde Island name variants | All four text queries returned zero. This bounded search does not show fish are absent and does not replace a geometry-based search. |

The local Species implementation retains the existing 12 reviewed historical Cavite specimens and adds separate Taal, Palico-Lian, Molawin, Laguna de Bay and Pansipit sections with their own source details. Cavite bay filters do not filter or locate inland evidence sections. The river projection has no sampling date or geometry; source-family conflicts remain held. The Molawin projection has no collection date or coordinates and is labeled as historical locality evidence. The Laguna de Bay projection uses the corrigendum's corrected locality but no app map point. Pansipit preserves the four record-specific GBIF flags and displays the historical year/month precision without its shared, unvalidated coordinate. Caliraya and Lumot reservoir searches add no fish records and are recorded separately from the fish list. No national or regional baseline has been marked reviewed or released.

## Commands

From the project root:

```powershell
npm run species:status
npm run species:check:river
npm run test:species:pipeline
npm run species:check:administration
```

`species:status` validates cross-file references before displaying all 18 regions in delivery order. Unknown reviewed species counts remain `null`; a zero lead count in a queued region is not species absence. For machine-readable output, use `node scripts/species/research-status.mjs --json`.

`species:check:river` verifies that the local Palico-Lian projection reproduces the pinned source, identity, scope and admission inputs; it does not re-fetch sources or upgrade the source's custom permission into a standard open license.

The freshwater archive importer uses **Python 3.10+ standard library only**, for ZIP, XML, HTML and TSV parsing. It was exercised here with Python 3.14.6; the app continues to use Node 24, Next.js, TypeScript and Tailwind. Python is a local research-tool requirement, not an application dependency.

```powershell
# Download the public metadata/archive, validate both, and regenerate research candidates.
npm run species:fetch:freshwater

# Rebuild from the verified local cache without a network request.
npm run species:build:freshwater

# Require the local cache to reproduce the existing candidate file byte for byte.
npm run species:check:freshwater
```

No GBIF account, API key or personal contact information is needed for these two public source files. The fetch command uses bounded download sizes/timeouts/retries and validates the pair before replacing an existing good snapshot. A receipt written last records retrieval time, URLs, bytes and SHA-256 values. If cache promotion is interrupted, the next hash check fails; re-fetch to recover. Do not interpret a failed refresh as an empty dataset.

Raw files and the cache receipt are under ignored `raw/`; a fresh checkout must run the fetch command before local rebuild/check. A refresh can change provider bytes and therefore the candidate artifact; inspect the resulting diff before accepting a new snapshot.

The administrative generator can rebuild from the captured directory input available locally:

```powershell
node scripts/species/build-administrative-registry.mjs
```

Its default input is `raw/psa-directory-capture-20261022.json`; an explicit capture-file path may be supplied instead. `--check` validates the checked-in registry and does **not** claim to redownload or compare the blocked workbook. Capture hashes describe rendered-text extraction bytes, not original HTML or XLSX files. A fresh checkout can validate/use the checked-in research registry without the ignored capture; it cannot reproduce that registry from a workbook that was never retrieved.

## Freshwater source audit

Source: [Jamandre 2023 via GBIF/Plazi](https://www.gbif.org/dataset/f33f36f9-829f-4206-9dca-358ce455b037), article DOI [10.11646/zootaxa.5301.2.1](https://doi.org/10.11646/zootaxa.5301.2.1), dataset DOI [10.15468/aaa5s3](https://doi.org/10.15468/aaa5s3).

The downloaded Darwin Core Archive has **78 family-level Taxon rows and zero species-level Taxon rows**. Its Distribution table has no data rows. Four material-citation rows join family IDs and were not imported as species occurrences. A naive import of `taxa.txt` would therefore mistake families for the paper's species checklist.

The importer instead reads the archive's family-treatment HTML using the standard HTML parser. It extracts 374 unique name candidates from source paragraphs, retaining the source family ID, paragraph position, treatment URL, recorded name, verbatim entry and citation. It rejects unparsed text, duplicate candidate names, empty family treatments and changed layouts. It does not treat source conservation abbreviations or broad locality prose as current structured facts.

GBIF metadata advertises CC0, the archive's EML confirms the dedication and the treatment rows state Public Domain. Both are checked before research extraction. Original journal figures and unrelated website assets are not copied or licensed by this decision. Identity/license checks do not establish current taxonomy or geographical truth.

Pinned first-slice bytes:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| GBIF metadata | 6,737 | `93c719e876a50d832e00614f8ae30fc096d52c49a9602c04f42ef58c1f6785eb` |
| Plazi DwCA | 32,069 | `bdcb9e1c2c204946dfb80e19574501cc02d6ba8569b8084050d4c6b5fcea7a1f` |

The candidate artifact records the actual retrieval timestamp separately from the 2023 publication date. No observation date is invented.

## Taxonomy and locality review

```powershell
# Fetch missing/failed name queries with bounded concurrency and checkpoint every response.
npm run species:fetch:taxonomy

# Rebuild from the local response cache without network access.
npm run species:build:taxonomy

# Verify the generated proposal file against the cached response bytes.
npm run species:check:taxonomy
```

The matcher queries full recorded scientific names and source family hints. It explicitly selects COL XR checklist key `7ddf754f-d193-4cc9-b351-99906754a03b`, following the [GBIF taxonomy migration guidance](https://data-blog.gbif.org/post/catalogue-of-life-taxonomic-backbone/). Legacy GBIF integer identifiers are not interchangeable with COL XR usage identifiers.

The actual matching service used **COL26.6 XR / ChecklistBank 315557**, with index creation `2026-07-18T07:34:50.904Z` and build `84c77c88ffb12cad1691fc477f1b8856101ce1c4`. This is captured service metadata, not a claim that it is the newest catalog release. The metadata SHA-256 was identical before and after acquisition; each response has its own query/response hash and retrieval timestamp. The first run completed 374/374 queries with no failures or unqueried rows. Seven leads now have separate scoped decisions; the frozen 374-row proposal file retains its original pending state.

Responses and metadata are cached under ignored `raw/gbif-col-xr-taxonomy/`. Interrupted/failed requests resume without repeating successful requests against the same captured index. Query caches cannot mix index fingerprints. A changed or unverifiable service index, failed query or unqueried input produces an incomplete result and nonzero CLI exit, never a complete review claim. Source/version and cache checks must be repeated after a new import or a service-index change.

The explicit locality review uses only wording actually present in the inspected CC0 entries. Five of the six Taal Lake candidates have exact-species proposals; the remaining one is a synonym proposal. Exact matching alone is insufficient: the scoped review below holds one exact-match name because a primary authority records uncertain status. No old national or island-wide statement is spread into individual regional waterbodies.

The first attempts to retrieve the original Makiling and Pansipit/Taal surveys did not yield PDFs: the DOST endpoint returned 403 and the NFRDI endpoints failed certificate-chain validation. The ignored `raw/inland-source-retrieval-20261022.json` records those attempts and primary repository leads. No certificate checks were disabled and no detailed species tables were extracted from search snippets. Eligible checklist/taxonomy work continues independently of those access gaps.

## First Taal app package — 22 October 2026

The scoped ledger admits *Caranx ignobilis*, *Caranx papuensis*, *Caranx sexfasciatus* and *Sardinella tawilis* solely as **literature-checklist assertions** with the source wording “Lake Taal, Luzon Island.” The source publication date is `2023-06-09`; observation dates remain `null`. This does not classify each fish as freshwater-only or establish current presence, abundance, conservation status, fishing permission, safety or bait effectiveness. No map points or boundaries are generated.

Three leads stay outside the public projection: *Exyrias volcanus* has conflicting/uncertain taxonomic status, *Silhouettea flavoventris* has a conflicting synonym proposal, and *Cephalocassis manillensis* is supported only by broad Pasig-Laguna basin wording. Holds have reasons and source links; they are not species-absence findings. The source approval is limited to this immutable four-assertion batch and its reviewed fields.

```powershell
# Generate the reviewed public projection from checked-in inputs and decisions.
npm run species:build:taal

# Require byte-for-byte reproduction of the checked-in projection.
npm run species:check:taal
```

The separate Taal Species section provides its own name search, source date, evidence limits and links to the checklist and identity authorities. The existing Cavite historical data, bay selection and private journal are unchanged. CALABARZON remains partial, all regional baselines remain incomplete, and no push or deployment is part of this receipt.

Verification on 22 October 2026: 62 automated tests passed (25 Node research-pipeline, seven Python importer, 19 existing/new research regressions, six language and five offline-precache checks). Typecheck, focused Biome lint, production build, deterministic Taal/freshwater/taxonomy rebuild checks and administrative validation passed. Impeccable detection returned no findings on the changed UI files. The local production server returned HTTP 200 for `/species`, included all four admitted names and the independent controls, excluded all three held names, and returned 404 for the two probed research/raw paths. This checks rendered HTTP markup, not hydration or visual/browser behavior. Browser verification could not run because the browser-control provider reported `Browser is not available: iab`; desktop/mobile layout, interactive search/reset and keyboard checks remain pending. No deployment, participant session or current-release acceptance is claimed.

Public package: 4,140 bytes; SHA-256 `d984aaded5454f0b520dde5effc99f4cbb2c7c839c46f75b9dbb0b73e02b4f60`. The local production preview was started at `http://localhost:4202/species`.

## River and brackish research receipt -- 22 October 2026

The next source slice acquired the original [Palico-Lian River survey](https://doi.org/10.31396/Biodiv.Jour.2025.16.4.579.588), a ten-page paper published on `2025-11-14`. Table 1 (printed page 584 / PDF page 6) contains 15 species-name rows and site-presence marks. The marks yield **9, 7 and 13 species at sites 1, 2 and 3**; they are observed site richness, not individual specimen counts. The complete article reports no field-sampling calendar date, so observation dates stay unknown. The study covers three river sites in Batangas, not the whole river, province or CALABARZON.

The publisher grants custom copying/download/printing/distribution permission on its [policy page](https://www.biodiversityjournal.com/about.html). This is recorded as custom publisher permission, not CC0, a Creative Commons license or blanket public-data approval. The original PDF and historical policy bytes are pinned; fresh policy text is checked separately; no article prose, image, table image or author contact details enter the app. Independent source review found 13 recorded family labels in Table 1 against 12 in the prose, and seven native/eight introduced table labels against nine introduced in the prose. These summary/origin claims are excluded. *Megalops cyprinoides* is recorded under MUGILIDAE but its independent WoRMS family is Megalopidae; that identity/family adoption is held rather than silently repaired.

Five independent WoRMS checks produced four identity/family agreements and this one family conflict. They do not admit records or certify current presence, habitat, origin, safety or fishing permission. The remaining ten identities, field-level permission scope and an immutable admission ledger must be completed before a public river projection is generated. This is agent-assisted desk review; no qualified-expert approval is claimed.

The parallel brackish review retains five primary leads with specific station, access or rights holds. In the acquired Palico survey, Table 3 reports site chloride of 9 / 3,704 / 6,482 mg/L and the authors discuss saline intrusion. Direct salinity values are not reported; chloride is not converted to PSU or used to classify every listed species as brackish. Mangrove names, a river mouth or migration to sea likewise do not establish sampled brackish conditions. Continue eligible alternative sources without waiting for an email response; no brackish absence finding is made.

```powershell
# Validate the versioned river/brackish review artifacts and their quarantine rules.
npm run species:check:field

# Reacquire the pinned PDF and current policy; changed source content fails review.
npm run species:fetch:field

# Validate the exact PDF and normalized policy text; preserve historical HTML separately.
npm run species:check:field:raw
```

The checked-in review validation is separate from raw-source verification. The latter requires the ignored original cache or the permitted pinned fetch. This slice changes local research tools and evidence only: no app/UI changes, river/brackish public admissions, push, deployment or regional completion are included.

## CALABARZON source coverage sweep -- 23 October 2026

Five additional sources were recorded in `sources.json` and linked to the relevant CALABARZON waterbody research leads. The scoped inventory now has 31 named leads (nine categorized as rivers), but remains a starter inventory with zero validated geometries and no complete regional baseline.

- **Tayabas River, Quezon:** Paller et al. (2013) metadata describes three stream sections, wet/dry sampling in 2010, 1,070 individuals and 15 species across eight families. The original article/table was not acquired and item-specific reuse terms were not verified; no names were extracted or admitted. See the [PJS article](https://philjournalsci.dost.gov.ph/diversity-and-distribution-of-freshwater-fish-assemblages-in-tayabas-river-quezon-philippines/) and [SEAFDEC metadata](https://repository.seafdec.org.ph/handle/10862/2236?show=full). The exact reaches and municipality crosswalk remain unknown.
- **Manila Bay:** the 16-page NFRDI primary PDF is acquired and reviewed. Its 2014-03 to 2015-10 experimental trawl survey used 16 stations; the abstract reports 146 mixed fish/invertebrate taxa. Table 3.2 reports 24 fish species and 100 total mixed species in its Cavite grouping, out of 118 total in that table summary. This is historical sector-level evidence, not a current list or municipal-water geometry. No table rows were admitted because item-specific reuse rights remain unverified. [Official NFRDI item](https://repository.nfrdi.da.gov.ph/items/5845cc49-44c8-4c18-8d4d-d458ceaa0aad) and [primary PDF](https://repository.nfrdi.da.gov.ph/bitstreams/a2965005-8feb-46dc-90c6-840fe0189f93/download).
- **Balayan/Calatagan Bay:** the initial 23 October sweep had only metadata: the title said “Top 10,” while the abstract named nine taxa. The 24 October follow-up obtained and reviewed the poster, resolving the count mismatch while leaving all poster-derived claims held pending rights and identity review.
- **Taal Lake and Pansipit River:** an FY2023 NFRDI report summary describes Pansipit landing-center catches from five centers during February-September 2023, with 32 finfish among 38 mixed taxa. This is landing-center data, not a complete river survey; the repository bitstream requested login and no detailed table was acquired. [Official NFRDI report](https://repository.nfrdi.da.gov.ph/server/api/core/bitstreams/3f88f5b7-4c87-47bb-999e-6564bbb1b255/content).
- **Laguna de Bay:** NFRDI and LLDA announced a fisheries assessment partnership in June 2025. The announcement contains no results; monitor the [NFRDI announcement](https://nfrdi.da.gov.ph/2025/06/18/nfrdi-llda-partner-to-assess-laguna-de-bay-fisheries/) and [repository item](https://repository.nfrdi.da.gov.ph/items/4f7ee7f4-9313-430e-a920-d399a8e1e122) for a later release.

The follow-up added a pinned ignored copy of the NFRDI PDF and a source-described Cavite association, but no species rows, field observations, salinity labels, geometries, municipal-water boundaries or fishing/safety guidance. No new brackish assertion was admitted; the five previously held brackish leads remain unresolved. No login, payment, access-control bypass, email or data request was used. See the machine-readable [source sweep](calabarzon-coverage-source-sweep.json) for access limits, rights decisions and next actions.

### Primary-source follow-up -- 23 October 2026

The NFRDI Manila Bay article has now been acquired and reviewed: Table 3.2 reports a historical Cavite-group summary of 24 fish species and 100 total mixed fish/invertebrate species. It does not establish present presence or define municipal-water geometry; no table rows are admitted because reuse rights remain unverified.

A second primary-source lead, Paller et al. (2017), covers all seven San Pablo crater lakes and reports an aggregate survey of 5,166 fish from ten species and six families. The publisher article and indexed primary text were reviewed, but direct PDF retrieval met an interactive JavaScript/cookie challenge. The species tables remain quarantined; the publisher's current submission guidance requires a signed copyright transfer, and no item-specific license or 2017 agreement was verified. The scope registry now names all seven lakes, but species rows, coordinates and geometry are not imported.

As an open-data fallback, exact-locality searches in GBIF returned 11 records across Sampaloc and Pandin, all bird observations or algae specimens; the other five exact-name queries returned zero. No returned record was a fish. This is only a narrow text-locality check, not evidence of absence, and no records or coordinates were imported.

The starter inventory is now 36 leads, including 11 lakes, with zero validated geometries and zero species assertions from this follow-up. The exact NFRDI PDF hash and access/rights limits, plus the Seven Lakes article access outcome, are recorded in the [machine-readable source sweep](calabarzon-coverage-source-sweep.json). Do not treat either historical survey as a current census.

Verification for this inventory update: `npm run species:check:river` and `npm run species:status` passed after the hash-pinned scope/registry refresh. No tests, typecheck, build, browser/device checks, push or deployment were performed for this research-only change.

Verification completed on 23 October 2026 (Asia/Manila): 30 Node pipeline tests and seven Python importer tests passed. Focused Biome lint, field-cache verification, the real permitted PDF/policy re-fetch, research-status reconciliation and byte-identical Taal projection check passed. The source PDF SHA-256 remains `8f730d1d573d892d953464804a91970a2495e1851a9d46d5d9163715a21a509e`. The original policy snapshot remains separately retained; fresh policy downloads pin the complete normalized page text after removing markup/script/style content, so per-request Joomla tokens do not masquerade as changed permission. Tests reject a changed policy clause, source-ID substitution, altered accepted names/status, invented sampling dates and table/count drift. Raw originals/renders remain Git-ignored. No application runtime changed in this slice, so production build, browser/device tests and deployment were not repeated; the prior Taal acceptance limits remain in force.

## Palico-Lian app receipt -- 23 October 2026

All 15 table names now have identity checks. Ten additional exact-name WoRMS/COL checks yielded eight source-family agreements and two holds; the five earlier checks include one more source-family conflict. `palico-river-decisions.json` records 12 admitted table assertions and three held rows, tied to the reviewed inputs and a batch-scoped custom publisher permission. `src/data/palico-river-survey-evidence.json` is the deterministic projection used by the separate bilingual Species section. It carries names, agreed families and source site marks only. It has no field dates, specimen counts, geometry or salinity; it makes no current-presence, abundance, whole-river coverage, access, legal, safety or bait claim. This does not constitute expert certification or blanket publisher/source approval.

`npm run species:check:river` and `npm run species:status` passed for this continuation. No test suite, typecheck, app build, browser/device QA, push or deployment was performed for this UI integration. The historical 22 October receipt above remains a record of the earlier research-only state; its next-work items are superseded by this receipt.

## Makiling freshwater evidence receipt -- 23 October 2026

The [GBIF occurrence API](https://api.gbif.org/v1/occurrence/search?country=PH&locality=Molawin%20Creek&limit=100) returned 47 text-locality rows; this bounded review found three preserved-specimen records of *Gulaphallus mirabilis* in two CC0 datasets ([NHMUK record 1057609166](https://www.gbif.org/occurrence/1057609166), [NHMUK record 1057609207](https://www.gbif.org/occurrence/1057609207), [CAS record 3426419841](https://www.gbif.org/occurrence/3426419841)). GBIF accepts the taxon name, and the [Catalog of Fishes](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=32688) independently lists the species as valid. The three records collapse into one species/locality assertion; they do not represent three individuals or independent collection events.

No occurrence has a collection date or coordinates. The two NHM records retain institution/collection match flags; the CAS row retains its continent and inferred-status flags. Molawin Creek is therefore a text locality, not a point or mapped reach. The Species page presents this historical evidence separately from current presence, abundance, catchability, legal rules, safety, diet and bait advice. Exact-name searches returning zero for Dampalit Falls and Cambantoc River are not absence findings.

The 2011 Makiling article table remains held. Although the NUS copy is labeled Open Access, [NUS Digital Gems terms](https://digitalgems.nus.edu.sg/Terms_of_Use) say the access label alone does not permit reuse and prohibit structured dataset extraction without an explicit item-level license or written permission. No table was extracted. The generated projection is reproducible with `npm run species:check:makiling`; the research-status check reconciles its one assertion with the CALABARZON scope and source registry. Regional baselines remain incomplete.

## Laguna de Bay specimen evidence receipt -- 23 October 2026

- **Primary source and record:** the full [peer-reviewed article](https://doi.org/10.26757/pjsb202418006) reports a preserved *Barbonymus schwanefeldii* specimen obtained from a fisherfolk catch, collected on 28 September 2024 and deposited as ADMU 300008. The authors associate it with Laguna de Bay. The [Catalog of Fishes](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Barbonymus&species=schwanefeldii&tbl=species) lists the name as valid.
- **Correction applied:** an official [2026 corrigendum](https://asbp.org.ph/2025/12/16/volume-19/) changes the specimen locality from Brgy. Patunhay to **Brgy. Calahan, Cardona, Rizal**. The app and scope use Calahan only. The article text gives no capture coordinates; its Figure 1 sampling-location map is not transcribed or georeferenced here. The separate July 2024 Talim Island anecdote is unvouchered and excluded.
- **Rights:** the journal's [official policy](https://asbp.org.ph/journals/) says its articles are distributed under **CC BY-NC 3.0**. The one attributed projection is therefore noncommercial-only; commercial reuse requires separate permission. No photographs, figures or article prose are reproduced.
- **Evidence limits:** this is one dated historical lake-level specimen assertion, not current-presence confirmation, a complete fish checklist, abundance or evidence from nearby rivers. No catch point, waterbody boundary, fishing permission, safety, diet or bait claim is added. CALABARZON and all regional baselines remain incomplete.
- **Implementation:** `laguna-de-bay-specimen-source-review.json` is the review ledger; `src/data/laguna-de-bay-specimen-evidence.json` is its deterministic projection. The bilingual Species section links the article, correction, taxonomy and license. Rebuild/check commands are `npm run species:build:laguna` and `npm run species:check:laguna`.

## CALABARZON alias and source follow-up -- 23 October 2026

The six additional GBIF locality queries for `Tikub Lake`, `Tanay River System`, `Mouth of Tanay River`, `Iyam-Dumacaa River System`, `Iyam and Dumacaa Rivers`, and the article-body spelling `Lagardlarin Mangrove Forest` each returned zero rows. The source-supported `Tikub Lake` spelling is now recorded as an alias of the existing `Ticub Lake` lead. River-system and station labels remain separate from whole-river aliases; the likely Lagadlarin/Lagardlarin typo is not adopted. No zero result is an absence finding.

Two useful historical fish-source leads were reviewed without publishing species claims. A 2014 Maragondon River goby barcoding article declares CC BY 4.0, but its own morphology, BLAST and phylogenetic sections conflict on several IDs; all three candidate species remain held pending independent review. A 2014 Tikub Lake fish survey reports nine species; its publisher landing page gates the full text, and the author-uploaded ResearchGate copy warns it may be copyrighted. The complete species table remains held pending a verified reuse basis. The official LLDA Tanay report is water-quality/station evidence only; the UPLB Lagadlarin paper is a mangrove flora assessment only. A FishAngler user-catch page was excluded from the regional catalog because it is not a source-reviewed inventory.

The 2022 Caliraya/Lumot abstract was checked in an alternate journal-volume PDF; it contains the same abstract and still provides no complete species table or exact sampling dates. The existing all-rights-reserved hold remains. No email, login, payment, access-control bypass, public species projection or application change was made.

## Next work

1. Seek an independent taxonomic review or the reported National Museum voucher-verification outcome for the three Maragondon goby phenotypes; leave them held until identity conflicts are resolved.
2. Find item-specific reuse terms or an eligible independent dataset for the Tikub Lake study before transcribing its species table. Keep the nine-species historical summary separate from current presence.
3. Continue L1 CALABARZON source coverage across remaining named lakes, rivers, estuaries, wetlands and coastal waters. Prioritize eligible GBIF/OBIS records, and review record quality, rights and locality precision; keep each item scoped to its source-described reach or site.
4. Resolve or explicitly retain the five brackish-source gaps and the held Makiling article table. Use eligible alternatives where repositories are inaccessible; do not treat unavailable sources or no email response as evidence of absence.
5. Verify administrative geography when the intended PSA workbook is accessible and document the resulting crosswalk/version.
6. Publish a CALABARZON coverage and gap report before advancing to NCR, then complete the remaining Luzon regions, Visayas, and Mindanao in the plan's order. Do not copy the 374 national checklist candidates into regional waters without independently reviewing locality, identity, dates and reuse rights.

None of these files supplies municipal-water boundaries, fishing permission, live safety information or a recent biological survey. Personal catches and photos stay in the existing local journal and are not read by these research tools.
## San Pablo Seven Lakes GBIF name-variant check -- 24 October 2026

Six country-filtered GBIF locality searches tested `Lake Bunot`, `Buot Lake`, `Lake Mohicap`, `Lake Yambo`, `Lake Calibato`, and `Lake Palakpakin`. They returned 66 records: 12 preserved copepod records, 51 eBird bird-observation records, and three fern herbarium records. No fish occurred in these returned rows. Two name queries returned zero; neither zero results nor the non-fish rows show that fish are absent from a lake. The records retain their individual GBIF dataset licenses; no coordinates, species claims, or waterbody geometry were added to the app. See `calabarzon-san-pablo-lake-name-variant-review-20261024.json` and the ignored raw responses for query details and hashes.

## Pansipit River alternative-source review -- 24 October 2026

The official [DA-NFRDI FY2019 Annual Report](https://nfrdi.da.gov.ph/wp-content/uploads/2025/11/FY-2019-NFRDI-Annual-Report.pdf) was downloaded over ordinary HTTPS and reviewed at printed page 16. It summarizes a January–September 2019 Pansipit River landed-catch assessment: 51 fisherfolk respondents, 140 gears across 17 gear types, 6,886.98 kg total production, and 42 organism species caught (36 finfishes, two molluscs, four crustaceans). It does not provide the complete species list or a per-species table on that report page.

The report's page 2 includes both an all-rights-reserved notice and a CC BY-NC statement without a version. The applicable license scope remains unresolved, so source-derived species rows are not published. A separate FY2023 NFRDI repository download presented a login page; its indexed abstract is retained as a lead only. The official UPLB repository record for the 2016 Lake Taal river survey reports 36 species in Pansipit, but the linked official journal article/PDF returned HTTP 403 and no item-specific reuse terms were verified. The 2016, 2019 and 2023 totals have different designs and dates and are not a trend series.

`calabarzon-pansipit-alternative-source-review-20261024.json` records these checks; the official 2019 PDF and SHA-256 are held in ignored local research storage. No complete species list, app species assertion, public projection, river geometry, current-presence, catchability, legal, or safety claim was added.

## Manila Bay trawl station and rights review -- 24 October 2026

The official [NFRDI 2017 item](https://repository.nfrdi.da.gov.ph/items/5845cc49-44c8-4c18-8d4d-d458ceaa0aad) lists one 16-page PDF for the March 2014–October 2015 experimental trawl survey. Its Figure 3.1 shows the study area and station layout, but the paper and item metadata provide no individual station coordinates, coordinate table, or supplementary station dataset. No station geometry is digitized from the figure.

Table 3.2 groups fish and invertebrate taxa by province; its marks are bands for frequency of hauls, not individual fish counts. The Cavite group has a 24-fish-taxa summary within 100 mixed taxa. The article's 2017 item has no license statement located. NFRDI's current journal policy describes CC BY-NC 4.0 for authors submitting manuscripts under that policy and states that authors retain copyright; this does not verify the 2017 item's license or grant reuse. Table rows remain held pending item-specific confirmation.

`calabarzon-manila-bay-station-data-review-20261024.json` includes a permission and data request draft for the official NFRDI library contact. It was not sent. No table rows, station coordinates, waterbody geometry, or app projection were added.

## Balayan/Calatagan poster access follow-up -- 24 October 2026

The official [NFRDI repository record](https://repository.nfrdi.da.gov.ph/items/43c33cc3-7826-4068-8e12-ede31d616d37) exposes a 51.49-MB PNG poster. I retrieved it by an ordinary unauthenticated HTTPS download and visually reviewed it. The item title claims ten taxa while its abstract names nine; the poster labels ten, including *Sardinella lemuru*, which the abstract omits.

The poster footer says the arrangement is not based on ranking, so the title does not establish abundance order. Its size illustrations are based on maximum length, not abundance. No item-specific reuse terms were found. Keep the image and poster-derived species rows out of the public app pending rights, independent identity and locality-scope review. No common/local names, lengths, bay geometry or app species assertions were added.

`calabarzon-balayan-calatagan-poster-review-20261024.json` records the comparison and original-file hash; the PNG remains in ignored local storage. The source registry now reflects the visual review, and a regression test checks the zero-admission and no-rank boundaries. Next, identify open or explicitly reusable fish records for Batangas coastal and inland waters, while seeking item-specific permission for any later use of this poster's derived data. Finish CALABARZON's coverage-and-gap report before advancing to NCR.

## Balayan/Calatagan GBIF exact-locality fish check -- 24 October 2026

I queried the public GBIF Occurrence API for the exact locality strings `Balayan Bay`, `Calatagan Bay`, `Balayan`, and `Calatagan`, with country `PH` and GBIF class key 204 (`Actinopterygii`). All four requests returned zero occurrences. The exact request URLs and response hashes are recorded in `calabarzon-balayan-gbif-fish-locality-review-20261024.json`; raw JSON responses are retained in ignored local research storage.

This is a bounded text-locality check, not an exhaustive fish search. It can miss spelling variants, records without locality text, and other fish classes; zero results do not show fish are absent. No occurrence rows, species assertions, or app projection were added. Any future GBIF matches will require per-dataset license, taxonomy, date, record-quality, and waterbody-scope review.

## Anilao Fish Port bycatch study source review -- 24 October 2026

The official [Ateneo research record](https://archium.ateneo.edu/biology-faculty-pubs/57/) describes a 2016-2017 Anilao Fish Port study and reports 35 fish species from 15 families, including seven treated as bycatch. Its stated evidence comes from landed fish and interviews at a port serving municipal fisheries in Balayan Bay. The institutional record links to the publisher's full text, but that link returned HTTP 403; no species table was acquired.

The institutional metadata identifies Elsevier copyright and provides no item-specific open license. A landing-site record does not give each fish's capture location or make it a current Balayan Bay presence record. The complete list, species assertions, coordinates, and public projection remain held. `calabarzon-anilao-fish-port-source-review-20261024.json` and the source sweep record the access, scope and rights limits. The next useful action is to seek authorized full-text/reuse terms or find independently reusable, location-matched data.

## Batangas Bay NFRDI poster and GBIF locality check -- 24 October 2026

The official [NFRDI repository record](https://repository.nfrdi.da.gov.ph/items/bf21d1a3-06cc-450d-b638-28d227d8f36e) describes a 2020-2022 Batangas Bay poster and lists ten fish taxa. The downloaded poster was visually checked: it labels ten taxa, and its footer says the arrangement is not ranked; illustration sizes represent maximum length rather than abundance. The repository item does not display an item-specific license. Poster-derived rows, images, common/local names and lengths remain out of the app pending rights and independent taxonomy review.

A bounded [GBIF occurrence API](https://api.gbif.org/v1/occurrence/search) query using the exact locality `Batangas Bay`, country `PH` and fish class key 204 returned zero rows. This does not show that fish are absent; exact locality search can miss spelling variants and records without matching locality text. No occurrence data, geometry or species assertions were added. Review details, the poster hash, and ignored raw query response are recorded in `calabarzon-batangas-bay-source-review-20261024.json`.

Next, seek a reusable fish dataset or authorized species-level data for Batangas Bay and inland waters, then finish CALABARZON's region-wide coverage-and-gap review before advancing to NCR.

## VIP CORALS Verde Island marine repository review -- 24 October 2026

The official [VIP CORALS Marine Repository Hub](https://vipcorals.batstate-u.edu.ph/marine-repository-hub/) says its electronic catalogue is still in progress. Its public page shows five generic fish image tiles without scientific names or a downloadable specimen table. The official [Verde Island survey project record](https://vipcorals.batstate-u.edu.ph/institutionally-funded-completed-survey-of-vulnerable-threatened-endangered-and-economically-important-marine-organisms-in-verde-island-batangas-city/) reports two fieldworks and a 2020 presentation, but no species list or station/date table.

The 2020 [Philippine Science Letters paper](https://scienggj.org/2020/PSL%202020-vol13-no01-p72-75-Rula%20et%20al.pdf) describes more than 240 repository specimens, including 44 fish specimens. That is a specimen count, not a fish-species count. Photos are available by request from the center; the hub's request to coordinate about image use does not establish a reuse license for specimen data. No species rows, current-presence claims, geometry or app projection were added. The source registry and test suite now preserve these distinctions; no request was sent to the center.

Next, seek item-specific access to the catalogue fields, specimen-level dates/localities and reuse terms, then continue the CALABARZON coverage-and-gap review. Do not treat the public fish images or the historical specimen total as a local fish checklist.

The official Research Staff page lists `vipcorals@g.batstate-u.edu.ph` and `(043) 980-0385 loc. 1802`; the hub separately lists `vipcorals.batstateu@gmail.com` for image-use coordination. The prepared inquiry draft uses the institutional contact as the main recipient and clearly describes Bangwit's intended Philippines-wide scope, current prototype limits and public-app reuse needs. It remains unsent.

## Verde Island GBIF locality check -- 24 October 2026

I queried the [public GBIF Occurrence API](https://api.gbif.org/v1/occurrence/search) with country `PH`, fish class key 204 (`Actinopterygii`), and four locality strings: `Verde Island`, `Isla Verde`, `Verde Island Passage`, and `Verde Island, Batangas`. Each returned zero records. The request URLs, response hashes and ignored raw responses are recorded in `calabarzon-vipcorals-verde-island-source-review-20261024.json`.

This is a bounded exact-text check, not evidence that fish are absent; records may use other locality wording or have no locality string. No GBIF data rows or species assertions were admitted. The OBIS area lookup found no Verde Island area. It found only a broad national Philippines area, which is not a substitute for local geometry; no boundary was inferred from the island name.

## OBIS Philippines-area discovery -- 24 October 2026

The [OBIS API area list](https://api.obis.org/v3/area) returned 799 areas. It contained a country-level `Philippines` area (ID `191`) but no area named Verde Island, Isla Verde or Verde Island Passage. The area detail response exposes only the ID, name and type, so it does not independently verify a Verde Island footprint.

Count-only queries for area `191` returned 380,993 occurrence records overall and 128,352 records for Actinopterygii (ray-finned fishes). These are national-area occurrence records, not unique fish species or local current-presence evidence. The OBIS access guide describes its integrated holdings as marine biodiversity data, so this cannot replace inland freshwater sources.

A national Actinopterygii checklist response reported `total: 4502` but returned 4,786 rows, so the counts do not reconcile. No checklist richness number is adopted, and the locally retained checklist rows remain in ignored research storage. Dataset-level licenses, record-level taxonomy, dates and exact waterbody scope have not been reviewed; no species assertions or app projection were admitted. See `calabarzon-obis-philippines-area-review-20261024.json` and the source sweep.

## Marine Regions and OBIS Manila Bay discovery -- 24 October 2026

Marine Regions exposes a polygon for its Gazetteer entry [Manila Bay, MRGID 31579](https://www.marineregions.org/gazetteer.php?id=31579&p=details). The place-name source is GeoNames, while the geometry response lists Marine Regions as its provenance. It is OGC:CRS84 and contains three polygon components, 11 rings and 6,159 coordinate pairs. This is a broad named-bay research geometry, not an official Cavite, municipal-water, fishing-ground or navigation boundary. Marine Regions states CC-BY terms but limits intended use to scientific, educational and research purposes and says its data has no legal value. ([Marine Regions terms](https://www.marineregions.org/disclaimer.php))

Following the [OBIS manual's bounding-box-then-filter guidance for complex polygons](https://manual.obis.org/FAQ.html), I queried Actinopterygii (ray-finned fishes) in the polygon's bounding box, downloaded 2,654 rows, then counted 1,874 points falling inside the unmodified Marine Regions multipolygon. The subset spans ten datasets and has 539 distinct `scientificName` strings; those strings are not a unique validated species total. OBIS attached at least one quality flag to 1,795 rows. The raw query and the ten dataset-level metadata responses remain in ignored research storage with hashes in `calabarzon-marineregions-manila-bay-obis-review-20261024.json`.

Dataset rights differ: metadata identified seven CC-BY datasets, one CC0 dataset and two CC-BY-NC datasets. The largest promising follow-up is CAS Ichthyology (CC0): 610 records fall inside the named-bay polygon, but the rows span 1900-1969. Of 160 records whose locality text contains “Cavite,” only 24 have a year value; their median coordinate uncertainty is 45,341 metres. These records are too broad to assign confidently to a Cavite site or current fish presence, so no new app assertions were admitted. The registry and Manila Bay scope now record this lead while leaving the bay boundary undelineated.

Next, review a limited set of CAS records at source-record level for a narrowly worded historical Manila Bay claim, while continuing to seek fit-for-purpose Cavite geometry and separately covering CALABARZON rivers, lakes and reservoirs. This marine query does not close regional coverage.
