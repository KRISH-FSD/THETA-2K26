import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { gsap } from "gsap";

interface QuantumDeveloper {
  name: string;
  role: string;
  description: string;
  id: string;
  skills: string[];
  status: "active" | "away" | "offline";
  photo: string;
  links: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  accent: string;
  stats: {
    rating: string;
    earned: string;
    rate: string;
  };
}

const developers: QuantumDeveloper[] = [
  {
    name: "ABISHEK T",
    role: "Frontend Architect",
    description:
      "Head of frontend, focused on core architecture, clarity, and emerald glass interfaces.",
    id: "01",
    skills: ["Qwik", "Tailwind", "UI/UX"],
    status: "active",
    photo: "/dev/abishekt.jpeg",
    links: {
      github: "https://github.com/AbiXnash",
      linkedin: "https://in.linkedin.com/in/abinash-selvarasu",
    },
    accent: "#00ffb3",
    stats: { rating: "4.9", earned: "$12k+", rate: "$45/hr" },
  },
  {
    name: "KRISH S",
    role: "Core Engineer",
    description:
      "I'm a Core Engineer who focuses on logic & high-performance grid systems.",
    id: "02",
    skills: ["GSAP", "Logic", "Grid"],
    status: "active",
    photo: "/dev/krishhh copy.webp",
    links: {
      github: "https://github.com/KRISH-FSD",
      linkedin: "https://www.linkedin.com/in/krishnakanthsivakumar",
    },
    accent: "#6ffffd",
    stats: { rating: "4.8", earned: "$25k+", rate: "$60/hr" },
  },
  {
    name: "ABISHEK NR",
    role: "Motion Designer",
    description:
      "I'm a Motion Designer who focuses on cinematic & fluid user transitions.",
    id: "03",
    skills: ["GSAP", "SFX", "Motion"],
    status: "active",
    photo: "/team/default-avatar.svg",
    links: {
      github: "https://github.com/abishek-fx",
      linkedin: "https://linkedin.com/in/abishek-fx",
    },
    accent: "#ff4fd8",
    stats: { rating: "5.0", earned: "$8k+", rate: "$50/hr" },
  },
  {
    name: "LINGESH REDDY",
    role: "Component Lead",
    description:
      "I'm a Component Lead who focuses on scalable & modular system design.",
    id: "04",
    skills: ["React", "Qwik", "Systems"],
    status: "active",
    photo: "/dev/lingesh.webp",
    links: {
      github: "https://github.com/lingesh-dev",
      linkedin:
        "https://www.linkedin.com/in/lingeswara-reddy-diguvapati-965a032ba/",
    },
    accent: "#b3ff57",
    stats: { rating: "4.7", earned: "$15k+", rate: "$40/hr" },
  },
  {
    name: "KOUSHIK REDDY",
    role: "Platform Engineer",
    description:
      "I'm a Platform Engineer who focuses on performance & build velocity.",
    id: "05",
    skills: ["DevOps", "Vercel", "Performance"],
    status: "active",
    photo: "/team/default-avatar.svg",
    links: {
      github: "https://github.com/kowhik-dev",
      linkedin: "https://linkedin.com/in/kowhik-ship",
    },
    accent: "#8d7dff",
    stats: { rating: "4.9", earned: "$20k+", rate: "$55/hr" },
  },
];

