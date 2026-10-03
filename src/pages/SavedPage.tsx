import EmptyState from "../components/EmptyState";
import SpotCard from "../components/SpotCard";
import type { SpotWithStatus } from "../types/spot";

type SavedPageProps = {
  spots: SpotWithStatus[];
  onOpenSpot: (spot: SpotWithStatus) => void;
  onToggleSave: (spot: SpotWithStatus) => void;
  onViewOnMap: (spot: SpotWithStatus) => void;
  onExplore: () => void;
};

export default function SavedPage({ spots, onOpenSpot, onToggleSave, onViewOnMap, onExplore }: SavedPageProps) {
  return (
    <section className="px-5 pb-32 pt-4">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]">Your collection</p>
      <h1 className="mt-1 text-[30px] font-extrabold tracking-[-0.05em] text-[#20201f]">Saved spots</h1>
      <p className="mt-2 text-[13px] leading-5 text-[#77707e]">
        {spots.length} {spots.length === 1 ? "place" : "places"} ready for your next focus session.
      </p>
      {spots.length ? (
        <div className="mt-6 space-y-4">
          {spots.map((spot) => (
            <SpotCard key={spot.id} onOpen={onOpenSpot} onToggleSave={onToggleSave} onViewOnMap={onViewOnMap} saved spot={spot} variant="saved" />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            action={
              <button className="rounded-full bg-[#20201f] px-5 py-3 text-[12px] font-extrabold text-white transition hover:bg-[#383836] active:scale-95" onClick={onExplore} type="button">
                Explore spots
              </button>
            }
            icon="heart"
            message="Tap the heart on any study spot to keep it here for later."
            title="Nothing saved yet"
          />
        </div>
      )}
    </section>
  );
}
