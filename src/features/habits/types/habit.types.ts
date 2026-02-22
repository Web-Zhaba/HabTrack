export type HabitType = 'binary' | 'quantitative';

export interface Habit {
  id: string;
  name: string;
  description?: string;            // необязательное поле
  categoryId?: string;              // связь с категорией (deprecated, use tags)
  tags?: string[];                 // теги
  color: string;                   // например, '#4CAF50'
  icon?: string;                    // необязательно
  type: HabitType;
  target?: number;                  // для количественных (цель)
  unit?: string;                     // для количественных ('km', 'pages')
  createdAt: string;                 // дата создания
  order?: number;                    // порядок в списке
  status?: 'active' | 'paused';      // статус выполнения
  reminders?: boolean;               // настройки напоминаний
}
