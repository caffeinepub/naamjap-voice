import { Home, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: 'chant' | 'dashboard' | 'settings') => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-3 h-16">
        <button
          onClick={() => onNavigate('chant')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPage === 'chant' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Chant</span>
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPage === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Dashboard</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPage === 'settings' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </nav>
  );
}
