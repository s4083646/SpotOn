import type { SpotWithStatus } from "../types/spot";
import { seatsLabel } from "../utils/spots";
import Icon from "./Icon";
import SpotImage from "./SpotImage";

type SpotCardProps = {
  spot: SpotWithStatus;
  saved: boolean;
  variant: "featured" | "compact" | "saved" | "recommended";
  /** Short reason shown on recommended cards. */
  explanation?: string;
  onOpen: (spot: SpotWithStatus) => void;
  onToggleSave: (spot: SpotWithStatus) => void;
  onViewOnMap?: (spot: SpotWithStatus) => void;
};

export function OpenBadge({ spot, tone }: { spot: SpotWithStatus; tone: "light" | "muted" }) {
  const { isOpen, closingSoon } = spot.openStatus;
  const dot = isOpen ? (closingSoon ? "bg-[#ffc65c]" : "bg-[#7bc96f]") : "bg-[#e9532f]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${tone === "light" ? "bg-white/90 text-[#20201f] backdrop-blur" : "bg-[#f1eee8] text-[#5f5862]"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {isOpen ? (closingSoon ? "Closing soon" : "Open now") : "Closed"}
    </span>
  );
}

/**
 * Study spot card. A full-size overlay button makes the whole card open the details,
 * while the heart and map buttons sit above it (higher z-index) instead of being nested inside it.
 */
