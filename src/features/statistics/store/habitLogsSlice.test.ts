import { describe, it, expect } from 'vitest';
import type { Habit } from '../../habits/types/habit.types';
import type { HabitLog } from '@/types/HabitLog.types';
import { setSelectedRange, selectSelectedRange, selectHabitLogs, upsertHabitLog, upsertManyHabitLogs, type HabitLogsState, type DateRange } from './habitLogsSlice';
import { calculateHabitRangeProgress, groupHabitsByDay, selectCompletedDays, selectPerfectDays, selectCurrentStreak, selectMaxStreak, selectPerfectDaysCount } from './habitStatsSlice';
import habitLogsReducer from './habitLogsSlice';

const habitsFixture: Habit[] = [
  {
    id: 'habit-binary',
    name: 'Утренняя зарядка',
    description: 'Короткая зарядка утром',
    categoryId: 'health',
    color: '--primary',
    icon: 'run',
    type: 'binary',
    createdAt: '2026-02-01',
  },
  {
    id: 'habit-quant',
    name: 'Чтение',
    description: 'Чтение книг',
    categoryId: 'learning',
    color: '--chart-1',
    icon: 'book',
    type: 'quantitative',
    target: 10,
    unit: 'страниц',
    createdAt: '2026-02-01',
  },
];

const logsFixture: HabitLog[] = [
  {
    id: 'log-1',
    habitId: 'habit-binary',
    date: '2026-02-20',
    completed: true,
  },
  {
    id: 'log-2',
    habitId: 'habit-quant',
    date: '2026-02-20',
    value: 5,
  },
  {
    id: 'log-3',
    habitId: 'habit-quant',
    date: '2026-02-21',
    value: 10,
  },
];

describe('calculateHabitRangeProgress', () => {
  it('должен корректно рассчитывать прогресс для валидного диапазона', () => {
    const range: DateRange = {
      start: '2026-02-20',
      end: '2026-02-21',
    };

    const result = calculateHabitRangeProgress(habitsFixture, logsFixture, range);

    const expectedPlanned = 2 + 10 * 2;
    const expectedCompleted = 1 + 5 + 10;
    const expectedPercent =
      expectedPlanned > 0 ? Math.round((expectedCompleted / expectedPlanned) * 100) : 0;

    expect(result.totalPlanned).toBe(expectedPlanned);
    expect(result.totalCompleted).toBe(expectedCompleted);
    expect(result.percent).toBe(expectedPercent);
  });

  it('должен возвращать ноль для невалидного диапазона', () => {
    const range: DateRange = {
      start: '2026-02-21',
      end: '2026-02-20',
    };

    const result = calculateHabitRangeProgress(habitsFixture, logsFixture, range);

    expect(result.totalPlanned).toBe(0);
    expect(result.totalCompleted).toBe(0);
    expect(result.percent).toBe(0);
  });
});

describe('groupHabitsByDay', () => {
  it('должен группировать привычки по дням для валидного диапазона', () => {
    const range: DateRange = {
      start: '2026-02-20',
      end: '2026-02-21',
    };

    const groups = groupHabitsByDay(habitsFixture, logsFixture, range);

    expect(groups).toHaveLength(2);

    groups.forEach((group) => {
      expect(group.weekdayLabel).toBeDefined();
      expect(group.items).toHaveLength(habitsFixture.length);
    });
  });
});

describe('selectedRange reducer and selector', () => {
  it('должен устанавливать выбранный диапазон через reducer', () => {
    const initialState: HabitLogsState = {
      items: [],
      selectedRange: null,
    };

    const range: DateRange = {
      start: '2026-02-20',
      end: '2026-02-21',
    };

    const nextState = habitLogsReducer(initialState, setSelectedRange(range));

    expect(nextState.selectedRange).toBeDefined();
    expect(nextState.selectedRange?.start).toBe(range.start);
    expect(nextState.selectedRange?.end).toBe(range.end);
  });

  it('должен возвращать selectedRange через селектор', () => {
    const range: DateRange = {
      start: '2026-02-20',
      end: '2026-02-21',
    };

    const state: HabitLogsState = {
      items: [],
      selectedRange: range,
    };

    const rootState = { habitLogs: state };
    const selected = selectSelectedRange(rootState);

    expect(selected).toBeDefined();
    expect(selected?.start).toBe(range.start);
    expect(selected?.end).toBe(range.end);
  });
});

