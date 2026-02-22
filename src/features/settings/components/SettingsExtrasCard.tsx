import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiBell } from "react-icons/fi"

export default function SettingsExtrasCard() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Дополнительные настройки</CardTitle>
        <CardDescription>
          Необязательные функции и эксперименты, которые могут быть полезны для некоторых пользователей.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex flex-col items-start gap-4 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Ежедневное напоминание</p>
            <p className="text-muted-foreground text-xs">
              Заглушка для напоминаний о привычках. Нужно связать с реальными уведомлениями позже.
            </p>
          </div>
          <Button
            type="button"
            intent="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <FiBell />
            Включить напоминания
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
