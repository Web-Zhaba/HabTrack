/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router';
import { useEffect, lazy, Suspense } from 'react';
import { MainLayout } from './layouts/MainLayout';
import HomePage from '@pages/Home.tsx';
import { Loader2Icon } from 'lucide-react';

// Лэйауты
import AuthLayout from '@app/layouts/AuthLayout.tsx';
import ProtectedRoute from '@app/components/ProtectedRoute.tsx';

// Страницы (Lazy loading)
const FriendsPage = lazy(() => import('@pages/Friends.tsx'));
const NotFoundPage = lazy(() => import('@pages/NotFound.tsx'));
const SettingsPage = lazy(() => import('@pages/Settings.tsx'));
const HabitDetailPage = lazy(() => import('@pages/HabitDetail.tsx'));
const StatsPage = lazy(() => import('@pages/Stats.tsx'));
const HabitsPage = lazy(() => import('@pages/Habits.tsx'));
const LogInPage = lazy(() => import('@features/auth/pages/LogIn.tsx'));
const RegisterPage = lazy(() => import('@features/auth/pages/Register.tsx'));
const ResetPasswordPage = lazy(() => import('@features/auth/pages/ResetPassword.tsx'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Компонент для установки title страницы
function PageWithTitle({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = `${title} — HabTrack`;
    return () => {
      document.title = 'HabTrack — Трекер привычек для формирования полезных рутины';
    };
  }, [title]);

  return <>{children}</>;
}

const withTitle = (Component: React.ComponentType, title: string) => (
  <PageWithTitle title={title}>{withSuspense(Component)}</PageWithTitle>
);

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withTitle(LogInPage, 'Вход') },
      { path: '/register', element: withTitle(RegisterPage, 'Регистрация') },
      { path: '/reset-password', element: withTitle(ResetPasswordPage, 'Сброс пароля') },
    ],
  },
  {
    element: <ProtectedRoute />, // проверяет авторизацию
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: (
              <PageWithTitle title="Главная">
                <HomePage />
              </PageWithTitle>
            ),
          },
          { path: '/habits', element: withTitle(HabitsPage, 'Привычки') },
          { path: '/stats', element: withTitle(StatsPage, 'Статистика') },
          { path: '/settings', element: withTitle(SettingsPage, 'Настройки') },
          { path: '/habit/:id', element: withTitle(HabitDetailPage, 'Детали привычки') },
          { path: '/friends', element: withTitle(FriendsPage, 'Друзья') },
          { path: '/*', element: withTitle(NotFoundPage, 'Страница не найдена') },
        ],
      },
    ],
  },
]);
