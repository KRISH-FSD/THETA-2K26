const fs = require('fs');
const filePath = 'e:\\THETA\\theta-web\\src\\routes\\events\\index.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Redesign Toggle (Search for the DAY_ORDER mapping block)
const toggleRegex = /\{\/\* 3-Day Toggle Option \*\/\}\s*<div class="relative z-10 mt-4 mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6">[\s\S]*?<\/div>(\s*<\/div>)?/;
const toggleNew = `      {/* ── Cinematic Day Switcher ── */}
      <div class="relative z-20 mt-8 mb-16 flex justify-center">
        <div class="inline-flex items-center p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          {DAY_ORDER.map((day) => (
            <button
              key={day}
              onClick$={() => (selectedDay.value = day)}
              class={[
                "relative px-8 py-3 rounded-full text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all duration-500",
                selectedDay.value === day
                  ? "text-black scale-[1.02]"
                  : "text-white/40 hover:text-white/70",
              ]}
            >
              {selectedDay.value === day && (
                 <div class="absolute inset-0 bg-gradient-to-r from-[#0ea935] to-[#12cb42] rounded-full z-0 shadow-[0_0_24px_rgba(14,169,53,0.4)]"
                      style="will-change: transform;"
                 />
              )}
              <span class="relative z-10">{day}</span>
            </button>
          ))}
        </div>
      </div>`;

content = content.replace(toggleRegex, toggleNew);

// 2. Add Background Glows (Insert after global style block)
const styleEnd = /<\/style>/;
const glows = `</style>

      {/* Global Ambient Glows */}
      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[10%] left-[-10%] h-[70%] w-[40%] bg-[#0ea935] opacity-[0.05] blur-[120px] rounded-full" />
        <div class="absolute bottom-[-10%] right-[-5%] h-[60%] w-[50%] bg-[#00d4ff] opacity-[0.03] blur-[100px] rounded-full" />
      </div>`;
content = content.replace(styleEnd, glows);

// 3. Redesign Event Cards
const cardRegex = /<div\s*key=\{event\.id\}\s*onClick\$=\{\(\) => openEvent\(event\)\}\s*data-cat=\{event\.theme\}[\s\S]*?<\/div>\s*<\/div>/;
const cardNew = `            <div
              key={event.id}
              onClick$={() => openEvent(event)}
              class="event-card group relative flex flex-col rounded-[2rem] overflow-hidden cursor-pointer border border-white/[0.06] bg-[#080a0c]/80 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3"
              style="box-shadow: 0 24px 48px rgba(0,0,0,0.42);"
            >
              {/* Image Header */}
              <div class="relative h-48 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.45] group-hover:brightness-[0.7]"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#080a0c] via-transparent to-transparent z-10" />
                
                {/* Cluster Badge */}
                <span class={\`absolute top-4 left-4 z-20 rounded-full px-3 py-1 text-[0.55rem] font-black uppercase tracking-widest shadow-lg \${c.badge}\`}>
                  {event.cluster}
                </span>

                {/* Status Indicator */}
                <span class="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[0.5rem] font-black text-white/80 uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0ea935] animate-pulse shadow-[0_0_8px_#0ea935]" />
                  Live
                </span>
              </div>

              {/* Card Body */}
              <div class="relative flex flex-col p-6 pt-2">
                {/* Left Accent Border */}
                <div class="absolute left-0 top-0 bottom-0 w-[3px]" style={\`background: \${c.ring}; opacity: 0.6;\`} />

                <h3 class="text-xl font-black text-white mb-3 tracking-tight leading-snug group-hover:text-white transition-colors">
                  {event.name}
                </h3>

                {/* Vitals Block (Roadmap Style) */}
                <div class="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5 shadow-inner">
                  <div class="flex items-center gap-3">
                    <span class="text-lg opacity-80 filter brightness-125">🕒</span>
                    <div class="flex flex-col">
                      <span class="text-[0.5rem] font-black text-white/30 tracking-widest uppercase">Timing</span>
                      <span class="text-[0.72rem] font-bold text-white/90">{event.timing}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-lg opacity-80 filter brightness-125">📍</span>
                    <div class="flex flex-col">
                      <span class="text-[0.5rem] font-black text-white/30 tracking-widest uppercase">Venue</span>
                      <span class="text-[0.72rem] font-bold text-white/90">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info Tags */}
                <div class="mt-auto flex flex-wrap gap-2 opacity-60">
                   <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[0.55rem] font-black text-white/80 uppercase tracking-widest">
                     {getActivityLabel(event.activities)}
                   </span>
                </div>

                {/* Interactive CTA */}
                <div class="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span class="text-[0.6rem] font-black uppercase tracking-[0.2em]" style={\`color: \${c.ring};\`}>Enter Simulation</span>
                  <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/5 group-hover:bg-white/10" style={\`color: \${c.ring};\`}>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>`;

content = content.replace(cardRegex, cardNew);

fs.writeFileSync(filePath, content);
console.log('Events page patched successfully.');
