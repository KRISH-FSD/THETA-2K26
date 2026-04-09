import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { initRoadmapTimeline } from "~/utils/roadmap";

type Cat = "opening" | "tech" | "workshop" | "quiz" | "fun" | "cultural";

interface EventData {
  id: number;
  time: string;
  endTime: string;
  title: string;
  subtitle: string;
  venue: string;
  cat: Cat;
  desc: string;
  img: string;
  tags: string[];
  regLink?: string;
}

interface CatMeta {
  label: string;
  short: string;
  color: string;
  rgb: string;
}

interface EventCardProps {
  ev: EventData;
  meta: CatMeta;
  canRegister: boolean;
  isActive: boolean;
}

interface PopupPanelProps {
  ev: EventData;
  meta: CatMeta;
  side: "left" | "right";
  canRegister: boolean;
  inlineMobile?: boolean;
}

const EVENTS: EventData[] = [
  {
    id: 1,
    time: "09:30 AM",
    endTime: "11:30 AM",
    title: "The Gravity Defier",
    subtitle: "Physics and light experiments",
    venue: "Room 310",
    cat: "quiz",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200",
    tags: ["Number Grid", "Memory Snap", "Gravity"],
    desc: "A Grand Line level challenge involving number grid races, memory snaps, and gravity defier games.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSd1EzJorBtCHd79RyI4M14qd6MjS6az9tfgHONC7spq6CggNw/viewform?usp=publish-editor",
  },
  {
    id: 2,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "Ctrl + Build + Win",
    subtitle: "Rapid prototyping sprint",
    venue: "Lab",
    cat: "tech",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    tags: ["Coding", "Build", "Win"],
    desc: "Prototype, build, and win the Day 2 code race.",
  },
  {
    id: 3,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "Tech mayhem",
    subtitle: "Hardware and logic chaos",
    venue: "Room 402",
    cat: "tech",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    tags: ["Fake Tech", "Resistor", "Memory"],
    desc: "Test your skills with Real or Fake Tech, Resistor Rush, and Memory Match.",
    regLink: "https://forms.gle/u1TAKaa7LF1Ge4UR9",
  },
  {
    id: 4,
    time: "11:00 AM",
    endTime: "02:00 PM",
    title: "Sports Events",
    subtitle: "Elite physical reflex zone",
    venue: "Basketball Court",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
    tags: ["Cricket", "Mind on Leg", "Lucky Box"],
    desc: "One Over Cricket and reflex games in the sports arena.",
  },
  {
    id: 5,
    time: "02:00 PM",
    endTime: "05:00 PM",
    title: "FunKart",
    subtitle: "Biology themed obstacle run",
    venue: "IED Hall",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1596720426673-e47744bd2185?q=80&w=1200",
    tags: ["Focus Freaks", "Zero Vision Zone", "Error Hunt"],
    desc: "A high-energy relay packed with focus, chaos, and error-hunt challenges.",
    regLink: "https://forms.gle/8k7SXNPL32wLh88C7",
  },
  {
    id: 6,
    time: "11:00 AM",
    endTime: "01:00 PM",
    title: "FunFusion Arena",
    subtitle: "Gaming and strategy puzzles",
    venue: "Room 303",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    tags: ["Gaming", "Strategy", "Arena"],
    desc: "A fast-paced fun arena featuring gaming challenges and strategy puzzles.",
    regLink: "https://forms.gle/WQ9LPHHknA5keGKJ8",
  },
  {
    id: 7,
    time: "02:00 PM",
    endTime: "04:00 PM",
    title: "VIP: VIBE IN PROMPT",
    subtitle: "AI and prompt generation",
    venue: "Room 410",
    cat: "workshop",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
    tags: ["Prompt", "AI Trailer", "QR"],
    desc: "Master prompt engineering, AI trailer creation, and QR-based creative rounds.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSdM2ZwG7i8FtWrBiwbFg4GrMScIgcbJTBHWSLdvlj2R4QIg1w/viewform?usp=sharing&ouid=104165202810433780029",
  },
  {
    id: 8,
    time: "02:00 PM",
    endTime: "03:30 PM",
    title: "Tech Fun Fusion",
    subtitle: "Connect the tech and meme creation",
    venue: "Room 110",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
    tags: ["Connect", "Memes", "Fun"],
    desc: "A playful round of Connect the Tech and meme creation challenges.",
    regLink: "https://forms.gle/nSdmEU97op36WiDn7",
  },
  {
    id: 9,
    time: "02:00 PM",
    endTime: "04:00 PM",
    title: "Fun-Technical Event: Sumo Challenge",
    subtitle: "High-impact robotics arena",
    venue: "ECE Lab",
    cat: "tech",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    tags: ["Bot Wrestling", "Arena", "Combat"],
    desc: "A robotics combat event where bots battle it out in the sumo arena.",
    regLink: "https://forms.gle/Z9saAA2xU2YKoqj8A",
  },
  {
    id: 10,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "BIOGENESIS - Fun Game - CLASH OF CHAMPIONS",
    subtitle: "Team-based speed challenge",
    venue: "IED Hall",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200",
    tags: ["Speed", "Strategy", "Biogenesis"],
    desc: "Testing thinking skills with activities that require quick action. Let the speedster in you get the rewards.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSedXMiuvvk9rzOH9KBycJZ6HR56BkPP1lrNmgoQfV9eZUfIrw/viewform",
  },
];

