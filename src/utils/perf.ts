/**
 * THETA 2026 — Device Performance Tier Detection
 * ================================================
 * Replaces the simple boolean `isMobilePerfMode()` with a 3-tier system:
 *   "lo"  — Mobile / coarse-pointer / ≤4 CPU cores / prefers-reduced-motion
 *   "mid" — Normal desktop with integrated GPU (5–7 cores)
 *   "hi"  — High-end desktop with dedicated GPU (8+ cores)
 *
 * Applied as:  data-perf-tier="lo|mid|hi"  on <html>
 * Also sets:   data-mobile-perf="true|false" for backwards compat.
 */

import { useSignal, useVisibleTask$ } from "@builder.io/qwik";

export type PerfTier = "lo" | "mid" | "hi";

export const getDevicePerfTier = (): PerfTier => {
  if (typeof window === "undefined") return "hi";

  // Respect user's explicit motion preference — always lo
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return "lo";

  const cores =
    typeof navigator !== "undefined" &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency > 0
      ? navigator.hardwareConcurrency
      : 4;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 900px)").matches;

  // Lo: mobile/touch, narrow viewport, or ≤4 cores (typical budget/mid phones)
  if (coarse || narrow || cores <= 4) return "lo";

  // Mid: normal desktop with likely integrated GPU (5–7 cores)
  if (cores <= 7) return "mid";

  // Hi: 8+ cores = workstation / dedicated GPU
  return "hi";
};

/**
 * Apply perf tier to <html> element and return the active tier.
 * Call this once inside a useVisibleTask$() in layout.tsx.
 */
export const applyPerfTier = (): PerfTier => {
  const tier = getDevicePerfTier();
  document.documentElement.dataset.perfTier = tier;
  // Backwards compat: keep data-mobile-perf for existing CSS guards
  document.documentElement.dataset.mobilePerf = tier === "lo" ? "true" : "false";
  return tier;
};

/**
 * Listen for viewport/motion changes and re-apply tier dynamically.
 * Returns a cleanup function.
 */
export const watchPerfTier = (onChange?: (tier: PerfTier) => void): (() => void) => {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(pointer: coarse)"),
    window.matchMedia("(max-width: 900px)"),
  ];

  const recheck = () => {
    const tier = applyPerfTier();
    onChange?.(tier);
  };

  queries.forEach((q) => q.addEventListener("change", recheck));
  return () => queries.forEach((q) => q.removeEventListener("change", recheck));
};

export const usePerfTier = () => {
  const perfTier = useSignal<PerfTier>("hi");

  useVisibleTask$(({ cleanup }) => {
    perfTier.value = applyPerfTier();
    const stopWatching = watchPerfTier((tier) => {
      perfTier.value = tier;
    });

    cleanup(() => {
      stopWatching();
    });
  });

  return perfTier;
};
