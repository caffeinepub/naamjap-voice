import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mantra {
    name: string;
    description: string;
    repetitions: bigint;
}
export interface Streak {
    lengthDays: bigint;
    endDate?: bigint;
    isActive: boolean;
    startDate: bigint;
}
export interface DailyChantTotal {
    date: bigint;
    count: bigint;
    mantra: string;
}
export interface ChantSession {
    count: bigint;
    timestamp: bigint;
    mantra: string;
    durationMillis?: bigint;
}
export interface UserProfile {
    displayName: string;
    selectedMantras: Array<string>;
    preferredSessionTimes: string;
}
export interface SyncState {
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChantSession(session: ChantSession): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getMantras(): Promise<Array<Mantra>>;
    getSessionSummaries(): Promise<Array<ChantSession>>;
    getStreaks(): Promise<Array<Streak>>;
    getSyncState(): Promise<SyncState | null>;
    getUserProfile(principal: Principal): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    syncDailyChantTotals(newTotals: Array<DailyChantTotal>): Promise<void>;
    updateSyncState(state: SyncState): Promise<void>;
}
