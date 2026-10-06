"use client";

import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

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
}: DropdownSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchTextRef = useRef("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex];
  const listboxId = `${id}-options`;
  const activeOptionId = `${listboxId}-${activeIndex}`;

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  useEffect(
    () => () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    },
    [],
  );

  function openOptions(index = selectedIndex) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function chooseOption(option: DropdownOption, index: number) {
    onValueChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
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

  return (
    <div ref={rootRef} className={`dropdown-select ${className}`.trim()}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-valuetext={selectedOption.label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? activeOptionId : undefined}
        aria-autocomplete="none"
        data-initial-focus={initialFocus ? "" : undefined}
        className="dropdown-select-trigger"
        onClick={() => (isOpen ? setIsOpen(false) : openOptions())}
        onKeyDown={handleKeyDown}
      >
        <span className="dropdown-select-value">
          <SelectedIcon aria-hidden="true" className="dropdown-select-value-icon" />
          <span className="dropdown-select-value-label">{selectedOption.label}</span>
        </span>
        <ChevronDown aria-hidden="true" className="dropdown-select-chevron" />
      </button>
      <div id={listboxId} role="listbox" aria-label={label} className="dropdown-select-popup" hidden={!isOpen}>
        {options.map((option, index) => {
          const OptionIcon = option.icon;
          const selected = option.value === value;
          return (
            <div
              id={`${listboxId}-${index}`}
              key={option.value}
              role="option"
              aria-selected={selected}
              data-option-index={index}
              data-active={index === activeIndex}
              className="dropdown-select-option"
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => chooseOption(option, index)}
            >
              <OptionIcon aria-hidden="true" className="dropdown-select-option-icon" />
              <span className="dropdown-select-option-label">{option.label}</span>
              {selected && <Check aria-hidden="true" className="dropdown-select-option-check" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
