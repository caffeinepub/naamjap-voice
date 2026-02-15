import { useState, useEffect } from 'react';
import { useActor } from './useActor';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendReachable, setBackendReachable] = useState(true);
  const { actor } = useActor();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setBackendReachable(false);
      return;
    }

    const checkBackend = async () => {
      if (!actor) {
        setBackendReachable(false);
        return;
      }

      try {
        await actor.getMantras();
        setBackendReachable(true);
      } catch (err) {
        setBackendReachable(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [isOnline, actor]);

  return {
    isOffline: !isOnline || !backendReachable,
    isOnline: isOnline && backendReachable,
  };
}
