import { Fish } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { SpeciesImageRecord } from "@/lib/species-images";

export type SpeciesImageLabels = {
  unavailable: string;
  source: string;
  creator: string;
  license: string;
  identification: string;
};

type SpeciesImageProps = {
  image: SpeciesImageRecord | null | undefined;
  labels: SpeciesImageLabels;
  sizes?: string;
  className?: string;
};

function isAllowedLocalImage(image: SpeciesImageRecord): boolean {
  return (
    image.rights.status === "cleared" &&
    image.src.startsWith("/assets/species/") &&
    !image.src.includes("..") &&
    /\.(?:avif|jpe?g|png|webp)$/i.test(image.src)
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
}

/**
 * A field-guide image slot. Images are same-origin, rights-cleared entries
 * from the species image registry; missing or uncleared items never get a
 * generic picture passed off as the taxon.
 */
export function SpeciesImage({
  image,
  labels,
  sizes = "(max-width: 640px) 100vw, 480px",
  className,
}: SpeciesImageProps) {
  const allowedImage = image && isAllowedLocalImage(image) ? image : null;
  const figureClassName = ["species-image", className].filter(Boolean).join(" ");

  return (
    <figure className={figureClassName}>
      <div className="species-image__frame">
        {allowedImage ? (
          <Image
            src={allowedImage.src}
            alt={allowedImage.alt}
            width={960}
            height={720}
            sizes={sizes}
            loading="lazy"
            unoptimized
            className="species-image__asset"
          />
        ) : (
          <div className="species-image__fallback">
            <Fish aria-hidden="true" size={30} strokeWidth={1.6} />
          </div>
        )}
      </div>
      <figcaption className="species-image__caption">
        {allowedImage ? (
          <dl className="species-image__credits">
            <div>
              <dt>{labels.source}</dt>
              <dd>
                <ExternalLink href={allowedImage.media.sourceUrl}>{allowedImage.media.title}</ExternalLink>
              </dd>
            </div>
            {allowedImage.media.creator && (
              <div>
                <dt>{labels.creator}</dt>
                <dd>{allowedImage.media.creator}</dd>
              </div>
            )}
            <div>
              <dt>{labels.license}</dt>
              <dd>
                {allowedImage.rights.url ? (
                  <ExternalLink href={allowedImage.rights.url}>{allowedImage.rights.label}</ExternalLink>
                ) : (
                  allowedImage.rights.label
                )}
              </dd>
            </div>
            <div>
              <dt>{labels.identification}</dt>
              <dd>
                <ExternalLink href={allowedImage.identification.sourceUrl}>
                  {allowedImage.identification.sourceTitle}
                </ExternalLink>
              </dd>
            </div>
          </dl>
        ) : (
          <p>{labels.unavailable}</p>
        )}
      </figcaption>
    </figure>
  );
}
