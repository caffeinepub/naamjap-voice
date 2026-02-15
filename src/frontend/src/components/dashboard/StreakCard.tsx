import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  lastActive: string | null;
}

export default function StreakCard({ currentStreak, lastActive }: StreakCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Current Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{currentStreak}</div>
          <div className="text-sm text-muted-foreground">
            {currentStreak === 1 ? 'day' : 'days'}
          </div>
          {lastActive && (
            <div className="mt-4 text-xs text-muted-foreground">
              Last active: {new Date(lastActive).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
