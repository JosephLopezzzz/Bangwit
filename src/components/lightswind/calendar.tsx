"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { type ChevronProps, DayPicker, type DayButtonProps, type MonthProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

/*
 * Lightswind Calendar (lightswind.com/components/calendar), adapted for Bangwit:
 * - glassmorphism + heavy shadow replaced by the border-first card style from DESIGN.md
 * - colours come from Bangwit tokens via the shadcn aliases in globals.css (light + dark)
 * - custom slots are defined outside render so month/selection animations survive re-renders
 * - motion honours prefers-reduced-motion
 */

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type CalendarMotion = { direction: number; monthKey: string; layoutGroup: string };
const CalendarMotionContext = React.createContext<CalendarMotion>({ direction: 0, monthKey: "", layoutGroup: "" });

function CalendarChevron({ orientation, className }: ChevronProps) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.span whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="flex items-center justify-center">
      <Icon aria-hidden="true" className={cn("h-4 w-4", className)} />
    </motion.span>
  );
}

function CalendarMonth({ children, className, style }: MonthProps) {
  const { direction, monthKey } = React.useContext(CalendarMotionContext);
  return (
    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
      <motion.div
        key={monthKey}
        custom={direction}
        initial={{ opacity: 0, x: direction * 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -direction * 20, filter: "blur(4px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function CalendarDayButton({ day, modifiers, className, ...buttonProps }: DayButtonProps) {
  const { layoutGroup } = React.useContext(CalendarMotionContext);
  // Drag/animation handlers clash with motion.button's own gesture props.
  const {
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    onAnimationStart: _onAnimationStart,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    ...validProps
  } = buttonProps;
  const isRangeEdge = modifiers.range_start || modifiers.range_end;
  const isRange = isRangeEdge || modifiers.range_middle;
  const showSelection = modifiers.selected && !isRange;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {showSelection && (
        <motion.span
          aria-hidden="true"
          layoutId={`${layoutGroup}-selection`}
          className="absolute inset-0 rounded-full bg-primary shadow-sm"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      {isRangeEdge && <span aria-hidden="true" className="absolute inset-0 z-0 rounded-full bg-primary" />}
      <motion.button
        {...validProps}
        className={cn(
          className,
          "relative z-10 flex items-center justify-center overflow-visible",
          (showSelection || isRangeEdge) &&
            "text-primary-foreground hover:bg-transparent hover:text-primary-foreground",
          modifiers.range_middle && "font-medium text-accent-foreground",
        )}
        whileHover={!isRange && !modifiers.disabled ? { scale: 1.08 } : undefined}
        whileTap={!isRange && !modifiers.disabled ? { scale: 0.92 } : undefined}
      >
        {day.date.getDate()}
      </motion.button>
    </div>
  );
}

const navButton = cn(
  buttonVariants({ variant: "unstyled", size: "unstyled" }),
  "absolute top-1 z-20 h-8 w-8 rounded-full border border-border bg-background p-0 text-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-90 disabled:opacity-30",
);

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const layoutGroup = React.useId();
  const [direction, setDirection] = React.useState(0);
  const [month, setMonth] = React.useState<Date>(props.month || props.defaultMonth || new Date());

  // Follow external month changes (e.g. a "today" shortcut) while keeping internal navigation.
  const controlledMonth = props.month?.getTime();
  React.useEffect(() => {
    if (controlledMonth !== undefined) setMonth(new Date(controlledMonth));
  }, [controlledMonth]);

  const motionValue = React.useMemo(
    () => ({ direction, monthKey: `${month.getFullYear()}-${month.getMonth()}`, layoutGroup }),
    [direction, month, layoutGroup],
  );

  return (
    <MotionConfig reducedMotion="user">
      <CalendarMotionContext.Provider value={motionValue}>
        <DayPicker
          showOutsideDays={showOutsideDays}
          {...props}
          month={month}
          onMonthChange={(newMonth) => {
            setDirection(newMonth > month ? 1 : -1);
            setMonth(newMonth);
            props.onMonthChange?.(newMonth);
          }}
          className={cn("rounded-3xl border border-border bg-background p-4 text-foreground shadow-sm", className)}
          classNames={{
            months: "relative",
            month: "space-y-4",
            month_caption: "relative flex h-10 items-center justify-center pt-1",
            caption_label: "text-sm font-extrabold capitalize tracking-tight text-foreground",
            nav: "flex items-center",
            button_previous: cn(navButton, "left-1"),
            button_next: cn(navButton, "right-1"),
            month_grid: "w-full border-collapse",
            weekdays: "flex justify-between",
            weekday: "w-10 text-center text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground",
            week: "mt-1 flex w-full justify-between",
            day: "relative h-10 w-10 p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day_button: cn(
              buttonVariants({ variant: "unstyled", size: "unstyled" }),
              "h-10 w-10 rounded-full p-0 font-semibold text-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground",
            ),
            selected: "font-bold",
            today:
              "font-extrabold [&>div>button]:text-accent-foreground [&>div>button]:ring-1 [&>div>button]:ring-primary/60",
            outside: "opacity-45",
            disabled: "opacity-30 [&_button]:cursor-not-allowed [&_button]:hover:bg-transparent",
            range_start: "rounded-l-full",
            range_end: "rounded-r-full",
            range_middle: "rounded-none bg-accent",
            hidden: "invisible",
            ...classNames,
          }}
          components={{
            Chevron: CalendarChevron,
            Month: CalendarMonth,
            DayButton: CalendarDayButton,
            ...props.components,
          }}
        />
      </CalendarMotionContext.Provider>
    </MotionConfig>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
