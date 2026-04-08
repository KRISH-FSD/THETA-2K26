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
  "ACCESS INDIA": "innovation",
  INFORMATICA: "innovation",
  OPTICA: "logic",
  EQUILIBRIA: "creative",
  "VINODHA VAHINI": "fun",
  ELECTRONICA: "innovation",
  "ROBOTICS CLUSTER": "innovation",
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
          name: "Bio Architect",
          time: "11 AM - 2 PM",
          venue: "IED Hall",
          focus: "Learning",
          activities: [],
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000",
          regLink: "https://forms.gle/6WUW1J79fncoE8Zt7",
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
          image: "https://images.unsplash.com/photo-1544383335-df4d10037ec3?q=80&w=1000",
        },
        {
          name: "Infinity Beats",
          time: "11 AM - 4 PM",
          venue: "Room 211",
          focus: "Fun",
          activities: ["Balance Blitz", "Tap & Drop", "Spin & Solve"],
          image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000",
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "Venture Forge Hackathon - Marketing Edition",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          focus: "Tech",
          activities: [
            "Problem Identification",
            "Marketing Solution Design",
            "Pitch",
          ],
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000",
          regLink: "https://forms.gle/pBETMEayh8sBm1Q69",
        },
      ],
    },
    {
      cluster: "ACCESS INDIA",
      events: [
        {
          name: "IRON FIST AI",
          time: "10.00 AM - 12.00 PM",
          venue: "ROOM NO.410",
          focus: "Tech",
          fee: "Rs. 75 per team",
          description: "Iron Fist AI is a tri-phase semi-technical competition where teams of three compete in digital, physical, and AI-driven challenges, testing coordination, memory, and creativity across diverse tasks.",
          activities: [
            "Mini Militia Team Battle",
            "Memory Relay",
            "Vision Challenge",
          ],
          image: "https://images.unsplash.com/photo-1541728472741-03e45a58cf88?auto=format&fit=crop&w=800&q=80",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSdbmoFbrB1bmYrfSQTIVNCjRTSDziAhSheJio7vq4YnrXUA5A/viewform?usp=sharing&ouid=104165202810433780029",
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
          image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000",
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
          activities: [
            "Physics Freeze Game",
            "Binary Code Game",
            "Bernoulli Binary Blast",
          ],
          image: "https://images.unsplash.com/photo-1581093191605-a1d35581177b?q=80&w=1000",
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSeABawd4zOkl772rRy8v4HWKkHKmVOtEtJS5ma5WeettAcnww/viewform?usp=dialog",
        },
      ],
    },
    {
      cluster: "EQUILIBRIA",
      events: [
        {
          name: "AI prompt App Creation- Na oru thadava prompt kudutha AI aayiram App create panum",
          time: "11:30 AM - 1 PM",
          venue: "Room 110",
          focus: "Tech",
          activities: [],
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
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
          image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000",
        },
      ],
    },
    {
      cluster: "ELECTRONICA",
      events: [
        {
          name: "TECH - STARTUP CHALLENGE",
          time: "11 AM - 2 PM",
          venue: "Room 402",
          focus: "Tech",
          fee: "Rs. 50",
          activities: [
            "Tech Spark",
            "Design & Develop",
            "Start-up Showcase",
            "Prize Pool: 1st - ₹500, 2nd - ₹300, 3rd - ₹200",
          ],
          image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000",
          regLink: "https://forms.gle/vdZds3WZAW5Q7jJ96",
        },
      ],
    },
    {
      cluster: "ROBOTICS CLUSTER",
      events: [
        {
          name: "Technical Event – Gesture Controlled Bot: Obstacle Maze",
          time: "11 AM - 1 PM",
          venue: "ECE Lab",
          focus: "Tech",
          activities: ["Bot Maze Run", "Gesture Calibration"],
          image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=1000",
          regLink: "https://forms.gle/CDKpnNqdNx85rvPi9",
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
          name: "FunKart",
          time: "2 PM - 5 PM",
          venue: "IED Hall",
          focus: "Fun",
          activities: ["Focus Freaks", "Zero Vision Zone", "Error Hunt"],
          image: "https://images.unsplash.com/photo-1596720426673-e47744bd2185?q=80&w=1000",
          regLink: "https://forms.gle/8k7SXNPL32wLh88C7",
        },
      ],
    },
    {
      cluster: "STRATEGIA",
      events: [
        {
          name: "FunFusion Arena",
          time: "2 PM - 4 PM",
          venue: "Room 303",
          focus: "Fun",
          activities: ["Gaming Challenges", "Strategy Puzzles"],
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
          regLink: "https://forms.gle/WQ9LPHHknA5keGKJ8",
        },
      ],
    },
    {
      cluster: "ACCESS INDIA",
      events: [
        {
          name: "VIP: VIBE IN PROMPT",
          time: "2.00 PM - 4.00 PM",
          venue: "ROOM NO.410",
          focus: "Tech",
          fee: "Rs. 50 per team",
          description: "VIP (Vibe in Prompt) is a three-round generative AI competition by Access India where teams of two use prompt engineering to create high-quality visual, motion, and audio outputs.",
          activities: ["Prompt Engineering", "AI Trailer", "QR Rhapsody"],
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSdM2ZwG7i8FtWrBiwbFg4GrMScIgcbJTBHWSLdvlj2R4QIg1w/viewform?usp=sharing&ouid=104165202810433780029",
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
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
          name: "The Gravity Defier",
          time: "9:30 AM - 11:30 AM",
          venue: "Room 310",
          focus: "Learning",
          activities: ["Number Grid Race", "Memory Snap", "Gravity Defier"],
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSd1EzJorBtCHd79RyI4M14qd6MjS6az9tfgHONC7spq6CggNw/viewform?usp=publish-editor",
        },
      ],
    },
    {
      cluster: "EQUILIBRIA",
      events: [
        {
          name: "Tech Fun Fusion- Think pana matum podhum",
          time: "2 PM - 3:30 PM",
          venue: "Room 110",
          focus: "Non-Tech",
          activities: ["Connect the Tech", "Meme Creation"],
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
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
          fee: "Rs. 50",
          activities: [
            "Real or Fake Tech",
            "Resistor Rush",
            "Memory Match",
            "Prize Pool: 1st - ₹500, 2nd - ₹300, 3rd - ₹200",
          ],
          regLink: "https://forms.gle/u1TAKaa7LF1Ge4UR9",
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
    {
      cluster: "ROBOTICS CLUSTER",
      events: [
        {
          name: "Fun-Technical Event: Sumo Challenge",
          time: "2 PM - 4 PM",
          venue: "ECE Lab",
          focus: "Tech",
          activities: ["Bot Wrestling", "Arena Combat"],
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000",
          regLink: "https://forms.gle/Z9saAA2xU2YKoqj8A",
        },
      ],
    },
  ],
  "Day 3": [
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
          regLink: "https://forms.gle/4a9Ws7WHz8SEMh1U6",
        },
      ],
    },
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
          name: "Stock War - The Trading Arena",
          time: "11 AM - 1 PM",
          venue: "Room 303",
          focus: "Tech",
          activities: [
            "Team Size: 2 Members",
            "Entry Fee: ₹50 (In-house) / ₹59 (External)",
            "Market Simulation",
            "Risk Analysis & Strategy",
          ],
          image: "https://images.unsplash.com/photo-1611974714028-ac6096ac72e8?q=80&w=1000",
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
          fee: "Rs. 50 per team",
          description: "Funiverse is a high-energy, three-level event blending fandom, creativity, and performance, where teams of two take on fun, chaotic challenges and showcase their unique strengths.",
          activities: ["Imposter Arc", "Chaos Carnival", "MegaVerse Battle"],
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSe7KnkFXECkXDLroyUXsvMvx7811qLI-XbBugH3hJ8kVBrHtg/viewform?usp=sharing&ouid=104165202810433780029",
          image: "https://images.unsplash.com/photo-1549443542-f47285513903?auto=format&fit=crop&w=800&q=80",
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
          name: "The Final Pyramid",
          time: "9:30 AM - 11:30 AM",
          venue: "Room 310",
          focus: "Learning",
          activities: ["Sonar Sprint", "Hopscotch Pyramid", "Hoops & Scoops"],
          regLink: "https://docs.google.com/forms/d/e/1FAIpQLSeiG0W_7I7wdPsc4S35B9A9fDPtf2ogKsUXxaZxcHTYAnGnyA/viewform?usp=publish-editor",
        },
      ],
    },
    {
      cluster: "ROBOTICS CLUSTER",
      events: [
        {
          name: "Technical Hackathon: RoboAI Challenge",
          time: "10 AM - 4 PM",
          venue: "ECE Lab",
          focus: "Tech",
          activities: ["AI Integration", "Path Planning"],
          image: "https://images.unsplash.com/photo-1531239669496-e1789bb5ad27?q=80&w=1000",
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
          fee: "Rs. 50",
          activities: [
            "Artistic",
            "Kandupidi",
            "Scavenger Hunt",
            "Prize Pool: 1st - ₹500, 2nd - ₹300, 3rd - ₹200",
          ],
          regLink: "https://forms.gle/2GMW1XW9sQ5h8QZ68",
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
    {
      cluster: "EQUILIBRIA",
      events: [
        {
          name: "Ultimate Entertainment Round- Inga serious ku entry kidayathu",
          time: "11 AM - 1 PM",
          venue: "Room 110",
          focus: "Fun",
          activities: ["Entertainment Challenges", "Comedy Showdown"],
          image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000",
          regLink: "https://forms.gle/Xa8WaGHWfvToyyUQA",
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
        description: event.description || buildDescription(
          cluster,
          event.name,
          event.venue,
          event.activities,
        ),
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
  const tempCluster = useSignal<string>(ALL_CLUSTERS);
  const tempFocus = useSignal<string>(ALL_CATEGORIES);
  const activeFilterPanel = useSignal<"cluster" | "focus" | null>(null);

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

    // Reset cluster filter when day changes (DISABLED for persistence as requested)
    // selectedCluster.value = ALL_CLUSTERS;
    activeFilterPanel.value = null;

    // Global Theme Sync
    const themeStr = selectedDay.value === "Day 3" ? "spider" : selectedDay.value === "Day 2" ? "onepiece" : "default";
    document.body.setAttribute("data-theme", themeStr);

    // Theme transition is now instant for better performance
    gsap.set(".event-card", { clearProps: "all" });
  });

  useVisibleTask$(({ track }) => {
    track(() => activeFilterPanel.value);
    if (activeFilterPanel.value) {
      // Staggered entrance for filter pills
      gsap.fromTo(".filter-pill",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.03,
          ease: "back.out(1.7)",
          delay: 0.1
        }
      );
    }
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


  const toggleFilter = $((panel: "cluster" | "focus") => {
    if (activeFilterPanel.value === panel) {
      activeFilterPanel.value = null;
    } else {
      activeFilterPanel.value = panel;
      // Sync temp values for immediate display feel
      tempCluster.value = selectedCluster.value;
      tempFocus.value = selectedFocus.value;
    }
  });

  const selectFilter = $((type: "cluster" | "focus", value: string) => {
    if (type === "cluster") {
      selectedCluster.value = value;
      tempCluster.value = value;
    } else {
      selectedFocus.value = value;
      tempFocus.value = value;
    }
    // Auto-close on selection for immediate feedback
    activeFilterPanel.value = null;
  });

  const openEvent = $((event: Event) => {
    selectedEvent.value = event;
  });

  const closeEvent = $(() => {
    selectedEvent.value = null;
  });

  const isDay2 = selectedDay.value === "Day 1" ? false : selectedDay.value === "Day 2";
  const isDay3 = selectedDay.value === "Day 3";

  const bgLogo = isDay3 ? "/spidy/spidy-web.webp" : isDay2 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp";
  const bgGlowColor = isDay3 ? "#ff3333" : isDay2 ? "#eab308" : "#0ea935";
  const tc = isDay3 ? "255, 51, 51" : isDay2 ? "234, 179, 8" : "14, 169, 53";
  const tcLight = isDay3 ? "255, 100, 100" : isDay2 ? "253, 224, 71" : "110, 255, 158";

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
        '--theme-glow': isDay3 ? 'rgba(255, 51, 51, 0.4)' : isDay2 ? 'rgba(234, 179, 8, 0.4)' : 'rgba(14, 169, 53, 0.4)'
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
                ? { border: "border-[#ff3333]/40", glow: "rgba(255,51,51,0.25)", badge: "bg-[#ff3333] text-white", ring: "#ff3333" }
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
                      src={event.image || (isDay3 ? "/spidy/spidy-event-bg" : isDay2 ? "https://images.unsplash.com/photo-1518837691861-152e4d31716b?q=80&w=1000" : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000")}
                      alt={event.name}
                      class={[
                        "absolute inset-0 h-full w-full object-cover brightness-[0.55] group-hover:brightness-[0.8] text-transparent",
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

                    {/* Top Badges & Status - Flex row with wrapping protection */}
                    <div class="absolute top-4 left-4 right-4 z-30 flex justify-between items-start gap-2">
                      <div class="flex flex-col sm:flex-row flex-wrap gap-1.5 max-w-[70%]">
                        <span class={`rounded-full px-2.5 py-1 text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap ${c.badge}`}>
                          {event.cluster}
                        </span>
                        <span class="rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[0.55rem] md:text-[0.6rem] font-bold text-white uppercase tracking-widest shadow-lg whitespace-nowrap">
                          {event.focus}
                        </span>
                      </div>

                      <span class="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[0.55rem] md:text-[0.6rem] font-bold text-white uppercase tracking-widest shadow-lg">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#0ea935] animate-pulse"></span>
                        Scheduled
                      </span>
                    </div>

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
                      <a
                        href={event.regLink || "/register"}
                        target={event.regLink ? "_blank" : "_self"}
                        rel={event.regLink ? "noopener noreferrer" : ""}
                        onClick$={(e) => e.stopPropagation()}
                        class="flex-1 py-2.5 px-3 rounded-xl font-extrabold text-[0.65rem] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.03] active:scale-95 text-[#06090a]"
                        style={`background: ${c.ring}; box-shadow: 0 0 16px ${c.ring}40;`}
                      >
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
      <div class="event-command-dock absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-[32rem] sm:max-w-none sm:w-auto flex justify-center">
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
                    day === "Day 3" ? "from-[#ff3333] via-[#cc1111] to-[#ff6666]" :
                      day === "Day 2" ? "from-[#eab308] via-[#ca8a04] to-[#fde047]" :
                        "from-[#0ea935] via-[#12cb42] to-[#8cff7a]"
                  ]}></div>
                )}
                <span class="relative z-10">{day}</span>
              </button>
            ))}
          </div>

          <div class="flex h-8 items-center gap-2 sm:gap-4 border-l border-white/15 pl-1.5 sm:pl-3">
            <button
              onClick$={() => toggleFilter("cluster")}
              class={[
                "flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-all duration-300 sm:px-3 sm:gap-2",
                activeFilterPanel.value === "cluster" ? "bg-white/20 shadow-lg" : "hover:bg-white/10"
              ]}
            >
              <div class={["w-1.5 h-1.5 rounded-full shrink-0", isDay3 ? "bg-[#ff3333]" : isDay2 ? "bg-[#eab308]" : "bg-[#0ea935]"]}></div>
              <span class="text-[0.6rem] font-bold uppercase tracking-widest text-white whitespace-nowrap sm:text-[0.65rem] truncate max-w-[80px] sm:max-w-[120px]">
                {selectedCluster.value === ALL_CLUSTERS ? "Clusters" : selectedCluster.value}
              </span>
              <svg class={["w-2.5 h-2.5 text-white/40 transition-transform", activeFilterPanel.value === "cluster" && "rotate-180"]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" stroke-width="3" />
              </svg>
            </button>

            <div class="h-4 w-px bg-white/10 hidden sm:block mx-1"></div>

            <button
              onClick$={() => toggleFilter("focus")}
              class={[
                "flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-all duration-300 sm:px-3 sm:gap-2",
                activeFilterPanel.value === "focus" ? "bg-white/20 shadow-lg" : "hover:bg-white/10"
              ]}
            >
              <div class={["w-1.5 h-1.5 rounded-full shrink-0", isDay3 ? "bg-[#ef4444]" : isDay2 ? "bg-[#eab308]" : "bg-[#0ea935]"]}></div>
              <span class="text-[0.6rem] font-bold uppercase tracking-widest text-white whitespace-nowrap sm:text-[0.65rem] truncate max-w-[60px] sm:max-w-[100px]">
                {selectedFocus.value === ALL_CATEGORIES ? "Focus" : selectedFocus.value}
              </span>
              <svg class={["w-2.5 h-2.5 text-white/40 transition-transform", activeFilterPanel.value === "focus" && "rotate-180"]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" stroke-width="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
            DECOUPLED FILTER PANELS — INSTANT & PERSISTENT
          ═══════════════════════════════════════════════════ */}
      {activeFilterPanel.value && (
        <div class="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick$={() => (activeFilterPanel.value = null)}
          ></div>

          {/* Panel Container */}
          <div
            class="relative z-10 w-full max-w-lg mb-20 sm:mb-0 rounded-[2rem] border border-white/10 bg-[#080a0b]/90 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-400"
            style={`border-color: ${bgGlowColor}30; box-shadow: 0 0 60px ${bgGlowColor}15;`}
          >
            {/* Header */}
            <div class="flex items-center justify-between p-6 border-b border-white/5">
              <div class="flex flex-col gap-1">
                <h3 class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white/40">
                  {activeFilterPanel.value === "cluster" ? "Select Cluster" : "Discover Focus"}
                </h3>
                <p class="text-[0.55rem] text-white/25 font-medium tracking-wider">
                  {activeFilterPanel.value === "cluster"
                    ? "Filter by departmental organization"
                    : "Discover events by category type"}
                </p>
              </div>
              <button
                onClick$={() => (activeFilterPanel.value = null)}
                class="p-2 text-white/30 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* List Content */}
            <div class="p-6 pt-2 pb-10 sm:pb-12 max-h-[60vh] overflow-y-auto cluster-scrollbar">
              <div class="flex flex-wrap items-center justify-center gap-3">
                {(activeFilterPanel.value === "cluster" ? availableClusters : availableFocusForDay).map(item => {
                  const isActive = activeFilterPanel.value === "cluster"
                    ? selectedCluster.value === item
                    : selectedFocus.value === item;

                  const glowColor = isDay3 ? "#ef4444" : isDay2 ? "#eab308" : "#0ea935";

                  return (
                    <button
                      key={item}
                      onClick$={() => selectFilter(activeFilterPanel.value!, item)}
                      class={[
                        "filter-pill group relative rounded-full px-5 py-2.5 sm:px-8 sm:py-3 text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-widest transition-all duration-300",
                        isActive
                          ? "text-black shadow-2xl scale-105"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
                      ]}
                      style={isActive ? `background: ${glowColor}; box-shadow: 0 0 30px ${glowColor}60; border-color: transparent;` : ""}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtle Footer indicator */}
            <div class="p-4 bg-white/5 flex justify-center">
              <div class="flex items-center gap-2">
                <div class="w-1 h-1 rounded-full bg-white/20"></div>
                <span class="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-white/20">Theta Command Center</span>
                <div class="w-1 h-1 rounded-full bg-white/20"></div>
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
                    src={ev.image || (isDay3 ? "/spidy/spidy-event-bg" : isDay2 ? "https://images.unsplash.com/photo-1518837691861-152e4d31716b?q=80&w=1000" : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000")}
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
                    src={isDay3 ? "/spidy/spider-logo.webp" : isDay2 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp"}
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

                  {/* Registration Fee */}
                  {ev.fee && (
                    <div
                      class="flex flex-col rounded-xl md:rounded-2xl p-3 border col-span-2 sm:col-span-1"
                      style={`background: ${c.ring}15; border-color: ${c.ring}40; box-shadow: 0 0 15px ${c.ring}10;`}
                    >
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <svg class="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-white/35 text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest">Reg. Fee</span>
                      </div>
                      <span class="font-bold text-white text-xs md:text-sm">{ev.fee}</span>
                    </div>
                  )}
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
                  <a
                    href={ev.regLink || "/register"}
                    target={ev.regLink ? "_blank" : "_self"}
                    rel={ev.regLink ? "noopener noreferrer" : ""}
                    class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest text-[#06090a] transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    style={`background: ${c.ring}; box-shadow: 0 0 24px ${c.ring}50;`}
                  >
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
