import { Outlet } from 'react-router';

export default function AuthLayout () {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Outlet /> {/* здесь будет LoginPage или RegisterPage */}
      </div>
    </div>
  );
};