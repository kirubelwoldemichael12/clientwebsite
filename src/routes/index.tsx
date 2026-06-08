import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { submitBooking } from "@/lib/bookings";
import { getSiteImage } from "@/lib/siteImages";
import { getContentOr } from "@/lib/siteContent";
import logo from "@/assets/sdf-logo.png";
import fasil from "@/assets/fasil-castle.jpg";
import axum from "@/assets/axum.jpg";
import gondar from "@/assets/gondar-tower.jpg";
import anwar from "@/assets/anwar-mosque.jpg";
import mosqueGreen from "@/assets/mosque-green.jpg";
import tribe from "@/assets/tribe.jpg";
import menelik from "@/assets/menelik-statue.jpg";
import merkato from "@/assets/merkato.jpg";
import { getTestimonials, addTestimonial, type Testimonial } from "@/lib/testimonials";

/* ── Social icons ─────────────────────────────────────────────────────────── */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V8.1c0-.9.2-1.5 1.5-1.5h1.6V3.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.7V11H7v3h2.4v8h4.1Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27.2 27.2 0 0 0 2 12a27.2 27.2 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27.2 27.2 0 0 0 22 12a27.2 27.2 0 0 0-.4-4.8ZM10 15.2V8.8l5.6 3.2L10 15.2Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.8-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.5 3c.4 2.4 1.8 3.9 4.2 4.1V10a7.7 7.7 0 0 1-4.1-1.1v5.9c0 3.5-2.8 6.2-6.3 6.2a6.2 6.2 0 0 1-4.2-10.8 6.4 6.4 0 0 1 4.6-1.4v2.8a3.4 3.4 0 1 0 2.2 3.2V3h3.6Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* ── Route ────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SDF Land of Origin — Ethiopia Tours, Travel & Events" },
      { name: "description", content: "Explore Ethiopia with SDF Land of Origin. Curated cultural tours, heritage journeys, and event organization across the cradle of humanity." },
    ],
  }),
});

function getDestinations() {
  return [
    { img: getSiteImage("dest-0") ?? fasil,       title: getContentOr("dest-0.title", "Fasil Ghebbi"),       place: getContentOr("dest-0.place", "Gondar"),            tag: getContentOr("dest-0.tag", "UNESCO Heritage") },
    { img: getSiteImage("dest-1") ?? axum,        title: getContentOr("dest-1.title", "Axum Obelisks"),      place: getContentOr("dest-1.place", "Tigray"),            tag: getContentOr("dest-1.tag", "Ancient Kingdom") },
    { img: getSiteImage("dest-2") ?? gondar,      title: getContentOr("dest-2.title", "Royal Enclosure"),    place: getContentOr("dest-2.place", "Gondar"),            tag: getContentOr("dest-2.tag", "Timket Festival") },
    { img: getSiteImage("dest-3") ?? anwar,       title: getContentOr("dest-3.title", "Anwar Grand Mosque"), place: getContentOr("dest-3.place", "Addis Ababa"),       tag: getContentOr("dest-3.tag", "Sacred Site") },
    { img: getSiteImage("dest-4") ?? mosqueGreen, title: getContentOr("dest-4.title", "Historic Mosques"),   place: getContentOr("dest-4.place", "Harar & Beyond"),    tag: getContentOr("dest-4.tag", "Living Faith") },
    { img: getSiteImage("dest-5") ?? tribe,       title: getContentOr("dest-5.title", "Omo Valley Tribes"),  place: getContentOr("dest-5.place", "Southern Ethiopia"), tag: getContentOr("dest-5.tag", "Cultural Immersion") },
  ];
}

