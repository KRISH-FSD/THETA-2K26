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
const dayAccents = ["#0ea935", "#06d6a0", "#d6ff00"];
const dayBorderColors = [
  "rgba(14,169,53,0.25)",
  "rgba(6,214,160,0.25)",
  "rgba(214,255,0,0.25)",
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
  const selectedTier = useSignal<(typeof sponsorTiers)[number]["key"] | null>(null);

  /* ── Particles Effect ── */
  useVisibleTask$(() => {
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

      if (pointer.active) {
        const ring = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, pointer.radius);
        ring.addColorStop(0, "rgba(126, 200, 80, 0.08)");
        ring.addColorStop(0.55, "rgba(126, 200, 80, 0.03)");
        ring.addColorStop(1, "rgba(126, 200, 80, 0)");
        ctx.beginPath();
        ctx.fillStyle = ring;
        ctx.globalAlpha = 1;
        ctx.arc(pointer.x, pointer.y, pointer.radius, 0, Math.PI * 2);
        ctx.fill();
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

      if (pointer.active) {
        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.hypot(dx, dy);
          if (distance < pointer.radius * 0.6) {
            const strength = 1 - distance / (pointer.radius * 0.6);
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.strokeStyle = "rgba(126, 200, 80, 1)";
            ctx.lineWidth = 0.45 + strength * 0.5;
            ctx.globalAlpha = strength * 0.08;
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
  });

  useVisibleTask$(() => {
    const section = document.querySelector<HTMLElement>(".festival-days-shell");
    if (!section) return;

    let raf = 0;
    const resetPointer = () => {
      section.style.setProperty("--festival-pointer-left", "0px");
      section.style.setProperty("--festival-pointer-right", "0px");
      section.style.setProperty("--festival-pointer-up", "0px");
      section.style.setProperty("--festival-pointer-down", "0px");
    };

    const syncScroll = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
      const verticalShift = Math.round((0.5 - progress) * 44);
      const horizontalShift = Math.round((progress - 0.5) * 34);
      const softShift = Math.round((progress - 0.5) * 18);

      section.style.setProperty("--festival-scroll-up", `${verticalShift}px`);
      section.style.setProperty("--festival-scroll-down", `${-verticalShift}px`);
      section.style.setProperty("--festival-scroll-left", `${horizontalShift}px`);
      section.style.setProperty("--festival-scroll-right", `${-horizontalShift}px`);
      section.style.setProperty("--festival-scroll-soft", `${softShift}px`);
    };

    const requestScrollSync = () => {
      if (!raf) raf = window.requestAnimationFrame(syncScroll);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      const pointerY = (event.clientY - rect.top) / rect.height - 0.5;

      section.style.setProperty("--festival-pointer-left", `${Math.round(pointerX * -18)}px`);
      section.style.setProperty("--festival-pointer-right", `${Math.round(pointerX * 18)}px`);
      section.style.setProperty("--festival-pointer-up", `${Math.round(pointerY * -14)}px`);
      section.style.setProperty("--festival-pointer-down", `${Math.round(pointerY * 14)}px`);
    };

    resetPointer();
    syncScroll();
    window.addEventListener("scroll", requestScrollSync, { passive: true });
    window.addEventListener("resize", requestScrollSync);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", resetPointer);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      resetPointer();
      window.removeEventListener("scroll", requestScrollSync);
      window.removeEventListener("resize", requestScrollSync);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", resetPointer);
    };
  });

  /* ── Fetch Data ── */
  useVisibleTask$(async () => {
    try {
      const [cfgRes, sponsorRes, eventRes, contentRes] = await Promise.all([
        fetch("/data/config.json"), fetch("/data/sponsors.json"), fetch("/data/events.json"), fetch("/data/content.json"),
      ]);
      if (!cfgRes.ok || !sponsorRes.ok || !eventRes.ok || !contentRes.ok) return;
      const cfg = await cfgRes.json(); const sponsorPayload = await sponsorRes.json();
      const eventPayload = await eventRes.json(); const content = await contentRes.json();
      configData.value = { ...defaultConfig, ...cfg };
      sponsors.value = { ...defaultSponsors, ...sponsorPayload.sponsors };
      events.value = eventPayload.events || [];
      if (content.home) homeCopy.value = { ...defaultHomeCopy, ...content.home };
    } catch (e) { console.error(e); }
  });

  /* ── Animations & Tasks ── */
  useVisibleTask$(({ track }) => {
    track(() => configData.value.meta.dates);
    const fest = parseFestStart(configData.value.meta.dates, configData.value.meta.startDate).getTime();
    const sync = () => {
      const diff = Math.max(0, fest - Date.now());
      countdown.value = {
        days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60),
      };
    };
    sync(); const id = setInterval(sync, 1000); return () => clearInterval(id);
  });

  useVisibleTask$(() => {
    const node = document.getElementById("theta-stats");
    if (!node) return;
    const animate = () => {
      const targets = { e: parseStatNumber(configData.value.stats.events), p: parseStatNumber(configData.value.stats.participants), c: parseStatNumber(configData.value.stats.colleges) };
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1800);
        counterDisplay.value = { events: Math.floor(targets.e * p), participants: Math.floor(targets.p * p), colleges: Math.floor(targets.c * p) };
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting) { animate(); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(node); return () => obs.disconnect();
  });

  useVisibleTask$(() => {
    gsap.registerPlugin(ScrollTrigger);
    [".reveal-up", ".reveal-left", ".reveal-right", ".reveal-scale"].forEach((cls) => {
      gsap.utils.toArray<HTMLElement>(cls).forEach((el) => {
        gsap.fromTo(el, { y: cls===".reveal-up"?40:0, x: cls===".reveal-left"?-50:cls===".reveal-right"?50:0, scale: cls===".reveal-scale"?0.9:1, opacity: 0 }, {
          y:0, x:0, scale:1, opacity:1, duration:0.8, ease:"power2.out", scrollTrigger:{ trigger:el, start:"top 90%" }
        });
      });
    });
  });

  useVisibleTask$(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
    const cleanups: any[] = [];
    cards.forEach(card => {
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translateY(-6px)`;
      };
      const leave = () => { card.style.transition="transform 0.4s ease"; card.style.transform="none"; };
      const enter = () => { card.style.transition="none"; };
      card.addEventListener("mousemove", move); card.addEventListener("mouseleave", leave); card.addEventListener("mouseenter", enter);
      cleanups.push(() => { card.removeEventListener("mousemove", move); card.removeEventListener("mouseleave", leave); card.removeEventListener("mouseenter", enter); });
    });
    return () => cleanups.forEach(c => c());
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);
    if (!selectedDay.value) return;
    const key = (e: any) => { if (e.key==="Escape") selectedDay.value=null; };
    document.body.style.overflow="hidden"; document.addEventListener("keydown", key);
    return () => { document.body.style.overflow=""; document.removeEventListener("keydown", key); };
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedTier.value);
    if (!selectedTier.value) return;
    const key = (e: any) => { if (e.key==="Escape") selectedTier.value=null; };
    document.addEventListener("keydown", key); return () => document.removeEventListener("keydown", key);
  });

  const closeDay = $(() => { selectedDay.value = null; });
  const closeTier = $(() => { selectedTier.value = null; });
  const getDayEvents = (name: string) => events.value.filter(e => e.day === (dayAliases[name]?.[0] || name));

  const sponsorShowcaseItems = sponsorTiers.flatMap(t => (sponsors.value[t.key]||[]).slice(0,2).map((s,i)=>({...s, tierLabel:t.label, rank:i+1, ...sponsorTierMeta[t.key]}))).slice(0,4);

  return (
    <div class="relative" style="font-family: var(--font-body);">
      <HeroSlider />

      {/* ═══════════════ DAY CARDS ═══════════════ */}
      <section class="festival-days-shell py-20">
        <div class="festival-days-backdrop" aria-hidden="true">
          <div class="festival-days-aurora festival-days-aurora--a" />
          <div class="festival-days-aurora festival-days-aurora--b" />
          <div class="festival-days-aurora festival-days-aurora--c" />
          <div class="festival-days-vignette" />
        </div>

        <div class="festival-days-shell__inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div class="reveal-up mb-12 text-center relative z-10">
          <span class="t-badge mx-auto">Festival Days</span>
          <h2 class="t-heading mt-4 text-[clamp(2.3rem,5vw,3.8rem)] text-white">Build. Battle. <span class="t-gradient">Celebrate.</span></h2>
          <p class="mt-4 text-xs font-bold tracking-[0.3em] uppercase text-[var(--t-muted)]">Select mission day to track transmission</p>
        </div>

        <div class="festival-days-mesh">
          <canvas class="festival-days-mesh-web pointer-events-none" />
          <div class="festival-days-logo-glow" aria-hidden="true">
            <img src="/ben10/ben10-logo.png" alt="" class="festival-days-logo-mark" />
          </div>
          <div class="festival-days-structure" aria-hidden="true">
            <div class="festival-days-orbit festival-days-orbit--left" />
            <div class="festival-days-orbit festival-days-orbit--right" />
            <div class="festival-days-orbit festival-days-orbit--bottom" />
            <div class="festival-days-bubble festival-days-bubble--left">
              <div class="festival-days-bubble__core" />
              <div class="festival-days-bubble__ring" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--right">
              <div class="festival-days-bubble__core" />
              <div class="festival-days-bubble__ring" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--top">
              <div class="festival-days-bubble__core" />
              <div class="festival-days-bubble__ring" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--bottom">
              <div class="festival-days-bubble__core" />
              <div class="festival-days-bubble__ring" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--edge">
              <div class="festival-days-bubble__core" />
              <div class="festival-days-bubble__ring" />
            </div>
          </div>
          <div class="grid gap-8 lg:grid-cols-3 relative z-10">
            {configData.value.days.map((day, index) => (
              <Link key={day.day} href={`/roadmap/day${index+1}`} data-tilt onMouseMove$={(e, el) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
                el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
              }} class="t-day-card group p-8 block reveal-up" style={{ borderColor: dayBorderColors[index], transitionDelay: `${index*80}ms` }}>
                <img src="/ben10/ben10-logo.png" alt="" aria-hidden="true" class="t-day-card__mark" />
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${dayAccents[index]}15, transparent 40%)` }} />
                <div class="relative z-10 flex flex-col h-full">
                <div class="flex justify-between mb-10">
                  <div class="t-day-number"><span class="text-xl group-hover:rotate-12 transition-transform">{dayIcons[index]}</span></div>
                  <span class="t-label opacity-40">{day.date}</span>
                </div>
                <div class="mb-8">
                  <h3 class="t-heading text-4xl sm:text-5xl font-black" style={{ color: dayAccents[index] }}>{day.day}</h3>
                  <p class="mt-2 text-[10px] uppercase tracking-widest text-[var(--t-muted)]">{day.highlight}</p>
                </div>
                <div class="flex flex-wrap gap-2 mb-10">
                  {day.events.slice(0,3).map(e => <span key={e} class="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-[9px] uppercase font-black text-white/60">{e}</span>)}
                </div>
                <div class="flex-grow" />
                <div class="flex justify-between border-t border-white/5 pt-6">
                  <div class="flex items-center gap-2"><div class="h-1 w-1 rounded-full animate-pulse" style={{ background: dayAccents[index], boxShadow:`0 0 12px ${dayAccents[index]}` }} /><span class="text-[9px] uppercase text-white/30">Mission Files: {day.events.length}</span></div>
                  <span class="text-[10px] font-black group-hover:translate-x-2 transition-transform flex items-center gap-1.5" style={{ color: dayAccents[index] }}>TRANSMISSION <span class="text-lg">→</span></span>
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section id="theta-stats" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="reveal-up mb-12 text-center">
          <span class="t-badge mx-auto">Theta Snapshot</span>
          <h2 class="t-heading mt-4 text-[clamp(2rem,5vw,3.5rem)] text-white">Numbers that <span class="t-gradient">define the fest</span></h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          {["events", "participants", "colleges"].map((k, i) => (
            <article key={k} class={["t-stat-card reveal-up", i===1?"md:scale-[1.04]":""]} style={{ transitionDelay:`${i*100}ms` }}>
              <div class="t-stat-num">{counterDisplay.value[k as keyof typeof counterDisplay.value]}+</div>
              <div class="t-stat-label">{homeCopy.value.statsLabels[k as keyof typeof homeCopy.value.statsLabels]}</div>
              <div class="t-line-glow mt-5 w-3/4" />
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════ SPONSORS ═══════════════ */}
      <section class="max-w-7xl mx-auto px-4 py-20">
        <div class="t-glass p-8 sm:p-12 relative overflow-hidden">
          <div class="relative z-10 mb-10 flex flex-wrap justify-between items-end gap-6">
            <div class="max-w-xl">
              <span class="t-badge">{homeCopy.value.sponsors.badge}</span>
              <h2 class="t-heading mt-4 text-4xl text-white">Sponsor Power for <span class="t-gradient">Theta 2026</span></h2>
            </div>
            <Link href="/sponsors" class="t-btn-ghost !px-6">Open Wall</Link>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sponsorShowcaseItems.map((s,i) => (
              <article key={i} class="t-sponsor-card reveal-up p-6" style={`--s-accent:${s.accent}; --s-glow:${s.glow}; --s-surface:${s.surface}; transition-delay:${i*80}ms`}>
                <div class="flex justify-between items-start mb-6">
                  <div><p class="text-[10px] uppercase tracking-tighter opacity-50">Partner</p><h3 class="text-white font-bold">{s.name}</h3></div>
                  <span class="t-sponsor-card__tier">{s.tierLabel}</span>
                </div>
                <div class="t-sponsor-logo-shell my-8"><img src={s.logo} alt={s.name} class="max-h-12 w-auto grayscale group-hover:grayscale-0 transition-all" /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section class="mx-auto max-w-7xl px-4 py-20">
        <div class="t-cta-wrap p-12 text-center rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden relative">
          <div class="t-orb bg-green-500/10 -top-20 -left-20 h-80 w-80" />
          <div class="relative reveal-up">
            <h2 class="t-heading text-6xl text-white">{homeCopy.value.cta.titlePrefix} <span class="t-gradient">{homeCopy.value.cta.titleAccent}</span></h2>
            <p class="mt-6 text-[var(--t-muted)] max-w-xl mx-auto">{homeCopy.value.cta.description}</p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/events" class="t-btn-primary !px-10 !py-5">Browse Events</Link>
              <Link href="/contact" class="t-btn-ghost !px-10 !py-5">Contact team</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MODALS ═══════════════ */}
      {selectedDay.value && (
        <div class="t-modal-backdrop flex items-center justify-center p-4">
          <div class="absolute inset-0" onClick$={closeDay} />
          <div class="t-modal w-full max-w-lg relative z-10 bg-[#050a05]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
            <div class="flex justify-between items-start mb-8">
              <div><h3 class="text-3xl text-white font-black">{selectedDay.value.day}</h3><p class="text-[var(--t-muted)] mt-1">{selectedDay.value.date}</p></div>
              <button onClick$={closeDay} class="text-white/40 hover:text-white transition-colors">✕</button>
            </div>
            <div class="space-y-4">
              {getDayEvents(selectedDay.value.day).map(e => (
                <div key={e.id} class="p-4 rounded-xl border border-white/5 bg-white/5">
                  <h4 class="text-white font-bold">{e.name}</h4>
                  <p class="text-xs text-[var(--t-muted)] mt-1">{e.timing} · {e.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTier.value && (() => {
        const tier = sponsorTiers.find(t => t.key === selectedTier.value);
        if (!tier) return null;
        const items = sponsors.value[tier.key] || [];
        return (
          <div class="t-modal-backdrop flex items-center justify-center p-4">
            <div class="absolute inset-0" onClick$={closeTier} />
            <div class="t-modal w-full max-w-3xl bg-[#050a05]/95 border border-white/10 rounded-3xl p-10">
              <div class="flex justify-between items-center mb-8">
                <h3 class="text-2xl text-white font-black">{tier.label} Partners</h3>
                <button onClick$={closeTier} class="text-white/40">✕</button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                {items.map((s,i) => (
                  <div key={i} class="t-sponsor-card p-6 flex flex-col items-center justify-center min-h-[120px]">
                    <img src={s.logo} alt={s.name} class="max-h-12 w-auto" />
                    <p class="mt-4 text-[10px] text-white/30 uppercase font-bold">{s.name}</p>
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
  title: "Theta 2026 | National Level Techno-Management Fest",
  meta: [{ name: "description", content: "Theta 2026 is SASTRA's premier national level techno-management fest. Explore hackathons, robotics, workshops, and more. March 15-17, 2026." }],
};
