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

/* â”€â”€ One Piece event data â”€â”€ */
const EVENTS: EventData[] = [
  { id: 1, time: "09:00 AM", endTime: "10:00 AM", title: "Thousand Sunny Briefing",
    subtitle: "Grand Line departure â€” Day 2 kickoff", venue: "Main Auditorium, Block A", cat: "opening",
    fee: "Free", team: "Open to all", prize: "Daily logpose",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tags: ["Crew sync", "Island chart", "Log Pose reveal"],
    desc: "The second day signal fires across the Grand Line. Daily highlights, treasure route updates, and the full-crew morning assembly before the next island arc begins." },
  { id: 2, time: "10:00 AM", endTime: "01:00 PM", title: "Devil Fruit Code Sprint",
    subtitle: "Awaken your coding powers", venue: "Galvan Prime Lab, Block C", cat: "tech",
    fee: "Rs 100 / team", team: "2 to 3 members", prize: "Rs 15,000",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tags: ["3-hour sprint", "Live leaderboard", "Logic battles"],
    desc: "Eat the code-code fruit. Solve algorithmic and AI challenges under a blazing live scoreboard â€” only the strongest Devil Fruit users survive the Grand Line pressure." },
  { id: 3, time: "10:00 AM", endTime: "12:00 PM", title: "Marine Cipher Lab",
    subtitle: "Cyber & systems workshop", venue: "Plumber HQ, Block D", cat: "workshop",
    fee: "Rs 150 / head", team: "Individual", prize: "Treasure map + cert",
    img: "https://images.unsplash.com/photo-1629835775533-31682702c256?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live demo", "Mentor-led", "Cipher kit"],
    desc: "Decode the world's secrets. A guided workshop on cyber defense, AI-assisted security, and real-world penetration tactics â€” straight from the Marine intelligence files." },
  { id: 4, time: "02:00 PM", endTime: "03:30 PM", title: "Davy Back Trivia Fight",
    subtitle: "Rapid-fire quiz arena", venue: "Sector 7G, Block B", cat: "quiz",
    fee: "Rs 50 / team", team: "2 members", prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    tags: ["5 rounds", "30-second clock", "Buzzer duel"],
    desc: "The Davy Back Fight rules apply â€” five brutal rounds across tech, current affairs, and innovation. Win your crewmates' freedom or lose them to the rival ship." },
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
    desc: "Channel your inner Usopp â€” this movement-based campus challenge rewards communication, timing, and sharpshooter instincts more than raw speed." },
  { id: 7, time: "07:00 PM", endTime: "09:00 PM", title: "Baratie Grand Night",
    subtitle: "Open-air stage feast & finale", venue: "Open-Air Amphitheatre", cat: "cultural",
    fee: "Free", team: "Open to all", prize: "Festival encore",
    img: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live band", "Dance island", "Comedy duel"],
    desc: "The Baratie serves up a grand night â€” live music, campus performances, and a high-energy curtain call to wrap Day 2 of the Grand Line voyage." },
];

/* â”€â”€ One Piece CAT palette â”€ gold / cyan / teal / orange / aqua / amber â”€â”€ */
const CAT: Record<Cat, CatMeta> = {
  opening:  { label: "Opening",  short: "OP", color: "#f4c542", rgb: "244,197,66" },
  tech:     { label: "Tech",     short: "DF", color: "#f4c542", rgb: "244,197,66" },
  workshop: { label: "Workshop", short: "WS", color: "#f4c542", rgb: "244,197,66" },
  quiz:     { label: "Quiz",     short: "QZ", color: "#f4c542", rgb: "244,197,66" },
  fun:      { label: "Fun",      short: "FN", color: "#f4c542", rgb: "244,197,66" },
  cultural: { label: "Cultural", short: "CL", color: "#f4c542", rgb: "244,197,66" },
};

