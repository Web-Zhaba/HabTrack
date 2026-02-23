import * as React from 'react';
import { useAppSelector } from '@app/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectHabitLogs } from '@features/statistics/store/habitLogsSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const MAX_DISPLAY_HABITS = 8;

export function HabitDistributionChart() {
  const logs = useAppSelector(selectHabitLogs);
  const habits = useAppSelector((state) => state.habits.items);

  const [RechartsModule, setRechartsModule] = React.useState<typeof import('recharts') | null>(
    null,
  );

  React.useEffect(() => {
    import('recharts').then(setRechartsModule);
  }, []);

  const data = React.useMemo(() => {
    const habitData = habits
      .map((habit) => {
        let totalValue = 0;
        logs
          .filter((l) => l.habitId === habit.id)
          .forEach((log) => {
            if (habit.type === 'quantitative') {
              totalValue += log.value || 0;
            } else {
              if (log.completed) totalValue += 1;
            }
          });
        return {
          name: habit.name,
          value: totalValue,
        };
      })
      .filter((d) => d.value > 0);

    // Сортируем по убыванию и берём топ-8
    habitData.sort((a, b) => b.value - a.value);
    const topHabits = habitData.slice(0, MAX_DISPLAY_HABITS);

    // Если больше 8 привычек, объединяем остальные в "Другие"
    if (habitData.length > MAX_DISPLAY_HABITS) {
      const otherValue = habitData.slice(MAX_DISPLAY_HABITS).reduce((sum, d) => sum + d.value, 0);
      topHabits.push({ name: 'Другие', value: otherValue });
    }

    return topHabits;
  }, [logs, habits]);

  if (!RechartsModule) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Effort Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <div className="h-full w-full animate-pulse bg-muted/20 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } = RechartsModule;

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Effort Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
