import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth";
import { defaultUserData, loadUserData, saveUserData } from "../services/userData";
import type { LoginInput, NotificationSettings, SignupInput, StudyProfile, StudySession, User, UserData } from "../types/user";
import { xpForMinutes, xpProgress } from "../utils/progress";
import { createId } from "../utils/storage";
import { todayKey } from "../utils/user";

type AccountState = { user: User | null; data: UserData };

function initialState(): AccountState {
  const user = authService.getCurrentUser();
  return { user, data: user ? loadUserData(user.id) : defaultUserData };
}

/** The signed-in user plus their study profile, saved spots, settings and sessions, persisted per user. */
export function useAccount() {
  const [account, setAccount] = useState<AccountState>(initialState);

  useEffect(() => {
    if (account.user) saveUserData(account.user.id, account.data);
  }, [account]);

  const updateData = useCallback((update: (data: UserData) => UserData) => {
    setAccount((current) => (current.user ? { ...current, data: update(current.data) } : current));
  }, []);

  const signIn = useCallback((user: User) => setAccount({ user, data: loadUserData(user.id) }), []);

  const login = useCallback(
    async (input: LoginInput) => {
      const user = await authService.login(input);
      signIn(user);
      return user;
    },
    [signIn],
  );

  const signup = useCallback(async (input: SignupInput, studyProfile: StudyProfile) => {
    const user = await authService.signup(input);
    setAccount({ user, data: { ...loadUserData(user.id), studyProfile } });
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAccount({ user: null, data: defaultUserData });
  }, []);

  const setSaved = useCallback(
    (spotId: number, saved: boolean) =>
      updateData((data) => ({
        ...data,
        savedSpotIds: saved
          ? data.savedSpotIds.includes(spotId)
            ? data.savedSpotIds
            : [...data.savedSpotIds, spotId]
          : data.savedSpotIds.filter((id) => id !== spotId),
      })),
    [updateData],
  );

  const setStudyProfile = useCallback(
    (studyProfile: StudyProfile) => updateData((data) => ({ ...data, studyProfile })),
    [updateData],
  );

  const setNotifications = useCallback(
    (patch: Partial<NotificationSettings>) => updateData((data) => ({ ...data, notifications: { ...data.notifications, ...patch } })),
    [updateData],
  );

  const startSession = useCallback(
    (spotId: number) => updateData((data) => ({ ...data, activeSession: { spotId, startedAt: new Date().toISOString() } })),
    [updateData],
  );

  /** Ends the running timer and records it. Returns the recorded session, if there was one. */
  const endSession = useCallback((): StudySession | null => {
    const active = account.data.activeSession;
    if (!account.user || !active) return null;
    const endedAt = new Date();
    const minutes = Math.max(1, Math.round((endedAt.getTime() - new Date(active.startedAt).getTime()) / 60000));
    const session: StudySession = { id: createId(), spotId: active.spotId, startedAt: active.startedAt, endedAt: endedAt.toISOString(), minutes, xp: xpForMinutes(minutes) };
    updateData((data) => ({ ...data, activeSession: null, sessions: [session, ...data.sessions] }));
    return session;
  }, [account, updateData]);

  /** Records a session the user already finished (the "How long did you focus?" check-in). */
  const logSession = useCallback(
    (spotId: number, minutes: number): StudySession => {
      const endedAt = new Date();
      const session: StudySession = {
        id: createId(),
        spotId,
        startedAt: new Date(endedAt.getTime() - minutes * 60000).toISOString(),
        endedAt: endedAt.toISOString(),
        minutes,
        xp: xpForMinutes(minutes),
      };
      updateData((data) => ({ ...data, sessions: [session, ...data.sessions] }));
      return session;
    },
    [updateData],
  );

  /** Buys a cosmetic with spendable XP, or toggles wearing one already owned. */
  const applyCosmetic = useCallback(
    (id: string, cost: number) =>
      updateData((data) => {
        if (data.ownedCosmetics.includes(id)) {
          const wearing = data.equippedCosmetics.includes(id);
          return { ...data, equippedCosmetics: wearing ? data.equippedCosmetics.filter((item) => item !== id) : [...data.equippedCosmetics, id] };
        }
        if (xpProgress(data).balance < cost) return data;
        return { ...data, spentXp: data.spentXp + cost, ownedCosmetics: [...data.ownedCosmetics, id], equippedCosmetics: [...data.equippedCosmetics, id] };
      }),
    [updateData],
  );

  const setHelpful = useCallback(
    (reviewId: string, helpful: boolean) =>
      updateData((data) => ({
        ...data,
        helpfulReviewIds: helpful
          ? data.helpfulReviewIds.includes(reviewId)
            ? data.helpfulReviewIds
            : [...data.helpfulReviewIds, reviewId]
          : data.helpfulReviewIds.filter((id) => id !== reviewId),
      })),
    [updateData],
  );

  const cancelSession = useCallback(() => updateData((data) => ({ ...data, activeSession: null })), [updateData]);

  const dismissReminder = useCallback(() => updateData((data) => ({ ...data, reminderDismissedOn: todayKey() })), [updateData]);

  return {
    user: account.user,
    data: account.data,
    login,
    signup,
    logout,
    setSaved,
    setStudyProfile,
    setNotifications,
    startSession,
    endSession,
    logSession,
    applyCosmetic,
    setHelpful,
    cancelSession,
    dismissReminder,
  };
}

export type Account = ReturnType<typeof useAccount>;
