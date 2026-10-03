export type SpotType = "Library" | "Café" | "Campus";

export type QuietLevel = "silent" | "quiet" | "moderate" | "lively";
export type CrowdLevel = "empty" | "light" | "moderate" | "busy";
export type WifiQuality = "excellent" | "good" | "patchy" | "none";
export type ChargingAvailability = "plenty" | "some" | "few" | "none";

/** Opening and closing time in 24h "HH:MM" format. */
export type DayHours = { open: string; close: string } | null;

/** Opening hours indexed by day of week, Sunday = 0 … Saturday = 6. */
export type WeeklyHours = [DayHours, DayHours, DayHours, DayHours, DayHours, DayHours, DayHours];

export type StudySpot = {
  id: number;
  name: string;
  type: SpotType;
  image: string;
  alt: string;
  description: string;
  /** Short personality line, e.g. "Pin-drop quiet". */
  vibe: string;
  rating: number;
  address: string;
  suburb: string;
  latitude: number;
  longitude: number;
  openingHours: WeeklyHours;

  // Venue characteristics (stable facts about the place).
  /** The venue's usual atmosphere. */
  quietness: QuietLevel;
  wifiQuality: WifiQuality;
  chargingAvailability: ChargingAvailability;
  groupStudySuitable: boolean;
  foodAvailable: boolean;
  /** Comfortable for multi-hour sessions (seating, no time limits, bathrooms). */
  longStayFriendly: boolean;
  tags: string[];
  /** Short descriptors students use for the spot, e.g. "Lots of Plugs". */
  communityTags: string[];
  /** Students' advice on when to visit, e.g. "Come before 11 AM for a window desk". */
  bestTimeTip: string;
  /** Number of sample ratings behind `rating`; new reviews written in the app are averaged in. */
  reviewCount: number;

  // Sample community data. In a real app these would come from recent user reports,
  // so the UI labels them as sample data rather than claiming they are live.
  noiseLevel: QuietLevel;
  crowdLevel: CrowdLevel;
  availableSeats: number;

  /** Accent colour for the type label. */
  color: string;
};

export type OpenStatus = {
  isOpen: boolean;
  /** Short label, e.g. "Until 9 PM" or "Opens 10 AM". */
  short: string;
  /** Full label, e.g. "Open until 9 PM" or "Closed · opens 10 AM tomorrow". */
  label: string;
  closingSoon: boolean;
};

/**
 * A spot plus values derived at runtime. `distance` and `isOpen` are computed from the
 * user's location and the current Melbourne time rather than stored, so they never go stale.
 */
export type SpotWithStatus = StudySpot & {
  distanceKm: number;
  distance: string;
  isOpen: boolean;
  openStatus: OpenStatus;
};

export type Category = "All spots" | "Quiet" | "Cafés" | "Wi-Fi";

export type SpotFilters = {
  query: string;
  category: Category;
  quietOnly: boolean;
  openNow: boolean;
  charging: boolean;
  groupFriendly: boolean;
};

export type Coordinates = { latitude: number; longitude: number };

export type LocationOption = Coordinates & {
  id: string;
  label: string;
};
