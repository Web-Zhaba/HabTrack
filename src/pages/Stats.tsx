import { OverallStatsCards } from '@features/statistics/components/OverallStatsCards';
import { HabitTrendsChart } from '@features/statistics/components/HabitTrendsChart';
import { HabitComparisonChart } from '@features/statistics/components/HabitComparisonChart';
import { HabitDistributionChart } from '@features/statistics/components/HabitDistributionChart';
import { LazyChartWrapper } from '@features/statistics/components/LazyChartWrapper';

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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Тренды</h2>
          <LazyChartWrapper>
            <HabitTrendsChart />
          </LazyChartWrapper>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Сравнение</h2>
          <LazyChartWrapper>
            <HabitComparisonChart />
          </LazyChartWrapper>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Распределение</h2>
        <LazyChartWrapper>
          <HabitDistributionChart />
        </LazyChartWrapper>
      </div>
    </div>
  );
}
