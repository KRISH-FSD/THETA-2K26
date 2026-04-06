import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Sponsor {
  name: string;
  logo: string;
  order?: number;
  isActive?: boolean;
}

interface SponsorsConfig {
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
    key: "platinum",
    label: "Platinum",
    eyebrow: "Flagship visibility",
    description:
      "High-impact branding for partners who want the boldest Theta footprint.",
    accent: "#0ea935",
    glow: "rgba(14, 169, 53, 0.4)",
  },
  {
    key: "gold",
    label: "Gold",
    eyebrow: "Premium reach",
    description:
      "A polished brand layer for sponsors who want standout recall across the fest.",
    accent: "#f5c842",
    glow: "rgba(245,200,66,0.2)",
  },
  {
    key: "silver",
    label: "Silver",
    eyebrow: "Momentum layer",
    description:
      "Smart campaign visibility with a strong on-ground and digital presence.",
    accent: "#c2cad7",
    glow: "rgba(194,202,215,0.18)",
  },
  {
    key: "media",
    label: "Media",
    eyebrow: "Amplification network",
    description:
      "Partners who extend Theta's stories, moments, and announcements beyond campus.",
    accent: "#7c5cff",
    glow: "rgba(124,92,255,0.22)",
  },
] as const;

type SponsorTierKey = (typeof sponsorTierMeta)[number]["key"];

const defaultSponsors: SponsorsConfig = {
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
) =>
  tier.key === "platinum"
    ? {
      accent: "#ff4d4f",
      glow: "rgba(255,77,79,0.26)",
    }
    : {
      accent: tier.accent,
      glow: tier.glow,
    };

