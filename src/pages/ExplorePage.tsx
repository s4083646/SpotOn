import { useRef } from "react";
import EmptyState from "../components/EmptyState";
import Icon, { type IconName } from "../components/Icon";
import SearchBar from "../components/SearchBar";
import SpotCard from "../components/SpotCard";
import StudyCircleCard from "../components/StudyCircleCard";
import TrendingSpots from "../components/TrendingSpots";
import type { Review } from "../types/community";
import type { Category, SpotFilters, SpotWithStatus } from "../types/spot";
import type { StudyProfile, User } from "../types/user";
import type { Recommendation } from "../utils/recommendations";
import { countSheetFilters, hasActiveFilters } from "../utils/spots";

const categories: { label: Category; icon: IconName }[] = [
  { label: "All spots", icon: "home" },
  { label: "Quiet", icon: "bookmark" },
  { label: "Cafés", icon: "coffee" },
  { label: "Wi-Fi", icon: "wifi" },
];

export type CommunitySummary = {
  recentReviews: Review[];
  totalRatings: number;
  vibeUpdates: number;
  topSpot: SpotWithStatus | null;
  trending: SpotWithStatus[];
};

type ExplorePageProps = {
  community: CommunitySummary;
  user: User | null;
  studyProfile: StudyProfile | null;
  filters: SpotFilters;
  results: SpotWithStatus[];
  recommendations: Recommendation[];
  savedIds: number[];
  showReminder: boolean;
  onFiltersChange: (patch: Partial<SpotFilters>) => void;
  onResetFilters: () => void;
  onOpenFilters: () => void;
  onOpenSpot: (spot: SpotWithStatus) => void;
  onToggleSave: (spot: SpotWithStatus) => void;
  onViewOnMap: (spot: SpotWithStatus) => void;
  onGetPersonalised: () => void;
  onEditProfile: () => void;
  onDismissReminder: () => void;
};

