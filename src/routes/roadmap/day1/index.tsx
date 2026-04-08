import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { getDevicePerfTier } from "~/utils/perf";

type Cat = "opening" | "tech" | "workshop" | "quiz" | "fun" | "cultural";

interface EventData {
  id: number; time: string; endTime: string; title: string;
  subtitle: string; venue: string; cat: Cat; desc: string;
  img: string; tags: string[]; regLink?: string;
}
interface CatMeta { label: string; short: string; color: string; rgb: string; }
interface EventCardProps {
  ev: EventData; meta: CatMeta; canRegister: boolean; isActive: boolean;
}
interface PopupPanelProps { ev: EventData; meta: CatMeta; side: "left" | "right"; canRegister: boolean; inlineMobile?: boolean; }

const EVENTS: EventData[] = [
  {
    id: 1, time: "10:00 AM", endTime: "12:00 PM", title: "IRON FIST AI",
    subtitle: "Vision and memory relay", venue: "Room 410", cat: "tech",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    tags: ["AI", "Vision", "Memory"],
    desc: "A tri-phase team challenge featuring Mini Militia battles, memory relays, and AI-powered vision tasks.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSdbmoFbrB1bmYrfSQTIVNCjRTSDziAhSheJio7vq4YnrXUA5A/viewform?usp=sharing&ouid=104165202810433780029",
  },
  {
    id: 2, time: "11:00 AM", endTime: "01:00 PM", title: "Venture Forge Hackathon - Marketing Edition",
    subtitle: "Strategic marketing sprint", venue: "Room 303", cat: "tech",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200",
    tags: ["Marketing", "Pitch", "Hackathon"],
    desc: "Identify problems, design marketing solutions, and pitch your startup strategy to the panel.",
    regLink: "https://forms.gle/pBETMEayh8sBm1Q69",
  },
  {
    id: 3, time: "11:00 AM", endTime: "01:00 PM", title: "Physics Freeze Game",
    subtitle: "Physics and light experiments", venue: "Room 310", cat: "quiz",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200",
    tags: ["Physics", "Optics", "Binary"],
    desc: "Interactive rounds featuring Physics Freeze, Binary Code Game, and Bernoulli Binary Blast.",
    regLink: "https://docs.google.com/forms/d/e/1FAIpQLSeABawd4zOkl772rRy8v4HWKkHKmVOtEtJS5ma5WeettAcnww/viewform?usp=dialog",
  },
  {
    id: 4, time: "11:00 AM", endTime: "01:00 PM", title: "Technical Event - Gesture Controlled Bot: Obstacle Maze",
    subtitle: "Obstacle maze robotics challenge", venue: "ECE Lab", cat: "tech",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    tags: ["Robotics", "Maze", "Gesture"],
    desc: "Guide a gesture-controlled bot through an obstacle maze with precision, control, and smart calibration.",
    regLink: "https://forms.gle/CDKpnNqdNx85rvPi9",
  },
  {
    id: 5, time: "11:00 AM", endTime: "02:00 PM", title: "Bio Architect",
    subtitle: "Living structures workshop", venue: "IED Hall", cat: "tech",
    img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200",
    tags: ["Biology", "Design", "Organic"],
    desc: "A cluster-led session on biological architecture and organic design principles.",
    regLink: "https://forms.gle/6WUW1J79fncoE8Zt7",
  },
  {
    id: 6, time: "11:00 AM", endTime: "02:00 PM", title: "TECH - STARTUP CHALLENGE",
    subtitle: "The innovator's showcase", venue: "Room 402", cat: "tech",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200",
    tags: ["Tech Spark", "Design", "Startup"],
    desc: "A startup-themed challenge covering Tech Spark, Design and Develop, and a final showcase round.",
    regLink: "https://forms.gle/vdZds3WZAW5Q7jJ96",
  },
  {
    id: 7, time: "11:00 AM", endTime: "02:00 PM", title: "Sports Events",
    subtitle: "Physical and reflex challenges", venue: "Basketball Court", cat: "fun",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
    tags: ["Football", "Spin and Bowl", "Match the Bottle"],
    desc: "A high-energy sports block with football, Spin and Bowl, and Match the Bottle challenges."
  },
  {
    id: 8, time: "11:00 AM", endTime: "04:00 PM", title: "FInfinity",
    subtitle: "Mathematical guess and win", venue: "Room 203", cat: "quiz",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200",
    tags: ["Math", "Logic", "Clues"],
    desc: "A long-form mathematical challenge built around clue connections, quick thinking, and guess-to-win rounds."
  },
  {
    id: 9, time: "11:00 AM", endTime: "04:00 PM", title: "Infinity Beats",
    subtitle: "Rhythm and logic balance", venue: "Room 211", cat: "fun",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
    tags: ["Balance", "Rhythm", "Tap"],
    desc: "A multi-stage fun event featuring Balance Blitz, Tap and Drop, and Spin and Solve challenges."
  },
  {
    id: 10, time: "11:15 AM", endTime: "01:45 PM", title: "Edit Blitz",
    subtitle: "Rapid media editing sprint", venue: "Lab", cat: "workshop",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200",
    tags: ["Editing", "Video", "Speed"],
    desc: "A fast-paced media editing contest where efficiency and creativity meet the clock."
  },
  {
    id: 11, time: "11:30 AM", endTime: "01:00 PM", title: "AI prompt App Creation",
    subtitle: "Generative AI coding lab", venue: "Room 110", cat: "workshop",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
    tags: ["AI", "Prompts", "Apps"],
    desc: "Learn to build functional applications using state-of-the-art AI prompting techniques.",
    regLink: "https://forms.gle/TEuppmExeMsJTLGSA",
  },
  {
    id: 12, time: "02:00 PM", endTime: "04:00 PM", title: "Treasure Hunt",
    subtitle: "Campus-wide mystery solved", venue: "Room 406", cat: "fun",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200",
    tags: ["Treasure", "Hunt", "Clues"],
    desc: "Search the campus for hidden clues to unlock the secrets of the Null Void."
  },
];

