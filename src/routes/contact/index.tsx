import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";

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
  coordinators: TeamMember[];
  sponsorship: TeamMember[];
  publicRelation: TeamMember[];
  webtek: {
    github: string;
    linkedin: string;
    email: string;
  };
}

interface ContactCopy {
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
  webtekLabel: string;
  webtekTitle: string;
  webtekDescription: string;
  githubLabel: string;
  linkedinLabel: string;
  emailLabel: string;
  membersSuffix: string;
  contactPrefix: string;
  stillQuestionsTitle: string;
  stillQuestionsSubtitle: string;
  sendEmailLabel: string;
}

const defaultContactCopy: ContactCopy = {
  titlePrefix: "Get in",
  titleAccent: "Touch",
  subtitle: "Have questions? Reach out to the Theta 2026 High Command.",
  webtekLabel: "WebTek Team",
  webtekTitle: "Engineering & Platform",
  webtekDescription:
    "Build, deployment, and experience optimization powered by WebTek.",
  githubLabel: "GitHub",
  linkedinLabel: "LinkedIn",
  emailLabel: "Email",
  membersSuffix: "Operators",
  contactPrefix: "Contact:",
  stillQuestionsTitle: "Still have questions?",
  stillQuestionsSubtitle: "Feel free to transceive a message to our coordinators.",
  sendEmailLabel: "Open Comm Channel",
};

const defaultTeamData: TeamData = {
  order: [
    { key: "coordinators", label: "Coordinators" },
    { key: "president", label: "President" },
    { key: "vicePresidents", label: "Vice Presidents" },
    { key: "sponsorship", label: "Sponsorship" },
    { key: "publicRelation", label: "Public Relations" },
  ],
  president: [],
  vicePresidents: [],
  coordinators: [],
  sponsorship: [],
  publicRelation: [],
  webtek: {
    github: "#",
    linkedin: "#",
    email: "theta@sastra.edu",
  },
};

