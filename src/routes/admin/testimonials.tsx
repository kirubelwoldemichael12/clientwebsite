import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { getTestimonials, addTestimonial, deleteTestimonial, type Testimonial } from "@/lib/testimonials";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsPage,
  head: () => ({ meta: [{ title: "Testimonials Admin — SDF Land of Origin" }] }),
});

function AdminTestimonialsPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  async function checkAuth() {
    setAuthLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) {
        setIsAuthorized(false);
        setAuthLoading(false);
        return;
      }
      const email = (currentUser.email || "").toLowerCase();
      const isAdmin = adminEmails.length === 0 || adminEmails.includes(email);
      setIsAuthorized(isAdmin);
      setAuthLoading(false);
    } catch (e) {
      setMessage("Unable to verify authentication.");
      setIsAuthorized(false);
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
    const { data: sub } = supabase.auth.onAuthStateChange(() => checkAuth());
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const [items, setItems] = useState<Testimonial[]>(() => getTestimonials());
  const [form, setForm] = useState({ name: "", location: "", quote: "", imagePreview: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthorized) setItems(getTestimonials());
    else setItems([]);
  }, [isAuthorized]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return setForm((s) => ({ ...s, imagePreview: "" }));
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, imagePreview: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return setMessage("Name and quote are required.");
    setIsSaving(true);
    try {
      addTestimonial({ name: form.name.trim(), location: form.location.trim() || undefined, quote: form.quote.trim(), image: form.imagePreview || undefined });
      setItems(getTestimonials());
      setForm({ name: "", location: "", quote: "", imagePreview: "" });
      setMessage("Testimonial added.");
    } catch (err) {
      setMessage("Unable to add testimonial.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete(id: string) {
    deleteTestimonial(id);
    setItems(getTestimonials());
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Verifying admin session…</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Please sign in to access admin.</div>;
  if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center">You are not authorized to access this page.</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Testimonials — Admin</h1>
        <p className="mb-4 text-sm text-muted-foreground">Add, view or remove testimonials shown on the homepage. Image upload stores a client-side data URL.</p>

        <form onSubmit={handleAdd} className="mb-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full rounded-2xl border px-4 py-3 text-sm" />
            <input value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} placeholder="Location (optional)" className="w-full rounded-2xl border px-4 py-3 text-sm" />
          </div>
          <textarea value={form.quote} onChange={(e) => setForm((s) => ({ ...s, quote: e.target.value }))} placeholder="Quote" rows={3} className="w-full rounded-2xl border px-4 py-3 text-sm" />
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-green-deep)] text-white px-4 py-2 text-sm">Upload Image (optional)</span>
            </label>
            {form.imagePreview ? <img src={form.imagePreview} alt="preview" className="h-12 w-12 rounded-full object-cover" /> : null}
            <button type="submit" disabled={isSaving} className="ml-auto rounded-2xl bg-[var(--brand-gold)] px-4 py-2 font-semibold">{isSaving ? "Saving…" : "Add"}</button>
          </div>
        </form>

        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="flex items-center gap-4 border rounded-md p-3">
              {t.image ? <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">{t.name?.[0]}</div>}
              <div className="flex-1">
                <div className="font-semibold">{t.name} {t.location ? <span className="text-sm text-muted-foreground">· {t.location}</span> : null}</div>
                <div className="text-sm text-muted-foreground">{t.quote}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(t.id)} className="rounded px-3 py-1 bg-red-600 text-white text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {message ? <div className="mt-4 text-sm text-muted-foreground">{message}</div> : null}
      </div>
    </div>
  );
}
