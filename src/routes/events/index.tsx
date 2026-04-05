import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { gsap } from "gsap";

type DayLabel = "Day 1" | "Day 2" | "Day 3";
type EventTheme = "innovation" | "logic" | "creative" | "fun" | "sports";

interface ClusterEventInput {
  name: string;
  time: string;
  venue: string;
  focus: string;
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
  focus: string;
  day: DayLabel;
  timing: string;
  location: string;
  description: string;
  image: string;
  activities: string[];
}

const DAY_ORDER: DayLabel[] = ["Day 1", "Day 2", "Day 3"];
const ALL_CLUSTERS = "All Clusters";
const ALL_CATEGORIES = "All Categories";
const FOCUS_CATEGORIES = ["Fun", "Tech", "Non-Tech", "Learning", "Creative", "Sports"];

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
          focus: "Fun",
          activities: ["Focus Freaks", "Zero Vision Zone", "Error Hunt"],
        },
        {
          name: "Bio Architect",
          time: "10 AM - 1 PM",
          venue: "IED Hall",
          focus: "Learning",
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
          focus: "Non-Tech",
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
          focus: "Fun",
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
          focus: "Tech",
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
          focus: "Tech",
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
          focus: "Tech",
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
          focus: "Non-Tech",
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
          focus: "Tech",
          activities: [],
        },
        {
          name: "Tech Fun Fusion",
          time: "2 PM - 3:30 PM",
          venue: "Room 110",
          focus: "Fun",
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
          focus: "Fun",
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
          focus: "Tech",
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
          focus: "Tech",
          activities: [],
        },
        {
          name: "Sumo Bot",
          time: "2 PM - 4 PM",
          venue: "ECE Lab",
          focus: "Tech",
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
          focus: "Sports",
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
          focus: "Fun",
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
          focus: "Non-Tech",
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
          focus: "Tech",
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
          focus: "Tech",
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
          focus: "Learning",
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
          focus: "Fun",
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
          focus: "Tech",
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
          focus: "Sports",
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
          focus: "Fun",
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
          focus: "Tech",
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
          focus: "Fun",
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
          focus: "Tech",
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
          focus: "Learning",
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
          focus: "Tech",
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
          focus: "Creative",
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
          focus: "Sports",
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
        focus: event.focus,
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
  const selectedFocus = useSignal<string>(ALL_CATEGORIES);
  const tempCluster = useSignal<string>(ALL_CLUSTERS);
  const tempFocus = useSignal<string>(ALL_CATEGORIES);
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

    // Theme transition is now instant for better performance
    gsap.set(".event-card", { clearProps: "all" });
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


  const openFilter = $(() => {
    tempCluster.value = selectedCluster.value;
    tempFocus.value = selectedFocus.value;
    isFilterOpen.value = true;
  });

  const applyFilters = $(() => {
    selectedCluster.value = tempCluster.value;
    selectedFocus.value = tempFocus.value;
    isFilterOpen.value = false;
  });

  const openEvent = $((event: Event) => {
    selectedEvent.value = event;
  });

  const closeEvent = $(() => {
    selectedEvent.value = null;
  });

  const isDay2 = selectedDay.value === "Day 1" ? false : selectedDay.value === "Day 2";
  const isDay3 = selectedDay.value === "Day 3";

  const bgLogo = isDay3 ? "/spidy/spidy-event-bg" : isDay2 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png";
  const bgGlowColor = isDay3 ? "#ef4444" : isDay2 ? "#eab308" : "#0ea935";
  const tc = isDay3 ? "239, 68, 68" : isDay2 ? "234, 179, 8" : "14, 169, 53";
  const tcLight = isDay3 ? "252, 165, 165" : isDay2 ? "253, 224, 71" : "110, 255, 158";

  // Filter events based on selected day and active cluster
  const eventsForSelectedDay = allEvents.filter((e) => e.day === selectedDay.value);
  const availableClusters = [ALL_CLUSTERS, ...new Set(eventsForSelectedDay.map((e) => e.cluster))];
  const availableFocusForDay = [ALL_CATEGORIES, ...new Set(eventsForSelectedDay.map((e) => e.focus))];

  const filteredEvents = allEvents.filter((event) => {
    const dayMatch = event.day === selectedDay.value;
    const clusterMatch =
      selectedCluster.value === ALL_CLUSTERS ||
      event.cluster === selectedCluster.value;
    const focusMatch =
      selectedFocus.value === ALL_CATEGORIES ||
      event.focus === selectedFocus.value;
    return dayMatch && clusterMatch && focusMatch;
  });

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
          transform: translateZ(0); /* Hardware accelerate */
        }

        @media (min-width: 768px) {
          .omnitrix-bg-image {
            filter: none;
          }
        }

        .omnitrix-bg-core {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          mix-blend-mode: screen;
          animation: omnitrixWatchBlink 5s ease-in-out infinite;
          transform: translateZ(0);
          will-change: opacity;
        }

        @media (min-width: 768px) {
          .omnitrix-bg-core {
            filter: saturate(1.1) brightness(1.1) contrast(1);
          }
        }

        @keyframes omnitrixWatchBlink {
          0%, 80%, 100% {
            opacity: 0.15;
          }
          86% {
            opacity: 0.35;
          }
          90% {
            opacity: 0.20;
          }
          94% {
            opacity: 0.40;
          }
        }
        .modal-animate-in {
          animation: modalFloatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes modalFloatIn {
          0% { transform: translateY(20px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .cluster-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .cluster-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .cluster-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--tc), 0.3);
          border-radius: 10px;
        }
        .cluster-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--tc), 0.5);
        }

        /* Dropdown Pointer Arrow */
        .is-filter-open-arrow::after {
          content: "";
          position: absolute;
          top: -8.5px;
          right: 32px;
          width: 16px;
          height: 16px;
          background: #080a08;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          transform: rotate(45deg);
          z-index: 60;
        }
      `}</style>
      {/* Background Parallax Layer */}
      <div id="parallax-bg-container" class="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Deep shadow / glow behind logo */}
        <div class="absolute w-[80vw] h-[80vw] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen" style={`background-color: ${bgGlowColor};`}></div>
        <div class={["omnitrix-bg-shell flex items-center justify-center transition-all duration-700", !isDay3 && "animate-float"]}>
          <img
            id="parallax-bg-image"
            src={bgLogo}
            alt="Theme Background Logo"
            key={bgLogo + "-1"}
            class={[
              "transition-all duration-700",
              isDay3 
                ? "w-screen h-screen object-cover opacity-[0.14] scale-100 grayscale-0" 
                : "omnitrix-bg-image w-[90vw] sm:w-[50vw] object-contain contrast-110 grayscale-0 mix-blend-screen scale-110"
            ]}
            style={isDay3 ? "transition: none;" : "transition: all 0.7s ease;"}
          />
          {!isDay3 && (
            <img
              src={bgLogo}
              alt=""
              aria-hidden="true"
              key={bgLogo + "-2"}
              class="omnitrix-bg-core w-[90vw] sm:w-[50vw] object-contain scale-110"
              style="transition: all 0.7s ease;"
            />
          )}
        </div>
      </div>

      {/* Events Grid – Ben 10 Premium Cards */}
      <div class="relative z-10 mx-auto max-w-7xl px-2">
        {filteredEvents.length === 0 ? (
          <div class="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] px-6 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Themed Icon Circle */}
            <div
              class="relative w-24 h-24 sm:w-32 sm:h-32 mb-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
              style={`box-shadow: 0 0 40px ${bgGlowColor}20;`}
            >
              <div class="absolute inset-0 rounded-full animate-ping opacity-20" style={`background: ${bgGlowColor}; animation-duration: 3s;`}></div>
              <svg
                class="w-10 h-10 sm:w-14 sm:h-14 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                style={`color: ${bgGlowColor};`}
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            {/* Cinematic Text */}
            <h3 class="text-xl sm:text-3xl font-black text-white mb-3 uppercase tracking-widest">No Events Found</h3>
            <p class="max-w-md text-white/40 text-sm sm:text-base mb-10 leading-relaxed font-medium">
              We couldn't find any events matching your current filters for {selectedDay.value}. Try broadening your discovery.
            </p>

            {/* Reset CTA */}
            <button
              onClick$={() => {
                selectedCluster.value = ALL_CLUSTERS;
                selectedFocus.value = ALL_CATEGORIES;
              }}
              class="group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10 active:scale-95"
            >
              <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md" style={`background: ${bgGlowColor}30;`}></div>
              <span class="relative z-10 items-center flex gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Selection
              </span>
            </button>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => {
              const baseC = themeStyles[event.theme];
              const c = isDay3
                ? { border: "border-[#ef4444]/40", glow: "rgba(239,68,68,0.25)", badge: "bg-[#ef4444] text-white", ring: "#ef4444" }
                : isDay2
                  ? { border: "border-[#eab308]/40", glow: "rgba(234,179,8,0.25)", badge: "bg-[#eab308] text-black", ring: "#eab308" }
                  : { border: "border-[#0ea935]/40", glow: "rgba(14,169,53,0.25)", badge: "bg-[#0ea935] text-white", ring: "#0ea935" };

              return (
                <div
                  key={event.id}
                  onClick$={() => openEvent(event)}
                  data-cat={event.theme}
                  class={`event-card group relative flex flex-col rounded-[1.75rem] overflow-hidden cursor-pointer border ${c.border} bg-[#06090a] transition-all duration-500 md:hover:-translate-y-3`}
                  style={`transition: box-shadow 0.4s ease, transform 0.4s ease;`}
                >
                  {/* Animated glowing bottom border line */}
                  <div class="absolute bottom-0 left-0 right-0 h-[2px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={`background: linear-gradient(90deg, transparent, ${c.ring}, transparent);`}></div>

                  {/* === TOP IMAGE HALF === */}
                  <div class="relative h-52 w-full overflow-hidden flex-shrink-0">

                    {/* Image */}
                    <img
                      src={isDay3 ? "/spidy/spidy-event-bg" : isDay2 ? "https://images.unsplash.com/photo-1518837691861-152e4d31716b?q=80&w=1000" : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000"}
                      alt={event.name}
                      class={[
                        "absolute inset-0 h-full w-full object-cover brightness-[0.55] group-hover:brightness-[0.8]",
                        !isDay3 && "transition-transform duration-700 group-hover:scale-110"
                      ]}
                      loading="lazy"
                    />

                    {/* Scanline sweep */}
                    <div class="card-scanline"></div>

                    {/* Bottom gradient fade into card */}
                    <div class="absolute inset-0 bg-gradient-to-t from-[#06090a] via-[#06090a]/40 to-transparent z-10"></div>

                    {/* Hover full-card color glow overlay */}
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-10"
                      style={`background: radial-gradient(circle at 50% 80%, ${c.ring}55, transparent 70%);`}></div>


                    {/* Category badge */}
                    <div class="absolute top-4 left-4 z-30 flex flex-wrap gap-2 max-w-[80%]">
                      <span class={`rounded-full px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest shadow-lg ${c.badge}`}>
                        {event.cluster}
                      </span>
                      <span class="rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1 text-[0.6rem] font-black text-white uppercase tracking-widest shadow-lg">
                        {event.focus}
                      </span>
                    </div>

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

                    {/* CTA Button Actions */}
                    <div class="mt-5 flex flex-wrap gap-2 relative z-30 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-400">
                      <a href="/register" onClick$={(e) => e.stopPropagation()} class="flex-1 py-2.5 px-3 rounded-xl font-extrabold text-[0.65rem] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.03] active:scale-95 text-[#06090a]" style={`background: ${c.ring}; box-shadow: 0 0 16px ${c.ring}40;`}>
                        Register
                      </a>
                      <button class="flex-1 py-2.5 px-3 rounded-xl border font-bold text-[0.65rem] uppercase tracking-widest text-white transition-colors flex items-center justify-center hover:bg-white/10" style={`border-color: ${c.ring}30;`}>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Command Dock — Moves naturally with scrolling */}
      <div class="event-command-dock absolute top-32 sm:top-40 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-[28rem] sm:max-w-none sm:w-auto flex justify-center">
        <div class="relative flex h-12 sm:h-14 items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-black/60 p-1.5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)]">

          <div class="flex h-full items-center gap-1 sm:gap-2 pr-1">
            {DAY_ORDER.map((day) => (
              <button
                key={day}
                onClick$={() => (selectedDay.value = day)}
                class={[
                  "relative flex h-full min-w-[3.5rem] items-center justify-center rounded-full px-3 text-[0.6rem] font-black uppercase tracking-[0.15em] transition-all duration-300 sm:px-8 sm:text-[0.7rem] sm:tracking-widest",
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
          </div>

          <div class="flex h-8 items-center gap-1 border-l border-white/15 pl-1.5 sm:pl-4 sm:pr-2">
            <button
              onClick$={openFilter}
              class="flex items-center gap-2 rounded-full px-2 py-2 transition-colors hover:bg-white/10 sm:px-3"
            >
              <div class={["w-1.5 h-1.5 rounded-full animate-pulse shrink-0", isDay3 ? "bg-[#ef4444]" : isDay2 ? "bg-[#eab308]" : "bg-[#0ea935]"]}></div>
              <span class="text-[0.6rem] font-black uppercase tracking-[0.16em] leading-none text-white whitespace-nowrap sm:text-[0.68rem] sm:tracking-widest">
                {selectedCluster.value === ALL_CLUSTERS && selectedFocus.value === ALL_CATEGORIES ? "Filter" :
                  selectedCluster.value !== ALL_CLUSTERS ? selectedCluster.value : selectedFocus.value}
                <span class="hidden sm:inline ml-1">Clusters</span>
              </span>
              <svg class="w-3 h-3 text-white/50 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
            FILTER SELECTION MODAL — CINEMATIC FULLSCREEN
          ═══════════════════════════════════════════════════ */}
      {isFilterOpen.value && (
        <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          {/* Blurred backdrop with scale effect */}
          <div
            class="absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity animate-in fade-in duration-500"
            onClick$={() => (isFilterOpen.value = false)}
          ></div>

          {/* Modal Container */}
          <div class="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#080a0b]/80 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500">

            {/* Close Button */}
            <button
              onClick$={() => (isFilterOpen.value = false)}
              class="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Sidebar — Clusters */}
            <div class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 p-6 sm:p-10 pb-5 md:pb-24 overflow-y-auto cluster-scrollbar">
              <h3 class="mb-6 text-[0.75rem] font-black uppercase tracking-[0.3em] text-white/30">Select Cluster</h3>
              <div class="grid grid-cols-1 gap-2">
                {availableClusters.map(cluster => (
                  <button
                    key={cluster}
                    onClick$={() => (tempCluster.value = cluster)}
                    class={[
                      "group relative flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-300",
                      tempCluster.value === cluster
                        ? (isDay3 ? "bg-[#ef4444] text-white" : isDay2 ? "bg-[#eab308] text-black" : "bg-[#0ea935] text-white")
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    ]}
                  >
                    <span class="text-[0.65rem] font-black uppercase tracking-[0.2em]">{cluster}</span>
                    {tempCluster.value === cluster && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar — Categories */}
            <div class="w-full md:w-1/2 p-6 sm:p-10 pb-32 md:pb-24 overflow-y-auto cluster-scrollbar bg-black/20">
              <h3 class="mb-6 text-[0.75rem] font-black uppercase tracking-[0.3em] text-white/30">Discover Focus</h3>
              <div class="grid grid-cols-1 gap-2">
                {availableFocusForDay.map(focus => (
                  <button
                    key={focus}
                    onClick$={() => (tempFocus.value = focus)}
                    class={[
                      "group relative flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-300",
                      tempFocus.value === focus
                        ? (isDay3 ? "bg-[#ef4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" :
                          isDay2 ? "bg-[#eab308] text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]" :
                            "bg-[#0ea935] text-white shadow-[0_0_20px_rgba(14,169,53,0.4)]")
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    ]}
                  >
                    <span class="text-[0.65rem] font-black uppercase tracking-[0.2em]">{focus}</span>
                    {tempFocus.value === focus && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Bottom Sticky Apply Area */}
              <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-[#080a0b] via-[#080a0b] to-transparent z-40">
                <button
                  onClick$={applyFilters}
                  class="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[0.7rem] font-black uppercase tracking-[0.3em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  style={`background: ${bgGlowColor}; color: ${isDay2 ? "black" : "white"}; box-shadow: 0 0 30px ${bgGlowColor}40;`}
                >
                  Apply Filters
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════
            EVENT DETAILS MODAL — CINEMATIC THEME EDITION
          ═══════════════════════════════════════════════════ */}
      {selectedEvent.value && (() => {
        const ev = selectedEvent.value!;
        const baseC = themeStyles[ev.theme];
        const c = isDay3
          ? { border: "border-[#ef4444]/40", glow: "rgba(239,68,68,0.25)", badge: "bg-[#ef4444] text-white", ring: "#ef4444" }
          : isDay2
            ? { border: "border-[#eab308]/40", glow: "rgba(234,179,8,0.25)", badge: "bg-[#eab308] text-black", ring: "#eab308" }
            : { border: "border-[#0ea935]/40", glow: "rgba(14,169,53,0.25)", badge: "bg-[#0ea935] text-white", ring: "#0ea935" };

        return (
          <div class="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
            {/* Blurred backdrop */}
            <div
              class="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick$={closeEvent}
              aria-hidden="true"
            ></div>

            {/* Modal shell */}
            <div
              class={`relative z-20 w-full max-w-[94%] md:max-w-5xl max-h-[90dvh] md:max-h-[85vh] rounded-2xl md:rounded-[2.5rem] border ${c.border} bg-[#06090a] shadow-2xl flex flex-col md:flex-row overflow-hidden modal-animate-in`}
              style={`box-shadow: 0 0 0 1px ${c.ring}30, 0 10px 50px -15px ${c.ring}30, 0 0 120px -30px ${c.glow};`}
            >


              {/* ── Animated colour top bar ── */}
              <div
                class="absolute top-0 left-0 right-0 h-[3px] z-40"
                style={`background: linear-gradient(90deg, transparent 0%, ${c.ring} 40%, ${c.ring}80 70%, transparent 100%); animation: barPulse 2.5s ease-in-out infinite;`}
              ></div>

              {/* ══════════ LEFT — IMAGE PANEL ══════════ */}
              <div class="relative w-full md:w-[42%] flex-1 min-h-[180px] md:min-h-full md:flex-none overflow-y-auto md:overflow-hidden modal-scroll border-b border-white/10 md:border-none">

                {/* Mobile scrollable image container / Desktop absolute cover */}
                <div class="w-full min-h-[280px] md:absolute md:inset-0 flex flex-col justify-start">
                  <img
                    src={isDay3 ? "/spidy/spidy-event-bg" : isDay2 ? "https://images.unsplash.com/photo-1518837691861-152e4d31716b?q=80&w=1000" : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000"}
                    alt={ev.name}
                    class={[
                      "w-full h-auto md:h-full md:absolute md:inset-0 object-cover brightness-[0.55]",
                      !isDay3 && "transition-transform duration-700 hover:scale-[1.02] modal-img-enter"
                    ]}
                  />
                </div>

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
              <div class="relative z-10 flex flex-col flex-shrink md:flex-1 min-h-[250px] md:min-h-0 p-5 md:p-6 md:px-8 overflow-y-auto modal-scroll bg-[#06090a] pb-6">

                {/* ── THEME LOGO WATERMARK — right panel only ── */}
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                  <img
                    src={isDay3 ? "/spider_logo_icon_1775372083762.png" : isDay2 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png"}
                    alt=""
                    aria-hidden="true"
                    class="w-[160%] max-w-none object-contain select-none"
                    style="opacity: 0.04; transform: rotate(120deg); filter: grayscale(1) contrast(1.6); mix-blend-mode: screen;"
                  />
                </div>

                {/* Close button */}
                <button
                  onClick$={closeEvent}
                  class="absolute top-4 md:top-6 right-4 md:right-6 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all duration-200 border border-white/5 z-40"
                >
                  <svg class="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Event title */}
                <div class="mb-4 md:mb-5 pr-8 md:pr-10 flex-shrink-0">
                  <p
                    class="text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-[0.25em] mb-1"
                    style={`color: ${c.ring};`}
                  >
                    Theta schedule / {ev.day}
                  </p>
                  <h2 class="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-2 md:mb-3">
                    {ev.name}
                  </h2>
                  <p class="text-white/55 text-[0.7rem] md:text-xs leading-relaxed font-medium">
                    {ev.description}
                  </p>
                </div>

                {/* Divider line */}
                <div class="h-px bg-white/5 mb-4 md:mb-5 flex-shrink-0"></div>

                {/* Meta grid */}
                <div class="grid grid-cols-2 gap-2 mb-4 md:mb-5 flex-shrink-0">
                  {/* Location */}
                  <div
                    class="flex flex-col rounded-xl md:rounded-2xl p-3 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-1.5 mb-1.5">
                      <svg class="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="text-white/35 text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest">Venue</span>
                    </div>
                    <span class="font-bold text-white/90 text-xs md:text-sm">{ev.location}</span>
                  </div>

                  {/* Timing */}
                  <div
                    class="flex flex-col rounded-xl md:rounded-2xl p-3 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-1.5 mb-1.5">
                      <svg class="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-white/35 text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest">Timing</span>
                    </div>
                    <span class="font-bold text-white/90 text-xs md:text-sm">{ev.timing}</span>
                  </div>

                  {/* Cluster */}
                  <div
                    class="flex flex-col rounded-xl md:rounded-2xl p-3 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-1.5 mb-1.5">
                      <svg class="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h10"></path>
                      </svg>
                      <span class="text-white/35 text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest">Cluster</span>
                    </div>
                    <span class="font-bold text-white/90 text-xs md:text-sm">{ev.cluster}</span>
                  </div>

                  {/* Activities count */}
                  <div
                    class="flex flex-col rounded-xl md:rounded-2xl p-3 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-1.5 mb-1.5">
                      <svg class="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v2m12-4h2a2 2 0 012 2v2M9 19H7a2 2 0 01-2-2v-2m12 4h2a2 2 0 002-2v-2"></path>
                      </svg>
                      <span class="text-white/35 text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest">Activities</span>
                    </div>
                    <span
                      class="text-[1.35rem] md:text-xl font-black leading-none"
                      style={`color: ${c.ring}; text-shadow: 0 0 20px ${c.ring}60;`}
                    >
                      {ev.activities.length}
                    </span>
                  </div>
                </div>

                <div
                  class="relative overflow-hidden rounded-xl md:rounded-2xl border px-4 py-4 md:px-5 md:py-4 flex-shrink-0"
                  style={`background: linear-gradient(135deg, ${c.ring}10 0%, ${c.ring}05 100%); border-color: ${c.ring}30; box-shadow: 0 0 30px ${c.ring}18;`}
                >
                  <div class="flex items-start sm:items-center justify-between gap-3">
                    <span class="text-xs md:text-sm font-black uppercase tracking-[0.15em] leading-tight" style={`color: ${c.ring};`}>
                      Activity Lineup
                    </span>
                    <span class="rounded-full border border-white/10 bg-white/5 px-2 md:px-3 py-1 text-[0.55rem] font-bold uppercase tracking-widest text-white/70 whitespace-nowrap">
                      {getActivityLabel(ev.activities)}
                    </span>
                  </div>

                  {ev.activities.length > 0 && (
                    <div class="mt-3 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                      {ev.activities.map((activity) => (
                        <span
                          key={activity}
                          class="rounded-full border px-2.5 py-1 md:px-3 md:py-1.5 text-[0.6rem] font-semibold text-white/90"
                          style={`border-color: ${c.ring}35; background: ${c.ring}14;`}
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}

                  {ev.activities.length === 0 && (
                    <p class="mt-2 md:mt-2 text-[0.65rem] md:text-xs leading-relaxed text-white/60 font-medium">
                      This event is listed as a standalone format without separate track activities.
                    </p>
                  )}
                </div>

                {/* CTA Action Buttons */}
                <div class="mt-4 md:mt-5 flex flex-col sm:flex-row gap-2.5 md:gap-3 relative z-20 flex-shrink-0">
                  <a href="/register" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest text-[#06090a] transition-all duration-300 hover:scale-[1.02] active:scale-95" style={`background: ${c.ring}; box-shadow: 0 0 24px ${c.ring}50;`}>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Register Now
                  </a>
                  <button onClick$={closeEvent} class="sm:flex-1 py-3 rounded-xl border font-bold text-xs md:text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white/5 text-white/70" style={`border-color: ${c.ring}30;`}>
                    Close Panel
                  </button>
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
