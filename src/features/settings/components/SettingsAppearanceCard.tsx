import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SettingsAppearanceCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
        <div>
          <CardTitle>Оформление</CardTitle>
          <CardDescription>Выберите светлую, тёмную или системную тему.</CardDescription>
        </div>
        <ModeToggle />
      </CardHeader>
    </Card>
  )
}

