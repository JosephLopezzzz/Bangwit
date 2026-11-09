"use client";

import { ArrowUpRight, Waves } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import type { ExplorerArtwork } from "@/data/species-artwork";
import { formatExplorerText, getSpeciesExplorerCopy } from "@/i18n/species-explorer";
import type { Language } from "@/i18n/types";
import type { ExplorerSpecies } from "@/types/species-explorer";
import "./species-details.css";

type SpeciesIllustrationProps = {
  artwork: ExplorerArtwork | null;
  lang: Language;
  modal?: boolean;
};

export function SpeciesIllustration({ artwork, lang, modal = false }: SpeciesIllustrationProps) {
  const copy = getSpeciesExplorerCopy(lang);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = Boolean(artwork && failedSource === artwork.src);

  if (!artwork || failed) {
    return (
      <span
        className="explorer-species-art explorer-species-art--unavailable"
        role="img"
        aria-label={failed ? copy.artworkFailed : copy.missingArtwork}
      >
        <Waves aria-hidden="true" size={28} strokeWidth={1.5} />
        <span>{failed ? copy.artworkFailed : copy.missingArtwork}</span>
      </span>
    );
  }

  return (
    <span className={`explorer-species-art${modal ? " explorer-species-art--modal" : ""}`}>
      <Image
        src={artwork.src}
        width={artwork.width}
        height={artwork.height}
        alt={artwork.alt[lang]}
        sizes={modal ? "(max-width: 600px) 100px, 180px" : "(max-width: 600px) 45vw, 240px"}
        unoptimized
        draggable={false}
        onError={() => setFailedSource(artwork.src)}
      />
    </span>
  );
}

export type SpeciesCardProps = {
  species: ExplorerSpecies;
  artwork?: ExplorerArtwork | null;
  lang: Language;
  onSelect: (species: ExplorerSpecies, trigger: HTMLButtonElement) => void;
};

export function SpeciesCard({ species, artwork = null, lang, onSelect }: SpeciesCardProps) {
  const copy = getSpeciesExplorerCopy(lang);
  const nameId = useId();
  const name = species.commonName?.[lang] || species.scientificName;
  const image = artwork?.taxonId === species.id ? artwork : null;
  const water = species.waterTypes.map((type) => copy.waterTypes[type]).join(" · ");

  return (
    <article className="ui-card explorer-species-card" aria-labelledby={nameId}>
      <button
        type="button"
        className="ui-button ui-button--quiet explorer-species-card-trigger"
        aria-haspopup="dialog"
        aria-label={formatExplorerText(copy.viewSpeciesDetails, { name })}
        onClick={(event) => onSelect(species, event.currentTarget)}
      >
        <SpeciesIllustration artwork={image} lang={lang} />
        <span className="explorer-species-card-copy">
          <strong id={nameId}>{name}</strong>
          {species.commonName?.[lang] && <i>{species.scientificName}</i>}
          <span className="explorer-species-card-meta">{water || `${copy.waterType}: ${copy.notReviewed}`}</span>
        </span>
        <span className="explorer-species-card-action">
          {copy.viewDetails}
          <ArrowUpRight aria-hidden="true" size={15} />
        </span>
      </button>
    </article>
  );
}
