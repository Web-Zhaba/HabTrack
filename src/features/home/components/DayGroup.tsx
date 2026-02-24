import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getTodayKey } from '@features/habits/lib/utils';
import { HabitListItem } from './HabitListItem';
import type { Habit } from '@features/habits/types/habit.types';
import type { HabitLog } from '@/types/HabitLog.types';

interface DayGroupItem {
  habit: Habit;
  log?: HabitLog;
  percent: number;
  streak: number;
}

export interface DayGroupData {
  dateKey: string;
  items: DayGroupItem[];
  completedCount: number;
  totalCount: number;
}

interface DayGroupProps {
  day: DayGroupData;
  dayIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, 'd MMMM', { locale: ru });
}

function isToday(dateKey: string): boolean {
  return dateKey === getTodayKey();
}

export function DayGroup({ day, dayIndex, isExpanded, onToggle }: DayGroupProps) {
  const dayIsToday = isToday(day.dateKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: dayIndex * 0.05 }}
    >
      <Card className={dayIsToday ? 'border-primary/30 bg-primary/5' : ''}>
        {/* Заголовок дня */}
        <button
          onClick={onToggle}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-lg"
          aria-expanded={isExpanded}
          aria-label={`Привычки за ${formatDateKey(day.dateKey)}${dayIsToday ? ', сегодня' : ''}`}
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
              <motion.div
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  aria-hidden="true"
                  className="lucide lucide-chevron-up w-4 h-4 text-muted-foreground"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  aria-hidden="true"
                  className="lucide lucide-chevron-down w-4 h-4 text-muted-foreground"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.div>
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
                {day.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.03 }}
                  >
                    <HabitListItem />
                  </motion.div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
