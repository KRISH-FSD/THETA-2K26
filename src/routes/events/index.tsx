import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { gsap } from "gsap";

interface Event {
  id: number;
  name: string;
  category: "tech" | "fun" | "quiz" | "workshop" | "pro-night";
  day: string;
  timing: string;
  location: string;
  fee: string;
  status: "active" | "over" | "coming-soon";
  description: string;
  image: string;
  registrationUrl?: string;
}

const difficultyMap: Record<
  Event["category"],
  "Beginner" | "Intermediate" | "Advanced"
> = {
  workshop: "Beginner",
  quiz: "Intermediate",
  fun: "Intermediate",
  tech: "Advanced",
  "pro-night": "Beginner",
};

export default component$(() => {
  const selectedEvent = useSignal<Event | null>(null);
  const selectedDay = useSignal<string>("Day 1");
  const cyclingIdx = useSignal<number>(0);
  const wordVisible = useSignal<boolean>(true);

  const cycleWords = [
    { word: "REGISTER", color: "#19d64d" },
    { word: "COMPETE", color: "#23a6ff" },
    { word: "CELEBRATE", color: "#ff4d5d" },
  ];

  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      // Fade out & slide up
      wordVisible.value = false;
      setTimeout(() => {
        cyclingIdx.value = (cyclingIdx.value + 1) % cycleWords.length;
        // Fade in & slide into place
        wordVisible.value = true;
      }, 300);
    }, 2200); // Fast interval
    cleanup(() => clearInterval(interval));
  });

  // BEN 10 FEATURED EVENTS (3 DAYS)
  const allEvents: Event[] = [
    // Day 1
    {
      id: 1,
      name: "Omnitrix Core Calibration",
      category: "tech",
      day: "Day 1",
      timing: "10:00 AM - 01:00 PM",
      location: "Galvan Prime Lab",
      fee: "Free",
      status: "active",
      description: "Learn the secrets of calibrating Level 20 alien tech without blowing up the universe. A masterclass in Galvanic engineering.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 2,
      name: "Plumber Tactical Course",
      category: "workshop",
      day: "Day 1",
      timing: "02:00 PM - 05:00 PM",
      location: "Plumber HQ Base",
      fee: "150 Credits",
      status: "active",
      description: "Basic training on how to handle extra-terrestrial threats. Master the Plumber standard-issue blasters and evasion tactics.",
      image: "https://images.unsplash.com/photo-1629835775533-31682702c256?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 3,
      name: "Null Void Navigation",
      category: "quiz",
      day: "Day 1",
      timing: "05:30 PM - 07:00 PM",
      location: "Sector 7G",
      fee: "50 Credits",
      status: "active",
      description: "A comprehensive quiz on identifying dimensional rifts, navigating the Null Void, and avoiding its most dangerous inmates.",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 4,
      name: "Vulpimancer Agility Test",
      category: "fun",
      day: "Day 1",
      timing: "08:00 PM - 10:00 PM",
      location: "Wildmutt's Den",
      fee: "Free",
      status: "active",
      description: "Can you navigate an obstacle course completely blindfolded? Trust your instincts in this physically demanding agility run.",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000",
      registrationUrl: "#",
    },
    // Day 2
    {
      id: 5,
      name: "Galvanic Mechamorph Coding",
      category: "tech",
      day: "Day 2",
      timing: "09:00 AM - 12:00 PM",
      location: "Upgrade Station",
      fee: "200 Credits",
      status: "active",
      description: "A hackathon where you must dynamically rewrite machine code to upgrade older earth-tech into highly advanced alien machinery.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 6,
      name: "Anodite Energy Manipulation",
      category: "workshop",
      day: "Day 2",
      timing: "01:00 PM - 03:30 PM",
      location: "Mana Field",
      fee: "100 Credits",
      status: "active",
      description: "Tap into the latent mana within yourself. A beginner's guide to raw energy constructs and magic-tech integration.",
      image: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 7,
      name: "Taydenite Forging",
      category: "tech",
      day: "Day 2",
      timing: "04:00 PM - 07:00 PM",
      location: "Vulcanus Refinery",
      fee: "300 Credits",
      status: "active",
      description: "Learn how the hardest material in the universe is synthesized and used for cutting-edge structural engineering.",
      image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 8,
      name: "Alien X Debate Simulator",
      category: "fun",
      day: "Day 2",
      timing: "08:00 PM - 10:00 PM",
      location: "Forge of Creation",
      fee: "Free",
      status: "active",
      description: "Convince Bellicus and Serena to agree with you. A philosophical and highly frustrating debate competition.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
      registrationUrl: "#",
    },
    // Day 3
    {
      id: 9,
      name: "Chronosapien Time Management",
      category: "tech",
      day: "Day 3",
      timing: "10:00 AM - 01:00 PM",
      location: "Maltruant's ClockTower",
      fee: "250 Credits",
      status: "active",
      description: "An advanced algorithmic contest where runtime is literally measured by how far you can bend the local timeline.",
      image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 10,
      name: "Appoplexian Anger Management",
      category: "fun",
      day: "Day 3",
      timing: "02:00 PM - 04:00 PM",
      location: "Rath's Arena",
      fee: "Free",
      status: "active",
      description: "LET ME TELL YOU SOMETHING! This is an endurance event to see who can maintain their cool under extreme verbal pressure.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 11,
      name: "Tetramand Combat Tournament",
      category: "pro-night",
      day: "Day 3",
      timing: "05:00 PM - 08:00 PM",
      location: "Khoros Colosseum",
      fee: "Free",
      status: "active",
      description: "The main physical event of the fest. Watch the galaxy's heaviest hitters duke it out in a multi-stage combat bracket.",
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000",
      registrationUrl: "#",
    },
    {
      id: 12,
      name: "DJ Atomix Concert",
      category: "pro-night",
      day: "Day 3",
      timing: "09:00 PM - 11:59 PM",
      location: "Main Stage",
      fee: "500 Credits",
      status: "active",
      description: "Nuclear beats and radioactive drops. The grand finale of the fest featuring earth-shattering electronic music.",
      image: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=1000",
      registrationUrl: "#",
    },
  ];

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
    
    // Animate cards on filter change
    gsap.fromTo(".event-card", 
      { y: 40, opacity: 0, scale: 0.95 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", clearProps: "all" }
    );
  });

  const openEvent = $((event: Event) => {
    selectedEvent.value = event;
  });

  const closeEvent = $(() => {
    selectedEvent.value = null;
  });

  // Filter events based on selected day
  const filteredEvents = allEvents.filter((e) => e.day === selectedDay.value);

  return (
    <div class="relative mx-auto min-h-screen w-full px-4 py-16 sm:px-6 lg:px-8 font-sans bg-[#050505] overflow-hidden">
      <style>{`
        .omnitrix-bg-shell {
          position: relative;
        }

        .omnitrix-bg-image {
          opacity: 0.12;
          filter:
            drop-shadow(0 0 18px rgba(20, 255, 120, 0.08))
            drop-shadow(0 0 42px rgba(14, 169, 53, 0.08))
            drop-shadow(0 0 88px rgba(14, 169, 53, 0.04));
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
              drop-shadow(0 0 18px rgba(110, 255, 158, 0.12))
              drop-shadow(0 0 46px rgba(14, 169, 53, 0.12))
              drop-shadow(0 0 96px rgba(14, 169, 53, 0.08));
          }

          86% {
            opacity: 0.26;
            filter:
              saturate(1.32)
              brightness(1.24)
              contrast(1.12)
              drop-shadow(0 0 24px rgba(168, 255, 196, 0.18))
              drop-shadow(0 0 58px rgba(50, 255, 104, 0.18))
              drop-shadow(0 0 124px rgba(14, 169, 53, 0.12));
          }

          90% {
            opacity: 0.21;
            filter:
              saturate(1.22)
              brightness(1.16)
              contrast(1.09)
              drop-shadow(0 0 20px rgba(132, 255, 172, 0.14))
              drop-shadow(0 0 50px rgba(36, 224, 88, 0.14))
              drop-shadow(0 0 104px rgba(14, 169, 53, 0.1));
          }

          94% {
            opacity: 0.3;
            filter:
              saturate(1.42)
              brightness(1.32)
              contrast(1.14)
              drop-shadow(0 0 28px rgba(214, 255, 224, 0.22))
              drop-shadow(0 0 70px rgba(82, 255, 126, 0.2))
              drop-shadow(0 0 140px rgba(14, 169, 53, 0.14));
          }
        }
      `}</style>
      {/* Background Parallax Layer */}
      <div id="parallax-bg-container" class="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
         {/* Deep shadow / glow behind logo */}
         <div class="absolute w-[60vw] h-[60vw] bg-[#0ea935] opacity-[0.05] blur-[150px] rounded-full mix-blend-screen"></div>
         <div class="omnitrix-bg-shell flex items-center justify-center">
           <img
             id="parallax-bg-image"
             src="/ben10/ben10-logo.png"
             alt="Ben 10 Background Logo"
             class="omnitrix-bg-image w-[90vw] sm:w-[50vw] object-contain contrast-150 grayscale mix-blend-screen scale-110"
           />
           <img
             src="/ben10/ben10-logo.png"
             alt=""
             aria-hidden="true"
             class="omnitrix-bg-core w-[90vw] sm:w-[50vw] object-contain scale-110"
           />
         </div>
      </div>

      <div class="relative z-10 mx-auto max-w-5xl text-center space-y-0 pt-12 mb-20">
        {/* Label pill */}
        <p class="inline-block rounded-full bg-[#0ea935]/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#0ea935] uppercase border border-[#0ea935]/20 shadow-[0_0_15px_rgba(14,169,53,0.2)] mb-6">
          Alien Archive
        </p>

        {/* Static main title */}
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-none pb-3">
          <span class="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/30">THETA FEST </span>
          <span
            class="text-transparent bg-clip-text"
            style="background-image: linear-gradient(135deg, #0ea935 0%, #12cb42 50%, #0ea935 100%); filter: drop-shadow(0 0 18px rgba(14,169,53,0.45));"
          >
            2K26
          </span>
        </h1>

        <div class="flex items-center justify-center gap-4 mt-4 mb-6 min-h-[3.75rem] overflow-hidden">
          <span class="text-white/25 text-2xl md:text-4xl font-black tracking-[0.14em]">-</span>
          <div class="relative overflow-hidden">
            <span
              style={`
                font-family: var(--font-hero-ui, 'Rajdhani', sans-serif);
                font-weight: 700;
                font-size: clamp(2rem, 4.5vw, 3.2rem);
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: ${cycleWords[cyclingIdx.value].color};
                text-shadow: 0 0 26px ${cycleWords[cyclingIdx.value].color}45;
                line-height: 1;
                display: inline-block;
                opacity: ${wordVisible.value ? 1 : 0};
                transform: ${wordVisible.value ? 'translateY(0) scale(1)' : 'translateY(-18px) scale(0.96)'};
                filter: blur(${wordVisible.value ? '0px' : '6px'});
                transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
              `}
            >
              {cycleWords[cyclingIdx.value].word}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p class="text-[#8ca38c] text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Accessing Galvan Prime event schedules. Browse three days of alien-grade trials.
        </p>
      </div>

      {/* 3-Day Toggle Option */}
      <div class="relative z-10 flex items-center justify-center gap-3 sm:gap-6 mb-20 flex-wrap">
        {["Day 1", "Day 2", "Day 3"].map((day) => (
          <button
            key={day}
            onClick$={() => (selectedDay.value = day)}
            class={[
              "relative overflow-hidden px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300",
              selectedDay.value === day
                ? "text-black shadow-[0_0_30px_rgba(14,169,53,0.3)] scale-[1.03]"
                : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10",
            ]}
          >
            {selectedDay.value === day && (
               <div class="absolute inset-0 bg-gradient-to-r from-[#0ea935] to-[#12cb42] z-0"></div>
            )}
            <span class="relative z-10">{day}</span>
          </button>
        ))}
      </div>

      {/* Events Grid – Ben 10 Premium Cards */}
      <div class="relative z-10 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {filteredEvents.map((event) => {
          const catColors: Record<string, { border: string; glow: string; badge: string; ring: string }> = {
            tech:       { border: "border-[#00d4ff]/40",  glow: "rgba(0,212,255,0.25)",    badge: "bg-[#00d4ff] text-black",       ring: "#00d4ff" },
            workshop:   { border: "border-[#ff9500]/40",  glow: "rgba(255,149,0,0.25)",    badge: "bg-[#ff9500] text-black",       ring: "#ff9500" },
            quiz:       { border: "border-[#bf5af2]/40",  glow: "rgba(191,90,242,0.25)",   badge: "bg-[#bf5af2] text-white",       ring: "#bf5af2" },
            fun:        { border: "border-[#0ea935]/40",  glow: "rgba(14,169,53,0.25)",    badge: "bg-[#0ea935] text-black",       ring: "#0ea935" },
            "pro-night":{ border: "border-[#ff375f]/40",  glow: "rgba(255,55,95,0.25)",    badge: "bg-[#ff375f] text-white",       ring: "#ff375f" },
          };
          const c = catColors[event.category] ?? catColors["fun"];

          return (
            <div
              key={event.id}
              onClick$={() => openEvent(event)}
              data-cat={event.category}
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
                <span class={`absolute top-4 left-4 z-30 rounded-full px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest shadow-lg ${c.badge}`}>
                  {event.category}
                </span>

                {/* LIVE indicator */}
                <span class="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1 text-[0.6rem] font-black text-white uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0ea935] animate-pulse"></span>
                  LIVE
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
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.6rem] font-bold text-white/80 uppercase tracking-widest whitespace-nowrap">
                    {event.timing.split(' - ')[0]}
                  </span>
                  <span class="rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest whitespace-nowrap"
                        style={`border-color: ${c.ring}50; color: ${c.ring};`}>
                    {event.fee}
                  </span>
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.6rem] font-bold text-white/80 uppercase tracking-widest whitespace-nowrap">
                    {difficultyMap[event.category]}
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

      {/* ═══════════════════════════════════════════════════
            EVENT DETAILS MODAL — CINEMATIC BEN 10 EDITION
          ═══════════════════════════════════════════════════ */}
      {selectedEvent.value && (() => {
        const ev = selectedEvent.value!;
        const catColor: Record<string, { ring: string; badge: string; border: string; glow: string }> = {
          tech:        { ring: "#00d4ff", badge: "bg-[#00d4ff] text-black", border: "border-[#00d4ff]/40", glow: "rgba(0,212,255,0.18)" },
          workshop:    { ring: "#ff9500", badge: "bg-[#ff9500] text-black", border: "border-[#ff9500]/40", glow: "rgba(255,149,0,0.18)" },
          quiz:        { ring: "#bf5af2", badge: "bg-[#bf5af2] text-white", border: "border-[#bf5af2]/40", glow: "rgba(191,90,242,0.18)" },
          fun:         { ring: "#0ea935", badge: "bg-[#0ea935] text-black", border: "border-[#0ea935]/40", glow: "rgba(14,169,53,0.18)" },
          "pro-night": { ring: "#ff375f", badge: "bg-[#ff375f] text-white", border: "border-[#ff375f]/40", glow: "rgba(255,55,95,0.18)" },
        };
        const c = catColor[ev.category] ?? catColor["fun"];

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
                  <span class={`rounded-full px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest shadow-lg ${c.badge}`}>
                    {ev.category}
                  </span>
                  <span
                    class="rounded-full px-3 py-1.5 text-[0.65rem] font-bold border text-white/90 uppercase tracking-widest"
                    style={`border-color: ${c.ring}50; background: ${c.ring}12;`}
                  >
                    {difficultyMap[ev.category]}
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
                    ◉ Alien Archive / {ev.day}
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
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Location</span>
                    </div>
                    <span class="font-bold text-white/90 text-sm">{ev.location}</span>
                  </div>

                  {/* Timeframe */}
                  <div
                    class="flex flex-col rounded-2xl p-4 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}20;`}
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Timeframe</span>
                    </div>
                    <span class="font-bold text-white/90 text-sm">{ev.timing}</span>
                  </div>

                  {/* Access fee */}
                  <div
                    class="col-span-2 flex flex-col rounded-2xl p-4 border"
                    style={`background: ${c.ring}08; border-color: ${c.ring}25;`}
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={`color: ${c.ring};`}>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span class="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">Access Fee</span>
                    </div>
                    <span
                      class="text-2xl font-black leading-none"
                      style={`color: ${c.ring}; text-shadow: 0 0 20px ${c.ring}60;`}
                    >
                      {ev.fee}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={ev.registrationUrl}
                  class="relative overflow-hidden block w-full text-center rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-[0.15em] text-black transition-all duration-300 hover:-translate-y-1 group/cta"
                  style={`background: linear-gradient(135deg, ${c.ring} 0%, ${c.ring}cc 100%); box-shadow: 0 0 30px ${c.ring}40;`}
                >
                  {/* Shimmer */}
                  <span class="absolute inset-0 translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
                  <span class="relative z-10">Initialize Access Portal →</span>
                </a>

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
        "Initialize access to the Galvan Prime archives. Browse Ben 10 events over 3 days.",
    },
  ],
};

