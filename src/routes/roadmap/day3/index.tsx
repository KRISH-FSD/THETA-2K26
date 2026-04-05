import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

type Cat = "opening" | "tech" | "workshop" | "quiz" | "fun" | "cultural";

interface EventData {
  id: number; time: string; endTime: string; title: string;
  subtitle: string; venue: string; cat: Cat; desc: string;
  fee: string; team: string; prize: string; img: string; tags: string[];
}
interface CatMeta { label: string; short: string; color: string; rgb: string; }
interface EventCardProps {
  ev: EventData; meta: CatMeta; isActive: boolean;
  side: "left" | "right"; onToggle$: () => void;
}
interface PopupPanelProps { ev: EventData; meta: CatMeta; side: "left" | "right"; canRegister: boolean; }

const EVENTS: EventData[] = [
  {
    id: 1, time: "09:00 AM", endTime: "03:00 PM", title: "Spider-Game Arena",
    subtitle: "Rooftop of the multiverse", venue: "Room 202", cat: "fun",
    fee: "Free", team: "Individual", prize: "Champion Badge",
    img: "https://images.unsplash.com/photo-1635805737707-57588b48f6f7?q=80&w=1200",
    tags: ["Ladder", "Math Royale", "Battle"],
    desc: "A multiverse spanning arena featuring Ladder games, Brain Bid Battles, and the high-intensity Math Royale."
  },
  {
    id: 2, time: "09:30 AM", endTime: "11:30 AM", title: "Optica Simulation 3",
    subtitle: "Final light & pulse challenges", venue: "Room 310", cat: "quiz",
    fee: "Free", team: "Individual", prize: "Goodies",
    img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=1200",
    tags: ["Sonar", "Pyramid", "Scoops"],
    desc: "Heroic precision required for Sonar Sprints, Hopscotch Pyramids, and Hoops & Scoops simulations."
  },
  {
    id: 3, time: "10:00 AM", endTime: "01:00 PM", title: "Clash of Codes",
    subtitle: "Spider-sense bug hunting", venue: "Lab", cat: "tech",
    fee: "Rs 150", team: "2 Members", prize: "Rs 10,000",
    img: "https://images.unsplash.com/photo-1627389955805-720619756184?q=80&w=1200",
    tags: ["Warm Up", "Challenge", "Showdown"],
    desc: "Your spider-sense tingles on every bug. A three-stage code battle from warm-ups to the final world-saving showdown."
  },
  {
    id: 4, time: "10:00 AM", endTime: "01:00 PM", title: "ThinkZone Challenge",
    subtitle: "Oscorp artistic research", venue: "Room 402", cat: "workshop",
    fee: "Rs 100", team: "Pairs", prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
    tags: ["Artistic", "Scavenger", "Hunt"],
    desc: "Identify the hidden patterns in Oscorp's data through Kandupidi research and scavenger hunts."
  },
  {
    id: 5, time: "11:00 AM", endTime: "01:00 PM", title: "Stock Wars",
    subtitle: "Strategic market web", venue: "Room 303", cat: "tech",
    fee: "Rs 100", team: "3 Members", prize: "Rs 12,000",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200",
    tags: ["Entry", "News", "Shock"],
    desc: "Market entry, news impacts, and market shocks — weave through the stock web before the bubble pops."
  },
  {
    id: 6, time: "11:00 AM", endTime: "01:00 PM", title: "Spider-Funverse",
    subtitle: "Chaos in the into-the-verse", venue: "Room 410/411", cat: "fun",
    fee: "Free", team: "4 Members", prize: "Trophies",
    img: "https://images.unsplash.com/photo-1533447333873-31185b3b77ba?q=80&w=1200",
    tags: ["Imposter", "Chaos", "Battle"],
    desc: "Enter the multiverse with Imposter Arc, Chaos Carnival, and MegaVerse battle simulations."
  },
  {
    id: 7, time: "11:00 AM", endTime: "01:00 PM", title: "Daily Bugle Hackathon",
    subtitle: "Breaking the news with code", venue: "Room 106", cat: "tech",
    fee: "Rs 200", team: "3 Members", prize: "Rs 15,000",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    tags: ["Hack", "News", "Sprint"],
    desc: "S.H.I.E.L.D. level clearance hackathon. Build solutions that make the front page of the Daily Bugle."
  },
  {
    id: 8, time: "11:00 AM", endTime: "02:00 PM", title: "Web-Slinger Sports",
    subtitle: "City-wide reflex challenge", venue: "Basketball Court", cat: "fun",
    fee: "Free", team: "Varies", prize: "Medals",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
    tags: ["Basketball", "Pass", "Tug"],
    desc: "High-agility basketball, pass the ball relay, and a final strength-draining Tug of War."
  },
];

