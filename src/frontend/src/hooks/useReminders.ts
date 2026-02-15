import { useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage } from '../lib/storage';

interface ReminderSettings {
  morningEnabled: boolean;
  morningTime: string; // HH:MM
  eveningEnabled: boolean;
  eveningTime: string; // HH:MM
}

interface ActiveReminder {
  type: 'morning' | 'evening';
  message: string;
}

const DEFAULT_SETTINGS: ReminderSettings = {
  morningEnabled: false,
  morningTime: '06:00',
  eveningEnabled: false,
  eveningTime: '18:00',
};

export function useReminders() {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    return loadFromStorage('naamjap-reminders', DEFAULT_SETTINGS);
  });
  const [activeReminder, setActiveReminder] = useState<ActiveReminder | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    saveToStorage('naamjap-reminders', settings);
  }, [settings]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/assets/generated/naamjap-lotus-mark.dim_512x512.png' });
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (settings.morningEnabled && currentTime === settings.morningTime) {
        const message = 'Time for your morning naam jap 🙏';
        setActiveReminder({ type: 'morning', message });
        showNotification('Morning Reminder', message);
      }

      if (settings.eveningEnabled && currentTime === settings.eveningTime) {
        const message = 'Time for your evening naam jap 🙏';
        setActiveReminder({ type: 'evening', message });
        showNotification('Evening Reminder', message);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [settings, showNotification]);

  const dismissReminder = useCallback(() => {
    setActiveReminder(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ReminderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    updateSettings,
    activeReminder,
    dismissReminder,
    notificationPermission,
    requestNotificationPermission,
  };
}
