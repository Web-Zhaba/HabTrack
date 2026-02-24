import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { today, getLocalTimeZone, parseDate, type CalendarDate } from '@internationalized/date';
import type { DateValue, RangeValue } from 'react-aria-components';
import { setSelectedRange, selectSelectedRange } from '@features/statistics/store';

function formatKeyFromCalendarDate(date: CalendarDate): string {
  const y = date.year;
  const m = String(date.month).padStart(2, '0');
  const d = String(date.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const useHomeCalendar = () => {
  const dispatch = useAppDispatch();
  const selectedRange = useAppSelector(selectSelectedRange);

  // Инициализируем сегодня - всегда по умолчанию
  const [range, setRange] = useState<RangeValue<DateValue>>(() => {
    const now = today(getLocalTimeZone());
    return { start: now, end: now };
  });

  const [preset, setPreset] = useState<string>('Custom');

  // Синхронизация с Redux - если selectedRange изменился, обновляем range
  useEffect(() => {
    if (selectedRange) {
      try {
        const start = parseDate(selectedRange.start);
        const end = parseDate(selectedRange.end);
        setRange({ start, end });
      } catch {
        // Если даты невалидны, используем сегодня
        const now = today(getLocalTimeZone());
        setRange({ start: now, end: now });
      }
    }
  }, [selectedRange]);

  const handleApply = useCallback(() => {
    if (range && range.start && range.end) {
      dispatch(
        setSelectedRange({
          start: formatKeyFromCalendarDate(range.start as CalendarDate),
          end: formatKeyFromCalendarDate(range.end as CalendarDate),
        }),
      );
    }
  }, [dispatch, range]);

  const handleRangeChange = useCallback((value: RangeValue<DateValue>) => {
    setRange(value);
    setPreset('Custom');
  }, []);

  const handlePresetChange = useCallback((key: React.Key | null) => {
    if (!key) return;
    const k = key as string;
    setPreset(k);

    const end = today(getLocalTimeZone());
    let start;

    if (k === 'Last 7 Days') {
      start = end.subtract({ days: 6 });
      setRange({ start, end });
    } else if (k === 'Last 30 Days') {
      start = end.subtract({ days: 29 });
      setRange({ start, end });
    } else {
      // Custom or other presets
    }
  }, []);

  const handleStartChange = useCallback((date: DateValue | null) => {
    if (date) {
      setRange((prev) => ({ start: date, end: prev?.end || date }));
      setPreset('Custom');
    }
  }, []);

  const handleEndChange = useCallback((date: DateValue | null) => {
    if (date) {
      setRange((prev) => ({ start: prev?.start || date, end: date }));
      setPreset('Custom');
    }
  }, []);

  return {
    range,
    preset,
    handleApply,
    handleRangeChange,
    handlePresetChange,
    handleStartChange,
    handleEndChange,
  };
};
