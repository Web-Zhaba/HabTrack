import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { HabitLog } from '@/types/HabitLog.types';
import type { Habit } from '../../habits/types/habit.types';

export interface HabitLogsState {
  items: HabitLog[];
  selectedRange: DateRange | null;
}

const initialState: HabitLogsState = {
  items: [],
  selectedRange: null,
};

type UpsertHabitLogPayload =
  | {
      habitId: string;
      date: string;
      completed?: boolean;
      value?: number;
    }
  | HabitLog;

export interface DateRange {
  start: string;
  end: string;
}

export interface HabitRangeProgress {
  totalCompleted: number;
  totalPlanned: number;
  percent: number;
}

export interface HabitSummary extends HabitRangeProgress {
  bestHabit?: { name: string; percent: number };
  worstHabit?: { name: string; percent: number };
}

export interface HabitDayGroupItem {
  habit: Habit;
  log?: HabitLog;
  percent: number;
}

export interface HabitDayGroup {
  dateKey: string;
  weekdayLabel: string;
  items: HabitDayGroupItem[];
}

function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function createDateFromKey(key: string): Date | null {
  if (!isValidDateKey(key)) return null;
  const [year, month, day] = key.split('-').map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  return new Date(year, month - 1, day);
}

export function getDateKeysInRange(range: DateRange): string[] {
  const { start, end } = range;
  const startDate = createDateFromKey(start);
  const endDate = createDateFromKey(end);

  if (!startDate || !endDate) {
    return [];
  }

  if (endDate.getTime() < startDate.getTime()) {
    return [];
  }

  const result: string[] = [];
  const current = new Date(startDate.getTime());

  while (current.getTime() <= endDate.getTime()) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function calculateHabitRangeProgress(
  habits: Habit[],
  logs: HabitLog[],
  range: DateRange,
): HabitSummary {
  const dateKeys = getDateKeysInRange(range);

  if (habits.length === 0 || dateKeys.length === 0) {
    return {
      totalCompleted: 0,
      totalPlanned: 0,
      percent: 0,
    };
  }

  const logByHabitAndDate = new Map<string, HabitLog>();

  for (const log of logs) {
    const key = `${log.habitId}-${log.date}`;
    logByHabitAndDate.set(key, log);
  }

  let totalCompleted = 0;
  let totalPlanned = 0;
  const habitStats: { name: string; completed: number; planned: number }[] = [];

  for (const habit of habits) {
    let habitCompleted = 0;
    let habitPlanned = 0;
    const isQuantitative = habit.type === 'quantitative';
    const targetPerDay = habit.target ?? 0;

    for (const dateKey of dateKeys) {
      const log = logByHabitAndDate.get(`${habit.id}-${dateKey}`);

      if (isQuantitative) {
        if (targetPerDay <= 0) continue;
        habitPlanned += targetPerDay;
        totalPlanned += targetPerDay;

        const value = Math.max(0, log?.value ?? 0);
        const clamped = Math.min(targetPerDay, value);
        habitCompleted += clamped;
        totalCompleted += clamped;
      } else {
        habitPlanned += 1;
        totalPlanned += 1;
        if (log?.completed) {
          habitCompleted += 1;
          totalCompleted += 1;
        }
      }
    }
    habitStats.push({ name: habit.name, completed: habitCompleted, planned: habitPlanned });
  }

  const percent = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

  let bestHabit;
  let worstHabit;

  if (habitStats.length > 0) {
    const statsWithPercent = habitStats
      .map((s) => ({
        name: s.name,
        percent: s.planned > 0 ? Math.round((s.completed / s.planned) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent);

    bestHabit = statsWithPercent[0];
    worstHabit = statsWithPercent[statsWithPercent.length - 1];
  }

  return {
    totalCompleted,
    totalPlanned,
    percent,
    bestHabit,
    worstHabit,
  };
}

export function groupHabitsByDay(
  habits: Habit[],
  logs: HabitLog[],
  range: DateRange,
): HabitDayGroup[] {
  const dateKeys = getDateKeysInRange(range);

  if (habits.length === 0 || dateKeys.length === 0) {
    return [];
  }

  const logByHabitAndDate = new Map<string, HabitLog>();

  for (const log of logs) {
    const key = `${log.habitId}-${log.date}`;
    logByHabitAndDate.set(key, log);
  }

  const formatter = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return dateKeys.map((dateKey) => {
    const date = createDateFromKey(dateKey);

    const weekdayLabel = date ? formatter.format(date) : dateKey;

    const items: HabitDayGroupItem[] = habits.map((habit) => {
      const log = logByHabitAndDate.get(`${habit.id}-${dateKey}`);
      const isQuantitative = habit.type === 'quantitative';
      const target = habit.target ?? 0;

      let percent = 0;

      if (isQuantitative) {
        if (target > 0) {
          const value = Math.max(0, log?.value ?? 0);
          const clamped = Math.min(target, value);
          percent = Math.round((clamped / target) * 100);
        }
      } else if (log?.completed) {
        percent = 100;
      }

      return {
        habit,
        log,
        percent,
      };
    });

    return {
      dateKey,
      weekdayLabel,
      items,
    };
  });
}

const habitLogsSlice = createSlice({
  name: 'habitLogs',
  initialState,
  reducers: {
    setHabitLogs: (state, action: PayloadAction<HabitLog[]>) => {
      state.items = action.payload;
    },
    upsertHabitLog: (state, action: PayloadAction<UpsertHabitLogPayload>) => {
      const payload = action.payload;

      const id = 'id' in payload && payload.id ? payload.id : `${payload.habitId}-${payload.date}`;

      const existingIndex = state.items.findIndex((log) => log.id === id);

      const base: HabitLog = {
        id,
        habitId: payload.habitId,
        date: payload.date,
      };

      const next: HabitLog = {
        ...base,
        ...(payload.completed !== undefined ? { completed: payload.completed } : {}),
        ...(payload.value !== undefined ? { value: payload.value } : {}),
      };

      if (existingIndex >= 0) {
        state.items[existingIndex] = {
          ...state.items[existingIndex],
          ...next,
        };
      } else {
        state.items.push(next);
      }
    },
    upsertManyHabitLogs: (state, action: PayloadAction<UpsertHabitLogPayload[]>) => {
      for (const payload of action.payload) {
        const id =
          'id' in payload && payload.id ? payload.id : `${payload.habitId}-${payload.date}`;

        const existingIndex = state.items.findIndex((log) => log.id === id);

        const base: HabitLog = {
          id,
          habitId: payload.habitId,
          date: payload.date,
        };

        const next: HabitLog = {
          ...base,
          ...(payload.completed !== undefined ? { completed: payload.completed } : {}),
          ...(payload.value !== undefined ? { value: payload.value } : {}),
        };

        if (existingIndex >= 0) {
          state.items[existingIndex] = {
            ...state.items[existingIndex],
            ...next,
          };
        } else {
          state.items.push(next);
        }
      }
    },
    clearHabitLogs: (state) => {
      state.items = [];
    },
    setSelectedRange: (state, action: PayloadAction<DateRange | null>) => {
      state.selectedRange = action.payload;
    },
  },
});

export const {
  setHabitLogs,
  upsertHabitLog,
  upsertManyHabitLogs,
  clearHabitLogs,
  setSelectedRange,
} = habitLogsSlice.actions;

// Базовые селекторы
export const selectHabitLogs = createSelector(
  [(state: { habitLogs: HabitLogsState }) => state.habitLogs.items],
  (items) => [...items],
);

export const selectSelectedRange = createSelector(
  [(state: { habitLogs: HabitLogsState }) => state.habitLogs.selectedRange],
  (selectedRange) => (selectedRange ? { ...selectedRange } : null),
);

// Вспомогательные функции для расчёта статистики
function isHabitCompleted(log: HabitLog, habit: Habit): boolean {
  if (habit.type === 'quantitative') {
    return (log.value ?? 0) >= (habit.target ?? 1);
  }
  return log.completed === true;
}

function isHabitPartiallyCompleted(log: HabitLog, habit: Habit): boolean {
  if (habit.type === 'quantitative') {
    return (log.value ?? 0) > 0;
  }
  return log.completed === true;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Селектор для получения всех выполненных дней (хотя бы одна привычка выполнена)
export const selectCompletedDays = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits) => {
    const habitsMap = new Map(habits.map((h) => [h.id, h]));
    const completedDays = new Set<string>();

    logs.forEach((log) => {
      const habit = habitsMap.get(log.habitId);
      if (habit && isHabitPartiallyCompleted(log, habit)) {
        completedDays.add(log.date);
      }
    });

    return completedDays;
  },
);

// Селектор для получения дней со 100% выполнением (все привычки выполнены)
export const selectPerfectDays = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits) => {
    const habitsMap = new Map(habits.map((h) => [h.id, h]));

    // Группируем логи по датам
    const logsByDate = new Map<string, HabitLog[]>();
    logs.forEach((log) => {
      const dateLogs = logsByDate.get(log.date) || [];
      dateLogs.push(log);
      logsByDate.set(log.date, dateLogs);
    });

    const perfectDays = new Set<string>();

    logsByDate.forEach((dateLogs, date) => {
      // Проверяем, все ли привычки выполнены в этот день
      const completedHabitsCount = dateLogs.filter((log) => {
        const habit = habitsMap.get(log.habitId);
        return habit && isHabitCompleted(log, habit);
      }).length;

      if (completedHabitsCount === habits.length && habits.length > 0) {
        perfectDays.add(date);
      }
    });

    return perfectDays;
  },
);

// Селектор для расчёта текущего стрика (промежуточный вариант)
// Стрик идёт если выполнена хотя бы одна привычка ИЛИ количественная > 0
export const selectCurrentStreak = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits): number => {
    const habitsMap = new Map(habits.map((h) => [h.id, h]));

    if (!habits.length || !logs.length) return 0;

    // Получаем все выполненные дни (хотя бы одна привычка)
    const completedDays = new Set<string>();
    logs.forEach((log) => {
      const habit = habitsMap.get(log.habitId);
      if (habit && isHabitPartiallyCompleted(log, habit)) {
        completedDays.add(log.date);
      }
    });

    const today = new Date();
    let checkDate = new Date(today);
    let currentStreak = 0;

    // Проверяем сегодня или вчера
    if (!completedDays.has(formatDate(checkDate))) {
      checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Считаем стрик
    while (completedDays.has(formatDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return currentStreak;
  },
);

// Селектор для расчёта максимального стрика
export const selectMaxStreak = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits): number => {
    const habitsMap = new Map(habits.map((h) => [h.id, h]));

    if (!logs.length) return 0;

    // Получаем все выполненные дни
    const completedDays = new Set<string>();
    logs.forEach((log) => {
      const habit = habitsMap.get(log.habitId);
      if (habit && isHabitPartiallyCompleted(log, habit)) {
        completedDays.add(log.date);
      }
    });

    const sortedDates = Array.from(completedDays).sort();
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const diff = date.getTime() - lastDate.getTime();
        const diffDays = diff / (1000 * 3600 * 24);
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      lastDate = date;
    }

    return maxStreak;
  },
);

