import { s as supabase } from "./supabase-Bsb1TV-S.js";
const catalogPackagesByCategory = {
  "Addis Ababa City Tours and Day Trips": [
    "Addis Ababa City Tours and Day Trips",
    "Addis Ababa Food Tasting Tour",
    "Addis Ababa Nightlife Tour and Pub Crawl"
  ],
  "Historical Tours": [
    "2 Days Lalibela Tour",
    "6 Days / 5 Nights - Danakil Depression and Lalibela Highlights Tour",
    "Day Trip Tiya and Adadi Mariam Church"
  ],
  "Cultural Tours": [
    "3 Days Guided Group Tour of South Omo, Ethiopia",
    "Omo Valley Ethiopia Tribes (Tour 11 Days)",
    "4-Day Omo Valley Cultural Tour from Addis Ababa",
    "8 Days Cultural Tour to Omo Valley Tribes"
  ],
  "Adventure and Safari Tour": [
    "3 Days Danakil Depression Tour",
    "3 Days Erta Ale Volcano and Danakil Depression Tour - Dallol, Salt Flats and Lava Lake"
  ],
  "Trekking Tours": [
    "3 Days Bale Mountains Tour from Addis Ababa",
    "5 Days Awash National Park and Harar Tour",
    "3-Day Tigray Trekking and Community-Based Tour",
    "9 Days Trekking in the Simien Mountains National Park Tour",
    "8 Days Bale Mountain Trekking Tour",
    "4 Days Chebera-Churchura National Park Wildlife Safari (4-Day Wildlife and Nature Experience Itinerary)"
  ],
  "Combined Tours": [
    "7-Day Adventure: Danakil Depression and Gheralta Churches",
    "14 Days Ethiopia Tour - Danakil Depression, Lalibela and Omo Valley Cultural Experience",
    "15 Days Historical, Cultural and Omo Valley Tour",
    "16 Days Ethiopia Grand Cultural, Wildlife and Community Experience Tour"
  ],
  "Festival Tours": [
    "8 Day Ethiopian Christmas (Genna) Tour",
    "8 Day Epiphany (Timket) Tour",
    "7 Day The Finding of the True Cross (Meskel Tour)"
  ],
  "Coffee Tour": [
    "Delve into Ethiopian Coffee Heritage and Urban Culture in a Single Day",
    "3-Day Yirgalem Coffee Tour",
    "6-Day Sidama and Yirgacheffe Coffee and Culture Tour from Addis Ababa"
  ]
};
const catalogCategories = Object.keys(catalogPackagesByCategory);
function getCatalogPackagesForCategory(category) {
  return [...catalogPackagesByCategory[category] ?? []];
}
function categoryToLocation(category) {
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
function packageToDuration(packageName) {
  const exactDayMatch = packageName.match(/(\d+)\s*[- ]?\s*days?/i);
  if (exactDayMatch) {
    return `${exactDayMatch[1]} days`;
  }
  if (packageName.toLowerCase().includes("single day") || packageName.toLowerCase().includes("day trip")) {
    return "Full day";
  }
  return "Custom";
}
const catalogSeedItems = [
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
      overview: void 0,
      itinerary: "",
      included: [],
      gallery: []
    }));
  })
];
const STORAGE_KEY = "sdf-catalog-items";
const DELETED_IDS_KEY = "sdf-deleted-catalog-ids";
const TABLE_NAME = "catalog_items";
function readDeletedIds() {
  if (!hasWindow()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(DELETED_IDS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function markDeleted(id) {
  if (!hasWindow()) return;
  const ids = readDeletedIds();
  if (!ids.includes(id)) {
    window.localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...ids, id]));
  }
}
function hasWindow() {
  return typeof window !== "undefined";
}
function cloneCatalogItems(items) {
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
    const parsedItems = JSON.parse(rawValue);
    const legacyMap = {
      "Bird Watching": "Adventure and Safari Tour",
      "Camping Trip": "Adventure and Safari Tour",
      "City Tours": "Addis Ababa City Tours and Day Trips",
      "Cultural": "Cultural Tours",
      "Events": "Festival Tours",
      "Trekking": "Trekking Tours",
      "Desert": "Adventure and Safari Tour",
      "History": "Historical Tours",
      "Mountain": "Trekking Tours"
    };
    const migrated = parsedItems.map((item) => {
      const next = { ...item };
      if (typeof next.category === "string" && legacyMap[next.category]) {
        next.category = legacyMap[next.category];
      }
      return next;
    });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch {
    }
    return cloneCatalogItems(migrated);
  } catch {
    return cloneCatalogItems(catalogSeedItems);
  }
}
function writeLocalCatalogItems(items) {
  if (!hasWindow()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function normalizeCatalogItem(item) {
  const fallbackCategory = catalogCategories[0] ?? "Cultural Tours";
  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: String(item.title ?? "Untitled catalog item"),
    category: String(item.category ?? fallbackCategory),
    location: item.location !== void 0 && item.location !== null ? String(item.location) : "",
    duration: item.duration !== void 0 && item.duration !== null ? String(item.duration) : "",
    summary: String(item.summary ?? ""),
    description: String(item.description ?? ""),
    icon: String(item.icon ?? "✨"),
    featured: Boolean(item.featured),
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag)).filter(Boolean) : [],
    image: typeof item.image === "string" && item.image ? String(item.image) : void 0,
    overview: typeof item.overview === "string" && item.overview ? String(item.overview) : void 0,
    itinerary: typeof item.itinerary === "string" ? String(item.itinerary) : "",
    included: Array.isArray(item.included) ? item.included.map((i) => String(i)) : typeof item.included === "string" && item.included ? String(item.included).split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [],
    excluded: Array.isArray(item.excluded) ? item.excluded.map((i) => String(i)) : typeof item.excluded === "string" && item.excluded ? String(item.excluded).split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [],
    gallery: Array.isArray(item.gallery) ? item.gallery.map((g) => String(g)) : []
  };
}
async function readRemoteCatalogItems() {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").order("featured", { ascending: false });
  if (error) {
    return null;
  }
  return (data ?? []).map((item) => normalizeCatalogItem(item));
}
async function getCatalogItems() {
  const deletedIds = readDeletedIds();
  const localItems = readLocalCatalogItems();
  const remoteItems = await readRemoteCatalogItems();
  if (deletedIds.length > 0) {
    void supabase.from(TABLE_NAME).delete().in("id", deletedIds);
  }
  if (remoteItems === null) {
    return localItems.filter((item) => !deletedIds.includes(item.id));
  }
  if (remoteItems.length === 0) {
    const toSeed = localItems.filter((item) => !deletedIds.includes(item.id));
    try {
      await supabase.from(TABLE_NAME).upsert(toSeed);
    } catch {
    }
    return toSeed;
  }
  const localMap = new Map(localItems.map((i) => [i.id, i]));
  const remoteMap = new Map(remoteItems.map((i) => [i.id, i]));
  const allIds = [.../* @__PURE__ */ new Set([...localMap.keys(), ...remoteMap.keys()])].filter((id) => !deletedIds.includes(id));
  const merged = allIds.map((id) => localMap.get(id) ?? remoteMap.get(id));
  writeLocalCatalogItems(merged);
  return merged;
}
const IMAGE_STORE_KEY = "sdf-catalog-images";
function readImageStore() {
  if (!hasWindow()) {
    return { categoryImages: {}, packageImages: {} };
  }
  const raw = window.localStorage.getItem(IMAGE_STORE_KEY);
  if (!raw) {
    const init = { categoryImages: {}, packageImages: {} };
    try {
      window.localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(init));
    } catch {
    }
    return init;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { categoryImages: {}, packageImages: {} };
  }
}
function getPackageImage(category, packageName) {
  const store = readImageStore();
  const key = `${category}||${packageName}`;
  return store.packageImages[key];
}
async function saveCatalogItem(item) {
  const nextItem = normalizeCatalogItem(item);
  const currentItems = readLocalCatalogItems();
  const nextItems = currentItems.some((currentItem) => currentItem.id === nextItem.id) ? currentItems.map((currentItem) => currentItem.id === nextItem.id ? nextItem : currentItem) : [nextItem, ...currentItems];
  writeLocalCatalogItems(nextItems);
  try {
    await supabase.from(TABLE_NAME).upsert(nextItem);
  } catch {
  }
  return nextItem;
}
async function deleteCatalogItem(itemId) {
  markDeleted(itemId);
  const nextItems = readLocalCatalogItems().filter((item) => item.id !== itemId);
  writeLocalCatalogItems(nextItems);
  void supabase.from(TABLE_NAME).delete().eq("id", itemId);
  return nextItems;
}
export {
  getCatalogPackagesForCategory as a,
  getPackageImage as b,
  catalogCategories as c,
  deleteCatalogItem as d,
  getCatalogItems as g,
  saveCatalogItem as s
};
