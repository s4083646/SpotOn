import Icon from "./Icon";

type SearchBarProps = {
  query: string;
  activeFilterCount: number;
  onQueryChange: (query: string) => void;
  onOpenFilters: () => void;
};

export default function SearchBar({ query, activeFilterCount, onQueryChange, onOpenFilters }: SearchBarProps) {
  return (
    <div className="mt-5 flex h-14 items-center gap-3 rounded-[18px] border border-[#20201f]/8 bg-white px-4 shadow-[0_8px_28px_rgba(66,50,40,0.07)] transition focus-within:border-[#ff7048]/60 focus-within:ring-2 focus-within:ring-[#ff7048]/15">
      <Icon name="search" className="h-5 w-5 shrink-0 text-[#716b7a]" />
      <input
        aria-label="Search study spots"
        className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#20201f] outline-none placeholder:font-medium placeholder:text-[#a2958b] [&::-webkit-search-cancel-button]:hidden"
        enterKeyHint="search"
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onQueryChange("")}
        placeholder="Library, café, or a quiet corner..."
        type="search"
        value={query}
      />
      {query && (
        <button
          className="rounded-full p-1.5 text-[#827c89] transition-colors hover:bg-[#f1eee8] hover:text-[#20201f]"
          onClick={() => onQueryChange("")}
          aria-label="Clear search"
          type="button"
        >
          <Icon name="x" className="h-4 w-4" />
        </button>
      )}
      <button
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff7048] text-white transition hover:bg-[#f45f36] active:scale-95"
        onClick={onOpenFilters}
        aria-haspopup="dialog"
        aria-label={activeFilterCount ? `Search filters, ${activeFilterCount} active` : "Search filters"}
        type="button"
      >
        <Icon name="filter" className="h-4 w-4" />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#20201f] px-1 text-[8px] font-extrabold">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