function getCategoryCards() {
  return [
    { title: getContentOr("cat-addis.title",      "Addis Ababa City Tours and Day Trips"),  desc: getContentOr("cat-addis.desc",      "Food tastings, coffee ceremonies, nightlife, and hidden urban gems."), img: getSiteImage("cat-addis")      ?? merkato },
    { title: getContentOr("cat-historical.title", "Historical Tours"),        desc: getContentOr("cat-historical.desc", "Lalibela rock churches, Axum obelisks, and ancient kingdoms."),       img: getSiteImage("cat-historical") ?? axum },
    { title: getContentOr("cat-cultural.title",   "Cultural Tours"),          desc: getContentOr("cat-cultural.desc",   "Omo Valley tribes — Mursi, Hamer, Karo — and living heritage."),      img: getSiteImage("cat-cultural")   ?? tribe },
    { title: getContentOr("cat-adventure.title",  "Adventure & Safari"),      desc: getContentOr("cat-adventure.desc",  "Danakil Depression, Erta Ale lava lake, national parks."),            img: getSiteImage("cat-adventure")  ?? gondar },
    { title: getContentOr("cat-trekking.title",   "Trekking Tours"),          desc: getContentOr("cat-trekking.desc",   "Bale Mountains, Simien highland treks, and Tigray cliff churches."),  img: getSiteImage("cat-trekking")   ?? fasil },
    { title: getContentOr("cat-combined.title",   "Combined Tours"),          desc: getContentOr("cat-combined.desc",   "Grand itineraries: Danakil + Lalibela + Omo Valley."),                img: getSiteImage("cat-combined")   ?? menelik },
    { title: getContentOr("cat-festival.title",   "Festival Tours"),          desc: getContentOr("cat-festival.desc",   "Genna Christmas, Timket Epiphany, and Meskel celebrations."),         img: getSiteImage("cat-festival")   ?? anwar },
    { title: getContentOr("cat-coffee.title",     "Coffee Tours"),            desc: getContentOr("cat-coffee.desc",     "Yirgacheffe, Sidama origins — the birthplace of coffee."),            img: getSiteImage("cat-coffee")     ?? mosqueGreen },
  ];
}

function getHeroSlideMeta(idx: number): { label: string; place: string } {
  const defaults = [
    { label: "Fasil Ghebbi",       place: "Gondar · UNESCO Heritage" },
    { label: "Axum Obelisks",      place: "Tigray · Ancient Kingdom" },
    { label: "Omo Valley Tribes",  place: "Southern Ethiopia · Cultural Immersion" },
    { label: "Anwar Grand Mosque", place: "Addis Ababa · Sacred Site" },
    { label: "Historic Mosques",   place: "Harar & Beyond · Living Faith" },
    { label: "Menelik II Memorial",place: "Addis Ababa · Imperial Legacy" },
  ];
  const d = defaults[idx];
  return {
    label: getContentOr(`hero-${idx}.label`, d.label),
    place: getContentOr(`hero-${idx}.place`, d.place),
  };
}

