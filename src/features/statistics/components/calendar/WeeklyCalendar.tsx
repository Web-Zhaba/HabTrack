import React, { useState } from 'react';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar,
  type DateValue,
  type RangeValue,
} from 'react-aria-components';
import { today, getLocalTimeZone, isSameDay, CalendarDate } from '@internationalized/date';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addDays, startOfWeek } from 'date-fns';
import { useDateFormat } from '@features/settings/hooks/useDateFormat';

interface WeeklyCalendarProps {
  range: RangeValue<DateValue> | null;
  onRangeChange: (range: RangeValue<DateValue>) => void;
  preset?: string;
  onPresetChange?: (preset: string) => void;
}

export const WeeklyCalendar = React.memo(({ range, onRangeChange }: WeeklyCalendarProps) => {
  const { formatDate } = useDateFormat();
  const [isExpanded, setIsExpanded] = useState(false);

  const todayDateValue = today(getLocalTimeZone());

  // Конвертируем CalendarDate в Date для работы с date-fns
  const todayDate = new Date(todayDateValue.year, todayDateValue.month - 1, todayDateValue.day);

  // Текущая неделя (начинается с понедельника)
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(() => {
    const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 });
    return new CalendarDate(weekStart.getFullYear(), weekStart.getMonth() + 1, weekStart.getDate());
  });

  // Форматирование заголовка (сегодняшняя дата) с использованием формата из настроек
  const formattedToday = formatDate(todayDate, 'd MMM, EEE');

  // Форматирование заголовка для текущей недели
  const currentWeekDate = new Date(
    currentWeekStartDate.year,
    currentWeekStartDate.month - 1,
    currentWeekStartDate.day,
  );
  const formattedWeekTitle = formatDate(currentWeekDate, 'd MMM');

  // Дни текущей недели
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(
      new Date(currentWeekStartDate.year, currentWeekStartDate.month - 1, currentWeekStartDate.day),
      i,
    );
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  });

  const weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Навигация по неделям
  const handlePrevWeek = () => {
    setCurrentWeekStartDate((prev) => {
      const prevDate = new Date(prev.year, prev.month - 1, prev.day);
      const newDate = addDays(prevDate, -7);
      return new CalendarDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStartDate((prev) => {
      const prevDate = new Date(prev.year, prev.month - 1, prev.day);
      const newDate = addDays(prevDate, 7);
      return new CalendarDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
    });
  };

  // Обработчик выбора дня
  const handleDaySelect = (day: CalendarDate) => {
    onRangeChange({ start: day, end: day });
  };

  // Проверка, выбран ли день
  const isSelected = (day: CalendarDate) => {
    if (!range?.start) return false;
    return isSameDay(day, range.start);
  };

  // Проверка, сегодня ли
  const isToday = (day: CalendarDate) => {
    return isSameDay(day, todayDateValue);
  };

  // Проверка, выходной ли
  const isWeekend = (day: CalendarDate) => {
    const date = new Date(day.year, day.month - 1, day.day);
    const d = date.getDay();
    return d === 0 || d === 6; // 0 = Sunday, 6 = Saturday
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-card">
      {/* Заголовок с датой и кнопкой разворота */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Сегодня</span>
            <span className="text-sm font-semibold text-foreground">{formattedToday}</span>
          </div>
        </div>
        <Button
          onPress={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
            isExpanded
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
          <ChevronLeft
            className={cn(
              'w-3.5 h-3.5 transition-transform',
              isExpanded ? 'rotate-90' : '-rotate-90',
            )}
          />
        </Button>
      </div>

      {/* Вид недели */}
      {!isExpanded && (
        <div className="w-full">
          {/* Навигация по неделям */}
          <div className="flex items-center justify-between mb-3">
            <Button
              onPress={handlePrevWeek}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-medium text-foreground">{formattedWeekTitle}</span>
            <Button
              onPress={handleNextWeek}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day: CalendarDate, index: number) => {
              const dayIsWeekend = isWeekend(day);
              const dayIsToday = isToday(day);
              const dayIsSelected = isSelected(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDaySelect(day)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    dayIsSelected && 'bg-primary/10',
                  )}
                >
                  {/* День недели */}
                  <span
                    className={cn(
                      'text-[10px] font-medium uppercase tracking-wider',
                      dayIsToday
                        ? 'text-primary font-bold'
                        : dayIsWeekend
                          ? 'text-primary'
                          : 'text-muted-foreground',
                    )}
                  >
                    {weekDayLabels[index]}
                  </span>

                  {/* Число */}
                  <div
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold transition-all',
                      // Selected State
                      dayIsSelected &&
                        'bg-primary text-primary-foreground shadow-md shadow-primary/30',
                      // Today Indicator - thicker ring, different color
                      dayIsToday &&
                        !dayIsSelected &&
                        'ring-2 ring-accent ring-offset-2 ring-offset-background',
                      // Weekend
                      !dayIsSelected && dayIsWeekend && 'text-primary',
                      // Weekday
                      !dayIsSelected && !dayIsWeekend && 'text-foreground',
                    )}
                  >
                    {day.day}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Полный календарь (развёрнутый вид) */}
      {isExpanded && (
        <RangeCalendar
          aria-label="Calendar"
          value={range}
          onChange={onRangeChange}
          className="w-full max-w-[280px] mx-auto"
        >
          <header className="flex items-center justify-between w-full mb-6">
            <Button
              slot="previous"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Heading className="text-base font-bold text-foreground text-center flex-1" />
            <Button
              slot="next"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </header>

          <CalendarGrid className="border-collapse">
            <CalendarGridHeader>
              {(day) => (
                <CalendarHeaderCell className="text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">
                  {day}
                </CalendarHeaderCell>
              )}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => (
                <CalendarCell
                  date={date}
                  className="w-9 h-9 p-0 relative outline-none cursor-default group"
                >
                  {({ isSelected, isSelectionStart, isSelectionEnd, isOutsideMonth }) => {
                    const dayIsWeekend = isWeekend(date);
                    const isToday = isSameDay(date, todayDateValue);

                    return (
                      <div className="w-full h-full flex items-center justify-center relative">
                        {/* Background Band */}
                        {isSelected && (
                          <div
                            className={cn(
                              'absolute inset-y-1 inset-x-0 bg-primary/20',
                              isSelectionStart && 'left-1 rounded-l-full',
                              isSelectionEnd && 'right-1 rounded-r-full',
                            )}
                          />
                        )}

                        {/* Text / Circle */}
                        <div
                          className={cn(
                            'relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all',
                            // Selected State (Start/End)
                            (isSelectionStart || isSelectionEnd) &&
                              'bg-primary text-primary-foreground shadow-sm',
                            // Today Indicator (Border)
                            isToday &&
                              !isSelected &&
                              'ring-2 ring-accent ring-offset-2 ring-offset-background',
                            // Weekend
                            !isSelected && !isOutsideMonth && dayIsWeekend && 'text-primary',
                            // Weekday
                            !isSelected && !isOutsideMonth && !dayIsWeekend && 'text-foreground',
                            // Outside Month
                            isOutsideMonth && 'text-muted-foreground/50',
                          )}
                        >
                          {date.day}
                        </div>
                      </div>
                    );
                  }}
                </CalendarCell>
              )}
            </CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      )}
    </div>
  );
});
