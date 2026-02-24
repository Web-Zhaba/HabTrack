import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { getTodayKey } from '@features/habits/store';
import { upsertHabitLog } from '@features/statistics/store';
import type { Habit } from '../types/habit.types';
import type { HabitLog } from '@/types/HabitLog.types';

export function useHabitActions(habit: Habit) {
  const dispatch = useAppDispatch();
  const todayKey = getTodayKey();
  const allLogs = useAppSelector((state) => state.habitLogs.items);

  // Мемоизируем поиск лога чтобы избежать лишних перерисовок
  const logForToday: HabitLog | undefined = useMemo(() => {
    return allLogs.find((log: HabitLog) => log.habitId === habit.id && log.date === todayKey);
  }, [allLogs, habit.id, todayKey]);

  const valueToday = logForToday?.value ?? 0;
  const completedToday = logForToday?.completed ?? false;

  const handleDecrease = () => {
    const next = Math.max(0, valueToday - 1);
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        value: next,
      }),
    );
  };

  const handleIncrease = () => {
    const next = valueToday + 1;
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        value: next,
      }),
    );
  };

  const handleToggle = () => {
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        completed: !completedToday,
        value: !completedToday ? 1 : 0,
      }),
    );
  };

  return {
    handleDecrease,
    handleIncrease,
    handleToggle,
  };
}
