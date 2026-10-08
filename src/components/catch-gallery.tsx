"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Fish, LockKeyhole, NotebookPen, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type KeyboardEvent, type PointerEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import { PhotoThumbnail, PhotoViewer } from "@/components/photo-viewer";
import { usePhotoUrl } from "@/hooks/use-photo-url";
import { getDispositionLabel, getHabitatLabel, getSpeciesDisplay } from "@/i18n/labels";
import type { CatchEntry } from "@/types/catch";
import "./catch-gallery.css";

type CatchGalleryProps = {
  entries: CatchEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (entry: CatchEntry) => void;
  onAdd: () => void;
  loading: boolean;
};

function GalleryPreview({ entry, title, noPhoto }: { entry: CatchEntry; title: string; noPhoto: string }) {
  const url = usePhotoUrl(entry.photo);
  return url ? (
    <Image
      src={url}
      alt={title}
      fill
      unoptimized
      sizes="(max-width: 767px) 65vw, 35vw"
      draggable={false}
      className="catch-gallery-preview-image"
    />
  ) : (
    <span className="catch-gallery-no-photo">
      <Fish aria-hidden="true" size={40} strokeWidth={1.5} />
      <span>{noPhoto}</span>
    </span>
  );
}

export function CatchGallery({ entries, selectedId, onSelect, onDelete, onAdd, loading }: CatchGalleryProps) {
  const { dict, lang } = useBangwit();
  const headingId = useId();
  const detailsHeadingId = useId();
  const chooserId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; index: number; dragging: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [viewedId, setViewedId] = useState<number | null>(null);
  const [detailsEntry, setDetailsEntry] = useState<CatchEntry | null>(null);
  const reducedMotion = useReducedMotion();
  const selectedIndex = entries.findIndex((entry) => entry.id === selectedId);
  const activeIndex = Math.max(0, selectedIndex);
  const active = entries[activeIndex];
  const hasEntries = Boolean(active);
  const photos = useMemo(
    () =>
      entries.flatMap((entry) =>
        entry.photo && entry.id != null
          ? [
              {
                id: entry.id,
                photo: entry.photo,
                title: getSpeciesDisplay(entry.species, lang),
                date: entry.date,
              },
            ]
          : [],
      ),
    [entries, lang],
  );
  const viewedIndex = photos.findIndex((photo) => photo.id === viewedId);
  const chooserOptions = useMemo(
    () =>
      entries.flatMap((entry, index) =>
        entry.id != null
          ? [
              {
                value: String(entry.id),
                label: `${index + 1}. ${getSpeciesDisplay(entry.species, lang)}${entry.date ? ` · ${entry.date}` : ""}`,
                icon: entry.photo ? Fish : NotebookPen,
              },
            ]
          : [],
      ),
    [entries, lang],
  );

  useEffect(() => {
    if (loading || !hasEntries) return;
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([measurement]) => {
      setStageSize({ width: measurement.contentRect.width, height: measurement.contentRect.height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [loading, hasEntries]);

  useEffect(() => {
    if (!detailsEntry) return;
    const dialog = detailsRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  }, [detailsEntry]);

  function formatDate(date: string) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!date || Number.isNaN(parsed.getTime())) return dict.catches.dateNotRecorded;
    return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }

  function selectAt(index: number) {
    const id = entries[index]?.id;
    if (id != null && index >= 0 && index < entries.length) {
      if (
        document.activeElement?.closest(".catch-gallery-card") ||
        ((index === 0 || index === entries.length - 1) && document.activeElement?.matches(".catch-gallery-arrow"))
      ) {
        sectionRef.current?.focus({ preventScroll: true });
      }
      onSelect(id);
    }
  }

  function handleKeyboard(event: KeyboardEvent<HTMLElement>) {
    suppressClick.current = false;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (
      event.target instanceof Element &&
      event.target.closest("input, textarea, select, [contenteditable=true], [role=combobox], [role=listbox]")
    )
      return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (event.key === "Home") selectAt(0);
      else if (event.key === "End") selectAt(entries.length - 1);
      else selectAt(activeIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  }

  function startGesture(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, index: activeIndex, dragging: false };
  }

  function moveGesture(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  }

  function finishGesture(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    suppressClick.current = current.dragging;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (current.dragging && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy))
      selectAt(current.index + (dx < 0 ? 1 : -1));
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const cardWidth = Math.max(0, Math.min(stageSize.width * 0.72, stageSize.height * 1.6));
  const cardHeight = Math.max(0, stageSize.height - 12);
  const counter = `${activeIndex + 1} ${dict.catches.journalOf} ${entries.length}`;

  return (
    <>
      <section
        ref={sectionRef}
        tabIndex={-1}
        className="catch-gallery"
        aria-labelledby={headingId}
        aria-roledescription="carousel"
        onKeyDown={handleKeyboard}
      >
        <header className="catch-gallery-header">
          <h2 id={headingId}>{dict.catches.journalHeading}</h2>
          <span className="catch-gallery-count">
            {entries.length} {dict.catches.catchesCount}
          </span>
        </header>

        {loading ? (
          <div className="catch-gallery-loading" role="status">
            {dict.catches.loadingJournal}
          </div>
        ) : !active ? (
          <div className="catch-gallery-empty">
            <div className="catch-gallery-empty-art">
              <Image src="/assets/bilog-idle-blink-slow-right.gif" alt="" width={140} height={140} unoptimized />
            </div>
            <h3>{dict.catches.emptyTitle}</h3>
            <p>{dict.catches.emptyDesc}</p>
            <button type="button" onClick={onAdd} className="catch-gallery-add">
              <Plus size={17} aria-hidden="true" />
              {dict.catches.logCatchTab}
            </button>
            <p className="catch-gallery-private">
              <LockKeyhole size={14} aria-hidden="true" />
              {dict.catches.emptyPrivacyNote}
            </p>
          </div>
        ) : (
          <>
            <div className="catch-gallery-content">
              <div
                ref={stageRef}
                className="catch-gallery-stage"
                onPointerDown={startGesture}
                onPointerMove={moveGesture}
                onPointerUp={finishGesture}
                onPointerCancel={() => {
                  gesture.current = null;
                  suppressClick.current = true;
                }}
                onClickCapture={(event) => {
                  if (suppressClick.current) {
                    event.preventDefault();
                    event.stopPropagation();
                    suppressClick.current = false;
                  }
                }}
              >
                {entries.slice(Math.max(0, activeIndex - 2), activeIndex + 3).map((entry) => {
                  const index = entries.indexOf(entry);
                  const offset = index - activeIndex;
                  const title = getSpeciesDisplay(entry.species, lang);
                  return (
                    <motion.div
                      key={entry.id}
                      className={`catch-gallery-card ${offset === 0 ? "catch-gallery-card-active" : "catch-gallery-card-side"}`}
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        marginLeft: -cardWidth / 2,
                        marginTop: -cardHeight / 2,
                        zIndex: 5 - Math.abs(offset),
                        visibility: stageSize.width ? "visible" : "hidden",
                      }}
                      initial={false}
                      animate={{
                        x: offset * stageSize.width * 0.27,
                        y: Math.abs(offset) * 5,
                        rotateY: reducedMotion ? 0 : offset * -9,
                        z: reducedMotion ? 0 : -Math.abs(offset) * 35,
                        scale: 1 - Math.abs(offset) * 0.08,
                        opacity: Math.abs(offset) === 2 ? 0.55 : 1,
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {offset === 0 ? (
                        <PhotoThumbnail
                          photo={entry.photo}
                          altText={title}
                          fit="contain"
                          onView={() => {
                            if (entry.id != null) setViewedId(entry.id);
                          }}
                          className="catch-gallery-active-photo"
                        />
                      ) : (
                        <button
                          type="button"
                          className="catch-gallery-side-select"
                          onClick={() => selectAt(index)}
                          tabIndex={-1}
                          aria-label={`${dict.catches.journalChoose}: ${title}`}
                        >
                          <GalleryPreview entry={entry} title={title} noPhoto={dict.catches.journalNoPhoto} />
                          <span className="catch-gallery-side-caption">{title}</span>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="catch-gallery-metadata">
                <div className="catch-gallery-title-row">
                  <h3 title={getSpeciesDisplay(active.species, lang)}>{getSpeciesDisplay(active.species, lang)}</h3>
                  <button
                    type="button"
                    className="catch-gallery-delete"
                    onClick={() => onDelete(active)}
                    aria-label={`${dict.catches.deleteCatchAria} ${getSpeciesDisplay(active.species, lang)}`}
                  >
                    <Trash2 aria-hidden="true" size={15} />
                    <span>{dict.common.delete}</span>
                  </button>
                </div>
                <p>
                  {formatDate(active.date)} · {getHabitatLabel(active.habitat, lang)}
                </p>
                <div className="catch-gallery-detail-row">
                  <span>{getDispositionLabel(active.disposition, lang)}</span>
                  <button type="button" onClick={() => setDetailsEntry(active)} aria-haspopup="dialog">
                    {dict.catches.journalViewDetails}
                    <ArrowRight aria-hidden="true" size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="catch-gallery-navigation">
              <button
                type="button"
                className="catch-gallery-arrow"
                disabled={activeIndex === 0}
                onClick={() => selectAt(activeIndex - 1)}
                aria-label={dict.catches.journalPrevious}
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <div className="catch-gallery-position" aria-live="polite" aria-atomic="true">
                <strong>
                  {counter} {dict.catches.catchesCount}
                </strong>
                <span>
                  {activeIndex === 0
                    ? dict.catches.journalStart
                    : activeIndex === entries.length - 1
                      ? dict.catches.journalEnd
                      : ""}
                </span>
              </div>
              <button
                type="button"
                className="catch-gallery-arrow"
                disabled={activeIndex === entries.length - 1}
                onClick={() => selectAt(activeIndex + 1)}
                aria-label={dict.catches.journalNext}
              >
                <ChevronRight aria-hidden="true" size={20} />
              </button>
            </div>
          </>
        )}

        <footer className="catch-gallery-footer">
          <Link href="/my-species">
            {dict.catches.viewMySpecies}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
          {!loading && entries.length > 7 && (
            <DropdownSelect
              portal
              id={chooserId}
              label={dict.catches.journalChoose}
              value={String(active?.id)}
              options={chooserOptions}
              onValueChange={(value) => onSelect(Number(value))}
              className="catch-gallery-chooser"
            />
          )}
          {!loading && entries.length > 1 && entries.length <= 7 && (
            <fieldset className="catch-gallery-dots">
              <legend className="sr-only">{dict.catches.journalChoose}</legend>
              {entries.map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  aria-label={`${index + 1} ${dict.catches.journalOf} ${entries.length}: ${getSpeciesDisplay(entry.species, lang)}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => selectAt(index)}
                >
                  <span />
                </button>
              ))}
            </fieldset>
          )}
        </footer>
      </section>

      <PhotoViewer
        photos={photos}
        initialIndex={Math.max(0, viewedIndex)}
        open={viewedId != null && viewedIndex !== -1}
        onClose={() => setViewedId(null)}
      />
      <dialog
        ref={detailsRef}
        className="catch-gallery-details"
        aria-labelledby={detailsHeadingId}
        onClose={() => setDetailsEntry(null)}
      >
        <header>
          <h2 id={detailsHeadingId}>{getSpeciesDisplay(detailsEntry?.species, lang)}</h2>
          <button
            type="button"
            onClick={() => detailsRef.current?.close()}
            aria-label={dict.catches.journalCloseDetails}
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>
        {detailsEntry && (
          <div className="catch-gallery-details-body">
            <dl>
              {[
                [dict.catches.dateLabel, formatDate(detailsEntry.date)],
                [dict.catches.habitatLegend, getHabitatLabel(detailsEntry.habitat, lang)],
                [dict.catches.dispositionLabel, getDispositionLabel(detailsEntry.disposition, lang)],
                [dict.catches.locationLabel, detailsEntry.location],
                [dict.catches.lengthLabel, detailsEntry.length],
                [dict.catches.weightLabel, detailsEntry.weight],
                [dict.catches.baitLabel, detailsEntry.bait],
                [dict.catches.notesLabel, detailsEntry.notes],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
            <p className="catch-gallery-private">
              <LockKeyhole size={14} aria-hidden="true" />
              {dict.common.offlineSaved}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
