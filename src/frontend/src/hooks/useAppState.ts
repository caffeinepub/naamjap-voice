import { useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage } from '../lib/storage';
import type { ChantSession } from '../backend';

export interface DailyTotal {
  date: string; // YYYY-MM-DD
  mantra: string;
  count: number;
}

export interface AppState {
  selectedMantra: string;
  dailyTotals: DailyTotal[];
  sessions: ChantSession[];
  target: number;
  audioTrack: string;
  audioVolume: number;
  audioAutoplay: boolean;
}

const DEFAULT_STATE: AppState = {
  selectedMantra: 'Radhe Radhe',
  dailyTotals: [],
  sessions: [],
  target: 108,
  audioTrack: 'soft-flute',
  audioVolume: 0.5,
  audioAutoplay: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    return loadFromStorage('naamjap-state', DEFAULT_STATE);
  });

  useEffect(() => {
    saveToStorage('naamjap-state', state);
  }, [state]);

  const updateSelectedMantra = useCallback((mantra: string) => {
    setState(prev => ({ ...prev, selectedMantra: mantra }));
  }, []);

  const updateTarget = useCallback((target: number) => {
    setState(prev => ({ ...prev, target }));
  }, []);

  const updateAudioSettings = useCallback((settings: Partial<Pick<AppState, 'audioTrack' | 'audioVolume' | 'audioAutoplay'>>) => {
    setState(prev => ({ ...prev, ...settings }));
  }, []);

  const addSession = useCallback((session: ChantSession) => {
    setState(prev => {
      const newSessions = [...prev.sessions, session];
      
      // Update daily totals
      const today = new Date().toISOString().split('T')[0];
      const existingTotalIndex = prev.dailyTotals.findIndex(
        t => t.date === today && t.mantra === session.mantra
      );

      let newDailyTotals = [...prev.dailyTotals];
      if (existingTotalIndex >= 0) {
        newDailyTotals[existingTotalIndex] = {
          ...newDailyTotals[existingTotalIndex],
          count: newDailyTotals[existingTotalIndex].count + Number(session.count),
        };
      } else {
        newDailyTotals.push({
          date: today,
          mantra: session.mantra,
          count: Number(session.count),
        });
      }

      return {
        ...prev,
        sessions: newSessions,
        dailyTotals: newDailyTotals,
      };
    });
  }, []);

  const mergeSessions = useCallback((cloudSessions: ChantSession[]) => {
    setState(prev => {
      // Merge sessions by deduplicating based on timestamp + mantra + count
      const sessionKey = (s: ChantSession) => `${s.timestamp}-${s.mantra}-${s.count}`;
      const existingKeys = new Set(prev.sessions.map(sessionKey));
      const newSessions = cloudSessions.filter(s => !existingKeys.has(sessionKey(s)));
      
      const allSessions = [...prev.sessions, ...newSessions].sort((a, b) => 
        Number(a.timestamp) - Number(b.timestamp)
      );

      // Recalculate daily totals from all sessions
      const dailyTotalsMap = new Map<string, DailyTotal>();
      allSessions.forEach(session => {
        const date = new Date(Number(session.timestamp) / 1000000).toISOString().split('T')[0];
        const key = `${date}-${session.mantra}`;
        const existing = dailyTotalsMap.get(key);
        if (existing) {
          existing.count += Number(session.count);
        } else {
          dailyTotalsMap.set(key, {
            date,
            mantra: session.mantra,
            count: Number(session.count),
          });
        }
      });

      return {
        ...prev,
        sessions: allSessions,
        dailyTotals: Array.from(dailyTotalsMap.values()),
      };
    });
  }, []);

  const getTodayTotal = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.dailyTotals
      .filter(t => t.date === today)
      .reduce((sum, t) => sum + t.count, 0);
  }, [state.dailyTotals]);

  return {
    state,
    updateSelectedMantra,
    updateTarget,
    updateAudioSettings,
    addSession,
    mergeSessions,
    getTodayTotal,
  };
}
