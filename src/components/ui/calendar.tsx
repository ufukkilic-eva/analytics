import { ComponentProps } from "react"
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left"
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 pb-2 relative items-center w-full",
        caption_label: "text-sm font-semibold" + " text-text-primary",
        nav: "flex items-center gap-1",
        nav_button: cn(
          "size-8 bg-transparent p-0 inline-flex items-center justify-center rounded-md transition-all",
          "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex w-full mb-1",
        head_cell: "text-text-muted rounded-md w-10 font-semibold text-xs uppercase tracking-wider",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          "size-10 p-0 font-medium aria-selected:opacity-100 inline-flex items-center justify-center rounded-md transition-all",
          "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-brand-blue text-white hover:bg-brand-blue-hover hover:text-white focus:bg-brand-blue focus:text-white font-semibold",
        day_today: "bg-bg-tertiary text-text-primary font-semibold ring-1 ring-brand-blue ring-opacity-40",
        day_outside: "day-outside text-text-muted opacity-40",
        day_disabled: "text-text-muted opacity-20 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-brand-blue/20 aria-selected:text-text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        NextMonthButton: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
