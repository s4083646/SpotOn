import { useId } from "react";
import type { SpotVibe } from "../hooks/useCommunity";
import type { Review } from "../types/community";
import type { SpotWithStatus } from "../types/spot";
import { chargingLabels, dayNames, directionsUrl, formatTime, getSpotLocalTime, hasLongHours, wifiLabels } from "../utils/spots";
import Icon, { type IconName } from "./Icon";
import LiveVibeCard from "./LiveVibeCard";
import Sheet from "./Sheet";
import SpotImage from "./SpotImage";
import SpotReviews from "./SpotReviews";

type SpotDetailsProps = {
  spot: SpotWithStatus;
  saved: boolean;
  now: Date;
  /** Spot of the user's running study session, if any. */
  activeSessionSpotId: number | null;
  /** Personalised reason this spot suits the user, if they have a study profile. */
  matchReason: string | null;
  vibe: SpotVibe;
  reviews: Review[];
  helpfulIds: string[];
  currentUserId: string | null;
  onClose: () => void;
  onToggleSave: (spot: SpotWithStatus) => void;
  onCheckIn: (spot: SpotWithStatus) => void;
  onViewOnMap: (spot: SpotWithStatus) => void;
  onUpdateVibe: (spot: SpotWithStatus) => void;
  onWriteReview: (spot: SpotWithStatus) => void;
  onToggleHelpful: (review: Review) => void;
};

type Amenity = { icon: IconName; label: string; available: boolean };

