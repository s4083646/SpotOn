import { useNow } from "../hooks/useNow";
import type { ActiveSession } from "../types/user";
import { formatTimer } from "../utils/user";

type SessionBarProps = {
  session: ActiveSession;
  spotName: string;
  onEnd: () => void;
};

/** Running study-session timer. Ticks every second on its own so the rest of the app doesn't re-render. */
export default function SessionBar({ session, spotName, onEnd }: SessionBarProps) {
  const now = useNow(1000);
  const elapsed = now.getTime() - new Date(session.startedAt).getTime();

  return (
    <div className="px-5 pb-1 pt-1">
      <div className="flex items-center gap-3 rounded-[18px] bg-[#20201f] py-2.5 pl-3 pr-2.5 text-white shadow-[0_10px_24px_rgba(32,32,31,0.2)]" role="status">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7bc96f] opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7bc96f]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-white/50">Studying at</span>
          <span className="block truncate text-[12px] font-extrabold">{spotName}</span>
        </span>
        <span className="font-mono text-[13px] font-bold tabular-nums" aria-label="Elapsed time">{formatTimer(elapsed)}</span>
        <button className="rounded-full bg-[#f8d66d] px-3.5 py-2 text-[11px] font-extrabold text-[#20201f] transition hover:bg-[#f4cc4f] active:scale-95" onClick={onEnd} type="button">
          End
        </button>
      </div>
    </div>
  );
}