const CAT: Record<Cat, CatMeta> = {
  opening: { label: "Opening", short: "OP", color: "#ff2020", rgb: "255,32,32" },
  tech: { label: "Tech", short: "TK", color: "#4488ff", rgb: "68,136,255" },
  workshop: { label: "Workshop", short: "WS", color: "#bb77ff", rgb: "187,119,255" },
  quiz: { label: "Quiz", short: "QZ", color: "#ffaa33", rgb: "255,170,51" },
  fun: { label: "Fun", short: "FN", color: "#66ddcc", rgb: "102,221,204" },
  cultural: { label: "Cultural", short: "CL", color: "#ff88aa", rgb: "255,136,170" },
};

/* ─── Popup Panel ─────────────────────────────── */
const PopupPanel = component$<PopupPanelProps>(({ ev, meta, side, canRegister }) => (
  <div
    class={["rm-popup", `rm-popup--${side}`]}
    style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
  >
    <span class="rm-popup__ripple rm-popup__ripple--1" />
    <span class="rm-popup__ripple rm-popup__ripple--2" />
    <span class="rm-popup__ripple rm-popup__ripple--3" />
    <div class="rm-popup__inner">
      <div class="rm-popup__head">
        <span class="rm-popup__chip">
          <span class="rm-popup__dot" />{meta.label}
        </span>
        <span class="rm-popup__node-label">SCENE {String(ev.id).padStart(2, "0")}</span>
      </div>
      <h3 class="rm-popup__title">{ev.title}</h3>
      <div class="rm-popup__vitals">
        <div class="rm-popup__vital">
          <div class="rm-popup__vital-icon">🕒</div>
          <div class="rm-popup__vital-content">
            <span class="rm-popup__vital-label">TIMING</span>
            <span class="rm-popup__vital-value">{ev.time} – {ev.endTime}</span>
          </div>
        </div>
        <div class="rm-popup__vital">
          <div class="rm-popup__vital-icon">📍</div>
          <div class="rm-popup__vital-content">
            <span class="rm-popup__vital-label">VENUE</span>
            <span class="rm-popup__vital-value">{ev.venue}</span>
          </div>
        </div>
      </div>
      <div class="rm-popup__stats">
        <div class="rm-popup__stat">
          <span class="rm-popup__stat-l">Entry</span>
          <strong class="rm-popup__stat-v">{ev.fee}</strong>
        </div>
        <div class="rm-popup__stat">
          <span class="rm-popup__stat-l">Team</span>
          <strong class="rm-popup__stat-v">{ev.team}</strong>
        </div>
        <div class="rm-popup__stat">
          <span class="rm-popup__stat-l">Prize</span>
          <strong class="rm-popup__stat-v">{ev.prize}</strong>
        </div>
      </div>
      <div class="rm-popup__tags">
        {ev.tags.map((t) => <span key={t} class="rm-popup__tag">{t}</span>)}
      </div>
      <div class="rm-popup__actions">
        <Link href="/events" class="rm-popup__action rm-popup__action--primary"
          onClick$={(e: Event) => e.stopPropagation()}>View Event Hub</Link>
        {canRegister
          ? <Link href="/events" class="rm-popup__action rm-popup__action--ghost"
            onClick$={(e: Event) => e.stopPropagation()}>Register Now</Link>
          : <span class="rm-popup__open-badge">Open Access</span>}
      </div>
    </div>
  </div>
));

