import { lazy, Suspense } from 'react';
import { OverallStatsCards } from '../features/statistics/components/OverallStatsCards';

// const HabitHeatmap = lazy(() =>
//   import('../features/statistics/components/HabitHeatmap').then((module) => ({
//     default: module.HabitHeatmap,
//   })),
// );
const HabitTrendsChart = lazy(() =>
  import('../features/statistics/components/HabitTrendsChart').then((module) => ({
    default: module.HabitTrendsChart,
  })),
);
const HabitComparisonChart = lazy(() =>
  import('../features/statistics/components/HabitComparisonChart').then((module) => ({
    default: module.HabitComparisonChart,
  })),
);
const HabitDistributionChart = lazy(() =>
  import('../features/statistics/components/HabitDistributionChart').then((module) => ({
    default: module.HabitDistributionChart,
  })),
);

function ChartSkeleton() {
  return <div className="h-[300px] w-full animate-pulse bg-muted/20 rounded-lg" />;
}

export default function StatsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Статистика</h1>
        <p className="text-muted-foreground">
          Анализируйте свой прогресс и находите закономерности.
        </p>
      </div>

      <OverallStatsCards />

      {/*<div className="space-y-4">
        <h2 className="text-xl font-semibold">Активность по дням недели</h2>
        <Suspense fallback={<ChartSkeleton />}>
          <HabitHeatmap />
        </Suspense>
      </div>*/}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Тренды</h2>
          <Suspense fallback={<ChartSkeleton />}>
            <HabitTrendsChart />
          </Suspense>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Сравнение</h2>
          <Suspense fallback={<ChartSkeleton />}>
            <HabitComparisonChart />
          </Suspense>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Распределение</h2>
        <Suspense fallback={<ChartSkeleton />}>
          <HabitDistributionChart />
        </Suspense>
      </div>
    </div>
  );
}
