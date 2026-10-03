import type { Review, VibeReport } from "../types/community";
import { readStorage, writeStorage } from "../utils/storage";

/**
 * Reviews and vibe updates written in the app. In this MVP they're shared between accounts
 * on the same browser via localStorage; with a backend these become shared database tables.
 */
export type CommunityStore = {
  reviews: Review[];
  vibeReports: VibeReport[];
};

const KEY = "community";

export function loadCommunity(): CommunityStore {
  const stored = readStorage<Partial<CommunityStore>>(KEY, {});
  return { reviews: stored.reviews ?? [], vibeReports: stored.vibeReports ?? [] };
}

export function saveCommunity(store: CommunityStore): void {
  writeStorage(KEY, store);
}
