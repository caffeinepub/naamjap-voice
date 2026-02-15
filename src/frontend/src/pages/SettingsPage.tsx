import { useAppState } from '../hooks/useAppState';
import { useTheme } from '../hooks/useTheme';
import { useReminders } from '../hooks/useReminders';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { MANTRAS } from '../lib/mantras';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OfflineBanner from '../components/system/OfflineBanner';
import { Moon, Sun, Bell, Target, Music } from 'lucide-react';

export default function SettingsPage() {
  const { state, updateSelectedMantra, updateTarget, updateAudioSettings } = useAppState();
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings, notificationPermission, requestNotificationPermission } = useReminders();
  const { isOffline } = useOfflineStatus();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {isOffline && <OfflineBanner />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mantra Selection
          </CardTitle>
          <CardDescription>Choose your preferred mantra for chanting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selected Mantra</Label>
            <Select value={state.selectedMantra} onValueChange={updateSelectedMantra}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MANTRAS.map(mantra => (
                  <SelectItem key={mantra.name} value={mantra.name}>
                    <div>
                      <div className="font-medium">{mantra.name}</div>
                      <div className="text-xs text-muted-foreground">{mantra.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Daily Target</Label>
            <div className="flex gap-2">
              <Input
                id="target"
                type="number"
                value={state.target}
                onChange={(e) => updateTarget(Number(e.target.value))}
                min={1}
                step={108}
              />
              <Button
                variant="outline"
                onClick={() => updateTarget(108)}
              >
                108
              </Button>
              <Button
                variant="outline"
                onClick={() => updateTarget(1008)}
              >
                1008
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Audio Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Track</Label>
            <Select 
              value={state.audioTrack} 
              onValueChange={(track) => updateAudioSettings({ audioTrack: track })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soft-flute">Soft Flute</SelectItem>
                <SelectItem value="temple-bells">Temple Bells</SelectItem>
                <SelectItem value="meditation-sound">Meditation Sound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoplay">Autoplay on session start</Label>
            <Switch
              id="autoplay"
              checked={state.audioAutoplay}
              onCheckedChange={(checked) => updateAudioSettings({ audioAutoplay: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Reminders
          </CardTitle>
          <CardDescription>Set daily reminders for your practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationPermission === 'default' && (
            <Button onClick={requestNotificationPermission} variant="outline" className="w-full">
              Enable Browser Notifications
            </Button>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="morning">Morning Reminder</Label>
                <p className="text-sm text-muted-foreground">Get reminded in the morning</p>
              </div>
              <Switch
                id="morning"
                checked={settings.morningEnabled}
                onCheckedChange={(checked) => updateSettings({ morningEnabled: checked })}
              />
            </div>

            {settings.morningEnabled && (
              <div className="ml-4">
                <Label htmlFor="morningTime">Time</Label>
                <Input
                  id="morningTime"
                  type="time"
                  value={settings.morningTime}
                  onChange={(e) => updateSettings({ morningTime: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="evening">Evening Reminder</Label>
                <p className="text-sm text-muted-foreground">Get reminded in the evening</p>
              </div>
              <Switch
                id="evening"
                checked={settings.eveningEnabled}
                onCheckedChange={(checked) => updateSettings({ eveningEnabled: checked })}
              />
            </div>

            {settings.eveningEnabled && (
              <div className="ml-4">
                <Label htmlFor="eveningTime">Time</Label>
                <Input
                  id="eveningTime"
                  type="time"
                  value={settings.eveningTime}
                  onChange={(e) => updateSettings({ eveningTime: e.target.value })}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-muted-foreground py-8">
        <p>© {new Date().getFullYear()} Built with ❤️ using{' '}
          <a 
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
