import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { nodesReducer } from '@features/nodes/store';
import { habitLogsReducer } from '@features/statistics/store';
import { settingsReducer } from '@features/settings/store';
import type { NodesState } from '@features/nodes/store';
import type { HabitLogsState } from '@features/statistics/store';
import type { SettingsState } from '@features/settings/store';
// import authReducer from '@features/auth/store/authSlice';

/**
 * Текущая версия схемы состояния
 * Увеличивается при изменении структуры данных
 */
const STATE_VERSION = 2;

interface StoredState {
  version: number;
  nodes: NodesState;
  habitLogs: HabitLogsState;
  settings: SettingsState;
}

/**
 * Миграции между версиями состояния
 */
const migrations: Record<number, (state: any) => any> = {
  // Миграция 1: habits → nodes (переименование)
  1: (state) => {
    const newState = { ...state };
    if (newState.habits && !newState.nodes) {
      newState.nodes = newState.habits;
      delete newState.habits;
    }
    return newState;
  },
  // Миграция 2: очистка habits из localStorage
  2: (state) => {
    const newState = { ...state };
    // Удаляем habits если есть nodes
    if (newState.habits) {
      delete newState.habits;
    }
    return newState;
  },
};

/**
 * Применяет миграции к загруженному состоянию
 */
function migrateState(state: unknown): StoredState | undefined {
  const stored = state as any;
  if (!stored) return undefined;

  const storedVersion = stored.version ?? 0;

  // Если версия актуальна - возвращаем как есть
  if (storedVersion === STATE_VERSION) {
    return stored as StoredState;
  }

  // Применяем миграции последовательно
  let migrated = { ...stored };
  for (let version = storedVersion + 1; version <= STATE_VERSION; version++) {
    const migration = migrations[version];
    if (migration) {
      migrated = migration(migrated);
    }
  }

  // Гарантируем что nodes существует (для миграции с version 0)
  if (!migrated.nodes && migrated.habits) {
    migrated.nodes = migrated.habits;
    delete migrated.habits;
  }

  return {
    ...migrated,
    version: STATE_VERSION,
  } as StoredState;
}

function loadState() {
  if (typeof window === 'undefined') return undefined;

  try {
    const serialized = window.localStorage.getItem('habtrack-data');
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized);
    return migrateState(parsed);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return undefined;
  }
}

function saveState(state: StoredState) {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify({
      ...state,
      version: STATE_VERSION,
    });
    window.localStorage.setItem('habtrack-data', serialized);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

const preloadedState = loadState();

const rootReducer = combineReducers({
  nodes: nodesReducer,
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
    version: STATE_VERSION,
    nodes: state.nodes,
    habitLogs: state.habitLogs,
    settings: state.settings,
  } as StoredState);
});

// Типизация корневого состояния и dispatch
// Добавлены алиасы для обратной совместимости (habits → nodes)
export interface RootState {
  nodes: NodesState;
  habits: NodesState; // Алиас для обратной совместимости
  habitLogs: HabitLogsState;
  settings: SettingsState;
}

// Helper для создания RootState из store
export function createRootState(state: ReturnType<typeof store.getState>): RootState {
  return {
    ...state,
    habits: state.nodes, // Алиас для обратной совместимости
  };
}

export type AppDispatch = typeof store.dispatch;
