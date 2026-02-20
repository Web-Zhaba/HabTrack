import { Outlet } from 'react-router';
// import { useAuth } from '../features/auth/hooks/useAuth';

export default function ProtectedRoute () {
  // const { isAuthenticated } = useAuth(); // получаем из стора / контекста

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};
