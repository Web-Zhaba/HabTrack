import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ReactElement, ReactNode } from 'react';

import habitsReducer from '@features/habits/store/habitsSlice';
import habitLogsReducer from '@features/statistics/store/habitLogsSlice';

function createTestStore() {
  return configureStore({
    reducer: {
      habits: habitsReducer,
      habitLogs: habitLogsReducer,
    },
  });
}

interface AllTheProvidersProps {
  children: ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  return <Provider store={createTestStore()}>{children}</Provider>;
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
