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
    time: "09:00 AM",
    endTime: "03:00 PM",
    title: "Game Events",
    subtitle: "Fun arena marathon",
    venue: "Room 202",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1635805737707-57588b48f6f7?q=80&w=1200",
    tags: ["Ladder", "Brain Bid", "Math Royale"],
    desc: "A full-length game arena featuring Ladder Game, Brain Bid Battle, Math Royale, and Digit Decoder.",
  },
  {
    id: 2,
    time: "09:30 AM",
    endTime: "11:30 AM",
    title: "The Final Pyramid",
    subtitle: "Final light and pulse challenges",
    venue: "Room 310",
    cat: "quiz",
    img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=1200",
    tags: ["Sonar", "Pyramid", "Scoops"],
    desc: "Heroic precision is needed for Sonar Sprint, Hopscotch Pyramid, and Hoops and Scoops.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSeiG0W_7I7wdPsc4S35B9A9fDPtf2ogKsUXxaZxcHTYAnGnyA/viewform?usp=publish-editor",
  },
  {
    id: 3,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "Clash of Champions",
    subtitle: "High-energy skill battles",
    venue: "IED Hall",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200",
    tags: ["Cup Stack", "Ping Pong", "Word Race"],
    desc: "A multi-game battle featuring cup stacking, ping pong bounce, and fast word or movie rounds.",
    regLink: "https://forms.gle/4a9Ws7WHz8SEMh1U6",
  },
  {
    id: 4,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "Clash of Codes",
    subtitle: "Spider-sense bug hunting",
    venue: "Lab",
    cat: "tech",
    img: "https://images.unsplash.com/photo-1627389955805-720619756184?q=80&w=1200",
    tags: ["Warm Up", "Challenge", "Showdown"],
    desc: "A three-stage code battle from warm-up rounds to the final showdown.",
  },
  {
    id: 5,
    time: "10:00 AM",
    endTime: "04:00 PM",
    title: "Technical Hackathon: RoboAI Challenge",
    subtitle: "AI integration and path planning",
    venue: "ECE Lab",
    cat: "tech",
    img: "https://images.unsplash.com/photo-1531239669496-e1789bb5ad27?q=80&w=1200",
    tags: ["AI", "Planning", "Hackathon"],
    desc: "A long-form robotics hackathon focused on AI integration and path planning.",
    regLink: "https://forms.gle/5dpnrrhJAhrSU6zd7",
  },
  {
    id: 6,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "THINKZONE CHALLENGE",
    subtitle: "Creative research and hunt",
    venue: "Room 402",
    cat: "workshop",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
    tags: ["Artistic", "Kandupidi", "Hunt"],
    desc: "A creative challenge mixing artistic tasks, Kandupidi, and scavenger hunt rounds.",
    regLink: "https://forms.gle/2GMW1XW9sQ5h8QZ68",
  },
  {
    id: 7,
    time: "11:00 AM",
    endTime: "01:00 PM",
    title: "Stock War - The Trading Arena",
    subtitle: "Strategic market web",
    venue: "Room 303",
    cat: "tech",
    img: "https://images.unsplash.com/photo-1611974714028-ac6096ac72e8?q=80&w=1200",
    tags: ["Market", "Risk", "Strategy"],
    desc: "Market simulation, risk analysis, and strategy decisions in the trading arena.",
    regLink: "https://forms.gle/6jL2YA3VvscgGiUf9",
  },
  {
    id: 8,
    time: "11:00 AM",
    endTime: "02:00 PM",
    title: "FUNIVERSE",
    subtitle: "Chaos in the multiverse",
    venue: "Room 410 & 411",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1533447333873-31185b3b77ba?q=80&w=1200",
    tags: ["Imposter", "Chaos", "Battle"],
    desc: "Enter the multiverse with Imposter Arc, Chaos Carnival, and MegaVerse battle rounds.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSe7KnkFXECkXDLroyUXsvMvx7811qLI-XbBugH3hJ8kVBrHtg/viewform?usp=sharing&ouid=104165202810433780029",
  },
  {
    id: 9,
    time: "11:00 AM",
    endTime: "02:00 PM",
    title: "Sports Events",
    subtitle: "City-wide reflex challenge",
    venue: "Basketball Court",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
    tags: ["Basketball", "Pass", "Relay"],
    desc: "Basketball and pass the ball relay events running under the Sportiva cluster.",
  },
  {
    id: 10,
    time: "11:00 AM",
    endTime: "02:00 PM",
    title: "Tug of War",
    subtitle: "Sportiva strength showdown",
    venue: "Basketball Court",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
    tags: ["Tug", "Team", "Final"],
    desc: "A dedicated Tug of War battle in the Sportiva cluster with the same Day 3 sports schedule.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLScbZVPEsAmHeVCVjNO90mHPX3VLWgzQgRdbo-lqL_mMvsNebA/viewform",
  },
  {
    id: 11,
    time: "11:00 AM",
    endTime: "01:00 PM",
    title: "Ultimate Entertainment Round",
    subtitle: "Comedy and entertainment showdown",
    venue: "Room 110",
    cat: "fun",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200",
    tags: ["Entertainment", "Comedy", "Showdown"],
    desc: "A full fun round packed with entertainment challenges and a comedy showdown.",
    regLink: "https://forms.gle/Xa8WaGHWfvToyyUQA",
  },
];

