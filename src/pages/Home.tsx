import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HomeHeader } from '@features/home/components/HomeHeader';
import { HomeMiniStats } from '@features/home/components/HomeMiniStats';
import { HomeHabitsList } from '@features/home/components/HomeHabitsList';
import WeeklyCalendarCard from '@features/statistics/components/WeeklyCalendarCard';
import { HabitCreateModal } from '@features/habits/components/HabitCreateModal';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  setSelectedRange,
  selectSelectedRange,
  upsertManyHabitLogs,
} from '@features/statistics/store';
import {
  selectActiveHabits,
  addHabit,
  getTodayKey,
  canMarkDate,
  type Habit,
} from '@features/habits/store';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const habits = useAppSelector(selectActiveHabits);
  const selectedRange = useAppSelector(selectSelectedRange);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Инициализация диапазона по умолчанию (сегодня)
  useEffect(() => {
    if (!selectedRange) {
      const today = getTodayKey();
      dispatch(setSelectedRange({ start: today, end: today }));
    }
  }, [selectedRange, dispatch]);

  const handleMarkAllToday = () => {
    const today = getTodayKey();
    const logs: { habitId: string; date: string; completed?: boolean; value?: number }[] = [];

    habits.forEach((habit) => {
      if (!canMarkDate(today, habit.createdAt)) return;

      if (habit.type === 'quantitative') {
        logs.push({
          habitId: habit.id,
          date: today,
          value: habit.target ?? 1,
        });
      } else {
        logs.push({
          habitId: habit.id,
          date: today,
          completed: true,
        });
      }
    });

    if (logs.length > 0) {
      dispatch(upsertManyHabitLogs(logs));
    }
  };

  const handleUnmarkAllToday = () => {
    const today = getTodayKey();
    const logs: { habitId: string; date: string; completed?: boolean; value?: number }[] = [];

    habits.forEach((habit) => {
      if (!canMarkDate(today, habit.createdAt)) return;

      if (habit.type === 'quantitative') {
        logs.push({
          habitId: habit.id,
          date: today,
          value: 0,
        });
      } else {
        logs.push({
          habitId: habit.id,
          date: today,
          completed: false,
        });
      }
    });

    if (logs.length > 0) {
      dispatch(upsertManyHabitLogs(logs));
    }
  };

  const handleCreateHabit = (habit: Habit) => {
    dispatch(addHabit(habit));
    setIsCreateModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8"
    >
      {/* Заголовок */}
      <HomeHeader onAddHabit={() => setIsCreateModalOpen(true)} />

      {/* Основной контент */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Левая колонка - Календарь */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-[380px] flex-shrink-0"
        >
          <WeeklyCalendarCard />
        </motion.div>

        {/* Правая колонка - Привычки за период */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 lg:h-[520px]"
        >
          <HomeHabitsList onCreateHabit={() => setIsCreateModalOpen(true)} />
        </motion.div>
      </div>

      {/* Статистика */}
      <HomeMiniStats onMarkAll={handleMarkAllToday} onUnmarkAll={handleUnmarkAllToday} />

      {/* Модальное окно создания привычки */}
      <HabitCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateHabit}
      />
    </motion.div>
  );
}
