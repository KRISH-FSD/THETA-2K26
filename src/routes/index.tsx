import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { HeroSlider } from "../components/hero-slider/HeroSlider";
import { getDevicePerfTier } from "../utils/perf";

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
  clusters: { id: string; name: string; color: string }[];
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
  countdownLabels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  about: {
    badge: string;
    titlePrefix: string;
    titleAccent: string;
    titleSuffix: string;
  };
  statsLabels: { events: string; participants: string; colleges: string };
  sponsors: {
    badge: string;
    titlePrefix: string;
    titleAccent: string;
    hallBadge: string;
    hallTitlePrefix: string;
    hallTitleAccent: string;
    hallDescription: string;
    hallSticker: string;
    platinum: string;
    gold: string;
    silver: string;
    general: string;
    sponsorPrompt: string;
    sponsorButton: string;
  };
  cta: {
    titlePrefix: string;
    titleAccent: string;
    description: string;
    browseEvents: string;
  };
  dayModal: {
    scheduleTitle: string;
    emptyState: string;
    viewAllEvents: string;
  };
}

interface EventItem {
  id: number;
  name: string;
  category: string;
  cluster?: string;
  day?: string;
  timing: string;
  location: string;
  fee: string;
  status: string;
  description: string;
  image: string;
  registrationUrl?: string;
}

interface DayEvent {
  day: string;
  date: string;
  events: string[];
  highlight: string;
  bgImage: string;
}

interface Sponsor {
  name: string;
  logo: string;
  order?: number;
  isActive?: boolean;
}

interface SponsorsConfig {
  diamond?: Sponsor[];
  platinum: Sponsor[];
  gold: Sponsor[];
  silver?: Sponsor[];
  media?: Sponsor[];
}

/* ──────────────────────── defaults ──────────────────────────── */
const defaultHomeCopy: HomeCopy = {
  hero: {
    bannerDate: "March 15-17, 2026",
    titleMain: "THETA",
    titleAccent: "2026",
    description:
      "National Level Techno-Management Fest hosted by SASTRA Deemed University.",
    exploreEvents: "Explore Events",
    contactUs: "Contact Us",
  },
  countdownLabels: {
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
  },
  about: {
    badge: "About Theta",
    titlePrefix: "India's Premier",
    titleAccent: "Techno-Management",
    titleSuffix: "Fest",
  },
  statsLabels: {
    events: "Registrations",
    participants: "Participants",
    colleges: "Institutes",
  },
  sponsors: {
    badge: "Our Sponsors",
    titlePrefix: "Powered by",
    titleAccent: "Partners",
    hallBadge: "Previous Sponsors",
    hallTitlePrefix: "Past Edition",
    hallTitleAccent: "Partners",
    hallDescription:
      "These brands supported previous editions of Theta and helped build the fest legacy.",
    hallSticker: "Legacy Wall",
    platinum: "Platinum",
    gold: "Gold",
    silver: "Silver",
    general: "Media",
    sponsorPrompt: "Want to sponsor Theta 2026?",
    sponsorButton: "Become a Sponsor",
  },
  cta: {
    titlePrefix: "Ready to",
    titleAccent: "Compete?",
    description: "Build, ship, and showcase with the brightest teams in India.",
    browseEvents: "Browse Events",
  },
  dayModal: {
    scheduleTitle: "Day Schedule",
    emptyState: "Events will be announced soon.",
    viewAllEvents: "View All Events",
  },
};

const defaultConfig: ConfigData = {
  meta: {
    eventName: "Theta 2026",
    tagline: "National Level Techno-Management Fest",
    dates: "March 15-17, 2026",
    venue: "SASTRA Deemed University",
  },
  stats: { events: "1500+", participants: "3000+", colleges: "300+" },
  about: {
    title: "About Theta",
    description:
      "Theta is a national-level techno-management fest organized by SASTRA Deemed University.",
    features: [
      { title: "30+ Events", description: "Competitions and workshops." },
      { title: "1000+ Participants", description: "From across India." },
      { title: "80+ Colleges", description: "Top talent meets here." },
    ],
  },
  days: [
    {
      day: "Day One",
      date: "March 15, 2026",
      events: ["Inauguration"],
      highlight: "Opening Ceremony",
      bgImage: "",
    },
    {
      day: "Day Two",
      date: "March 16, 2026",
      events: ["Hackathon"],
      highlight: "Flagship Competitions",
      bgImage: "",
    },
    {
      day: "Day Three",
      date: "March 17, 2026",
      events: ["Finale"],
      highlight: "Prize Distribution",
      bgImage: "",
    },
  ],
  clusters: [],
};

const defaultSponsors: SponsorsConfig = {
  diamond: [],
  platinum: [],
  gold: [],
  silver: [],
  media: [],
};

const HomeLazyPlaceholder = component$(
  (props: { id: string; minHeight?: string }) => (
    <div
      data-home-lazy={props.id}
      class="home-lazy-placeholder flex items-center justify-center"
      style={`min-height:${props.minHeight || "70vh"}`}
      aria-hidden="true"
    />
  ),
);

interface HomeDataPayload {
  config: ConfigData;
  sponsors: SponsorsConfig;
  events: EventItem[];
  homeCopy: HomeCopy;
}

