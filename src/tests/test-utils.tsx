/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ReactElement, ReactNode } from 'react';

import {
  habitsReducer,
  type HabitsState,
  initialState as habitsInitialState,
} from '@features/habits/store';
import {
  habitLogsReducer,
  type HabitLogsState,
  initialState as habitLogsInitialState,
} from '@features/statistics/store';
import { settingsReducer } from '@features/settings/store';

interface PreloadedState {
  habits?: Partial<HabitsState>;
  habitLogs?: Partial<HabitLogsState>;
  settings?: {
    userName?: string;
    dateFormat?: string;
  };
}

function createTestStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: {
      habits: habitsReducer,
      habitLogs: habitLogsReducer,
      settings: settingsReducer,
    },
    preloadedState: {
      habits: {
        ...habitsInitialState,
        ...preloadedState?.habits,
      },
      habitLogs: {
        ...habitLogsInitialState,
        ...preloadedState?.habitLogs,
      },
      settings: {
        userName: '',
        dateFormat: 'dd.MM.yyyy',
        ...preloadedState?.settings,
      },
    },
  });
}

interface AllTheProvidersProps {
  children: ReactNode;
  preloadedState?: PreloadedState;
}

function AllTheProviders({ children, preloadedState }: AllTheProvidersProps) {
  return <Provider store={createTestStore(preloadedState)}>{children}</Provider>;
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
}

export function renderWithProviders(ui: ReactElement, options?: RenderWithProvidersOptions) {
  const { preloadedState, ...renderOptions } = options ?? {};

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders preloadedState={preloadedState}>{children}</AllTheProviders>
  );

  return render(ui, { wrapper, ...renderOptions });
}

export * from '@testing-library/react';
