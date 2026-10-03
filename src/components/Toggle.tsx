import type { ReactNode } from "react";

type ToggleRowProps = {
  label: string;
  description: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  last?: boolean;
};

/** A settings row with an on/off switch, matching the original profile toggle style. */
export default function ToggleRow({ label, description, checked, onChange, last = false }: ToggleRowProps) {
  return (
    <button
      aria-checked={checked}
      className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[#fff8ec] focus-visible:bg-[#fff8ec] focus-visible:outline-none ${last ? "" : "border-b border-[#20201f]/7"}`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span className="min-w-0">
        <span className="block text-[13px] font-extrabold text-[#20201f]">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-4 text-[#817986]">{description}</span>
      </span>
      <span className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${checked ? "bg-[#ff7048]" : "bg-[#d9d5d0]"}`}>
        <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

type OptionCardProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Selectable card used in the filter sheet, matching the original "Quiet only" / "Open now" style. */
export function OptionCard({ label, description, checked, onChange }: OptionCardProps) {
  return (
    <button
      aria-pressed={checked}
      className={`flex w-full items-center justify-between rounded-[18px] border p-4 text-left transition-colors active:scale-[0.99] ${
        checked ? "border-[#ff7048] bg-[#fff1c6]" : "border-[#20201f]/8 bg-white hover:border-[#20201f]/20"
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span>
        <span className="block text-[13px] font-extrabold text-[#20201f]">{label}</span>
        <span className="mt-0.5 block text-[11px] text-[#817986]">{description}</span>
      </span>
      <span className={`h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${checked ? "border-[#ff7048] bg-[#ff7048] shadow-[inset_0_0_0_4px_white]" : "border-[#bbb5bf]"}`} />
    </button>
  );
}