/* â”€â”€â”€ Popup Panel â€” same structure as Day 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
        <span class="rm-popup__time">{ev.time} â€“ {ev.endTime}</span>
      </div>
      <p class="rm-popup__title">{ev.title}</p>
      <p class="rm-popup__venue">ðŸ“ {ev.venue}</p>
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

/* â”€â”€â”€ Event Card â€” same structure as Day 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
          <span class="rm-card__toggle">{isActive ? "Retreat" : "Sail â†’"}</span>
        </div>
        <p class="rm-card__desc">{ev.desc}</p>
        <div class="rm-card__quick-meta">
          <span class="rm-card__meta-pill">{ev.venue}</span>
          <span class="rm-card__meta-pill">{ev.time} â€“ {ev.endTime}</span>
        </div>
        {isActive && (
          <p class="rm-card__popup-hint">â† See details panel â†’</p>
        )}
      </div>
    </article>
  ),
);

export default component$(function Day2Roadmap() {
  const activeEventId = useSignal<number | null>(null);

  useVisibleTask$(() => {
    /* â”€â”€ Set One Piece theme on entire site â”€â”€ */
    document.body.setAttribute("data-theme", "onepiece");
    return () => { document.body.removeAttribute("data-theme"); };
  });

  useVisibleTask$(() => {
    const page = document.querySelector(".rm-page--op") as HTMLElement | null;
    if (!page) return;

    const updateScroll = () => {
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollRatio = window.scrollY / scrollMax;
      page.style.setProperty("--rm-scroll-progress", scrollRatio.toFixed(4));

      const mix = (value: number, start: number, end: number) => {
        if (value <= start) return 0;
        if (value >= end) return 1;
        return (value - start) / (end - start);
      };

      const slide12 = mix(scrollRatio, 0.16, 0.46);
      const slide23 = mix(scrollRatio, 0.5, 0.82);
      const img1 = Math.max(0, 1 - slide12);
      const img2 = Math.max(0, Math.min(1, slide12 * (1 - slide23) + (1 - slide12) * 0.04));
      const img3 = Math.max(0, slide23);

      page.style.setProperty("--rm-bg1-opacity", img1.toFixed(4));
      page.style.setProperty("--rm-bg2-opacity", img2.toFixed(4));
      page.style.setProperty("--rm-bg3-opacity", img3.toFixed(4));
      page.style.setProperty("--rm-bg1-shift", `${(-180 * slide12).toFixed(2)}px`);
      page.style.setProperty("--rm-bg2-shift", `${(120 - 140 * slide12 - 90 * slide23).toFixed(2)}px`);
      page.style.setProperty("--rm-bg3-shift", `${(220 - 220 * slide23).toFixed(2)}px`);
    };

    page.style.setProperty("--rm-scroll-progress", "0");
    page.style.setProperty("--rm-bg1-opacity", "1");
    page.style.setProperty("--rm-bg2-opacity", "0");
    page.style.setProperty("--rm-bg3-opacity", "0");
    page.style.setProperty("--rm-bg1-shift", "0px");
    page.style.setProperty("--rm-bg2-shift", "0px");
    page.style.setProperty("--rm-bg3-shift", "0px");
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
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

      {/* â”€â”€ One Piece color overrides (structure unchanged) â”€â”€ */}
      <style>{`
        .rm-page--op {
          --rm-scroll-progress: 0;
          --rm-bg1-opacity: 1;
          --rm-bg2-opacity: 0;
          --rm-bg3-opacity: 0;
          --rm-bg1-shift: 0px;
          --rm-bg2-shift: 0px;
          --rm-bg3-shift: 0px;
          background: #05080d;
          color: #fff2d2;
        }
        .rm-page--op::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            linear-gradient(180deg, rgba(3, 6, 10, 0.62) 0%, rgba(4, 8, 14, 0.42) 18%, rgba(4, 8, 14, 0.56) 56%, rgba(2, 4, 8, 0.88) 100%),
            radial-gradient(circle at 50% 18%, rgba(255, 198, 92, 0.16), transparent 22%),
            radial-gradient(circle at 50% 78%, rgba(255, 124, 0, 0.08), transparent 24%);
          opacity: 1;
        }
        .rm-page--op::after {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            linear-gradient(90deg, rgba(2, 4, 8, 0.72) 0%, rgba(2, 4, 8, 0.18) 18%, rgba(2, 4, 8, 0.18) 82%, rgba(2, 4, 8, 0.72) 100%);
          opacity: 1;
        }
        .rm-page--op .rm-page__aurora--left,
        .rm-page--op .rm-page__aurora--right {
          display: none;
        }
        .rm-page--op .rm-bg-mark {
          position: absolute;
          top: clamp(5rem, 9vw, 7rem);
          right: clamp(1rem, 3vw, 3rem);
          width: clamp(16rem, 24vw, 21rem);
          opacity: 0.12;
          pointer-events: none;
          user-select: none;
          filter:
            drop-shadow(0 0 20px rgba(255, 183, 43, 0.18))
            drop-shadow(0 0 48px rgba(255, 183, 43, 0.12))
            saturate(1.08);
          mix-blend-mode: screen;
          z-index: 0;
        }
        .rm-page--op .rm-bg-mark img {
          display: block;
          width: 100%;
          height: auto;
        }
        .rm-page--op .rm-scene-gallery {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .rm-page--op .rm-scene-art {
          position: absolute;
          inset: 0;
          overflow: hidden;
          will-change: transform;
          transition: opacity 180ms linear, transform 180ms linear;
        }
        .rm-page--op .rm-scene-art::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 4, 8, 0.74), rgba(2, 4, 8, 0.48) 22%, rgba(2, 4, 8, 0.56) 58%, rgba(2, 4, 8, 0.92) 100%);
        }
        .rm-page--op .rm-scene-art img {
          display: block;
          width: 100%;
          height: 100vh;
          object-fit: cover;
          filter: saturate(0.92) contrast(1) brightness(0.34);
        }
        .rm-page--op .rm-scene-art--i1 {
          opacity: var(--rm-bg1-opacity);
          transform: translate3d(0, var(--rm-bg1-shift), 0) scale(1.05);
        }
        .rm-page--op .rm-scene-art--i2 {
          opacity: var(--rm-bg2-opacity);
          transform: translate3d(0, var(--rm-bg2-shift), 0) scale(1.05);
        }
        .rm-page--op .rm-scene-art--i3 {
          opacity: var(--rm-bg3-opacity);
          transform: translate3d(0, var(--rm-bg3-shift), 0) scale(1.05);
        }
        .rm-page--op .rm-scene-art--i1 img { object-position: center 22%; }
        .rm-page--op .rm-scene-art--i2 img { object-position: center center; }
        .rm-page--op .rm-scene-art--i3 img { object-position: center 35%; }
        .rm-page--op .rm-pill {
          background: linear-gradient(135deg, rgba(255,177,38,0.24), rgba(180,94,5,0.16));
          border-color: rgba(255,177,38,0.48);
          color: #ffbc34;
        }
        .rm-page--op .rm-section__title {
          background: linear-gradient(135deg, #ffb72b 0%, #ffd768 36%, #fff3c9 68%, #ff9c1a 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .rm-page--op .rm-section__copy {
          color: rgba(255, 239, 205, 0.84);
        }
        .rm-page--op .rm-event-glass {
          background: linear-gradient(145deg, rgba(10, 30, 52, 0.92), rgba(20, 56, 92, 0.82));
          border-color: rgba(255,177,38,0.34);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.09),
            0 0 34px rgba(255,177,38,0.16),
            0 18px 42px rgba(0,0,0,0.38);
        }
        .rm-page--op .rm-event-glass__count {
          background: linear-gradient(135deg, #ffb72b, #ffe28d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 16px rgba(255,177,38,0.52));
        }
        .rm-page--op .rm-event-glass__label { color: rgba(255, 237, 197, 0.76); }
        .rm-page--op .rm-event-glass__dot   { background: #ffbc34; box-shadow: 0 0 12px rgba(255,177,38,0.76); }
        .rm-page--op #rm-grad-line stop:nth-child(1) { stop-color: #ff8f14; }
        .rm-page--op #rm-grad-line stop:nth-child(2) { stop-color: #ffbc34; }
        .rm-page--op #rm-grad-line stop:nth-child(3) { stop-color: #ffe18e; }
        .rm-page--op #rm-grad-core stop:nth-child(1) { stop-color: #fff7dd; }
        .rm-page--op #rm-grad-core stop:nth-child(2) { stop-color: #ffbc34; }
        .rm-page--op #rm-grad-core stop:nth-child(3) { stop-color: #ffd46d; }
        .rm-page--op #rm-tracer-fill stop:nth-child(2) { stop-color: #ffbc34; }
        .rm-page--op #rm-tracer-fill stop:nth-child(3) { stop-color: #ffe18e; }
        .rm-page--op #rm-tracer-arrow { fill: #ffbc34; }
        .rm-page--op .rm-line-glow {
          stroke: #ffb72b;
          opacity: 0.26;
          filter: blur(10px);
        }
        .rm-page--op .rm-line-base {
          stroke: #ffb72b;
          opacity: 0.82;
        }
        .rm-page--op .rm-line-accent {
          stroke: #fff1c5;
          filter: drop-shadow(0 0 12px rgba(255,177,38,0.48));
        }
        .rm-page--op .rm-card,
        .rm-page--op .rm-popup__inner,
        .rm-page--op .rm-end-card {
          border-color: rgba(255,177,38,0.26);
          background: linear-gradient(180deg, rgba(5, 12, 20, 0.995), rgba(4, 10, 18, 0.998));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07),
            0 28px 70px rgba(0,0,0,0.62),
            0 0 0 1px rgba(0,0,0,0.32);
          backdrop-filter: blur(6px);
        }
        .rm-page--op .rm-card:hover,
        .rm-page--op .rm-card.is-active {
          border-color: rgba(255,177,38,0.38);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 34px 80px rgba(0,0,0,0.72),
            0 0 0 1px rgba(255,177,38,0.1),
            0 0 34px rgba(255,177,38,0.16);
        }
        .rm-page--op .rm-card__media-overlay {
          background: linear-gradient(180deg, rgba(2, 6, 12, 0.44), rgba(2, 6, 12, 0.9) 66%, rgba(4, 10, 20, 0.99));
        }
        .rm-page--op .rm-card__overline,
        .rm-page--op .rm-card__eyebrow,
        .rm-page--op .rm-popup__time,
        .rm-page--op .rm-popup__stat-l,
        .rm-page--op .rm-node__time {
          color: rgba(255, 230, 182, 0.62);
        }
        .rm-page--op .rm-card__title,
        .rm-page--op .rm-popup__title,
        .rm-page--op .rm-node__code,
        .rm-page--op .rm-end-card h3 {
          color: #fff4d0;
        }
        .rm-page--op .rm-card__desc,
        .rm-page--op .rm-popup__venue,
        .rm-page--op .rm-popup__stat-v,
        .rm-page--op .rm-end-card p,
        .rm-page--op .rm-end-card__meta span {
          color: rgba(255, 244, 220, 0.92);
        }
        .rm-page--op .rm-card__chip,
        .rm-page--op .rm-card__meta-pill,
        .rm-page--op .rm-popup__tag,
        .rm-page--op .rm-popup__chip,
        .rm-page--op .rm-card__toggle {
          border-color: rgba(255,177,38,0.24);
          background: rgba(255,177,38,0.1);
          color: #ffbc34;
        }
        .rm-page--op .rm-card__chip-dot,
        .rm-page--op .rm-popup__dot {
          background: #ffbc34;
          box-shadow: 0 0 10px rgba(255,177,38,0.82);
        }
        .rm-page--op .rm-popup__action--primary,
        .rm-page--op .rm-end-card__meta a {
          color: #07111d;
          background: linear-gradient(135deg, #ffb72b, #ffd76a);
          border-color: rgba(255,177,38,0.44);
          box-shadow: 0 14px 28px rgba(255,177,38,0.24);
        }
        .rm-page--op .rm-popup__action--ghost {
          color: #fff0cf;
          border-color: rgba(255,177,38,0.28);
          background: rgba(255,177,38,0.1);
        }
        .rm-page--op .rm-popup__open-badge {
          color: #ffbc34;
          border-color: rgba(255,177,38,0.26);
          background: rgba(255,177,38,0.1);
        }
        .rm-page--op .rm-popup__ripple {
          border-color: rgba(255,177,38,0.24);
        }
        .rm-page--op .rm-node,
        .rm-page--op .rm-node--finish {
          border-color: rgba(255,177,38,0.44);
          background: radial-gradient(circle at 50% 32%, rgba(255,177,38,0.22), rgba(7,15,28,0.96) 72%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 0 34px rgba(255,177,38,0.16),
            0 24px 50px rgba(0,0,0,0.38);
        }
        .rm-page--op .rm-node__pulse,
        .rm-page--op .rm-node__halo,
        .rm-page--op .rm-node__impact {
          border-color: rgba(255,177,38,0.34);
        }
        .rm-page--op .rm-node--lit {
          border-color: #ffbc34;
          box-shadow: 0 0 0 3px rgba(255,177,38,0.18), 0 0 24px rgba(255,177,38,0.56), 0 0 56px rgba(255,177,38,0.22);
          background: radial-gradient(circle at 50% 32%, rgba(255,177,38,0.28), rgba(8,18,32,0.96) 70%);
        }
        .rm-page--op .rm-node--hovered {
          border-color: rgba(255,177,38,0.98);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            0 0 38px rgba(255,177,38,0.48),
            0 0 82px rgba(255,177,38,0.22),
            0 28px 60px rgba(0,0,0,0.46);
        }
        .rm-page--op ~ .rm-dock .rm-dock__inner,
        .rm-dock--op .rm-dock__inner {
          border-color: rgba(255,177,38,0.32);
          background: linear-gradient(180deg, rgba(10, 27, 46, 0.97), rgba(6, 16, 30, 0.94));
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 22px rgba(255,177,38,0.1);
        }
        .rm-dock--op .rm-dock__item,
        .rm-dock--op .rm-dock__status {
          color: rgba(255, 239, 205, 0.8);
        }
        .rm-dock--op .rm-dock__item.is-active {
          color: #ffbc34;
          background: rgba(255,177,38,0.16);
          border: 1px solid rgba(255,177,38,0.38);
        }
        .rm-dock--op .rm-dock__item:hover { color: #ffbc34; background: rgba(255,177,38,0.1); }
        .rm-dock--op .rm-dock__status-dot { background: #ffbc34; box-shadow: 0 0 10px rgba(255,177,38,0.76); }
        .rm-page--op .rm-end-card {
          background: linear-gradient(135deg, rgba(12,31,50,0.96), rgba(22,55,88,0.94));
          border-color: rgba(255,177,38,0.28);
        }
        .rm-page--op .rm-end-card h3 { color: #ffbc34; }
        .rm-page--op .rm-end-card__meta a:hover { background: linear-gradient(135deg, #ffc64a, #ffe59a); }
        .rm-page--op .rm-end-card__note {
          margin-top: 1rem;
          padding: 0.95rem 1rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 177, 38, 0.2);
          background:
            linear-gradient(135deg, rgba(255, 183, 43, 0.08), rgba(255, 130, 0, 0.04)),
            rgba(6, 16, 28, 0.78);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 14px 34px rgba(0,0,0,0.24);
        }
        .rm-page--op .rm-end-card__note-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #ffbc34;
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .rm-page--op .rm-end-card__note-label::before {
          content: "";
          width: 0.45rem;
          height: 0.45rem;
          border-radius: 999px;
          background: #ffbc34;
          box-shadow: 0 0 10px rgba(255,177,38,0.8);
        }
        .rm-page--op .rm-end-card__note p {
          margin: 0.65rem 0 0;
          color: rgba(255, 244, 220, 0.88);
          font-size: 0.85rem;
          line-height: 1.6;
        }
        .rm-page--op .rm-shell,
        .rm-page--op .rm-section,
        .rm-page--op .rm-timeline {
          position: relative;
          z-index: 1;
        }
        @media (max-width: 767px) {
          .rm-page--op .rm-row--final {
            grid-template-columns: 3rem minmax(0, 1fr);
            align-items: start;
          }
          .rm-page--op .rm-row--final .rm-row__center {
            grid-column: 1;
            grid-row: 1;
            align-items: center;
          }
          .rm-page--op .rm-row--final .rm-row__side--left {
            display: none;
          }
          .rm-page--op .rm-row--final .rm-row__side--right {
            grid-column: 2;
            grid-row: 1;
            display: flex;
            justify-content: stretch;
          }
          .rm-page--op .rm-row--final .rm-end-card {
            width: 100%;
            margin-top: 0.2rem;
            padding: 1rem;
          }
          .rm-page--op .rm-row--final .rm-node--finish {
            margin-top: 0.35rem;
          }
          .rm-page--op .rm-end-card__note {
            margin-top: 0.85rem;
            padding: 0.85rem 0.9rem;
          }
          .rm-page--op .rm-bg-mark {
            top: 6rem;
            right: -2rem;
            width: 12rem;
            opacity: 0.1;
          }
          .rm-page--op .rm-scene-gallery {
            inset: 0;
          }
          .rm-page--op .rm-scene-art {
            position: absolute;
            inset: 0;
          }
          .rm-page--op .rm-scene-art--i2 img { object-position: center top; }
        }
      `}</style>
      <div class="rm-scene-gallery" aria-hidden="true">
        <div class="rm-scene-art rm-scene-art--i1">
          <img src="/roadmap-day2/i1.png" alt="" />
        </div>
        <div class="rm-scene-art rm-scene-art--i2">
          <img src="/roadmap-day2/i2.png" alt="" />
        </div>
        <div class="rm-scene-art rm-scene-art--i3">
          <img src="/roadmap-day2/i3.png" alt="" />
        </div>
      </div>
      <div class="rm-bg-mark" aria-hidden="true">
        <img src="/onepeice/one-peice-logo.png" alt="" />
      </div>
      <div class="rm-page__aurora rm-page__aurora--left"  />
      <div class="rm-page__aurora rm-page__aurora--right" />

      <section class="rm-section rm-section--top">
        <div class="rm-shell">

          {/* Header */}
          <div class="rm-section__header">
            <div class="rm-section__header-text">
              <span class="rm-pill">âš“ Grand Line</span>
              <h1 class="rm-section__title">Day 2 â€” The Grand Line Voyage</h1>
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
                  <span class="rm-pill">âš“ Dock</span>
                  <h3>Day 2 completed.</h3>
                  <p>Day 3 sails at 09:00 AM.</p>
                  <div class="rm-end-card__meta">
                    <span>Next island ready</span>
                    <Link href="/events">Open events</Link>
                  </div>
                  <div class="rm-end-card__note">
                    <span class="rm-end-card__note-label">Captain&apos;s Note</span>
                    <p>The crew has crossed the Grand Line for Day 2. Take a breath, review the voyage, and get ready for the Day 3 final island push.</p>
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
    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 2 Roadmap | Theta 2026 â€” One Piece Grand Line",
  meta: [{ name: "description", content: "Day 2 roadmap for Theta 2026 â€” One Piece Grand Line theme, S-curve timeline, GSAP card reveals." }],
};


