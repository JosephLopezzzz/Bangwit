"use client";

import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, LockKeyhole, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { PhotoThumbnail } from "@/components/photo-viewer";
import { usePhotoUrl } from "@/hooks/use-photo-url";
import { getDispositionLabel, getHabitatLabel, getSpeciesDisplay } from "@/i18n/labels";
import type { CatchEntry } from "@/types/catch";
import "./catch-details.css";

export function CatchDetails({
  entries,
  entryId,
  onSelect,
  onClose,
  formatDate,
}: {
  entries: CatchEntry[];
  entryId: number | null;
  onSelect: (id: number) => void;
  onClose: () => void;
  formatDate: (date: string) => string;
}) {
  const { dict, lang } = useBangwit();
  const index = entries.findIndex((entry) => entry.id === entryId);
  const entry = entries[index];
  const open = Boolean(entry);
  const title = getSpeciesDisplay(entry?.species, lang);
  const url = usePhotoUrl(entry?.photo ?? null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [moreBelow, setMoreBelow] = useState(false);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      closeRef.current?.focus({ preventScroll: true });
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open || expanded || entryId === null) return;
    const body = bodyRef.current;
    const content = contentRef.current;
    if (!body || !content) return;
    body.scrollTop = 0;
    const update = () => setMoreBelow(body.scrollHeight - body.clientHeight - body.scrollTop > 4);
    const observer = new ResizeObserver(update);
    observer.observe(body);
    observer.observe(content);
    body.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      body.removeEventListener("scroll", update);
    };
  }, [open, expanded, entryId]);

  function move(direction: number) {
    const id = entries[index + direction]?.id;
    if (id != null) onSelect(id);
  }

  function returnToDetails() {
    setExpanded(false);
    requestAnimationFrame(() => photoRef.current?.querySelector("button")?.focus({ preventScroll: true }));
  }

  const fields = entry
    ? [
        [dict.catches.habitatLegend, getHabitatLabel(entry.habitat, lang)],
        [dict.catches.locationLabel, entry.location],
        [dict.catches.lengthLabel, entry.length ? `${entry.length} ${entry.lengthUnit ?? "cm"}` : ""],
        [dict.catches.weightLabel, entry.weight ? `${entry.weight} ${entry.weightUnit ?? "g"}` : ""],
        [dict.catches.baitLabel, entry.bait],
      ].filter(([, value]) => value?.trim())
    : [];
  const hasOptional =
    entry && [entry.location, entry.length, entry.weight, entry.bait, entry.notes].some((value) => value.trim());

  return (
    <dialog
      ref={dialogRef}
      className="catch-details"
      data-expanded={expanded || undefined}
      aria-labelledby={headingId}
      onCancel={(event) => {
        if (expanded) {
          event.preventDefault();
          returnToDetails();
        }
      }}
      onClose={() => {
        setExpanded(false);
        onClose();
        if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = Array.from(
            dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [],
          ).filter((button) => button.getClientRects().length > 0);
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first && last) {
            event.preventDefault();
            last.focus({ preventScroll: true });
          } else if (!event.shiftKey && document.activeElement === last && first) {
            event.preventDefault();
            first.focus({ preventScroll: true });
          }
          return;
        }
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || expanded) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          event.stopPropagation();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <header className="catch-details-header">
        <div>
          <h2 id={headingId}>{title}</h2>
          {entry && (
            <p>
              {formatDate(entry.date)} <span>·</span> {getDispositionLabel(entry.disposition, lang)}
            </p>
          )}
        </div>
        <button
          ref={closeRef}
          type="button"
          className="catch-details-icon"
          onClick={() => dialogRef.current?.close()}
          aria-label={dict.catches.journalCloseDetails}
        >
          <X size={21} aria-hidden="true" />
        </button>
      </header>
      {entry &&
        (expanded ? (
          <div className="catch-details-expanded">
            <button ref={backRef} type="button" className="catch-details-back" onClick={returnToDetails}>
              <ArrowLeft size={17} aria-hidden="true" />
              {dict.catches.detailsBack}
            </button>
            <div className="catch-details-full-photo">
              {url && <Image src={url} alt={title} fill unoptimized sizes="95vw" style={{ objectFit: "contain" }} />}
            </div>
          </div>
        ) : (
          <div ref={bodyRef} className="catch-details-body">
            <div ref={contentRef} className="catch-details-content">
              <div ref={photoRef} className="catch-details-photo">
                <PhotoThumbnail
                  photo={entry.photo}
                  altText={title}
                  fit="contain"
                  opensDialog={false}
                  className="catch-details-thumbnail"
                  onView={() => {
                    setExpanded(true);
                    requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }));
                  }}
                />
              </div>
              <div className="catch-details-information">
                <dl>
                  {fields.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                {entry.notes.trim() && (
                  <section className="catch-details-notes">
                    <h3>{dict.catches.notesLabel}</h3>
                    <p>{entry.notes}</p>
                  </section>
                )}
                {!hasOptional && <p className="catch-details-empty">{dict.catches.detailsNoOptional}</p>}
              </div>
            </div>
          </div>
        ))}
      <footer className="catch-details-footer">
        {!expanded && (
          <>
            <div className="catch-details-pagination">
              <button
                type="button"
                className="catch-details-icon"
                disabled={index <= 0}
                aria-label={dict.catches.journalPrevious}
                onClick={() => move(-1)}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span role="status" aria-live="polite" aria-atomic="true">
                {index + 1} {dict.catches.journalOf} {entries.length} {dict.catches.catchesCount}
              </span>
              <button
                type="button"
                className="catch-details-icon"
                disabled={index >= entries.length - 1}
                aria-label={dict.catches.journalNext}
                onClick={() => move(1)}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            {moreBelow && (
              <button
                type="button"
                className="catch-details-more"
                onClick={() => bodyRef.current?.scrollBy({ top: 180, behavior: "instant" })}
              >
                <ChevronDown size={15} aria-hidden="true" />
                {dict.catches.detailsMoreBelow}
              </button>
            )}
          </>
        )}
        <p className="catch-details-private">
          <LockKeyhole size={14} aria-hidden="true" />
          {dict.common.offlineSaved}
        </p>
      </footer>
    </dialog>
  );
}
