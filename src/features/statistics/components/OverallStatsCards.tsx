import * as React from 'react';
import { useAppSelector } from '@app/store/hooks';
import { selectHabitLogs } from '@features/statistics/store';
import {
  selectCurrentStreak,
  selectMaxStreak,
  selectCompletedDays,
} from '@features/statistics/store';
import { selectActiveHabits } from '@features/habits/store';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import type { Habit } from '../../habits/types/habit.types';
import { StreakCard } from './StreakCard';
import { CompletionCard } from './CompletionCard';

interface SuccessRateDataPoint {
  date: string;
  rate: number;
}

function calculateSuccessRateForDays(
  logs: ReturnType<typeof selectHabitLogs>,
  habits: Habit[],
  days: number,
): SuccessRateDataPoint[] {
  const end = new Date();
  const start = subDays(end, days - 1);
  const allDays = eachDayOfInterval({ start, end });

  // Если нет привычек, возвращаем пустой массив
  if (habits.length === 0) {
    return [];
  }

  return allDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayLogs = logs.filter((log) => log.date === dateStr);

    let completed = 0;
    dayLogs.forEach((log) => {
      if (log.completed || (log.value && log.value > 0)) {
        completed++;
      }
    });

    const planned = habits.length;
    const rate = planned > 0 ? Math.round((completed / planned) * 100) : 0;

    return {
      date: dateStr,
      rate,
    };
  });
}

export function OverallStatsCards() {
  const logs = useAppSelector(selectHabitLogs);
  const habits = useAppSelector(selectActiveHabits);

  // Используем централизованные селекторы для расчёта статистики
  const currentStreak = useAppSelector(selectCurrentStreak);
  const maxStreak = useAppSelector(selectMaxStreak);
  const completedDays = useAppSelector(selectCompletedDays);

  // ТЕСТОВЫЙ РЕЖИМ - измените значение для проверки разных уровней
  // 0-6: small, 7-13: medium, 14-29: large, 30+: epic
  // Закомментируйте строку ниже для продакшена
  const TEST_CURRENT_STREAK: number | null = null;

  const chartData = React.useMemo(
    () => calculateSuccessRateForDays(logs, habits, 30),
    [logs, habits],
  );

  // Считаем success rate за сегодня (а не за последний день в массиве)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayData = chartData.find((d) => d.date === todayStr);
  const todaySuccessRate = todayData?.rate ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StreakCard
        currentStreak={TEST_CURRENT_STREAK !== null ? TEST_CURRENT_STREAK : currentStreak}
        maxStreak={maxStreak}
        completedDays={completedDays}
      />
      <CompletionCard
        totalCompleted={logs.length}
        successRate={todaySuccessRate}
        chartData={chartData}
      />
    </div>
  );
}