const CAT: Record<Cat, CatMeta> = {
  opening: { label: "Opening", short: "OP", color: "#f4c542", rgb: "244,197,66" },
  tech: { label: "Tech", short: "TK", color: "#f4c542", rgb: "244,197,66" },
  workshop: { label: "Workshop", short: "WS", color: "#ffd66b", rgb: "255,214,107" },
  quiz: { label: "Quiz", short: "QZ", color: "#ffe08d", rgb: "255,224,141" },
  fun: { label: "Fun", short: "FN", color: "#f7cf59", rgb: "247,207,89" },
  cultural: { label: "Cultural", short: "CL", color: "#fff0c4", rgb: "255,240,196" },
};

const PopupPanel = component$<PopupPanelProps>(({ ev, meta, side, canRegister, inlineMobile }) => (
  <div class={["rm-popup", `rm-popup--${side}`, inlineMobile ? "rm-popup--inline-mobile" : ""]} style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}>
    <span class="rm-popup__ripple rm-popup__ripple--1" />
    <span class="rm-popup__ripple rm-popup__ripple--2" />
    <span class="rm-popup__ripple rm-popup__ripple--3" />
    <div class="rm-popup__inner">
      <div class="rm-popup__head">
        <span class="rm-popup__chip"><span class="rm-popup__dot" />{meta.label}</span>
        <span class="rm-popup__node-label">NODE {String(ev.id).padStart(2, "0")}</span>
      </div>
      <h3 class="rm-popup__title">{ev.title}</h3>
      <div class="rm-popup__vitals">
        <div class="rm-popup__vital">
          <div class="rm-popup__vital-icon">T</div>
          <div class="rm-popup__vital-content">
            <span class="rm-popup__vital-label">TIMING</span>
            <span class="rm-popup__vital-value">{ev.time} - {ev.endTime}</span>
          </div>
        </div>
        <div class="rm-popup__vital">
          <div class="rm-popup__vital-icon">V</div>
          <div class="rm-popup__vital-content">
            <span class="rm-popup__vital-label">VENUE</span>
            <span class="rm-popup__vital-value">{ev.venue}</span>
          </div>
        </div>
      </div>
      <div class="rm-popup__stats">
        <div class="rm-popup__stat">
          <span class="rm-popup__stat-l">Venue</span>
          <strong class="rm-popup__stat-v">{ev.venue}</strong>
        </div>
        <div class="rm-popup__stat">
          <span class="rm-popup__stat-l">Timing</span>
          <strong class="rm-popup__stat-v">{ev.time} - {ev.endTime}</strong>
        </div>
      </div>
      <div class="rm-popup__tags">{ev.tags.map((t) => <span key={t} class="rm-popup__tag">{t}</span>)}</div>
      <div class="rm-popup__actions hidden md:flex">
        <Link href="/events" class="rm-popup__action rm-popup__action--primary" onClick$={(e: Event) => e.stopPropagation()}>View Event Hub</Link>
        {canRegister ? <a href={ev.regLink} target="_blank" rel="noopener noreferrer" class="rm-popup__action rm-popup__action--ghost" onClick$={(e: Event) => e.stopPropagation()}>Register Now</a> : <span class="rm-popup__open-badge">Open Access</span>}
      </div>
    </div>
  </div>
));

