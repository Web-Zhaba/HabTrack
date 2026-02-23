import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedProgressBar from '@/components/ui/smoothui/animated-progress-bar';
import { useAppSelector, useAppDispatch } from '@app/store/hooks';
import {
  selectSelectedRange,
  selectHabitLogs,
  selectAllHabitStreaks,
  getDateKeysInRange,
  upsertHabitLog,
} from '@features/statistics/store/habitLogsSlice';
import { selectActiveHabits } from '@features/habits/store/habitsSlice';
import type { Habit } from '@features/habits/types/habit.types';
import type { HabitLog } from '@/types/HabitLog.types';
import { Flame, Check, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { CardTilt, CardTiltContent } from '@/components/ui/card-tilt';
import { getTodayKey, canMarkDate } from '@/lib/utils';

interface HomeHabitsListProps {
  onCreateHabit: () => void;
}

function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, 'd MMMM', { locale: ru });
}

function isToday(dateKey: string): boolean {
  return dateKey === getTodayKey();
}

export function HomeHabitsList({ onCreateHabit }: HomeHabitsListProps) {
  const dispatch = useAppDispatch();
  const habits = useAppSelector(selectActiveHabits);
  const habitLogs = useAppSelector(selectHabitLogs);
  const selectedRange = useAppSelector(selectSelectedRange);
  const allStreaks = useAppSelector(selectAllHabitStreaks);

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (dateKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  };

  // Группируем привычки по дням
  const groupedData = useMemo(() => {
    if (!selectedRange) return [];

    const dateKeys = getDateKeysInRange(selectedRange);
    const logByHabitAndDate = new Map<string, HabitLog>();

    habitLogs.forEach((log) => {
      const key = `${log.habitId}-${log.date}`;
      logByHabitAndDate.set(key, log);
    });

    return dateKeys.map((dateKey) => {
      const items = habits.map((habit) => {
        const log = logByHabitAndDate.get(`${habit.id}-${dateKey}`);
        const isQuantitative = habit.type === 'quantitative';
        const target = habit.target ?? 0;

        let percent = 0;
        if (isQuantitative) {
          if (target > 0) {
            const value = Math.max(0, log?.value ?? 0);
            percent = Math.round((Math.min(target, value) / target) * 100);
          }
        } else if (log?.completed) {
          percent = 100;
        }

        return {
          habit,
          log,
          percent,
          streak: allStreaks.get(habit.id) ?? 0,
        };
      });

      const completedCount = items.filter(
        (item) => item.percent === 100 || (item.habit.type === 'quantitative' && item.percent > 0)
      ).length;

      return {
        dateKey,
        items,
        completedCount,
        totalCount: items.length,
      };
    });
  }, [selectedRange, habits, habitLogs, allStreaks]);

  // Обработчики
  const handleToggleBinary = (habit: Habit, dateKey: string, currentValue: boolean) => {
    if (!canMarkDate(dateKey, habit.createdAt)) return;
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: dateKey,
        completed: !currentValue,
      })
    );
  };

  const handleIncrementQuantitative = (habit: Habit, dateKey: string, currentValue: number) => {
    if (!canMarkDate(dateKey, habit.createdAt)) return;
    const target = habit.target ?? 1;
    const newValue = Math.min(currentValue + 1, target * 2);
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: dateKey,
        value: newValue,
      })
    );
  };

  const handleDecrementQuantitative = (habit: Habit, dateKey: string, currentValue: number) => {
    if (!canMarkDate(dateKey, habit.createdAt)) return;
    const newValue = Math.max(0, currentValue - 1);
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: dateKey,
        value: newValue,
      })
    );
  };

  if (!selectedRange) {
    return null;
  }

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Нет привычек</p>
              <p className="text-sm text-muted-foreground">
                Добавьте первую привычку, чтобы начать отслеживание
              </p>
            </div>
            <Button onClick={onCreateHabit}>Добавить привычку</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Привычки за период</h2>
        <span className="text-sm text-muted-foreground">
          {formatDateKey(selectedRange.start)}
          {selectedRange.start !== selectedRange.end && ` - ${formatDateKey(selectedRange.end)}`}
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {groupedData.map((day, dayIndex) => {
            const isExpanded = expandedDays.has(day.dateKey) || isToday(day.dateKey);
            const dayIsToday = isToday(day.dateKey);

            return (
              <motion.div
                key={day.dateKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: dayIndex * 0.05 }}
              >
                <Card className={dayIsToday ? 'border-primary/30 bg-primary/5' : ''}>
                  {/* Заголовок дня */}
                  <button
                    onClick={() => toggleDay(day.dateKey)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium capitalize">
                        {formatDateKey(day.dateKey)}
                        {dayIsToday && (
                          <span className="ml-2 text-xs text-primary font-normal">(сегодня)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {day.completedCount}/{day.totalCount}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Список привычек */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 space-y-2">
                          {day.items.map((item, itemIndex) => {
                            const canMark = canMarkDate(day.dateKey, item.habit.createdAt);
                            const isQuantitative = item.habit.type === 'quantitative';
                            const target = item.habit.target ?? 1;
                            const currentValue = item.log?.value ?? 0;

                            return (
                              <motion.div
                                key={item.habit.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.03 }}
                              >
                                <CardTilt tiltMaxAngle={8} scale={1.01}>
                                  <CardTiltContent>
                                    <div
                                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                        item.percent === 100
                                          ? 'bg-green-500/10 border border-green-500/20'
                                          : item.percent > 0
                                            ? 'bg-yellow-500/10 border border-yellow-500/20'
                                            : 'bg-muted/50 border border-transparent'
                                      }`}
                                    >
                                      {/* Чекбокс / Кнопки */}
                                      <div className="flex-shrink-0">
                                        {isQuantitative ? (
                                          <div className="flex items-center gap-1">
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="h-7 w-7"
                                              onClick={() =>
                                                handleDecrementQuantitative(
                                                  item.habit,
                                                  day.dateKey,
                                                  currentValue
                                                )
                                              }
                                              isDisabled={!canMark}
                                            >
                                              <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm font-medium">
                                              {currentValue}
                                            </span>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="h-7 w-7"
                                              onClick={() =>
                                                handleIncrementQuantitative(
                                                  item.habit,
                                                  day.dateKey,
                                                  currentValue
                                                )
                                              }
                                              isDisabled={!canMark}
                                            >
                                              <Plus className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() =>
                                              handleToggleBinary(
                                                item.habit,
                                                day.dateKey,
                                                item.log?.completed ?? false
                                              )
                                            }
                                            disabled={!canMark}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                              item.log?.completed
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted border-2 border-muted-foreground/30'
                                            } ${!canMark ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          >
                                            {item.log?.completed && (
                                              <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 500 }}
                                              >
                                                <Check className="w-4 h-4" />
                                              </motion.div>
                                            )}
                                          </motion.button>
                                        )}
                                      </div>

                                      {/* Название и серия */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`font-medium truncate ${
                                              item.percent === 100
                                                ? 'text-green-700 dark:text-green-400'
                                                : ''
                                            }`}
                                          >
                                            {item.habit.name}
                                          </span>
                                          {item.streak > 0 && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="flex items-center gap-1 text-orange-500"
                                            >
                                              <Flame className="w-3 h-3" />
                                              <span className="text-xs font-medium">
                                                {item.streak}
                                              </span>
                                            </motion.div>
                                          )}
                                        </div>
                                        {isQuantitative && (
                                          <p className="text-xs text-muted-foreground">
                                            {currentValue} / {target} {item.habit.unit || 'шт'}
                                          </p>
                                        )}
                                      </div>

                                      {/* Прогресс */}
                                      <div className="flex-shrink-0 w-16">
                                        <AnimatedProgressBar
                                          value={item.percent}
                                          color={
                                            item.percent === 100
                                              ? '--green-500'
                                              : item.percent > 0
                                                ? '--yellow-500'
                                                : '--muted'
                                          }
                                        />
                                      </div>
                                    </div>
                                  </CardTiltContent>
                                </CardTilt>
                              </motion.div>
                            );
                          })}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}