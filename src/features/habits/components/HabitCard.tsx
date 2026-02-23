import { memo, useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { getTodayKey } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnimatedProgressBar from '@/components/ui/smoothui/animated-progress-bar';
import {
  Trash2Icon,
  BadgeCheck,
  MinusIcon,
  PlusIcon,
  PencilIcon,
  BadgeIcon,
  FileTextIcon,
  TrophyIcon,
  FlameIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { upsertHabitLog, selectHabitStreak } from '@features/statistics/store/habitLogsSlice';
import type { HabitLog } from '@/types/HabitLog.types';
import type { Habit } from '../types/habit.types';
import { HABIT_ICONS } from '../constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CardTilt, CardTiltContent } from '@/components/ui/card-tilt';

type HabitCardProps = {
  habit: Habit;
  onDelete?: (id: string) => void;
  onEdit?: (habit: Habit) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  health: 'Здоровье',
  productivity: 'Продуктивность',
  learning: 'Обучение',
  mindfulness: 'Осознанность',
  custom: 'Другое',
};

export const HabitCard = memo(function HabitCard({ habit, onDelete, onEdit }: HabitCardProps) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const dispatch = useAppDispatch();

  const todayKey = getTodayKey();

  const logForToday: HabitLog | undefined = useAppSelector((state) =>
    state.habitLogs.items.find(
      (log: HabitLog) => log.habitId === habit.id && log.date === todayKey,
    ),
  );

  const selectStreak = useMemo(() => selectHabitStreak(habit.id), [habit.id]);
  const streak = useAppSelector(selectStreak);

  const completedToday = logForToday?.completed ?? false;
  const valueToday = logForToday?.value ?? 0;

  const isQuantitative = habit.type === 'quantitative';
  const target = habit.target ?? 0;
  const isOverTarget = isQuantitative && target > 0 && valueToday > target;

  const percent =
    isQuantitative && target > 0
      ? Math.max(0, Math.min(100, Math.round((valueToday / target) * 100)))
      : completedToday
        ? 100
        : 0;

  const categoryLabel = CATEGORY_LABELS[habit.categoryId ?? ''] ?? 'Привычка';

  const handleDecrease = () => {
    const next = Math.max(0, valueToday - 1);
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        value: next,
      }),
    );
  };

  const handleIncrease = () => {
    const next = valueToday + 1;
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        value: next,
      }),
    );
  };

  const IconComponent = habit.icon ? HABIT_ICONS[habit.icon] : null;

  // Цвет для прогресс-бара: обычный, перевыполнение или из привычки
  const progressColor = isOverTarget
    ? '--chart-5'
    : habit.color || '--primary';

  return (
    <CardTilt
      className="w-full h-full"
      tiltMaxAngle={shouldReduceMotion ? 0 : 5}
      scale={shouldReduceMotion ? 1 : 1.02}
    >
      <CardTiltContent className="h-full p-1">
        <Card className="group relative h-full overflow-hidden border bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md">
          <CardContent className="p-4 flex flex-col h-full gap-3">
            {/* Основной ряд: иконка | название+прогресс | кнопки */}
            <div className="flex items-start gap-3">
              {/* Иконка слева */}
              {habit.icon && (
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl"
                  style={{ backgroundColor: `var(${habit.color || '--primary'})` }}
                >
                  {IconComponent ? (
                    <IconComponent className="h-5 w-5 text-accent-foreground" />
                  ) : (
                    <span>{habit.icon}</span>
                  )}
                </div>
              )}

              {/* Название и прогресс-бар */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm md:text-base truncate">
                    {habit.name}
                  </span>
                  {streak > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5 text-orange-500 flex-shrink-0">
                            <FlameIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{streak}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Серия: {streak} дн.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Прогресс-бар */}
                <AnimatedProgressBar
                  label="Прогресс"
                  value={Math.min(100, percent)}
                  color={progressColor}
                  className="text-xs"
                />

                {/* Статус */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {isQuantitative ? (
                    <span className={isOverTarget ? 'text-purple-500 font-medium' : ''}>
                      {valueToday}/{target || '—'} {habit.unit}
                      {isOverTarget && (
                        <TrophyIcon className="inline w-3 h-3 ml-1 text-purple-500" />
                      )}
                    </span>
                  ) : (
                    <span className={completedToday ? 'text-green-500 font-medium' : ''}>
                      {completedToday ? 'Выполнено' : 'Не выполнено'}
                    </span>
                  )}
                </div>
              </div>

              {/* Кнопки действий справа */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <Button
                  type="button"
                  size="icon"
                  intent="plain"
                  className="rounded-full h-8 w-8"
                  onClick={() => navigate(`/habit/${habit.id}`)}
                >
                  <FileTextIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  intent="plain"
                  className="rounded-full h-8 w-8"
                  onClick={() => onEdit?.(habit)}
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  intent="plain"
                  className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete?.(habit.id)}
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Описание (если есть) */}
            {habit.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground line-clamp-2 cursor-help">
                      {habit.description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] text-xs">
                    <p>{habit.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Теги */}
            <div className="flex flex-wrap gap-1">
              {habit.tags && habit.tags.length > 0 ? (
                habit.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-dashed text-[10px] px-1.5 py-0 h-4"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="outline"
                  className="border-dashed text-[10px] px-1.5 py-0 h-4"
                >
                  {categoryLabel}
                </Badge>
              )}
            </div>

            {/* Кнопки управления */}
            <div className="mt-auto pt-2 border-t">
              {isQuantitative ? (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    size="icon"
                    intent="outline"
                    className="rounded-full w-10 h-10"
                    onClick={handleDecrease}
                  >
                    <MinusIcon className="h-5 w-5" />
                  </Button>
                  <span className="min-w-[60px] text-center text-lg font-medium">
                    {valueToday} {habit.unit}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    intent={isOverTarget ? 'primary' : 'outline'}
                    className="rounded-full w-10 h-10"
                    onClick={handleIncrease}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="md"
                  intent={completedToday ? 'primary' : 'outline'}
                  className="flex items-center justify-center gap-2 rounded-full w-full h-10"
                  onClick={() =>
                    dispatch(
                      upsertHabitLog({
                        habitId: habit.id,
                        date: todayKey,
                        completed: !completedToday,
                        value: !completedToday ? 1 : 0,
                      }),
                    )
                  }
                >
                  {completedToday && <BadgeCheck className="h-4 w-4" />}
                  {!completedToday && <BadgeIcon className="h-4 w-4" />}
                  <span className="text-sm">
                    {completedToday ? 'Выполнено сегодня' : 'Отметить выполнение'}
                  </span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </CardTiltContent>
    </CardTilt>
  );
});