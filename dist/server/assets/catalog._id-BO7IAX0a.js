import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BZd-ePnj.js";
import { R as Route, L as Link } from "./router-CN2cERqh.js";
import { g as getCatalogItems } from "./catalog-k1yCID7G.js";
import { a as getRelatedPackages, g as getPackageDetail } from "./packageDetails-CQKNAxNG.js";
import { f as fasil, l as logo } from "./sdf-logo-BbxpDnEG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./supabase-Bsb1TV-S.js";
import "./axum-DTnEoTvJ.js";
import "./anwar-mosque-Ci05BTGM.js";
import "./merkato-TMH4p3Xx.js";
function PackageDetailPage() {
  const {
    id
  } = Route.useParams();
  const [item, setItem] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [activeGalleryIdx, setActiveGalleryIdx] = reactExports.useState(0);
  const detail = getPackageDetail(id);
  const related = detail ? getRelatedPackages(id, detail.category) : [];
  reactExports.useEffect(() => {
    getCatalogItems().then((items) => {
      const found = items.find((i) => i.id === id);
      setItem(found ?? null);
    });
    window.scrollTo(0, 0);
  }, [id]);
  const heroImage = item?.image ?? detail?.hero ?? fasil;
  const gallery = item?.gallery && item.gallery.length > 0 ? item.gallery : detail?.gallery && detail.gallery.length > 0 ? detail.gallery : [heroImage];
  const title = item?.title ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const category = item?.category ?? detail?.category ?? "Tour Package";
  const duration = item ? item.duration : detail?.itinerary?.length ? `${detail.itinerary.length} days` : "Custom";
  const location = item ? item.location : "Ethiopia";
  const overviewText = item?.overview ?? detail?.overview ?? item?.description ?? "Contact us for full details on this exclusive Ethiopian experience.";
  const itemItineraryText = (item?.itinerary ?? "").trim();
  const includedItems = item?.included && item.included.length > 0 ? item.included : detail?.included ?? ["Professional guide", "Transportation", "All listed activities"];
  const excludedItems = item?.excluded && item.excluded.length > 0 ? item.excluded : detail?.excluded ?? ["International flights", "Travel insurance", "Personal expenses", "Tips"];
  const tabs = [{
    key: "overview",
    label: "Overview"
  }, {
    key: "itinerary",
    label: "Itinerary"
  }, {
    key: "included",
    label: "What's Included"
  }, {
    key: "gallery",
    label: "Gallery"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[var(--brand-sand)] text-foreground font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap", rel: "stylesheet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed top-0 inset-x-0 z-50 bg-[var(--brand-green-deep)]/95 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "SDF", className: "h-10 w-10 rounded-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[family-name:var(--font-display)] font-black text-white text-lg leading-none", children: "SDF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] tracking-[0.25em] text-white/70 uppercase", children: "Land of Origin" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-6 text-sm text-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-[var(--brand-gold)] transition", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/catalog", className: "hover:text-[var(--brand-gold)] transition", children: "Packages" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "hover:text-[var(--brand-gold)] transition", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-semibold px-4 py-2 rounded-full text-sm hover:scale-105 transition shadow-lg", children: "Book Now" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[60vh] min-h-[420px] overflow-hidden pt-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImage, alt: title, className: "absolute inset-0 w-full h-full object-cover scale-105" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)]/90 via-[var(--brand-green-deep)]/40 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-10 max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-white transition", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/catalog", className: "hover:text-white transition", children: "Packages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/90", children: category })
        ] }),
        detail?.badge ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex w-fit items-center gap-1.5 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--brand-green-deep)]" }),
          detail.badge
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[family-name:var(--font-display)] font-black text-white text-4xl md:text-6xl leading-tight drop-shadow-2xl max-w-4xl", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-5 text-white/80 text-sm", children: [
          duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClockIcon, { className: "w-4 h-4 text-[var(--brand-gold)]" }),
            " ",
            duration
          ] }),
          location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinIcon, { className: "w-4 h-4 text-[var(--brand-gold)]" }),
            " ",
            location
          ] }),
          detail?.groupSize ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UsersIcon, { className: "w-4 h-4 text-[var(--brand-gold)]" }),
            " ",
            detail.groupSize
          ] }) : null,
          detail?.difficulty ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold ${detail.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-300" : detail.difficulty === "Moderate" ? "bg-amber-500/20 text-amber-300" : detail.difficulty === "Challenging" ? "bg-orange-500/20 text-orange-300" : "bg-red-500/20 text-red-300"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }),
            " ",
            detail.difficulty
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-16 py-12 grid lg:grid-cols-3 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-[var(--brand-green)]/10 overflow-x-auto", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setActiveTab(tab.key), className: `flex-1 min-w-[80px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.key ? "bg-[var(--brand-green-deep)] text-white shadow-sm" : "text-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)]"}`, children: tab.label }, tab.key)) }),
        activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-5", children: "About This Tour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed text-base", children: overviewText }),
            item?.summary && item.summary !== overviewText ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: item.summary }) : null
          ] }),
          detail?.highlights?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-5", children: "Tour Highlights" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid sm:grid-cols-2 gap-3", children: detail.highlights.map((hl) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 h-5 w-5 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--brand-gold)] text-xs", children: "✓" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground leading-relaxed", children: hl })
            ] }, hl)) })
          ] }) : null,
          item?.tags?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: item.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-[var(--brand-green)]/20 bg-white px-4 py-1.5 text-xs font-medium text-[var(--brand-green-deep)] shadow-sm", children: tag }, tag)) }) : null
        ] }),
        activeTab === "itinerary" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 animate-in fade-in duration-300", children: detail?.itinerary?.length ? detail.itinerary.map((day, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-7 shadow-sm border border-[var(--brand-green)]/10 flex gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-[var(--brand-green-deep)] text-white flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-sm", children: day.day }),
            idx < (detail?.itinerary?.length ?? 0) - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px bg-[var(--brand-green)]/20 mx-auto mt-1", style: {
              height: "calc(100% - 40px - 4px)"
            } }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[family-name:var(--font-display)] text-lg font-bold text-[var(--brand-green-deep)]", children: day.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: day.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-3 text-xs", children: [
              day.meals ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🍽" }),
                " ",
                day.meals
              ] }) : null,
              day.accommodation ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🏨" }),
                " ",
                day.accommodation
              ] }) : null
            ] })
          ] })
        ] }, idx)) : itemItineraryText ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-5", children: "Itinerary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-line", children: itemItineraryText })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-10 text-center text-muted-foreground shadow-sm border border-[var(--brand-green)]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base", children: "Detailed itinerary available on request." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "mt-4 inline-block bg-[var(--brand-green-deep)] text-white px-6 py-3 rounded-full text-sm font-semibold hover:scale-105 transition", children: "Request Itinerary" })
        ] }) }),
        activeTab === "included" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-8 w-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm font-bold", children: "✓" }),
              "What's Included"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: includedItems.map((inc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-emerald-500 flex-shrink-0 font-bold", children: "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: inc })
            ] }, inc)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-8 shadow-sm border border-[var(--brand-green)]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-8 w-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 text-sm font-bold", children: "✕" }),
              "What's Excluded"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: excludedItems.map((item2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-red-400 flex-shrink-0 font-bold", children: "✕" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: item2 })
            ] }, item2)) })
          ] })
        ] }),
        activeTab === "gallery" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden shadow-sm border border-[var(--brand-green)]/10 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gallery[activeGalleryIdx], alt: `Gallery ${activeGalleryIdx + 1}`, className: "w-full h-72 md:h-96 object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: gallery.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setActiveGalleryIdx(idx), className: `rounded-2xl overflow-hidden h-20 border-2 transition ${activeGalleryIdx === idx ? "border-[var(--brand-gold)] shadow-[var(--shadow-warm)]" : "border-transparent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: `Thumbnail ${idx + 1}`, className: "w-full h-full object-cover" }) }, idx)) })
        ] }),
        related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)] mb-6", children: [
            "More in ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[family-name:var(--font-script)] text-[var(--brand-gold)]", children: category })
          ] }),
          (() => {
            const relatedCount = related.length;
            let relatedWidthClass = "";
            if (relatedCount === 1) {
              relatedWidthClass = "w-full max-w-xl";
            } else if (relatedCount % 2 === 0) {
              if (relatedCount <= 4) {
                relatedWidthClass = "w-full sm:w-[calc(50%-10px)]";
              } else if (relatedCount === 6) {
                relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)]";
              } else {
                relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)]";
              }
            } else {
              if (relatedCount === 3 || relatedCount === 5) {
                relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)]";
              } else {
                relatedWidthClass = "w-full sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)]";
              }
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-5 justify-center", children: related.map((pkg) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${relatedWidthClass} flex flex-col`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catalog/$id", params: {
              id: pkg.id
            }, onClick: () => {
              setActiveTab("overview");
              window.scrollTo(0, 0);
            }, className: "group rounded-3xl bg-white border border-[var(--brand-green)]/10 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-deep)] transition flex flex-col flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pkg.hero, alt: pkg.id, className: "w-full h-full object-cover group-hover:scale-110 transition duration-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col flex-1", children: [
                pkg.badge ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-[var(--brand-red)] font-bold", children: pkg.badge }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-[family-name:var(--font-display)] font-bold text-[var(--brand-green-deep)] text-base leading-snug flex-1", children: pkg.id.replace(/-(\d+)$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t border-[var(--brand-sand)]/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ClockIcon, { className: "w-3 h-3 text-[var(--brand-green)]" }),
                  " ",
                  pkg.itinerary.length,
                  " days",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[var(--brand-red)] font-semibold", children: pkg.priceFrom })
                ] })
              ] })
            ] }) }, pkg.id)) });
          })()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-24 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[var(--brand-green-deep)] rounded-3xl p-8 text-white shadow-[var(--shadow-deep)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--brand-gold)] text-xs uppercase tracking-widest font-semibold mb-2", children: "Starting from" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[family-name:var(--font-display)] text-4xl font-black", children: detail?.priceFrom ?? "Contact Us" }),
          detail?.departure ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-white/70 text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, { className: "w-4 h-4" }),
            " ",
            detail.departure
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "w-full flex items-center justify-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-bold px-6 py-4 rounded-2xl hover:scale-[1.02] transition text-base shadow-[var(--shadow-warm)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "w-5 h-5" }),
              "Book via WhatsApp"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:hello@sdftours.com", className: "w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/20 transition text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MailIcon, { className: "w-4 h-4" }),
              "Email Us"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-7 shadow-sm border border-[var(--brand-green)]/10 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[family-name:var(--font-display)] font-bold text-[var(--brand-green-deep)] text-lg", children: "Quick Info" }),
          [duration ? {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClockIcon, { className: "w-4 h-4" }),
            label: "Duration",
            value: duration
          } : null, location ? {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinIcon, { className: "w-4 h-4" }),
            label: "Location",
            value: location
          } : null, detail?.groupSize ? {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersIcon, { className: "w-4 h-4" }),
            label: "Group Size",
            value: detail.groupSize
          } : null, detail?.difficulty ? {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MountainIcon, { className: "w-4 h-4" }),
            label: "Difficulty",
            value: detail.difficulty
          } : null, {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TagIcon, { className: "w-4 h-4" }),
            label: "Category",
            value: category
          }].filter(Boolean).map((info) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm border-b border-[var(--brand-sand)] pb-3 last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--brand-green)]", children: info.icon }),
              info.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-[var(--brand-green-deep)]", children: info.value })
          ] }, info.label))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catalog", className: "flex items-center gap-2 text-sm text-[var(--brand-green-deep)] font-semibold hover:text-[var(--brand-red)] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftIcon, { className: "w-4 h-4" }),
          "All Tour Packages"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-[var(--brand-green-deep)] text-white/80 py-10 px-6 md:px-16 mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "SDF", className: "h-10 w-10 rounded-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[family-name:var(--font-display)] font-bold text-white", children: "SDF Land of Origin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-[var(--brand-gold)]", children: "Tour · Travel · Events" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " SDF Land of Origin. Made in Ethiopia 🇪🇹"
      ] })
    ] }) })
  ] });
}
function ClockIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M12 6v6l4 2" })
  ] });
}
function MapPinIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "9", r: "2.5" })
  ] });
}
function UsersIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "7", r: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" })
  ] });
}
function MountainIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M3 20l6.5-13L13 13l3-4 5 11H3z" }) });
}
function TagIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "7", r: "1.5" })
  ] });
}
function CalendarIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M16 2v4M8 2v4M3 10h18" })
  ] });
}
function WhatsAppIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.8-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" }) });
}
function MailIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "22,6 12,12 2,6" })
  ] });
}
function ArrowLeftIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M19 12H5M12 5l-7 7 7 7" }) });
}
export {
  PackageDetailPage as component
};
