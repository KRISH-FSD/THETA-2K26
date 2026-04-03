import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  useStore,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import gsap from "gsap";

/* ─── Slide data — replace bgImage paths with your real images ─── */
export const heroSlides = [
  {
    id: 0,
    day: "Day 1",
    title: "The Grand Inauguration",
    subtitle: "THETA 2026",
    description: "Musical Fusion · Opening Ceremony · Cultural Night",
    accentColor: "#00ff44",
    accentRgb: "0,255,68",
    bgImage: "/day/day-1.png",
    thumb: "/day/day-1.png",
  },
  {
    id: 1,
    day: "Day 2",
    title: "Flagship Competitions",
    subtitle: "THETA 2026",
    description: "Hackathon · Robotics · AI/ML Showdown",
    accentColor: "#f5c842",
    accentRgb: "245,200,66",
    bgImage: "/day/day-2.png",
    thumb: "/day/day-2.png",
  },
  {
    id: 2,
    day: "Day 3",
    title: "Grand Finale & Awards",
    subtitle: "THETA 2026",
    description: "Prize Distribution · Valedictory · Networking Night",
    accentColor: "#ff3333",
    accentRgb: "255,51,51",
    bgImage: "/day/day-3.png",
    thumb: "/day/day-3.png",
  },
];

