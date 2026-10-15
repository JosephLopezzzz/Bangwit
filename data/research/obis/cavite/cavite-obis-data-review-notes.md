# Cavite OBIS occurrence export — review notes

- Raw export: cavite-obis-occurrences.csv (160 occurrence records; 11 datasets).
- Species-level checklist: cavite-obis-species-checklist.csv (78 distinct values in OBIS's species field, covering 106 records).
- The other 54 records have no value in OBIS's species field, so they are not counted as species in the checklist. Keep them in the raw export for later taxonomic review.
- This is not a fish-only list: the records span fish and other aquatic groups, so use the class field to filter or label them.
- Location screening: 40 records report coordinate uncertainty greater than 10 km; 5 exceed 100 km. The largest reported uncertainty is 1121686 m. These are review flags, not proof that a record is wrong; verify locality and coordinate uncertainty before describing it as Cavite-specific.
- OBIS occurrence records document reported observations or specimens. They do not establish abundance, current presence, catchability, native/invasive status, edibility, or legality. Do not present this checklist as a list of fish that may be caught.
- Check each dataset's citation and license before redistributing its records. Blank license/citation fields mean the occurrence record did not provide that value in this export; they do not mean unrestricted reuse.

## October 2026 CC-BY fish candidate review

`cavite-obis-curator-review.csv` is a durable input to the generated candidate ledger. The four Smithsonian occurrences were matched by catalog number, source name/locality, and event date to rows in the [2018-10-10 NMNH Darwin Core Archive](https://ipt.obis.org/nonode/resource?r=nmnh-vzfishes): source row IDs 26450, 89482, 10122, and 4725. The archive and dataset metadata state CC-BY 4.0. The source gives collector/cruise-log locality text but warns derived geographic retrieval fields may be inaccurate; coordinate precision and uncertainty are not supplied. These four remain held out of local/public evidence until locality strength and app attribution are addressed. Two rows use updated OBIS names (`Jaydia smithi` / `Jaydia truncata`) while the 2018 archive names are `Apogon smithi` / `Apogon truncatus`, so preserve that name history for taxonomy review.

The National Museum of the Philippines occurrence matched [GBIF record 795932](https://www.gbif.org/occurrence/795932) by scientific name and normalized catalog number (`NMI- 570` / `NMI-570`). The current [GBIF dataset metadata](https://www.gbif.org/dataset/18896efa-22df-4fbd-9782-42f47257e753) identifies ACB as publisher, version 1.33, and CC-BY 4.0. The exact occurrence has event year 1948 and a CC-BY 4.0 record license, but its locality is blank. It is excluded from Cavite-specific evidence only; the species is not excluded elsewhere. This refinement does not change the public snapshot, which remains the separate 12-record CAS CC0 projection.
