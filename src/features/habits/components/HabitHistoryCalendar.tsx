import * as React from "react"
import { Calendar as CalendarPrimitive, CalendarCell, CalendarGrid, CalendarGridBody } from "react-aria-components"
import { CalendarHeader, CalendarGridHeader as SharedCalendarGridHeader } from "../../../shared/components/ui/calendar"
import { cn } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { HabitLog } from "../../../shared/types/HabitLog.types"
import type { Habit } from "../types/habit.types"

interface HabitHistoryCalendarProps {
  habit: Habit
  logs: HabitLog[]
}

export function HabitHistoryCalendar({ habit, logs }: HabitHistoryCalendarProps) {
  const now = today(getLocalTimeZone())
  
  // Create a set of completed dates for quick lookup
  const completedDates = React.useMemo(() => {
    const set = new Set<string>()
    logs.forEach(log => {
      if (log.habitId === habit.id) {
         if (habit.type === 'quantitative') {
             if ((log.value || 0) >= (habit.target || 1)) {
                 set.add(log.date)
             }
         } else {
             if (log.completed) {
                 set.add(log.date)
             }
         }
      }
    })
    return set
  }, [logs, habit])

  return (
    <div className="border rounded-md p-3 w-fit bg-card text-card-foreground shadow-sm">
      <CalendarPrimitive aria-label={`History for ${habit.name}`} className="w-fit">
        <CalendarHeader />
        <CalendarGrid>
          <SharedCalendarGridHeader />
          <CalendarGridBody>
            {(date) => (
               <CalendarCell
                  date={date}
                  className={({ isDisabled }) => {
                      const dateStr = date.toString()
                      const isCompleted = completedDates.has(dateStr)
                      const isToday = date.compare(now) === 0
                      
                      return cn(
                        "w-8 h-8 flex items-center justify-center rounded-full text-xs cursor-default outline-none transition-colors m-0.5",
                        isToday && "border border-primary text-primary",
                        isCompleted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted text-muted-foreground",
                        isDisabled && "text-muted-foreground/50 opacity-50"
                      )
                  }}
               />
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </CalendarPrimitive>
    </div>
  )
}
