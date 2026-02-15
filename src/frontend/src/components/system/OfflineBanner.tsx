import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OfflineBanner() {
  return (
    <Alert className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Your progress is saved locally and will sync when you're back online.
      </AlertDescription>
    </Alert>
  );
}
