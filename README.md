# Bangwit

**Status: In progress.** The current expansion roadmap is the [Philippines species expansion plan](docs/PHILIPPINES_SPECIES_EXPANSION_PLAN.md). The [Cavite data and pilot implementation plan](docs/CAVITE_PILOT_IMPLEMENTATION_PLAN.md) documents the existing first pilot.

Bangwit is an in-progress, Philippines-wide waterbody discovery and personal catch-journaling project. Its intended fish coverage spans regions across Luzon, Visayas, and Mindanao, and freshwater, brackish, and marine waters. National research and regional coverage are being expanded in phases.

The current Next.js, TypeScript, and Tailwind CSS prototype remains a Cavite pilot. Its UI, local catch journal, collection, onboarding, first-use guide, draft policy gate, and local backup/restore flow are in place. Nationwide species coverage is not complete, and the app does not yet provide verified nationwide fishing rules or live safety alerts. The user reports that all planned acceptance tests passed, including the dropdown retest and mobile checks. Earlier, they reported online/offline and photo-draft reconnect passes on a personal Tecno phone in a browser tab at `https://bangwit.vercel.app/`. Exact phone model, OS, browser/version, tested commit and case-by-case results remain unrecorded.

## Local development

Use Node.js 24.x, matching the deployment engine.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. The older prototype remains at `../bangwit` and uses separate browser storage because its origin and port differ.

## Checks

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run test:storage
npm run test:evidence
npm run test:offline
npm run build
npm run start
```

The old prototype at `http://127.0.0.1:4173` and this remake at `http://localhost:4174` have separate browser storage. To migrate existing catches, open `http://127.0.0.1:4173/migration.html` on the old origin, download its private JSON backup, then restore it from Settings in the remake while the remake's journal is empty. The backup contains photos and optional spot labels; keep it private. Do not clear the old browser data until the restored entries and images have been checked.

The policy pages are drafts for the prototype, not final legal advice. The app does not need API credentials for these local features. Never put private keys in a `NEXT_PUBLIC_` variable.

## Offline readiness

The service worker is configured to precache the catch journal and offline fallback, with document revisions derived from source and asset changes. Reconnecting no longer triggers an automatic page reload, so the open form is not deliberately discarded. The fallback's journal button requests the cached HTML directly.

`test:offline` checks the actual Serwist manifest configuration, including document updates between releases and exclusion of source/private files. Recorded desktop testing covers offline save/reload with a synthetic photo, cached navigation/fallback, backup/restore, fresh-origin controlled reload and a rebuild upgrade; desktop O3 reconnect coverage remains partial. The user reports that all planned acceptance tests passed, including mobile, dropdown and installed home-screen checks. Their earlier Tecno browser-tab report said an unsaved synthetic photo catch with `7 in`, `2 lbs` and test notes survived reconnect without a reload, and one Save added exactly one entry. Exact device, browser/version, tested commit and case-by-case results were not provided. A current-release Preview traffic capture is not in the recorded evidence; see [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md) for the scope and limits of each result.

The source-level privacy review, isolated local browser traffic check and earlier Production-origin synthetic catch/backup traffic run are documented in [PRIVACY_REVIEW.md](PRIVACY_REVIEW.md). A current-release Preview request capture and host/CDN review are not recorded; this is an evidence gap, separate from the user's report that all planned functional acceptance tests passed. The earlier Production traffic result does not verify the latest worker's offline or reconnect behavior.

For HTTPS Preview deployment settings and the hosting checker, follow [STAGING_ACCEPTANCE.md](STAGING_ACCEPTANCE.md). On October 15, the public hosting check passed at `https://bangwit.vercel.app/`, observed on Ready Production application commit `43718d65e2c4e1a75346529457365e7288749480`. Local production build, TypeScript, storage (2/2), offline (5/5) and advisory (20/20) checks passed for that application source; commit `6143041` changes documentation only. The deployed advisory API correctly returned HTTP 503 `unavailable` / `not_configured`. The user reports that all planned acceptance tests passed, including mobile. A current-release Preview request capture is absent from the recorded evidence. See [OFFLINE_ACCEPTANCE.md](OFFLINE_ACCEPTANCE.md) for the build and scope.

