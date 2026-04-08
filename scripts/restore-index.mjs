import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const filePath = 'e:/THETA/theta-web/src/routes/index.tsx';
const originalContent = readFileSync(filePath, 'utf-8');

// I'll reconstruct it based on the chunks I have.
// Since I cannot read the old file anymore (it's overwritten), 
// I'll use the chunks I previously viewed in the log.

// I'll take lines 1-800 from the current file (they are fine).
const lines = originalContent.split('\n');
const startLines = lines.slice(0, 800);

// Reconstructed middle part (801-879) and end part (880-1428).
// I'll use the strings I have from Turn 1.

const middleAndEnd = `          }
        ` + '`}' + `</style>

        {/* Global Mesh Background for this section */}
        <div class="festival-days-mesh absolute inset-0 z-0">
          {!mobilePerfMode.value && <canvas class="festival-days-mesh-web pointer-events-none" />}
          <div class="festival-days-logo-glow" aria-hidden="true">
            <img src="/backgrounds/sastra-3.webp" alt="" class="festival-days-logo-mark" loading="lazy" />
          </div>
        </div>

        <div class="festival-days-backdrop" aria-hidden="true">
          <div class="festival-days-aurora festival-days-aurora--a" />
          <div class="festival-days-aurora festival-days-aurora--b" />
          <div class="festival-days-aurora festival-days-aurora--c" />
          <div class="festival-days-vignette" />
        </div>

        <div class="festival-days-shell__inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          <div class="festival-header-wrap mb-14 text-center relative z-20 sm:mb-16">
            <div class="overflow-hidden mb-4">
              <span class="t-badge mx-auto reveal-slide-up block w-fit">Mission Day Selection</span>
            </div>
            <h2 class="festival-title mt-2 text-[clamp(1.5rem,3.2vw,2.2rem)] leading-[1.1] relative">
              <span class="festival-title__line">
                <span class="festival-title__base">Shine in the </span>
                <span class="festival-title__accent festival-title__accent--light">light</span>
                <span class="festival-title__base"> &amp; rule the </span>
                <span class="festival-title__accent festival-title__accent--night">night</span>
              </span>
            </h2>
            <div class="overflow-hidden mt-6">
              <p class="block text-sm font-bold tracking-[0.38em] uppercase text-[var(--t-muted)] italic sm:text-[0.95rem]">Track live transmission frequencies</p>
            </div>
          </div>

          <div class="festival-days-mesh relative z-10">
            <div class="grid gap-5 sm:gap-6 lg:grid-cols-3">
              {configData.value.days.map((day, index) => (
                <Link key={day.day} href={`/roadmap/day` + '${index + 1}' + `} data-tilt onMouseMove$={(e, el) => {
                  if (mobilePerfMode.value) return;
                  const r = el.getBoundingClientRect();
                  el.style.setProperty("--mouse-x", ` + '`${e.clientX - r.left}px`' + `);
                  el.style.setProperty("--mouse-y", ` + '`${e.clientY - r.top}px`' + `);
                }} class="t-day-card group block overflow-hidden rounded-[2rem] border p-6 backdrop-blur-3xl transition-all reveal-up sm:p-7"
                  style={{
                    borderColor: ` + '`${dayBorderColors[index]}44`' + `,
                    transitionDelay: ` + '`${index * 80}ms`' + `,
                    transitionDuration: "700ms",
                    background: dayCardSurfaces[index],
                    "--day-accent": dayAccents[index],
                    "--day-gradient": dayGradients[index],
                    "--day-surface": dayCardSurfaces[index],
                    "--day-glow": dayCardGlow[index],
                    boxShadow: ` + '`inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.34), 0 0 0 1px ${dayBorderColors[index].replace("0.25", "0.14")}`' + `
                  }}>
                  <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/10 pointer-events-none z-0" />
                  <img
                    src={index === 2 ? "/spidy/spider-logo.webp" : (index === 1 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp")}
                    alt=""
                    aria-hidden="true"
                    class="t-day-card__mark absolute top-1/2"
                    loading="lazy"
                    style={{
                      width: index === 0 ? "10.4rem" : (index === 1 ? "9.8rem" : "10rem"),
                      right: index === 0 ? "-0.35rem" : (index === 1 ? "0.15rem" : "0.2rem"),
                      opacity: index === 1 ? 0.28 : 0.22,
                      filter: index === 1
                        ? "brightness(1.12) grayscale(0.02) contrast(1.02)"
                        : "brightness(1.08) grayscale(0.08) contrast(1.02)",
                      top: index === 0 ? "53%" : (index === 1 ? "58%" : "52%")
                    }}
                  />
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent z-0" />
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ background: ` + '`radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), ${dayAccents[index]}12, transparent 42%)`' + ` }} />

                  {/* Layer 1: Base Visibility */}
                  <div class="relative z-10 flex h-full flex-col items-center text-center">
                    <div class="mb-10 flex justify-center">
                      <span class="t-label t-day-card__date">{day.date}</span>
                    </div>
                    <div class="mb-8 text-center">
                      <h3 class="t-heading text-4xl sm:text-5xl font-black"
                        style={{
                          background: dayGradients[index],
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}>{day.day}</h3>
                      <p class="t-day-card__meta mt-2 text-[10px] uppercase tracking-widest">{day.highlight}</p>
                    </div>
                    <div class="mb-10 flex flex-wrap justify-center gap-2">
                      {day.events.slice(0, 3).map(e => <span key={e} class="t-day-card__tag rounded-lg px-3 py-1.5 text-[9px] uppercase font-black">{e}</span>)}
                    </div>
                    <div class="flex-grow" />
                    <div class="t-day-card__line flex w-full flex-col items-center gap-3 border-t pt-6 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="h-1 w-1 rounded-full animate-pulse" style={{ background: dayAccents[index], boxShadow: ` + '`0 0 5px ${dayAccents[index]}`' + ` }} />
                        <span class="t-day-card__meta text-[9px] uppercase">Mission Files: {day.events.length}</span>
                      </div>
                      <span class="flex items-center justify-center gap-1.5 text-[10px] font-black transition-transform group-hover:translate-x-2"
                        style={{
                          background: dayGradients[index],
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}>TRANSMISSION <span class="text-lg">→</span></span>
                    </div>
                  </div>

                  {/* Layer 2: Knockout Overlay (Black text on white logo) */}
                  <div
                    class="t-knockout-overlay absolute inset-x-8 inset-y-8 flex h-full flex-col items-center text-center pointer-events-none z-20"
                    style={{
                      WebkitMaskImage: ` + '`url(${index === 2 ? "/spidy/spider-logo.webp" : (index === 1 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp")})`' + `,
                      WebkitMaskSize: index === 0 ? "11rem" : (index === 1 ? "11rem" : "10.5rem"),
                      WebkitMaskPosition: ` + '`right ${index === 2 ? "-1.5rem" : (index === 1 ? "-2rem" : "-1rem")} center`' + `,
                      WebkitMaskRepeat: "no-repeat",
                      maskImage: ` + '`url(${index === 2 ? "/spidy/spider-logo.webp" : (index === 1 ? "/onepeice/one-peice-logo.webp" : "/ben10/ben10-logo.webp")})`' + `,
                      maskSize: index === 0 ? "11rem" : (index === 1 ? "11rem" : "10.5rem"),
                      maskPosition: ` + '`right ${index === 2 ? "-1.5rem" : (index === 1 ? "-2rem" : "-1rem")} center`' + `,
                      maskRepeat: "no-repeat"
                    }}
                  >
                    <div class="flex justify-between mb-10 opacity-0"> {/* Hide icons in knockout */}
                    </div>
                    <div class="mb-8 text-center">
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTOR DIVIDER: ROADMAP TO STATS ═══════════════ */}
      <div class="relative w-full h-px bg-gradient-to-r from-transparent via-[#70f3ff]/30 to-transparent my-10 sm:my-16">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1 rounded-full border border-[#70f3ff]/20 bg-black backdrop-blur-md text-[9px] font-black uppercase tracking-[0.4em] text-[#70f3ff] shadow-[0_0_15px_rgba(112,243,255,0.1)]">
          Quantum Telemetry Active
        </div>
      </div>

      {/* ═══════════════ STATS ═══════════════ */}
      <section id="theta-stats" class="theta-stats-section px-4 py-12 sm:px-6 lg:px-8 lg:py-0 bg-[#0a0514] min-h-screen lg:min-h-0 lg:h-screen w-full flex flex-col lg:flex-row items-center justify-center overflow-hidden">
        <div class="theta-stats-bento grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 sm:gap-10 max-w-[125rem] mx-auto h-auto lg:h-full lg:max-h-[85vh] items-center w-full">

          {/* --- BENTO CARD: VISUAL & TITLE --- */}
          <div class="theta-bento-card theta-bento-card--visual reveal-left flex flex-col justify-between p-8 sm:p-10 h-full min-h-[450px] relative overflow-hidden bg-[#050a05]/40 border border-white/5 backdrop-blur-3xl rounded-[3rem]">
            <img src="/theta-logo.webp" alt="" class="theta-bento-card__watermark opacity-[0.03]" aria-hidden="true" loading="lazy" />

            <div class="theta-stats-copy relative z-10">
              <span class="t-badge flex items-center gap-2 w-fit bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest text-[#00ff55]">
                <span class="h-1.5 w-1.5 rounded-full bg-[#00ff55] animate-pulse shadow-[0_0_8px_#00ff55]" />
                Theta Snapshot
              </span>
              <h2 class="theta-stats-copy__title t-heading mt-4 text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white">
                Fest <span class="bg-gradient-to-r from-[#00ff55] to-[#70f3ff] bg-clip-text text-transparent">Vitals</span>
              </h2>
            </div>

            <div class="theta-stats-visual-wrap relative flex flex-1 items-center justify-center py-8">
              <div class="theta-stats-visual-container relative flex flex-col items-center justify-center scale-90 sm:scale-110">
                {/* --- QUANTUM ENERGY CORE (BACKGROUND) --- */}
                <div
                  class="theta-stats-core theta-stats-core--quantum group absolute inset-0 m-auto"
                  style={{
                    transform: ` + '`perspective(1200px) rotateX(var(--sphere-rx, 0deg)) rotateY(var(--sphere-ry, 0deg))`' + `,
                    transition: "transform 0.1s ease-out"
                  }}
                >
                  <div class="theta-stats-core__hexagon border-[#00ff55]/20" aria-hidden="true" />
                  <div class="theta-stats-core__rings" aria-hidden="true">
                    <div class="theta-stats-core__ring border-[#00ff55]/30" />
                    <div class="theta-stats-core__ring border-[#70f3ff]/20" />
                  </div>
                  <div class="theta-stats-core__laser-scan bg-gradient-to-b from-transparent via-[#00ff55]/40 to-transparent" aria-hidden="true" />
                  {/* Removed theta-stats-core__grid squares to prevent lag */}
                  <div class="theta-stats-core__shimmer-rim" aria-hidden="true" />
                </div>

                {/* --- DATA HERO (FOREGROUND) --- */}
                <div class="theta-stats-data-stack relative z-10 flex flex-col items-center justify-center text-center min-h-[220px]">
                  <div class="theta-stats-core__copy">
                    <span class="theta-stats-core__label text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">Festival Reach</span>
                    <strong class="theta-stats-core__value text-6xl sm:text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mt-2 block">
                      {counterDisplay.value.participants}+
                    </strong>
                  </div>

                  <div class="theta-stats-pulse-wrap mt-6">
                    <div class="theta-stats-core__status bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-widest text-[#00ff55] flex items-center gap-2">
                      <span class="theta-stats-core__status-dot h-2 w-2 bg-[#00ff55] shadow-[0_0_12px_#00ff55] rounded-full animate-ping" />
                      Live registration pulse
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BRAND INTEGRATION --- */}
            <div class="theta-stats-brand-row flex flex-row items-center justify-center gap-6 sm:gap-12 mt-auto pt-6 z-20 w-full relative">
              <img
                src="/theta-logo.webp"
                alt="Theta Logo"
                loading="lazy"
                class="h-20 sm:h-28 w-auto object-contain brightness-0 invert opacity-60"
              />
              <div class="h-8 sm:h-12 w-[1px] bg-white/10" aria-hidden="true" />
              <img
                src="/sponsors/general/sastra-university-logo.jpg"
                alt="SASTRA University"
                loading="lazy"
                class="h-8 sm:h-12 w-auto object-contain rounded-md opacity-60"
              />
            </div>
          </div>

          {/* --- BENTO GRID: STATS RAIL --- */}
          <div class="theta-stats-side-right h-full flex flex-col justify-center gap-6">
            {statSpotlight.map((item, index) => (
              <article
                key={item.key}
                class="theta-bento-card theta-bento-card--stat theta-stats-node reveal-right p-6 sm:p-8 relative overflow-hidden bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] transition-all hover:bg-[#0f0f0f]/80"
                style={` + '`--theta-stat-accent:${item.accent}; --theta-stat-glow:${item.glow}; transition-delay:${index * 120}ms`' + `
              >
                <div class="theta-stats-node__meta mb-3 flex items-center justify-between">
                  <span class="theta-stats-node__index text-white/10 text-[2rem] font-black italic absolute right-8 top-4 select-none">0{index + 1}</span>
                  <span class="theta-stats-node__eyebrow uppercase tracking-[0.25em] text-[9px] text-white/40 font-black">{item.eyebrow}</span>
                </div>
                <div class="relative z-10">
                  <h4 class="theta-stats-node__label uppercase tracking-widest text-[10px] font-black text-white/40 mb-1">{homeCopy.value.statsLabels[item.key]}</h4>
                  <div class="theta-stats-node__value t-heading text-4xl sm:text-5xl font-black text-white">{counterDisplay.value[item.key]}+</div>

                  <div class="flex items-center gap-3 mt-4">
                    <div class="theta-stats-node__signal text-[9px] py-1 px-3 border border-white/10 rounded-full font-black text-[#70f3ff]/60 uppercase tracking-widest">{item.signal}</div>
                    <span class="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none translate-y-[1px]">{item.note}</span>
                  </div>
                </div>

                <div class="theta-stats-node__meter mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <span class="theta-stats-node__meter-fill h-full block" style={` + '`width:${item.progress}; background:${item.accent}; box-shadow: 0 0 15px ${item.accent}`' + ` />
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════ SECTOR DIVIDER: STATS TO SPONSORS ═══════════════ */}
      <div class="relative w-full h-px bg-gradient-to-r from-transparent via-[#0ea935]/30 to-transparent my-10 sm:my-16">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1 rounded-full border border-[#0ea935]/20 bg-black backdrop-blur-md text-[9px] font-black uppercase tracking-[0.4em] text-[#0ea935] shadow-[0_0_15px_rgba(14,169,53,0.1)]">
          Partner Ecosystem Signal
        </div>
      </div>

      {/* ═══════════════ SPONSORS ═══════════════ */}
      <div class="relative w-full overflow-hidden bg-transparent">
        {/* Focused Background Elements */}
        <div class="absolute inset-0 z-0 pointer-events-none select-none">
          {/* Glowing Ben 10 Watch Watermark */}
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] opacity-[0.04] grayscale invert brightness-[2] flex items-center justify-center">
            <div class="absolute inset-0 bg-[#0ea935] blur-[100px] opacity-[0.1]" />
            <img
              src="/ben10/ben10-logo.webp"
              alt=""
              loading="lazy"
              class={` + '`w-full h-full object-contain ${mobilePerfMode.value ? "" : "filter drop-shadow-[0_0_80px_rgba(14,169,53,0.3)] animate-pulse"}`' + `
              style="animation-duration: 6s;"
            />
          </div>

          {!mobilePerfMode.value && (
            <>
              {/* Vivid Red Bubble - Top Left (Diamond Focus) */}
              <div class="absolute top-[-5%] left-[-10%] w-[550px] h-[550px] rounded-full border border-[#ff4d4f]/30 bg-gradient-to-br from-[#ff4d4f]/25 to-transparent backdrop-blur-[50px] opacity-70" />

              {/* Glowing Tech Accent - Center Left */}
              <div class="absolute top-[45%] left-[5%] w-10 h-10 border-2 border-[#0ea935]/60 rounded-lg opacity-60 blur-[1px]" />
              <div class="absolute top-[47%] left-[6.5%] w-4 h-4 bg-[#0ea935] opacity-80 rounded-full shadow-[0_0_20px_#0ea935]" />
            </>
          )}
        </div>

        <section id="sponsors-grid" class="relative z-10 mx-auto max-w-7xl px-4 py-8 bg-transparent sm:px-6 sm:py-16 lg:px-8">
          <div class="mb-12 text-center relative z-10">
            <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-6 hover:border-white/20 transition-all duration-500 group cursor-default">
              <span class="w-2 h-2 rounded-full bg-[#0ea935] animate-pulse shadow-[0_0_8px_#0ea935]" />
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/70 transition-colors">Partner Ecosystem</span>
            </div>
            <h2 class="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white mb-6">
              The <span class="text-[#70f3ff] drop-shadow-[0_0_25px_rgba(112,243,255,0.4)]">Diamond</span> Standard
            </h2>
            <p class="text-[var(--t-muted)] max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed font-medium">
              Explore the elite network of brands supporting Theta 2026. <br class="hidden sm:block" /> Click any tier to view full partner details.
            </p>
          </div>

          <div class="flex flex-wrap justify-center gap-6 sm:gap-8 relative z-10">
            {sponsorTiers
              .filter((tier) => (sponsors.value[tier.key as keyof SponsorsConfig] || []).some(s => s.isActive))
              .map((tier) => {
                const tierKey = tier.key as keyof SponsorsConfig;
                const activeSponsors = (sponsors.value[tierKey] || []).filter(s => s.isActive);
                const meta = sponsorTierMeta[tierKey];
                return (
                  <div
                    key={tier.key}
                    onClick$={() => { selectedTier.value = tierKey; }}
                    class="group relative cursor-pointer w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[calc(20%-1.6rem)] min-w-[280px] max-w-[340px] p-8 rounded-[2.5rem] border border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col justify-between min-h-[260px]"
                    style={{
                      background: meta.surface,
                      boxShadow: ` + '`0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px ${meta.glow}`' + `
                    }}
                  >
                    {/* Dynamic Hover Glow */}
                    <div
                      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: ` + '`radial-gradient(circle at top right, ${meta.accent}15, transparent 60%)`' + ` }}
                    />

                    <div class="relative z-10">
                      <span class="block text-[11px] uppercase font-black tracking-[0.25em] text-white mb-3 group-hover:text-white/80 transition-colors">
                        {meta.eyebrow}
                      </span>
                      <h3 class="text-4xl font-black uppercase tracking-tighter mb-2" style={{ color: meta.accent, textShadow: ` + '`0 0 20px ${meta.glow}`' + ` }}>
                        {tier.label}
                      </h3>
                      <div class="w-12 h-1 rounded-full transition-all duration-500 group-hover:w-20" style={{ background: meta.accent, boxShadow: ` + '`0 0 10px ${meta.accent}`' + ` }} />
                    </div>

                    <div class="relative z-10 flex items-center justify-between mt-10">
                      <div class="flex -space-x-3">
                        {activeSponsors.slice(0, 3).map((s: any, i: number) => (
                          <div key={i} class="w-10 h-10 rounded-full border-2 border-[#0a0f0a] bg-white flex items-center justify-center p-1.5 overflow-hidden shadow-xl transform transition-transform group-hover:scale-110" style={{ transitionDelay: ` + '`${i * 100}ms`' + ` }}>
                            <img src={s.logo} alt="" class="w-full h-full object-contain" loading="lazy" />
                          </div>
                        ))}
                        {activeSponsors.length > 3 && (
                          <div class="w-10 h-10 rounded-full border-2 border-[#0a0f0a] bg-[#1a251a] backdrop-blur-md flex items-center justify-center text-[11px] font-black text-white/80 shadow-xl group-hover:bg-[#2a3a2a] transition-colors">
                            +{activeSponsors.length - 3}
                          </div>
                        )}
                      </div>
                      <div class="flex items-center gap-2 group/btn">
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors duration-300">Explore</span>
                        <span class="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-xs group-hover:bg-white group-hover:text-black transition-all">→</span>
                      </div>
                    </div>

                    {/* Corner Circuit Decorative */}
                    <div class="absolute -bottom-2 -right-2 w-16 h-16 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none">
                      <svg viewBox="0 0 100 100" class="w-full h-full" style={{ fill: meta.accent }}>
                        <path d="M100,0 L100,100 L0,100 L0,95 L95,95 L95,0 Z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Modern Running Alliance Hall */}
          <div class="mt-12 relative z-10 w-full text-center">
            <div class="mb-8 px-4">
              <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#0ea935]/20 bg-[#0ea935]/5 backdrop-blur-md mb-6 hover:border-[#0ea935]/40 transition-all cursor-default">
                <span class="w-2 h-2 rounded-full bg-[#0ea935] shadow-[0_0_10px_#0ea935]" />
                <span class="text-[10px] font-black uppercase tracking-[0.4em] text-[#0ea935]">Alliance Network</span>
              </div>
              <h3 class="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">
                Partner <span class="bg-gradient-to-r from-[#70f3ff] to-[#0ea935] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(112,243,255,0.2)]">Spectrum</span> 2026
              </h3>
            </div>

            <div class="t-marquee-wrap-full relative select-none overflow-hidden">
              {/* Cinema Gradient Masks - Subtle Fades */}
              <div class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/40 to-transparent z-20 pointer-events-none" />
              <div class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/40 to-transparent z-20 pointer-events-none" />

              <div data-marquee-track class="t-marquee-track flex animate-left py-8" style="will-change: transform;">
                {[...marqueeSponsors, ...marqueeSponsors].map((sponsor, index) => (
                  <article
                    key={` + '`${sponsor.tierKey}-${sponsor.name}-${index}`' + `}
                    class="group relative mx-6 flex-shrink-0 flex w-[260px] flex-col items-center justify-center transition-all duration-700"
                  >
                    {/* Floating Background Glow */}
                    <div class="absolute -inset-4 bg-[#70f3ff]/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-700" />

                    <div class="relative w-full bg-[#0a0f0a]/40 border border-white/5 backdrop-blur-2xl rounded-[2.25rem] p-6 shadow-2xl transition-all duration-500 group-hover:bg-[#101510]/60 group-hover:border-white/20 hover:-translate-y-3">
                      {sponsor.isActive && (
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-[#ff4d4f]/30 bg-[#ff4d4f] px-4 py-1.5 text-[0.55rem] font-black tracking-widest text-black uppercase shadow-[0_0_25px_rgba(255,77,79,0.35)]">
                          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-black"></span>
                          Active
                        </div>
                      )}

                      <div class="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl bg-white/95 p-5 shadow-2xl transform transition-all duration-700 group-hover:scale-[1.08] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          loading="lazy"
                          class="h-full w-full object-contain mix-blend-multiply"
                        />
                        {/* Glassy Overlay on Logo */}
                        <div class="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
                      </div>

                      <div class="mt-6 text-center">
                        <p class="text-[0.65rem] font-black tracking-[0.3em] text-white uppercase transition-all duration-500 group-hover:tracking-[0.4em]">
                          {sponsor.name}
                        </p>
                        <div class="mx-auto mt-2 h-0.5 w-0 bg-[#0ea935] transition-all duration-500 group-hover:w-12 group-hover:shadow-[0_0_10px_#0ea935]" />
                      </div>
                    </div>

                    {/* Side Decorative Numbers */}
                    <span class="absolute -right-2 top-8 text-[4rem] font-black italic text-white/[0.02] pointer-events-none select-none transition-colors group-hover:text-white/[0.05]">
                      {String((index % marqueeSponsors.length) + 1).padStart(2, '0')}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════ SECTOR DIVIDER: SPONSORS TO CTA ═══════════════ */}
      <div class="relative w-full h-px bg-gradient-to-r from-transparent via-[#0ea935]/30 to-transparent mt-12 sm:mt-20">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1 rounded-full border border-[#0ea935]/20 bg-black backdrop-blur-md text-[9px] font-black uppercase tracking-[0.4em] text-[#0ea935] shadow-[0_0_15px_rgba(14,169,53,0.1)]">
          Strategic Network Hub
        </div>
      </div>

      {/* ═══════════════ NEW BROWSE EVENTS CTA ═══════════════ */}
      <section id="browse-events-section" class="relative w-full min-h-[60vh] flex flex-col justify-between overflow-hidden bg-[#050508] px-6 py-12 sm:px-12 sm:py-16 lg:px-24 border-t border-[#0ea935]/10 mt-6 overflow-hidden">
        {/* Background Image */}
        <img src="/backgrounds/sastra-2.jpeg" alt="Sastra Background" class="browse-events-bg absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80" loading="lazy" />

        {/* Slightly Dark Overlay */}
        <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#050508]/90 via-[#050508]/60 to-[#050508]/90"></div>

        {/* Radial glow to make it look premium before the image is added */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#0ea935] blur-[150px] rounded-full opacity-[0.03] pointer-events-none z-0"></div>

        {/* Content Container */}
        <div class="relative z-10 w-full max-w-[100rem] mx-auto h-full flex flex-col justify-between flex-1">

          {/* Eyebrow */}
          <div class="browse-events-eyebrow mb-16 sm:mb-24">
            <span class="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-white/50">
              POWERED BY THETA 2026
            </span>
          </div>

          {/* Big Typography */}
          <div class="flex flex-col mb-auto relative w-full" style="perspective: 1000px;">
            <h2 class="text-[clamp(5rem,14vw,15rem)] leading-[0.85] font-black tracking-tighter sm:tracking-tight text-white uppercase mix-blend-screen">
              <span class="browse-events-title-1 block text-left text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
                BROWSE<span class="text-[#0ea935] opacity-80">+</span>
              </span>
              <span class="browse-events-title-2 block text-right sm:text-left sm:ml-[10vw] mt-2 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-br from-white/40 via-white/90 to-white">
                <span class="text-[#0ea935] opacity-80">+</span>EVENTS
              </span>
            </h2>

            {/* Explore Button */}
            <div class="browse-events-btn mt-12 sm:mt-16 sm:ml-[10vw] w-fit">
              <Link href="/events" class="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-[#0ea935] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(14,169,53,0.4)] group">
                Explore Now
                <svg class="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Bottom Row - Paragraph on Right */}
          <div class="browse-events-desc flex justify-end mt-20 sm:mt-24 w-full">
            <p class="max-w-[280px] sm:max-w-sm text-right text-xs sm:text-sm leading-[1.8] text-[#8ca38c] font-medium">
              We transform ideas into fully-realized festival experiences — from intense challenges and showcases to campus-wide showdowns — creating an atmosphere that elevates the entire student collective.
            </p>
          </div>

        </div>
      </section>

      {/* ═══════════════ MODALS ═══════════════ */}
      {selectedDay.value && (
        <div class="t-modal-backdrop flex items-center justify-center p-4">
          <div class="absolute inset-0" onClick$={closeDay} />
          <div class="t-modal w-full max-w-lg relative z-10 bg-[#050a05]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
            <div class="flex justify-between items-start mb-8">
              <div><h3 class="text-3xl text-white font-black">{selectedDay.value.day}</h3><p class="text-[var(--t-muted)] mt-1">{selectedDay.value.date}</p></div>
              <button onClick$={closeDay} class="text-white/40 hover:text-white transition-colors">✕</button>
            </div>
            <div class="space-y-4">
              {getDayEvents(selectedDay.value.day).map(e => (
                <div key={e.id} class="p-4 rounded-xl border border-white/5 bg-white/5">
                  <h4 class="text-white font-bold">{e.name}</h4>
                  <p class="text-xs text-[var(--t-muted)] mt-1">{e.timing} · {e.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTier.value && (() => {
        const tier = sponsorTiers.find(t => t.key === selectedTier.value);
        if (!tier) return null;
        const items = (sponsors.value[tier.key] || []).filter(s => s.isActive);
        return (
          <div class="t-modal-backdrop flex items-center justify-center p-4">
            <div class="absolute inset-0" onClick$={closeTier} />
            <div
              class="t-modal w-full max-w-3xl bg-[#050a05]/95 border rounded-3xl p-10 relative overflow-hidden"
              style={{
                boxShadow: ` + '`0 0 100px ${sponsorTierMeta[tier.key].glow}, inset 0 0 30px ${sponsorTierMeta[tier.key].glow}`' + `,
                borderColor: ` + '`${sponsorTierMeta[tier.key].accent}44`' + `
              }}
            >
              <div class="flex justify-between items-center mb-8 relative z-10">
                <h3 class="text-3xl font-black uppercase tracking-tighter" style={{ color: sponsorTierMeta[tier.key].accent }}>
                  {tier.label} Partners
                </h3>
                <button onClick$={closeTier} class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black transition-all">✕</button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                {items.map((s, i) => (
                  <div
                    key={i}
                    class="t-sponsor-card p-6 flex flex-col items-center justify-center min-h-[140px] rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group/item"
                    style={{ borderColor: ` + '`${sponsorTierMeta[tier.key].accent}22`' + ` }}
                  >
                    <div class="flex h-16 w-full items-center justify-center overflow-hidden rounded-xl bg-white/95 p-3 group-hover/item:bg-white transition-colors">
                      <img src={s.logo} alt={s.name} class="h-full w-full object-contain" loading="lazy" />
                    </div>
                    <p class="mt-4 text-[10px] text-white/30 uppercase font-black tracking-widest group-hover/item:text-white transition-colors text-center">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Theta 2026 | National Level Techno-Management Fest",
  meta: [{ name: "description", content: "Theta 2026 is SASTRA\"s premier national level techno-management fest. Explore hackathons, robotics, workshops, and more. March 15-17, 2026." }],
};
`;

const finalContent = startLines.join('\n') + '\n' + middleAndEnd;
writeFileSync(filePath, finalContent);
console.log('Restored successfully.');
