import { useMemo } from 'react';
import { useAppSelector } from '@app/store/hooks';
import { getTodayKey } from '@features/habits/store';
import type { Habit } from '../types/habit.types';
import type { HabitLog } from '@/types/HabitLog.types';

export function useHabitProgress(habit: Habit) {
  const todayKey = getTodayKey();
  const allLogs = useAppSelector((state) => state.habitLogs.items);

  // Мемоизируем поиск лога чтобы избежать лишних перерисовок
  const logForToday: HabitLog | undefined = useMemo(() => {
    return allLogs.find((log: HabitLog) => log.habitId === habit.id && log.date === todayKey);
  }, [allLogs, habit.id, todayKey]);

  const completedToday = logForToday?.completed ?? false;
  const valueToday = logForToday?.value ?? 0;

  const isQuantitative = habit.type === 'quantitative';
  const target = habit.target ?? 0;
  const isOverTarget = isQuantitative && target > 0 && valueToday > target;

  const percent =
    isQuantitative && target > 0
      ? Math.max(0, Math.min(100, Math.round((valueToday / target) * 100)))
      : completedToday
        ? 100
        : 0;

  const progressColor = isOverTarget ? '--over-target' : habit.color || '--primary';

  return {
    completedToday,
    valueToday,
    percent,
    isOverTarget,
    progressColor,
    isQuantitative,
    target,
  };
}
