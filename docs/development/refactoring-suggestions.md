# Рефакторинг и улучшения

Дата: 24.02.2026
Автор: AI Assistant

---

## Текущие проблемы и улучшения

### 1. Дублирование логики

#### `canMarkDate()` vs `selectCanMarkHabit`

**Проблема:** Функция `canMarkDate()` определена в `src/shared/lib/utils.ts`, но также есть selector `selectCanMarkHabit` в `habitLogsSlice.ts`. Это дублирование.

**Решение:**
- Оставить только `canMarkDate()` в utils
- Удалить `selectCanMarkHabit` из slice
- Обновить все использования

**Файлы:**
- `src/shared/lib/utils.ts` - оставить
- `src/features/statistics/store/habitLogsSlice.ts` - удалить selector
- `src/features/home/components/HomeHabitsList.tsx` - обновить импорт

---

### 2. Архитектура Redux

#### Разделение `habitLogsSlice`

**Проблема:** Slice содержит как CRUD операции, так и computed selectors. Это нарушает SRP.

**Решение:**
- `habitLogsSlice` - только данные (items, selectedRange) и CRUD actions
- Создать `habitStatsSlice` или использовать RTK Query для computed data

**Новая структура:**
```
src/features/statistics/store/
├── habitLogsSlice.ts      # CRUD: items, upsert, clear
├── habitStatsSlice.ts     # Computed: streaks, perfect days, etc.
└── index.ts               # exports
```

---

### 3. Компоненты

#### HabitCard - вынести логику

**Проблема:** Слишком много логики в компоненте (~200 строк).

**Решение:** Вынести в кастомные хуки:

```typescript
// src/features/habits/hooks/useHabitProgress.ts
export function useHabitProgress(habit: Habit) {
  const todayKey = getTodayKey();
  const logForToday = useAppSelector(...);
  
  return {
    completedToday,
    valueToday,
    percent,
    isOverTarget,
    progressColor,
  };
}

// src/features/habits/hooks/useHabitActions.ts
export function useHabitActions(habit: Habit) {
  const dispatch = useAppDispatch();
  const todayKey = getTodayKey();
  
  return {
    handleDecrease,
    handleIncrease,
    handleToggle,
  };
}
```

#### UnifiedCalendar - адаптивность

**Проблема:** На десктопе календарь всегда свёрнут, требуется лишний клик.

**Решение:**
- На экранах `lg` и выше - всегда развёрнут (month view)
- Убрать кнопку "Развернуть/Свернуть" на десктопе
- Добавить media-query или использовать `useMediaQuery`

---

### 4. Типизация

#### HABIT_ICONS

**Проблема:** `HABIT_ICONS` не типизирован строго.

**Текущее:**
```typescript
export const HABIT_ICONS: Record<string, ComponentType<{ className?: string }>> = { ... };
```

**Предложение:**
```typescript
export type HabitIconName = 'workout' | 'book' | 'water' | 'meditation' | 'sleep' | 'code';

export const HABIT_ICONS: Record<HabitIconName, ComponentType<{ className?: string }>> = {
  workout: DumbbellIcon,
  book: BookIcon,
  // ...
};
```

---

### 5. Производительность

#### Селекторы

**Проблема:** Некоторые селекторы пересчитываются при любом изменении state.

**Решение:**
- Проверить все `createSelector` на правильность зависимостей
- Добавить `shallowEqual` где необходимо
- Рассмотреть использование `createDraftSafeSelector`

#### Мемоизация компонентов

**Проблема:** `HabitCard` оборачивается в `memo()`, но дочерние компоненты нет.

**Решение:**
- Обернуть `TooltipProvider` в отдельный компонент
- Мемоизировать колбэки через `useCallback`

---

### 6. Тесты

**Текущее покрытие:**
- `habitLogsSlice.test.ts` - 27 тестов ✅
- `habitsSlice.test.ts` - есть

**Не хватает:**
- `HabitCard.test.tsx` - компонентные тесты
- `HomeMiniStats.test.tsx` - компонентные тесты
- Интеграционные тесты для синхронизации данных

---

### 7. UX/UI

#### Мобильная версия HabitCard

**Проблема:** Новый layout может быть слишком компактным на мобильных.

**Решение:**
- Адаптивный размер иконки (h-8 w-8 на мобильных)
- Скрыть описание на маленьких экранах
- Показывать streak только если > 0

#### Цвета перевыполнения

**Проблема:** Цвет `--chart-5` захардкожен.

**Решение:**
- Добавить в `globals.css`: `--over-target: var(--chart-5);`
- Или использовать semantic token: `--success-over: ...`

---

## Приоритеты

### Высокий (P0)
1. Удалить дублирование `canMarkDate` / `selectCanMarkHabit`
2. Адаптивность HabitCard на мобильных

### Средний (P1)
1. Вынести логику из HabitCard в хуки
2. Разделить habitLogsSlice
3. Добавить тесты для компонентов

### Низкий (P2)
1. Улучшить типизацию HABIT_ICONS
2. Добавить интеграционные тесты
3. Оптимизировать селекторы

---

## Следующие шаги

1. [ ] Удалить `selectCanMarkHabit`, использовать `canMarkDate` из utils
2. [ ] Создать `useHabitProgress` и `useHabitActions` хуки
3. [ ] Добавить адаптивные стили для HabitCard
4. [ ] Разделить `habitLogsSlice` на два
5. [ ] Добавить компонентные тесты
6. [ ] Оптимизировать UnifiedCalendar для десктопа