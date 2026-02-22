import { Outlet } from "react-router";
import { Badge } from "@/components/ui/badge"
import { BarChart3Icon, CheckCircleIcon, Stars } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-background px-4"
      style={{
        backgroundImage: `radial-gradient(circle 900px at 50% -200px, color-mix(in oklab, var(--primary) 16%, transparent), transparent),
          radial-gradient(circle 800px at 0% 80%, color-mix(in oklab, var(--primary) 10%, transparent), transparent),
          radial-gradient(circle 800px at 100% 100%, color-mix(in oklab, var(--primary) 8%, transparent), transparent)`,
      }}
    >
      <div className="w-full max-w-5xl grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="hidden flex-col gap-4 text-left text-foreground md:flex">
          <h1 className="flex items-center text-3xl font-semibold tracking-tight md:text-4xl hover:text-primary transition-all duration-300">
            <Logo className="inline-block mr-2 h-7"/>
            HabTrack
          </h1>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            Отслеживайте привычки, аналитику и прогресс в одном месте. Гибкие
            палитры, светлая и тёмная темы и аккуратная визуализация.
          </p>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            <Badge variant='secondary' className="hover:bg-primary-foreground hover:scale-110">
              <CheckCircleIcon className="mr-1" size={12} />
              Ежедневные чек-листы
            </Badge>
            <Badge variant='secondary' className="hover:bg-primary-foreground hover:scale-110">
              <BarChart3Icon className="mr-1" size={12} />
              Статистика и графики
            </Badge>
            <Badge variant='secondary' className="hover:bg-primary-foreground hover:scale-110">
              <Stars className="mr-1" size={12} />
              Тонкие настройки темы
            </Badge>
          </div>
        </div>
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
