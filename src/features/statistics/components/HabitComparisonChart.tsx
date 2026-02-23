import * as React from 'react';
import { useAppSelector } from '@app/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectHabitLogs } from '@features/statistics/store/habitLogsSlice';
import { selectActiveHabits } from '@features/habits/store/habitsSlice';
import { subDays, isAfter, parseISO } from 'date-fns';

const MAX_DISPLAY_HABITS = 10;

export function HabitComparisonChart() {
  const logs = useAppSelector(selectHabitLogs);
  const habits = useAppSelector(selectActiveHabits);

  const [RechartsModule, setRechartsModule] = React.useState<typeof import('recharts') | null>(
    null,
  );

  React.useEffect(() => {
    import('recharts').then(setRechartsModule);
  }, []);

  const data = React.useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    const habitData = habits.map((habit) => {
      let completed = 0;
      let planned = 0;

      // Filter logs for this habit in the last 30 days
      const habitLogs = logs.filter(
        (l) => l.habitId === habit.id && isAfter(parseISO(l.date), thirtyDaysAgo),
      );

      // Simplified planned calculation: 30 days * target (or 1)
      // Ideally we should check if habit was active during those days
      // For now assume active for last 30 days
      const targetPerDay = habit.target ?? 1;
      planned = 30 * targetPerDay;

      habitLogs.forEach((log) => {
        if (habit.type === 'quantitative') {
          completed += Math.min(log.value || 0, targetPerDay);
        } else {
          if (log.completed) completed += 1;
        }
      });

      return {
        name: habit.name,
        completed,
        planned,
      };
    });

    // Сортируем по completed и берём топ-10
    habitData.sort((a, b) => b.completed - a.completed);
    return habitData.slice(0, MAX_DISPLAY_HABITS);
  }, [logs, habits]);

  if (!RechartsModule) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Habit Comparison (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <div className="h-full w-full animate-pulse bg-muted/20 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } =
    RechartsModule;

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Habit Comparison (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Legend />
            <Bar
              dataKey="completed"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
