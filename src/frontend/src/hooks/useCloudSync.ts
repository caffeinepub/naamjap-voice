import { useCallback } from 'react';
import { useAppState } from './useAppState';
import { useGetSessionSummaries, useSyncDailyChantTotals, useAddChantSession } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import type { ChantSession, DailyChantTotal } from '../backend';

export function useCloudSync() {
  const { identity } = useInternetIdentity();
  const { state, mergeSessions } = useAppState();
  const { data: cloudSessions } = useGetSessionSummaries();
  const syncDailyTotalsMutation = useSyncDailyChantTotals();
  const addSessionMutation = useAddChantSession();

  const syncOnLogin = useCallback(async () => {
    if (!identity || !cloudSessions) return;

    // Merge cloud sessions into local state
    mergeSessions(cloudSessions);
  }, [identity, cloudSessions, mergeSessions]);

  const syncSession = useCallback(async (session: ChantSession) => {
    if (!identity) return;

    try {
      await addSessionMutation.mutateAsync(session);
    } catch (err) {
      console.error('Failed to sync session:', err);
    }
  }, [identity, addSessionMutation]);

  const syncDailyTotals = useCallback(async () => {
    if (!identity || state.dailyTotals.length === 0) return;

    try {
      const totals: DailyChantTotal[] = state.dailyTotals.map(t => ({
        date: BigInt(new Date(t.date).getTime() * 1000000),
        mantra: t.mantra,
        count: BigInt(t.count),
      }));

      await syncDailyTotalsMutation.mutateAsync(totals);
    } catch (err) {
      console.error('Failed to sync daily totals:', err);
    }
  }, [identity, state.dailyTotals, syncDailyTotalsMutation]);

  return {
    syncOnLogin,
    syncSession,
    syncDailyTotals,
  };
}
