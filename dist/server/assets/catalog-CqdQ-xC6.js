import { _ as useChildMatches, T as jsxRuntimeExports, Z as Outlet, r as reactExports } from "./worker-entry-BZd-ePnj.js";
import { L as Link } from "./router-CN2cERqh.js";
import { g as getCatalogItems } from "./catalog-k1yCID7G.js";
import { g as getPackageDetail } from "./packageDetails-CQKNAxNG.js";
import { t as tribe, f as fasil, l as logo } from "./sdf-logo-BbxpDnEG.js";
import { a as axum, g as gondar } from "./axum-DTnEoTvJ.js";
import { m as merkato, a as menelik, b as mosqueGreen } from "./merkato-TMH4p3Xx.js";
import { a as anwar } from "./anwar-mosque-Ci05BTGM.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./supabase-Bsb1TV-S.js";
const categories = [{
  key: "Addis Ababa City Tours and Day Trips",
  label: "Addis Ababa City Tours and Day Trips",
  desc: "Urban routes, food tastings, coffee ceremonies, nightlife and hidden gems in Ethiopia's vibrant capital.",
  image: merkato,
  accent: "from-amber-900/80",
  span: "md:col-span-2"
  // wide card
}, {
  key: "Historical Tour",
  label: "Historical Tours",
  desc: "Lalibela's rock-hewn churches, Axum's ancient obelisks, Gondar's castles, and pre-Aksumite heritage sites.",
  image: axum,
  accent: "from-stone-900/80",
  span: ""
}, {
  key: "Cultural Tours",
  label: "Cultural Tours",
  desc: "Omo Valley tribes — Mursi, Hamer, Karo — living traditions, body art, and community ceremonies.",
  image: tribe,
  accent: "from-orange-900/80",
  span: ""
}, {
  key: "Adventure and Safari Tour",
  label: "Adventure & Safari",
  desc: "Danakil Depression, Erta Ale lava lake, salt flats, national parks and wildlife safaris.",
  image: gondar,
  accent: "from-green-900/80",
  span: ""
}, {
  key: "Trekking Tours",
  label: "Trekking Tours",
  desc: "Bale Mountains, Simien highlands, Tigray cliff churches — multi-day treks through Ethiopia's rooftop.",
  image: fasil,
  accent: "from-blue-900/80",
  span: ""
}, {
  key: "Combined Tours",
  label: "Combined Tours",
  desc: "Grand itineraries blending Danakil, Lalibela, Gondar and the Omo Valley in one epic journey.",
  image: menelik,
  accent: "from-purple-900/80",
  span: "md:col-span-2"
  // wide card
}, {
  key: "Festival Tour",
  label: "Festival Tours",
  desc: "Genna Christmas, Timket Epiphany and Meskel — witness Ethiopia's most spectacular celebrations.",
  image: anwar,
  accent: "from-red-900/80",
  span: ""
}, {
  key: "Coffee Tour",
  label: "Coffee Tours",
  desc: "From Addis tastings to Sidama and Yirgacheffe origins — explore Ethiopia's coffee heritage from bean to cup.",
  image: mosqueGreen,
  accent: "from-amber-900/80",
  span: ""
}];
function mapItemToPublicCategory(item) {
  const cat = item.category || "";
  const exact = {
    "Addis Ababa City Tours and Day Trips": "Addis Ababa City Tours and Day Trips",
    "Historical Tours": "Historical Tour",
    "Historical Tour": "Historical Tour",
    "Cultural Tours": "Cultural Tours",
    "Adventure and Safari Tour": "Adventure and Safari Tour",
    "Trekking Tours": "Trekking Tours",
    "Combined Tours": "Combined Tours",
    "Festival Tours": "Festival Tour",
    "Festival Tour": "Festival Tour",
    "Coffee Tour": "Coffee Tour"
  };
  if (exact[cat]) return exact[cat];
  const cl = cat.toLowerCase();
  if (cl.includes("addis") || cl.includes("city tour")) return "Addis Ababa City Tours and Day Trips";
  if (cl.includes("historical") || cl.includes("history")) return "Historical Tour";
  if (cl.includes("cultural") || cl.includes("culture")) return "Cultural Tours";
  if (cl.includes("adventure") || cl.includes("safari")) return "Adventure and Safari Tour";
  if (cl.includes("trek")) return "Trekking Tours";
  if (cl.includes("combined")) return "Combined Tours";
  if (cl.includes("festival")) return "Festival Tour";
  if (cl.includes("coffee")) return "Coffee Tour";
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
function CatalogPage() {
  const childMatches = useChildMatches();
  if (childMatches.length > 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CatalogShell, {});
}
function CatalogShell() {
  const [items, setItems] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [selected, setSelected] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && categories.find((c) => c.key === cat)) setSelected(cat);
    setIsLoading(true);
    let isMounted = true;
    getCatalogItems().then((data) => {
      if (isMounted) setItems(data);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const visibleItems = reactExports.useMemo(() => {
    if (!selected) return [];
    return items.filter((item) => {
      const mapped = mapItemToPublicCategory(item);
      return mapped === selected || item.category === selected;
    });
  }, [selected, items]);
  const countFor = (key) => items.filter((item) => {
    const m = mapItemToPublicCategory(item);
    return m === key || item.category === key;
  }).length;
  const activeCat = categories.find((c) => c.key === selected);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[var(--brand-sand)] text-foreground font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap", rel: "stylesheet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "SDF Land of Origin", className: "h-14 w-14 rounded-full object-cover drop-shadow-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[family-name:var(--font-display)] font-black text-xl text-white drop-shadow", children: "SDF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] tracking-[0.25em] text-white/80 uppercase", children: "Land of Origin" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex gap-6 text-sm text-white/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-[var(--brand-gold)] transition", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--brand-gold)] font-semibold", children: "Tour Package" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "hover:text-[var(--brand-gold)] transition", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition shadow-lg", children: "Book a Journey" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", style: {
      height: selected ? "40vh" : "52vh",
      minHeight: "320px",
      transition: "height 0.5s ease"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activeCat?.image ?? merkato, alt: "tour packages", className: "absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 bg-gradient-to-b ${activeCat?.accent ?? "from-[var(--brand-green-deep)]/80"} via-black/40 to-[var(--brand-sand)]` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-10 max-w-7xl mx-auto", children: [
        selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelected(null), className: "mb-4 self-start flex items-center gap-2 text-white/70 hover:text-white text-sm transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M15 19l-7-7 7-7" }) }),
          "All Categories"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex w-fit items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.3em] text-white mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" }),
          selected ? activeCat?.label : "SDF Tour Packages"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[family-name:var(--font-display)] font-black text-white text-4xl md:text-6xl leading-tight drop-shadow-2xl", children: selected ? activeCat?.label : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Choose your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[family-name:var(--font-script)] text-[var(--brand-gold)]", children: "journey" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/80 max-w-2xl text-base md:text-lg", children: selected ? `${isLoading ? "..." : visibleItems.length} tour${visibleItems.length !== 1 ? "s" : ""} available — click any package to see the full itinerary.` : "Select a category below to browse curated Ethiopian tour packages." })
      ] })
    ] }),
    !selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 md:px-16 py-12 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-4 auto-rows-[260px]", children: categories.map((cat, i) => {
        const count = isLoading ? null : countFor(cat.key);
        const isWide = cat.span.includes("col-span-2");
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelected(cat.key), className: `group relative overflow-hidden rounded-[2rem] text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-gold)] ${cat.span} ${isWide ? "xl:col-span-2" : ""}`, style: {
          gridRow: i < 2 ? "span 1" : void 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cat.image, alt: cat.label, className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 bg-gradient-to-t ${cat.accent} via-black/30 to-transparent group-hover:via-black/50 transition-all duration-500` }),
          count != null && count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-5 right-5 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-xs font-bold px-3 py-1 rounded-full", children: [
            count,
            " tour",
            count !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[family-name:var(--font-display)] text-2xl md:text-3xl font-black text-white drop-shadow-xl leading-tight", children: cat.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/70 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 group-hover:text-white/90 transition-all duration-500", children: cat.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400", children: [
              "Browse packages",
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M5 12h14M12 5l7 7-7 7" }) })
            ] })
          ] })
        ] }, cat.key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] bg-[var(--brand-green-deep)] text-white px-10 py-12 relative overflow-hidden shadow-[var(--shadow-deep)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_50%,_var(--brand-gold),_transparent_60%)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--brand-gold)] text-xs uppercase tracking-[0.3em] font-semibold mb-2", children: "Custom Trips" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold", children: [
              "Can't find what you're looking for?",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[family-name:var(--font-script)] text-[var(--brand-gold)]", children: "We build it from scratch." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/70 max-w-lg text-sm", children: "Share your dates, group size, and interests — we'll design your perfect Ethiopian adventure." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "bg-[var(--brand-gold)] text-[var(--brand-green-deep)] font-bold px-6 py-3 rounded-full hover:scale-105 transition", children: "WhatsApp Us" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:hello@sdftours.com", className: "bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition", children: "Email Us" })
          ] })
        ] })
      ] })
    ] }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 md:px-16 py-10 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-10", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelected(cat.key), className: `rounded-full px-4 py-2 text-sm font-semibold transition ${selected === cat.key ? "bg-[var(--brand-green-deep)] text-white shadow-md" : "bg-white text-[var(--brand-green-deep)] border border-[var(--brand-green)]/20 hover:border-[var(--brand-green-deep)] hover:bg-[var(--brand-sand)]"}`, children: cat.label }, cat.key)) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-white h-80 animate-pulse shadow-sm border border-[var(--brand-green)]/10" }, i)) }) : visibleItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 bg-white rounded-3xl border border-[var(--brand-green)]/10 px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[var(--brand-sand)] flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-muted-foreground/50", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-[var(--brand-green-deep)]", children: "No packages in this category yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
          "Go to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/catalog", className: "text-[var(--brand-red)] underline font-medium", children: "Admin → Catalog" }),
          " to add packages for this category."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelected(null), className: "mt-5 text-sm text-muted-foreground hover:text-foreground underline", children: "Back to all categories" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: (() => {
        const itemCount = visibleItems.length;
        let itemWidthClass = "";
        if (itemCount === 1) {
          itemWidthClass = "w-full max-w-2xl";
        } else if (itemCount % 2 === 0) {
          if (itemCount <= 4) {
            itemWidthClass = "w-full md:w-[calc(50%-14px)]";
          } else if (itemCount === 6) {
            itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(33.333%-19px)]";
          } else {
            itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(25%-21px)]";
          }
        } else {
          if (itemCount === 3 || itemCount === 5) {
            itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(33.333%-19px)]";
          } else {
            itemWidthClass = "w-full md:w-[calc(50%-14px)] xl:w-[calc(25%-21px)]";
          }
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-7 justify-center", children: visibleItems.map((item, index) => {
          const detail = getPackageDetail(item.id);
          const heroImg = item.image ?? detail?.hero ?? fasil;
          const badge = detail?.badge;
          const difficulty = detail?.difficulty;
          const mappedCat = mapItemToPublicCategory(item);
          const cardDesc = item.summary || item.description || detail?.overview || "";
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${itemWidthClass} flex flex-col`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catalog/$id", params: {
            id: item.id
          }, className: "group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-[var(--brand-green)]/10 hover:-translate-y-2 hover:shadow-[var(--shadow-deep)] transition-all duration-300 flex flex-col flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden h-52", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: item.title, className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--brand-green-deep)]/60 via-transparent to-transparent" }),
              badge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 bg-[var(--brand-gold)] text-[var(--brand-green-deep)] text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full", children: badge }),
              difficulty && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute bottom-4 right-4 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${difficulty === "Easy" ? "bg-emerald-500/80 text-white" : difficulty === "Moderate" ? "bg-amber-500/80 text-white" : difficulty === "Challenging" ? "bg-orange-500/80 text-white" : "bg-red-600/80 text-white"}`, children: difficulty })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 p-7", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.25em] text-[var(--brand-red)] font-semibold mb-2", children: mappedCat !== "Other" ? mappedCat : item.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[family-name:var(--font-display)] text-xl font-bold text-[var(--brand-green-deep)] leading-snug group-hover:text-[var(--brand-red)] transition", children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3", children: cardDesc }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
                  item.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-3.5 h-3.5 text-[var(--brand-green)]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M12 6v6l4 2" })
                    ] }),
                    item.duration
                  ] }),
                  item.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-3.5 h-3.5 text-[var(--brand-green)]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "9", r: "2.5" })
                    ] }),
                    item.location
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[var(--brand-red)] text-sm font-semibold group-hover:gap-2 transition-all", children: [
                  "View",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M5 12h14M12 5l7 7-7 7" }) })
                ] }) })
              ] })
            ] })
          ] }) }, item.id);
        }) });
      })() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelected(null), className: "inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-green-deep)] text-[var(--brand-green-deep)] font-semibold px-7 py-3 hover:bg-[var(--brand-green-deep)] hover:text-white transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", d: "M15 19l-7-7 7-7" }) }),
        "Back to All Categories"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-[var(--brand-green-deep)] text-white/80 py-10 px-6 md:px-16 mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
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
export {
  CatalogPage as component
};
