import { createBrowserRouter } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import HomePage from '@pages/Home.tsx';
import { lazy, Suspense } from 'react';
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

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(LogInPage) },
      { path: '/register', element: withSuspense(RegisterPage) },
      { path: '/reset-password', element: withSuspense(ResetPasswordPage) },
    ],
  },
  {
    element: <ProtectedRoute />, // проверяет авторизацию
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/habits', element: withSuspense(HabitsPage) },
          { path: '/stats', element: withSuspense(StatsPage) },
          { path: '/settings', element: withSuspense(SettingsPage) },
          { path: '/habit/:id', element: withSuspense(HabitDetailPage) },
          { path: '/friends', element: withSuspense(FriendsPage) },
          { path: '/*', element: withSuspense(NotFoundPage) },
        ],
      },
    ],
  },
]);