/* ─── Countdown Component ─── */
const HeroCountdown = component$((props: { targetDate: string }) => {
  const timeLeft = useStore({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useVisibleTask$(() => {
    const target = new Date(props.targetDate).getTime();
    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        timeLeft.days = "00";
        timeLeft.hours = "00";
        timeLeft.minutes = "00";
        timeLeft.seconds = "00";
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      timeLeft.days = d.toString().padStart(2, "0");
      timeLeft.hours = h.toString().padStart(2, "0");
      timeLeft.minutes = m.toString().padStart(2, "0");
      timeLeft.seconds = s.toString().padStart(2, "0");
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div class="hs-countdown-wrap">
      <div class="hs-countdown-card">
        <div class="hs-countdown-inner">
          <div class="hs-omnitrix-shell">
            <div class="hs-omnitrix-glow"></div>
            <img
              src="/ben10/ben10-logo.png"
              alt="Ben 10"
              class="hs-omnitrix-icon"
            />
          </div>

          <div class="hs-countdown-numbers">
            {[
              { val: timeLeft.days, label: "DD" },
              { val: timeLeft.hours, label: "HH" },
              { val: timeLeft.minutes, label: "MM" },
              { val: timeLeft.seconds, label: "SS" },
            ].map((unit, i) => (
              <div key={i} class="hs-countdown-unit-wrap">
                <div class="hs-countdown-unit">
                  <span class="hs-countdown-value">{unit.val}</span>
                  <span class="hs-countdown-label">{unit.label}</span>
                </div>
                {i < 3 && <div class="hs-countdown-sep">:</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ─── Main Component ─── */
export const HeroSlider = component$(() => {
  const active = useSignal(0);
  const isAnimating = useSignal(false);
  const progress = useSignal(0);
  const state = useStore({ startTime: 0 });

  const goTo = $((idx: number) => {
    if (isAnimating.value || idx === active.value) return;
    isAnimating.value = true;
    active.value = idx;
    progress.value = 0;
    state.startTime = performance.now();

    const tl = gsap.timeline();
    tl.fromTo(".hs-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
    tl.fromTo(".hs-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.4");
    tl.fromTo(".hs-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".hs-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");

    setTimeout(() => { isAnimating.value = false; }, 900);
  });

  /* UNSTOPPABLE Progress bar & auto-advance */
  useVisibleTask$(() => {
    state.startTime = performance.now();
    const duration = 6000;
    let rafId: number;

    const tick = () => {
      const now = performance.now();
      const elapsed = now - state.startTime;
      progress.value = Math.min((elapsed / duration) * 100, 100);
      
      if (elapsed >= duration) {
        state.startTime = now; 
        progress.value = 0;
        const nextIdx = (active.value + 1) % heroSlides.length;
        goTo(nextIdx);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  });

  useVisibleTask$(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(".hs-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
    tl.fromTo(".hs-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.4");
    tl.fromTo(".hs-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".hs-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
    tl.fromTo(".hs-countdown-wrap", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
  });

  const slide = heroSlides[active.value];

  return (
    <section id="hero-slider" class="hs-root relative overflow-hidden" 
             style={`--hs-accent:${slide.accentColor};--hs-accent-rgb:${slide.accentRgb};`}>
      
      {/* Backgrounds */}
      {heroSlides.map((s, i) => (
        <div key={s.id} class="hs-bg" 
             style={{ 
               opacity: active.value === i ? "1" : "0", 
               backgroundImage: `url(${s.bgImage})`,
               transform: active.value === i ? "scale(1)" : "scale(1.04)"
             }}>
          <div class="hs-overlay" style={{ background: `linear-gradient(108deg, rgba(10,6,25,0.82) 0%, rgba(10,6,25,0.55) 50%, rgba(10,6,25,0.2) 100%), linear-gradient(to top, rgba(10,6,25,0.95) 0%, transparent 45%)` }} />
          <div class="hs-tint" style={{ background: `radial-gradient(ellipse 70% 60% at 80% 40%, rgba(${s.accentRgb},0.18), transparent 70%)`, opacity: active.value === i ? "1" : "0" }} />
        </div>
      ))}

      <div class="hs-grain" />

      {/* Content */}
      <div class="hs-content">
        <div class="hs-badge">
          <span class="hs-badge-text">{slide.day} · {slide.subtitle}</span>
        </div>
        <h1 class="hs-title font-black uppercase">{slide.title}</h1>
        <p class="hs-desc">{slide.description}</p>
        <div class="hs-actions">
          <a href="/roadmap/day1" class="hs-cta hs-cta--primary">
            View Roadmap
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="/events" class="hs-cta hs-cta--secondary">
            Explore All
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <Link href="/contact" class="hs-cta hs-cta--ghost">Contact Team</Link>
        </div>
      </div>

      <HeroCountdown targetDate="2026-04-11T09:00:00" />
      
      {/* Dots */}
      <div class="hs-dots">
        {heroSlides.map((s, i) => (
          <button key={s.id} 
                  class={`hs-dot ${active.value === i ? "hs-dot--active" : ""}`}
                  style={active.value === i ? { background: slide.accentColor, boxShadow: `0 0 8px ${slide.accentColor}` } : {}}
                  onClick$={() => goTo(i)} />
        ))}
      </div>

      {/* Thumbs */}
      <div class="hs-thumbs">
        {heroSlides.map((s, i) => (
          <button key={s.id} 
                  class={`hs-thumb ${active.value === i ? "hs-thumb--active" : ""}`}
                  style={active.value === i ? { borderColor: s.accentColor, boxShadow: `0 0 0 2px ${s.accentColor}44, 0 8px 24px rgba(0,0,0,0.5)` } : {}}
                  onClick$={() => goTo(i)}>
            <img src={s.thumb} alt={s.day} class="hs-thumb-img" loading="lazy" />
            <div class="hs-thumb-overlay" style={active.value === i ? { background: `linear-gradient(to top, rgba(${s.accentRgb},0.55), transparent)` } : {}} />
            <span class="hs-thumb-label" style={active.value === i ? { color: s.accentColor } : {}}>{s.day}</span>
            {active.value === i && <div class="hs-thumb-line" style={{ background: s.accentColor }} />}
          </button>
        ))}
      </div>

      {/* UNSTOPPABLE PROGRESS BAR (Absolute Bottom) */}
      <div class="absolute bottom-0 left-0 z-50 h-[2.5px] w-full bg-white/5 pointer-events-none overflow-hidden">
        <div class="h-full shadow-[0_0_15px_var(--hs-accent)]"
             style={{ 
               width: `${progress.value}%`, 
               background: slide.accentColor,
               /* No CSS transitions here! JS handles the smoothness via RAF */
               willChange: "width"
             }} />
      </div>
    </section>
  );
});
