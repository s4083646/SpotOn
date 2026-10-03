import type { SpotType } from "./spot";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** ISO date, YYYY-MM-DD. */
  dateOfBirth: string;
  createdAt: string;
};

export type StudyEnvironment = "very-quiet" | "quiet" | "light-noise" | "social";
export type VenuePreference = SpotType | "any";
export type SessionLength = "under-1" | "1-2" | "2-4" | "4-plus";
export type StudyGoal = "deep-focus" | "casual" | "group" | "assignment" | "exam";
export type Amenity = "wifi" | "outlets" | "food" | "quiet" | "group-seating" | "long-hours";

/** Study preferences collected at signup and editable from the Profile page. */
export type StudyProfile = {
  environment: StudyEnvironment;
  venueType: VenuePreference;
  sessionLength: SessionLength;
  goal: StudyGoal;
  amenities: Amenity[];
  /** Optional, e.g. "RMIT · Computer Science". */
  fieldOfStudy: string;
};

export type NotificationSettings = {
  studyReminders: boolean;
};

export type StudySession = {
  id: string;
  spotId: number;
  startedAt: string;
  endedAt: string;
  minutes: number;
  /** XP earned for this session. */
  xp: number;
};

export type ActiveSession = {
  spotId: number;
  startedAt: string;
};

/** Everything the app stores for one signed-in user. */
export type UserData = {
  studyProfile: StudyProfile | null;
  savedSpotIds: number[];
  notifications: NotificationSettings;
  sessions: StudySession[];
  activeSession: ActiveSession | null;
  /** Local date (YYYY-MM-DD) the daily reminder was last dismissed. */
  reminderDismissedOn: string | null;
  /** XP spent on Study Buddy cosmetics. Total XP is derived from sessions, so it never goes down. */
  spentXp: number;
  ownedCosmetics: string[];
  equippedCosmetics: string[];
  /** Reviews this user marked as helpful. */
  helpfulReviewIds: string[];
};

export type LoginInput = { email: string; password: string };

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
};
