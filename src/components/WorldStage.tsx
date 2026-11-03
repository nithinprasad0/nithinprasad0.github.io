import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { abandonWorld, detectSceneTier, markWorldReady, type SceneTier } from "../three/heroMotion";

// The whole 3D world is one lazily loaded chunk; the legend font is loaded with it.
const World = lazy(() =>
  Promise.all([
    import("../three/world/World"),
    document.fonts?.load("800 150px Inter").catch(() => undefined),
    document.fonts?.load('600 44px "Space Grotesk"').catch(() => undefined),
  ]).then(([mod]) => mod),
);

class WorldBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// After load + idle, so the 3D download never competes with first paint.
function whenIdleAfterLoad(cb: () => void) {
  let idleId: number | undefined;
  let timer: number | undefined;
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(cb, { timeout: 1500 });
    else timer = window.setTimeout(cb, 300);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}

/**
 * Fixed layer behind the page that hosts the scroll-driven world. Only
 * mounted when index.html chose the world (motion allowed, WebGL present,
 * not low-power); everything else keeps the static page and hero image.
 */
export function WorldStage() {
  const [tier, setTier] = useState<SceneTier>("static");
  const [load, setLoad] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const t = detectSceneTier();
    setTier(t);
    if (t === "static") return;
    return whenIdleAfterLoad(() => setLoad(true));
  }, []);

  if (tier === "static" || !load || failed) return null;

  const fail = () => {
    abandonWorld();
    setFailed(true);
  };

  return (
    <>
      <div aria-hidden="true" className="world-stage pointer-events-none fixed inset-0 z-0">
        <WorldBoundary onError={fail}>
          <Suspense fallback={null}>
            <World tier={tier} onReady={markWorldReady} onError={fail} />
          </Suspense>
        </WorldBoundary>
        <div className="world-atmo absolute inset-0" />
      </div>
      {/* Local negative space behind the text column; strength follows the
          world's section-aware calm value (see Rig in World.tsx). */}
      <div aria-hidden="true" className="world-scrim pointer-events-none fixed inset-0 z-0" />
    </>
  );
}
