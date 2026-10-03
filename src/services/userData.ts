import type { UserData } from "../types/user";
import { readStorage, writeStorage } from "../utils/storage";

export const defaultUserData: UserData = {
  studyProfile: null,
  savedSpotIds: [],
  notifications: { studyReminders: true },
  sessions: [],
  activeSession: null,
  reminderDismissedOn: null,
  spentXp: 0,
  ownedCosmetics: [],
  equippedCosmetics: [],
  helpfulReviewIds: [],
};

const key = (userId: string) => `user-data:${userId}`;

/**
 * Loads a user's study profile, saved spots, notification settings and sessions.
 * This is the only place user data touches storage, so it can be swapped for Supabase queries later.
 */
export function loadUserData(userId: string): UserData {
  const stored = readStorage<Partial<UserData>>(key(userId), {});
  return {
    ...defaultUserData,
    ...stored,
    notifications: { ...defaultUserData.notifications, ...stored.notifications },
  };
}

export function saveUserData(userId: string, data: UserData): void {
  writeStorage(key(userId), data);
}
