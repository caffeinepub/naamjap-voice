import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  currentTrack: string;
  volume: number;
  onToggle: () => void;
  onTrackChange: (track: string) => void;
  onVolumeChange: (volume: number) => void;
}

const TRACKS = [
  { value: 'soft-flute', label: 'Soft Flute' },
  { value: 'temple-bells', label: 'Temple Bells' },
  { value: 'meditation-sound', label: 'Meditation Sound' },
];

export default function AudioControls({
  isPlaying,
  currentTrack,
  volume,
  onToggle,
  onTrackChange,
  onVolumeChange,
}: AudioControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Background Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={currentTrack} onValueChange={onTrackChange}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRACKS.map(track => (
                <SelectItem key={track.value} value={track.value}>
                  {track.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={onToggle} size="icon" variant={isPlaying ? 'default' : 'outline'}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-medium">{Math.round(volume * 100)}%</span>
          </div>
          <Slider
            value={[volume * 100]}
            onValueChange={([v]) => onVolumeChange(v / 100)}
            max={100}
            step={1}
          />
        </div>
      </CardContent>
    </Card>
  );
}
