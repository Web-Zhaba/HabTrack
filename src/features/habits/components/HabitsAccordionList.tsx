import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../../app/store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../shared/components/ui/accordion"
import { Button } from "../../../shared/components/ui/button"
import { Switch } from "../../../shared/components/ui/switch"
import { Badge } from "../../../shared/components/ui/badge"
import type { Habit } from "../types/habit.types"
import { removeHabit, updateHabit } from "../store/habitsSlice"
import { selectHabitLogs } from "../../statistics/store/habitLogsSlice"
import { Edit, Trash2, PauseCircle, PlayCircle } from "lucide-react"
import { HabitHistoryCalendar } from "./HabitHistoryCalendar"
import { cn } from "@/lib/utils"

export function HabitsAccordionList() {
  const habits = useSelector((state: RootState) => state.habits.items) as Habit[]
  const logs = useSelector(selectHabitLogs)
  const dispatch = useDispatch()

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      dispatch(removeHabit(id))
    }
  }

  const handleToggleActive = (habit: Habit) => {
    // Assuming habit has an 'active' or 'status' field. 
    // If not, we might need to add it to the type.
    // For now, let's assume we can add a 'status' field to Habit type or simulate it.
    // The requirement says "status (active/paused)".
    // Let's check Habit type first.
    // If it doesn't exist, I'll update the type.
    const newStatus = habit.status === 'active' ? 'paused' : 'active';
    dispatch(updateHabit({ ...habit, status: newStatus }))
  }

  if (habits.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No habits found. Add one to get started!</div>
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {habits.map((habit) => (
        <AccordionItem key={habit.id} value={habit.id} className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-4 w-full">
              <span className="text-2xl">{habit.icon || "📝"}</span>
              <div className="flex flex-col items-start text-left">
                <span className={cn("font-medium", habit.status === 'paused' && "text-muted-foreground line-through")}>
                  {habit.name}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                    {habit.description || "No description"}
                </span>
              </div>
              <Badge variant={habit.status === 'active' ? "default" : "secondary"} className="ml-auto mr-4">
                {habit.status || 'active'}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div className="text-sm text-muted-foreground">
                        {habit.description}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch 
                                checked={habit.reminders} 
                                onCheckedChange={(checked) => dispatch(updateHabit({...habit, reminders: checked}))}
                            />
                            <span className="text-sm">Reminders</span>
                        </div>
                        {/* More settings can go here */}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleToggleActive(habit)}>
                            {habit.status === 'active' ? <PauseCircle className="w-4 h-4 mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                            {habit.status === 'active' ? "Pause" : "Resume"}
                        </Button>
                        <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(habit.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <div className="text-xs font-semibold mb-2">History</div>
                    <HabitHistoryCalendar habit={habit} logs={logs} />
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
