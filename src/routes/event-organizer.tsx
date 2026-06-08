import { createFileRoute } from "@tanstack/react-router";
import anwar from "@/assets/anwar-mosque.jpg";
import gondar from "@/assets/gondar-tower.jpg";
import axum from "@/assets/axum.jpg";

export const Route = createFileRoute("/event-organizer")({
  component: EventOrganizer,
  head: () => ({
    meta: [
      { title: "Event Organizer — SDF Land of Origin" },
      {
        name: "description",
        content:
          "World-class Ethiopian event organization for weddings, conferences, festivals, and cultural showcases.",
      },
    ],
  }),
});

const eventTypes = [
  "Cultural Wedding",
  "Corporate Retreat",
  "Festival Logistics",
  "Pilgrimage Program",
  "Conference or Gala",
];

const organizerFeatures = [
  { title: "Local Expertise", description: "Ground support in Addis Ababa, Gondar, Lalibela, Axum, and the Omo Valley." },
  { title: "Seamless Logistics", description: "Full-service planning from venue selection to hospitality, transport, and permits." },
  { title: "Authentic Experiences", description: "Ceremonies, performances, cuisine, and design rooted in Ethiopian heritage." },
  { title: "Custom Group Journeys", description: "Tailored programs for VIPs, destination weddings, incentive trips, and cultural delegations." },
];

function EventOrganizer() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(247,232,148,0.18),_transparent_45%),linear-gradient(180deg,_#082a1f_0%,_#070b0f_100%)]">
        <img src={anwar} alt="Event gathering in Ethiopia" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/90">
              Event Organizer
            </span>
            <h1 className="mt-8 text-4xl font-black leading-tight text-white md:text-6xl">
              Make your Ethiopian event unforgettable.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
              SDF designs and executes premium events across Ethiopia, blending local detail with international standards for weddings, conferences, festivals, and luxury gatherings.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#request" className="inline-flex items-center justify-center rounded-full bg-[var(--brand-gold)] px-8 py-4 text-sm font-semibold text-[var(--brand-green-deep)] shadow-lg transition hover:scale-[1.02]">
                Request planning support
              </a>
              <a href="#services" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
                Learn how we work
              </a>
            </div>
          </div>
        </div>
      </header>

      <section id="services" className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Tailored event design</span>
              <h2 className="mt-4 text-4xl font-bold text-[var(--brand-green-deep)] sm:text-5xl">
                Events that celebrate Ethiopia’s culture and your vision.
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                From historic venues and ceremonial hospitality to modern conference production, we blend authenticity with precision for every group, budget, and destination.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {organizerFeatures.map((feature) => (
                  <div key={feature.title} className="rounded-3xl border border-[var(--brand-green)]/10 bg-white/90 p-8 shadow-sm transition hover:shadow-[var(--shadow-deep)]">
                    <h3 className="text-xl font-semibold text-[var(--brand-green-deep)]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <img src={gondar} alt="Gondar event venue" className="h-64 w-full rounded-[2rem] object-cover shadow-xl" />
              <img src={axum} alt="Axum cultural gathering" className="h-64 w-full rounded-[2rem] object-cover shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-sand)] py-24 px-6 md:px-12" id="request">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-3xl border border-[var(--brand-green)]/10 bg-white p-10 shadow-sm">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-green-deep)] font-semibold">Start your plan</span>
              <h2 className="mt-4 text-3xl font-bold text-[var(--brand-green-deep)] sm:text-4xl">
                Tell us about your vision.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our planning team will review your event goals and follow up with a bespoke proposal, venue options, and a full production roadmap.
              </p>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground">
                <p><strong className="text-[var(--brand-green-deep)]">Event types:</strong> weddings, conferences, festivals, cultural ceremonies, VIP programs, incentive travel.</p>
                <p><strong className="text-[var(--brand-green-deep)]">Support:</strong> logistics, local teams, equipment, catering, guest experience, permits, transportation.</p>
              </div>
            </div>

            <form className="space-y-6 rounded-3xl border border-[var(--brand-green)]/10 bg-white p-10 shadow-sm">
              <div>
                <label className="text-sm font-medium text-[var(--brand-green-deep)]" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--brand-green-deep)]" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--brand-green-deep)]" htmlFor="eventType">
                  Event type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                >
                  <option value="">Choose one</option>
                  {eventTypes.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {eventType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-[var(--brand-green-deep)]" htmlFor="date">
                    Event date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--brand-green-deep)]" htmlFor="guests">
                    Guests
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    placeholder="100"
                    className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--brand-green-deep)]" htmlFor="message">
                  Event details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your goals, location preferences and desired atmosphere."
                  className="mt-3 w-full rounded-3xl border border-input bg-background px-4 py-4 text-sm text-foreground outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-green-deep)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-green)]"
              >
                Send request
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-red)] font-semibold">Why choose SDF</span>
          <h2 className="mt-4 text-4xl font-bold text-[var(--brand-green-deep)] sm:text-5xl">
            We turn your event into an immersive Ethiopian experience.
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-muted-foreground leading-relaxed">
            Guests enjoy authentic rituals, premium hospitality, cultural storytelling, and flawless logistics designed for international and local attendees alike.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { label: "Venue sourcing", value: "Historic palaces, hillside resorts, boutique lodges." },
              { label: "Guest care", value: "Transportation, accommodation, translation and VIP support." },
              { label: "Production", value: "Staging, catering, audio-visual and ceremony coordination." },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border border-[var(--brand-green)]/10 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-[var(--brand-green-deep)]">{card.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
