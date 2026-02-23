import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Link } from 'react-router';
import { FrownIcon } from 'lucide-react';
import { ArrowUpRightIcon } from 'lucide-react';
import { useAppDispatch } from '@app/store/hooks';
import { addHabit } from '../store/habitsSlice';
import type { Habit } from '../types/habit.types';
import { HabitCreateModal } from './HabitCreateModal';

export function EmptyHabits() {
  const dispatch = useAppDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmit = (habit: Habit) => {
    dispatch(addHabit(habit));
    handleCloseCreate();
  };

  return (
    <>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FrownIcon />
          </EmptyMedia>
          <EmptyTitle>Ещё нет привычек</EmptyTitle>
          <EmptyDescription>
            Вы еще не завели ни одной привычки, давайте сделаем это!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button type="button" onClick={handleOpenCreate}>
            Добавить привычку
          </Button>
          <Button type="button" intent="outline">
            Импортировать данные
          </Button>
        </EmptyContent>
        <Link to="/login">
          <Button intent="plain" className="text-muted-foreground" size="sm">
            Войти в аккаунт <ArrowUpRightIcon />
          </Button>
        </Link>
      </Empty>

      <HabitCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreate}
        onSubmit={handleSubmit}
      />
    </>
  );
}
