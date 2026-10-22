# Philippines fish research workspace

Research and local app slices implemented 22-23 October 2026. This directory contains **research inventories, frozen candidates and scoped review decisions**. The app currently has four Taal Lake checklist assertions and 12 Palico-Lian River survey-table assertions; no regional baseline is complete or released. Follow the [expansion plan](../../../docs/PHILIPPINES_SPECIES_EXPANSION_PLAN.md).

## Current results

| Artifact | Contents | Remaining limitation |
| --- | --- | --- |
| `administrative-registry.json` | 18 rollout regions, 82 provinces, 130 coverage units including NCR, HUC/ICC cities, Isabela City and BARMM special-area municipalities | Official directory-derived research baseline. The intended control is PSA 3Q 2026, but its workbook returned 403; several directory headings are older. Workbook verification remains pending. |
| `sources.json` | 28 source/access references, with distinct metadata/raw/content rights and access notes | Source inclusion is not blanket permission or public admission. Jamandre's approved projection batch is explicitly scoped; other content remains unapproved. |
| `calabarzon-scope.json` | 30 named waterbody/habitat research leads across five provinces and separate Lucena coverage | Starter inventory, not an exhaustive waterbody census or fish distribution dataset. Geometry and most salinity classifications are unreviewed. |
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
| `calabarzon-brackish-source-review.json` | Five primary estuarine/mangrove/corral source leads with access, station-context and reuse decisions | No brackish admissions. Held leads and a bounded search do not establish absence or complete regional coverage. |

The local Species implementation retains the existing 12 reviewed historical Cavite specimens and adds separate Taal and Palico-Lian sections with their own searches and source details. Cavite bay filters do not filter or locate either inland evidence section. The river projection has no sampling date or geometry; source-family conflicts remain held. No national or regional baseline has been marked reviewed or released; these local changes have not been pushed or deployed.

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

Verification completed on 23 October 2026 (Asia/Manila): 30 Node pipeline tests and seven Python importer tests passed. Focused Biome lint, field-cache verification, the real permitted PDF/policy re-fetch, research-status reconciliation and byte-identical Taal projection check passed. The source PDF SHA-256 remains `8f730d1d573d892d953464804a91970a2495e1851a9d46d5d9163715a21a509e`. The original policy snapshot remains separately retained; fresh policy downloads pin the complete normalized page text after removing markup/script/style content, so per-request Joomla tokens do not masquerade as changed permission. Tests reject a changed policy clause, source-ID substitution, altered accepted names/status, invented sampling dates and table/count drift. Raw originals/renders remain Git-ignored. No application runtime changed in this slice, so production build, browser/device tests and deployment were not repeated; the prior Taal acceptance limits remain in force.

## Palico-Lian app receipt -- 23 October 2026

All 15 table names now have identity checks. Ten additional exact-name WoRMS/COL checks yielded eight source-family agreements and two holds; the five earlier checks include one more source-family conflict. `palico-river-decisions.json` records 12 admitted table assertions and three held rows, tied to the reviewed inputs and a batch-scoped custom publisher permission. `src/data/palico-river-survey-evidence.json` is the deterministic projection used by the separate bilingual Species section. It carries names, agreed families and source site marks only. It has no field dates, specimen counts, geometry or salinity; it makes no current-presence, abundance, whole-river coverage, access, legal, safety or bait claim. This does not constitute expert certification or blanket publisher/source approval.

`npm run species:check:river` and `npm run species:status` passed for this continuation. No test suite, typecheck, app build, browser/device QA, push or deployment was performed for this UI integration. The historical 22 October receipt above remains a record of the earlier research-only state; its next-work items are superseded by this receipt.

## Next work

1. Continue L1 CALABARZON source coverage across the remaining named lakes, rivers, estuaries, wetlands and coastal waters; keep each evidence item scoped to its source-described reach or site.
2. Resolve or explicitly retain the five brackish-source gaps. Use eligible alternative sources where repositories are inaccessible; do not treat unavailable sources or no email response as evidence of absence.
3. Verify administrative geography when the intended PSA workbook is accessible and document the resulting crosswalk/version.
4. Publish a CALABARZON coverage and gap report before advancing to NCR, then complete the remaining Luzon regions, Visayas, and Mindanao in the plan's order. Do not copy the 374 national checklist candidates into regional waters without independently reviewing locality, identity, dates and reuse rights.

None of these files supplies municipal-water boundaries, fishing permission, live safety information or a recent biological survey. Personal catches and photos stay in the existing local journal and are not read by these research tools.
