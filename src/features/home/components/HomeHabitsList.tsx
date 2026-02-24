import { motion, AnimatePresence } from 'motion/react';
import { useAppSelector } from '@app/store/hooks';
import { selectSelectedRange, selectHabitLogs } from '@features/statistics/store';
import { selectAllHabitStreaks, getDateKeysInRange } from '@features/statistics/store';
import { selectActiveHabits } from '@features/habits/store';
import { DayGroup } from './DayGroup';
import type { HabitLog } from '@/types/HabitLog.types';
import { useDateFormat } from '@features/settings/hooks/useDateFormat';
import { useState, useMemo } from 'react';
import { getTodayKey } from '@features/habits/store';
import { Plus } from 'lucide-react';

interface HomeHabitsListProps {
  onCreateHabit: () => void;
}

export function HomeHabitsList({ onCreateHabit }: HomeHabitsListProps) {
  const { formatDate } = useDateFormat();
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

  const formatDateKey = (dateKey: string): string => {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return formatDate(date, 'd MMMM');
  };

  const isToday = (dateKey: string): boolean => {
    return dateKey === getTodayKey();
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
        (item) => item.percent === 100 || (item.habit.type === 'quantitative' && item.percent > 0),
      ).length;

      return {
        dateKey,
        items,
        completedCount,
        totalCount: items.length,
      };
    });
  }, [selectedRange, habits, habitLogs, allStreaks]);

  if (!selectedRange) {
    return null;
  }

  // Пустое состояние - круглая кнопка
  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-full flex flex-col items-center justify-center gap-6"
      >
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Нет привычек</p>
          <p className="text-sm text-muted-foreground">
            Добавьте первую привычку, чтобы начать отслеживание
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateHabit}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center transition-colors"
          aria-label="Добавить привычку"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Заголовок - фиксированный */}
      <div className="flex-shrink-0 flex items-center justify-between pb-3 border-b">
        <h2 className="text-lg font-semibold">Привычки за период</h2>
        <span className="text-sm text-muted-foreground">
          {formatDateKey(selectedRange.start)}
          {selectedRange.start !== selectedRange.end && ` - ${formatDateKey(selectedRange.end)}`}
        </span>
      </div>

      {/* Список привычек - скроллится */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <AnimatePresence>
          {groupedData.map((day, dayIndex) => {
            const isExpanded = expandedDays.has(day.dateKey) || isToday(day.dateKey);

            return (
              <DayGroup
                key={day.dateKey}
                day={day}
                dayIndex={dayIndex}
                isExpanded={isExpanded}
                onToggle={() => toggleDay(day.dateKey)}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
