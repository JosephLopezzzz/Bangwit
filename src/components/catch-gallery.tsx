"use client";

import { animate, motion, type MotionValue, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Fish, LockKeyhole, NotebookPen, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { CatchDetails } from "@/components/catch-details";
import { DropdownSelect } from "@/components/dropdown-select";
import { FuseButton } from "@/components/fuse-button";
import { PhotoThumbnail, PhotoViewer } from "@/components/photo-viewer";
import { usePhotoUrl } from "@/hooks/use-photo-url";
import { getDispositionLabel, getHabitatLabel, getSpeciesDisplay } from "@/i18n/labels";
import type { CatchEntry } from "@/types/catch";
import "./catch-gallery.css";

type CatchGalleryProps = {
  entries: CatchEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (entry: CatchEntry) => Promise<boolean>;
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

function ArcCard({
  index,
  active,
  position,
  width,
  height,
  radius,
  angleStep,
  reducedMotion,
  label,
  children,
}: {
  index: number;
  active: boolean;
  position: MotionValue<number>;
  width: number;
  height: number;
  radius: number;
  angleStep: number;
  reducedMotion: boolean;
  label: string;
  children: ReactNode;
}) {
  // All cards share a pivot below the stage: rotating the position follows
  // the circle itself, including while dragging and snapping between catches.
  const angle = useTransform(position, (value) => (index - value) * angleStep);
  const x = useTransform(angle, (value) => radius * Math.sin(value));
  const y = useTransform(angle, (value) => radius * (1 - Math.cos(value)));
  const rotate = useTransform(angle, (value) => (value * 180) / Math.PI);
  const rotateY = useTransform(position, (value) => (reducedMotion ? 0 : (index - value) * -6));
  const z = useTransform(position, (value) => (reducedMotion ? 0 : -Math.abs(index - value) * 24));
  const zIndex = useTransform(position, (value) => 10 - Math.round(Math.abs(index - value) * 2));
  const opacity = useTransform(position, (value) => Math.max(0.45, 1 - Math.abs(index - value) * 0.18));

  return (
    <motion.div
      className={`catch-gallery-card ${active ? "catch-gallery-card-active" : "catch-gallery-card-side"}`}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        visibility: width ? "visible" : "hidden",
        x,
        y,
        rotate,
        rotateY,
        z,
        zIndex,
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
}

export function CatchGallery({ entries, selectedId, onSelect, onDelete, onAdd, loading }: CatchGalleryProps) {
  const { dict, lang } = useBangwit();
  const headingId = useId();
  const chooserId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; index: number; dragging: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [viewedId, setViewedId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const selectedIndex = entries.findIndex((entry) => entry.id === selectedId);
  const activeIndex = Math.max(0, selectedIndex);
  const position = useMotionValue(activeIndex);
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
    gesture.current = null;
    const animation = animate(position, activeIndex, {
      duration: reducedMotion ? 0 : 0.3,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => animation.stop();
  }, [activeIndex, position, reducedMotion]);

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
    position.stop();
    suppressClick.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, index: activeIndex, dragging: false };
  }

  function moveGesture(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (current.dragging) {
      event.preventDefault();
      if (!reducedMotion) {
        const next = Math.max(0, Math.min(entries.length - 1, current.index - dx / dragStep));
        position.set(Math.max(current.index - 0.9, Math.min(current.index + 0.9, next)));
      }
    }
  }

  function snapTo(index: number) {
    animate(position, index, { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] });
  }

  function finishGesture(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    suppressClick.current = current.dragging || Math.max(Math.abs(dx), Math.abs(dy)) > 8;
    const next =
      current.dragging && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)
        ? Math.max(0, Math.min(entries.length - 1, current.index + (dx < 0 ? 1 : -1)))
        : current.index;
    if (next !== current.index) selectAt(next);
    snapTo(next);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  // Reserve space for the fan inside the existing flexible stage, rather than
  // giving the template a fixed-height canvas or expanding the journal panel.
  const cardHeight = Math.max(0, stageSize.height * 0.8);
  const cardWidth = Math.max(0, Math.min(stageSize.width * 0.66, cardHeight * 1.6));
  const arcRadius = Math.max(cardHeight, stageSize.width * 0.52);
  const dragStep = Math.max(1, Math.min(stageSize.width * 0.24, cardWidth * 0.55));
  const angleStep = arcRadius ? Math.asin(Math.min(0.48, dragStep / arcRadius)) : 0;
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
                  snapTo(activeIndex);
                }}
                onLostPointerCapture={() => {
                  if (gesture.current) {
                    gesture.current = null;
                    suppressClick.current = true;
                    snapTo(activeIndex);
                  }
                }}
                onClickCapture={(event) => {
                  if (suppressClick.current) {
                    event.preventDefault();
                    event.stopPropagation();
                    suppressClick.current = false;
                  }
                }}
              >
                {entries.slice(Math.max(0, activeIndex - 2), activeIndex + 3).map((entry, visibleIndex) => {
                  const index = Math.max(0, activeIndex - 2) + visibleIndex;
                  const offset = index - activeIndex;
                  const title = getSpeciesDisplay(entry.species, lang);
                  return (
                    <ArcCard
                      key={entry.id}
                      index={index}
                      active={offset === 0}
                      position={position}
                      width={cardWidth}
                      height={cardHeight}
                      radius={arcRadius}
                      angleStep={angleStep}
                      reducedMotion={Boolean(reducedMotion)}
                      label={`${index + 1} ${dict.catches.journalOf} ${entries.length}: ${title}`}
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
                    </ArcCard>
                  );
                })}
              </div>

              <div className="catch-gallery-metadata">
                <div className="catch-gallery-title-row">
                  <h3 title={getSpeciesDisplay(active.species, lang)}>{getSpeciesDisplay(active.species, lang)}</h3>
                  <FuseButton
                    key={`${active.id}-${detailsId !== null}`}
                    label={dict.catches.deleteLog}
                    undoLabel={dict.catches.deleteUndo}
                    doneLabel={dict.catches.logDeleted}
                    committingLabel={dict.catches.deletingLog}
                    pendingLabel={dict.catches.deletePending}
                    canceledLabel={dict.catches.deleteCanceled}
                    failedLabel={dict.catches.deleteFailed}
                    ariaLabel={`${dict.catches.deleteCatchAria} ${getSpeciesDisplay(active.species, lang)}`}
                    hint={dict.catches.deleteFuseHint}
                    onCommit={async () => {
                      const focused = Boolean(document.activeElement?.closest(".fuse-button"));
                      const deleted = await onDelete(active);
                      if (deleted && focused)
                        requestAnimationFrame(() => {
                          if (document.activeElement === document.body)
                            sectionRef.current?.focus({ preventScroll: true });
                        });
                      return deleted;
                    }}
                  />
                </div>
                <p>
                  {formatDate(active.date)} · {getHabitatLabel(active.habitat, lang)}
                </p>
                <div className="catch-gallery-detail-row">
                  <span>{getDispositionLabel(active.disposition, lang)}</span>
                  <button type="button" onClick={() => setDetailsId(active.id ?? null)} aria-haspopup="dialog">
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
      <CatchDetails
        entries={entries}
        entryId={detailsId}
        onSelect={(id) => {
          setDetailsId(id);
          onSelect(id);
        }}
        onClose={() => setDetailsId(null)}
        formatDate={formatDate}
      />
    </>
  );
}
