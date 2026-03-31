import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

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

  useVisibleTask$(({ track }) => {
    track(() => selectedEvent.value);
    if (!selectedEvent.value) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectedEvent.value = null;
    };

    if (selectedEvent.value) {
      document.body.style.overflow = "hidden";
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  });

  const openEvent = $((event: Event) => {
    selectedEvent.value = event;
  });

  const closeEvent = $(() => {
    selectedEvent.value = null;
  });

  // Filter events based on selected day
  const filteredEvents = allEvents.filter(e => e.day === selectedDay.value);

  return (
    <div class="relative mx-auto min-h-screen w-full px-4 py-16 sm:px-6 lg:px-8 font-sans text-[#f0fff0] bg-[#050505]">
      {/* Background Orbs */}
      <div class="pointer-events-none fixed top-[10%] left-[-10%] h-[40rem] w-[40rem] rounded-full bg-[#0ea935] opacity-[0.04] blur-[150px]"></div>
      <div class="pointer-events-none fixed bottom-[10%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#077a23] opacity-[0.06] blur-[120px]"></div>

      <div class="relative z-10 mx-auto max-w-5xl text-center space-y-4 pt-4 mb-16">
        <p class="text-sm font-black tracking-[0.3em] text-[#0ea935] uppercase drop-shadow-[0_0_8px_rgba(14,169,53,0.6)]">
          Alien Archive
        </p>
        <h1 class="text-5xl font-extrabold sm:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-[#0ea935] via-[#ffffff] to-[#077a23] drop-shadow-[0_0_12px_rgba(14,169,53,0.4)] tracking-tight">
          Theta Protocols
        </h1>
        <p class="text-[#8ca38c] text-lg max-w-2xl mx-auto font-medium">
          Accessing Galvan Prime database schedules. Initialize your path through the upcoming three days of intensive trials.
        </p>
      </div>

      {/* 3-Day Toggle Option */}
      <div class="relative z-10 flex items-center justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
        {["Day 1", "Day 2", "Day 3"].map((day) => (
          <button
            key={day}
            onClick$={() => (selectedDay.value = day)}
            class={[
              "px-6 sm:px-10 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300",
              selectedDay.value === day
                ? "bg-[#0ea935] text-[#050505] shadow-[0_0_20px_rgba(14,169,53,0.5)] border-2 border-[#0ea935] scale-105"
                : "bg-[#0a0a0a] text-[#8ca38c] border-2 border-[#0ea935]/20 hover:border-[#0ea935]/60 hover:text-[#f0fff0] hover:bg-[#0ea935]/5 hover:shadow-[0_0_15px_rgba(14,169,53,0.2)]",
            ]}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Events Grid - Small proper alignment */}
      <div class="relative z-10 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {filteredEvents.map((event) => {
          return (
            <div
              key={event.id}
              onClick$={() => openEvent(event)}
              class="group relative overflow-hidden rounded-3xl border border-[#0ea935]/20 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-2 hover:border-[#0ea935]/60 hover:shadow-[0_12px_30px_rgba(14,169,53,0.2)] flex flex-col cursor-pointer"
            >
              {/* Image Header */}
              <div class="h-44 w-full overflow-hidden relative border-b border-[#0ea935]/20">
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
                <img
                  src={event.image}
                  alt={event.name}
                  class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110 filter brightness-[0.7] group-hover:brightness-100 contrast-125 grayscale-[40%] group-hover:grayscale-0"
                  loading="lazy"
                />
                
                {/* Float badges */}
                <div class="absolute top-3 left-3 z-20 flex gap-2">
                  <span class="rounded-full border border-black/40 bg-[#0ea935] px-3 py-1 text-[0.6rem] font-black text-[#050505] tracking-wider uppercase shadow-[0_2px_10px_rgba(14,169,53,0.8)]">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <div class="p-5 flex flex-col flex-1">
                <h3 class="text-xl font-black text-[#f0fff0] mb-2 leading-tight group-hover:text-[#0ea935] transition-colors line-clamp-2">
                  {event.name}
                </h3>
                
                <p class="text-[#8ca38c] text-xs leading-relaxed mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div class="mt-auto space-y-2">
                  <div class="flex items-center justify-between text-xs font-bold bg-[#111] rounded-xl p-2.5 border border-[#0ea935]/10">
                    <span class="text-[#4d5c4d] tracking-widest uppercase text-[0.6rem]">Time</span>
                    <span class="text-[#f0fff0]">{event.timing.split(' - ')[0]}</span>
                  </div>
                  
                  <div class="flex items-center justify-between text-xs font-bold bg-[#111] rounded-xl p-2.5 border border-[#0ea935]/10">
                    <span class="text-[#4d5c4d] tracking-widest uppercase text-[0.6rem]">Credit</span>
                    <span class="text-[#0ea935]">{event.fee}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedEvent.value && (
        <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <div
            class="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl transition-opacity"
            onClick$={closeEvent}
            aria-hidden="true"
          ></div>
          <div class="relative z-20 w-full max-w-2xl rounded-[2.5rem] border-2 border-[#0ea935]/50 bg-[#0a0a0a] p-8 md:p-10 shadow-[0_0_80px_rgba(14,169,53,0.25)] scale-100 animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#0ea935] to-transparent opacity-50"></div>
            
            <button
              onClick$={closeEvent}
              class="absolute top-6 right-6 text-[#8ca38c] hover:text-[#0ea935] bg-[#111] hover:bg-[#0ea935]/10 rounded-full p-2.5 transition-all duration-200 z-30"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div class="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8">
                {/* Left side info */}
                <div>
                   <div class="flex gap-2 mb-4">
                     <span class="rounded-full border border-[#0ea935]/50 bg-[#0ea935]/10 px-3 py-1 text-[0.6rem] font-bold text-[#0ea935] tracking-widest uppercase shadow-[0_0_10px_rgba(14,169,53,0.2)]">
                       {selectedEvent.value.day}
                     </span>
                     <span class="rounded-full border border-[#8ca38c]/30 bg-[#111] px-3 py-1 text-[0.6rem] font-bold text-[#8ca38c] tracking-widest uppercase">
                       {difficultyMap[selectedEvent.value.category]}
                     </span>
                   </div>
                   
                   <h3 class="text-3xl md:text-4xl font-black text-[#0ea935] mb-3 tracking-tight pr-6 leading-none">
                     {selectedEvent.value.name}
                   </h3>
                   
                   <p class="text-sm text-[#8ca38c] mb-8 font-medium leading-relaxed">
                     {selectedEvent.value.description}
                   </p>
                </div>
                
                {/* Right side stats */}
                <div class="flex flex-col justify-center space-y-3">
                   <div class="flex flex-col bg-[#111] p-3 rounded-2xl border border-[#0ea935]/10">
                     <span class="text-[#4d5c4d] uppercase text-[0.6rem] font-black tracking-widest mb-1">Sector (Location)</span>
                     <span class="font-bold text-[#f0fff0] text-sm tracking-wide">{selectedEvent.value.location}</span>
                   </div>
                   <div class="flex flex-col bg-[#111] p-3 rounded-2xl border border-[#0ea935]/10">
                     <span class="text-[#4d5c4d] uppercase text-[0.6rem] font-black tracking-widest mb-1">Timeframe</span>
                     <span class="font-bold text-[#f0fff0] text-sm tracking-wide">{selectedEvent.value.timing}</span>
                   </div>
                   <div class="flex flex-col bg-[#111] p-3 rounded-2xl border border-[#0ea935]/10">
                     <span class="text-[#4d5c4d] uppercase text-[0.6rem] font-black tracking-widest mb-1">Required Credits</span>
                     <span class="font-black text-[#0ea935] text-lg tracking-wide drop-shadow-[0_0_5px_rgba(14,169,53,0.5)]">{selectedEvent.value.fee}</span>
                   </div>
                   
                   <a
                     href={selectedEvent.value.registrationUrl}
                     class="mt-4 block w-full text-center rounded-2xl bg-[#0ea935] px-4 py-3.5 text-sm font-black text-[#050505] shadow-[0_0_20px_rgba(14,169,53,0.4)] transition-all duration-300 hover:bg-[#12cb42] hover:shadow-[0_0_30px_rgba(14,169,53,0.6)] hover:-translate-y-1 uppercase tracking-widest"
                   >
                     Initialize Access
                   </a>
                </div>
            </div>
          </div>
        </div>
      )}
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