const CAT: Record<Cat, CatMeta> = {
  opening: { label: "Opening", short: "OP", color: "#d7ff4a", rgb: "215,255,74" },
  tech: { label: "Tech", short: "AI", color: "#63ff2c", rgb: "99,255,44" },
  workshop: { label: "Workshop", short: "WS", color: "#99ff4f", rgb: "153,255,79" },
  quiz: { label: "Quiz", short: "QZ", color: "#f3ff91", rgb: "243,255,145" },
  fun: { label: "Fun", short: "FN", color: "#b8ff57", rgb: "184,255,87" },
  cultural: { label: "Cultural", short: "CL", color: "#efffc8", rgb: "239,255,200" },
};

/* ─── Popup Panel ─────────────────────────────── */
const PopupPanel = component$<PopupPanelProps>(({ ev, meta, side, canRegister, inlineMobile }) => (
  <div
    class={["rm-popup", `rm-popup--${side}`, inlineMobile ? "rm-popup--inline-mobile" : ""]}
    style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
  >
    {/* Ripple rings */}
    <span class="rm-popup__ripple rm-popup__ripple--1" />
    <span class="rm-popup__ripple rm-popup__ripple--2" />
    <span class="rm-popup__ripple rm-popup__ripple--3" />

    <div class="rm-popup__inner">
      {/* Header with Type Chip */}
      <div class="rm-popup__head">
        <span class="rm-popup__chip">
          <span class="rm-popup__dot" />{meta.label}
        </span>
        <span class="rm-popup__node-label">NODE {String(ev.id).padStart(2, "0")}</span>
      </div>

      <h3 class="rm-popup__title">{ev.title}</h3>

      {/* Detailed Vitals Block */}
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

      {/* Stats grid */}
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

      {/* Tags */}
      <div class="rm-popup__tags">
        {ev.tags.map((t) => <span key={t} class="rm-popup__tag">{t}</span>)}
      </div>

      {/* Action buttons - Hidden on mobile as per request */}
      <div class="rm-popup__actions hidden md:flex">
        <Link href="/events" class="rm-popup__action rm-popup__action--primary"
          onClick$={(e: Event) => e.stopPropagation()}>
          View Event Hub
        </Link>
        {canRegister
          ? <a href={ev.regLink} target="_blank" rel="noopener noreferrer" class="rm-popup__action rm-popup__action--ghost"
            onClick$={(e: Event) => e.stopPropagation()}>Register Now</a>
          : <span class="rm-popup__open-badge">Open Access</span>}
      </div>
    </div>
  </div>
));

