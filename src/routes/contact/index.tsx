import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── Types ─────────────────────────────────────────────── */
interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
}
interface TeamData {
  order: { key: string; label: string }[];
  president: TeamMember[];
  vicePresidents: TeamMember[];
  corporateRelations: TeamMember[];
  webtek: { github: string; linkedin: string; email: string };
}
interface ContactCopy {
  webtekLabel: string;
  webtekTitle: string;
  webtekDescription: string;
  membersSuffix: string;
  stillQuestionsTitle: string;
  stillQuestionsSubtitle: string;
  sendEmailLabel: string;
}

/* ─── Defaults ───────────────────────────────────────────── */
const defaultCopy: ContactCopy = {
  webtekLabel: "WebTek Team",
  webtekTitle: "Engineering & Platform",
  webtekDescription:
    "Build, deployment, and experience optimization powered by WebTek.",
  membersSuffix: "Operators",
  stillQuestionsTitle: "Still have questions?",
  stillQuestionsSubtitle:
    "Feel free to transceive a message to our coordinators.",
  sendEmailLabel: "Open Comm Channel",
};

const defaultTeamData: TeamData = {
  order: [
    { key: "president", label: "President" },
    { key: "vicePresidents", label: "Vice President" },
    { key: "corporateRelations", label: "Corporate Relations" }
  ],
  president: [],
  vicePresidents: [],
  corporateRelations: [],
  webtek: { github: "#", linkedin: "#", email: "theta@sastra.edu" },
};



