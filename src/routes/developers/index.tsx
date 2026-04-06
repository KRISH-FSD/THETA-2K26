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
    name: "Abishek X",
    role: "Frontend Architect",
    description: "I'm a Frontend Architect who focuses on clarity & emerald glass interfaces.",
    id: "01",
    skills: ["Qwik", "Tailwind", "UI/UX"],
    status: "active",
    photo: "/team/default-avatar.svg",
    links: {
      github: "https://github.com/AbiXnash",
      linkedin: "https://in.linkedin.com/in/abinash-selvarasu"
    },
    accent: "#00ffb3",
    stats: { rating: "4.9", earned: "$12k+", rate: "$45/hr" }
  },
  {
    name: "Krish Flow",
    role: "Core Engineer",
    description: "I'm a Core Engineer who focuses on logic & high-performance grid systems.",
    id: "02",
    skills: ["GSAP", "Logic", "Grid"],
    status: "active",
    photo: "/dev/krish.png",
    links: {
      github: "https://github.com/krish-grid",
      linkedin: "https://linkedin.com/in/krish-flow"
    },
    accent: "#6ffffd",
    stats: { rating: "4.8", earned: "$25k+", rate: "$60/hr" }
  },
  {
    name: "Abishek FX",
    role: "Motion Designer",
    description: "I'm a Motion Designer who focuses on cinematic & fluid user transitions.",
    id: "03",
    skills: ["GSAP", "SFX", "Motion"],
    status: "active",
    photo: "/team/default-avatar.svg",
    links: {
      github: "https://github.com/abishek-fx",
      linkedin: "https://linkedin.com/in/abishek-fx"
    },
    accent: "#ff4fd8",
    stats: { rating: "5.0", earned: "$8k+", rate: "$50/hr" }
  },
  {
    name: "Lingesh Dev",
    role: "Component Lead",
    description: "I'm a Component Lead who focuses on scalable & modular system design.",
    id: "04",
    skills: ["React", "Qwik", "Systems"],
    status: "active",
    photo: "/team/default-avatar.svg",
    links: {
      github: "https://github.com/lingesh-dev",
      linkedin: "https://linkedin.com/in/lingesh-build"
    },
    accent: "#b3ff57",
    stats: { rating: "4.7", earned: "$15k+", rate: "$40/hr" }
  },
  {
    name: "Kowhik Platform",
    role: "Platform Engineer",
    description: "I'm a Platform Engineer who focuses on performance & build velocity.",
    id: "05",
    skills: ["DevOps", "Vercel", "Performance"],
    status: "active",
    photo: "/team/default-avatar.svg",
    links: {
      github: "https://github.com/kowhik-dev",
      linkedin: "https://linkedin.com/in/kowhik-ship"
    },
    accent: "#8d7dff",
    stats: { rating: "4.9", earned: "$20k+", rate: "$55/hr" }
  }
];

