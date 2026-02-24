import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { habitsReducer } from '@features/habits/store';
import { habitLogsReducer } from '@features/statistics/store';
import { settingsReducer } from '@features/settings/store';
import { HomeMiniStats } from './HomeMiniStats';

describe('HomeMiniStats', () => {
  it('рендерит заголовок и вызывает действия', () => {
    const store = configureStore({
      reducer: {
        habits: habitsReducer,
        habitLogs: habitLogsReducer,
        settings: settingsReducer,
      },
      preloadedState: {
        habits: { items: [], loading: false },
        habitLogs: {
          items: [],
          selectedRange: {
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
          },
        },
      },
    });

    const onMarkAll = vi.fn();
    const onUnmarkAll = vi.fn();

    const { getByText } = render(
      <Provider store={store}>
        <HomeMiniStats onMarkAll={onMarkAll} onUnmarkAll={onUnmarkAll} />
      </Provider>,
    );

    expect(getByText('Статистика')).toBeInTheDocument();
    const markBtn = getByText('Отметить всё за сегодня');
    markBtn.click();
    expect(onMarkAll).toHaveBeenCalled();
  });
});
