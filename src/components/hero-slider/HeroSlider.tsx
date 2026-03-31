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
    accentColor: "#a8ff3a",
    accentRgb: "168,255,58",
    /**
     * 📸 IMAGE PLACEHOLDER — Day 1
     * Replace the src below with your actual image path.
     * Recommended: a wide (16:9) hero shot, ≥1920×1080px.
     * Place the file at:  public/hero/day-1.jpg
     * Then set:           bgImage: "/hero/day-1.jpg"
     */
    bgImage: "/day/day-1.png",
    /**
     * 📸 THUMBNAIL PLACEHOLDER — Day 1
     * A square/portrait crop of the same photo.
     * Place at: public/hero/day-1-thumb.jpg
     * Then set: thumb: "/hero/day-1-thumb.jpg"
     */
    thumb: "/day/day-1.png",
  },
  {
    id: 1,
    day: "Day 2",
    title: "Flagship Competitions",
    subtitle: "THETA 2026",
    description: "Hackathon · Robotics · AI/ML Showdown",
    accentColor: "#06d6f0",
    accentRgb: "6,214,240",
    /**
     * 📸 IMAGE PLACEHOLDER — Day 2
     * Place at: public/hero/day-2.jpg
     * Then set: bgImage: "/hero/day-2.jpg"
     */
    bgImage: "/day/day-2.png",
    /**
     * 📸 THUMBNAIL PLACEHOLDER — Day 2
     * Place at: public/hero/day-2-thumb.jpg
     * Then set: thumb: "/hero/day-2-thumb.jpg"
     */
    thumb: "/day/day-2.png",
  },
  {
    id: 2,
    day: "Day 3",
    title: "Grand Finale & Awards",
    subtitle: "THETA 2026",
    description: "Prize Distribution · Valedictory · Networking Night",
    accentColor: "#f5c842",
    accentRgb: "245,200,66",
    /**
     * 📸 IMAGE PLACEHOLDER — Day 3
     * Place at: public/hero/day-3.jpg
     * Then set: bgImage: "/hero/day-3.jpg"
     */
    bgImage: "/day/day-3.png",
    /**
     * 📸 THUMBNAIL PLACEHOLDER — Day 3
     * Place at: public/hero/day-3-thumb.jpg
     * Then set: thumb: "/hero/day-3-thumb.jpg"
     */
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

/* ─── Component ─── */
export const HeroSlider = component$(() => {
  const active = useSignal(0);
  const isAnimating = useSignal(false);
  const progress = useSignal(0);

  const state = useStore({ paused: false });

  /* Progress bar & auto-advance */
  useVisibleTask$(() => {
    let startTime = performance.now();
    const duration = 6000;
    let rafId: number;

    const tick = (now: number) => {
      if (!state.paused) {
        const elapsed = now - startTime;
        progress.value = Math.min((elapsed / duration) * 100, 100);
        if (elapsed >= duration) {
          active.value = (active.value + 1) % heroSlides.length;
          startTime = performance.now();
          progress.value = 0;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  });

  const goTo = $((idx: number) => {
    if (isAnimating.value || idx === active.value) return;
    isAnimating.value = true;
    active.value = idx;
    progress.value = 0;

    // GSAP entry animation for text
    const tl = gsap.timeline();
    tl.fromTo(
      ".hs-badge",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" },
    );
    tl.fromTo(
      ".hs-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
      "-=0.4",
    );
    tl.fromTo(
      ".hs-desc",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" },
      "-=0.5",
    );
    tl.fromTo(
      ".hs-cta",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.4",
    );

    setTimeout(() => {
      isAnimating.value = false;
    }, 900);
  });

  useVisibleTask$(() => {
    // Initial GSAP animation
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(
      ".hs-badge",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" },
    );
    tl.fromTo(
      ".hs-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
      "-=0.4",
    );
    tl.fromTo(
      ".hs-desc",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" },
      "-=0.5",
    );
    tl.fromTo(
      ".hs-cta",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.4",
    );
    tl.fromTo(
      ".hs-countdown-wrap",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6",
    );
  });

  const slide = heroSlides[active.value];

  return (
    <section
      id="hero-slider"
      class="hs-root"
      style={`--hs-accent:${slide.accentColor};--hs-accent-rgb:${slide.accentRgb};`}
      onMouseEnter$={() => {
        state.paused = true;
      }}
      onMouseLeave$={() => {
        state.paused = false;
      }}
    >
      {/* ── Background slides ── */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          class="hs-bg"
          style={{
            opacity: active.value === i ? "1" : "0",
            backgroundImage: `url(${s.bgImage})`,
            transform: active.value === i ? "scale(1)" : "scale(1.04)",
          }}
        >
          {/* Dark gradient overlay */}
          <div
            class="hs-overlay"
            style={{
              background: `linear-gradient(
                108deg,
                rgba(10,6,25,0.82) 0%,
                rgba(10,6,25,0.55) 50%,
                rgba(10,6,25,0.2) 100%
              ), linear-gradient(
                to top,
                rgba(10,6,25,0.95) 0%,
                transparent 45%
              )`,
            }}
          />

          {/* Colour tint from accent */}
          <div
            class="hs-tint"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 80% 40%, rgba(${s.accentRgb},0.18), transparent 70%)`,
              opacity: active.value === i ? "1" : "0",
            }}
          />
        </div>
      ))}

      {/* ── Grain texture ── */}
      <div class="hs-grain" />

      {/* ── Main content ── */}
      <div class="hs-content">
        {/* Badge */}
        <div class="hs-badge">
          <span class="hs-badge-text">
            {slide.day} · {slide.subtitle}
          </span>
        </div>

        {/* Title */}
        <h1 class="hs-title font-black uppercase">{slide.title}</h1>

        {/* Description */}
        <p class="hs-desc">{slide.description}</p>

        <div class="hs-actions">
          <a href="/roadmap/day1" class="hs-cta hs-cta--primary">
            View Roadmap
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              style="flex-shrink:0"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a href="/events" class="hs-cta hs-cta--secondary">
            Explore All
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              style="flex-shrink:0"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <Link href="/contact" class="hs-cta hs-cta--ghost">
            Contact Team
          </Link>
        </div>
      </div>

      {/* Countdown - moved outside hs-content for bottom-right absolute positioning */}
      <HeroCountdown targetDate="2026-04-11T09:00:00" />

      {/* Progress bar */}
      <div class="hs-progress-wrap">
        <div class="hs-progress-track">
          <div
            class="hs-progress-fill"
            style={{
              width: `${progress.value}%`,
              background: slide.accentColor,
            }}
          />
        </div>
      </div>
      <div class="hs-dots">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            class={`hs-dot ${active.value === i ? "hs-dot--active" : ""}`}
            style={
              active.value === i
                ? {
                    background: slide.accentColor,
                    boxShadow: `0 0 8px ${slide.accentColor}`,
                  }
                : {}
            }
            onClick$={() => goTo(i)}
            aria-label={`Go to ${s.day}`}
          />
        ))}
      </div>

      {/* ── Thumbnail strip (bottom) ── */}
      <div class="hs-thumbs">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            class={`hs-thumb ${active.value === i ? "hs-thumb--active" : ""}`}
            style={
              active.value === i
                ? {
                    borderColor: s.accentColor,
                    boxShadow: `0 0 0 2px ${s.accentColor}44, 0 8px 24px rgba(0,0,0,0.5)`,
                  }
                : {}
            }
            onClick$={() => goTo(i)}
            aria-label={`Switch to ${s.day}`}
          >
            <img
              src={s.thumb}
              alt={s.day}
              class="hs-thumb-img"
              loading="lazy"
            />
            {/* Thumb overlay */}
            <div
              class="hs-thumb-overlay"
              style={
                active.value === i
                  ? {
                      background: `linear-gradient(to top, rgba(${s.accentRgb},0.55), transparent)`,
                    }
                  : {}
              }
            />
            {/* Day label */}
            <span
              class="hs-thumb-label"
              style={active.value === i ? { color: s.accentColor } : {}}
            >
              {s.day}
            </span>
            {/* Active indicator line */}
            {active.value === i && (
              <div
                class="hs-thumb-line"
                style={{ background: s.accentColor }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
});
