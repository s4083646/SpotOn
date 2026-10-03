import type { SpotWithStatus } from "../types/spot";
import { seatsLabel } from "../utils/spots";
import Icon from "./Icon";
import { OpenBadge } from "./SpotCard";
import SpotImage from "./SpotImage";

type MapSpotPreviewProps = {
  spot: SpotWithStatus;
  saved: boolean;
  matchReason: string | null;
  onViewDetails: (spot: SpotWithStatus) => void;
  onToggleSave: (spot: SpotWithStatus) => void;
  onClose: () => void;
};

/** Compact card shown above the bottom nav when a map pin is selected. */
export default function MapSpotPreview({ spot, saved, matchReason, onViewDetails, onToggleSave, onClose }: MapSpotPreviewProps) {
  return (
    <article aria-label={`${spot.name} preview`} className="preview-in rounded-[24px] border border-[#20201f]/8 bg-[#fffdf8] p-3 shadow-[0_18px_40px_rgba(32,32,31,0.22)]">
      <div className="flex gap-3">
        <SpotImage spot={spot} className="h-[84px] w-[84px] shrink-0 rounded-[16px] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: spot.color }}>{spot.type} · {spot.suburb}</p>
              <h2 className="mt-0.5 truncate text-[16px] font-extrabold tracking-[-0.02em] text-[#20201f]">{spot.name}</h2>
            </div>
            <button aria-label="Close preview" className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8a8283] transition hover:bg-[#f1eee8] hover:text-[#20201f]" onClick={onClose} type="button">
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] font-bold text-[#817a87]">
            <span className="flex items-center gap-1 text-[#20201f]"><Icon name="star" className="h-3 w-3 text-[#e6a02f]" filled />{spot.rating.toFixed(1)}</span>
            <span aria-hidden="true">·</span>{spot.distance}
            <span aria-hidden="true">·</span>{spot.vibe}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <OpenBadge spot={spot} tone="muted" />
            <span className="rounded-full bg-[#eef6e6] px-2.5 py-1 text-[10px] font-extrabold text-[#2f6b2c]">{seatsLabel(spot.availableSeats)}</span>
          </div>
        </div>
      </div>
      {matchReason && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-[12px] bg-[#fff3d6] px-2.5 py-2 text-[11px] font-bold leading-4 text-[#6b4a12]">
          <Icon name="check" className="mt-px h-3.5 w-3.5 shrink-0 text-[#e9532f]" /> {matchReason}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[14px] bg-[#20201f] py-3 text-[12px] font-extrabold text-white transition hover:bg-[#383836] active:scale-[0.98]"
          onClick={() => onViewDetails(spot)}
          type="button"
        >
          View details <Icon name="chevron" className="h-3.5 w-3.5" />
        </button>
        <button
          aria-label={saved ? `Remove ${spot.name} from saved` : `Save ${spot.name}`}
          aria-pressed={saved}
          className={`flex h-[42px] w-[42px] items-center justify-center rounded-[14px] transition active:scale-90 ${saved ? "bg-[#ffe2d8] text-[#ff7048]" : "bg-[#f1eee8] text-[#20201f] hover:bg-[#e7e2d9]"}`}
          onClick={() => onToggleSave(spot)}
          type="button"
        >
          <Icon name="heart" className="h-[18px] w-[18px]" filled={saved} />
        </button>
      </div>
    </article>
  );
}
