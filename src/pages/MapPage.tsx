import { useCallback, useState } from "react";
import Icon from "../components/Icon";
import MapSpotPreview from "../components/MapSpotPreview";
import MapView, { type MapFocus, type MapViewState } from "../components/MapView";
import type { Category, Coordinates, SpotFilters, SpotWithStatus } from "../types/spot";
import { countSheetFilters } from "../utils/spots";

type Chip = { label: string; active: boolean; toggle: () => void };

type MapPageProps = {
  spots: SpotWithStatus[];
  filters: SpotFilters;
  savedIds: number[];
  selectedId: number | null;
  userPosition: Coordinates | null;
  initialView: MapViewState;
  focus: MapFocus | null;
  locating: boolean;
  matchReasons: Map<number, string>;
  onSelect: (spotId: number | null) => void;
  onViewChange: (view: MapViewState) => void;
  onLocate: () => void;
  onBackToMelbourne: () => void;
  onFiltersChange: (patch: Partial<SpotFilters>) => void;
  onOpenFilters: () => void;
  onOpenSpot: (spot: SpotWithStatus) => void;
  onToggleSave: (spot: SpotWithStatus) => void;
};

export default function MapPage({
  spots,
  filters,
  savedIds,
  selectedId,
  userPosition,
  initialView,
  focus,
  locating,
  matchReasons,
  onSelect,
  onViewChange,
  onLocate,
  onBackToMelbourne,
  onFiltersChange,
  onOpenFilters,
  onOpenSpot,
  onToggleSave,
}: MapPageProps) {
  const [visibleIds, setVisibleIds] = useState<number[] | null>(null);
  const selected = spots.find((spot) => spot.id === selectedId) ?? null;
  const visibleCount = visibleIds?.length ?? spots.length;
  const openCount = spots.filter((spot) => spot.isOpen && (visibleIds?.includes(spot.id) ?? true)).length;
  const activeFilters = countSheetFilters(filters);

  const handleViewChange = useCallback(
    (view: MapViewState, ids: number[]) => {
      setVisibleIds(ids);
      onViewChange(view);
    },
    [onViewChange],
  );

  const category = (label: Category): Chip => ({
    label,
    active: filters.category === label,
    toggle: () => onFiltersChange({ category: filters.category === label ? "All spots" : label }),
  });
  const chips: Chip[] = [
    { label: "Open now", active: filters.openNow, toggle: () => onFiltersChange({ openNow: !filters.openNow }) },
    category("Quiet"),
    category("Cafés"),
    category("Wi-Fi"),
  ];

  return (
    <section aria-label="Study spot map" className="relative min-h-[420px] flex-1 overflow-hidden border-t border-[#20201f]/8 bg-[#ece6da]">
      <MapView
        focus={focus}
        initialView={initialView}
        locating={locating}
        onLocate={onLocate}
        onSelect={onSelect}
        onViewChange={handleViewChange}
        selectedId={selectedId}
        spots={spots}
        userPosition={userPosition}
      />

      {/* Floating filter chips and result count. pointer-events-none lets the map stay draggable between controls. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#fffdf8]/90 via-[#fffdf8]/50 to-transparent pb-6 pt-3">
        <div className="pointer-events-auto flex gap-2 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            aria-label={activeFilters ? `Filters, ${activeFilters} active` : "Filters"}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-extrabold shadow-[0_4px_14px_rgba(32,32,31,0.12)] transition active:scale-95 ${activeFilters ? "bg-[#ff7048] text-white" : "bg-white text-[#20201f] hover:bg-[#fff8ec]"}`}
            onClick={onOpenFilters}
            type="button"
          >
            <Icon name="filter" className="h-4 w-4" /> Filters{activeFilters > 0 && ` · ${activeFilters}`}
          </button>
          {chips.map((chip) => (
            <button
              aria-pressed={chip.active}
              className={`h-10 shrink-0 rounded-full px-4 text-[12px] font-extrabold shadow-[0_4px_14px_rgba(32,32,31,0.12)] transition active:scale-95 ${chip.active ? "bg-[#f8d66d] text-[#20201f]" : "bg-white text-[#6f665f] hover:text-[#20201f]"}`}
              key={chip.label}
              onClick={chip.toggle}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 px-3">
          <p aria-live="polite" className="rounded-full bg-[#20201f] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-md">
            {visibleCount} {visibleCount === 1 ? "spot" : "spots"} in this area
            <span className="font-semibold text-white/60"> · {openCount} open</span>
          </p>
          {filters.query && (
            <button
              className="pointer-events-auto flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#20201f] shadow-md transition hover:bg-[#fff8ec]"
              onClick={() => onFiltersChange({ query: "" })}
              type="button"
            >
              “{filters.query.trim()}” <Icon name="x" className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+76px)] z-10 sm:bottom-[88px]">
        {selected ? (
          <div className="pointer-events-auto">
            <MapSpotPreview
              key={selected.id}
              matchReason={matchReasons.get(selected.id) ?? null}
              onClose={() => onSelect(null)}
              onToggleSave={onToggleSave}
              onViewDetails={onOpenSpot}
              saved={savedIds.includes(selected.id)}
              spot={selected}
            />
          </div>
        ) : visibleCount === 0 ? (
          <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-[20px] bg-[#20201f]/94 p-4 text-white shadow-xl backdrop-blur">
            <div>
              <p className="text-[13px] font-extrabold">No study spots in view</p>
              <p className="mt-0.5 text-[11px] text-white/65">{spots.length ? "Zoom out or head back to the city." : "Try loosening your filters."}</p>
            </div>
            <button className="shrink-0 rounded-full bg-[#f8d66d] px-3.5 py-2 text-[11px] font-extrabold text-[#20201f] transition hover:bg-[#f4cc4f] active:scale-95" onClick={onBackToMelbourne} type="button">
              Back to Melbourne
            </button>
          </div>
        ) : (
          <p className="mx-auto w-fit rounded-full bg-[#20201f]/90 px-4 py-2 text-[11px] font-bold text-white shadow-lg backdrop-blur">Tap a pin to preview a spot</p>
        )}
      </div>
    </section>
  );
}
