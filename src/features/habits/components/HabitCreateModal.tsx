import { useMemo, useState } from 'react';
import BasicModal from '@/components/ui/smoothui/basic-modal';
import AnimatedInput from '@/components/ui/smoothui/animated-input';
import AnimatedTags from '@/components/ui/smoothui/animated-tags';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field-copy';
import { Button } from '@/components/ui/button';
import { PaletteSwatchButton } from '@/components/ui/palette-swatch-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/animated-tabs';
import { AnimatedNumberField } from '@/components/ui/number-field';

import type { Habit, HabitType } from '../types/habit.types';
import { COLOR_OPTIONS, type ColorToken, HABIT_ICONS, type HabitIconName } from '../constants';

type HabitCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: Habit) => void;
  initialData?: Habit;
};

type FormErrors = {
  name?: string;
  target?: string;
  unit?: string;
  tags?: string;
};

type HabitFormProps = {
  initialData?: Habit;
  onSubmit: (habit: Habit) => void;
  onClose: () => void;
};

function HabitForm({ initialData, onSubmit, onClose }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [type, setType] = useState<HabitType>(initialData?.type ?? 'binary');
  const [target, setTarget] = useState(initialData?.target ? String(initialData.target) : '');
  const [unit, setUnit] = useState(initialData?.unit ?? '');
  const [color, setColor] = useState<ColorToken>(
    (initialData?.color as ColorToken) ?? COLOR_OPTIONS[0].value,
  );

  const [tags, setTags] = useState<string[]>(
    initialData?.tags ?? (initialData?.categoryId ? [initialData.categoryId] : ['здоровье']),
  );
  const [icon, setIcon] = useState<HabitIconName>(
    initialData?.icon && HABIT_ICONS[initialData.icon] ? initialData.icon : 'activity',
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const colorOptions = useMemo(() => COLOR_OPTIONS, []);

  const availableTags = useMemo(
    () => ['здоровье', 'продуктивность', 'изучение', 'активность', 'спорт', 'чтение', 'работа'],
    [],
  );

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Введите название привычки';
    }

    if (tags.length === 0) {
      nextErrors.tags = 'Выберите хотя бы один тег';
    }

    if (type === 'quantitative') {
      const numericTarget = Number(target);
      if (!target.trim() || Number.isNaN(numericTarget) || numericTarget <= 0) {
        nextErrors.target = 'Укажите положительную числовую цель';
      }
      if (!unit.trim()) {
        nextErrors.unit = 'Укажите единицу измерения';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const now = new Date().toISOString();
    const numericTarget = Number(target);

    const habit: Habit = {
      id: initialData?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      tags,
      categoryId: tags[0], // Backward compatibility
      color,
      type,
      createdAt: initialData?.createdAt ?? now,
    };

    if (icon) {
      habit.icon = icon;
    }

    if (type === 'quantitative') {
      habit.target = numericTarget;
      habit.unit = unit.trim();
    }

    onSubmit(habit);
  };

  const isSubmitDisabled =
    !name.trim() || (type === 'quantitative' && (!target.trim() || !unit.trim()));

  return (
    <div className="custom-scroll flex max-h-[80vh] flex-col gap-5 overflow-y-auto pr-1 pl-2 sm:gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Тип привычки</FieldLabel>
          <FieldContent>
            <Tabs defaultValue={type} onValueChange={(value) => setType(value as HabitType)}>
              <TabsList>
                <TabsTrigger value="binary">Бинарная</TabsTrigger>
                <TabsTrigger value="quantitative">Количественная</TabsTrigger>
              </TabsList>
              <div className="overflow-hidden rounded-b-md border border-t-0 bg-muted/40">
                <TabsContent value="binary">
                  <p className="text-muted-foreground text-sm">
                    Бинарная привычка: выполнено или нет, без числовой цели.
                  </p>
                </TabsContent>
                <TabsContent value="quantitative">
                  <p className="text-muted-foreground text-sm">
                    Количественная привычка с числовой целью и единицами измерения.
                  </p>
                </TabsContent>
              </div>
            </Tabs>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent>
            <AnimatedInput
              label="Название"
              value={name}
              onChange={setName}
              placeholder="Например, Утренняя зарядка"
              className="w-[98%] mx-auto"
            />
            <FieldError errors={errors.name ? [{ message: errors.name }] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldContent>
            <AnimatedInput
              label="Описание"
              value={description}
              onChange={setDescription}
              placeholder="Как именно вы будете выполнять эту привычку?"
              className="w-[98%] mx-auto"
            />
          </FieldContent>
        </Field>

        {type === 'quantitative' && (
          <Field>
            <FieldLabel>Цель и единицы</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-end">
                <div>
                  <AnimatedNumberField
                    label="Цель"
                    minValue={1}
                    value={target ? Number(target) : undefined}
                    onChange={(value) => {
                      if (value == null || value === 0) {
                        setTarget('');
                        return;
                      }
                      setTarget(String(value));
                    }}
                    className="w-[98%] mx-auto"
                  />
                </div>
                <div>
                  <AnimatedInput
                    label="Единица измерения"
                    value={unit}
                    onChange={setUnit}
                    placeholder="км, страниц, минут"
                    className="w-[98%] mx-auto"
                  />
                </div>
              </div>
              <FieldError
                errors={[
                  errors.target ? { message: errors.target } : undefined,
                  errors.unit ? { message: errors.unit } : undefined,
                ].filter(Boolean)}
              />
            </FieldContent>
          </Field>
        )}

        <Field>
          <FieldLabel>Теги</FieldLabel>
          <FieldContent>
            <AnimatedTags initialTags={availableTags} selectedTags={tags} onChange={setTags} />
            <FieldDescription>Выберите теги или добавьте свои.</FieldDescription>
            <FieldError errors={errors.tags ? [{ message: errors.tags }] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Цвет на графиках</FieldLabel>
          <FieldContent>
            <div className="flex flex-wrap items-center gap-3">
              {colorOptions.map((option) => (
                <PaletteSwatchButton
                  key={option.value}
                  color={`var(${option.value})`}
                  isSelected={color === option.value}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
            <FieldDescription>
              Используется для прогресс-баров и графиков этой привычки.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Иконка</FieldLabel>
          <FieldContent>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 max-h-60 overflow-y-auto custom-scroll p-1">
              {(Object.keys(HABIT_ICONS) as HabitIconName[]).map((key: HabitIconName) => {
                const IconComponent = HABIT_ICONS[key];
                const isActive = icon === key;

                return (
                  <Button
                    key={key}
                    size="sq-md"
                    intent="ghost"
                    onPress={() => setIcon(key)}
                    className={
                      isActive
                        ? 'border border-primary bg-primary/10 text-primary shadow-sm hover:-translate-y-0.5 transition-all duration-300'
                        : 'border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:-translate-y-0.5 transition-all duration-300'
                    }
                  >
                    <IconComponent className="h-6 w-6" />
                  </Button>
                );
              })}
            </div>
            <FieldDescription>Иконка используется в списках и карточках привычек.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" intent="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="button" onClick={handleSubmit} isDisabled={isSubmitDisabled}>
          {initialData ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </div>
  );
}

export function HabitCreateModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: HabitCreateModalProps) {
  return (
    <BasicModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Редактировать привычку' : 'Новая привычка'}
      size="xl"
    >
      <HabitForm initialData={initialData} onSubmit={onSubmit} onClose={onClose} />
    </BasicModal>
  );
}
