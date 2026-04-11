import { component$, isDev, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import Lenis from "lenis";
import { getDevicePerfTier } from "./utils/perf";

import "./global.css";

export default component$(() => {
  const showLoader = useSignal(true);

  useVisibleTask$(({ cleanup }) => {
    const timer = window.setTimeout(() => {
      showLoader.value = false;
    }, 900);

    cleanup(() => window.clearTimeout(timer));
  });

  useVisibleTask$(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const perfTier = getDevicePerfTier();

    if (prefersReducedMotion || coarsePointer || perfTier !== "hi") {
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      syncTouch: false,
    });
    let frameId = 0;

    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  });

  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        {showLoader.value && (
          <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505] text-white transition-opacity duration-500">
            <div class="flex flex-col items-center gap-6 px-6 text-center">
              <div class="relative">
                <div class="absolute inset-0 rounded-full bg-[#0ea935]/20 blur-2xl" />
                <img
                  src="/theta-logo.webp"
                  alt="Theta"
                  class="relative h-20 w-auto object-contain [filter:brightness(0)_invert(1)] sm:h-24"
                />
              </div>
              <div class="space-y-2">
                <p class="text-xs font-black uppercase tracking-[0.35em] text-white/70">
                  Theta 2026
                </p>
                <div class="flex items-center justify-center gap-2">
                  <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0ea935]" style="animation-delay:0ms" />
                  <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0ea935]" style="animation-delay:180ms" />
                  <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0ea935]" style="animation-delay:360ms" />
                </div>
              </div>
            </div>
          </div>
        )}
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
