import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

export const Header = component$(() => {
  const location = useLocation();
  const open = useSignal(false);
  const theme = useSignal<"default" | "spider" | "onepiece">("default");

  const isActive = (href: string) => {
    const p = location.url.pathname.replace(/\/$/, "") || "/";
    const h = href.replace(/\/$/, "") || "/";
    if (h === "/") return p === "/";
    return p === h || p.startsWith(h + "/");
  };

  /* Watch route changes — close menu + sync theme from body data-attr */
  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    open.value = false;

    /* Read theme set by the page component */
    const t = document.body.getAttribute("data-theme") as typeof theme.value | null;
    theme.value = t === "spider" ? "spider" : t === "onepiece" ? "onepiece" : "default";

    /* Observe future body attribute changes (set by page useVisibleTask$) */
    const obs = new MutationObserver(() => {
      const val = document.body.getAttribute("data-theme") as typeof theme.value | null;
      theme.value = val === "spider" ? "spider" : val === "onepiece" ? "onepiece" : "default";
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  });

  const toggleMenu = $(() => {
    open.value = !open.value;
  });

  /* Derived accent color for current theme */
  const accent = theme.value === "spider" ? "#ff4040" : theme.value === "onepiece" ? "#ffd700" : "#0ea935";
  const accentLight = theme.value === "spider" ? "rgba(220,16,16,0.35)" : theme.value === "onepiece" ? "rgba(255,215,0,0.35)" : "rgba(14,169,53,0.35)";
  const accentBg    = theme.value === "spider" ? "rgba(220,16,16,0.1)"  : theme.value === "onepiece" ? "rgba(255,215,0,0.1)"  : "rgba(14,169,53,0.1)";
  const accentGlow  = theme.value === "spider" ? "rgba(220,16,16,0.5)"  : theme.value === "onepiece" ? "rgba(200,160,0,0.5)"  : "rgba(14,169,53,0.5)";
  const logoSrc     = theme.value === "spider"   ? "/spidy/image.png"
                    : theme.value === "onepiece" ? "/onepeice/one-peice-logo.png"
                    : "/ben10/ben10-logo.png";
  const logoAlt     = theme.value === "spider"   ? "Spider-Man"
                    : theme.value === "onepiece" ? "One Piece"
                    : "Ben 10 Logo";

  const navLinkActive = (href: string) =>
    isActive(href)
      ? `px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs t-spider-nav-active t-spider-nav-hover`
      : `px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs text-[#8ca38c] t-spider-nav-hover`;

  const developerButtonActive = isActive("/developers");

  return (
    <>
      <header class="pointer-events-none fixed top-6 right-0 left-0 z-[110] flex w-full items-center justify-between px-3 sm:px-4 md:top-8 md:px-6">
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

        {/* Center: Pill Navigation (Desktop) */}
        <nav class="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[2.5rem] border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.5)] px-4 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform hover:scale-[1.02] md:flex lg:gap-6 lg:px-6">
          <Link href="/events" class={navLinkActive("/events")}>Events</Link>
          <Link href="/sponsors" class={navLinkActive("/sponsors")}>Sponsors</Link>

          {/* Center logo button */}
          <Link href="/" class="t-ben10-link group relative mx-1 flex shrink-0 items-center justify-center lg:mx-2">
            <div
              class="t-ben10-shell relative z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505]/80 backdrop-blur-md transition-all lg:h-14 lg:w-14"
              style={`border-color:${accentLight};box-shadow:0 0 20px ${accentBg};transition:border-color 0.5s,box-shadow 0.5s;`}
            >
              <span
                class="t-ben10-shell-glow"
                style={`background:radial-gradient(circle,${accentBg.replace("0.1","0.55")},transparent 70%);transition:background 0.5s;`}
              />
              <img
                src={logoSrc}
                alt={logoAlt}
                class="t-ben10-icon h-7 w-auto object-contain lg:h-10"
                style="transition:opacity 0.4s,transform 0.4s;"
              />
            </div>
          </Link>

          <Link href="/roadmap/day1" class={navLinkActive("/roadmap")}>Roadmap</Link>
          <Link href="/contact"      class={navLinkActive("/contact")}>Contacts</Link>
        </nav>

        {/* Center: Mobile Logo */}
        <div class="pointer-events-auto flex flex-1 justify-center md:hidden">
          <Link
            href="/"
            class="t-ben10-link t-ben10-shell relative z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.6)] backdrop-blur-xl"
            style={`border-color:${accentLight};box-shadow:0 0 20px ${accentBg};transition:border-color 0.5s,box-shadow 0.5s;`}
          >
            <span
              class="t-ben10-shell-glow"
              style={`background:radial-gradient(circle,${accentBg.replace("0.1","0.55")},transparent 70%);transition:background 0.5s;`}
            />
            <img
              src={logoSrc}
              alt={logoAlt}
              class="t-ben10-icon h-10 w-auto object-contain"
              style="transition:opacity 0.4s,transform 0.4s;"
            />
          </Link>
        </div>

        {/* Right: Register + Hamburger */}
        <div class="pointer-events-auto flex flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-initial md:w-[260px] lg:w-[390px]">
          <div class="group pointer-events-auto relative hidden md:flex">
            <Link
              href="/developers"
              class="relative z-10 flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-[0.6rem] font-black tracking-[0.24em] whitespace-nowrap uppercase text-[#f7fbff] backdrop-blur-xl transition-all duration-300 active:scale-95 lg:px-6 lg:py-3"
              style={
                developerButtonActive
                  ? "border-color:rgba(111,255,253,0.72);box-shadow:0 0 0 1px rgba(255,0,184,0.15),0 0 24px rgba(111,255,253,0.22),0 0 52px rgba(255,0,184,0.2);"
                  : "border-color:rgba(255,255,255,0.12);box-shadow:0 0 18px rgba(111,255,253,0.14),0 0 36px rgba(255,0,184,0.12);"
              }
            >
              <span
                class="absolute inset-0"
                style="background:linear-gradient(135deg,rgba(6,18,38,0.95),rgba(31,8,50,0.92));"
              />
              <span
                class="absolute inset-y-[-120%] left-[-20%] w-[70%] rotate-12 opacity-80 blur-2xl transition-transform duration-500 group-hover:translate-x-6"
                style="background:linear-gradient(180deg,rgba(111,255,253,0.6),rgba(255,0,184,0.55),rgba(171,255,57,0.34));"
              />
              <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6ffffd] opacity-70" />
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ff4fd8] shadow-[0_0_14px_rgba(255,79,216,0.75)]" />
              </span>
              <span class="relative">Developers</span>
              <svg
                class="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div class="group pointer-events-auto relative hidden cursor-pointer lg:flex">
            <Link
              href="/events"
              class="t-spider-register relative z-10 hidden items-center justify-center gap-2.5 overflow-hidden rounded-full border bg-[#050505]/40 px-5 py-2.5 text-[0.6rem] font-black tracking-[0.2em] whitespace-nowrap uppercase backdrop-blur-md transition-all duration-300 active:scale-95 lg:flex lg:px-8 lg:py-3.5 lg:text-[0.7rem]"
              style={`border-color:${accent};color:${accent};box-shadow:0 0 15px ${accentBg},inset 0 0 10px ${accentBg};`}
            >
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
              </span>
              <span class="mt-[1px]">Register</span>
              <svg class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <button
            type="button"
            onClick$={toggleMenu}
            class="t-spider-hamburger flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:hidden"
            style={`color:${accent};`}
          >
            {open.value ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        class={[
          "fixed inset-x-4 top-[74px] z-[99] overflow-hidden rounded-[2.5rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.85)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all duration-300 md:hidden",
          open.value
            ? "pointer-events-auto max-h-[34rem] py-6 opacity-100"
            : "pointer-events-none max-h-0 py-0 opacity-0",
        ]}
      >
        <div class="space-y-3 px-6">
          <Link href="/events"
            class="t-spider-mobile-hover block rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#f0fff0] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors">
            Events
          </Link>
          <Link href="/sponsors"
            class="t-spider-mobile-highlight block rounded-2xl px-5 py-4 text-center text-sm font-bold tracking-widest uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors"
            style={`border:1px solid ${accentLight};background:${accentBg};color:${accent};box-shadow:inset 0 1px 1px rgba(255,255,255,0.05),0 0 12px ${accentBg};`}>
            Sponsors
          </Link>
          <Link href="/roadmap/day1"
            class="t-spider-mobile-hover block rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#f0fff0] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors">
            Roadmap
          </Link>
          <Link href="/contact"
            class="t-spider-mobile-hover block rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-5 py-4 text-center text-sm font-bold tracking-widest text-[#f0fff0] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors">
            Contacts
          </Link>
          <Link
            href="/developers"
            class="block rounded-2xl border px-5 py-4 text-center text-sm font-black tracking-[0.22em] uppercase text-[#f7fbff] shadow-[0_0_18px_rgba(111,255,253,0.16)] transition-all"
            style={
              developerButtonActive
                ? "border-color:rgba(111,255,253,0.65);background:linear-gradient(135deg,rgba(8,22,42,0.96),rgba(34,8,44,0.94));box-shadow:0 0 20px rgba(111,255,253,0.22),0 0 44px rgba(255,0,184,0.16);"
                : "border-color:rgba(255,255,255,0.08);background:linear-gradient(135deg,rgba(8,18,35,0.92),rgba(27,10,38,0.9));box-shadow:0 0 16px rgba(111,255,253,0.14),0 0 28px rgba(255,0,184,0.1);"
            }
          >
            Developers
          </Link>
          <Link href="/events"
            class="t-spider-mobile-register mt-6 block rounded-2xl px-5 py-4 text-center text-sm font-black tracking-widest text-white uppercase transition-colors"
            style={`background:${accent};box-shadow:0 0 20px ${accentGlow};`}>
            Register
          </Link>
        </div>
      </div>
    </>
  );
});
