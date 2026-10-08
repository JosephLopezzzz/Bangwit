"use client";

import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { type CSSProperties, type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type DropdownOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type DropdownSelectProps = {
  id: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  name?: string;
  className?: string;
  initialFocus?: boolean;
  portal?: boolean;
  disabled?: boolean;
};

export function DropdownSelect({
  id,
  label,
  value,
  options,
  onValueChange,
  name,
  className = "",
  initialFocus = false,
  portal = false,
  disabled = false,
}: DropdownSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchTextRef = useRef("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({ position: "fixed", visibility: "hidden" });
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex];
  const listboxId = `${id}-options`;
  const activeOptionId = `${listboxId}-${activeIndex}`;

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node) && !popupRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    popupRef.current
      ?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  useLayoutEffect(() => {
    if (!isOpen || !portal) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const popup = popupRef.current;
      if (!trigger || !popup) return;
      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const margin = 8;
      const gap = 8;
      const width = Math.min(rect.width, Math.max(0, viewportWidth - margin * 2));
      popup.style.width = `${width}px`;
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const desiredHeight = Math.min(popup.scrollHeight, rootFontSize * 18, viewportHeight / 2);
      const below = Math.max(0, viewportTop + viewportHeight - margin - rect.bottom - gap);
      const above = Math.max(0, rect.top - gap - viewportTop - margin);
      const placeAbove = desiredHeight > below && (desiredHeight <= above || above > below);
      const maxHeight = Math.min(desiredHeight, placeAbove ? above : below);
      setPopupStyle({
        position: "fixed",
        visibility: "visible",
        zIndex: 80,
        width,
        maxHeight,
        marginTop: 0,
        left: Math.max(viewportLeft + margin, Math.min(rect.left, viewportLeft + viewportWidth - width - margin)),
        top: Math.max(
          viewportTop + margin,
          Math.min(
            placeAbove ? rect.top - gap - maxHeight : rect.bottom + gap,
            viewportTop + viewportHeight - margin - maxHeight,
          ),
        ),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, portal]);

  useEffect(
    () => () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    },
    [],
  );

  function openOptions(index = selectedIndex) {
    if (disabled) return;
    setActiveIndex(index);
    setIsOpen(true);
  }

  function chooseOption(option: DropdownOption, index: number) {
    if (disabled) return;
    onValueChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (!isOpen) {
        let initialIndex = selectedIndex;
        if (event.key === "Home") initialIndex = 0;
        else if (event.key === "ArrowUp" || event.key === "End") initialIndex = options.length - 1;
        openOptions(initialIndex);
        return;
      }

      setActiveIndex((current) => {
        if (event.key === "Home") return 0;
        if (event.key === "End") return options.length - 1;
        return (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) chooseOption(options[activeIndex], activeIndex);
      else openOptions();
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const nextSearch = `${searchTextRef.current}${event.key}`.trim().toLocaleLowerCase();
      searchTextRef.current = nextSearch;
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        searchTextRef.current = "";
      }, 600);

      const startAt = isOpen ? activeIndex + 1 : selectedIndex + 1;
      const matchIndex = [...options, ...options]
        .slice(startAt, startAt + options.length)
        .findIndex((option) => option.label.toLocaleLowerCase().startsWith(nextSearch));
      if (matchIndex !== -1) {
        const nextIndex = (startAt + matchIndex) % options.length;
        setActiveIndex(nextIndex);
        setIsOpen(true);
      }
    }
  }

  const SelectedIcon = selectedOption.icon;
  const popup = (
    <div
      ref={popupRef}
      id={listboxId}
      role="listbox"
      aria-label={label}
      className="dropdown-select-popup"
      hidden={!isOpen}
      style={portal ? popupStyle : undefined}
    >
      {options.map((option, index) => {
        const OptionIcon = option.icon;
        const selected = option.value === value;
        return (
          <div
            id={`${listboxId}-${index}`}
            key={option.value}
            role="option"
            tabIndex={-1}
            aria-selected={selected}
            data-option-index={index}
            data-active={index === activeIndex}
            className="dropdown-select-option"
            onPointerMove={() => setActiveIndex(index)}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => chooseOption(option, index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                chooseOption(option, index);
              }
            }}
          >
            <OptionIcon aria-hidden="true" className="dropdown-select-option-icon" />
            <span className="dropdown-select-option-label">{option.label}</span>
            {selected && <Check aria-hidden="true" className="dropdown-select-option-check" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={rootRef} className={`dropdown-select ${className}`.trim()}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={`${label}: ${selectedOption.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? activeOptionId : undefined}
        aria-autocomplete="none"
        data-initial-focus={initialFocus ? "" : undefined}
        className="dropdown-select-trigger"
        disabled={disabled}
        style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : openOptions())}
        onKeyDown={handleKeyDown}
      >
        <span className="dropdown-select-value">
          <SelectedIcon aria-hidden="true" className="dropdown-select-value-icon" />
          <span className="dropdown-select-value-label">{selectedOption.label}</span>
        </span>
        <ChevronDown aria-hidden="true" className="dropdown-select-chevron" />
      </button>
      {portal ? (isOpen ? createPortal(popup, document.body) : null) : popup}
    </div>
  );
}