## Map warning preview

Explore includes an opt-in **Preview warning layer** with fictional Cavite, Batangas and Laguna examples. The scenario menu previews overlapping warnings, stale/expired last-known alerts and a checked empty state on a fixed 1 January 2026 timeline. Exit preview returns to actual feed availability.

Live warnings are **not enabled**. The normalized server ingestion endpoint, strict geography/source validation, freshness handling and public snapshot cache are in place. A reviewed publisher/adapter, its update schedule and production acceptance remain required. See [MAP_ADVISORIES.md](docs/MAP_ADVISORIES.md) for the source review, contract and rollout gates.

Run the focused safety-state checks with:

~~~powershell
npm run test:advisories
~~~

## Historical research records

The Species page has a separate bilingual historical-record section with 12 reviewed CC0 museum specimens. The research adapter excludes the rejected locality, preserves unknown and month-only collection dates, and cross-checks taxonomy, provenance, licenses and locality-review states before writing the browser-facing snapshot. These records are not a current species list or fishing advice. No API key or live provider request is needed to read the snapshot.

The historical-record section has working name, source-locality, and dated/undated filters, with combined filtering, reset, separate record/species counts, and an explicit no-match state. Water-type and conservation-status filters remain disabled until reviewed values are available. The page also includes two bilingual, source-linked study examples for fish diet; neither is a Cavite diet survey or evidence of local presence, and bait/catching advice remains unverified. The research-only ledger at `data/research/obis/cavite/cavite-obis-fish-candidate-review.csv` records 27 candidate names / 52 linked occurrences: 12 currently published records, 2 excluded occurrences, and 38 pending review. Four pending rows carry durable Smithsonian curator holds; one National Museum occurrence has been excluded for missing locality. Pending rows are not added to the public evidence snapshot.

The broader CALABARZON research batch includes 18 historical Laguna de Bay specimen candidates checked against direct GBIF occurrence details and an independent fish-name catalog. Thirteen initial name crosswalks agreed, while five were held for further review. A current Catalog of Fishes follow-up supports four of those mappings: 16 CAS records are now admitted only to the historical research ledger, and one `Taenioides caeculus` author-year mapping remains held. The MZUSP-linked online catalog resolves one unique source item through two duplicate index rows, but its interpreted record is only family-rank, flags `LOCATION_NOT_SUPPLIED` despite retaining locality text, and has a CC BY-NC license that conflicts with GBIF's record license. The official CAS IPT archive matched all 17 collection-qualified source items. The MZUSP item remains held for rank, locality and license conflicts; no public occurrence rows were added. A separate Balayan Bay crosswalk compared 14 corrected GBIF candidates grouped into ten catalog identities with iDigBio: nine source-attributed records matched, but these aggregated records are not independent specimen confirmations. Five GBIF material-citation rows map to one USNM catalog item, one UMMZ identity remains unresolved, one CAS name conflicts with the source record, and all candidates remain research-only. The Field Museum-hosted archive confirms two FMNH catalog rows (47041 and 90961) previously cross-referenced through iDigBio. WoRMS returns exact accepted species-name matches, so the rows are admitted only as year-precise historical locality evidence in the research ledger; GBIF quality flags remain preserved, and no public app row or map point was added. Twelve other Balayan candidate rows still need review. The 2026-10-25 CALABARZON gap snapshot reports 83 selected waterbody leads, 197 scope source assignments, 49 distinct scope references, and 150 registered sources; the regional denominator remains unknown and the baseline incomplete.

To rebuild the candidate-review ledger after updating its inputs:

```powershell
node scripts/build-cavite-fish-candidate-review.mjs
```

