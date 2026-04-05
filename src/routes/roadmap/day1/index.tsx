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
    id: 1, time: "10:00 AM", endTime: "01:00 PM", title: "Bio Architect",
    subtitle: "Living structures workshop", venue: "IED Hall", cat: "tech",
    fee: "Free", team: "Individual", prize: "Merit Cert",
    img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200",
    tags: ["Biology", "Design", "Organic"],
    desc: "A cluster-led session on biological architecture and organic design principles."
  },
  {
    id: 2, time: "11:00 AM", endTime: "01:00 PM", title: "Maze Bot",
    subtitle: "Pathfinding robotics challenge", venue: "ECE Lab", cat: "tech",
    fee: "Rs 100", team: "2 Members", prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    tags: ["Robotics", "Logic", "Hardware"],
    desc: "Build and program a bot to navigate complex mazes in the shortest time possible."
  },
  {
    id: 3, time: "11:00 AM", endTime: "01:00 PM", title: "Optica Simulation",
    subtitle: "Physics and light experiments", venue: "Room 310", cat: "quiz",
    fee: "Free", team: "Individual", prize: "Goodies",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200",
    tags: ["Physics", "Optics", "Binary"],
    desc: "Interactive games involving Bernoulli blasts, binary codes, and physics freeze challenges."
  },
  {
    id: 4, time: "11:00 AM", endTime: "01:00 PM", title: "Venture Forge Hackathon",
    subtitle: "Strategic marketing sprint", venue: "Room 303", cat: "tech",
    fee: "Rs 150", team: "3 Members", prize: "Rs 10,000",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200",
    tags: ["Marketing", "Pitch", "Hackathon"],
    desc: "Identify problems, design marketing solutions, and pitch your startup strategy to the panel."
  },
  {
    id: 5, time: "11:00 AM", endTime: "01:00 PM", title: "IRON FIST AI",
    subtitle: "Vision and memory relay", venue: "Room 410", cat: "tech",
    fee: "Rs 50", team: "2 Members", prize: "Rs 3,000",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    tags: ["AI", "Vision", "Gaming"],
    desc: "A multi-round challenge featuring Mini Militia battles, memory relays, and AI vision tests."
  },
  {
    id: 6, time: "11:00 AM", endTime: "02:00 PM", title: "Tech Startup Challenge",
    subtitle: "The innovator's showcase", venue: "Room 402", cat: "tech",
    fee: "Rs 200", team: "2 to 4 Members", prize: "Rs 15,000",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200",
    tags: ["Design", "Develop", "Startup"],
    desc: "From Tech Spark to Start-up Showcase, pitch your development vision and business model."
  },
  {
    id: 7, time: "11:00 AM", endTime: "02:00 PM", title: "Roadmap Sports Arena",
    subtitle: "Physical and reflex challenges", venue: "Basketball Court", cat: "fun",
    fee: "Free", team: "Varies", prize: "Medals",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
    tags: ["Football", "Bowling", "Match"],
    desc: "A set of high-energy sports activities including Football matches and reflex games like Spin & Bowl."
  },
  {
    id: 8, time: "11:00 AM", endTime: "04:00 PM", title: "FInfinity Challenge",
    subtitle: "Mathematical guess & win", venue: "Room 203", cat: "tech",
    fee: "Rs 50", team: "Individual", prize: "Rs 2,000",
    img: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=1200",
    tags: ["Math", "Guess", "Logic"],
    desc: "Think fast and move smart in this mathematical clue connection and guessing game."
  },
  {
    id: 9, time: "11:00 AM", endTime: "04:00 PM", title: "Infinity Beats",
    subtitle: "Rhythm and logic balance", venue: "Room 211", cat: "fun",
    fee: "Free", team: "Individual", prize: "Goodies",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
    tags: ["Balance", "Rhythm", "Tap"],
    desc: "A multi-stage game featuring Balance Blitz, Tap & Drop, and Spin & Solve rhythm challenges."
  },
  {
    id: 10, time: "11:15 AM", endTime: "01:45 PM", title: "Edit Blitz",
    subtitle: "Rapid media editing sprint", venue: "Lab", cat: "workshop",
    fee: "Rs 100", team: "Individual", prize: "Rs 4,000",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200",
    tags: ["Editing", "Video", "Speed"],
    desc: "A fast-paced media editing contest where efficiency and creativity meet the clock."
  },
  {
    id: 11, time: "11:30 AM", endTime: "01:00 PM", title: "AI Prompt App Creation",
    subtitle: "Generative AI coding lab", venue: "Room 110", cat: "workshop",
    fee: "Rs 150", team: "Individual", prize: "Cert + Mentoring",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
    tags: ["AI", "Prompts", "Apps"],
    desc: "Learn to build functional applications using state-of-the-art AI prompting techniques."
  },
  {
    id: 12, time: "02:00 PM", endTime: "05:00 PM", title: "FunKart Relay",
    subtitle: "Biology themed obstacle run", venue: "IED Hall", cat: "fun",
    fee: "Free", team: "3 Members", prize: "Rs 2,500",
    img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200",
    tags: ["Focus", "Vision", "Relay"],
    desc: "Tackle the 'Zero Vision Zone' and 'Error Hunt' in this high-energy biology relay."
  },
  {
    id: 13, time: "02:00 PM", endTime: "03:30 PM", title: "Tech Fun Fusion",
    subtitle: "Connecting tech and memes", venue: "Room 110", cat: "fun",
    fee: "Free", team: "2 Members", prize: "Goodies",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
    tags: ["Memes", "Connect", "Fun"],
    desc: "A creative session featuring 'Connect the Tech' and meme creation challenges."
  },
  {
    id: 14, time: "02:00 PM", endTime: "04:00 PM", title: "Null Void Treasure Hunt",
    subtitle: "Campus-wide mystery solved", venue: "Room 406", cat: "fun",
    fee: "Rs 50", team: "4 Members", prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200",
    tags: ["Treasure", "Hunt", "Clues"],
    desc: "Search the campus for hidden clues to unlock the secrets of the Null Void."
  },
  {
    id: 15, time: "02:00 PM", endTime: "04:00 PM", title: "Sumo Bot Battle",
    subtitle: "High-impact robotics arena", venue: "ECE Lab", cat: "tech",
    fee: "Rs 150", team: "2 Members", prize: "Rs 7,500",
    img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1200",
    tags: ["Sumo", "Bot", "Impact"],
    desc: "Pitting robotics designs against each other in a battle of strength and algorithm."
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
const PopupPanel = component$<PopupPanelProps>(({ ev, meta, side, canRegister }) => (
  <div
    class={["rm-popup", `rm-popup--${side}`]}
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

      {/* Tags */}
      <div class="rm-popup__tags">
        {ev.tags.map((t) => <span key={t} class="rm-popup__tag">{t}</span>)}
      </div>

      {/* Action buttons */}
      <div class="rm-popup__actions">
        <Link href="/events" class="rm-popup__action rm-popup__action--primary"
          onClick$={(e: Event) => e.stopPropagation()}>
          View Event Hub
        </Link>
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
            <p class="rm-card__overline">Node {String(ev.id).padStart(2, "0")}</p>
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

export default component$(function Day1Roadmap() {
  const activeEventId = useSignal<number | null>(null);

  useVisibleTask$(() => {
    const page = document.querySelector(".rm-page--day1") as HTMLElement | null;
    if (!page) return;
    let rafId = 0;
    const updateScroll = () => {
      rafId = 0;
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollRatio = window.scrollY / scrollMax;
      page.style.setProperty("--rm-scroll-progress", scrollRatio.toFixed(4));
      const mid = 0.5, span = 0.3;
      const img1 = Math.max(0, Math.min(1, (mid - scrollRatio + span / 2) / span));
      const img2 = 1 - img1;
      page.style.setProperty("--rm-bg1-opacity", img1.toFixed(4));
      page.style.setProperty("--rm-bg2-opacity", img2.toFixed(4));
      page.style.setProperty("--rm-bg1-shift", `${(-140 * (1 - img1)).toFixed(1)}px`);
      page.style.setProperty("--rm-bg2-shift", `${(140 * (1 - img2)).toFixed(1)}px`);
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
      const enableCardReveal = !(window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 767);
      const smoothFactor = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 767 ? 0.16 : 0.32;
      const revealed = new Set<Element>();

      const liveNodes = () =>
        Array.from(container.querySelectorAll<HTMLElement>("[data-snake-node]"))
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
        const pt = pathBase.getPointAtLength(off);
        const ptN = pathBase.getPointAtLength(Math.min(totalLen, off + 18));
        const ang = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * (180 / Math.PI);
        tracer.setAttribute("transform", `translate(${pt.x.toFixed(2)},${pt.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
        tracer.style.opacity = cl > 0.005 && cl < 0.998 ? "1" : "0";
      };

      const applyProgress = (prog: number, ns: HTMLElement[], VH: number) => {
        const currentIdx = Math.floor(prog * (ns.length - 1) + 0.1);
        if (currentIdx >= 0 && currentIdx < EVENTS.length) {
          const ev = EVENTS[currentIdx];
          if (activeEventId.value !== ev.id) activeEventId.value = ev.id;
        } else if (currentIdx >= EVENTS.length) {
          activeEventId.value = null;
        }

        const off = totalLen * (1 - prog);
        pathBase.style.strokeDashoffset = String(off);
        pathAccent.style.strokeDashoffset = String(Math.max(0, off - 26));
        pathGlow.style.strokeDashoffset = String(off);
        posTracer(prog);
        ns.forEach((n, i) => n.classList.toggle("rm-node--lit", prog >= i / Math.max(ns.length - 1, 1) - 0.02));
        const endReached = prog >= 0.97;
        pageRoot?.classList.toggle("is-end-reached", endReached);
        finalRow?.classList.toggle("is-end-reached", endReached);
        finalNode?.classList.toggle("rm-node--lit", endReached);
        if (tracer && endReached) tracer.style.opacity = "0";

        rows.forEach((row, idx) => {
          const card = row.querySelector<HTMLElement>(".rm-card");
          const isLeft = row.classList.contains("rm-row--left");
          if (card && !revealed.has(card)) {
            const r = card.getBoundingClientRect();
            if (r.top < VH * 0.9) {
              revealed.add(card);
              if (gsap && enableCardReveal) {
                gsap.fromTo(card,
                  { opacity: 0, x: isLeft ? -70 : 70, y: 28, scale: 0.88, rotateY: isLeft ? -14 : 14 },
                  {
                    opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0,
                    duration: 0.85, ease: "back.out(1.4)", delay: idx * 0.04, clearProps: "transform"
                  });
              } else { card.style.opacity = "1"; card.style.transform = "none"; }
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
        if (Math.abs(targetProg - renderProg) >= 0.0012) {
          tracerRafId = requestAnimationFrame(animateTracer);
        }
      };

      const queueTracer = () => {
        if (tracerRafId) return;
        tracerRafId = requestAnimationFrame(animateTracer);
      };

      const rows = Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)"));

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
      container.querySelectorAll<HTMLElement>(".rm-node").forEach((n) => {
        n.addEventListener("mouseenter", () => n.classList.add("rm-node--hovered"));
        n.addEventListener("mouseleave", () => n.classList.remove("rm-node--hovered"));
      });
      if (gsap) {
        const hdr = document.querySelector(".rm-section__header");
        if (hdr) gsap.fromTo(hdr, { opacity: 0, y: -36 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" });
      }
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

    let cleanup: (() => void) | undefined;
    boot().then((fn) => { cleanup = fn as any; });
    return () => cleanup?.();
  });

  const toggleEvent = $((id: number) => {
    activeEventId.value = activeEventId.value === id ? null : id;
  });

  return (
    <div class="rm-page rm-page--day1" key="roadmap-day-1">
      <style>{`
        .rm-page--day1 {
          --rm-scroll-progress: 0;
          --rm-bg1-opacity: 1;
          --rm-bg2-opacity: 0;
          --rm-bg1-shift: 0px;
          --rm-bg2-shift: 0px;
          background: #030803;
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
          background: 
            linear-gradient(90deg, rgba(6, 14, 6, 0.65) 0%, rgba(6, 14, 6, 0.12) 20%, rgba(6, 14, 6, 0.12) 80%, rgba(6, 14, 6, 0.65) 100%);
          opacity: 1;
        }
        .rm-page--day1 .rm-event-glass {
          background: linear-gradient(145deg, rgba(14, 28, 14, 0.92), rgba(8, 18, 8, 0.86));
          border-color: rgba(99, 255, 44, 0.42);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(99,255,44,0.12), 0 22px 56px rgba(0,0,0,0.48);
          backdrop-filter: blur(24px);
        }
        .rm-page--day1 .rm-card {
           background: rgba(8, 16, 8, 0.94);
           backdrop-filter: blur(20px);
           border-color: rgba(99, 255, 44, 0.28);
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
           backdrop-filter: blur(28px);
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
        .rm-scene-art--i1 { opacity: var(--rm-bg1-opacity); transform: translate3d(0, var(--rm-bg1-shift), 0); }
        .rm-scene-art--i2 { opacity: var(--rm-bg2-opacity); transform: translate3d(0, var(--rm-bg2-shift), 0); }

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
        @media (max-width: 767px) {
          .rm-page--day1 .rm-timeline { isolation: isolate; }
          .rm-page--day1 .rm-line-svg { z-index: 5; overflow: visible; }
          .rm-page--day1 .rm-line-glow {
            stroke: #63ff2c !important;
            stroke-width: 22 !important;
            opacity: 0.34 !important;
            filter: blur(5px);
          }
          .rm-page--day1 .rm-line-base {
            stroke: rgba(215, 255, 74, 0.92) !important;
            stroke-width: 3.4 !important;
            opacity: 0.96 !important;
          }
          .rm-page--day1 .rm-line-accent {
            stroke: #f6ffd6 !important;
            stroke-width: 2.25 !important;
            opacity: 1 !important;
            filter: drop-shadow(0 0 12px rgba(153, 255, 79, 0.9)) !important;
          }
          .rm-page--day1 #rm-tracer-shell {
            fill: rgba(215, 255, 74, 0.62) !important;
            filter: drop-shadow(0 0 16px rgba(99, 255, 44, 0.92)) !important;
          }
          .rm-page--day1 #rm-tracer-arrow {
            fill: #ffffff !important;
            filter: drop-shadow(0 0 14px rgba(215, 255, 74, 1)) !important;
          }
          .rm-page--day1 .rm-end-popup { left: calc(100% + 0.95rem) !important; right: auto !important; top: 50% !important; bottom: auto !important; transform: translate(12px, -50%) scale(0.92) !important; min-width: 12rem !important; padding: 0.62rem 0.72rem !important; z-index: 10 !important; }
          .rm-page--day1 .rm-end-popup::after { left: -0.45rem !important; right: auto !important; top: 50% !important; bottom: auto !important; transform: translateY(-50%) rotate(45deg) !important; border-right: none !important; border-bottom: 1px solid rgba(215,255,74,0.24) !important; border-left: 1px solid rgba(215,255,74,0.24) !important; border-top: none !important; }
          .rm-page--day1.is-end-reached .rm-end-popup, .rm-page--day1 .rm-row--final.is-end-reached .rm-end-popup { transform: translate(0, -50%) scale(1) !important; }
        }
        .rm-row--final { margin-bottom: 0 !important; }
        .rm-timeline { padding-bottom: 0 !important; }
      `}</style>

      <div class="rm-scene-gallery">
        <div class="rm-scene-art rm-scene-art--i1">
          <img src="/roadmap-day1/i1.png" alt="Scene 1" />
        </div>
        <div class="rm-scene-art rm-scene-art--i2">
          <img src="/roadmap-day1/i2.png" alt="Scene 2" />
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
              <p class="rm-section__copy">Tap any card to reveal its event, team &amp; entry details.</p>
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
                  <stop offset="0%" stop-color="#d9ff4a" />
                  <stop offset="55%" stop-color="#63ff2c" />
                  <stop offset="100%" stop-color="#f4ff9b" />
                </linearGradient>
                <filter id="rm-glow-f" x="-40%" y="-10%" width="180%" height="120%">
                  <feGaussianBlur stdDeviation="10" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="rm-tracer-fill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fff" stop-opacity="1" />
                  <stop offset="45%" stop-color="#d7ff4a" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#63ff2c" stop-opacity="0" />
                </radialGradient>
              </defs>
              <path id="rm-line-glow" class="rm-line-glow" fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-base" class="rm-line-base" fill="none" stroke="url(#rm-grad-line)" />
              <path id="rm-line-accent" class="rm-line-accent" fill="none" stroke="rgba(255,255,255,0.7)" filter="url(#rm-glow-f)" />
              <g id="rm-tracer" style="opacity:0;will-change:transform;">
                {/* Outer Glow Arrow */}
                <path id="rm-tracer-shell" d="M -14,-10 L 18,0 L -14,10 C -10,4 -10,-4 -14,-10 Z" fill="url(#rm-tracer-fill)" filter="url(#rm-glow-f)" opacity="0.6" />
                {/* Sleek Core Arrow */}
                <path id="rm-tracer-arrow" d="M -12,-8 L 14,0 L -12,8 C -9,3 -9,-3 -12,-8 Z" fill="#fff" filter="url(#rm-glow-f)" />
                
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
              const meta = CAT[event.cat];
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              const isActive = activeEventId.value === event.id;
              const canRegister = event.cat !== "opening" && event.cat !== "cultural";
              return (
                <div key={event.id} class={["rm-row", `rm-row--${side}`]}>
                  <div class="rm-row__side rm-row__side--left">
                    {side === "left" ? <EventCard ev={event} meta={meta} isActive={isActive} side="left" onToggle$={() => toggleEvent(event.id)} /> : isActive && <PopupPanel ev={event} meta={meta} side="left" canRegister={canRegister} />}
                  </div>
                  <div class={["rm-row__center", `rm-row__center--${side === "left" ? "r" : "l"}`]}>
                    <div class="rm-node" style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`} data-snake-node="">
                      <span class="rm-node__pulse" /><span class="rm-node__halo" /><span class="rm-node__impact" />
                      <span class="rm-node__code">{meta.short}</span>
                      <span class="rm-node__time">{event.time}</span>
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
                  <span class="rm-node__pulse" /><span class="rm-node__halo" />
                  <span class="rm-node__code">END</span><span class="rm-node__time">09:00 PM</span>
                  <div class="rm-end-popup">
                    <span class="rm-end-popup__label">Omnitrix Synced</span>
                    <p>Day 1 locked in. Recharge the crew and get ready for Day 2.</p>
                  </div>
                </div>
              </div>
              <div class="rm-row__side rm-row__side--right">
                <div class="rm-end-card">
                  <span class="rm-pill">Finish</span>
                  <h3>Day 1 completed.</h3>
                  <p>Day 2 starts at 09:00 AM.</p>
                  <div class="rm-end-card__meta">
                    <span>Next sync ready</span><Link href="/events">Open events</Link>
                  </div>
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
          <span class="rm-dock__status"><span class="rm-dock__status-dot" />Ben 10 theme</span>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 1 Roadmap | Theta 2026",
  meta: [{ name: "description", content: "Day 1 roadmap redesign — Scene Gallery, auto-opening popups, Ben 10 theme." }],
};
