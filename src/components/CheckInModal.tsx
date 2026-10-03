import { useId, useState } from "react";
import type { StudySpot } from "../types/spot";
import { xpForMinutes } from "../utils/progress";
import Icon from "./Icon";
import Sheet from "./Sheet";
import StudyBuddy from "./StudyBuddy";

const durations = [
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 hour" },
  { minutes: 120, label: "2 hours" },
  { minutes: 180, label: "3 hours" },
];

type CheckInModalProps = {
  spot: StudySpot;
  equipped: string[];
  /** True if a live timer is already running here. */
  timerRunningHere: boolean;
  onLog: (minutes: number) => void;
  onStartTimer: () => void;
  onClose: () => void;
};

/** "How long did you focus?": log a finished session for XP, or start a live timer instead. */
export default function CheckInModal({ spot, equipped, timerRunningHere, onLog, onStartTimer, onClose }: CheckInModalProps) {
  const titleId = useId();
  const [minutes, setMinutes] = useState(60);

  return (
    <Sheet className="p-5" labelledBy={titleId} layer="top" onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#fff1c6] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9a5c20]">Study check-in</span>
          <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.04em] text-[#20201f]" id={titleId}>How long did you focus?</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#766f72]">{spot.name}</p>
        </div>
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" onClick={onClose} aria-label="Close study check-in" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby={titleId}>
        {durations.map((option) => {
          const selected = minutes === option.minutes;
          return (
            <button
              aria-checked={selected}
              className={`rounded-[18px] border p-4 text-left transition active:scale-[0.98] ${selected ? "border-[#ff7048] bg-[#fff1c6] shadow-[0_6px_16px_rgba(255,112,72,0.12)]" : "border-[#20201f]/8 bg-white hover:border-[#20201f]/20"}`}
              data-autofocus={selected ? true : undefined}
              key={option.minutes}
              onClick={() => setMinutes(option.minutes)}
              role="radio"
              type="button"
            >
              <span className="block text-[14px] font-extrabold text-[#20201f]">{option.label}</span>
              <span className="mt-1 block text-[11px] font-bold text-[#e9532f]">Earn {xpForMinutes(option.minutes)} XP</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-[#afc5f1]/45 p-3">
        <StudyBuddy className="h-16 w-16 shrink-0" equipped={equipped} />
        <p className="text-[11px] font-semibold leading-4 text-[#4e5568]">Your Study Buddy gets a little closer to its next level every time you log a focus session.</p>
      </div>
      <button
        className="mt-4 w-full rounded-[16px] bg-[#ff7048] py-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,112,72,0.25)] transition hover:bg-[#f45f36] active:scale-[0.98]"
        onClick={() => onLog(minutes)}
        type="button"
      >
        Log session · Earn {xpForMinutes(minutes)} XP
      </button>
      <button
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[16px] border border-[#20201f]/10 bg-white py-3.5 text-[12px] font-extrabold text-[#20201f] transition hover:bg-[#f8f4ee] disabled:cursor-default disabled:opacity-60"
        disabled={timerRunningHere}
        onClick={onStartTimer}
        type="button"
      >
        <Icon name={timerRunningHere ? "check" : "play"} className="h-4 w-4" filled={!timerRunningHere} />
        {timerRunningHere ? "Timer already running here" : "Just arrived? Start a live timer"}
      </button>
    </Sheet>
  );
}
