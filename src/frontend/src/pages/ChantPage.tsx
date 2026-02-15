import { useState, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { useCloudSync } from '../hooks/useCloudSync';
import VoiceControls from '../components/chant/VoiceControls';
import MalaCounter from '../components/chant/MalaCounter';
import TargetProgress from '../components/chant/TargetProgress';
import AudioControls from '../components/chant/AudioControls';
import OfflineBanner from '../components/system/OfflineBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ChantPage() {
  const { state, addSession } = useAppState();
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const { isOffline } = useOfflineStatus();
  const { syncSession } = useCloudSync();

  const audioPlayer = useAudioPlayer(state.audioTrack, state.audioVolume);

  useEffect(() => {
    if (sessionCount > 0 && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
  }, [sessionCount, sessionStartTime]);

  const handleSaveSession = async () => {
    if (sessionCount === 0) {
      toast.error('No chants to save');
      return;
    }

    const session = {
      timestamp: BigInt((sessionStartTime || Date.now()) * 1000000),
      mantra: state.selectedMantra,
      count: BigInt(sessionCount),
      durationMillis: sessionStartTime ? BigInt(Date.now() - sessionStartTime) : undefined,
    };

    addSession(session);
    
    if (!isOffline) {
      await syncSession(session);
    }

    toast.success(`Session saved: ${sessionCount} chants of ${state.selectedMantra}`);
    setSessionCount(0);
    setSessionStartTime(null);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {isOffline && <OfflineBanner />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Mantra</span>
            <img 
              src="/assets/generated/naamjap-diya-icon.dim_256x256.png" 
              alt="" 
              className="w-6 h-6 opacity-60"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2">{state.selectedMantra}</div>
            <div className="text-sm text-muted-foreground">
              Change mantra in Settings
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <MalaCounter count={sessionCount} />
        <TargetProgress count={sessionCount} target={state.target} />
      </div>

      <VoiceControls
        selectedMantra={state.selectedMantra}
        onCountChange={setSessionCount}
        count={sessionCount}
      />

      <AudioControls
        isPlaying={audioPlayer.isPlaying}
        currentTrack={audioPlayer.currentTrack}
        volume={audioPlayer.volume}
        onToggle={audioPlayer.toggle}
        onTrackChange={audioPlayer.changeTrack}
        onVolumeChange={audioPlayer.setVolume}
      />

      {sessionCount > 0 && (
        <Button onClick={handleSaveSession} className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Session ({sessionCount} chants)
        </Button>
      )}
    </div>
  );
}
