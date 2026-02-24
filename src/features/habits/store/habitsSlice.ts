import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Habit } from '../types/habit.types';

export interface HabitsState {
  items: Habit[];
  loading: boolean;
}

const initialState: HabitsState = {
  items: [],
  loading: false,
};

export { initialState };

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.items = action.payload;
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.items.push(action.payload);
    },
    removeHabit: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((habit) => habit.id !== action.payload);
    },
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.items.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { setHabits, addHabit, removeHabit, updateHabit } = habitsSlice.actions;

// Селекторы с мемоизацией
// Поддерживают оба пути: state.habits (старый) и state.nodes (новый)
type StateWithHabitsOrNodes = {
  habits?: HabitsState;
  nodes?: HabitsState;
};

export const selectHabits = (state: StateWithHabitsOrNodes) =>
  (state.habits || state.nodes)?.items ?? [];

export const selectActiveHabits = (state: StateWithHabitsOrNodes) =>
  ((state.habits || state.nodes)?.items ?? []).filter(
    (habit) => habit.status === 'active' || habit.status === undefined,
  );

export const selectPausedHabits = (state: StateWithHabitsOrNodes) =>
  ((state.habits || state.nodes)?.items ?? []).filter((habit) => habit.status === 'paused');

export default habitsSlice.reducer;
