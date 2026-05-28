import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import gsap from "gsap";

type DayLabel = "Day 1" | "Day 2" | "Day 3";
type EventTheme = "innovation" | "logic" | "creative" | "fun" | "sports";

interface ClusterEventInput {
  name: string;
  time: string;
  venue: string;
  focus: string;
  activities: string[];
  image?: string;
  regLink?: string;
  fee?: string;
  description?: string;
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
  regLink?: string;
  fee?: string;
}

const DAY_ORDER: DayLabel[] = ["Day 1", "Day 2", "Day 3"];
const ALL_CLUSTERS = "All Clusters";
const ALL_CATEGORIES = "All Categories";

const themeStyles: Record<
  EventTheme,
  { border: string; glow: string; badge: string; ring: string }
> = {
  innovation: { border: "border-[#00d4ff]/40", glow: "rgba(0,212,255,0.25)", badge: "bg-[#00d4ff] text-black", ring: "#00d4ff" },
  logic: { border: "border-[#bf5af2]/40", glow: "rgba(191,90,242,0.25)", badge: "bg-[#bf5af2] text-white", ring: "#bf5af2" },
  creative: { border: "border-[#ff9500]/40", glow: "rgba(255,149,0,0.25)", badge: "bg-[#ff9500] text-black", ring: "#ff9500" },
  fun: { border: "border-[#bef300]/40", glow: "rgba(191, 243, 0, 0.25)", badge: "bg-[#bef300] text-black", ring: "#bef300" },
  sports: { border: "border-[#ff375f]/40", glow: "rgba(255,55,95,0.25)", badge: "bg-[#ff375f] text-white", ring: "#ff375f" },
};

const clusterThemeMap: Record<string, EventTheme> = {
  BIOGENISIS: "logic", MATHEMATICA: "logic", STRATEGIA: "innovation", "ACCESS INDIA": "innovation",
  INFORMATICA: "innovation", OPTICA: "logic", EQUILIBRIA: "creative", "VINODHA VAHINI": "fun",
  ELECTRONICA: "innovation", "ROBOTICS CLUSTER": "innovation", SPORTIVA: "sports",
};

const themeImageMap: Record<EventTheme, string> = {
  innovation: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
  logic: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000",
  creative: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1000",
  fun: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000",
  sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000",
};

