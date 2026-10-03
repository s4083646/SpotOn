import type { SpotVibe } from "../hooks/useCommunity";
import { timeAgo } from "../utils/user";

type LiveVibeCardProps = {
  vibe: SpotVibe;
  now: Date;
  onUpdate: () => void;
};

/** The latest student-reported conditions (noise, seating, Wi-Fi, power) for a spot. */
export default function LiveVibeCard({ vibe, now, onUpdate }: LiveVibeCardProps) {
  const isSample = vibe.updatedAt === null;
  const items = [
    ["🔇", vibe.noise, "Noise"],
    ["🪑", `${vibe.seating} seats`, "Seating"],
    ["📶", `Wi-Fi ${vibe.wifi.toLowerCase()}`, "Wi-Fi"],
    ["🔌", `Power ${vibe.power.toLowerCase()}`, "Power"],
  ];

  return (
    <section aria-labelledby="live-vibe-heading" className="mt-4 rounded-[22px] bg-[#afc5f1]/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#42649c]">{isSample ? "Typical conditions" : "Shared by students"}</p>
          <h3 className="mt-1 text-[17px] font-extrabold text-[#20201f]" id="live-vibe-heading">Live Vibe</h3>
        </div>
        <button className="rounded-full bg-white/80 px-3 py-2 text-[11px] font-extrabold text-[#42649c] transition hover:bg-white active:scale-95" onClick={onUpdate} type="button">
          Update vibe
        </button>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {items.map(([symbol, value, label]) => (
          <li className="flex items-center gap-2 rounded-[13px] bg-white/65 px-2.5 py-2" key={label}>
            <span aria-hidden="true" className="text-[14px]">{symbol}</span>
            <span className="text-[11px] font-extrabold text-[#20201f]"><span className="sr-only">{label}: </span>{value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] font-semibold text-[#52627d]">
        {isSample ? "Sample data. Be the first to share how it feels right now." : `Updated ${timeAgo(vibe.updatedAt ?? "", now).toLowerCase()} by ${vibe.byYou ? "you" : "a student"}`}
      </p>
    </section>
  );
}
