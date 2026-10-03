import type { Review } from "../types/community";
import type { SpotWithStatus } from "../types/spot";
import Icon from "./Icon";

const avatarColors = ["#f8d66d", "#afc5f1", "#ffb58f"];

type StudyCircleCardProps = {
  recentReviews: Review[];
  totalRatings: number;
  vibeUpdates: number;
  topSpot: SpotWithStatus | null;
  onOpenSpot: (spot: SpotWithStatus) => void;
};

/** Community summary on Explore: who's been sharing tips and the top-rated spot. */
export default function StudyCircleCard({ recentReviews, totalRatings, vibeUpdates, topSpot, onOpenSpot }: StudyCircleCardProps) {
  const reviewers = Array.from(new Map(recentReviews.map((review) => [review.initials, review])).values());
  const shown = reviewers.slice(0, 3);
  const extra = reviewers.length - shown.length;

  return (
    <div className="mb-6 overflow-hidden rounded-[24px] bg-[#f6b9d4] p-4 shadow-[0_10px_28px_rgba(104,62,82,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8f3f64]">Study Circle</p>
          <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em] text-[#20201f]">Melbourne is focusing</h2>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[#20201f]/60">
            {totalRatings} student ratings{vibeUpdates > 0 ? ` · ${vibeUpdates} vibe update${vibeUpdates === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 -space-x-2" aria-label={`${reviewers.length} students shared reviews`}>
          {shown.map((review, index) => (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f6b9d4] text-[10px] font-extrabold text-[#20201f]" key={review.initials} style={{ backgroundColor: avatarColors[index] }}>
              {review.initials}
            </span>
          ))}
          {extra > 0 && <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f6b9d4] bg-[#20201f] text-[10px] font-extrabold text-white">+{extra}</span>}
        </div>
      </div>
      {topSpot && (
        <button className="mt-4 flex w-full items-center justify-between rounded-[16px] bg-white/65 p-3 text-left backdrop-blur transition hover:bg-white/80 active:scale-[0.99]" onClick={() => onOpenSpot(topSpot)} type="button">
          <span>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#8f3f64]">Top rated by students</span>
            <span className="mt-0.5 block text-[13px] font-extrabold text-[#20201f]">{topSpot.name}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-[#20201f]">
            <Icon className="h-3 w-3 text-[#e5a52e]" filled name="star" />
            {topSpot.rating.toFixed(1)}
          </span>
        </button>
      )}
    </div>
  );
}
