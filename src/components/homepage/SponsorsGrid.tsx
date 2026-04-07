import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { usePerfTier } from "~/utils/perf";

interface SponsorsGridProps {
  sponsors: any;
  copy: any;
}

export const SponsorsGrid = component$((props: SponsorsGridProps) => {
  const perf = usePerfTier();
  const selectedTier = useSignal<string | null>(null);

  const sponsorTiers = [
    { key: "diamond", label: "Diamond" },
    { key: "platinum", label: "Platinum" },
    { key: "gold", label: "Gold" },
    { key: "silver", label: "Silver" },
    { key: "media", label: "Media" },
  ] as const;

  const tierMeta: any = {
    diamond: { accent: "#ff4d4f", glow: "rgba(255, 77, 79, 0.4)", surface: "linear-gradient(160deg, rgba(255, 77, 79, 0.2), rgba(8, 10, 12, 1))" },
    platinum: { accent: "#70f3ff", glow: "rgba(112, 243, 255, 0.4)", surface: "linear-gradient(160deg, rgba(112, 243, 255, 0.18), rgba(8, 12, 14, 1))" },
    gold: { accent: "#ffd54a", glow: "rgba(255, 213, 74, 0.4)", surface: "linear-gradient(160deg, rgba(255, 213, 74, 0.16), rgba(12, 12, 8, 1))" },
    silver: { accent: "#ffffff", glow: "rgba(255, 255, 255, 0.2)", surface: "linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(10, 10, 10, 1))" },
    media: { accent: "#7c5cff", glow: "rgba(124, 92, 255, 0.22)", surface: "linear-gradient(160deg, rgba(124, 92, 255, 0.14), rgba(10, 8, 14, 1))" },
  };

  const marqueeSponsors = sponsorTiers.flatMap((tier) =>
    (props.sponsors[tier.key] || [])
      .filter((s: any) => s.isActive)
      .map((s: any) => ({ ...s, tierKey: tier.key }))
  );

  useVisibleTask$(() => {
    const track = document.querySelector("[data-marquee-track]") as HTMLElement;
    if (!track || perf.value === "lo") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => { track.style.animationPlayState = entry.isIntersecting ? "running" : "paused"; });
      },
      { threshold: 0.05 }
    );
    observer.observe(track);
    return () => observer.disconnect();
  });

  return (
    <section id="sponsors-grid" class="relative py-20 bg-black">
      <div class="mb-12 text-center relative z-10">
        <span class="t-badge flex items-center justify-center gap-2 w-fit mx-auto">
          <span class="h-1.5 w-1.5 bg-[#00ff55] animate-pulse rounded-full" /> Partner Ecosystem
        </span>
        <h2 class="mt-6 text-5xl sm:text-7xl font-black uppercase text-white tracking-tighter">
          Diamond <span class="bg-gradient-to-r from-[#00ff55] to-[#70f3ff] bg-clip-text text-transparent">Partners</span>
        </h2>
      </div>

      <div class="mx-auto max-w-7xl px-4 flex flex-wrap justify-center gap-6 relative z-10">
        {sponsorTiers.map((tier) => (
          <div key={tier.key} onClick$={() => { selectedTier.value = tier.key; }} class="group cursor-pointer p-8 rounded-[2.5rem] border border-white/5 w-64 min-h-[160px] flex flex-col justify-center text-center transition-all hover:-translate-y-2" style={{ background: tierMeta[tier.key].surface, boxShadow: `0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px ${tierMeta[tier.key].glow}` }}>
            <h3 class="text-3xl font-black uppercase" style={{ color: tierMeta[tier.key].accent }}>{tier.label}</h3>
            <span class="mt-4 text-[9px] font-black uppercase opacity-40">Explore {tier.label} →</span>
          </div>
        ))}
      </div>

      {/* Marquee */}
      <div class="mt-20 overflow-hidden relative">
        <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
        <div data-marquee-track class="t-marquee-track flex animate-left py-8">
           {[...marqueeSponsors, ...marqueeSponsors].map((s, i) => (
             <div key={i} class="mx-6 w-32 h-16 bg-white/95 rounded-xl p-3 flex items-center justify-center flex-shrink-0">
               <img src={s.logo} alt={s.name} class="max-h-full max-w-full object-contain" loading="lazy" />
             </div>
           ))}
        </div>
      </div>

      {/* Modal Selection */}
      {selectedTier.value && (
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <div class="absolute inset-0" onClick$={() => { selectedTier.value = null; }} />
          <div 
            class="relative w-full max-w-3xl bg-[#0a0f0a] border border-white/10 rounded-3xl p-10 shadow-2xl"
            style={{ borderColor: `${tierMeta[selectedTier.value].accent}44`, boxShadow: `0 0 100px ${tierMeta[selectedTier.value].glow}` }}
          >
            <div class="flex justify-between items-center mb-8">
              <h3 class="text-3xl font-black uppercase" style={{ color: tierMeta[selectedTier.value].accent }}>{selectedTier.value} Partners</h3>
              <button onClick$={() => { selectedTier.value = null; }} class="text-white/40 hover:text-white">✕</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              {(props.sponsors[selectedTier.value] || []).filter((s:any)=>s.isActive).map((s:any, i:number) => (
                <div key={i} class="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                  <div class="h-12 w-full flex items-center justify-center bg-white p-2 rounded-lg">
                    <img src={s.logo} alt={s.name} class="h-full w-full object-contain" loading="lazy" />
                  </div>
                  <p class="mt-4 text-[9px] font-black uppercase text-white/40">{s.name}</p>
                </div>
              ))}
              {(!props.sponsors[selectedTier.value] || props.sponsors[selectedTier.value].length === 0) && <p class="col-span-full py-8 text-center opacity-40">Coming soon.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
