import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── Types ─────────────────────────────────────────────── */
interface TeamMember {
  name: string;
  role: string;
  email?: string;
  phone: string;
  image?: string;
}
interface TeamData {
  order: { key: string; label: string }[];
  convenor: TeamMember[];
  coConvenors: TeamMember[];
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
    { key: "convenor", label: "Convenor" },
    { key: "coConvenors", label: "Co-Convenor" },
    { key: "president", label: "President" },
    { key: "vicePresidents", label: "Vice President" },
    { key: "corporateRelations", label: "Corporate Relations" }
  ],
  convenor: [],
  coConvenors: [],
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
  useVisibleTask$(({ cleanup }) => {
    return;
    const t = setTimeout(() => {
      const ctx = gsap.context(() => {
        /* 8 ── s-reveal: universal scroll reveal */
        gsap.utils.toArray<HTMLElement>(".s-reveal").forEach((node) => {
          gsap.fromTo(
            node,
            { y: 50, opacity: 0, filter: "blur(10px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: node,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        /* 11 ── Omnitrix Core Pulse & Ambient Drift */
        gsap.to(".ct-omnitrix-core", {
          scale: 1.1,
          opacity: 0.7,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".ct-ambient-orb", {
          delay: 0.5,
          x: "random(-80, 80)",
          y: "random(-80, 80)",
          duration: "random(12, 18)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 1.5,
        });

        /* 13 ── Member card entrance & 3D tilt */
        const cardElements =
          document.querySelectorAll<HTMLElement>(".ct-member-card");
        gsap.fromTo(
          cardElements,
          { y: 80, opacity: 0, scale: 0.94, filter: "blur(15px)" },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: "#ct-team", start: "top 85%" },
          }
        );
        cardElements.forEach((card) => {
          card.addEventListener("mousemove", (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
              rotationY: x * 15,
              rotationX: -y * 15,
              z: 25,
              duration: 0.35,
              ease: "power2.out",
              transformPerspective: 1200,
            });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              z: 0,
              duration: 0.75,
              ease: "power3.out",
            });
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
    <div class="relative min-h-screen overflow-x-hidden bg-[#020402] px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      {/* ── Cinematic Background System ── */}
      <div class="pointer-events-none absolute inset-0 z-0">
        <div class="absolute inset-0 opacity-[0.03]"
          style="background-image:linear-gradient(#0ea935 1px,transparent 1px),linear-gradient(90deg,#0ea935 1px,transparent 1px);background-size:60px 60px;" />
        <div class="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(14,169,53,0.14),transparent_65%)]" />
      </div>

      {/* ── Header Section ── */}
      <div class="relative z-10 mx-auto mt-20 mb-16 max-w-5xl text-center">
        <div class="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#081108] px-4 py-2">
          <span class="h-2 w-2 rounded-full bg-[#0ea935]" />
          <span class="text-[0.6rem] font-black tracking-[0.35em] text-white/40 uppercase">Contact Directory</span>
        </div>
        <h1 class="t-heading bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-4xl font-black tracking-tighter text-transparent leading-[1.1] md:text-7xl">
          FOR ANY <span class="text-[#0ea935]">QUERIES</span> <br />
          <span class="t-gradient-silver font-outline-2 text-[0.9em]">CONTACT</span>
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
          A lighter contact page for faster scrolling and smoother browsing on
          both laptops and mobile devices.
        </p>
        <div class="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#0ea935] to-transparent" />
      </div>

      <section id="ct-team" class="relative z-10 mx-auto max-w-6xl space-y-10">
        {teamData.value.order.map((section) => {
          const members = teamData.value[
            section.key as keyof Omit<TeamData, "order" | "webtek">
          ] as TeamMember[];
          if (!Array.isArray(members) || members.length === 0) return null;

          const roleColor =
            section.key === "convenor" || section.key === "president"
              ? "#ef4444"
              : section.key === "coConvenors" || section.key === "vicePresidents"
                ? "#eab308"
                : "#0ea935";
          const sectionTitle =
            section.key === "coConvenors" ? "Co-Convenors" : section.label;

          return (
            <div key={section.key} class="space-y-5">
              <div
                class="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-[#081108] px-5 py-5 sm:flex-row sm:items-end sm:justify-between"
                style={{ borderColor: `${roleColor}22` }}
              >
                <div>
                  <span
                    class="inline-flex items-center gap-2 text-[0.65rem] font-black tracking-[0.35em] uppercase"
                    style={{ color: roleColor }}
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: roleColor,
                      }}
                    />
                    Contact Section
                  </span>
                  <h2 class="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                    {sectionTitle}
                  </h2>
                </div>
                <span
                  class="inline-flex w-fit items-center rounded-full border border-white/10 px-4 py-2 text-[0.7rem] font-black tracking-[0.28em] text-white/65 uppercase"
                  style={{ borderColor: `${roleColor}33` }}
                >
                  {members.length.toString().padStart(2, "0")} Card
                  {members.length > 1 ? "s" : ""}
                </span>
              </div>

              <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <article
                    key={`${section.key}-${member.name}`}
                    class="ct-member-card relative min-h-[170px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#071008]"
                    style={{ borderColor: `${roleColor}22` }}
                  >
                    <div
                      class="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                      style={{
                        backgroundImage: `linear-gradient(to right, transparent, ${roleColor}, transparent)`,
                      }}
                    />

                    <div class="relative z-10 flex h-full items-center gap-4 p-5 sm:gap-5 sm:p-6">
                      <div
                        class="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-[#0b130b]"
                        style={{ borderColor: `${roleColor}44` }}
                      >
                        <img
                          src={member.image || "/team/default-avatar.svg"}
                          alt={member.name}
                          class="h-full w-full object-cover"
                          onError$={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/team/default-avatar.svg";
                          }}
                        />
                        <div
                          class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-black"
                          style={{
                            backgroundColor: roleColor,
                          }}
                        />
                      </div>

                      <div class="min-w-0 flex-1 space-y-2.5">
                        <div>
                          <span
                            class="inline-block text-[0.6rem] font-black tracking-[0.3em] uppercase opacity-80"
                            style={{ color: roleColor }}
                          >
                            {section.label}
                          </span>
                          <h3 class="mt-0.5 truncate text-lg font-black text-white md:text-xl">
                            {member.name}
                          </h3>
                        </div>

                        <div class="flex flex-col gap-1.5">
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, "")}`}
                            class="flex items-center gap-2.5 text-[0.75rem] font-bold text-white/60"
                          >
                            <div class="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                              <svg
                                class="h-3 w-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <span class="tracking-[0.18em] text-white/70">{member.phone}</span>
                          </a>
                          {member.email ? (
                            <a
                              href={`mailto:${member.email}`}
                              class="flex items-center gap-2.5 text-[0.75rem] font-bold text-white/60"
                            >
                              <div class="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                                <svg
                                  class="h-3 w-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2.5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <span class="truncate text-white/70">{member.email}</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
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
