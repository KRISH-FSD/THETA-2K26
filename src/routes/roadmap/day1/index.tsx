import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

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
  fee: string;
  team: string;
  prize: string;
  img: string;
  tags: string[];
}
interface CatMeta { label: string; short: string; color: string; rgb: string; }
interface EventCardProps {
  ev: EventData; meta: CatMeta; isActive: boolean;
  canRegister: boolean; side: "left" | "right"; onToggle$: () => void;
}
interface SideInfoProps { ev: EventData; meta: CatMeta; }

const EVENTS: EventData[] = [
  { id: 1, time: "09:00 AM", endTime: "10:00 AM", title: "Inauguration Ceremony",
    subtitle: "Grand opening for Theta 2026", venue: "Main Auditorium, Block A", cat: "opening",
    fee: "Free", team: "Open to all", prize: "Opening showcase",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tags: ["Chief guest", "Theme reveal", "Campus launch"],
    desc: "The opening signal for Theta 2026 with the keynote address, launch visuals, and the first full crowd briefing of the fest." },
  { id: 2, time: "10:00 AM", endTime: "01:00 PM", title: "Omnitrix Core Calibration",
    subtitle: "Fast AI and coding sprint", venue: "Galvan Prime Lab, Block C", cat: "tech",
    fee: "Rs 100 / team", team: "2 to 3 members", prize: "Rs 15,000",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tags: ["3-hour sprint", "Live leaderboard", "Logic battles"],
    desc: "A high-pressure build window where teams solve algorithmic and AI-flavored challenge sets under a live scoreboard." },
  { id: 3, time: "10:00 AM", endTime: "12:00 PM", title: "Plumber Tactical Workshop",
    subtitle: "Hands-on cyber and systems lab", venue: "Plumber HQ, Block D", cat: "workshop",
    fee: "Rs 150 / head", team: "Individual", prize: "Certificate + kit",
    img: "https://images.unsplash.com/photo-1629835775533-31682702c256?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live demo", "Mentor-led", "Practice kit"],
    desc: "A guided workshop focused on cyber defense, AI-assisted system awareness, and practical security walkthroughs." },
  { id: 4, time: "02:00 PM", endTime: "03:30 PM", title: "Null Void Navigator",
    subtitle: "Rapid-fire quiz arena", venue: "Sector 7G, Block B", cat: "quiz",
    fee: "Rs 50 / team", team: "2 members", prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    tags: ["5 rounds", "30-second clock", "Buzzer mode"],
    desc: "A speed quiz that cuts across tech, innovation, science, and current affairs with almost no pause between rounds." },
  { id: 5, time: "03:30 PM", endTime: "05:00 PM", title: "Galvan Pitch Arena",
    subtitle: "Startup and product strategy stage", venue: "Innovation Hall, Block A", cat: "tech",
    fee: "Rs 200 / team", team: "2 to 4 members", prize: "Rs 20,000 + mentoring",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
    tags: ["VC panel", "5-minute pitch", "Feedback loop"],
    desc: "Present your product idea to mentors and judges with a crisp story, sharp demo thinking, and real startup pressure." },
  { id: 6, time: "05:00 PM", endTime: "06:30 PM", title: "Wildmutt Agility Run",
    subtitle: "Fast-paced fun challenge", venue: "Open Arena, Ground Floor", cat: "fun",
    fee: "Free", team: "Pairs", prize: "Trophies + goodies",
    img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Obstacle loop", "Pair sync", "Reflex zone"],
    desc: "A movement-based campus challenge where communication, timing, and instincts matter more than raw speed." },
  { id: 7, time: "07:00 PM", endTime: "09:00 PM", title: "Day 1 Cultural Night",
    subtitle: "Open-air stage finale", venue: "Open-Air Amphitheatre", cat: "cultural",
    fee: "Free", team: "Open to all", prize: "Festival closeout",
    img: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live band", "Dance block", "Comedy set"],
    desc: "The night wrap with music, campus performances, and a high-energy close to the first day of the roadmap." },
];

