interface RoadmapScrollState {
  isCompact: boolean;
}

interface RoadmapTimelineOptions {
  pageSelector: string;
  timelineId?: string;
  mobileBreakpoint?: number;
}

type Cleanup = () => void;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const initRoadmapScrollState = (
  pageSelector: string,
  updateStyles: (page: HTMLElement, scrollRatio: number, state: RoadmapScrollState) => void,
): Cleanup | void => {
  const page = document.querySelector(pageSelector) as HTMLElement | null;
  if (!page) return;

  let rafId = 0;
  const computeCompact = () => window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 767;

  const render = () => {
    rafId = 0;
    const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollRatio = clamp(window.scrollY / scrollMax);
    updateStyles(page, scrollRatio, { isCompact: computeCompact() });
  };

  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.visualViewport?.addEventListener("resize", schedule, { passive: true });
  render();

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.visualViewport?.removeEventListener("resize", schedule);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  };
};

export const initRoadmapTimeline = ({
  pageSelector,
  timelineId = "rm-timeline",
  mobileBreakpoint = 767,
}: RoadmapTimelineOptions): Cleanup | void => {
  const pageRoot = document.querySelector(pageSelector) as HTMLElement | null;
  const container = document.getElementById(timelineId) as HTMLElement | null;
  const svgEl = document.getElementById("rm-line-svg") as SVGSVGElement | null;
  const pathBase = document.getElementById("rm-line-base") as SVGPathElement | null;
  const pathAccent = document.getElementById("rm-line-accent") as SVGPathElement | null;
  const pathGlow = document.getElementById("rm-line-glow") as SVGPathElement | null;
  const tracer = document.getElementById("rm-tracer") as SVGGElement | null;

  if (!pageRoot || !container || !svgEl || !pathBase || !pathAccent || !pathGlow) return;

  const rows = Array.from(container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final)"));
  const rowCards = rows
    .map((row) => row.querySelector<HTMLElement>(".rm-card"))
    .filter((card): card is HTMLElement => card !== null);
  const finalRow = container.querySelector(".rm-row--final") as HTMLElement | null;
  const finalNode = finalRow?.querySelector(".rm-node--finish") as HTMLElement | null;
  const linePaths = [pathBase, pathAccent, pathGlow];
  const imageLoadListeners: Array<{ img: HTMLImageElement; listener: () => void }> = [];
  const lateRebuildTimers: number[] = [];

  let resizeObserver: ResizeObserver | undefined;
  let cardObserver: IntersectionObserver | undefined;
  let nodes: HTMLElement[] = [];
  let totalLen = 0;
  let buildRafId = 0;
  let renderRafId = 0;
  let scheduled = false;
  let needsBuild = true;
  let targetProg = 0;
  let renderProg = 0;
  let currentRowIndex = -1;
  let litNodeIndex = -1;
  let endReachedState = false;
  let smoothFactor = 0.24;
  let settleEpsilon = 0.0018;
  let tracerLead = 18;
  let showTracer = true;
  let useGlow = true;

  const updateMode = () => {
    const isLiteMode =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= mobileBreakpoint;
    pageRoot.dataset.roadmapMode = isLiteMode ? "lite" : "full";
    smoothFactor = isLiteMode ? 1 : 0.26;
    settleEpsilon = isLiteMode ? 0.01 : 0.0018;
    tracerLead = isLiteMode ? 0 : 18;
    showTracer = !isLiteMode;
    useGlow = !isLiteMode;
    pathGlow.style.display = useGlow ? "" : "none";
    tracer?.style.setProperty("display", showTracer ? "" : "none");
  };

  const getVisibleNodes = () =>
    Array.from(
      container.querySelectorAll<HTMLElement>(".rm-row:not(.rm-row--final) .rm-node, .rm-node--finish"),
    ).filter((node) => node.getClientRects().length > 0 && node.offsetWidth > 0 && node.offsetHeight > 0);

  const buildPath = (): boolean => {
    nodes = getVisibleNodes();
    if (nodes.length < 2) return false;

    const containerRect = container.getBoundingClientRect();
    const width = Math.max(Math.ceil(container.clientWidth), 1);
    const height = Math.max(Math.ceil(container.scrollHeight), Math.ceil(container.clientHeight), 1);
    const points = nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      };
    });

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let index = 1; index < points.length; index += 1) {
      const prev = points[index - 1];
      const current = points[index];
      const dy = current.y - prev.y;
      const bend = Math.max(56, dy * 0.4);
      d += ` C ${prev.x.toFixed(1)} ${(prev.y + bend).toFixed(1)}, ${current.x.toFixed(1)} ${(current.y - bend).toFixed(1)}, ${current.x.toFixed(1)} ${current.y.toFixed(1)}`;
    }

    svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgEl.setAttribute("width", String(width));
    svgEl.setAttribute("height", String(height));
    linePaths.forEach((path) => path.setAttribute("d", d));

    totalLen = pathBase.getTotalLength();
    linePaths.forEach((path) => {
      path.style.strokeDasharray = String(totalLen);
      path.style.strokeDashoffset = String(totalLen);
    });

    currentRowIndex = -1;
    litNodeIndex = -1;
    endReachedState = false;
    return true;
  };

  const positionTracer = (progress: number) => {
    if (!tracer || totalLen === 0 || !showTracer) return;

    const clamped = clamp(progress);
    const offset = clamped * totalLen;
    const point = pathBase.getPointAtLength(offset);
    const nextPoint = pathBase.getPointAtLength(Math.min(totalLen, offset + tracerLead));
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

    tracer.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)},${point.y.toFixed(2)}) rotate(${angle.toFixed(1)})`,
    );
    tracer.style.opacity = clamped >= 0.995 ? "0" : "1";
  };

  const applyProgress = (progress: number) => {
    if (!nodes.length || totalLen === 0) return;

    const clamped = clamp(progress);
    const nextRowIndex = rows.length
      ? Math.min(rows.length - 1, Math.max(0, Math.floor(clamped * rows.length)))
      : -1;

    if (nextRowIndex !== currentRowIndex) {
      rows.forEach((row, index) => {
        row.classList.toggle("is-current", index === nextRowIndex);
        row.classList.toggle("is-passed", nextRowIndex > -1 && index < nextRowIndex);
      });
      currentRowIndex = nextRowIndex;
    }

    const maxNodeIndex = Math.max(nodes.length - 1, 1);
    const nextLitNodeIndex = Math.min(nodes.length - 1, Math.floor(clamped * maxNodeIndex + 0.02));
    if (nextLitNodeIndex !== litNodeIndex) {
      nodes.forEach((node, index) => {
        node.classList.toggle("rm-node--lit", index <= nextLitNodeIndex);
      });
      litNodeIndex = nextLitNodeIndex;
    }

    const offset = totalLen * (1 - clamped);
    pathBase.style.strokeDashoffset = String(offset);
    pathAccent.style.strokeDashoffset = String(Math.max(0, offset - 26));
    if (useGlow) {
      pathGlow.style.strokeDashoffset = String(offset);
    }
    positionTracer(clamped);

    const endReached = clamped >= 0.995;
    if (endReached !== endReachedState) {
      pageRoot.classList.toggle("is-end-reached", endReached);
      finalRow?.classList.toggle("is-end-reached", endReached);
      finalNode?.classList.toggle("rm-node--lit", endReached);
      endReachedState = endReached;
    }
  };

  const render = () => {
    renderRafId = 0;
    if (totalLen === 0 || nodes.length < 2) return;

    renderProg += (targetProg - renderProg) * smoothFactor;
    if (Math.abs(targetProg - renderProg) < settleEpsilon) {
      renderProg = targetProg;
    }

    applyProgress(renderProg);

    if (Math.abs(targetProg - renderProg) >= settleEpsilon) {
      renderRafId = window.requestAnimationFrame(render);
    }
  };

  const queueRender = () => {
    if (renderRafId) return;
    renderRafId = window.requestAnimationFrame(render);
  };

  const updateTargetProgress = () => {
    if (nodes.length < 2 || totalLen === 0) return;

    const firstRect = nodes[0].getBoundingClientRect();
    const lastRect = nodes[nodes.length - 1].getBoundingClientRect();
    const startY = firstRect.top + firstRect.height / 2;
    const endY = lastRect.top + lastRect.height / 2;
    const viewportTarget = window.innerHeight * 0.55;
    const span = Math.max(endY - startY, 1);
    targetProg = clamp((viewportTarget - startY) / span);

    if (!renderRafId && Math.abs(targetProg - renderProg) < settleEpsilon) {
      renderProg = targetProg;
      applyProgress(renderProg);
      return;
    }

    queueRender();
  };

  const flush = () => {
    scheduled = false;
    updateMode();
    if (needsBuild) {
      needsBuild = !buildPath();
    }
    if (!needsBuild) {
      updateTargetProgress();
    }
  };

  const schedule = (rebuild = false) => {
    needsBuild = needsBuild || rebuild;
    if (scheduled) return;
    scheduled = true;
    buildRafId = window.requestAnimationFrame(flush);
  };

  if ("IntersectionObserver" in window) {
    cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-revealed");
          cardObserver?.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    rowCards.forEach((card) => cardObserver?.observe(card));
  } else {
    rowCards.forEach((card) => card.classList.add("is-revealed"));
  }

  Array.from(container.querySelectorAll<HTMLImageElement>("img")).forEach((img) => {
    if (img.complete) return;
    const listener = () => schedule(true);
    img.addEventListener("load", listener, { passive: true });
    imageLoadListeners.push({ img, listener });
  });

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => schedule(true));
    resizeObserver.observe(container);
  }

  const onScroll = () => schedule(false);
  const onResize = () => schedule(true);
  const onLoad = () => schedule(true);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onLoad, { passive: true });
  window.visualViewport?.addEventListener("resize", onResize, { passive: true });

  [80, 220, 520, 1000].forEach((delay) => {
    lateRebuildTimers.push(window.setTimeout(() => schedule(true), delay));
  });

  schedule(true);

  return () => {
    if (buildRafId) {
      window.cancelAnimationFrame(buildRafId);
    }
    if (renderRafId) {
      window.cancelAnimationFrame(renderRafId);
    }

    resizeObserver?.disconnect();
    cardObserver?.disconnect();
    lateRebuildTimers.forEach((timer) => window.clearTimeout(timer));
    imageLoadListeners.forEach(({ img, listener }) => img.removeEventListener("load", listener));

    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", onLoad);
    window.visualViewport?.removeEventListener("resize", onResize);
  };
};
