import { useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppSelector } from '@app/store/hooks';

/**
 * Хук для форматирования дат с использованием формата из настроек
 *
 * @example
 * const { formatDate, formatString } = useDateFormat();
 * const formatted = formatDate(new Date()); // "24.02.2026"
 * const custom = formatDate(new Date(), 'MM/dd/yyyy'); // "02/24/2026"
 */
export function useDateFormat() {
  const formatString = useAppSelector((state: any) => state.settings?.dateFormat ?? 'dd.MM.yyyy');

  const formatDate = useMemo(() => {
    return (date: Date | string | number, customFormat?: string): string => {
      const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

      // Если передан кастомный формат, используем его
      const fmt = customFormat ?? formatString;

      try {
        return format(dateObj, fmt, { locale: ru });
      } catch (error) {
        // Если формат невалидный, используем формат по умолчанию
        console.error('Invalid date format:', fmt, error);
        return format(dateObj, 'dd.MM.yyyy', { locale: ru });
      }
    };
  }, [formatString]);

  return {
    formatDate,
    formatString,
  };
}
