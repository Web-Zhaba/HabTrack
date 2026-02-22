import { I18nProvider } from "react-aria-components"
import { useHomeCalendar } from "../hooks/useHomeCalendar"
import { CalendarControls } from "./calendar/CalendarControls"
import { CalendarView } from "./calendar/CalendarView"

export default function HomeCalendarCard() {
  const {
    range,
    preset,
    handlePresetChange,
    handleStartChange,
    handleEndChange,
    handleApply,
    handleRangeChange
  } = useHomeCalendar()

  return (
    <I18nProvider locale="ru-RU">
      <div className="flex flex-col md:flex-row w-full h-full bg-card rounded-xl overflow-hidden shadow-sm border border-border">
        <CalendarControls
          preset={preset}
          range={range}
          onPresetChange={handlePresetChange}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          onApply={handleApply}
        />
        <CalendarView
          range={range}
          onRangeChange={handleRangeChange}
        />
      </div>
    </I18nProvider>
  )
}
