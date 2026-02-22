export interface HabitLog {
  id: string;
  habitId: string;
  date: string;                     // '2025-03-21'
  // Для бинарных привычек
  completed?: boolean;               // true — выполнено, false — нет
  // Для количественных привычек
  value?: number;                    // сколько фактически сделано
}