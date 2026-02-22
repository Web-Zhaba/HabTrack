import * as React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../app/store"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { selectHabitLogs } from "../../statistics/store/habitLogsSlice"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function HabitDistributionChart() {
  const logs = useSelector(selectHabitLogs)
  const habits = useSelector((state: RootState) => state.habits.items)

  const data = React.useMemo(() => {
    return habits.map(habit => {
        let totalValue = 0
        logs.filter(l => l.habitId === habit.id).forEach(log => {
            if (habit.type === 'quantitative') {
                totalValue += log.value || 0
            } else {
                if (log.completed) totalValue += 1
            }
        })
        return {
            name: habit.name,
            value: totalValue
        }
    }).filter(d => d.value > 0)
  }, [logs, habits])

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
  )
}