export default component$(() => {
  const sponsors = useSignal<SponsorsConfig>(defaultSponsors);
  const copy = useSignal<SponsorsPageCopy>(defaultCopy);
  const selectedTier = useSignal<SponsorTierKey>("platinum");

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

    tiltCards.forEach((card) => {
      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1200px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      };
      const onLeave = () => {
        card.style.transition =
          "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform =
          "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0)";
      };
      const onEnter = () => {
        card.style.transition = "transform 120ms linear";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      card.addEventListener("mouseenter", onEnter);

      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        card.removeEventListener("mouseenter", onEnter);
      });
    });

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
    <div class="relative overflow-x-hidden px-4 pt-0 pb-10 sm:px-6 lg:px-8">
      {/* Full-viewport hero canvas */}
      <section
        class="relative z-10 mx-auto flex min-h-[42rem] w-full max-w-[1700px] flex-col justify-center overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-black/80 via-[#040604] to-black px-4 py-6 shadow-[0_0_120px_rgba(14,169,53,0.15)] ring-1 ring-white/5 backdrop-blur-3xl sm:min-h-[calc(100svh-90px)] sm:rounded-[3rem] sm:px-8 sm:py-8 lg:px-12 xl:px-14"
      >
        {/* --- Background Animations --- */}
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.04]"
          style="background-image: linear-gradient(#0ea935 1px, transparent 1px), linear-gradient(90deg, #0ea935 1px, transparent 1px); background-size: 50px 50px;"
        ></div>

        <div
          class="pointer-events-none absolute -right-[15%] bottom-[-10%] hidden h-[50vw] w-[50vw] rounded-full bg-[#0ea935] opacity-[0.08] blur-[150px] transition-opacity duration-[10s] sm:block"
          style="transition-delay: 2s;"
        />

        <div class="s-ben10-mark s-ben10-mark--primary hidden sm:block">
          <span class="s-ben10-mark__glow"></span>
          <img
            src="/ben10/ben10-logo.png"
            alt=""
            class="s-ben10-mark__img"
            style={{ animation: "float 15s ease-in-out infinite" }}
          />
        </div>
        <div class="s-ben10-mark s-ben10-mark--secondary hidden sm:block">
          <span class="s-ben10-mark__glow"></span>
          <img
            src="/ben10/ben10-logo.png"
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

              <h1 class="t-heading bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-[clamp(2.35rem,7vw,5rem)] leading-[0.92] font-black tracking-[-0.04em] text-transparent drop-shadow-xl">
                {copy.value.titlePrefix}{" "}
                <span class="t-gradient mt-1 block drop-shadow-[0_0_20px_rgba(14,169,53,0.3)]">
                  {copy.value.titleAccent}
                </span>
              </h1>
              <p class="mt-4 max-w-[26rem] text-[0.92rem] leading-relaxed font-medium text-[var(--t-muted)] sm:max-w-[34rem] sm:text-[1rem] xl:pr-10">
                {copy.value.subtitle}
              </p>

              <div class="mt-7 grid w-full grid-cols-3 gap-3 sm:max-w-[28rem] sm:gap-4 xl:max-w-none">
                {[
                  {
                    label: "Partners",
                    value: String(totalSponsors || 0).padStart(2, "0"),
                  },
                  {
                    label: "Active Tiers",
                    value: String(availableTiers.length || 0).padStart(2, "0"),
                  },
                  {
                    label: "Design",
                    value: "Live",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    class="group relative flex min-h-[5rem] flex-col justify-center rounded-[1rem] border border-white/10 bg-black/40 px-3 py-2.5 text-center backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 sm:px-4"
                  >
                    <p class="text-[0.55rem] font-black tracking-[0.2em] text-[var(--t-dim)] uppercase transition-colors group-hover:text-[#0ea935]">
                      {item.label}
                    </p>
                    <p class="mt-1 text-xl font-[var(--font-display)] font-black text-white drop-shadow-md">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div class="mt-7 flex w-full flex-col gap-3 sm:max-w-[28rem] sm:flex-row sm:flex-wrap sm:justify-center xl:max-w-none xl:justify-start xl:gap-4">
                <Link
                  href="/contact"
                  class="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#0ea935] via-[#35ff6b] to-[#09a82b] px-6 py-3 text-center text-[0.75rem] font-black tracking-widest text-black uppercase shadow-[0_0_20px_rgba(14,169,53,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(14,169,53,0.6)] sm:flex-1 xl:w-auto xl:flex-none"
                >
                  {copy.value.primaryCta}
                </Link>
                <button
                  type="button"
                  onClick$={scrollToHall}
                  class="flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-[0.75rem] font-bold tracking-widest text-white uppercase transition-all hover:border-white/40 hover:bg-white/10 sm:flex-1 xl:w-auto xl:flex-none"
                >
                  {copy.value.secondaryCta}
                </button>
              </div>
            </div>

            <div class="s-reveal block">
              <div
                data-sponsor-tilt
                class="group relative mx-auto w-full max-w-[42rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#070707]/80 p-4 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-white/30 sm:p-5 lg:p-6 xl:mx-0 xl:max-w-none"
                style={`box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${spotlight.glow};`}
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

                  <div class="mt-4 flex flex-wrap justify-center gap-3">
                    {spotlight.sponsors.slice(0, 4).map((sponsor) => (
                      <div
                        key={`${spotlight.key}-${sponsor.name}`}
                        class="s-spotlight-item group flex min-h-[8.75rem] w-full max-w-[13rem] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)] sm:min-h-[9.5rem]"
                        style={`border-color: ${spotlight.glow};`}
                      >
                        <div class="flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-white/95 p-2 mix-blend-screen shadow-inner transition-all duration-500 group-hover:mix-blend-normal sm:h-16">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            loading="lazy"
                            class="h-full w-full object-contain filter transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <p class="mt-2 line-clamp-2 text-center text-[0.6rem] font-bold tracking-[0.16em] text-[var(--t-dim)] uppercase transition-colors group-hover:text-white">
                          {sponsor.name}
                        </p>
                      </div>
                    ))}
                    {spotlight.sponsors.length === 0 && (
                      <div class="rounded-[1.35rem] border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-[var(--t-muted)] sm:col-span-2">
                        Sponsor logos will appear here once the tier is updated.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {marqueeSponsors.length > 0 && (
        <section class="relative z-10 mx-auto mt-8 max-w-7xl">
          <div class="s-reveal rounded-[2rem] border border-white/8 bg-black/25 px-5 py-5 backdrop-blur-2xl sm:px-6">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span class="t-badge">{copy.value.selectorBadge}</span>
              <p class="text-sm text-[var(--t-muted)]">
                A moving glimpse of the partners already in the hall.
              </p>
            </div>
            <div class="t-marquee-wrap">
              <div data-marquee-track class="t-marquee-track animate-left">
                {[...marqueeSponsors, ...marqueeSponsors].map(
                  (sponsor, index) => (
                    <article
                      key={`${sponsor.tierKey}-${sponsor.name}-${index}`}
                      class="group mx-4 w-48 flex-shrink-0 text-center"
                    >
                      <div class="flex h-20 items-center justify-center rounded-2xl border border-white/20 bg-white/95 p-3 shadow-lg transition-transform duration-300 hover:scale-110">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          loading="lazy"
                          class="h-full w-full object-contain"
                        />
                      </div>
                      <p class="mt-3 text-[0.55rem] font-bold tracking-[0.25em] text-[var(--t-dim)] uppercase">
                        {sponsor.name}
                      </p>
                    </article>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section class="relative z-10 mx-auto mt-12 max-w-7xl">
        <div class="s-reveal text-center">
          <span class="t-badge">{copy.value.selectorBadge}</span>
          <h2 class="t-heading mt-5 text-[clamp(2rem,4vw,3.3rem)] text-[var(--t-text)]">
            {copy.value.selectorTitle}
          </h2>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {availableTiers.map((tier) => {
            const active = selectedTier.value === tier.key;
            const outerTheme = getOuterTierTheme(tier);
            return (
              <button
                key={tier.key}
                type="button"
                data-sponsor-tilt
                onClick$={() => jumpToTier(tier.key)}
                class={[
                  "s-reveal relative overflow-hidden rounded-[1.75rem] border bg-[rgba(5,5,5,0.72)] p-6 text-left backdrop-blur-2xl transition-all duration-300",
                  active ? "translate-y-[-4px]" : "hover:-translate-y-1",
                ]}
                style={`border-color: ${outerTheme.glow}; box-shadow: ${active
                    ? `0 24px 70px ${outerTheme.glow}`
                    : "0 20px 50px rgba(0,0,0,0.22)"
                  };`}
              >
                <div
                  class="pointer-events-none absolute inset-0"
                  style={`background: radial-gradient(circle at top right, ${outerTheme.glow}, transparent 40%);`}
                ></div>
                <div class="relative">
                  <p class="text-[0.64rem] font-black tracking-[0.26em] text-[var(--t-dim)] uppercase">
                    {tier.eyebrow}
                  </p>
                  <div class="mt-4 flex items-center justify-between gap-4">
                    <h3 class="t-heading text-2xl text-[var(--t-text)]">
                      {tier.label}
                    </h3>
                    <span
                      class="inline-flex min-w-[3rem] justify-center rounded-full border px-3 py-1 text-xs font-black tracking-[0.18em] uppercase"
                      style={`border-color: ${outerTheme.glow}; color: ${outerTheme.accent};`}
                    >
                      {tier.sponsors.length}
                    </span>
                  </div>
                  <p class="mt-4 text-sm leading-relaxed text-[var(--t-muted)]">
                    {tier.description}
                  </p>
                  <div class="mt-6 flex items-center gap-2 text-xs font-black tracking-[0.2em] text-[var(--t-text)] uppercase">
                    <span
                      class="inline-block h-2.5 w-2.5 rounded-full"
                      style={`background: ${outerTheme.accent}; box-shadow: 0 0 18px ${outerTheme.glow};`}
                    ></span>
                    Focus Tier
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section id="sponsor-hall" class="relative z-10 mx-auto mt-16 max-w-7xl">
        <div class="s-reveal mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span class="t-badge">{copy.value.hallBadge}</span>
            <h2 class="t-heading mt-5 text-[clamp(2.2rem,4vw,3.6rem)] text-[var(--t-text)]">
              {copy.value.hallTitlePrefix}{" "}
              <span class="t-gradient">{copy.value.hallTitleAccent}</span>
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
                  style={`border-color: ${outerTheme.glow}; box-shadow: ${active
                      ? `0 24px 90px ${outerTheme.glow}`
                      : "0 26px 70px rgba(0,0,0,0.2)"
                    };`}
                >
                  <div class="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div
                      class="rounded-[1.75rem] border px-5 py-6"
                      style={`border-color: ${outerTheme.glow}; background: radial-gradient(circle at top left, ${outerTheme.glow}, transparent 46%), rgba(255,255,255,0.02);`}
                    >
                      <p class="text-[0.66rem] font-black tracking-[0.28em] text-[var(--t-dim)] uppercase">
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
                      <p class="mt-5 text-sm leading-relaxed text-[var(--t-muted)]">
                        {tier.description}
                      </p>

                      <div class="mt-6 flex flex-wrap gap-2">
                        <span class="t-chip">
                          {tier.sponsors.length} Partners
                        </span>
                        <span class="t-chip">Campus Activation</span>
                        <span class="t-chip">Digital Presence</span>
                      </div>

                      <button
                        type="button"
                        onClick$={() => (selectedTier.value = tier.key)}
                        class="t-btn-ghost mt-6 !w-full !justify-center !px-5 !py-3 text-sm"
                      >
                        Keep {tier.label} in Focus
                      </button>
                    </div>

                    <div class="rounded-[1.75rem] border border-white/8 bg-black/20 p-4 sm:p-5">
                      <div class="flex flex-wrap justify-center gap-4">
                        {tier.sponsors.map((sponsor) => (
                          <article
                            key={`${tier.key}-${sponsor.name}`}
                            class="group relative flex w-full max-w-[17rem] flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                          >
                            {sponsor.isActive && (
                              <div class="pointer-events-none absolute -top-2 -right-2 z-20 flex items-center gap-1 rounded-full border border-[#0ea935]/40 bg-[#0ea935] px-2 py-0.5 text-[0.45rem] font-black tracking-widest text-black uppercase shadow-[0_0_15px_rgba(14,169,53,0.5)]">
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
                            <p class="mt-4 text-[0.65rem] font-bold tracking-[0.2em] text-[var(--t-dim)] uppercase transition-colors group-hover:text-[var(--t-text)]">
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
            <span class="t-gradient">{copy.value.benefitsTitleAccent}</span>
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
                style={`--s-benefit-accent:${benefit.accent};--s-benefit-glow:${benefit.glow};transition-delay:${index * 90}ms;`}
              >
                <span class="s-benefit-card__halo"></span>
                <span class="s-benefit-card__sheen"></span>
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

      <section class="relative z-10 mx-auto mt-16 max-w-7xl pb-6">
        <div class="s-reveal s-cta-shell">
          <div class="s-cta-shell__grid"></div>
          <div class="s-cta-shell__orb s-cta-shell__orb--left"></div>
          <div class="s-cta-shell__orb s-cta-shell__orb--right"></div>

          <div class="s-cta-shell__inner">
            <div class="s-cta-copy">
              <div class="s-cta-copy__meta">
                <span class="t-badge s-cta-copy__badge">
                  {copy.value.badge}
                </span>
                <div class="s-cta-copy__logo">
                  <span class="s-cta-copy__logo-glow"></span>
                  <img
                    src="/ben10/ben10-logo.png"
                    alt="Ben 10"
                    class="s-cta-copy__logo-img"
                  />
                </div>
              </div>
              <h2 class="s-cta-copy__title">
                {copy.value.ctaTitlePrefix}{" "}
                <span class="s-cta-copy__accent">
                  {copy.value.ctaTitleAccent}
                </span>
              </h2>
              <p class="s-cta-copy__desc">{copy.value.ctaDescription}</p>

              <div class="s-cta-copy__actions">
                <Link href="/contact" class="t-btn-primary">
                  {copy.value.ctaButton}
                </Link>
                <button
                  type="button"
                  onClick$={() => jumpToTier(spotlight.key)}
                  class="t-btn-ghost"
                >
                  Revisit {spotlight.label}
                </button>
              </div>
            </div>

            <aside class="s-cta-panel">
              <div class="s-cta-panel__ring"></div>
              <div class="s-cta-panel__header">
                <span class="s-cta-panel__label">Sponsor Focus</span>
                <span class="s-cta-panel__status">Live</span>
              </div>
              <strong class="s-cta-panel__value">{spotlight.label}</strong>
              <p class="s-cta-panel__text">
                Premium presence across venue touchpoints, digital placements,
                and community recall.
              </p>

              <div class="s-cta-panel__chips">
                <span class="s-cta-panel__chip">On-ground Presence</span>
                <span class="s-cta-panel__chip">Digital Reach</span>
                <span class="s-cta-panel__chip">Campus Recall</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sponsors | Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Explore the Theta 2026 sponsor hall and discover the brands powering the fest across platinum, gold, silver, and media tiers.",
    },
  ],
};
