import { useId, useState, type InputHTMLAttributes } from "react";
import Icon from "./Icon";

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "className"> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoFocus?: boolean;
  /** Adds a show/hide toggle for password fields. */
  revealable?: boolean;
};

export default function FormField({ label, value, onValueChange, error, hint, autoFocus, revealable, type = "text", ...inputProps }: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-[#81797a]" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          {...inputProps}
          aria-describedby={error || hint ? messageId : undefined}
          aria-invalid={error ? true : undefined}
          className={`h-12 w-full rounded-[15px] border bg-white px-4 text-[13px] font-semibold text-[#20201f] outline-none transition placeholder:font-medium placeholder:text-[#b3a9a0] focus:ring-2 ${revealable ? "pr-12" : ""} ${
            error ? "border-[#e0412b] bg-[#fff6f3] focus:border-[#e0412b] focus:ring-[#e0412b]/15" : "border-[#20201f]/10 focus:border-[#ff7048] focus:ring-[#ff7048]/15"
          }`}
          data-autofocus={autoFocus ? true : undefined}
          id={id}
          onChange={(event) => onValueChange(event.target.value)}
          type={revealable && revealed ? "text" : type}
          value={value}
        />
        {revealable && (
          <button
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8a8283] transition-colors hover:bg-[#f1eee8] hover:text-[#20201f]"
            onClick={() => setRevealed((current) => !current)}
            type="button"
          >
            <Icon name={revealed ? "eyeOff" : "eye"} className="h-4 w-4" />
          </button>
        )}
      </div>
      {(error || hint) && (
        <p className={`mt-1.5 text-[11px] font-semibold leading-4 ${error ? "text-[#c5321c]" : "text-[#8a8283]"}`} id={messageId}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