const EventCard = component$<EventCardProps>(({ ev, meta, canRegister, isActive }) => (
  <article class="rm-card" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}>
    <div class="rm-card__sheen" />
    <div class="rm-card__media">
      <img src={ev.img} alt={ev.title} width={1200} height={640} loading="lazy" class="rm-card__image" />
      <div class="rm-card__media-overlay" />
      <div class="rm-card__chip-row">
        <span class="rm-card__chip rm-card__chip--accent"><span class="rm-card__chip-dot" />{meta.label}</span>
        <span class="rm-card__chip">{ev.time}</span>
      </div>
      <div class="rm-card__eyebrow"><span>{ev.subtitle}</span><span>{ev.endTime}</span></div>
    </div>
    <div class="rm-card__body">
      <div class="rm-card__heading">
        <div><h3 class="rm-card__title">{ev.title}</h3></div>
        <span class="rm-card__toggle">{isActive ? "Collapse" : "Details"}</span>
      </div>
      <p class="rm-card__desc">{ev.desc}</p>
      <div class="rm-card__stat-grid">
        <div class="rm-card__stat"><span class="rm-card__stat-label">Venue</span><strong class="rm-card__stat-value">{ev.venue}</strong></div>
        <div class="rm-card__stat"><span class="rm-card__stat-label">Timing</span><strong class="rm-card__stat-value">{ev.time} - {ev.endTime}</strong></div>
      </div>
      <div class="rm-card__tags">{ev.tags.map((t) => <span key={t} class="rm-card__tag">{t}</span>)}</div>
      <div class="rm-card__actions hidden md:flex">
        <Link href="/events" class="rm-card__action rm-card__action--primary">View Event Hub</Link>
        {canRegister ? <a href={ev.regLink} target="_blank" rel="noopener noreferrer" class="rm-card__action rm-card__action--ghost">Register Now</a> : <span class="rm-card__status">Open Access</span>}
      </div>
    </div>
  </article>
));

