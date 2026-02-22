import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import AnimatedProgressBar from "../../../shared/components/ui/smoothui/animated-progress-bar"
import { useSelector } from "react-redux"
import type { RootState } from "../../../app/store"
import { calculateHabitRangeProgress, type HabitSummary } from "../../statistics/store/habitLogsSlice"
import type { Habit } from "../../habits/types/habit.types"
import type { HabitLog } from "../../../shared/types/HabitLog.types"
import { Trophy, TrendingDown, CheckCircle2, Flame } from "lucide-react"

function calculateCurrentStreak(habits: Habit[], logs: HabitLog[]): number {
  if (!habits.length || !logs.length) return 0;

  const today = new Date();
  const completedDates = new Set<string>();

  const isCompleted = (log: HabitLog, habit: Habit) => {
    if (habit.type === 'quantitative') {
        return (log.value ?? 0) >= (habit.target ?? 1);
    }
    return log.completed === true;
  };

  const habitsMap = new Map(habits.map(h => [h.id, h]));

  logs.forEach(log => {
    const habit = habitsMap.get(log.habitId);
    if (habit && isCompleted(log, habit)) {
        completedDates.add(log.date);
    }
  });

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let checkDate = new Date(today);
  let currentStreak = 0;
  
  // Check today
  if (completedDates.has(formatDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
  } else {
      // If today is not done, check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      if (!completedDates.has(formatDate(checkDate))) {
          return 0; 
      }
      // If yesterday is done, we start counting from yesterday
  }

  // Check previous days
  while (true) {
      if (completedDates.has(formatDate(checkDate))) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
      } else {
          break;
      }
  }
  
  return currentStreak;
}

export function HabitsSummaryCard() {
  const habits = useSelector((state: RootState) => state.habits.items) as Habit[]
  const habitLogs = useSelector((state: RootState) => state.habitLogs.items) as HabitLog[]
  const selectedRange = useSelector((state: RootState) => state.habitLogs.selectedRange)

  const currentStreak = React.useMemo(() => {
    return calculateCurrentStreak(habits, habitLogs);
  }, [habits, habitLogs]);

  const summary: HabitSummary = React.useMemo(() => {
    if (!selectedRange) {
      return { totalCompleted: 0, totalPlanned: 0, percent: 0 }
    }
    return calculateHabitRangeProgress(habits, habitLogs, selectedRange)
  }, [habits, habitLogs, selectedRange])

  if (!selectedRange) {
     return (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                Выберите диапазон дат, чтобы просмотреть сводку.
            </CardContent>
        </Card>
     )
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

        {(summary.bestHabit || summary.worstHabit) ? (
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
  )
}
