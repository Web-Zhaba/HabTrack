import React from "react"
import { Button, Select, SelectValue, Popover, ListBox, ListBoxItem, type DateValue } from "react-aria-components"
import { ChevronDown } from "lucide-react"
import { DateField, DateInput } from "@/components/ui/date-field"
import type { RangeValue } from "react-aria-components"

interface CalendarControlsProps {
  preset: string
  range: RangeValue<DateValue> | null
  onPresetChange: (key: React.Key | null) => void
  onStartChange: (date: DateValue | null) => void
  onEndChange: (date: DateValue | null) => void
  onApply: () => void
}

export const CalendarControls = React.memo(({
  preset,
  range,
  onPresetChange,
  onStartChange,
  onEndChange,
  onApply
}: CalendarControlsProps) => {
  return (
    <div className="w-full md:w-64 p-5 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-border bg-card">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
          Выберите период:
        </label>
        <Select 
          selectedKey={preset} 
          onSelectionChange={onPresetChange}
          className="w-full"
          aria-label="Date Range Preset"
        >
          <Button className="flex items-center justify-between w-full px-3 py-2 text-sm text-foreground bg-background border border-input rounded-md shadow-sm outline-none focus:border-ring transition-colors">
            <SelectValue />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Popover className="min-w-[var(--trigger-width)] bg-popover border border-border rounded-md shadow-lg p-1 z-50">
            <ListBox className="outline-none">
              <ListBoxItem id="Custom" textValue="Пользовательский" className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none text-popover-foreground">Пользовательский</ListBoxItem>
              <ListBoxItem id="Last 7 Days" textValue="Последние 7 дней" className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none text-popover-foreground">Последние 7 дней</ListBoxItem>
              <ListBoxItem id="Last 30 Days" textValue="Последние 30 дней" className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none text-popover-foreground">Последние 30 дней</ListBoxItem>
            </ListBox>
          </Popover>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        {/* Start Date Input */}
        <DateField 
          value={range?.start} 
          onChange={onStartChange}
          aria-label="Start Date"
          className="group relative flex items-center h-12 w-full rounded-2xl bg-card border border-input shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20"
        >
          <div className="h-full flex items-center justify-center w-[80px] px-4 bg-primary text-primary-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Начало</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <DateInput className="bg-transparent p-0 text-sm border-none shadow-none focus-within:ring-0 focus-within:border-none rounded-none uppercase tracking-wide text-center font-mono text-foreground" />
          </div>
        </DateField>

        {/* End Date Input */}
        <DateField 
          value={range?.end} 
          onChange={onEndChange}
          aria-label="End Date"
          className="group relative flex items-center h-12 w-full rounded-2xl bg-card border border-input shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20"
        >
          <div className="h-full flex items-center justify-center w-[80px] px-4 bg-primary text-primary-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Конец</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <DateInput className="bg-transparent p-0 text-sm border-none shadow-none focus-within:ring-0 focus-within:border-none rounded-none uppercase tracking-wide text-center font-mono text-foreground" />
          </div>
        </DateField>
      </div>

      <Button 
        onPress={onApply}
        className="mt-auto w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-full shadow-sm transition-colors outline-none focus:ring-2 focus:ring-ring/40 active:scale-[0.98]"
      >
        Применить
      </Button>
    </div>
  )
})
