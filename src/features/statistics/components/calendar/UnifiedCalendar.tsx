import React, { useState, useCallback, useMemo } from 'react';
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
import { motion, AnimatePresence } from 'motion/react';

interface UnifiedCalendarProps {
  range: RangeValue<DateValue> | null;
  onRangeChange: (range: RangeValue<DateValue>) => void;
  preset?: string;
  onPresetChange?: (preset: string) => void;
}

type CalendarView = 'week' | 'month';

export const UnifiedCalendar = React.memo(
  ({ range, onRangeChange, preset = 'Custom', onPresetChange }: UnifiedCalendarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Вид зависит от состояния разворота: свёрнут = неделя, развёрнут = месяц
    const view: CalendarView = isExpanded ? 'month' : 'week';

    const todayDateValue = today(getLocalTimeZone());

    // Конвертируем CalendarDate в Date для работы с date-fns - обернуто в useMemo
    const todayDate = useMemo(
      () => new Date(todayDateValue.year, todayDateValue.month - 1, todayDateValue.day),
      [todayDateValue.year, todayDateValue.month, todayDateValue.day],
    );

    // Текущая неделя (начинается с понедельника)
    const [currentWeekStartDate, setCurrentWeekStartDate] = useState(() => {
      const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 });
      return new CalendarDate(
        weekStart.getFullYear(),
        weekStart.getMonth() + 1,
        weekStart.getDate(),
      );
    });

    // Текущий месяц для развёрнутого вида
    const [currentMonth, setCurrentMonth] = useState<CalendarDate>(() => todayDateValue);

    // Дни текущей недели
    const weekDays = useMemo(
      () =>
        Array.from({ length: 7 }, (_, i) => {
          const date = addDays(
            new Date(
              currentWeekStartDate.year,
              currentWeekStartDate.month - 1,
              currentWeekStartDate.day,
            ),
            i,
          );
          return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }),
      [currentWeekStartDate],
    );

    const weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const monthLabels = [
      'янв.',
      'фев.',
      'мар.',
      'апр.',
      'май',
      'июн.',
      'июл.',
      'авг.',
      'сен.',
      'окт.',
      'ноя.',
      'дек.',
    ];
    const fullMonthLabels = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];

    // Навигация по неделям
    const handlePrevWeek = useCallback(() => {
      setCurrentWeekStartDate((prev) => {
        const prevDate = new Date(prev.year, prev.month - 1, prev.day);
        const newDate = addDays(prevDate, -7);
        return new CalendarDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
      });
    }, []);

    const handleNextWeek = useCallback(() => {
      setCurrentWeekStartDate((prev) => {
        const prevDate = new Date(prev.year, prev.month - 1, prev.day);
        const newDate = addDays(prevDate, 7);
        return new CalendarDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
      });
    }, []);

    // Навигация по месяцам
    const handlePrevMonth = useCallback(() => {
      setCurrentMonth((prev) => {
        const prevDate = new Date(prev.year, prev.month - 1, 1);
        prevDate.setMonth(prevDate.getMonth() - 1);
        return new CalendarDate(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      });
    }, []);

    const handleNextMonth = useCallback(() => {
      setCurrentMonth((prev) => {
        const prevDate = new Date(prev.year, prev.month - 1, 1);
        prevDate.setMonth(prevDate.getMonth() + 1);
        return new CalendarDate(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      });
    }, []);

    // Переход к сегодня и выбор текущей даты
    const handleGoToToday = useCallback(() => {
      if (view === 'week') {
        const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 });
        setCurrentWeekStartDate(
          new CalendarDate(weekStart.getFullYear(), weekStart.getMonth() + 1, weekStart.getDate()),
        );
      } else {
        setCurrentMonth(todayDateValue);
      }
      // Выбираем сегодняшнюю дату
      onRangeChange({ start: todayDateValue, end: todayDateValue });
      if (onPresetChange) {
        onPresetChange('Custom');
      }
    }, [view, todayDate, todayDateValue, onRangeChange, onPresetChange]);

    // Обработчик выбора дня
    const handleDaySelect = useCallback(
      (day: CalendarDate) => {
        onRangeChange({ start: day, end: day });
        if (onPresetChange) {
          onPresetChange('Custom');
        }
      },
      [onRangeChange, onPresetChange],
    );

    // Проверка, выбран ли день
    const isSelected = useCallback(
      (day: CalendarDate) => {
        if (!range?.start) return false;
        return isSameDay(day, range.start);
      },
      [range],
    );

    // Проверка, сегодня ли
    const isToday = useCallback(
      (day: CalendarDate) => isSameDay(day, todayDateValue),
      [todayDateValue],
    );

    // Проверка, выходной ли
    const isWeekend = useCallback((day: CalendarDate) => {
      const date = new Date(day.year, day.month - 1, day.day);
      const d = date.getDay();
      return d === 0 || d === 6;
    }, []);

    // Форматирование заголовка
    const todayDateObj = new Date(
      todayDateValue.year,
      todayDateValue.month - 1,
      todayDateValue.day,
    );
    const formattedToday = `${todayDateValue.day} ${monthLabels[todayDateValue.month - 1]}, ${weekDayLabels[todayDateObj.getDay() === 0 ? 6 : todayDateObj.getDay() - 1]}`;
    const formattedWeekTitle = `${currentWeekStartDate.day} ${monthLabels[currentWeekStartDate.month - 1]}`;
    const formattedMonthTitle = `${fullMonthLabels[currentMonth.month - 1]} ${currentMonth.year}`;

    // Пресеты
    const presets = [
      { id: 'Last 7 Days', label: '7 дней', shortLabel: '7 дней' },
      { id: 'Last 30 Days', label: '30 дней', shortLabel: '30 дней' },
    ];

    return (
      <div className="flex-1 p-4 sm:p-6 bg-card">
        {/* Верхняя панель */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Сегодня</span>
              <span className="text-sm font-semibold text-foreground">{formattedToday}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Кнопка разворота/сворачивания */}
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
              <motion.div
                animate={{ rotate: isExpanded ? 90 : -90 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Пресеты (только в развёрнутом режиме) */}
        <AnimatePresence>
          {isExpanded && onPresetChange && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent w-full max-w-[222px] sm:max-w-[388px]">
                {presets.map((presetItem) => {
                  // Кнопка активна только если выбран соответствующий пресет
                  // Если preset === 'Custom' или любой другой — обе кнопки неактивны
                  const isActive = preset === presetItem.id;

                  return (
                    <Button
                      key={presetItem.id}
                      onPress={() => onPresetChange(presetItem.id)}
                      className={cn(
                        'flex-1 flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all text-center',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80',
                      )}
                      style={{ maxWidth: 'calc(50% - 4px)' }}
                    >
                      {presetItem.label}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Компактный вид - неделя */}
        <AnimatePresence>
          {!isExpanded && view === 'week' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
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

                        <div
                          className={cn(
                            'relative flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold transition-all',
                            dayIsSelected &&
                              'bg-primary text-primary-foreground shadow-md shadow-primary/30',
                            dayIsToday &&
                              !dayIsSelected &&
                              'ring-2 ring-accent ring-offset-2 ring-offset-background',
                            !dayIsSelected && dayIsWeekend && 'text-primary',
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Развёрнутый вид */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="w-full">
                {/* Кнопка "Сегодня" */}
                <div className="flex items-center justify-center mb-4">
                  <Button
                    onPress={handleGoToToday}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Сегодня
                  </Button>
                </div>

                {view === 'month' ? (
                  /* Вид месяца */
                  <RangeCalendar
                    aria-label="Calendar"
                    value={range}
                    onChange={onRangeChange}
                    className="w-full max-w-[280px] mx-auto"
                  >
                    <header className="flex items-center justify-between w-full mb-6">
                      <Button
                        slot="previous"
                        onPress={handlePrevMonth}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Heading className="text-base font-bold text-foreground text-center flex-1">
                        {formattedMonthTitle}
                      </Heading>
                      <Button
                        slot="next"
                        onPress={handleNextMonth}
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
                            {({
                              isSelected: cellIsSelected,
                              isSelectionStart,
                              isSelectionEnd,
                              isOutsideMonth,
                            }) => {
                              const dayIsWeekend = isWeekend(date);
                              const isTodayDate = isToday(date);

                              return (
                                <div className="w-full h-full flex items-center justify-center relative">
                                  {cellIsSelected && (
                                    <div
                                      className={cn(
                                        'absolute inset-y-1 inset-x-0 bg-primary/20',
                                        isSelectionStart && 'left-1 rounded-l-full',
                                        isSelectionEnd && 'right-1 rounded-r-full',
                                      )}
                                    />
                                  )}

                                  <div
                                    className={cn(
                                      'relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all',
                                      (isSelectionStart || isSelectionEnd) &&
                                        'bg-primary text-primary-foreground shadow-sm',
                                      isTodayDate &&
                                        !cellIsSelected &&
                                        'ring-2 ring-accent ring-offset-2 ring-offset-background',
                                      !cellIsSelected &&
                                        !isOutsideMonth &&
                                        dayIsWeekend &&
                                        'text-primary',
                                      !cellIsSelected &&
                                        !isOutsideMonth &&
                                        !dayIsWeekend &&
                                        'text-foreground',
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
                ) : (
                  /* Вид нескольких недель (4 недели) */
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-between w-full max-w-[280px]">
                      <Button
                        onPress={handlePrevWeek}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <span className="text-sm font-medium text-foreground">
                        {formattedWeekTitle}
                      </span>
                      <Button
                        onPress={handleNextWeek}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors outline-none rounded-full hover:bg-accent"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* 4 недели подряд */}
                    <div className="grid grid-cols-7 gap-1 w-full max-w-[280px]">
                      {Array.from({ length: 28 }, (_, i) => {
                        const date = addDays(
                          new Date(
                            currentWeekStartDate.year,
                            currentWeekStartDate.month - 1,
                            currentWeekStartDate.day,
                          ),
                          i,
                        );
                        const calendarDate = new CalendarDate(
                          date.getFullYear(),
                          date.getMonth() + 1,
                          date.getDate(),
                        );
                        const dayIsWeekend = isWeekend(calendarDate);
                        const dayIsToday = isToday(calendarDate);
                        const dayIsSelected = isSelected(calendarDate);
                        const weekIndex = Math.floor(i / 7);
                        const dayIndex = i % 7;

                        return (
                          <button
                            key={calendarDate.toString()}
                            onClick={() => handleDaySelect(calendarDate)}
                            className={cn(
                              'flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
                              dayIsSelected && 'bg-primary/10',
                            )}
                          >
                            {weekIndex === 0 && (
                              <span
                                className={cn(
                                  'text-[8px] font-medium uppercase tracking-wider',
                                  dayIsToday
                                    ? 'text-primary font-bold'
                                    : dayIsWeekend
                                      ? 'text-primary'
                                      : 'text-muted-foreground',
                                )}
                              >
                                {weekDayLabels[dayIndex]}
                              </span>
                            )}

                            <div
                              className={cn(
                                'relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all',
                                dayIsSelected && 'bg-primary text-primary-foreground shadow-sm',
                                dayIsToday &&
                                  !dayIsSelected &&
                                  'ring-2 ring-accent ring-offset-2 ring-offset-background',
                                !dayIsSelected && dayIsWeekend && 'text-primary',
                                !dayIsSelected && !dayIsWeekend && 'text-foreground',
                              )}
                            >
                              {calendarDate.day}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
