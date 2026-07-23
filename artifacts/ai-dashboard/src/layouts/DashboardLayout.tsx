import { ReactNode, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';
import { Spinner } from '@/components/ui/spinner';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location !== '/login') {
      setLocation('/login');
    }
  }, [isLoading, isAuthenticated, location, setLocation]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
        <Spinner size="lg" className="mb-4 text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm">Loading workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