export default function SpotCard({ spot, saved, variant, explanation, onOpen, onToggleSave, onViewOnMap }: SpotCardProps) {
  const openOverlay = (
    <button aria-label={`View details for ${spot.name}`} className="absolute inset-0 z-[1] rounded-[inherit] outline-none" onClick={() => onOpen(spot)} type="button" />
  );
  const saveLabel = saved ? `Remove ${spot.name} from saved` : `Save ${spot.name}`;
  const mapButton = (className: string, label = "Map") =>
    onViewOnMap && (
      <button
        aria-label={`View ${spot.name} on the map`}
        className={`relative z-10 inline-flex items-center gap-1 rounded-full font-extrabold transition active:scale-95 ${className}`}
        onClick={() => onViewOnMap(spot)}
        type="button"
      >
        <Icon name="map" className="h-3 w-3" /> {label}
      </button>
    );

  if (variant === "featured") {
    return (
      <article className="relative overflow-hidden rounded-[26px] bg-[#20201f] shadow-[0_16px_34px_rgba(36,63,56,0.18)] transition-transform focus-within:ring-4 focus-within:ring-[#ff7048]/30 hover:-translate-y-0.5 active:scale-[0.99]">
        {openOverlay}
        <div className="relative h-[218px]">
          <SpotImage spot={spot} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/15 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#20201f] backdrop-blur">{spot.type}</span>
            <OpenBadge spot={spot} tone="light" />
          </div>
          <div className="absolute left-4 top-[52px] flex gap-1.5">
            {spot.communityTags.slice(0, 2).map((tag) => (
              <span className="rounded-full bg-[#20201f]/65 px-2.5 py-1 text-[9px] font-extrabold text-white backdrop-blur" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="absolute inset-x-4 bottom-4 text-white">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[23px] font-extrabold leading-tight tracking-[-0.04em]">{spot.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-white/75">
                  <Icon name="location" className="h-3.5 w-3.5" /> {spot.distance} · {spot.suburb}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1.5 text-[12px] font-extrabold backdrop-blur" aria-label={`Rated ${spot.rating} out of 5`}>
                <Icon name="star" filled className="h-3.5 w-3.5 text-[#ffc65c]" /> {spot.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <button
          aria-label={saveLabel}
          aria-pressed={saved}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition-transform hover:scale-110 active:scale-90 ${saved ? "bg-[#fff1eb] text-[#ff7048]" : "bg-white/90 text-[#20201f]"}`}
          onClick={() => onToggleSave(spot)}
          type="button"
        >
          <Icon name="heart" className="h-[18px] w-[18px]" filled={saved} />
        </button>
        <div className="grid grid-cols-3 divide-x divide-white/10 bg-[#20201f] px-2 py-4 text-center text-white">
          <div className="px-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">Hours</p>
            <p className={`mt-1 text-[11px] font-bold ${spot.isOpen ? "" : "text-[#f6b9d4]"}`}>{spot.openStatus.short}</p>
          </div>
          <div className="px-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">Vibe</p>
            <p className="mt-1 text-[11px] font-bold">{spot.vibe}</p>
          </div>
          <div className="px-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">Est. seats</p>
            <p className="mt-1 text-[11px] font-bold text-[#cdeaa6]">{seatsLabel(spot.availableSeats)}</p>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "recommended") {
    return (
      <article className="relative flex w-[236px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-[#20201f]/7 bg-white shadow-[0_10px_26px_rgba(35,38,48,0.08)] transition focus-within:ring-4 focus-within:ring-[#ff7048]/25 hover:-translate-y-0.5 active:scale-[0.99]">
        {openOverlay}
        <div className="relative h-[118px]">
          <SpotImage spot={spot} className="h-full w-full object-cover" />
          <span className="absolute left-2.5 top-2.5"><OpenBadge spot={spot} tone="light" /></span>
        </div>
        <button
          aria-label={saveLabel}
          aria-pressed={saved}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-transform hover:scale-110 active:scale-90 ${saved ? "bg-[#fff1eb] text-[#ff7048]" : "bg-white/90 text-[#20201f]"}`}
          onClick={() => onToggleSave(spot)}
          type="button"
        >
          <Icon name="heart" className="h-4 w-4" filled={saved} />
        </button>
        <div className="flex flex-1 flex-col p-3.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: spot.color }}>{spot.type} · {spot.suburb}</p>
          <h3 className="mt-0.5 truncate text-[15px] font-extrabold text-[#20201f]">{spot.name}</h3>
          {explanation && (
            <p className="mt-2 flex items-start gap-1.5 rounded-[12px] bg-[#fff3d6] px-2.5 py-2 text-[11px] font-bold leading-4 text-[#6b4a12]">
              <Icon name="check" className="mt-px h-3.5 w-3.5 shrink-0 text-[#e9532f]" /> {explanation}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3 text-[10px] font-bold text-[#817a87]">
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[#20201f]"><Icon name="star" className="h-3 w-3 text-[#e6a02f]" filled />{spot.rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span>{spot.distance}
            </span>
            {mapButton("bg-[#f1eee8] px-2.5 py-1 text-[10px] text-[#20201f] hover:bg-[#e7e2d9]")}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "saved") {
    return (
      <article className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_10px_28px_rgba(35,38,48,0.08)] transition-transform focus-within:ring-4 focus-within:ring-[#ff7048]/25 hover:-translate-y-0.5 active:scale-[0.99]">
        {openOverlay}
        <div className="relative h-44">
          <SpotImage spot={spot} className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3"><OpenBadge spot={spot} tone="light" /></span>
        </div>
        <button
          aria-label={saveLabel}
          aria-pressed={saved}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1eb] text-[#ff7048] transition-transform hover:scale-110 active:scale-90"
          onClick={() => onToggleSave(spot)}
          type="button"
        >
          <Icon name="heart" className="h-[18px] w-[18px]" filled={saved} />
        </button>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: spot.color }}>{spot.type}</p>
              <h2 className="mt-1 text-[18px] font-extrabold text-[#20201f]">{spot.name}</h2>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[12px] font-extrabold"><Icon name="star" className="h-3.5 w-3.5 text-[#e6a02f]" filled />{spot.rating.toFixed(1)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-[#7b7481]">{spot.distance} · {spot.vibe} · {spot.openStatus.short}</p>
            {mapButton("shrink-0 bg-[#f1eee8] px-2.5 py-1 text-[10px] text-[#20201f] hover:bg-[#e7e2d9]")}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {spot.communityTags.map((tag) => (
              <span className="rounded-full bg-[#fff1c6] px-2.5 py-1 text-[9px] font-extrabold text-[#8b5d17]" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="relative flex gap-3 rounded-[20px] border border-[#20201f]/7 bg-white p-2.5 shadow-[0_6px_20px_rgba(35,38,48,0.05)] transition focus-within:ring-4 focus-within:ring-[#ff7048]/20 hover:border-[#20201f]/15 hover:shadow-[0_10px_24px_rgba(35,38,48,0.09)] active:scale-[0.99]">
      {openOverlay}
      <SpotImage spot={spot} className="h-[92px] w-[96px] shrink-0 rounded-[15px] object-cover" />
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: spot.color }}>{spot.type}</p>
            <h3 className="mt-0.5 truncate text-[15px] font-extrabold text-[#20201f]">{spot.name}</h3>
          </div>
          <button
            aria-label={saveLabel}
            aria-pressed={saved}
            className={`relative z-10 -mr-0.5 -mt-0.5 rounded-full p-1.5 transition hover:bg-[#fff1eb] active:scale-90 ${saved ? "text-[#ff7048]" : "text-[#9a929e] hover:text-[#ff7048]"}`}
            onClick={() => onToggleSave(spot)}
            type="button"
          >
            <Icon name="heart" className="h-4 w-4" filled={saved} />
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-bold text-[#817a87]">
          <span className="flex items-center gap-1 text-[#20201f]"><Icon name="star" className="h-3 w-3 text-[#e6a02f]" filled />{spot.rating.toFixed(1)}</span>
          <span aria-hidden="true">·</span><span>{spot.distance}</span><span aria-hidden="true">·</span><span>{spot.vibe}</span>
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {spot.communityTags.slice(0, 2).map((tag) => (
            <span className="truncate rounded-full bg-[#f1eee8] px-2 py-0.5 text-[9px] font-extrabold text-[#746d72]" key={tag}>{tag}</span>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className={`truncate text-[10px] font-extrabold ${spot.isOpen ? "text-[#3e8a6e]" : "text-[#c2410c]"}`}>{spot.openStatus.label}</p>
          {mapButton("shrink-0 px-1.5 py-0.5 text-[10px] text-[#e9532f] hover:bg-[#fff1eb]")}
        </div>
      </div>
    </article>
  );
}
