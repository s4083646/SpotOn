import { useId, useState } from "react";
import { locationOptions } from "../data/spots";
import type { LocationOption } from "../types/spot";
import { GeolocationError, getCurrentPosition, isInMelbourne, type GeolocationFailure } from "../utils/geolocation";
import Icon from "./Icon";
import Sheet from "./Sheet";

export const CURRENT_LOCATION_ID = "current";

const errorMessages: Record<GeolocationFailure, string> = {
  unsupported: "Your browser doesn't support location. Pick an area below instead.",
  denied: "Location access is blocked. Allow it in your browser settings, or pick an area below.",
  unavailable: "We couldn't find your location. Please try again or pick an area below.",
};

type LocationModalProps = {
  currentId: string;
  onSelect: (location: LocationOption) => void;
  onClose: () => void;
};

export default function LocationModal({ currentId, onSelect, onClose }: LocationModalProps) {
  const titleId = useId();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useMyLocation = async () => {
    setLocating(true);
    setError(null);
    try {
      const position = await getCurrentPosition();
      if (!isInMelbourne(position)) {
        setError("Looks like you're outside Melbourne right now. Pick an area below to explore spots there.");
        return;
      }
      onSelect({ id: CURRENT_LOCATION_ID, label: "Your location", ...position });
    } catch (caught) {
      const reason = caught instanceof GeolocationError ? caught.reason : "unavailable";
      setError(errorMessages[reason]);
    } finally {
      setLocating(false);
    }
  };

  return (
    <Sheet labelledBy={titleId} onClose={onClose} className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]">Where are you studying?</p>
          <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#20201f]" id={titleId}>Choose an area</h2>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" onClick={onClose} aria-label="Close location picker" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>

      <button
        className={`mt-5 flex w-full items-center gap-3 rounded-[18px] border p-4 text-left transition active:scale-[0.99] disabled:cursor-wait ${
          currentId === CURRENT_LOCATION_ID ? "border-[#ff7048] bg-[#fff1c6]" : "border-[#20201f]/8 bg-white hover:border-[#20201f]/20"
        }`}
        data-autofocus
        disabled={locating}
        onClick={useMyLocation}
        type="button"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff7048] text-white">
          {locating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Icon name="crosshair" className="h-5 w-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-extrabold text-[#20201f]">{locating ? "Finding you…" : "Use my current location"}</span>
          <span className="mt-0.5 block text-[11px] text-[#817986]">Sort spots by real walking distance</span>
        </span>
        {currentId === CURRENT_LOCATION_ID && <Icon name="check" className="h-5 w-5 text-[#ff7048]" />}
      </button>

      {error && <p className="mt-2 rounded-[12px] bg-[#fff1eb] px-3 py-2 text-[11px] font-semibold leading-4 text-[#c5321c]" role="alert">{error}</p>}

      <p className="mb-2 mt-5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]">Melbourne areas</p>
      <ul className="overflow-hidden rounded-[18px] border border-[#20201f]/8 bg-white">
        {locationOptions.map((option, index) => {
          const selected = option.id === currentId;
          return (
            <li key={option.id}>
              <button
                aria-pressed={selected}
                className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-[13px] font-extrabold transition-colors hover:bg-[#fff8ec] ${index ? "border-t border-[#20201f]/7" : ""} ${selected ? "text-[#e9532f]" : "text-[#20201f]"}`}
                onClick={() => onSelect(option)}
                type="button"
              >
                <span className="flex items-center gap-2.5"><Icon name="location" className="h-4 w-4" filled={selected} />{option.label}</span>
                {selected && <Icon name="check" className="h-4 w-4" />}
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