export default function ExplorePage({
  community,
  user,
  studyProfile,
  filters,
  results,
  recommendations,
  savedIds,
  showReminder,
  onFiltersChange,
  onResetFilters,
  onOpenFilters,
  onOpenSpot,
  onToggleSave,
  onViewOnMap,
  onGetPersonalised,
  onEditProfile,
  onDismissReminder,
}: ExplorePageProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const filtering = hasActiveFilters(filters);
  const [featured, ...rest] = results;
  const cardProps = { onOpen: onOpenSpot, onToggleSave, onViewOnMap };

  return (
    <>
      <section className="px-5 pt-3">
        <p className="text-[13px] font-bold text-[#7d7168]">{user ? `Hey ${user.firstName}, ready to focus?` : "Ready to find your next study spot?"}</p>
        <h1 className="mt-1 text-[32px] font-extrabold leading-[1.08] tracking-[-0.05em] text-[#20201f]">Let’s find your happy study spot.</h1>
        <SearchBar activeFilterCount={countSheetFilters(filters)} onOpenFilters={onOpenFilters} onQueryChange={(query) => onFiltersChange({ query })} query={filters.query} />
      </section>

      <section className="pt-5" aria-label="Categories">
        <div className="flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => {
            const active = item.label === filters.category;
            return (
              <button
                aria-pressed={active}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[12px] font-extrabold transition active:scale-95 ${
                  active ? "bg-[#f8d66d] text-[#20201f] shadow-md" : "border border-[#20201f]/8 bg-white text-[#6f665f] hover:border-[#20201f]/20 hover:text-[#20201f]"
                }`}
                key={item.label}
                onClick={() => onFiltersChange({ category: item.label })}
                type="button"
              >
                <Icon name={item.icon} className="h-3.5 w-3.5" /> {item.label}
              </button>
            );
          })}
        </div>
      </section>

      {showReminder && (
        <section className="px-5 pt-4">
          <div className="flex items-center gap-3 rounded-[20px] bg-[#afc5f1] p-4 text-[#20201f]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70"><Icon name="bell" className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold">Daily focus nudge</p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#20201f]/65">No study session yet today. Pick a spot and tap “Study here” to start.</p>
            </div>
            <button aria-label="Dismiss today's reminder" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-white/50" onClick={onDismissReminder} type="button">
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {!filtering && (
        <section className="pt-6" aria-labelledby="picked-heading">
          {studyProfile && recommendations.length > 0 ? (
            <>
              <div className="mb-3 flex items-end justify-between px-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff7048]">Your best study matches</p>
                  <h2 className="mt-0.5 text-[20px] font-extrabold tracking-[-0.035em] text-[#20201f]" id="picked-heading">Picked for you</h2>
                </div>
                <button className="rounded-full px-2 py-1 text-[12px] font-extrabold text-[#e9532f] transition hover:bg-[#fff1eb]" onClick={onEditProfile} type="button">Tune picks</button>
              </div>
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {recommendations.map(({ spot, explanation }) => (
                  <SpotCard explanation={explanation} key={spot.id} saved={savedIds.includes(spot.id)} spot={spot} variant="recommended" {...cardProps} />
                ))}
              </div>
              <p className="px-5 text-[10px] font-semibold text-[#9a9198]">Based on the study preferences in your profile.</p>
            </>
          ) : (
            <div className="px-5">
              <button
                className="flex w-full items-center gap-3 rounded-[22px] border border-dashed border-[#ff7048]/40 bg-[#fff3d6] p-4 text-left transition hover:bg-[#ffecc0] active:scale-[0.99]"
                onClick={user ? onEditProfile : onGetPersonalised}
                type="button"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff7048] text-white"><Icon name="star" className="h-5 w-5" filled /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-extrabold text-[#20201f]" id="picked-heading">{user ? "Set up your study profile" : "Get spots picked for you"}</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7d7168]">
                    {user ? "Tell us how you like to study and we'll match you with the best spots." : "Create a free profile and we'll match spots to how you like to study."}
                  </span>
                </span>
                <Icon name="chevron" className="h-4 w-4 shrink-0 text-[#e9532f]" />
              </button>
            </div>
          )}
        </section>
      )}

      <section className="px-5 pb-32 pt-6" aria-labelledby="results-heading">
        {!filtering && (
          <StudyCircleCard
            onOpenSpot={onOpenSpot}
            recentReviews={community.recentReviews}
            topSpot={community.topSpot}
            totalRatings={community.totalRatings}
            vibeUpdates={community.vibeUpdates}
          />
        )}
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff7048]">{filtering ? "Your results" : "We think you’ll love this"}</p>
            <h2 className="mt-0.5 text-[20px] font-extrabold tracking-[-0.035em] text-[#20201f]" id="results-heading">
              {filtering ? `${results.length} ${results.length === 1 ? "spot matches" : "spots match"}` : "A lovely spot nearby"}
            </h2>
          </div>
          {filtering ? (
            <button className="shrink-0 rounded-full px-2 py-1 text-[12px] font-extrabold text-[#e9532f] transition hover:bg-[#fff1eb]" onClick={onResetFilters} type="button">Clear filters</button>
          ) : (
            rest.length > 0 && (
              <button className="shrink-0 rounded-full px-2 py-1 text-[12px] font-extrabold text-[#e9532f] transition hover:bg-[#fff1eb]" onClick={() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} type="button">
                See all
              </button>
            )
          )}
        </div>

        {featured ? (
          <>
            <SpotCard saved={savedIds.includes(featured.id)} spot={featured} variant="featured" {...cardProps} />
            {!filtering && community.trending.length > 0 && <TrendingSpots onOpenSpot={onOpenSpot} spots={community.trending} />}
            {rest.length > 0 && (
              <div className="mt-7 scroll-mt-4" ref={listRef}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#20201f]">{filtering ? "More matches" : "More Melbourne favourites"}</h2>
                  <span className="text-[11px] font-bold text-[#8a8391]">{rest.length} {rest.length === 1 ? "place" : "places"}</span>
                </div>
                <div className="space-y-3">
                  {rest.map((spot) => (
                    <SpotCard key={spot.id} saved={savedIds.includes(spot.id)} spot={spot} variant="compact" {...cardProps} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            action={
              <button className="rounded-full bg-[#20201f] px-5 py-3 text-[12px] font-extrabold text-white transition hover:bg-[#383836] active:scale-95" onClick={onResetFilters} type="button">
                Clear search & filters
              </button>
            }
            icon="search"
            message={filters.query ? `Nothing matches “${filters.query.trim()}” with your current filters. Try another word or loosen a filter.` : "No spots match all of these filters. Try turning one off."}
            title="No spots found"
          />
        )}
      </section>
    </>
  );
}
