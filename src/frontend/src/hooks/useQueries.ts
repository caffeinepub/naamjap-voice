import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ChantSession, DailyChantTotal, Streak, Mantra } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error: any) {
        if (error.message?.includes('not found')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetMantras() {
  const { actor, isFetching } = useActor();

  return useQuery<Mantra[]>({
    queryKey: ['mantras'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMantras();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddChantSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: ChantSession) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addChantSession(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionSummaries'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });
}

export function useGetSessionSummaries() {
  const { actor, isFetching } = useActor();

  return useQuery<ChantSession[]>({
    queryKey: ['sessionSummaries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSessionSummaries();
      } catch (error: any) {
        if (error.message?.includes('not found')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStreaks() {
  const { actor, isFetching } = useActor();

  return useQuery<Streak[]>({
    queryKey: ['streaks'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getStreaks();
      } catch (error: any) {
        if (error.message?.includes('not found')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSyncDailyChantTotals() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (totals: DailyChantTotal[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.syncDailyChantTotals(totals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionSummaries'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });
}
