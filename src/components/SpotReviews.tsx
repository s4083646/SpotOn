import { useState } from "react";
import type { Review } from "../types/community";
import { timeAgo } from "../utils/user";
import Icon from "./Icon";

type SpotReviewsProps = {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  helpfulIds: string[];
  currentUserId: string | null;
  now: Date;
  onWriteReview: () => void;
  onToggleHelpful: (review: Review) => void;
};

function Stars({ value, size }: { value: number; size: string }) {
  return (
    <span className="flex gap-px" aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon className={`${size} ${star <= Math.round(value) ? "text-[#e5a52e]" : "text-[#d8d3cd]"}`} filled key={star} name="star" />
      ))}
    </span>
  );
}

export default function SpotReviews({ reviews, rating, reviewCount, helpfulIds, currentUserId, now, onWriteReview, onToggleHelpful }: SpotReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 2);

  return (
    <section aria-labelledby="reviews-heading" className="mt-5 border-t border-[#20201f]/8 pt-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ff7048]">From the Study Circle</p>
          <h3 className="mt-1 text-[17px] font-extrabold text-[#20201f]" id="reviews-heading">Student Reviews</h3>
        </div>
        <button className="shrink-0 rounded-full bg-[#20201f] px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-[#383836] active:scale-95" onClick={onWriteReview} type="button">
          Write a review
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-[#fff1c6] p-3">
        <span className="text-[25px] font-extrabold tracking-[-0.05em] text-[#20201f]">{rating.toFixed(1)}</span>
        <span>
          <Stars size="h-3 w-3" value={rating} />
          <span className="mt-1 block text-[10px] font-bold text-[#8b6d45]">{reviewCount} student ratings · includes sample data</span>
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {visible.map((review) => {
          const own = Boolean(currentUserId && review.userId === currentUserId);
          const markedHelpful = helpfulIds.includes(review.id);
          return (
            <article className="rounded-[18px] border border-[#20201f]/7 bg-white p-3.5" key={review.id}>
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-[#20201f] ${own ? "bg-[#f8d66d]" : "bg-[#afc5f1]"}`}>{review.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-extrabold text-[#20201f]">
                    {own ? `${review.author} (you)` : review.author}
                    {!review.userId && <span className="ml-1.5 rounded-full bg-[#f1eee8] px-1.5 py-0.5 text-[9px] font-bold text-[#8a8283]">Sample</span>}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Stars size="h-2.5 w-2.5" value={review.rating} />
                    <span className="text-[10px] font-semibold text-[#8a8283]">{timeAgo(review.createdAt, now)}</span>
                  </div>
                </div>
                {review.tag && <span className="rounded-full bg-[#f6b9d4]/45 px-2 py-1 text-[9px] font-extrabold text-[#8f3f64]">{review.tag}</span>}
              </div>
              <p className="mt-3 text-[12px] font-semibold leading-[1.55] text-[#625c60]">{review.text}</p>
              {!own && (
                <button
                  aria-pressed={markedHelpful}
                  className={`mt-2.5 flex items-center gap-1.5 rounded-full py-1 text-[11px] font-extrabold transition active:scale-95 ${markedHelpful ? "text-[#e9532f]" : "text-[#8a8283] hover:text-[#20201f]"}`}
                  onClick={() => onToggleHelpful(review)}
                  type="button"
                >
                  <Icon className="h-3 w-3" filled={markedHelpful} name="heart" /> Helpful · {review.helpful + (markedHelpful ? 1 : 0)}
                </button>
              )}
            </article>
          );
        })}
      </div>
      {reviews.length > 2 && (
        <button className="mt-3 w-full rounded-full py-2 text-[12px] font-extrabold text-[#e9532f] transition hover:bg-[#fff1eb]" onClick={() => setShowAll((current) => !current)} type="button">
          {showAll ? "Show fewer reviews" : `Show all ${reviews.length} written reviews`}
        </button>
      )}
    </section>
  );
}
