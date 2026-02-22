import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Habit } from "../types/habit.types";

interface HabitsState {
  items: Habit[]
  loading: boolean
}

const initialState: HabitsState = {
  items: [],
  loading: false,
};

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.items = action.payload
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.items.push(action.payload)
    },
    removeHabit: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((habit) => habit.id !== action.payload)
    },
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.items.findIndex((h) => h.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
  },
});

export const { setHabits, addHabit, removeHabit, updateHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
