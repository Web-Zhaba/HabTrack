import { useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { Button } from '@/components/ui/button';
import { EmptyHabits } from '@features/habits/components/EmptyHabits';
import { HabitCreateModal } from '@features/habits/components/HabitCreateModal';
import { HabitCard } from '@features/habits/components/HabitCard';
import type { Habit } from '@features/habits/types/habit.types';
import { addHabit, removeHabit, updateHabit } from '@features/habits/store/habitsSlice';
import { upsertManyHabitLogs } from '@features/statistics/store/habitLogsSlice';
import { AnimatePresence } from 'motion/react';
import BasicModal from '@/components/ui/smoothui/basic-modal';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { CheckCheckIcon, TagIcon } from 'lucide-react';

export default function HabitsPage() {
  const dispatch = useAppDispatch();
  const habits = useAppSelector((state) => state.habits.items);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string>('all');

  const handleOpenCreate = () => {
    setEditingHabit(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreate = () => {
    setIsCreateModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleSubmit = (habit: Habit) => {
    if (editingHabit) {
      dispatch(updateHabit(habit));
    } else {
      dispatch(addHabit(habit));
    }
    handleCloseCreate();
  };

  const handleDeleteClick = useCallback((id: string) => {
    setHabitToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (habitToDelete) {
      dispatch(removeHabit(habitToDelete));
      setHabitToDelete(null);
    }
  }, [habitToDelete, dispatch]);

  const cancelDelete = useCallback(() => {
    setHabitToDelete(null);
  }, []);

  // --- Derived State for Tags ---
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    habits.forEach((habit) => {
      habit.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [habits]);

  const filteredHabits = useMemo(() => {
    if (tagFilter === 'all') return habits;
    return habits.filter((h) => h.tags?.includes(tagFilter));
  }, [habits, tagFilter]);

  const handleCompleteAll = () => {
    const today = new Date().toISOString().split('T')[0];
    const updates = filteredHabits.map((h) => ({
      habitId: h.id,
      date: today,
      completed: true,
      value: h.type === 'quantitative' ? h.target : undefined,
    }));

    if (updates.length > 0) {
      dispatch(upsertManyHabitLogs(updates));
    }
  };

  if (!habits.length) {
    return <EmptyHabits />;
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 md:py-8">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Привычки</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Управляйте своими привычками и отмечайте выполнение за сегодня.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button type="button" onClick={handleOpenCreate} className="w-full sm:w-auto">
              Добавить привычку
            </Button>
            <Button
              type="button"
              intent="outline"
              onClick={handleCompleteAll}
              className="w-full sm:w-auto"
            >
              <CheckCheckIcon className="mr-2 h-4 w-4" />
              Отметить всё
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-[240px]">
            <Select
              selectedKey={tagFilter}
              onSelectionChange={(key) => setTagFilter(String(key))}
              aria-label="Фильтр по тегам"
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 opacity-50" />
                  <span>{tagFilter === 'all' ? 'Все теги' : tagFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="all">Все теги</SelectItem>
                {uniqueTags.map((tag) => (
                  <SelectItem key={tag} id={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-muted-foreground text-sm">
            Показано: {filteredHabits.length} из {habits.length}
          </div>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20">
            <p className="text-muted-foreground">Нет привычек с выбранным тегом</p>
            <Button intent="link" onClick={() => setTagFilter('all')} className="mt-2">
              Сбросить фильтр
            </Button>
          </div>
        ) : (
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredHabits.map((habit: Habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onDelete={handleDeleteClick}
                  onEdit={handleEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <HabitCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreate}
        onSubmit={handleSubmit}
        initialData={editingHabit}
      />

      <BasicModal
        isOpen={!!habitToDelete}
        onClose={cancelDelete}
        title="Удаление привычки"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Вы уверены, что хотите удалить эту привычку? Это действие нельзя будет отменить, и вся
            история выполнения будет потеряна.
          </p>
          <div className="flex justify-end gap-2">
            <Button intent="outline" onClick={cancelDelete}>
              Отмена
            </Button>
            <Button intent="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </div>
      </BasicModal>
    </>
  );
}
