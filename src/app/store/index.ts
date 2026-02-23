import { combineReducers, configureStore } from '@reduxjs/toolkit';
import habitsReducer from '@features/habits/store/habitsSlice';
import habitLogsReducer from '@features/statistics/store/habitLogsSlice';
import settingsReducer from '@features/settings/store/settingsSlice';
// import authReducer from '@features/auth/store/authSlice';

function loadState() {
  if (typeof window === 'undefined') return undefined;

  try {
    const serialized = window.localStorage.getItem('habtrack-data');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
}

function saveState(state: unknown) {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem('habtrack-data', serialized);
  } catch {
    // ignore
  }
}

const preloadedState = loadState();

const rootReducer = combineReducers({
  habits: habitsReducer,
  habitLogs: habitLogsReducer,
  settings: settingsReducer,
  // auth: authReducer,
  // ... другие редьюсеры
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    habits: state.habits,
    habitLogs: state.habitLogs,
    settings: state.settings,
  });
});

// Типизация корневого состояния и dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
