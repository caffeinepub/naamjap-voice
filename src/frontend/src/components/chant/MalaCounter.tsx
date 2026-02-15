import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { vibrateMalaComplete } from '../../lib/vibration';

interface MalaCounterProps {
  count: number;
}

export default function MalaCounter({ count }: MalaCounterProps) {
  const [showCompletion, setShowCompletion] = useState(false);
  const currentCycle = count % 108;
  const completedMalas = Math.floor(count / 108);
  const progress = (currentCycle / 108) * 100;

  useEffect(() => {
    if (count > 0 && count % 108 === 0) {
      vibrateMalaComplete();
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 3000);
    }
  }, [count]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mala Progress</span>
          <img 
            src="/assets/generated/naamjap-bell-icon.dim_256x256.png" 
            alt="" 
            className="w-6 h-6 opacity-60"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{currentCycle}</div>
          <div className="text-sm text-muted-foreground">of 108 beads</div>
        </div>

        <Progress value={progress} className="h-3" />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Completed Malas:</span>
          <span className="font-semibold">{completedMalas}</span>
        </div>

        {showCompletion && (
          <div className="p-4 bg-primary/20 rounded-lg text-center animate-pulse">
            <p className="font-semibold text-primary">🎉 Mala Completed! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">
              {completedMalas} {completedMalas === 1 ? 'mala' : 'malas'} total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
