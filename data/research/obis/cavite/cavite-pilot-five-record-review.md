# Cavite pilot — initial review of five OBIS candidates

Reviewed: 17 October 2026
Review type: initial desk/source review; not a specialist taxonomic or fisheries-curator sign-off.
Publication result: all five remain out of the public historical snapshot.

The current public snapshot continues to contain 12 reviewed CAS CC0 records. A candidate name, an accepted taxonomic name, or a point returned by a data portal does not by itself establish a wild occurrence in a Cavite fishing water. The locations below are not plotted or assigned to Manila Bay, Bacoor Bay or Cañacao Bay.

| Candidate / catalog | Source and current identifiers | Initial decision | Reason and next evidence needed |
| --- | --- | --- | --- |
| *Nuchequula blochii* · USNM `139605.5286869` | OBIS `9f16eeaa-9c50-4cad-97f9-5a728254ea1f`; NMNH Fishes dataset `d6d6fe4c-425f-4ce7-bf28-7a6befaeb413` | Hold | The 1909 locality says “Corregidor Lt., N. 74 Degrees W., 6.9 Miles, Manila Bay”; the export supplies no coordinate uncertainty or georeference remarks. The NMNH dataset says locality text comes from field notes/cruise logs and warns that added geographic retrieval fields may not be geographically accurate. Verify the original catalog record and its georeferencing before deciding whether it is Cavite-specific. |
| *Ostorhinchus fasciatus* · USNM `171462.5271945` | OBIS `0283ab44-b1e8-4ed4-9e11-2cff048300aa`; same NMNH dataset | Hold | Same broad 1909 locality and missing coordinate uncertainty. No bay-level or point-level assignment is supported. Verify the original catalog record/georeferencing. |
| *Ostorhinchus pleuron* · USNM `361118.5271944` | OBIS `dd7c909e-e8e5-4fae-b768-eea845e2de83`; same NMNH dataset | Hold | Same broad 1909 locality and missing coordinate uncertainty. No bay-level or point-level assignment is supported. Verify the original catalog record/georeferencing. |
| *Ostracion rhinorhynchos* · NMI `1657` | OBIS `de331418-cfe9-4e0a-9797-8f2512729ad5`; SEAOBIS occurrence `795892`; GBIF record `4509664098`; dataset DOI `10.15468/qdw6v3` | Hold | Current GBIF metadata shows a year-only date (1947), a Cavite province field and a CC BY 4.0 record license. The OBIS export lacks event date and locality; the GBIF record has no detailed locality or coordinate-uncertainty value and reports an assumed WGS84 datum and no collection match. The dataset describes specimens from landing sites/markets as well as nearby seas, so the administrative field cannot establish wild capture in Cavite waters. Verify the original NMI catalog/source archive and collection context. |
| *Stolephorus indicus* · NMI `859` | OBIS `6ad5b3c0-daee-4db4-b1fb-1ea45f32e912`; SEAOBIS occurrence `796425`; GBIF record `4509664309`; same dataset DOI | Hold | Current GBIF metadata shows a year-only date (1948), a Cavite province field and a CC BY 4.0 record license. The OBIS export lacks event date and locality; the GBIF record has no detailed locality or coordinate-uncertainty value and reports an assumed WGS84 datum and no collection match. The dataset includes landing/market samples, so do not label this as a confirmed wild Cavite-water catch without the original catalog/source context. |

## Reuse, taxonomy and location review

- The Smithsonian IPT metadata describes the dataset as CC BY 4.0 and supplies a citation. Blank occurrence-license fields in the OBIS export remain blank; attribution rights do not resolve locality quality.
- GBIF's current individual records for NMI 1657 and NMI 859 expose record-level CC BY 4.0 licenses and a dataset-level CC BY 4.0 license. This is not an approval to reuse source images or to claim a precise Cavite fishing-water location. If later admitted, preserve the per-record links and dataset DOI/citation.
- WoRMS crosswalk entries accept all five taxon names, with taxonomic name resolution kept separate from locality, legality and present-day presence.
- The original NMI IPT archive URL advertised by GBIF did not resolve during the 17 October check. The current GBIF occurrence records were readable, but they do not provide a detailed collection locality or coordinate uncertainty. The archive retrieval failure is a source-access limit, not a finding that no locality exists in the museum catalog.
- Keep the five rows as pending in the generated candidate ledger. Do not convert these desk-review holds into specialist approval or rejection. The `cavite-obis-location-review.csv` entries explain why each must stay unplotted and pending.

## Supplementary secondary-source lead — 17 October 2026

FishBase's museum-occurrence pages provide a possible lead for the two National Museum catalog numbers that was not present in the OBIS export reviewed above:

- NMI `1657` (*Ostracion rhinorhynchos*): FishBase lists year 1947, collector San Juan M., gazetteer locality Naic, date 1947-11-23, and identifier Umali A.F. The page's "Name used" field spells the name *Ostracion rhinorhynchus*.
- NMI `859` (*Stolephorus indicus*): FishBase lists year 1948, collector College of Agri, U.P., gazetteer locality Naic, date 1948-04-01, and identifier Umali A.F.
- Both pages cite Anonymous (2003), *Fish Collection of the Philippine National Museum*, National Museum, and display a last-modified stamp of `10/04/17`. The linked citation page gives no DOI or digitized catalog page.

This is a secondary catalog lead, not primary validation. It may narrow the source locality to a gazetteer entry for Naic, but it does not provide the original catalog image, confirm whether the locality means capture rather than landing/market provenance, establish coordinate uncertainty, or prove a point lies in municipal waters. Keep both records pending and unplotted until the National Museum catalog/source or a qualified curator confirms the collection context and locality. The candidate-review generator and public snapshot are unchanged by this lead.

## References checked

- Smithsonian NMNH Fishes IPT dataset: https://ipt.obis.org/nonode/resource?r=nmnh-vzfishes
- Smithsonian NMNH fish collection search: https://collections.mnh.si.edu/search/fishes/
- National Museum / ASEAN Centre for Biodiversity dataset: https://www.gbif.org/dataset/18896efa-22df-4fbd-9782-42f47257e753
- GBIF NMI 1657 record: https://api.gbif.org/v1/occurrence/4509664098
- GBIF NMI 859 record: https://api.gbif.org/v1/occurrence/4509664309
- FishBase NMI 1657 secondary occurrence detail: https://fishbase.net.br/museum/SpecOccurrences.php?catnum2=100609
- FishBase NMI 859 secondary occurrence detail: https://fishbase.net.br/museum/SpecOccurrences.php?catnum2=101808
- FishBase linked reference (Anonymous 2003): https://fishbase.net.br/references/FBRefSummary.php?ID=45880
- OBIS and WoRMS IDs are recorded in each row of `cavite-obis-fish-candidate-review.csv` and `cavite-obis-worms-crosswalk.csv`.
