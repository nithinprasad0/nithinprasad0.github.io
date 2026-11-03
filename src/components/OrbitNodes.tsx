import { useEffect, useRef, useState } from "react";
import { about } from "../content/portfolio";
import { orbitFocus } from "../three/world/orbitFocus";

// The About orbit's three nodes as real controls. The 3D scene places each
// one on its node's screen position every frame (see AboutCore); this layer
// only exists while the scroll-driven world runs, so the static, reduced-motion
// and no-JS page (and its prerendered HTML) stay exactly as they were.
//
// - Mouse: hovering a node (or its label) lights its orbit and shows the
//   description; moving to another node hands over smoothly.
// - Touch: tapping a node shows it; tapping elsewhere clears it.
// - Keyboard: each node is a button in the tab order; focus shows it,
//   Escape clears it. The description is the button's accessible description.
export function OrbitNodes() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(-1);
  const pinned = useRef(-1);
  const leaveTimer = useRef<number | undefined>(undefined);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(document.documentElement.classList.contains("world"));
  }, []);

  const show = (i: number) => {
    window.clearTimeout(leaveTimer.current);
    // A tap keeps its node open until dismissed; moving to another node releases it.
    if (pinned.current !== i) pinned.current = -1;
    orbitFocus.active = i;
    setActive(i);
  };
  const clear = () => {
    pinned.current = -1;
    show(-1);
  };

  useEffect(() => {
    if (!enabled) return;
    orbitFocus.layer = layer.current;
    // A tap anywhere else, or the orbit leaving the screen, clears the focus.
    const onDown = (e: PointerEvent) => {
      if (orbitFocus.active >= 0 && !layer.current?.contains(e.target as Node)) clear();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && orbitFocus.active >= 0) clear();
    };
    const onHidden = () => clear();
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("orbit:hidden", onHidden);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("orbit:hidden", onHidden);
      window.clearTimeout(leaveTimer.current);
      orbitFocus.layer = null;
      orbitFocus.anchors = [];
      orbitFocus.active = -1;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    // Inert until the scene shows the orbit (the 3D scene toggles it).
    <div ref={layer} className="orbit-layer" role="group" aria-label="Focus areas" inert>
      {about.areas.map((area, i) => (
        <div
          key={area.id}
          ref={(el) => {
            orbitFocus.anchors[i] = el;
          }}
          className="orbit-anchor"
          data-side="right"
          data-tone={area.id}
          data-active={active === i ? "" : undefined}
          onPointerEnter={(e) => e.pointerType === "mouse" && show(i)}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse" || pinned.current === i) return;
            // A short grace period: moving between nodes hands over without a flicker.
            leaveTimer.current = window.setTimeout(() => {
              if (orbitFocus.active === i && pinned.current < 0) show(-1);
            }, 140);
          }}
        >
          <button
            type="button"
            className="orbit-node"
            aria-describedby={`orbit-${area.id}`}
            onFocus={() => show(i)}
            onBlur={() => pinned.current !== i && orbitFocus.active === i && show(-1)}
            onClick={() => {
              if (pinned.current === i) return clear();
              show(i);
              pinned.current = i;
            }}
          >
            <span aria-hidden="true" className="orbit-hit" />
            <span className="orbit-name">{area.label}</span>
          </button>
          <p id={`orbit-${area.id}`} className="orbit-desc">
            {area.description}
          </p>
        </div>
      ))}
    </div>
  );
}