const socialLinks = [
  { href: "https://www.facebook.com/share/1Coq1kpvAt/", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com/sdflandoforigin", label: "Instagram", Icon: InstagramIcon },
  { href: "https://youtube.com/@deresseeshetu-b8f?si=EwVwSk2r25kGtYYo", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://www.tiktok.com/@pentagon_ethiopia?_r=1&_t=ZS-96NvdRmqZ17", label: "TikTok", Icon: TikTokIcon },
  { href: "https://wa.me/251911410884", label: "WhatsApp", Icon: WhatsAppIcon },
];

/* ── Booking modal ───────────────────────────────────────────────────────── */

const tourOptions = [
  "Addis Ababa City Tour",
  "Historical Tour (Lalibela / Axum / Gondar)",
  "Cultural Tour (Omo Valley)",
  "Adventure & Safari (Danakil)",
  "Trekking (Simien / Bale)",
  "Festival Tour",
  "Addis Ababa City Tours and Day Trips",
  "Combined / Multi-destination",
  "Custom / Not sure yet",
];

function BookingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", tour_interest: "", travel_date: "", group_size: "1", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitBooking(form);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  const waMsg = encodeURIComponent(
    `Hi SDF! My name is ${form.name}. I'd like to book a tour.\nTour: ${form.tour_interest || "TBD"}\nDate: ${form.travel_date || "TBD"}\nGroup: ${form.group_size} person(s)\n${form.message ? `Notes: ${form.message}` : ""}`
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[var(--shadow-deep)] overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--brand-green-deep)] px-8 py-6 text-white">
          <button type="button" onClick={onClose} className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-gold)] font-semibold mb-1">SDF Land of Origin</div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">Book Your Journey</h2>
          <p className="mt-1 text-white/70 text-sm">Fill in your details — we'll reach out within 24 hours.</p>
        </div>

        {done ? (
          <div className="px-8 py-10 text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)]">Request received!</h3>
            <p className="text-muted-foreground text-sm">We'll contact you at <strong>{form.phone}</strong> within 24 hours. For faster response, message us on WhatsApp now:</p>
            <a
              href={`https://wa.me/251911410884?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.8-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" /></svg>
              Continue on WhatsApp
            </a>
            <button type="button" onClick={onClose} className="block mx-auto text-sm text-muted-foreground hover:text-foreground underline">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Full Name *</span>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Phone / WhatsApp *</span>
                <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="+251 9XX XXX XXX"
                  className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10" />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Email <span className="text-muted-foreground font-normal normal-case">(optional)</span></span>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10" />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Tour Interest *</span>
              <select required value={form.tour_interest} onChange={(e) => set("tour_interest", e.target.value)}
                className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10">
                <option value="">Select a tour type…</option>
                {tourOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Travel Date *</span>
                <input required type="date" value={form.travel_date} onChange={(e) => set("travel_date", e.target.value)}
                  className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Group Size *</span>
                <select required value={form.group_size} onChange={(e) => set("group_size", e.target.value)}
                  className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10">
                  {["1","2","3–5","6–10","11–20","20+"].map((v) => <option key={v} value={v}>{v} {v === "1" ? "person" : "people"}</option>)}
                </select>
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-green-deep)]">Additional Notes <span className="text-muted-foreground font-normal normal-case">(optional)</span></span>
              <textarea value={form.message} onChange={(e) => set("message", e.target.value)}
                rows={3} placeholder="Special requirements, budget range, preferred activities…"
                className="w-full rounded-2xl border border-input bg-[var(--brand-sand)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10 resize-none" />
            </label>

            <button type="submit" disabled={submitting}
              className="w-full bg-[var(--brand-green-deep)] text-white font-bold py-4 rounded-2xl hover:bg-[var(--brand-green)] disabled:opacity-60 transition text-sm">
              {submitting ? "Sending…" : "Send Booking Request"}
            </button>
            <p className="text-center text-xs text-muted-foreground">We'll reply within 24 hours via phone or WhatsApp.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function getHeroSlides() {
  const defaults = [fasil, axum, tribe, anwar, mosqueGreen, menelik];
  return defaults.map((fallback, i) => ({
    img: getSiteImage(`hero-${i}`) ?? fallback,
    ...getHeroSlideMeta(i),
  }));
}

function HeroSlideshow({ onBook }: { onBook: () => void }) {
  const [slides]              = useState(() => getHeroSlides());
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setPrev(current);
    setCurrent(idx);
    setTransitioning(true);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 900);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const back = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <header className="relative h-[100vh] min-h-[640px] overflow-hidden">

      {/* ── Slide images ── */}
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        const isPrev   = idx === prev;
        return (
          <div
            key={idx}
            aria-hidden={!isActive}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
            style={{ opacity: isActive ? 1 : isPrev ? 0 : 0, zIndex: isActive ? 2 : isPrev ? 1 : 0 }}
          >
            <img
              src={slide.img}
              alt={slide.label}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: isActive ? "scale(1.08)" : "scale(1)",
                transition: isActive ? "transform 7s ease-out" : "none",
              }}
            />
          </div>
        );
      })}

      {/* ── Layered gradient overlays ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* ── NAV (inside hero so it sits above the gradient) ── */}
      <nav className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SDF Land of Origin" className="h-14 w-14 rounded-full object-cover drop-shadow-lg" />
          <div className="hidden sm:block leading-tight">
            <div className="font-[family-name:var(--font-display)] font-black text-xl text-white drop-shadow">SDF</div>
            <div className="text-[10px] tracking-[0.25em] text-white/80 uppercase">Land of Origin</div>
          </div>
        </div>
        <div className="hidden md:flex gap-7 text-sm text-white/90">
          <a href="/" className="hover:text-[var(--brand-gold)] transition font-medium">Home</a>
          <a href="#tours" className="hover:text-[var(--brand-gold)] transition">Destinations</a>
          <a href="/catalog" className="hover:text-[var(--brand-gold)] transition">Tour Packages</a>
          <a href="/blog" className="hover:text-[var(--brand-gold)] transition">Blog</a>
          <a href="#events" className="hover:text-[var(--brand-gold)] transition">Events</a>
          <a href="#contact" className="hover:text-[var(--brand-gold)] transition">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2">
            {socialLinks.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="h-8 w-8 rounded-full bg-white/10 border border-white/20 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] text-white flex items-center justify-center transition-all">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <button type="button" onClick={onBook} className="bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition shadow-lg">
            Book a Journey
          </button>
        </div>
      </nav>

      {/* ── Hero text ── */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 max-w-6xl">
        {/* Current slide label */}
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-[var(--brand-gold)]" />
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--brand-gold)] font-semibold">
            {slides[current].place}
          </span>
        </div>

        <span className="inline-flex w-fit items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.3em] text-white mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" />
          Tour · Travel · Events
        </span>

        <h1 className="font-[family-name:var(--font-display)] font-black text-white text-5xl md:text-7xl lg:text-8xl leading-[0.95] drop-shadow-2xl">
          Discover the
          <br />
          <span className="font-[family-name:var(--font-script)] font-bold text-[var(--brand-gold)] italic">Land of Origin</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg md:text-xl text-white/85 leading-relaxed">
          Ethiopia — cradle of humanity, home of ancient kingdoms, sacred churches, grand mosques, and 80+ living cultures.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#tours" className="bg-[var(--brand-red)] text-white px-8 py-4 rounded-full font-semibold shadow-[var(--shadow-warm)] hover:translate-y-[-2px] hover:shadow-lg transition">
            Explore Tours
          </a>
          <a href="/catalog" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition">
            Browse Packages
          </a>
        </div>
      </div>

      {/* ── Frosted-glass stat bar (bottom) ── */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-6 md:px-16 pb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Stats */}
          <div className="flex gap-6 sm:gap-10">
            {[["13+", "Heritage Sites"], ["80+", "Cultures"], ["3,000y", "Of History"], ["25+", "Tour Packages"]].map(([n, l]) => (
              <div key={l} className="backdrop-blur-md bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-center">
                <div className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black text-[var(--brand-gold)] leading-none">{n}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/60 mt-1">{l}</div>
              </div>
            ))}
          </div>

          {/* Slide controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button type="button" onClick={back} aria-label="Previous slide"
              className="h-10 w-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] transition flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-1.5">
              {slides.map((_, idx) => (
                <button key={idx} type="button" onClick={() => goTo(idx)} aria-label={`Slide ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${idx === current ? "w-6 h-2 bg-[var(--brand-gold)]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>

            <button type="button" onClick={next} aria-label="Next slide"
              className="h-10 w-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] transition flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Side social strip ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-30">
        {socialLinks.map(({ href, label, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
            className="h-9 w-9 rounded-full bg-white/10 border border-white/20 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] text-white flex items-center justify-center transition-all backdrop-blur-sm">
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </header>
  );
}

function TestimonialsSection() {
  const [items] = useState<Testimonial[]>(() => getTestimonials());

  return (
    <section id="testimonials" className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-xs tracking-[0.3em] uppercase text-[var(--brand-red)] font-semibold">What people say</span>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--brand-green-deep)]">What people say about us</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Demo testimonials — submissions are managed in the admin panel.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <blockquote key={t.id} className="rounded-2xl border p-6 text-left flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {t.image ? <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-[var(--brand-green-deep)]/10 flex items-center justify-center text-sm font-semibold">{t.name?.[0] ?? "?"}</div>}
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  {t.location ? <div className="text-xs text-muted-foreground">{t.location}</div> : null}
                </div>
              </div>
              <p className="italic text-lg">“{t.quote}”</p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Index() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [destinations]  = useState(() => getDestinations());
  const [catCards]      = useState(() => getCategoryCards());

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}

      <HeroSlideshow onBook={() => setBookingOpen(true)} />

      {/* ── EXPLORE · DISCOVER · EXPERIENCE — interactive panels ────────────── */}
      <section id="about" className="relative">
        <div className="grid md:grid-cols-3 min-h-[520px]">

          {/* EXPLORE */}
          <a
            href="#tours"
            className="group relative overflow-hidden cursor-pointer"
            style={{ minHeight: "420px" }}
          >
            <img src={getSiteImage("panel-explore") ?? fasil} alt="Explore Ethiopia" className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)]/90 via-[var(--brand-green-deep)]/40 to-[var(--brand-green-deep)]/20 group-hover:from-[var(--brand-green-deep)] group-hover:via-[var(--brand-green-deep)]/70 transition-all duration-500" />

            {/* Default state label */}
            <div className="absolute inset-x-0 bottom-0 p-8 translate-y-0 group-hover:-translate-y-4 transition-transform duration-500">
              <div className="inline-flex items-center gap-2 bg-[var(--brand-green)]/30 border border-[var(--brand-green)]/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] text-white mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" /> Journeys
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-black text-white drop-shadow-2xl">
                Explore
              </h2>
              <p className="mt-3 text-white/70 text-sm max-h-0 overflow-hidden group-hover:max-h-40 group-hover:mt-4 group-hover:text-white/90 transition-all duration-500 leading-relaxed">
                Curated heritage tours across Ethiopia's 13 months of sunshine — from Lalibela's rock-hewn churches carved in the 12th century to the alien landscape of the Danakil Depression.
              </p>
              <div className="mt-0 group-hover:mt-5 max-h-0 group-hover:max-h-12 overflow-hidden transition-all duration-500">
                <span className="inline-flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold">
                  View Tour Destinations
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>

            {/* Large number */}
            <div className="absolute top-8 right-8 font-[family-name:var(--font-display)] text-8xl font-black text-white/10 group-hover:text-white/5 transition select-none leading-none">01</div>
          </a>

          {/* DISCOVER */}
          <a
            href="/catalog"
            className="group relative overflow-hidden cursor-pointer"
            style={{ minHeight: "420px" }}
          >
            <img src={getSiteImage("panel-discover") ?? axum} alt="Discover Ethiopia" className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-red)]/90 via-[var(--brand-red)]/40 to-[var(--brand-red)]/10 group-hover:from-[var(--brand-red)] group-hover:via-[var(--brand-red)]/70 transition-all duration-500" />

            {/* Centre badge on non-hover */}
            <div className="absolute inset-0 flex items-center justify-center group-hover:items-end group-hover:pb-8 transition-all duration-500">
              <div className="text-center px-8 group-hover:text-left w-full">
                <div className="inline-flex items-center gap-2 bg-[var(--brand-red)]/30 border border-[var(--brand-red)]/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] text-white mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" /> Packages
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-black text-white drop-shadow-2xl">
                  Discover
                </h2>
                <p className="mt-3 text-white/70 text-sm max-h-0 overflow-hidden group-hover:max-h-40 group-hover:text-white/90 transition-all duration-500 leading-relaxed">
                  Pilgrimage routes, ancient mosques, monasteries, and the cradle of humanity. Browse our full catalog of tour packages — every journey a story rediscovered.
                </p>
                <div className="mt-0 group-hover:mt-5 max-h-0 group-hover:max-h-12 overflow-hidden transition-all duration-500">
                  <span className="inline-flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold">
                    Browse Tour Packages
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-8 right-8 font-[family-name:var(--font-display)] text-8xl font-black text-white/10 group-hover:text-white/5 transition select-none leading-none">02</div>
          </a>

          {/* EXPERIENCE */}
          <a
            href="#events"
            className="group relative overflow-hidden cursor-pointer"
            style={{ minHeight: "420px" }}
          >
            <img src={getSiteImage("panel-experience") ?? tribe} alt="Experience Ethiopia" className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-gold)]/80 via-[var(--brand-gold)]/30 to-[var(--brand-gold)]/10 group-hover:from-[var(--brand-gold)]/90 group-hover:via-[var(--brand-gold)]/60 transition-all duration-500" />

            <div className="absolute inset-x-0 bottom-0 p-8 translate-y-0 group-hover:-translate-y-4 transition-transform duration-500">
              <div className="inline-flex items-center gap-2 bg-[var(--brand-gold)]/30 border border-[var(--brand-gold)]/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] text-white mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Events & Culture
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-black text-white drop-shadow-2xl">
                Experience
              </h2>
              <p className="mt-3 text-white/80 text-sm max-h-0 overflow-hidden group-hover:max-h-40 group-hover:mt-4 group-hover:text-white transition-all duration-500 leading-relaxed">
                Festivals, coffee ceremonies, tribal traditions and full event organization — weddings, conferences, and cultural showcases crafted with Ethiopian elegance.
              </p>
              <div className="mt-0 group-hover:mt-5 max-h-0 group-hover:max-h-12 overflow-hidden transition-all duration-500">
                <span className="inline-flex items-center gap-2 text-[var(--brand-green-deep)] text-sm font-semibold">
                  See Events & Services
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>

            <div className="absolute top-8 right-8 font-[family-name:var(--font-display)] text-8xl font-black text-white/10 group-hover:text-white/5 transition select-none leading-none">03</div>
          </a>

        </div>
      </section>

      <TestimonialsSection />

      {/* DESTINATIONS */}
      <section id="tours" className="py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[var(--brand-red)] font-semibold">Signature Journeys</span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--brand-green-deep)]">
                Where heritage <span className="font-[family-name:var(--font-script)] text-[var(--brand-gold)]">comes alive</span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">From Aksumite obelisks and Gondar castles to Harari old town and the Omo Valley — Ethiopia's soul, curated.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <article key={d.title} className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "lg:row-span-2 lg:h-auto" : "h-80"}`}>
                <img src={d.img} alt={d.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)] via-[var(--brand-green-deep)]/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">{d.tag}</div>
                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <div className="text-xs uppercase tracking-widest text-[var(--brand-gold)] mb-1">{d.place}</div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold">{d.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TOUR PACKAGES — Browse trips that feel memorable */}
      <section id="catalog" className="py-24 px-6 md:px-16 bg-[linear-gradient(180deg,var(--brand-sand),#fff)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[var(--brand-red)] font-semibold">Tour Packages</span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--brand-green-deep)]">
                Browse trips that feel <span className="font-[family-name:var(--font-script)] text-[var(--brand-gold)]">memorable</span>
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                Choose a category and discover curated itineraries — each one designed to take you deeper into Ethiopia's soul.
              </p>
            </div>
            <a
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-green-deep)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-green)] hover:gap-3 whitespace-nowrap"
            >
              View All Packages
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {catCards.map((item) => (
              <a
                key={item.title}
                href="/catalog"
                className="group relative rounded-[2rem] overflow-hidden border border-[var(--brand-green)]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)]/70 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] group-hover:text-[var(--brand-red)] transition leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-[var(--brand-red)] text-sm font-semibold group-hover:gap-2 transition-all">
                    Browse tours <span>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="relative py-24 px-6 md:px-16 overflow-hidden">
        <img src={getSiteImage("events-bg") ?? menelik} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-green-deep)]/95 via-[var(--brand-green-deep)]/85 to-[var(--brand-red)]/80" />
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="text-xs tracking-[0.3em] uppercase text-[var(--brand-gold)] font-semibold">Events by SDF</span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold leading-tight">
              Beyond travel —<br />
              <span className="font-[family-name:var(--font-script)] text-[var(--brand-gold)]">we craft moments.</span>
            </h2>
            <p className="mt-6 text-white/85 leading-relaxed text-lg">
              Traditional weddings, corporate retreats, cultural festivals, conferences and bespoke gatherings. We bring Ethiopian elegance, hospitality and precision to every event we organize.
            </p>
            <ul className="mt-8 space-y-3">
              {["Cultural & Traditional Weddings", "Corporate Conferences & Retreats", "Festival & Pilgrimage Logistics", "Coffee Ceremonies & Hospitality"].map((it) => (
                <li key={it} className="flex items-center gap-3 text-white/90">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" /> {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={anwar} alt="Mosque" className="rounded-2xl h-56 w-full object-cover shadow-xl translate-y-6" />
            <img src={tribe} alt="Tribe" className="rounded-2xl h-56 w-full object-cover shadow-xl" />
            <img src={mosqueGreen} alt="Mosque" className="rounded-2xl h-56 w-full object-cover shadow-xl" />
            <img src={axum} alt="Axum" className="rounded-2xl h-56 w-full object-cover shadow-xl translate-y-6" />
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="py-24 px-6 md:px-16 bg-[var(--brand-sand)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--brand-red)] font-semibold">Ready to travel?</span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--brand-green-deep)]">
            Your Ethiopian story <span className="font-[family-name:var(--font-script)] text-[var(--brand-red)]">starts here.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground max-w-xl mx-auto">
            Fill in the booking form and we'll get back to you within 24 hours — or message us directly on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="bg-[var(--brand-green-deep)] text-white px-8 py-4 rounded-full font-bold shadow-[var(--shadow-deep)] hover:translate-y-[-2px] hover:bg-[var(--brand-green)] transition text-base"
            >
              Book a Journey
            </button>
            <a href="https://wa.me/251911410884" target="_blank" rel="noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:translate-y-[-2px] transition text-base flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.8-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z"/></svg>
              WhatsApp · 0911410884
            </a>
          </div>
          <div className="mt-10 flex justify-center gap-4">
            {socialLinks.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="h-11 w-11 rounded-full bg-[var(--brand-green-deep)] text-white hover:bg-[var(--brand-red)] hover:scale-110 flex items-center justify-center transition-all">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--brand-green-deep)] text-white/80 py-14 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="SDF" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-[family-name:var(--font-display)] font-bold text-white text-lg">SDF Land of Origin</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--brand-gold)]">Tour · Travel · Events</div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Ethiopia's premier tour operator — crafting heritage journeys, cultural experiences, and world-class events since day one.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand-gold)] font-semibold mb-5">Quick Links</div>
              <ul className="space-y-2.5 text-sm">
                {[["Home", "/"], ["Tour Destinations", "#tours"], ["Tour Packages", "/catalog"], ["Blog", "/blog"], ["Events", "#events"], ["Contact", "#contact"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-white/70 hover:text-white transition flex items-center gap-2">
                      <span className="h-px w-3 bg-[var(--brand-gold)]/50" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Social */}
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand-gold)] font-semibold mb-5">Connect With Us</div>
              <div className="space-y-3 text-sm mb-6">
                <a href="https://wa.me/251911410884" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition">
                  <WhatsAppIcon className="h-4 w-4 text-[var(--brand-gold)]" />
                  +251 911 410 884
                </a>
                <a href="mailto:hello@sdftours.com" className="flex items-center gap-3 text-white/80 hover:text-white transition">
                  <svg className="h-4 w-4 text-[var(--brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,12 2,6" /></svg>
                  hello@sdftours.com
                </a>
              </div>
              {/* Social icons */}
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green-deep)] text-white flex items-center justify-center transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <div>© {new Date().getFullYear()} SDF Land of Origin. All rights reserved.</div>
            <div>Made with ❤️ in Ethiopia 🇪🇹</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
