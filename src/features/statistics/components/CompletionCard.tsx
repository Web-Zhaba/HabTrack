import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, BarChart } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SuccessRateDataPoint {
  date: string;
  rate: number;
}

interface CompletionCardProps {
  totalCompleted: number;
  successRate: number;
  chartData: SuccessRateDataPoint[];
}

export function CompletionCard({ totalCompleted, successRate, chartData }: CompletionCardProps) {
  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardContent className="p-6">
        {/* Заголовок с иконками */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-green-500/10 p-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Выполнение</h3>
              <p className="text-xs text-muted-foreground">Общая статистика</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <BarChart className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">30 дней</span>
          </div>
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{totalCompleted}</span>
              <span className="text-xs text-muted-foreground">всего</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  successRate >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : successRate >= 50
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                {successRate}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* График */}
        {chartData.length === 0 ? (
          <div className="h-16 w-full flex items-center justify-center text-muted-foreground text-sm">
            Нет данных для отображения
          </div>
        ) : (
          <>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorRate)"
                    dot={false}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Подпись к графику */}
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>30 дней назад</span>
              <span>Сегодня</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
