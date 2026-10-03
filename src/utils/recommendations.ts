import type { SpotWithStatus } from "../types/spot";
import type { StudyProfile } from "../types/user";
import { hasCharging, hasGoodWifi, hasLongHours, isQuiet } from "./spots";

/**
 * A simple, transparent points-based recommender (no AI involved).
 * Each rule adds or removes points and can attach a short reason; the strongest reasons
 * become the friendly explanation shown on the card.
 */

type Reason = { points: number; text: string };

export type Recommendation = {
  spot: SpotWithStatus;
  score: number;
  /** Short, friendly explanation, e.g. "Great match for your quiet study preference". */
  explanation: string;
};

export function recommendationScore(profile: StudyProfile, spot: SpotWithStatus): { score: number; reasons: Reason[] } {
  let score = 0;
  const reasons: Reason[] = [];
  const add = (points: number, text?: string) => {
    score += points;
    if (text && points > 0) reasons.push({ points, text });
  };

  // 1. Preferred study environment vs the venue's usual atmosphere.
  const environmentPoints: Record<StudyProfile["environment"], Record<SpotWithStatus["quietness"], number>> = {
    "very-quiet": { silent: 30, quiet: 18, moderate: -8, lively: -22 },
    quiet: { silent: 20, quiet: 26, moderate: 2, lively: -14 },
    "light-noise": { silent: 0, quiet: 12, moderate: 26, lively: 10 },
    social: { silent: -12, quiet: 0, moderate: 18, lively: 24 },
  };
  const environmentText =
    profile.environment === "social" || profile.environment === "light-noise"
      ? "Matches the relaxed buzz you like"
      : "Great match for your quiet study preference";
  add(environmentPoints[profile.environment][spot.quietness], environmentText);

  // 2. Preferred venue type.
  if (profile.venueType !== "any") {
    const label = spot.type === "Café" ? "café" : spot.type === "Campus" ? "campus library" : "library";
    add(spot.type === profile.venueType ? 28 : -8, `A ${label}, just how you like it`);
  }

  // 3. Typical session length.
  if (profile.sessionLength === "2-4" || profile.sessionLength === "4-plus") {
    const longSession = profile.sessionLength === "4-plus" ? 20 : 14;
    add(spot.longStayFriendly ? longSession : -4, hasGoodWifi(spot) && hasCharging(spot) ? "Good for long sessions with Wi-Fi and charging" : "Comfy for long study sessions");
    if (hasLongHours(spot)) add(8, "Open late for longer sessions");
  } else if (profile.sessionLength === "under-1") {
    add(Math.max(0, 10 - spot.distanceKm * 4), "Close by for a quick session");
  }

  // 4. Main study goal.
  switch (profile.goal) {
    case "deep-focus":
      add(isQuiet(spot) ? 12 : -6, "Calm enough for deep focus");
      break;
    case "exam":
      add(isQuiet(spot) && spot.longStayFriendly ? 14 : 0, "Ideal for exam prep marathons");
      break;
    case "group":
      add(spot.groupStudySuitable ? 22 : -14, "Popular for group study");
      break;
    case "assignment":
      add(hasGoodWifi(spot) && hasCharging(spot) ? 12 : 0, "Reliable Wi-Fi and power for assignments");
      break;
    case "casual":
      add(spot.type === "Café" || spot.foodAvailable ? 10 : 0, "Easy-going spot for casual study");
      break;
  }

  // 5. Must-have amenities.
  for (const amenity of profile.amenities) {
    if (amenity === "wifi") {
      const points = { excellent: 12, good: 8, patchy: -2, none: -14 }[spot.wifiQuality];
      add(points, "Reliable Wi-Fi");
    }
    if (amenity === "outlets") {
      const points = { plenty: 12, some: 8, few: 2, none: -14 }[spot.chargingAvailability];
      add(points, "Plenty of places to charge");
    }
    if (amenity === "food") add(spot.foodAvailable ? 8 : -4, "Snacks and coffee on hand");
    if (amenity === "quiet") add(isQuiet(spot) ? 10 : -6, "Has quiet spaces");
    if (amenity === "group-seating") add(spot.groupStudySuitable ? 10 : -4, "Group seating available");
    if (amenity === "long-hours") add(hasLongHours(spot) ? 10 : -2, "Open late on weeknights");
  }

  // 6. General quality signals: rating, being open, and distance.
  add((spot.rating - 4) * 10);
  add(spot.isOpen ? 6 : -4);
  add(-Math.min(spot.distanceKm, 5) * 2);

  return { score, reasons };
}

export function getRecommendations(profile: StudyProfile, spots: SpotWithStatus[], limit = 3): Recommendation[] {
  return spots
    .map((spot) => {
      const { score, reasons } = recommendationScore(profile, spot);
      const best = [...reasons].sort((a, b) => b.points - a.points)[0];
      return { spot, score, explanation: best?.text ?? "A solid all-round study spot" };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
