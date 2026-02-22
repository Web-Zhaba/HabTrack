import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { HabitLog } from "@/types/HabitLog.types"
import type { Habit } from "../../habits/types/habit.types"

export interface HabitLogsState {
  items: HabitLog[]
  selectedRange: DateRange | null
}

const initialState: HabitLogsState = {
  items: [],
  selectedRange: null,
}

type UpsertHabitLogPayload =
  | {
      habitId: string
      date: string
      completed?: boolean
      value?: number
    }
  | HabitLog

export interface DateRange {
  start: string
  end: string
}

export interface HabitRangeProgress {
  totalCompleted: number
  totalPlanned: number
  percent: number
}

export interface HabitSummary extends HabitRangeProgress {
  bestHabit?: { name: string; percent: number }
  worstHabit?: { name: string; percent: number }
}

export interface HabitDayGroupItem {
  habit: Habit
  log?: HabitLog
  percent: number
}

export interface HabitDayGroup {
  dateKey: string
  weekdayLabel: string
  items: HabitDayGroupItem[]
}

function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function createDateFromKey(key: string): Date | null {
  if (!isValidDateKey(key)) return null
  const [year, month, day] = key.split("-").map((part) => Number(part))
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null
  }
  return new Date(year, month - 1, day)
}

export function getDateKeysInRange(range: DateRange): string[] {
  const { start, end } = range
  const startDate = createDateFromKey(start)
  const endDate = createDateFromKey(end)

  if (!startDate || !endDate) {
    return []
  }

  if (endDate.getTime() < startDate.getTime()) {
    return []
  }

  const result: string[] = []
  const current = new Date(startDate.getTime())

  while (current.getTime() <= endDate.getTime()) {
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, "0")
    const day = String(current.getDate()).padStart(2, "0")
    result.push(`${year}-${month}-${day}`)
    current.setDate(current.getDate() + 1)
  }

  return result
}

export function calculateHabitRangeProgress(
  habits: Habit[],
  logs: HabitLog[],
  range: DateRange,
): HabitSummary {
  const dateKeys = getDateKeysInRange(range)

  if (habits.length === 0 || dateKeys.length === 0) {
    return {
      totalCompleted: 0,
      totalPlanned: 0,
      percent: 0,
    }
  }

  const logByHabitAndDate = new Map<string, HabitLog>()

  for (const log of logs) {
    const key = `${log.habitId}-${log.date}`
    logByHabitAndDate.set(key, log)
  }

  let totalCompleted = 0
  let totalPlanned = 0
  const habitStats: { name: string; completed: number; planned: number }[] = []

  for (const habit of habits) {
    let habitCompleted = 0
    let habitPlanned = 0
    const isQuantitative = habit.type === "quantitative"
    const targetPerDay = habit.target ?? 0

    for (const dateKey of dateKeys) {
      const log = logByHabitAndDate.get(`${habit.id}-${dateKey}`)

      if (isQuantitative) {
        if (targetPerDay <= 0) continue
        habitPlanned += targetPerDay
        totalPlanned += targetPerDay

        const value = Math.max(0, log?.value ?? 0)
        const clamped = Math.min(targetPerDay, value)
        habitCompleted += clamped
        totalCompleted += clamped
      } else {
        habitPlanned += 1
        totalPlanned += 1
        if (log?.completed) {
          habitCompleted += 1
          totalCompleted += 1
        }
      }
    }
    habitStats.push({ name: habit.name, completed: habitCompleted, planned: habitPlanned })
  }

  const percent =
    totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0

  let bestHabit
  let worstHabit

  if (habitStats.length > 0) {
    const statsWithPercent = habitStats.map(s => ({
      name: s.name,
      percent: s.planned > 0 ? Math.round((s.completed / s.planned) * 100) : 0
    })).sort((a, b) => b.percent - a.percent)
    
    bestHabit = statsWithPercent[0]
    worstHabit = statsWithPercent[statsWithPercent.length - 1]
  }

  return {
    totalCompleted,
    totalPlanned,
    percent,
    bestHabit,
    worstHabit
  }
}

