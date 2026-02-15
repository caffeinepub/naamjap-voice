import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReminderBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function ReminderBanner({ message, onDismiss }: ReminderBannerProps) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-3">
        <Bell className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="flex-shrink-0 hover:bg-primary-foreground/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
