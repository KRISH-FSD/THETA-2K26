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
  coordinators: TeamMember[];
  sponsorship: TeamMember[];
  publicRelation: TeamMember[];
  webtek: { github: string; linkedin: string; email: string };
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
  stillQuestionsTitle: string;
  stillQuestionsSubtitle: string;
  sendEmailLabel: string;
}

/* ─── Defaults ───────────────────────────────────────────── */
const defaultCopy: ContactCopy = {
  titlePrefix: "Get in",
  titleAccent: "Touch",
  subtitle:
    "Connect with the Theta 2026 High Command. Our operators are standing by across all active channels.",
  webtekLabel: "WebTek Team",
  webtekTitle: "Engineering & Platform",
  webtekDescription:
    "Build, deployment, and experience optimization powered by WebTek.",
  githubLabel: "GitHub",
  linkedinLabel: "LinkedIn",
  emailLabel: "Email",
  membersSuffix: "Operators",
  stillQuestionsTitle: "Still have questions?",
  stillQuestionsSubtitle:
    "Feel free to transceive a message to our coordinators.",
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
  webtek: { github: "#", linkedin: "#", email: "theta@sastra.edu" },
};

/* ─── Contact Mode Cards ─────────────────────────────────── */
const MODES = [
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Direct Call",
    desc: "Reach coordinators via phone during event hours.",
    tag: "LIVE",
    accent: "#6eff5a",
    glow: "rgba(110,255,90,0.22)",
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email Command",
    desc: "Send queries to our official contact desk.",
    tag: "24h",
    accent: "#4de0ff",
    glow: "rgba(77,224,255,0.20)",
  },
  {
    icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z",
    label: "Live Support",
    desc: "Real-time assistance from our on-ground team.",
    tag: "INSTANT",
    accent: "#ffd54a",
    glow: "rgba(255,213,74,0.20)",
  },
  {
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    label: "On-Site Desk",
    desc: "Visit our physical desk at SASTRA Campus.",
    tag: "CAMPUS",
    accent: "#c084fc",
    glow: "rgba(192,132,252,0.20)",
  },
];

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
        /* 1 ── Hero word-by-word entry */
        gsap.fromTo(
          ".ct-word-1",
          { y: 90, opacity: 0, filter: "blur(14px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power4.out", delay: 0.05 }
        );
        gsap.fromTo(
          ".ct-word-2",
          { y: 90, opacity: 0, filter: "blur(14px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power4.out", delay: 0.28 }
        );
        gsap.fromTo(
          ".ct-hero-sub",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.5 }
        );
        gsap.fromTo(
          ".ct-hero-meta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.68 }
        );
        gsap.fromTo(
          ".ct-hero-ctas",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.85 }
        );

        /* 2 ── Right panel cinematic reveal (layer split) */
        gsap.fromTo(
          ".ct-panel-top",
          { y: -60, opacity: 0, scaleY: 0.7 },
          { y: 0, opacity: 1, scaleY: 1, duration: 1.0, ease: "power4.out", delay: 0.35 }
        );
        gsap.fromTo(
          ".ct-panel-bottom",
          { y: 60, opacity: 0, scaleY: 0.7 },
          { y: 0, opacity: 1, scaleY: 1, duration: 1.0, ease: "power4.out", delay: 0.5 }
        );
        gsap.fromTo(
          ".ct-panel-center",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 }
        );

        /* 3 ── Ben10 watermarks — persistent float + slow spin */
        gsap.to(".ct-ben10-primary img", {
          y: -18, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true,
        });
        gsap.to(".ct-ben10-secondary img", {
          y: 14, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5,
        });
        gsap.to(".ct-ben10-extra img", {
          rotation: 360, duration: 80, ease: "none", repeat: -1,
        });

        /* 4 ── Ambient orbs drift */
        gsap.to(".ct-orb-a", {
          x: 50, y: -40, duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true,
        });
        gsap.to(".ct-orb-b", {
          x: -60, y: 50, duration: 13, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2,
        });
        gsap.to(".ct-orb-c", {
          x: 40, y: 30, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1,
        });

        /* 5 ── Radar rings pulse */
        gsap.to(".ct-radar-ring", {
          scale: 2.6, opacity: 0, duration: 3.0,
          ease: "power2.out", repeat: -1, stagger: 1.0,
        });

        /* 6 ── Hero card — scroll-synced scale */
        gsap.to(".ct-hero-shell", {
          scale: 1.012, ease: "none",
          scrollTrigger: {
            trigger: ".ct-hero-shell",
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });

        /* 7 ── Background grid parallax */
        gsap.to(".ct-grid-bg", {
          backgroundPositionY: "50%", ease: "none",
          scrollTrigger: {
            trigger: "body", start: "top top", end: "bottom bottom", scrub: 2,
          },
        });

        /* 8 ── s-reveal: universal scroll reveal (mirrors sponsors page) */
        gsap.utils.toArray<HTMLElement>(".s-reveal").forEach((node) => {
          gsap.fromTo(
            node,
            { y: 42, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: node, start: "top 88%", toggleActions: "play none none none" },
            }
          );
        });

        /* 9 ── Contact mode cards: stagger slide-in */
        gsap.utils.toArray<HTMLElement>(".ct-mode-card").forEach((card, i) => {
          const fromX = i % 2 === 0 ? -50 : 50;
          gsap.fromTo(
            card,
            { x: fromX, y: 40, opacity: 0, scale: 0.9 },
            {
              x: 0, y: 0, opacity: 1, scale: 1,
              duration: 0.85, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 87%", toggleActions: "play none none none" },
            }
          );
        });

        /* 10 ── Team grid stagger */
        gsap.utils.toArray<HTMLElement>(".ct-team-grid").forEach((grid) => {
          const cards = grid.querySelectorAll<HTMLElement>(".ct-member-card");
          gsap.fromTo(
            cards,
            { y: 70, opacity: 0, scale: 0.92 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.7, ease: "power3.out", stagger: 0.08,
              scrollTrigger: { trigger: grid, start: "top 86%", toggleActions: "play none none none" },
            }
          );
        });

        /* 11 ── Footer CTA panels */
        gsap.fromTo(
          ".ct-footer-panel",
          { y: 80, opacity: 0, scale: 0.94 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.95, ease: "power3.out", stagger: 0.2,
            scrollTrigger: { trigger: ".ct-footer-grid", start: "top 85%", toggleActions: "play none none none" },
          }
        );

        /* 12 ── 3D hero card mouse parallax */
        const heroShell = document.querySelector<HTMLElement>(".ct-hero-shell");
        const heroLayout = document.querySelector<HTMLElement>(".ct-hero-layout");
        const ben10Primary = document.querySelector<HTMLElement>(".ct-ben10-primary");
        if (heroShell && heroLayout) {
          heroShell.addEventListener("mousemove", (e: MouseEvent) => {
            const r = heroShell.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
            const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
            gsap.to(heroLayout, {
              rotationY: 6 * dx, rotationX: -4 * dy,
              transformPerspective: 1800, duration: 0.45, ease: "power2.out",
            });
            if (ben10Primary) {
              gsap.to(ben10Primary, { x: dx * 25, y: dy * 18, duration: 0.5, ease: "power2.out" });
            }
          });
          heroShell.addEventListener("mouseleave", () => {
            gsap.to(heroLayout, { rotationY: 0, rotationX: 0, duration: 1.0, ease: "power3.out" });
            if (ben10Primary) gsap.to(ben10Primary, { x: 0, y: 0, duration: 1.0, ease: "power3.out" });
          });
        }

        /* 13 ── Member card 3D tilt */
        gsap.utils.toArray<HTMLElement>(".ct-member-card").forEach((card) => {
          const onMove = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(1200px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
          };
          const onLeave = () => {
            card.style.transition = "transform 520ms cubic-bezier(0.22,1,0.36,1)";
            card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0)";
          };
          const onEnter = () => { card.style.transition = "transform 100ms linear"; };
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
          card.addEventListener("mouseenter", onEnter);
        });

        /* 14 ── SASTRA image slow float */
        gsap.to(".ct-sastra-img-wrap", {
          y: -10, duration: 3.5, ease: "power1.inOut", yoyo: true, repeat: -1,
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
    <div class="relative overflow-x-hidden px-4 pt-0 pb-10 sm:px-6 lg:px-8">

      {/* ══════════════════════════════════════════
          HERO — full viewport (matches sponsors)
      ══════════════════════════════════════════ */}
      <section
        class="ct-hero-shell relative z-10 mx-auto flex w-full max-w-[1700px] flex-col justify-center overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-black/80 via-[#040604] to-black px-6 py-8 shadow-[0_0_120px_rgba(14,169,53,0.15)] ring-1 ring-white/5 backdrop-blur-3xl sm:px-10 lg:px-14"
        style="height:calc(100vh - 90px);height:calc(100svh - 90px);height:calc(100dvh - 90px);min-height:calc(100vh - 90px);max-height:calc(100dvh - 90px);"
      >
        {/* Grid background */}
        <div
          class="ct-grid-bg pointer-events-none absolute inset-0 opacity-[0.045]"
          style="background-image:linear-gradient(#0ea935 1px,transparent 1px),linear-gradient(90deg,#0ea935 1px,transparent 1px);background-size:50px 50px;"
        />

        {/* ── Ambient orbs ── */}
        <div class="ct-orb-a pointer-events-none absolute -left-[15%] -top-[10%] h-[55vw] w-[55vw] rounded-full bg-[#0ea935] opacity-[0.07] blur-[160px]" />
        <div class="ct-orb-b pointer-events-none absolute -right-[12%] bottom-[-8%] h-[48vw] w-[48vw] rounded-full bg-[#077a23] opacity-[0.09] blur-[180px]" />
        <div class="ct-orb-c pointer-events-none absolute left-[40%] top-[50%] h-[22vw] w-[22vw] rounded-full bg-[#6eff5a] opacity-[0.04] blur-[120px]" />

        {/* ── Ben10 watermarks (exact sponsors pattern) ── */}
        <div class="ct-ben10-primary s-ben10-mark s-ben10-mark--primary" style={{ zIndex: 0 }}>
          <span class="s-ben10-mark__glow" />
          <img
            src="/ben10/ben10-logo.png"
            alt=""
            class="s-ben10-mark__img"
            style={{ animation: "float 15s ease-in-out infinite" }}
          />
        </div>
        <div class="ct-ben10-secondary s-ben10-mark s-ben10-mark--secondary" style={{ zIndex: 0 }}>
          <span class="s-ben10-mark__glow" />
          <img
            src="/ben10/ben10-logo.png"
            alt=""
            class="s-ben10-mark__img"
            style={{ animation: "float-reverse 20s ease-in-out infinite" }}
          />
        </div>
        {/* Extra centre watermark */}
        <div
          class="ct-ben10-extra pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
          style={{ zIndex: 0, width: "min(30vw,400px)" }}
        >
          <img src="/ben10/ben10-logo.png" alt="" class="w-full" style={{ filter: "grayscale(1) brightness(0.5) drop-shadow(0 0 24px rgba(14,169,53,0.3))" }} />
        </div>

        {/* Radar pulse rings at centre */}
        <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 0 }}>
          <div class="ct-radar-ring absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0ea935]/20" style={{ transformOrigin: "center", opacity: 0.5 }} />
          <div class="ct-radar-ring absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0ea935]/12" style={{ transformOrigin: "center", opacity: 0.35 }} />
        </div>

        {/* ── Main hero layout (mirrors sponsors 2-col grid) ── */}
        <div
          class="ct-hero-layout relative z-10 grid h-full items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* LEFT — copy */}
          <div>
            {/* Badge */}
            <div class="ct-hero-meta mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md" style={{ opacity: 0 }}>
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0ea935] shadow-[0_0_8px_#0ea935]" />
              <span class="text-[0.6rem] font-bold tracking-[0.2em] text-white/70 uppercase">
                Command Center
              </span>
            </div>

            {/* H1 — staggered words */}
            <h1 class="t-heading bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-[clamp(2.6rem,5.5vw,5.5rem)] leading-[0.92] font-black tracking-tighter text-transparent drop-shadow-xl">
              <span class="ct-word-1 block" style={{ opacity: 0 }}>
                Get in
              </span>
              <span
                class="ct-word-2 mt-1 block"
                style={{
                  opacity: 0,
                  background: "linear-gradient(92deg,#0ea935 0%,#6eff5a 45%,#fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(14,169,53,0.5))",
                }}
              >
                Touch
              </span>
            </h1>

            {/* Subtitle */}
            <p
              class="ct-hero-sub mt-5 max-w-xl text-[0.9rem] leading-relaxed font-medium text-[var(--t-muted)] md:pr-10"
              style={{ opacity: 0 }}
            >
              Connect with the Theta 2026 High Command. Our operators are standing by across all active channels.
            </p>

            {/* Stat tiles — mirrors sponsors page pattern */}
            <div class="ct-hero-meta mt-7 flex flex-wrap gap-3" style={{ opacity: 0 }}>
              {[
                { label: "Response", value: "Live" },
                { label: "Channels", value: "04" },
                { label: "Status", value: "Online" },
              ].map((item) => (
                <div
                  key={item.label}
                  class="group relative flex flex-col justify-center rounded-[1rem] border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <p class="text-[0.55rem] font-black tracking-[0.2em] text-[var(--t-dim)] uppercase transition-colors group-hover:text-[#0ea935]">
                    {item.label}
                  </p>
                  <p class="mt-1 font-[var(--font-display)] text-xl font-black text-white drop-shadow-md">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div class="ct-hero-ctas mt-8 flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
              <a
                href="mailto:theta@sastra.edu"
                class="rounded-full bg-gradient-to-r from-[#0ea935] to-[#0ba030] px-7 py-3 text-[0.75rem] font-black tracking-widest text-black uppercase shadow-[0_0_24px_rgba(14,169,53,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_36px_rgba(14,169,53,0.65)]"
              >
                Open Comm Channel
              </a>
              <a
                href="#ct-team"
                class="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-[0.75rem] font-bold tracking-widest text-white uppercase transition-all hover:border-white/40 hover:bg-white/10"
              >
                View Operators
              </a>
            </div>
          </div>

          {/* RIGHT — SASTRA panel (cinematic layer reveal) */}
          <div class="hidden lg:flex lg:flex-col lg:gap-3">
            {/* TOP layer — status bar */}
            <div
              class="ct-panel-top rounded-2xl border border-white/10 bg-black/50 px-5 py-3 backdrop-blur-xl"
              style={{ opacity: 0, transformOrigin: "top center" }}
            >
              <div class="flex items-center justify-between">
                <span class="text-[0.58rem] font-black tracking-[0.28em] text-white/40 uppercase">
                  Secured Location Directive
                </span>
                <span class="flex items-center gap-1.5 rounded-full border border-[#0ea935]/40 bg-[#0ea935]/12 px-3 py-1 text-[0.58rem] font-black tracking-widest text-[#0ea935] uppercase">
                  <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0ea935] shadow-[0_0_6px_#0ea935]" />
                  Verified
                </span>
              </div>
            </div>

            {/* CENTRE layer — SASTRA image (house-split animation) */}
            <div
              class="ct-panel-center ct-sastra-img-wrap group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070707]/80 shadow-2xl backdrop-blur-3xl"
              style={{ opacity: 0, transformOrigin: "center", minHeight: "260px" }}
            >
              {/* Glass highlight */}
              <div class="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-20 transition-opacity duration-700 group-hover:opacity-50" />
              {/* Glow overlay */}
              <div
                class="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-70"
                style={{ background: "radial-gradient(circle at top right,rgba(14,169,53,0.3),transparent 55%),radial-gradient(circle at bottom left,rgba(14,169,53,0.2),transparent 55%)" }}
              />
              {/* Top shimmer line */}
              <div class="pointer-events-none absolute left-[10%] right-[10%] top-0 z-10 h-[1px]"
                style={{ background: "linear-gradient(90deg,transparent,rgba(14,169,53,0.9),transparent)" }} />
              {/* Bottom fade */}
              <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-20"
                style={{ background: "linear-gradient(to top,rgba(7,7,7,0.95),transparent)" }} />

              <img
                src="/sponsors/general/sastra-university-logo.jpg"
                alt="SASTRA University"
                class="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                style={{ filter: "brightness(0.85) contrast(1.08) saturate(0.85)" }}
              />

              {/* Overlay label */}
              <div class="absolute bottom-4 left-4 z-20">
                <p class="text-[0.55rem] font-black tracking-[0.28em] text-white/50 uppercase">
                  SASTRA University — Thanjavur
                </p>
              </div>
            </div>

            {/* BOTTOM layer — chips */}
            <div
              class="ct-panel-bottom grid grid-cols-2 gap-2"
              style={{ opacity: 0, transformOrigin: "bottom center" }}
            >
              {["Theta 2026 Contact Desk", "Omnitrix Command UI"].map((chip) => (
                <div
                  key={chip}
                  class="rounded-xl border border-white/8 bg-black/40 px-3 py-2.5 text-center text-[0.58rem] font-black tracking-widest text-[var(--t-dim)] uppercase backdrop-blur-md transition-all hover:border-[#0ea935]/30 hover:text-[#0ea935]"
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT MODES — scroll story section
      ══════════════════════════════════════════ */}
      <section class="relative z-10 mx-auto mt-16 max-w-7xl">
        <div class="s-reveal mb-10 text-center">
          <span class="t-badge">Communication Grid</span>
          <h2 class="t-heading mt-5 text-[clamp(2rem,4vw,3.3rem)] text-[var(--t-text)]">
            Contact{" "}
            <span class="t-gradient">Modes</span>
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[var(--t-muted)]">
            Choose your preferred communication channel with the operations team.
          </p>
        </div>

        {/* Mode cards — mirrors s-benefit-card system */}
        <div class="s-benefits-stage">
          <div class="s-benefits-stage__glow" />
          <div
            class="relative z-10 grid justify-center gap-4"
            style={{ gridTemplateColumns: "repeat(4, minmax(0, 17rem))" }}
          >
            {MODES.map((mode, i) => (
              <div
                key={mode.label}
                class="ct-mode-card s-benefit-card"
                style={{
                  ["--s-benefit-accent" as string]: mode.accent,
                  ["--s-benefit-glow" as string]: mode.glow,
                  transitionDelay: `${i * 80}ms`,
                  opacity: 0,
                }}
              >
                <span class="s-benefit-card__halo" />
                <span class="s-benefit-card__sheen" />

                <div class="s-benefit-card__top">
                  <span class="s-benefit-card__index">0{i + 1}</span>
                  <span class="s-benefit-card__eyebrow">{mode.tag}</span>
                </div>
                <div class="s-benefit-card__body">
                  <div
                    class="mt-4 flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: `color-mix(in srgb,${mode.accent} 30%,rgba(255,255,255,0.08))`,
                      background: `color-mix(in srgb,${mode.accent} 10%,rgba(255,255,255,0.03))`,
                      color: mode.accent,
                    }}
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d={mode.icon} />
                    </svg>
                  </div>
                  <h3 class="s-benefit-card__title">{mode.label}</h3>
                  <p class="s-benefit-card__copy">{mode.desc}</p>
                </div>
                <div class="s-benefit-card__footer">
                  <div class="s-benefit-card__metric">
                    <strong style={{ color: mode.accent }}>⬤</strong>
                    <span>Active Channel</span>
                  </div>
                  <span class="s-benefit-card__chip">Theta 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TEAM SECTIONS
      ══════════════════════════════════════════ */}
      <section id="ct-team" class="relative z-10 mx-auto mt-16 max-w-7xl space-y-16">
        {teamData.value.order.map((section, si) => {
          const members = teamData.value[
            section.key as keyof Omit<TeamData, "order" | "webtek">
          ] as TeamMember[];
          if (!Array.isArray(members) || members.length === 0) return null;

          return (
            <div key={section.key} class="scroll-mt-28">
              {/* Section header — sponsors hall-style */}
              <div class="s-reveal mb-8 flex flex-wrap items-end justify-between gap-4 rounded-[2rem] border border-white/8 bg-black/30 px-6 py-5 backdrop-blur-2xl">
                <div>
                  <p class="text-[0.6rem] font-black tracking-[0.28em] text-[var(--t-dim)] uppercase">
                    Sector {String(si + 1).padStart(2, "0")}
                  </p>
                  <h2 class="t-heading mt-2 text-[clamp(1.8rem,3.5vw,2.8rem)] text-[var(--t-text)]">
                    {section.label}
                  </h2>
                </div>
                <span class="t-badge">
                  <span class="text-[#0ea935]">{members.length}</span>{" "}
                  {defaultCopy.membersSuffix}
                </span>
              </div>

              {/* Cards grid */}
              <div
                class="ct-team-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ perspective: "1200px" }}
              >
                {members.map((member) => (
                  <article
                    key={member.name}
                    class="ct-member-card group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/8 bg-[rgba(5,5,5,0.82)] backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(14,169,53,0.1)]"
                  >
                    {/* Conic border sweep on hover */}
                    <div class="pointer-events-none absolute inset-[-100%] z-0 origin-center animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_65%,#0ea935_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
                    <div class="pointer-events-none absolute inset-[-100%] z-0 origin-center animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_65%,#0ea935_100%)] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-40" />

                    <div class="relative z-10 flex h-full flex-col items-center rounded-[1.6rem] p-6">
                      {/* Corner halo */}
                      <div class="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#0ea935] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.18]" />

                      {/* Avatar */}
                      <div class="relative flex h-24 w-24 shrink-0 items-center justify-center">
                        <div class="absolute inset-[-5px] animate-[spin_6s_linear_infinite] rounded-full border border-dashed border-[#0ea935]/50 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                        <div class="relative flex h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_20px_rgba(14,169,53,0.1)] transition-all duration-400 group-hover:border-[#0ea935]/60 group-hover:shadow-[0_0_28px_rgba(14,169,53,0.28)]">
                          <img
                            src={member.image || "/team/default-avatar.svg"}
                            alt={member.name}
                            loading="lazy"
                            class="h-full w-full object-cover brightness-90 grayscale-[30%] transition-all duration-500 group-hover:brightness-110 group-hover:grayscale-0 group-hover:saturate-150"
                            onError$={(e) => { (e.target as HTMLImageElement).src = "/team/default-avatar.svg"; }}
                          />
                        </div>
                      </div>

                      {/* Name + role */}
                      <h3 class="mt-5 text-center text-[1rem] font-black tracking-tight text-[var(--t-text)] transition-colors group-hover:text-[#0ea935]">
                        {member.name}
                      </h3>
                      <p class="mt-1 text-center text-[0.6rem] font-bold tracking-[0.22em] text-[#0ea935] uppercase">
                        {member.role}
                      </p>

                      {/* Divider */}
                      <div class="my-4 h-px w-3/4 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                      {/* Contact links */}
                      <div class="w-full space-y-2 text-xs text-[var(--t-muted)]">
                        <a
                          href={`tel:${member.phone}`}
                          class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/6 bg-white/4 px-4 py-3 font-semibold transition-all duration-300 hover:border-[#0ea935]/40 hover:bg-[#0ea935]/8 hover:text-[#0ea935]"
                        >
                          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span class="tracking-widest">{member.phone}</span>
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          class="flex w-full items-center justify-center gap-2 truncate rounded-xl border border-white/6 bg-white/4 px-4 py-3 font-semibold transition-all duration-300 hover:border-[#0ea935]/40 hover:bg-[#0ea935]/8 hover:text-[#0ea935]"
                        >
                          <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span class="truncate">{member.email}</span>
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