const scheduleByDay: Record<DayLabel, DayCluster[]> = {
  "Day 1": [
    {
      cluster: "BIOGENISIS",
      events: [
        {
          name: "Model Exhibition - BIO ARCHITECT",
          time: "11 AM - 2 PM",
          venue: "IED Hall",
          focus: "Learning",
          activities: ["Molecular cloning", "Reaction chemistry", "Human body science"],
          image: "/EVENTSPOSTERS/BIO-ARCHITECT.jpg",
          regLink: "https://forms.gle/6WUW1J79fncoE8Zt7",
          description: "Step into a world where science meets innovation! Topics include Molecular cloning, AI-Based Food Quality Detection, and IoT Smart Agriculture."
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
          activities: ["Act it - Guess it - Win it", "Think Fast Move Smart"],
          image: "/EVENTSPOSTERS/FUNFINITY.jpg",
        },
        {
          name: "Infinity Beats",
          time: "11 AM - 4 PM",
          venue: "Room 211",
          focus: "Fun",
          activities: ["Balance Blitz", "Tap & Drop", "Spin & Solve"],
          image: "/EVENTSPOSTERS/INFINITYBEATES.jpg",
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
          activities: ["Problem Identification", "Marketing Solution Design", "Pitch"],
          image: "/EVENTSPOSTERS/VENTUREFORGE.jpg",
          regLink: "https://forms.gle/pBETMEayh8sBm1Q69",
        },
      ],
    },
    {
      cluster: "ACCESS INDIA",
      events: [
        {
          name: "IRON FIST AI",
          time: "10:00 AM - 12:00 PM",
          venue: "ROOM NO.410",
          focus: "Tech",
          activities: ["Mini Militia Team Battle", "Memory Relay", "Vision Challenge"],
          image: "/EVENTSPOSTERS/IRONFIST.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSdbmoFbrB1bmYrfSQTIVNCjRTSDziAhSheJio7vq4YnrXUA5A/viewform",
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
          image: "/EVENTSPOSTERS/EDITBLITZ.jpg",
        },
      ],
    },
    {
      cluster: "OPTICA",
      events: [
        {
          name: "Physics Freeze Game",
          time: "11 AM - 1 PM",
          venue: "Room 310",
          focus: "Non-Tech",
          activities: ["Physics Freeze Game", "Binary Code Game"],
          image: "/EVENTSPOSTERS/PHYSICSFREEZE.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSeABawd4zOkl772rRy8v4HWKkHKmVOtEtJS5ma5WeettAcnww/viewform?usp=dialog",
        },
      ],
    },
    {
      cluster: "EQUILIBRIA",
      events: [
        {
          name: "AI prompt App Creation",
          time: "11:30 AM - 1 PM",
          venue: "Room 110",
          focus: "Tech",
          activities: [],
          image: "/EVENTSPOSTERS/AIPROMPT.jpg",
          regLink: "https://forms.gle/TEuppmExeMsJTLGSA",
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
          image: "/EVENTSPOSTERS/TRESUREHUNT.jpg",
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
          image: "/EVENTSPOSTERS/TECHSTARTUP.jpg",
          regLink: "https://forms.gle/vdZds3WZAW5Q7jJ96",
        },
      ],
    },
    {
      cluster: "ROBOTICS CLUSTER",
      events: [
        {
          name: "Gesture Controlled Bot",
          time: "11 AM - 1 PM",
          venue: "ECE Lab",
          focus: "Tech",
          activities: ["Bot Maze Run", "Gesture Calibration"],
          image: "/EVENTSPOSTERS/NAVIGATEOBSTRACLE.jpg",
          regLink: "https://forms.gle/CDKpnNqdNx85rvPi9",
        },
      ],
    },
    {
      cluster: "SPORTIVA",
      events: [
        {
          name: "Sportiva Mix",
          time: "11 AM - 4 PM",
          venue: "Ground",
          focus: "Sports",
          activities: ["Football", "Match the Bottle"],
          image: "/EVENTSPOSTERS/SPORTS.jpg",
        },
      ],
    },
  ],
  "Day 2": [
    {
      cluster: "BIOGENISIS",
      events: [
        {
          name: "FunKart",
          time: "2 PM - 5 PM",
          venue: "IED Hall",
          focus: "Fun",
          activities: ["Focus Freaks", "Zero Vision Zone", "Error Hunt"],
          image: "/EVENTSPOSTERS/FUNKART.jpg",
          regLink: "https://forms.gle/8k7SXNPL32wLh88C7",
        },
        {
          name: "CLASH OF CHAMPIONS",
          time: "10 AM - 1 PM",
          venue: "IED Hall",
          focus: "Fun",
          activities: [],
          image: "/EVENTSPOSTERS/CLASHOFCHAMPION.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSedXMiuvvk9rzOH9KBycJZ6HR56BkPP1lrNmgoQfV9eZUfIrw/viewform",
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "FunFusion Arena",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          focus: "Fun",
          activities: ["Gaming Challenges", "Strategy Puzzles"],
          image: "/EVENTSPOSTERS/FUNSUSIONARENA.jpg",
          regLink: "https://forms.gle/WQ9LPHHknA5keGKJ8",
        },
      ],
    },
    {
      cluster: "ACCESS INDIA",
      events: [
        {
          name: "VIBE IN PROMPT",
          time: "2:00 PM - 4:00 PM",
          venue: "ROOM NO.410",
          focus: "Tech",
          activities: ["Prompt Engineering", "AI Trailer", "QR Rhapsody"],
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSdM2ZwG7i8FtWrBiwbFg4GrMScIgcbJTBHWSLdvlj2R4QIg1w/viewform",
          image: "/EVENTSPOSTERS/VIBE IN PROMPT.jpg",
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
          image: "/EVENTSPOSTERS/CTRL+BUILD+WIN.jpg",
        },
      ],
    },
    {
      cluster: "OPTICA",
      events: [
        {
          name: "The Gravity Defier",
          time: "9:30 AM - 11:30 AM",
          venue: "Room 310",
          focus: "Learning",
          activities: ["Number Grid Race", "Memory Snap", "Gravity Defier"],
          image: "/EVENTSPOSTERS/GRAVITYDEFIER'.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSd1EzJorBtCHd79RyI4M14qd6MjS6az9tfgHONC7spq6CggNw/viewform",
        },
      ],
    },
    {
      cluster: "EQUILIBRIA",
      events: [
        {
          name: "Tech Fun Fusion",
          time: "2 PM - 3:30 PM",
          venue: "Room 110",
          focus: "Non-Tech",
          activities: ["Connect the Tech", "Meme Creation"],
          image: "/EVENTSPOSTERS/TECHFUNFUSION.jpg",
          regLink: "https://forms.gle/nSdmEU97op36WiDn7",
        },
      ],
    },
    {
      cluster: "ELECTRONICA",
      events: [
        {
          name: "Tech mayhem",
          time: "10 AM - 1 PM",
          venue: "Room 402",
          focus: "Tech",
          activities: ["Real or Fake Tech", "Resistor Rush", "Memory Match"],
          image: "/EVENTSPOSTERS/TECHMAYHEM.jpg",
          regLink: "https://forms.gle/u1TAKaa7LF1Ge4UR9",
        },
      ],
    },
    {
      cluster: "SPORTIVA",
      events: [
        {
          name: "One Over Cricket",
          time: "11 AM - 2 PM",
          venue: "Basketball Court",
          focus: "Sports",
          activities: ["Powerplay", "Quick Overs", "Final Chase"],
          image: "/EVENTSPOSTERS/ONEOVERCRICKET.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLScHjmT69qXlX1d6MtqmhY4qV3cZAhpMcIai5tBD8zrWgnYDzw/viewform",
        },
      ],
    },
    {
      cluster: "ROBOTICS CLUSTER",
      events: [
        {
          name: "Sumo Challenge",
          time: "2 PM - 4 PM",
          venue: "ECE Lab",
          focus: "Tech",
          activities: ["Bot Wrestling", "Arena Combat"],
          image: "/EVENTSPOSTERS/ROBOSUMO.jpg",
          regLink: "https://forms.gle/Z9saAA2xU2YKoqj8A",
        },
      ],
    },
  ],
  "Day 3": [
    {
      cluster: "MATHEMATICA",
      events: [
        {
          name: "Combo Game Events",
          time: "9 AM - 3 PM",
          venue: "Room 202",
          focus: "Fun",
          activities: ["Ladder Game", "Brain Bid Battle", "Math Royale"],
          image: "/EVENTSPOSTERS/COMBOGAMES.jpg",
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "Stock War",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          focus: "Tech",
          activities: ["Market Simulation", "Risk Analysis"],
          image: "/EVENTSPOSTERS/STOCKWARS-MARKETSIMULATION.jpg",
          regLink: "https://forms.gle/6jL2YA3VvscgGiUf9",
        },
      ],
    },
    {
      cluster: "ACCESS INDIA",
      events: [
        {
          name: "FUNIVERSE",
          time: "11.00 AM - 2.00 PM",
          venue: "ROOM NO.410 & 411",
          focus: "Fun",
          activities: ["Imposter Arc", "Chaos Carnival"],
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSe7KnkFXECkXDLroyUXsvMvx7811qLI-XbBugH3hJ8kVBrHtg/viewform",
          image: "/EVENTSPOSTERS/FUNIVERSE.jpg",
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
          image: "/EVENTSPOSTERS/CLASHOFCODES.jpg",
        },
      ],
    },
    {
      cluster: "OPTICA",
      events: [
        {
          name: "The Final Pyramid",
          time: "9:30 AM - 11:30 AM",
          venue: "Room 310",
          focus: "Learning",
          activities: ["Sonar Sprint", "Hopscotch Pyramid"],
          image: "/EVENTSPOSTERS/FINALPYRAMID.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSeiG0W_7I7wdPsc4S35B9A9fDPtf2ogKsUXxaZxcHTYAnGnyA/viewform",
        },
      ],
    },
    {
      cluster: "ROBOTICS CLUSTER",
      events: [
        {
          name: "RoboAI Challenge",
          time: "10 AM - 4 PM",
          venue: "ECE Lab",
          focus: "Tech",
          activities: ["AI Integration", "Path Planning"],
          image: "/EVENTSPOSTERS/ROBOAI-HACKATHON.jpg",
          regLink: "https://forms.gle/5dpnrrhJAhrSU6zd7",
        },
      ],
    },
    {
      cluster: "ELECTRONICA",
      events: [
        {
          name: "THINKZONE CHALLENGE",
          time: "10 AM - 1 PM",
          venue: "Room 402",
          focus: "Creative",
          activities: ["Artistic", "Kandupidi"],
          image: "/EVENTSPOSTERS/THINKZONE.jpg",
          regLink: "https://forms.gle/2GMW1XW9sQ5h8QZ68",
        },
      ],
    },
    {
      cluster: "SPORTIVA",
      events: [
        {
          name: "Tug of War",
          time: "11 AM - 2 PM",
          venue: "Basketball Court",
          focus: "Sports",
          activities: ["Team Strength", "Quick Pull"],
          image: "/EVENTSPOSTERS/TUGOFWAR.jpg",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLScbZVPEsAmHeVCVjNO90mHPX3VLWgzQgRdbo-lqL_mMvsNebA/viewform",
        },
      ],
    },
  ],
};

