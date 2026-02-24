/**
 * Единая точка экспорта для store статистики привычек
 *
 * Использование:
 * import { selectHabitLogs, upsertHabitLog } from '@features/statistics/store';
 */

export {
  // Actions
  setHabitLogs,
  upsertHabitLog,
  upsertManyHabitLogs,
  clearHabitLogs,
  setSelectedRange,
  // Reducer
  default as habitLogsReducer,
  // State type
  type HabitLogsState,
  // Initial state
  initialState,
  // Types
  type DateRange,
} from './habitLogsSlice';

export {
  // Selectors - habitLogs
  selectHabitLogs,
  selectSelectedRange,
} from './habitLogsSlice';

export {
  // Selectors - habitStats
  selectCompletedDays,
  selectPerfectDays,
  selectCurrentStreak,
  selectMaxStreak,
  selectPerfectDaysCount,
  selectHabitStreak,
  selectAllHabitStreaks,
  selectBestStreak,
  selectAllHabitsCompletedToday,
  selectHabitCompletedToday,
  selectLogsByDate,
  // Utils
  calculateHabitRangeProgress,
  groupHabitsByDay,
  getDateKeysInRange,
  createDateFromKey,
  type HabitRangeProgress,
  type HabitSummary,
  type HabitDayGroup,
  type HabitDayGroupItem,
} from './habitStatsSlice';
