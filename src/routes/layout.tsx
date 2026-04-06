import {
  $,
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Header } from "~/components/header/header";
import { Chatbot } from "~/components/chatbot/Chatbot";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

interface LayoutCopy {
  underDevelopment: {
    ariaLabel: string;
    title: string;
    subtitle: string;
  };
  footer: {
    description: string;
    quickLinksTitle: string;
    contactTitle: string;
    homeLabel: string;
    eventsLabel: string;
    sponsorsLabel: string;
    contactLabel: string;
    repoSectionLabel?: string;
    repoLabel?: string;
    issuesLabel?: string;
    contributeLabel?: string;
    locationLabel: string;
    dateLabel: string;
    emailLabel: string;
    copyright: string;
    madeWithPrefix: string;
    madeBy: string;
    social?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };
}

const defaultLayoutCopy: LayoutCopy = {
  underDevelopment: {
    ariaLabel: "Show development notice",
    title: "Website Under Development",
    subtitle: "Changes may occur",
  },
  footer: {
    description:
      "Theta is SASTRA's national-level techno-management fest organized by SASTRA Deemed University. Join us for three days of innovation, competition, and excitement.",
    quickLinksTitle: "Quick Links",
    contactTitle: "Contact",
    homeLabel: "Home",
    eventsLabel: "Events",
    sponsorsLabel: "Sponsors",
    contactLabel: "Contact",
    repoSectionLabel: "Project Repo",
    repoLabel: "Repository",
    issuesLabel: "Issues",
    contributeLabel: "Contribute",
    locationLabel: "SASTRA Deemed University",
    dateLabel: "April 11-13, 2026",
    emailLabel: "theta@sastra.edu",
    copyright: "© 2026 Theta. All rights reserved.",
    madeWithPrefix: "Made with",
    madeBy: "by WebTek Team",
    social: {
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
    },
  },
};