After reviewing changes to the existing OBIS research inputs, regenerate and verify with:

```powershell
node scripts/build-cavite-historical-evidence.mjs
npm run test:evidence
```

Tests compare the checked-in JSON with the reviewed inputs, so stale output fails the check. Repeat the source and locality review when refreshing data; passing the adapter does not establish present-day presence or fishing permission.


### CALABARZON waterbird-site crosswalk — 30 October 2026

The official [DENR CENRO Calauag 2026 Asian Waterbird Census](https://calabarzon.denr.gov.ph/news-events/denr-calauag-monitors-2026-asian-waterbird-populations-across-quezon-provinces-wetlands/) names Ragay Gulf and De Guzman Fishpond in the Hinabaan, Guinayangan monitoring context. They are separate research-only aquatic-site leads; the bird survey adds no fish evidence, boundary, salinity, ownership, fishing access, or permission claim. Other barangay, farm, and island mentions were not treated as waterbodies, and the three named Lopez marsh leads were cross-checked without duplication. That waterbird crosswalk seeded 99 leads (including one gulf and one fishpond); the current regional denominator, fish baseline, and geometry coverage remain incomplete. See [the site crosswalk](data/research/philippines/calabarzon-cenro-calauag-2026-awc-site-crosswalk-20261030.json) and [the updated denominator snapshot](data/research/philippines/calabarzon-coverage-denominator-profile-20261030.json).

### Guinayangan freshwater source crosswalk — 30 October 2026

The [Guinayangan Water District 2024 Annual Report, Annex J](https://www.guinayangan.com/gwd%20annual%20report%202024.pdf) names Hinabaan River and seven spring-source entries; the [PSA PSGC listing](https://psa.gov.ph/classification/psgc/barangays/0405618000) was used only to cross-check their barangay names/codes. This adds eight research leads to the selected CALABARZON scope, now 107 (52 rivers and seven springs among the listed kinds). The report's “Flowing” and “Yielding” are supply-operation labels, not ecological, safety, or water-quality assessments. The [CLSU aquaculture article](https://clsu.edu.ph/news-and-updates/article/fac-cf-implement-idrc-funded-small-scale-aquaculture-action-research-in-quezon-province) gives municipality-level context but does not name De Guzman Fishpond or provide fish survey records, so no species, salinity class, coordinates, geometry, or public record was added. The regional denominator and fish coverage remain incomplete. See the [crosswalk review](data/research/philippines/calabarzon-guinayangan-freshwater-source-crosswalk-20261030.json) and [denominator profile](data/research/philippines/calabarzon-coverage-denominator-profile-20261030.json).

A bounded follow-up search found no retrievable fish survey explicitly tied to Hinabaan River or the seven spring leads. Corrected CoL XR fish-filtered GBIF queries returned zero for eight exact `waterBody` names and eleven locality strings/variants; zero indexed results are not evidence of absence. The all-taxon Guinayangan locality search returned 129 mixed records and was not used to assign fish. The [CLSU article](https://clsu.edu.ph/news-and-updates/article/fac-cf-implement-idrc-funded-small-scale-aquaculture-action-research-in-quezon-province) is aquaculture context, and a separate Tayabas River study is not evidence for these sites. The official [BMB PAIS Maulawin profile](https://pais.bmb.gov.ph/home/info/KQHVQSWURSI) appeared in search results but returned HTTP 502 when opened, so no full-page claim was extracted. No species assertion was added. See the [bounded survey search review](data/research/philippines/calabarzon-guinayangan-fish-survey-search-review-20261030.json) and [GBIF Occurrence API docs](https://techdocs.gbif.org/en/openapi/v1/occurrence).


### Ragay Gulf fishery poster review — 30 October 2026

Reviewed the official [DA-BFAR/NFRDI Ragay Gulf poster](https://repository.nfrdi.da.gov.ph/items/ee1d42ee-5c27-4034-a7fb-51496abc7d3a), covering 2018–2022. Its image and repository abstract disagree on the splendid ponyfish scientific name; a CoL XR crosswalk leaves the abstract variant at genus rank, so the row is held. The poster footer says the layout is not ranked. Its gulf-level names are not assigned to Hinabaan or De Guzman Fishpond, and no item-specific reuse license is displayed. No species assertion or public app row was added. See [the review](data/research/philippines/calabarzon-ragay-gulf-dominant-species-poster-review-20261030.json).

### Ragay Gulf BFAR/FishCORAL Bicol-side report screen — 30 October 2026

Reviewed the official [BFAR/FishCORAL resource](https://www.bfar.da.gov.ph/other-programs/fishcoral/) and its 2019 Bicol University assessment PDF. The report's household sample is from ten Bicol-side municipalities; its separate aggregate production table includes San Pascual, Masbate, and is not station-resolved. No Quezon-side or Guinayangan/Hinabaan site evidence was assigned. The species table remains held because no item-specific reuse terms were found in the checked material. No species names, occurrence assertions, or app rows were added. See [the source review](data/research/philippines/calabarzon-ragay-gulf-bicol-prsa-source-review-20261030.json).

### Ragay Gulf GBIF/CAS rights and locality screen — 30 October 2026

A bounded GBIF/CAS historic-specimen screen found candidate records, but the California Academy of Sciences collection terms prohibit redistribution while GBIF dataset metadata labels the source CC0. A targeted cross-check against the 2025 open-access fish checklist also found a catalog-level locality/date disagreement. All candidates remain held pending written rights and source clarification; no taxon rows, identifiers, coordinates, or app records were added. No inquiry was sent. See [the rights review](data/research/philippines/calabarzon-ragay-gulf-gbif-rights-review-20261030.json).

### Ragay Gulf published type-locality crosswalk — 30 October 2026

A CC BY 4.0 article reports a historical *Callionymus octostigmatus* paratype locality at Rogo Point, Ragay Gulf. The crosswalk uses the article body, not the conflicting GBIF/CAS row; it does not assign the record to Quezon/CALABARZON or the public app. The article’s separate ODbL supplement was not used. See [the initial locality review](data/research/philippines/ragay-gulf-zookeys-2025-type-locality-review-20261030.json).

### Ragay Gulf checklist batch — 30 October 2026

Expanded the same CC BY 4.0 article-body screen to 16 fish treatments and 25 reported Ragay Gulf/Ragay Bay lot groupings, with species-rank CoL XR matches recorded separately from the article's own taxonomy. One taxonomic status conflict (*Inimicus bifilis* / *Inimicus didactylus*) and one uncatalogued paratype lot remain held. These are historical type-locality statements; the gulf-side/province is unresolved, so no CALABARZON assertion, geometry, current-presence claim, or app row was added. The article's ODbL supplement was not used. See [the batch review](data/research/philippines/ragay-gulf-zookeys-2025-type-locality-batch-review-20261030.json).


### Ragay Gulf named-place crosswalk — 30 October 2026

A follow-up review anchors selected historical type-locality names to administrative context: Pasacao and Siburio Point in Camarines Sur/Bicol, and Alibijaban Island in San Andres/Quezon. The Siburio coordinate belongs to a different CAS specimen and was not transferred; the Alibijaban offshore and Alinijaban spelling cases remain held. Most Ragay lots are still geographically unresolved. No public species row, gulf boundary, or CALABARZON assertion was added. Administrative links were checked against the [PSA Region IV-A PSGC](https://psa.gov.ph/classification/psgc/provinces/0400000000) and [PSA Region V PSGC](https://psa.gov.ph/classification/psgc/provinces/0500000000). See the [crosswalk review](data/research/philippines/ragay-gulf-locality-administrative-crosswalk-20261030.json) and [research log](data/research/philippines/README.md).