export default component$(() => {
  const teamData = useSignal<TeamData>(defaultTeamData);
  const copy = useSignal<ContactCopy>(defaultContactCopy);

  useVisibleTask$(async () => {
    try {
      const [teamRes, contentRes] = await Promise.all([
        fetch("/data/team.json"),
        fetch("/data/content.json"),
      ]);

      const team = (await teamRes.json()) as Partial<TeamData>;
      const content = (await contentRes.json()) as {
        contactPage?: Partial<ContactCopy>;
        seo?: { contactTitle?: string; contactDescription?: string };
      };

      teamData.value = {
        ...defaultTeamData,
        ...team,
        webtek: { ...defaultTeamData.webtek, ...(team.webtek || {}) },
        order: team.order || defaultTeamData.order,
      };

      if (content.contactPage) {
        copy.value = { ...defaultContactCopy, ...content.contactPage };
      }

      if (content.seo?.contactTitle) document.title = content.seo.contactTitle;
      if (content.seo?.contactDescription) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content.seo.contactDescription);
      }
    } catch {
      teamData.value = defaultTeamData;
      copy.value = defaultContactCopy;
    }
  });

  // Bulletproof interaction animations (removed ScrollTrigger entry animations to avoid layout/hydration crashes)
  useVisibleTask$(({ track, cleanup }) => {
    track(() => teamData.value.order);
    
    // Slight delay so lazily-hydration mapped nodes are firmly attached to the DOM
    const timeout = setTimeout(() => {
        const ctx = gsap.context(() => {
          
            // ── Floating Ambient Orbs (Omnitrix Fluid Motion) ──
            gsap.to(".anim-orb-1", {
              x: "random(-100, 100)",
              y: "random(-60, 60)",
              rotation: "random(-45, 45)",
              duration: 10,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            
            gsap.to(".anim-orb-2", {
              x: "random(-80, 80)",
              y: "random(-80, 80)",
              rotation: "random(-30, 30)",
              duration: 12,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 1.5
            });

            // Sastra Logo slow hover
            gsap.to(".anim-float-logo", {
              y: -8,
              duration: 2.5,
              ease: "power1.inOut",
              yoyo: true,
              repeat: -1
            });

            // ── Faux 3D Interactive Card Hover ──
            const cardsArray = gsap.utils.toArray<HTMLElement>('.anim-card');
            cardsArray.forEach((card) => {
               card.addEventListener("mousemove", (e) => {
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  
                  gsap.to(card, {
                     rotationY: 12 * (x / (rect.width / 2)),
                     rotationX: -12 * (y / (rect.height / 2)),
                     transformPerspective: 1200,
                     duration: 0.4,
                     ease: "power2.out"
                  });
                  
                  const avatar = card.querySelector('.anim-avatar');
                  if(avatar) {
                     gsap.to(avatar, {
                        x: 10 * (x / (rect.width / 2)),
                        y: 10 * (y / (rect.height / 2)),
                        duration: 0.4,
                        ease: "power2.out"
                     })
                  }
               });
               
               card.addEventListener("mouseleave", () => {
                  gsap.to(card, {
                     rotationY: 0,
                     rotationX: 0,
                     duration: 0.7,
                     ease: "power3.out"
                  });
                  const avatar = card.querySelector('.anim-avatar');
                  if(avatar) {
                     gsap.to(avatar, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
                  }
               });
            });
        });

        cleanup(() => ctx.revert());
    }, 150);

    return () => clearTimeout(timeout);
  });

  return (
    <div class="relative mx-auto min-h-screen w-full px-4 py-32 sm:px-6 lg:px-8 bg-[#050505] text-[#f0fff0] overflow-x-hidden">
      
      {/* Animating Dynamic Grid Tech Pattern */}
      <div 
        class="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
        style={{ 
          backgroundImage: "linear-gradient(to right, rgba(14, 169, 53, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 169, 53, 0.05) 1px, transparent 1px)", 
          backgroundSize: "3rem 3rem",
          backgroundPosition: "center center"
        }}
      ></div>

      {/* Fluid Floating Ambient Orbs */}
      <div class="anim-orb-1 pointer-events-none fixed top-[10%] left-[-5%] h-[35rem] w-[35rem] rounded-full bg-[#0ea935] opacity-[0.05] blur-[120px] mix-blend-screen"></div>
      <div class="anim-orb-2 pointer-events-none fixed bottom-[15%] right-[-5%] h-[40rem] w-[40rem] rounded-full bg-[#077a23] opacity-[0.08] blur-[150px] mix-blend-screen"></div>

      {/* Main Glassmorphic Header */}
      <section class="relative z-10 overflow-hidden rounded-[3rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.6)] backdrop-blur-3xl p-8 sm:p-14 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_45px_rgba(0,0,0,0.6)] mx-auto max-w-6xl transition-transform duration-500 hover:scale-[1.01] hover:border-[#0ea935]/30 group animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
        <div class="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#0ea935] opacity-[0.08] blur-[100px] transition-transform duration-1000 group-hover:scale-110"></div>
        <div class="relative flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div class="text-center md:text-left flex-1">
             <span class="inline-flex rounded-full border border-[#0ea935]/40 bg-[#0ea935]/10 px-4 py-1.5 text-[0.65rem] font-black text-[#0ea935] tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(14,169,53,0.15)] mb-6 transition-all duration-300 group-hover:bg-[#0ea935]/20 group-hover:shadow-[0_0_20px_rgba(14,169,53,0.25)]">Command Center</span>
            <h1 class="text-5xl font-black sm:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-[#0ea935] via-[#ffffff] to-[#077a23] leading-[1.1] drop-shadow-[0_0_10px_rgba(14,169,53,0.3)]">
              {copy.value.titlePrefix}{" "}
              <span class="text-[#f0fff0] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] block mt-1">
                {copy.value.titleAccent}
              </span>
            </h1>
            <p class="mt-6 max-w-xl text-base md:text-lg font-semibold text-[#8ca38c] leading-relaxed mx-auto md:mx-0">
              {copy.value.subtitle}
            </p>
          </div>
          
          <div class="rounded-[2.5rem] border border-[rgba(255,255,255,0.08)] bg-[#050505]/70 p-8 md:p-10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center">
             <span class="text-[0.6rem] font-black uppercase tracking-[0.25em] text-[#4d5c4d] mb-5">Secured Location Directive</span>
             <div class="anim-float-logo">
               <img
                 src="/sponsors/general/sastra-university-logo.jpg"
                 alt="SASTRA University"
                 width={200}
                 height={72}
                 class="h-12 md:h-14 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-70 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Dynamic Team Grid */}
      <section class="mt-20 space-y-24 mx-auto max-w-7xl relative z-10 px-2 sm:px-4">
        {teamData.value.order.map((section, sectionIndex) => {
          const members = teamData.value[
            section.key as keyof Omit<TeamData, "order" | "webtek">
          ] as TeamMember[];

          if (!Array.isArray(members) || members.length === 0) return null;

          return (
            <div key={section.key} class="relative" style={{ animationDelay: `${sectionIndex * 150}ms` }}>
              <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b-2 border-[rgba(14,169,53,0.15)] pb-6 relative">
                <div class="absolute -bottom-0.5 left-0 w-32 h-[2px] bg-gradient-to-r from-[#0ea935] to-transparent"></div>
                <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-[#f0fff0]">
                  {section.label}
                </h2>
                <span class="rounded-[1rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.6)] backdrop-blur-md px-5 py-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#8ca38c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <span class="text-[#0ea935]">{members.length}</span> {copy.value.membersSuffix}
                </span>
              </div>
              
              {/* Cards Grid */}
              <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 perspective-[1000px]">
                {members.map((member, index) => (
                  <article 
                    key={member.name} 
                    style={{ animationDelay: `${index * 100}ms` }}
                    class="anim-card group relative rounded-[2.5rem] p-[2px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_12px_45px_rgba(14,169,53,0.35)] flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out fill-mode-both"
                  >
                    {/* The Animated Sweeping Radar Border */}
                    <div class="absolute inset-[-100%] z-0 origin-center animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#0ea935_100%)] opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Optional Glow blur for the radar */}
                    <div class="absolute inset-[-100%] z-0 origin-center animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#0ea935_100%)] blur-md opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>

                    {/* The Actual Inner Glass Card */}
                    <div class="relative z-10 flex flex-col items-center rounded-[2.4rem] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,10,0.85)] group-hover:bg-[#050505]/95 backdrop-blur-2xl p-7 w-full h-full transition-colors duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      
                      <div class="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#0ea935] opacity-[0.05] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.25]"></div>
                      
                      {/* 3D Parallax Avatar Container */}
                      <div class="anim-avatar relative flex h-32 w-32 items-center justify-center -mt-2">
                        {/* Avatar Pulsing Scanners */}
                        <div class="absolute inset-[-6px] rounded-full border border-dashed border-[#0ea935]/50 animate-[spin_6s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_rgba(14,169,53,0.4)]"></div>
                        <div class="absolute inset-[-14px] rounded-full border border-[#0ea935]/20 animate-[spin_10s_linear_infinite_reverse] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] border border-[#0ea935]/30 bg-[#050505] shadow-[0_0_25px_rgba(14,169,53,0.15)] transition-transform duration-500 group-hover:scale-105 group-hover:border-[#0ea935]/80">
                          <img
                            src={member.image || "/team/default-avatar.svg"}
                            alt={member.name}
                            loading="lazy"
                            width={128}
                            height={128}
                            class="h-full w-full object-cover grayscale-[50%] contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-110 group-hover:saturate-150 transition-all duration-500"
                            onError$={(event) => {
                              (event.target as HTMLImageElement).src = "/team/default-avatar.svg";
                            }}
                          />
                        </div>
                      </div>
                      
                      <h3 class="mt-8 text-center text-xl font-black text-[#f0fff0] tracking-tight group-hover:text-[#0ea935] transition-colors">{member.name}</h3>
                      <p class="mt-1.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#0ea935]">
                        {member.role}
                      </p>
                      
                      <div class="mt-6 w-full space-y-3 text-xs font-semibold text-[#8ca38c]">
                        <a
                          href={`tel:${member.phone}`}
                          class="flex w-full items-center justify-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111] px-4 py-3.5 transition-all duration-300 hover:border-[#0ea935]/50 hover:bg-[#0ea935]/10 hover:text-[#0ea935] hover:shadow-[0_0_15px_rgba(14,169,53,0.2)]"
                        >
                          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                             <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span class="tracking-widest">{member.phone}</span>
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          class="flex w-full items-center justify-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111111] px-4 py-3.5 transition-all duration-300 hover:border-[#0ea935]/50 hover:bg-[#0ea935]/10 hover:text-[#0ea935] hover:shadow-[0_0_15px_rgba(14,169,53,0.2)] truncate"
                        >
                          <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                             <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span class="truncate tracking-wide">{member.email}</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Tech Footer Section */}
      <section class="mt-32 grid gap-10 lg:grid-cols-2 mx-auto max-w-6xl relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out delay-500 fill-mode-both">
        {/* WebTek Panel */}
        <div class="relative overflow-hidden rounded-[3rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.6)] backdrop-blur-3xl p-10 sm:p-14 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_12px_45px_rgba(0,0,0,0.6)] transition-all hover:border-[#0ea935]/40 hover:shadow-[0_12px_60px_rgba(14,169,53,0.15)] flex flex-col group">
          <div class="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#077a23] opacity-[0.1] blur-[80px] transition-transform duration-700 group-hover:scale-125"></div>
          
          <span class="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#8ca38c] mb-6 w-max shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            {copy.value.webtekLabel}
          </span>
          <h3 class="text-4xl font-black text-[#f0fff0] tracking-tight">
            {copy.value.webtekTitle}
          </h3>
          <p class="mt-5 text-sm font-semibold text-[#8ca38c] leading-relaxed max-w-sm mb-10 flex-1">
            {copy.value.webtekDescription}
          </p>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <a
              href={teamData.value.webtek.github}
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-[1.5rem] border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-2 py-4 text-center text-[0.75rem] font-black tracking-widest uppercase text-[#8ca38c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[#0ea935]/60 hover:text-[#0ea935] hover:bg-[#0ea935]/15 hover:-translate-y-1"
            >
              {copy.value.githubLabel}
            </a>
            <a
              href={teamData.value.webtek.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-[1.5rem] border border-[rgba(255,255,255,0.05)] bg-[#111111]/80 px-2 py-4 text-center text-[0.75rem] font-black tracking-widest uppercase text-[#8ca38c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[#0ea935]/60 hover:text-[#0ea935] hover:bg-[#0ea935]/15 hover:-translate-y-1"
            >
              {copy.value.linkedinLabel}
            </a>
            <a
              href={`mailto:${teamData.value.webtek.email}`}
              class="col-span-2 sm:col-span-1 border border-[#0ea935]/50 bg-[#0ea935] px-2 py-4 text-center text-[0.7rem] font-black tracking-[0.15em] uppercase text-[#050505] shadow-[0_0_25px_rgba(14,169,53,0.5)] transition-all duration-300 hover:bg-[#12cb42] hover:shadow-[0_0_35px_rgba(14,169,53,0.7)] hover:-translate-y-1 rounded-[1.5rem] flex items-center justify-center"
            >
              {copy.value.emailLabel}
            </a>
          </div>
        </div>

        {/* Message Panel */}
        <div class="relative overflow-hidden rounded-[3rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.6)] backdrop-blur-3xl p-10 sm:p-14 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_12px_45px_rgba(0,0,0,0.6)] transition-all hover:border-[#0ea935]/40 hover:shadow-[0_12px_60px_rgba(14,169,53,0.15)] flex flex-col justify-center">
          <div class="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#0ea935] opacity-[0.08] blur-[100px]"></div>
          
          <h3 class="text-4xl font-black text-[#f0fff0] tracking-tight leading-tight">
            {copy.value.stillQuestionsTitle}
          </h3>
          <p class="mt-5 text-sm font-semibold text-[#8ca38c] leading-relaxed max-w-sm">
            {copy.value.stillQuestionsSubtitle}
          </p>
          <div class="mt-10">
             <a
               href={`mailto:${teamData.value.webtek.email}`}
               class="inline-flex items-center justify-center gap-4 rounded-[2rem] border border-[rgba(255,255,255,0.15)] bg-[#050505]/95 px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-[#0ea935] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_25px_rgba(14,169,53,0.2)] transition-all duration-300 hover:border-[#0ea935]/80 hover:bg-[#0ea935]/15 hover:shadow-[0_0_40px_rgba(14,169,53,0.5)] hover:-translate-y-1"
             >
               <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
               {copy.value.sendEmailLabel}
             </a>
          </div>
        </div>
      </section>
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
