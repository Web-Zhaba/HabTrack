import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import BasicModal from '@/components/ui/smoothui/basic-modal';
import { useDataImport } from '@features/settings/hooks/useDataImport';

export interface ImportDataButtonProps {
  onImportComplete?: () => void;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
}

export function ImportDataButton({
  onImportComplete,
  buttonProps,
  children,
}: ImportDataButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { importData, isImporting, error, clearError } = useDataImport();

  const handleOpenModal = () => {
    clearError();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file)
        .then(() => {
          setIsModalOpen(false);
          onImportComplete?.();
        })
        .catch(() => {
          // Ошибка уже обработана в хуке
        });
    }
  };

  return (
    <>
      <Button
        type="button"
        intent="outline"
        onClick={handleOpenModal}
        isDisabled={isImporting}
        {...buttonProps}
      >
        {children ?? (
          <>
            <Upload />
            {isImporting ? 'Загрузка...' : 'Импортировать данные'}
          </>
        )}
      </Button>

      <BasicModal isOpen={isModalOpen} onClose={handleCloseModal} title="Импорт данных" size="sm">
        <div className="space-y-4">
          <p className="text-sm">
            Выберите JSON-файл с данными для импорта.
            <span className="mt-2 block text-amber-600">
              Внимание: текущие данные будут заменены!
            </span>
          </p>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <input
            id="import-data-file-input"
            type="file"
            accept=".json"
            onChange={handleImportFile}
            disabled={isImporting}
            aria-label="Выберите JSON-файл для импорта данных"
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90
              disabled:opacity-50"
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" intent="outline" onClick={handleCloseModal}>
              Отмена
            </Button>
          </div>
        </div>
      </BasicModal>
    </>
  );
}
