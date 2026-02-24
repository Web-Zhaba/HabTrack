import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedProgressBar from '@/components/ui/smoothui/animated-progress-bar';
import { useAppSelector } from '@app/store/hooks';
import { selectSelectedRange } from '@features/statistics/store';
import {
  calculateHabitRangeProgress,
  selectPerfectDaysCount,
  selectBestStreak,
  selectAllHabitsCompletedToday,
} from '@features/statistics/store';
import { selectActiveHabits } from '@features/habits/store';
import { Flame, Trophy, Zap, CheckCheck } from 'lucide-react';
import { useDateFormat } from '@features/settings/hooks/useDateFormat';
import { CardTilt, CardTiltContent } from '@/components/ui/card-tilt';

interface HomeMiniStatsProps {
  onMarkAll: () => void;
  onUnmarkAll?: () => void;
}

export function HomeMiniStats({ onMarkAll, onUnmarkAll }: HomeMiniStatsProps) {
  const habits = useAppSelector(selectActiveHabits);
  const selectedRange = useAppSelector(selectSelectedRange);
  const perfectDaysCount = useAppSelector(selectPerfectDaysCount);
  const bestStreak = useAppSelector(selectBestStreak);
  const allCompletedToday = useAppSelector(selectAllHabitsCompletedToday);
  const { formatDate } = useDateFormat();

  const summary = calculateHabitRangeProgress(
    habits,
    useAppSelector((state) => state.habitLogs.items),
    selectedRange || { start: '', end: '' },
  );

  if (!selectedRange) {
    return null;
  }

  const formatDateRange = () => {
    const start = new Date(selectedRange.start);
    const end = new Date(selectedRange.end);

    if (selectedRange.start === selectedRange.end) {
      return formatDate(start, 'd MMMM');
    }

    return `${formatDate(start, 'd MMM')} - ${formatDate(end, 'd MMM')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Статистика</CardTitle>
            <span className="text-xs text-muted-foreground capitalize">{formatDateRange()}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Прогресс */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Выполнено</span>
              <motion.span
                key={summary.percent}
                initial={{ scale: 1.5, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                className="font-bold"
              >
                {summary.percent}%
              </motion.span>
            </div>
            <AnimatedProgressBar value={summary.percent} color="--primary" />
            <p className="text-xs text-muted-foreground text-center">
              {summary.totalCompleted} из {summary.totalPlanned} задач
            </p>
          </motion.div>

          {/* Статистика в карточках */}
          <div className="grid grid-cols-2 gap-2">
            <CardTilt tiltMaxAngle={10} scale={1.02}>
              <CardTiltContent>
                <motion.div
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 min-h-[100px]"
                  whileHover={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)' }}
                >
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Лучшая серия</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={bestStreak?.streak ?? 0}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xl font-bold text-foreground"
                    >
                      {bestStreak?.streak ?? 0}
                      <span className="text-xs font-normal text-muted-foreground ml-1">дн.</span>
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </CardTiltContent>
            </CardTilt>

            <CardTilt tiltMaxAngle={10} scale={1.02}>
              <CardTiltContent>
                <motion.div
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 min-h-[100px]"
                  whileHover={{ boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)' }}
                >
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Идеальных дней</span>
                  <motion.span
                    key={perfectDaysCount}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold text-foreground"
                  >
                    {perfectDaysCount}
                  </motion.span>
                </motion.div>
              </CardTiltContent>
            </CardTilt>
          </div>

          {/* Кнопка отметить всё / убрать отметки */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {allCompletedToday ? (
              <Button
                onClick={onUnmarkAll}
                className="w-full gap-2 shadow-md hover:shadow-lg transition-shadow"
                variant="outline"
              >
                <CheckCheck className="w-4 h-4" />
                Убрать отметки за сегодня
              </Button>
            ) : (
              <Button
                onClick={onMarkAll}
                className="w-full gap-2 shadow-md hover:shadow-lg transition-shadow"
                variant="outline"
              >
                <Zap className="w-4 h-4" />
                Отметить всё за сегодня
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
