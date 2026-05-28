import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getDevicePerfTier } from "~/utils/perf";

interface Sponsor {
  name: string;
  logo: string;
  order?: number;
  isActive?: boolean;
}

interface SponsorsConfig {
  diamond: Sponsor[];
  platinum: Sponsor[];
  gold: Sponsor[];
  silver: Sponsor[];
  media: Sponsor[];
}

interface SponsorsPageCopy {
  badge: string;
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  selectorBadge: string;
  selectorTitle: string;
  hallBadge: string;
  hallTitlePrefix: string;
  hallTitleAccent: string;
  hallDescription: string;
  benefitsBadge: string;
  benefitsTitlePrefix: string;
  benefitsTitleAccent: string;
  benefitsDescription: string;
  ctaTitlePrefix: string;
  ctaTitleAccent: string;
  ctaDescription: string;
  ctaButton: string;
}

const sponsorTierMeta = [
  {
    key: "diamond",
    label: "Diamond",
    eyebrow: "Elite Partners",
    description:
      "The peak of fest integration, offering maximum prominence across all digital and ground touchpoints.",
    accent: "#ff4d4f",
    glow: "rgba(255, 77, 79, 0.4)",
  },
  {
    key: "platinum",
    label: "Platinum",
    eyebrow: "Flagship Partners",
    description:
      "Extensive visibility and dedicated engagement zones for major brand discovery.",
    accent: "#70f3ff",
    glow: "rgba(112, 243, 255, 0.4)",
  },
  {
    key: "gold",
    label: "Gold",
    eyebrow: "Premium Backers",
    description:
      "Strong festive presence and audience interaction throughout the three-day event.",
    accent: "#ffd54a",
    glow: "rgba(255, 213, 74, 0.4)",
  },
  {
    key: "silver",
    label: "Silver",
    eyebrow: "Sustaining Partners",
    description: "",
    accent: "#ffffff",
    glow: "rgba(255, 255, 255, 0.2)",
  },
  {
    key: "media",
    label: "Media",
    eyebrow: "Broadcast Reach",
    description:
      "Amplifying Theta's voice and reach across national and digital platforms.",
    accent: "#7c5cff",
    glow: "rgba(124, 92, 255, 0.22)",
  },
] as const;

type SponsorTierKey = (typeof sponsorTierMeta)[number]["key"];

const defaultSponsors: SponsorsConfig = {
  diamond: [],
  platinum: [],
  gold: [],
  silver: [],
  media: [],
};

const defaultCopy: SponsorsPageCopy = {
  badge: "Brand Alliances",
  titlePrefix: "Sponsors behind",
  titleAccent: "Theta",
  subtitle:
    "Explore the partners who amplify Theta's energy, back its vision, and help turn the fest into a larger campus experience.",
  primaryCta: "Become a Sponsor",
  secondaryCta: "Explore Sponsor Hall",
  selectorBadge: "Sponsor Spectrum",
  selectorTitle: "Choose a tier, then dive into the partner showcase.",
  hallBadge: "Sponsor Hall",
  hallTitlePrefix: "Every tier gets",
  hallTitleAccent: "its own spotlight",
  hallDescription:
    "From flagship branding to focused campaign visibility, each sponsorship layer is presented with its own visual treatment.",
  benefitsBadge: "Why Partner",
  benefitsTitlePrefix: "Why brands partner with",
  benefitsTitleAccent: "Theta",
  benefitsDescription:
    "Theta brings audience energy, student credibility, and visual presence together in one modern festival experience.",
  ctaTitlePrefix: "Want your brand in the",
  ctaTitleAccent: "next edition?",
  ctaDescription:
    "Let's build a sponsorship presence that feels premium on-ground and online.",
  ctaButton: "Talk to Sponsorship Team",
};

const sortSponsors = (list: Sponsor[] = []) =>
  list.slice().sort((a, b) => (a.order || 999) - (b.order || 999));

const getOuterTierTheme = (
  tier: (typeof sponsorTierMeta)[number] & { sponsors: Sponsor[] },
) => {
  if (tier.key === "diamond") {
    return {
      accent: "#ff4d4f",
      glow: "rgba(255, 77, 79, 0.4)",
    };
  }
  if (tier.key === "platinum") {
    return {
      accent: "#70f3ff",
      glow: "rgba(112, 243, 255, 0.4)",
    };
  }
  return {
    accent: tier.accent,
    glow: tier.glow,
  };
};

