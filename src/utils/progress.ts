import type { StudySpot } from "../types/spot";
import type { StudySession, UserData } from "../types/user";
import { todayKey } from "./user";

/** 10 XP per 30 minutes (minimum 10). Very short sessions (under 10 minutes) don't earn XP. */
export const xpForMinutes = (minutes: number) => (minutes < 10 ? 0 : Math.max(10, Math.floor(minutes / 30) * 10));

export const totalXp = (sessions: StudySession[]) => sessions.reduce((sum, session) => sum + (session.xp ?? 0), 0);

export function xpProgress(data: UserData) {
  const total = totalXp(data.sessions);
  return {
    total,
    balance: Math.max(0, total - data.spentXp),
    level: Math.floor(total / 100) + 1,
    /** XP earned towards the next level (0–99). */
    intoLevel: total % 100,
  };
}

/** Consecutive days with at least one session, ending today (or yesterday, so the streak isn't lost before you study today). */
export function studyStreak(sessions: StudySession[], now = new Date()): number {
  const days = new Set(sessions.map((session) => todayKey(new Date(session.startedAt))));
  const cursor = new Date(now);
  if (!days.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export type Badge = { id: string; symbol: string; label: string; hint: string; color: string; earned: boolean };

export function communityBadges(data: UserData, spots: StudySpot[], reviewsWritten: number): Badge[] {
  const spotById = new Map(spots.map((spot) => [spot.id, spot]));
  const sessionSpots = data.sessions.map((session) => spotById.get(session.spotId)).filter((spot): spot is StudySpot => Boolean(spot));
  const savedHiddenGems = hiddenGemsSaved(data, spots);

  return [
    { id: "explorer", symbol: "🧭", label: "Spot Explorer", hint: "Study at 3 different spots", color: "#ffe8b0", earned: new Set(sessionSpots.map((spot) => spot.id)).size >= 3 },
    { id: "reviewer", symbol: "⭐", label: "Trusted Reviewer", hint: "Write your first review", color: "#f6c6dc", earned: reviewsWritten >= 1 },
    { id: "cafe", symbol: "☕", label: "Café Hunter", hint: "Log a session at a café", color: "#ffcfb6", earned: sessionSpots.some((spot) => spot.type === "Café") },
    { id: "library", symbol: "📚", label: "Library Regular", hint: "Log 3 library sessions", color: "#cddbf5", earned: sessionSpots.filter((spot) => spot.type !== "Café").length >= 3 },
    { id: "gem", symbol: "💎", label: "Hidden Gem Finder", hint: "Save a hidden gem", color: "#dce9c5", earned: savedHiddenGems > 0 },
  ];
}

export const hiddenGemsSaved = (data: UserData, spots: StudySpot[]) =>
  spots.filter((spot) => data.savedSpotIds.includes(spot.id) && spot.communityTags.includes("Hidden Gem")).length;
