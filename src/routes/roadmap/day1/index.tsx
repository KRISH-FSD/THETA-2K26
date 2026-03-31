import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

type Cat = "opening" | "tech" | "workshop" | "quiz" | "fun" | "cultural";

interface EventData {
  id: number;
  time: string;
  endTime: string;
  title: string;
  subtitle: string;
  venue: string;
  cat: Cat;
  desc: string;
  fee: string;
  team: string;
  prize: string;
  img: string;
  tags: string[];
}

interface CatMeta {
  label: string;
  short: string;
  color: string;
  rgb: string;
}

interface EventCardProps {
  ev: EventData;
  meta: CatMeta;
  isActive: boolean;
  canRegister: boolean;
  onToggle$: () => void;
}

const EVENTS: EventData[] = [
  {
    id: 1,
    time: "09:00 AM",
    endTime: "10:00 AM",
    title: "Inauguration Ceremony",
    subtitle: "Grand opening for Theta 2026",
    venue: "Main Auditorium, Block A",
    cat: "opening",
    fee: "Free",
    team: "Open to all",
    prize: "Opening showcase",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tags: ["Chief guest", "Theme reveal", "Campus launch"],
    desc: "The opening signal for Theta 2026 with the keynote address, launch visuals, and the first full crowd briefing of the fest.",
  },
  {
    id: 2,
    time: "10:00 AM",
    endTime: "01:00 PM",
    title: "Omnitrix Core Calibration",
    subtitle: "Fast AI and coding sprint",
    venue: "Galvan Prime Lab, Block C",
    cat: "tech",
    fee: "Rs 100 / team",
    team: "2 to 3 members",
    prize: "Rs 15,000",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tags: ["3-hour sprint", "Live leaderboard", "Logic battles"],
    desc: "A high-pressure build window where teams solve algorithmic and AI-flavored challenge sets under a live scoreboard.",
  },
  {
    id: 3,
    time: "10:00 AM",
    endTime: "12:00 PM",
    title: "Plumber Tactical Workshop",
    subtitle: "Hands-on cyber and systems lab",
    venue: "Plumber HQ, Block D",
    cat: "workshop",
    fee: "Rs 150 / head",
    team: "Individual",
    prize: "Certificate + kit",
    img: "https://images.unsplash.com/photo-1629835775533-31682702c256?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live demo", "Mentor-led", "Practice kit"],
    desc: "A guided workshop focused on cyber defense, AI-assisted system awareness, and practical security walkthroughs.",
  },
  {
    id: 4,
    time: "02:00 PM",
    endTime: "03:30 PM",
    title: "Null Void Navigator",
    subtitle: "Rapid-fire quiz arena",
    venue: "Sector 7G, Block B",
    cat: "quiz",
    fee: "Rs 50 / team",
    team: "2 members",
    prize: "Rs 5,000",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    tags: ["5 rounds", "30-second clock", "Buzzer mode"],
    desc: "A speed quiz that cuts across tech, innovation, science, and current affairs with almost no pause between rounds.",
  },
  {
    id: 5,
    time: "03:30 PM",
    endTime: "05:00 PM",
    title: "Galvan Pitch Arena",
    subtitle: "Startup and product strategy stage",
    venue: "Innovation Hall, Block A",
    cat: "tech",
    fee: "Rs 200 / team",
    team: "2 to 4 members",
    prize: "Rs 20,000 + mentoring",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
    tags: ["VC panel", "5-minute pitch", "Feedback loop"],
    desc: "Present your product idea to mentors and judges with a crisp story, sharp demo thinking, and real startup pressure.",
  },
  {
    id: 6,
    time: "05:00 PM",
    endTime: "06:30 PM",
    title: "Wildmutt Agility Run",
    subtitle: "Fast-paced fun challenge",
    venue: "Open Arena, Ground Floor",
    cat: "fun",
    fee: "Free",
    team: "Pairs",
    prize: "Trophies + goodies",
    img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Obstacle loop", "Pair sync", "Reflex zone"],
    desc: "A movement-based campus challenge where communication, timing, and instincts matter more than raw speed.",
  },
  {
    id: 7,
    time: "07:00 PM",
    endTime: "09:00 PM",
    title: "Day 1 Cultural Night",
    subtitle: "Open-air stage finale",
    venue: "Open-Air Amphitheatre",
    cat: "cultural",
    fee: "Free",
    team: "Open to all",
    prize: "Festival closeout",
    img: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=1200&auto=format&fit=crop",
    tags: ["Live band", "Dance block", "Comedy set"],
    desc: "The night wrap with music, campus performances, and a high-energy close to the first day of the roadmap.",
  },
];

