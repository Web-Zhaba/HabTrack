import { describe, it, expect } from 'vitest';
import { screen, fireEvent, renderWithProviders } from '../../../tests/test-utils';
import { HabitCard } from './HabitCard';
import { MemoryRouter } from 'react-router';
import type { Habit } from '../store';

describe('HabitCard', () => {
  it('рендерит бинарную привычку и переключает состояние', async () => {
    const habit: Habit = {
      id: 'habit-binary',
      name: 'Медитация',
      color: '--chart-2',
      icon: 'activity',
      type: 'binary',
      createdAt: new Date().toISOString().split('T')[0],
    };

    renderWithProviders(
      <MemoryRouter>
        <HabitCard habit={habit} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Медитация')).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /Отметить выполнение/i });
    fireEvent.click(toggleButton);

    expect(await screen.findByText('Выполнено сегодня')).toBeInTheDocument();
  });

  it('рендерит количественную привычку и изменяет значение', async () => {
    const habit: Habit = {
      id: 'habit-quant',
      name: 'Чтение',
      color: '--chart-1',
      icon: 'book',
      type: 'quantitative',
      target: 3,
      unit: 'стр',
      createdAt: new Date().toISOString().split('T')[0],
    };

    renderWithProviders(
      <MemoryRouter>
        <HabitCard habit={habit} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Чтение')).toBeInTheDocument();

    const plus = screen.getByRole('button', { name: 'increase' });
    fireEvent.click(plus);

    expect(await screen.findByText(/1 стр/i)).toBeInTheDocument();

    const minus = screen.getByRole('button', { name: 'decrease' });
    fireEvent.click(minus);

    expect(await screen.findByText(/0 стр/i)).toBeInTheDocument();
  });
});