let homeDataCache: HomeDataPayload | null = null;
let homeDataPromise: Promise<HomeDataPayload> | null = null;

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
  const match = datesText.match(
    /\b([A-Za-z]+)\s+(\d{1,2})(?:\s*[-–]\s*\d{1,2})?,\s*(\d{4})\b/,
  );
  if (match) {
    const [, month, day, year] = match;
    const parsed = new Date(`${month} ${day}, ${year} 09:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date("2026-03-15T09:00:00");
};

const loadHomeData = async (): Promise<HomeDataPayload> => {
  if (homeDataCache) {
    return homeDataCache;
  }

  if (!homeDataPromise) {
    homeDataPromise = (async () => {
      const [cfgRes, sponsorRes, eventRes, contentRes] = await Promise.all([
        fetch("/data/config.json"),
        fetch("/data/sponsors.json"),
        fetch("/data/events.json"),
        fetch("/data/content.json"),
      ]);

      if (!cfgRes.ok || !sponsorRes.ok || !eventRes.ok || !contentRes.ok) {
        throw new Error("Failed to load homepage data.");
      }

      const cfg = await cfgRes.json();
      const sponsorPayload = await sponsorRes.json();
      const eventPayload = await eventRes.json();
      const content = await contentRes.json();

      const payload: HomeDataPayload = {
        config: { ...defaultConfig, ...cfg },
        sponsors: { ...defaultSponsors, ...(sponsorPayload.sponsors || {}) },
        events: eventPayload.events || [],
        homeCopy: content.home
          ? { ...defaultHomeCopy, ...content.home }
          : defaultHomeCopy,
      };

      homeDataCache = payload;
      return payload;
    })().finally(() => {
      homeDataPromise = null;
    });
  }

  return homeDataPromise;
};

/* perf helper — lo+mid get lighter animations, hi gets everything */
const isMobilePerfMode = (): boolean => getDevicePerfTier() !== "hi";

const dayAliases: Record<string, string[]> = {
  "Day One": ["Day 1", "Day One"],
  "Day Two": ["Day 2", "Day Two"],
  "Day Three": ["Day 3", "Day Three"],
};

const sponsorTiers = [
  { key: "diamond", label: "Diamond" },
  { key: "platinum", label: "Platinum" },
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" },
  { key: "media", label: "Media" },
] as const;

const sponsorTierMeta: Record<
  (typeof sponsorTiers)[number]["key"],
  {
    accent: string;
    glow: string;
    surface: string;
    eyebrow: string;
  }
> = {
  diamond: {
    accent: "#ff4d4f",
    glow: "rgba(255, 77, 79, 0.4)",
    surface:
      "linear-gradient(160deg, rgba(255, 77, 79, 0.2), rgba(8, 10, 12, 1))",
    eyebrow: "Elite Partners",
  },
  platinum: {
    accent: "#70f3ff",
    glow: "rgba(112, 243, 255, 0.4)",
    surface:
      "linear-gradient(160deg, rgba(112, 243, 255, 0.18), rgba(8, 12, 14, 1))",
    eyebrow: "Flagship Partners",
  },
  gold: {
    accent: "#ffd54a",
    glow: "rgba(255, 213, 74, 0.4)",
    surface:
      "linear-gradient(160deg, rgba(255, 213, 74, 0.16), rgba(12, 12, 8, 1))",
    eyebrow: "Premium Backers",
  },
  silver: {
    accent: "#ffffff",
    glow: "rgba(255, 255, 255, 0.2)",
    surface:
      "linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(10, 10, 10, 1))",
    eyebrow: "Sustaining Partners",
  },
  media: {
    accent: "#7c5cff",
    glow: "rgba(124, 92, 255, 0.22)",
    surface:
      "linear-gradient(160deg, rgba(124, 92, 255, 0.14), rgba(10, 8, 14, 1))",
    eyebrow: "Broadcast Reach",
  },
};

/* Day icons */
const dayIcons = ["", "", ""];
const dayAccents = ["#00ff55", "#ffce00", "#ff3131"];
const dayGradients = [
  "linear-gradient(135deg, #00ff55 0%, #00f2ff 100%)", // Day 1: Ben 10 Cyber
  "linear-gradient(135deg, #f6ff00 0%, #ff8c00 100%)", // Day 2: Hyper Volt
  "linear-gradient(135deg, #ff003c 0%, #ff5500 100%)", // Day 3: Neural Red
];
const dayBorderColors = [
  "rgba(0,255,85,0.25)",
  "rgba(255,206,0,0.25)",
  "rgba(255,51,51,0.25)",
];
const dayCardSurfaces = [
  "linear-gradient(180deg, rgba(8,14,10,0.96) 0%, rgba(10,18,12,0.94) 100%)",
  "linear-gradient(180deg, rgba(16,14,7,0.96) 0%, rgba(18,14,8,0.94) 100%)",
  "linear-gradient(180deg, rgba(20,8,10,0.96) 0%, rgba(17,8,12,0.94) 100%)",
];
const dayCardGlow = [
  "radial-gradient(120% 120% at 100% 0%, rgba(0,255,85,0.12) 0%, transparent 48%)",
  "radial-gradient(120% 120% at 100% 0%, rgba(255,206,0,0.12) 0%, transparent 48%)",
  "radial-gradient(120% 120% at 100% 0%, rgba(255,51,51,0.14) 0%, transparent 48%)",
];

const statSpotlight: Array<{
  key: keyof ConfigData["stats"];
  eyebrow: string;
  note: string;
  signal: string;
  accent: string;
  glow: string;
  progress: string;
  surface: string;
}> = [
  {
    key: "events",
    eyebrow: "Mission Entries",
    note: "Total individual and team registrations across the fest.",
    signal: "Entry feed online",
    accent: "#00ff55",
    glow: "rgba(0, 255, 85, 0.28)",
    progress: "74%",
    surface:
      "linear-gradient(145deg, rgba(0,255,85,0.18), rgba(7,12,8,0.96) 62%)",
  },
  {
    key: "participants",
    eyebrow: "Digital Footprint",
    note: "Builders, designers, and thinkers charging the experience.",
    signal: "Audience pulse active",
    accent: "#ffce00",
    glow: "rgba(255,206,0,0.24)",
    progress: "92%",
    surface:
      "linear-gradient(145deg, rgba(255,206,0,0.15), rgba(12,11,8,0.96) 62%)",
  },
  {
    key: "colleges",
    eyebrow: "15+ Institutes",
    note: "Institutions across the circuit widening the reach.",
    signal: "Visitor map expanding",
    accent: "#ff3333",
    glow: "rgba(255,51,51,0.24)",
    progress: "68%",
    surface:
      "linear-gradient(145deg, rgba(255,51,51,0.18), rgba(12,8,10,0.96) 62%)",
  },
];

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
  const selectedTier = useSignal<(typeof sponsorTiers)[number]["key"] | null>(
    null,
  );
  const sphereRotation = useSignal({ x: 0, y: 0 });
  const mobilePerfMode = useSignal(false);
  const showFestivalDays = useSignal(false);
  const showStats = useSignal(false);
  const showSponsors = useSignal(false);
  const showBrowseEvents = useSignal(false);
  const homeDataRequested = useSignal(false);

  useVisibleTask$(() => {
    const syncPerfMode = () => {
      const enabled = isMobilePerfMode();
      mobilePerfMode.value = enabled;
      document.documentElement.dataset.mobilePerf = enabled ? "true" : "false";
    };

    syncPerfMode();
    window.addEventListener("resize", syncPerfMode, { passive: true });
    window.addEventListener("orientationchange", syncPerfMode, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", syncPerfMode);
      window.removeEventListener("orientationchange", syncPerfMode);
      delete document.documentElement.dataset.mobilePerf;
    };
  });

  useVisibleTask$(({ cleanup }) => {
    const revealSection = (id: string) => {
      if (id === "festival-days") showFestivalDays.value = true;
      if (id === "stats") showStats.value = true;
      if (id === "sponsors") showSponsors.value = true;
      if (id === "browse-events") showBrowseEvents.value = true;
    };

    const placeholders = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-lazy]"),
    );

    if (!("IntersectionObserver" in window)) {
      placeholders.forEach((el) => revealSection(el.dataset.homeLazy || ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          revealSection(target.dataset.homeLazy || "");
          observer.unobserve(target);
        });
      },
      { rootMargin: "320px 0px" },
    );

    placeholders.forEach((el) => observer.observe(el));
    cleanup(() => observer.disconnect());
  });

  /* ── Global Interactive Background Canvas ── */

  /* ── Particles Effect ── */
  useVisibleTask$(() => {
    // Current particle effect is disabled to ensure build success
    return;
    /*
    const section = document.querySelector<HTMLElement>(".festival-days-mesh");
    const canvas = document.querySelector<HTMLCanvasElement>(".festival-days-mesh-web");
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particleCount = 30;
    const clusterCount = 10;
    const connectDistance = 104;
    const colors = ["#7ec850", "#c8ff00"];
    const particles: Array<{
      x: number; y: number; vx: number; vy: number; radius: number; color: string;
      minX: number; maxX: number; minY: number; maxY: number; cluster?: boolean;
    }> = [];
    const pointer = { x: 0, y: 0, active: false, radius: 210 };

    let width = 0; let height = 0; let raf = 0;
    const randomVelocity = () => (Math.random() - 0.5) * 0.14;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) {
        const edgePadding = 18;
        const topBand = Math.max(96, height * 0.24);
        const bottomBandY = Math.max(topBand + 40, height * 0.78);
        const sideBand = Math.max(120, width * 0.16);
        const pushParticle = (
          x: number,
          y: number,
          minX: number,
          maxX: number,
          minY: number,
          maxY: number,
          cluster = false,
          colorIndex = 0,
        ) => {
          particles.push({
            x,
            y,
            vx: randomVelocity(),
            vy: randomVelocity(),
            radius: cluster ? 1.85 : 1.55 + (Math.random() - 0.5) * 0.28,
            color: colors[colorIndex % colors.length],
            minX,
            maxX,
            minY,
            maxY,
            cluster,
          });
        };

        for (let i = 0; i < particleCount; i += 1) {
          const zone = i % 4;
          if (zone === 0) {
            pushParticle(edgePadding + Math.random() * (width - edgePadding * 2), edgePadding + Math.random() * (topBand - edgePadding), edgePadding, width - edgePadding, edgePadding, topBand, false, i);
          } else if (zone === 1) {
            pushParticle(edgePadding + Math.random() * (sideBand - edgePadding), edgePadding + Math.random() * (height - edgePadding * 2), edgePadding, sideBand, edgePadding, height - edgePadding, false, i);
          } else if (zone === 2) {
            pushParticle(width - sideBand + Math.random() * (sideBand - edgePadding), edgePadding + Math.random() * (height - edgePadding * 2), width - sideBand, width - edgePadding, edgePadding, height - edgePadding, false, i);
          } else {
            pushParticle(edgePadding + Math.random() * (width - edgePadding * 2), bottomBandY + Math.random() * Math.max(24, height - bottomBandY - edgePadding), edgePadding, width - edgePadding, bottomBandY, height - edgePadding, false, i);
          }
        }

        const diamondCenterX = width - Math.max(160, width * 0.18);
        const diamondCenterY = Math.max(86, height * 0.2);
        const diamondPoints = [[0, -54], [-26, -28], [26, -28], [-48, 0], [0, 0], [48, 0], [-26, 28], [26, 28], [0, 54], [0, 84]];
        diamondPoints.slice(0, clusterCount).forEach(([dx, dy], index) => {
          const x = diamondCenterX + dx;
          const y = diamondCenterY + dy;
          pushParticle(x, y, diamondCenterX - 92, diamondCenterX + 92, diamondCenterY - 82, diamondCenterY + 114, true, index);
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distance = Math.hypot(dx, dy);
          if (distance < pointer.radius && distance > 0.001) {
            const force = (1 - distance / pointer.radius) * 0.11;
            p.vx += (dx / distance) * force;
            p.vy += (dy / distance) * force;
          }
        }
        p.vx *= p.cluster ? 0.984 : 0.988;
        p.vy *= p.cluster ? 0.984 : 0.988;
        if (Math.abs(p.vx) < 0.025) p.vx += randomVelocity() * 0.35;
        if (Math.abs(p.vy) < 0.025) p.vy += randomVelocity() * 0.35;
        p.vx = Math.max(Math.min(p.vx, p.cluster ? 1.15 : 1.35), -(p.cluster ? 1.15 : 1.35));
        p.vy = Math.max(Math.min(p.vy, p.cluster ? 1.15 : 1.35), -(p.cluster ? 1.15 : 1.35));
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= p.minX || p.x >= p.maxX) p.vx *= -1;
        if (p.y <= p.minY || p.y >= p.maxY) p.vy *= -1;
        p.x = Math.min(Math.max(p.x, p.minX), p.maxX);
        p.y = Math.min(Math.max(p.y, p.minY), p.maxY);
        ctx.beginPath(); ctx.fillStyle = p.color; ctx.globalAlpha = 0.95;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]; const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < connectDistance) {
            const strength = 1 - distance / connectDistance;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = i % 2 === 0 ? "rgba(126, 200, 80, 1)" : "rgba(200, 255, 0, 1)";
            ctx.lineWidth = 0.55 + strength * 0.55;
            ctx.globalAlpha = strength * 0.1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1; raf = window.requestAnimationFrame(draw);
    };

    resize(); draw();
    const obs = new ResizeObserver(() => resize()); obs.observe(section);
    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(raf);
      obs.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
    */
  });

  /* ── Fetch Data ── */
  useVisibleTask$(async ({ track }) => {
    track(() => showFestivalDays.value);
    track(() => showStats.value);
    track(() => showSponsors.value);
    track(() => showBrowseEvents.value);

    const needsHomeData =
      showFestivalDays.value ||
      showStats.value ||
      showSponsors.value ||
      showBrowseEvents.value;

    if (!needsHomeData || homeDataRequested.value) return;
    homeDataRequested.value = true;

    try {
      const payload = await loadHomeData();
      configData.value = payload.config;
      sponsors.value = payload.sponsors;
      events.value = payload.events;
      homeCopy.value = payload.homeCopy;
    } catch (e) {
      console.error(e);
    }
  });

  /* ── Animations & Tasks ── */
  useVisibleTask$(({ track }) => {
    track(() => configData.value.meta.dates);
    const fest = parseFestStart(
      configData.value.meta.dates,
      configData.value.meta.startDate,
    ).getTime();
    const sync = () => {
      const diff = Math.max(0, fest - Date.now());
      countdown.value = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    sync();
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  });

  useVisibleTask$(({ track }) => {
    track(() => showStats.value);
    if (!showStats.value) return;

    track(() => configData.value.stats);
    const targets = {
      events: parseStatNumber(configData.value.stats.events),
      participants: parseStatNumber(configData.value.stats.participants),
      colleges: parseStatNumber(configData.value.stats.colleges),
    };
    if (isMobilePerfMode()) {
      counterDisplay.value = targets;
      return;
    }

    counterDisplay.value = targets;
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => showSponsors.value);
    track(() => mobilePerfMode.value);

    const spectrum = document.querySelector<HTMLElement>(
      "[data-partner-spectrum]",
    );
    if (!showSponsors.value || !spectrum) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;

    const sync = () => {
      const canMove =
        inView &&
        !document.hidden &&
        !mobilePerfMode.value &&
        !reduceMotion.matches;
      spectrum.dataset.partnerMoving = canMove ? "true" : "false";
    };

    if (!("IntersectionObserver" in window)) {
      inView = true;
      sync();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        sync();
      },
      { threshold: 0.25 },
    );

    observer.observe(spectrum);
    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);

    cleanup(() => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
      spectrum.dataset.partnerMoving = "false";
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);
    if (!selectedDay.value) return;
    const key = (e: any) => {
      if (e.key === "Escape") selectedDay.value = null;
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", key);
    };
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedTier.value);
    if (!selectedTier.value) return;
    const key = (e: any) => {
      if (e.key === "Escape") selectedTier.value = null;
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  });

  const closeDay = $(() => {
    selectedDay.value = null;
  });
  const closeTier = $(() => {
    selectedTier.value = null;
  });
  const getDayEvents = (name: string) =>
    events.value.filter((e) => e.day === (dayAliases[name]?.[0] || name));

  const marqueeSponsors = sponsorTiers.flatMap((tier) =>
    (sponsors.value[tier.key] || []).map((sponsor) => ({
      ...sponsor,
      tierKey: tier.key,
    })),
  );
  const spectrumSponsors = [...marqueeSponsors, ...marqueeSponsors];

  return (
    <div
      class="home-page-shell relative overflow-x-hidden"
      style="font-family: var(--font-body);"
    >
      <HeroSlider />

      {/* ── Global Interactive Background (Entire Page) ── */}
      {/* ═══════════════ SECTOR DIVIDER: HERO TO ROADMAP ═══════════════ */}
      <div class="home-section-divider relative my-0 h-px w-full bg-gradient-to-r from-transparent via-[#00ff55]/20 to-transparent sm:my-12">
        <div class="home-section-divider__label absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00ff55]/10 bg-black/80 px-5 py-1 text-[8px] font-black tracking-[0.4em] text-[#00ff55] uppercase shadow-[0_0_15px_rgba(0,255,85,0.1)] backdrop-blur-xl">
          Mission Sequence Initialized
        </div>
      </div>

      {/* ═══════════════ DAY CARDS ═══════════════ */}
      {showFestivalDays.value ? (
      <>
      <section class="festival-days-shell relative overflow-hidden px-5 py-9 [contain-intrinsic-size:1200px] [content-visibility:auto] sm:px-12 sm:py-16 lg:px-20">
        <style>{`
          .festival-title {
            font-family: var(--font-body), sans-serif;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0;
            text-transform: none;
            color: rgba(244, 247, 244, 0.9);
            text-shadow:
              0 1px 0 rgba(255, 255, 255, 0.08),
              0 14px 36px rgba(0, 0, 0, 0.42);
          }
          .festival-title__line {
            display: inline-block;
            max-width: min(40rem, 100%);
            text-wrap: balance;
          }
          .festival-title__base {
            color: inherit;
            font-weight: inherit;
          }
          .festival-title__accent {
            display: inline-block;
            position: relative;
            padding: 0 0.08em;
            font-family: var(--font-cursive), "Segoe Script", cursive;
            font-size: 1.34em;
            font-weight: 700;
            line-height: 0.86;
            text-transform: none;
            background: none;
            -webkit-text-fill-color: currentColor;
            filter: none;
          }
          .festival-title__accent--light {
            color: #2cff75;
            text-shadow: 0 0 18px rgba(44, 255, 117, 0.22);
          }
          .festival-title__accent--night {
            color: #ff3f5f;
            text-shadow: 0 0 18px rgba(255, 63, 95, 0.22);
          }
          .festival-title__accent::after {
            content: "";
            position: absolute;
            right: 0.08em;
            bottom: -0.12em;
            left: 0.08em;
            height: 0.08em;
            border-radius: 999px;
            background: currentColor;
            opacity: 0.24;
            transform: skewX(-14deg);
          }
          @media (max-width: 640px) {
            .festival-title {
              letter-spacing: 0;
            }
            .festival-title__line {
              display: block;
              white-space: normal;
              max-width: 19rem;
              margin-inline: auto;
            }
          }
          .t-day-card {
            isolation: isolate;
          }
          .t-day-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--day-surface);
            z-index: 0;
          }
          .t-day-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--day-glow);
            opacity: 0.85;
            transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 0;
            pointer-events: none;
          }
          .t-day-card:hover::after {
            opacity: 1;
            transform: scale(1.03);
          }
          .t-day-card__tag {
            border: 1px solid color-mix(in srgb, var(--day-accent) 18%, rgba(255,255,255,0.04));
            background: color-mix(in srgb, var(--day-accent) 7%, rgba(255,255,255,0.02));
            color: rgba(244, 248, 244, 0.7);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          }
          .t-day-card__meta {
            color: rgba(214, 222, 214, 0.62);
          }
          .t-day-card__date {
            color: rgba(214, 222, 214, 0.42);
          }
          .t-day-card__line {
            border-color: color-mix(in srgb, var(--day-accent) 10%, rgba(255,255,255,0.04));
          }
          .t-day-card__mark {
            transform: translateY(-50%) translateZ(0) !important;
            transition: opacity 0.35s ease, filter 0.35s ease !important;
          }
          .t-day-card:hover .t-day-card__mark {
            transform: translateY(-50%) translateZ(0) !important;
          }
        `}</style>

        {/* Global Mesh Background for this section */}
        <div class="festival-days-mesh absolute inset-0 z-0">
          <div class="festival-days-logo-glow" aria-hidden="true">
            <img
              src="/backgrounds/sastra-3.webp"
              alt=""
              class="festival-days-logo-mark"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="festival-days-backdrop" aria-hidden="true">
          <div class="festival-days-aurora festival-days-aurora--a" />
          <div class="festival-days-aurora festival-days-aurora--b" />
          <div class="festival-days-aurora festival-days-aurora--c" />
          <div class="festival-days-vignette" />
        </div>

        <div class="festival-days-shell__inner relative z-10 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="festival-header-wrap relative z-20 mb-8 text-center sm:mb-16">
            <div class="mb-3 overflow-hidden sm:mb-4">
              <span class="t-badge reveal-slide-up mx-auto block w-fit">
                Mission Day Selection
              </span>
            </div>
            <h2 class="festival-title relative mt-2 text-[clamp(1.2rem,2.35vw,1.9rem)] leading-[1.16]">
              <span class="festival-title__line">
                <span class="festival-title__base">Shine in the </span>
                <span class="festival-title__accent festival-title__accent--light">
                  light
                </span>
                <span class="festival-title__base"> &amp; rule the </span>
                <span class="festival-title__accent festival-title__accent--night">
                  night
                </span>
              </span>
            </h2>
            <div class="mt-4 overflow-hidden sm:mt-6">
              <p class="festival-subtitle block text-xs font-bold tracking-[0.28em] text-[var(--t-muted)] uppercase italic sm:text-[0.95rem] sm:tracking-[0.38em]">
                Track live transmission frequencies
              </p>
            </div>
          </div>

          <div class="festival-days-mesh relative z-10">
            <div class="grid gap-5 sm:gap-6 lg:grid-cols-3">
              {configData.value.days.map((day, index) => (
                <Link
                  key={day.day}
                  href={`/roadmap/day${index + 1}`}
                  onMouseMove$={(e, el) => {
                    if (
                      mobilePerfMode.value ||
                      !window.matchMedia("(pointer: fine)").matches ||
                      window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                    ) {
                      return;
                    }
                    const r = el.getBoundingClientRect();
                    el.style.setProperty(
                      "--mouse-x",
                      `${e.clientX - r.left}px`,
                    );
                    el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
                  }}
                  class="t-day-card group reveal-up block overflow-hidden rounded-[2rem] border p-6 backdrop-blur-3xl transition-all sm:p-7"
                  style={{
                    borderColor: `${dayBorderColors[index]}44`,
                    transitionDelay: `${index * 80}ms`,
                    transitionDuration: "700ms",
                    background: dayCardSurfaces[index],
                    "--day-accent": dayAccents[index],
                    "--day-gradient": dayGradients[index],
                    "--day-surface": dayCardSurfaces[index],
                    "--day-glow": dayCardGlow[index],
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.34), 0 0 0 1px ${dayBorderColors[index].replace("0.25", "0.14")}`,
                  }}
                >
                  <div class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/10" />
                  <img
                    src={
                      index === 2
                        ? "/spidy/spider-logo.webp"
                        : index === 1
                          ? "/onepeice/one-peice-logo.webp"
                          : "/ben10/ben10-logo.webp"
                    }
                    alt=""
                    aria-hidden="true"
                    class="t-day-card__mark absolute top-1/2"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width:
                        index === 0
                          ? "10.4rem"
                          : index === 1
                            ? "9.8rem"
                            : "10rem",
                      right:
                        index === 0
                          ? "-0.35rem"
                          : index === 1
                            ? "0.15rem"
                            : "0.2rem",
                      opacity: index === 1 ? 0.28 : 0.22,
                      filter:
                        index === 1
                          ? "brightness(1.12) grayscale(0.02) contrast(1.02)"
                          : "brightness(1.08) grayscale(0.08) contrast(1.02)",
                      top: index === 0 ? "53%" : index === 1 ? "58%" : "52%",
                    }}
                  />
                  <div class="absolute inset-0 z-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                  <div
                    class="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), ${dayAccents[index]}12, transparent 42%)`,
                    }}
                  />

                  {/* Layer 1: Base Visibility */}
                  <div class="relative z-10 flex h-full flex-col items-center text-center">
                    <div class="mb-10 flex justify-center">
                      <span class="t-label t-day-card__date">{day.date}</span>
                    </div>
                    <div class="mb-8 text-center">
                      <h3
                        class="t-heading text-4xl font-black sm:text-5xl"
                        style={{
                          background: dayGradients[index],
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {day.day}
                      </h3>
                      <p class="t-day-card__meta mt-2 text-[10px] tracking-widest uppercase">
                        {day.highlight}
                      </p>
                    </div>
                    <div class="mb-10 flex flex-wrap justify-center gap-2">
                      {day.events.slice(0, 3).map((e) => (
                        <span
                          key={e}
                          class="t-day-card__tag rounded-lg px-3 py-1.5 text-[9px] font-black uppercase"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                    <div class="flex-grow" />
                    <div class="t-day-card__line flex w-full flex-col items-center gap-3 border-t pt-6 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div
                          class="h-1 w-1 animate-pulse rounded-full"
                          style={{
                            background: dayAccents[index],
                            boxShadow: `0 0 5px ${dayAccents[index]}`,
                          }}
                        />
                        <span class="t-day-card__meta text-[9px] uppercase">
                          Mission Files: {day.events.length}
                        </span>
                      </div>
                      <span
                        class="flex items-center justify-center gap-1.5 text-[10px] font-black transition-transform group-hover:translate-x-2"
                        style={{
                          background: dayGradients[index],
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        TRANSMISSION <span class="text-lg">→</span>
                      </span>
                    </div>
                  </div>

                  {/* Layer 2: Knockout Overlay (Black text on white logo) */}
                  <div
                    class="t-knockout-overlay pointer-events-none absolute inset-x-8 inset-y-8 z-20 flex h-full flex-col items-center text-center"
                    style={{
                      WebkitMaskImage: `url(${index === 2 ? "/spidy/spider-logo.webp" : index === 1 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp"})`,
                      WebkitMaskSize:
                        index === 0
                          ? "11rem"
                          : index === 1
                            ? "11rem"
                            : "10.5rem",
                      WebkitMaskPosition: `right ${index === 2 ? "-1.5rem" : index === 1 ? "-2rem" : "-1rem"} center`,
                      WebkitMaskRepeat: "no-repeat",
                      maskImage: `url(${index === 2 ? "/spidy/spider-logo.webp" : index === 1 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp"})`,
                      maskSize:
                        index === 0
                          ? "11rem"
                          : index === 1
                            ? "11rem"
                            : "10.5rem",
                      maskPosition: `right ${index === 2 ? "-1.5rem" : index === 1 ? "-2rem" : "-1rem"} center`,
                      maskRepeat: "no-repeat",
                    }}
                  >
                    <div class="mb-10 flex justify-between opacity-0">
                      {" "}
                      {/* Hide icons in knockout */}
                    </div>
                    <div class="mb-8 text-center"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTOR DIVIDER: ROADMAP TO STATS ═══════════════ */}
      </>
      ) : (
        <HomeLazyPlaceholder id="festival-days" minHeight="90vh" />
      )}

      <div class="relative my-10 h-px w-full bg-gradient-to-r from-transparent via-[#70f3ff]/30 to-transparent sm:my-16">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#70f3ff]/20 bg-black px-6 py-1 text-[9px] font-black tracking-[0.4em] text-[#70f3ff] uppercase shadow-[0_0_15px_rgba(112,243,255,0.1)] backdrop-blur-md">
          Quantum Telemetry Active
        </div>
      </div>

      {/* ═══════════════ STATS ═══════════════ */}
      {showStats.value ? (
      <>
      <section
        id="theta-stats"
        class="theta-stats-section flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0514] px-6 py-16 [contain-intrinsic-size:1000px] [content-visibility:auto] sm:px-12 lg:h-screen lg:min-h-0 lg:flex-row lg:px-20 lg:py-0"
      >
        <div class="theta-stats-bento mx-auto grid h-auto w-full max-w-[125rem] grid-cols-1 items-center gap-6 sm:gap-10 lg:h-full lg:max-h-[85vh] lg:grid-cols-[0.85fr_1.15fr]">
          {/* --- BENTO CARD: VISUAL & TITLE --- */}
          <div class="theta-bento-card theta-bento-card--visual reveal-left relative flex h-full flex-col justify-between overflow-hidden rounded-[3rem] border border-white/5 bg-[#050a05]/40 p-8 backdrop-blur-3xl sm:p-10 lg:min-h-[450px]">
            <img
              src="/theta-logo.webp"
              alt=""
              class="theta-bento-card__watermark opacity-[0.03]"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />

            <div class="theta-stats-copy relative z-10">
              <span class="t-badge flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black tracking-widest text-[#00ff55] uppercase">
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff55] shadow-[0_0_8px_#00ff55]" />
                Theta Snapshot
              </span>
              <h2 class="theta-stats-copy__title t-heading mt-4 text-5xl font-black tracking-tighter text-white uppercase sm:text-7xl">
                Fest{" "}
                <span class="bg-gradient-to-r from-[#00ff55] to-[#70f3ff] bg-clip-text text-transparent">
                  Vitals
                </span>
              </h2>
            </div>

            <div class="theta-stats-visual-wrap relative hidden flex-1 items-center justify-center py-8 lg:flex">
              <div class="theta-stats-visual-container relative flex scale-90 flex-col items-center justify-center sm:scale-110">
                {/* --- QUANTUM ENERGY CORE (BACKGROUND) --- */}
                <div
                  class="theta-stats-core theta-stats-core--quantum group absolute inset-0 m-auto"
                  style={{
                    transform: `perspective(1200px) rotateX(var(--sphere-rx, 0deg)) rotateY(var(--sphere-ry, 0deg))`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <div
                    class="theta-stats-core__hexagon border-[#00ff55]/20"
                    aria-hidden="true"
                  />
                  <div class="theta-stats-core__rings" aria-hidden="true">
                    <div class="theta-stats-core__ring border-[#00ff55]/30" />
                    <div class="theta-stats-core__ring border-[#70f3ff]/20" />
                  </div>
                  <div
                    class="theta-stats-core__laser-scan bg-gradient-to-b from-transparent via-[#00ff55]/40 to-transparent"
                    aria-hidden="true"
                  />
                  {/* Removed theta-stats-core__grid squares to prevent lag */}
                  <div
                    class="theta-stats-core__shimmer-rim"
                    aria-hidden="true"
                  />
                </div>

                {/* --- DATA HERO (FOREGROUND) --- */}
                <div class="theta-stats-data-stack relative z-10 flex min-h-[220px] flex-col items-center justify-center text-center">
                  <div class="theta-stats-core__copy">
                    <span class="theta-stats-core__label text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">
                      Institute Network
                    </span>
                    <strong class="theta-stats-core__value mt-2 block text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-8xl">
                      {counterDisplay.value.colleges}+
                    </strong>
                  </div>

                  <div class="theta-stats-pulse-wrap mt-6">
                    <div class="theta-stats-core__status flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black tracking-widest text-[#00ff55] uppercase">
                      <span class="theta-stats-core__status-dot h-2 w-2 animate-ping rounded-full bg-[#00ff55] shadow-[0_0_12px_#00ff55]" />
                      Campus network live
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BRAND INTEGRATION --- */}
            <div class="theta-stats-brand-row relative z-20 mt-auto flex w-full flex-row items-center justify-center gap-6 pt-6 sm:gap-12">
              <img
                src="/theta-logo.webp"
                alt="Theta Logo"
                loading="lazy"
                decoding="async"
                class="h-20 w-auto object-contain opacity-60 brightness-0 invert sm:h-28"
              />
              <div class="h-8 w-[1px] bg-white/10 sm:h-12" aria-hidden="true" />
              <img
                src="/sponsors/general/sastra-university-logo.jpg"
                alt="SASTRA University"
                loading="lazy"
                decoding="async"
                class="h-8 w-auto rounded-md object-contain opacity-60 sm:h-12"
              />
            </div>
          </div>

          {/* --- BENTO GRID: STATS RAIL --- */}
          <div class="theta-stats-side-right flex h-full flex-col justify-center gap-6">
            {statSpotlight.map((item, index) => (
              <article
                key={item.key}
                class="theta-bento-card theta-bento-card--stat theta-stats-node reveal-right relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a]/60 p-6 backdrop-blur-2xl transition-all hover:bg-[#0f0f0f]/80 sm:p-8"
                style={`--theta-stat-accent:${item.accent}; --theta-stat-glow:${item.glow}; --theta-stat-surface:${item.surface}; transition-delay:${index * 120}ms`}
              >
                <div class="theta-stats-node__meta mb-3 flex items-center justify-between">
                  <span class="theta-stats-node__index">0{index + 1}</span>
                  <span class="theta-stats-node__eyebrow text-[9px] font-black tracking-[0.25em] text-white/40 uppercase">
                    {item.eyebrow}
                  </span>
                </div>
                <div class="relative z-10">
                  <h4 class="theta-stats-node__label mb-1 text-[10px] font-black tracking-widest text-white/40 uppercase">
                    {homeCopy.value.statsLabels[item.key]}
                  </h4>
                  <div class="theta-stats-node__value t-heading text-4xl font-black text-white sm:text-5xl">
                    {counterDisplay.value[item.key]}+
                  </div>

                  <div class="mt-4 flex items-center gap-3">
                    <div class="theta-stats-node__signal rounded-full border border-white/10 px-3 py-1 text-[9px] font-black tracking-widest text-[#70f3ff]/60 uppercase">
                      {item.signal}
                    </div>
                    <span class="translate-y-[1px] text-[9px] leading-none font-bold tracking-widest text-white/20 uppercase">
                      {item.note}
                    </span>
                  </div>
                </div>

                <div class="theta-stats-node__meter mt-8 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <span
                    class="theta-stats-node__meter-fill block h-full"
                    style={`width:${item.progress}; background:${item.accent}; box-shadow: 0 0 15px ${item.accent}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTOR DIVIDER: STATS TO SPONSORS ═══════════════ */}
      </>
      ) : (
        <HomeLazyPlaceholder id="stats" minHeight="80vh" />
      )}

      <div class="relative my-10 h-px w-full bg-gradient-to-r from-transparent via-[#0ea935]/30 to-transparent sm:my-16">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0ea935]/20 bg-black px-6 py-1 text-[9px] font-black tracking-[0.4em] text-[#0ea935] uppercase shadow-[0_0_15px_rgba(14,169,53,0.1)] backdrop-blur-md">
          Partner Ecosystem Signal
        </div>
      </div>

      {/* ═══════════════ SPONSORS ═══════════════ */}
      {showSponsors.value ? (
      <>
      <div class="relative w-full overflow-hidden bg-transparent">
        <section
          id="sponsors-grid"
          class="relative z-10 mx-auto max-w-7xl bg-transparent px-6 py-16 sm:px-12 lg:px-20"
        >
          <div class="relative z-10 mb-12 text-center">
            <div class="group mb-6 inline-flex cursor-default items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md transition-all duration-500 hover:border-white/20">
              <span class="h-2 w-2 animate-pulse rounded-full bg-[#0ea935] shadow-[0_0_8px_#0ea935]" />
              <span class="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase transition-colors group-hover:text-white/70">
                Partner Ecosystem
              </span>
            </div>
            <h2 class="mb-6 text-5xl font-black tracking-tighter text-white uppercase sm:text-7xl">
              The{" "}
              <span class="text-[#70f3ff] drop-shadow-[0_0_25px_rgba(112,243,255,0.4)]">
                Diamond
              </span>{" "}
              Standard
            </h2>
            <p class="mx-auto max-w-2xl text-sm leading-relaxed font-medium text-[var(--t-muted)] sm:text-lg">
              Explore the elite network of brands supporting Theta 2026.{" "}
              <br class="hidden sm:block" /> Click any tier to view full partner
              details.
            </p>
          </div>

          <div class="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-8">
            {sponsorTiers
              .filter((tier) =>
                (sponsors.value[tier.key as keyof SponsorsConfig] || []).some(
                  (s) => s.isActive,
                ),
              )
              .map((tier) => {
                const tierKey = tier.key as keyof SponsorsConfig;
                const activeSponsors = (sponsors.value[tierKey] || []).filter(
                  (s) => s.isActive,
                );
                const meta = sponsorTierMeta[tierKey];
                return (
                  <div
                    key={tier.key}
                    onClick$={() => {
                      selectedTier.value = tierKey;
                    }}
                    class="group relative flex min-h-[260px] w-full max-w-[340px] min-w-[280px] cursor-pointer flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[calc(20%-1.6rem)]"
                    style={{
                      background: meta.surface,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px ${meta.glow}`,
                    }}
                  >
                    {/* Dynamic Hover Glow */}
                    <div
                      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at top right, ${meta.accent}15, transparent 60%)`,
                      }}
                    />

                    <div class="relative z-10">
                      <span class="mb-3 block text-[11px] font-black tracking-[0.25em] text-white uppercase transition-colors group-hover:text-white/80">
                        {meta.eyebrow}
                      </span>
                      <h3
                        class="mb-2 text-4xl font-black tracking-tighter uppercase"
                        style={{
                          color: meta.accent,
                          textShadow: `0 0 20px ${meta.glow}`,
                        }}
                      >
                        {tier.label}
                      </h3>
                      <div
                        class="h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20"
                        style={{
                          background: meta.accent,
                          boxShadow: `0 0 10px ${meta.accent}`,
                        }}
                      />
                    </div>

                    <div class="relative z-10 mt-10 flex items-center justify-between">
                      <div class="flex -space-x-3">
                        {activeSponsors.slice(0, 3).map((s: any, i: number) => (
                          <div
                            key={i}
                            class="flex h-10 w-10 transform items-center justify-center overflow-hidden rounded-full border-2 border-[#0a0f0a] bg-white p-1.5 shadow-xl transition-transform group-hover:scale-110"
                            style={{ transitionDelay: `${i * 100}ms` }}
                          >
                            <img
                              src={s.logo}
                              alt=""
                              class="h-full w-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        ))}
                        {activeSponsors.length > 3 && (
                          <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0f0a] bg-[#1a251a] text-[11px] font-black text-white/80 shadow-xl backdrop-blur-md transition-colors group-hover:bg-[#2a3a2a]">
                            +{activeSponsors.length - 3}
                          </div>
                        )}
                      </div>
                      <div class="group/btn flex items-center gap-2">
                        <span class="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase transition-colors duration-300 group-hover:text-white">
                          Explore
                        </span>
                        <span class="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-xs transition-all group-hover:bg-white group-hover:text-black">
                          →
                        </span>
                      </div>
                    </div>

                    {/* Corner Circuit Decorative */}
                    <div class="pointer-events-none absolute -right-2 -bottom-2 h-16 w-16 opacity-[0.05] transition-opacity duration-700 group-hover:opacity-[0.15]">
                      <svg
                        viewBox="0 0 100 100"
                        class="h-full w-full"
                        style={{ fill: meta.accent }}
                      >
                        <path d="M100,0 L100,100 L0,100 L0,95 L95,95 L95,0 Z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Modern Running Alliance Hall */}
          <div class="relative z-10 mt-12 w-full text-center">
            <div class="mb-8 px-4">
              <div class="mb-6 inline-flex cursor-default items-center gap-3 rounded-full border border-[#0ea935]/20 bg-[#0ea935]/5 px-4 py-1.5 backdrop-blur-md transition-all hover:border-[#0ea935]/40">
                <span class="h-2 w-2 rounded-full bg-[#0ea935] shadow-[0_0_10px_#0ea935]" />
                <span class="text-[10px] font-black tracking-[0.4em] text-[#0ea935] uppercase">
                  Alliance Network
                </span>
              </div>
              <h3 class="text-4xl font-black tracking-tighter text-white uppercase sm:text-6xl">
                Partner{" "}
                <span class="bg-gradient-to-r from-[#70f3ff] to-[#0ea935] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(112,243,255,0.2)]">
                  Spectrum
                </span>{" "}
                2026
              </h3>
            </div>

            <div
              data-partner-spectrum
              data-partner-moving="false"
              class="t-marquee-wrap-full partner-spectrum-smart relative overflow-hidden select-none"
            >
              <div
                data-marquee-track
                class="t-marquee-track partner-spectrum-track partner-spectrum-track--moving flex flex-nowrap gap-6 py-8"
              >
                {spectrumSponsors.map(
                  (sponsor, index) => (
                    <article
                      key={`${sponsor.tierKey}-${sponsor.name}-${index}`}
                      class="group relative flex w-[260px] flex-shrink-0 flex-col items-center justify-center"
                    >
                      <div class="relative w-full rounded-[2.25rem] border border-white/5 bg-[#0a0f0a]/40 p-6 shadow-2xl transition-colors duration-200 group-hover:border-white/20 group-hover:bg-[#101510]/60">
                        {sponsor.isActive && (
                          <div class="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#ff4d4f]/30 bg-[#ff4d4f] px-4 py-1.5 text-[0.55rem] font-black tracking-widest text-black uppercase shadow-[0_0_25px_rgba(255,77,79,0.35)]">
                            <span class="h-1.5 w-1.5 rounded-full bg-black"></span>
                            Active
                          </div>
                        )}

                        <div class="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl bg-white/95 p-5 shadow-2xl">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            loading="lazy"
                            decoding="async"
                            class="h-full w-full object-contain mix-blend-multiply"
                          />
                          {/* Glassy Overlay on Logo */}
                          <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent" />
                        </div>

                        <div class="mt-6 text-center">
                          <p class="text-[0.65rem] font-black tracking-[0.3em] text-white uppercase">
                            {sponsor.name}
                          </p>
                          <div class="mx-auto mt-2 h-0.5 w-12 bg-[#0ea935]" />
                        </div>
                      </div>

                      {/* Side Decorative Numbers */}
                      <span class="pointer-events-none absolute top-8 -right-2 text-[4rem] font-black text-white/[0.02] italic select-none">
                        {String((index % marqueeSponsors.length) + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </article>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════ SECTOR DIVIDER: SPONSORS TO CTA ═══════════════ */}
      </>
      ) : (
        <HomeLazyPlaceholder id="sponsors" minHeight="90vh" />
      )}

      <div class="relative mt-12 h-px w-full bg-gradient-to-r from-transparent via-[#0ea935]/30 to-transparent sm:mt-20">
      </div>

      {/* ═══════════════ BROWSE EVENTS ═══════════════ */}
      {showBrowseEvents.value ? (
      <>
      <section
        id="browse-events-section"
        class="browse-events-section relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-16 sm:px-12 sm:py-24 lg:px-20"
      >
        <img
          src="/backgrounds/sastra-2%20copy.webp"
          alt=""
          loading="lazy"
          decoding="async"
          class="browse-events-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div class="relative z-10 mx-auto flex h-full w-full max-w-[100rem] flex-1 flex-col justify-between">
          {/* Eyebrow */}

          <div class="browse-events-eyebrow mb-16 sm:mb-24">
            <span class="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase sm:text-xs">
              POWERED BY THETA 2026
            </span>
          </div>

          {/* Big Typography */}
          <div
            class="relative mb-auto flex w-full flex-col"
            style="perspective: 1000px;"
          >
            <h2 class="text-[clamp(5rem,14vw,15rem)] leading-[0.85] font-black tracking-tighter text-white uppercase mix-blend-screen sm:tracking-tight">
              <span class="browse-events-title-1 block bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-left text-transparent">
                BROWSE<span class="text-[#0ea935] opacity-80">+</span>
              </span>
              <span class="browse-events-title-2 mt-2 block bg-gradient-to-br from-white/40 via-white/90 to-white bg-clip-text text-right text-transparent sm:mt-0 sm:ml-[10vw] sm:text-left">
                <span class="text-[#0ea935] opacity-80">+</span>EVENTS
              </span>
            </h2>

            {/* Explore Button */}
            <div class="browse-events-btn mt-12 w-fit sm:mt-16 sm:ml-[10vw]">
              <Link
                href="/events"
                class="group inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-8 py-4 text-xs font-black tracking-[0.2em] text-white uppercase backdrop-blur-md transition-all hover:border-transparent hover:bg-[#0ea935] hover:text-black hover:shadow-[0_0_20px_rgba(14,169,53,0.4)]"
              >
                Explore Now
                <img
                  src="/ben10/ben10-logo.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  class="browse-events-btn__icon ml-3 h-5 w-5 object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Bottom Row - Paragraph on Right */}
          <div class="browse-events-desc mt-20 flex w-full justify-end sm:mt-24">
            <p class="max-w-[280px] text-right text-xs leading-[1.8] font-medium text-[#8ca38c] sm:max-w-sm sm:text-sm">
              We transform ideas into fully-realized festival experiences — from
              intense challenges and showcases to campus-wide showdowns —
              creating an atmosphere that elevates the entire student
              collective.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ MODALS ═══════════════ */}
      </>
      ) : (
        <HomeLazyPlaceholder id="browse-events" minHeight="80vh" />
      )}

      {selectedDay.value && (
        <div class="t-modal-backdrop flex items-center justify-center p-4">
          <div class="absolute inset-0" onClick$={closeDay} />
          <div class="t-modal relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#050a05]/95 p-8 backdrop-blur-2xl">
            <div class="mb-8 flex items-start justify-between">
              <div>
                <h3 class="text-3xl font-black text-white">
                  {selectedDay.value.day}
                </h3>
                <p class="mt-1 text-[var(--t-muted)]">
                  {selectedDay.value.date}
                </p>
              </div>
              <button
                onClick$={closeDay}
                class="text-white/40 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>
            <div class="space-y-4">
              {getDayEvents(selectedDay.value.day).map((e) => (
                <div
                  key={e.id}
                  class="rounded-xl border border-white/5 bg-white/5 p-4"
                >
                  <h4 class="font-bold text-white">{e.name}</h4>
                  <p class="mt-1 text-xs text-[var(--t-muted)]">
                    {e.timing} · {e.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTier.value &&
        (() => {
          const tier = sponsorTiers.find((t) => t.key === selectedTier.value);
          if (!tier) return null;
          const items = (sponsors.value[tier.key] || []).filter(
            (s) => s.isActive,
          );
          return (
            <div class="t-modal-backdrop flex items-center justify-center p-4">
              <div class="absolute inset-0" onClick$={closeTier} />
              <div
                class="t-modal relative w-full max-w-3xl overflow-hidden rounded-3xl border bg-[#050a05]/95 p-10"
                style={{
                  boxShadow: `0 0 100px ${sponsorTierMeta[tier.key].glow}, inset 0 0 30px ${sponsorTierMeta[tier.key].glow}`,
                  borderColor: `${sponsorTierMeta[tier.key].accent}44`,
                }}
              >
                <div class="relative z-10 mb-8 flex items-center justify-between">
                  <h3
                    class="text-3xl font-black tracking-tighter uppercase"
                    style={{ color: sponsorTierMeta[tier.key].accent }}
                  >
                    {tier.label} Partners
                  </h3>
                  <button
                    onClick$={closeTier}
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:bg-white hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                <div class="relative z-10 grid grid-cols-2 gap-6 md:grid-cols-3">
                  {items.map((s, i) => (
                    <div
                      key={i}
                      class="t-sponsor-card group/item flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]"
                      style={{
                        borderColor: `${sponsorTierMeta[tier.key].accent}22`,
                      }}
                    >
                      <div class="flex h-16 w-full items-center justify-center overflow-hidden rounded-xl bg-white/95 p-3 transition-colors group-hover/item:bg-white">
                        <img
                          src={s.logo}
                          alt={s.name}
                          class="h-full w-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <p class="mt-4 text-center text-[10px] font-black tracking-widest text-white/30 uppercase transition-colors group-hover/item:text-white">
                        {s.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
});

export const head: DocumentHead = {
  title: "THETA 2K26 | SASTRA",
  meta: [
    {
      name: "description",
      content:
        "THETA 2K26 (Theta 2026) is SASTRA's national-level techno-management fest with hackathons, robotics, workshops, events and registrations.",
    },
    {
      property: "og:title",
      content: "THETA 2K26 | SASTRA",
    },
    {
      property: "og:description",
      content:
        "THETA 2K26 (Theta 2026) is SASTRA's national-level techno-management fest with hackathons, robotics, workshops, events and registrations.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://www.thetasrc.in/",
    },
    {
      property: "og:image",
      content: "https://www.thetasrc.in/og-image.png",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "THETA 2K26 | SASTRA",
    },
    {
      name: "twitter:description",
      content:
        "THETA 2K26 (Theta 2026) is SASTRA's national-level techno-management fest with hackathons, robotics, workshops, events and registrations.",
    },
    {
      name: "twitter:image",
      content: "https://www.thetasrc.in/og-image.png",
    },
  ],
};
