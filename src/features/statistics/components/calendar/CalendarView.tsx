import React from "react"
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar,
  type DateValue,
  type RangeValue,
} from "react-aria-components"
import {
  today,
  getLocalTimeZone,
  isWeekend,
  isSameDay,
} from "@internationalized/date"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  range: RangeValue<DateValue> | null
  onRangeChange: (range: RangeValue<DateValue>) => void
}

export const CalendarView = React.memo(({ range, onRangeChange }: CalendarViewProps) => {
  return (
    <div className="flex-1 p-6 bg-card">
      <RangeCalendar 
        aria-label="Calendar" 
        value={range} 
        onChange={onRangeChange}
        className="w-full"
      >
        <header className="flex items-center justify-center relative mb-6">
          <Button slot="previous" className="absolute left-0 p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Heading className="text-lg font-bold text-foreground" />
          <Button slot="next" className="absolute right-0 p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </header>

        <CalendarGrid className="w-full border-collapse">
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="text-xs font-medium text-muted-foreground pb-4 uppercase tracking-wider">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell date={date} className="w-10 h-10 p-0 relative outline-none cursor-default group">
                {({ isSelected, isSelectionStart, isSelectionEnd, isOutsideMonth }) => {
                   // Determine styling state
                   const isRangeMiddle = isSelected && !isSelectionStart && !isSelectionEnd;
                   const isStart = isSelectionStart;
                   const isEnd = isSelectionEnd;
                   const dayIsWeekend = isWeekend(date, "ru-RU");
                   const isToday = isSameDay(date, today(getLocalTimeZone()));
                   
                   return (
                    <div className="w-full h-full flex items-center justify-center relative">
                       {/* Background Band */}
                       {isSelected && (
                         <div className={cn(
                           "absolute inset-y-1.5 inset-x-0 bg-primary/20",
                           isStart && "left-1 rounded-l-full",
                           isEnd && "right-1 rounded-r-full"
                         )} />
                       )}
                       
                       {/* Text / Circle */}
                       <div className={cn(
                         "relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                         // Selected State (Start/End)
                         (isStart || isEnd) && "bg-primary text-primary-foreground shadow-sm",
                         // Middle Range
                         isRangeMiddle && "text-foreground",
                         // Today Indicator (Border)
                         isToday && !isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                         isToday && isSelected && !isStart && !isEnd && "ring-2 ring-accent ring-offset-2 ring-offset-primary/20",
                         isToday && (isStart || isEnd) && "ring-2 ring-white",
                         // Not Selected
                         !isSelected && !isOutsideMonth && dayIsWeekend && "text-primary",
                         !isSelected && !isOutsideMonth && !dayIsWeekend && "text-foreground",
                         // Outside Month
                         isOutsideMonth && "text-muted-foreground/50"
                       )}>
                         {date.day}
                       </div>
                    </div>
                   )
                }}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </RangeCalendar>
    </div>
  )
})
