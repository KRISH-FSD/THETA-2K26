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
      accent: "#8cff7a",
      glow: "rgba(140,255,122,0.28)",
      progress: "74%",
      surface: "linear-gradient(145deg, rgba(14,169,53,0.22), rgba(7,12,8,0.96) 62%)",
    },
    {
      key: "participants",
      eyebrow: "National turnout",
      note: "Builders, designers, and problem-solvers charging the campus experience together.",
      signal: "Audience pulse active",
      accent: "#6ef3ff",
      glow: "rgba(110,243,255,0.24)",
      progress: "92%",
      surface: "linear-gradient(145deg, rgba(6,214,240,0.2), rgba(6,12,14,0.96) 62%)",
    },
    {
      key: "colleges",
      eyebrow: "Campus footprint",
      note: "Institutions across the circuit plug into Theta and widen the reach every year.",
      signal: "Reach map expanding",
      accent: "#f5d46b",
      glow: "rgba(245,212,107,0.24)",
      progress: "68%",
      surface: "linear-gradient(145deg, rgba(245,200,66,0.2), rgba(14,11,6,0.96) 62%)",
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
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      };
      const leave = () => { card.style.transition = "transform 0.4s ease"; card.style.transform = "none"; };
      const enter = () => { card.style.transition = "none"; };
      card.addEventListener("mousemove", move); card.addEventListener("mouseleave", leave); card.addEventListener("mouseenter", enter);
      cleanups.push(() => { card.removeEventListener("mousemove", move); card.removeEventListener("mouseleave", leave); card.removeEventListener("mouseenter", enter); });
    });
    return () => cleanups.forEach(c => c());
  });

  useVisibleTask$(() => {
    const sphere = document.querySelector<HTMLElement>(".theta-stats-core");
    if (!sphere) return;

    const onMove = (e: MouseEvent) => {
      const rect = sphere.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      sphereRotation.value = { x: y * 24, y: -x * 28 };
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
                <Link key={day.day} href={`/roadmap/day${index + 1}`} data-tilt onMouseMove$={(e, el) => {
                  const r = el.getBoundingClientRect();
                  el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
                  el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
                }} class="t-day-card group p-8 block reveal-up" style={{ borderColor: dayBorderColors[index], transitionDelay: `${index * 80}ms` }}>
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
                      {day.events.slice(0, 3).map(e => <span key={e} class="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-[9px] uppercase font-black text-white/60">{e}</span>)}
                    </div>
                    <div class="flex-grow" />
                    <div class="flex justify-between border-t border-white/5 pt-6">
                      <div class="flex items-center gap-2"><div class="h-1 w-1 rounded-full animate-pulse" style={{ background: dayAccents[index], boxShadow: `0 0 12px ${dayAccents[index]}` }} /><span class="text-[9px] uppercase text-white/30">Mission Files: {day.events.length}</span></div>
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
      <section id="theta-stats" class="theta-stats-section px-0 py-24 sm:px-4 lg:px-6">
        <div class="theta-stats-shell">
          <div class="theta-stats-shell__noise" aria-hidden="true" />
          <div class="theta-stats-shell__glow theta-stats-shell__glow--left" aria-hidden="true" />
          <div class="theta-stats-shell__glow theta-stats-shell__glow--right" aria-hidden="true" />

          <div class="theta-stats-grid">
            <div class="theta-stats-side-left">
              <div class="theta-stats-copy reveal-left">
                <span class="t-badge theta-stats-badge">
                  <span class="t-badge-dot" />
                  Theta Snapshot
                </span>
                <h2 class="t-heading theta-stats-copy__title">
                  Fest Vitals
                </h2>
              </div>

              <div class="theta-stats-visual-wrap relative flex items-center justify-center">
                <div class="theta-stats-visual reveal-scale">
                  <div
                    class="theta-stats-core group"
                    style={{
                      transform: `perspective(1200px) rotateX(${sphereRotation.value.x}deg) rotateY(${sphereRotation.value.y}deg) ${sphereRotation.value.x !== 0 ? "translateY(-12px) scale(1.035)" : "translateY(0) scale(1)"}`,
                      transition: sphereRotation.value.x === 0 ? "all 1s cubic-bezier(0.2, 1, 0.2, 1)" : "transform 0.12s ease-out, box-shadow 0.4s ease"
                    }}
                  >
                    <div class="theta-stats-core__halo theta-stats-core__halo--outer" aria-hidden="true" />
                    <div class="theta-stats-core__halo theta-stats-core__halo--inner" aria-hidden="true" />
                    <div class="theta-stats-core__grid" aria-hidden="true" />
                    <div class="theta-stats-core__scan" aria-hidden="true" />
                    <div class="theta-stats-core__logo" aria-hidden="true">
                      <img src="/theta-logo.png" alt="" class="theta-stats-core__logo-image" />
                    </div>

                    <div class="theta-stats-core__copy">
                      <span class="theta-stats-core__label">Festival Reach</span>
                      <strong class="theta-stats-core__value">
                        {counterDisplay.value.participants}+
                      </strong>
                    </div>
                  </div>

                  <div class="theta-stats-pulse-wrap mt-8 flex flex-col items-center justify-center gap-3">
                    <div class="theta-stats-core__status">
                      <span class="theta-stats-core__status-dot" />
                      Live registration pulse
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="theta-stats-side-right">
              <div class="theta-stats-rail">
                {statSpotlight.map((item, index) => (
                  <article
                    key={item.key}
                    class="theta-stats-node reveal-right"
                    style={`--theta-stat-accent:${item.accent}; --theta-stat-glow:${item.glow}; --theta-stat-progress:${item.progress}; --theta-stat-surface:${item.surface}; transition-delay:${index * 120}ms`}
                  >
                    <div class="theta-stats-node__meta">
                      <span class="theta-stats-node__index">0{index + 1}</span>
                      <span class="theta-stats-node__eyebrow">{item.eyebrow}</span>
                    </div>
                    <div class="theta-stats-node__value">{counterDisplay.value[item.key]}+</div>
                    <div class="theta-stats-node__label">{homeCopy.value.statsLabels[item.key]}</div>
                    <p class="theta-stats-node__note">{item.note}</p>
                    <div class="theta-stats-node__meter">
                      <span class="theta-stats-node__meter-fill" />
                    </div>
                    <div class="theta-stats-node__signal">{item.signal}</div>
                  </article>
                ))}
              </div>
            </div>
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

      {/* ═══════════════ CTA ═══════════════ */}
      <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div id="home-cta" class="home-cta">
          <div class="home-cta__glow home-cta__glow--left" aria-hidden="true" />
          <div class="home-cta__glow home-cta__glow--right" aria-hidden="true" />
          <div class="home-cta__gridline home-cta__gridline--top" aria-hidden="true" />
          <div class="home-cta__gridline home-cta__gridline--bottom" aria-hidden="true" />

          <div class="home-cta__layout">
            <div class="home-cta__copy">
              <span class="t-badge home-cta__badge">
                <span class="t-badge-dot" />
                Registrations Live
              </span>
              <p class="home-cta__eyebrow">Theta 2026 is open for builders, teams, and bold ideas.</p>

              <h2 class="t-heading home-cta__title">
                <span class="home-cta__title-line">{homeCopy.value.cta.titlePrefix}</span>
                <span class="home-cta__title-line t-gradient">{homeCopy.value.cta.titleAccent}</span>
              </h2>

              <p class="home-cta__description">{homeCopy.value.cta.description}</p>

              <div class="home-cta__actions">
                <Link href="/events" class="t-btn-primary home-cta__primary">
                  {homeCopy.value.cta.browseEvents}
                </Link>
                <Link href="/contact" class="t-btn-ghost home-cta__secondary">
                  Contact Team
                </Link>
              </div>
            </div>

            <div class="home-cta__aside">
              <article class="home-cta__card">
                <span class="home-cta__card-label">Event Grid</span>
                <strong class="home-cta__card-value">{counterDisplay.value.events}+</strong>
                <p class="home-cta__card-text">Challenges, workshops, and showdowns ready to explore.</p>
              </article>

              <article class="home-cta__card">
                <span class="home-cta__card-label">Live Community</span>
                <strong class="home-cta__card-value">{counterDisplay.value.participants}+</strong>
                <p class="home-cta__card-text">Participants powering a campus-wide builder atmosphere.</p>
              </article>

              <article class="home-cta__card">
                <span class="home-cta__card-label">National Reach</span>
                <strong class="home-cta__card-value">{counterDisplay.value.colleges}+</strong>
                <p class="home-cta__card-text">Colleges already in the conversation and ready to compete.</p>
              </article>
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
