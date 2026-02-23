'use client';

import * as React from 'react';
import { useLocation, Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, BarChart3, Users, Settings, Moon, Sun, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { LogoIcon } from '@/components/logo';
import AnimatedToggle from '@/components/ui/animated-toggle';

interface NavItem {
  icon: React.ElementType;
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, href: '/', label: 'Главная' },
  { icon: CheckCircle, href: '/habits', label: 'Привычки' },
  { icon: BarChart3, href: '/stats', label: 'Статистика' },
  { icon: Users, href: '/friends', label: 'Друзья' },
  { icon: Settings, href: '/settings', label: 'Настройки' },
];

export function NavbarFlow() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  // const navigate = useNavigate();
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  // Sync toggle state with current theme
  React.useEffect(() => {
    if (theme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isSystemDark);
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDark(checked);
  };

  const handleNavigation = (href: string, _label: string, e: React.MouseEvent) => {
    if (!href.startsWith('/')) {
      e.preventDefault();
      return;
    }

    // You could add more complex validation here if needed
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl px-4 flex items-center justify-between">
        {/* Left: Logo (Home Link) */}
        <Link
          to="/"
          className="flex items-center justify-center w-12 h-12 bg-background/40 backdrop-blur-xl border border-border/40 rounded-2xl text-foreground hover:scale-105 transition-transform shadow-sm shrink-0"
          aria-label="На главную"
          onClick={(e) => handleNavigation('/', 'Logo', e)}
        >
          <LogoIcon className="w-6 h-6" />
        </Link>

        {/* Center: Navigation Pill Strip */}
        <nav className="flex items-center p-1 bg-background/40 backdrop-blur-xl border border-border/40 rounded-full shadow-sm text-foreground gap-1 md:gap-2 justify-between overflow-x-auto no-scrollbar max-w-[calc(100vw-7rem)] md:max-w-none">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href || (item.href === '/' && location.pathname === '/');

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={(e) => handleNavigation(item.href, item.label, e)}
                className={cn(
                  'relative group flex items-center justify-center gap-2 px-2 md:px-4 h-10 rounded-full transition-colors duration-300 min-w-[40px] md:min-w-0',
                  isActive
                    ? 'text-primary-foreground font-medium hover:-translate-y-0.5 transition-all duration-500'
                    : 'text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground',
                )}
                aria-label={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary rounded-full shadow-md group-hover:shadow-[0_3px_0_0_color-mix(in_oklab,var(--primary),black_20%)] transition-shadow duration-500"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      mass: 0.8,
                    }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-5 h-5 md:w-4 md:h-4" />
                  <span className="hidden md:inline text-sm pb-0.5">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle */}
        <div className="flex items-center justify-center bg-background/40 backdrop-blur-xl border border-border/40 rounded-full p-1 shadow-sm h-12 px-2 shrink-0">
          <AnimatedToggle
            checked={isDark}
            onChange={handleThemeChange}
            variant="icon"
            size="lg"
            icons={{
              on: <Moon className="w-4 h-4 text-black dark:text-white fill-black" />, // Moon for Dark mode (as per image)
              off: <Sun className="w-4 h-4 text-yellow-500 fill-yellow-500" />,
            }}
            className="shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}

export default NavbarFlow;
