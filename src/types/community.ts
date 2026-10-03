export type VibeNoise = "Quiet" | "Moderate" | "Loud";
export type VibeSeating = "Plenty" | "Some" | "Full";
export type VibeWifi = "Good" | "Okay" | "Poor";
export type VibePower = "Available" | "Limited" | "None";

export type VibeValues = {
  noise: VibeNoise;
  seating: VibeSeating;
  wifi: VibeWifi;
  power: VibePower;
};

/** A student's quick "what's it like right now" update for a spot. */
export type VibeReport = VibeValues & {
  id: string;
  spotId: number;
  userId: string;
  createdAt: string;
};

export type Review = {
  id: string;
  spotId: number;
  /** Missing for the built-in sample reviews. */
  userId?: string;
  author: string;
  initials: string;
  rating: number;
  text: string;
  tag: string;
  createdAt: string;
  /** Helpful votes from other students (sample count for seeded reviews). */
  helpful: number;
};

export type Cosmetic = {
  id: string;
  name: string;
  description: string;
  cost: number;
  color: string;
};
