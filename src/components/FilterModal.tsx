import { useId } from "react";
import type { SpotFilters } from "../types/spot";
import { countSheetFilters } from "../utils/spots";
import Icon from "./Icon";
import Sheet from "./Sheet";
import { OptionCard } from "./Toggle";

type FilterModalProps = {
  filters: SpotFilters;
  resultCount: number;
  onChange: (patch: Partial<SpotFilters>) => void;
  onReset: () => void;
  onClose: () => void;
};

export default function FilterModal({ filters, resultCount, onChange, onReset, onClose }: FilterModalProps) {
  const titleId = useId();
  const activeCount = countSheetFilters(filters);

  return (
    <Sheet labelledBy={titleId} onClose={onClose} className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]">Refine results</p>
          <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#20201f]" id={titleId}>Find your ideal spot</h2>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" data-autofocus onClick={onClose} aria-label="Close filters" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-5 space-y-2.5">
        <OptionCard checked={filters.quietOnly} description="Show silent and quiet spaces only" label="Quiet only" onChange={(quietOnly) => onChange({ quietOnly })} />
        <OptionCard checked={filters.openNow} description="Hide spaces that are currently closed" label="Open now" onChange={(openNow) => onChange({ openNow })} />
        <OptionCard checked={filters.charging} description="Somewhere to plug in your laptop" label="Charging available" onChange={(charging) => onChange({ charging })} />
        <OptionCard checked={filters.groupFriendly} description="Room to study with friends" label="Good for groups" onChange={(groupFriendly) => onChange({ groupFriendly })} />
      </div>
      <div className="mt-5 grid grid-cols-[auto_1fr] gap-2">
        <button
          className="rounded-[16px] border border-[#20201f]/10 bg-white px-5 py-4 text-[12px] font-extrabold text-[#20201f] transition hover:bg-[#f8f4ee] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={activeCount === 0}
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
        <button className="rounded-[16px] bg-[#20201f] py-4 text-[13px] font-extrabold text-white transition hover:bg-[#383836] active:scale-[0.98]" onClick={onClose} type="button">
          {resultCount === 0 ? "No spots match" : `Show ${resultCount} ${resultCount === 1 ? "spot" : "spots"}`}
        </button>
      </div>
    </Sheet>
  );
}