export default component$(() => {
  const sponsors = useSignal<SponsorsConfig>(defaultSponsors);
  const copy = useSignal<SponsorsPageCopy>(defaultCopy);
  const selectedTier = useSignal<SponsorTierKey>("diamond");

  useVisibleTask$(async () => {
    try {
      const [sponsorRes, contentRes] = await Promise.all([
        fetch("/data/sponsors.json"),
        fetch("/data/content.json"),
      ]);

      const sponsorPayload = (await sponsorRes.json()) as {
        sponsors?: Partial<SponsorsConfig>;
      };
      const contentPayload = (await contentRes.json()) as {
        sponsorsPage?: Partial<SponsorsPageCopy>;
        seo?: { sponsorsTitle?: string; sponsorsDescription?: string };
      };

      sponsors.value = {
        ...defaultSponsors,
        ...(sponsorPayload.sponsors || {}),
        diamond: sortSponsors(sponsorPayload.sponsors?.diamond || []),
        platinum: sortSponsors(sponsorPayload.sponsors?.platinum || []),
        gold: sortSponsors(sponsorPayload.sponsors?.gold || []),
        silver: sortSponsors(sponsorPayload.sponsors?.silver || []),
        media: sortSponsors(sponsorPayload.sponsors?.media || []),
      };

      if (contentPayload.sponsorsPage) {
        copy.value = { ...defaultCopy, ...contentPayload.sponsorsPage };
      }

      if (contentPayload.seo?.sponsorsTitle) {
        document.title = contentPayload.seo.sponsorsTitle;
      }

      if (contentPayload.seo?.sponsorsDescription) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", contentPayload.seo.sponsorsDescription);
      }

      const firstAvailable = sponsorTierMeta.find(
        (tier) => sponsors.value[tier.key].length > 0,
      );
      if (firstAvailable) selectedTier.value = firstAvailable.key;
    } catch {
      sponsors.value = defaultSponsors;
      copy.value = defaultCopy;
    }
  });

  useVisibleTask$(() => {
    /* Set special theme for Sponsors page */
    const original = document.body.getAttribute("data-theme") || "default";
    document.body.setAttribute("data-theme", "red-ben10");

    return () => {
      /* Revert to original theme when leaving */
      document.body.setAttribute("data-theme", original);
    };
  });

  useVisibleTask$(() => {
    const enablePremiumMotion =
      getDevicePerfTier() === "hi" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".s-reveal").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      if (enablePremiumMotion) {
        gsap.to(".s-orb-a", {
          x: 40,
          y: -30,
          duration: 9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(".s-orb-b", {
          x: -36,
          y: 28,
          duration: 11,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(".s-orb-c", {
          x: 28,
          y: 22,
          duration: 8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      gsap.fromTo(
        ".s-spotlight-item",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.2,
        },
      );
    });

    const tiltCards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sponsor-tilt]"),
    );
    const cleanups: Array<() => void> = [];

    if (enablePremiumMotion) {
      tiltCards.forEach((card) => {
        let rafId: number;
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            gsap.to(card, {
              rotateY: x * 12,
              rotateX: -y * 10,
              y: -8,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };
        const onLeave = () => {
          if (rafId) cancelAnimationFrame(rafId);
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            y: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
          });
        };
        const onEnter = () => {
          gsap.set(card, { willChange: "transform" });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        card.addEventListener("mouseenter", onEnter);

        cleanups.push(() => {
          if (rafId) cancelAnimationFrame(rafId);
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
          card.removeEventListener("mouseenter", onEnter);
        });
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  });

  const jumpToTier = $((key: SponsorTierKey) => {
    selectedTier.value = key;
    document
      .getElementById(`sponsor-tier-${key}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const scrollToHall = $(() => {
    document
      .getElementById("sponsor-hall")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const availableTiers = sponsorTierMeta
    .map((tier) => ({
      ...tier,
      sponsors: sponsors.value[tier.key].filter((s) => s.isActive),
    }))
    .filter((tier) => tier.sponsors.length > 0);

  const fallbackTier = { ...sponsorTierMeta[0], sponsors: [] as Sponsor[] };
  const spotlight =
    availableTiers.find((tier) => tier.key === selectedTier.value) ||
    availableTiers[0] ||
    fallbackTier;

  const totalSponsors = availableTiers.reduce(
    (sum, tier) => sum + tier.sponsors.length,
    0,
  );

  const benefits = [
    {
      title: "Audience Energy",
      eyebrow: "High-intent crowds",
      metric: "12K+",
      metricLabel: "festival impressions",
      chip: "Student-first reach",
      accent: "#6eff5a",
      glow: "rgba(110,255,90,0.22)",
      description:
        "Meet students, builders, creators, and communities already primed for festival moments and brand discovery.",
    },
    {
      title: "Visual Presence",
      eyebrow: "Premium placement",
      metric: "360",
      metricLabel: "digital + venue touchpoints",
      chip: "Always-on visibility",
      accent: "#4de0ff",
      glow: "rgba(77,224,255,0.2)",
      description:
        "Extend your identity through the website, venue touchpoints, and spotlight moments with a more premium feel.",
    },
    {
      title: "Campus Recall",
      eyebrow: "Memorable storytelling",
      metric: "3X",
      metricLabel: "stronger repeated recall",
      chip: "Designed to stick",
      accent: "#ffd54a",
      glow: "rgba(255,213,74,0.2)",
      description:
        "Stay memorable through tiered placements, storytelling opportunities, and a showcase that feels designed, not generic.",
    },
  ] as const;

  const marqueeSponsors = availableTiers.flatMap((tier) =>
    tier.sponsors.map((sponsor) => ({
      ...sponsor,
      tierKey: tier.key,
    })),
  );

  return (
    <div class="relative overflow-x-hidden px-4 pt-24 pb-10 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      {/* Full-viewport hero canvas */}
      <section
        class="relative z-10 mx-auto flex min-h-[40rem] w-full max-w-[1700px] flex-col justify-center overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-black/80 via-[#040604] to-black px-4 py-8 shadow-[0_0_120px_rgba(255,77,79,0.12)] ring-1 ring-white/5 backdrop-blur-3xl sm:min-h-[85vh] sm:rounded-[3rem] sm:px-8 sm:py-10 lg:px-12 xl:px-14"
      >
        {/* --- Background Animations --- */}
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.04]"
          style="background-image: linear-gradient(#ff4d4f 1px, transparent 1px), linear-gradient(90deg, #ff4d4f 1px, transparent 1px); background-size: 50px 50px;"
        ></div>

        <div
          class="pointer-events-none absolute -right-[15%] bottom-[-10%] hidden h-[50vw] w-[50vw] rounded-full bg-[#ff4d4f] opacity-[0.08] blur-[150px] transition-opacity duration-[10s] sm:block"
          style="transition-delay: 2s;"
        />

        <div class="s-ben10-mark s-ben10-mark--primary hidden sm:block">
          <span class="s-ben10-mark__glow"></span>
          <img
            src="/red-ben10/red-ben10.webp"
            alt=""
            class="s-ben10-mark__img"
            style={{ animation: "float 15s ease-in-out infinite" }}
          />
        </div>
        <div class="s-ben10-mark s-ben10-mark--secondary hidden sm:block">
          <span class="s-ben10-mark__glow"></span>
          <img
            src="/red-ben10/red-ben10.webp"
            alt=""
            class="s-ben10-mark__img"
            style={{ animation: "float-reverse 20s ease-in-out infinite" }}
          />
        </div>

        <div class="flex h-full w-full flex-col justify-center">
          <div class="relative grid h-full items-center gap-8 md:gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.98fr)] xl:gap-10 2xl:gap-14">
            <div class="s-reveal mx-auto flex w-full max-w-[32rem] flex-col items-center text-center xl:mx-0 xl:max-w-none xl:items-start xl:text-left">
              <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                <span class="text-[0.6rem] font-bold tracking-[0.2em] text-white/70 uppercase">
                  {copy.value.badge}
                </span>
              </div>

              <h1 class="t-heading bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-[clamp(2.35rem,7vw,5.5rem)] leading-[0.88] font-black tracking-[-0.04em] text-transparent drop-shadow-xl">
                {copy.value.titlePrefix}{" "}
                <span class="mt-1 block text-[#ff4d4f] drop-shadow-[0_0_30px_rgba(255,77,79,0.4)] mix-blend-screen">
                  {copy.value.titleAccent}
                </span>
              </h1>
              <p class="mt-4 max-w-[26rem] text-[0.92rem] leading-relaxed font-medium text-[var(--t-muted)] sm:max-w-[34rem] sm:text-[1rem] xl:pr-10">
                {copy.value.subtitle}
              </p>

              <div class="mt-7 flex w-full max-w-[32rem] flex-row gap-4 items-center justify-between sm:max-w-none">
                {[
                  {
                    label: "Partners",
                    value: String(totalSponsors || 0).padStart(2, "0"),
                    icon: "M13 10V3L4 14h7v7l9-11h-7z"
                  },
                  {
                    label: "Tiers",
                    value: String(availableTiers.length || 0).padStart(2, "0"),
                    icon: "M9 19V5l12 7-12 7z"
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    class="group relative flex flex-col items-center xl:items-start"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-3 h-3 text-[#ff4d4f] transition-transform group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}></path></svg>
                      <p class="text-[0.5rem] font-black tracking-[0.25em] text-white/30 uppercase group-hover:text-white/60 transition-colors">
                        {item.label}
                      </p>
                    </div>
                    <p class="text-2xl font-black text-white tracking-widest drop-shadow-md">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div class="mt-7 flex w-full flex-col gap-3 sm:max-w-[28rem] sm:flex-row sm:flex-wrap sm:justify-center xl:max-w-none xl:justify-start xl:gap-4">
                <Link
                  href="/contact"
                  class="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d4f] via-[#ff7875] to-[#f5222d] px-6 py-3 text-center text-[0.75rem] font-black tracking-widest text-white uppercase shadow-[0_0_20px_rgba(255,77,79,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,77,79,0.6)] sm:flex-1 xl:w-auto xl:flex-none"
                >
                  {copy.value.primaryCta}
                </Link>
                <button
                  type="button"
                  onClick$={scrollToHall}
                  class="flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-[0.75rem] font-bold tracking-widest text-white uppercase transition-all hover:border-white/40 hover:bg-white/10 backdrop-blur-md sm:flex-1 xl:w-auto xl:flex-none"
                >
                  {copy.value.secondaryCta}
                </button>
              </div>
            </div>

            <div class="s-reveal hidden xl:block">
              <div
                data-sponsor-tilt
                class="group relative mx-auto w-full max-w-[42rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#070707]/80 p-4 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-white/30 sm:p-5 lg:p-6 xl:mx-0 xl:max-w-none"
                style={`border-color:${spotlight.glow};box-shadow:0 16px 42px rgba(0,0,0,0.36),0 0 24px ${spotlight.glow};`}
              >
                {/* Smooth Glass Highlights for Hover Effect */}
                <div
                  class="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-1000 group-hover:opacity-70"
                  style={`background: radial-gradient(circle at top right, ${spotlight.glow}, transparent 55%), radial-gradient(circle at bottom left, ${spotlight.glow}, transparent 55%);`}
                ></div>
                <div class="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-60"></div>

                <div class="relative z-10">
                  <div class="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p class="text-[0.55rem] font-black tracking-[0.3em] text-white/50 uppercase transition-colors duration-500 group-hover:text-white">
                        Spotlight Tier
                      </p>
                      <h2 class="t-heading mt-1 text-[1.75rem] font-black tracking-tight text-white drop-shadow-md sm:text-[2rem]">
                        {spotlight.label}
                      </h2>
                    </div>
                    <span
                      class="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-black/50 text-base font-black uppercase shadow-inner backdrop-blur-md transition-transform duration-500 group-hover:scale-110"
                      style={`border-color: ${spotlight.glow}; color: ${spotlight.accent}; box-shadow: inset 0 0 10px ${spotlight.glow};`}
                    >
                      {spotlight.sponsors.length}
                    </span>
                  </div>

                  <p
                    class="mt-3 inline-flex max-w-full rounded-full border border-white/5 bg-black/40 px-3 py-1 text-[0.55rem] font-bold tracking-[0.22em] uppercase shadow-inner backdrop-blur-md transition-colors duration-500 group-hover:bg-black/60"
                    style={`color: ${spotlight.accent}; box-shadow: 0 0 5px ${spotlight.glow};`}
                  >
                    {spotlight.eyebrow}
                  </p>
                  <p class="mt-2 max-w-xl text-[0.82rem] leading-relaxed text-white/60 drop-shadow-sm transition-colors duration-500 group-hover:text-white/80 sm:text-[0.88rem]">
                    {spotlight.description}
                  </p>

                  <div class="mt-8 grid grid-cols-2 gap-4">
                    {spotlight.sponsors.slice(0, 4).map((sponsor) => (
                      <div
                        key={`${spotlight.key}-${sponsor.name}`}
                        class="s-spotlight-item group flex min-h-[9rem] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.08]"
                        style={`border-color:${spotlight.glow};box-shadow:0 10px 24px rgba(0,0,0,0.18),0 0 18px ${spotlight.glow};`}
                      >
                        <div class="flex h-16 w-full items-center justify-center overflow-hidden rounded-xl bg-white/95 p-3 shadow-inner group-hover:bg-white transition-colors duration-500">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            loading="lazy"
                            class="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <p class="mt-3 text-center text-[0.6rem] font-black tracking-[0.2em] text-white/40 uppercase group-hover:text-white transition-colors">
                          {sponsor.name}
                        </p>
                      </div>
                    ))}
                    {spotlight.sponsors.length === 0 && (
                      <div class="col-span-2 rounded-[2rem] border border-dashed border-white/10 bg-black/20 py-12 text-center text-xs text-white/30">
                        Awaiting partner confirmation.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="sponsor-hall" class="relative z-10 mx-auto mt-16 max-w-7xl">
        <div class="s-reveal mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span class="t-badge">{copy.value.hallBadge}</span>
            <h2 class="t-heading mt-5 text-[clamp(2.2rem,4vw,3.6rem)] text-[var(--t-text)]">
              {copy.value.hallTitlePrefix}{" "}
              <span class="text-[#70f3ff] drop-shadow-[0_0_20px_rgba(112,243,255,0.3)]">{copy.value.hallTitleAccent}</span>
            </h2>
            <p class="mt-3 max-w-2xl text-base leading-relaxed text-[var(--t-muted)]">
              {copy.value.hallDescription}
            </p>
          </div>
          <span class="t-sticker">Alliance Hall</span>
        </div>

        <div class="space-y-8">
          {availableTiers.length > 0 ? (
            availableTiers.map((tier, index) => {
              const active = selectedTier.value === tier.key;
              const outerTheme = getOuterTierTheme(tier);

              return (
                <section
                  id={`sponsor-tier-${tier.key}`}
                  key={tier.key}
                  class="s-reveal scroll-mt-28 rounded-[2.25rem] border bg-[rgba(5,5,5,0.72)] p-5 backdrop-blur-2xl sm:p-6 lg:p-7"
                  style={`border-color:${outerTheme.glow};box-shadow:${active
                    ? `0 16px 42px rgba(0,0,0,0.24),0 0 24px ${outerTheme.glow}`
                    : `0 12px 30px rgba(0,0,0,0.18),0 0 16px ${outerTheme.glow}`
                    };will-change:transform,opacity;`}
                >
                  <div class="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div
                      class="rounded-[1.75rem] border px-5 py-6"
                      style={`border-color:${outerTheme.glow};background:radial-gradient(circle at top left, ${outerTheme.glow}, transparent 46%), rgba(255,255,255,0.02);box-shadow:0 10px 24px rgba(0,0,0,0.16),0 0 18px ${outerTheme.glow};`}
                    >
                      <p class="text-[0.66rem] font-black tracking-[0.28em] text-white uppercase">
                        Tier {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 class="t-heading mt-4 text-4xl text-[var(--t-text)]">
                        {tier.label}
                      </h3>
                      <p
                        class="mt-3 text-[0.74rem] font-black tracking-[0.22em] uppercase"
                        style={`color: ${outerTheme.accent};`}
                      >
                        {tier.eyebrow}
                      </p>
                      {tier.description && (
                        <p class="mt-5 text-sm leading-relaxed text-[var(--t-muted)]">
                          {tier.description}
                        </p>
                      )}

                      <div class="mt-6 flex flex-wrap gap-2">
                        <span class="t-chip">
                          {tier.sponsors.length} Partners
                        </span>
                        <span class="t-chip">Campus Activation</span>
                        <span class="t-chip">Digital Presence</span>
                      </div>
                    </div>

                    <div
                      class="rounded-[1.75rem] border border-white/8 bg-black/20 p-4 sm:p-5"
                      style={`border-color:${outerTheme.glow};box-shadow:0 10px 24px rgba(0,0,0,0.16),0 0 18px ${outerTheme.glow};`}
                    >
                      <div class="flex flex-wrap justify-center gap-4">
                        {tier.sponsors.map((sponsor) => (
                          <article
                            key={`${tier.key}-${sponsor.name}`}
                            class="group relative flex w-full max-w-[17rem] flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                            style={`border-color:${outerTheme.glow};box-shadow:0 8px 22px rgba(0,0,0,0.16),0 0 16px ${outerTheme.glow};`}
                          >
                            {sponsor.isActive && (
                              <div class="pointer-events-none absolute -top-2 -right-2 z-20 flex items-center gap-1 rounded-full border border-[#ff4d4f]/40 bg-[#ff4d4f] px-2 py-0.5 text-[0.45rem] font-black tracking-widest text-black uppercase shadow-[0_0_15px_rgba(255,77,79,0.5)]">
                                <span class="h-1 w-1 animate-pulse rounded-full bg-black"></span>
                                Active 2026
                              </div>
                            )}
                            <div class="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-white/95 p-4 shadow-inner">
                              <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                loading="lazy"
                                class="h-full w-full object-contain filter transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <p class="mt-4 text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase transition-colors group-hover:text-white">
                              {sponsor.name}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div class="rounded-[2rem] border border-dashed border-white/10 bg-black/20 px-6 py-16 text-center text-[var(--t-muted)]">
              Sponsor tiers will appear here once the sponsor data is published.
            </div>
          )}
        </div>
      </section>

      <section class="relative z-10 mx-auto mt-16 max-w-7xl">
        <div class="s-reveal mb-10 text-center">
          <span class="t-badge">{copy.value.benefitsBadge}</span>
          <h2 class="t-heading mt-5 text-[clamp(2rem,4vw,3.3rem)] text-[var(--t-text)]">
            {copy.value.benefitsTitlePrefix}{" "}
            <span class="text-[#70f3ff] drop-shadow-[0_0_20px_rgba(112,243,255,0.2)]">{copy.value.benefitsTitleAccent}</span>
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--t-muted)]">
            {copy.value.benefitsDescription}
          </p>
        </div>

        <div class="s-benefits-stage">
          <div class="s-benefits-stage__glow"></div>
          <div class="s-benefits-grid">
            {benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                class="s-reveal s-benefit-card"
                style={`--s-benefit-accent:${benefit.accent};--s-benefit-glow:${benefit.glow};`}
              >
                <div class="s-benefit-card__top">
                  <span class="s-benefit-card__index">0{index + 1}</span>
                  <span class="s-benefit-card__eyebrow">{benefit.eyebrow}</span>
                </div>
                <div class="s-benefit-card__body">
                  <h3 class="s-benefit-card__title">{benefit.title}</h3>
                  <p class="s-benefit-card__copy">{benefit.description}</p>
                </div>
                <div class="s-benefit-card__footer">
                  <div class="s-benefit-card__metric">
                    <strong>{benefit.metric}</strong>
                    <span>{benefit.metricLabel}</span>
                  </div>
                  <span class="s-benefit-card__chip">{benefit.chip}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: "THETA 2K26 Sponsors | SASTRA Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Explore THETA 2K26 sponsors and partner brands powering SASTRA Theta 2026 across diamond, platinum, gold, silver and media tiers.",
    },
    {
      name: "keywords",
      content:
        "theta sponsors, theta 2k26 sponsors, theta 2026 sponsors, theta sponsor hall, theta sponsorship, sastra theta sponsors, sastra fest sponsors, theta partner brands",
    },
    {
      property: "og:title",
      content: "THETA 2K26 Sponsors | SASTRA Theta 2026",
    },
    {
      property: "og:description",
      content:
        "Discover the sponsor hall and partner brands supporting THETA 2K26, SASTRA's techno-management fest.",
    },
    {
      property: "og:url",
      content: "https://www.thetasrc.in/sponsors",
    },
    {
      property: "og:image",
      content: "https://www.thetasrc.in/og-image.png",
    },
  ],
};
