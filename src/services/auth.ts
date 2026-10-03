import type { LoginInput, SignupInput, User } from "../types/user";
import { createId, readStorage, removeStorage, writeStorage } from "../utils/storage";

export type AuthField = "firstName" | "lastName" | "email" | "password" | "dateOfBirth" | "form";

export class AuthError extends Error {
  field: AuthField;

  constructor(field: AuthField, message: string) {
    super(message);
    this.field = field;
  }
}

/**
 * Everything the UI needs from authentication. The app only talks to this interface,
 * so the localStorage implementation below can later be replaced with Supabase, Firebase
 * or a custom API without changing any components.
 */
export interface AuthService {
  getCurrentUser(): User | null;
  login(input: LoginInput): Promise<User>;
  signup(input: SignupInput): Promise<User>;
  /** Lets the multi-step signup flag a taken email on step 1 instead of at the very end. */
  isEmailRegistered(email: string): Promise<boolean>;
  logout(): Promise<void>;
}

type StoredAccount = User & { passwordHash: string; salt: string };

const ACCOUNTS_KEY = "accounts";
const SESSION_KEY = "session";

const normaliseEmail = (email: string) => email.trim().toLowerCase();
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * Hashes a password so it is not stored as plain text in localStorage.
 * NOTE: this is a frontend-only MVP. Anyone with access to the browser can read localStorage,
 * so this is not real security — move authentication to a backend before launch.
 */
async function hashPassword(password: string, salt: string): Promise<string> {
  const input = `${salt}:${password}`;
  if (window.isSecureContext && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for non-HTTPS origins (e.g. opening the dev server via a LAN IP), where crypto.subtle is unavailable.
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv-${(hash >>> 0).toString(16)}`;
}

// Older accounts (created before date of birth was collected) get an empty value.
const toUser = ({ passwordHash: _hash, salt: _salt, ...user }: StoredAccount): User => ({ ...user, dateOfBirth: user.dateOfBirth ?? "" });

export const localAuthService: AuthService = {
  getCurrentUser() {
    const userId = readStorage<string | null>(SESSION_KEY, null);
    if (!userId) return null;
    const account = readStorage<StoredAccount[]>(ACCOUNTS_KEY, []).find((item) => item.id === userId);
    return account ? toUser(account) : null;
  },

  async login({ email, password }) {
    await wait(450); // Simulates a network round-trip so loading states are visible.
    const account = readStorage<StoredAccount[]>(ACCOUNTS_KEY, []).find((item) => item.email === normaliseEmail(email));
    if (!account) throw new AuthError("email", "We couldn't find an account with that email. Want to create one?");
    if ((await hashPassword(password, account.salt)) !== account.passwordHash) {
      throw new AuthError("password", "That password doesn't look right. Please try again.");
    }
    writeStorage(SESSION_KEY, account.id);
    return toUser(account);
  },

  async isEmailRegistered(email) {
    await wait(250);
    return readStorage<StoredAccount[]>(ACCOUNTS_KEY, []).some((item) => item.email === normaliseEmail(email));
  },

  async signup({ firstName, lastName, email, password, dateOfBirth }) {
    await wait(450);
    const accounts = readStorage<StoredAccount[]>(ACCOUNTS_KEY, []);
    const normalisedEmail = normaliseEmail(email);
    if (accounts.some((item) => item.email === normalisedEmail)) {
      throw new AuthError("email", "An account with this email already exists. Try logging in instead.");
    }
    const salt = createId();
    const account: StoredAccount = {
      id: createId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalisedEmail,
      dateOfBirth,
      createdAt: new Date().toISOString(),
      salt,
      passwordHash: await hashPassword(password, salt),
    };
    writeStorage(ACCOUNTS_KEY, [...accounts, account]);
    writeStorage(SESSION_KEY, account.id);
    return toUser(account);
  },

  async logout() {
    removeStorage(SESSION_KEY);
  },
};

export const authService: AuthService = localAuthService;
