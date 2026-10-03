import Icon, { type IconName } from "./Icon";

export type Tab = "Explore" | "Map" | "Saved" | "Profile";

const items: { label: Tab; icon: IconName }[] = [
  { label: "Explore", icon: "home" },
  { label: "Map", icon: "map" },
  { label: "Saved", icon: "heart" },
  { label: "Profile", icon: "user" },
];

type BottomNavProps = {
  tab: Tab;
  savedCount: number;
  onChange: (tab: Tab) => void;
};

export default function BottomNav({ tab, savedCount, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-20 grid w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 grid-cols-4 rounded-[22px] border border-[#20201f]/10 bg-white/95 p-2 text-[#20201f] shadow-[0_18px_38px_rgba(63,47,35,0.18)] backdrop-blur" aria-label="App navigation">
      {items.map((item) => {
        const active = tab === item.label;
        return (
          <button
            aria-current={active ? "page" : undefined}
            className={`relative flex h-12 flex-col items-center justify-center gap-1 rounded-[15px] text-[9px] font-bold transition-colors active:scale-95 ${active ? "bg-[#f8d66d] text-[#20201f]" : "text-[#20201f]/45 hover:bg-[#20201f]/5 hover:text-[#20201f]/75"}`}
            key={item.label}
            onClick={() => onChange(item.label)}
            type="button"
          >
            <Icon name={item.icon} className="h-[18px] w-[18px]" filled={item.label === "Saved" && savedCount > 0} />
            {item.label}
            {item.label === "Saved" && savedCount > 0 && (
              <span className="absolute right-[20%] top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#ff7048] px-1 text-[8px] text-white" aria-label={`${savedCount} saved`}>
                {savedCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
