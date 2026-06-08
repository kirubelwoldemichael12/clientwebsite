import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  catalogCategories,
  deleteCatalogItem,
  getCatalogItems,
  getCatalogPackagesForCategory,
  saveCatalogItem,
  type CatalogItem,
  getCategoryImage,
  saveCategoryImage,
  getPackageImage,
  savePackageImage,
} from "@/lib/catalog";
import { getBookings, updateBookingStatus, deleteBooking, type Booking, type BookingStatus } from "@/lib/bookings";
import { getTestimonials, deleteTestimonial, type Testimonial } from "@/lib/testimonials";
import { IMAGE_SLOTS, SECTIONS, getSiteImage, removeSiteImage, uploadSiteImage } from "@/lib/siteImages";
import { getContentOr, setContent, getAllContent } from "@/lib/siteContent";
import { supabase } from "@/lib/supabase";

function SignInForm({
  onSignIn,
  loading,
  message,
}: {
  onSignIn: (username: string, password: string) => Promise<void>;
  loading: boolean;
  message: string | null;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSignIn(username, password);
      }}
      className="mt-4"
    >
      <label className="block text-sm font-medium text-[var(--brand-green-deep)]">Username or email</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none"
        placeholder="admin or you@organization.com"
      />
      <label className="mt-4 block text-sm font-medium text-[var(--brand-green-deep)]">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none"
        placeholder="Enter your password"
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="submit" disabled={loading} className="rounded-full bg-[var(--brand-green-deep)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}

type CatalogFormState = CatalogItem;

function createEmptyCatalogItem(): CatalogFormState {
  const defaultCategory = catalogCategories[0];
  const defaultPackage = getCatalogPackagesForCategory(defaultCategory)[0] ?? "";

  return {
    id: crypto.randomUUID(),
    title: defaultPackage,
    category: defaultCategory,
    location: "",
    duration: "",
    summary: "",
    description: "",
    icon: "✨",
    featured: false,
    tags: [],
  };
}

export const Route = createFileRoute("/admin/catalog")({
  component: AdminCatalogPage,
  head: () => ({
    meta: [
      { title: "Catalog Admin — SDF Land of Origin" },
      {
        name: "description",
        content: "Create, edit and delete catalog entries for the SDF travel catalog using a Supabase-backed admin studio.",
      },
    ],
  }),
});

function AdminCatalogPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  async function checkAuthAndLoad() {
    setAuthLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        // not signed in — don't load items, show sign-in form
        setAuthLoading(false);
        return;
      }

      const email = (currentUser.email || "").toLowerCase();
      const isAdmin = adminEmails.length === 0 || adminEmails.includes(email);

      if (!isAdmin) {
        setAuthMessage("You are signed in but not authorized to access the admin studio.");
        setIsAuthorized(false);
        setAuthLoading(false);
        return;
      }

      // authorized: proceed to load items
      setAuthMessage(null);
      setIsAuthorized(true);
      setAuthLoading(false);
    } catch (err) {
      setAuthMessage("Unable to verify authentication at this time.");
      setIsAuthorized(false);
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    checkAuthAndLoad();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkAuthAndLoad();
    });

    return () => sub?.subscription?.unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInWithPassword(username: string, password: string) {
    setAuthMessage(null);
    setIsSigningIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });
      if (error) throw error;
      setAuthMessage("Signed in successfully.");
    } catch (err: any) {
      setAuthMessage(err.message || "Failed to sign in.");
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthorized(false);
    setAuthMessage("Signed out.");
  }
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [form, setForm] = useState<CatalogFormState>(createEmptyCatalogItem());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);
  const [isPackageUploading, setIsPackageUploading] = useState(false);
  const [selectedPackageForImage, setSelectedPackageForImage] = useState<string>("");
  const [categoryPreviewUrl, setCategoryPreviewUrl] = useState<string | null>(null);
  const [packagePreviewUrl, setPackagePreviewUrl] = useState<string | null>(null);
  // filter state for the item list panel
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterSearch, setFilterSearch] = useState<string>("");
  // admin tab
  const [adminTab, setAdminTab] = useState<"catalog" | "bookings" | "images" | "testimonials">("catalog");
  // bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  // testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getTestimonials());
  // site images — tracks override URLs keyed by slot key
  const [siteImgUrls, setSiteImgUrls] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    IMAGE_SLOTS.forEach((s) => { const v = getSiteImage(s.key); if (v) init[s.key] = v; });
    return init;
  });
  const [imgUploading, setImgUploading] = useState<string | null>(null);
  // editable text content — key = "slot-key.field", value = current input value
  const [contentDraft, setContentDraft] = useState<Record<string, string>>(() => getAllContent());

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!isAuthorized) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const catalogItems = await getCatalogItems();
        if (!isMounted) return;
        setItems(catalogItems);

        if (catalogItems.length === 0) {
          setForm(createEmptyCatalogItem());
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isAuthorized]);

  useEffect(() => {
    if (adminTab !== "bookings" || !isAuthorized) return;
    setBookingsLoading(true);
    getBookings().then(setBookings).finally(() => setBookingsLoading(false));
  }, [adminTab, isAuthorized]);

  const editingItem = useMemo(() => items.find((item) => item.id === form.id), [form.id, items]);
  const packageOptions = useMemo(() => getCatalogPackagesForCategory(form.category), [form.category]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterCategory !== "All") {
      result = result.filter((item) => item.category === filterCategory);
    }
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.location || "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [items, filterCategory, filterSearch]);

  function updateField<K extends keyof CatalogFormState>(field: K, value: CatalogFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateCategory(value: string) {
    const nextPackageOptions = getCatalogPackagesForCategory(value);

    setForm((current) => ({
      ...current,
      category: value,
      title: nextPackageOptions.includes(current.title) ? current.title : (nextPackageOptions[0] ?? current.title),
    }));
  }

  function applyPackageTemplate(packageName: string) {
    if (!packageName) {
      return;
    }

    setForm((current) => ({
      ...current,
      title: packageName,
      summary: current.summary || `Package itinerary for ${packageName}.`,
      description: current.description || `${packageName} is available as a guided package and can be tailored for travelers.`,
    }));

    // If there's a package-level image for this template, use it as the item image
    try {
      const pkgImg = getPackageImage(form.category, packageName);
      if (pkgImg) {
        setForm((cur) => ({ ...cur, image: pkgImg }));
      }
    } catch {}
  }

  function updateTags(value: string) {
    setForm((current) => ({
      ...current,
      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }));
  }

  function startCreate() {
    setForm(createEmptyCatalogItem());
    setLocalPreview(null);
    setMessage("Preparing a new catalog entry.");
  }

  function startEdit(item: CatalogItem) {
    setForm({ ...item, tags: [...item.tags] });
    setLocalPreview(null);   // clear any leftover preview from previous edit
    setMessage(`Editing ${item.title}.`);
  }

  function removeImage() {
    setLocalPreview(null);
    updateField("image", undefined as any);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const savedItem = await saveCatalogItem(form);
      setItems((currentItems) => {
        const nextItems = currentItems.some((item) => item.id === savedItem.id)
          ? currentItems.map((item) => (item.id === savedItem.id ? savedItem : item))
          : [savedItem, ...currentItems];

        return nextItems;
      });
      setForm(createEmptyCatalogItem());
      setMessage("Catalog entry saved successfully.");
    } catch {
      setMessage("Unable to save the catalog entry right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(itemId: string) {
    setIsDeleting(itemId);
    setMessage(null);

    try {
      const nextItems = await deleteCatalogItem(itemId);
      setItems(nextItems);

      if (form.id === itemId) {
        setForm(createEmptyCatalogItem());
      }

      setMessage("Catalog entry deleted.");
    } catch {
      setMessage("Unable to delete the catalog entry right now.");
    } finally {
      setIsDeleting(null);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="rounded-2xl bg-white/5 px-8 py-6 text-sm text-muted-foreground">Verifying authentication...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-md rounded-2xl border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--brand-green-deep)]">Admin sign in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use your admin username/email and password to access the dashboard.</p>
          <SignInForm onSignIn={signInWithPassword} loading={isSigningIn} message={authMessage} />
        </div>
      </div>
    );
  }

  if (user && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-2xl rounded-2xl border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-[var(--brand-green-deep)]">Access denied</h2>
          <p className="mt-3 text-sm text-muted-foreground">{authMessage || "Your account is not authorized to access the admin studio."}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={signOut} className="rounded-full bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white">Sign out</button>
            <a href="/" className="rounded-full border border-[var(--brand-green)]/15 px-4 py-2 text-sm font-semibold text-[var(--brand-green-deep)]">Return home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#082a1f_0%,#f7f1df_15%,#fdfbf3_100%)] text-foreground">
      <header className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(8,42,31,0.97),rgba(14,36,27,0.9))] px-6 py-10 text-white md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 backdrop-blur-md">
              Catalog admin
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-black md:text-5xl">Create and manage the travel catalog.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
              Manage category groups and package subcategories for Addis Ababa city tours and day trips, historical, cultural, adventure and safari, trekking, combined and festival tours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/catalog" className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
              View catalog
            </Link>
            <Link to="/" className="rounded-full bg-[var(--brand-gold)] px-5 py-3 text-sm font-semibold text-[var(--brand-green-deep)] transition hover:scale-[1.02]">
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-10 md:px-12 md:py-14">

        {/* ── Tab switcher ── */}
        <div className="mx-auto max-w-7xl mb-8 flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-[var(--brand-green)]/10 w-fit">
          {(["catalog", "images", "bookings", "testimonials"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setAdminTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition capitalize ${adminTab === tab ? "bg-[var(--brand-green-deep)] text-white shadow-sm" : "text-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)]"}`}
            >
              {tab === "bookings"
                ? `Bookings${bookings.filter(b => b.status === "new").length > 0 ? ` (${bookings.filter(b => b.status === "new").length} new)` : ""}`
                : tab === "images" ? "Site Images" : tab === "testimonials" ? "Testimonials" : "Catalog"}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS PANEL ── */}
        {adminTab === "bookings" && (
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Customer Requests</span>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--brand-green-deep)]">
                    {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                    {bookings.filter(b => b.status === "new").length > 0 && (
                      <span className="ml-3 text-base font-semibold text-[var(--brand-red)]">
                        · {bookings.filter(b => b.status === "new").length} new
                      </span>
                    )}
                  </h2>
                </div>
                <button type="button" onClick={() => { setBookingsLoading(true); getBookings().then(setBookings).finally(() => setBookingsLoading(false)); }}
                  className="rounded-full border border-[var(--brand-green)]/15 px-4 py-2 text-sm font-semibold text-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)] transition">
                  Refresh
                </button>
              </div>

              {bookingsLoading ? (
                <div className="text-center py-16 text-muted-foreground text-sm">Loading bookings…</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-semibold text-[var(--brand-green-deep)]">No bookings yet.</p>
                  <p className="text-sm mt-1">Booking requests will appear here once customers submit the form.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => {
                    const waMsg = encodeURIComponent(`Hi ${b.name}! Thank you for your interest in SDF tours. Regarding your request for "${b.tour_interest}"…`);
                    return (
                      <div key={b.id} className={`rounded-2xl border p-6 transition ${b.status === "new" ? "border-[var(--brand-gold)]/40 bg-amber-50/40" : b.status === "confirmed" ? "border-emerald-200 bg-emerald-50/30" : "border-[var(--brand-green)]/10 bg-white"}`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-[var(--brand-green-deep)] text-lg">{b.name}</h3>
                              <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                                b.status === "new" ? "bg-amber-100 text-amber-800" :
                                b.status === "contacted" ? "bg-blue-100 text-blue-800" :
                                "bg-emerald-100 text-emerald-800"
                              }`}>{b.status}</span>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Tour:</span> {b.tour_interest || "—"}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Date:</span> {b.travel_date || "—"}
                                <span className="font-medium text-foreground ml-3">Group:</span> {b.group_size}
                              </div>
                              {b.message && <div><span className="font-medium text-foreground">Notes:</span> {b.message}</div>}
                              <div className="text-xs text-muted-foreground/70 mt-1">
                                Submitted {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 flex-shrink-0">
                            <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}?text=${waMsg}`} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm4.8 14.3c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.9 1c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3s-.9.9-.9 2.1c0 1.2.9 2.4 1 2.6s1.8 2.7 4.4 3.8c.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3Z" /></svg>
                              {b.phone}
                            </a>
                            {b.email && (
                              <a href={`mailto:${b.email}`}
                                className="flex items-center gap-1.5 bg-[var(--brand-green-deep)] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,12 2,6" /></svg>
                                Email
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm("Delete this booking? This action cannot be undone.")) return;
                                setBookingsLoading(true);
                                try {
                                  const next = await deleteBooking(b.id);
                                  setBookings(next);
                                } finally {
                                  setBookingsLoading(false);
                                }
                              }}
                              className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Status buttons */}
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4">
                          <span className="text-xs text-muted-foreground self-center mr-1">Mark as:</span>
                          {(["new", "contacted", "confirmed"] as BookingStatus[]).map((s) => (
                            <button key={s} type="button"
                              disabled={b.status === s}
                              onClick={() => updateBookingStatus(b.id, s).then(() => setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, status: s } : x)))}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition capitalize ${b.status === s ? "bg-[var(--brand-green-deep)] text-white cursor-default" : "bg-[var(--brand-sand)] text-[var(--brand-green-deep)] hover:bg-[var(--brand-green)]/10"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SITE CONTENT PANEL (images + names) ── */}
        {adminTab === "images" && (
          <div className="mx-auto max-w-7xl space-y-10">

            {/* ── Helper: text fields per slot key ── */}
            {SECTIONS.map((section) => {
              const slots = IMAGE_SLOTS.filter((s) => s.section === section);

              // Define which text fields each section's slots have
              const fieldDefs: Record<string, { field: string; label: string; placeholder: string }[]> = {
                "Hero Slideshow": [
                  { field: "label", label: "Slide title",   placeholder: "e.g. Fasil Ghebbi" },
                  { field: "place", label: "Location text", placeholder: "e.g. Gondar · UNESCO Heritage" },
                ],
                "Tour Destinations": [
                  { field: "title", label: "Destination name", placeholder: "e.g. Fasil Ghebbi" },
                  { field: "place", label: "Place / region",   placeholder: "e.g. Gondar" },
                  { field: "tag",   label: "Badge label",       placeholder: "e.g. UNESCO Heritage" },
                ],
                "Tour Package Categories": [
                  { field: "title", label: "Category title",   placeholder: "e.g. Historical Tours" },
                  { field: "desc",  label: "Description",      placeholder: "Short description of this category" },
                ],
                "Explore · Discover · Experience": [],
                "Events": [],
              };
              const fields = fieldDefs[section] ?? [];

              return (
                <div key={section} className="rounded-[2rem] border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm md:p-10">
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Section</span>
                    <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)]">{section}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Edit image and text. Leave a text field empty to revert to the default.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {slots.map((slot) => {
                      const currentUrl = siteImgUrls[slot.key] ?? null;
                      const isLoading  = imgUploading === slot.key;

                      return (
                        <div key={slot.key} className="rounded-2xl border border-[var(--brand-green)]/10 overflow-hidden bg-[var(--brand-sand)]">

                          {/* ── Image preview ── */}
                          <div className="relative h-40 bg-[var(--brand-sand)]">
                            {currentUrl ? (
                              <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 gap-1.5">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span className="text-xs">Default image</span>
                              </div>
                            )}
                            {isLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                              </div>
                            )}
                            {/* Image action bar */}
                            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2">
                              <label className="flex-1 cursor-pointer text-center rounded-full bg-white/20 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] text-white text-[11px] font-semibold py-1.5 transition">
                                {currentUrl ? "Change photo" : "Upload photo"}
                                <input type="file" accept="image/*" className="sr-only" disabled={isLoading}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setImgUploading(slot.key);
                                    try {
                                      const url = await uploadSiteImage(slot.key, file, supabase);
                                      setSiteImgUrls((prev) => ({ ...prev, [slot.key]: url }));
                                      setMessage(`Photo updated: ${slot.label}`);
                                    } catch (err: any) {
                                      setMessage(`Upload failed: ${err.message ?? String(err)}`);
                                    } finally { setImgUploading(null); e.target.value = ""; }
                                  }}
                                />
                              </label>
                              {currentUrl && (
                                <button type="button" disabled={isLoading}
                                  onClick={async () => {
                                    await removeSiteImage(slot.key);
                                    setSiteImgUrls((prev) => { const n = { ...prev }; delete n[slot.key]; return n; });
                                    setMessage(`Photo reset: ${slot.label}`);
                                  }}
                                  className="rounded-full border border-white/30 text-white text-[11px] font-semibold px-3 py-1.5 hover:bg-[var(--brand-red)] transition"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {/* ── Text fields ── */}
                          <div className="p-4 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-widest text-[var(--brand-green-deep)]">{slot.label}</div>
                            {fields.map(({ field, label, placeholder }) => {
                              const ck = `${slot.key}.${field}`;
                              return (
                                <div key={field}>
                                  <label className="text-[11px] text-muted-foreground font-medium block mb-1">{label}</label>
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={contentDraft[ck] ?? ""}
                                      placeholder={placeholder}
                                      onChange={(e) => setContentDraft((prev) => ({ ...prev, [ck]: e.target.value }))}
                                      onBlur={(e) => {
                                        setContent(ck, e.target.value);
                                        setMessage(`Saved: ${label} for ${slot.label}`);
                                      }}
                                      className="flex-1 rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20"
                                    />
                                    {contentDraft[ck] && (
                                      <button type="button"
                                        title="Reset to default"
                                        onClick={() => {
                                          setContent(ck, "");
                                          setContentDraft((prev) => { const n = { ...prev }; delete n[ck]; return n; });
                                          setMessage(`Reset to default: ${label}`);
                                        }}
                                        className="rounded-xl border border-[var(--brand-red)]/30 text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white px-2.5 transition text-xs font-bold"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {message && (
              <div className="rounded-2xl bg-[var(--brand-sand)] px-5 py-3 text-sm text-[var(--brand-green-deep)] text-center">{message}</div>
            )}
          </div>
        )}

        {/* ── TESTIMONIALS PANEL ── */}
        {adminTab === "testimonials" && (
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Testimonials</span>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--brand-green-deep)]">
                    {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">Manage homepage testimonials. You can add or remove entries here.</p>
                </div>
                <a href="/admin/testimonials" className="rounded-full border border-[var(--brand-green)]/15 px-4 py-2 text-sm font-semibold text-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)] transition">Open full manager</a>
              </div>

              <div className="space-y-3">
                {testimonials.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No testimonials yet.</div>
                ) : (
                  testimonials.map((t) => (
                    <div key={t.id} className="flex items-center gap-4 border rounded-md p-3">
                      {t.image ? <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">{t.name?.[0]}</div>}
                      <div className="flex-1">
                        <div className="font-semibold">{t.name} {t.location ? <span className="text-sm text-muted-foreground">· {t.location}</span> : null}</div>
                        <div className="text-sm text-muted-foreground">{t.quote}</div>
                      </div>
                      <div>
                        <button type="button" onClick={() => { if (!confirm("Delete this testimonial?")) return; deleteTestimonial(t.id); setTestimonials(getTestimonials()); }} className="rounded px-3 py-1 bg-red-600 text-white text-sm">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CATALOG PANEL ── */}
        {adminTab === "catalog" && (
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm md:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Entry form</span>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--brand-green-deep)]">
                  {editingItem ? "Edit catalog entry" : "Add a new catalog item"}
                </h2>
              </div>
              <button
                type="button"
                onClick={startCreate}
                className="rounded-full border border-[var(--brand-green)]/15 bg-[var(--brand-sand)] px-4 py-2 text-sm font-semibold text-[var(--brand-green-deep)] transition hover:bg-[var(--brand-gold)]/25"
              >
                New item
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* Icon field removed — using uploaded image instead of emoji/icon */}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                  Category
                  <select
                    value={form.category}
                    onChange={(event) => updateCategory(event.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  >
                    {catalogCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                  Location (optional)
                  <input
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                    placeholder="Addis Ababa"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                  Package template
                  <select
                    value=""
                    onChange={(event) => applyPackageTemplate(event.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  >
                    <option value="">Select a package to auto-fill</option>
                    {packageOptions.map((packageName) => (
                      <option key={packageName} value={packageName}>{packageName}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                  Package name
                  <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                    placeholder="Enter package name"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                  Duration (optional)
                  <input
                    value={form.duration}
                    onChange={(event) => updateField("duration", event.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                    placeholder="Full day"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                  Tags
                  <input
                    value={form.tags.join(", ")}
                    onChange={(event) => updateTags(event.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                    placeholder="Wildlife, Photography, Guided"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                Summary
                <input
                  value={form.summary}
                  onChange={(event) => updateField("summary", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  placeholder="Short punchy catalog summary"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  rows={5}
                  className="w-full rounded-3xl border border-input bg-background px-4 py-4 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  placeholder="Describe the experience in a little more detail."
                  required
                />
              </label>

              {/* ── Itinerary */}
              <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                Itinerary
                <textarea
                  value={form.itinerary ?? ""}
                  onChange={(event) => updateField("itinerary", event.target.value)}
                  rows={6}
                  className="w-full rounded-3xl border border-input bg-background px-4 py-4 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  placeholder="Day 1: ...\nDay 2: ..."
                />
              </label>

              {/* ── What's included */}
              <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                What's included (one per line)
                <textarea
                  value={(form.included ?? []).join("\n")}
                  onChange={(event) => updateField("included", event.target.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean))}
                  rows={4}
                  className="w-full rounded-3xl border border-input bg-background px-4 py-4 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  placeholder="Accommodation\nMeals\nLocal transport"
                />
              </label>

              {/* ── What's excluded */}
              <label className="space-y-2 text-sm font-medium text-[var(--brand-green-deep)]">
                What's excluded (one per line)
                <textarea
                  value={(form.excluded ?? []).join("\n")}
                  onChange={(event) => updateField("excluded", event.target.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean))}
                  rows={4}
                  className="w-full rounded-3xl border border-input bg-background px-4 py-4 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  placeholder="International flights\nTravel insurance\nTips"
                />
              </label>

              {/* ── Package image — CRUD ── */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-[var(--brand-green-deep)]">Package image</div>

                {/* Current / preview image */}
                {(localPreview || form.image) ? (
                  <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--brand-green)]/15 bg-[var(--brand-sand)]">
                    <img
                      src={localPreview ?? form.image}
                      alt="Package preview"
                      className="w-full h-52 object-cover"
                    />
                    {/* Overlay action bar */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 backdrop-blur-sm px-4 py-3">
                      <span className="text-xs text-white/80 truncate">
                        {isUploading ? "Uploading…" : "Current image"}
                      </span>
                      <div className="flex gap-2 flex-shrink-0">
                        {/* Change button */}
                        <label className="cursor-pointer rounded-full bg-white/20 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] text-white text-xs font-semibold px-3 py-1.5 transition flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                          Change
                          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploading(true);
                            setMessage(null);
                            const objectUrl = URL.createObjectURL(file);
                            setLocalPreview(objectUrl);
                            try {
                              const fileExt = file.name.split(".").pop() ?? "jpg";
                              const filePath = `catalog-images/${form.id}.${fileExt}`;
                              const { error: uploadError } = await supabase.storage
                                .from("catalog-images")
                                .upload(filePath, file, { cacheControl: "3600", upsert: true });
                              if (uploadError) throw uploadError;
                              const { data: publicData } = supabase.storage.from("catalog-images").getPublicUrl(filePath);
                              updateField("image", publicData.publicUrl);
                              setLocalPreview(null);
                              setMessage("Image updated.");
                            } catch (err: any) {
                              setMessage(`Upload failed: ${err.message ?? String(err)}`);
                              setLocalPreview(null);
                            } finally {
                              setIsUploading(false);
                            }
                          }} />
                        </label>
                        {/* Remove button */}
                        <button type="button" onClick={removeImage}
                          className="rounded-full bg-[var(--brand-red)]/80 hover:bg-[var(--brand-red)] text-white text-xs font-semibold px-3 py-1.5 transition flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          Remove
                        </button>
                      </div>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  /* No image — upload zone */
                  <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-[var(--brand-green)]/20 bg-[var(--brand-sand)] cursor-pointer hover:border-[var(--brand-green)] hover:bg-[var(--brand-green)]/5 transition">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full border-2 border-[var(--brand-green)] border-t-transparent animate-spin" />
                        <span className="text-sm text-muted-foreground">Uploading…</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span className="text-sm font-medium">Click to upload image</span>
                        <span className="text-xs">JPG, PNG, WEBP — any size</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      setMessage(null);
                      const objectUrl = URL.createObjectURL(file);
                      setLocalPreview(objectUrl);
                      try {
                        const fileExt = file.name.split(".").pop() ?? "jpg";
                        const filePath = `catalog-images/${form.id}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage
                          .from("catalog-images")
                          .upload(filePath, file, { cacheControl: "3600", upsert: true });
                        if (uploadError) throw uploadError;
                        const { data: publicData } = supabase.storage.from("catalog-images").getPublicUrl(filePath);
                        updateField("image", publicData.publicUrl);
                        setLocalPreview(null);
                        setMessage("Image uploaded.");
                      } catch (err: any) {
                        setMessage(`Upload failed: ${err.message ?? String(err)}`);
                        setLocalPreview(null);
                      } finally {
                        setIsUploading(false);
                      }
                    }} />
                  </label>
                )}
              </div>

              {/* ── Gallery uploader */}
              <div className="space-y-2 mt-4">
                <div className="text-sm font-medium text-[var(--brand-green-deep)]">Gallery</div>
                <div className="flex flex-wrap gap-3">
                  {(form.gallery ?? []).map((g, idx) => (
                    <div key={idx} className="relative w-28 h-20 overflow-hidden rounded-xl border">
                      <img src={g} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { const next = (form.gallery ?? []).filter((_, i) => i !== idx); updateField("gallery", next); }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs">
                        ×
                      </button>
                    </div>
                  ))}

                  <label className="flex items-center justify-center w-28 h-20 rounded-xl border border-dashed cursor-pointer text-sm text-muted-foreground">
                    Add
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length === 0) return;
                      const read = (file: File) => new Promise<string>((res) => {
                        const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(file);
                      });
                      const results = await Promise.all(files.map(read));
                      const next = [...(form.gallery ?? []), ...results];
                      updateField("gallery", next);
                      e.currentTarget.value = "";
                    }} />
                  </label>
                </div>
                <div className="text-xs text-muted-foreground">Gallery images are stored as client-side previews (Data URLs). Consider using Supabase Storage for persistent hosting.</div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--brand-sand)] px-4 py-4 text-sm font-medium text-[var(--brand-green-deep)]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="h-4 w-4 rounded border-input text-[var(--brand-green-deep)]"
                />
                Feature this catalog item on the public page
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-[var(--brand-green-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save catalog item"}
                </button>
                <button
                  type="button"
                  onClick={() => setForm(createEmptyCatalogItem())}
                  className="rounded-full border border-[var(--brand-green)]/15 px-6 py-3 text-sm font-semibold text-[var(--brand-green-deep)] transition hover:bg-[var(--brand-sand)]"
                >
                  Reset form
                </button>
              </div>

              {message ? <p className="rounded-2xl bg-[var(--brand-sand)] px-4 py-3 text-sm text-[var(--brand-green-deep)]">{message}</p> : null}
            </form>
          </section>

          <section className="rounded-[2rem] border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Catalog items</span>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--brand-green-deep)]">
                  {filteredItems.length} <span className="text-muted-foreground text-2xl font-normal">/ {items.length} total</span>
                </h2>
              </div>
            </div>

            {/* ── Filter controls ── */}
            <div className="mt-6 space-y-3">
              {/* Search */}
              <div className="relative">
                <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  placeholder="Search by title, category, location…"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                />
              </div>
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterCategory("All")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filterCategory === "All" ? "bg-[var(--brand-green-deep)] text-white" : "bg-[var(--brand-sand)] text-[var(--brand-green-deep)] hover:bg-[var(--brand-green)]/10"}`}
                >
                  All ({items.length})
                </button>
                {catalogCategories.map((cat) => {
                  const count = items.filter((i) => i.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilterCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filterCategory === cat ? "bg-[var(--brand-red)] text-white" : "bg-[var(--brand-sand)] text-[var(--brand-green-deep)] hover:bg-[var(--brand-green)]/10"}`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="rounded-3xl border border-[var(--brand-green)]/10 bg-[var(--brand-sand)] p-6 text-sm text-muted-foreground">
                  Loading catalog items...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="rounded-3xl border border-[var(--brand-green)]/10 bg-[var(--brand-sand)] p-6 text-sm text-muted-foreground text-center">
                  No items match this filter.
                  <button type="button" onClick={() => { setFilterCategory("All"); setFilterSearch(""); }} className="block mx-auto mt-2 text-[var(--brand-red)] underline text-xs">Clear filters</button>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-3xl border p-5 transition ${form.id === item.id ? "border-[var(--brand-red)]/30 bg-[var(--brand-sand)]" : "border-[var(--brand-green)]/10 bg-white hover:shadow-sm"}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {item.image ? (
                          <div className="overflow-hidden rounded-2xl">
                            <img src={item.image} alt={item.title} className="h-14 w-14 object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-green-deep)] text-white" />
                        )}

                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand-red)] font-semibold">{item.category}</div>
                          <h3 className="mt-2 text-xl font-semibold text-[var(--brand-green-deep)]">{item.title}</h3>
                          { (item.location || item.duration) && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {[item.location, item.duration].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-full border border-[var(--brand-green)]/15 px-4 py-2 text-sm font-semibold text-[var(--brand-green-deep)] transition hover:bg-[var(--brand-sand)]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting === item.id}
                          className="rounded-full bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.featured ? (
                        <span className="rounded-full bg-[var(--brand-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--brand-green-deep)]">
                          Featured
                        </span>
                      ) : null}
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[var(--brand-green)]/10 bg-white px-3 py-1 text-xs text-[var(--brand-green-deep)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
        )} {/* end adminTab === "catalog" */}
      </main>
    </div>
  );
}
