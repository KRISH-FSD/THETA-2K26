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
import { applyPerfTier, watchPerfTier } from "~/utils/perf";
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
  const footerLogo = isDay2 ? "/onepeice/one-peice-logo.webp" : "/theta-logo.webp";

  const showDev = $(() => {
    toastOpen.value = !toastOpen.value;
    setTimeout(() => {
      toastOpen.value = false;
    }, 3000);
  });

  useVisibleTask$(() => {
    underDev.value = import.meta.env.PUBLIC_UNDER_DEV !== "false";
    // Apply 3-tier perf tier to <html> (data-perf-tier="lo|mid|hi")
    // and data-mobile-perf for backwards-compat with existing CSS guards
    applyPerfTier();
    const stopWatch = watchPerfTier();
    gsap.registerPlugin(ScrollTrigger);
    return () => stopWatch();
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

        {/* ── Footer: Modern Redesign ── */}
        {!isDevelopersRoute && !isEventsRoute && (
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
                      class={["h-12 w-auto opacity-90 transition-all duration-300 hover:opacity-100", !isDay2 ? "[filter:brightness(0)_invert(1)]" : ""]}
                    />
                    <div class="h-8 w-px bg-white/10"></div>
                    <img
                      src="/sponsors/media/rdg-logo.webp"
                      alt="RDG Logo"
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
                  <span>{copy.value.footer.madeWithPrefix}</span>
                  <span class="text-red-500 animate-pulse">❤️</span>
                  <span>{copy.value.footer.madeBy}</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
      <Chatbot />
    </div>
  );
});
