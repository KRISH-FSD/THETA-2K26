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

/* ── One Piece event data ── */
const EVENTS: EventData[] = [
  { id: 1, time: "09:00 AM", endTime: "10:00 AM", title: "Thousand Sunny Briefing",
    subtitle: "Grand Line departure — Day 2 kickoff", venue: "Main Auditorium, Block A", cat: "opening",
    fee: "Free", team: "Open to all", prize: "Daily logpose",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tags: ["Crew sync", "Island chart", "Log Pose reveal"],
    desc: "The second day signal fires across the Grand Line. Daily highlights, treasure route updates, and the full-crew morning assembly before the next island arc begins." },
  { id: 2, time: "10:00 AM", endTime: "01:00 PM", title: "Devil Fruit Code Sprint",
    subtitle: "Awaken your coding powers", venue: "Galvan Prime Lab, Block C", cat: "tech",
    fee: "Rs 100 / team", team: "2 to 3 members", prize: "Rs 15,000",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tags: ["3-hour sprint", "Live leaderboard", "Logic battles"],
    desc: "Eat the code-code fruit. Solve algorithmic and AI challenges under a blazing live scoreboard — only the strongest Devil Fruit users survive the Grand Line pressure." },
  { id: 3, time: "10:00 AM", endTime: "12:00 PM", title: "Marine Cipher Lab",
    subtitle: "Cyber & systems workshop", venue: "Plumber HQ, Block D", cat: "workshop",
    fee: "Rs 150 / head", team: "Individual", prize: "Treasure map + cert",
    img: "https://images.unsplash.com/photo-1629835775533-31682702c256?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live demo", "Mentor-led", "Cipher kit"],
    desc: "Decode the world's secrets. A guided workshop on cyber defense, AI-assisted security, and real-world penetration tactics — straight from the Marine intelligence files." },
  { id: 4, time: "02:00 PM", endTime: "03:30 PM", title: "Davy Back Trivia Fight",
    subtitle: "Rapid-fire quiz arena", venue: "Sector 7G, Block B", cat: "quiz",
    fee: "Rs 50 / team", team: "2 members", prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    tags: ["5 rounds", "30-second clock", "Buzzer duel"],
    desc: "The Davy Back Fight rules apply — five brutal rounds across tech, current affairs, and innovation. Win your crewmates' freedom or lose them to the rival ship." },
  { id: 5, time: "03:30 PM", endTime: "05:00 PM", title: "Pirate Crew Pitch Stage",
    subtitle: "Startup & product strategy battleground", venue: "Innovation Hall, Block A", cat: "tech",
    fee: "Rs 200 / team", team: "2 to 4 members", prize: "Rs 20,000 + mentoring",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
    tags: ["VC panel", "5-minute pitch", "Grand Line investors"],
    desc: "Chart your course and convince the Warlords. Present your startup idea to a panel of judges with a crisp story, sharp vision, and the fire of a future pirate king." },
  { id: 6, time: "05:00 PM", endTime: "06:30 PM", title: "Usopp Accuracy Run",
    subtitle: "Fast-paced aim-and-agility challenge", venue: "Open Arena, Ground Floor", cat: "fun",
    fee: "Free", team: "Pairs", prize: "Trophies + treasure goodies",
    img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Obstacle island", "Pair sync", "Reflex snipe"],
    desc: "Channel your inner Usopp — this movement-based campus challenge rewards communication, timing, and sharpshooter instincts more than raw speed." },
  { id: 7, time: "07:00 PM", endTime: "09:00 PM", title: "Baratie Grand Night",
    subtitle: "Open-air stage feast & finale", venue: "Open-Air Amphitheatre", cat: "cultural",
    fee: "Free", team: "Open to all", prize: "Festival encore",
    img: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live band", "Dance island", "Comedy duel"],
    desc: "The Baratie serves up a grand night — live music, campus performances, and a high-energy curtain call to wrap Day 2 of the Grand Line voyage." },
];

