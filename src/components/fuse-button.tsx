"use client";

// Adapted from the supplied React Bits FuseButton for deferred local log deletion.
import { Check, LoaderCircle, Trash2, Undo2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import "./fuse-button.css";

type FuseButtonProps = {
  label: string;
  undoLabel: string;
  doneLabel: string;
  committingLabel: string;
  pendingLabel: string;
  canceledLabel: string;
  failedLabel: string;
  ariaLabel: string;
  hint: string;
  onCommit: () => Promise<boolean>;
  onUndo?: () => void;
  onPendingChange?: (pending: boolean) => void;
  disabled?: boolean;
  className?: string;
  undoWindow?: number;
};

export function FuseButton({
  label,
  undoLabel,
  doneLabel,
  committingLabel,
  pendingLabel,
  canceledLabel,
  failedLabel,
  ariaLabel,
  hint,
  onCommit,
  onUndo,
  onPendingChange,
  disabled = false,
  className = "",
  undoWindow = 5000,
}: FuseButtonProps) {
  const [phase, setPhase] = useState<"idle" | "armed" | "committing" | "settled">("idle");
  const [seconds, setSeconds] = useState(Math.ceil(undoWindow / 1000));
  const [announcement, setAnnouncement] = useState("");
  const [instant, setInstant] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLButtonElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const rimRef = useRef<SVGRectElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const phaseRef = useRef(phase);
  const mountedRef = useRef(false);
  const pauseRef = useRef({ hover: false, hidden: false, canHoverPause: false });
  const keyboardRef = useRef(false);
  const restoreFocusRef = useRef(false);
  const callbacksRef = useRef({ onCommit, onUndo, onPendingChange, doneLabel, failedLabel });
  callbacksRef.current = { onCommit, onUndo, onPendingChange, doneLabel, failedLabel };
  const statusId = useId();

  function changePhase(next: typeof phase) {
    if (next === "committing" || next === "idle") {
      restoreFocusRef.current ||= Boolean(rootRef.current?.contains(document.activeElement));
    }
    phaseRef.current = next;
    setPhase(next);
    callbacksRef.current.onPendingChange?.(next === "armed" || next === "committing");
  }

  function syncPlayState() {
    const animation = animationRef.current;
    if (!animation) return;
    if (pauseRef.current.hover || pauseRef.current.hidden) animation.pause();
    else if (animation.playState === "paused") animation.play();
  }

  function cancel() {
    if (phaseRef.current !== "armed") return;
    const animation = animationRef.current;
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
    }
    animationRef.current = null;
    setInstant(keyboardRef.current);
    changePhase("idle");
    setAnnouncement(canceledLabel);
    callbacksRef.current.onUndo?.();
  }

  function arm() {
    if (disabled || phaseRef.current !== "idle" || !rimRef.current) return;
    pauseRef.current = { hover: false, hidden: document.hidden, canHoverPause: false };
    setSeconds(Math.ceil(undoWindow / 1000));
    setInstant(keyboardRef.current);
    setAnnouncement(pendingLabel);
    changePhase("armed");
    animationRef.current?.cancel();
    const animation = rimRef.current.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }], {
      duration: undoWindow,
      easing: "linear",
      fill: "forwards",
    });
    animationRef.current = animation;
    animation.onfinish = async () => {
      if (!mountedRef.current || phaseRef.current !== "armed") return;
      animation.onfinish = null;
      changePhase("committing");
      setAnnouncement(committingLabel);
      let committed = false;
      try {
        committed = await callbacksRef.current.onCommit();
      } catch {
        committed = false;
      }
      if (!mountedRef.current) return;
      changePhase(committed ? "settled" : "idle");
      setAnnouncement(committed ? callbacksRef.current.doneLabel : callbacksRef.current.failedLabel);
      keyboardRef.current = false;
    };
    syncPlayState();
  }

  useEffect(() => {
    mountedRef.current = true;
    const onVisibility = () => {
      pauseRef.current.hidden = document.hidden;
      const animation = animationRef.current;
      if (!animation || phaseRef.current !== "armed") return;
      if (pauseRef.current.hidden || pauseRef.current.hover) animation.pause();
      else if (animation.playState === "paused") animation.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", onVisibility);
      if (animationRef.current) animationRef.current.onfinish = null;
      animationRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    const inside = rootRef.current?.contains(document.activeElement);
    if (phase === "armed") {
      undoRef.current?.focus({ preventScroll: true });
      restoreFocusRef.current = false;
    } else if (phase === "idle") {
      if (inside || (restoreFocusRef.current && document.activeElement === document.body)) {
        idleRef.current?.focus({ preventScroll: true });
      }
      restoreFocusRef.current = false;
    }
    if (phase !== "armed") return;
    const interval = setInterval(() => {
      const elapsed = Number(animationRef.current?.currentTime) || 0;
      setSeconds(Math.max(1, Math.ceil((undoWindow - elapsed) / 1000)));
    }, 100);
    return () => clearInterval(interval);
  }, [phase, undoWindow]);

  return (
    <div
      ref={rootRef}
      className={`fuse-button ${className}`.trim()}
      data-phase={phase}
      data-instant={instant || undefined}
      onPointerDown={() => {
        keyboardRef.current = false;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || !pauseRef.current.canHoverPause) return;
        pauseRef.current.hover = true;
        syncPlayState();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        pauseRef.current.canHoverPause = true;
        pauseRef.current.hover = false;
        syncPlayState();
      }}
    >
      <button
        ref={idleRef}
        type="button"
        className="fuse-button-face fuse-button-idle"
        disabled={disabled || phase !== "idle"}
        inert={phase !== "idle"}
        aria-label={ariaLabel}
        title={hint}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") keyboardRef.current = true;
        }}
        onClick={arm}
      >
        <Trash2 aria-hidden="true" size={15} />
        <span>{label}</span>
      </button>
      <button
        ref={undoRef}
        type="button"
        className="fuse-button-face fuse-button-undo"
        inert={phase !== "armed"}
        aria-describedby={statusId}
        aria-keyshortcuts="Escape"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") keyboardRef.current = true;
          if (event.key === "Escape" && phaseRef.current === "armed") {
            event.preventDefault();
            event.stopPropagation();
            keyboardRef.current = true;
            cancel();
          }
        }}
        onClick={cancel}
      >
        <Undo2 aria-hidden="true" size={15} />
        <span>{undoLabel}</span>
        <span className="fuse-button-seconds" aria-hidden="true">
          {seconds}s
        </span>
      </button>
      <span className="fuse-button-face fuse-button-result" inert={phase !== "committing" && phase !== "settled"}>
        {phase === "settled" ? (
          <Check aria-hidden="true" size={15} />
        ) : (
          <LoaderCircle aria-hidden="true" size={15} className="fuse-button-spinner" />
        )}
        <span>{phase === "settled" ? doneLabel : committingLabel}</span>
      </span>
      <svg className="fuse-button-rim" aria-hidden="true">
        <rect ref={rimRef} pathLength="1" />
      </svg>
      <span id={statusId} className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
