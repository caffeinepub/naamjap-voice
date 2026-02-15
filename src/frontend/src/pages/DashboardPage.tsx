import { useAppState } from '../hooks/useAppState';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { calculateStreak } from '../lib/aggregation';
import StreakCard from '../components/dashboard/StreakCard';
import HistoryList from '../components/dashboard/HistoryList';
import ProgressGraph from '../components/dashboard/ProgressGraph';
import OfflineBanner from '../components/system/OfflineBanner';

export default function DashboardPage() {
  const { state } = useAppState();
  const { isOffline } = useOfflineStatus();
  const { current: currentStreak, lastActive } = calculateStreak(state.dailyTotals);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
      {isOffline && <OfflineBanner />}

      <div className="grid md:grid-cols-3 gap-6">
        <StreakCard currentStreak={currentStreak} lastActive={lastActive} />
        
        <div className="md:col-span-2">
          <ProgressGraph dailyTotals={state.dailyTotals} />
        </div>
      </div>

      <HistoryList dailyTotals={state.dailyTotals} />
    </div>
  );
}
