import { describe, it, expect } from 'vitest';
import type { Habit } from '../types/habit.types';
import {
  selectHabits,
  selectActiveHabits,
  selectPausedHabits,
  type HabitsState,
} from './habitsSlice';

const habitsFixture: Habit[] = [
  {
    id: 'habit-1',
    name: 'Зарядка',
    description: 'Утренняя зарядка',
    categoryId: 'health',
    color: '--primary',
    icon: '🏃',
    type: 'binary',
    createdAt: '2026-02-01',
  },
  {
    id: 'habit-2',
    name: 'Чтение',
    description: 'Чтение книг',
    categoryId: 'learning',
    color: '--chart-1',
    icon: '📚',
    type: 'quantitative',
    target: 10,
    unit: 'страниц',
    createdAt: '2026-02-01',
    status: 'active',
  },
  {
    id: 'habit-3',
    name: 'Бег',
    description: 'Пробежка вечером',
    categoryId: 'sport',
    color: '--chart-2',
    icon: '🏃‍♂️',
    type: 'binary',
    createdAt: '2026-02-01',
    status: 'paused',
  },
];

describe('habitsSlice selectors', () => {
  describe('selectHabits', () => {
    it('должен возвращать все привычки', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result = selectHabits(rootState);

      expect(result).toEqual(habitsFixture);
      expect(result).toHaveLength(3);
    });

    it('должен возвращать пустой массив, если привычек нет', () => {
      const state: HabitsState = {
        items: [],
        loading: false,
      };

      const rootState = { habits: state };
      const result = selectHabits(rootState);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('должен быть мемоизирован и возвращать ту же ссылку при неизменных данных', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result1 = selectHabits(rootState);
      const result2 = selectHabits(rootState);

      expect(result1).toBe(result2);
    });
  });

  describe('selectActiveHabits', () => {
    it('должен возвращать только активные привычки', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result = selectActiveHabits(rootState);

      expect(result).toHaveLength(2);
      expect(result.map((h) => h.id)).toContain('habit-1'); // без status или undefined
      expect(result.map((h) => h.id)).toContain('habit-2'); // active
    });

    it('должен исключать приостановленные привычки', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result = selectActiveHabits(rootState);

      const pausedIds = result.map((h) => h.id);
      expect(pausedIds).not.toContain('habit-3');
    });

    it('должен быть мемоизирован и возвращать ту же ссылку при неизменных данных', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result1 = selectActiveHabits(rootState);
      const result2 = selectActiveHabits(rootState);

      expect(result1).toBe(result2);
    });
  });

  describe('selectPausedHabits', () => {
    it('должен возвращать только приостановленные привычки', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result = selectPausedHabits(rootState);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('habit-3');
      expect(result[0].status).toBe('paused');
    });

    it('должен возвращать пустой массив, если нет приостановленных привычек', () => {
      const activeHabits: Habit[] = habitsFixture.filter((h) => h.status !== 'paused');
      const state: HabitsState = {
        items: activeHabits,
        loading: false,
      };

      const rootState = { habits: state };
      const result = selectPausedHabits(rootState);

      expect(result).toHaveLength(0);
    });

    it('должен быть мемоизирован и возвращать ту же ссылку при неизменных данных', () => {
      const state: HabitsState = {
        items: habitsFixture,
        loading: false,
      };

      const rootState = { habits: state };
      const result1 = selectPausedHabits(rootState);
      const result2 = selectPausedHabits(rootState);

      expect(result1).toBe(result2);
    });
  });
});
