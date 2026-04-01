import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSlider } from "../components/hero-slider/HeroSlider";

/* ─────────────────────────── types ─────────────────────────── */
interface ConfigData {
  meta: {
    eventName: string;
    tagline: string;
    dates: string;
    venue: string;
    startDate?: string;
  };
  stats: {
    events: string;
    participants: string;
    colleges: string;
  };
  about: {
    title: string;
    description: string;
    features: { title: string; description: string }[];
  };
  days: DayEvent[];
}

interface HomeCopy {
  hero: {
    bannerDate: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    exploreEvents: string;
    contactUs: string;
  };
  countdownLabels: { days: string; hours: string; minutes: string; seconds: string };
  about: { badge: string; titlePrefix: string; titleAccent: string; titleSuffix: string };
  statsLabels: { events: string; participants: string; colleges: string };
  sponsors: {
    badge: string; titlePrefix: string; titleAccent: string;
    hallBadge: string; hallTitlePrefix: string; hallTitleAccent: string;
    hallDescription: string; hallSticker: string;
    platinum: string; gold: string; silver: string; general: string;
    sponsorPrompt: string; sponsorButton: string;
  };
  cta: { titlePrefix: string; titleAccent: string; description: string; browseEvents: string };
  dayModal: { scheduleTitle: string; emptyState: string; viewAllEvents: string };
}

interface EventItem {
  id: number; name: string; category: string; cluster?: string; day?: string;
  timing: string; location: string; fee: string; status: string;
  description: string; image: string; registrationUrl?: string;
}

interface DayEvent {
  day: string; date: string; events: string[]; highlight: string; bgImage: string;
}

interface Sponsor {
  name: string; logo: string; order?: number;
}

interface SponsorsConfig {
  platinum: Sponsor[]; gold: Sponsor[]; silver?: Sponsor[]; media?: Sponsor[];
}

/* ──────────────────────── defaults ──────────────────────────── */
const defaultHomeCopy: HomeCopy = {
  hero: {
    bannerDate: "March 15-17, 2026",
    titleMain: "THETA",
    titleAccent: "2026",
    description: "National Level Techno-Management Fest hosted by SASTRA Deemed University.",
    exploreEvents: "Explore Events",
    contactUs: "Contact Us",
  },
  countdownLabels: { days: "Days", hours: "Hours", minutes: "Mins", seconds: "Secs" },
  about: { badge: "About Theta", titlePrefix: "India's Premier", titleAccent: "Techno-Management", titleSuffix: "Fest" },
  statsLabels: { events: "Events", participants: "Participants", colleges: "Colleges" },
  sponsors: {
    badge: "Our Sponsors", titlePrefix: "Powered by", titleAccent: "Partners",
    hallBadge: "Previous Sponsors", hallTitlePrefix: "Past Edition", hallTitleAccent: "Partners",
    hallDescription: "These brands supported previous editions of Theta and helped build the fest legacy.",
    hallSticker: "Legacy Wall",
    platinum: "Platinum", gold: "Gold", silver: "Silver", general: "Media",
    sponsorPrompt: "Want to sponsor Theta 2026?", sponsorButton: "Become a Sponsor",
  },
  cta: { titlePrefix: "Ready to", titleAccent: "Compete?", description: "Build, ship, and showcase with the brightest teams in India.", browseEvents: "Browse Events" },
  dayModal: { scheduleTitle: "Day Schedule", emptyState: "Events will be announced soon.", viewAllEvents: "View All Events" },
};

const defaultConfig: ConfigData = {
  meta: { eventName: "Theta 2026", tagline: "National Level Techno-Management Fest", dates: "March 15-17, 2026", venue: "SASTRA Deemed University" },
  stats: { events: "50+", participants: "5000+", colleges: "100+" },
  about: {
    title: "About Theta",
    description: "Theta is a national-level techno-management fest organized by SASTRA Deemed University.",
    features: [
      { title: "30+ Events", description: "Competitions and workshops." },
      { title: "1000+ Participants", description: "From across India." },
      { title: "80+ Colleges", description: "Top talent meets here." },
    ],
  },
  days: [
    { day: "Day One", date: "March 15, 2026", events: ["Inauguration"], highlight: "Opening Ceremony", bgImage: "" },
    { day: "Day Two", date: "March 16, 2026", events: ["Hackathon"], highlight: "Flagship Competitions", bgImage: "" },
    { day: "Day Three", date: "March 17, 2026", events: ["Finale"], highlight: "Prize Distribution", bgImage: "" },
  ],
};

