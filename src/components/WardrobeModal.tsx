import { useId } from "react";
import { cosmetics } from "../data/community";
import Icon from "./Icon";
import Sheet from "./Sheet";
import StudyBuddy, { CosmeticPreview } from "./StudyBuddy";

type WardrobeModalProps = {
  xpBalance: number;
  owned: string[];
  equipped: string[];
  onSelect: (id: string, cost: number) => void;
  onClose: () => void;
};

export default function WardrobeModal({ xpBalance, owned, equipped, onSelect, onClose }: WardrobeModalProps) {
  const titleId = useId();

  return (
    <Sheet className="p-5" labelledBy={titleId} onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ff7048]">Buddy wardrobe</p>
          <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.04em] text-[#20201f]" id={titleId}>Choose their look</h2>
        </div>
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" data-autofocus onClick={onClose} aria-label="Close wardrobe" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
      <div className="relative mt-4 flex min-h-44 items-center justify-center overflow-hidden rounded-[24px] bg-[#afc5f1]">
        <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/25" />
        <div className="absolute -bottom-12 -right-6 h-36 w-36 rounded-full bg-[#f6b9d4]/45" />
        <StudyBuddy className="relative h-40 w-40" equipped={equipped} />
        <span className="absolute right-3 top-3 rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-extrabold">{xpBalance} XP</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {cosmetics.map((item) => {
          const isOwned = owned.includes(item.id);
          const isEquipped = equipped.includes(item.id);
          const canAfford = xpBalance >= item.cost;
          return (
            <button
              aria-pressed={isOwned ? isEquipped : undefined}
              className={`flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition active:scale-[0.99] disabled:cursor-not-allowed ${
                isEquipped ? "border-[#ff7048] bg-[#fff1c6]" : "border-[#20201f]/8 bg-white hover:border-[#20201f]/20"
              } ${!isOwned && !canAfford ? "opacity-55" : ""}`}
              disabled={!isOwned && !canAfford}
              key={item.id}
              onClick={() => onSelect(item.id, item.cost)}
              type="button"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] border border-[#20201f]/8" style={{ backgroundColor: item.color }}>
                <CosmeticPreview id={item.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-extrabold text-[#20201f]">{item.name}</span>
                <span className="mt-0.5 block text-[11px] font-semibold text-[#817986]">
                  {!isOwned && !canAfford ? `Earn ${item.cost - xpBalance} more XP to unlock` : item.description}
                </span>
              </span>
              <span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${isEquipped ? "bg-[#ff7048] text-white" : isOwned ? "bg-[#e7e4df] text-[#20201f]" : "bg-[#f8d66d] text-[#20201f]"}`}>
                {isEquipped ? "Wearing" : isOwned ? "Wear" : `${item.cost} XP`}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[11px] font-semibold leading-4 text-[#8a8283]">Cosmetics use spendable XP. Your lifetime XP and level never go down.</p>
    </Sheet>
  );
}
