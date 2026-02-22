import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiDownload, FiTrash2 } from "react-icons/fi"
import BasicModal from "@/components/ui/smoothui/basic-modal"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../app/store"
import { setHabits } from "src/features/habits/store/habitsSlice"
import { clearHabitLogs } from "src/features/statistics/store/habitLogsSlice"

export default function SettingsDataCard() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

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
    setIsResetModalOpen(true)
  }

  const confirmResetData = () => {
    dispatch(setHabits([]))
    dispatch(clearHabitLogs())
    window.localStorage.removeItem("habtrack-data")
    setIsResetModalOpen(false)
  }

  return (
    <>
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
              intent="outline"
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
              intent="danger"
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

      <BasicModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Очистить данные?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm">
            Вы уверены, что хотите полностью очистить все локальные данные? Это действие нельзя
            отменить.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              intent="outline"
              onClick={() => setIsResetModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              intent="danger"
              onClick={confirmResetData}
            >
              Очистить данные
            </Button>
          </div>
        </div>
      </BasicModal>
    </>
  )
}
