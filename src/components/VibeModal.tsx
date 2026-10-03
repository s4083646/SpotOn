import { useId, useState, type FormEvent } from "react";
import { vibeGroups } from "../data/community";
import type { VibeValues } from "../types/community";
import type { StudySpot } from "../types/spot";
import Icon from "./Icon";
import Sheet from "./Sheet";

type VibeModalProps = {
  spot: StudySpot;
  initial: VibeValues;
  onSubmit: (values: VibeValues) => void;
  onClose: () => void;
};

/** Quick community update: what's this spot like right now? */
export default function VibeModal({ spot, initial, onSubmit, onClose }: VibeModalProps) {
  const titleId = useId();
  const [draft, setDraft] = useState<VibeValues>(initial);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(draft);
  };

  return (
    <Sheet className="p-5" labelledBy={titleId} layer="top" onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#42649c]">Quick community update</p>
          <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.04em] text-[#20201f]" id={titleId}>What’s the vibe?</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#766f72]">{spot.name}</p>
        </div>
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" data-autofocus onClick={onClose} aria-label="Close vibe update" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        {vibeGroups.map((group) => (
          <fieldset className="rounded-[18px] bg-[#f5f2ed] p-3" key={group.key}>
            <legend className="sr-only">{group.label}</legend>
            <p aria-hidden="true" className="px-1 text-[11px] font-extrabold text-[#20201f]"><span className="mr-1.5">{group.symbol}</span>{group.label}</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={group.label}>
              {group.options.map((option) => {
                const selected = draft[group.key] === option;
                return (
                  <button
                    aria-checked={selected}
                    className={`rounded-[12px] px-2 py-2.5 text-[11px] font-extrabold transition active:scale-95 ${selected ? "bg-[#afc5f1] text-[#20201f] shadow-sm" : "bg-white text-[#817986] hover:text-[#20201f]"}`}
                    key={option}
                    onClick={() => setDraft((current) => ({ ...current, [group.key]: option }))}
                    role="radio"
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <button className="w-full rounded-[16px] bg-[#ff7048] py-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,112,72,0.25)] transition hover:bg-[#f45f36] active:scale-[0.98]" type="submit">
          Share live vibe
        </button>
      </form>
    </Sheet>
  );
}
