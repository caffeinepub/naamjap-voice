import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from 'lucide-react';
import type { DailyTotal } from '../../hooks/useAppState';

interface HistoryListProps {
  dailyTotals: DailyTotal[];
}

export default function HistoryList({ dailyTotals }: HistoryListProps) {
  const sortedTotals = [...dailyTotals].sort((a, b) => b.date.localeCompare(a.date));
  const groupedByDate = sortedTotals.reduce((acc, total) => {
    if (!acc[total.date]) {
      acc[total.date] = [];
    }
    acc[total.date].push(total);
    return acc;
  }, {} as Record<string, DailyTotal[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {Object.entries(groupedByDate).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No chanting history yet. Start your first session!
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedByDate).map(([date, totals]) => {
                const totalCount = totals.reduce((sum, t) => sum + t.count, 0);
                return (
                  <div key={date} className="border-l-2 border-primary pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm font-semibold">{totalCount} chants</div>
                    </div>
                    <div className="space-y-1">
                      {totals.map((total, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          {total.mantra}: {total.count}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
