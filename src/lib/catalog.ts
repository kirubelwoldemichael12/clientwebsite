import { supabase } from "@/lib/supabase";

export type CatalogItem = {
  id: string;
  title: string;
  category: string;
  location?: string;
  duration?: string;
  summary: string;
  description: string;
  icon: string;
  featured: boolean;
  tags: string[];
  image?: string;
  // Overview image or hero image for the package
  overview?: string;
  // Rich itinerary (HTML or plaintext)
  itinerary?: string;
  // What's included — newline-separated or JSON array
  included?: string[];
  // What's excluded — newline-separated or JSON array
  excluded?: string[];
  // Gallery images (data URLs or hosted URLs)
  gallery?: string[];
};

export const catalogPackagesByCategory = {
  "Addis Ababa City Tours and Day Trips": [
    "Addis Ababa City Tours and Day Trips",
    "Addis Ababa Food Tasting Tour",
    "Addis Ababa Nightlife Tour and Pub Crawl",
  ],
  "Historical Tours": [
    "2 Days Lalibela Tour",
    "6 Days / 5 Nights - Danakil Depression and Lalibela Highlights Tour",
    "Day Trip Tiya and Adadi Mariam Church",
  ],
  "Cultural Tours": [
    "3 Days Guided Group Tour of South Omo, Ethiopia",
    "Omo Valley Ethiopia Tribes (Tour 11 Days)",
    "4-Day Omo Valley Cultural Tour from Addis Ababa",
    "8 Days Cultural Tour to Omo Valley Tribes",
  ],
  "Adventure and Safari Tour": [
    "3 Days Danakil Depression Tour",
    "3 Days Erta Ale Volcano and Danakil Depression Tour - Dallol, Salt Flats and Lava Lake",
  ],
  "Trekking Tours": [
    "3 Days Bale Mountains Tour from Addis Ababa",
    "5 Days Awash National Park and Harar Tour",
    "3-Day Tigray Trekking and Community-Based Tour",
    "9 Days Trekking in the Simien Mountains National Park Tour",
    "8 Days Bale Mountain Trekking Tour",
    "4 Days Chebera-Churchura National Park Wildlife Safari (4-Day Wildlife and Nature Experience Itinerary)",
  ],
  "Combined Tours": [
    "7-Day Adventure: Danakil Depression and Gheralta Churches",
    "14 Days Ethiopia Tour - Danakil Depression, Lalibela and Omo Valley Cultural Experience",
    "15 Days Historical, Cultural and Omo Valley Tour",
    "16 Days Ethiopia Grand Cultural, Wildlife and Community Experience Tour",
  ],
  "Festival Tours": [
    "8 Day Ethiopian Christmas (Genna) Tour",
    "8 Day Epiphany (Timket) Tour",
    "7 Day The Finding of the True Cross (Meskel Tour)",
  ],
  "Coffee Tour": [
    "Delve into Ethiopian Coffee Heritage and Urban Culture in a Single Day",
    "3-Day Yirgalem Coffee Tour",
    "6-Day Sidama and Yirgacheffe Coffee and Culture Tour from Addis Ababa",
  ],
  
} as const;

export const catalogCategories = Object.keys(catalogPackagesByCategory);

export function getCatalogPackagesForCategory(category: string): string[] {
  return [...(catalogPackagesByCategory[category as keyof typeof catalogPackagesByCategory] ?? [])];
}

function categoryToLocation(category: string) {
  if (category.includes("Addis Ababa") || category === "Coffee Tour") {
    return "Addis Ababa";
  }

  if (category.includes("Historical")) {
    return "Northern Ethiopia";
  }

  if (category.includes("Cultural")) {
    return "Southern Ethiopia";
  }

  if (category.includes("Adventure") || category.includes("Trekking") || category.includes("Combined")) {
    return "Ethiopia";
  }

  if (category.includes("Festival")) {
    return "Nationwide";
  }

  return "Ethiopia";
}

function packageToDuration(packageName: string) {
  const exactDayMatch = packageName.match(/(\d+)\s*[- ]?\s*days?/i);

  if (exactDayMatch) {
    return `${exactDayMatch[1]} days`;
  }

  if (packageName.toLowerCase().includes("single day") || packageName.toLowerCase().includes("day trip")) {
    return "Full day";
  }

  return "Custom";
}

