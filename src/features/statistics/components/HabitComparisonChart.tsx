import * as React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../app/store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { selectHabitLogs } from "../../statistics/store/habitLogsSlice"
import { subDays, isAfter, parseISO } from "date-fns"

export function HabitComparisonChart() {
  const logs = useSelector(selectHabitLogs)
  const habits = useSelector((state: RootState) => state.habits.items)

  const data = React.useMemo(() => {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)

    return habits.map(habit => {
        let completed = 0
        let planned = 0
        
        // Filter logs for this habit in the last 30 days
        const habitLogs = logs.filter(l => 
            l.habitId === habit.id && 
            isAfter(parseISO(l.date), thirtyDaysAgo)
        )
        
        // Simplified planned calculation: 30 days * target (or 1)
        // Ideally we should check if habit was active during those days
        // For now assume active for last 30 days
        const targetPerDay = habit.target ?? 1
        planned = 30 * targetPerDay
        
        habitLogs.forEach(log => {
            if (habit.type === 'quantitative') {
                completed += Math.min(log.value || 0, targetPerDay)
            } else {
                if (log.completed) completed += 1
            }
        })
        
        return {
            name: habit.name,
            completed,
            planned
        }
    })
  }, [logs, habits])

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
            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Legend />
            <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
