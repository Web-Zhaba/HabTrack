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
  type LucideIcon
} from "lucide-react"

export const COLOR_OPTIONS = [
  { value: "--chart-1", label: "Основной", swatch: "#22c55e" },
  { value: "--chart-2", label: "Второй", swatch: "#3b82f6" },
  { value: "--chart-3", label: "Третий", swatch: "#f97316" },
  { value: "--chart-4", label: "Четвёртый", swatch: "#a855f7" },
  { value: "--chart-5", label: "Пятый", swatch: "#6366f1" },
] as const

export type ColorToken = (typeof COLOR_OPTIONS)[number]["value"]

export const HABIT_ICONS: Record<string, LucideIcon> = {
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
}

// Keep for backward compatibility or simple key referencing
export const iconOptions = Object.keys(HABIT_ICONS).reduce((acc, key) => {
  acc[key] = key
  return acc
}, {} as Record<string, string>)
