import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Header } from "../components/header/header";
import { Chatbot } from "../components/chatbot/Chatbot";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyPerfTier, watchPerfTier } from "../utils/perf";
interface LayoutCopy {
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
  const copy = useSignal<LayoutCopy>(defaultLayoutCopy);
  const showFooter = useSignal(false);
  const showChatbot = useSignal(false);
  const isSponsorsRoute = loc.url.pathname.startsWith("/sponsors");
  const isDevelopersRoute = loc.url.pathname.startsWith("/developers");
  const isEventsRoute = loc.url.pathname.startsWith("/events");
  const isDay2 = loc.url.pathname.includes("/roadmap/day2");
  const footerLogo = isDay2 ? "/onepeice/one-peice-logo.webp" : "/theta-logo.webp";

  useVisibleTask$(() => {
    // Apply 3-tier perf tier to <html> (data-perf-tier="lo|mid|hi")
    // and data-mobile-perf for backwards-compat with existing CSS guards
    applyPerfTier();
    const stopWatch = watchPerfTier();
    gsap.registerPlugin(ScrollTrigger);
    return () => stopWatch();
  });

  useVisibleTask$(({ cleanup }) => {
    const makeMediaLazy = () => {
      document
        .querySelectorAll<HTMLImageElement>("img:not([data-critical-media])")
        .forEach((img) => {
          img.loading ||= "lazy";
          img.decoding ||= "async";
        });

      document.querySelectorAll<HTMLIFrameElement>("iframe").forEach((frame) => {
        frame.loading ||= "lazy";
      });
    };

    makeMediaLazy();
    const observer = new MutationObserver(makeMediaLazy);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    const idleId = window.setTimeout(() => {
      showChatbot.value = true;
    }, 900);

    cleanup(() => {
      observer.disconnect();
      window.clearTimeout(idleId);
    });
  });

  useVisibleTask$(({ cleanup, track }) => {
    track(() => loc.url.pathname);
    showFooter.value = isDevelopersRoute || isEventsRoute;

    if (showFooter.value) {
      return;
    }

    const sentinel = document.querySelector<HTMLElement>("[data-footer-lazy]");
    if (!sentinel || !("IntersectionObserver" in window)) {
      showFooter.value = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          showFooter.value = true;
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(sentinel);
    cleanup(() => observer.disconnect());
  });

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/data/content.json");
      const data = (await res.json()) as {
        layout?: Partial<LayoutCopy>;
      };

      if (data.layout) {
        copy.value = {
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
    const footer = document.querySelector("footer.footer-modern");
    if (dock) {
      gsap.killTweensOf(dock);
      if (footer) {
        const tween = gsap.to(dock, {
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

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    }
  });

  return (
    <div class="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#f0fff0]">
      {/* Ambient background orbs */}
      {!isSponsorsRoute && (
        <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Perf Fix: Replaced blur-[120px] divs with zero-cost radial-gradients */}
          <div class="absolute top-0 right-0 h-[600px] w-[600px]" style={{ background: "radial-gradient(circle at top right, rgba(var(--t-brand-rgb), 0.05), transparent 70%)" }} />
          <div class="absolute bottom-0 left-0 h-[500px] w-[500px]" style={{ background: "radial-gradient(circle at bottom left, rgba(var(--t-brand-rgb), 0.03), transparent 70%)" }} />
        </div>
      )}

      <div class="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main class="flex-grow">
          <Slot />
        </main>

        {/* ── Footer: Modern Redesign ── */}
        {!isDevelopersRoute && !isEventsRoute && (
          showFooter.value ? (
          <footer class="footer-modern mt-12 border-t border-white/10 bg-[#0a0a0a] pt-16 pb-32 md:pb-8 relative z-20">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div class="grid gap-12 md:gap-8 grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
                {/* Brand Block */}
                <div class="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
                  <div class="flex items-center gap-6 mb-6">
                    <img
                      src={footerLogo}
                      alt="Theta"
                      width={isDay2 ? 180 : 140}
                      height={isDay2 ? 80 : 70}
                      loading="lazy"
                      decoding="async"
                      class={["h-12 w-auto opacity-90 transition-all duration-300 hover:opacity-100", !isDay2 ? "[filter:brightness(0)_invert(1)]" : ""]}
                    />
                    <div class="h-8 w-px bg-white/10"></div>
                    <img
                      src="/sastra.webp"
                      alt="SASTRA Logo"
                      loading="lazy"
                      decoding="async"
                      class="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity rounded-md"
                    />
                  </div>
                  <p class="mt-2 text-sm leading-relaxed text-[#8ca38c] max-w-sm">
                    {copy.value.footer.description}
                  </p>
                </div>

                {/* Navigation Links */}
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 class="mb-5 text-xs font-bold uppercase tracking-wider text-white">
                    Navigation
                  </h3>
                  <ul class="flex flex-col gap-3">
                    {[
                      { label: copy.value.footer.homeLabel, href: "/" },
                      { label: copy.value.footer.eventsLabel, href: "/events" },
                      { label: copy.value.footer.sponsorsLabel, href: "/sponsors" },
                    ].map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} class="text-sm font-medium text-[#8ca38c] transition-colors duration-200 hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support Links */}
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 class="mb-5 text-xs font-bold uppercase tracking-wider text-white">
                    Support
                  </h3>
                  <ul class="flex flex-col gap-3">
                    {[
                      { label: copy.value.footer.contactLabel, href: "/contact" },
                      { label: copy.value.footer.issuesLabel || "Report Issue", href: "https://github.com/cce-sastra/theta-web/issues" },
                    ].map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} target={link.href?.startsWith("http") ? "_blank" : undefined} class="text-sm font-medium text-[#8ca38c] transition-colors duration-200 hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coordinates Block */}
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 class="mb-5 text-xs font-bold uppercase tracking-wider text-white">
                    Connect
                  </h3>
                  <div class="flex flex-col gap-3 text-sm text-[#8ca38c] font-medium">
                    <p class="max-w-[200px] leading-relaxed">{copy.value.footer.locationLabel}</p>
                    <a href={`mailto:${copy.value.footer.emailLabel}`} class="hover:text-white transition-colors duration-200">
                      {copy.value.footer.emailLabel}
                    </a>
                  </div>
                </div>
              </div>

              {/* Copyright Bar */}
              <div class="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-xs font-medium text-[#6e806e]">
                  {copy.value.footer.copyright}
                </p>
                <div class="flex items-center gap-2 text-xs font-medium text-[#6e806e]">
                  <span>Crafted with</span>
                  <span class="text-red-500">♥</span>
                  <Link href="/developers" class="text-[#8ca38c] transition-colors duration-200 hover:text-white">
                    WebTek Team
                  </Link>
                </div>
              </div>
            </div>
          </footer>
          ) : (
            <div
              data-footer-lazy
              class="site-lazy-band"
              aria-hidden="true"
            />
          )
        )}
      </div>
      {showChatbot.value && !isEventsRoute && <Chatbot />}
    </div>
  );
});
