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

/* ── Spider-Man event data ── */
const EVENTS: EventData[] = [
  { id: 1, time: "09:00 AM", endTime: "10:00 AM", title: "With Great Power Briefing",
    subtitle: "Final day — the city needs its heroes", venue: "Main Auditorium, Block A", cat: "opening",
    fee: "Free", team: "Open to all", prize: "Final badge",
    img: "/spidy/spidy-web.png",
    tags: ["Hero sync", "Web of plans", "City update"],
    desc: "The final day signal fires across the skyline. Daily highlights, prize-pool reveals, and a full-hero assembly before the grand curtain of Theta 2026 drops." },
  { id: 2, time: "10:00 AM", endTime: "01:00 PM", title: "Spider-Sense Code Sprint",
    subtitle: "Your spidey-sense tingles on every bug", venue: "Galvan Prime Lab, Block C", cat: "tech",
    fee: "Rs 100 / team", team: "2 to 3 members", prize: "Rs 15,000",
    img: "/spidy/spidy-web.png",
    tags: ["3-hour sprint", "Live leaderboard", "Bug hunt"],
    desc: "Your spider-sense fires on every test case. Solve algorithmic and AI challenges under a blazing live scoreboard — swing from problem to problem without touching the ground." },
  { id: 3, time: "10:00 AM", endTime: "12:00 PM", title: "S.H.I.E.L.D. Tech Workshop",
    subtitle: "Hands-on cyber & systems lab", venue: "Plumber HQ, Block D", cat: "workshop",
    fee: "Rs 150 / head", team: "Individual", prize: "Shield cert + kit",
    img: "/spidy/spidy-web.png",
    tags: ["Live demo", "Mentor-led", "Gadget kit"],
    desc: "S.H.I.E.L.D. clearance granted. A guided session on cyber defense, AI-assisted security, and real espionage tactics — straight from the helicarrier files." },
  { id: 4, time: "02:00 PM", endTime: "03:30 PM", title: "Daily Bugle Trivia Blitz",
    subtitle: "J. Jonah Jameson hosts the rapid quiz", venue: "Sector 7G, Block B", cat: "quiz",
    fee: "Rs 50 / team", team: "2 members", prize: "Rs 5,000",
    img: "/spidy/spidy-web.png",
    tags: ["5 rounds", "30-second clock", "Buzzer shot"],
    desc: "Extra! Extra! Five brutal quiz rounds across tech, science, and current affairs — Jameson demands answers fast. Hit the buzzer before your rival swings in first." },
  { id: 5, time: "03:30 PM", endTime: "05:00 PM", title: "Oscorp Startup Pitch Stage",
    subtitle: "Convince the boardroom before it goes rogue", venue: "Innovation Hall, Block A", cat: "tech",
    fee: "Rs 200 / team", team: "2 to 4 members", prize: "Rs 20,000 + mentoring",
    img: "/spidy/spidy-web.png",
    tags: ["VC panel", "5-minute pitch", "Feedback web"],
    desc: "Pitch your startup idea to the Oscorp board before they turn villain. Sharp story, crisp demo, real pressure — walk out a legend or swing away in defeat." },
  { id: 6, time: "05:00 PM", endTime: "06:30 PM", title: "Web-Slinger Agility Run",
    subtitle: "Fast-paced rooftop obstacle challenge", venue: "Open Arena, Ground Floor", cat: "fun",
    fee: "Free", team: "Pairs", prize: "Trophies + web-goodies",
    img: "/spidy/spidy-web.png",
    tags: ["Obstacle rooftop", "Pair sync", "Reflex shot"],
    desc: "Swing, dodge, and coordinate like the Spectacular Spider-Man. A movement-based campus challenge where communication and reflexes beat raw speed every time." },
  { id: 7, time: "07:00 PM", endTime: "09:00 PM", title: "The Amazing Cultural Night",
    subtitle: "The city's grand finale stage show", venue: "Open-Air Amphitheatre", cat: "cultural",
    fee: "Free", team: "Open to all", prize: "Grand festival close",
    img: "/spidy/spidy-web.png",
    tags: ["Live band", "Dance rooftop", "Comedy arc"],
    desc: "The Amazing Night — live music, campus performances, and a high-energy curtain call that closes the Theta 2026 saga. With great fest comes great memories." },
];

