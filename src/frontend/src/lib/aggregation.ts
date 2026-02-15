import type { DailyTotal } from '../hooks/useAppState';

export interface AggregatedData {
  label: string;
  count: number;
}

export function aggregateDaily(dailyTotals: DailyTotal[], days: number = 7): AggregatedData[] {
  const today = new Date();
  const result: AggregatedData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = dailyTotals
      .filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + t.count, 0);

    result.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count,
    });
  }

  return result;
}

export function aggregateWeekly(dailyTotals: DailyTotal[], weeks: number = 4): AggregatedData[] {
  const today = new Date();
  const result: AggregatedData[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const count = dailyTotals
      .filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      })
      .reduce((sum, t) => sum + t.count, 0);

    result.push({
      label: `W${weeks - i}`,
      count,
    });
  }

  return result;
}

export function aggregateMonthly(dailyTotals: DailyTotal[], months: number = 6): AggregatedData[] {
  const today = new Date();
  const result: AggregatedData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = month.toISOString().slice(0, 7); // YYYY-MM

    const count = dailyTotals
      .filter(t => t.date.startsWith(monthStr))
      .reduce((sum, t) => sum + t.count, 0);

    result.push({
      label: month.toLocaleDateString('en-US', { month: 'short' }),
      count,
    });
  }

  return result;
}

export function calculateStreak(dailyTotals: DailyTotal[]): { current: number; lastActive: string | null } {
  if (dailyTotals.length === 0) {
    return { current: 0, lastActive: null };
  }

  const sortedDates = Array.from(new Set(dailyTotals.map(t => t.date))).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let lastActive = sortedDates[0];

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (sortedDates[i] === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return { current: streak, lastActive };
}
