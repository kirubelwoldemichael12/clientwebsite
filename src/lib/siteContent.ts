/* ── Site content store ────────────────────────────────────────────────────
   Stores editable text fields for public website sections.
   Keys are dot-separated: "{section-key}.{field}"
   e.g.  "dest-0.title"  "hero-0.place"  "cat-addis.desc"
────────────────────────────────────────────────────────────────────────── */

const LS_KEY = "sdf-site-content";

function readStore(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
}

function writeStore(store: Record<string, string>) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch {}
}

/** Returns the stored value or null. */
export function getContent(key: string): string | null {
  return readStore()[key] ?? null;
}

/** Returns the stored value or the provided default. */
export function getContentOr(key: string, defaultValue: string): string {
  return readStore()[key] ?? defaultValue;
}

/** Saves a value. */
export function setContent(key: string, value: string): void {
  const store = readStore();
  if (value.trim()) {
    store[key] = value.trim();
  } else {
    delete store[key]; // empty = revert to default
  }
  writeStore(store);
}

/** Removes a value (reverts to default). */
export function removeContent(key: string): void {
  const store = readStore();
  delete store[key];
  writeStore(store);
}

/** Returns the full store — used by admin to hydrate state. */
export function getAllContent(): Record<string, string> {
  return readStore();
}
