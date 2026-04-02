import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

export const Header = component$(() => {
  const location = useLocation();
  const open = useSignal(false);

  const isActive = (href: string) => {
    const p = location.url.pathname.replace(/\/$/, "") || "/";
    const h = href.replace(/\/$/, "") || "/";
    if (h === "/") return p === "/";
    return p === h || p.startsWith(h + "/");
  };

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    open.value = false;
  });

  const toggleMenu = $(() => {
    open.value = !open.value;
  });

  return (
    <>
      <header class="pointer-events-none fixed top-2 right-0 left-0 z-[100] flex w-full items-center justify-between px-3 sm:px-4 md:top-3 md:px-6">
        {/* Left: Theta Logo */}
        <div class="pointer-events-auto flex min-w-0 flex-1 items-center md:flex-initial md:w-[220px] lg:w-[280px]">
          <Link
            href="/"
            class="origin-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03]"
          >
            <img
              src="/theta-logo.png"
              alt="Theta"
              class="h-14 w-auto object-contain opacity-95 [filter:brightness(0)_invert(1)] transition-opacity hover:opacity-100 sm:h-16 md:h-20"
            />
          </Link>
        </div>

        {/* Center: Pill Navigation (Desktop) - Modern Apple Glassmorphism Effect */}
        <nav class="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[2.5rem] border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.5)] px-4 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform hover:scale-[1.02] md:flex lg:gap-6 lg:px-6">
          <Link
            href="/events"
            class={[
              "px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs",
              isActive("/events")
                ? "text-[#0ea935]"
                : "text-[#8ca38c] hover:text-[#f0fff0]",
            ]}
          >
            Events
          </Link>

          <Link
            href="/sponsors"
            class={[
              "px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs",
              isActive("/sponsors")
                ? "text-[#0ea935]"
                : "text-[#8ca38c] hover:text-[#f0fff0]",
            ]}
          >
            Sponsors
          </Link>

          <Link
            href="/"
            class="t-ben10-link group relative mx-1 flex shrink-0 items-center justify-center lg:mx-2"
          >
            <div class="t-ben10-shell relative z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505]/80 backdrop-blur-md transition-all lg:h-14 lg:w-14">
              <span class="t-ben10-shell-glow"></span>
              <img
                src="/ben10/ben10-logo.png"
                alt="Ben 10 Logo"
                class="t-ben10-icon h-7 w-auto object-contain lg:h-10"
              />
            </div>
          </Link>

          <Link
            href="/roadmap/day1"
            class={[
              "px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs",
              isActive("/roadmap")
                ? "text-[#0ea935]"
                : "text-[#8ca38c] hover:text-[#f0fff0]",
            ]}
          >
            Roadmap
          </Link>

          <Link
            href="/contact"
            class={[
              "px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs",
              isActive("/contact")
                ? "text-[#0ea935]"
                : "text-[#8ca38c] hover:text-[#f0fff0]",
            ]}
          >
            Contacts
          </Link>
        </nav>

        {/* Center: Mobile Logo Display */}
        <div class="pointer-events-auto flex flex-1 justify-center md:hidden">
          <Link
            href="/"
            class="t-ben10-link t-ben10-shell relative z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.6)] backdrop-blur-xl"
          >
            <span class="t-ben10-shell-glow"></span>
            <img
              src="/ben10/ben10-logo.png"
              alt="Ben 10 Logo"
              class="t-ben10-icon h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right: Register Button & Mobile Menu */}
        <div class="pointer-events-auto flex flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-initial md:w-[220px] lg:w-[280px]">
          {/* Modern Minimalist Cyberpunk Register Button */}
          <div class="group pointer-events-auto relative hidden cursor-pointer md:flex">
            <Link
              href="/events"
              class="relative z-10 flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#0ea935] bg-[#050505]/40 px-5 py-2.5 text-[0.6rem] font-black tracking-[0.2em] whitespace-nowrap text-[#0ea935] uppercase shadow-[0_0_15px_rgba(14,169,53,0.15),inset_0_0_10px_rgba(14,169,53,0.1)] backdrop-blur-md transition-all duration-300 hover:bg-[#0ea935] hover:text-[#050505] hover:shadow-[0_0_30px_rgba(14,169,53,0.5)] active:scale-95 lg:px-8 lg:py-3.5 lg:text-[0.7rem]"
            >
              {/* Online Dot (syncs with text color via bg-current) */}
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
              </span>

              <span class="mt-[1px]">Register</span>

              {/* Chevron Icon */}
              <svg
                class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <button
            type="button"
            onClick$={toggleMenu}
            class="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.5)] text-[#0ea935] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:hidden"
          >
            {open.value ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        class={[
          "fixed inset-x-4 top-[74px] z-[99] overflow-hidden rounded-[2.5rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.85)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all duration-300 md:hidden",
          open.value
            ? "pointer-events-auto max-h-[34rem] py-6 opacity-100"
            : "pointer-events-none max-h-0 py-0 opacity-0",
        ]}
      >
        <div class="space-y-3 px-6">
          <Link
            href="/events"
            class="block rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#f0fff0] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors hover:border-[#0ea935]/40"
          >
            Events
          </Link>
          <Link
            href="/sponsors"
            class="block rounded-2xl border border-[#0ea935]/30 bg-[#0ea935]/10 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#0ea935] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_12px_rgba(14,169,53,0.2)] transition-colors hover:border-[#0ea935]/60"
          >
            Sponsors
          </Link>
          <Link
            href="/roadmap/day1"
            class="block rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#f0fff0] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors hover:border-[#0ea935]/40"
          >
            Roadmap
          </Link>
          <Link
            href="/contact"
            class="block rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#f0fff0] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors hover:border-[#0ea935]/40"
          >
            Contacts
          </Link>
          <Link
            href="/events"
            class="mt-6 block rounded-2xl bg-[#0ea935] px-5 py-4 text-center text-sm font-black tracking-widest text-[#050505] uppercase shadow-[0_0_20px_rgba(14,169,53,0.5)] transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
});
