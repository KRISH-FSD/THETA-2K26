import { component$ } from "@builder.io/qwik";
import gsap from "gsap";
import { useVisibleTask$ } from "@builder.io/qwik";

interface StatsSectionProps {
  stats: any;
  counterDisplay: any;
  copy: any;
}

export const StatsSection = component$((props: StatsSectionProps) => {
  const statSpotlight = [
    { key: "events" as const, eyebrow: "Main Core", signal: "Synced", highlight: "Pulse Ready", accent: "#00ff55", glow: "rgba(0, 255, 85, 0.3)", progress: "88%", note: "Mission Ready" },
    { key: "participants" as const, eyebrow: "Active Transmission", signal: "Online", highlight: "Peak Load", accent: "#70f3ff", glow: "rgba(112, 243, 255, 0.3)", progress: "92%", note: "Verified Data" },
    { key: "colleges" as const, eyebrow: "Network Hub", signal: "Bridged", highlight: "Interlinked", accent: "#ffd54a", glow: "rgba(255, 213, 74, 0.3)", progress: "74%", note: "Uptime 100%" }
  ];

  useVisibleTask$(() => {
    // GSAP animations removed for `theta-stats` to guarantee 60FPS scrolling performance.
    // Animations are natively handled by CSS where necessary.
  });

  return (
    <section id="theta-stats" class="theta-stats-section px-4 py-20 sm:px-6 lg:px-8 bg-[#0a0514] w-full flex flex-col lg:flex-row items-center justify-center overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 max-w-7xl mx-auto items-center w-full">
        <div class="theta-stats-copy-wrap p-10 relative overflow-hidden bg-[#050a05]/40 border border-white/5 backdrop-blur-3xl rounded-[3rem]">
          <div class="theta-stats-copy relative z-10">
            <span class="t-badge flex items-center gap-2 w-fit bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest text-[#00ff55]">
              <span class="h-1.5 w-1.5 rounded-full bg-[#00ff55] animate-pulse shadow-[0_0_8px_#00ff55]" />
              Theta Snapshot
            </span>
            <h2 class="t-heading mt-6 text-6xl font-black uppercase tracking-tighter text-white">
              Fest <span class="bg-gradient-to-r from-[#00ff55] to-[#70f3ff] bg-clip-text text-transparent">Vitals</span>
            </h2>
          </div>

          <div class="theta-stats-visual-wrap relative flex items-center justify-center py-12">
            <div class="relative flex flex-col items-center justify-center">
              <div class="theta-stats-data-stack relative z-10 text-center">
                <span class="text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">Festival Reach</span>
                <strong class="text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mt-2 block">
                  {props.counterDisplay.participants}+
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-center gap-6">
          {statSpotlight.map((item, index) => (
            <article
              key={item.key}
              class="theta-stats-node p-8 relative overflow-hidden bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] transition-all hover:bg-[#0f0f0f]/80"
              style={`--theta-stat-accent:${item.accent}; --theta-stat-glow:${item.glow}; transition-delay:${index * 120}ms`}
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-white/10 text-[2rem] font-black italic absolute right-8 top-4 select-none">0{index + 1}</span>
                <span class="uppercase tracking-[0.25em] text-[9px] text-white/40 font-black">{item.eyebrow}</span>
              </div>
              <div class="relative z-10">
                <h4 class="uppercase tracking-widest text-[10px] font-black text-white/40 mb-1">{props.copy.statsLabels[item.key]}</h4>
                <div class="t-heading text-5xl font-black text-white">{props.counterDisplay[item.key]}+</div>
              </div>
              <div class="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <span class="h-full block" style={`width:${item.progress}; background:${item.accent}; box-shadow: 0 0 15px ${item.accent}`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
