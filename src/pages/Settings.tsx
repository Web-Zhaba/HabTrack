import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiDownload, FiTrash2, FiBell } from "react-icons/fi"
import { useTheme } from "@/components/ThemeProvider"

export default function SettingsPage() {
  const { palette, setPalette } = useTheme()
  const [language, setLanguage] = useState<"ru" | "en">(() => {
    if (typeof window === "undefined") {
      return "ru"
    }

    const storedLanguage = window.localStorage.getItem("habtrack-language")

    if (storedLanguage === "ru" || storedLanguage === "en") {
      return storedLanguage
    }

    return "ru"
  })

  const [dateFormat, setDateFormat] = useState<"dd.MM.yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd">(() => {
    if (typeof window === "undefined") {
      return "dd.MM.yyyy"
    }

    const storedDateFormat = window.localStorage.getItem("habtrack-date-format")

    if (
      storedDateFormat === "dd.MM.yyyy" ||
      storedDateFormat === "MM/dd/yyyy" ||
      storedDateFormat === "yyyy-MM-dd"
    ) {
      return storedDateFormat
    }

    return "dd.MM.yyyy"
  })

  useEffect(() => {
    window.localStorage.setItem("habtrack-language", language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem("habtrack-date-format", dateFormat)
  }, [dateFormat])

  const handleExportData = () => {
    const data = window.localStorage.getItem("habtrack-data") ?? "{}"
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "habtrack-export.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleResetData = () => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите полностью очистить все локальные данные? Это действие нельзя отменить."
    )

    if (!confirmed) {
      return
    }

    window.localStorage.clear()
  }

  const paletteOptions: {
    id: "default" | "forest" | "sunset"
    label: string
    description: string
  }[] = [
    {
      id: "default",
      label: "По умолчанию",
      description: "Сбалансированная зелёная палитра для комфортного повседневного использования.",
    },
    {
      id: "forest",
      label: "Лес",
      description: "Более глубокие зелёные оттенки для спокойной концентрации.",
    },
    {
      id: "sunset",
      label: "Закат",
      description: "Тёплая оранжево-розовая палитра с мягкими контрастами.",
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Настройки</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Управляйте внешним видом, данными и дополнительными опциями дневника привычек.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
          <div>
            <CardTitle>Оформление</CardTitle>
            <CardDescription>Выберите светлую, тёмную или системную тему.</CardDescription>
          </div>
          <ModeToggle />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Цветовая палитра</CardTitle>
          <CardDescription>
            Выберите цветовое оформление интерфейса. Можно комбинировать с любым режимом темы.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 py-4 sm:grid-cols-3">
          {paletteOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              data-active={palette === option.id}
              onClick={() => setPalette(option.id)}
              className="group flex flex-col rounded-lg border p-3 text-left text-xs transition-all hover:border-primary hover:shadow-sm data-[active=true]:border-primary data-[active=true]:shadow-md"
            >
              <div className="mb-2 flex w-full gap-1">
                <div className="flex-1 rounded-md border bg-zinc-50 p-[2px] dark:bg-zinc-900/80">
                  <div
                    className="h-7 w-full rounded-[4px]"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--palette-${option.id}-light-primary), var(--palette-${option.id}-light-accent))`,
                    }}
                  />
                  <span className="mt-0.5 block text-[10px] font-medium text-zinc-500">
                    Light
                  </span>
                </div>
                <div className="flex-1 rounded-md border bg-zinc-900 p-[2px]">
                  <div
                    className="h-7 w-full rounded-[4px]"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--palette-${option.id}-dark-primary), var(--palette-${option.id}-dark-accent))`,
                    }}
                  />
                  <span className="mt-0.5 block text-[10px] font-medium text-zinc-200">
                    Dark
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium">{option.label}</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">
                {option.description}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Язык и формат даты</CardTitle>
          <CardDescription>
            Настройте язык интерфейса и предпочитаемый формат отображения дат.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-start justify-between gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Язык интерфейса</p>
              <p className="text-muted-foreground text-xs">
                Предпочитаемый язык. Можно подключить полноценную локализацию позже.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                type="button"
                variant={language === "ru" ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setLanguage("ru")}
              >
                Русский
              </Button>
              <Button
                type="button"
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setLanguage("en")}
              >
                English
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Формат даты</p>
              <p className="text-muted-foreground text-xs">
                Как будут отображаться даты в интерфейсе и отчётах.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant={dateFormat === "dd.MM.yyyy" ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setDateFormat("dd.MM.yyyy")}
              >
                31.12.2024
              </Button>
              <Button
                type="button"
                variant={dateFormat === "MM/dd/yyyy" ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setDateFormat("MM/dd/yyyy")}
              >
                12/31/2024
              </Button>
              <Button
                type="button"
                variant={dateFormat === "yyyy-MM-dd" ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setDateFormat("yyyy-MM-dd")}
              >
                2024-12-31
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Данные</CardTitle>
          <CardDescription>
            Экспортируйте свои данные или полностью очистите локальное хранилище.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-start justify-between gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Экспорт данных</p>
              <p className="text-muted-foreground text-xs">
                Скачайте JSON-файл со всеми данными, сохранёнными в браузере.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleExportData}
            >
              <FiDownload />
              Экспортировать
            </Button>
          </div>

          <div className="flex flex-col items-start justify-between gap-2 rounded-lg border bg-destructive/5 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Сброс данных</p>
              <p className="text-muted-foreground text-xs">
                Полностью очищает localStorage. Действие необратимо.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleResetData}
            >
              <FiTrash2 />
              Очистить данные
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Дополнительные настройки</CardTitle>
          <CardDescription>
            Небольшие удобные опции, которые можно доработать в будущем.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-start gap-4 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Ежедневное напоминание</p>
              <p className="text-muted-foreground text-xs">
                Заглушка для напоминаний о привычках. Можно связать с реальными уведомлениями позже.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              <FiBell />
              Включить позже
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