/* ─── Event Card ───────────────────────────────── */
const EventCard = component$<EventCardProps>(
  ({ ev, meta, isActive, side, onToggle$ }) => (
    <article
      class={["rm-card", isActive ? "is-active" : "", `rm-card--${side}`]}
      style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
      onClick$={onToggle$}
      onKeyDown$={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle$(); } }}
      role="button" tabIndex={0} aria-expanded={isActive}
    >
      <div class="rm-card__sheen" />
      <div class="rm-card__media">
        <img src={ev.img} alt={ev.title} width={1200} height={640} loading="lazy" class="rm-card__image" />
        <div class="rm-card__media-overlay" />
        <div class="rm-card__chip-row">
          <span class="rm-card__chip rm-card__chip--accent">
            <span class="rm-card__chip-dot" />{meta.label}
          </span>
          <span class="rm-card__chip">{ev.time}</span>
        </div>
        <div class="rm-card__eyebrow">
          <span>{ev.subtitle}</span><span>{ev.endTime}</span>
        </div>
      </div>
      <div class="rm-card__body">
        <div class="rm-card__heading">
          <div>
            <p class="rm-card__overline">Scene {String(ev.id).padStart(2, "0")}</p>
            <h3 class="rm-card__title">{ev.title}</h3>
          </div>
          <span class="rm-card__toggle">{isActive ? "Collapse" : "Details →"}</span>
        </div>
        <p class="rm-card__desc">{ev.desc}</p>
        <div class="rm-card__quick-meta">
          <span class="rm-card__meta-pill">{ev.venue}</span>
          <span class="rm-card__meta-pill">{ev.time} – {ev.endTime}</span>
        </div>
        {isActive && (
          <p class="rm-card__popup-hint">← See details panel →</p>
        )}
      </div>
    </article>
  ),
);

