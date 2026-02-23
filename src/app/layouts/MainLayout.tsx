import { Outlet } from 'react-router';
import { NavbarFlow } from '@/components/ui/navbar-flow';
import { Footer } from '@app/components/Footer';

export const MainLayout = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col bg-background transition-colors duration-700 ease-in-out"
      style={{
        backgroundImage: `radial-gradient(circle 900px at 50% -200px, color-mix(in oklab, var(--primary) 16%, transparent), transparent),
          radial-gradient(circle 800px at 0% 80%, color-mix(in oklab, var(--primary) 10%, transparent), transparent),
          radial-gradient(circle 800px at 100% 100%, color-mix(in oklab, var(--primary) 8%, transparent), transparent)`,
      }}
    >
      <NavbarFlow />
      <main className="flex-1 pt-10">
        <div className="w-full max-w-5xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
