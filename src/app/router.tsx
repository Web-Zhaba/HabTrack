import { createBrowserRouter } from 'react-router';
import { MainLayout } from './layouts/MainLayout';

// Лэйауты
import AuthLayout from './layouts/AuthLayout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'

// Страницы
import HomePage from '../pages/Home.tsx';
import NotFoundPage from '../pages/NotFound.tsx';
import SettingsPage from '../pages/Settings.tsx';
import HabitDetailPage from '../pages/HabitDetail.tsx';
import StatsPage from '../pages/Stats.tsx';
import HabitsPage from '../pages/Habits.tsx';
import LogInPage from 'src/features/auth/pages/LogIn.tsx';
import RegisterPage from 'src/features/auth/pages/Register.tsx';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
      children: [
        { path: '/login', element: <LogInPage /> },
        { path: '/register', element: <RegisterPage /> },
      ],
    },
  {
    element: <ProtectedRoute />, // проверяет авторизацию
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/habits', element: <HabitsPage /> },
          { path: '/stats', element: <StatsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/habit/:id', element: <HabitDetailPage /> },
          { path: '/login', element: <LogInPage />},
          { path: '/*', element: <NotFoundPage />}
        ],
      },
    ],
  },
]);