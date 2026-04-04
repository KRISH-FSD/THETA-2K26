import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { gsap } from "gsap";

interface NeonCard {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  glow: string;
  surface: string;
  chips: string[];
}

const heroSignals = [
  { label: "Stack", value: "Qwik + Tailwind", accent: "#6ffffd" },
  { label: "Motion", value: "GSAP Driven", accent: "#ff4fd8" },
  { label: "Workflow", value: "AI Assisted", accent: "#b3ff57" },
  { label: "Output", value: "Rapid Shipping", accent: "#8d7dff" },
] as const;

const buildLanes: NeonCard[] = [
  {
    eyebrow: "Interface Systems",
    title: "Cyan glass surfaces with fast-scanning UI layers.",
    description:
      "The developers page leans into electric cyan, hot pink, and acid lime so it feels intentionally off-palette from the rest of the site.",
    accent: "#6ffffd",
    glow: "rgba(111,255,253,0.22)",
    surface:
      "linear-gradient(150deg, rgba(7,25,42,0.92), rgba(12,6,32,0.92))",
    chips: ["Neon glass", "Command cards", "Responsive layout"],
  },
  {
    eyebrow: "Motion Atmosphere",
    title: "Soft glows, drift fields, and layered depth.",
    description:
      "Instead of static blocks, every section is framed like a futuristic deck with gradients, blur halos, and subtle reveal animation.",
    accent: "#ff4fd8",
    glow: "rgba(255,79,216,0.2)",
    surface:
      "linear-gradient(160deg, rgba(35,8,48,0.92), rgba(9,12,33,0.92))",
    chips: ["Reveal timing", "Glow trails", "HUD styling"],
  },
  {
    eyebrow: "AI Workflow Mesh",
    title: "Prompt-ready, fast to iterate, easy to extend.",
    description:
      "The page reads like a developer command center where experiments, automation, and release flow all live in one visual language.",
    accent: "#b3ff57",
    glow: "rgba(179,255,87,0.18)",
    surface:
      "linear-gradient(150deg, rgba(19,29,15,0.92), rgba(6,12,23,0.92))",
    chips: ["Prompt ops", "Ship loops", "Build velocity"],
  },
];

const developerCells: NeonCard[] = [
  {
    eyebrow: "Frontend Cell",
    title: "Visual systems with bold contrasts.",
    description:
      "Layouts are built to feel cinematic first, then tuned for mobile, spacing rhythm, and readable hierarchy.",
    accent: "#6ffffd",
    glow: "rgba(111,255,253,0.18)",
    surface:
      "linear-gradient(160deg, rgba(8,24,44,0.9), rgba(8,10,28,0.92))",
    chips: ["Page systems", "Reusable sections", "Responsive polish"],
  },
  {
    eyebrow: "Interaction Cell",
    title: "Motion cues that support the story.",
    description:
      "Hover energy, entry reveals, and glass depth are used as mood-setting tools instead of decorative noise.",
    accent: "#ff4fd8",
    glow: "rgba(255,79,216,0.16)",
    surface:
      "linear-gradient(160deg, rgba(32,7,40,0.92), rgba(10,11,27,0.92))",
    chips: ["Hover states", "Reveal timing", "Depth layers"],
  },
  {
    eyebrow: "Prompt Cell",
    title: "AI-assisted ideation with practical outputs.",
    description:
      "The design language assumes experimentation: fast prototypes, refined prompts, and a smoother path from idea to UI.",
    accent: "#b3ff57",
    glow: "rgba(179,255,87,0.14)",
    surface:
      "linear-gradient(160deg, rgba(20,26,10,0.92), rgba(9,10,28,0.92))",
    chips: ["Prompt drafts", "Visual directions", "Iteration loops"],
  },
  {
    eyebrow: "Release Cell",
    title: "Built to move from concept to shipping quickly.",
    description:
      "A strong CTA, modular sections, and a clear route structure make the page easy to grow into a real team showcase later.",
    accent: "#8d7dff",
    glow: "rgba(141,125,255,0.16)",
    surface:
      "linear-gradient(160deg, rgba(18,12,44,0.92), rgba(9,13,27,0.92))",
    chips: ["Route ready", "CTA wired", "Extendable content"],
  },
];

const terminalRows = [
  "boot theta.dev://command-deck",
  "palette = cyan / pink / lime / ultraviolet",
  "mode = modern neon / intentionally off-brand",
  "stack = qwik / tailwind / gsap / ai workflow",
  "status = ready for rapid iteration",
] as const;