export const catalogSeedItems: CatalogItem[] = [
  ...catalogCategories.flatMap((category) => {
    const packages = getCatalogPackagesForCategory(category);

    return packages.map((packageName, index) => ({
      id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
      title: packageName,
      category,
      location: categoryToLocation(category),
      duration: packageToDuration(packageName),
      summary: `Package itinerary for ${packageName}.`,
      description: `${packageName} is available as a guided package and can be edited from the admin catalog.`,
      icon: "🧭",
      featured: index === 0,
      tags: ["Package", "Ethiopia Tour"],
      overview: undefined,
      itinerary: "",
      included: [],
      gallery: [],
    }));
  }),
];

const STORAGE_KEY = "sdf-catalog-items";
const DELETED_IDS_KEY = "sdf-deleted-catalog-ids";
const TABLE_NAME = "catalog_items";

/* ── Deleted-ID tracking ───────────────────────────────────────────────────
   When a delete fails to reach Supabase (network, RLS, etc.) we store the
   item ID here so it stays invisible on every subsequent page load, and we
   keep retrying the Supabase delete until it eventually succeeds.
────────────────────────────────────────────────────────────────────────── */

function readDeletedIds(): string[] {
  if (!hasWindow()) return [];
  try { return JSON.parse(window.localStorage.getItem(DELETED_IDS_KEY) ?? "[]") as string[]; }
  catch { return []; }
}

function markDeleted(id: string) {
  if (!hasWindow()) return;
  const ids = readDeletedIds();
  if (!ids.includes(id)) {
    window.localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...ids, id]));
  }
}

function unmarkDeleted(id: string) {
  if (!hasWindow()) return;
  const ids = readDeletedIds().filter((i) => i !== id);
  window.localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(ids));
}

function hasWindow() {
  return typeof window !== "undefined";
}

function cloneCatalogItems(items: CatalogItem[]) {
  return items.map((item) => ({ ...item, tags: [...item.tags], image: item.image }));
}

function readLocalCatalogItems() {
  if (!hasWindow()) {
    return cloneCatalogItems(catalogSeedItems);
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogSeedItems));
    return cloneCatalogItems(catalogSeedItems);
  }

  try {
    const parsedItems = JSON.parse(rawValue) as CatalogItem[];
    // Do NOT re-seed when the array is empty — empty means all items were deleted.
    // Re-seeding only happens above when the key doesn't exist yet (rawValue === null).

    // Migrate legacy category names from older versions to the new category groups.
    const legacyMap: Record<string, string> = {
      "Bird Watching": "Adventure and Safari Tour",
      "Camping Trip": "Adventure and Safari Tour",
      "City Tours": "Addis Ababa City Tours and Day Trips",
      "Cultural": "Cultural Tours",
      "Events": "Festival Tours",
      "Trekking": "Trekking Tours",
      "Desert": "Adventure and Safari Tour",
      "History": "Historical Tours",
      "Mountain": "Trekking Tours",
    };

    const migrated = parsedItems.map((item) => {
      const next = { ...item } as CatalogItem;

      if (typeof next.category === "string" && legacyMap[next.category]) {
        next.category = legacyMap[next.category];
      }

      return next;
    });

    // Persist migration so the UI reflects new categories going forward.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch {
      // ignore
    }

    return cloneCatalogItems(migrated);
  } catch {
    return cloneCatalogItems(catalogSeedItems);
  }
}

function writeLocalCatalogItems(items: CatalogItem[]) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function normalizeCatalogItem(item: Record<string, unknown>): CatalogItem {
  const fallbackCategory = catalogCategories[0] ?? "Cultural Tours";

  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: String(item.title ?? "Untitled catalog item"),
    category: String(item.category ?? fallbackCategory),
    location: item.location !== undefined && item.location !== null ? String(item.location) : "",
    duration: item.duration !== undefined && item.duration !== null ? String(item.duration) : "",
    summary: String(item.summary ?? ""),
    description: String(item.description ?? ""),
    icon: String(item.icon ?? "✨"),
    featured: Boolean(item.featured),
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag)).filter(Boolean) : [],
    image: typeof item.image === "string" && item.image ? String(item.image) : undefined,
    overview: typeof item.overview === "string" && item.overview ? String(item.overview) : undefined,
    itinerary: typeof item.itinerary === "string" ? String(item.itinerary) : "",
    included: Array.isArray(item.included) ? item.included.map((i) => String(i)) : (typeof item.included === "string" && item.included ? String(item.included).split(/\r?\n/).map(s => s.trim()).filter(Boolean) : []),
    excluded: Array.isArray(item.excluded) ? item.excluded.map((i) => String(i)) : (typeof item.excluded === "string" && item.excluded ? String(item.excluded).split(/\r?\n/).map(s => s.trim()).filter(Boolean) : []),
    gallery: Array.isArray(item.gallery) ? item.gallery.map((g) => String(g)) : [],
  };
}

