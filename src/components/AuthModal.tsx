import { useId, useState, type FormEvent } from "react";
import { AuthError } from "../services/auth";
import type { LoginInput, SignupInput, StudyProfile } from "../types/user";
import { validateLogin, type FieldErrors } from "../utils/validation";
import FormField from "./FormField";
import Icon, { type IconName } from "./Icon";
import Sheet from "./Sheet";
import SignupSteps from "./SignupSteps";

export type AuthMode = "login" | "signup";
/** Why the modal opened, used to tailor the heading. */
export type AuthReason = "save" | "Saved" | "Profile" | "session" | "recommendations" | "review" | "vibe" | "helpful" | null;

type AuthModalProps = {
  mode: AuthMode;
  reason: AuthReason;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onLogin: (input: LoginInput) => Promise<unknown>;
  onSignup: (input: SignupInput, profile: StudyProfile) => Promise<unknown>;
  isEmailRegistered: (email: string) => Promise<boolean>;
};

const defaultSubtitle = "Log in to sync your saved Melbourne study spots and personalised picks.";

const headings: Record<Exclude<AuthReason, null>, { icon: IconName; title: string; subtitle?: string }> = {
  save: { icon: "heart", title: "Save this for later" },
  Saved: { icon: "heart", title: "Keep your favourite spots" },
  Profile: { icon: "user", title: "Welcome to your profile" },
  session: { icon: "user", title: "Log in to earn XP", subtitle: "Keep your Study Buddy, levels and focus history together in one place." },
  recommendations: { icon: "star", title: "Get picks made for you" },
  review: { icon: "user", title: "Join the Study Circle", subtitle: "Log in to share your study-spot tips with other Melbourne students." },
  vibe: { icon: "user", title: "Share the live vibe", subtitle: "Log in to help students know what this spot feels like right now." },
  helpful: { icon: "heart", title: "Log in to say thanks", subtitle: "Log in to mark useful student tips as helpful." },
};

function LoginForm({ onLogin, onSwitchToSignup }: { onLogin: AuthModalProps["onLogin"]; onSwitchToSignup: () => void }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: "email" | "password", value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // After the first submit attempt, re-validate as the user types so errors clear once fixed.
    if (submitted) setErrors(validateLogin(next));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(true);
    const validation = validateLogin(values);
    setErrors(validation);
    if (Object.keys(validation).length) {
      requestAnimationFrame(() => form.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setSubmitting(true);
    try {
      await onLogin(values);
    } catch (error) {
      setErrors(error instanceof AuthError ? { [error.field]: error.message } : { form: "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="mt-5 space-y-3" noValidate onSubmit={handleSubmit}>
        <FormField autoComplete="email" autoFocus error={errors.email} inputMode="email" label="Email" onValueChange={(value) => update("email", value)} placeholder="you@example.com" type="email" value={values.email} />
        <FormField autoComplete="current-password" error={errors.password} label="Password" onValueChange={(value) => update("password", value)} placeholder="Enter your password" revealable type="password" value={values.password} />
        {errors.form && <p className="rounded-[12px] bg-[#fff1eb] px-3 py-2 text-[11px] font-semibold text-[#c5321c]" role="alert">{errors.form}</p>}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#ff7048] py-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,112,72,0.25)] transition hover:bg-[#f45f36] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          disabled={submitting}
          type="submit"
        >
          {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
          {submitting ? "Logging in…" : "Log in and continue"}
        </button>
      </form>
      <p className="mt-4 text-center text-[11px] font-semibold text-[#8a8283]">
        New here?{" "}
        <button className="rounded font-extrabold text-[#e9532f] underline-offset-2 hover:underline" disabled={submitting} onClick={onSwitchToSignup} type="button">
          Create an account
        </button>
      </p>
    </>
  );
}

export default function AuthModal({ mode, reason, onModeChange, onClose, onLogin, onSignup, isEmailRegistered }: AuthModalProps) {
  const titleId = useId();
  const heading = reason ? headings[reason] : { icon: "user" as IconName, title: "Welcome back", subtitle: undefined };

  return (
    <Sheet labelledBy={titleId} layer="top" onClose={onClose} className="p-5">
      <div className="flex items-start justify-between gap-4">
        {mode === "login" ? (
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f8d66d] text-[#20201f]">
              <Icon name={heading.icon} className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-[24px] font-extrabold leading-tight tracking-[-0.04em] text-[#20201f]" id={titleId}>{heading.title}</h2>
            <p className="mt-2 text-[12px] leading-5 text-[#766f72]">{heading.subtitle ?? defaultSubtitle}</p>
          </div>
        ) : (
          <p className="pt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]" id={titleId}>Join Study Spot</p>
        )}
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" onClick={onClose} aria-label="Close" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onLogin={onLogin} onSwitchToSignup={() => onModeChange("signup")} />
      ) : (
        <div className="mt-3">
          <SignupSteps isEmailRegistered={isEmailRegistered} onSignup={onSignup} onSwitchToLogin={() => onModeChange("login")} />
        </div>
      )}
    </Sheet>
  );
}
