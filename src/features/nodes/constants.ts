import {
  Activity,
  Book,
  Apple,
  Droplets,
  Moon,
  Brain,
  Star,
  Briefcase,
  Code,
  Music,
  Palette,
  DollarSign,
  Users,
  Sun,
  Coffee,
  Dumbbell,
  Laptop,
  Heart,
  Zap,
  Leaf,
  GraduationCap,
  Gamepad2,
  Plane,
  Camera,
  PenTool,
  Utensils,
  BedDouble,
  Smile,
} from 'lucide-react';

/**
 * NODES Constants
 * Константы для системы NODES (ранее Habits)
 */

export const COLOR_OPTIONS = [
  { value: '--chart-1', label: 'Основной', swatch: '#22c55e' },
  { value: '--chart-2', label: 'Второй', swatch: '#3b82f6' },
  { value: '--chart-3', label: 'Третий', swatch: '#f97316' },
  { value: '--chart-4', label: 'Четвёртый', swatch: '#a855f7' },
  { value: '--chart-5', label: 'Пятый', swatch: '#6366f1' },
] as const;

export type ColorToken = (typeof COLOR_OPTIONS)[number]['value'];

export const NODE_ICONS = {
  activity: Activity,
  run: Dumbbell,
  book: Book,
  education: GraduationCap,
  food: Utensils,
  apple: Apple,
  water: Droplets,
  sleep: BedDouble,
  moon: Moon,
  meditate: Brain,
  mindfulness: Leaf,
  custom: Star,
  work: Briefcase,
  code: Code,
  tech: Laptop,
  music: Music,
  art: Palette,
  finance: DollarSign,
  social: Users,
  morning: Sun,
  break: Coffee,
  health: Heart,
  energy: Zap,
  game: Gamepad2,
  travel: Plane,
  photo: Camera,
  writing: PenTool,
  fun: Smile,
} as const;

export type NodeIconName = keyof typeof NODE_ICONS;

// Алиасы для обратной совместимости
export const HABIT_ICONS = NODE_ICONS;
export type HabitIconName = NodeIconName;
