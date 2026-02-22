import type { Habit } from "../../habits/types/habit.types"
import type { HabitLog } from "@/types/HabitLog.types"
import reducer, {
  calculateHabitRangeProgress,
  groupHabitsByDay,
  type DateRange,
  setSelectedRange,
  selectSelectedRange,
  type HabitLogsState,
} from "./habitLogsSlice"

const habitsFixture: Habit[] = [
  {
    id: "habit-binary",
    name: "Утренняя зарядка",
    description: "Короткая зарядка утром",
    categoryId: "health",
    color: "--primary",
    icon: "🏃",
    type: "binary",
    createdAt: "2026-02-01",
  },
  {
    id: "habit-quant",
    name: "Чтение",
    description: "Чтение книг",
    categoryId: "learning",
    color: "--chart-1",
    icon: "📚",
    type: "quantitative",
    target: 10,
    unit: "страниц",
    createdAt: "2026-02-01",
  },
]

const logsFixture: HabitLog[] = [
  {
    id: "log-1",
    habitId: "habit-binary",
    date: "2026-02-20",
    completed: true,
  },
  {
    id: "log-2",
    habitId: "habit-quant",
    date: "2026-02-20",
    value: 5,
  },
  {
    id: "log-3",
    habitId: "habit-quant",
    date: "2026-02-21",
    value: 10,
  },
]

export function testCalculateHabitRangeProgress_basic() {
  const range: DateRange = {
    start: "2026-02-20",
    end: "2026-02-21",
  }

  const result = calculateHabitRangeProgress(habitsFixture, logsFixture, range)

  const expectedPlanned = 2 + 10 * 2
  const expectedCompleted = 1 + 5 + 10
  const expectedPercent =
    expectedPlanned > 0
      ? Math.round((expectedCompleted / expectedPlanned) * 100)
      : 0

  if (result.totalPlanned !== expectedPlanned) {
    throw new Error(`Expected planned ${expectedPlanned}, got ${result.totalPlanned}`)
  }

  if (result.totalCompleted !== expectedCompleted) {
    throw new Error(
      `Expected completed ${expectedCompleted}, got ${result.totalCompleted}`,
    )
  }

  if (result.percent !== expectedPercent) {
    throw new Error(`Expected percent ${expectedPercent}, got ${result.percent}`)
  }
}

export function testCalculateHabitRangeProgress_invalidRange() {
  const range: DateRange = {
    start: "2026-02-21",
    end: "2026-02-20",
  }

  const result = calculateHabitRangeProgress(habitsFixture, logsFixture, range)

  if (
    result.totalPlanned !== 0 ||
    result.totalCompleted !== 0 ||
    result.percent !== 0
  ) {
    throw new Error("Expected zero progress for invalid range")
  }
}

export function testGroupHabitsByDay_basic() {
  const range: DateRange = {
    start: "2026-02-20",
    end: "2026-02-21",
  }

  const groups = groupHabitsByDay(habitsFixture, logsFixture, range)

  if (groups.length !== 2) {
    throw new Error(`Expected 2 groups, got ${groups.length}`)
  }

  for (const group of groups) {
    if (!group.weekdayLabel || group.items.length !== habitsFixture.length) {
      throw new Error("Each group must have label and all habits")
    }
  }
}

export function testSelectedRangeReducer_andSelector() {
  const initialState: HabitLogsState = {
    items: [],
    selectedRange: null,
  }

  const range: DateRange = {
    start: "2026-02-20",
    end: "2026-02-21",
  }

  const nextState = reducer(initialState, setSelectedRange(range))

  if (!nextState.selectedRange) {
    throw new Error("Expected selectedRange to be set")
  }

  if (nextState.selectedRange.start !== range.start || nextState.selectedRange.end !== range.end) {
    throw new Error("Selected range in state does not match payload")
  }

  const rootState = { habitLogs: nextState }
  const selected = selectSelectedRange(rootState)

  if (!selected || selected.start !== range.start || selected.end !== range.end) {
    throw new Error("Selector did not return the expected selectedRange")
  }
}

export function testDateRangeIntegrationFlow() {
  let state = reducer(undefined, { type: "@@INIT" })

  const range: DateRange = {
    start: "2026-02-20",
    end: "2026-02-21",
  }

  state = reducer(state, setSelectedRange(range))

  if (!state.selectedRange) {
    throw new Error("Expected selectedRange to be set after dispatch")
  }

  const progress = calculateHabitRangeProgress(habitsFixture, logsFixture, state.selectedRange)
  const groups = groupHabitsByDay(habitsFixture, logsFixture, state.selectedRange)

  if (progress.totalPlanned === 0 || groups.length === 0) {
    throw new Error("Expected non-empty progress and groups for valid integration flow")
  }
}
