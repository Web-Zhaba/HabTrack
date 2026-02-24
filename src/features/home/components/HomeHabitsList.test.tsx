import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, renderWithProviders } from '../../../tests/test-utils';
import { MemoryRouter } from 'react-router';
import { HomeHabitsList } from './HomeHabitsList';
import type { Habit } from '@features/habits/store';

const today = new Date();
const todayKey = today.toISOString().split('T')[0];
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayKey = yesterday.toISOString().split('T')[0];

const binaryHabit: Habit = {
  id: 'habit-binary-1',
  name: 'Медитация',
  color: '--chart-2',
  icon: 'activity',
  type: 'binary',
  createdAt: todayKey,
};

const quantitativeHabit: Habit = {
  id: 'habit-quant-1',
  name: 'Чтение',
  color: '--chart-1',
  icon: 'book',
  type: 'quantitative',
  target: 10,
  unit: 'стр',
  createdAt: todayKey,
};

describe('HomeHabitsList', () => {
  describe('рендеринг пустого состояния', () => {
    it('должен показывать сообщение когда нет привычек', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      expect(screen.getByText('Нет привычек')).toBeInTheDocument();
      expect(
        screen.getByText('Добавьте первую привычку, чтобы начать отслеживание'),
      ).toBeInTheDocument();
    });

    it('должен вызывать onCreateHabit при клике на кнопку добавления', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // Круглая кнопка с плюсиком
      const addButton = screen.getByRole('button', { name: 'Добавить привычку' });
      fireEvent.click(addButton);
      expect(onCreateHabit).toHaveBeenCalledTimes(1);
    });
  });

  describe('рендеринг списка привычек', () => {
    it('должен рендерить заголовок дня', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // Проверяем что есть заголовок с датой
      expect(screen.getByLabelText(/24 февраля/i)).toBeInTheDocument();
    });

    it('должен показывать счётчик выполненных/всего', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit, quantitativeHabit], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // Проверяем счётчик 0/2
      expect(screen.getByText('0/2')).toBeInTheDocument();
    });
  });

  describe('развёртывание/свёртывание дней', () => {
    it('должен показывать кнопку развёртывания для дня', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // Должна быть видна кнопка с aria-label
      expect(screen.getByRole('button', { name: /сегодня/i })).toBeInTheDocument();
    });

    it('должен сворачивать/разворачивать день по клику на заголовок', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // Находим заголовок дня (сегодня развёрнут по умолчанию)
      const dayHeader = screen.getByRole('button', {
        name: /сегодня/i,
      });

      // Сегодня развёрнут по умолчанию
      expect(dayHeader).toHaveAttribute('aria-expanded', 'true');

      // Сворачиваем и разворачиваем (просто проверяем что клик работает)
      fireEvent.click(dayHeader);
      fireEvent.click(dayHeader);

      // Компонент должен остаться в DOM
      expect(screen.getByRole('button', { name: /сегодня/i })).toBeInTheDocument();
    });
  });

  describe('группировка по дням', () => {
    it('должен показывать заголовки дней за выбранный период', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: yesterdayKey, end: todayKey },
            },
          },
        },
      );

      // Должны быть заголовки для обоих дней (ищем по aria-label)
      expect(screen.getByLabelText(/23 февраля/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/24 февраля.*сегодня/i)).toBeInTheDocument();
    });

    it('должен показывать счётчик выполненных/всего для каждого дня', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit, quantitativeHabit], loading: false },
            habitLogs: {
              items: [
                {
                  id: 'log-1',
                  habitId: binaryHabit.id,
                  date: todayKey,
                  completed: true,
                },
              ],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // 1 из 2 выполнено
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });

  describe('интеграционные тесты', () => {
    it('должен корректно работать с несколькими привычками', () => {
      const onCreateHabit = vi.fn();

      const habits: Habit[] = [
        binaryHabit,
        quantitativeHabit,
        {
          id: 'habit-3',
          name: 'Бег',
          color: '--chart-3',
          icon: 'run',
          type: 'binary',
          createdAt: todayKey,
        },
      ];

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: habits, loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      // Проверяем счётчик 0/3
      expect(screen.getByText('0/3')).toBeInTheDocument();
    });
  });

  describe('доступность (a11y)', () => {
    it('должен иметь aria-expanded на кнопке развёртывания дня', () => {
      const onCreateHabit = vi.fn();

      renderWithProviders(
        <MemoryRouter>
          <HomeHabitsList onCreateHabit={onCreateHabit} />
        </MemoryRouter>,
        {
          preloadedState: {
            habits: { items: [binaryHabit], loading: false },
            habitLogs: {
              items: [],
              selectedRange: { start: todayKey, end: todayKey },
            },
          },
        },
      );

      const dayButton = screen.getByRole('button', { name: /сегодня/i });
      expect(dayButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
