import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { gsap } from "gsap";

type DayLabel = "Day 1" | "Day 2" | "Day 3";
type EventTheme = "innovation" | "logic" | "creative" | "fun" | "sports";

interface ClusterEventInput {
  name: string;
  time: string;
  venue: string;
  activities: string[];
}

interface DayCluster {
  cluster: string;
  events: ClusterEventInput[];
}

interface Event {
  id: number;
  name: string;
  cluster: string;
  theme: EventTheme;
  day: DayLabel;
  timing: string;
  location: string;
  description: string;
  image: string;
  activities: string[];
}

const DAY_ORDER: DayLabel[] = ["Day 1", "Day 2", "Day 3"];
const ALL_CLUSTERS = "All Clusters";

const themeStyles: Record<
  EventTheme,
  { border: string; glow: string; badge: string; ring: string }
> = {
  innovation: {
    border: "border-[#00d4ff]/40",
    glow: "rgba(0,212,255,0.25)",
    badge: "bg-[#00d4ff] text-black",
    ring: "#00d4ff",
  },
  logic: {
    border: "border-[#bf5af2]/40",
    glow: "rgba(191,90,242,0.25)",
    badge: "bg-[#bf5af2] text-white",
    ring: "#bf5af2",
  },
  creative: {
    border: "border-[#ff9500]/40",
    glow: "rgba(255,149,0,0.25)",
    badge: "bg-[#ff9500] text-black",
    ring: "#ff9500",
  },
  fun: {
    border: "border-[#0ea935]/40",
    glow: "rgba(14,169,53,0.25)",
    badge: "bg-[#0ea935] text-black",
    ring: "#0ea935",
  },
  sports: {
    border: "border-[#ff375f]/40",
    glow: "rgba(255,55,95,0.25)",
    badge: "bg-[#ff375f] text-white",
    ring: "#ff375f",
  },
};

const clusterThemeMap: Record<string, EventTheme> = {
  BIOGENISIS: "logic",
  MATHEMATICA: "logic",
  STRATEGIA: "innovation",
  ACCESS: "innovation",
  INFORMATICA: "innovation",
  OPTICA: "logic",
  PODHIGAI: "creative",
  "VINODHA VAHINI": "fun",
  ELECTRONICA: "innovation",
  ROBOTICS: "innovation",
  SPORTIVA: "sports",
};

const themeImageMap: Record<EventTheme, string> = {
  innovation:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
  logic:
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000",
  creative:
    "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1000",
  fun:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000",
  sports:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000",
};