const defaultSponsors: SponsorsConfig = { platinum: [], gold: [], silver: [], media: [] };

/* ──────────────────────── helpers ───────────────────────────── */
const parseStatNumber = (value: string): number => {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseFestStart = (datesText: string, isoDate?: string): Date => {
  if (isoDate) {
    const parsed = new Date(isoDate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const match = datesText.match(/\b([A-Za-z]+)\s+(\d{1,2})(?:\s*[-–]\s*\d{1,2})?,\s*(\d{4})\b/);
  if (match) {
    const [, month, day, year] = match;
    const parsed = new Date(`${month} ${day}, ${year} 09:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date("2026-03-15T09:00:00");
};

const dayAliases: Record<string, string[]> = {
  "Day One": ["Day 1", "Day One"],
  "Day Two": ["Day 2", "Day Two"],
  "Day Three": ["Day 3", "Day Three"],
};

const sponsorTiers = [
  { key: "platinum", label: "Platinum" },
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" },
  { key: "media", label: "Media" },
] as const;

const sponsorTierMeta: Record<(typeof sponsorTiers)[number]["key"], {
  accent: string;
  glow: string;
  surface: string;
  eyebrow: string;
}> = {
  platinum: {
    accent: "#c9ff7a",
    glow: "rgba(158, 255, 71, 0.22)",
    surface: "linear-gradient(160deg, rgba(122,255,51,0.18), rgba(8,18,10,0.9))",
    eyebrow: "Flagship partners",
  },
  gold: {
    accent: "#f6ff8f",
    glow: "rgba(226, 255, 89, 0.18)",
    surface: "linear-gradient(160deg, rgba(208,255,66,0.16), rgba(16,18,8,0.9))",
    eyebrow: "Premium backers",
  },
  silver: {
    accent: "#b7ffd1",
    glow: "rgba(77, 255, 154, 0.18)",
    surface: "linear-gradient(160deg, rgba(62,255,139,0.14), rgba(7,16,13,0.92))",
    eyebrow: "Growth partners",
  },
  media: {
    accent: "#9cffbb",
    glow: "rgba(61, 214, 160, 0.18)",
    surface: "linear-gradient(160deg, rgba(38,202,141,0.18), rgba(5,14,12,0.9))",
    eyebrow: "Broadcast reach",
  },
};

/* Day icons */
const dayIcons = ["⚡", "🤖", "🚀"];
const dayColors = [
  "from-[rgba(124,58,237,0.25)] to-[rgba(76,29,149,0.1)]",
  "from-[rgba(6,214,240,0.2)] to-[rgba(6,214,240,0.05)]",
  "from-[rgba(245,200,66,0.2)] to-[rgba(245,200,66,0.05)]",
];
const dayBorderColors = [
  "rgba(124,58,237,0.35)",
  "rgba(6,214,240,0.25)",
  "rgba(245,200,66,0.25)",
];
const dayAccents = ["#c084fc", "#06d6f0", "#f5c842"];

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default component$(() => {
  const configData = useSignal<ConfigData>(defaultConfig);
  const homeCopy = useSignal<HomeCopy>(defaultHomeCopy);
  const sponsors = useSignal<SponsorsConfig>(defaultSponsors);
  const events = useSignal<EventItem[]>([]);
  const countdown = useSignal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const counterDisplay = useSignal({ events: 0, participants: 0, colleges: 0 });
  const selectedDay = useSignal<DayEvent | null>(null);
  const selectedTier = useSignal<(typeof sponsorTiers)[number]["key"] | null>(null);
  const bgSlide = useSignal(0);

  /* ── Fetch data ── */
  useVisibleTask$(async () => {
    try {
      const [cfgRes, sponsorRes, eventRes, contentRes] = await Promise.all([
        fetch("/data/config.json"),
        fetch("/data/sponsors.json"),
        fetch("/data/events.json"),
        fetch("/data/content.json"),
      ]);
      if (!cfgRes.ok || !sponsorRes.ok || !eventRes.ok || !contentRes.ok) throw new Error();

      const cfg = (await cfgRes.json()) as Partial<ConfigData>;
      const sponsorPayload = (await sponsorRes.json()) as { sponsors?: SponsorsConfig };
      const eventPayload = (await eventRes.json()) as { events?: EventItem[] };
      const content = (await contentRes.json()) as { home?: Partial<HomeCopy> };

      configData.value = {
        ...defaultConfig, ...cfg,
        meta: { ...defaultConfig.meta, ...(cfg.meta || {}) },
        stats: { ...defaultConfig.stats, ...(cfg.stats || {}) },
        about: { ...defaultConfig.about, ...(cfg.about || {}), features: cfg.about?.features || defaultConfig.about.features },
        days: cfg.days || defaultConfig.days,
      };
      sponsors.value = { ...defaultSponsors, ...(sponsorPayload.sponsors || {}) };
      events.value = eventPayload.events || [];

      if (content.home) {
        homeCopy.value = {
          ...defaultHomeCopy, ...content.home,
          hero: { ...defaultHomeCopy.hero, ...(content.home.hero || {}) },
          countdownLabels: { ...defaultHomeCopy.countdownLabels, ...(content.home.countdownLabels || {}) },
          about: { ...defaultHomeCopy.about, ...(content.home.about || {}) },
          statsLabels: { ...defaultHomeCopy.statsLabels, ...(content.home.statsLabels || {}) },
          sponsors: { ...defaultHomeCopy.sponsors, ...(content.home.sponsors || {}) },
          cta: { ...defaultHomeCopy.cta, ...(content.home.cta || {}) },
          dayModal: { ...defaultHomeCopy.dayModal, ...(content.home.dayModal || {}) },
        };
      }
    } catch {
      configData.value = defaultConfig;
    }
  });

  /* ── Countdown ── */
  useVisibleTask$(({ track }) => {
    track(() => configData.value.meta.dates);
    track(() => configData.value.meta.startDate);
    const fest = parseFestStart(configData.value.meta.dates, configData.value.meta.startDate).getTime();
    const sync = () => {
      const diff = Math.max(0, fest - Date.now());
      countdown.value = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    sync();
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  });

  /* ── Hero background slideshow ── */
  useVisibleTask$(() => {
    const id = setInterval(() => {
      bgSlide.value = (bgSlide.value + 1) % 4;
    }, 5000);
    return () => clearInterval(id);
  });

  /* ── Stats counter ── */
  useVisibleTask$(() => {
    const node = document.getElementById("theta-stats");
    if (!node) return;
    const targets = {
      events: parseStatNumber(configData.value.stats.events),
      participants: parseStatNumber(configData.value.stats.participants),
      colleges: parseStatNumber(configData.value.stats.colleges),
    };
    const animate = () => {
      const start = performance.now();
      const dur = 1800;
      const ease = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        counterDisplay.value = {
          events: Math.floor(targets.events * ease(p)),
          participants: Math.floor(targets.participants * ease(p)),
          colleges: Math.floor(targets.colleges * ease(p)),
        };
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  });

  /* ── GSAP ScrollTrigger Reveals ── */
  useVisibleTask$(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal Up — fromTo ensures explicit opacity:1 target regardless of CSS
    gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Reveal Left
    gsap.utils.toArray<HTMLElement>(".reveal-left").forEach((el) => {
      gsap.fromTo(
        el,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Reveal Right
    gsap.utils.toArray<HTMLElement>(".reveal-right").forEach((el) => {
      gsap.fromTo(
        el,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Reveal Scale
    gsap.utils.toArray<HTMLElement>(".reveal-scale").forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });

  /* ── 3D Tilt on day cards ── */
  useVisibleTask$(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
    const onMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    };
    const onLeave = (card: HTMLElement) => {
      card.style.transition = "transform 400ms cubic-bezier(0.34,1.56,0.64,1)";
      card.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
    };
    const onEnter = (card: HTMLElement) => {
      card.style.transition = "transform 100ms linear";
    };
    const cleanups: Array<() => void> = [];
    cards.forEach((card) => {
      const mm = (e: MouseEvent) => onMove(e, card);
      const ml = () => onLeave(card);
      const me = () => onEnter(card);
      card.addEventListener("mousemove", mm);
      card.addEventListener("mouseleave", ml);
      card.addEventListener("mouseenter", me);
      cleanups.push(() => {
        card.removeEventListener("mousemove", mm);
        card.removeEventListener("mouseleave", ml);
        card.removeEventListener("mouseenter", me);
      });
    });
    return () => cleanups.forEach((c) => c());
  });

  /* ── Marquee pause ── */
  useVisibleTask$(() => {
    const lanes = Array.from(document.querySelectorAll<HTMLElement>("[data-marquee-lane]"));
    const cleanups: Array<() => void> = [];
    for (const lane of lanes) {
      const track = lane.querySelector<HTMLElement>("[data-marquee-track]");
      if (!track) continue;
      let resumeTimer: ReturnType<typeof setTimeout> | undefined;
      const pause = () => {
        track.style.animationPlayState = "paused";
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => { track.style.animationPlayState = "running"; }, 1400);
      };
      lane.addEventListener("pointerdown", pause);
      lane.addEventListener("touchstart", pause, { passive: true });
      cleanups.push(() => {
        lane.removeEventListener("pointerdown", pause);
        lane.removeEventListener("touchstart", pause);
        if (resumeTimer) clearTimeout(resumeTimer);
      });
    }
    return () => cleanups.forEach((c) => c());
  });

  /* ── Modal keyboard close ── */
  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);
    if (!selectedDay.value) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") selectedDay.value = null; };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedTier.value);
    if (!selectedTier.value) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") selectedTier.value = null; };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  /* ── Handlers ── */
  const closeDay = $(() => { selectedDay.value = null; });
  const closeTier = $(() => { selectedTier.value = null; });

  const getDayEvents = (dayName: string) => {
    const variants = dayAliases[dayName] || [dayName];
    return events.value.filter((item) => item.day ? variants.includes(item.day) : false);
  };

  /* ──────────────────────── render ───────────────────────── */
  const sponsorShowcaseItems = sponsorTiers
    .flatMap((tier) =>
      (sponsors.value[tier.key] || [])
        .slice(0, tier.key === "silver" ? 1 : 2)
        .map((item, index) => ({
          ...item,
          tierKey: tier.key,
          tierLabel: tier.label,
          rank: index + 1,
          ...sponsorTierMeta[tier.key],
        }))
    )
    .slice(0, 4);

  return (
    <div class="relative" style="font-family: var(--font-body);">

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <HeroSlider />

      {/* ═══════════════ DAY CARDS SECTION ═══════════════ */}
      <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="reveal-up mb-12 text-center">
          <span class="t-badge mx-auto">Festival Days</span>
          <h2 class="t-heading mt-4 text-[clamp(2rem,5vw,3.5rem)] text-[var(--t-text)]">
            Build. Battle.{" "}
            <span class="t-gradient">Celebrate.</span>
          </h2>
          <p class="mt-3 text-sm text-[var(--t-dim)]">Click a day to explore its full roadmap</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {configData.value.days.map((day, index) => {
            const roadmapLinks = ["/roadmap/day1", "/roadmap/day2", "/roadmap/day3"];
            return (
              <Link
                key={day.day}
                href={roadmapLinks[index] || "/roadmap/day1"}
                data-tilt
                class={[
                  "t-day-card group text-left p-6 sm:p-7 block no-underline",
                  `bg-gradient-to-br ${dayColors[index] || dayColors[0]}`,
                  "reveal-up",
                ]}
                style={{
                  borderColor: dayBorderColors[index] || dayBorderColors[0],
                  transitionDelay: `${index * 80}ms`,
                  backgroundImage: day.bgImage ? `linear-gradient(rgba(14,10,30,0.85), rgba(14,10,30,0.95)), url(${day.bgImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {/* Inner glow blob */}
                <div
                  class="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full blur-2xl opacity-40"
                  style={{ background: dayAccents[index] || dayAccents[0] }}
                ></div>

                {/* Top row */}
                <div class="relative flex items-start justify-between gap-3 mb-5">
                  <div
                    class="t-day-number text-xl"
                    style={{ background: `linear-gradient(135deg, ${dayAccents[index]}, ${dayAccents[index]}88)`, boxShadow: `0 4px 16px ${dayAccents[index]}55` }}
                  >
                    {dayIcons[index]}
                  </div>
                  <span class="t-label text-[var(--t-dim)]">{day.date}</span>
                </div>

                {/* Day name */}
                <h3
                  class="t-heading relative text-3xl sm:text-4xl"
                  style={{ color: dayAccents[index] || "var(--t-text)" }}
                >
                  {day.day}
                </h3>
                <p class="relative mt-1 text-sm font-medium text-[var(--t-muted)]">{day.highlight}</p>

                {/* Event chips */}
                <div class="relative mt-5 flex flex-wrap gap-2">
                  {day.events.slice(0, 3).map((event) => (
                    <span
                      key={`${day.day}-${event}`}
                      class="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs font-medium text-[var(--t-muted)]"
                    >
                      {event}
                    </span>
                  ))}
                  {day.events.length > 3 && (
                    <span
                      class="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ color: dayAccents[index], background: `${dayAccents[index]}15`, border: `1px solid ${dayAccents[index]}30` }}
                    >
                      +{day.events.length - 3} more
                    </span>
                  )}
                </div>

                {/* Bottom row */}
                <div class="relative mt-6 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4">
                  <span class="text-xs text-[var(--t-dim)]">{day.events.length} Events</span>
                  <span class="text-xs font-bold tracking-widest uppercase group-hover:translate-x-1 transition-transform inline-block" style={{ color: dayAccents[index] }}>
                    View Roadmap →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section id="theta-stats" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="reveal-up mb-12 text-center">
          <span class="t-badge mx-auto">Theta Snapshot</span>
          <h2 class="t-heading mt-4 text-[clamp(2rem,5vw,3.5rem)] text-[var(--t-text)]">
            Numbers that{" "}
            <span class="t-gradient">define the fest</span>
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: (
                <svg class="w-6 h-6 text-[var(--t-violet)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-9 4h6M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              num: counterDisplay.value.events,
              suffix: "+",
              label: homeCopy.value.statsLabels.events,
              suffix2: configData.value.stats.events,
              delay: 0,
            },
            {
              icon: (
                <svg class="w-6 h-6 text-[var(--t-cyan)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m12 0H7m9-12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              num: counterDisplay.value.participants,
              suffix: "+",
              label: homeCopy.value.statsLabels.participants,
              suffix2: configData.value.stats.participants,
              delay: 100,
              featured: true,
            },
            {
              icon: (
                <svg class="w-6 h-6 text-[var(--t-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M4 21V8l8-5 8 5v13M9 21v-6h6v6M9 11h.01M15 11h.01" />
                </svg>
              ),
              num: counterDisplay.value.colleges,
              suffix: "+",
              label: homeCopy.value.statsLabels.colleges,
              suffix2: configData.value.stats.colleges,
              delay: 200,
            },
          ].map((stat) => (
            <article
              key={stat.label}
              class={["t-stat-card reveal-up", stat.featured ? "md:scale-[1.04]" : ""]}
              style={{ transitionDelay: `${stat.delay}ms` }}
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(120,80,255,0.2)] bg-[rgba(124,58,237,0.08)]">
                  {stat.icon}
                </div>
                <span class="t-label text-[var(--t-dim)]">2026</span>
              </div>
              <div class="t-stat-num">{stat.num}+</div>
              <div class="t-stat-label">{stat.label}</div>
              <div class="t-line-glow mt-5 w-3/4"></div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════ SPONSORS SECTION ═══════════════ */}
      <section class="mx-auto max-w-[100vw] px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div class="t-glass t-sponsor-showcase mx-auto flex min-h-[calc(100vh-7rem)] max-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col overflow-hidden px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
          <div class="t-sponsor-showcase__orb t-sponsor-showcase__orb--a"></div>
          <div class="t-sponsor-showcase__orb t-sponsor-showcase__orb--b"></div>
          <div class="t-sponsor-showcase__grid"></div>
          <div class="t-sponsor-showcase__beam"></div>
          <div class="t-sponsor-showcase__glyph t-sponsor-showcase__glyph--a"></div>
          <div class="t-sponsor-showcase__glyph t-sponsor-showcase__glyph--b"></div>

          <div class="relative mb-5 flex flex-wrap items-start justify-between gap-4 lg:mb-6">
            <div class="max-w-2xl">
              <span class="t-badge">{homeCopy.value.sponsors.badge}</span>
              <h2 class="t-heading mt-3 text-[clamp(1.9rem,4vw,3.35rem)] leading-[0.95] text-[var(--t-text)]">
                Sponsor Power for <span class="t-gradient">Theta 2026</span>
              </h2>
              <p class="mt-3 max-w-lg text-sm leading-relaxed text-[var(--t-muted)] sm:text-base" style="font-weight: 300;">
                Four featured partners. Ben 10 energy. Fast access to the full sponsor wall.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <span class="t-sticker">Legacy Wall</span>
              <Link href="/sponsors" class="t-btn-ghost !px-4 !py-2 !text-xs inline-flex">
                Open All
              </Link>
            </div>
          </div>

          <div class="relative mb-5 flex flex-wrap gap-3 lg:mb-6">
            {sponsorTiers.map((tier) => (
              <button
                key={`home-tier-${tier.key}`}
                type="button"
                onClick$={() => (selectedTier.value = tier.key)}
                class="t-sponsor-tier-pill"
              >
                <span>{tier.label}</span>
                <strong>{(sponsors.value[tier.key] || []).length}</strong>
              </button>
            ))}
          </div>

          <div class="relative grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2 xl:gap-5">
            {sponsorShowcaseItems.map((item, idx) => (
              <article
                key={`home-sponsor-${item.name}-${idx}`}
                class="t-sponsor-card t-sponsor-card--showcase reveal-up flex h-full min-h-0 flex-col justify-between"
                style={`--s-accent:${item.accent}; --s-glow:${item.glow}; --s-surface:${item.surface}; transition-delay:${idx * 80}ms;`}
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="t-sponsor-card__eyebrow">{item.eyebrow}</p>
                    <h3 class="mt-2 text-lg font-semibold text-[var(--t-text)]" style="font-family: var(--font-display);">
                      {item.name}
                    </h3>
                  </div>
                  <span class="t-sponsor-card__tier">{item.tierLabel}</span>
                </div>

                <div class="t-sponsor-logo-shell">
                  <img
                    src={item.logo}
                    alt={item.name}
                    width={220}
                    height={120}
                    loading="lazy"
                    class="t-sponsor-img t-sponsor-img--showcase"
                  />
                </div>

                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-medium tracking-[0.2em] text-[var(--t-dim)] uppercase">
                    Slot {String(item.rank).padStart(2, "0")}
                  </p>
                  <button
                    type="button"
                    onClick$={() => (selectedTier.value = item.tierKey)}
                    class="t-sponsor-card__link"
                  >
                    View Tier
                  </button>
                </div>
              </article>
            ))}

            {sponsorShowcaseItems.length === 0 && (
              <div class="rounded-3xl border border-dashed border-[rgba(132,255,135,0.18)] bg-[rgba(5,10,7,0.76)] px-6 py-12 text-center text-sm text-[var(--t-muted)] sm:col-span-2">
                Sponsor highlights will appear here once the lineup is published.
              </div>
            )}
          </div>
        </div>
      </section>
      <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="t-cta-wrap p-8 sm:p-10 lg:p-16 text-center">
          {/* Orbs */}
          <div class="t-orb pointer-events-none h-64 w-64 bg-[rgba(124,58,237,0.2)] -top-16 -left-16"></div>
          <div class="t-orb pointer-events-none h-48 w-48 bg-[rgba(6,214,240,0.1)] -bottom-8 -right-8" style="animation-delay: 3s;"></div>

          <div class="relative reveal-up">
            <span class="t-badge mx-auto mb-6">Ready to Shine</span>
            <h2 class="t-heading text-[clamp(2.5rem,6vw,5rem)] text-[var(--t-text)]">
              {homeCopy.value.cta.titlePrefix}{" "}
              <span class="t-gradient">{homeCopy.value.cta.titleAccent}</span>
            </h2>
            <p class="mx-auto mt-5 max-w-xl text-base text-[var(--t-muted)]" style="font-weight: 300;">
              {homeCopy.value.cta.description}
            </p>

            {/* Meta pills */}
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              {[configData.value.meta.eventName, configData.value.meta.dates, configData.value.meta.venue].map((tag) => (
                <span key={tag} class="t-chip">{tag}</span>
              ))}
            </div>

            {/* Buttons */}
            <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/events" class="t-btn-primary t-btn-cta-pulse !px-8 !py-4 !text-base">
                {homeCopy.value.cta.browseEvents}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contact" class="t-btn-ghost !px-8 !py-4 !text-base">
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DAY SCHEDULE MODAL ═══════════════ */}
      {selectedDay.value && (
        <div class="t-modal-backdrop">
          <div
            class="absolute inset-0"
            onClick$={closeDay}
            aria-hidden="true"
          ></div>
          <div class="t-modal" role="dialog" aria-modal="true" aria-labelledby="day-modal-title">
            <div class="p-6 sm:p-8">
              {/* Header */}
              <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p class="t-label text-[var(--t-dim)] mb-1">{homeCopy.value.dayModal.scheduleTitle}</p>
                  <h3 id="day-modal-title" class="t-heading text-2xl text-[var(--t-text)]">
                    {selectedDay.value.day}
                  </h3>
                  <p class="mt-1 text-sm text-[rgba(192,132,252,0.9)]">
                    {selectedDay.value.date} — {selectedDay.value.highlight}
                  </p>
                </div>
                <button
                  onClick$={closeDay}
                  class="t-btn-ghost !py-1.5 !px-3 !text-xs shrink-0"
                  aria-label="Close"
                >
                  Close ✕
                </button>
              </div>

              <div class="t-divider mb-6"></div>

              {/* Event list */}
              <div class="space-y-3">
                {getDayEvents(selectedDay.value.day).length > 0 ? (
                  getDayEvents(selectedDay.value.day).map((event) => (
                    <div
                      key={event.id}
                      class="flex items-center justify-between rounded-xl border border-[rgba(120,80,255,0.12)] bg-[rgba(14,10,30,0.6)] p-4"
                    >
                      <div>
                        <p class="font-semibold text-[var(--t-text)]" style="font-family: var(--font-display);">{event.name}</p>
                        <p class="mt-0.5 text-xs text-[var(--t-muted)]">{event.timing} · {event.location}</p>
                      </div>
                      <Link href="/events" class="text-xs font-semibold text-[rgba(192,132,252,0.9)] hover:text-[var(--t-text)] transition-colors">
                        Details →
                      </Link>
                    </div>
                  ))
                ) : (
                  <p class="py-12 text-center text-sm text-[var(--t-dim)]">
                    {homeCopy.value.dayModal.emptyState}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div class="mt-6">
                <Link
                  href="/events"
                  onClick$={closeDay}
                  class="t-btn-ghost block w-full text-center !py-3"
                >
                  {homeCopy.value.dayModal.viewAllEvents}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SPONSOR TIER MODAL ═══════════════ */}
      {selectedTier.value && (() => {
        const tier = sponsorTiers.find((t) => t.key === selectedTier.value);
        if (!tier) return null;
        const tierSponsors = (sponsors.value[tier.key] || [])
          .slice()
          .sort((a, b) => (a.order || 999) - (b.order || 999));

        return (
          <div class="t-modal-backdrop">
            <div class="absolute inset-0" onClick$={closeTier} aria-hidden="true"></div>
            <div class="t-modal max-w-4xl" role="dialog" aria-modal="true">
              <div class="p-6 sm:p-8">
                {/* Header */}
                <div class="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p class="t-label text-[var(--t-dim)] mb-1">Sponsors</p>
                    <h3 class="t-heading text-2xl text-[var(--t-text)]">{tier.label} Partners</h3>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="t-badge">{tierSponsors.length} Partners</span>
                    <button onClick$={closeTier} class="t-btn-ghost !py-1.5 !px-3 !text-xs">Close ✕</button>
                  </div>
                </div>

                <div class="t-divider mb-6"></div>

                {/* Grid */}
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tierSponsors.map((item, idx) => (
                    <article key={`${tier.key}-${item.name}-modal-${idx}`} class="t-sponsor-card text-center flex flex-col items-center justify-center min-h-[7rem]">
                      <img
                        src={item.logo}
                        alt={item.name}
                        width={180} height={80}
                        loading="lazy"
                        class="t-sponsor-img max-h-14 max-w-[9rem]"
                      />
                      <p class="mt-3 text-xs font-medium tracking-wider text-[var(--t-dim)] uppercase">{item.name}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
});

export const head: DocumentHead = {
  title: "Theta 2026 | National Level Techno-Management Fest",
  meta: [
    {
      name: "description",
      content: "Theta 2026 is SASTRA's premier national level techno-management fest. Explore hackathons, robotics, workshops, and more. March 15-17, 2026.",
    },
  ],
};
