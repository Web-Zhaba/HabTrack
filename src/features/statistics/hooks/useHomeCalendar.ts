import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  today,
  getLocalTimeZone,
  parseDate,
  type CalendarDate,
} from "@internationalized/date"
import type { DateValue, RangeValue } from "react-aria-components"
import {
  setSelectedRange,
  selectSelectedRange,
} from "../store/habitLogsSlice"

function formatKeyFromCalendarDate(date: CalendarDate): string {
  const y = date.year
  const m = String(date.month).padStart(2, "0")
  const d = String(date.day).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export const useHomeCalendar = () => {
  const dispatch = useDispatch()
  const reduxSelectedRange = useSelector(selectSelectedRange)
  
  const [range, setRange] = useState<RangeValue<DateValue> | null>(() => {
      // Lazy initialization from Redux state
      if (reduxSelectedRange) {
          try {
              return {
                  start: parseDate(reduxSelectedRange.start),
                  end: parseDate(reduxSelectedRange.end),
              }
          } catch {
              const now = today(getLocalTimeZone())
              return { start: now, end: now }
          }
      }
      const now = today(getLocalTimeZone())
      return { start: now, end: now }
  })
  
  const [preset, setPreset] = useState<string>("Custom")

  // Sync from Redux if it changes externally
  useEffect(() => {
    if (reduxSelectedRange) {
      try {
        const start = parseDate(reduxSelectedRange.start)
        const end = parseDate(reduxSelectedRange.end)
        
        // Only update if different to avoid loop/re-render
        setRange(prev => {
            if (prev?.start.compare(start) === 0 && prev?.end.compare(end) === 0) {
                return prev
            }
            return { start, end }
        })
      } catch (e) {
        // ignore invalid dates
      }
    }
  }, [reduxSelectedRange])

  const handleApply = useCallback(() => {
    if (range && range.start && range.end) {
      dispatch(
        setSelectedRange({
          start: formatKeyFromCalendarDate(range.start as CalendarDate),
          end: formatKeyFromCalendarDate(range.end as CalendarDate),
        })
      )
    }
  }, [dispatch, range])

  const handleRangeChange = useCallback((value: RangeValue<DateValue>) => {
    setRange(value)
    setPreset("Custom")
  }, [])

  const handlePresetChange = useCallback((key: React.Key | null) => {
    if (!key) return
    const k = key as string
    setPreset(k)
    
    const end = today(getLocalTimeZone())
    let start
    
    if (k === "Last 7 Days") {
        start = end.subtract({ days: 6 })
        setRange({ start, end })
    } else if (k === "Last 30 Days") {
        start = end.subtract({ days: 29 })
        setRange({ start, end })
    } else {
        // Custom or other presets
    }
  }, [])

  const handleStartChange = useCallback((date: DateValue | null) => {
    if (date) {
      setRange(prev => ({ start: date, end: prev?.end || date }))
      setPreset("Custom")
    }
  }, [])

  const handleEndChange = useCallback((date: DateValue | null) => {
    if (date) {
      setRange(prev => ({ start: prev?.start || date, end: date }))
      setPreset("Custom")
    }
  }, [])

  return {
    range,
    preset,
    handleApply,
    handleRangeChange,
    handlePresetChange,
    handleStartChange,
    handleEndChange
  }
}
