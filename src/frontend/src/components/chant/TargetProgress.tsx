import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

interface TargetProgressProps {
  count: number;
  target: number;
}

export default function TargetProgress({ count, target }: TargetProgressProps) {
  const progress = Math.min((count / target) * 100, 100);
  const remaining = Math.max(target - count, 0);
  const isComplete = count >= target;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Daily Target
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold mb-1">{count}</div>
          <div className="text-sm text-muted-foreground">of {target} chants</div>
        </div>

        <Progress value={progress} className="h-3" />

        {isComplete ? (
          <div className="p-4 bg-primary/20 rounded-lg text-center">
            <p className="font-semibold text-primary">✨ Target Achieved! ✨</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep going to increase your count
            </p>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            {remaining} chants remaining
          </div>
        )}
      </CardContent>
    </Card>
  );
}
