# Cavite starter-content candidate — G2 technical inventory

Prepared: **20 October 2026**. **Candidate for owner/editorial review; NOT APPROVED FOR NEW PUBLICATION.** This records a bounded technical integrity review of existing source content. It admits no new records, claims, methods, legal rules, advisories or source material.

## Source identity and status

- Reviewed repository source: `15a1cf9b63c14388f66bc595e9ca4f401870d87e`.
- Comparison baseline: `d6c6d2ecfb2dea626148ca88b8a7391d6a6ffa46`.
- The three content files below and their inspected renderers/filter helpers are byte-identical to both reviewed HEAD and the baseline. `git diff --name-only d6c6d2e HEAD -- src` also returned no paths. This identifies local source, not a deployed build.
- Existing set: **12 historical specimens / 12 accepted taxa**, **5 study-specific feeding examples**, and **11 provincial catch groups**. These are different evidence types, not a combined count of 28 verified Cavite species.
- Technical status: **bounded source-integrity review completed; checks passed**. The dated owner decision, editorial/content approval and qualified legal/policy/rights approval remain **pending**. This document supplies none of those approvals and does not close G2.

| Decision / gate | Status on 20 October 2026 |
| --- | --- |
| Exact existing content inventory and local-source consistency | Technically checked to the scope below |
| Owner selection of this precise starter set and education/journal scope | Pending dated owner decision |
| Editorial review of bilingual scope, source descriptions and comprehension | Pending dated editorial decision |
| Qualified review of applicable legal claims, source reuse and remaining rights questions | Pending; no legal approval inferred |
| New publication, candidate-record admission or data expansion | Not authorized by this artifact; unchanged |

## Exact existing set and its limits