export default function SpotDetails({
  spot,
  saved,
  now,
  activeSessionSpotId,
  matchReason,
  vibe,
  reviews,
  helpfulIds,
  currentUserId,
  onClose,
  onToggleSave,
  onCheckIn,
  onViewOnMap,
  onUpdateVibe,
  onWriteReview,
  onToggleHelpful,
}: SpotDetailsProps) {
  const titleId = useId();
  const today = getSpotLocalTime(now).day;
  const todayHours = spot.openingHours[today];
  const studyingHere = activeSessionSpotId === spot.id;

  const amenities: Amenity[] = [
    { icon: "wifi", label: spot.wifiQuality === "none" ? "No Wi-Fi" : `${wifiLabels[spot.wifiQuality]} Wi-Fi`, available: spot.wifiQuality !== "none" },
    { icon: "bolt", label: chargingLabels[spot.chargingAvailability], available: spot.chargingAvailability !== "none" },
    { icon: "coffee", label: spot.foodAvailable ? "Food & drinks" : "No food on site", available: spot.foodAvailable },
    { icon: "users", label: spot.groupStudySuitable ? "Group friendly" : "Best for solo study", available: spot.groupStudySuitable },
    { icon: "clock", label: spot.longStayFriendly ? "Good for long stays" : "Better for short visits", available: spot.longStayFriendly },
    ...(hasLongHours(spot) ? [{ icon: "star" as IconName, label: "Open late", available: true }] : []),
  ];

  return (
    <Sheet labelledBy={titleId} onClose={onClose}>
      <div className="relative h-52 shrink-0 overflow-hidden rounded-t-[28px] bg-[#20201f]">
        <SpotImage spot={spot} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20201f]/65 to-transparent" />
        <button
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#20201f] shadow-md backdrop-blur transition-transform hover:scale-105 active:scale-95"
          data-autofocus
          onClick={onClose}
          aria-label="Close spot details"
          type="button"
        >
          <Icon name="x" className="h-[18px] w-[18px]" />
        </button>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
          <span className="rounded-full bg-[#f8d66d] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#20201f]">{spot.type}</span>
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-[#20201f]">{spot.vibe}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[24px] font-extrabold leading-tight tracking-[-0.04em] text-[#20201f]" id={titleId}>{spot.name}</h2>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold text-[#766f72]">
              <span className="flex items-center gap-1 text-[#20201f]"><Icon name="star" className="h-3.5 w-3.5 text-[#e5a52e]" filled />{spot.rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span><span>{spot.reviewCount} reviews</span>
              <span aria-hidden="true">·</span><span>{spot.distance}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-extrabold ${spot.isOpen ? (spot.openStatus.closingSoon ? "text-[#b7791f]" : "text-[#3e8a6e]") : "text-[#c2410c]"}`}>{spot.openStatus.label}</span>
            </p>
          </div>
          <button
            aria-label={saved ? `Remove ${spot.name} from saved` : `Save ${spot.name}`}
            aria-pressed={saved}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-90 ${saved ? "bg-[#ffe2d8] text-[#ff7048]" : "bg-[#f1eee8] text-[#20201f]"}`}
            onClick={() => onToggleSave(spot)}
            type="button"
          >
            <Icon name="heart" className="h-5 w-5" filled={saved} />
          </button>
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[12px] font-semibold leading-5 text-[#5f5862]">
          <Icon name="location" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e9532f]" /> {spot.address}
        </p>

        {matchReason && (
          <p className="mt-3 flex items-start gap-1.5 rounded-[14px] bg-[#fff3d6] px-3 py-2.5 text-[11px] font-bold leading-4 text-[#6b4a12]">
            <Icon name="check" className="mt-px h-3.5 w-3.5 shrink-0 text-[#e9532f]" /> {matchReason}
          </p>
        )}

        <LiveVibeCard now={now} onUpdate={() => onUpdateVibe(spot)} vibe={vibe} />

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Amenities">
          {amenities.map((amenity) => (
            <li
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${amenity.available ? "bg-[#eef6e6] text-[#2f6b2c]" : "bg-[#f1eee8] text-[#8a8283] line-through decoration-[#8a8283]/40"}`}
              key={amenity.label}
            >
              <Icon name={amenity.icon} className="h-3 w-3" /> {amenity.label}
            </li>
          ))}
        </ul>

        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="What students say">
          {spot.communityTags.map((tag) => (
            <li className="rounded-full bg-[#f1eee8] px-2.5 py-1.5 text-[10px] font-extrabold text-[#746d72]" key={tag}>{tag}</li>
          ))}
        </ul>

        <p className="mt-4 text-[12px] leading-5 text-[#716a6d]">{spot.description}</p>

        <p className="mt-3 flex items-start gap-2 rounded-[16px] bg-[#fff1c6] px-3.5 py-3 text-[11px] font-bold leading-4 text-[#7b541e]">
          <span aria-hidden="true">💡</span>
          <span><span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9a5c20]">Student tip</span>{spot.bestTimeTip}</span>
        </p>

        <details className="group mt-4 rounded-[16px] border border-[#20201f]/8 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-[16px] px-4 py-3 text-[12px] font-extrabold text-[#20201f] transition-colors hover:bg-[#fff8ec] [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4 text-[#8b5d17]" /> Opening hours</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#817986]">
              Today: {todayHours ? `${formatTime(todayHours.open)} – ${formatTime(todayHours.close)}` : "Closed"}
              <Icon name="chevron" className="h-3.5 w-3.5 rotate-90 transition-transform group-open:-rotate-90" />
            </span>
          </summary>
          <ul className="space-y-1 border-t border-[#20201f]/7 px-4 py-3">
            {dayNames.map((name, index) => {
              const dayHours = spot.openingHours[index];
              return (
                <li className={`flex justify-between text-[11px] ${index === today ? "font-extrabold text-[#20201f]" : "font-semibold text-[#716a6d]"}`} key={name}>
                  <span>{name}</span>
                  <span>{dayHours ? `${formatTime(dayHours.open)} – ${formatTime(dayHours.close)}` : "Closed"}</span>
                </li>
              );
            })}
          </ul>
          <p className="px-4 pb-3 text-[10px] text-[#9a9198]">Approximate hours. Check with the venue before you go.</p>
        </details>

        <SpotReviews
          currentUserId={currentUserId}
          helpfulIds={helpfulIds}
          now={now}
          onToggleHelpful={onToggleHelpful}
          onWriteReview={() => onWriteReview(spot)}
          rating={spot.rating}
          reviewCount={spot.reviewCount}
          reviews={reviews}
        />

        <button
          className="mt-5 flex w-full items-center justify-between rounded-[16px] bg-[#f8d66d] px-4 py-3.5 text-left text-[#20201f] shadow-[0_8px_20px_rgba(229,165,46,0.2)] transition hover:bg-[#f4cc4f] active:scale-[0.98]"
          onClick={() => onCheckIn(spot)}
          type="button"
        >
          <span>
            <span className="block text-[13px] font-extrabold">{studyingHere ? "Studying here now" : "Check in & log study time"}</span>
            <span className="mt-0.5 block text-[11px] font-semibold text-[#20201f]/60">{studyingHere ? "Your live timer is running" : "Earn XP for focusing here"}</span>
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-extrabold">{studyingHere ? "⏱" : "+ XP"}</span>
        </button>

        <a
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#20201f] py-4 text-[13px] font-extrabold text-white transition hover:bg-[#383836] active:scale-[0.98]"
          href={directionsUrl(spot)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="navigation" className="h-[17px] w-[17px]" /> Get directions
        </a>
        <button
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[16px] border border-[#20201f]/10 bg-white py-3.5 text-[12px] font-extrabold text-[#20201f] transition hover:bg-[#f8f4ee] active:scale-[0.98]"
          onClick={() => onViewOnMap(spot)}
          type="button"
        >
          <Icon name="map" className="h-4 w-4" /> View on map
        </button>
      </div>
    </Sheet>
  );
}
