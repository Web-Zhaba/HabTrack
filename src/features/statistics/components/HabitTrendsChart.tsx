import * as React from 'react';
import { useAppSelector } from '@app/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectHabitLogs } from '@features/statistics/store';
import { selectActiveHabits } from '@features/habits/store';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export function HabitTrendsChart() {
  const logs = useAppSelector(selectHabitLogs);
  const habits = useAppSelector(selectActiveHabits);

  const [RechartsModule, setRechartsModule] = React.useState<typeof import('recharts') | null>(
    null,
  );

  React.useEffect(() => {
    import('recharts').then(setRechartsModule);
  }, []);

  const data = React.useMemo(() => {
    const end = new Date();
    const start = subDays(end, 30);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');

      let totalCompleted = 0;
      let totalPlanned = 0;

      habits.forEach((habit) => {
        const log = logs.find((l) => l.habitId === habit.id && l.date === dateStr);
        if (habit.type === 'quantitative') {
          if (habit.target && habit.target > 0) {
            totalPlanned += habit.target;
            if (log?.value) totalCompleted += Math.min(log.value, habit.target);
          }
        } else {
          totalPlanned += 1;
          if (log?.completed) totalCompleted += 1;
        }
      });

      const percent = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

      return {
        date: format(day, 'MMM dd'),
        percent,
        completed: totalCompleted,
        planned: totalPlanned,
      };
    });
  }, [logs, habits]);

  if (!RechartsModule) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Completion Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <div className="h-full w-full animate-pulse bg-muted/20 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } =
    RechartsModule;

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Completion Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="percent"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
