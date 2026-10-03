const PREFIX = "study-spot:";

/** Reads a JSON value from localStorage, returning the fallback if missing, unreadable or blocked. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (e.g. private browsing). The app keeps working in memory.
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore blocked storage.
  }
}

/** Random id that also works outside secure contexts (where crypto.randomUUID is unavailable). */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto && window.isSecureContext) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
