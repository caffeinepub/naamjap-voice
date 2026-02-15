import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useMantraCounting } from '../../hooks/useMantraCounting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceControlsProps {
  selectedMantra: string;
  onCountChange: (count: number) => void;
  count: number;
}

export default function VoiceControls({ selectedMantra, onCountChange, count: externalCount }: VoiceControlsProps) {
  const { isListening, transcript, error, isSupported, start, stop } = useSpeechRecognition();
  const { count, lastMatch, processTranscript, manualIncrement, reset } = useMantraCounting(selectedMantra);

  // Sync internal count with external
  if (count !== externalCount) {
    onCountChange(count);
  }

  const handleStart = () => {
    reset();
    start(processTranscript);
  };

  const handleStop = () => {
    stop();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Recognition
          </div>
          <div className="text-2xl font-bold text-primary">
            {count}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported && (
          <Alert>
            <AlertDescription>
              Voice recognition is not supported in your browser. Use the manual counter below.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {isSupported && (
            <>
              {!isListening ? (
                <Button onClick={handleStart} className="flex-1">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Listening
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive" className="flex-1">
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </Button>
              )}
            </>
          )}
          
          <Button onClick={manualIncrement} variant="outline" size="icon" title="Manual increment">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Voice beats: <span className="font-semibold text-foreground">{count}</span>
        </div>

        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Listening...</span>
            </div>
            {transcript && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {lastMatch && (
          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm font-medium">Last match: {lastMatch}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
