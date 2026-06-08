import { s as supabase } from "./supabase-Bsb1TV-S.js";
const TABLE = "bookings";
const LS_KEY$2 = "sdf-bookings";
function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY$2) ?? "[]");
  } catch {
    return [];
  }
}
function writeLocal(items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY$2, JSON.stringify(items));
  } catch {
  }
}
async function submitBooking(data) {
  const booking = {
    ...data,
    id: crypto.randomUUID(),
    status: "new",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const local = readLocal();
  writeLocal([booking, ...local]);
  try {
    await supabase.from(TABLE).insert(booking);
  } catch {
  }
  return booking;
}
async function getBookings() {
  try {
    const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch {
  }
  return readLocal();
}
async function updateBookingStatus(id, status) {
  const local = readLocal().map((b) => b.id === id ? { ...b, status } : b);
  writeLocal(local);
  try {
    await supabase.from(TABLE).update({ status }).eq("id", id);
  } catch {
  }
}
async function deleteBooking(id) {
  const local = readLocal().filter((b) => b.id !== id);
  writeLocal(local);
  try {
    await supabase.from(TABLE).delete().eq("id", id);
  } catch {
  }
  return local;
}
const IMAGE_SLOTS = [
  // ── Hero slideshow ──
  { key: "hero-0", label: "Slide 1 — Fasil Ghebbi", section: "Hero Slideshow" },
  { key: "hero-1", label: "Slide 2 — Axum Obelisks", section: "Hero Slideshow" },
  { key: "hero-2", label: "Slide 3 — Omo Valley Tribes", section: "Hero Slideshow" },
  { key: "hero-3", label: "Slide 4 — Anwar Mosque", section: "Hero Slideshow" },
  { key: "hero-4", label: "Slide 5 — Historic Mosques", section: "Hero Slideshow" },
  { key: "hero-5", label: "Slide 6 — Menelik Memorial", section: "Hero Slideshow" },
  // ── Tour Destinations ("Where heritage comes alive") ──
  { key: "dest-0", label: "Fasil Ghebbi", section: "Tour Destinations" },
  { key: "dest-1", label: "Axum Obelisks", section: "Tour Destinations" },
  { key: "dest-2", label: "Royal Enclosure — Gondar", section: "Tour Destinations" },
  { key: "dest-3", label: "Anwar Grand Mosque", section: "Tour Destinations" },
  { key: "dest-4", label: "Historic Mosques", section: "Tour Destinations" },
  { key: "dest-5", label: "Omo Valley Tribes", section: "Tour Destinations" },
  // ── Explore / Discover / Experience panels ──
  { key: "panel-explore", label: "Explore panel", section: "Explore · Discover · Experience" },
  { key: "panel-discover", label: "Discover panel", section: "Explore · Discover · Experience" },
  { key: "panel-experience", label: "Experience panel", section: "Explore · Discover · Experience" },
  // ── Tour Package category cards ──
  { key: "cat-addis", label: "Addis Ababa City Tours and Day Trips", section: "Tour Package Categories" },
  { key: "cat-historical", label: "Historical Tours", section: "Tour Package Categories" },
  { key: "cat-cultural", label: "Cultural Tours", section: "Tour Package Categories" },
  { key: "cat-adventure", label: "Adventure & Safari", section: "Tour Package Categories" },
  { key: "cat-trekking", label: "Trekking Tours", section: "Tour Package Categories" },
  { key: "cat-combined", label: "Combined Tours", section: "Tour Package Categories" },
  { key: "cat-festival", label: "Festival Tours", section: "Tour Package Categories" },
  { key: "cat-coffee", label: "Coffee Tours", section: "Tour Package Categories" },
  // ── Events section ──
  { key: "events-bg", label: "Events section background", section: "Events" }
];
const SECTIONS = [...new Set(IMAGE_SLOTS.map((s) => s.section))];
const LS_KEY$1 = "sdf-site-images";
function readStore$1() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY$1) ?? "{}");
  } catch {
    return {};
  }
}
function writeStore$1(store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY$1, JSON.stringify(store));
  } catch {
  }
}
function getSiteImage(key) {
  return readStore$1()[key] ?? null;
}
async function setSiteImage(key, url) {
  const store = readStore$1();
  store[key] = url;
  writeStore$1(store);
  try {
    await supabase.from("site_images").upsert({ key, url });
  } catch {
  }
}
async function removeSiteImage(key) {
  const store = readStore$1();
  delete store[key];
  writeStore$1(store);
  try {
    await supabase.from("site_images").delete().eq("key", key);
  } catch {
  }
}
async function uploadSiteImage(key, file, supabaseClient) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `site-images/${key}.${ext}`;
  const { error } = await supabaseClient.storage.from("catalog-images").upload(path, file, { cacheControl: "3600", upsert: true });
  if (error) throw error;
  const { data } = supabaseClient.storage.from("catalog-images").getPublicUrl(path);
  await setSiteImage(key, data.publicUrl);
  return data.publicUrl;
}
const LS_KEY = "sdf-site-content";
function readStore() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeStore(store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch {
  }
}
function getContentOr(key, defaultValue) {
  return readStore()[key] ?? defaultValue;
}
function setContent(key, value) {
  const store = readStore();
  if (value.trim()) {
    store[key] = value.trim();
  } else {
    delete store[key];
  }
  writeStore(store);
}
function getAllContent() {
  return readStore();
}
export {
  IMAGE_SLOTS as I,
  SECTIONS as S,
  getContentOr as a,
  getAllContent as b,
  getBookings as c,
  deleteBooking as d,
  uploadSiteImage as e,
  setContent as f,
  getSiteImage as g,
  removeSiteImage as r,
  submitBooking as s,
  updateBookingStatus as u
};
