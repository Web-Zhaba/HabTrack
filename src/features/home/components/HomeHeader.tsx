import { motion } from 'motion/react';
import { Plus, Sun, Moon, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@app/store/hooks';
import { selectSettings } from '@features/settings/store/settingsSlice';
import { useDateFormat } from '@features/settings/hooks/useDateFormat';

interface HomeHeaderProps {
  onAddHabit: () => void;
}

export function HomeHeader({ onAddHabit }: HomeHeaderProps) {
  const settings = useAppSelector(selectSettings);
  const userName = settings?.userName || 'Пользователь';
  const { formatDate, formatString } = useDateFormat();

  // Определяем время суток
  const hour = new Date().getHours();
  let greeting = 'Добрый вечер';
  let Icon = Moon;

  if (hour >= 5 && hour < 12) {
    greeting = 'Доброе утро';
    Icon = Sun;
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Добрый день';
    Icon = CloudSun;
  }

  const today = new Date();
  // Используем формат из настроек, добавляя день недели
  const formattedDate = formatDate(today, `${formatString}, EEEE`);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10"
        >
          <Icon className="w-7 h-7 text-primary" />
        </motion.div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {greeting}, {userName}!
          </h1>
          <p className="text-muted-foreground capitalize">{formattedDate}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Button
          onClick={onAddHabit}
          className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Добавить привычку
        </Button>
      </motion.div>
    </motion.div>
  );
}