export default component$(function Day2Roadmap() {
  useVisibleTask$(() => {
    document.body.setAttribute("data-theme", "onepiece");
    const cleanup = initRoadmapTimeline({ pageSelector: ".rm-page--day2" });
    return () => {
      document.body.removeAttribute("data-theme");
      cleanup?.();
    };
  });

  return (
    <div class="rm-page rm-page--day2">
      <style>{`
        .rm-page--day2 { background: #040006; color: #fff7df; position: relative; }
        .rm-page--day2::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0; background: linear-gradient(180deg, rgba(26,16,4,0.58) 0%, rgba(24,18,8,0.42) 26%, rgba(18,12,6,0.84) 100%), radial-gradient(circle at 50% 18%, rgba(244,197,66,0.1), transparent 28%); }
        .rm-page--day2 .rm-card { background: rgba(14,8,4,0.94); backdrop-filter: blur(10px); border-color: rgba(244,197,66,0.28); opacity: 0; will-change: transform, opacity; contain: layout paint style; content-visibility: auto; contain-intrinsic-size: 560px; }
        .rm-row--left .rm-card.is-revealed { animation: rmCardRotateLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .rm-row--right .rm-card.is-revealed { animation: rmCardRotateRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes rmCardRotateLeft { 0% { opacity: 0; transform: translateX(-60px) translateY(20px) scale(0.9) rotateY(-10deg); } 100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotateY(0); } }
        @keyframes rmCardRotateRight { 0% { opacity: 0; transform: translateX(60px) translateY(20px) scale(0.9) rotateY(10deg); } 100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotateY(0); } }
        .rm-page--day2 .rm-popup { background: rgba(14,8,4,0.98); backdrop-filter: blur(12px); border-color: rgba(244,197,66,0.35); box-shadow: 0 32px 84px rgba(0,0,0,0.64), 0 0 24px rgba(244,197,66,0.08); max-width: 360px; width: calc(100vw - 4rem); border-radius: 1.5rem; overflow: hidden; }
        .rm-page--day2 .rm-popup__inner { padding: 1.15rem !important; }
        .rm-page--day2 .rm-popup__vitals { display: flex; flex-direction: column; gap: 0.6rem; margin: 0.85rem 0; padding: 0.85rem; border-radius: 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid var(--rm-accent); }
        .rm-page--day2 .rm-popup__vital { display: flex; align-items: center; gap: 0.75rem; }
        .rm-page--day2 .rm-popup__vital-icon { width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); border-radius: 0.5rem; font-size: 0.72rem; font-weight: 800; }
        .rm-page--day2 .rm-popup__stats { margin-top: 0.75rem !important; gap: 0.5rem !important; }
        .rm-page--day2 .rm-popup__stat { padding: 0.45rem 0.6rem !important; border-radius: 0.6rem !important; }
        .rm-page--day2 .rm-popup__actions { margin-top: 1rem !important; display: flex !important; flex-direction: row !important; gap: 0.5rem !important; }
        .rm-page--day2 .rm-popup__action { flex: 1 !important; padding: 0.55rem 0.6rem !important; font-size: 0.72rem !important; border-radius: 0.75rem !important; text-align: center; white-space: nowrap; }
        .rm-page--day2 .rm-dock__inner { border-color: rgba(244,197,66,0.24); background: linear-gradient(180deg, rgba(22,14,4,0.96), rgba(12,8,4,0.92)); box-shadow: 0 24px 64px rgba(0,0,0,0.42), 0 0 0 1px rgba(244,197,66,0.08); }
        .rm-page--day2 .rm-dock__item.is-active { border-color: rgba(244,197,66,0.42); background: linear-gradient(135deg, rgba(244,197,66,0.2), rgba(244,197,66,0.08)); color: #fff0b8; }
        .rm-page--day2 .rm-dock__status { border-color: rgba(244,197,66,0.16); background: linear-gradient(180deg, rgba(40,28,12,0.82), rgba(18,12,8,0.74)); color: #ffe08d; }
        .rm-page--day2 .rm-dock__status-dot { background: #f4c542; box-shadow: 0 0 10px rgba(244,197,66,0.85); }
        .rm-page--day2 .rm-scene-gallery { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .rm-page--day2 .rm-scene-art { position: absolute; inset: 0; overflow: hidden; }
        .rm-page--day2 .rm-scene-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,8,4,0.42) 0%, rgba(10,8,4,0.18) 24%, rgba(10,8,4,0.18) 68%, rgba(10,8,4,0.52) 82%, rgba(10,8,4,1) 100%); }
        .rm-page--day2 .rm-scene-art img { display: block; width: 100%; height: 100vh; object-fit: cover; filter: saturate(0.95) contrast(1.08) brightness(0.42); transform: scale(1.05); }
        .rm-page--day2[data-roadmap-mode="lite"] .rm-card,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-popup,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-event-glass,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-dock__inner { backdrop-filter: none !important; box-shadow: none !important; }
        .rm-page--day2[data-roadmap-mode="lite"] .rm-card,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-popup { animation: none !important; }
        .rm-page--day2[data-roadmap-mode="lite"] .rm-card__image,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-scene-art img,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-page__aurora,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-card__sheen { filter: none !important; }
        .rm-page--day2[data-roadmap-mode="lite"] .rm-node__halo,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-node__impact,
        .rm-page--day2[data-roadmap-mode="lite"] .rm-node__pulse { opacity: 0.45 !important; }
        .rm-page--day2 .rm-end-popup { position: absolute; right: calc(100% + 0.95rem); top: 50%; transform: translate(-12px, -50%) scale(0.92); min-width: 12rem; max-width: 13.5rem; padding: 0.75rem 0.9rem; border-radius: 1rem; border: 1px solid rgba(244,197,66,0.24); background: linear-gradient(135deg, rgba(244,197,66,0.1), rgba(244,197,66,0.05)), rgba(14,8,4,0.94); opacity: 0; pointer-events: none; transition: opacity 320ms ease, transform 380ms cubic-bezier(0.22, 1, 0.36, 1); z-index: 4; }
        .rm-page--day2 .rm-end-popup::after { content: ""; position: absolute; right: -0.45rem; top: 50%; width: 0.9rem; height: 0.9rem; transform: translateY(-50%) rotate(45deg); border-right: 1px solid rgba(244,197,66,0.24); border-bottom: 1px solid rgba(244,197,66,0.24); background: rgba(14,8,4,0.96); }
        .rm-page--day2 .rm-end-popup__label { display: inline-flex; align-items: center; gap: 0.38rem; color: #ffe08d; font-size: 0.56rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; }
        .rm-page--day2 .rm-end-popup__label::before { content: ""; width: 0.42rem; height: 0.42rem; border-radius: 999px; background: #f4c542; box-shadow: 0 0 10px rgba(244,197,66,0.8); }
        .rm-page--day2 .rm-end-popup p { margin: 0.55rem 0 0; color: rgba(255,244,224,0.92); font-size: 0.76rem; line-height: 1.45; }
        .rm-page--day2.is-end-reached .rm-end-popup, .rm-page--day2 .rm-row--final.is-end-reached .rm-end-popup { opacity: 1; transform: translate(0, -50%) scale(1); }
        .rm-page--day2 .rm-timeline { position: relative; }
        .rm-page--day2 .rm-timeline__svg { overflow: visible; position: absolute; pointer-events: none; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; }
        .rm-page--day2 .rm-timeline__path--glow { display: none !important; }
        .rm-page--day2 .rm-timeline__path--base { stroke: rgba(244,197,66,0.18) !important; stroke-width: 4 !important; }
        .rm-page--day2 .rm-timeline__path--accent { stroke: #ffffff !important; stroke-width: 3 !important; opacity: 1 !important; filter: drop-shadow(0 0 12px rgba(244,197,66,0.8)) !important; }
        .rm-page--day2 #rm-tracer-shell { display: none !important; }
        .rm-page--day2 #rm-tracer-arrow { fill: #ffffff !important; filter: drop-shadow(0 0 10px rgba(244,197,66,1)) !important; }
        .rm-page--day2 .rm-node__center-dot { position: absolute; inset: 50% auto auto 50%; width: 0.55rem; height: 0.55rem; border-radius: 999px; transform: translate(-50%, -50%); pointer-events: none; }
        @media (max-width: 767px) {
          .rm-page--day2 .rm-end-popup { left: calc(100% + 0.95rem) !important; right: auto !important; top: 50% !important; transform: translate(12px, -50%) scale(0.92) !important; min-width: 12rem !important; padding: 0.62rem 0.72rem !important; z-index: 10 !important; }
          .rm-page--day2 .rm-end-popup::after { left: -0.45rem !important; right: auto !important; border-right: none !important; border-bottom: 1px solid rgba(244,197,66,0.24) !important; border-left: 1px solid rgba(244,197,66,0.24) !important; }
          .rm-page--day2.is-end-reached .rm-end-popup, .rm-page--day2 .rm-row--final.is-end-reached .rm-end-popup { transform: translate(0, -50%) scale(1) !important; }
        }
      `}</style>

      <div class="rm-scene-gallery"><div class="rm-scene-art"><img src="/roadmap-day2/i1.webp" alt="Day 2 background" /></div></div>
      <div class="rm-page__aurora rm-page__aurora--left" />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">Timeline</span>
              <h1 class="rm-section__title">Day 2 Event Flow</h1>
              <p class="rm-section__copy">Tap any card to reveal its event, venue, timing, and registration details.</p>
            </div>
            <div class="rm-event-glass"><span class="rm-event-glass__count">{String(EVENTS.length).padStart(2, "0")}</span><span class="rm-event-glass__label">Events<br />Today</span><span class="rm-event-glass__dot" /></div>
          </div>

          <div id="rm-timeline" class="rm-timeline">
            <svg id="rm-line-svg" class="rm-timeline__svg" aria-hidden="true">
              <path id="rm-line-base" class="rm-timeline__path rm-timeline__path--base" fill="none" />
              <path id="rm-line-glow" class="rm-timeline__path rm-timeline__path--glow" fill="none" />
              <path id="rm-line-accent" class="rm-timeline__path rm-timeline__path--accent" fill="none" />
              <g id="rm-tracer" class="rm-timeline__tracer" style="opacity:0;"><circle id="rm-tracer-shell" r="18" fill="rgba(244, 197, 66, 0.3)" /><path id="rm-tracer-arrow" d="M -12,-9 L 16,0 L -12,9 C -8,4 -8,-4 -12,-9 Z" /><circle r="6" fill="#fff" opacity="0.8" /></g>
            </svg>

            {EVENTS.map((event, index) => {
              const meta = CAT[event.cat];
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              const isActive = false;
              const canRegister = Boolean(event.regLink);
              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>
                  <div class="rm-row__side rm-row__side--left">
                    {side === "left" ? (<><EventCard ev={event} meta={meta} isActive={isActive} canRegister={canRegister} />{isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} inlineMobile />}</>) : (isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} />)}
                  </div>
                  <div class={["rm-row__center", `rm-row__center--${side === "left" ? "r" : "l"}`]}>
                    <div class="rm-node" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`} data-snake-node="">
                      <span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__impact" />
                      <span class="rm-node__center-dot" aria-hidden="true" style={`background:${meta.color}; box-shadow: 0 0 10px rgba(${meta.rgb}, 0.45);`} />
                      <span class="rm-node__time">{event.time}</span>
                    </div>
                  </div>
                  <div class="rm-row__side rm-row__side--right">
                    {side === "right" ? (<><EventCard ev={event} meta={meta} isActive={isActive} canRegister={canRegister} />{isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} inlineMobile />}</>) : (isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} />)}
                  </div>
                </div>
              );
            })}

            <div class="rm-row rm-row--final">
              <div class="rm-row__side" />
              <div class="rm-row__center"><div class="rm-node rm-node--finish"><span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__code">END</span></div></div>
              <div class="rm-row__side"><div class="rm-end-popup" aria-live="polite"><div class="rm-end-popup__label">Day Complete</div><p>Day 2 systems standby. Final roadmap continues on Day 3.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <div class="rm-dock"><div class="rm-dock__inner"><Link href="/roadmap/day1" class="rm-dock__item">Day 1</Link><Link href="/roadmap/day2" class="rm-dock__item is-active">Day 2</Link><Link href="/roadmap/day3" class="rm-dock__item">Day 3</Link><span class="rm-dock__status"><span class="rm-dock__status-dot" />ONE PIECE THEME</span></div></div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Roadmap: Day 2 | THETA 2026",
  meta: [{ name: "description", content: "Explore the live event timeline for Day 2 of THETA 2026." }],
};
