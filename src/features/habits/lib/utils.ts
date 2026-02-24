import { format } from 'date-fns';

/**
 * Возвращает текущую дату в формате 'YYYY-MM-DD'
 * Используется для консистентной генерации ключей дат во всём приложении
 */
export function getTodayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Проверяет, можно ли отмечать привычку в указанный день
 * (день не позже сегодняшнего и не раньше создания привычки)
 *
 * @param dateKey - Дата в формате 'YYYY-MM-DD'
 * @param habitCreatedAt - Дата создания привычки в формате ISO или 'YYYY-MM-DD'
 * @returns true если можно отмечать, false если нет
 */
export function canMarkDate(dateKey: string, habitCreatedAt?: string): boolean {
  const today = getTodayKey();
  // Нельзя отмечать будущие дни
  if (dateKey > today) return false;
  // Нельзя отмечать дни до создания привычки
  if (habitCreatedAt && dateKey < habitCreatedAt.split('T')[0]) return false;
  return true;
}
