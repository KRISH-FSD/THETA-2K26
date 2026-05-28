import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import gsap from "gsap";
import { getDevicePerfTier } from "~/utils/perf";

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
    bgImage: "/day1-bg.webp",
    bgVideo: "/homepage/v1.mp4",
    mobileBgVideo: "/homepage/v1.mp4",
    thumb: "/day1-bg.webp",
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
    bgImage: "/day/day-2.webp",
    thumb: "/day/day-2.webp",
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
    bgImage: "/homepage/i3.webp",
    mobileBgImage: "/homepage/i3-mobile.webp",
    mobileBgVideo: "",
    thumb: "/homepage/i3.webp",
  },
];

/* ─── Countdown Component ─── */
const HeroCountdown = component$(() => {
  return (
    <div class="hs-countdown-wrap">
      <div class="hs-countdown-card">
        <div class="hs-countdown-inner">
          <div class="hs-omnitrix-shell">
            <div class="hs-omnitrix-glow"></div>
            <img
              src="/ben10/ben10-logo.webp"
              alt="Ben 10"
              class="hs-omnitrix-icon"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="hs-countdown-numbers">
            <span class="hs-countdown-complete">MISSION COMPLETE!</span>
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
  const perfTier = useSignal<ReturnType<typeof getDevicePerfTier>>("hi");

  const goTo = $((idx: number) => {
    if (isAnimating.value || idx === active.value) return;
    isAnimating.value = true;
    active.value = idx;

    if (perfTier.value !== "hi") {
      window.setTimeout(() => {
        isAnimating.value = false;
      }, 250);
      return;
    }

    /* Content Entrance Animations */
    const tl = gsap.timeline();

    tl.fromTo(".hs-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
    tl.fromTo(".hs-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.4");
    tl.fromTo(".hs-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".hs-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");

    window.setTimeout(() => {
      isAnimating.value = false;
    }, 900);
  });

  useVisibleTask$(({ cleanup }) => {
    perfTier.value = getDevicePerfTier();
    if (perfTier.value === "lo") {
      return;
    }

    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(".hs-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
    tl.fromTo(".hs-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.4");
    tl.fromTo(".hs-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".hs-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");

    cleanup(() => tl.kill());
  });

  useVisibleTask$(({ cleanup }) => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => {
      isDesktop.value = mediaQuery.matches;
      perfTier.value = getDevicePerfTier();
      if (!mediaQuery.matches && active.value !== 0) {
        active.value = 0;
      }
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

    // No longer changing nav logo based on slide
    document.body.removeAttribute("data-nav-logo");

    cleanup(() => {
      document.body.removeAttribute("data-nav-logo");
    });
  });

  useVisibleTask$(({ cleanup, track }) => {
    track(() => active.value);
    track(() => isDesktop.value);
    track(() => isHeroInView.value);

    const activeSlide = heroSlides[active.value];
    const shouldUseVideo =
      !!activeSlide.bgVideo && (isDesktop.value || !!activeSlide.mobileBgVideo);

    if (!isHeroInView.value) {
      return;
    }

    // Video handles its own progress in the next task block
    if (shouldUseVideo) {
      return;
    }

    const duration = 6000;
    // Perf Fix 2.2: Throttle progress updates to 200ms instead of every frame (RAF)
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      slideProgress.value = Math.min((elapsed / duration) * 100, 100);
    }, 200);

    cleanup(() => clearInterval(interval));

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
      !!currentVideo &&
      !!activeSlide.bgVideo &&
      (isDesktop.value || !!activeSlide.mobileBgVideo) &&
      isHeroInView.value;

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

    const currentVideo = videoRef.value;
    const activeSlide = heroSlides[active.value];

    if (!currentVideo || !activeSlide.bgVideo || (!isDesktop.value && !activeSlide.mobileBgVideo)) {
      return;
    }

    if (isHeroInView.value) {
      void currentVideo.play().catch(() => {
        // Ignore autoplay interruptions from the browser.
      });
    } else {
      currentVideo.pause();
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
      if (!isDesktop.value) {
        currentVideo.currentTime = 0;
        void currentVideo.play().catch(() => { });
        return;
      }
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

    // Perf Fix 2.3: Pause/Play based on visibility
    const handleVisibility = () => {
      if (document.hidden) currentVideo.pause();
      else if (isHeroInView.value) currentVideo.play().catch(() => { });
    };
    document.addEventListener("visibilitychange", handleVisibility);
    cleanup(() => document.removeEventListener("visibilitychange", handleVisibility));
  });

  const slide = heroSlides[active.value];
  const useHeroVideo = (s: (typeof heroSlides)[number]) =>
    !!s.bgVideo &&
    isHeroInView.value &&
    active.value === heroSlides.findIndex((item) => item.id === s.id) &&
    (isDesktop.value ? perfTier.value === "hi" : !!s.mobileBgVideo);

  return (
    <section id="hero-slider" ref={heroRef} class="hs-root relative overflow-hidden"
      style={`--hs-accent:${slide.accentColor};--hs-accent-rgb:${slide.accentRgb};`}>

      {/* Backgrounds - Map all for crossfade */}
      {heroSlides.map((s, i) => (
        (() => {
          const isActive = active.value === i;
          const isNext = (active.value + 1) % heroSlides.length === i;
          const shouldRenderMedia = isActive || (isNext && isHeroInView.value);

          return (
            <div
              key={s.id}
              class={["hs-bg", isActive ? "hs-bg--active" : "hs-bg--inactive"]}
              style={{
                zIndex: isActive ? 2 : 1,
                opacity: isActive ? 1 : 0,
                transition: "none",
                transform: "none"
              }}
            >
              {shouldRenderMedia && (useHeroVideo(s) ? (
              <video
                ref={videoRef}
                class="absolute inset-0 h-full w-full object-cover"
                data-hero-video
                src={!isDesktop.value && s.mobileBgVideo ? s.mobileBgVideo : s.bgVideo}
                autoplay
                muted
                playsInline
                loop={!isDesktop.value}
                preload={isDesktop.value ? "none" : "metadata"}
                poster={(!isDesktop.value && (s as any).mobileBgImage) ? (s as any).mobileBgImage : s.bgImage}
                disablePictureInPicture
                style="will-change: auto;"
              />
          ) : s.bgVideo && isDesktop.value && perfTier.value === "hi" ? (
              <div
                class="absolute inset-0 h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${s.bgImage})`, willChange: "opacity" }}
              />
          ) : (
            <div
              class="absolute inset-0 h-full w-full bg-cover"
              style={{
                backgroundImage: `url(${(!isDesktop.value && (s as any).mobileBgImage) ? (s as any).mobileBgImage : s.bgImage})`,
                backgroundPosition: s.id === 2 ? 'center 15%' : 'center',
                willChange: "opacity"
              }}
            />
          ))}
              {/* Dynamic Overlay: Day 1 & 3 get light bottom darkness only to showcase visuals, Day 2 gets cinematic darkness for navigation visibility */}
              {shouldRenderMedia && (
                <>
                  <div class="hs-overlay" style={{
                    background: (s.id === 0 || s.id === 2)
                      ? "linear-gradient(to top, rgba(5,3,15,0.85) 0%, rgba(5,3,15,0.4) 20%, transparent 50%)"
                      : "linear-gradient(108deg, rgba(5,3,15,0.65) 0%, rgba(5,3,15,0.45) 45%, rgba(5,3,15,0.1) 100%), linear-gradient(to top, rgba(5,3,15,1) 0%, rgba(5,3,15,0.44) 32%, transparent 100%)"
                  }} />
                  <div class="hs-tint" style={{ background: `radial-gradient(ellipse 70% 60% at 80% 40%, rgba(${s.accentRgb},0.08), transparent 70%)` }} />
                </>
              )}
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
          );
        })()
      ))}

      <div class="hs-grain" />

      <div class="hs-hero-countdown">
        <HeroCountdown />
      </div>

      {isDesktop.value && (
        <div class="hs-video-branding" aria-label="Theta and SASTRA logos">
          <img src="/theta-logo.webp" alt="Theta" class="hs-video-branding__logo hs-video-branding__logo--theta" loading="lazy" decoding="async" />
          <div class="hs-video-branding__divider" />
          <img src="/sastra.webp" alt="SASTRA" class="hs-video-branding__logo hs-video-branding__logo--sastra" loading="lazy" decoding="async" />
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
            <img src={s.thumb} alt={s.title} class="hs-thumb-img" loading="lazy" decoding="async" />
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
