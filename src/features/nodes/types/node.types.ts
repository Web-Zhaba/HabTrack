/**
 * NODES Type Definitions
 *
 * NODES использует те же типы что и Habits для обратной совместимости.
 * Разница только в терминологии UI (Node vs Habit).
 */

import type { HabitIconName } from '@features/habits/constants';

// Re-export всех типов из habits
export type { Habit as Node, HabitType as NodeType } from '@features/habits/types/habit.types';

export type { HabitIconName as NodeIconName };

export { HABIT_ICONS as NODE_ICONS } from '@features/habits/constants';