const CAT: Record<Cat, CatMeta> = {
  opening: { label: "Opening", short: "OP", color: "#ff4747", rgb: "255,71,71" },
  tech: { label: "Tech", short: "TK", color: "#ff4747", rgb: "255,71,71" },
  workshop: { label: "Workshop", short: "WS", color: "#ff7676", rgb: "255,118,118" },
  quiz: { label: "Quiz", short: "QZ", color: "#ff9c9c", rgb: "255,156,156" },
  fun: { label: "Fun", short: "FN", color: "#ff6666", rgb: "255,102,102" },
  cultural: { label: "Cultural", short: "CL", color: "#ffc2c2", rgb: "255,194,194" },
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
        <div class="rm-popup__vital"><div class="rm-popup__vital-icon">T</div><div class="rm-popup__vital-content"><span class="rm-popup__vital-label">TIMING</span><span class="rm-popup__vital-value">{ev.time} - {ev.endTime}</span></div></div>
        <div class="rm-popup__vital"><div class="rm-popup__vital-icon">V</div><div class="rm-popup__vital-content"><span class="rm-popup__vital-label">VENUE</span><span class="rm-popup__vital-value">{ev.venue}</span></div></div>
      </div>
      <div class="rm-popup__stats"><div class="rm-popup__stat"><span class="rm-popup__stat-l">Venue</span><strong class="rm-popup__stat-v">{ev.venue}</strong></div><div class="rm-popup__stat"><span class="rm-popup__stat-l">Timing</span><strong class="rm-popup__stat-v">{ev.time} - {ev.endTime}</strong></div></div>
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
      <img src={ev.img} alt={ev.title} width={1200} height={640} loading="lazy" decoding="async" class="rm-card__image" />
      <div class="rm-card__media-overlay" />
      <div class="rm-card__chip-row"><span class="rm-card__chip rm-card__chip--accent"><span class="rm-card__chip-dot" />{meta.label}</span><span class="rm-card__chip">{ev.time}</span></div>
      <div class="rm-card__eyebrow"><span>{ev.subtitle}</span><span>{ev.endTime}</span></div>
    </div>
    <div class="rm-card__body">
      <div class="rm-card__heading"><div><h3 class="rm-card__title">{ev.title}</h3></div><span class="rm-card__toggle">{isActive ? "Collapse" : "Details"}</span></div>
      <p class="rm-card__desc">{ev.desc}</p>
      <div class="rm-card__stat-grid"><div class="rm-card__stat"><span class="rm-card__stat-label">Venue</span><strong class="rm-card__stat-value">{ev.venue}</strong></div><div class="rm-card__stat"><span class="rm-card__stat-label">Timing</span><strong class="rm-card__stat-value">{ev.time} - {ev.endTime}</strong></div></div>
      <div class="rm-card__tags">{ev.tags.map((t) => <span key={t} class="rm-card__tag">{t}</span>)}</div>
      <div class="rm-card__actions hidden md:flex"><Link href="/events" class="rm-card__action rm-card__action--primary">View Event Hub</Link>{canRegister ? <a href={ev.regLink} target="_blank" rel="noopener noreferrer" class="rm-card__action rm-card__action--ghost">Register Now</a> : <span class="rm-card__status">Open Access</span>}</div>
    </div>
  </article>
));