const CAT: Record<Cat, CatMeta> = {
  opening:  { label: "Opening",  short: "OP", color: "#d7ff4a", rgb: "215,255,74"  },
  tech:     { label: "Tech",     short: "AI", color: "#63ff2c", rgb: "99,255,44"   },
  workshop: { label: "Workshop", short: "WS", color: "#99ff4f", rgb: "153,255,79"  },
  quiz:     { label: "Quiz",     short: "QZ", color: "#f3ff91", rgb: "243,255,145" },
  fun:      { label: "Fun",      short: "FN", color: "#b8ff57", rgb: "184,255,87"  },
  cultural: { label: "Cultural", short: "CL", color: "#efffc8", rgb: "239,255,200" },
};

/* ─── Side Info Card (fills the empty opposite panel) ─────────────── */
const SideInfoCard = component$<SideInfoProps>(({ ev, meta }) => (
  <div class="rm-side-info" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}>
    <div class="rm-side-info__top">
      <span class="rm-side-info__chip">
        <span class="rm-side-info__dot" />
        {meta.label}
      </span>
      <span class="rm-side-info__time">{ev.time}</span>
    </div>
    <p class="rm-side-info__title">{ev.title}</p>
    <p class="rm-side-info__venue">📍 {ev.venue}</p>
    <div class="rm-side-info__stats">
      <div class="rm-side-info__stat">
        <span class="rm-side-info__stat-l">Entry</span>
        <strong class="rm-side-info__stat-v">{ev.fee}</strong>
      </div>
      <div class="rm-side-info__stat">
        <span class="rm-side-info__stat-l">Team</span>
        <strong class="rm-side-info__stat-v">{ev.team}</strong>
      </div>
      <div class="rm-side-info__stat">
        <span class="rm-side-info__stat-l">Prize</span>
        <strong class="rm-side-info__stat-v">{ev.prize}</strong>
      </div>
    </div>
    <div class="rm-side-info__tags">
      {ev.tags.map((t) => <span key={t} class="rm-side-info__tag">{t}</span>)}
    </div>
  </div>
));

/* ─── Main Event Card ──────────────────────────────────────────────── */
const EventCard = component$<EventCardProps>(
  ({ ev, meta, isActive, canRegister, side, onToggle$ }) => (
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
            <p class="rm-card__overline">Node {String(ev.id).padStart(2, "0")}</p>
            <h3 class="rm-card__title">{ev.title}</h3>
          </div>
          <span class="rm-card__toggle">{isActive ? "Collapse" : "Expand"}</span>
        </div>
        <p class="rm-card__desc">{ev.desc}</p>
        <div class="rm-card__quick-meta">
          <span class="rm-card__meta-pill">{ev.venue}</span>
          <span class="rm-card__meta-pill">{ev.time} – {ev.endTime}</span>
        </div>
        <div class={["rm-card__details", isActive ? "is-open" : ""]}>
          <div class="rm-card__stat-grid">
            {[{ label: "Entry", value: ev.fee }, { label: "Team", value: ev.team }, { label: "Reward", value: ev.prize }]
              .map((item) => (
                <div key={`${ev.id}-${item.label}`} class="rm-card__stat">
                  <span class="rm-card__stat-label">{item.label}</span>
                  <strong class="rm-card__stat-value">{item.value}</strong>
                </div>
              ))}
          </div>
          <div class="rm-card__tags">
            {ev.tags.map((tag) => <span key={`${ev.id}-${tag}`} class="rm-card__tag">{tag}</span>)}
          </div>
          <div class="rm-card__actions">
            <Link href="/events" class="rm-card__action rm-card__action--primary" onClick$={(e) => e.stopPropagation()}>
              View event hub
            </Link>
            {canRegister
              ? <Link href="/events" class="rm-card__action rm-card__action--ghost" onClick$={(e) => e.stopPropagation()}>Register now</Link>
              : <span class="rm-card__status">Open access</span>}
          </div>
        </div>
      </div>
    </article>
  ),
);

/* ─── Canvas grid script (inline, runs once) ──────────────────────── */
const GRID_JS = `
(function(){
  var c=document.getElementById('rm-bg-grid');
  if(!c)return;
  var ctx=c.getContext('2d'),t=0,cell=44;
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  function frame(){
    ctx.clearRect(0,0,c.width,c.height);
    var off=(t*0.35)%cell;
    ctx.lineWidth=0.8;ctx.strokeStyle='rgba(99,255,44,0.08)';
    for(var y=-cell+off;y<c.height+cell;y+=cell){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
    for(var x=0;x<c.width+cell;x+=cell){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}
    ctx.fillStyle='rgba(99,255,44,0.13)';
    for(var ry=-cell+off;ry<c.height+cell;ry+=cell)
      for(var rx=0;rx<c.width+cell;rx+=cell){
        var w=Math.sin(t*0.025+ry*0.08+rx*0.06),r=1.2+w*w*1.3;
        ctx.beginPath();ctx.arc(rx,ry,r,0,6.28);ctx.fill();
      }
    t++;requestAnimationFrame(frame);
  }
  frame();
})();
`;

