import { useId, useState, type FormEvent } from "react";
import { reviewTags } from "../data/community";
import type { ReviewInput } from "../hooks/useCommunity";
import type { StudySpot } from "../types/spot";
import Icon from "./Icon";
import Sheet from "./Sheet";

const MAX_LENGTH = 240;
const MIN_LENGTH = 10;

type ReviewModalProps = {
  spot: StudySpot;
  onSubmit: (input: ReviewInput) => void;
  onClose: () => void;
};

export default function ReviewModal({ spot, onSubmit, onClose }: ReviewModalProps) {
  const titleId = useId();
  const [rating, setRating] = useState(5);
  const [tag, setTag] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text.trim().length < MIN_LENGTH) {
      setError("Add a short tip (at least 10 characters) so other students know what to expect.");
      event.currentTarget.querySelector("textarea")?.focus();
      return;
    }
    onSubmit({ spotId: spot.id, rating, tag, text });
  };

  return (
    <Sheet className="p-5" labelledBy={titleId} layer="top" onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ff7048]">Study Circle review</p>
          <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.04em] text-[#20201f]" id={titleId}>Share your study intel</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#766f72]">{spot.name}</p>
        </div>
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" onClick={onClose} aria-label="Close review form" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
      <form className="mt-5" noValidate onSubmit={handleSubmit}>
        <fieldset>
          <legend className="text-[10px] font-extrabold uppercase tracking-wider text-[#81797a]">Your rating</legend>
          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                aria-pressed={value === rating}
                className={`flex h-11 w-11 items-center justify-center rounded-[14px] transition active:scale-90 ${value <= rating ? "bg-[#f8d66d] text-[#20201f]" : "bg-[#eeeae4] text-[#a8a098] hover:bg-[#e5e0d8]"}`}
                data-autofocus={value === 5 ? true : undefined}
                key={value}
                onClick={() => setRating(value)}
                type="button"
              >
                <Icon name="star" className="h-5 w-5" filled={value <= rating} />
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="text-[10px] font-extrabold uppercase tracking-wider text-[#81797a]">
            Best describes this spot <span className="normal-case tracking-normal text-[#aaa19a]">(optional)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {reviewTags.map((option) => (
              <button
                aria-pressed={tag === option}
                className={`rounded-full px-3 py-2 text-[11px] font-extrabold transition active:scale-95 ${tag === option ? "bg-[#f6b9d4] text-[#20201f]" : "border border-[#20201f]/8 bg-white text-[#746d72] hover:border-[#20201f]/20"}`}
                key={option}
                onClick={() => setTag((current) => (current === option ? "" : option))}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#81797a]">Your tip for other students</span>
          <textarea
            aria-invalid={error ? true : undefined}
            className={`mt-2 min-h-28 w-full resize-none rounded-[18px] border bg-white p-4 text-[13px] font-semibold leading-5 text-[#20201f] outline-none transition placeholder:text-[#aaa19a] focus:ring-2 ${
              error ? "border-[#e0412b] focus:ring-[#e0412b]/15" : "border-[#20201f]/10 focus:border-[#ff7048] focus:ring-[#ff7048]/15"
            }`}
            maxLength={MAX_LENGTH}
            onChange={(event) => {
              setText(event.target.value);
              if (error && event.target.value.trim().length >= MIN_LENGTH) setError(null);
            }}
            placeholder="When is it quietest? Where are the best desks?"
            value={text}
          />
        </label>
        <div className="mt-1 flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold leading-4 text-[#c5321c]" role={error ? "alert" : undefined}>{error}</p>
          <span className="shrink-0 text-[10px] font-semibold text-[#9a9290]">{text.length}/{MAX_LENGTH}</span>
        </div>
        <button className="mt-3 w-full rounded-[16px] bg-[#ff7048] py-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,112,72,0.25)] transition hover:bg-[#f45f36] active:scale-[0.98]" type="submit">
          Post to the Study Circle
        </button>
      </form>
    </Sheet>
  );
}