// Селектор для расчёта количества дней со 100% выполнением за период
export const selectPerfectDaysCount = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits): number => {
    const perfectDays = selectPerfectDays.resultFunc(logs, habits);
    return perfectDays.size;
  },
);

// Селектор для расчёта серии конкретной привычки
export const selectHabitStreak = (habitId: string) =>
  createSelector(
    [
      (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
      (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
    ],
    (logs, habits): number => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return 0;

      // Фильтруем логи только для этой привычки
      const habitLogs = logs.filter((log) => log.habitId === habitId);

      // Получаем все выполненные дни для этой привычки
      const completedDays = new Set<string>();
      habitLogs.forEach((log) => {
        if (isHabitPartiallyCompleted(log, habit)) {
          completedDays.add(log.date);
        }
      });

      if (completedDays.size === 0) return 0;

      const today = new Date();
      let checkDate = new Date(today);
      let currentStreak = 0;

      // Проверяем сегодня или вчера
      if (!completedDays.has(formatDate(checkDate))) {
        checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Считаем стрик
      while (completedDays.has(formatDate(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      return currentStreak;
    },
  );

// Селектор для получения всех серий привычек
export const selectAllHabitStreaks = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits): Map<string, number> => {
    const streaks = new Map<string, number>();

    habits.forEach((habit) => {
      const habitLogs = logs.filter((log) => log.habitId === habit.id);

      const completedDays = new Set<string>();
      habitLogs.forEach((log) => {
        if (isHabitPartiallyCompleted(log, habit)) {
          completedDays.add(log.date);
        }
      });

      if (completedDays.size === 0) {
        streaks.set(habit.id, 0);
        return;
      }

      const today = new Date();
      let checkDate = new Date(today);
      let currentStreak = 0;

      if (!completedDays.has(formatDate(checkDate))) {
        checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (completedDays.has(formatDate(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      streaks.set(habit.id, currentStreak);
    });

    return streaks;
  },
);

// Селектор для получения лучшей серии среди всех привычек
export const selectBestStreak = createSelector(
  [
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habitLogs.items,
    (state: { habitLogs: HabitLogsState; habits: { items: Habit[] } }) => state.habits.items,
  ],
  (logs, habits): { habitName: string; streak: number } | null => {
    const streaks = selectAllHabitStreaks.resultFunc(logs, habits);

    let bestStreak = 0;
    let bestHabitName = '';

    habits.forEach((habit) => {
      const streak = streaks.get(habit.id) ?? 0;
      if (streak > bestStreak) {
        bestStreak = streak;
        bestHabitName = habit.name;
      }
    });

    if (bestStreak === 0) return null;

    return { habitName: bestHabitName, streak: bestStreak };
  },
);

// Селектор для получения логов за конкретный день
export const selectLogsByDate = (dateKey: string) =>
  createSelector(
    [(state: { habitLogs: HabitLogsState }) => state.habitLogs.items],
    (logs) => logs.filter((log) => log.date === dateKey),
  );

// Селектор для проверки, можно ли отмечать привычку в указанный день
// (день не позже сегодняшнего и не раньше создания привычки)
export const selectCanMarkHabit = (habitId: string, dateKey: string) =>
  createSelector(
    [(state: { habits: { items: Habit[] } }) => state.habits.items],
    (habits): boolean => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return false;

      const today = formatDate(new Date());
      const habitCreatedDate = habit.createdAt?.split('T')[0] ?? '';

      // Нельзя отмечать будущие дни
      if (dateKey > today) return false;

      // Нельзя отмечать дни до создания привычки
      if (habitCreatedDate && dateKey < habitCreatedDate) return false;

      return true;
    },
  );

export default habitLogsSlice.reducer;
