import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedInput from '@/components/ui/smoothui/animated-input';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { selectDateFormat, setDateFormat } from '@features/settings/store';
import { Check } from 'lucide-react';

// Пресеты форматов
const DATE_FORMAT_PRESETS = [
  { label: '24.02.2026', value: 'dd.MM.yyyy', description: 'DD.MM.YYYY' },
  { label: '02/24/2026', value: 'MM/dd/yyyy', description: 'MM/DD/YYYY' },
  { label: '2026-02-24', value: 'yyyy-MM-dd', description: 'YYYY-MM-DD' },
  { label: '24 февраля 2026', value: 'dd MMMM yyyy', description: 'DD MMMM YYYY' },
];

interface DateFormatPickerProps {
  className?: string;
}

export function DateFormatPicker({ className }: DateFormatPickerProps) {
  const dispatch = useAppDispatch();
  const currentFormat = useAppSelector(selectDateFormat);

  // Состояние для кастомного формата
  const [customFormat, setCustomFormat] = useState(currentFormat);
  const [isCustom, setIsCustom] = useState(
    !DATE_FORMAT_PRESETS.some((p) => p.value === currentFormat),
  );
  const [error, setError] = useState<string | null>(null);

  // Текущая дата для превью
  const today = new Date();

  // Проверка валидности формата
  const validateFormat = useCallback(
    (fmt: string): boolean => {
      if (!fmt.trim()) return false;

      // Проверяем что формат содержит хотя бы день и год
      const hasDay = /d+/.test(fmt);
      const hasYear = /y+/.test(fmt);

      if (!hasDay || !hasYear) {
        setError('Формат должен содержать день (d) и год (y)');
        return false;
      }

      // Пробуем отформатировать дату
      try {
        format(today, fmt);
        setError(null);
        return true;
      } catch {
        setError('Неверный формат даты');
        return false;
      }
    },
    [today],
  );

  // Обработчик выбора пресета
  const handlePresetClick = useCallback(
    (presetValue: string) => {
      dispatch(setDateFormat(presetValue));
      setIsCustom(false);
      setCustomFormat(presetValue);
      setError(null);
    },
    [dispatch],
  );

  // Форматированное превью
  const previewDate = currentFormat
    ? format(today, currentFormat, { locale: ru })
    : 'Ошибка формата';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Формат даты</CardTitle>
        <CardDescription>Выберите формат отображения дат в приложении</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Пресеты */}
        <div className="grid grid-cols-2 gap-2">
          {DATE_FORMAT_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant={currentFormat === preset.value && !isCustom ? 'default' : 'outline'}
              className="h-auto py-2 px-3 flex flex-col items-start gap-1"
              onClick={() => handlePresetClick(preset.value)}
            >
              <div className="flex items-center gap-2">
                {currentFormat === preset.value && !isCustom && <Check className="w-4 h-4" />}
                <span className="font-medium">{preset.label}</span>
              </div>
              <span className="text-xs text-foreground">{preset.description}</span>
            </Button>
          ))}
        </div>

        {/* Кастомный формат */}
        <div className="space-y-2">
          <AnimatedInput
            label="Свой формат"
            value={customFormat}
            onChange={(value) => {
              setCustomFormat(value);
              if (validateFormat(value)) {
                dispatch(setDateFormat(value));
                setIsCustom(true);
              }
            }}
            placeholder="dd.MM.yyyy"
            className={error ? '[&>input]:border-destructive' : ''}
            action={isCustom ? <Check className="w-5 h-5 text-green-500" /> : null}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">
            Допустимые токены: d, dd, M, MM, MMM, MMMM, y, yy, yyyy
          </p>
        </div>

        {/* Превью */}
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Пример:</p>
          <p className="text-lg font-medium">{previewDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}
