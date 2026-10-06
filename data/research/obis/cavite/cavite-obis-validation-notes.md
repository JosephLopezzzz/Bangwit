# Cavite OBIS first-pass validation

## What the export supports

The export contains 160 OBIS occurrence records. Of these, 106 have a populated species-level `species` field, representing 78 distinct names. The other 54 records lack that field and need taxonomic review. The 78-name list includes fish and non-fish aquatic/coastal taxa, plus waterbird records; it is not a catch-target list. Record counts are counts of dataset records, not fish abundance.

## Location quality

40 records report coordinate uncertainty greater than 10 km; 5 exceed 100 km. The largest uncertainty is 1,121,686 m. A row-level review file is available as `cavite-obis-location-review.csv`. The 10 km threshold is a screening aid only, not a final pass/fail rule. Review the record's locality and uncertainty, then check it against a valid Cavite coastal/municipal-water boundary before calling it a Cavite record. Blank uncertainty is unknown, not zero.

## Policy and taxonomy source notes

- **Taxon-name checking:** use the OBIS/WoRMS Aphia identifiers where present and query WoRMS for accepted-name status, rank, and synonyms. WoRMS documents these name-resolution functions in its [webservice](https://marinespecies.org/aphia.php?p=webservice). For non-marine or broader taxonomic coverage, use GBIF's [Species API](https://techdocs.gbif.org/en/openapi/v1/species) as a cross-check. Neither service establishes local presence or legal catchability.
- **General Philippine wildlife framework:** [Republic Act 9147](https://lawphil.net/statutes/repacts/ra2001/ra_9147_2001.html) assigns turtles/tortoises and waterbirds to DENR, and aquatic resources including fishes and invertebrates to DA/BFAR (Sec. 4). It also sets rules for threatened-wildlife collection and prohibited acts (Secs. 23, 27). Route rules to the appropriate agency and species-specific issuance.
- **Pawikan records:** the export has one `Eretmochelys imbricata` record and one `Lepidochelys olivacea` record. DENR material identifies the hawksbill as critically endangered and olive ridley as endangered under DAO 2019-09; see the [official DENR e-library order](https://elibrary.bmb.gov.ph/elibrary/wp-content/uploads/2023/05/dao2019-09.pdf) and DENR notices on [hawksbill](https://r5.denr.gov.ph/news-events/hawksbill-turtle-rescued-and-released-in-catanduanes-2/) and [olive ridley](https://r5.denr.gov.ph/news-events/cenro-mobo-lgu-aroroy-rescue-an-olive-ridley-sea-turtle/). RA 9147 puts turtles under DENR jurisdiction. Treat these records as protected-wildlife cautions, never catch/bait suggestions; keep their precise locations private. Their coordinates also have about 31 km uncertainty and their `class` field is blank in this export, so local occurrence and taxonomy still need review.
- **Aquatic threatened species:** BFAR lists [FAO 208-1 (2024)](https://naro.law.upd.edu.ph/issuances/7103) as an amendment to the rare/threatened/endangered fishery species order. BFAR also lists [FAO 272 (2023)](https://www.bfar.da.gov.ph/laws-regulations-issuances/administrative-orders/) on shark conservation and management. The export includes a `Carcharhinus sorrah` shark record. Match the full current issuance and its scope before assigning a legal status; the order title alone is not enough to declare a species banned or harvestable.
- **Closed seasons:** BFAR's [Fisheries Administrative Orders index](https://www.bfar.da.gov.ph/laws-regulations-issuances/administrative-orders/) and [2022 Fisheries Profile](https://www.bfar.da.gov.ph/wp-content/uploads/2024/02/2022-Philippine-Fisheries-Profile.pdf) show that closures are issued for specified species, areas, dates, gears, and fishing operations. Do not transfer another gulf/sea's closure calendar to Cavite without a matching order.
- **Cavite boundaries:** the Cavite provincial government published a 2011 [coastal-water boundaries map](https://cavite.gov.ph/home/wp-content/uploads/2017/06/Chapter-1.pdf). Treat it as a dated reference map, not a current, machine-readable legal boundary. For legal fishing-area guidance, validate with current municipal-water boundaries, applicable local ordinances, protected-area rules, and BFAR Region IV-A/LGU sources.
- **Data reuse:** each dataset's source and license are retained in the checklist. If a row has no license/citation value, do not assume unrestricted reuse; inspect the dataset's terms and attribution requirements.

## Safe Bangwit handling until review is complete

1. Display these as sourced historical occurrence records, with record date and data-quality caveats.
2. Keep the species-presence layer separate from catchability, personal catch logs, and community reports.
3. Show legal status as `not yet verified` until the precise current local rule is matched to species, location, date, gear, and user type.
4. Exclude protected or uncertain wildlife records from `what can I catch?` and bait recommendations; show a clear conservation caution where relevant.
5. Do not infer edible/safe-to-eat status or invasiveness from OBIS occurrence data. Those need separate, authoritative, location-specific evidence.

This is an initial data QA and source map, not a complete species-by-species legal opinion or permission to fish.
## First-pass location triage

The 40 flagged occurrence rows now include a source-based triage label in `cavite-obis-location-review.csv`:

- 22 say Cavite/Manila Bay or Ternate but remain approximate; use only as broad-area reports after validation.
- 9 lack enough locality detail to confirm Cavite.
- 5 have uncertainty above 100 km; source remarks for some say the error can cover the rest of the Philippines.
- 2 locality fields say Nasugbu, Batangas; exclude from the Cavite pilot unless the original source resolves the conflict.
- 2 sea-turtle records need sensitive-wildlife handling and must not be catch suggestions.

These are triage decisions from the supplied occurrence metadata, not final boundary verification. A current machine-readable municipal-waters boundary was not available in the sources reviewed; the provincial map found is dated 2011. The two records explicitly labeled Nasugbu/Batangas are the clearest candidates to remove from the Cavite dataset, while wide-uncertainty points should remain unverified.

## Fish-only working view

`cavite-obis-fish-candidates.csv` contains the 27 checklist entries whose OBIS class is Teleostei or Elasmobranchii. It remains a research shortlist: record counts are not abundance, some records are old or spatially vague, and catchability/legal/season status has not been assessed.

## Taxonomic name cross-check

On 2026-10-06, all 27 Aphia IDs in the fish-candidate list were checked against the WoRMS [AphiaRecordsByAphiaIDs REST endpoint](https://www.marinespecies.org/rest/AphiaRecordsByAphiaIDs). WoRMS returned 26 accepted names and one `superseded combination`: OBIS lists `Pseudanthias tuka`, which WoRMS currently resolves to `Mirolabrichthys tuka` (AphiaID 312510). The OBIS and WoRMS class/family fields matched for all 27 entries. The complete response fields and query timestamp are retained in `cavite-obis-worms-crosswalk.csv`; rerun `node scripts/fetch-cavite-worms-crosswalk.mjs` to refresh.

This only checks names and classification. It does not resolve the historical occurrence's exact locality, establish current presence in Cavite, or determine whether a species may legally be caught.

## Preliminary rules and locality screen

`cavite-obis-rule-screen.csv` is a review tracker, not a legal clearance list. In the 52 raw occurrence rows linked to the 27 fish candidates, the `stateProvince` field says Cavite on 10 rows, Batangas on 2 rows, and is blank on 40 rows. Some blank-province rows have broad locality descriptions, but those descriptions still need to be checked against current municipal-water and sanctuary boundaries. The two Batangas-labelled records are for `Aseraggodes albidus`; exclude those specific records from Cavite presence evidence unless the source is corrected. This does not prove that the species is absent from Cavite.

- **General jurisdiction:** [RA 9147, Section 4](https://lawphil.net/statutes/repacts/ra2001/ra_9147_2001.html) assigns fishes and other aquatic resources to DA, while turtles and wetland wildlife are under DENR jurisdiction. Preserve the turtle records' separate DENR/sensitive-wildlife path.
- **CITES and the shark candidate:** the consolidated CITES Appendices effective 2026-03-05 include `Carcharhinidae spp.` in Appendix II, except species in Appendix I. The candidate `Carcharhinus sorrah` is a Carcharhinidae species, so flag it for that Appendix II listing. See the [official consolidated treaty text](https://zoek.officielebekendmakingen.nl/trb-2026-100.html), especially the `spp.` definition and shark entries. Philippine [RA 10654, Section 102(b)](https://lawphil.net/statutes/repacts/ra2015/ra_10654_2015.html) ties the domestic prohibition for Appendix II/III aquatic species to scientific assessment of population viability under collection/trade pressure. Do not turn the Appendix II flag into an unconditional local take-ban or a permission to catch; retain `not verified` pending BFAR confirmation and applicable assessment. [FAO 272](https://naro.law.upd.edu.ph/issuances/1753) is the current BFAR shark-management issuance for Philippine fishing vessels and needs a separate scope/gear/user-type review.
- **Rare/threatened fishery species:** [FAO 208-1 (2024)](https://naro.law.upd.edu.ph/issuances/7103) amends FAO 208. The attached scan was not reliably searchable by species name in this review, so no `not listed` conclusions are made for the 27 candidates. The full annex must be checked by a human or from a reliable text copy before setting any species-specific status.
- **Cavite rules:** the Cavite government's [2024 Ecological Profile](https://cavite.gov.ph/wp-content/uploads/2026/04/CEP_2024.pdf) inventories municipal ordinances, registration rules, and sanctuary declarations. It is an inventory, not the complete current legal text or a usable boundary layer. Match each planned location to the LGU, municipal-water boundary, protected/sanctuary area, gear, fisher type, and date, then verify the current ordinance/order with the LGU or BFAR Region IV-A.

Until those checks are complete, every row in the review tracker remains `NOT VERIFIED - do not recommend as catchable`. A species occurrence or a blank search result is not legal permission.
