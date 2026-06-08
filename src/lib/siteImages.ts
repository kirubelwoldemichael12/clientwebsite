import { supabase } from "@/lib/supabase";

/* ── Slot definitions ──────────────────────────────────────────────────────
   Every image on the public website has a unique key, a human label,
   and a section group. The defaultSrc is set by each page from its local
   import — it's NOT stored here (avoids circular imports).
────────────────────────────────────────────────────────────────────────── */

export type ImageSlot = {
  key: string;
  label: string;
  section: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  // ── Hero slideshow ──
  { key: "hero-0", label: "Slide 1 — Fasil Ghebbi",       section: "Hero Slideshow" },
  { key: "hero-1", label: "Slide 2 — Axum Obelisks",      section: "Hero Slideshow" },
  { key: "hero-2", label: "Slide 3 — Omo Valley Tribes",  section: "Hero Slideshow" },
  { key: "hero-3", label: "Slide 4 — Anwar Mosque",       section: "Hero Slideshow" },
  { key: "hero-4", label: "Slide 5 — Historic Mosques",   section: "Hero Slideshow" },
  { key: "hero-5", label: "Slide 6 — Menelik Memorial",   section: "Hero Slideshow" },
  // ── Tour Destinations ("Where heritage comes alive") ──
  { key: "dest-0", label: "Fasil Ghebbi",                  section: "Tour Destinations" },
  { key: "dest-1", label: "Axum Obelisks",                 section: "Tour Destinations" },
  { key: "dest-2", label: "Royal Enclosure — Gondar",      section: "Tour Destinations" },
  { key: "dest-3", label: "Anwar Grand Mosque",            section: "Tour Destinations" },
  { key: "dest-4", label: "Historic Mosques",              section: "Tour Destinations" },
  { key: "dest-5", label: "Omo Valley Tribes",             section: "Tour Destinations" },
  // ── Explore / Discover / Experience panels ──
  { key: "panel-explore",     label: "Explore panel",     section: "Explore · Discover · Experience" },
  { key: "panel-discover",    label: "Discover panel",    section: "Explore · Discover · Experience" },
  { key: "panel-experience",  label: "Experience panel",  section: "Explore · Discover · Experience" },
  // ── Tour Package category cards ──
  { key: "cat-addis",      label: "Addis Ababa City Tours and Day Trips", section: "Tour Package Categories" },
  { key: "cat-historical", label: "Historical Tours",        section: "Tour Package Categories" },
  { key: "cat-cultural",   label: "Cultural Tours",          section: "Tour Package Categories" },
  { key: "cat-adventure",  label: "Adventure & Safari",      section: "Tour Package Categories" },
  { key: "cat-trekking",   label: "Trekking Tours",          section: "Tour Package Categories" },
  { key: "cat-combined",   label: "Combined Tours",          section: "Tour Package Categories" },
  { key: "cat-festival",   label: "Festival Tours",          section: "Tour Package Categories" },
  { key: "cat-coffee",     label: "Coffee Tours",            section: "Tour Package Categories" },
  // ── Events section ──
  { key: "events-bg", label: "Events section background", section: "Events" },
];

export const SECTIONS = [...new Set(IMAGE_SLOTS.map((s) => s.section))];

/* ── localStorage store ────────────────────────────────────────────────── */

const LS_KEY = "sdf-site-images";

function readStore(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
}

function writeStore(store: Record<string, string>) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch {}
}

/** Synchronously returns the override URL for a slot, or null if none set. */
export function getSiteImage(key: string): string | null {
  return readStore()[key] ?? null;
}

/** Save a custom URL for a slot (persists to localStorage + Supabase). */
export async function setSiteImage(key: string, url: string): Promise<void> {
  const store = readStore();
  store[key] = url;
  writeStore(store);
  try {
    await supabase.from("site_images").upsert({ key, url });
  } catch {}
}

/** Remove the override for a slot (revert to local default asset). */
export async function removeSiteImage(key: string): Promise<void> {
  const store = readStore();
  delete store[key];
  writeStore(store);
  try {
    await supabase.from("site_images").delete().eq("key", key);
  } catch {}
}

/** Upload a file to Supabase storage and call setSiteImage. */
export async function uploadSiteImage(
  key: string,
  file: File,
  supabaseClient: typeof supabase,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `site-images/${key}.${ext}`;
  const { error } = await supabaseClient.storage
    .from("catalog-images")
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (error) throw error;
  const { data } = supabaseClient.storage.from("catalog-images").getPublicUrl(path);
  await setSiteImage(key, data.publicUrl);
  return data.publicUrl;
}
