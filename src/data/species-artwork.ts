import artwork from "./species-artwork.json";

export type ExplorerArtwork = {
  taxonId: string;
  scientificName: string;
  src: string;
  width: number;
  height: number;
  alt: { en: string; fil: string };
  habitat: { en: string; fil: string };
  provenance: {
    kind: string;
    sourceAtlas: string;
    tile: number;
    reviewStatus: string;
  };
};

export const SPECIES_ARTWORK: readonly ExplorerArtwork[] = artwork.records;

/** Match reviewed canonical identity only, never a similar common name. */
export function getSpeciesArtwork(taxonId: string): ExplorerArtwork | null {
  return SPECIES_ARTWORK.find((image) => image.taxonId === taxonId) ?? null;
}