/* ── One Piece CAT palette ─ gold / cyan / teal / orange / aqua / amber ── */
const CAT: Record<Cat, CatMeta> = {
  opening:  { label: "Opening",  short: "OP", color: "#ffd700", rgb: "255,215,0"   },
  tech:     { label: "Tech",     short: "DF", color: "#00bfff", rgb: "0,191,255"   },
  workshop: { label: "Workshop", short: "WS", color: "#40e0d0", rgb: "64,224,208"  },
  quiz:     { label: "Quiz",     short: "QZ", color: "#ff8c42", rgb: "255,140,66"  },
  fun:      { label: "Fun",      short: "FN", color: "#7fffd4", rgb: "127,255,212"  },
  cultural: { label: "Cultural", short: "CL", color: "#ffd27f", rgb: "255,210,127" },
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
          <span class="rm-popup__stat-l">Crew</span>
          <strong class="rm-popup__stat-v">{ev.team}</strong>
        </div>
        <div class="rm-popup__stat">
          <span class="rm-popup__stat-l">Treasure</span>
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
            <p class="rm-card__overline">Island {String(ev.id).padStart(2, "0")}</p>
            <h3 class="rm-card__title">{ev.title}</h3>
          </div>
          <span class="rm-card__toggle">{isActive ? "Retreat" : "Sail →"}</span>
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

/* ── Ocean-wave canvas — One Piece colors ──────────────────────────────── */
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
    ctx.lineWidth=0.8;ctx.strokeStyle='rgba(0,191,255,0.07)';
    for(var y=-cell+off;y<c.height+cell;y+=cell){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
    for(var x=0;x<c.width+cell;x+=cell){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}
    /* gold shimmer dots */
    ctx.fillStyle='rgba(255,215,0,0.11)';
    for(var ry=-cell+off;ry<c.height+cell;ry+=cell)
      for(var rx=0;rx<c.width+cell;rx+=cell){
        var w=Math.sin(t*0.025+ry*0.08+rx*0.06),r=1.2+w*w*1.3;
        ctx.beginPath();ctx.arc(rx,ry,r,0,6.28);ctx.fill();
      }
    /* ocean bubbles */
    ctx.fillStyle='rgba(64,224,208,0.06)';
    for(var b=0;b<12;b++){
      var bx=(Math.sin(t*0.007+b*1.9)*0.5+0.5)*c.width;
      var by=((-t*0.22+b*c.height/12+c.height)%c.height);
      ctx.beginPath();ctx.arc(bx,by,1.5+Math.sin(b)*1.2,0,6.28);ctx.fill();
    }
    t++;requestAnimationFrame(frame);
  }
  frame();
})();
`;

export default component$(function Day2Roadmap() {
  const activeEventId = useSignal<number | null>(null);

  useVisibleTask$(() => {
    /* ── Set One Piece theme on entire site ── */
    document.body.setAttribute("data-theme", "onepiece");
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
        const cr   = container.getBoundingClientRect();
        const VH   = window.innerHeight;
        const prog = Math.max(0, Math.min(1, (VH * 0.55 - cr.top) / cr.height));
        const off  = totalLen * (1 - prog);
        pathBase.style.strokeDashoffset   = String(off);
        pathAccent.style.strokeDashoffset = String(Math.max(0, off - 26));
        pathGlow.style.strokeDashoffset   = String(off);
        posTracer(prog);
        const ns = liveNodes();
        ns.forEach((n, i) => n.classList.toggle("rm-node--lit", prog >= i / Math.max(ns.length - 1, 1) - 0.02));
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
    <div class="rm-page rm-page--op" key="roadmap-day-2">

      {/* ── One Piece color overrides (structure unchanged) ── */}
      <style>{`
        .rm-page--op {
          background: linear-gradient(175deg, #020c18 0%, #031624 35%, #050e1a 65%, #020a12 100%);
        }
        .rm-page--op .rm-page__aurora--left {
          background: radial-gradient(ellipse at 0% 30%, rgba(0,120,200,0.18) 0%, transparent 65%);
        }
        .rm-page--op .rm-page__aurora--right {
          background: radial-gradient(ellipse at 100% 60%, rgba(255,215,0,0.1) 0%, rgba(64,224,208,0.07) 40%, transparent 70%);
        }
        .rm-page--op .rm-pill {
          background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,191,255,0.12));
          border-color: rgba(255,215,0,0.4);
          color: #ffd700;
        }
        .rm-page--op .rm-section__title {
          background: linear-gradient(135deg, #ffd700 0%, #ffe680 30%, #fff 55%, #00bfff 80%, #40e0d0 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .rm-page--op .rm-event-glass {
          background: linear-gradient(135deg, rgba(0,60,120,0.55), rgba(255,215,0,0.1));
          border-color: rgba(255,215,0,0.28);
        }
        .rm-page--op .rm-event-glass__count { color: #ffd700; text-shadow: 0 0 20px rgba(255,215,0,0.5); }
        .rm-page--op .rm-event-glass__dot   { background: #ffd700; box-shadow: 0 0 12px rgba(255,215,0,0.7); }
        /* Snake line gradients */
        .rm-page--op #rm-grad-line stop:nth-child(1) { stop-color: #ffd700; }
        .rm-page--op #rm-grad-line stop:nth-child(2) { stop-color: #00bfff; }
        .rm-page--op #rm-grad-line stop:nth-child(3) { stop-color: #40e0d0; }
        .rm-page--op #rm-grad-core stop:nth-child(1) { stop-color: #fff; }
        .rm-page--op #rm-grad-core stop:nth-child(2) { stop-color: #ffd700; }
        .rm-page--op #rm-grad-core stop:nth-child(3) { stop-color: #00bfff; }
        .rm-page--op #rm-tracer-fill stop:nth-child(2) { stop-color: #ffd700; }
        .rm-page--op #rm-tracer-fill stop:nth-child(3) { stop-color: #00bfff; }
        .rm-page--op #rm-tracer-arrow { fill: #ffd700; }
        /* Node lit state */
        .rm-page--op .rm-node--lit {
          border-color: #ffd700;
          box-shadow: 0 0 0 3px rgba(255,215,0,0.15), 0 0 22px rgba(255,215,0,0.5), 0 0 50px rgba(0,191,255,0.2);
          background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,80,160,0.4));
        }
        /* Dock — One Piece */
        .rm-page--op ~ .rm-dock .rm-dock__inner,
        .rm-dock--op .rm-dock__inner {
          border-color: rgba(255,215,0,0.28);
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 18px rgba(255,215,0,0.07);
        }
        .rm-dock--op .rm-dock__item.is-active {
          color: #ffd700;
          background: rgba(255,215,0,0.14);
          border: 1px solid rgba(255,215,0,0.35);
        }
        .rm-dock--op .rm-dock__item:hover    { color: #ffd700; background: rgba(255,215,0,0.09); }
        .rm-dock--op .rm-dock__status-dot    { background: #ffd700; box-shadow: 0 0 10px rgba(255,215,0,0.7); }
        /* End card */
        .rm-page--op .rm-end-card {
          background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,50,110,0.45));
          border-color: rgba(255,215,0,0.32);
        }
        .rm-page--op .rm-end-card h3 { color: #ffd700; }
        .rm-page--op .rm-end-card__meta a {
          color: #ffd700;
          background: rgba(255,215,0,0.12);
          border-color: rgba(255,215,0,0.32);
        }
        .rm-page--op .rm-end-card__meta a:hover { background: rgba(255,215,0,0.22); }
      `}</style>

      <canvas id="rm-bg-grid" class="rm-bg-grid" aria-hidden="true" />
      <div class="rm-page__aurora rm-page__aurora--left"  />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">

          {/* Header */}
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">⚓ Grand Line</span>
              <h1 class="rm-section__title">Day 2 — The Grand Line Voyage</h1>
              <p class="rm-section__copy">Tap any card to reveal its event, crew size &amp; entry details.</p>
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
                  <stop offset="0%"   stop-color="#ffd700" />
                  <stop offset="55%"  stop-color="#00bfff" />
                  <stop offset="100%" stop-color="#40e0d0" />
                </linearGradient>
                <linearGradient id="rm-grad-core" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#fff"    />
                  <stop offset="50%"  stop-color="#ffd700" />
                  <stop offset="100%" stop-color="#00bfff" />
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
                  <stop offset="45%"  stop-color="#ffd700" stop-opacity="0.9"/>
                  <stop offset="100%" stop-color="#00bfff" stop-opacity="0"  />
                </radialGradient>
              </defs>
              <path id="rm-line-glow"   class="rm-line-glow"   fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-base"   class="rm-line-base"   fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-accent" class="rm-line-accent" fill="none" stroke="url(#rm-grad-core)" filter="url(#rm-glow-f)" />
              <g id="rm-tracer" style="opacity:0;will-change:transform;" filter="url(#rm-arrow-f)">
                <circle class="rm-tracer-ring rm-tracer-ring--outer" cx="0" cy="0" r="18"
                  fill="none" stroke="rgba(255,215,0,0.25)" stroke-width="1" />
                <circle class="rm-tracer-ring rm-tracer-ring--mid" cx="0" cy="0" r="11"
                  fill="none" stroke="rgba(0,191,255,0.48)" stroke-width="1" />
                <circle cx="0" cy="0" r="7" fill="url(#rm-tracer-fill)" />
                <polygon id="rm-tracer-arrow" points="18,0 5,-6 5,6" fill="#ffd700" />
                <line x1="-4" y1="-3" x2="-18" y2="-7" stroke="rgba(0,191,255,0.5)" stroke-width="1.5" stroke-linecap="round" />
                <line x1="-4" y1="3"  x2="-18" y2="7"  stroke="rgba(0,191,255,0.5)" stroke-width="1.5" stroke-linecap="round" />
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
                      : isActive ? <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} /> : null}
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
                      : isActive ? <PopupPanel ev={event} meta={meta} side="right" canRegister={canRegister} /> : null}
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
                  <span class="rm-pill">⚓ Dock</span>
                  <h3>Day 2 completed.</h3>
                  <p>Day 3 sails at 09:00 AM.</p>
                  <div class="rm-end-card__meta">
                    <span>Next island ready</span>
                    <Link href="/events">Open events</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom dock */}
      <div class="rm-dock rm-dock--op">
        <div class="rm-dock__inner">
          <Link href="/roadmap/day1" class="rm-dock__item">Day 1</Link>
          <Link href="/roadmap/day2" class="rm-dock__item is-active">Day 2</Link>
          <Link href="/roadmap/day3" class="rm-dock__item">Day 3</Link>
          <span class="rm-dock__status">
            <span class="rm-dock__status-dot" />
            One Piece theme
          </span>
        </div>
      </div>

      <script dangerouslySetInnerHTML={GRID_JS} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 2 Roadmap | Theta 2026 — One Piece Grand Line",
  meta: [{ name: "description", content: "Day 2 roadmap for Theta 2026 — One Piece Grand Line theme, S-curve timeline, GSAP card reveals." }],
};
