import type { SpotWithStatus } from "../types/spot";
import Icon from "./Icon";
import SpotImage from "./SpotImage";

type TrendingSpotsProps = {
  spots: SpotWithStatus[];
  onOpenSpot: (spot: SpotWithStatus) => void;
};

/** Horizontal row of the most-reviewed spots. */
export default function TrendingSpots({ spots, onOpenSpot }: TrendingSpotsProps) {
  return (
    <div className="mt-7">
      <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#20201f]">Trending with students</h2>
      <p className="mt-0.5 text-[11px] font-semibold text-[#817986]">The most-reviewed study spots</p>
      <div className="-mx-5 mt-3 flex snap-x gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {spots.map((spot) => (
          <button
            className="w-[178px] shrink-0 snap-start overflow-hidden rounded-[20px] border border-[#20201f]/7 bg-white text-left shadow-[0_8px_22px_rgba(35,38,48,0.06)] transition hover:-translate-y-0.5 active:scale-[0.98]"
            key={spot.id}
            onClick={() => onOpenSpot(spot)}
            type="button"
          >
            <div className="relative h-24">
              <SpotImage className="h-full w-full object-cover" spot={spot} />
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-extrabold text-[#20201f] backdrop-blur">
                <Icon className="h-2.5 w-2.5 text-[#e5a52e]" filled name="star" />
                {spot.rating.toFixed(1)}
              </span>
            </div>
            <div className="p-3">
              <span className="block truncate text-[12px] font-extrabold text-[#20201f]">{spot.name}</span>
              <span className="mt-1.5 block text-[10px] font-bold text-[#e9532f]">💬 {spot.reviewCount} student reviews</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