export function groupHabitsByDay(
  habits: Habit[],
  logs: HabitLog[],
  range: DateRange,
): HabitDayGroup[] {
  const dateKeys = getDateKeysInRange(range)

  if (habits.length === 0 || dateKeys.length === 0) {
    return []
  }

  const logByHabitAndDate = new Map<string, HabitLog>()

  for (const log of logs) {
    const key = `${log.habitId}-${log.date}`
    logByHabitAndDate.set(key, log)
  }

  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return dateKeys.map((dateKey) => {
    const date = createDateFromKey(dateKey)

    const weekdayLabel = date ? formatter.format(date) : dateKey

    const items: HabitDayGroupItem[] = habits.map((habit) => {
      const log = logByHabitAndDate.get(`${habit.id}-${dateKey}`)
      const isQuantitative = habit.type === "quantitative"
      const target = habit.target ?? 0

      let percent = 0

      if (isQuantitative) {
        if (target > 0) {
          const value = Math.max(0, log?.value ?? 0)
          const clamped = Math.min(target, value)
          percent = Math.round((clamped / target) * 100)
        }
      } else if (log?.completed) {
        percent = 100
      }

      return {
        habit,
        log,
        percent,
      }
    })

    return {
      dateKey,
      weekdayLabel,
      items,
    }
  })
}

const habitLogsSlice = createSlice({
  name: "habitLogs",
  initialState,
  reducers: {
    setHabitLogs: (state, action: PayloadAction<HabitLog[]>) => {
      state.items = action.payload
    },
    upsertHabitLog: (state, action: PayloadAction<UpsertHabitLogPayload>) => {
      const payload = action.payload

      const id =
        "id" in payload && payload.id
          ? payload.id
          : `${payload.habitId}-${payload.date}`

      const existingIndex = state.items.findIndex((log) => log.id === id)

      const base: HabitLog = {
        id,
        habitId: payload.habitId,
        date: payload.date,
      }

      const next: HabitLog = {
        ...base,
        ...(payload.completed !== undefined ? { completed: payload.completed } : {}),
        ...(payload.value !== undefined ? { value: payload.value } : {}),
      }

      if (existingIndex >= 0) {
        state.items[existingIndex] = {
          ...state.items[existingIndex],
          ...next,
        }
      } else {
        state.items.push(next)
      }
    },
    upsertManyHabitLogs: (state, action: PayloadAction<UpsertHabitLogPayload[]>) => {
      for (const payload of action.payload) {
        const id =
          "id" in payload && payload.id
            ? payload.id
            : `${payload.habitId}-${payload.date}`

        const existingIndex = state.items.findIndex((log) => log.id === id)

        const base: HabitLog = {
          id,
          habitId: payload.habitId,
          date: payload.date,
        }

        const next: HabitLog = {
          ...base,
          ...(payload.completed !== undefined ? { completed: payload.completed } : {}),
          ...(payload.value !== undefined ? { value: payload.value } : {}),
        }

        if (existingIndex >= 0) {
          state.items[existingIndex] = {
            ...state.items[existingIndex],
            ...next,
          }
        } else {
          state.items.push(next)
        }
      }
    },
    clearHabitLogs: (state) => {
      state.items = []
    },
    setSelectedRange: (state, action: PayloadAction<DateRange | null>) => {
      state.selectedRange = action.payload
    },
  },
})

export const { setHabitLogs, upsertHabitLog, upsertManyHabitLogs, clearHabitLogs, setSelectedRange } =
  habitLogsSlice.actions

export const selectHabitLogs = (state: { habitLogs: HabitLogsState }) => state.habitLogs.items
export const selectSelectedRange = (state: { habitLogs: HabitLogsState }) =>
  state.habitLogs.selectedRange

export default habitLogsSlice.reducer

