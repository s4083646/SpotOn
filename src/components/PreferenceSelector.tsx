import { useId } from "react";
import type { Option } from "../data/profileOptions";
import Icon from "./Icon";

type BaseProps<T extends string> = {
  label: string;
  hint?: string;
  options: Option<T>[];
  columns?: 1 | 2;
};

type SingleProps<T extends string> = BaseProps<T> & { multiple?: false; value: T; onChange: (value: T) => void };
type MultiProps<T extends string> = BaseProps<T> & { multiple: true; value: T[]; onChange: (value: T[]) => void };

/** Chip-style picker for study preferences. Single-select acts as a radio group; multi-select as toggles. */
export default function PreferenceSelector<T extends string>(props: SingleProps<T> | MultiProps<T>) {
  const { label, hint, options, columns = 2 } = props;
  const labelId = useId();

  const isSelected = (value: T) => (props.multiple ? props.value.includes(value) : props.value === value);

  const select = (value: T) => {
    if (props.multiple) {
      props.onChange(props.value.includes(value) ? props.value.filter((item) => item !== value) : [...props.value, value]);
    } else {
      props.onChange(value);
    }
  };

  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-baseline justify-between gap-2" id={labelId}>
        <span className="text-[12px] font-extrabold text-[#20201f]">{label}</span>
        {hint && <span className="text-[10px] font-semibold text-[#9a9198]">{hint}</span>}
      </legend>
      <div aria-labelledby={labelId} className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`} role={props.multiple ? "group" : "radiogroup"}>
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <button
              aria-checked={props.multiple ? undefined : selected}
              aria-pressed={props.multiple ? selected : undefined}
              className={`flex min-h-12 items-center gap-2 rounded-[15px] border px-3 py-2 text-left transition active:scale-[0.98] ${
                selected ? "border-[#ff7048] bg-[#fff1c6] shadow-[0_4px_12px_rgba(255,112,72,0.12)]" : "border-[#20201f]/8 bg-white hover:border-[#20201f]/20"
              }`}
              key={option.value}
              onClick={() => select(option.value)}
              role={props.multiple ? undefined : "radio"}
              type="button"
            >
              <span aria-hidden="true" className="text-[16px] leading-none">{option.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-extrabold leading-4 text-[#20201f]">{option.label}</span>
                {option.hint && <span className="block text-[10px] leading-4 text-[#817986]">{option.hint}</span>}
              </span>
              {selected && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ff7048] text-white">
                  <Icon name="check" className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
