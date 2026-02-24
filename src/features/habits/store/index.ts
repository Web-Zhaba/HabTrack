/**
 * Единая точка экспорта для store привычек
 *
 * Использование:
 * import { selectHabits, addHabit } from '@features/habits/store';
 */

export {
  // Actions
  setHabits,
  addHabit,
  removeHabit,
  updateHabit,
  // Reducer
  default as habitsReducer,
  // State type
  type HabitsState,
  // Initial state
  initialState,
} from './habitsSlice';

export {
  // Selectors
  selectHabits,
  selectActiveHabits,
  selectPausedHabits,
} from './habitsSlice';

export {
  // Types
  type Habit,
  type HabitType,
} from '../types/habit.types';

export {
  // Constants
  HABIT_ICONS,
  type HabitIconName,
} from '../constants';

export {
  // Hooks
  useHabitProgress,
} from '../hooks/useHabitProgress';

export {
  // Hooks
  useHabitActions,
} from '../hooks/useHabitActions';

export {
  // Utils
  getTodayKey,
  canMarkDate,
} from '../lib/utils';