interface DeveloperCredit {
  name: string;
  role: string;
  description: string;
  mark: string;
  tagA: string;
  tagB: string;
  pill: string;
  photo: string;
  linkedin: string;
  github: string;
  accent: string;
  glow: string;
}

const developerCredits: DeveloperCredit[] = [
  {
    name: "Abishek",
    role: "Frontend Developer",
    description: "Crafts neon layouts and responsive sections for the experience.",
    mark: "A1",
    tagA: "UI",
    tagB: "Neon",
    pill: "Core Team",
    photo: "/team/default-avatar.svg",
    linkedin: "in/abishek-ui",
    github: "@abishek-ui",
    accent: "#6ffffd",
    glow: "rgba(111,255,253,0.22)",
  },
  {
    name: "Krish",
    role: "UI Engineer",
    description: "Shapes card rhythm, spacing, and polished interface flow.",
    mark: "KR",
    tagA: "Flow",
    tagB: "Grid",
    pill: "Design Sync",
    photo: "/team/default-avatar.svg",
    linkedin: "in/krish-flow",
    github: "@krish-grid",
    accent: "#ff4fd8",
    glow: "rgba(255,79,216,0.2)",
  },
  {
    name: "Abishek",
    role: "Motion Developer",
    description: "Adds movement, glow timing, and cinematic hover energy.",
    mark: "A2",
    tagA: "FX",
    tagB: "Pulse",
    pill: "Motion Lab",
    photo: "/team/default-avatar.svg",
    linkedin: "in/abishek-fx",
    github: "@abishek-fx",
    accent: "#b3ff57",
    glow: "rgba(179,255,87,0.18)",
  },
  {
    name: "Lingesh",
    role: "Component Developer",
    description: "Builds reusable sections with a clean and scalable structure.",
    mark: "LG",
    tagA: "Build",
    tagB: "Scale",
    pill: "Systems",
    photo: "/team/default-avatar.svg",
    linkedin: "in/lingesh-build",
    github: "@lingesh-dev",
    accent: "#8d7dff",
    glow: "rgba(141,125,255,0.18)",
  },
  {
    name: "Kowhik",
    role: "Platform Developer",
    description: "Keeps the experience smooth, fast, and production ready.",
    mark: "KW",
    tagA: "Ship",
    tagB: "Speed",
    pill: "Release",
    photo: "/team/default-avatar.svg",
    linkedin: "in/kowhik-ship",
    github: "@kowhik-dev",
    accent: "#ff9d3d",
    glow: "rgba(255,157,61,0.18)",
  },
];