/* ── Spider-Man CAT palette — red / blue / purple / amber / teal / pink ── */
const CAT: Record<Cat, CatMeta> = {
  opening:  { label: "Opening",  short: "OP", color: "#ff2020", rgb: "255,32,32"    },
  tech:     { label: "Tech",     short: "TK", color: "#4488ff", rgb: "68,136,255"   },
  workshop: { label: "Workshop", short: "WS", color: "#bb77ff", rgb: "187,119,255"  },
  quiz:     { label: "Quiz",     short: "QZ", color: "#ffaa33", rgb: "255,170,51"   },
  fun:      { label: "Fun",      short: "FN", color: "#66ddcc", rgb: "102,221,204"  },
  cultural: { label: "Cultural", short: "CL", color: "#ff88aa", rgb: "255,136,170"  },
};

/* ─── Popup Panel — same structure as Day 1 ────────────────────────────── */
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
        <span class="rm-popup__time">{ev.time} – {ev.endTime}</span>
      </div>
      <p class="rm-popup__title">{ev.title}</p>
      <p class="rm-popup__venue">📍 {ev.venue}</p>
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

/* ─── Event Card — same structure as Day 1 ─────────────────────────────── */
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
          <span class="rm-card__toggle">{isActive ? "Retreat" : "Swing →"}</span>
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

/* ─── Decorative Web — fills the empty side of the timeline ─────── */
const DecorativeWeb = component$<{ side: "left" | "right" }>(({ side }) => (
  <div class={["rm-deco-web", `rm-deco-web--${side}`]} data-parallax="0.06">
    <img src="/spidy/spidy-web.png" alt="" class="rm-deco-web__img" width={400} height={400} />
    <div class="rm-deco-web__glow" />
  </div>
));

/* ── Spider-web canvas — red/blue particles ─────────────────────────────── */