/* ─────────────────────────────────────────────────────────── */
export default component$(() => {
  const teamData = useSignal<TeamData>(defaultTeamData);
  const copy = useSignal<ContactCopy>(defaultCopy);

  /* ── data fetch ── */
  useVisibleTask$(async () => {
    try {
      const [tr, cr] = await Promise.all([
        fetch("/data/team.json"),
        fetch("/data/content.json"),
      ]);
      const team = (await tr.json()) as Partial<TeamData>;
      const content = (await cr.json()) as {
        contactPage?: Partial<ContactCopy>;
        seo?: { contactTitle?: string; contactDescription?: string };
      };
      teamData.value = {
        ...defaultTeamData,
        ...team,
        webtek: { ...defaultTeamData.webtek, ...(team.webtek || {}) },
        order: team.order || defaultTeamData.order,
      };
      if (content.contactPage)
        copy.value = { ...defaultCopy, ...content.contactPage };
      if (content.seo?.contactTitle)
        document.title = content.seo.contactTitle;
    } catch {
      /* use defaults */
    }
  });

  /* ── GSAP animations ── */
  useVisibleTask$(({ track, cleanup }) => {
    track(() => teamData.value.order);

    const t = setTimeout(() => {
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        /* 8 ── s-reveal: universal scroll reveal */
        gsap.utils.toArray<HTMLElement>(".s-reveal").forEach((node) => {
          gsap.fromTo(
            node,
            { y: 50, opacity: 0, filter: "blur(10px)" },
            {
              y: 0, opacity: 1, filter: "blur(0px)",
              duration: 1.2, ease: "power4.out",
              scrollTrigger: { trigger: node, start: "top 92%", toggleActions: "play none none none" },
            }
          );
        });

        /* 11 ── Omnitrix Core Pulse & Ambient Drift */
        gsap.to(".ct-omnitrix-core", {
          scale: 1.1, opacity: 0.7, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(".ct-ambient-orb", {
          delay: 0.5, x: "random(-80, 80)", y: "random(-80, 80)", duration: "random(12, 18)",
          repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1.5
        });

        /* 13 ── Member card entrance & 3D tilt */
        const cardElements = document.querySelectorAll<HTMLElement>(".ct-member-card");
        gsap.fromTo(
          cardElements,
          { y: 80, opacity: 0, scale: 0.94, filter: "blur(15px)" },
          {
            y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
            duration: 1, ease: "expo.out", stagger: 0.12,
            scrollTrigger: { trigger: "#ct-team", start: "top 85%" },
          }
        );
        cardElements.forEach((card) => {
          card.addEventListener("mousemove", (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
              rotationY: x * 15, rotationX: -y * 15,
              z: 25, duration: 0.35, ease: "power2.out",
              transformPerspective: 1200,
            });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, z: 0, duration: 0.75, ease: "power3.out" });
          });
        });
      });

      cleanup(() => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    }, 250);

    return () => clearTimeout(t);
  });

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div class="relative min-h-screen overflow-x-hidden bg-[#020402] px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      {/* ── Cinematic Background System ── */}
      <div class="pointer-events-none fixed inset-0 z-0">
        <div class="absolute inset-0 opacity-[0.03]"
          style="background-image:linear-gradient(#0ea935 1px,transparent 1px),linear-gradient(90deg,#0ea935 1px,transparent 1px);background-size:60px 60px;" />
        <div class="ct-ambient-orb absolute left-[15%] top-[15%] h-[500px] w-[500px] rounded-full bg-[#0ea935]/5 blur-[120px]" />
        <div class="ct-ambient-orb absolute right-[10%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-[#166534]/5 blur-[150px]" />
        <div class="absolute left-1/2 top-[40%] h-[100vh] w-[100vh] -translate-x-1/2 -translate-y-[40%] overflow-hidden opacity-[0.05]">
           <div class="ct-omnitrix-core absolute inset-0 flex items-center justify-center">
              <img src="/ben10/ben10-logo.png" alt="" class="h-full w-full animate-[spin_180s_linear_infinite] object-contain filter hue-rotate(90deg) brightness(0.6)" />
           </div>
        </div>
      </div>

      {/* ── Header Section ── */}
      <div class="relative z-10 mx-auto mt-20 mb-20 max-w-5xl text-center">
        <div class="s-reveal mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
          <span class="h-2 w-2 animate-pulse rounded-full bg-[#0ea935] shadow-[0_0_12px_#0ea935]" />
          <span class="text-[0.6rem] font-black tracking-[0.35em] text-white/40 uppercase">Secured Communication Channel</span>
        </div>
        <h1 class="s-reveal t-heading bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-4xl font-black tracking-tighter text-transparent leading-[1.1] md:text-7xl">
          FOR ANY <span class="text-[#0ea935]">QUERIES</span> <br />
          <span class="t-gradient-silver font-outline-2 text-[0.9em]">CONTACT</span>
        </h1>
        <div class="s-reveal mx-auto mt-10 h-[1.5px] w-24 bg-gradient-to-r from-transparent via-[#0ea935] to-transparent shadow-[0_0_15px_#0ea935]" />
      </div>

      <section id="ct-team" class="relative z-10 mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teamData.value.order.map((section) => {
          const members = teamData.value[
            section.key as keyof Omit<TeamData, "order" | "webtek">
          ] as TeamMember[];
          if (!Array.isArray(members) || members.length === 0) return null;

          // Resolve role-based accent color
          const roleColor = section.key === "president" ? "#ef4444" : section.key === "vicePresidents" ? "#eab308" : "#0ea935";

          return members.map((member) => (
            <article
              key={member.name}
              class="ct-member-card group relative h-[170px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-2xl transition-all duration-500"
              style={{ transformStyle: "preserve-3d", borderColor: `${roleColor}22` }}
            >
              {/* Internal glowing elements with role color */}
              <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent" 
                     style={{ backgroundImage: `linear-gradient(to right, ${roleColor}11, transparent)` }} />
                <div class="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent to-transparent shadow-lg"
                     style={{ backgroundImage: `linear-gradient(to right, transparent, ${roleColor}, transparent)`, boxShadow: `0 0 15px ${roleColor}` }} />
              </div>

              <div class="relative z-10 flex h-full items-center gap-6 p-6">
                {/* Avatar with advanced futuristic frame */}
                <div class="relative h-20 w-20 shrink-0 transition-transform duration-700 group-hover:scale-110" style={{ transform: "translateZ(40px)" }}>
                  <div class="absolute -inset-1 animate-[spin_15s_linear_infinite] rounded-2xl border border-dashed opacity-0 transition-opacity group-hover:opacity-100" 
                       style={{ borderColor: `${roleColor}55` }} />
                  <div class="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050505] shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(0,0,0,0.5)]"
                       style={{ borderColor: `${roleColor}44` }}>
                    <img
                      src={member.image || "/team/default-avatar.svg"}
                      alt={member.name}
                      class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                      onError$={(e) => { (e.target as HTMLImageElement).src = "/team/default-avatar.svg"; }}
                    />
                  </div>
                  {/* Status chip */}
                  <div class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-black shadow-lg" 
                       style={{ backgroundColor: roleColor, boxShadow: `0 0 8px ${roleColor}` }} />
                </div>

                {/* Content block */}
                <div class="min-w-0 flex-1 space-y-2.5" style={{ transform: "translateZ(20px)" }}>
                  <div>
                    <span class="inline-block text-[0.6rem] font-black tracking-[0.3em] uppercase opacity-80" 
                          style={{ color: roleColor }}>
                      {section.label}
                    </span>
                    <h3 class="mt-0.5 truncate text-lg font-black text-white transition-colors md:text-xl"
                        style={{ '--hover-color': roleColor } as any}>
                      {member.name}
                    </h3>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <a href={`tel:${member.phone.replace(/\s+/g, "")}`} class="group/link flex items-center gap-2.5 text-[0.75rem] font-bold text-white/40 transition-colors hover:text-white">
                      <div class="flex h-6 w-6 items-center justify-center rounded-lg border border-white/5 bg-white/5 transition-all group-hover/link:bg-white/10"
                           style={{ '--hover-border': `${roleColor}55` } as any}>
                        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span class="tracking-widest">{member.phone}</span>
                    </a>
                    <a href={`mailto:${member.email}`} class="group/link flex items-center gap-2.5 text-[0.75rem] font-bold text-white/40 transition-colors hover:text-white">
                      <div class="flex h-6 w-6 items-center justify-center rounded-lg border border-white/5 bg-white/5 transition-all group-hover/link:bg-white/10">
                        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span class="truncate">{member.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ));
        })}
      </section>

      {/* ══════════════════════════════════════════
          FOOTER CTA — s-cta-shell (exact sponsors pattern)
      ══════════════════════════════════════════ */}
      <section class="relative z-10 mx-auto mt-16 max-w-7xl pb-6">
        <div class="ct-footer-grid s-reveal grid gap-6 lg:grid-cols-2">
          {/* WebTek panel */}
          <div
            class="ct-footer-panel s-cta-shell"
            style={{ opacity: 0, maxWidth: "none" }}
          >
            <div class="s-cta-shell__grid" />
            <div class="s-cta-shell__orb s-cta-shell__orb--left" />
            <div class="s-cta-shell__orb s-cta-shell__orb--right" />
            <div class="s-cta-shell__inner" style={{ gridTemplateColumns: "1fr" }}>
              <div class="s-cta-copy">
                <div class="s-cta-copy__meta">
                  <span class="t-badge s-cta-copy__badge">WebTek Team</span>
                  <div class="s-cta-copy__logo">
                    <span class="s-cta-copy__logo-glow" />
                    <img src="/ben10/ben10-logo.png" alt="" class="s-cta-copy__logo-img" />
                  </div>
                </div>
                <h3 class="s-cta-copy__title">
                  Engineering &{" "}
                  <span class="s-cta-copy__accent">Platform</span>
                </h3>
                <p class="s-cta-copy__desc">
                  Build, deployment, and experience optimization powered by WebTek.
                </p>
                <div class="s-cta-copy__actions">
                  <a href={teamData.value.webtek.github} target="_blank" rel="noopener noreferrer" class="t-btn-ghost">
                    GitHub
                  </a>
                  <a href={teamData.value.webtek.linkedin} target="_blank" rel="noopener noreferrer" class="t-btn-ghost">
                    LinkedIn
                  </a>
                  <a href={`mailto:${teamData.value.webtek.email}`} class="t-btn-primary">
                    Email Team
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Questions panel */}
          <div
            class="ct-footer-panel s-cta-shell"
            style={{ opacity: 0, maxWidth: "none" }}
          >
            <div class="s-cta-shell__grid" />
            <div class="s-cta-shell__orb s-cta-shell__orb--left" />
            <div class="s-cta-shell__orb s-cta-shell__orb--right" />
            <div class="s-cta-shell__inner" style={{ gridTemplateColumns: "1fr" }}>
              <div class="s-cta-copy">
                <div class="s-cta-copy__meta">
                  <span class="t-badge s-cta-copy__badge">Support Line</span>
                  <div class="s-cta-copy__logo">
                    <span class="s-cta-copy__logo-glow" />
                    <svg class="s-cta-copy__logo-img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <h3 class="s-cta-copy__title">
                  Still have{" "}
                  <span class="s-cta-copy__accent">questions?</span>
                </h3>
                <p class="s-cta-copy__desc">
                  Feel free to transceive a message to our coordinators. We respond to all queries within 24 hours.
                </p>
                <div class="s-cta-copy__actions">
                  <a href={`mailto:${teamData.value.webtek.email}`} class="t-btn-primary">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Open Comm Channel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Float keyframes (mirrors sponsors page) */}
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          33%      { transform: translateY(-22px) rotate(3deg); }
          66%      { transform: translateY(10px) rotate(-2deg); }
        }
        @keyframes float-reverse {
          0%,100% { transform: translateY(0) rotate(0deg); }
          33%      { transform: translateY(18px) rotate(-3deg); }
          66%      { transform: translateY(-12px) rotate(2deg); }
        }
        @media (max-width:1024px) {
          .s-benefits-grid,
          [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width:640px) {
          .s-benefits-grid,
          [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contact | Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Initialize communication with the Theta 2026 High Command. Contact our coordinators and technical operatives.",
    },
  ],
};
