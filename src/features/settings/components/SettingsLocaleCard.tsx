import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Language = "ru" | "en"

type DateFormat = "dd.MM.yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd"

export default function SettingsLocaleCard() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "ru"
    }

    const storedLanguage = window.localStorage.getItem("habtrack-language")

    if (storedLanguage === "ru" || storedLanguage === "en") {
      return storedLanguage
    }

    return "ru"
  })

  const [dateFormat, setDateFormat] = useState<DateFormat>(() => {
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

  return (
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
              intent={language === "ru" ? "primary" : "outline"}
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setLanguage("ru")}
            >
              Русский
            </Button>
            <Button
              type="button"
              intent={language === "en" ? "primary" : "outline"}
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
              intent={dateFormat === "dd.MM.yyyy" ? "primary" : "outline"}
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setDateFormat("dd.MM.yyyy")}
            >
              31.12.2024
            </Button>
            <Button
              type="button"
              intent={dateFormat === "MM/dd/yyyy" ? "primary" : "outline"}
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setDateFormat("MM/dd/yyyy")}
            >
              12/31/2024
            </Button>
            <Button
              type="button"
              intent={dateFormat === "yyyy-MM-dd" ? "primary" : "outline"}
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
  )
}