export default component$(() => {
  useVisibleTask$(() => {
    document.body.setAttribute("data-theme", "quantum");

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
        }
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
        }
      );

      // Ambient Orbs
      gsap.fromTo(
        ".quantum-orb",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.4,
          scale: 1,
          duration: 2,
          stagger: 0.3,
          ease: "sine.inOut",
        }
      );

      // 3D Tilt Effect on Cards
      document.querySelectorAll(".quantum-card").forEach((card: any) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const { left, top, width, height } = card.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          
          gsap.to(card, {
            rotationY: x * 10,
            rotationX: -y * 10,
            transformPerspective: 1000,
            ease: "power2.out",
            duration: 0.5,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            ease: "power2.out",
            duration: 0.8,
          });
        });
      });
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
          background: linear-gradient(135deg, rgba(15,20,30,0.8), rgba(5,5,10,0.9));
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .quantum-card:hover {
          border-color: var(--quantum-accent);
          box-shadow: 0 0 40px var(--quantum-glow);
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
          animation: quantumOrbFloat 20s ease-in-out infinite;
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
        <div class="quantum-orb quantum-orb-float absolute -top-24 -left-24 h-[600px] w-[600px] rounded-full bg-[#00ffb3]/15 blur-[160px]" />
        <div class="quantum-orb quantum-orb-float absolute top-1/4 -right-48 h-[700px] w-[700px] rounded-full bg-[#ff4fd8]/10 blur-[180px]" style="animation-delay: -5s" />
        <div class="quantum-orb quantum-orb-float absolute -bottom-48 left-1/3 h-[550px] w-[550px] rounded-full bg-[#6ffffd]/12 blur-[140px]" style="animation-delay: -10s" />
        
        {/* Secondary Accents */}
        <div class="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00ffb3]/20 to-transparent blur-[2px]" />
        <div class="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-[#6ffffd]/10 to-transparent blur-[2px]" />
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div class="mb-20 text-center">
          <span class="quantum-reveal inline-block rounded-full border border-[#00ffb3]/30 bg-[#00ffb3]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffb3]">
            WebTek Studio
          </span>
          <h1 
            class="quantum-reveal mt-8 text-[clamp(3.5rem,12vw,8rem)] font-black uppercase leading-[0.85] tracking-[-0.08em] text-white"
            style="font-family: var(--font-hero-display)"
          >
            The Quantum <br/>
            <span class="text-transparent" style="-webkit-text-stroke: 1.5px rgba(255,255,255,0.4)">Builders.</span>
          </h1>
          <p class="quantum-reveal mx-auto mt-8 max-w-2xl text-lg text-[#8ca38c]">
            Engineering the next generation of techno-management experiences. 
            A collective of architects, designers, and developers shaping the digital frontier of Theta 2026.
          </p>
        </div>

        {/* Social Portfolio 3+2 Grid */}
        <div class="mx-auto max-w-5xl space-y-12">
          {/* Row 1: Top 3 Developers */}
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {developers.slice(0, 3).map((dev) => (
              <article 
                key={dev.id}
                class="group relative mx-auto flex w-full max-w-[260px] flex-col bg-white p-2 rounded-[1.75rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-full"
              >
                {/* Image Block */}
                <div class="relative overflow-hidden rounded-[1.25rem] bg-gray-100 aspect-square">
                  <div class="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/10 backdrop-blur-xl text-white border border-white/20">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  </div>
                  <img src={dev.photo} alt={dev.name} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Content Block */}
                <div class="flex flex-1 flex-col pt-4 px-1">
                  <div class="mb-2.5">
                    <div class="flex items-center gap-1.5">
                      <h2 class="text-[13px] font-black tracking-tight text-gray-900 font-sans italic uppercase">{dev.name}</h2>
                      <svg class="h-3.5 w-3.5 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p class="mt-1 text-[9px] leading-relaxed font-medium text-gray-400 line-clamp-2">{dev.description}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div class="mb-5 grid grid-cols-3 gap-1.5 border-t border-gray-100 pt-4">
                    <div class="text-center">
                      <div class="flex items-center justify-center gap-0.5 text-[10px] font-bold text-gray-900">
                        <svg class="h-2 w-2 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        {dev.stats.rating}
                      </div>
                      <p class="mt-0.5 text-[7px] font-extrabold uppercase tracking-widest text-gray-300">Rating</p>
                    </div>
                    <div class="text-center border-x border-gray-100">
                      <div class="text-[10px] font-bold text-gray-900">{dev.stats.earned}</div>
                      <p class="mt-0.5 text-[7px] font-extrabold uppercase tracking-widest text-gray-300">Earned</p>
                    </div>
                    <div class="text-center">
                      <div class="text-[10px] font-bold text-gray-900">{dev.stats.rate}</div>
                      <p class="mt-0.5 text-[7px] font-extrabold uppercase tracking-widest text-gray-300">Rate</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button class="mt-auto group/btn relative flex items-center justify-center gap-1.5 rounded-full bg-black py-2.5 text-[8px] font-black uppercase tracking-widest text-white transition-all hover:bg-gray-800 active:scale-95 shadow-md">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Get In Touch
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Row 2: Bottom 2 Developers (Centered) */}
          <div class="mx-auto flex flex-wrap justify-center gap-8">
            {developers.slice(3, 5).map((dev) => (
              <article 
                key={dev.id}
                class="group relative flex w-full max-w-[260px] flex-col bg-white p-2 rounded-[1.75rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-full"
              >
                {/* Image Block */}
                <div class="relative overflow-hidden rounded-[1.25rem] bg-gray-100 aspect-square">
                  <div class="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/10 backdrop-blur-xl text-white border border-white/20">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  </div>
                  <img src={dev.photo} alt={dev.name} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Content Block */}
                <div class="flex flex-1 flex-col pt-4 px-1">
                  <div class="mb-2.5">
                    <div class="flex items-center gap-1.5">
                      <h2 class="text-[13px] font-black tracking-tight text-gray-900 font-sans italic uppercase">{dev.name}</h2>
                      <svg class="h-3.5 w-3.5 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p class="mt-1 text-[9px] leading-relaxed font-medium text-gray-400 line-clamp-2">{dev.description}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div class="mb-5 grid grid-cols-3 gap-1.5 border-t border-gray-100 pt-4">
                    <div class="text-center">
                      <div class="flex items-center justify-center gap-0.5 text-[10px] font-bold text-gray-900">
                        <svg class="h-2 w-2 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        {dev.stats.rating}
                      </div>
                      <p class="mt-0.5 text-[7px] font-extrabold uppercase tracking-widest text-gray-300">Rating</p>
                    </div>
                    <div class="text-center border-x border-gray-100">
                      <div class="text-[10px] font-bold text-gray-900">{dev.stats.earned}</div>
                      <p class="mt-0.5 text-[7px] font-extrabold uppercase tracking-widest text-gray-300">Earned</p>
                    </div>
                    <div class="text-center">
                      <div class="text-[10px] font-bold text-gray-900">{dev.stats.rate}</div>
                      <p class="mt-0.5 text-[7px] font-extrabold uppercase tracking-widest text-gray-300">Rate</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button class="mt-auto group/btn relative flex items-center justify-center gap-1.5 rounded-full bg-black py-2.5 text-[8px] font-black uppercase tracking-widest text-white transition-all hover:bg-gray-800 active:scale-95 shadow-md">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Get In Touch
                  </button>
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
              Crystalline Design. <br/>
              Quantum Code.
            </h2>
            <p class="mt-6 text-[#8ca38c]">
              We believe in the power of visual storytelling through performance-optimized code. 
              Our studio operates at the intersection of aesthetics and engineering.
            </p>
          </div>
          <Link 
            href="/contact"
            class="group relative inline-flex items-center gap-4 rounded-full border border-[#00ffb3]/40 bg-[#00ffb3]/10 px-8 py-4 text-sm font-black uppercase tracking-widest text-[#00ffb3] transition-all hover:bg-[#00ffb3] hover:text-black"
          >
            Work with us
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
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
      content: "The architects and engineers behind Theta 2026. Exploring the future of web interfaces.",
    },
  ],
};
