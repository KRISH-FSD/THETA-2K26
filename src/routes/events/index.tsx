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
  fun: { border: "border-[#0ea935]/40", glow: "rgba(14,169,53,0.25)", badge: "bg-[#0ea935] text-black", ring: "#0ea935" },
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

export default component$(() => {
  const selectedEvent = useSignal<Event | null>(null);
  const selectedDay = useSignal<DayLabel>("Day 1");
  const selectedCluster = useSignal<string>(ALL_CLUSTERS);
  const selectedFocus = useSignal<string>(ALL_CATEGORIES);
  const activeFilterPanel = useSignal<"cluster" | "focus" | null>(null);

  useVisibleTask$(({ track, cleanup }) => {
    track(() => selectedEvent.value);
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && (selectedEvent.value = null);
    if (selectedEvent.value) document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    cleanup(() => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);
    const themeStr = selectedDay.value === "Day 3" ? "spider" : selectedDay.value === "Day 2" ? "onepiece" : "default";
    document.body.setAttribute("data-theme", themeStr);
    gsap.set(".event-card", { clearProps: "all" });
  });

  useVisibleTask$(({ track }) => {
    track(() => activeFilterPanel.value);
    if (activeFilterPanel.value) {
      gsap.fromTo(".filter-pill", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" });
    }
  });

  useVisibleTask$(() => {
    gsap.fromTo(".event-command-dock", { y: "-200%", opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" });
  });

  const closeEvent = $(() => (selectedEvent.value = null));

  const isDay2 = selectedDay.value === "Day 2";
  const isDay3 = selectedDay.value === "Day 3";
  const bgLogo = isDay3 ? "/spidy/spidy-web.webp" : isDay2 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp";
  const bgGlowColor = isDay3 ? "#ff3333" : isDay2 ? "#eab308" : "#0ea935";

  const eventsForSelectedDay = allEvents.filter((e) => e.day === selectedDay.value);
  const availableClusters = [ALL_CLUSTERS, ...new Set(eventsForSelectedDay.map((e) => e.cluster))];
  const availableFocusForDay = [ALL_CATEGORIES, ...new Set(eventsForSelectedDay.map((e) => e.focus))];

  const filteredEvents = allEvents.filter((e) => {
    return e.day === selectedDay.value && (selectedCluster.value === ALL_CLUSTERS || e.cluster === selectedCluster.value) && (selectedFocus.value === ALL_CATEGORIES || e.focus === selectedFocus.value);
  });

  return (
    <div class="relative mx-auto min-h-screen w-full px-4 pt-64 pb-20 bg-[#050505] font-sans overflow-hidden">
      <style>{`
        .omnitrix-bg-image { opacity: 0.12; will-change: transform, opacity; transform: translateZ(0); }
        .omnitrix-bg-core { position: absolute; inset: 0; opacity: 0.18; mix-blend-mode: screen; transform: translateZ(0); animation: clockBlink 5s infinite; }
        @keyframes clockBlink { 0%, 80%, 100% { opacity: 0.15; } 90% { opacity: 0.40; } }
        .modal-animate-in { animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; will-change: transform, opacity; }
        @keyframes floatIn { 0% { transform: translateY(20px) scale(0.96); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .dock-item-active { box-shadow: 0 0 20px ${bgGlowColor}60; }
        
        .event-card { transform: translateZ(0); will-change: transform, box-shadow; }
        .modal-scan-line { animation: scanSweep 4s ease-in-out infinite; will-change: top; }
        @keyframes scanSweep { 0% { top: 0% } 100% { top: 100% } }
      `}</style>

      {/* Parallax Background */}
      <div class="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div class="absolute w-[80vw] h-[80vw] opacity-[0.08] blur-[150px] rounded-full" style={`background-color: ${bgGlowColor};`}></div>
        <div class="relative flex items-center justify-center">
          <img src={bgLogo} class="omnitrix-bg-image w-[90vw] sm:w-[50vw] object-contain" />
          {!isDay3 && <img src={bgLogo} class="omnitrix-bg-core w-[90vw] sm:w-[50vw] object-contain" />}
        </div>
      </div>

      {/* PREMIUM CARD GRID */}
      <div class="relative z-10 mx-auto max-w-7xl px-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => {
            const c = isDay3 ? { border: "border-[#ff3333]/40", badge: "bg-[#ff3333] text-white", ring: "#ff3333" } : isDay2 ? { border: "border-[#eab308]/40", badge: "bg-[#eab308] text-black", ring: "#eab308" } : { border: "border-[#0ea935]/40", badge: "bg-[#0ea935] text-white", ring: "#0ea935" };

            return (
              <div key={event.id} onClick$={() => (selectedEvent.value = event)} class={`event-card group relative flex flex-col rounded-[1.75rem] overflow-hidden cursor-pointer border ${c.border} bg-[#06090a] transition-all duration-500 hover:-translate-y-3 shadow-2xl`}>
                <div class="relative h-52 w-full overflow-hidden flex-shrink-0">
                  <img src={event.image} class="absolute inset-0 h-full w-full object-cover brightness-[0.55] group-hover:brightness-[0.8] group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 z-10" style={`background: radial-gradient(circle at 50% 80%, ${c.ring}55, transparent 70%);`}></div>
                  <div class="absolute top-4 left-4 right-4 z-30 flex justify-between items-start gap-2">
                    <div class="flex flex-col gap-1.5">
                      <span class={`rounded-full px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-widest shadow-lg ${c.badge}`}>{event.cluster}</span>
                      <span class="rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[0.55rem] font-bold text-white uppercase tracking-widest">{event.focus}</span>
                    </div>
                  </div>
                  <span class="absolute bottom-3 left-4 z-30 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/50">{event.day}</span>
                </div>
                <div class="relative flex flex-col flex-1 p-5">
                  <h3 class="text-lg font-black text-white mb-2 leading-tight">{event.name}</h3>
                  <p class="text-white/50 text-xs line-clamp-2 mb-4 font-medium">{event.description}</p>
                  <div class="mt-auto flex flex-wrap gap-2 pt-2">
                    <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.55rem] font-bold text-white/80 uppercase">{event.timing}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Command Dock */}
      <div class="event-command-dock absolute top-24 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full px-4">
        <div class="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 p-1.5 backdrop-blur-2xl shadow-xl">
          <div class="flex gap-1">
            {DAY_ORDER.map((day) => (
              <button key={day} onClick$={() => (selectedDay.value = day)} class={["relative px-6 py-2 rounded-full text-[0.65rem] font-black uppercase transition-all", selectedDay.value === day ? "text-black" : "text-white/40 hover:text-white/80"]}>
                {selectedDay.value === day && <div class={["absolute inset-0 rounded-full z-0 bg-gradient-to-tr", day === "Day 3" ? "from-[#ff3333] to-[#cc1111]" : day === "Day 2" ? "from-[#eab308] to-[#ca8a04]" : "from-[#0ea935] to-[#12cb42]"]}></div>}
                <span class="relative z-10">{day}</span>
              </button>
            ))}
          </div>
          <div class="w-px h-6 bg-white/15 mx-1"></div>
          <button onClick$={() => (activeFilterPanel.value = "cluster")} class="px-4 text-[0.65rem] font-bold text-white uppercase">{selectedCluster.value === ALL_CLUSTERS ? "Clusters" : selectedCluster.value}</button>
        </div>
      </div>

      {/* Filter Modal */}
      {activeFilterPanel.value && (
        <div class="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-md" onClick$={() => (activeFilterPanel.value = null)}></div>
          <div class="relative bg-[#080a0b] border border-white/10 p-8 rounded-[2rem] max-w-lg w-full">
             <div class="flex flex-wrap gap-2 justify-center">
                {(activeFilterPanel.value === "cluster" ? availableClusters : availableFocusForDay).map(item => (
                    <button key={item} onClick$={() => { if(activeFilterPanel.value === "cluster") selectedCluster.value = item; else selectedFocus.value = item; activeFilterPanel.value = null; }} class="px-4 py-2 rounded-full bg-white/5 text-white/60 text-[0.65rem] font-black uppercase border border-white/10 hover:bg-white/10 transition-colors">{item}</button>
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
                : { ring: "#4ade80", border: "border-[#4ade80]/30", badge: "bg-[#4ade80] text-black" };
        
        return (
          <div class="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
            <div class="absolute inset-0 bg-black/85 backdrop-blur-2xl" onClick$={closeEvent}></div>
            
            <div 
              class={`relative w-full max-w-5xl rounded-[2.5rem] border ${c.border} bg-[#06090a] flex flex-col md:flex-row overflow-hidden modal-animate-in shadow-2xl`}
              style={`box-shadow: 0 0 60px ${c.ring}15;`}
            >
               {/* ── LEFT IMAGE PANEL ── */}
               <div class="relative w-full md:w-[45%] h-64 md:h-auto overflow-hidden">
                  <img src={ev.image} class="w-full h-full object-cover brightness-[0.5]" />
                  
                  {/* Themed Glowwash */}
                  <div class="absolute inset-0 bg-gradient-to-tr opacity-40 mix-blend-color" style={`background-color: ${c.ring}`}></div>
                  
                  {/* Technical Brackets (L-shapes) */}
                  <div class="absolute top-6 left-6 w-8 h-8 opacity-60" style={`border-top: 2px solid ${c.ring}; border-left: 2px solid ${c.ring}`}></div>
                  <div class="absolute top-6 right-6 w-8 h-8 opacity-60" style={`border-top: 2px solid ${c.ring}; border-right: 2px solid ${c.ring}`}></div>
                  <div class="absolute bottom-16 left-6 w-8 h-8 opacity-60" style={`border-bottom: 2px solid ${c.ring}; border-left: 2px solid ${c.ring}`}></div>
                  <div class="absolute bottom-16 right-6 w-8 h-8 opacity-60" style={`border-bottom: 2px solid ${c.ring}; border-right: 2px solid ${c.ring}`}></div>

                  {/* Badges in Top Left */}
                  <div class="absolute top-7 left-7 z-30 flex gap-2">
                    <span class={`rounded-full px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest ${c.badge}`}>{ev.cluster}</span>
                    <span class="rounded-full bg-[#111] border border-white/10 px-4 py-1.5 text-[0.65rem] font-bold text-white uppercase tracking-widest">{getActivityLabel(ev.activities)}</span>
                  </div>

                  {/* DAY Label at Bottom Left */}
                  <div class="absolute bottom-7 left-7 z-30">
                    <span class="text-white/40 text-[0.7rem] font-black uppercase tracking-[0.4em]">{ev.day}</span>
                  </div>

                  {/* Moving Scanline */}
                  <div class="absolute left-0 right-0 h-[1.5px] opacity-40 modal-scan-line" style={`box-shadow: 0 0 10px ${c.ring}; background: ${c.ring}`}></div>
               </div>

               {/* ── RIGHT DETAILS PANEL ── */}
               <div class="p-6 md:p-10 flex-1 flex flex-col relative bg-[#06090a]">
                  
                  {/* Background Watermark Logo (Rotated) */}
                  <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
                    <img src={bgLogo} class="w-[140%] max-w-none opacity-[0.03] grayscale contrast-150 rotate-[15deg] select-none" />
                  </div>

                  {/* Close Cross Button */}
                  <button onClick$={closeEvent} class="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 transition-all z-20">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" /></svg>
                  </button>

                  <div class="relative z-10">
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.4em] mb-1" style={`color: ${c.ring}`}>Theta Schedule / {ev.day}</p>
                    <h2 class="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">{ev.name}</h2>
                    <p class="text-white/40 text-[0.75rem] leading-relaxed mb-8 max-w-md">{ev.description}</p>
                    
                    {/* Meta Info Grid */}
                    <div class="grid grid-cols-2 gap-3 mb-8">
                       <div class="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                          <div class="flex items-center gap-2 mb-1.5">
                             <svg class="w-3.5 h-3.5" style={`color: ${c.ring}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                             <span class="text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Venue</span>
                          </div>
                          <span class="text-white font-bold text-sm tracking-tight">{ev.location}</span>
                       </div>
                       <div class="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                          <div class="flex items-center gap-2 mb-1.5">
                             <svg class="w-3.5 h-3.5" style={`color: ${c.ring}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                             <span class="text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Timing</span>
                          </div>
                          <span class="text-white font-bold text-sm tracking-tight">{ev.timing}</span>
                       </div>
                       <div class="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                          <div class="flex items-center gap-2 mb-1.5">
                             <svg class="w-3.5 h-3.5" style={`color: ${c.ring}`} viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                             <span class="text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Cluster</span>
                          </div>
                          <span class="text-white font-bold text-sm tracking-tight">{ev.cluster}</span>
                       </div>
                       <div class="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                          <div class="flex items-center gap-2 mb-1.5">
                             <svg class="w-3.5 h-3.5" style={`color: ${c.ring}`} viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                             <span class="text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Activities</span>
                          </div>
                          <span class="font-black text-xl leading-none" style={`color: ${c.ring}`}>{ev.activities.length}</span>
                       </div>
                    </div>

                    {/* Activity Lineup Section */}
                    <div class="p-5 rounded-3xl bg-white/[0.02] border border-white/10 mb-8">
                       <div class="flex items-center justify-between mb-4">
                          <span class="text-[0.65rem] font-black uppercase tracking-widest" style={`color: ${c.ring}`}>Activity Lineup</span>
                          <span class="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[0.5rem] font-bold text-white/40 uppercase tracking-widest">{getActivityLabel(ev.activities)}</span>
                       </div>
                       {ev.activities.length > 0 ? (
                          <div class="flex flex-wrap gap-2">
                             {ev.activities.map(a => (
                                <span key={a} class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[0.6rem] font-bold text-white/70 uppercase">{a}</span>
                             ))}
                          </div>
                       ) : (
                          <p class="text-white/30 text-[0.65rem] font-medium leading-relaxed italic">This event is listed as a standalone format without separate track activities.</p>
                       )}
                    </div>

                    {/* Bottom CTA Buttons */}
                    <div class="flex gap-4">
                       <a 
                         href={ev.regLink || "/register"} 
                         target="_blank" 
                         class="flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                         style={`background: ${c.ring}; box-shadow: 0 0 30px ${c.ring}40; color: #000;`}
                       >
                         <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                         Register Now
                       </a>
                       <button onClick$={closeEvent} class="flex-1 py-4 rounded-2xl border border-white/15 bg-white/5 font-black text-xs md:text-sm uppercase tracking-widest text-white/40 hover:text-white transition-all uppercase">
                          Close Panel
                       </button>
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
