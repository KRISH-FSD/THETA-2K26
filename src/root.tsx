import {
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export default component$(() => {
  const showLoader = useSignal(true);

  useVisibleTask$(({ cleanup }) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.documentElement.dataset.siteReady = "true";
      showLoader.value = false;
    };

    const minTimer = window.setTimeout(() => {
      if (document.readyState === "complete") {
        finish();
      }
    }, 500);

    const maxTimer = window.setTimeout(finish, 1800);
    const onLoad = () => {
      window.setTimeout(finish, 180);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    cleanup(() => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", onLoad);
    });
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
                  data-critical-media
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  class="relative h-20 w-auto object-contain [filter:brightness(0)_invert(1)] sm:h-24"
                />
              </div>
              <div class="space-y-2">
                <p class="text-xs font-black tracking-[0.35em] text-white/70 uppercase">
                  Theta 2026
                </p>
                <div class="flex items-center justify-center gap-2">
                  <span
                    class="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0ea935]"
                    style="animation-delay:0ms"
                  />
                  <span
                    class="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0ea935]"
                    style="animation-delay:180ms"
                  />
                  <span
                    class="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0ea935]"
                    style="animation-delay:360ms"
                  />
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
