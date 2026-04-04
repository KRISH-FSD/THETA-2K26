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
const dayIcons = ["", "", ""];
const dayAccents = ["#00ff55", "#ffce00", "#ff1a1a"];
const dayGradients = [
  "linear-gradient(135deg, #00ff55 0%, #00f2ff 100%)", // Day 1: Ben 10 Cyber
  "linear-gradient(135deg, #f6ff00 0%, #ff8c00 100%)", // Day 2: Hyper Volt
  "linear-gradient(135deg, #ff1a1a 0%, #ff0099 100%)", // Day 3: Neural Red
];
const dayBorderColors = [
  "rgba(0,255,85,0.25)",
  "rgba(255,206,0,0.25)",
  "rgba(255,26,26,0.25)",
];
const dayCardSurfaces = [
  "linear-gradient(180deg, rgba(8,14,10,0.96) 0%, rgba(10,18,12,0.94) 100%)",
  "linear-gradient(180deg, rgba(16,14,7,0.96) 0%, rgba(18,14,8,0.94) 100%)",
  "linear-gradient(180deg, rgba(20,8,10,0.96) 0%, rgba(17,8,12,0.94) 100%)",
];
const dayCardGlow = [
  "radial-gradient(120% 120% at 100% 0%, rgba(0,255,85,0.12) 0%, transparent 48%)",
  "radial-gradient(120% 120% at 100% 0%, rgba(255,206,0,0.12) 0%, transparent 48%)",
  "radial-gradient(120% 120% at 100% 0%, rgba(255,26,95,0.14) 0%, transparent 48%)",
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
      eyebrow: "Competitive spread",
      note: "Flagship contests, fast workshops, and showcases distributed through the fest grid.",
      signal: "Mission roster online",
      accent: "#00ff55",
      glow: "rgba(0, 255, 85, 0.28)",
      progress: "74%",
      surface: "linear-gradient(145deg, rgba(0,255,85,0.18), rgba(7,12,8,0.96) 62%)",
    },
    {
      key: "participants",
      eyebrow: "National turnout",
      note: "Builders, designers, and problem-solvers charging the campus experience together.",
      signal: "Audience pulse active",
      accent: "#ffce00",
      glow: "rgba(255,206,0,0.24)",
      progress: "92%",
      surface: "linear-gradient(145deg, rgba(255,206,0,0.15), rgba(12,11,8,0.96) 62%)",
    },
    {
      key: "colleges",
      eyebrow: "Campus footprint",
      note: "Institutions across the circuit plug into Theta and widen the reach every year.",
      signal: "Reach map expanding",
      accent: "#ff1a1a",
      glow: "rgba(255,26,26,0.24)",
      progress: "68%",
      surface: "linear-gradient(145deg, rgba(255,26,26,0.18), rgba(12,8,10,0.96) 62%)",
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
  const selectedTier = useSignal<(typeof sponsorTiers)[number]["key"] | null>(null);
  const sphereRotation = useSignal({ x: 0, y: 0 });
  const globalMouse = useSignal({ x: 0, y: 0 });
  const mouseSmoothing = useSignal({ x: 0, y: 0 });

  /* ── Global Interactive Background Canvas ── */
  useVisibleTask$(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".home-global-interactive-bg");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0; let height = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = [];
    const particleCount = 60;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    const createParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseSmoothing.value = {
        x: mouseSmoothing.value.x + (globalMouse.value.x - mouseSmoothing.value.x) * 0.1,
        y: mouseSmoothing.value.y + (globalMouse.value.y - mouseSmoothing.value.y) * 0.1
      };
      
      const mX = mouseSmoothing.value.x;
      const mY = mouseSmoothing.value.y;

      // Global Mouse Spotlight
      const gradient = ctx.createRadialGradient(mX, mY, 0, mX, mY, 500);
      gradient.addColorStop(0, "rgba(0, 255, 85, 0.12)");
      gradient.addColorStop(0.5, "rgba(0, 255, 85, 0.03)");
      gradient.addColorStop(1, "rgba(0, 255, 85, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Connect to mission cards (Data Filaments)
      const cards = document.querySelectorAll(".t-day-card");
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cX = rect.left + rect.width / 2;
        const cY = rect.top + rect.height / 2;
        const dist = Math.hypot(cX - mX, cY - mY);
        if (dist < 450) {
          ctx.beginPath();
          ctx.moveTo(mX, mY);
          ctx.lineTo(cX, cY);
          ctx.strokeStyle = `rgba(0, 255, 85, ${(1 - dist / 450) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Particles system
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        const dx = mX - p.x;
        const dy = mY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 85, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    createParticles();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  useVisibleTask$(() => {
    const trackMouse = (e: MouseEvent) => {
      globalMouse.value = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", trackMouse);
    return () => window.removeEventListener("mousemove", trackMouse);
  });

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

    const raf = 0;
    const resetPointer = () => {
      section.style.setProperty("--festival-pointer-left", "0px");
      section.style.setProperty("--festival-pointer-right", "0px");
      section.style.setProperty("--festival-pointer-up", "0px");
      section.style.setProperty("--festival-pointer-down", "0px");
    };

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const progress = self.progress;
        const verticalShift = Math.round((0.5 - progress) * 44);
        const horizontalShift = Math.round((progress - 0.5) * 34);
        const softShift = Math.round((progress - 0.5) * 18);

        section.style.setProperty("--festival-scroll-up", `${verticalShift}px`);
        section.style.setProperty("--festival-scroll-down", `${-verticalShift}px`);
        section.style.setProperty("--festival-scroll-left", `${horizontalShift}px`);
        section.style.setProperty("--festival-scroll-right", `${-horizontalShift}px`);
        section.style.setProperty("--festival-scroll-soft", `${softShift}px`);
      }
    });

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
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", resetPointer);

    return () => {
      resetPointer();
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
    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById("theta-stats");
    if (!section) return;

    const targets = {
      events: parseStatNumber(configData.value.stats.events),
      participants: parseStatNumber(configData.value.stats.participants),
      colleges: parseStatNumber(configData.value.stats.colleges)
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(".theta-stats-copy", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .fromTo(".theta-stats-visual-wrap", { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.6")
      .fromTo(".theta-stats-node", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.8")
      .to({ val: 0 }, {
        val: 1,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: function () {
          const p = this.targets()[0].val;
          counterDisplay.value = {
            events: Math.floor(targets.events * p),
            participants: Math.floor(targets.participants * p),
            colleges: Math.floor(targets.colleges * p)
          };
        }
      }, "-=1.2");
  });

  useVisibleTask$(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById("home-cta");
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        toggleActions: "play none none none",
      },
      defaults: {
        ease: "power3.out",
      },
    });

    tl.fromTo(
      ".home-cta__glow",
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 1.1 },
    )
      .fromTo(
        ".home-cta__badge, .home-cta__eyebrow",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
        "-=0.75",
      )
      .fromTo(
        ".home-cta__title-line",
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        "-=0.35",
      )
      .fromTo(
        ".home-cta__description",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.65 },
        "-=0.4",
      )
      .fromTo(
        ".home-cta__actions > *",
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12 },
        "-=0.35",
      )
      .fromTo(
        ".home-cta__card",
        { opacity: 0, x: 44, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.7, stagger: 0.12 },
        "-=0.65",
      )
      .fromTo(
        ".home-cta__gridline",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.1, ease: "power2.inOut" },
        "-=0.8",
      );
  });

  useVisibleTask$(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
    const cleanups: any[] = [];
    cards.forEach(card => {
      let raf = 0;
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateY(-3px)`;
        });
      };
      const leave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)";
      };
      const enter = () => { card.style.transition = "transform 0.18s linear"; };
      card.addEventListener("mousemove", move); card.addEventListener("mouseleave", leave); card.addEventListener("mouseenter", enter);
      cleanups.push(() => {
        if (raf) cancelAnimationFrame(raf);
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
        card.removeEventListener("mouseenter", enter);
      });
    });
    return () => cleanups.forEach(c => c());
  });

  useVisibleTask$(() => {
    gsap.registerPlugin(ScrollTrigger);
    const marks = document.querySelectorAll<HTMLElement>(".t-day-card__mark");
    const overlays = document.querySelectorAll<HTMLElement>(".t-knockout-overlay");
    const glowTargets = document.querySelectorAll<HTMLElement>(".t-glow-text");
    if (marks.length === 0) return;

    const colors = [
      "rgba(189, 255, 0, 0.85)",
      "rgba(255, 219, 0, 0.85)",
      "rgba(255, 0, 76, 0.85)"
    ];

    const tl = gsap.timeline({ repeat: -1 });

    marks.forEach((mark, i) => {
      const overlay = overlays[i];
      tl.to([mark, overlay], {
        opacity: i === 2 ? 0.34 : 0.28,
        scale: 1.025,
        y: 10,
        filter: i === 2 ? `drop-shadow(0 0 18px ${colors[i]})` : `drop-shadow(0 0 14px ${colors[i]})`,
        duration: 1.8,
        ease: "sine.inOut"
      }, "+=0.2")
        .to(glowTargets, {
          color: dayAccents[i],
          filter: "blur(0px)",
          scale: 1.04,
          y: 1,
          opacity: 0.9,
          duration: 1.1,
          ease: "sine.out"
        }, "<")
        .to([mark, overlay], {
          opacity: 0.12,
          scale: 1,
          y: 0,
          filter: "drop-shadow(0 0 0px transparent)",
          duration: 1.8,
          ease: "sine.inOut"
        })
        .to(glowTargets, {
          color: "rgba(255,255,255,0.4)",
          filter: "blur(4px)",
          scale: 1,
          y: 0,
          opacity: 0.72,
          duration: 1.2,
          ease: "sine.inOut"
        }, "<");
    });

    return () => {
      tl.kill();
    };
  });

  useVisibleTask$(() => {
    const sphere = document.querySelector<HTMLElement>(".theta-stats-core");
    if (!sphere) return;

    const onMove = (e: MouseEvent) => {
      const rect = sphere.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      sphereRotation.value = { x: y * 35, y: -x * 40 };
    };

    const onLeave = () => {
      sphereRotation.value = { x: 0, y: 0 };
    };

    sphere.addEventListener("mousemove", onMove);
    sphere.addEventListener("mouseleave", onLeave);

    return () => {
      sphere.removeEventListener("mousemove", onMove);
      sphere.removeEventListener("mouseleave", onLeave);
    };
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);
    if (!selectedDay.value) return;
    const key = (e: any) => { if (e.key === "Escape") selectedDay.value = null; };
    document.body.style.overflow = "hidden"; document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", key); };
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedTier.value);
    if (!selectedTier.value) return;
    const key = (e: any) => { if (e.key === "Escape") selectedTier.value = null; };
    document.addEventListener("keydown", key); return () => document.removeEventListener("keydown", key);
  });

  const closeDay = $(() => { selectedDay.value = null; });
  const closeTier = $(() => { selectedTier.value = null; });
  const getDayEvents = (name: string) => events.value.filter(e => e.day === (dayAliases[name]?.[0] || name));

  const marqueeSponsors = sponsorTiers.flatMap((tier) =>
    (sponsors.value[tier.key] || []).map((sponsor) => ({
      ...sponsor,
      tierKey: tier.key,
    })),
  );

  useVisibleTask$(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById("browse-events-section");
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(".browse-events-bg",
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 1.5, ease: "power3.out" }
    )
      .fromTo(".browse-events-eyebrow",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=1.0"
      )
      .fromTo(".browse-events-title-1",
        { opacity: 0, x: -80, rotateX: 45, transformOrigin: "left center" },
        { opacity: 1, x: 0, rotateX: 0, duration: 1.2, ease: "back.out(1.1)" },
        "-=0.7"
      )
      .fromTo(".browse-events-title-2",
        { opacity: 0, x: 80, rotateX: -45, transformOrigin: "right center" },
        { opacity: 1, x: 0, rotateX: 0, duration: 1.2, ease: "back.out(1.1)" },
        "-=0.9"
      )
      .fromTo(".browse-events-btn",
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" },
        "-=0.8"
      )
      .fromTo(".browse-events-desc",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );

    // Festival Days Header Reveal - FAST & SHARP
    gsap.fromTo(".reveal-slide-up",
      { y: "115%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".festival-header-wrap",
          start: "top 92%",
          toggleActions: "play none none none"
        }
      }
    );

    // Global Home Neural Grid Activation
    gsap.to(".home-neural-grid", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".festival-days-shell",
        start: "top 80%",
        end: "top 20%",
        scrub: true
      }
    });

    // Home Tracer Lines
    gsap.to(".home-tracer-path", {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: ".festival-days-shell",
        start: "top 50%",
        end: "bottom 50%",
        scrub: 1
      }
    });


    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  });

  return (
    <div class="relative overflow-x-hidden" style="font-family: var(--font-body);">
      <HeroSlider />

      {/* ── Global Interactive Background (Entire Page) ── */}
      <canvas class="home-global-interactive-bg fixed inset-0 z-0 pointer-events-none opacity-40" />
      
      <div class="home-neural-grid pointer-events-none fixed inset-0 z-0 opacity-0 bg-[radial-gradient(circle_at_center,rgba(0,255,85,0.03)_0%,transparent_70%)]">
        <div class="absolute inset-0 bg-[url('/grid.svg')] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] opacity-[0.07]" />
      </div>

      {/* ═══════════════ DAY CARDS ═══════════════ */}
      <section class="festival-days-shell py-20 relative overflow-hidden">
        <style>{`
          .festival-title {
            font-family: "Syne", var(--font-body), sans-serif;
          }
          .festival-title__line {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            white-space: nowrap;
            letter-spacing: 0.22em;
            text-shadow: 0 8px 30px rgba(0, 0, 0, 0.28);
            animation: festival-line-float 6s ease-in-out infinite;
          }
          .festival-title__line--alt {
            animation-delay: -3s;
          }
          .festival-title__base {
            color: rgba(255, 255, 255, 0.96);
            transition: transform 0.6s ease, opacity 0.6s ease;
          }
          .festival-title__accent {
            position: relative;
            display: inline-block;
            padding: 0 0.08em;
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: festival-accent-shift 4.8s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.08));
          }
          .festival-title__accent--light {
            background-image: linear-gradient(90deg, #9dff8b 0%, #00ff6e 45%, #bfffe0 100%);
          }
          .festival-title__accent--night {
            background-image: linear-gradient(90deg, #ff7a7a 0%, #ff2657 50%, #ff86c7 100%);
            animation-delay: -2.1s;
          }
          .festival-title__accent::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -0.08em;
            height: 0.08em;
            border-radius: 999px;
            background: currentColor;
            opacity: 0.18;
            transform: scaleX(0.72);
            transform-origin: center;
            filter: blur(4px);
          }
          @keyframes festival-line-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes festival-accent-shift {
            0%, 100% { background-position: 0% 50%; transform: translateY(0) scale(1); }
            50% { background-position: 100% 50%; transform: translateY(-1px) scale(1.03); }
          }
          @media (max-width: 640px) {
            .festival-title__line {
              gap: 0.24rem;
              letter-spacing: 0.12em;
              white-space: normal;
              justify-content: center;
              flex-wrap: wrap;
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
            transform: translateY(-50%) !important;
            transition: opacity 0.7s ease, filter 0.7s ease !important;
          }
          .t-day-card:hover .t-day-card__mark {
            transform: translateY(-50%) !important;
          }
        `}</style>
        {/* Animated Tracer Paths */}
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none">
           <path class="home-tracer-path" d="M 0,200 Q 500,300 1440,100" fill="none" stroke="#00ff55" stroke-width="1" stroke-dasharray="1000" stroke-dashoffset="1000" opacity="0.1" />
           <path class="home-tracer-path" d="M 1440,800 Q 720,600 0,900" fill="none" stroke="#00ff55" stroke-width="1" stroke-dasharray="1000" stroke-dashoffset="1000" opacity="0.1" />
        </svg>

        {/* Global Mesh Background for this section */}
        <div class="festival-days-mesh absolute inset-0 z-0">
          <canvas class="festival-days-mesh-web pointer-events-none" />
          <div class="festival-days-logo-glow" aria-hidden="true">
            <img src="/backgrounds/sastra-3.png" alt="" class="festival-days-logo-mark" />
          </div>
          <div class="festival-days-structure scale-150 sm:scale-100 opacity-55" aria-hidden="true" style="filter: drop-shadow(0 0 8px rgba(0,255,85,0.14))">
            <div class="festival-days-orbit festival-days-orbit--left opacity-60" />
            <div class="festival-days-orbit festival-days-orbit--right opacity-60" />
            <div class="festival-days-orbit festival-days-orbit--bottom opacity-60" />
            <div class="festival-days-bubble festival-days-bubble--left !opacity-100">
              <div class="festival-days-bubble__core !bg-[#00ff55] !shadow-[0_0_8px_#00ff55]" />
              <div class="festival-days-bubble__ring !border-[#00ff55]/25" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--right !opacity-100">
              <div class="festival-days-bubble__core !bg-[#00ff55] !shadow-[0_0_8px_#00ff55]" />
              <div class="festival-days-bubble__ring !border-[#00ff55]/25" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--top !opacity-100">
              <div class="festival-days-bubble__core !bg-[#00ff55] !shadow-[0_0_8px_#00ff55]" />
              <div class="festival-days-bubble__ring !border-[#00ff55]/25" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--bottom !opacity-100">
              <div class="festival-days-bubble__core !bg-[#00ff55] !shadow-[0_0_8px_#00ff55]" />
              <div class="festival-days-bubble__ring !border-[#00ff55]/25" />
            </div>
            <div class="festival-days-bubble festival-days-bubble--edge !opacity-100">
              <div class="festival-days-bubble__core !bg-[#00ff55] !shadow-[0_0_8px_#00ff55]" />
              <div class="festival-days-bubble__ring !border-[#00ff55]/25" />
            </div>
          </div>
        </div>

        <div class="festival-days-backdrop" aria-hidden="true">
          <div class="festival-days-aurora festival-days-aurora--a" />
          <div class="festival-days-aurora festival-days-aurora--b" />
          <div class="festival-days-aurora festival-days-aurora--c" />
          <div class="festival-days-vignette" />
        </div>

        <div class="festival-days-shell__inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          <div class="festival-header-wrap mb-24 text-center relative z-20">
            <div class="overflow-hidden mb-4">
              <span class="t-badge mx-auto reveal-slide-up block w-fit">Mission Day Selection</span>
            </div>
            <h2 class="festival-title mt-2 text-[clamp(1.15rem,5vw,2rem)] font-black uppercase leading-[1.1] text-white flex flex-col items-center">
              <div class="overflow-hidden py-1">
                <span class="festival-title__line reveal-slide-up">
                  <span class="festival-title__base">Shine in the</span>
                  <span class="festival-title__accent festival-title__accent--light">light</span>
                </span>
              </div>
              <div class="overflow-hidden py-1">
                <span class="festival-title__line festival-title__line--alt reveal-slide-up">
                  <span class="festival-title__base">&amp; rule the</span>
                  <span class="festival-title__accent festival-title__accent--night">night</span>
                </span>
              </div>
            </h2>
            <div class="overflow-hidden mt-6">
              <p class="reveal-slide-up block text-xs font-bold tracking-[0.4em] uppercase text-[var(--t-muted)] italic">Track live transmission frequencies</p>
            </div>
          </div>

          <div class="festival-days-mesh relative z-10">
            <div class="grid gap-8 lg:grid-cols-3">
              {configData.value.days.map((day, index) => (
                <Link key={day.day} href={`/roadmap/day${index + 1}`} data-tilt onMouseMove$={(e, el) => {
                  const r = el.getBoundingClientRect();
                  el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
                  el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
                }} class="t-day-card group p-8 block reveal-up backdrop-blur-3xl border rounded-[2rem] transition-all relative overflow-hidden"
                  style={{
                    borderColor: `${dayBorderColors[index]}44`,
                    transitionDelay: `${index * 80}ms`,
                    transitionDuration: "700ms",
                    background: dayCardSurfaces[index],
                    "--day-accent": dayAccents[index],
                    "--day-gradient": dayGradients[index],
                    "--day-surface": dayCardSurfaces[index],
                    "--day-glow": dayCardGlow[index],
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.34), 0 0 0 1px ${dayBorderColors[index].replace("0.25", "0.14")}`
                  }}>
                  <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/10 pointer-events-none z-0" />
                  <img
                    src={index === 2 ? "/spidy/spider-logo.png" : (index === 1 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png")}
                    alt=""
                    aria-hidden="true"
                    class="t-day-card__mark absolute top-1/2"
                    style={{
                      width: index === 0 ? "10.4rem" : (index === 1 ? "9.8rem" : "10rem"),
                      right: index === 0 ? "-0.35rem" : (index === 1 ? "0.15rem" : "0.2rem"),
                      opacity: index === 1 ? 0.28 : 0.22,
                      filter: index === 1
                        ? "brightness(1.12) grayscale(0.02) contrast(1.02)"
                        : "brightness(1.08) grayscale(0.08) contrast(1.02)",
                      top: index === 0 ? "53%" : (index === 1 ? "58%" : "52%")
                    }}
                  />
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent z-0" />
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ background: `radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), ${dayAccents[index]}12, transparent 42%)` }} />

                  {/* Layer 1: Base Visibility */}
                  <div class="relative z-10 flex flex-col h-full">
                    <div class="flex justify-end mb-10">
                      <span class="t-label t-day-card__date">{day.date}</span>
                    </div>
                    <div class="mb-8">
                      <h3 class="t-heading text-4xl sm:text-5xl font-black"
                        style={{
                          background: dayGradients[index],
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}>{day.day}</h3>
                      <p class="t-day-card__meta mt-2 text-[10px] uppercase tracking-widest">{day.highlight}</p>
                    </div>
                    <div class="flex flex-wrap gap-2 mb-10">
                      {day.events.slice(0, 3).map(e => <span key={e} class="t-day-card__tag rounded-lg px-3 py-1.5 text-[9px] uppercase font-black">{e}</span>)}
                    </div>
                    <div class="flex-grow" />
                    <div class="t-day-card__line flex justify-between border-t pt-6">
                      <div class="flex items-center gap-2">
                        <div class="h-1 w-1 rounded-full animate-pulse" style={{ background: dayAccents[index], boxShadow: `0 0 5px ${dayAccents[index]}` }} />
                        <span class="t-day-card__meta text-[9px] uppercase">Mission Files: {day.events.length}</span>
                      </div>
                      <span class="text-[10px] font-black group-hover:translate-x-2 transition-transform flex items-center gap-1.5"
                        style={{
                          background: dayGradients[index],
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}>TRANSMISSION <span class="text-lg">→</span></span>
                    </div>
                  </div>

                  {/* Layer 2: Knockout Overlay (Black text on white logo) */}
                  <div
                    class="t-knockout-overlay absolute inset-x-8 inset-y-8 flex flex-col h-full pointer-events-none z-20"
                    style={{
                      WebkitMaskImage: `url(${index === 2 ? "/spidy/spider-logo.png" : (index === 1 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png")})`,
                      WebkitMaskSize: index === 0 ? "11rem" : (index === 1 ? "11rem" : "10.5rem"),
                      WebkitMaskPosition: `right ${index === 2 ? "-1.5rem" : (index === 1 ? "-2rem" : "-1rem")} center`,
                      WebkitMaskRepeat: "no-repeat",
                      maskImage: `url(${index === 2 ? "/spidy/spider-logo.png" : (index === 1 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png")})`,
                      maskSize: index === 0 ? "11rem" : (index === 1 ? "11rem" : "10.5rem"),
                      maskPosition: `right ${index === 2 ? "-1.5rem" : (index === 1 ? "-2rem" : "-1rem")} center`,
                      maskRepeat: "no-repeat"
                    }}
                  >
                    <div class="flex justify-between mb-10 opacity-0"> {/* Hide icons in knockout */}
                    </div>
                    <div class="mb-8">
                      <h3 class="t-heading text-4xl sm:text-5xl font-black text-black">{day.day}</h3>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section id="theta-stats" class="theta-stats-section px-4 py-12 sm:px-6 lg:px-8 lg:py-0 bg-[#0a0514]/60 min-h-screen lg:h-screen w-full lg:w-screen lg:overflow-hidden flex flex-col lg:flex-row items-center justify-center">
        <div class="theta-stats-bento grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8 max-w-[90rem] mx-auto h-auto lg:h-full lg:max-h-[90vh] items-center w-full">

          {/* --- BENTO CARD: VISUAL & TITLE --- */}
          <div class="theta-bento-card theta-bento-card--visual reveal-left flex flex-col justify-between p-8 sm:p-10 h-full min-h-[400px] relative overflow-hidden">
            <img src="/theta-logo.png" alt="" class="theta-bento-card__watermark" aria-hidden="true" />

            {/* --- AMBIENT HUD LAYERS --- */}
            <div class="theta-bento-card__ambient-matrix" aria-hidden="true" />

            <div class="theta-stats-copy">
              <span class="t-badge flex items-center gap-2 w-fit">
                <span class="h-1.5 w-1.5 rounded-full bg-[#00ff55] animate-pulse shadow-[0_0_8px_#00ff55]" />
                Theta Snapshot
              </span>
              <h2 class="theta-stats-copy__title t-heading mt-2 text-5xl sm:text-7xl font-black uppercase tracking-tighter">
                Fest Vitals
              </h2>
            </div>

            <div class="theta-stats-visual-wrap relative flex flex-1 items-center justify-center py-4">
              <div class="theta-stats-visual-container relative flex flex-col items-center justify-center">
                {/* --- QUANTUM ENERGY CORE (BACKGROUND) --- */}
                <div
                  class="theta-stats-core theta-stats-core--quantum group absolute inset-0 m-auto"
                  style={{
                    transform: `perspective(1200px) rotateX(${sphereRotation.value.x}deg) rotateY(${sphereRotation.value.y}deg) ${sphereRotation.value.x !== 0 ? "translateY(-12px) scale(1.035)" : "translateY(0) scale(1)"}`,
                    transition: sphereRotation.value.x === 0 ? "all 1s cubic-bezier(0.2, 1, 0.2, 1)" : "transform 0.12s ease-out, box-shadow 0.4s ease"
                  }}
                >
                  <div class="theta-stats-core__hexagon" aria-hidden="true" />
                  <div class="theta-stats-core__rings" aria-hidden="true">
                    <div class="theta-stats-core__ring" />
                    <div class="theta-stats-core__ring" />
                    <div class="theta-stats-core__ring" />
                  </div>
                  <div class="theta-stats-core__laser-scan" aria-hidden="true" />
                  <div class="theta-stats-core__grid" aria-hidden="true" />
                  <div class="theta-stats-core__shimmer-rim" aria-hidden="true" />
                </div>

                {/* --- DATA HERO (FOREGROUND) --- */}
                <div class="theta-stats-data-stack relative z-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <div class="theta-stats-core__copy mb-4">
                    <span class="theta-stats-core__label">Festival Reach</span>
                    <strong class="theta-stats-core__value">
                      {counterDisplay.value.participants}+
                    </strong>
                  </div>

                  <div class="theta-stats-pulse-wrap">
                    <div class="theta-stats-core__status">
                      <span class="theta-stats-core__status-dot bg-[#00ff55] shadow-[0_0_12px_#00ff55] animate-pulse" />
                      Live registration pulse
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BRAND INTEGRATION (NEW) --- */}
            <div class="theta-stats-brand-row flex flex-row items-center justify-center gap-6 sm:gap-12 mt-6 sm:mt-auto pt-2 z-20 w-full relative">
              <img
                src="/theta-logo.png"
                alt="Theta Logo"
                class="h-24 sm:h-36 w-auto object-contain brightness-0 invert opacity-80 drop-shadow-xl"
              />
              <div class="h-10 sm:h-16 w-[1px] bg-white/20" aria-hidden="true" />
              <img
                src="/sponsors/general/sastra-university-logo.jpg"
                alt="SASTRA University"
                class="h-10 sm:h-14 w-auto object-contain rounded-md opacity-80 drop-shadow-xl"
              />
            </div>
          </div>

          {/* --- BENTO GRID: STATS RAIL --- */}
          <div class="theta-stats-side-right h-full flex flex-col gap-6">
            {statSpotlight.map((item, index) => (
              <article
                key={item.key}
                class="theta-bento-card theta-bento-card--stat reveal-right p-6 sm:p-8 h-full min-h-[160px] relative overflow-hidden"
                style={`--theta-stat-accent:${item.accent}; --theta-stat-glow:${item.glow}; --theta-stat-progress:${item.progress}; --theta-stat-surface:${item.surface}; transition-delay:${index * 120}ms`}
              >
                <div class="theta-stats-node__meta mb-3">
                  <span class="theta-stats-node__index text-[rgba(255,255,255,0.2)] text-xs font-black">0{index + 1}</span>
                  <span class="theta-stats-node__eyebrow uppercase tracking-widest text-[10px] text-white/40 ml-4 font-bold">{item.eyebrow}</span>
                </div>
                <div class="flex items-end justify-between gap-4">
                  <div>
                    <div class="theta-stats-node__value t-heading text-4xl sm:text-5xl font-black mb-1">{counterDisplay.value[item.key]}+</div>
                    <div class="theta-stats-node__label uppercase tracking-tighter text-sm font-black text-white/60">{homeCopy.value.statsLabels[item.key]}</div>
                  </div>
                  <div class="theta-stats-node__signal text-[10px] py-1 px-3 border border-white/10 rounded-full font-black text-white/50">{item.signal}</div>
                </div>
                <p class="theta-stats-node__note mt-4 text-[10px] sm:text-xs text-white/40 leading-relaxed max-w-[90%]">{item.note}</p>

                <div class="theta-stats-node__meter mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <span class="theta-stats-node__meter-fill h-full block bg-current" style={`width:${item.progress}; color:var(--theta-stat-accent); box-shadow: 0 0 12px var(--theta-stat-accent)`} />
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════ SPONSORS ═══════════════ */}
      {marqueeSponsors.length > 0 && (
        <section class="relative z-10 mx-auto mt-2 max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div class="s-reveal rounded-[2rem] border border-white/8 bg-black/25 px-5 py-4 backdrop-blur-2xl sm:px-6">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span class="t-badge">Sponsor Spectrum</span>
              <p class="text-sm text-[var(--t-muted)]">
                A moving glimpse of the partners already in the hall.
              </p>
            </div>
            <div class="t-marquee-wrap">
              <div data-marquee-track class="t-marquee-track animate-left">
                {[...marqueeSponsors, ...marqueeSponsors].map((sponsor, index) => (
                  <article
                    key={`${sponsor.tierKey}-${sponsor.name}-${index}`}
                    class="group mx-4 w-48 flex-shrink-0 text-center"
                  >
                    <div class="flex h-20 items-center justify-center rounded-2xl border border-white/20 bg-white/95 p-3 shadow-lg transition-transform duration-300 hover:scale-110">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        loading="lazy"
                        class="h-full w-full object-contain"
                      />
                    </div>
                    <p class="mt-3 text-[0.55rem] font-bold tracking-[0.25em] text-[var(--t-dim)] uppercase">
                      {sponsor.name}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════ NEW BROWSE EVENTS CTA ═══════════════ */}
      <section id="browse-events-section" class="relative w-full min-h-[80vh] flex flex-col justify-between overflow-hidden bg-[#050508] px-6 py-12 sm:px-12 sm:py-20 lg:px-24 border-t border-[#0ea935]/10 mt-12 sm:mt-24">
        {/* Background Image */}
        <img src="/backgrounds/sastra-2.jpeg" alt="Sastra Background" class="browse-events-bg absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80" />

        {/* Slightly Dark Overlay */}
        <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#050508]/90 via-[#050508]/60 to-[#050508]/90"></div>

        {/* Radial glow to make it look premium before the image is added */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#0ea935] blur-[150px] rounded-full opacity-[0.03] pointer-events-none z-0"></div>

        {/* Content Container */}
        <div class="relative z-10 w-full max-w-[100rem] mx-auto h-full flex flex-col justify-between flex-1">

          {/* Eyebrow */}
          <div class="browse-events-eyebrow mb-16 sm:mb-24">
            <span class="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-white/50">
              POWERED BY THETA 2026
            </span>
          </div>

          {/* Big Typography */}
          <div class="flex flex-col mb-auto relative w-full" style="perspective: 1000px;">
            <h2 class="text-[clamp(5rem,14vw,15rem)] leading-[0.85] font-black tracking-tighter sm:tracking-tight text-white uppercase mix-blend-screen">
              <span class="browse-events-title-1 block text-left text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
                BROWSE<span class="text-[#0ea935] opacity-80">+</span>
              </span>
              <span class="browse-events-title-2 block text-right sm:text-left sm:ml-[10vw] mt-2 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-br from-white/40 via-white/90 to-white">
                <span class="text-[#0ea935] opacity-80">+</span>EVENTS
              </span>
            </h2>

            {/* Explore Button */}
            <div class="browse-events-btn mt-12 sm:mt-16 sm:ml-[10vw] w-fit">
              <Link href="/events" class="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-[#0ea935] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(14,169,53,0.4)] group">
                Explore Now
                <svg class="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Bottom Row - Paragraph on Right */}
          <div class="browse-events-desc flex justify-end mt-20 sm:mt-24 w-full">
            <p class="max-w-[280px] sm:max-w-sm text-right text-xs sm:text-sm leading-[1.8] text-[#8ca38c] font-medium">
              We transform ideas into fully-realized festival experiences — from intense challenges and showcases to campus-wide showdowns — creating an atmosphere that elevates the entire student collective.
            </p>
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
                {items.map((s, i) => (
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
