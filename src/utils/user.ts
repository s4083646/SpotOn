import type { StudySession, User } from "../types/user";

export const fullName = (user: User) => [user.firstName, user.lastName].filter(Boolean).join(" ");

export function getInitials(user: User): string {
  return [user.firstName, user.lastName]
    .map((part) => part.trim().charAt(0))
    .filter(Boolean)
    .join("")
    .toUpperCase();
}

export const totalFocusedMinutes = (sessions: StudySession[]) => sessions.reduce((sum, session) => sum + session.minutes, 0);

export function formatHours(minutes: number): string {
  if (minutes === 0) return "0h";
  const hours = minutes / 60;
  return `${hours < 10 ? Number(hours.toFixed(1)) : Math.round(hours)}h`;
}


export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const rest = minutes % 60;
  return rest ? `${Math.floor(minutes / 60)}h ${rest}m` : `${minutes / 60}h`;
}

export function formatTimer(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function todayKey(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const memberSince = (user: User) =>
  new Date(user.createdAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" });

/** "Just now", "8 mins ago", "3 hours ago", "Yesterday", "5 days ago", then a date. */
export function timeAgo(iso: string, now = new Date()): string {
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