| Existing content | Runtime source and source identity/version | Rights recorded in the repository | Retained scope / limits |
| --- | --- | --- | --- |
| 12 historical museum specimens | [Historical JSON](../../src/data/cavite-historical-evidence.json), schema 1; CAS Ichthyology (ICH), OBIS dataset `d6af0fac-8a21-4d77-8872-f10d471fc0cf`; Fong J (2026), version **150.543**; [OBIS dataset](https://obis.org/dataset/d6af0fac-8a21-4d77-8872-f10d471fc0cf). Taxonomy reviewed `2026-10-06T13:52:35.032Z`; license review `2026-10-06`. | Included occurrence rows and reviewed dataset metadata both CC0 1.0. Dataset citation, per-record OBIS link and original WoRMS name-resolution link remain attached. This does not license other OBIS records or third-party media. | Five broad Limbones Cove reports with 3,131 m uncertainty; seven broad Cavite/Manila Bay reports with 24,829 m uncertainty. Nine supplied dates from 1947–1964, including one month-only date; three unknown. No coordinates or selected-bay assignment in the public JSON. Old specimens do not establish current presence, abundance, permission, catchability or safety. |
| 5 feeding examples | [Feeding JSON](../../src/data/feeding-guides.json), `reviewedAt: 2026-10-17`, `catchingAdviceStatus: not-reviewed`; exact taxa and study sources below. | Attributed paraphrases and source locators; no copied photographs or figures. WorldFish's 1997 paper is recorded as CC BY 4.0. No blanket reuse license is recorded in the current guide/review files for the Paglinawan or Richter material; that remains an approval-review question, not a permission finding. WoRMS identifies taxa and does not license unrelated images. | Findings stay tied to the sampled place, period and conditions. No Cavite diet survey, proof of local presence, universal diet or effective-bait conclusion. |
| 11 reported catch groups and local names | [2024 catch-group JSON](../../data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json); source ID `cavite-ecological-profile-2024`; Cavite Ecological Profile **2024**, Table **4.25**, printed p. **209** / PDF p. **239**; Office of the Provincial Agriculturist, Trece Martires City; reviewed `2026-10-10`. [Source PDF](https://cavite.gov.ph/wp-content/uploads/2026/04/CEP_2024.pdf#page=239). | [Source catalog](../../data/research/alternatives/cavite/sources.json) records attribution of extracted facts and preservation of the table owner. No blanket map/photograph/database redistribution license was verified; the full PDF remains a local research copy. | Province-wide report, no spot/bay assignment or resolved scientific identities. Renderer shows group/local-name facts, report year and source; it does **not** display the JSON's seasonal arrays as recommendations or a legal calendar. |

### Historical specimens: exact identifiers

`Cove` means the source-reported Limbones Cove group; `Coast` means broad source-reported Cavite/Manila Bay. Missing collection dates remain unknown.

| Accepted name | Museum occurrence ID | Accepted Aphia ID | Collection date | Group |
| --- | --- | --- | --- | --- |
| *Ambassis urotaenia* | `urn:catalog:CAS:SU(ICH):21615` | `220038` | Unknown | Cove |
| *Amioides polyacanthus* | `urn:catalog:CAS:ICH:52211` | `1017557` | `1947-10-02` | Coast |
| *Callionymus filamentosus* | `urn:catalog:CAS:ICH:32862` | `126791` | `1964-01-01` | Cove |
| *Champsodon nudivittis* | `urn:catalog:CAS:ICH:46386` | `220338` | `1947-10-02` | Coast |
| *Chelidoperca stella* | `urn:catalog:CAS:ICH:52679` | `1385046` | `1947-10-02` | Coast |
| *Mirolabrichthys tuka* | `urn:catalog:CAS:ICH:45860` | `312510` | `1947-10` | Coast |
| *Nemipterus balinensis* | `urn:catalog:CAS:ICH:51976` | `278118` | `1947-10-02` | Coast |
| *Nemipterus peronii* | `urn:catalog:CAS:ICH:51977` | `218520` | Unknown | Coast |
| *Nemipterus zysron* | `urn:catalog:CAS:ICH:51752` | `218519` | `1947-10-02` | Coast |
| *Parexocoetus mento* | `urn:catalog:CAS:ICH:82066` | `126388` | `1947-10-27` | Cove |
| *Rogadius asper* | `urn:catalog:CAS:ICH:32861` | `218150` | `1964-01-01` | Cove |
| *Sillago sihama* | `urn:catalog:CAS:SU(ICH):21728` | `127046` | Unknown | Cove |

The *Mirolabrichthys tuka* entry retains recorded name *Pseudanthias tuka*, status `superseded combination`, and the original WoRMS record `218272`. The rejected *Bovichtus variegatus* record `urn:catalog:CAS:SU(ICH):51590` remains outside this projection; the snapshot's `excludedCount` is 1. Neither exclusion nor an empty search establishes species absence.

### Feeding examples: exact identifiers and study versions

All five also carry their individual WoRMS taxon URL, citation and locator in the JSON. [Feeding source review](../../data/research/feeding-guides-review.md) records the current interpretation and the separation of diet from catching advice.

| Taxon / Aphia ID | Diet source / identifier | Exact study scope preserved |
| --- | --- | --- |
| *Channa striata* / `280130` | Paglinawan et al. **2022**, SPJRD **27(2)**; DOI `10.53899/spjrd.v27i2.1352`; [article](https://journal.usep.edu.ph/index.php/Southeastern_Philippines_Journal/article/download/135/76). | Wild fish from three municipalities around Lake Mainit, Caraga; food composition varies with sampled season/local availability. |
| *Oreochromis niloticus* / `293639` | Richter et al. **2001**, p. **160**, repository handle `10862/842`; [SEAFDEC abstract](https://repository.seafdec.org.ph/handle/10862/842). | **Abstract-only** record of caged fish in Laguna de Bay sampled in May/August **1995**; not a fixed diet for all tilapia. |
| *Otolithes ruber* / `218641` | Palomares et al. **1997**, NAGA **20(2):35–40**; WorldFish item `fd25bdf6-ad02-49bf-85a1-01028ffd349a`; [record](https://digitalarchive.worldfishcenter.org/items/fd25bdf6-ad02-49bf-85a1-01028ffd349a), recorded CC BY 4.0. | Trawl-caught San Miguel Bay fish sampled April–May **1993**; mainly zooplankton, primarily crustaceans. |
| *Stolephorus commersonnii* / `152017` | Same Palomares **1997** paper and WorldFish item. | Same April–May **1993** San Miguel Bay sample; source spelling *Stolephorus commersonii* remains explained in the summary. |
| *Stolephorus indicus* / `212280` | Same Palomares **1997** paper and WorldFish item. | Same April–May **1993** San Miguel Bay sample; no Cavite-presence or bait-effectiveness inference. |

### Provincial groups: exact existing names

| Reported group | Source local name(s) |
| --- | --- |
| Squid | Pusit |
| Fimbriated sardines | Tunsoy |
| Blue crab | Alimasag |
| Grouper | Lapu lapu |
| Acetes | Alamang |
| Yellowfin tuna | Tambakol / Bariles |
| Threadfin bream | Bisugo |
| Indian mackerel | kabayas |
| Hairtail | Espada |
| Siganids | Samaral |
| Slipmouth | Sapsap |

The underlying JSON explicitly sets `currentPresenceVerified`, `catchabilityAssessed`, `breedingCalendar` and `legalClosedSeasonCalendar` to false. It preserves unresolved Acetes lean months and blank Slipmouth seasonal cells as null. No scientific-name mapping, seasonal display or catching recommendation is admitted by this candidate.

## Source fingerprints

These SHA-256 values identify the exact local JSON bytes inspected. They are separate from recorded upstream-source hashes.

| Existing file | SHA-256 |
| --- | --- |
| `src/data/cavite-historical-evidence.json` | `c9656f4459c42b672585d2ef0ac363a35cfac76f5d31e4d1834515cec5d82594` |
| `src/data/feeding-guides.json` | `384208677a4ea194edc7144f1b21f898117b7d8381413491bf3452cb5663889c` |
| `data/research/alternatives/cavite/cavite-reported-catch-groups-2024.json` | `f3bedcd44484a2a7cbb0d262c1497b33af09dc1b7398a138b75a2d7fce181218` |

The historical snapshot records shortlist SHA-256 `bafdede8df7c12ea4090780658866082b14d1f296baa46dae43fd0adb0c9813b`. The catch-group file and [retrieval manifest](../../data/research/alternatives/cavite/download-manifest.json) agree on upstream PDF SHA-256 `3652d4e2279dc91e759a62f1084c79deec9468c65f543fb905eca38851e266ba`, retrieved `2026-10-09T17:14:35.068Z`. That stored receipt was inspected; the original PDF was not downloaded or rehashed in this review.

## Technical checks and publication boundaries

| Read-only check | Observed result / limit |
| --- | --- |
| Instructions and product contract | Read current `AGENTS.md` and `PRODUCT.md`; inspected only public content, renderers, supporting research and the rule handoff. No participant notes or account data were accessed. |
| Baseline/source comparison | Three JSON files, three content renderers, Species page and filter helper exactly match HEAD and `d6c6d2e`. No tracked `src` change between those commits. |
| Historical deterministic projection | Called the existing builder in memory; its serialized output exactly equals the checked-in historical JSON. No generated file was written and the full historical suite was not rerun. |
| Existing focused tests | `node --experimental-strip-types --test tests/species-research.test.mjs tests/cavite-fish-candidate-review.test.mjs`: **7 passed, 0 failed**. Covers evidence filtering/counts, guide sources/scope, reproducible candidate decisions, held-candidate handling and mismatched curator identity rejection. |
| Research/public separation | Candidate ledger remains **52 occurrences / 27 candidate names**: **12 already published, 2 excluded occurrences, 38 pending review**. Four curator holds remain pending; the five October 17 desk-reviewed candidates remain pending/unplotted. This ledger is not another public starter set. |
| Historical admission gate | [Builder](../../scripts/build-cavite-historical-evidence.mjs) rejects curator-held/excluded occurrences in the shortlist, non-CC0 or mismatched dataset provenance, unsupported taxonomy, malformed dates/links, duplicate IDs and unknown locality states; the rejected Bovichtus locality remains excluded. No gate or source input changed. |
| Legal/method gate | [Rule handoff](../research/CAVITE_RULE_REVIEW_HANDOFF.md), prepared 19 October 2026, remains an internal source handoff with M4 incomplete. Missing final text, effectivity/current-status evidence, amendment reconciliation, CRS/zone implementation and qualified review cannot be filled by occurrence/diet data. No permission, gear recommendation or legal geometry is enabled. |
| Acceptance limit | Source review and deterministic checks only. No browser, screen-reader, device, build, network/source-refresh, production, publication or deployment check was performed. No commit, push or deployment occurred. |

## App labels and accessible source structure

The [historical renderer](../../src/components/historical-species-evidence.tsx) and [provincial renderer](../../src/components/cavite-fisheries-evidence.tsx) attach their visible scope/limit paragraphs to named sections with `aria-describedby`. Historical results have a polite live count and explicit no-match status; the no-match copy says absence cannot be inferred. Search and custom filter controls have text labels, native expandable summaries expose record/source details, and external links include a new-tab label. These are source-level observations, not completed assistive-technology acceptance.

Both [English](../../src/i18n/dictionaries/en.ts) and [Filipino](../../src/i18n/dictionaries/fil.ts) preserve the relevant distinctions:

| View | Labels/caveats present in the inspected source |
| --- | --- |
| Historical evidence | “Historical research records” / “Mga makasaysayang research record”; broad source locality, no selected-bay match, current presence/permission/catchability/safety unverified; “Lokasyong iniulat” and collection-date filters describe the evidence rather than fishing permission. |
| Provincial context | “Cavite fisheries information” / “Impormasyon sa pangisdaan ng Cavite”; **2024** report year; province-wide scope, unresolved scientific identities, no current-presence/permission/safety conclusion. |
| Feeding examples | “What it eats” / “Ano ang kinakain?”; “Where this was studied” / “Saan ito pinag-aralan”; each entry says it is not a Cavite diet survey or local-presence proof. Visible bait/catching warning states that natural diet does not establish effective bait, legal gear or permission. |
| Species page | “Coverage pending”; local fishing status under review; historical records do not confirm protected status or permission. Water-type and conservation-status controls remain disabled, with an explanation that reviewed values are unavailable. |

The [feeding renderer](../../src/components/feeding-guides.tsx) places the study context and pending catching-advice warning in the rendered section; its name/food filters search educational entries only. [Explore](../../src/app/page.tsx) includes provincial context only for Cavite. No inspected content renderer writes to the journal or turns research records into personal catches.

## Proposed scope for the pending owner/editorial decision

The bounded candidate is the exact existing set above as **dated education plus a separate private journal**: inspect old specimen provenance; learn the limited findings of the named diet studies; read the 2024 provincial group/local-name context; and manually record one's own catches. Personal `My Species` remains derived from identified personal journal entries, not from these research lists.

Withhold current/local species coverage, exact fishing spots, catch abundance, protected/harvestable status, access permission, legal zones, closed-season calendars, safe weather/water/food conclusions, red-tide clearance, effective bait/lure/gear and location-specific methods. No legal handoff, old specimen, food item, source title, provincial outline or failed source retrieval resolves those claims. Live-advisory coverage and publisher acceptance are outside this starter-content candidate and remain unapproved here.

Before any new publication or expanded claim, obtain a dated owner selection, editorial approval of the precise bilingual content/scope, and the required qualified legal/policy/rights decision with source/version and applicability evidence. Recheck changed sources or claims against this inventory. Until then this is an internal technical candidate; the runtime set and all existing publication holds remain unchanged.