export default component$(function Day3Roadmap() {
  useVisibleTask$(() => {
    document.body.setAttribute("data-theme", "spider");
    const cleanup = initRoadmapTimeline({ pageSelector: ".rm-page--day3" });
    return () => {
      document.body.removeAttribute("data-theme");
      cleanup?.();
    };
  });

  return (
    <div class="rm-page rm-page--day3">
      <style>{`
        .rm-page--day3 { background: #050007; color: #fff1f1; position: relative; }
        .rm-page--day3::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0; background: linear-gradient(180deg, rgba(20,0,4,0.58) 0%, rgba(18,0,6,0.42) 26%, rgba(10,0,4,0.84) 100%), radial-gradient(circle at 50% 18%, rgba(255,71,71,0.12), transparent 28%); }
        .rm-page--day3 .rm-card { background: rgba(10,0,6,0.94); backdrop-filter: blur(10px); border-color: rgba(255,71,71,0.28); opacity: 0; will-change: transform, opacity; contain: layout paint style; content-visibility: auto; contain-intrinsic-size: 560px; }
        .rm-row--left .rm-card.is-revealed { animation: rmCardRotateLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .rm-row--right .rm-card.is-revealed { animation: rmCardRotateRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes rmCardRotateLeft { 0% { opacity: 0; transform: translateX(-60px) translateY(20px) scale(0.9) rotateY(-10deg); } 100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotateY(0); } }
        @keyframes rmCardRotateRight { 0% { opacity: 0; transform: translateX(60px) translateY(20px) scale(0.9) rotateY(10deg); } 100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotateY(0); } }
        .rm-page--day3 .rm-popup { background: rgba(10,0,6,0.98); backdrop-filter: blur(12px); border-color: rgba(255,71,71,0.35); box-shadow: 0 32px 84px rgba(0,0,0,0.64), 0 0 24px rgba(255,71,71,0.08); max-width: 360px; width: calc(100vw - 4rem); border-radius: 1.5rem; overflow: hidden; }
        .rm-page--day3 .rm-popup__inner { padding: 1.15rem !important; }
        .rm-page--day3 .rm-popup__vitals { display: flex; flex-direction: column; gap: 0.6rem; margin: 0.85rem 0; padding: 0.85rem; border-radius: 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid var(--rm-accent); }
        .rm-page--day3 .rm-popup__vital { display: flex; align-items: center; gap: 0.75rem; }
        .rm-page--day3 .rm-popup__vital-icon { width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); border-radius: 0.5rem; font-size: 0.72rem; font-weight: 800; }
        .rm-page--day3 .rm-popup__stats { margin-top: 0.75rem !important; gap: 0.5rem !important; }
        .rm-page--day3 .rm-popup__stat { padding: 0.45rem 0.6rem !important; border-radius: 0.6rem !important; }
        .rm-page--day3 .rm-popup__actions { margin-top: 1rem !important; display: flex !important; flex-direction: row !important; gap: 0.5rem !important; }
        .rm-page--day3 .rm-popup__action { flex: 1 !important; padding: 0.55rem 0.6rem !important; font-size: 0.72rem !important; border-radius: 0.75rem !important; text-align: center; white-space: nowrap; }
        .rm-page--day3 .rm-dock__inner { border-color: rgba(255,71,71,0.24); background: linear-gradient(180deg, rgba(24,6,10,0.96), rgba(12,4,8,0.92)); box-shadow: 0 24px 64px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,71,71,0.08); }
        .rm-page--day3 .rm-dock__item.is-active { border-color: rgba(255,71,71,0.42); background: linear-gradient(135deg, rgba(255,71,71,0.2), rgba(255,71,71,0.08)); color: #ffc2c2; }
        .rm-page--day3 .rm-dock__status { border-color: rgba(255,71,71,0.16); background: linear-gradient(180deg, rgba(42,12,12,0.82), rgba(18,8,8,0.74)); color: #ffb0b0; }
        .rm-page--day3 .rm-dock__status-dot { background: #ff4747; box-shadow: 0 0 10px rgba(255,71,71,0.85); }
        .rm-page--day3 .rm-scene-gallery { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .rm-page--day3 .rm-scene-art { position: absolute; inset: 0; overflow: hidden; }
        .rm-page--day3 .rm-scene-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,0,6,0.42) 0%, rgba(10,0,6,0.18) 24%, rgba(10,0,6,0.18) 68%, rgba(10,0,6,0.52) 82%, rgba(10,0,6,1) 100%); }
        .rm-page--day3 .rm-scene-art img { display: block; width: 100%; height: 100vh; object-fit: cover; filter: saturate(0.9) contrast(1.08) brightness(0.42); transform: scale(1.05); }
        .rm-page--day3[data-roadmap-mode="lite"] .rm-card,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-popup,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-event-glass,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-dock__inner { backdrop-filter: none !important; box-shadow: none !important; }
        .rm-page--day3[data-roadmap-mode="lite"] .rm-card,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-popup { animation: none !important; }
        .rm-page--day3[data-roadmap-mode="lite"] .rm-card__image,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-scene-art img,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-page__aurora,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-card__sheen { filter: none !important; }
        .rm-page--day3[data-roadmap-mode="lite"] .rm-node__halo,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-node__impact,
        .rm-page--day3[data-roadmap-mode="lite"] .rm-node__pulse { opacity: 0.45 !important; }
        .rm-page--day3 .rm-end-popup { position: absolute; right: calc(100% + 0.95rem); top: 50%; transform: translate(-12px, -50%) scale(0.92); min-width: 12rem; max-width: 13.5rem; padding: 0.75rem 0.9rem; border-radius: 1rem; border: 1px solid rgba(255,71,71,0.24); background: linear-gradient(135deg, rgba(255,71,71,0.1), rgba(255,71,71,0.05)), rgba(10,0,6,0.94); opacity: 0; pointer-events: none; transition: opacity 320ms ease, transform 380ms cubic-bezier(0.22, 1, 0.36, 1); z-index: 4; }
        .rm-page--day3 .rm-end-popup::after { content: ""; position: absolute; right: -0.45rem; top: 50%; width: 0.9rem; height: 0.9rem; transform: translateY(-50%) rotate(45deg); border-right: 1px solid rgba(255,71,71,0.24); border-bottom: 1px solid rgba(255,71,71,0.24); background: rgba(10,0,6,0.96); }
        .rm-page--day3 .rm-end-popup__label { display: inline-flex; align-items: center; gap: 0.38rem; color: #ffb0b0; font-size: 0.56rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; }
        .rm-page--day3 .rm-end-popup__label::before { content: ""; width: 0.42rem; height: 0.42rem; border-radius: 999px; background: #ff4747; box-shadow: 0 0 10px rgba(255,71,71,0.8); }
        .rm-page--day3 .rm-end-popup p { margin: 0.55rem 0 0; color: rgba(255,241,241,0.92); font-size: 0.76rem; line-height: 1.45; }
        .rm-page--day3.is-end-reached .rm-end-popup, .rm-page--day3 .rm-row--final.is-end-reached .rm-end-popup { opacity: 1; transform: translate(0, -50%) scale(1); }
        .rm-page--day3 .rm-timeline { position: relative; }
        .rm-page--day3 .rm-timeline__svg { overflow: visible; position: absolute; pointer-events: none; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; }
        .rm-page--day3 .rm-timeline__path--glow { display: none !important; }
        .rm-page--day3 .rm-timeline__path--base { stroke: rgba(255,71,71,0.18) !important; stroke-width: 4 !important; }
        .rm-page--day3 .rm-timeline__path--accent { stroke: #ffffff !important; stroke-width: 3 !important; opacity: 1 !important; filter: drop-shadow(0 0 12px rgba(255,71,71,0.8)) !important; }
        .rm-page--day3 #rm-tracer-shell { display: none !important; }
        .rm-page--day3 #rm-tracer-arrow { fill: #ffffff !important; filter: drop-shadow(0 0 10px rgba(255,71,71,1)) !important; }
        .rm-page--day3 .rm-node__center-dot { position: absolute; inset: 50% auto auto 50%; width: 0.55rem; height: 0.55rem; border-radius: 999px; transform: translate(-50%, -50%); pointer-events: none; }
        @media (max-width: 767px) {
          .rm-page--day3 .rm-end-popup { left: calc(100% + 0.95rem) !important; right: auto !important; top: 50% !important; transform: translate(12px, -50%) scale(0.92) !important; min-width: 12rem !important; padding: 0.62rem 0.72rem !important; z-index: 10 !important; }
          .rm-page--day3 .rm-end-popup::after { left: -0.45rem !important; right: auto !important; border-right: none !important; border-bottom: 1px solid rgba(255,71,71,0.24) !important; border-left: 1px solid rgba(255,71,71,0.24) !important; }
          .rm-page--day3.is-end-reached .rm-end-popup, .rm-page--day3 .rm-row--final.is-end-reached .rm-end-popup { transform: translate(0, -50%) scale(1) !important; }
        }
      `}</style>

      <div class="rm-scene-gallery"><div class="rm-scene-art"><img src="/roadmap-day3/i1.webp" alt="Day 3 background" loading="lazy" decoding="async" /></div></div>
      <div class="rm-page__aurora rm-page__aurora--left" />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">
          <div class="rm-section__header">
            <div class="rm-section__header-text"><span class="rm-pill">Timeline</span><h1 class="rm-section__title">Day 3 Event Flow</h1><p class="rm-section__copy">Tap any card to reveal its event, venue, timing, and registration details.</p></div>
            <div class="rm-event-glass"><span class="rm-event-glass__count">{String(EVENTS.length).padStart(2, "0")}</span><span class="rm-event-glass__label">Events<br />Today</span><span class="rm-event-glass__dot" /></div>
          </div>

          <div id="rm-timeline" class="rm-timeline">
            <svg id="rm-line-svg" class="rm-timeline__svg" aria-hidden="true"><path id="rm-line-base" class="rm-timeline__path rm-timeline__path--base" fill="none" /><path id="rm-line-glow" class="rm-timeline__path rm-timeline__path--glow" fill="none" /><path id="rm-line-accent" class="rm-timeline__path rm-timeline__path--accent" fill="none" /><g id="rm-tracer" class="rm-timeline__tracer" style="opacity:0;"><circle id="rm-tracer-shell" r="18" fill="rgba(255, 71, 71, 0.3)" /><path id="rm-tracer-arrow" d="M -12,-9 L 16,0 L -12,9 C -8,4 -8,-4 -12,-9 Z" /><circle r="6" fill="#fff" opacity="0.8" /></g></svg>

            {EVENTS.map((event, index) => {
              const meta = CAT[event.cat];
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              const isActive = false;
              const canRegister = Boolean(event.regLink);
              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>
                  <div class="rm-row__side rm-row__side--left">{side === "left" ? (<><EventCard ev={event} meta={meta} isActive={isActive} canRegister={canRegister} />{isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} inlineMobile />}</>) : (isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} />)}</div>
                  <div class={["rm-row__center", `rm-row__center--${side === "left" ? "r" : "l"}`]}><div class="rm-node" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`} data-snake-node=""><span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__impact" /><span class="rm-node__center-dot" aria-hidden="true" style={`background:${meta.color}; box-shadow: 0 0 10px rgba(${meta.rgb}, 0.45);`} /><span class="rm-node__time">{event.time}</span></div></div>
                  <div class="rm-row__side rm-row__side--right">{side === "right" ? (<><EventCard ev={event} meta={meta} isActive={isActive} canRegister={canRegister} />{isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} inlineMobile />}</>) : (isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} />)}</div>
                </div>
              );
            })}

            <div class="rm-row rm-row--final"><div class="rm-row__side" /><div class="rm-row__center"><div class="rm-node rm-node--finish"><span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__code">END</span></div></div><div class="rm-row__side"><div class="rm-end-popup" aria-live="polite"><div class="rm-end-popup__label">Mission Complete</div><p>Day 3 complete. Theta 2026 roadmap transmission ends here.</p></div></div></div>
          </div>
        </div>
      </section>

      <div class="rm-dock"><div class="rm-dock__inner"><Link href="/roadmap/day1" class="rm-dock__item">Day 1</Link><Link href="/roadmap/day2" class="rm-dock__item">Day 2</Link><Link href="/roadmap/day3" class="rm-dock__item is-active">Day 3</Link><span class="rm-dock__status"><span class="rm-dock__status-dot" />SPIDER THEME</span></div></div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Roadmap: Day 3 | THETA 2026",
  meta: [{ name: "description", content: "Explore the live event timeline for Day 3 of THETA 2026." }],
};
