import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Возвращает текущую дату в формате 'YYYY-MM-DD'
 * Используется для консистентной генерации ключей дат во всём приложении
 */
export function getTodayKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Преобразует дату в строковый ключ 'YYYY-MM-DD'
 */
export function dateToKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Проверяет, можно ли отмечать привычку в указанный день
 * (день не позже сегодняшнего и не раньше создания привычки)
 */
export function canMarkDate(dateKey: string, habitCreatedAt?: string): boolean {
  const today = getTodayKey()
  // Нельзя отмечать будущие дни
  if (dateKey > today) return false
  // Нельзя отмечать дни до создания привычки
  if (habitCreatedAt && dateKey < habitCreatedAt.split("T")[0]) return false
  return true
}
