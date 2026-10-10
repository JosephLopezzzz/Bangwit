# Cavite OBIS research files

This folder keeps the raw OBIS occurrence export and its working review outputs together.

- `cavite-obis-occurrences.csv` — raw occurrence records from the fetch script.
- `cavite-obis-species-checklist.csv` — grouped checklist with record provenance.
- `cavite-obis-fish-candidates.csv` — fish-only working shortlist (`Teleostei` and `Elasmobranchii`), not a verified catch list.
- `cavite-obis-worms-crosswalk.csv` — current WoRMS name/status cross-check for fish candidates with Aphia IDs.
- `cavite-obis-cc0-fish-shortlist.csv` — reproducible CC0-only, species-level fish specimen shortlist with source, license, accepted-name, provider georeference remarks, and locality-screen fields. Research only; not a verified current-presence or catchability list.
- `cavite-obis-rule-screen.csv` — preliminary national/local rule and locality review tracker; all catchability remains unverified.
- `cavite-fisheries-rule-source-inventory.md` — source map for the Cavite pilot's national, Manila Bay, and LGU rule checks; not a legal clearance.
- `../../alternatives/cavite/README.md` — direct-access alternative source bundle, local downloaded evidence, a dated discovery outline, and development tasks that do not depend on agency email replies.
- `cavite-obis-dataset-license-review.csv` — live OBIS dataset metadata cross-check for the 11 source datasets, including per-record license counts, dataset-level rights, citation availability, and follow-up actions.
- `cavite-obis-location-review.csv` — occurrence rows flagged for coordinate uncertainty review.
- `cavite-obis-data-review-notes.md` and `cavite-obis-validation-notes.md` — interpretation, limitations, and source notes.

The checklist is research material, not app-ready or legal catch advice. This export contains multiple licenses; the repository's own license does not replace source-dataset terms. Check the license review and keep the dataset, citation, and individual record license attached before redistributing or integrating any occurrence. Verify names, locations, and applicable rules separately.

To refresh the raw OBIS export, run `node fetch-obis-cavite.mjs` from the project root. The script writes the CSV to this folder.

To refresh the taxonomic name cross-check, run `node scripts/fetch-cavite-worms-crosswalk.mjs` from the project root. It uses the Aphia IDs already present in the fish-candidate CSV and queries the public WoRMS REST service. Taxonomic acceptance does not establish local presence, catchability, or legal status.

To rebuild the CC0-only fish shortlist after refreshing its source files, run `node scripts/build-cavite-cc0-fish-shortlist.mjs` from the project root. The script requires both the occurrence-level license and the reviewed dataset-level license to be CC0. It keeps historic specimen records separate from current presence and legal catchability.

The shortlist's locality screen reads the source locality and georeference remarks. It does not perform a point-in-polygon test: the project does not contain a suitable authoritative Cavite fishing-water boundary geometry. Do not treat its broad-area labels as verified provincial or municipal-water coverage.

## Historical product view

`node scripts/build-cavite-historical-evidence.mjs` builds `src/data/cavite-historical-evidence.json` for the separate historical research section on the Species page. It retains 12 reviewed museum records, excludes the locality rejected by this screen, preserves three missing collection dates and one month-only date, and publishes no coordinates or bay assignment. Its required inputs are this shortlist, the WoRMS crosswalk, dataset-license review, and the license-review date documented in the validation notes. Invalid licenses, taxonomy, provenance, dates, duplicate IDs or unknown locality-review states stop generation. The raw shortlist remains unchanged.

Run `npm run test:evidence` to check the adapter and exact snapshot regeneration. This projection is historical source evidence only; verified current species filters and legal/catchability guidance remain unavailable.
