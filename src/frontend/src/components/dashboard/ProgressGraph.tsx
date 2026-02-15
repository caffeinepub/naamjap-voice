import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3 } from 'lucide-react';
import { aggregateDaily, aggregateWeekly, aggregateMonthly, type AggregatedData } from '../../lib/aggregation';
import type { DailyTotal } from '../../hooks/useAppState';

interface ProgressGraphProps {
  dailyTotals: DailyTotal[];
}

type Period = 'daily' | 'weekly' | 'monthly';

export default function ProgressGraph({ dailyTotals }: ProgressGraphProps) {
  const [period, setPeriod] = useState<Period>('daily');

  const data: AggregatedData[] = 
    period === 'daily' ? aggregateDaily(dailyTotals, 7) :
    period === 'weekly' ? aggregateWeekly(dailyTotals, 4) :
    aggregateMonthly(dailyTotals, 6);

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progress
          </span>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs px-2">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-2">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-2">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end justify-between gap-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-muted rounded-t relative" style={{ height: '100%' }}>
                <div 
                  className="absolute bottom-0 w-full bg-primary rounded-t transition-all"
                  style={{ height: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">{item.label}</div>
              <div className="text-xs font-medium">{item.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
