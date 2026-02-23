import { useCallback, useState } from 'react';
import { useAppDispatch } from '@app/store/hooks';
import { setHabits } from '@features/habits/store/habitsSlice';
import { upsertManyHabitLogs } from '@features/statistics/store/habitLogsSlice';

interface ExportData {
  habits: {
    items: unknown[];
  };
  habitLogs: {
    items: unknown[];
  };
}

export function useDataImport() {
  const dispatch = useAppDispatch();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const importData = useCallback(
    (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        setIsImporting(true);
        setError(null);

        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string) as ExportData;

            // Валидация структуры
            if (!data.habits || !Array.isArray(data.habits.items)) {
              throw new Error('Неверный формат файла: отсутствует массив привычек');
            }

            if (!data.habitLogs || !Array.isArray(data.habitLogs.items)) {
              throw new Error('Неверный формат файла: отсутствует массив логов');
            }

            // Диспатчим данные
            dispatch(setHabits(data.habits.items as never));
            dispatch(upsertManyHabitLogs(data.habitLogs.items as never));

            // Сохраняем в localStorage
            window.localStorage.setItem('habtrack-data', JSON.stringify(data));

            setIsImporting(false);
            resolve();
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
            setError(errorMessage);
            setIsImporting(false);
            reject(new Error(errorMessage));
          }
        };

        reader.onerror = () => {
          setError('Ошибка чтения файла');
          setIsImporting(false);
          reject(new Error('Ошибка чтения файла'));
        };

        reader.readAsText(file);
      });
    },
    [dispatch],
  );

  return { importData, isImporting, error, clearError };
}
