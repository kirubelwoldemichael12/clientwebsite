import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { getCatalogItems, type CatalogItem } from "@/lib/catalog";
import { getPackageDetail } from "@/lib/packageDetails";
import logo from "@/assets/sdf-logo.png";
import fasil from "@/assets/fasil-castle.jpg";
import axum from "@/assets/axum.jpg";
import gondar from "@/assets/gondar-tower.jpg";
import tribe from "@/assets/tribe.jpg";
import merkato from "@/assets/merkato.jpg";
import mosqueGreen from "@/assets/mosque-green.jpg";
import menelik from "@/assets/menelik-statue.jpg";
import anwar from "@/assets/anwar-mosque.jpg";

export const Route = createFileRoute("/catalog")({
  component: CatalogPage,
  head: () => ({
    meta: [
      { title: "Tour Packages — SDF Land of Origin" },
      { name: "description", content: "Browse curated Ethiopia travel packages: historical, cultural, adventure, trekking, festival and Addis Ababa city tours and day trips." },
    ],
  }),
});

/* ── Category definitions ─────────────────────────────────────────────────── */

const categories = [
  {
    key: "Addis Ababa City Tours and Day Trips",
    label: "Addis Ababa City Tours and Day Trips",
    desc: "Urban routes, food tastings, coffee ceremonies, nightlife and hidden gems in Ethiopia's vibrant capital.",
    image: merkato,
    accent: "from-amber-900/80",
    span: "md:col-span-2",   // wide card
  },
  {
    key: "Historical Tour",
    label: "Historical Tours",
    desc: "Lalibela's rock-hewn churches, Axum's ancient obelisks, Gondar's castles, and pre-Aksumite heritage sites.",
    image: axum,
    accent: "from-stone-900/80",
    span: "",
  },
  {
    key: "Cultural Tours",
    label: "Cultural Tours",
    desc: "Omo Valley tribes — Mursi, Hamer, Karo — living traditions, body art, and community ceremonies.",
    image: tribe,
    accent: "from-orange-900/80",
    span: "",
  },
  {
    key: "Adventure and Safari Tour",
    label: "Adventure & Safari",
    desc: "Danakil Depression, Erta Ale lava lake, salt flats, national parks and wildlife safaris.",
    image: gondar,
    accent: "from-green-900/80",
    span: "",
  },
  {
    key: "Trekking Tours",
    label: "Trekking Tours",
    desc: "Bale Mountains, Simien highlands, Tigray cliff churches — multi-day treks through Ethiopia's rooftop.",
    image: fasil,
    accent: "from-blue-900/80",
    span: "",
  },
  {
    key: "Combined Tours",
    label: "Combined Tours",
    desc: "Grand itineraries blending Danakil, Lalibela, Gondar and the Omo Valley in one epic journey.",
    image: menelik,
    accent: "from-purple-900/80",
    span: "md:col-span-2",   // wide card
  },
  {
    key: "Festival Tour",
    label: "Festival Tours",
    desc: "Genna Christmas, Timket Epiphany and Meskel — witness Ethiopia's most spectacular celebrations.",
    image: anwar,
    accent: "from-red-900/80",
    span: "",
  },
  {
    key: "Coffee Tour",
    label: "Coffee Tours",
    desc: "From Addis tastings to Sidama and Yirgacheffe origins — explore Ethiopia's coffee heritage from bean to cup.",
    image: mosqueGreen,
    accent: "from-amber-900/80",
    span: "",
  },
  
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

// Maps the stored item.category to the public-facing category key.
// The saved category field is authoritative — title keywords are a last-resort
// fallback for legacy items that have no recognised category string.
function mapItemToPublicCategory(item: CatalogItem): string {
  const cat = item.category || "";

  // 1. Direct exact-match (most reliable — uses whatever the admin saved)
  const exact: Record<string, string> = {
    "Addis Ababa City Tours and Day Trips": "Addis Ababa City Tours and Day Trips",
    "Historical Tours": "Historical Tour",
    "Historical Tour": "Historical Tour",
    "Cultural Tours": "Cultural Tours",
    "Adventure and Safari Tour": "Adventure and Safari Tour",
    "Trekking Tours": "Trekking Tours",
    "Combined Tours": "Combined Tours",
    "Festival Tours": "Festival Tour",
    "Festival Tour": "Festival Tour",
    "Coffee Tour": "Coffee Tour",
  };
  if (exact[cat]) return exact[cat];

  // 2. Partial category-field match (handles minor spelling differences)
  const cl = cat.toLowerCase();
  if (cl.includes("addis") || cl.includes("city tour")) return "Addis Ababa City Tours and Day Trips";
  if (cl.includes("historical") || cl.includes("history")) return "Historical Tour";
  if (cl.includes("cultural") || cl.includes("culture")) return "Cultural Tours";
  if (cl.includes("adventure") || cl.includes("safari")) return "Adventure and Safari Tour";
  if (cl.includes("trek")) return "Trekking Tours";
  if (cl.includes("combined")) return "Combined Tours";
  if (cl.includes("festival")) return "Festival Tour";
  if (cl.includes("coffee")) return "Coffee Tour";

  // 3. Title-based fallback for items with unrecognised category strings only
  const t = (item.title || "").toLowerCase();
  if (t.includes("addis") || t.includes("city") || t.includes("day trip") || t.includes("food tasting") || t.includes("nightlife")) return "Addis Ababa City Tours and Day Trips";
  if (t.includes("lalibela") || t.includes("axum") || t.includes("tiya") || t.includes("adadi")) return "Historical Tour";
  if (t.includes("omo valley") || t.includes("tribal") || t.includes("mursi") || t.includes("hamer") || t.includes("karo")) return "Cultural Tours";
  if (t.includes("danakil") || t.includes("erta ale") || t.includes("safari") || t.includes("wildlife")) return "Adventure and Safari Tour";
  if (t.includes("trekking") || t.includes("simien") || t.includes("bale mountain")) return "Trekking Tours";
  if (t.includes("combined")) return "Combined Tours";
  if (t.includes("genna") || t.includes("timket") || t.includes("meskel")) return "Festival Tour";
  if (t.includes("coffee") || t.includes("yirgacheffe") || t.includes("sidama")) return "Coffee Tour";

  return "Other";
}

/* ── Route shell (handles nested /catalog/$id) ───────────────────────────── */

function CatalogPage() {
  const childMatches = useChildMatches();
  if (childMatches.length > 0) return <Outlet />;
  return <CatalogShell />;
}

/* ── Main catalog shell ──────────────────────────────────────────────────── */

function CatalogShell() {
  const [items, setItems]           = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [selected, setSelected]     = useState<string | null>(null);

  // Support ?category= deep-link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && categories.find((c) => c.key === cat)) setSelected(cat);

    setIsLoading(true);
    let isMounted = true;
    getCatalogItems()
      .then((data) => { if (isMounted) setItems(data); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const visibleItems = useMemo(() => {
    if (!selected) return [];
    return items.filter((item) => {
      const mapped = mapItemToPublicCategory(item);
      return mapped === selected || item.category === selected;
    });
  }, [selected, items]);

  const countFor = (key: string) =>
    items.filter((item) => {
      const m = mapItemToPublicCategory(item);
      return m === key || item.category === key;
    }).length;

  const activeCat = categories.find((c) => c.key === selected);

  return (
    <div className="min-h-screen bg-[var(--brand-sand)] text-foreground font-sans">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="SDF Land of Origin" className="h-14 w-14 rounded-full object-cover drop-shadow-lg" />
          <div className="hidden sm:block leading-tight">
            <div className="font-[family-name:var(--font-display)] font-black text-xl text-white drop-shadow">SDF</div>
            <div className="text-[10px] tracking-[0.25em] text-white/80 uppercase">Land of Origin</div>
          </div>
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-white/90">
          <Link to="/" className="hover:text-[var(--brand-gold)] transition">Home</Link>
          <span className="text-[var(--brand-gold)] font-semibold">Tour Package</span>
          <Link to="/blog" className="hover:text-[var(--brand-gold)] transition">Blog</Link>
        </div>
        <a href="https://wa.me/251911410884" target="_blank" rel="noreferrer"
          className="bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition shadow-lg">
          Book a Journey
        </a>
      </nav>

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden" style={{ height: selected ? "40vh" : "52vh", minHeight: "320px", transition: "height 0.5s ease" }}>
        <img
          src={activeCat?.image ?? merkato}
          alt="tour packages"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${activeCat?.accent ?? "from-[var(--brand-green-deep)]/80"} via-black/40 to-[var(--brand-sand)]`} />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-10 max-w-7xl mx-auto">
          {/* breadcrumb when a category is chosen */}
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mb-4 self-start flex items-center gap-2 text-white/70 hover:text-white text-sm transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Categories
            </button>
          )}
          <div className="inline-flex w-fit items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.3em] text-white mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" />
            {selected ? activeCat?.label : "SDF Tour Packages"}
          </div>
          <h1 className="font-[family-name:var(--font-display)] font-black text-white text-4xl md:text-6xl leading-tight drop-shadow-2xl">
            {selected
              ? activeCat?.label
              : <>Choose your <span className="font-[family-name:var(--font-script)] text-[var(--brand-gold)]">journey</span></>
            }
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl text-base md:text-lg">
            {selected
              ? `${isLoading ? "..." : visibleItems.length} tour${visibleItems.length !== 1 ? "s" : ""} available — click any package to see the full itinerary.`
              : "Select a category below to browse curated Ethiopian tour packages."}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW A — CATEGORY SELECTION GRID (no category chosen)
      ══════════════════════════════════════════════════════════════════════ */}
      {!selected && (
        <section className="px-6 md:px-16 py-12 max-w-7xl mx-auto">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 auto-rows-[260px]">
            {categories.map((cat, i) => {
              const count = isLoading ? null : countFor(cat.key);
              const isWide = cat.span.includes("col-span-2");
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelected(cat.key)}
                  className={`group relative overflow-hidden rounded-[2rem] text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-gold)] ${cat.span} ${isWide ? "xl:col-span-2" : ""}`}
                  style={{ gridRow: i < 2 ? "span 1" : undefined }}
                >
                  {/* Background photo */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} via-black/30 to-transparent group-hover:via-black/50 transition-all duration-500`} />

                  {/* Package count badge */}
                  {count != null && count > 0 && (
                    <div className="absolute top-5 right-5 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-xs font-bold px-3 py-1 rounded-full">
                      {count} tour{count !== 1 ? "s" : ""}
                    </div>
                  )}

                  {/* Text content */}
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black text-white drop-shadow-xl leading-tight">
                      {cat.label}
                    </h2>
                    <p className="mt-2 text-white/70 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 group-hover:text-white/90 transition-all duration-500">
                      {cat.desc}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                      Browse packages
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom trip CTA */}
          <div className="mt-10 rounded-[2rem] bg-[var(--brand-green-deep)] text-white px-10 py-12 relative overflow-hidden shadow-[var(--shadow-deep)]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_50%,_var(--brand-gold),_transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="text-[var(--brand-gold)] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Custom Trips</div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold">
                  Can't find what you're looking for?<br />
                  <span className="font-[family-name:var(--font-script)] text-[var(--brand-gold)]">We build it from scratch.</span>
                </h3>
                <p className="mt-2 text-white/70 max-w-lg text-sm">Share your dates, group size, and interests — we'll design your perfect Ethiopian adventure.</p>
              </div>
              <div className="flex flex-wrap gap-3 flex-shrink-0">
                <a href="https://wa.me/251911410884" target="_blank" rel="noreferrer"
                  className="bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-bold px-6 py-3 rounded-full hover:scale-105 transition">
                  WhatsApp Us
                </a>
                <a href="mailto:hello@sdftours.com"
                  className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition">
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW B — PACKAGE LIST (category chosen)
      ══════════════════════════════════════════════════════════════════════ */}
      {selected && (
        <section className="px-6 md:px-16 py-10 max-w-7xl mx-auto">

          {/* Category pill strip — lets user switch without going back */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelected(cat.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selected === cat.key
                    ? "bg-[var(--brand-green-deep)] text-white shadow-md"
                    : "bg-white text-[var(--brand-green-deep)] border border-[var(--brand-green)]/20 hover:border-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl bg-white h-80 animate-pulse shadow-sm border border-[var(--brand-green)]/10" />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[var(--brand-green)]/10 px-8">
              <div className="h-16 w-16 rounded-full bg-[var(--brand-sand)] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
              <p className="text-lg font-semibold text-[var(--brand-green-deep)]">No packages in this category yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Go to <a href="/admin/catalog" className="text-[var(--brand-red)] underline font-medium">Admin → Catalog</a> to add packages for this category.</p>
              <button type="button" onClick={() => setSelected(null)} className="mt-5 text-sm text-muted-foreground hover:text-foreground underline">
                Back to all categories
              </button>
            </div>
          ) : (
            <>
            {(() => {
              const itemCount = visibleItems.length;
              let itemWidthClass = "";
              if (itemCount === 1) {
                itemWidthClass = "w-full max-w-2xl";
              } else if (itemCount % 2 === 0) { // even
                if (itemCount <= 4) {
                  itemWidthClass = "w-full md:w-[calc(50%-14px)]";
                } else if (itemCount === 6) {
                  itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(33.333%-19px)]";
                } else {
                  itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(25%-21px)]";
                }
              } else { // odd
                if (itemCount === 3 || itemCount === 5) {
                  itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(33.333%-19px)]";
                } else {
                  itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(25%-21px)]";
                }
              }

              return (
                <div className="flex flex-wrap gap-7 justify-center">
                  {visibleItems.map((item, index) => {
                    const detail     = getPackageDetail(item.id);
                    // Admin data always wins; static detail is fallback only
                    const heroImg    = item.image ?? detail?.hero ?? fasil;
                    const badge      = detail?.badge;
                    const difficulty = detail?.difficulty;
                    const mappedCat  = mapItemToPublicCategory(item);
                    // Description: admin summary/description first, static overview last
                    const cardDesc   = item.summary || item.description || detail?.overview || "";

                    return (
                      <div key={item.id} className={`${itemWidthClass} flex flex-col`}>
                        <Link
                          to="/catalog/$id"
                          params={{ id: item.id }}
                          className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-[var(--brand-green)]/10 hover:-translate-y-2 hover:shadow-[var(--shadow-deep)] transition-all duration-300 flex flex-col flex-1"
                        >
                          {/* Image */}
                          <div className="relative overflow-hidden h-52">
                            <img src={heroImg} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)]/60 via-transparent to-transparent" />
                            {badge && (
                              <div className="absolute top-4 left-4 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                                {badge}
                              </div>
                            )}
                            {difficulty && (
                              <div className={`absolute bottom-4 right-4 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                                difficulty === "Easy"       ? "bg-emerald-500/80 text-white" :
                                difficulty === "Moderate"   ? "bg-amber-500/80 text-white" :
                                difficulty === "Challenging"? "bg-orange-500/80 text-white" :
                                                              "bg-red-600/80 text-white"
                              }`}>
                                {difficulty}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex flex-col flex-1 p-7">
                            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--brand-red)] font-semibold mb-2">
                              {mappedCat !== "Other" ? mappedCat : item.category}
                            </div>
                            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] leading-snug group-hover:text-[var(--brand-red)] transition">
                              {item.title}
                            </h2>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                              {cardDesc}
                            </p>
                            <div className="mt-5 flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {item.duration && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 text-[var(--brand-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" /></svg>
                                    {item.duration}
                                  </span>
                                )}
                                {item.location && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 text-[var(--brand-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                                    {item.location}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[var(--brand-red)] text-sm font-semibold group-hover:gap-2 transition-all">
                                  View
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            </>
          )}

          {/* Back to categories */}
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-green-deep)] text-[var(--brand-green-deep)] font-semibold px-7 py-3 hover:bg-[var(--brand-green-deep)] hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
              Back to All Categories
            </button>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--brand-green-deep)] text-white/80 py-10 px-6 md:px-16 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SDF" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <div className="font-[family-name:var(--font-display)] font-bold text-white">SDF Land of Origin</div>
              <div className="text-xs uppercase tracking-widest text-[var(--brand-gold)]">Tour · Travel · Events</div>
            </div>
          </div>
          <div className="text-sm">© {new Date().getFullYear()} SDF Land of Origin. Made in Ethiopia 🇪🇹</div>
        </div>
      </footer>
    </div>
  );
}
