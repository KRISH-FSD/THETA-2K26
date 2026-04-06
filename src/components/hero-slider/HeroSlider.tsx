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
    accentColor: "#38bdf8",
    accentRgb: "56, 189, 248",
    bgImage: "/homepage/i1.png",
    bgVideo: "/homepage/v1.mp4",
    thumb: "/homepage/i1.png",
  },
  /* 
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
  */
  {
    id: 2,
    day: "Day 3",
    title: "Grand Finale & Awards",
    subtitle: "THETA 2026",
    description: "Prize Distribution · Valedictory · Networking Night",
    accentColor: "#ff3333",
    accentRgb: "255,51,51",
    bgImage: "/homepage/i3.png",
    mobileBgImage: "/homepage/i3-mobile.png",
    thumb: "/homepage/i3.png",
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
  const heroRef = useSignal<HTMLElement>();
  const videoRef = useSignal<HTMLVideoElement>();
  const isDesktop = useSignal(false);
  const isHeroInView = useSignal(true);
  const isVideoLoading = useSignal(false);
  const slideProgress = useSignal(0);
  const state = useStore({ startTime: 0 });

  const goTo = $((idx: number) => {
    if (isAnimating.value || idx === active.value) return;
    isAnimating.value = true;
    active.value = idx;
    state.startTime = performance.now();

    /* Content Entrance Animations */
    const tl = gsap.timeline();

    tl.fromTo(".hs-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
    tl.fromTo(".hs-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.4");
    tl.fromTo(".hs-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".hs-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");

    setTimeout(() => { isAnimating.value = false; }, 900);
  });

  useVisibleTask$(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(".hs-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
    tl.fromTo(".hs-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.4");
    tl.fromTo(".hs-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".hs-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
  });

  useVisibleTask$(({ cleanup }) => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => {
      isDesktop.value = mediaQuery.matches;
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    const hero = heroRef.value;
    if (!hero) {
      cleanup(() => mediaQuery.removeEventListener("change", syncViewport));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInView.value = entry?.isIntersecting ?? false;
      },
      { threshold: 0.2 },
    );

    observer.observe(hero);
    cleanup(() => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", syncViewport);
    });
  });

  useVisibleTask$(({ cleanup, track }) => {
    track(() => active.value);
    track(() => isDesktop.value);
    track(() => isHeroInView.value);

    const activeSlide = heroSlides[active.value];

    if (!isHeroInView.value) {
      return;
    }

    // Video handles its own progress in the next task block
    if (activeSlide.bgVideo && isDesktop.value) {
      return;
    }

    const duration = 6000;
    const rafId = window.requestAnimationFrame(() => {
    });
    // Sync signal for thumbnails
    const start = performance.now();
    const updateSignal = (time: number) => {
      const elapsed = time - start;
      slideProgress.value = Math.min((elapsed / duration) * 100, 100);
      if (elapsed < duration) requestAnimationFrame(updateSignal);
    };
    const signalRaf = requestAnimationFrame(updateSignal);

    cleanup(() => {
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(signalRaf);
    });

    const timeoutId = window.setTimeout(() => {
      const nextIdx = (active.value + 1) % heroSlides.length;
      goTo(nextIdx);
    }, duration);

    cleanup(() => {
      window.clearTimeout(timeoutId);
      slideProgress.value = 0;
    });
  },
  );

  useVisibleTask$(({ cleanup, track }) => {
    track(() => active.value);
    track(() => isDesktop.value);
    track(() => isHeroInView.value);

    const activeSlide = heroSlides[active.value];
    const currentVideo = videoRef.value;
    const shouldTrackVideo =
      !!currentVideo && !!activeSlide.bgVideo && isDesktop.value && isHeroInView.value;

    isVideoLoading.value = shouldTrackVideo;

    if (!shouldTrackVideo || !currentVideo) {
      return;
    }

    const handleReady = () => {
      isVideoLoading.value = false;
    };

    if (currentVideo.readyState >= 2) {
      isVideoLoading.value = false;
      return;
    }

    currentVideo.addEventListener("loadeddata", handleReady);
    currentVideo.addEventListener("canplay", handleReady);

    cleanup(() => {
      currentVideo.removeEventListener("loadeddata", handleReady);
      currentVideo.removeEventListener("canplay", handleReady);
    });
  });

  useVisibleTask$(({ cleanup, track }) => {
    track(() => active.value);
    track(() => isDesktop.value);
    track(() => isHeroInView.value);

    const videos = document.querySelectorAll<HTMLVideoElement>("[data-hero-video]");

    videos.forEach((video, index) => {
      if (index === active.value && isHeroInView.value && isDesktop.value) {
        void video.play().catch(() => {
          // Ignore autoplay interruptions from the browser.
        });
        return;
      }

      video.pause();
    });

    const currentVideo = videoRef.value;
    const activeSlide = heroSlides[active.value];

    if (!currentVideo || !activeSlide.bgVideo || !isDesktop.value) {
      return;
    }

    const syncProgress = () => {
      const duration = currentVideo.duration;
      if (!duration || Number.isNaN(duration)) {
        slideProgress.value = 0;
        return;
      }

      const pct = Math.min((currentVideo.currentTime / duration) * 100, 100);
      slideProgress.value = pct;
    };

    const handleEnded = () => {
      const nextIdx = (active.value + 1) % heroSlides.length;
      void goTo(nextIdx);
    };

    currentVideo.addEventListener("loadedmetadata", syncProgress);
    currentVideo.addEventListener("timeupdate", syncProgress);
    currentVideo.addEventListener("ended", handleEnded);

    cleanup(() => {
      currentVideo.removeEventListener("loadedmetadata", syncProgress);
      currentVideo.removeEventListener("timeupdate", syncProgress);
      currentVideo.removeEventListener("ended", handleEnded);
    });
  });

  const slide = heroSlides[active.value];
  const isDay1DesktopVideo = slide.id === 0 && !!slide.bgVideo && isDesktop.value;

  return (
    <section id="hero-slider" ref={heroRef} class="hs-root relative overflow-hidden"
      style={`--hs-accent:${slide.accentColor};--hs-accent-rgb:${slide.accentRgb};`}>

      {/* Backgrounds - Map all for crossfade */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          class={["hs-bg", active.value === i ? "hs-bg--active" : "hs-bg--inactive"]}
          style={{
            zIndex: active.value === i ? 2 : 1,
            opacity: active.value === i ? 1 : 0,
            transition: "none",
            transform: "none"
          }}
        >
          {s.bgVideo && isDesktop.value ? (
            isHeroInView.value && active.value === i ? (
              <video
                ref={videoRef}
                class="absolute inset-0 h-full w-full object-cover"
                data-hero-video
                src={s.bgVideo}
                autoplay
                muted
                playsInline
                preload="none"
                poster={s.bgImage}
                disablePictureInPicture
                style="will-change: transform;"
              />
            ) : (
              <div
                class="absolute inset-0 h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${s.bgImage})`, willChange: "opacity" }}
              />
            )
          ) : (
            <div
              class="absolute inset-0 h-full w-full bg-cover"
              style={{
                backgroundImage: `url(${(!isDesktop.value && (s as any).mobileBgImage) ? (s as any).mobileBgImage : s.bgImage})`,
                backgroundPosition: s.id === 2 ? 'center 15%' : 'center',
                willChange: "opacity"
              }}
            />
          )}
          {/* Dynamic Overlay: Day 1 & 3 get light bottom darkness only to showcase visuals, Day 2 gets cinematic darkness for navigation visibility */}
          <div class="hs-overlay" style={{
            background: (s.id === 0 || s.id === 2)
              ? "linear-gradient(to top, rgba(5,3,15,0.85) 0%, rgba(5,3,15,0.4) 20%, transparent 50%)"
              : "linear-gradient(108deg, rgba(5,3,15,0.65) 0%, rgba(5,3,15,0.45) 45%, rgba(5,3,15,0.1) 100%), linear-gradient(to top, rgba(5,3,15,1) 0%, rgba(5,3,15,0.44) 32%, transparent 100%)"
          }} />
          <div class="hs-tint" style={{ background: `radial-gradient(ellipse 70% 60% at 80% 40%, rgba(${s.accentRgb},0.08), transparent 70%)` }} />
          {i === 0 && isDesktop.value && isVideoLoading.value && active.value === 0 && (
            <div class="hs-video-loader">
              <div
                class="hs-video-loader__poster"
                style={{ backgroundImage: `url(${s.bgImage})` }}
              />
              <div class="hs-video-loader__veil" />
              <div class="hs-video-loader__content">
                <span class="hs-video-loader__label">Loading Day 1 video...</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div class="hs-grain" />

      {/* Content: Hidden for Day 1 on desktop and Day 3 alone to favor visuals */}
      {!(slide.id === 0 && isDesktop.value) && slide.id !== 2 && <div class="hs-content">
        <div class="hs-badge">
          <span class="hs-badge-text">{slide.subtitle}</span>
        </div>
        <h1 class="hs-title font-black uppercase text-center t-gradient-blue">{slide.title}</h1>
        <p class="hs-desc text-center">{slide.description}</p>
        <div class="hs-actions">
          <div class="hs-actions__row">
            <a href={`/roadmap/day${slide.id + 1}`} class="t-button-neon hs-cta--primary">
              View Roadmap
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div class="hs-actions__row">
            <a href="/events" class="t-button-neon hs-cta--secondary">
              Explore All
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <Link href="/contact" class="t-button-neon hs-cta--ghost">Contact Team</Link>
          </div>
        </div>
      </div>}

      <div class="hs-hero-countdown">
        <HeroCountdown targetDate="2026-04-11T09:00:00" />
      </div>

      {isDesktop.value && (
        <div class="hs-video-branding" aria-label="Theta and SASTRA logos">
          <img src="/theta-logo.png" alt="Theta" class="hs-video-branding__logo hs-video-branding__logo--theta" />
          <div class="hs-video-branding__divider" />
          <img src="/sastra.png" alt="SASTRA" class="hs-video-branding__logo hs-video-branding__logo--sastra" />
        </div>
      )}

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
            <img src={s.thumb} alt={s.title} class="hs-thumb-img" loading="lazy" />
            <div class="hs-thumb-overlay" style={active.value === i ? { background: `linear-gradient(to top, rgba(${s.accentRgb},0.55), transparent)` } : {}} />
            <div class={["hs-thumb-line-bg", active.value === i ? "opacity-100" : "opacity-0"]} />
            {active.value === i && (
              <div
                class="hs-thumb-line"
                style={{
                  background: s.accentColor,
                  width: `${slideProgress.value}%`
                }}
              />
            )}
          </button>
        ))}
      </div>

    </section>
  );
});
