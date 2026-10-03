import type { Amenity, SessionLength, StudyEnvironment, StudyGoal, StudyProfile, VenuePreference } from "../types/user";

export type Option<T extends string> = { value: T; label: string; hint?: string; emoji: string };

export const environmentOptions: Option<StudyEnvironment>[] = [
  { value: "very-quiet", label: "Very quiet", hint: "Pin-drop silence", emoji: "🤫" },
  { value: "quiet", label: "Quiet", hint: "Soft page-turning", emoji: "📖" },
  { value: "light-noise", label: "Light background noise", hint: "A gentle café hum", emoji: "☕" },
  { value: "social", label: "Social / group", hint: "Chatty and lively", emoji: "💬" },
];

export const venueOptions: Option<VenuePreference>[] = [
  { value: "Library", label: "Library", emoji: "📚" },
  { value: "Café", label: "Café", emoji: "🥐" },
  { value: "Campus", label: "University campus", emoji: "🎓" },
  { value: "any", label: "Any", emoji: "✨" },
];

export const sessionOptions: Option<SessionLength>[] = [
  { value: "under-1", label: "Less than 1 hour", emoji: "⚡" },
  { value: "1-2", label: "1 to 2 hours", emoji: "⏱️" },
  { value: "2-4", label: "2 to 4 hours", emoji: "🕑" },
  { value: "4-plus", label: "4+ hours", emoji: "🏃" },
];

export const goalOptions: Option<StudyGoal>[] = [
  { value: "deep-focus", label: "Deep focus", emoji: "🎯" },
  { value: "casual", label: "Casual study", emoji: "🌿" },
  { value: "group", label: "Group work", emoji: "👯" },
  { value: "assignment", label: "Assignment work", emoji: "💻" },
  { value: "exam", label: "Exam preparation", emoji: "📝" },
];

export const amenityOptions: Option<Amenity>[] = [
  { value: "wifi", label: "Wi-Fi", emoji: "📶" },
  { value: "outlets", label: "Power outlets", emoji: "🔌" },
  { value: "food", label: "Food & drinks", emoji: "🍵" },
  { value: "quiet", label: "Quiet spaces", emoji: "🤫" },
  { value: "group-seating", label: "Group seating", emoji: "🪑" },
  { value: "long-hours", label: "Long opening hours", emoji: "🌙" },
];

export const defaultStudyProfile: StudyProfile = {
  environment: "quiet",
  venueType: "any",
  sessionLength: "1-2",
  goal: "deep-focus",
  amenities: ["wifi", "outlets"],
  fieldOfStudy: "",
};

export const optionLabel = <T extends string>(options: Option<T>[], value: T) => options.find((option) => option.value === value)?.label ?? value;
