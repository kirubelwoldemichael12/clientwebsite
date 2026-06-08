import { supabase } from "@/lib/supabase";

export type BookingStatus = "new" | "contacted" | "confirmed";

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  tour_interest: string;
  travel_date: string;
  group_size: string;
  message: string;
  status: BookingStatus;
  created_at: string;
};

const TABLE = "bookings";
const LS_KEY = "sdf-bookings";

function readLocal(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

function writeLocal(items: Booking[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
}

export async function submitBooking(data: Omit<Booking, "id" | "status" | "created_at">): Promise<Booking> {
  const booking: Booking = {
    ...data,
    id: crypto.randomUUID(),
    status: "new",
    created_at: new Date().toISOString(),
  };

  // Always persist locally first so nothing is ever lost
  const local = readLocal();
  writeLocal([booking, ...local]);

  // Best-effort Supabase sync — anon INSERT allowed by policy
  try {
    await supabase.from(TABLE).insert(booking);
  } catch {
    // falls back to localStorage only
  }

  return booking;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data as Booking[];
  } catch {}
  // Fallback to localStorage when Supabase is unavailable
  return readLocal();
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  // Update locally
  const local = readLocal().map((b) => (b.id === id ? { ...b, status } : b));
  writeLocal(local);
  // Sync to Supabase
  try { await supabase.from(TABLE).update({ status }).eq("id", id); } catch {}
}

export async function deleteBooking(id: string): Promise<Booking[]> {
  // Remove locally
  const local = readLocal().filter((b) => b.id !== id);
  writeLocal(local);
  // Attempt server-side delete
  try {
    await supabase.from(TABLE).delete().eq("id", id);
  } catch {}
  return local;
}