export default component$(function Day3Roadmap() {
  const activeEventId = useSignal<number | null>(null);

  useVisibleTask$(() => {
    /* ── Set Spider-Man theme on entire site ── */
    document.body.setAttribute("data-theme", "spider");
    return () => { document.body.removeAttribute("data-theme"); };
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

      const pageRoot   = document.querySelector(".rm-page--sp")    as HTMLElement     | null;
      const container  = document.getElementById("rm-timeline")    as HTMLElement     | null;
      const svgEl      = document.getElementById("rm-line-svg")    as SVGSVGElement   | null;
      const pathBase   = document.getElementById("rm-line-base")   as SVGPathElement  | null;
      const pathAccent = document.getElementById("rm-line-accent") as SVGPathElement  | null;
      const pathGlow   = document.getElementById("rm-line-glow")   as SVGPathElement  | null;
      const tracer     = document.getElementById("rm-tracer")      as SVGGElement     | null;
      if (!container || !svgEl || !pathBase || !pathAccent || !pathGlow) return;
      const finalRow   = container.querySelector(".rm-row--final") as HTMLElement | null;
      const finalNode  = finalRow?.querySelector(".rm-node--finish") as HTMLElement | null;

      let totalLen = 0, rafId = 0, scheduled = false, needsBuild = true;
      let ro: ResizeObserver | undefined;
      const revealed = new Set<Element>();

      const liveNodes = () =>
        Array.from(container.querySelectorAll<HTMLElement>("[data-snake-node]"))
             .filter((n) => n.offsetParent !== null && n.offsetWidth > 0);

      const buildPath = (): boolean => {
        const nodes = liveNodes();
        if (nodes.length < 2) return false;
        const cr = container.getBoundingClientRect();
        const W  = container.clientWidth;
        const H  = Math.max(container.scrollHeight, container.clientHeight);
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
        for (const p of [pathBase, pathAccent, pathGlow]) {
          p.setAttribute("d", d); p.style.strokeDasharray = String(p.getTotalLength());
        }
        totalLen = pathBase.getTotalLength();
        return true;
      };

      const posTracer = (prog: number) => {
        if (!tracer || totalLen === 0) return;
        const cl = Math.max(0, Math.min(1, prog));
        const off = cl * totalLen;
        const pt  = pathBase.getPointAtLength(off);
        const ptN = pathBase.getPointAtLength(Math.min(totalLen, off + 18));
        const ang = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * (180 / Math.PI);
        tracer.setAttribute("transform", `translate(${pt.x.toFixed(2)},${pt.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
        tracer.style.opacity = cl > 0.005 && cl < 0.998 ? "1" : "0";
      };

      const rows = Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)"));

      const update = () => {
        if (totalLen === 0) return;
        const VH   = window.innerHeight;
        const ns = liveNodes();
        if (ns.length < 2) return;
        const firstRect = ns[0].getBoundingClientRect();
        const lastRect  = ns[ns.length - 1].getBoundingClientRect();
        const startY = firstRect.top + firstRect.height / 2;
        const endY   = lastRect.top + lastRect.height / 2;
        const span   = Math.max(1, endY - startY);
        const focusY = VH * 0.55;
        const prog   = Math.max(0, Math.min(1, (focusY - startY) / span));
        const off  = totalLen * (1 - prog);
        pathBase.style.strokeDashoffset   = String(off);
        pathAccent.style.strokeDashoffset = String(Math.max(0, off - 26));
        pathGlow.style.strokeDashoffset   = String(off);
        posTracer(prog);
        ns.forEach((n, i) => n.classList.toggle("rm-node--lit", prog >= i / Math.max(ns.length - 1, 1) - 0.02));
        const endReached = prog >= 0.97;
        pageRoot?.classList.toggle("is-end-reached", endReached);
        finalRow?.classList.toggle("is-end-reached", endReached);
        finalNode?.classList.toggle("rm-node--lit", endReached);
        if (tracer) tracer.style.opacity = endReached ? "0" : tracer.style.opacity;
        rows.forEach((row, idx) => {
          const card   = row.querySelector<HTMLElement>(".rm-card");
          const isLeft = row.classList.contains("rm-row--left");
          if (card && !revealed.has(card)) {
            const r = card.getBoundingClientRect();
            if (r.top < VH * 0.9) {
              revealed.add(card);
              if (gsap) {
                gsap.fromTo(card,
                  { opacity: 0, x: isLeft ? -70 : 70, y: 28, scale: 0.88, rotateY: isLeft ? -14 : 14 },
                  { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0,
                    duration: 0.85, ease: "back.out(1.4)", delay: idx * 0.04, clearProps: "transform" });
              } else { card.style.opacity = "1"; card.style.transform = "none"; }
            }
          }
        });
      };

      const flush = () => { scheduled = false; if (needsBuild) needsBuild = !buildPath(); if (!needsBuild) update(); };
      const go    = (rebuild = false) => { needsBuild = needsBuild || rebuild; if (scheduled) return; scheduled = true; rafId = requestAnimationFrame(flush); };

      Array.from(container.querySelectorAll<HTMLImageElement>("img"))
           .forEach((img) => { if (!img.complete) img.addEventListener("load", () => go(true)); });
      if ("ResizeObserver" in window) { ro = new ResizeObserver(() => go(true)); ro.observe(container); }
      window.addEventListener("scroll", () => go(false), { passive: true });
      window.addEventListener("resize", () => go(true),  { passive: true });
      setTimeout(() => go(true), 180); go(true);

      container.querySelectorAll<HTMLElement>(".rm-node").forEach((n) => {
        n.addEventListener("mouseenter", () => n.classList.add("rm-node--hovered"));
        n.addEventListener("mouseleave", () => n.classList.remove("rm-node--hovered"));
      });

      if (gsap) {
        const hdr = document.querySelector(".rm-section__header");
        if (hdr) gsap.fromTo(hdr, { opacity: 0, y: -36 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" });

        /* Interactive Web Parallax */
        const webs = document.querySelectorAll("[data-parallax]");
        window.addEventListener("mousemove", (e) => {
          const { clientX: x, clientY: y } = e;
          const xc = window.innerWidth / 2;
          const yc = window.innerHeight / 2;
          webs.forEach((web) => {
            const factor = parseFloat(web.getAttribute("data-parallax") || "0.05");
            const dx = (x - xc) * factor;
            const dy = (y - yc) * factor;
            gsap.to(web, { x: dx, y: dy, duration: 2, ease: "power2.out" });
          });
        });
      }
      return () => { if (rafId) cancelAnimationFrame(rafId); ro?.disconnect(); };
    };

    let cleanup: (() => void) | undefined;
    boot().then((fn) => { cleanup = fn as any; });
    return () => cleanup?.();
  });

  const toggleEvent = $((id: number) => {
    activeEventId.value = activeEventId.value === id ? null : id;
  });

  return (
    <div class="rm-page rm-page--sp" key="roadmap-day-3">

      {/* ── Spider-Man page-specific styles ── */}
      <style>{`
        .rm-page--sp {
          background: linear-gradient(175deg, #0a0005 0%, #130010 25%, #0d0018 55%, #050008 100%);
        }
        .rm-page--sp .rm-page__aurora--left {
          background: radial-gradient(ellipse at 0% 30%, rgba(200,15,15,0.16) 0%, transparent 65%);
        }
        .rm-page--sp .rm-page__aurora--right {
          background: radial-gradient(ellipse at 100% 60%, rgba(30,60,220,0.12) 0%, rgba(180,30,30,0.07) 45%, transparent 70%);
        }
        .rm-page--sp .rm-pill {
          background: linear-gradient(135deg, rgba(220,20,20,0.2), rgba(30,80,220,0.14));
          border-color: rgba(220,20,20,0.45);
          color: #ff4040;
        }
        .rm-page--sp .rm-section__title {
          background: linear-gradient(135deg, #ff2020 0%, #ff7070 30%, #fff 55%, #4488ff 80%, #aa44ff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        /* Snake line gradients - Spider-Verse Red Only */
        #rm-grad-line stop:nth-child(1) { stop-color: #ff0000; }
        #rm-grad-line stop:nth-child(2) { stop-color: #880000; }
        #rm-grad-line stop:nth-child(3) { stop-color: #330000; }
        #rm-grad-core stop:nth-child(1) { stop-color: #ffffff; }
        #rm-grad-core stop:nth-child(2) { stop-color: #ff3333; }
        #rm-grad-core stop:nth-child(3) { stop-color: #ff0000; }

        /* Web Backdrop specific animations and glow */
        .rm-web-img {
          transform-origin: center;
          animation: sp-web-sway 18s ease-in-out infinite alternate;
          transition: filter 0.6s ease;
        }

        .rm-web-img--glow {
          opacity: 0.15;
          filter: drop-shadow(0 0 12px rgba(255, 32, 32, 0.4));
          animation: sp-web-sway 18s ease-in-out infinite alternate, sp-web-glow 10s ease-in-out infinite alternate !important;
        }

        @keyframes sp-web-sway {
          0% { rotate: -2deg; scale: 1; }
          100% { rotate: 2deg; scale: 1.05; }
        }

        @keyframes sp-web-glow {
          0%, 100% {
            opacity: 0.1;
            filter: drop-shadow(0 0 8px rgba(255, 32, 32, 0.3));
          }
          50% {
            opacity: 0.25;
            filter: drop-shadow(0 0 25px rgba(255, 32, 32, 0.6)) drop-shadow(0 0 40px rgba(68, 136, 255, 0.3));
          }
        }

        /* Minimal buddy glow - soft radial highlights */
        .rm-web-glow-point {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,32,32,0.1) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(40px);
          animation: sp-point-float 15s ease-in-out infinite alternate;
        }
        @keyframes sp-point-float {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(20px, 40px) scale(1.2); opacity: 0.6; }
        }

        /* Decorative Web filling empty sides */
        .rm-deco-web {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 320px;
          padding: 2rem;
          pointer-events: none;
        }
        .rm-deco-web--left { justify-content: flex-end; padding-right: 1.5rem; }
        .rm-deco-web--right { justify-content: flex-start; padding-left: 1.5rem; }

        .rm-deco-web__img {
          width: clamp(140px, 20vw, 240px);
          height: auto;
          opacity: 0.12;
          filter: drop-shadow(0 0 12px rgba(255, 32, 32, 0.4));
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translateY(15px);
          animation: sp-web-spin-in 1.4s ease-out forwards;
        }
        .rm-row:hover .rm-deco-web__img {
          opacity: 0.28;
          filter: drop-shadow(0 0 25px rgba(255, 32, 32, 0.6)) drop-shadow(0 0 40px rgba(68, 136, 255, 0.4));
          transform: scale(1.1) rotate(5deg);
        }

        .rm-deco-web--left .rm-deco-web__img { rotate: -15deg; }
        .rm-deco-web--right .rm-deco-web__img { rotate: 15deg; }

        .rm-deco-web__glow {
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(255, 32, 32, 0.12), transparent 70%);
          filter: blur(20px);
          z-index: -1;
        }

        @keyframes sp-web-spin-in {
          0% { opacity: 0; transform: translateY(40px) rotate(-10deg) scale(0.8); }
          100% { opacity: 0.12; transform: translateY(0) rotate(0) scale(1); }
        }
        .rm-page--sp .rm-end-popup {
          position: absolute;
          right: calc(100% + 0.95rem);
          top: 50%;
          min-width: 13.5rem;
          max-width: 15.5rem;
          padding: 0.9rem 1rem;
          border-radius: 1.1rem;
          border: 1px solid rgba(255, 82, 82, 0.34);
          background:
            linear-gradient(180deg, rgba(42, 14, 20, 0.96), rgba(17, 11, 20, 0.94)),
            radial-gradient(circle at top, rgba(255, 72, 72, 0.16), transparent 60%);
          box-shadow:
            0 22px 46px rgba(0, 0, 0, 0.42),
            0 0 0 1px rgba(255, 82, 82, 0.08) inset,
            0 0 24px rgba(255, 72, 72, 0.18);
          backdrop-filter: blur(10px);
          pointer-events: none;
          opacity: 0;
          transform: translate(-12px, -50%) scale(0.92);
          transform-origin: right center;
          transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 7;
        }
        .rm-page--sp .rm-end-popup::after {
          content: "";
          position: absolute;
          right: -0.45rem;
          top: 50%;
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 0.18rem;
          background: rgba(42, 14, 20, 0.96);
          border-top: 1px solid rgba(255, 82, 82, 0.28);
          border-right: 1px solid rgba(255, 82, 82, 0.28);
          transform: translateY(-50%) rotate(45deg);
        }
        .rm-page--sp .rm-end-popup__label {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffb8b8;
        }
        .rm-page--sp .rm-end-popup__label::before {
          content: "";
          width: 0.52rem;
          height: 0.52rem;
          border-radius: 999px;
          background: #ff3b3b;
          box-shadow: 0 0 12px rgba(255, 59, 59, 0.85);
        }
        .rm-page--sp .rm-end-popup p {
          margin: 0.55rem 0 0;
          color: rgba(255, 239, 239, 0.94);
          font-size: 0.76rem;
          line-height: 1.45;
        }
        .rm-page--sp.is-end-reached .rm-end-popup,
        .rm-page--sp .rm-row--final.is-end-reached .rm-end-popup {
          opacity: 1;
          transform: translate(0, -50%) scale(1);
        }
        .rm-page--sp.is-end-reached .rm-row--final .rm-node--finish {
          box-shadow:
            0 0 0 4px rgba(255, 82, 82, 0.14),
            0 0 28px rgba(255, 72, 72, 0.44),
            0 0 72px rgba(68, 136, 255, 0.16),
            0 24px 50px rgba(0, 0, 0, 0.44);
        }
        @media (max-width: 767px) {
          .rm-page--sp .rm-end-popup {
            left: 50%;
            right: auto;
            top: auto;
            bottom: calc(100% + 0.8rem);
            transform: translate(-50%, 14px) scale(0.92);
            min-width: 10rem;
            max-width: 12rem;
            padding: 0.68rem 0.8rem;
          }
          .rm-page--sp .rm-end-popup::after {
            left: 50%;
            right: auto;
            top: auto;
            bottom: -0.45rem;
            transform: translateX(-50%) rotate(45deg);
          }
          .rm-page--sp.is-end-reached .rm-end-popup,
          .rm-page--sp .rm-row--final.is-end-reached .rm-end-popup {
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>

      <div class="rm-web-backdrop" style="position: absolute; height: 100%; width: 100%; top: 0; left: 0; overflow: hidden;">
        {/* Glow Buds - Minimal ambient glows */}
        <div class="rm-web-glow-point" style="top: 10%; left: 20%; animation-delay: 0s;" />
        <div class="rm-web-glow-point" style="top: 40%; left: 80%; animation-delay: -2s; background: radial-gradient(circle, rgba(68,136,255,0.08) 0%, transparent 70%);" />
        <div class="rm-web-glow-point" style="top: 70%; left: 10%; animation-delay: -5s;" />
        <div class="rm-web-glow-point" style="top: 1500px; left: 50%;" />
        <div class="rm-web-glow-point" style="top: 2800px; left: 70%; background: radial-gradient(circle, rgba(68,136,255,0.08) 0%, transparent 70%);" />

        {/* Top 100vh - 3 webs */}
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:2%; left:5%; opacity:0.12; scale:1.5;" data-parallax="0.04" />
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:15%; left:70%; scale:0.8; rotate:45deg;" data-parallax="0.07" />
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:40%; left:-5%; scale:1.2; rotate:-15deg;" data-parallax="0.03" />

        {/* Distributed webs for scrolling */}
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:1200px; left:80%; scale:1.1; rotate:90deg; opacity:0.1;" data-parallax="0.05" />
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:1500px; left:15%; scale:0.9; rotate:180deg; opacity:0.08;" data-parallax="0.06" />
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:2200px; left:60%; scale:1.3; rotate:-45deg; opacity:0.12;" data-parallax="0.04" />
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:2600px; left:5%; scale:1.0; rotate:15deg; opacity:0.09;" data-parallax="0.05" />
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:3100px; left:75%; scale:1.4; rotate:160deg; opacity:0.1;" data-parallax="0.07" />
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:3500px; left:25%; scale:0.8; rotate:220deg; opacity:0.11;" data-parallax="0.03" />
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:30%; left:45%; scale:0.6; rotate:10deg; opacity:0.07;" data-parallax="0.08" />
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:65%; left:85%; scale:1.1; opacity:0.1;" data-parallax="0.05" />
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:85%; left:10%; scale:1.5; rotate:-30deg; opacity:0.12;" data-parallax="0.04" />
        <img src="/spidy/spidy-web.png" class="rm-web-img" style="top:50%; left:80%; scale:0.9; opacity:0.06;" data-parallax="0.06" />
        <img src="/spidy/spidy-web.png" class="rm-web-img rm-web-img--glow" style="top:95%; left:60%; scale:1.2; opacity:0.08;" data-parallax="0.03" />
      </div>
      <div class="rm-page__aurora rm-page__aurora--left"  />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">

          {/* Header */}
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">🕷️ Spider-Verse</span>
              <h1 class="rm-section__title">Day 3 — The Amazing Final Day!</h1>
              <p class="rm-section__copy">Tap any card to reveal its event, team &amp; entry details. THWIP!</p>
            </div>
            <div class="rm-event-glass">
              <span class="rm-event-glass__count">{String(EVENTS.length).padStart(2, "0")}</span>
              <span class="rm-event-glass__label">Events<br />Today</span>
              <span class="rm-event-glass__dot" />
            </div>
          </div>

          {/* Timeline */}
          <div id="rm-timeline" class="rm-timeline">

            {/* SVG snake line */}
            <svg id="rm-line-svg" class="rm-line-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="rm-grad-line" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#ff2020" />
                  <stop offset="55%"  stop-color="#4488ff" />
                  <stop offset="100%" stop-color="#aa44ff" />
                </linearGradient>
                <linearGradient id="rm-grad-core" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#fff"    />
                  <stop offset="50%"  stop-color="#ff4040" />
                  <stop offset="100%" stop-color="#4488ff" />
                </linearGradient>
                <filter id="rm-glow-f" x="-40%" y="-10%" width="180%" height="120%">
                  <feGaussianBlur stdDeviation="10" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="rm-arrow-f" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="7" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="rm-tracer-fill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stop-color="#fff"    stop-opacity="1"  />
                  <stop offset="45%"  stop-color="#ff2020" stop-opacity="0.9"/>
                  <stop offset="100%" stop-color="#4488ff" stop-opacity="0"  />
                </radialGradient>
              </defs>
              <path id="rm-line-glow"   class="rm-line-glow"   fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-base"   class="rm-line-base"   fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-accent" class="rm-line-accent" fill="none" stroke="url(#rm-grad-core)" filter="url(#rm-glow-f)" />
              <g id="rm-tracer" style="opacity:0;will-change:transform;" filter="url(#rm-arrow-f)">
                <circle class="rm-tracer-ring rm-tracer-ring--outer" cx="0" cy="0" r="18"
                  fill="none" stroke="rgba(255,0,0,0.3)" stroke-width="1.2" />
                <circle class="rm-tracer-ring rm-tracer-ring--mid" cx="0" cy="0" r="11"
                  fill="none" stroke="rgba(255,50,50,0.5)" stroke-width="1.2" />
                <circle cx="0" cy="0" r="7" fill="url(#rm-tracer-fill)" />
                <polygon id="rm-tracer-arrow" points="18,0 5,-6 5,6" fill="#ff0000" />
                <line x1="-4" y1="-3" x2="-18" y2="-7" stroke="rgba(255,0,0,0.6)" stroke-width="1.8" stroke-linecap="round" />
                <line x1="-4" y1="3"  x2="-18" y2="7"  stroke="rgba(255,0,0,0.6)" stroke-width="1.8" stroke-linecap="round" />
              </g>
            </svg>

            {/* Event rows */}
            {EVENTS.map((event, index) => {
              const meta = CAT[event.cat];
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              const isActive    = activeEventId.value === event.id;
              const canRegister = event.cat !== "opening" && event.cat !== "cultural";
              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>
                  <div class="rm-row__side rm-row__side--left">
                    {side === "left"
                      ? <EventCard ev={event} meta={meta} isActive={isActive} side="left" onToggle$={() => toggleEvent(event.id)} />
                      : isActive ? <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} /> : <DecorativeWeb side="left" />}
                  </div>
                  <div class={["rm-row__center", `rm-row__center--${side === "left" ? "r" : "l"}`]}>
                    <div class="rm-node"
                      style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
                      data-snake-node="">
                      <span class="rm-node__pulse"  />
                      <span class="rm-node__halo"   />
                      <span class="rm-node__impact" />
                      <span class="rm-node__code">{meta.short}</span>
                      <span class="rm-node__time">{event.time}</span>
                    </div>
                  </div>
                  <div class="rm-row__side rm-row__side--right">
                    {side === "right"
                      ? <EventCard ev={event} meta={meta} isActive={isActive} side="right" onToggle$={() => toggleEvent(event.id)} />
                      : isActive ? <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} /> : <DecorativeWeb side="right" />}
                  </div>
                </div>
              );
            })}

            {/* Finish row */}
            <div class="rm-row rm-row--final">
              <div class="rm-row__side rm-row__side--left" />
              <div class="rm-row__center rm-row__center--c">
                <div class="rm-node rm-node--finish" data-snake-node="">
                  <span class="rm-node__pulse" />
                  <span class="rm-node__halo"  />
                  <span class="rm-node__code">END</span>
                  <span class="rm-node__time">09:00 PM</span>
                  <div class="rm-end-popup">
                    <span class="rm-end-popup__label">City Secured</span>
                    <p>Day 3 complete. The final swing is done and Theta 2026 wraps strong.</p>
                  </div>
                </div>
              </div>
              <div class="rm-row__side rm-row__side--right">
                <div class="rm-end-card">
                  <span class="rm-pill">🕷️ The End</span>
                  <h3>Day 3 completed.</h3>
                  <p>With great fest comes great memories. Theta 2026 concluded.</p>
                  <div class="rm-end-card__meta">
                    <span>Final sync complete</span>
                    <Link href="/events">Open events</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom dock */}
      <div class="rm-dock rm-dock--sp">
        <div class="rm-dock__inner">
          <Link href="/roadmap/day1" class="rm-dock__item">Day 1</Link>
          <Link href="/roadmap/day2" class="rm-dock__item">Day 2</Link>
          <Link href="/roadmap/day3" class="rm-dock__item is-active">Day 3</Link>
          <span class="rm-dock__status">
            <span class="rm-dock__status-dot" />
            Spider-Man theme
          </span>
        </div>
      </div>


    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 3 Roadmap | Theta 2026 — Spider-Verse",
  meta: [{ name: "description", content: "Day 3 roadmap for Theta 2026 — Spider-Man Spider-Verse theme, S-curve timeline, GSAP web-slinger reveals." }],
};
