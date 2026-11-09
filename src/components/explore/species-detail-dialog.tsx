"use client";

import { ArrowLeft, ExternalLink, Info, ShieldAlert, X } from "lucide-react";
import { type KeyboardEvent, type RefObject, useEffect, useId, useRef, useState } from "react";
import type { ExplorerArtwork } from "@/data/species-artwork";
import { getSpeciesExplorerCopy, type SpeciesExplorerCopy } from "@/i18n/species-explorer";
import type { Language } from "@/i18n/types";
import { selectReviewedFishingGuide, UNAVAILABLE_FISHING_GUIDE } from "@/lib/species-explorer/selectors";
import type {
  ExplorerAssertion,
  ExplorerFishingGuide,
  ExplorerGuideField,
  ExplorerScope,
  ExplorerSource,
  ExplorerSpecies,
} from "@/types/species-explorer";
import { SpeciesIllustration } from "./species-card";
import "./species-details.css";

export type SpeciesDetailDialogProps = {
  species: ExplorerSpecies | null;
  artwork?: ExplorerArtwork | null;
  lang: Language;
  placeLabel: string;
  scope?: ExplorerScope;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

function publicUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function displayDate(value: string | null, lang: Language, unknown: string) {
  if (!value) return unknown;
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function reviewedField(guide: ExplorerFishingGuide, field: ExplorerGuideField) {
  return (guide.status === "reviewed" || guide.status === "partial") && guide.reviewedFields.includes(field);
}

function guideValue(
  guide: ExplorerFishingGuide,
  field: "method" | "bait" | "gear" | "conditions" | "handling",
  lang: Language,
  copy: SpeciesExplorerCopy,
) {
  if (guide.status === "not-applicable" || guide.status === "restricted") return copy.notApplicable;
  return reviewedField(guide, field) && guide[field] ? guide[field][lang] : copy.notReviewed;
}

function EvidenceSource({ source }: { source: ExplorerSource }) {
  const href = publicUrl(source.url);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="species-detail-source-link">
      <span>{source.title}</span>
      <ExternalLink aria-hidden="true" size={13} />
    </a>
  ) : (
    <span>{source.title}</span>
  );
}

function EvidenceRecord({
  assertion,
  lang,
  copy,
}: {
  assertion: ExplorerAssertion;
  lang: Language;
  copy: SpeciesExplorerCopy;
}) {
  const kind =
    assertion.evidenceKind === "historical-specimen"
      ? copy.evidenceKinds.historical
      : assertion.evidenceKind === "literature-checklist"
        ? copy.evidenceKinds.checklist
        : copy.evidenceKinds.survey;
  const licenseUrl = publicUrl(assertion.source.licenseUrl);

  return (
    <article className="species-evidence-record">
      <h4>
        <EvidenceSource source={assertion.source} />
      </h4>
      <p className="species-detail-muted">
        {kind} · {assertion.reportedLocality}
      </p>
      <p className="species-detail-muted">{assertion.source.citation}</p>
      <dl className="species-detail-fields species-evidence-fields">
        <div>
          <dt>{copy.recordedName}</dt>
          <dd>
            <i>{assertion.recordedName}</i>
          </dd>
        </div>
        <div>
          <dt>{copy.observedOn}</dt>
          <dd>{displayDate(assertion.observedOn, lang, copy.dateUnknown)}</dd>
        </div>
        <div>
          <dt>{copy.publishedOn}</dt>
          <dd>{displayDate(assertion.source.publicationDate, lang, copy.dateUnknown)}</dd>
        </div>
        <div>
          <dt>{copy.reviewedOn}</dt>
          <dd>{displayDate(assertion.reviewedOn, lang, copy.dateUnknown)}</dd>
        </div>
        {assertion.siteLabels.length > 0 && (
          <div>
            <dt>{copy.reportedSites}</dt>
            <dd>{assertion.siteLabels.join(", ")}</dd>
          </div>
        )}
      </dl>
      {assertion.limitations.length > 0 && (
        <ul className="species-evidence-limitations">
          {assertion.limitations.map((limitation) => (
            <li key={`${assertion.id}:${limitation.en}`}>{limitation[lang]}</li>
          ))}
        </ul>
      )}
      {assertion.source.license && (
        <p className="species-detail-muted">
          {licenseUrl ? (
            <a href={licenseUrl} target="_blank" rel="noopener noreferrer">
              {assertion.source.license}
            </a>
          ) : (
            assertion.source.license
          )}
        </p>
      )}
      {!assertion.source.license && assertion.source.permissionType && licenseUrl && (
        <p className="species-detail-muted">
          <a href={licenseUrl} target="_blank" rel="noopener noreferrer">
            {copy.reuseTerms}
          </a>
        </p>
      )}
    </article>
  );
}

export function SpeciesDetailDialog({
  species,
  artwork = null,
  lang,
  placeLabel,
  scope,
  onClose,
  returnFocusRef,
}: SpeciesDetailDialogProps) {
  const copy = getSpeciesExplorerCopy(lang);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const outsidePointerRef = useRef(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [tab, setTab] = useState<{ speciesId: string | null; name: "fishing" | "overview" }>({
    speciesId: null,
    name: "fishing",
  });
  const id = useId();
  const headingId = `${id}-title`;
  const activeTab = tab.speciesId === species?.id ? tab.name : "fishing";
  const isOpen = Boolean(species);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (species && !dialog.open) {
      previousFocusRef.current =
        returnFocusRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      dialog.showModal();
      closeRef.current?.focus({ preventScroll: true });
    } else if (!species && dialog.open) dialog.close();
  }, [species, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  function close() {
    dialogRef.current?.close();
  }

  function keepFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter(
      (element) =>
        element.tabIndex >= 0 &&
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== "hidden",
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) {
      event.preventDefault();
      closeRef.current?.focus();
      return;
    }
    if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  function selectTab(name: "fishing" | "overview", focus = false) {
    setTab({ speciesId: species?.id ?? null, name });
    if (focus) tabsRef.current[name === "fishing" ? 0 : 1]?.focus();
  }

  function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    selectTab(
      event.key === "Home"
        ? "fishing"
        : event.key === "End"
          ? "overview"
          : activeTab === "fishing"
            ? "overview"
            : "fishing",
      true,
    );
  }

  const todayUTC = new Date().toISOString().slice(0, 10);
  const guide = species
    ? scope
      ? selectReviewedFishingGuide(species.fishingGuide, scope, todayUTC)
      : UNAVAILABLE_FISHING_GUIDE
    : null;
  const name = species?.commonName?.[lang] || species?.scientificName || "";
  const image = species && artwork?.taxonId === species.id ? artwork : null;
  const hasReviewedSteps = guide && reviewedField(guide, "steps") && guide.steps.length > 0;
  const extras = guide
    ? (["gear", "conditions", "handling"] as const).filter((field) => reviewedField(guide, field) && guide[field])
    : [];
  const taxonomyUrl = publicUrl(species?.taxon.taxonomyUrl ?? null);

  return (
    <dialog
      ref={dialogRef}
      className="ui-dialog species-detail-dialog"
      aria-labelledby={headingId}
      onCancel={(event) => event.stopPropagation()}
      onKeyDown={keepFocus}
      onClose={() => {
        const trigger = returnFocusRef?.current ?? previousFocusRef.current;
        setTab({ speciesId: null, name: "fishing" });
        onClose();
        requestAnimationFrame(() => {
          if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        });
      }}
      onPointerDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        outsidePointerRef.current =
          event.target === event.currentTarget &&
          (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom);
      }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          outsidePointerRef.current &&
          event.target === event.currentTarget &&
          (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom)
        )
          close();
        outsidePointerRef.current = false;
      }}
    >
      {species && guide && (
        <>
          <header className="species-detail-header">
            <SpeciesIllustration key={image?.src ?? species.id} artwork={image} lang={lang} modal />
            <div className="species-detail-heading">
              <h2 id={headingId}>{name}</h2>
              {species.commonName?.[lang] && (
                <p>
                  <i>{species.scientificName}</i>
                </p>
              )}
              <p className="species-detail-muted">{copy.groups[species.group]}</p>
            </div>
            <button
              type="button"
              ref={closeRef}
              className="ui-button ui-button--quiet ui-button--icon"
              aria-label={copy.closeDetails}
              onClick={close}
            >
              <X aria-hidden="true" size={20} />
            </button>
          </header>

          <div className="species-detail-tabs" role="tablist" aria-label={copy.detailsTabs} onKeyDown={navigateTabs}>
            {(["fishing", "overview"] as const).map((name, index) => (
              <button
                type="button"
                key={name}
                ref={(element) => {
                  tabsRef.current[index] = element;
                }}
                id={`${id}-tab-${name}`}
                role="tab"
                aria-selected={activeTab === name}
                aria-controls={`${id}-panel-${name}`}
                tabIndex={activeTab === name ? 0 : -1}
                className="ui-button ui-button--quiet species-detail-tab"
                onClick={() => selectTab(name)}
              >
                {name === "fishing" ? copy.fishingGuide : copy.aboutSpecies}
              </button>
            ))}
          </div>

          <div className="species-detail-body">
            <section
              id={`${id}-panel-fishing`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-fishing`}
              hidden={activeTab !== "fishing"}
            >
              <div className="species-guide-review" data-status={guide.status}>
                {guide.status === "restricted" ? (
                  <ShieldAlert aria-hidden="true" size={18} />
                ) : (
                  <Info aria-hidden="true" size={18} />
                )}
                <div>
                  <strong>{copy.guideStates[guide.status]}</strong>
                  <p>{guide.notice[lang]}</p>
                </div>
              </div>
              {guide.restriction && <p className="species-guide-restriction">{guide.restriction[lang]}</p>}
              <dl className="species-guide-primary-fields">
                <div>
                  <dt>{copy.method}</dt>
                  <dd>{guideValue(guide, "method", lang, copy)}</dd>
                </div>
                <div>
                  <dt>{copy.bait}</dt>
                  <dd>{guideValue(guide, "bait", lang, copy)}</dd>
                </div>
              </dl>
              <section className="species-guide-section">
                <h3>{guide.status === "restricted" ? copy.whatToDo : copy.howToCatch}</h3>
                {hasReviewedSteps ? (
                  <ol>
                    {guide.steps.map((step) => (
                      <li key={`${species.id}:${step.en}`}>{step[lang]}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="species-detail-muted">
                    {guide.status === "not-applicable" || guide.status === "restricted"
                      ? copy.notApplicable
                      : copy.stepsUnavailable}
                  </p>
                )}
              </section>
              <details className="species-guide-disclosure">
                <summary>{copy.gearHandling}</summary>
                {extras.length ? (
                  <dl className="species-detail-fields">
                    {extras.map((field) => (
                      <div key={field}>
                        <dt>{copy[field]}</dt>
                        <dd>{guide[field]?.[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="species-detail-muted">{copy.reviewedFieldUnavailable}</p>
                )}
              </details>
              {guide.sources.length > 0 && (
                <details className="species-guide-disclosure">
                  <summary>{copy.references}</summary>
                  <ul className="species-detail-sources">
                    {guide.sources.map((source) => (
                      <li key={source.id}>
                        <EvidenceSource source={source} />
                        <p className="species-detail-muted">{source.citation}</p>
                      </li>
                    ))}
                  </ul>
                  {guide.reviewedOn && (
                    <p className="species-detail-muted">
                      {copy.reviewedOn}: {displayDate(guide.reviewedOn, lang, copy.dateUnknown)}
                    </p>
                  )}
                </details>
              )}
              <p className="species-guide-scope">{copy.rulesNotPermission}</p>
            </section>

            <section
              id={`${id}-panel-overview`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-overview`}
              hidden={activeTab !== "overview"}
            >
              <dl className="species-detail-fields">
                <div>
                  <dt>{copy.scientificName}</dt>
                  <dd>
                    {taxonomyUrl ? (
                      <a href={taxonomyUrl} target="_blank" rel="noopener noreferrer">
                        <i>{species.scientificName}</i>
                      </a>
                    ) : (
                      <i>{species.scientificName}</i>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{copy.selectedPlace}</dt>
                  <dd>{placeLabel}</dd>
                </div>
                <div>
                  <dt>{copy.speciesGroup}</dt>
                  <dd>{copy.groups[species.group]}</dd>
                </div>
                <div>
                  <dt>{copy.habitat}</dt>
                  <dd>
                    {species.waterTypes.length
                      ? species.waterTypes.map((type) => copy.waterTypes[type]).join(" · ")
                      : copy.habitatUnknown}
                  </dd>
                </div>
              </dl>
              <p className="species-detail-art-note">{image ? copy.artworkContext : copy.artUnavailableDescription}</p>
              <section className="species-evidence-list" aria-labelledby={`${id}-evidence-title`}>
                <h3 id={`${id}-evidence-title`}>{copy.evidenceHeading}</h3>
                {species.assertions.slice(0, 4).map((assertion) => (
                  <EvidenceRecord key={assertion.id} assertion={assertion} lang={lang} copy={copy} />
                ))}
                {species.assertions.length > 4 && (
                  <details className="species-guide-disclosure">
                    <summary>
                      {copy.evidenceHeading} ({species.assertions.length - 4})
                    </summary>
                    {species.assertions.slice(4).map((assertion) => (
                      <EvidenceRecord key={assertion.id} assertion={assertion} lang={lang} copy={copy} />
                    ))}
                  </details>
                )}
              </section>
            </section>
          </div>
          <footer className="species-detail-footer">
            <button type="button" className="ui-button ui-button--secondary" onClick={close}>
              <ArrowLeft aria-hidden="true" size={16} />
              {copy.backToSpecies}
            </button>
          </footer>
        </>
      )}
    </dialog>
  );
}
