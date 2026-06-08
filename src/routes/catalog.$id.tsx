import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getCatalogItems, type CatalogItem } from "@/lib/catalog";
import { getPackageDetail, getRelatedPackages } from "@/lib/packageDetails";
import logo from "@/assets/sdf-logo.png";
import fasil from "@/assets/fasil-castle.jpg";

export const Route = createFileRoute("/catalog/$id")({
  component: PackageDetailPage,
});

function PackageDetailPage() {
  const { id } = Route.useParams();
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "included" | "gallery">("overview");
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

  const detail = getPackageDetail(id);
  const related = detail ? getRelatedPackages(id, detail.category) : [];

  useEffect(() => {
    getCatalogItems().then((items) => {
      const found = items.find((i) => i.id === id);
      setItem(found ?? null);
    });
    window.scrollTo(0, 0);
  }, [id]);

  // Admin-saved fields on catalog items are the source of truth; static details are fallback only.
  const heroImage = item?.image ?? detail?.hero ?? fasil;
  const gallery = (item?.gallery && item.gallery.length > 0)
    ? item.gallery
    : (detail?.gallery && detail.gallery.length > 0)
      ? detail.gallery
      : [heroImage];
  const title = item?.title ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const category = item?.category ?? detail?.category ?? "Tour Package";
  const duration = item ? item.duration : (detail?.itinerary?.length ? `${detail.itinerary.length} days` : "Custom");
  const location = item ? item.location : "Ethiopia";
  const overviewText = item?.overview ?? detail?.overview ?? item?.description ?? "Contact us for full details on this exclusive Ethiopian experience.";
  const itemItineraryText = (item?.itinerary ?? "").trim();
  const includedItems = (item?.included && item.included.length > 0)
    ? item.included
    : (detail?.included ?? ["Professional guide", "Transportation", "All listed activities"]);
  const excludedItems = (item?.excluded && item.excluded.length > 0)
    ? item.excluded
    : (detail?.excluded ?? ["International flights", "Travel insurance", "Personal expenses", "Tips"]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "included", label: "What's Included" },
    { key: "gallery", label: "Gallery" },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--brand-sand)] text-foreground font-sans">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[var(--brand-green-deep)]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="SDF" className="h-10 w-10 rounded-full object-cover" />
            <div className="hidden sm:block">
              <div className="font-[family-name:var(--font-display)] font-black text-white text-lg leading-none">SDF</div>
              <div className="text-[9px] tracking-[0.25em] text-white/70 uppercase">Land of Origin</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <Link to="/" className="hover:text-[var(--brand-gold)] transition">Home</Link>
            <Link to="/catalog" className="hover:text-[var(--brand-gold)] transition">Packages</Link>
            <Link to="/blog" className="hover:text-[var(--brand-gold)] transition">Blog</Link>
          </div>
          <a href="https://wa.me/251911410884" target="_blank" rel="noreferrer" className="bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-semibold px-4 py-2 rounded-full text-sm hover:scale-105 transition shadow-lg">
            Book Now
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden pt-16">
        <img src={heroImage} alt={title} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)]/90 via-[var(--brand-green-deep)]/40 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-10 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-white transition">Packages</Link>
            <span>/</span>
            <span className="text-white/90">{category}</span>
          </nav>
          {detail?.badge ? (
            <span className="inline-flex w-fit items-center gap-1.5 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green-deep)]" />
              {detail.badge}
            </span>
          ) : null}
          <h1 className="font-[family-name:var(--font-display)] font-black text-white text-4xl md:text-6xl leading-tight drop-shadow-2xl max-w-4xl">{title}</h1>
          <div className="mt-5 flex flex-wrap gap-5 text-white/80 text-sm">
            {duration && <span className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-[var(--brand-gold)]" /> {duration}</span>}
            {location && <span className="flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-[var(--brand-gold)]" /> {location}</span>}
            {detail?.groupSize ? <span className="flex items-center gap-2"><UsersIcon className="w-4 h-4 text-[var(--brand-gold)]" /> {detail.groupSize}</span> : null}
            {detail?.difficulty ? (
              <span className={`flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold ${
                detail.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-300" :
                detail.difficulty === "Moderate" ? "bg-amber-500/20 text-amber-300" :
                detail.difficulty === "Challenging" ? "bg-orange-500/20 text-orange-300" :
                "bg-red-500/20 text-red-300"
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> {detail.difficulty}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 grid lg:grid-cols-3 gap-10">

        {/* LEFT: TABS */}
        <div className="lg:col-span-2 space-y-8">

          {/* TAB STRIP */}
          <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-[var(--brand-green)]/10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[80px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-[var(--brand-green-deep)] text-white shadow-sm"
                    : "text-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-5">About This Tour</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {overviewText}
                </p>
                {item?.summary && item.summary !== overviewText ? (
                  <p className="mt-4 text-muted-foreground leading-relaxed">{item.summary}</p>
                ) : null}
              </div>

              {detail?.highlights?.length ? (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-5">Tour Highlights</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {detail.highlights.map((hl) => (
                      <li key={hl} className="flex items-start gap-3">
                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-[var(--brand-gold)] text-xs">✓</span>
                        </span>
                        <span className="text-sm text-foreground leading-relaxed">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {item?.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[var(--brand-green)]/20 bg-white px-4 py-1.5 text-xs font-medium text-[var(--brand-green-deep)] shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* ITINERARY TAB */}
          {activeTab === "itinerary" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {detail?.itinerary?.length ? (
                detail.itinerary.map((day, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-7 shadow-sm border border-[var(--brand-green)]/10 flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[var(--brand-green-deep)] text-white flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-sm">
                        {day.day}
                      </div>
                      {idx < (detail?.itinerary?.length ?? 0) - 1 ? (
                        <div className="w-px bg-[var(--brand-green)]/20 mx-auto mt-1" style={{ height: "calc(100% - 40px - 4px)" }} />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--brand-green-deep)]">{day.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs">
                        {day.meals ? (
                          <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full">
                            <span>🍽</span> {day.meals}
                          </span>
                        ) : null}
                        {day.accommodation ? (
                          <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-full">
                            <span>🏨</span> {day.accommodation}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : itemItineraryText ? (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-5">Itinerary</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{itemItineraryText}</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-10 text-center text-muted-foreground shadow-sm border border-[var(--brand-green)]/10">
                  <p className="text-base">Detailed itinerary available on request.</p>
                  <a href="https://wa.me/251911410884" target="_blank" rel="noreferrer" className="mt-4 inline-block bg-[var(--brand-green-deep)] text-white px-6 py-3 rounded-full text-sm font-semibold hover:scale-105 transition">
                    Request Itinerary
                  </a>
                </div>
              )}
            </div>
          )}

          {/* INCLUDED TAB */}
          {activeTab === "included" && (
            <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] mb-5 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm font-bold">✓</span>
                  What's Included
                </h2>
                <ul className="space-y-3">
                  {includedItems.map((inc) => (
                    <li key={inc} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 text-emerald-500 flex-shrink-0 font-bold">✓</span>
                      <span className="text-foreground">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] mb-5 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 text-sm font-bold">✕</span>
                  What's Excluded
                </h2>
                <ul className="space-y-3">
                  {excludedItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 text-red-400 flex-shrink-0 font-bold">✕</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="rounded-3xl overflow-hidden shadow-sm border border-[var(--brand-green)]/10 bg-white">
                <img
                  src={gallery[activeGalleryIdx]}
                  alt={`Gallery ${activeGalleryIdx + 1}`}
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGalleryIdx(idx)}
                    className={`rounded-2xl overflow-hidden h-20 border-2 transition ${
                      activeGalleryIdx === idx ? "border-[var(--brand-gold)] shadow-[var(--shadow-warm)]" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RELATED TOURS */}
          {related.length > 0 && (
            <div className="pt-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-6">
                More in <span className="font-[family-name:var(--font-script)] text-[var(--brand-gold)]">{category}</span>
              </h2>
              {(() => {
                const relatedCount = related.length;
                let relatedWidthClass = "";
                if (relatedCount === 1) {
                  relatedWidthClass = "w-full max-w-xl";
                } else if (relatedCount % 2 === 0) { // even
                  if (relatedCount <= 4) {
                    relatedWidthClass = "w-full sm:w-[calc(50%-10px)]";
                  } else if (relatedCount === 6) {
                    relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)]";
                  } else {
                    relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)]";
                  }
                } else { // odd
                  if (relatedCount === 3 || relatedCount === 5) {
                    relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)]";
                  } else {
                    relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)]";
                  }
                }

                return (
                  <div className="flex flex-wrap gap-5 justify-center">
                    {related.map((pkg) => (
                      <div key={pkg.id} className={`${relatedWidthClass} flex flex-col`}>
                        <Link
                          to="/catalog/$id"
                          params={{ id: pkg.id }}
                          onClick={() => { setActiveTab("overview"); window.scrollTo(0,0); }}
                          className="group rounded-3xl bg-white border border-[var(--brand-green)]/10 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-deep)] transition flex flex-col flex-1"
                        >
                          <div className="h-44 overflow-hidden">
                            <img src={pkg.hero} alt={pkg.id} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            {pkg.badge ? <span className="text-[10px] uppercase tracking-widest text-[var(--brand-red)] font-bold">{pkg.badge}</span> : null}
                            <div className="mt-1 font-[family-name:var(--font-display)] font-bold text-[var(--brand-green-deep)] text-base leading-snug flex-1">
                              {pkg.id.replace(/-(\d+)$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t border-[var(--brand-sand)]/50">
                              <ClockIcon className="w-3 h-3 text-[var(--brand-green)]" /> {pkg.itinerary.length} days
                              <span className="ml-auto text-[var(--brand-red)] font-semibold">{pkg.priceFrom}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* RIGHT: BOOKING SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5">

            {/* Price & Book Card */}
            <div className="bg-[var(--brand-green-deep)] rounded-3xl p-8 text-white shadow-[var(--shadow-deep)]">
              <div className="text-[var(--brand-gold)] text-xs uppercase tracking-widest font-semibold mb-2">Starting from</div>
              <div className="font-[family-name:var(--font-display)] text-4xl font-black">
                {detail?.priceFrom ?? "Contact Us"}
              </div>
              {detail?.departure ? (
                <div className="mt-3 text-white/70 text-sm flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> {detail.departure}
                </div>
              ) : null}
              <div className="mt-6 space-y-3">
                <a
                  href="https://wa.me/251911410884"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-bold px-6 py-4 rounded-2xl hover:scale-[1.02] transition text-base shadow-[var(--shadow-warm)]"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Book via WhatsApp
                </a>
                <a
                  href="mailto:hello@sdftours.com"
                  className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/20 transition text-sm"
                >
                  <MailIcon className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-[var(--brand-green)]/10 space-y-4">
              <h3 className="font-[family-name:var(--font-display)] font-bold text-[var(--brand-green-deep)] text-lg">Quick Info</h3>
              {[
                duration ? { icon: <ClockIcon className="w-4 h-4" />, label: "Duration", value: duration } : null,
                location ? { icon: <MapPinIcon className="w-4 h-4" />, label: "Location", value: location } : null,
                detail?.groupSize ? { icon: <UsersIcon className="w-4 h-4" />, label: "Group Size", value: detail.groupSize } : null,
                detail?.difficulty ? { icon: <MountainIcon className="w-4 h-4" />, label: "Difficulty", value: detail.difficulty } : null,
                { icon: <TagIcon className="w-4 h-4" />, label: "Category", value: category },
              ].filter(Boolean).map((info) => (
                <div key={info!.label} className="flex items-center justify-between text-sm border-b border-[var(--brand-sand)] pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-[var(--brand-green)]">{info!.icon}</span>
                    {info!.label}
                  </div>
                  <div className="font-semibold text-[var(--brand-green-deep)]">{info!.value}</div>
                </div>
              ))}
            </div>

            {/* Back to catalog */}
            <Link
              to="/catalog"
              className="flex items-center gap-2 text-sm text-[var(--brand-green-deep)] font-semibold hover:text-[var(--brand-red)] transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              All Tour Packages
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[var(--brand-green-deep)] text-white/80 py-10 px-6 md:px-16 mt-12">
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  );
}
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function MountainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M3 20l6.5-13L13 13l3-4 5 11H3z" />
    </svg>
  );
}
function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.8-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,12 2,6" />
    </svg>
  );
}
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
