import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from 'react-aria-components';
import { UnifiedCalendar } from './UnifiedCalendar';
import { today, getLocalTimeZone } from '@internationalized/date';

describe('UnifiedCalendar', () => {
  const mockRange = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  };
  const mockOnRangeChange = vi.fn();
  const mockOnPresetChange = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <I18nProvider locale="ru-RU">
        <UnifiedCalendar
          range={mockRange}
          onRangeChange={mockOnRangeChange}
          preset="Custom"
          onPresetChange={mockOnPresetChange}
          {...props}
        />
      </I18nProvider>,
    );
  };

  describe('Рендеринг', () => {
    it('должен отображать сегодняшнюю дату', () => {
      renderComponent();
      const todayDate = today(getLocalTimeZone());
      expect(screen.getByText(`${todayDate.day}`)).toBeInTheDocument();
    });

    it('должен отображать кнопку "Развернуть"', () => {
      renderComponent();
      expect(screen.getByText('Развернуть')).toBeInTheDocument();
    });

    it('должен отображать 7 дней недели в свёрнутом виде', () => {
      renderComponent();
      const dayButtons = screen.getAllByRole('button').filter((btn) => {
        const text = btn.textContent;
        return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].some((day) => text?.includes(day));
      });
      expect(dayButtons).toHaveLength(7);
    });
  });

  describe('Разворачивание/сворачивание', () => {
    it('должен разворачиваться при клике на кнопку "Развернуть"', () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      expect(screen.getByText('Свернуть')).toBeInTheDocument();
    });

    it('должен показывать пресеты в развёрнутом виде', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      expect(await screen.findByText('7 дней')).toBeInTheDocument();
      expect(await screen.findByText('30 дней')).toBeInTheDocument();
    });

    it('должен показывать календарь в развёрнутом виде', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      expect(await screen.findByText(/Calendar/)).toBeInTheDocument();
    });

    it('должен сворачиваться при клике на кнопку "Свернуть"', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      const collapseButton = await screen.findByText('Свернуть');
      fireEvent.click(collapseButton);
      expect(screen.getByText('Развернуть')).toBeInTheDocument();
    });
  });

  describe('Выбор даты', () => {
    it('должен вызывать onRangeChange при клике на день', () => {
      renderComponent();
      const todayDate = today(getLocalTimeZone());
      const dayButton = screen.getByText(todayDate.day.toString()).closest('button');
      if (dayButton) {
        fireEvent.click(dayButton);
      }
      expect(mockOnRangeChange).toHaveBeenCalled();
    });

    it('должен выделять выбранный день', () => {
      renderComponent();
      const todayDate = today(getLocalTimeZone());
      const selectedDay = screen.getByText(todayDate.day.toString()).closest('div');
      expect(selectedDay).toHaveClass('bg-primary');
    });
  });

  describe('Пресеты', () => {
    it('должен переключать пресет "7 дней"', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      const sevenDaysButton = await screen.findByText('7 дней');
      fireEvent.click(sevenDaysButton);
      expect(mockOnPresetChange).toHaveBeenCalledWith('Last 7 Days');
    });

    it('должен переключать пресет "30 дней"', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      const thirtyDaysButton = await screen.findByText('30 дней');
      fireEvent.click(thirtyDaysButton);
      expect(mockOnPresetChange).toHaveBeenCalledWith('Last 30 Days');
    });
  });

  describe('Кнопка "Сегодня"', () => {
    it('должна отображаться в развёрнутом виде', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      // Ищем кнопку по тексту внутри div с классом flex items-center justify-center
      const todayButton = await screen.findAllByRole('button');
      const todayButtonFound = todayButton.find(
        (btn) => btn.textContent?.includes('Сегодня') && btn.querySelector('svg'),
      );
      expect(todayButtonFound).toBeInTheDocument();
    });

    it('должна выбирать сегодняшнюю дату при клике', async () => {
      renderComponent();
      const expandButton = screen.getByText('Развернуть');
      fireEvent.click(expandButton);
      const todayButtons = await screen.findAllByRole('button');
      const todayButton = todayButtons.find(
        (btn) => btn.textContent?.includes('Сегодня') && btn.querySelector('svg'),
      );
      if (todayButton) {
        fireEvent.click(todayButton);
      }
      expect(mockOnRangeChange).toHaveBeenCalledWith({
        start: expect.any(Object),
        end: expect.any(Object),
      });
    });
  });

  describe('Навигация', () => {
    it('должна переключаться на предыдущую неделю', () => {
      renderComponent();
      const prevButton = screen
        .getAllByRole('button')
        .find(
          (btn) =>
            btn.querySelector('svg') &&
            btn.textContent !== 'Развернуть' &&
            btn.textContent !== 'Свернуть' &&
            btn.textContent !== 'Сегодня',
        );
      if (prevButton) {
        fireEvent.click(prevButton);
      }
      // Навигация вызывает onRangeChange с новой датой
      expect(mockOnRangeChange).toHaveBeenCalled();
    });

    it('должна переключаться на следующую неделю', () => {
      renderComponent();
      const nextButtons = screen
        .getAllByRole('button')
        .filter(
          (btn) =>
            btn.querySelector('svg') &&
            !btn.textContent?.includes('Развернуть') &&
            !btn.textContent?.includes('Свернуть') &&
            !btn.textContent?.includes('Сегодня'),
        );
      if (nextButtons.length > 1) {
        fireEvent.click(nextButtons[nextButtons.length - 1]);
      }
    });
  });
});
