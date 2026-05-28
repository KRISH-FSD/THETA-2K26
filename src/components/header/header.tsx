import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

type Theme = "default" | "spider" | "onepiece" | "red-ben10";
type NavLogo = "default";

const readTheme = (): Theme => {
  const value = document.body.getAttribute("data-theme") as Theme | null;
  return value === "spider" || value === "onepiece" || value === "red-ben10"
    ? value
    : "default";
};

const readNavLogo = (): NavLogo => {
  return "default";
};

export const Header = component$(() => {
  const location = useLocation();
  const open = useSignal(false);
  const theme = useSignal<Theme>("default");
  const uiThemeOverride = useSignal<Theme | null>(null);
  const navLogo = useSignal<NavLogo>("default");

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
  });

  useVisibleTask$(() => {
    theme.value = readTheme();
    navLogo.value = readNavLogo();
    const obs = new MutationObserver(() => {
      theme.value = readTheme();
      navLogo.value = readNavLogo();
    });
    const onUiThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: Theme | null }>).detail;
      uiThemeOverride.value = detail?.theme || null;
    };

    window.addEventListener("theta-ui-theme-change", onUiThemeChange as EventListener);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "data-nav-logo"] });
    return () => {
      window.removeEventListener("theta-ui-theme-change", onUiThemeChange as EventListener);
      obs.disconnect();
    };
  });

  const resolvedTheme = uiThemeOverride.value || theme.value;

  const toggleMenu = $(() => {
    open.value = !open.value;
  });

  /* Derived accent color for current theme */
  const accent = resolvedTheme === "spider" ? "#ff4040"
    : resolvedTheme === "onepiece" ? "#ffd700"
      : resolvedTheme === "red-ben10" ? "#ff4d4f"
        : "#0ea935";
  const accentLight = resolvedTheme === "spider" ? "rgba(220,16,16,0.35)"
    : resolvedTheme === "onepiece" ? "rgba(255,215,0,0.35)"
      : resolvedTheme === "red-ben10" ? "rgba(255,16,16,0.35)"
        : "rgba(14,169,53,0.35)";
  const accentBg = resolvedTheme === "spider" ? "rgba(220,16,16,0.1)"
    : resolvedTheme === "onepiece" ? "rgba(255,215,0,0.1)"
      : resolvedTheme === "red-ben10" ? "rgba(255,16,16,0.1)"
        : "rgba(14,169,53,0.1)";
  const accentGlow = resolvedTheme === "spider" ? "rgba(220,16,16,0.5)"
    : resolvedTheme === "onepiece" ? "rgba(200,160,0,0.5)"
      : resolvedTheme === "red-ben10" ? "rgba(255,40,40,0.5)"
        : "rgba(14,169,53,0.5)";
  const navLogoAccent = accent;
  const navLogoAccentLight = accentLight;
  const navLogoAccentBg = accentBg;
  const navLogoAccentGlow = accentGlow;
  const usesBen10Pair = (resolvedTheme === "default" || resolvedTheme === "red-ben10");
  const specialLogoSrc = resolvedTheme === "spider" ? "/spidy/image.webp"
    : resolvedTheme === "onepiece" ? "/onepeice/one-peice-logo.webp"
      : "";
  const specialLogoAlt = resolvedTheme === "spider" ? "Spider-Man"
    : resolvedTheme === "onepiece" ? "One Piece"
      : "Theme Logo";
  const navMuted = resolvedTheme === "spider" ? "rgba(255,180,180,0.68)"
    : resolvedTheme === "onepiece" ? "rgba(255,220,150,0.72)"
      : resolvedTheme === "red-ben10" ? "#a38c8c"
        : "#8ca38c";
  const ben10LogoSrc = resolvedTheme === "red-ben10"
    ? "/red-ben10/red-ben10.webp"
    : "/ben10/ben10-logo.webp";
  const ben10LogoAlt = resolvedTheme === "red-ben10" ? "Red Ben 10 Logo" : "Ben 10 Logo";

  const navLinkActive = (href: string) =>
    isActive(href)
      ? `px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs t-spider-nav-active t-spider-nav-hover`
      : `px-2 text-[0.65rem] font-bold tracking-widest uppercase transition-colors lg:text-xs t-spider-nav-hover`;

  const navLinkStyle = (href: string) =>
    `color:${isActive(href) ? accent : navMuted};`;

  const mobilePrimaryLinkClass = (href: string) =>
    [
      "flex min-w-0 items-center justify-center rounded-full border px-3 py-2 text-[0.6rem] font-black tracking-[0.18em] uppercase backdrop-blur-xl transition-colors",
      isActive(href)
        ? "t-spider-mobile-highlight shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        : "border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.55)] text-[#f0fff0]",
    ].join(" ");

  const mobilePrimaryLinkStyle = (href: string) =>
    isActive(href)
      ? `border:1px solid ${accentLight};background:${accentBg};color:${accent};box-shadow:inset 0 1px 1px rgba(255,255,255,0.05),0 0 12px ${accentBg};`
      : "";

  const developerButtonActive = isActive("/developers");

  return (
    <>

      <header class="pointer-events-none fixed top-3 right-0 left-0 z-[110] flex w-full items-center justify-between px-3 sm:px-4 md:top-5 md:px-6">
        {/* Left: Theta Logo */}
        <div class="pointer-events-auto flex min-w-0 flex-1 items-center md:flex-initial md:w-[220px] lg:w-[280px]">
          <Link
            href="/"
            class="origin-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03]"
          >
            <img
              src="/theta-logo.webp"
              alt="Theta"
              data-critical-media
              loading="eager"
              fetchPriority="high"
              decoding="async"
              class="h-18 w-auto object-contain opacity-95 [filter:brightness(0)_invert(1)] transition-opacity hover:opacity-100 sm:h-20 md:h-20"
            />
          </Link>
        </div>

        {/* Center: Pill Navigation (Desktop) */}
        <nav class="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[2.5rem] border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.5)] px-4 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform hover:scale-[1.02] md:flex lg:gap-6 lg:px-6">
          <Link href="/events" class={navLinkActive("/events")} style={navLinkStyle("/events")}>Events</Link>
          <Link href="/sponsors" class={navLinkActive("/sponsors")} style={navLinkStyle("/sponsors")}>Sponsors</Link>

          {/* Center logo button */}
          <Link href="/" class="t-ben10-link group relative mx-1 flex shrink-0 items-center justify-center lg:mx-2">
            <div
              class="t-ben10-shell relative z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505]/80 backdrop-blur-md transition-all lg:h-14 lg:w-14"
              style={`border-color:${navLogoAccentLight};box-shadow:0 0 20px ${navLogoAccentBg},0 0 30px ${navLogoAccentGlow};transition:border-color 0.5s,box-shadow 0.5s;`}
            >
              <span
                class="t-ben10-shell-glow"
                style={`background:radial-gradient(circle,${navLogoAccentBg.replace("0.14", "0.55").replace("0.1", "0.55")},transparent 70%);transition:background 0.5s;`}
              />
              {usesBen10Pair ? (
                <>
                  <img
                    src={ben10LogoSrc}
                    alt={ben10LogoAlt}
                    data-critical-media
                    loading="eager"
                    decoding="async"
                    class="t-ben10-icon h-7 lg:h-10 scale-100 opacity-100 absolute top-1/2 left-1/2 w-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-500"
                    style="transition:opacity 0.32s ease,transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);"
                  />
                </>
              ) : (
                <img
                  src={specialLogoSrc}
                  alt={specialLogoAlt}
                  data-critical-media
                  loading="eager"
                  decoding="async"
                  class="t-ben10-icon w-auto object-contain transition-all duration-500 h-7 lg:h-10"
                  style="transition:opacity 0.32s ease,transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);"
                />
              )}
            </div>
          </Link>

          <Link href="/roadmap/day1" class={navLinkActive("/roadmap")} style={navLinkStyle("/roadmap")}>Roadmap</Link>
          <Link href="/contact" class={navLinkActive("/contact")} style={navLinkStyle("/contact")}>Contacts</Link>
        </nav>

        {/* Mobile: compact Ben 10 navbar */}
        <div class="pointer-events-auto absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center md:hidden">
          <div class="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,10,0.52)] px-2 py-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_10px_24px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <Link
              href="/events"
              class={mobilePrimaryLinkClass("/events")}
              style={mobilePrimaryLinkStyle("/events") + "width: 80px; display: flex; justify-content: center;"}
            >
              Events
            </Link>
            <Link
              href="/"
              class="t-ben10-link t-ben10-shell relative z-10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.7)] backdrop-blur-xl"
              style={`border-color:${navLogoAccentLight};box-shadow:0 0 16px ${navLogoAccentBg},0 0 24px ${navLogoAccentGlow};transition:border-color 0.5s,box-shadow 0.5s;`}
            >
              <span
                class="t-ben10-shell-glow"
                style={`background:radial-gradient(circle,${navLogoAccentBg.replace("0.14", "0.55").replace("0.1", "0.55")},transparent 70%);transition:background 0.5s;`}
              />
              {usesBen10Pair ? (
                <>
                  <img
                    src={ben10LogoSrc}
                    alt={ben10LogoAlt}
                    data-critical-media
                    loading="eager"
                    decoding="async"
                    class="t-ben10-icon h-7 scale-100 opacity-100 absolute top-1/2 left-1/2 w-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-500"
                    style="transition:opacity 0.32s ease,transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);"
                  />
                </>
              ) : (
                <img
                  src={specialLogoSrc}
                  alt={specialLogoAlt}
                  data-critical-media
                  loading="eager"
                  decoding="async"
                  class="t-ben10-icon w-auto object-contain transition-all duration-500 h-7"
                  style="transition:opacity 0.32s ease,transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);"
                />
              )}
            </Link>
            <Link
              href="/roadmap/day1"
              class={mobilePrimaryLinkClass("/roadmap")}
              style={mobilePrimaryLinkStyle("/roadmap") + "width: 80px; display: flex; justify-content: center;"}
            >
              Roadmap
            </Link>
          </div>
        </div>

        {/* Right: Developers + Hamburger */}
        <div class="pointer-events-auto flex flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-initial md:w-[290px] lg:w-[420px]">
          <Link href="/developers" class="group pointer-events-auto relative hidden md:flex">
            <div
              class="relative z-10 flex items-center justify-center gap-2.5 overflow-hidden rounded-full border bg-[#050505]/40 px-5 py-2.5 text-[0.6rem] font-black tracking-[0.2em] whitespace-nowrap uppercase backdrop-blur-md transition-all duration-300 lg:px-8 lg:py-3.5 lg:text-[0.7rem]"
              style={
                developerButtonActive
                  ? `border-color:${accent};background:${accentBg};color:${accent};box-shadow:0 0 20px ${accentBg},inset 0 0 10px ${accentBg};`
                  : `border-color:${accent}44;color:${accent};box-shadow:0 0 15px ${accentBg};`
              }
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70"
                  style={developerButtonActive ? "" : "animation-duration: 3s;"}
                ></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
              </span>
              <span class="mt-[1px]">Developers</span>
              <svg
                class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </Link>

          <button
            type="button"
            onClick$={toggleMenu}
            class="t-spider-hamburger flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(10,10,10,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:hidden"
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
          "fixed inset-x-4 top-[84px] z-[200] overflow-hidden rounded-[2.5rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.85)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all duration-500 md:hidden",
          open.value
            ? "pointer-events-auto max-h-[36rem] py-8 opacity-100 translate-y-0"
            : "pointer-events-none max-h-0 py-0 opacity-0 -translate-y-4",
        ]}
      >
        <div class="space-y-3 px-6">
          <Link href="/sponsors"
            class={[
              "block rounded-2xl border px-5 py-4 text-center text-sm font-bold tracking-widest uppercase transition-colors",
              isActive("/sponsors")
                ? "t-spider-mobile-highlight shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                : "t-spider-mobile-hover border-[rgba(255,255,255,0.05)] bg-[#111111]/80 text-[#f0fff0]"
            ]}
            style={isActive("/sponsors") ? `border:1px solid ${accentLight};background:${accentBg};color:${accent};box-shadow:inset 0 1px 1px rgba(255,255,255,0.05),0 0 12px ${accentBg};` : ""}
          >
            Sponsors
          </Link>
          <Link href="/contact"
            class={[
              "block rounded-2xl border px-5 py-4 text-center text-sm font-bold tracking-widest uppercase transition-colors",
              isActive("/contact")
                ? "t-spider-mobile-highlight shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                : "t-spider-mobile-hover border-[rgba(255,255,255,0.05)] bg-[#111111]/80 text-[#f0fff0]"
            ]}
            style={isActive("/contact") ? `border:1px solid ${accentLight};background:${accentBg};color:${accent};box-shadow:inset 0 1px 1px rgba(255,255,255,0.05),0 0 12px ${accentBg};` : ""}
          >
            Contacts
          </Link>
          <Link
            href="/developers"
            class="mt-6 block rounded-2xl px-5 py-4 text-center text-sm font-black tracking-widest text-white uppercase transition-all"
            style={`background:${accent};box-shadow:0 0 20px ${accentGlow}; opacity: 0.8;`}
          >
            <span class="inline-flex items-center justify-center gap-2">
              <span class="inline-flex h-2 w-2 rounded-full bg-white opacity-90 shadow-[0_0_10px_white]" />
              <span>Developers</span>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
});
