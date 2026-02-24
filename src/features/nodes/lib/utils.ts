import { format } from 'date-fns';

/**
 * Возвращает текущую дату в формате 'YYYY-MM-DD'
 * Используется для консистентной генерации ключей дат во всём приложении
 */
export function getTodayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Проверяет, можно ли отправить импульс узлу в указанный день
 * (день не позже сегодняшнего и не раньше создания узла)
 *
 * @param dateKey - Дата в формате 'YYYY-MM-DD'
 * @param nodeCreatedAt - Дата создания узла в формате ISO или 'YYYY-MM-DD'
 * @returns true если можно отправить импульс, false если нет
 */
export function canSendPulse(dateKey: string, nodeCreatedAt?: string): boolean {
  const today = getTodayKey();
  // Нельзя отмечать будущие дни
  if (dateKey > today) return false;
  // Нельзя отмечать дни до создания узла
  if (nodeCreatedAt && dateKey < nodeCreatedAt.split('T')[0]) return false;
  return true;
}

/**
 * Алиас для canSendPulse для обратной совместимости
 * @deprecated Используйте canSendPulse
 */
export const canMarkDate = canSendPulse;