const CATEGORY_META: Record<Cat, CatMeta> = {
  opening: {
    label: "Opening",
    short: "OP",
    color: "#d7ff4a",
    rgb: "215, 255, 74",
  },
  tech: { label: "Tech", short: "AI", color: "#63ff2c", rgb: "99, 255, 44" },
  workshop: {
    label: "Workshop",
    short: "WS",
    color: "#99ff4f",
    rgb: "153, 255, 79",
  },
  quiz: { label: "Quiz", short: "QZ", color: "#f3ff91", rgb: "243, 255, 145" },
  fun: { label: "Fun", short: "FN", color: "#b8ff57", rgb: "184, 255, 87" },
  cultural: {
    label: "Cultural",
    short: "CL",
    color: "#efffc8",
    rgb: "239, 255, 200",
  },
};

const HERO_METRICS = [
  { value: "07", label: "Events" },
  { value: "09:00", label: "Start" },
  { value: "SASTRA", label: "Venue" },
];

const HERO_PANEL_ITEMS = [
  { label: "Date", value: "15 March 2026" },
  { label: "Window", value: "09:00 AM - 09:00 PM" },
  { label: "Mode", value: "Ben 10 Theme" },
];

const EventCard = component$<EventCardProps>(
  ({ ev, meta, isActive, canRegister, onToggle$ }) => (
    <article
      class={["rm-card", isActive ? "is-active" : ""]}
      style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
      onClick$={onToggle$}
      onKeyDown$={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle$();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
    >
      <div class="rm-card__sheen"></div>
      <div class="rm-card__media">
        <img
          src={ev.img}
          alt={ev.title}
          width={1200}
          height={640}
          loading="lazy"
          class="rm-card__image"
        />
        <div class="rm-card__media-overlay"></div>
        <div class="rm-card__chip-row">
          <span class="rm-card__chip rm-card__chip--accent">
            <span class="rm-card__chip-dot"></span>
            {meta.label}
          </span>
          <span class="rm-card__chip">{ev.time}</span>
        </div>
        <div class="rm-card__eyebrow">
          <span>{ev.subtitle}</span>
          <span>{ev.endTime}</span>
        </div>
      </div>

      <div class="rm-card__body">
        <div class="rm-card__heading">
          <div>
            <p class="rm-card__overline">
              Node {String(ev.id).padStart(2, "0")}
            </p>
            <h3 class="rm-card__title">{ev.title}</h3>
          </div>
          <span class="rm-card__toggle">
            {isActive ? "Collapse" : "Expand"}
          </span>
        </div>

        <p class="rm-card__desc">{ev.desc}</p>

        <div class="rm-card__quick-meta">
          <span class="rm-card__meta-pill">{ev.venue}</span>
          <span class="rm-card__meta-pill">
            {ev.time} - {ev.endTime}
          </span>
        </div>

        <div class={["rm-card__details", isActive ? "is-open" : ""]}>
          <div class="rm-card__stat-grid">
            {[
              { label: "Entry", value: ev.fee },
              { label: "Team", value: ev.team },
              { label: "Reward", value: ev.prize },
            ].map((item) => (
              <div key={`${ev.id}-${item.label}`} class="rm-card__stat">
                <span class="rm-card__stat-label">{item.label}</span>
                <strong class="rm-card__stat-value">{item.value}</strong>
              </div>
            ))}
          </div>

          <div class="rm-card__tags">
            {ev.tags.map((tag) => (
              <span key={`${ev.id}-${tag}`} class="rm-card__tag">
                {tag}
              </span>
            ))}
          </div>

          <div class="rm-card__actions">
            <Link
              href="/events"
              class="rm-card__action rm-card__action--primary"
              onClick$={(event) => event.stopPropagation()}
            >
              View event hub
            </Link>
            {canRegister ? (
              <Link
                href="/events"
                class="rm-card__action rm-card__action--ghost"
                onClick$={(event) => event.stopPropagation()}
              >
                Register now
              </Link>
            ) : (
              <span class="rm-card__status">Open access</span>
            )}
          </div>
        </div>
      </div>
    </article>
  ),
);

export default component$(() => {
  const activeEventId = useSignal<number | null>(EVENTS[1]?.id ?? null);

  useVisibleTask$(({ track }) => {
    track(() => activeEventId.value);

    const container = document.getElementById("rm-timeline");
    const svgEl = document.getElementById(
      "rm-line-svg",
    ) as SVGSVGElement | null;
    const basePath = document.getElementById(
      "rm-line-base",
    ) as SVGPathElement | null;
    const accentPath = document.getElementById(
      "rm-line-accent",
    ) as SVGPathElement | null;
    const glowPath = document.getElementById(
      "rm-line-glow",
    ) as SVGPathElement | null;

    if (!container || !svgEl || !basePath || !accentPath || !glowPath) return;

    let pathLength = 0;
    let rafId = 0;
    let scheduled = false;
    let needsBuild = true;
    let settleTimer = 0;
    let resizeObserver: ResizeObserver | undefined;

    const rows = Array.from(container.querySelectorAll<HTMLElement>(".rm-row"));
    const media = Array.from(
      container.querySelectorAll<HTMLImageElement>("img"),
    );

    const getVisibleNodes = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>("[data-snake-node]"),
      ).filter(
        (node) =>
          node.getClientRects().length > 0 &&
          node.offsetWidth > 0 &&
          node.offsetHeight > 0,
      );

    const buildPath = () => {
      const visibleNodes = getVisibleNodes();
      if (visibleNodes.length < 2) return false;

      const containerRect = container.getBoundingClientRect();
      const width = Math.max(
        container.clientWidth,
        Math.ceil(containerRect.width),
      );
      const height = Math.max(container.scrollHeight, container.clientHeight);

      const points = visibleNodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });

      let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        const deltaY = current.y - previous.y;
        const bend = Math.max(42, Math.abs(deltaY) * 0.32);

        d += ` C ${previous.x.toFixed(2)} ${(previous.y + bend).toFixed(2)}, ${current.x.toFixed(2)} ${(current.y - bend).toFixed(2)}, ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
      }

      svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svgEl.setAttribute("width", String(width));
      svgEl.setAttribute("height", String(height));

      [basePath, accentPath, glowPath].forEach((path) => {
        path.setAttribute("d", d);
      });

      pathLength = basePath.getTotalLength();

      [basePath, accentPath, glowPath].forEach((path) => {
        path.style.strokeDasharray = `${pathLength}`;
      });

      return true;
    };

    const updateProgress = () => {
      if (!pathLength) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const raw = (viewportHeight * 0.82 - rect.top) / (rect.height * 0.95);
      const progress = Math.max(0, Math.min(1, raw));
      const dashOffset = pathLength * (1 - progress);

      basePath.style.strokeDashoffset = `${dashOffset}`;
      accentPath.style.strokeDashoffset = `${Math.max(0, dashOffset - 18)}`;
      glowPath.style.strokeDashoffset = `${dashOffset}`;

      rows.forEach((row, index) => {
        const threshold = (index / Math.max(rows.length - 1, 1)) * 0.9;
        row.classList.toggle("is-visible", progress >= threshold);
      });
    };

    const flush = () => {
      scheduled = false;

      if (needsBuild) {
        needsBuild = !buildPath();
      }

      if (!needsBuild) {
        updateProgress();
      }
    };

    const schedule = (rebuild = false) => {
      needsBuild = needsBuild || rebuild;
      if (scheduled) return;

      scheduled = true;
      rafId = window.requestAnimationFrame(flush);
    };

    const onScroll = () => schedule(false);
    const onResize = () => schedule(true);
    const onMediaLoad = () => schedule(true);

    media.forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", onMediaLoad);
      }
    });

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => schedule(true));
      resizeObserver.observe(container);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    settleTimer = window.setTimeout(() => schedule(true), 180);
    schedule(true);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (settleTimer) window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      media.forEach((image) => image.removeEventListener("load", onMediaLoad));
    };
  });

  const toggleEvent = $((eventId: number) => {
    activeEventId.value = activeEventId.value === eventId ? null : eventId;
  });

  return (
    <div class="rm-page">
      <div class="rm-page__aurora rm-page__aurora--left"></div>
      <div class="rm-page__aurora rm-page__aurora--right"></div>
      <div class="rm-page__mesh"></div>

      <section class="rm-hero">
        <div class="rm-shell rm-hero__layout">
          <div class="rm-hero__content">
            <span class="rm-pill rm-pill--primary">Ben 10 mode</span>
            <p class="rm-hero__kicker">Theta 2026 | Day 1</p>
            <h1 class="rm-hero__title">Day 1 Roadmap</h1>
            <p class="rm-hero__copy">
              Fast, clean schedule view for the full Day 1 event flow.
            </p>

            <div class="rm-hero__actions">
              <a href="#roadmap-timeline" class="rm-button rm-button--primary">
                View roadmap
              </a>
              <Link href="/events" class="rm-button rm-button--ghost">
                All events
              </Link>
            </div>

            <div class="rm-hero__metric-grid">
              {HERO_METRICS.map((metric) => (
                <div key={metric.label} class="rm-metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div class="rm-hero__panel">
            <div class="rm-scan-card">
              <div class="rm-scan-card__top">
                <div class="rm-scan-card__logo-wrap">
                  <img
                    src="/ben10/ben10-logo.png"
                    alt="Ben 10"
                    width={160}
                    height={160}
                    class="rm-scan-card__logo"
                  />
                </div>
                <div class="rm-scan-card__stack">
                  <span class="rm-pill">Omnitrix track</span>
                  <h2 class="rm-scan-card__title">Mission Board</h2>
                  <p class="rm-scan-card__text">
                    Short roadmap view with Ben 10 styling and quick event
                    access.
                  </p>
                </div>
              </div>

              <div class="rm-scan-card__list">
                {HERO_PANEL_ITEMS.map((item) => (
                  <div key={item.label} class="rm-scan-card__item">
                    <p class="rm-scan-card__item-label">{item.label}</p>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap-timeline" class="rm-section">
        <div class="rm-shell">
          <div class="rm-section__header">
            <span class="rm-pill">Timeline</span>
            <h2 class="rm-section__title">Day 1 event flow</h2>
            <p class="rm-section__copy">
              Open any card for the needed details.
            </p>
          </div>

          <div id="rm-timeline" class="rm-timeline">
            <svg
              id="rm-line-svg"
              class="rm-line-svg"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="rm-line-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="#d9ff4a" />
                  <stop offset="55%" stop-color="#63ff2c" />
                  <stop offset="100%" stop-color="#f4ff9b" />
                </linearGradient>
                <linearGradient
                  id="rm-line-core-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="45%" stop-color="#efffc8" />
                  <stop offset="100%" stop-color="#d7ff4a" />
                </linearGradient>
                <filter
                  id="rm-line-glow-filter"
                  x="-30%"
                  y="-10%"
                  width="160%"
                  height="130%"
                >
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                id="rm-line-glow"
                class="rm-line-glow"
                fill="none"
                stroke="url(#rm-line-gradient)"
              />
              <path
                id="rm-line-base"
                class="rm-line-base"
                fill="none"
                stroke="url(#rm-line-gradient)"
              />
              <path
                id="rm-line-accent"
                class="rm-line-accent"
                fill="none"
                stroke="url(#rm-line-core-gradient)"
                filter="url(#rm-line-glow-filter)"
              />
            </svg>

            {EVENTS.map((event, index) => {
              const meta = CATEGORY_META[event.cat];
              const alignLeft = index % 2 === 0;
              const isActive = activeEventId.value === event.id;
              const canRegister =
                event.cat !== "opening" && event.cat !== "cultural";

              return (
                <div
                  key={event.id}
                  class={[
                    "rm-row",
                    alignLeft ? "rm-row--left" : "rm-row--right",
                  ]}
                >
                  <div class="rm-row__panel rm-row__panel--left">
                    {alignLeft ? (
                      <EventCard
                        ev={event}
                        meta={meta}
                        isActive={isActive}
                        canRegister={canRegister}
                        onToggle$={() => toggleEvent(event.id)}
                      />
                    ) : null}
                  </div>

                  <div class="rm-row__spine">
                    <div
                      class={[
                        "rm-node-lane",
                        alignLeft
                          ? "rm-node-lane--left"
                          : "rm-node-lane--right",
                      ]}
                    >
                      <div
                        class="rm-node"
                        style={`--rm-accent:${meta.color};--rm-accent-rgb:${meta.rgb};`}
                        data-snake-node=""
                      >
                        <span class="rm-node__pulse"></span>
                        <span class="rm-node__halo"></span>
                        <span class="rm-node__code">{meta.short}</span>
                        <span class="rm-node__time">{event.time}</span>
                      </div>
                    </div>
                  </div>

                  <div class="rm-row__panel rm-row__panel--right">
                    {!alignLeft ? (
                      <EventCard
                        ev={event}
                        meta={meta}
                        isActive={isActive}
                        canRegister={canRegister}
                        onToggle$={() => toggleEvent(event.id)}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div class="rm-row rm-row--final is-visible">
              <div class="rm-row__panel rm-row__panel--left"></div>
              <div class="rm-row__spine">
                <div class="rm-node-lane rm-node-lane--center">
                  <div class="rm-node rm-node--finish" data-snake-node="">
                    <span class="rm-node__pulse"></span>
                    <span class="rm-node__halo"></span>
                    <span class="rm-node__code">END</span>
                    <span class="rm-node__time">09:00 PM</span>
                  </div>
                </div>
              </div>
              <div class="rm-row__panel rm-row__panel--right">
                <div class="rm-end-card">
                  <span class="rm-pill">Finish</span>
                  <h3>Day 1 completed.</h3>
                  <p>Day 2 starts at 09:00 AM.</p>
                  <div class="rm-end-card__meta">
                    <span>Next sync ready</span>
                    <Link href="/events">Open events</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="rm-dock">
        <div class="rm-dock__inner">
          <Link href="/roadmap/day1" class="rm-dock__item is-active">
            Day 1
          </Link>
          <span class="rm-dock__item is-disabled">Day 2 soon</span>
          <span class="rm-dock__item is-disabled">Day 3 soon</span>
          <span class="rm-dock__status">
            <span class="rm-dock__status-dot"></span>
            Ben 10 theme
          </span>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Day 1 Roadmap | Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Explore the redesigned Day 1 roadmap for Theta 2026 with a responsive curved timeline, modern event cards, and AI-inspired hero content.",
    },
  ],
};
