import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { HabitLog } from '@/types/HabitLog.types';

export interface HabitLogsState {
  items: HabitLog[];
  selectedRange: DateRange | null;
}

const initialState: HabitLogsState = {
  items: [],
  selectedRange: null,
};

export { initialState };

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

// статистические утилиты перемещены в habitStatsSlice

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
  (items) => items,
);

export const selectSelectedRange = createSelector(
  [(state: { habitLogs: HabitLogsState }) => state.habitLogs.selectedRange],
  (selectedRange) => selectedRange,
);

// селекторы статистики перемещены в habitStatsSlice

export default habitLogsSlice.reducer;
