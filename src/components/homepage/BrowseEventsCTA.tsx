import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const BrowseEventsCTA = component$(() => {
  return (
    <section id="browse-events-section" class="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden bg-[#050508] px-6 py-12 sm:px-12 sm:py-24 lg:px-24 border-t border-[#0ea935]/10 mt-12 bg-cover bg-center" style="background-image: url('/backgrounds/sastra-2.jpeg')">
      <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/60 to-[#050508]/95"></div>
      
      <div class="relative z-10 w-full max-w-[100rem] mx-auto text-center sm:text-left">
        <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">POWERED BY THETA 2026</span>
        <h2 class="mt-8 text-[clamp(4rem,10vw,10rem)] leading-[0.85] font-black tracking-tighter text-white uppercase mix-blend-screen">
          <span class="block">BROWSE<span class="text-[#00ff55]">+</span></span>
          <span class="block mt-2 sm:mt-0 sm:ml-[10vw]"><span class="text-[#00ff55]">+</span>EVENTS</span>
        </h2>
        
        <div class="mt-12 sm:mt-16 sm:ml-[10vw]">
          <Link href="/events" class="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-[#00ff55] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(0,255,85,0.4)] group">
            Explore Now
            <svg class="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </div>
    </section>
  );
});
