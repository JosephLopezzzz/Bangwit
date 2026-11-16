<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Bangwit shared UI rule

For every new or revised screen, follow the “Shared UI Rule for New Screens” in `DESIGN.md`. Use `.ui-card`, `.ui-button`, and `.ui-input` from `src/app/globals.css`; use `DropdownSelect` for choice menus and `CatchDatePicker` for dates and calendars. Do not introduce page-specific native selects, native date inputs, or duplicate base card/control styles. If a new variant is needed, add it to the shared component and its token-based styles so future uses inherit the same visual system.

## Bangwit species-image rule

Do not add an image as a species reference unless its image-to-taxon identification and item-level reuse rights are reviewed and recorded in `src/lib/species-images.ts`. Use the shared `SpeciesImage` component, preserve visible source/license/identification credits, and keep missing or unresolved images on the explicit localized fallback. Do not reuse private catch photos, a different species, Bilog, or generated artwork as a biological reference. See `docs/SPECIES_IMAGE_STANDARD.md`.
