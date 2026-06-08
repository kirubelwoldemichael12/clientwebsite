import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BZd-ePnj.js";
import { s as supabase } from "./supabase-Bsb1TV-S.js";
import { g as getTestimonials, a as addTestimonial, d as deleteTestimonial } from "./testimonials-DH6-Mqf4.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AdminTestimonialsPage() {
  const [authLoading, setAuthLoading] = reactExports.useState(true);
  const [isAuthorized, setIsAuthorized] = reactExports.useState(false);
  const [user, setUser] = reactExports.useState(null);
  const [message, setMessage] = reactExports.useState(null);
  const adminEmails = "".split(",").map((s) => s.trim()).filter(Boolean);
  async function checkAuth() {
    setAuthLoading(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
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
  reactExports.useEffect(() => {
    checkAuth();
    const {
      data: sub
    } = supabase.auth.onAuthStateChange(() => checkAuth());
    return () => sub?.subscription?.unsubscribe?.();
  }, []);
  const [items, setItems] = reactExports.useState(() => getTestimonials());
  const [form, setForm] = reactExports.useState({
    name: "",
    location: "",
    quote: "",
    imagePreview: ""
  });
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isAuthorized) setItems(getTestimonials());
    else setItems([]);
  }, [isAuthorized]);
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return setForm((s) => ({
      ...s,
      imagePreview: ""
    }));
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({
      ...s,
      imagePreview: String(reader.result)
    }));
    reader.readAsDataURL(file);
  }
  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return setMessage("Name and quote are required.");
    setIsSaving(true);
    try {
      addTestimonial({
        name: form.name.trim(),
        location: form.location.trim() || void 0,
        quote: form.quote.trim(),
        image: form.imagePreview || void 0
      });
      setItems(getTestimonials());
      setForm({
        name: "",
        location: "",
        quote: "",
        imagePreview: ""
      });
      setMessage("Testimonial added.");
    } catch (err) {
      setMessage("Unable to add testimonial.");
    } finally {
      setIsSaving(false);
    }
  }
  function handleDelete(id) {
    deleteTestimonial(id);
    setItems(getTestimonials());
  }
  if (authLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Verifying admin session…" });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Please sign in to access admin." });
  if (!isAuthorized) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: "You are not authorized to access this page." });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-4", children: "Testimonials — Admin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Add, view or remove testimonials shown on the homepage. Image upload stores a client-side data URL." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "mb-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name, onChange: (e) => setForm((s) => ({
          ...s,
          name: e.target.value
        })), placeholder: "Name", className: "w-full rounded-2xl border px-4 py-3 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.location, onChange: (e) => setForm((s) => ({
          ...s,
          location: e.target.value
        })), placeholder: "Location (optional)", className: "w-full rounded-2xl border px-4 py-3 text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.quote, onChange: (e) => setForm((s) => ({
        ...s,
        quote: e.target.value
      })), placeholder: "Quote", rows: 3, className: "w-full rounded-2xl border px-4 py-3 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleFile, className: "hidden" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-2 rounded-full bg-[var(--brand-green-deep)] text-white px-4 py-2 text-sm", children: "Upload Image (optional)" })
        ] }),
        form.imagePreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.imagePreview, alt: "preview", className: "h-12 w-12 rounded-full object-cover" }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isSaving, className: "ml-auto rounded-2xl bg-[var(--brand-gold)] px-4 py-2 font-semibold", children: isSaving ? "Saving…" : "Add" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 border rounded-md p-3", children: [
      t.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: t.image, alt: t.name, className: "h-12 w-12 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center", children: t.name?.[0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
          t.name,
          " ",
          t.location ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "· ",
            t.location
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: t.quote })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(t.id), className: "rounded px-3 py-1 bg-red-600 text-white text-sm", children: "Delete" }) })
    ] }, t.id)) }),
    message ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm text-muted-foreground", children: message }) : null
  ] }) });
}
export {
  AdminTestimonialsPage as component
};
