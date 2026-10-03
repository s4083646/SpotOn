import { useEffect, useRef, useState, type FormEvent } from "react";
import { amenityOptions, defaultStudyProfile, environmentOptions, goalOptions, sessionOptions, venueOptions } from "../data/profileOptions";
import { AuthError } from "../services/auth";
import type { SignupInput, StudyProfile } from "../types/user";
import { todayKey } from "../utils/user";
import { MIN_PASSWORD_LENGTH, validateAccount, type AccountFormValues, type FieldErrors } from "../utils/validation";
import FormField from "./FormField";
import Icon from "./Icon";
import PreferenceSelector from "./PreferenceSelector";

type SignupStepsProps = {
  onSignup: (input: SignupInput, profile: StudyProfile) => Promise<unknown>;
  isEmailRegistered: (email: string) => Promise<boolean>;
  onSwitchToLogin: () => void;
};

type Step = 1 | 2 | 3;

const stepTitles: Record<Step, { title: string; subtitle: string }> = {
  1: { title: "Create your account", subtitle: "Just the basics to get you started." },
  2: { title: "How do you like to study?", subtitle: "We'll use this to pick spots that suit you." },
  3: { title: "Finish your profile", subtitle: "Almost there! You can change these any time." },
};

const emptyAccount: AccountFormValues = { firstName: "", lastName: "", email: "", password: "", dateOfBirth: "" };

/** Primary pill button used across the signup steps. */
const primaryButton =
  "flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#ff7048] py-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,112,72,0.25)] transition hover:bg-[#f45f36] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70";

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;
}

