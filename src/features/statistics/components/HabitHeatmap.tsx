import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { format, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';
import type { HabitLog } from '../../../shared/types/HabitLog.types';
import {
  ContributionGraph,
  type ContributionData,
} from '../../../shared/components/ui/smoothui/contribution-graph';

export function HabitHeatmap() {
  const habitLogs = useSelector((state: RootState) => state.habitLogs.items) as HabitLog[];
  const year = new Date().getFullYear();

  const data: ContributionData[] = React.useMemo(() => {
    const days = eachDayOfInterval({
      start: startOfYear(new Date(year, 0, 1)),
      end: endOfYear(new Date(year, 0, 1)),
    });

    return days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const logsForDay = habitLogs.filter((log) => log.date === dateStr);
      const completedCount = logsForDay.filter(
        (l) => l.completed || (l.value && l.value > 0),
      ).length;

      let level = 0;
      if (completedCount === 0) level = 0;
      else if (completedCount <= 2) level = 1;
      else if (completedCount <= 4) level = 2;
      else if (completedCount <= 6) level = 3;
      else level = 4;

      return {
        date: dateStr,
        count: completedCount,
        level,
      };
    });
  }, [habitLogs, year]);

  return <ContributionGraph data={data} year={year} showLegend showTooltips />;
}
