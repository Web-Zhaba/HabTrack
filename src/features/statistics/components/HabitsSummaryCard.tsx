import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedProgressBar from '@/components/ui/smoothui/animated-progress-bar';
import { useAppSelector } from '@app/store/hooks';
import {
  calculateHabitRangeProgress,
  type HabitSummary,
  selectCurrentStreak,
  selectMaxStreak,
  selectPerfectDaysCount,
} from '@features/statistics/store/habitLogsSlice';
import { Trophy, TrendingDown, CheckCircle2, Flame, Award } from 'lucide-react';

export function HabitsSummaryCard() {
  const habits = useAppSelector((state) => state.habits.items);
  const habitLogs = useAppSelector((state) => state.habitLogs.items);
  const selectedRange = useAppSelector((state) => state.habitLogs.selectedRange);

  // Используем централизованные селекторы для расчёта статистики
  const currentStreak = useAppSelector(selectCurrentStreak);
  const maxStreak = useAppSelector(selectMaxStreak);
  const perfectDaysCount = useAppSelector(selectPerfectDaysCount);

  const summary: HabitSummary = React.useMemo(() => {
    if (!selectedRange) {
      return { totalCompleted: 0, totalPlanned: 0, percent: 0 };
    }
    return calculateHabitRangeProgress(habits, habitLogs, selectedRange);
  }, [habits, habitLogs, selectedRange]);

  if (!selectedRange) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Выберите диапазон дат, чтобы просмотреть сводку.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Краткая сводка</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Общий прогресс</span>
            <span className="font-bold">{summary.percent}%</span>
          </div>
          <AnimatedProgressBar value={summary.percent} color="--primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Выполнено
            </div>
            <span className="text-2xl font-bold">
              {summary.totalCompleted} / {summary.totalPlanned}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              Серия
            </div>
            <span className="text-2xl font-bold">
              {currentStreak} <span className="text-sm font-normal text-muted-foreground">дн.</span>
            </span>
          </div>
        </div>

        {/* Дополнительная статистика */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4 text-yellow-500" />
              Лучший стрик
            </div>
            <span className="text-2xl font-bold">
              {maxStreak} <span className="text-sm font-normal text-muted-foreground">дн.</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-blue-500" />
              100% дни
            </div>
            <span className="text-2xl font-bold">
              {perfectDaysCount}{' '}
              <span className="text-sm font-normal text-muted-foreground">дн.</span>
            </span>
          </div>
        </div>

        {summary.bestHabit || summary.worstHabit ? (
          <div className="space-y-3 pt-2 border-t mt-auto">
            {summary.bestHabit && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Лучший результат</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{summary.bestHabit.name}</div>
                  <div className="text-xs text-muted-foreground">{summary.bestHabit.percent}%</div>
                </div>
              </div>
            )}
            {summary.worstHabit && summary.worstHabit.name !== summary.bestHabit?.name && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Нужно постараться</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{summary.worstHabit.name}</div>
                  <div className="text-xs text-muted-foreground">{summary.worstHabit.percent}%</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-auto" />
        )}
      </CardContent>
    </Card>
  );
}