export default component$(() => {
  useVisibleTask$(() => {
    document.body.setAttribute("data-theme", "quantum");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Hero Reveal
      gsap.fromTo(
        ".quantum-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
        },
      );

      // Card Stagger
      gsap.fromTo(
        ".quantum-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          delay: 0.4,
          ease: "expo.out",
        },
      );

      // Ambient Orbs
      gsap.fromTo(
        ".quantum-orb",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.28,
          scale: 1,
          duration: prefersReducedMotion ? 0.6 : 1.2,
          stagger: 0.3,
          ease: "sine.inOut",
        },
      );
    });

    return () => {
      ctx.revert();
      document.body.removeAttribute("data-theme");
    };
  });

  return (
    <div class="relative min-h-screen overflow-hidden bg-[#050505] text-[#f0fff0]">
      <style>{`
        [data-theme="quantum"] {
          --quantum-accent: #00ffb3;
          --quantum-glow: rgba(0, 255, 179, 0.15);
        }

        .quantum-grid-bg {
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
        }

        .quantum-card {
          background: linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%);
          border: 1px solid rgba(148, 163, 184, 0.18);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          will-change: transform;
          content-visibility: auto;
          contain: layout paint style;
        }

        .quantum-card:hover {
          border-color: var(--quantum-accent);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16), 0 0 20px var(--quantum-glow);
        }

        .quantum-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%);
          background-size: 200% 200%;
          animation: quantumShimmer 6s linear infinite;
        }

        @keyframes quantumShimmer {
          0% { background-position: -100% -100%; }
          100% { background-position: 100% 100%; }
        }

        .quantum-orb-float {
          animation: quantumOrbFloat 24s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes quantumOrbFloat {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -50px); }
          66% { transform: translate(-20px, 40px); }
        }
      `}</style>

      {/* Background Layer */}
      <div class="pointer-events-none fixed inset-0 z-0">
        <div class="quantum-grid-bg absolute inset-0 opacity-20" />
        {/* Core Neon Orbs */}
        <div class="quantum-orb quantum-orb-float absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#00ffb3]/12 blur-[120px]" />
        <div
          class="quantum-orb quantum-orb-float absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-[#ff4fd8]/8 blur-[130px]"
          style="animation-delay: -5s"
        />
        <div
          class="quantum-orb quantum-orb-float absolute -bottom-36 left-1/3 h-[420px] w-[420px] rounded-full bg-[#6ffffd]/10 blur-[110px]"
          style="animation-delay: -10s"
        />

        {/* Secondary Accents */}
        <div class="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00ffb3]/20 to-transparent blur-[2px]" />
        <div class="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-[#6ffffd]/10 to-transparent blur-[2px]" />
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div class="mb-20 text-center">
          <span class="quantum-reveal inline-block rounded-full border border-[#00ffb3]/30 bg-[#00ffb3]/10 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-[#00ffb3] uppercase">
            WebTek Studio
          </span>
          <h1
            class="quantum-reveal mt-8 text-[clamp(3.5rem,12vw,8rem)] leading-[0.85] font-black tracking-[-0.08em] text-white uppercase"
            style="font-family: var(--font-hero-display)"
          >
            The Quantum <br />
            <span
              class="text-transparent"
              style="-webkit-text-stroke: 1.5px rgba(255,255,255,0.4)"
            >
              Builders.
            </span>
          </h1>
          <p class="quantum-reveal mx-auto mt-8 max-w-2xl text-lg text-[#8ca38c]">
            Engineering the next generation of techno-management experiences. A
            collective of architects, designers, and developers shaping the
            digital frontier of Theta 2026.
          </p>
        </div>

        {/* Social Portfolio Grid */}
        <div class="mx-auto max-w-5xl px-6 sm:px-12 lg:px-20">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((dev) => (
              <article
                key={dev.id}
                class="quantum-card group relative mx-auto flex h-full w-full max-w-sm flex-col rounded-[1.75rem] bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)] sm:max-w-full"
              >
                {/* Image Block */}
                <div class="relative aspect-square overflow-hidden rounded-[1.25rem] bg-gray-100">
                  <img
                    src={dev.photo}
                    alt={dev.name}
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content Block */}
                <div class="flex flex-1 flex-col px-1 pt-4">
                  <div class="mb-2.5">
                    <div class="flex items-center gap-1.5">
                      <h2 class="max-w-[calc(100%-1.5rem)] font-sans text-[13px] leading-none font-black tracking-tight text-gray-900 uppercase italic">
                        {dev.name}
                      </h2>
                      <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#3b82f6]">
                        <svg
                          class="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          <path
                            fill-rule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                    <p class="mt-1 line-clamp-2 text-[9px] leading-relaxed font-medium text-gray-400">
                      {dev.description}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div class="mb-5 flex items-center justify-center gap-3 border-t border-gray-100 pt-4">
                    <a
                      href={dev.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dev.name} GitHub`}
                      class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:bg-black hover:text-white"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.477 2 2 6.589 2 12.248c0 4.526 2.865 8.367 6.839 9.722.5.095.683-.221.683-.492 0-.243-.009-.888-.014-1.742-2.782.617-3.37-1.368-3.37-1.368-.455-1.183-1.11-1.498-1.11-1.498-.908-.636.069-.623.069-.623 1.004.072 1.532 1.054 1.532 1.054.892 1.565 2.341 1.113 2.91.851.091-.664.349-1.114.635-1.37-2.221-.26-4.555-1.14-4.555-5.073 0-1.12.39-2.036 1.03-2.754-.103-.26-.447-1.307.098-2.724 0 0 .84-.277 2.75 1.052A9.303 9.303 0 0112 6.83a9.27 9.27 0 012.504.35c1.909-1.329 2.748-1.052 2.748-1.052.546 1.417.202 2.464.1 2.724.64.718 1.028 1.634 1.028 2.754 0 3.943-2.337 4.81-4.566 5.066.359.318.679.945.679 1.904 0 1.375-.012 2.484-.012 2.822 0 .273.18.592.688.491C19.138 20.61 22 16.772 22 12.248 22 6.589 17.523 2 12 2z" />
                      </svg>
                    </a>
                    <a
                      href={dev.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dev.name} LinkedIn`}
                      class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0a66c2] transition-all duration-300 hover:-translate-y-1 hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A1.96 1.96 0 003.3 4.96c0 1.08.87 1.96 1.95 1.96h.02a1.96 1.96 0 100-3.92H5.25zM20.7 12.58c0-3.08-1.64-4.51-3.83-4.51-1.77 0-2.56.98-3 1.67V8.5h-3.38c.04.82 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92.27-.68.9-1.39 1.95-1.39 1.37 0 1.92 1.05 1.92 2.58V20H21v-7.42z" />
                      </svg>
                    </a>
                  </div>

                  {/* Action Button */}
                  <a
                    href="mailto:thetawebtech@gmail.com"
                    class="group/btn relative mt-auto flex items-center justify-center gap-1.5 rounded-full bg-black py-2.5 text-[8px] font-black tracking-widest text-white uppercase shadow-md transition-all hover:bg-gray-800 active:scale-95"
                  >
                    <svg
                      class="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Get In Touch
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Studio Mantra */}
        <div class="mt-32 flex flex-col items-center justify-between gap-12 border-t border-white/5 pt-20 lg:flex-row">
          <div class="max-w-xl">
            <h2
              class="text-4xl font-black tracking-tight text-white"
              style="font-family: var(--font-hero-display)"
            >
              Crystalline Design. <br />
              Quantum Code.
            </h2>
            <p class="mt-6 text-[#8ca38c]">
              We believe in the power of visual storytelling through
              performance-optimized code. Our studio operates at the
              intersection of aesthetics and engineering.
            </p>
          </div>
          <Link
            href="/contact"
            class="group relative inline-flex items-center gap-4 rounded-full border border-[#00ffb3]/40 bg-[#00ffb3]/10 px-8 py-4 text-sm font-black tracking-widest text-[#00ffb3] uppercase transition-all hover:bg-[#00ffb3] hover:text-black"
          >
            Work with us
            <svg
              class="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "WebTek Studio | Developers",
  meta: [
    {
      name: "description",
      content:
        "The architects and engineers behind Theta 2026. Exploring the future of web interfaces.",
    },
  ],
};
