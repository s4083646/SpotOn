import type { Cosmetic, Review, VibeNoise, VibePower, VibeSeating, VibeValues, VibeWifi } from "../types/community";
import type { StudySpot } from "../types/spot";

// Sample reviews so the community features aren't empty. They're labelled "Sample" in the UI.
// Reviews written in the app are stored separately (see services/community.ts).
export const sampleReviews: Review[] = [
  { id: "sample-1", spotId: 1, author: "Maya", initials: "MY", rating: 5, text: "Really quiet upstairs and there are lots of power outlets. It gets busier after 1 PM.", tag: "Quiet", createdAt: "2026-09-29T02:00:00Z", helpful: 14 },
  { id: "sample-2", spotId: 1, author: "Noah", initials: "NP", rating: 5, text: "Beautiful, calm, and the Wi-Fi held up through a three-hour assignment sprint.", tag: "Good Wi-Fi", createdAt: "2026-09-27T05:00:00Z", helpful: 11 },
  { id: "sample-3", spotId: 2, author: "Priya", initials: "PS", rating: 5, text: "A little lively, but perfect when I need coffee and some background buzz to get moving.", tag: "Good seating", createdAt: "2026-09-28T23:00:00Z", helpful: 9 },
  { id: "sample-4", spotId: 2, author: "Jamie", initials: "JR", rating: 4, text: "Great morning spot. Tables fill quickly, so arrive early if you need room for a laptop.", tag: "Busy", createdAt: "2026-09-25T22:00:00Z", helpful: 7 },
  { id: "sample-5", spotId: 3, author: "Ava", initials: "AK", rating: 5, text: "So much natural light and plenty of outlets. It feels calm even when the waterfront is busy.", tag: "Lots of plugs", createdAt: "2026-09-29T04:00:00Z", helpful: 14 },
  { id: "sample-6", spotId: 3, author: "Leo", initials: "LT", rating: 4, text: "My Docklands go-to. The sunny desks near the windows are excellent in the afternoon.", tag: "Good for groups", createdAt: "2026-09-24T06:00:00Z", helpful: 6 },
  { id: "sample-7", spotId: 4, author: "Sofia", initials: "SM", rating: 4, text: "Ground floor is chatty but the upstairs desks are fine for reading. Super handy between classes.", tag: "Good seating", createdAt: "2026-09-26T03:00:00Z", helpful: 5 },
  { id: "sample-8", spotId: 5, author: "Ethan", initials: "EW", rating: 5, text: "The silent floor is my exam-season home. Bring a jumper, it gets cold.", tag: "Quiet", createdAt: "2026-09-28T09:00:00Z", helpful: 12 },
  { id: "sample-9", spotId: 6, author: "Hana", initials: "HO", rating: 5, text: "Never had trouble finding a seat here. Bright, calm and the staff are lovely.", tag: "Good seating", createdAt: "2026-09-23T01:00:00Z", helpful: 8 },
  { id: "sample-10", spotId: 7, author: "Marcus", initials: "MC", rating: 4, text: "Huge space and great coffee. Wi-Fi is hit and miss, so download readings first.", tag: "Busy", createdAt: "2026-09-27T04:00:00Z", helpful: 4 },
  { id: "sample-11", spotId: 8, author: "Grace", initials: "GL", rating: 5, text: "Tucked away and peaceful. Plenty of plugs along the window desks.", tag: "Lots of plugs", createdAt: "2026-09-22T05:00:00Z", helpful: 6 },
  { id: "sample-12", spotId: 9, author: "Omar", initials: "OA", rating: 4, text: "Cosy and quiet, but only a few desks. Worth it if you get there early.", tag: "Quiet", createdAt: "2026-09-21T00:00:00Z", helpful: 3 },
  { id: "sample-13", spotId: 10, author: "Chloe", initials: "CB", rating: 4, text: "Not for long sessions (no Wi-Fi), but perfect for flashcards and a great coffee.", tag: "Busy", createdAt: "2026-09-25T01:00:00Z", helpful: 5 },
];

export const reviewTags = ["Quiet", "Good Wi-Fi", "Lots of plugs", "Good seating", "Good for groups", "Busy"];

export const cosmetics: Cosmetic[] = [
  { id: "beanie", name: "Peach beanie", description: "A cosy focus-day favourite", cost: 60, color: "#ffb58f" },
  { id: "glasses", name: "Blue glasses", description: "For extra-clever study energy", cost: 100, color: "#afc5f1" },
  { id: "scarf", name: "Pink scarf", description: "A soft pop of Melbourne colour", cost: 140, color: "#f6b9d4" },
];

export const vibeGroups = [
  { key: "noise", label: "Noise level", symbol: "🔇", options: ["Quiet", "Moderate", "Loud"] as VibeNoise[] },
  { key: "seating", label: "Seating", symbol: "🪑", options: ["Plenty", "Some", "Full"] as VibeSeating[] },
  { key: "wifi", label: "Wi-Fi", symbol: "📶", options: ["Good", "Okay", "Poor"] as VibeWifi[] },
  { key: "power", label: "Power outlets", symbol: "🔌", options: ["Available", "Limited", "None"] as VibePower[] },
] as const;

/** A baseline vibe derived from a spot's sample data, shown until a student shares a real update. */
export function sampleVibe(spot: StudySpot): VibeValues {
  return {
    noise: spot.noiseLevel === "silent" || spot.noiseLevel === "quiet" ? "Quiet" : spot.noiseLevel === "moderate" ? "Moderate" : "Loud",
    seating: spot.availableSeats === 0 ? "Full" : spot.availableSeats <= 8 ? "Some" : "Plenty",
    wifi: spot.wifiQuality === "excellent" || spot.wifiQuality === "good" ? "Good" : spot.wifiQuality === "patchy" ? "Okay" : "Poor",
    power: spot.chargingAvailability === "plenty" || spot.chargingAvailability === "some" ? "Available" : spot.chargingAvailability === "few" ? "Limited" : "None",
  };
}
