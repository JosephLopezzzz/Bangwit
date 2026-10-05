"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Calendar } from "@/components/lightswind/calendar";

type CatchDatePickerProps = {
  value: string; // ISO date format "YYYY-MM-DD"
  onChange: (value: string) => void;
  lang?: "fil" | "en";
  disabled?: boolean;
};

// Converts local YYYY-MM-DD string to Date object at noon (to prevent timezone offset shifting)
function parseDateString(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day, 12, 0, 0);
}

// Converts Date to local YYYY-MM-DD string
function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CatchDatePicker({ value, onChange, lang = "fil", disabled = false }: CatchDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const selectedDate = parseDateString(value);
  const today = new Date();

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayDate = value
    ? new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(parseDateString(value))
    : lang === "fil"
      ? "Pumili ng petsa"
      : "Select date";

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(toDateString(date));
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleToday = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    onChange(local);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative mt-2 flex min-w-0 items-center gap-2">
      {/* Hidden input to maintain FormData ("date") compatibility */}
      <input type="hidden" name="date" value={value} required />

      <button
        ref={triggerRef}
        type="button"
        id="catchDateTrigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-12 min-w-0 flex-1 items-center justify-between rounded-xl border border-line bg-white px-3.5 text-left text-sm font-medium text-ink transition-colors hover:border-teal/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value ? "text-ink font-semibold" : "text-muted"}>{displayDate}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2 h-4 w-4 shrink-0 text-teal"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleToday}
        className="min-h-12 shrink-0 rounded-xl bg-teal-soft px-3.5 text-sm font-bold text-teal-dark transition-colors hover:bg-[#cdebe6]"
      >
        {lang === "fil" ? "Ngayon" : "Today"}
      </button>

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={lang === "fil" ? "Kalendaryo ng petsa ng huli" : "Catch date calendar"}
          className="absolute left-0 top-full z-50 mt-2 w-auto min-w-[280px] max-w-[calc(100vw-2rem)] rounded-3xl border border-line bg-white p-2 shadow-xl"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate || today}
            disabled={{ after: today }}
            className="border-0 shadow-none p-2"
          />
        </div>
      )}
    </div>
  );
}