export default component$(() => {
  useVisibleTask$(() => {
    document.body.removeAttribute("data-theme");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dev-reveal",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      gsap.fromTo(
        ".dev-panel",
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.95,
          stagger: 0.1,
          delay: 0.12,
          ease: "power2.out",
          clearProps: "transform",
        },
      );

      gsap.fromTo(
        ".dev-orb",
        { opacity: 0, scale: 0.72 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power2.out",
        },
      );
    });

    return () => {
      ctx.revert();
      document.body.removeAttribute("data-theme");
    };
  });

  if (true) {
    return (
      <div class="relative isolate overflow-hidden bg-[#05010f] text-white">
        <style>{`
          .dev-credit-shell {
            background:
              radial-gradient(circle at 18% 14%, rgba(111, 255, 253, 0.18), transparent 22%),
              radial-gradient(circle at 82% 12%, rgba(255, 79, 216, 0.22), transparent 26%),
              radial-gradient(circle at 50% 72%, rgba(179, 255, 87, 0.12), transparent 20%),
              linear-gradient(180deg, #05010f 0%, #080419 42%, #05010f 100%);
          }

          .dev-credit-shell::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 110px 110px;
            opacity: 0.08;
            mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.92), transparent 96%);
            pointer-events: none;
          }

          .dev-credit-orb-a {
            animation: devCreditFloatA 10s ease-in-out infinite;
          }

          .dev-credit-orb-b {
            animation: devCreditFloatB 12s ease-in-out infinite;
          }

          @keyframes devCreditFloatA {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(14px, -18px, 0); }
          }

          @keyframes devCreditFloatB {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(-18px, 20px, 0); }
          }
        `}</style>

        <section class="dev-credit-shell relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
          <div class="pointer-events-none absolute inset-0">
            <div class="dev-credit-orb-a absolute left-[-6rem] top-32 h-56 w-56 rounded-full bg-[#6ffffd]/18 blur-[100px]" />
            <div class="dev-credit-orb-b absolute right-[-7rem] top-28 h-64 w-64 rounded-full bg-[#ff4fd8]/18 blur-[115px]" />
          </div>

          <div class="relative z-10 mx-auto max-w-6xl">
            <div class="mx-auto max-w-3xl text-center">
              <span class="dev-reveal inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#dffcff]">
                <span class="h-2.5 w-2.5 rounded-full bg-[#6ffffd] shadow-[0_0_14px_rgba(111,255,253,0.9)]" />
                Built By
              </span>
              <h1
                class="dev-reveal mt-6 text-[clamp(3.2rem,10vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.08em] text-white"
                style={{ fontFamily: "var(--font-hero-display)" }}
              >
                Developer Cards
              </h1>
              <p class="dev-reveal mt-6 text-base leading-8 text-[#ccd8f4] sm:text-lg">
                I picked the third reference style and turned it into a neon
                glass card layout for your five developers.
              </p>
            </div>

            <div class="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
              {developerCredits.map((developer, index) => (
                <article
                  key={`${developer.name}-${index}`}
                  class={[
                    "dev-card group relative h-[31rem] overflow-hidden rounded-[2.1rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-2 xl:col-span-2",
                    index === 3 ? "xl:col-start-2" : "",
                    index === 4 ? "xl:col-start-4" : "",
                  ]}
                  style={{
                    boxShadow: `0 24px 70px rgba(0,0,0,0.4), 0 0 36px ${developer.glow}`,
                  }}
                >
                  <div
                    class="relative h-full overflow-hidden rounded-[1.75rem] border border-white/[0.08]"
                    style={{
                      background: `radial-gradient(circle at 25% 20%, ${developer.accent}45, transparent 24%), radial-gradient(circle at 78% 20%, rgba(255,255,255,0.14), transparent 20%), linear-gradient(180deg, rgba(12,14,28,0.96), rgba(10,9,20,0.92))`,
                    }}
                  >
                    <div
                      class="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-black text-white"
                      style={{
                        borderColor: `${developer.accent}45`,
                        backgroundColor: `${developer.accent}18`,
                        boxShadow: `0 0 20px ${developer.glow}`,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p
                      class="absolute right-5 top-6 text-[0.68rem] font-black uppercase tracking-[0.28em]"
                      style={{ color: developer.accent }}
                    >
                      Theta Dev
                    </p>

                    <div
                      class="absolute inset-x-5 top-[5.2rem] bottom-[10.8rem] overflow-hidden rounded-[1.8rem] border"
                      style={{
                        borderColor: `${developer.accent}30`,
                        background: `linear-gradient(180deg, ${developer.accent}16, rgba(255,255,255,0.03))`,
                      }}
                    >
                      <div class="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black/10" />
                      <img
                        src={developer.photo}
                        alt={developer.name}
                        class="absolute inset-0 h-full w-full object-contain p-8 opacity-92"
                        style={{
                          filter: `brightness(0) invert(1) drop-shadow(0 0 30px ${developer.glow}) hue-rotate(${index * 28}deg)`,
                        }}
                      />
                      <div
                        class="absolute left-[-10%] top-[-12%] h-36 w-36 rounded-full blur-3xl"
                        style={{
                          backgroundColor: `${developer.accent}55`,
                        }}
                      />
                      <div
                        class="absolute bottom-[-12%] right-[-8%] h-40 w-40 rounded-full blur-3xl"
                        style={{
                          backgroundColor: `${developer.accent}30`,
                        }}
                      />
                      <div
                        class="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.04), transparent 24%, transparent 72%, rgba(255,255,255,0.03))",
                        }}
                      />
                      <div
                        class="absolute left-6 bottom-5 text-[5.5rem] font-black tracking-[-0.08em] text-white/[0.88]"
                        style={{
                          textShadow: `0 0 32px ${developer.glow}`,
                        }}
                      >
                        {developer.mark}
                      </div>
                    </div>

                    <div class="absolute inset-x-4 bottom-4 rounded-[1.55rem] border border-white/10 bg-[rgba(10,10,18,0.72)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                      <div class="flex items-center gap-3">
                        <h2 class="text-[1.75rem] font-black tracking-[-0.05em] text-white">
                          {developer.name}
                        </h2>
                        <span
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full border text-[0.7rem] font-black"
                          style={{
                            borderColor: `${developer.accent}50`,
                            color: developer.accent,
                            backgroundColor: `${developer.accent}16`,
                          }}
                        >
                          +
                        </span>
                      </div>

                      <p
                        class="mt-1 text-[0.7rem] font-black uppercase tracking-[0.24em]"
                        style={{ color: developer.accent }}
                      >
                        {developer.role}
                      </p>

                      <p class="mt-3 text-sm leading-6 text-white/72">
                        {developer.description}
                      </p>

                      <div class="mt-5 flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 text-[0.72rem] font-bold text-white/60">
                          <span class="inline-flex items-center gap-2">
                            <span
                              class="h-2 w-2 rounded-full"
                              style={{ backgroundColor: developer.accent }}
                            />
                            {developer.tagA}
                          </span>
                          <span class="inline-flex items-center gap-2">
                            <span
                              class="h-2 w-2 rounded-full"
                              style={{ backgroundColor: developer.accent }}
                            />
                            {developer.tagB}
                          </span>
                        </div>

                        <span
                          class="inline-flex items-center rounded-full border px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.2em] text-white"
                          style={{
                            borderColor: `${developer.accent}45`,
                            backgroundColor: `${developer.accent}14`,
                            boxShadow: `0 0 20px ${developer.glow}`,
                          }}
                        >
                          {developer.pill}
                        </span>
                      </div>

                      <div class="mt-4 grid grid-cols-2 gap-2">
                        <div class="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5">
                          <p class="text-[0.55rem] font-black uppercase tracking-[0.24em] text-white/40">
                            LinkedIn
                          </p>
                          <p class="mt-1 text-[0.72rem] font-bold text-white/80">
                            {developer.linkedin}
                          </p>
                        </div>
                        <div class="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5">
                          <p class="text-[0.55rem] font-black uppercase tracking-[0.24em] text-white/40">
                            GitHub
                          </p>
                          <p class="mt-1 text-[0.72rem] font-bold text-white/80">
                            {developer.github}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div class="relative isolate overflow-hidden bg-[#05010f] text-white">
      <style>{`
        .developers-shell {
          background:
            radial-gradient(circle at 18% 12%, rgba(111, 255, 253, 0.18), transparent 24%),
            radial-gradient(circle at 80% 10%, rgba(255, 79, 216, 0.2), transparent 28%),
            radial-gradient(circle at 62% 72%, rgba(179, 255, 87, 0.14), transparent 20%),
            linear-gradient(180deg, #05010f 0%, #080419 36%, #04030f 100%);
        }

        .developers-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 120px 120px;
          opacity: 0.08;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent 96%);
          pointer-events: none;
        }

        .dev-float-a {
          animation: devFloatA 10s ease-in-out infinite;
        }

        .dev-float-b {
          animation: devFloatB 13s ease-in-out infinite;
        }

        .dev-float-c {
          animation: devFloatC 12s ease-in-out infinite;
        }

        .dev-noise::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(111, 255, 253, 0.06), transparent 22%, transparent 78%, rgba(255, 79, 216, 0.05)),
            radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 30%);
          mix-blend-mode: screen;
          opacity: 0.7;
          pointer-events: none;
        }

        .dev-terminal-line {
          position: relative;
          overflow: hidden;
        }

        .dev-terminal-line::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(111, 255, 253, 0.16), transparent);
          animation: devScan 5.5s linear infinite;
        }

        @keyframes devFloatA {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(16px, -22px, 0); }
        }

        @keyframes devFloatB {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-18px, 18px, 0); }
        }

        @keyframes devFloatC {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(12px, 18px, 0); }
        }

        @keyframes devScan {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }
      `}</style>

      <section class="developers-shell relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        <div class="pointer-events-none absolute inset-0">
          <div class="dev-orb dev-float-a absolute left-[-7rem] top-28 h-56 w-56 rounded-full bg-[#6ffffd]/18 blur-[95px]" />
          <div class="dev-orb dev-float-b absolute right-[-6rem] top-32 h-64 w-64 rounded-full bg-[#ff4fd8]/18 blur-[110px]" />
          <div class="dev-orb dev-float-c absolute bottom-10 left-[30%] h-48 w-48 rounded-full bg-[#b3ff57]/14 blur-[90px]" />
        </div>

        <div class="relative z-10 mx-auto flex max-w-7xl flex-col gap-16">
          <div class="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div class="max-w-3xl">
              <span
                class="dev-reveal inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.26em] text-[#d8f7ff] shadow-[0_0_28px_rgba(111,255,253,0.08)]"
                style={{ fontFamily: "var(--font-hero-ui)" }}
              >
                <span class="h-2.5 w-2.5 rounded-full bg-[#6ffffd] shadow-[0_0_16px_rgba(111,255,253,0.9)]" />
                Theta Developer Deck
              </span>

              <h1
                class="dev-reveal mt-6 text-[clamp(3.5rem,11vw,7.5rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white"
                style={{ fontFamily: "var(--font-hero-display)" }}
              >
                <span class="block text-white/95">Developers</span>
                <span
                  class="block text-transparent"
                  style={{
                    background:
                      "linear-gradient(92deg, #6ffffd 0%, #ffffff 34%, #ff4fd8 68%, #b3ff57 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  In Neon.
                </span>
              </h1>

              <p class="dev-reveal mt-6 max-w-2xl text-base leading-8 text-[#c6d5f5] sm:text-lg">
                This is a high-voltage developers page for Theta: futuristic,
                intentionally off-palette, and shaped like an AI-era command deck
                instead of matching the current green festival UI.
              </p>

              <div class="dev-reveal mt-8 flex flex-wrap gap-4">
                <Link
                  href="/events"
                  class="inline-flex items-center gap-3 rounded-full border border-[#6ffffd]/40 bg-[#071a28]/80 px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-[#f5fdff] shadow-[0_0_30px_rgba(111,255,253,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6ffffd]/70 hover:shadow-[0_0_36px_rgba(111,255,253,0.3)]"
                >
                  Explore Events
                  <span class="text-[#6ffffd]">/</span>
                  Go Live
                </Link>
                <Link
                  href="/contact"
                  class="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-white/[0.88] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ff4fd8]/45 hover:text-white"
                >
                  Contact Crew
                </Link>
              </div>

              <div class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {heroSignals.map((signal) => (
                  <article
                    key={signal.label}
                    class="dev-panel rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-5 py-5 backdrop-blur-2xl"
                    style={{ boxShadow: `0 0 28px ${signal.accent}22` }}
                  >
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.24em] text-white/42">
                      {signal.label}
                    </p>
                    <p
                      class="mt-3 text-lg font-black text-white"
                      style={{ color: signal.accent }}
                    >
                      {signal.value}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside class="dev-panel relative">
              <div
                class="dev-noise overflow-hidden rounded-[2rem] border border-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(8,11,28,0.95), rgba(25,8,34,0.92))",
                }}
              >
                <div class="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                  <div>
                    <p class="text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#6ffffd]">
                      command.preview
                    </p>
                    <h2
                      class="mt-2 text-3xl font-black tracking-[-0.06em] text-white"
                      style={{ fontFamily: "var(--font-hero-display)" }}
                    >
                      AI x Web UI
                    </h2>
                  </div>
                  <div class="flex gap-2">
                    <span class="h-3 w-3 rounded-full bg-[#6ffffd] shadow-[0_0_18px_rgba(111,255,253,0.8)]" />
                    <span class="h-3 w-3 rounded-full bg-[#ff4fd8] shadow-[0_0_18px_rgba(255,79,216,0.7)]" />
                    <span class="h-3 w-3 rounded-full bg-[#b3ff57] shadow-[0_0_18px_rgba(179,255,87,0.75)]" />
                  </div>
                </div>

                <div class="mt-5 space-y-3">
                  {terminalRows.map((row) => (
                    <div
                      key={row}
                      class="dev-terminal-line rounded-2xl border border-white/[0.06] bg-black/30 px-4 py-3 text-sm text-[#d8e3ff]"
                    >
                      <span class="mr-3 text-[#6ffffd]">&gt;</span>
                      {row}
                    </div>
                  ))}
                </div>

                <div class="mt-6 grid gap-3 sm:grid-cols-3">
                  {["Neon-first", "Modern AI", "Off-brand by design"].map((chip) => (
                    <div
                      key={chip}
                      class="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/[0.78]"
                    >
                      {chip}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div class="grid gap-6 xl:grid-cols-3">
            {buildLanes.map((lane) => (
              <article
                key={lane.title}
                class="dev-panel rounded-[2rem] border border-white/10 p-6 backdrop-blur-2xl sm:p-7"
                style={{
                  background: lane.surface,
                  boxShadow: `0 0 40px ${lane.glow}`,
                }}
              >
                <p
                  class="text-[0.66rem] font-black uppercase tracking-[0.26em]"
                  style={{ color: lane.accent }}
                >
                  {lane.eyebrow}
                </p>
                <h2
                  class="mt-4 text-3xl font-black tracking-[-0.06em] text-white"
                  style={{ fontFamily: "var(--font-hero-display)" }}
                >
                  {lane.title}
                </h2>
                <p class="mt-4 text-sm leading-7 text-[#c8d3f0]">
                  {lane.description}
                </p>
                <div class="mt-6 flex flex-wrap gap-2.5">
                  {lane.chips.map((chip) => (
                    <span
                      key={chip}
                      class="rounded-full border px-3 py-1.5 text-[0.63rem] font-black uppercase tracking-[0.22em] text-white/[0.84]"
                      style={{
                        borderColor: `${lane.accent}45`,
                        backgroundColor: `${lane.accent}12`,
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div>
            <div class="dev-reveal flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-[0.66rem] font-black uppercase tracking-[0.28em] text-[#ff4fd8]">
                  Developer Cells
                </p>
                <h2
                  class="mt-3 text-4xl font-black tracking-[-0.07em] text-white sm:text-5xl"
                  style={{ fontFamily: "var(--font-hero-display)" }}
                >
                  The page feels like a live build room.
                </h2>
              </div>
              <p class="max-w-xl text-sm leading-7 text-[#c4d0eb]">
                The content is structured so you can later swap these cards for
                real team members, profiles, or project highlights without
                rebuilding the route.
              </p>
            </div>

            <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {developerCells.map((cell) => (
                <article
                  key={cell.title}
                  class="dev-panel rounded-[1.9rem] border border-white/10 p-6 backdrop-blur-2xl"
                  style={{
                    background: cell.surface,
                    boxShadow: `0 0 34px ${cell.glow}`,
                  }}
                >
                  <div class="flex items-start justify-between gap-4">
                    <p
                      class="text-[0.62rem] font-black uppercase tracking-[0.26em]"
                      style={{ color: cell.accent }}
                    >
                      {cell.eyebrow}
                    </p>
                    <span
                      class="rounded-full border px-2.5 py-1 text-[0.56rem] font-black uppercase tracking-[0.22em]"
                      style={{
                        borderColor: `${cell.accent}40`,
                        color: cell.accent,
                      }}
                    >
                      Live
                    </span>
                  </div>
                  <h3 class="mt-5 text-2xl font-black tracking-[-0.05em] text-white">
                    {cell.title}
                  </h3>
                  <p class="mt-4 text-sm leading-7 text-[#cbd5ee]">
                    {cell.description}
                  </p>
                  <div class="mt-6 flex flex-wrap gap-2">
                    {cell.chips.map((chip) => (
                      <span
                        key={chip}
                        class="rounded-full border px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/[0.82]"
                        style={{
                          borderColor: `${cell.accent}38`,
                          backgroundColor: `${cell.accent}10`,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div class="dev-panel">
            <div
              class="overflow-hidden rounded-[2.2rem] border border-white/10 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-2xl sm:px-8 sm:py-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(7,24,44,0.86), rgba(35,8,40,0.84), rgba(21,31,12,0.8))",
              }}
            >
              <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="max-w-2xl">
                  <p class="text-[0.66rem] font-black uppercase tracking-[0.28em] text-[#b3ff57]">
                    Ready To Expand
                  </p>
                  <h2
                    class="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl"
                    style={{ fontFamily: "var(--font-hero-display)" }}
                  >
                    Plug in real developers, projects, and release updates next.
                  </h2>
                  <p class="mt-4 text-sm leading-7 text-[#dae4ff]">
                    The route is already wired into the navbar, styled as its own
                    neon world, and ready for real team data whenever you want to
                    level it up.
                  </p>
                </div>

                <div class="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    class="inline-flex items-center justify-center rounded-full border border-[#ff4fd8]/40 bg-[#291032]/70 px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(255,79,216,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_36px_rgba(255,79,216,0.28)]"
                  >
                    Start Collaboration
                  </Link>
                  <Link
                    href="/"
                    class="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-white/[0.88] transition-all duration-300 hover:-translate-y-1 hover:border-[#6ffffd]/42"
                  >
                    Back Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Developers | Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Developer credits page for Theta with neon cards highlighting the builders behind the web experience.",
    },
  ],
};