describe('интеграционный тест DateRange', () => {
  it('должен корректно работать в связке reducer + утилиты', () => {
    let state = habitLogsReducer(undefined, { type: '@@INIT' });

    const range: DateRange = {
      start: '2026-02-20',
      end: '2026-02-21',
    };

    state = habitLogsReducer(state, setSelectedRange(range));

    expect(state.selectedRange).toBeDefined();

    const progress = calculateHabitRangeProgress(habitsFixture, logsFixture, state.selectedRange!);
    const groups = groupHabitsByDay(habitsFixture, logsFixture, state.selectedRange!);

    expect(progress.totalPlanned).toBeGreaterThan(0);
    expect(groups).toHaveLength(2);
  });
});

describe('habitLogsSlice selectors', () => {
  describe('selectHabitLogs', () => {
    it('должен возвращать все логи', () => {
      const state: HabitLogsState = {
        items: logsFixture,
        selectedRange: null,
      };

      const rootState = { habitLogs: state };
      const result = selectHabitLogs(rootState);

      expect(result).toEqual(logsFixture);
      expect(result).toHaveLength(3);
    });

    it('должен быть мемоизирован и возвращать ту же ссылку при неизменных данных', () => {
      const state: HabitLogsState = {
        items: logsFixture,
        selectedRange: null,
      };

      const rootState = { habitLogs: state };
      const result1 = selectHabitLogs(rootState);
      const result2 = selectHabitLogs(rootState);

      expect(result1).toBe(result2);
    });
  });

  describe('selectCompletedDays', () => {
    it('должен возвращать Set с датами, где выполнена хотя бы одна привычка', () => {
      const state = {
        habitLogs: {
          items: logsFixture,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result = selectCompletedDays(state);

      expect(result).toBeInstanceOf(Set);
      expect(result.has('2026-02-20')).toBe(true);
      expect(result.has('2026-02-21')).toBe(true);
    });

    it('должен быть мемоизирован', () => {
      const state = {
        habitLogs: {
          items: logsFixture,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result1 = selectCompletedDays(state);
      const result2 = selectCompletedDays(state);

      expect(result1).toBe(result2);
    });
  });

  describe('selectPerfectDays', () => {
    it('должен возвращать Set с датами, где выполнены все привычки', () => {
      const perfectLogs: HabitLog[] = [
        {
          id: 'log-1',
          habitId: 'habit-binary',
          date: '2026-02-20',
          completed: true,
        },
        {
          id: 'log-2',
          habitId: 'habit-quant',
          date: '2026-02-20',
          value: 10,
        },
      ];

      const state = {
        habitLogs: {
          items: perfectLogs,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result = selectPerfectDays(state);

      expect(result).toBeInstanceOf(Set);
      expect(result.has('2026-02-20')).toBe(true);
    });

    it('должен быть мемоизирован', () => {
      const state = {
        habitLogs: {
          items: logsFixture,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result1 = selectPerfectDays(state);
      const result2 = selectPerfectDays(state);

      expect(result1).toBe(result2);
    });
  });

  describe('selectCurrentStreak', () => {
    it('должен возвращать 0, если нет логов', () => {
      const state = {
        habitLogs: {
          items: [],
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result = selectCurrentStreak(state);
      expect(result).toBe(0);
    });

    it('должен быть мемоизирован', () => {
      const state = {
        habitLogs: {
          items: logsFixture,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result1 = selectCurrentStreak(state);
      const result2 = selectCurrentStreak(state);

      expect(result1).toBe(result2);
    });
  });

  describe('selectMaxStreak', () => {
    it('должен возвращать 0, если нет логов', () => {
      const state = {
        habitLogs: {
          items: [],
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result = selectMaxStreak(state);
      expect(result).toBe(0);
    });

    it('должен быть мемоизирован', () => {
      const state = {
        habitLogs: {
          items: logsFixture,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result1 = selectMaxStreak(state);
      const result2 = selectMaxStreak(state);

      expect(result1).toBe(result2);
    });
  });

  describe('selectPerfectDaysCount', () => {
    it('должен возвращать количество дней со 100% выполнением', () => {
      const perfectLogs: HabitLog[] = [
        {
          id: 'log-1',
          habitId: 'habit-binary',
          date: '2026-02-20',
          completed: true,
        },
        {
          id: 'log-2',
          habitId: 'habit-quant',
          date: '2026-02-20',
          value: 10,
        },
      ];

      const state = {
        habitLogs: {
          items: perfectLogs,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result = selectPerfectDaysCount(state);
      expect(result).toBe(1);
    });

    it('должен быть мемоизирован', () => {
      const state = {
        habitLogs: {
          items: logsFixture,
          selectedRange: null,
        },
        habits: {
          items: habitsFixture,
        },
      };

      const result1 = selectPerfectDaysCount(state);
      const result2 = selectPerfectDaysCount(state);

      expect(result1).toBe(result2);
    });
  });
});

describe('upsertHabitLog action', () => {
  it('должен создавать новый лог для бинарной привычки', () => {
    const initialState: HabitLogsState = {
      items: [],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertHabitLog({
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: true,
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].habitId).toBe('habit-binary');
    expect(state.items[0].date).toBe('2026-02-20');
    expect(state.items[0].completed).toBe(true);
    expect(state.items[0].id).toBe('habit-binary-2026-02-20');
  });

  it('должен создавать новый лог для количественной привычки', () => {
    const initialState: HabitLogsState = {
      items: [],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertHabitLog({
        habitId: 'habit-quant',
        date: '2026-02-20',
        value: 5,
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].habitId).toBe('habit-quant');
    expect(state.items[0].value).toBe(5);
  });

  it('должен обновлять существующий лог (upsert)', () => {
    const initialState: HabitLogsState = {
      items: [
        {
          id: 'habit-binary-2026-02-20',
          habitId: 'habit-binary',
          date: '2026-02-20',
          completed: false,
        },
      ],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertHabitLog({
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: true,
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].completed).toBe(true);
  });

  it('должен использовать существующий id при обновлении', () => {
    const existingLog: HabitLog = {
      id: 'custom-log-id',
      habitId: 'habit-binary',
      date: '2026-02-20',
      completed: false,
    };

    const initialState: HabitLogsState = {
      items: [existingLog],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertHabitLog({
        id: 'custom-log-id',
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: true,
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('custom-log-id');
    expect(state.items[0].completed).toBe(true);
  });

  it('должен корректно обрабатывать переключение бинарной привычки', () => {
    const initialState: HabitLogsState = {
      items: [],
      selectedRange: null,
    };

    // Первое нажатие - отмечаем
    const state1 = habitLogsReducer(
      initialState,
      upsertHabitLog({
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: true,
      }),
    );
    expect(state1.items[0].completed).toBe(true);

    // Второе нажатие - снимаем отметку
    const state2 = habitLogsReducer(
      state1,
      upsertHabitLog({
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: false,
      }),
    );
    expect(state2.items[0].completed).toBe(false);
  });

  it('должен обновлять значение количественной привычки', () => {
    const initialState: HabitLogsState = {
      items: [
        {
          id: 'habit-quant-2026-02-20',
          habitId: 'habit-quant',
          date: '2026-02-20',
          value: 5,
        },
      ],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertHabitLog({
        habitId: 'habit-quant',
        date: '2026-02-20',
        value: 10,
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].value).toBe(10);
  });
});

describe('upsertManyHabitLogs action', () => {
  it('должен создавать несколько логов одновременно', () => {
    const initialState: HabitLogsState = {
      items: [],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertManyHabitLogs([
        { habitId: 'habit-binary', date: '2026-02-20', completed: true },
        { habitId: 'habit-quant', date: '2026-02-20', value: 10 },
      ]),
    );

    expect(state.items).toHaveLength(2);
  });

  it('должен смешивать создание и обновление логов', () => {
    const initialState: HabitLogsState = {
      items: [
        {
          id: 'habit-binary-2026-02-20',
          habitId: 'habit-binary',
          date: '2026-02-20',
          completed: false,
        },
      ],
      selectedRange: null,
    };

    const state = habitLogsReducer(
      initialState,
      upsertManyHabitLogs([
        { habitId: 'habit-binary', date: '2026-02-20', completed: true }, // update
        { habitId: 'habit-quant', date: '2026-02-20', value: 5 }, // create
      ]),
    );

    expect(state.items).toHaveLength(2);
    expect(state.items.find((l) => l.habitId === 'habit-binary')?.completed).toBe(true);
    expect(state.items.find((l) => l.habitId === 'habit-quant')?.value).toBe(5);
  });
});

describe('синхронизация данных', () => {
  it('должен генерировать одинаковый id для одинаковых habitId+date', () => {
    const initialState: HabitLogsState = {
      items: [],
      selectedRange: null,
    };

    // Создаём лог первым способом
    const state1 = habitLogsReducer(
      initialState,
      upsertHabitLog({
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: true,
      }),
    );

    // Создаём лог вторым способом (должен обновить, а не дублировать)
    const state2 = habitLogsReducer(
      state1,
      upsertHabitLog({
        habitId: 'habit-binary',
        date: '2026-02-20',
        completed: false,
      }),
    );

    expect(state2.items).toHaveLength(1);
    expect(state2.items[0].completed).toBe(false);
  });
});