const buildDescription = (cluster: string, name: string, loc: string, acts: string[]) => {
  if (!acts.length) return `${cluster} presents ${name} at ${loc}.`;
  return `${cluster} presents ${name} at ${loc} with ${acts.slice(0, 2).join(", ")}.`;
};

const getActivityLabel = (acts: string[]) => {
  if (acts.length === 0) return "Single event";
  return acts.length === 1 ? "1 activity" : `${acts.length} activities`;
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
        description: event.description || buildDescription(cluster, event.name, event.venue, event.activities),
        image: event.image || themeImageMap[theme],
        activities: event.activities,
        regLink: event.regLink,
        fee: event.fee,
      };
    }),
  ),
).map((event, index) => ({ ...event, id: index + 1 }));

const eventsByDay = DAY_ORDER.reduce(
  (acc, day) => {
    acc[day] = allEvents.filter((event) => event.day === day);
    return acc;
  },
  {} as Record<DayLabel, Event[]>,
);

export default component$(() => {
  const selectedEvent = useSignal<Event | null>(null);
  const selectedDay = useSignal<DayLabel>("Day 1");
  const selectedCluster = useSignal<string>(ALL_CLUSTERS);
  const selectedFocus = useSignal<string>(ALL_CATEGORIES);
  const activeFilterPanel = useSignal<"cluster" | "focus" | null>(null);
  const showMobilePoster = useSignal(false);

  useVisibleTask$(({ track, cleanup }) => {
    track(() => selectedEvent.value);
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && (selectedEvent.value = null);
    if (selectedEvent.value) document.body.style.overflow = "hidden";
    showMobilePoster.value = false;
    document.addEventListener("keydown", onKeyDown);
    cleanup(() => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => selectedDay.value);
    const previousTheme = document.body.getAttribute("data-theme");
    const uiTheme: "default" | "spider" | "onepiece" =
      selectedDay.value === "Day 3"
        ? "spider"
        : selectedDay.value === "Day 2"
          ? "onepiece"
          : "default";

    document.body.setAttribute("data-theme", uiTheme);
    window.dispatchEvent(new CustomEvent("theta-ui-theme-change", { detail: { theme: uiTheme } }));
    cleanup(() => {
      if (previousTheme) {
        document.body.setAttribute("data-theme", previousTheme);
      } else {
        document.body.removeAttribute("data-theme");
      }
      window.dispatchEvent(new CustomEvent("theta-ui-theme-change", { detail: { theme: null } }));
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => selectedDay.value);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".events-page-shell",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.28, ease: "power2.out", clearProps: "opacity,visibility,transform" },
      );
      gsap.fromTo(
        ".event-card",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.018,
          clearProps: "opacity,visibility,transform",
        },
      );
    });

    cleanup(() => ctx.revert());
  });

  const closeEvent = $(() => (selectedEvent.value = null));

  const isDay2 = selectedDay.value === "Day 2";
  const isDay3 = selectedDay.value === "Day 3";
  const bgLogo = isDay3 ? "/spidy/spidy-web.webp" : isDay2 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp";
  const bgGlowColor = isDay3 ? "#ff3333" : isDay2 ? "#eab308" : "#bef300";

  const eventsForSelectedDay = eventsByDay[selectedDay.value];
  const availableClusters = [ALL_CLUSTERS, ...new Set(eventsForSelectedDay.map((e) => e.cluster))];
  const availableFocusForDay = [ALL_CATEGORIES, ...new Set(eventsForSelectedDay.map((e) => e.focus))];

  const filteredEvents = eventsForSelectedDay.filter((e) => {
    return (selectedCluster.value === ALL_CLUSTERS || e.cluster === selectedCluster.value) && (selectedFocus.value === ALL_CATEGORIES || e.focus === selectedFocus.value);
  });

  return (
    <div class="events-page-shell relative mx-auto min-h-screen w-full overflow-x-hidden bg-[#050505] px-4 pt-40 pb-32 font-sans">
      <style>{`
        .omnitrix-bg-image { opacity: 0.1; transform: translateZ(0); }
        .events-page-shell { opacity: 1; }
        .dock-item-active { box-shadow: 0 0 20px ${bgGlowColor}60; }
        
        .event-card {
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          contain: layout paint style;
          content-visibility: auto;
          contain-intrinsic-size: 420px;
        }
        .event-card:hover { box-shadow: 0 0 16px var(--glow-color); }
        .card-tech-bracket { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); margin: 4px; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 20px; border: 1.5px solid rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${bgGlowColor}; box-shadow: 0 0 20px ${bgGlowColor}; }
        .event-modal-info-strip { scrollbar-width: thin; scrollbar-color: ${bgGlowColor} rgba(255,255,255,0.08); }
        .event-modal-info-strip::-webkit-scrollbar { height: 4px; }
        .event-modal-info-strip::-webkit-scrollbar-track { background: rgba(255,255,255,0.06); border-radius: 999px; }
        .event-modal-info-strip::-webkit-scrollbar-thumb { background: ${bgGlowColor}; border-radius: 999px; }
      `}</style>

      {/* Parallax Background */}
      <div class="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div class="absolute w-[72vw] h-[72vw] opacity-[0.06] blur-[90px] rounded-full" style={`background-color: ${bgGlowColor};`}></div>
        <div class="relative flex items-center justify-center">
          <img src={bgLogo} alt="" class="omnitrix-bg-image w-[90vw] sm:w-[50vw] object-contain" loading="lazy" decoding="async" fetchPriority="low" />
        </div>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-2 [content-visibility:auto] [contain-intrinsic-size:1400px]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => {
            const c = isDay3 ? { border: "border-[#ff3333]/40", badge: "bg-[#ff3333] text-white", ring: "#ff3333" } : isDay2 ? { border: "border-[#eab308]/40", badge: "bg-[#eab308] text-black", ring: "#eab308" } : { border: "border-[#bef300]/40", badge: "bg-[#bef300] text-black", ring: "#bef300" };

            return (
              <div
                key={event.id}
                onClick$={() => {
                  showMobilePoster.value = false;
                  selectedEvent.value = event;
                }}
                class={`event-card group relative flex flex-col rounded-[1.75rem] overflow-hidden cursor-pointer border ${c.border} bg-[#06090a] shadow-2xl`}
                style={`--glow-color: ${c.ring}25; --bracket-color: ${c.ring};`}
              >
                <div class="relative h-52 w-full overflow-hidden flex-shrink-0">
                  <img src={event.image} alt={event.name} class="absolute inset-0 h-full w-full object-cover brightness-[0.86]" loading="lazy" decoding="async" fetchPriority="low" />

                  <div class="absolute top-4 left-4 right-4 z-30 flex justify-between items-start gap-2">
                    <div class="flex flex-col gap-1.5">
                      <span class={`rounded-full px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-widest shadow-lg ${c.badge}`}>{event.cluster}</span>
                      <span class="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[0.55rem] font-bold text-white uppercase tracking-widest">{event.focus}</span>
                    </div>
                  </div>
                  <span class="absolute bottom-3 left-4 z-30 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/50">{event.day}</span>
                </div>

                <div class="relative flex flex-col flex-1 p-5">
                  {/* Decorative Brackets */}
                  <div class="card-tech-bracket top-4 left-4 border-t-2 border-l-2"></div>
                  <div class="card-tech-bracket top-4 right-4 border-t-2 border-r-2"></div>
                  <div class="card-tech-bracket bottom-4 left-4 border-b-2 border-l-2"></div>
                  <div class="card-tech-bracket bottom-4 right-4 border-b-2 border-r-2"></div>

                  <h3 class="text-lg font-black text-white mb-2 leading-tight">{event.name}</h3>
                  <p class="text-white/40 text-[0.7rem] line-clamp-2 mb-4 font-medium leading-relaxed uppercase tracking-tight">{event.description}</p>

                  <div class="mt-auto flex flex-wrap gap-2 pt-2 items-center">
                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                      <svg class="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" /></svg>
                      <span class="text-[0.5rem] font-black text-white/70 uppercase tracking-tighter">{event.timing}</span>
                    </div>
                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                      <svg class="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" /></svg>
                      <span class="text-[0.5rem] font-black text-white/70 uppercase tracking-tighter">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom controls */}
      <div class="fixed bottom-5 left-1/2 z-[100] w-full max-w-[44rem] -translate-x-1/2 transform-gpu px-3 sm:bottom-8 sm:px-4">
        <div class="flex items-center gap-1.5 rounded-[2rem] border border-white/20 bg-[#0c0f10]/95 p-1.5 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl sm:gap-2 sm:rounded-[2.5rem] sm:p-2">
          <div class="grid flex-[1.45] grid-cols-3 gap-1 rounded-[1.5rem] bg-black/35 p-1 sm:gap-1.5 sm:rounded-[2rem]">
            {DAY_ORDER.map((day, index) => (
              <button
                key={day}
                type="button"
                aria-label={day}
                onClick$={() => (selectedDay.value = day)}
                class={[
                  "relative min-h-11 overflow-hidden rounded-full px-2 text-[0.66rem] font-black tracking-wide uppercase transition-all sm:min-h-12 sm:px-5 sm:text-[0.75rem]",
                  selectedDay.value === day
                    ? "scale-[1.02] text-black shadow-lg"
                    : "text-white/35 hover:bg-white/5 hover:text-white/70",
                ]}
              >
                {selectedDay.value === day && (
                  <span
                    class={[
                      "absolute inset-0 z-0 rounded-full bg-gradient-to-tr",
                      index === 2
                        ? "from-[#ff3333] to-[#cc1111]"
                        : index === 1
                          ? "from-[#eab308] to-[#ca8a04]"
                          : "from-[#bef300] to-[#d4ff00]",
                    ]}
                  />
                )}
                <span class="relative z-10 sm:hidden">{`D${index + 1}`}</span>
                <span class="relative z-10 hidden sm:inline">{day}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick$={() => (activeFilterPanel.value = "focus")}
            aria-label={`Type filter: ${selectedFocus.value}`}
            title={`Type: ${selectedFocus.value}`}
            class={["flex h-12 min-w-12 flex-[0.55] items-center justify-center gap-2 rounded-full border px-3 text-[0.68rem] font-black tracking-widest uppercase transition-all sm:flex-1 sm:px-5",
              selectedFocus.value === ALL_CATEGORIES
                ? "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                : "bg-[#bef300]/10 border-[#bef300]/40 text-[#bef300] shadow-[0_0_20px_rgba(190,243,0,0.15)]"]}
          >
            <svg class={["h-4 w-4", selectedFocus.value === ALL_CATEGORIES ? "text-white/35" : "text-[#bef300]"]} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 5h16M7 12h10M10 19h4" />
            </svg>
            <span class="hidden sm:inline">{selectedFocus.value === ALL_CATEGORIES ? "Type" : selectedFocus.value}</span>
          </button>

          <button
            type="button"
            onClick$={() => (activeFilterPanel.value = "cluster")}
            aria-label={`Cluster filter: ${selectedCluster.value}`}
            title={`Cluster: ${selectedCluster.value}`}
            class={["flex h-12 min-w-12 flex-[0.55] items-center justify-center gap-2 rounded-full border px-3 text-[0.68rem] font-black tracking-widest uppercase transition-all sm:flex-[1.2] sm:px-5",
              selectedCluster.value === ALL_CLUSTERS
                ? "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                : "bg-white/10 border-[#bef300]/50 text-white shadow-[0_0_25px_rgba(190,243,0,0.2)]"]}
          >
            <svg class={["h-4 w-4", selectedCluster.value === ALL_CLUSTERS ? "text-white/35" : "text-[#bef300]"]} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h7v7H4zM13 7h7v7h-7zM4 16h7v3H4zM13 16h7v3h-7z" />
            </svg>
            <span class="hidden sm:inline">{selectedCluster.value === ALL_CLUSTERS ? "Clusters" : selectedCluster.value}</span>
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {activeFilterPanel.value && (
        <div class="events-viewport-overlay z-[150] p-4">
          <div class="absolute inset-0 bg-black/70" onClick$={() => (activeFilterPanel.value = null)}></div>
          <div class="events-popup-enter relative bg-[#080a0b] border border-white/10 p-8 rounded-[2rem] max-w-lg w-full">
            <div class="flex flex-wrap gap-2 justify-center">
              {(activeFilterPanel.value === "cluster" ? availableClusters : availableFocusForDay).map(item => (
                <button key={item} onClick$={() => { if (activeFilterPanel.value === "cluster") selectedCluster.value = item; else selectedFocus.value = item; activeFilterPanel.value = null; }} class="px-4 py-2 rounded-full bg-white/5 text-white/60 text-[0.65rem] font-black uppercase border border-white/10 hover:bg-white/10 transition-colors">{item}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
            CINEMATIC MODAL — MATCHING SCREENSHOT EXACTLY
          ═══════════════════════════════════════════════════ */}
      {selectedEvent.value && (() => {
        const ev = selectedEvent.value!;
        const c = isDay3 ? { ring: "#ff3333", border: "border-[#ff3333]/30", badge: "bg-[#ff3333] text-white" }
          : isDay2 ? { ring: "#eab308", border: "border-[#eab308]/30", badge: "bg-[#eab308] text-black" }
            : { ring: "#bef300", border: "border-[#bef300]/30", badge: "bg-[#bef300] text-black" };

        return (
          <div class="events-viewport-overlay z-[200] p-2 sm:p-4 md:p-6">
            <div class="absolute inset-0 bg-black/88" onClick$={closeEvent}></div>

            <div
              class={`events-popup-enter relative flex max-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[1.35rem] border ${c.border} bg-[#050707] sm:rounded-[1.75rem] md:h-[min(76vh,620px)] md:max-h-[calc(100dvh-3rem)] md:flex-row`}
              style="box-shadow: 0 18px 52px rgba(0,0,0,0.72);"
            >
              {/* ── LEFT IMAGE PANEL (SCROLLABLE POSTER) ── */}
              <div class={[
                "relative h-[calc(100dvh-1rem)] w-full flex-shrink-0 overflow-hidden bg-black md:block md:h-full md:w-[44%]",
                showMobilePoster.value ? "block" : "hidden",
              ]}>
                <button
                  type="button"
                  onClick$={() => (showMobilePoster.value = false)}
                  class="absolute top-3 left-3 z-20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.62rem] font-black tracking-widest text-black uppercase shadow-[0_10px_28px_rgba(0,0,0,0.45)] md:hidden"
                  style={`background:${c.ring};border-color:${c.ring};`}
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m0 0 6-6m-6 6 6 6" /></svg>
                  Details
                </button>
                <img src={ev.image} alt={ev.name} class="h-full w-full object-contain brightness-[0.94]" loading="lazy" decoding="async" fetchPriority="low" />
              </div>

              {/* ── RIGHT DETAILS PANEL (SCROLLABLE INFO) ── */}
              <div class={[
                "relative flex-1 flex-col overflow-hidden bg-[#050707] md:flex md:h-full",
                showMobilePoster.value ? "hidden" : "flex",
              ]}>
                {/* Scrollable Content Area */}
                <div class="relative z-10 flex-1 overflow-y-auto px-5 pt-5 pb-3 custom-scrollbar md:overflow-hidden md:px-7 md:pt-7">

                  {/* Close Cross Button */}
                  <button onClick$={closeEvent} class="absolute top-4 right-4 z-20 rounded-full border border-white/10 bg-[#111] p-2 text-white/45 transition-colors hover:text-white">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" /></svg>
                  </button>

                  <div>
                    <button
                      type="button"
                      onClick$={() => (showMobilePoster.value = true)}
                      class="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.62rem] font-black tracking-widest text-black uppercase shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition-transform active:scale-95 md:hidden"
                      style={`background:${c.ring};border-color:${c.ring};`}
                    >
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.6"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4-4 3 3 5-6 4 5M5 5h14v14H5z" /></svg>
                      View event poster
                    </button>
                    <p class="mb-1 text-[0.58rem] font-black tracking-[0.34em] uppercase" style={`color: ${c.ring}`}>Theta Schedule / {ev.day}</p>
                    <h2 class="max-w-[88%] text-2xl leading-[1.05] font-black tracking-tight text-white md:text-4xl">{ev.name}</h2>
                    <p class="mt-3 max-w-md text-[0.68rem] leading-relaxed font-medium text-white/45 md:text-[0.72rem]">{ev.description}</p>

                    <div class="mt-5 grid grid-cols-2 gap-3">
                      {[
                        { label: "Venue", value: ev.location, icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" },
                        { label: "Timing", value: ev.timing, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
                        { label: "Cluster", value: ev.cluster, icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" },
                        { label: "Activities", value: String(ev.activities.length), icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
                      ].map((item) => (
                        <div key={item.label} class="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#0b0f0d] p-3">
                          <div class="mb-1.5 flex items-center gap-2">
                            <svg class="h-3.5 w-3.5" style={`color: ${c.ring}`} viewBox="0 0 24 24" fill="currentColor"><path d={item.icon} /></svg>
                            <span class="text-[0.5rem] font-black tracking-widest text-white/35 uppercase">{item.label}</span>
                          </div>
                          <span class="text-sm font-black tracking-tight text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div class="mt-3">
                      {ev.activities.length > 0 ? (
                        <div class="flex flex-wrap gap-2">
                          {ev.activities.map(a => (
                            <span key={a} class="rounded-full border border-white/10 bg-[#0b0f0d] px-2.5 py-1 text-[0.52rem] font-bold text-white/55 uppercase">{a}</span>
                          ))}
                        </div>
                      ) : (
                        <p class="text-[0.6rem] leading-relaxed font-medium text-white/35 italic">Standalone event format.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div class="z-30 border-t border-white/8 bg-[#050707] p-5 md:px-7 md:pb-7 md:pt-4">
                  <div
                    class="flex items-center justify-center gap-3 rounded-2xl border px-4 py-3.5 text-center text-xs font-black tracking-widest uppercase md:text-sm"
                    style={`border-color:${c.ring}55;background:linear-gradient(135deg, ${c.ring}18, rgba(255,255,255,0.045));color:${c.ring};`}
                    aria-disabled="true"
                  >
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/35">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14" /></svg>
                    </span>
                    Event registration closed
                  </div>
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
  meta: [{ name: "description", content: "Interactive event schedule for Theta 2026." }],
};
