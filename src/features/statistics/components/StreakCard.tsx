import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface StreakCardProps {
  currentStreak: number;
  maxStreak: number;
  completedDays: Set<string>;
  /** Временный проп для тестирования уровней. Удалить перед продакшеном! */
  testMode?: boolean;
}

// Уровни прогрессии огонька
function getFlameLevel(streak: number): 'small' | 'medium' | 'large' | 'epic' {
  if (streak >= 30) return 'epic';
  if (streak >= 14) return 'large';
  if (streak >= 7) return 'medium';
  return 'small';
}

// Размеры для разных уровней
const flameSizes = {
  small: 'h-8 w-8',
  medium: 'h-10 w-10',
  large: 'h-12 w-12',
  epic: 'h-14 w-14',
};

// Градиенты для заливки иконки огонька
const flameIconGradients = {
  small: 'from-orange-400 to-orange-600',
  medium: 'from-orange-300 to-orange-500',
  large: 'from-yellow-400 to-yellow-600',
  epic: 'from-red-400 via-orange-500 to-red-600',
};

// Свечение для огонька
const flameGlow = {
  small: 'shadow-orange-500/20',
  medium: 'shadow-orange-400/30',
  large: 'shadow-yellow-500/40',
  epic: 'shadow-red-500/50',
};

export function StreakCard({ currentStreak, maxStreak, completedDays }: StreakCardProps) {
  const flameLevel = getFlameLevel(currentStreak);
  const isRecordBreaker = currentStreak >= maxStreak && currentStreak > 0;

  // Получаем дни текущей недели
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Понедельник
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <Card className="relative overflow-hidden border-orange-200 dark:border-orange-900">
      {/* Фоновый градиент для эпичного уровня */}
      {flameLevel === 'epic' && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-transparent pointer-events-none" />
      )}

      <CardContent className="p-6">
        {/* Заголовок с иконкой */}
        <div className={isRecordBreaker ? 'mb-4' : 'flex items-center justify-between mb-4'}>
          <div className="flex items-center gap-2">
            <div
              className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${flameIconGradients[flameLevel]} p-2 shadow-lg ${flameGlow[flameLevel]} transition-all duration-500`}
            >
              <Flame
                className={`${flameSizes[flameLevel]} text-white transition-all duration-500`}
              />
              {/* Свечение для эпичного уровня */}
              {flameLevel === 'epic' && (
                <div className="absolute inset-0 rounded-full animate-pulse bg-red-500/20" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold">Текущая серия</h3>
              {isRecordBreaker ? (
                <span className="text-xs text-yellow-500 font-medium">
                  <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />
                  Это рекордная серия! Так держать!
                </span>
              ) : (
                <p className="text-xs text-muted-foreground">
                  До рекорда: {Math.max(0, maxStreak - currentStreak)} дн.
                </p>
              )}
            </div>
          </div>

          {/* Лучшая серия - показываем только если не рекорд */}
          {!isRecordBreaker && (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Лучшая:</span>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {maxStreak}
              </span>
            </div>
          )}
        </div>

        {/* Текущая серия - большое число */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{currentStreak}</span>
            <span className="text-sm text-muted-foreground">дней</span>
          </div>
        </div>

        {/* Дни недели с огоньками */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCompleted = completedDays.has(dateStr);
            const isToday = isSameDay(day, today);

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1">
                {/* Огонёк */}
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-md shadow-orange-500/30'
                      : 'bg-muted/50'
                  } ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                >
                  {isCompleted ? (
                    <Flame className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                  )}
                </div>
                {/* Подпись дня */}
                <span
                  className={`text-[10px] font-medium ${
                    isToday
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {weekDayLabels[index]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Прогресс-бар до следующего уровня */}
        {currentStreak > 0 && currentStreak < 30 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>До следующего уровня</span>
              <span>
                {currentStreak < 7
                  ? 7 - currentStreak
                  : currentStreak < 14
                    ? 14 - currentStreak
                    : 30 - currentStreak}{' '}
                дн.
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (currentStreak / (currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : 30)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
