import * as React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../app/store"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { selectHabitLogs } from "../../statistics/store/habitLogsSlice"
import { format, subDays, eachDayOfInterval } from "date-fns"

export function HabitTrendsChart() {
  const logs = useSelector(selectHabitLogs)
  const habits = useSelector((state: RootState) => state.habits.items)

  const data = React.useMemo(() => {
    const end = new Date()
    const start = subDays(end, 30)
    const days = eachDayOfInterval({ start, end })

    return days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      
      let totalCompleted = 0
      let totalPlanned = 0

      habits.forEach(habit => {
         const log = logs.find(l => l.habitId === habit.id && l.date === dateStr)
         if (habit.type === 'quantitative') {
             if (habit.target && habit.target > 0) {
                 totalPlanned += habit.target
                 if (log?.value) totalCompleted += Math.min(log.value, habit.target)
             }
         } else {
             totalPlanned += 1
             if (log?.completed) totalCompleted += 1
         }
      })

      const percent = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0
      
      return {
        date: format(day, "MMM dd"),
        percent,
        completed: totalCompleted,
        planned: totalPlanned
      }
    })
  }, [logs, habits])

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Completion Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="percent" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