/* ─── Event Card ───────────────────────────────── */
const EventCard = component$<EventCardProps>(
  ({ ev, meta, canRegister, isActive }) => (
    <article class="rm-card" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}>
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
            {/* <p class="rm-card__overline">Node {String(ev.id).padStart(2, "0")}</p> */}
            <h3 class="rm-card__title">{ev.title}</h3>
          </div>
          <span class="rm-card__toggle">
            {isActive ? "Collapse" : "Details"}
            <svg class="rm-card__toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d={isActive ? "M18 15l-6-6-6 6" : "M9 18l6-6-6-6"} />
            </svg>
          </span>
        </div>
        <p class="rm-card__desc">{ev.desc}</p>
        <div class="rm-card__stat-grid">
          <div class="rm-card__stat">
            <span class="rm-card__stat-label">Venue</span>
            <strong class="rm-card__stat-value">{ev.venue}</strong>
          </div>
          <div class="rm-card__stat">
            <span class="rm-card__stat-label">Timing</span>
            <strong class="rm-card__stat-value">{ev.time} - {ev.endTime}</strong>
          </div>
        </div>
        <div class="rm-card__tags">
          {ev.tags.map((t) => <span key={t} class="rm-card__tag">{t}</span>)}
        </div>
        {/* Actions - Hidden on mobile as per request */}
        <div class="rm-card__actions hidden md:flex">
          <Link href="/events" class="rm-card__action rm-card__action--primary">View Event Hub</Link>
          {canRegister
            ? <a href={ev.regLink} target="_blank" rel="noopener noreferrer" class="rm-card__action rm-card__action--ghost">Register Now</a>
            : <span class="rm-card__status">Open Access</span>}
        </div>
        {isActive && (
          <p class="rm-card__popup-hint">\u2190 See details panel \u2192</p>
        )}
      </div>
    </article>
  ),
);

