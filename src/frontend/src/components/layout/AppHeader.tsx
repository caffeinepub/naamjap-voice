import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  currentPage: string;
  onNavigate: (page: 'chant' | 'dashboard' | 'settings') => void;
}

export default function AppHeader({ currentPage, onNavigate }: AppHeaderProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/naamjap-lotus-mark.dim_512x512.png" 
            alt="NaamJap Voice" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-semibold">NaamJap Voice</h1>
        </div>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('chant')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'chant' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Chant
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'settings' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Settings
            </button>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {userProfile.displayName}
            </span>
          )}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
