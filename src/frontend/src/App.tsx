import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from './hooks/useTheme';
import { useReminders } from './hooks/useReminders';
import ChantPage from './pages/ChantPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AppHeader from './components/layout/AppHeader';
import BottomNav from './components/layout/BottomNav';
import AuthGate from './components/auth/AuthGate';
import ReminderBanner from './components/system/ReminderBanner';
import { useCloudSync } from './hooks/useCloudSync';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

type Page = 'chant' | 'dashboard' | 'settings';

export default function App() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('chant');
  const { syncOnLogin } = useCloudSync();
  const { activeReminder, dismissReminder } = useReminders();

  // Apply theme class to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Sync on login
  useEffect(() => {
    if (identity) {
      syncOnLogin();
    }
  }, [identity, syncOnLogin]);

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/naamjap-pattern-bg.dim_2048x2048.png)',
          backgroundSize: '512px 512px',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1 pb-20 md:pb-8">
          <AuthGate>
            {currentPage === 'chant' && <ChantPage />}
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'settings' && <SettingsPage />}
          </AuthGate>
        </main>

        {isAuthenticated && (
          <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
        )}

        {activeReminder && (
          <ReminderBanner
            message={activeReminder.message}
            onDismiss={dismissReminder}
          />
        )}
      </div>

      <Toaster />
    </div>
  );
}
