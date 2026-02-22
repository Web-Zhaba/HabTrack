import { useMemo } from "react"
import { useReducedMotion } from "motion/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AnimatedProgressBar from "@/components/ui/smoothui/animated-progress-bar"
import { Trash2Icon, CheckIcon, MinusIcon, PlusIcon, PencilIcon } from "lucide-react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../../app/store"
import { upsertHabitLog } from "src/features/statistics/store/habitLogsSlice"
import type { HabitLog } from "@/types/HabitLog.types"
import type { Habit } from "../types/habit.types"
import { MdDetails } from "react-icons/md"
import { HABIT_ICONS } from "../constants"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HabitCardProps = {
  habit: Habit
  onDelete?: () => void
  onEdit?: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  health: "Здоровье",
  productivity: "Продуктивность",
  learning: "Обучение",
  mindfulness: "Осознанность",
  custom: "Другое",
}

import { CardTilt, CardTiltContent } from "@/components/ui/card-tilt"

export function HabitCard({ habit, onDelete, onEdit }: HabitCardProps) {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const dispatch = useDispatch<AppDispatch>()

  const todayKey = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }, [])

  const logForToday: HabitLog | undefined = useSelector((state: RootState) =>
    state.habitLogs.items.find(
      (log: HabitLog) => log.habitId === habit.id && log.date === todayKey,
    ),
  )

  const completedToday = logForToday?.completed ?? false
  const valueToday = logForToday?.value ?? 0

  const isQuantitative = habit.type === "quantitative"
  const target = habit.target ?? 0

  const percent =
    isQuantitative && target > 0
      ? Math.max(0, Math.min(100, Math.round((valueToday / target) * 100)))
      : completedToday
        ? 100
        : 0

  const categoryLabel = CATEGORY_LABELS[habit.categoryId ?? ""] ?? "Привычка"

  const handleDecrease = () => {
    const next = Math.max(0, valueToday - 1)
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        value: next,
      }),
    )
  }

  const handleIncrease = () => {
    let next = valueToday + 1
    if (target > 0) {
      next = Math.min(target, next)
    }
    dispatch(
      upsertHabitLog({
        habitId: habit.id,
        date: todayKey,
        value: next,
      }),
    )
  }

  const IconComponent = habit.icon ? HABIT_ICONS[habit.icon] : null

  return (
    <CardTilt 
        className="w-full h-full" 
        tiltMaxAngle={shouldReduceMotion ? 0 : 5} 
        scale={shouldReduceMotion ? 1 : 1.02}
    >
      <CardTiltContent className="h-full">
        <Card className="group relative h-full overflow-hidden border bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                {habit.icon && (
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary text-2xl">
                    {IconComponent ? <IconComponent className="h-6 w-6" /> : <span>{habit.icon}</span>}
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base md:text-lg line-clamp-2 break-all">
                    {habit.name}
                  </CardTitle>
                  <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    {isQuantitative && habit.target && habit.unit && (
                      <span className="whitespace-nowrap font-medium text-foreground/80">
                        Цель: {habit.target} {habit.unit}
                      </span>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        {habit.tags && habit.tags.length > 0 ? (
                          habit.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-dashed text-[10px] px-1.5 py-0 h-5">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="border-dashed text-[10px] px-1.5 py-0 h-5">
                            {categoryLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Button
                  type="button"
                  size="icon-lg"
                  intent="plain"
                  className="rounded-full"
                  onClick={() => navigate(`/habit/${habit.id}`)}
                >
                  <MdDetails className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-lg"
                  intent="plain"
                  className="rounded-full"
                  onClick={onEdit}
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-lg"
                  intent="plain"
                  className="rounded-full text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 items-center py-4">
            <div className="flex w-full flex-col gap-2">
              {habit.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardDescription className="mb-1 line-clamp-2 break-all text-xs md:text-sm cursor-help hover:text-foreground/80 transition-colors">
                        {habit.description}
                      </CardDescription>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] text-xs">
                      <p>{habit.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <AnimatedProgressBar
                label="Прогресс за сегодня"
                value={percent}
                color={habit.color}
                className="text-xs"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {isQuantitative ? (
                  <span>
                    Сегодня: {valueToday}/{target || "—"} {habit.unit}
                  </span>
                ) : (
                  <span>Сегодня: {completedToday ? "Выполнено" : "Не выполнено"}</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex items-center justify-center border-t pt-3">
            {isQuantitative ? (
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  size="icon"
                  intent="outline"
                  className="rounded-full w-12 h-12"
                  onClick={handleDecrease}
                >
                  <MinusIcon className="h-6 w-6" />
                </Button>
                <span className="min-w-[70px] text-center text-lg font-medium">
                  {valueToday} {habit.unit}
                </span>
                <Button
                  type="button"
                  size="icon"
                  intent="outline"
                  className="rounded-full w-12 h-12"
                  onClick={handleIncrease}
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                size="lg"
                intent={completedToday ? "primary" : "outline"}
                className="flex items-center gap-2 rounded-full px-6 py-2 text-sm w-full h-12"
                onClick={() =>
                  dispatch(
                    upsertHabitLog({
                      habitId: habit.id,
                      date: todayKey,
                      completed: !completedToday,
                      value: !completedToday ? 1 : 0
                    }),
                  )
                }
              >
                {completedToday && <CheckIcon className="h-5 w-5" />}
                <span className="text-base">{completedToday ? "Выполнено сегодня" : "Отметить выполнение"}</span>
              </Button>
            )}
          </CardFooter>
        </Card>
      </CardTiltContent>
    </CardTilt>
  )
}
