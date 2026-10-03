import type { AuthField } from "../services/auth";

export type FieldErrors = Partial<Record<AuthField, string>>;

export type AccountFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_AGE = 13;

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Please enter your email.";
  if (!EMAIL_PATTERN.test(email.trim())) return "That email doesn't look quite right, e.g. alex@example.com.";
  return undefined;
}

/** Whole years between an ISO date (YYYY-MM-DD) and today. */
export function ageFrom(dateOfBirth: string, today = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const birth = new Date(year, month - 1, day);
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) return null;
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age -= 1;
  return age;
}

function validateDateOfBirth(dateOfBirth: string): string | undefined {
  if (!dateOfBirth) return "Please add your date of birth.";
  const age = ageFrom(dateOfBirth);
  if (age === null) return "Please enter a valid date.";
  if (age < 0) return "Your date of birth can't be in the future.";
  if (age < MIN_AGE) return `You need to be at least ${MIN_AGE} to create an account.`;
  if (age > 120) return "Please double-check the year.";
  return undefined;
}

export function validateLogin(values: Pick<AccountFormValues, "email" | "password">): FieldErrors {
  const errors: FieldErrors = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = "Please enter your password.";
  return errors;
}

/** Step 1 of signup: account details. */
export function validateAccount(values: AccountFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "Please tell us your first name.";
  else if (values.firstName.trim().length > 40) errors.firstName = "Please keep your first name under 40 characters.";
  if (values.lastName.trim().length > 40) errors.lastName = "Please keep your last name under 40 characters.";

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  if (!values.password) errors.password = "Please create a password.";
  else if (values.password.length < MIN_PASSWORD_LENGTH) errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;

  const dobError = validateDateOfBirth(values.dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;
  return errors;
}