export default component$(() => {
  const loc = useLocation();
  const underDev = useSignal(true);
  const toastOpen = useSignal(false);
  const copy = useSignal<LayoutCopy>(defaultLayoutCopy);
  const isSponsorsRoute = loc.url.pathname.startsWith("/sponsors");
  const isDevelopersRoute = loc.url.pathname.startsWith("/developers");
  const isEventsRoute = loc.url.pathname.startsWith("/events");
  const isDay2 = loc.url.pathname.includes("/roadmap/day2");
  const footerLogo = isDay2 ? "/onepeice/one-peice-logo.png" : "/theta-logo.png";

  const showDev = $(() => {
    toastOpen.value = !toastOpen.value;
    setTimeout(() => {
      toastOpen.value = false;
    }, 3000);
  });

  useVisibleTask$(() => {
    underDev.value = import.meta.env.PUBLIC_UNDER_DEV !== "false";
    
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const footer = document.querySelector("footer.footer-neural-grid");
    if (!footer) {
      return;
    }

    // Tracer Line Animation
    gsap.to(".footer-tracer-path", {
      strokeDashoffset: 0,
      duration: 2,
      ease: "none",
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        end: "bottom bottom",
        scrub: 0.5,
      }
    });



    // Signal Tracers (Points moving along paths)
    gsap.to(".signal-tracer", {
      motionPath: {
        path: (i: number) => document.querySelectorAll(".footer-tracer-path")[i] as SVGPathElement,
        align: (i: number) => document.querySelectorAll(".footer-tracer-path")[i] as SVGPathElement,
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      } as any,
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        end: "bottom bottom",
        scrub: 0.5,
      }
    });


  });

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/data/content.json");
      const data = (await res.json()) as {
        layout?: Partial<LayoutCopy>;
      };

      if (data.layout) {
        copy.value = {
          underDevelopment: {
            ...defaultLayoutCopy.underDevelopment,
            ...(data.layout.underDevelopment || {}),
          },
          footer: {
            ...defaultLayoutCopy.footer,
            ...(data.layout.footer || {}),
          },
        };
      }
    } catch (e) {
      console.error("Failed to load layout content:", e);
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => loc.url.pathname);
    
    // Roadmap Dock (Bottom Navbar) Hiding Style
    const dock = document.querySelector(".rm-dock");
    const footer = document.querySelector("footer.footer-neural-grid");
    if (dock) {
      gsap.killTweensOf(dock);
      if (footer) {
        gsap.to(dock, {
          scrollTrigger: {
            trigger: footer,
            start: "top 95%",
            toggleActions: "play reverse play reverse",
          },
          y: 120,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          ease: "power3.inOut",
        });
      }
    }
  });

  return (
    <div class="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#f0fff0]">
      {/* Ambient background orbs */}
      {!isSponsorsRoute && (
        <div class="pointer-events-none fixed inset-0 z-0">
          <div class="absolute top-0 right-0 h-[600px] w-[600px] rounded-full opacity-[0.03] blur-[120px]" style={{ backgroundColor: "var(--t-brand-accent)" }} />
          <div class="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full opacity-[0.02] blur-[100px]" style={{ backgroundColor: "var(--t-brand-accent)" }} />
        </div>
      )}

      <div class="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main class="flex-grow">
          <Slot />
        </main>

        {underDev.value && (
          <div class="fixed bottom-6 left-6 z-50">
            <button
              onClick$={showDev}
              class="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110"
              style={{
                backgroundColor: "rgba(var(--t-brand-rgb), 0.1)",
                color: "var(--t-brand-accent)",
                boxShadow: "0 0 15px rgba(var(--t-brand-rgb), 0.3)",
              }}
              aria-label={copy.value.underDevelopment.ariaLabel}
            >
              !
            </button>
            {toastOpen.value && (
              <div class="absolute bottom-12 left-0 w-52 rounded-xl border bg-[#0a0a0a]/90 p-4 text-xs backdrop-blur-md"
                   style={{ borderColor: "rgba(var(--t-brand-rgb), 0.3)", boxShadow: "0 0 20px rgba(var(--t-brand-rgb), 0.2)" }}>
                <p class="font-bold" style={{ color: "var(--t-brand-accent)" }}>
                  {copy.value.underDevelopment.title}
                </p>
                <p class="mt-1 text-[#8ca38c]">
                  {copy.value.underDevelopment.subtitle}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Footer: Neural Grid Redesign ── */}
        {!isDevelopersRoute && !isEventsRoute && (
          <footer class="footer-neural-grid mt-12 border-t border-white/5 pt-12 pb-12 relative overflow-hidden backdrop-blur-xl bg-black/40">
          {/* Ambient Blurred Glows */}
          <div class="footer-ambient-glow footer-ambient-glow--1 absolute -top-[20%] -left-[10%] h-[150%] w-[50%] opacity-20 blur-[120px] rounded-full pointer-events-none" />
          <div class="footer-ambient-glow footer-ambient-glow--2 absolute -bottom-[30%] -right-[15%] h-[120%] w-[60%] opacity-[0.15] blur-[100px] rounded-full pointer-events-none" />

          {/* SVG Tracer Lines */}
          <svg class="footer-tracer-line" viewBox="0 0 1440 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="footer-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="var(--t-brand-accent)" stop-opacity="0" />
                <stop offset="50%" stop-color="var(--t-brand-accent)" stop-opacity="0.8" />
                <stop offset="100%" stop-color="var(--t-brand-accent)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path class="footer-tracer-path" d="M -100,100 C 200,150 400,50 720,100 C 1040,150 1240,50 1540,100" />
            <path class="footer-tracer-path" d="M -100,300 C 300,250 500,350 720,300 C 940,250 1240,350 1540,300" opacity="0.6" />
            <path class="footer-tracer-path" d="M -100,500 C 150,450 450,550 720,500 C 990,450 1290,550 1540,500" opacity="0.3" />
            
            <circle class="signal-tracer h-2 w-2" style={{ fill: "var(--t-brand-accent)", filter: "drop-shadow(0 0 10px var(--t-brand-accent))" }} r="4" />
            <circle class="signal-tracer h-2 w-2" style={{ fill: "rgba(var(--t-brand-rgb), 0.6)" }} r="3" />
          </svg>

          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pb-32 md:pb-12">
            <div class="grid gap-12 md:gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Brand Block */}
              <div class="flex flex-col items-center md:items-start text-center md:text-left">
                <img
                  src={footerLogo}
                  alt="Theta"
                  width={isDay2 ? 180 : 140}
                  height={isDay2 ? 80 : 70}
                  class={["h-10 w-auto opacity-90", !isDay2 ? "[filter:brightness(0)_invert(1)]" : ""]}
                />
                <p class="mt-6 text-sm leading-relaxed text-[#8ca38c] font-medium max-w-xs">
                  {copy.value.footer.description}
                </p>
              </div>

              {/* Links Block */}
              <div class="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 class="mb-6 md:mb-8 text-[11px] font-black tracking-[0.25em] text-white uppercase" style={{ fontFamily: "var(--font-display)" }}>
                   Navigation
                </h3>
                <div class="flex flex-col items-center md:items-start gap-4">
                  {[
                    { label: copy.value.footer.homeLabel, href: "/" },
                    { label: copy.value.footer.eventsLabel, href: "/events" },
                    { label: copy.value.footer.sponsorsLabel, href: "/sponsors" },
                    { label: copy.value.footer.contactLabel, href: "/contact" }
                  ].map((link) => (
                    <Link key={link.label} href={link.href} class="footer-link-modern text-sm font-medium text-[#8ca38c] w-fit">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Block */}
              <div class="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 class="mb-6 md:mb-8 text-[11px] font-black tracking-[0.25em] text-white uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  Coordinates
                </h3>
                <div class="flex flex-col items-center md:items-start gap-4 text-sm text-[#8ca38c] font-medium">
                  <p>{copy.value.footer.locationLabel}</p>
                  <p>{copy.value.footer.emailLabel}</p>
                </div>
              </div>
            </div>

            {/* Copyright Bar */}
            <div class="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{copy.value.footer.copyright}</p>
            </div>
          </div>
          </footer>
        )}
      </div>
      <Chatbot />
    </div>
  );
});