export default component$(function Day3Roadmap() {
  const activeEventId = useSignal<number | null>(null);

  useVisibleTask$(() => {
    document.body.setAttribute("data-theme", "spider");
    return () => { document.body.removeAttribute("data-theme"); };
  });

  useVisibleTask$(() => {
    const page = document.querySelector(".rm-page--sp") as HTMLElement | null;
    if (!page) return;
    let rafId = 0;
    const updateScroll = () => {
      rafId = 0;
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollRatio = window.scrollY / scrollMax;
      page.style.setProperty("--rm-scroll-progress", scrollRatio.toFixed(4));
      const mid1 = 0.3, mid2 = 0.7;
      const span = 0.3;
      const img1 = Math.max(0, Math.min(1, (mid1 - scrollRatio + span / 2) / span));
      const img3 = Math.max(0, Math.min(1, (scrollRatio - mid2 + span / 2) / span));
      const img2 = Math.max(0, 1 - img1 - img3);
      page.style.setProperty("--rm-bg1-opacity", img1.toFixed(4));
      page.style.setProperty("--rm-bg2-opacity", img2.toFixed(4));
      page.style.setProperty("--rm-bg3-opacity", img3.toFixed(4));
      page.style.setProperty("--rm-bg1-shift", `${(-140 * (1 - img1)).toFixed(1)}px`);
      page.style.setProperty("--rm-bg2-shift", `${(140 * (img1 - img3)).toFixed(1)}px`);
      page.style.setProperty("--rm-bg3-shift", `${(140 * (1 - img3)).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(updateScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });

  useVisibleTask$(() => {
    const loadGSAP = () =>
      new Promise<void>((res) => {
        // @ts-ignore
        if (window.gsap) { res(); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
        s.onload = () => res(); s.onerror = () => res();
        document.head.appendChild(s);
      });

    const boot = async () => {
      await loadGSAP();
      // @ts-ignore
      const gsap: any = window.gsap;
      const pageRoot = document.querySelector(".rm-page--sp") as HTMLElement | null;
      const container = document.getElementById("rm-timeline") as HTMLElement | null;
      const svgEl = document.getElementById("rm-line-svg") as unknown as SVGSVGElement | null;
      const pathBase = document.getElementById("rm-line-base") as unknown as SVGPathElement | null;
      const pathAccent = document.getElementById("rm-line-accent") as unknown as SVGPathElement | null;
      const pathGlow = document.getElementById("rm-line-glow") as unknown as SVGPathElement | null;
      const tracer = document.getElementById("rm-tracer") as unknown as SVGGElement | null;
      if (!container || !svgEl || !pathBase || !pathAccent || !pathGlow) return;
      const finalRow = container.querySelector(".rm-row--final") as HTMLElement | null;
      const finalNode = finalRow?.querySelector(".rm-node--finish") as HTMLElement | null;
      let totalLen = 0, rafId = 0, scheduled = false, needsBuild = true;
      let targetProg = 0, renderProg = 0, tracerRafId = 0;
      let ro: ResizeObserver | undefined;
      const enableCardReveal = !(window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 767);
      const smoothFactor = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 767 ? 0.16 : 0.32;
      const revealed = new Set<Element>();
      const liveNodes = () => Array.from(container.querySelectorAll<HTMLElement>("[data-snake-node]")).filter((n) => n.offsetParent !== null && n.offsetWidth > 0);
      const buildPath = (): boolean => {
        const nodes = liveNodes();
        if (nodes.length < 2) return false;
        const cr = container.getBoundingClientRect();
        const W = container.clientWidth, H = Math.max(container.scrollHeight, container.clientHeight);
        const pts = nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { x: r.left - cr.left + r.width / 2, y: r.top - cr.top + r.height / 2 };
        });
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const dy = c.y - p.y, bend = Math.max(60, dy * 0.42);
          d += ` C ${p.x.toFixed(1)} ${(p.y + bend).toFixed(1)},` + ` ${c.x.toFixed(1)} ${(c.y - bend).toFixed(1)},` + ` ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
        }
        svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`); svgEl.setAttribute("width", String(W)); svgEl.setAttribute("height", String(H));
        for (const p of [pathBase, pathAccent, pathGlow]) { p.setAttribute("d", d); p.style.strokeDasharray = String(p.getTotalLength()); }
        totalLen = pathBase.getTotalLength();
        return true;
      };
      const posTracer = (prog: number) => {
        if (!tracer || totalLen === 0) return;
        const cl = Math.max(0, Math.min(1, prog)), off = cl * totalLen, pt = pathBase.getPointAtLength(off), ptN = pathBase.getPointAtLength(Math.min(totalLen, off + 18));
        const ang = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * (180 / Math.PI);
        tracer.setAttribute("transform", `translate(${pt.x.toFixed(2)},${pt.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
        tracer.style.opacity = cl > 0.005 && cl < 0.998 ? "1" : "0";
      };
      const applyProgress = (prog: number, ns: HTMLElement[], VH: number) => {
        const currentIdx = Math.floor(prog * (ns.length - 1) + 0.1);
        if (currentIdx >= 0 && currentIdx < EVENTS.length) { const ev = EVENTS[currentIdx]; if (activeEventId.value !== ev.id) activeEventId.value = ev.id; } else if (currentIdx >= EVENTS.length) { activeEventId.value = null; }

        const off = totalLen * (1 - prog);
        const endReached = prog >= 0.97;

        pathBase.style.strokeDashoffset = String(off); pathAccent.style.strokeDashoffset = String(Math.max(0, off - 26)); pathGlow.style.strokeDashoffset = String(off);
        posTracer(prog);
        ns.forEach((n, i) => n.classList.toggle("rm-node--lit", prog >= i / Math.max(ns.length - 1, 1) - 0.02));

        pageRoot?.classList.toggle("is-end-reached", endReached); finalRow?.classList.toggle("is-end-reached", endReached); finalNode?.classList.toggle("rm-node--lit", endReached);
        if (tracer && endReached) tracer.style.opacity = "0";

        Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)")).forEach((row, idx) => {
          const card = row.querySelector<HTMLElement>(".rm-card");
          if (card && !revealed.has(card)) {
            const top = card.getBoundingClientRect().top;
            const isLeft = row.classList.contains("rm-row--left");
            if (top < VH * 0.9) {
              revealed.add(card);
              if (gsap && enableCardReveal) { gsap.fromTo(card, { opacity: 0, x: isLeft ? -70 : 70, y: 28, scale: 0.88, rotateY: isLeft ? -14 : 14 }, { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, duration: 0.85, ease: "back.out(1.4)", delay: idx * 0.04, clearProps: "transform" }); } else { card.style.opacity = "1"; card.style.transform = "none"; }
            }
          }
        });
      };
      const animateTracer = () => {
        tracerRafId = 0;
        if (totalLen === 0) return;
        const VH = window.innerHeight, ns = liveNodes();
        if (ns.length < 2) return;
        renderProg += (targetProg - renderProg) * smoothFactor;
        if (Math.abs(targetProg - renderProg) < 0.0012) renderProg = targetProg;
        applyProgress(renderProg, ns, VH);
        if (Math.abs(targetProg - renderProg) >= 0.0012) tracerRafId = requestAnimationFrame(animateTracer);
      };
      const queueTracer = () => {
        if (tracerRafId) return;
        tracerRafId = requestAnimationFrame(animateTracer);
      };
      const update = () => {
        if (totalLen === 0) return;
        const ns = liveNodes();
        if (ns.length < 2) return;
        
        // --- READ PHASE ---
        const firstRect = ns[0].getBoundingClientRect();
        const lastRect = ns[ns.length - 1].getBoundingClientRect();
        
        const unrevealedCards: { card: HTMLElement; top: number; isLeft: boolean; idx: number }[] = [];
        Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)")).forEach((row, idx) => {
          const card = row.querySelector<HTMLElement>(".rm-card");
          if (card && !revealed.has(card)) {
            unrevealedCards.push({
              card,
              top: card.getBoundingClientRect().top,
              isLeft: row.classList.contains("rm-row--left"),
              idx
            });
          }
        });

        // --- COMPUTE PHASE ---
        const startY = firstRect.top + firstRect.height / 2;
        const endY = lastRect.top + lastRect.height / 2;
        const targetY = window.innerHeight * 0.55;
        const span = Math.max(endY - startY, 1);
        targetProg = Math.max(0, Math.min(1, (targetY - startY) / span));
        if (!tracerRafId && Math.abs(renderProg - targetProg) < 0.0012) renderProg = targetProg;
        queueTracer();
      };
      const flush = () => { scheduled = false; if (needsBuild) needsBuild = !buildPath(); if (!needsBuild) update(); };
      const go = (rebuild = false) => { needsBuild = needsBuild || rebuild; if (scheduled) return; scheduled = true; rafId = requestAnimationFrame(flush); };
      Array.from(container.querySelectorAll<HTMLImageElement>("img")).forEach((img) => { if (!img.complete) img.addEventListener("load", () => go(true)); });
      if ("ResizeObserver" in window) { ro = new ResizeObserver(() => go(true)); ro.observe(container); }
      window.addEventListener("scroll", () => go(false), { passive: true }); window.addEventListener("resize", () => go(true), { passive: true });
      setTimeout(() => go(true), 180); go(true);
      container.querySelectorAll<HTMLElement>(".rm-node").forEach((n) => { n.addEventListener("mouseenter", () => n.classList.add("rm-node--hovered")); n.addEventListener("mouseleave", () => n.classList.remove("rm-node--hovered")); });
      if (gsap) { const hdr = document.querySelector(".rm-section__header"); if (hdr) gsap.fromTo(hdr, { opacity: 0, y: -36 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }); }
      return () => { if (rafId) cancelAnimationFrame(rafId); if (tracerRafId) cancelAnimationFrame(tracerRafId); ro?.disconnect(); };
    };
    let cleanup: (() => void) | undefined; boot().then((fn) => { cleanup = fn as any; }); return () => cleanup?.();
  });

  const toggleEvent = $((id: number) => { activeEventId.value = activeEventId.value === id ? null : id; });

  return (
    <div class="rm-page rm-page--sp">
      <style>{`
        .rm-page--sp {
          --rm-scroll-progress: 0;
          --rm-bg1-opacity: 1; --rm-bg2-opacity: 0; --rm-bg3-opacity: 0;
          --rm-bg1-shift: 0px; --rm-bg2-shift: 0px; --rm-bg3-shift: 0px;
          background: #040006; color: #fff; position: relative;
        }

        /* Redesigned Popup Block */
        .rm-page--sp .rm-popup {
          background: rgba(4, 0, 8, 0.98);
          backdrop-filter: blur(28px);
          border-color: rgba(255, 32, 32, 0.35);
          box-shadow: 0 32px 84px rgba(0,0,0,0.64), 0 0 24px rgba(255, 32, 32, 0.08);
          animation: rmPopupEnter 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          max-width: 360px;
          width: calc(100vw - 4rem);
          border-radius: 1.5rem;
          overflow: hidden;
          transform-origin: center;
        }
        @keyframes rmPopupEnter {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .rm-popup__inner { padding: 1.15rem !important; }

        .rm-popup__vitals {
          display: flex; flex-direction: column; gap: 0.6rem; margin: 0.85rem 0; padding: 0.85rem;
          border-radius: 1rem; background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08); border-left: 3px solid var(--rm-accent);
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.22);
        }
        .rm-popup__vital { display: flex; align-items: center; gap: 0.75rem; }
        .rm-popup__vital-icon {
          width: 1.5rem; height: 1.65rem; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06); border-radius: 0.5rem; font-size: 0.85rem;
        }
        .rm-popup__vital-content { display: flex; flex-direction: column; gap: 0.05rem; }
        .rm-popup__vital-label { font-size: 0.5rem; font-weight: 800; letter-spacing: 0.12em; color: rgba(255,255,255,0.42); text-transform: uppercase; }
        .rm-popup__vital-value { font-size: 0.78rem; font-weight: 700; color: #fff; line-height: 1.1; }
        .rm-popup__node-label { font-size: 0.58rem; font-weight: 900; color: var(--rm-accent); letter-spacing: 0.1em; opacity: 0.7; }
        .rm-popup__title { font-size: 1.15rem !important; margin: 0.4rem 0 !important; line-height: 1.3 !important; }
        
        .rm-popup__stats { margin-top: 0.75rem !important; gap: 0.5rem !important; }
        .rm-popup__stat { padding: 0.45rem 0.6rem !important; border-radius: 0.6rem !important; }
        .rm-popup__stat-l { font-size: 0.55rem !important; }
        .rm-popup__stat-v { font-size: 0.75rem !important; }
        .rm-popup__actions {
          margin-top: 1rem !important;
          display: flex !important;
          flex-direction: row !important;
          gap: 0.5rem !important;
        }
        .rm-popup__action {
          flex: 1 !important;
          padding: 0.55rem 0.6rem !important;
          font-size: 0.72rem !important;
          border-radius: 0.75rem !important;
          text-align: center;
          white-space: nowrap;
        }

        .rm-page--sp::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: 
            linear-gradient(180deg, rgba(8, 0, 12, 0.52) 0%, rgba(12, 0, 18, 0.35) 18%, rgba(12, 0, 18, 0.46) 56%, rgba(4, 0, 6, 0.82) 100%),
            radial-gradient(circle at 50% 20%, rgba(255, 32, 32, 0.08), transparent 25%);
        }
        .rm-page--sp .rm-card { background: rgba(4, 0, 8, 0.95); backdrop-filter: blur(24px); border-color: rgba(255, 32, 32, 0.22); }
        .rm-scene-gallery { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .rm-scene-art { position: absolute; inset: 0; overflow: hidden; will-change: transform, opacity; transition: opacity 220ms linear, transform 220ms linear; }
        .rm-scene-art::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(4, 0, 6, 0.42) 0%, rgba(4, 0, 6, 0.18) 24%, rgba(4, 0, 6, 0.18) 68%, rgba(4, 0, 6, 0.52) 82%, rgba(4, 0, 6, 1) 100%);
        }
        .rm-scene-art img { display: block; width: 100%; height: 100vh; object-fit: cover; filter: saturate(0.85) contrast(1.1) brightness(0.42); transform: scale(1.05); }
        .rm-scene-art--i1 { opacity: var(--rm-bg1-opacity); transform: translate3d(0, var(--rm-bg1-shift), 0); }
        .rm-scene-art--i2 { opacity: var(--rm-bg2-opacity); transform: translate3d(0, var(--rm-bg2-shift), 0); }
        .rm-scene-art--i3 { opacity: var(--rm-bg3-opacity); transform: translate3d(0, var(--rm-bg3-shift), 0); }

        .rm-page--sp .rm-end-popup {
          position: absolute; right: calc(100% + 0.95rem); top: 50%; transform: translate(-12px, -50%) scale(0.92);
          min-width: 12rem; padding: 0.75rem 0.9rem; border-radius: 1rem; border: 1px solid rgba(255, 32, 32, 0.24);
          background: linear-gradient(135deg, rgba(255, 32, 32, 0.1), rgba(184, 0, 0, 0.05)), rgba(4, 0, 8, 0.94);
          box-shadow: 0 18px 42px rgba(0,0,0,0.42), 0 0 24px rgba(255, 32, 32, 0.12); opacity: 0; pointer-events: none;
          transition: opacity 320ms ease, transform 380ms cubic-bezier(0.22, 1, 0.36, 1); z-index: 4;
        }
        .rm-page--sp.is-end-reached .rm-end-popup { opacity: 1; transform: translate(0, -50%) scale(1); }
        @media (max-width: 767px) {
          .rm-page--sp .rm-end-popup { left: calc(100% + 0.95rem) !important; right: auto !important; top: 50% !important; bottom: auto !important; transform: translate(12px, -50%) scale(0.92) !important; min-width: 12rem !important; padding: 0.62rem 0.72rem !important; z-index: 10 !important; }
          .rm-page--sp.is-end-reached .rm-end-popup, .rm-page--sp .rm-row--final.is-end-reached .rm-end-popup { transform: translate(0, -50%) scale(1) !important; }
        }
        .rm-row--final { margin-bottom: 0 !important; }
        .rm-timeline { padding-bottom: 0 !important; }
      `}</style>

      <div class="rm-scene-gallery">
        <div class="rm-scene-art rm-scene-art--i1"><img src="/roadmap-day3/i1.png" alt="Scene 1" /></div>
        <div class="rm-scene-art rm-scene-art--i2"><img src="/roadmap-day3/i2.png" alt="Scene 2" /></div>
        <div class="rm-scene-art rm-scene-art--i3"><img src="/roadmap-day3/i3.png" alt="Scene 3" /></div>
      </div>

      <div class="rm-page__aurora rm-page__aurora--left" />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">Timeline</span>
              <h1 class="rm-section__title">Day 3: Spider-Verse</h1>
              <p class="rm-section__copy">Tap any card to reveal its event, team & prize details.</p>
            </div>
            <div class="rm-event-glass">
              <span class="rm-event-glass__count">{String(EVENTS.length).padStart(2, "0")}</span>
              <span class="rm-event-glass__label">Events<br />Today</span>
              <span class="rm-event-glass__dot" />
            </div>
          </div>

          <div id="rm-timeline" class="rm-timeline">
            <svg id="rm-line-svg" class="rm-line-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="rm-grad-line" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ff2020" />
                  <stop offset="50%" stop-color="#ff4444" />
                  <stop offset="100%" stop-color="#ff2020" />
                </linearGradient>
                <filter id="rm-glow-f" x="-40%" y="-10%" width="180%" height="120%">
                  <feGaussianBlur stdDeviation="15" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="rm-tracer-fill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fff" stop-opacity="1" />
                  <stop offset="45%" stop-color="#ff2020" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#ff4444" stop-opacity="0" />
                </radialGradient>
              </defs>
              <path id="rm-line-glow" class="rm-line-glow" fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-base" class="rm-line-base" fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-accent" class="rm-line-accent" fill="none" stroke="rgba(255,255,255,0.7)" filter="url(#rm-glow-f)" />
              <g id="rm-tracer" style="opacity:0;will-change:transform;">
                {/* Outer Glow Arrow */}
                <path d="M -14,-10 L 18,0 L -14,10 C -10,4 -10,-4 -14,-10 Z" fill="url(#rm-tracer-fill)" filter="url(#rm-glow-f)" opacity="0.6" />
                {/* Sleek Core Arrow */}
                <path d="M -12,-8 L 14,0 L -12,8 C -9,3 -9,-3 -12,-8 Z" fill="#fff" filter="url(#rm-glow-f)" />
                
                {/* Fast Inner Pulse */}
                <circle cx="0" cy="0" r="18" fill="none" stroke="url(#rm-grad-line)" stroke-width="1.5" opacity="0.6">
                  <animate attributeName="r" from="12" to="35" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
                </circle>
                
                {/* Slow Outer Pulse */}
                <circle cx="0" cy="0" r="25" fill="none" stroke="url(#rm-grad-line)" stroke-width="1" opacity="0.3">
                  <animate attributeName="r" from="15" to="50" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            {EVENTS.map((event, index) => {
              const meta = CAT[event.cat], side = index % 2 === 0 ? "left" : "right", isActive = activeEventId.value === event.id, canRegister = event.cat !== "opening" && event.cat !== "cultural";
              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>
                  <div class="rm-row__side rm-row__side--left">
                    {side === "left" ? <EventCard ev={event} meta={meta} isActive={isActive} side="left" onToggle$={() => toggleEvent(event.id)} /> : isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} />}
                  </div>
                  <div class={["rm-row__center", `rm-row__center--${side === "left" ? "r" : "l"}`]}>
                    <div class="rm-node" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`} data-snake-node="">
                      <span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__impact" />
                      <span class="rm-node__code">{meta.short}</span><span class="rm-node__time">{event.time}</span>
                    </div>
                  </div>
                  <div class="rm-row__side rm-row__side--right">
                    {side === "right" ? <EventCard ev={event} meta={meta} isActive={isActive} side="right" onToggle$={() => toggleEvent(event.id)} /> : isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} />}
                  </div>
                </div>
              );
            })}

            <div class="rm-row rm-row--final">
              <div class="rm-row__side rm-row__side--left" />
              <div class="rm-row__center rm-row__center--c">
                <div class="rm-node rm-node--finish" data-snake-node="">
                  <span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__code">END</span><span class="rm-node__time">09:00 PM</span>
                  <div class="rm-end-popup"><span class="rm-end-popup__label">Hero Protocol Set</span><p>Theta 2026 mission complete. The city is safe.</p></div>
                </div>
              </div>
              <div class="rm-row__side rm-row__side--right">
                <div class="rm-end-card">
                  <span class="rm-pill">Finish</span><h3>Mission Complete.</h3><p>Thank you for participating!</p>
                  <div class="rm-end-card__meta"><span>Archive ready</span><Link href="/events">View Results</Link></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="rm-dock">
        <div class="rm-dock__inner">
          <Link href="/roadmap/day1" class="rm-dock__item">Day 1</Link>
          <Link href="/roadmap/day2" class="rm-dock__item">Day 2</Link>
          <Link href="/roadmap/day3" class="rm-dock__item is-active">Day 3</Link>
          <span class="rm-dock__status"><span class="rm-dock__status-dot" />Spider theme</span>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 3 Roadmap | Theta 2026",
  meta: [{ name: "description", content: "Day 3 roadmap - Spider-Verse finale. Final mission schedule and interactive timeline." }],
};
