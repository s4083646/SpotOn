import { useCallback, useEffect, useMemo, useState } from "react";
import { sampleReviews, sampleVibe } from "../data/community";
import { loadCommunity, saveCommunity, type CommunityStore } from "../services/community";
import type { Review, VibeReport, VibeValues } from "../types/community";
import type { StudySpot } from "../types/spot";
import type { User } from "../types/user";
import { createId } from "../utils/storage";
import { getInitials } from "../utils/user";

export type ReviewInput = { spotId: number; rating: number; text: string; tag: string };

export type SpotVibe = VibeValues & {
  /** When a student last updated it; null means it's the built-in sample. */
  updatedAt: string | null;
  byYou: boolean;
};

/** Reviews, ratings and live vibe updates, combining sample data with what students add in the app. */
export function useCommunity() {
  const [store, setStore] = useState<CommunityStore>(loadCommunity);

  useEffect(() => saveCommunity(store), [store]);

  const addReview = useCallback((user: User, input: ReviewInput): Review => {
    const review: Review = {
      id: createId(),
      spotId: input.spotId,
      userId: user.id,
      author: user.firstName,
      initials: getInitials(user),
      rating: input.rating,
      text: input.text.trim(),
      tag: input.tag,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    setStore((current) => ({ ...current, reviews: [review, ...current.reviews] }));
    return review;
  }, []);

  const addVibeReport = useCallback((user: User, spotId: number, values: VibeValues) => {
    const report: VibeReport = { ...values, id: createId(), spotId, userId: user.id, createdAt: new Date().toISOString() };
    setStore((current) => ({ ...current, vibeReports: [report, ...current.vibeReports] }));
  }, []);

  return useMemo(() => {
    const written = (spotId: number) => store.reviews.filter((review) => review.spotId === spotId);

    return {
      store,
      addReview,
      addVibeReport,
      /** Newest reviews written in the app first, then the sample reviews. */
      reviewsFor: (spotId: number) => [...written(spotId), ...sampleReviews.filter((review) => review.spotId === spotId)],
      reviewCountFor: (spot: StudySpot) => spot.reviewCount + written(spot.id).length,
      /** The sample rating averaged together with ratings written in the app. */
      ratingFor: (spot: StudySpot) => {
        const added = written(spot.id);
        if (!added.length) return spot.rating;
        const total = spot.rating * spot.reviewCount + added.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((total / (spot.reviewCount + added.length)) * 10) / 10;
      },
      vibeFor: (spot: StudySpot, userId: string | null): SpotVibe => {
        const latest = store.vibeReports.find((report) => report.spotId === spot.id);
        if (!latest) return { ...sampleVibe(spot), updatedAt: null, byYou: false };
        return { noise: latest.noise, seating: latest.seating, wifi: latest.wifi, power: latest.power, updatedAt: latest.createdAt, byYou: latest.userId === userId };
      },
      reviewsBy: (userId: string) => store.reviews.filter((review) => review.userId === userId).length,
      vibeUpdatesBy: (userId: string) => store.vibeReports.filter((report) => report.userId === userId).length,
    };
  }, [store, addReview, addVibeReport]);
}

export type Community = ReturnType<typeof useCommunity>;
