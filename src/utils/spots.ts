import type {
  ChargingAvailability,
  Coordinates,
  CrowdLevel,
  OpenStatus,
  QuietLevel,
  SpotFilters,
  SpotWithStatus,
  StudySpot,
  WifiQuality,
} from "../types/spot";

export const SPOT_TIME_ZONE = "Australia/Melbourne";

export const quietLabels: Record<QuietLevel, string> = {
  silent: "Silent",
  quiet: "Quiet",
  moderate: "Some chatter",
  lively: "Lively",
};

export const crowdLabels: Record<CrowdLevel, string> = {
  empty: "Very quiet",
  light: "Not busy",
  moderate: "Moderately busy",
  busy: "Busy",
};

export const wifiLabels: Record<WifiQuality, string> = {
  excellent: "Excellent",
  good: "Good",
  patchy: "Patchy",
  none: "No Wi-Fi",
};

export const chargingLabels: Record<ChargingAvailability, string> = {
  plenty: "Plenty of outlets",
  some: "Some outlets",
  few: "A few outlets",
  none: "No outlets",
};

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const isQuiet = (spot: StudySpot) => spot.quietness === "silent" || spot.quietness === "quiet";
export const hasGoodWifi = (spot: StudySpot) => spot.wifiQuality === "excellent" || spot.wifiQuality === "good";
export const hasCharging = (spot: StudySpot) => spot.chargingAvailability !== "none";

export const seatsLabel = (seats: number) => (seats === 0 ? "Full right now" : seats <= 5 ? `Only ${seats} left` : `${seats} seats`);

/** Day of week and minutes since midnight in Melbourne, regardless of the device's time zone. */
export function getSpotLocalTime(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SPOT_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day: Math.max(day, 0), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

/** "21:00" → "9 PM", "07:30" → "7:30 AM". */
export function formatTime(time: string): string {
  const total = toMinutes(time);
  if (total === 0 || total === 24 * 60) return "midnight";
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return minute ? `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}` : `${displayHour} ${suffix}`;
}

/** Open past 8 PM on most weekdays. */
export const hasLongHours = (spot: StudySpot) =>
  spot.openingHours.slice(1, 6).filter((day) => day && toMinutes(day.close) >= 20 * 60).length >= 3;

export function getOpenStatus(spot: StudySpot, now: Date): OpenStatus {
  const { day, minutes } = getSpotLocalTime(now);
  const today = spot.openingHours[day];

  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    const closingSoon = toMinutes(today.close) - minutes <= 60;
    const close = formatTime(today.close);
    return {
      isOpen: true,
      closingSoon,
      short: closingSoon ? `Closes ${close}` : `Until ${close}`,
      label: closingSoon ? `Closing soon · ${close}` : `Open until ${close}`,
    };
  }

  if (today && minutes < toMinutes(today.open)) {
    const open = formatTime(today.open);
    return { isOpen: false, closingSoon: false, short: `Opens ${open}`, label: `Closed · opens ${open}` };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    const next = spot.openingHours[nextDay];
    if (next) {
      const open = formatTime(next.open);
      const when = offset === 1 ? "tomorrow" : dayNames[nextDay].slice(0, 3);
      return { isOpen: false, closingSoon: false, short: `Opens ${when}`, label: `Closed · opens ${open} ${when}` };
    }
  }

  return { isOpen: false, closingSoon: false, short: "Closed", label: "Closed" };
}

/** Great-circle distance in kilometres. */
export function distanceKm(from: Coordinates, to: Coordinates): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.latitude)) * Math.cos(toRad(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  // Roughly 5 km/h walking with a 1.3× factor for real street routes.
  const walkMinutes = Math.max(1, Math.round(km * 1.3 * 12));
  if (walkMinutes <= 25) return `${walkMinutes} min walk`;
  return km < 10 ? `${km.toFixed(1)} km away` : `${Math.round(km)} km away`;
}

export function withStatus(spots: StudySpot[], origin: Coordinates, now: Date): SpotWithStatus[] {
  return spots.map((spot) => {
    const km = distanceKm(origin, spot);
    const openStatus = getOpenStatus(spot, now);
    return { ...spot, distanceKm: km, distance: formatDistance(km), isOpen: openStatus.isOpen, openStatus };
  });
}

export const emptyFilters: SpotFilters = {
  query: "",
  category: "All spots",
  quietOnly: false,
  openNow: false,
  charging: false,
  groupFriendly: false,
};

/** Number of filters set in the filter sheet (search and category are shown separately). */
export const countSheetFilters = (filters: SpotFilters) =>
  [filters.quietOnly, filters.openNow, filters.charging, filters.groupFriendly].filter(Boolean).length;

export const hasActiveFilters = (filters: SpotFilters) =>
  filters.query.trim() !== "" || filters.category !== "All spots" || countSheetFilters(filters) > 0;

const normalise = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function matchesQuery(spot: StudySpot, query: string): boolean {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalise(
    [spot.name, spot.type, spot.type === "Campus" ? "university uni" : "", spot.vibe, spot.suburb, spot.address, quietLabels[spot.quietness], ...spot.tags].join(" "),
  );
  return words.every((word) => haystack.includes(word));
}

/** All filters are combined with AND, so they narrow results together instead of overriding each other. */
export function filterSpots(spots: SpotWithStatus[], filters: SpotFilters): SpotWithStatus[] {
  return spots.filter((spot) => {
    if (filters.category === "Quiet" && !isQuiet(spot)) return false;
    if (filters.category === "Cafés" && spot.type !== "Café") return false;
    if (filters.category === "Wi-Fi" && !hasGoodWifi(spot)) return false;
    if (filters.quietOnly && !isQuiet(spot)) return false;
    if (filters.openNow && !spot.isOpen) return false;
    if (filters.charging && !hasCharging(spot)) return false;
    if (filters.groupFriendly && !spot.groupStudySuitable) return false;
    return matchesQuery(spot, filters.query);
  });
}

/** Default browsing order: open spots first, then nearest, then best rated. */
export function sortByDistance(spots: SpotWithStatus[]): SpotWithStatus[] {
  return [...spots].sort((a, b) => {
    if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
    const distanceDiff = a.distanceKm - b.distanceKm;
    if (Math.abs(distanceDiff) > 0.3) return distanceDiff;
    return b.rating - a.rating;
  });
}

const isAppleDevice = () => /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;

/** Apple Maps on iPhone/iPad, Google Maps everywhere else. Walking directions to the venue. */
export function directionsUrl(spot: StudySpot): string {
  if (isAppleDevice()) {
    return `https://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}&q=${encodeURIComponent(spot.name)}&dirflg=w`;
  }
  const destination = encodeURIComponent(`${spot.name}, ${spot.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
}
