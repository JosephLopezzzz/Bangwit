"use client";

import { ArrowLeft, ArrowRight, Expand, Images, Waves, X } from "lucide-react";
import Image from "next/image";
import { type PointerEvent, useEffect, useId, useRef, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { usePhotoUrl } from "@/hooks/use-photo-url";
import "./photo-viewer.css";

export type PhotoItem = {
  id: number | string;
  photo: Blob;
  title: string;
  date?: string;
};

type PhotoThumbnailProps = {
  photo: Blob | null;
  altText: string;
  onView: () => void;
  className?: string;
  photoCount?: number;
  fit?: "cover" | "contain";
};

export function PhotoThumbnail({
  photo,
  altText,
  onView,
  className,
  photoCount = 1,
  fit = "cover",
}: PhotoThumbnailProps) {
  const { dict } = useBangwit();
  const url = usePhotoUrl(photo);
  const classes = `bangwit-photo-thumbnail ${className || "bangwit-photo-thumbnail--default"}`;

  if (!photo) {
    return (
      <div className={`${classes} bangwit-photo-placeholder`}>
        <Waves aria-hidden="true" size={30} strokeWidth={1.75} />
        <span>{dict.photos.noPhoto}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onView}
      aria-haspopup="dialog"
      aria-label={`${dict.photos.viewFull}: ${altText}`}
    >
      {url && (
        <Image
          src={url}
          alt={altText}
          fill
          sizes="(max-width: 767px) 100vw, 60vw"
          unoptimized
          draggable={false}
          className="bangwit-photo-thumbnail-image"
          style={{ objectFit: fit }}
        />
      )}
      {photoCount > 1 && (
        <span className="bangwit-photo-count" aria-hidden="true">
          <Images size={15} />
          {photoCount}
        </span>
      )}
      <span className="bangwit-photo-view-hint" aria-hidden="true">
        <Expand size={16} />
        {dict.photos.viewFull}
      </span>
    </button>
  );
}

type PhotoViewerProps = {
  photos: PhotoItem[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
};

export function PhotoViewer({ photos, initialIndex = 0, open, onClose }: PhotoViewerProps) {
  const { dict, lang } = useBangwit();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const descriptionId = useId();
  const activeIndex = Math.max(0, Math.min(index, photos.length - 1));
  const current = photos[activeIndex];
  const url = usePhotoUrl(open ? (current?.photo ?? null) : null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setIndex(Math.max(0, Math.min(initialIndex, photos.length - 1)));
      dialog.showModal();
      closeButtonRef.current?.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialIndex, photos.length]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const move = (direction: number) => {
    setIndex(Math.max(0, Math.min(activeIndex + direction, photos.length - 1)));
  };

  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (Math.abs(distanceX) >= 60 && Math.abs(distanceY) < Math.abs(distanceX) * 0.6) {
      move(distanceX > 0 ? -1 : 1);
    }
  };

  const date = current?.date;
  const parsedDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00`) : null;
  const displayDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(parsedDate)
      : date;

  return (
    <dialog
      ref={dialogRef}
      className="bangwit-photo-viewer"
      aria-label={dict.photos.viewerLabel}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onClose={() => {
        pointerRef.current = null;
        onClose();
        const trigger = triggerRef.current;
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          event.stopPropagation();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <header className="bangwit-photo-viewer-header">
        <div>
          <h2>{current?.title || dict.photos.noPhoto}</h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className="bangwit-photo-viewer-button"
          aria-label={dict.common.close}
          title={dict.common.close}
          onClick={() => dialogRef.current?.close()}
        >
          <X aria-hidden="true" size={22} />
        </button>
      </header>
      <div
        className="bangwit-photo-viewer-stage"
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={finishSwipe}
        onPointerCancel={() => {
          pointerRef.current = null;
        }}
      >
        {url ? (
          <Image
            key={current.id}
            src={url}
            alt={current.title}
            fill
            sizes="100vw"
            unoptimized
            draggable={false}
            className="bangwit-photo-viewer-image"
          />
        ) : (
          <div className="bangwit-photo-placeholder">
            <Waves aria-hidden="true" size={36} strokeWidth={1.75} />
            {!current && <span>{dict.photos.noPhoto}</span>}
          </div>
        )}
      </div>
      <footer className="bangwit-photo-viewer-footer">
        <button
          type="button"
          className="bangwit-photo-viewer-button"
          disabled={activeIndex === 0 || photos.length < 2}
          onClick={() => move(-1)}
          aria-label={dict.photos.previous}
          title={dict.photos.previous}
        >
          <ArrowLeft aria-hidden="true" size={22} />
        </button>
        <div id={descriptionId} className="bangwit-photo-viewer-caption" aria-live="polite" aria-atomic="true">
          <strong>
            {photos.length ? activeIndex + 1 : 0} {dict.photos.of} {photos.length}
          </strong>
          {displayDate && (
            <span>
              {dict.photos.photoTaken}: {displayDate}
            </span>
          )}
        </div>
        <button
          type="button"
          className="bangwit-photo-viewer-button"
          disabled={activeIndex >= photos.length - 1 || photos.length < 2}
          onClick={() => move(1)}
          aria-label={dict.photos.next}
          title={dict.photos.next}
        >
          <ArrowRight aria-hidden="true" size={22} />
        </button>
      </footer>
    </dialog>
  );
}