const scheduleByDay: Record<DayLabel, DayCluster[]> = {
  "Day 1": [
    {
      cluster: "BIOGENISIS",
      events: [
        {
          name: "FunKart",
          time: "2 PM - 5 PM",
          venue: "IED Hall",
          activities: ["Focus Freaks", "Zero Vision Zone", "Error Hunt"],
        },
        {
          name: "Bio Architect",
          time: "10 AM - 1 PM",
          venue: "IED Hall",
          activities: [],
        },
      ],
    },
    {
      cluster: "MATHEMATICA",
      events: [
        {
          name: "FInfinity",
          time: "11 AM - 4 PM",
          venue: "Room 203",
          activities: [
            "Act it - Guess it - Win it",
            "Think Fast Move Smart",
            "Clue Connection",
          ],
        },
        {
          name: "Infinity Beats",
          time: "11 AM - 4 PM",
          venue: "Room 211",
          activities: ["Balance Blitz", "Tap & Drop", "Spin & Solve"],
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "Venture Forge Hackathon",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          activities: [
            "Problem Identification",
            "Marketing Solution Design",
            "Pitch",
          ],
        },
      ],
    },
    {
      cluster: "ACCESS",
      events: [
        {
          name: "IRON FIST AI",
          time: "11 AM - 1 PM",
          venue: "Room 410",
          activities: [
            "Mini Militia Team Battle",
            "Memory Relay",
            "Vision Challenge",
          ],
        },
      ],
    },
    {
      cluster: "INFORMATICA",
      events: [
        {
          name: "Edit Blitz",
          time: "11:15 AM - 1:45 PM",
          venue: "Lab",
          activities: [],
        },
      ],
    },
    {
      cluster: "OPTICA",
      events: [
        {
          name: "Optica Event 1",
          time: "11 AM - 1 PM",
          venue: "Room 310",
          activities: [
            "Physics Freeze Game",
            "Binary Code Game",
            "Bernoulli Binary Blast",
          ],
        },
      ],
    },
    {
      cluster: "PODHIGAI",
      events: [
        {
          name: "AI Prompt App Creation",
          time: "11:30 AM - 1 PM",
          venue: "Room 110",
          activities: [],
        },
        {
          name: "Tech Fun Fusion",
          time: "2 PM - 3:30 PM",
          venue: "Room 110",
          activities: ["Connect the Tech", "Meme Creation"],
        },
      ],
    },
    {
      cluster: "VINODHA VAHINI",
      events: [
        {
          name: "Treasure Hunt",
          time: "2 PM - 4 PM",
          venue: "Room 406",
          activities: [],
        },
      ],
    },
    {
      cluster: "ELECTRONICA",
      events: [
        {
          name: "Tech Startup Challenge",
          time: "11 AM - 2 PM",
          venue: "Room 402",
          activities: ["Tech Spark", "Design & Develop", "Start-up Showcase"],
        },
      ],
    },
    {
      cluster: "ROBOTICS",
      events: [
        {
          name: "Maze Bot",
          time: "11 AM - 1 PM",
          venue: "ECE Lab",
          activities: [],
        },
        {
          name: "Sumo Bot",
          time: "2 PM - 4 PM",
          venue: "ECE Lab",
          activities: [],
        },
      ],
    },
    {
      cluster: "SPORTIVA",
      events: [
        {
          name: "Sports Events",
          time: "11 AM - 2 PM",
          venue: "Basketball Court",
          activities: ["Football", "Spin & Bowl", "Match the Bottle"],
        },
      ],
    },
  ],
  "Day 2": [
    {
      cluster: "BIOGENISIS",
      events: [
        {
          name: "Clash of Champions",
          time: "10 AM - 1 PM",
          venue: "IED Hall",
          activities: [
            "Cup Stack Game",
            "Ping Pong Bounce",
            "Fast Word / Movie / Song",
          ],
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "Non Technical Arena",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          activities: ["Cup Tower", "Mystery Box", "Bidding Challenge"],
        },
      ],
    },
    {
      cluster: "ACCESS",
      events: [
        {
          name: "Technical Vibe",
          time: "2 PM - 4 PM",
          venue: "Room 410",
          activities: ["Prompt Engineering", "AI Trailer", "QR Rhapsody"],
        },
      ],
    },
    {
      cluster: "INFORMATICA",
      events: [
        {
          name: "Ctrl + Build + Win",
          time: "10 AM - 1 PM",
          venue: "Lab",
          activities: [],
        },
      ],
    },
    {
      cluster: "OPTICA",
      events: [
        {
          name: "Optica Event 2",
          time: "9:30 AM - 11:30 AM",
          venue: "Room 310",
          activities: ["Number Grid Race", "Memory Snap", "Gravity Defier"],
        },
      ],
    },
    {
      cluster: "PODHIGAI",
      events: [
        {
          name: "Fun Event",
          time: "10 AM - 11:30 AM",
          venue: "Room 110",
          activities: ["Dizzy Balance", "Comedy Number Remix", "Memory Flip"],
        },
      ],
    },
    {
      cluster: "ELECTRONICA",
      events: [
        {
          name: "Tech Mayhem",
          time: "10 AM - 1 PM",
          venue: "Room 402",
          activities: ["Real or Fake Tech", "Resistor Rush", "Memory Match"],
        },
      ],
    },
    {
      cluster: "SPORTIVA",
      events: [
        {
          name: "Sports Events",
          time: "11 AM - 2 PM",
          venue: "Basketball Court",
          activities: ["One Over Cricket", "Mind on Leg", "Lucky Box"],
        },
      ],
    },
  ],
  "Day 3": [
    {
      cluster: "MATHEMATICA",
      events: [
        {
          name: "Game Events",
          time: "9 AM - 3 PM",
          venue: "Room 202",
          activities: [
            "Ladder Game",
            "Brain Bid Battle",
            "Math Royale",
            "Digit Decoder",
          ],
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "Stock Wars",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          activities: ["Market Entry", "News Impact", "Market Shock"],
        },
      ],
    },
    {
      cluster: "ACCESS",
      events: [
        {
          name: "Funverse",
          time: "11 AM - 1 PM",
          venue: "Room 410/411",
          activities: ["Imposter Arc", "Chaos Carnival", "MegaVerse Battle"],
        },
      ],
    },
    {
      cluster: "INFORMATICA",
      events: [
        {
          name: "Clash of Codes",
          time: "10 AM - 1 PM",
          venue: "Lab",
          activities: ["Warm Up", "Challenge", "Final Showdown"],
        },
      ],
    },
    {
      cluster: "OPTICA",
      events: [
        {
          name: "Optica Event 3",
          time: "9:30 AM - 11:30 AM",
          venue: "Room 310",
          activities: ["Sonar Sprint", "Hopscotch Pyramid", "Hoops & Scoops"],
        },
      ],
    },
    {
      cluster: "ROBOTICS",
      events: [
        {
          name: "Hackathon",
          time: "11 AM - 1 PM",
          venue: "Room 106",
          activities: [],
        },
      ],
    },
    {
      cluster: "ELECTRONICA",
      events: [
        {
          name: "ThinkZone Challenge",
          time: "10 AM - 1 PM",
          venue: "Room 402",
          activities: ["Artistic", "Kandupidi", "Scavenger Hunt"],
        },
      ],
    },
    {
      cluster: "SPORTIVA",
      events: [
        {
          name: "Sports Events",
          time: "11 AM - 2 PM",
          venue: "Basketball Court",
          activities: ["Basketball", "Pass the Ball", "Tug of War"],
        },
      ],
    },
  ],
};