export default component$(function Day1Roadmap() {
  useVisibleTask$(() => {
    const boot = () => {
      const pageRoot = document.querySelector(".rm-page--day1") as HTMLElement | null;
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
      const lateRebuildTimers: number[] = [];
      const tier = getDevicePerfTier();
      const isMobile = tier === "lo" || window.innerWidth <= 767;
      const smoothFactor = isMobile ? 0.1 : 0.32;
      const revealed = new Set<Element>();

      const liveNodes = () =>
        Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final) .rm-node, .rm-node--finish"))
          .filter((n) => n.offsetParent !== null && n.offsetWidth > 0);

      const buildPath = (): boolean => {
        const nodes = liveNodes();
        if (nodes.length < 2) return false;
        const cr = container.getBoundingClientRect();
        const W = container.clientWidth;
        const H = Math.max(container.scrollHeight, container.clientHeight);
        const pts = nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { x: r.left - cr.left + r.width / 2, y: r.top - cr.top + r.height / 2 };
        });
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const dy = c.y - p.y, bend = Math.max(60, dy * 0.42);
          d += ` C ${p.x.toFixed(1)} ${(p.y + bend).toFixed(1)},`
            + ` ${c.x.toFixed(1)} ${(c.y - bend).toFixed(1)},`
            + ` ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
        }
        svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
        svgEl.setAttribute("width", String(W)); svgEl.setAttribute("height", String(H));
        
        // Perf Fix 2.9: Cache totalLen and batch attribute updates
        for (const p of [pathBase, pathAccent, pathGlow]) {
          p.setAttribute("d", d);
        }
        totalLen = pathBase.getTotalLength();
        for (const p of [pathBase, pathAccent, pathGlow]) {
           p.style.strokeDasharray = String(totalLen);
        }
        return true;
      };

      const posTracer = (prog: number) => {
        if (!tracer || totalLen === 0) return;
        const cl = Math.max(0, Math.min(1, prog));
        const off = cl * totalLen;
        const pt = pathBase.getPointAtLength(off);
        const ptN = pathBase.getPointAtLength(Math.min(totalLen, off + 18));
        const ang = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * (180 / Math.PI);
        tracer.setAttribute("transform", `translate(${pt.x.toFixed(2)},${pt.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
        tracer.style.opacity = cl >= 0 && cl <= 1 ? "1" : "0";
      };

      const applyProgress = (prog: number, ns: HTMLElement[], VH: number) => {
        const currentIdx = Math.floor(prog * (ns.length - 1) + 0.1);
        rows.forEach((row, i) => {
          row.classList.toggle("is-current", i === currentIdx);
          row.classList.toggle("is-passed", i < currentIdx);
        });

        const off = totalLen * (1 - prog);
        const endReached = prog >= 0.995;
        pathBase.style.strokeDashoffset = "0"; // Base line fully drawn
        pathAccent.style.strokeDashoffset = String(Math.max(0, off - 26));
        pathGlow.style.strokeDashoffset = String(off);
        posTracer(prog);
        ns.forEach((n, i) => n.classList.toggle("rm-node--lit", prog >= i / Math.max(ns.length - 1, 1) - 0.02));

        pageRoot?.classList.toggle("is-end-reached", endReached);
        finalRow?.classList.toggle("is-end-reached", endReached);
        finalNode?.classList.toggle("rm-node--lit", endReached);
        if (tracer && endReached) tracer.style.opacity = "0";

        rowCards.forEach((card) => {
          if (card && !revealed.has(card)) {
            const r = card.getBoundingClientRect();
            if (r.top < VH * 0.92) {
              revealed.add(card);
              card.classList.add("is-revealed");
            }
          }
        });
      };

      const animateTracer = () => {
        tracerRafId = 0;
        if (totalLen === 0) return;
        const VH = window.innerHeight;
        const ns = liveNodes();
        if (ns.length < 2) return;
        renderProg += (targetProg - renderProg) * smoothFactor;
        if (Math.abs(targetProg - renderProg) < 0.0012) renderProg = targetProg;
        applyProgress(renderProg, ns, VH);
        // Perf Fix: Disable lerping animation on low-spec for instant response
        if (tier !== "lo" && Math.abs(targetProg - renderProg) >= 0.0012) {
          tracerRafId = requestAnimationFrame(animateTracer);
        }
      };

      const queueTracer = () => {
        if (tracerRafId) return;
        tracerRafId = requestAnimationFrame(animateTracer);
      };

      const rows = Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)"));
      const rowCards = rows.map((row) => row.querySelector<HTMLElement>(".rm-card"));

      const update = () => {
        if (totalLen === 0) return;
        const VH = window.innerHeight;
        const ns = liveNodes();
        if (ns.length < 2) return;
        const firstRect = ns[0].getBoundingClientRect();
        const lastRect = ns[ns.length - 1].getBoundingClientRect();
        const startY = firstRect.top + firstRect.height / 2;
        const endY = lastRect.top + lastRect.height / 2;
        const targetY = VH * 0.55;
        const span = Math.max(endY - startY, 1);
        targetProg = Math.max(0, Math.min(1, (targetY - startY) / span));
        if (!tracerRafId && Math.abs(renderProg - targetProg) < 0.0012) {
          renderProg = targetProg;
        }
        queueTracer();
      };

      const flush = () => { scheduled = false; if (needsBuild) needsBuild = !buildPath(); if (!needsBuild) update(); };
      const go = (rebuild = false) => { needsBuild = needsBuild || rebuild; if (scheduled) return; scheduled = true; rafId = requestAnimationFrame(flush); };
      Array.from(container.querySelectorAll<HTMLImageElement>("img"))
        .forEach((img) => { if (!img.complete) img.addEventListener("load", () => go(true)); });
      const onScroll = () => go(false);
      const onResize = () => go(true);
      const onLoad = () => go(true);
      const onViewportResize = () => go(true);
      const onViewportScroll = () => go(false);
      if ("ResizeObserver" in window) { ro = new ResizeObserver(() => go(true)); ro.observe(container); }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("load", onLoad, { passive: true });
      window.visualViewport?.addEventListener("resize", onViewportResize, { passive: true });
      window.visualViewport?.addEventListener("scroll", onViewportScroll, { passive: true });
      [120, 320, 720, 1200].forEach((delay) => {
        lateRebuildTimers.push(window.setTimeout(() => go(true), delay));
      });
      setTimeout(() => go(true), 180); go(true);
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (tracerRafId) cancelAnimationFrame(tracerRafId);
        lateRebuildTimers.forEach((timer) => window.clearTimeout(timer));
        ro?.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", onLoad);
        window.visualViewport?.removeEventListener("resize", onViewportResize);
        window.visualViewport?.removeEventListener("scroll", onViewportScroll);
      };
    };

    const cleanup = boot();
    return () => cleanup?.();
  });

  return (
    <div class="rm-page rm-page--day1" key="roadmap-day-1">
      <style>{`
        .rm-page--day1 {
          background: #020617;
          color: #f0fff2;
          position: relative;
        }
        .rm-page--day1::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: 
            linear-gradient(180deg, rgba(8, 22, 8, 0.52) 0%, rgba(12, 28, 12, 0.35) 18%, rgba(12, 28, 12, 0.46) 56%, rgba(6, 14, 6, 0.82) 100%),
            radial-gradient(circle at 50% 20%, rgba(99, 255, 44, 0.08), transparent 25%),
            radial-gradient(circle at 50% 80%, rgba(215, 255, 74, 0.06), transparent 28%);
          opacity: 1;
        }
        .rm-page--day1::after {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: rgba(6, 14, 6, 0.45);
          opacity: 1;
        }
        .rm-page--day1 .rm-event-glass {
          background: linear-gradient(145deg, rgba(14, 28, 14, 0.92), rgba(8, 18, 8, 0.86));
          border-color: rgba(99, 255, 44, 0.42);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(99,255,44,0.12), 0 22px 56px rgba(0,0,0,0.48);
          backdrop-filter: blur(12px);
        }
        .rm-page--day1 .rm-card {
           background: rgba(8, 16, 8, 0.94);
           backdrop-filter: blur(10px);
           border-color: rgba(99, 255, 44, 0.28);
           opacity: 0;
           will-change: transform, opacity;
        }
        .rm-row--left .rm-card.is-revealed {
          animation: rmCardRotateLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .rm-row--right .rm-card.is-revealed {
          animation: rmCardRotateRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes rmCardRotateLeft {
          0% { opacity: 0; transform: translateX(-60px) translateY(20px) scale(0.9) rotateY(-10deg); }
          100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotateY(0); }
        }
        @keyframes rmCardRotateRight {
          0% { opacity: 0; transform: translateX(60px) translateY(20px) scale(0.9) rotateY(10deg); }
          100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotateY(0); }
        }
        .rm-page--day1 .rm-dock__inner {
          border-color: rgba(99, 255, 44, 0.24);
          background: linear-gradient(180deg, rgba(10, 20, 8, 0.96), rgba(5, 12, 4, 0.92));
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(99, 255, 44, 0.08);
        }
        .rm-page--day1 .rm-dock__item.is-active {
          border-color: rgba(99, 255, 44, 0.42);
          background: linear-gradient(135deg, rgba(99, 255, 44, 0.2), rgba(99, 255, 44, 0.08));
          color: #d7ff4a;
          box-shadow: 0 10px 24px rgba(99, 255, 44, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .rm-page--day1 .rm-dock__status {
          border-color: rgba(99, 255, 44, 0.16);
          background: linear-gradient(180deg, rgba(22, 40, 12, 0.82), rgba(10, 20, 8, 0.74));
          color: #d7ff4a;
        }
        .rm-page--day1 .rm-dock__status-dot {
          background: #63ff2c;
          box-shadow: 0 0 10px rgba(99, 255, 44, 0.85);
        }
        .rm-page--day1 .rm-popup {
           background: rgba(8, 16, 8, 0.98);
           backdrop-filter: blur(12px);
           border-color: rgba(99, 255, 44, 0.35);
           box-shadow: 0 32px 84px rgba(0,0,0,0.64), 0 0 24px rgba(99,255,44,0.08);
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
        .rm-popup__inner {
          padding: 1.15rem !important;
        }
        .rm-popup__vitals {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin: 0.85rem 0;
          padding: 0.85rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 3px solid var(--rm-accent);
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.22);
        }
        .rm-popup__vital {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .rm-popup__vital-icon {
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          border-radius: 0.5rem;
          font-size: 0.85rem;
        }
        .rm-popup__vital-content {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }
        .rm-popup__vital-label {
          font-size: 0.5rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.42);
          text-transform: uppercase;
        }
        .rm-popup__vital-value {
          font-size: 0.78rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }
        .rm-popup__node-label {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--rm-accent);
          letter-spacing: 0.1em;
          opacity: 0.7;
        }
        .rm-popup__title {
          font-size: 1.15rem !important;
          margin: 0.4rem 0 !important;
          line-height: 1.3 !important;
        }
        .rm-popup__stats {
          margin-top: 0.75rem !important;
          gap: 0.5rem !important;
        }
        .rm-popup__stat {
          padding: 0.45rem 0.6rem !important;
          border-radius: 0.6rem !important;
        }
        .rm-popup__stat-l {
          font-size: 0.55rem !important;
        }
        .rm-popup__stat-v {
          font-size: 0.75rem !important;
        }
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
        .rm-scene-gallery {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
        }
        .rm-scene-art {
          position: absolute; inset: 0; overflow: hidden; will-change: transform, opacity; transition: opacity 180ms linear, transform 180ms linear;
        }
        .rm-scene-art::after {
          content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6, 14, 6, 0.42) 0%, rgba(6, 14, 6, 0.18) 24%, rgba(6, 14, 6, 0.18) 68%, rgba(6, 14, 6, 0.52) 82%, rgba(6, 14, 6, 1) 100%);
        }
        .rm-scene-art img {
          display: block; width: 100%; height: 100vh; object-fit: cover; filter: saturate(0.85) contrast(1.1) brightness(0.42); transform: scale(1.05);
        }

        .rm-page--day1 .rm-end-popup {
          position: absolute; right: calc(100% + 0.95rem); top: 50%; transform: translate(-12px, -50%) scale(0.92); min-width: 12rem; max-width: 13.5rem; padding: 0.75rem 0.9rem; border-radius: 1rem; border: 1px solid rgba(215,255,74,0.24); background: linear-gradient(135deg, rgba(215,255,74,0.1), rgba(99,255,44,0.06)), rgba(8,16,10,0.94); box-shadow: 0 18px 42px rgba(0,0,0,0.42), 0 0 24px rgba(99,255,44,0.12); opacity: 0; pointer-events: none; transition: opacity 320ms ease, transform 380ms cubic-bezier(0.22, 1, 0.36, 1); z-index: 4;
        }
        .rm-page--day1 .rm-end-popup::after {
          content: ""; position: absolute; right: -0.45rem; top: 50%; width: 0.9rem; height: 0.9rem; transform: translateY(-50%) rotate(45deg); border-right: 1px solid rgba(215,255,74,0.24); border-bottom: 1px solid rgba(215,255,74,0.24); background: rgba(8,16,10,0.96);
        }
        .rm-page--day1 .rm-end-popup__label {
          display: inline-flex; align-items: center; gap: 0.38rem; color: #d7ff4a; font-size: 0.56rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .rm-page--day1 .rm-end-popup__label::before {
          content: ""; width: 0.42rem; height: 0.42rem; border-radius: 999px; background: #d7ff4a; box-shadow: 0 0 10px rgba(99,255,44,0.8);
        }
        .rm-page--day1 .rm-end-popup p { margin: 0.55rem 0 0; color: rgba(240,255,210,0.92); font-size: 0.76rem; line-height: 1.45; }
        .rm-page--day1.is-end-reached .rm-end-popup, .rm-page--day1 .rm-row--final.is-end-reached .rm-end-popup { opacity: 1; transform: translate(0, -50%) scale(1); }
        .rm-page--day1.is-end-reached .rm-row--final .rm-node--finish { box-shadow: 0 0 0 4px rgba(215,255,74,0.16), 0 0 28px rgba(99,255,44,0.52), 0 0 72px rgba(99,255,44,0.22), 0 24px 50px rgba(0,0,0,0.44); }
        .rm-page--day1 .rm-timeline { position: relative; }
        .rm-page--day1 .rm-timeline__svg { overflow: visible; position: absolute; pointer-events: none; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; }
        .rm-page--day1 .rm-timeline__path--glow {
          display: none !important;
        }
        .rm-page--day1 .rm-timeline__path--base {
          stroke: rgba(16, 255, 112, 0.15) !important;
          stroke-width: 4 !important;
        }
        .rm-page--day1 .rm-timeline__path--accent {
          stroke: #ffffff !important;
          stroke-width: 3 !important;
          opacity: 1 !important;
          filter: drop-shadow(0 0 12px rgba(99, 255, 44, 0.8)) !important;
        }
        .rm-page--day1 .rm-node__center-dot {
          position: absolute;
          inset: 50% auto auto 50%;
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 999px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .rm-page--day1 #rm-tracer-shell {
          display: none !important;
        }
        .rm-page--day1 #rm-tracer-arrow {
          fill: #ffffff !important;
          filter: drop-shadow(0 0 10px rgba(99, 255, 44, 1)) !important;
        }

        .rm-timeline__tracer {
          display: block;
        }

        @media (max-width: 767px) {
          .rm-page--day1 .rm-end-popup { left: calc(100% + 0.95rem) !important; right: auto !important; top: 50% !important; bottom: auto !important; transform: translate(12px, -50%) scale(0.92) !important; min-width: 12rem !important; padding: 0.62rem 0.72rem !important; z-index: 10 !important; }
          .rm-page--day1 .rm-end-popup::after { left: -0.45rem !important; right: auto !important; top: 50% !important; bottom: auto !important; transform: translateY(-50%) rotate(45deg) !important; border-right: none !important; border-bottom: 1px solid rgba(215,255,74,0.24) !important; border-left: 1px solid rgba(215,255,74,0.24) !important; border-top: none !important; }
          .rm-page--day1.is-end-reached .rm-end-popup, .rm-page--day1 .rm-row--final.is-end-reached .rm-end-popup { transform: translate(0, -50%) scale(1) !important; }
        }
        .rm-row--final { margin-bottom: 0 !important; }
        .rm-timeline { padding-bottom: 0 !important; }
      `}</style>

      <div class="rm-scene-gallery">
        <div class="rm-scene-art rm-scene-art--i1">
          <img src="/roadmap-day1/i1.webp" alt="Scene 1" />
        </div>
      </div>

      <div class="rm-page__aurora rm-page__aurora--left" />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">Timeline</span>
              <h1 class="rm-section__title">Day 1 Event Flow</h1>
              <p class="rm-section__copy">Tap any card to reveal its event, venue, timing, and registration details.</p>
            </div>
            <div class="rm-event-glass">
              <span class="rm-event-glass__count">{String(EVENTS.length).padStart(2, "0")}</span>
              <span class="rm-event-glass__label">Events<br />Today</span>
              <span class="rm-event-glass__dot" />
            </div>
          </div>

          <div id="rm-timeline" class="rm-timeline">
            <svg id="rm-line-svg" class="rm-timeline__svg" aria-hidden="true">
              <path id="rm-line-base" class="rm-timeline__path rm-timeline__path--base" fill="none" />
              <path id="rm-line-glow" class="rm-timeline__path rm-timeline__path--glow" fill="none" />
              <path id="rm-line-accent" class="rm-timeline__path rm-timeline__path--accent" fill="none" />
              <g id="rm-tracer" class="rm-timeline__tracer" style="opacity:0;">
                <circle id="rm-tracer-shell" r="18" fill="rgba(99, 255, 44, 0.3)" />
                <path id="rm-tracer-arrow" d="M -12,-9 L 16,0 L -12,9 C -8,4 -8,-4 -12,-9 Z" />
                <circle r="6" fill="#fff" opacity="0.8" />
              </g>
            </svg>

            {EVENTS.map((event, index) => {
              const meta = CAT[event.cat];
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              const isActive = false;
              const canRegister = Boolean(event.regLink);
              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>
                  <div class="rm-row__side rm-row__side--left">
                    {side === "left" ? (
                      <>
                        <EventCard ev={event} meta={meta} isActive={isActive} canRegister={canRegister} />
                        {isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} inlineMobile />}
                      </>
                    ) : (
                      isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} />
                    )}
                  </div>
                  <div class={["rm-row__center", `rm-row__center--${side === "left" ? "r" : "l"}`]}>
                    <div
                      class="rm-node"
                      style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
                      data-snake-node=""
                    >
                      <span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__impact" />
                      <span
                        class="rm-node__center-dot"
                        aria-hidden="true"
                        style={`background:${meta.color}; box-shadow: 0 0 10px rgba(${meta.rgb}, 0.45);`}
                      />
                      <span class="rm-node__time">{event.time}</span>
                    </div>
                  </div>
                  <div class="rm-row__side rm-row__side--right">
                    {side === "right" ? (
                      <>
                        <EventCard ev={event} meta={meta} isActive={isActive} canRegister={canRegister} />
                        {isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} inlineMobile />}
                      </>
                    ) : (
                      isActive && <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} />
                    )}
                  </div>
                </div>
              );
            })}

            <div class="rm-row rm-row--final">
              <div class="rm-row__side" />
              <div class="rm-row__center">
                <div class="rm-node rm-node--finish">
                  <span class="rm-node__pulse" /><span class="rm-node__halo" />
                  <span class="rm-node__code">END</span>
                </div>
              </div>
              <div class="rm-row__side">
                <div class="rm-end-popup" aria-live="polite">
                  <div class="rm-end-popup__label">Mission Complete</div>
                  <p>Day 1 systems standby. Transmission resumes at dawn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="rm-dock">
        <div class="rm-dock__inner">
          <Link href="/roadmap/day1" class="rm-dock__item is-active">Day 1</Link>
          <Link href="/roadmap/day2" class="rm-dock__item">Day 2</Link>
          <Link href="/roadmap/day3" class="rm-dock__item">Day 3</Link>
          <span class="rm-dock__status">
            <span class="rm-dock__status-dot" />
            OMNITRIX THEME
          </span>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Roadmap: Day 1 | THETA 2026",
  meta: [
    { name: "description", content: "Explore the live event timeline for Day 1 of THETA 2026." },
  ],
};
