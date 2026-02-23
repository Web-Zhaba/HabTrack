import { I18nProvider } from 'react-aria-components';
import { useHomeCalendar } from '../hooks/useHomeCalendar';
import { UnifiedCalendar } from './calendar/UnifiedCalendar';

export default function WeeklyCalendarCard() {
  const { range, preset, handlePresetChange, handleRangeChange } = useHomeCalendar();

  return (
    <I18nProvider locale="ru-RU">
      <div className="w-full bg-card rounded-xl overflow-hidden shadow-sm border border-border">
        <UnifiedCalendar
          range={range}
          onRangeChange={handleRangeChange}
          preset={preset}
          onPresetChange={handlePresetChange}
        />
      </div>
    </I18nProvider>
  );
}