export default component$(() => {
  /* ── activeEventId does NOT drive useVisibleTask$ ── */
  const activeEventId = useSignal<number | null>(null);

  useVisibleTask$(() => {
    /* ─ NO track() here → this runs ONCE only, never re-runs on card toggle ─ */

    /* GSAP loader */
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

      const container  = document.getElementById("rm-timeline")    as HTMLElement     | null;
      const svgEl      = document.getElementById("rm-line-svg")    as SVGSVGElement   | null;
      const pathBase   = document.getElementById("rm-line-base")   as SVGPathElement  | null;
      const pathAccent = document.getElementById("rm-line-accent") as SVGPathElement  | null;
      const pathGlow   = document.getElementById("rm-line-glow")   as SVGPathElement  | null;
      const tracer     = document.getElementById("rm-tracer")      as SVGGElement     | null;
      if (!container || !svgEl || !pathBase || !pathAccent || !pathGlow) return;

      let totalLen = 0, rafId = 0, scheduled = false, needsBuild = true;
      let ro: ResizeObserver | undefined;
      const revealed = new Set<Element>();

      /* ── helpers ── */
      const liveNodes = () =>
        Array.from(container.querySelectorAll<HTMLElement>("[data-snake-node]"))
             .filter((n) => n.offsetParent !== null && n.offsetWidth > 0);

      /* ── Build S-CURVE path through alternating node positions ──
           Nodes sit at left or right edge of the spine column,
           alternating per row → the path zigzags = S-curve.          */
      const buildPath = (): boolean => {
        const nodes = liveNodes();
        if (nodes.length < 2) return false;

        const cr = container.getBoundingClientRect();
        const W  = container.clientWidth;
        const H  = Math.max(container.scrollHeight, container.clientHeight);

        /* Read ACTUAL node centers — they alternate left/right because
           rm-row--left nodes are right-aligned in the spine column,
           rm-row--right nodes are left-aligned in the spine column.   */
        const pts = nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return {
            x: r.left - cr.left + r.width  / 2,
            y: r.top  - cr.top  + r.height / 2,
          };
        });

        /* Cubic bezier — large vertical bend creates the S-curve */
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const dy   = c.y - p.y;
          const bend = Math.max(60, dy * 0.42);
          d += ` C ${p.x.toFixed(1)} ${(p.y + bend).toFixed(1)},`
             + ` ${c.x.toFixed(1)} ${(c.y - bend).toFixed(1)},`
             + ` ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
        }

        svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
        svgEl.setAttribute("width",  String(W));
        svgEl.setAttribute("height", String(H));
        for (const p of [pathBase, pathAccent, pathGlow]) {
          p.setAttribute("d", d);
          p.style.strokeDasharray  = String(p.getTotalLength());
        }
        totalLen = pathBase.getTotalLength();
        return true;
      };

      /* ── Tracer position ── */
      const posTracer = (prog: number) => {
        if (!tracer || totalLen === 0) return;
        const cl  = Math.max(0, Math.min(1, prog));
        const off = cl * totalLen;
        const pt  = pathBase.getPointAtLength(off);
        const ptN = pathBase.getPointAtLength(Math.min(totalLen, off + 18));
        const ang = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * (180 / Math.PI);
        tracer.setAttribute("transform", `translate(${pt.x.toFixed(2)},${pt.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
        tracer.style.opacity = cl > 0.005 && cl < 0.998 ? "1" : "0";
      };

      /* ── Scroll → progress → draw line ── */
      const rows = Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)"));

      const update = () => {
        if (totalLen === 0) return;
        const cr   = container.getBoundingClientRect();
        const VH   = window.innerHeight;
        /* 55% viewport acts as draw line — starts drawing as soon as
           top of timeline nears the middle of viewport.               */
        const prog = Math.max(0, Math.min(1, (VH * 0.55 - cr.top) / cr.height));
        const off  = totalLen * (1 - prog);

        pathBase.style.strokeDashoffset   = String(off);
        pathAccent.style.strokeDashoffset = String(Math.max(0, off - 26));
        pathGlow.style.strokeDashoffset   = String(off);
        posTracer(prog);

        /* Node glow when line passes */
        const ns = liveNodes();
        ns.forEach((n, i) => n.classList.toggle("rm-node--lit", prog >= i / Math.max(ns.length - 1, 1) - 0.02));

        /* GSAP card + side-info reveal — triggers once per row */
        rows.forEach((row, idx) => {
          const card     = row.querySelector<HTMLElement>(".rm-card");
          const sideInfo = row.querySelector<HTMLElement>(".rm-side-info");
          const isLeft   = row.classList.contains("rm-row--left");

          if (card && !revealed.has(card)) {
            const r = card.getBoundingClientRect();
            if (r.top < VH * 0.9) {
              revealed.add(card);
              if (gsap) {
                gsap.fromTo(card,
                  { opacity: 0, x: isLeft ? -70 : 70, y: 28, scale: 0.88, rotateY: isLeft ? -14 : 14 },
                  { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0,
                    duration: 0.85, ease: "back.out(1.4)", delay: idx * 0.04, clearProps: "transform" });
                /* Side info slides in from the OPPOSITE direction */
                if (sideInfo) {
                  gsap.fromTo(sideInfo,
                    { opacity: 0, x: isLeft ? 50 : -50, y: 20, scale: 0.94 },
                    { opacity: 1, x: 0, y: 0, scale: 1,
                      duration: 0.75, ease: "power3.out", delay: idx * 0.04 + 0.12, clearProps: "transform" });
                }
              } else {
                card.style.opacity = "1";
                card.style.transform = "none";
                if (sideInfo) { sideInfo.style.opacity = "1"; }
              }
            }
          }
        });
      };

      const flush = () => { scheduled = false; if (needsBuild) needsBuild = !buildPath(); if (!needsBuild) update(); };
      const go    = (rebuild = false) => { needsBuild = needsBuild || rebuild; if (scheduled) return; scheduled = true; rafId = requestAnimationFrame(flush); };

      /* listeners */
      Array.from(container.querySelectorAll<HTMLImageElement>("img"))
           .forEach((img) => { if (!img.complete) img.addEventListener("load", () => go(true)); });
      if ("ResizeObserver" in window) { ro = new ResizeObserver(() => go(true)); ro.observe(container); }
      window.addEventListener("scroll", () => go(false), { passive: true });
      window.addEventListener("resize", () => go(true),  { passive: true });
      setTimeout(() => go(true), 180);
      go(true);

      /* Node hover glow */
      container.querySelectorAll<HTMLElement>(".rm-node").forEach((n) => {
        n.addEventListener("mouseenter", () => n.classList.add("rm-node--hovered"));
        n.addEventListener("mouseleave", () => n.classList.remove("rm-node--hovered"));
      });

      /* Header entrance */
      if (gsap) {
        const hdr = document.querySelector(".rm-section__header");
        if (hdr) gsap.fromTo(hdr, { opacity: 0, y: -36 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" });
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
    <div class="rm-page">
      <canvas id="rm-bg-grid" class="rm-bg-grid" aria-hidden="true" />
      <div class="rm-page__aurora rm-page__aurora--left"  />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">

          {/* ── Header row ── */}
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">Timeline</span>
              <h1 class="rm-section__title">Day 1 Event Flow</h1>
              <p class="rm-section__copy">Open any card for the needed details.</p>
            </div>
            <div class="rm-event-glass">
              <span class="rm-event-glass__count">{String(EVENTS.length).padStart(2, "0")}</span>
              <span class="rm-event-glass__label">Events<br />Today</span>
              <span class="rm-event-glass__dot" />
            </div>
          </div>

          {/* ── Timeline ── */}
          <div id="rm-timeline" class="rm-timeline">

            {/* SVG snake line */}
            <svg id="rm-line-svg" class="rm-line-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="rm-grad-line" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#d9ff4a" />
                  <stop offset="55%"  stop-color="#63ff2c" />
                  <stop offset="100%" stop-color="#f4ff9b" />
                </linearGradient>
                <linearGradient id="rm-grad-core" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#fff"    />
                  <stop offset="50%"  stop-color="#efffc8" />
                  <stop offset="100%" stop-color="#d7ff4a" />
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
                  <stop offset="45%"  stop-color="#d7ff4a" stop-opacity="0.9"/>
                  <stop offset="100%" stop-color="#63ff2c" stop-opacity="0"  />
                </radialGradient>
              </defs>
              <path id="rm-line-glow"   class="rm-line-glow"   fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-base"   class="rm-line-base"   fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-accent" class="rm-line-accent" fill="none" stroke="url(#rm-grad-core)" filter="url(#rm-glow-f)" />
              {/* Glowing arrow tracer */}
              <g id="rm-tracer" style="opacity:0;will-change:transform;" filter="url(#rm-arrow-f)">
                <circle class="rm-tracer-ring rm-tracer-ring--outer" cx="0" cy="0" r="18"
                  fill="none" stroke="rgba(215,255,74,0.25)" stroke-width="1" />
                <circle class="rm-tracer-ring rm-tracer-ring--mid" cx="0" cy="0" r="11"
                  fill="none" stroke="rgba(99,255,44,0.48)" stroke-width="1" />
                <circle cx="0" cy="0" r="7" fill="url(#rm-tracer-fill)" />
                <polygon id="rm-tracer-arrow" points="18,0 5,-6 5,6" fill="#d7ff4a" />
                <line x1="-4" y1="-3" x2="-18" y2="-7" stroke="rgba(99,255,44,0.5)" stroke-width="1.5" stroke-linecap="round" />
                <line x1="-4" y1="3"  x2="-18" y2="7"  stroke="rgba(99,255,44,0.5)" stroke-width="1.5" stroke-linecap="round" />
              </g>
            </svg>

            {/* Event rows */}
            {EVENTS.map((event, index) => {
              const meta        = CAT[event.cat];
              /* Even index → card LEFT, node RIGHT of spine (rm-row--left) */
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              const isActive    = activeEventId.value === event.id;
              const canRegister = event.cat !== "opening" && event.cat !== "cultural";

              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>

                  {/* LEFT panel: card OR side-info */}
                  <div class="rm-row__side rm-row__side--left">
                    {side === "left"
                      ? <EventCard ev={event} meta={meta} isActive={isActive}
                            canRegister={canRegister} side="left"
                            onToggle$={() => toggleEvent(event.id)} />
                      : <SideInfoCard ev={event} meta={meta} />
                    }
                  </div>

                  {/* CENTER spine — node aligned to CREATE S-CURVE:
                      left-card rows: node pushed RIGHT inside spine
                      right-card rows: node pushed LEFT inside spine  */}
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

                  {/* RIGHT panel: card OR side-info */}
                  <div class="rm-row__side rm-row__side--right">
                    {side === "right"
                      ? <EventCard ev={event} meta={meta} isActive={isActive}
                            canRegister={canRegister} side="right"
                            onToggle$={() => toggleEvent(event.id)} />
                      : <SideInfoCard ev={event} meta={meta} />
                    }
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
                </div>
              </div>
              <div class="rm-row__side rm-row__side--right">
                <div class="rm-end-card">
                  <span class="rm-pill">Finish</span>
                  <h3>Day 1 completed.</h3>
                  <p>Day 2 starts at 09:00 AM.</p>
                  <div class="rm-end-card__meta">
                    <span>Next sync ready</span>
                    <Link href="/events">Open events</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom dock */}
      <div class="rm-dock">
        <div class="rm-dock__inner">
          <Link href="/roadmap/day1" class="rm-dock__item is-active">Day 1</Link>
          <span class="rm-dock__item is-disabled">Day 2 soon</span>
          <span class="rm-dock__item is-disabled">Day 3 soon</span>
          <span class="rm-dock__status">
            <span class="rm-dock__status-dot" />
            Ben 10 theme
          </span>
        </div>
      </div>

      <script dangerouslySetInnerHTML={GRID_JS} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 1 Roadmap | Theta 2026",
  meta: [{ name: "description", content: "Day 1 roadmap for Theta 2026 — S-curve timeline, GSAP card reveals, Ben 10 theme." }],
};