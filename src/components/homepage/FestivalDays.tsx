import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { usePerfTier } from "~/utils/perf";

interface FestivalDaysProps {
  days: any[];
  events: any[];
}

export const FestivalDays = component$((props: FestivalDaysProps) => {
  const perf = usePerfTier();
  const selectedDay = useSignal<any | null>(null);
  
  const dayAccents = ["#00ff55", "#ffce00", "#ff3131"];
  const dayBorderColors = ["rgba(0, 255, 85, 0.25)", "rgba(255, 206, 0, 0.25)", "rgba(255, 49, 49, 0.25)"];
  const dayCardSurfaces = ["rgba(0, 42, 14, 0.45)", "rgba(42, 34, 0, 0.45)", "rgba(42, 0, 0, 0.45)"];

  const getDayEvents = (name: string) => {
    const alias: any = { "Day One": "Day 1", "Day Two": "Day 2", "Day Three": "Day 3" };
    const search = alias[name] || name;
    return props.events.filter(e => e.day === search);
  };

  useVisibleTask$(() => {
    if (perf.value === "lo") return;
    const canvas = document.querySelector(".festival-days-mesh-web") as HTMLCanvasElement;
    const section = document.getElementById("festival-days");
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = canvas.width = section.offsetWidth;
    let h = canvas.height = section.offsetHeight;
    const particles: any[] = [];
    const count = perf.value === "hi" ? 30 : 15;
    for (let i = 0; i < count; i++) particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0, 255, 85, 0.15)";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  });

  return (
    <section id="festival-days" class="relative py-20 sm:py-32 overflow-hidden bg-black">
      <div class="festival-days-mesh absolute inset-0 z-0">
        {perf.value !== "lo" && <canvas class="festival-days-mesh-web pointer-events-none" />}
        <img src="/backgrounds/sastra-3.png" alt="" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 w-[600px] pointer-events-none" loading="lazy" />
      </div>

      <div class="mx-auto max-w-7xl px-4 relative z-10">
        <div class="text-center mb-16">
          <span class="t-badge mx-auto">Mission Day Selection</span>
          <h2 class="mt-4 text-4xl font-black text-white">Shine in the <span class="text-[#00ff55]">light</span> & rule the <span class="text-[#70f3ff]">night</span></h2>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {props.days.map((day, index) => (
            <div key={day.day} onClick$={() => { selectedDay.value = day; }} class="group relative block overflow-hidden rounded-[2.5rem] border p-8 backdrop-blur-3xl transition-all cursor-pointer hover:scale-[1.02]" style={{ borderColor: `${dayBorderColors[index]}44`, background: dayCardSurfaces[index] }}>
              <img src={index === 2 ? "/spidy/spider-logo.png" : (index === 1 ? "/onepeice/one-peice-logo.png" : "/ben10/ben10-logo.png")} alt="" class="absolute top-1/2 right-0 w-32 opacity-10" loading="lazy" />
              <div class="relative z-10 flex flex-col items-center text-center">
                <span class="text-[10px] font-bold tracking-widest opacity-40">{day.date}</span>
                <h3 class="mt-4 text-4xl font-black" style={{ color: dayAccents[index] }}>{day.day}</h3>
                <p class="mt-2 text-xs opacity-60 uppercase">{day.highlight}</p>
                <Link href={`/roadmap/day${index + 1}`} class="mt-8 text-[10px] font-black underline uppercase" style={{ color: dayAccents[index] }}>Full Roadmap →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDay.value && (
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <div class="absolute inset-0" onClick$={() => { selectedDay.value = null; }} />
          <div class="relative w-full max-w-lg bg-[#0a0f0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-black text-white">{selectedDay.value.day}</h3>
              <button onClick$={() => { selectedDay.value = null; }} class="text-white/40 hover:text-white">✕</button>
            </div>
            <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {getDayEvents(selectedDay.value.day).map((e: any) => (
                <div key={e.id} class="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 class="font-bold text-white">{e.name}</h4>
                  <p class="text-xs opacity-50 mt-1">{e.timing} · {e.location}</p>
                </div>
              ))}
              {getDayEvents(selectedDay.value.day).length === 0 && <p class="text-center opacity-40 py-8">No events announced yet.</p>}
            </div>
            <Link href="/events" class="block mt-8 text-center bg-white/5 hover:bg-white/10 py-3 rounded-xl text-xs font-black uppercase text-white transition-all">View All Events</Link>
          </div>
        </div>
      )}
    </section>
  );
});
