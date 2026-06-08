import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BZd-ePnj.js";
import { l as logo, f as fasil, t as tribe } from "./sdf-logo-BbxpDnEG.js";
import { g as gondar, a as axum } from "./axum-DTnEoTvJ.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode);
function FacebookIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", className, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.5 22v-8h2.7l.4-3h-3.1V8.1c0-.9.2-1.5 1.5-1.5h1.6V3.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.7V11H7v3h2.4v8h4.1Z" }) });
}
function YouTubeIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", className, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27.2 27.2 0 0 0 2 12a27.2 27.2 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27.2 27.2 0 0 0 22 12a27.2 27.2 0 0 0-.4-4.8ZM10 15.2V8.8l5.6 3.2L10 15.2Z" }) });
}
function WhatsAppIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", className, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.8-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4H8.1c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" }) });
}
function TikTokIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", className, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.5 3c.4 2.4 1.8 3.9 4.2 4.1V10a7.7 7.7 0 0 1-4.1-1.1v5.9c0 3.5-2.8 6.2-6.3 6.2a6.2 6.2 0 0 1-4.2-10.8 6.4 6.4 0 0 1 4.6-1.4v2.8a3.4 3.4 0 1 0 2.2 3.2V3h3.6Z" }) });
}
const highlights = [{
  title: "Why Ethiopia feels different",
  text: "A country of living history, layered faiths, and landscapes that move from highland stonework to the lowland edges of the Rift Valley."
}, {
  title: "Plan with purpose",
  text: "We build routes around the traveler, not the other way around, so cultural moments, timing, and budget stay aligned."
}, {
  title: "Tour, travel, and events",
  text: "The same team that curates journeys also supports celebrations, retreats, and gatherings with local precision."
}];
const socialLinks = [{
  label: "Facebook",
  href: "https://www.facebook.com/share/1Coq1kpvAt/",
  note: "Stories, updates, and event highlights",
  icon: FacebookIcon,
  tone: "hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
}, {
  label: "YouTube",
  href: "https://youtube.com/@deresseeshetu-b8f?si=EwVwSk2r25kGtYYo",
  note: "Travel films and destination reels",
  icon: YouTubeIcon,
  tone: "border-red-500/30 bg-gradient-to-br from-white via-red-50 to-white hover:border-red-400 text-red-600",
  special: true
}, {
  label: "TikTok",
  href: "https://www.tiktok.com/@pentagon_ethiopia?_r=1&_t=ZS-96NvdRmqZ17",
  note: "Short-form adventures and quick edits",
  icon: TikTokIcon,
  tone: "border-slate-900/10 bg-[linear-gradient(135deg,#070707_0%,#1c1c1c_100%)] text-white hover:border-white/40",
  special: true
}];
function Blog() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative overflow-hidden bg-[linear-gradient(135deg,var(--brand-green-deep)_0%,#123d35_45%,var(--brand-red)_100%)] text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gondar, alt: "Gondar landscape", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,120,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_26%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "SDF Land of Origin", className: "h-12 w-12 rounded-full object-cover ring-2 ring-white/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[family-name:var(--font-display)] text-lg font-bold", children: "SDF Land of Origin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.35em] text-white/70", children: "Land of Origin" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-6 text-sm text-white/85", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "hover:text-[var(--brand-gold)] transition", children: "Home" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#tours", className: "hover:text-[var(--brand-gold)] transition", children: "Destinations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/catalog", className: "hover:text-[var(--brand-gold)] transition", children: "Tour Packages" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--brand-gold)] font-semibold", children: "Blog" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#events", className: "hover:text-[var(--brand-gold)] transition", children: "Events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#contact", className: "hover:text-[var(--brand-gold)] transition", children: "Contact" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "rounded-full bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-green-deep)] hover:scale-105 transition shadow-lg", children: "Book a Journey" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.32em] text-white/85", children: "Article" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-[family-name:var(--font-display)] text-5xl font-black leading-[0.92] md:text-7xl", children: [
              "Blog",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[family-name:var(--font-script)] text-[var(--brand-gold)]", children: "stories from Ethiopia" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-2xl text-lg leading-relaxed text-white/85", children: "A short guide to what makes the SDF experience feel personal: thoughtful routes, living heritage, and social channels where travelers can follow the journey." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.facebook.com/share/1Coq1kpvAt/", target: "_blank", rel: "noreferrer", className: "rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:-translate-y-1 hover:bg-white/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-white/65", children: "Facebook" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: "Follow updates" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "rounded-2xl border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/15 p-4 transition hover:-translate-y-1 hover:bg-[var(--brand-gold)]/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-white/65", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: "0911410884" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-4 w-4" })
              ] })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-7xl px-6 py-16 md:px-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "grid gap-10 lg:grid-cols-[1.2fr_0.8fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm md:p-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Travel Article" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[var(--brand-gold)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5 min read" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--brand-green-deep)] md:text-5xl", children: "Why the blog matters before the trip begins" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg leading-relaxed text-muted-foreground", children: "The best journeys start with context. Our blog is where we collect the small details that help travelers understand Ethiopian culture, weather, timing, and local etiquette before they arrive." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base leading-relaxed text-muted-foreground", children: "From UNESCO sites and historic mosques to coffee culture and modern city experiences, the goal is simple: make every route easier to plan and more meaningful to experience." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-3", children: highlights.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.75rem] border border-[var(--brand-green)]/10 bg-[linear-gradient(180deg,#fff,rgba(249,244,232,0.75))] p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)]", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: item.text })
        ] }, item.title)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("figure", { className: "overflow-hidden rounded-[2rem] shadow-[var(--shadow-deep)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: fasil, alt: "Fasil Ghebbi", className: "h-72 w-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("figure", { className: "overflow-hidden rounded-[2rem] shadow-[var(--shadow-deep)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: axum, alt: "Axum", className: "h-72 w-full object-cover" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] bg-[linear-gradient(180deg,var(--brand-sand),#fff)] p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-green-deep)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FacebookIcon, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold", children: "Social Showcase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--brand-green-deep)]", children: "Special content cards" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children: socialLinks.map((link) => {
            const Icon2 = link.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: link.href, target: "_blank", rel: "noreferrer", className: `group block rounded-[1.5rem] border p-5 transition hover:-translate-y-1 ${link.tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] ${link.special ? "text-current/70" : "text-[var(--brand-green-deep)]/70"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-4 w-4" }),
                  link.label
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold", children: link.note })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-5 w-5 shrink-0 opacity-70 transition group-hover:translate-x-1 group-hover:-translate-y-1" })
            ] }) }, link.label);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(135deg,#070707_0%,#121212_55%,#1f1f1f_100%)] p-6 text-white shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-white/60", children: "TikTok spotlight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-[family-name:var(--font-display)] text-3xl font-bold", children: "Short clips, fast energy" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold", children: "@pentagon_ethiopia" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/8 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-white/75", children: "TikTok" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-white/80", children: "Scenic cuts, trip previews, and quick inspiration for travelers who want a fast look at what is possible." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.tiktok.com/@pentagon_ethiopia?_r=1&_t=ZS-96NvdRmqZ17", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]", children: [
                "Open TikTok ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: tribe, alt: "Cultural travel", className: "h-36 w-full rounded-[1.5rem] object-cover sm:h-44 sm:w-36" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-[var(--brand-green)]/10 bg-[var(--brand-green-deep)] px-6 py-10 text-white/80 md:px-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "SDF", className: "h-12 w-12 rounded-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[family-name:var(--font-display)] text-lg font-bold text-white", children: "SDF Land of Origin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--brand-gold)]", children: "Blog · Travel · Events" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-[auto_auto] md:items-center md:gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.facebook.com/share/1Coq1kpvAt/", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 transition hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FacebookIcon, { className: "h-4 w-4" }),
            "Facebook"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://youtube.com/@deresseeshetu-b8f?si=EwVwSk2r25kGtYYo", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 transition hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(YouTubeIcon, { className: "h-4 w-4" }),
            "YouTube"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.tiktok.com/@pentagon_ethiopia?_r=1&_t=ZS-96NvdRmqZ17", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 transition hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TikTokIcon, { className: "h-4 w-4" }),
            "TikTok"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 md:text-right md:ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/251911410884", target: "_blank", rel: "noreferrer", className: "block font-semibold text-white transition hover:text-[var(--brand-gold)]", children: "WhatsApp · 0911410884" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " SDF Land of Origin. Made in Ethiopia 🇪🇹"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Blog as component
};
