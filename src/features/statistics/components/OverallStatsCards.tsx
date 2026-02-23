import * as React from 'react';
import { useAppSelector } from '@app/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectHabitLogs } from '@features/statistics/store/habitLogsSlice';
import { Flame, Trophy, CheckCircle, BarChart } from 'lucide-react';
import { subDays, format, parseISO } from 'date-fns';

export function OverallStatsCards() {
  const logs = useAppSelector(selectHabitLogs);
  const habits = useAppSelector((state) => state.habits.items);

  const stats = React.useMemo(() => {
    let totalCompleted = 0;
    const completedDays = new Set<string>();

    logs.forEach((log) => {
      if (log.completed || (log.value && log.value > 0)) {
        totalCompleted++;
        completedDays.add(log.date);
      }
    });

    // Calculate streak
    let currentStreak = 0;
    const today = new Date();
    let checkDate = today;

    // Check today or yesterday (if today not completed yet)
    if (!completedDays.has(format(today, 'yyyy-MM-dd'))) {
      checkDate = subDays(today, 1);
    }

    while (completedDays.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }

    // Max streak (simplified: max consecutive days in logs)
    // This requires sorting logs by date and iterating
    const sortedDates = Array.from(completedDays).sort();
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const date = parseISO(dateStr);
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const diff = date.getTime() - lastDate.getTime();
        const diffDays = diff / (1000 * 3600 * 24);
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      lastDate = date;
    }

    const totalPlanned = habits.length * 30; // Approx for last month
    const successRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

    return {
      currentStreak,
      maxStreak,
      totalCompleted,
      successRate,
    };
  }, [logs, habits]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStreak} Days</div>
          <p className="text-xs text-muted-foreground">Keep the fire burning!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Streak</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.maxStreak} Days</div>
          <p className="text-xs text-muted-foreground">Your personal best</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCompleted}</div>
          <p className="text-xs text-muted-foreground">Habits done</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <BarChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">Average completion</p>
        </CardContent>
      </Card>
    </div>
  );
}
