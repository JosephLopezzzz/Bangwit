# Cavite OBIS research files

This folder keeps the raw OBIS occurrence export and its working review outputs together.

- `cavite-obis-occurrences.csv` — raw occurrence records from the fetch script.
- `cavite-obis-species-checklist.csv` — grouped checklist with record provenance.
- `cavite-obis-fish-candidates.csv` — fish-only working shortlist (`Teleostei` and `Elasmobranchii`), not a verified catch list.
- `cavite-obis-worms-crosswalk.csv` — current WoRMS name/status cross-check for fish candidates with Aphia IDs.
- `cavite-obis-rule-screen.csv` — preliminary national/local rule and locality review tracker; all catchability remains unverified.
- `cavite-obis-dataset-license-review.csv` — live OBIS dataset metadata cross-check for the 11 source datasets, including per-record license counts, dataset-level rights, citation availability, and follow-up actions.
- `cavite-obis-location-review.csv` — occurrence rows flagged for coordinate uncertainty review.
- `cavite-obis-data-review-notes.md` and `cavite-obis-validation-notes.md` — interpretation, limitations, and source notes.

The checklist is research material, not app-ready or legal catch advice. This export contains multiple licenses; the repository's own license does not replace source-dataset terms. Check the license review and keep the dataset, citation, and individual record license attached before redistributing or integrating any occurrence. Verify names, locations, and applicable rules separately.

To refresh the raw OBIS export, run `node fetch-obis-cavite.mjs` from the project root. The script writes the CSV to this folder.

To refresh the taxonomic name cross-check, run `node scripts/fetch-cavite-worms-crosswalk.mjs` from the project root. It uses the Aphia IDs already present in the fish-candidate CSV and queries the public WoRMS REST service. Taxonomic acceptance does not establish local presence, catchability, or legal status.