const buildDescription = (
  cluster: string,
  name: string,
  location: string,
  activities: string[],
) => {
  if (!activities.length) {
    return `${cluster} presents ${name} at ${location}.`;
  }

  const preview = activities.slice(0, 2).join(", ");
  const extraCount = activities.length - 2;
  const extraText = extraCount > 0 ? ` and ${extraCount} more` : "";
  return `${cluster} presents ${name} at ${location} with ${preview}${extraText}.`;
};

const getActivityLabel = (activities: string[]) => {
  if (activities.length === 0) {
    return "Single event";
  }

  return activities.length === 1
    ? "1 activity"
    : `${activities.length} activities`;
};

const allEvents: Event[] = DAY_ORDER.flatMap((day) =>
  scheduleByDay[day].flatMap(({ cluster, events }) =>
    events.map((event) => {
      const theme = clusterThemeMap[cluster] ?? "innovation";

      return {
        id: 0,
        name: event.name,
        cluster,
        theme,
        day,
        timing: event.time,
        location: event.venue,
        description: buildDescription(
          cluster,
          event.name,
          event.venue,
          event.activities,
        ),
        image: themeImageMap[theme],
        activities: event.activities,
      };
    }),
  ),
).map((event, index) => ({ ...event, id: index + 1 }));

export default component$(() => {
  const selectedEvent = useSignal<Event | null>(null);
  const selectedDay = useSignal<DayLabel>("Day 1");
  const selectedCluster = useSignal<string>(ALL_CLUSTERS);
  const isFilterOpen = useSignal<boolean>(false);

  useVisibleTask$(({ track, cleanup }) => {
    track(() => selectedEvent.value);

    // Keydown for Modal Esc
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectedEvent.value = null;
    };
    if (selectedEvent.value) {
      document.body.style.overflow = "hidden";
    }
    document.addEventListener("keydown", onKeyDown);

    cleanup(() => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);

    // Reset cluster filter when day changes
    selectedCluster.value = ALL_CLUSTERS;
    isFilterOpen.value = false;

    // Global Theme Sync
    const themeStr = selectedDay.value === "Day 3" ? "spider" : selectedDay.value === "Day 2" ? "onepiece" : "default";
    document.body.setAttribute("data-theme", themeStr);

    // Animate cards on filter change
    gsap.fromTo(".event-card",
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", clearProps: "all" }
    );
  });

  useVisibleTask$(() => {
    // Dock entrance animation (from top)
    gsap.fromTo(".event-command-dock", 
      { y: "-150%", opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "power4.out"
      }
    );
  });


  const openEvent = $((event: Event) => {
    selectedEvent.value = event;
  });

  const closeEvent = $(() => {
    selectedEvent.value = null;
  });

  // Theme mappings
  const isDay2 = selectedDay.value === "Day 2";
  const isDay3 = selectedDay.value === "Day 3";
  
  const bgLogo = isDay3 ? "/spidy/image.png" : isDay2 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png";
  const bgGlowColor = isDay3 ? "#ef4444" : isDay2 ? "#eab308" : "#0ea935";
  const tc = isDay3 ? "239, 68, 68" : isDay2 ? "234, 179, 8" : "14, 169, 53";
  const tcLight = isDay3 ? "252, 165, 165" : isDay2 ? "253, 224, 71" : "110, 255, 158";

  // Filter events based on selected day and active cluster
  const eventsForSelectedDay = allEvents.filter((e) => e.day === selectedDay.value);
  const availableClusters = [ALL_CLUSTERS, ...new Set(eventsForSelectedDay.map((e) => e.cluster))];
  
  const filteredEvents = eventsForSelectedDay.filter(
    (e) => selectedCluster.value === ALL_CLUSTERS || e.cluster === selectedCluster.value
  );

  return (
    <div 
      class="relative mx-auto min-h-screen w-full px-4 pt-64 pb-20 sm:px-6 lg:px-8 font-sans bg-[#050505] overflow-hidden"
      style={{
        '--tc': tc,
        '--tc-light': tcLight,
        '--theme-glow': isDay3 ? 'rgba(239, 68, 68, 0.4)' : isDay2 ? 'rgba(234, 179, 8, 0.4)' : 'rgba(14, 169, 53, 0.4)'
      }}
    >
      <style>{`
        .omnitrix-bg-shell {
          position: relative;
        }

        .omnitrix-bg-image {
          opacity: 0.12;
          filter:
            drop-shadow(0 0 18px rgba(var(--tc-light), 0.08))
            drop-shadow(0 0 42px rgba(var(--tc), 0.08))
            drop-shadow(0 0 88px rgba(var(--tc), 0.04));
          transform: translateZ(0);
        }

        .omnitrix-bg-core {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          mix-blend-mode: screen;
          filter:
            saturate(1.18)
            brightness(1.12)
            contrast(1.08)
            drop-shadow(0 0 18px rgba(110, 255, 158, 0.12))
            drop-shadow(0 0 46px rgba(14, 169, 53, 0.12))
            drop-shadow(0 0 96px rgba(14, 169, 53, 0.08));
            drop-shadow(0 0 18px rgba(var(--tc-light), 0.12))
            drop-shadow(0 0 46px rgba(var(--tc), 0.12))
            drop-shadow(0 0 96px rgba(var(--tc), 0.08));
          animation: omnitrixWatchBlink 5s ease-in-out infinite;
          transform: translateZ(0);
        }

        @keyframes omnitrixWatchBlink {
          0%, 80%, 100% {
            opacity: 0.18;
            filter:
              saturate(1.18)
              brightness(1.12)
              contrast(1.08)
              drop-shadow(0 0 18px rgba(var(--tc-light), 0.12))
              drop-shadow(0 0 46px rgba(var(--tc), 0.12))
              drop-shadow(0 0 96px rgba(var(--tc), 0.08));
          }

          86% {
            opacity: 0.26;
            filter:
              saturate(1.32)
              brightness(1.24)
              contrast(1.12)
              drop-shadow(0 0 24px rgba(var(--tc-light), 0.18))
              drop-shadow(0 0 58px rgba(var(--tc), 0.18))
              drop-shadow(0 0 124px rgba(var(--tc), 0.12));
          }

          90% {
            opacity: 0.21;
            filter:
              saturate(1.22)
              brightness(1.16)
              contrast(1.09)
              drop-shadow(0 0 20px rgba(var(--tc-light), 0.14))
              drop-shadow(0 0 50px rgba(var(--tc), 0.14))
              drop-shadow(0 0 104px rgba(var(--tc), 0.1));
          }

          94% {
            opacity: 0.3;
            filter:
              saturate(1.42)
              brightness(1.32)
              contrast(1.14)
              drop-shadow(0 0 28px rgba(var(--tc-light), 0.22))
              drop-shadow(0 0 70px rgba(var(--tc), 0.2))
              drop-shadow(0 0 140px rgba(var(--tc), 0.14));
          }
        }

        .event-command-dock {
          transform: translateY(-150%);
          will-change: transform;
        }

        .dock-item-active {
          box-shadow: 
            0 0 20px var(--theme-glow),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
      {/* Background Parallax Layer */}
      <div id="parallax-bg-container" class="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Deep shadow / glow behind logo */}
        <div class="absolute w-[60vw] h-[60vw] opacity-[0.05] blur-[150px] rounded-full mix-blend-screen" style={`background-color: ${bgGlowColor};`}></div>
        <div class="omnitrix-bg-shell flex items-center justify-center transition-all duration-700">
          <img
            id="parallax-bg-image"
            src={bgLogo}
            alt="Theme Background Logo"
            key={bgLogo + "-1"}
            class="omnitrix-bg-image w-[90vw] sm:w-[50vw] object-contain contrast-150 grayscale mix-blend-screen scale-110"
            style="transition: all 0.7s ease;"
          />
          <img
            src={bgLogo}
            alt=""
            aria-hidden="true"
            key={bgLogo + "-2"}
            class="omnitrix-bg-core w-[90vw] sm:w-[50vw] object-contain scale-110"
            style="transition: all 0.7s ease;"
          />
        </div>
      </div>

      {/* Events Grid – Ben 10 Premium Cards */}
      <div class="relative z-10 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {filteredEvents.map((event) => {
          const baseC = themeStyles[event.theme];
          const c = isDay3 
            ? { border: "border-[#ef4444]/40", glow: "rgba(239,68,68,0.25)", badge: "bg-[#ef4444] text-white", ring: "#ef4444" } 
            : isDay2 
            ? { border: "border-[#eab308]/40", glow: "rgba(234,179,8,0.25)", badge: "bg-[#eab308] text-black", ring: "#eab308" } 
            : baseC;

          return (
            <div
              key={event.id}
              onClick$={() => openEvent(event)}
              data-cat={event.theme}
              class={`event-card group relative flex flex-col rounded-[1.75rem] overflow-hidden cursor-pointer border ${c.border} bg-[#06090a] transition-all duration-500 hover:-translate-y-3`}
              style={`transition: box-shadow 0.4s ease, transform 0.4s ease;`}
            >
              {/* Animated glowing bottom border line */}
              <div class="absolute bottom-0 left-0 right-0 h-[2px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={`background: linear-gradient(90deg, transparent, ${c.ring}, transparent);`}></div>

              {/* === TOP IMAGE HALF === */}
              <div class="relative h-52 w-full overflow-hidden flex-shrink-0">

                {/* Image */}
                <img
                  src={event.image}
                  alt={event.name}
                  class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.55] group-hover:brightness-[0.8]"
                  loading="lazy"
                />

                {/* Scanline sweep */}
                <div class="card-scanline"></div>

                {/* Bottom gradient fade into card */}
                <div class="absolute inset-0 bg-gradient-to-t from-[#06090a] via-[#06090a]/40 to-transparent z-10"></div>

                {/* Hover full-card color glow overlay */}
                <div class="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-10"
                  style={`background: radial-gradient(circle at 50% 80%, ${c.ring}55, transparent 70%);`}></div>

                {/* Omnitrix-style spinning rings centred on image */}
                <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div class="relative w-28 h-28">
                    <div class="absolute inset-0 rounded-full border-[1.5px] border-dashed animate-[spin_6s_linear_infinite]"
                      style={`border-color: ${c.ring}60;`}></div>
                    <div class="absolute inset-3 rounded-full border animate-[spin_10s_linear_infinite_reverse]"
                      style={`border-color: ${c.ring}40;`}></div>
                    <div class="absolute inset-6 rounded-full border-[1.5px] border-dashed animate-[spin_14s_linear_infinite]"
                      style={`border-color: ${c.ring}30;`}></div>
                    {/* Centre dot */}
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-4 h-4 rounded-full animate-pulse"
                        style={`background: ${c.ring}; box-shadow: 0 0 12px 4px ${c.ring}80;`}></div>
                    </div>
                  </div>
                </div>

                {/* Category badge */}
                <span class={`absolute top-4 left-4 z-30 max-w-[65%] truncate rounded-full px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest shadow-lg ${c.badge}`}>
                  {event.cluster}
                </span>

                {/* Schedule indicator */}
                <span class="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1 text-[0.6rem] font-black text-white uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0ea935] animate-pulse"></span>
                  Scheduled
                </span>

                {/* Day label bottom-left on image */}
                <span class="absolute bottom-3 left-4 z-30 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/50">
                  {event.day}
                </span>
              </div>

              {/* === BOTTOM CONTENT HALF === */}
              <div class="relative flex flex-col flex-1 p-5">

                {/* Subtle corner rings (always visible, bottom-right) */}
                <div class="absolute -bottom-10 -right-10 w-44 h-44 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-700">
                  <div class="absolute inset-0 rounded-full border border-dashed animate-[spin_12s_linear_infinite]"
                    style={`border-color: ${c.ring}50;`}></div>
                  <div class="absolute inset-5 rounded-full border animate-[spin_18s_linear_infinite_reverse]"
                    style={`border-color: ${c.ring}30;`}></div>
                  <div class="absolute inset-10 rounded-full border-dashed animate-[spin_24s_linear_infinite]"
                    style={`border-color: ${c.ring}20;`}></div>
                </div>

                {/* Event Name */}
                <h3 class="text-lg font-black text-white mb-2 tracking-tight leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {event.name}
                </h3>

                {/* Description */}
                <p class="text-white/50 text-xs leading-relaxed line-clamp-2 mb-4 font-medium">
                  {event.description}
                </p>

                {/* Meta chips */}
                <div class="mt-auto flex flex-wrap gap-2">
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.6rem] font-bold text-white/80 uppercase tracking-widest">
                    {event.timing}
                  </span>
                  <span class="rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest"
                    style={`border-color: ${c.ring}50; color: ${c.ring};`}>
                    {event.location}
                  </span>
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.6rem] font-bold text-white/80 uppercase tracking-widest">
                    {getActivityLabel(event.activities)}
                  </span>
                </div>

                {/* CTA arrow */}
                <div class="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-400">
                  <span class="text-xs font-bold uppercase tracking-widest" style={`color:${c.ring};`}>View Details</span>
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color:${c.ring};`}>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Command Dock — Moves naturally with scrolling */}
      <div class="event-command-dock absolute top-40 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <div class="relative flex items-center gap-2 p-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {DAY_ORDER.map((day) => (
            <button
              key={day}
              onClick$={() => (selectedDay.value = day)}
              class={[
                "relative flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
                selectedDay.value === day
                  ? "text-black dock-item-active"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5",
              ]}
            >
              {selectedDay.value === day && (
                <div class={[
                  "absolute inset-0 rounded-full z-0 bg-gradient-to-tr",
                  day === "Day 3" ? "from-[#ef4444] via-[#dc2626] to-[#f87171]" :
                  day === "Day 2" ? "from-[#eab308] via-[#ca8a04] to-[#fde047]" :
                  "from-[#0ea935] via-[#12cb42] to-[#8cff7a]"
                ]}></div>
              )}
              <span class="relative z-10">{day}</span>
            </button>
          ))}
          
          <div class="relative ml-2 pl-4 pr-1 py-1 border-l border-white/10 flex items-center gap-2">
            <button 
              onClick$={() => (isFilterOpen.value = !isFilterOpen.value)}
              class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <div class={["w-1.5 h-1.5 rounded-full animate-pulse", isDay3 ? "bg-[#ef4444]" : isDay2 ? "bg-[#eab308]" : "bg-[#0ea935]"]}></div>
              <span class="text-[0.6rem] font-bold text-white uppercase tracking-widest leading-none">
                {selectedCluster.value === ALL_CLUSTERS ? "Filter Clusters" : selectedCluster.value}
              </span>
              <svg class={["w-3 h-3 text-white/50 transition-transform", isFilterOpen.value ? "rotate-180" : ""]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isFilterOpen.value && (
              <div class="absolute top-full mt-3 right-0 w-48 py-2 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
                {availableClusters.map(cluster => (
                  <button
                    key={cluster}
                    onClick$={() => {
                      selectedCluster.value = cluster;
                      isFilterOpen.value = false;
                    }}
                    class={[
                      "w-full text-left px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-widest transition-colors",
                      selectedCluster.value === cluster 
                        ? (isDay3 ? "text-[#ef4444] bg-white/5" : isDay2 ? "text-[#eab308] bg-white/5" : "text-[#0ea935] bg-white/5")
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    ]}
                  >
                    {cluster}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════
            EVENT DETAILS MODAL — CINEMATIC BEN 10 EDITION
          ═══════════════════════════════════════════════════ */}
      {selectedEvent.value && (() => {
        const ev = selectedEvent.value!;
        const baseC = themeStyles[ev.theme];
        const c = isDay3 
          ? { border: "border-[#ef4444]/40", glow: "rgba(239,68,68,0.25)", badge: "bg-[#ef4444] text-white", ring: "#ef4444" } 
          : isDay2 
          ? { border: "border-[#eab308]/40", glow: "rgba(234,179,8,0.25)", badge: "bg-[#eab308] text-black", ring: "#eab308" } 
          : baseC;

        return (
          <div class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6">
            {/* Blurred backdrop */}
            <div
              class="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick$={closeEvent}
              aria-hidden="true"
            ></div>

            {/* Modal shell */}
            <div
              class={`relative z-20 w-full sm:max-w-5xl max-h-[94vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] border ${c.border} bg-[#06090a] shadow-2xl flex flex-col md:flex-row overflow-hidden modal-animate-in`}
              style={`box-shadow: 0 0 0 1px ${c.ring}30, 0 30px 80px -20px ${c.ring}40, 0 0 120px -30px ${c.glow};`}
            >


              {/* ── Animated colour top bar ── */}
              <div
                class="absolute top-0 left-0 right-0 h-[3px] z-40"
                style={`background: linear-gradient(90deg, transparent 0%, ${c.ring} 40%, ${c.ring}80 70%, transparent 100%); animation: barPulse 2.5s ease-in-out infinite;`}
              ></div>

              {/* ══════════ LEFT — IMAGE PANEL ══════════ */}
              <div class="relative w-full md:w-[42%] min-h-[240px] md:min-h-full flex-shrink-0 overflow-hidden">

                {/* Image */}
                <img
                  src={ev.image}
                  alt={ev.name}
                  class="absolute inset-0 w-full h-full object-cover brightness-[0.55] scale-105 modal-img-enter"
                />

                {/* Colour wash overlay */}
                <div
                  class="absolute inset-0 z-10"
                  style={`background: radial-gradient(ellipse at 40% 60%, ${c.ring}35 0%, transparent 65%), linear-gradient(180deg, rgba(6,9,10,0.05) 0%, rgba(6,9,10,0.75) 100%);`}
                ></div>

                {/* ── Minimal scan overlay: corner brackets + single scanline only ── */}
                <div class="absolute inset-0 z-20 pointer-events-none">

                  {/* Corner bracket — top-left */}
                  <div class="absolute top-4 left-4 w-7 h-7 opacity-70" style={`border-top: 2px solid ${c.ring}; border-left: 2px solid ${c.ring};`}></div>
                  {/* Corner bracket — top-right */}
                  <div class="absolute top-4 right-4 w-7 h-7 opacity-70" style={`border-top: 2px solid ${c.ring}; border-right: 2px solid ${c.ring};`}></div>
                  {/* Corner bracket — bottom-left */}
                  <div class="absolute bottom-[3.5rem] left-4 w-7 h-7 opacity-70" style={`border-bottom: 2px solid ${c.ring}; border-left: 2px solid ${c.ring};`}></div>
                  {/* Corner bracket — bottom-right */}
                  <div class="absolute bottom-[3.5rem] right-4 w-7 h-7 opacity-70" style={`border-bottom: 2px solid ${c.ring}; border-right: 2px solid ${c.ring};`}></div>

                  {/* Single horizontal scan line — slow top-to-bottom sweep */}
                  <div
                    class="absolute left-0 right-0 h-[1.5px] pointer-events-none modal-scan-line"
                    style={`background: linear-gradient(90deg, transparent 0%, ${c.ring}50 25%, ${c.ring}cc 50%, ${c.ring}50 75%, transparent 100%); box-shadow: 0 0 8px 3px ${c.ring}30;`}
                  ></div>
                </div>

                {/* Category badge */}
                <div class="absolute top-5 left-5 z-30 flex gap-2 items-center">
                  <span class={`max-w-[65%] truncate rounded-full px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest shadow-lg ${c.badge}`}>
                    {ev.cluster}
                  </span>
                  <span
                    class="rounded-full px-3 py-1.5 text-[0.65rem] font-bold border text-white/90 uppercase tracking-widest"
                    style={`border-color: ${c.ring}50; background: ${c.ring}12;`}
                  >
                    {getActivityLabel(ev.activities)}
                  </span>
                </div>

                {/* Day label at bottom */}
                <div class="absolute bottom-5 left-5 z-30">
                  <span class="text-white/40 text-[0.65rem] font-bold uppercase tracking-[0.25em]">{ev.day}</span>
                </div>

                {/* Scanline sweep */}
                <div
                  class="absolute inset-0 z-30 pointer-events-none"
                  style={`background: linear-gradient(180deg, transparent 0%, ${c.ring}08 50%, transparent 100%); animation: scanSweep 4s ease-in-out infinite;`}
                ></div>
              </div>

              {/* ══════════ RIGHT — DETAILS PANEL ══════════ */}
              <div class="relative z-10 flex flex-col flex-1 p-8 md:p-10 overflow-y-auto modal-scroll">

                {/* ── BEN 10 LOGO WATERMARK — right panel only, rotated to span full width ── */}
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                  <img
                    src="/ben10/ben10-logo.png"
                    alt=""
                    aria-hidden="true"
                    class="w-[160%] max-w-none object-contain select-none"
                    style="opacity: 0.04; transform: rotate(120deg); filter: grayscale(1) contrast(1.6); mix-blend-mode: screen;"
                  />
                </div>

                {/* Close button */}
                <button
                  onClick$={closeEvent}
                  class="absolute top-5 right-5 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2.5 transition-all duration-200 border border-white/5 z-40"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Event title */}
                <div class="mb-8 pr-10">
                  <p
                    class="text-[0.65rem] font-bold uppercase tracking-[0.25em] mb-3"
                    style={`color: ${c.ring};`}
                  >
                    Theta schedule / {ev.day}
                  </p>
                  <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-5">
                    {ev.name}
                  </h2>
                  <p class="text-white/55 text-sm leading-relaxed font-medium">
                    {ev.description}
                  </p>
                </div>

                {/* Divider line */}
                <div class="h-px bg-white/5 mb-8"></div>

                {/* Meta grid */}
                <div class="grid grid-cols-2 gap-3 mb-8">
                  {/* Location */}
                  <div
                    class="flex flex-col rounded-2xl p-4 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Venue</span>
                    </div>
                    <span class="font-bold text-white/90 text-sm">{ev.location}</span>
                  </div>

                  {/* Timing */}
                  <div
                    class="flex flex-col rounded-2xl p-4 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Timing</span>
                    </div>
                    <span class="font-bold text-white/90 text-sm">{ev.timing}</span>
                  </div>

                  {/* Cluster */}
                  <div
                    class="flex flex-col rounded-2xl p-4 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h10"></path>
                      </svg>
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Cluster</span>
                    </div>
                    <span class="font-bold text-white/90 text-sm">{ev.cluster}</span>
                  </div>

                  {/* Activities count */}
                  <div
                    class="flex flex-col rounded-2xl p-4 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v2m12-4h2a2 2 0 012 2v2M9 19H7a2 2 0 01-2-2v-2m12 4h2a2 2 0 002-2v-2"></path>
                      </svg>
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Activities</span>
                    </div>
                    <span
                      class="text-2xl font-black leading-none"
                      style={`color: ${c.ring}; text-shadow: 0 0 20px ${c.ring}60;`}
                    >
                      {ev.activities.length}
                    </span>
                  </div>
                </div>

                <div
                  class="relative overflow-hidden rounded-2xl border px-6 py-5"
                  style={`background: linear-gradient(135deg, ${c.ring}10 0%, ${c.ring}05 100%); border-color: ${c.ring}30; box-shadow: 0 0 30px ${c.ring}18;`}
                >
                  <div class="mb-4 flex items-center justify-between gap-3">
                    <span class="text-sm font-black uppercase tracking-[0.15em]" style={`color: ${c.ring};`}>
                      Activity Lineup
                    </span>
                    <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-white/70">
                      {getActivityLabel(ev.activities)}
                    </span>
                  </div>

                  {ev.activities.length > 0 ? (
                    <div class="flex flex-wrap gap-2">
                      {ev.activities.map((activity) => (
                        <span
                          key={activity}
                          class="rounded-full border px-3 py-1.5 text-[0.7rem] font-semibold text-white/90"
                          style={`border-color: ${c.ring}35; background: ${c.ring}14;`}
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p class="text-sm leading-relaxed text-white/72">
                      This event is listed as a standalone format without sub-activities.
                    </p>
                  )}
                </div>

                {/* Bottom corner rings decoration */}
                <div class="absolute -bottom-8 -right-8 w-40 h-40 pointer-events-none opacity-30 z-0">
                  <div
                    class="absolute inset-0 rounded-full border border-dashed animate-[spin_15s_linear_infinite]"
                    style={`border-color: ${c.ring}50;`}
                  ></div>
                  <div
                    class="absolute inset-6 rounded-full border animate-[spin_22s_linear_infinite_reverse]"
                    style={`border-color: ${c.ring}30;`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Events | Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Browse the Theta 2026 event schedule for Day 1, Day 2, and Day 3.",
    },
  ],
};
