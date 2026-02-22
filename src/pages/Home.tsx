import HomeCalendarCard from "../features/statistics/components/HomeCalendarCard"
import { HabitsSummaryCard } from "../features/statistics/components/HabitsSummaryCard"
// import { HomeHabitCard } from "../features/habits/components/HomeHabitCard"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import type { Habit } from "../features/habits/types/habit.types"

export default function HomePage() {
  const habits = useSelector((state: RootState) => state.habits.items) as Habit[]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Добро пожаловать!
        </h1>
        <p className="text-muted-foreground">
          Отслеживайте свои привычки, достигайте целей и двигайтесь к лучшей версии себя каждый день.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-auto">
             <HomeCalendarCard />
        </div>
        <div className="flex-1">
             <HabitsSummaryCard />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ваши привычки</h2>
        {habits.length === 0 ? (
            <div className="text-center text-muted-foreground p-8 border rounded-lg bg-card/50">
                У вас пока нет привычек. Добавьте первую на странице "Привычки"!
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {habits.map((habit) => (
                    <HomeHabitCard key={habit.id} habit={habit} />
                ))} */}
            </div>
        )}
      </div>
    </div>
  )
}

