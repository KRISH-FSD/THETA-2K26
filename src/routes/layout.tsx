import {
  $,
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Header } from "~/components/header/header";

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
      "Theta is SASTRA's national-level techno-management fest. Join us for competitions, workshops, and community.",
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

  useVisibleTask$(() => {
    underDev.value = import.meta.env.PUBLIC_UNDER_DEV !== "false";
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
    } catch {
      copy.value = defaultLayoutCopy;
    }
  });

  const showDev = $(() => {
    toastOpen.value = true;
    setTimeout(() => {
      toastOpen.value = false;
    }, 1700);
  });

  return (
    <div class="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#f0fff0]">
      {/* Ambient background orbs */}
      {!isSponsorsRoute && (
        <>
          <div
            class="pointer-events-none absolute h-56 w-56 rounded-full bg-[#0ea935] opacity-[0.05] blur-[100px]"
            style="top:-4rem; left:-5rem;"
          ></div>
          <div
            class="pointer-events-none absolute h-72 w-72 rounded-full bg-[#0ea935] opacity-[0.05] blur-[120px]"
            style="top:18rem; right:-4rem; animation-delay:3s;"
          ></div>
        </>
      )}

      {/* SASTRA watermark — reduced opacity so it doesn't compete with content */}
      <div class="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <img
          src="/sponsors/general/sastra-university-logo.jpg"
          alt=""
          width={1200}
          height={1200}
          aria-hidden="true"
          class="h-auto w-[72vw] max-w-[920px] opacity-[0.02] grayscale"
        />
      </div>

      <div class="relative z-10 w-full overflow-x-hidden">
        <Header />
        <main
          class={[
            "w-full overflow-x-hidden",
            loc.url.pathname === "/" ? "pt-0" : "pt-[90px]",
          ]}
        >
          <Slot />
        </main>

        {/* Under-development indicator */}
        {underDev.value && (
          <div class="fixed bottom-4 left-4 z-[95]">
            <button
              type="button"
              onClick$={showDev}
              class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0ea935]/10 text-xl font-black text-[#0ea935] shadow-[0_0_15px_rgba(14,169,53,0.3)] backdrop-blur-md transition-all hover:scale-110 hover:bg-[#0ea935]/20 hover:shadow-[0_0_25px_rgba(14,169,53,0.5)]"
              aria-label={copy.value.underDevelopment.ariaLabel}
            >
              !
            </button>
            {toastOpen.value && (
              <div class="absolute bottom-12 left-0 w-52 rounded-xl border border-[#0ea935]/30 bg-[#0a0a0a]/90 p-4 text-xs shadow-[0_0_20px_rgba(14,169,53,0.2)] backdrop-blur-md">
                <p class="font-bold text-[#0ea935]">
                  {copy.value.underDevelopment.title}
                </p>
                <p class="mt-1 text-[#8ca38c]">
                  {copy.value.underDevelopment.subtitle}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <footer class="mx-auto mt-20 max-w-7xl border-t border-[#0ea935]/20 px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <div class="relative">
            {/* Ambient blobs inside footer card */}
            <div class="pointer-events-none absolute -top-14 -right-16 h-44 w-44 rounded-full bg-[#077a23] opacity-[0.1] blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#0ea935] opacity-[0.05] blur-3xl"></div>

            <div class="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div>
                <img
                  src="/theta-logo.png"
                  alt="Theta"
                  width={140}
                  height={70}
                  class="h-10 w-auto opacity-90 [filter:brightness(0)_invert(1)]"
                />
                <p class="mt-4 max-w-xs text-sm leading-relaxed text-[#8ca38c]">
                  {copy.value.footer.description}
                </p>
                <div class="mt-5">
                  <span class="inline-flex rounded-full border border-[#0ea935]/30 bg-[#0ea935]/10 px-3 py-1 text-xs font-bold tracking-widest text-[#0ea935] uppercase shadow-[0_0_10px_rgba(14,169,53,0.1)]">
                    Theta 2026
                  </span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 class="mb-5 text-xs font-black tracking-widest text-[#f0fff0] uppercase">
                  {copy.value.footer.quickLinksTitle}
                </h3>
                <div class="space-y-3 text-sm">
                  <Link
                    href="/"
                    class="block text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.homeLabel}
                  </Link>
                  <Link
                    href="/events"
                    class="block text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.eventsLabel}
                  </Link>
                  <Link
                    href="/sponsors"
                    class="block text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.sponsorsLabel}
                  </Link>
                  <Link
                    href="/roadmap/day1"
                    class="block flex items-center gap-1.5 font-semibold text-[#0ea935] transition-colors hover:text-[#12cb42]"
                  >
                    <span class="inline-block h-1.5 w-1.5 rounded-full bg-[#0ea935] shadow-[0_0_6px_rgba(14,169,53,1)]" />
                    Roadmap
                  </Link>
                  <Link
                    href="/contact"
                    class="block text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.contactLabel}
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 class="mb-5 text-xs font-black tracking-widest text-[#f0fff0] uppercase">
                  {copy.value.footer.contactTitle}
                </h3>
                <div class="space-y-4 text-sm text-[#8ca38c]">
                  <p class="flex items-start gap-3">
                    <svg
                      class="h-5 w-5 shrink-0 text-[#077a23]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="leading-tight">
                      {copy.value.footer.locationLabel}
                    </span>
                  </p>
                  <p class="flex items-center gap-3">
                    <svg
                      class="h-5 w-5 shrink-0 text-[#077a23]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{copy.value.footer.dateLabel}</span>
                  </p>
                  <a
                    href={`mailto:${copy.value.footer.emailLabel}`}
                    class="flex items-center gap-3 transition-colors hover:text-[#0ea935]"
                  >
                    <svg
                      class="h-5 w-5 shrink-0 text-[#077a23]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{copy.value.footer.emailLabel}</span>
                  </a>
                </div>
              </div>

              {/* Connect / Repo */}
              <div>
                <h3 class="mb-5 text-xs font-black tracking-widest text-[#f0fff0] uppercase">
                  {copy.value.footer.repoSectionLabel || "Connect"}
                </h3>
                <div class="flex flex-col gap-3">
                  <a
                    href="https://github.com/theta-web"
                    target="_blank"
                    rel="noreferrer"
                    class="text-sm text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.repoLabel || "Repository"}
                  </a>
                  <a
                    href="https://github.com/theta-web/issues"
                    target="_blank"
                    rel="noreferrer"
                    class="text-sm text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.issuesLabel || "Issues"}
                  </a>
                  <a
                    href="https://github.com/theta-web"
                    target="_blank"
                    rel="noreferrer"
                    class="text-sm text-[#8ca38c] transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.contributeLabel || "Contribute"}
                  </a>
                </div>
                <div class="mt-6 flex gap-4">
                  <a
                    href="#"
                    class="text-xs font-bold tracking-widest text-[#4d5c4d] uppercase transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.social?.instagram || "Instagram"}
                  </a>
                  <a
                    href="#"
                    class="text-xs font-bold tracking-widest text-[#4d5c4d] uppercase transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.social?.twitter || "Twitter"}
                  </a>
                  <a
                    href="#"
                    class="text-xs font-bold tracking-widest text-[#4d5c4d] uppercase transition-colors hover:text-[#0ea935]"
                  >
                    {copy.value.footer.social?.youtube || "YouTube"}
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div class="mt-12 flex flex-col border-t border-[#0ea935]/10 pt-6 text-xs font-medium text-[#4d5c4d] sm:flex-row sm:items-center sm:justify-between">
              <p>{copy.value.footer.copyright}</p>
              <p class="mt-2 sm:mt-0">
                {copy.value.footer.madeWithPrefix} Qwik{" "}
                {copy.value.footer.madeBy}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});
