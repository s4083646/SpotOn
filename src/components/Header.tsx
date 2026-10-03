import type { User } from "../types/user";
import Avatar from "./Avatar";
import Icon from "./Icon";

type HeaderProps = {
  locationLabel: string;
  user: User | null;
  onChangeLocation: () => void;
  onOpenProfile: () => void;
};

export default function Header({ locationLabel, user, onChangeLocation, onOpenProfile }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
      <button
        aria-haspopup="dialog"
        className="group -m-1.5 flex min-w-0 items-center gap-2 rounded-2xl p-1.5 text-left transition-colors hover:bg-[#fff3dc] active:scale-[0.98]"
        onClick={onChangeLocation}
        type="button"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe6a7] text-[#e9532f]">
          <Icon name="location" className="h-[18px] w-[18px]" filled />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#8d7e73]">Finding spots around</span>
          <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#20201f]">
            <span className="truncate">{locationLabel}</span>
            <Icon name="chevron" className="h-3.5 w-3.5 shrink-0 rotate-90 transition-transform group-hover:translate-y-0.5" />
          </span>
        </span>
      </button>
      <button
        aria-label={user ? "View your profile" : "Log in to view your profile"}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#20201f]/10 bg-[#f6b9d4] text-[#20201f] shadow-sm transition-transform hover:scale-105 active:scale-95"
        onClick={onOpenProfile}
        type="button"
      >
        {user ? <Avatar user={user} size="sm" /> : <Icon name="user" className="h-[18px] w-[18px]" />}
        {!user && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#fffdf8] bg-[#ff7048]" />}
      </button>
    </header>
  );
}