async function readRemoteCatalogItems() {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").order("featured", { ascending: false });

  if (error) {
    return null;
  }

  return (data ?? []).map((item) => normalizeCatalogItem(item as Record<string, unknown>));
}

export async function getCatalogItems() {
  const deletedIds = readDeletedIds();
  const localItems = readLocalCatalogItems();
  const remoteItems = await readRemoteCatalogItems();

  // Best-effort: retry any pending Supabase deletes
  if (deletedIds.length > 0) {
    void supabase.from(TABLE_NAME).delete().in("id", deletedIds);
  }

  // Supabase unreachable — fall back to local only
  if (remoteItems === null) {
    return localItems.filter((item) => !deletedIds.includes(item.id));
  }

  // Supabase is empty — seed it from local state
  if (remoteItems.length === 0) {
    const toSeed = localItems.filter((item) => !deletedIds.includes(item.id));
    try { await supabase.from(TABLE_NAME).upsert(toSeed); } catch {}
    return toSeed;
  }

  /* ── MERGE: local wins for edits, local-only items are included ────────────
     Problem this solves:
       - User creates/edits a package → saved to localStorage immediately
       - Supabase save may fail silently → remote still has old data
       - Old code: `writeLocal(remoteItems)` → wipes the user's changes
       - New code: for every ID, prefer the local version (user's latest edit).
         Items that exist only locally (new, not yet in Supabase) are included.
         Items marked as deleted are excluded from both sources.
  ────────────────────────────────────────────────────────────────────────── */

  const localMap  = new Map(localItems.map((i) => [i.id, i]));
  const remoteMap = new Map(remoteItems.map((i) => [i.id, i]));

  // Union of all IDs from both sources, minus deleted
  const allIds = [...new Set([...localMap.keys(), ...remoteMap.keys()])]
    .filter((id) => !deletedIds.includes(id));

  const merged = allIds.map((id) => localMap.get(id) ?? remoteMap.get(id)!);

  writeLocalCatalogItems(merged);
  return merged;
}

// Image store for category and package template images (localStorage fallback)
const IMAGE_STORE_KEY = "sdf-catalog-images";

type ImageStore = {
  categoryImages: Record<string, string>;
  packageImages: Record<string, string>;
};

function readImageStore(): ImageStore {
  if (!hasWindow()) {
    return { categoryImages: {}, packageImages: {} };
  }

  const raw = window.localStorage.getItem(IMAGE_STORE_KEY);
  if (!raw) {
    const init: ImageStore = { categoryImages: {}, packageImages: {} };
    try {
      window.localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(init));
    } catch {}
    return init;
  }

  try {
    return JSON.parse(raw) as ImageStore;
  } catch {
    return { categoryImages: {}, packageImages: {} };
  }
}

function writeImageStore(store: ImageStore) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(store));
  } catch {}
}

export function getCategoryImage(category: string): string | undefined {
  const store = readImageStore();
  return store.categoryImages[category];
}

export function saveCategoryImage(category: string, url: string) {
  const store = readImageStore();
  store.categoryImages[category] = url;
  writeImageStore(store);
}

export function getPackageImage(category: string, packageName: string): string | undefined {
  const store = readImageStore();
  const key = `${category}||${packageName}`;
  return store.packageImages[key];
}

export function savePackageImage(category: string, packageName: string, url: string) {
  const store = readImageStore();
  const key = `${category}||${packageName}`;
  store.packageImages[key] = url;
  writeImageStore(store);
}

export async function saveCatalogItem(item: CatalogItem) {
  const nextItem = normalizeCatalogItem(item as Record<string, unknown>);
  const currentItems = readLocalCatalogItems();
  const nextItems = currentItems.some((currentItem) => currentItem.id === nextItem.id)
    ? currentItems.map((currentItem) => (currentItem.id === nextItem.id ? nextItem : currentItem))
    : [nextItem, ...currentItems];

  writeLocalCatalogItems(nextItems);

  try {
    await supabase.from(TABLE_NAME).upsert(nextItem);
  } catch {
    // Keep local storage as the fallback source of truth.
  }

  return nextItem;
}

export async function deleteCatalogItem(itemId: string) {
  // Permanently mark as deleted in localStorage — survives refreshes and
  // Supabase failures. Never auto-unmarked.
  markDeleted(itemId);

  const nextItems = readLocalCatalogItems().filter((item) => item.id !== itemId);
  writeLocalCatalogItems(nextItems);

  // Best-effort Supabase delete — result does NOT affect the local filter
  void supabase.from(TABLE_NAME).delete().eq("id", itemId);

  return nextItems;
}