export function StepProgress({ step }: { step: Step }) {
  return (
    <div aria-label={`Step ${step} of 3`} className="flex items-center gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3].map((index) => (
          <span className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${index <= step ? "bg-[#ff7048]" : "bg-[#20201f]/10"}`} key={index} />
        ))}
      </div>
      <span className="text-[10px] font-extrabold text-[#8a8283]">{step} of 3</span>
    </div>
  );
}

/** Three-step signup: account details → study preferences → finish profile. */
export default function SignupSteps({ onSignup, isEmailRegistered, onSwitchToLogin }: SignupStepsProps) {
  const [step, setStep] = useState<Step>(1);
  const [account, setAccount] = useState<AccountFormValues>(emptyAccount);
  const [profile, setProfile] = useState<StudyProfile>(defaultStudyProfile);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus (and scroll) to the new step's heading so keyboard and screen reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const updateAccount = (field: keyof AccountFormValues, value: string) => {
    const next = { ...account, [field]: value };
    setAccount(next);
    if (submitted) setErrors(validateAccount(next));
  };

  const updateProfile = <K extends keyof StudyProfile>(field: K, value: StudyProfile[K]) => setProfile((current) => ({ ...current, [field]: value }));

  const continueFromAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(true);
    const validation = validateAccount(account);
    setErrors(validation);
    if (Object.keys(validation).length) {
      requestAnimationFrame(() => form.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setBusy(true);
    try {
      if (await isEmailRegistered(account.email)) {
        setErrors({ email: "An account with this email already exists. Try logging in instead." });
        return;
      }
      setStep(2);
    } finally {
      setBusy(false);
    }
  };

  const createAccount = async () => {
    setBusy(true);
    try {
      await onSignup({ ...account }, { ...profile, fieldOfStudy: profile.fieldOfStudy.trim() });
    } catch (error) {
      // If the email was taken in the meantime, send the user back to fix it.
      if (error instanceof AuthError && error.field !== "form") {
        setErrors({ [error.field]: error.message });
        setStep(1);
      } else {
        setErrors({ form: "Something went wrong creating your account. Please try again." });
      }
      setBusy(false);
    }
  };

  return (
    <div>
      <StepProgress step={step} />
      <h2 className="mt-4 text-[24px] font-extrabold leading-tight tracking-[-0.04em] text-[#20201f] outline-none" ref={headingRef} tabIndex={-1}>
        {stepTitles[step].title}
      </h2>
      <p className="mt-1.5 text-[12px] leading-5 text-[#766f72]">{stepTitles[step].subtitle}</p>

      {step === 1 && (
        <form className="mt-5 space-y-3" noValidate onSubmit={continueFromAccount}>
          <div className="grid grid-cols-2 gap-2">
            <FormField autoComplete="given-name" autoFocus error={errors.firstName} label="First name" onValueChange={(value) => updateAccount("firstName", value)} placeholder="John" value={account.firstName} />
            <FormField autoComplete="family-name" error={errors.lastName} hint="Optional" label="Last name" onValueChange={(value) => updateAccount("lastName", value)} placeholder="Doe" value={account.lastName} />
          </div>
          <FormField autoComplete="email" error={errors.email} inputMode="email" label="Email" onValueChange={(value) => updateAccount("email", value)} placeholder="you@example.com" type="email" value={account.email} />
          <FormField
            autoComplete="new-password"
            error={errors.password}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
            label="Password"
            onValueChange={(value) => updateAccount("password", value)}
            placeholder="Create a password"
            revealable
            type="password"
            value={account.password}
          />
          <FormField
            autoComplete="bday"
            error={errors.dateOfBirth}
            hint="Only used to tailor your experience. Never shown publicly."
            label="Date of birth"
            max={todayKey()}
            min="1900-01-01"
            onValueChange={(value) => updateAccount("dateOfBirth", value)}
            type="date"
            value={account.dateOfBirth}
          />
          <button className={`${primaryButton} w-full`} disabled={busy} type="submit">
            {busy ? <><Spinner /> Checking…</> : <>Continue <Icon name="chevron" className="h-4 w-4" /></>}
          </button>
          <p className="pt-1 text-center text-[11px] font-semibold text-[#8a8283]">
            Already have an account?{" "}
            <button className="rounded font-extrabold text-[#e9532f] underline-offset-2 hover:underline" onClick={onSwitchToLogin} type="button">Log in</button>
          </p>
        </form>
      )}

      {step === 2 && (
        <div className="mt-5 space-y-5">
          <PreferenceSelector label="Preferred study environment" onChange={(value) => updateProfile("environment", value)} options={environmentOptions} value={profile.environment} />
          <PreferenceSelector label="Favourite type of spot" onChange={(value) => updateProfile("venueType", value)} options={venueOptions} value={profile.venueType} />
          <PreferenceSelector label="Typical study session" onChange={(value) => updateProfile("sessionLength", value)} options={sessionOptions} value={profile.sessionLength} />
          <div className="flex gap-2">
            <button className="rounded-[16px] border border-[#20201f]/10 bg-white px-5 py-4 text-[12px] font-extrabold text-[#20201f] transition hover:bg-[#f8f4ee]" onClick={() => setStep(1)} type="button">Back</button>
            <button className={primaryButton} onClick={() => setStep(3)} type="button">Continue <Icon name="chevron" className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-5 space-y-5">
          <PreferenceSelector label="Main study goal" onChange={(value) => updateProfile("goal", value)} options={goalOptions} value={profile.goal} />
          <PreferenceSelector hint="Pick as many as you like" label="Must-have amenities" multiple onChange={(value) => updateProfile("amenities", value)} options={amenityOptions} value={profile.amenities} />
          <FormField
            autoComplete="off"
            hint="Optional"
            label="University, course or field of study"
            maxLength={80}
            onValueChange={(value) => updateProfile("fieldOfStudy", value)}
            placeholder="e.g. RMIT · Computer Science"
            value={profile.fieldOfStudy}
          />
          {errors.form && <p className="rounded-[12px] bg-[#fff1eb] px-3 py-2 text-[11px] font-semibold text-[#c5321c]" role="alert">{errors.form}</p>}
          <div className="flex gap-2">
            <button className="rounded-[16px] border border-[#20201f]/10 bg-white px-5 py-4 text-[12px] font-extrabold text-[#20201f] transition hover:bg-[#f8f4ee] disabled:opacity-50" disabled={busy} onClick={() => setStep(2)} type="button">Back</button>
            <button className={primaryButton} disabled={busy} onClick={createAccount} type="button">
              {busy ? <><Spinner /> Creating your account…</> : "Create my account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
